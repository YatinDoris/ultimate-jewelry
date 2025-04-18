"use client";
import { fetchOrderDetail, fetchOrderHistory } from "@/_actions/order.action";
import { generatePDF, helperFunctions } from "@/_helper";
import { ITEMS_PER_PAGE } from "@/_utils/common";
import CommonBgHeading from "@/components/ui/CommonBgHeading";
import CustomBadge from "@/components/ui/CustomBadge";
import CancelOrderModel from "@/components/ui/order-history/OrderCancelModel";
import Pagination from "@/components/ui/Pagination";
import SkeletonLoader from "@/components/ui/skeletonLoader";
import Spinner from "@/components/ui/spinner";
import { setShowModal } from "@/store/slices/commonSlice";
import { setCurrentPage, setSelectedOrder } from "@/store/slices/orderSlice";
import moment from "moment";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { BsDownload } from "react-icons/bs";
import { IoEyeSharp } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { setOrderLoading } from "../../../store/slices/orderSlice";
import CancelOrder from "@/components/ui/order-history/CancelOrder";

export default function OrderHistoryPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const {
    orderList,
    orderLoading,
    currentPage,
    selectedOrder,
    orderDetailLoading,
  } = useSelector(({ order }) => order);

  const loadData = useCallback(() => {
    dispatch(fetchOrderHistory());
  }, [dispatch]);

  const pageCount = Math.ceil(orderList.length / ITEMS_PER_PAGE);
  const paginatedOrder = orderList.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const handlePageClick = ({ selected }) => {
    dispatch(setCurrentPage(selected));
  };

  const downloadInvoiceHandler = useCallback(
    async (orderId) => {
      dispatch(setSelectedOrder(orderId));
      const orderDetail = await dispatch(fetchOrderDetail(orderId));
      if (orderDetail) {
        generatePDF(orderDetail);
      }
    },
    [dispatch]
  );

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    return () => {
      dispatch(setOrderLoading(false));
    };
  }, []);

  const renderTableHeading = () => {
    return (
      <thead className="text-xs text-gray-700 uppercase bg-[#0000000D] dark:text-gray-400">
        <tr>
          <th scope="col" className="px-6 py-3.5">
            Order Date
          </th>
          <th scope="col" className="px-6 py-3.5">
            Order Number
          </th>
          <th scope="col" className="px-6 py-3.5">
            Total
          </th>
          <th scope="col" className="px-6 py-3.5">
            Payment Status
          </th>
          <th scope="col" className="px-6 py-3.5">
            Order Status
          </th>
          <th scope="col" className="px-6 py-3.5">
            Action
          </th>
        </tr>
      </thead>
    );
  };
  return (
    <div>
      <CommonBgHeading title="Order History" />

      <div className="container my-10 relative overflow-x-auto">
        {orderLoading ? (
          <div className={`w-full h-[300px] animate-pulse`}>
            <table className="w-full text-sm text-left rtl:text-right">
              {renderTableHeading()}

              <tbody>
                {[...Array(5)].map((_, rowIndex) => (
                  <tr
                    key={`row-${rowIndex}`}
                    className="bg-white border-b border-gray-200"
                  >
                    {[...Array(6)].map((_, colIndex) => (
                      <td
                        key={`cell-${rowIndex}-${colIndex}`}
                        className="px-6 py-4"
                      >
                        <SkeletonLoader height="h-4" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            {renderTableHeading()}
            <tbody>
              {paginatedOrder.map((order, index) => (
                <tr
                  key={`order-${index}`}
                  className="bg-white border-b border-gray-200 text-baseblack"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium whitespace-nowrap"
                  >
                    {order.createdDate
                      ? moment(order.createdDate).format("DD-MM-YYYY")
                      : null}
                  </th>
                  <td className="px-6 py-4">{order.orderNumber}</td>
                  <td className="px-6 py-4">
                    $ {helperFunctions.toFixedNumber(order.total)}
                  </td>
                  <td className="px-6 py-4">
                    <CustomBadge status={order?.paymentStatus}>
                      {order?.paymentStatus}
                    </CustomBadge>
                  </td>
                  <td className="px-6 py-4">
                    <CustomBadge status={order?.orderStatus}>
                      {order?.orderStatus}
                    </CustomBadge>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-3">
                      <IoEyeSharp
                        title="Order Detail"
                        className="cursor-pointer text-xl text-basegray"
                        onClick={() =>
                          router.push(`/order-history/${order.id}`)
                        }
                      />

                      {["pending", "confirmed"].includes(order.orderStatus) &&
                      order.paymentStatus === "success" ? (
                        <CancelOrder orderId={order.id} />
                      ) : null}

                      {orderDetailLoading && order.id === selectedOrder ? (
                        <Spinner className="h-6" />
                      ) : (
                        <BsDownload
                          title="Download Invoice"
                          className="cursor-pointer text-xl text-basegray"
                          onClick={() => downloadInvoiceHandler(order.id)}
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {!orderLoading && orderList.length > ITEMS_PER_PAGE && (
        <Pagination handlePageClick={handlePageClick} pageCount={pageCount} />
      )}
      {/* {showModal ? <CancelOrderModel /> : null} */}
    </div>
  );
}
