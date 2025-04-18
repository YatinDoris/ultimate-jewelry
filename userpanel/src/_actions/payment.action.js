import { messageType } from "@/_helper/constants";
import { paymentService } from "@/_services";
import {
  setCheckPIStatusLoader,
  setLoading,
  setPaymentIntentMessage,
  setPaymentMessage,
} from "@/store/slices/paymentSlice";

export const handleCreatePaymentIntentError = (message = "") => {
  return (dispatch) => {
    dispatch(
      setPaymentMessage({
        type: message ? messageType.ERROR : "",
        message,
      })
    );
  };
};

export const createPaymentIntent = (payload, abortController) => {
  return async (dispatch) => {
    try {
      dispatch(setPaymentMessage({ type: "", message: "" }));
      dispatch(setLoading(true));

      const response = await paymentService.createPaymentIntent(
        payload,
        abortController
      );
      if (response?.success) {
        return response.encoded;
      } else {
        dispatch(
          setPaymentMessage({
            message: response?.message || "Something went wrong",
            type: messageType.ERROR,
          })
        );
        return false;
      }
    } catch (error) {
      const errorMessage = error?.message || "Something went wrong";
      dispatch(
        setPaymentMessage({ message: errorMessage, type: messageType.ERROR })
      );
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };
};

export const checkPaymentIntentStatus = (payload, abortController) => {
  return async (dispatch) => {
    try {
      dispatch(setPaymentIntentMessage({ type: "", message: "" }));
      dispatch(setCheckPIStatusLoader(true));

      const response = await paymentService.checkPaymentIntentStatus(
        payload,
        abortController
      );
      if (response?.success) {
        return response?.data;
      } else {
        dispatch(
          setPaymentIntentMessage({
            message: response?.message || "Something went wrong",
            type: messageType.ERROR,
          })
        );
        return false;
      }
    } catch (error) {
      const errorMessage = error?.message || "Something went wrong";
      dispatch(
        setPaymentIntentMessage({
          message: errorMessage,
          type: messageType.ERROR,
        })
      );
      return false;
    } finally {
      dispatch(setCheckPIStatusLoader(false));
    }
  };
};

export const cancelPaymentIntent = (payload) => {
  return async (dispatch) => {
    try {
      const response = await paymentService.cancelPaymentIntent(payload);
      if (response?.success) {
        return response?.data;
      }
      return false;
    } catch (error) {
      return false;
    }
  };
};
