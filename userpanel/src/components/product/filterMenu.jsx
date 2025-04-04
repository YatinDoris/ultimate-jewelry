"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { VscSettings } from "react-icons/vsc";
const sortByList = [
  { value: "date_new_to_old", title: "NEW TO OLD" },
  { value: "date_old_to_new", title: "OLD TO NEW" },
  { value: "price_high_to_low", title: "HIGH TO LOW" },
  { value: "price_low_to_high", title: "LOW TO HIGH" },
  { value: "alphabetically_a_to_z", title: "A-Z" },
  { value: "alphabetically_z_to_a", title: "Z-A" },
];

const FilterMenu = ({
  filterMenuList,
  sortBySelectHandler,
  selectedSortByValue,
  onSelectVariant,
  selectedVariation,
  handleClearFilters,
}) => {
  const dropdownRef = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShow(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleButtonClick = useCallback(
    (e) => {
      e.stopPropagation();
      setShow(!show);
    },
    [show]
  );
  return (
    <div className="relative z-10">
      <button
        onClick={handleButtonClick}
        className="flex items-center gap-2 px-4 py-2 border  shadow-sm bg-primary text-white hover:bg-gray-100 hover:border-primary hover:text-primary font-medium transition-all duration-300"
      >
        <VscSettings className="text-xl" /> Filter
      </button>
      {show && (
        <div className="absolute top-12 left-0 max-w-md w-auto bg-white shadow-lg p-4 rounded-md">
          <div className="flex justify-between border-b pb-2">
            <button
              onClick={handleClearFilters}
              className="text-sm font-semibold text-primary hover:underline"
            >
              Clear Filter
            </button>
            <button onClick={() => setShow(false)}>
              <AiOutlineClose size={20} />
            </button>
          </div>

          <div className="mt-2 max-h-[500px] overflow-y-auto">
            <div className="py-2">
              <p className="font-semibold mb-1">Sort By</p>
              <div className="flex flex-wrap gap-2">
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

            {filterMenuList?.map((x) => (
              <div key={x?.variationId} className="py-2">
                <p className="font-semibold mb-1">{x?.variationName}</p>
                <div className="flex flex-wrap gap-2">
                  {x?.variationTypes?.map((y) => (
                    <button
                      key={`${x.variationId}-${y.variationTypeName}`}
                      onClick={() =>
                        onSelectVariant(x?.variationName, y?.variationTypeName)
                      }
                      className={`px-3 py-1 border rounded-md text-sm ${
                        selectedVariation[x?.variationName] ===
                        y?.variationTypeName
                          ? "bg-primary text-white"
                          : "bg-gray-100 hover:bg-gray-200"
                      }`}
                      style={
                        y?.variationTypeHexCode
                          ? { backgroundColor: y.variationTypeHexCode }
                          : {}
                      }
                    >
                      {y?.variationTypeName}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterMenu;
