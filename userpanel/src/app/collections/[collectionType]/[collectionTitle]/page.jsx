"use client";
import { fetchCollectionsTypeWiseProduct } from "@/_actions/product.actions";
import { helperFunctions } from "@/_helper";
import { ProductGrid } from "@/components/dynamiComponents";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
export default function CollectionPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const { collectionTypeProductList, productLoading } = useSelector(
    ({ product }) => product
  );
  let { collectionType, collectionTitle } = params;

  collectionTitle = helperFunctions.stringReplacedWithSpace(collectionTitle);

  useEffect(() => {
    dispatch(fetchCollectionsTypeWiseProduct(collectionType, collectionTitle));
  }, []);
  return (
    <section className="pt-10 lg:pt-20 2xl:pt-40 container">
      <ProductGrid
        productList={collectionTypeProductList}
        pagination={true}
        isLoading={productLoading}
        noDataFoundMsg="Stay tuned! The products you're looking for will be available soon. We appreciate your patience."
      />
    </section>
  );
}
