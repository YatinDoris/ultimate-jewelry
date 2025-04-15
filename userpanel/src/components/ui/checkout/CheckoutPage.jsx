"use client";
import {
  CheckoutCommonComponent,
  CheckoutForm,
  CustomImg,
  CheckoutAddressModal,
  LatestProduct,
} from "@/components/dynamiComponents";
import CommonBgHeading from "@/components/ui/CommonBgHeading";
import { useSelector } from "react-redux";
import { PrimaryLinkButton } from "@/components/ui/button";
import SkeletonLoader from "@/components/ui/skeletonLoader";
import cartImage from "@/assets/images/cart/cart.webp";
import KeyFeatures from "@/components/ui/KeyFeatures";
import CheckoutBreadCrumbs from "./CheckoutBreadCrumbs";

const Checkout = () => {
  const { cartLoading, cartList } = useSelector(({ cart }) => cart);
  const { showModal } = useSelector(({ common }) => common);

  return (
    <div className="mx-auto pt-28 lg:pt-10 2xl:pt-12">
      {cartLoading ? (
        <CheckoutSkeleton />
      ) : cartList?.length ? (
        <>
          <CommonBgHeading
            title="Secure Checkout"
            backText="Back to Cart"
            backHref="/cart"
          />
          <div className="px-4 md:container mt-8 lg:mt-12">
            <CheckoutBreadCrumbs currentStep={0} />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[55%_auto] lg:gap-6 container mx-auto h-full">
            <div className="lg:hidden pt-8">
              <CheckoutCommonComponent />
            </div>
            <CheckoutForm />
            <div className="lg:block hidden">
              <CheckoutCommonComponent />
            </div>
          </div>
          {showModal && <CheckoutAddressModal />}

          <section className="container pt-16 lg:pt-20 2xl:pt-36">
            <LatestProduct />
          </section>
          <section className="container pt-16 lg:pt-20 2xl:pt-36">
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
          <PrimaryLinkButton
            href="/"
            className=" !rounded-none !font-medium !mt-8 w-fit !px-16 !py-6 !text-lg  uppercase"
          >
            Back To Shop
          </PrimaryLinkButton>
        </div>
      )}
    </div>
  );
};

export default Checkout;
const CheckoutSkeleton = () => {
  const skeletons = [
    { width: "w-[40%]", height: "h-4", margin: "mt-2" },
    { width: "w-full", height: "h-8", margin: "mt-2" },
    { width: "w-[40%]", height: "h-4", margin: "mt-6" },
    { width: "w-full", height: "h-8", margin: "mt-2" },
  ];
  return (
    <div
      className={`container grid grid-cols-1 lg:grid-cols-[70%_auto] gap-12 pt-12`}
    >
      <div>
        {Array(4)
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
      <div className="grid grid-cols-1 gap-4 auto-rows-min">
        <SkeletonLoader height="w-full h-[70] md:h-[220px]  2xl:h-[150px]" />
        <SkeletonLoader height="w-full h-[70] md:h-[220px]  2xl:h-[150px]" />
        <SkeletonLoader height="w-full h-[70] md:h-[220px]  2xl:h-[150px]" />

        <SkeletonLoader height="w-[20%] h-[40px]" />
      </div>
    </div>
  );
};
