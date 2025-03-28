import { fetchWrapperService } from "../_helper";
import { productService } from "./product.service";

const showCaseBannerUrl = process.env.REACT_APP_SHOW_CASE_BANNERS;

const getAllShowCaseBanner = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const respData = await fetchWrapperService.getAll(showCaseBannerUrl);
      const showCaseBannerData = respData ? Object.values(respData) : [];
      resolve(showCaseBannerData);
    } catch (e) {
      reject(e);
    }
  });
};

const getAllShowCaseBannerWithProduct = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const showCaseBannerData = await getAllShowCaseBanner();
      const allActiveProductsData = await productService.getAllActiveProducts();

      if (showCaseBannerData.length && allActiveProductsData.length) {
        // eslint-disable-next-line array-callback-return
        const showCaseBannerWithProduct = showCaseBannerData
          .map((bannerItem) => {
            const findedProduct = allActiveProductsData.find(
              (product) => product.id === bannerItem.productId
            );

            if (findedProduct) {
              return {
                ...bannerItem,
                productImages: getImagesArrayof8Size(findedProduct.images),
                productName: findedProduct.productName,
                shortDescription: findedProduct?.shortDescription,
                active: findedProduct?.active,
              };
            }
          })
          .filter(Boolean);

        resolve(showCaseBannerWithProduct);
      } else {
        resolve();
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getImagesArrayof8Size = (imgList = []) => {
  let images = [...imgList];
  if (imgList?.length >= 8) return images?.slice(0, 8);
  if (imgList?.length < 8) {
    return getImagesArrayof8Size([...imgList, ...images]);
  }
};

export const showCaseBannerService = {
  getAllShowCaseBanner,
  getAllShowCaseBannerWithProduct,
};
