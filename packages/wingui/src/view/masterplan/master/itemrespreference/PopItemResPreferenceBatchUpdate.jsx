import React from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { InputField, PopupDialog, zAxios } from '@zionex/wingui-core/src/common/imports';

function PopItemResPreferenceBatchUpdate(props) {
  const { control, getValues } = useForm({
    defaultValues: {
      locationItemId: props.data ? props.data.LOCAT_ITEM_ID : '',
      resourceId: props.data ? props.data.RES_ID : '',
      resourceCode: props.data ? props.data.RES_CD : '',
      resourceDescription: props.data ? props.data.RES_DESCRIP : '',
      startDate: new Date().format('yyyy-MM-dd'),
      endDate: new Date().format('yyyy-MM-dd'),
      value: ''
    }
  });

  function batchUpdate() {
    let formData = new FormData();

    formData.append('LOCAT_ITEM_ID', getValues('locationItemId'));
    formData.append('RES_ID', getValues('resourceId'));

    if (getValues('value') !== '') {
      formData.append('VAL', getValues('value'));
    }

    formData.append('FROM_DATE', getValues('startDate') === null ? '' : new Date(getValues('startDate')).format('yyyy-MM-ddT00:00:00'));
    formData.append('TO_DATE', getValues('endDate') === null ? '' : new Date(getValues('endDate')).format('yyyy-MM-ddT00:00:00'));

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_08_POP_S2',
      data: formData,
      fromPopup: true
    })
    .then(function (res) {
      if (res.data.RESULT_SUCCESS) {
        showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_MP_08_POP_S2_P_RT_MSG), { close: false });
        props.confirm();
      } else {
        showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
      }

      props.onClose();
    })
    .catch(function (err) {
      console.error(err);
    });
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={batchUpdate} title='POP_UI_MP_08_02' resizeWidth={460} resizeHeight={650}>
      <Box>
        <Box>
          <InputField name="resourceCode" label={transLangKey("RES_CD")} control={control} readonly={true} />
          <InputField name="resourceDescription" label={transLangKey("RES_DESCRIP")} control={control} readonly={true} />
        </Box>
        <Box>
          <InputField type="datetime" name="startDate" label={transLangKey("STRT_DATE")} control={control} dateformat="yyyy-MM-dd" />
          <InputField type="datetime" name="endDate" label={transLangKey("END_DATE")} control={control} dateformat="yyyy-MM-dd" />
        </Box>
        <Box>
          <InputField dataType="number" name="value" label={transLangKey("OVERALL_APPY_VAL")} control={control} />
        </Box>
      </Box>
    </PopupDialog>
  )
}

export default PopItemResPreferenceBatchUpdate;
