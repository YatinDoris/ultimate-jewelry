import {
  defaultOpenKeys,
  resetFilters,
  setOpenKeys,
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

const sortByList = [
  { value: "date_new_to_old", title: "NEW TO OLD" },
  { value: "date_old_to_new", title: "OLD TO NEW" },
  { value: "price_high_to_low", title: "HIGH TO LOW" },
  { value: "price_low_to_high", title: "LOW TO HIGH" },
  { value: "alphabetically_a_to_z", title: "A-Z" },
  { value: "alphabetically_z_to_a", title: "Z-A" },
];

export default function ProductFilterSidebar({ uniqueVariations = [] }) {
  const dispatch = useDispatch();
  const screen = useWindowSize();
  const {
    showFilterSidebar,
    openKeys,
    selectedSortByValue,
    selectedVariations,
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

    // Cleanup function
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.position = "";
      document.body.style.width = "";
    };
  }, [showFilterSidebar]);
  return (
    <div
      className={`w-full lg:w-72 flex-shrink-0 bg-white lg:bg-transparent transition-transform duration-300 ease-in-out lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] lg:overflow-y-auto lg:translate-x-0 lg:z-0 z-[60] ${
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
                <div className="flex flex-wrap gap-2 pb-4">
                  {variation.variationTypes.map((type) => (
                    <button
                      key={type.variationTypeId}
                      onClick={() =>
                        onSelectVariant(
                          variation.variationName,
                          type.variationTypeName
                        )
                      }
                      className={`px-3 py-1 m-1 border rounded-md text-sm ${
                        selectedVariations[variation.variationName] ===
                        type.variationTypeName
                          ? "bg-primary text-white"
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
