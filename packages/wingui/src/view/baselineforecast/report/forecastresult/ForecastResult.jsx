import React, { useState, useEffect, useRef } from "react";
import { useForm, watch } from "react-hook-form";
import { PolarArea, Bar, Line, Chart } from "react-chartjs-2";
import { Box, ButtonGroup, Button, Paper, IconButton } from "@mui/material";

import {
  ContentInner,
  ViewPath,
  ResultArea,
  SearchArea,
  StatusArea,
  ButtonArea,
  LeftButtonArea,
  RightButtonArea,
  SearchRow,
  InputField,
  GridAddRowButton,
  GridDelRowButton,
  GridExcelExportButton,
  CommonButton,
  BaseGrid,
  GridCnt,
  useViewStore,
  useUserStore,
  useStyles,
  zAxios,
  SearchItem,
} from "@zionex/wingui-core/src/common/imports";

import "./forecastresult.css";

import { transLangKey } from "@zionex/wingui-core/src/lang/i18n-func";

import PopSelectItemLvItem from "../../common/PopSelectItemLvItem";
import PopSelectSalesLvAccount from "../../common/PopSelectSalesLvAccount";
import PopPersonalize from "@wingui/view/common/PopPersonalize";

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

let grid1Items = [
  //거래처 코드, 거래처명, 품목코드, 품목명, WAPE, 선택순서, 예측 알고리즘, 날짜
  { name: "ACCOUNT_CD", dataType: "text", headerText: "ACCOUNT_CD", visible: true, editable: false, width: "50", textAlignment: "center" },
  { name: "ACCOUNT_NM", dataType: "text", headerText: "ACCOUNT_NM", visible: true, editable: false, width: "100", textAlignment: "center" },
  { name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: "100", textAlignment: "center" },
  { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: "100", textAlignment: "center" },
  { name: "ACCRY", dataType: "number", headerText: "CF_BF_SELECT_CRITERIA_WAPE", visible: true, editable: false, width: "100", textAlignment: "center" },
  { name: "SELECT_SEQ", dataType: "text", headerText: "SELECT_SEQ", visible: true, editable: false, width: "100", textAlignment: "center" },
  {
    name: "ENGINE_TP_CD",
    dataType: "text",
    headerText: "ENGINE_TP_CD",
    visible: true,
    editable: false,
    width: "100",
    textAlignment: "center",
    styleCallback: function (grid, dataCell) {
      let ret = {};
      let selectSeq = grid.getValue(dataCell.index.itemIndex, "SELECT_SEQ");

      if (selectSeq == "1") {
        ret.styleName = "green-color";
      }
      return ret;
    },
  },
  {
    name: "DATE",
    dataType: "text",
    headerText: "DATE",
    visible: true,
    editable: false,
    width: 100,
    textAlignment: "center",
    iteration: { prefix: "DATE_", prefixRemove: "true", delimiter: "-", postfix: "" },
  },
];

const excelExportOptions = {
  lookupDisplay: false,
  // allColumns: true,
  separateRows: true,
  footer: "default",
  headerDepth: 2,
  importExceptFields: { 0: "id" },
};

function ForecastResult(props) {
  const labelColors = [
    "#8EBC00",
    "#309B46",
    "#25A0DA",
    "#FF6900",
    "#EB4B51",
    "#D8E404",
    "#8EBC00",
    "#309B46",
    "#25A0DA",
    "#FF6900",
    "#EB4B51",
    "#D8E404",
    "#8EBC00",
    "#309B46",
    "#25A0DA",
    "#FF6900",
    "#EB4B51",
    "#D8E404",
    "#8EBC00",
    "#309B46",
    "#25A0DA",
    "#FF6900",
    "#EB4B51",
    "#D8E404",
    "#8EBC00",
    "#309B46",
    "#25A0DA",
    "#FF6900",
    "#EB4B51",
    "#D8E404",
    "#8EBC00",
    "#309B46",
    "#25A0DA",
    "#FF6900",
    "#EB4B51",
    "#D8E404",
    "#8EBC00",
    "#309B46",
    "#25A0DA",
    "#FF6900",
    "#EB4B51",
    "#D8E404",
    "#8EBC00",
    "#309B46",
    "#25A0DA",
    "#FF6900",
    "#EB4B51",
    "#D8E404",
  ];

  const barChart = useRef();
  const [username] = useUserStore((state) => [state.username]);
  const [engineTpCd, setEngineTpCd] = useState("");

  const [itemPopupOpen, setItemPopupOpen] = useState(false);
  const [accountPopupOpen, setAccountPopupOpen] = useState(false);
  const [personalizeOpen, setPersonalizeOpen] = useState(false);
  const [setViewInfo] = useViewStore((state) => [state.setViewInfo]);

  //2. 그리드 Object
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
      versionId: "",
      itemCd: "",
      itemNm: "",
      accountCd: "",
      accountNm: "",
      startDate: "",
      endDate: "",
      bastSelectYn: [],
    },
  });

  const [option1, setOption1] = useState([]);
  // const [personalizeOpen, setPersonalizeOpen] = useState(false);
  const [prefInfoObj, setPrefInfoObj] = useState(null);

  const [chartData, setChartData] = useState({
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
  });
  const labels = [];
  const [barData, setBarData] = useState({
    labels,
    datasets: [
      {
        type: "bar",
        label: transLangKey("QTY"),
        backgroundColor: "#71A8D7",
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
      visible: false,
      disable: false,
    },
  ];

  useEffect(() => {
    if (grid1) {
      setViewInfo(vom.active, "globalButtons", globalButtons);
    }
  }, [grid1]);

  //chart loading 시 첫번째 legend 만 보이도록
  useEffect(() => {
    if (barData && barChart.current.data.datasets.length > 1) {
      for (let i = 0; i < barChart.current.data.datasets.length; i++) {
        if (barChart.current.data.datasets[i].code === engineTpCd || barChart.current.data.datasets[i].code === "ACT_SALES") {
          barChart.current.data.datasets[i].hidden = false;
        } else {
          barChart.current.data.datasets[i].hidden = true;
        }
      }
      barChart.current.update();
    }
  }, [barData]);

  const setVersionId = () => {
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_BF_00_VERSION_Q1",
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
              listItemObj = { value: row.VER_CD, label: transLangKey(row.VER_CD) };
              rstArr.push(listItemObj);
            }
          }
          setOption1(rstArr);
          setValue("versionId", rstArr[0].value);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  useEffect(() => {
    setVersionId();
  }, []);

  // 조회 조건 버전ID ComboBox 값 변경시 적용범위 변경
  useEffect(() => {
    const verId = getValues("versionId");

    if (verId) {
      let param = new URLSearchParams();
      param.append("VER_ID", getValues("versionId"));
      param.append("timeout", "0");
      param.append("CURRENT_OPERATION_CALL_ID", "DATE_RELOAD");
      zAxios({
        method: "post",
        url: baseURI() + "engine/dp/SRV_BF_GET_DATETIME_SCOPE_Q2",
        data: param,
      })
        .then(function (res) {
          if (res.status === gHttpStatus.SUCCESS) {
            // let fdt = Date.parse(res.data.RESULT_DATA[0].FROM_DATE);
            // let tdt = Date.parse(res.data.RESULT_DATA[0].TO_DATE)
            let fdt = new Date(res.data.RESULT_DATA[0].FROM_DATE);
            let tdt = new Date(res.data.RESULT_DATA[0].TO_DATE);

            setValue("startDate", fdt);
            setValue("endDate", tdt);
            //             setValue("dateRange", [fdt, tdt]);
          }
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  }, [watch("versionId")]);

  /** 이벤트 핸들러 */
  function onSubmit(data) {
    loadDataGrid1(data);
  }

  // function onError(errors, e) {
  // if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
  //   $.each(errors, function (key, value) {
  //   showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
  //   clearErrors();
  //   return false;
  //   });
  // }
  // }

  function refresh() {
    reset();
    grid1.dataProvider.clearRows();
    setBarData("");
  }

  const afterGridCreate = (gridObj, gridView, dataProvider) => {
    setGrid1(gridObj);
    setOptions(gridObj);
  };

  function setOptions(gridObj) {
    //     setVisibleProps(gridObj, true, true, false);

    gridObj.gridView.displayOptions.fitStyle = "fill";
    gridObj.gridView.setColumnProperty("ACCOUNT_CD", "mergeRule", {
      criteria: "values[ 'ACCOUNT_CD' ]",
    });
    gridObj.gridView.setColumnProperty("ACCOUNT_NM", "mergeRule", {
      criteria: "values[ 'ACCOUNT_CD' ] + values[ 'ACCOUNT_NM' ]",
    });
    gridObj.gridView.setColumnProperty("ITEM_CD", "mergeRule", {
      criteria: "values[ 'ACCOUNT_CD' ] + values[ 'ACCOUNT_NM' ] + values[ 'ITEM_CD' ]",
    });
    gridObj.gridView.setColumnProperty("ITEM_NM", "mergeRule", {
      criteria: "values[ 'ACCOUNT_CD' ] + values[ 'ACCOUNT_NM' ] + values[ 'ITEM_CD' ] + values[ 'ITEM_NM' ]",
    });
    gridObj.gridView.onCellClicked = function (grid, index, itemIndex) {
      if (index.cellType === "data") {
        loadDataChart1(grid, index.itemIndex);
      }
    };
  }

  function loadDataGrid1() {
    let dataArr;

    let fromDate = new Date(getValues("startDate"));
    let toDate = new Date(getValues("endDate"));

    let param = new URLSearchParams();
    param.append("VER_ID", getValues("versionId"));
    param.append("ITEM", getValues("itemCd"));
    param.append("SALES", getValues("accountCd"));
    param.append("FROM_DATE", fromDate.format("yyyy-MM-ddT00:00:00"));
    param.append("TO_DATE", toDate.format("yyyy-MM-ddT00:00:00"));
    param.append("BEST_SELECT_YN", getValues("bastSelectYn").join("") === "Y" ? "Y" : "N");
    param.append("USERNAME", username);
    param.append("timeout", "0");
    param.append("CROSSTAB", JSON.stringify(grid1.gridView.crossTabInfo));
    param.append("CURRENT_OPERATION_CALL_ID", "OPC_RST_CPT_01_LOAD");
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_BF_50_Q1",
      data: param,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          grid1.setData(res.data.RESULT_DATA);
          loadDataChart1(grid1.gridView, 0);

          if (grid1.dataProvider.getRowCount() == 0) {
            grid1.gridView.setDisplayOptions({ showEmptyMessage: true, emptyMessage: transLangKey("MSG_NO_DATA") });
          }
          //필터 설정
          //           grid1Items.map(item => setColumnFilter(grid1.gridView, grid1.dataProvider, item.name))
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function loadDataChart1(gridView, idx) {
    let dataArr;
    let chartArr = {};

    let fromDate = new Date(getValues("startDate"));
    let toDate = new Date(getValues("endDate"));

    let param = new URLSearchParams();
    param.append("VER_ID", getValues("versionId"));
    param.append("ITEM", gridView.getDataSource().getValue(idx, "ITEM_CD"));
    param.append("SALES", gridView.getDataSource().getValue(idx, "ACCOUNT_CD"));
    param.append("FROM_DATE", fromDate.format("yyyy-MM-ddT00:00:00"));
    param.append("TO_DATE", toDate.format("yyyy-MM-ddT00:00:00"));
    param.append("timeout", 0);
    param.append("CURRENT_OPERATION_CALL_ID", "OPC_RST_CRT_01_LOAD_002");

    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_BF_50_CHART_Q1",
      data: param,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          dataArr = [];
          dataArr = res.data.RESULT_DATA;

          //선택 순서가 1번째 인 예측알고리즘
          let accoutnCd = gridView.getDataSource().getValue(idx, "ACCOUNT_CD");
          let itemCd = gridView.getDataSource().getValue(idx, "ITEM_CD");
          let firstData = gridView
            .getDataSource()
            .getJsonRows()
            .filter((data) => data.ACCOUNT_CD === accoutnCd && data.ITEM_CD === itemCd && data.SELECT_SEQ == "1");
          setEngineTpCd(firstData[0].ENGINE_TP_CD);

          let listLabels = [];
          let listEngines = [];
          let chartData = []; //[PR:[qty1,qty2,...],RF,TF,XGB,Z_ACT_SALES,ZAR1]
          let dataset = [];

          dataArr.map((row) => {
            if (row !== null) {
              let isEngineTpKey = chartData.hasOwnProperty(row.ENGINE_TP_CD);
              let isBukt = listLabels.indexOf(row.BUKT) > -1 ? true : false;

              if (!isBukt) {
                listLabels.push(row.BUKT);
              }

              if (isEngineTpKey) {
                chartData[row.ENGINE_TP_CD].push(row.QTY);
              } else {
                //key 값이 처음 등록될 경우
                chartData[row.ENGINE_TP_CD] = [];
                chartData[row.ENGINE_TP_CD].push(row.QTY);
              }
            }
          });
          listEngines = Object.keys(chartData);
          listEngines.sort();

          for (var i = 0; i < listEngines.length; i++) {
            if (listEngines[i] === "Z_ACT_SALES") {
              dataset.push({
                type: "bar",
                label: transLangKey("ACT_SALES_QTY"),
                code: "ACT_SALES",
                data: chartData.Z_ACT_SALES,
                backgroundColor: "#71A8D7",
                borderColor: "#71A8D7",
              });
            } else {
              dataset.push({
                type: "line",
                label: transLangKey(listEngines[i] + "_QTY"),
                code: listEngines[i],
                data: chartData[listEngines[i]],
                backgroundColor: labelColors[i],
                borderColor: labelColors[i],
              });
            }
          }

          chartArr = {
            labels: listLabels,
            datasets: dataset,
          };
          setBarData(chartArr);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  //   const getConfirm = (popupName, popupText) => {
  //     if (popupName === "PopSelectItemLvItem") {
  //       setValue('itemCd', popupText.map((txt) => txt.ITEM_CD).join("|"));
  //       setValue('itemNm', popupText.map((txt) => txt.ITEM_NM).join("|"));
  //     }
  //     if (popupName === "PopSelectSalesLvAccount") {
  //       setValue('accountCd', popupText.map((txt) => txt.ACCOUNT_CD).join("|"));
  //       setValue('accountNm', popupText.map((txt) => txt.ACCOUNT_NM).join("|"));
  //     }
  //   }

  const setAccountCd = (popupText) => {
    setValue("accountCd", popupText.map((txt) => txt.ACCOUNT_CD).join("|"));
    setValue("accountNm", popupText.map((txt) => txt.ACCOUNT_NM).join("|"));
  };

  const setItemCd = (popupText) => {
    setValue("itemCd", popupText.map((txt) => txt.ITEM_CD).join("|"));
    setValue("itemNm", popupText.map((txt) => txt.ITEM_NM).join("|"));
  };

  const reloadPrefInfo = (viewCd, userName, grid, grpCd, gridCd) => {
    if (grid) {
      grid.loadCrossTabInfoAndPrefInfo(viewCd, grpCd, userName);
    }
  };

  return (
    <>
      <ContentInner>
        {/* <ViewPath {...viewPathProps} submit={handleSubmit(onSubmit, onError)}></ViewPath> */}
        <SearchArea>
          <SearchRow>
            <InputField type="select" name="versionId" label={transLangKey("VERSION_ID")} control={control} options={option1} />
            <InputField type="datetime" label={transLangKey("FROM_DATE")} name="startDate" dateformat="yyyy-MM-dd" control={control} />
            <InputField type="datetime" label={transLangKey("TO_DATE")} name="endDate" dateformat="yyyy-MM-dd" control={control} />
          </SearchRow>
          <SearchRow>
            <InputField
              type="action"
              name="itemCd"
              label={transLangKey("ITEM_CD")}
              title={transLangKey("SEARCH")}
              onClick={() => {
                setItemPopupOpen(true);
              }}
              control={control}
              readonly={false}
              disabled={false}>
              <Icon.Search />
            </InputField>
            <InputField name="itemNm" label={transLangKey("ITEM_NM")} control={control} readonly={false} disabled={true} />
            <InputField
              type="action"
              name="accountCd"
              label={transLangKey("ACCOUNT_CD")}
              title={transLangKey("SEARCH")}
              onClick={() => {
                setAccountPopupOpen(true);
              }}
              control={control}
              readonly={false}
              disabled={false}>
              <Icon.Search />
            </InputField>
            <InputField name="accountNm" label={transLangKey("ACCT_NM")} control={control} readonly={false} disabled={true} />
            <InputField type="check" name={"bastSelectYn"} label="" control={control} options={[{ label: transLangKey("BEST_SELECT_YN"), value: "Y" }]} />
          </SearchRow>
        </SearchArea>
        <ResultArea sizes={[50, 50]} direction={"vertical"}>
          <Box>
            <div style={{ display: "none" }}>
              <PolarArea id={"deliveryStateChart"} data={chartData} options={{ responsive: false, maintainAspectRatio: false, plugins: { legend: { position: "right" } }, title: { display: true, text: "Polar" } }}></PolarArea>
            </div>
            <Chart
              type="bar"
              ref={barChart}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "right",
                    onClick: (evt, legendItem, legend) => {
                      const ci = legend.chart;
                      legend.chart.data.datasets.forEach((d, i) => {
                        //ci.hide(i);
                        if (d.label === legendItem.text) {
                          d.hidden = !legendItem.hidden;
                        }
                      });
                      ci.update();
                    },
                  },
                  title: {
                    display: false,
                    text: "Bar Chart",
                  },
                },
              }}
              data={barData}
              style={{ width: "100%", height: "300px" }}
            />
          </Box>
          <Box>
            <ButtonArea title={transLangKey("UI_BF_50")}>
              <LeftButtonArea>
                <GridExcelExportButton grid="grid1" type="icon" options={excelExportOptions}></GridExcelExportButton>
              </LeftButtonArea>
            </ButtonArea>
            <Box style={{ height: "calc(100% - 53px" }}>
              <BaseGrid id="grid1" items={grid1Items} viewCd="UI_BF_50" gridCd="UI_BF_50-RST_CPT_01" userName={username} afterGridCreate={afterGridCreate}></BaseGrid>
            </Box>
          </Box>
        </ResultArea>
        <StatusArea message={message} show={false}>
          <GridCnt grid="grid1" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")}></GridCnt>
        </StatusArea>
      </ContentInner>
      {itemPopupOpen && <PopSelectItemLvItem open={itemPopupOpen} onClose={() => setItemPopupOpen(false)} multiple={false} confirm={setItemCd} values={""} accountCd={getValues("accountCd")} title="ITEM"></PopSelectItemLvItem>}
      {accountPopupOpen && <PopSelectSalesLvAccount open={accountPopupOpen} onClose={() => setAccountPopupOpen(false)} multiple={false} confirm={setAccountCd} values={""} itemCd={getValues("itemCd")} title="ACCOUNT"></PopSelectSalesLvAccount>}
      <PopPersonalize open={personalizeOpen} onClose={() => setPersonalizeOpen(false)} resetCallback={reloadPrefInfo} viewCd="UI_BF_50" grid={grid1} username={username} authTpId={""}></PopPersonalize>
    </>
  );
}

export default ForecastResult;
