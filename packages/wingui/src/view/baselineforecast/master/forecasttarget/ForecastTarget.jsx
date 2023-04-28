import React, { useState, useEffect, useRef } from "react";
import { useForm, watch } from "react-hook-form";
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
  GridDeleteRowButton,
  GridSaveButton,
  CommonButton,
  GridExcelImportButton,
  GridExcelExportButton,
  BaseGrid,
  GridCnt,
  useViewStore,
  useUserStore,
  useStyles,
  zAxios,
} from "@zionex/wingui-core/src/common/imports";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import SearchIcon from "@mui/icons-material/Search";

import PopSelectItem from "@wingui/view/common/PopSelectItem";
import PopSelectAccount from "@wingui/view/common/PopSelectAccount";

let grid1Items = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: "0" },
  {
    name: "ITEM_CD",
    dataType: "text",
    headerText: "ITEM_CD",
    visible: true,
    editable: false,
    width: "70",
    textAlignment: "center",
    button: "action",
    styleCallback: function (grid, dataCell) {
      let ret = {};
      if (dataCell.item.rowState == "created" || dataCell.item.itemState == "appending" || dataCell.item.itemState == "inserting") {
        ret.editable = true;
        ret.styleName = "editable-text-column";
      } else {
        ret.styleName = "uneditable-popup-column";
        ret.editable = false;
      }
      return ret;
    },
  },
  { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: "150", textAlignment: "center" },
  {
    name: "ACCOUNT_CD",
    dataType: "text",
    headerText: "ACCOUNT_CD",
    visible: true,
    editable: false,
    width: "70",
    textAlignment: "center",
    button: "action",
    styleCallback: function (grid, dataCell) {
      let ret = {};
      if (dataCell.item.rowState == "created" || dataCell.item.itemState == "appending" || dataCell.item.itemState == "inserting") {
        ret.editable = true;
        ret.styleName = "editable-text-column";
      } else {
        ret.styleName = "uneditable-popup-column";
        ret.editable = false;
      }
      return ret;
    },
  },
  { name: "ACCOUNT_NM", dataType: "text", headerText: "ACCOUNT_NM", visible: true, editable: false, width: "80", textAlignment: "center" },
  { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "50" },
  //   { name: "FACTOR_SET_CD", dataType: "dropdown", headerText: "FACTOR_SET_CD", visible: true, editable: true, width: "60", useDropdown: true, lookupDisplay: true },
  { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: "80" },
  { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: "100" },
  { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", editable: false, width: "80" },
  { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", editable: false, width: "100" },
];

const excelExportOptions = {
  lookupDisplay: false,
  // allColumns: true,
  separateRows: true,
  footer: "default",
  headerDepth: 2,
  importExceptFields: { 0: "id" },
};

function ForecastTarget(props) {
  // const classes = useStyles();

  //1. view 페이지 데이타 store
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [username] = useUserStore((state) => [state.username]);
  //2. 그리드 Object
  const [grid1, setGrid1] = useState(null);

  //3. 상태 메시지
  const [message, setMessage] = useState();

  //4. FORM 데이터 처리
  const {
    handleSubmit,
    reset,
    getValues,
    setValue,
    control,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: {
      ITEM_CD: "",
      ITEM_NM: "",
      ACCOUNT_CD: "",
      ACCOUNT_NM: "",
      ACTV_YN: ["Y"],
    },
  });

  const [forecastTargetItemPopupOpen, setForecastTargetItemPopupOpen] = useState(false);
  const [forecastTargetAccountPopupOpen, setForecastTargetAccountPopupOpen] = useState(false);
  const [selectGrid, setSelectGrid] = useState(false);

  const globalButtons = [
    {
      name: "search",
      action: (e) => {
        onSubmit();
      },
      visible: true,
      disable: false,
    },
    // {
    //   name: "save",
    //   action: (e) => {
    //     saveData(grid1);
    //   },
    //   visible: false,
    //   disable: false,
    // },
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
      setOptions();
    }
  }, [grid1]);

  const onSubmit = () => {
    loadData();
  };

  // 그리드 Object 초기화
  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, "grid1");
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        if (grid1 != grdObj1) setGrid1(grdObj1);
      }
    }
  }, [viewData]);

  const setOptions = () => {
    setVisibleProps(grid1, true, true, true);
    grid1.gridView.setDisplayOptions({
      fitStyle: "fill",
    });

    grid1.gridView.onCellButtonClicked = function (grid, itemIndex, column) {
      if (grid1.dataProvider.getRowState(itemIndex.dataRow) === "created") {
        if (column.fieldName === "ITEM_CD") {
          setSelectGrid(true);
          setForecastTargetItemPopupOpen(true);
        } else if (column.fieldName === "ACCOUNT_CD") {
          setSelectGrid(true);
          setForecastTargetAccountPopupOpen(true);
        }
      }
    };
  };

  useEffect(() => {
    if (grid1) {
      setOptions();
    }
  }, [grid1]);

  // popup Open - 품목코드

  const openForecastTargetItemPopup = () => {
    setForecastTargetItemPopupOpen(true);
  };
  // popup Open - 거래처코드
  const openForecastTargetAccountPopup = () => {
    setForecastTargetAccountPopupOpen(true);
  };

  // popup close - 품목코드
  function onSetItemCd(gridRows) {
    let itemCdArr = [];
    let itemNmArr = [];

    gridRows.forEach(function (row) {
      itemCdArr.push(row.ITEM_CD);
      itemNmArr.push(row.ITEM_NM);
    });

    if (selectGrid) {
      let itemIndex = grid1.gridView.getCurrent().dataRow;
      grid1.dataProvider.setValue(itemIndex, "ITEM_CD", itemCdArr[0]);
      grid1.dataProvider.setValue(itemIndex, "ITEM_NM", itemNmArr[0]);
      grid1.gridView.setCurrent({ itemIndex: itemIndex });
      grid1.gridView.commit(true);
    } else {
      console.log(itemCdArr.join('|'));
      setValue('ITEM_CD', itemCdArr.join('|'));
      setValue('ITEM_NM', itemNmArr.join('|'));
    }
  }

  // popup close - 거래처코드
  function onSetAccountCd(gridRows) {
    let acctCdArr = [];
    let acctNmArr = [];

    gridRows.forEach(function (row) {
      acctCdArr.push(row.ACCOUNT_CD);
      acctNmArr.push(row.ACCOUNT_NM);
    });

    if (selectGrid) {
      let itemIndex = grid1.gridView.getCurrent().dataRow;
      grid1.dataProvider.setValue(itemIndex, "ACCOUNT_CD", acctCdArr[0]);
      grid1.dataProvider.setValue(itemIndex, "ACCOUNT_NM", acctNmArr[0]);
      grid1.gridView.setCurrent({ itemIndex: itemIndex });
      grid1.gridView.commit(true);
    } else {
      setValue("ACCOUNT_CD", acctCdArr.join('|'));
      setValue("ACCOUNT_NM", acctNmArr.join('|'));
    }
  }

  /** 이벤트 핸들러 */

  function refresh() {
    reset();
    grid1.dataProvider.clearRows();
  }

  function loadData() {
    let dataArr;
    let param = new URLSearchParams();

    param.append("ITEM_CD", getValues("ITEM_CD"));
    param.append("ITEM_NM", getValues("ITEM_NM"));
    param.append("ACCOUNT_CD", getValues("ACCOUNT_CD"));
    param.append("ACCOUNT_NM", getValues("ACCOUNT_NM"));
    param.append("ACTV_YN", getValues("ACTV_YN")[0] === "Y" ? true : false);
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_BF_13_Q1",
      data: param,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          dataArr = [];
          dataArr = res.data.RESULT_DATA;
          grid1.dataProvider.fillJsonData(dataArr);
          if (grid1.dataProvider.getRowCount() == 0) {
            grid1.gridView.setDisplayOptions({ showEmptyMessage: true, emptyMessage: transLangKey("MSG_NO_DATA") });
          }
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  const afterToLoad = (targetGrid) => {
    if (targetGrid.gridView.id === "grid1") {
      loadData();
    }
  };

  function saveData() {
    grid1.gridView.commit(true);
    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];
        changes = changes.concat(grid1.dataProvider.getAllStateRows().created, grid1.dataProvider.getAllStateRows().updated, grid1.dataProvider.getAllStateRows().deleted, grid1.dataProvider.getAllStateRows().createAndDeleted);

        changes.forEach(function (row) {
          changeRowData.push(grid1.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"), { close: false });
        } else {
          let formData = new FormData();
          formData.append("changes", JSON.stringify(changeRowData));
          formData.append('procedure', "SP_UI_BF_13_S1_J");
          formData.append("P_USER_ID", username);

          zAxios({
            method: "post",
            headers: { "content-type": "application/json" },
            url: baseURI() + "common/json-save",
            data: formData,
            })
            .then(function () {
              loadData();
            })
            .catch(function (e) {
              console.error(e);
            });
        }
      }
    });
  }

  function onDelete(targetGrid, deleteRows) {
    let formData = new FormData();
    formData.append("WRK_TYPE", "DELETE");
    formData.append("changes", JSON.stringify(deleteRows));
    formData.append("USER_ID", username);
    formData.append("CURRENT_OPERATION_CALL_ID", "OPC_UI_CM_11_RST_CPT_03_08_CLICK_01");

    if (deleteRows.length > 0) {
      return zAxios({
        method: "post",
        url: baseURI() + "engine/dp/SRV_SET_SP_UI_BF_13_D1",
        headers: { "content-type": "application/json" },
        data: formData,
      });
    }
  }
  return (
    <>
      <ContentInner>
        {/* <ViewPath {...viewPathProps} submit={handleSubmit(onSubmit, onError)}></ViewPath> */}
        <SearchArea>
          <SearchRow>
            <InputField
              name="ITEM_CD"
              label={transLangKey("ITEM_CD")}
              title={transLangKey("SEARCH")}
              onClick={() => {
                openForecastTargetItemPopup();
              }}
              control={control}
              type="action">
              <Icon.Search />
            </InputField>
            <InputField name="ITEM_NM" label={transLangKey("ITEM_NM")} control={control} readonly={false} />
            <InputField
              name="ACCOUNT_CD"
              label={transLangKey("ACCOUNT_CD")}
              title={transLangKey("SEARCH")}
              onClick={() => {
                openForecastTargetAccountPopup();
              }}
              control={control}
              type="action">
              <Icon.Search />
            </InputField>
            <InputField name="ACCOUNT_NM" label={transLangKey("ACCOUNT_NM")} control={control} readonly={false} />
            <InputField
              type="check"
              name="ACTV_YN"
              label={transLangKey("ACTV_YN")}
              control={control}
              options={[
                {
                  label: transLangKey("ACTV_YN"),
                  value: "Y",
                },
              ]}
            />
          </SearchRow>
        </SearchArea>
        {/* direction : horizontal, vertical 
          다른 element 를 넣을려면 box 로 감싼다.
        */}
        <ResultArea>
          <Box sx={{ display: "flex", height: "100%", flexDirection: "column", alignContent: "stretch", alignItems: "stretch" }}>
            <ButtonArea title={transLangKey("UI_BF_13")}>
              <LeftButtonArea>
                <GridExcelExportButton type="icon" grid="grid1" options={excelExportOptions}></GridExcelExportButton>
                {/*<GridExcelImportButton type="icon" grid="grid1"></GridExcelImportButton>*/}
              </LeftButtonArea>
              <RightButtonArea>
                <GridAddRowButton type="icon" grid="grid1"></GridAddRowButton>
                {/* <GridDeleteRowButton type="icon" grid="grid1" onDelete={onDelete} onAfterDelete={afterToLoad}></GridDeleteRowButton> */}
                <GridDeleteRowButton type="icon" grid="grid1" onDelete={onDelete}></GridDeleteRowButton>
                <GridSaveButton
                  type="icon"
                  grid="grid1"
                  onClick={() => {
                    saveData(grid1);
                  }}
                />
              </RightButtonArea>
            </ButtonArea>
            <Box style={{ height: "calc(100% - 53px" }}>
              <BaseGrid id="grid1" items={grid1Items}></BaseGrid>
            </Box>
          </Box>
        </ResultArea>
      </ContentInner>
      {forecastTargetItemPopupOpen && <PopSelectItem open={forecastTargetItemPopupOpen} onClose={() => setForecastTargetItemPopupOpen(false)} confirm={onSetItemCd}></PopSelectItem>}
      {forecastTargetAccountPopupOpen && <PopSelectAccount open={forecastTargetAccountPopupOpen} onClose={() => setForecastTargetAccountPopupOpen(false)} confirm={onSetAccountCd}></PopSelectAccount>}
    </>
  );
}
export default ForecastTarget;
