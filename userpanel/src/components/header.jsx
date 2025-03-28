import Link from "next/link";
import { SlDiamond } from "react-icons/sl";
import { HiOutlineUser, HiOutlineShoppingBag } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { getMenuList } from "@/_actions/home.action";
import { useEffect } from "react";
import { NavigationHeader } from "./dynamiComponents";
import { setIsMenuOpen } from "@/store/slices/commonSlice";
import { IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

export default function Header() {
  const dispatch = useDispatch();
  const { isMenuOpen } = useSelector(({ common }) => common);
  const toggleMenu = () => dispatch(setIsMenuOpen(!isMenuOpen));

  useEffect(() => {
    dispatch(getMenuList());
  }, [dispatch]);

  return (
    <div>
      {/* Announcement Bar */}
      <div className="bg-primary text-center text-white text-xs lg:text-sm py-3">
        <p>
          Free 1ct Diamond Pendant with Purchase of $3,000 or More.
          <Link href={"#"}></Link>
        </p>
      </div>

      {/* Header */}
      <header className=" shadow bg-white">
        <div className="flex justify-between items-center py-4 px-6 lg:px-20">
          <Link href={"/contact-us"} className="hidden lg:flex gap-2">
            <SlDiamond className="text-lg text-baseblack" />
            <h3 className="uppercase text-base">Contact us</h3>
          </Link>
          <button
            className="lg:hidden p-1.5 xxs:p-2 hover:bg-black/10 rounded-full text-black transition-colors"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <RxCross2 className="w-5 h-5 xxs:w-6 xxs:h-6" />
            ) : (
              <IoMenu className="w-5 h-5 xxs:w-6 xxs:h-6" />
            )}
          </button>
          <Link
            href={"/"}
            className="uppercase text-2xl lg:text-4xl font-castoro tracking-wider text-black"
          >
            Ultimate Jewelry
          </Link>

          <div className="text-xl flex items-center gap-5">
            <HiOutlineUser className="hidden lg:block" />
            <Link href="/cart">
              <HiOutlineShoppingBag />
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <NavigationHeader />
      </header>
    </div>
  );
}
