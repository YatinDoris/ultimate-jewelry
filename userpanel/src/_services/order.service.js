import axios from "axios";
import {
  fetchWrapperService,
  helperFunctions,
  ordersUrl,
  productsUrl,
  sanitizeObject,
  sanitizeValue,
} from "../_helper";
import { productService } from "./product.service";
import { authenticationService } from "./authentication.service";
// import { handleCancelOrderError } from "../store/actions/orderActions";
import { GOLD_COLOR, GOLD_TYPES } from "../_helper/constants";
import { returnService } from "./return.service";
import { setOrderMessage } from "@/store/slices/orderSlice";

const getAllOrderList = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const userData = helperFunctions.getCurrentUser();
      if (userData) {
        const findPattern = {
          url: ordersUrl,
          key: "userId",
          value: userData.id,
        };
        const orderData = await fetchWrapperService.find(findPattern);
        const finalOrderData = orderData.filter(
          (item) => item.paymentStatus !== "pending"
        );

        const userReturnsData = await returnService.getUserReturnsList();
        const updatedOrderData = finalOrderData.map((order) => {
          const matchedReturns = userReturnsData.filter(
            (returnOrder) => returnOrder.orderId === order.id
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
          return {
            ...order,
            hasActiveReturns: hasActiveReturns,
          };
        });
        resolve(helperFunctions.sortByField(updatedOrderData));
      } else {
        reject(new Error("unAuthorized"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getOrderDetailByOrderId = (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      orderId = sanitizeValue(orderId) ? orderId.trim() : null;
      if (orderId) {
        const orderDetail = await fetchWrapperService.findOne(ordersUrl, {
          id: orderId,
        });

        if (orderDetail) {
          const currentUser = helperFunctions.getCurrentUser();
          if (currentUser?.id !== orderDetail?.userId) {
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
          if (orderDetail?.cancelledBy) {
            const adminAndUsersData =
              await authenticationService.getAllUserAndAdmin();
            const findedUserData = adminAndUsersData.find(
              (item) => item.id === orderDetail.cancelledBy
            );
            if (findedUserData) {
              orderDetail.cancelledByName = findedUserData.name;
            }
          }
          orderDetail.products = orderDetail.products.map(
            (orderProductItem) => {
              const findedProduct = allActiveProductsData.find(
                (product) => product.id === orderProductItem.productId
              );
              if (findedProduct) {
                const variationArray = orderProductItem.variations.map(
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
                  ...orderProductItem,
                  productName: findedProduct.productName,
                  productImage: findedProduct.images[0].image,
                  variations: variationArray,
                };
              }
              return orderProductItem;
            }
          );
          resolve(orderDetail);
        } else {
          reject(new Error("Order does not exist"));
        }
      } else {
        reject(new Error("Invalid data"));
      }
    } catch (e) {
      reject(e);
    }
  });
};

// const getOrderDetailByOrderNumber = (orderNumber) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       orderNumber = sanitizeValue(orderNumber) ? orderNumber.trim() : null;
//       if (orderNumber) {
//         const orderDetail = await fetchWrapperService.findOne(ordersUrl, {
//           orderNumber: orderNumber,
//         });

//         if (orderDetail) {
//           const productFindPattern = {
//             url: productsUrl,
//             key: "active",
//             value: true,
//           };
//           const allActiveProductsData = await fetchWrapperService.find(
//             productFindPattern
//           );
//           const customizations = await productService.getAllCustomizations();
//           if (orderDetail?.cancelledBy) {
//             const adminAndUsersData =
//               await authenticationService.getAllUserAndAdmin();
//             const findedUserData = adminAndUsersData.find(
//               (item) => item.id === orderDetail.cancelledBy
//             );
//             if (findedUserData) {
//               orderDetail.cancelledByName = findedUserData.name;
//             }
//           }
//           orderDetail.products = orderDetail.products.map(
//             (orderProductItem) => {
//               const findedProduct = allActiveProductsData.find(
//                 (product) => product.id === orderProductItem.productId
//               );
//               if (findedProduct) {
//                 const variationArray = orderProductItem.variations.map(
//                   (variItem) => {
//                     const findedCustomizationType =
//                       customizations.customizationSubType.find(
//                         (x) => x.id === variItem.variationTypeId
//                       );
//                     return {
//                       ...variItem,
//                       variationName: customizations.customizationType.find(
//                         (x) => x.id === variItem.variationId
//                       ).title,
//                       variationTypeName: findedCustomizationType.title,
//                     };
//                   }
//                 );
//                 return {
//                   ...orderProductItem,
//                   productName: findedProduct.productName,
//                   productImage: findedProduct.images[0].image,
//                   variations: variationArray,
//                 };
//               }
//               return orderProductItem;
//             }
//           );
//           resolve(orderDetail);
//         } else {
//           reject(new Error("Order does not exist"));
//         }
//       } else {
//         reject(new Error("Invalid data"));
//       }
//     } catch (e) {
//       reject(e);
//     }
//   });
// };

const cancelOrder = async (payload, abortController) => {
  try {
    if (payload) {
      const signal = abortController && abortController.signal;
      const response = await axios.post(
        "/order/cancelOrder",
        sanitizeObject(payload),
        { signal }
      );
      if (response) {
        return response.data;
      }
      return false;
    }
  } catch (error) {
    console.log("error :", error);
    return false;
  }
};

const deleteOrder = async (orderId) => {
  try {
    orderId = sanitizeValue(orderId) ? orderId.trim() : null;
    if (orderId) {
      const response = await axios.delete(`/order/${orderId}`);
      return { success: true, data: response?.data };
    }
    return { success: false, message: "OrderId not found" };
  } catch (error) {
    console.log("delete order error : ", error?.message);
    return { success: false, message: error?.message };
  }
};

// const getTopSellingProducts = () => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const respData = await fetchWrapperService.getAll(ordersUrl);
//       const orderData = respData ? Object.values(respData) : [];
//       let filteredOrders = orderData.filter((order) => {
//         return order.paymentStatus === "success";
//       });

//       const productMap = new Map();

//       filteredOrders.forEach((order) => {
//         order.products.forEach((product) => {
//           const { productId } = product;

//           // Create a unique identifier for the product including its variations
//           const productKey = `${productId}`;
//           // Check if the product is already in the map, if not, initialize it
//           if (!productMap.has(productKey)) {
//             productMap.set(productKey, {
//               productId,
//             });
//           }

//           // Increment the total quantity sold for this product
//           const existingProduct = productMap.get(productKey);
//           productMap.set(productKey, existingProduct);
//         });
//       });

//       const filteredProducts = [...productMap.values()];

//       const tempTopSellingProductsList = filteredProducts.sort(
//         (a, b) => b.soldQuantity - a.soldQuantity
//       );

//       const topN = 20;
//       const topSellingProducts = tempTopSellingProductsList.slice(0, topN);
//       const allActiveProductsData = await productService.getAllActiveProducts();

//       const convertedTopSellingProducts = topSellingProducts
//         .map((sellingProductItem) => {
//           const foundProduct = allActiveProductsData.find(
//             (product) => product.id === sellingProductItem.productId
//           );
//           if (!foundProduct) return null;

//           const { price = 0 } = helperFunctions.getMinPriceVariCombo(
//             foundProduct?.variComboWithQuantity
//           );

//           return {
//             ...foundProduct,
//             basePrice: price,
//             baseSellingPrice: helperFunctions.getSellingPrice(
//               price,
//               foundProduct.discount
//             ),
//             discount: foundProduct.discount,
//             goldTypeVariations: foundProduct?.variations?.find(
//               (x) => x?.variationName.toLowerCase() === GOLD_TYPES.toLowerCase()
//             )?.variationTypes,
//             goldColorVariations: foundProduct?.variations?.find(
//               (x) => x?.variationName.toLowerCase() === GOLD_COLOR.toLowerCase()
//             )?.variationTypes,
//           };
//         })
//         .filter((item) => item !== null);
//       resolve(convertedTopSellingProducts);
//     } catch (e) {
//       reject(e);
//     }
//   });
// };

export const orderService = {
  getAllOrderList,
  getOrderDetailByOrderId,
  cancelOrder,
  deleteOrder,
  // getTopSellingProducts,
  // getOrderDetailByOrderNumber,
};
