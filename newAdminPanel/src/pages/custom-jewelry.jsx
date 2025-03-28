import { Helmet } from 'react-helmet-async';

import { CustomJewelry } from 'src/sections/custom-jewelry';

// ----------------------------------------------------------------------

export default function AppointmentsPage() {
  return (
    <>
      <Helmet>
        <title> Custom Jewelry | Ultimate Jewelry </title>
      </Helmet>

      <CustomJewelry />
    </>
  );
}
