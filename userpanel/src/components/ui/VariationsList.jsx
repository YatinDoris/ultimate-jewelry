// import { memo } from "react";
// import { CustomImg } from "./dynamiComponents";

// const VariationsList = ({
//   variations,
//   selectedVariations,
//   handleSelect,
//   // handleHover,
//   // handleHoverLeave,
// }) => {
//   return (
//     <div className="flex flex-col !mt-6 lg:!mt-8 gap-6 lg:gap-8">
//       {variations?.map((variation) => (
//         <div
//           key={variation.variationId}
//           className="flex items-center md:gap-x-6"
//         >
//           <p className="font-medium text-baseblack text-lg min-w-[110px] xs:min-w-[120px]">
//             {variation.variationName}:
//           </p>

//           <div className="flex flex-wrap gap-3 items-center py-2">
//             {variation.variationTypes.map((type) => (
//               <div key={type.variationTypeId} className="relative">
//                 {type.type === "color" ? (
//                   <div className="flex flex-col items-center">
//                     <button
//                       className={`relative w-16 sm:w-20 h-10 p-2 border transition-all flex items-center justify-center
//                       ${
//                         selectedVariations[variation.variationId] ===
//                         type.variationTypeId
//                           ? "border-primary border-2"
//                           : ""
//                       }
//                     `}
//                       style={{
//                         backgroundColor: type.variationTypeHexCode,
//                         boxShadow:
//                           selectedVariations[variation.variationId] ===
//                           type.variationTypeId
//                             ? "inset 0 0 0 4px #fff"
//                             : "none",
//                       }}
//                       onClick={() =>
//                         handleSelect(
//                           variation.variationId,
//                           type.variationTypeId
//                         )
//                       }
//                       // onMouseEnter={() =>
//                       //   handleHover(
//                       //     variation.variationId,
//                       //     type.variationTypeName
//                       //   )
//                       // }
//                       // onMouseLeave={() =>
//                       //   handleHoverLeave(variation.variationId)
//                       // }
//                     />
//                     <span
//                       className={`text-lg font-medium mt-1 whitespace-nowrap transition-opacity duration-300
//                       ${
//                         selectedVariations[variation.variationId] ===
//                         type.variationTypeId
//                           ? "text-primary opacity-100"
//                           : "opacity-0"
//                       }
//                     `}
//                     >
//                       {type.variationTypeName}
//                     </span>
//                   </div>
//                 ) : type.type === "image" ? (
//                   <button
//                     className={`p-2 flex flex-col items-center ${
//                       selectedVariations[variation.variationId] ===
//                       type.variationTypeId
//                         ? "border-primary border-2 text-primary"
//                         : ""
//                     }`}
//                     onClick={() =>
//                       handleSelect(variation.variationId, type.variationTypeId)
//                     }
//                     // onMouseEnter={() =>
//                     //   handleHover(variation.variationId, type.variationTypeName)
//                     // }
//                     // onMouseLeave={() => handleHoverLeave(variation.variationId)}
//                   >
//                     <CustomImg
//                       srcAttr={type.variationTypeImage}
//                       alt={type.variationTypeName}
//                       width={100}
//                       height={100}
//                       className="w-7 h-7 object-contain"
//                     />
//                     <span className="text-sm mt-1">
//                       {type.variationTypeName}
//                     </span>
//                   </button>
//                 ) : (
//                   <button
//                     className={`px-4 py-2 text-xl lg:text-2xl font-medium transition-all ${
//                       selectedVariations[variation.variationId] ===
//                       type.variationTypeId
//                         ? "border-primary text-primary border-2 scale-105"
//                         : "text-baseblack"
//                     }`}
//                     onClick={() =>
//                       handleSelect(variation.variationId, type.variationTypeId)
//                     }
//                     // onMouseEnter={() =>
//                     //   handleHover(variation.variationId, type.variationTypeName)
//                     // }
//                     // onMouseLeave={() => handleHoverLeave(variation.variationId)}
//                   >
//                     {type.variationTypeName}
//                   </button>
//                 )}
//               </div>
//             ))}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default memo(VariationsList);

import { memo } from "react";
import { CustomImg } from "../dynamiComponents";

const VariationsList = ({ variations, selectedVariations, handleSelect }) => {
  // Helper to check if a specific variationId + variationTypeId is selected
  const isSelected = (variationId, variationTypeId) =>
    selectedVariations?.some(
      (v) =>
        v.variationId === variationId && v.variationTypeId === variationTypeId
    );

  return (
    <div className="flex flex-col mt-6 lg:mt-8 gap-6 lg:gap-8">
      {variations?.map((variation) => (
        <div
          key={variation.variationId}
          className="flex items-center md:gap-x-6"
        >
          <p className="font-medium text-baseblack text-lg w-[110px] xs:w-[120px]">
            {variation.variationName}:
          </p>

          <div className="flex flex-wrap gap-3 items-center py-2">
            {variation.variationTypes.map((type) => {
              const selected = isSelected(
                variation.variationId,
                type.variationTypeId
              );

              return (
                <div key={type.variationTypeId} className="relative">
                  {type.type === "color" ? (
                    <div className="flex flex-col items-center">
                      <button
                        className={`relative w-16 sm:w-20 h-10 p-2 transition-all flex items-center justify-center
                          ${
                            selected
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
                      <span
                        className={`text-base font-medium mt-1 whitespace-nowrap transition-opacity duration-300
                          ${selected ? "text-primary opacity-100" : "opacity-0"}
                        `}
                      >
                        {type.variationTypeName}
                      </span>
                    </div>
                  ) : type.type === "image" ? (
                    <button
                      className={`p-2 flex flex-col items-center ${
                        selected
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
                      className={`px-4 py-1 text-xl font-medium transition-all ${
                        selected
                          ? "border-primary text-primary border-2 scale-105"
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
