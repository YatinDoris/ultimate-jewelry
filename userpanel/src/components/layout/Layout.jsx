"use client";

import axios from "axios";
import StoreProvider from "@/store/provider";
import { setAuthToken } from "@/interceptors/httpInterceptor";
import { apiUrl } from "@/_helper";
import errorInterceptor from "@/interceptors/errorInterceptor";
import { useRouter } from "next/navigation";

const Layout = ({ children }) => {
  const router = useRouter();

  axios.defaults.baseURL = apiUrl;
  setAuthToken();
  errorInterceptor(router);

  return (
    <StoreProvider>
      <link
        rel="icon"
        type="image/png"
        href="/favicon/favicon-96x96.png"
        sizes="96x96"
      />
      <link rel="icon" type="image/svg+xml" href="/favicon/favicon.svg" />
      <link rel="shortcut icon" href="/favicon/favicon.ico" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/favicon/apple-touch-icon.png"
      />
      <meta name="apple-mobile-web-app-title" content="KatanOff" />
      <link rel="manifest" href="/favicon/site.webmanifest" />
      <main className="h-full">{children}</main>
    </StoreProvider>
  );
};

export default Layout;
