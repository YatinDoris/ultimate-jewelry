import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: true,
  returnsList: [],
  detailLoader: true,
  orderDetail: {},
  returnDetail: {},
  returnReqLoader: false,
  deleteReturnReqLoader: false,
  returnMessage: { message: "", type: "" },
  selectedProducts: [],
};

const returnSlice = createSlice({
  name: "returns",
  initialState,
  reducers: {
    setReturnsList: (state, action) => {
      state.isLoading = false;
      state.returnsList = action.payload;
    },
    setReturnDetail: (state, action) => {
      state.detailLoader = false;
      state.returnDetail = action.payload;
    },
    setOrderDetail: (state, action) => {
      state.detailLoader = false;
      state.orderDetail = action.payload;
    },
    setReturnRequestLoader: (state, action) => {
      state.returnReqLoader = action.payload;
    },
    setDeleteReturnRequestLoader: (state, action) => {
      state.deleteReturnReqLoader = action.payload;
    },
    setReturnMessage: (state, action) => {
      state.returnMessage = action.payload;
    },
    clearReturnMessage: (state) => {
      state.returnMessage = { message: "", type: "" };
    },
    setSelectedProducts: (state, action) => {
      state.selectedProducts = action.payload;
    },
  },
});

export const {
  setReturnsList,
  setReturnDetail,
  setOrderDetail,
  setReturnRequestLoader,
  setDeleteReturnRequestLoader,
  setReturnMessage,
  clearReturnMessage,
  setSelectedProducts,
} = returnSlice.actions;

export default returnSlice.reducer;
