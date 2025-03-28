import { Helmet } from 'react-helmet-async';

import { AddProduct } from 'src/sections/products/add';

// ----------------------------------------------------------------------

export default function AddProductPage() {
  return (
    <>
      <Helmet>
        <title> Products | Ultimate Jewelry </title>
      </Helmet>

      <AddProduct />
    </>
  );
}
