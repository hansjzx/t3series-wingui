import React, { useState, useEffect } from "react";
import { ButtonGroup, Tooltip, IconButton } from "@mui/material";
import { useForm } from "react-hook-form";
import { ContentInner, ViewPath, ResultArea, SearchArea, StatusArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow, SplitPanel, InputField, BaseGrid, GridCnt, useViewStore, zAxios, GridExcelExportButton } from "@zionex/wingui-core/src/common/imports";
import PopSelectItemLvItem from "../../common/PopSelectItemLvItem";
import PopSelectSalesLvAccount from "../../common/PopSelectSalesLvAccount";
import "./css/forecasterror.css";

let grid1Items = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: "0" },
  { name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: "80", mergeRule: { criteria: "value" }, textAlignment: "center" },
  { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: "80", mergeRule: { criteria: "value" }, textAlignment: "center" },
  { name: "ACCOUNT_CD", dataType: "text", headerText: "ACCOUNT_CD", visible: true, editable: false, width: "80", mergeRule: { criteria: "value" }, textAlignment: "center" },
  { name: "ACCOUNT_NM", dataType: "text", headerText: "ACCOUNT_NM", visible: true, editable: false, width: "80", mergeRule: { criteria: "value" }, textAlignment: "center" },
  {
    name: "ENGINE_TP_CD",
    dataType: "text",
    headerText: "ENGINE_TP_CD",
    visible: true,
    editable: false,
    width: "100",
    textAlignment: "center",
    styleCallback: function (grid, dataCell) {
      var ret = {};
      var SELECT_SEQ = grid.getValue(dataCell.index.itemIndex, "SELECT_SEQ");
      if (SELECT_SEQ == 1) {
        ret.styleName = "BEST-SELECT";
      }
      return ret;
    },
  },
  {
    name: "MAPE",
    dataType: "number",
    headerText: "MAPE",
    visible: true,
    editable: false,
    width: "100",
    textAlignment: "center",
    styleCallback: function (grid, dataCell) {
      var ret = {};
      var SELECT_SEQ = grid.getValue(dataCell.index.itemIndex, "SELECT_SEQ");
      if (SELECT_SEQ == 1) {
        ret.styleName = "BEST-SELECT";
      }
      return ret;
    },
  },
  {
    name: "MAE",
    dataType: "number",
    headerText: "MAE",
    visible: true,
    editable: false,
    width: "100",
    textAlignment: "center",
    styleCallback: function (grid, dataCell) {
      var ret = {};
      var SELECT_SEQ = grid.getValue(dataCell.index.itemIndex, "SELECT_SEQ");
      if (SELECT_SEQ == 1) {
        ret.styleName = "BEST-SELECT";
      }
      return ret;
    },
  },
  {
    name: "RMSE",
    dataType: "number",
    headerText: "RMSE",
    visible: true,
    editable: false,
    width: "100",
    textAlignment: "center",
    styleCallback: function (grid, dataCell) {
      var ret = {};
      var SELECT_SEQ = grid.getValue(dataCell.index.itemIndex, "SELECT_SEQ");
      if (SELECT_SEQ == 1) {
        ret.styleName = "BEST-SELECT";
      }
      return ret;
    },
  },
  {
    name: "MAE_P",
    dataType: "number",
    headerText: "MAE_P",
    visible: true,
    editable: false,
    width: "100",
    textAlignment: "center",
    styleCallback: function (grid, dataCell) {
      var ret = {};
      var SELECT_SEQ = grid.getValue(dataCell.index.itemIndex, "SELECT_SEQ");
      if (SELECT_SEQ == 1) {
        ret.styleName = "BEST-SELECT";
      }
      return ret;
    },
  },
  {
    name: "RMSE_P",
    dataType: "number",
    headerText: "RMSE_P",
    visible: true,
    editable: false,
    width: "100",
    textAlignment: "center",
    styleCallback: function (grid, dataCell) {
      var ret = {};
      var SELECT_SEQ = grid.getValue(dataCell.index.itemIndex, "SELECT_SEQ");
      if (SELECT_SEQ == 1) {
        ret.styleName = "BEST-SELECT";
      }
      return ret;
    },
  },
  {
    name: "WAPE",
    dataType: "number",
    headerText: "WAPE",
    visible: true,
    editable: false,
    width: "100",
    textAlignment: "center",
    styleCallback: function (grid, dataCell) {
      var ret = {};
      var SELECT_SEQ = grid.getValue(dataCell.index.itemIndex, "SELECT_SEQ");
      if (SELECT_SEQ == 1) {
        ret.styleName = "BEST-SELECT";
      }
      return ret;
    },
  },
  {
    name: "MAPE_W",
    dataType: "number",
    headerText: "MAPE_W",
    visible: false,
    editable: false,
    width: "100",
    textAlignment: "center",
    styleCallback: function (grid, dataCell) {
      var ret = {};
      var SELECT_SEQ = grid.getValue(dataCell.index.itemIndex, "SELECT_SEQ");
      if (SELECT_SEQ == 1) {
        ret.styleName = "BEST-SELECT";
      }
      return ret;
    },
  },
  { name: "SELECT_SEQ", dataType: "number", headerText: "SELECT_SEQ", visible: false, editable: false, width: "100", textAlignment: "center" },
  { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: "80", textAlignment: "center" },
  { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "130", format: "yyyy-MM-dd HH:mm:ss", textAlignment: "center" },
  { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: "80", textAlignment: "center" },
  { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: "130", format: "yyyy-MM-dd HH:mm:ss", textAlignment: "center" },
];

const excelExportOptions = {
  lookupDisplay: false,
  // allColumns: true,
  separateRows: true,
  footer: "default",
  headerDepth: 2,
  importExceptFields: { 0: "id" },
};

function ForecastError(props) {
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

  useEffect(() => {
    if (grid1) {
      setViewInfo(vom.active, "globalButtons", globalButtons);
    }
  }, [grid1]);

  /** 이벤트 핸들러 */
  const onSubmit = (data) => {
    loadData(data);
  };

  function refresh() {
    reset();
    grid1.dataProvider.clearRows();
    setVersionId();
  }

  const afterGridCreate1 = (gridObj, gridView, dataProvider) => {
    setGrid1(gridObj);
    gridObj.gridView.displayOptions.fitStyle = "fill";

    //클릭한 헤더 순서대로 정렬
    gridObj.gridView.sortingOptions.style = "inclusive";

    //Default sorting
    var fields = ["ITEM_CD", "ACCOUNT_CD"];
    gridObj.gridView.orderBy(fields, ["ascending", "ascending"]);

    gridObj.gridView.onCellClicked = function (grid, index, itemIndex) {
      if (index.cellType === "data") {
        gridObj.gridView.commit(true);
      }
    };
  };

  function loadData() {
    let grid = grid1;

    grid.gridView.commit(true);
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_BF_51_Q1",
      params: {
        VER_CD: getValues("versionId"),
        ITEM_CD: getValues("itemCd"),
        ITEM_NM: getValues("itemNm"),
        ACCOUNT_CD: getValues("accountCd"),
        ACCOUNT_NM: getValues("accountNm"),
      },
    })
      .then(function (res) {
        let dataArr = [];
        if (res.status === gHttpStatus.SUCCESS) {
          dataArr = res.data.RESULT_DATA;
          grid.dataProvider.fillJsonData(dataArr);
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

  /** 이벤트 핸들러 끝 */

  return (
    <>
      <ContentInner>
        <SearchArea>
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
        </SearchArea>
        <ButtonArea title={transLangKey("UI_BF_51")}>
          <LeftButtonArea>
            <ButtonGroup>
              <GridExcelExportButton type="icon" grid="grid1" options={excelExportOptions} />
            </ButtonGroup>
          </LeftButtonArea>
        </ButtonArea>
        <ResultArea>
          <BaseGrid id="grid1" items={grid1Items} afterGridCreate={afterGridCreate1}></BaseGrid>
        </ResultArea>
        <StatusArea show={false} message={message}>
          <GridCnt grid="grid1" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")}></GridCnt>
        </StatusArea>
      </ContentInner>
      {itemPopupOpen && <PopSelectItemLvItem open={itemPopupOpen} onClose={() => setItemPopupOpen(false)} multiple={false} confirm={setItemCd} values={""} accountCd={getValues("accountCd")} title="ITEM"></PopSelectItemLvItem>}
      {accountPopupOpen && <PopSelectSalesLvAccount open={accountPopupOpen} onClose={() => setAccountPopupOpen(false)} multiple={false} confirm={setAccountCd} values={""} itemCd={getValues("itemCd")} title="ACCOUNT"></PopSelectSalesLvAccount>}
    </>
  );
}

export default ForecastError;
