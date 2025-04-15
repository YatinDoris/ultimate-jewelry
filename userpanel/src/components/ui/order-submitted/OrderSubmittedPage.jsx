"use client";
import orderSuccess from "@/assets/images/order-complete/order-submitted.svg";
import { CustomImg } from "@/components/dynamiComponents";
import { LinkButton } from "../button";

const orderData = {
  orderNumber: "ORD3152585b8e512",
};
const OrderSubmittedPage = () => {
  return (
    <div className="min-h-[70vh] lg:min-h-[60vh] flex items-center justify-center bg-[#FAFAF8] px-4">
      <div className="bg-white border border-[#E2E2E2] p-8 max-w-xl xl:max-w-3xl w-full text-center py-8 xl:py-16">
        {/* Check Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-12 h-12 md:w-20 md:h-20 2xl:w-24 2xl:h-20 bg-green-500 rounded-full flex items-center justify-center">
            <CustomImg srcAttr={orderSuccess} altAttr="" titleAttr="" />
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl 2xl:text-5xl font-medium font-castoro mt-10 mb-6 text-gray-900">
          Order Submitted
        </h2>

        {/* Subtext */}
        <p className="text-baseblack text-sm sm:text-base md:text-lg mb-1">
          Thank you so much for your order with your{" "}
          <span className="font-bold">Order No. {orderData?.orderNumber}</span>
        </p>
        <p className="text-baseblack text-sm sm:text-base md:text-lg mb-6">
          Please wait for the confirmation email.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <LinkButton
            href="/"
            className={`!text-white !rounded-none !font-medium  w-full !py-6 !bg-primary !text-lg hover:!border-primary hover:!bg-transparent hover:!text-primary !border-[#0000001A] `}
          >
            TRACK YOUR ORDER
          </LinkButton>
          <LinkButton
            href="/"
            className={`!text-white !rounded-none !font-medium w-full !py-6 !bg-primary !text-lg hover:!border-primary hover:!bg-transparent hover:!text-primary !border-[#0000001A] `}
          >
            CONTINUE SHOPPING
          </LinkButton>
        </div>
      </div>
    </div>
  );
};

export default OrderSubmittedPage;
