import React from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { InputField, zAxios, useUserStore, PopupDialog } from '@zionex/wingui-core/src/common/imports';

function PopDemandVariabilityBundleCreate(props) {
  const [username] = useUserStore(state => [state.username]);
  const { handleSubmit, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      APPLY_POINT_CD: "NEW",
      OVERWRITE_DATA_YN: [""]
    }
  });

  const options1 = [
    { label: transLangKey('ALL_APPLY'), value: 'ALL' },
    { label: transLangKey('NEW_APPLY'), value: 'NEW' }
  ];

  function onError(errors, e) {
    if (typeof errors !== 'undefined' && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  function saveSubmit() {
    let param = new URLSearchParams();

    param.append('APPLY_POINT_CD', getValues('APPLY_POINT_CD'));
    param.append('OVERWRITE_DATA_YN', getValues('OVERWRITE_DATA_YN').join('')  === 'Y' ? true : false);
    param.append('USER_ID', username);
    param.append('timeout', 0);
    param.append('CURRENT_OPERATION_CALL_ID', 'OPC_POP_UI_IM_08_03_WINDOW_01_CPT_99_01_CLICK_01');

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_IM_09_BATCH',
      params: param,
      fromPopup: true
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        if (res.data.RESULT_SUCCESS) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_IM_09_BATCH_P_RT_MSG), { close: false });
        } else {
          showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
        }

        props.confirm();
        props.onClose(false);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  return (
    <>
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title='POP_UI_IM_09_03' resizeHeight={230} resizeWidth={400}>
      <Box style={{height:'100%'}}>
        <InputField type='radio' name='APPLY_POINT_CD' control={control} setValue={setValue} options={options1}/>
        <InputField type='check' name='OVERWRITE_DATA_YN' control={control} wrapStyle={{width: '360px'}} labelStyle={{width: '220px', maxWidth: '220px'}} options={[{ label: transLangKey('OVERWRITE_EXIST_DATA'), value: 'Y' }]}/>
      </Box>
    </PopupDialog>
    </>
  );
}

export default PopDemandVariabilityBundleCreate;
