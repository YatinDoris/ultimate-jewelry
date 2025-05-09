const axios = require("axios");
const message = require("../utils/messages");
const dotenv = require("dotenv");
const { getNonCustomizedProducts } = require("../helpers/common");
const { orderService } = require("../services");
const { updateProductQty } = require("../services/product");
dotenv.config();

const base = process.env.PAYPAL_API_URL;

/**
 * This API is used to create a PayPal order.
 */
const createPaypalOrder = async (req, res) => {
    const { orderId, value, currency = 'USD' } = req.body;
    try {
        if (!orderId) {
            return res.status(400).json({
                status: 400,
                message: message.custom("orderId not found"),
            });
        }
        if (!value) {
            // Remove order from database and update product qty for non-customized products
            deleteOrderAndUpdateProductQty({ orderId })
            return res.status(400).json({
                status: 400,
                message: message.custom("amount not found"),
            });
        }

        // Step 1: Get access token
        const authResponse = await axios.post(`${base}/v1/oauth2/token`, "grant_type=client_credentials", {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(
                    `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_APP_SECRET}`
                ).toString("base64")}`,
            },
        });

        const { access_token } = authResponse.data;
        if (!access_token) {
            // Remove order from database and update product qty for non-customized products
            deleteOrderAndUpdateProductQty({ orderId })
            return res.status(400).json({
                status: 400,
                message: message.custom("Failed to get PayPal access token"),
            });
        }

        // Step 2: Create order
        const paypalOrderResponse = await axios.post(
            `${base}/v2/checkout/orders`,
            {
                intent: "CAPTURE",
                purchase_units: [
                    {
                        reference_id: orderId,
                        amount: {
                            currency_code: currency,
                            value: value,
                        },
                    },
                ],
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );

        return res.status(200).json({
            status: 200,
            message: message.SUCCESS,
            paypalOrderData: paypalOrderResponse.data,
        });
    } catch (e) {
        // Remove order from database and update product qty for non-customized products
        deleteOrderAndUpdateProductQty({ orderId })
        console.error("Error creating PayPal order:", e?.message);
        return res.status(500).json({
            status: 500,
            message: e?.message || "Failed to create order",
        });
    }
};

const deleteOrderAndUpdateProductQty = async ({ orderId }) => {
    const findPattern = {
        orderId: orderId,
    };
    const orderData = await orderService.findOne(findPattern);
    await orderService.deleteOne(findPattern);
    const nonCustomizedProducts = getNonCustomizedProducts(orderData?.products);
    await updateProductQty(nonCustomizedProducts);
}

/**
 * This API is used to capture a PayPal order.
 */
const capturePaypalOrder = async (req, res) => {
    try {
        const { paypalOrderId } = req.body;

        if (!paypalOrderId) {
            return res.status(400).json({
                error: "Missing paypalOrderId parameter",
                status: 400,
            });
        }

        // Step 1: Get access token from PayPal
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

        const { access_token } = authResponse.data;
        if (!access_token) {
            return res.status(400).json({
                status: 400,
                message: message.custom("Failed to get PayPal access token"),
            });
        }

        // Step 2: Capture the order

        const paypalOrderCaptureResponse = await fetch(`${base}/v2/checkout/orders/${paypalOrderId}/capture`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
        });
        const paypalOrderCaptureResult = await paypalOrderCaptureResponse.json();

        return res.status(200).json({
            message: message.SUCCESS,
            status: 200,
            paypalOrderCaptureResult
        });

    } catch (e) {
        console.log("Error capturing PayPal order:", e?.message);
        return res.status(500).json({
            status: 500,
            message: e?.message || "Failed to capture order",
        });
    }
};

module.exports = {
    createPaypalOrder,
    capturePaypalOrder,
};
