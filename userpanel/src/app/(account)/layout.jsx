import ProfileHeader from "@/components/layout/ProfileHeader";
import ProfileFooter from "@/components/layout/ProfileFooter";

export default function AccountLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <ProfileHeader />
      <main className="flex-1">{children}</main>
      <ProfileFooter />
    </div>
  );
}
