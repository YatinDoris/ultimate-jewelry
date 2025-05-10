const axios = require("axios");
const message = require("../utils/messages");
const dotenv = require("dotenv");
const { getNonCustomizedProducts } = require("../helpers/common");
const { orderService } = require("../services");
const { updateProductQty } = require("../services/product");
dotenv.config();

const base = process.env.PAYPAL_API_URL;

// Utility function to get PayPal access token
const getPaypalAccessToken = async () => {
  try {
    const authResponse = await axios.post(
      `${base}/v1/oauth2/token`,
      "grant_type=client_credentials",
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(
            `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_APP_SECRET}`
          ).toString("base64")}`,
        },
      }
    );
    return authResponse?.data?.access_token;
  } catch (error) {
    throw new Error("Failed to get PayPal access token");
  }
};

// Utility function to handle order deletion and product quantity update
const deleteOrderAndUpdateProductQty = async ({ orderId }) => {
  const findPattern = { orderId };
  const orderData = await orderService.findOne(findPattern);
  await orderService.deleteOne(findPattern);
  const nonCustomizedProducts = getNonCustomizedProducts(orderData?.products);
  await updateProductQty(nonCustomizedProducts);
};

/**
 * API to get PayPal access token
 */
const getAccessToken = async (req, res) => {
  try {
    const access_token = await getPaypalAccessToken();
    return res.json({
      status: 200,
      message: message.SUCCESS,
      data: { access_token },
    });
  } catch (error) {
    console.error("Error getting PayPal access token:", error.message);
    return res.json({
      status: 400,
      message: message.custom(error?.message),
    });
  }
};

/**
 * API to create a PayPal order
 */
const createPaypalOrder = async (req, res) => {
  try {
    const { orderNumber } = req.body;
    if (!orderNumber) {
      return res.json({
        status: 400,
        message: message.custom("order number not found"),
      });
    }
    const orderData = await orderService.findByOrderNumber({ orderNumber });

    if (!orderData) {
      return res.json({
        status: 400,
        message: message.custom("Order not found"),
      });
    }

    try {
      const { orderNumber, total, shippingAddress } = orderData;
      const access_token = await getPaypalAccessToken();
      const bodyData = {
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: orderNumber,
            description: `Payment for Order Number ${orderNumber}`,
            shipping: {
              name: {
                full_name: shippingAddress?.name || "",
              },
              email_address: shippingAddress?.email || "",
              // phone_number: {
              //   country_code: shippingAddress?.country || "",
              //   national_number: shippingAddress?.mobile?.toString() || "",
              // },
              address: {
                address_line_1: shippingAddress?.address || "",
                address_line_2: shippingAddress?.apartment || "",
                admin_area_1: shippingAddress?.state || "",
                admin_area_2: shippingAddress?.city || "",
                postal_code: shippingAddress?.pinCode || "",
                country_code: shippingAddress?.country || "",
              },
            },
            amount: {
              currency_code: "USD",
              value: total?.toString(),
            },
          },
        ],
      };

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      };

      const paypalOrderResponse = await axios.post(
        `${base}/v2/checkout/orders`,
        bodyData,
        { headers }
      );

      if (paypalOrderResponse?.data) {
        return res.json({
          status: 200,
          message: message.SUCCESS,
          paypalOrderData: paypalOrderResponse?.data,
        });
      } else {
        deleteOrderAndUpdateProductQty({ orderId: orderData?.id });
        return res.json({
          status: 200,
          message: message.SUCCESS,
          paypalOrderData: paypalOrderResponse?.data,
        });
      }
    } catch (error) {
      deleteOrderAndUpdateProductQty({ orderId: orderData?.id });
      console.error("Error creating PayPal order:", error?.message);
      return res.json({
        status: 500,
        message: error.message || "Failed to create order",
      });
    }
  } catch (error) {
    return res.json({
      status: 500,
      message: error.message || "Failed to create order",
    });
  }
};

/**
 * API to capture a PayPal order
 */
const capturePaypalOrder = async (req, res) => {
  try {
    const { paypalOrderId } = req.body;

    if (!paypalOrderId) {
      return res.json({
        message: message.custom("Missing paypalOrderId parameter"),
        status: 400,
      });
    }

    const access_token = await getPaypalAccessToken();

    const paypalOrderCaptureResponse = await fetch(
      `${base}/v2/checkout/orders/${paypalOrderId}/capture`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access_token}`,
        },
      }
    );
    const paypalOrderCaptureResult = await paypalOrderCaptureResponse.json();

    return res.json({
      status: 200,
      message: message.SUCCESS,
      paypalOrderCaptureResult,
    });
  } catch (error) {
    console.error("Error capturing PayPal order:", error.message);
    return res.json({
      status: 500,
      message: error.message || "Failed to capture order",
    });
  }
};

module.exports = {
  getAccessToken,
  createPaypalOrder,
  capturePaypalOrder,
};
