"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CiHeart } from "react-icons/ci";
import stripe from "@/assets/images/stripe.webp";
import paypal from "@/assets/images/paypal.webp";
import CustomImg from "@/components/custom-img";
import { useParams } from "next/navigation";
import { helperFunctions } from "@/_helper";
import { fetchProductDetailByProductName } from "@/_actions/product.actions";
import { useDispatch, useSelector } from "react-redux";
import VariationsList from "@/components/VariationsList";
import { ProgressiveImg } from "@/components/dynamiComponents";
import DetailPageSkeleton from "@/components/DetailPageSkeleton";
import KeyFeatures from "@/components/KeyFeatures";
export const minProductQuantity = 1;
export const maxProductQuantity = 5;
import {
  setSelectedVariations,
  setProductQuantity,
} from "@/store/slices/productSlice";
import { insertProductIntoCart } from "@/_actions/cart.action";

const shippingInfo = [
  {
    icon: "📞",
    altAttr: "",
    titleAttr: "",
    text: "Please call us: +1-800-282-2242",
  },
  {
    icon: "🔄",
    altAttr: "",
    titleAttr: "",
    text: "Free 30 Day Returns, Free Resizing, Free Lifetime Warranty.",
  },
  {
    icon: "✅",
    altAttr: "",
    titleAttr: "",
    text: "We inspect & verify authenticity before shipping. 100% Money-Back Guarantee.",
  },
];

const paymentOptions = [
  { img: stripe, name: "Stripe", altAttr: "", titleAttr: "" },
  { img: paypal, name: "PayPal", altAttr: "", titleAttr: "" },
];

const ProductDetails = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  let { productName } = params;
  const [isSubmitted, setIsSubmitted] = useState(false);
  let availableQty = 0;
  let price = 0;

  const { productDetail, productLoading, selectedVariations, productQuantity } =
    useSelector(({ product }) => product);
  const { cartErrorMessage, cartList, cartLoading } = useSelector(
    ({ cart }) => cart
  );
  productName = helperFunctions.stringReplacedWithSpace(productName);

  const loadData = useCallback(() => {
    dispatch(fetchProductDetailByProductName(productName));
  }, [dispatch, productName]);

  useEffect(() => {
    loadData();
    dispatch(setProductQuantity(1));
    dispatch(setSelectedVariations([]));
  }, [productName]);

  if (
    Array.isArray(productDetail?.variComboWithQuantity) &&
    Array.isArray(selectedVariations) &&
    selectedVariations.length > 0
  ) {
    const { price: productPrice, quantity } =
      helperFunctions.getVariComboPriceQty(
        productDetail.variComboWithQuantity,
        selectedVariations
      );

    availableQty = quantity;
    price = productPrice;
  }

  const handleQuantityChange = useCallback(
    (type) => {
      if (
        type === "increase" &&
        productQuantity < maxProductQuantity &&
        productQuantity < availableQty
      ) {
        setProductQuantity((productQuantity || 1) + 1);
      } else if (type === "decrease" && productQuantity > minProductQuantity) {
        setProductQuantity((productQuantity || 1) - 1);
      }
    },
    [availableQty, productQuantity]
  );

  const handleSelect = (variationId, variationTypeId) => {
    const updated = [
      ...selectedVariations.filter((item) => item.variationId !== variationId),
      { variationId, variationTypeId },
    ];
    dispatch(setSelectedVariations(updated));
  };

  const getSelectedPrice = () => {
    if (
      !productDetail?.variComboWithQuantity ||
      selectedVariations.length === 0
    )
      return null;

    return productDetail.variComboWithQuantity.find((combo) =>
      combo.combination.every((item) =>
        selectedVariations.some(
          (selected) =>
            selected.variationId === item.variationId &&
            selected.variationTypeId === item.variationTypeId
        )
      )
    )?.price;
  };

  const selectedPrice = getSelectedPrice();

  useEffect(() => {
    if (productDetail?.variations) {
      const initialSelections = productDetail.variations.map((variation) => ({
        variationId: variation.variationId,
        variationTypeId: variation.variationTypes[0]?.variationTypeId,
      }));
      dispatch(setSelectedVariations(initialSelections));
    }
  }, [productDetail]);

  const isInValidSelectedVariation = useCallback(() => {
    if (productDetail?.variations?.length !== selectedVariations?.length) {
      return true;
    } else {
      return false;
    }
  }, [productDetail?.variations?.length, selectedVariations?.length]);

  const addToCartHandler = useCallback(async () => {
    setIsSubmitted(true);
    if (
      isInValidSelectedVariation() ||
      !availableQty ||
      availableQty < productQuantity ||
      !productQuantity
    ) {
      return;
    }
    const payload = {
      productId: productDetail?.id,
      quantity: productQuantity,
      variations: selectedVariations?.map((selectedVari) => ({
        variationId: selectedVari?.variationId,
        variationTypeId: selectedVari?.variationTypeId,
      })),
    };

    const response = await dispatch(insertProductIntoCart(payload));
    if (response) {
      router.push("/cart");
    }
  }, [
    productQuantity,
    availableQty,
    dispatch,
    isInValidSelectedVariation,
    productDetail?.id,
    selectedVariations,
  ]);

  return (
    <>
      {productLoading ? (
        <DetailPageSkeleton />
      ) : (
        <>
          <div className="container grid grid-cols-1 lg:grid-cols-[55%_auto] gap-12">
            <div className="grid grid-cols-1 xss:grid-cols-2 gap-4 auto-rows-min">
              {productDetail?.video && (
                <video
                  autoPlay
                  loop
                  muted
                  height={100}
                  width={100}
                  playsInline
                  className="w-full object-cover"
                >
                  <source src={productDetail.video} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              {productDetail?.thumbnailImage && (
                <ProgressiveImg
                  src={productDetail?.thumbnailImage}
                  width={100}
                  height={100}
                  alt="Ring"
                  className="cursor-pointer transition-all duration-300 w-full"
                />
              )}
              {productDetail?.images?.map((media, index) => (
                <ProgressiveImg
                  key={index}
                  src={media?.image}
                  width={100}
                  height={100}
                  alt="Ring"
                  className="cursor-pointer transition-all duration-300 w-full"
                />
              ))}
            </div>

            <div className="flex flex-col space-y-4 lg:p-6">
              <h2 className="text-2xl md:text-3xl font-medium">
                {productDetail?.productName}
              </h2>
              <div className="flex items-center gap-2 mt-2 xl:mt-4 !mb-4 lg:!mb-6">
                <span className="text-2xl md:text-3xl xl:text-4xl font-normal font-castoro">
                  {selectedPrice
                    ? `$${(
                        selectedPrice *
                        productQuantity *
                        (1 - productDetail.discount / 100)
                      ).toFixed(2)}`
                    : "N/A"}
                </span>

                <span className="text-gray-500 line-through text-xl font-castoro">
                  ${(selectedPrice * productQuantity).toFixed(2)}
                </span>
                <span className="bg-primary text-white px-2 py-2 text-xs font-medium rounded">
                  {`You Save ${productDetail.discount}%`}
                </span>
              </div>

              <div className="border-t my-6 border-[#0000001A]" />

              <div className="!mt-8 lg:!mt-12 flex items-center gap-3">
                <p className="font-medium text-lg min-w-[110px] xs:min-w-[120px]">
                  Qty:
                </p>
                <div className="flex items-center py-2 bg-white">
                  <button
                    className={`px-3 text-xl font-medium text-baseblack ${
                      productQuantity <= minProductQuantity || !availableQty
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() =>
                      dispatch(
                        setProductQuantity(Math.max(1, productQuantity - 1))
                      )
                    }
                    disabled={
                      productQuantity <= minProductQuantity || !availableQty
                    }
                  >
                    −
                  </button>

                  <span className="px-4 text-xl font-medium text-primary">
                    {productQuantity}
                  </span>
                  <button
                    className={`px-3 text-xl font-medium text-baseblack ${
                      productQuantity >= maxProductQuantity ||
                      productQuantity >= availableQty
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    onClick={() =>
                      dispatch(
                        setProductQuantity(
                          Math.min(maxProductQuantity, productQuantity + 1)
                        )
                      )
                    }
                    disabled={
                      productQuantity >= maxProductQuantity ||
                      productQuantity >= availableQty
                    }
                  >
                    +
                  </button>
                </div>
              </div>

              <VariationsList
                variations={productDetail?.variations}
                selectedVariations={selectedVariations}
                handleSelect={handleSelect}
              />

              <div className="!mt-8 lg:!mt-12 flex gap-4 items-center">
                <button
                  className={`flex-1 bg-primary text-lg font-medium text-white xss:px-6 py-3 ${
                    (!availableQty && !isInValidSelectedVariation()) ||
                    cartLoading
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  onClick={addToCartHandler}
                  disabled={
                    (!availableQty && !isInValidSelectedVariation()) ||
                    cartLoading
                  }
                >
                  {cartLoading ? (
                    <>
                      <span className="loader"></span> Adding...
                    </>
                  ) : !availableQty && !isInValidSelectedVariation() ? (
                    "Out of stock"
                  ) : (
                    "ADD TO BAG"
                  )}
                </button>

                <button className="p-3 hover:bg-gray-100 transition-all w-14 h-14">
                  <CiHeart className="w-full h-full text-primary" />
                </button>
              </div>
              {isSubmitted && !selectedVariations?.length ? (
                <p className="text-danger">Please select variants</p>
              ) : null}
              {isSubmitted && cartErrorMessage ? (
                <p className="text-red-600 text-lg">{cartErrorMessage}</p>
              ) : null}

              <div className="!mt-4 lg:!mt-6 flex items-center gap-3">
                <p className="font-medium text-xl text-gray-500">Pay With:</p>
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

              <div className="!mt-6 lg:!mt-8 p-4 bg-white">
                <p className="font-medium text-lg md:text-xl">
                  Estimate Ship Date Monday, April 7
                </p>
                <ul className="mt-3">
                  {shippingInfo.map((info, index) => (
                    <li
                      key={index}
                      className="flex gap-4 items-center font-medium text-base md:text-lg mt-2"
                    >
                      <span>{info.icon}</span>
                      <span>{info.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="container pt-10 lg:pt-20 2xl:pt-36 md:p-6">
            <ProductDetailsTabs productDetail={productDetail} />
          </div>
          <section className="pt-10 lg:pt-20 2xl:pt-36 container">
            <KeyFeatures />
          </section>
        </>
      )}
    </>
  );
};

export default ProductDetails;

const ProductDetailsTabs = ({ productDetail }) => {
  const [activeTab, setActiveTab] = useState("Product Detail");
  const [open, setOpen] = useState(false);

  const tabData = {
    "Product Detail": (
      <div className="flex flex-wrap gap-6 md:gap-16 xl:gap-32 mt-4">
        <div>
          <p className="font-medium text-lg xl:text-2xl text-baseblack">
            Information
          </p>
          {productDetail?.sku && (
            <p className="pt-4 text-lg xl:text-xl text-baseblack">
              SKU: {productDetail?.sku}
            </p>
          )}
          {productDetail?.shortDescription && (
            <p className="pt-4 text-lg xl:text-xl text-baseblack">
              {productDetail?.shortDescription}
            </p>
          )}
          <p className="pt-4 text-lg xl:text-xl text-baseblack">
            Diamond Type: Lab Grown Diamond
          </p>
          {productDetail?.settingStyleNamesWithImg?.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4">
              <p className=" text-lg xl:text-xl text-baseblack">
                Setting Style:
              </p>
              {productDetail?.settingStyleNamesWithImg.map((style, index) => (
                <div className="flex flex-wrap gap-2" key={index}>
                  <p className=" text-lg xl:text-xl text-baseblack">
                    {style?.title}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    ),
    Description: productDetail?.description ? (
      <div
        className="mt-4 text-lg xl:text-xl text-baseblack"
        dangerouslySetInnerHTML={{ __html: productDetail.description }}
      />
    ) : (
      <p className="mt-4 text-lg xl:text-xl text-baseblack">
        No Description Available
      </p>
    ),
    "Shipping & Returns": (
      <div className="flex flex-wrap gap-6 mt-4">
        <p className="text-lg xl:text-xl text-baseblack">
          <span className="font-medium">Fast & Secure Shipping – </span>
          Orders are processed within 1-2 business days and shipped via reliable
          carriers like UPS, FedEx, or USPS.
        </p>
        <p className="text-lg xl:text-xl text-baseblack">
          <span className="font-medium">Fast & Secure Shipping – </span>
          Orders are processed within 1-2 business days and shipped via reliable
          carriers like UPS, FedEx, or USPS.
        </p>
        <p className="text-lg xl:text-xl text-baseblack">
          <span className="font-medium">Delivery Time –</span>
          Standard shipping takes 3-7 business days, while expedited options are
          available for faster delivery.
        </p>
        <p className="text-lg xl:text-xl text-baseblack">
          <span className="font-medium">Shipping Fees – </span>
          Free shipping on orders over [Specify Amount], with calculated rates
          for express or international shipping.
        </p>
        <p className="text-lg xl:text-xl text-baseblack">
          <span className="font-medium">Order Tracking – </span>A tracking
          number is provided once your order ships, allowing you to monitor your
          package in real time.
        </p>
        <p className="text-lg xl:text-xl text-baseblack">
          <span className="font-medium">Return Window –</span>
          Items can be returned within [Specify Days, e.g., 14-30 days] of
          delivery for a refund or exchange.
        </p>
        <p className="text-lg xl:text-xl text-baseblack">
          <span className="font-medium">Return Condition –</span>
          Items must be unworn, in original packaging, and accompanied by proof
          of purchase.
        </p>
        <p className="text-lg xl:text-xl text-baseblack">
          <span className="font-medium">Non-Returnable Items – </span>
          Custom or engraved jewelry, final sale items, and used pieces cannot
          be returned.
        </p>
        <p className="text-lg xl:text-xl text-baseblack">
          <span className="font-medium">Refund Processing –</span>
          Refunds are issued to the original payment method within [Specify
          Days] after the return is received and inspected.
        </p>
        <p className="text-lg xl:text-xl text-baseblack">
          <span className="font-medium">Damaged or Incorrect Items – </span>
          If your order arrives damaged or incorrect, contact us immediately for
          a resolution.
        </p>
      </div>
    ),
  };

  return (
    <div className="mt-6">
      {/* Mobile Dropdown */}
      <div className="relative md:hidden mb-4">
        <button
          onClick={() => setOpen(!open)}
          className="w-full border border-gray-300 px-4 py-2 text-sm bg-white text-left uppercase"
        >
          {activeTab}
          <span className="float-right">▼</span>
        </button>
        {open && (
          <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 shadow-md uppercase">
            {Object.keys(tabData).map((tab) => (
              <li
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  setOpen(false);
                }}
                className={`px-4 py-2 text-sm cursor-pointer transition ${
                  activeTab === tab
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-primary hover:text-white"
                }`}
              >
                {tab}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Desktop Tabs */}
      <div className="hidden md:flex gap-6 xl:gap-36 border-b">
        {Object.keys(tabData).map((tab) => (
          <button
            key={tab}
            className={`py-2 text-lg font-medium ${
              activeTab === tab
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="md:p-4 w-full">
        {tabData[activeTab] || <p>No Data</p>}
      </div>
    </div>
  );
};
