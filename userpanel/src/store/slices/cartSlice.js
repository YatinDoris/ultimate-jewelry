import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  cartLoading: false,
  cartList: [],
  addLoader: false,
  selectedCartItem: "",
  isProductQuantityHasUpdatedIntoCart: false,
  cartMessage: { message: "", type: "" },
  updateCartQtyErrorMessage: "",
  removeCartErrorMessage: "",
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartLoading: (state, action) => {
      state.cartLoading = action.payload;
    },
    setCartList: (state, action) => {
      state.cartList = action.payload;
    },
    clearCart: (state) => {
      state.cartList = []; // This will empty the cart
    },
    setSelectedCartItem: (state, action) => {
      state.selectedCartItem = action.payload;
    },
    setProductQuantityHasUpdatedIntoCart: (state, action) => {
      state.isProductQuantityHasUpdatedIntoCart = action.payload;
    },
    setCartMessage: (state, action) => {
      state.cartMessage = action.payload;
    },
    setUpdateCartQtyErrorMessage: (state, action) => {
      state.updateCartQtyErrorMessage = action.payload;
    },
    setRemoveCartErrorMessage: (state, action) => {
      state.removeCartErrorMessage = action.payload;
    },
  },
});

export const {
  setCartLoading,
  setCartList,
  setSelectedCartItem,
  setProductQuantityHasUpdatedIntoCart,
  setCartMessage,
  setUpdateCartQtyErrorMessage,
  setRemoveCartErrorMessage,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
