import HeroBanner from "@/components/ui/HeroBanner";
import banner from "@/assets/images/about-us/banner.webp";
export default function AboutPage() {
  return (
    <>
      <HeroBanner
        imageSrc={banner}
        title={"About Us"}
        description={"Celebrating Every Shade of You"}
        altAttr=""
        titleAttr=""
      />
      <div className="h-screen flex items-center justify-center">
        <h2>About KatanOff</h2>
      </div>
    </>
  );
}
