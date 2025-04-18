const {
  orderService,
  productService,
  cartService,
  stripeService,
  returnService,
} = require("../services/index");
const sanitizeValue = require("../helpers/sanitizeParams");
const orderNum = require("../helpers/orderNum");
const message = require("../utils/messages");
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const { getVariComboPriceQty } = require("../helpers/variationWiseQty");
const {
  calculateAmount,
  calculateProductPrice,
} = require("../helpers/calculateAmount");
const { areArraysEqual } = require("../helpers/areArraysEqual");
const { updateProductQty } = require("../services/product");
const dotenv = require("dotenv");
const { getMailTemplateForRefundStatus } = require("../utils/template");
const { sendMail } = require("../helpers/mail");
dotenv.config();

/**
  This API is used for create payment intent.
*/
const createPaymentIntent = async (req, res) => {
  try {
    const userData = req?.userData;

    const allActiveProductsData = await productService.getAllActiveProducts();
    if (userData) {
      const findPattern = {
        key: "userId",
        value: userData?.id,
      };
      const userWiseCartData = await cartService.find(findPattern);
      req.body.userId = userData?.id;
      req.body.cartList = userWiseCartData
        .map((cartItem) => {
          const foundProduct = allActiveProductsData.find(
            (product) => product.id === cartItem.productId
          );
          if (!foundProduct) return;

          const { sellingPrice } = calculateProductPrice(
            foundProduct,
            cartItem.variations
          );

          return {
            ...cartItem,
            quantityWiseSellingPrice: sellingPrice * cartItem.quantity,
          };
        })
        .filter((item) => item);
    }

    const { createdOrder } = await createOrder(
      req.body,
      allActiveProductsData,
      res
    );
    if (createdOrder) {
      const {
        id: orderId,
        shippingAddress,
        total,
        products,
        orderNumber,
      } = createdOrder;
      console.log(createdOrder, "createdOrder");
      stripe.customers
        .create({
          name: shippingAddress.name,
          email: shippingAddress.email,
          address: {
            line1: shippingAddress.address,
            postal_code: shippingAddress.pinCode,
            city: shippingAddress.city,
            state: shippingAddress.state,
            country: shippingAddress.country,
          },
          metadata: {
            orderId: orderId,
          },
        })
        .then((customer) => {
          stripe.paymentIntents
            .create({
              amount: Math.round(total * 100), // in cents
              currency: process.env.STRIPE_ACCEPT_CURRENCY,
              // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
              automatic_payment_methods: {
                enabled: true,
              },
              shipping: {
                name: shippingAddress.name,
                address: {
                  line1: shippingAddress.address,
                  postal_code: shippingAddress.pinCode,
                  city: shippingAddress.city,
                  state: shippingAddress.state,
                  country: shippingAddress.country,
                },
              },
              customer: customer.id,
              description: `Payment for Order Number ${orderNumber}`,
            })
            .then(async (paymentIntent) => {
              // after success updte order with paymenIntentId and customerId
              const findPattern = {
                orderId: orderId,
              };
              const updatePattern = {
                stripeCustomerId: customer.id,
                stripePaymentIntentId: paymentIntent.id,
              };

              await orderService.findOneAndUpdate(findPattern, updatePattern);
              return res.json({
                status: 200,
                orderId: orderId,
                paymentIntentId: paymentIntent.id,
                clientSecret: paymentIntent.client_secret,
              });
            })
            .catch(async (e) => {
              // remove order from database and update product qty also remove customer from stripe
              const findPattern = {
                orderId: orderId,
              };
              await orderService.deleteOne(findPattern);
              await updateProductQty(products);
              const deleted = await stripe.customers.del(customer.id);
              return res.json({
                status: 500,
                message: message.SERVER_ERROR,
              });
            });
        })
        .catch(async (e) => {
          // remove order from database and update product qty
          const findPattern = {
            orderId: orderId,
          };
          await orderService.deleteOne(findPattern);
          await updateProductQty(products);
          return res.json({
            status: 500,
            message: message.SERVER_ERROR,
          });
        });
    }
  } catch (e) {
    return res.json({
      status: 500,
      message: message.SERVER_ERROR,
    });
  }
};

/**
  This API is used for check payment intent status.
*/
const checkPaymentIntentStatus = async (req, res) => {
  try {
    let { paymentIntentId } = req.body;
    paymentIntentId = sanitizeValue(paymentIntentId)
      ? paymentIntentId.trim()
      : "";
    if (paymentIntentId) {
      const pIFindPattern = {
        paymentIntentId: paymentIntentId,
        options: {
          expand: ["latest_charge.balance_transaction"],
        },
      };
      const paymentIntent = await stripeService.retrivePaymentIntent(
        pIFindPattern
      );
      if (paymentIntent && paymentIntent.status === "requires_payment_method") {
        return res.json({
          status: 200,
          paymentIntentStatus: paymentIntent.status,
          message: message.SUCCESS,
        });
      } else {
        return res.json({
          status: 404,
          message: message.custom("Invalid payment intent"),
        });
      }
    } else {
      return res.json({
        status: 400,
        message: message.INVALID_DATA,
      });
    }
  } catch (e) {
    return res.json({
      status: 500,
      message: message.SERVER_ERROR,
    });
  }
};

/**
  This API is used for cancel payment intent.
*/
const cancelPaymentIntent = async (req, res) => {
  try {
    let { paymentIntentId, orderId } = req.body;
    paymentIntentId = sanitizeValue(paymentIntentId)
      ? paymentIntentId.trim()
      : null;
    if (paymentIntentId && orderId) {
      const findPattern = {
        orderId: orderId,
      };
      const orderData = await orderService.findOne(findPattern);
      if (orderData) {
        const paymentIntent = await stripe.paymentIntents.cancel(
          paymentIntentId
        );
        // remove order from database and update product qty
        await orderService.deleteOne(findPattern);
        await updateProductQty(orderData.products);
        return res.json({
          status: 200,
          message: message.SUCCESS,
        });
      } else {
        return res.json({
          status: 404,
          message: message.notFound("order"),
        });
      }
    } else {
      return res.json({
        status: 400,
        message: message.INVALID_DATA,
      });
    }
  } catch (e) {
    return res.json({
      status: 500,
      message: message.SERVER_ERROR,
    });
  }
};

const createOrder = async (payload, activeProductsList, res) => {
  try {
    let {
      cartList,
      userId,
      countryName,
      firstName,
      lastName,
      address,
      city,
      state,
      stateCode,
      pinCode,
      mobile,
      email,
      companyName,
      apartment,
      shippingCharge,
    } = payload || {};
    // required
    cartList = Array.isArray(cartList) ? cartList : [];
    countryName = sanitizeValue(countryName) ? countryName.trim() : null;
    firstName = sanitizeValue(firstName) ? firstName.trim() : null;
    lastName = sanitizeValue(lastName) ? lastName.trim() : null;
    address = sanitizeValue(address) ? address.trim() : null;
    city = sanitizeValue(city) ? city.trim() : null;
    state = sanitizeValue(state) ? state.trim() : null;
    stateCode = sanitizeValue(stateCode) ? stateCode.trim() : null;
    pinCode = pinCode ? Number(pinCode) : null;
    mobile = mobile ? Number(mobile) : null;
    email = sanitizeValue(email) ? email.trim() : null;

    userId = sanitizeValue(userId) ? userId.trim() : "";
    companyName = sanitizeValue(companyName) ? companyName.trim() : "";
    apartment = sanitizeValue(apartment) ? apartment.trim() : "";
    shippingCharge = shippingCharge ? +Number(shippingCharge).toFixed(2) : 0;
    console.log(
      cartList.length,
      // userId ,
      firstName,
      lastName,
      address,
      stateCode,
      countryName,
      city,
      state,
      pinCode,
      mobile,
      email
    );

    if (
      cartList.length &&
      // userId &&
      firstName &&
      lastName &&
      address &&
      stateCode &&
      countryName &&
      city &&
      state &&
      pinCode &&
      mobile &&
      email
    ) {
      const availableCartItems = cartList
        .map((cartItem) => {
          const foundProduct = activeProductsList.find(
            (product) => product.id === cartItem.productId
          );
          if (!foundProduct) return;
          const { quantity: availableQuantity } = getVariComboPriceQty(
            foundProduct.variComboWithQuantity,
            cartItem.variations
          );
          if (
            !isNaN(availableQuantity) &&
            availableQuantity &&
            Number(cartItem.quantity) <= Number(availableQuantity)
          ) {
            return cartItem;
            //   if(Number(cartItem.quantity) <= Number(availableQuantity)){
            //     return cartItem;
            //   }
            //   else{
            //     return {
            //       ...cartItem,
            //       quantity : availableQuantity
            //     }
            //   }
          }
        })
        .filter((item) => item);

      if (
        !availableCartItems.length &&
        cartList.length !== availableCartItems.length
      ) {
        return res.json({
          status: 409,
          message: message.custom("Insufficient quantity available"),
        });
      }

      const shippingAddress = {
        country: countryName,
        name: `${firstName} ${lastName}`,
        companyName: companyName,
        address: address,
        apartment: apartment,
        city: city,
        state: state,
        stateCode: stateCode,
        pinCode: pinCode,
        mobile: mobile,
        email: email,
      };

      const subTotal = calculateAmount(activeProductsList, availableCartItems);
      const isNewYorkSate = state.toLowerCase() === "New York".toLowerCase();
      const salesTaxPerc = isNewYorkSate ? 8 : 0;
      const salesTax = +(subTotal * (salesTaxPerc / 100)).toFixed(2);
      const total = subTotal + shippingCharge + salesTax;

      const orderItem = {
        orderNumber: await orderNum.generateOrderId(),
        userId: userId,
        products: availableCartItems.map((item) => {
          return {
            productId: item.productId,
            variations: item.variations.map((variItem) => {
              return {
                variationId: variItem.variationId,
                variationTypeId: variItem.variationTypeId,
              };
            }),
            productPrice: item.quantityWiseSellingPrice / item.quantity, // its represent variation price with single quantity
            unitAmount: item.quantityWiseSellingPrice, // its represent variation price with multiply quantity
            cartQuantity: item.quantity,
          };
        }),
        shippingAddress: shippingAddress,
        subTotal: subTotal,
        // discount : ,
        salesTax: salesTax,
        salesTaxPercentage: salesTaxPerc,
        shippingCharge: shippingCharge,
        total: total,
        stripeCustomerId: "",
        stripePaymentIntentId: "",
        orderStatus: "pending",
        paymentStatus: "pending",
        cancelReason: "",
      };
      const createdOrder = await orderService.create(orderItem);
      //   update product Qty
      for (let i = 0; i < availableCartItems.length; i++) {
        const cartItem = availableCartItems[i];
        const findedProduct = activeProductsList.find(
          (product) => product.id === cartItem.productId
        );
        if (findedProduct) {
          const tempCombiArray = findedProduct.variComboWithQuantity;
          const index = findedProduct.variComboWithQuantity.findIndex(
            (combination) => {
              const array1 = combination.combination;
              const array2 = cartItem.variations;
              return areArraysEqual(array1, array2);
            }
          );
          if (index !== -1) {
            tempCombiArray[index].quantity =
              tempCombiArray[index].quantity - cartItem.quantity;
          }

          //execute update query
          const findPattern = {
            productId: findedProduct.id,
          };
          const updatePattern = {
            variComboWithQuantity: tempCombiArray,
          };
          await productService.findOneAndUpdate(findPattern, updatePattern);
        }

        if (availableCartItems.length == i + 1) {
          return {
            createdOrder,
          };
        }
      }
    } else {
      if (!cartList?.length) {
        return res.json({
          status: 400,
          message: message.custom("Cart data not found"),
        });
      }
      return res.json({
        status: 400,
        message: message.INVALID_DATA,
      });
    }
  } catch (e) {
    return res.json({
      status: 500,
      message: message.SERVER_ERROR,
    });
  }
};

// Stripe webhook

// This is your Stripe CLI webhook secret for testing your endpoint locally.
// let endpointSecret;

const endpointSecret = process.env.WEBHOOK_SECRET_KEY;

const stripeWebhook = async (req, res) => {
  const payload = req.body;
  const payloadString = JSON.stringify(payload, null, 2);

  const header = stripe.webhooks.generateTestHeaderString({
    payload: payloadString,
    secret: endpointSecret,
  });

  let data;
  let eventType;

  if (endpointSecret) {
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        payloadString,
        header,
        endpointSecret
      );
    } catch (err) {
      console.log(`Webhook Error: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    data = event.data.object;
    eventType = event.type;
  } else {
    data = req.body.data.object;
    eventType = req.body.type;
  }
  // Handle the event
  if (
    eventType === "charge.refund.updated" &&
    data?.status &&
    data?.payment_intent
  ) {
    let orderUpdatePatternWithRefund = {
      stripeRefundId: data.id,
      updatedDate: Date.now(),
    };

    let returnUpdatePatternWithRefund = {
      stripeRefundId: data.id,
      updatedDate: Date.now(),
    };

    switch (data.status) {
      case "succeeded":
        orderUpdatePatternWithRefund.paymentStatus = "refunded";
        returnUpdatePatternWithRefund.returnPaymentStatus = "refunded";
        break;
      case "failed":
        orderUpdatePatternWithRefund.paymentStatus = "failed_refund";
        orderUpdatePatternWithRefund.stripeRefundFailureReason =
          data.failure_reason;

        returnUpdatePatternWithRefund.returnPaymentStatus = "failed_refund";
        returnUpdatePatternWithRefund.stripeRefundFailureReason =
          data.failure_reason;
        break;
      case "canceled":
        orderUpdatePatternWithRefund.paymentStatus = "cancelled_refund";
        returnUpdatePatternWithRefund.returnPaymentStatus = "cancelled_refund";
        break;
    }
    const findPattern = {
      paymentIntentId: data.payment_intent,
    };
    const orderData = await orderService.findByPaymentIntentId(findPattern);
    if (orderData?.id) {
      const destinationDetail = data?.destination_details?.card;
      if (
        destinationDetail?.reference_status === "available" &&
        destinationDetail?.reference_type === "acquirer_reference_number"
      ) {
        orderUpdatePatternWithRefund.stripeARNNumber =
          destinationDetail?.reference;
        returnUpdatePatternWithRefund.stripeARNNumber =
          destinationDetail?.reference;
      }
      if (orderData?.returnRequestIds?.length) {
        const findPattern = {
          key: "orderId",
          value: orderData.id,
        };
        const orderWiseReturnsData = await returnService.find(findPattern);
        const returnData = [...orderWiseReturnsData]
          .filter((item) => item.status === "received")
          .sort((a, b) => b.updatedDate - a.updatedDate);
        if (returnData?.length) {
          const returnFindPattern = {
            returnId: returnData[0]?.id,
          };
          returnService.findOneAndUpdate(
            returnFindPattern,
            returnUpdatePatternWithRefund
          );
        }
      } else {
        const orderFindPattern = {
          orderId: orderData.id,
        };
        orderService.findOneAndUpdate(
          orderFindPattern,
          orderUpdatePatternWithRefund
        );
      }
      // send mail for refund status
      if (["succeeded", "failed", "canceled"].includes(data.status)) {
        sendRefundStatusEmail(data.status, orderData);
      }
    }
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send().end();
};

/**
  This API is used for refundPayment.
*/
const refundPayment = async (req, res) => {
  try {
    let { orderId, refundDescription } = req.body;
    orderId = sanitizeValue(orderId) ? orderId.trim() : "";

    if (orderId) {
      const findPattern = {
        orderId: orderId,
      };
      const orderData = await orderService.findOne(findPattern);
      if (orderData) {
        if (
          [
            "success",
            "failed_refund",
            "refund_initialization_failed",
            "cancelled_refund",
          ].includes(orderData.paymentStatus) &&
          ["confirmed", "cancelled"].includes(orderData.orderStatus)
        ) {
          const pIFindPattern = {
            paymentIntentId: orderData.stripePaymentIntentId,
            options: {
              expand: ["latest_charge.balance_transaction"],
            },
          };
          const paymentIntent = await stripeService.retrivePaymentIntent(
            pIFindPattern
          );
          if (!paymentIntent || paymentIntent.status !== "succeeded") {
            return res.json({
              status: 409,
              message: message.custom(
                `You cannot refund payment as the payment intent is not successful`
              ),
            });
          }
          refundDescription = sanitizeValue(refundDescription)
            ? refundDescription.trim()
            : orderData?.refundDescription || "";
          if (refundDescription) {
            const updatePatternForDesc = {
              updatedDate: Date.now(),
              refundDescription,
            };
            orderService.findOneAndUpdate(findPattern, updatePatternForDesc);
          }

          // integrate refund functionality
          const refundPaymentParams = {
            paymentIntentId: paymentIntent.id,
            amountInCents: paymentIntent.amount,
          };
          stripeService
            .refundAmount(refundPaymentParams)
            .then((refundResponse) => {
              if (refundResponse) {
                let orderUpdatePatternWithRefund = {
                  stripeRefundId: refundResponse.id,
                  updatedDate: Date.now(),
                };
                if (refundResponse?.status === "pending") {
                  orderUpdatePatternWithRefund.paymentStatus = "pending_refund";
                }

                orderService.findOneAndUpdate(
                  findPattern,
                  orderUpdatePatternWithRefund
                );
                setTimeout(() => {
                  return res.json({
                    status: 200,
                    message: message.custom("Refund processed successfully"),
                  });
                }, 5000); // 5 seconds
              } else {
                return res.json({
                  status: 404,
                  message: message.notFound(),
                });
              }
            })
            .catch((e) => {
              return res.json({
                status: 302,
                message: message.custom(
                  `Your refund initialization failed due to ${e?.message}`
                ),
              });
            });
        } else {
          return res.json({
            status: 409,
            message: message.custom(
              `You cannot refund payment as the payment status is ${orderData.paymentStatus} and order status is ${orderData.orderStatus}`
            ),
          });
        }
      } else {
        return res.json({
          status: 404,
          message: message.notFound("order"),
        });
      }
    } else {
      return res.json({
        status: 400,
        message: message.INVALID_DATA,
      });
    }
  } catch (e) {
    return res.json({
      status: 500,
      message: message.SERVER_ERROR,
    });
  }
};

/**
  This API is used for refund Payment For Return.
*/
const refundPaymentForReturn = async (req, res) => {
  try {
    let { returnId, refundAmount, refundDescription } = req.body;
    returnId = sanitizeValue(returnId) ? returnId.trim() : "";
    refundAmount = refundAmount ? Number(refundAmount) : 0;

    if (returnId && refundAmount) {
      const findPattern = {
        returnId: returnId,
      };
      const returnData = await returnService.findOne(findPattern);
      if (returnData) {
        if (
          [
            "pending",
            "failed_refund",
            "refund_initialization_failed",
            "cancelled_refund",
          ].includes(returnData.returnPaymentStatus) &&
          ["received"].includes(returnData.status)
        ) {
          const orderFindPattern = {
            orderId: returnData.orderId,
          };
          const orderData = await orderService.findOne(orderFindPattern);
          if (!orderData) {
            return res.json({
              status: 404,
              message: message.notFound("order"),
            });
          }
          const pIFindPattern = {
            paymentIntentId: orderData.stripePaymentIntentId,
            options: {
              expand: [
                "latest_charge.balance_transaction",
                "latest_charge.refunds",
              ],
            },
          };
          const paymentIntent = await stripeService.retrivePaymentIntent(
            pIFindPattern
          );
          if (!paymentIntent || paymentIntent.status !== "succeeded") {
            return res.json({
              status: 409,
              message: message.custom(
                `You cannot refund payment as the payment intent is not successful`
              ),
            });
          }
          const refundAmountInCent = Math.round(refundAmount * 100); // in cents
          if (paymentIntent.amount < refundAmountInCent) {
            return res.json({
              status: 429,
              message: message.custom(
                `The requested refund amount exceeds your payment amount. The maximum refundable amount is $${
                  paymentIntent.amount / 100
                }.`
              ),
            });
          }
          let returnUpdatePatternWithRefund = {
            refundDescription: sanitizeValue(refundDescription)
              ? refundDescription.trim()
              : returnData?.refundDescription || "",
            updatedDate: Date.now(),
          };
          // integrate refund functionality
          const refundPaymentParams = {
            paymentIntentId: paymentIntent.id,
            amountInCents: refundAmountInCent,
          };

          stripeService
            .refundAmount(refundPaymentParams)
            .then(async (refundResponse) => {
              if (refundResponse) {
                returnUpdatePatternWithRefund.stripeRefundId =
                  refundResponse.id;
                returnUpdatePatternWithRefund.refundAmount = refundAmount;
                if (refundResponse?.status === "pending") {
                  returnUpdatePatternWithRefund.returnPaymentStatus =
                    "pending_refund";

                  // send mail for pending refund status
                  sendRefundStatusEmail("pending_refund", orderData);
                }

                await returnService.findOneAndUpdate(
                  findPattern,
                  returnUpdatePatternWithRefund
                );
                setTimeout(() => {
                  return res.json({
                    status: 200,
                    message: message.custom("Refund processed successfully"),
                  });
                }, 5000); // 5 seconds
              } else {
                return res.json({
                  status: 404,
                  message: message.notFound(),
                });
              }
            })
            .catch(async (e) => {
              const refundsList = paymentIntent?.latest_charge?.refunds?.data;
              if (
                !refundsList?.length ||
                refundsList?.filter((x) => x?.status === "canceled")?.length ===
                  refundsList?.length
              ) {
                returnUpdatePatternWithRefund.returnPaymentStatus =
                  "refund_initialization_failed";
                returnUpdatePatternWithRefund.stripeRefundFailureReason =
                  e?.message;

                await returnService.findOneAndUpdate(
                  findPattern,
                  returnUpdatePatternWithRefund
                );
                // send mail for refund initialized failed status
                sendRefundStatusEmail(
                  "refund_initialization_failed",
                  orderData
                );
              }
              res.json({
                status: 302,
                message: message.custom(
                  `Your refund initialization failed due to ${e?.message}`
                ),
              });
            });
        } else {
          return res.json({
            status: 409,
            message: message.custom(
              `You cannot refund payment as the return payment status is ${returnData.returnPaymentStatus} and return status is ${returnData.status}`
            ),
          });
        }
      } else {
        return res.json({
          status: 404,
          message: message.notFound("return"),
        });
      }
    } else {
      return res.json({
        status: 400,
        message: message.INVALID_DATA,
      });
    }
  } catch (e) {
    return res.json({
      status: 500,
      message: message.SERVER_ERROR,
    });
  }
};

// Function to handle sending refund status emails
const sendRefundStatusEmail = (evenyStatus, orderData) => {
  let statusKey;

  switch (evenyStatus) {
    case "pending_refund":
      statusKey = "pending_refund";
      break;
    case "succeeded":
      statusKey = "refunded";
      break;
    case "refund_initialization_failed":
      statusKey = "refund_initialization_failed";
      break;
    case "failed":
      statusKey = "failed_refund";
      break;
    case "canceled":
      statusKey = "cancelled_refund";
      break;
    default:
      // If the status is not recognized, do not proceed with sending an email
      return;
  }

  const { subject, description } = getMailTemplateForRefundStatus(
    orderData.shippingAddress.name,
    orderData.orderNumber,
    statusKey
  );

  sendMail(orderData.shippingAddress.email, subject, description);
};

module.exports = {
  createPaymentIntent,
  checkPaymentIntentStatus,
  cancelPaymentIntent,
  createOrder,
  stripeWebhook,
  refundPayment,
  refundPaymentForReturn,
};
