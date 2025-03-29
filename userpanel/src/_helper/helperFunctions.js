import { uid } from "uid";

const generateUniqueId = () => {
  const uuid = uid();
  return uuid;
};

const stringReplacedWithUnderScore = (string) => {
  return string?.split(" ")?.join("_");
};
const stringReplacedWithSpace = (string) => {
  return string?.split("_")?.join(" ");
};

const getRandomValue = () => {
  return Math.random().toString(36).substring(7);
};

const getVariationsArray = (variaionsOfArray, customizations) => {
  return variaionsOfArray.map((variItem) => {
    const findedCustomizationType = customizations?.customizationType?.find(
      (x) => x.id === variItem?.variationId
    );
    return {
      variationId: variItem?.variationId,
      variationName: findedCustomizationType?.title,
      variationTypes: variItem?.variationTypes?.map((variTypeItem) => {
        const findedCustomizationSubType =
          customizations?.customizationSubType?.find(
            (x) => x.id === variTypeItem?.variationTypeId
          );
        let varitionTypeObj = {
          variationTypeId: variTypeItem?.variationTypeId,
          variationTypeName: findedCustomizationSubType?.title,
          type: findedCustomizationSubType?.type,
        };

        if (findedCustomizationSubType?.type === "color") {
          varitionTypeObj.variationTypeHexCode =
            findedCustomizationSubType?.hexCode;
        }
        if (findedCustomizationSubType?.type === "image") {
          varitionTypeObj.variationTypeImage =
            findedCustomizationSubType?.image;
        }
        return varitionTypeObj;
      }),
    };
  });
};

function sortArrays(arr1, arr2) {
  const sortFunc = (a, b) => {
    if (a.variationId < b.variationId) return -1;
    if (a.variationId > b.variationId) return 1;
    if (a.variationTypeId < b.variationTypeId) return -1;
    if (a.variationTypeId > b.variationTypeId) return 1;
    return 0;
  };

  arr1.sort(sortFunc);
  arr2.sort(sortFunc);
}

const areArraysEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) {
    return false;
  }

  sortArrays(arr1, arr2);

  for (let i = 0; i < arr1.length; i++) {
    if (
      arr1[i].variationId !== arr2[i].variationId ||
      arr1[i].variationTypeId !== arr2[i].variationTypeId
    ) {
      return false;
    }
  }

  return true;
};

const getVariComboPriceQty = (arrayOfCombinations, selectedVariations) => {
  const array1 = selectedVariations.map((item) => {
    return {
      variationId: item.variationId,
      variationTypeId: item.variationTypeId,
    };
  });
  const findedCombination = arrayOfCombinations?.find((combinationsItem) => {
    const array2 = combinationsItem.combination;
    return areArraysEqual(array1, array2);
  });
  return {
    price: findedCombination?.price ? findedCombination?.price : 0,
    quantity: findedCombination?.quantity ? findedCombination?.quantity : 0,
  };
};

const getMinPriceVariCombo = (arrayOfCombinations, key = "price") => {
  if (arrayOfCombinations?.length) {
    const sortedArray = arrayOfCombinations.sort((a, b) => a[key] - b[key]);
    return sortedArray[0];
  }
  return;
};

const getSellingPrice = (price, discount = 0) => {
  const cprice = Number(price);
  const cdiscount = Number(discount);
  const sellingPrice = cprice - (cprice * cdiscount) / 100;
  return Number(helperFunctions.toFixedNumber(sellingPrice));
};

const getCurrentUser = () => {
  const currentUserJson = localStorage.getItem("currentUser");
  const currentUser = JSON.parse(currentUserJson);
  return currentUser;
};

const getStatusCustomBadge = (status) => {
  const statusMap = {
    pending: "orange",
    confirmed: "green",
    shipped: "#58a4bd",
    delivered: "yellow",
    cancelled: "red",
    success: "green",
    failed: "red",
    refunded: "yellow",
    pending_refund: "orange",
    failed_refund: "red",
    cancelled_refund: "red",
    refund_initialization_failed: "red",
    approved: "green",
    rejected: "red",
    received: "green",
  };

  return statusMap[status] || "yellow";
};

const getLightShadeOfColor = (hexCode) => {
  // Function to calculate light shade
  const calculateLightShade = (hex, percent) => {
    const r = parseInt(hex?.substring(1, 3), 16);
    const g = parseInt(hex?.substring(3, 5), 16);
    const b = parseInt(hex?.substring(5, 7), 16);

    const newR = Math.min(255, r + (255 - r) * percent);
    const newG = Math.min(255, g + (255 - g) * percent);
    const newB = Math.min(255, b + (255 - b) * percent);

    return `rgb(${newR | 0}, ${newG | 0}, ${newB | 0})`;
  };

  // Calculate light shade with 20% lightness
  const lightShade = calculateLightShade(hexCode, 0.8);
  return lightShade;
};

const removeLastSegment = (url) => {
  const segments = url.split("/");
  const desiredSubstring = segments.slice(0, segments.length - 1).join("/");
  return desiredSubstring;
};

const sortByField = (array, key = "createdDate") => {
  return array.sort((a, b) => b[key] - a[key]);
};

const getDateFromDayAfter = (dayAfter) => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + dayAfter);
  return tomorrow.toISOString().split("T")[0];
};

const getTodayDate = () => {
  const today = new Date();
  return today.toISOString().split("T")[0];
};

const toFixedNumber = (amount) => {
  amount = amount ? amount : 0;
  return Number(amount).toFixed(2);
};

const getSubTotal = (list) => {
  const total = list.reduce((accumulator, object) => {
    return accumulator + object.quantityWiseSellingPrice;
  }, 0);

  return Number(total);
};

const isReturnValid = (timestamp) => {
  // Validate timestamp format
  if (isNaN(timestamp)) {
    // "Invalid timestamp format. Please provide a valid timestamp."
    return false;
  }

  const today = new Date(); // Get today's date and time
  today.setHours(0, 0, 0, 0); // Set time to 00:00:00.000

  const returnWindow = new Date(timestamp);
  returnWindow.setDate(returnWindow.getDate() + 15); // Add 15 days
  returnWindow.setHours(0, 0, 0, 0); // Set time to 00:00:00.000

  return today <= returnWindow;
};

const isValidKeyName = (arrayOfObjects, keyName) =>
  arrayOfObjects.every((object) => object.hasOwnProperty(keyName));

const calculateRefundAmount = (list) => {
  const total = list?.reduce((accumulator, object) => {
    return accumulator + object.unitAmount;
  }, 0);

  return Number(total);
};

export const helperFunctions = {
  generateUniqueId,
  stringReplacedWithUnderScore,
  stringReplacedWithSpace,
  getRandomValue,
  getVariationsArray,
  getCurrentUser,
  getStatusCustomBadge,
  removeLastSegment,
  sortByField,
  getLightShadeOfColor,
  getDateFromDayAfter,
  getTodayDate,
  toFixedNumber,
  getSubTotal,
  isReturnValid,
  areArraysEqual,
  isValidKeyName,
  calculateRefundAmount,
  getMinPriceVariCombo,
  getVariComboPriceQty,
  getSellingPrice,
};
