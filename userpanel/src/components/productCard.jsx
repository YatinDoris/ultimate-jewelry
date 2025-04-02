import { helperFunctions } from "@/_helper";
import Link from "next/link";
import { ProgressiveImg } from "./dynamiComponents";

export default function ProductCard({
  img,
  title,
  discount,
  onClick,
  price,
  goldColorVariations,
  productLink = "",
}) {
  productLink =
    productLink ||
    `/products/${helperFunctions.stringReplacedWithUnderScore(title)}`;

  const originalPrice = discount
    ? parseFloat((price / (1 - discount / 100)).toFixed(2))
    : price;
  return (
    <Link onClick={onClick} href={productLink} aria-label={title}>
      <div className="relative">
        <ProgressiveImg
          className={"w-full h-[200px] sm:h-[400px] md:h-[300px] object-cover"}
          src={img}
          alt={title}
          title={title}
        />
        {discount ? (
          <div className="bg-primary absolute top-3 left-3 text-sm text-white px-3 py-1.5 ">
            {discount}% Off
          </div>
        ) : null}
      </div>
      <div className="mt-3">
        <p className="text-black text-base font-medium">{title}</p>

        <div className="flex items-center gap-2 font-castoro">
          <p className="my-1 tracking-wider text-xl">${price}</p>
          <span className="line-through text-gray-500">${originalPrice}</span>
        </div>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center w-full  mt-3 gap-2 lg:gap-0">
          {goldColorVariations?.length ? (
            <div className="flex items-center gap-2">
              {goldColorVariations?.map((x, i) => (
                <div
                  key={`gold-color-${i}-${title}`}
                  style={{ background: x?.variationTypeHexCode }}
                  className="w-11 h-[22px]"
                ></div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
