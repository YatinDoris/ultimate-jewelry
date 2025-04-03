import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  productLoading: false,
  latestProductList: [],
  productDetail: {},
  collectionTypeProductList: [],
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
    setCollectionTypeProductList: (state, action) => {
      state.collectionTypeProductList = action.payload;
    },
    setProductDetail: (state, action) => {
      state.productDetail = action.payload;
    },
  },
});

export const {
  setProductLoading,
  setLatestProductList,
  setCollectionTypeProductList,
  setProductDetail,
} = productSlice.actions;

export default productSlice.reducer;
