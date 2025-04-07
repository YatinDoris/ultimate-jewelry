"use client";
import React, { memo, useEffect } from "react";
import ReactPaginate from "react-paginate";
import useQueryParams from "@/hooks/useQueryParams";
import noDataImg from "@/assets/images/no-data.webp";
import ProductCard from "./productCard";
import { useWindowSize } from "@/_helper/hooks";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import {
  setCurrentPage,
  setShowFilterSidebar,
  setSortByValue,
} from "@/store/slices/productSlice";
import SkeletonLoader from "../skeletonLoader";
import { VscSettings } from "react-icons/vsc";
import { ProductFilterSidebar } from "../dynamiComponents";
import CustomImg from "../custom-img";
import { LinkButton } from "../button";

const ITEMS_PER_PAGE = 20;

const ProductGrid = memo(
  ({
    productList = [],
    isLoading,
    pagination = false,
    isDiamondSettingPage,
    className,
  }) => {
    const queryParams = useQueryParams();
    const dispatch = useDispatch();
    const { columnCount } = useWindowSize();
    const {
      currentPage,
      selectedSortByValue,
      showFilterSidebar,
      selectedVariations,
    } = useSelector(({ product }) => product);

    const handlePageClick = ({ selected }) => {
      dispatch(setCurrentPage(selected));
    };

    let uniqueVariations = [];

    productList.forEach((product) => {
      product.variations.forEach((variation) => {
        let existingVariationIndex = uniqueVariations.findIndex(
          (item) => item.variationId === variation.variationId
        );

        if (existingVariationIndex === -1) {
          let newVariation = {
            variationName: variation.variationName,
            variationId: variation.variationId,
            variationTypes: variation.variationTypes.map((variationType) => ({
              variationTypeName: variationType.variationTypeName,
              variationTypeId: variationType.variationTypeId,
              variationTypeHexCode: variationType.variationTypeHexCode
                ? variationType.variationTypeHexCode
                : undefined,
            })),
          };

          uniqueVariations.push(newVariation);
        } else {
          variation.variationTypes.forEach((variationType) => {
            let existingTypeIndex = uniqueVariations[
              existingVariationIndex
            ].variationTypes.findIndex(
              (item) => item.variationTypeId === variationType.variationTypeId
            );
            if (existingTypeIndex === -1) {
              uniqueVariations[existingVariationIndex].variationTypes.push({
                variationTypeName: variationType.variationTypeName,
                variationTypeId: variationType.variationTypeId,
                variationTypeHexCode: variationType.variationTypeHexCode
                  ? variationType.variationTypeHexCode
                  : undefined,
              });
            }
          });
        }
      });
    });

    let filteredItemsList = productList;
    if (Object.keys(selectedVariations)?.length) {
      filteredItemsList = productList.filter((product) => {
        return product.variations.some((variation) => {
          const selectedType = selectedVariations[variation.variationName];
          if (!selectedType) return false;
          return variation.variationTypes.some(
            (type) => type.variationTypeName === selectedType
          );
        });
      });
    }
    filteredItemsList = [...filteredItemsList].sort((a, b) => {
      if (selectedSortByValue === "alphabetically_a_to_z") {
        return a.productName.localeCompare(b.productName);
      }
      if (selectedSortByValue === "alphabetically_z_to_a") {
        return b.productName.localeCompare(a.productName);
      }
      if (selectedSortByValue === "price_low_to_high") {
        return parseFloat(a.baseSellingPrice) - parseFloat(b.baseSellingPrice);
      }
      if (selectedSortByValue === "price_high_to_low") {
        return parseFloat(b.baseSellingPrice) - parseFloat(a.baseSellingPrice);
      }
      if (selectedSortByValue === "date_old_to_new") {
        return new Date(a.createdDate) - new Date(b.createdDate);
      }
      if (selectedSortByValue === "date_new_to_old") {
        return new Date(b.createdDate) - new Date(a.createdDate);
      }
      return 0;
    });

    const pageCount = Math.ceil(filteredItemsList.length / ITEMS_PER_PAGE);
    const currentProducts = filteredItemsList.slice(
      currentPage * ITEMS_PER_PAGE,
      (currentPage + 1) * ITEMS_PER_PAGE
    );

    const getProductLink = ({ queryParams, isDiamondSettingPage, product }) => {
      if (!isDiamondSettingPage) return null;
      const { dId, format } = queryParams || {};
      const basePath = `/engagement-rings/product-detail/${product?.id}`;
      const queryString = dId
        ? `?dId=${dId}&format=${format}`
        : `?format=${format}`;
      return `${basePath}${queryString}`;
    };

    useEffect(() => {
      dispatch(setSortByValue(selectedSortByValue));
    }, [selectedSortByValue]);

    return (
      <>
        {isLoading ? (
          <div
            className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 6xl:grid-cols-6 gap-4 ${className}`}
          >
            {Array.from({ length: columnCount }).map((_, index) => (
              <div key={index} className="border-0">
                <SkeletonLoader height="w-full h-[200px] md:h-[300px] 2xl:h-[400px]" />
                <SkeletonLoader width="w-[90%]" height="h-4" className="mt-4" />
                <SkeletonLoader width="w-[40%]" height="h-4" className="mt-2" />
                <SkeletonLoader width="w-full" height="h-8" className="mt-2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="relative">
            {filteredItemsList.length ? (
              <div
                className={`flex ${
                  showFilterSidebar ? "justify-end" : "justify-between"
                } mb-6 items-center`}
              >
                <button
                  onClick={() => dispatch(setShowFilterSidebar(true))}
                  className={`${
                    showFilterSidebar ? "hidden" : "block"
                  } flex items-center gap-2 px-4 py-2 border shadow-sm bg-primary text-white hover:bg-gray-100 hover:border-primary hover:text-primary font-medium transition-all duration-300`}
                >
                  <VscSettings className="text-xl" /> Filter
                </button>
                {filteredItemsList ? (
                  <span>{filteredItemsList.length} items</span>
                ) : null}
              </div>
            ) : null}

            <div className="flex gap-6 items-start">
              <ProductFilterSidebar uniqueVariations={uniqueVariations} />
              {/* Product Grid */}
              <div
                className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 ${
                  showFilterSidebar ? "lg:grid-cols-3" : "lg:grid-cols-4"
                } 6xl:grid-cols-6 gap-x-4 gap-y-6 place-items-center`}
              >
                {currentProducts.map((product) => (
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
            </div>
          </div>
        )}

        {!isLoading && !productList?.length && (
          <div className="h-[60vh] lg:h-[70vh] gap-8 lg:gap-10 flex flex-col justify-center items-center text-center">
            <CustomImg
              srcAttr={noDataImg}
              className="w-44 md:w-52 lg:w-56 2xl:w-auto"
              altAttr=""
              titleAttr=""
            />
            <div>
              {" "}
              <h3 className="text-2xl md:text-3xl 2xl:text-4xl font-castoro">
                Sorry, No product Found
              </h3>
              <p className="text-base mt-2 font-semibold">
                You can Try Our Different Product...
              </p>
              <div className="flex justify-center mt-4 ">
                <LinkButton
                  href="#"
                  className="!bg-primary w-[70%] xxs:h-11 md:h-12 lg:!h-[2.8rem] !rounded-none !text-sm font-semibold !tracking-wider hover:border-primary hover:!bg-transparent hover:!text-primary"
                >
                  BACK TO SHOP
                </LinkButton>
              </div>
            </div>
          </div>
        )}

        {pagination && !isLoading && productList.length > ITEMS_PER_PAGE && (
          <div className="mt-20 flex justify-center">
            <ReactPaginate
              previousLabel={<FaAngleLeft className="text-xl text-primary" />}
              nextLabel={<FaAngleRight className="text-xl text-primary" />}
              breakLabel={<span className="text-xl">...</span>}
              breakClassName={"text-primary"}
              pageCount={pageCount}
              marginPagesDisplayed={1}
              pageRangeDisplayed={2}
              onPageChange={handlePageClick}
              containerClassName={"flex items-center gap-2"}
              pageClassName={"px-4 py-2 rounded-md"}
              activeClassName={"bg-primary text-white rounded px-4 py-2"}
              previousClassName={"px-3 py-1 rounded-md"}
              nextClassName={"px-3 py-1 rounded-md"}
              disabledClassName={"opacity-50 cursor-not-allowed"}
            />
          </div>
        )}
      </>
    );
  }
);

export default ProductGrid;
