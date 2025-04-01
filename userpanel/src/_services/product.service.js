import {
  fetchWrapperService,
  helperFunctions,
  sanitizeValue,
  productsUrl,
} from "../_helper";
import { GOLD_COLOR, GOLD_TYPES } from "../_helper/constants";
import { DIAMONDS_LIST } from "../_helper/diamondsList";
import { collectionService } from "./collection.service";
import { diamondShapeService } from "./diamondShape.service";
import { homeService } from "./home.service";
import { settingStyleService } from "./settingStyle.service";

const productUrl = process.env.NEXT_PUBLIC_PRODUCTS;
const customizationUrl = process.env.NEXT_PUBLIC_CUSTOMIZATION;

const getAllActiveProducts = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const findPattern = {
        url: productUrl,
        key: "active",
        value: true,
      };
      const tempActiveProductData = await fetchWrapperService.find(findPattern);
      const customizations = await productService.getAllCustomizations();
      const collectionData = await collectionService.getAllCollection();
      const settingStyleData = await settingStyleService.getAllSettingStyles();
      const diamondShapeList = await diamondShapeService.getAllDiamondShapes();
      const menuData = await homeService.getAllMenuData();

      const activeProductData = tempActiveProductData?.map((product) => {
        return {
          ...product,
          collectionNames: product?.collectionIds?.map(
            (id) =>
              collectionData.find((collection) => collection?.id === id)?.title
          ),
          settingStyleNamesWithImg: product?.settingStyleIds?.map((id) =>
            settingStyleData.find((style) => style?.id === id)
          ),

          diamondFilters: product.isDiamondFilter ? {
            ...product?.diamondFilters,
            diamondShapes: product?.diamondFilters.diamondShapeIds?.map((shapeId) => {
              const foundedShape = diamondShapeList?.find(
                (shape) => shape?.id === shapeId
              );
              return {
                title: foundedShape?.title,
                image: foundedShape?.image,
                id: foundedShape?.id,
              };
            }),
          } : product?.diamondFilters,
          categoryName: menuData.categories.find(
            (category) => category.id === product.categoryId
          )?.title,
          subCategoryName: menuData.subCategories.find(
            (subCategory) => subCategory.id === product.subCategoryId
          )?.title,
          productTypeNames: product.productTypeIds.map(
            (id) =>
              menuData.productTypes.find(
                (productType) => productType?.id === id
              )?.title
          ),
          variations: helperFunctions.getVariationsArray(
            product.variations,
            customizations
          ),
        };
      });
      resolve(activeProductData);
    } catch (e) {
      reject(e);
    }
  });
};

const getLatestProducts = (length = 8) => {
  return new Promise(async (resolve, reject) => {
    try {
      let allActiveProductsData = await getAllActiveProducts();
      const latestProduct = helperFunctions
        .sortByField(allActiveProductsData)
        .slice(0, length)
        .map((product) => {
          const { price = 0 } = helperFunctions.getMinPriceVariCombo(
            product.variComboWithQuantity
          );
          return {
            productName: product.productName,
            images: product.images.slice(0, 2),
            id: product.id,
            basePrice: price,
            baseSellingPrice: helperFunctions.getSellingPrice(
              price,
              product.discount
            ),
            discount: product.discount,
            goldTypeVariations: product?.variations?.find(
              (x) => x?.variationName.toLowerCase() === GOLD_TYPES.toLowerCase()
            )?.variationTypes,
            goldColorVariations: product?.variations?.find(
              (x) => x?.variationName.toLowerCase() === GOLD_COLOR.toLowerCase()
            )?.variationTypes,
          };
        });
      resolve(latestProduct);
    } catch (e) {
      reject(e);
    }
  });
};

const getAllCustomizations = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const customizationData = await fetchWrapperService.getAll(
        customizationUrl
      );
      const customizationType = customizationData.customizationType
        ? Object.values(customizationData.customizationType)
        : [];
      const customizationSubType = customizationData.customizationSubType
        ? Object.values(customizationData.customizationSubType)
        : [];
      resolve({ customizationType, customizationSubType });
    } catch (e) {
      reject(e);
    }
  });
};

const getCollectionsTypeWiseProduct = (collectionsType, collectionsTitle) => {
  return new Promise(async (resolve, reject) => {
    try {
      collectionsType = sanitizeValue(collectionsType)
        ? collectionsType.trim()
        : null;
      collectionsTitle = sanitizeValue(collectionsTitle)
        ? collectionsTitle.trim()
        : null;
      if (!collectionsType || !collectionsTitle) {
        reject(new Error("Invalid Data"));
        return;
      }
      const allActiveProductsData = await getAllActiveProducts();
      let filteredData = [];
      if (collectionsType === "categories") {
        filteredData = allActiveProductsData.filter(
          (item) =>
            item.categoryName.toLowerCase() === collectionsTitle.toLowerCase()
        );
      } else if (collectionsType === "subCategories") {
        filteredData = allActiveProductsData.filter(
          (item) =>
            item.subCategoryName.toLowerCase() ===
            collectionsTitle.toLowerCase()
        );
      } else if (collectionsType === "productTypes") {
        filteredData = allActiveProductsData.filter(
          (item) =>
            item.productTypeNames?.length &&
            item.productTypeNames.some(
              (name) => name.toLowerCase() === collectionsTitle.toLowerCase()
            )
        );
      } else if (collectionsType === "collection") {
        filteredData = allActiveProductsData.filter(
          (item) =>
            item.collectionNames?.length &&
            item.collectionNames.some(
              (name) => name.toLowerCase() === collectionsTitle.toLowerCase()
            )
        );
      }
      const collectionTypeWiseProductsList = helperFunctions
        .sortByField(filteredData)
        .map((product) => {
          const { price = 0 } = helperFunctions.getMinPriceVariCombo(
            product.variComboWithQuantity
          );

          return {
            productName: product.productName,
            images: product.images.slice(0, 2),
            id: product.id,
            basePrice: price,
            baseSellingPrice: helperFunctions.getSellingPrice(
              price,
              product.discount
            ),
            discount: product.discount,
            variations: product.variations,
            createdDate: product.createdDate,
            goldTypeVariations: product?.variations?.find(
              (x) => x?.variationName.toLowerCase() === GOLD_TYPES.toLowerCase()
            )?.variationTypes,
            goldColorVariations: product?.variations?.find(
              (x) => x?.variationName.toLowerCase() === GOLD_COLOR.toLowerCase()
            )?.variationTypes,
          };
        });
      resolve(collectionTypeWiseProductsList);
    } catch (e) {
      reject(e);
    }
  });
};

const getProcessProducts = async (singleProductData) => {
  try {
    const collectionData = await collectionService.getAllCollection();
    const settingStyleData = await settingStyleService.getAllSettingStyles();
    const menuData = await homeService.getAllMenuData();
    const customizations = await productService.getAllCustomizations();
    let convertedProductData = singleProductData;

    convertedProductData.collectionNames = convertedProductData?.collectionIds?.map(
      (id) => collectionData.find((collection) => collection?.id === id)?.title
    );
    convertedProductData.settingStyleNamesWithImg =
      convertedProductData?.settingStyleIds?.map((id) =>
        settingStyleData.find((style) => style?.id === id)
      );

    convertedProductData.categoryName = menuData.categories.find(
      (category) => category.id === convertedProductData.categoryId
    )?.title;
    convertedProductData.subCategoryName = menuData.subCategories.find(
      (subCategory) => subCategory.id === convertedProductData.subCategoryId
    )?.title;
    convertedProductData.productTypeNames = convertedProductData.productTypeIds.map(
      (id) =>
        menuData.productTypes.find((productType) => productType?.id === id)
          ?.title
    );
    convertedProductData.variations = helperFunctions.getVariationsArray(
      convertedProductData.variations,
      customizations
    );
    return convertedProductData;
  } catch (error) {
    throw error;
  }
};

const getSingleProduct = (productName) => {
  return new Promise(async (resolve, reject) => {
    try {
      productName = sanitizeValue(productName) ? productName.trim() : null;
      if (productName) {
        const singleProductData = await fetchWrapperService.findOne(
          productUrl,
          { productName }
        );
        if (singleProductData) {
          const processedProductData = await getProcessProducts(singleProductData);
          resolve(processedProductData);
        } else {
          reject(new Error("Product does not exist"));
        }
      } else {
        reject(new Error("Invalid data"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getReletedProducts = (productName) => {
  return new Promise(async (resolve, reject) => {
    try {
      productName = sanitizeValue(productName) ? productName.trim() : null;

      if (productName) {
        const productData = await fetchWrapperService.findOne(productUrl, {
          productName,
        });

        if (productData) {
          const allActiveProductsData = await getAllActiveProducts();

          const relatedProducts = allActiveProductsData?.filter(
            (x) => x?.categoryId === productData?.categoryId
          );

          const reletedProductsWithoutCurrentProduct = relatedProducts?.filter(
            (product) =>
              product.productName.toLowerCase() !== productName.toLowerCase()
          );

          const sortedReletedProductData = helperFunctions
            .sortByField(reletedProductsWithoutCurrentProduct)
            .slice(0, 8)
            .map((product) => {
              const { price = 0 } = helperFunctions.getMinPriceVariCombo(
                product.variComboWithQuantity
              );
              return {
                productName: product.productName,
                images: product.images.slice(0, 2),
                id: product.id,
                basePrice: price,
                baseSellingPrice: helperFunctions.getSellingPrice(
                  price,
                  product.discount
                ),
                discount: product.discount,
                goldTypeVariations: product?.variations?.find(
                  (x) =>
                    x?.variationName.toLowerCase() === GOLD_TYPES.toLowerCase()
                )?.variationTypes,
                goldColorVariations: product?.variations?.find(
                  (x) =>
                    x?.variationName.toLowerCase() === GOLD_COLOR.toLowerCase()
                )?.variationTypes,
              };
            });
          resolve(sortedReletedProductData);
        } else {
          reject(new Error("Product does not exist"));
        }
      } else {
        reject(new Error("Invalid data"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getFilteredDiamondProducts = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        diamondId,
        selectedProductTypes,
        selectedCollections,
        selectedSettingStyles,
        selectedVariations,
        priceRangeValues,
      } = params || {};

      let allActiveProductsData = await getAllActiveProducts();
      const diamondFilteredProducts = allActiveProductsData.filter(
        (x) => x?.isDiamondFilter
      );
      let filteredProducts = diamondFilteredProducts;
      if (diamondId) {
        const selectedDiamond = DIAMONDS_LIST?.find(
          (diamond) => Number(diamond.id) === Number(diamondId)
        );

        if (!selectedDiamond) {
          reject(new Error("Diamond not found"));
          return;
        }

        filteredProducts = diamondFilteredProducts.filter((product) => {
          const { diamondFilters } = product || {};

          const isCaratRangeValid =
            diamondFilters?.caratWeightRange &&
            (diamondFilters?.caratWeightRange.min <= selectedDiamond?.size ||
              diamondFilters?.caratWeightRange.max <= selectedDiamond?.size);

          const isShapeValid =
            diamondFilters?.diamondShapes?.length &&
            diamondFilters?.diamondShapes.some(
              (shape) =>
                shape?.title?.toLowerCase() === selectedDiamond?.shape?.toLowerCase()
            );

          return isCaratRangeValid && isShapeValid;
        });
      }

      const tempProductTypes = [];
      const tempCollections = [];
      const tempSettingStyles = [];
      const tempPriceRange = [];
      const uniqueVariations = [];

      filteredProducts.forEach((element) => {
        const productTypeItems = element?.productTypeNames;
        const collectionItems = element?.collectionNames;
        const settingStylesItem = element?.settingStyleNamesWithImg;
        const variComboWithQtyItems = element?.variComboWithQuantity;
        const variationItems = element?.variations;
        if (productTypeItems?.length)
          tempProductTypes.push(...productTypeItems);

        if (collectionItems?.length) tempCollections.push(...collectionItems);
        if (settingStylesItem?.length)
          tempSettingStyles.push(...settingStylesItem);
        if (variComboWithQtyItems?.length) {
          const prices = variComboWithQtyItems.map((combo) => combo.price || 0);
          tempPriceRange.push(...prices);
        }
        variationItems.forEach((variation) => {
          let existingVariationIndex = uniqueVariations.findIndex(
            (item) => item.variationId === variation.variationId
          );

          if (existingVariationIndex === -1) {
            let newVariation = {
              variationName: variation.variationName,
              variationId: variation.variationId,
              type: variation.variationTypes[0]?.type,
              variationTypes: variation.variationTypes.map((variationType) => ({
                variationTypeName: variationType.variationTypeName,
                variationTypeId: variationType.variationTypeId,
                variationTypeHexCode: variationType?.variationTypeHexCode,
                variationTypeImage: variationType?.variationTypeImage,
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
                  variationTypeHexCode: variationType?.variationTypeHexCode,
                  variationTypeImage: variationType?.variationTypeImage,
                });
              }
            });
          }
        });
      });

      const filteredDiamondProducts = helperFunctions
        .sortByField(filteredProducts)
        .filter((product) => {
          // Filter by product type
          const isProductTypeValid = selectedProductTypes?.length
            ? selectedProductTypes.some((type) =>
              product?.productTypeNames.includes(type?.value)
            )
            : true;

          // Filter by collection
          const isCollectionValid = selectedCollections?.length
            ? selectedCollections.some((collection) =>
              product?.collectionNames?.includes(collection?.value)
            )
            : true;

          // Filter by setting style
          const settingStyleNames = product?.settingStyleNamesWithImg?.map(
            (x) => x?.title
          );
          const isSettingStyleValid = selectedSettingStyles?.length
            ? selectedSettingStyles.some((style) =>
              settingStyleNames?.includes(style?.value)
            )
            : true;

          // Filter by variations
          const isVariationValid = selectedVariations?.length
            ? selectedVariations.every((selectedVariation) => {
              const productVariation = product?.variations?.find(
                (v) =>
                  v?.variationName.toLowerCase() ===
                  selectedVariation.title.toLowerCase()
              );

              if (!productVariation) return false;

              // Check if any selected value matches the product's variation types
              return selectedVariation.selectedValues.length
                ? selectedVariation.selectedValues.some((selectedValue) =>
                  productVariation.variationTypes.some(
                    (variationType) =>
                      variationType.variationTypeName.toLowerCase() ===
                      selectedValue.value.toLowerCase()
                  )
                )
                : true;
            })
            : true;

          // Filter by price range
          const productPrices = product?.variComboWithQuantity.map(
            (combo) => combo.price || 0
          );
          const isPriceValid = priceRangeValues?.length
            ? productPrices.some(
              (price) =>
                price >= (priceRangeValues[0] || 0) &&
                price <= (priceRangeValues[1] || Infinity)
            )
            : true;

          return (
            product?.isDiamondFilter &&
            isProductTypeValid &&
            isCollectionValid &&
            isSettingStyleValid &&
            isVariationValid &&
            isPriceValid
          );
        });

      const processedDiamondProducts = filteredDiamondProducts.map(
        (product) => {
          const { price = 0 } = helperFunctions.getMinPriceVariCombo(
            product.variComboWithQuantity
          );
          return {
            productName: product.productName,
            images: product.images.slice(0, 2),
            id: product.id,
            basePrice: price,
            baseSellingPrice: helperFunctions.getSellingPrice(
              price,
              product.discount
            ),
            discount: product.discount,
            goldTypeVariations: product?.variations?.find(
              (x) => x?.variationName.toLowerCase() === GOLD_TYPES.toLowerCase()
            )?.variationTypes,
            goldColorVariations: product?.variations?.find(
              (x) => x?.variationName.toLowerCase() === GOLD_COLOR.toLowerCase()
            )?.variationTypes,
          };
        }
      );

      // Get the minimum and maximum price for the availablePriceRange
      const minPrice = Math.min(...tempPriceRange);
      const maxPrice = Math.max(...tempPriceRange);
      const uniqueSettingStyles = tempSettingStyles
        .filter(
          (item, index, self) =>
            index === self.findIndex((t) => t.title === item.title)
        )
        .map((x) => {
          return {
            title: x?.title,
            value: x?.title,
            image: x?.image,
          };
        });

      const metaData = {
        availablePriceRange: [minPrice, maxPrice],
        uniqueProductTypes: [...new Set(tempProductTypes)],
        uniqueCollections: [...new Set(tempCollections)],
        uniqueSettingStyles,
        uniqueVariations,
      };
      resolve({
        diamondProducts: processedDiamondProducts,
        metaData,
      });
    } catch (e) {
      console.log(e?.message, "error message");
      reject(e);
    }
  });
};

const getSingleProductDataById = async ({ productId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      productId = sanitizeValue(productId)
        ? productId.trim()
        : null;
      if (!productId) {
        reject(new Error("Invalid Data"));
        return;
      }
      const productFindPattern = { id: productId };

      const singleProductData = await fetchWrapperService.findOne(
        productsUrl,
        productFindPattern
      );
      if (!singleProductData) {
        reject(new Error("Product does not exist"));
        return;
      }
      const processedProductData = await getProcessProducts(singleProductData);
      resolve(processedProductData);
    } catch (e) {
      reject(e);
    }
  });
};

export const productService = {
  getAllActiveProducts,
  getLatestProducts,
  getAllCustomizations,
  getCollectionsTypeWiseProduct,
  getSingleProduct,
  getReletedProducts,
  getFilteredDiamondProducts,
  getSingleProductDataById,
  getProcessProducts
};