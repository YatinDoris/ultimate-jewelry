"use client";
import dynamic from "next/dynamic";

// Common Component
export const Header = dynamic(() => import("./layout/header.jsx"), {
  ssr: false,
});
export const Footer = dynamic(() => import("./layout/footer.jsx"), {
  ssr: false,
});

export const ProfileHeader = dynamic(
  () => import("./layout/profile/header.jsx"),
  {
    ssr: false,
  }
);

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

export const ProfileNavigationHeader = dynamic(
  () => import("./layout/profile/navigationHeader.jsx"),
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

export const CartPage = dynamic(() => import("./ui/cart/CartPage.jsx"), {
  ssr: false,
});

export const LatestProduct = dynamic(() => import("./ui/LatestProduct.jsx"), {
  ssr: false,
});

export const CheckoutForm = dynamic(
  () => import("./ui/checkout/CheckoutForm.jsx"),
  {
    ssr: false,
  }
);
export const AddressVerificationModal = dynamic(
  () => import("./ui/checkout/AddressVerificationModal.jsx"),
  {
    ssr: false,
  }
);

export const ShippingForm = dynamic(
  () => import("./ui/shipping/ShippingForm.jsx"),
  {
    ssr: false,
  }
);
export const HomePage = dynamic(() => import("./ui/home/HomePage.jsx"), {
  ssr: false,
});
export const CheckoutPage = dynamic(
  () => import("./ui/checkout/CheckoutPage.jsx"),
  {
    ssr: false,
  }
);
export const CollectionPage = dynamic(() => import("./ui/CollectionPage.jsx"), {
  ssr: false,
});

export const ShippingPage = dynamic(
  () => import("./ui/shipping/ShippingPage.jsx"),
  {
    ssr: false,
  }
);
export const NotFoundPage = dynamic(() => import("./ui/NotFoundPage.jsx"), {
  ssr: false,
});

export const OrderSuccessfulPage = dynamic(
  () => import("./ui/order/OrderSuccessfulPage.jsx"),
  {
    ssr: false,
  }
);

export const ProductDetailSwipperSm = dynamic(
  () => import("./shop/ProductDetailSwipperSm.jsx"),
  {
    ssr: false,
  }
);

export const ProgressiveVed = dynamic(
  () => import("./ui/progressive-ved.jsx"),
  {
    ssr: false,
  }
);

export const CustomVideo = dynamic(() => import("./ui/custom-video.jsx"), {
  ssr: false,
});

export const CartNotFound = dynamic(
  () => import("./ui/cart/CartNotFound.jsx"),
  {
    ssr: false,
  }
);

export const Layout = dynamic(() => import("./layout/Layout.jsx"), {
  ssr: false,
});

export const PaymentPage = dynamic(
  () => import("./ui/payment/PaymentPage.jsx"),
  {
    ssr: false,
  }
);

export const AddressSummary = dynamic(() => import("./ui/AddressSummary.jsx"), {
  ssr: false,
});

export const PaymentForm = dynamic(
  () => import("./ui/payment/PaymentForm.jsx"),
  {
    ssr: false,
  }
);

export const HeroSwiper = dynamic(() => import("./ui/HeroSwiper.jsx"), {
  ssr: false,
});

export const CompleteRingPage = dynamic(
  () => import("./ui/customize/complete-ring/page.jsx"),
  {
    ssr: false,
  }
);

export const StartWithSettingDetailpage = dynamic(
  () =>
    import("./ui/customize/start-with-setting/StartWithSettingDetailpage.jsx"),
  {
    ssr: false,
  }
);

export const ProductDetailPage = dynamic(
  () => import("./ui/product/ProductDetailPage.jsx"),
  {
    ssr: false,
  }
);
