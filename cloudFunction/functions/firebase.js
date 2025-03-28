const admin = require("firebase-admin");

const defaultConfig = {
  apiKey: "AIzaSyC064Ksp5pi_1Gz9IRHyXa3B6YXGlJ5hFc",
  authDomain: "qa-ultimate-jewelry.firebaseapp.com",
  // databaseURL: defaultDbUrl,
  projectId: "qa-ultimate-jewelry",
  messagingSenderId: "721532326526",
  appId: "1:721532326526:web:488d4ee1257c6bc849fe2f",
};

const defaultApp = admin.initializeApp({
  ...defaultConfig,
  databaseURL: "https://qa-ultimate-jewelry-default-rtdb.firebaseio.com",
});

const cmsApp = admin.initializeApp(
  {
    ...defaultConfig,
    databaseURL: "https://qa-ultimate-jewelry-cms.firebaseio.com",
  },
  "cmsApp"
);

const amsApp = admin.initializeApp(
  {
    ...defaultConfig,
    databaseURL: "https://qa-ultimate-jewelry-ams.firebaseio.com",
  },
  "amsApp"
);

const productsApp = admin.initializeApp(
  {
    ...defaultConfig,
    databaseURL: "https://qa-ultimate-jewelry-products.firebaseio.com",
  },
  "productsApp"
);

const cartsApp = admin.initializeApp(
  {
    ...defaultConfig,
    databaseURL: "https://qa-ultimate-jewelry-carts.firebaseio.com",
  },
  "cartsApp"
);

const ordersApp = admin.initializeApp(
  {
    ...defaultConfig,
    databaseURL: "https://qa-ultimate-jewelry-orders.firebaseio.com",
  },
  "ordersApp"
);

const reviewAndRatingApp = admin.initializeApp(
  {
    ...defaultConfig,
    databaseURL: "https://qa-ultimate-jewelry-reviewandrating.firebaseio.com",
  },
  "reviewAndRatingApp"
);

const appointmentApp = admin.initializeApp(
  {
    ...defaultConfig,
    databaseURL: "https://qa-ultimate-jewelry-appointment.firebaseio.com",
  },
  "appointmentApp"
);

const customJewelryApp = admin.initializeApp(
  {
    ...defaultConfig,
    databaseURL: "https://qa-ultimate-jewelry-customjewelry.firebaseio.com",
  },
  "customJewelryApp"
);

const subscribersApp = admin.initializeApp(
  {
    ...defaultConfig,
    databaseURL: "https://qa-ultimate-jewelry-subscribers.firebaseio.com",
  },
  "subscribersApp"
);

const returnsApp = admin.initializeApp(
  {
    ...defaultConfig,
    databaseURL: "https://qa-ultimate-jewelry-returns.firebaseio.com",
  },
  "returnsApp"
);

const storageApp = admin.initializeApp(
  {
    ...defaultConfig,
    storageBucket: "qa-ultimate-jewelry.firebasestorage.app",
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
