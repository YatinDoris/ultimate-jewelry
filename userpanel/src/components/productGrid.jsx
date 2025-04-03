"use client";

import React, { memo, useState } from "react";
import useQueryParams from "@/hooks/useQueryParams";
import ProductCard from "./productCard";
import SkeletonLoader from "./skeletonLoader";
import { useWindowSize } from "@/_helper/hooks";
import ReactPaginate from "react-paginate";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

const ProductGrid = memo(
  ({
    productList,
    isLoading,
    noDataFoundMsg,
    isDiamondSettingPage,
    className,
  }) => {
    const queryParams = useQueryParams();
    const { columnCount } = useWindowSize();
    const [currentPage, setCurrentPage] = useState(0);

    const getProductLink = ({ queryParams, isDiamondSettingPage, product }) => {
      if (!isDiamondSettingPage) return null;
      const { dId, format } = queryParams || {};
      const basePath = `/engagement-rings/product-detail/${product?.id}`;
      const queryString = dId
        ? `?dId=${dId}&format=${format}`
        : `?format=${format}`;
      return `${basePath}${queryString}`;
    };

    const handlePageClick = ({ selected }) => {
      setCurrentPage(selected);
    };
    const itemsPerPage = 12;
    const offset = currentPage * itemsPerPage;
    const currentProducts = productList.slice(offset, offset + itemsPerPage);
    return (
      <>
        {isLoading ? (
          <div
            className={` grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 6xl:grid-cols-6 gap-4 ${className}`}
          >
            {Array.from({ length: columnCount }).map((_, index) => (
              <div key={index} className="border-0">
                <SkeletonLoader height="w-full h-[200px] md:h-[300px]  2xl:h-[400px]" />
                <SkeletonLoader width="w-[90%]" height="h-4" className="mt-4" />
                <SkeletonLoader width="w-[40%]" height="h-4" className="mt-2" />
                <SkeletonLoader width="w-full" height="h-8" className="mt-2" />
              </div>
            ))}
          </div>
        ) : (
          <div className=" grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 6xl:grid-cols-6 gap-4 place-items-center">
            {currentProducts?.map((product) => (
              <ProductCard
                key={`product-key-${product?.productName}`}
                title={product?.productName}
                discount={product?.discount}
                basePrice={product?.basePrice}
                img={product?.images?.[0]?.image}
                video={product?.video}
                price={product?.baseSellingPrice}
                goldColorVariations={product?.goldColorVariations}
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
          <div className="text-center h-[50vh] flex justify-center items-center">
            {noDataFoundMsg}
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center mt-20">
          <ReactPaginate
            previousLabel={<FaAngleLeft className="text-xl" />}
            nextLabel={<FaAngleRight className="text-xl" />}
            breakLabel="..."
            pageCount={Math.ceil(productList.length / itemsPerPage)}
            marginPagesDisplayed={1}
            pageRangeDisplayed={2}
            onPageChange={handlePageClick}
            containerClassName="flex items-center space-x-2"
            activeClassName="bg-primary text-white px-4 py-2 rounded-md"
            pageClassName="px-3 py-1 cursor-pointer"
            breakClassName="px-3"
            previousClassName="px-3 text-gray-400"
            nextClassName="px-3"
            disabledClassName="opacity-50 cursor-not-allowed"
          />
        </div>
      </>
    );
  }
);

export default ProductGrid;
