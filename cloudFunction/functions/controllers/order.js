const {
  orderService,
  productService,
  cartService,
  stripeService,
} = require("../services/index");
const sanitizeValue = require("../helpers/sanitizeParams");
const message = require("../utils/messages");
const { updateProductQty } = require("../services/product");
const {
  getMailTemplateForOrderStatus,
  getMailTemplateForRefundStatus,
} = require("../utils/template");
const { sendMail } = require("../helpers/mail");
const { createOrder } = require("../controllers/stripe");
const {
  getCurrentDate,
  getNonCustomizedProducts,
} = require("../helpers/common");

/**
  This API is used for create order.
*/
const insertOrder = async (req, res) => {
  try {
    const userData = req?.userData;

    const allActiveProductsData = await productService.getAllActiveProducts();
    if (userData) {
      const findPattern = {
        key: "userId",
        value: userData?.id,
      };
      const userWiseCartData = await cartService.find(findPattern);
      req.body.userId = userData?.id;
      req.body.cartList = userWiseCartData;
    }

    const { createdOrder } = await createOrder(
      req.body,
      allActiveProductsData,
      res
    );
    if (createdOrder) {

      return res.json({
        status: 200,
        createdOrder,
        message: message.SUCCESS,
      });
    } else {
      return res.json({
        status: 500,
        message: message.SERVER_ERROR,
      });
    }
  } catch (e) {
    return res.json({
      status: 500,
      message: message.SERVER_ERROR,
    });
  }
};

/**
  This API is used for update payment status into order.
*/
const updatePaymentStatus = async (req, res) => {
  try {
    let { orderId, paymentStatus, cartIds } = req.body;
    // required
    orderId = sanitizeValue(orderId) ? orderId.trim() : null;
    paymentStatus = sanitizeValue(paymentStatus) ? paymentStatus.trim() : null;
    cartIds = Array.isArray(cartIds) ? cartIds : [];
    if (
      orderId &&
      paymentStatus &&
      [
        "pending",
        "success",
        "failed",
        "refunded",
        "pending_refund",
        "failed_refund",
        "cancelled_refund",
        "refund_initialization_failed",
      ].includes(paymentStatus)
    ) {
      const findPattern = {
        orderId: orderId,
      };
      const orderData = await orderService.findOne(findPattern);
      if (orderData) {
        if (orderData.paymentStatus === paymentStatus) {
          return res.json({
            status: 409,
            message: message.alreadyExist("payment status"),
          });
        }
        let updatePattern = {
          paymentStatus: paymentStatus,
          updatedDate: getCurrentDate(),
        };
        await orderService.findOneAndUpdate(findPattern, updatePattern);
        if (paymentStatus == "success") {
          // remove cart
          if (cartIds.length) {
            cartIds.map((cartId) => cartService.deleteOne({ cartId: cartId }));
          }
          // send mail for order status
          const { subject, description } = getMailTemplateForOrderStatus(
            orderData.shippingAddress.name,
            orderData.orderNumber,
            orderData.orderStatus
          );
          sendMail(orderData.shippingAddress.email, subject, description);
        }
        return res.json({
          status: 200,
          message: message.SUCCESS,
          data: { orderNumber: orderData.orderNumber },
        });
      } else {
        return res.json({
          status: 404,
          message: message.DATA_NOT_FOUND,
        });
      }
    } else {
      return res.json({
        status: 400,
        message: message.INVALID_DATA,
      });
    }
  } catch (e) {
    return res.json({
      status: 500,
      message: message.SERVER_ERROR,
    });
  }
};

/**
  This API is used for send pending order mail.
*/
const sendPendingOrderMail = async (req, res) => {
  try {
    let { orderId } = req.body;
    // required
    orderId = sanitizeValue(orderId) ? orderId.trim() : null;

    if (orderId) {
      const findPattern = {
        orderId: orderId,
      };
      const orderData = await orderService.findOne(findPattern);
      if (orderData) {
        if (orderData.paymentStatus === "pending") {
          // send mail for order status
          const { subject, description } = getMailTemplateForOrderStatus(
            orderData.shippingAddress.name,
            orderData.orderNumber,
            "pending"
          );
          sendMail(orderData.shippingAddress.email, subject, description);
          return res.json({
            status: 200,
            message: message.custom("Mail sent successfully for pending order"),
          });
        } else {
          return res.json({
            status: 404,
            message: message.custom("Please provide Pending Order"),
          });
        }
      } else {
        return res.json({
          status: 404,
          message: message.DATA_NOT_FOUND,
        });
      }
    } else {
      return res.json({
        status: 400,
        message: message.INVALID_DATA,
      });
    }
  } catch (e) {
    return res.json({
      status: 500,
      message: message.SERVER_ERROR,
    });
  }
};

/**
  This API is used for delete order.
*/
const deleteOrder = async (req, res) => {
  try {
    let { orderId } = req.params;
    orderId = sanitizeValue(orderId) ? orderId.trim() : null;
    if (orderId) {
      const findPattern = {
        orderId,
      };
      const orderData = await orderService.findOne(findPattern);
      if (orderData) {
        if (orderData.paymentStatus === "pending") {
          await orderService.deleteOne(findPattern);
          //  update product qty for non-customized products
          const nonCustomizedProducts = getNonCustomizedProducts(
            orderData.products
          );

          await updateProductQty(nonCustomizedProducts);
          const paymentIntent = await stripeService.cancelPaymentIntent(
            orderData.stripePaymentIntentId
          );
          return res.json({
            status: 200,
            message: message.deleteMessage("order"),
          });
        } else {
          return res.json({
            status: 400,
            message: message.custom(
              `You cannot delete order as the payment status is ${orderData.paymentStatus}`
            ),
          });
        }
      } else {
        return res.json({
          status: 404,
          message: message.notFound("order"),
        });
      }
    } else {
      return res.json({
        status: 400,
        message: message.invalid("id"),
      });
    }
  } catch (e) {
    return res.json({
      status: 500,
      message: message.SERVER_ERROR,
    });
  }
};

/**
  This API is used for update order status into order for admin.
*/
const updateOrderStatus = async (req, res) => {
  try {
    let { orderId, orderStatus, cancelReason, trackingNumber } = req.body;
    // required
    orderId = sanitizeValue(orderId) ? orderId.trim() : null;
    orderStatus = sanitizeValue(orderStatus) ? orderStatus.trim() : null;
    cancelReason = sanitizeValue(cancelReason) ? cancelReason.trim() : null;
    trackingNumber = sanitizeValue(trackingNumber)
      ? trackingNumber.trim()
      : null;

    if (
      orderId &&
      orderStatus &&
      ["pending", "confirmed", "shipped", "delivered"].includes(orderStatus)
    ) {
      const findPattern = {
        orderId: orderId,
      };
      const orderData = await orderService.findOne(findPattern);
      if (orderData) {
        if (orderData.orderStatus === orderStatus) {
          return res.json({
            status: 409,
            message: message.alreadyExist("order status"),
          });
        }
        let updatePattern = {
          orderStatus: orderStatus,
          updatedDate: getCurrentDate(),
        };
        if (orderStatus === "shipped") {
          if (trackingNumber) {
            updatePattern.trackingNumber = trackingNumber;
          } else {
            return res.json({
              status: 500,
              message: message.custom("tracking number required"),
            });
          }
        }
        if (!["shipped", "delivered"].includes(orderStatus)) {
          updatePattern.trackingNumber = "";
        }
        if (orderStatus === "delivered") {
          updatePattern.deliveryDate = Date.now();
        }
        await orderService.findOneAndUpdate(findPattern, updatePattern);
        // send mail for order status
        const { subject, description } = getMailTemplateForOrderStatus(
          orderData.shippingAddress.name,
          orderData.orderNumber,
          orderStatus
        );
        sendMail(orderData.shippingAddress.email, subject, description);
        return res.json({
          status: 200,
          message: message.SUCCESS,
        });
      } else {
        return res.json({
          status: 404,
          message: message.DATA_NOT_FOUND,
        });
      }
    } else {
      return res.json({
        status: 400,
        message: message.INVALID_DATA,
      });
    }
  } catch (e) {
    return res.json({
      status: 500,
      message: message.SERVER_ERROR,
    });
  }
};

/**
  This API is used for cancel order by admin and user.
*/
const cancelOrder = async (req, res) => {
  try {
    const userData = req.userData;
    let { orderId, cancelReason } = req.body;
    // required
    orderId = sanitizeValue(orderId) ? orderId.trim() : null;
    cancelReason = sanitizeValue(cancelReason) ? cancelReason.trim() : null;

    if (orderId && cancelReason) {
      const findPattern = {
        orderId: orderId,
      };
      const orderData = await orderService.findOne(findPattern);
      if (orderData) {
        if (orderData.orderStatus === "cancelled") {
          return res.json({
            status: 409,
            message: message.alreadyExist("order status"),
          });
        }

        if (
          orderData.paymentStatus === "success" &&
          ["pending", "confirmed"].includes(orderData.orderStatus)
        ) {
          const pIFindPattern = {
            paymentIntentId: orderData.stripePaymentIntentId,
            options: {
              expand: [
                "latest_charge.balance_transaction",
                "latest_charge.refunds",
              ],
            },
          };
          const paymentIntent = await stripeService.retrivePaymentIntent(
            pIFindPattern
          );
          if (!paymentIntent || paymentIntent.status !== "succeeded") {
            return res.json({
              status: 409,
              message: message.custom(
                `You cannot cancel order as the payment intent is not successful`
              ),
            });
          }
          const updatePattern = {
            cancelReason: cancelReason,
            cancelledBy: userData.id,
            orderStatus: "cancelled",
            updatedDate: getCurrentDate(),
          };
          await orderService.findOneAndUpdate(findPattern, updatePattern);
          setTimeout(() => {
            res.json({
              status: 200,
              message: message.custom(
                `Order has been cancelled and refund wil be initiated soon`
              ),
            });
          }, 5000); // 5 seconds
          // send mail for order status
          const { subject, description } = getMailTemplateForOrderStatus(
            orderData.shippingAddress.name,
            orderData.orderNumber,
            "cancelled"
          );
          sendMail(orderData.shippingAddress.email, subject, description);
          //  update product qty for non-customized products
          const nonCustomizedProducts = getNonCustomizedProducts(
            orderData.products
          );

          await updateProductQty(nonCustomizedProducts);

          // integrate refund functionality
          const refundPaymentParams = {
            paymentIntentId: paymentIntent.id,
            amountInCents: paymentIntent.amount,
          };
          stripeService
            .refundAmount(refundPaymentParams)
            .then((refundResponse) => {
              if (refundResponse && refundResponse?.status === "pending") {
                let orderUpdatePatternWithRefund = {
                  stripeRefundId: refundResponse.id,
                  paymentStatus: "pending_refund",
                  updatedDate: Date.now(),
                };
                orderService.findOneAndUpdate(
                  findPattern,
                  orderUpdatePatternWithRefund
                );
                // send mail for pending refund status
                const { subject, description } = getMailTemplateForRefundStatus(
                  orderData.shippingAddress.name,
                  orderData.orderNumber,
                  "pending_refund"
                );
                sendMail(orderData.shippingAddress.email, subject, description);
              }
            })
            .catch((e) => {
              const refundsList = paymentIntent?.latest_charge?.refunds?.data;
              if (
                !refundsList?.length ||
                refundsList?.filter((x) => x?.status === "canceled")?.length ===
                refundsList?.length
              ) {
                let orderUpdatePatternWithRefund = {
                  paymentStatus: "refund_initialization_failed",
                  stripeRefundFailureReason: e?.message,
                  updatedDate: getCurrentDate(),
                };
                orderService.findOneAndUpdate(
                  findPattern,
                  orderUpdatePatternWithRefund
                );
                // send mail for refund initialized failed status
                const { subject, description } = getMailTemplateForRefundStatus(
                  orderData.shippingAddress.name,
                  orderData.orderNumber,
                  "refund_initialization_failed"
                );
                sendMail(orderData.shippingAddress.email, subject, description);
              }
            });
        } else {
          return res.json({
            status: 409,
            message: message.custom(
              `You cannot cancel order as the payment status is ${orderData.paymentStatus} and order status is ${orderData.orderStatus}`
            ),
          });
        }
      } else {
        return res.json({
          status: 404,
          message: message.DATA_NOT_FOUND,
        });
      }
    } else {
      return res.json({
        status: 400,
        message: message.INVALID_DATA,
      });
    }
  } catch (e) {
    return res.json({
      status: 500,
      message: message.SERVER_ERROR,
    });
  }
};

/**
  This API is used for get all order.
*/
const getAllOrder = async (req, res) => {
  try {
    const userData = req.userData;
    orderService
      .getAll()
      .then((orderData) => {
        return res.json({
          status: 200,
          message: message.SUCCESS,
          data: orderData,
        });
      })
      .catch((e) => {
        return res.json({
          status: 500,
          message: message.SERVER_ERROR,
        });
      });
  } catch (e) {
    return res.json({
      status: 500,
      message: message.SERVER_ERROR,
    });
  }
};

module.exports = {
  insertOrder,
  updatePaymentStatus,
  deleteOrder,
  sendPendingOrderMail,
  updateOrderStatus,
  getAllOrder,
  cancelOrder,
};
