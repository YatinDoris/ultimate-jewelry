import { setLatestProductList, setProductLoading } from "@/store/slices/productSlice";
import { productService } from "@/_services";

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

// export const fetchCollectionsTypeWiseProduct = (
//   collectionsType,
//   collectionsTitle
// ) => {
//   return async (dispatch, getState) => {
//     try {
//       dispatch({
//         type: actionTypes.FETCH_COLLECTIONS_TYPES_WISE_PRODUCT,
//         collectionsTypeWiseProductList: [],
//         collectionTypeWiseProductLoader: true,
//       });
//       const collectionsTypeWiseProductList =
//         await productService.getCollectionsTypeWiseProduct(
//           collectionsType,
//           collectionsTitle
//         );
//       if (collectionsTypeWiseProductList) {
//         dispatch({
//           type: actionTypes.FETCH_COLLECTIONS_TYPES_WISE_PRODUCT,
//           collectionsTypeWiseProductList,
//         });
//       }
//     } catch (e) {
//       dispatch({
//         type: actionTypes.FETCH_COLLECTIONS_TYPES_WISE_PRODUCT,
//         collectionsTypeWiseProductList: [],
//       });
//     }
//   };
// };

// export const fetchProductDetailByProductName = (productName) => {
//   return async (dispatch, getState) => {
//     try {
//       dispatch({
//         type: actionTypes.FETCH_PRODUCT_DETAIL,
//         productDetail: {},
//         isLoading: true,
//       });
//       const productDetail = await productService.getSingleProduct(productName);

//       if (productDetail) {
//         dispatch({ type: actionTypes.FETCH_PRODUCT_DETAIL, productDetail });
//         return productDetail;
//       }
//     } catch (e) {
//       dispatch({ type: actionTypes.FETCH_PRODUCT_DETAIL, productDetail: {} });
//     }
//   };
// };

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

// export const fetchRecentlyViewedProducts = () => {
//   return async (dispatch, getState) => {
//     try {
//       dispatch({
//         type: actionTypes.RECENTLY_VIEWED_LOADER,
//         payload: true,
//       });
//       const recentlyViewedProductsList =
//         await recentlyViewedService.getAllRecentlyViewedWithProduct();
//       if (recentlyViewedProductsList) {
//         dispatch({
//           type: actionTypes.FETCH_RECENTLY_VIEWED_PRODUCT,
//           recentlyViewedProductsList: recentlyViewedProductsList,
//         });
//       }
//     } catch (e) {
//       dispatch({
//         type: actionTypes.FETCH_RECENTLY_VIEWED_PRODUCT,
//         recentlyViewedProductsList: [],
//       });
//     } finally {
//       dispatch({
//         type: actionTypes.RECENTLY_VIEWED_LOADER,
//         payload: false,
//       });
//     }
//   };
// };

// export const addUpdateRecentlyViewedProducts = (params) => {
//   return async (dispatch, getState) => {
//     try {
//       dispatch({
//         type: actionTypes.RECENTLY_VIEWED_LOADER,
//         payload: true,
//       });

//       await recentlyViewedService.addUpdateRecentlyViewed(params);

//       const recentlyViewedProductsList =
//         await recentlyViewedService.getAllRecentlyViewedWithProduct();

//       if (recentlyViewedProductsList) {
//         dispatch({
//           type: actionTypes.FETCH_RECENTLY_VIEWED_PRODUCT,
//           recentlyViewedProductsList: recentlyViewedProductsList,
//         });
//       }
//     } catch (e) {
//       dispatch({
//         type: actionTypes.FETCH_RECENTLY_VIEWED_PRODUCT,
//         recentlyViewedProductsList: [],
//       });
//     } finally {
//       dispatch({
//         type: actionTypes.RECENTLY_VIEWED_LOADER,
//         payload: false,
//       });
//     }
//   };
// };

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
