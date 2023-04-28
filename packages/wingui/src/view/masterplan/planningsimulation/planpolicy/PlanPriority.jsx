import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Grid, Button, Card } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useViewStore, BaseGrid, zAxios } from '@zionex/wingui-core/src/common/imports';
import { useUserStore } from '@zionex/wingui-core/src/store/userStore';
import { showMessage } from '@zionex/wingui-core/src/utils/common';
import { transLangKey } from '@zionex/wingui-core/src/lang/i18n-func';

const usePlanPriorityStyles = makeStyles({
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
  }
});


let gridPlanPriorityColumns = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
  { name: "NM", dataType: "text", headerText: "POLICY_NM", editable: false, width: 80, lang: true },
  { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", editable: true, width: 80 },
  { name: "PRIORT", dataType: "number", headerText: "PRIORITY", editable: true, width: 80 }
];

export function PlanPriority(props, ref) {
  const classes = usePlanPriorityStyles();
  const [gridPlanPriority, setGridPlanPriority] = useState(null);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [username] = useUserStore(state => [state.username])

  const { getValues, setValue } = useForm({
    defaultValues: {
      planPolicyId: '',
      locationId: '',
      locationName: '',
      locationLevel: ''
    }
  });

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, 'gridPlanPriority');
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        setGridPlanPriority(grdObj1);
      }
    }
  }, [viewData])

  useImperativeHandle(ref, () => ({
    initLoad(planPolicyId) {
      if (planPolicyId && planPolicyId !== '') {
        setValue('planPolicyId', planPolicyId);
        loadPlanPriority(planPolicyId);
      }
    }
  }));

  function loadPlanPriority(planPolicyId) {
    let params = new URLSearchParams();

    params.append('PLAN_POLICY_ID', planPolicyId);
    params.append('PLAN_POLICY_ITEM_ID', 'M00320000');

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_CM_15_Q5',
      params: params
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          gridPlanPriority.setData(res.data.RESULT_DATA);
        }
      })
      .catch(function (err) {
        console.log(err);
      })
  }

  function savePlanPriorityGrid() {
    gridPlanPriority.gridView.commit(true);

    let changeRowData = [];

    gridPlanPriority.dataProvider.getAllStateRows().updated.forEach((row) => {
      let data = gridPlanPriority.dataProvider.getJsonRow(row);
      changeRowData.push(data);
    });

    if (changeRowData.length === 0) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'));
    } else {
      let params = new URLSearchParams();

      params.append('changes', JSON.stringify(changeRowData));
      params.append('CON_ID', 'PP_CON_06');
      params.append('PLAN_POLICY_VAL_ID', '');
      params.append('USER_ID', username);

      zAxios({
        method: 'post',
        header: { 'content-type': 'application/json' },
        url: baseURI() + 'engine/mp/SRV_UI_CM_15_S3',
        params: params
      }).then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_CM_15_S3_P_RT_MSG;
          showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false })
          loadPlanPriority(getValues('planPolicyId'));
        }
      })
        .catch(function (err) {
          console.log(err);
        })
    }
  }

  return (
    <>
      <Box style={{ height: '100%' }}>
        <Card variant="outlined" className={classes.card} style={{ minWidth: 660, height: 'calc(100% - 150px)', padding: '0 !important' }}>
          <BaseGrid id="gridPlanPriority" items={gridPlanPriorityColumns}></BaseGrid>
        </Card>
        <Grid container direction="row" justifyContent="flex-end">
          <Button variant="outlined" sx={{ borderRadius: 4, minWidth: 110, width: 'fit-content' }} startIcon={<Icon.Check style={{ color: '#1976d2' }} />} onClick={savePlanPriorityGrid}>
            {transLangKey('OK')}
          </Button>
        </Grid>
      </Box>
    </>
  )
}

export default forwardRef(PlanPriority);
