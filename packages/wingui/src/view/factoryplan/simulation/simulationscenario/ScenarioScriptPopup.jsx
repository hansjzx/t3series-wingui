import React, { forwardRef, useEffect, useState, useImperativeHandle } from 'react';
import { PopupDialog } from "@zionex/wingui-core/src/common/imports";
import { Box, FormControl, FormControlLabel, InputAdornment, Radio, RadioGroup, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { makeStyles } from "@mui/styles";
import { initI18n, showMessage, transLangKey } from "@wingui";

initI18n(localStorage.getItem('languageCode'));
const radioOptions = [
  { label: 'base_obp_plan.py', value: 'base_obp_plan' },
  { label: 'plan_longterm_inventory.py', value: 'plan_longterm_inventory' },
  { label: 'plan_exports_first.py', value: 'plan_exports_first' },
  { label: 'plan_min_outsourcing.py', value: 'plan_min_outsourcing' },
  { label: 'plan_min_work_wait_time.py', value: 'plan_min_work_wait_time' },
  { label: 'plan_min_jobchange.py', value: 'plan_min_jobchange' },
  { label: 'plan_resource_util.py', value: 'plan_resource_util' },
  { label: transLangKey('FP_DIRECT_INPUT'), value: 'direct' }
];

const useStyles = makeStyles({
  readOnlyInput: {
    '&:after': {
      borderBottom: 'none'
    },
    '&:hover:before': {
      borderBottom: '1px solid rgba(0, 0, 0, 0.42) !important'
    }
  }
});

function ScenarioScriptPopup(props, ref) {
  const classes = useStyles();
  const [script, setScript] = useState({ scriptNm: 'base_obp_plan', direct: '' });
  const { control, getValues, setValue, reset, watch } = useForm({
    defaultValues: {
      script: 'base_obp_plan',
      directInput: ''
    }
  });

  useImperativeHandle(ref, () => ({
    refresh: () => {
      const script = { scriptNm: 'base_obp_plan', direct: '' };
      setScript(script);
      setValue('script', script.scriptNm);
      setValue('directInput', script.direct);
    }
  }));
  
  useEffect(() => {
    if (props.open) {
      setValue('script', script.scriptNm);
      setValue('directInput', script.direct);
    }
  }, [props.open]);
  
  useEffect(() => {
    if (props.defaultScript) {
      const script = radioOptions.find(option => option.value === props.defaultScript);
      if (script) {
        setScript({ scriptNm: props.defaultScript, direct: '' });
      } else {
        setScript({ scriptNm: 'direct', direct: props.defaultScript });
      }
    }
  }, [props.defaultScript]);
  
  function confirm() {
    if (getValues('script') === 'direct' && !getValues('directInput')) {
      showMessage(transLangKey('WARNING'), transLangKey('FP_MSG_ENTER_SCRIPT'), { close: false });
      return;
    }
    const script = { scriptNm: getValues('script'), direct: (getValues('script') === 'direct') ? getValues('directInput') : '' };
    setScript(script);
    props.onClose(script.scriptNm === 'direct' ? script.direct : script.scriptNm);
  }
  
  function close() {
    props.onClose(script.scriptNm === 'direct' ? script.direct : script.scriptNm);
    reset();
  }
  
  const setScriptRadioGroup = () => (
    <Controller
      name="script"
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <FormControl
          component="fieldset"
          error={error}
        >
          <RadioGroup
            value={value || ''}
            onChange={onChange}
            style={{ display: 'flex', flexDirection: 'column' }}
            sx={{ '& .MuiSvgIcon-root': { fontSize: 20 } }}>
            {radioOptions.map((option, index) => {
              if (radioOptions.length === index + 1) {
                return (
                  <Box sx={{ display: 'flex' }} key={index}>
                    <FormControlLabel
                      key={index}
                      value={option.value}
                      label={option.label}
                      control={<Radio />}
                    />
                    <Controller
                      key={`controller-${index}`}
                      name="directInput"
                      control={control}
                      render={({ field: { onChange, value} }) => (
                        <TextField
                          variant="standard"
                          sx={{ mt: 3, width: '180px' }}
                          value={value}
                          onChange={onChange}
                          InputProps={{
                            ...props.inputProps,
                            classes: { root: (watch('script') !== 'direct') ? classes.readOnlyInput : '' },
                            disabled: watch('script') !== 'direct',
                            ref: props.inputRef,
                            placeholder: `${transLangKey('INPUT')} (${transLangKey('FP_CASE_SENSITIVE')})`,
                            endAdornment: (<InputAdornment position="end">.py</InputAdornment>)
                          }}
                        />
                      )
                      }
                    />
                  </Box>
                );
              } else {
                return (
                  <FormControlLabel
                    sx={{ mb: '0.5rem' }}
                    key={index}
                    value={option.value}
                    label={option.label}
                    control={<Radio />}
                  />
                );
              }
            })}
          </RadioGroup>
        </FormControl>
      )}
    />
  );
  
  return (
    <>
      <PopupDialog id="scenario-script-popup" type="CONFIRM" open={props.open} onClose={() => close()} onConfirm={() => confirm()} title={transLangKey('FP_SELECT_SCENARIO_SCRIPT')} resizeHeight={570} resizeWidth={400}>
        <Box sx={{ height: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          {setScriptRadioGroup()}
        </Box>
      </PopupDialog>
    </>
  )
}

export default forwardRef(ScenarioScriptPopup);
