import React, { useState, useEffect } from "react";
import { useForm, watch } from "react-hook-form";
import { Line, Chart, Bar, Scatter } from "react-chartjs-2";
import { ButtonGroup, IconButton, Tabs, Tab, Box } from "@mui/material";

import { ContentInner, ViewPath, ResultArea, SearchArea, StatusArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow, SplitPanel, InputField, BaseGrid, GridCnt, useViewStore, useUserStore, zAxios, useStyles, GridExcelExportButton, GridExcelImportButton } from "@zionex/wingui-core/src/common/imports";
import PopPersonalize from "@wingui/view/common/PopPersonalize";
import PopSelectItemLvItem from "../../common/PopSelectItemLvItem";
import PopSelectSalesLvAccount from "../../common/PopSelectSalesLvAccount";
import "./css/factoranalysis.css";

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const excelExportOptions = {
  lookupDisplay: false,
  // allColumns: true,
  separateRows: true,
  footer: "default",
  headerDepth: 2,
  importExceptFields: { 0: "id" },
};

let grid1Items = [
  { name: "FACTOR_CD", dataType: "text", headerText: "FACTOR_CD", visible: true, editable: false, width: "120", textAlignment: "center" },
  { name: "DESCRIP", dataType: "text", headerText: "DESCRIP", visible: true, editable: false, width: "120", textAlignment: "center" },
  { name: "COUNT", dataType: "number", headerText: "COUNT", visible: true, editable: false, width: "50" },
  { name: "AVG", dataType: "number", headerText: "AVG", visible: true, editable: false, width: "50", numberFormat: "#,###.###" },
  { name: "STDEV", dataType: "number", headerText: "STDEV", visible: true, editable: false, width: "50", numberFormat: "#,###.###" },
  { name: "MIN", dataType: "number", headerText: "MIN", visible: true, editable: false, width: "50", numberFormat: "#,###.###" },
  { name: "MAX", dataType: "number", headerText: "MAX", visible: true, editable: false, width: "50", numberFormat: "#,###.###" },
  { name: "MODE", dataType: "number", headerText: "MODE", visible: true, editable: false, width: "50", numberFormat: "#,###.###" },
  { name: "COV", dataType: "number", headerText: "COV", visible: true, editable: false, width: "50", numberFormat: "#,###.###" },
];

let grid2Items = [
  { name: "ITEM_LV_ID", dataType: "text", headerText: "ITEM_LV_ID", visible: false, editable: false, width: "80" },
  { name: "SALES_LV_ID", dataType: "text", headerText: "SALES_LV_ID", visible: false, editable: false, width: "80" },
  { name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: "100", mergeRule: { criteria: "value" }, textAlignment: "center" },
  { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: "100", mergeRule: { criteria: "value" }, textAlignment: "center" },
  { name: "ACCOUNT_CD", dataType: "text", headerText: "ACCOUNT_CD", visible: true, editable: false, width: "80", mergeRule: { criteria: "value" }, textAlignment: "center" },
  { name: "ACCOUNT_NM", dataType: "text", headerText: "ACCOUNT_NM", visible: true, editable: false, width: "100", mergeRule: { criteria: "value" }, textAlignment: "center" },
  { name: "FACTOR_CD", dataType: "text", headerText: "FACTOR", visible: true, editable: false, width: "100", textAlignment: "center" },
  { name: "IMPORTANCE_RF", dataType: "number", headerText: "IMPORTANCE_RF", visible: true, editable: false, width: "100", numberFormat: "#,###.###" },
  { name: "IMPORTANCE_GB", dataType: "number", headerText: "IMPORTANCE_GB", visible: true, editable: false, width: "100", numberFormat: "#,###.###" },
  { name: "IMPORTANCE_TF", dataType: "number", headerText: "IMPORTANCE_TF", visible: true, editable: false, width: "100", numberFormat: "#,###.###" },
  { name: "R_VALUE", dataType: "number", headerText: "R_VALUE", visible: true, editable: false, width: "80", numberFormat: "#,###.####" },
  {
    name: "P_VALUE",
    dataType: "number",
    headerText: "P_VALUE",
    visible: true,
    editable: false,
    width: "80",
    numberFormat: "#,###.####",
    styleCallback: function (grid, dataCell) {
      var ret = {};
      var P_VALUE = grid.getValue(dataCell.index.itemIndex, "P_VALUE");
      if (P_VALUE < 0.05) {
        ret.styleName = "SIGNIFICANT";
      }
      return ret;
    },
  },
  { name: "REG_COEF", dataType: "number", headerText: "REG_COEF", visible: true, editable: false, width: "80", numberFormat: "#,###.###"},
//   { name: "REG_PVALUE", dataType: "number", headerText: "REG_PVALUE", visible: false, editable: false, width: "80", numberFormat: "#,###.####"},
//   { name: "REG_RSQRD", dataType: "number", headerText: "REG_RSQRD", visible: false, editable: false, width: "80", numberFormat: "#,###.####"},
];

let resultData = [];
let resultScatter = [];
let resultSalesData = [];

function FactorAnalysis(props) {
  const [username] = useUserStore((state) => [state.username]);
  const classes = useStyles();

  //1. view page data store
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);

  //2. grid Object
  const [grid1, setGrid1] = useState(null);
  const [grid2, setGrid2] = useState(null);
  const [grid3, setGrid3] = useState(null);

  const [personalizeOpen, setPersonalizeOpen] = useState(false);

  //3. 상태 메시지
  const [message, setMessage] = useState();

  //4. FORM 데이터 처리
  const {
    handleSubmit,
    reset,
    control,
    getValues,
    setValue,
    watch,
    register,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: {
      applyDttmF: new Date(new Date().setFullYear(new Date().getFullYear() - 3)),
      applyDttmT: new Date(),
      MULTI_SEL: ["N"],
      factorCd: "",
      factorDescrip: "",
      factorSet: "",
    },
  });

  const [option1, setOption1] = useState([]);
  const [option2, setOption2] = useState([]);
  const [option3, setOption3] = useState([]);

  let isActiveRF = true;
  let isActiveGB = true;
  let isActiveTF = false;
  let isActiveLR = true;

  const [itemPopupOpen, setItemPopupOpen] = useState(false);
  const [accountPopupOpen, setAccountPopupOpen] = useState(false);

  const [tabValue, setTabValue] = React.useState("chart1");
  const [chart1Plugin, setChart1Plugin] = useState({});
  const [chart2Plugin, setChart2Plugin] = useState({});
  const [chart3Plugin, setChart3Plugin] = useState({});
  let checkedItems = [];

  const [multiSel, setMultiSel] = useState("");
  useEffect(() => {
    const subscription = watch((value, { name }) => {
        if (name === "MULTI_SEL") {
          setMultiSel(value);
          }
        });
    return () => subscription.unsubscribe();
  }, [watch]);

  const labelColors = ["#0069a5", "#0098ee", "#7bd2f6", "#ffb800", "#ff8517", "#e34a00"];
  const [chart1Data, setChart1Data] = useState({
    datasets: [],
  });
  const [chart2Data, setChart2Data] = useState({
    datasets: [],
  });
  const [chart3Data, setChart3Data] = useState({
    datasets: [
        {
         label: transLangKey('IMPORTANCE_RF'),
         data: [],
         backgroundColor: '#428bca',
        },
        {
         label: transLangKey('IMPORTANCE_GB'),
         data: [],
         backgroundColor: '#5bc0de',
        },
        ],
    });

  const globalButtons = [
    {
      name: "search",
      action: (e) => {
        onSubmit();
      },
      visible: true,
      disable: false,
    },
//     {
//       name: "save",
//       action: (e) => {
//         saveData(grid1);
//         saveData(grid2);
//         saveData(grid3);
//       },
//       visible: false,
//       disable: false,
//     },
    {
      name: "refresh",
      action: (e) => {
        refresh();
      },
      visible: true,
      disable: false,
    },
    {
      name: "personalization",
      action: (e) => {
        setPersonalizeOpen(true);
      },
      visible: true,
      disable: false,
    },
  ];
  // 그리드 Object 초기화
  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, "grid1");
    const grdObj2 = getViewInfo(vom.active, "grid2");
    const grdObj3 = getViewInfo(vom.active, "grid3");
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        if (grid1 != grdObj1){
          setGrid1(grdObj1);
        }
      }
    }
    if (grdObj2 && grdObj3) {
      if ((grdObj2.dataProvider) && (grdObj3.dataProvider)) {
        if ((grid2 != grdObj2) && (grid3 !=grdObj3)){
          setGrid2(grdObj2);
          setGrid3(grdObj3);
        }
      }
    }
  }, [viewData]);

  const setItemLv = () => {
    let param = new URLSearchParams();
    param.append("LV_TP", "I");
    param.append("ACCOUNT_TP", "");
    param.append("LEAF_YN", "");
    param.append("LV_LEAF_YN", "");
    param.append("TYPE", "");
    param.append("ACCOUNT_LV_YN", "");
    param.append("PARENT_SEARCH", "");
    param.append("NOW_LEVEL_SEARCH", "");
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_00_LV_CD_Q1",
      data: param,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          let dataArr = [];
          let rstArr = [];
          dataArr = res.data.RESULT_DATA;
          let listItemObj;

          for (let i = 0, len = dataArr.length; i < len; i++) {
            let row = dataArr[i];
            if (row !== null) {
              listItemObj = { value: row.ID, label: transLangKey(row.CD_NM) };
              rstArr.push(listItemObj);
            }
          }
          setOption2(rstArr);
          setValue("itemLv", rstArr[dataArr.length - 1].value);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const setSalesLv = () => {
    let param = new URLSearchParams();
    param.append("LV_TP", "S");
    param.append("ACCOUNT_TP", "");
    param.append("LEAF_YN", "");
    param.append("LV_LEAF_YN", "");
    param.append("TYPE", "");
    param.append("ACCOUNT_LV_YN", "Y");
    param.append("PARENT_SEARCH", "");
    param.append("NOW_LEVEL_SEARCH", "");
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_00_LV_CD_Q1",
      data: param,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          let dataArr = [];
          let rstArr = [];
          dataArr = res.data.RESULT_DATA;
          let listItemObj;

          for (let i = 0, len = dataArr.length; i < len; i++) {
            let row = dataArr[i];
            if (row !== null) {
              listItemObj = { value: row.ID, label: transLangKey(row.CD_NM) };
              rstArr.push(listItemObj);
            }
          }

          setOption3(rstArr);
          setValue("salesLv", rstArr[dataArr.length - 1].value);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  useEffect(() => {
    if (grid1 && grid2 && grid3) {
      setViewInfo(vom.active, "globalButtons", globalButtons);
      // setOptions();
      setItemLv();
      setSalesLv();
    }
  }, [grid1, grid2, grid3]);

  const tabChange = async (event, newValue) => {
    setTabValue(newValue);
  };

  /** 이벤트 핸들러 */
  function onSubmit(data) {
    loadData();
  }

  function refresh() {
    reset();
    grid1.dataProvider.clearRows();
    grid2.dataProvider.clearRows();
    grid3.dataProvider.clearRows();
    setChart1Data("");
    setChart2Data({datasets:[]});
    setChart3Data("");
    setItemLv();
    setSalesLv();
  }

  const afterGridCreate1 = (gridObj, gridView, dataProvider) => {
    setGrid1(gridObj);
    gridObj.gridView.displayOptions.fitStyle = "fill";
    gridObj.gridView.setCheckBar({visible: true, exclusive: false, showAll: false,});
    gridObj.gridView.orderBy(["FACTOR_CD"], ["ascending"]);
    gridObj.gridView.onCellClicked = function (grid, clickData) {
      const checkBox = getValues("MULTI_SEL")[0] === "Y" ? true : false;
      if (checkBox) {
        if (clickData.cellType !== "check"){
          grid.checkItem(clickData.itemIndex, !grid.isCheckedItem(clickData.itemIndex), false);
          createChart1(gridObj);
        }
        else {
          createChart1(gridObj);
        }
      }
      else {
        const checkedItem = grid.getCheckedItems();
        const clickedItem = clickData.itemIndex;
        if (clickData.cellType !== "check"){
          if (checkedItem.includes(clickedItem)) {
            grid.checkItem(clickedItem, false, false);
          }
          else {
            grid.checkItem(clickedItem, true, true);
          }
          createChart1(gridObj);
        }
        else {
          if (checkedItem.includes(clickedItem)) {
            grid.checkItem(clickedItem, grid.isCheckedItem(clickedItem), true);
          }
          else {
            grid.checkItem(clickedItem, grid.isCheckedItem(clickedItem), false);
          }
          createChart1(gridObj);
        }
      }
    }
  }

  const afterGridCreate2 = (gridObj, gridView, dataProvider) => {
    setGrid2(gridObj);
    gridObj.gridView.displayOptions.fitStyle = "fill";
    gridObj.gridView.setCheckBar({visible: true, exclusive: false, showAll: false,});
    gridObj.gridView.orderBy(["IMPORTANCE_RF"], ["descending"]);
    gridObj.gridView.onCellClicked = function (grid, clickData) {
      const fieldIndex = clickData.fieldIndex;
      if (fieldIndex >= 2 && fieldIndex <= 5) {
        createChart2(gridObj);
      }
      else {
        const checkBox = getValues("MULTI_SEL")[0] === "Y" ? true : false;
        if (checkBox) {
          if (clickData.cellType !== "check") {
            grid.checkItem(clickData.itemIndex, !grid.isCheckedItem(clickData.itemIndex), false);
            createChart2(gridObj);
          }
          else {
            createChart2(gridObj);
          }
        }
        else {
          const checkedItem = grid.getCheckedItems();
          const clickedItem = clickData.itemIndex;
          if (clickData.cellType !== "check") {
            if (checkedItem.includes(clickedItem)) {
              grid.checkItem(clickedItem, false, false);
            }
            else {
              grid.checkItem(clickedItem, true, true);
            }
            createChart2(gridObj);
          }
          else {
            if (checkedItem.includes(clickedItem)) {
              grid.checkItem(clickedItem, grid.isCheckedItem(clickedItem), true);
            }
            else {
              grid.checkItem(clickedItem, grid.isCheckedItem(clickedItem), false);
            }
            createChart2(gridObj);
          }
        }
      }
    }
  }

  function setActiveTF() {
    if (grid3) {
      const result = grid3.gridView.columnProps[9].visible;
      isActiveTF = result;
    }
  }

  function groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }

  function loadData() {
    let dataArr;
    if (!getValues("itemCd")) {
      showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_0017"), { close: false });
      return;
    } else if (!getValues("accountCd")) {
      showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_0015"), { close: false });
      return;
    }

    setActiveTF();

    let applyDttmF = new Date(getValues("applyDttmF"));
    let applyDttmT = new Date(getValues("applyDttmT"));

    let fromDate = applyDttmF ? applyDttmF.format("yyyy-MM-ddT00:00:00") : "19700101";
    let toDate = applyDttmT ? applyDttmT.format("yyyy-MM-ddT00:00:00") : "99991231";

    let param = new URLSearchParams();
    param.append("S_DATE", fromDate);
    param.append("E_DATE", toDate);
    param.append("ITEM_LV_ID", getValues("itemLv") ? getValues("itemLv") : "");
    param.append("ITEM_CD", getValues("itemCd") ? getValues("itemCd") : "");
    param.append("ITEM_NM", getValues("itemNm") ? getValues("itemNm") : "");
    param.append("SALES_LV_ID", getValues("salesLv") ? getValues("salesLv") : "");
    param.append("ACCOUNT_CD", getValues("accountCd") ? getValues("accountCd") : "");
    param.append("ACCOUNT_NM", getValues("accountNm") ? getValues("accountNm") : "");
    param.append("ENABLE_GB", isActiveGB);
    param.append("ENABLE_RF", isActiveRF);
    param.append("ENABLE_TF", isActiveTF);
    param.append("ENABLE_LR", isActiveLR);
    zAxios({
      method: "post",
      url: baseURI() + "engine/bf/DoFctImpCorr",
      data: param,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          resultData = res.data.RESULT_DATA;
          let dataArr = [];
          let rstArr = [];
          dataArr = res.data.RESULT_DATA;
          for (let i = 0, len = dataArr.length; i < len; i++) {
            let row = dataArr[i];
            if (row !== null) {
              row.FACTOR_CD_ORG = row.FACTOR_CD;
              row.FACTOR_CD = transLangKey(row.FACTOR_CD);
              rstArr.push(row);
            }
          }
          grid2.dataProvider.fillJsonData(rstArr);
          grid3.dataProvider.fillJsonData(rstArr);
          grid2.gridView.checkItems(checkedItems, true);
          createChart3();
          createChart2(grid2);
          createChart1(grid1);
          if (grid2.dataProvider.getRowCount() == 0 || grid3.dataProvider.getRowCount() == 0) {
            grid2.gridView.setDisplayOptions({ showEmptyMessage: true, emptyMessage: transLangKey("MSG_NO_DATA") });
            grid3.gridView.setDisplayOptions({ showEmptyMessage: true, emptyMessage: transLangKey("MSG_NO_DATA") });
          }
        }
      })
      .catch(function (err) {
        grid2.dataProvider.clearRows();
        grid3.dataProvider.clearRows();
        setChart3Data("");
        setChart2Data({datasets:[]});
        setChart1Data("");
        console.log(err);
      });

    let param2 = new URLSearchParams();
    param2.append("S_DATE", fromDate);
    param2.append("E_DATE", toDate);
    param2.append("ITEM_LV_ID", getValues("itemLv") ? getValues("itemLv") : "");
    param2.append("ITEM_CD", getValues("itemCd") ? getValues("itemCd") : "");
    param2.append("ITEM_NM", getValues("itemNm") ? getValues("itemNm") : "");
    param2.append("SALES_LV_ID", getValues("salesLv") ? getValues("salesLv") : "");
    param2.append("ACCOUNT_CD", getValues("accountCd") ? getValues("accountCd") : "");
    param2.append("ACCOUNT_NM", getValues("accountNm") ? getValues("accountNm") : "");
    zAxios({
      method: "post",
      url: baseURI() + "engine/bf/DoSalesFct",
      data: param2,
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        resultScatter = res.data.RESULT_DATA;
        }
      })
      .catch(function (err) {
        setChart2Data({datasets:[]});
        console.log(err);
      });

    let param3 = new URLSearchParams();
    param3.append("S_DATE", fromDate);
    param3.append("E_DATE", toDate);
    param3.append("ITEM_CD", getValues("itemCd") ? getValues("itemCd") : "");
    param3.append("ACCOUNT_CD", getValues("accountCd") ? getValues("accountCd") : "");
    param3.append("ITEM_LV_ID", getValues("itemLv") ? getValues("itemLv") : "");
    param3.append("ACCT_LV_ID", getValues("salesLv") ? getValues("salesLv") : "");
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_BF_56_CHART_Q1",
      data: param3,
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        resultSalesData = res.data.RESULT_DATA;
      grid1.gridView.checkItems(checkedItems, true);
      }
    })
    .catch(function (err) {
      console.log(err);
    });

    let param4 = new URLSearchParams();
    param4.append("FROM_DATE", fromDate);
    param4.append("TO_DATE", toDate);
    param4.append("FACTOR_CD", "");
    param4.append("FACTOR_DESCRIP", "");
    param4.append("FACTOR_SET", "");
    param4.append("ITEM_CD", getValues("itemCd") ? getValues("itemCd") : "");
    param4.append("ACCOUNT_CD", getValues("accountCd") ? getValues("accountCd") : "");

    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_BF_56_Q1",
      data: param4,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          grid1.dataProvider.fillJsonData(res.data.RESULT_DATA);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  // popup Open(item)
  function openItemPopup() {
    setItemPopupOpen(true);
    setAccountPopupOpen(false);
  }

  // popup close(item)
  function onSetItemCd(gridRows) {
    let itemCdArr = [];
    let itemNmArr = [];
    gridRows.forEach(function (row) {
      itemCdArr.push(row.ITEM_CD);
      itemNmArr.push(row.ITEM_NM);
    });
    setValue("itemCd", itemCdArr.join("|"));
    setValue("itemNm", itemNmArr.join("|"));
  }

  // popup Open(account)
  function openAccountPopup() {
    setItemPopupOpen(false);
    setAccountPopupOpen(true);
  }

  // popup close(account)
  function onSetAccountCd(gridRows) {
    let accountCdArr = [];
    let accountNmArr = [];
    gridRows.forEach(function (row) {
      accountCdArr.push(row.ACCOUNT_CD);
      accountNmArr.push(row.ACCOUNT_NM);
    });
    setValue("accountCd", accountCdArr.join("|"));
    setValue("accountNm", accountNmArr.join("|"));
  }

  function createChart1(grid) {
    const checkBox = getValues("MULTI_SEL")[0] === "Y" ? true: false;
    let chartArr = {};
    checkedItems = grid.gridView.getCheckedItems();
    let checkedLength = checkedItems.length;

    let data = Object.assign([], resultSalesData);
    let scatter = Object.assign([], resultScatter);

    const colors = ["#428bca", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];
    let color = colors[0];
    let account_cd = getValues("accountCd");
    let item_cd = getValues("itemCd");
    setChart1Plugin({
      title: {
        display: false,
      },
      legend: {
        position: "right",
      }
    });
    let sum_rt = [];
    let categories = [];
    let seriesList = [];
    let grouped = "";
    grouped = groupBy(data, (dt) => dt.WK52);

    for (let [key, value] of grouped) {
      let sum_qty = 0;
      let tmp_data = [];
      for (let j = 0; j < value.length; j++) {
        sum_qty += value[j]["QTY"];
        tmp_data.push(value[j]["QTY"]);
      }
      sum_rt.push(sum_qty);
      key = key.slice(0, 4).concat('-', key.slice(-2));
      categories.push(key);
    }
    seriesList.push({
      label: transLangKey("ACTUAL_SALES"),
      data: sum_rt,
      backgroundColor: "#ff8517",
      borderColor: "#ff8517",
      yAxisID: 'QTY',
      order: 1,
      hidden: false,
    });
    chartArr = {
      labels: categories,
      datasets: seriesList,
      showLine: true,
    };

    if (checkedLength == 0){
      let factor_cd = grid.gridView.getValue(0, "FACTOR_CD");
      let y = scatter.map((data) => data[factor_cd]);
      chartArr.datasets.push(
              {
              label: transLangKey(factor_cd),
              data : y,
              showLine: false,
              backgroundColor: color,
              borderColor: color,
              yAxisID: 'FCT',
              hidden: false,
              })
      setChart1Data(chartArr);
    } else {
        let factor_list = [];
        checkedItems.map((row) => {
          let factor_cd = grid.gridView.getValue(row, "FACTOR_CD");
          factor_list.push(factor_cd);
        });
      if (checkBox === true){
        for (let i=0; i<factor_list.length; i++) {
          let factor = factor_list[i];
          let color = colors[i]
          let y = scatter.map((data) => data[factor]);
          chartArr.datasets.push(
                {
                label: transLangKey(factor),
                data : y,
                showLine: false,
                backgroundColor: color,
                borderColor: color,
                yAxisID: 'FCT',
                hidden: false,
                })
          }
        setChart1Data(chartArr);
      } else {
        let factor = factor_list[0];
        let color = colors[0]
        let y = scatter.map((data) => data[factor]);
        chartArr.datasets.push({
             label: transLangKey(factor),
             data : y,
             showLine: false,
             backgroundColor: color,
             borderColor: color,
             yAxisID: 'FCT',
             hidden: false,
        })
        setChart1Data(chartArr);
        }
      }
    }

  function createChart2(grid) {
    const checkBox = getValues("MULTI_SEL")[0] === "Y" ? true: false;
    let result = Object.assign([], resultScatter);
    let result2 = Object.assign([], resultData);
    let columns_org = Object.keys(resultScatter[0]).filter(el => el !== "Y");
    let columns = Object.keys(resultScatter[0]).filter(el => el !== "Y").map(el => transLangKey(el));
    let y = result.map((data) => data.Y);
    const colors = ["#428bca", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2", "#7f7f7f", "#bcbd22", "#17becf"];
    const color = colors[0]
    checkedItems = grid.gridView.getCheckedItems();
    let checkedLength = checkedItems.length;
    if (checkedLength == 0){
      setChart2Plugin({
        title: {
          display: false
        },
        legend: {
          display: true
        }
      });
      let factor_cd = grid.gridView.getValue(0, 'FACTOR_CD');
      let factor_cd_org = columns_org[columns.indexOf(factor_cd)];
      let x = result.map((data) => data[factor_cd_org]);
      let lines = result2.filter(el => el.FACTOR_CD === factor_cd)[0];
      let minX = Math.min(...x);
      let maxX = Math.max(...x);
      let scatterData = {datasets:[]};
      scatterData.datasets.push(
                  {
                    label: factor_cd,
                    data: x.map((val, index) => ({x: val, y: y[index]})),
                    backgroundColor: color,
                    borderColor: color,
                    showLine: false,
                  },
                  {
                    label: transLangKey("REGRESSION_LINE"),
                    data:[{x: minX, y: lines.REG_COEF * minX + lines.CONSTANT},
                          {x: maxX*1.05, y: lines.REG_COEF * maxX*1.05 + lines.CONSTANT}],
                    backgroundColor: color,
                    borderColor: color,
                    showLine: true,
                  },
      );
      setChart2Data(scatterData);
    } else {
      setChart2Plugin({
        title: {
          display: false
        },
        legend: {
          display: true
        }
      });
      let factor_list = [];
      checkedItems.map((row) => {
        let factor_cd = grid.gridView.getValue(row, "FACTOR_CD");
        let factor_cd_org = columns_org[columns.indexOf(factor_cd)];
        factor_list.push(factor_cd);
        factor_list.push(factor_cd_org);
      });
      let x = [];
      let scatterData = {
        datasets: [],
      };
      if (checkBox === true){
        for (let i=0; i<factor_list.length/2; i++) {
          let factor = factor_list[2*i];
          let factor_org = factor_list[2*i+1];
          let color = colors[i]
          x[i] = result.map((data) => data[factor_org]);
          let lines = result2.filter(el => el.FACTOR_CD === factor)[0];
          let minX = Math.min(...x[i]);
          let maxX = Math.max(...x[i]);
          scatterData.datasets.push(
                     {
                      label: factor,
                      data: x[i].map((val, index) => ({x: val, y: y[index]})),
                      showLine: false,
                      backgroundColor: color,
                      borderColor: color,
                     },
                     {
                      label: transLangKey("REGRESSION_LINE"),
                      data:[
                           {x: minX, y: lines.REG_COEF * minX + lines.CONSTANT},
                           {x: maxX*1.05, y: lines.REG_COEF * maxX*1.05 + lines.CONSTANT}
                           ],
                      backgroundColor: color,
                      borderColor: color,
                      showLine: true,
                     }
          );
        }
        setChart2Data(scatterData);
      } else if (checkBox === false){
        let factor = factor_list[0];
        let factor_org = factor_list[1];
        let color = colors[0]
        x = result.map((data) => data[factor_org]);
        let lines = result2.filter(el => el.FACTOR_CD === factor)[0];
        let minX = Math.min(...x);
        let maxX = Math.max(...x);
        scatterData.datasets.push(
                   {
                    label: factor,
                    data: x.map((val, index) => ({x: val, y: y[index]})),
                    showLine: false,
                    backgroundColor: color,
                    borderColor: color,
                    },
                   {
                    label: transLangKey('REGRESSION_LINE'),
                    data:[
                         {x: minX, y: lines.REG_COEF * minX + lines.CONSTANT},
                         {x: maxX*1.05, y: lines.REG_COEF * maxX*1.05 + lines.CONSTANT}
                         ],
                    backgroundColor: color,
                    borderColor: color,
                    showLine: true,
                    },
          );
          setChart2Data(scatterData);
      }
    }
  }

  function createChart3() {
    let result = Object.assign([], resultData);
    //desc
    result = result.sort(function (a, b) {
      return b.IMPORTANCE_RF - a.IMPORTANCE_RF;
        }
      )
    setChart3Plugin({
        legend: {
              position: "top",
              display: true,
              }
    });
    if (isActiveTF) {
      datasets.push({
        label: transLangKey("IMPORTANCE_TF"),
        data: result.map((data) => data.IMPORTANCE_TF),
        backgroundColor: "#5cb85c",
        borderColor: "#5cb85c",
      });
    }

    let chartData = {
      labels: result.map((data) => transLangKey(data.FACTOR_CD)),
      datasets: [{
                  label: transLangKey('IMPORTANCE_RF'),
                  data: result.sort(function (a, b) {
                                    return b.IMPORTANCE_RF - a.IMPORTANCE_RF;
                                }).map(data => data.IMPORTANCE_RF),
                  backgroundColor: '#428bca',
                  borderColor: '#428bca',
                  },
                  {
                  label: transLangKey('IMPORTANCE_GB'),
                  data: result.map((data) => data.IMPORTANCE_GB),
                  backgroundColor: '#5bc0de',
                  borderColor: '#5bc0de',
                  },
                // {
                //   label: transLangKey('IMPORTANCE_TF'),
                //   data: result.map(data => data.IMPORTANCE_TF),
                //   backgroundColor: '#5cb85c',
                //   borderColor: '#5cb85c',
                // }
                ],
    };
    setChart3Data(chartData);
  }

  const reloadPrefInfo = (viewCd, userName, grid, grpCd, gridCd) => {
    if (grid) grid.loadCrossTabInfoAndPrefInfo(viewCd, grpCd, userName);
  };
  /** 이벤트 핸들러 끝 */

return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <InputField type={"datetime"} name="applyDttmF" label={transLangKey("FROM_DATE")} control={control} dateformat="yyyy-MM-dd" readonly={false} />
            <InputField type={"datetime"} name="applyDttmT" label={transLangKey("TO_DATE")} control={control} dateformat="yyyy-MM-dd" readonly={false} />
          </SearchRow>
          <SearchRow>
            <InputField type="select" name="itemLv" label={transLangKey("ITEM_LV")} control={control} options={option2} />
            <InputField
              type="action"
              name="itemCd"
              label={transLangKey("ITEM_CD")}
              title={transLangKey("SEARCH")}
              onClick={() => {
                openItemPopup();
              }}
              control={control}
              rules={{
                required: transLangKey("MSG_0017"),
              }}>
              <Icon.Search />
            </InputField>
            <InputField name="itemNm" label={transLangKey("ITEM_NM")} control={control} />
            <InputField type="select" name="salesLv" label={transLangKey("SALES_LV")} control={control} options={option3} />
            <InputField
              type="action"
              name="accountCd"
              label={transLangKey("ACCOUNT_CD")}
              title={transLangKey("SEARCH")}
              onClick={() => {
                openAccountPopup();
              }}
              control={control}>
              <Icon.Search />
            </InputField>
            <InputField name="accountNm" label={transLangKey("ACCOUNT_NM")} control={control} />
{/*             <InputField */}
{/*               type="check" */}
{/*               name="MULTI_SEL" */}
{/*               label="" */}
{/*               control={control} */}
{/*               options={[{ label: transLangKey("MULTI_SEL"), value: 'N'}]} */}
{/*             /> */}
          </SearchRow>
        </SearchArea>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={tabChange} indicatorColor="primary">
            <Tab label={transLangKey("FACTOR_STATISTICS")} value="chart1" />
            <Tab label={transLangKey("SALES_FACTOR_RELATION")} value="chart2" />
            <Tab label={transLangKey("FACTOR_IMPORTANCE")} value="chart3" />
          </Tabs>
        </Box>
          <Box style={{height: "100%", display: tabValue === "chart1" ? "block" : "none" }}>
            <ResultArea>
              <Box style={{ height: "100%" }}>
                <Line
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: chart1Plugin,
                    interaction: {
                      mode: 'index',
                      intersect: false,
                    },
                    legend: {
                            position: "right",
//                             onClick: function(event, legendItem){
//                               var index = legendItem.datasetIndex;
//                               if (index == 0){
//                                 var chartIndex = 'QTY';
//                                 } else if (index == 1){
//                                   var chartIndex = 'FCT';
//                                 }
//                               chart1Data.datasets[index].hidden = !chart1Data.datasets[index].hidden;
//                               chart1Data.options.scales[chartIndex].display = !chart1Data.options.scales[chartIndex].display;
//                               chart1Data.update();
//                             }
                          },
                    scales: {
                      QTY: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        grid:{drawOnChartArea: false, offset: true,}
                        },
                      FCT: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid:{drawOnChartArea: false, offset: true,}
                        }
                      },
                    }}
                  data={chart1Data}
                  style={{ width: "100%", height: "100%" }}
                />
              </Box>
                <Box>
                <ButtonArea title={transLangKey("UI_BF_57")}>
                  <LeftButtonArea>
                    <ButtonGroup>
                      <GridExcelExportButton type="icon" grid="grid1" options={excelExportOptions} />
                    </ButtonGroup>
                  </LeftButtonArea>
                </ButtonArea>
                <Box style={{ height: "100%" }}>
                  <BaseGrid id="grid1" items={grid1Items} afterGridCreate={afterGridCreate1}></BaseGrid>
                </Box>
              </Box>
            </ResultArea>
          </Box>

          <Box style={{height: "100%", display: tabValue === "chart2" ? "block" : "none" }}>
            <ResultArea>
              <Box style={{ height: "100%" }}>
                <Scatter
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: chart2Plugin,
                    }}
                  data={chart2Data}
                  style={{ width: "100%", height: "100%" }}
                  />
              </Box>
              <Box>
                <ButtonArea title={transLangKey("UI_BF_57")}>
                  <LeftButtonArea>
                    <ButtonGroup>
                      <GridExcelExportButton type="icon" grid="grid2" options={excelExportOptions} />
                    </ButtonGroup>
                  </LeftButtonArea>
                </ButtonArea>
                <Box style={{ height: "100%" }}>
                  <BaseGrid id="grid2" items={grid2Items} viewCd={vom.active} username={username} gridCd="UI_BF_57-RST_CPT_03" afterGridCreate={afterGridCreate2}></BaseGrid>
                </Box>
              </Box>
            </ResultArea>
          </Box>

          <Box style={{height: "100%", display: tabValue === "chart3" ? "block" : "none" }}>
            <ResultArea>
              <Box style={{ height: "100%" }}>
                <Bar
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: chart3Plugin,
                    }}
                  data={chart3Data}
                  style={{ width: "100%", height: "100%" }}
                  />
              </Box>
              <Box>
                <ButtonArea title={transLangKey("UI_BF_57")}>
                  <LeftButtonArea>
                    <ButtonGroup>
                      <GridExcelExportButton type="icon" grid="grid3" options={excelExportOptions} />
                    </ButtonGroup>
                  </LeftButtonArea>
                </ButtonArea>
                <Box style={{ height: "100%" }}>
                  <BaseGrid id="grid3" items={grid2Items} viewCd={vom.active} username={username} gridCd="UI_BF_57-RST_CPT_03" ></BaseGrid>
                </Box>
              </Box>
            </ResultArea>
          </Box>
        <StatusArea show={false} message={message}>
          <GridCnt grid="grid3" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")}></GridCnt>
        </StatusArea>
      </ContentInner>
      {itemPopupOpen && (
        <PopSelectItemLvItem
          open={itemPopupOpen}
          onClose={() => {
            setItemPopupOpen(false);
            setAccountPopupOpen(false);
          }}
          confirm={onSetItemCd}
          values={getValues("itemLv")}></PopSelectItemLvItem>
      )}
      {accountPopupOpen && (
        <PopSelectSalesLvAccount
          open={accountPopupOpen}
          onClose={() => {
            setItemPopupOpen(false);
            setAccountPopupOpen(false);
          }}
          confirm={onSetAccountCd}
          values={getValues("salesLv")}></PopSelectSalesLvAccount>
      )}
      <PopPersonalize open={personalizeOpen} onClose={() => setPersonalizeOpen(false)} resetCallback={reloadPrefInfo} viewCd={vom.active} grid={grid3} username={username} authTpId={""}></PopPersonalize>
    </>
  );
}

export default FactorAnalysis;