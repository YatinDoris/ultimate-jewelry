"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import ProductCard from "./productCard";
import useQueryParams from "@/hooks/useQueryParams";

export default function LatestProductSwiper({
  productList,
  productLoading,
  isDiamondSettingPage,
}) {
  const queryParams = useQueryParams();

  const getProductLink = ({ queryParams, isDiamondSettingPage, product }) => {
    if (!isDiamondSettingPage) return null;
    const { dId, format } = queryParams || {};
    const basePath = `/engagement-rings/product-detail/${product?.id}`;
    const queryString = dId
      ? `?dId=${dId}&format=${format}`
      : `?format=${format}`;
    return `${basePath}${queryString}`;
  };

  return (
    <Swiper
      spaceBetween={20}
      slidesPerView={2}
      breakpoints={{
        338: { slidesPerView: 1 },
        540: { slidesPerView: 1.6 },
        1024: { slidesPerView: 2.7 },
        1280: { slidesPerView: 3.5 },
      }}
      className="container"
    >
      {productList.map((product) => {
        return (
          <SwiperSlide key={`product-key-${product?.productName}`}>
            <ProductCard
              goldColorVariations={product?.goldColorVariations}
              title={product?.productName}
              discount={product?.discount}
              basePrice={product?.basePrice}
              img={product.images[0]?.image}
              price={product?.baseSellingPrice}
              productLink={getProductLink({
                queryParams,
                isDiamondSettingPage,
                product,
              })}
            />
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
}
