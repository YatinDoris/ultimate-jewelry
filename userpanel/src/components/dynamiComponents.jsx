"use client";
import dynamic from "next/dynamic";

// Common Component
export const Header = dynamic(() => import("./layout/header.jsx"), {
  ssr: false,
});
export const Footer = dynamic(() => import("./layout/footer.jsx"), {
  ssr: false,
});
export const ProgressiveImg = dynamic(() => import("./ui/progressive-img"), {
  ssr: false,
});

export const CustomImg = dynamic(() => import("./ui/custom-img"), {
  ssr: false,
});

export const Lenis = dynamic(() => import("./layout/lenis"), { ssr: false });
export const StoreProvider = dynamic(() => import("@/store/provider"), {
  ssr: false,
});

export const NavigationHeader = dynamic(
  () => import("./layout/navigationHeader"),
  {
    ssr: false,
  }
);

export const ProductGrid = dynamic(() => import("./shop/productGrid"), {
  ssr: false,
});

export const AnimatedSection = dynamic(() => import("./ui/AnimatedSection"), {
  ssr: false,
});

export const SwipperHomePageBig = dynamic(
  () => import("./ui/SwipperHomePageBig.jsx"),
  {
    ssr: false,
  }
);

export const TestimonialSlider = dynamic(
  () => import("./ui/TestimonialSlider.jsx"),
  {
    ssr: false,
  }
);

export const AccordionDropdown = dynamic(
  () => import("./ui/AccordionDropdown"),
  {
    ssr: false,
  }
);

export const ProductSwiper = dynamic(() => import("./shop/productSwiper.jsx"), {
  ssr: false,
});

export const ProductFilterSidebar = dynamic(
  () => import("./shop/productFilterSidebar"),
  {
    ssr: false,
  }
);
export const LoginForm = dynamic(() => import("./auth/LoginForm.jsx"), {
  ssr: false,
});
export const SignUpForm = dynamic(() => import("./auth/SignUpForm.jsx"), {
  ssr: false,
});
export const VerifyOTPForm = dynamic(() => import("./auth/VerifyOTPForm.jsx"), {
  ssr: false,
});
export const CheckoutCommonComponent = dynamic(
  () => import("./ui/checkout/CheckoutCommonComponent.jsx"),
  {
    ssr: false,
  }
);

export const CheckoutBreadcrumb = dynamic(
  () => import("./ui/checkout/CheckoutBreadcrumb.jsx"),
  {
    ssr: false,
  }
);
