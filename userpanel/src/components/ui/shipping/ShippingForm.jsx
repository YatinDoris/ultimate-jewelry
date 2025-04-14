"use client";
import {
  createPaymentIntent,
  handleCreatePaymentIntentError,
} from "@/_actions/payment.action";
import { helperFunctions } from "@/_helper";
import {
  setActiveIndex,
  setIsSubmitted,
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
import { setIsHovered } from "@/store/slices/commonSlice";
import ErrorMessage from "../ErrorMessage";

const shippingForm = () => {
  const router = useRouter();
  const abortControllerRef = useRef(null);
  const dispatch = useDispatch();
  const { isHovered } = useSelector(({ common }) => common);
  const {
    isSubmitted,
    selectedShippingCharge,
    activeIndex,
    selectedShippingAddress,
  } = useSelector(({ checkout }) => checkout);

  const { cartList } = useSelector(({ cart }) => cart);
  const { loading, paymentMessage } = useSelector(({ payment }) => payment);

  const [selectedMethod, setSelectedMethod] = useState("");

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

    if (!getParsedAddress) {
      router.push("/checkout");
      return;
    }
    dispatch(setSelectedShippingAddress(getParsedAddress));
    if (subTotal > 199) {
      dispatch(setSelectedShippingCharge(0));
    } else {
      const initSelectedOption = shippingOptions?.[0]?.price;
      dispatch(setSelectedShippingCharge(initSelectedOption));
    }
    dispatch(setActiveIndex(0));
    return () => {
      clearAbortController();
    };
  }, []);

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
        zipCode: Number(selectedShippingAddress?.zipCode),
        phone: Number(selectedShippingAddress?.phone),
        email: selectedShippingAddress?.email,
        companyName: selectedShippingAddress?.companyName,
        apartment: selectedShippingAddress?.apartment,
        shippingCharge: subTotal < 199 ? selectedShippingCharge : 0,
      };

      if (!cartList.length) {
        dispatch(handleCreatePaymentIntentError("cart data not found"));
        return;
      }
      const userData = helperFunctions.getCurrentUser();
      if (!userData) {
        payload.cartList = cartList;
      }

      const res = await dispatch(
        createPaymentIntent(payload, abortControllerRef.current)
      );
      if (res) {
        if (subTotal < 199) {
          localStorage.setItem(
            "selectedShippingMethod",
            JSON.stringify(shippingMethodsList?.[activeIndex])
          );
        }
        router.push(`/payment/${res}`);
      }
    } catch (error) {
      console.error("Error occurred while creating payment intent:", error);
    } finally {
      clearAbortController();
    }
  }, [
    dispatch,
    cartList,
    selectedShippingAddress?.countryName,
    selectedShippingAddress?.firstName,
    selectedShippingAddress?.lastName,
    selectedShippingAddress?.address,
    selectedShippingAddress?.city,
    selectedShippingAddress?.state,
    selectedShippingAddress?.stateCode,
    selectedShippingAddress?.zipCode,
    selectedShippingAddress?.phone,
    selectedShippingAddress?.email,
    selectedShippingAddress?.companyName,
    selectedShippingAddress?.apartment,
    selectedShippingCharge,
    router,
    activeIndex,
    clearAbortController,
  ]);

  const shippingOptions = [
    {
      id: helperFunctions.getRandomValue(),
      name: "Priority",
      price: 19.99,
    },
    {
      id: helperFunctions.getRandomValue(),
      name: "Overnight",
      price: 39.99,
    },
  ];

  return (
    <div className="flex flex-col gap-6 lg:gap-10 pt-8 lg:pt-12">
      <div className="bg-white px-4 lg:px-6 flex flex-col">
        <div className="flex justify-between items-center border-b py-4">
          <div>
            <p className="text-baseblack  text-lg md:text-xl font-semibold">
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
            <p className="text-baseblack  text-lg md:text-xl font-semibold">
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
                    {selectedShippingAddress?.zipCode}
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
          {shippingOptions.map((option) => (
            <label
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
                  }}
                  className="form-radio  w-6 h-5"
                  disabled={renderTotalAmount > 199}
                />
                <span className="md:text-xl text-lg text-baseblack font-semibold">
                  {option.name}
                </span>
              </div>
              <span className="md:text-xl text-lg text-baseblack font-semibold">
                ${option.price.toLocaleString()}
              </span>
            </label>
          ))}
          {isSubmitted && paymentMessage?.message ? (
            <ErrorMessage message={paymentMessage?.message} />
          ) : null}
        </div>
      </div>

      <div
        className="uppercase mt-6 2xl:mt-8 w-full"
        onMouseEnter={() => dispatch(setIsHovered(true))}
        onMouseLeave={() => dispatch(setIsHovered(false))}
      >
        <LoadingPrimaryButton
          className="w-full uppercase hover:!text-primary"
          loading={loading}
          loaderType={isHovered ? "" : "white"}
          onClick={submitShippingMethod}
        >
          CONTINUE Shipping
        </LoadingPrimaryButton>
      </div>
    </div>
  );
};

export default shippingForm;
