"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { CustomImg } from "../dynamiComponents";
import Link from "next/link";
import { useRef, useState } from "react";
import { Navigation } from "swiper/modules";
import { BsArrowRightShort, BsArrowLeftShort } from "react-icons/bs";

const SwipperHomePageBig = ({ collections, navigation }) => {
  const swiperRef = useRef(null);
  const [isBeginning, setIsBeginning] = useState(true);
  const [isEnd, setIsEnd] = useState(false);
  return (
    <div>
      <Swiper
        spaceBetween={10}
        slidesPerView={1.2}
        className="w-full"
        modules={[Navigation]}
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
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
        }}
        onSlideChange={(swiper) => {
          setIsBeginning(swiper.isBeginning);
          setIsEnd(swiper.isEnd);
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
                <Link
                  href={collection?.btnLink}
                  className="text-md lg:text-base 2xl:text-lg font-normal tracking-wide border-b-2 text-white uppercase border-white w-fit"
                >
                  {collection?.btnText}
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {navigation ? (
        <div className="container mt-8 flex justify-end">
          <div className="flex gap-3">
            <button
              className={`${
                isBeginning ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={() => swiperRef.current?.slidePrev()}
              disabled={isBeginning}
            >
              <BsArrowLeftShort className="text-3xl" />
            </button>
            <button
              className={`${isEnd ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => swiperRef.current?.slideNext()}
              disabled={isEnd}
            >
              <BsArrowRightShort className="text-3xl" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default SwipperHomePageBig;
