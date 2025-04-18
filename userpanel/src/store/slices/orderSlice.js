import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  orderList: [],
  orderDetail: {},
  orderLoading: false,
  orderMessage: { message: "", type: "" },
  cancelOrderLoading: false,
  currentPage: 0,
  invoiceLoading: false,
  selectedOrder: ""
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    // Order History States
    setOrderList: (state, action) => {
      state.orderList = action.payload;
    },
    setOrderDetail: (state, action) => {
      state.orderDetail = action.payload;
    },
    setInvoiceLoading: (state, action) => {
      state.invoiceLoading = action.payload;
    },
    setOrderLoading: (state, action) => {
      state.orderLoading = action.payload;
    },
    setCancelOrderLoading: (state, action) => {
      state.cancelOrderLoading = action.payload;
    },
    setOrderMessage: (state, action) => {
      state.orderMessage = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
    },
  },
});

export const {
  setSelectedOrder,
  setOrderList,
  setOrderLoading,
  setCurrentPage,
  setCancelOrderLoading,
  setOrderMessage,
  setOrderDetail,
  setInvoiceLoading
} = orderSlice.actions;

export default orderSlice.reducer;
