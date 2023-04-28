import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Tab, Tabs } from '@mui/material';
import { InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';
import { getCodeList } from "@wingui/view/supplychainmodel/common/common";

import ItemSearchCondition from '@wingui/view/supplychainmodel/common/ItemSearchCondition';
import PopCommAccount from '@wingui/view/supplychainmodel/common/PopCommAccount';
import PopItemGroup from '../productmixmax/PopItemGroup';

function PopProductMixMinAllocationNew(props) {
  const [channelOptions, setChannelOptions] = useState([]);
  const [applyMethodOptions, setApplyMethodOptions] = useState([]);
  const [accountPopupOpen, setAccountPopupOpen] = useState(false);
  const [itemGroupPopupOpen, setItemGroupPopupOpen] = useState(false);
  const [tabValue, setTabValue] = useState(props.tab);
  const [username] = useUserStore(state => [state.username]);

  const item = useRef();

  const { control, getValues, setValue } = useForm({
    defaultValues: {
      accountId: '',
      accountCode: '',
      accountName: '',
      accountChannelName: '',
      channelName: '',
      itemClassId: '',
      itemLevel: '',
      itemClass: '',
      description: '',
      itemGroup: '',
      itemGroupDescription: '',
      active: [''],
      apply: [''],
      applyMethod: '',
      applyRate: '',
      minAllocationQty: ''
    }
  });

  useEffect(() => {
    if (props.open) {
      setCombobox();
    }
  }, [props]);

  async function setCombobox() {
    let dataArr = await getCodeList('MIN_ALLOCATION_APPLY_TYPE, CHANNEL_TYPE');
    let applyTypeArr = dataArr.filter(code => code.GROUP == 'MIN_ALLOCATION_APPLY_TYPE').map(data => ({ value: data.ID, label: data.CD_NM }));
    let channelTypeArr = dataArr.filter(code => code.GROUP == 'CHANNEL_TYPE').map(data => ({ value: data.ID, label: data.CD_NM }));

    setApplyMethodOptions(applyTypeArr);
    setValue('applyMethod', applyTypeArr[0].value);
    setChannelOptions(channelTypeArr);
    setValue('channelName', channelTypeArr[0].value);
  }

  function saveSubmit() {
    let formData = new FormData();

    formData.append('CATAGY_VAL', props.tab);
    formData.append('ITEM_MST_ID', item.current.getItemMasterId());
    formData.append('ACCOUNT_ID', getValues('accountId'));
    formData.append('CHANNEL_ID', getValues('channelName'));
    formData.append('ITEM_CLASS_DTL_ID', getValues('itemClassId'));
    formData.append('APPY_YN', getValues('apply').includes('Y'));
    formData.append('MIN_ALLOC_APPY_MTD_ID', getValues('applyMethod'));

    if (getValues('applyRate') !== '') {
      formData.append('DMND_BASE_APPY_RATE', getValues('applyRate'));
    }

    if (getValues('minAllocationQty') !== '') {
      formData.append('MIN_ALLOC_QTY', getValues('minAllocationQty'));
    }

    formData.append('ACTV_YN', getValues('active').includes('Y'));
    formData.append('USER_ID', username);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_15_S1',
      data: formData
    })
    .then(function (res) {
      if (res.data.RESULT_SUCCESS) {
        showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_MP_15_S1_P_RT_MSG), { close: false });
        props.confirm();
      } else {
        showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
      }

      props.onClose();
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  const tabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  function openAccountPopup() {
    setAccountPopupOpen(true);
  }

  function closeAccountPopup() {
    setAccountPopupOpen(false);
  }

  function onSetAccount(gridRow) {
    setValue('accountId', gridRow.ACCOUNT_ID);
    setValue('accountCode', gridRow.ACCOUNT_CD);
    setValue('accountName', gridRow.ACCOUNT_NM);
    setValue('accountChannelName', gridRow.CHANNEL_NM);
  }

  function openItemGroupPopup() {
    setItemGroupPopupOpen(true);
  }

  function closeItemGroupPopup() {
    setItemGroupPopupOpen(false);
  }

  function onSetItemGroup(gridRow) {
    setValue('itemClassId', gridRow.ITEM_CLASS_DTL_ID);
    setValue('itemLevel', gridRow.ITEM_LV_NM);
    setValue('itemClass', gridRow.ITEM_CLASS_VAL);
    setValue('description', gridRow.DESCRIP);
    setValue('itemGroup', gridRow.ITEM_GRP);
    setValue('itemGroupDescription', gridRow.ITEM_GRP_DESCRIP);
  }

  return (
    <>
      <PopupDialog open={props.open} onClose={props.onClose} onSubmit={saveSubmit} title="MIN_ALLOC_CREATE" resizeHeight={400} resizeWidth={700}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={tabChange}>
            <Tab label={transLangKey("SALES")} value="ACCOUNT" style={{ display: props.tab === "ACCOUNT" ? "inline-block" : "none" }} />
            <Tab label={transLangKey("CHANNEL_TP")} value="CHANNEL" style={{ display: props.tab === "CHANNEL" ? "inline-block" : "none" }} />
            <Tab label={transLangKey("ITEM_CLASS_VAL")} value="ITEM_CLASS" style={{ display: props.tab === "ITEM_CLASS" ? "inline-block" : "none" }} />
            <Tab label={transLangKey("MIN_ALLOC")} value="MIN_ALLOCATION" />
          </Tabs>
        </Box>

        <Box style={{ marginTop: "3px", width: "100%", height: "100%", }}>
          <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "ACCOUNT" ? "block" : "none" }}>
            <Box>
              <ItemSearchCondition ref={item} readonly={true} />
            </Box>
            <Box>
              <InputField type="action" name="accountCode" label={transLangKey("ACCOUNT_CD")} title={transLangKey("SEARCH")} onClick={openAccountPopup} control={control} readonly={true}>
                <Icon.Search />
              </InputField>
              <InputField name="accountName" label={transLangKey("ACCOUNT_NM")} control={control} readonly={true} />
              <InputField name="accountChannelName" label={transLangKey("CHANNEL_NM")} control={control} readonly={true} />
            </Box>
            <Box>
              <InputField type="check" name="active" control={control} options={[{ label: transLangKey("ACTV_YN"), value: "Y" }]} />
            </Box>
          </Box>

          <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "CHANNEL" ? "block" : "none" }}>
            <Box>
              <ItemSearchCondition ref={item} readonly={true} />
            </Box>
            <Box>
              <InputField type="select" name="channelName" label={transLangKey("CHANNEL_NM")} control={control} options={channelOptions} />
            </Box>
            <Box>
              <InputField type="check" name="active" control={control} options={[{ label: transLangKey("ACTV_YN"), value: "Y" }]} />
            </Box>
          </Box>

          <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "ITEM_CLASS" ? "block" : "none" }}>
            <Box>
              <InputField name="itemLevel" label={transLangKey("ITEM_LV")} control={control} readonly={true} />
              <InputField name="itemClass" label={transLangKey("ITEM_CLASS_VAL")} control={control} readonly={true} />
              <InputField name="description" label={transLangKey("DESCRIP")} control={control} readonly={true} />
            </Box>
            <Box>
            <InputField type="action" name="itemGroup" label={transLangKey("ITEM_GRP")} title={transLangKey("SEARCH")} onClick={openItemGroupPopup} control={control}>
              <Icon.Search />
            </InputField>
              <InputField name="itemGroupDescription" label={transLangKey("ITEM_GRP_DESCRIP")} control={control} readonly={true} />
              <InputField type="check" name="active" control={control} options={[{ label: transLangKey("ACTV_YN"), value: "Y" }]} />
            </Box>
          </Box>

          <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "MIN_ALLOCATION" ? "block" : "none" }}>
            <Box>
              <InputField type="check" name="apply" control={control} options={[{ label: transLangKey("APPY_YN"), value: "Y" }]} />
            </Box>
            <Box>
              <InputField type="select" name="applyMethod" label={transLangKey("MIN_ALLOC_APPY_METHD")} control={control} options={applyMethodOptions} />
              <InputField dataType="number" name="applyRate" label={transLangKey("DMND_BASE_APPY_RATE")} control={control} />
              <InputField dataType="number" name="minAllocationQty" label={transLangKey("MIN_ALLOC_QTY")} control={control} />
            </Box>
          </Box>
        </Box>
      </PopupDialog>

      <PopCommAccount open={accountPopupOpen} onClose={closeAccountPopup} confirm={onSetAccount} />
      <PopItemGroup open={itemGroupPopupOpen} onClose={closeItemGroupPopup} confirm={onSetItemGroup} />
    </>
  );
}

export default PopProductMixMinAllocationNew;
