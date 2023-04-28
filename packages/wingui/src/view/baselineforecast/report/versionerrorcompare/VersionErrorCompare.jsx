import React, { useState, useEffect, useRef } from "react";
import { useForm, watch } from "react-hook-form";
import { PolarArea, Bar, Line, Chart } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Box, ButtonGroup, Button, Paper, IconButton } from "@mui/material";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

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
  useStyles,
  zAxios,
  SearchItem,
} from "@zionex/wingui-core/src/common/imports";
import PopSelectItem from "@wingui/view/common/PopSelectItem";
import PopSelectAccount from "@wingui/view/common/PopSelectAccount";

const excelExportOptions = {
  lookupDisplay: false,
  // allColumns: true,
  separateRows: true,
  footer: "default",
  headerDepth: 2,
  importExceptFields: { 0: "id" },
};

function VersionErrorCompare() {
  const [grid1Items, setGrid1Items] = useState([
    //거래처 코드, 거래처명, 품목코드, 품목명, WAPE, 선택순서, 예측 알고리즘, 날짜
    { name: "BUKT", dataType: "text", headerText: "BUKT", visible: true, editable: false, width: "50", textAlignment: "center" },
    { name: "VER_CD", dataType: "text", headerText: "VER_CD", visible: false, editable: false, width: "100", textAlignment: "center" },
    { name: "ERROR", dataType: "text", headerText: "ERROR", visible: false, editable: false, width: "100", textAlignment: "center" },
  ]);

  let grid1InitFields;
  let grid1InitColumns;

  //1. view page data store
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);

  //2. grid Object
  const [grid1, setGrid1] = useState(null);

  const [itemPopupOpen, setItemPopupOpen] = useState(false);
  const [accountPopupOpen, setAccountPopupOpen] = useState(false);
  const [engineOption, setEngineOption] = useState([]);
  const [verNumOption, setVerNumOption] = useState([]);
  const [criteriaOption, setCriteriaOption] = useState([]);
  const [prefInfoObj, setPrefInfoObj] = useState(null);
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
  const [chart1Data, setChart1Data] = useState({
    labels: [],
    datasets: [
      {
        label: [],
        data: [],
      },
    ],
  });

  // grid Object init
  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, "grid1");
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        setGrid1(grdObj1);
      }
    }
  }, [viewData]);

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
      verCnt: "",
      engineTpCd: "",
      errTp: "",
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
  ];

  const setEngineTpCd = () => {
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_BF_00_ENGINE_TP",
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          let rstArr = [];
          let dataArr = res.data.RESULT_DATA;
          let listItemObj;

          for (let i = 0, len = dataArr.length; i < len; i++) {
            let row = dataArr[i];
            if (row !== null) {
              listItemObj = { value: row.ENGINE_TP_CD, label: transLangKey(row.ENGINE_TP_CD) };
              rstArr.push(listItemObj);
            }
          }
          setEngineOption(rstArr);
          setValue("engineTpCd", rstArr[0].value);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const setVerNum = () => {
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_BF_53_Q0",
      params: { VER_CNT_YN: "Y" },
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          let verRstArr = [];
          let verDataArr = res.data.RESULT_DATA;
          let verListItemObj;

          for (let i = 0, len = verDataArr.length; i < len; i++) {
            let row = verDataArr[i];
            if (row !== null) {
              verListItemObj = { value: row.NUM, label: row.NUM };
              verRstArr.push(verListItemObj);
            }
          }
          setVerNumOption(verRstArr);
          setValue("verCnt", verRstArr[verDataArr.length - 1].value);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const setCriteria = () => {
    let param = new URLSearchParams();
    param.append("SP_UI_DP_00_CONF_Q1_01", "BF_SELECT_CRITERIA");
    param.append("SP_UI_DP_00_CONF_Q1_02", "");
    param.append("SP_UI_DP_00_CONF_Q1_03", "");
    param.append("timeout", 0);

    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_00_CONF_Q1",
      params: param,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          let rstArr = [];
          let dataArr = res.data.RESULT_DATA;
          let listItemObj;

          for (let i = 0, len = dataArr.length; i < len; i++) {
            let row = dataArr[i];
            if (row !== null) {
              listItemObj = { value: row.CD, label: transLangKey(row.CD) };
              rstArr.push(listItemObj);
            }
          }
          setCriteriaOption(rstArr);
          setValue("errTp", rstArr[0].value);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  useEffect(() => {
    setEngineTpCd();
    setVerNum();
    setCriteria();
  }, []);

  useEffect(() => {
    if (grid1) {
      setViewInfo(vom.active, "globalButtons", globalButtons);
      setOptions();
    }
  }, [grid1]);

  const afterGridCreate = (gridObj, gridView, dataProvider) => {
    setGrid1(gridObj);
    setGrid1Option(gridObj);
  };

  const setGrid1Option = (grid) => {
    grid1InitFields = grid.dataProvider.getFields();
    grid1InitColumns = grid.gridView.getColumns();
  };

  const onSubmit = (data) => {
    loadData(data);
  };

  function refresh() {
    reset();
    setChart1Data({labels: [], datasets: []});
    grid1.dataProvider.clearRows();
    setEngineTpCd();
    setVerNum();
    setCriteria();
  }

  function setOptions() {
    grid1.gridView.setEditOptions({
      insertable: true,
      appendable: true,
    });
    grid1.gridView.displayOptions.fitStyle = "evenFill";
  }

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
    if (!getValues("itemCd")) {
      showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_0017"), { close: false });
      return;
    }
    if (!getValues("accountCd")) {
      showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_0015"), { close: false });
      return;
    }
    let dataArr;
    let params = new URLSearchParams();
    params.append("ITEM_CD", getValues("itemCd"));
    params.append("ACCOUNT_CD", getValues("accountCd"));
    params.append("VER_CNT", getValues("verCnt"));
    params.append("ENGINE_TP_CD", getValues("engineTpCd"));
    params.append("ERR_TP", getValues("errTp"));
    params.append("CROSSTAB", JSON.stringify(grid1.gridView.crossTabInfo));

    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_BF_54_Q1",
      data: params,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          dataArr = res.data.RESULT_DATA;
          let columnPrefix = "VER_CD_";
          let columnPostfix = null;

          makeCrossTabFieldsAndColumns(grid1, grid1Items, "horizontal", columnPrefix, columnPostfix, dataArr);
          grid1.dataProvider.fillJsonData(dataArr);
          // grid1.setData(dataArr)

          loadChartData();
        }
      })
      .catch(function (err) {
        console.log(err);
        grid1.dataProvider.clearRows();
        setChart1Data({labels: [], datasets: []});
      });
  }

  function loadChartData() {
    let params = new URLSearchParams();
    params.append("ITEM_CD", getValues("itemCd"));
    params.append("ACCOUNT_CD", getValues("accountCd"));
    params.append("VER_CNT", getValues("verCnt"));
    params.append("ENGINE_TP_CD", getValues("engineTpCd"));
    params.append("ERR_TP", getValues("errTp"));

    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_BF_54_CHART_Q1",
      data: params,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          let resData = res.data.RESULT_DATA;
          let listLabels = [];
          let chartDataList = [];

          resData.map((row) => {
            if (row !== null) {
              let isVerCd = chartDataList.hasOwnProperty(row.VER_CD);
              let isBukt = listLabels.indexOf(row.BUKT) > -1 ? true : false;

              if (isVerCd) {
                chartDataList[row.VER_CD].push(row.ERROR);
              } else {
                chartDataList[row.VER_CD] = [];
                chartDataList[row.VER_CD].push(row.ERROR);
              }
              if (!isBukt) {
                listLabels.push(row.BUKT);
              }
            }
          });
          let dataSet = [];
          let verCds = Object.keys(chartDataList);
          for (let verCdIdx = 0, verCdsLen = verCds.length; verCdIdx < verCdsLen; verCdIdx++) {
            dataSet.push({
              // type: 'line',
              label: verCds[verCdIdx],
              data: chartDataList[verCds[verCdIdx]],
              borderColor: labelColors[verCdIdx],
            });
          }
          let chartData = {
            labels: listLabels,
            datasets: dataSet,
          };
          console.log(chartData);
          setChart1Data(chartData);
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

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <InputField type="select" name="engineTpCd" label={transLangKey("ENGINE_TP_CD")} control={control} options={engineOption} />
            <InputField type="select" name="verCnt" label={transLangKey("VER_NUM")} control={control} readonly={true} options={verNumOption} />
            <InputField type="select" name="errTp" label={transLangKey("SELECT_CRITERIA")} control={control} options={criteriaOption} />
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
              readonly={false}>
              <Icon.Search />
            </InputField>
            <InputField type={"text"} name="itemNm" label={transLangKey("ITEM_NM")} control={control} readonly={false} />
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
            <Line
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
              data={chart1Data}
              style={{ width: "100%", height: "260px" }}
            />
          </Box>
          <Box>
            <ButtonArea title={transLangKey("UI_BF_54")}>
              <LeftButtonArea>
                <ButtonGroup>
                  <GridExcelExportButton type="icon" grid="grid1" options={excelExportOptions} />
                </ButtonGroup>
              </LeftButtonArea>
            </ButtonArea>
            <Box style={{ height: "calc(100% - 53px" }}>
              <BaseGrid id="grid1" items={grid1Items} viewCd="UI_BF_54" username={"admin"} gridCd="UI_BF_54-RST_CPT_02" afterGridCreate={afterGridCreate}></BaseGrid>
            </Box>
          </Box>
        </ResultArea>
      </ContentInner>
      {itemPopupOpen && <PopSelectItem open={itemPopupOpen} onClose={() => setItemPopupOpen(false)} confirm={setItemCd}></PopSelectItem>}
      {accountPopupOpen && <PopSelectAccount open={accountPopupOpen} onClose={() => setAccountPopupOpen(false)} confirm={setAccountCd}></PopSelectAccount>}
    </>
  );
}

export default VersionErrorCompare;
