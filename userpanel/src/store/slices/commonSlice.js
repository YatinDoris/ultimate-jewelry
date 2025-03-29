import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  menuList: [],
  openDropdown: false,
  isMenuOpen: false,
};

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setMenuList: (state, action) => {
      state.menuList = action.payload;
    },

    setIsMenuOpen: (state, action) => {
      state.isMenuOpen = action.payload;
    },
    setOpenDropdown: (state, action) => {
      state.openDropdown = action.payload;
    },
  },
});

export const {
  setMenuList,
  setIsMenuOpen,
  setOpenDropdown,

} = commonSlice.actions;

export default commonSlice.reducer;
