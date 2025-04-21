"use client";
import CommonBgHeading from "@/components/ui/CommonBgHeading";
import { useParams } from "next/navigation";
import { fetchOrderDetail } from "../../../../_actions/order.action";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { helperFunctions } from "@/_helper";
import moment from "moment";
import CustomBadge from "@/components/ui/CustomBadge";
import { ProgressiveImg } from "@/components/dynamiComponents";
import SkeletonLoader from "@/components/ui/skeletonLoader";
import ProductNotFound from "@/components/shop/productNotFound";
import CancelOrder from "@/components/ui/order-history/CancelOrder";
import DownloadInvoice from "@/components/ui/order-history/downloadInvoice";
import { setShowModal } from "@/store/slices/commonSlice";
import Spinner from "@/components/ui/spinner";

export default function OrderDetailPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const { orderId } = params;
  const { orderDetail, orderDetailLoading, invoiceLoading, selectedOrder } =
    useSelector(({ order }) => order);

  useEffect(() => {
    dispatch(setShowModal(false));
    dispatch(fetchOrderDetail(orderId));
  }, [orderId]);

  const billingItems = [
    { label: "Sub Total", value: `$${orderDetail?.subTotal}` },
    {
      label: "Sales Tax(8%)",
      value: `$${helperFunctions.toFixedNumber(orderDetail?.salesTax)}`,
    },
    { label: "Shipping Charge", value: `$${orderDetail?.shippingCharge}` },
    {
      label: "Total Amount",
      value: `USD $${helperFunctions.toFixedNumber(orderDetail?.total)}`,
    },
  ];

  const shippingFields = [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Mobile", key: "mobile" },
    { label: "Company Name", key: "companyName", default: "Not available" },
    { label: "Address", key: "address" },
    { label: "Apartment", key: "apartment", default: "Not available" },
    { label: "City", key: "city" },
    { label: "State", key: "state" },
    { label: "Country", key: "country" },
    { label: "Zipcode", key: "pinCode" },
  ];

  const orderMetaFields = [
    {
      label: "Order Date",
      value: moment(orderDetail?.createdDate).format("DD-MM-YYYY"),
    },
    {
      label: "Order Number",
      value: orderDetail?.orderNumber,
    },
    {
      label: "Tracking Number",
      value: orderDetail?.trackingNumber,
      isOptional: true,
    },
    {
      label: "Payment Status",
      value: orderDetail?.paymentStatus,
      render: (val) => <CustomBadge status={val}>{val}</CustomBadge>,
    },
    {
      label: "Order Status",
      value: orderDetail?.orderStatus,
      render: (val) => <CustomBadge status={val}>{val}</CustomBadge>,
    },
  ];

  return (
    <>
      <CommonBgHeading title="Order Summary" />

      {!orderDetail && !orderDetailLoading ? (
        <ProductNotFound message="Sorry, no order found." />
      ) : orderDetailLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 container my-8">
          {/* Left Panel Skeleton */}
          <div className="flex flex-col gap-4">
            <SkeletonLoader height="h-[400px]" />
            <SkeletonLoader height="h-[200px]" />
          </div>

          {/* Right Panel Skeleton */}
          <div className="flex flex-col gap-4">
            <SkeletonLoader height="h-[200px]" />
            <SkeletonLoader height="h-[250px]" />
          </div>
        </div>
      ) : (
        <div className="container my-8">
          <div className="flex justify-end">
            <div className="flex gap-4 mb-2">
              {invoiceLoading && orderId === selectedOrder ? (
                <Spinner className="h-6" />
              ) : (
                <DownloadInvoice orderId={orderId} />
              )}

              {["pending", "confirmed"].includes(orderDetail.orderStatus) &&
              orderDetail.paymentStatus === "success" ? (
                <CancelOrder orderId={orderId} />
              ) : null}
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 ">
            {/* Left Panel */}
            <div className="flex flex-col gap-4">
              {/* Reserved Box */}
              <div className="bg-white p-4 lg:p-6 min-h-[300px] lg:min-h-[400px]">
                {orderDetail?.products?.map((product, index) => {
                  return (
                    <div className="flex items-start gap-4" key={`${index}`}>
                      <div className="relative">
                        <ProgressiveImg
                          src={product.productImage}
                          alt={product.productName}
                          title={product.productName}
                          className={"w-52 md:w-40 border border-alabaster"}
                        />
                        <div className="absolute top-0 left-0 bg-primary text-white text-xs font-semibold px-2 py-1  z-10">
                          Qty: {product?.cartQuantity}
                        </div>
                      </div>
                      <div className="w-full">
                        <div className="flex justify-between text-sm md:text-base mt-2">
                          <h3 className="font-medium">
                            {product?.productName}
                          </h3>
                          <h3 className="font-semibold">
                            $
                            {helperFunctions.toFixedNumber(product?.unitAmount)}
                          </h3>
                        </div>
                        <div className="flex flex-col md:flex-row gap-1.5 lg:gap-2 my-1.5 lg:my-3">
                          {product?.variations?.map((variItem) => {
                            return (
                              <span
                                className="flex p-1.5 w-fit border-[1.5px] text-xs lg:text-sm border-alabaster"
                                key={helperFunctions.getRandomValue()}
                              >
                                <p className="font-bold">
                                  {variItem.variationName} :
                                </p>{" "}
                                &nbsp;
                                <p className="mb-0 text-capitalize">
                                  {variItem.variationTypeName}
                                </p>
                              </span>
                            );
                          })}
                        </div>
                        <h3 className="font-medium text-sm md:text-base">
                          $
                          {helperFunctions.toFixedNumber(product?.productPrice)}
                          Per Item
                        </h3>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Billing Section */}
              <div className="bg-white p-4 lg:p-6 flex flex-col gap-2 text-sm md:text-base">
                {billingItems.map((item) => (
                  <div
                    className="flex justify-between"
                    key={`billing-${item.label}`}
                  >
                    <h4 className="font-medium">{item.label}</h4>
                    <p className="font-semibold">{item.value}</p>
                  </div>
                ))}
                <p className="font-medium mt-2">
                  *Sales tax will be applied to shipped to addresses within New
                  York State.
                </p>
              </div>
            </div>

            {/* Right Panel */}
            <div className="flex flex-col gap-4">
              {/* Order Info Section */}
              <div className="bg-white p-4 lg:p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 text-sm md:text-base">
                  {orderMetaFields.map(
                    ({ label, value, render, isOptional }) =>
                      (!isOptional || value) && (
                        <div key={`meta-${label}`}>
                          <p className="text-basegray">{label}</p>
                          <span className="font-medium break-words mt-1 inline-block">
                            {render ? render(value) : value}
                          </span>
                        </div>
                      )
                  )}
                </div>
              </div>

              {/* Shipping Info Section */}
              <div className="bg-white p-4 lg:p-6">
                <h3 className="font-castoro text-2xl lg:text-3xl">
                  Order Summary
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 mt-4">
                  {shippingFields.map(
                    ({ label, key, default: defaultValue = "" }) => (
                      <div
                        key={`shipping-${key}`}
                        className="text-sm md:text-base"
                      >
                        <p className="text-basegray">{label}</p>
                        <span className="font-medium break-words mt-1">
                          {orderDetail?.shippingAddress?.[key] || defaultValue}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
