import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Box, Grid, Tab } from '@mui/material';
import { ResultArea, PopupDialog, InputField } from '@zionex/wingui-core/src/common/imports';
import { TabContext, TabList, TabPanel } from '@mui/lab';

import PopDemandItem04 from "../common/PopDemandItem04";
import PopDemandAccount from "../common/PopDemandAccount";
import PopDemandLocat from "../common/PopDemandLocat";

//거점 조회
function PopDemandMappingNew(props) {
  const [tabValue, setTabValue] = React.useState('1');

  const [demandItem04Open, setDemandItem04Open] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [locatPopupOpen, setLocatPopupOpen] = useState(false);


  const { handleSubmit, control, getValues, setValue, clearErrors } = useForm({
    defaultValues: {
      itemCd: "",
      itemNm: "",
      itemTp: "",
      accountCd: "",
      accountNm: "",
      shipTo: "",
      soldTo: "",
      billTo: "",
      channelTp: "",
      incoterms: "",
      ITEM_MST_ID: "",
      ACCOUNT_ID: "",
      LOCAT_ID: "",
      ACTV_YN: ['Y'],
    }
  });

  const options1 = [
    {
      label: transLangKey("ACTV_YN"),
      value: 'Y',
    },
  ];

  const onError = (errors, e) => {
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  const getConfirm = (popupName, gridRow) => {
    if (popupName === "PopDemandItem04") {
      setValue('itemCd', gridRow.ITEM_CD);
      setValue('itemNm', gridRow.ITEM_NM);
      setValue('itemTp', gridRow.ITEM_TP);
      setValue('ITEM_MST_ID', gridRow.ITEM_MST_ID);
    }

    if (popupName === "PopDemandAccount") {
      setValue('accountCd', gridRow.ACCOUNT_CD);
      setValue('accountNm', gridRow.ACCOUNT_NM);
      setValue('shipTo', gridRow.SHIP_TO_NM);
      setValue('soldTo', gridRow.SOLD_TO_NM);
      setValue('billTo', gridRow.BILL_TO_NM);
      setValue('channelTp', gridRow.CHANNEL_NM);
      setValue('incoterms', gridRow.INCOTERMS);
      setValue('ACCOUNT_ID', gridRow.ACCOUNT_ID);
    }

    if (popupName === "PopDemandLocat") {
      setValue('locatTp', gridRow.LOCAT_TP_NM);
      setValue('locatLv', gridRow.LOCAT_LV);
      setValue('locatCd', gridRow.LOCAT_CD);
      setValue('locatNm', gridRow.LOCAT_NM);
      setValue('LOCAT_ID', gridRow.LOCAT_ID);
    }
  }

  const saveSubmit = () => {
    let created = [{
      ITEM_MST_ID: getValues("ITEM_MST_ID"),
      ACCOUNT_ID: getValues("ACCOUNT_ID"),
      LOCAT_ID: getValues('LOCAT_ID'),
      ACTV_YN: getValues('ACTV_YN')
    }];
    props.confirm("PopDemandMappingNew", created);
    props.onClose(false);
  }

  const tabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title={props.title} resizeHeight={550} resizeWidth={450}>
      <ResultArea>
        <TabContext value={tabValue}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={tabChange} aria-label="lab API tabs example">
              <Tab label={transLangKey('DMND_INFO')} value="1" />
              <Tab label={transLangKey('FROM_LOCAT')} value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            <Grid container direction="row" align="center">
              <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start" sx={{ width: '50%' }}>
                <InputField type='action' name="itemCd" label={transLangKey("ITEM_CD")} onClick={() => { setDemandItem04Open(true) }} title={transLangKey('SEARCH')} readonly={true} control={control} >
                  <Icon.Search />
                </InputField>
                <InputField name="itemNm" label={transLangKey("ITEM_NM")} control={control} readonly={false} disabled={true} />
                <InputField name="itemTp" label={transLangKey("ITEM_TP")} control={control} readonly={false} disabled={true} />
                <InputField type='action' name='accountCd' label={transLangKey('ACCOUNT_CD')} onClick={() => { setAccountOpen(true) }} title={transLangKey('SEARCH')} readonly={true} control={control}>
                  <Icon.Search />
                </InputField>
                <InputField name="accountNm" label={transLangKey("ACCOUNT_NM")} control={control} readonly={false} disabled={true} />
              </Grid>
              <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start" sx={{ width: '50%' }}>
                <InputField name="shipTo" label={transLangKey("SHIP_TO")} control={control} readonly={false} disabled={true} />
                <InputField name="soldTo" label={transLangKey("SOLD_TO")} control={control} readonly={false} disabled={true} />
                <InputField name="billTo" label={transLangKey("BILL_TO")} control={control} readonly={false} disabled={true} />
                <InputField name="channelTp" label={transLangKey("CHANNEL_TP")} control={control} readonly={false} disabled={true} />
                <InputField name="incoterms" label={transLangKey("INCOTERMS")} control={control} readonly={false} disabled={true} />
                <InputField type="check" name="ACTV_YN" control={control} options={options1} option="ture" />
              </Grid>
            </Grid>
          </TabPanel>
          <TabPanel value="2">
            <TabContext value={tabValue}>
              <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start">
                <InputField type='action' name='locatTp' label={transLangKey('LOCAT_TP_NM')} onClick={() => { setLocatPopupOpen(true) }} title={transLangKey('SEARCH')} readonly={true}control={control}>
                  <Icon.Search />
                </InputField>
                <InputField name="locatLv" label={transLangKey("LOCAT_LV")} control={control} readonly={true} disabled={true} />
                <InputField name="locatCd" label={transLangKey("LOCAT_CD")} control={control} readonly={true} disabled={true} />
                <InputField name="locatNm" label={transLangKey("LOCAT_NM")} control={control} readonly={true} disabled={true} />
              </Grid>
            </TabContext>
          </TabPanel>
        </TabContext>
      </ResultArea>
      {demandItem04Open && (<PopDemandItem04 open={demandItem04Open} onClose={() => setDemandItem04Open(false)} multiple={true} confirm={getConfirm} title="COMM_SRH_POP_ITEM"></PopDemandItem04>)}
      {accountOpen && (<PopDemandAccount open={accountOpen} onClose={() => setAccountOpen(false)} multiple={true} confirm={getConfirm} title="ACCOUNT_CD"></PopDemandAccount>)}
      {locatPopupOpen && (<PopDemandLocat open={locatPopupOpen} onClose={() => setLocatPopupOpen(false)} multiple={true} loadPopup={"PopDemandMappingNew"} confirm={getConfirm} title="POP_UI_CM_02_06"></PopDemandLocat>)}

    </PopupDialog>
  );
}

export default PopDemandMappingNew;
