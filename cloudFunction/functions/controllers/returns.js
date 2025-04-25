const { returnService, userService } = require("../services/index");
const sanitizeValue = require("../helpers/sanitizeParams");
const message = require("../utils/messages");
const { getMailTemplateForReturnStatus } = require("../utils/template");
const { sendMail } = require("../helpers/mail");
const dotenv = require("dotenv");
const { getCurrentDate } = require("../helpers/common");
dotenv.config();

/**
  This API is used for reject return by admin.
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
          // send mail for return status
          sendReturnStatusEmail(
            returnData.userId,
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
  This API is used for send return request by admin.
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
        const { userId, orderNumber, status, adminNote, shippingLabel } =
          returnData;

        // send mail for return status
        await sendReturnStatusEmail(
          userId,
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
  userId,
  orderNumber,
  status,
  adminNote,
  shippingLabel
) => {
  try {
    const userData = await userService.findOne({
      userId: userId,
    });
    if (userData?.email) {
      const userName = `${userData.firstName} ${userData.lastName}`;
      const { subject, description } = getMailTemplateForReturnStatus(
        userName,
        orderNumber,
        status,
        adminNote,
        shippingLabel
      );

      await sendMail(userData.email, subject, description);
      return true;
    }
  } catch (error) {
    return false;
  }
};

module.exports = {
  rejectReturn,
  sendReturnStatusMailController,
};
