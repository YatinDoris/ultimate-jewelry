import { ReturnRequestPage } from "@/components/dynamiComponents";
import CommonBgHeading from "@/components/ui/CommonBgHeading";

const ReturnRequest = () => {
  return (
    <div className="pt-16 xl:pt-12">
      <CommonBgHeading
        title="Return Request"
        rightText={"(0 Selected Products)"}
        // backText="Back To Home"
      />
      <ReturnRequestPage />;
    </div>
  );
};
export default ReturnRequest;
