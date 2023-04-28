import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Box, Grid, TextField, Button, Card, CardHeader } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { InputField, RightButtonArea, zAxios } from '@zionex/wingui-core/src/common/imports';
import { useUserStore } from '@zionex/wingui-core/src/store/userStore';
import PopSelectLocation from './PopSelectLocation';

const usePlanOptionStyles = makeStyles({
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
      width: '245px'
    }
  }
});

export function PlanOption(props, ref) {
  const classes = usePlanOptionStyles();
  const [username] = useUserStore(state => [state.username]);
  const [matConstOptions, setMatConstOptions] = useState([]);
  const [matConstTpOptions, setMatConstTpOptions] = useState([]);
  const [stockAssignOptions, setStockAssignOptions] = useState([]);
  const [locationPopupOpen, setLocationPopupOpen] = useState(false);
  const [stockAssignSeqOptions, setStockAssignSeqOptions] = useState([]);
  const [holidayAroundPlanDivideOptions, setHolidayAroundPlanDivideOptions] = useState([]);
  const [planQtyUomOptions, setPlanQtyUomOptions] = useState([]);
  const [stockPeggingPolicyOptions, setStockPeggingPolicyOptions] = useState([]);
  const [dummyResCapaOptions, setDummyResCapaOptions] = useState([]);
  const [salesResultColectMethodOptions, setSalesResultColectMethodOptions] = useState([]);
  const [useStockInfoOptions, setUseStockInfoOptions] = useState([]);
  const [useOvrCapaOptions, setUseOvrCapaOptions] = useState([]);

  const [timeBucket, setTimeBucket] = useState('');
  const { getValues, setValue, control, watch } = useForm({
    defaultValues: {
      planPolicyId: '',
      matConst: '',
      matConstTp: '',
      constTpChngPeriod: '',
      allocProdStock: [],
      stockAssign: '',
      locationId: '',
      locationName: '',
      locationLevel: '',
      allocLateStock: [],
      stockAssignSeq: '',
      holidayAroundPlanDivide: '',
      planQtyUom: '',
      stockPeggingPolicy: '',
      dummyResCapa: '',
      salesResultColectMethod: '',
      useStockInfo: '',
      useOvrCapa: ''
    }
  });

  const watchMatConst = watch('matConst');
  const allocProdStock = watch('allocProdStock');
  const watchStockAssign = watch('stockAssign');

  useEffect(() => {
    if (watchMatConst === '3D2ED7203CBC4DC686ABA5FC6F32A2BF') {
      setValue('matConstTp', '');
      setValue('constTpChngPeriod', '');
    }
  }, [watchMatConst]);

  useEffect(() => {
    if (!allocProdStock.length) {
      setValue('locationId', '');
      setValue('locationName', '');
      setValue('locationLevel', '');
    }
  }, [allocProdStock]);

  useEffect(() => {
    if (watchStockAssign === 'F3696DADC58749BA845A33AF68EA92C4') {
      setValue('locationId', '');
      setValue('locationName', '');
      setValue('locationLevel', '');
    }
  }, [watchStockAssign]);

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
          let matConstTpOptions = [];
          let matConstOptions = [];
          let stockAssignOptions = [];
          let stockAssignSeqOptions = [];
          let holidayAroundPlanDivideOptions = [];
          let planQtyUomOptions = [];
          let stockPeggingPolicyOptions = [];
          let dummyResCapaOptions = [];
          let salesResultColectMethodOptions = [];
          let useStockInfoOptions = [];
          let useOvrCapaOptions = [];

          res.data.RESULT_DATA.map((data) => {
            if (data.ITEM_ID === "M00510000") {
              var obj = { label: transLangKey(data.PLAN_POLICY_NM), value: data.DTL_ID }
              if (data.CHECKED === "Y") {
                setValue('matConstTp', data.DTL_ID);
              }
              matConstTpOptions.push(obj);
            }

            if (data.ITEM_ID === "M00511000") {
              var obj = { label: transLangKey(data.PLAN_POLICY_NM), value: data.DTL_ID }
              if (data.CHECKED === "Y") {
                setValue('matConst', data.DTL_ID);
              }
              matConstOptions.push(obj);
            }

            if (data.ITEM_ID === "M00530000") {
              if (data.VAL_01 === "Y") {
                setValue('allocProdStock', [data.VAL_01]);
              }
            }

            if (data.ITEM_ID === "M00540000") {
              var obj = { label: transLangKey(data.PLAN_POLICY_NM), value: data.DTL_ID }
              if (data.CHECKED === "Y") {
                setValue('stockAssign', data.DTL_ID);
              }
              stockAssignOptions.push(obj);
            }

            if (data.ITEM_ID === "M00550000") {
              if (data.VAL_01 === "Y") {
                setValue('allocLateStock', [data.VAL_01]);
              }
            }

            if (data.ITEM_ID === "M00560000") {
              var obj = { label: transLangKey(data.PLAN_POLICY_NM), value: data.DTL_ID }
              if (data.CHECKED === "Y") {
                setValue('stockAssignSeq', data.DTL_ID);
              }
              stockAssignSeqOptions.push(obj);
            }

            if (data.ITEM_ID === "M00570000") {
              var obj = { label: transLangKey(data.PLAN_POLICY_NM), value: data.DTL_ID }
              if (data.CHECKED === "Y") {
                setValue('holidayAroundPlanDivide', data.DTL_ID);
              }
              holidayAroundPlanDivideOptions.push(obj);
            }

            if (data.ITEM_ID === "M00580000") {
              var obj = { label: transLangKey(data.PLAN_POLICY_NM), value: data.DTL_ID }
              if (data.CHECKED === "Y") {
                setValue('planQtyUom', data.DTL_ID);
              }
              planQtyUomOptions.push(obj);
            }

            if (data.ITEM_ID === "M00590000") {
              setValue('locationId', data.VAL_02);
              setValue('locationName', data.VAL_01);
              setValue('locationLevel', data.VAL_06);
            }

            if (data.ITEM_ID === "M00610000") {
              var obj = { label: transLangKey(data.PLAN_POLICY_NM), value: data.DTL_ID }
              if (data.CHECKED === "Y") {
                setValue('stockPeggingPolicy', data.DTL_ID);
              }
              stockPeggingPolicyOptions.push(obj);
            }

            if (data.ITEM_ID === "M00620000") {
              var obj = { label: transLangKey(data.PLAN_POLICY_NM), value: data.DTL_ID }
              if (data.CHECKED === "Y") {
                setValue('dummyResCapa', data.DTL_ID);
              }
              dummyResCapaOptions.push(obj);
            }

            if (data.ITEM_ID === "M00630000") {
              var obj = { label: transLangKey(data.PLAN_POLICY_NM), value: data.DTL_ID }
              if (data.CHECKED === "Y") {
                setValue('salesResultColectMethod', data.DTL_ID);
              }
              salesResultColectMethodOptions.push(obj);
            }

            if (data.ITEM_ID === "M00680000") {
              var obj = { label: transLangKey(data.PLAN_POLICY_NM), value: data.DTL_ID }
              if (data.CHECKED === "Y") {
                setValue('useStockInfo', data.DTL_ID);
              }
              useStockInfoOptions.push(obj);
            }

            if (data.ITEM_ID === "M00720000") {
              var obj = { label: transLangKey(data.PLAN_POLICY_NM), value: data.DTL_ID }
              if (data.CHECKED === "Y") {
                setValue('useOvrCapa', data.DTL_ID);
              }
              useOvrCapaOptions.push(obj);
            }
          });

          setMatConstTpOptions(matConstTpOptions);
          setMatConstOptions(matConstOptions);
          setStockAssignOptions(stockAssignOptions);
          setStockAssignSeqOptions(stockAssignSeqOptions);
          setHolidayAroundPlanDivideOptions(holidayAroundPlanDivideOptions);
          setPlanQtyUomOptions(planQtyUomOptions);
          setStockPeggingPolicyOptions(stockPeggingPolicyOptions);
          setDummyResCapaOptions(dummyResCapaOptions);
          setSalesResultColectMethodOptions(salesResultColectMethodOptions);
          setUseStockInfoOptions(useStockInfoOptions);
          setUseOvrCapaOptions(useOvrCapaOptions);
        }
      })
      .catch(function (err) {
        console.log(err);
      })
  }

  function onSetLocation(dataRow) {
    setValue('locationId', dataRow.LOCAT_ID);
    setValue('locationName', dataRow.LOCAT_NM);
    setValue('locationLevel', dataRow.LOCAT_LV);
  }

  function savePlanOption() {
    let formData = new FormData();

    formData.append('PP_ID', getValues('planPolicyId'));
    formData.append('CON_ID', 'PP_CON_15');
    formData.append('VAL_01', getValues('matConstTp'));
    formData.append('VAL_02', getValues('matConst'));
    formData.append('VAL_03', getValues('constTpChngPeriod'));
    formData.append('VAL_04', getValues('allocProdStock').join("") === 'Y' ? true : false);
    formData.append('VAL_05', getValues('stockAssign'));
    formData.append('VAL_06', getValues('allocLateStock').join("") === 'Y' ? true : false);
    formData.append('VAL_07', getValues('stockAssignSeq'));
    formData.append('VAL_08', getValues('holidayAroundPlanDivide'));
    formData.append('VAL_09', getValues('planQtyUom'));
    formData.append('VAL_10', getValues('locationId'));
    formData.append('VAL_11', getValues('locationName'));
    formData.append('VAL_12', getValues('locationLevel'));
    formData.append('VAL_13', getValues('stockPeggingPolicy'));
    formData.append('VAL_14', getValues('dummyResCapa'));
    formData.append('VAL_15', getValues('salesResultColectMethod'));
    formData.append('VAL_16', getValues('useStockInfo'));
    formData.append('VAL_17', getValues('useOvrCapa'));
    formData.append('USER_ID', username);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        zAxios({
          method: 'post',
          url: baseURI() + 'engine/mp/SRV_UI_CM_15_S2',
          data: formData
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
                <CardHeader title={transLangKey('MAT_CONST')} />
                <Grid container style={{ marginTop: '10px' }}>
                  <Grid>
                    <InputField type="radio" name="matConst" control={control} options={matConstOptions} style={{ paddingRight: 0, marginRight: 0, width: '260px', height: '90px' }} />
                  </Grid>
                  <Grid>
                    <InputField type="select" name="matConstTp" label={transLangKey("MAT_CONST_TP")} control={control} options={matConstTpOptions}
                                disabled={watch('matConst') === '3D2ED7203CBC4DC686ABA5FC6F32A2BF'} />
                  </Grid>
                  <Grid>
                    <InputField name="constTpChngPeriod" label={transLangKey("CONST_TP_CHNG_PERIOD")} control={control} style={{ width: 190, minWidth: 190, paddingLeft: 0, paddingRight: 5 }} />
                    {timeBucket}
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid style={{ width: '49.6%' }}>
              <Card variant="outlined" className={classes.card} style={{ height: 'calc(100%-24px)', padding: '0 !important' }}>
                <CardHeader title={transLangKey('STOCK_ASSIGN')} />
                <Grid container style={{ marginTop: '10px' }}>
                  <Grid>
                    <InputField type='check' name='allocProdStock' control={control} options={[{ label: transLangKey('ALLOC_PROD_STOCK'), value: 'Y' }]} />
                  </Grid>
                  <Grid>
                    <InputField type="radio" name="stockAssign" control={control} options={stockAssignOptions} style={{ paddingRight: 0, marginRight: 0, width: '260px', height: '90px' }}
                                disabled={watch('allocProdStock').length === 0}/>
                  </Grid>
                  <Grid>
                    <Box display="flex" justifyContent="flex-start" sx={{ padding: '20px 15px' }}>
                      <Box style={{ color: 'text.primary', paddingTop: 6, px: 12 }}>
                        {transLangKey('LOCAT_TP_NM')}
                      </Box>
                      <Controller name="locationName" control={control} rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                          <TextField sx={{ width: 70, px: 5 }} variant="standard" value={value} onChange={onChange}
                                     InputProps={{ classes: { root: `${classes.input} ${classes.readOnlyInput}` }, readOnly: true, inputProps: { style:{ textAlign: 'center' } } }}
                          />
                        )}
                      />
                      <Box style={{ color: 'text.primary', paddingTop: 5, px: 12 }}>
                        {transLangKey('LOCAT_LV')}
                      </Box>
                      <Controller name="locationLevel" control={control} rules={{ required: true }}
                        render={({ field: { onChange, value } }) => (
                          <TextField sx={{ width: 70, px: 5 }} variant="standard" value={value} onChange={onChange}
                            InputProps={{ classes: { root: `${classes.input} ${classes.readOnlyInput}` }, readOnly: true, inputProps: { style:{ textAlign: 'center' } } }}
                          />
                        )}
                      />
                      <Button variant="outlined" sx={{ margin: '3.5px 15px 3.5px 0', borderRadius: 1, borderColor: 'rgba(0, 0, 0, 0.23)', width: 90, height: 35 }} onClick={() => { setLocationPopupOpen(true) }}
                              disabled={watch('stockAssign') === 'F3696DADC58749BA845A33AF68EA92C4' || watch('allocProdStock').length === 0}>
                        {transLangKey('LOCAT_CHOICE')}
                      </Button>
                    </Box>
                  </Grid>
                  <Grid>
                    <InputField type='check' name='allocLateStock' control={control} options={[{ label: transLangKey('ALLOC_LATE_STOCK'), value: 'Y' }]} />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid style={{ width: '24.39%' }}>
              <Card variant="outlined" className={classes.card} style={{ height: 'calc(100%-24px)', padding: '0 !important' }}>
                <CardHeader title={transLangKey('STOCK_ASSIGN_SEQ')} />
                <Grid container style={{ marginTop: '10px' }}>
                  <Grid>
                    <InputField type="radio" name="stockAssignSeq" control={control} options={stockAssignSeqOptions} style={{ paddingRight: 0, marginRight: 0, width: '260px', height: '120px' }} />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid style={{ width: '24.39%' }}>
              <Card variant="outlined" className={classes.card} style={{ height: 'calc(100%-24px)', padding: '0 !important' }}>
                <CardHeader title={transLangKey('HOLYDAY_AROUND_PLAN_DIVIDE')} />
                <Grid container style={{ marginTop: '10px' }}>
                  <Grid>
                    <InputField type="radio" name="holidayAroundPlanDivide" control={control} options={holidayAroundPlanDivideOptions} style={{ paddingRight: 0, marginRight: 0, width: '260px', height: '120px' }} />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid style={{ width: '24.39%' }}>
              <Card variant="outlined" className={classes.card} style={{ height: 'calc(100%-24px)', padding: '0 !important' }}>
                <CardHeader title={transLangKey('PLAN_QTY_UOM')} />
                <Grid container style={{ marginTop: '10px' }}>
                  <Grid>
                    <InputField type="radio" name="planQtyUom" control={control} options={planQtyUomOptions} style={{ paddingRight: 0, marginRight: 0, width: '260px', height: '120px' }} />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid style={{ width: '24.39%' }}>
              <Card variant="outlined" className={classes.card} style={{ height: 'calc(100%-24px)', padding: '0 !important' }}>
                <CardHeader title={transLangKey('STOCK_PEGGING_POLICY')} />
                <Grid container style={{ marginTop: '10px' }}>
                  <Grid>
                    <InputField type="radio" name="stockPeggingPolicy" control={control} options={stockPeggingPolicyOptions} style={{ paddingRight: 0, marginRight: 0, width: '260px', height: '120px' }} />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid style={{ width: '24.39%' }}>
              <Card variant="outlined" className={classes.card} style={{ height: 'calc(100%-24px)', padding: '0 !important' }}>
                <CardHeader title={transLangKey('DUMMY_RES_CAPA')} />
                <Grid container style={{ marginTop: '10px' }}>
                  <Grid>
                    <InputField type="radio" name="dummyResCapa" control={control} options={dummyResCapaOptions} style={{ paddingRight: 0, marginRight: 0, width: '260px', height: '80px' }} />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid style={{ width: '24.39%' }}>
              <Card variant="outlined" className={classes.card} style={{ height: 'calc(100%-24px)', padding: '0 !important' }}>
                <CardHeader title={transLangKey('SALES_RESULT_COLECT_METHOD')} />
                <Grid container style={{ marginTop: '10px' }}>
                  <Grid>
                    <InputField type="radio" name="salesResultColectMethod" control={control} options={salesResultColectMethodOptions} style={{ paddingRight: 0, marginRight: 0, width: '260px', height: '80px' }} />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid style={{ width: '24.39%' }}>
              <Card variant="outlined" className={classes.card} style={{ height: 'calc(100%-24px)', padding: '0 !important' }}>
                <CardHeader title={transLangKey('USE_STOCK_INFO')} />
                <Grid container style={{ marginTop: '10px' }}>
                  <Grid>
                    <InputField type="radio" name="useStockInfo" control={control} options={useStockInfoOptions} style={{ paddingRight: 0, marginRight: 0, width: '260px', height: '80px' }} />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid style={{ width: '24.39%' }}>
              <Card variant="outlined" className={classes.card} style={{ height: 'calc(100%-24px)', padding: '0 !important' }}>
                <CardHeader title={transLangKey('USE_OVR_CAPA')} />
                <Grid container style={{ marginTop: '10px' }}>
                  <Grid>
                    <InputField type="radio" name="useOvrCapa" control={control} options={useOvrCapaOptions} style={{ paddingRight: 0, marginRight: 0, width: '260px', height: '80px' }} />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <RightButtonArea>
              <Grid container direction="row" justifyContent="flex-end">
                <Grid item xs="auto">
                  <Button variant="outlined" sx={{ borderRadius: 4, minWidth: 110, width: 'fit-content' }} startIcon={<Icon.Check style={{ color: '#1976d2' }} />} onClick={savePlanOption}>
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

export default forwardRef(PlanOption);
