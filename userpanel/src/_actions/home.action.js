import { getAllMenuData, getAllMenuList } from "@/_services";
import { setMenuList } from "@/store/slices/commonSlice";

export const getMenuList = () => async (dispatch) => {
    try {
        const response = await getAllMenuData()
        if (response) {
            dispatch(setMenuList([response]));
        }
    } catch (e) {
        console.error(e);
    }
};