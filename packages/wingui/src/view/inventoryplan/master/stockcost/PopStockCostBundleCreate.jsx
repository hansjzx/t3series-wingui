import React from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

function PopStockCostBundleCreate(props) {
  const [username] = useUserStore(state => [state.username]);
  const { handleSubmit, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      APPLY_POINT_CD: 'NEW',
      OVERWRITE_DATA_YN: ['']
    }
  });

  const options1 = [
    {
      label: transLangKey('ALL_APPLY'),
      value: 'ALL',
    },
    {
      label: transLangKey('NEW_APPLY'),
      value: 'NEW',
    },
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
    let formData = new FormData();

    formData.append('APPLY_POINT_CD', getValues('APPLY_POINT_CD'));
    formData.append('OVERWRITE_DATA_YN', getValues('OVERWRITE_DATA_YN').join('')  === 'Y' ? 'true' : 'false');
    formData.append('USER_ID', username);
    formData.append('timeout', 0);
    formData.append('CURRENT_OPERATION_CALL_ID', 'OPC_POP_UI_IM_09_03_WINDOW_01_CPT_99_01_CLICK_01');

    zAxios.post(baseURI() + 'engine/mp/SRV_UI_IM_09_BATCH',
    formData,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(function () { })
      .catch(function (e) {
        console.error(e);
      });

    props.confirm();
    props.onClose(false);
  }

  return (
    <>
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title='POP_UI_IM_05_02' resizeHeight={250} resizeWidth={370}>
      <Box style={{height:'100%'}}>
        <InputField type='radio' name='APPLY_POINT_CD' control={control} setValue={setValue} options={options1}/>
        <InputField type='check' name='OVERWRITE_DATA_YN' control={control} wrapStyle={{width: '360px'}} labelStyle={{width: '200px', maxWidth: '200px'}} options={[{ label: transLangKey('OVERWRITE_EXIST_DATA'), value: 'Y' }]} />
      </Box>
    </PopupDialog>
    </>
  );
}

export default PopStockCostBundleCreate;
