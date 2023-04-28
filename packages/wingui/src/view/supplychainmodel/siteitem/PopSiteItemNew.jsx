import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Tab, Tabs } from '@mui/material';
import { InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import PopLocatTp from '@wingui/view/common/PopLocatTp';
import PopCommItemLv from '../common/PopCommItemLv';
import PopCurcy from '../common/PopCurcy';

function PopSiteItemNew(props) {
  const [username] = useUserStore(state => [state.username]);
  const { handleSubmit, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      locationTypeName: '',
      locationLevel: '',
      locationCode: '',
      locationName: '',
      itemCode: '',
      itemName: '',
      itemDescription: '',
      itemLevel: '',
      itemType: '',
      bomItemTypeId: '',
      procureTypeId: '',
      differentiationClassId: '',
      minOrderSize: '',
      maxOrderSize: '',
      uomCode: '',
      currencyName: '',
      allowedHolidy: [],
      active: ['Y'],
      SRA: '',
      RTS: '',
      EOP: '',
      EOS: '',
      parentItemSOL: '',
      stockOnHand: [],
      immediateShipment: [],
      stockPolicy: '',
      standardPrice: '',
      minLv: '',
      maxLv: '',
      allowedPush: [],
      pushType: '',
      alternatePushPolicy: '',
      directCost: '',
      indirectCost: ''
    }
  });

  const [option1, setOption1] = useState([]);
  const [option2, setOption2] = useState([]);
  const [option3, setOption3] = useState([]);
  const [option4, setOption4] = useState([]);
  const [option5, setOption5] = useState([]);
  const [option6, setOption6] = useState([]);
  const [option7, setOption7] = useState([]);
  const [locatMgmtId, setLocatMgmtId] = useState('');
  const [itemMstId, setItemMstId] = useState('');
  const [itemScopeId, setItemScopeId] = useState('');
  const [curcyCd, setCurcyCd] = useState('');
  const [locatTpPopupOpen, setLocatTpPopupOpen] = useState(false);
  const [itemLvPopupOpen, setItemLvPopupOpen] = useState(false);
  const [currencyPopupOpen, setCurrencyPopupOpen] = useState(false);
  const [tabValue, setTabValue] = React.useState('tabCommon');

  useEffect(() => {
    setCode();
  }, []);

  const tabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  function openLocatTpPopup() {
    setLocatTpPopupOpen(true);
  }

  function onSetConsumeLocatTp(gridRow) {
    setLocatMgmtId(gridRow.LOCAT_MGMT_ID);
    setValue('locationTypeName', gridRow.LOCAT_TP_NM);
    setValue('locationLevel', gridRow.LOCAT_LV);
    setValue('locationCode', gridRow.LOCAT_CD);
    setValue('locationName', gridRow.LOCAT_NM);
  }

  function openItemLvPopup() {
    setItemLvPopupOpen(true);
  }

  function onSetItemCd(gridRows) {
    let itemMstIdArr = [];
    let itemScopeIdArr = [];
    let itemCdArr = [];
    let itemNmArr = [];
    let itemLvNmArr = [];
    let itemTpNmArr = [];

    gridRows.forEach(function (row) {
      itemMstIdArr.push(row.ITEM_MST_ID);
      itemScopeIdArr.push(row.ITEM_SCOPE_ID);
      itemCdArr.push(row.ITEM_CD);
      itemNmArr.push(row.ITEM_NM);
      itemLvNmArr.push(row.ITEM_LV_NM);
      itemTpNmArr.push(row.ITEM_TP);
    });

    setItemMstId(itemMstIdArr.join('|'));
    setItemScopeId(itemScopeIdArr.join('|'));
    setValue('itemCode', itemCdArr.join('|'));
    setValue('itemName', itemNmArr.join('|'));
    setValue('itemLevel', itemLvNmArr.join('|'));
    setValue('itemType', itemTpNmArr.join('|'));
  }

  function openCurrencyPopup() {
    setCurrencyPopupOpen(true);
  }

  function onSetCurcy(gridRow) {
    setCurcyCd(gridRow.ID);
    setValue('currencyName', gridRow.COMN_CD);
  }

  function setCode() {
    let dataArr = [];
    let rstArr = [];
    let comboArr = [];
    let param = new URLSearchParams();
    param.append('CODE', 'BOM_ITEM_TYPE, PROCUREMENT_TYPE, CM_ITEM_SPIM, UOM, CM_BASE_INV_POLICY, PUSH_TP, ALTERNATE_PUSH_POLICY');

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_CM_CODE',
      data: param
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          dataArr = [];
          rstArr = [];
          dataArr = res.data.RESULT_DATA;

          comboArr = dataArr.filter(code => code.GROUP == 'BOM_ITEM_TYPE');

          for (var i = 0, len = comboArr.length; i < len; i++) {
            var row = comboArr[i];
            if (row !== null) {
              var listObj = { value: row.ID, label: transLangKey(row.CD_NM) };
              rstArr.push(listObj);
            }
          }
          setOption1(rstArr);
          setValue('bomItemTypeId', rstArr[0].value);

          rstArr = [];
          comboArr = [];
          comboArr = dataArr.filter(code => code.GROUP == 'PROCUREMENT_TYPE');

          for (var i = 0, len = comboArr.length; i < len; i++) {
            var row = comboArr[i];
            if (row !== null) {
              var listObj = { value: row.ID, label: transLangKey(row.CD_NM) };
              rstArr.push(listObj);
            }
          }
          setOption2(rstArr);
          setValue('procureTypeId', rstArr[0].value);

          rstArr = [];
          comboArr = [];
          comboArr = dataArr.filter(code => code.GROUP == 'CM_ITEM_SPIM');

          for (var i = 0, len = comboArr.length; i < len; i++) {
            var row = comboArr[i];
            if (row !== null) {
              var listObj = { value: row.ID, label: transLangKey(row.CD_NM) };
              rstArr.push(listObj);
            }
          }
          setOption3(rstArr);

          rstArr = [];
          comboArr = [];
          comboArr = dataArr.filter(code => code.GROUP == 'UOM');

          for (var i = 0, len = comboArr.length; i < len; i++) {
            var row = comboArr[i];
            if (row !== null) {
              var listObj = { value: row.ID, label: transLangKey(row.CD_NM) };
              rstArr.push(listObj);
            }
          }
          setOption4(rstArr);
          setValue('uomCode', rstArr[0].value);

          rstArr = [];
          comboArr = [];
          comboArr = dataArr.filter(code => code.GROUP == 'CM_BASE_INV_POLICY');

          for (var i = 0, len = comboArr.length; i < len; i++) {
            var row = comboArr[i];
            if (row !== null) {
              var listObj = { value: row.ID, label: transLangKey(row.CD_NM) };
              rstArr.push(listObj);
            }
          }
          setOption5(rstArr);
          setValue('stockPolicy', rstArr[0].value);

          rstArr = [];
          comboArr = [];
          comboArr = dataArr.filter(code => code.GROUP == 'PUSH_TP');

          for (var i = 0, len = comboArr.length; i < len; i++) {
            var row = comboArr[i];
            if (row !== null) {
              var listObj = { value: row.ID, label: transLangKey(row.CD_NM) };
              rstArr.push(listObj);
            }
          }
          setOption6(rstArr);
          setValue('pushType', rstArr[0].value);

          rstArr = [];
          comboArr = [];
          comboArr = dataArr.filter(code => code.GROUP == 'ALTERNATE_PUSH_POLICY');

          for (var i = 0, len = comboArr.length; i < len; i++) {
            var row = comboArr[i];
            if (row !== null) {
              var listObj = { value: row.ID, label: transLangKey(row.CD_NM) };
              rstArr.push(listObj);
            }
          }
          setOption7(rstArr);
          setValue('alternatePushPolicy', rstArr[0].value);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function onError(errors, e) {
    if (typeof errors !== 'undefined' && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  function saveSubmit() {
    let formData = new FormData();

    formData.append('LOC_MGMT_ID', locatMgmtId);
    formData.append('ITEM_MST_ID', itemMstId);
    formData.append('ITEM_SCOPE_ID', itemScopeId);
    formData.append('BOM_ITEM_TP_ID', getValues('bomItemTypeId'));
    formData.append('PROCUR_TP_ID', getValues('procureTypeId'));
    if (getValues('differentiationClassId') != '') {
      formData.append('DIFFTD_CLSS_ID', getValues('differentiationClassId'));
    }
    if (getValues('minOrderSize') != '') {
      formData.append('MIN_ORDER_SIZE', getValues('minOrderSize'));
    }
    if (getValues('maxOrderSize') != '') {
      formData.append('MAX_ORDER_SIZE', getValues('maxOrderSize'));
    }
    formData.append('UOM_CD', getValues('uomCode'));
    if (curcyCd != '') {
      formData.append('CURCY_CD', curcyCd);
    }
    formData.append('ALLOWED_HOLIDAY_YN', getValues('allowedHolidy').join('') === 'Y' ? 'true' : 'false');
    formData.append('ACTV_YN', getValues('active').join('') === 'Y' ? 'true' : 'false');
    if (getValues('SRA') != null) {
      formData.append('SRA', getValues('SRA').format('yyyy-MM-ddT00:00:00'));
    }
    if (getValues('EOP') != null) {
      formData.append('EOP', getValues('EOP').format('yyyy-MM-ddT00:00:00'));
    }
    if (getValues('parentItemSOL') != null) {
      formData.append('PARENT_ITEM_EOL', getValues('parentItemSOL').format('yyyy-MM-ddT00:00:00'));
    }
    formData.append('STOCK_ONHAND_YN', getValues('stockOnHand').join('') === 'Y' ? 'true' : 'false');
    formData.append('IMMEDIATE_SHIPMENT_YN', getValues('immediateShipment').join('') === 'Y' ? 'true' : 'false');
    formData.append('STOCK_POLICY', getValues('stockPolicy'));
    if (getValues('standardPrice') != '') {
      formData.append('STD_UTPIC', getValues('standardPrice'));
    }
    if (getValues('minLv') != '') {
      formData.append('MIN_LV', getValues('minLv'));
    }
    if (getValues('maxLv') != '') {
      formData.append('MAX_LV', getValues('maxLv'));
    }
    formData.append('ALLOWED_PUSH_YN', getValues('allowedPush').join('') === 'Y' ? 'true' : 'false');
    formData.append('PUSH_TP_ID', getValues('pushType'));
    formData.append('ALTERNATE_PUSH_POLICY_ID', getValues('alternatePushPolicy'));
    if (getValues('directCost') != '') {
      formData.append('DIRECT_COST', getValues('directCost'));
    }
    if (getValues('indirectCost') != '') {
      formData.append('INDIRECT_COST', getValues('indirectCost'));
    }
    formData.append('USER_ID', username);
    formData.append('timeout', 0);
    formData.append('CURRENT_OPERATION_CALL_ID', 'OPC_POP_UI_CM_04_01_WINDOW_01_CPT_36_01_CLICK_02');

    zAxios.post(baseURI() + 'engine/mp/SRV_UI_CM_04_S2', formData)
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          const rsData = res.data;
          if (rsData.RESULT_SUCCESS) {
            const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_04_S2_P_RT_MSG;
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

  return (
    <>
      <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="POP_UI_CM_04_01" resizeHeight={700} resizeWidth={550}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={tabChange} indicatorColor="primary">
            <Tab label={transLangKey("COMM")} value="tabCommon" />
            <Tab label={transLangKey("NPI/EOL")} value="tabNpiEol" />
            <Tab label={transLangKey("STOCK")} value="tabStock" />
            <Tab label={transLangKey("PRODTY_COST")} value="tabProdCost" />
          </Tabs>
        </Box>

        <Box style={{ marginTop: "3px", width: "100%", height: "100%" }}>
          <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "tabCommon" ? "block" : "none" }}>
            <Box style={{ height: "100%" }}>
              <InputField type="action" name="locationTypeName" label={transLangKey("LOCAT_TP_NM")} title={transLangKey("SEARCH")} onClick={openLocatTpPopup} control={control} readonly={true}>
                <Icon.Search />
              </InputField>
              <InputField name="locationLevel" label={transLangKey("LOCAT_LV")} control={control} readonly={true} wrayStyle={{ width: "400px" }} labelStyle={{ width: "200px", maxWidth: "200px" }} />
              <InputField name="locationCode" label={transLangKey("LOCAT_CD")} control={control} readonly={true} wrayStyle={{ width: "400px" }} labelStyle={{ width: "200px", maxWidth: "200px" }} />
              <InputField name="locationName" label={transLangKey("LOCAT_NM")} control={control} readonly={true} wrayStyle={{ width: "400px" }} labelStyle={{ width: "200px", maxWidth: "200px" }} />
              <InputField type="action" name="itemCode" label={transLangKey("ITEM_CD")} title={transLangKey("SEARCH")} onClick={openItemLvPopup} control={control} readonly={true}>
                <Icon.Search />
              </InputField>
              <InputField name="itemName" label={transLangKey("ITEM_NM")} control={control} readonly={true} wrayStyle={{ width: "400px" }} labelStyle={{ width: "200px", maxWidth: "200px" }} />
              <InputField name="itemDescription" label={transLangKey("ITEM_DESCRIP")} control={control} readonly={true} wrayStyle={{ width: "400px" }} labelStyle={{ width: "200px", maxWidth: "200px" }} />
              <InputField name="itemLevel" label={transLangKey("ITEM_LV")} control={control} readonly={true} wrayStyle={{ width: "400px" }} labelStyle={{ width: "200px", maxWidth: "200px" }} />
              <InputField name="itemType" label={transLangKey("ITEM_TP")} control={control} readonly={true} wrayStyle={{ width: "400px" }} labelStyle={{ width: "200px", maxWidth: "200px" }} />
              <InputField type="select" name="bomItemTypeId" label={transLangKey("BOD_TYPE")} control={control} disabled={false} options={option1} wrayStyle={{ width: "400px" }} labelStyle={{ width: "172px", maxWidth: "200px" }} />
              <InputField type="select" name="procureTypeId" label={transLangKey("PROCUR_TP")} control={control} disabled={false} options={option2} wrayStyle={{ width: "400px" }} labelStyle={{ width: "172px", maxWidth: "200px" }} />
              <InputField type="select" name="differentiationClassId" label={transLangKey("DIF_GRADE")} control={control} disabled={false} options={option3} wrayStyle={{ width: "400px" }} labelStyle={{ width: "172px", maxWidth: "200px" }} />
              <InputField name="minOrderSize" label={transLangKey("MIN_ORDER_SIZE")} control={control} dataType="number" wrayStyle={{ width: "400px" }} labelStyle={{ width: "200px", maxWidth: "200px" }} />
              <InputField name="maxOrderSize" label={transLangKey("MAX_ORDER_SIZE")} control={control} dataType="number" wrayStyle={{ width: "400px" }} labelStyle={{ width: "200px", maxWidth: "200px" }} />
              <InputField type="select" name="uomCode" label={transLangKey("UOM_NM")} control={control} disabled={false} options={option4} wrayStyle={{ width: "400px" }} labelStyle={{ width: "172px", maxWidth: "200px" }} />
              <InputField type="action" name="currencyName" label={transLangKey("CURCY_NM")} title={transLangKey("SEARCH")} onClick={openCurrencyPopup} control={control}>
                <Icon.Search />
              </InputField>
              <InputField type="check" name="allowedHolidy" control={control} options={[{ label: transLangKey("ALLOWED_HOLIDAY_YN"), value: "Y" }]} wrayStyle={{ width: "400px" }} labelStyle={{ width: "172px", maxWidth: "200px" }} />
              <InputField type="check" name="active" control={control} options={[{ label: transLangKey("ACTV_YN"), value: "Y" }]} wrayStyle={{ width: "400px" }} labelStyle={{ width: "172px", maxWidth: "200px" }} />
            </Box>
          </Box>
          <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "tabNpiEol" ? "block" : "none" }}>
            <Box style={{ height: "100%" }}>
              <InputField type="datetime" name="SRA" label={transLangKey("SRA")} dateformat="yyyy-MM-dd" control={control} wrayStyle={{ width: "400px" }} labelStyle={{ width: "172px", maxWidth: "200px" }} />
              <InputField type="datetime" name="RTS" label={transLangKey("RTS")} dateformat="yyyy-MM-dd" control={control} readonly={true} wrayStyle={{ width: "400px" }} labelStyle={{ width: "172px", maxWidth: "200px" }} />
              <InputField type="datetime" name="EOP" label={transLangKey("EOP")} dateformat="yyyy-MM-dd" control={control} wrayStyle={{ width: "400px" }} labelStyle={{ width: "172px", maxWidth: "200px" }} />
              <InputField type="datetime" name="EOS" label={transLangKey("EOS")} dateformat="yyyy-MM-dd" control={control} readonly={true} wrayStyle={{ width: "400px" }} labelStyle={{ width: "172px", maxWidth: "200px" }} />
              <InputField type="datetime" name="parentItemSOL" label={transLangKey("PARENT_ITEM_EOL")} dateformat="yyyy-MM-dd" control={control} wrayStyle={{ width: "400px" }} labelStyle={{ width: "172px", maxWidth: "200px" }} />
            </Box>
          </Box>
          <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "tabStock" ? "block" : "none" }}>
            <Box style={{ height: "100%" }}>
              <InputField type="check" name="stockOnHand" control={control} options={[{ label: transLangKey("STOCK_ONHAND_YN"), value: "Y" }]} wrayStyle={{ width: "400px" }} labelStyle={{ width: "172px", maxWidth: "200px" }} />
              <InputField type="check" name="immediateShipment" control={control} options={[{ label: transLangKey("IMMEDIATE_SHIPMENT_YN"), value: "Y" }]} wrayStyle={{ width: "400px" }} labelStyle={{ width: "172px", maxWidth: "200px" }} />
              <InputField type="select" name="stockPolicy" label={transLangKey("STOCK_POLICY")} control={control} disabled={false} options={option5} wrayStyle={{ width: "400px" }} labelStyle={{ width: "172px", maxWidth: "200px" }} />
              <InputField name="standardPrice" label={transLangKey("STD_UTPIC")} control={control} dataType="number" wrayStyle={{ width: "400px" }} labelStyle={{ width: "200px", maxWidth: "200px" }} />
              <InputField name="minLv" label={transLangKey("MIN_LV")} control={control} dataType="number" wrayStyle={{ width: "400px" }} labelStyle={{ width: "200px", maxWidth: "200px" }} />
              <InputField name="maxLv" label={transLangKey("MAX_LV")} control={control} dataType="number" wrayStyle={{ width: "400px" }} labelStyle={{ width: "200px", maxWidth: "200px" }} />
              <InputField type="check" name="allowedPush" control={control} options={[{ label: transLangKey("ALLOWED_PUSH_YN"), value: "Y" }]} wrayStyle={{ width: "400px" }} labelStyle={{ width: "172px", maxWidth: "200px" }} />
              <InputField type="select" name="pushType" label={transLangKey("PUSH_TP")} control={control} disabled={false} options={option6} wrayStyle={{ width: "400px" }} labelStyle={{ width: "172px", maxWidth: "200px" }} />
              <InputField type="select" name="alternatePushPolicy" label={transLangKey("ALTERNATE_PUSH_POLICY")} control={control} disabled={false} options={option7} wrayStyle={{ width: "400px" }} labelStyle={{ width: "172px", maxWidth: "200px" }} />
            </Box>
          </Box>
          <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "tabProdCost" ? "block" : "none" }}>
            <Box style={{ height: "100%" }}>
              <InputField name="directCost" label={transLangKey("DIRECT_COST")} control={control} dataType="number" wrayStyle={{ width: "400px" }} labelStyle={{ width: "200px", maxWidth: "200px" }} />
              <InputField name="indirectCost" label={transLangKey("INDIRECT_COST")} control={control} dataType="number" wrayStyle={{ width: "400px" }} labelStyle={{ width: "200px", maxWidth: "200px" }} />
            </Box>
          </Box>
        </Box>
        <PopLocatTp id="popLocatTp" open={locatTpPopupOpen} onClose={() => { setLocatTpPopupOpen(false) }} confirm={onSetConsumeLocatTp}></PopLocatTp>
        <PopCommItemLv id="popLocatTp" open={itemLvPopupOpen} onClose={() => { setItemLvPopupOpen(false) }} confirm={onSetItemCd}></PopCommItemLv>
        <PopCurcy id="popLocatTp" open={currencyPopupOpen} onClose={() => { setCurrencyPopupOpen(false) }} confirm={onSetCurcy}></PopCurcy>
      </PopupDialog>
    </>
  );
}

export default PopSiteItemNew;
