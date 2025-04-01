"use client";
import dynamic from "next/dynamic";

// Common Component
export const Header = dynamic(() => import("./header"), { ssr: false });
export const Footer = dynamic(() => import("./footer"), { ssr: false });
export const ProgressiveImg = dynamic(() => import("./progressive-img"), {
  ssr: false,
});

export const CustomImg = dynamic(() => import("./custom-img"), {
  ssr: false,
});

export const Layout = dynamic(() => import("./layout"), { ssr: false });
export const Lenis = dynamic(() => import("./lenis"), { ssr: false });
export const StoreProvider = dynamic(() => import("@/store/provider"), {
  ssr: false,
});

export const NavigationHeader = dynamic(() => import("./navigationHeader"), {
  ssr: false,
});

export const ProductGrid = dynamic(() => import("./productGrid"), {
  ssr: false,
});

export const MarqueeBrandsHome = dynamic(() => import("./MarqueeBrandsHome"), {
  ssr: false,
});

export const AnimatedSection = dynamic(() => import("./AnimatedSection"), {
  ssr: false,
});

export const SwipperHomePageBig = dynamic(
  () => import("./SwipperHomePageBig"),
  {
    ssr: false,
  }
);

export const TestimonialSlider = dynamic(() => import("./TestimonialSlider"), {
  ssr: false,
});

export const AccordionDropdown = dynamic(() => import("./AccordionDropdown"), {
  ssr: false,
});
