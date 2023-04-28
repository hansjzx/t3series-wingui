import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Tab, Tabs} from '@mui/material';
import { InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import PopPopParentComponentItem from './PopPopParentComponentItem';

const oneRowStyle = {marginRight: "100px"};

function PopProductionBomNew1(props) {
  const [username] = useUserStore(state => [state.username]);
  const { handleSubmit, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      locatMgmtId: "",
      locatTp: "",
      locatLv: "",
      locatCd: "",
      locatNm: "",
      bomLv: "",
      siteItemId: "",
      itemCd: "",
      itemNm: "",
      itemTp: "",
      baseQty: "",
      baseYield: "",
      delYn: ["N"],
      actvYn: ["Y"]
    }
  });

  const [itemPopupOpen, setPopupItem] = useState(false);

  function openPopupItem() {
    setPopupItem(true);
  }

  function onSetItemCd(gridRow) {
    // setValue("locatMgmtId", gridRow.LOCAT_MGMT_ID);
    setValue("locatTp", gridRow.LOC_TP);
    setValue("locatLv", gridRow.LOCAT_LV);
    setValue("locatCd", gridRow.LOCAT_CD);
    setValue("locatNm", gridRow.LOCAT_NM);
    setValue("siteItemId", gridRow.ID);
    setValue("itemCd", gridRow.ITEM_CD);
    setValue("itemNm", gridRow.ITEM_NM);
    setValue("itemTp", gridRow.ITEM_TP);
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

  function saveData() {
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let formData = new FormData();
        formData.append('SITE_ITEM_ID', getValues('siteItemId'));
        formData.append('BOM_LV', getValues('bomLv'));
        formData.append('BASE_QTY', getValues('baseQty'));
        formData.append('BASE_YIELD', getValues('baseYield'));
        formData.append('ACTV_YN', getValues('actvYn'));
        formData.append('USER_ID', username);
        formData.append('timeout', 0);
        formData.append('CURRENT_OPERATION_CALL_ID', 'OPC_POP_UI_CM_05_01_WINDOW_01_CPT_30_01_CLICK_01');

        zAxios.post(baseURI() + 'engine/mp/SRV_UI_CM_05_S1', formData)
          .then(function (res) {
            if (res.status === gHttpStatus.SUCCESS) {
              const rsData = res.data;
              if (rsData.RESULT_SUCCESS) {
                const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_05_S1_P_RT_MSG;
                if (msg === "MSG_0001") {
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
    });

  }

  return (
    <>
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveData, onError)} title="POP_UI_CM_05_01" resizeHeight={620} resizeWidth={500}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={"tab1"} indicatorColor="primary">
          <Tab label={transLangKey("COMM")} value="tab1" />
        </Tabs>
      </Box>

      <Box style={{ marginTop: "5px", border: "1px solid #dde1ee", width: "100%", height: "100%", padding: "6px 12px" }}>
        <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: "block" }}>
          <Box style={{ height: "100%" }}>
            <InputField name="locatMgmtId" control={control} style={{display: "none"}} />
            <InputField name="locatTp" label={transLangKey("LOCAT_NM")} control={control} disabled={true} />
            <InputField name="locatLv" label={transLangKey("LOCAT_LV")} control={control} disabled={true} />
            <InputField name="locatCd" label={transLangKey("LOCAT_CD")} control={control} disabled={true} />
            <InputField name="locatNm" label={transLangKey("LOCAT_NM")} control={control} disabled={true} />

            <InputField name="bomLv" label={transLangKey("BOM_LV")} dataType={"number"} pattern={"[1-9]|[1-9][0-9]|100"} control={control} style={oneRowStyle}/>

            <InputField name="siteItemId" control={control} style={{display: "none"}} />
            <InputField type="action" name="itemCd" label={transLangKey("ITEM_CD")} onClick={() => { openPopupItem() }} control={control} readonly={true}>
              <Icon.Search />
            </InputField>
            <InputField name="itemNm" label={transLangKey("ITEM_NM")} control={control} disabled={true} />
            <InputField name="itemTp" label={transLangKey("ITEM_TP")} control={control} disabled={true} style={oneRowStyle} />

            <InputField name="baseQty" label={transLangKey("BASE_QTY")} dataType={"number"} control={control} />
            <InputField name="baseYield" label={transLangKey("BASE_YIELD")} dataType={"number"} pattern={"[1-9]|[1-9][0-9]|100"} control={control} />
            <InputField type='check' name='delYn' control={control} options={[{ label: transLangKey('DEL_YN'), value: 'Y' }]} disabled={true} style={oneRowStyle} />
            <InputField type='check' name='actvYn' control={control} options={[{ label: transLangKey('ACTV_YN'), value: 'Y' }]} />
          </Box>
        </Box>
      </Box>
    </PopupDialog>
    {itemPopupOpen && (<PopPopParentComponentItem open={itemPopupOpen} onClose={() => { setPopupItem(false); }} confirm={onSetItemCd} confKey="002" viewId="POP_UI_CM_05_01"></PopPopParentComponentItem>)}
    </>
  );
}
export default PopProductionBomNew1;
