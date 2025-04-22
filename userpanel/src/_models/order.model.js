export const orderModel = {
  id: {
    type: String,
    unique: true,
    require: true,
  },
  orderNumber: {
    type: String,
    require: true,
  },
  userId: {
    type: String,
    ref: "user",
  },
  stripeCustomerId: {
    type: String,
  },
  stripePaymentIntentId: {
    type: String,
  },
  stripeRefundId: {
    type: String,
  },
  stripeRefundFailureReason: {
    type: String,
  },
  products: {
    type: [
      {
        productId: {
          type: String,
        },
        variations: {
          type: [
            {
              variationId: {
                type: String,
              },
              variationTypeId: {
                type: String,
              },
            },
          ],
          ref: "variation",
        },
        productPrice: {
          type: Number, // Represents variation price for non-customized or base price for customized with single quantity
        },
        unitAmount: {
          type: Number, // Total price (variation price + diamond price) * quantity
        },
        cartQuantity: {
          type: Number,
        },
        diamondDetail: {
          // New field for customized products
          type: {
            shapeId: {
              type: String,
            },
            caratWeight: {
              type: Number,
            },
            clarity: {
              type: String,
            },
            color: {
              type: String,
            },
            price: {
              type: Number, // Diamond price
            },
          },
          required: false, // Optional for non-customized products
        },
      },
    ],
    require: true,
    ref: "products",
  },
  shippingAddress: {
    type: {
      email: {
        type: String,
      },
      name: {
        type: String,
      },

      country: {
        type: String,
      },
      city: {
        type: String,
      },
      state: {
        type: String,
      },
      pinCode: {
        type: Number,
      },
      address: {
        type: String,
      },
      mobile: {
        type: Number,
      },
      company: {
        type: String,
      },
      apartment: {
        type: String,
      },
    },
    require: true,
  },
  subTotal: {
    // wihtout shipping,discount and other taxes
    type: Number,
    required: true,
  },
  // discount: {
  //   type: Number,
  //   default: 0,
  // },
  salesTax: {
    type: Number,
    default: 0,
  },
  salesTaxPercentage: {
    type: Number,
    default: 0,
  },
  shippingCharge: {
    type: Number,
    default: 0,
  },
  total: {
    type: Number,
    require: true,
  },
  orderStatus: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  trackingNumber: {
    type: String,
  },
  deliveryDate: {
    type: Date,
  },
  paymentStatus: {
    type: String,
    enum: [
      "pending",
      "success",
      "failed",
      "refunded",
      "pending_refund",
      "failed_refund",
      "cancelled_refund",
      "refund_initialization_failed",
    ],
  },
  cancelReason: {
    type: String,
    default: "",
  },
  refundDescription: {
    type: String,
    default: "",
  },
  stripeARNNumber: {
    type: String,
    default: "",
  },
  cancelledBy: {
    type: String,
    ref: "user",
  },
  returnRequestIds: {
    type: [String],
    ref: "returnRequest",
  },
  createdDate: Date,
  updatedDate: Date,
};
