import {
  setCollectionTypeProductList,
  setLatestProductList,
  setProductDetail,
  setProductLoading,
  setRecentlyProductLoading,
  setRecentlyViewProductList,
  setUniqueFilterOptions,
} from "@/store/slices/productSlice";
import { productService, recentlyViewedService } from "@/_services";

export const fetchLatestProductList = (length) => {
  return async (dispatch) => {
    try {
      dispatch(setProductLoading(true));

      const latestProductList = await productService.getLatestProducts(length);
      if (latestProductList) {
        dispatch(setLatestProductList(latestProductList));
      }
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(setProductLoading(false));
    }
  };
};

export const fetchCollectionsTypeWiseProduct = (
  collectionType,
  collectionTitle
) => {
  return async (dispatch) => {
    try {
      dispatch(setCollectionTypeProductList([]));
      dispatch(setProductLoading(true));
      const collectionsTypeWiseProductList =
        await productService.getCollectionsTypeWiseProduct(
          collectionType,
          collectionTitle
        );
      if (collectionsTypeWiseProductList) {
        const tempUniqueFilterOptions = getUniqueFilterOptions(collectionsTypeWiseProductList)
        const uniqueFilterOptions = { ...tempUniqueFilterOptions }
        dispatch(setUniqueFilterOptions(uniqueFilterOptions));
        dispatch(setCollectionTypeProductList(collectionsTypeWiseProductList));
        dispatch(setProductLoading(false));
      }
    } catch (e) {
      dispatch(setCollectionTypeProductList([]));
    } finally {
      dispatch(setProductLoading(false));
    }
  };
};

export const fetchProductDetailByProductName = (productName) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setProductDetail({}));
      dispatch(setProductLoading(true));

      const productDetail = await productService.getSingleProduct(productName);

      if (productDetail) {
        dispatch(setProductDetail(productDetail));
        dispatch(setProductLoading(false));
        return productDetail;
      }
    } catch (e) {
      dispatch(setProductDetail({}));
      dispatch(setProductLoading(false));
    }
  };
};

const getUniqueFilterOptions = (productList) => {
  const uniqueVariations = new Map(); // Use Map for O(1) lookups
  const tempSettingStyles = [];

  // Process each product
  productList.forEach((product) => {
    // Handle setting styles
    const settingStyles = product?.settingStyleNamesWithImg;
    if (settingStyles?.length) {
      tempSettingStyles.push(...settingStyles);
    }

    // Handle variations
    product.variations.forEach((variation) => {
      const { variationId, variationName, variationTypes } = variation;

      if (!uniqueVariations.has(variationId)) {
        // New variation: initialize with mapped variation types
        uniqueVariations.set(variationId, {
          variationName,
          variationId,
          variationTypes: new Map(
            variationTypes.map((type) => [
              type.variationTypeId,
              {
                variationTypeName: type.variationTypeName,
                variationTypeId: type.variationTypeId,
                variationTypeHexCode: type.variationTypeHexCode ?? undefined,
              },
            ])
          ),
        });
      } else {
        // Existing variation: add new variation types
        const existingVariation = uniqueVariations.get(variationId);
        variationTypes.forEach((type) => {
          if (!existingVariation.variationTypes.has(type.variationTypeId)) {
            existingVariation.variationTypes.set(type.variationTypeId, {
              variationTypeName: type.variationTypeName,
              variationTypeId: type.variationTypeId,
              variationTypeHexCode: type.variationTypeHexCode ?? undefined,
            });
          }
        });
      }
    });
  });

  // Convert uniqueVariations Map to array
  const variationsArray = Array.from(uniqueVariations.values()).map((variation) => ({
    ...variation,
    variationTypes: Array.from(variation.variationTypes.values()),
  }));

  // Process unique setting styles with Set for uniqueness
  const uniqueSettingStyles = Array.from(
    new Set(tempSettingStyles.map((item) => item.title))
  ).map((title) => {
    const { image, id } = tempSettingStyles.find((item) => item.title === title) || {};
    return { title, value: id, image };
  });

  return {
    uniqueVariations: variationsArray,
    uniqueSettingStyles,
  };
}

// export const fetchReletedProducts = (productName) => {
//   return async (dispatch, getState) => {
//     try {
//       dispatch({
//         type: actionTypes.START_LOADING,
//         loaderId: "fetchDataLoader",
//       });

//       const reletedProductsList = await productService.getReletedProducts(
//         productName
//       );
//       dispatch({
//         type: actionTypes.STOP_LOADING,
//         loaderId: "fetchDataLoader",
//       });
//       if (reletedProductsList) {
//         dispatch({
//           type: actionTypes.FETCH_RELETED_PRODUCT,
//           reletedProductsList,
//         });
//       }
//     } catch (e) {
//       dispatch({
//         type: actionTypes.FETCH_RELETED_PRODUCT,
//         reletedProductsList: [],
//       });
//       dispatch({
//         type: actionTypes.STOP_LOADING,
//         loaderId: "fetchDataLoader",
//       });
//     }
//   };
// };

export const fetchRecentlyViewedProducts = () => {
  return async (dispatch, getState) => {
    try {
      dispatch(setRecentlyProductLoading(true));
      const recentlyViewedProductsList =
        await recentlyViewedService.getAllRecentlyViewedWithProduct();

      if (recentlyViewedProductsList) {
        dispatch(setRecentlyViewProductList(recentlyViewedProductsList))
      }
    } catch (e) {
      dispatch(setRecentlyViewProductList([]))
    } finally {
      dispatch(setRecentlyProductLoading(false));
    }
  };
};

export const addUpdateRecentlyViewedProducts = (params) => {
  return async (dispatch, getState) => {
    try {
      dispatch(setRecentlyProductLoading(true));

      await recentlyViewedService.addUpdateRecentlyViewed(params);

      const recentlyViewedProductsList =
        await recentlyViewedService.getAllRecentlyViewedWithProduct();

      if (recentlyViewedProductsList) {
        dispatch(setRecentlyViewProductList(recentlyViewedProductsList))
      }
    } catch (e) {
      dispatch(setRecentlyViewProductList([]))
    } finally {
      dispatch(setRecentlyProductLoading(false));
    }
  };
};

// export const fetchSingleProductDataById = (productId) => {
//   return async (dispatch, getState) => {
//     try {
//       dispatch({
//         type: actionTypes.FETCH_SINGLE_PRODUCT_LOADER,
//         singleProductDataById: {},
//         isLoading: true,
//       });
//       const singleProductDataById = await productService?.getSingleProductDataById({ productId });

//       if (singleProductDataById) {
//         dispatch({
//           type: actionTypes.FETCH_SINGLE_PRODUCT_DATA_BY_ID,
//           singleProductDataById,
//         });
//         return singleProductDataById;
//       }
//     } catch (e) {
//       dispatch({
//         type: actionTypes.FETCH_SINGLE_PRODUCT_DATA_BY_ID,
//         singleProductDataById: {},
//       });
//     }
//   };
// };
