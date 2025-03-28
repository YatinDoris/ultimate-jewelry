import { Helmet } from 'react-helmet-async';

import { DiamondShape } from 'src/sections/diamondShape';

// ----------------------------------------------------------------------

export default function DiamondShapePage() {
  return (
    <>
      <Helmet>
        <title> Diamond shape | Ultimate Jewelry </title>
      </Helmet>

      <DiamondShape />
    </>
  );
}
