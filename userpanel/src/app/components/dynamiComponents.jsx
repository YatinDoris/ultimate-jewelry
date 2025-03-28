"use client";
import dynamic from "next/dynamic";

// Common Component
export const Header = dynamic(() => import("./header"), { ssr: false });
export const Footer = dynamic(() => import("./footer"), { ssr: false });
// export const CustomImage = dynamic(() => import("./customImage"), {
//   ssr: false,
// });

export const Layout = dynamic(() => import("./layout"), { ssr: false });
export const Lenis = dynamic(() => import("./lenis"), { ssr: false });
export const StoreProvider = dynamic(() => import("@/store/provider"), {
  ssr: false,
});
