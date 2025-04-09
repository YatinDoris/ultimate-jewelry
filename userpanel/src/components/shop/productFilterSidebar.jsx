import {
  defaultOpenKeys,
  resetFilters,
  setOpenKeys,
  setSelectedSettingStyle,
  setSelectedVariations,
  setShowFilterSidebar,
  setSortByValue,
  toggleOpenKey,
} from "@/store/slices/productSlice";
import { useDispatch, useSelector } from "react-redux";
import { AiOutlineClose } from "react-icons/ai";
import { FiMinus, FiPlus } from "react-icons/fi";
import { useEffect } from "react";
import { useWindowSize } from "@/_helper/hooks";
import { sortByList } from "@/_helper/constants";
import { ProgressiveImg } from "../dynamiComponents";

export default function ProductFilterSidebar({ uniqueVariations = [] }) {
  const dispatch = useDispatch();
  const screen = useWindowSize();
  const {
    showFilterSidebar,
    openKeys,
    selectedSortByValue,
    selectedVariations,
    selectedSettingStyles,
    uniqueFilterOptions,
  } = useSelector(({ product }) => product);
  const isOpenKey = (key) => openKeys.includes(key);

  const onSelectVariant = (variationName, variationTypeName) => {
    dispatch(
      setSelectedVariations({
        ...selectedVariations,
        [variationName]: variationTypeName,
      })
    );
  };

  useEffect(() => {
    const isSmallScreen = screen.isMobile || screen.isTablet;

    if (showFilterSidebar && isSmallScreen) {
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.position = "";
      document.body.style.width = "";
    }

    return () => {
      document.body.style.overflow = "auto";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [showFilterSidebar]);
  return (
    <div
      className={`w-full lg:w-[300px] 2xl:w-[400px] flex-shrink-0 bg-white lg:bg-transparent transition-transform duration-300 ease-in-out lg:sticky lg:top-20 lg:h-screen lg:overflow-y-auto lg:translate-x-0 lg:z-0 z-[60] ${
        showFilterSidebar
          ? "fixed inset-y-0 left-0 translate-x-0 block"
          : "fixed -translate-x-full lg:translate-x-0 hidden"
      }`}
    >
      {showFilterSidebar && (
        <div>
          <div
            className="fixed inset-0 bg-white lg:hidden"
            onClick={() => {
              dispatch(setShowFilterSidebar(false));
              dispatch(setOpenKeys(defaultOpenKeys));
            }}
          />
        </div>
      )}

      <div className="relative z-3 bg-transparent p-4 h-full">
        <div className="flex justify-between items-center border-b border-[#C8C8C6] pb-4">
          <h2 className="text-lg font-semibold">All Filters</h2>
          <button
            onClick={() => {
              dispatch(setShowFilterSidebar(false));
              dispatch(setOpenKeys(defaultOpenKeys));
            }}
          >
            <AiOutlineClose />
          </button>
        </div>

        <div className="flex justify-end">
          <button
            onClick={() => dispatch(resetFilters())}
            className="text-xs underline hover:underline mt-3"
          >
            Reset Filters
          </button>
        </div>

        <div>
          <div className="border-b border-[#C8C8C6]">
            <button
              className={`w-full flex items-center justify-between ${
                isOpenKey("sortBy") ? "pt-4 pb-2" : "py-4"
              }`}
              onClick={() => dispatch(toggleOpenKey("sortBy"))}
            >
              <p className="font-semibold mb-1">Sort By</p>
              <span className="text-xl">
                {isOpenKey("sortBy") ? <FiMinus /> : <FiPlus />}
              </span>
            </button>
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isOpenKey("sortBy")
                  ? "max-h-screen opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="flex flex-wrap gap-2 pb-4">
                {sortByList.map((item) => (
                  <button
                    key={item.value}
                    onClick={() => dispatch(setSortByValue(item.value))}
                    className={`px-3 py-1 border text-sm ${
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
          <div className="border-b border-[#C8C8C6]">
            <button
              className={`w-full flex items-center justify-between ${
                isOpenKey("settingStyle") ? "pt-4 pb-2" : "py-4"
              }`}
              onClick={() => dispatch(toggleOpenKey("settingStyle"))}
            >
              <p className="font-semibold mb-1">Setting Style</p>
              <span className="text-xl">
                {isOpenKey("settingStyle") ? <FiMinus /> : <FiPlus />}
              </span>
            </button>
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isOpenKey("settingStyle")
                  ? "max-h-screen opacity-100"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-4 gap-2 pb-4">
                {uniqueFilterOptions.uniqueSettingStyles.map((settingStyle) => {
                  const isSelected =
                    selectedSettingStyles === settingStyle.value;

                  return (
                    <div
                      className={`text-center cursor-pointer `}
                      onClick={() => {
                        dispatch(setSelectedSettingStyle(settingStyle.value));
                      }}
                      key={`setting-style-key-${settingStyle.value}`}
                    >
                      <ProgressiveImg
                        className={`w-full  aspect-square object-cover !transition-none  border-2 border-transparent ${
                          isSelected ? "border-2 !border-primary" : ""
                        }`}
                        src={settingStyle.image}
                        alt={settingStyle.title}
                        title={settingStyle.title}
                      />
                      <h2 className="text-base lg:text-sm font-semibold mt-2">
                        {settingStyle.title}
                      </h2>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {uniqueVariations.map((variation) => (
            <div
              key={variation.variationId}
              className="border-b border-[#C8C8C6]"
            >
              <button
                className={`w-full flex items-center justify-between ${
                  isOpenKey(variation.variationName) ? "pt-4 pb-2" : "py-4"
                }`}
                onClick={() => dispatch(toggleOpenKey(variation.variationName))}
              >
                <p className="font-semibold mb-1">{variation.variationName}</p>
                <span className="text-xl">
                  {isOpenKey(variation.variationName) ? (
                    <FiMinus />
                  ) : (
                    <FiPlus />
                  )}
                </span>
              </button>
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isOpenKey(variation.variationName)
                    ? "max-h-screen opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="flex flex-wrap pb-4">
                  {/* {variation.variationTypes.map((type) => (
                    <button
                      key={type.variationTypeId}
                      onClick={() =>
                        onSelectVariant(
                          variation.variationName,
                          type.variationTypeName
                        )
                      }
                      className={`px-3  py-1 m-1 border  text-sm ${
                        selectedVariations[variation.variationName] ===
                        type.variationTypeName
                          ? type.variationTypeHexCode
                            ? "border-primary border-2"
                            : "bg-primary text-white"
                          : type.variationTypeHexCode
                          ? "border-gray-300"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                      style={
                        type.variationTypeHexCode
                          ? {
                              backgroundColor: type.variationTypeHexCode,
                              width: "32px",
                              height: "32px",
                            }
                          : {}
                      }
                    >
                      {!type.variationTypeHexCode && type.variationTypeName}
                    </button>
                  ))} */}
                  {variation.variationTypes.map((type) => (
                    <button
                      key={type.variationTypeId}
                      onClick={() =>
                        onSelectVariant(
                          variation.variationName,
                          type.variationTypeName
                        )
                      }
                      className={`px-3 flex items-center gap-2 py-1.5 m-1 border  text-sm ${
                        selectedVariations[variation.variationName] ===
                        type.variationTypeName
                          ? "bg-primary text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                    >
                      {type.variationTypeHexCode ? (
                        <div
                          className="w-6 h-6 "
                          style={{
                            backgroundColor: type.variationTypeHexCode,
                          }}
                        ></div>
                      ) : null}{" "}
                      {type.variationTypeName}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
