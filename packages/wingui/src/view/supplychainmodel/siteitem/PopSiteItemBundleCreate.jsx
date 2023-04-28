import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Tab, Tabs } from '@mui/material';
import { InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import PopLocatTp from '@wingui/view/common/PopLocatTp';
import PopCommItem from '../common/PopCommItem';

const wrapStyle = {width: "400px"};
const labelStyle = {width: "160px", maxWidth: "160px"};

function PopSiteItemBundleCreate(props) {
  const [username] = useUserStore(state => [state.username]);
  const { handleSubmit, watch, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      applyPoint: 'PARTIAL',
      checkLocation: ['Y'],
      locationManagementId: '',
      locationTypeName: '',
      locationLevel: '',
      locationCode: '',
      locationName: '',
      checkItem: [''],
      itemMasterId: '',
      itemName: '',
      overwriteData: ['']
    }
  });

  const applyOption = [{ label: transLangKey('ALL_APPLY'), value: 'ALL' }, { label: transLangKey('PARTIAL_APPLY'), value: 'PARTIAL' }];

  const [tabValue, setTabValue] = React.useState('tab1');
  const [locatTpPopupOpen, setLocatTpPopupOpen] = useState(false);
  const [itemCdPopupOpen, setItemCdPopupOpen] = useState(false);
  const [locatDisabled, setLocatDisabled] = useState(true);
  const [itemDisabled, setItemDisabled] = useState(true);

  const watchApplyPoint = watch('applyPoint');

  useEffect(() => {
    if (watchApplyPoint === 'ALL') {
      setValue('checkLocation', ['']);
      setValue('locationTypeName', '');
      setValue('locationLevel', '');
      setValue('locationCode', '');
      setValue('locationName', '');
      setValue('checkItem', ['']);
      setValue('itemMasterId', '');
      setValue('itemName', '');
      setLocatDisabled(false);
      setItemDisabled(false);
    } else {
      setValue('checkLocation', ['Y']);
    }
  }, [watchApplyPoint]);

  useEffect(() => {
    if (getValues('checkLocation')[0] === 'Y') {
      setValue('checkItem', []);
      setValue('itemMasterId', '');
      setValue('itemName', '');
      setLocatDisabled(false);
    } else {
      setLocatDisabled(true);
    }
  }, [watch('checkLocation')]);

  useEffect(() => {
    if (getValues('checkItem')[0] === 'Y') {
      setValue('checkLocation', []);
      setValue('locationTypeName', '');
      setValue('locationLevel', '');
      setValue('locationCode', '');
      setValue('locationName', '');
      setItemDisabled(false);
    } else {
      setItemDisabled(true);
    }
  }, [watch('checkItem')]);

  const tabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  function openLocatTpPopup() {
    setLocatTpPopupOpen(true);
  }

  function onSetLocatTp(gridRow) {
    setValue('locationManagementId', gridRow.LOCAT_MGMT_ID);
    setValue('locationTypeName', gridRow.LOCAT_TP_NM);
    setValue('locationLevel', gridRow.LOCAT_LV);
    setValue('locationCode', gridRow.LOCAT_CD);
    setValue('locationName', gridRow.LOCAT_NM);
  }

  function openItemCdPopup() {
    setItemCdPopupOpen(true);
  }

  function onSetItemCd(gridRows) {
    let itemCdArr = [];
    let itemNmArr = [];
    gridRows.forEach(function (row) {
      itemCdArr.push(row.ITEM_CD);
      itemNmArr.push(row.ITEM_NM);
    });
    setValue('itemMasterId', itemCdArr.join('|'));
    setValue('itemName', itemNmArr.join('|'));
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
    formData.append('APPLY_POINT', getValues('applyPoint'));
    formData.append('CHECK_LOCAT', getValues('checkLocation').join('')  === 'Y' ? 'true' : 'false');
    formData.append('LOCAT_MGMT_ID', getValues('locationManagementId'));
    formData.append('CHECK_ITEM', getValues('checkItem').join('')  === 'Y' ? 'true' : 'false');
    formData.append('ITEM_MST_ID', getValues('itemMasterId'));
    formData.append('OVERWRITE_DATA_YN', getValues('overwriteData').join('')  === 'Y' ? 'true' : 'false');
    formData.append('USER_ID', username);
    formData.append('timeout', 0);
    formData.append('CURRENT_OPERATION_CALL_ID', 'OPC_POP_UI_CM_04_04_WINDOW_01_CPT_99_01_CLICK_01');

    zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_04_BATCH", formData)
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          const rsData = res.data;
          if (rsData.RESULT_SUCCESS) {
            const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_04_BATCH_P_RT_MSG;
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
      <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="POP_UI_CM_04_04" resizeHeight={650} resizeWidth={475}>
        <Tabs value={tabValue} onChange={tabChange} indicatorColor="primary">
          <Tab label={transLangKey("LOCAT_ITEM_INFO")} value="tab1" />
        </Tabs>

        <Box style={{ marginTop: "3px", width: "100%", height: "100%" }}>
          <Box sx={{ display: "flex", height: "100%", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "tab1" ? "block" : "none" }}>
            <Box>
              <InputField type="radio" name="applyPoint" control={control} setValue={setValue} options={applyOption} wrapStyle={wrapStyle} labelStyle={labelStyle} />
            </Box>
            <Box>
              <InputField type="check" name="checkLocation" label="" control={control} options={[{ label: transLangKey("LOCAT_REGISTRY"), value: "Y" }]} wrapStyle={wrapStyle} labelStyle={labelStyle} />
              <InputField name="locationManagementId" label={transLangKey("LOCAT_MGMT_ID")} control={control} style={{display: "none"}} />
            </Box>
            <Box>
              <InputField type="action" name="locationTypeName" label={transLangKey("LOCAT_TP_NM")} onClick={() => { openLocatTpPopup() }} control={control} disabled={locatDisabled}>
                <Icon.Search />
              </InputField>
              <InputField name="locationLevel" label={transLangKey("LOCAT_LV")} control={control} readonly={true} wrapStyle={wrapStyle} labelStyle={labelStyle} />
            </Box>
            <Box>
              <InputField name="locationCode" label={transLangKey("LOCAT_CD")} control={control} readonly={true} wrapStyle={wrapStyle} labelStyle={labelStyle} />
              <InputField name="locationName" label={transLangKey("LOCAT_NM")} control={control} readonly={true} wrapStyle={wrapStyle} labelStyle={labelStyle} />
            </Box>
            <Box>
              <InputField type="check" name="checkItem" label="" control={control} options={[{ label: transLangKey("ITEM_REGISTRY"), value: "Y" }]} wrapStyle={wrapStyle} labelStyle={labelStyle} />
            </Box>
            <Box>
              <InputField type="action" name="itemMasterId" label={transLangKey("ITEM_CD")} onClick={() => { openItemCdPopup() }} control={control} disabled={itemDisabled}>
                <Icon.Search />
              </InputField>
            <InputField name="itemName" label={transLangKey("ITEM_NM")} control={control} readonly={true} wrapStyle={wrapStyle} labelStyle={labelStyle} />
            </Box>
            <Box>
              <InputField type="check" name="overwriteData" label="" control={control} options={[{ label: transLangKey("OVERWRITE_EXIST_DATA"), value: "Y" }]} />
            </Box>
          </Box>
        </Box>
      </PopupDialog>

      {locatTpPopupOpen && (<PopLocatTp open={locatTpPopupOpen} onClose={() => { setLocatTpPopupOpen(false); }} confirm={onSetLocatTp}></PopLocatTp>)}
      {itemCdPopupOpen && (<PopCommItem open={itemCdPopupOpen} onClose={() => { setItemCdPopupOpen(false); }} confirm={onSetItemCd}></PopCommItem>)}
    </>
  );
}

export default PopSiteItemBundleCreate;
