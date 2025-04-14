import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  menuList: [],
  openDropdown: false,
  isMenuOpen: false,
  lastScrollY: false,
  isHovered: false,
  isCartOpen: false,
  openProfileDropdown: false,
  showModal: false,
  isChecked: false,
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
    setLastScrollY: (state, action) => {
      state.lastScrollY = action.payload;
    },
    setIsHovered: (state, action) => {
      state.isHovered = action.payload;
    },
    setIsCartOpen(state, action) {
      state.isCartOpen = action.payload;
    },
    setOpenProfileDropdown(state, action) {
      state.openProfileDropdown = action.payload;
    },
    setShowModal(state, action) {
      state.showModal = action.payload;
    },
    setIsChecked(state, action) {
      state.isChecked = action.payload;
    },
  },
});

export const {
  setMenuList,
  setIsMenuOpen,
  setOpenDropdown,
  setLastScrollY,
  setIsHovered,
  setIsCartOpen,
  setOpenProfileDropdown,
  setShowModal,
  setIsChecked,
} = commonSlice.actions;

export default commonSlice.reducer;
