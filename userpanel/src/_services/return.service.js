import { uid } from "uid";
import {
  fetchWrapperService,
  helperFunctions,
  ordersUrl,
  productsUrl,
  returnsUrl,
  sanitizeObject,
  sanitizeValue,
} from "../_helper";
import { productService } from "./product.service";
import { authenticationService } from "./authentication.service";

const hasInvalidProductsKey = (arrayOfProducts) => {
  const isValidProductId = helperFunctions.isValidKeyName(
    arrayOfProducts,
    "productId"
  );
  const isValidUnitAmt = helperFunctions.isValidKeyName(
    arrayOfProducts,
    "unitAmount"
  );
  const isValidQty = helperFunctions.isValidKeyName(
    arrayOfProducts,
    "returnQuantity"
  );
  const isValidVariArray = helperFunctions.isValidKeyName(
    arrayOfProducts,
    "variations"
  );

  const variationArray = arrayOfProducts[0]?.variations || [];

  const isValidVariId = helperFunctions.isValidKeyName(
    variationArray,
    "variationId"
  );
  const isValidVariTypeId = helperFunctions.isValidKeyName(
    variationArray,
    "variationTypeId"
  );

  return (
    !isValidProductId ||
    !isValidQty ||
    !isValidUnitAmt ||
    !isValidVariArray ||
    !isValidVariId ||
    !isValidVariTypeId
  );
};

export const getProductsArray = (arrayOfProducts) => {
  return arrayOfProducts.map((product) => {
    return {
      productId: product.productId,
      returnQuantity: product.returnQuantity,
      productPrice: product.productPrice, // its represent variation price with single quantity
      unitAmount: product.productPrice * product.returnQuantity, // its represent variation price with multiply quantity
      variations: product.variations.map((variItem) => {
        return {
          variationId: variItem.variationId,
          variationTypeId: variItem.variationTypeId,
        };
      }),
    };
  });
};

const validateProducts = (products, orderProducts) => {
  // Check if every selected product is valid
  const isValid = products.every((productItem) => {
    // Find the corresponding product in orderProducts
    const correspondingProduct = orderProducts.find(
      (orderProduct) =>
        orderProduct.productId === productItem.productId &&
        helperFunctions.areArraysEqual(
          orderProduct.variations,
          productItem.variations
        )
    );

    // If the corresponding product is found
    if (correspondingProduct) {
      // Check if the quantities match and are not zero
      return (
        productItem.returnQuantity <= correspondingProduct.cartQuantity &&
        productItem.returnQuantity > 0
      );
    } else {
      // Corresponding product not found
      return false;
    }
  });
  return isValid;
};

const insertReturnRequest = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { orderId, products, returnRequestReason } = sanitizeObject(params);
      orderId = orderId ? orderId?.trim() : null;
      returnRequestReason = returnRequestReason
        ? returnRequestReason?.trim()
        : null;

      const userData = helperFunctions.getCurrentUser();
      if (!userData?.id) {
        reject(new Error("unAuthorized"));
        return;
      }

      if (orderId && returnRequestReason) {
        const orderDetail = await fetchWrapperService.findOne(ordersUrl, {
          id: orderId,
        });
        if (orderDetail) {
          const {
            orderStatus,
            deliveryDate,
            returnRequestIds,
            products: orderProducts,
            orderNumber,
          } = orderDetail;
          if (
            orderStatus !== "delivered" ||
            !helperFunctions.isReturnValid(deliveryDate)
          ) {
            reject(
              new Error(
                "Since your order hasn't been delivered or has exceeded the 15-day limit, you're unable to initiate a return request"
              )
            );
            return;
          }

          const matchedReturns = await returnService.getReturnsByOrderId(
            orderId
          );

          const isPendingOrApprovedOrReceivedReturnsCount =
            matchedReturns.filter((returnOrder) =>
              ["pending", "approved", "received"].includes(returnOrder.status)
            ).length;

          const rejectedCount = matchedReturns.filter(
            (returnOrder) => returnOrder.status === "rejected"
          ).length;

          const hasActiveReturns =
            isPendingOrApprovedOrReceivedReturnsCount ||
              (rejectedCount > 0 && rejectedCount > 2)
              ? false
              : true;

          if (!hasActiveReturns) {
            reject(
              new Error(
                "Unable to initiate return: Either an active return request is pending, approved, or received, or the return request limit has been exceeded."
              )
            );
            return;
          }

          if (hasInvalidProductsKey(products)) {
            reject(new Error("products data not valid"));
            return;
          }
          const productsArray = getProductsArray(products);
          if (!validateProducts(productsArray, orderProducts)) {
            reject(new Error("At least one product is invalid"));
            return;
          }

          const uuid = uid();
          let insertPattern = {
            id: uuid,
            orderId,
            userId: userData.id,
            orderNumber: orderNumber,
            products: productsArray,
            returnRequestReason,
            status: "pending",
            returnPaymentStatus: "pending",
            createdDate: Date.now(),
            updatedDate: Date.now(),
          };
          const createPattern = {
            url: `${returnsUrl}/${uuid}`,
            insertPattern,
          };
          fetchWrapperService
            .create(createPattern)
            .then((response) => {
              //update order for returnRequestIds
              const prevReturnReqIds = returnRequestIds?.length
                ? returnRequestIds
                : [];
              const orderUpdatePayload = {
                returnRequestIds: [...prevReturnReqIds, insertPattern.id],
              };
              const orderUpdatePattern = {
                url: `${ordersUrl}/${orderId}`,
                payload: orderUpdatePayload,
              };
              fetchWrapperService._update(orderUpdatePattern);
              resolve(createPattern);
            })
            .catch((e) => {
              reject(
                new Error(
                  "An error occurred during creating a new return request."
                )
              );
            });
        } else {
          reject(new Error("Order does not exist"));
        }
      } else {
        reject(new Error("Invalid Data"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getUserReturnsList = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const userData = helperFunctions.getCurrentUser();
      if (userData) {
        const findPattern = {
          url: returnsUrl,
          key: "userId",
          value: userData.id,
        };
        const returnsData = await fetchWrapperService.find(findPattern);

        resolve(helperFunctions.sortByField(returnsData));
      } else {
        reject(new Error("unAuthorized"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const cancelReturnRequest = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { returnId, cancelReason } = sanitizeObject(params);
      returnId = returnId ? returnId?.trim() : null;
      cancelReason = cancelReason ? cancelReason?.trim() : null;

      const userData = helperFunctions.getCurrentUser();
      if (!userData?.id) {
        reject(new Error("unAuthorized"));
        return;
      }

      if (returnId && cancelReason) {
        const returnDetail = await fetchWrapperService.findOne(returnsUrl, {
          id: returnId,
        });
        if (returnDetail) {
          const { status, returnPaymentStatus } = returnDetail;
          if (status === "cancelled") {
            reject(new Error("Cancel status already exist!"));
            return;
          }

          if (returnPaymentStatus !== "pending" || status !== "pending") {
            reject(
              new Error(
                `You cannot cancel return as the return payment status is ${returnPaymentStatus} and return status is ${status}`
              )
            );
            return;
          }

          const payload = {
            status: "cancelled",
            cancelReason,
            updatedDate: Date.now(),
          };
          const updatePattern = {
            url: `${returnsUrl}/${returnId}`,
            payload: payload,
          };
          fetchWrapperService
            ._update(updatePattern)
            .then((response) => {
              resolve(updatePattern);
            })
            .catch((e) => {
              reject(
                new Error(
                  "An error occurred during update cancel return request."
                )
              );
            });
        } else {
          reject(new Error("Return does not exist"));
        }
      } else {
        reject(new Error("Invalid Data"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteReturnRequest = (params) => {
  return new Promise(async (resolve, reject) => {
    try {
      let { returnId } = sanitizeObject(params);
      returnId = returnId ? returnId?.trim() : null;

      const userData = helperFunctions.getCurrentUser();
      if (!userData?.id) {
        reject(new Error("unAuthorized"));
        return;
      }

      if (returnId) {
        const returnDetail = await fetchWrapperService.findOne(returnsUrl, {
          id: returnId,
        });
        if (returnDetail) {
          const { orderId, status, returnPaymentStatus } = returnDetail;
          if (returnPaymentStatus !== "pending" || status !== "pending") {
            reject(
              new Error(
                `You cannot delete return as the return payment status is ${returnPaymentStatus} and return status is ${status}`
              )
            );
            return;
          }
          await fetchWrapperService._delete(`${returnsUrl}/${returnId}`);
          resolve(true);

          //update order for return req ids
          const orderDetail = await fetchWrapperService.findOne(ordersUrl, {
            id: orderId,
          });
          if (orderDetail) {
            const { returnRequestIds } = orderDetail;
            const prevReturnReqIds = returnRequestIds?.length
              ? returnRequestIds
              : [];
            const newReturnReqIds = prevReturnReqIds.filter(
              (id) => id !== returnId
            );
            const orderUpdatePayload = {
              returnRequestIds: [...newReturnReqIds],
            };
            const orderUpdatePattern = {
              url: `${ordersUrl}/${orderId}`,
              payload: orderUpdatePayload,
            };
            fetchWrapperService._update(orderUpdatePattern);
          }
        } else {
          reject(new Error("Return does not exist"));
        }
      } else {
        reject(new Error("Invalid Data"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getReturnsByOrderId = (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      orderId = sanitizeValue(orderId) ? orderId.trim() : null;
      if (orderId) {
        const findPattern = {
          url: returnsUrl,
          key: "orderId",
          value: orderId,
        };
        const orderWiseReturnsData = await fetchWrapperService.find(
          findPattern
        );
        resolve(orderWiseReturnsData);
        return orderWiseReturnsData;
      } else {
        reject(new Error("Invalid data"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getReturnDetailByReturnId = (returnId) => {
  return new Promise(async (resolve, reject) => {
    try {
      returnId = sanitizeValue(returnId) ? returnId.trim() : null;
      if (returnId) {
        const returnDetail = await fetchWrapperService.findOne(returnsUrl, {
          id: returnId,
        });

        if (returnDetail) {
          const currentUser = helperFunctions.getCurrentUser();
          if (currentUser?.id !== returnDetail?.userId) {
            reject(new Error("unAuthorized"));
            return;
          }
          const productFindPattern = {
            url: productsUrl,
            key: "active",
            value: true,
          };
          const allActiveProductsData = await fetchWrapperService.find(
            productFindPattern
          );
          const customizations = await productService.getAllCustomizations();

          if (returnDetail?.userId) {
            const adminAndUsersData =
              await authenticationService.getAllUserAndAdmin();
            const findedUserData = adminAndUsersData.find(
              (item) => item.id === returnDetail.userId
            );
            if (findedUserData) {
              returnDetail.createdBy = findedUserData.name;
            }
          }
          returnDetail.products = returnDetail.products.map(
            (returnProductItem) => {
              const findedProduct = allActiveProductsData.find(
                (product) => product.id === returnProductItem.productId
              );
              if (findedProduct) {
                const variationArray = returnProductItem.variations.map(
                  (variItem) => {
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
                  }
                );
                return {
                  ...returnProductItem,
                  productName: findedProduct.productName,
                  productImage: findedProduct.images[0].image,
                  variations: variationArray,
                };
              }
              return returnProductItem;
            }
          );
          resolve(returnDetail);
        } else {
          reject(new Error("Return does not exist"));
        }
      } else {
        reject(new Error("Invalid data"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

export const returnService = {
  insertReturnRequest,
  getUserReturnsList,
  cancelReturnRequest,
  deleteReturnRequest,
  getReturnsByOrderId,
  getReturnDetailByReturnId,
};
