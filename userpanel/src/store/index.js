import { combineReducers, configureStore } from "@reduxjs/toolkit";
import common from "./slices/commonSlice.js";
import product from "./slices/productSlice.js";
import cart from "./slices/cartSlice.js";
import user from "./slices/userSlice.js";
import address from "./slices/addressSlice.js";
import subscriber from "./slices/subscriberSlice.js";

const reducers = combineReducers({
  common,
  product,
  cart,
  user,
  address,
  subscriber
});

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
