"use client";

import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import CommonBgHeading from "../CommonBgHeading";
import CheckoutBreadCrumbs from "../checkout/CheckoutBreadCrumbs";
import SkeletonLoader from "../skeletonLoader";
import {
  AddressSummary,
  CartNotFound,
  CheckoutCommonComponent,
  LatestProduct,
  PaymentForm,
} from "@/components/dynamiComponents";
import KeyFeatures from "../KeyFeatures";
import { useCallback, useEffect, useRef } from "react";
import { setPaymentIntentStatus } from "@/store/slices/paymentSlice";
import {
  cancelPaymentIntent,
  checkPaymentIntentStatus,
} from "@/_actions/payment.action";
import ErrorMessage from "../ErrorMessage";

const PaymentPage = () => {
  const dispatch = useDispatch();
  const params = useParams();
  let { secretData } = params;

  const { cartLoading, cartList } = useSelector(({ cart }) => cart);

  const { checkPIStatusLoader, paymentIntentMessage } = useSelector(
    ({ payment }) => payment
  );

  // decode secret data

  const getDecodedData = useCallback((secretData) => {
    const decoded = atob(decodeURIComponent(secretData));
    const parsedDecoded = JSON.parse(decoded);
    // const clientSecret = parsedDecoded?.clientSecret;
    // const orderId = parsedDecoded?.orderId;
    // const paymentIntentId = parsedDecoded?.paymentIntentId;
    return parsedDecoded;
  }, []);

  // abortcontroller
  const abortControllerRef = useRef(null);
  const clearAbortController = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = null;
  }, []);

  useEffect(() => {
    verifyPaymentIntent();
    return () => {
      console.log("aaaaaaaa");
      terminatePaymentIntent();
      // clearAbortController();
    };
  }, []);

  const verifyPaymentIntent = useCallback(async () => {
    try {
      const decoded = getDecodedData(secretData);
      const payload = {
        paymentIntentId: decoded?.paymentIntentId,
      };
      if (!abortControllerRef.current) {
        abortControllerRef.current = new AbortController();
      }
      const response = await dispatch(
        checkPaymentIntentStatus(payload, abortControllerRef.current)
      );
      if (response?.paymentIntentStatus) {
        dispatch(setPaymentIntentStatus(response.paymentIntentStatus));
      }
    } catch (error) {
      console.error("Error occurred while check payment intent:", error);
    } finally {
      clearAbortController();
    }
  }, [clearAbortController, dispatch, secretData]);

  const terminatePaymentIntent = useCallback(async () => {
    const parsedDecoded = getDecodedData(secretData);

    const payload = {
      paymentIntentId: parsedDecoded?.paymentIntentId,
      orderId: parsedDecoded?.orderId,
    };
    console.log(payload, "payload");
    dispatch(cancelPaymentIntent(payload));
  }, [dispatch, secretData]);

  return (
    <div className="mx-auto pt-10 lg:pt-10 2xl:pt-12">
      {cartLoading ? (
        <PaymentSkeleton />
      ) : (
        <>
          <CommonBgHeading
            title="Secure Checkout"
            backText="Back to Shipping"
            backHref="/shipping"
          />
          <div className="px-4 container mt-8 lg:mt-12">
            <CheckoutBreadCrumbs currentStep={2} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[55%_auto] lg:gap-6 container mx-auto h-full">
            <div>
              {cartList?.length ? (
                <div className="lg:hidden pt-8">
                  <CheckoutCommonComponent />
                </div>
              ) : null}
              <AddressSummary />
              {/* add condition when pI status is ok then render payment form */}
              {paymentIntentMessage?.message ? (
                <ErrorMessage message={paymentIntentMessage?.message} />
              ) : (
                <PaymentForm />
              )}
            </div>

            <div className="lg:block hidden">
              {cartList?.length ? (
                <CheckoutCommonComponent />
              ) : (
                <CartNotFound />
              )}
            </div>
          </div>
          <section className="container pt-16 lg:pt-20 2xl:pt-36">
            <LatestProduct />
          </section>
          <section className="container pt-16 lg:pt-20 2xl:pt-36">
            <KeyFeatures />
          </section>
        </>
      )}
    </div>
  );
};

export default PaymentPage;

const PaymentSkeleton = () => {
  const skeletons = [
    { width: "w-[60%]", height: "h-4", margin: "mt-2" },
    { width: "w-full", height: "h-8", margin: "mt-2" },
    { width: "w-[60%]", height: "h-4", margin: "mt-6" },
    { width: "w-full", height: "h-8", margin: "mt-2" },
  ];
  return (
    <div
      className={`container grid grid-cols-1 lg:grid-cols-[70%_auto] gap-12 pt-12`}
    >
      <div>
        {Array(2)
          .fill(skeletons)
          .flat()
          .map((skeleton, index) => (
            <SkeletonLoader
              key={index}
              width={skeleton.width}
              height={skeleton.height}
              className={skeleton.margin}
            />
          ))}
      </div>
      <div className="grid grid-cols-1 gap-4 auto-rows-min">
        <SkeletonLoader height="w-full h-[70] md:h-[220px]  2xl:h-[150px]" />
        <SkeletonLoader height="w-full h-[70] md:h-[220px]  2xl:h-[150px]" />
        <SkeletonLoader height="w-full h-[70] md:h-[220px]  2xl:h-[150px]" />

        <SkeletonLoader height="w-[20%] h-[40px]" />
      </div>
    </div>
  );
};
