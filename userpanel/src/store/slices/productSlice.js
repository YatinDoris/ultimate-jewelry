import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  productLoading: false,
  latestProductList: [],
  productDetail: {},
  collectionTypeProductList: [],
  currentPage: 0,
  selectedVariations: {},
  productQuantity: 1,
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
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSelectedVariations: (state, action) => {
      state.selectedVariations = action.payload;
    },
    setProductQuantity: (state, action) => {
      state.productQuantity = action.payload;
    },
  },
});

export const {
  setProductLoading,
  setLatestProductList,
  setCollectionTypeProductList,
  setProductDetail,
  setCurrentPage,
  setSelectedVariations,
  setProductQuantity,
} = productSlice.actions;

export default productSlice.reducer;
