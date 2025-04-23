import { CATEGORIES, RING } from "@/_helper/constants";
import { productService } from "@/_services";
import { setCustomizeProductList, setCustomizeProductLoading, setUniqueFilterOptions } from "@/store/slices/productSlice";
import { getUniqueFilterOptions } from "./product.actions";

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
            if (customizProductList) {
                const tempUniqueFilterOptions = getUniqueFilterOptions(
                    customizProductList
                );
                const uniqueFilterOptions = { ...tempUniqueFilterOptions };
                console.log('first', uniqueFilterOptions)
                dispatch(setUniqueFilterOptions(uniqueFilterOptions));
            }

            dispatch(setCustomizeProductList(customizProductList));
        } catch (e) {
            dispatch(setCustomizeProductList([]));
        } finally {
            dispatch(setCustomizeProductLoading(false));
        }
    };
};