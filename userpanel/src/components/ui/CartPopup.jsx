"use client";
import { useEffect, useCallback, useRef } from "react";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import {
  handleSelectCartItem,
  removeProductIntoCart,
  updateProductQuantityIntoCart,
} from "@/_actions/cart.action";
import { helperFunctions } from "@/_helper";
import Link from "next/link";
import { LinkButton } from "@/components/ui/button";
import deleteIcon from "@/assets/icons/delete.svg";
import cartImage from "@/assets/images/cart/cart.webp";
import { useDispatch, useSelector } from "react-redux";
import { setIsCartOpen, setIsChecked } from "@/store/slices/commonSlice";
import SkeletonLoader from "@/components/ui/skeletonLoader";
import stripe from "@/assets/images/cart/stripe.webp";
import paypal from "@/assets/images/cart/paypal.webp";
import snapFinance from "@/assets/images/cart/snapFinance.webp";
import acima from "@/assets/images/cart/acima.webp";
import { CustomImg, ProgressiveImg } from "../dynamiComponents";

const maxQuantity = 5;
const minQuantity = 1;
const paymentOptions = [
  { img: stripe, name: "Stripe", altAttr: "", titleAttr: "" },
  { img: paypal, name: "PayPal", altAttr: "", titleAttr: "" },
  { img: snapFinance, name: "Snap Finance", altAttr: "", titleAttr: "" },
  { img: acima, name: "Acima", altAttr: "", titleAttr: "" },
];

const CartPopup = () => {
  const dispatch = useDispatch();
  const contentRef = useRef(null);
  const { isCartOpen, isChecked } = useSelector(({ common }) => common);
  const {
    cartLoading,
    cartList,
    selectedCartItem,
    updateCartQtyErrorMessage,
    removeCartErrorMessage,
  } = useSelector(({ cart }) => cart);
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
      if (!cartItem.id) return;

      const payload = { cartId: cartItem.id };
      dispatch(removeProductIntoCart(payload));
    },
    [dispatch]
  );

  const getSubTotal = useCallback(() => {
    const total = cartList.reduce(
      (acc, item) => acc + item.quantityWiseSellingPrice,
      0
    );
    return helperFunctions.toFixedNumber(total);
  }, [cartList]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") dispatch(setIsCartOpen(false));
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [dispatch]);

  // Handle mouse wheel scrolling
  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement || !isCartOpen) return;

    const handleWheel = (event) => {
      event.preventDefault();
      const scrollAmount = event.deltaY;
      contentElement.scrollTop += scrollAmount;
    };

    contentElement.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      contentElement.removeEventListener("wheel", handleWheel);
    };
  }, [isCartOpen]);

  return (
    <>
      <button
        onClick={() => dispatch(setIsCartOpen(true))}
        aria-label="Open cart"
        className="relative"
      >
        <HiOutlineShoppingBag className="text-xl" />
        {cartList?.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
            {cartList.length}
          </span>
        )}
      </button>

      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50"
          onClick={() => dispatch(setIsCartOpen(false))}
        />
      )}

      <div
        className={`fixed px-4 md:px-8 top-0 right-0 h-screen w-full md:w-[500px] bg-offwhite xl:w-[600px] 3xl:w-[650px] shadow-xl z-50 transform transition-transform duration-300 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="shrink-0 p-4 border-b-2 border-[#0000001A] flex justify-between items-center pt-8 xl:pt-8 2xl:pt-10 mb-6">
            <h2 className="text-xl md:text-2xl xl:text-3xl font-medium font-castoro text-baseblack">
              My Bag({cartList.length})
            </h2>
            <button
              onClick={() => dispatch(setIsCartOpen(false))}
              className="text-xl text-baseblack font-semibold"
            >
              ✕
            </button>
          </div>

          {cartLoading ? (
            <CartPopupSkeleton />
          ) : cartList?.length ? (
            <>
              <div
                ref={contentRef}
                className="flex-1 overflow-y-auto px-2 xs:px-6"
              >
                {cartList?.map((cartItem) => (
                  <div
                    className="border-b-2 border-[#F3F2ED] last:border-b-0 pb-6 xl:pb-10 mb-10 last:mb-0"
                    key={cartItem.id}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-shrink-0 border-2 border-[#F3F2ED]">
                        <ProgressiveImg
                          src={cartItem?.productImage}
                          alt={cartItem?.productName}
                          width={100}
                          height={100}
                          className="xs:w-36 xs:h-36 md:w-44 md:h-40 object-cover"
                        />
                      </div>
                      <div className="flex-1 w-full">
                        <div>
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
                              className="border-2 border-[#0000001A] text-sm xs:text-base p-1 md:p-2 font-medium"
                              key={variItem.variationId}
                            >
                              <span className="font-bold">
                                {variItem.variationName}:{" "}
                              </span>
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
              </div>
              <div className="shrink-0 px-2 xs:px-6 bg-offwhite border-t-2 border-[#0000001A] py-2 md:py-4">
                <p className="text-lg xl:text-xl text-baseblack flex justify-between font-semibold md:pt-4">
                  Order Total: <span>${getSubTotal()}</span>
                </p>
                <p className="text-basegray text-base mb-2 mt-4">
                  Taxes and shipping calculated at checkout
                </p>
                <div className="flex items-start gap-2 mt-2 text-sm">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-2 cursor-pointer accent-primary"
                    checked={isChecked}
                    onChange={(e) => dispatch(setIsChecked(e.target.checked))}
                  />
                  <label
                    htmlFor="terms"
                    className="leading-tight text-baseblack text-sm md:text-base font-medium"
                  >
                    I have read, understood, and agree to the{" "}
                    <Link
                      href="/terms-and-conditions"
                      className="text-primary underline"
                      target="_blank"
                    >
                      Terms and Conditions
                    </Link>
                    , ,{" "}
                    <Link
                      href="/shipping-policy"
                      className="text-primary underline"
                      target="_blank"
                    >
                      Shipping Policy
                    </Link>
                    , and{" "}
                    <Link
                      href="/privacy-policy"
                      className="text-primary underline"
                      target="_blank"
                    >
                      Privacy Policy
                    </Link>
                    , and{" "}
                    <Link
                      href="/return-policy"
                      className="text-primary underline"
                      target="_blank"
                    >
                      Return Policy
                    </Link>
                    .
                  </label>
                </div>

                <LinkButton
                  href="/checkout"
                  className={`!text-white !rounded-none !font-medium !mt-4 w-full !py-2 md:!py-6 !bg-primary !text-lg hover:!border-primary hover:!bg-transparent hover:!text-primary !border-[#0000001A] ${
                    !isChecked ? "cursor-not-allowed" : ""
                  }`}
                  onClick={(e) => {
                    if (!isChecked) e.preventDefault();
                    dispatch(setIsCartOpen(false));
                  }}
                >
                  SECURE CHECKOUT
                </LinkButton>

                <div className="mt-2 md:mt-6">
                  <div className="flex items-center gap-3">
                    <p className="font-medium text-base md:text-lg text-gray-500">
                      Pay With:
                    </p>
                    <div className="flex gap-3 xl:gap-6 flex-wrap">
                      {paymentOptions.map((option, index) => (
                        <CustomImg
                          key={index}
                          srcAttr={option.img}
                          titleAttr={option.titleAttr}
                          altAttr={option.altAttr}
                          className="object-contain h-10 w-10 md:h-12 md:w-12 xl:h-auto xl:w-auto"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center h-[80vh] justify-center text-center px-4">
              <CustomImg
                srcAttr={cartImage}
                altAttr=""
                titleAttr=""
                className="mb-6 w-70 h-50"
              />
              <p className="text-lg md:text-xl 2xl:text-3xl font-medium font-castoro text-baseblack">
                Oops! Your cart is empty. Let’s fix that <br /> with some
                stunning jewelry
              </p>
              <LinkButton
                href="/"
                className="!text-white !rounded-none !font-medium !mt-8 w-fit !px-16 !py-6 !bg-primary !text-lg hover:!border-black hover:!bg-black hover:!text-white !border-[#0000001A] !border-2 uppercase"
                onClick={() => dispatch(setIsCartOpen(false))}
              >
                Back To Shop
              </LinkButton>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartPopup;

const CartPopupSkeleton = () => {
  const skeletons = [
    { width: "w-full", height: "h-2", margin: "mt-2" },
    { width: "w-full", height: "h-4", margin: "mt-2" },
    { width: "w-full", height: "h-4", margin: "mt-2" },
    { width: "w-full", height: "h-4", margin: "mt-2" },
    { width: "w-full", height: "h-4", margin: "mt-2" },
    { width: "w-full", height: "h-8", margin: "mt-2" },
  ];
  return (
    <div className="container grid grid-cols-1 gap-6 pt-6">
      <div className="grid grid-cols-1 gap-4 auto-rows-min">
        <SkeletonLoader height="w-full h-[100px] md:h-[200px] 2xl:h-[250px]" />
        <SkeletonLoader height="w-full h-[100px] md:h-[200px] 2xl:h-[250px]" />
      </div>
      <div>
        {Array(1)
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
