import React, { useState, useEffect } from "react";
import { ButtonGroup, Tooltip, IconButton } from "@mui/material";
import { useForm } from "react-hook-form";
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
  SplitPanel,
  InputField,
  GridAddRowButton,
  GridDeleteRowButton,
  GridSaveButton,
  CommonButton,
  BaseGrid,
  GridCnt,
  useViewStore,
  zAxios,
  useUserStore,
  GridExcelExportButton,
  GridExcelImportButton,
} from "@zionex/wingui-core/src/common/imports";
import PopPersonalize from "@wingui/view/common/PopPersonalize";
import PopSelectItem from "@wingui/view/common/PopSelectItem";
import PopSelectAccount from "@wingui/view/common/PopSelectAccount";

let grid1Items = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: "0" },
  {
    name: "ACCOUNT_CD",
    dataType: "text",
    headerText: "ACCOUNT_CD",
    visible: true,
    editable: false,
    width: "70",
    validRules: [{ criteria: "required" }],
    button: "action",
    styleCallback: function (grid, dataCell) {
      let ret = {};
      if (dataCell.item.rowState == "created" || dataCell.item.itemState == "appending" || dataCell.item.itemState == "inserting") {
        ret.editable = true;
        ret.styleName = "editable-text-column";
      } else {
        ret.editable = false;
      }
      return ret;
    },
    buttonVisibleCallback: function (grid, index, focused, mouseEntered) {
      return grid._dataProvider.getRowState(index.itemIndex) === "created";
    },
  },
  {
    name: "ACCOUNT_NM",
    dataType: "text",
    headerText: "ACCOUNT_NM",
    visible: true,
    editable: false,
    width: "80",
    styleCallback: function (grid, dataCell) {
      let ret = {};
      if (dataCell.item.rowState == "created" || dataCell.item.itemState == "appending" || dataCell.item.itemState == "inserting") {
        ret.editable = true;
        ret.styleName = "editable-text-column";
      } else {
        ret.editable = false;
      }
      return ret;
    },
  },
  {
    name: "ITEM_CD",
    dataType: "text",
    headerText: "ITEM_CD",
    visible: true,
    editable: false,
    width: "70",
    validRules: [{ criteria: "required" }],
    button: "action",
    styleCallback: function (grid, dataCell) {
      let ret = {};
      if (dataCell.item.rowState == "created" || dataCell.item.itemState == "appending" || dataCell.item.itemState == "inserting") {
        ret.editable = true;
        ret.styleName = "editable-text-column";
      } else {
        ret.editable = false;
      }
      return ret;
    },
    buttonVisibleCallback: function (grid, index, focused, mouseEntered) {
      return grid._dataProvider.getRowState(index.itemIndex) === "created";
    },
  },
  {
    name: "ITEM_NM",
    dataType: "text",
    headerText: "ITEM_NM",
    visible: true,
    editable: false,
    width: "100",
    styleCallback: function (grid, dataCell) {
      let ret = {};
      if (dataCell.item.rowState == "created" || dataCell.item.itemState == "appending" || dataCell.item.itemState == "inserting") {
        ret.editable = true;
        ret.styleName = "editable-text-column";
      } else {
        ret.editable = false;
      }
      return ret;
    },
  },
  {
    name: "BASE_DATE",
    dataType: "datetime",
    headerText: "BASE_DATE",
    visible: true,
    editable: false,
    width: "80",
    textAlignment: "center",
    format: "yyyy-MM-dd",
    styleCallback: function (grid, dataCell) {
      let ret = {};
      if (dataCell.item.rowState == "created" || dataCell.item.itemState == "appending" || dataCell.item.itemState == "inserting") {
        ret.editable = true;
        ret.styleName = "editable-text-column";
      } else {
        ret.editable = false;
      }
      return ret;
    },
  },
  { name: "SALES_FACTOR1", dataType: "text", headerText: "SALES_FACTOR1", visible: true, editable: true, width: "100", textAlignment: "center" },
  { name: "SALES_FACTOR2", dataType: "text", headerText: "SALES_FACTOR2", visible: false, editable: true, width: "100", textAlignment: "center" },
  { name: "SALES_FACTOR3", dataType: "text", headerText: "SALES_FACTOR3", visible: false, editable: true, width: "100", textAlignment: "center" },
  { name: "SALES_FACTOR4", dataType: "text", headerText: "SALES_FACTOR4", visible: false, editable: true, width: "100", textAlignment: "center" },
  { name: "SALES_FACTOR5", dataType: "text", headerText: "SALES_FACTOR5", visible: false, editable: true, width: "100", textAlignment: "center" },
  { name: "SALES_FACTOR6", dataType: "text", headerText: "SALES_FACTOR6", visible: false, editable: true, width: "100", textAlignment: "center" },
  { name: "SALES_FACTOR7", dataType: "text", headerText: "SALES_FACTOR7", visible: false, editable: true, width: "100", textAlignment: "center" },
  { name: "SALES_FACTOR8", dataType: "text", headerText: "SALES_FACTOR8", visible: false, editable: true, width: "100", textAlignment: "center" },
  { name: "SALES_FACTOR9", dataType: "text", headerText: "SALES_FACTOR9", visible: false, editable: true, width: "100", textAlignment: "center" },
  { name: "SALES_FACTOR10", dataType: "text", headerText: "SALES_FACTOR10", visible: false, editable: true, width: "100", textAlignment: "center" },
  { name: "SALES_FACTOR11", dataType: "text", headerText: "SALES_FACTOR11", visible: false, editable: true, width: "100", textAlignment: "center" },
  { name: "SALES_FACTOR12", dataType: "text", headerText: "SALES_FACTOR12", visible: false, editable: true, width: "100", textAlignment: "center" },
  { name: "SALES_FACTOR13", dataType: "text", headerText: "SALES_FACTOR13", visible: false, editable: true, width: "100", textAlignment: "center" },
  { name: "SALES_FACTOR14", dataType: "text", headerText: "SALES_FACTOR14", visible: false, editable: true, width: "100", textAlignment: "center" },
  { name: "SALES_FACTOR15", dataType: "text", headerText: "SALES_FACTOR15", visible: false, editable: true, width: "100", textAlignment: "center" },
  { name: "SALES_FACTOR16", dataType: "text", headerText: "SALES_FACTOR16", visible: false, editable: true, width: "100", textAlignment: "center" },
  { name: "SALES_FACTOR17", dataType: "text", headerText: "SALES_FACTOR17", visible: false, editable: true, width: "100", textAlignment: "center" },
  { name: "SALES_FACTOR18", dataType: "text", headerText: "SALES_FACTOR18", visible: false, editable: true, width: "100", textAlignment: "center" },
  { name: "SALES_FACTOR19", dataType: "text", headerText: "SALES_FACTOR19", visible: false, editable: true, width: "100", textAlignment: "center" },
  { name: "SALES_FACTOR20", dataType: "text", headerText: "SALES_FACTOR20", visible: false, editable: true, width: "100", textAlignment: "center" },
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

function SalesFactor(props) {
  const [username] = useUserStore((state) => [state.username]);

  //1. view page data store
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);

  //2. grid Object
  const [grid1, setGrid1] = useState(null);
  const [itemPopupOpen, setItemPopupOpen] = useState(false);
  const [accountPopupOpen, setAccountPopupOpen] = useState(false);
  const [gridItemPopupOpen, setGridItemPopupOpen] = useState(false);
  const [gridAccountPopupOpen, setGridAccountPopupOpen] = useState(false);

  const [personalizeOpen, setPersonalizeOpen] = useState(false);

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
      applyDttmF: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      applyDttmT: new Date(),
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
      visible: true,
      disable: false,
    },
  ];

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
  }

  const afterGridCreate1 = (gridObj, gridView, dataProvider) => {
    setGrid1(gridObj);
    setVisibleProps(gridObj, true, true, true);
    gridObj.gridView.displayOptions.fitStyle = "evenFill";

    gridObj.gridView.onCellButtonClicked = function (grid, itemIndex, column) {
      if (column.fieldName === "ITEM_CD") {
        setGridItemPopupOpen(true);
      } else if (column.fieldName === "ACCOUNT_CD") {
        setGridAccountPopupOpen(true);
      }
    };
  };

  function loadData() {
    let grid = grid1;

    if (!getValues("itemCd")) {
      showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_0017"), { close: false });
      return;
    }

    let applyDttmF = new Date(getValues("applyDttmF"));
    let applyDttmT = new Date(getValues("applyDttmT"));

    let fromdate = applyDttmF ? applyDttmF.format("yyyy-MM-ddT00:00:00") : "19700101";
    let todate = applyDttmT ? applyDttmT.format("yyyy-MM-ddT00:00:00") : "99991231";

    grid.gridView.commit(true);
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_BF_07_Q1",
      params: {
        FROM_DATE: fromdate,
        TO_DATE: todate,
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
      })
      .then(function () {
        grid.gridView.hideToast();
      });
  }

  function onDelete(targetGrid, deleteRows) {
    let formData = new FormData();
    formData.append("USER_ID", username);
    formData.append("checked", JSON.stringify(deleteRows));

    if (deleteRows.length > 0) {
      zAxios({
        method: "post",
        url: baseURI() + "engine/dp/SRV_SET_SP_UI_BF_07_D1",
        headers: { "content-type": "application/json" },
        data: formData,
      })
        .then(function (res) {
          let isSucess = res.data.RESULT_SUCCESS;
          if (isSucess) {
            let resultMSG = res.data.RESULT_DATA.IM_DATA.SP_UI_BF_07_D1_P_RT_MSG;
            showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
          } else {
            let resultMSG = res.data.RESULT_MESSAGE;
            showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
          }
          return res;
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  }

  const onAfterDelete = (targetGrid) => {
    if (targetGrid.gridView === "grid1") {
      loadData();
    }
  };

  function saveData(targetGrid) {
    targetGrid.gridView.commit(true);
    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(targetGrid.dataProvider.getAllStateRows().created, targetGrid.dataProvider.getAllStateRows().updated, targetGrid.dataProvider.getAllStateRows().deleted, targetGrid.dataProvider.getAllStateRows().createAndDeleted);

        changes.forEach(function (row) {
          let data = targetGrid.dataProvider.getJsonRow(row);
          data.BASE_DATE = data.BASE_DATE.format("yyyy-MM-ddTHH:mm:ss");
          changeRowData.push(data);
        });

        if (changeRowData.length === 0) {
          //저장 할 내용이 없습니다.
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"), { close: false });
        } else {
          targetGrid.gridView.showToast(progressSpinner + "Saving data...", true);

          let formData = new FormData();
          formData.append("changes", JSON.stringify(changeRowData));
          formData.append('procedure', "SP_UI_BF_07_S1_J");
          formData.append("P_USER_ID", username);

          zAxios({
            method: "post",
            headers: { "content-type": "application/json" },
            url: baseURI() + "common/json-save",
            data: formData,
          })
            .then(function () {
              targetGrid.gridView.hideToast();
              loadData();
            })
            .catch(function (e) {
              console.error(e);
            });
        }
      }
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

  function setGridItemCd(records) {
    let itemIndex = grid1.gridView.getCurrent().dataRow;
    grid1.dataProvider.setValue(itemIndex, "ITEM_CD", records[0].ITEM_CD);
    grid1.dataProvider.setValue(itemIndex, "ITEM_NM", records[0].ITEM_NM);
    grid1.gridView.setCurrent({ itemIndex: itemIndex });
    grid1.gridView.commit(true);
  }

  function setGridAccountCd(records) {
    let itemIndex = grid1.gridView.getCurrent().dataRow;
    grid1.dataProvider.setValue(itemIndex, "ACCOUNT_CD", records[0].ACCOUNT_CD);
    grid1.dataProvider.setValue(itemIndex, "ACCOUNT_NM", records[0].ACCOUNT_NM);
    grid1.gridView.setCurrent({ itemIndex: itemIndex });
    grid1.gridView.commit(true);
  }

  const reloadPrefInfo = (viewCd, userName, grid, grpCd, gridCd) => {
    if (grid) grid.loadCrossTabInfoAndPrefInfo(viewCd, grpCd, userName);
  };

  /** 이벤트 핸들러 끝 */

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            {/* direction : row, column */}
            <InputField type={"datetime"} name="applyDttmF" label={transLangKey("FROM_DATE")} control={control} dateformat="yyyy-MM-dd"/>
            <InputField type={"datetime"} name="applyDttmT" label={transLangKey("TO_DATE")} control={control} dateformat="yyyy-MM-dd"/>
            <InputField type="action" name="itemCd" label={transLangKey("ITEM_CD")} onClick={() => {setItemPopupOpen(true)}} control={control}>
              <Icon.Search />
            </InputField>
            <InputField type={"text"} name="itemNm" label={transLangKey("ITEM_NM")} control={control} readonly={false} />
            <InputField type="action" name="accountCd" label={transLangKey("ACCOUNT_CD")} onClick={() => {setAccountPopupOpen(true)}} control={control}>
              <Icon.Search />
            </InputField>
            <InputField type={"text"} name="accountNm" label={transLangKey("ACCOUNT_NM")} control={control} readonly={false} />
          </SearchRow>
        </SearchArea>
        <ButtonArea title={transLangKey("UI_BF_07")}>
          <LeftButtonArea>
            <GridExcelExportButton type="icon" grid="grid1" options={excelExportOptions} />
            {/*<GridExcelImportButton type="icon" grid="grid1"></GridExcelImportButton>*/}
          </LeftButtonArea>
          <RightButtonArea>
            <GridAddRowButton grid="grid1" type="icon"></GridAddRowButton>
            <GridDeleteRowButton grid="grid1" type="icon" onDelete={onDelete} onAfterDelete={onAfterDelete}></GridDeleteRowButton>
            <GridSaveButton
              grid="grid1"
              type="icon"
              onClick={() => {
                saveData(grid1);
              }}
            />
          </RightButtonArea>
        </ButtonArea>
        <ResultArea>
          <BaseGrid id="grid1" items={grid1Items} viewCd="UI_BF_07" username={username} gridCd="UI_BF_07-RST_CPT_01" afterGridCreate={afterGridCreate1}></BaseGrid>
        </ResultArea>
        <StatusArea show={false} message={message}>
          <GridCnt grid="grid1" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")}></GridCnt>
        </StatusArea>
      </ContentInner>
      {itemPopupOpen && <PopSelectItem open={itemPopupOpen} onClose={() => setItemPopupOpen(false)} confirm={setItemCd}></PopSelectItem>}
      {accountPopupOpen && <PopSelectAccount open={accountPopupOpen} onClose={() => setAccountPopupOpen(false)} confirm={setAccountCd}></PopSelectAccount>}
      {gridItemPopupOpen && <PopSelectItem open={gridItemPopupOpen} onClose={() => setGridItemPopupOpen(false)} confirm={setGridItemCd} multiple={true}></PopSelectItem>}
      {gridAccountPopupOpen && <PopSelectAccount open={gridAccountPopupOpen} onClose={() => setGridAccountPopupOpen(false)} confirm={setGridAccountCd} multiple={true}></PopSelectAccount>}
      <PopPersonalize open={personalizeOpen} onClose={() => setPersonalizeOpen(false)} resetCallback={reloadPrefInfo} viewCd="UI_BF_07" grid={grid1} username={username} authTpId={""}></PopPersonalize>
    </>
  );
}

export default SalesFactor;
