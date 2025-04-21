import { CATEGORIES, RING } from "@/_helper/constants";
import { productService } from "@/_services";
import { setCustomizeProductList, setCustomizeProductLoading } from "@/store/slices/productSlice";

export const fetchCustomizeProducts = () => {
    return async (dispatch) => {
        try {
            dispatch(setCustomizeProductList([]));
            dispatch(setCustomizeProductLoading(true));
            const customizProductList =
                await productService.getCustomizeProduct(
                    CATEGORIES,
                    RING
                );
            dispatch(setCustomizeProductList(customizProductList));
        } catch (e) {
            dispatch(setCustomizeProductList([]));
        } finally {
            dispatch(setCustomizeProductLoading(false));
        }
    };
};