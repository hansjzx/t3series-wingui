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

let grid1Items = [
  {
    name: 'ITEM_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'HOBL_FP_ITEM', headerVisible: true,
    childs: [
        { name: "ITEM_CD", dataType: "text", headerText: "HOBL_FP_CODE", visible: true, editable: false, width: 100, textAlignment: "center" },
        { name: "ITEM_NM", dataType: "text", headerText: "HOBL_FP_NAME", visible: true, editable: false, width: 250, textAlignment: "near" },
        { name: "ITEM_TYPE", dataType: "text", headerText: "HOBL_FP_TYPE", visible: true, editable: false, width: 80, textAlignment: "center" },
        { name: "ITEM_SPEC", dataType: "text", headerText: "HOBL_FP_SPEC", visible: true, editable: false, width: 80, textAlignment: "center" },
        { name: "ITEM_UOM", dataType: "text", headerText: "HOBL_FP_UOM", visible: true, editable: false, width: 80, textAlignment: "center" },
        { name: "ITEM_VOL", dataType: "text", headerText: "HOBL_FP_VOL", visible: true, editable: false, width: 80, textAlignment: "center" },
        { name: "ITEM_GRP", dataType: "text", headerText: "HOBL_FP_GRP", visible: true, editable: false, width: 80, textAlignment: "center" },
        { name: "OIL_TYPE", dataType: "text", headerText: "HOBL_FP_OIL_TYPE", visible: true, editable: false, width: 80, textAlignment: "center" },
        { name: "BLEN_CD", dataType: "text", headerText: "HOBL_FP_BLEN_CD", visible: true, editable: false, width: 80, textAlignment: "center" },
        { name: "CAP_COLOR", dataType: "text", headerText: "HOBL_FP_CAP_COLOR", visible: true, editable: false, width: 80, textAlignment: "center" },
        { name: "DO_EX_SE", dataType: "text", headerText: "HOBL_FP_DO_EX_SE", visible: true, editable: false, width: 100, textAlignment: "center" },
        { name: "PACK_TYPE", dataType: "text", headerText: "HOBL_FP_PACK_TYPE", visible: true, editable: false, width: 80, textAlignment: "center" },
        { name: "PACK_QTY", dataType: "number", headerText: "HOBL_FP_PACK_QTY", visible: true, editable: false, width: 80, textAlignment: "far", numberFormat: "#,###.###" },
        { name: "ITEM_GRAD", dataType: "text", headerText: "HOBL_FP_ITEM_GRAD", visible: true, editable: true, width: 80, textAlignment: "center" },
        { name: "MOQ", dataType: "number", headerText: "HOBL_FP_MOQ", visible: true, editable: false, width: 80, textAlignment: "far", numberFormat: "#,###.###" },
        { name: "SAFE_STCK", dataType: "number", headerText: "HOBL_FP_SAFE_STCK", visible: true, editable: false, width: 80, textAlignment: "far", numberFormat: "#,###.###" },
        { name: "LEAD_TM", dataType: "text", headerText: "HOBL_FP_LEAD_TM", visible: true, editable: true, width: 80, textAlignment: "center" },
        { name: "SESON_YN", dataType: "boolean", headerText: "HOBL_FP_SESON_YN", visible: true, editable: true, width: 80, textAlignment: "center" },
        { name: "KEY_ITEM_YN", dataType: "boolean", headerText: "HOBL_FP_KEY_ITEM_YN", visible: true, editable: true, width: 100, textAlignment: "center" },
        { name: "USE_YN", dataType: "boolean", headerText: "HOBL_FP_USE_YN", visible: true, editable: true, width: 80, textAlignment: "center" },
    ]
  },
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
  // allColumns: true,
  separateRows: true,
  footer: "default",
  headerDepth: 2,
  importExceptFields: { 0: "id" },
};

function HoCoItemMst(props) {
  const [username] = useUserStore((state) => [state.username]);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const [itemPopupOpen, setItemPopupOpen] = useState(false);
  const [personalizeOpen, setPersonalizeOpen] = useState(false);
  const [option1, setOption1] = useState([]);

  //2. 그리드 Object
  const [grid1, setGrid1] = useState(null);

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
      itemCd: "",
      itemType: "",
      doExSe: "ALL",
      keyItemYn: "ALL",
      useYn: "ALL",
    },
  });

  useEffect(() => {
    async function loadAsyncList() {
      const arr = await loadComboList({
        PROCEDURE_NAME: "PR_SC_UI_COMMON_CODE_Q01",
        URL: "common/combos",
        CODE_KEY: "CODE",
        CODE_VALUE: "NAME",
        PARAM: {"P_CODE": "ITEM_TYPE_LIST", "P_ATTR1": "", "P_ATTR2": "", "P_ATTR3": "", "P_ATTR4": "", "P_ATTR5": "","P_UI_ID": "HOBL_FP_UI_1000"},
        ALLFLAG: true,
        TRANSLANG_LABEL: true,
      });
      setOption1(arr);
      setValue("itemType", arr[0].value);
    }
    loadAsyncList();
  }, []);

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
      //columnResizable : false
    });

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
      'P_ITEM_CD': getValues('itemCd'),
      'P_ITEM_TYPE': getValues('itemType'),
      'P_DO_EX_SE': getValues('doExSe'),
      'P_KEY_ITEM_YN': getValues('keyItemYn'),
      'P_USE_YN': getValues('useYn'),
      'P_USER_ID': username,
    }

    zAxios({
      method: 'post',
      headers: { 'content-type': 'application/json' },
      url: baseURI() + 'fp/co/HO_CO_ITEM_MST/q1',
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

        changes = changes.concat(
            targetGrid.dataProvider.getAllStateRows().created,
            targetGrid.dataProvider.getAllStateRows().updated,
            targetGrid.dataProvider.getAllStateRows().deleted,
            targetGrid.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          let data = targetGrid.dataProvider.getJsonRow(row);
          data.SESON_YN = data.SESON_YN ? "Y" : "N";
          data.KEY_ITEM_YN = data.KEY_ITEM_YN ? "Y" : "N";
          data.USE_YN = data.USE_YN ? "Y" : "N";
          data.USER_ID = username;
          changeRowData.push(data);
        });

        if (changeRowData.length === 0) {
          //저장 할 내용이 없습니다.
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"), { close: false });
        } else {
          zAxios({
            method: "post",
            headers: { "content-type": "application/json" },
            url: baseURI() + "fp/co/HO_CO_ITEM_MST/s1",
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

  function setItemCd(items) {
    let itemCdArr = [];
    items.forEach(function (row) {
      itemCdArr.push(row.ITEM_CD);
    });
    setValue("itemCd", itemCdArr.join("|"));
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
            <InputField type="action" name="itemCd" label={transLangKey("HOBL_FP_ITEM")+" "+transLangKey("HOBL_FP_CODE")+"/"+transLangKey("HOBL_FP_NAME")} onClick={() => {setItemPopupOpen(true)}} control={control}>
              <Icon.Search />
            </InputField>
            <InputField type="select" name="itemType" label={transLangKey("HOBL_FP_ITEM_TYPE")} control={control} readonly={false} options={option1} />
            <InputField type="select" name="doExSe" label={transLangKey("HOBL_FP_DO_EX_SE")} control={control} readonly={false} options={[{ label: "ALL", value: "ALL" },{ label: "DO", value: "DO" },{ label: "EX", value: "EX" }]} />
            <InputField type="select" name="keyItemYn" label={transLangKey("HOBL_FP_KEY_ITEM_YN")} control={control} readonly={false} options={[{ label: "ALL", value: "ALL" },{ label: "Y", value: "Y" },{ label: "N", value: "N" }]} />
            <InputField type="select" name="useYn" label={transLangKey("HOBL_FP_USE_YN")} control={control} readonly={false} options={[{ label: "ALL", value: "ALL" },{ label: "Y", value: "Y" },{ label: "N", value: "N" }]} />
          </SearchRow>
        </SearchArea>
        <ButtonArea title={transLangKey("HO_CO_ITEM_MST")}>
          <LeftButtonArea>
            <GridExcelExportButton type="icon" grid="grid1" options={excelExportOptions} />
            {/*<GridExcelImportButton type="icon" grid="grid1"></GridExcelImportButton>*/}
          </LeftButtonArea>
          <RightButtonArea>
            {/* <GridAddRowButton grid="grid1" type="icon"></GridAddRowButton> */}
            {/* <GridDeleteRowButton grid="grid1" type="icon" onDelete={onDelete} onAfterDelete={onAfterDelete}></GridDeleteRowButton> */}
            <GridSaveButton grid="grid1" type="icon" onClick={() => {saveData(grid1);}}/>
          </RightButtonArea>
        </ButtonArea>
        <ResultArea sizes={[100, 50]} direction={"vertical"}>
          <BaseGrid id="grid1" items={grid1Items} viewCd="HO_CO_ITEM_MST" gridCd="HO_CO_ITEM_MST-RST_CPT_01" userName={username} afterGridCreate={afterGridCreate}></BaseGrid>
        </ResultArea>
        <StatusArea message={message} show={false}>
          <GridCnt grid="grid1" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")}></GridCnt>
        </StatusArea>
      </ContentInner>
      {itemPopupOpen && <PopSelectItem open={itemPopupOpen} onClose={() => setItemPopupOpen(false)} confirm={setItemCd} viewId={"HO_CO_ITEM_MST"}></PopSelectItem>}
      <PopPersonalize open={personalizeOpen} onClose={() => setPersonalizeOpen(false)} resetCallback={reloadPrefInfo} viewCd="HO_CO_ITEM_MST" grid={grid1} username={username} authTpId={""}></PopPersonalize>
    </>
  );
}

export default HoCoItemMst;
