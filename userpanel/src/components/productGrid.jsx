"use client";

import React, { memo } from "react";
import useQueryParams from "@/hooks/useQueryParams";
import { useWindowSize } from "@/_helper/hooks";
import ProductCard from "./productCard";
import SkeletonLoader from "./skeletonLoader";

const ProductGrid = memo(
  ({ productList, isLoading, noDataFoundMsg, isDiamondSettingPage }) => {
    const queryParams = useQueryParams();
    const { columnCount } = useWindowSize();

    const getProductLink = ({ queryParams, isDiamondSettingPage, product }) => {
      if (!isDiamondSettingPage) return null;
      const { dId, format } = queryParams || {};
      const basePath = `/engagement-rings/product-detail/${product?.id}`;
      const queryString = dId
        ? `?dId=${dId}&format=${format}`
        : `?format=${format}`;
      return `${basePath}${queryString}`;
    };

    return (
      <>
        {isLoading ? (
          <div className="mx-5 md:mx-8 lg:mx-10 2xl:mx-14 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: columnCount }).map((_, index) => (
              <div key={index} className="border-0">
                {/* Skeleton Loader using Tailwind CSS */}
                <SkeletonLoader height="h-[200px] sm:h-[400px] md:h-[300px]" />
                <SkeletonLoader width="w-[90%]" height="h-4" className="mt-4" />
                <SkeletonLoader width="w-[40%]" height="h-4" className="mt-2" />
                <SkeletonLoader width="w-full" height="h-8" className="mt-2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="mx-5 md:mx-8 lg:mx-10 2xl:mx-14 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {productList?.map((product) => (
              <ProductCard
                key={`product-key-${product?.productName}`}
                title={product?.productName}
                discount={product?.discount}
                basePrice={product?.basePrice}
                img={product?.images?.[0]?.image}
                price={product?.baseSellingPrice}
                goldColorVariations={product?.goldColorVariations}
                goldTypeVariations={product?.goldTypeVariations}
                productLink={getProductLink({
                  queryParams,
                  isDiamondSettingPage,
                  product,
                })}
              />
            ))}
          </div>
        )}
        {!isLoading && !productList?.length && (
          <div className="text-center px-4 mb-4">{noDataFoundMsg}</div>
        )}
      </>
    );
  }
);

export default ProductGrid;
