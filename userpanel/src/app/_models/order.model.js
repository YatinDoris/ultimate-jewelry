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
          // its represent variation price with single quantity
          type: Number,
        },
        unitAmount: {
          // its represent variation price with multiply quantity
          type: Number,
        },
        cartQuantity: {
          type: Number,
        },
      },
    ],
    require: true,
    ref: "products",
  },
  shippingAddess: {
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
