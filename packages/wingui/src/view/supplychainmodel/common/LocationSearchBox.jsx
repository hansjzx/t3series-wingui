import React, { forwardRef, useEffect, useImperativeHandle, useState, useRef, useLayoutEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Controller } from "react-hook-form";
import { Grid, Avatar, Chip, IconButton, Tooltip, Popover, TextField, Typography, Button, Box, FormControl, InputLabel, FilledInput, InputAdornment } from '@mui/material';
import { CommonButton, useFloatInputStyles } from '@zionex/wingui-core/src/common/imports';

import PopLocatTp from '@wingui/view/common/PopLocatTp';

const defPopOverstyles = {
  width: 450,
  border: '1px solid rgba(50, 50, 50, 0.3)',
  boxSizing: 'border-box',
  padding: '25px 15px'
};

const defOptions = {
  locationType: {
    code : 'TP',
    langCode : "LOCAT_TP_NM",
    chipColor : 'info', // display on InputField
    avatarColor : 'info.main', // display on PopOver
    usePopupButton: true
  },
  locationLevel: {
    code : 'LV',
    langCode : "LOCAT_LV",
    chipColor : 'info',
    avatarColor : 'info.main'
  },
  locationCode: {
    code : 'CD',
    langCode : "LOCAT_CD",
    chipColor : 'success',
    avatarColor : 'success.main'
  },
  locationName: {
    code : 'NM',
    langCode : "LOCAT_NM",
    chipColor : 'warning',
    avatarColor : 'warning.main'
  }
};

const defStyles = {
  width: 450,
  defaultWidth: 450,
  display : 'block',
  popoverHeight : 300
}

export function LocationSearchBox(props, ref) {
  const classes = useFloatInputStyles()

  const defaultKeyValue = 'locationName';

  const [popOverstyles, setPopOverStyle] = useState(defPopOverstyles);
  const [selectedItem, setSelectedItem] = useState([]);
  const [options, setOptions] = useState(defOptions);
  const [style, setStyle] = useState(defStyles);
  const [inputLabel, setInputLabel] = useState('');

  const buttonRef = useRef(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [hasFields, setHasFields] = useState(false);
  const [fields, setFields] = useState([]);

  const [inputReadOnly, setInputReadOnly] = useState(true);

  const [locationPopupOpen, setLocationPopupOpen] = useState(false);
  const [inputValues, setInputValues] = useState('');

  const [placeHolder, setPlaceHolder] = useState('');

  const chipRefs = useRef([]);

  const [prevStyle, setPrevStyle] = useState({});

  const { reset, control, getValues, setValue, clearErrors } = useForm({
    defaultValues: {
      locationType: '',
      locationLevel: '',
      locationCode: '',
      locationName: ''
    }
  });

  useLayoutEffect(() => {
    if (selectedItem.length == 0 && inputValues.length == 0 && !inputReadOnly) {
      setPlaceHolder(props.placeHolder);
    } else {
      setPlaceHolder('');
    }

    if (props.label) {
      setInputLabel(props.label);
    } else {
      setInputLabel(transLangKey("LOCAT"));
    }

    if (props.style) {
      if (JSON.stringify(prevStyle) !== JSON.stringify(props.style)) {
        let copyStyle = {...style};

        if (JSON.stringify(copyStyle) === JSON.stringify(style)) {
          Object.keys(props.style).map((key) => {
            copyStyle[key] = props.style[key];
          })

          copyStyle['defaultWidth'] = copyStyle['width'];

          setStyle(copyStyle);
          setPrevStyle(props.style);
        };
      }
    }

    if (props.options) {
      setOptions(props.options);
    }
  }, [props]);

  useLayoutEffect(() => {
    let totalIconWidth = 0;
    let maxWidth = selectedItem.length == 1 ? style.defaultWidth : style.defaultWidth + 100;
    let iconOffsetWidths = [];

    selectedItem.map((data, idx) => {
      chipRefs.current[idx].style.maxWidth = style.defaultWidth;
    });

    selectedItem.map((data, idx) => {
      let offsetWidth = chipRefs.current[idx].offsetWidth;
      iconOffsetWidths.push(offsetWidth)
      totalIconWidth += offsetWidth;
    });

    let totalInputWidth = totalIconWidth + 95;

    let autosizeWidth = totalInputWidth > maxWidth ? maxWidth : totalInputWidth;

    if (autosizeWidth < style.defaultWidth) {
      autosizeWidth = style.defaultWidth;
    }

    if (autosizeWidth != style.width) {
      setStyle({...style, width : autosizeWidth}); // inputBox 길이 조정
    }

    if (autosizeWidth == maxWidth) { // Chips 길이 조정
      let sizingValue = 0;
      for (let i=0; i < selectedItem.length; i++ ) {
        let chipMaxWidth = Math.floor((iconOffsetWidths[i] / totalIconWidth) * (maxWidth - 95));

        if (sizingValue !== 0) {
          chipMaxWidth = chipMaxWidth - sizingValue;
          sizingValue = 0;
        }

        if (chipMaxWidth < 65) {
          sizingValue = 65 - chipMaxWidth;
          chipRefs.current[i].style.maxWidth = "65px";
        } else {
          chipRefs.current[i].style.maxWidth = chipMaxWidth.toString() + "px";
        }
      }
    }

    selectedItem.length > 0 ? setInputReadOnly(true) : setInputReadOnly(false);
    setInputValues('');

    if (selectedItem.length == 0 && inputValues.length == 0) {
      setPlaceHolder(props.placeHolder);
    } else {
      setPlaceHolder('');
    }
  }, [selectedItem]);

  useEffect(()=> {
    if (selectedItem.length == 0 && inputValues.length == 0 && !inputReadOnly) {
      setPlaceHolder(props.placeHolder);
    } else {
      setPlaceHolder('');
    }
  }, [inputValues]);

  useImperativeHandle(ref, () => ({
    setField(field) {
      setFields(field);
      if (field.length != 0) {
        setHasFields(true)
      }
    },

    getLocationType() {
      return getValues('locationType');
    },

    getLocationLevel() {
      return getValues('locationLevel');
    },

    getLocationCode() {
      return getValues('locationCode');
    },

    getLocationName() {
      return getValues('locationName');
    },

    setLocationType(value) {
      setValue('locationType', value);
      onSubmit();
      setPlaceHolder('');
    },

    setLocationLevel(value) {
      setValue('locationLevel', value);
      onSubmit();
      setPlaceHolder('');
    },

    setLocationCode(value) {
      setValue('locationCode', value);
      onSubmit();
      setPlaceHolder('');
    },

    setLocationName(value) {
      setValue('locationName', value);
      onSubmit();
      setPlaceHolder('');
    },

    reset() {
      reset();
      setSelectedItem([]);
      setPlaceHolder(props.placeHolder ? props.placeHolder : '');
    }
  }));

  const handleClick = () => {
    setAnchorEl(buttonRef.current);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function handleInputChange(event) {
    setInputValues(event.target.value);
    let key = props.keyValue ? props.keyValue : defaultKeyValue;

    setValue(key, event.target.value);
  }

  function handleInputRefresh() {
    let key = props.keyValue ? props.keyValue : defaultKeyValue;
    setInputValues('');
    setValue(key,'');
  }

  function handleKeyDown(event) {
    if (selectedItem.length != 0 && inputValues.length == 0 && event.key === 'Backspace') {
      setValue(selectedItem[selectedItem.length-1].id, '');
      if (selectedItem.length == 1) {
        setPlaceHolder(props.placeHolder);
      }
      setSelectedItem(selectedItem.slice(0, selectedItem.length - 1));
    }
  }

  const handleDelete = (item) => {
    const newSelectedItem = [...selectedItem];
    let index = newSelectedItem.findIndex(object => { return object.id == item.id; });

    newSelectedItem.splice(index, 1);
    setSelectedItem(newSelectedItem);
    setValue(item.id, '');

    newSelectedItem.length == 0 && inputValues.length == 0 ? setPlaceHolder(props.placeHolder) : setPlaceHolder('');
  };

  function openLocationPopup() {
    setLocationPopupOpen(true);
  }

  function closeLocationPopup() {
    setLocationPopupOpen(false);
  }

  function onSetItem(gridRow) {
    setValue('locationType', gridRow.LOCAT_TP_NM);
    setValue('locationLevel', gridRow.LOCAT_LV);
    setValue('locationCode', gridRow.LOCAT_CD);
    setValue('locationName', gridRow.LOCAT_NM);
    onSubmit();
    setPlaceHolder('');
  }

  function onSubmit() {
    let copyArray = [...selectedItem];

    Object.keys(control._defaultValues).map((defaultValueKey)=> {
      let index = copyArray.findIndex(object => { return object.id == defaultValueKey; });
      let isEmpty = getValues(defaultValueKey).length == 0 ? true : false;
      let option = options[defaultValueKey];

      let code = option.code;
      let color = option.chipColor;

      if (index != -1) {
        isEmpty ? copyArray.splice(index, 1) : copyArray[index] = {...copyArray[index], value: getValues(defaultValueKey)};
      } else {
        if (!isEmpty) {
          if (props.fields) {
            if (props.fields.indexOf(defaultValueKey) != -1) {
              copyArray.push({
                id: defaultValueKey, code: code, value: getValues(defaultValueKey), color: color
              });
            }
          } else {
            copyArray.push({
              id: defaultValueKey, code: code, value: getValues(defaultValueKey), color: color
            });
          }
        }
      }
    });

    setSelectedItem(copyArray);
    copyArray.length == 0 && inputValues.length == 0 ? setPlaceHolder(props.placeHolder) : setPlaceHolder('');
    handleClose();
  }

  function setSearchConditionType() {
    return (
      <>
        <Box className={classes.div} style={{display: style.display ? style.display : "block"}}>
          <FormControl className={`${classes.root} ${classes.searchBox}`} style={{ width: style.width }} variant="filled" size={"small"} >
            <InputLabel htmlFor={inputLabel}>{inputLabel}</InputLabel>
            <FilledInput id="location" type="text" readOnly={inputReadOnly} ref={buttonRef} disableUnderline={true} value={inputValues} onChange={(event) => handleInputChange(event)} onKeyDown={(event) => handleKeyDown(event)}
              placeholder={placeHolder} startAdornment={selectedItem.map((item, idx) => (
                <Tooltip title={item.value} key={item.code}>
                  <Chip ref={(el => chipRefs.current[idx] = el)} avatar={<Avatar style={{width: 16, height:16}}>{item.code}</Avatar>} color={item.color} size={"small"} style={{marginTop: 15, marginInlineEnd: 5, height: 20}}
                    key={item.code} tabIndex={-1} label={item.value} onDelete={() => handleDelete(item)} variant="outlined"/>
                </Tooltip>
              ))}
              endAdornment={
                <InputAdornment position="end">
                  { inputValues.length > 0 ? <CommonButton title={transLangKey("REFRESH")} onClick={() => {handleInputRefresh()}}><Icon.X/></CommonButton> : null }
                  <CommonButton title={transLangKey("DETAIL")} onClick={handleClick}><Icon.Filter/></CommonButton>
                </InputAdornment>
              }/>
          </FormControl>
        </Box>
        <Popover PaperProps={{sx:{boxShadow:'rgb(0 0 0 / 20%) 0px 1px 3px 0px, rgb(0 0 0 / 14%) 0px 1px 1px 0px, rgb(0 0 0 / 12%) 0px 2px 1px -1px'}}}
          open={open} anchorEl={anchorEl} onClose={handleClose} anchorOrigin={{vertical: "bottom", horizontal: "left"}} transformOrigin={{vertical: "top", horizontal: "left"}}>
          <Box sx={popOverstyles} style={{height: style.popoverHeight ? style.popoverHeight : 300, width: style.width}}>
            <Grid container gap={10}>
              {
                Object.keys(options).map(key => {
                  if (props.fields && props.fields.indexOf(key) == -1) {
                    return null;
                  } else {
                    const data = options[key];
                    return (
                      <Grid key={key} className={hasFields && !(fields.includes("code") || fields.includes("cd")) ? "d-none" : "d-flex"} container direction="row">
                        <Grid item justifyContent="flex-start" alignItems="flex-start" sx={{ width: "140px" }}>
                          <Grid container direction="row">
                            <Grid item sx={{ width: 30 }}>
                              <Avatar className="mt-1" sx={{ fontSize: 10, bgcolor: data.avatarColor, width: 24, height: 24 }}>{data.code}</Avatar>
                            </Grid>
                            <Grid item xs="auto">
                              <Typography className="mx-2 mt-1" variant="subtitle2" display="block" sx={{padding: '0.05rem'}} gutterBottom>
                                {transLangKey(data.langCode)}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid item justifyContent="flex-start" alignItems="flex-start" sx={{ width: 'calc(100% - 140px)' }}>
                          <Controller name={key} control={control} render={({
                              field: { onChange, value }
                            }) => (
                              <TextField id={key} control={control} sx={{ width: '95%', margin : 0 }} variant="standard" onChange={onChange} value={value || ''}
                                InputProps={{
                                padding: 0,
                                endAdornment: (
                                <InputAdornment position="end">
                                  { data.usePopupButton ? <CommonButton title={transLangKey("SEARCH")} onClick={openLocationPopup}><Icon.Search /></CommonButton> : null }
                                  <IconButton onClick={() => {setInputValues(''); setValue(key, '');}}><Icon.X /></IconButton>
                                </InputAdornment>)
                              }}/>
                            )}/>
                        </Grid>
                      </Grid>
                    )
                  }
                })
              }
              <Grid container direction="row" style={{marginTop : 15}}>
                <Button style={{ width: "95%" }} onClick={onSubmit} variant={'contained'} >{transLangKey("OK")}</Button>
              </Grid>
            </Grid>
          </Box>
        </Popover>
      </>
    )
  }

  return (
    <>
      {setSearchConditionType()}
      {locationPopupOpen && (<PopLocatTp open={locationPopupOpen} onClose={closeLocationPopup} confirm={onSetItem}></PopLocatTp>)}
    </>
  )
}

export default forwardRef(LocationSearchBox);
