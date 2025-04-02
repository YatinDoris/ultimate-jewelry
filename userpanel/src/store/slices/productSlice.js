import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  productLoading: false,
  latestProductList: [],
  collectionTypeProductList: []
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
    }
  },
});

export const {
  setProductLoading,
  setLatestProductList,
  setCollectionTypeProductList
} = productSlice.actions;

export default productSlice.reducer;
