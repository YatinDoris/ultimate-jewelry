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
  direction = "LTR",
  img = "",
  titleAttr = "",
  altAttr = "",
  children,
  className = "",
  titleClassName = "",
  btnLink = "",
  btnText = "",
  pointsDescription = "",
  points = [],
  isPrimaryColor = false,
}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2 });
  const contentAnimation =
    direction === "LTR" ? rightToLeftAnimation : leftToRightAnimation;
  const layoutDirection =
    direction === "LTR"
      ? "flex-col lg:flex-row"
      : "flex-col lg:flex-row-reverse";
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <section
      ref={ref}
      className={`w-full sm:px-4 md:px-6 lg:px-0 flex ${layoutDirection} items-center justify-between gap-4 !text-baseblack ${className}`}
    >
      <motion.div
        initial="hidden"
        animate={controls}
        variants={cardAnimation}
        className="h-[40vh] md:h-[60vh] lg:h-[85vh] xl:h-[88vh] w-full xxs:w-full lg:w-1/2 relative overflow-hidden mt-12 md:mt-0"
      >
        "
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
        className="w-full lg:w-[45%] flex flex-col items-center justify-center text-left sm:text-center sm:px-8 md:px-0 lg:mt-0 lg:mb-0 xl:pr-20 xl:pl-20 xxs:px-3  lg:items-start"
      >
        <h2
          className={`text-4xl lg:text-4xl md:text-5xl md:mb-0 mt-4 sm:mb-0 xxs:mt-0 lg:mt-6 lg:mb-0 2xl:mt-6 md:mt-4 2xl:text-4xl lg:leading-[50px] 2xl:leading-[60px] font-castoro ${titleClassName} ${isPrimaryColor ? "text-primary" : ""
            } `}
        >
          {title}
        </h2>
        <div className="gap-y-2 xl:gap-y-5 flex flex-col mb-3 ">
          {Array.isArray(description) &&
            description.length > 0 &&
            description.map((desc, i) => (
              <p
                key={`desc-${i}`}
                className="font-figtree font-medium text-left text-base sm:text-xl xxs:px-2 md:px-0 sm:mb-2 lg:mt-0 md:text-2xl mt-3 lg:text-base leading-relaxed tracking-normal text-baseblack px-0"
              >
                {desc}
              </p>
            ))}
        </div>

        <div className="relative  group flex flex-col justify-center items-center">
          <Link href={btnLink}>
            <p className=" py-2 text-lg xl:text-xl font-semibold tracking-wide border-b-2 border-black w-fit">
              {btnText}
            </p>
          </Link>
        </div>

        {Array.isArray(points) && points.length > 0 && (
          <>
            {pointsDescription && (
              <p className="font-figtree font-medium text-left items-start text-base sm:text-xl sm:mb-6 xxs:mb-4 sm:mt-0 lg:mb-4 lg:mt-0 md:text-2xl lg:text-base leading-relaxed tracking-normal text-baseblack px-1 mx-0 w-full">
                {pointsDescription}
              </p>
            )}

            <ul>
              {points.map((point, index) => (
                <li
                  key={index}
                  className="font-medium sm:text-xl lg:text-base text-left md:text-2xl xl:text-lg xxs:px-1 mb-2"
                >
                  <strong>{point.title}:</strong> {point.description}
                </li>
              ))}
            </ul>
          </>
        )}

        {children}
      </motion.div>
    </section>
  );
};

export default AnimatedSection;
