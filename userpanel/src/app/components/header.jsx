import Link from "next/link";

export default function Header() {
  return (
    <div>
      <div className="bg-primary text-center">
        <p>
          Free 1ct Diamond Pendant with Purchase of $3,000 or More.{" "}
          <Link href={"#"}></Link>{" "}
        </p>
      </div>
    </div>
  );
}
