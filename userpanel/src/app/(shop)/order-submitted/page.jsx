import { OrderSubmittedPage } from "@/components/dynamiComponents";
import CheckoutBreadCrumbs from "@/components/ui/checkout/CheckoutBreadCrumbs";

const OrderSubmitted = () => {
  return (
    <div className="pt-28 lg:pt-12 2xl:pt-16">
      <div className="px-4 md:container ">
        <CheckoutBreadCrumbs currentStep={3} />
      </div>

      <OrderSubmittedPage />
    </div>
  );
};

export default OrderSubmitted;
