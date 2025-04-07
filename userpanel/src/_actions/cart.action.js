import {
  setCartLoading,
  setCartList,
  setSelectedCartItem,
  setProductHasInsertedIntoCart,
  setProductQuantityHasUpdatedIntoCart,
  setCartErrorMessage,
  setUpdateCartQtyErrorMessage,
  setRemoveCartErrorMessage,
} from "@/store/slices/cartSlice";
import { cartService } from "@/_services";

export const fetchCart = () => {
  return async (dispatch) => {
    try {
      dispatch(setCartLoading(true));

      const cartData = await cartService.getAllCartWithProduct();
      if (cartData) {
        dispatch(setCartList(cartData));
      }
    } catch (e) {
      console.error(e);
    } finally {
      dispatch(setCartLoading(false));
    }
  };
};

export const insertProductIntoCart = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(setCartErrorMessage(""));
      dispatch(setCartLoading(true));
      dispatch(setProductHasInsertedIntoCart(false));
      const createdCartItem = await cartService.insertProductIntoCart(payload);

      if (createdCartItem) {
        dispatch(setProductHasInsertedIntoCart(true));
        dispatch(fetchCart());
        return createdCartItem;
      }
    } catch (err) {
      const cartErrorMessage = err?.message || "Something went wrong";
      dispatch(setCartErrorMessage(cartErrorMessage));
    } finally {
      dispatch(setCartLoading(false));
    }
  };
};

export const removeProductIntoCart = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(setRemoveCartErrorMessage(""));
      dispatch(setCartLoading(true));

      // Call API
      const isRemovedFromCart = await cartService.removeProductIntoCart(
        payload
      );

      // Handle response
      if (isRemovedFromCart) {
        dispatch(fetchCart()); // Refresh cart after removal
        return true;
      }
    } catch (err) {
      const removeCartErrorMessage = err?.message || "Something went wrong";
      dispatch(setRemoveCartErrorMessage(removeCartErrorMessage));
    } finally {
      dispatch(setCartLoading(false));
    }
  };
};

export const handleSelectCartItem = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(setCartLoading(true));

      dispatch(setSelectedCartItem(payload.selectedCartItem));
    } catch (error) {
      console.error("Error selecting cart item:", error);
    } finally {
      dispatch(setCartLoading(false));
    }
  };
};

export const updateProductQuantityIntoCart = (payload) => {
  return async (dispatch) => {
    try {
      dispatch(setUpdateCartQtyErrorMessage("")); // Clear previous errors
      dispatch(setCartLoading(true));
      dispatch(setProductQuantityHasUpdatedIntoCart(false));

      const isUpdated = await cartService.updateProductQuantityIntoCart(
        payload
      );

      if (isUpdated) {
        dispatch(fetchCart());
        dispatch(setProductQuantityHasUpdatedIntoCart(true));
      }
    } catch (err) {
      console.error("Error updating product quantity:", err);
      dispatch(
        setUpdateCartQtyErrorMessage(err.message || "Something went wrong")
      );
    } finally {
      dispatch(setCartLoading(false));
    }
  };
};

// export const insertProductIntoCart = (payload) => {
//   return async (dispatch) => {
//     try {
//       dispatch({ type: actionTypes.CREATE_CART_ERROR, cartErrorMessage: "" });
//       dispatch(handleCreateCartLoader({ addLoader: true }));
//       dispatch(
//         handleProductHasInsertedIntoCart({
//           isProductHasInsertedIntoCart: false,
//         })
//       );

//       const createdCartItem = await cartService.insertProductIntoCart(payload);
//       dispatch(handleCreateCartLoader({ addLoader: false }));

//       if (createdCartItem) {
//         dispatch({ type: actionTypes.CREATE_CART, cart: createdCartItem });
//         dispatch(
//           handleProductHasInsertedIntoCart({
//             isProductHasInsertedIntoCart: true,
//           })
//         );
//         return true;
//       }
//     } catch (err) {
//       dispatch(handleCreateCartLoader({ addLoader: false }));
//       const cartErrorMessage = err?.message || "something went wrong";
//       dispatch({ type: actionTypes.CREATE_CART_ERROR, cartErrorMessage });
//     }
//   };
// };

// export const insertMultipleProductsIntoCart = (payload) => {
//   return async (dispatch, getState) => {
//     try {
//       const createdOrUpdateCartData =
//         await cartService.insertMultipleProductsIntoCart(payload);

//       if (createdOrUpdateCartData.length) {
//         return true;
//       }
//     } catch (err) {
//       const errorMessage = err.message || "something went wrong";
//       console.log("insert multiple cart : ", errorMessage);
//     }
//   };
// };

// export const handleCreateCartLoader = (payload) => {
//   return async (dispatch, getState) => {
//     dispatch({
//       type: actionTypes.HANDLE_CREATE_CART_LOADER,
//       addLoader: payload.addLoader,
//     });
//   };
// };
// export const handleProductHasInsertedIntoCart = (payload) => {
//   return async (dispatch, getState) => {
//     dispatch({
//       type: actionTypes.HANDLE_CREATE_CART_RESPONSE,
//       isProductHasInsertedIntoCart: payload.isProductHasInsertedIntoCart,
//     });
//   };
// };

// export const updateProductQuantityIntoCart = (payload) => {
//   return async (dispatch, getState) => {
//     try {
//       dispatch({
//         type: actionTypes.UPDATE_CART_QUANTITY_ERROR,
//         updateCartQtyErrorMessage: "",
//       });
//       dispatch(
//         handleProductQuantityHasUpdatedIntoCart({
//           isProductQuantityHasUpdatedIntoCart: false,
//         })
//       );

//       const isUpdateProductQuantityIntoCart =
//         await cartService.updateProductQuantityIntoCart(payload);

//       if (isUpdateProductQuantityIntoCart) {
//         dispatch({ type: actionTypes.UPDATE_CART_QUANTITY, cart: payload });
//         dispatch(
//           handleProductQuantityHasUpdatedIntoCart({
//             isProductQuantityHasUpdatedIntoCart: true,
//           })
//         );
//       }
//     } catch (err) {
//       const updateCartQtyErrorMessage = err.message || "something went wrong";
//       dispatch({
//         type: actionTypes.UPDATE_CART_QUANTITY_ERROR,
//         updateCartQtyErrorMessage,
//       });
//     }
//   };
// };

// export const handleProductQuantityHasUpdatedIntoCart = (payload) => {
//   return async (dispatch, getState) => {
//     dispatch({
//       type: actionTypes.HANDLE_UPDATE_CART_QUANTITY_RESPONSE,
//       isProductQuantityHasUpdatedIntoCart:
//         payload.isProductQuantityHasUpdatedIntoCart,
//     });
//   };
// };

// export const handleSelectCartItem = (payload) => {
//   return async (dispatch, getState) => {
//     dispatch({
//       type: actionTypes.HANDLE_SELECT_CART_ITEM,
//       selectedCartItem: payload.selectedCartItem,
//     });
//   };
// };

// export const removeProductIntoCart = (payload) => {
//   return async (dispatch, getState) => {
//     try {
//       dispatch({
//         type: actionTypes.REMOVE_CART_ERROR,
//         removeCartErrorMessage: "",
//       });
//       dispatch({
//         type: actionTypes.START_LOADING,
//         loaderId: "fetchDataLoader",
//       });

//       const isRemovedFromCart = await cartService.removeProductIntoCart(
//         payload
//       );
//       dispatch({
//         type: actionTypes.STOP_LOADING,
//         loaderId: "fetchDataLoader",
//       });
//       if (isRemovedFromCart) {
//         dispatch({ type: actionTypes.REMOVE_CART, cartId: payload.cartId });
//       }
//     } catch (err) {
//       const removeCartErrorMessage = err?.message || "something went wrong";
//       dispatch({ type: actionTypes.REMOVE_CART_ERROR, removeCartErrorMessage });
//       dispatch({
//         type: actionTypes.STOP_LOADING,
//         loaderId: "fetchDataLoader",
//       });
//     }
//   };
// };
