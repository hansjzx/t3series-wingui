import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ButtonGroup } from "@mui/material";
import {
  ContentInner,
  ResultArea,
  SearchArea,
  useIconStyles,
  StatusArea,
  ButtonArea,
  LeftButtonArea,
  RightButtonArea,
  SearchRow,
  InputField,
  GridAddRowButton,
  GridDeleteRowButton,
  GridSaveButton,
  GridExcelExportButton,
  BaseGrid,
  GridCnt,
  useViewStore,
  CommonButton,
  zAxios,
} from "@zionex/wingui-core/src/common/imports";
import { transLangKey, vom, gridComboLoad } from "@wingui";
import { excelExportOptions, loadOption, isEmptyArray } from "@wingui/view/demandplan/DpUtil";
import PopPersonalize from "@wingui/view/common/PopPersonalize";
import { useUserStore } from "@zionex/wingui-core/src/store/userStore";

const grid1Items = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: 100, textAlignment: "center" },
  {
    name: "ACCOUNT_CD",
    dataType: "text",
    headerText: "ACCOUNT_CD",
    visible: true,
    editable: false,
    width: 100,
    textAlignment: "center",
    autoFilter: true,
    styleCallback: function (grid, dataCell) {
      let ret = {};
      if (dataCell.item.rowState === "created" || dataCell.item.rowState === "appending" || dataCell.item.rowState === "inserting") {
        ret.editable = true;
        ret.styleName = "rg-center editable-text-column";
      } else {
        ret.editable = false;
        ret.styleName = "rg-center text-column";
      }
      return ret;
    },
    validRules: [{ criteria: "required" }],
  },
  { name: "ACCOUNT_NM", dataType: "text", headerText: "ACCOUNT_NM", visible: true, editable: true, width: 100, autoFilter: true, textAlignment: "center" },
  { name: "PARENT_SALES_LV_ID", dataType: "text", headerText: "PARENT_SALES_LV", visible: true, editable: true, width: 110, textAlignment: "center", useDropdown: true, lookupDisplay: true, validRules: [{ criteria: "required" }] },
  { name: "PARENT_SALES_LV_ID_AD1", dataType: "text", headerText: "PARENT_SALES_LV_ID_AD1", visible: false, editable: true, width: 110, textAlignment: "center", useDropdown: true, lookupDisplay: true },
  { name: "PARENT_SALES_LV_ID_AD2", dataType: "text", headerText: "PARENT_SALES_LV_ID_AD2", visible: false, editable: true, width: 110, textAlignment: "center", useDropdown: true, lookupDisplay: true },
  { name: "PARENT_SALES_LV_ID_AD3", dataType: "text", headerText: "PARENT_SALES_LV_ID_AD3", visible: false, editable: true, width: 110, textAlignment: "center", useDropdown: true, lookupDisplay: true },
  { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: 80, textAlignment: "center" },
  { name: "DEL_YN", dataType: "boolean", headerText: "DEL_YN", visible: true, editable: true, width: 80, textAlignment: "center" },
  // { name: "PARENT_SALES_LV_NM", dataType: "dropdown", headerText: "PARENT_SALES_LV", visible: false, editable: true, width: 110, textAlignment: "center"},
  // { name: "PARENT_SALES_LV_CD", dataType: "text", headerText: "PARENT_SALES_LV_CD", visible: false, editable: true, width: 110, textAlignment: "center" },
  // { name: "CURCY_CD", dataType: "text", headerText: "CURCY_CD", visible: false, editable: true, width: 80, textAlignment: "center" },
  // { name: "CURCY_NM", dataType: "dropdown", headerText: "CURCY_NM", visible: false, editable: true, width: 110, textAlignment: "center"},
  // { name: "COUNTRY_CD", dataType: "dropdown", headerText: "COUNTRY_CD", visible: false, editable: true, width: 110, textAlignment: "center" },
  // { name: "COUNTRY_NM", dataType: "dropdown", headerText: "COUNTRY_NM", visible: false, editable: true, width: 110, textAlignment: "center" },
  // { name: "CHANNEL_CD", dataType: "text", headerText: "CHANNEL_CD", visible: false, editable: true, width: 80, textAlignment: "center" },
  // { name: "CHANNEL_NM", dataType: "text", headerText: "CHANNEL_NM", visible: true, editable: true, width: 80, textAlignment: "center" },
  { name: "CURCY_CD_ID", dataType: "dropdown", headerText: "CURCY_CD_ID", visible: true, editable: true, width: 110, textAlignment: "center", useDropdown: true, lookupDisplay: true, validRules: [{ criteria: "required" }] },
  { name: "COUNTRY_ID", dataType: "dropdown", headerText: "COUNTRY_NM", visible: true, editable: true, width: 110, textAlignment: "center", useDropdown: true, lookupDisplay: true },
  { name: "CHANNEL_ID", dataType: "dropdown", headerText: "CHANNEL_NM", visible: true, editable: true, width: 110, textAlignment: "center", useDropdown: true, lookupDisplay: true },
  //    { name: "INCOTERMS_CD", dataType: "dropdown", headerText: "INCOTERMS_CD", visible: false, editable: true, width: 110, textAlignment: "center" },
  { name: "INCOTERMS_ID", dataType: "dropdown", headerText: "INCOTERMS", visible: true, editable: true, width: 110, textAlignment: "center", useDropdown: true, lookupDisplay: true },
  { name: "DIRECT_SHPP_YN", dataType: "boolean", headerText: "DIRECT_SHIPPING_YN", visible: true, editable: true, width: 80, textAlignment: "center" },
  { name: "VMI_YN", dataType: "boolean", headerText: "VMI YN", visible: true, editable: true, width: 80, textAlignment: "center" },
  { name: "SRP_YN", dataType: "boolean", headerText: "SRP_YN", visible: false, editable: true, width: 80, textAlignment: "center" },
  { name: "ATTR_01", dataType: "text", headerText: "ACCOUNT_ATTR_01", visible: true, editable: true, width: 80, textAlignment: "center" },
  { name: "ATTR_02", dataType: "text", headerText: "ACCOUNT_ATTR_02", visible: true, editable: true, width: 80, textAlignment: "center" },
  { name: "ATTR_03", dataType: "text", headerText: "ACCOUNT_ATTR_03", visible: true, editable: true, width: 80, textAlignment: "center" },
  { name: "ATTR_04", dataType: "text", headerText: "ACCOUNT_ATTR_04", visible: false, editable: true, width: 80, textAlignment: "center" },
  { name: "ATTR_05", dataType: "text", headerText: "ACCOUNT_ATTR_05", visible: false, editable: true, width: 80, textAlignment: "center" },
  { name: "ATTR_06", dataType: "text", headerText: "ACCOUNT_ATTR_06", visible: false, editable: true, width: 80, textAlignment: "center" },
  { name: "ATTR_07", dataType: "text", headerText: "ACCOUNT_ATTR_07", visible: false, editable: true, width: 80, textAlignment: "center" },
  { name: "ATTR_08", dataType: "text", headerText: "ACCOUNT_ATTR_08", visible: false, editable: true, width: 80, textAlignment: "center" },
  { name: "ATTR_09", dataType: "text", headerText: "ACCOUNT_ATTR_09", visible: false, editable: true, width: 80, textAlignment: "center" },
  { name: "ATTR_10", dataType: "text", headerText: "ACCOUNT_ATTR_10", visible: false, editable: true, width: 80, textAlignment: "center" },
  { name: "ATTR_11", dataType: "text", headerText: "ACCOUNT_ATTR_11", visible: false, editable: true, width: 80, textAlignment: "center" },
  { name: "ATTR_12", dataType: "text", headerText: "ACCOUNT_ATTR_12", visible: false, editable: true, width: 80, textAlignment: "center" },
  { name: "ATTR_13", dataType: "text", headerText: "ACCOUNT_ATTR_13", visible: false, editable: true, width: 80, textAlignment: "center" },
  { name: "ATTR_14", dataType: "text", headerText: "ACCOUNT_ATTR_14", visible: false, editable: true, width: 80, textAlignment: "center" },
  { name: "ATTR_15", dataType: "text", headerText: "ACCOUNT_ATTR_15", visible: false, editable: true, width: 80, textAlignment: "center" },
  { name: "ATTR_16", dataType: "text", headerText: "ACCOUNT_ATTR_16", visible: false, editable: true, width: 80, textAlignment: "center" },
  { name: "ATTR_17", dataType: "text", headerText: "ACCOUNT_ATTR_17", visible: false, editable: true, width: 80, textAlignment: "center" },
  { name: "ATTR_18", dataType: "text", headerText: "ACCOUNT_ATTR_18", visible: false, editable: true, width: 80, textAlignment: "center" },
  { name: "ATTR_19", dataType: "text", headerText: "ACCOUNT_ATTR_19", visible: false, editable: true, width: 80, textAlignment: "center" },
  { name: "ATTR_20", dataType: "text", headerText: "ACCOUNT_ATTR_20", visible: false, editable: true, width: 80, textAlignment: "center" },
  // { name: "BILL_TO_CD", dataType: "text", headerText: "BILL_TO_CD", visible: false, editable: true, width: 80, textAlignment: "center" },
  // { name: "BILL_TO_ID", dataType: "text", headerText: "BILL_TO_ID", visible: false, editable: true, width: 80, textAlignment: "center" },
  // { name: "BILL_TO_NM", dataType: "text", headerText: "BILL_TO_NM", visible: false, editable: true, width: 80, textAlignment: "center" },
  // { name: "SHIP_TO_CD", dataType: "text", headerText: "SHIP_TO_CD", visible: false, editable: true, width: 80, textAlignment: "center" },
  // { name: "SHIP_TO_ID", dataType: "text", headerText: "SHIP_TO_ID", visible: false, editable: true, width: 80, textAlignment: "center" },
  // { name: "SHIP_TO_NM", dataType: "text", headerText: "SHIP_TO_NM", visible: false, editable: true, width: 80, textAlignment: "center" },
  // { name: "SOLD_TO_CD", dataType: "text", headerText: "SOLD_TO_CD", visible: false, editable: true, width: 80, textAlignment: "center" },
  // { name: "SOLD_TO_ID", dataType: "text", headerText: "SOLD_TO_ID", visible: false, editable: true, width: 80, textAlignment: "center" },
  // { name: "SOLD_TO_NM", dataType: "text", headerText: "SOLD_TO_NM", visible: false, editable: true, width: 80, textAlignment: "center" },
  { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: 80, textAlignment: "center" },
  { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: 80, textAlignment: "center" },
  { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 80, textAlignment: "center" },
  { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 80, textAlignment: "center" },
];
function Account() {
  const iconClasses = useIconStyles();
  const [message, setMessage] = useState();

  const [username] = useUserStore((state) => [state.username]);
  const [personalizeOpen, setPersonalizeOpen] = useState(false);
  const [setViewInfo] = useViewStore((state) => [state.setViewInfo]);

  const [grid1, setGrid1] = useState(null);
  const [salesLevelOption, setSalesLevelOption] = useState([]);
  const [showAdditionSearchCondition, setShowAdditionSearchConditionAttr01] = useState(false);

  const { reset, control, getValues } = useForm({
    defaultValues: {
      salesTree: "ALL",
      delete: "N",
      accountCd: "",
      accountNm: "",
      attr01: "",
      attr02: "",
      attr03: "",
    },
  });

  const globalButtons = [
    {
      name: "search",
      action: () => {
        onSubmit(grid1);
      },
      visible: true,
      disable: false,
    },
    {
      name: "save",
      action: () => {
        saveData(grid1);
      },
      visible: false,
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
      action: (e) => {
        setPersonalizeOpen(true);
      },
      visible: true,
      disable: false,
    },
  ];

  function refresh() {
    reset();
    grid1.dataProvider.clearRows();
  }

  const loadSalesLevel = async () => {
    const salesLevels = await loadOption(true, "SRV_GET_SP_UI_DP_00_SALES_LV_DATA_Q1", { LEAF_TP: "LEAF", TYPE: "", LV_CD: "", SALES_LV_CD: "", SALES_LV_NM: "", PARENT_SALES_LV_CD: "" }, "ID", "SALES_LV_NM", true, true);
    if (!isEmptyArray(salesLevels)) {
      setSalesLevelOption(salesLevels);
    }
  };

  useEffect(() => {
    loadSalesLevel();
  }, []);

  const loadIncoterms = () => {
    let param = new URLSearchParams();
    param.append("SP_UI_DP_00_CONF_Q1_01", "INCOTERMS");
    param.append("SP_UI_DP_00_CONF_Q1_02", "");
    param.append("SP_UI_DP_00_CONF_Q1_03", "");
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_00_CONF_Q1",
      data: param,
    })
      .then(function (res) {
        let dataArr = [];
        if (res.status === gHttpStatus.SUCCESS) {
          dataArr = res.data.RESULT_DATA;
          grid1.gridView.setColumnProperty("INCOTERMS_ID", "lookupData", { value: "ID", label: "CD_NM", list: dataArr });
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  useEffect(() => {
    if (grid1) {
      setViewInfo(vom.active, "globalButtons", globalButtons);
      loadGrid1Data();
    }
  }, [grid1]);

  const afterGridCreate1 = (gridObj, gridView, dataProvider) => {
    setGrid1(gridObj);
    setGridOption(gridObj);
    // 조회조건 세팅
    gridComboLoad(gridObj, {
      URL: "engine/dp/SRV_GET_SP_UI_DP_00_CONF_Q1",
      CODE_VALUE: "ID",
      CODE_LABEL: "CD_NM",
      COLUMN: "INCOTERMS_ID",
      PROP: "lookupData",
      PARAM_KEY: ["SP_UI_DP_00_CONF_Q1_01", "SP_UI_DP_00_CONF_Q1_02", "SP_UI_DP_00_CONF_Q1_03"],
      PARAM_VALUE: ["INCOTERMS", "", ""],
      TRANSLANG_LABEL: true,
    });

    gridComboLoad(gridObj, {
      URL: "engine/dp/SRV_GET_SP_UI_DP_00_CONF_Q1",
      CODE_VALUE: "ID",
      CODE_LABEL: "CD_NM",
      COLUMN: "CHANNEL_ID",
      PROP: "lookupData",
      PARAM_KEY: ["SP_UI_DP_00_CONF_Q1_01", "SP_UI_DP_00_CONF_Q1_02", "SP_UI_DP_00_CONF_Q1_03"],
      PARAM_VALUE: ["DP_CHANNEL_TP", "", ""],
      TRANSLANG_LABEL: true,
    });
    gridComboLoad(gridObj, {
      URL: "engine/dp/SRV_GET_SP_UI_DP_00_CONF_Q1",
      CODE_VALUE: "ID",
      CODE_LABEL: "CD_NM",
      COLUMN: "COUNTRY_ID",
      PROP: "lookupData",
      PARAM_KEY: ["SP_UI_DP_00_CONF_Q1_01", "SP_UI_DP_00_CONF_Q1_02", "SP_UI_DP_00_CONF_Q1_03"],
      PARAM_VALUE: ["CM_COUNTRY", "", ""],
      TRANSLANG_LABEL: true,
    });
    gridComboLoad(gridObj, {
      URL: "engine/dp/SRV_GET_SP_UI_DP_00_CM_CD_Q1",
      CODE_VALUE: "ID",
      CODE_LABEL: "CD_NM",
      COLUMN: "CURCY_CD_ID",
      PROP: "lookupData",
      PARAM_KEY: ["SP_UI_DP_00_CM_CD_Q1_01", "SP_UI_DP_00_CM_CD_Q1_02"],
      PARAM_VALUE: ["CURRENCY", ""],
      TRANSLANG_LABEL: true,
    });
    gridComboLoad(gridObj, {
      URL: "engine/dp/SRV_GET_SP_UI_DP_00_SALES_LV_DATA_Q1",
      CODE_VALUE: "ID",
      CODE_LABEL: "SALES_LV_NM",
      COLUMN: "PARENT_SALES_LV_ID",
      PROP: "lookupData",
      PARAM_KEY: ["LEAF_TP", "TYPE", "LV_CD", "SALES_LV_CD", "SALES_LV_NM"],
      PARAM_VALUE: ["LEAF", "", "", "", ""],
      TRANSLANG_LABEL: true,
    });

    loadOtherLevelDropDown(gridObj);
  };

  const loadOtherLevelDropDown = (gridObj) => {
    const filterResult = gridObj.gridView.prefInfo.filter((row) => row.fldCd.startsWith("PARENT_SALES_LV_ID_AD") && row.fldActiveYn).map((row) => row.fldCd);
    //    console.log("filterResult =>", filterResult)
    for (let i = 0, n = filterResult.length; i < n; i++) {
      let colName = filterResult[i];
      gridComboLoad(gridObj, {
        URL: "engine/dp/SRV_GET_SP_UI_DP_00_SALES_LV_DATA_Q1",
        CODE_VALUE: "ID",
        CODE_LABEL: "SALES_LV_NM",
        COLUMN: colName,
        PROP: "lookupData",
        PARAM_KEY: ["LEAF_TP", "TYPE", "LV_CD", "SALES_LV_CD", "SALES_LV_NM"],
        PARAM_VALUE: ["LEAF", colName.slice(-3), "", "", ""],
        TRANSLANG_LABEL: true,
      });
    }
  };
  const onSubmit = () => {
    loadGrid1Data();
  };

  const setGridOption = (grid) => {
    grid.gridView.setEditOptions({
      insertable: true,
      appendable: true,
    });
    grid.gridView.displayOptions.fitStyle = "fill";
    setVisibleProps(grid, true, true, true);
  };

  function loadGrid1Data() {
    let param = new URLSearchParams();
    param.append("SP_UI_DP_11_Q1_01", getValues("salesTree") === "ALL" ? "" : getValues("salesTree"));
    param.append("SP_UI_DP_11_Q1_02", getValues("accountCd"));
    param.append("SP_UI_DP_11_Q1_03", getValues("accountNm"));
    param.append("SP_UI_DP_11_Q1_04", "");
    param.append("SP_UI_DP_11_Q1_05", "");
    param.append("SP_UI_DP_11_Q1_06", "");
    param.append("SP_UI_DP_11_Q1_07", "");
    param.append("SP_UI_DP_11_Q1_08", "");
    param.append("SP_UI_DP_11_Q1_09", "");
    param.append("SP_UI_DP_11_Q1_10", getValues("delete") === "ALL" ? "" : getValues("delete"));
    param.append("SP_UI_DP_11_Q1_11", getValues("attr01"));
    param.append("SP_UI_DP_11_Q1_12", getValues("attr02"));
    param.append("SP_UI_DP_11_Q1_13", getValues("attr03"));
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_11_Q1",
      data: param,
    })
      .then(function (res) {
        let dataArr = [];
        if (res.status === gHttpStatus.SUCCESS) {
          dataArr = res.data.RESULT_DATA;
          grid1.setData(dataArr);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  //Promise를 리턴해야 한다.
  const onDelete = (targetGrid, deleteRows) => {
    let formData = new FormData();
    formData.append("changes", JSON.stringify(deleteRows));
    formData.append("USER_ID", username);
    if (deleteRows.length > 0) {
      return zAxios({
        method: "post",
        url: baseURI() + "engine/dp/SRV_SET_SP_UI_DP_11_D1",
        headers: { "content-type": "application/json" },
        data: formData,
      })
        .then((response) => {
          if (response.status === gHttpStatus.SUCCESS) {
            const rsData = response.data;
            if (rsData.RESULT_SUCCESS) {
              const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_11_D1_P_RT_MSG"];
              resultMSG === "MSG_0002" ? loadGrid1Data() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
            } else {
              showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
            }
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .then(() => {
          targetGrid.gridView.hideToast();
        });
    }
  };

  const getGridNewRow = () => {
    return { ACTV_YN: true, ID: generateId() };
  };

  const saveData = (targetGrid) => {
    targetGrid.gridView.commit(true);

    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), function (answer) {
      if (answer) {
        let changes = [];
        changes = changes.concat(targetGrid.dataProvider.getAllStateRows().created, targetGrid.dataProvider.getAllStateRows().updated, targetGrid.dataProvider.getAllStateRows().deleted, targetGrid.dataProvider.getAllStateRows().createAndDeleted);

        let changeRowData = [];
        changes.forEach(function (row) {
          let data = targetGrid.dataProvider.getJsonRow(row);
          changeRowData.push(data);
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"));
        } else {
          targetGrid.gridView.showToast(progressSpinner + "Saving data...", true);

          let formData = new FormData();
          formData.append("changes", JSON.stringify(changeRowData));
          formData.append("USER_ID", username);
          zAxios
            .post(baseURI() + "engine/dp/SRV_SET_SP_UI_DP_11_S1", formData, {
              headers: { "content-type": "application/json" },
            })
            .then((response) => {
              if (response.status === gHttpStatus.SUCCESS) {
                const rsData = response.data;
                if (rsData.RESULT_SUCCESS) {
                  const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_11_S1_P_RT_MSG"];
                  resultMSG === "MSG_0001" ? loadGrid1Data() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
                } else {
                  showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
                }
              }
            })
            .catch((err) => {
              console.log(err);
            })
            .then(() => {
              targetGrid.gridView.hideToast();
            });
        }
      }
    });
  };

  const makeDynamicAccountData = (targetGrid) => {
    targetGrid.gridView.commit(true);
    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("RESULT_MESSAGE_DYNAMIC"), (answer) => {
      if (answer) {
        targetGrid.gridView.showToast(progressSpinner + "Make Dynamic Account Data...", true);

        let formData = new FormData();
        zAxios
          .post(baseURI() + "engine/dp/MakeDynamicAccountData", formData, {
            headers: { "content-type": "application/json" },
          })
          .then(() => {
            //response
          })
          .catch((err) => {
            console.log(err);
          })
          .then(() => {
            targetGrid.gridView.hideToast();
          });
      }
    });
  };

  const reloadPrefInfo = (viewCd, userName, grid, grpCd, gridCd) => {
    if (grid) grid.loadCrossTabInfoAndPrefInfo(viewCd, grpCd, userName);
  };

  function getSearchFiled(toggle) {
    if (toggle) {
      return (
        <SearchRow>
          <InputField
            name="delete"
            label={transLangKey("DELETE")}
            type="select"
            control={control}
            options={[
              { label: "ALL", value: "ALL" },
              { label: "Y", value: "Y" },
              { label: "N", value: "N" },
            ]}
          />
          <InputField name="attr01" label={transLangKey("ACCOUNT_ATTR_01")} readonly={false} disabled={false} control={control} />
          <InputField name="attr02" label={transLangKey("ACCOUNT_ATTR_02")} readonly={false} disabled={false} control={control} />
          <InputField name="attr03" label={transLangKey("ACCOUNT_ATTR_03")} readonly={false} disabled={false} control={control} />
        </SearchRow>
      );
    } else {
      return <SearchRow></SearchRow>;
    }
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <InputField name="salesTree" label={transLangKey("SALES_TREE")} type="select" control={control} options={salesLevelOption} />
            <InputField name="accountCd" label={transLangKey("ACCOUNT_CD")} readonly={false} disabled={false} control={control} />
            <InputField name="accountNm" label={transLangKey("ACCOUNT_NM")} readonly={false} disabled={false} control={control} />
            <CommonButton
              type="icon"
              size="small"
              title={transLangKey("Additional Search condition")}
              onClick={() => {
                setShowAdditionSearchConditionAttr01(!showAdditionSearchCondition);
              }}>
              {showAdditionSearchCondition ? <Icon.Minimize2 /> : <Icon.Maximize2 />}
            </CommonButton>
          </SearchRow>
          {getSearchFiled(showAdditionSearchCondition)}
        </SearchArea>
        <ButtonArea>
          <LeftButtonArea>
            <ButtonGroup>
              <CommonButton title={transLangKey("BUNDLE_CREATE")} onClick={() => makeDynamicAccountData(grid1)}>
                <Icon.Sunrise />
              </CommonButton>
            </ButtonGroup>
          </LeftButtonArea>
          <RightButtonArea>
            <ButtonGroup>
              <GridAddRowButton grid="grid1" type="icon" onGetData={getGridNewRow} />
              <GridDeleteRowButton grid="grid1" type="icon" onDelete={onDelete} />
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
          <BaseGrid id="grid1" items={grid1Items} viewCd={vom.active} userName={username} gridCd={vom.active + "-RST_CPT_01"} afterGridCreate={afterGridCreate1} />
        </ResultArea>
        <StatusArea show={true} message={message}>
          <GridCnt grid="grid1" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")} />
        </StatusArea>
      </ContentInner>
      <PopPersonalize open={personalizeOpen} onClose={() => setPersonalizeOpen(false)} resetCallback={reloadPrefInfo} viewCd={vom.active} grid={[grid1]} username={username}></PopPersonalize>
    </>
  );
}

export default Account;
