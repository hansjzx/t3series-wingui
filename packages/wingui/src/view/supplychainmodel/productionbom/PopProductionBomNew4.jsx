import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Box, Tab, Tabs} from '@mui/material';
import { InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import PopComponentItem from "./PopComponentItem";

const oneRowStyle = {marginRight: "100px"};

function PopProductionBomNew4(props) {
  const [username] = useUserStore(state => [state.username]);
  const { handleSubmit, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      prductBomDtlId: "",
      bomVerId: "",
      verActvYn: ["N"],
      baseBomYn: ["N"],
      bomLv: "",
      itemCd: "",
      itemNm: "",
      itemTp: "",
      routeCd: "",
      routeDescrip: "",
      bomItemTp: "",
      consumeQty: "",
      uomCd: "",
      strtDttm: "",
      endDttm: "",
      baseBomRate: "1",
      bomRate: ""
    }
  });

  useEffect(() => {
    setPopupData(props.data);
  }, []);

  const [tabValue, setTabValue] = React.useState("tab1");

  const [itemPopupOpen, setPopupItem] = useState(false);
  const [popupData, setPopupData] = useState({});

  const tabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  function onError(errors) {
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  function openPopupItem() {
    setPopupItem(true);
  }

  function onSetItemCd(gridRow) {
    setValue("prductBomDtlId", gridRow.ID);
    setValue("bomVerId", gridRow.BOM_VER_ID);
    setValue("verActvYn", [gridRow.VER_ACTV_YN ? 'Y' : 'N']);
    setValue("baseBomYn", [gridRow.BASE_BOM_YN ? 'Y' : 'N']);
    setValue("bomLv", gridRow.BOM_LV);
    setValue("itemCd", gridRow.ITEM_CD);
    setValue("itemNm", gridRow.ITEM_NM);
    setValue("itemTp", gridRow.ITEM_TP);
    setValue("routeCd", gridRow.ROUTE_CD);
    setValue("routeDescrip", gridRow.ROUTE_DESCRIP);
    setValue("bomItemTp", gridRow.BOM_ITEM_TP);
    setValue("consumeQty", gridRow.CONSUME_QTY);
    setValue("uomCd", gridRow.UOM_CD);
    setValue("baseBomRate", gridRow.BASE_BOM_RATE);
  }

  function saveData() {
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let formData = new FormData();
        formData.append('WRK_TYPE', 'SAVE');
        formData.append('PRDUCT_BOM_DTL_ID', getValues('prductBomDtlId'));
        formData.append('STRT_DTTM', new Date(getValues('strtDttm')).format("yyyy-MM-ddT00:00:00"));
        formData.append('END_DTTM', new Date(getValues('endDttm')).format("yyyy-MM-ddT00:00:00"));
        formData.append('BOM_RATE', getValues('bomRate'));
        formData.append('USER_ID', username);

        zAxios.post(baseURI() + 'engine/mp/SRV_UI_CM_05_S4', formData)
          .then(function (res) {
            if (res.status === gHttpStatus.SUCCESS) {
              const rsData = res.data;
              if (rsData.RESULT_SUCCESS) {
                const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_05_S4_P_RT_MSG;
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
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveData, onError)} title="POP_UI_CM_05_04" resizeHeight={700} resizeWidth={500}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={tabChange} indicatorColor="primary">
          <Tab label={transLangKey("ITEM")} value="tab1" />
          <Tab label={transLangKey("PERIOD_BOM_RATE")} value="tab2" />
        </Tabs>
      </Box>

      <Box style={{ marginTop: "5px", border: "1px solid #dde1ee", width: "100%", height: "100%", padding: "6px 12px" }}>
        {/* tab1 */}
        <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "tab1" ? "block" : "none" }}>
          <Box style={{ height: "100%" }}>
            <InputField name="bomVerId" label={transLangKey("BOM_VER_ID")} control={control} disabled={true} />

            <InputField type='check' name='verActvYn' control={control} options={[{ label: transLangKey('VER_ACTV_YN'), value: 'Y' }]} disabled={true} style={oneRowStyle} />
            <InputField type='check' name='baseBomYn' control={control} options={[{ label: transLangKey('BASE_BOM_YN'), value: 'Y' }]} disabled={true} style={oneRowStyle} />

            <InputField name="bomLv" label={transLangKey("BOM_LV")} control={control} disabled={true} style={oneRowStyle} />

            <InputField type="action" name="itemCd" label={transLangKey("ITEM_CD")} onClick={() => {openPopupItem()}} control={control} readonly={true}>
              <Icon.Search />
            </InputField>
            <InputField name="itemNm" label={transLangKey("ITEM_NM")} control={control} disabled={true} />
            <InputField name="itemTp" label={transLangKey("ITEM_TP")} control={control} disabled={true} style={oneRowStyle} />
            
            <InputField name="routeCd" label={transLangKey("ROUTE_CD")} control={control} disabled={true} />
            <InputField name="routeDescrip" label={transLangKey("ROUTE_DESCRIP")} control={control} disabled={true} />
            
            <InputField name="bomItemTp" label={transLangKey("BOM_ITEM_TP")} control={control} disabled={true} />
            <InputField name="consumeQty" label={transLangKey("CONSUME_QTY")} control={control} disabled={true} />
            <InputField name="uomCd" label={transLangKey("UOM_NM")} control={control} disabled={true} />
          </Box>
        </Box>

        {/* tab2 */}
        <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "tab2" ? "block" : "none" }}>
          <Box style={{ height: "100%" }}>
            <InputField type="datetime" name="strtDttm" label={transLangKey("STRT_DTTM")} dateformat="yyyy-MM-dd" control={control} />
            <InputField type="datetime" name="endDttm" label={transLangKey("END_DTTM")} dateformat="yyyy-MM-dd" control={control} />
            <InputField name="baseBomRate" label={transLangKey("BASE_BOM_RATE")} control={control} disabled={true} />
            <InputField name="bomRate" label={transLangKey("BOM_RATE")} dataType={"number"} pattern={"[1-9]|[1-9][0-9]|100"} control={control} />
          </Box>
        </Box>

      </Box>
    </PopupDialog>
    {itemPopupOpen && (<PopComponentItem open={itemPopupOpen} onClose={() => { setPopupItem(false); }} confirm={onSetItemCd} data={popupData} ></PopComponentItem>)}
    </>
  );
}
export default PopProductionBomNew4;
