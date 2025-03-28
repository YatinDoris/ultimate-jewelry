import { fetchWrapperService, helperFunctions } from "../_helper";
import { productService } from "./product.service";

const productSliderUrl = process.env.REACT_APP_PRODUCT_SLIDER;
const brandSliderUrl = process.env.REACT_APP_BRAND_SLIDER;

const getAllProductSlider = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const respData = await fetchWrapperService.getAll(productSliderUrl);
      const productSliderData = respData ? Object.values(respData) : [];
      resolve(productSliderData);
    } catch (e) {
      reject(e);
    }
  });
};

const getAllBrandSlider = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const respData = await fetchWrapperService.getAll(brandSliderUrl);
      const brandSliderData = respData ? Object.values(respData) : [];
      resolve(brandSliderData);
    } catch (e) {
      reject(e);
    }
  });
};

const getAllProductSliderWithProduct = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const productSliderData = await getAllProductSlider();
      const allActiveProductsData = await productService.getAllActiveProducts();

      if (productSliderData.length && allActiveProductsData.length) {
        // eslint-disable-next-line array-callback-return
        const productSliderWithProduct = productSliderData
          .map((sliderItem) => {
            const foundProduct = allActiveProductsData.find(
              (product) => product.id === sliderItem.productId
            );

            if (!foundProduct) return null;

            const { price = 0 } = helperFunctions.getMinPriceVariCombo(
              foundProduct?.variComboWithQuantity
            );
            return {
              ...sliderItem,
              productImage: foundProduct.images[0].image,
              productName: foundProduct.productName,
              basePrice: price,
              baseSellingPrice: helperFunctions.getSellingPrice(
                price,
                foundProduct.discount
              ),
              discount: foundProduct.discount,
            };
          })
          .filter((item) => item !== null);

        resolve(productSliderWithProduct);
      } else {
        resolve();
      }
    } catch (e) {
      reject(e);
    }
  });
};

export const sliderService = {
  getAllProductSlider,
  getAllBrandSlider,
  getAllProductSliderWithProduct,
};
