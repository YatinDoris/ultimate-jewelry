import HeroBanner from "@/components/ui/HeroBanner";
import banner from "@/assets/images/about-us/banner.webp";
import ringImage from "@/assets/images/about-us/ringImage.webp";
import craftingImage from "@/assets/images/about-us/craftingImage.webp";
import diamondImage from "@/assets/images/about-us/diamondImage.webp";
import tranperencyImg from "@/assets/images/about-us/Transperency.webp";
import SustainImg from "@/assets/images/about-us/Sustainability.webp";
import Compassion from "@/assets/images/about-us//Compassion.webp";
import Inclusion from "@/assets/images/about-us/Inclusion.webp";
import herImage from "@/assets/images/about-us/herImage.webp";
import himImage from "@/assets/images/about-us/himImage.webp";
import giftImage from "@/assets/images/about-us/gifImage.webp";

import { AnimatedSection } from "@/components/dynamiComponents";
const ourBeginningContent = {
  img: ringImage,
  titleAttr: "",
  direction: "LTR",
  altAttr: "",
  title: "Our Beginning",
  description: [
    "Jewelry Is More Than Adornment—It’s A Story, A Legacy, A Timeless Connection To Moments That Matter. Our Journey Began With A Passion For Exquisite Craftsmanship And A Love For The Artistry That Turns Precious Metals And Gemstones Into Wearable Treasures.From The Very Beginning, We Set Out To Redefine Elegance, Sourcing Only The Finest Materials And Working With Master Artisans To Create Jewelry That Is Both Luxurious And Enduring. Each Piece In Our Collection Is A Testament To Our Commitment To Quality, Innovation, And Timeless Beauty.",

    "Welcome To Katanoff, Where Craftsmanship Meets Emotion, And Every Piece Of Jewelry Tells A Story. Founded During A Time Of Global Change, We Set Out To Revolutionize How Jewelry Is Experienced Online. Rooted In A Legacy Of Craftsmanship Yet Driven By A Spirit Of Innovation, Katanoff Blends Tradition With Modernity, Creating Timeless Pieces For Every Milestone In Life.",
  ],
};

const ourCraftingContent = {
  img: craftingImage,
  titleAttr: "",
  altAttr: "",
  direction: "RTL",
  title: "From Legacy To Innovation",
  description: [
    "For Over 10 Years, A Family Deeply Rooted In Jewelry Craftsmanship Has Been Creating Timeless Pieces, Serving Communities Through Offline Stores And Wholesale Operations. During The Pandemic, When The World Came To A Standstill, Their Passion For Connection And Innovation Sparked A New Chapter.",
    "In 2020, Amidst The Challenges Of Lockdown, Katanoff Was Born To Bring Generations Of Expertise And Artistry Directly To Customers’ Homes. Designed As An Online Platform, It Offers Fine Jewelry With The Comfort And Safety Of Shopping From Home—Without Compromising On Quality Or Craftsmanship.",
    "As A Family-Run Operation, Katanoff Ensures Every Piece Reflects A Legacy Of Trust, Meticulous Attention To Detail, And Strong Values. With No Middlemen, Customers Benefit From Better Prices, Ethical Practices, And A Dedication To Excellence Honed Over Decades. Today, Katanoff Bridges Tradition And Modern Convenience, Celebrating Life’s Most Cherished Moments With Jewelry Crafted From The Heart.",
  ],
};

const ourValueContent = {
  img: diamondImage,
  titleAttr: "",
  altAttr: "",
  title: "Our Value",
  pointsDescription: "Rooted in Tradition, Inspired by Tomorrow",
  points: [
    {
      title: "Innovation",
      description:
        "We Embrace Technology To Redefine How You Experience Jewelry Online.",
    },
    {
      title: "Transparency",
      description: "From Materials To Pricing, We Believe In Complete Honesty.",
    },
    {
      title: "Connection",
      description:
        "Every Design Fosters A Connection—Between You And Your Cherished Moments, And Between Us And Our Community.",
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <HeroBanner
        imageSrc={banner}
        title={"About Us"}
        description={"Celebrating Every Shade of You"}
        altAttr=""
        titleAttr=""
      />

      <div className="md:mt-12 lg:mt-36 sm:mt-48">
        <AnimatedSection {...ourBeginningContent} />
        <AnimatedSection {...ourCraftingContent} />
        <AnimatedSection {...ourValueContent} />
      </div>

      <section className="bg-alabaster py-0.3 px-2 sm:px-8 lg:px-5 mb-20 lg:mt-36 text-baseblack font-castoro xxs:mt-14">
        <div className="text-center max-w-4xl px-2 mx-auto py-2 font-castoro">
          <h2 className="text-2xl xxs:text-3xl sm:text-8xl md:text-5xl mb-4 mt-12">
            Our Mission Pillars
          </h2>
          <p className="text-base sm:text-xl lg:text-xl xxs:text-sm leading-relaxed sm:mb-0 xxs:mb-4 lg:mb-0">
            Our Mission To Cultivate A More Transparent, Sustainable,
            Compassionate, And Inclusive Jewelry Industry Has Been At The Core
            Of Everything We Do From Day One. It’s In Our DNA.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 max-w-7.5xl mt-5 text-baseblack text-left font-castoro">
          <div>
            <img
              src={tranperencyImg.src}
              alt="Transparency"
              className="w-full h-auto object-cover"
            />
            <h3 className="lg:text-3xl md:text-3xl xxs:text-2xl font-normal xxs:text-center mt-4 mb-6 xxs:mb-2 lg:text-left sm:text-center md:text-left">
              Transparency
            </h3>
            <p className="lg:mb-14 text-base sm:text-xl xxs:text-sm xxs:text-center xxs:mt-2 lg:text-left md:text-left lg:text-xl leading-relaxed font-medium">
              We Know Where Our Precious Metals And Gemstones Come From And How
              Our Jewelry Is Made.
            </p>
          </div>

          <div className="px-0">
            <img
              src={SustainImg.src}
              alt="Sustainability"
              className="w-full h-auto object-cover"
            />
            <h3 className="lg:text-3xl md:text-3xl xxs:text-2xl font-normal xxs:text-center mt-4 mb-6 xxs:mb-2 lg:text-left sm:text-center md:text-left">
              Sustainability
            </h3>
            <p className="lg:mb-14 text-base sm:text-xl xxs:text-sm xxs:text-center xxs:mt-2 lg:text-left md:text-left lg:text-xl leading-relaxed font-medium">
              We Use Recycled And Sustainable Materials, Apply Energy-Efficient Practices, And Minimize Our Carbon Footprint.
            </p>
          </div>

          <div className="px-0">
            <img
              src={Compassion.src}
              alt="Compassion"
              className="w-full h-auto object-cover"
            />
            <h3 className="text-3xl font-normal xxs:text-center mt-4 mb-6 xxs:mb-2 lg:text-left sm:text-center md:text-left">
              Compassion
            </h3>
            <p className="lg:mb-14 text-base sm:text-xl xxs:text-sm xxs:text-center xxs:mt-2 lg:text-left md:text-left lg:text-xl leading-relaxed font-medium">
              We Care About And Are Committed To Our Communities, Our Employees, And The People Who Help To Bring Our Jewelry To Life.
            </p>
          </div>

          <div className="px-0">
            <img
              src={Inclusion.src}
              alt="Inclusion"
              className="w-full h-auto  object-cover"
            />
            <h3 className="text-3xl font-normal xxs:text-center mt-4 mb-6 xxs:mb-2 lg:text-left sm:text-center md:text-left">
              Inclusion
            </h3>
            <p className="mb-14 text-base sm:text-xl xxs:text-sm xxs:text-center xxs:mt-2 lg:text-left md:text-left lg:text-xl leading-relaxed font-medium">
              We Support And Invest In Our Diverse Teams To Ensure Every Employee Knows That They Belong, And Our Designs Are Always Crafted With Inclusivity In Mind.
            </p>
          </div>
        </div>
      </section>

      {/* Jewelry Collection Section */}
      <section className="container lg:px-6 lg:pt-20 2xl:pt-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center">
          <a href="/collections/collection/Gifts_Under_$500">
            <img
              alt="Katan Off | Diamond Jewelry, Coin, Gold, Silver, Platinum"
              title="Gifts Under $500"
              loading="lazy"
              width="544"
              height="510"
              decoding="async"
              data-nimg="1"
              className="object-cover w-full"
              src={himImage.src}
            />
            <p className="pt-4 md:pt-6 text-lg md:text-xl 2xl:text-2xl font-semibold">GIFTS UNDER $500
</p>
          </a>
          <a href="/collections/collection/Gifts_FOR_HER">
            <img
              alt="Katan Off | Diamond Jewelry, Coin, Gold, Silver, Platinum"
              title="Gifts FOR HER"
              loading="lazy"
              width="543"
              height="510"
              decoding="async"
              data-nimg="1"
              className="object-cover w-full"
              src={giftImage.src}
            />
            <p className="pt-4 md:pt-6 text-lg md:text-xl 2xl:text-2xl font-semibold"> GIFTS FOR HER</p>
          </a>
          <a href="/collections/collection/Gifts_for_Him">
            <img
              alt="Katan Off | Diamond Jewelry, Coin, Gold, Silver, Platinum"
              title="Gifts for Him"
              loading="lazy"
              width="543"
              height="510"
              decoding="async"
              data-nimg="1"
              className="object-cover w-full"
              src={herImage.src}
            />
            <p className="pt-4 md:pt-6 text-lg md:text-xl 2xl:text-2xl font-semibold"> GIFTS FOR HIM</p>
          </a>
        </div>
      </section>
    </>
  );
}
