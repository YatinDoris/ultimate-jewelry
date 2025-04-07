"use client";

import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  cardAnimation,
  leftToRightAnimation,
  rightToLeftAnimation,
} from "@/_utils/common";
import { CustomImg } from "../dynamiComponents";
import Link from "next/link";

const AnimatedSection = ({
  description = [],
  title = "",
  direction = "LTF",
  img = "",
  titleAttr = "",
  altAttr = "",
  children,
  className = "",
  titleClassName = "",
  btnLink = "",
  btnText = "",
  isPrimaryColor = false,
}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2 });
  const contentAnimation =
    direction === "LTF" ? rightToLeftAnimation : leftToRightAnimation;
  const layoutDirection =
    direction === "LTF"
      ? "flex-col lg:flex-row"
      : "flex-col-reverse lg:flex-row-reverse";
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <section
      ref={ref}
      className={`flex ${layoutDirection} items-center justify-between gap-6 !text-baseblack ${className}`}
    >
      <motion.div
        initial="hidden"
        animate={controls}
        variants={cardAnimation}
        className="h-[40vh] md:h-[70vh] w-full xxs:w-full lg:w-1/2 relative overflow-hidden "
      >
        <CustomImg
          srcAttr={img}
          titleAttr={titleAttr}
          altAttr={altAttr}
          fill
          priority
          className="object-cover"
        />
      </motion.div>

      <motion.div
        initial="hidden"
        animate={controls}
        variants={contentAnimation}
        className="w-full lg:w-[45%] flex flex-col text-center lg:justify-center lg:items-start  lg:text-left "
      >
        <h2
          className={`text-2xl md:text-4xl md:mb-2 2xl:text-4xl lg:leading-[50px] 2xl:leading-[60px]  font-castoro ${titleClassName} ${
            isPrimaryColor ? "text-primary" : ""
          } `}
        >
          {title}
        </h2>
        <div className="gap-y-2 xl:gap-y-5 flex flex-col mb-3">
          {description.length &&
            description.map((desc, i) => {
              return (
                <p
                  key={`desc-${i}`}
                  className="text-xl 2xl:text-xl text-baseblack"
                >
                  {desc}
                </p>
              );
            })}
        </div>

        <div className="relative  group flex flex-col justify-center items-center">
          <Link href={btnLink}>
            <p className=" py-2 text-lg xl:text-xl font-semibold tracking-wide border-b-2 border-black w-fit">
              {btnText}
            </p>
          </Link>
        </div>

        {children}
      </motion.div>
    </section>
  );
};

export default AnimatedSection;
