import { Helmet } from 'react-helmet-async';

import { SubscribersPage } from 'src/sections/subscribers';

// ----------------------------------------------------------------------

export default function Subscribers() {
  return (
    <>
      <Helmet>
        <title> Subscribers | Ultimate Jewelry </title>
      </Helmet>

      <SubscribersPage />
    </>
  );
}
