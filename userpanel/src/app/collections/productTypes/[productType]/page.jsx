"use client";
import { useParams } from "next/navigation";

export default function Page() {
  const { productType } = useParams();

  return (
    <p className="h-screen flex justify-center items-center"> {productType}</p>
  );
}
