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
import PopPersonalize from "@wingui/view/common/PopPersonalize";
import PopSelectItem from "@wingui/view/factoryplan/popup/PopSelectItem";
import PopSelectPlnt from "@wingui/view/factoryplan/popup/PopSelectPlnt";

let grid1Items = [
  {
    name: 'PLNT_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'HOBL_FP_PLNT', headerVisible: true,
    childs: [
      { name: "PLNT_CD", dataType: "text", headerText: "HOBL_FP_CODE", visible: true, editable: false, width: 80, textAlignment: "center" },
      { name: "PLNT_NM", dataType: "text", headerText: "HOBL_FP_NAME", visible: true, editable: false, width: 200, textAlignment: "near" },
    ]
  },
  {
    name: 'PROD_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'HOBL_FP_PROD', headerVisible: true,
    childs: [
      { name: "PROD_ITEM_CD", dataType: "text", headerText: "HOBL_FP_CODE", visible: true, editable: false, width: 80, textAlignment: "center" },
      { name: "ITEM_NM", dataType: "text", headerText: "HOBL_FP_NAME", visible: true, editable: false, width: 250, textAlignment: "near" },
      { name: "ALT_BOM_CD", dataType: "text", headerText: "HOBL_FP_ALT_BOM_CD", visible: true, editable: false, width: 80, textAlignment: "center" },
      { name: "OIL_TYPE", dataType: "text", headerText: "HOBL_FP_OIL_TYPE", visible: true, editable: false, width: 80, textAlignment: "center" },
      { name: "DO_EX_SE", dataType: "text", headerText: "HOBL_FP_DO_EX_SE", visible: true, editable: false, width: 100, textAlignment: "center" },
      { name: "PROD_QTY", dataType: "number", headerText: "HOBL_FP_PROD_QTY", visible: true, editable: false, width: 80, textAlignment: "center", numberFormat: "#,###" },
      { name: "PROD_QTY_UOM", dataType: "text", headerText: "HOBL_FP_PROD_QTY", visible: true, editable: false, width: 80, textAlignment: "center" },
    ]
  },
  {
    name: 'COMP_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'HOBL_FP_COMP', headerVisible: true,
    childs: [
      { name: "COMP_ITEM_CD", dataType: "text", headerText: "HOBL_FP_CODE", visible: true, editable: false, width: 80, textAlignment: "center" },
      { name: "COMP_ITEM_NM", dataType: "text", headerText: "HOBL_FP_NAME", visible: true, editable: false, width: 200, textAlignment: "near" },
      { name: "COMP_QTY", dataType: "number", headerText: "HOBL_FP_QTY", visible: true, editable: false, width: 100, textAlignment: "right", numberFormat: "#,###" },
      { name: "COMP_QTY_UOM", dataType: "text", headerText: "HOBL_FP_UOM", visible: true, editable: false, width: 100, textAlignment: "center" },
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

function HoCoBorMst(props) {
  const [username] = useUserStore((state) => [state.username]);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const [itemPopupOpen, setItemPopupOpen] = useState(false);
  const [plntPopupOpen, setPlntPopupOpen] = useState(false);
  const [personalizeOpen, setPersonalizeOpen] = useState(false);
  const [option1, setOption1] = useState([]);

  //2. 그리드 Object
  const [grid1, setGrid1] = useState(null);

  //3. 상태 메시지
  const [message, setMessage] = useState();

  //4. FORM 데이터 처리
  const { handleSubmit, reset, control, getValues, setValue, watch, register, formState: { errors }, clearErrors
    } = useForm({
    defaultValues: {
      itemCd: "",
      itemType: "",
      doExSe: "ALL",
      keyItemYn: "ALL",
      useYn: "ALL",
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
      'P_PLNT_CD': getValues('plntCd'),
      'P_USER_ID': username,
    }
    zAxios({
      method: 'post',
      headers: { 'content-type': 'application/json' },
      url: baseURI() + 'fp/co/HO_CO_BOR_MST/q1',
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

  function setItemCd(items) {
    let itemCdArr = [];
    items.forEach(function (row) {
      itemCdArr.push(row.ITEM_CD);
    });
    setValue("itemCd", itemCdArr.join("|"));
  }

  function setPlntCd(plnts) {
    let plntCdArr = [];
    plnts.forEach(function (row) {
      plntCdArr.push(row.PLNT_CD);
    });
    setValue("plntCd", plntCdArr.join("|"));
  }

  const reloadPrefInfo = (viewCd, userName, grid, grpCd, gridCd) => {
    if (grid) grid.loadCrossTabInfoAndPrefInfo(viewCd, grpCd, userName);
  };

  return (
    <>
      <ContentInner>
        {/* <ViewPath {...viewPathProps} submit={handleSubmit(onSubmit, onError)}></ViewPath> */}
        <SearchArea>
          <SearchRow>
            {/* direction : row, column */}
            <InputField type="action" name="plntCd" label={transLangKey("HOBL_FP_PLNT")+" "+transLangKey("HOBL_FP_CODE")+"/"+transLangKey("HOBL_FP_NAME")} onClick={() => {setPlntPopupOpen(true)}} control={control}>
              <Icon.Search />
            </InputField>
            <InputField type="action" name="itemCd" label={transLangKey("HOBL_FP_ITEM")+" "+transLangKey("HOBL_FP_CODE")+"/"+transLangKey("HOBL_FP_NAME")} onClick={() => {setItemPopupOpen(true)}} control={control}>
              <Icon.Search />
            </InputField>
          </SearchRow>
        </SearchArea>
        <ButtonArea title={transLangKey("HO_CO_BOR_MST")}>
          <LeftButtonArea>
          </LeftButtonArea>
          <RightButtonArea>
          </RightButtonArea>
        </ButtonArea>
        <ResultArea sizes={[100, 50]} direction={"vertical"}>
          <BaseGrid id="grid1" items={grid1Items} viewCd="HO_CO_BOR_MST" gridCd="HO_CO_BOR_MST-RST_CPT_01" userName={username} afterGridCreate={afterGridCreate}></BaseGrid>
        </ResultArea>
        <StatusArea message={message} show={false}>
          <GridCnt grid="grid1" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")}></GridCnt>
        </StatusArea>
      </ContentInner>
      {itemPopupOpen && <PopSelectItem open={itemPopupOpen} onClose={() => setItemPopupOpen(false)} confirm={setItemCd} viewId={"HO_CO_BOR_MST"}></PopSelectItem>}
      {plntPopupOpen && <PopSelectPlnt open={plntPopupOpen} onClose={() => setPlntPopupOpen(false)} confirm={setPlntCd} viewId={"HO_CO_BOR_MST"}></PopSelectPlnt>}
      <PopPersonalize open={personalizeOpen} onClose={() => setPersonalizeOpen(false)} resetCallback={reloadPrefInfo} viewCd="HO_CO_BOR_MST" grid={grid1} username={username} authTpId={""}></PopPersonalize>
    </>
  );
}

export default HoCoBorMst;
