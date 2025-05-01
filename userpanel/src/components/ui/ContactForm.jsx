"use client";
import { useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import ErrorMessage from "./ErrorMessage";
import { LoadingPrimaryButton } from "./button";
import { useDispatch, useSelector } from "react-redux";
import { setIsHovered } from "@/store/slices/commonSlice";
import { emailPattern, phoneRegex } from "@/_utils/common";
import { sendContact } from "@/_actions/contact.action";

const validationSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is Required"),
  lastName: Yup.string().required("Last Name is Required"),
  email: Yup
    .string()
    .matches(emailPattern, "Email is not valid")
    .required("Email is required"),
  phone: Yup
    .string()
    .matches(phoneRegex, "Phone number is not valid")
    .required("Phone number is required"),
  message: Yup.string().trim().notRequired(),
});

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  message: "",
};

const ContactForm = () => {
  const dispatch = useDispatch();
  const { contactMessage } = useSelector(
    ({ contact }) => contact
  );
  const onSubmit = useCallback(async (fields, { resetForm }) => {
    const payload = {
      firstName: fields.firstName,
      lastName: fields.lastName,
      email: fields.email,
      phone: fields.phone,
      message: fields.message,
    };
    const response = await dispatch(sendContact(payload))
    if (response) {
      resetForm();
    }
  });
  const { values, errors, touched, handleChange, handleBlur, handleSubmit } =
    useFormik({
      onSubmit,
      validationSchema,
      enableReinitialize: true,
      initialValues,
    });
  return (
    <div>
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h3 className="font-castoro font-normal text-[40px] xxs:mt-12 leading-[46px] tracking-[0.8px] text-left text-baseblack mb-4">
            Send a message
          </h3>
          <div className="border-[1.5px] rounded border-gray-e2 p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-20 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-md text-gray-66 uppercase mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  placeholder="First name"
                  className={`custom-input w-full ${touched.firstName && errors.firstName
                    ? "border-gray-e2 border"
                    : ""
                    }`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.firstName}
                />
                {touched.firstName && errors.firstName && (
                  <ErrorMessage message={errors.firstName} />
                )}
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-md text-gray-66 uppercase mb-1  "
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  placeholder="Last name"
                  className={`custom-input w-full ${touched.lastName && errors.lastName
                    ? "border-gray-e2 border"
                    : ""
                    }`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.lastName}
                />
                {touched.lastName && errors.lastName && (
                  <ErrorMessage message={errors.lastName} />
                )}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-md text-gray-66 uppercase mb-1  mt-4"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  placeholder="Your Email"
                  className={`custom-input w-full ${touched.email && errors.email ? "border-gray-e2 border" : ""
                    }`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                />
                {touched.email && errors.email && (
                  <ErrorMessage message={errors.email} />
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-md text-gray-66 uppercase mb-1  mt-4"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  placeholder="Phone number"
                  className={`custom-input w-full ${touched.phone && errors.phone ? "border-gray-e2 border" : ""
                    }`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.phone}
                />
                {touched.phone && errors.phone && (
                  <ErrorMessage message={errors.phone} />
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-md text-gray-66 uppercase mb-1 mt-4"
              >
                Message
              </label>
              <textarea
                name="message"
                id="message"
                placeholder="Type your Message"
                rows={4}
                className={`custom-input w-full${touched.message && errors.message
                  ? "border-gray-e2 border"
                  : ""
                  }`}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.message}
              />
              {touched.message && errors.message && (
                <ErrorMessage message={errors.message} />
              )}
            </div>

            <div
              onMouseEnter={() => dispatch(setIsHovered(true))}
              onMouseLeave={() => dispatch(setIsHovered(false))}
            >
              <LoadingPrimaryButton
                type="submit"
                className="uppercase mt-5"
                loading={false} // Force disable loading state
              >
                SEND MESSAGE
              </LoadingPrimaryButton>
            </div>
            {contactMessage.message && (
              <ErrorMessage message={contactMessage.message} />
            )}
          </div>
          <div className="flex flex-col md:flex-row justify-center xl:gap-10 xxs:gap-8 text-baseblack font-normal">
            <div className="border-gray-e2 border-[0.5px] p-6 flex-1 bg-white xl:mt-24 xss:mt-8">
              <h3 className="text-lg font-Castoro">Call:</h3>
              <p className="font-Figtree">123-456-7890</p>
            </div>

            <div className="border-gray-e2 border-[0.5px] p-6 flex-1  bg-white xl:mt-24 xss:mt-8">
              <h3 className="text-lg font-Castoro">Email:</h3>
              <p className="font-Figtree">katanoff@gmail.com</p>
            </div>

            <div className="border-gray-e2 border-[0.5px] p-6 flex-1 bg-white xl:mt-24 xss:mt-8">
              <h3 className="text-lg font-Castoro">Address:</h3>
              <p className="font-Figtree">
                13th Street 47 W 13th St, New York, NY
              </p>
            </div>
          </div>
        </form>
      </div>
      <div className="relative w-[99vw] max-w-none left-1/2 -translate-x-1/2 -mb-32 mt-28">
        <iframe
          className="w-full h-[550px] border-0 block"
          title="Google Maps Location"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.1613196085573!2d-74.00117201527388!3d40.736475697620996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25938111d3cdb%3A0x8b732a7f209c1ecc!2s47%20W%2013th%20St%2C%20New%20York%2C%20NY%2010011%2C%20USA!5e0!3m2!1sen!2sin!4v1746003655134!5m2!1sen!2sin"
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
};
export default ContactForm;
