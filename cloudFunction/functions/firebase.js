const admin = require("firebase-admin");

const defaultConfig = {
  apiKey: "AIzaSyAHBeUeD6yvtmOJLSB-13n4JXAS9eHVgxE",
  authDomain: "shopnimbus-ec7fe.firebaseapp.com",
  // databaseURL: defaultDbUrl,
  projectId: "shopnimbus-ec7fe",
  messagingSenderId: "756187023654",
  appId: "1:756187023654:web:0a64754f933d9c2e00d9e7",
};

const defaultApp = admin.initializeApp({
  ...defaultConfig,
  databaseURL: "https://shopnimbus-ec7fe-default-rtdb.firebaseio.com",
});

const cmsApp = admin.initializeApp(
  {
    ...defaultConfig,
    databaseURL: "https://shopnimbus-cms.firebaseio.com",
  },
  "cmsApp"
);

const amsApp = admin.initializeApp(
  {
    ...defaultConfig,
    databaseURL: "https://shopnimbus-ams.firebaseio.com",
  },
  "amsApp"
);

const productsApp = admin.initializeApp(
  {
    ...defaultConfig,
    databaseURL: "https://shopnimbus-products.firebaseio.com",
  },
  "productsApp"
);

const cartsApp = admin.initializeApp(
  {
    ...defaultConfig,
    databaseURL: "https://shopnimbus-carts.firebaseio.com",
  },
  "cartsApp"
);

const ordersApp = admin.initializeApp(
  {
    ...defaultConfig,
    databaseURL: "https://shopnimbus-orders.firebaseio.com",
  },
  "ordersApp"
);

const reviewAndRatingApp = admin.initializeApp(
  {
    ...defaultConfig,
    databaseURL: "https://shopnimbus-reviewandrating.firebaseio.com",
  },
  "reviewAndRatingApp"
);

const appointmentApp = admin.initializeApp(
  {
    ...defaultConfig,
    databaseURL: "https://shopnimbus-appointment.firebaseio.com",
  },
  "appointmentApp"
);

const customJewelryApp = admin.initializeApp(
  {
    ...defaultConfig,
    databaseURL: "https://shopnimbus-customjewelry.firebaseio.com",
  },
  "customJewelryApp"
);

const subscribersApp = admin.initializeApp(
  {
    ...defaultConfig,
    databaseURL: "https://shopnimbus-subscribers.firebaseio.com",
  },
  "subscribersApp"
);

const returnsApp = admin.initializeApp(
  {
    ...defaultConfig,
    databaseURL: "https://shopnimbus-returns.firebaseio.com",
  },
  "returnsApp"
);

const storageApp = admin.initializeApp(
  {
    ...defaultConfig,
    storageBucket: "shopnimbus-ec7fe.appspot.com",
  },
  "storageApp"
);

const defaultDbInstance = defaultApp.database();
const cmsDbInstance = cmsApp.database();
const amsDbInstance = amsApp.database();
const productsDbInstance = productsApp.database();
const cartsDbInstance = cartsApp.database();
const ordersDbInstance = ordersApp.database();
const returnsDbInstance = returnsApp.database();
const reviewAndRatingDbInstance = reviewAndRatingApp.database();
const appointmentDbInstance = appointmentApp.database();

module.exports = {
  defaultApp,
  cmsApp,
  amsApp,
  productsApp,
  cartsApp,
  ordersApp,
  reviewAndRatingApp,
  appointmentApp,
  customJewelryApp,
  subscribersApp,
  returnsApp,
  storageApp,
  defaultDbInstance,
  cmsDbInstance,
  amsDbInstance,
  productsDbInstance,
  cartsDbInstance,
  ordersDbInstance,
  reviewAndRatingDbInstance,
  appointmentDbInstance,
  returnsDbInstance,
};
