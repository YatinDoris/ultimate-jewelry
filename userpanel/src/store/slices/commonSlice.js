import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  menuList: [],
  isMenuDropDownOpen: false
};

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setMenuList: (state, action) => {
      state.menuList = action.payload;
    },
    setMenuDropDownOpen: (state, action) => {
      state.isMenuDropDownOpen = action.payload;
    },
  },
});

export const {
  setMenuList,
  setMenuDropDownOpen 
} = commonSlice.actions;

export default commonSlice.reducer;
