"use client";
import { useDispatch, useSelector } from "react-redux";
import Modal from "../Modal";
import { Button, LoadingPrimaryButton, PrimaryButton } from "../button";
import {
  setIsChecked,
  setIsHovered,
  setShowModal,
} from "@/store/slices/commonSlice";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { setStandardizedAddress } from "@/store/slices/checkoutSlice";
import { setAddressLoader } from "@/store/slices/addressSlice";

const AddressVerificationModal = ({ onClose }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const { standardizedAddress, selectedShippingAddress } = useSelector(
    ({ checkout }) => checkout
  );
  const { isHovered } = useSelector(({ common }) => common);

  const { isChecked } = useSelector(({ common }) => common);
  const { addressLoader } = useSelector(({ address }) => address);
  const enteredAddress = {
    address: selectedShippingAddress?.address,
    apartment: selectedShippingAddress?.apartment,
    city: selectedShippingAddress?.city,
    state: selectedShippingAddress?.state,
    country: selectedShippingAddress?.country,
    zipCode: selectedShippingAddress?.zipCode,
    stateCode: selectedShippingAddress?.stateCode,
  };

  const handleConfirm = useCallback(() => {
    if (!selectedShippingAddress) return;
    dispatch(setAddressLoader(true));
    const formsValue = {
      email: selectedShippingAddress?.email,
      countryName: selectedShippingAddress?.country,
      firstName: selectedShippingAddress?.firstName,
      lastName: selectedShippingAddress?.lastName,
      address: selectedShippingAddress?.address,
      city: selectedShippingAddress?.city,
      state: selectedShippingAddress?.state,
      stateCode: selectedShippingAddress?.stateCode,
      zipCode: selectedShippingAddress?.zipCode,
      phone: selectedShippingAddress?.phone,
      companyName: selectedShippingAddress?.company,
      apartment: selectedShippingAddress?.apartment,
    };
    localStorage.setItem("address", JSON.stringify(formsValue));
    dispatch(setAddressLoader(false));
    router.push("/shipping");
    localStorage.removeItem("selectedShippingMethod");
    checkoutModalClose();
  }, [selectedShippingAddress]);

  const checkoutModalClose = () => {
    dispatch(setShowModal(false));
    dispatch(setStandardizedAddress(""));
  };

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
          <Button
            onClick={checkoutModalClose}
            className="!bg-[#E5E5E5] !text-black text-lg px-6 py-2  font-medium uppercase !w-[103px] !h-12 2xl:!h-16 lg:!h-[44.5px] xl:!h-11 "
          >
            Cancel
          </Button>
          <div
            onMouseEnter={() => dispatch(setIsHovered(true))}
            onMouseLeave={() => dispatch(setIsHovered(false))}
          >
            <LoadingPrimaryButton
              loading={addressLoader}
              disabled={!isChecked || addressLoader}
              loaderType={isHovered ? "" : "white"}
              onClick={isChecked ? handleConfirm : undefined}
              className={`uppercase ${
                !isChecked || addressLoader ? "cursor-not-allowed" : ""
              }`}
            >
              Confirm
            </LoadingPrimaryButton>
          </div>
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
            onChange={(e) => dispatch(setIsChecked(e.target.checked))}
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
