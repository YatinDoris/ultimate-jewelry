"use client";

import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
  LinkAuthenticationElement,
} from "@stripe/react-stripe-js";

import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import {
  checkOutSuccessUrl,
  fetchWrapperService,
  helperFunctions,
  ordersUrl,
} from "@/_helper";
import { LoadingPrimaryButton } from "../button";
import { setIsHovered, setIsSubmitted } from "@/store/slices/commonSlice";
import ErrorMessage from "../ErrorMessage";
import {
  clearPaymentMessage,
  setPaymentLoader,
  setPaymentMessage,
} from "@/store/slices/paymentSlice";
import { messageType } from "@/_helper/constants";
import {
  updateBillingAddress,
  updatePaymentStatus,
} from "@/_actions/payment.action";
import { deleteOrder } from "@/_actions/order.action";
import { fetchCart } from "@/_actions/cart.action";
import { setCartList } from "@/store/slices/cartSlice";

const paymentFormInitialValues = {
  address: null,
  email: "",
};

const validationSchema = Yup.object({
  address: Yup.object().required("Billing address is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const PaymentForm = ({ orderId }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();

  const { cartList } = useSelector(({ cart }) => cart);
  const { isHovered } = useSelector(({ common }) => common);
  const { paymentLoader, paymentMessage } = useSelector(
    ({ payment }) => payment
  );

  useEffect(() => {
    dispatch(setIsSubmitted(false));
    dispatch(clearPaymentMessage());
  }, []);

  const resetValue = () => {
    dispatch(setIsSubmitted(false));
    dispatch(clearPaymentMessage());
  };

  // Formik setup
  const addressesMatch = (shipping, billing) => {
    const isValidShipping =
      shipping &&
      shipping.address &&
      shipping.city &&
      shipping.country &&
      shipping.pinCode &&
      shipping.stateCode;
    const isValidBilling =
      billing &&
      billing.line1 &&
      billing.city &&
      billing.country &&
      billing.postal_code &&
      billing.state;
    if (!isValidShipping || !isValidBilling) {
      return false;
    }
    const matches = {
      address:
        shipping?.address?.toLowerCase() === billing?.line1?.toLowerCase(),
      city: shipping?.city?.toLowerCase() === billing?.city?.toLowerCase(),
      country:
        shipping?.country?.toLowerCase() === billing.country?.toLowerCase(),
      postal_code:
        shipping.pinCode?.toString().toLowerCase() ===
        billing?.postal_code?.toLowerCase(),
      state:
        shipping?.stateCode?.toLowerCase() === billing?.state?.toLowerCase(),
    };

    return Object.values(matches).every((value) => value === true);
  };

  const onSubmit = useCallback(
    async (values) => {
      try {
        dispatch(setPaymentLoader(true));
        resetValue();
        if (!stripe || !elements) return;

        if (!values?.address) {
          dispatch(
            setPaymentMessage({
              message: "Please provide a billing address.",
              type: messageType.ERROR,
            })
          );
          returnl;
        }
        const orderData = await fetchWrapperService.findOne(ordersUrl, {
          id: orderId,
        });

        if (!orderData) {
          dispatch(
            setPaymentMessage({
              message: "Order not found.",
              type: messageType.ERROR,
            })
          );
          dispatch(setIsSubmitted(false));
          return;
        }

        if (!addressesMatch(orderData.shippingAddress, values.address)) {
          dispatch(
            setPaymentMessage({
              message: "The shipping address does not match the card address.",
              type: messageType.ERROR,
            })
          );
          dispatch(setIsSubmitted(false));
          return;
        }

        const { error, paymentIntent } = await stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/${checkOutSuccessUrl}`,
          },
          redirect: "if_required",
        });

        if (error) {
          dispatch(
            setPaymentMessage({
              message: error.message,
              type: messageType.ERROR,
            })
          );
        } else if (paymentIntent && paymentIntent.status === "succeeded") {
          await handleSuccessfulPayment(values.address);
        } else if (paymentIntent && paymentIntent.status === "failed") {
          dispatch(
            setPaymentMessage({
              message: "Payment status: " + paymentIntent.status,
              type: messageType.ERROR,
            })
          );
          dispatch(deleteOrder(orderId));
        }
      } catch (error) {
        console.error("Error occurred during submission:", error);
        dispatch(
          setPaymentMessage({
            message: "An error occurred. Please try again.",
            type: messageType.ERROR,
          })
        );
      } finally {
        dispatch(setPaymentLoader(false));
        dispatch(setIsSubmitted(false));
      }
    },
    [dispatch, stripe, elements, orderId, checkOutSuccessUrl]
  );

  const { setFieldValue, setFieldTouched, touched, errors, handleSubmit } =
    useFormik({
      initialValues: paymentFormInitialValues,
      validationSchema,
      onSubmit,
    });

  const handleSuccessfulPayment = useCallback(
    async (billingAddressData) => {
      try {
        const currentUser = helperFunctions?.getCurrentUser();

        const paymentPayload = {
          orderId: orderId,
          paymentStatus: "success",
          ...(currentUser && { cartIds: cartList.map((item) => item.id) }),
        };

        const billingPayload = {
          orderId: orderId,
          billingAddress: billingAddressData,
        };

        // Update billing address first
        await dispatch(updateBillingAddress(billingPayload));

        // Then update payment status
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
        console.error("Error occurred while updating payment status:", error);
        throw error;
      }
    },
    [cartList, dispatch, router, orderId]
  );

  const handleAddressChange = (event) => {
    if (event.complete) {
      setFieldValue("address", event.value.address);
    }
  };

  const handleEmailChange = (event) => {
    if (event.complete) {
      setFieldValue("email", event.value.email);
      setFieldTouched("email", true);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !paymentLoader) {
      event.preventDefault(); // Prevent default form submission behavior
      handleSubmit(); // Trigger Formik's handleSubmit
    }
  };

  const paymentElementOptions = {
    layout: "accordion",
  };

  return (
    <div className="bg-white p-5 mt-5">
      <p className="text-baseblack text-lg md:text-xl font-semibold">Payment</p>
      <h6 className="mb-2 text-basegray">
        All transactions are secure and encrypted.
      </h6>
      <form onKeyDown={handleKeyDown}>
        <LinkAuthenticationElement id="email" onChange={handleEmailChange} />
        {touched?.email && errors?.email && (
          <ErrorMessage message={errors?.email} />
        )}

        <AddressElement
          id="address"
          options={{ mode: "billing" }}
          onChange={handleAddressChange}
        />
        {touched?.address && errors?.address && (
          <ErrorMessage message={errors?.address} />
        )}

        <PaymentElement id="payment-element" options={paymentElementOptions} />
        <div
          className="w-full mt-5"
          onMouseEnter={() => dispatch(setIsHovered(true))}
          onMouseLeave={() => dispatch(setIsHovered(false))}
        >
          <LoadingPrimaryButton
            loading={paymentLoader}
            disabled={paymentLoader}
            className="uppercase w-full"
            loaderType={isHovered ? "" : "white"}
            onClick={handleSubmit}
          >
            PAY NOW
          </LoadingPrimaryButton>
        </div>
        {paymentMessage?.message && (
          <ErrorMessage message={paymentMessage?.message} />
        )}
      </form>
    </div>
  );
};

export default PaymentForm;
