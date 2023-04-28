import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Avatar,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Stack,
  Step,
  StepContent,
  StepButton,
  Stepper,
  SwipeableDrawer,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  Box,
  Popover,
} from "@mui/material";
import { Add, ControlPoint, Done, DriveFileMove, EditOff, Link, Send, DeleteForeverOutlined, CopyAllOutlined, PlayCircleOutline, StopCircle } from "@mui/icons-material";
import { baseURI, transLangKey, showMessage } from "@wingui";
import { ContentInner, InputField, zAxios, useStyles, useUserStore, useViewStore } from "@zionex/wingui-core/src/common/imports";
import { loadOption } from "@wingui/view/demandplan/DpUtil";
import { withStyles } from "@mui/styles";
import PropTypes from "prop-types";

let closeCutoffSettings = {};

export function BaseControlBoard(props) {
  const [username] = useUserStore((state) => [state.username]);
  const [planType, setPlanType] = useState({});
  useViewStore((state) => [state.viewData, state.getViewInfo]);

  const [versionHistory, setVersionHistory] = useState([]);
  const [versionInfo, setVersionInfo] = useState({});
  const [approvalSteps, setApprovalSteps] = useState([]);
  const [newVersionSetting, setNewVersionSetting] = useState({});
  const [stepTabVal, setStepTabVal] = useState("inputValSettings");
  const [drawerOpen, setDrawerOpen] = useState({ right: false });
  const [versionClosed, setVersionClosed] = useState(false);
  const [selectedStep, setSelectedStep] = useState({});
  const [allAppvBtn, setAllAppvBtn] = useState(false);
  const inputValSettings = ["MEASURE_VAL_TP", "INIT_VAL_TP", "INIT_VAL"];
  const appvSettings = ["DP_INPUT_TP", "CONST_INPUT_YN", "INIT_CONST_INPUT_DTTM", "APPROVAL_CONST", "APPROVAL_EVENT", "AUTO_APPV_YN", "INIT_AUTO_APPV_DTTM"];
  let progressIndex = 999;
  const tableRowStyle = { height: { lg: "47px", xl: "55px" } };

  const { control, getValues, setValue } = useForm({
    defaultValues: {
      CLOSE_TP: "",
      CLOSE_AUTH_TP: "",
      CLOSE_STATUS: "",
      cutoffVersion: "",
      newVersion: "",
      newDescrip: "",
      newDtf: 0,
      newEndDate: new Date(),
    },
  });
  // common function for code clean
  const styleClasses = useStyles();
  const isEmpty = (param) => {
    if (param === undefined) return true;
    if (param === null) return true;
    return Object.keys(param).length === 0;
  };
  const callService = (serviceId, paramMap) => {
    return zAxios({
      method: "post",
      url: baseURI() + "engine/dp/" + serviceId,
      data: new URLSearchParams(paramMap),
    }).catch((err) => {
      console.log(err);
    });
  };

  // data handling
  const generateNewVersion = () => {
    let params = {
      VER_ID: getValues("newVersion"),
      VER_BUCKET: newVersionSetting.VER_BUCKET,
      VER_HORIZON: newVersionSetting.VER_HORIZON,
      VER_FROM_DATE: new Date(newVersionSetting.VER_FROM_DATE).format("yyyy-MM-ddT00:00:00"),
      VER_TO_DATE: new Date(getValues("newEndDate")).format("yyyy-MM-ddT00:00:00"),
      VER_DTF: getValues("newDtf"),
      VER_STAT_BUCKET: newVersionSetting.VER_STAT_BUCKET,
      VER_DESCRIP: getValues("newDescrip"),
      // "PAR_BUCKET2"  : newVersionSetting.PAR_BUCKET2,
      // "PAR_HORIZON2" : newVersionSetting.PAR_HORIZON2,
      // "PAR_DATE2" : new Date(newVersionSetting.PAR_DATE2).format("yyyy-MM-ddT00:00:00"),
      // "PRICE_TYPE": newVersionSetting.PRICE_TYPE,
      // "CURRENCY_TYPE" : newVersionSetting.CURRENCY_TYPE,
      P_USER_ID: username,
      PLAN_TP_ID: planType.ID,
    };
    if (!isEmpty(newVersionSetting.PAR_BUCKET)) {
      console.log("param is not empty");
      Object.assign(params, {
        PAR_BUCKET: newVersionSetting.PAR_BUCKET,
        PAR_HORIZON: newVersionSetting.PAR_HORIZON,
        PAR_DATE: new Date(newVersionSetting.PAR_DATE).format("yyyy-MM-ddT00:00:00"),
      });
    }

    callService("GenerateDP", params).then((res) => {
      if (res.status === gHttpStatus.SUCCESS) {
        resetVersionInfo(planType);
      }
    });
    setDrawerOpen({ ...drawerOpen, ["right"]: false });
  };

  const resetVersionInfo = (planType) => {
    loadNewVersionSetting("change", new Date(), "OPEN", planType["ID"]);
    callService("GetVersionHistory", { PLAN_TP_ID: planType["ID"] }).then((res) => {
      if (res.status === gHttpStatus.SUCCESS) {
        const rsData = res.data.RESULT_DATA;
        setVersionHistory(rsData);
        if (isEmpty(rsData)) {
          setDrawerOpen({ ...drawerOpen, ["right"]: true });
        }
      }
    });
    callService("CreateVersion", {
      //load new verison ID
      VERSION_AD_INFO: planType["ATTR_01"],
      SERVER_TYPE: "DP",
      VERSION_TYPE: "SEQ",
      PLAN_TYPE: planType["CD"],
      PLAN_TYPE_KEY: planType["ID"],
    }).then((res) => {
      res.status === gHttpStatus.SUCCESS && setValue("newVersion", res.data.RESULT_DATA[0].VER_ID);
    });
  };

  const loadCloseCutOffOptions = async () => {
    const closeTypes = await loadOption(true, "SRV_GET_SP_UI_DP_CONF_COMBO", {}, "ID", "CD_NM", false, true).then((res) => res.filter((rw) => rw.data["CONF_TP"] === "DP_CL_TP"));
    const closeAuthTypes = await loadOption(true, "SRV_GET_SP_UI_DP_PERSON_AUTH_LV_COMBO", {}, "ID", "CD_NM", false, true);
    closeCutoffSettings = { CLOSE_TP: closeTypes, CLOSE_AUTH_TP: closeAuthTypes };
  };

  const loadNewVersionSetting = (eventType, startDate, openFlg, planTypeId) => {
    if (eventType !== "change") return;
    callService("SRV_GET_SP_UI_DP_23_VER_POP_Q3", {
      CHANGE_COM: openFlg,
      DATE: new Date(startDate).format("yyyy-MM-ddT00:00:00"),
      PLAN_TP_ID: planTypeId,
    }).then((res) => {
      if (res.status === gHttpStatus.SUCCESS) {
        let rsData = res.data.RESULT_DATA[0];
        rsData.VER_FROM_DATE = new Date(rsData.VER_FROM_DATE).format("yyyy-MM-dd");
        rsData.VER_TO_DATE = new Date(rsData.VER_TO_DATE).format("yyyy-MM-dd");
        rsData.PAR_DATE = rsData.PAR_DATE === null ? null : new Date(rsData.PAR_DATE).format("yyyy-MM-dd");
        rsData.PAR_DATE2 = rsData.PAR_DATE2 === null ? null : new Date(rsData.PAR_DATE2).format("yyyy-MM-dd");
        setNewVersionSetting(rsData);
        setValue("newEndDate", rsData.VER_TO_DATE);
        setValue("newDtf", rsData.VER_DTF);
      }
    });
  };
  const copyVersion = () => {
    let params = {
      VER_ID: getValues("newVersion"),
      ORG_VER_ID: versionHistory[activeStep].ID, // version ID
      VER_DESCRIP: getValues("newDescrip"),
      P_USER_ID: username,
    };
    callService("CopyDP", params).then((res) => {
      if (res.status === gHttpStatus.SUCCESS) {
        resetVersionInfo(planType);
      }
    });
    handleCopyPopClose();
  };
  const releaseVersion = (e, statusCode) => {
    callService("ReleaseVersion", {
      VER_CD: versionHistory[0].VER_ID,
      CUTOFF_VER_CD: getValues("cutoffVersion"),
      OPERATOR_ID: username,
      CL_LV_MGMT_ID: getValues("CLOSE_AUTH_TP"),
      CL_TP_CD: closeCutoffSettings.CLOSE_TP.filter((rw) => rw.value === getValues("CLOSE_TP"))[0].data.CD,
      DP_CL_STATUS: statusCode,
    }).then(() => {
      if (statusCode === "CLOSE") {
        resetVersionInfo(planType);
      }
    });
    if (statusCode === "CLOSE") {
      setVersionClosed(true);
    }
  };

  const approveAll = (index, levelCode, levelId) => {
    callService("ApproveAll", {
      OPERATOR_ID: "",
      LOGIN_USER: username,
      AUTH_TYPE: levelCode,
      AUTH_TYPE_ID: levelId,
      VER_CD: versionHistory[0].VER_ID,
      VER_ID: versionHistory[0].ID,
      TYPE: "ROLE",
      AUTO_APPV_YN: true,
    });
    let changeSteps = approvalSteps;
    changeSteps[index].STATUS = "APPROVAL";
    setApprovalSteps(changeSteps);
  };

  useEffect(() => {
    loadCloseCutOffOptions();
    callService("SRV_GET_SP_UI_DP_00_CONF_Q1", {
      // plan type and then version History
      SP_UI_DP_00_CONF_Q1_01: "DP_PLAN_TYPE",
      SP_UI_DP_00_CONF_Q1_02: props.planTypeCode,
      SP_UI_DP_00_CONF_Q1_03: "",
    }).then((res) => {
      if (res.status === gHttpStatus.SUCCESS) {
        let rsData = res.data.RESULT_DATA[0];
        setPlanType(rsData);
        resetVersionInfo(rsData);
      }
    });
  }, []);
  const getVersionInfoAndStep = (planVersionCode) => {
    callService("SRV_GET_SP_UI_DP_23_TAB_Q1", {
      // versioninfo and close, cutoff selected value
      VERSION_ID: planVersionCode,
      PLAN_TP_ID: planType.ID,
    }).then((res) => {
      if (res.status === gHttpStatus.SUCCESS) {
        let versionData = res.data.RESULT_DATA[0];
        setVersionInfo({
          FROM_DATE: versionData["VER_FROM_DATE"],
          TO_DATE: versionData["VER_TO_DATE"],
          BUCKET: versionData["VER_BUCKET"],
          PARTIAL_BUCKET: versionData["VER_S_BUCKET"],
          PARTIAL_DATE: versionData["VER_S_HORIZON_DATE"],
          DTF: versionData["VER_DTF"],
          DTF_DATE: versionData["VER_DTF_DATE"],
        });
        setValue("CLOSE_TP", versionData["CL_TP_ID"]);
        setValue("CLOSE_AUTH_TP", versionData["CL_LV_MGMT_ID"]);
        setVersionClosed(versionData["CLOSE_STATUS"] === "CLOSE");
      }
    });
    callService("GetApprovalSteps", {
      // load a grid about status Step
      VERSION_CD: planVersionCode,
      PLAN_TP_ID: planType.ID,
      ONLY_DP_WK_YN: props.isDemandPlanOnly,
    }).then((res) => {
      if (res.status === gHttpStatus.SUCCESS) {
        let stepData = res.data.RESULT_DATA;
        setApprovalSteps(stepData);
        setSelectedStep(stepData.filter((rw) => rw.WK_TP_DP_YN)[0]);
      }
    });
  };
  useEffect(() => {
    if (!isEmpty(versionHistory)) {
      const planVersionCode = versionHistory[0].VER_ID;
      getVersionInfoAndStep(planVersionCode);
      callService("CreateVersion", {
        //load cutoffVersion ID
        VERSION_AD_INFO: planType["ATTR_01"],
        VERSION_ID: planVersionCode,
        SERVER_TYPE: "DP_CUTOFF",
        VERSION_TYPE: "REVISION",
      }).then((res) => {
        res.status === gHttpStatus.SUCCESS && setValue("cutoffVersion", res.data.RESULT_DATA[0].VER_ID);
      });
    }
  }, [versionHistory]);

  // make UI
  let disableProps = new Map();
  const makeTableHeader = (key) => {
    let chip = "";
    if (key === "DTF_DATE") {
      chip = <Chip icon={<EditOff />} label={versionInfo.DTF.toString()} variant="outlined" size="small" />;
    } else if (key === "INIT_CONST_INPUT_DTTM") {
      chip = <Chip color={selectedStep["CONST_INPUT_YN"] ? "primary" : "default"} label={selectedStep["CONST_INPUT_YN"] ? "On" : "Off"} size="small" />;
      disableProps.set(key, !selectedStep["CONST_INPUT_YN"]);
    } else if (key === "INIT_AUTO_APPV_DTTM") {
      chip = <Chip color={selectedStep.AUTO_APPV_YN ? "primary" : "default"} label={selectedStep.AUTO_APPV_YN ? "On" : "Off"} size="small" />;
      disableProps.set(key, !selectedStep.AUTO_APPV_YN);
    }
    return (
      <TableCell component="th" scope="row">
        <Stack spacing={2} direction={"row"}>
          <Typography>{transLangKey(key)}</Typography>
          {chip}
        </Stack>
      </TableCell>
    );
  };
  const makeTableCellByDataType = (dataType, key, value) => {
    let type = "text";
    let fieldValue = transLangKey(value);
    if (key.includes("DATE")) {
      type = "date";
      fieldValue = new Date(value).format("yyyy-MM-dd");
    } else if (key.includes("DTTM")) {
      type = "datetime-local";
      fieldValue = new Date(value).format("yyyy-MM-ddTHH:mm"); //:ss
    }
    return (
      <Tooltip title={fieldValue}>
        <TextField hiddenLabel type={type} variant="filled" value={fieldValue} onChange={() => false} InputProps={{ readOnly: true }} size="small" disabled={disableProps.has(key) && disableProps.get(key)} style={{ width: "190px", padding: 0, margin: 0 }} />
      </Tooltip>
    );
  };
  const makeTableByObj = (obj, compProps) => {
    return (
      <TableContainer component={compProps} sx={{ overflow: "hidden", py: 0 }} style={{ paddingBottom: 0 }}>
        <Table size="small">
          <TableBody>
            {Object.entries(obj).map(([key, value]) => {
              if (value === null) return;
              return ["DTF", "CONST_INPUT_YN", "AUTO_APPV_YN"].includes(key) ? (
                ""
              ) : (
                <TableRow key={key.toString()} sx={tableRowStyle}>
                  {makeTableHeader(key)}
                  <TableCell align="right">{makeTableCellByDataType(typeof value, key, value)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const setStatusIcon = (row, index, rowCnt) => {
    //status, ApvCnt, index, levelCode, levelId) => { row["STATUS"],row["CNT"], index, row["LV_CD"], row["LV_MGMT_ID"]
    const status = row["STATUS"];
    const chipSize = rowCnt < 6 ? "medium" : "small";
    const widthStyle = { width: rowCnt < 6 ? 100 : 90 };
    if (progressIndex > index && status === "READY") {
      progressIndex = index;
      return (
        <Chip
          label={allAppvBtn ? transLangKey("ALL_APPROVAL") : transLangKey("PROGRESS")}
          color="primary"
          variant={allAppvBtn ? "outlined" : "default"}
          avatar={allAppvBtn ? <></> : <Avatar>{row["CNT"]}</Avatar>}
          onMouseOver={() => setAllAppvBtn(true)}
          onMouseOut={() => setAllAppvBtn(false)}
          onClick={() => approveAll(index, row["LV_CD"], row["LV_MGMT_ID"])}
          size={chipSize}
          sx={widthStyle}
        />
      );
    } else {
      switch (status) {
        case "APPROVAL":
          return <Chip label={transLangKey("APPROVAL")} deleteIcon={<Done />} color={"success"} size={chipSize} />;
        case "READY":
          return <Chip label={transLangKey("READY")} size={chipSize} />;
      }
    }
    return "";
  };

  const stepCodeNameTableCell = (row, rowCnt) => {
    if (rowCnt < 6) {
      return (
        <TableCell component="th">
          <Typography variant={"subtitle1"}>
            <strong>{row["WORK_CD"]}</strong>
          </Typography>
          <Typography variant={"caption"}>{row["WORK_NM"]}</Typography>
        </TableCell>
      );
    } else {
      return (
        <TableCell component="th">
          <Tooltip title={row["WORK_NM"]}>
            <Typography variant={"subtitle1"}>
              <strong>{row["WORK_CD"]}</strong>
            </Typography>
          </Tooltip>
        </TableCell>
      );
    }
  };
  const [activeStep, setActiveStep] = useState(0);
  const handleStep = (index, step) => () => {
    setActiveStep(index);

    // 여기 말고 useEffect로 versionHistory가 바뀌는 시점에도 GetApprovalSteps서비스를 부른다.
    if (step.V_STATUS === "CLOSE") return;
    if (index === activeStep) return;
    const planVersionCode = versionHistory[index].VER_ID;
    getVersionInfoAndStep(planVersionCode);
  };
  const [anchorEl, setAnchorEl] = React.useState(null);

  const copyButtonClick = (e) => {
    // copyVersion();
    setAnchorEl(e.currentTarget);
  };
  const delButtonClick = () => {
    showMessage(transLangKey("MSG_CONFIRM"), transLangKey(versionHistory[activeStep].VER_ID + " " + transLangKey("MSG_5053")), (answer) => {
      if (answer) {
        let params = {
          VER_ID: versionHistory[activeStep].ID,
          P_USER_ID: username,
        };
        callService("DeleteDP", params).then((res) => {
          if (res.status === gHttpStatus.SUCCESS) {
            resetVersionInfo(planType);
          }
        });
      }
    });
  };
  const handleCopyPopClose = () => {
    setAnchorEl(null);
  };

  const stepAndVersionHistoryArea = () => {
    return (
      <Grid item container direction="row" alignItems="stretch" justifyContent="center" spacing={5} xs={12}>
        <Grid item xs={4}>
          <Card variant="outlined" style={{ height: "100%" }}>
            <CardContent>
              <Grid container justifyContent="space-between">
                {!isEmpty(planType) && (
                  <Tooltip title={transLangKey("PLAN_TP")}>
                    <Chip label={transLangKey(planType.CD_NM)} />
                  </Tooltip>
                )}
                <Button onClick={toggleDrawer("right", true)} startIcon={<Add />} variant={"outlined"} className={styleClasses.common}>
                  {transLangKey("NEW_VERSION")}
                </Button>
              </Grid>
              <Stepper nonLinear activeStep={activeStep} orientation="vertical">
                {!isEmpty(versionHistory) &&
                  versionHistory.map((step, index) => (
                    <Step key={step.LABEL} onClick={handleStep(index, step)}>
                      <StepButton onClick={handleStep(index, step)} icon={step.V_STATUS === "CLOSE" ? <StopCircle color={"action"} /> : <PlayCircleOutline color={index === activeStep ? "primary" : "action"} />}>
                        <Tooltip title={step.DESCRIP}>
                          <Typography variant={index === activeStep ? "h6" : "body1"} gutterBottom>
                            {index === activeStep ? <strong>{step.LABEL}</strong> : step.LABEL}
                            {/*                          {stepState.open && stepState.anchorEl === index &&
                          }*/}
                          </Typography>
                        </Tooltip>
                      </StepButton>
                      <StepContent>
                        <Typography variant={"caption"} noWrap paragraph sx={{ margin: 0 }}>
                          {step.DESCRIP}
                        </Typography>
                        {isEmpty(step.COPIED_VER_CD) ? (
                          <Typography variant={"caption"} noWrap sx={{ margin: 0 }}>
                            {transLangKey("CREATED") + " : " + new Date(step.CREATE_DTTM).format("yyyy-MM-dd")}
                          </Typography>
                        ) : (
                          <Chip size={"small"} label={transLangKey("COPIED") + " :" + step.COPIED_VER_CD} />
                        )}
                        {step.V_STATUS !== "CLOSE" && (
                          <>
                            <Tooltip title={transLangKey("DELETE")}>
                              <IconButton size="small" onClick={delButtonClick}>
                                <DeleteForeverOutlined />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={transLangKey("VER_COPY")}>
                              <IconButton size="small" onClick={copyButtonClick}>
                                <CopyAllOutlined />
                              </IconButton>
                            </Tooltip>
                          </>
                        )}
                        <Popover
                          open={Boolean(anchorEl)}
                          anchorEl={anchorEl}
                          onClose={handleCopyPopClose}
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "left",
                          }}>
                          <Box sx={{ pr: 5, pl: 5, pt: 5 }}>
                            <Controller
                              name={"newDescrip"}
                              control={control}
                              rules={null}
                              render={({ field: { onChange, value }, fieldState: { error } }) => (
                                <TextField label={transLangKey("DESCRIP")} multiline={true} rows={4} id={"newDescrip"} placeholder={getValues("newVersion") + " " + transLangKey("GENERATE")} value={value} error={!!error} onChange={onChange} variant={"outlined"} />
                              )}
                            />
                          </Box>
                          <Box sx={{ pr: 5, pl: 5, pb: 5 }}>
                            <Button variant="contained" fullWidth className={styleClasses.common} endIcon={<Send />} size={"medium"} onClick={(e) => copyVersion(e)}>
                              {transLangKey("VER_COPY")}
                            </Button>
                          </Box>
                        </Popover>
                        {/*                        <Tooltip title={transLangKey("VALIDATION")}>
                          <IconButton size={"small"} href={"/#/" + (props.planTypeCode === "DP_PLAN_YEARLY" ? "businessplan" : "demandplan") + "/version/validation"}>
                            <Badge variant={"dot"} color={"primary"}>
                              {" "}
                              <FactCheck />
                            </Badge>
                          </IconButton>
                        </Tooltip>*/}
                      </StepContent>
                    </Step>
                  ))}
              </Stepper>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={8}>
          <Card variant="outlined" style={{ minHeight: "160px", height: "100%" }}>
            <TableContainer component={CardContent}>
              <Table aria-label="approve status" stickyHeader size={!isEmpty(approvalSteps) && approvalSteps.length < 4 ? "medium" : "small"}>
                <TableHead>
                  <TableRow>
                    <TableCell padding="checkbox" />
                    <Tooltip title={transLangKey("WORK_CD_NM")}>
                      <TableCell>{transLangKey("STEP_NM")}</TableCell>
                    </Tooltip>
                    <TableCell>{transLangKey("LV_NM")}</TableCell>
                    <TableCell>
                      {transLangKey("STATUS")}
                      <Tooltip title={"Go to Process Status"}>
                        <IconButton size="small" href={baseURI() + (props.planTypeCode === "DP_PLAN_YEARLY" ? "#/demandplan/yearlyplan/processstatus" : "#/demandplan/version/processstatus")}>
                          <Link />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{transLangKey("DESCRIP")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {!isEmpty(approvalSteps) &&
                    approvalSteps.map((row, index) => (
                      <TableRow selected={row["WORK_CD"] === selectedStep["WORK_CD"]} hover onClick={() => row.WK_TP_DP_YN && setSelectedStep(row)} key={row["WORK_CD"]} sx={{ whiteSpace: "normal", wordWrap: "break-word" }}>
                        <TableCell padding="checkbox">{"#" + (Number(index) + 1).toString()}</TableCell>
                        {stepCodeNameTableCell(row, approvalSteps.length)}
                        <TableCell>{row["LV_NM"]}</TableCell>
                        <TableCell>{setStatusIcon(row, index, approvalSteps.length)}</TableCell>
                        {row["DESCRIP"] === null ? (
                          <TableCell />
                        ) : (
                          <Tooltip title={row["DESCRIP"]}>
                            <TableCell>{row["DESCRIP"]}</TableCell>
                          </Tooltip>
                        )}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const DescripTooltip = withStyles({ tooltip: { maxWidth: 200, background: "black", color: "white" } })(Tooltip);
  const versionInfoArea = (minHeight) => {
    return (
      <Grid container item direction="row" alignItems="stretch" justifyContent="center" spacing={5}>
        <Grid item xs={4}>
          <Card variant="outlined" style={{ minHeight: minHeight, height: "100%" }}>
            {/*426.53*/}
            <CardHeader titleTypographyProps={{ variant: "subtitle2" }} title={transLangKey("VER_INFO")} />
            {!isEmpty(versionInfo) && makeTableByObj(versionInfo, CardContent)}
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card variant="outlined" style={{ minHeight: minHeight, height: "100%" }}>
            <CardHeader titleTypographyProps={{ variant: "subtitle2" }} title={transLangKey("CLOSE_CUTOFF_SETTING")} />
            <TableContainer component={CardContent} sx={{ overflow: "hidden", py: 0 }} style={{ paddingBottom: 0 }}>
              <Table size={"small"}>
                <TableBody>
                  {!isEmpty(closeCutoffSettings) &&
                    Object.entries(closeCutoffSettings).map(([key, value]) => (
                      <TableRow key={key.toString()} sx={tableRowStyle}>
                        {makeTableHeader(key)}
                        <TableCell align="right">
                          <InputField type="select" name={key} label={""} control={control} options={value} style={{ width: "200px", padding: 0, margin: 0 }} />
                        </TableCell>
                      </TableRow>
                    ))}
                  <TableRow sx={tableRowStyle}>
                    <TableCell colSpan={2} align={"right"}>
                      <InputField type="text" name="cutoffVersion" label={transLangKey("CUTOFF_VERSION")} control={control} readonly={true} />
                      <DescripTooltip arrow title={<Typography variant={"body1"}>{transLangKey("MSG_WARNING_CUTOFF_DP")}</Typography>}>
                        <Button onClick={(e) => releaseVersion(e, "CUTOFF")} className={styleClasses.common} variant={"outlined"}>
                          {transLangKey("CUTOFF")}
                        </Button>
                      </DescripTooltip>
                    </TableCell>
                  </TableRow>
                  {!isEmpty(selectedStep) && progressIndex > approvalSteps.length - 1 ? (
                    <TableRow sx={tableRowStyle}>
                      <TableCell colSpan={2} align={"right"}>
                        {versionClosed ? (
                          <Chip label={transLangKey("VERSION_CLOSED")} color={"success"} />
                        ) : (
                          <DescripTooltip arrow title={<Typography variant={"body1"}>{transLangKey("MSG_WARNING_CLOSE_DP")}</Typography>}>
                            <Button className={styleClasses.common} size={"medium"} variant={"contained"} color={"primary"} endIcon={<DriveFileMove />} onClick={(e) => releaseVersion(e, "CLOSE")}>
                              {transLangKey("VERSION_CLOSE")}
                            </Button>
                          </DescripTooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  ) : (
                    ""
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card variant="outlined" style={{ minHeight: minHeight, height: "100%" }}>
            <CardContent style={{ paddingBottom: 0 }}>
              <Stack direction={"row"} spacing={4}>
                <Typography variant={"subtitle2"} gutterBottom>
                  {transLangKey("STEP_DETAIL")}
                </Typography>
                {!isEmpty(selectedStep) && <Chip label={selectedStep["WORK_NM"]} color="primary" size={"small"} variant={"outlined"} />}
              </Stack>
              <Tabs value={stepTabVal} onChange={(e, newVal) => setStepTabVal(newVal)} indicatorColor="primary">
                <Tab label={transLangKey("INIT_SETTING")} value="inputValSettings" />
                <Tab label={transLangKey("APPV_SETTING")} value="appvSettings" />
              </Tabs>
              {!isEmpty(selectedStep) && makeTableByObj(Object.fromEntries(Object.entries(selectedStep).filter(([key]) => (stepTabVal === "inputValSettings" ? inputValSettings : appvSettings).includes(key))), Box)}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
      return;
    }
    setDrawerOpen({ ...drawerOpen, [anchor]: open });
  };
  const newVersionDrawer = (drawerId) => {
    return (
      <SwipeableDrawer anchor={"right"} open={drawerOpen[drawerId]} onClose={toggleDrawer(drawerId, false)} onOpen={toggleDrawer(drawerId, true)}>
        <Box sx={{ width: "320px" }}>
          <Alert icon={<ControlPoint />} severity={"info"}>
            <Typography variant={"caption"} gutterBottom>
              {transLangKey("NEW_VERSION")}
            </Typography>
            <Typography variant={"h6"}>
              <strong>{getValues("newVersion")}</strong>
            </Typography>
          </Alert>
          <List>
            {!isEmpty(newVersionSetting) && (
              <ListItem key={"VER_FROM_DATE"} disablePadding>
                <ListItemButton>
                  <TextField type={"date"} fullWidth label={transLangKey("FROM_DATE")} variant={"standard"} value={newVersionSetting.VER_FROM_DATE} onChange={(e) => loadNewVersionSetting(e.type, e.target.value, "FROM_DT", planType.ID)} />
                </ListItemButton>
              </ListItem>
            )}
            <ListItem key={"VER_TO_DATE"} disablePadding>
              <ListItemButton>
                <Controller
                  name={"newEndDate"}
                  control={control}
                  rules={null}
                  render={({ field: { onChange, value }, fieldState: { error } }) => <TextField type={"date"} fullWidth label={transLangKey("TO_DATE")} variant={"standard"} value={value} error={!!error} onChange={onChange} id={"newEndDate"} />}
                />
              </ListItemButton>
            </ListItem>
            {!isEmpty(newVersionSetting) && newVersionSetting.PAR_DATE !== null && (
              <ListItem key={"PARTIAL_DATE"} disablePadding>
                <ListItemButton>
                  <TextField type={"date"} fullWidth label={transLangKey("PARTIAL_DATE")} variant={"standard"} InputProps={{ readOnly: true }} value={newVersionSetting.PAR_DATE} onChange={() => false} />
                </ListItemButton>
              </ListItem>
            )}
            <ListItem key={"VER_DTF"} disablePadding>
              <ListItemButton>
                <Controller
                  name={"newDtf"}
                  control={control}
                  rules={null}
                  render={({ field: { onChange, value }, fieldState: { error } }) => <TextField type={"number"} fullWidth label={transLangKey("VER_DTF")} variant={"standard"} value={value} error={!!error} id={"newDtf"} onChange={onChange} />}
                />
              </ListItemButton>
            </ListItem>
            <ListItem key={"VER_DESCRIP"} disablePadding>
              <ListItemButton>
                <Controller
                  name={"newDescrip"}
                  control={control}
                  rules={null}
                  render={({ field: { onChange, value }, fieldState: { error } }) => <TextField fullWidth label={transLangKey("DESCRIP")} multiline={true} rows={4} id={"newDescrip"} value={value} error={!!error} onChange={onChange} variant={"standard"} />}
                />
              </ListItemButton>
            </ListItem>
            <ListItem key={"GENERATE"} disablePadding>
              <ListItemButton>
                <Button variant="contained" className={styleClasses.common} endIcon={<Send />} size={"medium"} onClick={(e) => generateNewVersion(e)}>
                  {transLangKey("GENERATE")}
                </Button>
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </SwipeableDrawer>
    );
  };

  return (
    <ContentInner>
      <Grid container spacing={5} alignItems="stretch" justifyContent="center" direction="row" sx={{ overflowY: "auto" }} style={{ height: "calc(100vh - 91px)" }}>
        {stepAndVersionHistoryArea()}
        {versionInfoArea("395px")}
      </Grid>
      {newVersionDrawer("right")}
    </ContentInner>
  );
}

BaseControlBoard.propTypes = {
  planTypeCode: PropTypes.oneOf(["DP_PLAN_MONTHLY", "DP_PLAN_YEARLY"]),
  isDemandPlanOnly: PropTypes.bool,
};

export default BaseControlBoard;
