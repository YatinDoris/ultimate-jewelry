"use client";
import { useCallback, useState, useEffect } from "react";
import deleteIcon from "@/assets/icons/delete.svg";
import { CustomImg, ProgressiveImg } from "@/components/dynamiComponents";
import stripe from "@/assets/images/cart/stripe.webp";
import paypal from "@/assets/images/cart/paypal.webp";
import snapFinance from "@/assets/images/cart/snapFinance.webp";
import acima from "@/assets/images/cart/acima.webp";
import SkeletonLoader from "@/components/ui/skeletonLoader";
import cartImage from "@/assets/images/cart/cart.webp";
import KeyFeatures from "@/components/ui/KeyFeatures";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  handleSelectCartItem,
  removeProductIntoCart,
  updateProductQuantityIntoCart,
} from "@/_actions/cart.action";
import { helperFunctions } from "@/_helper";
import Link from "next/link";
import { LinkButton } from "@/components/ui/button";
import CommonBgHeading from "@/components/ui/CommonBgHeading";

const maxQuantity = 5;
const minQuantity = 1;
const paymentOptions = [
  { img: stripe, name: "Stripe", altAttr: "", titleAttr: "" },
  { img: paypal, name: "PayPal", altAttr: "", titleAttr: "" },
  { img: snapFinance, name: "Snap Finance", altAttr: "", titleAttr: "" },
  { img: acima, name: "Acima", altAttr: "", titleAttr: "" },
];

const CartPage = () => {
  const dispatch = useDispatch();
  const [deleteLoader, setDeleteLoader] = useState(false);

  const {
    cartLoading,
    cartList,
    selectedCartItem,
    isProductQuantityHasUpdatedIntoCart,
    updateCartQtyErrorMessage,
    removeCartErrorMessage,
  } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, []);

  const loadData = useCallback(() => {
    dispatch(fetchCart());
  }, [dispatch, isProductQuantityHasUpdatedIntoCart]);

  useEffect(() => {
    loadData();
  }, [isProductQuantityHasUpdatedIntoCart]);

  const handleCartQuantity = useCallback(
    (type, cartItem) => {
      dispatch(handleSelectCartItem({ selectedCartItem: cartItem }));
      if (
        type === "increase" &&
        (cartItem.quantity < minQuantity ||
          cartItem.quantity >= maxQuantity ||
          cartItem.quantity >= cartItem.productQuantity)
      ) {
        return;
      }

      if (
        type === "decrease" &&
        (cartItem.quantity < minQuantity || cartItem.quantity > maxQuantity)
      ) {
        return;
      }

      const quantity =
        type === "increase" ? cartItem.quantity + 1 : cartItem.quantity - 1;
      const payload = {
        type: type,
        quantity: quantity,
        cartId: cartItem.id,
      };
      dispatch(updateProductQuantityIntoCart(payload));
    },
    [dispatch]
  );

  const removeFromCart = useCallback(
    (cartItem) => {
      dispatch(handleSelectCartItem({ selectedCartItem: cartItem }));
      if (!cartItem.id) {
        return;
      }

      const payload = {
        cartId: cartItem.id,
      };

      setDeleteLoader(true);
      dispatch(removeProductIntoCart(payload));
      setDeleteLoader(false);
    },
    [dispatch]
  );

  const getOrderTotal = useCallback(() => {
    const total = cartList.reduce(
      (acc, item) => acc + item.quantityWisePrice,
      0
    );
    return helperFunctions.toFixedNumber(total);
  }, [cartList]);

  const getDiscountTotal = useCallback(() => {
    const totalDiscount = cartList.reduce((acc, item) => {
      if (item.productDiscount) {
        return acc + (item.quantityWisePrice - item.quantityWiseSellingPrice);
      }
      return acc;
    }, 0);
    return helperFunctions.toFixedNumber(totalDiscount);
  }, [cartList]);

  const getSubTotal = useCallback(() => {
    const total = cartList.reduce(
      (acc, item) => acc + item.quantityWiseSellingPrice,
      0
    );
    return helperFunctions.toFixedNumber(total);
  }, [cartList]);

  const grandTotal = getSubTotal();

  return (
    <div className="mx-auto pt-10 lg:pt-10 2xl:pt-12">
      {cartLoading ? (
        <CartSkeleton />
      ) : cartList?.length ? (
        <>
          <CommonBgHeading title="Secure Shopping Cart" />
          <div className="flex flex-col lg:flex-row gap-6 container mx-auto">
            <div className="w-full lg:w-2/3">
              {cartList?.map((cartItem) => (
                <div
                  className="bg-white mb-6 py-6 px-2 xs:px-6"
                  key={cartItem.id}
                >
                  <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex-shrink-0 border border-[#F3F2ED]">
                      <ProgressiveImg
                        src={cartItem?.productImage}
                        alt={cartItem?.productName}
                        className="w-36 h-36 md:w-48 md:h-48 object-cover"
                      />
                    </div>
                    <div className="flex-1 w-full">
                      <div className="flex flex-col xs:flex-row xs:justify-between text-center items-center">
                        <Link
                          href={`/products/${cartItem.productName
                            .split(" ")
                            .join("_")}`}
                          className="text-lg font-medium"
                        >
                          {cartItem.productName}
                        </Link>

                        <p className="text-2xl font-medium font-castoro">
                          {cartItem?.productDiscount ? (
                            <span className="text-lg text-gray-500 line-through mr-2">
                              $
                              {helperFunctions.toFixedNumber(
                                cartItem?.quantityWisePrice
                              )}
                            </span>
                          ) : null}
                          $
                          {helperFunctions.toFixedNumber(
                            cartItem?.quantityWiseSellingPrice
                          )}
                        </p>
                      </div>
                      <div className="text-baseblack flex flex-wrap gap-2 md:gap-x-4 md:gap-y-2 pt-2">
                        {cartItem.variations.map((variItem) => (
                          <div
                            className="border-2 border-[#0000001A] text-sm xs:text-base p-1 px-2 font-medium"
                            key={variItem.variationId}
                          >
                            <span className="font-bold">
                              {variItem.variationName}:{" "}
                            </span>{" "}
                            {variItem.variationTypeName}
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center space-x-2 pt-4">
                        <h3 className="text-lg font-medium">Qty:</h3>
                        <div className="flex items-center bg-[#F3F2ED] px-2">
                          <button
                            className={`px-1 py-1 text-xl font-medium text-black ${
                              cartItem?.quantity <= minQuantity
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() =>
                              handleCartQuantity("decrease", cartItem)
                            }
                            disabled={cartItem?.quantity <= minQuantity}
                          >
                            −
                          </button>
                          {selectedCartItem.id === cartItem.id &&
                          updateCartQtyErrorMessage ? (
                            <p className="text-red-600 text-lg">
                              {updateCartQtyErrorMessage}
                            </p>
                          ) : null}
                          <span className="px-4 text-xl font-medium text-black">
                            {cartItem.quantity}
                          </span>
                          <button
                            className={`px-1 py-1 text-xl font-medium text-black ${
                              cartItem?.quantity >= maxQuantity ||
                              cartItem.quantity >= cartItem.productQuantity
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() =>
                              handleCartQuantity("increase", cartItem)
                            }
                            disabled={
                              cartItem?.quantity >= maxQuantity ||
                              cartItem.quantity >= cartItem.productQuantity
                            }
                          >
                            +
                          </button>
                        </div>

                        <button
                          className="font-medium px-3 py-1 cursor-pointer flex items-center justify-center transition-all duration-200"
                          onClick={() => removeFromCart(cartItem)}
                          disabled={deleteLoader}
                        >
                          <CustomImg
                            srcAttr={deleteIcon}
                            altAttr=""
                            titleAttr=""
                            className="w-6 h-6 transition-transform duration-200 hover:scale-110"
                          />
                        </button>
                        {selectedCartItem.id === cartItem.id &&
                        removeCartErrorMessage ? (
                          <p className="text-red-600 text-lg">
                            {removeCartErrorMessage}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="mt-4 flex flex-col md:flex-row gap-6">
                <LinkButton
                  href="/"
                  className="!text-baseblack !font-medium  w-fit !py-6 !bg-transparent !text-lg hover:!border-black hover:!bg-black hover:!text-white !border-[#0000001A] !border-2"
                >
                  Continue Shopping
                </LinkButton>
              </div>
            </div>

            <div className="w-full lg:w-1/3 bg-white py-6 lg:py-10 px-2 xs:px-6  self-start">
              <p className="text-lg xl:text-xl text-baseblack flex justify-between font-semibold">
                Order Total: <span className="">${getOrderTotal()}</span>
              </p>
              <p className="text-lg xl:text-xl text-baseblack flex justify-between font-semibold pt-4">
                Discount Offer: <span className="">-${getDiscountTotal()}</span>
              </p>
              <p className="text-lg xl:text-xl text-baseblack flex justify-between font-semibold pt-4">
                Subtotal: <span className="">${getSubTotal()}</span>
              </p>
              <p className="my-4 border-t-2 border-[#0000001A]" />
              <p className="text-lg xl:text-xl text-baseblack flex justify-between font-semibold pt-2">
                Grand Total: <span>${grandTotal}</span>
              </p>

              <LinkButton
                href="/checkout"
                className="!text-white !rounded-none !font-medium  w-full !mt-10 lg:!mt-20 !py-6 !bg-primary !text-lg hover:!border-black hover:!bg-black hover:!text-white !border-[#0000001A] !border-2"
              >
                SECURE CHECKOUT
              </LinkButton>

              <p className="text-sm font-medium text-baseblack mt-4">
                Made-To-Order. Estimated Ship Date: Wednesday, April 9th
              </p>
              <div className="mt-10">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <div className="flex-grow h-px bg-gray-300" />
                  <p className="text-sm md:text-lg font-medium text-baseblack uppercase whitespace-nowrap">
                    We Accept Payment
                  </p>
                  <div className="flex-grow h-px bg-gray-300" />
                </div>

                <div className="flex items-center gap-3 ">
                  <p className="font-medium text-lg text-gray-500">Pay With:</p>
                  <div className="flex gap-6 flex-wrap">
                    {paymentOptions.map((option, index) => (
                      <CustomImg
                        key={index}
                        srcAttr={option.img}
                        titleAttr={option.titleAttr}
                        altAttr={option.altAttr}
                        className="object-contain w-auto h-auto"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <section className="pt-10 lg:pt-16 2xl:pt-24 container">
            <KeyFeatures />
          </section>
        </>
      ) : (
        <div className="flex flex-col items-center h-[80vh] lg:h-[80vh] justify-center align-middle mx-auto my-auto  text-center px-4">
          <CustomImg
            srcAttr={cartImage}
            altAttr=""
            titleAttr=""
            className="mb-6 w-80"
          />

          <p className="text-lg md:text-xl 2xl:text-3xl font-medium font-castoro text-baseblack">
            Oops! Your cart is empty. Let’s fix that <br /> with some stunning
            jewelry
          </p>
          <LinkButton
            href="/"
            className="!text-white !rounded-none !font-medium !mt-8 w-fit !px-16 !py-6 !bg-primary !text-lg hover:!border-black hover:!bg-black hover:!text-white !border-[#0000001A] !border-2 uppercase"
          >
            Back To Shop
          </LinkButton>
        </div>
      )}
    </div>
  );
};

export default CartPage;

const CartSkeleton = () => {
  const skeletons = [
    { width: "w-[40%]", height: "h-4", margin: "mt-2" },
    { width: "w-full", height: "h-8", margin: "mt-2" },
    { width: "w-[40%]", height: "h-4", margin: "mt-6" },
    { width: "w-full", height: "h-8", margin: "mt-2" },
  ];
  return (
    <div
      className={`container grid grid-cols-1 lg:grid-cols-[60%_auto] gap-12 pt-12`}
    >
      <div className="grid grid-cols-1 gap-4 auto-rows-min">
        <SkeletonLoader height="w-full h-[100px] md:h-[300px]  2xl:h-[250px]" />
        <SkeletonLoader height="w-[20%] h-[40px]" />
      </div>
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
    </div>
  );
};
