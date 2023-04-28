import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { Box, FormControlLabel } from "@mui/material";
import { transLangKey } from "@wingui";
import { useUserStore } from "@zionex/wingui-core/src/store/userStore";
import {
  ContentInner,
  ResultArea,
  SearchArea,
  StatusArea,
  ButtonArea,
  LeftButtonArea,
  RightButtonArea,
  GridAddRowButton,
  GridDeleteRowButton,
  GridSaveButton,
  CommonButton,
  GridExcelExportButton,
  GridExcelImportButton,
  InputField,
  BaseGrid,
  GridCnt,
  useViewStore,
  useIconStyles,
  zAxios,
} from "@zionex/wingui-core/src/common/imports";
import { excelExportOptions, saveJson, loadOption, isEmptyArray } from "@wingui/view/demandplan/DpUtil";
import { loadAuthTypeData } from "@wingui/view/demandplan/entry/entry/entryUtil";

import PopPersonalize from "@wingui/view/common/PopPersonalize";
import PopSelectItem from "@wingui/view/common/PopSelectItem";
import PopSelectAccount from "@wingui/view/common/PopSelectAccount";
import ItemSearchBox from "@wingui/view/demandplan/common/ItemSearchBox";
import AccountSearchBox from "@wingui/view/demandplan/common/AccountSearchBox";
import PopSelectUser from "@wingui/view/demandplan/common/PopSelectUser";
import AntSwitch from "@wingui/view/demandplan/common/AntSwitch";

let grid1Items = [
  { name: "ID", dataType: "text", visible: false, editable: false, width: "0" },
  { name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", editable: false, width: "100", editableNew: true, button: "action", visible: true },
  { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", editable: false, width: "100", editableNew: true, visible: true },
  { name: "ACCOUNT_CD", dataType: "text", headerText: "ACCOUNT_CD", visible: true, editable: false, width: "100", editableNew: true, button: "action" },
  { name: "ACCOUNT_NM", dataType: "text", headerText: "ACCOUNT_NM", editable: false, width: "100", editableNew: true, visible: true },
  { name: "CURCY_CD", dataType: "text", headerText: "CURCY_CD_ID", editable: false, width: "100", title: "CURCY_CD_ID", editableNew: true, visible: true },
  { name: "BASE_DATE", dataType: "datetime", headerText: "BASE_DATE", editable: false, width: "120", title: "BASE_DATE", editableNew: true, format: "yyyy-MM-dd", datepicker: true, visible: true },
  { name: "UTPIC", dataType: "double", headerText: "UTPIC", visible: true, editable: true, width: "80", title: "UTPIC", numberFormat: "#,###.##", excelFormat: "#,##0.0#" },
  { name: "PRICE_TP_CD", dataType: "text", headerText: "PRICE_TP", editable: false, width: "100", editableNew: true, lang: true, visible: true, useDropdown: true, lookupDisplay: true },
  { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: "120", title: "CREATE_DTTM", format: "yyyy-MM-dd HH:mm:ss" },
];

let grid2Items = [
  { name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", width: "100", merge: true, visible: true },
  { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", width: "120", merge: true, visible: true },
  { name: "ACCOUNT_CD", dataType: "text", headerText: "ACCOUNT_CD", visible: true, width: "100", merge: true },
  { name: "ACCOUNT_NM", dataType: "text", headerText: "ACCOUNT_NM", width: "120", fix: true, merge: true, visible: true },
  { name: "DAT", dataType: "double", width: "100", visible: true, iteration: { prefix: "DAT_", prefixRemove: "true" } },
];

let defaultPriceTp;
function SalesPrice() {
  const itemSearchBoxRef = useRef();
  const [currentItemRef, setCurrentItemRef] = useState();
  const accountSearchBoxRef = useRef();
  const [currentAccountRef, setCurrentAccountRef] = useState();

  const [username, displayName, systemAdmin] = useUserStore((state) => [state.username, state.displayName, state.systemAdmin]);
  const [setViewInfo] = useViewStore((state) => [state.setViewInfo]);

  let [grid1, setGrid1] = useState(null);
  let [grid2, setGrid2] = useState(null);

  const [gridItemPopupOpen, setGridItemPopupOpen] = useState(false);
  const [gridAccountPopupOpen, setGridAccountPopupOpen] = useState(false);
  const [personalizeOpen, setPersonalizeOpen] = useState(false);
  const [userPopupOpen, setUserPopupOpen] = useState(false);

  const [priceTypeOption, setPriceTypeOption] = useState([]);
  const [bucketOption, setBucketOption] = useState([]);
  const [authTpOptions, setAuthTpData] = useState([]);
  const currentUserId = useRef(null);
  const currentAuthTp = useRef(null);

  const [message, setMessage] = useState();

  const {
    reset,
    control,
    getValues,
    setValue,
    watch,
    formState: { e },
  } = useForm({
    defaultValues: {
      dateRange: [new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date()],
      itemCd: "",
      itemNm: "",
      accountCd: "",
      accountNm: "",
      bucketType: "MONTH",
      ALL_USER_LOAD: true,
    },
  });
  const selectedPriceType = watch("priceType");

  let globalButtons = [];

  const selectedUserId = watch("USER_ID");
  const selectedAuthTp = watch("AUTH_TP");

  useEffect(() => {
    if (grid1 && grid2) {
      globalButtons = [
        {
          name: "search",
          action: () => {
            onLoad();
          },
          visible: true,
          disable: false,
        },
        {
          name: "save",
          action: () => {
            saveJson(grid1, "SP_UI_DP_20_S1_J", onLoad);
          },
          visible: true,
          disable: false,
        },
        {
          name: "refresh",
          action: () => {
            refresh();
          },
          visible: true,
          disable: false,
        },
        {
          name: "personalization",
          action: () => {
            setPersonalizeOpen(true);
          },
          visible: true,
          disable: false,
        },
      ];
      setViewInfo(vom.active, "globalButtons", globalButtons);
    }
  }, [grid1, grid2, selectedUserId, selectedAuthTp]);

  const refresh = () => {
    reset();
    currentItemRef.reset();
    currentAccountRef.reset();
    setValue("priceType", defaultPriceTp);
    grid1.dataProvider.clearRows();
    grid2.dataProvider.clearRows();
  };

  const setUserCd = (items) => {
    setValue("USER_ID", items[0].USER_ID);
    setValue("EMP_NM", items[0].EMP_NM);
  };

  useEffect(() => {
    loadPriceType();
    loadBucket();
    setValue("USER_ID", username);
    setValue("EMP_NM", displayName);

    if (itemSearchBoxRef) {
      if (itemSearchBoxRef.current) {
        setCurrentItemRef(itemSearchBoxRef.current);
      }
    }
    if (accountSearchBoxRef) {
      if (accountSearchBoxRef.current) {
        setCurrentAccountRef(accountSearchBoxRef.current);
      }
    }
    console.log(username, " systemAdmin:", systemAdmin);
  }, []);

  useEffect(() => {
    if (priceTypeOption && priceTypeOption.length > 0) {
      defaultPriceTp = priceTypeOption[0].value;
      setValue("priceType", defaultPriceTp);
    }
  }, [priceTypeOption]);

  useEffect(() => {
    if (grid1 && selectedUserId) {
      currentUserId.current = selectedUserId;
      loadAuthType();
    }
  }, [selectedUserId]);

  useEffect(() => {
    if (grid1) {
      currentAuthTp.current = selectedAuthTp;
    }
  }, [selectedAuthTp]);

  const afterGridCreate1 = (gridObj, gridView, dataProvider) => {
    setGrid1(gridObj);

    setGrid1Option(gridObj);
    //PRICE TP
    gridComboLoad(gridObj, {
      URL: "engine/dp/SRV_GET_SP_UI_DP_00_CONF_Q1",
      CODE_VALUE: "CD",
      CODE_LABEL: "CD_NM",
      COLUMN: "PRICE_TP_CD",
      PROP: "lookupData",
      PARAM_KEY: ["SP_UI_DP_00_CONF_Q1_01", "SP_UI_DP_00_CONF_Q1_02", "SP_UI_DP_00_CONF_Q1_03"],
      PARAM_VALUE: ["DP_PRICE_TYPE", "", ""],
      TRANSLANG_LABEL: true,
    });
  };

  const afterGridCreate2 = (gridObj, gridView, dataProvider) => {
    setGrid2(gridObj);
    setGrid2Option(gridObj);
  };

  const onLoad = () => {
    //alert(JSON.stringify(data));
    loadGrid1Data();
  };

  const setGrid1Option = (grid) => {
    setVisibleProps(grid, true, true, true);
    grid.gridView.onCellButtonClicked = (grid, itemIndex, column) => {
      if (column.fieldName === "ITEM_CD") {
        setGridItemPopupOpen(true);
      } else if (column.fieldName === "ACCOUNT_CD") {
        setGridAccountPopupOpen(true);
      }
    };
  };

  const setGrid2Option = (grid) => {};

  const loadAuthType = async () => {
    //console.log("loadAuthType in");
    const selUserId = getValues("USER_ID");
    if (!selUserId) return;

    let resultData = await loadAuthTypeData(selUserId);

    let options = [];
    if (resultData) {
      resultData.map((row, idx) => {
        options.push({ label: row.CD_NM, value: row.CD + row.EMP_ID, data: row });
      });
    }
    if (!isEmptyArray(options)) {
      setAuthTpData(options);
    }
  };

  useEffect(() => {
    if (authTpOptions && authTpOptions.length > 0) {
      setValue("AUTH_TP", authTpOptions[0].value);
    } else {
      setValue("AUTH_TP", "");
    }
  }, [authTpOptions]);

  const findAuthTpData = (authTp) => {
    let findOption = authTpOptions.find((item) => item.value === authTp);
    if (findOption) {
      return findOption.data;
    }
    return null;
  };
  const openUserPopup = (visible) => {
    setUserPopupOpen(visible);
  };

  const loadGrid1Data = () => {
    //const priceTpDt=priceTypeOption.find(v => v.ID === selectedPriceType)
    //console.log('priceTpDt:',priceTpDt)

    let dateRange = getValues("dateRange");

    let fromdate = dateRange ? dateRange[0].format("yyyy-MM-ddT00:00:00") : "19700101";
    let todate = dateRange ? dateRange[1].format("yyyy-MM-ddT00:00:00") : "99991231";

    let serveiceName = "SRV_GET_SP_UI_DP_21_Q1";
    let param = new URLSearchParams();
    if (systemAdmin && getValues("ALL_USER_LOAD")) {
      param.append("SP_UI_DP_21_Q1_01", "data");
      param.append("SP_UI_DP_21_Q1_02", "");
      param.append("SP_UI_DP_21_Q1_03", fromdate);
      param.append("SP_UI_DP_21_Q1_04", todate);
      param.append("SP_UI_DP_21_Q1_05", currentItemRef.getItemCode());
      param.append("SP_UI_DP_21_Q1_06", currentItemRef.getItemName());
      param.append("SP_UI_DP_21_Q1_07", currentAccountRef.getAccountCode());
      param.append("SP_UI_DP_21_Q1_08", currentAccountRef.getAccountName());
      param.append("SP_UI_DP_21_Q1_09", getValues("priceType"));
    } else {
      serveiceName = "SRV_GET_SP_UI_DP_20_Q1";
      const authTpData = findAuthTpData(selectedAuthTp);

      param.append("FROM_DATE", fromdate);
      param.append("TO_DATE", todate);
      param.append("ITEM_CD", currentItemRef.getItemCode());
      param.append("ITEM_NM", currentItemRef.getItemName());
      param.append("ACCOUNT_CD", currentAccountRef.getAccountCode());
      param.append("ACCOUNT_NM", currentAccountRef.getAccountName());
      param.append("PRICE_TP_ID", getValues("priceType"));
      param.append("EMP_NO", selectedUserId);
      param.append("AUTH_TP_ID", authTpData ? authTpData.ID : "");
    }

    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/" + serveiceName,
      data: param,
    })
      .then((res) => {
        grid1.setData(res.data.RESULT_DATA);
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => {
        loadGrid2Data();
      });
  };

  const loadGrid2Data = () => {
    let dateRange = getValues("dateRange");

    let applyDttmF = dateRange ? dateRange[0] : null;
    let applyDttmT = dateRange ? dateRange[1] : null;

    let fromdate = dateRange ? applyDttmF.format("yyyy-MM-ddT00:00:00") : "19700101";
    let todate = dateRange ? applyDttmT.format("yyyy-MM-ddT00:00:00") : "99991231";

    let serveiceName = "SRV_GET_SP_UI_DP_21_Q2";
    let param = new URLSearchParams();
    param.append("CROSSTAB", JSON.stringify(grid2.gridView.crossTabInfo));
    if (getValues("ALL_USER_LOAD")) {
      param.append("SP_UI_DP_21_Q2_01", fromdate);
      param.append("SP_UI_DP_21_Q2_02", todate);
      param.append("SP_UI_DP_21_Q2_03", currentItemRef.getItemCode());
      param.append("SP_UI_DP_21_Q2_04", currentItemRef.getItemName());
      param.append("SP_UI_DP_21_Q2_05", currentAccountRef.getAccountCode());
      param.append("SP_UI_DP_21_Q2_06", currentAccountRef.getAccountName());
      param.append("SP_UI_DP_21_Q2_07", getValues("priceType"));
      param.append("SP_UI_DP_21_Q2_08", getValues("bucketType"));
    } else {
      serveiceName = "SRV_GET_SP_UI_DP_20_Q2";
      const authTpData = findAuthTpData(selectedAuthTp);
      param.append("FROM_DATE", fromdate);
      param.append("TO_DATE", todate);
      param.append("ITEM_CD", currentItemRef.getItemCode());
      param.append("ITEM_NM", currentItemRef.getItemName());
      param.append("ACCOUNT_CD", currentAccountRef.getAccountCode());
      param.append("ACCOUNT_NM", currentAccountRef.getAccountName());
      param.append("PRICE_TP_ID", getValues("priceType"));
      param.append("BUKT", getValues("bucketType"));
      param.append("EMP_NO", selectedUserId);
      param.append("AUTH_TP_ID", authTpData ? authTpData.ID : "");
    }

    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/" + serveiceName,
      data: param,
    })
      .then((res) => {
        if (res.status === gHttpStatus.SUCCESS) {
          grid2.setData(res.data.RESULT_DATA);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadPriceType = async () => {
    const options = await loadOption(true, "SRV_GET_SP_UI_DP_00_CONF_Q1", { SP_UI_DP_00_CONF_Q1_01: "DP_PRICE_TYPE", SP_UI_DP_00_CONF_Q1_02: "", SP_UI_DP_00_CONF_Q1_03: "" }, "ID", "CD_NM", false, true);
    if (!isEmptyArray(options)) {
      setPriceTypeOption(options);
    }
  };

  const loadBucket = async () => {
    const options = await loadOption(true, "SRV_GET_SP_UI_DP_00_CONF_Q1", { SP_UI_DP_00_CONF_Q1_01: "BUCKET", SP_UI_DP_00_CONF_Q1_02: "", SP_UI_DP_00_CONF_Q1_03: "" }, "CD", "CD_NM", false, true);
    if (!isEmptyArray(options)) {
      setBucketOption(options);
    }
  };

  const getNewGridData = (gridObj) => {
    const selectedPriceTypeData = priceTypeOption.find((v) => v.value === selectedPriceType);
    //console.log('selectedPriceTypeData==>', selectedPriceTypeData);
    if (selectedPriceTypeData !== null) {
      //console.log('insert price type', selectedPriceTypeData.data.CD);
      return { PRICE_TP_CD: selectedPriceTypeData.data.CD };
    }
    return {};
  };

  const onDelete = (targetGrid, deleteRows) => {
    const itemIndex = targetGrid.gridView.getCurrent().dataRow;
    const operationId = targetGrid.dataProvider.getValue(itemIndex, 0);

    let formData = new FormData();
    formData.append("changes", JSON.stringify(deleteRows));
    formData.append("P_USER_ID", username);
    formData.append("OPERATOR_ID", operationId);
    formData.append("CHANGE_TYPE", "DELETE");
    formData.append("timeout", 0);

    if (deleteRows.length > 0) {
      return zAxios({
        method: "post",
        url: baseURI() + "engine/dp/SRV_SET_SP_UI_DP_21_D1",
        headers: { "content-type": "application/json" },
        data: formData,
      })
        .then((response) => {
          if (response.status === gHttpStatus.SUCCESS) {
            const rsData = response.data;
            if (rsData.RESULT_SUCCESS) {
              const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_21_D1_P_RT_MSG"];
              resultMSG === "MSG_0002" ? loadGrid1Data() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
            } else {
              showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
            }
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .then(() => {});
    }
  };

  const onAfterDelete = (targetGrid) => {
    if (targetGrid.gridId === "grid1") {
      //loadGrid1Data();
    }
  };

  const setGridItemCd = (records) => {
    let itemIndex = grid1.gridView.getCurrent().dataRow;
    grid1.dataProvider.setValue(itemIndex, "ITEM_CD", records[0].ITEM_CD);
    grid1.dataProvider.setValue(itemIndex, "ITEM_NM", records[0].ITEM_NM);
    grid1.gridView.commit(true);
  };

  const setGridAccountCd = (records) => {
    let itemIndex = grid1.gridView.getCurrent().dataRow;
    grid1.dataProvider.setValue(itemIndex, "ACCOUNT_CD", records[0].ACCOUNT_CD);
    grid1.dataProvider.setValue(itemIndex, "ACCOUNT_NM", records[0].ACCOUNT_NM);
    //grid1.dataProvider.setValue(itemIndex, 'ACCOUNT_ID', records[0].ID)
    grid1.gridView.commit(true);
  };

  const reloadPrefInfo = (viewCd, userName, grid, grpCd, gridCd) => {
    if (grid) {
      grid.loadCrossTabInfoAndPrefInfo(viewCd, grpCd, userName);
    }
  };

  return (
    <>
      <ContentInner>
        <SearchArea>
          <InputField type="dateRange" name="dateRange" label={transLangKey("APPY_SCPE")} control={control} dateformat="yyyy-MM-dd" />
          <ItemSearchBox ref={itemSearchBoxRef} keyValue={"itemName"} placeHolder={transLangKey("ITEM_NM")} />
          <AccountSearchBox ref={accountSearchBoxRef} keyValue={"accountName"} placeHolder={transLangKey("ACCOUNT_NM")} />
          <InputField type="select" name="priceType" label={transLangKey("PRICE_TP")} control={control} readonly={false} disabled={false} options={priceTypeOption} />
          {systemAdmin && (
            <FormControlLabel
              key={"ALL_USER_LOAD"}
              label={transLangKey("ALL_USER_LOAD")}
              style={{ marginLeft: "0.5rem", marginTop: "0.5rem", marginBottom: "0.5rem" }}
              control={
                <Controller
                  name={"ALL_USER_LOAD"}
                  control={control}
                  render={({ field: { onChange, value }, fieldState: {} }) => (
                    <AntSwitch
                      checked={value}
                      onChange={(event, newValue) => {
                        onChange(newValue);
                      }}
                      size="small"
                    />
                  )}
                />
              }
            />
          )}
          {(!systemAdmin || !watch("ALL_USER_LOAD")) && (
            <InputField
              name="USER_ID"
              label={transLangKey("USER_ID")}
              type="action"
              tooltip={transLangKey("USER_ID")}
              onClick={() => {
                openUserPopup(true);
              }}
              control={control}
              readonly={true}>
              <Icon.Search />
            </InputField>
          )}
          {(!systemAdmin || !watch("ALL_USER_LOAD")) && <InputField name="EMP_NM" label={transLangKey("EMP_NM")} control={control} readonly={true} />}
          {(!systemAdmin || !watch("ALL_USER_LOAD")) && <InputField name="AUTH_TP" label={transLangKey("AUTH_TP_ID")} type="select" control={control} options={authTpOptions} />}
        </SearchArea>
        <ResultArea sizes={[50, 50]} direction={"vertical"}>
          <Box>
            <ButtonArea title={transLangKey("UI_DP_21")}>
              {/* -- 가능하지만..일단 지원하지 않는다.
              <LeftButtonArea>
                <GridExcelImportButton type="icon" grid="grid1" />
                <GridExcelExportButton type="icon" grid="grid1" options={excelExportOptions} />
              </LeftButtonArea>
            */}
              <RightButtonArea>
                <GridAddRowButton grid="grid1" type="icon" onGetData={getNewGridData} />
                <GridDeleteRowButton grid="grid1" type="icon" onDelete={onDelete} onAfterDelete={onAfterDelete} />
                <GridSaveButton
                  grid="grid1"
                  type="icon"
                  onClick={() => {
                    saveJson(grid1, "SP_UI_DP_20_S1_J", onLoad);
                  }}
                />
              </RightButtonArea>
            </ButtonArea>
            <Box style={{ height: "calc(100% - 53px)" }}>
              <BaseGrid id="grid1" items={grid1Items} viewCd={vom.active} userName={username} gridCd={vom.active + "-RST_CPT_01"} afterGridCreate={afterGridCreate1} />
            </Box>
          </Box>
          <Box>
            <ButtonArea title={transLangKey("UTPIC")}>
              <LeftButtonArea>
                <InputField name="bucketType" label={transLangKey("BUCKET")} type="select" control={control} options={bucketOption} />
              </LeftButtonArea>
              <RightButtonArea>
                <CommonButton onClick={loadGrid2Data}>
                  <Icon.Search />
                </CommonButton>
              </RightButtonArea>
            </ButtonArea>
            <Box style={{ height: "calc(100% - 53px)" }}>
              <BaseGrid id="grid2" items={grid2Items} viewCd={vom.active} userName={username} gridCd={vom.active + "-RST_CPT_02"} afterGridCreate={afterGridCreate2} />
            </Box>
          </Box>
        </ResultArea>
        <StatusArea show={false} message={message}>
          <GridCnt grid="grid1" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")} />
        </StatusArea>
      </ContentInner>
      {gridItemPopupOpen && <PopSelectItem open={gridItemPopupOpen} onClose={() => setGridItemPopupOpen(false)} confirm={setGridItemCd} multiple={true} />}
      {gridAccountPopupOpen && <PopSelectAccount open={gridAccountPopupOpen} onClose={() => setGridAccountPopupOpen(false)} confirm={setGridAccountCd} multiple={true} />}
      <PopSelectUser open={userPopupOpen} onClose={() => openUserPopup(false)} confirm={setUserCd} multiple={false} />
      <PopPersonalize open={personalizeOpen} onClose={() => setPersonalizeOpen(false)} resetCallback={reloadPrefInfo} viewCd={vom.active} grid={[grid1, grid2]} username={username} />
    </>
  );
}

export default SalesPrice;
