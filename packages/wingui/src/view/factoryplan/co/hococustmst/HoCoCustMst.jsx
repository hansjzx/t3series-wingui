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
import PopSelectAccount from "@wingui/view/factoryplan/popup/PopSelectAccount";

let grid1Items = [
  {
      name: 'ITEM_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'HOBL_FP_CUST', headerVisible: true,
      childs: [
          { name: "CUST_CD", dataType: "text", headerText: "HOBL_FP_CODE", visible: true, editable: false, width: 80, textAlignment: "center" },
          { name: "CUST_NM", dataType: "text", headerText: "HOBL_FP_NAME", visible: true, editable: false, width: 250, textAlignment: "near" },
      ]
  },
  { name: "DO_EX_SE", dataType: "text", headerText: "HOBL_FP_DO_EX_SE", visible: true, editable: false, width: 100, textAlignment: "center" },
  { name: "DC_CD", dataType: "text", headerText: "HOBL_FP_DC_CD", visible: true, editable: false, width: 100, textAlignment: "center" },
  { name: "COUNTRY_CD", dataType: "text", headerText: "HOBL_FP_COUNTRY_CD", visible: true, editable: false, width: 100, textAlignment: "center" },
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

function HoCoCustMst(props) {
  const [username] = useUserStore((state) => [state.username]);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const [accountPopupOpen, setAccountPopupOpen] = useState(false);
  const [personalizeOpen, setPersonalizeOpen] = useState(false);

  //2. 그리드 Object
  const [grid1, setGrid1] = useState(null);

  //3. 상태 메시지
  const [message, setMessage] = useState();

  //4. FORM 데이터 처리
  const { handleSubmit, reset, control, getValues, setValue, watch, register, formState: { errors }, clearErrors
    } = useForm({
    defaultValues: {
      itemCd: "",
      doExSe: "ALL",
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
    grid1.gridView.showToast(progressSpinner + "Load Data...", true);

    let params = {
      'P_CUST_CD': getValues('accountCd'),
      'P_DO_EX_SE': getValues('doExSe'),
      'P_USER_ID': username,
    }

    zAxios({
      method: 'post',
      headers: { 'content-type': 'application/json' },
      url: baseURI() + 'fp/co/HO_CO_CUST_MST/q1',
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

  function onSetAccountCd(accounts) {
    let accountCdArr = [];
    accounts.forEach(function (row) {
      accountCdArr.push(row.CUST_CD);
    });
    setValue("accountCd", accountCdArr.join("|"));
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
            <InputField type="action" name="accountCd" label={transLangKey("HOBL_FP_CUST")+" "+transLangKey("HOBL_FP_CODE")+"/"+transLangKey("HOBL_FP_NAME")} onClick={() => {setAccountPopupOpen(true)}} control={control}>
              <Icon.Search />
            </InputField>
            <InputField type="select" name="doExSe" label={transLangKey("HOBL_FP_DO_EX_SE")} control={control} readonly={false} options={[{ label: "ALL", value: "ALL" },{ label: "DO", value: "DO" },{ label: "EX", value: "EX" }]} />
          </SearchRow>
        </SearchArea>
        <ButtonArea title={transLangKey("HO_CO_CUST_MST")}>
          <LeftButtonArea>
            <GridExcelExportButton type="icon" grid="grid1" options={excelExportOptions} />
          </LeftButtonArea>
          <RightButtonArea>
          </RightButtonArea>
        </ButtonArea>
        <ResultArea sizes={[100, 50]} direction={"vertical"}>
          <BaseGrid id="grid1" items={grid1Items} viewCd="HO_CO_CUST_MST" username={username} gridCd="HO_CO_CUST_MST-RST_CPT_01" afterGridCreate={afterGridCreate}></BaseGrid>
        </ResultArea>
        <StatusArea message={message} show={false}>
          <GridCnt grid="grid1" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")}></GridCnt>
        </StatusArea>
      </ContentInner>
      {accountPopupOpen && <PopSelectAccount open={accountPopupOpen} onClose={() => setAccountPopupOpen(false)} confirm={onSetAccountCd} viewId={"HO_CO_CUST_MST"}></PopSelectAccount>}
      <PopPersonalize open={personalizeOpen} onClose={() => setPersonalizeOpen(false)} resetCallback={reloadPrefInfo} viewCd={vom.active} grid={grid1} username={username} authTpId={""}></PopPersonalize>
    </>
  );
}

export default HoCoCustMst;
