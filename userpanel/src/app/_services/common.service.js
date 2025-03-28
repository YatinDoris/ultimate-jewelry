import { fetchWrapperService, helperFunctions, productsUrl, sanitizeValue } from "../_helper";
import { DIAMONDS_LIST } from "../_helper/diamondsList";
import { productService } from "./product.service";

const getSingleProductAndDiamondDataById = async ({ productId, diamondId }) => {
    return new Promise(async (resolve, reject) => {
      try {
        productId = sanitizeValue(productId)
        ? productId.trim()
        : null;

        diamondId = sanitizeValue(diamondId)
        ? diamondId.trim()
        : null;

        if(!productId || !diamondId){
          reject(new Error("Invalid Data"));
          return;
        }
        const productFindPattern = { id: productId };
  
        // Fetch both product and diamond in parallel
        const [singleProductData, singleDiamondData] = await Promise.all([
          fetchWrapperService?.findOne(productsUrl, productFindPattern),
          DIAMONDS_LIST?.find((diamond) => Number(diamond?.id) === Number(diamondId)),
        ]);
  
        if (!singleProductData || !singleDiamondData) {
          reject(new Error("Product or Diamond does not exist"));
          return;
        }
  
        // Process product data
        const processedProductData = await productService?.getProcessProducts(singleProductData);
        if (!processedProductData) {
          reject(new Error("Product data processing failed"));
          return;
        }
  
        resolve({
          product: processedProductData || {},
          diamond: singleDiamondData || {},
        });
      } catch (e) {
        reject(e);
      }
    });
  };
  
  export const commonService = {
    getSingleProductAndDiamondDataById,
  };
  