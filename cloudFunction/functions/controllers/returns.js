const {
  returnService,
  userService,
  orderService,
} = require("../services/index");
const sanitizeValue = require("../helpers/sanitizeParams");
const message = require("../utils/messages");
const { getMailTemplateForReturnStatus } = require("../utils/template");
const { sendMail } = require("../helpers/mail");
const dotenv = require("dotenv");
const { getCurrentDate } = require("../helpers/common");

dotenv.config();

/**
 * Utility to fetch email and userName from return data.
 * @param {Object} returnData - Return data object
 * @returns {Promise<{email: string, userName: string}>} - Email and user name
 */
const getUserInfoFromReturn = async (returnData) => {
  let email = "";
  let userName = "";

  // Try to get from order details first
  const orderDetail = await orderService.findOne({
    orderId: returnData?.orderId,
  });
  if (orderDetail) {
    const { shippingAddress } = orderDetail;
    email = shippingAddress?.email || "";
    userName = shippingAddress?.name || "";
  }

  // Override with user data if available
  if (returnData?.userId) {
    const userData = await userService.findOne({ userId: returnData?.userId });
    if (userData) {
      email = userData?.email?.toLowerCase() || email;
      userName =
        `${userData?.firstName || ""} ${userData?.lastName || ""}`.trim() ||
        userName;
    }
  }

  return { email, userName };
};

/**
 * This API is used for reject return by admin.
 */
const rejectReturn = async (req, res) => {
  try {
    let { returnId, adminNote } = req.body;
    // required
    returnId = sanitizeValue(returnId) ? returnId.trim() : null;
    adminNote = sanitizeValue(adminNote) ? adminNote.trim() : null;

    if (returnId && adminNote) {
      const findPattern = {
        returnId: returnId,
      };
      const returnData = await returnService.findOne(findPattern);
      if (returnData) {
        if (returnData.status === "rejected") {
          return res.json({
            status: 409,
            message: message.alreadyExist("return status"),
          });
        }

        if (
          returnData.returnPaymentStatus === "pending" &&
          returnData.status === "pending"
        ) {
          const updatePattern = {
            adminNote: adminNote,
            status: "rejected",
            updatedDate: getCurrentDate(),
          };
          await returnService.findOneAndUpdate(findPattern, updatePattern);

          const { email, userName } = await getUserInfoFromReturn(returnData);

          // send mail for return status
          sendReturnStatusEmail(
            email,
            userName,
            returnData.orderNumber,
            "rejected",
            adminNote,
            returnData.shippingLabel
          );
          return res.json({
            status: 200,
            message: message.custom(`Return has been rejected successfully`),
          });
        } else {
          return res.json({
            status: 409,
            message: message.custom(
              `You cannot reject return as the return payment status is ${returnData.returnPaymentStatus} and return status is ${returnData.status}`
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
 * This API is used for send return request by admin.
 */
const sendReturnStatusMailController = async (req, res) => {
  try {
    let { returnId } = req.body;
    // required
    returnId = sanitizeValue(returnId) ? returnId.trim() : null;

    if (returnId) {
      const findPattern = {
        returnId: returnId,
      };
      const returnData = await returnService.findOne(findPattern);
      if (returnData) {
        const { orderNumber, status, adminNote, shippingLabel } = returnData;

        const { email, userName } = await getUserInfoFromReturn(returnData);

        // send mail for return status
        sendReturnStatusEmail(
          email,
          userName,
          orderNumber,
          status,
          adminNote,
          shippingLabel
        );

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

const sendReturnStatusEmail = async (
  email,
  userName,
  orderNumber,
  status,
  adminNote,
  shippingLabel
) => {
  try {
    const { subject, description } = getMailTemplateForReturnStatus(
      userName,
      orderNumber,
      status,
      adminNote,
      shippingLabel
    );

    await sendMail(email, subject, description);
    return true;
  } catch (error) {
    return false;
  }
};

module.exports = {
  rejectReturn,
  sendReturnStatusMailController,
};
