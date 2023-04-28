import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Box, Grid, TextField, Button, Card, CardHeader } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { InputField, RightButtonArea, zAxios } from '@zionex/wingui-core/src/common/imports';
import { useUserStore } from '@zionex/wingui-core/src/store/userStore';
import PopSelectLocation from './PopSelectLocation';

const useDemandFacingLevelStyles = makeStyles({
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

export function DemandFacingLevel(props, ref) {
  const classes = useDemandFacingLevelStyles();
  const [username] = useUserStore(state => [state.username])
  const [locationPopupOpen, setLocationPopupOpen] = useState(false);
  const [fixedProductPlanOptions, setFixedProductPlanOptions] = useState([]);
  const [fixedRollingPlanOptions, setFixedRollingPlanOptions] = useState([]);
  const [fixedAdjtPlanOptions, setFixedAdjtPlanOptions] = useState([]);
  const [halfProductIntegSupplyPlanOptions, setHalfProductIntegSupplyPlanOptions] = useState([]);

  const [timeBucket, setTimeBucket] = useState('');
  const { control, getValues, setValue } = useForm({
    defaultValues: {
      planPolicyId: '',
      locationId: '',
      locationName: '',
      locationLevel: '',
      fixedProductPlan: '',
      newFixReplshPlanHorizon: '',
      fixedRollingPlan: '',
      fixRollProdPlanHorizon: '',
      fixRollShipPlanHorizon: '',
      fixedAdjtPlan: '',
      fixAdjtProdPlanHorizon: '',
      fixAdjtShipPlanHorizon: '',
      halfProductIntegSupplyPlan: ''
    }
  });

  useImperativeHandle(ref, () => ({
    initLoad(planPolicyId) {
      if (planPolicyId && planPolicyId !== '') {
        setValue('planPolicyId', planPolicyId);
        loadTimeBucket();
        zAxios({
          method: 'post',
          url: 'engine/mp/SRV_UI_CM_15_Q8',
          data: new FormData(),
          fromPopup: true
        })
          .then(function (res) {
            if (res.status === gHttpStatus.SUCCESS) {
              loadPlanPolicyDetails(planPolicyId, res.data.RESULT_DATA);
            }
          })
          .catch(function (err) {
            console.log(err);
          });
      }
    }
  }));

  function loadTimeBucket() {
    zAxios({
      method: 'post',
      url: 'engine/mp/SRV_UI_CM_15_Q9',
      data: new FormData(),
      fromPopup: true
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          if (res.data.RESULT_DATA.length != 0) {
            setTimeBucket(res.data.RESULT_DATA[0].TIME_BUKT);
          }
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }
  function loadPlanPolicyDetails(planPolicyId, locationData) {
    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_CM_15_Q3',
      params: {
        'PLAN_POLICY_ID': planPolicyId
      }
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          let fixedProductPlanOptions = [];
          let fixedRollingPlanOptions = [];
          let fixedAdjtPlanOptions = [];
          let halfProductIntegSupplyPlanOptions = [];

          let resultArr = res.data.RESULT_DATA.filter((data) => data.ITEM_ID === "M00110000");

          if (locationData) {
            let locationArr = locationData.filter((data) => data.LOCAT_ID === resultArr[0].VAL_02);
            setValue('locationName', locationArr.length != 0 ? locationArr[0].LOCAT_NM : '');
          }

          if (resultArr.length != 0) {
            setValue('locationId', resultArr[0].VAL_02);
            setValue('locationLevel', resultArr[0].VAL_06);
          }

          res.data.RESULT_DATA.map((data) => {
            if (data.ITEM_ID === "M00120000") {
              var obj = { label: transLangKey(data.PLAN_POLICY_NM), value: data.DTL_ID }
              if (data.CHECKED === "Y") {
                setValue('fixedProductPlan', data.DTL_ID);
              }
              fixedProductPlanOptions.push(obj);
            } else if (data.ITEM_ID === "M00130000") {
              setValue('newFixReplshPlanHorizon', data.VAL_06 ? data.VAL_06 : '');
            } else if (data.ITEM_ID === "M00140000") {
              var obj = { label: transLangKey(data.PLAN_POLICY_NM), value: data.DTL_ID }
              if (data.CHECKED === "Y") {
                setValue('fixedRollingPlan', data.DTL_ID);
              }
              fixedRollingPlanOptions.push(obj);
            } else if (data.ITEM_ID === "M00150000") {
              setValue('fixRollProdPlanHorizon', data.VAL_06 ? data.VAL_06 : '');
            } else if (data.ITEM_ID === "M00151000") {
              setValue('fixRollShipPlanHorizon', data.VAL_06 ? data.VAL_06 : '');
            } else if (data.ITEM_ID === "M00160000") {
              var obj = { label: transLangKey(data.PLAN_POLICY_NM), value: data.DTL_ID }
              if (data.CHECKED === "Y") {
                setValue('fixedAdjtPlan', data.DTL_ID);
              }
              fixedAdjtPlanOptions.push(obj);
            } else if (data.ITEM_ID === "M00170000") {
              setValue('fixAdjtProdPlanHorizon', data.VAL_06 ? data.VAL_06 : '');
            } else if (data.ITEM_ID === "M00180000") {
              setValue('fixAdjtShipPlanHorizon', data.VAL_06 ? data.VAL_06 : '');
            } else if (data.ITEM_ID === "M00190000") {
              var obj = { label: transLangKey(data.PLAN_POLICY_NM), value: data.DTL_ID }
              if (data.CHECKED === "Y") {
                setValue('halfProductIntegSupplyPlan', data.DTL_ID);
              }
              halfProductIntegSupplyPlanOptions.push(obj);
            }
          });

          setFixedProductPlanOptions(fixedProductPlanOptions);
          setFixedRollingPlanOptions(fixedRollingPlanOptions);
          setFixedAdjtPlanOptions(fixedAdjtPlanOptions);
          setHalfProductIntegSupplyPlanOptions(halfProductIntegSupplyPlanOptions);
        }
      })
      .catch(function (err) {
        console.log(err);
      })
  }

  function saveDemandFacingLevel() {
    let param = new URLSearchParams();

    param.append('PP_ID', getValues('planPolicyId'));
    param.append('CON_ID', 'PP_CON_02');
    param.append('VAL_01', getValues('locationName'));
    param.append('VAL_02', getValues('locationLevel'));
    param.append('VAL_03', getValues('fixedProductPlan'));
    param.append('VAL_04', getValues('newFixReplshPlanHorizon'));
    param.append('VAL_05', getValues('fixedRollingPlan'));
    param.append('VAL_06', getValues('fixRollProdPlanHorizon'));
    param.append('VAL_07', getValues('fixRollShipPlanHorizon'));
    param.append('VAL_08', getValues('fixedAdjtPlan'));
    param.append('VAL_09', getValues('fixAdjtProdPlanHorizon'));
    param.append('VAL_10', getValues('fixAdjtShipPlanHorizon'));
    param.append('VAL_11', getValues('halfProductIntegSupplyPlan'));
    param.append('VAL_12', getValues('locationId'));
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

  function onSetLocation(dataRow) {
    setValue('locationId', dataRow.LOCAT_ID);
    setValue('locationName', dataRow.LOCAT_NM);
    setValue('locationLevel', dataRow.LOCAT_LV);
  }

  return (
    <>
      <Grid container gap={5} direction="column">
        <Grid item sx={{ height: '83px', pt: '0 !important' }}>
          <Card variant="outlined" className={classes.card} style={{ width: '100%', height: '100%', padding: '0 !important' }}>
            <Box display="flex" justifyContent="flex-start" sx={{ padding: '20px 15px' }}>
              <Box style={{ color: 'text.primary', fontSize: 17, paddingTop: 6, px: 12 }}>
                {transLangKey('LOCAT_TP_NM')}
              </Box>
              <Controller name="locationName" control={control} rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <TextField sx={{ width: 150 }} variant="standard" value={value} onChange={onChange} InputProps={{ classes: { root: `${classes.input} ${classes.readOnlyInput}` }, readOnly: true, inputProps: { style:{ textAlign: 'center' } } }} />
                )}
              />
              <Box style={{ color: 'text.primary', fontSize: 17, paddingTop: 5, px: 12 }}>
                {transLangKey('LOCAT_LV')}
              </Box>
              <Controller name="locationLevel" control={control} rules={{ required: true }}
                render={({ field: { onChange, value } }) => (
                  <TextField sx={{ width: 100, px: 5 }} variant="standard" value={value} onChange={onChange} InputProps={{ classes: { root: `${classes.input} ${classes.readOnlyInput}` }, readOnly: true, inputProps: { style:{ textAlign: 'center' } } }} />
                )}
              />
              <Button variant="outlined" sx={{ margin: '3.5px 15px 3.5px 0', borderRadius: 1, borderColor: 'rgba(0, 0, 0, 0.23)', width: 90, height: 35 }}
                      onClick={() => { setLocationPopupOpen(true) }}>{transLangKey('LOCAT_CHOICE')}
              </Button>
            </Box>
          </Card>
        </Grid>
        <Grid>
          <Grid container gap={5}>
            <Grid style={{ width: '49.6%' }}>
              <Card variant="outlined" className={classes.card} style={{ height: 'calc(100%-24px)', padding: '0 !important' }}>
                <CardHeader title={transLangKey('FIXED_PRDUCT_PLAN')} />
                <Grid container style={{ marginTop: '10px' }}>
                  <Grid>
                    <InputField type="radio" name="fixedProductPlan" control={control} options={fixedProductPlanOptions} style={{ paddingRight: 0, marginRight: 0, width: '260px', height: '120px' }} />
                  </Grid>
                  <Grid>
                    <InputField name="newFixReplshPlanHorizon" label={transLangKey("NEW_FIX_REPLSH_PLAN_HORIZ")} control={control} style={{ width: 160, minWidth: 160, paddingLeft: 0, paddingRight: 5 }} />
                    {timeBucket}
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid style={{ width: '49.6%' }}>
              <Card variant="outlined" className={classes.card} style={{ height: 'calc(100%-24px)', padding: '0 !important' }}>
                <CardHeader title={transLangKey('FIXED_ROLLING_PLAN')} />
                <Grid container style={{ marginTop: '10px' }}>
                  <Grid>
                    <InputField type="radio" name="fixedRollingPlan" control={control} options={fixedRollingPlanOptions} style={{ paddingRight: 0, marginRight: 0, width: '260px', height: '120px' }} />
                  </Grid>
                  <Grid>
                    <Grid container direction="column">
                      <Grid>
                        <InputField name="fixRollProdPlanHorizon" label={transLangKey("FIX_ROLL_PROD_PLAN_HORZ")} control={control} style={{ width: 160, minWidth: 160, paddingLeft: 0, paddingRight: 5 }} />
                        {timeBucket}
                      </Grid>
                      <Grid>
                        <InputField name="fixRollShipPlanHorizon" label={transLangKey("FIX_ROLL_SHIP_PLAN_HORZ")} control={control} style={{ width: 160, minWidth: 160, paddingLeft: 0, paddingRight: 5 }} />
                        {timeBucket}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid style={{ width: '49.6%' }}>
              <Card variant="outlined" className={classes.card} style={{ height: 'calc(100%-24px)', padding: '0 !important' }}>
                <CardHeader title={transLangKey('FIXED_ADJT_PLAN')} />
                <Grid container style={{ marginTop: '10px' }}>
                  <Grid>
                    <InputField type="radio" name="fixedAdjtPlan" control={control} options={fixedAdjtPlanOptions} style={{ paddingRight: 0, marginRight: 0, width: '260px', height: '120px' }} />
                  </Grid>
                  <Grid>
                    <Grid container direction="column">
                      <Grid>
                        <InputField name="fixAdjProdPlanHorizon" label={transLangKey("FIX_ADJ_PROD_PLAN_HORZ")} control={control}style={{ width: 160, minWidth: 160, paddingLeft: 0, paddingRight: 5 }} />
                        {timeBucket}
                      </Grid>
                      <Grid>
                        <InputField name="fixAdjShipPlanHorizon" label={transLangKey("FIX_ADJ_SHIP_PLAN_HORZ")} control={control} style={{ width: 160, minWidth: 160, paddingLeft: 0, paddingRight: 5 }} />
                        {timeBucket}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid style={{ width: '49.6%' }}>
              <Card variant="outlined" className={classes.card} style={{ height: 'calc(100%-24px)', padding: '0 !important' }}>
                <CardHeader title={transLangKey('HFPRDUCT_INTEG_SUPPLY_PLAN_SET')} />
                <Grid container style={{ marginTop: '10px' }}>
                  <Grid>
                    <InputField type="radio" name="halfProductIntegSupplyPlan" control={control} options={halfProductIntegSupplyPlanOptions} style={{ paddingRight: 0, marginRight: 0, width: '500px', height: '120px' }} />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <RightButtonArea>
              <Grid container direction="row" justifyContent="flex-end">
                <Grid item xs="auto">
                  <Button variant="outlined" sx={{ borderRadius: 4, minWidth: 110, width: 'fit-content' }} startIcon={<Icon.Check style={{ color: '#1976d2' }} />} onClick={saveDemandFacingLevel}>
                    {transLangKey('OK')}
                  </Button>
                </Grid>
              </Grid>
            </RightButtonArea>
          </Grid>
        </Grid>
      </Grid>
      {locationPopupOpen && (<PopSelectLocation open={locationPopupOpen} onClose={() => { setLocationPopupOpen(false) }} confirm={onSetLocation} />)}
    </>
  )
}

export default forwardRef(DemandFacingLevel);
