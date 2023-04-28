import React, { useState, useEffect, useRef } from "react";
import { Box, Chip, Paper, ButtonGroup, Button, Grow, Popper, ClickAwayListener, MenuItem, MenuList, IconButton, Tabs, Tab, Grid } from "@mui/material";
import { useForm } from "react-hook-form";
import PopDPAccountTree from "@wingui/view/demandplan/common/PopAccountTree";
import PopDPItemTree from "@wingui/view/demandplan/common/PopItemTree";
import PopSelectUser from "@wingui/view/demandplan/common/PopSelectUser";
import PopPersonalize from "@wingui/view/common/PopPersonalize";

import PopMeasureCopy from "@wingui/view/demandplan/entry/entry/PopMeasureCopy";
import PopExtraParam from "@wingui/view/demandplan/entry/entry/PopExtraParam";
import PopComment from "@wingui/view/demandplan/entry/entry/PopComment";
import "@wingui/view/demandplan/custom.css";
import {
  loadDelegationCntData,
  loadVersionData,
  loadAuthTypeData,
  loadActiveUserTaskData,
  loadDimensionData,
  loadMeasureData,
  loadCrossTabData,
  loadPreferenceData,
  gridDataFillReady,
  gridAfterSetData,
  getOnlyUpdatedRows,
  getDTFdateFormat,
  setGridCrosstabInfo,
  setGridPreferenceInfo,
  getDateFromString,
  isSatisfiedValue,
} from "@wingui/view/demandplan/entry/entry/entryUtil";

import { Icon, transLangKey } from "@wingui";

import { useIconStyles, ContentInner, ResultArea, SearchArea, StatusArea, ButtonArea, LeftButtonArea, RightButtonArea, GridExcelExportButton, GridExcelImportButton, CommonButton, InputField, BaseGrid, GridCnt, useViewStore, useUserStore, zAxios } from "@zionex/wingui-core/src/common/imports";

import { isEmptyArray, loadOption, nvl, dimensionItems, labelColors, getYYYYMMDD } from "@wingui/view/demandplan/DpUtil";

import { STYLE_ID_EDIT_MEASURE, STYLE_ID_ROW_INSERTING, STYLE_ID_EDITABLE, STYLE_ID_UNEDITABLE } from "@zionex/wingui-core/src/common/const";
import { ArrowDropDown, Save } from "@mui/icons-material";

let grid1Items = [
  ...dimensionItems,
  ...[
    { name: "BUCK_TP", dataType: "string", visible: false, editable: false, type: "string" },
    { name: "ITEM", dataType: "string", visible: false, editable: false, type: "string" },
    { name: "ACCOUNT", dataType: "string", visible: false, editable: false, type: "string" },
    { name: "SALES", dataType: "string", visible: false, editable: false, type: "string" },
    { name: "CATEGORY", dataType: "string", headerText: "Measure", visible: true, editable: false, width: "120", title: "Measure", type: "string", lang: true, styleName: "white-row" },
    { name: "DATE", dataType: "number", visible: true, editable: false, width: "70", type: "number", styleName: "white-row", iteration: { prefix: "DATE_", prefixRemove: "true", postfix: ",VALUE", postfixRemove: "true", delimiter: "-" } },
    { name: "COMMENT", dataType: "string", visible: false, editable: false, width: "70", type: "string", iteration: { prefix: "DATE_", prefixRemove: "true", postfix: ",COMMENT", postfixRemove: "true" } },
  ],
];

let initExtraParam = { ITEM_ATTR_01: "", ITEM_ATTR_02: "", ITEM_ATTR_03: "", ACCT_ATTR_01: "", ACCT_ATTR_02: "", ACCT_ATTR_03: "", GRADE: "", COV: "" };

import { Chart as ChartJS, LinearScale, CategoryScale, BarElement, PointElement, LineElement, Legend, Title, Tooltip, LineController, BarController } from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, LineController, BarController);

let defaultBucketTp;
function BaseEntry(props) {
  const iconClasses = useIconStyles();
  const [username, displayName, systemAdmin] = useUserStore((state) => [state.username, state.displayName, state.systemAdmin]);
  const [message, setMessage] = useState();
  let globalButtons = [];
  let [chartData, setChartData] = useState([]);

  let [chartLabels, setChartLabels] = useState([]);
  let [chartMeasures, setChartMeasures] = useState([]);
  let [tabValue, setTabValue] = useState("QTY");
  //1. view 페이지 데이타 store
  const [setViewInfo] = useViewStore((state) => [state.setViewInfo]);

  //popup
  const [personalizeOpen, setPersonalizeOpen] = useState(false);
  const [popItemTreeOpen, setPopItemTreeOpen] = useState(false);
  const [popAccountOpen, setPopAccountOpen] = useState(false);
  const [userPopupOpen, setUserPopupOpen] = useState(false);
  const [measureCopyPopup, setMeasureCopyOpen] = useState(false);
  const [extraParamOpen, setExtraParamOpen] = useState(false);
  const [extraParamData, setExtraParamData] = useState(initExtraParam);
  const [commentOpen, setCommentOpen] = useState(false);
  const [commentData, setCommentData] = useState({});

  const excelUpload = useRef(false);

  const currentVersion = useRef(null);
  const currentUserId = useRef(null);
  const currentAuthTp = useRef(null);

  const [activeTask, setActiveTask] = useState(null);
  const delegationCnt = useRef(null);

  /* test start */
  const anchorRef = useRef(null);
  const [selectedDistIndex, setSelectedDistIndex] = useState(0);
  const [distOptOpen, setDistOptOpen] = useState(false);

  const handleMenuItemClick = (event, index) => {
    setSelectedDistIndex(index);
    setDistOptOpen(false);
  };
  const handleToggle = () => {
    setDistOptOpen((prevOpen) => !prevOpen);
  };
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setDistOptOpen(false);
  };
  /* test end */

  // 코드 데이타
  const [planTpOptions, setPlanTpData] = useState([]);
  const [versionOptions, setVersionData] = useState([]);
  const [authTpOptions, setAuthTpData] = useState([]);

  const [itemGradeOptions, setItemGradeData] = useState([]);
  const [itemCovOptions, setItemCovData] = useState([]);
  const [currencyOptions, setCurrencyData] = useState([]);
  const [distOptsOptions, setDistOptsData] = useState([]);
  const [bucketOptions, setBucketData] = useState([]);
  const [status, setStatus] = useState(null);

  //const [prefInfoObj, setPrefInfoObj] = useState(null);

  //2. 그리드 Object
  //const [grid1, setGrid1] = useState(null);
  const refGrid1 = useRef(null);
  const grid1 = refGrid1.current;

  //3. 상태 메시지
  // const [message, setMessage] = useState();
  //4. FORM 데이타 처리
  const {
    handleSubmit,
    // reset,
    control,
    getValues,
    setValue,
    watch,
    // register,
    // formState: { errors },
    clearErrors,
  } = useForm({ defaultValues: {} });
  const selectedPlanTp = watch("PLAN_TP");
  const selectedVersion = watch("VER_ID");
  const selectedUserId = watch("USER_ID");
  const selectedAuthTp = watch("AUTH_TP");

  //mount 시 처리
  useEffect(() => {
    // 초기값
    loadDelegationCnt();
    loadPlanTp();
    //loadItemGrade();
    //loadItemCov();
    setValue("USER_ID", username);
    setValue("EMP_NM", displayName);
    //setExtraParamData(initExtraParam);
  }, []);

  const loadDelegationCnt = async () => {
    let delegationCntData = await loadDelegationCntData(username);
    if (delegationCntData && delegationCntData.length > 0) {
      delegationCnt.current = delegationCntData[0].DELEGATION_COUNT;
    }
  };

  const loadPlanTp = async () => {
    const options = await loadOption(true, "SRV_GET_SP_UI_DP_00_CONF_Q1", { SP_UI_DP_00_CONF_Q1_01: "DP_PLAN_TYPE", SP_UI_DP_00_CONF_Q1_02: props.planTypeCode, SP_UI_DP_00_CONF_Q1_03: "" }, "ATTR_01", "CD_NM", false, true);
    if (!isEmptyArray(options)) {
      setPlanTpData(options);
      //setValue("plantTp", grids[0].value);
    }
  };

  const loadVersion = async (planTypeCd) => {
    let versionData = await loadVersionData(planTypeCd);

    //const options = await loadOption(true, "GetVersion", { SERVER_TYPE: "DP", PLAN_TYPE: planTypeCd, PLAN_TYPE_KEY: planTypeId }, "VER_ID", "VER_ID", false, true);
    let options = [];
    if (versionData) {
      versionData.map((row) => {
        //, idx
        options.push({ label: row.VER_ID, value: row.VER_ID, data: row });
      });
    }
    if (!isEmptyArray(options)) {
      grid1.gridView.gridWrap.versionData = versionData;
      setVersionData(options);
    }
  };

  const loadItemGrade = async () => {
    const options = await loadOption(true, "SRV_GET_ITEM_GRADE", {}, "CD", "NM", false, true);
    if (!isEmptyArray(options)) {
      setItemGradeData(options);
    }
  };

  const loadItemCov = async () => {
    const options = await loadOption(true, "SRV_GET_ITEM_COV", {}, "CD", "NM", false, true);
    if (!isEmptyArray(options)) {
      setItemCovData(options);
    }
  };

  const loadBucket = async () => {
    let verInfo = findVersionData(getValues("VER_ID"));
    if (!verInfo) return;

    let mainBucketCd = verInfo.BUKT;
    let varBucketCd = verInfo.VAR_BUKT;
    let fromDate = verInfo.FROM_DATE;
    let toDate = verInfo.TO_DATE;

    const options = await loadOption(true, "SRV_GET_DP_BUKT", { MAIN_BUKT_CD: mainBucketCd, VAR_BUKT_CD: varBucketCd, FROM_DATE: fromDate, TO_DATE: toDate }, "SUB_CD", "SUB_NM", false, true);
    if (!isEmptyArray(options)) {
      setBucketData(options);
    }
  };

  const loadCurrency = async () => {
    const selVersion = getValues("VER_ID");
    if (!selVersion) return;

    const options = await loadOption(true, "SRV_GET_SP_UI_DP_CURRENCY_COMBO", { P_VER_ID: selVersion }, "ID", "CD_NM", false, true);
    if (!isEmptyArray(options)) {
      setCurrencyData(options);
    }
  };

  const loadAuthType = async () => {
    const selUserId = getValues("USER_ID");
    if (!selUserId) return;

    let resultData = await loadAuthTypeData(selUserId);

    let options = [];
    if (resultData) {
      resultData.map((row) => {
        options.push({ label: row.CD_NM, value: row.CD + row.EMP_ID, data: row });
      });
    }
    if (!isEmptyArray(options)) {
      setAuthTpData(options);
    }
  };

  const loadOperatorStatus = async () => {
    const selVersion = getValues("VER_ID");
    const selUserId = getValues("USER_ID");
    const selAuthTp = getAuthTpCD();

    if (!selAuthTp || !selUserId || !selVersion) return;

    const options = await loadOption(true, "GetOperatorStatus", { AUTH_TYPE: selAuthTp, OPERATOR_ID: selUserId, VER_CD: selVersion }, "STATUS", "STATUS", false, true);
    if (!isEmptyArray(options)) {
      // setValue("STATUS", options[0].value);
      setStatus(options[0].value);
    }
  };

  const loadDisaggRule = async () => {
    let authTp = getAuthTpCD();
    if (!authTp) return;

    const options = await loadOption(true, "SRV_GET_SP_UI_DP_AUTH_DIS_OPT_COMBO_Q1", { AUTH_TP_CD: authTp, VIEW_ID: vom.active, GRID_ID: "RST_CPT_01", INDEX: 0 }, "ID", "CD_NM", false, true);
    if (!isEmptyArray(options)) {
      setDistOptsData(options);
    }
  };

  const loadActiveUserTask = async () => {
    const selVersion = getValues("VER_ID");
    const selUserId = getValues("USER_ID");
    const selAuthTp = getAuthTpCD();

    if (!selAuthTp || !selUserId || !selVersion) return;

    let result = await loadActiveUserTaskData(selVersion, selUserId, selAuthTp);
    if (!isEmptyArray(result)) {
      setActiveTask(result);
    }
  };

  const loadDimension = async (viewCd, grpCd, username, grid) => {
    if (!viewCd || !grpCd || !username || !grid) return;
    grid.gridView.dimensionData = [];

    grid.gridView.dimensionData = await loadDimensionData(viewCd, grpCd, username, grid.gridView.orgId);
  };

  const loadMeasure = async (viewCd, grpCd, username, grid) => {
    if (!viewCd || !grpCd || !username || !grid) return;
    grid.gridView.measureData = [];

    let result = await loadMeasureData(viewCd, grpCd, username, grid.gridView.orgId);
    if (props.hasChart) {
      const msData = await loadMeasureData(viewCd, grpCd, username, "RST_CRT_01");
      setChartMeasures(msData);
      setChartData(setChartDataSet([], [], 0, msData));
    }
    grid.gridView.measureData = result;
  };

  const loadCrossTabInfo = async (viewCd, grpCd, username, grid) => {
    if (!viewCd || !grpCd || !username || !grid) return;

    let result = await loadCrossTabData(viewCd, grpCd, username, grid.gridView.orgId);
    setGridCrosstabInfo(grid.gridView, result);
    return result;
  };

  const loadPrefInfo = async (viewCd, grpCd, username, grid) => {
    if (!viewCd || !username || !grid) return;

    let result = await loadPreferenceData(viewCd, grpCd, username, grid.gridView.orgId);
    setGridPreferenceInfo(grid.gridView, result);
    return result;
  };

  const loadCrossTabInfoAndPrefInfo = async (viewCd, userName, grid) => {
    let grpCd = getUserGrpdCd(viewCd, userName, grid);

    //이넘은 grpCd에 대한 ID를 넘겨야 함.
    const prefInfo = await loadPrefInfo(viewCd, grpCd, userName, grid);
    //console.log("@@prefInfo==>", prefInfo)

    const crossTabInfo = await loadCrossTabInfo(viewCd, grpCd, userName, grid);
    //console.log("@@crossTabInfo==>", crossTabInfo)

    // setPrefInfoObj({ prefInfo: prefInfo, crossTabInfo: crossTabInfo });

    loadDimension(viewCd, grpCd, userName, grid);
    loadMeasure(viewCd, grpCd, userName, grid);
  };

  const refresh = () => {
    setValue("ITEM_CD", "");
    setValue("ITEM_NM", "");
    setValue("ACCOUNT_CD", "");
    setValue("ACCOUNT_NM", "");
    setValue("CURCY_CD", "0");
    setSelectedDistIndex(0);
    setValue("BUCKET", defaultBucketTp);
    grid1.dataProvider.clearRows();
  };
  //
  //==================================================================================================================================================================================================================

  //계획 타입 로드되면 첫번째 값 선택
  useEffect(() => {
    if (planTpOptions && planTpOptions.length > 0) {
      setValue("PLAN_TP", planTpOptions[0].value);
    }
  }, [planTpOptions]);

  //권한유형 들어오면 첫번째 값 선택
  useEffect(() => {
    if (authTpOptions && authTpOptions.length > 0) {
      setValue("AUTH_TP", authTpOptions[0].value);
    } else {
      setValue("AUTH_TP", "");
    }
  }, [authTpOptions]);

  useEffect(() => {
    if (distOptsOptions && distOptsOptions.length > 0) {
      // setValue("DIS_OPT", distOptsOptions[0].value);
      setSelectedDistIndex(0);
    }
  }, [distOptsOptions]);

  useEffect(() => {
    if (currencyOptions && currencyOptions.length > 0) setValue("CURCY_CD", currencyOptions[0].value);
    else setValue("CURCY_CD", "");
  }, [currencyOptions]);

  //버전을 가져오면 첫번째 값 설정
  useEffect(() => {
    if (versionOptions && versionOptions.length > 0) {
      setValue("VER_ID", versionOptions[0].value);
    } else setValue("VER_ID", "");
  }, [versionOptions]);

  //버킷 가져오면 첫번째 값 설정
  useEffect(() => {
    if (bucketOptions && bucketOptions.length > 0) {
      let verInfo = findVersionData(getValues("VER_ID"));
      if (verInfo) {
        let mainBuktcd = verInfo.BUKT;
        let varBuktcd = verInfo.VAR_BUKT;

        defaultBucketTp = mainBuktcd;

        if (mainBuktcd && varBuktcd) {
          if (mainBuktcd !== varBuktcd) defaultBucketTp = "PB";
          else defaultBucketTp = mainBuktcd;
        }
      } else defaultBucketTp = bucketOptions[0].value;
      setValue("BUCKET", defaultBucketTp);
    }
  }, [bucketOptions]);

  //계획 타입 선택되면 버전 가져옴.
  useEffect(() => {
    if (!isEmptyArray(selectedPlanTp)) {
      const plnData = findPlanTpData(getValues("PLAN_TP"));
      loadVersion(plnData.CD);
    }
  }, [selectedPlanTp]);

  //버전을 가져왔으면 버킷 가져옴
  useEffect(() => {
    if (selectedVersion && grid1) {
      loadBucket();
      loadCurrency();
    }
  }, [selectedVersion]);

  useEffect(() => {
    if (grid1) {
      currentVersion.current = getValues("VER_ID");
    }
  }, [selectedVersion]);

  useEffect(() => {
    if (grid1 && selectedUserId) {
      currentUserId.current = getValues("USER_ID");
      loadAuthType();
    }
  }, [selectedUserId]);

  useEffect(() => {
    if (grid1) {
      if (selectedAuthTp) {
        loadCrossTabInfoAndPrefInfo(vom.active, getValues("USER_ID"), grid1);
        loadActiveUserTask();
        loadDisaggRule();
      }
      currentAuthTp.current = getValues("AUTH_TP");
    }
  }, [selectedAuthTp]);

  useEffect(() => {
    if (grid1) {
      loadOperatorStatus();
      globalButtons = [
        {
          name: "search",
          action: () => {
            onSubmit();
          },
          visible: true,
          disable: false,
        },
        {
          name: "save",
          action: () => {
            saveData(grid1);
          },
          visible: false,
          disable: false,
        },
        {
          name: "refresh",
          action: () => {
            refresh();
          },
          visible: true,
          disable: false,
        },
        {
          name: "personalization",
          action: () => {
            setPersonalizeOpen(true);
          },
          visible: true,
          disable: false,
        },
      ];
      setViewInfo(vom.active, "globalButtons", globalButtons);
    }
  }, [selectedVersion, selectedUserId, selectedAuthTp]);

  /** 이벤트 핸들러 */

  //조회버튼 클릭 data는 form에 정의된 데이타.
  const onSubmit = () => {
    if (isEmptyArray(getValues("VER_ID"))) {
      showMessage(transLangKey("WARNING"), "version is not found", { close: false });
      return;
    }

    const dimensionData = grid1.gridView.dimensionData;
    const measureData = grid1.gridView.measureData;
    if (!dimensionData || dimensionData.length === 0) {
      showMessage(transLangKey("WARNING"), "Dimension info is not found", { close: false });
      return;
    }
    if (!measureData || measureData.length === 0) {
      showMessage(transLangKey("WARNING"), "Measure info is not found", { close: false });
      return;
    }

    if (!getValues("AUTH_TP")) {
      showMessage(transLangKey("WARNING"), "Auth Type is not found", { close: false });
      return;
    }

    if (!getValues("USER_ID")) {
      showMessage(transLangKey("WARNING"), "User is not found", { close: false });
      return;
    }

    loadData();
  };

  const onError = (errors) => {
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey("WARNING"), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  };

  const exportExcel = () => {
    grid1.exportExcel();
  };

  const setOptions = (targetGrid) => {
    targetGrid.gridView.setEditOptions({
      insertable: true,
      appendable: true,
    });

    //indicator, stateBar, checkBar
    setVisibleProps(targetGrid, true, true, false);

    targetGrid.gridView.displayOptions.fitStyle = "even";
  };

  const cancelApproval = () => {
    let param = new URLSearchParams();

    const selVersion = getValues("VER_ID");
    const selUserId = getValues("USER_ID");
    const selAuthTp = getAuthTpCD();

    param.append("OPERATOR_ID", selUserId);
    param.append("AUTH_TYPE", selAuthTp);
    param.append("VER_CD", selVersion);
    param.append("STATUS", "CANCEL");

    zAxios({
      method: "post",
      header: { "content-type": "application/json" },
      url: "engine/dp/CancelApproval",
      data: param,
    })
      .then(() => {
        loadActiveUserTask();
        loadOperatorStatus();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const approve = () => {
    let param = new URLSearchParams();

    const selVersion = getValues("VER_ID");
    const selUserId = getValues("USER_ID");
    const selAuthTpCd = getAuthTpCD();

    let versionData = findVersionData(selVersion);
    const authTpData = findAuthTpData(selAuthTpCd);

    param.append("OPERATOR_ID", selUserId);
    param.append("LOGIN_USER", username);
    param.append("AUTH_TYPE", selAuthTpCd);
    param.append("AUTH_TYPE_ID", authTpData ? authTpData.ID : "");
    param.append("VER_CD", selVersion);
    param.append("VER_ID", versionData ? versionData.ID : "");
    param.append("STATUS", "APPROVAL");

    zAxios({
      method: "post",
      header: { "content-type": "application/json" },
      url: "engine/dp/Approve",
      data: param,
    })
      .then(() => {
        loadActiveUserTask();
        loadOperatorStatus();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const findVersionData = (verCd) => {
    let findOption = versionOptions.find((item) => item.value === verCd);
    if (findOption) {
      return findOption.data;
    }
    return null;
  };

  const findAuthTpData = (authTp) => {
    let findOption = authTpOptions.find((item) => item.value === authTp);
    if (findOption) {
      return findOption.data;
    }
    return null;
  };

  const findPlanTpData = (planTp) => {
    let findOption = planTpOptions.find((item) => item.value === planTp);
    if (findOption) {
      return findOption.data;
    }
    return null;
  };

  const findDisAggRuleData = (rule) => {
    let findOption = distOptsOptions.find((item) => item.value === rule);
    if (findOption) {
      return findOption.data;
    }
    return null;
  };

  const getUserGrpdCd = (viewCd, userName, grid) => {
    if (!viewCd || !userName || !grid) return "";

    let psnl = localStorage.getItem("preference-group");
    let selectGrpCd = "";

    //console.log("@@@@@@@@ getUserGrpdCd:", viewCd, "userName:", userName);
    if (psnl && psnl !== "" && psnl !== undefined && psnl.length > 0) {
      selectGrpCd = JSON.parse(psnl).filter(function (row) {
        return row.viewId === viewCd && row.username === userName;
      })[0];
    }

    //console.log("selectGrpCd:", selectGrpCd, " psnl:", psnl);
    let grpCd;
    if (selectGrpCd !== undefined && selectGrpCd.grpCd !== undefined) {
      grpCd = selectGrpCd.grpCd;
    } else {
      // local storage에  저장된 사용자 그룹이 없다면 auth type 과 동일한 코드의 group
      //console.log("selectedAuthTp", selectedAuthTp);
      const authTpData = findAuthTpData(getValues("AUTH_TP"));
      grpCd = authTpData.CD;
    }
    return grpCd;
  };

  const getLoadParams = (isChart, chartItem, chartAccount) => {
    const verData = findVersionData(getValues("VER_ID"));
    const planTpData = findPlanTpData(getValues("PLAN_TP"));
    const authTpData = findAuthTpData(getValues("AUTH_TP"));
    let currencyId = getValues("CURCY_CD");
    let param = new URLSearchParams({
      PLAN_TP_ID: planTpData.ID,
      LEAF_BUKT_YN: planTpData.LEAF_BUKT_YN,
      VERSION_ID: verData.ID,
      PREV_VERSION_ID: verData.CLOSE_VER_ID,
      BUKT: verData.BUKT,
      FROM_DATE: verData.FROM_DATE,
      TO_DATE: verData.TO_DATE,
      VARIABLE_DATE: verData.VAR_DATE,
      VARIABLE_BUKT: verData.VAR_BUKT,
      CL_AUTH_TYPE: verData.CL_AUTH_TYPE,
      PRICE_TP_ID: verData.PRICE_TP_ID,
      CURCY_TP_ID: verData.CURCY_TP_ID,
      BUCKET_TP: isChart && getValues("BUCKET") === "PB" ? verData.BUKT : getValues("BUCKET"),
      USER_ID: getValues("USER_ID"),
      AUTH_TP_ID: authTpData.ID,
      AUTH_TYPE: authTpData.CD,
      USER_MAP_TYPE: authTpData.MAP_TP,
      MATCH_OPTION: "WHOLE-WORD",
      GRID_ID: isChart ? "RST_CRT_01" : "RST_CPT_01",
      CURCY_ID: currencyId ? currencyId : "",
      ITEM_FILTER: nvl(getValues("ITEM_CD"), ""),
      ACCOUNT_FILTER: nvl(getValues("ACCOUNT_CD"), ""),
    });

    if (verData.VAR_DATE2) param.append("VARIABLE_DATE2", verData.VAR_DATE2);
    if (verData.VAR_BUKT2) param.append("VARIABLE_BUKT2", verData.VAR_BUKT2);
    if (grid1.gridView.dimensionData) param.append("DIM_INFO", JSON.stringify(grid1.gridView.dimensionData));
    param.append("MES_INFO", JSON.stringify(isChart ? chartMeasures : getMeasureInfo()));
    // if (grid1.gridView.measureData) param.append("MES_INFO", JSON.stringify(grid1.gridView.measureData));

    if (extraParamData["ITEM_ATTR_01"]) param.append("ITEM_ATTR_01", extraParamData["ITEM_ATTR_01"]);
    if (extraParamData["ITEM_ATTR_02"]) param.append("ITEM_ATTR_02", extraParamData["ITEM_ATTR_02"]);
    if (extraParamData["ITEM_ATTR_03"]) param.append("ITEM_ATTR_03", extraParamData["ITEM_ATTR_03"]);

    if (extraParamData["ACCT_ATTR_01"]) param.append("ACCT_ATTR_01", extraParamData["ACCT_ATTR_01"]);
    if (extraParamData["ACCT_ATTR_02"]) param.append("ACCT_ATTR_02", extraParamData["ACCT_ATTR_02"]);
    if (extraParamData["ACCT_ATTR_03"]) param.append("ACCT_ATTR_03", extraParamData["ACCT_ATTR_03"]);
    if (extraParamData["GRADE"]) param.append("ITEM_GRADE", extraParamData["GRADE"]);
    if (extraParamData["COV"]) param.append("ITEM_COV", extraParamData["COV"]);

    if (chartItem) param.append("ITEM_CHART_FILTER", chartItem);
    if (chartAccount) param.append("ACCOUNT_CHART_FILTER", chartAccount);

    const ctabInfo = grid1.gridView.crossTabInfo;
    if (ctabInfo && !isChart) param.append("CROSSTAB", JSON.stringify(ctabInfo));

    return param;
  };
  const loadData = () => {
    grid1.dataProvider.clearRows();

    zAxios({
      method: "post",
      url: "engine/dp/GetDemand",
      data: getLoadParams(false, null, null),
    })
      .then((res) => {
        if (res.data) {
          grid1.gridView.gridWrap.BUCKET = getValues("BUCKET");
          grid1.gridView.gridWrap.AUTH_TP = getAuthTpCD();
          grid1.gridView.gridWrap.PLAN_TP = getValues("PLAN_TP");
          grid1.gridView.gridWrap.MES_INFO = grid1.gridView.measureData;

          grid1.setData(res.data.RESULT_DATA);
          excelUpload.current = false;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getAuthTpID = () => {
    if (getValues("AUTH_TP")) {
      const authTpData = findAuthTpData(getValues("AUTH_TP"));
      if (authTpData) return authTpData.ID;
    }
  };
  const getAuthTpCD = () => {
    if (getValues("AUTH_TP")) {
      const authTpData = findAuthTpData(getValues("AUTH_TP"));
      if (authTpData) return authTpData.CD;
    }
  };

  const changeByBucketType = (verData) => {
    if (getValues("BUCKET") !== "PB" && getValues("BUCKET") !== verData.BUKT) {
      return verData.DTF_DATE;
    }
    return verData.VAR_DATE;
  };
  const setDemand = async (targetGrid, changeRowData) => {
    targetGrid.gridView.showToast(progressSpinner + "Saving data...", true);

    let param = new URLSearchParams();

    const distOpt = findDisAggRuleData(distOptsOptions[selectedDistIndex].value); //getValues("DIS_OPT")
    //console.log("distOpt===>",distOpt)
    const verData = findVersionData(getValues("VER_ID"));
    const plnTpData = findPlanTpData(getValues("PLAN_TP"));
    const authTpData = findAuthTpData(getValues("AUTH_TP"));

    param.append("changes", JSON.stringify(changeRowData));
    param.append("REVERSE_TARGET", "changes");
    param.append("DISAGGREGATE_RULE_ID", distOpt ? distOpt.ID : "");
    param.append("BUKT", verData.BUKT);
    param.append("STD_WEEK", verData.STD_WEEK);
    if (authTpData) param.append("AUTH_TP_ID", authTpData.ID);

    param.append("USER_MAP_TYPE", authTpData.MAP_TP);
    param.append("VERSION_ID", verData.ID);
    param.append("USERNAME", getValues("USER_ID"));
    //param.append("USERID",selectedUser.id)

    param.append("LOGIN_USERNAME", username);
    if (grid1.gridView.dimensionData) param.append("DIM_INFO", JSON.stringify(grid1.gridView.dimensionData));
    if (grid1.gridView.measureData) param.append("MES_INFO", JSON.stringify(grid1.gridView.measureData));
    param.append("PLAN_TYPE_KEY", plnTpData.ID);
    param.append("FROM_DATE", verData.FROM_DATE);
    param.append("TO_DATE", verData.TO_DATE);
    param.append("VAR_DATE", changeByBucketType(verData));
    param.append("VAR_BUKT", verData.VAR_BUKT);
    if (verData.VAR_DATE2) param.append("VAR_DATE2", verData.VAR_DATE2);
    if (verData.VAR_BUKT2) param.append("VAR_BUKT2", verData.VAR_BUKT2);
    param.append("DTF_DATE", verData.DTF_DATE);
    param.append("CURCY_CD_ID", getValues("CURCY_CD"));
    param.append("CUSTOM_CALL", "false");
    param.append("PRICE_TP_ID", verData.PRICE_TP_ID);
    param.append("CURCY_TP_ID", verData.CURCY_TP_ID);
    param.append("MS_COL", distOpt ? distOpt.CD : "");
    if (distOpt && distOpt.MS_KEY) param.append("MS_KEY", distOpt.MS_KEY);

    if (distOpt && distOpt.VAL_TP) param.append("VAL_TP", distOpt.VAL_TP);

    if (distOpt && distOpt.R_TYPE) param.append("MS_TP", distOpt.R_TYPE);
    param.append("ITEM_FILTER", nvl(getValues("ITEM_CD"), ""));
    param.append("ACCOUNT_FILTER", nvl(getValues("ACCOUNT_CD"), ""));

    if (grid1.gridView.crossTabInfo) param.append("CROSSTAB", JSON.stringify(grid1.gridView.crossTabInfo));
    if (extraParamData["ITEM_ATTR_01"]) param.append("ITEM_ATTR_01", nvl(extraParamData["ITEM_ATTR_01"], ""));
    if (extraParamData["ITEM_ATTR_02"]) param.append("ITEM_ATTR_02", nvl(extraParamData["ITEM_ATTR_02"], ""));
    if (extraParamData["ITEM_ATTR_03"]) param.append("ITEM_ATTR_03", nvl(extraParamData["ITEM_ATTR_03"], ""));
    if (extraParamData["ACCOUNT_ATTR_01"]) param.append("ACCT_ATTR_01", nvl(extraParamData["ACCOUNT_ATTR_01"], ""));
    if (extraParamData["ACCOUNT_ATTR_02"]) param.append("ACCT_ATTR_02", nvl(extraParamData["ACCOUNT_ATTR_02"], ""));
    if (extraParamData["ACCOUNT_ATTR_03"]) param.append("ACCT_ATTR_03", nvl(extraParamData["ACCOUNT_ATTR_03"], ""));
    if (extraParamData["GRADE"]) param.append("ITEM_GRADE", nvl(extraParamData["GRADE"], ""));
    if (extraParamData["COV"]) param.append("ITEM_COV", nvl(extraParamData["COV"], ""));

    zAxios({
      method: "post",
      url: "engine/dp/SetDemand",
      data: param,
    })
      .then(function (res) {
        if (res.data && res.data.RESULT_SUCCESS) loadData();
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
        targetGrid.gridView.hideToast();
      });
  };

  const saveData = (targetGrid) => {
    targetGrid.gridView.commit(true);
    //일괄 유효성 확인
    let log = targetGrid.gridView.validateCells();
    if (log !== null && log.length > 0) {
      showMessage(transLangKey("WARNING"), log[0].message);
    }

    let changeRowData = getOnlyUpdatedRows(targetGrid.gridView, excelUpload.current);

    if (changeRowData.length === 0) {
      //저장 할 내용이 없습니다.
      showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"), { close: false });
    } else {
      showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), function (answer) {
        if (answer) {
          setDemand(targetGrid, changeRowData);
        }
      });
    }
  };

  /** 이벤트 핸들러 끝 */
  const setUserCd = (items) => {
    setValue("USER_ID", items[0].USER_ID);
    setValue("EMP_NM", items[0].EMP_NM);
  };

  const setAccountCd = (items) => {
    setValue("ACCOUNT_CD", items.ACCOUNT_CD ? items.ACCOUNT_CD : items.SALES_LV_CD);
    setValue("ACCOUNT_NM", items.ACCOUNT_NM) ? items.ACCOUNT_NM : items.SALES_LV_NM;
  };

  function onSetItemCd(items) {
    setValue("ITEM_CD", items.ITEM_CD ? items.ITEM_CD : items.ITEM_LV_CD);
    setValue("ITEM_NM", items.ITEM_NM ? items.ITEM_NM : items.ITEM_LV_NM);
  }
  function onExtraPopupSubmit(data) {
    setExtraParamData(data);
  }

  function showPopComment(data) {
    setCommentData(data);
    setCommentOpen(true);
  }

  function onCommentEdited(data) {
    //data = {ROW_IDX : dataRow, COL_IDX:dataProvider.getFieldIndex(colName), CM_COL_NAME:comCol, DATE_STR: dateStr, CMT: cmt}
    const gridView = grid1.gridView;
    const dataProvider = grid1.dataProvider;

    gridView.beginUpdate();
    gridView.setCellStyle(gridView, data.ROW_IDX, data.VAL_COL_NAME, "cmtEDITStyle");
    dataProvider.setValue(data.ROW_IDX, data.CM_COL_NAME, data.CMT);
    gridView.endUpdate();
  }

  function isTargetField(fromDate, toDate, fieldDate) {
    let result = true;

    // bucket date : 00:00 ==> component date : time 09:00
    if ((fromDate && getYYYYMMDD(fieldDate) < getYYYYMMDD(fromDate)) || (toDate && getYYYYMMDD(fieldDate) > getYYYYMMDD(toDate))) {
      result = false;
    }

    return result;
  }

  function copyMeasure(data) {
    const gridView = grid1.gridView;
    const dataProvider = grid1.dataProvider;

    let dataColumns = gridView.dataColumns;
    let rowCount = dataProvider.getRowCount();

    if (rowCount <= 0) {
      showMessage(transLangKey("WARNING"), transLangKey("복사할 대상이 없습니다"));
      return;
    }

    let targetValueFieldOrigin = "DATE";
    let fromDate = data.fromDate;
    let toMeasure = data.toDate;
    let toDate = data.toDate;
    if (toMeasure && toMeasure.dateType === "month") {
      toDate = new Date(toDate.getFullYear(), toDate.getMonth() + 1, 0);
    }
    let operand = Number(data.spinValue);
    let operator = data.operator;
    let sourceMeasure = data.sourceMeasure;
    let targetMeasure = data.targetMeasure;
    //    	console.log("popupValue [fromDate, toDate, operand, operator, sourceMeasure, targetMeasure]", fromDate, toDate, operand, operator, sourceMeasure, targetMeasure);
    // get DTF
    let dateFence = getDTFdateFormat(gridView);
    if (!fromDate || (fromDate && fromDate.getTime() < dateFence.getTime())) {
      fromDate = dateFence;
    }

    let candidateFields = [];

    for (let i = 0, len = dataColumns.length; i < len; i++) {
      let dataColumn = dataColumns[i];
      if (dataColumn.columnIdOrg === targetValueFieldOrigin) {
        candidateFields.push(dataColumn.fieldName);
      }
    }
    //		console.log("candidateFields : ", candidateFields);
    let targetFields = [];

    for (let i = 0, len = candidateFields.length; i < len; i++) {
      let candidateField = candidateFields[i];
      let fieldDate = getDateFromString(candidateField);

      if (isTargetField(fromDate, toDate, fieldDate)) {
        targetFields.push(candidateField);
      }
    }

    let rowSearchOptions = { fields: ["CATEGORY"] };
    let sourceMeasureIndex, targetMeasureIndex;
    let measureCount = dataProvider.getDistinctValues("CATEGORY", rowCount).length;

    let dimension = gridView.dimensionData
      .filter(function (row) {
        return row.fldCd && row.fldCd.includes("DIMENSION") && gridView.isFiltered(row.fldCd);
      })
      .map(function (row) {
        return row.fldCd;
      });

    dataProvider.beginUpdate();
    try {
      for (let i = 0; i < rowCount; i = i + measureCount) {
        //**(2) search data of actived dimension level
        let filterableResult = true;
        for (let k = 0; k < dimension.length; k++) {
          let filteredValues = gridView.getActiveColumnFilters(dimension[k], true).map(function (row) {
            return row.name;
          });
          filterableResult =
            filterableResult *
            filteredValues.some(function (val) {
              return dataProvider.getJsonRow(i)[dimension[k]] === val;
            });
        }

        if (filterableResult) {
          rowSearchOptions.startIndex = i;
          let sourceMeasureArray = sourceMeasure.includes("+") ? sourceMeasure.split("+") : [sourceMeasure];

          let newData = {};

          for (let j = 0, len = targetFields.length; j < len; j++) {
            let targetField = targetFields[j];

            let sourceValue = 0;
            for (let k = 0; k < sourceMeasureArray.length; k++) {
              rowSearchOptions.values = [sourceMeasureArray[k]];

              sourceMeasureIndex = dataProvider.searchDataRow(rowSearchOptions);

              let sourceMeasureData = dataProvider.getJsonRow(sourceMeasureIndex);

              sourceValue = sourceValue + Number(sourceMeasureData[targetField]);
            }

            switch (operator) {
              case "multiple":
                newData[targetField] = sourceValue * operand;
                break;
              case "divide":
                newData[targetField] = sourceValue / operand;
                break;
              case "add":
                newData[targetField] = sourceValue + operand;
                break;
              case "minus":
                newData[targetField] = sourceValue - operand;
                break;
              default:
                newData[targetField] = sourceValue;
                break;
            }
          }
          newData["CATEGORY"] = targetMeasure;
          rowSearchOptions.values = [targetMeasure];
          targetMeasureIndex = dataProvider.searchDataRow(rowSearchOptions);
          dataProvider.updateRow(targetMeasureIndex, newData);
        } //if(filterableCount==0 || dimension.length == 0) end
      }
    } finally {
      dataProvider.endUpdate();
    }
  }

  const onExcelImportSuccess = (grid, data) => {
    grid.dataProvider.clearRows();
    grid.gridView.gridWrap.BUCKET = getValues("BUCKET");
    grid.gridView.gridWrap.AUTH_TP = getAuthTpCD();
    grid.gridView.gridWrap.PLAN_TP = getValues("PLAN_TP");
    grid.gridView.gridWrap.MES_INFO = grid.gridView.measureData;

    grid1.setData(data.RESULT_DATA);
  };

  const onExcelImportComplete = (grid) => {
    excelUpload.current = true;
    let gridPrefInfoDB = TAFFY(grid.gridView.prefInfo);

    let editMeasuresDB = TAFFY(gridPrefInfoDB().filter({ gridCd: grid.gridView.gridCd, editMeasureYn: true }).get());
    let editTargetsDB = TAFFY(gridPrefInfoDB().filter({ gridCd: grid.gridView.gridCd, editTargetYn: true }).get());

    let editMeasures = editMeasuresDB().select("fldApplyCd");
    let editTargets = editTargetsDB().select("fldCd");
    let targetRowIndexes = [];

    if (editMeasures !== undefined && editMeasures.length > 0 && editTargets !== undefined && editTargets.length > 0) {
      let conditionColumn = "CATEGORY";
      let conditionOperator = "equal";
      let conditionValues = editMeasures;

      let dataRowCount = grid.dataProvider.getRowCount();
      for (let i = 0; i < dataRowCount; i++) {
        let conditionCellValue = grid.dataProvider.getFieldValues(conditionColumn, i, i)[0];
        //todo: remove isSatisfieldValue
        let isTarget = isSatisfiedValue(conditionOperator, conditionCellValue, conditionValues);

        if (isTarget) {
          targetRowIndexes.push(i);
        }
      }
      //  TODO 요시점에서 value가 null이면 0으로 set 처리 필요
      //setNullValueToZero(grid.gridView, resultData, editMeasures);
    }

    //그리드의 상태를 변경한다.
    grid.dataProvider.setRowStates(targetRowIndexes, "updated", true, false);
  };

  const onKeyDown = async (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      setValue("ITEM_NM", await getCodeName("item", getValues("ITEM_CD")));
    }
  };

  const onClear = () => {
    setValue("ITEM_NM", "");
    setValue("ITEM_CD", "");
  };

  const preProcessExcelImportData = (grid, data) => {
    let categoryLang = {};
    let categoryValues = grid.dataProvider.getFieldValues("CATEGORY", 0, -1)?.unique();
    if (categoryValues) {
      for (let i = 0, categoryValuesLen = categoryValues.length; i < categoryValuesLen; i++) {
        categoryLang[transLangKey(categoryValues[i])] = categoryValues[i];
      }

      if (data && data.length > 0) {
        for (let i = 0; i < data.length; i++) {
          // let row = data[i];
          if (data.CATEGORY) {
            data.CATEGORY = categoryLang[data.CATEGORY];
          }
        }
      }
    }
    return data;
  };

  const getMeasureInfo = () => {
    if (grid1) {
      return grid1.gridView.measureData;
    }
    return [];
  };

  const afterGridCreate = (grid1, gridView) => {
    //, dataProvider
    refGrid1.current = grid1;
    setOptions(grid1);
    grid1.gridView.uniqueId = "test";
    grid1.gridView.gridDataFit = false;
    grid1.gridView.dataOutputOptions = {
      datetimeCallback: function (index, field, value) {
        if (value && value instanceof Date) {
          return value.format("yyyy-MM-ddTHH:mm:ss");
        } else {
          return null;
        }
      },
      numberCallback: function (index, field, value) {
        if (value !== undefined && !isNaN(value) && typeof value === "number") {
          return value;
        } else {
          return null;
        }
      },
      booleanCallback: function (index, field, value) {
        if (!value) {
          return false;
        } else {
          return value;
        }
      },
      nullText: null,
    };

    grid1.gridView.addCellStyle(grid1.gridView, STYLE_ID_EDIT_MEASURE, STYLE_EDIT_MEASURE, true);
    grid1.gridView.addCellStyle(grid1.gridView, STYLE_ID_ROW_INSERTING, STYLE_ROW_INSERTING, true);

    grid1.gridView.addCellStyle(grid1.gridView, STYLE_ID_EDITABLE, STYLE_EDITABLE, true);
    grid1.gridView.addCellStyle(grid1.gridView, STYLE_ID_UNEDITABLE, STYLE_UNEDITABLE, true);
    grid1.gridView.addCellStyle(gridView, "validationStyle", { background: "#ffFFC7CE", foreground: "#ff9C0006" });

    grid1.gridView.gridWrap.showPopComment = showPopComment;
    grid1.gridView.gridWrap.setPasteOptions({ checkReadOnly: true, noDataEvent: true, noEditEvent: true, startEdit: true });
    //grid1.gridView.setEditOptions({ commitByCell: false });
    //grid1.gridView.setCopyOptions({ singleMode: true });
    //grid1.gridView.pasteOptions.numberChars = [","];

    //  grid 생성 시점으로
    grid1.gridView.onCellEdited = function (grid, itemIndex, dataRow, field) {
      console.log("onCellEdited");
      grid.commit();

      let dataProvider = grid.getDataSource();
      let val = dataProvider.getValue(dataRow, field);
      if (val === null || val === undefined) {
        dataProvider.setValue(dataRow, field, 0);
      }
    };

    grid1.gridView.onEditRowPasted = function (grid, itemIndex, dataRow, fields) {
      console.log("onEditRowPasted");
      //, oldValues, newValues
      for (let i = 0, n = fields.length; i < n; i++) {
        grid.gridWrap.setChangedValue(itemIndex, fields[i]);
      }
    };

    grid1.gridView.onRowsPasted = function (grid, items) {
      console.log("onRowsPasted");
      let dataProvider = grid.getDataSource();
      let dateFieldIndexes = grid.dataColumns
        .filter(function (dataColumn) {
          return dataColumn.columnIdOrg === "DATE" && dataColumn.visible === true;
        })
        .map(function (dataColumn) {
          return dataProvider.getFieldIndex(dataColumn.name);
        });
      for (let i = 0, n = items.length; i < n; i++) {
        for (let j = 0, m = dateFieldIndexes.length; j < m; j++) {
          grid.gridWrap.setChangedValue(items[i], dateFieldIndexes[j]);
        }
      }
    };
    //setGrid1(grid1)
  };

  const hasDelegation = () => {
    return systemAdmin || delegationCnt.current > 0;
  };

  const getUserIdInputField = () => {
    if (hasDelegation()) {
      return (
        <InputField
          name="USER_ID"
          label={transLangKey("USER_ID")}
          type="action"
          tooltip={transLangKey("USER_ID")}
          onClick={() => {
            setUserPopupOpen(true);
          }}
          control={control}
          readonly={true}>
          <Icon.Search />
        </InputField>
      );
    } else {
      return <InputField name="USER_ID" label={transLangKey("USER_ID")} type="text" tooltip={transLangKey("USER_ID")} control={control} readonly={true} />;
    }
  };

  const SaveOptionButton = (distOptsOptions) => {
    return (
      <>
        <ButtonGroup ref={anchorRef} disabled={activeTask && !activeTask.INPUT} style={{ marginRight: "5px" }}>
          <Button onClick={handleToggle} endIcon={<ArrowDropDown />}>
            {distOptsOptions[selectedDistIndex].label}
          </Button>
          <Button
            onClick={() => {
              saveData(grid1);
            }}>
            <Save fontSize={"small"} />
          </Button>
        </ButtonGroup>
        <Popper sx={{ zIndex: 999999 }} open={distOptOpen} anchorEl={anchorRef.current} role={undefined} transition>
          {({ TransitionProps, placement }) => (
            <Grow {...TransitionProps} style={{ transformOrigin: placement === "bottom" ? "center top" : "center bottom" }}>
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList id="split-button-menu" autoFocusItem>
                    {distOptsOptions.map((option, index) => (
                      <MenuItem key={option.value} selected={index === selectedDistIndex} onClick={(event) => handleMenuItemClick(event, index)}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </>
    );
  };
  const setChartDataSet = (data, chartArr, idx, chartMeasures) => {
    if (idx < chartMeasures.length) {
      let measure = chartMeasures[idx];
      let measureCode = measure.MEASURE_CD;
      let valueType = measure.VAL_TYPE;
      chartArr.push({
        label: transLangKey(measureCode),
        type: measureCode.includes("RATE") ? "line" : "bar",
        data: data.map((row) => row[measure.DISPLAY]),
        yAxisID: measureCode.includes("RATE") ? "rate" : "val",
        backgroundColor: labelColors[idx],
        borderColor: labelColors[idx],
        isQty: valueType.includes("QTY"),
        isAccumul: measureCode.includes("YTD_") || valueType === "QTY_A",
      });
      return setChartDataSet(data, chartArr, ++idx, chartMeasures);
    } else {
      return chartArr;
    }
  };

  const makeChart = () => {
    //hasChart
    if (grid1 && chartMeasures) {
      grid1.gridView.onCellClicked = function (grid, clickData) {
        if (clickData.cellType === "data" && !clickData.column.includes("DATE_")) {
          const clickRow = grid1.dataProvider.getJsonRow(clickData.dataRow);
          zAxios({
            method: "post",
            url: "engine/dp/GetDemand",
            data: getLoadParams(true, clickRow["ITEM"], clickRow["ACCOUNT"]),
          })
            .then((res) => {
              let data = res.data.RESULT_DATA.sort((a, b) => {
                if (a.DATE < b.DATE) {
                  return -1;
                } else if (a.DATE > b.DATE) {
                  return 1;
                }
                return 0;
              });
              setChartLabels(data.map((rw) => new Date(rw.DATE).format("yyyy-MM-dd")));
              setChartData(setChartDataSet(data, [], 0, chartMeasures));
            })
            .catch((err) => {
              console.log(err);
            });
        }
      };
    }

    return (
      <Grid container>
        <Grid item xs={1}>
          <Tabs
            value={tabValue}
            onChange={(e, newVal) => setTabValue(newVal)}
            indicatorColor="primary"
            orientation={"vertical"}
            // variant={"fullWidth"}
            style={{ minHeight: "161px" }}>
            <Tab label={transLangKey("QTY")} value="QTY" />
            <Tab label={transLangKey("AMT")} value="AMT" />
            <Tab label={transLangKey("QTY_A")} value="ACCUMUL_QTY" />
            <Tab label={transLangKey("AMT_A")} value="ACCUMUL_AMT" />
          </Tabs>
        </Grid>
        <Grid item xs={11}>
          <Chart
            type="bar"
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                  position: "right",
                },
              },
              /*          scales: {
                          val: {
                            type: "linear",
                            display: true,
                            position: "right",
                            grid: {
                              drawOnChartArea: false,
                            },
                          },
                        },*/
            }}
            data={{
              labels: chartLabels,
              datasets: chartData.filter((row) => {
                let isQty = row.isQty;
                let isAccumul = row.isAccumul;
                switch (tabValue) {
                  case "QTY":
                    return isQty && !isAccumul;
                  case "AMT":
                    return !isQty && !isAccumul;
                  case "ACCUMUL_QTY":
                    return isQty && isAccumul;
                  case "ACCUMUL_AMT":
                    return !isQty && isAccumul;
                }
              }),
            }}
            style={{ paddingLeft: "5px" }}
          />
        </Grid>
      </Grid>
    );
  };
  return (
    // <React.Fragment>
    <ContentInner>
      <SearchArea submit={handleSubmit(onSubmit, onError)}>
        <InputField name="PLAN_TP" label={transLangKey("PLAN_TP")} type="select" control={control} options={planTpOptions} readonly={true} style={{ display: "none" }} />
        <InputField name="VER_ID" label={transLangKey("VERSION_ID")} control={control} type="select" options={versionOptions} />
        {getUserIdInputField()}
        <InputField name="EMP_NM" label={transLangKey("EMP_NM")} control={control} readonly={true} />
        <InputField name="AUTH_TP" label={transLangKey("AUTH_TP_ID")} type="select" control={control} options={authTpOptions} wrapStyle={{ display: "none" }} />
        <InputField
          name="ITEM_CD"
          label={transLangKey("ITEM_CD")}
          type="action"
          tooltip={transLangKey("ITEM_CD")}
          onClick={() => {
            setPopItemTreeOpen(true);
          }}
          control={control}
          onKeyDown={onKeyDown}
          onClear={onClear}>
          <Icon.Search />
        </InputField>
        <InputField
          name="ITEM_NM"
          label={transLangKey("ITEM_NM")}
          control={control}
          readonly={true}
          onClear={onClear}
          onFocus={() => {
            setValue("itemCd", "");
          }}
        />
        <InputField
          name="ACCOUNT_CD"
          label={transLangKey("ACCOUNT_CD")}
          type="action"
          tooltip={transLangKey("ACCOUNT_CD")}
          onClick={() => {
            setPopAccountOpen(true);
          }}
          control={control}
          onKeyDown={onKeyDown}
          onClear={onClear}>
          <Icon.Search />
        </InputField>
        <InputField name="ACCOUNT_NM" label={transLangKey("ACCOUNT_NM")} control={control} readonly={true} />
        <InputField name="CURCY_CD" label={transLangKey("CURCY_CD")} type="select" control={control} options={currencyOptions} wrapStyle={{ display: "none" }} />
        <InputField name="BUCKET" label={transLangKey("BUCKET")} type="select" control={control} options={bucketOptions} wrapStyle={{ display: "none" }} />
        {/**
         <GroupBox label="Item Attribute">
         <InputField displaySize="small" type="select" name="GRADE" label={"GRADE"} control={control} options={itemGradeOptions} />
         <InputField displaySize="small" type="select" name="COV" label={"COV"} control={control} options={itemCovOptions} />

         <InputField displaySize="small" name="ITEM_ATTR_01" label={transLangKey("ITEM_ATTR_01")} control={control} />
         <InputField displaySize="small" name="ITEM_ATTR_02" label={transLangKey("ITEM_ATTR_02")} control={control} />
         <InputField displaySize="small" name="ITEM_ATTR_03" label={transLangKey("ITEM_ATTR_03")} control={control} />
         </GroupBox>
         <GroupBox label="Account Attribute">
         <InputField displaySize="small" name="ACCT_ATTR_01" label={transLangKey("ACCOUNT_ATTR_01")} control={control} />
         <InputField displaySize="small" name="ACCT_ATTR_02" label={transLangKey("ACCOUNT_ATTR_02")} control={control} />
         <InputField displaySize="small" name="ACCT_ATTR_03" label={transLangKey("ACCOUNT_ATTR_03")} control={control} />
         </GroupBox>
         **/}
      </SearchArea>
      <ResultArea sizes={props.hasChart ? [30, 70] : [100]} direction={"vertical"}>
        {props.hasChart ? makeChart() : null}
        <Box>
          <ButtonArea title={transLangKey(vom.active)} grid={"grid1"} format={"{0} 건"}>
            <LeftButtonArea>
              <CommonButton type="icon" onClick={() => setMeasureCopyOpen(true)} title={transLangKey("Copy")} className={iconClasses.gridIconButton}>
                <Icon.Copy />
              </CommonButton>
              <GridExcelExportButton type="icon" grid="grid1" options={{ footer: "hidden", ApplyI18n: ["CATEGORY"] }} />
              <GridExcelImportButton type="icon" grid="grid1" preProcessData={preProcessExcelImportData} onExcelImportSuccess={onExcelImportSuccess} onExcelImportComplete={onExcelImportComplete} />
            </LeftButtonArea>
            <RightButtonArea>
              {distOptsOptions.length > 0 && SaveOptionButton(distOptsOptions)}
              {/*              <InputField name="DIS_OPT" label={transLangKey("DIS_OPT")}
                          type="select" control={control} options={distOptsOptions}
                          style={{ border: "none" }}
              />
              <GridSaveButton
                grid="grid1"
                type="icon"
                onClick={() => { saveData(grid1); }}
                disabled={activeTask && activeTask.INPUT == true ? false : true}/>*/}
              <Chip name="STATUS" label={status} control={control} style={!status ? { display: "none" } : {}} />
              {/*<InputField name="STATUS" label={transLangKey("STATUS")} control={control} readonly={true} style={{ border: 0, textAlign: "right" }} />*/}
              <CommonButton type="icon" title={transLangKey("APPROVE")} onClick={() => approve()} className={iconClasses.gridIconButton} disabled={activeTask && !activeTask.APPROVAL}>
                <Icon.UserCheck />
              </CommonButton>
              <CommonButton type="icon" title={transLangKey("CANCELAPPROVE")} onClick={() => cancelApproval()} className={iconClasses.gridIconButton} disabled={activeTask && !activeTask.CANCEL}>
                <Icon.UserMinus />
              </CommonButton>
            </RightButtonArea>
          </ButtonArea>
          <Box style={{ height: "calc(100% - 53px)" }}>
            <BaseGrid id="grid1" items={grid1Items} gridCd={vom.active + "-RST_CPT_01"} afterGridCreate={afterGridCreate} onReadyDataFill={gridDataFillReady} onAfterDataSet={gridAfterSetData} />
          </Box>
        </Box>
      </ResultArea>
      <StatusArea show={false} message={message}>
        <GridCnt grid="grid1" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")} />
      </StatusArea>

      <PopPersonalize open={personalizeOpen} onClose={() => setPersonalizeOpen(false)} resetCallback={loadCrossTabInfoAndPrefInfo} viewCd={vom.active} grid={grid1} username={getValues("USER_ID")} userGrp={getAuthTpCD()} orderBy="fldCd" />
      <PopDPItemTree
        id="DpItemPopup"
        open={popItemTreeOpen}
        onClose={() => {
          setPopItemTreeOpen(false);
        }}
        confirm={onSetItemCd}
        empNo={getValues("USER_ID")}
        authTpId={getAuthTpID()}
      />
      <PopDPAccountTree id="DpAccountPopup" open={popAccountOpen} onClose={() => setPopAccountOpen(false)} confirm={setAccountCd} empNo={getValues("USER_ID")} authTpId={getAuthTpID()} />
      <PopSelectUser open={userPopupOpen} onClose={() => setUserPopupOpen(false)} confirm={setUserCd} multiple={false} />
      <PopMeasureCopy open={measureCopyPopup} confirm={copyMeasure} onClose={() => setMeasureCopyOpen(false)} viewCd={vom.active} measureInfo={getMeasureInfo()} />
      <PopExtraParam open={extraParamOpen} extraParamData={extraParamData} onClose={() => setExtraParamOpen(false)} viewCd={vom.active} confirm={onExtraPopupSubmit} itemGradeOptions={itemGradeOptions} itemCovOptions={itemCovOptions} />
      <PopComment open={commentOpen} confirm={onCommentEdited} onClose={() => setCommentOpen(false)} commentData={commentData} />
    </ContentInner>
    // </React.Fragment>
  );
}

export default BaseEntry;
