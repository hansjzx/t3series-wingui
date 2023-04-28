import React, { useState, useEffect } from "react";
import { useForm, watch } from "react-hook-form";
import { PolarArea, Line, Chart } from "react-chartjs-2";
import { ButtonGroup, IconButton, Tabs, Tab, Box } from "@mui/material";
import { BoxPlotController, BoxAndWiskers } from "@sgratzl/chartjs-chart-boxplot";
import { ContentInner, ViewPath, ResultArea, SearchArea, StatusArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow, SplitPanel, InputField, BaseGrid, GridCnt, useViewStore, zAxios, useStyles, GridExcelExportButton, GridExcelImportButton } from "@zionex/wingui-core/src/common/imports";
import PopSelectItemLvItem from "../../common/PopSelectItemLvItem";
import PopSelectSalesLvAccount from "../../common/PopSelectSalesLvAccount";

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler, BoxPlotController, BoxAndWiskers);
import "./css/salesanalysis.css";

const excelExportOptions = {
  lookupDisplay: false,
  // allColumns: true,
  separateRows: true,
  footer: "default",
  headerDepth: 2,
  importExceptFields: { 0: "id" },
};

let grid1Items = [
  { name: "ID", dataType: "string", headerText: "ID", visible: false, editable: false, width: "0" },
  { name: "ACCOUNT_CD", dataType: "string", headerText: "ACCOUNT_CD", visible: true, editable: false, width: "100", mergeRule: { criteria: "value" } },
  { name: "ACCOUNT_NM", dataType: "string", headerText: "ACCOUNT_NM", visible: true, editable: false, width: "100", mergeRule: { criteria: "value" } },
  { name: "ITEM_CD", dataType: "string", headerText: "ITEM_CD", visible: true, editable: false, width: "100", mergeRule: { criteria: "value" } },
  { name: "ITEM_NM", dataType: "string", headerText: "ITEM_NM", visible: true, editable: false, width: "100", mergeRule: { criteria: "value" } },
  { name: "SUM_AMT", dataType: "number", headerText: "AMT", visible: true, editable: false, width: "50" },
  { name: "SUM_QTY", dataType: "number", headerText: "QTY", visible: true, editable: false, width: "50" },
  { name: "AVG_QTY", dataType: "number", headerText: "AVG", visible: true, editable: false, width: "50" },
  { name: "MEDIAN", dataType: "number", headerText: "MEDIAN", visible: true, editable: false, width: "50" },
  { name: "STD_QTY", dataType: "number", headerText: "STDDEV", visible: true, editable: false, width: "50" },
  { name: "MIN_QTY", dataType: "number", headerText: "MIN_VALUE", visible: true, editable: false, width: "50" },
  { name: "MAX_QTY", dataType: "number", headerText: "MAX_VALUE", visible: true, editable: false, width: "50" },
  { name: "FILL_RATE", dataType: "number", headerText: "FILL_RATE", visible: true, editable: false, width: "50" },
  { name: "CNT", dataType: "number", headerText: "CNT", visible: false, editable: false, width: "50" },
//   { name: "ACCT_LEAF_YN", dataType: "string", headerText: "ACCT_LEAF_YN", visible: false, editable: false, width: "50" },
//   { name: "ITEM_LEAF_YN", dataType: "string", headerText: "ITEM_LEAF_YN", visible: false, editable: false, width: "50" },
  { name: "MIN_DATE", dataType: "datetime", headerText: "QTY_START_DATE", visible: true, editable: false, width: "50", format: "yyyy-MM-dd" },
  { name: "MAX_DATE", dataType: "datetime", headerText: "QTY_END_DATE", visible: true, editable: false, width: "50", format: "yyyy-MM-dd" },
];
let resultChartData = [];

function SalesAnalysis() {
  const classes = useStyles(); //

  //1. view page data store
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);

  //2. grid Object
  const [grid1, setGrid1] = useState(null);

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
      range: "-3",
      startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 3)),
      endDate: new Date(),
      bucket: "W",
      bucket2: "Q",
    },
  });

  const [option1, setOption1] = useState([]);
  const [option2, setOption2] = useState([]);
  const [option3, setOption3] = useState([]);

  const [dialogOpen1, setDialogOpen1] = useState(false);
  const [dialogOpen2, setDialogOpen2] = useState(false);

  const [tabValue, setTabValue] = React.useState("chart1");
  const [chart1Plugin, setChart1Plugin] = useState({});
  const [chart2Plugin, setChart2Plugin] = useState({});
  const labels = [];
  const labelColors = ["#0069a5", "#0098ee", "#7bd2f6", "#ffb800", "#ff8517", "#e34a00"];
  let checkedItems = [];
  const [chart1Data, setChart1Data] = useState({
    labels,
    datasets: [],
  });
  const [chart2Data, setChart2Data] = useState({
    labels,
    datasets: [],
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
    {
      name: "save",
      action: (e) => {
        saveData(grid1);
      },
      visible: false,
      disable: false,
    },
    {
      name: "refresh",
      action: (e) => {
        refresh();
      },
      visible: true,
      disable: false,
    },
  ];

  // 그리드 Object 초기화
  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, "grid1");
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        setGrid1(grdObj1);
      }
    }
  }, [viewData]);

  // 범위 변경시 적용범위 날짜 변경
  useEffect(() => {
    if (getValues("range") === "-1") {
      setValue("startDate", new Date(new Date().setFullYear(new Date().getFullYear() - 1)));
      setValue("endDate", getValues("endDate"));
    } else if (getValues("range") === "-3") {
      setValue("startDate", new Date(new Date().setFullYear(new Date().getFullYear() - 3)));
      setValue("endDate", getValues("endDate"));
    }
  }, [watch("range")]);

  //bucket 변경 1
  useEffect(() => {
    if (grid1 && resultChartData.length > 0) {
      createChart1(grid1);
//       onSubmit();
      loadGrid(resultChartData);
    }
  }, [watch("bucket")]);

  //bucket 변경 2
  useEffect(() => {
    if (grid1 && resultChartData.length > 0) {
      createChart2(grid1);
    }
  }, [watch("bucket2")]);

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
    if (grid1) {
      setViewInfo(vom.active, "globalButtons", globalButtons);
      setItemLv();
      setSalesLv();

    }
  }, [grid1]);

  const tabChange = async (event, newValue) => {
    setTabValue(newValue);
  };

  /** 이벤트 핸들러 */
  const onSubmit = (data) => {
//     loadData(data);
    loadDataChart1();
  };

  function refresh() {
    reset();
    grid1.dataProvider.clearRows();
    setChart1Data("");
    setChart2Data("");
    setItemLv();
    setSalesLv();
    setChart1Plugin({
      title: { display: false },
      legend: { display: false },
    });
    setChart2Plugin({
      title: { display: false },
      legend: { display: false },
    });
  }

  const afterGridCreate1 = (gridObj, gridView, dataProvider) => {
    setGrid1(gridObj);
    gridObj.gridView.displayOptions.fitStyle = "fill";
    gridObj.gridView.setCheckBar({ visible: true });
    gridObj.gridView.orderBy(["ITEM_CD", "SUM_AMT"], ["ascending","descending"]);

    gridObj.gridView.onCellClicked = function (grid, index, itemIndex) {
      gridObj.gridView.commit(true);

      if (resultChartData.length > 0) {
        createChart1(gridObj);
        createChart2(gridObj);
      }
    };

    //전체 선택/해제
    gridObj.gridView.onItemAllChecked = function (grid, checked) {
      if (resultChartData.length > 0) {
        createChart1(gridObj);
      }
    };

    //set check row background
    gridObj.gridView.setRowStyleCallback(function (grid, item, fixed) {
      if (grid.isCheckedItem(item.index)) {
        return "check-color";
      }
    });
  };

//   function loadData() {
//     let dataArr;
//     if (!getValues("itemCd")) {
//       showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_0017"), { close: false });
//       return;
//     }
//     let fromDate = new Date(getValues("startDate"));
//     let toDate = new Date(getValues("endDate"));
//     let param = new URLSearchParams();
//     param.append("BUCKET", getValues("bucket") ? getValues("bucket") : "W");
//     param.append("S_DATE", fromDate.format("yyyy-MM-ddT00:00:00"));
//     param.append("E_DATE", toDate.format("yyyy-MM-ddT00:00:00"));
//     param.append("ITEM_CD", getValues("itemCd") ? getValues("itemCd") : "");
//     param.append("ITEM_LV_ID", getValues("itemLv") ? getValues("itemLv") : "");
//     param.append("ACCT_LV_ID", getValues("salesLv") ? getValues("salesLv") : "");
//     param.append("ACCOUNT_CD", getValues("accountCd") ? getValues("accountCd") : "");
//     zAxios({
//       method: "post",
//       url: baseURI() + "engine/dp/SRV_GET_SP_UI_BF_58_Q1",
//       data: param,
//     })
//       .then(function (res) {
//         if (res.status === gHttpStatus.SUCCESS) {
//           let dataArr = [];
//           dataArr = res.data.RESULT_DATA;
//           grid1.dataProvider.fillJsonData(dataArr);
//
//           if (grid1.dataProvider.getRowCount() == 0) {
//             grid1.gridView.setDisplayOptions({ showEmptyMessage: true, emptyMessage: transLangKey("MSG_NO_DATA") });
//           }
//           loadDataChart1();
//         }
//       })
//       .catch(function (err) {
//         console.log(err);
//       });
//   }

  // popup Open(item)
  function openPopup1() {
    setDialogOpen1(true);
    setDialogOpen2(false);
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
  function openPopup2() {
    setDialogOpen1(false);
    setDialogOpen2(true);
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

  const d3 = require("d3");
  const Q1 = (arr) => d3.quantile(arr, 0.25);
  const Median = (arr) => d3.quantile(arr, 0.5);
  const Q3 = (arr) => d3.quantile(arr, 0.75);
  const arrMax = (arr) => Math.max(...arr);
  const arrMin = (arr) => Math.min(...arr);
  const arrAvg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

  function loadGrid(chartData){
    let data = Object.assign([], chartData);
    let grouped = "";
    let sum_rt = [];
    let result = [];
    let bucket = getValues("bucket");

    const groupBySum = (array, keys, sumKey) => {
      const groupedData = array.reduce((acc, current) => {
        const groupKey = keys.map(key => current[key]).join('//');
        if (!acc[groupKey]) {
          acc[groupKey] = keys.reduce((obj, col) => {
            obj[col] = current[col];
            return obj;
          }, {});
          sumKey.forEach(col => {
            acc[groupKey][col] = 0;
          });
        }
        sumKey.forEach(col => {
          acc[groupKey][col] += current[col];
        });
        return acc;
      }, {});

      return Object.values(groupedData);
    };

    if (bucket == "Y") {
      sum_rt = groupBySum(data, ["ITEM_CD", "ITEM_NM", "ACCOUNT_CD", "ACCOUNT_NM", "YYYY"], ["QTY", "AMT"]);
    } else if (bucket == "Q") {
      sum_rt = groupBySum(data, ["ITEM_CD", "ITEM_NM", "ACCOUNT_CD", "ACCOUNT_NM", "YYYYQTR"], ["QTY", "AMT"]);
    } else if (bucket == "M") {
      sum_rt = groupBySum(data, ["ITEM_CD", "ITEM_NM", "ACCOUNT_CD", "ACCOUNT_NM","YYYYMM"], ["QTY", "AMT"]);
    } else if (bucket == "W") {
      sum_rt = groupBySum(data, ["ITEM_CD", "ITEM_NM", "ACCOUNT_CD", "ACCOUNT_NM", "WK52"], ["QTY", "AMT"]);
    }

    const groupByCalculateStatistics = (array, keys, qtyKey, amtKey) => {
      const groupedData = array.reduce((acc, current) => {
        const groupKey = keys.map(key => current[key]).join('//');
        const group = acc[groupKey] = acc[groupKey] || {
          groupKey,
          values1: [],
          values2: [],
          sum: 0,
          amtSum: 0,
          count: 0,
          actualCount:0,
          avg: 0,
          stdev: 0,
          median: 0,
          min: Number.MAX_SAFE_INTEGER,
          max: Number.MIN_SAFE_INTEGER,
        };
        group.values1.push(current[qtyKey]);
        group.values2.push(current[amtKey]);
        group.sum += current[qtyKey];
        group.amtSum += current[amtKey];
        if (current[qtyKey] > 0) {
          group.actualCount++;
        }
        group.count++;
        group.fill = group.actualCount / group.count * 100;
        group.avg = group.sum / group.count;
        group.min = Math.min(group.min, current[qtyKey]);
        group.max = Math.max(group.max, current[qtyKey]);
        return acc;
      }, {});

      for (const groupKey in groupedData) {
        const group = groupedData[groupKey];
        const values = group.values1;
        values.sort((a, b) => a - b);
        const half = Math.floor(values.length / 2);
        group.median = values.length % 2 === 0 ? (values[half - 1] + values[half]) / 2 : values[half];
        group.stdev = Math.sqrt(values.reduce((sum, value) => sum + Math.pow(value - group.avg, 2), 0) / values.length);
      }

      return Object.values(groupedData);
    };

    grouped = groupByCalculateStatistics(sum_rt, ["ITEM_CD", "ITEM_NM", "ACCOUNT_CD", "ACCOUNT_NM"], "QTY", "AMT");
    grouped = grouped
              .filter(function (row) {
                return (row.sum > 0);
              });
    for (let j=0; j < grouped.length; j++) {
      let groupKey = grouped[j]['groupKey'].split('//')
      let rowItem = data.filter(function (row) {
                          return (row.ITEM_CD == groupKey[0]) & (row.ACCOUNT_CD == groupKey[2]) & (row.QTY > 0);
                        });
      let res = {ITEM_CD: groupKey[0],
                 ITEM_NM: groupKey[1],
                 ACCOUNT_CD: groupKey[2],
                 ACCOUNT_NM: groupKey[3],
                 SUM_QTY: grouped[j]['sum'],
                 SUM_AMT: grouped[j]['amtSum'],
                 AVG_QTY: grouped[j]['avg'],
                 MEDIAN: grouped[j]['median'],
                 STD_QTY: grouped[j]['stdev'],
                 MIN_QTY: grouped[j]['min'],
                 MAX_QTY: grouped[j]['max'],
                 FILL_RATE: grouped[j]['fill'],
                 CNT: grouped[j]['count'],
                 MIN_DATE: rowItem[0].DAT,
                 MAX_DATE: rowItem[rowItem.length-1].DAT
                };
      result.push(res);
    }
    grid1.dataProvider.fillJsonData(result);
    grid1.gridView.checkItems(checkedItems, true);
    if (grid1.dataProvider.getRowCount() == 0) {
      grid1.gridView.setDisplayOptions({ showEmptyMessage: true, emptyMessage: transLangKey("MSG_NO_DATA") });
    }
  }

  function loadDataChart1() {
    if (!getValues("itemCd")) {
      showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_0017"), { close: false });
      return;
    }
    let fromDate = new Date(getValues("startDate"));
    let toDate = new Date(getValues("endDate"));

    let param = new URLSearchParams();
    param.append("S_DATE", fromDate.format("yyyy-MM-ddT00:00:00"));
    param.append("E_DATE", toDate.format("yyyy-MM-ddT00:00:00"));
    param.append("ITEM_CD", getValues("itemCd") ? getValues("itemCd") : "");
    param.append("ACCOUNT_CD", getValues("accountCd") ? getValues("accountCd") : "");
    param.append("ITEM_LV_ID", getValues("itemLv") ? getValues("itemLv") : "");
    param.append("ACCT_LV_ID", getValues("salesLv") ? getValues("salesLv") : "");
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_BF_58_CHART_Q1",
      data: param,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          grid1.gridView.setCurrent({ itemIndex: 0 });
          grid1.gridView.getCurrent().itemIndex;
          resultChartData = res.data.RESULT_DATA;
          loadGrid(resultChartData);
          createChart1(grid1);
          createChart2(grid1);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function createChart1(grid) {
    let chartArr = {};
    let step_size = 1;
    let acct_leaf = "Y";
    let item_leaf = "Y";
    let bucket = getValues("bucket");
    if (bucket == "W") {
      step_size = 3;
    }
    checkedItems = grid.gridView.getCheckedItems();
    let checkedLength = checkedItems.length;
    let data = Object.assign([], resultChartData);

    // || checkedLength === grid.dataProvider.getRowCount() - 전체 선택 제한 해제
    if (checkedLength == 0 ) {
      let itemIndex = grid.gridView.getCurrent().itemIndex;
      if (itemIndex === -1) {
        itemIndex = 0;
      }
      let account_cd = grid.gridView.getValue(itemIndex, "ACCOUNT_CD");
      let item_cd = grid.gridView.getValue(itemIndex, "ITEM_CD");

      let account_nm = grid.gridView.getValue(itemIndex, "ACCOUNT_NM");
      let item_nm = grid.gridView.getValue(itemIndex, "ITEM_NM");
      setChart1Plugin({
        title: {
          display: true,
          text: account_nm + " - " + item_nm,
        },
        legend: {
          position: "right",
        },
      });
      data = data
        .filter(function (row) {
          return (row.ITEM_CD == item_cd) & (row.ACCOUNT_CD == account_cd);
        })
        .map(function (row) {
          return row;
        });

      let sum_rt = [];
      //let avg_rt = [];
      //let std_rt = [];
      let sigma = [];
      let sum_avg_rt = [];

      let categories = [];
      let seriesList = [];
      let grouped = "";
      if (bucket == "Y") {
        grouped = groupBy(data, (dt) => dt.YYYY);
      } else if (bucket == "Q") {
        grouped = groupBy(data, (dt) => dt.YYYYQTR);
      } else if (bucket == "W") {
        grouped = groupBy(data, (dt) => dt.WK52);
      } else if (bucket == "M") {
        grouped = groupBy(data, (dt) => dt.YYYYMM);
      } else if (bucket == "D") {
        grouped = groupBy(data, (dt) => dt.DOW);
      }

      for (let [key, value] of grouped) {
        let sum_qty = 0;
        let tmp_data = [];
        for (let j = 0; j < value.length; j++) {
          sum_qty += value[j]["QTY"];
          tmp_data.push(value[j]["QTY"]);
        }
        sum_rt.push(sum_qty);
        //avg_rt.push(sum_qty / value.length);
        //std_rt.push(uibf58_getSD(tmp_data));
        if (bucket === "W" | bucket === "M") {
          key = key.slice(0, 4).concat('-', key.slice(-2));
        }
        categories.push(key);
      }

      if ((acct_leaf == "Y") & (item_leaf == "Y")) {
        let total_std = getSD(sum_rt);
        let total_avg = arrAvg(sum_rt);

        for (let n = 1; n < 4; n++) {
          sigma = [];
          for (let i = 0; i < sum_rt.length; i++) {
            let lower_sigma = total_avg - total_std * n;
            let upper_sigma = total_avg + total_std * n;
            if (lower_sigma < 0) {
              lower_sigma = 0;
            }

            sigma.push([Math.round(lower_sigma * 100) / 100, Math.round(upper_sigma * 100) / 100]);
            if (n == 3) {
              sum_avg_rt.push(Math.round(total_avg * 100) / 100);
            }
          }
          seriesList.push({
            label: n.toString() + "-sigma",
            data: sigma,
            fill: true,
            backgroundColor: "rgba(50,191,250,0.2)",
            borderColor: "rgba(50,191,250,0.2)",
            pointRadius: 0,
            order: n + 2,
          });
        }
        seriesList.push({
          label: transLangKey("AVG"),
          data: sum_avg_rt,
          backgroundColor: "#ffb800",
          borderColor: "#ffb800",
          order: 0,
        });
      }

      seriesList.push({
        label: transLangKey("TOTAL_AMOUNT_QTY"),
        data: sum_rt,
        backgroundColor: "#ff8517",
        borderColor: "#ff8517",
        order: 1,
      });

      chartArr = {
        labels: categories,
        datasets: seriesList,
      };
      setChart1Data(chartArr);
    } else {
      let item_acct = [];
      let checkedRowsTitle = [];
      let unique_bucket = [];
      let seriesList = [];
      let checkedIndex = getKeyByValue(checkedItems, true);
      setChart1Plugin({
        title: {
          display: false,
        },
        legend: {
          position: "top",
        },
      });

      if (bucket == "Y") {
        var buckets = data.map(function (row) {
          return row["YYYY"];
        });
      } else if (bucket == "Q") {
        var buckets = data.map(function (row) {
          return row["YYYYQTR"];
        });
      } else if (bucket == "W") {
        var buckets = data.map(function (row) {
          return row["WK52"];
        });
      } else if (bucket == "M") {
        var buckets = data.map(function (row) {
          return row["YYYYMM"];
        });
      } else if (bucket == "D") {
        var buckets = data.map(function (row) {
          return row["DOW"];
        });
      }

      buckets.forEach((element) => {
        if (!unique_bucket.includes(element)) {
          unique_bucket.push(element);
        }
      });

      checkedItems.map((row) => {
        let account_cd = grid.gridView.getValue(row, "ACCOUNT_CD");
        let item_cd = grid.gridView.getValue(row, "ITEM_CD");
        let account_nm = grid.gridView.getValue(row, "ACCOUNT_NM");
        let item_nm = grid.gridView.getValue(row, "ITEM_NM");
        item_acct.push(account_cd + "//" + item_cd);
        checkedRowsTitle.push(account_nm + "//" + item_nm);
      });

      for (let i = 0; i < item_acct.length; i++) {
        let acct_cd = item_acct[i].split("//")[0];
        let item_cd = item_acct[i].split("//")[1];
        let rt = [];

        let qty = data
          .filter(function (row) {
            return (row.ITEM_CD == item_cd) & (row.ACCOUNT_CD == acct_cd);
          })
          .map(function (row) {
            return row;
          });
        var grouped = "";

        if (bucket == "Y") {
          grouped = groupBy(qty, (dt) => dt.YYYY);
        } else if (bucket == "Q") {
          grouped = groupBy(qty, (dt) => dt.YYYYQTR);
        } else if (bucket == "W") {
          grouped = groupBy(qty, (dt) => dt.WK52);
        } else if (bucket == "M") {
          grouped = groupBy(qty, (dt) => dt.YYYYMM);
        } else if (bucket == "D") {
          grouped = groupBy(qty, (dt) => dt.DOW);
        }

        for (var [key, value] of grouped) {
          var sum_qty = 0;
          for (var j = 0; j < value.length; j++) {
            sum_qty += value[j]["QTY"];
          }
          rt[unique_bucket.indexOf(key)] = sum_qty;
        }

        let colorIdx = i === 0 ? 0 : i % 6;
        seriesList.push({
          data: rt,
          label: checkedRowsTitle[i],
          backgroundColor: labelColors[colorIdx],
          borderColor: labelColors[colorIdx],
        });
      }

      chartArr = {
        labels: unique_bucket,
        datasets: seriesList,
      };
      setChart1Data(chartArr);
    }
  }

  function createChart2(grid) {
    let grouped = "";
    let categories = [];
    let result_data = [];

    let category_name = {
      Q: ["1Q", "2Q", "3Q", "4Q"],
      W: range(53),
      M: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      D: ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
    };

    //let data = dataArr.filter((row) => row.ITEM_CD === getValues('itemCd') && row.ACCOUNT_CD === getValues('accountCd'));
    let bucket = getValues("bucket2");
    let data = Object.assign([], resultChartData);
    let itemIndex = grid.gridView.getCurrent().itemIndex;
    if (itemIndex === -1) {
      itemIndex = 0;
    }
    let account_cd = grid.gridView.getValue(itemIndex, "ACCOUNT_CD");
    let item_cd = grid.gridView.getValue(itemIndex, "ITEM_CD");

    let account_nm = grid.gridView.getValue(itemIndex, "ACCOUNT_NM");
    let item_nm = grid.gridView.getValue(itemIndex, "ITEM_NM");
    setChart2Plugin({
      title: {
        display: true,
        text: account_nm + " - " + item_nm,
      },
      legend: {
        display: false,
      },
    });

    data = data
      .filter(function (row) {
        return (row.ITEM_CD == item_cd) & (row.ACCOUNT_CD == account_cd);
      })
      .map(function (row) {
        return row;
      });

    if (bucket == "Y") {
      grouped = groupBy(data, (dt) => dt.YYYY);
    } else if (bucket == "Q") {
      grouped = groupBy(data, (dt) => dt.QTR);
    } else if (bucket == "W") {
      grouped = groupBy(data, (dt) => dt.ISO_WK);
    } else if (bucket == "M") {
      grouped = groupBy(data, (dt) => dt.MM);
    } else if (bucket == "D") {
      grouped = groupBy(data, (dt) => dt.DOW);
    }

    for (var [key, value] of grouped) {
      var rt_tmp = [];
      for (var j = 0; j < value.length; j++) {
        rt_tmp.push(value[j]["QTY"]);
      }

      if (bucket == "Y") {
        categories.push(key);
        //result_data.push([data_lower, data_Q1, data_median, data_mean, data_Q3, data_upper, rt_tmp]);
        result_data.push(rt_tmp);
      } else {
        categories[parseInt(key, 10) - 1] = category_name[bucket][parseInt(key, 10) - 1];
        result_data[parseInt(key, 10) - 1] = rt_tmp;
        //result_data[parseInt(key, 10) - 1] = [data_lower, data_Q1, data_median, data_mean, data_Q3, data_upper, rt_tmp];
      }
    }

    let chartArr = {
      labels: categories,
      datasets: [
        {
          label: "Dataset 1",
          backgroundColor: "rgba(255,0,0,0.5)",
          borderColor: "red",
          borderWidth: 1,
          outlierColor: "#999999",
          padding: 10,
          itemRadius: 0,
          data: result_data,
        },
      ],
    };
    setChart2Data(chartArr);
  }

  function getKeyByValue(object, value) {
    return Object.keys(object).filter((key) => object[key] === value);
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

  function range(size) {
    return [...Array(size).keys()].map((key) => (key + 1).toString());
  }

  // Standard deviation
  function getSD(data) {
    const m = arrAvg(data);
    return Math.sqrt(
      data.reduce(function (sq, n) {
        return sq + Math.pow(n - m, 2);
      }, 0) /
        (data.length - 1)
    );
  }

  function randomValues(count, min, max) {
    const delta = max - min;
    return Array.from({ length: count }).map(() => Math.random() * delta + min);
  }

  /** 이벤트 핸들러 끝 */

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            {/* direction : row, column */}
            <InputField type="datetime" label={transLangKey("FROM_DATE")} name="startDate" dateformat="yyyy-MM-dd" control={control} />
            <InputField type="datetime" label={transLangKey("TO_DATE")} name="endDate" dateformat="yyyy-MM-dd" control={control} />
            <InputField
              type="radio"
              name="range"
              control={control}
              useLabel={false}
              options={[
                {
                  label: "1 Year",
                  value: "-1",
                },
                {
                  label: "3 Year",
                  value: "-3",
                },
              ]}
            />
          </SearchRow>
          <SearchRow>
            <InputField type="select" name="itemLv" label={transLangKey("ITEM_LV")} control={control} options={option2} />
            <InputField
              type="action"
              name="itemCd"
              label={transLangKey("ITEM_CD")}
              title={transLangKey("SEARCH")}
              onClick={() => {
                openPopup1();
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
                openPopup2();
              }}
              control={control}>
              <Icon.Search />
            </InputField>
            <InputField name="accountNm" label={transLangKey("ACCOUNT_NM")} control={control} />
          </SearchRow>
        </SearchArea>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={tabChange} indicatorColor="primary">
            <Tab label={transLangKey("SALES_HISTORY")} value="chart1" />
            <Tab label={transLangKey("SALES_DISTRIBUTION")} value="chart2" />
          </Tabs>
        </Box>
        <ResultArea sizes={[50, 50]} direction={"vertical"}>
          <Box style={{position: "relative"}}>
            <Box style={{height: "100%", display: tabValue === "chart1" ? "block" : "none" }}>
              <Box>
                <InputField
                  type={"radio"}
                  width={"none"}
                  name={"bucket"}
                  control={control}
                  options={[
                    {
                      label: "Years",
                      value: "Y",
                    },
                    {
                      label: "Quarters",
                      value: "Q",
                    },
                    {
                      label: "Months",
                      value: "M",
                    },
                    {
                      label: "Weeks",
                      value: "W",
                    },
                  ]}
                  useLabel={false}
                />
              </Box>
              <Box style={{height: "calc(100% - 53px)"}}>
                <Line
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: chart1Plugin,
                  }}
                  data={chart1Data}
                  style={{ width: "100%", height: "100%" }}
                />
              </Box>
            </Box>
            <Box style={{ height: "100%", display: tabValue === "chart2" ? "block" : "none" }}>
              <Box>
                <InputField
                  type={"radio"}
                  name={"bucket2"}
                  control={control}
                  options={[
                    {
                      label: "Years",
                      value: "Y",
                    },
                    {
                      label: "Quarters",
                      value: "Q",
                    },
                    {
                      label: "Months",
                      value: "M",
                    },
                    {
                      label: "Weeks",
                      value: "W",
                    },
                    {
                      label: "DayofWeek",
                      value: "D",
                    },
                  ]}
                  useLabel={false}
                  width={"none"}
                />
              </Box>
              <Box style={{height: "calc(100% - 53px)"}}>
                <Chart
                  type="boxplot"
                  legend={{
                    display: false,
                  }}
                  data={chart2Data}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: chart2Plugin,
                  }}
                  style={{ width: "100%", height: "100%"}}
                />
              </Box>
            </Box>
          </Box>
          <Box>
            <ButtonArea title={transLangKey("UI_BF_58")}>
              <LeftButtonArea>
                <ButtonGroup>
                  <GridExcelExportButton type="icon" grid="grid1" options={excelExportOptions} />
                </ButtonGroup>
              </LeftButtonArea>
              <RightButtonArea></RightButtonArea>
            </ButtonArea>
            <Box style={{ height: "calc(100% - 53px)" }}>
              <BaseGrid id="grid1" items={grid1Items} viewCd={vom.active} gridCd={vom.active + "-RST_CPT_01"}
              afterGridCreate={afterGridCreate1}></BaseGrid>
            </Box>
          </Box>
        </ResultArea>
        <StatusArea show={false} message={message}>
          <GridCnt grid="grid1" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")}></GridCnt>
        </StatusArea>
      </ContentInner>
      {dialogOpen1 && (
        <PopSelectItemLvItem
          open={dialogOpen1}
          onClose={() => {
            setDialogOpen1(false);
            setDialogOpen2(false);
          }}
          confirm={onSetItemCd}
          values={getValues("itemLv")}></PopSelectItemLvItem>
      )}
      {dialogOpen2 && (
        <PopSelectSalesLvAccount
          open={dialogOpen2}
          onClose={() => {
            setDialogOpen1(false);
            setDialogOpen2(false);
          }}
          confirm={onSetAccountCd}
          values={getValues("salesLv")}></PopSelectSalesLvAccount>
      )}
    </>
  );
}

export default SalesAnalysis;
