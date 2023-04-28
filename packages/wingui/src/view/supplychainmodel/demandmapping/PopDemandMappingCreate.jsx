import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box, Tab } from '@mui/material';
import { ResultArea, useStyles, zAxios, PopupDialog, useUserStore, InputField } from '@zionex/wingui-core/src/common/imports';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import PopDemanditem02 from "../common/PopDemanditem02";
import PopDemandSalesLevel from "../common/PopDemandSalesLevel";
import PopDemandItem03 from "../common/PopDemandItem03";
import PopDemandAccount from "../common/PopDemandAccount";
import PopDemandLocat from "../common/PopDemandLocat";

//수요 매핑 일괄 생성
function PopDemandMappingCreate(props) {

  const classes = useStyles();
  const [tabValue, setTabValue] = React.useState('1');
  const [username] = useUserStore(state => [state.username]);
  const [loadUomIdOption1, setLoadUomIdOption1] = useState([]);

  const [demanditem02Open, setDemanditem02Open] = useState(false);
  const [demandSalesLevelOpen, setDemandSalesLevelOpen] = useState(false);
  const [demanditem03Open, setDemanditem03Open] = useState(false);
  const [demandAccountOpen, setDemandAccountOpen] = useState(false);
  const [locatPopupOpen, setLocatPopupOpen] = useState(false);

  const [itemLvDisabled, setItemLvDisabled] = useState(true);
  const [salesLvDisabled, setsalesLvDisabled] = useState(true);
  const [itemDisabled, setItemDisabled] = useState(true);
  const [accountDisabled, setAccountLvDisabled] = useState(true);

  const { handleSubmit, control, getValues, setValue, watch, clearErrors } = useForm({
    defaultValues: {
      itemLvId: "",//
      itemLvCd: "",
      itemLvNm: "",
      salesLvId: "",//
      salesLvCd: "",
      salesLvNm: "",
      itemMstId: "",//
      itemCd: "",
      itemNm: "",
      itemTp: "",
      accountId: "",//
      accountCd: "",
      accountNm: "",
      locatMgmtId: "",
      shipTo: "",
      soldTo: "",
      billTo: "",
      channelTp: "",
      incoterms: "",
      loadUomId: "81CAC69546DF431994B6657D171283E0",
      itemLvRegistryYn: [],
      salesLvRegistryYn: [],
      itemRegistryYn: [],
      accountRegistryYn: [],
      overwriteYn: [],//기존 데이터 덮어쓰기
    }
  });

  useEffect(() => {
    if (getValues("itemLvRegistryYn")[0] === "Y") {
      setValue("salesLvRegistryYn", "");
      setValue("itemRegistryYn", "");
      setValue("accountRegistryYn", "");
      settingTextEmpty();
      setItemLvDisabled(false);
    } else {
      settingTextEmpty();
      setItemLvDisabled(true);
    }
  }, [watch('itemLvRegistryYn')]);

  useEffect(() => {
    if (getValues("salesLvRegistryYn")[0] === "Y") {
      setValue("itemLvRegistryYn", "");
      setValue("itemRegistryYn", "");
      setValue("accountRegistryYn", "");
      settingTextEmpty();
      setsalesLvDisabled(false);
    } else {
      settingTextEmpty();
      setsalesLvDisabled(true);
    }
  }, [watch('salesLvRegistryYn')]);

  useEffect(() => {
    if (getValues("itemRegistryYn")[0] === "Y") {
      setValue("itemLvRegistryYn", "");
      setValue("salesLvRegistryYn", "");
      setValue("accountRegistryYn", "");
      settingTextEmpty();
      setItemDisabled(false);
    } else {
      settingTextEmpty();
      setItemDisabled(true);
    }

  }, [watch('itemRegistryYn')]);

  useEffect(() => {
    if (getValues("accountRegistryYn")[0] === "Y") {
      setValue("itemLvRegistryYn", "");
      setValue("salesLvRegistryYn", "");
      setValue("itemRegistryYn", "");
      settingTextEmpty();
      setAccountLvDisabled(false);
    } else {
      settingTextEmpty();
      setAccountLvDisabled(true);
    }
  }, [watch('accountRegistryYn')]);

  const settingTextEmpty = () => {
    setValue('itemLvCd', "");
    setValue('itemLvNm', "");
    setValue('salesLvCd', "");
    setValue('salesLvNm', "");
    setValue('itemCd', "");
    setValue('itemNm', "");
    setValue('itemTp', "");
    setValue('accountCd', "");
    setValue('accountNm', "");
  }

  useEffect(() => {
    async function initLoad() {
      const comboArr = await loadComboList(
        {
          PROCEDURE_NAME: 'SP_UI_CM_CODE',
          URL: 'common/combos',
          CODE_KEY: "ID",
          CODE_VALUE: "CD_NM",
          PARAM: { "P_CODE": "LOCAT_CD, LOAD_UOM_TYPE" },
        }
      );
      comboArr.map((combo) => { combo.label = transLangKey(combo.label); });
      setLoadUomIdOption1(comboArr);
    }

    initLoad();
  }, []);

  const onError = (errors, e) => {
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  const getConfirm = (popupName, dataRow) => {
    if (popupName === "PopDemanditem02") {
      setValue('itemLvId', dataRow.ITEM_LV_ID);
      setValue('itemLvCd', dataRow.ITEM_LV_CD);
      setValue('itemLvNm', dataRow.ITEM_LV_NM);
    }
    if (popupName === "PopDemandSalesLevel") {
      setValue('salesLvId', dataRow.SALES_LV_ID);
      setValue('salesLvCd', dataRow.SALES_LV_CD);
      setValue('salesLvNm', dataRow.SALES_LV_NM);
    }
    if (popupName === "PopDemandItem03") {

      setValue('itemMstId', dataRow.ITEM_MST_ID);
      setValue('itemCd', dataRow.ITEM_CD);
      setValue('itemNm', dataRow.ITEM_NM);
      setValue('itemTp', dataRow.ITEM_TP);
    }
    if (popupName === "PopDemandAccount") {

      setValue('accountId', dataRow.ACCOUNT_ID);
      setValue('accountCd', dataRow.ACCOUNT_CD);
      setValue('accountNm', dataRow.ACCOUNT_NM);
    }
    if (popupName === "PopDemandLocat") {
      setValue('locatMgmtId', dataRow.LOCAT_MGMT_ID)
      setValue('locatTp', dataRow.LOCAT_TP_NM);
      setValue('locatLv', dataRow.LOCAT_LV);
      setValue('locatCd', dataRow.LOCAT_CD);
      setValue('locatNm', dataRow.LOCAT_NM);
    }
  }

  const saveSubmit = () => {
    let formData = new FormData();
    formData.append('CHK_ITEM_LV', getValues("itemLvRegistryYn")[0] === "Y" ? true : false);
    formData.append('CHK_SALES_LV', getValues("salesLvRegistryYn")[0] === "Y" ? true : false);
    formData.append('CHK_ITEM', getValues("itemRegistryYn")[0] === "Y" ? true : false);
    formData.append('CHK_ACCOUNT', getValues("accountRegistryYn")[0] === "Y" ? true : false);
    formData.append('LOAD_UOM_ID', getValues("loadUomId"));
    formData.append('OVERWRITE_DATA_YN', getValues("overwriteYn")[0] === "Y" ? true : false);
    formData.append('USER_ID', username);
    formData.append('timeout', 0);
    formData.append('CURRENT_OPERATION_CALL_ID', 'OPC_POP_UI_CM_12_03_WINDOW_01_CPT_99_01_CLICK_01');

    if (getValues("itemLvId") !== "") {
      formData.append('ITEM_LV_ID', getValues("itemLvId"));
    }
    if (getValues("salesLvId") !== "") {
      formData.append('SALES_LV_ID', getValues("salesLvId"));
    }
    if (getValues("itemMstId") !== "") {
      formData.append('ITEM_MST_ID', getValues("itemMstId"));
    }
    if (getValues("accountId") !== "") {
      formData.append('ACCOUNT_ID', getValues("accountId"));
    }
    if (getValues("locatMgmtId") !== "") {
      formData.append('LOCAT_MGMT_ID', getValues("locatMgmtId"));
    }
    if (getValues("transpLotsize") !== undefined) {
      formData.append('TRANSP_LOTSIZE', getValues("transpLotsize"));
    }

    zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_12_BATCH", formData)
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        const rsData = res.data;
        if (rsData.RESULT_SUCCESS) {
          const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_12_BATCH_P_RT_MSG;
          if (msg === "MSG_0003") {
            props.confirm(true);
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

  const tabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title={props.title} resizeHeight={1000} resizeWidth={450}>
      <ResultArea className={classes.tabWrap}>
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={tabChange} aria-label="lab API tabs example">
              <Tab label={transLangKey('DMND_INFO')} value="1" />
              <Tab label={transLangKey('FROM_LOCAT')} value="2" />
              <Tab label={transLangKey('SHIPPING_LOT')} value="3" />
            </TabList>
          </Box>
          <TabPanel value="1">
            {/* 품목 레벨 등록 */}
            <InputField type="check" name={"itemLvRegistryYn"} control={control} options={[{ label: transLangKey("ITEM_LV_REGISTRY"), value: 'Y' }]} />
            {/* 품목 레벨 코드 */}
            <InputField type='action' name="itemLvCd" label={transLangKey("ITEM_LV_CD")} onClick={() => { setDemanditem02Open(true) }} title={transLangKey('SEARCH')} control={control} disabled={itemLvDisabled}>
              <Icon.Search />
            </InputField>
            {/* 품목 레벨 명 */}
            <InputField name="itemLvNm" label={transLangKey("ITEM_LV_NM")} control={control} readonly={false} disabled={itemLvDisabled} />
            {/* 판매 레벨 등록 */}
            <InputField type="check" name={"salesLvRegistryYn"} control={control} options={[{ label: transLangKey("SALES_LV_REGISTRY"), value: 'Y' }]} />
            {/* (판매)품목 레벨 코드 */}
            <InputField type='action' name="salesLvCd" label={transLangKey("ITEM_LV_CD")} onClick={() => { setDemandSalesLevelOpen(true) }} title={transLangKey('SEARCH')} control={control} disabled={salesLvDisabled}>
              <Icon.Search />
            </InputField>
            {/* (판매)품목 레벨 명 */}
            <InputField name="salesLvNm" label={transLangKey("ITEM_LV_NM")} control={control} readonly={false} disabled={salesLvDisabled} />
            {/* 품목 등록 */}
            <InputField type="check" name={"itemRegistryYn"} control={control} options={[{ label: transLangKey("ITEM_REGISTRY"), value: 'Y' }]} />
            {/* 품목 코드 */}
            <InputField type='action' name="itemCd" label={transLangKey("ITEM_CD")} onClick={() => { setDemanditem03Open(true) }} title={transLangKey('SEARCH')} control={control} disabled={itemDisabled}>
              <Icon.Search />
            </InputField>
            {/* 품목 명 */}
            <InputField name="itemNm" label={transLangKey("ITEM_NM")} control={control} readonly={false} disabled={itemDisabled} />
            {/* 품목 타입 */}
            <InputField name="itemTp" label={transLangKey("ITEM_TP")} control={control} readonly={false} disabled={itemDisabled} />

            {/* 거래처 등록 */}
            <InputField type="check" name={"accountRegistryYn"} control={control} options={[{ label: transLangKey("ACCOUNT_REGISTRY"), value: 'Y' }]} />
            {/* 거래처 코드 */}
            <InputField type='action' name="accountCd" label={transLangKey("ACCOUNT_CD")} onClick={() => { setDemandAccountOpen(true) }} title={transLangKey('SEARCH')} control={control} disabled={accountDisabled}>
              <Icon.Search />
            </InputField>
            {/* 거래처 명 */}
            <InputField name="accountNm" label={transLangKey("ACCOUNT_NM")} control={control} readonly={false} disabled={accountDisabled} />
            {/* 기존 데이터 덮어쓰기 */}
            <InputField type="check" name={"overwriteYn"} label='' control={control} options={[{ label: transLangKey('OVERWRITE_EXIST_DATA'), value: 'Y' }]} />
          </TabPanel>
          <TabPanel value="2">
            <TabContext value={tabValue}>
              <InputField type='action' name="locatTp" label={transLangKey("LOCAT_TP_NM")} onClick={() => { setLocatPopupOpen(true) }} title={transLangKey('SEARCH')} control={control}>
                <Icon.Search />
              </InputField>
              {/* 거점 레벨 */}
              <InputField name="locatLv" label={transLangKey("LOCAT_LV")} control={control} readonly={false} disabled={true} />
              {/* 거점 코드 */}
              <InputField name="locatCd" label={transLangKey("LOCAT_CD")} control={control} readonly={false} disabled={true} />
              {/* 거점 명 */}
              <InputField name="locatNm" label={transLangKey("LOCAT_NM")} control={control} readonly={false} disabled={true} />
            </TabContext>
          </TabPanel>
          <TabPanel value="3">
            {/* 작업 단위 */}
            <InputField name="loadUomId" label={transLangKey("LOAD_UOM_ID")} type="select" control={control} options={loadUomIdOption1} readonly={false} defaultValue={"81CAC69546DF431994B6657D171283E0"} />
            {/* 운송 LOT 크기 */}
            <InputField name="transpLotsize" label={transLangKey("TRANSP_LOTSIZE")} control={control} readonly={false} />
            {/* UOM 수량 */}
            <InputField name="uomQty" label={transLangKey("UOM_QTY")} control={control} readonly={false} disabled={true} />
            {/* 포장 수량 */}
            <InputField name="packingQty" label={transLangKey("PACKING_QTY")} control={control} readonly={false} disabled={true} />
            {/* 포장 타입 */}
            <InputField name="packingTp" label={transLangKey("PACKING_TP")} control={control} readonly={false} disabled={true} />
            {/* 팔레트 수량 */}
            <InputField name="palletQty" label={transLangKey("PALLET_QTY")} control={control} readonly={false} disabled={true} />
            {/* 팔레트 타입 */}
            <InputField name="palletTp" label={transLangKey("PALLET_TP")} control={control} readonly={false} disabled={true} />
          </TabPanel>
        </TabContext>
      </ResultArea>
      {demanditem02Open && (<PopDemanditem02 open={demanditem02Open} onClose={() => setDemanditem02Open(false)} multiple={true} confirm={getConfirm} title="COMM_SRH_POP_ITEM_LV"></PopDemanditem02>)}
      {demandSalesLevelOpen && (<PopDemandSalesLevel open={demandSalesLevelOpen} onClose={() => setDemandSalesLevelOpen(false)} multiple={true} confirm={getConfirm} title="COMM_SRH_POP_SALES_LV"></PopDemandSalesLevel>)}
      {demanditem03Open && (<PopDemandItem03 open={demanditem03Open} onClose={() => setDemanditem03Open(false)} confirm={getConfirm} multiple={true} title="COMM_SRH_POP_ITEM"></PopDemandItem03>)}
      {demandAccountOpen && (<PopDemandAccount open={demandAccountOpen} onClose={() => setDemandAccountOpen(false)} confirm={getConfirm} multiple={true} title="COMM_SRH_POP_ACCOUNT"></PopDemandAccount>)}
      {locatPopupOpen && (<PopDemandLocat open={locatPopupOpen} onClose={() => setLocatPopupOpen(false)} confirm={getConfirm} multiple={true} loadPopup={"PopDemandMappingCreate"} title="COMM_SRH_POP_LOCAT"></PopDemandLocat>)}
    </PopupDialog>
  );
}

export default PopDemandMappingCreate;
