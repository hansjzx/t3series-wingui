import React from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

function PopInventoryPolicyBundleCreate(props) {
  const [username] = useUserStore(state => [state.username]);
  const { handleSubmit, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      applyPointCd: 'NEW',
    },
  });

  const options1 = [
    { label: transLangKey('ALL_APPLY'), value: 'ALL' },
    { label: transLangKey('NEW_APPLY'), value: 'NEW' }
  ];

  function onError(errors, e) {
    if (typeof errors !== 'undefined' && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(
          transLangKey('WARNING'),
          `[${value.ref.name}] ${value.message}`
        );
        clearErrors();
        return false;
      });
    }
  }

  function saveSubmit() {
    let param = new FormData();

    param.append('APPLY_POINT_CD', getValues('applyPointCd'));
    param.append('APPLY_TARGET', props.tab === 'gridSabc' ? 'GRADE' : 'LOCAT_SEGMT');
    param.append('USER_ID', username);
    param.append('timeout', 0);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_IM_25_BATCH',
      data: param,
      fromPopup: true
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_IM_25_BATCH_P_RT_MSG), { close: false });

        props.confirm(props.tab);
        props.onClose(false);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  return (
    <>
      <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title='POP_UI_IM_25_01' resizeHeight={170} resizeWidth={370}>
        <Box style={{ height: '100%' }}>
          <InputField type='radio' name='applyPointCd' control={control} setValue={setValue} options={options1}/>
        </Box>
      </PopupDialog>
    </>
  );
}

export default PopInventoryPolicyBundleCreate;
