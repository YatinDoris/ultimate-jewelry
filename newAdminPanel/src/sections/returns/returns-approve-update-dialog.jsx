import * as Yup from 'yup';
import { useFormik } from 'formik';
import { memo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  StyledDialogTitle,
  StyledDialogActions,
  StyledDialogContent,
} from 'src/components/dialog/styles';
import Dialog from 'src/components/dialog';
import { FileDrop } from 'src/components/file-drop';
import { approveReturn } from 'src/actions/returnActions';
import { Button, LoadingButton } from 'src/components/button';
import { setSelectedApproveReturn, initApproveReturn } from 'src/store/slices/returnSlice';
// ----------------------------------------------------------------------

const validationSchema = Yup.object().shape({
  previewImage: Yup.array()
    .max(1, 'Max limit is 1!')
    .min(1, 'Minimun 1 item is required!')
    .required('Minimun 1 item is required!')
    .of(
      Yup.object().shape({
        type: Yup.string().required(),
        mimeType: Yup.string().required(),
        image: Yup.string().required('At least one image or pdf is required'),
      })
    ),
});

// ----------------------------------------------------------------------

const ApproveOrUpdateReturnDialog = ({
  setOpen,
  loadData,
  openReturnDialog,
  selectedReturnId,
  setOpenReturnDialog,
}) => {
  const dispatch = useDispatch();

  const { returnList, crudReturnLoading, selectedApproveReturn } = useSelector(
    ({ returns }) => returns
  );

  const item = returnList?.find((x) => x?.id === selectedReturnId);

  const handleApproveOrUpdate = useCallback(
    async (val, { resetForm }) => {
      const payload = {
        returnId: selectedReturnId,
        imageFile: val?.imageFile?.[0],
      };

      let res = await dispatch(approveReturn(payload));
      if (res) {
        loadData();
        setOpenReturnDialog(false);
        resetForm();
        if (setOpen) setOpen(null);
      }
    },
    [selectedReturnId]
  );

  const approveFormik = useFormik({
    validationSchema,
    enableReinitialize: true,
    onSubmit: handleApproveOrUpdate,
    initialValues: selectedApproveReturn,
  });

  const closeReturnPopup = useCallback(() => {
    setOpenReturnDialog(false);
    dispatch(setSelectedApproveReturn(initApproveReturn));
    approveFormik.resetForm();
  }, []);

  return (
    <>
      <Dialog
        open={openReturnDialog}
        handleClose={closeReturnPopup}
        handleOpen={() => setOpenReturnDialog(true)}
      >
        <StyledDialogTitle>
          {item?.shippingLabel ? 'Update Shipping Label' : 'Approve Return Request'}
        </StyledDialogTitle>
        <StyledDialogContent>
          <FileDrop
            mediaLimit={1}
            fileKey={'imageFile'}
            formik={approveFormik}
            mediaType={'pdf&image'}
            previewKey={'previewImage'}
            loading={crudReturnLoading}
          />
        </StyledDialogContent>
        <StyledDialogActions>
          <Button onClick={closeReturnPopup} disabled={crudReturnLoading} variant="outlined">
            Cancel
          </Button>
          <LoadingButton
            variant="contained"
            loading={crudReturnLoading}
            onClick={approveFormik.handleSubmit}
          >
            {item?.shippingLabel ? 'Update' : 'Approve'}
          </LoadingButton>
        </StyledDialogActions>
      </Dialog>
    </>
  );
};

export default memo(ApproveOrUpdateReturnDialog);
