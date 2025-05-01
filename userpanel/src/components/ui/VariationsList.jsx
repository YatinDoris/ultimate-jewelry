import { memo } from "react";
import { CustomImg } from "../dynamiComponents";

const VariationsList = ({ variations, selectedVariations, handleSelect }) => {
  // Helper to check if a specific variationId + variationTypeId is selected
  const isSelected = (variationId, variationTypeId) =>
    selectedVariations?.length &&
    selectedVariations?.some(
      (v) =>
        v.variationId === variationId && v.variationTypeId === variationTypeId
    );

  return (
    <div className="flex flex-col mt-4 lg:mt-6 gap-4 lg:gap-6">
      {variations?.map((variation) => (
        <div
          key={variation.variationId}
          className="flex items-center md:gap-x-6"
        >
          <p className="font-medium text-baseblack text-sm  3xl:text-lg w-[80px] xs:w-[90px]">
            {variation.variationName}:
          </p>

          <div className="flex flex-wrap gap-2 md:gap-3 items-center">
            {variation.variationTypes.map((type) => {
              const selected = isSelected(
                variation.variationId,
                type.variationTypeId
              );

              return (
                <div key={type.variationTypeId} className="relative">
                  {type.type === "color" ? (
                    <div className="relative flex flex-col items-center mb-4">
                      <button
                        className={`relative w-12 xs:w-16 3xl:w-20 h-10 xs:h-8 3xl:h-10 p-2 transition-all flex items-center justify-center
                     ${selected
                            ? "border-primary border-2"
                            : "border-transparent border-2"
                          }
                   `}
                        style={{
                          backgroundColor: type.variationTypeHexCode,
                          boxShadow: selected ? "inset 0 0 0 4px #fff" : "none",
                        }}
                        onClick={() =>
                          handleSelect(
                            variation.variationId,
                            type.variationTypeId
                          )
                        }
                      />
                      {selected && (
                        <span className="absolute top-full mt-1 text-[12px]  md:text-[12px] 3xl:text-base font-medium text-primary whitespace-nowrap">
                          {type.variationTypeName}
                        </span>
                      )}
                    </div>
                  ) : type.type === "image" ? (
                    <button
                      className={`p-2 flex flex-col items-center ${selected
                        ? "border-primary border-2 text-primary"
                        : "border-transparent border-2"
                        }`}
                      onClick={() =>
                        handleSelect(
                          variation.variationId,
                          type.variationTypeId
                        )
                      }
                    >
                      <CustomImg
                        srcAttr={type.variationTypeImage}
                        alt={type.variationTypeName}
                        width={100}
                        height={100}
                        className="w-7 h-7 object-contain"
                      />
                      <span className="text-sm mt-1">
                        {type.variationTypeName}
                      </span>
                    </button>
                  ) : (
                    <button
                      className={`px-4 py-1 text-sm  md:text-sm 3xl:text-xl font-medium transition-all ${selected
                        ? "border-primary text-primary border-2"
                        : "text-baseblack border-transparent border-2"
                        }`}
                      onClick={() =>
                        handleSelect(
                          variation.variationId,
                          type.variationTypeId
                        )
                      }
                    >
                      {type.variationTypeName}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default memo(VariationsList);
