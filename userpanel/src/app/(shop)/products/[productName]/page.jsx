"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CiHeart } from "react-icons/ci";
import stripe from "@/assets/images/cart/stripe.webp";
import paypal from "@/assets/images/cart/paypal.webp";
import snapFinance from "@/assets/images/cart/snapFinance.webp";
import acima from "@/assets/images/cart/acima.webp";
import { useParams } from "next/navigation";
import { helperFunctions } from "@/_helper";
import {
  addUpdateRecentlyViewedProducts,
  fetchProductDetailByProductName,
  fetchRecentlyViewedProducts,
} from "@/_actions/product.actions";
import { useDispatch, useSelector } from "react-redux";
import VariationsList from "@/components/ui/VariationsList";
import {
  CustomImg,
  ProgressiveImg,
  ProductSwiper,
  ProgressiveVed,
} from "@/components/dynamiComponents";
import DetailPageSkeleton from "@/components/ui/DetailPageSkeleton";
import KeyFeatures from "@/components/ui/KeyFeatures";
import calender from "@/assets/icons/calender.svg";
import inspect from "@/assets/icons/inspect.svg";
import truck from "@/assets/icons/truck.svg";
import {
  setSelectedVariations,
  setProductQuantity,
} from "@/store/slices/productSlice";
import { insertProductIntoCart } from "@/_actions/cart.action";
import { LoadingPrimaryButton } from "@/components/ui/button";
import { setIsHovered, setIsSubmitted } from "@/store/slices/commonSlice";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { setCartMessage } from "@/store/slices/cartSlice";
import ProductDetailSwipperSm from "@/components/shop/ProductDetailSwipperSm";

export const minProductQuantity = 1;
export const maxProductQuantity = 5;

const shippingInfo = [
  {
    icon: truck,
    altAttr: "",
    titleAttr: "",
    text: "Please call us: +1-800-282-2242",
  },
  {
    icon: calender,
    altAttr: "",
    titleAttr: "",
    text: "Free 30 Day Returns, Free Resizing, Free Lifetime Warranty.",
  },
  {
    icon: inspect,
    altAttr: "",
    titleAttr: "",
    text: "We inspect & verify authenticity before shipping. 100% Money-Back Guarantee.",
  },
];

const paymentOptions = [
  { img: stripe, name: "Stripe", altAttr: "", titleAttr: "" },
  { img: paypal, name: "PayPal", altAttr: "", titleAttr: "" },
  { img: snapFinance, name: "Snap Finance", altAttr: "", titleAttr: "" },
  { img: acima, name: "Acima", altAttr: "", titleAttr: "" },
];

const shippingReturnContent = [
  {
    label: "Fast & Secure Shipping –",
    content:
      "Orders are processed within 1-2 business days and shipped via reliable carriers like UPS, FedEx, or USPS.",
  },
  {
    label: "Delivery Time –",
    content:
      "Standard shipping takes 3-7 business days, while expedited options are available for faster delivery.",
  },
  {
    label: "Shipping Fees – ",
    content:
      "Free shipping on orders over [Specify Amount], with calculated rates for express or international shipping.",
  },
  {
    label: "Order Tracking – ",
    content:
      "A tracking number is provided once your order ships, allowing you to monitor your package in real time.",
  },
  {
    label: "Return Window –",
    content:
      "Items can be returned within [Specify Days, e.g., 14-30 days] of delivery for a refund or exchange.",
  },
  {
    label: "Return Condition –",
    content:
      "Items must be unworn, in original packaging, and accompanied by proof of purchase.",
  },
  {
    label: "Non-Returnable Items –",
    content:
      "Custom or engraved jewelry, final sale items, and used pieces cannot be returned.",
  },
  {
    label: "Refund Processing –",
    content:
      "Refunds are issued to the original payment method within [Specify Days] after the return is received and inspected.",
  },
  {
    label: "Damaged or Incorrect Items –",
    content:
      "If your order arrives damaged or incorrect, contact us immediately for a resolution.",
  },
];

const ProductDetails = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  let { productName } = params;
  let availableQty = 0;

  const {
    productDetail,
    productLoading,
    recentlyProductLoading,
    selectedVariations,
    productQuantity,
    recentlyViewProductList,
  } = useSelector(({ product }) => product);
  const { cartMessage, cartLoading } = useSelector(({ cart }) => cart);
  const { isHovered, isSubmitted } = useSelector(({ common }) => common);

  productName = helperFunctions.stringReplacedWithSpace(productName);

  const loadData = useCallback(async () => {
    const response = await dispatch(
      fetchProductDetailByProductName(productName)
    );
    if (response) {
      dispatch(addUpdateRecentlyViewedProducts({ productName }));
      const initialSelections = response?.variations?.map((variation) => ({
        variationId: variation.variationId,
        variationTypeId: variation.variationTypes[0]?.variationTypeId,
      }));
      dispatch(setSelectedVariations(initialSelections));
    }
  }, [dispatch, productName]);

  useEffect(() => {
    loadData();
    dispatch(setProductQuantity(1));
    dispatch(setSelectedVariations([]));
  }, [productName]);

  const loadRecentlyViewProduct = useCallback(() => {
    dispatch(fetchRecentlyViewedProducts());
  }, [dispatch]);

  useEffect(() => {
    loadRecentlyViewProduct();
  }, [loadRecentlyViewProduct]);

  if (
    Array.isArray(productDetail?.variComboWithQuantity) &&
    Array.isArray(selectedVariations) &&
    selectedVariations?.length
  ) {
    const { price, quantity } = helperFunctions.getVariComboPriceQty(
      productDetail.variComboWithQuantity,
      selectedVariations
    );

    availableQty = quantity;
  }

  const handleSelect = useCallback(
    (variationId, variationTypeId) => {
      dispatch(setCartMessage({ message: "", type: "" }));
      const updated = [
        ...selectedVariations.filter(
          (item) => item.variationId !== variationId
        ),
        { variationId, variationTypeId },
      ];
      dispatch(setSelectedVariations(updated));
    },
    [selectedVariations]
  );

  const selectedPrice = useMemo(() => {
    if (
      !productDetail?.variComboWithQuantity?.length ||
      !selectedVariations.length
    )
      return null;

    return productDetail?.variComboWithQuantity?.find((combo) =>
      combo.combination.every((item) =>
        selectedVariations?.some(
          (selected) =>
            selected?.variationId === item?.variationId &&
            selected?.variationTypeId === item?.variationTypeId
        )
      )
    )?.price;
  }, [productDetail?.variComboWithQuantity, selectedVariations]);

  const isInValidSelectedVariation = useMemo(() => {
    if (productDetail?.variations?.length !== selectedVariations?.length) {
      return true;
    }
    return false;
  }, [productDetail?.variations?.length, selectedVariations?.length]);

  const addToCartHandler = useCallback(async () => {
    dispatch(setIsSubmitted(true));
    if (
      isInValidSelectedVariation ||
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
      dispatch(setIsSubmitted(false));
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
    <div className="pt-28 lg:pt-12 2xl:pt-16">
      {productLoading ? (
        <DetailPageSkeleton />
      ) : (
        <>
          <div className="container grid grid-cols-1 lg:grid-cols-[55%_auto] gap-12">
            <div className="hidden lg:block">
              {" "}
              <div className="grid grid-cols-2 gap-4 auto-rows-min ">
                {productDetail?.video && (
                  <ProgressiveVed
                    src={productDetail.video}
                    type={helperFunctions?.getVideoType(productDetail?.video)}
                    className="w-full h-full object-cover"
                  />
                )}
                {productDetail?.thumbnailImage && (
                  <ProgressiveImg
                    src={productDetail?.thumbnailImage}
                    className="cursor-pointer transition-all duration-300 w-full"
                  />
                )}
                {productDetail?.images?.map((media, index) => (
                  <ProgressiveImg
                    key={index}
                    src={media?.image}
                    className="cursor-pointer transition-all duration-300 w-full"
                  />
                ))}
              </div>
            </div>
            <div className="lg:hidden">
              <ProductDetailSwipperSm
                images={
                  productDetail?.thumbnailImage
                    ? [
                        { image: productDetail.thumbnailImage },
                        ...productDetail?.images,
                      ]
                    : productDetail?.images ?? []
                }
                video={productDetail?.video}
              />
            </div>

            <div className="flex flex-col lg:p-6">
              <h2 className="text-2xl md:text-3xl font-medium">
                {productDetail?.productName}
              </h2>
              <h2 className="text-base md:text-base text-basegray mt-2 font-castoro">
                sku: {productDetail?.saltSKU}
              </h2>
              <div className="flex items-center gap-2 mt-2 xl:mt-4  mb-6 lg:mb-10">
                <span className="text-2xl md:text-3xl xl:text-4xl font-normal font-castoro">
                  {selectedPrice
                    ? `$${(
                        selectedPrice *
                        productQuantity *
                        (1 - productDetail.discount / 100)
                      ).toFixed(2)}`
                    : "N/A"}
                </span>
                {productDetail?.discount ? (
                  <span className="text-gray-500 line-through text-xl font-castoro">
                    ${(selectedPrice * productQuantity).toFixed(2)}
                  </span>
                ) : null}
                {productDetail?.discount ? (
                  <span className="bg-primary text-white px-2 py-2 text-xs font-medium rounded">
                    {`You Save ${productDetail?.discount}%`}
                  </span>
                ) : null}
              </div>

              <div className="border-t  border-black_opacity_10" />

              <div className="mt-6 lg:mt-10 flex items-center gap-3">
                <p className="font-medium text-lg w-[110px] xs:w-[120px]">
                  Qty:
                </p>
                <div className="flex items-center py-2 bg-white">
                  <button
                    className={`px-2 text-xl font-medium text-baseblack ${
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
                    className={`px-2 text-xl font-medium text-baseblack ${
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

              <div className="mt-4 lg:mt-8 flex gap-4 items-center">
                <div
                  className="w-full"
                  onMouseEnter={() => dispatch(setIsHovered(true))}
                  onMouseLeave={() => dispatch(setIsHovered(false))}
                >
                  <LoadingPrimaryButton
                    className="w-full uppercase"
                    loading={cartLoading}
                    disabled={
                      cartLoading ||
                      (!availableQty && !isInValidSelectedVariation)
                    }
                    loaderType={isHovered ? "" : "white"}
                    onClick={addToCartHandler}
                  >
                    {!availableQty && !isInValidSelectedVariation
                      ? "OUT OF STOCK"
                      : "ADD TO BAG"}
                  </LoadingPrimaryButton>
                </div>
                {/* <button className="p-3 hover:bg-gray-100 transition-all w-14 h-14">
                  <CiHeart className="w-full h-full text-primary" />
                </button> */}
              </div>
              {isSubmitted && !selectedVariations?.length ? (
                <ErrorMessage message={"Please select variants"} />
              ) : null}
              {isSubmitted && cartMessage?.message ? (
                <ErrorMessage message={cartMessage?.message} />
              ) : null}

              <div className="mt-4 lg:mt-6 flex items-center gap-3">
                <p className="font-medium text-base md:text-xl text-gray-500">
                  Pay With:
                </p>
                <div className="flex flex-wrap gap-3 md:gap-6">
                  {paymentOptions.map((option, index) => (
                    <CustomImg
                      key={index}
                      srcAttr={option?.img}
                      titleAttr={option?.titleAttr}
                      altAttr={option?.altAttr}
                      className="object-contain md:h-auto md:w-auto h-12 w-10"
                    />
                  ))}
                </div>
              </div>

              <div className="mt-6 lg:mt-8 p-4 bg-white">
                <p className="font-medium text-base md:text-lg">
                  Estimate Ship Date Monday, April 7
                </p>
                <ul className="mt-3">
                  {shippingInfo.map((info, index) => (
                    <li
                      key={index}
                      className="flex gap-4 items-center text-base md:text-lg mt-2"
                    >
                      <CustomImg
                        srcAttr={info?.icon}
                        altAttr={info?.altAttr}
                        className="w-6 h-6"
                        titleAttr={info?.titleAttr}
                      />
                      <span>{info.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="container pt-10 lg:pt-20 2xl:pt-28 md:p-6">
            <ProductDetailTabs />
          </div>
          <section className="pt-16 lg:pt-20 2xl:pt-40 container">
            <ProductSwiper
              productList={recentlyViewProductList}
              loading={recentlyProductLoading}
              title="Recently viewed"
            />
          </section>
          <section className="pt-10 lg:pt-20 2xl:pt-28 container">
            <KeyFeatures />
          </section>
        </>
      )}
    </div>
  );
};

export default ProductDetails;

const ProductDetailTabs = () => {
  const { productDetail } = useSelector(({ product }) => product);

  const [activeTab, setActiveTab] = useState("Product Detail");
  const [open, setOpen] = useState(false);

  const tabData = [
    {
      label: "Product Detail",
      content: (
        <div className="flex flex-wrap gap-6 md:gap-16 xl:gap-32 mt-4">
          <div>
            <p className="inline-block font-semibold text-xl text-baseblack border-b-[2.5px] border-black_opacity_10 pt-[6px] pb-[6px]">
              Information
            </p>

            {productDetail?.saltSKU && (
              <p className="pt-4 text-lg md:text-xl text-baseblack">
                SKU: {productDetail?.saltSKU}
              </p>
            )}
            {productDetail?.shortDescription && (
              <p className="pt-4 text-lg md:text-xl font-medium text-baseblack">
                {productDetail?.shortDescription}
              </p>
            )}
            <p className="pt-4 text-lg md:text-xl font-medium text-baseblack">
              Diamond Type: Lab Grown Diamond
            </p>
            {productDetail?.settingStyleNamesWithImg?.length > 0 && (
              <div className="flex flex-wrap font-medium gap-2 pt-4">
                <p className=" text-lg md:text-xl text-baseblack">
                  Setting Style:
                </p>
                {productDetail?.settingStyleNamesWithImg.map((style, index) => (
                  <div className="flex flex-wrap gap-2" key={index}>
                    <p className=" text-lg md:text-xl text-baseblack">
                      {style?.title}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      label: "Description",
      content: productDetail?.description ? (
        <div
          className="mt-4 text-lg md:text-xl font-medium text-baseblack"
          dangerouslySetInnerHTML={{ __html: productDetail.description }}
        />
      ) : (
        <p className="mt-4 text-lg md:text-xl font-medium text-baseblack">
          No Description Available
        </p>
      ),
    },
    {
      label: "Shipping & Returns",
      content: (
        <>
          {shippingReturnContent?.map((item) => (
            <div key={item?.label} className="flex flex-wrap gap-6 mt-4">
              <p className="text-lg md:text-xl text-baseblack">
                <span className="font-semibold">{item?.label} </span>
                {item?.content}
              </p>
            </div>
          ))}
        </>
      ),
    },
  ];

  return (
    <div className="mt-6">
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
            {tabData.map(({ label }) => (
              <li
                key={label}
                onClick={() => {
                  setActiveTab(label);
                  setOpen(false);
                }}
                className={`px-4 py-2 text-sm cursor-pointer transition ${
                  activeTab === label
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-primary hover:text-white"
                }`}
              >
                {label}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="hidden md:flex gap-6 lg:gap-20 2xl:gap-28 border-b">
        {tabData.map(({ label }) => (
          <button
            key={label}
            className={`py-2 text-2xl font-medium ${
              activeTab === label
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500"
            }`}
            onClick={() => setActiveTab(label)}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="w-full">
        {tabData.find((tab) => tab.label === activeTab)?.content || (
          <p>No Data</p>
        )}
      </div>
    </div>
  );
};
