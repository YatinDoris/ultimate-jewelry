const express = require("express");
const { optionalJwtAuth } = require("../middleware");
const {
  createPaypalOrder,
  capturePaypalOrder,
  getAccessToken,
} = require("../controllers/paypal");
const router = express.Router();

router.post("/create-paypal-order", optionalJwtAuth, createPaypalOrder);

router.post("/capture-order", optionalJwtAuth, capturePaypalOrder);

router.get("/access-token", optionalJwtAuth, getAccessToken);

module.exports = router;
