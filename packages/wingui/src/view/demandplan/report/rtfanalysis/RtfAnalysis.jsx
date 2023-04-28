import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { Box } from "@mui/material";
import { BaseGrid, ButtonArea, ContentInner, GridCnt, GridExcelExportButton, InputField, LeftButtonArea, ResultArea, RightButtonArea, SearchArea, StatusArea, useUserStore, useViewStore, zAxios } from "@zionex/wingui-core/src/common/imports";
import { transLangKey, vom } from "@wingui";
import { dimensionItems, isEmptyArray, labelColors, loadOption } from "@wingui/view/demandplan/DpUtil";
import PopPersonalize from "@wingui/view/common/PopPersonalize";
import PopDPAccountTree from "@wingui/view/demandplan/common/PopAccountTree";
import PopDPItemTree from "@wingui/view/demandplan/common/PopItemTree";
import { BarController, BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineController, LineElement, PointElement, Title, Tooltip } from "chart.js";
import { Chart } from "react-chartjs-2";
import wingui3 from "@wingui/component/grid/gridCustom";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, LineController, BarController);

let grid1Items = [
  ...dimensionItems,
  ...[
    { name: "ITEM", dataType: "string", visible: false, editable: false, width: "120", type: "string" },
    { name: "ACCOUNT", dataType: "string", visible: false, editable: false, width: "120", type: "string" },
    { name: "CATEGORY", dataType: "string", headerText: "Measure", visible: true, editable: false, width: "120", title: "Measure", type: "string", lang: true, filterable: true },
    { name: "DATE", dataType: "double", visible: true, editable: false, width: "70", type: "double", format: "#,###.##", gridSummaryExp: "sum", groupSummaryExp: "sum", iteration: { prefix: "DATE_", prefixRemove: "true", delimiter: "-", postfix: ",VALUE", postfixRemove: "true" } },
  ],
];
let rtfDemands = [];
let versionOptionData;
function RtfAnalysis(props) {
  const history = useHistory();
  const [username] = useUserStore((state) => [state.username]);
  //1. view 페이지 데이타 store
  const [message, setMessage] = useState();
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [versionOption, setVersionOption] = useState([]);
  //2. 그리드 Object
  const [grid1, setGrid1] = useState(null);

  const maxRateVal = useRef(100);
  const chartTitle = useRef("");

  //4. FORM 데이터 처리
  const {
    reset,
    getValues,
    setValue,
    control,
    formState: {},
  } = useForm({
    defaultValues: {
      BUCK: "M",
      //STRT_DATE: [new Date(new Date().setMonth(new Date().getMonth() - 2)), new Date()],
      ITEM_CD: "", //43622
      ITEM_NM: "",
      ACCT_CD: "",
      ACCT_NM: "",
      OPTION: ["Q"],
      ITEM_ATTR_01: "",
      ITEM_ATTR_02: "",
      ITEM_ATTR_03: "",
      ITEM_ATTR_04: "",
      ITEM_ATTR_05: "",
      ACCT_ATTR_01: "",
      ACCT_ATTR_02: "",
      ACCT_ATTR_03: "",
    },
  });

  const [chart1Plugin, setChart1Plugin] = useState({
    legend: {
      display: true,
      position: "top",
    },
    title: {
      display: true,
      text: "",
    },
  });

  const [chart1Data, setChart1Data] = useState({
    labels: [],
    datasets: [
      {
        label: [],
        data: [],
        backgroundColor: labelColors,
      },
    ],
  });

  const [bucketOption, setBucketOption] = useState([]);
  const [personalizeOpen, setPersonalizeOpen] = useState(false);
  const [popItemOpen, setPopItemOpen] = useState(false);
  const [popAccountOpen, setPopAccountOpen] = useState(false);

  const globalButtons = [
    {
      name: "search",
      action: () => {
        loadDataGrid1();
      },
      visible: true,
      disable: false,
    },
    {
      name: "save",
      action: () => {},
      visible: false,
      disable: false,
    },
    {
      name: "refresh",
      action: () => {
        reset();
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

  useEffect(() => {
    if (grid1) {
      setViewInfo(vom.active, "globalButtons", globalButtons);
      loadBucket();
      loadVersion();
    }
  }, [grid1]);

  const afterGridCreate = (gridObj) => {
    //, gridView, dataProvider
    gridObj.gridView.addCellStyle(gridObj.gridView, "redStyle", { background: "#00ff00" });

    setGrid1(gridObj);
    setOptionsGrid1(gridObj);
    initChart(gridObj);
  };

  const setAccountCd = (items) => {
    setValue("ACCOUNT_CD", items.ACCOUNT_CD ? items.ACCOUNT_CD : items.SALES_LV_CD);
    setValue("ACCOUNT_NM", items.ACCOUNT_NM) ? items.ACCOUNT_NM : items.SALES_LV_NM;
  };

  function setItemCd(items) {
    setValue("ITEM_CD", items.ITEM_CD ? items.ITEM_CD : items.ITEM_LV_CD);
    setValue("ITEM_NM", items.ITEM_NM ? items.ITEM_NM : items.ITEM_LV_NM);
  }

  /** 이벤트 핸들러 */

  const setOptionsGrid1 = (grdObj) => {
    setVisibleProps(grdObj, true, true, false);
    // grid1.gridView.setHeader({height: 50 });
    grdObj.gridView.setDisplayOptions({
      fitStyle: "fill",
    });

    grdObj.gridView.onCurrentRowChanged = (grid) => {
      //, oldRow, newRow
      var dataProvider = grid.getDataSource();
      let selectedRowIndex = grid.getCurrent().dataRow;
      if (selectedRowIndex < 0) return;

      var dateFields = grid.getColumnNames(true, true).filter((row) => {
        return row.includes("DATE_");
      });
      createChart(dateFields, getChartSeriesRows(grid, dataProvider, selectedRowIndex, dateFields));
    };
    grdObj.gridView.onCellClicked = (grid, clickData) => {
      if (clickData.cellType === "data") {
        const itemIndex = clickData.itemIndex;
        if (grid.getValue(itemIndex, "CATEGORY") === "RTF" && clickData.column.includes("DATE_")) {
          // 값이 적은 cellStyle을 미리 적용해둬서, 적은 cell에만 click event태우게 하거나?
          let selectedDemandId = rtfDemands.filter((row) => row.ITEM === grid.getValue(itemIndex, "ITEM") && row.ACCOUNT === grid.getValue(itemIndex, "ACCOUNT"))[0];
          const selectedKey = clickData.column.replace(",VALUE", ",DMND_ID");
          if (Object.keys(selectedDemandId).includes(selectedKey) && selectedDemandId[selectedKey] !== null) {
            history.push({
              pathname: "/masterplan/analysisreport/demandordertracking",
              state: {
                params: {
                  VERSION_ID: versionOptionData.find((item) => item.value === getValues("versionId")).data.SIMUL_VER_ID,
                  DMND_ID: selectedDemandId[selectedKey],
                },
              },
            });
          }
        }
      }
    };
  };

  const createChart = (dateFields, seriesRows) => {
    const buckType = getValues("BUCK");

    let lables = dateFields.map(function (row) {
      row = row.replace("DATE_", "");
      switch (buckType) {
        case "Y":
          return row.split("-")[0];
        case "Q":
          return row.split("-")[0] + "-" + row.split("-")[1];
        case "M":
          return row.split("-")[0] + "-" + row.split("-")[1];
        default:
          return row.split("-")[1] + "/" + row.split("-")[2];
      }
    });

    let newchart1Plugin = {
      legend: {
        display: true,
        position: "right",
      },
      title: {
        display: true,
        text: chartTitle.current,
      },
    };

    setChart1Plugin(newchart1Plugin);

    let newChart1Data = {
      labels: lables,
      datasets: seriesRows,
    };

    setChart1Data(newChart1Data);
  };

  /*  function getChartAllSeriesRows(data, dateFields) {
    chartTitle.current = "";

    var chartData = data.reduce(function (rv, x) {
      var newArray = [];
      for (var i = 0, n = dateFields.length; i < n; i++) {
        newArray.push(x[dateFields[i]]);
      }
      (rv[x.CATEGORY] = rv[x.CATEGORY] || []).push(newArray);
      return rv;
    }, {});

    var chartSeries = [];
    var isRate;
    var valueCnt = 1;
    maxRateVal.current = 100;
    let colorIdx = 0;
    for (const [key, value] of Object.entries(chartData)) {
      isRate = key.includes("RATE");
      var tmpValue = [];
      valueCnt = value.length;
      for (var i = 0, n = valueCnt; i < n; i++) {
        for (var j = 0, m = value[i].length; j < m; j++) {
          if (tmpValue[j] !== undefined) {
            tmpValue[j] = tmpValue[j] + value[i][j];
          } else {
            tmpValue[j] = value[i][j];
          }
          if (i === n - 1 && isRate) {
            tmpValue[j] = tmpValue[j] / valueCnt;
            if (maxRateVal.current < tmpValue[j]) {
              maxRateVal.current = (tmpValue[j] / 10) * 10 + 10;
            }
          }
        }
      }

      chartSeries.push({
        label: transLangKey(key),
        data: tmpValue,
        type: isRate ? "line" : "bar",
        yAxisID: isRate ? "rate" : "val",
        backgroundColor: labelColors[colorIdx],
        borderColor: labelColors[colorIdx],
        borderWidth: 2,
        fill: true,
        tooltip: {
          format: isRate ? "##.#" : "#,###.##",
        },
      });
      colorIdx++;
    }
    return chartSeries;
  }*/

  const getChartSeriesRows = (gridView, dataProvider, selectedRowIndex, dateFields) => {
    maxRateVal.current = 100;
    var selectedRowData = getSelectedMeasureRows(gridView, selectedRowIndex, dataProvider.getValue(selectedRowIndex, "CATEGORY"));

    var jsonRows = dataProvider.getJsonRows(selectedRowData.startItem, selectedRowData.endItem);

    selectedRowData.startItem = gridView.getItemIndex(selectedRowData.startItem);
    selectedRowData.endItem = gridView.getItemIndex(selectedRowData.endItem);
    if (selectedRowData.endItem === -1) {
      var activatedMeasures = gridView.getActiveColumnFilters("CATEGORY", true);
      selectedRowData.endItem = selectedRowData.startItem + activatedMeasures.length - 1;
    }
    gridView.setSelection(selectedRowData);
    var itemKey = jsonRows[0].ITEM;
    var accountKey = jsonRows[0].ACCOUNT;

    if (itemKey !== null) {
      chartTitle.current = transLangKey("ITEM_CD") + " : " + itemKey;
    }
    if (accountKey !== null) {
      if (itemKey !== null) {
        chartTitle.current = chartTitle.current + " & ";
      }
      chartTitle.current = chartTitle.current + transLangKey("ACCOUNT_CD") + " : " + accountKey;
    }

    var dataRow;
    var measureName;
    var isRate;
    let colorIdx = 0;

    return jsonRows.map((row) => {
      measureName = row["CATEGORY"];
      isRate = measureName.includes("RATE");
      dataRow = [];
      for (let i = 0, n = dateFields.length; i < n; i++) {
        dataRow.push(row[dateFields[i]]);
        if (isRate && maxRateVal.current < row[dateFields[i]]) {
          maxRateVal.current = (row[dateFields[i]] / 10) * 10 + 10;
        }
      }
      return {
        label: transLangKey(measureName),
        type: isRate ? "line" : "bar",
        data: dataRow,
        yAxisID: isRate ? "rate" : "val",
        backgroundColor: labelColors[colorIdx],
        borderColor: labelColors[colorIdx++],
        borderWidth: 2,
        fill: true,
        aggregate: isRate ? "avg" : "sum",
        tooltip: {
          format: isRate ? "##.#" : "#,###.##",
        },
      };
    });
  };

  const getSelectedMeasureRows = (gridView, selectedRowIndex, selectedMeasure) => {
    let seq = 0;
    let prefInfo = gridView.prefInfo;
    // get selected column : leaf dimesion
    let leafDimension = prefInfo.filter(function (row) {
      return row.dimMeasureTp === "DIMENSION" && row.fldActiveYn;
    });
    if (leafDimension === null) {
      leafDimension = "CATEGORY";
    } else {
      leafDimension = leafDimension.reduce(function (pre, cur) {
        return pre.fldSeq > cur.fldSeq ? pre.fldCd : cur.fldCd;
      });
    }
    // get selected rows : categories
    let measureInfo = prefInfo
      .filter((row) => row.crosstabItemCd === "GROUP-VERTICAL-VALUES" && row.fldActiveYn)
      .sort((a, b) => {
        if (a.fldSeq > b.fldSeq) {
          return 1;
        }
        if (a.fldSeq < b.fldSeq) {
          return -1;
        }
        return 0;
      })
      .map((row) => {
        seq++;
        row.fldSeq = seq;
        return row;
      });
    var measureCnt = measureInfo.length;
    var selectedMeasureSeq = measureInfo.filter((row) => row.fldCd === selectedMeasure)[0].fldSeq;

    return { startItem: selectedRowIndex - selectedMeasureSeq + 1, endItem: selectedRowIndex + (measureCnt - selectedMeasureSeq), startColumn: leafDimension, style: "rows" };
  };

  //bukt
  const loadBucket = async () => {
    const buckets = await loadOption(true, "SRV_GET_REPORT_BUKT", {}, "CD", "NM", false, true);
    //console.log("buckets", buckets);
    setBucketOption(buckets);
    setValue("BUCK", "M");
  };

  const getAppDateFormat = (d) => {
    if (d) return d.format("yyyy-MM-ddTHH:mm:ss");
    else return "";
  };

  const loadVersion = async () => {
    versionOptionData = await loadOption(true, "SRV_GET_RTF_DP_VERSION", {}, "ID", "VER_ID", false, true);
    //console.log("versions", versions);
    setVersionOption(versionOptionData);
    if (!isEmptyArray(versionOptionData)) {
      setValue("versionId", versionOptionData[0].value);
    }
  };
  const loadDataGrid1 = () => {
    let dataArr;
    let sDate, eDate;
    let bucket = getValues("BUCK");
    // let dRange = getValues("STRT_DATE");
    // if (dRange) {
    //   if (bucket === "M") {
    //     sDate = getFirstDayOfMonth(dRange[0]);
    //     eDate = getLastDayOfMonth(dRange[1]);
    //   } else {
    //     sDate = dRange[0];
    //     eDate = dRange[1];
    //   }
    // }

    let versionData = versionOptionData.find((item) => item.value === getValues("versionId"));

    let param = new URLSearchParams();
    param.append("VER_ID", versionData.data.ID);
    param.append("RTF_VER_ID", versionData.data.RTF_VER_ID);
    param.append("DMND_TP_ID", versionData.data.DMND_TP_ID);
    param.append("BUCK", bucket);
    param.append("STRT_DATE", versionData.data.FROM_DATE);
    param.append("END_DATE", versionData.data.TO_DATE);
    param.append("CL_AUTH_TYPE", versionData.data.CL_AUTH_TYPE);
    param.append("ITEM_CD", getValues("ITEM_CD"));
    param.append("ACCT_CD", getValues("ACCT_CD"));
    param.append("OPTION", getValues("OPTION"));
    param.append("UI_ID", "UI_DP_31");
    param.append("AUTH_TP", "DEFAULT");
    param.append("GRID_ID", "UI_DP_31-RST_CPT_01");
    param.append("USER_ID", username);
    param.append("CROSSTAB", JSON.stringify(grid1.gridView.crossTabInfo));
    param.append("ITEM_ATTR_01", getValues("ITEM_ATTR_01"));
    param.append("ITEM_ATTR_02", getValues("ITEM_ATTR_02"));
    param.append("ITEM_ATTR_03", getValues("ITEM_ATTR_03"));
    param.append("ACCT_ATTR_01", getValues("ACCT_ATTR_01"));
    param.append("ACCT_ATTR_02", getValues("ACCT_ATTR_02"));
    param.append("ACCT_ATTR_03", getValues("ACCT_ATTR_03"));
    param.append("timeout", 0);

    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/GetReport",
      data: param,
    })
      .then((res) => {
        if (res.status === gHttpStatus.SUCCESS) {
          dataArr = [];
          dataArr = res.data.RESULT_DATA;

          grid1.setData(dataArr);
          rtfDemands = dataArr.filter((row) => row.CATEGORY === "RTF");
          if (grid1.dataProvider.getRowCount() === 0) {
            grid1.gridView.setDisplayOptions({ showEmptyMessage: true, emptyMessage: transLangKey("MSG_NO_DATA") });
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const initChart = (gridObj) => {
    if (!gridObj.gridView.prefInfo) return;

    // init chart
    chartTitle.current = "";
    let series = gridObj.gridView.prefInfo
      .filter((row) => row.crosstabItemCd === "GROUP-VERTICAL-VALUES" && row.fldActiveYn)
      .sort((a, b) => {
        if (a.fldSeq > b.fldSeq) {
          return 1;
        }
        if (a.fldSeq < b.fldSeq) {
          return -1;
        }
        return 0;
      })
      .map((row) => ({ label: transLangKey(row.fldApplyCd), type: row.fldCd.includes("RATE") ? "line" : "bar", data: null, yAxisID: row.fldCd.includes("RATE") ? "rate" : "val", backgroundColor: labelColors, borderColor: labelColors }));

    //console.log('series',series)
    createChart([], series);
  };

  function setValidationCellStyle(gridView, validationStyle, measures, lowValue, highValue, equalYN) {
    console.log("setValidationCellStyle");
    let dataProvider = gridView.getDataSource();
    let data = dataProvider.getJsonRows();
    var validationData = data.map(function (rw) {
      var keys = Object.keys(rw)
        .filter(function (key) {
          return key.includes("DATE_") && key.includes(",VALUE") && measures.includes(rw["CATEGORY"]);
        })
        .filter(function (key) {
          if (equalYN) {
            if (lowValue !== null && highValue !== null) return rw[key] <= lowValue || rw[key] >= highValue;
            if (lowValue !== null) return rw[key] <= lowValue;
            if (highValue !== null) return rw[key] >= highValue;
          } else {
            if (lowValue !== null && highValue !== null) return rw[key] < lowValue || rw[key] > highValue;
            if (lowValue !== null) return rw[key] < lowValue;
            if (highValue !== null) return rw[key] > highValue;
          }
          return null;
        });
      //console.log("keys", keys);
      return keys;
    });
    var rowsIndex = Object.keys(validationData).filter(function (key) {
      return validationData[key].length;
    });
    console.log("validationData====>", validationData);
    //    gridView.beginUpdate();
    rowsIndex.map(function (Index) {
      if (validationData[Index].length !== 0) {
        console.log("=====>", Index, validationData[Index], "Style:", validationStyle);
        gridView.setCellStyles(gridView, Index, validationData[Index], validationStyle);
      }
      return;
    });
    //  gridView.endUpdate();
  }

  //preference
  const gridAfterSetData = (gridView, dataProvider, resultData) => {
    if (resultData && resultData.length === 0) {
      return;
    }
    wingui3.util.grid.filter.loadFilters(gridView, ["CATEGORY"]);

    setValidationCellStyle(gridView, "redStyle", ["SALES_PLAN_SUPPLY_RATE"], 100, null, false);

    //	RTF
    //	FINAL_DP
    // SALES_PLAN_SUPPLY_RATE

    // console.log("setCellStyleCallback::", gridView.customStyles);
    // gridView.setCellStyleCallback((grid, dataCell) => {
    //   let ret = {};
    //   let rowIdx = dataCell.index.dataRow;
    //   let colName = dataCell.dataColumn.name;
    //   let dataProvider = grid.getDataSource();
    //   if (grid.customStyles) {
    //     const customStyles = grid.customStyles;
    //     const styleItems = grid.styleItems;
    //     //cell에 등록된 style 정보를 가져온다.
    //     let thisStyleInfo = customStyles.get(rowIdx, colName);
    //     if (thisStyleInfo) {
    //       console.log("rowIdx,", rowIdx, colName);
    //       const accStyle = thisStyleInfo.accStyle;
    //       for (let styleName of accStyle) {
    //         if (!styleName) continue;
    //         let prcd = false;
    //         if (styleItems) {
    //           const styleItem = styleItems.filter((v) => v.styleName == styleName);
    //           //console.log("styleItem,", styleItem);

    //           if (styleItem.length > 0) {
    //             let style = styleItem[0].style;
    //             ret = { ...ret, ...style };
    //             if (grid.specificStyle && grid.specificStyle[styleName] !== undefined) {
    //               if (ret.styleName) {
    //                 ret.styleName += " " + grid.specificStyle[styleName];
    //               } else {
    //                 ret.styleName = grid.specificStyle[styleName];
    //               }
    //               prcd = true;
    //             }
    //           }
    //         }
    //         if (prcd == false) {
    //           if (ret.styleName) {
    //             ret.styleName += " " + styleName;
    //           } else {
    //             ret.styleName = styleName;
    //           }
    //         }
    //       }
    //       console.log("ret", ret);
    //       return ret;
    //     }
    //   }
    // });

    let index = {
      itemIndex: 1,
      column: 0,
      dataRow: 1,
      fieldName: 0,
    };
    gridView.setCurrent(index);
    let dateFields = gridView.getColumnNames(true, true).filter((row) => row.includes("DATE_"));
    createChart(dateFields, getChartSeriesRows(gridView, dataProvider, 0, dateFields));
  };

  /*  const onKeyDown = async (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      setValue("ITEM_NM", await getCodeName("item", getValues("ITEM_CD")));
    }
  };*/

  const openItemPopup = () => {
    setPopItemOpen(true);
  };

  const openAccountPopup = () => {
    setPopAccountOpen(true);
  };

  const onClear = () => {
    setValue("ITEM_NM", "");
    setValue("ITEM_CD", "");
  };

  const reloadPrefInfo = (viewCd, userName, grid, grpCd) => {
    //gridCd
    if (grid) grid.loadCrossTabInfoAndPrefInfo(viewCd, grpCd, userName);
  };
  //          <InputField type="dateRange" name="STRT_DATE" label={transLangKey("APPY_SCPE")} control={control} dateformat={getValues("BUCK") === "M" ? "yyyy-MM" : "yyyy-MM-dd"} openTo={getValues("BUCK") === "M" ? "month" : "day"} />;

  return (
    <>
      <ContentInner>
        <SearchArea>
          <InputField type="select" name="BUCK" label={transLangKey("BUCKET")} control={control} readonly={false} disabled={false} options={bucketOption} />
          <InputField type="select" name="versionId" label={transLangKey("DP_VER")} control={control} options={versionOption} />

          <InputField
            type={"action"}
            name="ITEM_CD"
            useLabel={false}
            label={transLangKey("ITEM_CD")}
            control={control}
            readonly={false}
            onClick={() => {
              openItemPopup();
            }}>
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
            type={"action"}
            name="ACCOUNT_CD"
            useLabel={false}
            label={transLangKey("ACCOUNT_CD")}
            control={control}
            readonly={false}
            onClick={() => {
              openAccountPopup();
            }}>
            <Icon.Search />
          </InputField>

          <InputField name="ACCOUNT_NM" label={transLangKey("ACCOUNT_NM")} control={control} readonly={true} />
        </SearchArea>
        <ResultArea sizes={[30, 70]} direction={"vertical"}>
          <Box sx={{ display: "flex", height: "100%", flexDirection: "row", alignContent: "stretch", alignItems: "stretch" }}>
            <Box style={{ width: "100%", height: "100%" }}>
              {}
              <Chart
                type="bar"
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: chart1Plugin,
                  scales: {
                    rate: {
                      type: "linear",
                      display: true,
                      position: "left",
                      min: 0,
                      max: 100,
                    },
                    val: {
                      type: "linear",
                      display: true,
                      position: "right",
                      grid: {
                        drawOnChartArea: false,
                      },
                    },
                  },
                }}
                data={chart1Data}
                style={{ width: "100%", height: "100%" }}
              />
            </Box>
          </Box>
          <Box>
            <ButtonArea>
              <LeftButtonArea>
                <GridExcelExportButton type="icon" grid="grid1" options={{ footer: "hidden", ApplyI18n: ["CATEGORY"] }} />
              </LeftButtonArea>
            </ButtonArea>
            <Box style={{ height: "calc(100% - 53px" }}>
              <BaseGrid id="grid1" items={grid1Items} viewCd="UI_DP_31" grpCd="" userName={username} gridCd="UI_DP_31-RST_CPT_01" afterGridCreate={afterGridCreate} onAfterDataSet={gridAfterSetData} />
            </Box>
          </Box>
          <StatusArea show={false} message={message}>
            <GridCnt grid="grid1" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")} />
          </StatusArea>
        </ResultArea>
      </ContentInner>
      <PopDPItemTree id="DpItemPopup" open={popItemOpen} onClose={() => setPopItemOpen(false)} confirm={setItemCd} empNo={username} />
      <PopDPAccountTree id="DpAccountPopup" open={popAccountOpen} onClose={() => setPopAccountOpen(false)} confirm={setAccountCd} empNo={username} />
      <PopPersonalize open={personalizeOpen} onClose={() => setPersonalizeOpen(false)} resetCallback={reloadPrefInfo} viewCd={vom.active} grid={[grid1]} username={username} />
    </>
  );
}
export default RtfAnalysis;
