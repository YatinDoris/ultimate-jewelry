"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { CustomImg } from "./dynamiComponents";
import Link from "next/link";

const SwipperHomePageBig = ({ collections }) => {
  return (
    <Swiper
      spaceBetween={20}
      slidesPerView={1.2}
      className="w-full"
      breakpoints={{
        320: {
          slidesPerView: 1,
        },
        480: {
          slidesPerView: 1.2,
        },
        768: {
          slidesPerView: 1.3,
        },
      }}
    >
      {collections.map((collection, idx) => (
        <SwiperSlide key={idx}>
          <div className="relative w-full h-[60vh] md:h-[75vh] xl:h-[90vh] overflow-hidden">
            <CustomImg
              src={collection?.image}
              alt={collection?.title}
              fill
              className="object-cover w-full h-full"
            />

            <div className="absolute bottom-[5%]  left-[5%] w-full p-6 gap-8 flex flex-col">
              <h2 className="text-xl xl:text-4xl 2xl:text-5xl text-white font-castoro font-semibold bottom-[10%]">
                {collection.title}
              </h2>
              <Link href={collection?.btnLink}>
                <p className="text-md xl:text-lg font-normal tracking-wide border-b-2 text-white uppercase border-white w-fit">
                  {collection?.btnText}
                </p>
              </Link>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default SwipperHomePageBig;
