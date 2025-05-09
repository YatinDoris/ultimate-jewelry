const express = require("express");
const { optionalJwtAuth } = require("../middleware");
const { createPaypalOrder, capturePaypalOrder } = require("../controllers/paypal");
const router = express.Router();

router.post("/create-paypal-order", optionalJwtAuth, createPaypalOrder);

router.post("/capture-order", optionalJwtAuth, capturePaypalOrder);

module.exports = router;
