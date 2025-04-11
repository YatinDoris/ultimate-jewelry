import { uid } from "uid";
import {
  cartsUrl,
  fetchWrapperService,
  helperFunctions,
  productsUrl,
  sanitizeObject,
} from "../_helper";
import { productService } from "./product.service";

const getAllCartWithProduct = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const userData = helperFunctions.getCurrentUser();
      let cartData = [];
      if (userData) {
        const findPattern = {
          url: cartsUrl,
          key: "userId",
          value: userData.id,
        };
        cartData = await fetchWrapperService.find(findPattern);
      } else {
        cartData = getCartItemOnOffline();
      }
      const allActiveProductsData = await productService.getAllActiveProducts();
      const customizations = await productService.getAllCustomizations();
      const cartDataWithProduct = cartData.map((cartItem) => {
        const findedProduct = allActiveProductsData.find(
          (product) => product.id === cartItem.productId
        );
        if (findedProduct) {
          const variationArray = cartItem.variations.map((variItem) => {
            const findedCustomizationType =
              customizations.customizationSubType.find(
                (x) => x.id === variItem.variationTypeId
              );
            return {
              ...variItem,
              variationName: customizations.customizationType.find(
                (x) => x.id === variItem.variationId
              ).title,
              variationTypeName: findedCustomizationType.title,
            };
          });
          const { quantity, price } = helperFunctions.getVariComboPriceQty(
            findedProduct.variComboWithQuantity,
            variationArray
          );
          return {
            ...cartItem,
            productName: findedProduct.productName,
            productImage: findedProduct.images[0].image,
            productQuantity: quantity,
            quantityWisePrice: price * cartItem.quantity,
            quantityWiseSellingPrice:
              helperFunctions.getSellingPrice(price, findedProduct.discount) *
              cartItem.quantity,
            productDiscount: findedProduct.discount,
            variations: variationArray,
          };
        } else return cartItem;
      });

      resolve(cartDataWithProduct);
    } catch (e) {
      reject(e);
    }
  });
};

const insertProductIntoCart = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const uuid = uid();
      let { productId, quantity, variations } = sanitizeObject(params);

      productId = productId ? productId.trim() : null;
      quantity = quantity ? Number(quantity) : 0;
      variations = Array.isArray(variations) ? variations : [];
      if (productId && variations.length && quantity && uuid) {
        const productData = await fetchWrapperService.findOne(productsUrl, {
          id: productId,
        });
        if (productData) {
          if (!isValidVariationsArray(productData.variations, variations)) {
            reject(
              new Error(
                "Invalid variation or variation does not exits in this product"
              )
            );
            return;
          }
          const { quantity: availableQty } =
            helperFunctions.getVariComboPriceQty(
              productData.variComboWithQuantity,
              variations
            );
          if (quantity <= 0 || quantity > availableQty) {
            reject(new Error("Invalid cart quantity!"));
            return;
          }
          const cartData = await cartService.getAllCartWithProduct();
          const filteredData = cartData.filter((cartItem) => {
            // Check if the product id matches
            if (cartItem.productId === productId) {
              // Check if all variations exist in the cartItem's variations array
              return variations.every((variant) => {
                return cartItem.variations.some((itemVariant) => {
                  return (
                    itemVariant.variationId === variant.variationId &&
                    itemVariant.variationTypeId === variant.variationTypeId
                  );
                });
              });
            }
            return false;
          });
          if (filteredData.length) {
            reject(new Error("product already exits in cart"));
            return;
          }

          let insertPattern = {
            id: uuid,
            productId,
            quantity,
            variations,
            createdDate: Date.now(),
            updatedDate: Date.now(),
          };
          const userData = helperFunctions.getCurrentUser();
          if (userData) {
            insertPattern.userId = userData.id;
            const createPattern = {
              url: `${cartsUrl}/${uuid}`,
              insertPattern: insertPattern,
            };
            fetchWrapperService
              .create(createPattern)
              .then((response) => {
                resolve(insertPattern);
              })
              .catch((e) => {
                reject(new Error("An error occurred during cart creation."));
              });
          } else {
            localStorage.setItem(
              "cart",
              JSON.stringify([...cartData, insertPattern])
            );
            resolve(insertPattern);
          }
        } else {
          reject(new Error("product data not found!"));
        }
      } else {
        reject(new Error("Invalid Data"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const insertMultipleProductsIntoCart = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { cartData } = sanitizeObject(params);
      cartData = Array.isArray(cartData) ? cartData : [];
      const userData = helperFunctions.getCurrentUser();
      const createdOrUpdateCartData = [];

      if (userData) {
        if (cartData.length) {
          for (let i = 0; i < cartData.length; i++) {
            const element = cartData[i];
            let { productId, quantity, variations } = element;

            productId = productId ? productId.trim() : null;
            quantity = quantity ? Number(quantity) : 0;
            variations = Array.isArray(variations) ? variations : [];

            if (productId && variations.length && quantity) {
              fetchWrapperService
                .findOne(productsUrl, { id: productId })
                .then((productData) => {
                  if (productData) {
                    if (
                      isValidVariationsArray(productData.variations, variations)
                    ) {
                      const { quantity: availableQty } =
                        helperFunctions.getVariComboPriceQty(
                          productData.variComboWithQuantity,
                          variations
                        );
                      if (quantity > 0 && availableQty >= quantity) {
                        cartService
                          .getAllCartWithProduct()
                          .then((userWiseCartData) => {
                            const filteredData = userWiseCartData.filter(
                              (cartItem) => {
                                // Check if the product id matches
                                if (cartItem.productId === productId) {
                                  // Check if all variations exist in the cartItem's variations array
                                  return variations.every((variant) => {
                                    return cartItem.variations.some(
                                      (itemVariant) => {
                                        return (
                                          itemVariant.variationId ===
                                            variant.variationId &&
                                          itemVariant.variationTypeId ===
                                            variant.variationTypeId
                                        );
                                      }
                                    );
                                  });
                                }
                                return false;
                              }
                            );
                            if (filteredData.length) {
                              const cartId = filteredData[0].id;
                              const payload = {
                                quantity:
                                  Number(filteredData[0].quantity) +
                                  Number(quantity),
                              };
                              const updatePattern = {
                                url: `${cartsUrl}/${cartId}`,
                                payload: payload,
                              };
                              fetchWrapperService
                                ._update(updatePattern)
                                .then((response) => {
                                  const updatedData = {
                                    ...filteredData[0],
                                    quantity:
                                      Number(filteredData[0].quantity) +
                                      Number(quantity),
                                  };
                                  createdOrUpdateCartData.push(updatedData);
                                  sendResponse();
                                })
                                .catch((e) => {
                                  //   reject(
                                  //     new Error(
                                  //       "An error occurred during update cart."
                                  //     )
                                  //   );
                                  sendResponse();
                                });
                            } else {
                              const uuid = uid();
                              const insertPattern = {
                                id: uuid,
                                userId: userData.id,
                                productId,
                                quantity,
                                variations,
                                createdDate: Date.now(),
                                updatedDate: Date.now(),
                              };

                              const createPattern = {
                                url: `${cartsUrl}/${uuid}`,
                                insertPattern: insertPattern,
                              };
                              fetchWrapperService
                                .create(createPattern)
                                .then((response) => {
                                  createdOrUpdateCartData.push(insertPattern);
                                  sendResponse();
                                })
                                .catch((e) => {
                                  // reject(
                                  //   new Error("An error occurred during cart creation.")
                                  // );
                                  sendResponse();
                                });
                            }
                          })
                          .catch((e) => {
                            // An error occurred during find cart data.
                            sendResponse();
                          });
                      } else {
                        //  reject(new Error("Invalid quantity!"));
                        sendResponse();
                      }
                    } else {
                      //  Invalid variation or variation does not exits in this product
                      sendResponse();
                    }
                  } else {
                    // product data not found!
                    sendResponse();
                  }
                })
                .catch((e) => {
                  // An error occurred during find product data.
                  sendResponse();
                });
            } else {
              // Invalid Data.
              sendResponse();
            }

            function sendResponse() {
              if (i === cartData.length - 1) {
                resolve({ createdOrUpdateCartData });
              }
            }
          }
        } else {
          reject(new Error("Invalid Data"));
        }
      } else {
        reject(new Error("unauthorized"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateProductQuantityIntoCart = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { cartId, quantity } = sanitizeObject(params);

      cartId = cartId ? cartId.trim() : null;
      quantity = quantity ? Number(quantity) : 0;

      if (cartId && quantity) {
        const allCartData = await cartService.getAllCartWithProduct();
        const index = allCartData.findIndex(
          (cartItem) => cartItem.id === cartId
        );
        const cartDetail = allCartData[index];
        if (cartDetail) {
          if (
            quantity <= 0 ||
            quantity > 5 ||
            quantity > cartDetail.productQuantity
          ) {
            reject(new Error("Invalid cart quantity!"));
            return;
          }
          const userData = helperFunctions.getCurrentUser();
          if (userData) {
            const cartId = cartDetail.id;
            const payload = {
              quantity: quantity,
            };
            const updatePattern = {
              url: `${cartsUrl}/${cartId}`,
              payload: payload,
            };
            fetchWrapperService
              ._update(updatePattern)
              .then((response) => {
                resolve(true);
              })
              .catch((e) => {
                reject(new Error("An error occurred during update cart."));
              });
          } else {
            allCartData[index].quantity = quantity;
            localStorage.setItem("cart", JSON.stringify(allCartData));
            resolve(true);
          }
        } else {
          reject(new Error("cart data not found!"));
        }
      } else {
        reject(new Error("Invalid Data"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const removeProductIntoCart = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { cartId } = sanitizeObject(params);
      if (cartId) {
        const allCartData = await cartService.getAllCartWithProduct();
        const cartDetail = allCartData.find(
          (cartItem) => cartItem.id === cartId
        );
        if (cartDetail) {
          const userData = helperFunctions.getCurrentUser();
          if (userData) {
            // remove cart into firebase
            await fetchWrapperService._delete(`${cartsUrl}/${cartId}`);
            resolve(true);
          } else {
            const newCartData = allCartData.filter((x) => x.id !== cartId);
            localStorage.setItem("cart", JSON.stringify(newCartData));
            if (!getCartItemOnOffline().length) {
              localStorage.removeItem("cart");
            }
            resolve(true);
          }
        } else {
          reject(new Error("cart not found!"));
        }
      } else {
        reject(new Error("Invalid Id"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getCartItemOnOffline = () => {
  const localStorageCart = JSON.parse(localStorage.getItem("cart"));
  return localStorageCart ? localStorageCart : [];
};

const isValidVariationsArray = (productVariations, selectedVariations) => {
  // eslint-disable-next-line array-callback-return
  const matchedvariation = selectedVariations.filter((selectedVariItem) => {
    const findedProductVariation = productVariations.find(
      (productVariItem) =>
        productVariItem.variationId === selectedVariItem.variationId
    );
    if (findedProductVariation) {
      const findedProductVariationType =
        findedProductVariation.variationTypes.find(
          (productVariType) =>
            productVariType.variationTypeId === selectedVariItem.variationTypeId
        );
      if (findedProductVariationType) {
        return {
          variationId: findedProductVariation.variationId,
          variationTypeId: findedProductVariationType.variationTypeId,
        };
      }
    }
  });

  return matchedvariation.length === selectedVariations.length &&
    productVariations.length === selectedVariations.length
    ? true
    : false;
};

export const cartService = {
  getAllCartWithProduct,
  insertProductIntoCart,
  insertMultipleProductsIntoCart,
  updateProductQuantityIntoCart,
  removeProductIntoCart,
};
