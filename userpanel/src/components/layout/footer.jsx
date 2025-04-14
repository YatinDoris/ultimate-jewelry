// import footerLogo from "@/assets/images/footerLogo.webp";
// import rightSidePrimary from "@/assets/icons/rightSidePrimary.svg";
// import Link from "next/link";
// import {
//   companyAddress,
//   companyEmail,
//   companyPhoneNo,
//   facebookUrl,
// } from "@/_helper/environment";
// import {
//   FaFacebookF,
//   FaInstagram,
//   FaPinterestP,
//   FaTiktok,
// } from "react-icons/fa";
// import { CustomImg } from "../dynamiComponents";

// const usefulLinks = [
//   { title: "Get on the Guest List", href: "/", usefulClass: "font-semibold" },
//   {
//     title: "Perks include $100 off your first order*",
//     href: "",
//     usefulClass: "",
//   },
//   {
//     title: "Plus new product launches, store openings, and more!",
//     href: "/engagement-rings",
//     usefulClass: "",
//   },
// ];
// const contactLinks = [
//   { title: "877-476-9627", href: "" },
//   { title: "Affiliates", href: "" },
//   { title: "Email Us", href: "" },
//   { title: "Live Chat", href: "" },
//   { title: "Book an Appointment", href: "" },
//   { title: "Store Locator", href: "" },
//   { title: "Careers", href: "" },
// ];
// const supportInfo = [
//   {
//     title: "Free Shipping",
//     href: "",
//   },
//   {
//     title: "Free Returns",
//     href: "/",
//   },
//   {
//     title: "Warranty",
//     href: "/",
//   },
//   {
//     title: "Payment & Financing",
//     href: "/",
//   },
//   {
//     title: "Special Offers",
//     href: "/",
//   },
//   {
//     title: "GB Club",
//     href: "/",
//   },
//   {
//     title: "Track Your Order",
//     href: "/",
//   },
//   {
//     title: "Price Match Guarantee",
//     href: "/",
//   },
//   {
//     title: "GB | 365",
//     href: "/",
//   },
//   {
//     title: "Blog",
//     href: "/",
//   },
//   {
//     title: "Accessibility Statement",
//     href: "/",
//   },
//   {
//     title: "Support Center",
//     href: "/",
//   },
// ];

// export default function footer() {
//   return (
//     <footer className=" text-white fixedw-full  bg-primary bg-center mt-16 lg:mt-20 2xl:mt-40">
//       <div className="container !gap-x-36 md:!gap-x-0 gap-2 gap-y-7 py-24 grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4">
//         <div>
//           <CustomImg srcAttr={footerLogo} altAttr="" />
//         </div>

//         <div className="lg:mx-auto 2xl:mx-1 ">
//           <h3 className="mb-1 text-lg 2xl:text-2xl font-prata">Support</h3>
//           <div className="w-28 h-[3px] bg-primary"></div>
//           <ul className="mt-4 2xl:mt-6 text-[0.9375rem] 2xl:text-[1rem] space-y-2.5 2xl:space-y-3">
//             {supportInfo.map((item, i) => (
//               <li
//                 key={item.title + i}
//                 className="flex items-center gap-x-3 gap-2"
//               >
//                 <Link
//                   className="transition-all duration-300 hover:text-primary lg:pr-[10px]"
//                   href={item.href}
//                 >
//                   {item.title}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div className="flex flex-col">
//           <h3 className="mb-1 text-lg 2xl:text-2xl font-prata">Contact</h3>
//           <div className="w-28 h-[3px] bg-primary"></div>
//           <ul className="mt-4 2xl:mt-6 text-[0.9375rem] 2xl:text-[1rem] space-y-2.5 2xl:space-y-3">
//             {contactLinks.map((item) => (
//               <li key={item.title} className="transition-all duration-300">
//                 <Link
//                   className="transition-all duration-300 hover:text-primary lg:pr-[10px]"
//                   href={item.href}
//                 >
//                   {item.title}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </div>

//         <div className="flex flex-col   lg:mx-auto">
//           <h3 className="mb-1 text-lg 2xl:text-2xl font-prata">Subscribe</h3>
//           <div className="w-28 h-[3px] bg-primary"></div>
//           <ul className="mt-4 2xl:mt-6 text-[0.9375rem] 2xl:text-[1rem] space-y-2.5 2xl:space-y-3">
//             {usefulLinks.map((item, i) => (
//               <li
//                 key={item.title + i}
//                 className={`flex items-center gap-x-3 gap-2 ${item.usefulClass}`}
//               >
//                 <Link
//                   className="transition-all duration-300 hover:text-primary"
//                   href={item.href}
//                 >
//                   {item.title}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//           <div className="relative flex items-center mt-4">
//             <input
//               type="email"
//               placeholder="Sign Me Up"
//               className="w-full px-4 py-3 text-lg bg-transparent border border-white  outline-none placeholder:text-white"
//             />
//             <button className="absolute right-0 h-full px-5 bg-white text-[#4A1612]  flex items-center  justify-center hover:bg-gray-200 transition">
//               <CustomImg srcAttr={rightSidePrimary} altAttr="" />
//             </button>
//           </div>

//           <div className="flex gap-8 mt-6 text-white text-2xl">
//             <a
//               href="#"
//               className="transition transform hover:scale-110 hover:text-white"
//             >
//               <FaFacebookF />
//             </a>
//             <a
//               href="#"
//               className="transition transform hover:scale-110 hover:text-white"
//             >
//               <FaInstagram />
//             </a>
//             <a
//               href="#"
//               className="transition transform hover:scale-110 hover:text-white"
//             >
//               <FaPinterestP />
//             </a>
//             <a
//               href="#"
//               className="transition transform hover:scale-110 hover:text-white"
//             >
//               <FaTiktok />
//             </a>
//           </div>
//         </div>
//       </div>

//       <div className="container flex-row  flex-wrap mx-auto flex xss:justify-center   space-x-8 text-lg px-6 xl:px-0  pb-6">
//         <span>© 2025 Grownbrilliance.com</span>
//         <a href="" className="hover:underline">
//           Terms & Conditions
//         </a>
//         <a href="" className="hover:underline">
//           Privacy Policy
//         </a>
//         <a href="" className="hover:underline">
//           Do Not Sell My Information
//         </a>
//         <a href="" className="hover:underline">
//           Site Map
//         </a>
//       </div>
//     </footer>
//   );
// }

import whiteLogo from "@/assets/images/white-logo.webp";
import footerJewelry from "@/assets/images/footer-jewelry.webp";

import CustomImg from "../ui/custom-img";
import {
  companyEmail,
  contactNumber,
  facebookUrl,
  instagramUrl,
  pinterestUrl,
  tiktokUrl,
} from "@/_helper";
import {
  FaFacebookF,
  FaInstagram,
  FaPinterest,
  FaTiktok,
} from "react-icons/fa6";
import Link from "next/link";
import SubscribeEmail from "../ui/SubscribeEmail";

export default function footer() {
  const mediaLinks = [
    {
      icon: <FaFacebookF />,
      href: facebookUrl,
    },
    {
      icon: <FaInstagram />,
      href: instagramUrl,
    },
    {
      icon: <FaTiktok />,
      href: tiktokUrl,
    },
    {
      icon: <FaPinterest />,
      href: pinterestUrl,
    },
  ];
  const footerLinks = [
    {
      title: "Support",
      navLinks: [
        {
          title: "Returns",
          href: "/return-history",
        },
        {
          title: "Shipping",
          href: "/shipping",
        },
        {
          title: "Warranty",
          href: "/warranty",
        },
        {
          title: "Track Your Order",
          href: "/track-your-order",
        },
        {
          title: "Payment and Financing",
          href: "/payment-financing",
        },
      ],
    },
    {
      title: "Contact",
      navLinks: [
        {
          title: contactNumber,
          href: `tel:${contactNumber}`,
        },
        {
          title: "Email Us",
          href: `mailto:${companyEmail}`,
        },
        {
          title: "Book an Appointment",
          href: "/contact-us/book-appointment",
        },
      ],
    },
    {
      title: "Subscribe",
      subscribe: true,
      // subTitle: "Get on the Guest List",
      // description:
      //   "Perks include $100 off your first order* Plus new product launches, store openings, and more!",
      // mediaLinks,
    },
  ];
  return (
    <footer className="mt-10 md:mt-14 lg:mt-20 2xl:mt-20 bg-primary">
      <div className="p-8 pt-12 md:p-12 md:pt-14 lg:p-16 lg:pt-20 text-white">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <CustomImg
              srcAttr={whiteLogo}
              altAttr=""
              titleAttr=""
              className="w-60 ps-6"
            />
            <div className="bg-offwhite p-4 md:p-6 leading-relaxed">
              <CustomImg
                srcAttr={footerJewelry}
                className="w-full"
                altAttr=""
                titleAttr=""
              />
              <h3 className="uppercase text-black text-lg md:text-xl py-4">
                Watch our new video
              </h3>
              <p className="text-[#888888] text-base md:text-lg">
                On the other hand, we denounce with righteous indignation and
                dislike men who are so beguiled and demoralized by the charms of
                pleasure of the
              </p>
            </div>
          </div>
          <div className="lg:col-span-8">
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
              {footerLinks?.length &&
                footerLinks?.map((link, index) => {
                  return (
                    <div key={`footer-link-${index}`}>
                      <h4 className="text-lg font-semibold">{link.title}</h4>

                      <ul className="mt-4">
                        {link?.navLinks?.length &&
                          link?.navLinks?.map((nav, index) => {
                            return (
                              <Link href={nav.href || "#"} key={`nav-${index}`}>
                                <li className="py-1">{nav.title}</li>
                              </Link>
                            );
                          })}
                        {link?.subscribe ? (
                          <>
                            <h3 className="font-bold">Get on the Guest List</h3>
                            <p className="mt-1">
                              Perks include $100 off your first order* Plus new
                              product launches, store openings, and more!
                            </p>
                            <SubscribeEmail />
                            <div className="flex gap-5 mt-5 lg:mt-8">
                              {mediaLinks?.map((media, index) => {
                                return (
                                  <Link
                                    className="text-2xl"
                                    key={`social-media-${index}`}
                                    href={media.href}
                                    target="_blank"
                                  >
                                    {media.icon}
                                  </Link>
                                );
                              })}
                            </div>
                          </>
                        ) : null}
                      </ul>
                    </div>
                  );
                })}
            </div>
            <div className="flex flex-col md:flex-row justify-end  gap-2 md:gap-6 mt-8 lg:mt-4">
              <ul className="md:list-disc">
                <li>© 2025 Katanoff.com</li>
              </ul>
              <Link href={"/terms-and-conditions"}>Terms & Conditions</Link>
              <Link href={"/privacy-policy"}>Privacy Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
