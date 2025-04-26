import {
  setReturnsList,
  setReturnDetail,
  setOrderDetail,
  setReturnReqLoader,
  setDeleteReturnReqLoader,
  setReturnMessage,
} from "@/store/slices/returnSlice";

import { returnService, orderService, toasterService } from "@/_services";
import { messageType } from "@/_helper/constants";

export const fetchReturnsHistory = () => async (dispatch) => {
  try {
    const returnsData = await returnService.getUserReturnsList();
    dispatch(setReturnsList(returnsData || []));
  } catch {
    dispatch(setReturnsList([]));
  }
};

export const fetchReturnDetail = (returnId) => async (dispatch) => {
  try {
    const returnDetail = await returnService.getReturnDetailByReturnId(
      returnId
    );
    dispatch(setReturnDetail(returnDetail || {}));
    return returnDetail || false;
  } catch {
    dispatch(setReturnDetail({}));
    return false;
  }
};

export const fetchOrderDetailByOrderNumber =
  (orderNumber) => async (dispatch) => {
    try {
      const orderDetail = await orderService.getOrderDetailByOrderNumber(
        orderNumber
      );
      if (orderDetail) {
        orderDetail.products = orderDetail.products.map((item) => ({
          ...item,
          returnQuantity: item.cartQuantity,
          isChecked: false,
        }));
        dispatch(setOrderDetail(orderDetail));
        return orderDetail;
      }
      return false;
    } catch {
      dispatch(setOrderDetail({}));
      return false;
    }
  };

export const createReturnRequest = (payload) => async (dispatch) => {
  dispatch(setReturnMessage({ message: "", type: "" }));
  dispatch(setReturnReqLoader(true));
  try {
    const response = await returnService.insertReturnRequest(payload);
    if (response) {
      toasterService.success(
        "Your return request has been successfully submitted. Please await confirmation"
      );
      return true;
    }
    return false;
  } catch (err) {
    const message = err?.message || "Something went wrong";
    dispatch(setReturnMessage({ message, type: messageType.ERROR }));
    return false;
  } finally {
    dispatch(setReturnReqLoader(false));
  }
};

export const cancelReturnRequest = (payload) => async (dispatch) => {
  dispatch(setReturnMessage({ message: "", type: "" }));
  try {
    const response = await returnService.cancelReturnRequest(payload);
    if (response) {
      toasterService.success("Your return request has been cancelled");
      return true;
    }
    return false;
  } catch (err) {
    const message = err?.message || "Something went wrong";
    dispatch(setReturnMessage({ message, type: messageType.ERROR }));
    return false;
  }
};

export const deleteReturnRequest = (payload) => async (dispatch) => {
  dispatch(setReturnMessage({ message: "", type: "" }));
  dispatch(setDeleteReturnReqLoader(true));
  try {
    const response = await returnService.deleteReturnRequest(payload);
    if (response) {
      toasterService.success("Your return request has been deleted");
      return true;
    }
    return false;
  } catch (err) {
    const message = err?.message || "Something went wrong";
    dispatch(setReturnMessage({ message, type: messageType.ERROR }));
    return false;
  } finally {
    dispatch(setDeleteReturnReqLoader(false));
  }
};
