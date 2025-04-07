import Image from "next/image";

const Login = () => {
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Side: Background Image */}
      <div className="relative w-full md:w-1/2 h-64 md:h-screen bg-gray-200">
        <Image
          src="/hand-ring.jpg" // Replace with your image path
          alt="Hand with ring"
          layout="fill"
          objectFit="cover"
          className="rounded-b-full md:rounded-r-full md:rounded-b-none"
        />
      </div>

      {/* Right Side: Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-4 md:p-0">
        <div className="w-full max-w-md p-4 md:p-8">
          {/* Logo */}
          <h1 className="text-3xl md:text-4xl font-script text-gray-800 mb-6 md:mb-8">
            Katanoff
          </h1>

          {/* Login Text */}
          <h2 className="text-xl md:text-2xl font-semibold text-gray-700 mb-3 md:mb-4">
            Login
          </h2>
          <p className="text-sm md:text-base text-gray-500 mb-4 md:mb-6">
            Enter your email to get a login code.
          </p>

          {/* Email Input */}
          <input
            type="email"
            placeholder="Email ID"
            className="w-full p-2 md:p-3 mb-3 md:mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
          />

          {/* Login Button */}
          <button className="w-full bg-blue-900 text-white p-2 md:p-3 rounded-md hover:bg-blue-800 transition duration-300 text-sm md:text-base">
            LOG IN
          </button>

          {/* Signup Link */}
          <p className="mt-3 md:mt-4 text-sm md:text-base text-gray-500 text-center">
            Don’t have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign up
            </a>
          </p>

          {/* Privacy Policy */}
          <p className="mt-4 md:mt-6 text-xs md:text-sm text-gray-400 text-center">
            <a href="/privacy" className="hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
