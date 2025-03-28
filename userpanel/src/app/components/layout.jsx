import { Lenis, StoreProvider } from "./dynamiComponents";
import Footer from "./footer";
import Header from "./header";

const Layout = ({ children }) => {
  return (
    <Lenis>
      <StoreProvider>
        <main>
          <Header />
          {children}
          <Footer />
        </main>
      </StoreProvider>
    </Lenis>
  );
};

export default Layout;
