"use client";
import { HeaderLinkButton } from "@/components/ui/button";
import { setIsMenuOpen, setOpenDropdown } from "@/store/slices/commonSlice";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import ringJewelry from "@/assets/images/ring.webp";
import { useCallback, useEffect, useState } from "react";
import { HiOutlineShoppingBag, HiOutlineUser } from "react-icons/hi2";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import miniLogo from "@/assets/images/logo-2.webp";
import { CustomImg } from "../dynamiComponents";
export default function NavigationHeader() {
  const dispatch = useDispatch();
  const { menuList, openDropdown, isMenuOpen } = useSelector(
    ({ common }) => common
  );

  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [openDropdownMobile, setOpenDropdownMobile] = useState(null);

  const closeAllDropdown = useCallback(() => {
    setTimeout(() => {
      dispatch(setOpenDropdown(null));
      setOpenDropdownMobile(null);
    }, 200);
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setLastScrollY(currentScrollY);
      setIsHeaderVisible(currentScrollY > 100);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <header
      className={`w-full bg-white shadow-md z-40 transition-all duration-500 ease-in-out ${
        isHeaderVisible
          ? "fixed top-0 left-0 shadow-lg"
          : "relative lg:translate-y-[40%] opacity-100"
      }`}
    >
      {/* Desktop Navigation */}
      <nav
        className={`hidden lg:flex ${
          lastScrollY > 100 ? "justify-between" : "justify-center"
        }  w-full container items-center gap-6`}
      >
        <Link href={"/"}>
          <CustomImg
            className={` ${lastScrollY > 100 ? "block w-20" : "hidden"}`}
            srcAttr={miniLogo}
          />
        </Link>
        <ul className={`flex ${lastScrollY > 100 ? "" : ""} gap-4`}>
          {menuList &&
            menuList.map((item, index) => {
              const hasSubCategories = item.subCategories?.length > 0;

              return (
                <li
                  key={`${item?.id}-${index}`}
                  className={`relative ${
                    lastScrollY > 100 ? "py-2 lg:py-6" : "pb-4"
                  } ${openDropdown ? "" : ""}`}
                  onMouseEnter={() =>
                    hasSubCategories && dispatch(setOpenDropdown(item.title))
                  }
                  onMouseLeave={() => dispatch(setOpenDropdown(null))}
                >
                  <HeaderLinkButton
                    href={item.href}
                    className="rounded-none"
                    onClick={closeAllDropdown}
                  >
                    {item?.title}
                  </HeaderLinkButton>

                  {/* Dropdown for Desktop */}
                  {hasSubCategories && openDropdown === item.title && (
                    <div
                      className={`fixed left-0 right-0 ${
                        isHeaderVisible ? "top-[60px]" : "top-[40px]"
                      } bg-white shadow-lg z-50 border-t-2 border-primary`}
                    >
                      <div className="container flex justify-between p-6">
                        <div>
                          {item.subCategories.map((subItem, index) => (
                            <div
                              key={`${subItem.title}-${index}`}
                              className="relative px-4"
                            >
                              <HeaderLinkButton
                                href={subItem.href}
                                className="block !font-semibold capitalize text-primary !px-0 mb-1"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  closeAllDropdown();
                                }}
                              >
                                {subItem.title}
                              </HeaderLinkButton>
                              <div className="w-5 h-1 rounded-full bg-primary bottom-0"></div>
                            </div>
                          ))}
                          <div className="mt-3">
                            {item?.subCategories[0]?.productTypes &&
                              item?.subCategories[0]?.productTypes.map(
                                (productType, index) => {
                                  return (
                                    <HeaderLinkButton
                                      key={`${productType.title}-${index}3`}
                                      href={productType.href}
                                      className="text-basegray hover:text-baseblack transition-all duration-300 capitalize"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        closeAllDropdown();
                                      }}
                                    >
                                      {productType.title}
                                    </HeaderLinkButton>
                                  );
                                }
                              )}
                          </div>
                        </div>
                        <div>
                          <CustomImg srcAttr={ringJewelry} className="w-80" />
                          <div className="text-sm mt-3">
                            <h3>Pure Value Diamonds</h3>
                            <Link
                              href={"#"}
                              className="underline hover:text-primary transition-all duration-300"
                            >
                              Shop Now
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
        </ul>
        {lastScrollY > 100 ? (
          <div className="text-xl flex py-6 items-center gap-5">
            <HiOutlineUser />
            <Link href="/cart">
              <HiOutlineShoppingBag />
            </Link>
          </div>
        ) : null}
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden"
          >
            <nav className=" h-screen px-4 py-2 flex flex-col gap-3">
              {menuList.map((item, index) => {
                const hasSubCategories = item.subCategories?.length > 0;
                const isDropdownOpen = openDropdownMobile === item.title;

                return (
                  <div
                    key={`${item.title}-${index}4`}
                    className="flex flex-col"
                  >
                    <button
                      className="text-gray-700 hover:text-black flex justify-between items-center w-full py-2"
                      onClick={() =>
                        hasSubCategories
                          ? setOpenDropdownMobile(
                              isDropdownOpen ? null : item.title
                            )
                          : dispatch(setIsMenuOpen(false))
                      }
                    >
                      {item.title}
                      {hasSubCategories && (
                        <span className="text-lg">
                          {isDropdownOpen ? (
                            <IoIosArrowUp />
                          ) : (
                            <IoIosArrowDown />
                          )}
                        </span>
                      )}
                    </button>

                    {/* Dropdown for Mobile */}
                    {hasSubCategories && isDropdownOpen && (
                      <div className=" gap-2 flex flex-col">
                        {item.subCategories.map((subItem, index) => (
                          <HeaderLinkButton
                            key={`${subItem.title}-${index}5`}
                            href={subItem.href}
                            className="block !font-semibold"
                            onClick={() => {
                              dispatch(setIsMenuOpen(false));
                              closeAllDropdown();
                            }}
                          >
                            {subItem.title}
                          </HeaderLinkButton>
                        ))}
                        <div className="mt-1">
                          {item?.subCategories[0]?.productTypes &&
                            item?.subCategories[0]?.productTypes.map(
                              (productType, index) => {
                                return (
                                  <HeaderLinkButton
                                    key={`${productType.title}-${index}6`}
                                    href={productType.href}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      closeAllDropdown();
                                    }}
                                  >
                                    {productType.title}
                                  </HeaderLinkButton>
                                );
                              }
                            )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
