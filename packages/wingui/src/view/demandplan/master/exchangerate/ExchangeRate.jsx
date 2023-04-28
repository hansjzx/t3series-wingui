import React, { useState, useEffect } from "react";
import { Box, ButtonGroup, IconButton, iconClasses } from "@mui/material";
import { useForm, watch } from "react-hook-form";
import {
  ContentInner,
  ResultArea,
  SearchArea,
  StatusArea,
  ButtonArea,
  LeftButtonArea,
  RightButtonArea,
  InputField,
  GridAddRowButton,
  GridDeleteRowButton,
  GridSaveButton,
  BaseGrid,
  GridCnt,
  useViewStore,
  zAxios,
  GridExcelExportButton,
  GridExcelImportButton,
} from "@zionex/wingui-core/src/common/imports";
import { transLangKey } from "@wingui";
import { excelExportOptions, saveJson, loadOption, isEmptyArray } from "@wingui/view/demandplan/DpUtil";
import PopPersonalize from "@wingui/view/common/PopPersonalize";
import { useUserStore } from "@zionex/wingui-core/src/store/userStore";

const exchangerateItems1 = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: 100 },
  { name: "UNIT_UOM_VAL", dataType: "text", headerText: "UNIT_UOM_VAL", visible: false, editable: false, width: 100 },
  {
    name: "FROM_CURCY_CD",
    dataType: "dropdown",
    headerText: "FROM_CURCY_CD",
    visible: true,
    editable: false,
    width: 100,
    textAlignment: "center",
    useDropdown: true,
    lookupDisplay: true,
    styleCallback: function (grid, dataCell) {
      let ret = {};
      if (dataCell.item.rowState === "created" || dataCell.item.rowState === "appending" || dataCell.item.rowState === "inserting") {
        ret.editable = true;
        ret.styleName = "editable-text-column";
      } else {
        ret.editable = false;
      }
      return ret;
    },
  },
  { name: "FROM_CURCY_CD_ID", dataType: "text", headerText: "FROM_CURCY_CD_ID", visible: false, editable: false, width: 100, textAlignment: "center" },
  { name: "FROM_CURCY_NM", dataType: "text", headerText: "FROM_CURCY_NM", visible: true, editable: false, width: 100, textAlignment: "center" },
  { name: "FROM_DATE", dataType: "datetime", headerText: "FROM_DATE", visible: false, editable: false, width: 100, textAlignment: "center" },
  {
    name: "TO_CURCY_CD",
    dataType: "dropdown",
    headerText: "TO_CURCY_CD",
    visible: true,
    editable: false,
    width: 100,
    textAlignment: "center",
    useDropdown: true,
    lookupDisplay: true,
    styleCallback: function (grid, dataCell) {
      let ret = {};
      if (dataCell.item.rowState === "created" || dataCell.item.rowState === "appending" || dataCell.item.rowState === "inserting") {
        ret.editable = true;
        ret.styleName = "editable-text-column";
      } else {
        ret.editable = false;
      }
      return ret;
    },
  },
  { name: "TO_CURCY_CD_ID", dataType: "text", headerText: "TO_CURCY_CD_ID", visible: false, editable: false, width: 100, textAlignment: "center" },
  { name: "TO_CURCY_NM", dataType: "text", headerText: "TO_CURCY_NM", visible: true, editable: false, width: 100, textAlignment: "center" },
  { name: "TO_DATE", dataType: "datetime", headerText: "TO_DATE", visible: false, editable: false, width: 100, textAlignment: "center" },
  {
    name: "BASE_DATE",
    dataType: "datetime",
    headerText: "BASE_DATE",
    visible: true,
    editable: false,
    width: 100,
    textAlignment: "center",
    format: "yyyy-MM-dd",
    styleCallback: function (grid, dataCell) {
      let ret = {};
      if (dataCell.item.rowState === "created" || dataCell.item.rowState === "appending" || dataCell.item.rowState === "inserting") {
        ret.editable = true;
        ret.styleName = "editable-text-column";
      } else {
        ret.editable = false;
      }
      return ret;
    },
  },
  { name: "EXCHANGE_RATE", dataType: "number", headerText: "EXCHANGE_RATE", visible: true, editable: true, width: 100, numberFormat: "#,###.00000" },
  {
    name: "CURCY_TP_CD",
    dataType: "text",
    headerText: "CURCY_TP",
    visible: true,
    editable: false,
    width: 100,
    textAlignment: "center",
    useDropdown: true,
    lookupDisplay: true,
    styleCallback: function (grid, dataCell) {
      let ret = {};
      if (dataCell.item.rowState === "created" || dataCell.item.rowState === "appending" || dataCell.item.rowState === "inserting") {
        ret.editable = true;
        ret.styleName = "editable-text-column";
      } else {
        ret.editable = false;
      }
      return ret;
    },
  },
  { name: "CURCY_TP_ID", dataType: "text", headerText: "CURCY_TP_ID", visible: false, editable: false, width: 100, textAlignment: "center" },
];
let exchangerateItems2 = [
  { name: "FROM_CURCY_CD", dataType: "text", headerText: "FROM_CURCY_CD", visible: true, editable: false, width: 100, textAlignment: "center" },
  { name: "FROM_CURCY_CD_ID", dataType: "text", headerText: "FROM_CURCY_CD_ID", visible: false, editable: false, width: 100, textAlignment: "center" },
  { name: "TO_CURCY_CD", dataType: "text", headerText: "TO_CURCY_CD", visible: true, editable: false, width: 100, textAlignment: "center" },
  { name: "TO_CURCY_CD_ID", dataType: "text", headerText: "TO_CURCY_CD_ID", visible: false, editable: false, width: 100, textAlignment: "center" },
  { name: "DAT", dataType: "number", headerText: "DATE", visible: true, editable: false, width: 100, textAlignment: "right", numberFormat: "#,###.00000", iteration: { prefix: "DAT_", prefixRemove: "true" } },
];

let defaultCurrencyTypeId;
let defaultBucket;

function ExchangeRate() {
  const [setViewInfo] = useViewStore((state) => [state.setViewInfo]);
  const [username] = useUserStore((state) => [state.username]);
  const [fromCurrencyOption, setFromCurrencyOption] = useState([]);
  const [toCurrencyOption, setToCurrencyOption] = useState([]);
  const [currencyTypeOption, setCurrencyTypeOption] = useState([]);
  const [bucketOption, setBucketOption] = useState([]);
  const [personalizeOpen, setPersonalizeOpen] = useState(false);

  //2. 그리드 Object
  const [exchangeRateGrid1, setGrid1] = useState(null);
  const [exchangeRateGrid2, setGrid2] = useState(null);

  const globalButtons = [
    {
      name: "search",
      action: (e) => {
        onLoad();
      },
      visible: true,
      disable: false,
    },
    {
      name: "save",
      action: (e) => {
        saveJson(exchangeRateGrid1, "SP_UI_DP_07_S1_J", onLoad);
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

  function refresh() {
    reset();
    setValue("curcyTp", defaultCurrencyTypeId);
    setValue("bucket", defaultBucket);
    exchangeRateGrid1.dataProvider.clearRows();
    exchangeRateGrid2.dataProvider.clearRows();
  }

  useEffect(() => {
    loadFromToCurcy();
    loadCurcyType();
    loadBucket();
  }, []);

  //3. 상태 메시지
  const [message, setMessage] = useState(null);
  //4. FORM 데이타 처리
  const { control, getValues, setValue, watch, reset } = useForm({
    defaultValues: {
      appyScpe: [new Date(), new Date(new Date().setMonth(new Date().getMonth() + 1))],
      fromCurcyCd: "ALL",
      toCurcyCd: "ALL",
    },
  });

  const selectedCurrencyType = watch("curcyTp");

  useEffect(() => {
    setViewInfo(vom.active, "globalButtons", globalButtons);
  }, [exchangeRateGrid1]);

  useEffect(() => {
    if (exchangeRateGrid1 && exchangeRateGrid2) {
      onLoad();
    }
  }, [exchangeRateGrid1, exchangeRateGrid2]);

  /** 이벤트 핸들러 */

  //조회버튼 클릭 data는 form에 정의된 데이타.
  const onLoad = () => {
    loadData();
    loadData2();
  };

  function setGrid1Options(grid) {
    grid.gridView.setEditOptions({
      insertable: true,
      appendable: true,
    });
    grid.gridView.displayOptions.fitStyle = "fill";
    setVisibleProps(grid, true, true, true);
  }

  function setGrid2Options(grid) {
    grid.gridView.displayOptions.fitStyle = "fill";
    grid.gridView.setColumnProperty("TO_CURCY_CD", "mergeRule", { criteria: "value" });
    setVisibleProps(grid, true, false, false);
  }

  //조회조건 FromToCurcy
  const loadFromToCurcy = async () => {
    const options = await loadOption(true, "SRV_GET_SP_UI_DP_00_CM_CD_Q1", { SP_UI_DP_00_CM_CD_Q1_01: "CURRENCY", SP_UI_DP_00_CM_CD_Q1_02: "ALL" }, "ID", "CD", false, true);
    if (!isEmptyArray(options)) {
      setFromCurrencyOption(options);
      setToCurrencyOption(options);

      setValue("fromCurcyCd", options[0].value);
      setValue("toCurcyCd", options[0].value);
    }
  };
  //조회조건 currecyType
  const loadCurcyType = async () => {
    const options = await loadOption(true, "SRV_GET_SP_UI_DP_00_CONF_Q1", { SP_UI_DP_00_CONF_Q1_01: "DP_CURRENCY_TYPE", SP_UI_DP_00_CONF_Q1_02: "", SP_UI_DP_00_CONF_Q1_03: "" }, "ID", "CD_NM", false, true);
    if (!isEmptyArray(options)) {
      setCurrencyTypeOption(options);
      defaultCurrencyTypeId = options[0].value;
      setValue("curcyTp", defaultCurrencyTypeId);
    }
  };

  const getNewGridData = () => {
    const selectedCurrencyTypeData = currencyTypeOption.find((v) => v.value === selectedCurrencyType);
    let rs = {};
    console.log("selectedCurrencyTypeData", selectedCurrencyTypeData);
    if (selectedCurrencyTypeData !== null) {
      rs["CURCY_TP_CD"] = selectedCurrencyTypeData.data.CD;
    }
    const selectedFromCurrencyData = fromCurrencyOption.find((v) => v.value === getValues("fromCurcyCd"));
    if (selectedFromCurrencyData !== null && selectedFromCurrencyData.value !== "ALL") {
      rs["FROM_CURCY_CD"] = selectedFromCurrencyData.data.CD
    }
    const selectedToCurrencyData = toCurrencyOption.find((v) => v.value === getValues("toCurcyCd"));
    if (selectedToCurrencyData !== null && selectedToCurrencyData.value !== "ALL") {
      rs["TO_CURCY_CD"] = selectedToCurrencyData.data.CD
    }
    return rs;
  };

  //조회조건 bucket
  const loadBucket = async () => {
    const options = await loadOption(true, "SRV_GET_SP_UI_DP_00_CONF_Q1", { SP_UI_DP_00_CONF_Q1_01: "BUCKET", SP_UI_DP_00_CONF_Q1_02: "", SP_UI_DP_00_CONF_Q1_03: "" }, "CD", "CD_NM", false, true);
    if (!isEmptyArray(options)) {
      setBucketOption(options);
      defaultBucket = options[3].value;
      setValue("bucket", defaultBucket);
    }
  };

  function loadData() {
    let dateRange = getValues("appyScpe");
    let fromdate = dateRange ? new Date(dateRange[0]).format("yyyy-MM-ddT00:00:00") : "19700101";
    let todate = dateRange ? new Date(dateRange[1]).format("yyyy-MM-ddT00:00:00") : "99991231";
    let param = new URLSearchParams();
    param.append("SP_UI_DP_07_Q1_01", "data");
    param.append("SP_UI_DP_07_Q1_02", "");
    param.append("SP_UI_DP_07_Q1_03", fromdate);
    param.append("SP_UI_DP_07_Q1_04", todate);
    param.append("SP_UI_DP_07_Q1_05", getValues("fromCurcyCd") === undefined || getValues("fromCurcyCd") === "ALL" ? "" : getValues("fromCurcyCd"));
    param.append("SP_UI_DP_07_Q1_06", getValues("toCurcyCd") === undefined || getValues("toCurcyCd") === "ALL" ? "" : getValues("toCurcyCd"));
    param.append("SP_UI_DP_07_Q1_07", getValues("curcyTp"));
    param.append("timeout", 0);
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_07_Q1",
      data: param,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          exchangeRateGrid1.dataProvider.fillJsonData(res.data.RESULT_DATA);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function loadData2() {
    let dateRange = getValues("appyScpe");

    let fromdate = dateRange ? new Date(dateRange[0]).format("yyyy-MM-ddT00:00:00") : "202200101T00:00:00";
    let todate = dateRange ? new Date(dateRange[1]).format("yyyy-MM-ddT00:00:00") : "20201231T00:00:00";
    let param = new URLSearchParams();
    param.append("SP_UI_DP_07_Q2_01", fromdate);
    param.append("SP_UI_DP_07_Q2_02", todate);
    param.append("SP_UI_DP_07_Q2_03", getValues("fromCurcyCd") === undefined || getValues("fromCurcyCd") === "ALL" ? "" : getValues("fromCurcyCd"));
    param.append("SP_UI_DP_07_Q2_04", getValues("toCurcyCd") === undefined || getValues("toCurcyCd") === "ALL" ? "" : getValues("toCurcyCd"));
    param.append("SP_UI_DP_07_Q2_05", getValues("curcyTp"));
    param.append("SP_UI_DP_07_Q2_06", getValues("bucket"));
    param.append("timeout", 0);
    param.append("CROSSTAB", JSON.stringify(exchangeRateGrid2.gridView.crossTabInfo));
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_07_Q2",
      data: param,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          const dataArr = res.data.RESULT_DATA;
          exchangeRateGrid2.setData(dataArr);
        }
        if (exchangeRateGrid2.dataProvider.getRowCount() === 0) {
          exchangeRateGrid2.gridView.setDisplayOptions({
            showEmptyMessage: true,
            emptyMessage: transLangKey("MSG_NO_DATA"),
          });
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function onBeforeDelete(targetGrid) {
    // if (targetGrid.gridView.getCheckedRows().length === targetGrid.dataProvider.getRowCount()) {
    //   //적어도 하나 이상의 공통코드는 존재해야 합니다.
    //   showMessage(transLangKey("DELETE"), transLangKey("최소 하나 이상의 공통코드는 존재해야 합니다."), { close: false });
    //   return false;
    // }

    return true;
  }

  function onDelete(targetGrid, deleteRows) {
    let formData = new FormData();
    formData.append("changes", JSON.stringify(deleteRows));
    formData.append("USER_ID", username);
    formData.append("CHANGE_TYPE", "DELETE");
    formData.append("timeout", 0);

    if (deleteRows.length > 0) {
      return zAxios({
        method: "post",
        url: baseURI() + "engine/dp/SRV_SET_SP_UI_DP_07_D1",
        headers: { "content-type": "application/json" },
        data: formData,
      })
        .then((response) => {
          if (response.status === gHttpStatus.SUCCESS) {
            const rsData = response.data;
            if (rsData.RESULT_SUCCESS) {
              const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_07_D1_P_RT_MSG"];
              resultMSG === "MSG_0002" ? onLoad() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
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
  }

  function onAfterDelete() {
    //onLoad();
  }

  const reloadPrefInfo = (viewCd, userName, grid, grpCd, gridCd) => {
    if (grid) grid.loadCrossTabInfoAndPrefInfo(viewCd, grpCd, userName);
  };

  const afterGridCreate1 = (gridObj, gridView, dataProvider) => {
    setGrid1(gridObj);
    setGrid1Options(gridObj);
    gridComboLoad(gridObj, {
      URL: "engine/dp/SRV_GET_SP_UI_DP_00_CM_CD_Q1",
      CODE_VALUE: "CD",
      CODE_LABEL: "CD",
      COLUMN: "FROM_CURCY_CD",
      PROP: "lookupData",
      PARAM_KEY: ["SP_UI_DP_00_CM_CD_Q1_01", "SP_UI_DP_00_CM_CD_Q1_02"],
      PARAM_VALUE: ["CURRENCY", "", ""],
      TRANSLANG_LABEL: true,
    });
    gridComboLoad(gridObj, {
      URL: "engine/dp/SRV_GET_SP_UI_DP_00_CM_CD_Q1",
      CODE_VALUE: "CD",
      CODE_LABEL: "CD",
      COLUMN: "TO_CURCY_CD",
      PROP: "lookupData",
      PARAM_KEY: ["SP_UI_DP_00_CM_CD_Q1_01", "SP_UI_DP_00_CM_CD_Q1_02"],
      PARAM_VALUE: ["CURRENCY", "", ""],
      TRANSLANG_LABEL: true,
    });
    gridComboLoad(gridObj, {
      URL: "engine/dp/SRV_GET_SP_UI_DP_00_CONF_Q1",
      CODE_VALUE: "CD",
      CODE_LABEL: "CD_NM",
      COLUMN: "CURCY_TP_CD",
      PROP: "lookupData",
      PARAM_KEY: ["timeout", "SP_UI_DP_00_CONF_Q1_01", "SP_UI_DP_00_CONF_Q1_02", "SP_UI_DP_00_CONF_Q1_03", "CURRENT_OPERATION_CALL_ID"],
      PARAM_VALUE: [0, "DP_CURRENCY_TYPE", "", "", "OPC_SRH_CPT_T1_06_01_INIT_pricetype"],
      TRANSLANG_LABEL: true,
    });
  };
  const afterGridCreate2 = (gridObj, gridView, dataProvider) => {
    setGrid2(gridObj);
    setGrid2Options(gridObj);
  };
  /** 이벤트 핸들러 끝 */

  return (
    <>
      <ContentInner>
        <SearchArea>
          <InputField type="dateRange" name={"appyScpe"} label={transLangKey("APPY_SCPE")} control={control} dateformat="yyyy-MM-dd" />
          <InputField type={"select"} name={"fromCurcyCd"} label={transLangKey("FROM_CURCY_CD")} control={control} options={fromCurrencyOption} readonly={false} disabled={false} />
          <InputField type={"select"} name={"toCurcyCd"} label={transLangKey("TO_CURCY_CD")} control={control} options={toCurrencyOption} readonly={false} disabled={false} />
          <InputField type={"select"} name={"curcyTp"} label={transLangKey("CURCY_TP")} control={control} options={currencyTypeOption} readonly={false} disabled={false} />
        </SearchArea>
        <ResultArea sizes={[50, 50]} direction={"vertical"}>
          <Box>
            <ButtonArea>
              {/* -- 가능하지만..일단 지원하지 않는다.
                <LeftButtonArea>
                  <GridExcelExportButton type="icon" grid="exchangeRateGrid1" options={excelExportOptions} />
                  <GridExcelImportButton type="icon" grid="exchangeRateGrid1" />
                </LeftButtonArea>
  */}
              <RightButtonArea>
                <ButtonGroup variant="outlined">
                  <GridAddRowButton type="icon" grid="exchangeRateGrid1" onGetData={getNewGridData} />
                  <GridDeleteRowButton type="icon" grid="exchangeRateGrid1" onBeforeDelete={onBeforeDelete} onDelete={onDelete} onAfterDelete={onAfterDelete} />
                  <GridSaveButton
                    grid="exchangeRateGrid1"
                    type="icon"
                    onClick={() => {
                      saveJson(exchangeRateGrid1, "SP_UI_DP_07_S1_J", onLoad);
                    }}></GridSaveButton>
                </ButtonGroup>
              </RightButtonArea>
            </ButtonArea>
            <Box style={{ height: "calc(100% - 53px" }}>
              <BaseGrid id="exchangeRateGrid1" items={exchangerateItems1} viewCd={vom.active} userName={username} gridCd="UI_DP_07-RST_CPT_01" afterGridCreate={afterGridCreate1} />
            </Box>
          </Box>
          <Box>
            <ButtonArea>
              <LeftButtonArea>
                <InputField type={"select"} label={transLangKey("BUCKET")} name={"bucket"} control={control} options={bucketOption} useLabel={false} />
              </LeftButtonArea>
              <RightButtonArea>
                <IconButton
                  className={iconClasses.gridIconButton}
                  title={transLangKey("SEARCH")}
                  onClick={() => {
                    loadData2();
                  }}>
                  <Icon.Search />
                </IconButton>
              </RightButtonArea>
            </ButtonArea>
            <Box style={{ height: "calc(100% - 53px" }}>
              <BaseGrid id="exchangeRateGrid2" items={exchangerateItems2} viewCd={vom.active} userName={username} gridCd="UI_DP_07-RST_CPT_02" afterGridCreate={afterGridCreate2} />
            </Box>
          </Box>
        </ResultArea>
        <StatusArea show={false} message={message}>
          <GridCnt grid="exchangeRateGrid2" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")} />
        </StatusArea>
      </ContentInner>
      <PopPersonalize open={personalizeOpen} onClose={() => setPersonalizeOpen(false)} resetCallback={reloadPrefInfo} viewCd={vom.active} grid={[exchangeRateGrid1, exchangeRateGrid2]} username={username} authTpId={""}></PopPersonalize>
    </>
  );
}

export default ExchangeRate;
