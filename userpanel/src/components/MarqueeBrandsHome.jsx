"use client";
import watchesBrand1 from "@/assets/images/home/watches-brand-1.webp";
import watchesBrand2 from "@/assets/images/home/watches-brand-2.webp";
import watchesBrand3 from "@/assets/images/home/watches-brand-3.webp";
import watchesBrand4 from "@/assets/images/home/watches-brand-4.webp";
import watchesBrand5 from "@/assets/images/home/watches-brand-5.webp";
import watchesBrand6 from "@/assets/images/home/watches-brand-6.webp";
import watchesBrand7 from "@/assets/images/home/watches-brand-7.webp";
import watchesBrand8 from "@/assets/images/home/watches-brand-8.webp";
import watchesBrand10 from "@/assets/images/home/watches-brand-10.webp";
import watchesBrand11 from "@/assets/images/home/watches-brand-11.webp";
import watchesBrand12 from "@/assets/images/home/watches-brand-12.webp";
import watchesBrand13 from "@/assets/images/home/watches-brand-13.webp";

import { motion } from "framer-motion";
import { CustomImg } from "./dynamiComponents";

const tempTopRow = [watchesBrand1, watchesBrand2, watchesBrand3, watchesBrand4];
const tempMiddleRow = [
  watchesBrand5,
  watchesBrand6,
  watchesBrand7,
  watchesBrand8,
];
const tempBottomRow = [
  watchesBrand10,
  watchesBrand11,
  watchesBrand12,
  watchesBrand13,
];

const topRow = [...tempTopRow, ...tempTopRow, ...tempTopRow, ...tempTopRow];
const middleRow = [
  ...tempMiddleRow,
  ...tempMiddleRow,
  ...tempMiddleRow,
  ...tempMiddleRow,
];
const bottomRow = [
  ...tempBottomRow,
  ...tempBottomRow,
  ...tempBottomRow,
  ...tempBottomRow,
];

const MarqueeBrandsHome = () => {
  return (
    <div className="w-full overflow-hidden">
      <motion.div
        className="flex items-center whitespace-nowrap"
        animate={{ x: ["0%", "-100%"] }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
      >
        {topRow.map((src, i) => (
          <div
            key={i}
            className={` flex-shrink-0 bg-white  ${
              i % 2 === 0 ? "" : "opacity-0"
            }`}
          >
            <CustomImg
              srcAttr={src}
              altAttr=""
              titleAttr=""
              className="h-32 w-80"
            />
          </div>
        ))}
      </motion.div>

      <motion.div
        className="flex items-center whitespace-nowrap"
        animate={{ x: ["0%", "-100%"] }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
      >
        {middleRow.map((src, i) => (
          <div
            key={i}
            className={` flex-shrink-0 bg-white  ${
              i % 2 !== 0 ? "" : "opacity-0"
            }`}
          >
            <CustomImg
              srcAttr={src}
              altAttr=""
              titleAttr=""
              className="h-32 w-80"
            />
          </div>
        ))}
      </motion.div>
      <motion.div
        className="flex items-center whitespace-nowrap"
        animate={{ x: ["0%", "-100%"] }}
        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
      >
        {bottomRow.map((src, i) => (
          <div
            key={i}
            className={` flex-shrink-0 bg-white  ${
              i % 2 === 0 ? "" : "opacity-0"
            }`}
          >
            <CustomImg
              srcAttr={src}
              altAttr=""
              titleAttr=""
              className="h-32 w-80"
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default MarqueeBrandsHome;
