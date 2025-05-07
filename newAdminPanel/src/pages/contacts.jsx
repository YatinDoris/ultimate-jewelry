import { Helmet } from 'react-helmet-async';

import { Contacts } from 'src/sections/contacts';

// ----------------------------------------------------------------------

export default function ContactsPage() {
  return (
    <>
      <Helmet>
        <title> Collection | Katan Off </title>
      </Helmet>

      <Contacts />
    </>
  );
}
