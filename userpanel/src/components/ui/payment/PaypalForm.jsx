"use client";

import React, { useEffect } from "react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useDispatch, useSelector } from "react-redux";
import { paypalClientId } from "@/_helper";
import {
  setPaymentLoader,
  setPaymentMessage,
  setPaypalPaymentMessage,
} from "@/store/slices/paymentSlice";
import {
  updatePaymentStatus,
  updateBillingAddress,
  insertPaypalOrder,
  paypalCaptureOrder,
} from "@/_actions/payment.action";
import { setCartList } from "@/store/slices/cartSlice";
import { helperFunctions } from "@/_helper";
import { useRouter } from "next/navigation";
import { messageType, PAYPAL } from "@/_helper/constants";

const PaypalForm = ({ orderData }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { paypalPaymentMessage } = useSelector(({ payment }) => payment);

  useEffect(() => {
    dispatch(setPaymentLoader(false));
  }, [dispatch]);

  const handleSuccessfulPayment = async (billingAddress, paymentDetails) => {
    try {
      const currentUser = helperFunctions?.getCurrentUser();
      const paymentPayload = {
        orderId: orderData?.id,
        paymentStatus: "success",
        paymentMethod: PAYPAL,
        paymentDetails,
        ...(currentUser && { cartIds: paymentDetails.cartIds || [] }),
      };

      const billingPayload = {
        orderId: orderData?.id,
        billingAddress,
      };

      await dispatch(updateBillingAddress(billingPayload));
      const paymentResponse = await dispatch(
        updatePaymentStatus(paymentPayload)
      );

      if (paymentResponse) {
        router.push(`/order/success/${paymentResponse?.orderNumber}`);
        if (!currentUser) {
          localStorage.removeItem("cart");
        }
        localStorage.removeItem("address");
        localStorage.removeItem("selectedShippingMethod");
        dispatch(setCartList([]));
      }
    } catch (error) {
      console.error("Error finalizing payment:", error);
    }
  };

  const createPayPalOrder = async () => {
    try {
      const payload = {
        orderNumber: orderData?.orderNumber,
      };
      const response = await dispatch(insertPaypalOrder(payload));
      return response?.paypalOrderData?.id;
    } catch (error) {
      dispatch(
        setPaymentMessage({
          message: "Unable to create PayPal order.",
          type: messageType.ERROR,
        })
      );
      throw error;
    }
  };

  const onApprove = async (data) => {
    const payload = {
      paypalOrderId: data.orderID,
    };
    const captureRes = await dispatch(paypalCaptureOrder(payload));
    if (captureRes.success) {
      if (captureRes?.paypalOrderCaptureResult?.status === "COMPLETED") {
        const billingAddress =
          orderData?.billingAddress || orderData?.shippingAddress;

        await handleSuccessfulPayment(billingAddress, {
          type: "paypal",
          paypalOrderId: data.orderID,
          paypalPayerId: data.payerID,
        });
      } else {
        dispatch(
          setPaypalPaymentMessage({
            message: "PayPal payment not completed.",
            type: messageType.ERROR,
          })
        );
      }
    }
  };
  return (
    <>
      {paypalPaymentMessage?.message &&
        paypalPaymentMessage?.type !== messageType?.SUCCESS && (
          <ErrorMessage message={paypalPaymentMessage.message} />
        )}

      <PayPalScriptProvider
        options={{
          "client-id": paypalClientId || "test",
          currency: "USD",
          intent: "capture",
        }}
      >
        <div className="p-5">
          <h2 className="text-lg font-semibold mb-3">Pay with PayPal</h2>
          <PayPalButtons
            createOrder={createPayPalOrder}
            onApprove={onApprove}
            onError={(err) => {
              console.error("PayPal error:", err);
              dispatch(
                setPaymentMessage({
                  message: "An error occurred with PayPal. Please try again.",
                  type: messageType.ERROR,
                })
              );
            }}
          />
        </div>
      </PayPalScriptProvider>
    </>
  );
};

export default PaypalForm;
