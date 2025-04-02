"use client";
import { fetchCollectionsTypeWiseProduct } from "@/_actions/product.actions";
import { helperFunctions } from "@/_helper";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
export default function CollectionPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const { collectionTypeProductList } = useSelector(({ product }) => product);
  let { collectionType, collectionTitle } = params;

  collectionTitle = helperFunctions.stringReplacedWithSpace(collectionTitle);

  useEffect(() => {
    dispatch(fetchCollectionsTypeWiseProduct(collectionType, collectionTitle));
  }, []);
  console.log("collectionTypeProductList", collectionTypeProductList);
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1>Collection Type: {collectionType}</h1>
      <h2>Value: {collectionTitle}</h2>
    </div>
  );
}
