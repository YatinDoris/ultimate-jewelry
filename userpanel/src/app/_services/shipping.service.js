import axios from "axios";
import actionTypes from "../store/actionTypes";
import { sanitizeObject } from "../_helper";

export const handleCreatePaymetIntentError = (payload) => {
  return async (dispatch, getState) => {
    dispatch({
      type: actionTypes.CREATE_PAYMENT_INTENT_ERROR,
      setCreatePaymentIntentError: payload.setCreatePaymentIntentError,
    });
  };
};

const createPaymentIntent = (payload, abortController) => async (dispatch) => {
  try {
    const signal = abortController && abortController.signal;
    dispatch(
      handleCreatePaymetIntentError({ setCreatePaymentIntentError: "" })
    );
    if (payload) {
      dispatch({
        type: actionTypes.LOADING,
        payload: true,
      });
      const response = await axios.post(
        "/stripe/create-payment-intent",
        sanitizeObject(payload),
        { signal }
      );
      const { orderId, status, clientSecret, message, paymentIntentId } =
        response.data;

      if (status === 200 && clientSecret) {
        const secretData = {
          clientSecret,
          orderId,
          paymentIntentId,
        };
        const encoded = btoa(JSON.stringify(secretData));
        return encoded;
      } else {
        dispatch(
          handleCreatePaymetIntentError({
            setCreatePaymentIntentError: message,
          })
        );
        return false;
      }
    }
  } catch (error) {
    if (error?.code === "ERR_NETWORK") {
      dispatch(
        handleCreatePaymetIntentError({
          setCreatePaymentIntentError: error?.message,
        })
      );
    }
    console.log("create payment intent error : ", error?.message);
    return false;
  } finally {
    dispatch({
      type: actionTypes.LOADING,
      payload: false,
    });
  }
};

export const shippingService = {
  createPaymentIntent,
};
