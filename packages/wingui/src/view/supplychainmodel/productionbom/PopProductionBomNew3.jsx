import React from 'react';
import { useForm } from 'react-hook-form';
import { Box, Tab, Tabs} from '@mui/material';
import { InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

function PopProductionBomNew3(props) {
  const [username] = useUserStore(state => [state.username]);
  const { handleSubmit, getValues, control, clearErrors } = useForm({
    defaultValues: {
      prductBomMstId: props.data.globalBomMstId,
      itemCd: props.data.itemCd,
      itemNm: props.data.itemNm,
      itemTp: props.data.itemTp,
      uom: props.data.uom,
      strtDttm: "",
      endDttm: "",
      baseYield: props.data.baseYield,
      yield: "",
      bomVerId: props.data.bomVerId,
      actBomVerId: ""
    }
  });

  const [tabValue, setTabValue] = React.useState("tab1");

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

  function saveData() {
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let formData = new FormData();
        formData.append('WRK_TYPE', 'SAVE');
        formData.append('PRDUCT_BOM_MST_ID', getValues('prductBomMstId'));
        formData.append('STRT_DTTM', getValues('strtDttm'));
        formData.append('END_DTTM', getValues('endDttm'));
        formData.append('YIELD', getValues('yield'));
        formData.append('ACTV_BOM_VER_ID', getValues('actBomVerId'));
        formData.append('USER_ID', username);
        formData.append('timeout', 0);
        formData.append('CURRENT_OPERATION_CALL_ID', 'OPC_POP_UI_CM_05_03_WINDOW_01_CPT_99_01_CLICK_01');

        zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_05_S3", formData)
        .then(function (res) {
          if (res.status === gHttpStatus.SUCCESS) {
            const rsData = res.data;
            if (rsData.RESULT_SUCCESS) {
              const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_05_S3_P_RT_MSG;
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
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveData, onError)} title="POP_UI_CM_05_03" resizeHeight={350} resizeWidth={500}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={tabChange} indicatorColor="primary">
          <Tab label={transLangKey("ITEM")} value="tab1" />
          <Tab label={transLangKey("PERIOD_ACTV_BOM")} value="tab2" />
        </Tabs>
      </Box>

      <Box style={{ marginTop: "5px", border: "1px solid #dde1ee", width: "100%", height: "100%", padding: "6px 12px" }}>
        {/* tab1 */}
        <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "tab1" ? "block" : "none" }}>
          <Box style={{ height: "100%" }}>
            <InputField name="itemCd" label={transLangKey("ITEM_CD")} control={control} disabled={true} />
            <InputField name="itemNm" label={transLangKey("ITEM_NM")} control={control} disabled={true} />
            <InputField name="itemTp" label={transLangKey("ITEM_TP")} control={control} disabled={true} />
            <InputField name="uom" label={transLangKey("UOM_NM")} control={control} disabled={true} />
          </Box>
        </Box>

        {/* tab2 */}
        <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "tab2" ? "block" : "none" }}>
          <Box style={{ height: "100%" }}>
            <InputField type="datetime" name="strtDttm" label={transLangKey("STRT_DTTM")} dateformat="yyyy-MM-dd" control={control} />
            <InputField type="datetime" name="endDttm" label={transLangKey("END_DTTM")} dateformat="yyyy-MM-dd" control={control} />
            <InputField name="baseYield" label={transLangKey("BASE_YIELD")} control={control} disabled={true} />
            <InputField name="yield" label={transLangKey("YIELD")} dataType={"number"} pattern={"[1-9]|[1-9][0-9]|100"} control={control} />
            <InputField name="bomVerId" label={transLangKey("BOM_VER_ID")} control={control} disabled={true} />
            <InputField name="actvBomVerId" label={transLangKey("ACTV_BOM_VER_ID")} control={control} />
          </Box>
        </Box>

      </Box>
    </PopupDialog>
    </>
  );
}
export default PopProductionBomNew3;
