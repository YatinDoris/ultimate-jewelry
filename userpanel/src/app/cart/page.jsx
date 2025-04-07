"use client";
import { useCallback, useState, useEffect } from "react";
import deleteIcon from "@/assets/icons/delete.svg";
import product1 from "@/assets/images/cart/product.png";
import { CustomImg, ProgressiveImg } from "@/components/dynamiComponents";
import stripe from "@/assets/images/stripe.webp";
import paypal from "@/assets/images/paypal.webp";
import KeyFeatures from "@/components/KeyFeatures";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  handleSelectCartItem,
  removeProductIntoCart,
  updateProductQuantityIntoCart,
} from "@/_actions/cart.action";
import { helperFunctions } from "@/_helper";
import Link from "next/link";
import { LinkButton } from "@/components/button";
import { useRouter } from "next/router";

const maxQuantity = 5;
const minQuantity = 1;
const paymentOptions = [
  { img: stripe, name: "Stripe", altAttr: "", titleAttr: "" },
  { img: paypal, name: "PayPal", altAttr: "", titleAttr: "" },
];

const Cart = () => {
  const dispatch = useDispatch();
  const [deleteLoader, setDeleteLoader] = useState(false);
  // const router = useRouter();

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

  const onCheckOutHandler = useCallback(() => {
    // router.push("/checkout");
  });

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
      (acc, item) => acc + item.quantity * item.quantityWisePrice,
      0
    );
    return helperFunctions.toFixedNumber(total);
  }, [cartList]);

  const getDiscountTotal = useCallback(() => {
    const totalDiscount = cartList.reduce((acc, item) => {
      if (item.productDiscount) {
        return (
          acc +
          item.quantity *
            (item.quantityWisePrice - item.quantityWiseSellingPrice)
        );
      }
      return acc;
    }, 0);
    return helperFunctions.toFixedNumber(totalDiscount);
  }, [cartList]);

  const getSubTotal = useCallback(() => {
    const total = cartList.reduce(
      (acc, item) => acc + item.quantity * item.quantityWiseSellingPrice,
      0
    );
    return helperFunctions.toFixedNumber(total);
  }, [cartList]);

  const grandTotal = getSubTotal();

  // const grandTotal = subtotal + tax;
  return (
    <>
      <section className="bg-[#F3F2ED] justify-center flex text-center py-6">
        <p className="text-2xl lg:text-3xl 2xl:text-4xl text-baseblack font-castoro">
          Secure Shopping Cart
        </p>
      </section>

      <div className="container mx-auto flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/3">
          {/* {products.map((product) => (
            <div className="bg-white mb-6 py-6 px-2 xs:px-6" key={product.id}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
               
                <div className="flex-shrink-0 border border-[#F3F2ED]">
                  <CustomImg
                    src={product.image}
                    alt={product.name}
                    className="w-36 h-36 md:w-40 md:h-40 object-cover"
                  />
                </div>

                <div className="flex-1 w-full">
                  <div className="flex flex-col xs:flex-row xs:justify-between text-center items-center">
                    <h3 className="text-lg font-medium">{product.name}</h3>
                    <p className="text-2xl font-medium font-castoro">
                      ${product.price}
                    </p>
                  </div>

                  <div className="text-baseblack flex flex-wrap gap-2 md:gap-x-4 md:gap-y-2 pt-4">
                    <div className="border border-gray-300 text-sm xs:text-lg p-1 md:p-2 font-medium">
                      <span className="font-semibold">Style:</span>{" "}
                      {product.style}
                    </div>
                    <div className="border border-gray-300 text-sm xs:text-lg p-1 md:p-2 font-medium">
                      <span className="font-semibold">Ring Size: </span>{" "}
                      {product.ringSize}"
                    </div>
                    <div className="border border-gray-300 text-sm xs:text-lg p-1 md:p-2 font-medium">
                      <span className="font-semibold">Metal: </span>{" "}
                      {product.metal}
                    </div>
                    <div className="border border-gray-300 text-sm xs:text-lg p-1 md:p-2 font-medium">
                      <span className="font-semibold">Color: </span>{" "}
                      {product.color}
                    </div>
                  </div>

                 
                  <div className="flex items-center space-x-2 pt-4">
                    <h3 className="text-lg font-medium">Qty:</h3>
                    <div className="flex items-center bg-gray-100  px-2">
                      <button
                        className={`px-3 py-1 text-xl font-medium text-black ${
                          quantity === 1 ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity === 1}
                      >
                        −
                      </button>
                      <span className="px-4 text-xl font-medium text-black">
                        {quantity}
                      </span>
                      <button
                        className="px-3 py-1 text-xl font-medium text-black"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

             
              <p className="text-lg font-medium text-baseblack mt-4 text-center md:text-left">
                You Saved ${product.savings} On This Product.{" "}
                {product.freeShipping && "| Free Shipping On This Order."}
              </p>
            </div>
          ))} */}

          {cartList?.map((cartItem) => (
            <div className="bg-white mb-6 py-6 px-2 xs:px-6" key={cartItem.id}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex-shrink-0 border border-[#F3F2ED]">
                  <ProgressiveImg
                    src={cartItem?.productImage}
                    alt={cartItem?.productName}
                    width={100}
                    height={100}
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

                    {/* <p className="text-2xl font-medium font-castoro">
                      ${cartItem.quantityWiseSellingPrice}
                    </p> */}
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
                        className="border border-gray-300 text-sm xs:text-lg p-1 md:p-2 font-medium"
                        key={variItem.variationId}
                      >
                        <span className="font-semibold">
                          {variItem.variationName}:{" "}
                        </span>{" "}
                        {variItem.variationTypeName}
                      </div>
                    ))}
                  </div>
                  {/* Quantity Control */}
                  <div className="flex items-center space-x-2 pt-4">
                    <h3 className="text-lg font-medium">Qty:</h3>
                    <div className="flex items-center bg-[#F3F2ED] px-2">
                      <button
                        className={`px-3 py-1 text-xl font-medium text-black ${
                          cartItem?.quantity <= minQuantity
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => handleCartQuantity("decrease", cartItem)}
                        disabled={cartItem?.quantity <= minQuantity}
                      >
                        −
                      </button>
                      <span className="px-4 text-xl font-medium text-black">
                        {cartItem.quantity}
                      </span>
                      <button
                        className={`px-3 py-1 text-xl font-medium text-black ${
                          cartItem?.quantity >= maxQuantity ||
                          cartItem.quantity >= cartItem.productQuantity
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        onClick={() => handleCartQuantity("increase", cartItem)}
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
                        altAttr="delete icon"
                        className="w-8 h-8 transition-transform duration-200 hover:scale-125"
                      />
                    </button>
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

        <div className="w-full lg:w-1/3 bg-white py-6 px-2 xs:px-6  self-start">
          <div className="space-y-2">
            <p className="font-medium text-lg xl:text-xl text-baseblack flex justify-between">
              Order Total: <span className="">${getOrderTotal()}</span>
            </p>
            <p className="font-medium text-lg xl:text-xl text-baseblack flex justify-between">
              Discount Offer: <span className="">-${getDiscountTotal()}</span>
            </p>
            <p className="font-medium text-lg xl:text-xl text-baseblack flex justify-between">
              Subtotal: <span className="">${getSubTotal()}</span>
            </p>
            <p className="!my-6 border-t-2 border-[#0000001A]" />
            <p className="font-medium text-lg xl:text-xl text-baseblack flex justify-between">
              Grand Total: <span>${grandTotal}</span>
            </p>
          </div>
          <button
            onClick={onCheckOutHandler}
            className="w-full text-lg font-medium bg-primary text-white py-2 mt-10"
          >
            SECURE CHECKOUT
          </button>
          <p className="text-sm font-medium text-baseblack mt-2">
            Made-To-Order. Estimated Ship Date: Wednesday, April 9th
          </p>

          <div className="!mt-4 lg:!mt-6 flex items-center gap-3">
            <p className="font-medium text-lg text-gray-500">Pay With:</p>
            <div className="flex gap-3">
              {paymentOptions.map((option, index) => (
                <CustomImg
                  key={index}
                  srcAttr={option.img}
                  alt={option}
                  className="object-contain"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <section className="pt-10 lg:pt-20 2xl:pt-36 container">
        <KeyFeatures />
      </section>
    </>
  );
};

export default Cart;
