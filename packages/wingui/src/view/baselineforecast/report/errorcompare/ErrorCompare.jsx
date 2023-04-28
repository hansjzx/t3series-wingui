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
  CommonButton,
  BaseGrid,
  GridCnt,
  useViewStore,
  useUserStore,
  useStyles,
  zAxios,
  SearchItem,
  GridExcelExportButton,
} from "@zionex/wingui-core/src/common/imports";

import PopSelectItemLvItem from "../../common/PopSelectItemLvItem";
import PopSelectSalesLvAccount from "../../common/PopSelectSalesLvAccount";
import "./css/errorcompare.css";
import PopPersonalize from "@wingui/view/common/PopPersonalize";

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

let grid1Items = [
  { name: "VER_ID", dataType: "text", headerText: "VER_ID", visible: false, editable: false, width: "50", textAlignment: "center" },
  { name: "ACCOUNT_CD", dataType: "text", headerText: "ACCOUNT_CD", visible: true, editable: false, width: "50", textAlignment: "center" },
  { name: "ACCOUNT_NM", dataType: "text", headerText: "ACCOUNT_NM", visible: true, editable: false, width: "100", textAlignment: "center" },
  { name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: "100", textAlignment: "center" },
  { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: "100", textAlignment: "center" },
  { name: "ITEM_GRADE", dataType: "text", headerText: "ITEM_GRADE", visible: true, editable: false, width: "100", textAlignment: "center" },
  { name: "BEST_ENGINE", dataType: "text", headerText: "BEST_ENGINE", visible: false, editable: false, width: "100", textAlignment: "center" },
  { name: "ENGINE_TP_CD", dataType: "text", headerText: "ENGINE_TP_CD", visible: true, editable: false, width: "100", textAlignment: "center", iteration: { prefix: "ENGINE_TP_CD_", prefixRemove: "true", delimiter: "," } },
];

const excelExportOptions = {
  lookupDisplay: false,
  // allColumns: true,
  separateRows: true,
  footer: "default",
  headerDepth: 2,
  importExceptFields: { 0: "id" },
};

function ErrorCompare(props) {
  const [username] = useUserStore((state) => [state.username]);
  //1. view page data store
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);

  //2. grid Object
  const [grid1, setGrid1] = useState(null);
  const [option1, setOption1] = useState([]);
  const [itemPopupOpen, setItemPopupOpen] = useState(false);
  const [accountPopupOpen, setAccountPopupOpen] = useState(false);

  // grid Object init
  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, "grid1");
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        setGrid1(grdObj1);
      }
    }
  }, [viewData]);

  const barChart = useRef();

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
      versionId: "",
      accuracy: "",
      itemCd: "",
      itemNm: "",
      accountCd: "",
      accountNm: "",
    },
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

  const setVersionId = () => {
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_BF_00_VERSION_Q1",
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          let dataArr = [];
          let rstArr1 = [];
          let rstArr2 = [];
          dataArr = res.data.RESULT_DATA;
          let listItemObj;
          let listAccObj;

          for (let i = 0, len = dataArr.length; i < len; i++) {
            let row = dataArr[i];
            if (row !== null) {
              listItemObj = { value: row.VER_CD, label: transLangKey(row.VER_CD) };
              listAccObj = { value: row.RULE_01, label: row.RULE_01 };
              rstArr1.push(listItemObj);
              rstArr2.push(listAccObj);
            }
          }
          setOption1(rstArr1);
          setValue("versionId", rstArr1[0].value);
          setValue("accuracy", rstArr2[0].value);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  useEffect(() => {
    setVersionId();
  }, []);

  /** 이벤트 핸들러 */
  const onSubmit = (data) => {
    loadData(data);
    let chartArr = {
          labels: [],
          datasets: [],
        };
    setBarData(chartArr);
  };

  function refresh() {
    reset();
    grid1.dataProvider.clearRows();
    // setChartData('');

    let chartArr = {
      labels: [],
      datasets: [],
    };
    setBarData(chartArr);
    setVersionId();
  }

  const afterGridCreate = (gridObj, gridView, dataProvider) => {
    setGrid1(gridObj);
    gridObj.gridView.displayOptions.fitStyle = "fill";
    gridObj.gridView.onCellClicked = function (grid, index, itemIndex) {
      if (index.cellType === "data") {
        loadDataChart1(grid, index.itemIndex);
      }
    };
  };

  function makeCrossTabFieldsAndColumns(grid, columns, direction, columnPrefix, columnPostfix, resultData) {
    let dataFieldNames = [];

    dataFieldNames = Object.keys(resultData[0]);

    let dynamicNames = [];
    let names = [];
    for (let dataFieldIdx = 0, dataFieldLen = dataFieldNames.length; dataFieldIdx < dataFieldLen; dataFieldIdx++) {
      let fieldName = dataFieldNames[dataFieldIdx];
      if (fieldName.startsWith(columnPrefix)) {
        dynamicNames.push(fieldName);
      }
    }

    dynamicNames.sort(function (a, b) {
      let ac = a.replace(columnPrefix, "");
      let bc = b.replace(columnPrefix, "");
      if (ac > bc) {
        return 1;
      } else if (ac < bc) {
        return -1;
      } else {
        return 0;
      }
    });

    // let yearArray = [];
    // let monthArray = [];
    let dynamicDateCols = [];

    dynamicNames.map(function (header) {
      dynamicDateCols.push({
        name: header,
        dataType: "number",
        headerText: header.replace(columnPrefix, ""),
        editable: false,
        textAlignment: "right",
        visible: true,
      });
    });
    let created_columns = columns.concat(dynamicDateCols);

    grid.addGridItems(created_columns, true);
  }

  function loadData() {
    let params = new URLSearchParams();

    params.append("VER_ID", getValues("versionId"));
    params.append("ITEM_CD", getValues("itemCd"));
    params.append("ITEM_NM", getValues("itemNm"));
    params.append("ACCOUNT_CD", getValues("accountCd"));
    params.append("ACCOUNT_NM", getValues("accountNm"));
    params.append("CROSSTAB", JSON.stringify(grid1.gridView.crossTabInfo));

    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_BF_52_Q1",
      data: params,
    })
      .then(function (res) {
        let dataArr = [];
        if (res.status === gHttpStatus.SUCCESS) {
          // refresh();

          dataArr = res.data.RESULT_DATA;
          let columnPrefix = "ENGINE_TP_CD_";
          let columnPostfix = null;

          makeCrossTabFieldsAndColumns(grid1, grid1Items, "horizontal", columnPrefix, columnPostfix, dataArr);
          grid1.dataProvider.fillJsonData(dataArr);
          // grid1.setData(dataArr);

          if (grid1.dataProvider.getRowCount() == 0) {
            grid1.gridView.setDisplayOptions({ showEmptyMessage: true, emptyMessage: transLangKey("MSG_NO_DATA") });
          }
        }
      })
      .catch(function (err) {
        console.log(err);
        let chartArr = {
          labels: [],
          datasets: [],
        };
        setBarData(chartArr);
      });
  }

  function loadDataChart1(gridView, idx) {
    let chartArr = {};

    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_SP_UI_BF_52_Q2",
      params: {
        VER_ID: getValues("versionId"),
        ITEM_CD: gridView.getDataSource().getValue(idx, "ITEM_CD"),
        ACCOUNT_CD: gridView.getDataSource().getValue(idx, "ACCOUNT_CD"),
      },
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          let dataArr = [];
          dataArr = res.data.RESULT_DATA;

          let listLabels = [];
          let chartData = []; //[PR:[qty1,qty2,...],RF,TF,XGB,Z_ACT_SALES,ZAR1]

          dataArr.map((row) => {
            if (row !== null) {
              let isEngineTpKey = chartData.hasOwnProperty(row.ENGINE_TP_CD);
              let isBukt = listLabels.indexOf(row.MMWW) > -1 ? true : false;

              if (!isBukt) {
                listLabels.push(row.MMWW);
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

          let dataset = [];
          if (chartData.PR) {
            dataset.push({
              type: "line",
              label: transLangKey("PR_QTY"),
              code: "PR",
              data: chartData.PR,
              backgroundColor: "#84D0E6",
              borderColor: "#84D0E6",
            });
          }
          if (chartData.RF) {
            dataset.push({
              type: "line",
              label: transLangKey("RF_QTY"),
              code: "RF",
              data: chartData.RF,
              backgroundColor: "#85CA85",
              borderColor: "#85CA85",
            });
          }
          if (chartData.TF) {
            dataset.push({
              type: "line",
              label: transLangKey("TF_QTY"),
              code: "TF",
              data: chartData.TF,
              backgroundColor: "#F2B661",
              borderColor: "#F2B661",
            });
          }
          if (chartData.XGB) {
            dataset.push({
              type: "line",
              label: transLangKey("XGB_QTY"),
              code: "XGB",
              data: chartData.XGB,
              backgroundColor: "#FFA500",
              borderColor: "#FFA500",
            });
          }
          if (chartData.ZAR1) {
            dataset.push({
              type: "line",
              label: transLangKey("ZAR1_QTY"),
              code: "ZAR1",
              data: chartData.ZAR1,
              backgroundColor: "#DA3B36",
              borderColor: "#DA3B36",
            });
          }
          if (chartData.CRST) {
            dataset.push({
              type: "line",
              label: transLangKey("CRST_QTY"),
              code: "CRST",
              data: chartData.CRST,
              backgroundColor: "#5cb85c",
              borderColor: "#5cb85c",
            });
          }
          if (chartData.SMA) {
            dataset.push({
              type: "line",
              label: transLangKey("SMA_QTY"),
              code: "SMA",
              data: chartData.SMA,
              backgroundColor: "#949ae9",
              borderColor: "#949ae9",
            });
          }
          if (chartData.Z_ACT_SALES) {
            dataset.push({
              type: "bar",
              label: transLangKey("ACT_SALES_QTY"),
              code: "ACT_SALES",
              data: chartData.Z_ACT_SALES,
              backgroundColor: "#71A8D7",
              borderColor: "#71A8D7",
            });
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

  function setItemCd(items) {
    let itemCdArr = [];
    let itemNmArr = [];
    items.forEach(function (row) {
      itemCdArr.push(row.ITEM_CD);
      itemNmArr.push(row.ITEM_NM);
    });
    setValue("itemCd", itemCdArr.join("|"));
    setValue("itemNm", itemNmArr.join("|"));
  }

  function setAccountCd(accounts) {
    let accountCdArr = [];
    let accountNmArr = [];
    accounts.forEach(function (account) {
      accountCdArr.push(account.ACCOUNT_CD);
      accountNmArr.push(account.ACCOUNT_NM);
    });
    setValue("accountCd", accountCdArr.join("|"));
    setValue("accountNm", accountNmArr.join("|"));
  }

  const reloadPrefInfo = (viewCd, userName, grid, grpCd, gridCd) => {
    if (grid) grid.loadCrossTabInfoAndPrefInfo(viewCd, grpCd, userName);
  };

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <InputField type="select" name="versionId" label={transLangKey("VERSION_ID")} control={control} options={option1} />
            <InputField
              type="action"
              name="itemCd"
              label={transLangKey("ITEM_CD")}
              title={transLangKey("SEARCH")}
              onClick={() => {
                setItemPopupOpen(true);
              }}
              control={control}
              readonly={false}>
              <Icon.Search />
            </InputField>
            <InputField type={"text"} name="itemNm" label={transLangKey("ITEM_NM")} control={control} readonly={false} />
            <InputField
              type="text"
              name="accuracy"
              label={transLangKey("SELECT_CRITERIA")}
              control={control}
              // options={option2}
              readonly={true}
            />
            <InputField
              type="action"
              name="accountCd"
              label={transLangKey("ACCOUNT_CD")}
              title={transLangKey("SEARCH")}
              onClick={() => {
                setAccountPopupOpen(true);
              }}
              control={control}
              readonly={false}>
              <Icon.Search />
            </InputField>
            <InputField type={"text"} name="accountNm" label={transLangKey("ACCOUNT_NM")} control={control} readonly={false} />
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
            <ButtonArea title={transLangKey("UI_BF_52")}>
              <LeftButtonArea>
                <ButtonGroup>
                  <GridExcelExportButton type="icon" grid="grid1" options={excelExportOptions} />
                </ButtonGroup>
              </LeftButtonArea>
            </ButtonArea>
            <Box style={{ height: "calc(100% - 53px" }}>
              <BaseGrid id="grid1" items={grid1Items} viewCd={vom.active} username={username} gridCd="UI_BF_52-RST_CPT_01" afterGridCreate={afterGridCreate}></BaseGrid>
            </Box>
          </Box>
        </ResultArea>
        <StatusArea message={message} show={false}>
          <GridCnt grid="grid1" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")}></GridCnt>
        </StatusArea>
      </ContentInner>
      <PopPersonalize open={personalizeOpen} onClose={() => setPersonalizeOpen(false)} resetCallback={reloadPrefInfo} viewCd={vom.active} grid={grid1} username={username} authTpId={""}></PopPersonalize>
      {itemPopupOpen && <PopSelectItemLvItem open={itemPopupOpen} onClose={() => setItemPopupOpen(false)} multiple={false} confirm={setItemCd} values={""} accountCd={getValues("accountCd")} title="ITEM"></PopSelectItemLvItem>}
      {accountPopupOpen && <PopSelectSalesLvAccount open={accountPopupOpen} onClose={() => setAccountPopupOpen(false)} multiple={false} confirm={setAccountCd} values={""} itemCd={getValues("itemCd")} title="ACCOUNT"></PopSelectSalesLvAccount>}
    </>
  );
}

export default ErrorCompare;
