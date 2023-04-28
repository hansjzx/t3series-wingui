import React, { forwardRef, useEffect, useImperativeHandle, useState, useRef, useLayoutEffect } from "react";
import { useForm } from "react-hook-form";
import { Controller } from "react-hook-form";
import { Grid, Avatar, Chip, IconButton, Tooltip, Popover, TextField, Typography, Button, Box, FormControl, InputLabel, FilledInput, InputAdornment } from "@mui/material";
import { CommonButton, useFloatInputStyles } from "@zionex/wingui-core/src/common/imports";
import { blue, green } from "@mui/material/colors";
import PopSelectAccount from "@wingui/view/common/PopSelectAccount";

const defPopOverstyles = {
  width: 300,
  border: "1px solid rgba(50, 50, 50, 0.3)",
  boxSizing: "border-box",
  padding: "25px 15px",
};

const defOptions = {
  accountCode: {
    code: "CD",
    langCode: "ACCOUNT_CD",
    chipColor: "info", // display on InputField
    avatarColor: blue[100], //"primary.main", // display on PopOver
    usePopupButton: true,
  },
  accountName: {
    code: "NM",
    langCode: "ACCOUNT_NM",
    chipColor: "success",
    avatarColor: green[100], //"success.main"
  },
};

const defStyles = {
  width: 300,
  defaultWidth: 300,
  maxWidth: 500,
  display: "block",
  // popoverHeight : 250
};

export function AccountSearchBox(props, ref) {
  const classes = useFloatInputStyles();

  const defaultKeyValue = "accountName";

  const popOverstyles = defPopOverstyles;
  const options = defOptions;
  const [selectedAccount, setSelectedAccount] = useState([]);
  const [style, setStyle] = useState(defStyles);

  const buttonRef = useRef(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [hasFields, setHasFields] = useState(false);
  const [fields, setFields] = useState([]);
  const [inputLabel, setInputLabel] = useState();

  const [inputReadOnly, setInputReadOnly] = useState(true);
  const [accountPopupOpen, setAccountPopupOpen] = useState(false);
  const [inputValues, setInputValues] = useState(""); // input values
  const [placeHolder, setPlaceHolder] = useState("");
  const chipRefs = useRef([]);

  const { reset, control, getValues, setValue } = useForm({
    defaultValues: {
      // popover values
      accountCode: "",
      accountName: "",
    },
  });

  useLayoutEffect(() => {
    setPlaceHolder(props.placeHolder);
    if (props.label) {
      setInputLabel(props.label);
    } else {
      setInputLabel(transLangKey("ACCOUNT"));
    }

    if (props.style) {
      let copyStyle = { ...defStyles };

      Object.keys(props.style).map((key) => {
        copyStyle[key] = props.style[key];
      });
      copyStyle["defaultWidth"] = copyStyle["width"];

      setStyle(copyStyle);
    }
  }, [props]);

  useLayoutEffect(() => {
    let totalIconWidth = 0;

    selectedAccount.map((data, idx) => {
      chipRefs.current[idx].style.maxWidth = "";
    });

    selectedAccount.map((data, idx) => {
      totalIconWidth += chipRefs.current[idx].offsetWidth;
    });

    let totalInputWidth = totalIconWidth + 85;

    let autosizeWidth = totalInputWidth > style.maxWidth ? style.maxWidth : totalInputWidth;

    if (autosizeWidth < style.defaultWidth) {
      autosizeWidth = style.defaultWidth;
    }

    if (autosizeWidth !== style.width) {
      setStyle({ ...style, width: autosizeWidth });
    }

    if (autosizeWidth === style.maxWidth) {
      let limitWidth = autosizeWidth - 95;
      let flag = 1;

      for (let i = selectedAccount.length - 1; i >= 0; i--) {
        if (flag === selectedAccount.length) {
          selectedAccount.map((data, idx) => {
            chipRefs.current[idx].style.maxWidth = limitWidth / selectedAccount.length + "px";
          });
          break;
        }

        let ellipsisTotalWidth = 0;

        selectedAccount.map((data, idx) => {
          ellipsisTotalWidth += chipRefs.current[idx].offsetWidth;
        });

        let lastAccount = chipRefs.current[i];

        let otherAccountsWidth = ellipsisTotalWidth - lastAccount.offsetWidth;

        if (otherAccountsWidth < limitWidth - 65 * flag) {
          chipRefs.current[i].style.maxWidth = (limitWidth - otherAccountsWidth).toString() + "px";
          break;
        }

        if (otherAccountsWidth < limitWidth && otherAccountsWidth > limitWidth - 65 * flag) {
          chipRefs.current[i].style.maxWidth = "65px";
          continue;
        }

        ++flag;
      }
    }

    selectedAccount.length > 0 ? setInputReadOnly(true) : setInputReadOnly(false);
    setInputValues("");
  }, [selectedAccount]);

  useEffect(() => {
    if (selectedAccount.length === 0 && inputValues.length === 0 && !inputReadOnly) {
      setPlaceHolder(props.placeHolder);
    } else {
      setPlaceHolder("");
    }
  }, [inputValues]);

  useImperativeHandle(ref, () => ({
    setField(field) {
      setFields(field);
      if (field.length !== 0) {
        setHasFields(true);
      }
    },

    getAccountCode() {
      return getValues("accountCode");
    },

    getAccountName() {
      return getValues("accountName");
    },

    setAccountCode(value) {
      setValue("accountCode", value);
      selectedAccount.push({
        id: "accountCode",
        code: defOptions["accountCode"].code,
        value: value,
        color: defOptions["accountCode"].chipColor,
        avatarColor: defOptions["accountCode"].avatarColor,
      });
      setPlaceHolder("");
    },

    setAccountName(value) {
      setValue("accountName", value);
      selectedAccount.push({
        id: "accountName",
        code: defOptions["accountName"].code,
        value: value,
        color: defOptions["accountName"].chipColor,
        avatarColor: defOptions["accountName"].avatarColor,
      });
      setPlaceHolder("");
    },

    reset() {
      reset();
      setSelectedAccount([]);
      setPlaceHolder(props.placeHolder ? props.placeHolder : "");
    },
  }));

  const handleClick = () => {
    setAnchorEl(buttonRef.current);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleInputChange = (event) => {
    setInputValues(event.target.value);
    let key = props.keyValue ? props.keyValue : defaultKeyValue;

    setValue(key, event.target.value);
  };

  const handleInputRefresh = () => {
    let key = props.keyValue ? props.keyValue : defaultKeyValue;
    setInputValues("");
    setValue(key, "");
  };

  const handleKeyDown = (event) => {
    if (selectedAccount.length !== 0 && inputValues.length === 0 && event.key === "Backspace") {
      setValue(selectedAccount[selectedAccount.length - 1].id, "");
      if (selectedAccount.length === 1) {
        setPlaceHolder(props.placeHolder);
      }
      setSelectedAccount(selectedAccount.slice(0, selectedAccount.length - 1));
    }
  };

  const handleDelete = (account) => {
    const newSelectedAccount = [...selectedAccount];
    let index = newSelectedAccount.findIndex((object) => object.id === account.id);

    newSelectedAccount.splice(index, 1);
    setSelectedAccount(newSelectedAccount);
    setValue(account.id, "");

    newSelectedAccount.length === 0 && inputValues.length === 0 ? setPlaceHolder(props.placeHolder) : setPlaceHolder("");
  };

  const onSetAccount = (gridRows) => {
    let accountCdArr = [];
    let accountNmArr = [];

    gridRows.forEach((row) => {
      accountCdArr.push(row.ACCOUNT_CD);
      accountNmArr.push(row.ACCOUNT_NM);
    });

    setValue("accountCode", accountCdArr.join("|"));
    setValue("accountName", accountNmArr.join("|"));
    onSubmit();
    setPlaceHolder("");
  };

  const onSubmit = () => {
    let copyArray = [...selectedAccount];
    Object.keys(control._defaultValues).map((defaultValueKey) => {
      let index = copyArray.findIndex((object) => object.id === defaultValueKey);
      let isEmpty = getValues(defaultValueKey).length === 0;
      let option = defOptions[defaultValueKey];

      if (index !== -1) {
        isEmpty ? copyArray.splice(index, 1) : (copyArray[index] = { ...copyArray[index], value: getValues(defaultValueKey) });
      } else {
        if (!isEmpty) {
          copyArray.push({
            id: defaultValueKey,
            code: option.code,
            value: getValues(defaultValueKey),
            color: option.chipColor,
            avatarColor: option.avatarColor,
          });
        }
      }
    });
    setSelectedAccount(copyArray);
    copyArray.length === 0 && inputValues.length === 0 ? setPlaceHolder(props.placeHolder) : setPlaceHolder("");
    handleClose();
  };

  const setSearchConditionType = () => {
    return (
      <>
        <Box className={classes.div} style={{ display: style.display ? style.display : "block" }}>
          <FormControl className={`${classes.root} ${classes.searchBox}`} style={{ width: style.width }} variant="filled" size={"small"}>
            <InputLabel htmlFor={inputLabel}>{inputLabel}</InputLabel>
            <FilledInput
              id="account"
              type="text"
              readOnly={inputReadOnly}
              ref={buttonRef}
              disableUnderline={true}
              value={inputValues}
              onChange={(event) => handleInputChange(event)}
              onKeyDown={(event) => handleKeyDown(event)}
              placeholder={placeHolder}
              startAdornment={selectedAccount.map((account, idx) => (
                <Tooltip key={account.code} title={account.value}>
                  <Chip
                    ref={(el) => (chipRefs.current[idx] = el)}
                    avatar={<Avatar sx={{ bgcolor: account.avatarColor }}>{account.code}</Avatar>}
                    color={account.color}
                    size={"small"}
                    sx={{ maxWidth: 140, marginInlineEnd: 3 }}
                    style={{ marginTop: 15, height: 24 }}
                    key={account.code}
                    tabIndex={-1}
                    label={account.value}
                    onDelete={() => handleDelete(account)}
                    variant="outlined"
                  />
                </Tooltip>
              ))}
              endAdornment={
                <InputAdornment position="end">
                  {inputValues.length > 0 ? (
                    <CommonButton
                      title={transLangKey("REFRESH")}
                      onClick={() => {
                        handleInputRefresh();
                      }}>
                      <Icon.X />
                    </CommonButton>
                  ) : null}
                  <CommonButton title={transLangKey("DETAIL")} onClick={handleClick}>
                    <Icon.Filter />
                  </CommonButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Box>
        <Popover
          PaperProps={{ sx: { boxShadow: "rgb(0 0 0 / 20%) 0px 1px 3px 0px, rgb(0 0 0 / 14%) 0px 1px 1px 0px, rgb(0 0 0 / 12%) 0px 2px 1px -1px" } }}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}>
          <Box sx={popOverstyles}>
            <Grid container gap={10}>
              {Object.keys(options).map((key) => {
                if (props.fields && props.fields.indexOf(key) === -1) {
                  return null;
                }
                const data = options[key];
                return (
                  <Grid key={key} className={hasFields && !(fields.includes("code") || fields.includes("cd")) ? "d-none" : "d-flex"} container direction="row">
                    <Grid item justifyContent="flex-start" alignItems="flex-start" sx={{ width: "35%" }}>
                      <Grid container direction="row">
                        {/*                            <Grid item sx={{ width: 30 }}>
                              <Avatar className="mt-1" sx={{ fontSize: 10, bgcolor: data.avatarColor, width: 24, height: 24 }}>{data.code}</Avatar>
                            </Grid>*/}
                        <Grid item xs="auto">
                          <Typography className="mx-2 mt-1" variant="subtitle2" display="block" sx={{ padding: "0.05rem" }} gutterBottom>
                            {transLangKey(data.langCode)}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item justifyContent="flex-start" alignItems="flex-start" sx={{ width: "65%" }}>
                      <Controller
                        name={key}
                        control={control}
                        render={({ field: { onChange, value } }) => (
                          <TextField
                            id={key}
                            control={control}
                            sx={{ width: "95%", margin: 0 }}
                            variant="standard"
                            onChange={onChange}
                            value={value || ""}
                            InputProps={{
                              padding: 0,
                              endAdornment: (
                                <InputAdornment position="end">
                                  {data.usePopupButton ? (
                                    <CommonButton title={transLangKey("SEARCH")} onClick={() => setAccountPopupOpen(true)}>
                                      <Icon.Search />
                                    </CommonButton>
                                  ) : null}
                                  {getValues(key) !== "" ? (
                                    <IconButton
                                      onClick={() => {
                                        setInputValues("");
                                        setValue(key, "");
                                      }}>
                                      <Icon.X />
                                    </IconButton>
                                  ) : (
                                    ""
                                  )}
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>
                );
              })}
              <Grid container direction="row" style={{ marginTop: 15 }}>
                <Button onClick={onSubmit} variant={"contained"} fullWidth>
                  {transLangKey("OK")}
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Popover>
      </>
    );
  };

  return (
    <>
      {setSearchConditionType()}
      {accountPopupOpen && <PopSelectAccount open={accountPopupOpen} onClose={() => setAccountPopupOpen(false)} confirm={onSetAccount} url={props.url} />}
    </>
  );
}

export default forwardRef(AccountSearchBox);
