import React, { useState, useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button, Card, CardContent, CardHeader, Chip, Grid, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableRow, Tabs, TextField, Typography, Box, Select, MenuItem, FormControl, Switch, ButtonGroup, Tooltip, Popper, Grow, Paper, ClickAwayListener, MenuList } from "@mui/material";
import { Save } from "@mui/icons-material";
import { baseURI, gridComboLoad, showMessage, transLangKey, vom } from "@wingui";
import { ContentInner, zAxios, useStyles, BaseGrid, useViewStore, ResultArea, ButtonArea, InputField, LeftButtonArea, RightButtonArea, GridAddRowButton, GridDeleteRowButton, GridSaveButton, useUserStore } from "@zionex/wingui-core/src/common/imports";
import { loadOption, newRowEditCellStyle, isEmptyArray, isEmpty } from "@wingui/view/demandplan/DpUtil";
import AntSwitch from "@wingui/view/demandplan/common/AntSwitch";
import PropTypes from "prop-types";

const statusGridItems = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: 100, textAlignment: "center" },
  { name: "WORK_CD", dataType: "text", headerText: "WORK_CD", visible: true, editable: true, width: 100, button: "action", textAlignment: "center", styleCallback: newRowEditCellStyle },
  { name: "WORK_NM", dataType: "text", headerText: "WORK_NM", visible: true, editable: true, width: 100, textAlignment: "center", styleCallback: newRowEditCellStyle },
  { name: "SEQ", dataType: "number", headerText: "SEQ", visible: true, editable: true, width: 50, textAlignment: "center" },
  { name: "WORK_TP_ID", dataType: "dropdown", headerText: "WORK_TP_ID", visible: !BaseControlBoardMaster.prototype.isDemandPlanOnly, editable: true, useDropdown: true, lookupDisplay: true, width: 100, textAlignment: "center" },
  { name: "LV_MGMT_ID", dataType: "dropdown", headerText: "LV_NM", visible: true, editable: true, useDropdown: true, lookupDisplay: true, width: 100, textAlignment: "center" },
  { name: "DESCRIP", dataType: "text", headerText: "DESCRIP", visible: true, editable: true, width: 130, textAlignment: "center" },
  { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: 80, textAlignment: "center" },
  { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: 100, format: "yyyy-MM-dd", textAlignment: "center" },
  { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 80, textAlignment: "center" },
  { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 100, format: "yyyy-MM-dd", textAlignment: "center" },
];

let allInitValOptions = [];
let stepChangeFlg = false;

let closeCutoffSettings = {};
let stepDetailOptions = {};
let demandPlanWorkRows = [];
let conBoardMasterInit = [];

export function BaseControlBoardMaster(props) {
  const [username, displayName] = useUserStore((state) => [state.username, state.displayName]);
  //const [planType, setPlanType] = useState({});
  const inputValSettings = ["MS_VAL_TP", "INIT_VAL_TP", "INIT_VAL"];
  const appvSettings = ["APPROVAL_CONST", "APPROVAL_EVENT", "AUTO_APPV_YN", "INIT_AUTO_APPV_VAL", "INIT_AUTO_APPV_TIME_VAL"];
  const inputSettings = ["DP_INPUT_TP", "CONST_INPUT_YN", "INIT_CONST_INPUT_VAL", "INIT_CONST_INPUT_TIME_VAL"];

  const [stepTabVal, setStepTabVal] = useState("inputValSettings");
  const [selectedWorkName, setSelectedWorkName] = useState();
  const [statusGrid, setStatusGrid] = useState(null);
  const [viewData, getViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo]);
  const [initValOption, setInitValOption] = useState([]);
  const [approveDisable, setApproveDisable] = useState(true);
  const [inputDisable, setInputDisable] = useState(true);
  const [planTypeOption, setPlanTypeCombo] = useState([]);

  const { control, getValues, setValue, watch } = useForm({
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
  const tableRowStyle = { height: { md: "47px", lg: "50px", xl: "65px" } };
  const callService = (serviceId, paramMap) => {
    return zAxios({
      method: "post",
      url: baseURI() + "engine/dp/" + serviceId,
      data: new URLSearchParams(paramMap),
    }).catch((err) => {
      console.log(err);
    });
  };

  //조회조건 품목 유형 load
  const loadPlanType = async () => {
    const planTypeData = await loadOption(true, "SRV_GET_SP_UI_DP_00_CONF_Q1", { SP_UI_DP_00_CONF_Q1_01: "DP_PLAN_TYPE", SP_UI_DP_00_CONF_Q1_02: "", SP_UI_DP_00_CONF_Q1_03: "" }, "ID", "CD_NM", false, true);
    // console.log("planTypeData => ... ", planTypeData);
    if (!isEmptyArray(planTypeData)) {
      setPlanTypeCombo(planTypeData);
      setValue("planType", planTypeData.filter((rw) => rw.data.CD === props.planTypeCode)[0].value);
    }
  };

  const loadOptions = async () => {
    let configCombo = await loadOption(true, "SRV_GET_SP_UI_DP_CONF_COMBO", {}, "ID", "CD_NM", false, true);
    const closeAuthTypes = await loadOption(true, "SRV_GET_SP_UI_DP_PERSON_AUTH_LV_COMBO", {}, "ID", "CD_NM", false, true);
    closeCutoffSettings = { CLOSE_TP: configCombo.filter((rw) => rw.data["CONF_TP"] === "DP_CL_TP"), CLOSE_AUTH_TP: closeAuthTypes.filter((rw) => rw.data["GRP_CD"] === "DISTINCT") };
    let measureValTypes = configCombo
      .filter((rw) => {
        const data = rw.data;
        if (data["CONF_TP"] === "DP_MS_VAL_TP") {
          return data["CD"].includes("QTY") && data["CD"] !== "QTY_A";
        }
      })
      .map((rw) => ({ value: rw.data["CD"], label: rw["label"] }));
    stepDetailOptions = {
      MS_VAL_TP: measureValTypes,
      INIT_VAL_TP: configCombo.filter((rw) => rw.data["CONF_TP"] === "DP_INIT_VAL_TP"),
      DP_INPUT_TP: configCombo.filter((rw) => rw.data["CONF_TP"] === "DP_INPUT_TP"),
      APPROVAL_CONST: configCombo.filter((rw) => rw.data["CONF_TP"] === "DP_APPV_CONST_TP"),
      APPROVAL_EVENT: configCombo.filter((rw) => rw.data["CONF_TP"] === "DP_APPV_EVT_TP"),
    };
    allInitValOptions = await loadOption(true, "SRV_GET_SP_UI_DP_22_INIT_VALUE_COMBO", {}, "INIT_VAL_ID", "VAL_NM", false, true);
    //work type dropdown
    statusGrid.gridView.setColumnProperty(
      "WORK_TP_ID",
      "lookupData",
      configCombo.filter((rw) => rw.data["CONF_TP"] === "DP_WK_TP")
    );

    gridComboLoad(statusGrid, {
      URL: "engine/dp/SRV_GET_SP_UI_DP_00_LV_CD_Q1",
      CODE_VALUE: "ID",
      CODE_LABEL: "CD_NM",
      COLUMN: "LV_MGMT_ID",
      PROP: "lookupData",
      TRANSLANG_LABEL: true,
      PARAM_KEY: ["LV_TP", "ACCOUNT_TP", "TYPE"],
      PARAM_VALUE: ["S", "SALES", "NOT_ALL"],
    });

    callService("GetConBoardMasterInit", {}).then((res) => {
      if (res.status === gHttpStatus.SUCCESS) {
        conBoardMasterInit = res.data.RESULT_DATA;
      }
    });
  };

  const loadSelectedStep = (selectedStep) => {
    if (isEmpty(selectedStep)) return;
    console.log("selectedStep", selectedStep);
    setSelectedWorkName(selectedStep.WORK_NM);
    for (const [key, value] of Object.entries(selectedStep)) {
      setValue(key, value === null ? "" : value);
    }
    setApproveDisable(!selectedStep.AUTO_APPV_YN);
    setInputDisable(!selectedStep.CONST_INPUT_YN);
    stepChangeFlg = false;
  };

  const gridOption = () => {
    statusGrid.gridView.setStateBar({ visible: true });
    statusGrid.gridView.setCheckBar({ visible: true });
    statusGrid.gridView.setEditOptions({
      insertable: true,
      appendable: true,
    });
    statusGrid.gridView.displayOptions.fitStyle = "fill";
    statusGrid.gridView.setColumnProperty("WORK_CD", "buttonVisibility", "always");
    statusGrid.gridView.onCellButtonClicked = (grid, itemIndex) => {
      let selectedRow = demandPlanWorkRows[itemIndex.dataRow];
      if (!selectedRow.WK_TP_DP_YN) return;
      if (stepChangeFlg) {
        showMessage(transLangKey("MSG_CONFIRM"), "MSG_WARNING_SAVE_STATUS", (answer) => {
          if (answer) {
            loadSelectedStep(selectedRow);
          }
        });
      } else {
        loadSelectedStep(selectedRow);
      }
    };
  };

  const loadCloseSetting = (closeSetting) => {
    // console.log("[loadCloseSetting] close setting", closeSetting);
    if (closeSetting !== undefined) {
      setValue("CLOSE_TP", closeSetting["CL_TP_ID"] === null ? "" : closeSetting["CL_TP_ID"]);
      setValue("CLOSE_AUTH_TP", closeSetting["CL_LV_MGMT_ID"] === null ? "" : closeSetting["CL_LV_MGMT_ID"]);
      setValue("CLOSE_ID", closeSetting["ID"] === null ? "" : closeSetting["ID"]);
    } else {
      setValue("CLOSE_TP", "");
      setValue("CLOSE_AUTH_TP", "");
      setValue("CLOSE_ID", "");
    }
  };

  const gridLoadData = (isInit, planTypeId) => {
    callService("GetDPStepGrid", { PLAN_TP_ID: planTypeId }).then((res) => {
      if (res.status === gHttpStatus.SUCCESS) {
        let dataArr = res.data.RESULT_DATA;
        demandPlanWorkRows = props.isDemandPlanOnly ? dataArr.filter((row) => row.WK_TP_DP_YN) : dataArr;
        statusGrid.dataProvider.fillJsonData(demandPlanWorkRows);
        if (isInit) {
          loadSelectedStep(demandPlanWorkRows.filter((row) => row.WK_TP_DP_YN)[0]);
          loadCloseSetting(dataArr.filter((row) => row.WORK_TP_CD === "CL")[0]);
          gridOption();
        }
      }
    });
  };

  useEffect(() => {
    if (statusGrid) {
      gridLoadData(true, getValues("planType"));
    }
  }, [watch("planType")]);

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, "statusGrid");
    if (grdObj1 && grdObj1.dataProvider) {
      setStatusGrid(grdObj1);
    }
  }, [viewData]);

  useEffect(() => {
    if (statusGrid) {
      loadOptions().then(() => {
        // console.log("[LOG] stepDetailOptions", stepDetailOptions);

        loadPlanType();
      });
    }
  }, [statusGrid]);

  useEffect(() => {
    setInitValOption(allInitValOptions.filter((option) => option.data.INIT_VAL_TP_ID === getValues("INIT_VAL_TP")));
    // console.log("[DEBUG] allInitValOptions", allInitValOptions.filter((option) => (option.data.INIT_VAL_TP_ID === getValues("INIT_VAL_TP"))));
  }, [watch("INIT_VAL_TP")]);

  useEffect(() => {
    if (getValues("MS_VAL_TP")) {
      // console.log("[LOG] conBoardMasterInit", conBoardMasterInit)
      const selectedRow = conBoardMasterInit.filter((rw) => rw["CONBD_MST_ID"] === getValues("ID") && rw["MS_VAL_TP_CD"] === getValues("MS_VAL_TP"))[0];
      // console.log("[LOG] getValues(MS_VAL_TP)", getValues("MS_VAL_TP"));
      // console.log("[LOG] selectedRow", selectedRow, "isEmpty(selectedRow)", isEmpty(selectedRow));
      setValue("INIT_VAL_TP", isEmpty(selectedRow) ? "" : selectedRow["INIT_VAL_TP_ID"]);
      setValue("INIT_VAL", isEmpty(selectedRow) ? "" : selectedRow["INIT_VAL"]);
    }
  }, [watch("MS_VAL_TP")]);

  // make UI
  const makeTableHeader = (key) => {
    // console.log("[makeTableHeader] key", key);
    let chip = "";
    if (key === "INIT_CONST_INPUT_VAL") {
      chip = (
        <Controller
          name={"CONST_INPUT_YN"}
          control={control}
          render={({ field: { onChange, value }, fieldState: {} }) => (
            <AntSwitch
              checked={value}
              onChange={(event, newValue) => {
                setInputDisable(!newValue);
                stepChangeFlg = true;
                onChange(newValue);
              }}
              size="small"
            />
          )}
        />
      );
    } else if (key === "INIT_AUTO_APPV_VAL") {
      chip = (
        <Controller
          name={"AUTO_APPV_YN"}
          control={control}
          render={({ field: { onChange, value }, fieldState: {} }) => (
            <AntSwitch
              checked={value}
              onChange={(event, newValue) => {
                setApproveDisable(!newValue);
                stepChangeFlg = true;
                onChange(newValue);
              }}
              size="small"
            />
          )}
        />
      );
    }
    return (
      <TableCell scope="row" size={"small"}>
        <Stack spacing={2} direction={"row"}>
          <Typography>{transLangKey(key)}</Typography>
          {chip}
        </Stack>
      </TableCell>
    );
  };

  const makeTableCellByDataType = (key) => {
    // console.log("[makeTableCellByDataType] key", key);
    if (key.includes("TIME_VAL") || key === "INIT_CONST_INPUT_VAL" || key === "INIT_AUTO_APPV_VAL") {
      return (
        <FormControl variant={"standard"} hiddenLabel>
          <Controller
            name={key}
            control={control}
            rules={null}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextField
                hiddenLabel
                type={"number"}
                id={key}
                inputProps={{ style: { textAlign: "right", paddingRight: "5px" } }}
                style={{ padding: 0, margin: 0 }}
                // disabled={disableProps[key]}
                disabled={key.includes("INPUT") ? inputDisable : approveDisable}
                value={value}
                error={!!error}
                onChange={(event) => {
                  stepChangeFlg = true;
                  onChange(event.target.value);
                }}
                variant={"standard"}
              />
            )}
          />
        </FormControl>
      );
    } else {
      return (
        getValues(key) !== undefined && (
          <FormControl variant={"standard"} fullWidth hiddenLabel>
            <Controller
              name={key}
              control={control}
              rules={null}
              render={({ field: { onChange, value }, fieldState: {} }) => (
                <Select
                  value={value}
                  onChange={(event) => {
                    stepChangeFlg = true;
                    onChange(event.target.value);
                  }}
                  displayEmpty>
                  {(key === "INIT_VAL" ? initValOption : stepDetailOptions[key]).map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
        )
      );
    }
  };

  const saveStepDetail = () => {
    const initValTypeCode = isEmpty(initValOption) ? "NN" : initValOption[0].data.TP_CD;
    let params = {
      ID: getValues("ID"),
      APPV_CONST_ID: getValues("APPROVAL_CONST"),
      APPV_EVENT_ID: getValues("APPROVAL_EVENT"),
      AUTO_APPV_YN: getValues("AUTO_APPV_YN") ? "Y" : "N",
      INIT_AUTO_APPV_TIME_VAL: getValues("INIT_AUTO_APPV_TIME_VAL"),
      INIT_AUTO_APPV_VAL: getValues("INIT_AUTO_APPV_VAL"),
      INPUT_TP_ID: getValues("DP_INPUT_TP"),
      CONST_INPUT_YN: getValues("CONST_INPUT_YN") ? "Y" : "N",
      INIT_CONST_INPUT_TIME_VAL: getValues("INIT_CONST_INPUT_TIME_VAL"),
      INIT_CONST_INPUT_VAL: getValues("INIT_CONST_INPUT_VAL"),
      USER_ID: username,
      MODIFY_DTTM: new Date().format("yyyy-MM-ddT00:00:00"),
    };
    let initValueParams = {
      ID: getValues("ID"), // control board master ID
      MS_VAL_TP_CD: getValues("MS_VAL_TP"),
      INIT_VAL_TP_ID: getValues("INIT_VAL_TP"),
      INIT_MEASURE_ID: initValTypeCode === "MS" ? getValues("INIT_VAL") : "",
      INIT_FIXED_LV_MGMT_ID: initValTypeCode === "PR" ? getValues("INIT_VAL") : "",
    };
    if (getValues("MS_VAL_TP") === "QTY") {
      Object.assign(params, initValueParams);
    } else {
      callService("SetConBoardInitMaster", initValueParams).then((res) => {
        if (res.data.RESULT_MESSAGE === "execute mergence query success") {
          conBoardMasterInit.map((rw) => {
            if (rw.CONBD_MST_ID === initValueParams.ID && rw.MS_VAL_TP_CD === initValueParams.MS_VAL_TP_CD) {
              rw["INIT_VAL_TP_ID"] = initValueParams["INIT_VAL_TP_ID"];
              rw["INIT_VAL"] = getValues("INIT_VAL");
            }
            return rw;
          });
        }
      });
    }
    // console.log("[saveStepDetail] params", params);
    callService("SetDPStepDetail", params).then((res) => {
      if (res.data.RESULT_MESSAGE === "execute mergence query success") {
        stepChangeFlg = false;
        gridLoadData(false, getValues("planType"));
      }
    });
  };

  const makeTable = (keyArr, compProps) => {
    // console.log("[makeTable] keyArr", keyArr);
    return (
      <TableContainer component={compProps}>
        <Table size={"small"}>
          <TableBody>
            {keyArr.map((key) =>
              ["CONST_INPUT_YN", "AUTO_APPV_YN"].includes(key) ? (
                ""
              ) : (
                <TableRow key={key.toString()} sx={tableRowStyle}>
                  {makeTableHeader(key)}
                  <TableCell align="right">{makeTableCellByDataType(key)}</TableCell>
                </TableRow>
              )
            )}
            <TableRow sx={tableRowStyle}>
              <TableCell colSpan={2} align={"right"}>
                <Button className={styleClasses.common} variant={"outlined"} onClick={() => saveStepDetail()} startIcon={<Save />}>
                  {transLangKey("SAVE_STEP_DETAIL")}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const saveCloseSetting = () => {
    // value undefined check
    /*    console.log("[saveCloseSetting] params", {"ID" : getValues("CLOSE_ID"), "CL_TP_ID": getValues("CLOSE_TP"), "CL_LV_MGMT_ID": getValues("CLOSE_AUTH_TP"),
          "USER_ID": username, "PLAN_TP_ID": planType.ID});*/
    callService("SetCloseSetting", { ID: getValues("CLOSE_ID"), CL_TP_ID: getValues("CLOSE_TP"), CL_LV_MGMT_ID: getValues("CLOSE_AUTH_TP"), USER_ID: username, PLAN_TP_ID: getValues("planType") });
  };
  const versionInfoArea = () => {
    return (
      <Grid container direction="row" alignItems="stretch" justifyContent="center" spacing={5} sx={{ height: "calc(100% - 4px)" }}>
        <Grid item xs={5}>
          <Card variant="outlined" style={{ height: "100%" }}>
            <CardHeader titleTypographyProps={{ variant: "subtitle2" }} title={transLangKey("VERSION_CLOSE")} />
            <TableContainer component={CardContent} sx={{ overflow: "hidden" }}>
              <Table size={"small"}>
                <TableBody>
                  {!isEmpty(closeCutoffSettings) &&
                    Object.entries(closeCutoffSettings).map(([key, val]) => (
                      <TableRow key={key.toString()} sx={tableRowStyle}>
                        {makeTableHeader(key)}
                        <TableCell>
                          <FormControl variant={"standard"} fullWidth hiddenLabel>
                            <Controller
                              name={key}
                              control={control}
                              rules={null}
                              render={({ field: { onChange, value }, fieldState: {} }) => (
                                <Select value={value} onChange={onChange} displayEmpty>
                                  {val.length > 0 &&
                                    val.map((option) => (
                                      <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                      </MenuItem>
                                    ))}
                                </Select>
                              )}
                            />
                          </FormControl>
                        </TableCell>
                      </TableRow>
                    ))}
                  <TableRow>
                    <TableCell colSpan={2} align={"right"}>
                      <Button className={styleClasses.common} variant={"outlined"} onClick={() => saveCloseSetting()} startIcon={<Save />}>
                        {transLangKey("SAVE_CLOSE_SETTING")}
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
        <Grid item xs={7}>
          <Card variant="outlined" style={{ height: "100%" }}>
            <CardContent>
              <Stack direction={"row"} spacing={4}>
                <Typography variant={"subtitle2"} gutterBottom>
                  {transLangKey("STEP_DETAIL")}
                </Typography>
                <Chip label={selectedWorkName} color="primary" size={"small"} variant={"outlined"} />
              </Stack>
              <Tabs value={stepTabVal} onChange={(e, newVal) => setStepTabVal(newVal)} indicatorColor="primary">
                <Tab label={transLangKey("INIT_SETTING")} value="inputValSettings" />
                <Tab label={transLangKey("APPV_SETTING")} value="appvSettings" />
                <Tab label={transLangKey("INPUT_SETTING")} value="inputSettings" />
              </Tabs>
              {makeTable(stepTabVal === "inputValSettings" ? inputValSettings : stepTabVal === "appvSettings" ? appvSettings : inputSettings, Box)}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    );
  };
  const onDelete = (targetGrid, deleteRows) => {
    if (deleteRows.length > 0) {
      let formData = new FormData();
      formData.append("changes", JSON.stringify(deleteRows));
      formData.append("USER_ID", username);
      return zAxios({
        method: "post",
        url: baseURI() + "engine/dp/SRV_SET_SP_UI_DP_22_D1",
        headers: { "content-type": "application/json" },
        data: formData,
      });
    }
  };
  const onBeforeAdd = () => {
    statusGrid.gridView.setColumnProperty("WORK_CD", "buttonVisibility", "hidden");
  };
  const saveGridData = (targetGrid) => {
    // console.log("targetGrid.dataProvider.getAllStateRows()", targetGrid.dataProvider.getAllStateRows());
    targetGrid.gridView.commit(true);

    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), (answer) => {
      if (answer) {
        const dataProvider = targetGrid.dataProvider;
        const allStateRows = dataProvider.getAllStateRows();
        const changes = allStateRows.created.concat(allStateRows.updated);
        const changeRowData = changes.map((row) => dataProvider.getJsonRow(row));
        // console.log("changeRowData", changeRowData, "changes", changes);
        let formData = new FormData();
        formData.append("changes", JSON.stringify(changeRowData));
        formData.append("USER_ID", username);
        formData.append("PLAN_TP_ID", getValues("planType"));

        if (changeRowData.length === 0) {
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"));
        } else {
          targetGrid.gridView.showToast(progressSpinner + "Saving data...", true);
          zAxios({
            method: "post",
            headers: { "content-type": "application/json" },
            url: baseURI() + "engine/dp/SetDPStepGrid",
            data: formData,
          })
            .catch((err) => {
              console.log(err);
            })
            .then(() => {
              targetGrid.gridView.hideToast();
              gridLoadData(true, getValues("planType"));
            });
        }
      }
    });
  };
  return (
    <ContentInner>
      <ButtonArea>
        <LeftButtonArea>
          <InputField name="planType" label={transLangKey("PLAN_TP")} type="select" control={control} options={planTypeOption} />
        </LeftButtonArea>
        <RightButtonArea>
          <GridAddRowButton grid="statusGrid" type="icon" onGetData={onBeforeAdd} />
          <GridDeleteRowButton grid="statusGrid" type="icon" onDelete={onDelete} onAfterDelete={() => gridLoadData(true, getValues("planType"))} />
          <GridSaveButton
            grid="statusGrid"
            type="icon"
            onClick={() => {
              saveGridData(statusGrid);
            }}
          />
        </RightButtonArea>
      </ButtonArea>
      <ResultArea sizes={[38, 57]}>
        <Box sx={{ marginBottom: "4px" }}>
          <BaseGrid id="statusGrid" items={statusGridItems} />
        </Box>
        <Box sx={{ marginTop: "4px" }}>{versionInfoArea()}</Box>
      </ResultArea>
    </ContentInner>
  );
}

BaseControlBoardMaster.propTypes = {
  planTypeCode: PropTypes.oneOf(["DP_PLAN_MONTHLY", "DP_PLAN_YEARLY"]),
  isDemandPlanOnly: PropTypes.bool,
};

export default BaseControlBoardMaster;
