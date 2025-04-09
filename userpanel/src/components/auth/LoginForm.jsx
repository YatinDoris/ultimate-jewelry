"use client";

import { useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { helperFunctions } from "@/_helper";
import { useAlertTimeout } from "@/hooks/use-alert-timeout";
import {
  setLoginMessage,
  setUserRegisterMessage,
} from "@/store/slices/userSlice";
import { SendOTPForEmailVerification } from "@/_actions/user.action";
import { setIsHovered } from "@/store/slices/commonSlice";
import { LoadingPrimaryButton } from "../ui/button";
import Alert from "../ui/Alert";
import { messageType } from "@/_helper/constants";

// ----------------------------------------------------------------------

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
});

const initialValues = {
  email: "",
};

// ----------------------------------------------------------------------

const LoginForm = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { sendOtpLoading, loginMessage, userRegisterMessage } = useSelector(
    ({ user }) => user
  );
  const { isHovered } = useSelector(({ common }) => common);

  useAlertTimeout(userRegisterMessage, () =>
    dispatch(setUserRegisterMessage({ message: "", type: "" }))
  );

  useAlertTimeout(loginMessage, () =>
    dispatch(setLoginMessage({ message: "", type: "" }))
  );

  const onSubmit = useCallback(async (fields, { resetForm }) => {
    const payload = {
      email: fields.email,
    };

    const response = await dispatch(SendOTPForEmailVerification(payload));
    if (response) {
      resetForm();
      localStorage.setItem("email", fields.email);
      router.push("/auth/verify-otp");
    }
  }, []);

  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      onSubmit,
      validationSchema,
      enableReinitialize: true,
      initialValues,
    });

  const currentUser = helperFunctions.getCurrentUser();

  useEffect(() => {
    if (currentUser) {
      router.push("/");
    }
  }, [currentUser]);

  useEffect(() => {
    return () => {
      if (loginMessage?.type && loginMessage?.type !== messageType?.SUCCESS) {
        dispatch(setLoginMessage({ message: "", type: "" }));
      }
    };
  }, []);

  return (
    <div className="w-full lg:w-[90%] flex flex-col items-center justify-center h-full">
      <h2 className="text-3xl md:text-4xl text-baseblack font-castoro">
        Login
      </h2>
      <p className="text-sm sm:text-base 2xl:text-lg text-basegray mt-2">
        Enter your email address to receive the OTP
      </p>

      {/* Email Input */}
      <div className="mt-10 lg:mt-8 2xl:mt-10 w-full">
        <input
          type="email"
          name="email"
          placeholder="Email ID"
          className={`custom-input w-full ${
            touched?.email && errors?.email ? "border border-red-500" : ""
          }`}
          onChange={handleChange}
          onBlur={handleBlur}
          value={values?.email}
        />
        {touched?.email && errors?.email ? (
          <p className="text-red-500 text-sm mt-1">{errors?.email}</p>
        ) : null}
      </div>
      <div
        className="uppercase mt-6 2xl:mt-8 w-full"
        onMouseEnter={() => dispatch(setIsHovered(true))}
        onMouseLeave={() => dispatch(setIsHovered(false))}
      >
        <LoadingPrimaryButton
          className="w-full uppercase"
          loading={sendOtpLoading}
          loaderType={isHovered ? "" : "white"}
          onClick={handleSubmit}
        >
          LOG IN
        </LoadingPrimaryButton>
      </div>

      <p className="mt-3 lg:mt-4 text-sm sm:text-base 2xl:text-lg text-basegray text-center">
        Don’t have an account?{" "}
        <Link
          href="/auth/sign-up"
          className="underline text-primary hover:text-basegray transition-all duration-300 font-bold"
        >
          Sign Up
        </Link>
      </p>
      {loginMessage?.type !== messageType?.SUCCESS ? (
        <Alert message={loginMessage?.message} type={loginMessage?.type} />
      ) : null}
      <Alert
        message={userRegisterMessage?.message}
        type={userRegisterMessage?.type}
      />
    </div>
  );
};

export default LoginForm;
