import React, { useState, useEffect, useRef } from "react";
import { useForm, watch } from "react-hook-form";
import { PolarArea, Bar, Line, Chart } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Box, ButtonGroup, Button, Paper, IconButton } from "@mui/material";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);
import { useUserStore } from "@zionex/wingui-core/src/store/userStore";

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

import "./versioncompare.css";
import PopPersonalize from "@wingui/view/common/PopPersonalize";

const excelExportOptions = {
  lookupDisplay: false,
  // allColumns: true,
  separateRows: true,
  footer: "default",
  headerDepth: 2,
  importExceptFields: { 0: "id" },
};

function VersionCompare() {
  const [grid1Items, setGrid1Items] = useState([
    { name: "BASE_DATE", dataType: "datetime", headerText: "BASE_DATE", visible: true, editable: false, width: "50", textAlignment: "center", format: "yyyy-MM-dd" },
    { name: "ACT_SALES_QTY", dataType: "float", headerText: "ACT_SALES_QTY", visible: true, editable: false, width: "100", textAlignment: "center" },
    {
      name: "VER_CD",
      dataType: "text",
      headerText: "VER_CD",
      visible: true,
      editable: false,
      width: "100",
      textAlignment: "right",
      iteration: { prefix: "VER_CD_", prefixRemove: "true", postfix: "" },
    },
  ]);

  const [username] = useUserStore((state) => [state.username]);
  const [setViewInfo] = useViewStore((state) => [state.setViewInfo]);

  //2. grid Object
  const [grid1, setGrid1] = useState(null);

  const [itemPopupOpen, setItemPopupOpen] = useState(false);
  const [accountPopupOpen, setAccountPopupOpen] = useState(false);
  const [engineOption, setEngineOption] = useState([]);
  const [verNumOption, setVerNumOption] = useState([]);
  const [personalizeOpen, setPersonalizeOpen] = useState(false);
  const [chart1Data, setChart1Data] = useState({
    labels: [],
    datasets: [
      {
        label: [],
        data: [],
      },
    ],
  });

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

  useEffect(() => {
    setEngineTpCd();
    setVerNum();
  }, []);

  useEffect(() => {
    if (grid1) {
      setViewInfo(vom.active, "globalButtons", globalButtons);
      setOptions();
    }
  }, [grid1]);

  const reloadPrefInfo = (viewCd, userName, grid, grpCd) => {
    if (grid) grid.loadCrossTabInfoAndPrefInfo(viewCd, grpCd, userName);
  };

  const afterGridCreate = (gridObj, gridView, dataProvider) => {
    setGrid1(gridObj);
  };

  const onSubmit = (data) => {
    loadData(data);
  };

  function refresh() {
    reset();
    grid1.dataProvider.clearRows();
    setChart1Data("");
    setEngineTpCd();
    setVerNum();
  }

  function setOptions() {
    grid1.gridView.displayOptions.fitStyle = "evenFill";
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
    const gridView = grid1.gridView;
    const dataProvider = grid1.dataProvider;
    let params = new URLSearchParams();
    params.append("ITEM_CD", getValues("itemCd"));
    params.append("ACCOUNT_CD", getValues("accountCd"));
    params.append("VER_CNT", getValues("verCnt"));
    params.append("ENGINE_TP_CD", getValues("engineTpCd"));
    params.append("CROSSTAB", JSON.stringify(gridView.crossTabInfo));

    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_BF_53_Q1",
      data: params,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          dataArr = res.data.RESULT_DATA;
          grid1.setData(dataArr);

          let fieldNames = dataProvider.getFieldNames().filter(function (name) {
            return name.includes("VER_CD_");
          });

          var dataRows = new Array();
          var fcstVals = new Array();

          for (var i = 0; i < fieldNames.length; i++) {
            fcstVals.push(dataProvider.getValue(i, fieldNames[i]));
          }
          for (var i = fieldNames.length; i <= dataProvider.getRowCount(); i++) {
            dataRows.push(i);
          }

          var baseDate = dataProvider.getFieldValues("BASE_DATE", 0, -1);
          var labels = [];
          for (var i = 0; i < baseDate.length; i++) {
            labels.push(baseDate[i].format("yyyy-MM-dd"));
          }
          var sales = dataProvider.getFieldValues("ACT_SALES_QTY", 0, -1);
          var lastFcst = dataProvider.getFieldValues(fieldNames[fieldNames.length - 1], fieldNames.length, -1);
          var fcst = fcstVals.concat(lastFcst);

          // fill grid cell
          gridView.setCellStyleCallback(function (grid, dataCell) {
            var ret = {};
            var columnName = dataCell.index.column.name;
            var rowIndex = dataCell.index.itemIndex;

            if (columnName === "ACT_SALES_QTY") {
              ret.styleName = "sales-color";
            } else if (dataRows.includes(rowIndex) && columnName === fieldNames[fieldNames.length - 1]) {
              ret.styleName = "forecast-color";
            }

            for (var i in fieldNames) {
              if (rowIndex == i && columnName === fieldNames[i]) {
                ret.styleName = "forecast-color";
              }
            }
            return ret;
          });

          loadChartData(labels, sales, fcst);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function loadChartData(labels, sales, fcst) {
    let chartData = {
      labels: labels,
      datasets: [
        {
          label: transLangKey("BF_QTY"),
          data: fcst,
          type: "line",
          backgroundColor: "#AA428BCA",
          borderColor: "#AA428BCA",
        },
        {
          label: transLangKey("ACT_SALES_QTY"),
          data: sales,
          type: "bar",
          backgroundColor: "#71A8D7",
          borderColor: "#71A8D7",
        },
      ],
    };
    setChart1Data(chartData);
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
            <InputField type="select" name="verCnt" label={transLangKey("VER_NUM")} control={control} readonly={true} options={verNumOption} />
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
            <ButtonArea title={transLangKey("UI_BF_53")}>
              <LeftButtonArea>
                <ButtonGroup>
                  <GridExcelExportButton type="icon" grid="grid1" options={excelExportOptions} />
                </ButtonGroup>
              </LeftButtonArea>
            </ButtonArea>
            <Box style={{ height: "calc(100% - 53px" }}>
              <BaseGrid id="grid1" items={grid1Items} viewCd={vom.active} gridCd={vom.active + "-RST_CPT_02"} userName={username} afterGridCreate={afterGridCreate}></BaseGrid>
            </Box>
          </Box>
        </ResultArea>
      </ContentInner>
      {itemPopupOpen && <PopSelectItem open={itemPopupOpen} onClose={() => setItemPopupOpen(false)} confirm={setItemCd}></PopSelectItem>}
      {accountPopupOpen && <PopSelectAccount open={accountPopupOpen} onClose={() => setAccountPopupOpen(false)} confirm={setAccountCd}></PopSelectAccount>}
      <PopPersonalize open={personalizeOpen} onClose={() => setPersonalizeOpen(false)} resetCallback={reloadPrefInfo} viewCd={vom.active} grid={grid1} username={username} authTpId={""}></PopPersonalize>
    </>
  );
}

export default VersionCompare;
