import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Grid, Button, Card, CardHeader } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { InputField, RightButtonArea, zAxios } from '@zionex/wingui-core/src/common/imports';
import { useUserStore } from '@zionex/wingui-core/src/store/userStore';

const useAllocationRuleSiteStyles = makeStyles({
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
      width: '275px'
    }
  }
});

export function AllocationRuleSite(props, ref) {
  const classes = useAllocationRuleSiteStyles();
  const [username] = useUserStore(state => [state.username]);
  const [allocRuleOptions, setAllocRuleOptions] = useState([]);
  const [useCostOptions, setUseCostOptions] = useState([]);
  const [assignSiteOptions, setAssignSiteOptions] = useState([]);
  const [heuristicsModeOptions, setHeuristicsModeOptions] = useState([]);

  const { getValues, setValue, control } = useForm({
    defaultValues: {
      planPolicyId: '',
      allocRule: '',
      useCost: '',
      allocFirstSite: [],
      assignSite: '',
      heuristicsMode: '2',
      maxOrderSearchCnt: ''
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
          let allocRuleOptions = [];
          let useCostOptions = [];
          let assignSiteOptions = [];
          let heuristicsModeOptions = [];

          res.data.RESULT_DATA.map((data) => {
            if (data.ITEM_ID === "M00370000") {
              var obj = { label: transLangKey(data.PLAN_POLICY_NM), value: data.DTL_ID }
              if (data.CHECKED === "Y") {
                setValue('allocRule', data.DTL_ID);
              }
              allocRuleOptions.push(obj);
            }

            if (data.ITEM_ID === "M00380000") {
              var obj = { label: transLangKey(data.PLAN_POLICY_NM), value: data.DTL_ID }
              if (data.CHECKED === "Y") {
                setValue('useCost', data.DTL_ID);
              }
              useCostOptions.push(obj);
            }

            if (data.ITEM_ID === "M00390000") {
              if (data.CHECKED) {
                setValue('allocFirstSite', ["Y"]);
              }
            }

            if (data.ITEM_ID === "M00400000") {
              var obj = { label: transLangKey(data.PLAN_POLICY_NM), value: data.DTL_ID }
              if (data.CHECKED === "Y") {
                setValue('assignSite', data.DTL_ID);
              }
              assignSiteOptions.push(obj);
            }

            if (data.ITEM_ID === "M00640000") {
              var obj = { label: transLangKey(data.PLAN_POLICY_NM), value: data.DTL_ID }
              if (data.CHECKED === "Y") {
                setValue('heuristicsMode', data.DTL_ID);
              }
              heuristicsModeOptions.push(obj);
            }

            if (data.ITEM_ID === "M00650000") {
              setValue('maxOrderSearchCnt', data.VAL_06);
            }
          });

          setAllocRuleOptions(allocRuleOptions);
          setUseCostOptions(useCostOptions);
          setAssignSiteOptions(assignSiteOptions);
          setHeuristicsModeOptions(heuristicsModeOptions);
        }
      })
      .catch(function (err) {
        console.log(err);
      })
  }

  function saveAllocationRuleSite() {
    let param = new URLSearchParams();

    param.append('PP_ID', getValues('planPolicyId'));
    param.append('CON_ID', 'PP_CON_11');
    param.append('VAL_01', getValues('allocRule'));
    param.append('VAL_02', getValues('useCost'));
    param.append('VAL_03', getValues('allocFirstSite').join("") === 'Y' ? true : false);
    param.append('VAL_04', getValues('assignSite'));
    param.append('VAL_05', getValues('heuristicsMode'));
    param.append('VAL_06', getValues('maxOrderSearchCnt'));
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
                <CardHeader title={transLangKey('ALLOC_RULE')} />
                <Grid container style={{ marginTop: '10px' }}>
                  <Grid>
                    <InputField type="radio" name="allocRule" control={control} options={allocRuleOptions} style={{ paddingRight: 0, marginRight: 0, width: '260px', height: '80px' }} />
                  </Grid>
                  <Grid>
                    <InputField type="radio" name="useCost" control={control} options={useCostOptions} style={{ paddingRight: 0, marginRight: 0, width: '350px', height: '80px' }} />
                  </Grid>
                  <Grid>
                    <InputField type='check' name='allocFirstSite' control={control} options={[{ label: transLangKey('ALLOC_FIRST_SITE'), value: 'Y' }]} />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid style={{ width: '49.6%' }}>
              <Card variant="outlined" className={classes.card} style={{ height: 'calc(100%-24px)', padding: '0 !important' }}>
                <CardHeader title={transLangKey('ASSIGN_SITE')} />
                <Grid container style={{ marginTop: '10px' }}>
                  <Grid>
                    <InputField type="radio" name="assignSite" control={control} options={assignSiteOptions} style={{ paddingRight: 0, marginRight: 0, width: '260px', height: '80px' }} />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid style={{ width: '49.6%' }}>
              <Card variant="outlined" className={classes.card} style={{ height: 'calc(100%-24px)', padding: '0 !important' }}>
                <CardHeader title={transLangKey('HEURISTICS_MODE')} />
                <Grid container style={{ marginTop: '10px' }}>
                  <Grid>
                    <InputField type="radio" name="heuristicsMode" control={control} options={heuristicsModeOptions} style={{ paddingRight: 0, marginRight: 0, width: '320px', height: '120px' }} />
                  </Grid>
                  <Grid>
                    <InputField name="maxOrderSearchCnt" label={transLangKey("MAX_ORDER_SEARCH_CNT")} control={control} style={{ width: 190, minWidth: 190, paddingLeft: 0, paddingRight: 5 }} />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <RightButtonArea>
              <Grid container direction="row" justifyContent="flex-end">
                <Grid item xs="auto">
                  <Button variant="outlined" sx={{ borderRadius: 4, minWidth: 110, width: 'fit-content' }} startIcon={<Icon.Check style={{ color: '#1976d2' }} />} onClick={saveAllocationRuleSite}>
                    {transLangKey('OK')}
                  </Button>
                </Grid>
              </Grid>
            </RightButtonArea>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default forwardRef(AllocationRuleSite);
