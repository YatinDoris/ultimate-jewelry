import axios from "axios";
import actionTypes from "../store/actionTypes";
import {
  handleCheckPIStatusError,
  handleUpdatePaymentStatusError,
} from "../store/actions/paymentActions";
import { sanitizeObject, ordersUrl, fetchWrapperService } from "../_helper";
const updatePaymentStatus = (payload) => async (dispatch) => {
  try {
    if (payload) {
      dispatch(
        handleUpdatePaymentStatusError({ setUpdatePaymentStatusError: "" })
      );
      dispatch({
        type: actionTypes.UPDATE_PAYMENT_STATUS_LOADER,
        payload: true,
      });
      const response = await axios.post(
        "order/updatePaymentStatus",
        sanitizeObject(payload)
      );
      const { status, message, data } = response.data;
      if (status === 200) {
        return data;
      } else {
        dispatch(
          handleUpdatePaymentStatusError({
            setUpdatePaymentStatusError: message,
          })
        );
        return false;
      }
    }
  } catch (error) {
    console.log("update payment status error : ", error?.message);
    return false;
  } finally {
    dispatch({
      type: actionTypes.UPDATE_PAYMENT_STATUS_LOADER,
      payload: false,
    });
  }
};

const checkPaymentIntentStatus =
  (payload, abortController) => async (dispatch) => {
    try {
      if (payload) {
        dispatch(handleCheckPIStatusError({ setCheckPIStatusError: "" }));
        dispatch({
          type: actionTypes.CHECK_PI_STATUS_LOADER,
          payload: true,
        });
        const signal = abortController && abortController.signal;
        const response = await axios.post(
          "/stripe/check-payment-intent-status",
          sanitizeObject(payload),
          { signal }
        );
        const { status, paymentIntentStatus } = response.data;
        if (status === 200 && paymentIntentStatus) {
          return response.data;
        } else {
          dispatch(
            handleCheckPIStatusError({
              setCheckPIStatusError:
                "Something went wrong with the payment. Please try again later.",
            })
          );
          return false;
        }
      }
    } catch (error) {
      if (error?.code === "ERR_NETWORK") {
        dispatch(
          handleCheckPIStatusError({
            setCheckPIStatusError: error?.message,
          })
        );
      }
      console.log("check payment intent status error : ", error?.message);
      return false;
    } finally {
      dispatch({
        type: actionTypes.CHECK_PI_STATUS_LOADER,
        payload: false,
      });
    }
  };

const cancelPaymentIntent = (payload) => async (dispatch) => {
  try {
    if (payload) {
      const response = axios.post(
        "/stripe/cancel-payment-intent",
        sanitizeObject(payload)
      );
      return response?.data;
    }
  } catch (error) {
    console.error("cancel payment error : ", error?.message);
    return false;
  } finally {
    return false;
  }
};

const updateBillingAddress = (payload) => async (dispatch) => {
  try {
    const { orderId, billingAddress } = payload
    if (payload) {
      const orderData = await fetchWrapperService.findOne(ordersUrl, {
        id: orderId,
      });
      if (orderData) {
        const updatePattern = {
          url: `${ordersUrl}/${orderId}`,
          payload: {
            billingAddress
          },
        };
        fetchWrapperService
          ._update(updatePattern).then((response) => {
            return true
          }).catch((e) => {
            return false
          });
      }
    }
  } catch (error) {
    console.error("cancel payment error : ", error?.message);
    return false;
  } finally {
    return false;
  }
}
export const paymentService = {
  updatePaymentStatus,
  checkPaymentIntentStatus,
  cancelPaymentIntent,
  updateBillingAddress,
};
