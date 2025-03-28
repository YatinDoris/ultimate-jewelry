import { Helmet } from 'react-helmet-async';

import { ShowCaseBanner } from 'src/sections/showcase-banner';

// ----------------------------------------------------------------------

export default function SliderViewAddPage() {
  return (
    <>
      <Helmet>
        <title> ShowCase Banner | Ultimate Jewelry </title>
      </Helmet>

      <ShowCaseBanner />
    </>
  );
}
