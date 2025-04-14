import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  updatePaymentStatusLoader: false,
  checkPIStatusLoader: false,
  paymentMessage: { type: "", message: "" },
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setUpdatePaymentStatusLoader: (state, action) => {
      state.updatePaymentStatusLoader = action.payload;
    },
    setCheckPIStatusLoader: (state, action) => {
      state.checkPIStatusLoader = action.payload;
    },
    setPaymentMessage: (state, action) => {
      state.paymentMessage = action.payload;
    },
    clearPaymentMessage: (state) => {
      state.paymentMessage = { type: "", message: "" };
    },
  },
});

export const {
  setLoading,
  setUpdatePaymentStatusLoader,
  setCheckPIStatusLoader,
  setPaymentMessage,
  clearPaymentMessage,
} = paymentSlice.actions;

export default paymentSlice.reducer;
