import Link from "next/link";
import { SlDiamond } from "react-icons/sl";
import { HiOutlineUser } from "react-icons/hi";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { getMenuList } from "@/_actions/home.action";
import { useEffect } from "react";
import { setMenuDropDownOpen } from "@/store/slices/commonSlice";
export default function Header() {
  const dispatch = useDispatch();
  const { menuList, isMenuDropDownOpen } = useSelector(({ common }) => common);

  useEffect(() => {
    dispatch(getMenuList());
  }, [dispatch]);
  console.log("menuList", menuList);
  return (
    <div>
      <div className="bg-primary text-center text-white text-sm py-3">
        <p>
          Free 1ct Diamond Pendant with Purchase of $3,000 or More.{" "}
          <Link href={"#"}></Link>{" "}
        </p>
      </div>
      <header>
        <div className="flex justify-between items-center py-4 px-20 bg-white shadow">
          <Link href={"/contact-us"} className="flex gap-2">
            {" "}
            <SlDiamond className="text-lg text-baseblack" />
            <h3 className="uppercase text-base text-same">Contact us</h3>
          </Link>

          <Link
            href={"/"}
            className="uppercase text-4xl font-castoro tracking-wider text-black"
          >
            Ultimate Jewelry
          </Link>
          <div className="text-xl flex items-center gap-5">
            <HiOutlineUser />
            <Link href="/cart">
              <HiOutlineShoppingBag />
            </Link>
          </div>
        </div>
        {/* 
         */}
      </header>
    </div>
  );
}
``;
