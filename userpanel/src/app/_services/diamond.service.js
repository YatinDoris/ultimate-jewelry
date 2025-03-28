import { fetchWrapperService, helperFunctions, productsUrl, sanitizeValue } from "../_helper";
import { DIAMONDS_LIST } from "../_helper/diamondsList";
import { diamondShapeService } from "./diamondShape.service";
      // Function for handling the unique Case
      const getUniqueValuesWithOriginalCase = (array) => {
        const lowerCaseMap = new Map();
        let hasNA = false;
      
        array.forEach(item => {
          if (!item) {
            hasNA = true; // Track if there's a null or undefined value
          } else {
            lowerCaseMap.set(item.toLowerCase(), item);
          }
        });
      
        const sortedValues = [...lowerCaseMap.values()];
        
        // Ensure "N/A" is always the first item
        return hasNA ? ["N/A", ...sortedValues] : sortedValues;
      };
      
      const getUniqueValues = (array) => {
        return [...new Set(array.map(item => item?.toLowerCase()))].filter(Boolean);
      };


const getFilteredDiamonds = (params) => {
 
  return new Promise(async (resolve, reject) => {
    try {
      const {
        productId,
        selectedDiaTypes,
        selectedDiaShapes,
        caratRangeValues,
        diaPriceRangeValues,
        selectedDiaCutValues,
        selectedDiaColorValues,       
        selectedDiaClarityValues,
        lwRangeValues,
        selectedDiaFluorescenceValues,
        selectedDiaPolishValues,
        selectedDiaSymmrtriesValues,
        tablePercRangeValues,
        depthPercRangeValues,
        selectedDiaCertificates,
      } = params || {};
      const diamondShapeList = await diamondShapeService.getAllDiamondShapes();
      const diamondsList = DIAMONDS_LIST.filter((diamond) => diamond?.type && diamond?.shape  && diamond.total_sales_price)
     
      let productWiseDiamondList = diamondsList;

      if (productId){
        const productFindPattern = {id: productId}
        const singleProductDataById = await fetchWrapperService.findOne(productsUrl,productFindPattern);
        if(!singleProductDataById){
          reject(new Error('Product does not exist'));
          return 
        }
        
        if (singleProductDataById?.isDiamondFilter) {
          const diaShapeIds =
          singleProductDataById?.diamondFilters?.diamondShapeIds;
          singleProductDataById.diamondFilters.diamondShapes = diaShapeIds.map(
            (shapeId) => {
              const foundedShape = diamondShapeList?.find(
                (shape) => shape?.id === shapeId
              );
              return {
                title: foundedShape?.title,
                image: foundedShape?.image,
                id: foundedShape?.id,
              };
            }
          );
        }
        const diamondFilters = singleProductDataById?.diamondFilters || {};

        productWiseDiamondList = diamondsList.filter((diamond) => {
          // Apply carat weight range filter
          if (
            diamondFilters?.caratWeightRange &&
            (diamond.size < diamondFilters.caratWeightRange.min ||
              diamond.size > diamondFilters.caratWeightRange.max)
          ) {
            return false;
          }
  
          // Apply diamond shapes filter
          if (
            diamondFilters?.diamondShapes &&
            !diamondFilters.diamondShapes.some(
              (shape) =>
                shape.title?.toLowerCase() === diamond.shape?.toLowerCase()
            )
          ) {
            return false;
          }
  
          return true; // If all filters pass, include this diamond
        });
         
      }

      const tempDiamondTypes = [];
      const tempDiamondShapes = [];
      const tempCaratRange = [];
      const tempDiamondPriceRange = [];
      const tempDiaCutsList = [];
      const tempDiaColorRange = [];
      const tempDiaClarityRange = [];
      const tempLWRange = [];
      const tempFluorescenceRange = [];
      const tempPolishRange = [];
      const tempSymmetryRange = [];
      const tempTablePercRange = [];
      const tempDepthPercRange = [];
      const tempCertificates = [];

      productWiseDiamondList.forEach((diamond) => {
        tempDiamondTypes.push(diamond.type);
        tempDiamondShapes.push(diamond.shape);
        tempCaratRange.push(Number(diamond.size));
        tempDiamondPriceRange.push(Number(diamond.total_sales_price));
        tempDiaCutsList.push(diamond.cut);
        tempDiaColorRange.push(diamond.color);
        tempDiaClarityRange.push(diamond.clarity);

        // Ensure proper number conversion before division
        const length = Number(diamond.meas_length);
        const width = Number(diamond.meas_width);
        const lengthWidthRatio =
          width !== 0 ? Number((length / width).toFixed(2)) : 0;
        tempLWRange.push(lengthWidthRatio);

        tempFluorescenceRange.push(diamond.fluorescence_intensity_long);
        tempPolishRange.push(diamond.polish);
        tempSymmetryRange.push(diamond.symmetry);
        tempTablePercRange.push(Number(diamond.center_table_percent));
        tempDepthPercRange.push(Number(diamond.center_depth_percent));
        tempCertificates.push(diamond.lab);
      });

      const availableDiamonds = helperFunctions
      .sortByField(productWiseDiamondList)
      .filter((diamond) => {
        const allowNull = {
          cut: !selectedDiaCutValues?.length,
          color: !selectedDiaColorValues?.length,
          clarity: !selectedDiaClarityValues?.length,
          fluorescence: !selectedDiaFluorescenceValues?.length,
          symmetry: !selectedDiaSymmrtriesValues?.length,
          certificate: !selectedDiaCertificates?.length,
          polish: !selectedDiaPolishValues?.length,
        };
    
        const isDiamondOriginValid = selectedDiaTypes?.length
          ? selectedDiaTypes.some((type) =>
              diamond?.type?.includes(type?.value)
            )
          : true;
    
        const isDiamondShapeValid = selectedDiaShapes?.length
          ? selectedDiaShapes.some((shape) =>
              diamond?.shape?.includes(shape?.value)
            )
          : true;
    
          const isDiamondCutValid = selectedDiaCutValues?.length
          ? selectedDiaCutValues.some((cut) =>
              diamond?.cut
                ? diamond.cut.includes(cut?.value)  // Match selected cut values
                : cut.value.toLowerCase() === "n/a" // Allow only if "N/A" is selected
            )
          : allowNull.cut || diamond?.cut == null;
        
    
          const isDiamondColorValid = selectedDiaColorValues?.length
          ? selectedDiaColorValues.some((color) =>
              diamond?.color
                ? diamond.color.includes(color?.value)  // Match selected color values
                : color.value.toLowerCase() === "n/a"   // Allow only if "N/A" is selected
            )
          : allowNull.color || diamond?.color == null;
        
    
          const isDiamondClarityValid = selectedDiaClarityValues?.length
          ? selectedDiaClarityValues.some((clarity) =>
              diamond?.clarity
                ? diamond.clarity.includes(clarity?.value)  // Match selected clarity values
                : clarity.value.toLowerCase() === "n/a"    // Allow only if "N/A" is selected
            )
          : allowNull.clarity || diamond?.clarity == null;
        
    
          const isDiamondFluorescenceValid = selectedDiaFluorescenceValues?.length
          ? selectedDiaFluorescenceValues.some((fluorescence) =>
              diamond?.fluorescence_intensity_long
                ? diamond.fluorescence_intensity_long.includes(fluorescence?.value)
                : fluorescence.value.toLowerCase() === "n/a"
            )
          : allowNull.fluorescence || diamond?.fluorescence_intensity_long == null;
    
          const isDiamondPolishValid = selectedDiaPolishValues?.length
          ? selectedDiaPolishValues.some((polish) =>
              diamond?.polish
                ? diamond.polish.includes(polish?.value)
                : polish.value.toLowerCase() === "n/a"
            )
          : allowNull.polish || diamond?.polish == null;

          const isDiamondSymmetryValid = selectedDiaSymmrtriesValues?.length
          ? selectedDiaSymmrtriesValues.some((symmetry) =>
              diamond?.symmetry
                ? diamond.symmetry.includes(symmetry?.value)  // Match selected symmetry values
                : symmetry.value.toLowerCase() === "n/a"      // Allow only if "N/A" is selected
            )
          : allowNull.symmetry || diamond?.symmetry == null;
        
    
        const isDiamondPriceValid = diaPriceRangeValues?.length
          ? diamond.total_sales_price >= (diaPriceRangeValues[0] || 0) &&
            diamond.total_sales_price <= (diaPriceRangeValues[1] || Infinity)
          : true;
    
        const isCaratRangeValid = caratRangeValues?.length
          ? Number(diamond.size) >= (caratRangeValues[0] || 0) &&
            Number(diamond.size) <= (caratRangeValues[1] || Infinity)
          : true;
    
        const isTablePercRangeValid = tablePercRangeValues?.length
          ? diamond.center_table_percent >= (tablePercRangeValues[0] || 0) &&
            diamond.center_table_percent <= (tablePercRangeValues[1] || Infinity)
          : true;
    
        const isDepthPercRangeValid = depthPercRangeValues?.length
          ? diamond.center_depth_percent >= (depthPercRangeValues[0] || 0) &&
            diamond.center_depth_percent <= (depthPercRangeValues[1] || Infinity)
          : true;
    
          const isDiamondCertificatesValid = selectedDiaCertificates?.length
          ? selectedDiaCertificates.some((certificate) =>
              diamond?.lab
                ? diamond.lab.includes(certificate?.value)  // Match selected certificate values
                : certificate.value.toLowerCase() === "n/a"  // Allow only if "N/A" is selected
            )
          : allowNull.certificate || diamond?.certificate == null;
        
    
        const lengthWidthRatio =
          diamond.width !== 0
            ? Number(
                (
                  Number(diamond.meas_length) / Number(diamond.meas_width)
                ).toFixed(2)
              )
            : 0;
    
        const isLWRatioValid = lwRangeValues?.length
          ? lengthWidthRatio >= (lwRangeValues[0] || 0) &&
            lengthWidthRatio <= (lwRangeValues[1] || Infinity)
          : true;

        return (
          isDiamondOriginValid &&
          isDiamondShapeValid &&
          isDiamondCutValid &&
          isDiamondColorValid &&
          isDiamondClarityValid &&
          isDiamondFluorescenceValid &&
          isDiamondPolishValid &&
          isDiamondSymmetryValid &&
          isDiamondPriceValid &&
          isCaratRangeValid &&
          isTablePercRangeValid &&
          isDepthPercRangeValid &&
          isDiamondCertificatesValid &&
          isLWRatioValid
        );
      });
    
      const minCaratRange = Math.min(...tempCaratRange);
      const maxCaratRange = Math.max(...tempCaratRange);

      const minDiamondPriceRange = Math.min(...tempDiamondPriceRange);
      const maxDiamondPriceRange = Math.max(...tempDiamondPriceRange);

      const minLWRange = Math.min(...tempLWRange);
      const maxLWRange = Math.max(...tempLWRange);

      const minTablePercRange = Math.min(...tempTablePercRange);
      const maxTablePercRange = Math.max(...tempTablePercRange);
      const minDepthPercRange = Math.min(...tempDepthPercRange);
      const maxDepthPercRange = Math.max(...tempDepthPercRange);



      const uniqueDiamondCuts = getUniqueValuesWithOriginalCase(tempDiaCutsList);
      // [...new Set(tempDiaCutsList)].filter(
      //   (cut) =>cut?.toLowerCase()
      // );


      const uniqueDiamondColors = getUniqueValuesWithOriginalCase(tempDiaColorRange);
      //  [...new Set(tempDiaColorRange)].filter(
      //   (color) => color?.toLowerCase()
      // );
      
      const uniqueDiamondClarity = getUniqueValuesWithOriginalCase(tempDiaClarityRange);
      // [...new Set(tempDiaClarityRange)].filter(
      //   (clarity) => clarity?.toLowerCase()
      // );
   
      const uniqueFluorescenceRange = getUniqueValuesWithOriginalCase(tempFluorescenceRange);
      // [
      //   ...new Set(tempFluorescenceRange),
      // ].filter((fluorescence_intensity_long) => fluorescence_intensity_long);

      const uniquePolishRange = getUniqueValuesWithOriginalCase(tempPolishRange);
      // const uniquePolishRange = [...new Set(tempPolishRange)].filter(
      //   (polish) => polish?.toLowerCase()
      // );

      const uniqueSymmetryRange = getUniqueValuesWithOriginalCase(tempSymmetryRange);
      //  [...new Set(tempSymmetryRange)].filter(
      //   (symmetry) => symmetry?.toLowerCase()
      // );

      const uniqueCertificates = getUniqueValuesWithOriginalCase(tempCertificates);
      //  [...new Set(tempCertificates)].filter(
      //   (lab) => lab?.toLowerCase()
      // );

      const uniqueDiamondShapes = getUniqueValues(tempDiamondShapes).map(
        (diaShapeName) => {
          const foundedDiaShape = diamondShapeList.find(
            (x) => x.title?.toLowerCase() === diaShapeName?.toLowerCase()
          );
          return {
            title: foundedDiaShape?.title,
            image: foundedDiaShape?.image,
            value: foundedDiaShape?.title,
          };
        }
      );

      const metaData = {
        uniqueDiamondTypes: getUniqueValues(tempDiamondTypes),
        uniqueDiamondShapes,
        availableCaratRange: [minCaratRange, maxCaratRange],
        availableDiamondPriceRange: [
          minDiamondPriceRange,
          maxDiamondPriceRange,
        ],
        uniqueDiamondCuts,
        availableDiaCutRange: [0, uniqueDiamondCuts?.length],
        uniqueDiamondColors,
        availableDiaColorRange: [0, uniqueDiamondColors?.length],
        uniqueDiamondClarity,
        availableDiaClarityRange: [0, uniqueDiamondClarity?.length],

        availableLWRange: [minLWRange, maxLWRange],

        uniqueFluorescenceRange,
        availableDiaFluorescenceRange: [0, uniqueFluorescenceRange?.length],
        uniquePolishRange,
        availableDiaPolishRange: [0, uniquePolishRange?.length],
        uniqueSymmetryRange,
        availableDiaSymmetryRange: [0, uniqueSymmetryRange?.length],

        availableTablePercRange: [minTablePercRange, maxTablePercRange],
        availableDepthPercRange: [minDepthPercRange, maxDepthPercRange],

        uniqueCertificates,
      };
      resolve({
        diamonds: availableDiamonds,
        metaData,
      });
    } catch (e) {
      console.log(e?.message, "error message");
      reject(e);
    }
  });
};

const getDiamondDetailById = async (diamondId) => {
   return new Promise(async (resolve, reject) => {
    
      try {
        diamondId = sanitizeValue(diamondId)
        ? diamondId.trim()
        : null;

        if(!diamondId){
          reject(new Error("Invalid Data"));
          return;
        }
        
        const selectedDiamond = DIAMONDS_LIST?.find(
          (diamond) => Number(diamond?.id) === Number(diamondId)
        );
        if(!selectedDiamond){
          reject(new Error("Diamond does not exist"));
          return;
        }
        resolve(selectedDiamond);
      } catch (e) {
        reject(e);
      }
    });
};  

export const diamondService = {
  getFilteredDiamonds,
  getDiamondDetailById
};