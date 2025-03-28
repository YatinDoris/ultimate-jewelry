import { uid } from "uid";
import { fetchWrapperService, sanitizeObject, sanitizeValue } from "../_helper";
import { toasterService } from "./toaster.service";
import axios from "axios";
import {
  handleSendOtpError,
  handleVerifyOtpError,
} from "../store/actions/userActions";
const bcrypt = require("bcryptjs");

const adminUrl = process.env.REACT_APP_ADMIN;
const userUrl = process.env.REACT_APP_USER;

const createUser = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!navigator.onLine) {
        reject(new Error("No internet connection"));
        return;
      }

      const uuid = uid();
      let { firstName, lastName, email, password, confirmPassword } =
        sanitizeObject(params);
      firstName = firstName ? firstName.trim() : null;
      lastName = lastName ? lastName.trim() : null;
      email = email ? email.trim() : null;
      password = password ? password.trim() : null;
      confirmPassword = confirmPassword ? confirmPassword.trim() : null;
      if (
        firstName &&
        lastName &&
        email &&
        password &&
        confirmPassword &&
        uuid
      ) {
        const findPattern = { email: email };
        const userData = await fetchWrapperService.findOne(
          userUrl,
          findPattern
        );
        const adminData = await fetchWrapperService.findOne(
          adminUrl,
          findPattern
        );
        if (adminData) {
          reject(
            new Error(
              "Account Already Exists in Admin Panel. Use Another EmailID"
            )
          );
          return;
        }

        if (!userData) {
          if (password === confirmPassword) {
            const hash = bcrypt.hashSync(password, 12);
            const insertPattern = {
              id: uuid,
              firstName,
              lastName,
              email,
              password: hash,
              createdDate: Date.now(),
              updatedDate: Date.now(),
            };

            const createPattern = {
              url: `${userUrl}/${uuid}`,
              insertPattern: insertPattern,
            };
            fetchWrapperService
              .create(createPattern)
              .then((response) => {
                // const mailPayload = {
                //   email
                // }
                // sendWelcomeMail(mailPayload)
                resolve(insertPattern);
              })
              .catch((e) => {
                reject(new Error("An error occurred during user creation."));
              });
          } else {
            reject(new Error("Password mismatch!...try again!"));
          }
        } else {
          reject(new Error("You already have an account please Login"));
        }
      } else {
        reject(new Error("invalid Data"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const sendOTPForVerificationEmail =
  (payload, abortController) => async (dispatch) => {
    try {
      dispatch(handleSendOtpError({ setSendOtpError: "" }));
      if (Object.keys(payload).length) {
        const signal = abortController && abortController.signal;
        const response = await axios.post(
          "/user/sendOtpForEmailVerification",
          sanitizeObject(payload),
          { signal }
        );
        const { status, message } = response.data;

        if (status === 200) {
          toasterService.success(message);
          return response.data;
        } else {
          dispatch(handleSendOtpError({ setSendOtpError: message }));
          return false;
        }
      } else {
        dispatch(handleSendOtpError({ setSendOtpError: "Invalid Data" }));
        return false;
      }
    } catch (error) {
      if (error.code === "ERR_NETWORK")
        dispatch(handleSendOtpError({ setSendOtpError: error?.message }));
      console.log("send otp email verification error : ", error?.message);
      return false;
    }
  };

const verifyOtp = (payload, abortController) => async (dispatch) => {
  try {
    dispatch(handleVerifyOtpError({ setVerifyOtpError: "" }));
    if (Object.keys(payload).length) {
      const signal = abortController && abortController.signal;
      const response = await axios.post(
        "/user/verifyOtp",
        sanitizeObject(payload),
        { signal }
      );
      const { status, message } = response.data;

      if (status === 200) {
        toasterService.success("Logged in successfully");
        return response.data;
      } else {
        dispatch(handleVerifyOtpError({ setVerifyOtpError: message }));
        return false;
      }
    } else {
      dispatch(handleVerifyOtpError({ setVerifyOtpError: "Invalid Data" }));
      return false;
    }
  } catch (error) {
    if (error.code === "ERR_NETWORK")
      dispatch(handleVerifyOtpError({ setVerifyOtpError: error?.message }));
    console.log("verify otp error : ", error?.message);
    return false;
  }
};

const getUserProfile = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      userId = sanitizeValue(userId) ? userId.trim() : null;

      if (userId) {
        const getUserData = await fetchWrapperService.findOne(userUrl, {
          id: userId,
        });
        if (getUserData) {
          resolve(getUserData);
        } else {
          reject(new Error("User does not exist"));
        }
      } else {
        reject(new Error("Invalid data"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateUserProfile = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { userId, firstName, lastName } = sanitizeObject(params);
      firstName = firstName ? firstName.trim() : null;
      lastName = lastName ? lastName.trim() : null;
      if (userId) {
        const userData = await fetchWrapperService.findOne(userUrl, {
          id: userId,
        });
        if (userData) {
          const payload = {
            firstName: firstName ? firstName : userData.firstName,
            lastName: lastName ? lastName : userData.lastName,
            updatedDate: Date.now(),
          };
          const updatePattern = {
            url: `${userUrl}/${userId}`,
            payload: payload,
          };
          fetchWrapperService
            ._update(updatePattern)
            .then((response) => {
              resolve(payload);
            })
            .catch((e) => {
              reject(
                new Error("An error occurred during update user profile.")
              );
            });
        } else {
          reject(new Error("user not found!"));
        }
      } else {
        reject(new Error("Invalid Data"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

export const userService = {
  createUser,
  sendOTPForVerificationEmail,
  verifyOtp,
  getUserProfile,
  updateUserProfile,
};
