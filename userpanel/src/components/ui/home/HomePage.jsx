"use client";
import "swiper/css";
import "swiper/css/navigation";
import banner from "@/assets/images/home/banner.webp";
import freeGiftBanner from "@/assets/images/home/free-gift-banner.webp";
import ring1 from "@/assets/images/home/ring-1.webp";
import ring2 from "@/assets/images/home/ring-2.webp";
import ring3 from "@/assets/images/home/ring-3.webp";

import home18 from "@/assets/images/home/home-18.webp";
import home19 from "@/assets/images/home/home-19.webp";
import home20 from "@/assets/images/home/home-20.webp";
import home21 from "@/assets/images/home/home-21.webp";
import home22 from "@/assets/images/home/home-22.webp";
import home23 from "@/assets/images/home/home-23.webp";
import home24 from "@/assets/images/home/home-24.webp";
import home25 from "@/assets/images/home/home-25.webp";
import home26 from "@/assets/images/home/home-26.webp";
import home27 from "@/assets/images/home/home-27.webp";

import diamondAsscher from "@/assets/images/home/diamond-asscher.webp";
import diamondCushion from "@/assets/images/home/diamond-cushion.webp";
import diamondEmerald from "@/assets/images/home/diamond-emerald.webp";
import diamondHeart from "@/assets/images/home/diamond-heart.webp";
import diamondmarquise from "@/assets/images/home/diamond-marquise.webp";
import diamondOval from "@/assets/images/home/diamond-oval.webp";
import diamondPear from "@/assets/images/home/diamond-pear.webp";
import diamondPrincess from "@/assets/images/home/diamond-princess.webp";
import diamondRadiant from "@/assets/images/home/diamond-radiant.webp";
import diamondRound from "@/assets/images/home/diamond-round.webp";
import elongatedCushion from "@/assets/images/home/elongated-cushion.webp";
import {
  AccordionDropdown,
  CustomImg,
  LatestProduct,
  SwipperHomePageBig,
  TestimonialSlider,
} from "@/components/dynamiComponents";
import Link from "next/link";
import { useEffect, useState } from "react";
import TextAboveImage from "@/components/ui/TextAboveImage";
import { useDispatch, useSelector } from "react-redux";
import Alert from "@/components/ui/Alert";
import { setLoginMessage } from "@/store/slices/userSlice";
import { useAlertTimeout } from "@/hooks/use-alert-timeout";
import HeroBanner from "../HeroBanner";
import CategoryGallery from "./categoryGallery";
import { helperFunctions, messageType } from "@/_helper";
import KeyFeatures from "../KeyFeatures";
import { setAppointmentMessage } from "@/store/slices/appointmentSlice";
import { setCustomJewelryMessage } from "@/store/slices/customjewelrySlice";

const diamondShapes = [
  { image: diamondRound, titleAttr: "", altAttr: "", title: "Round" },
  { image: diamondOval, titleAttr: "", altAttr: "", title: "Oval" },
  { image: diamondCushion, titleAttr: "", altAttr: "", title: "Cushion" },
  { image: diamondPear, titleAttr: "", altAttr: "", title: "Pear" },
  { image: diamondEmerald, titleAttr: "", altAttr: "", title: "Emerald" },
  { image: diamondRadiant, titleAttr: "", altAttr: "", title: "Radiant" },
  { image: diamondPrincess, titleAttr: "", altAttr: "", title: "Princess" },
  { image: diamondmarquise, titleAttr: "", altAttr: "", title: "Marquise" },
  { image: diamondAsscher, titleAttr: "", altAttr: "", title: "Asscher" },
  { image: diamondHeart, titleAttr: "", altAttr: "", title: "Heart" },
  {
    image: elongatedCushion,
    titleAttr: "",
    altAttr: "",
    title: "Elongated Cushion",
  },
];

const categoryData = [
  {
    title: "STACK YOUR WAY",
    image: home18,
    titleAttr: "",
    altAttr: "",
    link: "",
    btnText: "SHOP NOW",
  },
  {
    title: "DON’T JUMP THROUGH HOOPS—WEAR THEM",
    image: home19,
    titleAttr: "",
    altAttr: "",
    link: "",
    btnText: "SHOP HOOPS",
  },
];

const discoverOurWorld = [
  {
    title: "Sustainability Journey",
    videoSrc: "/videos/sustainability-journey.mp4",
    thumbnailImage: home21,
    titleAttr: "",
    altAttr: "",
  },
  {
    title: "Our Promise",
    videoSrc: "/videos/our-promise.mp4",
    thumbnailImage: home22,
    titleAttr: "",
    altAttr: "",
  },
];

const giftCategories = [
  { id: 1, title: "Gifts Under $500", image: home23, altAttr: "" },
  { id: 2, title: "Gifts FOR HER", image: home24, altAttr: "" },
  { id: 3, title: "Gifts for Him", image: home25, altAttr: "" },
];

export const collections = [
  {
    title: "New Arrival",
    image: home26,
    btnText: "Shop Now",
    btnLink: "/",
    altAttr: "",
    titleAttr: "",
  },
  {
    title: "Trending Collection",
    image: home27,
    btnText: "Shop Now",
    btnLink: "/",
    altAttr: "",
    titleAttr: "",
  },
];

const testimonials = [
  {
    name: "David Gahan",
    location: "Detroit, Michigan",
    quote:
      "In an emergency situation, I was amazed by how quickly they accommodated me. The dentist’s skill and compassion were evident. I'm grateful for their prompt care.",
  },
  {
    name: "Sarah Jones",
    location: "Austin, Texas",
    quote:
      "Amazing experience from start to finish. Friendly staff and very professional team.",
  },
];

const faqData = [
  {
    title: "Get To Know Lab Grown Diamonds",
    content:
      "Lab-grown diamonds have the same chemical, physical, and optical properties as natural diamonds.",
  },
];

const images = [ring1, ring2, ring3];

const Home = () => {
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { loginMessage } = useSelector(({ user }) => user);
  const { appointmentMessage } = useSelector(({ appointment }) => appointment);
  const { customJewelryMessage } = useSelector(({ customJewelry }) => customJewelry);

  useAlertTimeout(loginMessage, () =>
    dispatch(setLoginMessage({ message: "", type: "" }))
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  useAlertTimeout(appointmentMessage, () =>
    dispatch(setAppointmentMessage({ message: "", type: "" }))
  );
  useAlertTimeout(customJewelryMessage, () =>
    dispatch(setCustomJewelryMessage({ message: "", type: "" }))
  );

  return (
    <>
      {/* Hero Banner */}
      <HeroBanner isHomePage={true} imageSrc={banner} titleAttr="" altAttr="" />

      {/* SHOP FOR LAB GROWN DIAMOND PRODUCTS */}
      <section className="pt-16 lg:pt-20 2xl:pt-40 grid grid-cols-1 lg:grid-cols-[0.7fr_1fr] items-center justify-center gap-10 container">
        <div className="flex flex-col items-center text-center bg-transparent">
          <CustomImg
            srcAttr={home20}
            altAttr=""
            className="w-40 md:w-48 2xl:w-64"
          />
          <h2 className="text-xl 2xl:text-2xl font-semibold mt-4 text-center">
            SHOP FOR LAB GROWN
            <span className="lg:hidden"> </span>
            <br className="hidden lg:block" />
            DIAMOND PRODUCTS
          </h2>

          <div className="w-12 h-[2px] bg-black mt-4"></div>
        </div>

        <div className="grid grid-cols-2 xss:grid-cols-3 md:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-12 text-center">
          {diamondShapes.map((shape, idx) => (
            <Link
              href={"#"}
              key={shape.title || idx}
              className="flex flex-col items-center justify-center h-32 rounded-md transition-colors duration-200"
            >
              <CustomImg
                srcAttr={shape.image}
                altAttr={shape.title}
                titleAttr={shape.title}
                className="w-16 h-16 object-contain"
              />
              <span className="text-base pt-4 transition-colors duration-200 text-baseblack">
                {shape.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Free Gift With Purchase */}
      <section className="pt-16 lg:pt-20 2xl:pt-40">
        <CustomImg
          srcAttr={freeGiftBanner}
          className="h-[20vh] lg:h-auto"
          altAttr=""
          titleAttr=""
        />
      </section>

      {/* Category Gallery */}
      <section className="container pt-16 lg:pt-20 2xl:pt-40 ">
        <CategoryGallery />
      </section>

      {/* Complimentary Matching Wedding Band */}
      <section className="bg-alabaster mt-16 lg:mt-20 2xl:mt-40">
        <div className="container grid grid-cols-1 lg:grid-cols-2 py-10 md:py-16 lg:py-0 relative h-[80vh] md:h-[60vh] place-items-center">
          <div className="relative w-full h-44 2xl:h-52">
            {images.map((img, index) => (
              <CustomImg
                key={index}
                srcAttr={img}
                altAttr=""
                className={`absolute top-0 left-0 w-full h-full object-contain transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
              />
            ))}
          </div>

          <div className="flex flex-col items-center justify-center text-center px-4">
            <p className="pt-2 text-base md:text-lg lg:text-xl 2xl:text-2xl font-castoro">
              Get a Complimentary Matching Wedding Band
            </p>
            <p className="pt-6 text-base 2xl:text-lg mb-6">
              Our intuitive ring design feature lets you craft the perfect
              engagement ring effortlessly.
            </p>
            <a
              href="#"
              className="pt-2 text-base 2xl:text-lg font-semibold tracking-wide border-b transition-all duration-300 
              border-baseblack text-baseblack 
              hover:text-primary hover:border-primary"
            >
              START WITH A SETTING
            </a>
          </div>
        </div>
      </section>

      <section className="pt-16 lg:pt-20 2xl:pt-40">
        <TextAboveImage
          categoryData={categoryData}
          textClassName={"font-castoro"}
        />
      </section>
      <section className="container mx-auto pt-16 lg:pt-20 2xl:pt-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center ">
          {giftCategories.map((category) => (
            <Link
              href={`/collections/collection/${helperFunctions.stringReplacedWithUnderScore(
                category?.title
              )}`}
              key={category.id}
            >
              <CustomImg
                srcAttr={category.image}
                altAttr={category.altAttr}
                titleAttr={category.title}
                className="object-cover w-full "
              />
              <p className="pt-4 md:pt-6 text-lg md:text-xl 2xl:text-2xl font-normal">
                {category.title}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto pt-16 lg:pt-20 2xl:pt-40">
        <SwipperHomePageBig collections={collections} />
      </section>
      <section className="pt-16 lg:pt-20 2xl:pt-40 container">
        <LatestProduct />
      </section>
      <section className="pt-16 lg:pt-20 2xl:pt-40">
        <div className="text-center">
          <h3 className="text-sm lg:text-base font-medium">
            DISCOVER OUR WORLD
          </h3>
          <h2 className="text-2xl lg:text-4xl font-normal font-castoro mt-2">
            Diamonds as Exceptional as You
          </h2>
        </div>
        <div className="pt-6 lg:pt-10 2xl:pt-18">
          <TextAboveImage categoryData={discoverOurWorld} />
        </div>
      </section>
      <section className="container pt-16 lg:pt-20 2xl:pt-20">
        <KeyFeatures />
      </section>

      <section className="mx-auto pt-16 lg:pt-20 2xl:pt-40">
        <TestimonialSlider testimonials={testimonials} />
      </section>

      <section className="mx-auto pt-16 lg:pt-20 2xl:pt-40">
        <AccordionDropdown items={faqData} />
      </section>
      <Alert message={loginMessage?.message} type={loginMessage?.type} />
      {appointmentMessage?.type === messageType?.SUCCESS && (
        <Alert
          message={appointmentMessage?.message}
          type={appointmentMessage?.type}
        />
      )}
      {customJewelryMessage?.type === messageType?.SUCCESS && (
        <Alert
          message={customJewelryMessage?.message}
          type={customJewelryMessage?.type}
        />
      )}
    </>
  );
};
export default Home;
