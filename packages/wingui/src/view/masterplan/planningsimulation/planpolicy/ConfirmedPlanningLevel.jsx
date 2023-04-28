import React, { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Box, Grid, TextField, Button, Card } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { useViewStore, BaseGrid, zAxios } from '@zionex/wingui-core/src/common/imports';
import { useUserStore } from '@zionex/wingui-core/src/store/userStore';
import PopSelectLocation from './PopSelectLocation';
import { showMessage } from '@zionex/wingui-core/src/utils/common';
import { transLangKey } from '@zionex/wingui-core/src/lang/i18n-func';

const useConfirmedPlanningLevelStyles = makeStyles({
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
  }
});

let gridConfirmedLevelColumns = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
  { name: "PLAN_POLICY_VAL_ID", dataType: "text", headerText: "PLAN_POLICY_VAL_ID", visible: false, editable: false, width: 80 },
  { name: "VAL_04", dataType: "text", headerText: "VAL_04", visible: false, editable: false, width: 80 },
  { name: "VAL_05", dataType: "text", headerText: "VAL_04", visible: false, editable: false, width: 80 },
  { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: 150 },
  { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: 150 },
  { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: 150 }
];

export function ConfirmedPlanningLevel(props, ref) {
  const classes = useConfirmedPlanningLevelStyles();
  const [gridConfirmedLevel, setGridConfirmedLevel] = useState(null);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [username] = useUserStore(state => [state.username])
  const [locationPopupOpen, setLocationPopupOpen] = useState(false);

  const { control, getValues, setValue } = useForm({
    defaultValues: {
      planPolicyId: '',
      locationId: '',
      locationName: '',
      locationLevel: ''
    }
  });

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, 'gridConfirmedLevel');
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        setGridConfirmedLevel(grdObj1);
      }
    }
  }, [viewData])

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
          res.data.RESULT_DATA.map((data) => {
            if (data.ITEM_ID === "M00200000") {
              setValue('locationId', data.VAL_02);
              setValue('locationName', data.VAL_01);
              setValue('locationLevel', data.VAL_06);
            }
          });

          loadGridConfirmedLevel(planPolicyId);
        }
      })
      .catch(function (err) {
        console.log(err);
      })
  }

  function loadGridConfirmedLevel(planPolicyId) {
    let params = new URLSearchParams();

    params.append('PLAN_POLICY_ID', planPolicyId);
    params.append('PLAN_POLICY_ITEM_ID', 'M00210000');
    params.append('LOC_MST_ID', getValues('locationId'));

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_CM_15_Q7',
      params: params
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          gridConfirmedLevel.setData(res.data.RESULT_DATA);
        }
      })
      .catch(function (err) {
        console.log(err);
      })
  }

  function saveConfirmedPlanningLevel() {
    let param = new URLSearchParams();

    param.append('PP_ID', getValues('planPolicyId'));
    param.append('CON_ID', 'PP_CON_03');
    param.append('VAL_01', getValues('locationName'));
    param.append('VAL_02', getValues('locationId'));
    param.append('VAL_03', getValues('locationLevel'));
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
              saveConfirmedPlanningLevelGrid()
              loadPlanPolicyDetails(getValues('planPolicyId'));
            }
          })
          .catch(function (err) {
            console.log(err);
          })
      }
    });
  }

  function saveConfirmedPlanningLevelGrid() {
    gridConfirmedLevel.gridView.commit(true);

    let params = new URLSearchParams();

    params.append('all', JSON.stringify(gridConfirmedLevel.dataProvider.getJsonRows(0, -1)));
    params.append('CON_ID', 'PP_CON_03');
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
        loadPlanPolicyDetails(getValues('planPolicyId'));
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

    loadGridConfirmedLevel(getValues('planPolicyId'));
  }

  function refreshConfirmedPlanningLevel() {
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5110'), function (answer) {
      if (answer) {
        gridConfirmedLevel.gridView.commit(true);

        let params = new URLSearchParams();

        params.append('PP_ID', getValues('planPolicyId'));
        params.append('CON_ID', 'PP_CON_03');
        params.append('all', JSON.stringify(gridConfirmedLevel.dataProvider.getJsonRows()));
        params.append('USER_ID', username);

        zAxios({
          method: 'post',
          header: { 'content-type': 'application/json' },
          url: baseURI() + 'engine/mp/SRV_UI_CM_15_S4',
          params: params
        }).then(function (res) {
          if (res.status === gHttpStatus.SUCCESS) {
            gridConfirmedLevel.dataProvider.clearRows();
            setValue('locationId', '');
            setValue('locationName', '');
            setValue('locationLevel', '');
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
      <Grid container gap={18} direction="column">
        <Grid item sx={{ height: '83px', pt: '0 !important' }}>
          <Card variant="outlined" className={classes.card} style={{ minWidth: 630, height: '100%', padding: '0 !important' }}>
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
              <Button variant="outlined" sx={{ margin: '3.5px 15px 3.5px 0', borderRadius: 1, borderColor: 'rgba(0, 0, 0, 0.23)', width: 90, height: 35 }} onClick={() => { setLocationPopupOpen(true) }}>
                {transLangKey('LOCAT_CHOICE')}
              </Button>
            </Box>
          </Card>
        </Grid>
      </Grid>
      <Box style={{ height: '100%' }}>
        <Card variant="outlined" className={classes.card} style={{ minWidth: 660, height: 'calc(100% - 150px)', padding: '0 !important' }}>
          <BaseGrid id="gridConfirmedLevel" items={gridConfirmedLevelColumns}></BaseGrid>
        </Card>
        <Grid container direction="row" justifyContent="flex-end">
          <Button variant="outlined" sx={{ borderRadius: 4, minWidth: 110, width: 'fit-content', marginRight: 5 }} startIcon={<Icon.RefreshCcw style={{ color: '#1976d2' }} />} onClick={refreshConfirmedPlanningLevel}>
            {transLangKey('REFRESH')}
          </Button>
          <Button variant="outlined" sx={{ borderRadius: 4, minWidth: 110, width: 'fit-content' }} startIcon={<Icon.Check style={{ color: '#1976d2' }} />} onClick={saveConfirmedPlanningLevel}>
            {transLangKey('OK')}
          </Button>
        </Grid>
      </Box>
      {locationPopupOpen && (<PopSelectLocation open={locationPopupOpen} onClose={() => { setLocationPopupOpen(false) }} confirm={onSetLocation} />)}
    </>
  )
}

export default forwardRef(ConfirmedPlanningLevel);
