import { Lenis, StoreProvider } from "./dynamiComponents";
import Footer from "./footer";
import Header from "./header";

const Layout = ({ children }) => {
  return (
    <Lenis>
      <StoreProvider>
        <main>
          <Header />
          <div className="pt-10 lg:pt-16 2xl:pt-28">{children}</div>
          <Footer />
        </main>
      </StoreProvider>
    </Lenis>
  );
};

export default Layout;
