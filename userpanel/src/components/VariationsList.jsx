import React, { memo, useMemo } from "react";
import { CustomImg } from "./dynamiComponents";

const VariationsList = ({
  variations,
  selectedVariations,
  hoveredNames,
  handleSelect,
  handleHover,
  handleHoverLeave,
}) => {
  const selectedTypes = useMemo(() => {
    return variations?.reduce((acc, variation) => {
      acc[variation.variationId] = variation.variationTypes.find(
        (type) =>
          type.variationTypeId === selectedVariations[variation.variationId]
      );
      return acc;
    }, {});
  }, [variations, selectedVariations]);

  return (
    <>
      {variations?.map((variation) => (
        <div
          key={variation.variationId}
          className="!mt-8 lg:!mt-12 flex flex-wrap items-center gap-3"
        >
          <p className="font-medium text-xl whitespace-nowrap">
            {variation.variationName}:
          </p>
          <div className="flex flex-wrap gap-3 mt-2 items-center py-2 relative max-w-full">
            {variation.variationTypes.map((type) => (
              <div key={type.variationTypeId} className="relative">
                {type.type === "color" ? (
                  <div className="flex flex-col items-center">
                    <button
                      className={`relative w-16 sm:w-20 h-10 p-2 border transition-all flex items-center justify-center
                 ${
                   selectedVariations[variation.variationId] ===
                   type.variationTypeId
                     ? "border-primary border-2"
                     : "border-gray-300"
                 }
               `}
                      style={{
                        backgroundColor: type.variationTypeHexCode,
                        boxShadow:
                          selectedVariations[variation.variationId] ===
                          type.variationTypeId
                            ? "inset 0 0 0 4px #fff"
                            : "none",
                      }}
                      onClick={() =>
                        handleSelect(
                          variation.variationId,
                          type.variationTypeId
                        )
                      }
                      onMouseEnter={() =>
                        handleHover(
                          variation.variationId,
                          type.variationTypeName
                        )
                      }
                      onMouseLeave={() =>
                        handleHoverLeave(variation.variationId)
                      }
                    />
                    <span
                      className={`text-sm font-medium mt-1 whitespace-nowrap transition-opacity duration-300
                 ${
                   selectedVariations[variation.variationId] ===
                   type.variationTypeId
                     ? "text-primary opacity-100"
                     : "opacity-0"
                 }
               `}
                    >
                      {type.variationTypeName}
                    </span>
                  </div>
                ) : type.type === "image" ? (
                  // ✅ Image Variations (e.g., Ring Shape)
                  <button
                    className={`p-2 flex flex-col items-center ${
                      selectedVariations[variation.variationId] ===
                      type.variationTypeId
                        ? "border-primary border-2"
                        : ""
                    }`}
                    onClick={() =>
                      handleSelect(variation.variationId, type.variationTypeId)
                    }
                    onMouseEnter={() =>
                      handleHover(variation.variationId, type.variationTypeName)
                    }
                    onMouseLeave={() => handleHoverLeave(variation.variationId)}
                  >
                    <CustomImg
                      srcAttr={type.variationTypeImage}
                      alt={type.variationTypeName}
                      className="w-7 h-7 object-contain"
                    />
                    <span className="text-sm mt-1">
                      {type.variationTypeName}
                    </span>
                  </button>
                ) : (
                  // ✅ Text Button Variations (e.g., Metal Type, Ring Size)
                  <button
                    className={`px-4 py-2 transition-all ${
                      selectedVariations[variation.variationId] ===
                      type.variationTypeId
                        ? "border-primary border-2 scale-105"
                        : ""
                    }`}
                    onClick={() =>
                      handleSelect(variation.variationId, type.variationTypeId)
                    }
                    onMouseEnter={() =>
                      handleHover(variation.variationId, type.variationTypeName)
                    }
                    onMouseLeave={() => handleHoverLeave(variation.variationId)}
                  >
                    {type.variationTypeName}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
};

export default memo(VariationsList);
