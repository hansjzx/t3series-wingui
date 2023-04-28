import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Tab, Tabs} from '@mui/material';
import { InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import PopPopParentComponentItem from './PopPopParentComponentItem';

const oneRowStyle = {marginRight: "100px"};

function PopProductionBomNew2(props) {
  const [username] = useUserStore(state => [state.username]);
  const { handleSubmit, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      globalBomMstId: props.data.globalBomMstId,
      bomVerId: "",
      verActvYn: ["Y"],
      baseBomYn: ["Y"],
      bomLv: props.data.bomLv,
      locatItemId: "",
      itemCd: "",
      itemNm: "",
      itemTp: "",
      baseBomRate: "",
      altGrp: "",
      altPolicy: "",
      priority: "",
      productYn: ["Y"],
      actvYn: ["Y"]
    }
  });

  const [altGrpOption, setAltGrpOption] = useState([]);
  const [altPolicyOption, setAltPolicyOption] = useState([]);
  const [itemPopupOpen, setPopupItem] = useState(false);

  useEffect(() => {
    let comboData = props.comboData;
    let altGrpArr = [];
    let altPolicyArr = [];

    for (var i = 0, len = comboData.length; i < len; i++) {
      var obj = comboData[i];
      if (obj !== null) {
        var listObj = {value: obj.ID, label: transLangKey(obj.CD_NM)};

        if (obj.GROUP === "ALTERNATE_MAT_GROUP") {
          altGrpArr.push(listObj);
        } else {
          altPolicyArr.push(listObj);
        }
      }
    }

    setAltGrpOption(altGrpArr);
    setAltPolicyOption(altPolicyArr);
  }, []);

  function openPopupItem() {
    setPopupItem(true);
  }

  function onSetItemCd(gridRow) {
    setValue("locatItemId", gridRow.ID);
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
        formData.append('ID', '');
        formData.append('GLOBAL_BOM_MST_ID', getValues('globalBomMstId'));
        formData.append('BOM_VER_ID', getValues('bomVerId'));
        formData.append('VER_ACTV_YN', getValues('verActvYn').join("") === 'Y' ? true : false);
        formData.append('BASE_BOM_YN', getValues('baseBomYn').join("") === 'Y' ? true : false);
        formData.append('LOCAT_ITEM_ID', getValues('locatItemId'));
        formData.append('PRODUCT_YN', getValues('productYn').join("") === 'Y' ? true : false);
        formData.append('ACTV_YN', getValues('actvYn').join("") === 'Y' ? true : false);
        formData.append('USER_ID', username);
        formData.append('timeout', 0);
        formData.append('CURRENT_OPERATION_CALL_ID', 'OPC_POP_UI_CM_05_01_WINDOW_01_CPT_30_01_CLICK_01');

        zAxios.post(baseURI() + 'engine/mp/SRV_UI_CM_05_S2', formData)
          .then(function (res) {
            if (res.status === gHttpStatus.SUCCESS) {
              const rsData = res.data;
              if (rsData.RESULT_SUCCESS) {
                const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_05_S2_P_RT_MSG;
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
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveData, onError)} title="POP_UI_CM_05_02" resizeHeight={800} resizeWidth={500}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={"tab1"} indicatorColor="primary">
          <Tab label={transLangKey("COMM")} value="tab1" />
        </Tabs>
      </Box>

      <Box style={{ marginTop: "5px", border: "1px solid #dde1ee", width: "100%", height: "100%", padding: "6px 12px" }}>
        <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: "block" }}>
          <Box style={{ height: "100%" }}>
            <InputField name='globalBomMstId' control={control} style={{display: 'none'}} />
            <InputField name="bomVerId" label={transLangKey("BOM_VER_ID")} control={control} />

            <InputField type='check' name='verActvYn' control={control} options={[{ label: transLangKey('VER_ACTV_YN'), value: 'Y' }]} style={oneRowStyle} />
            <InputField type='check' name='baseBomYn' control={control} options={[{ label: transLangKey('BASE_BOM_YN'), value: 'Y' }]} style={oneRowStyle} />

            <InputField name="bomLv" label={transLangKey("BOM_LV")} control={control} disabled={true} style={oneRowStyle} />

            <InputField name='locatItemId' control={control} style={{display: 'none'}} />
            <InputField type="action" name="itemCd" label={transLangKey("ITEM_CD")} onClick={() => {openPopupItem()}} control={control} readonly={true}>
              <Icon.Search />
            </InputField>
            <InputField name="itemNm" label={transLangKey("ITEM_NM")} control={control} disabled={true} />
            <InputField name="itemTp" label={transLangKey("ITEM_TP")} control={control} disabled={true} style={oneRowStyle} />

            <InputField name="baseBomRate" label={transLangKey("BASE_BOM_RATE")} dataType={"number"} pattern={"[1-9]|[1-9][0-9]|100"} control={control} style={oneRowStyle} />

            <InputField type="select" name="altGrp" label={transLangKey("ALT_GRP")} control={control} options={altGrpOption} />
            <InputField type="select" name="altPolicy" label={transLangKey("ALT_POLICY")} control={control} options={altPolicyOption} />

            <InputField name="priority" label={transLangKey("PRIORITY")} dataType={"number"} control={control} />

            <InputField type='check' name='productYn' control={control} options={[{ label: transLangKey('PRDUCT_YN'), value: 'Y' }]} style={oneRowStyle} />
            <InputField type='check' name='actvYn' control={control} options={[{ label: transLangKey('ACTV_YN'), value: 'Y' }]} />
          </Box>
        </Box>
      </Box>
    </PopupDialog>
    {itemPopupOpen && (<PopPopParentComponentItem open={itemPopupOpen} onClose={() => { setPopupItem(false); }} confirm={onSetItemCd} confKey="003" viewId="POP_UI_CM_05_02"></PopPopParentComponentItem>)}
    </>
  );
}
export default PopProductionBomNew2;
