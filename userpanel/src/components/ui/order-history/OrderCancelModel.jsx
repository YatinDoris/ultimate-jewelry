import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { GrayButton, LoadingPrimaryButton } from "../button";
import { setIsHovered, setShowModal } from "@/store/slices/commonSlice";
import Modal from "../Modal";

// Replace with your actual action
// import { cancelOrder } from "@/store/slices/orderSlice";

export default function CancelOrderModel() {
  const dispatch = useDispatch();
  const { cancelOrderLoading, isHovered } = useSelector(({ order }) => order);

  const initialValues = {
    reason: "",
  };

  const validationSchema = Yup.object({
    reason: Yup.string()
      .required("Reason is required")
      .min(5, "Reason must be at least 5 characters"),
  });

  const handleSubmit = (values) => {
    console.log("Submitted reason:", values.reason);
    // Dispatch your cancel order action here
    // dispatch(cancelOrder(values.reason));
  };

  return (
    <Modal titleClassName="!text-center" title="Cancel Order" footer={null}>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isValid }) => (
          <Form>
            <div className="mb-4">
              <label htmlFor="reason" className="block text-base font-semibold">
                Reason
              </label>
              <Field
                as="textarea"
                id="reason"
                name="reason"
                rows="4"
                placeholder="Enter cancellation reason..."
                className="mt-1 block w-full  border border-[#DFDFDF] shadow-sm focus:ring-primary-500 focus:border-primary-500 p-2"
              />
              <ErrorMessage
                name="reason"
                component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>

            <div className="flex gap-6">
              <GrayButton
                title="CANCEL"
                onClick={() => dispatch(setShowModal(false))}
              >
                Cancel
              </GrayButton>

              <div
                onMouseEnter={() => dispatch(setIsHovered(true))}
                onMouseLeave={() => dispatch(setIsHovered(false))}
              >
                <LoadingPrimaryButton
                  type="submit"
                  title="Submit"
                  loading={cancelOrderLoading}
                  disabled={cancelOrderLoading || !isValid}
                  loaderType={isHovered ? "" : "white"}
                  className="uppercase"
                >
                  Confirm
                </LoadingPrimaryButton>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Modal>
  );
}
