// components/FullImageCarousel.jsx
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import Image from "next/image";
import Link from "next/link";

const slides = [
  {
    image: "/images/muse.jpg",
    title: "Muse Collection",
    link: "/collections/muse",
  },
  {
    image: "/images/nostalgia.jpg",
    title: "Nostalgia Collection",
    link: "/collections/nostalgia",
  },
  // Add more slides as needed
];

export default function FullImageCarousel() {
  return (
    <div className="relative w-full overflow-hidden">
      {/* Navigation Buttons */}
      <div className="absolute left-2 top-1/2 z-10 -translate-y-1/2 cursor-pointer swiper-button-prev-custom text-2xl text-black hover:scale-125 transition">
        ←
      </div>
      <div className="absolute right-2 top-1/2 z-10 -translate-y-1/2 cursor-pointer swiper-button-next-custom text-2xl text-black hover:scale-125 transition">
        →
      </div>

      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: ".swiper-button-prev-custom",
          nextEl: ".swiper-button-next-custom",
        }}
        slidesPerView={1}
        loop={true}
      >
        {slides.map((item, idx) => (
          <SwiperSlide key={idx}>
            <div className="relative w-full h-[600px] md:h-[700px]">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
              />
              <div className="absolute bottom-10 left-10 text-white z-10">
                <h2 className="text-2xl md:text-3xl font-semibold">
                  {item.title}
                </h2>
                <Link
                  href={item.link}
                  className="inline-block mt-2 text-sm border-b border-white hover:border-white/50 transition"
                >
                  SHOP NOW
                </Link>
              </div>
              <div className="absolute inset-0 bg-black/20" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
