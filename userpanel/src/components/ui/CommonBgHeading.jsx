import Link from "next/link";

const CommonBgHeading = ({ title, backText, backHref = "/" }) => {
  return (
    <div className="w-full bg-alabaster py-6">
      <div className=" mx-auto px-4 flex items-center justify-center relative container">
        {backText && (
          <Link
            href={backHref}
            className="text-basegray text-base hover:underline absolute left-0 hidden xs:block"
          >
            &lt; {backText}
          </Link>
        )}

        <h1 className="text-2xl xl:text-3xl font-medium font-castoro text-baseblack">
          {title}
        </h1>
      </div>
    </div>
  );
};
export default CommonBgHeading;
