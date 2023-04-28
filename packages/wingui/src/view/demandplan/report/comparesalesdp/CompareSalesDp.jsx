import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { ButtonGroup, Box } from "@mui/material";
import { ContentInner, ResultArea, SearchArea, useIconStyles, StatusArea, ButtonArea, LeftButtonArea, RightButtonArea, GridCnt, InputField, GridExcelExportButton, BaseGrid, useViewStore, useUserStore, zAxios } from "@zionex/wingui-core/src/common/imports";
import { transLangKey, vom, gridComboLoad } from "@wingui";
import { excelExportOptions, loadOption, isEmptyArray, dimensionItems, labelColors } from "@wingui/view/demandplan/DpUtil";
import PopPersonalize from "@wingui/view/common/PopPersonalize";
import PopDPAccountTree from "@wingui/view/demandplan/common/PopAccountTree";
import PopDPItemTree from "@wingui/view/demandplan/common/PopItemTree";
import { Chart as ChartJS, LinearScale, CategoryScale, BarElement, PointElement, LineElement, Legend, Title, Tooltip, LineController, BarController } from "chart.js";
import { Chart, Bar, Pie, Line } from "react-chartjs-2";
import wingui3 from "@wingui/component/grid/gridCustom";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, LineController, BarController);

let grid1Items = new Array(
  ...dimensionItems,
  ...[
    { name: "ITEM", dataType: "string", visible: false, editable: false, width: "120", type: "string" },
    { name: "ACCOUNT", dataType: "string", visible: false, editable: false, width: "120", type: "string" },
    { name: "CATEGORY", dataType: "string", headerText: "Measure", visible: true, editable: false, width: "120", title: "Measure", type: "string", lang: true, filterable: true },
    { name: "DATE", dataType: "double", visible: true, editable: false, width: "70", type: "double", format: "#,###.##", gridSummaryExp: "sum", groupSummaryExp: "sum", iteration: { prefix: "DATE_", prefixRemove: "true", delimiter: "-" } },
  ]
);
// { name: "DIMENSION_01", dataType: "string", headerText: "DIMENSION_01", visible: false, editable: false, width: "120", title: "DIMENSION_01", type: "string", sort: "asc", merge: true },

function CompareSalesDp(props) {
  const [username, displayName, systemAdmin] = useUserStore((state) => [state.username, state.displayName, state.systemAdmin]);
  const [message, setMessage] = useState();
  //1. view 페이지 데이타 store
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);

  //2. 그리드 Object
  const [grid1, setGrid1] = useState(null);

  const maxRateVal = useRef(100);
  const chartTitle = useRef("");

  //4. FORM 데이터 처리
  const {
    handleSubmit,
    reset,
    getValues,
    setValue,
    watch,
    control,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: {
      BUCK: "M",
      STRT_DATE: [new Date(new Date().setMonth(new Date().getMonth() - 2)), new Date()],
      ITEM_CD: "",
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
      action: (e) => {
        loadDataGrid1();
      },
      visible: true,
      disable: false,
    },
    {
      name: "save",
      action: (e) => {},
      visible: false,
      disable: false,
    },
    {
      name: "refresh",
      action: (e) => {
        reset();
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

  useEffect(() => {
    if (grid1) {
      setViewInfo(vom.active, "globalButtons", globalButtons);
    }
  }, [grid1]);

  useEffect(() => {
    if (grid1) {
      loadBucket();
    }
  }, [grid1]);

  const afterGridCreate = (gridObj, gridView, dataProvider) => {
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

  function refresh() {
    reset();
    grid1.dataProvider.clearRows();
  }

  const setOptionsGrid1 = (grdObj) => {
    setVisibleProps(grdObj, true, true, false);
    // grid1.gridView.setHeader({height: 50 });
    grdObj.gridView.setDisplayOptions({
      fitStyle: "fill",
    });

    grdObj.gridView.onCurrentRowChanged = function (grid, oldRow, newRow) {
      var dataProvider = grid.getDataSource();
      let selectedRowIndex = grid.getCurrent().dataRow;
      if (selectedRowIndex < 0) return;

      var dateFields = grid.getColumnNames(true, true).filter(function (row) {
        return row.includes("DATE_");
      });
      console.log("onCurrentRowChanged1111===>", selectedRowIndex, dateFields);
      console.log("uidp30_getChartSeriesRows(grid, dataProvider, selectedRowIndex, dateFields)", uidp30_getChartSeriesRows(grid, dataProvider, selectedRowIndex, dateFields));
      uidp30_createChart(dateFields, uidp30_getChartSeriesRows(grid, dataProvider, selectedRowIndex, dateFields));
    };
  };

  /* function to make chart */
  function uidp30_getChartAllSeriesRows(data, dateFields) {
    chartTitle.current = "";

    var chartData = data.reduce(function (rv, x) {
      var newArray = new Array();
      for (var i = 0, n = dateFields.length; i < n; i++) {
        newArray.push(x[dateFields[i]]);
      }
      (rv[x.CATEGORY] = rv[x.CATEGORY] || []).push(newArray);
      return rv;
    }, {});

    var chartSeries = new Array();
    var isRate;
    var valueCnt = 1;
    maxRateVal.current = 100;
    let colorIdx = 0;
    for (const [key, value] of Object.entries(chartData)) {
      isRate = key.includes("RATE");
      var tmpValue = new Array();
      valueCnt = value.length;
      for (var i = 0, n = valueCnt; i < n; i++) {
        for (var j = 0, m = value[i].length; j < m; j++) {
          if (tmpValue[j] !== undefined) {
            tmpValue[j] = tmpValue[j] + value[i][j];
          } else {
            tmpValue[j] = value[i][j];
          }
          if (i == n - 1 && isRate == true) {
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
  }

  function uidp30_getChartSeriesRows(gridView, dataProvider, selectedRowIndex, dateFields) {
    maxRateVal.current = 100;
    var selectedRowData = uidp30_getSelectedMeasureRows(gridView, selectedRowIndex, dataProvider.getValue(selectedRowIndex, "CATEGORY"));
    console.log("selectedRowData", selectedRowData);
    var jsonRows = dataProvider.getJsonRows(selectedRowData.startItem, selectedRowData.endItem);

    selectedRowData.startItem = gridView.getItemIndex(selectedRowData.startItem);
    selectedRowData.endItem = gridView.getItemIndex(selectedRowData.endItem);
    if (selectedRowData.endItem == -1) {
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

    var seriesRows = jsonRows.map(function (row) {
      measureName = row["CATEGORY"];
      isRate = measureName.includes("RATE");
      dataRow = new Array();
      for (var i = 0, n = dateFields.length; i < n; i++) {
        dataRow.push(row[dateFields[i]]);
        if (isRate == true && maxRateVal.current < row[dateFields[i]]) {
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

    return seriesRows;
  }

  function uidp30_getSelectedMeasureRows(gridView, selectedRowIndex, selectedMeasure) {
    var seq = 0;
    var prefInfo = gridView.prefInfo;
    // get selected column : leaf dimesion
    var leafDimension = prefInfo.filter(function (row) {
      return row.dimMeasureTp == "DIMENSION" && row.fldActiveYn == true;
    });
    if (leafDimension == null) {
      leafDimension = "CATEGORY";
    } else {
      leafDimension = leafDimension.reduce(function (pre, cur) {
        return pre.fldSeq > cur.fldSeq ? pre.fldCd : cur.fldCd;
      });
    }
    // get selected rows : categories
    var measureInfo = prefInfo
      .filter(function (row) {
        return row.crosstabItemCd == "GROUP-VERTICAL-VALUES" && row.fldActiveYn == true;
      })
      .sort(function (a, b) {
        if (a.fldSeq > b.fldSeq) {
          return 1;
        }
        if (a.fldSeq < b.fldSeq) {
          return -1;
        }
        return 0;
      })
      .map(function (row) {
        seq++;
        row.fldSeq = seq;
        return row;
      });
    var measureCnt = measureInfo.length;
    var selectedMeasureSeq = measureInfo.filter(function (row) {
      return row.fldCd == selectedMeasure;
    })[0].fldSeq;

    return { startItem: selectedRowIndex - selectedMeasureSeq + 1, endItem: selectedRowIndex + (measureCnt - selectedMeasureSeq), startColumn: leafDimension, style: "rows" };
  }
  function uidp30_createChart(dateFields, seriesRows) {
    const buckType = getValues("BUCK");

    let lables = dateFields.map(function (row) {
      row = row.replace("DATE_", "");
      switch (buckType) {
        case "Y":
          return row.split("-")[0];
          break;
        case "Q":
          return row.split("-")[0] + "-" + row.split("-")[1];
          break;
        case "M":
          return row.split("-")[0] + "-" + row.split("-")[1];
          break;
        default:
          return row.split("-")[1] + "/" + row.split("-")[2];
          break;
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
  }

  //bukt
  const loadBucket = async () => {
    const buckets = await loadOption(true, "SRV_GET_REPORT_BUKT", {}, "CD", "NM", false, true);
    //console.log("buckets", buckets);
    setBucketOption(buckets);
    setValue("BUCK", "M");
  };

  function getAppDateFormat(d) {
    if (d) return d.format("yyyy-MM-ddTHH:mm:ss");
    else return "";
  }

  function loadDataGrid1() {
    let dataArr;
    let sDate, eDate;
    let bucket = getValues("BUCK");
    let dRange = getValues("STRT_DATE");
    if (dRange) {
      if (bucket == "M") {
        sDate = getFirstDayOfMonth(dRange[0]);
        eDate = getLastDayOfMonth(dRange[1]);
      } else {
        sDate = dRange[0];
        eDate = dRange[1];
      }
    }

    let param = new URLSearchParams();
    param.append("BUCK", bucket);
    param.append("STRT_DATE", getAppDateFormat(sDate));
    param.append("END_DATE", getAppDateFormat(eDate));
    param.append("ITEM_CD", getValues("ITEM_CD"));
    param.append("ACCT_CD", getValues("ACCT_CD"));
    param.append("OPTION", getValues("OPTION"));
    param.append("UI_ID", "UI_DP_30");
    param.append("AUTH_TP", "DEFAULT");
    param.append("GRID_ID", "UI_DP_30-RST_CPT_01");
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
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          dataArr = [];
          dataArr = res.data.RESULT_DATA;

          grid1.setData(dataArr);

          if (grid1.dataProvider.getRowCount() == 0) {
            grid1.gridView.setDisplayOptions({ showEmptyMessage: true, emptyMessage: transLangKey("MSG_NO_DATA") });
          }
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function initChart(gridObj) {
    if (!gridObj.gridView.prefInfo) return;

    // init chart
    maxRateVal.current = 100;
    chartTitle.current = "";
    let series = gridObj.gridView.prefInfo
      .filter(function (row) {
        return row.crosstabItemCd == "GROUP-VERTICAL-VALUES" && row.fldActiveYn == true;
      })
      .sort(function (a, b) {
        if (a.fldSeq > b.fldSeq) {
          return 1;
        }
        if (a.fldSeq < b.fldSeq) {
          return -1;
        }
        return 0;
      })
      .map(function (row) {
        return {
          label: transLangKey(row.fldApplyCd),
          type: row.fldCd.includes("RATE") ? "line" : "bar",
          data: null,
          yAxisID: row.fldCd.includes("RATE") ? "rate" : "val",
          backgroundColor: labelColors,
          borderColor: labelColors,
        };
      });

    //console.log('series',series)
    uidp30_createChart([], series);
  }

  //preference
  const gridAfterSetData = (gridView, dataProvider, resultData) => {
    if (resultData && resultData.length == 0) {
      return;
    }
    wingui3.util.grid.filter.loadFilters(gridView, ["CATEGORY"]);

    // var dateFields = gridView.getColumnNames(true, true).filter(function (row) {
    //   return row.includes("DATE_");
    // });
    // var chartSeries = uidp30_getChartAllSeriesRows(resultData, dateFields);
    // uidp30_createChart(dateFields, chartSeries);

    var index = {
      itemIndex: 0,
      column: 0,
      dataRow: 0,
      fieldName: 0,
    };
    gridView.setCurrent(index);
  };

  const onKeyDown = async (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      setValue("ITEM_NM", await getCodeName("item", getValues("ITEM_CD")));
    }
  };

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

  const reloadPrefInfo = (viewCd, userName, grid, grpCd, gridCd) => {
    if (grid) grid.loadCrossTabInfoAndPrefInfo(viewCd, grpCd, userName);
  };

  return (
    <>
      <ContentInner>
        <SearchArea>
          <InputField type="select" name="BUCK" label={transLangKey("BUCKET")} control={control} readonly={false} disabled={false} options={bucketOption} />
          <InputField type="dateRange" name="STRT_DATE" label={transLangKey("APPY_SCPE")} control={control} dateformat={getValues("BUCK") == "M" ? "yyyy-MM" : "yyyy-MM-dd"} openTo={getValues("BUCK") == "M" ? "month" : "day"} />

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
            onFocus={(e) => {
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
                      max: maxRateVal.current,
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
              <RightButtonArea></RightButtonArea>
            </ButtonArea>
            <Box style={{ height: "calc(100% - 53px" }}>
              <BaseGrid id="grid1" items={grid1Items} viewCd="UI_DP_30" grpCd="" userName={username} gridCd="UI_DP_30-RST_CPT_01" afterGridCreate={afterGridCreate} onAfterDataSet={gridAfterSetData}></BaseGrid>
            </Box>
          </Box>
        </ResultArea>
        <StatusArea show={false} message={message}>
          <GridCnt grid="grid1" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")}></GridCnt>
        </StatusArea>
      </ContentInner>
      <PopDPItemTree id="DpItemPopup" open={popItemOpen} onClose={() => setPopItemOpen(false)} confirm={setItemCd} empNo={username}></PopDPItemTree>
      <PopDPAccountTree id="DpAccountPopup" open={popAccountOpen} onClose={() => setPopAccountOpen(false)} confirm={setAccountCd} empNo={username}></PopDPAccountTree>
      <PopPersonalize open={personalizeOpen} onClose={() => setPersonalizeOpen(false)} resetCallback={reloadPrefInfo} viewCd={vom.active} grid={[grid1]} username={username}></PopPersonalize>
    </>
  );
}
export default CompareSalesDp;
