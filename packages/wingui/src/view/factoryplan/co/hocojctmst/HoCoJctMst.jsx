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
  GridExcelExportButton,
  CommonButton,
  GridSaveButton,
  BaseGrid,
  GridCnt,
  useViewStore,
  useUserStore,
  useStyles,
  zAxios,
  SearchItem,
} from "@zionex/wingui-core/src/common/imports";
import { transLangKey } from "@zionex/wingui-core/src/lang/i18n-func";
import PopPersonalize from "@wingui/view/common/PopPersonalize";
import PopSelectItem from "@wingui/view/factoryplan/popup/PopSelectItem";
import PopSelectPlnt from "@wingui/view/factoryplan/popup/PopSelectPlnt";

let grid1Items = [
  {
      name: 'ITEM_GROUP', dataType: 'group', orientation: 'horizontal', headerText: transLangKey("HOBL_FP_PLNT"), headerVisible: true,
      childs: [
          { name: "PLNT_CD", dataType: "text", headerText: transLangKey("HOBL_FP_CODE"), visible: true, editable: false, width: 80, textAlignment: "center", button:"action",
            styleCallback: function (grid, dataCell) {
              let ret = {};
              if (dataCell.item.rowState == "created" || dataCell.item.itemState == "appending" || dataCell.item.itemState == "inserting") {
                ret.styleName = "editable-text-column";
              } else {
                ret.styleName = "uneditable-popup-column";
              }
              return ret;
            },
            buttonVisibleCallback: function (grid, index, focused, mouseEntered) {
              return grid._dataProvider.getRowState(index.itemIndex) === "created";
            },
          },
          { name: "PLNT_NM", dataType: "text", headerText: transLangKey("HOBL_FP_NAME"), visible: true, editable: false, width: 250, textAlignment: "near" },
      ]
  },
  {
    name: 'RES_GROUP', dataType: 'group', orientation: 'horizontal', headerText: transLangKey("HOBL_FP_RES"), headerVisible: true,
    childs: [
        { name: "RES_CD", dataType: "text", headerText: transLangKey("HOBL_FP_CODE"), visible: true, editable: true, width: 80, textAlignment: "center" },
        { name: "RES_NM", dataType: "text", headerText: transLangKey("HOBL_FP_NAME"), visible: true, editable: true, width: 250, textAlignment: "near" },
    ]
  },
  {
    name: 'FROM_ITEM_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'FROM '+transLangKey("HOBL_FP_ITEM"), headerVisible: true,
    childs: [
        { name: "FR_ITEM_CD", dataType: "text", headerText: transLangKey("HOBL_FP_CODE"), visible: true, editable: false, width: 80, textAlignment: "center", button:"action",
          styleCallback: function (grid, dataCell) {
            let ret = {};
            if (dataCell.item.rowState == "created" || dataCell.item.itemState == "appending" || dataCell.item.itemState == "inserting") {
              ret.styleName = "editable-text-column";
            } else {
              ret.styleName = "uneditable-popup-column";
            }
            return ret;
          },
          buttonVisibleCallback: function (grid, index, focused, mouseEntered) {
            return grid._dataProvider.getRowState(index.itemIndex) === "created";
          },
        },
        { name: "FR_ITEM_NM", dataType: "text", headerText: transLangKey("HOBL_FP_NAME"), visible: true, editable: false, width: 250, textAlignment: "near" },
    ]
  },
  {
    name: 'TO_ITEM_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'TO '+transLangKey("HOBL_FP_ITEM"), headerVisible: true,
    childs: [
        { name: "TO_ITEM_CD", dataType: "text", headerText: transLangKey("HOBL_FP_CODE"), visible: true, editable: false, width: 80, textAlignment: "center", button:"action",
          styleCallback: function (grid, dataCell) {
            let ret = {};
            if (dataCell.item.rowState == "created" || dataCell.item.itemState == "appending" || dataCell.item.itemState == "inserting") {
              ret.styleName = "editable-text-column";
            } else {
              ret.styleName = "uneditable-popup-column";
            }
            return ret;
          },
          buttonVisibleCallback: function (grid, index, focused, mouseEntered) {
            return grid._dataProvider.getRowState(index.itemIndex) === "created";
          },
        },
        { name: "TO_ITEM_NM", dataType: "text", headerText: transLangKey("HOBL_FP_NAME"), visible: true, editable: false, width: 250, textAlignment: "near" },
    ]
  },
  { name: "JCT", dataType: "number", headerText: "JCT", visible: true, editable: true, width: 100, textAlignment: "far" },
  {
    name: 'USER_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'HOBL_FP_USER', headerVisible: true,
    childs: [
      { name: "INS_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: 80, textAlignment: "center" },
      { name: "INS_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: 130, format: "yyyy-MM-dd HH:mm:ss", textAlignment: "center" },
      { name: "UPD_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 80, textAlignment: "center" },
      { name: "UPD_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 130, format: "yyyy-MM-dd HH:mm:ss", textAlignment: "center" },
    ]
  },
];

const excelExportOptions = {
  lookupDisplay: false,
  separateRows: true,
  footer: "default",
  headerDepth: 2,
};

function HoCoResMst(props) {
  const [username] = useUserStore((state) => [state.username]);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const [personalizeOpen, setPersonalizeOpen] = useState(false);
  const [frItemPopupOpen, setFrItemPopupOpen] = useState(false);
  const [toItemPopupOpen, setToItemPopupOpen] = useState(false);
  const [plntPopupOpen, setPlntPopupOpen] = useState(false);
  const [gridFrItemPopupOpen, setGridFrItemPopupOpen] = useState(false);
  const [gridToItemPopupOpen, setGridToItemPopupOpen] = useState(false);
  const [gridplntPopupOpen, setGridPlntPopupOpen] = useState(false);

  const [option1, setOption1] = useState([]);

  //2. 그리드 Object
  const [grid1, setGrid1] = useState(null);

  //3. 상태 메시지
  const [message, setMessage] = useState();

  //4. FORM 데이터 처리
  const { handleSubmit, reset, control, getValues, setValue, watch, register, formState: { errors }, clearErrors
    } = useForm({
    defaultValues: {
      plntCd: "",
      resCd: "",
      frItemCd: "",
      toItemCd: "",
    },
  });

  const globalButtons = [
    { name: "search", action: (e) => { onSubmit(); }, visible: true, disable: false },
    { name: "save", action: (e) => { saveData(grid1); }, visible: false, disable: false },
    { name: "refresh", action: (e) => { refresh(); }, visible: true, disable: false },
    { name: "personalization",  action: (e) => { setPersonalizeOpen(true) }, visible: true, disable: false },
  ];

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, "grid1");
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        setGrid1(grdObj1);
      }
    }
  }, [viewData]);

  useEffect(() => {
    if (grid1) {
      setViewInfo(vom.active, "globalButtons", globalButtons);
    }
  }, [grid1]);

  const afterGridCreate = (gridObj, gridView, dataProvider) => {
    setOptions(gridObj);
  };

  function setOptions(gridObj) {
    setVisibleProps(gridObj, true, false, false);
    gridObj.gridView.setDisplayOptions({
      fitStyle: "none",
    });

    gridObj.gridView.onCellButtonClicked =  function (grid, index, col) {
      if (index.fieldName === 'PLNT_CD') {
        setGridPlntPopupOpen(true)
      }else if (index.fieldName === 'FR_ITEM_CD') {
        setGridFrItemPopupOpen(true)
      }else if (index.fieldName === 'TO_ITEM_CD') {
        setGridToItemPopupOpen(true)
      }
    };
  }

  /** 이벤트 핸들러 */
  function onSubmit(data) {
    loadDataGrid1(data);
  }

  function refresh() {
    reset();
    grid1.dataProvider.clearRows();
  }

  function loadDataGrid1() {
    grid1.gridView.commit(true);

    let params = {
      'P_PLNT_CD': getValues('plntCd'),
      'P_RES_CD': getValues('resCd'),
      'P_FR_ITEM_CD': getValues('frItemCd'),
      'P_TO_ITEM_CD': getValues('toItemCd'),
      'P_USER_ID': username,
    }

    zAxios({
      method: 'post',
      headers: { 'content-type': 'application/json' },
      url: baseURI() + 'fp/co/HO_CO_JCT_MST/q1',
      data: params
    })
    .then(function (res) {
      grid1.dataProvider.fillJsonData(res.data);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      grid1.gridView.hideToast();
    });
  }

  function saveData(targetGrid) {
    targetGrid.gridView.commit(true);
    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];
        let errFlag = "";

        changes = changes.concat(
            targetGrid.dataProvider.getAllStateRows().created,
            targetGrid.dataProvider.getAllStateRows().updated,
            targetGrid.dataProvider.getAllStateRows().deleted,
            targetGrid.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          let data = targetGrid.dataProvider.getJsonRow(row);
          if(!data.FR_ITEM_CD || !data.TO_ITEM_CD || !data.PLNT_CD || !data.JCT){
            errFlag = "Y";
          }
          changeRowData.push(data);
        });

        if (changeRowData.length === 0) {
          //저장 할 내용이 없습니다.
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"), { close: false });
        } else if (errFlag === "Y") {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey("MSG_0006"), { close: false });
        } else {
          zAxios({
            method: "post",
            headers: { "content-type": "application/json" },
            url: baseURI() + "fp/co/HO_CO_JCT_MST/s1",
            data: changeRowData,
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

  /* 조회조건 팝업off */
  function setFrItemCd(items) {
    let itemCdArr = [];
    items.forEach(function (row) {
      itemCdArr.push(row.ITEM_CD);
    });
    setValue("frItemCd", itemCdArr.join("|"));
  }

  function setToItemCd(items) {
    let itemCdArr = [];
    items.forEach(function (row) {
      itemCdArr.push(row.ITEM_CD);
    });
    setValue("toItemCd", itemCdArr.join("|"));
  }

  function setPlntCd(plnts) {
    let plntCdArr = [];
    plnts.forEach(function (row) {
      plntCdArr.push(row.PLNT_CD);
    });
    setValue("plntCd", plntCdArr.join("|"));
  }

  /* 그리드 팝업off */
  function setGridFrItemCd(gridRow) {
    grid1.gridView.commit(true);
    let itemIndex = grid1.gridView.getCurrent().dataRow;
    grid1.dataProvider.setValue(itemIndex, 'FR_ITEM_CD', gridRow[0].ITEM_CD);
    grid1.dataProvider.setValue(itemIndex, 'FR_ITEM_NM', gridRow[0].ITEM_NM);
  }

  function setGridToItemCd(gridRow) {
    grid1.gridView.commit(true);
    let itemIndex = grid1.gridView.getCurrent().dataRow;
    grid1.dataProvider.setValue(itemIndex, 'TO_ITEM_CD', gridRow[0].ITEM_CD);
    grid1.dataProvider.setValue(itemIndex, 'TO_ITEM_NM', gridRow[0].ITEM_NM);
  }

  function setGridPlntCd(gridRow) {
    grid1.gridView.commit(true);
    let itemIndex = grid1.gridView.getCurrent().dataRow;
    grid1.dataProvider.setValue(itemIndex, 'PLNT_CD', gridRow[0].PLNT_CD);
    grid1.dataProvider.setValue(itemIndex, 'PLNT_NM', gridRow[0].PLNT_NM);
  }

  const reloadPrefInfo = (viewCd, userName, grid, grpCd, gridCd) => {
    if (grid) {
      grid.loadCrossTabInfoAndPrefInfo(viewCd, grpCd, userName);
    }
  };

  return (
    <>
      <ContentInner>
        {/* <ViewPath {...viewPathProps} submit={handleSubmit(onSubmit, onError)}></ViewPath> */}
        <SearchArea>
          <SearchRow>
            {/* direction : row, column */}
            <InputField type="action" name="plntCd" label={transLangKey("HOBL_FP_PLNT_CD")+" "+transLangKey("HOBL_FP_CODE")+"/"+transLangKey("HOBL_FP_NAME")} onClick={() => {setPlntPopupOpen(true)}} control={control}>
              <Icon.Search />
            </InputField>
            <InputField type="text" name="resCd" label={transLangKey("HOBL_FP_RES_CD")+" "+transLangKey("HOBL_FP_CODE")+"/"+transLangKey("HOBL_FP_NAME")} control={control}></InputField>
            <InputField type="action" name="frItemCd" label={"From "+transLangKey("HOBL_FP_ITEM")+" "+transLangKey("HOBL_FP_CODE")+"/"+transLangKey("HOBL_FP_NAME")} onClick={() => {setFrItemPopupOpen(true)}} control={control}>
              <Icon.Search />
            </InputField>
            <InputField type="action" name="toItemCd" label={"TO "+transLangKey("HOBL_FP_ITEM")+" "+transLangKey("HOBL_FP_CODE")+"/"+transLangKey("HOBL_FP_NAME")} onClick={() => {setToItemPopupOpen(true)}} control={control}>
              <Icon.Search />
            </InputField>
          </SearchRow>
        </SearchArea>
        <ButtonArea title={transLangKey("HO_CO_JCT_MST")}>
          <LeftButtonArea>
            <GridExcelExportButton type="icon" grid="grid1" options={excelExportOptions} />
          </LeftButtonArea>
          <RightButtonArea>
            <GridAddRowButton grid="grid1" type="icon"></GridAddRowButton>
            {/* <GridDeleteRowButton grid="grid1" type="icon" onDelete={onDelete} onAfterDelete={onAfterDelete}></GridDeleteRowButton> */}
            <GridSaveButton grid="grid1" type="icon" onClick={() => {saveData(grid1);}}/>
          </RightButtonArea>
        </ButtonArea>
        <ResultArea sizes={[100, 50]} direction={"vertical"}>
          <BaseGrid id="grid1" items={grid1Items} viewCd="HO_CO_JCT_MST" gridCd="HO_CO_JCT_MST-RST_CPT_01" userName={username} afterGridCreate={afterGridCreate}></BaseGrid>
        </ResultArea>
        <StatusArea message={message} show={false}>
          <GridCnt grid="grid1" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")}></GridCnt>
        </StatusArea>
      </ContentInner>
      {frItemPopupOpen && <PopSelectItem open={frItemPopupOpen} onClose={() => setFrItemPopupOpen(false)} confirm={setFrItemCd} viewId={"HO_CO_JCT_MST"}></PopSelectItem>}
      {toItemPopupOpen && <PopSelectItem open={toItemPopupOpen} onClose={() => setToItemPopupOpen(false)} confirm={setToItemCd} viewId={"HO_CO_JCT_MST"}></PopSelectItem>}
      {plntPopupOpen && <PopSelectPlnt open={plntPopupOpen} onClose={() => setPlntPopupOpen(false)} confirm={setPlntCd} viewId={"HO_CO_JCT_MST"}></PopSelectPlnt>}
      {gridFrItemPopupOpen && <PopSelectItem open={gridFrItemPopupOpen} onClose={() => setGridFrItemPopupOpen(false)} confirm={setGridFrItemCd} viewId={"HO_CO_JCT_MST"}></PopSelectItem>}
      {gridToItemPopupOpen && <PopSelectItem open={gridToItemPopupOpen} onClose={() => setGridToItemPopupOpen(false)} confirm={setGridToItemCd} viewId={"HO_CO_JCT_MST"}></PopSelectItem>}
      {gridplntPopupOpen && <PopSelectPlnt open={gridplntPopupOpen} onClose={() => setGridPlntPopupOpen(false)} confirm={setGridPlntCd} viewId={"HO_CO_JCT_MST"}></PopSelectPlnt>}
      <PopPersonalize open={personalizeOpen} onClose={() => setPersonalizeOpen(false)} resetCallback={reloadPrefInfo} viewCd="HO_CO_JCT_MST" grid={grid1} username={username} authTpId={""}></PopPersonalize>
    </>
  );
}

export default HoCoResMst;
