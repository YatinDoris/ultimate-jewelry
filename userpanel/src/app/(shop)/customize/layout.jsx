import slide3 from "@/assets/images/collections/slide-3.webp";
import HeroBanner from "@/components/ui/HeroBanner";

export default function MainLayout({ children }) {
  return (
    <>
      <HeroBanner titleAttr={""} altAttr={""} imageSrc={slide3} />
      {children}
    </>
  );
}
