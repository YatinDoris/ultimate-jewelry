import HeroBanner from "@/components/ui/HeroBanner";
import banner from "@/assets/images/education/banner.webp";
export default function EducationPage() {
  return (
    <>
      <HeroBanner
        imageSrc={banner}
        title={"Diamond Education"}
        description={"Celebrating Every Shade of You"}
        altAttr=""
        titleAttr=""
      />
      <div className="h-screen flex items-center justify-center">
        <h2>Education KatanOff</h2>
      </div>
    </>
  );
}
