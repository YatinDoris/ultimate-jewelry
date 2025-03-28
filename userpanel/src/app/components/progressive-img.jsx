import { memo, useEffect, useState, useMemo } from "react";
import Image from "next/image";
import logo from "@/assets/logo.webp"; // Ensure the file is in the "public" folder

const ProgressiveImg = ({ placeholderSrc = logo, src, alt = "", ...props }) => {
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
      width={props.width || 200} // Provide a default width
      height={props.height || 200} // Provide a default height
      className={`object-contain ${customClass}`}
      priority
      {...props}
    />
  );
};

export default memo(ProgressiveImg);
