import { Helmet } from 'react-helmet-async';

import { Unauthorized } from 'src/sections/unauthorized';

// ----------------------------------------------------------------------

export default function UnauthorizedPage() {
  return (
    <>
      <Helmet>
        <title> Unauthorized | Ultimate Jewelry </title>
      </Helmet>

      <Unauthorized />
    </>
  );
}
