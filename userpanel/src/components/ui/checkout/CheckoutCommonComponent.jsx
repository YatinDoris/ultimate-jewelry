"use client";
import { useCallback, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { helperFunctions } from "@/_helper";
import { CustomImg, ProgressiveImg } from "../../dynamiComponents";
import stripe from "@/assets/images/cart/stripe.webp";
import paypal from "@/assets/images/cart/paypal.webp";
import snapFinance from "@/assets/images/cart/snapFinance.webp";
import acima from "@/assets/images/cart/acima.webp";

const CheckoutCommonComponent = () => {
  const { cartList } = useSelector((state) => state.cart);
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
  const paymentOptions = [
    { img: stripe, name: "Stripe", altAttr: "", titleAttr: "" },
    { img: paypal, name: "PayPal", altAttr: "", titleAttr: "" },
    { img: snapFinance, name: "Snap Finance", altAttr: "", titleAttr: "" },
    { img: acima, name: "Acima", altAttr: "", titleAttr: "" },
  ];

  useEffect(() => {
    const contentElement = cartContentRef.current;
    if (!contentElement) return;

    const handleWheel = (event) => {
      event.preventDefault();
      event.stopPropagation();

      const scrollAmount = event.deltaY;
      const maxScroll =
        contentElement.scrollHeight - contentElement.clientHeight;
      const currentScroll = contentElement.scrollTop + scrollAmount;

      contentElement.scrollTop = Math.max(
        0,
        Math.min(currentScroll, maxScroll)
      );
    };

    contentElement.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      contentElement.removeEventListener("wheel", handleWheel);
    };
  }, []);

  const cartContentRef = useRef(null);
  return (
    <div className="flex flex-col gap-6 pt-8 lg:pt-12 h-fit">
      <section
        className="bg-white px-2 xs:px-6 flex-1 overflow-y-auto max-h-[45vh]"
        ref={cartContentRef}
      >
        {cartList?.map((cartItem) => (
          <div
            className="bg-white py-6  border-b-2 border-[#F3F2ED] last:border-b-0"
            key={cartItem.id}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex-shrink-0 border border-[#F3F2ED]">
                <ProgressiveImg
                  src={cartItem?.productImage}
                  alt={cartItem?.productName}
                  className="w-36 h-36 md:w-36  md:h-36 object-cover"
                />
              </div>
              <div className="flex-1 w-full">
                <p className="text-lg font-semibold">{cartItem.productName}</p>

                <p className="text-2xl font-medium font-castoro pt-1">
                  $
                  {helperFunctions.toFixedNumber(
                    cartItem?.quantityWiseSellingPrice
                  )}
                  {cartItem?.productDiscount ? (
                    <span className="text-lg text-gray-500 line-through ml-2">
                      $
                      {helperFunctions.toFixedNumber(
                        cartItem?.quantityWisePrice
                      )}
                    </span>
                  ) : null}
                </p>
                <div className="text-baseblack flex flex-wrap gap-2 md:gap-x-4 md:gap-y-2 pt-2">
                  {cartItem.variations.map((variItem) => (
                    <div
                      className="border-2  text-sm xs:text-base px-2 font-medium"
                      key={variItem.variationId}
                    >
                      <span className="font-bold">
                        {variItem.variationName}:{" "}
                      </span>{" "}
                      {variItem.variationTypeName}
                    </div>
                  ))}
                </div>

                <div className="border-2  text-sm xs:text-base px-2 font-medium w-fit mt-2">
                  <span className="font-bold">Quantity: </span>{" "}
                  {cartItem?.quantity}
                </div>
              </div>
            </div>
          </div>
        ))}
      </section>
      <section className="bg-white px-2 xs:px-10 pt-10">
        <p className="text-lg xl:text-xl text-baseblack flex justify-between font-semibold">
          Order Summary
        </p>
        <p className="my-4 border-t-2 border-[#0000001A]" />
        <p className="text-lg xl:text-xl text-baseblack flex justify-between font-semibold pt-2">
          Order Total: <span className="">${getOrderTotal()}</span>
        </p>
        <p className="text-lg xl:text-xl text-baseblack flex justify-between font-semibold pt-4">
          Discount Offer: <span className="">-${getDiscountTotal()}</span>
        </p>
        <p className="text-lg xl:text-xl text-baseblack flex justify-between font-semibold pt-4">
          Subtotal: <span className="">${getSubTotal()}</span>
        </p>
        <p className="my-4 border-t-2 border-[#0000001A]" />
        <p className="text-lg xl:text-xl text-baseblack flex justify-between font-semibold ">
          Grand Total: <span>${grandTotal}</span>
        </p>
        <div className="pt-12 pb-10">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex-grow h-px bg-gray-300" />
            <p className="text-sm md:text-lg font-medium text-baseblack uppercase whitespace-nowrap">
              We Accept Payment
            </p>
            <div className="flex-grow h-px bg-gray-300" />
          </div>

          <div className="flex items-center gap-3">
            <p className="font-medium text-lg text-gray-500">Pay With:</p>
            <div className="flex gap-3 xl:gap-6 flex-wrap">
              {paymentOptions.map((option, index) => (
                <CustomImg
                  key={index}
                  srcAttr={option.img}
                  titleAttr={option.titleAttr}
                  altAttr={option.altAttr}
                  alt={option}
                  className="object-contain w-8 h-10 xs:w-10 xs:h-10 md:h-12 md:w-12 2xl:h-16 2xl:w-16"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CheckoutCommonComponent;
