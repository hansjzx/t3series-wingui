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
import PopSelectItem from "@wingui/view/factoryplan/popup/PopSelectItem";
import PopSelectPlnt from "@wingui/view/factoryplan/popup/PopSelectPlnt";

let grid1Items = [
    {
        name: 'ITEM_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'HOBL_FP_ITEM', headerVisible: true,
        childs: [
            { name: "ITEM_CD", dataType: "text", headerText: "HOBL_FP_CODE", visible: true, editable: false, width: 80, textAlignment: "center" },
            { name: "ITEM_NM", dataType: "text", headerText: "HOBL_FP_NAME", visible: true, editable: false, width: 150, textAlignment: "near" },
        ]
    },
    {
      name: 'PLNT_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'HOBL_FP_PLNT', headerVisible: true,
      childs: [
          { name: "PLNT_CD", dataType: "text", headerText: "HOBL_FP_CODE", visible: true, editable: false, width: 80, textAlignment: "center" },
          { name: "PLNT_NM", dataType: "text", headerText: "HOBL_FP_NAME", visible: true, editable: false, width: 150, textAlignment: "near" },
      ]
    },
    { name: "ASGN_PRTY", dataType: "text", headerText: "HOBL_FP_ASGN_PRTY", visible: true, editable: false, width: 80, textAlignment: "center" },
    { name: "ASGN_RATE", dataType: "text", headerText: "HOBL_FP_ASGN_RATE", visible: true, editable: false, width: 80, textAlignment: "center" },
    { name: "PROD_YN", dataType: "text", headerText: "HOBL_FP_PROD_YN", visible: true, editable: false, width: 80, textAlignment: "center" },
    {
      name: "USER_GROUP", dataType: "group", orientation: "horizontal", headerText: "HOBL_FP_USER", expandable: true, expanded: false,
      childs: [
        { name: "INS_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: 80, textAlignment: "center", groupShowMode: "expand" },
        { name: "INS_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: 100, textAlignment: "center",format: "yyyy-MM-dd HH:mm:ss", groupShowMode: "always" },
        { name: "UPD_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 80, textAlignment: "center", groupShowMode: "expand" },
        { name: "UPD_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 100, textAlignment: "center",format: "yyyy-MM-dd HH:mm:ss", groupShowMode: "always" },
      ]
    },
];

const exportOptions = {
  headerDepth: 2,
  footer: 'default',
  allColumns: true,
  lookupDisplay: true,
  separateRows: false
};

function HoPrPlntPrio(props) {
  const [username] = useUserStore((state) => [state.username]);

  //1. view page data store
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);

  //2. grid Object
  const [grid1, setGrid1] = useState(null);
  const [itemPopupOpen, setItemPopupOpen] = useState(false);
  const [plntPopupOpen, setPlntPopupOpen] = useState(false);

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
  const {handleSubmit, reset, control, getValues, setValue, watch, register, formState: { errors }, clearErrors} = useForm({
    defaultValues: {
      itemCd: "",
      plntCd: "",
      prodyn: "ALL",
    },
  });

  const globalButtons = [
    { name: "search", action: (e) => { onSubmit(); }, visible: true, disable: false},
    { name: "save", action: (e) => { }, visible: false, disable: false},
    { name: "refresh", action: (e) => { refresh(); }, visible: true, disable: false },
    { name: "personalization", action: (e) => { setPersonalizeOpen(true); }, visible: true, disable: false},
  ];

  useEffect(() => {
    if (grid1) {
      setViewInfo(vom.active, "globalButtons", globalButtons);
      setGridOptions();
    }
  }, [grid1]);

  function setGridOptions() {
    setVisibleProps(grid1, true, false, false);
    grid1.gridView.displayOptions.fitStyle = "none";
  }

  /** 이벤트 핸들러 */
  const onSubmit = (data) => {
    loadData(data);
  };

  function refresh() {
    reset();
    grid1.dataProvider.clearRows();
  }

  function loadData() {
    grid1.gridView.commit(true);
    grid1.gridView.showToast(progressSpinner + "Load Data...", true);

    let params = {
      'P_ITEM_CD': getValues('itemCd'),
      'P_PLNT_CD': getValues('plntCd'),
      'P_PROD_YN': getValues('prodyn'),
      'P_USER_ID': username,
    }

    zAxios({
      method: 'post',
      headers: { 'content-type': 'application/json' },
      url: baseURI() + 'fp/pr/HO_PR_PLNT_PRIO/q1',
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

  /** 이벤트 핸들러 끝 */

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            {/* direction : row, column */}
            <InputField type="action" name="itemCd" label={transLangKey("HOBL_FP_ITEM")+" "+transLangKey("HOBL_FP_CODE")+"/"+transLangKey("HOBL_FP_NAME")} onClick={() => {setItemPopupOpen(true)}} control={control}>
              <Icon.Search />
            </InputField>
            <InputField type="action" name="plntCd" label={transLangKey("HOBL_FP_PLNT")+" "+transLangKey("HOBL_FP_CODE")+"/"+transLangKey("HOBL_FP_NAME")} onClick={() => {setPlntPopupOpen(true)}} control={control}>
              <Icon.Search />
            </InputField>
            <InputField type="select" name="prodyn" label={transLangKey("HOBL_FP_PROD_YN")} control={control} readonly={false} options={[{ label: "ALL", value: "ALL" },{ label: "Y", value: "Y" },{ label: "N", value: "N" }]} />
          </SearchRow>
        </SearchArea>
        <ButtonArea title={transLangKey("HO_PR_PLNT_PRIO")}>
          <LeftButtonArea>
            <GridExcelExportButton grid="grid1" options={exportOptions} />
          </LeftButtonArea>
          <RightButtonArea>
          </RightButtonArea>
        </ButtonArea>
        <ResultArea>
          <BaseGrid id="grid1" items={grid1Items} viewCd="HO_PR_PLNT_PRIO" username={username} gridCd="HO_PR_PLNT_PRIO-RST_CPT_01"></BaseGrid>
        </ResultArea>
        <StatusArea show={false} message={message}>
          <GridCnt grid="grid1" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")}></GridCnt>
        </StatusArea>
      </ContentInner>
      {itemPopupOpen && <PopSelectItem open={itemPopupOpen} onClose={() => setItemPopupOpen(false)} confirm={setItemCd} viewId={"HO_PR_PLNT_PRIO"}></PopSelectItem>}
      {plntPopupOpen && <PopSelectPlnt open={plntPopupOpen} onClose={() => setPlntPopupOpen(false)} confirm={setPlntCd} viewId={"HO_PR_PLNT_PRIO"}></PopSelectPlnt>}
      <PopPersonalize open={personalizeOpen} onClose={() => setPersonalizeOpen(false)} resetCallback={reloadPrefInfo} viewCd={vom.active} grid={grid1} username={username} authTpId={""}></PopPersonalize>
    </>
  );
}

export default HoPrPlntPrio;