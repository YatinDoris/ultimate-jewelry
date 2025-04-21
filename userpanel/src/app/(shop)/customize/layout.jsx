import { HeroSwiper } from "@/components/dynamiComponents";
import { collectionSwiper } from "@/components/ui/CollectionPage";

export default function MainLayout({ children }) {
  return (
    <>
      <HeroSwiper slides={collectionSwiper} />
      {children}
    </>
  );
}
