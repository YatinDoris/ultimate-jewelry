import { Helmet } from 'react-helmet-async';

import { Review } from 'src/sections/review';

// ----------------------------------------------------------------------

export default function AppPage() {
  return (
    <>
      <Helmet>
        <title> Reviews | Ultimate Jewelry </title>
      </Helmet>

      <Review />
    </>
  );
}
