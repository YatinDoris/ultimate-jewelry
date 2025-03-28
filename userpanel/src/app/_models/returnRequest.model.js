export const returnRequestModel = {
  createdDate: Date,
  updatedDate: Date,
  id: {
    type: String,
    unique: true,
    required: true,
  },
  orderId: {
    type: String,
    ref: "order",
  },
  orderNumber: {
    type: String,
    ref: "order",
  },
  userId: {
    type: String,
    ref: "user",
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
        returnQuantity: {
          // Quantity specifically for this return request
          type: Number,
          required: true,
        },
      },
    ],
    required: true,
  },
  returnRequestReason: {
    type: String,
  },
  cancelReason: {
    type: String,
  },
  adminNote: {
    type: String,
  },
  refundDescription: {
    type: String,
    default: "",
  },
  status: {
    type: String,
    enum: ["pending", "cancelled", "approved", "rejected", "received"],
    default: "pending",
  },
  shippingLabel: {
    type: String, // pdf for label
  },
  returnPaymentStatus: {
    type: String,
    enum: [
      "pending",
      "pending_refund",
      "refund_initialization_failed",
      "failed_refund",
      "cancelled_refund",
      "refunded",
    ],
  },
  refundAmount: {
    require: true,
  },
  stripeRefundId: {
    type: String,
  },
  stripeRefundFailureReason: {
    type: String,
  },
  stripeARNNumber: {
    type: String,
    default: "",
  },
};
