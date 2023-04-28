import React, { useState, useEffect, useRef } from "react";
import { Box, FormControlLabel, Tabs, Tab, Grid } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import PopDPAccountTree from "@wingui/view/demandplan/common/PopAccountTree";
import PopDPItemTree from "@wingui/view/demandplan/common/PopItemTree";
import AntSwitch from "@wingui/view/demandplan/common/AntSwitch";
import PopSelectUser from "@wingui/view/demandplan/common/PopSelectUser";
import PopPersonalize from "@wingui/view/common/PopPersonalize";
import { loadDelegationCntData, loadAuthTypeData, loadDimensionData, loadMeasureData, loadCrossTabData, loadPreferenceData, gridDataFillReady, gridAfterSetData, setGridCrosstabInfo, setGridPreferenceInfo } from "@wingui/view/demandplan/entry/entry/entryUtil";
import { transLangKey } from "@wingui";

import { ContentInner, ResultArea, SearchArea, SearchRow, StatusArea, ButtonArea, LeftButtonArea, GridExcelExportButton, InputField, BaseGrid, GridCnt, useViewStore, CommonButton, useUserStore, zAxios } from "@zionex/wingui-core/src/common/imports";

import { dimensionItems, isEmptyArray, labelColors, loadOption, nvl } from "@wingui/view/demandplan/DpUtil";

import { STYLE_ID_EDIT_MEASURE, STYLE_ID_ROW_INSERTING, STYLE_ID_EDITABLE, STYLE_ID_UNEDITABLE } from "@zionex/wingui-core/src/common/const";

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
let defaultBucketTp;

import { Chart as ChartJS, LinearScale, CategoryScale, BarElement, PointElement, LineElement, Legend, Title, Tooltip, LineController, BarController } from "chart.js";
import { Chart } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, LineController, BarController);

function BaseAllReport(props) {
  const [username, displayName] = useUserStore((state) => [state.username, state.displayName]);

  let globalButtons = [];
  let [chartData, setChartData] = useState([]);

  let [chartLabels, setChartLabels] = useState([]);
  let [chartMeasures, setChartMeasures] = useState([]);
  let [tabValue, setTabValue] = useState("QTY");
  //1. view 페이지 데이타 store
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);

  //popup
  const [personalizeOpen, setPersonalizeOpen] = useState(false);
  const [popItemTreeOpen, setPopItemTreeOpen] = useState(false);
  const [popAccountOpen, setPopAccountOpen] = useState(false);
  const [userPopupOpen, setUserPopupOpen] = useState(false);
  // const [extraParamOpen, setExtraParamOpen] = useState(false);
  const [extraParamData, setExtraParamData] = useState(initExtraParam);
  // const [commentOpen, setCommentOpen] = useState(false);
  // const [commentData, setCommentData] = useState({});
  const currentVersion = useRef(null);
  const currentUserId = useRef(null);
  const currentAuthTp = useRef(null);

  const delegationCnt = useRef(null);

  // 코드 데이타
  const [planTpOptions, setPlanTpData] = useState([]);
  const [versionOptions, setVersionData] = useState([]);
  const [authTpOptions, setAuthTpData] = useState([]);

  // const [itemGradeOptions, setItemGradeData] = useState([]);
  // const [itemCovOptions, setItemCovData] = useState([]);
  const [currencyOptions, setCurrencyData] = useState([]);
  const [bucketOptions, setBucketData] = useState([]);

  const [prefInfoObj, setPrefInfoObj] = useState(null);

  //2. 그리드 Object
  var [grid1, setGrid1] = useState(null);

  //3. 상태 메시지
  const [message, setMessage] = useState();
  //4. FORM 데이타 처리
  const { handleSubmit, control, getValues, setValue, watch, clearErrors } = useForm({
    defaultValues: {
      ALL_USER_LOAD: true,
    },
  });

  const selectedPlanTp = watch("PLAN_TP");
  const selectedVersion = watch("VER_ID");
  const selectedUserId = watch("USER_ID");
  const selectedAuthTp = watch("AUTH_TP");

  // 그리드 Object 초기화
  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, "grid1");
    if (grdObj1) {
      setGrid1(grdObj1);
    }
  }, [viewData]);

  /* 표준화면  XML에 정의된 프로퍼티들 정리 */
  let xmlGridOption = {
    selectionMode: "block",
    checkBar: false,
    fitStyle: "even",
    showRowCount: true,
    gridSummary: true,
    groupable: true,
    groupHeader: true,
    groupSummary: true,
    groupSort: true,
    groupHeaderText: "${GROUPVALUE}",
    groupMergeMode: false,
    groupExpander: false,
  };

  // 그리드 Object 초기화
  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, "grid1");
    if (grdObj1) {
      setGrid1(grdObj1);
      loadCrossTabInfoAndPrefInfo(vom.active, selectedUserId, grid1);
    }
  }, [grid1]);

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
    let delegationCntData = await loadDelegationCntData();
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

  const loadVersion = async (planTypeCd, planTypeId) => {
    let options = await loadOption(true, "GetAllDPVersion", { PLAN_TYPE: planTypeCd }, "VER_ID", "VER_ID", false, true);
    const versionData = options.map((row) => row.data);

    // console.log("versionData", versionData);
    // entry는 row idx 1인 array object겠지
    // console.log("options", options);

    if (!isEmptyArray(options)) {
      grid1.gridView.gridWrap.versionData = versionData;
      setVersionData(options);
    }
  };

  /*  const loadItemGrade = async () => {
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
  };*/

  const loadBucket = async () => {
    let verInfo = findVersionData(selectedVersion);
    // console.log("loadBucket verInfo", verInfo);
    if (!verInfo) return;

    let mainBucketCd = verInfo.BUKT;
    let varBucketCd = verInfo.VAR_BUKT;
    let fromDate = verInfo.FROM_DATE;
    let toDate = verInfo.TO_DATE;

    const options = await loadOption(true, "SRV_GET_DP_BUKT", { MAIN_BUKT_CD: mainBucketCd, VAR_BUKT_CD: varBucketCd, FROM_DATE: fromDate, TO_DATE: toDate }, "SUB_CD", "SUB_NM", false, true);
    // console.log("bucket options", options);
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
    //console.log("loadAuthType in");
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
      console.log("[msData]", msData);
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
    //console.log("loadCrossTabInfoAndPrefInfo userName:",  userName);

    let grpCd = getUserGrpdCd(viewCd, userName, grid);

    //이넘은 grpCd에 대한 ID를 넘겨야 함.
    const prefInfo = await loadPrefInfo(viewCd, grpCd, userName, grid);
    //console.log("@@prefInfo==>", prefInfo)

    const crossTabInfo = await loadCrossTabInfo(viewCd, grpCd, userName, grid);
    //console.log("@@crossTabInfo==>", crossTabInfo)

    setPrefInfoObj({ prefInfo: prefInfo, crossTabInfo: crossTabInfo });

    //console.log("loadCrossTabInfoAndPrefInfo = >grpCd", grpCd)
    loadDimension(viewCd, grpCd, userName, grid);
    loadMeasure(viewCd, grpCd, userName, grid);
  };
  //==================================================================================================================================================================================================================

  //계획 타입 로드되면 첫번째 값 선택
  useEffect(() => {
    if (planTpOptions && planTpOptions.length > 0) setValue("PLAN_TP", planTpOptions[0].value);
    else setValue("PLAN_TP", "");
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
      let verInfo = findVersionData(selectedVersion);
      if (verInfo) {
        let mainBuktcd = verInfo.BUKT;
        let varBuktcd = verInfo.VAR_BUKT;

        if (mainBuktcd && varBuktcd) {
          if (mainBuktcd !== varBuktcd) defaultBucketTp = "PB";
          else defaultBucketTp = mainBuktcd;
        } else {
          defaultBucketTp = mainBuktcd;
        }
      } else defaultBucketTp = bucketOptions[0].value;
      setValue("BUCKET", defaultBucketTp);
    }
  }, [bucketOptions]);

  //통화 가져오면 첫번째 값 설정
  useEffect(() => {
    if (currencyOptions && currencyOptions.length > 0) setValue("CURCY_CD", currencyOptions[0].value);
  }, [currencyOptions]);

  //계획 타입 선택되면 버전 가져옴.
  useEffect(() => {
    if (selectedPlanTp) {
      const plnData = findPlanTpData(selectedPlanTp);
      loadVersion(plnData.CD, plnData.ID);
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
      currentVersion.current = selectedVersion;
    }
  }, [selectedVersion]);

  useEffect(() => {
    if (grid1 && selectedUserId) {
      currentUserId.current = selectedUserId;
      loadAuthType();
    }
  }, [selectedUserId]);

  useEffect(() => {
    if (grid1) {
      currentAuthTp.current = selectedAuthTp;
    }
  }, [selectedAuthTp]);

  useEffect(() => {
    if (grid1) {
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

  const refresh = () => {
    setValue("ITEM_CD", "");
    setValue("ITEM_NM", "");
    setValue("ACCOUNT_CD", "");
    setValue("ACCOUNT_NM", "");
    setValue("CURCY_CD", "0");
    setValue("BUCKET", defaultBucketTp);
    grid1.dataProvider.clearRows();
  };

  //조회버튼 클릭 data는 form에 정의된 데이타.
  const onSubmit = () => {
    if (isEmptyArray(selectedVersion)) {
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
    if (!selectedAuthTp && !getValues("ALL_USER_LOAD")) {
      showMessage(transLangKey("WARNING"), "Auth Type is not found", { close: false });
      return;
    }

    if (!selectedUserId && !getValues("ALL_USER_LOAD")) {
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

  function exportExcel() {
    grid1.exportExcel();
  }

  function setOptions(grid11) {
    grid11.gridView.setEditOptions({
      insertable: true,
      appendable: true,
    });

    //indicator, stateBar, checkBar
    setVisibleProps(grid11, true, true, false);
    grid11.gridView.displayOptions.fitStyle = "even";

    //events
  }

  const findVersionData = (verCd) => {
    let findOption = versionOptions.find((item) => item.value === verCd);
    // console.log("findVersionData findOption.data", findOption.data);
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
    let grpCd = "";
    if (selectGrpCd !== undefined && selectGrpCd.grpCd !== undefined) {
      grpCd = selectGrpCd.grpCd;
    } else {
      grpCd = "DEFAULT";
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
      PREV_VERSION_ID: verData.PREV_VER_ID,
      BUKT: verData.BUKT,
      FROM_DATE: verData.FROM_DATE,
      TO_DATE: verData.TO_DATE,
      VARIABLE_DATE: verData.VAR_DATE,
      VARIABLE_BUKT: verData.VAR_BUKT,
      CL_AUTH_TYPE: verData.CL_AUTH_TYPE,
      PRICE_TP_ID: verData.PRICE_TP_ID,
      CURCY_TP_ID: verData.CURCY_TP_ID,
      BUCKET_TP: isChart && getValues("BUCKET") === "PB" ? verData.BUKT : getValues("BUCKET"),
      MATCH_OPTION: "WHOLE-WORD",
      GRID_ID: isChart ? "RST_CRT_01" : "RST_CPT_01",
      CURCY_ID: currencyId ? currencyId : "",
      ITEM_FILTER: nvl(getValues("ITEM_CD"), ""),
      ACCOUNT_FILTER: nvl(getValues("ACCOUNT_CD"), ""),
    });
    if (!getValues("ALL_USER_LOAD")) {
      param.append("USER_ID", selectedUserId);
      param.append("USER_MAP_TYPE", authTpData ? authTpData.MAP_TP : "");
      param.append("AUTH_TP_ID", authTpData ? authTpData.ID : "");
      param.append("AUTH_TYPE", authTpData ? authTpData.CD : "");
      // getDemandWorker의 findMeasureValue에서 RT.AUTH_TYPE_QTY가 있으면 , ""로 바꿔주는 로직이 있는데, DP_ACCURACY 때문에 들어간듯하다.
      // 전체 사용자로 조회했는데, demand가 하나고 .. DP_ACCURACY 계산해주면 문제가 됨 ..
    }

    if (verData.VAR_DATE2) param.append("VARIABLE_DATE2", verData.VAR_DATE2);
    if (verData.VAR_BUKT2) param.append("VARIABLE_BUKT2", verData.VAR_BUKT2);
    if (grid1.gridView.dimensionData) param.append("DIM_INFO", JSON.stringify(grid1.gridView.dimensionData));
    param.append("MES_INFO", JSON.stringify(isChart ? chartMeasures : grid1.gridView.measureData));
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
    /*
        const verData = findVersionData(selectedVersion);
        const planTpData = findPlanTpData(selectedPlanTp);
        const authTpData = findAuthTpData(selectedAuthTp);
        //console.log("####authTpData==>", authTpData)

        let currencyId = getValues("CURCY_CD");

        let param = new URLSearchParams();

        param.append("VERSION_ID", verData.ID);
        param.append("PREV_VERSION_ID", verData.PREV_VER_ID);
        param.append("BUKT", verData.BUKT);
        param.append("FROM_DATE", verData.FROM_DATE);
        param.append("TO_DATE", verData.TO_DATE);
        param.append("VARIABLE_DATE", verData.VAR_DATE);
        param.append("VARIABLE_BUKT", verData.VAR_BUKT);
        if (verData.VAR_DATE2) param.append("VARIABLE_DATE2", verData.VAR_DATE2);
        if (verData.VAR_BUKT2) param.append("VARIABLE_BUKT2", verData.VAR_BUKT2);

        param.append("BUCKET_TP", getValues("BUCKET"));
        param.append("PRICE_TP_ID", verData.PRICE_TP_ID);
        param.append("CURCY_TP_ID", verData.CURCY_TP_ID);
        if (!getValues("ALL_USER_LOAD")) {
          param.append("USER_ID", selectedUserId);
          param.append("USER_MAP_TYPE", authTpData ? authTpData.MAP_TP : "");
          param.append("AUTH_TP_ID", authTpData ? authTpData.ID : "");
          param.append("AUTH_TYPE", authTpData ? authTpData.CD : "");
          // getDemandWorker의 findMeasureValue에서 RT.AUTH_TYPE_QTY가 있으면 , ""로 바꿔주는 로직이 있는데, DP_ACCURACY 때문에 들어간듯하다.
          // 전체 사용자로 조회했는데, demand가 하나고 .. DP_ACCURACY 계산해주면 문제가 됨 ..
        }
        if (grid1.gridView.dimensionData) param.append("DIM_INFO", JSON.stringify(grid1.gridView.dimensionData));
        if (grid1.gridView.measureData) param.append("MES_INFO", JSON.stringify(grid1.gridView.measureData));
        param.append("CURCY_ID", currencyId ? currencyId : "");
        param.append("ITEM_FILTER", nvl(getValues("ITEM_CD"), ""));
        param.append("ACCOUNT_FILTER", nvl(getValues("ACCOUNT_CD"), ""));
        param.append("LEAF_BUKT_YN", planTpData ? planTpData.LEAF_BUKT_YN : "");
        param.append("MATCH_OPTION", "WHOLE-WORD");
        param.append("GRID_ID", "RST_CPT_01");
        param.append("PLAN_TP_ID", planTpData ? planTpData.ID : "");
        param.append("CL_AUTH_TYPE", verData.CL_AUTH_TYPE);

        if (extraParamData["ITEM_ATTR_01"]) param.append("ITEM_ATTR_01", extraParamData["ITEM_ATTR_01"]);
        if (extraParamData["ITEM_ATTR_02"]) param.append("ITEM_ATTR_02", extraParamData["ITEM_ATTR_02"]);
        if (extraParamData["ITEM_ATTR_03"]) param.append("ITEM_ATTR_03", extraParamData["ITEM_ATTR_03"]);

        if (extraParamData["ACCT_ATTR_01"]) param.append("ACCT_ATTR_01", extraParamData["ACCT_ATTR_01"]);
        if (extraParamData["ACCT_ATTR_02"]) param.append("ACCT_ATTR_02", extraParamData["ACCT_ATTR_02"]);
        if (extraParamData["ACCT_ATTR_03"]) param.append("ACCT_ATTR_03", extraParamData["ACCT_ATTR_03"]);
        if (extraParamData["GRADE"]) param.append("ITEM_GRADE", extraParamData["GRADE"]);
        if (extraParamData["COV"]) param.append("ITEM_COV", extraParamData["COV"]);

    const ctabInfo = grid1.gridView.crossTabInfo;
    if (ctabInfo) param.append("CROSSTAB", JSON.stringify(ctabInfo));
*/
    zAxios({
      method: "post",
      url: "engine/dp/GetDemand",
      data: getLoadParams(false, null, null),
    })
      .then(function (res) {
        if (res.data) {
          grid1.gridView.gridWrap.BUCKET = getValues("BUCKET");
          grid1.gridView.gridWrap.AUTH_TP = getAuthTpCD();
          grid1.gridView.gridWrap.PLAN_TP = getValues("PLAN_TP");
          grid1.gridView.gridWrap.MES_INFO = grid1.gridView.measureData;

          grid1.setData(res.data.RESULT_DATA);
        }
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {});
  };

  function afterSetData(gridView, dataProvider, resultData) {
    gridAfterSetData(gridView, dataProvider, resultData);
  }

  function getAuthTpID() {
    if (selectedAuthTp) {
      const authTpData = findAuthTpData(selectedAuthTp);
      if (authTpData) return authTpData.ID;
    }
  }
  function getAuthTpCD() {
    if (selectedAuthTp) {
      const authTpData = findAuthTpData(selectedAuthTp);
      if (authTpData) return authTpData.CD;
    }
  }

  const openUserPopup = (visible) => {
    setUserPopupOpen(visible);
  };

  const openItemPopup = () => {
    setPopItemTreeOpen(true);
  };

  const openAccountPopup = () => {
    setPopAccountOpen(true);
  };

  /*  const openMeasureCopyPopup = () => {
    setMeasureCopyOpen(true);
  };*/

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
  /*  function onExtraPopupSubmit(data) {
    setExtraParamData(data);
  }*/

  /*
  function showPopComment(data) {
    setCommentData(data);
    setCommentOpen(true);
  }
*/

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

  const afterGridCreate = (grid1, gridView, dataProvider) => {
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

    // grid1.gridView.gridWrap.showPopComment = showPopComment;
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
    <ContentInner>
      <SearchArea submit={handleSubmit(onSubmit, onError)}>
        <InputField name="PLAN_TP" label={transLangKey("PLAN_TP")} type="select" control={control} options={planTpOptions} readonly={true} style={{ display: "none" }} />
        <InputField name="VER_ID" label={transLangKey("VERSION_ID")} type="select" control={control} options={versionOptions} />
        <InputField
          name="ITEM_CD"
          label={transLangKey("ITEM_CD")}
          type="action"
          tooltip={transLangKey("ITEM_CD")}
          onClick={() => {
            openItemPopup();
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
            openAccountPopup();
          }}
          control={control}
          onKeyDown={onKeyDown}
          onClear={onClear}>
          <Icon.Search />
        </InputField>
        <InputField name="ACCOUNT_NM" label={transLangKey("ACCOUNT_NM")} control={control} readonly={true} />
        <InputField name="CURCY_CD" label={transLangKey("CURCY_CD")} type="select" control={control} options={currencyOptions} wrapStyle={{ display: "none" }} />
        <InputField name="BUCKET" label={transLangKey("BUCKET")} type="select" control={control} options={bucketOptions} wrapStyle={{ display: "none" }} />
        <FormControlLabel
          key={"ALL_USER_LOAD"}
          label={transLangKey("ALL_USER_LOAD")}
          style={{ marginLeft: "0.5rem", marginTop: "0.5rem", marginBottom: "0.5rem" }}
          control={
            <Controller
              name={"ALL_USER_LOAD"}
              control={control}
              render={({ field: { onChange, value }, fieldState: {} }) => (
                <AntSwitch
                  checked={value}
                  onChange={(event, newValue) => {
                    onChange(newValue);
                  }}
                  size="small"
                  // style={{alignItems: "flex-end"}}
                />
              )}
            />
          }
        />
        {!watch("ALL_USER_LOAD") && (
          <InputField
            name="USER_ID"
            label={transLangKey("USER_ID")}
            type="action"
            tooltip={transLangKey("USER_ID")}
            onClick={() => {
              openUserPopup(true);
            }}
            control={control}
            readonly={true}>
            <Icon.Search />
          </InputField>
        )}
        {!watch("ALL_USER_LOAD") && <InputField name="EMP_NM" label={transLangKey("EMP_NM")} control={control} readonly={true} />}
        {!watch("ALL_USER_LOAD") && <InputField name="AUTH_TP" label={transLangKey("AUTH_TP_ID")} type="select" control={control} options={authTpOptions} wrapStyle={{ display: "none" }} />}
      </SearchArea>
      <ResultArea sizes={props.hasChart ? [30, 70] : [100]} direction={"vertical"}>
        {props.hasChart ? makeChart() : null}
        <Box>
          <ButtonArea title={transLangKey("UI_DP_96")} grid={"grid1"} format={"{0} "}>
            <LeftButtonArea>
              <GridExcelExportButton type="icon" grid="grid1" options={{ footer: "hidden", ApplyI18n: ["CATEGORY"] }} />
            </LeftButtonArea>
          </ButtonArea>
          <Box style={{ height: "calc(100% - 53px)" }}>
            <BaseGrid id="grid1" items={grid1Items} gridCd={vom.active + "-RST_CPT_01"} xmlGridOption={xmlGridOption} afterGridCreate={afterGridCreate} onReadyDataFill={gridDataFillReady} onAfterDataSet={afterSetData} />
          </Box>
        </Box>
      </ResultArea>
      <StatusArea show={false} message={message}>
        <GridCnt grid="grid1" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")} />
      </StatusArea>

      <PopPersonalize open={personalizeOpen} onClose={() => setPersonalizeOpen(false)} resetCallback={loadCrossTabInfoAndPrefInfo} viewCd={vom.active} grid={grid1} username={username} orderBy="fldCd" />
      <PopDPItemTree
        id="DpItemPopup"
        open={popItemTreeOpen}
        onClose={() => {
          setPopItemTreeOpen(false);
        }}
        confirm={onSetItemCd}
        empNo={!watch("ALL_USER_LOAD") ? selectedUserId : null}
        authTpId={!watch("ALL_USER_LOAD") ? getAuthTpID() : null}
      />
      <PopDPAccountTree id="DpAccountPopup" open={popAccountOpen} onClose={() => setPopAccountOpen(false)} confirm={setAccountCd} empNo={!watch("ALL_USER_LOAD") ? selectedUserId : null} authTpId={!watch("ALL_USER_LOAD") ? getAuthTpID() : null} />
      <PopSelectUser open={userPopupOpen} onClose={() => openUserPopup(false)} confirm={setUserCd} multiple={false} />
    </ContentInner>
  );
}

export default BaseAllReport;
