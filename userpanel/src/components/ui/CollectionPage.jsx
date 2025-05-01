"use client";
import { fetchCollectionsTypeWiseProduct } from "@/_actions/product.actions";
import { helperFunctions } from "@/_helper";
import { ProductGrid, SwipperHomePageBig } from "@/components/dynamiComponents";
import { useParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import slide1 from "@/assets/images/collections/slide-1.webp";
import slide2 from "@/assets/images/collections/slide-2.webp";
import slide3 from "@/assets/images/collections/slide-3.webp";
import KeyFeatures from "@/components/ui/KeyFeatures";
import SettingStyleCategorySwiper from "@/components/ui/settingStyleSwiper";
import { collections } from "./home/HomePage";
import HeroBanner from "./HeroBanner";
import { bannerList } from "@/_utils/bannerList";
import { getMenuList } from "@/_actions/home.action";
export const collectionSwiper = [
  {
    image: slide1,
    title: "Engagement Rings",
    description:
      "A ring is just a piece of jewelry until it’s given with love. This one? It’s a symbol of forever, a promise of a lifetime, and a story waiting to be told.",
  },
  {
    image: slide2,
    title: "Engagement Rings",
    description:
      "A ring is just a piece of jewelry until it’s given with love. This one? It’s a symbol of forever, a promise of a lifetime, and a story waiting to be told.",
  },
  {
    image: slide3,
    title: "Engagement Rings",
    description:
      "A ring is just a piece of jewelry until it’s given with love. This one? It’s a symbol of forever, a promise of a lifetime, and a story waiting to be told.",
  },
];
export default function CollectionPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const { collectionTypeProductList, productLoading, uniqueFilterOptions } =
    useSelector(({ product }) => product);
  const { menuList } = useSelector(({ common }) => common);
  let { collectionType, collectionTitle } = params;
  collectionTitle = helperFunctions.stringReplacedWithSpace(
    decodeURIComponent(collectionTitle)
  );
  const loadData = useCallback(async () => {
    if (collectionType && collectionTitle) {
      await dispatch(
        fetchCollectionsTypeWiseProduct(collectionType, collectionTitle)
      );
      await dispatch(getMenuList());
    }
  }, [dispatch, collectionType, collectionTitle]);

  const getBannerImage = (collectionType, collectionTitle) => {
    for (const item of bannerList) {
      // 1. Match category
      if (item.type === collectionType && item.title === collectionTitle) {
        return item.banner;
      }

      // 2. Match subcategory
      if (collectionType === "subCategories" && item.subCategories) {
        const sub = item.subCategories.find(
          (sub) => sub.title === collectionTitle
        );
        if (sub) return sub.banner;
      }

      // 3. Match collection (e.g. Flash Deals)
      if (
        collectionType === "collection" &&
        item.collection?.title === collectionTitle
      ) {
        return item.collection.banner;
      }

      // 4. Match productTypes
      if (collectionType === "productTypes" && item.subCategories) {
        for (const sub of item.subCategories) {
          const isMatchingSub = menuList.some((menu) =>
            menu.subCategories?.some(
              (subCat) =>
                subCat.title === sub.title &&
                subCat.productTypes?.some((p) => p.title === collectionTitle)
            )
          );

          if (isMatchingSub) {
            return sub.banner;
          }
        }
      }
    }

    return slide3; // fallback banner
  };

  useEffect(() => {
    if (collectionType && collectionTitle) {
      loadData();
    }
  }, [collectionType, collectionTitle, loadData]);
  return (
    <>
      {/* Swiper Section */}
      <HeroBanner
        imageSrc={getBannerImage(collectionType, collectionTitle)}
        altAttr=""
        titleAttr=""
      />

      {/* Setting Style Swiper */}
      <section className="container pt-10 md:pt-14 lg:pt-20 2xl:pt-20">
        <h2 className="text-center text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-castoro capitalize">
          {collectionTitle}
        </h2>
        <SettingStyleCategorySwiper
          settingStyleCategories={uniqueFilterOptions.uniqueSettingStyles}
          loading={productLoading}
        />
      </section>
      {/* Product Grid Section */}
      <section className="container pt-10 md:pt-14 lg:pt-20 2xl:pt-20">
        <ProductGrid
          productList={collectionTypeProductList}
          pagination={true}
          isLoading={productLoading}
        />
      </section>
      <section className="pt-16 lg:pt-20 2xl:pt-20">
        <SwipperHomePageBig collections={collections} navigation={true} />
      </section>
      <section className="container pt-16 lg:pt-20 2xl:pt-20">
        <KeyFeatures />
      </section>
    </>
  );
}
