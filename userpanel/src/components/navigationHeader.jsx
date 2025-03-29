"use client";
import { HeaderLinkButton } from "@/app/components/button";
import { setIsMenuOpen, setOpenDropdown } from "@/store/slices/commonSlice";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { HiOutlineShoppingBag, HiOutlineUser } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";

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
      setIsHeaderVisible(currentScrollY > 128);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full bg-white shadow-md z-50 transition-transform duration-300 ${
        lastScrollY > 30 ? "translate-y-0" : "translate-y-28"
      }`}
    >
      {/* Desktop Navigation */}
      <nav
        className={`hidden lg:flex ${
          lastScrollY > 30 ? "justify-between" : "justify-center"
        }  w-full container items-center gap-6`}
      >
        <ul className={`flex ${lastScrollY > 30 ? "py-3" : "py-4"} gap-4`}>
          {menuList.map((item) => {
            const hasSubCategories = item.subCategories?.length > 0;

            return (
              <li
                key={item?.title}
                className={`relative ${lastScrollY > 30 ? "" : "pb-3"}`}
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
                  <div className="fixed left-0 right-0 top-[50px] bg-white shadow-lg z-50 border-t-2 border-primary">
                    <div className="container flex justify-center mx-auto p-6">
                      {item.subCategories.map((subItem) => (
                        <HeaderLinkButton
                          key={subItem.title}
                          href={subItem.href}
                          className="block text-gray-700 hover:text-black"
                          onClick={(e) => {
                            e.stopPropagation();
                            closeAllDropdown();
                          }}
                        >
                          {subItem.title}
                        </HeaderLinkButton>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
        {lastScrollY > 30 ? (
          <div className="text-xl flex items-center gap-5">
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
            <nav className="text-center h-screen px-4 py-2 flex flex-col gap-3">
              {menuList.map((item) => {
                const hasSubCategories = item.subCategories?.length > 0;
                const isDropdownOpen = openDropdownMobile === item.title;

                return (
                  <div key={item.title} className="flex flex-col">
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
                          {isDropdownOpen ? "▲" : "▼"}
                        </span>
                      )}
                    </button>

                    {/* Dropdown for Mobile */}
                    {hasSubCategories && isDropdownOpen && (
                      <div className="ml-4 flex flex-col gap-2">
                        {item.subCategories.map((subItem) => (
                          <HeaderLinkButton
                            key={subItem.title}
                            href={subItem.href}
                            className="block text-gray-700 hover:text-black"
                            onClick={() => {
                              dispatch(setIsMenuOpen(false));
                              closeAllDropdown();
                            }}
                          >
                            {subItem.title}
                          </HeaderLinkButton>
                        ))}
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
