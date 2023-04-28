import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Tab, Tabs} from '@mui/material';
import { InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import PopItemGroup from './PopItemGroup';

function ProductMixMaxNew1(props) {
  const [username] = useUserStore(state => [state.username]);
  const [itemGroupPopupOpen, setPopupItemGroup] = useState(false);

  const { handleSubmit, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      itemClassDtlId: '',
      itemLvNm: '',
      itemClassVal: '',
      descrip: '',
      itemGrp: '',
      itemGrpDescrip: ''
    }
  });

  function openPopupItemGroup() {
    setPopupItemGroup(true);
  }

  function onSetItemGroup(gridRow) {
    setValue('itemClassDtlId', gridRow.ITEM_CLASS_DTL_ID);
    setValue('itemLvNm', gridRow.ITEM_LV_NM);
    setValue('itemClassVal', gridRow.ITEM_CLASS_VAL);
    setValue('descrip', gridRow.DESCRIP);
    setValue('itemGrp', gridRow.ITEM_GRP);
    setValue('itemGrpDescrip', gridRow.ITEM_GRP_DESCRIP);
  }

  function onError(errors) {
    if (typeof errors !== 'undefined' && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  function saveData() {
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let formData = new FormData();

        formData.append('WRK_TYPE', 'SAVE');
        formData.append('ITEM_CLASS_DTL_ID', getValues('itemClassDtlId'));
        formData.append('USER_ID', username);

        zAxios({
          method: 'post',
          url: baseURI() + 'engine/mp/SRV_UI_MP_16_S1',
          data: formData,
          fromPopup: true
        })
          .then(function (res) {
            const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_16_S1_P_RT_MSG;
            showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false });

            props.confirm();
            props.onClose(false);
          })
          .catch(function (e) {
            console.error(e);

            props.confirm();
            props.onClose(false);
          });
      }
    });
  }

  return (
    <>
      <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveData, onError)} title="POP_UI_MP_16_02" resizeHeight={350} resizeWidth={500}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={"tab1"} indicatorColor="primary">
            <Tab label={transLangKey("COMM")} value="tab1" />
          </Tabs>
        </Box>

        <Box style={{ marginTop: "5px", border: "1px solid #dde1ee", width: "100%", height: "100%", padding: "6px 12px" }}>
          <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: "block" }}>
            <InputField name="itemLvNm" label={transLangKey("ITEM_LV_NM")} control={control} disabled={true} />
            <InputField name="itemClassVal" label={transLangKey("ITEM_CLASS_VAL")} control={control} disabled={true} />
            <InputField name="descrip" label={transLangKey("DESCRIP")} control={control} disabled={true} />
            <InputField type='action' name='itemGrp' label={transLangKey('ITEM_GRP')} title={transLangKey('SEARCH')} onClick={() => { openPopupItemGroup() }} control={control} readonly={true}>
              <Icon.Search />
            </InputField>
            <InputField name="itemGrpDescrip" label={transLangKey("ITEM_GRP_DESCRIP")} control={control} disabled={true} />
          </Box>
        </Box>
      </PopupDialog>
      {itemGroupPopupOpen && (<PopItemGroup open={itemGroupPopupOpen} onClose={() => { setPopupItemGroup(false); }} confirm={onSetItemGroup}></PopItemGroup>)}
    </>
  );
}

export default ProductMixMaxNew1;
