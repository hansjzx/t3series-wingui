import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';
import PopCommItemClass from '@wingui/view/supplychainmodel/common/PopCommItemClass';

function PopCycleConsecutiveBundleCreate(props) {
  const [username] = useUserStore(state => [state.username]);
  const [itemClassPopupOpen, setItemClassPopupOpen] = useState(false);

  const { handleSubmit, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      itemLevel: '',
      itemClassValue: '',
      itemClassDescription: '',
      itemClassMstId: '',
      OVERRIDE_YN: ['']
    }
  });

  function onError(errors, e) {
    if (typeof errors !== 'undefined' && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  function onSetItemClass(gridRow) {
    setValue("itemClassMstId", gridRow.ID)
    setValue("itemLevel", gridRow.ITEM_LV_NM);
    setValue("itemClassValue", gridRow.ITEM_CLASS_VAL);
    setValue("itemClassDescription", gridRow.DESCRIP);
  }

  function saveSubmit() {
    let formData = new FormData();

    formData.append('ITEM_CLASS_MST_ID', getValues('itemClassMstId'));
    formData.append('OVERWRITE_DATA_YN', getValues('OVERWRITE_DATA_YN').join('')  === 'Y' ? 'true' : 'false');
    formData.append('USER_ID', username);
    formData.append('timeout', 0);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_IM_09_BATCH',
      data: formData,
      fromPopup: true
    })
      .then(function (res) {
        const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_IM_09_BATCH_P_RT_MSG;
        showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false });
      })
      .catch(function (e) {
        console.error(e);
      });
    
    props.confirm();
    props.onClose(false);
  }

  return (
    <>
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title='POP_UI_CM_03_07' resizeHeight={230} resizeWidth={470}>
      <Box style={{height:'100%'}}>
        <InputField type='action' name='itemLevel' label={transLangKey('ITEM_LV')} control={control} onClick={() => {setItemClassPopupOpen(true)}} >
          <Icon.Search/>
        </InputField>
        <InputField name="itemClassValue" label={transLangKey("ITEM_CLASS_VAL")} control={control}/>
        <InputField name="itemClassDescription" label={transLangKey("DESCRIP")} control={control}/>
        <InputField type='check' name='OVERWRITE_DATA_YN' control={control} wrapStyle={{width: '360px'}} labelStyle={{width: '200px', maxWidth: '200px'}} options={[{ label: transLangKey('OVERWRITE_EXIST_DATA'), value: 'Y' }]} />
      </Box>
    </PopupDialog>
    {itemClassPopupOpen && <PopCommItemClass id={'POP_UI_CM_03_07'} open={itemClassPopupOpen} onClose={() => setItemClassPopupOpen(false)} confirm={onSetItemClass} ></PopCommItemClass>}
    </>
  );
}

export default PopCycleConsecutiveBundleCreate;
