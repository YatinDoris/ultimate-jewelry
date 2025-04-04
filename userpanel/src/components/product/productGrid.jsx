"use client";

import React, { memo, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import useQueryParams from "@/hooks/useQueryParams";
import ProductCard from "./productCard";
import { useWindowSize } from "@/_helper/hooks";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentPage } from "@/store/slices/productSlice";
import SkeletonLoader from "../skeletonLoader";
import { VscSettings } from "react-icons/vsc";
import { AiOutlineClose } from "react-icons/ai";
import { FiMinus, FiPlus } from "react-icons/fi";
const ITEMS_PER_PAGE = 20;

const sortByList = [
  { value: "date_new_to_old", title: "NEW TO OLD" },
  { value: "date_old_to_new", title: "OLD TO NEW" },
  { value: "price_high_to_low", title: "HIGH TO LOW" },
  { value: "price_low_to_high", title: "LOW TO HIGH" },
  { value: "alphabetically_a_to_z", title: "A-Z" },
  { value: "alphabetically_z_to_a", title: "Z-A" },
];
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
    const [showSidebar, setShowSidebar] = useState(false);
    const [activeIndex, setActiveIndex] = useState("sortBy");

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
      setActiveIndex("sortBy");
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

    const toggleFAQ = (index) => {
      setActiveIndex(index === activeIndex ? null : index);
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
      setSelectedSortByValue(selectedSortByValue);
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
          <div>
            {/* Filter */}
            <div
              className={`flex  ${
                showSidebar ? "justify-end" : "justify-between"
              }  mb-6`}
            >
              <button
                onClick={() => setShowSidebar(true)}
                className={`${
                  showSidebar ? "hidden" : "block"
                } flex items-center gap-2 px-4 py-2 border shadow-sm bg-primary text-white hover:bg-gray-100 hover:border-primary hover:text-primary font-medium transition-all duration-300`}
              >
                <VscSettings className="text-xl" /> Filter
              </button>
              {filteredItemsList ? (
                <span> {filteredItemsList.length} items</span>
              ) : null}
            </div>
            <div className="flex gap-6 items-start">
              {/* filter */}
              <div
                className={`w-72  bg-transparent ${
                  showSidebar
                    ? "translate-x-0 block"
                    : "-translate-x-full hidden"
                }`}
              >
                {/* Header */}
                <div className="flex justify-between items-center border-b border-[#C8C8C6] pb-4">
                  <h2 className="text-lg font-semibold">All Filter</h2>
                  <button
                    onClick={() => {
                      setShowSidebar(false);
                      setActiveIndex("sortBy");
                    }}
                  >
                    <AiOutlineClose />
                  </button>
                </div>

                {/* Clear Filters Button */}
                <div className="flex justify-end">
                  <button
                    onClick={handleClearFilters}
                    className="text-xs underline hover:underline mt-3 "
                  >
                    Reset Filters
                  </button>
                </div>

                {/* Filters Content */}
                <div>
                  <div className="border-b border-[#C8C8C6] ">
                    <button
                      className={`w-full flex items-center justify-between ${
                        activeIndex === "sortBy" ? "pt-4 pb-2" : "py-4"
                      }`}
                      onClick={() => toggleFAQ("sortBy")}
                    >
                      <p className="font-semibold mb-1">Sort By</p>
                      <span className="text-xl">
                        {activeIndex === "sortBy" ? <FiMinus /> : <FiPlus />}
                      </span>
                    </button>
                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        activeIndex === "sortBy"
                          ? "max-h-screen opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="flex flex-wrap gap-2 pb-4">
                        {sortByList.map((item) => (
                          <button
                            key={item.value}
                            onClick={() => sortBySelectHandler(item.value)}
                            className={`px-3 py-1 border rounded-md text-sm ${
                              selectedSortByValue === item.value
                                ? "bg-primary text-white"
                                : "bg-gray-100 hover:bg-gray-200"
                            }`}
                          >
                            {item.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Variations Filter */}
                  {uniqueVariations?.map((x, index) => (
                    <div
                      key={x?.variationId}
                      className="border-b border-[#C8C8C6] "
                    >
                      <button
                        className={`w-full flex items-center justify-between  ${
                          activeIndex === index ? "pt-4 pb-2" : "py-4"
                        }`}
                        onClick={() => toggleFAQ(index)}
                      >
                        <p className="font-semibold mb-1">{x?.variationName}</p>
                        <span className="text-xl">
                          {activeIndex === index ? <FiMinus /> : <FiPlus />}
                        </span>
                      </button>
                      <div
                        className={`transition-all duration-300 ease-in-out overflow-hidden ${
                          activeIndex === index
                            ? "max-h-screen opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="flex flex-wrap gap-2 pb-4">
                          {x?.variationTypes?.map((y) => {
                            return (
                              <button
                                key={`${x.variationId}-${y.variationTypeName}`}
                                onClick={() =>
                                  onSelectVariant(
                                    x?.variationName,
                                    y?.variationTypeName
                                  )
                                }
                                className={`px-3 py-1 m-1 border rounded-md text-sm flex items-center justify-center ${
                                  selectedVariation[x?.variationName] ===
                                  y?.variationTypeName
                                    ? "bg-primary text-white"
                                    : "bg-gray-100 hover:bg-gray-200"
                                }  ${
                                  selectedVariation[x?.variationName] ===
                                    y?.variationTypeName &&
                                  y.variationTypeHexCode
                                    ? "border-2 border-primary"
                                    : ""
                                }`}
                                style={
                                  y?.variationTypeHexCode
                                    ? {
                                        backgroundColor: y.variationTypeHexCode,
                                        width: "32px",
                                        height: "32px",
                                      }
                                    : {}
                                }
                              >
                                {!y?.variationTypeHexCode &&
                                  y?.variationTypeName}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 ${
                  showSidebar ? "lg:grid-cols-3" : "lg:grid-cols-4"
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
