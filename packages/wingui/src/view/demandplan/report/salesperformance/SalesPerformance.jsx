import React, { useState, useEffect } from "react";
import { Bar, Pie, Line } from "react-chartjs-2";
import { useForm } from "react-hook-form";
import { ButtonGroup, Box } from "@mui/material";
import { ContentInner, ResultArea, SearchArea, useIconStyles, StatusArea, ButtonArea, LeftButtonArea, GridCnt, InputField, GridExcelExportButton, BaseGrid, useViewStore, zAxios } from "@zionex/wingui-core/src/common/imports";
import { transLangKey, vom } from "@wingui";
import { excelExportOptions, loadOption, isEmptyArray, dimensionItems } from "@wingui/view/demandplan/DpUtil";
import PopPersonalize from "@wingui/view/common/PopPersonalize";
import PopSelectItem from "@wingui/view/common/PopSelectItem";
import PopSelectAccount from "@wingui/view/common/PopSelectAccount";
import { useUserStore } from "@zionex/wingui-core/src/store/userStore";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend);

let grid1Items = new Array(
  ...dimensionItems,
  ...[
    // { name: "ITEM", dataType: "string", visible: false, editable: false, width: "120", type: "string" },
    // { name: "ACCOUNT", dataType: "string", visible: false, editable: false, width: "120", type: "string" },
    { name: "CATEGORY", dataType: "text", headerText: "Measure", lang: true, visible: true, editable: false, width: "120", textAlignment: "center" },
    { name: "DATE", dataType: "number", headerText: "DATE", visible: true, editable: false, width: "70", numberFormat: "#, ###.###", iteration: { prefix: "DATE_", prefixRemove: "true", delimiter: "," } },
  ]
);

function SalesPerformance(props) {
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
  const iconClasses = useIconStyles();
  const [username] = useUserStore((state) => [state.username]);
  const [message, setMessage] = useState();
  const [setViewInfo] = useViewStore((state) => [state.setViewInfo]);
  const [personalizeOpen, setPersonalizeOpen] = useState(false);
  const [itemPopupOpen, setItemPopupOpen] = useState(false);
  const [accountPopupOpen, setAccountPopupOpen] = useState(false);

  //2. 그리드 Object
  const [grid1, setGrid1] = useState(null);

  //4. FORM 데이터 처리
  const {
    reset,
    getValues,
    setValue,
    control,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: {
      bucketType: "M",
      dateRange: [new Date(new Date().setMonth(new Date().getMonth() - 3)), new Date()],
      itemCd: "",
      itemNm: "",
      accountCd: "",
      accountNm: "",
      valueOption: ["Q"],
    },
  });

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
  let resultData1 = [];
  let resultData2 = [];
  let resultData3 = [];
  let resultData4 = [];

  const [chart1Plugin, setChart1Plugin] = useState({
    legend: {
      display: false,
      position: "top",
    },
    title: {
      display: true,
      text: transLangKey("Item"),
    },
  });

  const [chart2Plugin, setChart2Plugin] = useState({
    legend: {
      display: false,
      position: "top",
    },
    title: {
      display: true,
      text: transLangKey("Sales"),
    },
  });

  const [chart3Plugin, setChart3Plugin] = useState({
    legend: {
      display: false,
      position: "top",
    },
    title: {
      display: true,
      text: transLangKey("ITEM_STATISTIC"),
    },
  });

  const [chart4Plugin, setChart4Plugin] = useState({
    legend: {
      display: false,
      position: "top",
    },
    title: {
      display: true,
      text: transLangKey("SALES_STATISTIC"),
    },
  });

  const [bucketOption, setBucketOption] = useState([]);

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

  const [chart2Data, setChart2Data] = useState({
    labels: [],
    datasets: [
      {
        label: [],
        data: [],
        backgroundColor: labelColors,
      },
    ],
  });

  const [chart3Data, setChart3Data] = useState({
    labels: [],
    datasets: [
      {
        label: [],
        data: [],
        backgroundColor: labelColors[0],
      },
      {
        label: [],
        data: [],
        backgroundColor: labelColors[1],
      },
      {
        label: [],
        data: [],
        backgroundColor: labelColors[2],
      },
    ],
  });

  const [chart4Data, setChart4Data] = useState({
    labels: [],
    datasets: [
      {
        label: [],
        data: [],
        backgroundColor: labelColors[0],
      },
      {
        label: [],
        data: [],
        backgroundColor: labelColors[1],
      },
      {
        label: [],
        data: [],
        backgroundColor: labelColors[2],
      },
    ],
  });

  const globalButtons = [
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
    loadBucket();
  }, []);

  const openItemPopup = () => {
    setItemPopupOpen(true);
  };

  const openAccountPopup = () => {
    setAccountPopupOpen(true);
  };

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

  /** 이벤트 핸들러 */
  function onSubmit(data) {
    if (grid1) {
      loadDataGrid1(data);
      loadDataChart1();
      loadDataChart2();
      loadDataChart3();
      loadDataChart4();
    }
  }

  function refresh() {
    reset();
    grid1.dataProvider.clearRows();

    setChart1Data({
      labels: [],
      datasets: [
        {
          label: [],
          data: [],
          backgroundColor: labelColors,
        },
      ],
    });

    setChart2Data({
      labels: [],
      datasets: [
        {
          label: [],
          data: [],
          backgroundColor: labelColors,
        },
      ],
    });

    setChart3Data({
      labels: [],
      datasets: [
        {
          label: [],
          data: [],
          backgroundColor: labelColors[0],
        },
        {
          label: [],
          data: [],
          backgroundColor: labelColors[1],
        },
        {
          label: [],
          data: [],
          backgroundColor: labelColors[2],
        },
      ],
    });

    setChart4Data({
      labels: [],
      datasets: [
        {
          label: [],
          data: [],
          backgroundColor: labelColors[0],
        },
        {
          label: [],
          data: [],
          backgroundColor: labelColors[1],
        },
        {
          label: [],
          data: [],
          backgroundColor: labelColors[2],
        },
      ],
    });
  }

  const setGrid1Options = (grid) => {
    // grid1.gridView.setHeader({height: 50 });
    grid.gridView.setDisplayOptions({ showEmptyMessage: true, emptyMessage: transLangKey("MSG_NO_DATA") });

    grid.gridView.setDisplayOptions({
      fitStyle: "fill",
    });

    for (let i = 0; i <= 40; i++) {
      let idxStr = i + "";
      idxStr = idxStr.padStart(2, "0");
      grid.gridView.setColumnProperty("DIMENSION_" + idxStr, "mergeRule", { criteria: "value" });
    }
  };

  //bukt
  const loadBucket = async () => {
    const buckets = await loadOption(true, "SRV_GET_REPORT_BUKT", {}, "CD", "NM", false, true);
    //console.log("buckets", buckets);
    setBucketOption(buckets);
    //setValue("bucketType", buckets[0].value);
  };

  function makeParam() {
    let dateRange = getValues("dateRange");
    let fromdate = dateRange ? dateRange[0].format("yyyy-MM-ddT00:00:00") : "19700101";
    let todate = dateRange ? dateRange[1].format("yyyy-MM-ddT00:00:00") : "99991231";

    let param = new URLSearchParams();
    param.append("BUCK", getValues("bucketType"));
    param.append("STRT_DATE", fromdate);
    param.append("END_DATE", todate);
    param.append("ITEM_CD", getValues("itemCd"));
    param.append("ACCT_CD", getValues("accountCd"));
    param.append("OPTION", getValues("valueOption"));
    param.append("UI_ID", "UI_DP_28");
    param.append("AUTH_TP", "DEFAULT");
    param.append("GRID_ID", "UI_DP_28-RST_CPT_01");
    param.append("USER_ID", username);
    param.append("ITEM_LV_CD", getValues("itemCd"));
    param.append("ACCT_LV_CD", getValues("accountCd"));
    param.append("ITEM_ATTR_01", "");
    param.append("ITEM_ATTR_02", "");
    param.append("ITEM_ATTR_03", "");
    param.append("ACCT_ATTR_01", "");
    param.append("ACCT_ATTR_02", "");
    param.append("ACCT_ATTR_03", "");
    param.append("PLAN_TP_ID", "");
    param.append("timeout", 0);
    return param;
  }

  function loadDataGrid1() {
    let param = makeParam();
    param.append("CROSSTAB", JSON.stringify(grid1.gridView.crossTabInfo));

    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/GetReport",
      data: param,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          let dataArr = res.data.RESULT_DATA;
          grid1.setData(dataArr);

          //grid1.dataProvider.fillJsonData(dataArr);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function loadDataChart1() {
    let param = makeParam();

    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_28_CHART_Q1",
      data: param,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          let dataArr = res.data.RESULT_DATA;
          resultData1 = dataArr;
          createChart1();
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function loadDataChart2() {
    let param = makeParam();

    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_28_CHART_Q2",
      data: param,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          let dataArr = res.data.RESULT_DATA;
          resultData2 = dataArr;
          createChart2();
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function loadDataChart3() {
    let param = makeParam();

    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_28_CHART_Q3",
      data: param,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          let dataArr = [];
          dataArr = res.data.RESULT_DATA;
          resultData3 = dataArr;
          createChart3();
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function loadDataChart4() {
    let param = makeParam();

    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_28_CHART_Q4",
      data: param,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          let dataArr = [];
          dataArr = res.data.RESULT_DATA;
          resultData4 = dataArr;
          createChart4();
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function createChart1() {
    let result = Object.assign([], resultData1);

    let chartData = {
      labels: result.map((data) => data.CATEGORY),
      datasets: [
        {
          label: result.map((data) => data.CATEGORY),
          data: result.map((data) => data.COUNT),
          backgroundColor: labelColors,
          borderColor: labelColors,
        },
      ],
    };
    setChart1Data(chartData);
  }

  function createChart2() {
    let result = Object.assign([], resultData2);

    let chartData = {
      labels: result.map((data) => data.CATEGORY),
      datasets: [
        {
          label: result.map((data) => data.CATEGORY),
          data: result.map((data) => data.COUNT),
          backgroundColor: labelColors,
          borderColor: labelColors,
        },
      ],
    };
    setChart2Data(chartData);
  }

  function createChart3() {
    let result = Object.assign([], resultData3);

    result = result.sort(function (a, b) {
      return new Date(a.DATE) - new Date(b.DATE);
    });

    let chartData = {
      labels: result.map((data) => new Date(data.DATE).format("yyyy-MM-dd")),
      datasets: [
        {
          label: result.map((data) => data.CATEGORY)[0],
          data: result.map((data) => data.QTY),
          backgroundColor: labelColors[0],
          borderColor: labelColors[0],
        },
      ],
    };

    setChart3Data(chartData);
  }

  function createChart4() {
    let result = Object.assign([], resultData4);

    result = result.sort(function (a, b) {
      return new Date(a.DATE) - new Date(b.DATE);
    });

    let resutlDate = result.map((data) => new Date(data.DATE).format("yyyy-MM-dd"));
    let filterData = result.map((data) => data.CATEGORY);
    let filterArr = [];
    let filterGroupArr = [];
    let filterGroup = "";
    let rDate = [];
    let mDate = "";
    let dataArr = [];
    let dataObj;
    let qtyArr = [];
    let cnt = 0;

    // 날짜 라벨
    for (let i = 0; i < resutlDate.length; i++) {
      if (i == 0) {
        mDate = resutlDate[0];
        rDate.push(mDate);
      } else {
        if (mDate != resutlDate[i]) {
          cnt = 0;
          for (let j = 0; j < rDate.length; j++) {
            if (rDate[j] == filterData[i]) {
              cnt++;
            }
          }
          if (cnt == 0) {
            mDate = resutlDate[i];
            rDate.push(mDate);
          }
        }
      }
    }

    // category setting
    for (let i = 0; i < filterData.length; i++) {
      if (i == 0) {
        filterGroup = filterData[0];
        filterGroupArr.push(filterGroup);
      } else {
        if (filterGroup != filterData[i]) {
          cnt = 0;
          for (let j = 0; j < filterGroupArr.length; j++) {
            if (filterData[j] == filterData[i]) {
              cnt++;
            }
          }
          if (cnt == 0) {
            filterGroup = filterData[i];
            filterGroupArr.push(filterGroup);
          }
        }
      }
    }

    // data
    for (let i = 0; i < filterGroupArr.length; i++) {
      filterArr = result.filter((data) => data.CATEGORY == filterData[i]);
      qtyArr = [];

      for (let j = 0; j < filterArr.length; j++) {
        qtyArr.push(filterArr.map((data) => data.QTY)[j]);
      }
      dataObj = { label: filterData[i], data: qtyArr, backgroundColor: labelColors[i], borderColor: labelColors[i] };
      dataArr.push(dataObj);
    }

    let chartData = {
      labels: rDate,
      datasets: dataArr,
    };

    setChart4Data(chartData);
  }

  const afterGridCreate1 = (gridObj, gridView, dataProvider) => {
    setGrid1(gridObj);
    setGrid1Options(gridObj);
  };

  const reloadPrefInfo = (viewCd, userName, grid, grpCd, gridCd) => {
    if (grid) grid.loadCrossTabInfoAndPrefInfo(viewCd, grpCd, userName);
  };

  return (
    <>
      <ContentInner>
        <SearchArea>
          <InputField type="select" name="bucketType" label={transLangKey("BUCKET_TP")} control={control} readonly={false} disabled={false} options={bucketOption} />
          <InputField type="dateRange" name="dateRange" label={transLangKey("APPY_SCPE")} control={control} dateformat="yyyy-MM-dd" />
          <InputField
            type="action"
            name="itemCd"
            label={transLangKey("ITEM_CD")}
            control={control}
            onClick={() => {
              openItemPopup();
            }}>
            <Icon.Search />
          </InputField>
          <InputField type={"text"} name="itemNm" label={transLangKey("ITEM_NM")} control={control} readonly={false} />
          <InputField
            type="action"
            name="accountCd"
            label={transLangKey("ACCOUNT_CD")}
            control={control}
            onClick={() => {
              openAccountPopup();
            }}>
            <Icon.Search />
          </InputField>
          <InputField type={"text"} name="accountNm" label={transLangKey("ACCOUNT_NM")} control={control} readonly={false} />
          <InputField
            type="radio"
            name="valueOption"
            label={transLangKey("OPTION")}
            control={control}
            options={[
              { label: transLangKey("QTY"), value: "Q" },
              { label: transLangKey("AMT"), value: "A" },
            ]}
          />
        </SearchArea>
        {/* direction : horizontal, vertical 
          다른 element 를 넣을려면 box 로 감싼다.
        */}
        <ResultArea sizes={[25, 75]} direction={"vertical"}>
          <Box sx={{ display: "flex", height: "100%", flexDirection: "row", alignContent: "stretch", alignItems: "stretch" }}>
            <Box style={{ width: "100%", height: "100%" }}>
              <Pie
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: chart1Plugin,
                }}
                data={chart1Data}
                style={{ width: "100%", height: "100%" }}
              />
            </Box>
            <Box style={{ width: "100%", height: "100%" }}>
              <Pie
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: chart2Plugin,
                }}
                data={chart2Data}
                style={{ width: "100%", height: "100%" }}
              />
            </Box>
            <Box style={{ width: "100%", height: "100%" }}>
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
            <Box style={{ width: "100%", height: "100%" }}>
              <Line
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: chart4Plugin,
                }}
                data={chart4Data}
                style={{ width: "100%", height: "100%" }}
              />
            </Box>
          </Box>
          <Box>
            <ButtonArea>
              <LeftButtonArea>
                <GridExcelExportButton type="icon" grid="grid1" options={excelExportOptions} />
              </LeftButtonArea>
            </ButtonArea>
            <Box style={{ height: "calc(100% - 53px" }}>
              <BaseGrid id="grid1" items={grid1Items} viewCd={vom.active} userName={username} gridCd="UI_DP_28-RST_CPT_01" afterGridCreate={afterGridCreate1}></BaseGrid>
            </Box>
          </Box>
        </ResultArea>
        <StatusArea show={false} message={message}>
          <GridCnt grid="grid1" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")}></GridCnt>
        </StatusArea>
      </ContentInner>
      {itemPopupOpen && <PopSelectItem open={itemPopupOpen} onClose={() => setItemPopupOpen(false)} confirm={setItemCd}></PopSelectItem>}
      {accountPopupOpen && <PopSelectAccount open={accountPopupOpen} onClose={() => setAccountPopupOpen(false)} confirm={setAccountCd}></PopSelectAccount>}
      <PopPersonalize open={personalizeOpen} onClose={() => setPersonalizeOpen(false)} resetCallback={reloadPrefInfo} viewCd={vom.active} grid={[grid1]} username={username} authTpId={""}></PopPersonalize>
    </>
  );
}
export default SalesPerformance;
