import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Box, Grid, TextField, Button, Card, MenuItem } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { InputField, zAxios } from '@zionex/wingui-core/src/common/imports';
import { useUserStore } from '@zionex/wingui-core/src/store/userStore';

const useSimulationStyles = makeStyles({
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
    fontSize: '17px'
  },
  card: {
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

const gridStyle = { color: 'text.primary', fontSize: 20, paddingTop: 4 };

export function General(props, ref) {
  const classes = useSimulationStyles();
  const [planTypeOption, setPlanTypeOption] = useState([]);
  const [username] = useUserStore(state => [state.username])

  const { control, getValues, setValue, reset } = useForm({
    defaultValues: {
      planPolicyId: '',
      planPolicyVersion: '',
      planPolicyDescrip: '',
      activeYn: [''],
      planType: ''
    }
  });

  useImperativeHandle(ref, () => ({
    initLoad(planPolicyId) {
      if (planPolicyId && planPolicyId !== '') {
        setValue('planPolicyId', planPolicyId);
        loadPlanPolicyDetails(planPolicyId);
      } else {
        reset();
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
          let resultArr = [];

          res.data.RESULT_DATA.filter((data) => data.ITEM_ID === "M00030000").map((data) => {
            let planType = { value: data.DTL_ID, label: transLangKey(data.PLAN_POLICY_NM) };
            resultArr.push(planType);
            if (data.CHECKED === "Y") {
              setValue('planType', planType.value);
            }
          });

          setPlanTypeOption(resultArr);

          res.data.RESULT_DATA.map((data) => {
            if (data.ITEM_ID === "M00000001") {
              setValue('planPolicyVersion', data.VAL_01);
            } else if (data.ITEM_ID === "M00020000") {
              setValue('planPolicyDescrip', data.VAL_01);
            } else if (data.ITEM_ID === "M00000002") {
              setValue('activeYn', [data.VAL_01]);
            }
          });
        }
      })
      .catch(function (err) {
        console.log(err);
      })
  }

  function saveGeneral() {
    let param = new URLSearchParams();

    param.append('PP_ID', getValues('planPolicyId'));
    param.append('CON_ID', 'PP_CON_01');
    param.append('VAL_01', getValues('planPolicyDescrip'));
    param.append('VAL_02', getValues('activeYn'));
    param.append('VAL_03', getValues('planType'));
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
              loadGeneral(getValues('planPolicyId'));
            }
          })
          .catch(function (err) {
            console.log(err);
          })
      }
    });
  }

  return (
    <Card variant="outlined" className={classes.card} style={{ width: 480, padding: '0 !important' }}>
      <Grid container gap={18} direction="column">
        <Grid>
          <Grid container>
            <Grid item sx={{ width: 200 }}>
              <Box sx={gridStyle}>
                {transLangKey('PLAN_POLICY_VERSION')}
              </Box>
            </Grid>
            <Grid item xs="auto">
              <Controller name="planPolicyVersion" control={control} rules={{ required: true }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField sx={{ width: 235 }} variant="standard" placeholder={transLangKey('PLAN_POLICY_VERSION')} value={value || ''} onChange={() => { onChange }}
                             InputProps={{ classes: { root: `${classes.input} ${classes.readOnlyInput}` }, readOnly: true }} />
                )}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid>
          <Grid container>
            <Grid item sx={{ width: 200 }}>
              <Box sx={gridStyle}>
                {transLangKey('PLAN_POLICY_DESCRIP')}
              </Box>
            </Grid>
            <Grid item xs="auto">
              <Controller name="planPolicyDescrip" control={control} rules={{ required: true }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                  <TextField sx={{ width: 235 }} variant="standard" placeholder={transLangKey('PLAN_POLICY_DESCRIP')} value={value || ''} onChange={onChange} multiline maxRows={6}
                             InputProps={{ classes: { root: `${classes.input}` } }} />
                )}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid>
          <Grid container>
            <Grid item sx={{ width: 200 }}>
              <Box sx={gridStyle}>
                {transLangKey('ACTV_YN')}
              </Box>
            </Grid>
            <Grid item xs="auto">
              <InputField type="check" name="activeYn" label="" control={control} options={[{ value: "Y" }]} />
            </Grid>
          </Grid>
        </Grid>

        <Grid>
          <Grid container>
            <Grid item sx={{ width: 200 }}>
              <Box sx={gridStyle}>
                {transLangKey('PLAN_TP')}
              </Box>
            </Grid>
            <Grid item xs="auto">
              <Controller control={control} name="planType"
                render={({ field: { onChange, value } }) => (
                  <TextField select sx={{ width: 235 }} variant="standard" onChange={onChange} value={value}
                    SelectProps={{
                      renderValue: (selected) => { return (planTypeOption.length > 0) && planTypeOption.find(data => data.value === selected).label; }
                    }}
                    InputProps={{ classes: { root: `${classes.input}` } }}>
                    {planTypeOption.map((option) => {
                      return (
                        <MenuItem key={option.value} value={option.value} >
                          {option.label}
                        </MenuItem>
                      );
                    })}
                  </TextField>
                )}
              />
            </Grid>
          </Grid>
        </Grid>

        <Grid>
          <Grid container>
            <Grid item sx={{ width: 330, fontSize: 17 }}>
              <Box sx={gridStyle}>
              </Box>
            </Grid>
            <Grid item xs="auto">
              <Button variant="outlined" sx={{ borderRadius: 4, minWidth: 110, width: 'fit-content' }} startIcon={<Icon.Check style={{ color: '#1976d2' }} />} onClick={saveGeneral}>
                {transLangKey('OK')}
              </Button>
            </Grid>
          </Grid>
        </Grid>

      </Grid>
    </Card>
  )
}

export default forwardRef(General);
