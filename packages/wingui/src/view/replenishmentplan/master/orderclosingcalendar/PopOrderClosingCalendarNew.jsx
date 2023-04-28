import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box, Grid, Tab, Tabs } from '@mui/material';
import { InputField, PopupDialog, useStyles, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';
import LocationSearchCondition from '@wingui/view/supplychainmodel/common/LocationSearchCondition';
import { getCodeList } from "@wingui/view/supplychainmodel/common/common";

function PopOrderClosingCalendarNew(props) {
  const [username] = useUserStore(state => [state.username]);
  const classes = useStyles();
  const [tabValue, setTabValue] = React.useState('1');
  const [selectOptions, setSelectOptions] = useState({});

  const location = useRef();

  const { handleSubmit, reset, control, getValues, setValue, watch, register, formState: { errors }, clearErrors } = useForm({
    defaultValues: {
      calendarId: "",
      calendarDesc: "",
      startDate: new Date().format('yyyy-MM-dd'),
      endDate: new Date().format('yyyy-MM-dd'),
      cyclTp: "",
      fixedYn: [''],
      actvYn: [''],
    }
  });

  useEffect(()=> {
    async function initLoad() {
      let dataArr = await getCodeList('CALENDAR_CYCL_TP');
      setSelectOptions(dataArr.filter(code => code.GROUP == 'CALENDAR_CYCL_TP').map(data => ({ value: data.ID, label: data.CD_NM })));
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

  const saveSubmit = () => {
    let param = new FormData();

    param.append('WRK_TYPE', 'SAVE');
    param.append('ID', '');
    param.append('LOCAT_ID', location.current.getLocationId());
    param.append('CALENDAR_ID', getValues('calendarId'));
    param.append('DESCRIP', getValues('calendarDesc'));
    param.append('STRT_DATE', new Date(getValues('startDate')).format('yyyy-MM-ddT00:00:00'));
    param.append('END_DATE', new Date(getValues('endDate')).format('yyyy-MM-ddT00:00:00'));
    param.append('CYCL_TP', getValues('cyclTp'));
    param.append('FIXED_YN', getValues('fixedYn').join('') === 'Y' ? 'true' : 'false');
    param.append('ACTV_YN', getValues('actvYn').join('') === 'Y' ? 'true' : 'false');
    param.append('USER_ID', username);
    param.append('timeout', 0);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_IM_07_S1',
      data: param,
      fromPopup: true
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_IM_07_S1_P_RT_MSG), { close: false })
      } else {
        showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
      }

      props.confirm();
      props.onClose(false);
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  const tabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title={transLangKey('POP_UI_IM_07_03')} resizeHeight={400} resizeWidth={450}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={tabChange}>
          <Tab label={transLangKey('COMM')} value="1" />
          <Tab label={transLangKey('CAL_REG')} value="2" />
        </Tabs>
      </Box>
      <Box style={{ marginTop: "3px", width: "100%", height: "100%" }}>
        <Box sx={{ height: "calc(100% - 50px)", display: tabValue === "1" ? "block" : "none" }}>
          <Grid container direction="row" align="center">
              <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start" sx={{ width: '50%' }}>
                <LocationSearchCondition ref={location} readonly={true}/>
              </Grid>
              <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start" sx={{ width: '50%' }}>
                <InputField type="check" name="fixedYn" control={control} options={[{ label: transLangKey("FIXED_YN"), value: 'Y' }]} />
                <InputField type="check" name="actvYn" control={control} options={[{ label: transLangKey("ACTV_YN"), value: 'Y' }]} />
              </Grid>
            </Grid>
        </Box>
        <Box sx={{ height: "calc(100% - 50px)", display: tabValue === "2" ? "block" : "none" }}>
          <Grid container direction="row">
            <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start" sx={{ width: '50%' }}>
              <InputField name='calendarId' label={transLangKey('CALENDAR_ID')} readonly={true} control={control}/>
              <InputField name='calendarDesc' label={transLangKey('CALENDAR_DESCRIP')} control={control}/>
              <InputField name='startDate' type='datetime' label={transLangKey('STRT_DATE')} dateformat="yyyy-MM-dd" control={control}/>
              <InputField name='endDate' type='datetime' label={transLangKey('END_DATE')} dateformat="yyyy-MM-dd" control={control}/>
            </Grid>
            <Grid container direction="column" justifyContent="flex-start" alignItems="flex-start" sx={{ width: '50%' }}>
              <InputField name='cyclTp' type='select' label={transLangKey('CYCL_TP')} options={selectOptions} control={control}/>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </PopupDialog>
  );
}

export default PopOrderClosingCalendarNew;
