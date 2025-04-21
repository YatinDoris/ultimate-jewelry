"use client";
import { fetchCustomizeProducts } from "@/_actions/customize.action";
import { ProductGrid } from "@/components/dynamiComponents";
import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function StartWithSettingPage() {
  const dispatch = useDispatch();
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
      <section className="container pt-10 md:pt-14 lg:pt-20 2xl:pt-20">
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
