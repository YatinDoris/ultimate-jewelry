"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import home1 from "@/assets/images/home/home-1.webp";
import home2 from "@/assets/images/home/home-2.webp";
import home3 from "@/assets/images/home/home-3.webp";
import home4 from "@/assets/images/home/home-4.webp";
import home5 from "@/assets/images/home/home-5.webp";
import home6 from "@/assets/images/home/home-6.webp";
import home7 from "@/assets/images/home/home-7.webp";
import home8 from "@/assets/images/home/home-8.webp";
import home9 from "@/assets/images/home/home-9.webp";
import home10 from "@/assets/images/home/home-10.webp";
import home11 from "@/assets/images/home/home-11.webp";
import home12 from "@/assets/images/home/home-12.webp";
import home13 from "@/assets/images/home/home-13.webp";
import home14 from "@/assets/images/home/home-14.webp";
import home15 from "@/assets/images/home/home-15.webp";
import home16 from "@/assets/images/home/home-16.webp";
import home17 from "@/assets/images/home/home-17.webp";
import home18 from "@/assets/images/home/home-18.webp";
import home19 from "@/assets/images/home/home-19.webp";
import home20 from "@/assets/images/home/home-20.webp";
import home21 from "@/assets/images/home/home-21.webp";
import home22 from "@/assets/images/home/home-22.webp";
import home23 from "@/assets/images/home/home-23.webp";
import home24 from "@/assets/images/home/home-24.webp";
import home25 from "@/assets/images/home/home-25.webp";
import home26 from "@/assets/images/home/home-26.webp";
import home28 from "@/assets/images/home/home-28.webp";
import home29 from "@/assets/images/home/home-29.webp";
import home30 from "@/assets/images/home/home-30.webp";
import home31 from "@/assets/images/home/home-21.webp";
import home27 from "@/assets/images/home/home-27.webp";

import check from "@/assets/icons/check.svg";
import dollar from "@/assets/icons/dollar.svg";
import percent from "@/assets/icons/percent.svg";
import shipping from "@/assets/icons/shipping.svg";
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
import { LinkButton } from "../components/button";
import {
  AccordionDropdown,
  AnimatedSection,
  CustomImg,
  ProductSwiper,
  MarqueeBrandsHome,
  SwipperHomePageBig,
  TestimonialSlider,
} from "@/components/dynamiComponents";
import Link from "next/link";
import { useEffect, useState } from "react";
import TextAboveImage from "@/components/TextAboveImage";
import { useDispatch, useSelector } from "react-redux";
import { fetchLatestProductList } from "@/_actions/product.actions";

const animatedContent = [
  {
    img: home21,
    titleAttr: "",
    altAttr: "",
    title: "Expert Guidance, Personalized for You",
    description: [
      "Our seasoned jewelry specialists are here to help you find the perfect piece. Whether you're looking for timeless elegance or a custom creation, we provide expert advice and personalized service to match your style and needs.",
    ],
    btnText: "Book an Appointment",
    btnLink: "/",

    direction: "LTF",
  },
];

const benefits = [
  { icon: percent, text: "Competitive Pricing" },
  { icon: shipping, text: "Free Shipping" },
  { icon: dollar, text: "Free Returns" },
  { icon: check, text: "Lifetime Warranty" },
];

const diamondShapes = [
  { image: diamondPear, titleAttr: "", altAttr: "", title: "Pear" },
  { image: diamondRound, titleAttr: "", altAttr: "", title: "Round" },
  { image: diamondAsscher, titleAttr: "", altAttr: "", title: "Asscher" },
  { image: diamondPrincess, titleAttr: "", altAttr: "", title: "Princess" },
  { image: diamondCushion, titleAttr: "", altAttr: "", title: "Cushion" },
  { image: diamondHeart, titleAttr: "", altAttr: "", title: "Heart" },
  { image: diamondOval, titleAttr: "", altAttr: "", title: "Oval" },
  { image: diamondEmerald, titleAttr: "", altAttr: "", title: "Emerald" },
  { image: diamondRadiant, titleAttr: "", altAttr: "", title: "Radiant" },
  { image: diamondmarquise, titleAttr: "", altAttr: "", title: "Marquise" },
];

const categories = ["RINGS", "EARRINGS", "BRACELETS", "PENDANT", "CHAIN"];

const categoryData = [
  {
    data: [
      {
        title: "STACK YOUR WAY",
        image: home18,
        titleAttr: "",
        altAttr: "",
        link: "",
        btnText: "SHOP NOW",
        categoryClassname: "w-full h-[90vh]",
      },
      {
        title: "DON’T JUMP THROUGH HOOPS—WEAR THEM",
        image: home19,
        titleAttr: "",
        altAttr: "",
        link: "",
        btnText: "SHOP HOOPS",
        categoryClassname: "w-full h-[90vh]",
      },
    ],
  },
  {
    data: [
      {
        title: "Sustainability Journey",
        image: home21,
        titleAttr: "",
        altAttr: "",
        link: "",
        btnText: "Explore",
        categoryClassname: "w-full h-[50vh]",
      },
      {
        title: "Our Promise",
        image: home22,
        titleAttr: "",
        altAttr: "",
        btnText: "Explore",
        link: "",
        categoryClassname: "w-full h-[50vh]",
      },
    ],
  },
];

const products = {
  RINGS: [
    { src: home26, label: "SOLITAIRE", link: "/" },
    { src: home27, label: "HALO", link: "/" },
    { src: home28, label: "BANGLE", link: "/" },
    { src: home29, label: "NEW ARRIVALS", link: "/" },
    { src: home30, label: "STUDS", link: "/" },
    { src: home31, label: "HOOPS", link: "/" },
    { src: home16, label: "BANGLE", link: "/" },
    { src: home17, label: "NEW ARRIVALS", link: "/" },
  ],
  EARRINGS: [
    { src: home12, label: "STUDS", link: "/" },
    { src: home13, label: "HOOPS", link: "/" },
    { src: home16, label: "BANGLE", link: "/" },
    { src: home17, label: "NEW ARRIVALS", link: "/" },
  ],
  BRACELETS: [
    { src: home14, label: "TENNIS", link: "/" },
    { src: home15, label: "FASHION", link: "/" },
    { src: home16, label: "BANGLE", link: "/" },
    { src: home17, label: "NEW ARRIVALS", link: "/" },
  ],
  PENDANT: [
    { src: home10, label: "PENDANT", link: "/" },
    { src: home11, label: "STATEMENT", link: "/" },
    { src: home16, label: "BANGLE", link: "/" },
    { src: home17, label: "NEW ARRIVALS", link: "/" },
  ],
  CHAIN: [
    { src: home12, label: "STUDS", link: "/" },
    { src: home13, label: "HOOPS", link: "/" },
    { src: home16, label: "BANGLE", link: "/" },
    { src: home17, label: "NEW ARRIVALS", link: "/" },
  ],
};

const giftCategories = [
  { id: 1, title: "ANNIVERSARY GIFTS", image: home23, altAttr: "" },
  { id: 2, title: "GIFTS UNDER $1000", image: home24, altAttr: "" },
  { id: 3, title: "GIFTS FOR HIM", image: home25, altAttr: "" },
];

export const collections = [
  {
    title: "Most Popular Collection",
    image: home26,
    btnText: "Shop Now",
    btnLink: "/",
    altAttr: "",
    titleAttr: "",
  },
  {
    title: "Muse Collection",
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

const Home = () => {
  const dispatch = useDispatch();
  const { latestProductList, productLoading } = useSelector(({ product }) => product)

  useEffect(() => {
    dispatch(
      fetchLatestProductList(8)
    );
  }, []);
  return (
    <>
      <section>
        <div className="relative w-full h-[70vh] md:h-[80vh] xl:h-[90vh] overflow-hidden">
          <CustomImg
            srcAttr={home1}
            altAttr=""
            className="absolute inset-0 w-full h-full object-cover "
          />
          <div className="relative z-20 h-full flex items-center px-6 md:px-20 justify-center ">
            <div className="text-white max-w-3xl flex flex-col md:justify-start md:text-center">
              <h1 className="text-3xl md:text-4xl  leading-tight font-castoro">
                Diamonds that <br />
                Deserve You.
              </h1>
              <p className="mt-4 text-sm md:text-base">
                Free 1ct Diamond Pendant with Purchase<sup>*</sup>
              </p>
              <div className="mt-6 flex flex-col md:flex-row gap-4">
                <LinkButton
                  href=""
                  className=" lg:!h-[2.3rem] w-fit !py-6 !bg-transparent font-medium hover:!border-white hover:!bg-white hover:!text-black"
                >
                  SHOP ENGAGEMENT
                </LinkButton>
                <LinkButton
                  href=""
                  className=" lg:!h-[2.3rem] w-fit !py-6 font-medium !bg-transparent hover:!border-white hover:!bg-white hover:!text-black"
                >
                  SHOP ALL JEWELRY
                </LinkButton>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="pt-16 lg:pt-20 2xl:pt-40 grid grid-cols-1 lg:grid-cols-[0.7fr_1fr] items-center justify-center gap-10 container">
        <div className="flex flex-col items-center text-center bg-transparent">
          <CustomImg
            srcAttr={home20}
            altAttr=""
            className="w-40 md:w-48 2xl:w-64"
          />
          <h2 className="text-xl 2xl:text-2xl font-medium mt-4 text-center">
            SHOP FOR LAB GROWN
            <span className="lg:hidden"> </span>
            <br className="hidden lg:block" />
            DIAMOND PRODUCTS
          </h2>

          <div className="w-12 h-[2px] bg-black mt-2"></div>
        </div>

        <div className="grid grid-cols-2 xss:grid-cols-3 md:grid-cols-5 xl:grid-cols-6 gap-8 md:gap-12 text-center">
          {diamondShapes.map((shape, idx) => (
            <div
              key={shape.title || idx}
              className="group !flex flex-col items-center justify-center h-32 cursor-pointer rounded-md transition-colors duration-200"
            >
              <CustomImg
                src={shape.image}
                alt={shape.title}
                className="w-16 h-16 object-contain"
              />
              <span className="text-[16px] pt-4 transition-colors duration-200 group-hover:font-semibold group-hover:text-black text-[#2B2B2B]">
                {shape.title}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="container  pt-16 lg:pt-20 2xl:pt-40 ">
        <CategoryGallery />
      </section>

      <section className="bg-[#F3F2ED] w-full md:h-[70vh] lg:h-[90vh] px-6 md:px-16 flex flex-col md:flex-row pt-12 md:pt-0 items-center justify-center mt-10 md:mt-20 2xl:mt-40">
        <div className="w-full md:w-1/2 flex justify-center mb-10 md:mb-0">
          <CustomImg
            srcAttr={home2}
            altAttr=""
            className="object-contain w-full h-full"
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-center  pb-12 md:pb-0 text-center justify-center align-middle">
          <h2 className="text-3xl md:text-4xl xl:text-5xl font-medium mb-2 font-castoro">
            Create Your Perfect Engagement Ring
          </h2>
          <p className="pt-2 text-md xl:text-lg font-castoro">
            Get a Complimentary Matching Wedding Band
          </p>

          <p className="text-gray pt-6 text-md  mb-6">
            Our intuitive ring design feature lets you craft the perfect
            engagement ring effortlessly.
          </p>

          <div className="relative inline-block group">
            <Link href="">
              <p className="px-6 py-2 text-md xl:text-lg font-semibold tracking-wide">
                START DESIGNING
              </p>
              <span className="absolute bottom-0 left-1/2 w-[80%] h-[2px] bg-black -translate-x-1/2 group-hover:w-full transition-all"></span>
            </Link>
          </div>
        </div>
      </section>

      <section className="flex flex-col items-center w-full pt-16 lg:pt-20 2xl:pt-40">
        <MarqueeBrandsHome />
      </section>

      <section className="pt-16 lg:pt-20 2xl:pt-40">
        <TextAboveImage categoryData={categoryData[0].data} />
      </section>
      <section className="container mx-auto pt-16 lg:pt-20 2xl:pt-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center h-full">
          {giftCategories.map((category) => (
            <div key={category.id} className="text-start space-y-2">
              <CustomImg
                srcAttr={category.image}
                altAttr={category.altAttr}
                titleAttr={category.title}
                className="object-cover w-full xl:h-[600px] h-[500px] sm:h-[400px] xl:aspect-[3/4]"
              />
              <p className="pt-4 md:pt-6 text-lg md:text-xl 2xl:text-2xl font-normal">
                {category.title}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto pt-16 lg:pt-20 2xl:pt-40">
        <SwipperHomePageBig collections={collections} />
      </section>
      <section className="pt-16 lg:pt-20 2xl:pt-40 container">
        <ProductSwiper productList={latestProductList} loading={productLoading} title="Latest Products" />
      </section>
      <section className="pt-16 lg:pt-20 2xl:pt-40">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <h3 className="text-lg font-normal font-castoro">
            DISCOVER OUR WORLD
          </h3>
          <h2 className="text-3xl font-normal font-castoro">
            Diamonds as Exceptional as You
          </h2>
        </div>
        <div className="pt-6 lg:pt-10 2xl:pt-18">
          <TextAboveImage categoryData={categoryData[1].data} />
        </div>
      </section>

      <section className="container mx-auto pt-16 lg:pt-20 2xl:pt-40">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center text-center">
          {benefits.map((benefit, index) => (
            <div
              key={`benefits-${index}`}
              className="group flex flex-col items-center space-y-2 relative"
            >
              <CustomImg
                srcAttr={benefit.icon}
                altAttr=""
                titleAttr=""
                className="w-15 h-15"
                style={{
                  transition: "transform 0.3s ease-in-out",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.animation =
                    "rotateY 2s linear infinite";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.animation = "none";
                }}
              />
              <p className="text-md text-[#374151]">{benefit.text}</p>
              {index !== benefits.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 h-12 border-r border-[#d1d5db]"></div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto pt-16 lg:pt-20 2xl:pt-40">
        <AnimatedSection {...animatedContent[0]} />
      </section>

      <section className="mx-auto pt-16 lg:pt-20 2xl:pt-40">
        <TestimonialSlider testimonials={testimonials} />
      </section>

      <section className="mx-auto pt-16 lg:pt-20 2xl:pt-40">
        <AccordionDropdown items={faqData} />
      </section>
    </>
  );
};
export default Home;

const CategoryGallery = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full h-full">
      <div className="relative md:hidden mb-4">
        <button
          onClick={() => setOpen(!open)}
          className="w-full border border-gray-300 px-4 py-2 rounded-md text-sm bg-white text-left"
        >
          {activeCategory}
          <span className="float-right">▼</span>
        </button>
        {open && (
          <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-md">
            {categories.map((category) => (
              <li
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  setOpen(false);
                }}
                className={`px-4 py-2 text-sm cursor-pointer transition ${activeCategory === category
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-primary hover:text-white"
                  }`}
              >
                {category}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="hidden md:flex justify-center gap-8 pb-4 mb-4">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`text-sm tracking-wide pb-1 border-b-2 transition-all ${activeCategory === category
              ? "border-black font-semibold"
              : "border-transparent text-gray-500"
              }`}
          >
            {category}
          </button>
        ))}
      </div>
      <Swiper
        spaceBetween={20}
        slidesPerView={2}
        breakpoints={{
          338: { slidesPerView: 1 },
          540: { slidesPerView: 1.6 },
          1024: { slidesPerView: 2.7 },
          1280: { slidesPerView: 3.5 },
        }}
      >
        {products[activeCategory].map((item, index) => (
          <SwiperSlide key={index} className="flex flex-col">
            <Link href={item.link} passHref>
              <div className="flex flex-col w-full h-full">
                <CustomImg
                  srcAttr={item.src}
                  altAttr={item.label}
                  className="object-cover w-full xl:h-full h-[500px] sm:h-[400px] xl:aspect-[3/4]"
                />
                <p className="mt-4 text-lg text-black tracking-wide">
                  {item.label}
                </p>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};
