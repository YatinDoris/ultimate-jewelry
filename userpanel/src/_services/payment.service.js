import axios from "axios";
import { apiUrl, sanitizeObject } from "../_helper";

const createPaymentIntent = (payload, abortController) => {
  return new Promise(async (resolve, reject) => {
    try {
      const signal = abortController?.signal;

      const response = await axios.post(
        `${apiUrl}/stripe/create-payment-intent`,
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
        resolve({ success: true, encoded });
      } else {
        resolve({ success: false, message });
      }
    } catch (error) {
      resolve({ success: false, message: error?.message });
    }
  });
};

export const paymentService = {
  createPaymentIntent,
};
