import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box, Tab, Tabs } from '@mui/material';
import { InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import PopLocatTp from "@wingui/view/common/PopLocatTp";
import PopItem from "@wingui/view/supplychainmodel/common/PopCommItem";
import PopResource from "../plantrescalendar/PopPopResource";

const oneRowStyle = { marginRight: "50px" };

function PopItemProductionCalendarBundleCreate(props) {
  const [username] = useUserStore(state => [state.username]);
  const { handleSubmit, watch, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      applyPoint: "PARTIAL",

      checkLocat: ["", "Y"],
      locatMgmtId: "",
      locatTpNm: "",
      locatLv: "",
      locatCd: "",
      locatNm: "",

      checkItem: [""],
      itemMstId: "",
      itemCd: "",
      itemNm: "",

      checkRes: [""],
      resId: "",
      resCd: "",
      resDescrip: "",

      overwriteDataYn: [""],

      strtDate: "",
      endDate: "",
      opertYn: [""]
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

  const [tabValue, setTabValue] = React.useState('tab1');

  const [locatTpPopupOpen, setPopupLocatTp] = useState(false);
  const [itemPopupOpen, setPopupItem] = useState(false);
  const [resPopupOpen, setPopupRes] = useState(false);

  const [locatDisabled, setLocatDisabled] = useState(false);
  const [itemDisabled, setItemDisabled] = useState(false);
  const [resDisabled, setResDisabled] = useState(false);

  const watchApplyPoint = watch('applyPoint');
  const watchCheckLocat = watch('checkLocat');
  const watchCheckItem = watch('checkItem');
  const watchCheckRes = watch('checkRes');

  useEffect(() => {
    if (watchApplyPoint === "ALL") {
      setValue("checkLocat", [""]);
      setValue("checkItem", [""]);
      setValue("checkRes", [""]);

      setLocatDisabled(true);
      setItemDisabled(true);
      setResDisabled(true);
    } else {
      setValue("checkLocat", ["", "Y"]);

      setLocatDisabled(false);
      setItemDisabled(false);
      setResDisabled(false);
    }
  }, [watchApplyPoint]);

  useEffect(() => {
    if (watchCheckLocat.length === 1) {
      setValue("locatTpNm", "");
      setValue("locatLv", "");
      setValue("locatCd", "");
      setValue("locatNm", "");

      setLocatDisabled(true);
    } else {
      setValue("checkItem", [""]);
      setValue("checkRes", [""]);

      setLocatDisabled(false);
    }
  }, [watchCheckLocat]);

  useEffect(() => {
    if (watchCheckItem.length === 1) {
      setValue("itemMstId", "");
      setValue("itemCd", "");
      setValue("itemNm", "");

      setItemDisabled(true);
    } else {
      setValue("checkLocat", [""]);
      setValue("checkRes", [""]);

      setItemDisabled(false);
    }
  }, [watchCheckItem]);

  useEffect(() => {
    if (watchCheckRes.length === 1) {
      setValue("resId", "");
      setValue("resCd", "");
      setValue("resDescrip", "");

      setResDisabled(true);
    } else {
      setValue("checkLocat", [""]);
      setValue("checkItem", [""]);

      setResDisabled(false);
    }
  }, [watchCheckRes]);

  const tabChange = (event, newValue) => {
    setTabValue(newValue);
  }

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

  function onSetItem(gridRow) {
    setValue('itemMstId', gridRow[0].ITEM_MST_ID);
    setValue('itemCd', gridRow[0].ITEM_CD);
    setValue('itemNm', gridRow[0].ITEM_NM);
  }

  function openPopupRes() {
    setPopupRes(true);
  }

  function onSetRes(gridRow) {
    setValue('resId', gridRow.RES_MGMT_DTL_ID);
    setValue('resCd', gridRow.RES_CD);
    setValue('resDescrip', gridRow.RES_DESCRIP);
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
    formData.append('CHECK_RES', getValues('checkRes').join("")  === 'Y' ? true : false);
    formData.append('RES_ID', getValues('resId'));
    formData.append('STRT_DATE', new Date(getValues('strtDate')).format('yyyy-MM-ddT00:00:00'));
    formData.append('END_DATE', new Date(getValues('endDate')).format('yyyy-MM-ddT00:00:00'));
    formData.append('OPERT_YN', getValues('opertYn').join("")  === 'Y' ? true : false);
    formData.append('OVERWRITE_DATA_YN', getValues('overwriteDataYn').join("")  === 'Y' ? 'true' : 'false');
    formData.append('USER_ID', username);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_17_BATCH',
      data: formData,
      fromPopup: true
    })
      .then(function (res) {
        const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_17_BATCH_P_RT_MSG;
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
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="POP_UI_MP_17_01" resizeHeight={720} resizeWidth={500}>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={tabChange} indicatorColor="primary">
          <Tab label={transLangKey('LOCAT_ITEM_RES_INFO')} value="tab1" />
          <Tab label={transLangKey('PERIOD_INFO')} value="tab2" />
        </Tabs>
      </Box>

      <Box style={{ marginTop: "5px", border: "1px solid #dde1ee", width: "100%", height: "100%", padding: "6px 12px"}}>
        {/* tab1 */}
        <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: tabValue === "tab1" ? "block" : "none" }}>
          <Box style={{height:"100%"}}>
            <InputField type="radio" name="applyPoint" control={control} setValue={setValue} options={radioOptions} style={oneRowStyle} />

            <InputField type="check" name="checkLocat" control={control} options={[{ label: transLangKey("LOCAT_REGISTRY"), value: "Y" }]} disabled={ (getValues("applyPoint") !== 'PARTIAL') } style={oneRowStyle} />
            <InputField type="action" name="locatTpNm" label={transLangKey("LOCAT_TP_NM")} disabled={locatDisabled} title={transLangKey("SEARCH")} onClick={() => { openPopupLocatTp() }} control={control}>
              <Icon.Search />
            </InputField>
            <InputField name="locatLv" label={transLangKey("LOCAT_LV")} control={control} disabled={true} />
            <InputField name="locatCd" label={transLangKey("LOCAT_CD")} control={control} disabled={true} />
            <InputField name="locatNm" label={transLangKey("LOCAT_NM")} control={control} disabled={true} />

            <InputField type="check" name="checkItem" control={control} options={[{ label: transLangKey("ITEM_REGISTRY"), value: "Y" }]} disabled={ (getValues("applyPoint") !== 'PARTIAL') } style={oneRowStyle} />
            <InputField type="action" name="itemCd" label={transLangKey("ITEM_CD")} disabled={itemDisabled} title={transLangKey("SEARCH")} onClick={() => { openPopupItem() }} control={control}>
              <Icon.Search />
            </InputField>
            <InputField name="itemNm" label={transLangKey("ITEM_NM")} control={control} disabled={true} />

            <InputField type="check" name="checkRes" control={control} options={[{ label: transLangKey("RES_REGISTRY"), value: "Y" }]} disabled={ (getValues("applyPoint") !== 'PARTIAL') } style={oneRowStyle} />
            <InputField type="action" name="resCd" label={transLangKey("RES_CD")} disabled={resDisabled} title={transLangKey("SEARCH")} onClick={() => { openPopupRes() }} control={control}>
              <Icon.Search />
            </InputField>
            <InputField name="resDescrip" label={transLangKey("RES_DESCRIP")} control={control} disabled={true} />

            <hr />

            <InputField type='check' name='overwriteDataYn' label='' control={control} options={[{ label: transLangKey('OVERWRITE_EXIST_DATA'), value: 'Y' }]} />
          </Box>
        </Box>

        {/* tab2 */}
        <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: tabValue === "tab2" ? "block" : "none" }}>
          <InputField name="strtDate" type="datetime" label={transLangKey("STRT_DATE")} dateformat="yyyy-MM-dd" control={control} />
          <InputField name="endDate" type="datetime" label={transLangKey("END_DATE")} dateformat="yyyy-MM-dd" control={control} />
          <InputField type='check' name='opertYn' label='' control={control} options={[{ label: transLangKey('OPERT_YN'), value: 'Y' }]} />
        </Box>
      </Box>
    </PopupDialog>

    {locatTpPopupOpen && (<PopLocatTp open={locatTpPopupOpen} onClose={() => { setPopupLocatTp(false); }} confirm={onSetLocatTp}></PopLocatTp>)}
    {itemPopupOpen && (<PopItem open={itemPopupOpen} onClose={() => { setPopupItem(false); }} confirm={onSetItem}></PopItem>)}
    {resPopupOpen && (<PopResource open={resPopupOpen} onClose={() => { setPopupRes(false); }} confirm={onSetRes} data={getValues("locatMgmtId")}></PopResource>)}
    </>
  );
}

export default PopItemProductionCalendarBundleCreate;
