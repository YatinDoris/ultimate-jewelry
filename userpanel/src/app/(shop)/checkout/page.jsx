"use client";
import {
  CheckoutCommonComponent,
  CustomImg,
} from "@/components/dynamiComponents";
import CommonBgHeading from "@/components/ui/CommonBgHeading";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as yup from "yup";
import { Country, State } from "country-state-city";
import { defaultCountry } from "@/store/slices/addressSlice";
import {
  handleAddressMessage,
  handleInvalidAddressDetail,
  validateAddress,
} from "@/_actions/address.action";
import CheckoutAddressModal from "@/components/ui/checkout/CheckoutAddressModal";
import ErrorMessage from "@/components/ui/ErrorMessage";
import {
  LoadingPrimaryButton,
  PrimaryButton,
  PrimaryLinkButton,
} from "@/components/ui/button";
import SkeletonLoader from "@/components/ui/skeletonLoader";
import cartImage from "@/assets/images/cart/cart.webp";
import { messageType } from "@/_helper/constants";
const countries = Country.getAllCountries();

const validationSchema = yup.object({
  firstName: yup.string().trim().required("First Name is required"),
  lastName: yup.string().trim().required("Last Name is required"),
  phone: yup
    .string()
    .matches(/^\+?[0-9]{6,14}$/, "Invalid Mobile Number")
    .required("Phone is Required"),
  email: yup
    .string()
    .email("Invalid email address")
    .required("Email is Required"),
  country: yup.string().required("Select a Country"),
  city: yup
    .string()
    .matches(/^[A-Za-z\s]+$/, "Only letters and spaces are allowed")
    .required("City is Required"),
  state: yup.string().required("Select a State"),
  zipCode: yup
    .string()
    .required("Pincode is a required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(5, "Must be exactly 5 digits")
    .max(6, "Must be exactly 6 digits"),
  address: yup.string().required("Address is Required"),
});

const Checkout = () => {
  const { cartLoading, cartList } = useSelector((state) => state.cart);
  const [stateList, setStateList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [standardizedAddress, setStandardizedAddress] = useState("");
  const router = useRouter();
  const abortControllerRef = useRef(null);
  const dispatch = useDispatch();
  const {
    addressLoader,
    validateAddressLoader,
    addressMessage,
    invalidAddressDetail,
  } = useSelector(({ address }) => address);
  const { isHovered } = useSelector(({ common }) => common);

  useEffect(() => {
    setCountryWiseStateList(defaultCountry);
    dispatch(handleAddressMessage({ message: "", type: "" }));

    return () => {
      clearAbortController(); // Cancel request on unmount/route change
    };
  }, []);

  let initialValues = useMemo(
    () => ({
      email: "",
      firstName: "",
      lastName: "",
      country: defaultCountry,
      city: "",
      state: "",
      zipCode: "",
      company: "",
      address: "",
      apartment: "",
      phone: "",
    }),
    []
  );

  const clearAbortController = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = null;
  }, []);

  const checkValidationAddress = useCallback(
    async (fieldValues) => {
      try {
        dispatch(handleAddressMessage({ message: "", type: "" }));

        dispatch(
          handleInvalidAddressDetail({
            setInvalidAddressDetail: {},
          })
        );
        if (!abortControllerRef.current) {
          abortControllerRef.current = new AbortController();
        }
        if (!cartList.length) {
          dispatch(
            handleAddressMessage({
              message: "cart data not found",
              type: messageType.ERROR,
            })
          );

          return;
        }
        const {
          address = "",
          apartment = "",
          city = "",
          state = "",
          country = "",
          pinCode = "",
        } = fieldValues;
        const addressLine = `${address} ${apartment} ${city} ${state} ${country} ${pinCode}`;
        const payload = {
          regionCode: country,
          addressLine: addressLine?.trim(),
        };
        const response = await dispatch(
          validateAddress(payload, abortControllerRef.current)
        );
        if (response.status === 200) {
          setShowModal(true);
          setStandardizedAddress(response.standardizedAddress);
        } else if (response.status === 422) {
          dispatch(
            handleAddressMessage({
              message: response.message || "Invalid address provided",
              type: messageType.ERROR,
            })
          );
          dispatch(
            handleInvalidAddressDetail({
              setInvalidAddressDetail: {
                unconfirmedComponentTypes:
                  response.unconfirmedComponentTypes?.map((x) =>
                    x?.replace("_", " ")
                  ),
                missingComponentTypes: response.missingComponentTypes?.map(
                  (x) => x?.replace("_", " ")
                ),
              },
            })
          );
        } else if (response?.message) {
          dispatch(
            handleAddressMessage({
              message: response.message,
              type: messageType.ERROR,
            })
          );
        }
      } catch (error) {
        console.error("Error occurred while validating address:", error);
      } finally {
        clearAbortController();
      }
    },
    [cartList.length, clearAbortController, dispatch]
  );

  useEffect(() => {
    let address = localStorage.getItem("address");
    if (address) {
      address = JSON.parse(address);

      const updatedValues = {
        ...initialValues,
        email: address.email,
        firstName: address.firstName,
        lastName: address.lastName,
        country: defaultCountry,
        state: address.state,
        stateCode: address.stateCode,
        city: address.city,
        zipCode: address.pinCode,
        company: address.companyName,
        address: address.address,
        apartment: address.apartment,
        phone: address.mobile,
      };
      formik.setValues(updatedValues);
      setCountryWiseStateList(address.countryName);
    }
  }, []);

  const setCountryWiseStateList = (selectedCountry) => {
    const matchedCountry = countries.find(
      (item) => item.isoCode === selectedCountry
    );
    if (matchedCountry) {
      const countryWiseStatesList = State.getStatesOfCountry(
        matchedCountry?.isoCode
      );
      setStateList(countryWiseStatesList);
    }
  };

  const checkoutModalClose = () => {
    setShowModal(false);
    setStandardizedAddress("");
  };

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: checkValidationAddress,
  });

  const enteredAddress = {
    address: formik.values.address,
    apartment: formik.values.apartment,
    city: formik.values.city,
    state: formik.values.state,
    country: formik.values.country,
    zipCode: formik.values.zipCode,
    stateCode: formik.values.stateCode,
  };
  const handleConfirm = useCallback(() => {
    formik.setSubmitting(false);
    const formsValue = {
      email: formik.values.email,
      countryName: formik.values.country,
      firstName: formik.values.firstName,
      lastName: formik.values.lastName,
      address: formik.values.address,
      city: formik.values.city,
      state: formik.values.state,
      stateCode: formik.values.stateCode,
      zipCode: formik.values.zipCode,
      mobile: formik.values.mobile,
      companyName: formik.values.company,
      apartment: formik.values.apartment,
    };
    localStorage.setItem("address", JSON.stringify(formsValue));
    router.push("/shipping");
    localStorage.removeItem("selectedShippingMethod");
    checkoutModalClose();
  }, [formik]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleCountryChange = (value) => {
    setValues((prevValues) => ({
      ...prevValues,
      country: value,
      state: "",
    }));
    setCountryWiseStateList(value);
  };

  const handleStateChange = (stateCode) => {
    const selectedState = stateList.find(
      (state) => state.isoCode === stateCode
    );
    if (selectedState) {
      formik.setValues((values) => ({
        ...values,
        stateCode: selectedState.isoCode,
        state: selectedState.name,
      }));
    } else {
      formik.setValues((values) => ({
        ...values,
        stateCode: "",
        state: "",
      }));
    }
  };
  const cartsLoading = true;
  return (
    <div className="mx-auto pt-10 lg:pt-10 2xl:pt-12">
      {cartLoading ? (
        <CheckoutSkeleton />
      ) : cartList?.length ? (
        <>
          <CommonBgHeading
            title="Secure Checkout"
            backText="Back to Back"
            backHref="/cart"
          />
          <div className="grid grid-cols-1 lg:grid-cols-[55%_auto] lg:gap-6 container mx-auto h-full">
            <form onKeyDown={handleKeyPress}>
              <div className="flex flex-col gap-6 py-8">
                <section className="border-2 border-[#0000001A] px-4">
                  <h2 className="text-lg text-baseblack font-semibold pt-8">
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                    <div>
                      <label className="block text-sm font-semibold text-[#666666] mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        placeholder="First name"
                        className="w-full px-3 py-2"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values?.firstName || ""}
                      />
                      {formik.touched?.firstName &&
                        formik.errors?.firstName && (
                          <p className="text-left text-sm 2xl:text-lg text-rose-500 ml-2">
                            {formik.errors?.firstName}
                          </p>
                        )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#666666] mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        placeholder="Last name"
                        name="lastName"
                        className="w-full  px-3 py-2"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values?.lastName || ""}
                      />
                      {formik.touched?.lastName && formik.errors?.lastName && (
                        <p className="text-left text-sm 2xl:text-lg text-rose-500 ml-2">
                          {formik.errors?.lastName}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2 ">
                      <label className="block text-sm font-semibold text-[#666666] mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        placeholder="Phone number"
                        className="w-full  px-3 py-2"
                        name="phone"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values?.phone || ""}
                      />
                      {formik.touched?.phone && formik.errors?.phone && (
                        <p className="text-left text-sm 2xl:text-lg text-rose-500 ml-2">
                          {formik.errors?.phone}
                        </p>
                      )}
                    </div>
                    <div className="md:col-span-2 pb-8">
                      <label className="block text-sm font-semibold text-[#666666] mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        placeholder="Your Email"
                        className="w-full  px-3 py-2"
                        name="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values?.email || ""}
                      />
                      {formik.touched?.email && formik.errors?.email && (
                        <p className="text-left text-sm 2xl:text-lg text-rose-500 ml-2">
                          {formik.errors?.email}
                        </p>
                      )}
                    </div>
                  </div>
                </section>

                <section className="border-2 border-[#0000001A] px-4">
                  <h2 className="text-lg font-semibold pt-6">
                    Shipping Address
                  </h2>
                  <div className="flex flex-col gap-6 pt-8">
                    <div>
                      <label className="block text-sm font-semibold text-[#666666] mb-1">
                        House No, Street Name
                      </label>
                      <input
                        type="text"
                        placeholder="Street Address"
                        className="w-full px-3 py-2"
                        name="address"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values?.address || ""}
                      />
                      {formik.touched?.address && formik.errors?.address && (
                        <p className="text-left text-sm 2xl:text-lg text-rose-500 ml-2">
                          {formik.errors?.address}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#666666] mb-1">
                        Country *
                      </label>
                      <input
                        type="text"
                        placeholder="Country"
                        disabled={true}
                        className="w-full  px-3 py-2"
                        name="country"
                        onChange={(event) =>
                          handleCountryChange(event.target.value)
                        }
                        onBlur={formik.handleBlur}
                        value={formik.values?.country || ""}
                      />
                      {formik.touched?.country && formik.errors?.country && (
                        <p className="text-left text-sm 2xl:text-lg text-rose-500 ml-2">
                          {formik.errors?.country}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#666666] mb-1">
                        Company
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Company (Optional)"
                        className="w-full  px-3 py-2"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values?.company || ""}
                        name="company"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#666666] mb-1">
                        Apartment
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Apartment"
                        className="w-full  px-3 py-2"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values?.appartment || ""}
                        name="appartment"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-[#666666] mb-1">
                        Town / City *
                      </label>
                      <input
                        type="text"
                        placeholder="Town / City"
                        className="w-full  px-3 py-2"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values?.city || ""}
                        name="city"
                      />
                      {formik.touched?.city && formik.errors?.city && (
                        <p className="text-left text-sm 2xl:text-lg text-rose-500 ml-2">
                          {formik.errors?.city}
                        </p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
                      <div>
                        <label className="block text-sm font-semibold text-[#666666] mb-1">
                          State
                        </label>
                        <select
                          name="stateCode"
                          value={formik.values.stateCode || ""}
                          onChange={(e) => handleStateChange(e.target.value)}
                          onBlur={formik.handleBlur}
                          className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 ${
                            formik.touched.stateCode && formik.errors.stateCode
                              ? "border-rose-500"
                              : "border-gray-300"
                          }`}
                        >
                          <option value="" hidden>
                            Select State
                          </option>
                          {stateList.length > 0 ? (
                            stateList.map((state) => (
                              <option key={state.isoCode} value={state.isoCode}>
                                {state.name}
                              </option>
                            ))
                          ) : (
                            <option disabled>No Records Found</option>
                          )}
                        </select>

                        {formik.touched.stateCode &&
                          formik.errors.stateCode && (
                            <p className="text-left text-sm text-rose-500 mt-1">
                              {formik.errors.stateCode}
                            </p>
                          )}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-[#666666] mb-1">
                          Zip Code
                        </label>
                        <input
                          type="text"
                          placeholder="Zip Code"
                          className="w-full  px-3 py-2"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values?.zipCode || ""}
                          name="zipCode"
                        />
                        {formik.touched?.zipCode && formik.errors?.zipCode && (
                          <p className="text-left text-sm 2xl:text-lg text-rose-500 ml-2">
                            {formik.errors?.zipCode}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                <div>
                  <LoadingPrimaryButton
                    className="w-full uppercase hover:!text-primary"
                    loading={validateAddressLoader}
                    loaderType={isHovered ? "" : "primary"}
                    onClick={formik.handleSubmit}
                  >
                    CONTINUE Shipping
                  </LoadingPrimaryButton>
                  {addressMessage?.message ? (
                    <ErrorMessage message={addressMessage?.message} />
                  ) : null}

                  <div className="flex flex-col md:flex-row gap-4 mt-4">
                    {invalidAddressDetail?.unconfirmedComponentTypes?.length >
                      0 && (
                      <div className="flex-1">
                        <h4 className="font-semibold text-red-600 mb-2">
                          Unconfirmed:
                        </h4>
                        <ul className="list-inside text-red-600 text-sm">
                          {invalidAddressDetail.unconfirmedComponentTypes.map(
                            (componentType, index) => (
                              <li key={index}>
                                {componentType.replace(/_/g, " ")}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                    {invalidAddressDetail?.missingComponentTypes?.length >
                      0 && (
                      <div className="flex-1">
                        <h4 className="font-semibold text-red-600 mb-2">
                          Missing:
                        </h4>
                        <ul className="list-inside text-red-600 text-sm">
                          {invalidAddressDetail.missingComponentTypes.map(
                            (componentType, index) => (
                              <li key={index}>{componentType}</li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>

            <div>
              <CheckoutCommonComponent />
            </div>
          </div>
          {showModal && (
            <CheckoutAddressModal
              onClose={checkoutModalClose}
              confirmLoader={false}
              loading={addressLoader}
              enteredAddress={enteredAddress}
              handleConfirm={handleConfirm}
              standardizedAddress={standardizedAddress}
            />
          )}
        </>
      ) : (
        <div className="flex flex-col items-center h-[80vh] lg:h-[80vh] justify-center align-middle mx-auto my-auto  text-center px-4">
          <CustomImg
            srcAttr={cartImage}
            altAttr=""
            titleAttr=""
            className="mb-6 w-80"
          />

          <p className="text-lg md:text-xl 2xl:text-3xl font-medium font-castoro text-baseblack">
            Oops! Your cart is empty. Let’s fix that <br /> with some stunning
            jewelry
          </p>
          <PrimaryLinkButton
            href="/"
            className=" !rounded-none !font-medium !mt-8 w-fit !px-16 !py-6 !text-lg  uppercase"
          >
            Back To Shop
          </PrimaryLinkButton>
        </div>
      )}
    </div>
  );
};

export default Checkout;
const CheckoutSkeleton = () => {
  const skeletons = [
    { width: "w-[40%]", height: "h-4", margin: "mt-2" },
    { width: "w-full", height: "h-8", margin: "mt-2" },
    { width: "w-[40%]", height: "h-4", margin: "mt-6" },
    { width: "w-full", height: "h-8", margin: "mt-2" },
  ];
  return (
    <div
      className={`container grid grid-cols-1 lg:grid-cols-[70%_auto] gap-12 pt-12`}
    >
      <div>
        {Array(4)
          .fill(skeletons)
          .flat()
          .map((skeleton, index) => (
            <SkeletonLoader
              key={index}
              width={skeleton.width}
              height={skeleton.height}
              className={skeleton.margin}
            />
          ))}
      </div>
      <div className="grid grid-cols-1 gap-4 auto-rows-min">
        <SkeletonLoader height="w-full h-[70] md:h-[220px]  2xl:h-[150px]" />
        <SkeletonLoader height="w-full h-[70] md:h-[220px]  2xl:h-[150px]" />
        <SkeletonLoader height="w-full h-[70] md:h-[220px]  2xl:h-[150px]" />

        <SkeletonLoader height="w-[20%] h-[40px]" />
      </div>
    </div>
  );
};
