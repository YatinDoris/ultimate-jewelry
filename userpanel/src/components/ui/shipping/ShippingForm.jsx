"use client";
import {
  createOrderForPaypal,
  createPaymentIntent,
  handleCreatePaymentIntentError,
} from "@/_actions/payment.action";
import { helperFunctions, PAYPAL, STRIPE } from "@/_helper";
import {
  setActiveIndex,
  setSelectedShippingAddress,
  setSelectedShippingCharge,
} from "@/store/slices/checkoutSlice";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { LoadingPrimaryButton } from "../button";
import { setIsHovered, setIsSubmitted } from "@/store/slices/commonSlice";
import ErrorMessage from "../ErrorMessage";
import {
  setPaymentIntentMessage,
  setPaypalPaymentMessage,
} from "@/store/slices/paymentSlice";

const paymentOptions = [
  {
    value: STRIPE,
    label: "Credit Card / Apple Pay",
  },
  {
    value: PAYPAL,
    label: "PayPal",
  },
];

const shippingForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { isHovered, isSubmitted } = useSelector(({ common }) => common);
  const { selectedShippingCharge, activeIndex, selectedShippingAddress } =
    useSelector(({ checkout }) => checkout);

  const { cartList } = useSelector(({ cart }) => cart);
  const {
    paymentIntentLoader,
    paymentIntentMessage,
    paypalPaymentLoader,
    paypalPaymentMessage,
  } = useSelector(({ payment }) => payment);

  const [selectedMethod, setSelectedMethod] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(STRIPE);

  const abortControllerRef = useRef(null);
  const clearAbortController = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = null;
  }, []);

  const renderTotalAmount = useMemo(() => {
    const subTotal = helperFunctions.getSubTotal(cartList);
    return subTotal < 199 ? subTotal + selectedShippingCharge : subTotal;
  }, [cartList, selectedShippingCharge]);

  useEffect(() => {
    dispatch(handleCreatePaymentIntentError(""));
    dispatch(setIsSubmitted(false));
    const address = localStorage.getItem("address");
    const getParsedAddress = address ? JSON.parse(address) : null;
    const subTotal = helperFunctions.getSubTotal(cartList);
    const savedShippingMethod = localStorage.getItem("selectedShippingMethod");
    const parsedSavedMethod = savedShippingMethod
      ? JSON.parse(savedShippingMethod)
      : null;
    if (!getParsedAddress) {
      router.push("/checkout");
      return;
    }
    dispatch(setSelectedShippingAddress(getParsedAddress));
    if (subTotal > 199) {
      dispatch(setSelectedShippingCharge(0));
    } else {
      const matchedIndex = shippingOptions.findIndex(
        (option) => option.name === parsedSavedMethod?.name
      );
      if (matchedIndex !== -1) {
        setSelectedMethod(parsedSavedMethod.name);
        dispatch(setSelectedShippingCharge(parsedSavedMethod.price));
        dispatch(setActiveIndex(matchedIndex));
      } else {
        setSelectedMethod(shippingOptions?.[0]?.name);
        dispatch(setSelectedShippingCharge(shippingOptions?.[0]?.price));
        dispatch(setActiveIndex(0));
      }
    }

    return () => {
      clearAbortController();
    };
  }, [dispatch, router, cartList, clearAbortController]);

  const processPayment = useCallback(
    async (paymentAction, payload) => {
      dispatch(setPaymentIntentMessage({ message: "", type: "" }));
      dispatch(setPaypalPaymentMessage({ message: "", type: "" }));
      const res = await dispatch(
        paymentAction(payload, abortControllerRef.current)
      );
      const subTotal = helperFunctions.getSubTotal(cartList);
      if (res) {
        if (subTotal < 199) {
          localStorage.setItem(
            "selectedShippingMethod",
            JSON.stringify(shippingOptions?.[activeIndex])
          );
        }
        dispatch(setIsSubmitted(false));
        router.push(`/payment/${res}`);
      }
    },
    [dispatch, cartList, activeIndex, router]
  );

  const submitShippingMethod = useCallback(async () => {
    try {
      if (!abortControllerRef.current) {
        abortControllerRef.current = new AbortController();
      }
      dispatch(handleCreatePaymentIntentError(""));
      dispatch(setIsSubmitted(true));

      const subTotal = helperFunctions.getSubTotal(cartList);
      let payload = {
        countryName: selectedShippingAddress?.countryName,
        firstName: selectedShippingAddress?.firstName,
        lastName: selectedShippingAddress?.lastName,
        address: selectedShippingAddress?.address,
        city: selectedShippingAddress?.city,
        state: selectedShippingAddress?.state,
        stateCode: selectedShippingAddress?.stateCode,
        pinCode: selectedShippingAddress?.pinCode,
        mobile: Number(selectedShippingAddress?.mobile),
        email: selectedShippingAddress?.email,
        companyName: selectedShippingAddress?.companyName,
        apartment: selectedShippingAddress?.apartment,
        shippingCharge: subTotal < 199 ? selectedShippingCharge : 0,
      };

      if (!cartList.length) {
        dispatch(handleCreatePaymentIntentError("Cart is empty"));
        return;
      }

      const userData = helperFunctions.getCurrentUser();
      if (!userData) {
        payload.cartList = cartList;
      }

      if (selectedPaymentMethod === STRIPE) {
        await processPayment(createPaymentIntent, {
          ...payload,
          paymentMethod: STRIPE,
        });
      } else if (selectedPaymentMethod === PAYPAL) {
        await processPayment(createOrderForPaypal, {
          ...payload,
          paymentMethod: PAYPAL,
        });
      }
    } catch (error) {
      console.error("Error occurred during payment:", error);
    } finally {
      clearAbortController();
    }
  }, [
    dispatch,
    cartList,
    selectedShippingAddress,
    selectedShippingCharge,
    selectedPaymentMethod,
    processPayment,
    clearAbortController,
  ]);

  const shippingOptions = [
    {
      id: helperFunctions.getRandomValue(),
      name: "Priority",
      // price: 19.99,
      price: 0.0,
    },
    {
      id: helperFunctions.getRandomValue(),
      name: "Overnight",
      // price: 39.99,
      price: 0.0,
    },
  ];

  return (
    <div className="flex flex-col gap-6 lg:gap-10 pt-8 lg:pt-12">
      <div className="bg-white px-4 lg:px-6 flex flex-col">
        <div className="flex justify-between items-center border-b py-4">
          <div>
            <p className="text-baseblack text-lg md:text-xl font-semibold">
              Contact
            </p>
            <p className="text-basegray text-base md:text-lg">
              {selectedShippingAddress?.email}
            </p>
          </div>
          <Link href={"/checkout"}>
            <span className="text-primary md:text-xl font-semibold text-lg underline">
              Change
            </span>
          </Link>
        </div>
        <div className="flex justify-between items-center py-4">
          <div>
            <p className="text-baseblack text-lg md:text-xl font-semibold">
              Ship To:
            </p>
            <div>
              {selectedShippingAddress &&
                Object.keys(selectedShippingAddress)?.length && (
                  <span className="text-basegray text-base md:text-lg">
                    {selectedShippingAddress?.address}{" "}
                    {selectedShippingAddress?.apartment},{" "}
                    {selectedShippingAddress?.city},{" "}
                    {selectedShippingAddress?.state},{" "}
                    {selectedShippingAddress?.countryName} -{" "}
                    {selectedShippingAddress?.pinCode}
                  </span>
                )}
            </div>
          </div>
          <Link href={"/checkout"}>
            <span className="text-primary md:text-xl font-semibold text-lg underline">
              Change
            </span>
          </Link>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3">Shipping Method:</h3>
        <div className="flex flex-col gap-2 md:gap-4">
          {shippingOptions.map((option, index) => (
            <div
              key={option.name}
              className={`flex justify-between items-center px-4 py-4 cursor-pointer ${
                selectedMethod === option.name
                  ? "border border-[#0C1D3D]"
                  : "bg-white"
              }`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  name="shippingMethod"
                  value={option.name}
                  id={option?.id}
                  checked={selectedMethod === option.name}
                  onChange={() => {
                    setSelectedMethod(option.name);
                    dispatch(setSelectedShippingCharge(option.price));
                    dispatch(setActiveIndex(index));
                  }}
                  className="form-radio w-6 h-5 accent-primary"
                  disabled={renderTotalAmount > 199}
                />
                <span className="md:text-xl text-lg text-baseblack font-semibold">
                  {option.name}
                </span>
              </div>
              <span className="md:text-xl text-lg text-baseblack font-semibold">
                ${option.price.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        <span className="mt-5 font-normal text-gray-500">
          <b className="text-baseblack">Note :</b> Free shipping over 199
        </span>
      </div>

      <div>
        <h3 className="font-semibold text-lg mb-3">Payment Method:</h3>
        <div className="flex flex-col gap-3">
          {paymentOptions.map(({ value, label }) => {
            const isChecked = selectedPaymentMethod === value;
            return (
              <label
                key={value}
                className={`flex items-center gap-3 p-3 border rounded cursor-pointer ${
                  isChecked ? "border-primary" : "border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  value={value}
                  checked={isChecked}
                  disabled={paymentIntentLoader || paypalPaymentLoader}
                  onChange={() => {
                    dispatch(
                      setPaymentIntentMessage({ message: "", type: "" })
                    );
                    dispatch(
                      setPaypalPaymentMessage({ message: "", type: "" })
                    );
                    setSelectedPaymentMethod(value);
                  }}
                  className="form-radio w-5 h-5 text-primary accent-primary"
                />
                <span className="text-base font-medium">{label}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div
        className="mt-5 2xl:mt-8 w-full"
        onMouseEnter={() => dispatch(setIsHovered(true))}
        onMouseLeave={() => dispatch(setIsHovered(false))}
      >
        <LoadingPrimaryButton
          className="w-full uppercase"
          loading={paymentIntentLoader || paypalPaymentLoader}
          loaderType={isHovered ? "" : "white"}
          onClick={submitShippingMethod}
        >
          CONTINUE PAYMENT
        </LoadingPrimaryButton>
        {isSubmitted && paymentIntentMessage?.message ? (
          <ErrorMessage message={paymentIntentMessage?.message} />
        ) : null}
        {isSubmitted && paypalPaymentMessage?.message ? (
          <ErrorMessage message={paypalPaymentMessage?.message} />
        ) : null}
      </div>
    </div>
  );
};

export default shippingForm;
