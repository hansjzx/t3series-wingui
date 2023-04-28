import React from 'react';
import { useForm } from 'react-hook-form';
import { InputField, PopupDialog, zAxios } from '@zionex/wingui-core/src/common/imports';

function PopDemandOverviewBatchUpdate(props) {
  const { control, getValues } = useForm({
    defaultValues: {
      overwriteDataYn: []
    }
  });

  function batchUpdate() {
    let formData = new FormData();

    formData.append('overwriteDataYn', getValues('overwriteDataYn'));

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_19_BATCH',
      data: formData,
      fromPopup: true
    })
    .then(function (res) {
      if (res.data.RESULT_SUCCESS) {
        showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_MP_19_BATCH_P_RT_MSG), { close: false });
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
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={batchUpdate} title='수요 개요 일괄반영' resizeWidth={250} resizeHeight={180}>
      <InputField type='check' name='overwriteDataYn' control={control} options={[{ label: transLangKey('OVERWRITE_EXIST_DATA'), value: 'Y' }]} />
    </PopupDialog>
  )
}

export default PopDemandOverviewBatchUpdate;
