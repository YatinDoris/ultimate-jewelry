"use client";
import { fetchCollectionsTypeWiseProduct } from "@/_actions/product.actions";
import { helperFunctions } from "@/_helper";
import {
  CustomImg,
  ProductGrid,
  SwipperHomePageBig,
} from "@/components/dynamiComponents";
import { useParams } from "next/navigation";
import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import slide1 from "@/assets/images/collections/slide-1.webp";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { collections } from "@/app/(shop)/page";
import KeyFeatures from "@/components/ui/KeyFeatures";
import SettingStyleCategorySwiper from "@/components/ui/settingStyleSwiper";

const collectionSwiper = [
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
    await dispatch(
      fetchCollectionsTypeWiseProduct(collectionType, collectionTitle)
    );
  }, [dispatch, collectionType, collectionTitle]);

  useEffect(() => {
    loadData();
  }, [loadData]);
  return (
    <>
      {/* Swiper Section */}
      <section className="pt-20 md:pt-10 lg:pt-4 2xl:pt-6">
        <Swiper
          modules={[Autoplay]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          slidesPerView={1}
          loop={true}
          className="w-full h-auto"
        >
          {collectionSwiper.map((slide, index) => (
            <SwiperSlide key={`collection-${index}`}>
              <div className="relative w-full">
                <CustomImg
                  srcAttr={slide.image}
                  className="h-[30vh] lg:h-auto object-cover lg:object-contain"
                />
                <div className="absolute inset-0 grid lg:grid-cols-2 place-items-center bg-black  bg-opacity-5 items-center justify-center  text-white text-center p-4">
                  <div className="md:w-[70%]">
                    <h2 className="text-2xl lg:text-4xl 2xl:text-6xl font-castoro mb-3 lg:mb-5">
                      {slide.title}
                    </h2>
                    <p className="text-base 2xl:text-lg">{slide.description}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>
      {/* Setting Style Swiper */}
      <section className="container pt-10 md:pt-14 lg:pt-20 2xl:pt-20">
        <h2 className="text-center text-2xl md:text-3xl lg:text-4xl 2xl:text-5xl font-castoro ">
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
