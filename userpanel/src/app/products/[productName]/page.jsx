"use client";
import { useCallback, useEffect, useState } from "react";
import { CiHeart } from "react-icons/ci";
import stripe from "@/assets/images/products/stripe.png";
import pricing from "@/assets/icons/pricing.svg";
import shippingPrimary from "@/assets/icons/shippingPrimary.svg";
import warranty from "@/assets/icons/warranty.svg";
import returns from "@/assets/icons/returns.svg";

import CustomImg from "@/components/custom-img";
import { useParams } from "next/navigation";
import { helperFunctions } from "@/_helper";
import { fetchProductDetailByProductName } from "@/_actions/product.actions";
import { useDispatch, useSelector } from "react-redux";
import VariationsList from "@/components/VariationsList";

const features = [
  {
    icon: pricing,
    title: "Competitive Pricing",
    description:
      "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Integer Egestas Nisi Nec Libero Fermentum.",
  },
  {
    icon: shippingPrimary,
    title: "Free Shipping",
    description:
      "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Integer Egestas Nisi Nec Libero Fermentum.",
  },
  {
    icon: returns,
    title: "Free Returns",
    description:
      "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Integer Egestas Nisi Nec Libero Fermentum.",
  },
  {
    icon: warranty,
    title: "Lifetime Warranty",
    description:
      "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Integer Egestas Nisi Nec Libero Fermentum.",
  },
];

const productDetails = {
  name: "Shared Prong Round Eternity Band",
  price: 1995,
  originalPrice: 2099,
  discount: "You Save 15%",
  rating: 4.5,
  reviewsCount: 30,
  colors: [
    { name: "Yellow Gold", value: "#D4AF37", key: "yellow-gold" },
    { name: "White Gold", value: "#E5E4E2", key: "white-gold" },
    { name: "Rose Gold", value: "#B76E79", key: "rose-gold" },
  ],
  metalTypes: ["14K", "10K"],
  ringSizes: ['6"', '6.5"', '7"', '7.5"', '8"'],
  // ringShapes: [
  //   { img: cushion, name: "Cushion" },
  //   { img: princess, name: "Princess" },
  //   { img: round, name: "Round" },
  //   { img: pear, name: "Pear" },
  //   { img: radiant, name: "Radiant" },
  //   { img: princess, name: "Marquise" },
  //   { img: emerald, name: "Emerald" },
  //   { img: oval, name: "Oval" },
  //   { img: heart, name: "Heart" },
  // ],
  paymentOptions: [{ img: stripe, name: "Stripe" }],
  offer: {
    title: "ENDS SOON!",
    description:
      "Receive Lab Diamond Studs With Purchase Over $1,000. Use Code RING in Cart.",
    terms: "*See Terms",
    image: "/offer-image.jpg",
  },
  shippingInfo: [
    { icon: "📞", text: "Please call us: +1-800-282-2242" },
    {
      icon: "🔄",
      text: "Free 30 Day Returns, Free Resizing, Free Lifetime Warranty.",
    },
    {
      icon: "✅",
      text: "We inspect & verify authenticity before shipping. 100% Money-Back Guarantee.",
    },
  ],
  estimatedShipDate: "Monday, April 7",
};

const ProductDetails = () => {
  const params = useParams();
  const dispatch = useDispatch();
  let { productName } = params;
  const [selectedVariations, setSelectedVariations] = useState({});

  const { productDetail } = useSelector(({ product }) => product);
  productName = helperFunctions.stringReplacedWithSpace(productName);

  const [quantity, setQuantity] = useState(1);
  const [hoveredNames, setHoveredNames] = useState({});

  const loadData = useCallback(() => {
    dispatch(fetchProductDetailByProductName(productName));
  }, [dispatch, productName]);

  useEffect(() => {
    loadData();
  }, [productName]);

  const handleSelect = (variationId, variationTypeId) => {
    setSelectedVariations((prev) => ({
      ...prev,
      [variationId]: variationTypeId,
    }));
  };

  const handleHover = (variationId, variationTypeName) => {
    setHoveredNames((prev) => ({
      ...prev,
      [variationId]: variationTypeName,
    }));
  };

  const getSelectedPrice = () => {
    if (
      !productDetail?.variComboWithQuantity ||
      Object.keys(selectedVariations).length === 0
    )
      return null;

    return productDetail.variComboWithQuantity.find((combo) =>
      combo.combination.every(
        (item) => selectedVariations[item.variationId] === item.variationTypeId
      )
    )?.price;
  };

  const selectedPrice = getSelectedPrice();

  const handleHoverLeave = (variationId) => {
    setHoveredNames((prev) => {
      const newHovered = { ...prev };
      delete newHovered[variationId];
      return newHovered;
    });
  };

  console.log("selectedVariations", selectedVariations);
  useEffect(() => {
    if (productDetail?.variations) {
      setSelectedVariations(
        productDetail.variations.reduce((acc, variation) => {
          acc[variation.variationId] =
            variation.variationTypes[0]?.variationTypeId;
          return acc;
        }, {})
      );
    }
  }, [productDetail]);
  console.log(productDetail, "productDetail");
  return (
    <>
      <div className="container px-4 py-10 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="grid grid-cols-1 xss:grid-cols-2 gap-2">
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
              <CustomImg
                srcAttr={productDetail?.thumbnailImage}
                width={100}
                height={100}
                alt="Ring"
                className="cursor-pointer transition-all duration-300 w-full"
              />
            )}
            {productDetail?.images?.map((media, index) => (
              <CustomImg
                key={index}
                srcAttr={media?.image}
                width={100}
                height={100}
                alt="Ring"
                className="cursor-pointer transition-all duration-300 w-full"
              />
            ))}
          </div>

          <div className="flex flex-col space-y-4 lg:p-6">
            <h2 className="text-xl md:text-2xl font-normal">
              {productDetail?.productName}
            </h2>
            <div className="flex items-center gap-2 mt-2 xl:mt-4">
              {/* Final Price after Discount */}
              <span className="text-2xl xl:text-4xl font-normal font-castoro">
                {selectedPrice
                  ? `$${(
                      selectedPrice *
                      quantity *
                      (1 - productDetail.discount / 100)
                    ).toFixed(2)}`
                  : "Not Available"}
              </span>

              {/* Original Price (Strikethrough) */}
              <span className="text-gray-500 line-through font-castoro">
                ${(selectedPrice * quantity).toFixed(2)}
              </span>

              {/* Discount Display */}
              <span className="bg-primary text-white px-2 py-1 text-xs rounded">
                {`You Save ${productDetail.discount}%`}
              </span>
            </div>

            <div className="border-t my-6" />

            <div className="!mt-8 lg:!mt-12 flex items-center gap-3">
              <p className="font-medium text-xl">Qty:</p>
              <div className="flex items-center py-2 bg-white">
                <button
                  className="px-3 py-1 "
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  −
                </button>
                <span className="px-4">{quantity}</span>
                <button
                  className="px-3 py-1 "
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* <div className="!mt-8 lg:!mt-12 flex flex-wrap items-center gap-3">
            <p className="font-medium text-xl whitespace-nowrap">Color:</p>
            <div className="flex flex-wrap gap-3 mt-2 items-center py-2 relative max-w-full">
              {productDetails.colors.map((color, index) => (
                <div key={index} className="relative mt-2">
                  <button
                    className={`w-16 sm:w-20 h-10 p-2 border transition-all ${
                      selectedColor === color.key
                        ? "border-primary border-2 scale-110"
                        : ""
                    }`}
                    style={{ backgroundColor: color.value }}
                    onClick={() => setSelectedColor(color.key)}
                  />
                  {selectedColor === color.key && (
                    <span className="absolute top-full left-1/2 transform -translate-x-1/2 text-primary w-max text-sm font-medium mt-1 whitespace-nowrap">
                      {color.name}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="!mt-8 lg:!mt-12 flex flex-wrap items-center gap-3">
            <p className="font-medium flex-wrap text-xl">Metal Type:</p>
            <div className="flex gap-3 mt-2">
              {productDetails.metalTypes.map((type, index) => (
                <button
                  key={index}
                  className={`px-4 py-2   transition-all ${
                    selectedMetal === type
                      ? "border-primary border-2 scale-105"
                      : ""
                  }`}
                  onClick={() => setSelectedMetal(type)}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="!mt-8 lg:!mt-12 flex flex-wrap items-center gap-3">
            <p className="font-medium text-xl">Ring Size:</p>
            <div className="flex flex-wrap gap-3 mt-2">
              {productDetails.ringSizes.map((size, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 transition-all ${
                    selectedRingSize === size
                      ? "border-primary border-2 scale-105"
                      : ""
                  }`}
                  onClick={() => setSelectedRingSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="!mt-8 lg:!mt-12 flex  flex-wrap items-center gap-3">
            <p className="font-medium text-xl w-full">Ring Shape:</p>
            <div className="flex flex-wrap gap-3 mt-2">
              {productDetails.ringShapes.map((shape, index) => (
                <button
                  key={index}
                  className={` p-2 flex flex-col  items-center  ${
                    selectedRingShape === shape.name
                      ? "border-primary border-2"
                      : ""
                  }`}
                  onClick={() => setSelectedRingShape(shape.name)}
                >
                  <CustomImg
                    srcAttr={shape.img}
                    alt={shape.name}
                    className="w-7 h-7 object-contain"
                  />
                  <span className="text-sm mt-1">{shape.name}</span>
                </button>
              ))}
            </div>
          </div> */}

            <VariationsList
              variations={productDetail?.variations}
              selectedVariations={selectedVariations}
              hoveredNames={hoveredNames}
              handleSelect={handleSelect}
              handleHover={handleHover}
              handleHoverLeave={handleHoverLeave}
            />

            <div className="!mt-8 lg:!mt-12 flex gap-4 items-center">
              <button className="flex-1 bg-primary text-white xss:px-6 py-3 ">
                ADD TO BAG
              </button>
              <button className="p-3  hover:bg-gray-100 transition-all w-12 h-12">
                <CiHeart className="w-full h-full" />
              </button>
            </div>

            <div className="!mt-8 lg:!mt-12 flex items-center gap-3">
              <p className="font-medium text-xl">Pay With:</p>
              <div className="flex gap-3 mt-2">
                {productDetails.paymentOptions.map((option, index) => (
                  <CustomImg
                    key={index}
                    srcAttr={option.img}
                    alt={option}
                    className="h-20 w-20 object-contain"
                  />
                ))}
              </div>
            </div>

            <div className="!mt-8 lg:!mt-12 p-4 bg-white">
              <p className="font-medium text-lg md:text-xl">
                Estimate Ship Date {productDetails.estimatedShipDate}
              </p>
              <ul className="mt-3">
                {productDetails.shippingInfo.map((info, index) => (
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

        <div className="md:p-6">
          <ProductDetailsTabs productDetail={productDetail} />
        </div>
      </div>
      <section className="pt-36 container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-12 lg:gap-y-1 text-center md:text-start justify-center">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center md:items-start"
            >
              <CustomImg
                srcAttr={feature.icon}
                altAttr={feature.title}
                className="w-12 h-12 mb-4"
              />
              <h3 className="text-xl xl:text-2xl 2xl:text-3xl text-baseblack font-normal">
                {feature.title}
              </h3>
              <p className="text-baseblack text-base xl:text-lg mt-4 w-[90%] md:w-full">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default ProductDetails;

const ProductDetailsTabs = ({ productDetail }) => {
  const [activeTab, setActiveTab] = useState("Product Detail");
  const [open, setOpen] = useState(false);

  console.log("Active Tab:", activeTab, productDetail);

  const tabData = {
    "Product Detail": (
      <div className="flex flex-wrap gap-6 md:gap-16 xl:gap-32 mt-4">
        <div>
          <p className="font-semibold border-b text-lg">Information</p>
          <p className="pt-4 font-normal">SKU: {productDetail?.sku}</p>
          <p className="pt-4 font-normal">{productDetail?.shortDescription}</p>
        </div>
      </div>
    ),
    // description: productDetail?.description ? (
    //   <div
    //     className="mt-4"
    //     dangerouslySetInnerHTML={{ __html: productDetail.description }}
    //   />
    // ) : (
    //   <p className="mt-4">No Description Available</p>
    // ),
    // "Shipping & Returns": (
    //   <div className="flex flex-wrap gap-6 mt-4">
    //     <p className="text-lg">
    //       <span className="font-semibold">Fast & Secure Shipping – </span>
    //       Orders are processed within 1-2 business days and shipped via reliable
    //       carriers like UPS, FedEx, or USPS.
    //     </p>
    //     <p className="text-lg">
    //       <span className="font-semibold">Fast & Secure Shipping – </span>
    //       Orders are processed within 1-2 business days and shipped via reliable
    //       carriers like UPS, FedEx, or USPS.
    //     </p>
    //     <p className="text-lg">
    //       <span className="font-semibold">Delivery Time –</span>
    //       Standard shipping takes 3-7 business days, while expedited options are
    //       available for faster delivery.
    //     </p>
    //     <p className="text-lg">
    //       <span className="font-semibold">Shipping Fees – </span>
    //       Free shipping on orders over [Specify Amount], with calculated rates
    //       for express or international shipping.
    //     </p>
    //     <p className="text-lg">
    //       <span className="font-semibold">Order Tracking – </span>A tracking
    //       number is provided once your order ships, allowing you to monitor your
    //       package in real time.
    //     </p>
    //     <p className="text-lg">
    //       <span className="font-semibold">Return Window –</span>
    //       Items can be returned within [Specify Days, e.g., 14-30 days] of
    //       delivery for a refund or exchange.
    //     </p>
    //     <p className="text-lg">
    //       <span className="font-semibold">Return Condition –</span>
    //       Items must be unworn, in original packaging, and accompanied by proof
    //       of purchase.
    //     </p>
    //     <p className="text-lg">
    //       <span className="font-semibold">Non-Returnable Items – </span>
    //       Custom or engraved jewelry, final sale items, and used pieces cannot
    //       be returned.
    //     </p>
    //     <p className="text-lg">
    //       <span className="font-semibold">Refund Processing –</span>
    //       Refunds are issued to the original payment method within [Specify
    //       Days] after the return is received and inspected.
    //     </p>
    //     <p className="text-lg">
    //       <span className="font-semibold">Damaged or Incorrect Items – </span>
    //       If your order arrives damaged or incorrect, contact us immediately for
    //       a resolution.
    //     </p>
    //   </div>
    // ),
  };

  console.log("Rendering Tab Content:", tabData[activeTab]); // Debugging

  return (
    <div className="mt-6">
      {/* Mobile Dropdown */}
      <div className="relative md:hidden mb-4">
        <button
          onClick={() => setOpen(!open)}
          className="w-full border border-gray-300 px-4 py-2 rounded-md text-sm bg-white text-left"
        >
          {activeTab}
          <span className="float-right">▼</span>
        </button>
        {open && (
          <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-md">
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
