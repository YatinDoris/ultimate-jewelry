"use client";

import { fetchSingleProductDataById } from "@/_actions/product.actions";
import { helperFunctions } from "@/_helper";
import { ALLOWED_DIA_CLARITIES, ALLOWED_DIA_COLORS } from "@/_helper/constants";
import {
  CaratWeightSlider,
  ProgressiveImg,
} from "@/components/dynamiComponents";
import React, { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PrimaryLinkButton } from "../../button";
import { setDiamondSelection } from "@/store/slices/selectDiamondSlice";
import { useRouter } from "next/navigation";
import { setCustomProductDetails } from "@/store/slices/commonSlice";
import ring from "@/assets/images/customize/customize-ring-black.svg";
import diamond from "@/assets/images/customize/customize-diamond-black.svg";
import ringWithDiamondBlack from "@/assets/images/customize/customize-ringWithDiamond-black.svg";
import StepsGrid from "../StepsGrid";
import diamondNotFound from "@/assets/images/diamond-not-found.webp";
import CommonNotFound from "../../CommonNotFound";
export default function SelectDiamondPage() {
  const router = useRouter();
  const { productDetail } = useSelector(({ product }) => product);
  const { customProductDetails } = useSelector(({ common }) => common);

  const { diamondSelection } = useSelector(
    ({ selectedDiamond }) => selectedDiamond
  );

  const dispatch = useDispatch();

  const caratWeightRange = productDetail?.diamondFilters?.caratWeightRange;
  const minCarat = caratWeightRange?.min || 0;
  const maxCarat = caratWeightRange?.max || 0;

  const pId = customProductDetails?.productId;
  const isDiamondSelected = customProductDetails?.diamondDetails;
  const currentStep = 2;
  const steps = useMemo(() => {
    if (pId && isDiamondSelected) {
      return [
        {
          id: 1,
          label: "Choose Setting",
          icon: ring,
          subOption: [
            {
              label: "View",
              route: `/customize/start-with-setting/${pId}`,
            },
            {
              label: "Change",
              route: "/customize/start-with-setting",
            },
          ],
        },
        {
          id: 2,
          label: "Choose Diamond",
          icon: diamond,
        },

        {
          id: 3,
          label: "Complete Ring",
          icon: ringWithDiamondBlack,
          iconBlack: ringWithDiamondBlack,
          disabled: false,
          subOption: [
            {
              label: "View",
              route: `/customize/complete-ring`,
            },
          ],
        },
      ];
    } else if (pId) {
      return [
        {
          id: 1,
          label: "Choose Setting",
          icon: ring,
          subOption: [
            {
              label: "View",
              route: `/customize/start-with-setting/${pId}`,
            },
            {
              label: "Change",
              route: "/customize/start-with-setting",
            },
          ],
        },
        {
          id: 2,
          label: "Choose Diamond",
          icon: diamond,
        },

        {
          id: 3,
          label: "Complete Ring",
          icon: ringWithDiamondBlack,
          iconBlack: ringWithDiamondBlack,
          disabled: true,
        },
      ];
    }
  }, [customProductDetails]);

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
        },
      };

      localStorage.setItem(
        "customProduct",
        JSON.stringify(updatedCustomProduct)
      );

      console.log("Before router push");

      router.push("/customize/complete-ring");

      console.log("After router push");
    } catch (error) {
      console.error("Error saving diamond selection:", error);
    }
  };

  const calculatePrice = () => {
    try {
      if (
        !diamondSelection.caratWeight ||
        !diamondSelection.clarity?.value ||
        !diamondSelection.color?.value
      ) {
        return 0;
      }

      return helperFunctions?.calculateDiamondPrice({
        caratWeight: diamondSelection.caratWeight,
        clarity: diamondSelection.clarity.value,
        color: diamondSelection.color.value,
      });
    } catch (error) {
      console.error("Error calculating diamond price:", error);
      return 0;
    }
  };

  useEffect(() => {
    if (productDetail) {
      const customProduct = helperFunctions.getCustomProduct();
      const storedDiamondDetails = customProduct?.diamondDetails;

      let needsUpdate = false;
      const updatedSelections = {};

      if (storedDiamondDetails) {
        if (
          !diamondSelection.shape ||
          diamondSelection.shape.id !== storedDiamondDetails.shape.id
        ) {
          updatedSelections.shape = storedDiamondDetails.shape;
          needsUpdate = true;
        }

        if (
          !diamondSelection.clarity ||
          diamondSelection.clarity.value !== storedDiamondDetails.clarity.value
        ) {
          updatedSelections.clarity = storedDiamondDetails.clarity;
          needsUpdate = true;
        }

        if (
          !diamondSelection.color ||
          diamondSelection.color.value !== storedDiamondDetails.color.value
        ) {
          updatedSelections.color = storedDiamondDetails.color;
          needsUpdate = true;
        }

        if (diamondSelection.caratWeight !== storedDiamondDetails.caratWeight) {
          updatedSelections.caratWeight = storedDiamondDetails.caratWeight;
          needsUpdate = true;
        }
      } else {
        if (
          !diamondSelection.shape &&
          productDetail.diamondFilters?.diamondShapes?.length > 0
        ) {
          updatedSelections.shape =
            productDetail.diamondFilters.diamondShapes[0];
          needsUpdate = true;
        }

        if (!diamondSelection.clarity && ALLOWED_DIA_CLARITIES.length > 0) {
          updatedSelections.clarity = ALLOWED_DIA_CLARITIES[0];
          needsUpdate = true;
        }

        if (!diamondSelection.color && ALLOWED_DIA_COLORS.length > 0) {
          updatedSelections.color = ALLOWED_DIA_COLORS[0];
          needsUpdate = true;
        }

        if (diamondSelection.caratWeight === null && minCarat !== maxCarat) {
          updatedSelections.caratWeight = minCarat;
          needsUpdate = true;
        }
      }

      if (needsUpdate) {
        dispatch(setDiamondSelection(updatedSelections));
      }
    }
  }, [productDetail, dispatch, minCarat, maxCarat]);

  useEffect(() => {
    const customProduct = helperFunctions.getCustomProduct();
    if (customProduct?.productId) {
      dispatch(setCustomProductDetails(customProduct));
      loadData(customProduct.productId);
    }
  }, []);

  return (
    <section className="container">
      <div className="py-8">
        <StepsGrid steps={steps} currentStep={currentStep} />
      </div>
      {!productDetail &&
      !productDetail.isDiamondFilter &&
      !productDetail?.diamondFilters ? (
        <CommonNotFound
          message="No Diamonds Found"
          notFoundImg={diamondNotFound}
          subMessage="Please adjust your filters or try again later."
        />
      ) : (
        <div>
          <div className="flex flex-col lg:flex-row gap-4 2xl:gap-5 w-full">
            <div className="bg-white p-6 w-full lg:w-[30%] 2xl:w-[20%]">
              <h3 className="font-medium font-base 2xl:text-lg">
                Selected Diamond Shape:{" "}
                {diamondSelection.shape && (
                  <span className="font-semibold uppercase">
                    {diamondSelection.shape.title}
                  </span>
                )}
              </h3>
              <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-4 2xl:grid-cols-3 gap-6 mt-4">
                {productDetail?.diamondFilters?.diamondShapes?.map(
                  (item, index) => (
                    <div
                      className="text-center flex flex-col items-center gap-1"
                      key={`diamond-shape-${index}`}
                    >
                      <div
                        className={`flex justify-center items-center border-[1.5px] h-14 w-14 2xl:h-16 2xl:w-16 rounded-full cursor-pointer hover:border-primary transition-all duration-300 ${
                          diamondSelection.shape?.id === item.id
                            ? "border-primary bg-opacity-10"
                            : "border-approxgray"
                        }`}
                        onClick={() => updateDiamondSelection("shape", item)}
                      >
                        <ProgressiveImg
                          src={item?.image}
                          alt={item?.name}
                          className="w-9 h-9 2xl:w-10 2xl:h-10"
                        />
                      </div>
                      <span
                        className={`text-xs 2xl:text-sm uppercase ${
                          diamondSelection.shape?.id === item.id
                            ? "text-primary"
                            : ""
                        }`}
                      >
                        {item?.title}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="bg-white p-6 w-full lg:w-[35%] 2xl:w-[40%]">
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

            <div className="w-full lg:w-[35%] 2xl:w-[40%] flex flex-col gap-4 2xl:gap-5">
              <div className="p-6 bg-white">
                <CaratWeightSlider
                  minCarat={minCarat}
                  maxCarat={maxCarat}
                  value={diamondSelection.caratWeight}
                  onChange={updateDiamondSelection}
                />
              </div>

              <div className="p-6 bg-white">
                <h3 className="font-medium text-base 2xl:text-lg mb-4">
                  Diamond Clarity
                </h3>
                <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-6 2xl:grid-cols-8 gap-2 2xl:gap-3 mt-2">
                  {ALLOWED_DIA_CLARITIES.map((item, index) => (
                    <div
                      key={`diamond-clarity-${index}`}
                      title={item?.title}
                      className={`border flex justify-center items-center py-1 2xl:py-1.5 cursor-pointer transition-all duration-100 ${
                        diamondSelection.clarity?.value === item.value
                          ? "bg-primary text-white border-primary"
                          : "border-approxgray hover:text-white hover:bg-primary hover:border-primary"
                      }`}
                      onClick={() => updateDiamondSelection("clarity", item)}
                    >
                      <p className="text-sm 2xl:text-base">{item?.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 bg-white">
                <h3 className="font-medium text-base 2xl:text-lg mb-4">
                  Diamond Color
                </h3>
                <div className="grid grid-cols-5 md:grid-cols-8 lg:grid-cols-6 2xl:grid-cols-8  gap-2 2xl:gap-3 mt-2">
                  {ALLOWED_DIA_COLORS.map((item, index) => (
                    <div
                      key={`diamond-color-${index}`}
                      title={item?.title}
                      className={`border flex justify-center items-center py-1 2xl:py-1.5 cursor-pointer transition-all duration-100 ${
                        diamondSelection.color?.value === item.value
                          ? "bg-primary text-white border-primary"
                          : "border-approxgray hover:text-white hover:bg-primary hover:border-primary"
                      }`}
                      onClick={() => updateDiamondSelection("color", item)}
                    >
                      <p className="text-sm 2xl:text-base">{item?.value}</p>
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
            <PrimaryLinkButton
              onClick={(e) => {
                e.preventDefault();
                handleContinueClick();
              }}
            >
              CONTINUE
            </PrimaryLinkButton>
          </div>
        </div>
      )}
    </section>
  );
}
