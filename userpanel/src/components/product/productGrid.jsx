"use client";

import React, { memo, useState } from "react";
import ReactPaginate from "react-paginate";
import useQueryParams from "@/hooks/useQueryParams";
import ProductCard from "./productCard";
import { useWindowSize } from "@/_helper/hooks";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage } from "@/store/slices/productSlice";
import SkeletonLoader from "../skeletonLoader";
import FilterMenu from "./filterMenu";

const ITEMS_PER_PAGE = 20;

const ProductGrid = memo(
  ({
    productList = [],
    isLoading,
    pagination = false,
    noDataFoundMsg,
    isDiamondSettingPage,
    className,
  }) => {
    const queryParams = useQueryParams();
    const dispatch = useDispatch();
    const { columnCount } = useWindowSize();
    const { currentPage } = useSelector(({ product }) => product);
    const [selectedSortByValue, setSelectedSortByValue] =
      useState("date_new_to_old");
    const [selectedVariation, setSelectedVariation] = useState({});

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

    const handleClearFilters = () => {
      setSelectedSortByValue("date_new_to_old");
      setSelectedVariation({});
    };
    const sortBySelectHandler = (eventKey) => {
      setSelectedSortByValue(eventKey);
    };
    const onSelectVariant = (variationName, variationTypeName) => {
      const updatedFilters = {
        ...selectedVariation,
        [variationName]: variationTypeName,
      };
      setSelectedVariation(updatedFilters);
    };

    let filteredItemsList = productList;
    if (Object.keys(selectedVariation)?.length) {
      filteredItemsList = productList.filter((product) => {
        return product.variations.some((variation) => {
          const selectedType = selectedVariation[variation.variationName];
          if (!selectedType) return false;
          return variation.variationTypes.some(
            (type) => type.variationTypeName === selectedType
          );
        });
      });
    }
    [...filteredItemsList].sort((a, b) => {
      if (selectedSortByValue === "alphabetically_a_to_z") {
        return a.productName.localeCompare(b.productName);
      } else if (selectedSortByValue === "alphabetically_z_to_a") {
        return b.productName.localeCompare(a.productName);
      } else if (selectedSortByValue === "price_low_to_high") {
        return parseFloat(a.baseSellingPrice) - parseFloat(b.baseSellingPrice);
      } else if (selectedSortByValue === "price_high_to_low") {
        return parseFloat(b.baseSellingPrice) - parseFloat(a.baseSellingPrice);
      } else if (selectedSortByValue === "date_old_to_new") {
        return a.createdDate - b.createdDate;
      } else if (selectedSortByValue === "date_new_to_old") {
        return b.createdDate - a.createdDate;
      }
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
          <div>
            <FilterMenu
              filterMenuList={uniqueVariations}
              selectedSortByValue={selectedSortByValue}
              sortBySelectHandler={sortBySelectHandler}
              onSelectVariant={onSelectVariant}
              selectedVariation={selectedVariation}
              handleClearFilters={handleClearFilters}
            />
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 6xl:grid-cols-6 gap-x-4 gap-y-6 place-items-center">
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
        )}

        {!isLoading && !productList?.length && (
          <div className="text-center h-[50vh] flex justify-center items-center">
            {noDataFoundMsg}
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
              pageClassName={"px-4 py-2 rounded-md "}
              activeClassName={"bg-primary text-white  rounded px-4 py-2"}
              previousClassName={"px-3 py-1 rounded-md "}
              nextClassName={"px-3 py-1 rounded-md "}
              disabledClassName={"opacity-50 cursor-not-allowed"}
            />
          </div>
        )}
      </>
    );
  }
);

export default ProductGrid;
