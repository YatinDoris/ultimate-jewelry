import { Helmet } from 'react-helmet-async';

import { LoginView } from 'src/sections/login';

// ----------------------------------------------------------------------

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title> Login | Ultimate Jewelry </title>
      </Helmet>

      <LoginView />
    </>
  );
}
