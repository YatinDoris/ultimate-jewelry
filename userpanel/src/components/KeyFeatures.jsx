import { CustomImg } from "./dynamiComponents";
import pricing from "@/assets/icons/pricing.svg";
import shippingPrimary from "@/assets/icons/shippingPrimary.svg";
import warranty from "@/assets/icons/warranty.svg";
import returns from "@/assets/icons/returns.svg";
const features = [
  {
    icon: pricing,
    altAttr: "",
    titleAttr: "",
    title: "Competitive Pricing",
    description:
      "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Integer Egestas Nisi Nec Libero Fermentum.",
  },
  {
    icon: shippingPrimary,
    altAttr: "",
    titleAttr: "",
    title: "Free Shipping",
    description:
      "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Integer Egestas Nisi Nec Libero Fermentum.",
  },
  {
    icon: returns,
    altAttr: "",
    titleAttr: "",
    title: "Free Returns",
    description:
      "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Integer Egestas Nisi Nec Libero Fermentum.",
  },
  {
    icon: warranty,
    altAttr: "",
    titleAttr: "",
    title: "Lifetime Warranty",
    description:
      "Lorem Ipsum Dolor Sit Amet, Consectetur Adipiscing Elit. Integer Egestas Nisi Nec Libero Fermentum.",
  },
];
export default function KeyFeatures() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 gap-y-12 lg:gap-y-1 text-center md:text-start justify-center">
      {features.map((feature, index) => (
        <div key={index} className="flex flex-col items-center md:items-start">
          <CustomImg
            srcAttr={feature.icon}
            altAttr={feature.title}
            className="w-12 h-12 mb-4"
          />
          <h3 className="text-xl xl:text-2xl 2xl:text-3xl text-baseblack font-normal">
            {feature.title}
          </h3>
          <p className="text-baseblack text-base xl:text-lg mt-4 w-[90%] md:w-full">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
}
