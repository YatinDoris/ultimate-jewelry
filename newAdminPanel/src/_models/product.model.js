import { RealTimeCollaborativeTrackChanges } from 'ckeditor5-premium-features';
import {
  ALLOW_MAX_CARAT_WEIGHT,
  ALLOW_MIN_CARAT_WEIGHT,
  ALLOWED_DIA_CERTIFICATES,
  ALLOWED_DIA_CLARITIES,
  ALLOWED_DIA_COLORS,
  ALLOWED_DIA_CUTS,
  ALLOWED_DIA_FLUORESCENCE,
  ALLOWED_DIA_POLISH,
  ALLOWED_DIA_SYMMETRIES,
  ALLOWED_DIA_TYPES,
  ALLOWED_SHAPES,
} from 'src/_helpers/constants';
import { boolean } from 'yup';

export const productModel = {
  id: {
    type: String,
    unique: true,
  },
  productName: {
    type: String,
    unique: true,
  },
  images: {
    type: [
      {
        image: {
          type: String,
          require: true,
        },
      },
    ],
  },
  video: {
    type: String,
  },
  sku: {
    type: String,
    require: true,
    unique: true,
  },
  saltSKU: {
    type: String,
    require: true,
    unique: true,
  },
  discount: {
    type: Number, // in percentage
  },
  collectionIds: {
    type: Array,
    ref: 'collection',
  },
  settingStyleIds: {
    type: Array,
    ref: 'settingStyle',
  },
  categoryId: {
    type: String,
    ref: 'categories',
    require: true,
  },
  subCategoryId: {
    type: String,
    ref: 'subCategories',
    require: true,
  },
  productTypeIds: {
    type: Array,
    ref: 'productType',
    require: true,
  },
  shortDescription: {
    type: String,
  },
  description: {
    type: String,
    require: true,
  },
  variations: {
    type: [
      {
        variationId: {
          type: String,
          require: true,
        },
        variationTypes: {
          type: [
            {
              variationTypeId: {
                type: String,
                require: true,
              },
            },
          ],
        },
      },
    ],
  },
  variComboWithQuantity: {
    type: [
      {
        combination: {
          type: [
            {
              variationId: {
                type: String,
                require: true,
              },
              variationTypeId: {
                type: String,
                require: true,
              },
            },
          ],
        },
        price: {
          type: Number,
        },
        quantity: {
          type: Number,
        },
      },
    ],
  },
  isDiamondFilter: {
    type: Boolean,
    default: false,
  },
  diamondFilters: {
    // api Response Field Name ==> shape
    diamondShapeIds: {
      type: [String],
      default: [],
    },
    // api Response Field Name ==> size
    caratWeightRange: {
      min: { type: Number, default: ALLOW_MIN_CARAT_WEIGHT },
      max: { type: Number, default: ALLOW_MAX_CARAT_WEIGHT },
    },
  },
  specifications: {
    type: [
      {
        title: {
          type: String,
        },
        description: {
          type: String,
        },
      },
    ],
  },
  active: {
    type: Boolean,
    require: true,
    default: true,
  },
  salesTaxPercentage: {
    type: Number,
    default: 0,
  },
  shippingCharge: {
    type: Number,
    default: 0,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
  starRating: {
    type: Number,
    default: 0,
  },
  totalStar: {
    type: Number,
    default: 0,
  },
  createdDate: Date,
  updatedDate: Date,
};
