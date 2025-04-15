"use client";

import { memo, useMemo, useState, useEffect } from "react";
import Image from "next/image";
import logo from "@/assets/images/logo.webp";

const ProgressiveVed = ({
  placeholderSrc = logo,
  src,
  type = "video/mp4",
  className = "",
  width = 320,
  height = 240,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = src;
    video.oncanplay = () => setIsLoaded(true);
  }, [src]);

  const customClass = useMemo(() => {
    return isLoaded
      ? "opacity-100 w-full h-full object-contain transition-all duration-500"
      : "w-1/2 h-1/2 animate-fade-in";
  }, [isLoaded]);

  return (
    <div className="relative w-full h-full flex justify-center items-center">
      {!isLoaded && (
        <Image
          src={placeholderSrc}
          alt="Loading video"
          width={width}
          height={height}
          className="opacity-25 absolute  animate-fade-in"
          style={{ zIndex: 5 }}
        />
      )}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        width={width}
        height={height}
        onCanPlay={() => setIsLoaded(true)}
        className={`${customClass} ${className}`}
        {...props}
      >
        <source src={src} type={type} />
      </video>
    </div>
  );
};

export default memo(ProgressiveVed);
