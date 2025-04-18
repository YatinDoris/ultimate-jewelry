const express = require("express");
const router = express.Router();
const {
  createPaymentIntent,
  cancelPaymentIntent,
  checkPaymentIntentStatus,
  stripeWebhook,
  refundPayment,
  refundPaymentForReturn,
} = require("../controllers/stripe");
const { jwtAuth, adminAuth, userAuth } = require("../middleware");
const { ordersPageId, returnsPageId } = require("../utils/pagesList");

router.post("/create-payment-intent", createPaymentIntent);
// router.post("/create-payment-intent", jwtAuth, userAuth, createPaymentIntent);
router.post("/check-payment-intent-status", checkPaymentIntentStatus);
router.post("/cancel-payment-intent", cancelPaymentIntent);
router.post("/refundPayment", jwtAuth, adminAuth(ordersPageId), refundPayment);
router.post(
  "/refundPaymentForReturn",
  jwtAuth,
  adminAuth(returnsPageId),
  refundPaymentForReturn
);
router.post("/webhook", stripeWebhook);
module.exports = router;
