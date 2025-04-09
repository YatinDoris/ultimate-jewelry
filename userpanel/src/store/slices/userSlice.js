import { createSlice } from "@reduxjs/toolkit";

export const initUserProfile = {
  firstName: "",
  lastName: "",
  email: "",
  mobile: undefined,
};

const initialState = {
  sendOtpLoading: false,
  loginMessage: { message: "", type: "" },
  verifyOTPLoading: false,
  userRegisterLoading: false,
  userRegisterMessage: { message: "", type: "" },
  userProfile: initUserProfile,
  userProfileMessage: { message: "", type: "" },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setSendOtpLoading: (state, action) => {
      state.sendOtpLoading = action.payload;
    },
    setLoginMessage: (state, action) => {
      state.loginMessage = action.payload;
    },
    setVerifyOtpLoading: (state, action) => {
      state.verifyOTPLoading = action.payload;
    },
    setUserRegisterLoading: (state, action) => {
      state.userRegisterLoading = action.payload;
    },
    setUserRegisterMessage: (state, action) => {
      state.userRegisterMessage = action.payload;
    },
    setUserProfileMessage: (state, action) => {
      state.userProfileMessage = action.payload;
    },
    setUserProfile: (state, action) => {
      state.userProfile = action.payload;
    },
  },
});

export const {
  setSendOtpLoading,
  setLoginMessage,

  setVerifyOtpLoading,

  setUserRegisterLoading,
  setUserRegisterMessage,

  setUserProfileMessage,
  setUserProfile,
} = userSlice.actions;

export default userSlice.reducer;
