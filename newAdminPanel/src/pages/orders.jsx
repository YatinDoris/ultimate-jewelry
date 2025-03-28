import { Helmet } from 'react-helmet-async';

import { OrdersPage } from 'src/sections/orders';

// ----------------------------------------------------------------------

export default function Orders() {
  return (
    <>
      <Helmet>
        <title> Orders | High Definition Jewelry </title>
      </Helmet>

      <OrdersPage />
    </>
  );
}
