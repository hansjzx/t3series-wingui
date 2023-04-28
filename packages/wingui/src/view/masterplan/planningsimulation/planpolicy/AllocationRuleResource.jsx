import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Grid, Button, Card, CardHeader } from '@mui/material';
import { useViewStore, BaseGrid } from '@zionex/wingui-core/src/common/imports';
import { makeStyles } from '@mui/styles';
import { InputField, RightButtonArea, zAxios } from '@zionex/wingui-core/src/common/imports';
import { useUserStore } from '@zionex/wingui-core/src/store/userStore';

const useAllocationRuleResourceStyles = makeStyles({
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
      width: '270px'
    }
  }
});

let gridAllocRuleColumns  = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
  { name: "PLAN_POLICY_NM", dataType: "text", headerText: "RULE", visible: true, editable: false, width: 100, lang: true },
  { name: "DESCRIP", dataType: "text", headerText: "DESCRIP", visible: true, editable: false, width: 350, lang: true },
  { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: 50 },
  { name: "SELECT_SEQ", dataType: "text", headerText: "SELECT_SEQ", visible: false, editable: false }
];

export function AllocationRuleResource(props, ref) {
  const classes = useAllocationRuleResourceStyles();
  const [username] = useUserStore(state => [state.username]);
  const [allocRuleOptions, setAllocRuleOptions] = useState([]);
  const [gridAllocRule, setGridAllocRule] = useState(null);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [assignResOptions, setAssignResOptions] = useState([]);

  const { control, getValues, setValue } = useForm({
    defaultValues: {
      planPolicyId: '',
      allocRule: '',
      assignRes: ''
    }
  });

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, 'gridAllocRule');
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        setGridAllocRule(grdObj1);
      }
    }
  }, [viewData]);

  useEffect(() => {
    if (gridAllocRule) {
      setOptionsGridAllocRule();
    }
  }, [gridAllocRule]);

  useImperativeHandle(ref, () => ({
    initLoad(planPolicyId) {
      if (planPolicyId && planPolicyId !== '') {
        setValue('planPolicyId', planPolicyId);
        loadPlanPolicyDetails(planPolicyId);
      }
    }
  }));

  function setOptionsGridAllocRule() {
    gridAllocRule.gridView.setDisplayOptions({ fitStyle: 'fill' });

    gridAllocRule.gridView.onCellClicked = function (grid, index, itemIndex) {
      if (index.cellType && index.cellType === 'data') {
        if (grid.getValues(index.itemIndex).ACTV_YN) {
          let data = gridAllocRule.dataProvider.getJsonRows(0, -1).map((x)=> {
            return x.ACTV_YN;
          });
          let rowIndex = data.findIndex((e) => e === true);

          if (rowIndex !== -1) {
            gridAllocRule.gridView.commit(true);
            gridAllocRule.dataProvider.setValue(rowIndex, 'ACTV_YN', false);
          }
        }
      }
    }
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
          let allocRuleOptions = [];
          let assignResOptions = [];

          res.data.RESULT_DATA.map((data) => {
            if (data.ITEM_ID === "M00420000") {
              var obj = { label: transLangKey(data.PLAN_POLICY_NM), value: data.DTL_ID }
              if (data.CHECKED === "Y") {
                setValue('allocRule', data.DTL_ID);
              }
              allocRuleOptions.push(obj);
            }

            if (data.ITEM_ID === "M00440000") {
              var obj = { label: transLangKey(data.PLAN_POLICY_NM), value: data.DTL_ID }
              if (data.CHECKED === "Y") {
                setValue('assignRes', data.DTL_ID);
              }
              assignResOptions.push(obj);
            }
          });

          setAllocRuleOptions(allocRuleOptions);
          setAssignResOptions(assignResOptions);

          loadGridAllocRule(planPolicyId);
        }
      })
      .catch(function (err) {
        console.log(err);
      })
  }

  function saveAllocationRuleResource() {
    let param = new URLSearchParams();

    param.append('PP_ID', getValues('planPolicyId'));
    param.append('CON_ID', 'PP_CON_12');
    param.append('VAL_01', getValues('allocRule'));
    param.append('VAL_02', getValues('assignRes'));
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
              saveGridAllocRule();
            }
          })
          .catch(function (err) {
            console.log(err);
          })
      }
    });
  }

  function loadGridAllocRule(planPolicyId) {
    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_CM_15_Q6',
      params: {
        'PLAN_POLICY_ID': planPolicyId
      }
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          let dataArr = res.data.RESULT_DATA;

          gridAllocRule.setData(dataArr);
        }
      })
      .catch(function (err) {
        console.log(err);
      })
  }

  function saveGridAllocRule() {
    gridAllocRule.gridView.commit(true);
    let changeRowData = [];
    let changes = [];

    changes = changes.concat(
      gridAllocRule.dataProvider.getAllStateRows().updated
    );

    changes.forEach(function (row) {
      changeRowData.push(gridAllocRule.dataProvider.getJsonRow(row));
    });

    let param = new URLSearchParams();

    param.append('changes', JSON.stringify(changeRowData));
    param.append('CON_ID', 'PP_CON_12');
    param.append('USER_ID', username);

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_CM_15_S3',
      params: param
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_CM_15_S3_P_RT_MSG;
          showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false })
          loadPlanPolicyDetails(getValues('planPolicyId'));
        }
      })
      .catch(function (err) {
        console.log(err);
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
                  <Grid style={{ width: '100%', height: '350px' }}>
                    <InputField type="radio" name="allocRule" control={control} options={allocRuleOptions} style={{ paddingRight: 0, marginRight: 0, width: '260px', height: '120px' }} />
                    <BaseGrid id="gridAllocRule" items={gridAllocRuleColumns}></BaseGrid>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <Grid style={{ width: '49.6%' }}>
              <Card variant="outlined" className={classes.card} style={{ height: 'calc(100%-24px)', padding: '0 !important' }}>
                <CardHeader title={transLangKey('ASSIGN_RES')} />
                <Grid container style={{ marginTop: '10px' }}>
                  <Grid>
                    <InputField type="radio" name="assignRes" control={control} options={assignResOptions} style={{ paddingRight: 0, marginRight: 0, width: '260px', height: '120px' }} />
                  </Grid>
                </Grid>
              </Card>
            </Grid>
            <RightButtonArea>
              <Grid container direction="row" justifyContent="flex-end">
                <Grid item xs="auto">
                  <Button variant="outlined" sx={{ borderRadius: 4, minWidth: 110, width: 'fit-content' }} startIcon={<Icon.Check style={{ color: '#1976d2' }} />} onClick={saveAllocationRuleResource}>
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

export default forwardRef(AllocationRuleResource);
