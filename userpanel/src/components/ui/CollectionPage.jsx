"use client";
import { fetchCollectionsTypeWiseProduct } from "@/_actions/product.actions";
import { helperFunctions } from "@/_helper";
import {
  HeroSwiper,
  ProductGrid,
  SwipperHomePageBig,
} from "@/components/dynamiComponents";
import { useParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import slide1 from "@/assets/images/collections/slide-1.webp";
import KeyFeatures from "@/components/ui/KeyFeatures";
import SettingStyleCategorySwiper from "@/components/ui/settingStyleSwiper";
import { collections } from "./home/HomePage";

export const collectionSwiper = [
  {
    image: slide1,
    title: "Engagement Rings",
    description:
      "A ring is just a piece of jewelry until it’s given with love. This one? It’s a symbol of forever, a promise of a lifetime, and a story waiting to be told.",
  },
  {
    image: slide1,
    title: "Engagement Rings",
    description:
      "A ring is just a piece of jewelry until it’s given with love. This one? It’s a symbol of forever, a promise of a lifetime, and a story waiting to be told.",
  },
  {
    image: slide1,
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

  let { collectionType, collectionTitle } = params;
  collectionTitle = helperFunctions.stringReplacedWithSpace(
    decodeURIComponent(collectionTitle)
  );

  const loadData = useCallback(async () => {
    if (collectionType && collectionTitle) {
      await dispatch(
        fetchCollectionsTypeWiseProduct(collectionType, collectionTitle)
      );
    }
  }, [dispatch, collectionType, collectionTitle]);

  useEffect(() => {
    if (collectionType && collectionTitle) {
      loadData();
    }
  }, [collectionType, collectionTitle, loadData]);
  return (
    <>
      {/* Swiper Section */}
      <HeroSwiper slides={collectionSwiper} />

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
