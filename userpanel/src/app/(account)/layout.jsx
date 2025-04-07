import AccountHeader from "@/components/layout/AccountHeader";
import AccountFooter from "@/components/layout/AccountFooter";

export default function AccountLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <AccountHeader />
      <main className="flex-1">{children}</main>
      <AccountFooter />
    </div>
  );
}
