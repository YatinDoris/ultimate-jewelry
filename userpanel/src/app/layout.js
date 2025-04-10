import StoreProvider from "@/store/provider";
import "./globals.css";
import { Lenis } from "@/components/dynamiComponents";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* <Lenis> */}
        <StoreProvider>
          <main className="h-full">{children}</main>
        </StoreProvider>
        {/* </Lenis> */}
      </body>
    </html>
  );
}
