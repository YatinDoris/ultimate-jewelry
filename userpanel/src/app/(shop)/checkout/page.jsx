"use client";
import { CustomImg, ProgressiveImg } from "@/components/dynamiComponents";
import CommonBgHeading from "@/components/ui/CommonBgHeading";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { helperFunctions } from "@/_helper";
import stripe from "@/assets/images/cart/stripe.webp";
import paypal from "@/assets/images/cart/paypal.webp";
import snapFinance from "@/assets/images/cart/snapFinance.webp";
import acima from "@/assets/images/cart/acima.webp";

const Checkout = () => {
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

  console.log("cartList", cartList);
  return (
    <div className="mx-auto pt-10 lg:pt-10 2xl:pt-12">
      <CommonBgHeading
        title="Secure Checkout"
        backText="Back to Back"
        backHref="/cart"
      />
      <div className="grid grid-cols-1 lg:grid-cols-[55%_auto] gap-6 container mx-auto```">
        <div className="flex flex-col gap-6 py-8">
          <section className="border-2 border-[#0000001A] px-4">
            <h2 className="text-lg text-baseblack font-semibold pt-8">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div>
                <label className="block text-sm font-semibold text-[#666666] mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  placeholder="First name"
                  className="w-full px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#666666] mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  placeholder="Last name"
                  className="w-full  px-3 py-2"
                />
              </div>
              <div className="md:col-span-2 ">
                <label className="block text-sm font-semibold text-[#666666] mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="Phone number"
                  className="w-full  px-3 py-2"
                />
              </div>
              <div className="md:col-span-2 pb-8">
                <label className="block text-sm font-semibold text-[#666666] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full  px-3 py-2"
                />
              </div>
            </div>
          </section>

          {/* Shipping Address */}
          <section className="border-2 border-[#0000001A] px-4">
            <h2 className="text-lg font-semibold pt-6">Shipping Address</h2>
            <div className="flex flex-col gap-6 pt-8">
              <div>
                <label className="block text-sm font-semibold text-[#666666] mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  placeholder="Street Address"
                  className="w-full px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#666666] mb-1">
                  Country *
                </label>
                <input
                  type="text"
                  placeholder="Country"
                  className="w-full  px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-[#666666] mb-1">
                  Town / City *
                </label>
                <input
                  type="text"
                  placeholder="Town / City"
                  className="w-full  px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
                <div>
                  <label className="block text-sm font-semibold text-[#666666] mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    placeholder="State"
                    className="w-full  px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#666666] mb-1">
                    Zip Code
                  </label>
                  <input
                    type="text"
                    placeholder="Zip Code"
                    className="w-full  px-3 py-2"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Submit Button */}
          <div>
            <button className="w-full bg-primary text-white font-semibold py-3  hover:bg-black   transition duration-300">
              CONTINUE PAYMENT
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6 py-8">
          <section className="bg-white px-4 xs:px-6">
            {cartList?.map((cartItem) => (
              <div
                className="bg-white mb-6 py-6  border-b-2 border-[#F3F2ED] last:border-b-0"
                key={cartItem.id}
              >
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex-shrink-0 border border-[#F3F2ED]">
                    <ProgressiveImg
                      src={cartItem?.productImage}
                      alt={cartItem?.productName}
                      width={100}
                      height={100}
                      className="w-36 h-36 md:w-36  md:h-36 object-cover"
                    />
                  </div>
                  <div className="flex-1 w-full">
                    <p className="text-lg font-semibold">
                      {cartItem.productName}
                    </p>

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
          <section className="bg-white px-6 xs:px-10 pt-10">
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
                <div className="flex gap-6 flex-wrap">
                  {paymentOptions.map((option, index) => (
                    <CustomImg
                      key={index}
                      srcAttr={option.img}
                      titleAttr={option.titleAttr}
                      altAttr={option.altAttr}
                      alt={option}
                      className="object-contain"
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
