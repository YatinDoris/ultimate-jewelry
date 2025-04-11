import React, { useState } from "react";
import Modal from "../Modal";
import { LoadingPrimaryButton, PrimaryButton } from "../button";

const AddressVerificationModal = ({
  onClose,
  onConfirm,
  loading,
  handleConfirm,
  enteredAddress,
  standardizedAddress,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  const formatAddress = (addr) => {
    if (!addr) return "";
    const { address, apartment, city, state, zipCode } = addr;

    return [address, apartment, city, state, zipCode]
      .filter(Boolean)
      .join(", ");
  };

  const formatAddressViaResponse = (addr) => {
    if (!addr) return "";
    const { firstAddressLine, apartment, city, state, zipCode } = addr;

    return [firstAddressLine, apartment, city, state, zipCode]
      .filter(Boolean)
      .join(", ");
  };
  return (
    <Modal
      title="Address Verification"
      onClose={onClose}
      footer={
        <div className="flex gap-6">
          <PrimaryButton
            onClick={onClose}
            className="!bg-[#F2F2F2] !text-black text-lg px-6 py-2  font-medium uppercase"
          >
            Cancel
          </PrimaryButton>
          <LoadingPrimaryButton
            loading={loading}
            disabled={!isChecked || loading}
            onClick={isChecked ? handleConfirm : undefined}
            className={`uppercase ${
              !isChecked || loading ? "cursor-not-allowed" : ""
            }`}
          >
            Confirm
          </LoadingPrimaryButton>
        </div>
      }
    >
      <div className="flex flex-col gap-6">
        <div className="relative flex flex-col md:flex-row justify-center items-stretch gap-6 md:gap-8 xl:gap-12 2xl:gap-20">
          <div className="bg-white p-4 w-full md:w-[380px] flex flex-col justify-between z-10">
            <h4 className="font-semibold rtext-lg md:text-xl mb-2">
              Entered Address:
            </h4>
            <p className="text-base text-basegray flex-1 uppercase">
              {formatAddress(enteredAddress)}
            </p>
          </div>

          <div className="hidden xl:flex absolute z-50 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 items-center">
            <div className="w-2 h-2 rounded-full bg-[#DBDBDB]" />
            <div className="w-16 border-t-2 border-dotted border-[#DBDBDB] mx-1" />
            <div className="w-2 h-2 rounded-full bg-[#DBDBDB]" />
          </div>

          <div className="bg-white p-4 w-full md:w-[380px] flex flex-col justify-between z-10">
            <h4 className="font-semibold text-lg md:text-xl mb-2">
              Verified Address:
            </h4>
            <p className="text-base text-basegray flex-1 uppercase">
              {formatAddressViaResponse(standardizedAddress)}
            </p>
          </div>
        </div>
        <label className="flex items-start gap-2 text-base md:text-lg text-baseblack">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="accent-baseblack text-baseblack mt-2"
          />
          I understand that my address is verified, and I want to proceed with
          this entered address.
        </label>
      </div>
    </Modal>
  );
};

export default AddressVerificationModal;
