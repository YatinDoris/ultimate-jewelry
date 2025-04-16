import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  menuList: [],
  openDropdown: false,
  menuLoading: false,
  isMenuOpen: false,
  lastScrollY: false,
  openDropdownMobile: false,
  isHovered: false,
  isCartOpen: false,
  openProfileDropdown: false,
  showModal: false,
  isChecked: false,
  isSubmitted: false,
};

const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    // Header
    setMenuLoading: (state, action) => {
      state.menuLoading = action.payload;
    },
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
    setOpenDropdownMobile: (state, action) => {
      state.openDropdownMobile = action.payload;
    },

    // Others
    setIsHovered: (state, action) => {
      state.isHovered = action.payload;
    },
    setIsCartOpen(state, action) {
      state.isCartOpen = action.payload;
    },
    setOpenProfileDropdown: (state, action) => {
      state.openProfileDropdown = action.payload;
    },
    setShowModal(state, action) {
      state.showModal = action.payload;
    },
    setIsChecked(state, action) {
      state.isChecked = action.payload;
    },
    setIsSubmitted(state, action) {
      state.isSubmitted = action.payload;
    },
  },
});

export const {
  setMenuList,
  setMenuLoading,
  setIsMenuOpen,
  setOpenDropdown,
  setOpenDropdownMobile,
  setLastScrollY,
  setIsHovered,
  setIsCartOpen,
  setOpenProfileDropdown,
  setShowModal,
  setIsChecked,
  setIsSubmitted,
} = commonSlice.actions;

export default commonSlice.reducer;
