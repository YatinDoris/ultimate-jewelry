import Link from "next/link";
import { CustomImg, LoginForm } from "@/components/dynamiComponents";
import handWithRing from "@/assets/images/auth/hand-ring.webp";
import logo from "@/assets/images/logo-2.webp";

const Login = () => {
  return (
    <div className="flex lg:flex-row h-screen">
      {/* Left Side */}
      <div className="lg:block hidden w-full lg:w-3/5 h-screen">
        <CustomImg
          srcAttr={handWithRing}
          className="w-full h-full object-cover"
          priority
        />
      </div>

      {/* Right Side */}
      <div className="w-full h-full lg:w-1/2 flex items-center lg:justify-between px-4 py-12 md:px-32 md:py-52 lg:p-[75px_100px_75px_22px]">
        <div className="flex flex-col justify-center gap-10  md:gap-24 lg:justify-between w-full lg:h-full">
          <Link href={"/"} className="flex justify-center">
            <CustomImg srcAttr={logo} className="w-40 md:w-52" />
          </Link>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;
