import React, { useState, useEffect, useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import { Box, Grid, Tab, Tabs } from '@mui/material';
import { PopupDialog, InputField, useUserStore } from '@zionex/wingui-core/src/common/imports';
import { getCodeList } from "@wingui/view/supplychainmodel/common/common";
import PopRouteGroup from './PopRouteGroup';
import PopLocationResource from './PopLocationResource';
import PopLocatTp from "@wingui/view/common/PopLocatTp";

//거점 조회
function PopJobChangeTimeNew(props) {
  const [username] = useUserStore(state => [state.username]);

  const [tabValue, setTabValue] = React.useState('1');
  const [selectOptions, setSelectOptions] = useState({});

  const [clickFrom, setClickFrom] = useState('');
  const [locationMgmtId, setLocationMgmtId] = useState('');

  const [locationPopupOpen, setLocationPopupOpen] = useState(false);
  const [resourcePopupOpen, setPopResource] = useState(false);
  const [routeGroupPopupOpen, setRouteGroupPopupOpen] = useState(false);


  const { handleSubmit, control, getValues, setValue, clearErrors } = useForm({
    defaultValues: {
      locationMgmtId: '',
      locationType: '',
      locationLevel: '',
      locationCode: '',
      locationName: '',
      resId: "",
      resCd: "",
      fromRouteGrpCd: "",
      fromRouteGrpDescrip: "",
      fromRouteGrpClassDtlId: "",
      toRouteGrpCd: "",
      toRouteGrpDescrip: "",
      toRouteGrpClassDtlId: "",
      jcCapacity: "",
      jcTime: "",
      uomId: "",
      actvYn: ['']
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

  const saveSubmit = () => {
      let created = [{
        WRK_TYPE: "SAVE",
        RES_ID: getValues("resId"),
        FROM_ROUTE_CLASS_DTL_ID: getValues("fromRouteGrpClassDtlId"),
        TO_ROUTE_CLASS_DTL_ID: getValues('toRouteGrpClassDtlId'),
        JC_CAPACITY: getValues('jcCapacity'),
        JC_TIME: getValues('jcTime'),
        UOM_ID: getValues('uomId'),
        ACTV_YN: getValues('actvYn').join(''),
        USER_ID: username,
      }];
      
      props.confirm(created);
      props.onClose(false);
  }

  const tabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  function openLocationPopup() {
    setValue('resId', '');
    setValue('resCd', '');
    setValue('resDescrip', '');
    setLocationPopupOpen(true);
  }

  function onSetLocation(gridRow) {
    setValue('locationMgmtId', gridRow.LOCAT_MGMT_ID);
    setValue('locationType', gridRow.LOCAT_TP_NM);
    setValue('locationLevel', gridRow.LOCAT_LV);
    setValue('locationCode', gridRow.LOCAT_CD);
    setValue('locationName', gridRow.LOCAT_NM);
  }

  function setPopResourceopen() {
    setLocationMgmtId(getValues('locationMgmtId'));
    setPopResource(true);
  }

  function onSetRouteGroupClose() {
    setClickFrom('');
  }
    
  function onSetResource(gridRow) {
    setValue("resId", gridRow.RES_MGMT_DTL_ID);
    setValue("resCd", gridRow.RES_CD);
    setValue("resDescrip", gridRow.DESCRIP === null ? '' : gridRow.RES_DESCRIP);
  } 

  function onSetRouteGroup(gridRow, clickFrom) {
    if (clickFrom == "fromRoute") {
      setValue("fromRouteGrpCd", gridRow.ROUTE_GRP);
      setValue("fromRouteGrpDescrip", gridRow.ROUTE_GRP_DESCRIP);
      setValue("fromRouteGrpClassDtlId", gridRow.ROUTE_CLASS_DTL_ID);
    } else if (clickFrom == "toRoute") {
      setValue("toRouteGrpCd", gridRow.ROUTE_GRP);
      setValue("toRouteGrpDescrip", gridRow.ROUTE_GRP_DESCRIP);
      setValue("toRouteGrpClassDtlId", gridRow.ROUTE_CLASS_DTL_ID);
    }
  }

  async function setCombobox() {
    let dataArr = await getCodeList('TIME_UOM');
    let filteringArr = dataArr.filter(code => code.GROUP == 'TIME_UOM').map(data => ({ value: data.ID, label: data.CD_NM }));

    setSelectOptions(filteringArr);
    setValue('uomId', filteringArr[0].value);
  }

  useEffect(()=> {
    if (Object.keys(selectOptions).length === 0) {
      setCombobox();
    } 
  }, [props.open]);

  useLayoutEffect(()=> {
    if (clickFrom !== '') {
      setRouteGroupPopupOpen(true);
    } else {
      setRouteGroupPopupOpen(false);
    }
  }, [clickFrom])

  return (
    <>
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title={transLangKey('POP_UI_MP_23_01')} resizeHeight={415} resizeWidth={450}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={tabChange}>
          <Tab label={transLangKey('COMM')} value="1" />
          <Tab label={transLangKey('JC_TIME')} value="2" />
        </Tabs>
      </Box>
      <Box style={{ marginTop: "3px", width: "100%", height: "100%" }}>
        <Box sx={{ height: "calc(100% - 50px)", display: tabValue === "1" ? "block" : "none" }}>
          <Grid container direction="row" align="center">
              <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start" sx={{ width: '50%' }}>
                <InputField type="action" name="locationType" title={transLangKey("SEARCH")} label={transLangKey("LOCAT_TP_NM")} onClick={()=>{openLocationPopup()}} readonly={true} control={control}>
                  <Icon.Search />
                </InputField>
                <InputField name="locationLevel" label={transLangKey("LOCAT_LV")} readonly={true} control={control}/>
                <InputField name="locationCode" label={transLangKey("LOCAT_CD")} readonly={true} control={control}/>
                <InputField name="locationName" label={transLangKey("LOCAT_NM")} readonly={true} control={control}/>
              </Grid>
              <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start" sx={{ width: '50%' }}>
                <InputField type='action' name='resCd' readonly={true} label={transLangKey('RES_CD')} title={transLangKey('SEARCH')} onClick={() => {setPopResourceopen()}} control={control}>
                  <Icon.Search />
                </InputField>
                <InputField name='resDescrip' readonly={true} label={transLangKey('RES_DESCRIP')} control={control} />
                <InputField type="check" name="actvYn" control={control} options={options1} />
              </Grid>
            </Grid>
        </Box>
        <Box sx={{ height: "calc(100% - 50px)", display: tabValue === "2" ? "block" : "none" }}>
          <Grid container direction="row">
            <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start" sx={{ width: '50%' }}>
              <InputField type='action' name='fromRouteGrpCd' label={transLangKey('FROM_ROUTE_GRP_CD')} title={transLangKey('SEARCH')} onClick={() => {setClickFrom("fromRoute");}} control={control}>
                <Icon.Search />
              </InputField>
              <InputField name='fromRouteGrpDescrip' label={transLangKey('FROM_ROUTE_GRP_DESCRIP')} control={control} />
              <InputField type='action' name='toRouteGrpCd' label={transLangKey('TO_ROUTE_GRP_CD')} title={transLangKey('SEARCH')} onClick={() => {setClickFrom("toRoute")}} control={control}>
                <Icon.Search />
              </InputField>
              <InputField name='toRouteGrpDescrip' label={transLangKey('TO_ROUTE_GRP_DESCRIP')} control={control} />
            </Grid>
            <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start" sx={{ width: '50%' }}>
              <InputField name='jcCapacity' label={transLangKey('JC_CAPACITY')} dataType='number' control={control}/>
              <InputField name='jcTime' label={transLangKey('JC_TIME')} dataType='number' control={control}/>
              <InputField name='uomId' type='select' options={selectOptions} control={control}/>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </PopupDialog>
    {locationPopupOpen && <PopLocatTp id="locatTp" open={locationPopupOpen} onClose={()=> {setLocationPopupOpen(false)}} confirm={onSetLocation} />}
    {resourcePopupOpen && (<PopLocationResource id={"popJobChangeTimeNew"} open={resourcePopupOpen} onClose={() => {setPopResource(false)}} confirm={onSetResource} locationMgmtId={locationMgmtId}></PopLocationResource>)}
    {routeGroupPopupOpen && (<PopRouteGroup id={"popJobChangeTimeNew"} open={routeGroupPopupOpen} onClose={() => {onSetRouteGroupClose()}} confirm={onSetRouteGroup} clickFrom={clickFrom}></PopRouteGroup>)}
    </>
  );
}

export default PopJobChangeTimeNew;
