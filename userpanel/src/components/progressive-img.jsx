// import { memo, useEffect, useState, useMemo } from "react";
// import Image from "next/image";
// import logo from "@/assets/images/logo.webp";

// const ProgressiveImg = ({
//   placeholderSrc = logo,
//   src,
//   alt = "",
//   className,
//   ...props
// }) => {
//   const [imgSrc, setImgSrc] = useState(placeholderSrc || src);

//   useEffect(() => {
//     const img = new window.Image();
//     img.src = src;
//     img.onload = () => setImgSrc(src);
//   }, [src]);

//   const customClass = useMemo(() => {
//     return placeholderSrc && imgSrc === placeholderSrc
//       ? "progressive-img-loading"
//       : "progressive-img-loaded";
//   }, [imgSrc, placeholderSrc]);

//   return (
//     <Image
//       src={imgSrc}
//       alt={alt}
//       width={props.width || 200}
//       height={props.height || 200}
//       className={`object-contain ${customClass} ${className}`}
//       priority
//       {...props}
//     />
//   );
// };

// export default memo(ProgressiveImg);

import { memo, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import logo from "@/assets/images/logo.webp";
import clsx from "clsx"; // If you want to use clsx for managing classes conditionally

const ProgressiveImg = ({
  placeholderSrc = logo,
  src,
  alt = "",
  className,
  width = 200, // default width
  height = 200, // default height
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(placeholderSrc || src);

  useEffect(() => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => setImgSrc(src);
  }, [src]);

  const customClass = useMemo(() => {
    return placeholderSrc && imgSrc === placeholderSrc
      ? "progressive-img-loading"
      : "progressive-img-loaded";
  }, [imgSrc, placeholderSrc]);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={clsx("object-contain", customClass, className)} // Using clsx to handle class names
      priority
      {...props}
    />
  );
};

export default memo(ProgressiveImg);
