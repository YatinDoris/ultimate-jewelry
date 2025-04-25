// "use client";

// import { useState } from "react";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import CommonBgHeading from "@/components/ui/CommonBgHeading";
// import { LoadingPrimaryButton } from "@/components/ui/button";
// import { OrderSummary } from "@/components/dynamiComponents";

// export default function TrackOrderPage() {
//     const [submittedData, setSubmittedData] = useState(null);
//     const [showSummary, setShowSummary] = useState(false);

//     const validationSchema = Yup.object().shape({
//         OrderNumber: Yup.string().required("Order number is required"),
//         OrderBillingEmail: Yup.string()
//             .email("Invalid email")
//             .required("Order billing email is required"),
//     });

//     const handleSubmit = (values, { setSubmitting }) => {
//         setSubmittedData(values);
//         setShowSummary(true);
//         setSubmitting(false);
//     };

//     return (
//         <div className="flex flex-col items-center min-h-screen bg-gray-50">
//             <CommonBgHeading title="Order Tracking" />

//             <div className="container">
//                 <div className="container w-full max-w-md p-6 bg-white shadow-md mt-10">
//                     <div className="text-right text-sm text-gray-600 mb-2">
//                         <span className="text-red-500">*</span> Required Fields
//                     </div>

//                     <Formik
//                         initialValues={{ OrderNumber: "", OrderBillingEmail: "" }}
//                         validationSchema={validationSchema}
//                         onSubmit={handleSubmit}
//                     >
//                         {({ isSubmitting }) => (
//                             <Form>
//                                 <div className="mb-4">
//                                     <label htmlFor="OrderNumber" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Order Number <span className="text-red-500">*</span>
//                                     </label>
//                                     <Field
//                                         type="text"
//                                         name="OrderNumber"
//                                         placeholder="Order Number"
//                                         className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                     />
//                                     <ErrorMessage name="OrderNumber" component="div" className="text-red-500 text-sm mt-1" />
//                                 </div>

//                                 <div className="mb-4">
//                                     <label htmlFor="OrderBillingEmail" className="block text-sm font-medium text-gray-700 mb-1">
//                                         Order Billing Email <span className="text-red-500">*</span>
//                                     </label>
//                                     <Field
//                                         type="email"
//                                         name="OrderBillingEmail"
//                                         placeholder="Order Billing Email"
//                                         className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                                     />
//                                     <ErrorMessage name="OrderBillingEmail" component="div" className="text-red-500 text-sm mt-1" />
//                                 </div>

//                                 <LoadingPrimaryButton
//                                     className="w-full uppercase bg-blue-900 text-white py-3 hover:bg-blue-800 transition-colors"
//                                     loading={isSubmitting}
//                                     type="submit"
//                                 >
//                                     {isSubmitting ? "Submitting..." : "Submit"}
//                                 </LoadingPrimaryButton>
//                             </Form>
//                         )}
//                     </Formik>
//                 </div>

//                 {/* Show Order Summary */}
//                 {showSummary && submittedData && (
//                     <div className="container">
//                         <OrderSummary orderId={submittedData.OrderNumber} />
//                         {/* You can also pass email to OrderSummary if needed */}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }


"use client";

import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useSelector, useDispatch } from "react-redux";
import CommonBgHeading from "@/components/ui/CommonBgHeading";
import { LoadingPrimaryButton } from "@/components/ui/button";
import { OrderSummary } from "@/components/dynamiComponents";
import { setUserRegisterLoading } from "@/store/slices/userSlice";
import { setIsHovered } from "@/store/slices/commonSlice";

export default function TrackOrderPage() {
    const [submittedData, setSubmittedData] = useState(null);
    const [showSummary, setShowSummary] = useState(false);

    const validationSchema = Yup.object().shape({
        OrderNumber: Yup.string().required("Order number is required"),
        OrderBillingEmail: Yup.string()
            .email("Invalid email")
            .required("Order billing email is required"),
    });

    const { userRegisterLoading, isHovered } = useSelector((state) => ({
        userRegisterLoading: state.user.userRegisterLoading,
        isHovered: state.common.isHovered,
    }));

    const dispatch = useDispatch();

    const handleSubmit = (values, { setSubmitting }) => {
        setSubmittedData(values);
        setShowSummary(true);
        dispatch(setUserRegisterLoading(false)); // Example: set loading to false after submission
        setSubmitting(false);
    };

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-50">
            <CommonBgHeading title="Order Tracking" />

            <div className="container">
                <div className="container w-full max-w-md p-6 bg-white shadow-md mt-10">
                    <div className="text-right text-sm text-gray-600 mb-2">
                        <span className="text-red-500">*</span> Required Fields
                    </div>

                    <Formik
                        initialValues={{ OrderNumber: "", OrderBillingEmail: "" }}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form>
                                <div className="mb-4">
                                    <label htmlFor="OrderNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                        Order Number <span className="text-red-500">*</span>
                                    </label>
                                    <Field
                                        type="text"
                                        name="OrderNumber"
                                        placeholder="Order Number"
                                        className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <ErrorMessage name="OrderNumber" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="OrderBillingEmail" className="block text-sm font-medium text-gray-700 mb-1">
                                        Order Billing Email <span className="text-red-500">*</span>
                                    </label>
                                    <Field
                                        type="email"
                                        name="OrderBillingEmail"
                                        placeholder="Order Billing Email"
                                        className="w-full p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <ErrorMessage name="OrderBillingEmail" component="div" className="text-red-500 text-sm mt-1" />
                                </div>

                                <div
                                    className="uppercase mt-6 2xl:mt-8 w-full"
                                    onMouseEnter={() => dispatch(setIsHovered(true))}
                                    onMouseLeave={() => dispatch(setIsHovered(false))}
                                >
                                    <LoadingPrimaryButton
                                        className="w-full uppercase bg-blue-900 text-white py-3 hover:bg-blue-800 transition-colors"
                                        loading={userRegisterLoading}
                                        loaderType={isHovered ? "" : "white"}
                                        type="submit"
                                    >
                                        {isSubmitting ? "Submitting..." : "Submit"}
                                    </LoadingPrimaryButton>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>

                {showSummary && submittedData && (
                    <div className="container">
                        <OrderSummary orderId={submittedData.OrderNumber} />
                    </div>
                )}
            </div>
        </div>
    );
}