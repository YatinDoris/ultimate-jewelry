"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
const containedBtn = "bg-white border border-white ";
const outlinedBtn = "border-2 border-white text-white bg-transparent";
const primaryBtn = `
  rounded
  text-xs
  xxs:text-sm
  xs:text-base
  h-8
  xxs:h-9
  xs:h-10
  lg:h-[2.7rem]
  px-3
  xxs:px-4
  lg:px-5
  lg:py-5
  min-w-[80px]
  xxs:min-w-[90px]
  xs:min-w-[100px]
  lg:min-w-[144px]
  4xl:min-w-[180px]
  text-white
  flex
  items-center
  justify-center
  font-medium
  duration-400
  transition-all
  ease-linear
  whitespace-nowrap
`;

/**
 *
 * @param {*} href, className, rest props
 * @returns Link for header with active class
 */
export const HeaderLinkButton = ({
  href = "#",
  className = "",
  activeItem,
  ...rest
}) => {
  const pathname = usePathname();
  const isActive =
    pathname === href || activeItem
      ? "text-primary font-semibold"
      : "!font-normal";

  return (
    <Link
      href={href}
      rel="noopener noreferrer"
      className={`uppercase text-sm  tracking-widest 2xl:text-base px-4 hover:text-primary   transition-all duration-300 ${isActive} ${className}`}
      {...rest}
    >
      {rest.children}
    </Link>
  );
};

export const LinkButton = ({
  href = "",
  className = "",
  arrow = false,
  collectionArrow = false,
  roundedArrow = false,
  arrowColor = "black",
  children,
  ...rest
}) => {
  return (
    <Link
      href={href}
      rel="noopener noreferrer"
      className={`flex gap-2 overflow-hidden  items-center  group transition-all duration-300 ease-in-out hover:bg-transparent hover:text-white ${containedBtn} ${primaryBtn} ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
};

/**
 *
 * @param {*} href, className, rest props
 * @returns Button with border/bg
 * @description contained/outlined button
 */

export const Button = ({ className = "", variant = "contained", ...rest }) => {
  return (
    <button
      className={`${
        variant === "contained" ? containedBtn : outlinedBtn
      } ${primaryBtn} ${className}`}
      {...rest}
    />
  );
};
