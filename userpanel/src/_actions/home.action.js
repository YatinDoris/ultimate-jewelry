import { getAllMenuData, getAllMenuList } from "@/_services";
import { setMenuList } from "@/store/slices/commonSlice";

export const getMenuList = () => async (dispatch) => {
    try {
        const response = await getAllMenuList()
        if (response) {
            dispatch(setMenuList(response));
        }
    } catch (e) {
        console.error(e);
    }
};