import { CustomImg } from "../dynamiComponents";
import { LinkButton } from "./button";

const HeroBanner = ({
  title,
  description,
  imageSrc,
  videoSrc,
  textAlignment = "center",
  isHomePage = false,
  titleAttr = "",
  altAttr = "",
}) => {
  return (
    <section
      className={`relative overflow-hidden ${
        isHomePage
          ? "h-screen"
          : "mt-20 lg:mt-0 h-[40vh] md:h-[50vh] lg:h-[60vh]"
      }`}
    >
      {imageSrc ? (
        <CustomImg
          srcAttr={imageSrc}
          altAttr={altAttr}
          titleAttr={titleAttr}
          priority
          className="w-full h-full object-cover"
        />
      ) : (
        <video
          muted
          preload="none"
          aria-label="Video player"
          playsInline
          className="absolute top-0 left-0 w-full h-full"
          autoPlay
          loop
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}

      {isHomePage ? (
        <>
          <div className=" absolute inset-0 flex items-center justify-center w-full">
            <div className="md:w-[80%] lg:w-[50%] 2x:w-[50%] text-white text-center">
              <h1 className="text-3xl md:text-4xl 2xl:text-5xl  leading-tight font-castoro">
                Diamonds that <br />
                Deserve You.
              </h1>
              <p className="mt-2 md:mt-4 text-sm md:text-base 2xl:text-lg">
                Free 1ct Diamond Pendant with Purchase<sup>*</sup>
              </p>
              <div className="mt-4 md:mt-6 flex  items-center md:justify-center gap-2.5 md:gap-4">
                <LinkButton
                  href=""
                  className="lg:!h-0 w-fit lg:py-[20px] 2xl:py-[22px] 2xl:!min-w-[240px] lg:!text-sm 2xl:!text-base rounded-none !bg-transparent hover:!border-white hover:!bg-white hover:!text-black"
                >
                  SHOP ENGAGEMENT
                </LinkButton>
                <LinkButton
                  href=""
                  className="lg:!h-0 w-fit lg:py-[20px] 2xl:py-[22px] 2xl:!min-w-[240px] lg:!text-sm 2xl:!text-base rounded-none !bg-transparent hover:!border-white hover:!bg-white hover:!text-black"
                >
                  SHOP ALL JEWELRY
                </LinkButton>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="absolute inset-0 flex justify-center items-center p-4">
            <div
              className={`flex flex-col justify-center items-${textAlignment} w-full 
    max-w-[90%] sm:max-w-[70%] lg:max-w-[60%] text-${textAlignment}  md:gap-3`}
            >
              <h1 className="text-3xl md:text-5xl  2xl:text-6xl text-white font-castoro capitalize">
                {title}
              </h1>

              {description && (
                <p className="text-base md:text-lg text-white">{description}</p>
              )}

              <div className="w-14 h-[2px] bg-white mt-5"></div>
            </div>
          </div>
        </>
      )}
    </section>
  );
};

export default HeroBanner;
