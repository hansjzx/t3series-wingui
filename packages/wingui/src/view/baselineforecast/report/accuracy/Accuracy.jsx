import React, { useState, useEffect, useRef } from "react";
import { useForm, watch } from "react-hook-form";
import { PolarArea, Bar, Line } from "react-chartjs-2";
import { Box, ButtonGroup, Button, Paper, IconButton } from "@mui/material";
import { useUserStore } from "@zionex/wingui-core/src/store/userStore";

import { ContentInner, ResultArea, SearchArea, StatusArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow, InputField, GridAddRowButton, GridDelRowButton, GridExcelExportButton, CommonButton, BaseGrid, GridCnt, useViewStore, useStyles, zAxios } from "@zionex/wingui-core/src/common/imports";

import PopSelectItemLvItem from "../../common/PopSelectItemLvItem";
import PopSelectSalesLvAccount from "../../common/PopSelectSalesLvAccount";
import PopPersonalize from "@wingui/view/common/PopPersonalize";

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);
let grid1Items = [
  { name: "GRADE", dataType: "text", headerText: "GRADE", visible: false, editable: false, width: "50", textAlignment: "center" },
  { name: "ITEM", dataType: "text", headerText: "ITEM", visible: true, editable: false, width: "100", textAlignment: "center" },
  { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: "100", textAlignment: "center" },
  { name: "SALES", dataType: "text", headerText: "SALES", visible: true, editable: false, width: "100", textAlignment: "center" },
  { name: "ACCT_NM", dataType: "text", headerText: "ACCT_NM", visible: true, editable: false, width: "100", textAlignment: "center" },
  { name: "ENGINE_TP_CD", dataType: "text", headerText: "ENGINE_TP_CD", visible: true, editable: false, width: "50", textAlignment: "center" },
  { name: "COV", dataType: "text", headerText: "COV", visible: true, editable: false, width: "50", textAlignment: "center" },
  { name: "QTY_RANK", dataType: "text", headerText: "QTY_RANK", visible: true, editable: false, width: "50", textAlignment: "center" },
  { name: "CATEGORY", dataType: "text", headerText: "CATEGORY", visible: true, editable: false, width: "100", lang: true, textAlignment: "center" },
  {
    name: "DATE",
    dataType: "text",
    headerText: "DATE",
    visible: true,
    editable: false,
    width: "100",
    textAlignment: "center",
    iteration: { prefix: "DATE_", prefixRemove: "true", delimiter: "-", postfix: "" },
  },
];

let layoutGrid1 = [
  // 'GRADE',
  "ITEM",
  "ITEM_NM",
  "SALES",
  "ACCT_NM",
  // 'ENGINE_TP_CD',
  // 'COV',
  // 'QTY_RANK',
  "CATEGORY",
];

const excelExportOptions = {
  lookupDisplay: false,
  // allColumns: true,
  separateRows: true,
  footer: "default",
  headerDepth: 2,
  importExceptFields: { 0: "id" },
};

function Accuracy(props) {
  const [username] = useUserStore((state) => [state.username]);
  const [setViewInfo] = useViewStore((state) => [state.setViewInfo]);

  // 그리드 Object
  const [grid1, setGrid1] = useState(null);
  const [personalizeOpen, setPersonalizeOpen] = useState(false);
  const currentIdx = useRef(null);

  // 상태 메시지
  const [message, setMessage] = useState();
  // FORM 데이터 처리
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
    defaultValues: {},
    versionId: '',
  });

  const [option1, setOption1] = useState([]);
  const [option2, setOption2] = useState([]);
  const [option3, setOption3] = useState([]);

  const [lvItemPopupOpen, setLvItemPopupOpen] = useState(false);
  const [lvAccountPopupOpen, setLvAccountPopupOpen] = useState(false);

  const [chartData, setChartData] = useState({
    labels: [],
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
        label: transLangKey("DMND_PRDICT_ACCURCY"),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
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

  const reloadPrefInfo = (viewCd, userName, grid, grpCd) => {
    if (grid) grid.loadCrossTabInfoAndPrefInfo(viewCd, grpCd, userName);
  };

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

  function setItemLv() {
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
          setValue("itemLv", rstArr[0].value);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function setSalesLv() {
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
          setValue("salesLv", rstArr[0].value);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  useEffect(() => {
    if (grid1) {
      setVersionId();
      setItemLv();
      setSalesLv();
    }
  }, [grid1]);

  const afterGridCreate = (gridObj, gridView, dataProvider) => {
    setGrid1(gridObj);
    setOptions(gridObj);
  };

  // 조회조건 버전ID ComboBox 값 변경시 적용범위 변경
  const watchDateRange = watch("versionId");
  useEffect(() => {
    let param = new URLSearchParams();
    param.append("VER_ID", getValues("versionId"));
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_BF_GET_DATETIME_SCOPE_Q2",
      data: param,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          setValue("fromDate", res.data.RESULT_DATA[0].FROM_DATE);
          setValue("toDate", res.data.RESULT_DATA[0].TO_DATE);
          //           setValue('dateRange', [res.data.RESULT_DATA[0].FROM_DATE, res.data.RESULT_DATA[0].TO_DATE]);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }, [watchDateRange]);

  /** 이벤트 핸들러 */
  function onSubmit(data) {
    loadDataGrid1(data);
  }

  // function onError(errors, e){
  // if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
  //   $.each(errors, function (key, value) {
  //   showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
  //   clearErrors();
  //   return false;
  //   });
  //   }
  // }

  function refresh() {
    reset();
    grid1.dataProvider.clearRows();
    setBarData("");
    setVersionId();
    setItemLv();
    setSalesLv();
  }

  function setOptions(gridObj) {
    setVisibleProps(gridObj, true, false, false);
    // gridObj.gridView.setHeader({height: 50 });
    gridObj.gridView.displayOptions.fitStyle = "fill";

    // grid1.gridView.setColumnProperty("GRADE", "mergeRule", { criteria: "value" });
    gridObj.gridView.setColumnProperty("ITEM", "mergeRule", { criteria: "value" });
    gridObj.gridView.setColumnProperty("ITEM_NM", "mergeRule", { criteria: "value" });
    gridObj.gridView.setColumnProperty("SALES", "mergeRule", { criteria: "value" });
    gridObj.gridView.setColumnProperty("ACCT_NM", "mergeRule", { criteria: "value" });
    gridObj.gridView.setColumnProperty("ENGINE_TP_CD", "mergeRule", { criteria: "value" });
    gridObj.gridView.setColumnProperty("COV", "mergeRule", { criteria: "value" });
    gridObj.gridView.setColumnProperty("QTY_RANK", "mergeRule", { criteria: "value" });
    gridObj.gridView.setColumnProperty("CATEGORY", "mergeRule", { criteria: "value" });
    gridObj.gridView.onCellClicked = function (grid, index, itemIndex) {
      if (index.cellType === "data") {
        loadDataChart1(grid, index.itemIndex);
      }
    };
  }

  function nvl(v) {
    return v != undefined ? v : "";
  }

  function loadDataGrid1() {
    let dataArr;

    //     let dateRange = getValues("dateRange");
    let fromdate = new Date(getValues("fromDate")).format("yyyy-MM-ddT00:00:00");
    let todate = new Date(getValues("toDate")).format("yyyy-MM-ddT00:00:00");

    let param = new URLSearchParams();
    param.append("VER_CD", getValues("versionId"));
    param.append("FROM_DATE", fromdate);
    param.append("TO_DATE", todate);
    param.append("ITEM", nvl(getValues("itemLv")));
    param.append("ITEM_CD", nvl(getValues("itemCd")));
    param.append("SALES", nvl(getValues("salesLv")));
    param.append("ACCT_CD", nvl(getValues("accountCd")));
    param.append("GRADE", "N");
    param.append("CROSSTAB", JSON.stringify(grid1.gridView.crossTabInfo));

    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_BF_55_Q1",
      data: param,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          grid1.setData(res.data.RESULT_DATA);
          loadDataChart1(grid1.gridView, 0);
          if (grid1.dataProvider.getRowCount() == 0) {
            grid1.gridView.setDisplayOptions({ showEmptyMessage: true, emptyMessage: transLangKey("MSG_NO_DATA") });
          }
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  // popup Open(item)
  function openPopupItem() {
    setLvItemPopupOpen(true);
    setLvAccountPopupOpen(false);
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
  function openPopupAccount() {
    setLvItemPopupOpen(false);
    setLvAccountPopupOpen(true);
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

  // popup Open(personalize)
  function openPopupPersonalize() {
    setPersonalizeOpen(true);
  }

  function loadDataChart1(gridView, idx) {
    let accryRow = gridView
      .getDataSource()
      .getJsonRows()
      .filter((row) => row.CATEGORY === "DMND_PRDICT_ACCURCY" && row.ITEM === gridView.getDataSource().getValue(idx, "ITEM") && row.SALES === gridView.getDataSource().getValue(idx, "SALES"));

    let fieldNames = gridView
      .getDataSource()
      .getFieldNames()
      .filter(function (name) {
        return name.includes("DATE_");
      });

    let baseDate = fieldNames.map((x) => x.split("_")[1]);
    let accry = [];
    let chartArr = {};

    for (var i = 0; i < fieldNames.length; i++) {
      if (accryRow[0][fieldNames[i]]) {
        accry.push(accryRow[0][fieldNames[i]].slice(0, -1) * 1);
      }
      else {
        accry.push(0);
      }
    }
    chartArr = {
      labels: baseDate,
      datasets: [
        {
          label: transLangKey("ACCRY"),
          data: accry,
          backgroundColor: "rgba(255, 99, 132, 0.5)",
        },
      ],
    };
    setBarData(chartArr);
  }

  return (
    <>
      <ContentInner>
        {/* <ViewPath {...viewPathProps} submit={handleSubmit(onSubmit, onError)}></ViewPath> */}
        <SearchArea>
          <SearchRow>
            <InputField type="select" name="versionId" label={transLangKey("VERSION_ID")} control={control} options={option1} />
            <InputField type="datetime" label={transLangKey("FROM_DATE")} name="fromDate" dateformat="yyyy-MM-dd" control={control} />
            <InputField type="datetime" label={transLangKey("TO_DATE")} name="toDate" dateformat="yyyy-MM-dd" control={control} />
          </SearchRow>
          <SearchRow>
            <InputField type="select" name="itemLv" label={transLangKey("ITEM_LV")} control={control} options={option2} />
            <InputField
              type="action"
              name="itemCd"
              label={transLangKey("ITEM_CD")}
              title={transLangKey("SEARCH")}
              onClick={() => {
                openPopupItem();
              }}
              control={control}>
              <Icon.Search />
            </InputField>
            <InputField name="itemNm" label={transLangKey("ITEM_NM")} control={control} />
            <InputField type="select" name="salesLv" label={transLangKey("SALES_HIER")} control={control} options={option3} />
            <InputField
              type="action"
              name="accountCd"
              label={transLangKey("ACCOUNT_CD")}
              title={transLangKey("SEARCH")}
              onClick={() => {
                openPopupAccount();
              }}
              control={control}>
              <Icon.Search />
            </InputField>
            <InputField name="accountNm" label={transLangKey("ACCOUNT_NM")} control={control} />
          </SearchRow>
        </SearchArea>
        <ResultArea sizes={[50, 50]} direction={"vertical"}>
          <Box>
            <Line
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "right",
                  },
                },
                scales: {
                  yAxis: {
                    min: 0,
                    max: 100,
                  }
                }
              }}
              data={barData}
              style={{ width: "100%", height: "240px" }}
            />
          </Box>
          <Box>
            <ButtonArea title={transLangKey("UI_BF_55")}>
              <LeftButtonArea>
                <ButtonGroup>
                  <GridExcelExportButton type="icon" grid="grid1" options={excelExportOptions} />
                </ButtonGroup>
              </LeftButtonArea>
              <RightButtonArea></RightButtonArea>
            </ButtonArea>
            <Box style={{ height: "calc(100% - 53px" }}>
              <BaseGrid id="grid1" items={grid1Items} viewCd={vom.active} gridCd={vom.active + "-RST_CPT_01"} userName={username} afterGridCreate={afterGridCreate}></BaseGrid>
            </Box>
          </Box>
        </ResultArea>
        <StatusArea message={message} show={false}>
          <GridCnt grid="grid1" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")}></GridCnt>
        </StatusArea>
      </ContentInner>
      {lvItemPopupOpen && (
        <PopSelectItemLvItem
          open={lvItemPopupOpen}
          onClose={() => {
            setLvItemPopupOpen(false);
            setLvAccountPopupOpen(false);
          }}
          confirm={onSetItemCd}
          values={getValues("itemLv")}></PopSelectItemLvItem>
      )}
      {lvAccountPopupOpen && (
        <PopSelectSalesLvAccount
          open={lvAccountPopupOpen}
          onClose={() => {
            setLvItemPopupOpen(false);
            setLvAccountPopupOpen(false);
          }}
          confirm={onSetAccountCd}
          values={getValues("salesLv")}></PopSelectSalesLvAccount>
      )}
      <PopPersonalize open={personalizeOpen} onClose={() => setPersonalizeOpen(false)} resetCallback={reloadPrefInfo} viewCd={vom.active} grid={grid1} username={username} authTpId={""}></PopPersonalize>
    </>
  );
}

export default Accuracy;
