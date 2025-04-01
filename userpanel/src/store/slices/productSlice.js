import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  productLoading: false,
  latestProductList: []
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProductLoading: (state, action) => {
      state.productLoading = action.payload;
    },
    setLatestProductList: (state, action) => {
      state.latestProductList = action.payload;
    },
  },
});

export const {
  setProductLoading,
  setLatestProductList
} = productSlice.actions;

export default productSlice.reducer;
