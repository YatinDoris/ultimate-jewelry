const steps = ["Delivery", "Shipping", "Payment", "Order Success"];
import breadCrumbArrow from "@/assets/icons/breadCrumbArrow.svg";
import { CustomImg } from "@/components/dynamiComponents";
const CheckoutBreadCrumbs = ({ currentStep }) => {
  return (
    <div className="flex items-stretch bg-[#F7F7F7] border border-[#E2E2E2] justify-center md:justify-start mx-auto md:mx-0 rounded overflow-hidden max-w-fit md:max-w-3xl w-full">
      {steps.map((step, index) => (
        <div key={step} className="flex items-center md:flex-1 min-w-0">
          {/* Step */}
          <div className="md:flex-1 px-2 sm:px-6 md:px-4 py-3 text-center whitespace-nowrap">
            <span
              className={`text-sm sm:text-base ${
                index === currentStep ? "font-bold text-black" : "text-gray-500"
              }`}
            >
              <span className="hidden md:inline">
                {index + 1}. {step}
              </span>
              <span className="inline md:hidden">
                {index === currentStep ? `${index + 1}. ${step}` : index + 1}
              </span>
            </span>
          </div>

          {index < steps.length - 1 && (
            <div className="h-full">
              <CustomImg srcAttr={breadCrumbArrow} altAttr="" titleAttr="" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CheckoutBreadCrumbs;
