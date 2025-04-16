import anniversaryRings from "@/assets/images/home/anniversary-rings.webp";
import bracelets from "@/assets/images/home/bracelets.webp";
import diamondRings from "@/assets/images/home/diamond-rings.webp";
import earrings from "@/assets/images/home/earrings.webp";
import engagementRings from "@/assets/images/home/engagement-rings.webp";
import mensJewelry from "@/assets/images/home/mens-jewelry.webp";
import necklaces from "@/assets/images/home/necklaces.webp";
import weddingRings from "@/assets/images/home/wedding-rings.webp";
import CustomImg from "../custom-img";
import Link from "next/link";
import { helperFunctions } from "@/_helper";
import { useCallback } from "react";
const genrateCategoryUrl = (categoryName) => {
  return `/collections/categories/${helperFunctions.stringReplacedWithUnderScore(
    categoryName
  )}`;
};
const categories = [
  {
    img: diamondRings,
    title: "Diamond Rings",
    altAttr: "",
    titleAttr: "",
  },
  {
    img: engagementRings,
    title: "Engagement Rings",
    altAttr: "",

    titleAttr: "",
  },
  {
    img: weddingRings,
    title: "Wedding Rings",
    altAttr: "",

    titleAttr: "",
  },
  {
    img: mensJewelry,
    title: "Men’s Jewelry",
    altAttr: "",
    titleAttr: "",
  },
  {
    img: earrings,
    title: "Earrings",
    altAttr: "",
    titleAttr: "",
    href: genrateCategoryUrl("Earrings"),
  },
  {
    img: bracelets,
    title: "Bracelets",
    altAttr: "",
    titleAttr: "",
    href: genrateCategoryUrl("Bracelets"),
  },
  {
    img: necklaces,
    title: "Necklaces",
    altAttr: "",
    titleAttr: "",
    href: genrateCategoryUrl("Necklaces"),
  },
  {
    img: anniversaryRings,
    title: "Anniversary Rings",
    altAttr: "",
    titleAttr: "",
  },
];

export default function CategoryGallery() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
      {categories?.map((category, index) => {
        return (
          <Link
            href={
              category?.href ||
              `/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
                category?.title
              )}`
            }
            key={`category-${index}`}
          >
            <CustomImg
              srcAttr={category?.img}
              titleAttr={category?.titleAttr}
              altAttr={category?.altAttr}
            />
            <p className="uppercase mt-2 font-medium">{category?.title}</p>
          </Link>
        );
      })}
    </div>
  );
}
