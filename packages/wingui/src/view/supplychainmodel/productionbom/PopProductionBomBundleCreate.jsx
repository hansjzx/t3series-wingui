import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box, Tab, Tabs } from '@mui/material';
import { InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import PopLocatTp from "@wingui/view/common/PopLocatTp";
import PopCommItem from "../common/PopCommItem";

const oneRowStyle = { width: '400px' };

function PopProductionBomBundleCreate(props) {
  const [username] = useUserStore(state => [state.username]);
  const { handleSubmit, watch, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      applyPoint: "PARTIAL",
      checkLocat: ["Y"],
      locatMgmtId: "",
      locatTpNm: "",
      locatLv: "",
      locatCd: "",
      locatNm: "",
      checkItem: [""],
      itemMstId: "",
      itemNm: "",
      transpLotsize: "",
      uomQty: "",
      packingQty: "",
      packingTp: "",
      palletQty: "",
      palletTp: "",
      overwriteDataYn: [""]
    }
  });
  
  const radioOptions = [
    {
      label: transLangKey('ALL_APPLY'),
      value: "ALL",
    },
    {
      label: transLangKey('PARTIAL_APPLY'),
      value: "PARTIAL",
    },
  ];

  const [tabValue] = React.useState('tab1');
  const [locatTpPopupOpen, setPopupLocatTp] = useState(false);
  const [itemPopupOpen, setPopupItem] = useState(false);
  const [locatDisabled, setLocatDisabled] = useState(true);
  const [itemDisabled, setItemDisabled] = useState(true);
  
  const watchApplyPoint = watch('applyPoint');

  useEffect(() => {
    if(watchApplyPoint === "ALL") {
      setValue("checkLocat", ['']);
      setValue("locatTpNm", "");
      setValue("locatLv", "");
      setValue("locatCd", "");
      setValue("locatNm", "");
      setValue("checkItem", ['']);
      setValue("itemMstId", "");
      setValue("itemNm", "");
      setLocatDisabled(false);
      setItemDisabled(false);
    }else{
      setValue('checkLocat', ['Y']);
    }
  }, [watchApplyPoint]);

  useEffect(() => {
    if(getValues("checkLocat")[0] === "Y") {
      setValue("checkItem", []);
      setValue("itemMstId", "");
      setValue("itemNm", "");
      setLocatDisabled(false);
    }else{
      setLocatDisabled(true);
    }
  }, [watch('checkLocat')]);
  
  useEffect(() => {
    if(getValues("checkItem")[0] === "Y") {
      setValue("checkLocat", []);
      setValue("locatTpNm", "");
      setValue("locatLv", "");
      setValue("locatCd", "");
      setValue("locatNm", "");
      setItemDisabled(false);
    }else{
      setItemDisabled(true);
    }
  }, [watch('checkItem')]);

  function openPopupLocatTp() {
    setPopupLocatTp(true);
  }

  function onSetLocatTp(gridRow) {
    setValue('locatMgmtId', gridRow.LOCAT_MGMT_ID);
    setValue('locatTpNm', gridRow.LOCAT_TP_NM);
    setValue('locatLv', gridRow.LOCAT_LV);
    setValue('locatCd', gridRow.LOCAT_CD);
    setValue('locatNm', gridRow.LOCAT_NM);
  }

  function openPopupItem() {
    setPopupItem(true);
  }

  function onSetItemCd(gridRows) {
    let itemMstIdArr = [];
    let itemCdArr = [];
    let itemNmArr = [];
    gridRows.forEach(function (row) {
      itemMstIdArr.push(row.ITEM_MST_ID);
      itemCdArr.push(row.ITEM_CD);
      itemNmArr.push(row.ITEM_NM);
    });
    setValue('itemMstId', itemMstIdArr.join("|"));
    setValue('itemCd', itemCdArr.join("|"));
    setValue('itemNm', itemNmArr.join("|"));
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
    formData.append('APPLY_POINT', getValues('applyPoint'));
    formData.append('CHECK_LOCAT', getValues('checkLocat').join("")  === 'Y' ? true : false);
    formData.append('LOCAT_MGMT_ID', getValues('locatMgmtId'));
    formData.append('CHECK_ITEM', getValues('checkItem').join("")  === 'Y' ? true : false);
    formData.append('ITEM_MST_ID', getValues('itemMstId'));
    formData.append('OVERWRITE_DATA_YN', getValues('overwriteDataYn').join("")  === 'Y' ? 'true' : 'false');
    formData.append('USER_ID', username);
    formData.append('timeout', 0);
    formData.append('CURRENT_OPERATION_CALL_ID', 'OPC_POP_UI_CM_05_09_WINDOW_01_CPT_99_01_CLICK_01');

    zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_05_BATCH", formData)
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        const rsData = res.data;
        if (rsData.RESULT_SUCCESS) {
          const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_05_BATCH_P_RT_MSG;
          if (msg === "MSG_0003") {
            props.confirm();
            props.onClose(false);
          } else {
            showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg));
          }
        } else {
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
        }
      }
    })
    .catch(function (e) {
      console.error(e);
    });
  }

  return (
    <>
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="POP_UI_CM_10_02" resizeHeight={600} resizeWidth={500}>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} indicatorColor="primary">
              <Tab label={transLangKey('CONSUME_LOCAT_ITEM_INFO')} value="tab1" />
          </Tabs>
      </Box>

      <Box style={{ marginTop: "5px", border: "1px solid #dde1ee", width: "100%", height: "100%", padding: "6px 12px" }}>
        {/* tab1 */}
        <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: "block" }}>
          <Box style={{height:"100%"}}>
            <InputField type="radio" name="applyPoint" control={control} setValue={setValue} options={radioOptions} style={oneRowStyle} />
            <InputField type="check" name="checkLocat" control={control} options={[{ label: transLangKey("LOCAT_REGISTRY"), value: "Y" }]}
                        disabled={ (getValues("applyPoint") !== 'PARTIAL') } style={oneRowStyle} />
            <InputField name='locatMgmtId' control={control} style={{display: 'none'}} />
            <InputField type="action" name="locatTpNm" label={transLangKey("LOCAT_TP_NM")} onClick={() => { openPopupLocatTp() }} readonly={true} disabled={locatDisabled} control={control}>
              <Icon.Search />
            </InputField>
            <InputField name="locatLv" label={transLangKey("LOCAT_LV")} control={control} disabled={true}/>
            <InputField name="locatCd" label={transLangKey("LOCAT_CD")} control={control} disabled={true}/>
            <InputField name="locatNm" label={transLangKey("LOCAT_NM")} control={control} disabled={true}/>

            <InputField type="check" name="checkItem" control={control} options={[{ label: transLangKey("ITEM_REGISTRY"), value: "Y" }]}
                        disabled={ (getValues("applyPoint") !== 'PARTIAL') } style={oneRowStyle} />
            <InputField name='itemMstId' control={control} style={{display: 'none'}} />
            <InputField type="action" name="itemCd" label={transLangKey("ITEM_CD")} onClick={() => { openPopupItem() }} readonly={true} disabled={itemDisabled} control={control}>
              <Icon.Search />
            </InputField>
            <InputField name="itemNm" label={transLangKey("ITEM_NM")} control={control} disabled={true} />

            <hr />

            <InputField
              type='check' name='overwriteDataYn' label='' control={control}
              options={[{ label: transLangKey('OVERWRITE_EXIST_DATA'), value: 'Y' }]} />
          </Box>
        </Box>
      </Box>  
    </PopupDialog>

    {locatTpPopupOpen && (<PopLocatTp open={locatTpPopupOpen} onClose={() => { setPopupLocatTp(false); }} confirm={onSetLocatTp}></PopLocatTp>)}
    {itemPopupOpen && (<PopCommItem open={itemPopupOpen} onClose={() => { setPopupItem(false); }} confirm={onSetItemCd}></PopCommItem>)}
    </>
  );
}
export default PopProductionBomBundleCreate;
