const express = require("express");
const router = express.Router();
const { validateAddress } = require("../controllers/address");
const { jwtAuth, userAuth } = require("../middleware");

router.post("/validateAddress", jwtAuth, userAuth, validateAddress);

module.exports = router;
