"use client";
import { fetchCustomizeProducts } from "@/_actions/customize.action";
import { ProductGrid } from "@/components/dynamiComponents";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import StepsGrid from "../StepsGrid";
import ring from "@/assets/images/customize/customize-ring-black.svg";
import diamond from "@/assets/images/customize/customize-diamond-black.svg";
import ringWithDiamondBlack from "@/assets/images/customize/customize-ringWithDiamond-black.svg";
import { helperFunctions } from "@/_helper";
import { setCustomProductDetails } from "@/store/slices/commonSlice";

export default function StartWithSettingPage() {
  // const { customProductDetails } = useSelector(({ common }) => common);
  const dispatch = useDispatch();
  useEffect(() => {
    const customProduct = helperFunctions.getCustomProduct();
    if (customProduct) {
      dispatch(setCustomProductDetails(customProduct));
    }
  }, [dispatch]);

  const currentStep = 1;

  const steps = useMemo(() => {
    return [
      {
        id: 1,
        label: "Choose Setting",
        icon: ring,
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
  }, []);
  const { customizeProductList, customizeProductLoading } = useSelector(
    ({ product }) => product
  );

  const loadData = useCallback(() => {
    dispatch(fetchCustomizeProducts());
    localStorage.removeItem("customProduct");
    dispatch(setCustomProductDetails(null));
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, []);

  return (
    <>
      <section className="container pt-8">
        <StepsGrid steps={steps} currentStep={currentStep} />
      </section>
      <section className=" pt-10 md:pt-14 lg:pt-10 2xl:pt-12">
        <ProductGrid
          productList={customizeProductList}
          pagination={true}
          isDiamondSettingPage={true}
          isLoading={customizeProductLoading}
        />
      </section>
    </>
  );
}
