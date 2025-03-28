import { Helmet } from 'react-helmet-async';

import { ReturnsPage } from 'src/sections/returns';

// ----------------------------------------------------------------------

export default function Returns() {
  return (
    <>
      <Helmet>
        <title> Returns | Ultimate Jewelry </title>
      </Helmet>

      <ReturnsPage />
    </>
  );
}
