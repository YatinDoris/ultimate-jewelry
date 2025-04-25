"use client";

import React from "react";
import ReactSlider from "react-slider";
import { useFormik } from "formik";
import * as Yup from "yup";

const CaratWeightSlider = ({ minCarat, maxCarat, value, onChange }) => {
  const currentValue = value ?? minCarat;

  const validationSchema = Yup.object({
    caratWeight: Yup.number()
      .required("Carat weight is required")
      .min(minCarat, `Minimum carat weight is ${minCarat.toFixed(2)}`)
      .max(maxCarat, `Maximum carat weight is ${maxCarat.toFixed(2)}`),
  });

  const formik = useFormik({
    initialValues: {
      caratWeight: currentValue,
    },
    validationSchema,
    onSubmit: (values) => {},
    validateOnChange: true,
    validateOnBlur: true,
  });

  const handleInputChange = (e) => {
    const inputValue = e.target.value;

    if (inputValue === "" || /^\d*\.?\d*$/.test(inputValue)) {
      formik.handleChange(e);

      const newValue = parseFloat(inputValue);

      if (!isNaN(newValue) && newValue >= minCarat && newValue <= maxCarat) {
        onChange("caratWeight", newValue);
      }
    }
  };

  const handleKeyDown = (e) => {
    const allowedKeys = [
      "Backspace",
      "Delete",
      "Tab",
      "Enter",
      "Escape",
      "ArrowLeft",
      "ArrowRight",
      ".",
    ];

    if (/^\d$/.test(e.key)) {
      return;
    }

    if (!allowedKeys.includes(e.key)) {
      e.preventDefault();
    }

    if (e.key === "." && e.target.value.includes(".")) {
      e.preventDefault();
    }
  };

  const handleSliderChange = (value) => {
    const newValue = parseFloat(value);
    formik.setFieldValue("caratWeight", newValue);
    onChange("caratWeight", newValue);
  };
  const inputBorderClass =
    formik.touched.caratWeight && formik.errors.caratWeight
      ? "border-red-500"
      : "border-approxgray";
  return (
    <div>
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div>
          <h3 className="font-medium text-base 2xl:text-lg">
            Total Carat Weight:{" "}
            <span className="font-semibold">{currentValue.toFixed(2)} ctw</span>
          </h3>
        </div>
        <div className="relative">
          <input
            type="text"
            id="caratWeight"
            name="caratWeight"
            value={formik.values.caratWeight}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onBlur={formik.handleBlur}
            className={`md:ml-2 w-20 border ${inputBorderClass} px-2 2xl:px-2.5 py-1 2xl:py-1.5 text-sm 2xl:text-base focus:outline-none focus:ring-0 `}
          />
        </div>
      </div>

      <ReactSlider
        className="w-full h-5"
        thumbClassName="h-4 w-4 bg-white border-4 border-primary rounded-full cursor-pointer shadow-sm -mt-1.5"
        trackClassName="h-1 bg-gray-200 rounded-md"
        renderTrack={(props, state) => {
          const { key, ...rest } = props;
          return (
            <div
              key={key}
              {...rest}
              className={`${props.className} ${
                state.index === 0 ? "bg-primary" : ""
              }`}
            />
          );
        }}
        min={minCarat}
        max={maxCarat}
        step={0.03}
        value={formik.values.caratWeight}
        onChange={handleSliderChange}
      />

      <div className="flex justify-between text-sm text-gray-600 mt-1">
        <span>{minCarat.toFixed(2)}</span>
        <span>{maxCarat.toFixed(2)}</span>
      </div>
      <div className="flex justify-end">
        {formik.touched.caratWeight && formik.errors.caratWeight && (
          <div className="absolute text-xs text-red-500 mt-1">
            {formik.errors.caratWeight}
          </div>
        )}
      </div>
    </div>
  );
};

export default CaratWeightSlider;
