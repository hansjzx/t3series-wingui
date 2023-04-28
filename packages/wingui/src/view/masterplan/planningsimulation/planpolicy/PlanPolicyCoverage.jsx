import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Grid, Button, Card, CardHeader } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { InputField, RightButtonArea, zAxios } from '@zionex/wingui-core/src/common/imports';
import { useUserStore } from '@zionex/wingui-core/src/store/userStore';
import PopSelectLocation from './PopSelectLocation';

const usePlanPolicyCoverageStyles = makeStyles({
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

export function PlanPolicyCoverage(props, ref) {
  const classes = usePlanPolicyCoverageStyles();
  const [username] = useUserStore(state => [state.username]);
  const [locationPopupOpen, setLocationPopupOpen] = useState(false);
  const [prebuildLimitValOptions, setPrebuildLimitValOptions] = useState([]);
  const [duedateDelayLimitValOptions, setDuedateDelayLimitValOptions] = useState([]);
  const [deliveryPlanPoicyOptions, setDeliveryPlanPoicyOptions] = useState([]);
  const [planDelayCycleOptions, setPlanDelayCycleOptions] = useState([]);
  const [newDeliveryPolicyOptions, setNewDeliveryPolicyOptions] = useState([]);

  const [timeBucket, setTimeBucket] = useState('');
  const { control, getValues, setValue } = useForm({
    defaultValues: {
      planPolicyId: '',
      locationId: '',
      locationName: '',
      locationLevel: '',
      prebuildLimitVal: '',
      duedateDelayLimitVal: '',
      deliveryPlanPoicy: '',
      planDelayCycle: '',
      newDeliveryPolicy: ''
    }
  });

  useImperativeHandle(ref, () => ({
    initLoad(planPolicyId) {
      if (planPolicyId && planPolicyId !== '') {
        setValue('planPolicyId', planPolicyId);
        loadTimeBucket();
        loadPlanPolicyDetails(planPolicyId);
      }
    }
  }));

  function loadTimeBucket() {
    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
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
          let prebuildLimitValOptions = [];
          let duedateDelayLimitValOptions = [];
          let deliveryPlanPoicyOptions = [];
          let planDelayCycleOptions = [];
          let newDeliveryPolicyOptions = [];

          res.data.RESULT_DATA.map((data) => {
            if (data.ITEM_ID === "M00250000") {
              var obj = { label: transLangKey(data.PLAN_POLICY_NM), value: data.DTL_ID }
              if (data.CHECKED === "Y") {
                setValue('prebuildLimitVal', data.DTL_ID);
              }
              prebuildLimitValOptions.push(obj);
            } else if (data.ITEM_ID === "M00260000") {
              var obj = { label: transLangKey(data.PLAN_POLICY_NM), value: data.DTL_ID }
              if (data.CHECKED === "Y") {
                setValue('duedateDelayLimitVal', data.DTL_ID);
              }
              duedateDelayLimitValOptions.push(obj);
            } else if (data.ITEM_ID === "M00270000") {
              setValue('newDelayAllowSet', data.VAL_06 ? data.VAL_06 : '');
            } else if (data.ITEM_ID === "M00660000") {
              var obj = { label: transLangKey(data.PLAN_POLICY_NM), value: data.DTL_ID }
              if (data.CHECKED === "Y") {
                setValue('deliveryPlanPoicy', data.DTL_ID);
              }
              deliveryPlanPoicyOptions.push(obj);
            } else if (data.ITEM_ID === "M00670000") {
              setValue('newDelayLtSet', data.VAL_06 ? data.VAL_06 : '');
            } else if (data.ITEM_ID === "M00311000") {
              var obj = { label: transLangKey(data.PLAN_POLICY_NM), value: data.DTL_ID }
              if (data.CHECKED === "Y") {
                setValue('planDelayCycle', data.DTL_ID);
              }
              planDelayCycleOptions.push(obj);
            } else if (data.ITEM_ID === "M00310000") {
              var obj = { label: transLangKey(data.PLAN_POLICY_NM), value: data.DTL_ID }
              if (data.CHECKED === "Y") {
                setValue('newDeliveryPolicy', data.DTL_ID);
              } else {
                setValue('newDeliveryPolicy', '');
              }
              newDeliveryPolicyOptions.push(obj);
            }
          });

          setPrebuildLimitValOptions(prebuildLimitValOptions);
          setDuedateDelayLimitValOptions(duedateDelayLimitValOptions);
          setDeliveryPlanPoicyOptions(deliveryPlanPoicyOptions);
          setPlanDelayCycleOptions(planDelayCycleOptions);
          setNewDeliveryPolicyOptions(newDeliveryPolicyOptions);
        }
      })
      .catch(function (err) {
        console.log(err);
      })
  }

  function savePlanPolicyCoverage() {
    let param = new URLSearchParams();

    param.append('PP_ID', getValues('planPolicyId'));
    param.append('CON_ID', 'PP_CON_05');
    param.append('VAL_01', getValues('prebuildLimitVal'));
    param.append('VAL_02', getValues('duedateDelayLimitVal'));
    param.append('VAL_03', getValues('newDelayAllowSet'));
    param.append('VAL_04', getValues('deliveryPlanPoicy'));
    param.append('VAL_05', getValues('newDelayLtSet'));
    param.append('VAL_06', getValues('newDeliveryPolicy'));
    param.append('VAL_07', '');
    param.append('VAL_08', '');
    param.append('VAL_09', '');
    param.append('VAL_10', '');
    param.append('VAL_11', '');
    param.append('VAL_12', '');
    param.append('VAL_13', '');
    param.append('VAL_14', '');
    param.append('VAL_15', '');
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
        <Grid>
          <Grid container gap={5}>
            <Grid style={{ width: '49.6%' }}>
              <Card variant="outlined" className={classes.card} style={{ height: 'calc(100%-24px)', padding: '0 !important' }}>
                <CardHeader title={transLangKey('PREBUILD_LIMIT_VAL')} />
                <Grid container style={{ marginTop: '10px' }}>
                  <Grid>
                    <InputField type="radio" name="prebuildLimitVal" control={control} options={prebuildLimitValOptions} style={{ paddingRight: 0, marginRight: 0, width: '260px', height: '80px' }} />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid style={{ width: '49.6%' }}>
              <Card variant="outlined" className={classes.card} style={{ height: 'calc(100%-24px)', padding: '0 !important' }}>
                <CardHeader title={transLangKey('DUEDATE_DELAY_LIMIT_VAL')} />
                <Grid container style={{ marginTop: '10px' }}>
                  <Grid>
                    <InputField type="radio" name="duedateDelayLimitVal" control={control} options={duedateDelayLimitValOptions} style={{ paddingRight: 0, marginRight: 0, width: '260px', height: '80px' }} />
                  </Grid>
                  <Grid>
                    <Grid container direction="column">
                      <Grid>
                        <InputField name="newDelayAllowSet" label={transLangKey("NEW_DELAY_ALLOW_SET")} control={control} style={{ width: 190, minWidth: 190, paddingLeft: 0, paddingRight: 5 }} />
                        {timeBucket}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid style={{ width: '49.6%' }}>
              <Card variant="outlined" className={classes.card} style={{ height: 'calc(100%-24px)', padding: '0 !important' }}>
                <CardHeader title={transLangKey('PLAN_DELAY_CYCLE')} />
                <Grid container style={{ marginTop: '10px' }}>
                  <Grid>
                    <InputField type="radio" name="deliveryPlanPoicy" control={control} options={deliveryPlanPoicyOptions} style={{ paddingRight: 0, marginRight: 0, width: '260px', height: '80px' }} />
                  </Grid>
                  <Grid>
                    <Grid container direction="column">
                      <Grid>
                        <InputField name="newDelayLtSet" label={transLangKey("NEW_DELAY_LT_SET")} control={control} style={{ width: 170, minWidth: 170, paddingLeft: 0, paddingRight: 5 }} />
                        {timeBucket}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid style={{ width: '49.6%' }}>
              <Card variant="outlined" className={classes.card} style={{ height: 'calc(100%-24px)', padding: '0 !important' }}>
                <CardHeader title={transLangKey('DELIVY_PLAN_POLICY_NM')} />
                <Grid container style={{ marginTop: '10px' }}>
                  <Grid>
                    <InputField type="radio" name="planDelayCycle" control={control} options={planDelayCycleOptions} style={{ paddingRight: 0, marginRight: 0, width: '260px', height: '80px' }} />
                  </Grid>
                  <Grid>
                    <Grid container direction="column">
                      <Grid>
                        <InputField type="select" name="newDeliveryPolicy" control={control} options={newDeliveryPolicyOptions} style={{ width: 170, minWidth: 170, paddingLeft: 0, paddingRight: 5 }} />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <RightButtonArea>
              <Grid container direction="row" justifyContent="flex-end">
                <Grid item xs="auto">
                  <Button variant="outlined" sx={{ borderRadius: 4, minWidth: 110, width: 'fit-content' }} startIcon={<Icon.Check style={{ color: '#1976d2' }} />} onClick={savePlanPolicyCoverage}>
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

export default forwardRef(PlanPolicyCoverage);
