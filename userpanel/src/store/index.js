import { combineReducers, configureStore } from "@reduxjs/toolkit";
import common from "./slices/commonSlice.js";
import product from "./slices/productSlice.js";

const reducers = combineReducers({
  common,
  product
});

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
