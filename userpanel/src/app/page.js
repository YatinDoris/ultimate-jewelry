"use client"
import { useEffect } from "react";
import { getAllMenuData } from "@/_services";

export default function Home() {

  useEffect(() => {


    getAllMenuData()


  }, [])

  return (
    <>
      <h2 className="font-castoro">Home</h2>
    </>
  );
}
