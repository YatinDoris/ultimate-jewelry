import Link from "next/link";
import { SlDiamond } from "react-icons/sl";
import { HiOutlineUser, HiOutlineShoppingBag } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { getMenuList } from "@/_actions/home.action";
import { useEffect, useState } from "react";
import { CustomImg, NavigationHeader } from "./dynamiComponents";
import { setIsMenuOpen, setLastScrollY } from "@/store/slices/commonSlice";
import { IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import logo from "@/assets/images/logo-2.webp";

export default function Header() {
  const dispatch = useDispatch();
  const { isMenuOpen, lastScrollY } = useSelector(({ common }) => common);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);

  const toggleMenu = () => dispatch(setIsMenuOpen(!isMenuOpen));
  useEffect(() => {
    dispatch(getMenuList());
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setLastScrollY(currentScrollY);
      setIsHeaderVisible(currentScrollY > 100);

      if (currentScrollY > lastScrollY && currentScrollY > 300) {
        dispatch(setIsMenuOpen(false));
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
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
      <header
        className={`${
          isHeaderVisible
            ? "fixed top-0 left-0 shadow-lg lg:static lg:top-0 lg:left-0"
            : ""
        } w-full bg-white z-50 shadow transition-all duration-300`}
      >
        <div className="flex justify-between items-center py-4 lg:pt-4 lg:pb-0  px-6 lg:px-20">
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
          <Link href={"/"}>
            <CustomImg srcAttr={logo} className="w-28 lg:w-40" />
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
