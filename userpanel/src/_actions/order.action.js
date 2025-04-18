import { orderService } from "@/_services";
import { setCancelOrderLoading, setInvoiceLoading, setOrderDetail, setOrderList, setOrderLoading, setOrderMessage } from "@/store/slices/orderSlice";

// actions/orderActions.js or similar
export const fetchOrderHistory = () => {
  return async (dispatch) => {
    dispatch(setOrderLoading(true));
    try {
      const orderData = await orderService.getAllOrderList();

      if (orderData) {
        dispatch(setOrderList(orderData));
      } else {
        dispatch(setOrderList([]));
      }
    } catch (e) {
      console.error("Error fetching order history:", e);
      dispatch(setOrderList([]));
    } finally {
      dispatch(setOrderLoading(false));
    }
  };
};

export const orderCancel = () => {
  return async (dispatch) => {
    dispatch(setOrderMessage({ message: "", type: "" }))
    dispatch(setCancelOrderLoading(true))
    try {
      const orderData = await orderService.cancelOrder();

      if (orderData) {
        dispatch(setOrderList(orderData));
      } else {
        dispatch(setOrderList([]));
      }
    } catch (error) {
      if (error?.code === "ERR_NETWORK") {
        dispatch(
          setOrderMessage({
            message: error?.message,
            type: "ERROR",
          })
        );
      }
      return false;
    } finally {
      dispatch(setCancelOrderLoading(false))
    }
  };
};


export const fetchOrderDetail = (orderId) => {
  return async (dispatch) => {
    dispatch(setInvoiceLoading(true))
    try {
      const orderDetail = await orderService.getOrderDetailByOrderId(orderId);
      if (orderDetail) {
        dispatch(setOrderDetail(orderDetail))
        return orderDetail;
      }
      return false;
    } catch (e) {
      console.log('e', e)
      return false;
    } finally {
      dispatch(setOrderDetail({}))
      dispatch(setInvoiceLoading(false))
    }
  };
};

// export const handleCancelOrderError = (payload) => {
//   return async (dispatch, getState) => {
//     dispatch({
//       type: actionTypes.CANCEL_ORDER_ERROR,
//       setCancelOrderError: payload.setCancelOrderError,
//     });
//   };
// };

// export const fetchTopSellingProducts = () => {
//   return async (dispatch, getState) => {
//     try {
//       const topSellingProducts = await orderService.getTopSellingProducts();
//       if (topSellingProducts) {
//         dispatch({
//           type: actionTypes.FETCH_TOP_SELLING_PRODUCTS,
//           topSellingProducts: topSellingProducts,
//         });
//         return topSellingProducts;
//       }
//       return false;
//     } catch (e) {
//       dispatch({
//         type: actionTypes.FETCH_TOP_SELLING_PRODUCTS,
//         topSellingProducts: [],
//       });
//       return false;
//     }
//   };
// };
