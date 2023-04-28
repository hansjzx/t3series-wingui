import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box, IconButton, Tab, Tabs } from '@mui/material';
import { InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import PopLocatTp from '@wingui/view/common/PopLocatTp';
import PopCurcy from '../common/PopCurcy';

const wrapStyle = {width: "400px"};
const labelStyle = {width: "172px", maxWidth: "200px"};

function PopSiteItemBatchUpdate(props) {
  const [username] = useUserStore(state => [state.username]);
  const { reset, handleSubmit, watch, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      attribute01: '',
      attribute11: '',
      attribute02: '',
      attribute12: '',
      attribute03: '',
      attribute13: '',
      attribute04: '',
      attribute14: '',
      attribute05: '',
      attribute15: '',
      attribute06: '',
      attribute16: '',
      attribute07: '',
      attribute17: '',
      attribute08: '',
      attribute18: '',
      attribute09: '',
      attribute19: '',
      attribute10: '',
      attribute20: '',
      applyAllLocation: [],
      locationTypeCode: 'LOCAT_MST',
      locationTypeName: '',
      locationLevel: '',
      locationCode: '',
      locationName: '',
      itemTypeId: '',
      applyDifferentiationClassId: [],
      differentiationClassId: '',
      applyMinOrderSize: [],
      minOrderSize: '',
      applyMaxOrderSize: [],
      maxOrderSize: '',
      applyUomId: [],
      uomId: '',
      applyCurrencyCodeId: [],
      currencyName: '',
      applyAllowedHoliday: [],
      allowedHoliday: [],
      applyActive: [],
      active: [],
      applySRA: [],
      SRA: '',
      applyRTS: [],
      RTS: '',
      applyEOP: [],
      EOP: '',
      applyEOS: [],
      EOS: '',
      applyParentItemEOL: [],
      parentItemEOL: '',
      applyInventoryOnHand: [],
      inventoryOnHand: [],
      applyImmediateShipment: [],
      immediateShipment: [],
      applyInventoryPolicyId: [],
      inventoryPolicyId: '',
      applyStandardPrice: [],
      standardPrice: '',
      applyDirectCost: [],
      directCost: '',
      applyIndirectCost: [],
      indirectCost: ''
    }
  });

  const options1 = [{ label: transLangKey('LOCAT_TP_NM'), value: 'LOCAT_MST' }, { label: transLangKey('LOCAT_CD'), value: 'LOCAT_DTL' }];

  const [option1, setOption1] = useState([]);
  const [option2, setOption2] = useState([]);
  const [option3, setOption3] = useState([]);
  const [option4, setOption4] = useState([]);
  const [option5, setOption5] = useState([]);
  const [option6, setOption6] = useState([]);
  const [option7, setOption7] = useState([]);
  const [option8, setOption8] = useState([]);
  const [option9, setOption9] = useState([]);
  const [option10, setOption10] = useState([]);
  const [option11, setOption11] = useState([]);
  const [option12, setOption12] = useState([]);
  const [option13, setOption13] = useState([]);
  const [option14, setOption14] = useState([]);
  const [option15, setOption15] = useState([]);
  const [option16, setOption16] = useState([]);
  const [option17, setOption17] = useState([]);
  const [option18, setOption18] = useState([]);
  const [option19, setOption19] = useState([]);
  const [option20, setOption20] = useState([]);
  const [option21, setOption21] = useState([]);
  const [option22, setOption22] = useState([]);
  const [option23, setOption23] = useState([]);
  const [option24, setOption24] = useState([]);

  const [locatTpCdDisabled, setLocatTpCdDisabled] = useState(true);
  const [locatTpDisabled, setLocatTpDisabled] = useState(true);
  const [locatCdDisabled, setLocatCdDisabled] = useState(true);

  const [locatMstId, setLocatMstId] = useState('');
  const [curcyCd, setCurcyCd] = useState('');
  const [locatTpPopupOpen, setLocatTpPopupOpen] = useState(false);
  const [locatCdPopupOpen, setLocatCdPopupOpen] = useState(false);
  const [currencyPopupOpen, setCurrencyPopupOpen] = useState(false);
  const [tabValue, setTabValue] = React.useState('tabItemAttr');

  useEffect(() => {
    async function initLoad() {
      await setCode();
    }

    initLoad();
  }, []);

  useEffect(() => {
    if (getValues('applyAllLocation')[0] === 'Y') {
      setValue('locationTypeName', '');
      setValue('locationLevel', '');
      setValue('locationCode', '');
      setValue('locationName', '');
      setLocatTpCdDisabled(true);
      setLocatTpDisabled(true);
      setLocatCdDisabled(true);
    } else {
      setLocatTpCdDisabled(false);
      if (getValues('locationTypeCode') == 'LOCAT_MST') {
        setLocatTpDisabled(false);
        setLocatCdDisabled(true);
      } else if (getValues('locationTypeCode') == 'LOCAT_DTL') {
        setLocatTpDisabled(true);
        setLocatCdDisabled(false);
      }
    }
  }, [watch('applyAllLocation')]);

  useEffect(() => {
    if (getValues('locationTypeCode') == 'LOCAT_MST') {
      setValue('locationCode', '');
      setValue('locationName', '');
      setLocatTpDisabled(false);
      setLocatCdDisabled(true);
    } else if (getValues('locationTypeCode') == 'LOCAT_DTL') {
      setValue('locationTypeName', '');
      setValue('locationLevel', '');
      setLocatTpDisabled(true);
      setLocatCdDisabled(false);
    }
  }, [watch('locationTypeCode')]);

  const tabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  function refresh() {
    reset();
    setLocatMstId('');
    setCurcyCd('');
    setCode();
  }

  function openLocatTpPopup() {
    setLocatTpPopupOpen(true);
  }

  function onSetLocatTp(gridRow) {
    setLocatMstId(gridRow.LOCAT_MST_ID);
    setValue('locationTypeName', gridRow.LOCAT_TP_NM);
    setValue('locationLevel', gridRow.LOCAT_LV);
  }

  function openLocatCdPopup() {
    setLocatCdPopupOpen(true);
  }

  function onSetLocatCd(gridRow) {
    setLocatMstId(gridRow.LOCAT_MST_ID);
    setValue('locationCode', gridRow.LOCAT_CD);
    setValue('locationName', gridRow.LOCAT_NM);
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
    let codeArr = [];
    let rstArr = [];
    let param = new URLSearchParams();
    param.append('CODE', 'ATTR_01, ATTR_02, ATTR_03, ATTR_04, ATTR_05, ATTR_06, ATTR_07, ATTR_08, ATTR_09, ATTR_10, ATTR_11, ATTR_12, ATTR_13, ATTR_14, ATTR_15, ATTR_16, ATTR_17, ATTR_18, ATTR_19, ATTR_20, CM_ITEM_SPIM, UOM, CM_BASE_INV_POLICY, ITEM_TYPE, ALL');

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_CM_CODE',
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        dataArr = [];
        dataArr = res.data.RESULT_DATA;

        rstArr = [];
        codeArr = dataArr.filter(code => code.GROUP == 'ATTR_01');

        for (var i = 0, len = codeArr.length; i < len; i++) {
          var row = codeArr[i];
          if (row !== null) {
            var listObj = {value: row.CD, label: transLangKey(row.CD_NM)};
            rstArr.push(listObj);
          }
        }
        setOption1(rstArr);
        setValue('attribute01', 'NOTAPPLY');

        rstArr = [];
        codeArr = dataArr.filter(code => code.GROUP == 'ATTR_02');

        for (var i = 0, len = codeArr.length; i < len; i++) {
          var row = codeArr[i];
          if (row !== null) {
            var listObj = {value: row.CD, label: transLangKey(row.CD_NM)};
            rstArr.push(listObj);
          }
        }
        setOption2(rstArr);
        setValue('attribute02', 'NOTAPPLY');

        rstArr = [];
        codeArr = dataArr.filter(code => code.GROUP == 'ATTR_03');

        for (var i = 0, len = codeArr.length; i < len; i++) {
          var row = codeArr[i];
          if (row !== null) {
            var listObj = {value: row.CD, label: transLangKey(row.CD_NM)};
            rstArr.push(listObj);
          }
        }
        setOption3(rstArr);
        setValue('attribute03', 'NOTAPPLY');

        rstArr = [];
        codeArr = dataArr.filter(code => code.GROUP == 'ATTR_04');

        for (var i = 0, len = codeArr.length; i < len; i++) {
          var row = codeArr[i];
          if (row !== null) {
            var listObj = {value: row.CD, label: transLangKey(row.CD_NM)};
            rstArr.push(listObj);
          }
        }
        setOption4(rstArr);
        setValue('attribute04', 'NOTAPPLY');

        rstArr = [];
        codeArr = dataArr.filter(code => code.GROUP == 'ATTR_05');

        for (var i = 0, len = codeArr.length; i < len; i++) {
          var row = codeArr[i];
          if (row !== null) {
            var listObj = {value: row.CD, label: transLangKey(row.CD_NM)};
            rstArr.push(listObj);
          }
        }
        setOption5(rstArr);
        setValue('attribute05', 'NOTAPPLY');

        rstArr = [];
        codeArr = dataArr.filter(code => code.GROUP == 'ATTR_06');

        for (var i = 0, len = codeArr.length; i < len; i++) {
          var row = codeArr[i];
          if (row !== null) {
            var listObj = {value: row.CD, label: transLangKey(row.CD_NM)};
            rstArr.push(listObj);
          }
        }
        setOption6(rstArr);
        setValue('attribute06', 'NOTAPPLY');

        rstArr = [];
        codeArr = dataArr.filter(code => code.GROUP == 'ATTR_07');

        for (var i = 0, len = codeArr.length; i < len; i++) {
          var row = codeArr[i];
          if (row !== null) {
            var listObj = {value: row.CD, label: transLangKey(row.CD_NM)};
            rstArr.push(listObj);
          }
        }
        setOption7(rstArr);
        setValue('attribute07', 'NOTAPPLY');

        rstArr = [];
        codeArr = dataArr.filter(code => code.GROUP == 'ATTR_08');

        for (var i = 0, len = codeArr.length; i < len; i++) {
          var row = codeArr[i];
          if (row !== null) {
            var listObj = {value: row.CD, label: transLangKey(row.CD_NM)};
            rstArr.push(listObj);
          }
        }
        setOption8(rstArr);
        setValue('attribute08', 'NOTAPPLY');

        rstArr = [];
        codeArr = dataArr.filter(code => code.GROUP == 'ATTR_09');

        for (var i = 0, len = codeArr.length; i < len; i++) {
          var row = codeArr[i];
          if (row !== null) {
            var listObj = {value: row.CD, label: transLangKey(row.CD_NM)};
            rstArr.push(listObj);
          }
        }
        setOption9(rstArr);
        setValue('attribute09', 'NOTAPPLY');

        rstArr = [];
        codeArr = dataArr.filter(code => code.GROUP == 'ATTR_10');

        for (var i = 0, len = codeArr.length; i < len; i++) {
          var row = codeArr[i];
          if (row !== null) {
            var listObj = {value: row.CD, label: transLangKey(row.CD_NM)};
            rstArr.push(listObj);
          }
        }
        setOption10(rstArr);
        setValue('attribute10', 'NOTAPPLY');

        rstArr = [];
        codeArr = dataArr.filter(code => code.GROUP == 'ATTR_11');

        for (var i = 0, len = codeArr.length; i < len; i++) {
          var row = codeArr[i];
          if (row !== null) {
            var listObj = {value: row.CD, label: transLangKey(row.CD_NM)};
            rstArr.push(listObj);
          }
        }
        setOption11(rstArr);
        setValue('attribute11', 'NOTAPPLY');

        rstArr = [];
        codeArr = dataArr.filter(code => code.GROUP == 'ATTR_12');

        for (var i = 0, len = codeArr.length; i < len; i++) {
          var row = codeArr[i];
          if (row !== null) {
            var listObj = {value: row.CD, label: transLangKey(row.CD_NM)};
            rstArr.push(listObj);
          }
        }
        setOption12(rstArr);
        setValue('attribute12', 'NOTAPPLY');

        rstArr = [];
        codeArr = dataArr.filter(code => code.GROUP == 'ATTR_13');

        for (var i = 0, len = codeArr.length; i < len; i++) {
          var row = codeArr[i];
          if (row !== null) {
            var listObj = {value: row.CD, label: transLangKey(row.CD_NM)};
            rstArr.push(listObj);
          }
        }
        setOption13(rstArr);
        setValue('attribute13', 'NOTAPPLY');

        rstArr = [];
        codeArr = dataArr.filter(code => code.GROUP == 'ATTR_14');

        for (var i = 0, len = codeArr.length; i < len; i++) {
          var row = codeArr[i];
          if (row !== null) {
            var listObj = {value: row.CD, label: transLangKey(row.CD_NM)};
            rstArr.push(listObj);
          }
        }
        setOption14(rstArr);
        setValue('attribute14', 'NOTAPPLY');

        rstArr = [];
        codeArr = dataArr.filter(code => code.GROUP == 'ATTR_15');

        for (var i = 0, len = codeArr.length; i < len; i++) {
          var row = codeArr[i];
          if (row !== null) {
            var listObj = {value: row.CD, label: transLangKey(row.CD_NM)};
            rstArr.push(listObj);
          }
        }
        setOption15(rstArr);
        setValue('attribute15', 'NOTAPPLY');

        rstArr = [];
        codeArr = dataArr.filter(code => code.GROUP == 'ATTR_16');

        for (var i = 0, len = codeArr.length; i < len; i++) {
          var row = codeArr[i];
          if (row !== null) {
            var listObj = {value: row.CD, label: transLangKey(row.CD_NM)};
            rstArr.push(listObj);
          }
        }
        setOption16(rstArr);
        setValue('attribute16', 'NOTAPPLY');

        rstArr = [];
        codeArr = dataArr.filter(code => code.GROUP == 'ATTR_17');

        for (var i = 0, len = codeArr.length; i < len; i++) {
          var row = codeArr[i];
          if (row !== null) {
            var listObj = {value: row.CD, label: transLangKey(row.CD_NM)};
            rstArr.push(listObj);
          }
        }
        setOption17(rstArr);
        setValue('attribute17', 'NOTAPPLY');

        rstArr = [];
        codeArr = dataArr.filter(code => code.GROUP == 'ATTR_18');

        for (var i = 0, len = codeArr.length; i < len; i++) {
          var row = codeArr[i];
          if (row !== null) {
            var listObj = {value: row.CD, label: transLangKey(row.CD_NM)};
            rstArr.push(listObj);
          }
        }
        setOption18(rstArr);
        setValue('attribute18', 'NOTAPPLY');

        rstArr = [];
        codeArr = dataArr.filter(code => code.GROUP == 'ATTR_19');

        for (var i = 0, len = codeArr.length; i < len; i++) {
          var row = codeArr[i];
          if (row !== null) {
            var listObj = {value: row.CD, label: transLangKey(row.CD_NM)};
            rstArr.push(listObj);
          }
        }
        setOption19(rstArr);
        setValue('attribute19', 'NOTAPPLY');

        rstArr = [];
        codeArr = dataArr.filter(code => code.GROUP == 'ATTR_20');

        for (var i = 0, len = codeArr.length; i < len; i++) {
          var row = codeArr[i];
          if (row !== null) {
            var listObj = {value: row.CD, label: transLangKey(row.CD_NM)};
            rstArr.push(listObj);
          }
        }
        setOption20(rstArr);
        setValue('attribute20', 'NOTAPPLY');

        rstArr = [];
        codeArr = dataArr.filter(code => code.GROUP == 'ITEM_TYPE' || code.GROUP == 'ALL');

        for (var i = 0, len = codeArr.length; i < len; i++) {
          var row = codeArr[i];
          if (row !== null) {
            if (row.ID == null) {
              var listObj = {value: 'ALL', label: transLangKey(row.CD_NM)};
            }else{
              var listObj = {value: row.ID, label: transLangKey(row.CD_NM)};
            }
            rstArr.push(listObj);
          }
        }
        setOption21(rstArr);
        setValue('itemTypeId', rstArr[0].value);

        rstArr = [];
        codeArr = dataArr.filter(code => code.GROUP == 'CM_ITEM_SPIM');

        for (var i = 0, len = codeArr.length; i < len; i++) {
          var row = codeArr[i];
          if (row !== null) {
            var listObj = {value: row.ID, label: transLangKey(row.CD_NM)};
            rstArr.push(listObj);
          }
        }
        setOption22(rstArr);

        rstArr = [];
        codeArr = dataArr.filter(code => code.GROUP == 'UOM');

        for (var i = 0, len = codeArr.length; i < len; i++) {
          var row = codeArr[i];
          if (row !== null) {
            var listObj = {value: row.ID, label: transLangKey(row.CD_NM)};
            rstArr.push(listObj);
          }
        }
        setOption23(rstArr);

        rstArr = [];
        codeArr = dataArr.filter(code => code.GROUP == 'CM_BASE_INV_POLICY');

        for (var i = 0, len = codeArr.length; i < len; i++) {
          var row = codeArr[i];
          if (row !== null) {
            var listObj = {value: row.ID, label: transLangKey(row.CD_NM)};
            rstArr.push(listObj);
          }
        }
        setOption24(rstArr);
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

    formData.append('ATTR_01', getValues('attribute01'));
    formData.append('ATTR_02', getValues('attribute02'));
    formData.append('ATTR_03', getValues('attribute03'));
    formData.append('ATTR_04', getValues('attribute04'));
    formData.append('ATTR_05', getValues('attribute05'));
    formData.append('ATTR_06', getValues('attribute06'));
    formData.append('ATTR_07', getValues('attribute07'));
    formData.append('ATTR_08', getValues('attribute08'));
    formData.append('ATTR_09', getValues('attribute09'));
    formData.append('ATTR_10', getValues('attribute10'));
    formData.append('ATTR_11', getValues('attribute11'));
    formData.append('ATTR_12', getValues('attribute12'));
    formData.append('ATTR_13', getValues('attribute13'));
    formData.append('ATTR_14', getValues('attribute14'));
    formData.append('ATTR_15', getValues('attribute15'));
    formData.append('ATTR_16', getValues('attribute16'));
    formData.append('ATTR_17', getValues('attribute17'));
    formData.append('ATTR_18', getValues('attribute18'));
    formData.append('ATTR_19', getValues('attribute19'));
    formData.append('ATTR_20', getValues('attribute20'));
    formData.append('ALL_LOCAT_YN', getValues('applyAllLocation').join('') === 'Y' ? 'true' : 'false');
    formData.append('LOCAT_TP_CD', getValues('locationTypeCode'));
    formData.append('LOCAT_MST_ID', locatMstId);
    formData.append('ITEM_TP_ID', getValues('itemTypeId'));
    formData.append('DIFFTD_CLSS_ID', getValues('differentiationClassId'));
    formData.append('SRA', getValues('SRA'));
    formData.append('RTS', getValues('RTS'));
    formData.append('EOP', getValues('EOP'));
    formData.append('EOS', getValues('EOS'));
    formData.append('PARENT_ITEM_EOL', getValues('parentItemEOL'));
    formData.append('INV_ONHAND_YN', getValues('inventoryOnHand').join('') === 'Y' ? 'true' : 'false');
    formData.append('IMMEDIATE_SHIPMENT_YN', getValues('immediateShipment').join('') === 'Y' ? 'true' : 'false');
    formData.append('INV_POLICY_ID', getValues('inventoryPolicyId'));
    if (getValues('standardPrice') != '') {
      formData.append('STD_UTPIC', getValues('standardPrice'));
    }
    formData.append('CURCY_CD_ID', curcyCd);
    formData.append('UOM_ID', getValues('uomId'));
    formData.append('ALLOWED_HOLIDAY_YN', getValues('allowedHoliday').join('') === 'Y' ? 'true' : 'false');
    formData.append('ACTV_YN', getValues('active').join('') === 'Y' ? 'true' : 'false');

    if (getValues('directCost') != '') {
      formData.append('DIRECT_COST', getValues('directCost'));
    }
    if (getValues('indirectCost') != '') {
      formData.append('INDIRECT_COST', getValues('indirectCost'));
    }
    if (getValues('minOrderSize') != '') {
      formData.append('MIN_ORDER_SIZE', getValues('minOrderSize'));
    }
    if (getValues('maxOrderSize') != '') {
      formData.append('MAX_ORDER_SIZE', getValues('maxOrderSize'));
    }
    formData.append('APY_DIFFTD_CLSS_ID', getValues('applyDifferentiationClassId').join('') === 'Y' ? 'true' : 'false');
    formData.append('APY_SRA', getValues('applySRA').join('') === 'Y' ? 'true' : 'false');
    formData.append('APY_RTS', getValues('applyRTS').join('') === 'Y' ? 'true' : 'false');
    formData.append('APY_EOP', getValues('applyEOP').join('') === 'Y' ? 'true' : 'false');
    formData.append('APY_EOS', getValues('applyEOS').join('') === 'Y' ? 'true' : 'false');
    formData.append('APY_PARENT_ITEM_EOL', getValues('applyParentItemEOL').join('') === 'Y' ? 'true' : 'false');
    formData.append('APY_INV_ONHAND_YN', getValues('applyInventoryOnHand').join('') === 'Y' ? 'true' : 'false');
    formData.append('APY_IMMEDIATE_SHIPMENT_YN', getValues('applyImmediateShipment').join('') === 'Y' ? 'true' : 'false');
    formData.append('APY_INV_POLICY_ID', getValues('applyInventoryPolicyId').join('') === 'Y' ? 'true' : 'false');
    formData.append('APY_STD_UTPIC', getValues('applyStandardPrice').join('') === 'Y' ? 'true' : 'false');
    formData.append('APY_CURCY_CD_ID', getValues('applyCurrencyCodeId').join('') === 'Y' ? 'true' : 'false');
    formData.append('APY_UOM_ID', getValues('applyUomId').join('') === 'Y' ? 'true' : 'false');
    formData.append('APY_ALLOWED_HOLIDAY_YN', getValues('applyAllowedHoliday').join('') === 'Y' ? 'true' : 'false');
    formData.append('APY_ACTV_YN', getValues('applyActive').join('') === 'Y' ? 'true' : 'false');
    formData.append('APY_DIRECT_COST', getValues('applyDirectCost').join('') === 'Y' ? 'true' : 'false');
    formData.append('APY_INDIRECT_COST', getValues('applyIndirectCost').join('') === 'Y' ? 'true' : 'false');
    formData.append('APY_MIN_ORDER_SIZE', getValues('applyMinOrderSize').join('') === 'Y' ? 'true' : 'false');
    formData.append('APY_MAX_ORDER_SIZE', getValues('applyMaxOrderSize').join('') === 'Y' ? 'true' : 'false');
    formData.append('USER_ID', username);
    formData.append('timeout', 0);
    formData.append('CURRENT_OPERATION_CALL_ID', 'OPC_POP_UI_CM_04_10_WINDOW_01_CPT_99_01_CLICK_01');

    zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_04_BATCH_UPDATE", formData)
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          const rsData = res.data;
          if (rsData.RESULT_SUCCESS) {
            const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_04_BATCH_UPDATE_P_RT_MSG;
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
      <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="BATCH_UPDATE" resizeHeight={800} resizeWidth={700}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={tabChange} indicatorColor="primary">
            <Tab label={transLangKey("CM_ITEM_ATTR")} value="tabItemAttr" />
            <Tab label={transLangKey("DETAIL")} value="tabDetail" />
            <Tab label={transLangKey("COMM")} value="tabCommon" />
            <Tab label={transLangKey("NPI/EOL")} value="tabNpiEol" />
            <Tab label={transLangKey("STOCK")} value="tabStock" />
            <Tab label={transLangKey("PRODTY_COST")} value="tabProdCost" />
          </Tabs>
        </Box>

        <Box style={{ marginTop: "3px", width: "100%", height: "100%" }}>
          <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "tabItemAttr" ? "block" : "none" }}>
            <Box style={{height:"100%"}}>
              <Box>
                <IconButton onClick={() => { refresh() }}><Icon.RefreshCcw /></IconButton>
              </Box>
              <Box>
                <InputField type="select" name="attribute01" label={transLangKey("ITEM_ATTR_01")} control={control} disabled={false} options={option1} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <InputField type="select" name="attribute11" label={transLangKey("ITEM_ATTR_11")} control={control} disabled={false} options={option11} wrapStyle={wrapStyle} labelStyle={labelStyle} />
              </Box>
              <Box>
                <InputField type="select" name="attribute02" label={transLangKey("ITEM_ATTR_02")} control={control} disabled={false} options={option2} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <InputField type="select" name="attribute12" label={transLangKey("ITEM_ATTR_12")} control={control} disabled={false} options={option12} wrapStyle={wrapStyle} labelStyle={labelStyle} />
              </Box>
              <Box>
                <InputField type="select" name="attribute03" label={transLangKey("ITEM_ATTR_03")} control={control} disabled={false} options={option3} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <InputField type="select" name="attribute13" label={transLangKey("ITEM_ATTR_13")} control={control} disabled={false} options={option13} wrapStyle={wrapStyle} labelStyle={labelStyle} />
              </Box>
              <Box>
                <InputField type="select" name="attribute04" label={transLangKey("ITEM_ATTR_04")} control={control} disabled={false} options={option4} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <InputField type="select" name="attribute14" label={transLangKey("ITEM_ATTR_14")} control={control} disabled={false} options={option14} wrapStyle={wrapStyle} labelStyle={labelStyle} />
              </Box>
              <Box>
                <InputField type="select" name="attribute05" label={transLangKey("ITEM_ATTR_05")} control={control} disabled={false} options={option5} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <InputField type="select" name="attribute15" label={transLangKey("ITEM_ATTR_15")} control={control} disabled={false} options={option15} wrapStyle={wrapStyle} labelStyle={labelStyle} />
              </Box>
              <Box>
                <InputField type="select" name="attribute06" label={transLangKey("ITEM_ATTR_06")} control={control} disabled={false} options={option6} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <InputField type="select" name="attribute16" label={transLangKey("ITEM_ATTR_16")} control={control} disabled={false} options={option16} wrapStyle={wrapStyle} labelStyle={labelStyle} />
              </Box>
              <Box>
                <InputField type="select" name="attribute07" label={transLangKey("ITEM_ATTR_07")} control={control} disabled={false} options={option7} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <InputField type="select" name="attribute17" label={transLangKey("ITEM_ATTR_17")} control={control} disabled={false} options={option17} wrapStyle={wrapStyle} labelStyle={labelStyle} />
              </Box>
              <Box>
                <InputField type="select" name="attribute08" label={transLangKey("ITEM_ATTR_08")} control={control} disabled={false} options={option8} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <InputField type="select" name="attribute18" label={transLangKey("ITEM_ATTR_18")} control={control} disabled={false} options={option18} wrapStyle={wrapStyle} labelStyle={labelStyle} />
              </Box>
              <Box>
                <InputField type="select" name="attribute09" label={transLangKey("ITEM_ATTR_09")} control={control} disabled={false} options={option9} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <InputField type="select" name="attribute19" label={transLangKey("ITEM_ATTR_19")} control={control} disabled={false} options={option19} wrapStyle={wrapStyle} labelStyle={labelStyle} />
              </Box>
              <Box>
                <InputField type="select" name="attribute10" label={transLangKey("ITEM_ATTR_10")} control={control} disabled={false} options={option10} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <InputField type="select" name="attribute20" label={transLangKey("ITEM_ATTR_20")} control={control} disabled={false} options={option20} wrapStyle={wrapStyle} labelStyle={labelStyle} />
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "tabDetail" ? "block" : "none" }}>
            <Box style={{height:"100%"}}>
              <Box>
                <InputField type="check" name="applyAllLocation" control={control} options={[{ label: transLangKey("ALL_LOCAT"), value: "Y" }]} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <InputField type="radio" name="locationTypeCode" control={control} setValue={setValue} options={options1} wrapStyle={wrapStyle} labelStyle={labelStyle} disabled={locatTpCdDisabled} />
              </Box>
              <Box>
                <InputField type="action" name="locationTypeName" label={transLangKey("LOCAT_TP_NM")} onClick={() => { openLocatTpPopup() }} control={control}>
                  <Icon.Search />
                </InputField>
              </Box>
              <Box>
                <InputField name="locationLevel" label={transLangKey("LOCAT_LV")} control={control} readonly={true} disabled={locatTpDisabled} wrapStyle={wrapStyle} labelStyle={labelStyle} />
              </Box>
              <Box>
                <InputField type="action" name="locationCode" label={transLangKey("LOCAT_CD")} onClick={() => { openLocatCdPopup() }} control={control}>
                  <Icon.Search />
                </InputField>
              </Box>
              <Box>
                <InputField name="locationName" label={transLangKey("LOCAT_NM")} control={control} readonly={true} disabled={locatCdDisabled} wrapStyle={wrapStyle} labelStyle={labelStyle} />
              </Box>
              <Box>
                <InputField type="select" name="itemTypeId" label={transLangKey("ITEM_TP")} control={control} disabled={false} options={option21} wrapStyle={wrapStyle} labelStyle={labelStyle} />
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "tabCommon" ? "block" : "none" }}>
            <Box style={{height:"100%"}}>
              <Box>
                <InputField type="check" name="applyDifferentiationClassId" control={control} options={[{ label: transLangKey("DIF_GRADE"), value: "Y" }]} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <InputField type="select" name="differentiationClassId" control={control} disabled={false} options={option22} wrapStyle={wrapStyle} labelStyle={labelStyle} />
              </Box>
              <Box>
                <InputField type="check" name="applyMinOrderSize" control={control} options={[{ label: transLangKey("MIN_ORDER_SIZE"), value: "Y" }]} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <InputField name="minOrderSize" control={control} dataType="number" wrapStyle={wrapStyle} labelStyle={labelStyle} />
              </Box>
              <Box>
                <InputField type="check" name="applyMaxOrderSize" control={control} options={[{ label: transLangKey("MAX_ORDER_SIZE"), value: "Y" }]} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <InputField name="maxOrderSize" control={control} dataType="number" wrapStyle={wrapStyle} labelStyle={labelStyle} />
              </Box>
              <Box>
                <InputField type="check" name="applyUomId" control={control} options={[{ label: transLangKey("UOM_NM"), value: "Y" }]} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <InputField type="select" name="uomId" control={control} disabled={false} options={option23} wrapStyle={wrapStyle} labelStyle={labelStyle} />
              </Box>
              <Box>
                <InputField type="check" name="applyCurrencyCodeId" control={control} options={[{ label: transLangKey("CURCY_NM"), value: "Y" }]} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <InputField type="action" name="currencyName"onClick={() => { openCurrencyPopup() }} control={control}>
                  <Icon.Search />
                </InputField>
              </Box>
              <Box>
                <InputField type="check" name="applyAllowedHoliday" control={control} options={[{ label: transLangKey("ALLOWED_HOLIDAY_YN"), value: "Y" }]} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <InputField type="check" name="allowedHoliday" control={control} options={[{ label: "", value: "Y" }]} wrapStyle={wrapStyle} labelStyle={labelStyle} />
              </Box>
              <Box>
                <InputField type="check" name="applyActive" control={control} options={[{ label: transLangKey("ACTV_YN"), value: "Y" }]} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <InputField type="check" name="active" control={control} options={[{ label: "", value: "Y" }]} wrapStyle={wrapStyle} labelStyle={labelStyle} />
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "tabNpiEol" ? "block" : "none" }}>
            <Box style={{height:"100%"}}>
              <Box>
                <InputField type="check" name="applySRA" control={control} options={[{ label: transLangKey("SRA"), value: "Y" }]} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <InputField type="datetime" name="SRA" dateformat="yyyy-MM-dd" control={control} wrapStyle={wrapStyle} labelStyle={labelStyle} />
              </Box>
              <Box>
                <InputField type="check" name="applyRTS" control={control} options={[{ label: transLangKey("RTS"), value: "Y" }]} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <InputField type="datetime" name="RTS" dateformat="yyyy-MM-dd" control={control} wrapStyle={wrapStyle} labelStyle={labelStyle} />
              </Box>
              <Box>
                <InputField type="check" name="applyEOP" control={control} options={[{ label: transLangKey("EOP"), value: "Y" }]} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <InputField type="datetime" name="EOP" dateformat="yyyy-MM-dd" control={control} wrapStyle={wrapStyle} labelStyle={labelStyle} />
              </Box>
              <Box>
                <InputField type="check" name="applyEOS" control={control} options={[{ label: transLangKey("EOS"), value: "Y" }]} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <InputField type="datetime" name="EOS" dateformat="yyyy-MM-dd" control={control} wrapStyle={wrapStyle} labelStyle={labelStyle} />
              </Box>
              <Box>
                <InputField type="check" name="applyParentItemEOL" control={control} options={[{ label: transLangKey("PARENT_ITEM_EOL"), value: "Y" }]} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <InputField type="datetime" name="parentItemEOL" dateformat="yyyy-MM-dd" control={control} wrapStyle={wrapStyle} labelStyle={labelStyle} />
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "tabStock" ? "block" : "none" }}>
            <Box style={{height:"100%"}}>
              <Box>
                <InputField type="check" name="applyInventoryOnHand" control={control} options={[{ label: transLangKey("STOCK_ONHAND_YN"), value: "Y" }]} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <InputField type="check" name="inventoryOnHand" control={control} options={[{ label: "", value: "Y" }]} wrapStyle={wrapStyle} labelStyle={labelStyle} />
              </Box>
              <Box>
                <InputField type="check" name="applyImmediateShipment" control={control} options={[{ label: transLangKey("IMMEDIATE_SHIPMENT_YN"), value: "Y" }]} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <InputField type="check" name="immediateShipment" control={control} options={[{ label: "", value: "Y" }]} wrapStyle={wrapStyle} labelStyle={labelStyle} />
              </Box>
              <Box>
                <InputField type="check" name="applyInventoryPolicyId" control={control} options={[{ label: transLangKey("STOCK_POLICY"), value: "Y" }]} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <InputField type="select" name="inventoryPolicyId" control={control} disabled={false} options={option24} wrapStyle={wrapStyle} labelStyle={labelStyle} />
              </Box>
              <Box>
                <InputField type="check" name="applyStandardPrice" control={control} options={[{ label: transLangKey("STD_UTPIC"), value: "Y" }]} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <InputField name="standardPrice" control={control} dataType="number" wrapStyle={wrapStyle} labelStyle={labelStyle} />
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "tabProdCost" ? "block" : "none" }}>
            <Box style={{height:"100%"}}>
              <Box>
                <InputField type="check" name="applyDirectCost" control={control} options={[{ label: transLangKey("DIRECT_COST"), value: "Y" }]} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <InputField name="directCost" control={control} dataType="number" wrapStyle={wrapStyle} labelStyle={labelStyle} />
              </Box>
              <Box>
                <InputField type="check" name="applyIndirectCost" control={control} options={[{ label: transLangKey("INDIRECT_COST"), value: "Y" }]} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <InputField name="indirectCost" control={control} dataType="number" wrapStyle={wrapStyle} labelStyle={labelStyle} />
              </Box>
            </Box>
          </Box>
        </Box>
      </PopupDialog>

      {locatTpPopupOpen && (<PopLocatTp open={locatTpPopupOpen} onClose={() => { setLocatTpPopupOpen(false); }} confirm={onSetLocatTp}></PopLocatTp>)}
      {locatCdPopupOpen && (<PopLocatTp open={locatCdPopupOpen} onClose={() => { setLocatCdPopupOpen(false); }} confirm={onSetLocatCd}></PopLocatTp>)}
      {currencyPopupOpen && (<PopCurcy open={currencyPopupOpen} onClose={() => { setCurrencyPopupOpen(false); }} confirm={onSetCurcy}></PopCurcy>)}
    </>
  );
}

export default PopSiteItemBatchUpdate;
