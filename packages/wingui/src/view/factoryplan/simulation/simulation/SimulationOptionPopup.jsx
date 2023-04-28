import React, { useEffect, useRef, useState } from 'react';
import { InputField, PopupDialog, zAxios } from "@zionex/wingui-core/src/common/imports";
import { Box, Grid, InputAdornment, Switch, Typography, Input, IconButton } from "@mui/material";
import { showMessage, transLangKey } from "@wingui";
import Details from "@wingui/view/factoryplan/common/component/DetailCard";
import LaunchIcon from '@mui/icons-material/Launch';
import RefreshIcon from '@mui/icons-material/Refresh';
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/l10n";
import { Controller, useForm } from "react-hook-form";
import InsertInvitationOutlinedIcon from '@mui/icons-material/InsertInvitationOutlined';
import DialogActions from "@mui/material/DialogActions";
import { useHistory } from "react-router-dom";
import { fpCommonStyles } from "@wingui/view/factoryplan/common/common";

const CustomSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    })
  },
}));
const languageCode = localStorage.getItem('languageCode');
const flatPickrOptions = {
  allowInput: false,
  mode: 'multiple',
  dateFormat: 'Y-m-d',
  conjunction: ', ',
  locale: languageCode,
  clickOpens: false,
  prevArrow: "<span title=\"Previous month\"><i class='fa fa-chevron-left'></i></span>",
  nextArrow: "<span title=\"Next month\"><i class='fa fa-chevron-right'></i></span>",
  weekNumbers: true
};
const readOnlyInput = {
  '&:after': {
    borderBottom: 'none'
  },
  '&:hover:before': {
    borderBottom: '1px solid rgba(0, 0, 0, 0.42) !important'
  }
};
const helperText = {
  required: transLangKey('FP_MSG_SELECT_DATE'),
  min: transLangKey('FP_VALIDATION_LESS_ZERO')
};

function SimulationOptionPopup(props) {
  const history = useHistory();
  const flatpickr = useRef(null);
  const [disabled, setDisabled] = useState(false);
  const [link, setLink] = useState(null);
  const { control, getValues, setValue, watch, handleSubmit, reset, formState: { isDirty, dirtyFields } } = useForm({
    defaultValues: {
      work: '',
      nonWork: [null, null],
      efficiency: '',
      preBuild: false,
      infiniteTool: false,
      lateNotAllowed: false,
      fcfs: false
    },
    reValidateMode: 'onChange'
  });
  
  const getReadOnlyProps = () => ({ readOnly: disabled, sx: {...(disabled) ? readOnlyInput : {}}, className: null });
  const setSwitch = (name) => {
    return (
      <Controller
        name={name}
        control={control}
        render={({ field: { onChange, value} }) => (
          <CustomSwitch
            sx={{ mt: 3 }}
            checked={value}
            inputProps={{ 'aria-label': 'controlled' }}
            onChange={onChange}
            disabled={disabled}
          />
        )
        }
      />
    )
  };
  const setLinkButton = (text) => {
    if (!props.versionCd) {
      const link = text.replaceAll('_', '').toLowerCase();
      const handleClick = () => {
        setLink(link);
      };
      return (
        <Button
          variant="contained"
          sx={{ ...fpCommonStyles.primaryButton, borderRadius: '14px', height: '25px', p: '0 12px' }}
          endIcon={<LaunchIcon />}
          onClick={handleClick}
        >
          {transLangKey(`UI_FP_${text}`)}
        </Button>
      )
    }
  };
  useEffect(() => {
    if (props.versionCd) {
      setDisabled(true);
      getOptions(props.versionCd);
    }
  }, [props.versionCd]);
  useEffect(() => {
    if (props.open && props.versionCd) {
      getOptions(props.versionCd);
    } else if (!props.open) {
      reset();
    }
  }, [props.open]);
  useEffect(() => {
    if (link) {
      reset();
      props.onClose();
      if (document.querySelector('.MuiDialog-root')) {
        document.querySelector('.MuiDialog-root').style.display = 'none';
      }
      setLink(null);
      history.push({ pathname: `/setting/dataintegration/datafp/${link}` });
    }
  }, [link]);

  function getOptions(versionCd) {
    const snakeToCamel = (str) =>
      str.toLowerCase().replace(/([-_][a-z])/g, (group) =>
        group
          .toUpperCase()
          .replace('_', '')
      );
    zAxios.get(baseURI() + 'factoryplan/simulation/plan-versions/options', {
      params: { 'plan-version-cd': versionCd },
      fromPopup: true
    })
      .then(function (response) {
        let data = response.data;
        data.forEach(function (option) {
          const categoryCd = snakeToCamel(option.categoryCd.replace('FP_OPTN_', ''));
          let optnVal = option.optnVal;
          if (categoryCd === 'nonWork') {
            if (optnVal && optnVal.length > 0) {
              let dates = optnVal.split('~');
              setValue('nonWork', dates);
            }
          } else {
            if (optnVal === 'true' || optnVal === 'false') {
              optnVal = (optnVal === 'true');
            } else if (categoryCd === 'work') {
              optnVal = (optnVal) ? optnVal.split(',').map(val => new Date(val.trim())) : '';
            }
            setValue(categoryCd, optnVal);
          }
        });
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
      });
  }
  
  function onSubmit(data) {
    if (!isDirty && Object.keys(dirtyFields).length === 0) {
      showMessage(transLangKey('WARNING'), transLangKey('MSG_5039'), { close: false });
      return;
    }
    const convertDateFormat = (dt) => (dt && dt instanceof Date) ? dt.format('yyyy-MM-dd') : dt;
    let saveData = Object.keys(data)
      .filter(categoryCd => dirtyFields[categoryCd] && !categoryCd.includes('nonWork'))
      .map(categoryCd => ({
        categoryCd: `FP_OPTN_${convertCamelToSnake(categoryCd).toUpperCase()}`,
        optnVal: (categoryCd === 'work' && data[categoryCd]) ? data[categoryCd].map(val => convertDateFormat(val)).join(', ') : data[categoryCd]
      }));
    if (Object.keys(dirtyFields).includes('nonWork')) {
      const nonWork = getValues('nonWork');
      saveData.push({
        categoryCd: 'FP_OPTN_NON_WORK',
        optnVal: (nonWork[0] && nonWork[1]) ? `${convertDateFormat(nonWork[0])}~${convertDateFormat(nonWork[1])}` : ''
      });
    }
    props.onSubmit(saveData);
  }
  
  function handleClickShowDatePicker(e) {
    const refreshIcon = document.querySelector(".MuiInputBase-root [data-testid='RefreshIcon']");
    if (!disabled && !refreshIcon.contains(e.target)) {
      const fp = flatpickr.current.flatpickr;
      if (fp.isOpen) {
        setTimeout(() => flatpickr.current.flatpickr.close(), 200);
      } else {
        setTimeout(() => flatpickr.current.flatpickr.open(), 200);
      }
    }
  }
  
  function handleClosePopup() {
    reset();
    props.onClose();
  }
  
  return (
    <>
      <PopupDialog type="NOBUTTONS" open={props.open} onClose={() => handleClosePopup()} checks={[]} title={`${transLangKey((props.versionCd) ? 'FP_CONFIRM_OPTION' : 'FP_APPLY_OPTION')} ${props.title}`} resizeHeight={disabled ? 750 : 810} resizeWidth={1070}>
        <Box sx={{ width: '100%', height: '100%', p: '0 16px 16px' }}>
          <Grid container spacing={13} sx={{ height: 1, mt: 0 }}>
            <Grid item xs={12} sx={{ height: 1/4 }}>
              <Details title={transLangKey('FP_OPTN_WORK')} titleTypographyProps={{ variant: 'h6' }} headerAction={setLinkButton('RESOURCE_CALENDAR')}>
                <Typography variant="body1" gutterBottom>
                  {transLangKey('FP_OPTN_WORK_DESC_TXT')}
                </Typography>
                <Controller
                  name="work"
                  control={control}
                  render={({ field: { onChange, value} }) => (
                    <Flatpickr
                      ref={flatpickr}
                      options={flatPickrOptions}
                      value={value}
                      onChange={onChange}
                      render={
                        ({defaultValue, value, ...props}, ref) => {
                          return <Input
                            sx={{ mt: '6px', width: 1, '& input': { cursor: 'text !important' }, ...(disabled) ? readOnlyInput : {} }}
                            inputProps={{ 'aria-label': 'weight' }}
                            inputRef={ref}
                            readOnly={true}
                            onClick={(e) => handleClickShowDatePicker(e)}
                            endAdornment={
                              <InputAdornment position="end">
                                <IconButton disabled={disabled} sx={{p: '7px'}} edge="end">
                                  <InsertInvitationOutlinedIcon />
                                </IconButton>
                                <IconButton disabled={disabled} sx={{p: '7px'}} onClick={() => setValue('work', "", { shouldDirty: true })}
                                            edge="end">
                                  <RefreshIcon/>
                                </IconButton>
                              </InputAdornment>
                            }
                          />
                        }
                      }
                    />
                  )
                }
                />
              </Details>
            </Grid>
            <Grid item xs={6} sx={{ height: 1/4 }}>
              <Details title={transLangKey('FP_OPTN_NON_WORK')} titleTypographyProps={{ variant: 'h6' }} headerAction={setLinkButton('RESOURCE_CALENDAR')}>
                <Typography variant="body1" gutterBottom>
                  {transLangKey('FP_OPTN_NON_WORK_DESC_TXT')}
                </Typography>
                <InputField inputType="labelText" variant="standard" name="nonWork" type="dateRange" dateformat="yyyy-MM-dd" useLabel={false}
                            rules={{ validate: { required: value => !((value[0] && !value[1]) || (!value[0] && value[1])) }}} helperText={helperText}
                            placeholderText=" " min={[null, getValues('nonWork')[0] && new Date(watch('nonWork')[0])]} max={[getValues('nonWork')[1] && new Date(watch('nonWork')[1])]}
                            InputProps={{...getReadOnlyProps()}} readonly={disabled}
                            wrapStyle={{ alignItems: 'center' }} inputStyle={{ width: '180px' }} control={control} />
              </Details> 
            </Grid>
            <Grid item xs={6} sx={{ height: 1/4 }}>
              <Details title={transLangKey('FP_OPTN_EFFICIENCY')} titleTypographyProps={{ variant: 'h6' }} headerAction={setLinkButton('BOR')}>
                <Typography variant="body1" gutterBottom>
                  {transLangKey('FP_OPTN_EFFICIENCY_DESC_TXT')}
                </Typography>
                <InputField inputType="labelText" variant="standard" name="efficiency" type="number" useLabel={false}
                            rules={{ min: 0 }} helperText={helperText}
                            InputProps={{ endAdornment: (<InputAdornment position="end">%</InputAdornment>), ...getReadOnlyProps() }} readonly={disabled}
                            wrapStyle={{ alignItems: 'center' }} inputStyle={{ width: '180px' }} control={control} />
              </Details>
            </Grid>
            <Grid item xs={6} sx={{ height: 1/4 }}>
              <Details title={transLangKey('FP_OPTN_PRE_BUILD')} titleTypographyProps={{ variant: 'h6' }} headerAction={setLinkButton('ORDER')}>
                <Typography variant="body1" gutterBottom>
                  {transLangKey('FP_OPTN_PRE_BUILD_DESC_TXT')}
                </Typography>
                {setSwitch('preBuild')}
              </Details>
            </Grid>
            <Grid item xs={6} sx={{ height: 1/4 }}>
              <Details title={transLangKey('FP_OPTN_INFINITE_TOOL')} titleTypographyProps={{ variant: 'h6' }} headerAction={setLinkButton('BOR')}>
                <Typography variant="body1" gutterBottom>
                  {transLangKey('FP_OPTN_INFINITE_TOOL_DESC_TXT')}
                </Typography>
                {setSwitch('infiniteTool')}
              </Details>
            </Grid>
            <Grid item xs={6} sx={{ height: 1/4 }}>
              <Details title={transLangKey('FP_OPTN_LATE_NOT_ALLOWED')} titleTypographyProps={{ variant: 'h6' }} headerAction={setLinkButton('ORDER')}>
                <Typography variant="body1" gutterBottom>
                  {transLangKey('FP_OPTN_LATE_NOT_ALLOWED_DESC_TXT')}
                </Typography>
                {setSwitch('lateNotAllowed')}
              </Details>
            </Grid>
            <Grid item xs={6} sx={{ height: 1/4 }}>
              <Details title={transLangKey('FP_OPTN_INFINITE_FCFS')} titleTypographyProps={{ variant: 'h6' }} headerAction={setLinkButton('RESOURCE')}>
                <Typography variant="body1" gutterBottom>
                  {transLangKey('FP_OPTN_INFINITE_FCFS_DESC_TXT')}
                </Typography>
                {setSwitch('fcfs')}
              </Details>
            </Grid>
          </Grid>
        </Box>
        {
          !props.versionCd && <DialogActions sx={{ p: '8px 16px 16px' }}>
            <Button sx={{ ...fpCommonStyles.primaryButton, width: 1 }} onClick={handleSubmit(onSubmit)} variant="contained" >{transLangKey('EXEC_SIMUL')}</Button>
          </DialogActions>
        }        
      </PopupDialog>
    </>
  );
}

export default SimulationOptionPopup;
