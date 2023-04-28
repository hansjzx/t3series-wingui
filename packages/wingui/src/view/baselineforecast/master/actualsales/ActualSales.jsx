import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ButtonGroup, IconButton } from "@mui/material";
import {
  ContentInner,
  ResultArea,
  SearchArea,
  StatusArea,
  ButtonArea,
  LeftButtonArea,
  RightButtonArea,
  SearchRow,
  GridExcelImportButton,
  GridExcelExportButton,
  InputField,
  GridAddRowButton,
  GridDeleteRowButton,
  GridSaveButton,
  CommonBtn,
  BaseGrid,
  GridCnt,
  useViewStore,
  useUserStore,
  useStyles,
  zAxios,
} from "@zionex/wingui-core/src/common/imports";
import PopSelectItem from "@wingui/view/common/PopSelectItem";
import PopSelectAccount from "@wingui/view/common/PopSelectAccount";

let grid1Items = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: "0" },
  { name: "ACCOUNT_CD", dataType: "text", headerText: "ACCOUNT_CD", visible: true, editable: false, width: "70" },
  { name: "ACCOUNT_NM", dataType: "text", headerText: "ACCOUNT_NM", visible: true, editable: false, width: "80" },
  { name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: "70" },
  { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: "100" },
  { name: "BASE_DATE", dataType: "datetime", headerText: "BASE_DATE", visible: true, editable: false, width: "80", format: "yyyy-MM-dd" },
  { name: "STATUS", dataType: "text", headerText: "STATUS", visible: true, editable: false, width: "100", textAlignment: "center" },
  { name: "QTY", dataType: "number", headerText: "QTY", visible: true, editable: false, width: "100" },
  { name: "QTY_CORRECTION", dataType: "number", headerText: "QTY_CORRECTION", visible: true, editable: true, width: "100" },
  { name: "CORRECTION_COMMENT", dataType: "dropdown", headerText: "CORRECTION_COMMENT", visible: true, editable: true, width: "100", textAlignment: "center", useDropdown: true, lookupDisplay: true },
];

function ActualSales() {
  let [grid1, setGrid1] = useState(null);
  // let grd1 = useRef({});
  const classes = useStyles();

  const [itemPopupOpen, setItemPopupOpen] = useState(false);
  const [accountPopupOpen, setAccountPopupOpen] = useState(false);
  const [gridItemPopupOpen, setGridItemPopupOpen] = useState(false);
  const [gridAccountPopupOpen, setGridAccountPopupOpen] = useState(false);
  const [option1, setOption1] = useState([]);

  // let now = new Date();
  const [message, setMessage] = useState();
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [username] = useUserStore((state) => [state.username]);

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
      status: "ALL",
    },
  });

  const [params, setParams] = useState({});

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
        reset();
        grid1.dataProvider.clearRows();
      },
      visible: true,
      disable: false,
    },
  ];

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, "grid1");
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        if (grid1 != grdObj1) setGrid1(grdObj1);
      }
    }
  }, [viewData]);

  useEffect(() => {
    async function loadAsyncList() {
      const arr = await loadComboList({
        URL: "engine/dp/SRV_GET_SP_UI_DP_00_CONF_Q1",
        CODE_KEY: "CD",
        CODE_VALUE: "CD_NM",
        PARAM: { SP_UI_DP_00_CONF_Q1_01: "DP_SO_STATUS", SP_UI_DP_00_CONF_Q1_02: "", SP_UI_DP_00_CONF_Q1_03: "" },
        ALLFLAG: true,
        TRANSLANG_LABEL: true,
      });
      setOption1(arr);
      setValue("status", arr[0].value);
    }
    loadAsyncList();
  }, []);

  useEffect(() => {
    if (grid1) {
      setViewInfo(vom.active, "globalButtons", globalButtons);
      setOption();
      //예측알고리즘
      gridComboLoad(grid1, {
        URL: "engine/dp/SRV_GET_SP_UI_DP_00_CONF_Q1",
        CODE_VALUE: "CD",
        CODE_LABEL: "CD_NM",
        COLUMN: "CORRECTION_COMMENT",
        PROP: "lookupData",
        PARAM_KEY: ["SP_UI_DP_00_CONF_Q1_01", "SP_UI_DP_00_CONF_Q1_02", "SP_UI_DP_00_CONF_Q1_03"],
        PARAM_VALUE: ["BF_SO_MODIFY_REASON", "NN", ""],
        TRANSLANG_LABEL: true,
      });
    }
  }, [grid1]);

  const onSubmit = (data) => {
    //alert(JSON.stringify(data));
    grid1LoadData();
  };

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
  }

  const exportExcel = () => {
    let options = {
      headerDepth: 1,
      footer: "default",
      allColumns: true,
      lookupDisplay: true,
      separateRows: false,
    };

    exportGridtoExcel(grid1.gridView, options);
    //exportGridtoExcel(grid2.gridView, options);
  };

  const setOption = () => {
    setVisibleProps(grid1, true, true, false);
    grid1.gridView.displayOptions.fitStyle = "fill";

  };

  function grid1LoadData() {
    if (!getValues("itemCd")) {
      showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_0017"), { close: false });
      return;
    }
    let applyDttmF = new Date(getValues("applyDttmF"));
    let applyDttmT = new Date(getValues("applyDttmT"));

    let fromDate = applyDttmF ? applyDttmF.format("yyyy-MM-ddT00:00:00") : "19700101";
    let toDate = applyDttmT ? applyDttmT.format("yyyy-MM-ddT00:00:00") : "99991231";

    let param = new URLSearchParams();
    param.append("FROM_DATE", fromDate);
    param.append("TO_DATE", toDate);
    param.append("ITEM_CD", getValues("itemCd"));
    param.append("ITEM_NM", getValues("itemNm"));
    param.append("ACCOUNT_CD", getValues("accountCd"));
    param.append("ACCOUNT_NM", getValues("accountNm"));
    param.append("STATUS", getValues("status") === "ALL" ? "" : getValues("status"));
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_BF_05_Q1",
      data: param,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          grid1.dataProvider.fillJsonData(res.data.RESULT_DATA);
        }
//         setOption();
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  const saveData = (targetGrid) => {
    targetGrid.gridView.commit(true);

    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), function (answer) {
      if (answer) {
        let changes = [];
        changes = changes.concat(targetGrid.dataProvider.getAllStateRows().created, targetGrid.dataProvider.getAllStateRows().updated, targetGrid.dataProvider.getAllStateRows().deleted, targetGrid.dataProvider.getAllStateRows().createAndDeleted);

        let changeRowData = [];
        changes.forEach(function (row) {
          let data = targetGrid.dataProvider.getJsonRow(row);
          data.BASE_DATE = data.BASE_DATE.format("yyyy-MM-ddTHH:mm:ss");
          changeRowData.push(data);
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"));
        } else {
          targetGrid.gridView.showToast(progressSpinner + "Saving data...", true);

          let formData = new FormData();
          formData.append("changes", JSON.stringify(changeRowData));
          formData.append('procedure', "SP_UI_BF_05_S1_J");
          formData.append("P_USER_ID", username);

          zAxios({
            method: "post",
            headers: { "content-type": "application/json" },
            url: baseURI() + "common/json-save",
            data: formData,
          })
            .then(function (response) {})
            .catch(function (err) {
              console.log(err);
            })
            .then(function () {
              targetGrid.gridView.hideToast();
              grid1LoadData();
            });
        }
      }
    });
  };
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

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <InputField type={"datetime"} name="applyDttmF" label={transLangKey("FROM_DATE")} control={control} dateformat="yyyy-MM-dd" />
            <InputField type={"datetime"} name="applyDttmT" label={transLangKey("TO_DATE")} control={control} dateformat="yyyy-MM-dd" />
            <InputField
              type="action"
              name="itemCd"
              label={transLangKey("ITEM_CD")}
              onClick={() => {
                openItemPopup();
              }}
              control={control}
              rules={{ required: transLangKey("MSG_0017") }}>
              <Icon.Search />
            </InputField>
            <InputField type={"text"} name="itemNm" label={transLangKey("ITEM_NM")} control={control} />
            <InputField
              type="action"
              name="accountCd"
              label={transLangKey("ACCOUNT_CD")}
              onClick={() => {
                openAccountPopup();
              }}
              control={control}>
              <Icon.Search />
            </InputField>
            <InputField type={"text"} name="accountNm" label={transLangKey("ACCOUNT_NM")} control={control} readonly={false} />
            <InputField type="select" name="status" label={transLangKey("STATUS")} control={control} readonly={false} options={option1} />
          </SearchRow>
        </SearchArea>
        <ButtonArea title={transLangKey("UI_BF_05")}>
          <LeftButtonArea>
            <GridExcelExportButton grid="grid1" type="icon"></GridExcelExportButton>
            {/*<GridExcelImportButton grid="grid1" type="icon"></GridExcelImportButton>*/}
          </LeftButtonArea>
          <RightButtonArea>
            <ButtonGroup>
              {/* <GridAddRowButton grid="grid1" type="icon"></GridAddRowButton> */}
              {/* <GridDeleteRowButton grid="grid1" type="icon" onDelete={onDelete} onAfterDelete={onAfterDelete}></GridDeleteRowButton> */}
              {/* <CommonBtn style={{ width: "60px" }} onClick={() => { saveData(grid1) }}>{transLangKey("SAVE")}</CommonBtn> */}
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
        <ResultArea sizes={[100, 50]} direction={"vertical"}>
          <BaseGrid id="grid1" items={grid1Items}></BaseGrid>
        </ResultArea>
        <StatusArea show={false} message={message}>
          <GridCnt grid="grid1" format={"{0} 건 조회되었습니다."}></GridCnt>
        </StatusArea>
      </ContentInner>
      {itemPopupOpen && <PopSelectItem open={itemPopupOpen} onClose={() => setItemPopupOpen(false)} confirm={setItemCd}></PopSelectItem>}
      {accountPopupOpen && <PopSelectAccount open={accountPopupOpen} onClose={() => setAccountPopupOpen(false)} confirm={setAccountCd}></PopSelectAccount>}
      {gridItemPopupOpen && <PopSelectItem open={gridItemPopupOpen} onClose={() => setGridItemPopupOpen(false)} confirm={setGridItemCd} multiple={true}></PopSelectItem>}
      {gridAccountPopupOpen && <PopSelectAccount open={gridAccountPopupOpen} onClose={() => setGridAccountPopupOpen(false)} confirm={setGridAccountCd} multiple={true}></PopSelectAccount>}
    </>
  );
}

export default ActualSales;
