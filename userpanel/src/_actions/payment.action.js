import { messageType } from "@/_helper/constants";
import { paymentService } from "@/_services";
import { setLoading, setPaymentMessage } from "@/store/slices/paymentSlice";

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
