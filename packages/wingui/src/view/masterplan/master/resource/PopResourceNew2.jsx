import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Tab, Tabs} from '@mui/material';
import { InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import PopPopResourceNew from './PopPopResourceNew';

const oneRowStyle = { minWidth: "200px", marginRight: "50px" };

function PopResourceNew2(props) {
  const [username] = useUserStore(state => [state.username]);

  const { handleSubmit, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      resMstId: '',
      locatTpNm: '',
      locatLv: '',
      locatCd: '',
      locatNm: '',
      planResTp: '',
      routeGrp: '',
      routeDescrip: '',
      resGrpTp: '',
      wc: '',
      resCapaCalBaseId: '',
      actvYn: ['Y'],

      resCd: '',
      resDescrip: '',
      grpResPrductTimeCal: '',
      defatResYn: [''],
      outsrcYn: [''],
      batchResYn: [''],
      toolResYn: [''],
      capaMgmtPeriodId: '',
      defatCapaVal: '',
      defatOvrCapaVal: '',
      defatEfficyVal: '',
      displayColor: ''
    }
  });

  useEffect(() => {
    if (props.data !== null) {
      let rstArr = [];
      for (var i = 0, len = props.data.resCapaCalBase.length; i < len; i++) {
        var row = props.data.resCapaCalBase[i];
        if (row !== null) {
          var listObj = { value: row.ID, label: transLangKey(row.CD_NM) };
          rstArr.push(listObj);
        }
      }

      setValue("resCapaCalBaseId", rstArr[0].value);
      setResCapaCalBaseIdOptionOption(rstArr);

      rstArr = [];
      for (var i = 0, len = props.data.capaMgmtPeriod.length; i < len; i++) {
        var row = props.data.capaMgmtPeriod[i];
        if (row !== null) {
          var listObj = { value: row.ID, label: transLangKey(row.CD_NM) };
          rstArr.push(listObj);
        }
      }

      setValue("capaMgmtPeriodId", rstArr[0].value);
      setCapaMgmtPeriodIdOptionOption(rstArr);
    }
  }, []);

  const [resourceNewPopPopupOpen, setPopPopResourceNew] = useState(false);
  const [resCapaCalBaseIdOption, setResCapaCalBaseIdOptionOption] = useState([]);
  const [capaMgmtPeriodIdOption, setCapaMgmtPeriodIdOptionOption] = useState([]);

  const [tabValue, setTabValue] = React.useState("tab1");

  const tabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  function onError(errors) {
    if (typeof errors !== 'undefined' && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  function openPopPopupResourceNew() {
    setPopPopResourceNew(true);
  }

  function onSetResource(gridRow) {
    setValue("resMstId", gridRow.ID);
    setValue("locatTpNm", gridRow.LOCAT_TP_NM);
    setValue("locatLv", gridRow.LOCAT_LV);
    setValue("locatCd", gridRow.LOCAT_CD);
    setValue("locatNm", gridRow.LOCAT_NM);
    setValue("planResTp", gridRow.PLAN_RES_TP);
    setValue("routeGrp", gridRow.ROUTE_GRP);
    setValue("routeDescrip", gridRow.RES_DESCRIP);
    setValue("resGrpTp", gridRow.RES_GRP_TP);
    setValue("wc", gridRow.WC);
  }

  function saveData() {
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let formData = new FormData();

        formData.append('WRK_TYPE', 'SAVE');
        formData.append('RES_DTL_ID', '');
        formData.append('RES_MST_ID', getValues('resMstId'));
        formData.append('RES_CAPA_CAL_BASE_ID', getValues('resCapaCalBaseId'));
        formData.append('RES_CD', getValues('resCd'));
        formData.append('RES_DESCRIP', getValues('resDescrip'));
        formData.append('DEFAT_RES_YN', getValues('defatResYn').join('') === 'Y' ? true : false);
        formData.append('OUTSRC_YN', getValues('outsrcYn').join('') === 'Y' ? true : false);
        formData.append('BATCH_RES_YN', getValues('batchResYn').join('') === 'Y' ? true : false);
        formData.append('TOOL_RES_YN', getValues('toolResYn').join('') === 'Y' ? true : false);
        formData.append('CAPA_MGMT_PERIOD_ID', getValues('capaMgmtPeriodId'));
        formData.append('DEFAT_CAPA_VAL', getValues('defatCapaVal'));
        formData.append('DEFAT_OVR_CAPA_VAL', getValues('defatOvrCapaVal'));
        formData.append('DEFAT_EFFICY_VAL', getValues('defatEfficyVal'));
        formData.append('DISPLAY_COLOR', getValues('displayColor'));
        formData.append('ACTV_YN', getValues('actvYn').join('') === 'Y' ? true : false);
        formData.append('USER_ID', username);

        zAxios({
          method: 'post',
          url: baseURI() + 'engine/mp/SRV_UI_MP_06_S2',
          data: formData,
          fromPopup: true
        })
          .then(function (res) {
            const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_06_S2_P_RT_MSG;
            showMessage(transLangKey('MSG_CONFIRM'), transLangKey(msg), { close: false });

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
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveData, onError)} title="POP_UI_MP_06_03" resizeHeight={600} resizeWidth={500}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={tabChange} indicatorColor="primary">
          <Tab label={transLangKey("COMM")} value="tab1" />
          <Tab label={transLangKey("RES")} value="tab2" />
        </Tabs>
      </Box>

      <Box style={{ marginTop: "5px", border: "1px solid #dde1ee", width: "100%", height: "100%", padding: "6px 12px" }}>
        {/* tab1 */}
        <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "tab1" ? "block" : "none" }}>
          <Box style={{ height: "100%" }}>
            <InputField name='resMstId' control={control} style={{display: "none"}} />
            <InputField type="action" name="locatTpNm" label={transLangKey("LOCAT_TP_NM")} title={transLangKey("SEARCH")} onClick={() => { openPopPopupResourceNew() }} control={control}>
              <Icon.Search />
            </InputField>
            <InputField name="locatLv" label={transLangKey("LOCAT_LV")} control={control} disabled={true} />
            <InputField name="locatCd" label={transLangKey("LOCAT_CD")} control={control} disabled={true} />
            <InputField name="locatNm" label={transLangKey("LOCAT_NM")} control={control} disabled={true} />
            <InputField name="planResTp" label={transLangKey("PLAN_RES_TP")} control={control} disabled={true} />
            <InputField name="routeGrp" label={transLangKey("RES_GRP_CD")} control={control} disabled={true} />
            <InputField name="routeDescrip" label={transLangKey("RES_GRP_DESCRIP")} control={control} disabled={true} />
            <InputField name="resGrpTp" label={transLangKey("RES_GRP_TP")} control={control} disabled={true} />
            <InputField name="wc" label={transLangKey("WC")} control={control} disabled={true} />
            <InputField type="select" name="resCapaCalBaseId" label={transLangKey("RES_CAPA_CAL_CRITERIA")} control={control} options={resCapaCalBaseIdOption} />
            <InputField type="check" name="actvYn" control={control} options={[{ label: transLangKey("ACTV_YN"), value: "Y" }]} />
          </Box>
        </Box>

        {/* tab2 */}
        <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "tab2" ? "block" : "none" }}>
          <Box style={{ height: "100%" }}>
            <InputField name="resCd" label={transLangKey("RES_CD")} control={control} />
            <InputField name="resDescrip" label={transLangKey("RES_DESCRIP")} control={control} />
            <InputField name="grpResPrductTimeCal" label={transLangKey("GRP_RES_PRDUCT_TIME_CAL")} control={control} disabled={true} style={oneRowStyle} />
            <InputField type="check" name="defatResYn" control={control} options={[{ label: transLangKey("DEFAT_RES_YN"), value: "Y" }]} />
            <InputField type="check" name="outsrcYn" control={control} options={[{ label: transLangKey("OUTSRC_YN"), value: "Y" }]} />
            <InputField type="check" name="batchResYn" control={control} options={[{ label: transLangKey("BATCH_RES_YN"), value: "Y" }]} />
            <InputField type="check" name="toolResYn" control={control} options={[{ label: transLangKey("TOOL_RES_YN"), value: "Y" }]} />
            <InputField type="select" name="capaMgmtPeriodId" label={transLangKey("CAPA_MGMT_PERIOD")} control={control} options={capaMgmtPeriodIdOption} style={oneRowStyle} />
            <InputField name="defatCapaVal" label={transLangKey("DEFAT_CAPA_VAL")} dataType={"number"} control={control} />
            <InputField name="defatOvrCapaVal" label={transLangKey("DEFAT_OVR_CAPA_VAL")} dataType={"number"} control={control} />
            <InputField name="defatEfficyVal" label={transLangKey("DEFAT_EFFICY_VAL")} dataType={"number"} control={control} />
            <InputField name="displayColor" label={transLangKey("DISPLAY_COLOR")} control={control} />
          </Box>
        </Box>
      </Box>
    </PopupDialog>
    {resourceNewPopPopupOpen && (<PopPopResourceNew open={resourceNewPopPopupOpen} onClose={() => { setPopPopResourceNew(false); }} confirm={onSetResource}></PopPopResourceNew>)}
    </>
  );
}

export default PopResourceNew2;
