import { combineReducers, configureStore } from "@reduxjs/toolkit";
import common from "./slices/commonSlice.js";

const reducers = combineReducers({
  common,
});

const store = configureStore({
  reducer: reducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
