const axios = require("axios");
const message = require("../utils/messages");
const dotenv = require("dotenv");
dotenv.config();

const base = process.env.PAYPAL_API_URL;

/**
 * This API is used to create a PayPal order.
 */
const createPaypalOrder = async (req, res) => {
    try {
        const { orderId, value, currency = 'USD' } = req.body;
        if (!orderId || !value) {
            return res.status(400).json({
                status: 400,
                message: message.INVALID_DATA,
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
        if (!access_token) throw new Error("Failed to get PayPal access token");

        // Step 2: Create order
        const orderResponse = await axios.post(
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
            order: orderResponse.data,
        });
    } catch (e) {
        console.error("Error creating PayPal order:", e?.message);
        return res.status(500).json({
            error: e.message || "Failed to create order",
        });
    }
};

/**
 * This API is used to capture a PayPal order.
 */
const capturePaypalOrder = async (req, res) => {
    try {
        const { paypalOrderID } = req.body;

        if (!paypalOrderID) {
            return res.status(400).json({
                error: "Missing paypalOrderID parameter",
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
        if (!access_token) throw new Error("Failed to get PayPal access token");

        // Step 2: Capture the order

        const captureResponse = await fetch(`${base}/v2/checkout/orders/${paypalOrderID}/capture`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access_token}`,
            },
        });
        const captureResult = await captureResponse.json();

        return res.status(200).json({
            status: captureResult.status,
            paypalOrderID: captureResult.id,
            payerId: captureResult.payer?.payer_id,
            details: captureResult.purchase_units,
        });

    } catch (e) {
        console.log("Error capturing PayPal order:", e?.message);
        return res.status(500).json({
            error: e.message || "Failed to capture order",
        });
    }
};

module.exports = {
    createPaypalOrder,
    capturePaypalOrder,
};
