"use client";
import { fetchCustomizeProducts } from "@/_actions/customize.action";
import { ProductDetailPage, ProductGrid } from "@/components/dynamiComponents";
import { useCallback, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import StepsGrid from "../StepsGrid";
import ring from "@/assets/images/customize/customize-ring-black.svg";
import diamond from "@/assets/images/customize/customize-diamond-black.svg";
import ringWithDiamondBlack from "@/assets/images/customize/customize-ringWithDiamond-black.svg";
import { setCustomProductDetails } from "@/store/slices/commonSlice";
import { helperFunctions } from "@/_helper";
export default function SelectDiamondPage() {
  const { customProductDetails } = useSelector(({ common }) => common);
  const dispatch = useDispatch();
  useEffect(() => {
    const customProduct = helperFunctions.getCustomProduct();
    if (customProduct) {
      dispatch(setCustomProductDetails(customProduct));
    }
  }, [dispatch]);
  const pId = customProductDetails?.productId;
  const isDiamondSelected = customProductDetails?.diamondDetails;
  const currentStep = 3;

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
          subOption: [
            {
              label: "Change",
              route: `/customize/select-diamond`,
            },
          ],
        },

        {
          id: 3,
          label: "Complete Ring",
          icon: ringWithDiamondBlack,
          iconBlack: ringWithDiamondBlack,
          disabled: false,
        },
      ];
    } else {
    }
  }, [pId, isDiamondSelected]);
  const { customizeProductList, customizeProductLoading } = useSelector(
    ({ product }) => product
  );

  const loadData = useCallback(async () => {
    await dispatch(fetchCustomizeProducts());
  }, [dispatch]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <>
      <section className="container pt-8">
        <StepsGrid steps={steps} currentStep={currentStep} />
      </section>
      <section className="pt-10 md:pt-14 lg:pt-10 2xl:pt-12">
        <ProductDetailPage customizePage="completeRing" />
      </section>
    </>
  );
}
