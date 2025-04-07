"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import testimonialProfile from "@/assets/icons/TestimonialProfile.svg";
import rightSide from "@/assets/icons/rightSide.svg";
import leftSide from "@/assets/icons/leftSide.svg";
import { CustomImg } from "../dynamiComponents";
import { useEffect, useRef } from "react";

export default function TestimonialSlider({ testimonials }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const swiperRef = useRef(null); // Store Swiper instance

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);

  return (
    <section className="py-16 md:pt-24 pb-24 pb-auto bg-[#F3F2ED] text-center px-4 md:px-20">
      <p className="text-lg lg:text-xl">Testimonials</p>
      <h2 className="text-2xl md:text-3xl 2xl:text-4xl font-normal mt-2 mb-8">
        What People Say About Us
      </h2>
      <div className="relative">
        <Swiper
          modules={[Navigation]}
          loop={true}
          onSwiper={(swiper) => (swiperRef.current = swiper)} // Store Swiper instance
          className="max-w-5xl mx-auto"
        >
          {testimonials.map((item, idx) => (
            <SwiperSlide key={idx}>
              <div className="flex flex-col items-center gap-y-6 pt-6 lg:pt-8 2xl:pt-10">
                <CustomImg
                  srcAttr={testimonialProfile}
                  altAttr=""
                  titleAttr=""
                  width={100}
                  height={100}
                  className="rounded-full object-cover"
                />
                <p className="text-lg md:text-2xl 2xl:text-3xl text-gray-800 max-w-xl xl:max-w-2xl px-4">
                  “{item.quote}”
                </p>
                <div>
                  <p className="font-medium text-xl lg:text-2xl text-gray-900">
                    {item.name}
                  </p>
                  <p className="text-lg ">{item.location}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Navigation Buttons */}
        <button
          ref={prevRef}
          className="absolute md:left-[0%] lg:left-[5%] 2xl:left-[20%] md:top-1/2 left-[35%] md:-translate-y-1/2 z-10 p-2 rounded-full"
        >
          <CustomImg srcAttr={leftSide} altAttr="Prev" width={40} height={40} />
        </button>
        <button
          ref={nextRef}
          className="absolute md:right-[0%] lg:right-[5%] 2xl:right-[20%] right-[35%] md:top-1/2 md:-translate-y-1/2 z-10 p-2 rounded-full"
        >
          <CustomImg
            srcAttr={rightSide}
            altAttr="Next"
            width={40}
            height={40}
          />
        </button>
      </div>
    </section>
  );
}
