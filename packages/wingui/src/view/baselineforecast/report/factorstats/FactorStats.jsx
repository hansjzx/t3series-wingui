import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Box, ButtonGroup, Button, Paper, IconButton } from "@mui/material";
import {
  ContentInner,
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
  CommonBtn,
  BaseGrid,
  GridExcelExportButton,
  GridExcelImportButton,
  GridExcelDown,
  GridCnt,
  useViewStore,
  useStyles,
  zAxios,
} from "@zionex/wingui-core/src/common/imports";
import PopSelectItem from "@wingui/view/common/PopSelectItem";
import PopSelectAccount from "@wingui/view/common/PopSelectAccount";;
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import SearchIcon from "@mui/icons-material/Search";


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
  { name: "FACTOR_CD", dataType: "text", headerText: "FACTOR_CD", visible: true, editable: false, width: "100", textAlignment: "center" },
  { name: "DESCRIP", dataType: "text", headerText: "DESCRIP", visible: true, editable: false, width: "100", textAlignment: "center" },
  { name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: "100", textAlignment: "center" },
  { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: "100", textAlignment: "center" },
  { name: "ACCOUNT_CD", dataType: "text", headerText: "ACCOUNT_CD", visible: true, editable: false, width: "100", textAlignment: "center" },
  { name: "ACCOUNT_NM", dataType: "text", headerText: "ACCOUNT_NM", visible: true, editable: false, width: "100", textAlignment: "center" },
  { name: "COUNT", dataType: "number", headerText: "COUNT", visible: true, editable: false, width: "50" },
  { name: "AVG", dataType: "number", headerText: "AVG", visible: true, editable: false, width: "50", numberFormat: "#,###.###" },
  { name: "STDEV", dataType: "number", headerText: "STDEV", visible: true, editable: false, width: "50", numberFormat: "#,###.###" },
  { name: "MIN", dataType: "number", headerText: "MIN", visible: true, editable: false, width: "50", numberFormat: "#,###.###" },
  { name: "MAX", dataType: "number", headerText: "MAX", visible: true, editable: false, width: "50", numberFormat: "#,###.###" },
  { name: "MODE", dataType: "number", headerText: "MODE", visible: true, editable: false, width: "50", numberFormat: "#,###.###" },
  { name: "COV", dataType: "number", headerText: "COV", visible: true, editable: false, width: "50", numberFormat: "#,###.###" },
];

function FactorStats(props) {
  const classes = useStyles();
  //1. view 페이지 데이타 store
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);

  //2. 그리드 Object
  const [grid1, setGrid1] = useState(null);
  const [grid2, setGrid2] = useState(null);

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
      fromDate: new Date(new Date().setFullYear(new Date().getFullYear() - 3)),
      toDate: new Date(),
      factorCd: "",
      factorDescrip: "",
      itemCd: "",
      itemNm: "",
      acctCd: "",
      acctNm: "",
      factorSet: "",
    },
  });

  const excelExportOptions = {
    lookupDisplay: false,
    // allColumns: true,
    separateRows: true,
    footer: "default",
    headerDepth: 2,
    importExceptFields: { 0: "id" },
  };

  function exportExcel() {
    if (tabValue === "grid1") {
      grid1.exportExcel();
    }
    if (tabValue === "grid2") {
      grid2.exportExcel();
    }
  }

  const [option1, setOption1] = useState([]);
  const [tabValue, setTabValue] = React.useState("grid1");
  const [itemPopupOpen, setItemPopupOpen] = useState(false);
  const [accountPopupOpen, setAccountPopupOpen] = useState(false);

  // 그리드 Object 초기화
  useEffect(() => {
    setSearchCombo();

    const grdObj1 = getViewInfo(vom.active, "grid1");
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        setGrid1(grdObj1);
      }
    }

    const grdObj2 = getViewInfo(vom.active, "grid2");
    if (grdObj2) {
      if (grdObj2.dataProvider) {
        setGrid2(grdObj2);
      }
    }
  }, [viewData]);

  useEffect(() => {
    if (grid1) {
      setOptionsGrid1();
    }
    if (grid2) {
      setOptionsGrid2();
    }
  }, [grid1, grid2]);

  /** 이벤트 핸들러 */
  function onSubmit(data) {
    if (grid1) {
      grid1LoadData(data);
    }
    if (grid2) {
      grid2LoadData(data);
    }
  }

  const tabChange = async (event, newValue) => {
    setTabValue(newValue);
  };

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
  ];

  useEffect(() => {
    if (grid1) {
      setViewInfo(vom.active, "globalButtons", globalButtons);
    }
  }, [grid1]);

  const onError = (errors, e) => {
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey("WARNING"), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  };

  function refresh() {
    reset();
    grid1.dataProvider.clearRows();
    grid2.dataProvider.clearRows();
  }

  function setOptionsGrid1() {
    grid1.gridView.displayOptions.fitStyle = "fill";
  }

  function setOptionsGrid2() {
    grid2.gridView.displayOptions.fitStyle = "fill";
  }

  // comboBox init
  function setSearchCombo() {
    let dataArr;
    let rstArr;
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_BF_FACTOR_SET_CD",
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          dataArr = [];
          rstArr = [];
          dataArr = res.data.RESULT_DATA;

          for (var i = 0, len = dataArr.length; i < len; i++) {
            var row = dataArr[i];
            if (row !== null) {
              var listItemObj = { value: row.CD, label: row.CD };
              rstArr.push(listItemObj);
            }
          }
          setOption1(rstArr);
          setValue("factorSet", rstArr[0].value);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function grid1LoadData() {
    let param = new URLSearchParams();
    param.append("FROM_DATE", getValues("fromDate").format("yyyy-MM-ddT00:00:00"));
    param.append("TO_DATE", getValues("toDate").format("yyyy-MM-ddT00:00:00"));
    param.append("FACTOR_CD", getValues("factorCd"));
    param.append("FACTOR_DESCRIP", getValues("factorDescrip"));
    param.append("FACTOR_SET", getValues("factorSet") === null ? "" : getValues("factorSet"));
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_BF_56_Q1",
      data: param,
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

  function grid2LoadData() {
    let param = new URLSearchParams();
    param.append("FROM_DATE", getValues("fromDate").format("yyyy-MM-ddT00:00:00"));
    param.append("TO_DATE", getValues("toDate").format("yyyy-MM-ddT00:00:00"));
    param.append("FACTOR_CD", getValues("factorCd"));
    param.append("FACTOR_DESCRIP", getValues("factorDescrip"));
    param.append("ITEM_CD", getValues("itemCd"));
    param.append("ITEM_NM", getValues("itemNm"));
    param.append("ACCT_CD", getValues("acctCd"));
    param.append("ACCT_NM", getValues("acctNm"));
    param.append("FACTOR_SET", getValues("factorSet") === null ? "" : getValues("factorSet"));
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_BF_56_Q2",
      data: param,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          grid2.dataProvider.fillJsonData(res.data.RESULT_DATA);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  const openItemPopup = () => {
    setItemPopupOpen(true);
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

  const openAccountPopup = () => {
    setAccountPopupOpen(true);
  };

  function setAccountCd(accounts) {
    let accountCdArr = [];
    let accountNmArr = [];
    accounts.forEach(function (account) {
      accountCdArr.push(account.ACCOUNT_CD);
      accountNmArr.push(account.ACCOUNT_NM);
    });
    setValue("acctCd", accountCdArr.join("|"));
    setValue("acctNm", accountNmArr.join("|"));
  }
  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <InputField name="fromDate" type="datetime" label={transLangKey("FROM_DATE")} control={control} dateformat="yyyy-MM-dd" />
            <InputField name="toDate" type="datetime" label={transLangKey("TO_DATE")} control={control} dateformat="yyyy-MM-dd" />
            <InputField name="factorCd" label={transLangKey("FACTOR_CD")} control={control} readonly={false} />
            <InputField name="factorDescrip" label={transLangKey("FACTOR_DESCRIP")} control={control} readonly={false} />
          </SearchRow>
          <SearchRow>
            <InputField
              type="action"
              name="itemCd"
              label={transLangKey("ITEM_CD")}
              title={transLangKey("SEARCH")}
              onClick={() => {
                openItemPopup();
              }}
              control={control}
              readonly={false}>
              <Icon.Search />
            </InputField>
            <InputField name="itemNm" label={transLangKey("ITEM_NM")} control={control} readonly={false} />
            <InputField
              type="action"
              name="acctCd"
              label={transLangKey("ACCOUNT_CD")}
              title={transLangKey("SEARCH")}
              onClick={() => {
                openAccountPopup();
              }}
              control={control}
              readonly={false}>
              <Icon.Search />
            </InputField>
            <InputField name="acctNm" label={transLangKey("ACCOUNT_NM")} control={control} />
          </SearchRow>
        </SearchArea>
        <ButtonArea title={transLangKey("UI_BF_56")}>
          <LeftButtonArea></LeftButtonArea>
          <RightButtonArea></RightButtonArea>
        </ButtonArea>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={tabChange} indicatorColor="primary">
            <Tab label={transLangKey("FACTOR")} value="grid1" />
            <Tab label={transLangKey("SALES_FACTOR")} value="grid2" />
          </Tabs>
        </Box>

        <Box
          style={{
            marginTop: "3px",
            width: "100%",
            height: "100%",
          }}>
          <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "grid1" ? "block" : "none" }}>
            <Box style={{ height: "100%" }}>
              <GridExcelExportButton type="icon" grid="grid1" options={excelExportOptions}></GridExcelExportButton>
              <BaseGrid id="grid1" items={grid1Items}></BaseGrid>
            </Box>
          </Box>
          <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "grid2" ? "block" : "none" }}>
            <Box style={{ height: "100%" }}>
              <GridExcelExportButton type="icon" grid="grid2" options={excelExportOptions}></GridExcelExportButton>
              <BaseGrid id="grid2" items={grid2Items}></BaseGrid>
            </Box>
          </Box>
        </Box>
      </ContentInner>
      {itemPopupOpen && <PopSelectItem open={itemPopupOpen} onClose={() => setItemPopupOpen(false)} confirm={setItemCd}></PopSelectItem>}
      {accountPopupOpen && <PopSelectAccount open={accountPopupOpen} onClose={() => setAccountPopupOpen(false)} confirm={setAccountCd}></PopSelectAccount>}
    </>
  );
}

export default FactorStats;
