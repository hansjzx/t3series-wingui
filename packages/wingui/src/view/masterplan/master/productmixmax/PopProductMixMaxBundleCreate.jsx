import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box, Tab, Tabs } from '@mui/material';
import { InputField, PopupDialog, useUserStore } from '@zionex/wingui-core/src/common/imports';
import { getCodeList } from "@wingui/view/supplychainmodel/common/common";

import PopItemLv from './PopItemLv';

const oneRowStyle = { marginRight: "50px" };

function PopProductMixMaxBundleCreate(props) {
  const [username] = useUserStore(state => [state.username]);
  const [itemLvPopupOpen, setPopupItemLv] = useState(false);

  const [cyclTpOptions, setCyclTpOptions] = useState({});
  const [maxAllocConstOptions, setMaxAllocConstOptions] = useState({});
  const [catagyTpOptions, setCatagyTpOptions] = useState({});

  const { handleSubmit, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      itemClassMstId: '',
      itemLvNm:'',
      itemClassVal: '',
      descrip:'',
      startDate: new Date().format('yyyy-MM-dd'),
      endDate: new Date().format('yyyy-MM-dd'),
      cyclTpId: '',
      maxAllocConstId: '',
      maxPrductLimit: '',
      interval: '',
      catagyTpId: ''
    }
  });

  useEffect(() => {
    if(props.open) {
      setCombobox();
    }
  }, [props]);

  async function setCombobox() {
    let dataArr = await getCodeList('CALENDAR_CYCL_TP, MAX_ALLOCATION_CONST_TYPE, MAX_ALLOCATION_TARGET');
    let cyclTpList = dataArr.filter(code => code.GROUP == 'CALENDAR_CYCL_TP').map(data => ({ value: data.ID, label: data.CD_NM }));
    let maxAllocConstList = dataArr.filter(code => code.GROUP == 'MAX_ALLOCATION_CONST_TYPE').map(data => ({ value: data.ID, label: data.CD_NM }));
    let maxAllocTargetList = dataArr.filter(code => code.GROUP == 'MAX_ALLOCATION_TARGET').map(data => ({ value: data.ID, label: data.CD_NM }));

    setCyclTpOptions(cyclTpList);
    setValue('cyclTpId', cyclTpList[0].value);
    setMaxAllocConstOptions(maxAllocConstList);
    setValue('maxAllocConstId', maxAllocConstList[0].value);
    setCatagyTpOptions(maxAllocTargetList);
    setValue('catagyTpId', maxAllocTargetList[1].value);
  }

  function openPopupItemLv() {
    setPopupItemLv(true);
  }

  function onSetItemLv(gridRow) {
    setValue('itemClassMstId', gridRow.ID);
    setValue('itemLvNm', gridRow.ITEM_LV_NM);
    setValue('itemClassVal', gridRow.ITEM_CLASS_VAL);
    setValue('descrip', gridRow.DESCRIP);
  }

  function onError(errors) {
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  function saveSubmit() {
    let formData = new FormData();

    formData.append('ITEM_CLASS_MST_ID', getValues('itemClassMstId'));
    formData.append('CATAGY_TP_ID', getValues('catagyTpId'));
    formData.append('START_DATE', getValues('startDate'));
    formData.append('END_DATE', getValues('endDate'));
    formData.append('CYCLE_TP_ID', getValues('cyclTpId'));
    formData.append('MAX_ALLOC_CONST_ID', getValues('maxAllocConstId'));
    formData.append('MAX_PRDUCT_LIMIT', getValues('maxPrductLimit'));
    formData.append('INTERVAL', getValues('interval'));
    formData.append('USER_ID', username);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SP_UI_MP_16_BATCH',
      data: formData,
      fromPopup: true
    })
      .then(function (res) {
        const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_16_BATCH_P_RT_MSG;
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
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="POP_UI_MP_06_10" resizeHeight={520} resizeWidth={500}>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={"tab1"} indicatorColor="primary">
          <Tab label={transLangKey('COMM')} value="tab1" />
        </Tabs>
      </Box>

      <Box style={{ marginTop: "5px", border: "1px solid #dde1ee", width: "100%", height: "100%", padding: "6px 12px" }}>
        <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: "block" }}>
          <Box style={{height:"100%"}}>
            <InputField type="action" name="itemLvNm" label={transLangKey("ITEM_LV")} control={control} onClick={() => { openPopupItemLv() }} readonly={true} >
              <Icon.Search />
            </InputField>
            <InputField name="itemClassVal" label={transLangKey("ITEM_CLASS_VAL")} control={control} disabled={true} />
            <InputField name="descrip" label={transLangKey("DESCRIP")} control={control} disabled={true} style={oneRowStyle} />
            <InputField name='startDate' type='datetime' label={transLangKey('STRT_DATE')} dateformat="yyyy-MM-dd" control={control} />
            <InputField name='endDate' type='datetime' label={transLangKey('END_DATE')} dateformat="yyyy-MM-dd" control={control} />
            <InputField name='cyclTpId' type='select' label={transLangKey('CYCL_TP')} options={cyclTpOptions} control={control} />
            <InputField name='maxAllocConstId' type='select' label={transLangKey('CONST_TP')} options={maxAllocConstOptions} control={control} />
            <InputField name="maxPrductLimit" label={transLangKey("MAX_PRDUCT_LIMIT")} control={control} />
            <InputField name="interval" label={transLangKey("INTERVAL")} control={control} />
            <InputField name='catagyTpId' type='select' label={transLangKey('APPY_TARGET')} options={catagyTpOptions} control={control} disabled={true} />
          </Box>
        </Box>
      </Box>  
    </PopupDialog>
      {itemLvPopupOpen && (<PopItemLv open={itemLvPopupOpen} onClose={() => { setPopupItemLv(false); }} confirm={onSetItemLv}></PopItemLv>)}
    </>
  );
}

export default PopProductMixMaxBundleCreate;
