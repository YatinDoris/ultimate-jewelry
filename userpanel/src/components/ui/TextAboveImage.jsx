import { LinkButton } from "../ui/button";
import { CustomImg } from "../dynamiComponents";

const TextAboveImage = ({ categoryData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {categoryData.map((item, index) => (
        <div
          key={index}
          className={`group relative overflow-hidden ${item.categoryClassname}`}
        >
          <CustomImg
            srcAttr={item.image}
            altAttr={item.altAttr}
            titleAttr={item.titleAttr}
            fill
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute bottom-[10%] left-1/2 -translate-x-[40%] gap-6 text-center text-white z-10 flex flex-col items-center justify-center">
            <h3 className="text-lg md:text-2xl  2xl:text-3xl tracking-wider font-castoro">
              {item.title}
            </h3>
            <div>
              <LinkButton
                href=""
                className=" lg:!h-[2.3rem] w-fit !py-6 !bg-transparent font-semibold hover:!bg-white hover:!border-white hover:!text-black !rounded-none"
              >
                {item.btnText}
              </LinkButton>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TextAboveImage;
