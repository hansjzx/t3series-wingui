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
  BaseGrid,
  GridCnt,
  useViewStore,
  useUserStore,
  zAxios,
  GridExcelExportButton,
  GridExcelImportButton,
} from "@zionex/wingui-core/src/common/imports";
import PopSelectItem from "@wingui/view/common/PopSelectItem";
import PopSelectAccount from "@wingui/view/common/PopSelectAccount";

let grid1Items = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: "0" },
  { name: "USE_YN", dataType: "boolean", headerText: "USE_YN", visible: true, editable: true, width: "30", textAlignment: "center", defaultValue: true },
  {
    name: "OLD_NEW_MAP_OLD",
    dataType: "group",
    orientation: "horizontal",
    headerText: "OLD_NEW_MAP_OLD",
    headerVisible: true,
    hideChildHeaders: false,
    childs: [
      {
        name: "FROM_ACCOUNT_CD",
        dataType: "text",
        headerText: "FROM_ACCOUNT_CD",
        visible: true,
        editable: false,
        width: "80",
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
        name: "FROM_ACCOUNT_NM",
        dataType: "text",
        headerText: "FROM_ACCOUNT_NM",
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
        name: "FROM_ITEM_CD",
        dataType: "text",
        headerText: "FROM_ITEM_CD",
        visible: true,
        editable: false,
        width: "80",
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
        name: "FROM_ITEM_NM",
        dataType: "text",
        headerText: "FROM_ITEM_NM",
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
    ],
  },
  {
    name: "OLD_NEW_MAP_NEW",
    dataType: "group",
    orientation: "horizontal",
    headerText: "OLD_NEW_MAP_NEW",
    headerVisible: true,
    hideChildHeaders: false,
    childs: [
      {
        name: "TO_ACCOUNT_CD",
        dataType: "text",
        headerText: "TO_ACCOUNT_CD",
        visible: true,
        editable: false,
        width: "80",
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
        name: "TO_ACCOUNT_NM",
        dataType: "text",
        headerText: "TO_ACCOUNT_NM",
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
        name: "TO_ITEM_CD",
        dataType: "text",
        headerText: "TO_ITEM_CD",
        visible: true,
        editable: false,
        width: "80",
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
        name: "TO_ITEM_NM",
        dataType: "text",
        headerText: "TO_ITEM_NM",
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
    ],
  },
  { name: "FROM_APPLY_DATE", dataType: "datetime", headerText: "FROM_APPLY_DATE", visible: true, editable: true, format: "yyyy-MM-dd", textAlignment: "center", width: 100 },
  { name: "TO_APPLY_DATE", dataType: "datetime", headerText: "TO_APPLY_DATE", visible: true, editable: true, format: "yyyy-MM-dd", textAlignment: "center", width: 100 },
  { name: "APPLY_PCT", dataType: "text", headerText: "APPLY_PCT", visible: true, editable: true, textAlignment: "center", width: 100 },
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

function NewTargetSalesMap(props) {
  //1. view page data store
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [username] = useUserStore((state) => [state.username]);
  //2. grid Object
  const [grid1, setGrid1] = useState(null);
  const [itemPopupOpen, setItemPopupOpen] = useState(false);
  const [accountPopupOpen, setAccountPopupOpen] = useState(false);
  const [gridFromItemPopupOpen, setGridFromItemPopupOpen] = useState(false);
  const [gridFromAccountPopupOpen, setGridFromAccountPopupOpen] = useState(false);
  const [gridToItemPopupOpen, setGridToItemPopupOpen] = useState(false);
  const [gridToAccountPopupOpen, setGridToAccountPopupOpen] = useState(false);

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
      applyDttmF: new Date(new Date().setFullYear(new Date().getFullYear() - 3)),
      applyDttmT: new Date(),
      itemCd: "",
      itemNm: "",
      accountCd: "",
      accountNm: "",
      useYn: "Y",
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
      if (column.fieldName === "FROM_ITEM_CD") {
        setGridFromItemPopupOpen(true);
      } else if (column.fieldName === "FROM_ACCOUNT_CD") {
        setGridFromAccountPopupOpen(true);
      } else if (column.fieldName === "TO_ITEM_CD") {
        setGridToItemPopupOpen(true);
      } else if (column.fieldName === "TO_ACCOUNT_CD") {
        setGridToAccountPopupOpen(true);
      }
    };
  };

  function loadData() {
    let grid = grid1;
    let applyDttmF = new Date(getValues("applyDttmF"));
    let applyDttmT = new Date(getValues("applyDttmT"));

    let fromdate = applyDttmF ? applyDttmF.format("yyyy-MM-ddT00:00:00") : "19700101";
    let todate = applyDttmT ? applyDttmT.format("yyyy-MM-ddT00:00:00") : "99991231";

    grid.gridView.commit(true);
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_BF_14_Q1",
      params: {
        FROM_DATE: fromdate,
        TO_DATE: todate,
        ITEM_CD: getValues("itemCd"),
        ITEM_NM: getValues("itemNm"),
        ACCOUNT_CD: getValues("accountCd"),
        ACCOUNT_NM: getValues("accountNm"),
        USE_YN: getValues("useYn"),
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
        url: baseURI() + "engine/dp/SRV_SET_SP_UI_BF_14_D1",
        headers: { "content-type": "application/json" },
        data: formData,
      })
        .then(function (res) {
          let isSucess = res.data.RESULT_SUCCESS;
          if (isSucess) {
            let resultMSG = res.data.RESULT_DATA.IM_DATA.SP_UI_BF_14_D1_P_RT_MSG;
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
    if (targetGrid.gridView.id === "grid1") {
//       loadData();
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

          let applyDttmF = new Date(data.FROM_APPLY_DATE);
          let applyDttmT = new Date(data.TO_APPLY_DATE);

          let fromdate = data.FROM_APPLY_DATE ? applyDttmF.format("yyyy-MM-ddT00:00:00") : null;
          let todate = data.TO_APPLY_DATE ? applyDttmT.format("yyyy-MM-ddT00:00:00") : null;

          data.FROM_APPLY_DATE = fromdate;
          data.TO_APPLY_DATE = todate;

          changeRowData.push(data);
        });

        if (changeRowData.length === 0) {
          //저장 할 내용이 없습니다.
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"), { close: false });
        } else {
          targetGrid.gridView.showToast(progressSpinner + "Saving data...", true);

          let formData = new FormData();
          formData.append("changes", JSON.stringify(changeRowData));
          formData.append('procedure', "SP_UI_BF_14_S1_J");
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

  function setGridFromItemCd(records) {
    let itemIndex = grid1.gridView.getCurrent().dataRow;
    grid1.dataProvider.setValue(itemIndex, "FROM_ITEM_CD", records[0].ITEM_CD);
    grid1.dataProvider.setValue(itemIndex, "FROM_ITEM_NM", records[0].ITEM_NM);
    grid1.gridView.setCurrent({ itemIndex: itemIndex });
    grid1.gridView.commit(true);
  }

  function setGridFromAccountCd(records) {
    let itemIndex = grid1.gridView.getCurrent().dataRow;
    grid1.dataProvider.setValue(itemIndex, "FROM_ACCOUNT_CD", records[0].ACCOUNT_CD);
    grid1.dataProvider.setValue(itemIndex, "FROM_ACCOUNT_NM", records[0].ACCOUNT_NM);
    grid1.gridView.setCurrent({ itemIndex: itemIndex });
    grid1.gridView.commit(true);
  }

  function setGridToItemCd(records) {
    let itemIndex = grid1.gridView.getCurrent().dataRow;
    grid1.dataProvider.setValue(itemIndex, "TO_ITEM_CD", records[0].ITEM_CD);
    grid1.dataProvider.setValue(itemIndex, "TO_ITEM_NM", records[0].ITEM_NM);
    grid1.gridView.setCurrent({ itemIndex: itemIndex });
    grid1.gridView.commit(true);
  }

  function setGridToAccountCd(records) {
    let itemIndex = grid1.gridView.getCurrent().dataRow;
    grid1.dataProvider.setValue(itemIndex, "TO_ACCOUNT_CD", records[0].ACCOUNT_CD);
    grid1.dataProvider.setValue(itemIndex, "TO_ACCOUNT_NM", records[0].ACCOUNT_NM);
    grid1.gridView.setCurrent({ itemIndex: itemIndex });
    grid1.gridView.commit(true);
  }

  /** 이벤트 핸들러 끝 */

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            {/* direction : row, column */}
            <InputField type={"datetime"} name="applyDttmF" label={transLangKey("FROM_DATE")} control={control} dateformat="yyyy-MM-dd" readonly={false} />
            <InputField type={"datetime"} name="applyDttmT" label={transLangKey("TO_DATE")} control={control} dateformat="yyyy-MM-dd" readonly={false} />
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
            <InputField
              name="useYn"
              type="select"
              label="USE_YN"
              control={control}
              options={[
                { label: "Y", value: "Y" },
                { label: "N", value: "N" },
              ]}
            />
          </SearchRow>
        </SearchArea>
        <ButtonArea title={transLangKey("UI_BF_14")}>
          <LeftButtonArea>
            <ButtonGroup>
              <GridExcelExportButton type="icon" grid="grid1" options={excelExportOptions} />
              {/*<GridExcelImportButton type="icon" grid="grid1"></GridExcelImportButton>*/}
            </ButtonGroup>
          </LeftButtonArea>
          <RightButtonArea>
            <ButtonGroup>
              <GridAddRowButton grid="grid1" type="icon"></GridAddRowButton>
              <GridDeleteRowButton grid="grid1" type="icon" onDelete={onDelete} onAfterDelete={onAfterDelete}></GridDeleteRowButton>
              <GridSaveButton
                grid="grid1"
                type="icon"
                onClick={() => {
                  saveData(grid1);
                }}
              />
            </ButtonGroup>
          </RightButtonArea>
        </ButtonArea>
        <ResultArea>
          <BaseGrid id="grid1" items={grid1Items} afterGridCreate={afterGridCreate1}></BaseGrid>
        </ResultArea>
        <StatusArea show={false} message={message}>
          <GridCnt grid="grid1" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")}></GridCnt>
        </StatusArea>
      </ContentInner>
      {itemPopupOpen && <PopSelectItem open={itemPopupOpen} onClose={() => setItemPopupOpen(false)} confirm={setItemCd}></PopSelectItem>}
      {accountPopupOpen && <PopSelectAccount open={accountPopupOpen} onClose={() => setAccountPopupOpen(false)} confirm={setAccountCd}></PopSelectAccount>}
      {gridFromItemPopupOpen && <PopSelectItem open={gridFromItemPopupOpen} onClose={() => setGridFromItemPopupOpen(false)} confirm={setGridFromItemCd} multiple={true}></PopSelectItem>}
      {gridFromAccountPopupOpen && <PopSelectAccount open={gridFromAccountPopupOpen} onClose={() => setGridFromAccountPopupOpen(false)} confirm={setGridFromAccountCd} multiple={true}></PopSelectAccount>}
      {gridToItemPopupOpen && <PopSelectItem open={gridToItemPopupOpen} onClose={() => setGridToItemPopupOpen(false)} confirm={setGridToItemCd} multiple={true}></PopSelectItem>}
      {gridToAccountPopupOpen && <PopSelectAccount open={gridToAccountPopupOpen} onClose={() => setGridToAccountPopupOpen(false)} confirm={setGridToAccountCd} multiple={true}></PopSelectAccount>}
    </>
  );
}

export default NewTargetSalesMap;
