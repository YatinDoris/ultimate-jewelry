import HeroBanner from "@/components/ui/HeroBanner";
import contactus from "@/assets/images/contact-us/contact.webp";
import ContactForm from "@/components/ui/ContactForm";

export default function ContactPage() {
  return (
    <>
      <HeroBanner
        imageSrc={contactus}
        title={"Contact Us"}
        description={"We're here to help – reach out anytime!"}
        altAttr=""
        titleAttr=""
      />

      <ContactForm />
    </>
  );
}
