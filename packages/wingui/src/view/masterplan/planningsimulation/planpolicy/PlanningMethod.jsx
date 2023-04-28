import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Box, Grid, TextField, Button, Card, CardHeader } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { InputField, RightButtonArea, zAxios } from '@zionex/wingui-core/src/common/imports';
import { useUserStore } from '@zionex/wingui-core/src/store/userStore';
import PopSelectLocation from './PopSelectLocation';

const usePlanningMethodStyles = makeStyles({
  readOnlyInput: {
    '&:after': {
      borderBottom: 'none'
    },
    '&:hover:before': {
      borderBottom: '1px solid rgba(0, 0, 0, 0.42) !important'
    },
    '& svg': {
      color: 'rgba(0, 0, 0, 0.26)'
    },
    '& .MuiInput-input': {
      cursor: 'text',
      '&:focus': {
        backgroundColor: 'initial'
      }
    }
  },
  input: {
    '& ::placeholder': {
      fontStyle: 'italic'
    },
    fontSize: '15px'
  },
  card: {
    height: '100%',
    borderRadius: 6,
    border: 'none',
    boxShadow: 'rgb(90 114 123 / 11%) 0px 7px 30px 0px, rgb(0 0 0 / 5%) 0px 1px 3px -1px',
    '& > div': {
      paddingRight: '1rem',
      paddingLeft: '1rem'
    },
    '& > div:first-child': {
      paddingTop: '1rem',
      paddingBottom: '0'
    },
    '& > div:last-child': {
      paddingBottom: '1rem'
    },
    '& .MuiCardHeader-root': {
      '& .MuiCardHeader-content': {
        height: 30
      },
      '& .MuiCardHeader-action': {
        marginTop: 0,
        marginRight: 0
      }
    },
    '& .MuiFormControlLabel-label' : {
      width: '215px'
    }
  }
});

export function PlanningMethod(props, ref) {
  const classes = usePlanningMethodStyles();
  const [username] = useUserStore(state => [state.username]);
  const [planScriptOptions, setPlanScriptOptions] = useState([]);
  const [estLocationPopupOpen, setEstLocationPopupOpen] = useState(false);
  const [reqLocationPopupOpen, setReqLocationPopupOpen] = useState(false);
  const [stockPlaceStrtgyOptions, setStockPlaceStrtgyOptions] = useState([]);
  const [applyReplenishmentPlanOptions, setApplyReplenishmentPlanOptions] = useState([]);
  const [reqCreateLocLevelOptions, setReqCreateLocLevelOptionsOptions] = useState([]);

  const { getValues, setValue, control, watch } = useForm({
    defaultValues: {
      planPolicyId: '',
      planScript: '',
      estSiteLv: '',
      estLocationId: '',
      estLocationName: '',
      estLocationLevel: '',
      stockPlaceStrtgy: '',
      applyReplenishmentPlan: '',
      reqCreateLocLevel: '',
      reqLocationId: '',
      reqLocationName: '',
      reqLocationLevel: ''
    }
  });

  useImperativeHandle(ref, () => ({
    initLoad(planPolicyId) {
      if (planPolicyId && planPolicyId !== '') {
        setValue('planPolicyId', planPolicyId);
        loadPlanPolicyDetails(planPolicyId);
      }
    }
  }));

  function loadPlanPolicyDetails(planPolicyId) {
    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_CM_15_Q3',
      params: {
        'PLAN_POLICY_ID': planPolicyId
      }
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          let planScriptOptions = [];
          let stockPlaceStrtgyOptions = [];
          let applyReplenishmentPlanOptions = [];
          let reqCreateLocLevelOptions = [];

          res.data.RESULT_DATA.map((data) => {
            if (data.ITEM_ID === "M00340000") {
              var obj = { label:transLangKey(data.PLAN_POLICY_NM), value: data.DTL_ID };
              if (data.CHECKED === "Y") {
                setValue('planScript', data.DTL_ID);
              }
              planScriptOptions.push(obj);
            }

            if (data.ITEM_ID === "M00350000") {
              setValue('estLocationId', data.VAL_02);
              setValue('estLocationName', data.VAL_01);
              setValue('estLocationLevel', data.VAL_06);
            }

            if (data.ITEM_ID === "M00360000") {
              var obj = { label:transLangKey(data.PLAN_POLICY_NM), value: data.DTL_ID };
              if (data.CHECKED === "Y") {
                setValue('stockPlaceStrtgy', data.DTL_ID);
              }
              stockPlaceStrtgyOptions.push(obj);
            }

            if (data.ITEM_ID === "M00690000") {
              var obj = { label:transLangKey(data.PLAN_POLICY_NM), value: data.DTL_ID };
              if (data.CHECKED === "Y") {
                setValue('reqCreateLocLevel', data.DTL_ID);
              }
              reqCreateLocLevelOptions.push(obj);
            }

            if (data.ITEM_ID === "M00700000") {
              setValue('reqLocationId', data.VAL_02);
              setValue('reqLocationName', data.VAL_01);
              setValue('reqLocationLevel', data.VAL_06);
            }

            if (data.ITEM_ID === "M00710000") {
              var obj = { label:transLangKey(data.PLAN_POLICY_NM), value: data.DTL_ID };
              if (data.CHECKED === "Y") {
                setValue('applyReplenishmentPlan', data.DTL_ID);
              }
              applyReplenishmentPlanOptions.push(obj);
            }
          });

          setPlanScriptOptions(planScriptOptions);
          setStockPlaceStrtgyOptions(stockPlaceStrtgyOptions);
          setApplyReplenishmentPlanOptions(applyReplenishmentPlanOptions);
          setReqCreateLocLevelOptionsOptions(reqCreateLocLevelOptions);
        }
      })
      .catch(function (err) {
        console.log(err);
      })
  }

  function onEstSetLocation(dataRow) {
    setValue('estLocationId', dataRow.LOCAT_ID);
    setValue('estLocationName', dataRow.LOCAT_NM);
    setValue('estLocationLevel', dataRow.LOCAT_LV);
  }

  function onReqSetLocation(dataRow) {
    setValue('reqLocationId', dataRow.LOCAT_ID);
    setValue('reqLocationName', dataRow.LOCAT_NM);
    setValue('reqLocationLevel', dataRow.LOCAT_LV);
  }

  function savePlanningMethod() {
    let param = new URLSearchParams();

    param.append('PP_ID', getValues('planPolicyId'));
    param.append('CON_ID', 'PP_CON_10');
    param.append('VAL_01', getValues('planScript'));
    param.append('VAL_02', getValues('estLocationName'));
    param.append('VAL_03', getValues('estLocationId'));
    param.append('VAL_04', getValues('estLocationLevel'));
    param.append('VAL_05', getValues('stockPlaceStrtgy'));
    param.append('VAL_06', getValues('applyReplenishmentPlan'));
    param.append('VAL_07', getValues('reqCreateLocLevel'));
    param.append('VAL_08', getValues('reqLocationName'));
    param.append('VAL_09', getValues('reqLocationId'));
    param.append('VAL_10', getValues('reqLocationLevel'));
    param.append('USER_ID', username);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        zAxios({
          method: 'post',
          header: { 'content-type': 'application/json' },
          url: baseURI() + 'engine/mp/SRV_UI_CM_15_S2',
          params: param
        })
          .then(function (res) {
            if (res.status === gHttpStatus.SUCCESS) {
              const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_CM_15_S2_P_RT_MSG;
              showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false })
              loadPlanPolicyDetails(getValues('planPolicyId'));
            }
          })
          .catch(function (err) {
            console.log(err);
          })
      }
    });
  }

  return (
    <>
      <Grid container gap={5} direction="column">
        <Grid>
          <Grid container gap={5}>
            <Grid style={{ width: '49.6%' }}>
              <Card variant="outlined" className={classes.card} style={{ height: 'calc(100%-24px)', padding: '0 !important' }}>
                <CardHeader title={transLangKey('PLAN_SCRIPT')} />
                <Grid container style={{ marginTop: '10px' }}>
                  <Grid>
                    <InputField type="radio" name="planScript" control={control} options={planScriptOptions} style={{ paddingRight: 0, marginRight: 0, width: '260px', height: '300px' }} />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid style={{ width: '49.6%' }}>
              <Card variant="outlined" className={classes.card} style={{ height: 'calc(100%-24px)', padding: '0 !important' }}>
                <CardHeader title={transLangKey('EST_SITE_LV')} />
                <Grid container style={{ marginTop: '10px' }}>
                  <Grid>
                    <Box display="flex" justifyContent="flex-start" sx={{ padding: '20px 15px' }}>
                      <Box style={{ color: 'text.primary', paddingTop: 6, px: 12 }}>
                        {transLangKey('LOCAT_TP_NM')}
                      </Box>
                      <Controller name="estLocationName" control={control} rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                          <TextField sx={{ width: 70, px: 5 }} variant="standard" value={value} onChange={onChange}
                                     InputProps={{ classes: { root: `${classes.input} ${classes.readOnlyInput}` }, readOnly: true, inputProps: { style:{ textAlign: 'center' } } }}
                          />
                        )}
                      />
                      <Box style={{ color: 'text.primary', paddingTop: 5, px: 12 }}>
                        {transLangKey('LOCAT_LV')}
                      </Box>
                      <Controller name="estLocationLevel" control={control} rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                          <TextField sx={{ width: 70, px: 5 }} variant="standard" value={value} onChange={onChange}
                                     InputProps={{ classes: { root: `${classes.input} ${classes.readOnlyInput}` }, readOnly: true, inputProps: { style:{ textAlign: 'center' } } }}
                          />
                        )}
                      />
                      <Button variant="outlined" sx={{ margin: '3.5px 15px 3.5px 0', borderRadius: 1, borderColor: 'rgba(0, 0, 0, 0.23)', width: 90, height: 35 }} onClick={() => { setEstLocationPopupOpen(true) }}>
                        {transLangKey('LOCAT_CHOICE')}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid style={{ width: '32%' }}>
              <Card variant="outlined" className={classes.card} style={{ height: 'calc(100%-24px)', padding: '0 !important' }}>
                <CardHeader title={transLangKey('STOCK_PLACE_STRTGY')} />
                <Grid container style={{ marginTop: '10px' }}>
                  <Grid>
                    <InputField type="radio" name="stockPlaceStrtgy" control={control} options={stockPlaceStrtgyOptions} style={{ paddingRight: 0, marginRight: 0, width: '260px', height: '80px' }} />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid style={{ width: '32%' }}>
              <Card variant="outlined" className={classes.card} style={{ height: 'calc(100%-24px)', padding: '0 !important' }}>
                <CardHeader title={transLangKey('APPLY_REPLENISHMENT_PLAN')} />
                <Grid container style={{ marginTop: '10px' }}>
                  <Grid>
                    <InputField type="radio" name="applyReplenishmentPlan" control={control} options={applyReplenishmentPlanOptions} style={{ paddingRight: 0, marginRight: 0, width: '260px', height: '80px' }} />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid style={{ width: '34.4%' }}>
              <Card variant="outlined" className={classes.card} style={{ height: 'calc(100%-24px)', padding: '0 !important' }}>
                <CardHeader title={transLangKey('REQ_CREATE_LOC_LEVEL')} />
                <Grid container style={{ marginTop: '10px' }}>
                  <Grid>
                    <InputField type="radio" name="reqCreateLocLevel" control={control} options={reqCreateLocLevelOptions} style={{ paddingRight: 0, marginRight: 0, width: '260px', height: '80px' }} />
                  </Grid>
                  <Grid>
                    <Box display="flex" justifyContent="flex-start" sx={{ padding: '20px 15px' }}>
                      <Box style={{ color: 'text.primary', paddingTop: 6, px: 12 }}>
                        {transLangKey('LOCAT_TP_NM')}
                      </Box>
                      <Controller name="reqLocationName" control={control} rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                          <TextField sx={{ width: 70, px: 5 }} variant="standard" value={value} onChange={onChange}
                                     InputProps={{ classes: { root: `${classes.input} ${classes.readOnlyInput}` }, readOnly: true, inputProps: { style:{ textAlign: 'center' } } }}
                          />
                        )}
                      />
                      <Box style={{ color: 'text.primary', paddingTop: 5, px: 12 }}>
                        {transLangKey('LOCAT_LV')}
                      </Box>
                      <Controller name="reqLocationLevel" control={control} rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                          <TextField sx={{ width: 70, px: 5 }} variant="standard" value={value} onChange={onChange}
                                     InputProps={{ classes: { root: `${classes.input} ${classes.readOnlyInput}` }, readOnly: true, inputProps: { style:{ textAlign: 'center' } } }}
                          />
                        )}
                      />
                      <Button variant="outlined" sx={{ margin: '3.5px 15px 3.5px 0', borderRadius: 1, borderColor: 'rgba(0, 0, 0, 0.23)', width: 90, height: 35 }}
                              onClick={() => { setReqLocationPopupOpen(true) }} disabled={watch('reqCreateLocLevel') === 'E19D8581B4D349548D2F2DC696962ECE'}>
                        {transLangKey('LOCAT_CHOICE')}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <RightButtonArea>
              <Grid container direction="row" justifyContent="flex-end">
                <Grid item xs="auto">
                  <Button variant="outlined" sx={{ borderRadius: 4, minWidth: 110, width: 'fit-content' }} startIcon={<Icon.Check style={{ color: '#1976d2' }} />} onClick={savePlanningMethod}>
                    {transLangKey('OK')}
                  </Button>
                </Grid>
              </Grid>
            </RightButtonArea>
          </Grid>
        </Grid>
      </Grid>
      {estLocationPopupOpen && (<PopSelectLocation open={estLocationPopupOpen} onClose={() => { setEstLocationPopupOpen(false) }} confirm={onEstSetLocation} />)}
      {reqLocationPopupOpen && (<PopSelectLocation open={reqLocationPopupOpen} onClose={() => { setReqLocationPopupOpen(false) }} confirm={onReqSetLocation} />)}
    </>
  )
}

export default forwardRef(PlanningMethod);
