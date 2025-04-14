"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
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

import { ChevronLeft, ChevronRight } from "lucide-react";
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
import { CustomImg, ProductGrid } from "@/components/dynamiComponents";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLatestProductList } from "@/_actions/product.actions";

const diamondShapes = [
  { image: diamondPear, titleAttr: "", altAttr: "", title: "PEAR" },
  { image: diamondRound, titleAttr: "", altAttr: "", title: "ROUND" },
  { image: diamondAsscher, titleAttr: "", altAttr: "", title: "ASSCHER" },
  { image: diamondPrincess, titleAttr: "", altAttr: "", title: "PRINCESS" },
  { image: diamondCushion, titleAttr: "", altAttr: "", title: "CUSHION" },
  { image: diamondHeart, titleAttr: "", altAttr: "", title: "HEART" },
  { image: diamondOval, titleAttr: "", altAttr: "", title: "OVAL" },
  { image: diamondEmerald, titleAttr: "", altAttr: "", title: "EMERALD" },
  { image: diamondRadiant, titleAttr: "", altAttr: "", title: "RADIANT" },
  { image: diamondmarquise, titleAttr: "", altAttr: "", title: "MARQUISE" },
];

const categories = ["RINGS", "EARRINGS", "BRACELETS", "NECKLACES"];

const categoryData = [
  {
    title: "QUICK SHIP GIFTS",
    image: home18,
    link: "",
  },
  {
    title: "GIFTS FOR HER",
    image: home19,
    link: "",
  },
];

const products = {
  RINGS: [
    { src: home10, label: "SOLITAIRE" },
    { src: home11, label: "HALO" },
    { src: home16, label: "BANGLE" },
    { src: home17, label: "NEW ARRIVALS" },
  ],
  EARRINGS: [
    { src: home12, label: "STUDS" },
    { src: home13, label: "HOOPS" },
    { src: home16, label: "BANGLE" },
    { src: home17, label: "NEW ARRIVALS" },
  ],
  BRACELETS: [
    { src: home14, label: "TENNIS" },
    { src: home15, label: "FASHION" },
    { src: home16, label: "BANGLE" },
    { src: home17, label: "NEW ARRIVALS" },
  ],
  NECKLACES: [
    { src: home10, label: "PENDANT" },
    { src: home11, label: "STATEMENT" },
    { src: home16, label: "BANGLE" },
    { src: home17, label: "NEW ARRIVALS" },
  ],
};

const Home = () => {
  const dispatch = useDispatch();
  const { latestProductList, productLoading } = useSelector(({ product }) => product)

  useEffect(() => {
    dispatch(
      fetchLatestProductList(4)
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
                  className=" lg:!h-[2.3rem] w-fit !py-6 !bg-transparent font-medium hover:!border-primary hover:!bg-primary hover:!text-white"
                >
                  SHOP ENGAGEMENT
                </LinkButton>
                <LinkButton
                  href=""
                  className=" lg:!h-[2.3rem] w-fit !py-6 font-medium !bg-transparent hover:!border-primary hover:!bg-primary hover:!text-white"
                >
                  SHOP ALL JEWELRY
                </LinkButton>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="  mt-10 md:mt-20 2xl:mt-24 ">
        <ProductGrid
          productList={latestProductList}
          isLoading={productLoading}
          noDataFoundMsg={
            "Stay tuned! The products you're looking for will be available soon. We appreciate your patience."
          } />
      </section>
      <section className="pt-10 md:pt-20 2xl:pt-36 grid grid-cols-1 lg:grid-cols-[0.7fr_1fr] items-center justify-center gap-10 container">
        <div className="flex flex-col items-center text-center bg-transparent">
          <CustomImg
            srcAttr={home20}
            altAttr=""
            className="w-40 md:w-48 2xl:w-56"
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

      <div className="pt-4 md:pt-6 2xl:pt-36 ">
        <CustomImg srcAttr={home3} altAttr="" className="w-full object-cover" />
      </div>

      <section className="container  mt-10 md:mt-20 2xl:mt-24 ">
        <CategoryGallery />
      </section>

      <section className="bg-[#FFF9EF] w-full  px-6 md:px-16 flex flex-col md:flex-row items-center justify-center container mt-10 md:mt-20 2xl:mt-36">
        <div className="w-full md:w-1/2 flex justify-center mb-10 md:mb-0">
          <CustomImg
            srcAttr={home2}
            altAttr=""
            width={500}
            height={500}
            className="object-contain"
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-center  pb-12 md:pb-0 text-center  justify-center align-middle">
          <h2 className="text-3xl md:text-4xl xl:text-5xl font-medium mb-2 font-castoro">
            Design Your Engagement Ring
          </h2>
          <p className="pt-2 text-md xl:text-lg font-castoro">
            Receive a Free Matching Wedding Band*
          </p>

          <p className="text-gray pt-6 text-md  mb-6">
            With our easy-to-use ring design feature, you can create the
            engagement ring of your dreams.
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

      <section className="container  mt-10 md:mt-20 2xl:mt-24 ">
        <CategoryBanners />
      </section>

    </>
  );
};
export default Home;

const CategoryGallery = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const [open, setOpen] = useState(false);

  return (
    <div>
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
            {categories.map((cat) => (
              <li
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setOpen(false);
                }}
                className={`px-4 py-2 text-sm cursor-pointer transition ${activeCategory === cat
                  ? "bg-primary text-white"
                  : "text-gray-700 hover:bg-primary hover:text-white"
                  }`}
              >
                {cat}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="hidden md:flex justify-center gap-8 pb-4 mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-sm font-semibold tracking-wide pb-1 border-b-2 transition-all ${activeCategory === cat
              ? "border-black"
              : "border-transparent text-gray-500"
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 ">
        {products[activeCategory].map((item, index) => (
          <Link href={item.src} passHref key={index}>
            <div key={index} className="flex flex-col w-full h-full">
              <CustomImg
                srcAttr={item.src}
                altAttr={item.label}
                className="object-cover xl:w-full xl:h-full h-[500px] sm:h-[400px] "
              />
              <p className="mt-4 text-md text-black tracking-wide">
                {item.label}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const CategoryBanners = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
      {categoryData.map((item, index) => (
        <div
          key={index}
          className="group relative w-full h-[85vh] overflow-hidden"
        >
          <CustomImg
            srcAttr={item.image}
            altAttr={item.title}
            fill
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
          {/* <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition duration-300" /> */}
          <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 text-center text-white z-10">
            <h3 className="text-lg md:text-2xl  tracking-wider mb-4  font-castoro">
              {item.title}
            </h3>
            <div>
              <LinkButton
                href=""
                className=" lg:!h-[2.3rem] w-fit !py-6 !bg-transparent font-semibold hover:!bg-[#2B2B2B] hover:!border-[#2B2B2B] hover:!text-white !rounded-none"
              >
                SHOP ENGAGEMENT
              </LinkButton>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
