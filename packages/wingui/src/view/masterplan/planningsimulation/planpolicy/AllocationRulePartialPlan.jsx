import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Grid, Button, Card, CardHeader } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { InputField, RightButtonArea, zAxios } from '@zionex/wingui-core/src/common/imports';
import { useUserStore } from '@zionex/wingui-core/src/store/userStore';

const useAllocationRulePartialPlanStyles = makeStyles({
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
      width: '300px'
    }
  }
});

export function AllocationRulePartialPlan(props, ref) {
  const classes = useAllocationRulePartialPlanStyles();
  const [username] = useUserStore(state => [state.username]);
  const [orderDivideModeOptions, setOrderDivideModeOptions] = useState([]);
  const [orderDivideCriteriaOptions, setOrderDivideCriteriaOptions] = useState([]);

  const { getValues, setValue, control } = useForm({
    defaultValues: {
      planPolicyId: '',
      orderDivideMode: '',
      orderDivideCriteria: ''
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
          let orderDivideModeOptions = [];
          let orderDivideCriteriaOptions = [];

          res.data.RESULT_DATA.map((data) => {
            if (data.ITEM_ID === "M00460000") {
              var obj = { label: transLangKey(data.PLAN_POLICY_NM), value: data.DTL_ID }
              if (data.CHECKED === "Y") {
                setValue('orderDivideMode', data.DTL_ID);
              }
              orderDivideModeOptions.push(obj);
            }

            if (data.ITEM_ID === "M00600000") {
              var obj = { label: transLangKey(data.PLAN_POLICY_NM), value: data.DTL_ID }
              if (data.CHECKED === "Y") {
                setValue('orderDivideCriteria', data.DTL_ID);
              }
              orderDivideCriteriaOptions.push(obj);
            }
          });

          setOrderDivideModeOptions(orderDivideModeOptions);
          setOrderDivideCriteriaOptions(orderDivideCriteriaOptions);
        }
      })
      .catch(function (err) {
        console.log(err);
      })
  }

  function saveAllocationRulePartialPlan() {
    let param = new URLSearchParams();

    param.append('PP_ID', getValues('planPolicyId'));
    param.append('CON_ID', 'PP_CON_13');
    param.append('VAL_01', getValues('orderDivideMode'));
    param.append('VAL_02', getValues('orderDivideCriteria'));
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
                <CardHeader title={transLangKey('ORDER_DIVIDE_MODE')} />
                <Grid container style={{ marginTop: '10px' }}>
                  <Grid>
                    <InputField type="radio" name="orderDivideMode" control={control} options={orderDivideModeOptions} style={{ paddingRight: 0, marginRight: 0, width: '260px', height: '120px' }} />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid style={{ width: '49.6%' }}>
              <Card variant="outlined" className={classes.card} style={{ height: 'calc(100%-24px)', padding: '0 !important' }}>
                <CardHeader title={transLangKey('ORDER_DIVIDE_CRITERIA')} />
                <Grid container style={{ marginTop: '10px' }}>
                  <Grid>
                    <InputField type="radio" name="orderDivideCriteria" control={control} options={orderDivideCriteriaOptions} style={{ paddingRight: 0, marginRight: 0, width: '260px', height: '120px' }} />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <RightButtonArea>
              <Grid container direction="row" justifyContent="flex-end">
                <Grid item xs="auto">
                  <Button variant="outlined" sx={{ borderRadius: 4, minWidth: 110, width: 'fit-content' }} startIcon={<Icon.Check style={{ color: '#1976d2' }} />} onClick={saveAllocationRulePartialPlan}>
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

export default forwardRef(AllocationRulePartialPlan);
