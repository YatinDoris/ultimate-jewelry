import { helperFunctions } from "./helperFunctions";

export const timeSlots = [
  { label: "Select a time slot", value: "" },
  { label: "10:00", value: "10:00" },
  { label: "10:30", value: "10:30" },
  { label: "11:00", value: "11:00" },
  { label: "11:30", value: "11:30" },
  { label: "12:00", value: "12:00" },
  { label: "12:30", value: "12:30" },
  { label: "13:00", value: "13:00" },
  { label: "13:30", value: "13:30" },
  { label: "14:00", value: "14:00" },
  { label: "14:30", value: "14:30" },
  { label: "15:00", value: "15:00" },
  { label: "15:30", value: "15:30" },
  { label: "16:00", value: "16:00" },
  { label: "16:30", value: "16:30" },
  { label: "17:00", value: "17:00" },
  { label: "17:30", value: "17:30" },
  { label: "18:00", value: "18:00" },
];

export const headerLinks = [
  { to: "/", label: "Home" },
  { to: "/profile", label: "Profile" },
  { to: "/orderHistory", label: "Orders History" },
  { to: "/returnHistory", label: "Returns History" },
];

export const GOLD_TYPES = "Gold Type";
export const GOLD_COLOR = "Gold Color";

export const TOP_SELLING_PRODUCTS = "Top Selling Products";

export const ENGAGEMENT_RINGS = [
  {
    type: "categories",
    title: "Engagement Rings",
    href: "/engagement-rings",
    id: helperFunctions.generateUniqueId(),
    subCategories: [
      {
        type: "subCategories",
        title: "Design Your Own Engagement Ring",
        id: helperFunctions.generateUniqueId(),
        href: "/engagement-rings/settings?format=sws",
        productTypes: [
          {
            type: "productTypes",
            title: "Start With A Setting",
            id: helperFunctions.generateUniqueId(),
            href: "/engagement-rings/settings?format=sws",
          },
          {
            type: "productTypes",
            title: "Start With A Diamond",
            id: helperFunctions.generateUniqueId(),
            href: "/engagement-rings/start-with-a-diamond?format=swd",
          },
          {
            type: "productTypes",
            title: "Start With A Lab Grown Diamond",
            id: helperFunctions.generateUniqueId(),
            href: "/engagement-rings/start-with-a-diamond/lab?format=swd",
          },
        ],
      },
      {
        type: "subCategories",
        title: "Shop By Shape",
        href: "/diamonds/shop-by-shape/shop-all",
        id: helperFunctions.generateUniqueId(),
        productTypes: [
          {
            type: "productTypes",
            title: "Round",
            id: helperFunctions.generateUniqueId(),
            href: "/diamonds/shop-by-shape/Round",
          },
          {
            type: "productTypes",
            title: "Emerald",
            href: "/diamonds/shop-by-shape/Emerald",
            id: helperFunctions.generateUniqueId(),
          },
        ],
      },
    ],
  },
];

export const DIAMONDS = [
  {
    type: "categories",
    title: "Diamonds",
    href: "/diamonds",
    id: helperFunctions.generateUniqueId(),
    subCategories: [
      {
        type: "subCategories",
        title: "Design Own Rings",
        id: helperFunctions.generateUniqueId(),
        href: "/diamonds",
        productTypes: [
          {
            type: "productTypes",
            title: "Design Your Own Diamond Ring",
            id: helperFunctions.generateUniqueId(),
            href: "/engagement-rings/start-with-a-diamond?format=swd",
          },
          {
            type: "productTypes",
            title: "Design Your Own Lab Diamond Ring",
            id: helperFunctions.generateUniqueId(),
            href: "/engagement-rings/start-with-a-diamond/lab?format=swd",
          },
          // {
          //   type: "productTypes",
          //   title: "Design Your Own Diamond Earring",
          //   id: helperFunctions.generateUniqueId(),
          //   href: "engagement-rings/start-with-a-diamond",
          // },
          // {
          //   type: "productTypes",
          //   title: "Design Your Own Diamond Necklace",
          //   id: helperFunctions.generateUniqueId(),
          //   href: "engagement-rings/start-with-a-diamond",
          // },
        ],
      },
      {
        type: "subCategories",
        title: "Shop By Shape",
        href: "/diamonds/shop-by-shape/shop-all",
        id: helperFunctions.generateUniqueId(),
        productTypes: [
          {
            type: "productTypes",
            title: "Round",
            id: helperFunctions.generateUniqueId(),
            href: "/diamonds/shop-by-shape/Round",
          },
          {
            type: "productTypes",
            title: "Emerald",
            href: "/diamonds/shop-by-shape/Emerald",
            id: helperFunctions.generateUniqueId(),
          },
        ],
      },
    ],
  },
];

export const ALLOWED_PRODUCT_TYPES = [
  { title: "Rings", value: "Rings" },
  { title: "Necklaces", value: "Necklaces" },
  { title: "Earrings", value: "Earrings" },
  { title: "Bracelets", value: "Bracelets" },
  { title: "Watches", value: "Watches" },
];

export const ALLOWED_DIA_TYPES = [
  {
    title: "Natural",
    value: "natural_diamond",
  },
  {
    title: "Lab Grouwn",
    value: "lab_grown_diamond",
  },
];

export const ALLOWED_DIA_CUTS = [
  {
    title: "Fair",
    value: "Fair",
  },
  {
    title: "Good",
    value: "Good",
  },
  {
    title: "Very Good",
    value: "Very Good",
  },
  {
    title: "Ideal",
    value: "Ideal",
  },
  {
    title: "Super Ideal",
    value: "Super Ideal",
  },
];

export const ALLOWED_DIA_COLORS = [
  {
    title: "J - Near Colorless",
    value: "J",
  },
  {
    title: "I - Near Colorless",
    value: "I",
  },
  {
    title: "H - Near Colorless",
    value: "H",
  },
  {
    title: "G - Near Colorless",
    value: "G",
  },
  {
    title: "F - Colorless",
    value: "F",
  },
  {
    title: "E - Colorless",
    value: "E",
  },
  {
    title: "D - Colorless",
    value: "D",
  },
];

export const ALLOWED_DIA_CLARITIES = [
  {
    title: "Slightly Included (SI2)",
    value: "SI2",
  },
  {
    title: "Slightly Included (SI1)",
    value: "SI1",
  },
  {
    title: "Very Slightly Included (VS2)",
    value: "VS2",
  },
  {
    title: "Very Slightly Included (VS1)",
    value: "VS1",
  },
  {
    title: "Very, Very Slightly Included (VVS2)",
    value: "VVS2",
  },
  {
    title: "Very, Very Slightly Included (VVS1)",
    value: "VVS1",
  },
  {
    title: "Internally Flawless (IF)",
    value: "IF",
  },
  {
    title: "Flawless (FL)",
    value: "FL",
  },
];

export const ALLOWED_DIA_FLUORESCENCE = [
  {
    title: "Very Strong",
    value: "Very Strong",
  },
  {
    title: "Strong",
    value: "Strong",
  },
  {
    title: "Medium",
    value: "Medium",
  },
  {
    title: "Faint",
    value: "Faint",
  },
  {
    title: "None",
    value: "None",
  },
];

export const ALLOWED_DIA_POLISH = [
  {
    title: "Good",
    value: "Good",
  },
  {
    title: "Very Good",
    value: "Very Good",
  },
  {
    title: "Excellent",
    value: "Excellent",
  },
];

export const ALLOWED_DIA_SYMMETRIES = [
  {
    title: "Good",
    value: "Good",
  },
  {
    title: "Very Good",
    value: "Very Good",
  },
  {
    title: "Excellent",
    value: "Excellent",
  },
];

export const ALLOWED_DIA_CERTIFICATES = [
  {
    title: "IGI",
    value: "IGI",
  },
  {
    title: "GIA",
    value: "GIA",
  },
  {
    title: "HRD",
    value: "HRD",
  },
];

export const sortByList = [
  { value: "date_new_to_old", title: "NEW TO OLD" },
  { value: "date_old_to_new", title: "OLD TO NEW" },
  { value: "price_high_to_low", title: "HIGH TO LOW" },
  { value: "price_low_to_high", title: "LOW TO HIGH" },
  { value: "alphabetically_a_to_z", title: "A-Z" },
  { value: "alphabetically_z_to_a", title: "Z-A" },
];

export const messageType = {
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
  INFO: "INFO",
  WARNING: "WARNING",
};
