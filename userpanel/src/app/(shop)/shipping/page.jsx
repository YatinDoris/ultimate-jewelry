import {
  CheckoutCommonComponent,
  ShippingForm,
} from "@/components/dynamiComponents";
import CommonBgHeading from "@/components/ui/CommonBgHeading";
const shipping = () => {
  return (
    <div className="mx-auto pt-10 lg:pt-10 2xl:pt-12">
      <CommonBgHeading
        title="Secure Checkout"
        backText="Back to Back"
        backHref="/cart"
      />
      <div className="grid grid-cols-1 lg:grid-cols-[55%_auto] lg:gap-6 container mx-auto h-full">
        <ShippingForm />
        <CheckoutCommonComponent />
      </div>
    </div>
  );
};

export default shipping;
