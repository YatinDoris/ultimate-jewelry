"use client";

import { fetchSingleProductDataById } from "@/_actions/product.actions";
import { helperFunctions } from "@/_helper";
import { ALLOWED_DIA_CLARITIES, ALLOWED_DIA_COLORS } from "@/_helper/constants";
import { ProgressiveImg } from "@/components/dynamiComponents";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PrimaryLinkButton } from "../../button";
import { setDiamondSelection } from "@/store/slices/selectDiamondSlice";
import { useRouter } from "next/navigation";

export default function SelectDiamondPage() {
  const router = useRouter();
  const { productDetail } = useSelector(({ product }) => product);
  const { diamondSelection } = useSelector(
    ({ selectedDiamond }) => selectedDiamond
  );

  const dispatch = useDispatch();

  const caratWeightRange = productDetail?.diamondFilters?.caratWeightRange;
  const minCarat = caratWeightRange?.min || 0;
  const maxCarat = caratWeightRange?.max || 0;

  useEffect(() => {
    const customProduct = helperFunctions.getCustomProduct();
    if (customProduct?.productId) {
      loadData(customProduct.productId);
    }
  }, []);

  useEffect(() => {
    if (productDetail) {
      const defaultSelections = {};

      if (
        !diamondSelection.shape &&
        productDetail.diamondFilters?.diamondShapes?.length > 0
      ) {
        defaultSelections.shape = productDetail.diamondFilters.diamondShapes[0];
      }

      if (!diamondSelection.clarity && ALLOWED_DIA_CLARITIES.length > 0) {
        defaultSelections.clarity = ALLOWED_DIA_CLARITIES[0];
      }

      if (!diamondSelection.color && ALLOWED_DIA_COLORS.length > 0) {
        defaultSelections.color = ALLOWED_DIA_COLORS[0];
      }

      if (diamondSelection.caratWeight === null && minCarat !== maxCarat) {
        defaultSelections.caratWeight = (minCarat + maxCarat) / 2;
      }

      if (Object.keys(defaultSelections).length > 0) {
        dispatch(setDiamondSelection(defaultSelections));
      }
    }
  }, [productDetail, dispatch, diamondSelection, minCarat, maxCarat]);

  const loadData = useCallback(
    async (productId) => {
      if (productId) {
        await dispatch(fetchSingleProductDataById(productId));
      }
    },
    [dispatch]
  );

  const updateDiamondSelection = (key, value) => {
    dispatch(setDiamondSelection({ [key]: value }));
  };

  const handleContinueClick = () => {
    try {
      const customProduct = helperFunctions.getCustomProduct() || {};

      const updatedCustomProduct = {
        ...customProduct,
        diamondDetails: {
          shape: diamondSelection.shape,
          clarity: diamondSelection.clarity,
          color: diamondSelection.color,
          caratWeight: diamondSelection.caratWeight,
          price: calculatePrice(),
        },
      };

      localStorage.setItem(
        "customProduct",
        JSON.stringify(updatedCustomProduct)
      );

      console.log(
        "Diamond selection saved successfully!",
        updatedCustomProduct
      );

      router.push("/customize/complete-ring");
    } catch (error) {
      console.error("Error saving diamond selection:", error);
    }
  };

  const calculatePrice = () => {
    return 1995.0;
  };

  return (
    <section className="container">
      <div className="flex flex-col lg:flex-row gap-4 w-full pt-8">
        <div className="bg-white p-6 w-full lg:w-[30%]">
          <h3 className="font-medium">
            Select Diamond Shape:{" "}
            {diamondSelection.shape && (
              <span className="font-semibold uppercase">
                {diamondSelection.shape.title}
              </span>
            )}
          </h3>
          <div className="grid grid-cols-3 gap-6 mt-4">
            {productDetail?.diamondFilters?.diamondShapes?.map(
              (item, index) => (
                <div
                  className="text-center flex flex-col items-center gap-1"
                  key={`diamond-shape-${index}`}
                >
                  <div
                    className={`flex justify-center items-center border-[2px] h-14 w-14 rounded-full cursor-pointer hover:border-primary transition-all duration-300 ${
                      diamondSelection.shape?.id === item.id
                        ? "border-primary bg-opacity-10"
                        : "border-approxgray"
                    }`}
                    onClick={() => updateDiamondSelection("shape", item)}
                  >
                    <ProgressiveImg
                      src={item?.image}
                      alt={item?.name}
                      className="w-9 h-9"
                    />
                  </div>
                  <span className="text-sm uppercase">{item?.title}</span>
                </div>
              )
            )}
          </div>
        </div>

        <div className="bg-white p-6 w-full lg:w-[35%]">
          <div className="flex justify-center items-center h-full">
            {diamondSelection.shape && (
              <div className="text-center">
                <ProgressiveImg
                  src={diamondSelection.shape?.image}
                  alt={diamondSelection.shape?.title}
                  // className="w-32 h-32 mx-auto"
                />
              </div>
            )}
          </div>
        </div>

        <div className="w-full lg:w-[35%] flex flex-col gap-4">
          <div className="p-6 bg-white">
            <h3 className="font-medium text-base mb-4">Total Carat Weight</h3>

            <input
              type="range"
              min={minCarat}
              max={maxCarat}
              step={0.01}
              value={diamondSelection.caratWeight ?? minCarat}
              onChange={(e) =>
                updateDiamondSelection(
                  "caratWeight",
                  parseFloat(e.target.value)
                )
              }
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-sm text-gray-600 mt-1">
              <span>{minCarat}</span>
              <span className="font-medium">
                {diamondSelection.caratWeight
                  ? diamondSelection.caratWeight.toFixed(2)
                  : minCarat.toFixed(2)}
              </span>
              <span>{maxCarat}</span>
            </div>
          </div>

          <div className="p-6 bg-white">
            <h3 className="font-medium text-base mb-4">Diamond Clarity</h3>
            <div className="grid grid-cols-6 gap-2 mt-2">
              {ALLOWED_DIA_CLARITIES.map((item, index) => (
                <div
                  key={`diamond-clarity-${index}`}
                  title={item?.title}
                  className={`border flex justify-center items-center py-1 cursor-pointer transition-all duration-100 ${
                    diamondSelection.clarity?.value === item.value
                      ? "bg-primary text-white border-primary"
                      : "border-approxgray hover:text-white hover:bg-primary hover:border-primary"
                  }`}
                  onClick={() => updateDiamondSelection("clarity", item)}
                >
                  <p className="text-sm">{item?.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white">
            <h3 className="font-medium text-base mb-4">Diamond Color</h3>
            <div className="grid grid-cols-6 gap-2 mt-2">
              {ALLOWED_DIA_COLORS.map((item, index) => (
                <div
                  key={`diamond-color-${index}`}
                  title={item?.title}
                  className={`border flex justify-center items-center py-1 cursor-pointer transition-all duration-100 ${
                    diamondSelection.color?.value === item.value
                      ? "bg-primary text-white border-primary"
                      : "border-approxgray hover:text-white hover:bg-primary hover:border-primary"
                  }`}
                  onClick={() => updateDiamondSelection("color", item)}
                >
                  <p className="text-sm">{item?.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-between my-5 gap-5 lg:gap-0">
        <div className="flex gap-4">
          <p className="font-medium py-1 px-2 border border-approxgray ">
            Certified: IGI
          </p>
          <p className="font-medium py-1 px-2 border border-approxgray ">
            Diamond: LABGROWN
          </p>
        </div>

        <h3 className="font-semibold text-lg">
          Final Price: ${calculatePrice().toFixed(2)}
        </h3>
      </div>

      <div className="flex justify-center pt-5">
        <PrimaryLinkButton onClick={handleContinueClick}>
          CONTINUE
        </PrimaryLinkButton>
      </div>
    </section>
  );
}
