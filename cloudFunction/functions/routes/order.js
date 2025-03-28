const express = require("express");
const router = express.Router();
const {
  getAllOrder,
  insertOrder,
  updatePaymentStatus,
  sendPendingOrderMail,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
} = require("../controllers/order");
const {
  adminAuth,
  jwtAuth,
  allUsersAndAdminPageAuth,
  userAuth,
} = require("../middleware");
const { ordersPageId } = require("../utils/pagesList");

router.get(
  "/list",
  jwtAuth,
  allUsersAndAdminPageAuth(ordersPageId),
  getAllOrder
);
router.post("/insertOrder", jwtAuth, userAuth, insertOrder);
router.post("/updatePaymentStatus", jwtAuth, userAuth, updatePaymentStatus);
router.post(
  "/sendPendingOrderMail",
  jwtAuth,
  allUsersAndAdminPageAuth(ordersPageId),
  sendPendingOrderMail
);
router.post(
  "/updateOrderStatus",
  jwtAuth,
  adminAuth(ordersPageId),
  updateOrderStatus
);
router.post(
  "/cancelOrder",
  jwtAuth,
  allUsersAndAdminPageAuth(ordersPageId),
  cancelOrder
);
router.delete(
  "/:orderId",
  jwtAuth,
  allUsersAndAdminPageAuth(ordersPageId),
  deleteOrder
);

module.exports = router;
