import React, { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { ContentInner, ResultArea, SearchArea, StatusArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow, InputField, GridAddRowButton, GridDeleteRowButton, GridSaveButton, CommonButton, BaseGrid, GridCnt, useViewStore, zAxios } from "@zionex/wingui-core/src/common/imports";
import { gridComboLoad, transLangKey } from "@wingui";
import { loadOption, isEmptyArray, newRowEditCellStyle } from "@wingui/view/demandplan/DpUtil";
import PopPersonalize from "@wingui/view/common/PopPersonalize";
import { useUserStore } from "@zionex/wingui-core/src/store/userStore";

const grid1Items = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: 100, textAlignment: "center" },
  { name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: 110, textAlignment: "center", autoFilter: true, styleCallback: newRowEditCellStyle },
  { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: true, width: 110, autoFilter: true, textAlignment: "center" },
  { name: "UOM_ID", dataType: "dropdown", headerText: "UOM", visible: true, editable: true, width: 100, textAlignment: "center", useDropdown: true, lookupDisplay: true },
  { name: "UOM_NM", dataType: "dropdown", headerText: "UOM", visible: false, editable: true, width: 60, textAlignment: "center", useDropdown: true, lookupDisplay: true },
  { name: "ITEM_TP_ID", dataType: "dropdown", headerText: "ITEM_TP", visible: true, editable: true, width: 80, textAlignment: "center", useDropdown: true, lookupDisplay: true },
  { name: "PARENT_ITEM_LV_NM", dataType: "dropdown", headerText: "PARENT_ITEM_LV_NM", visible: false, editable: true, width: 100, textAlignment: "center", useDropdown: true, lookupDisplay: true },
  { name: "PARENT_ITEM_LV_CD", dataType: "text", headerText: "PARENT_SALES_LV_CD", visible: false, editable: true, width: 110, textAlignment: "center" },
  { name: "PARENT_ITEM_LV_ID", dataType: "dropdown", headerText: "PARENT_ITEM_LV_NM", visible: true, editable: true, width: 110, textAlignment: "center", useDropdown: true, lookupDisplay: true },
  { name: "PARENT_ITEM_LV_ID_AD1", dataType: "dropdown", headerText: "PARENT_ITEM_LV_NM_AD1", visible: false, editable: true, width: 110, textAlignment: "center", useDropdown: true, lookupDisplay: true },
  { name: "PARENT_ITEM_LV_ID_AD2", dataType: "dropdown", headerText: "PARENT_ITEM_LV_NM_AD2", visible: false, editable: true, width: 110, textAlignment: "center", useDropdown: true, lookupDisplay: true },
  { name: "PARENT_ITEM_LV_ID_AD3", dataType: "dropdown", headerText: "PARENT_ITEM_LV_NM_AD3", visible: false, editable: true, width: 110, textAlignment: "center", useDropdown: true, lookupDisplay: true },
  { name: "RTS", dataType: "datetime", headerText: "RTS", visible: true, editable: true, width: 100, textAlignment: "center", format: "yyyy-MM-dd" },
  { name: "EOS", dataType: "datetime", headerText: "EOS", visible: true, editable: true, width: 100, textAlignment: "center", format: "yyyy-MM-dd" },
  { name: "DEL_YN", dataType: "boolean", headerText: "DEL_YN", visible: true, editable: true, width: 100, textAlignment: "center" },
  { name: "DP_PLAN_YN", dataType: "boolean", headerText: "DP_PLAN_YN", visible: true, editable: true, width: 100, textAlignment: "center" },
  { name: "ATTR_01", dataType: "text", headerText: "ATTR_01", visible: true, editable: true, width: 80, textAlignment: "center" },
  { name: "ATTR_02", dataType: "text", headerText: "ATTR_02", visible: true, editable: true, width: 80, textAlignment: "center" },
  { name: "ATTR_03", dataType: "text", headerText: "ATTR_03", visible: true, editable: true, width: 80, textAlignment: "center" },
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
  { name: "ATTR_21", dataType: "text", headerText: "ACCOUNT_ATTR_21", visible: false, editable: true, width: 80, textAlignment: "center" },
  { name: "ATTR_22", dataType: "text", headerText: "ACCOUNT_ATTR_22", visible: false, editable: true, width: 80, textAlignment: "center" },
  { name: "ATTR_23", dataType: "text", headerText: "ACCOUNT_ATTR_23", visible: false, editable: true, width: 80, textAlignment: "center" },
  { name: "ATTR_24", dataType: "text", headerText: "ACCOUNT_ATTR_24", visible: false, editable: true, width: 80, textAlignment: "center" },
  { name: "ATTR_25", dataType: "text", headerText: "ACCOUNT_ATTR_25", visible: false, editable: true, width: 80, textAlignment: "center" },
  { name: "DESCRIP", dataType: "text", headerText: "DESCRIP", visible: false, editable: true, width: 80, textAlignment: "center" },
  { name: "DISPLAY_COLOR", dataType: "text", headerText: "DISPLAY_COLOR", visible: false, editable: true, width: 80, textAlignment: "center" },
  { name: "MAX_ORDER_SIZE", dataType: "text", headerText: "MAX_ORDER_SIZE", visible: false, editable: true, width: 80, textAlignment: "center" },
  { name: "MIN_ORDER_SIZE", dataType: "text", headerText: "MIN_ORDER_SIZE", visible: false, editable: true, width: 80, textAlignment: "center" },
  { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: 80, textAlignment: "center" },
  { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: 80, textAlignment: "center" },
  { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: 80, textAlignment: "center" },
  { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: 80, textAlignment: "center" },
];

//for refresh set selected
let defaultItemTypeId;

function Item() {
  const [username, displayName, systemAdmin] = useUserStore((state) => [state.username, state.displayName, state.systemAdmin]);
  const [grid1, setGrid1] = useState(null);
  const [setViewInfo] = useViewStore((state) => [state.setViewInfo]);
  const [message, setMessage] = useState();

  const [itemLevels, setItemLevels] = useState([]);
  const [itemTypes, setItemTypes] = useState([]);
  const [personalizeOpen, setPersonalizeOpen] = useState(false);

  const [showAdditionSearchCondition, setShowAdditionSearchConditionAttr01] = useState(false);

  const { reset, control, getValues, setValue } = useForm({
    defaultValues: {
      itemTree: "ALL",
      delYn: "N",
      dpPlanYn: "Y",
    },
  });
  const globalButtons = [
    {
      name: "search",
      action: () => {
        loadGridData();
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
    setValue("itemTpId", defaultItemTypeId);
    grid1.dataProvider.clearRows();
  }

  const loadItemLevel = async () => {
    //    const options = await loadOption(false, "SP_UI_DP_00_ITEM_LV_DATA_Q1", { P_LEAF_TP: "LEAF", P_TYPE: "ALL", P_LV_TP: "I" }, "ID", "CD_NM", false, true);
    const options = await loadOption(true, "SRV_GET_SP_UI_DP_00_ITEM_LV_DATA_Q1", { SP_UI_DP_00_ITEM_LV_DATA_Q1_01: "LEAF", SP_UI_DP_00_ITEM_LV_DATA_Q1_02: "ALL", SP_UI_DP_00_ITEM_LV_DATA_Q1_03: "I" }, "ID", "CD_NM", false, true);

    if (!isEmptyArray(options)) {
      setItemLevels(options);
      setValue("itemTree", options[0].value);
    }
  };

  const loadItemType = async () => {
    const options = await loadOption(true, "SRV_GET_SP_UI_DP_00_CM_CD_Q1", { SP_UI_DP_00_CM_CD_Q1_01: "ITEM_TYPE", SP_UI_DP_00_CM_CD_Q1_02: "" }, "ID", "CD_NM", true, true);
    if (!isEmptyArray(options)) {
      setItemTypes(options);
      //FG find
      let defaultItemType = options.filter((row) => {
        return "FG" === row.label;
      });
      if (!isEmptyArray(defaultItemType)) {
        defaultItemTypeId = defaultItemType[0].data.ID;
        setValue("itemTpId", defaultItemTypeId);
      }
    }
  };

  useEffect(() => {
    loadItemLevel();
    loadItemType();
  }, []);

  useEffect(() => {
    if (grid1) {
      setViewInfo(vom.active, "globalButtons", globalButtons);
      loadGridData();
    }
  }, [grid1]);

  const afterGridCreate1 = (gridObj, gridView, dataProvider) => {
    setGrid1(gridObj);
    setGridOption(gridObj);
    gridComboLoad(gridObj, {
      URL: "engine/dp/SRV_GET_SP_UI_DP_00_CM_CD_Q1",
      CODE_VALUE: "ID",
      CODE_LABEL: "CD_NM",
      COLUMN: "ITEM_TP_ID",
      PROP: "lookupData",
      PARAM_KEY: ["SP_UI_DP_00_CM_CD_Q1_01", "SP_UI_DP_00_CM_CD_Q1_02"],
      PARAM_VALUE: ["ITEM_TYPE", ""],
      TRANSLANG_LABEL: true,
    });
    gridComboLoad(gridObj, {
      URL: "engine/dp/SRV_GET_SP_UI_DP_00_CM_CD_Q1",
      CODE_VALUE: "ID",
      CODE_LABEL: "CD_NM",
      COLUMN: "UOM_ID",
      PROP: "lookupData",
      PARAM_KEY: ["SP_UI_DP_00_CM_CD_Q1_01", "SP_UI_DP_00_CM_CD_Q1_02"],
      PARAM_VALUE: ["UOM", ""],
      TRANSLANG_LABEL: true,
    });
    gridComboLoad(gridObj, {
      URL: "engine/dp/SRV_GET_SP_UI_DP_00_ITEM_LV_DATA_Q1",
      CODE_VALUE: "ID",
      CODE_LABEL: "CD_NM",
      COLUMN: "PARENT_ITEM_LV_ID",
      PROP: "lookupData",
      PARAM_KEY: ["SP_UI_DP_00_ITEM_LV_DATA_Q1_01", "SP_UI_DP_00_ITEM_LV_DATA_Q1_02", "SP_UI_DP_00_ITEM_LV_DATA_Q1_03"],
      PARAM_VALUE: ["LEAF", "GRID", "I"],
      TRANSLANG_LABEL: true,
    });

    loadOtherLevelDropDown(gridObj);
  };

  const loadOtherLevelDropDown = (gridObj) => {
    const filterResult = gridObj.gridView.prefInfo.filter((row) => row.fldCd.startsWith("PARENT_ITEM_LV_ID_AD") && row.fldActiveYn).map((row) => row.fldCd);
    for (let i = 0, n = filterResult.length; i < n; i++) {
      let colName = filterResult[i];
      gridComboLoad(gridObj, {
        URL: "engine/dp/SRV_GET_SP_UI_DP_00_ITEM_LV_DATA_Q1",
        CODE_VALUE: "ID",
        CODE_LABEL: "CD_NM",
        COLUMN: colName,
        PROP: "lookupData",
        PARAM_KEY: ["SP_UI_DP_00_ITEM_LV_DATA_Q1_01", "SP_UI_DP_00_ITEM_LV_DATA_Q1_02", "SP_UI_DP_00_ITEM_LV_DATA_Q1_03"],
        PARAM_VALUE: ["LEAF", colName.slice(-3), "I"],
        TRANSLANG_LABEL: true,
      });
    }
  };
  const setGridOption = (grid) => {
    grid.gridView.setEditOptions({
      insertable: true,
      appendable: true,
    });
    grid.gridView.displayOptions.fitStyle = "fill";
    setVisibleProps(grid, true, true, true);
  };

  function loadGridData() {
    let param = new URLSearchParams();
    param.append("ITEM_TREE", getValues("itemTree") === undefined || getValues("itemTree") === "ALL" ? "" : getValues("itemTree"));
    param.append("ITEM_TP_ID", getValues("itemTpId") === undefined || getValues("itemTpId") === "ALL" ? "" : getValues("itemTpId"));
    param.append("ITEM_CD", getValues("itemCd") === undefined ? "" : getValues("itemCd"));
    param.append("ITEM_NM", getValues("itemNm") === undefined ? "" : getValues("itemNm"));
    param.append("DEL_YN", getValues("delYn") === undefined ? "" : getValues("delYn"));
    param.append("DP_PLAN_YN", getValues("dpPlanYn") === undefined ? "" : getValues("dpPlanYn"));
    param.append("ATTR_01", getValues("attr01") === undefined ? "" : getValues("attr01"));
    param.append("ATTR_02", getValues("attr02") === undefined ? "" : getValues("attr02"));
    param.append("ATTR_03", getValues("attr03") === undefined ? "" : getValues("attr03"));
    param.append("timeout", 0);
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_09_Q1",
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
    let param = new URLSearchParams();
    param.append("changes", JSON.stringify(deleteRows));
    param.append("USER_ID", username);
    param.append("CHANGE_TYPE", "DELETE");
    param.append("timeout", 0);

    if (deleteRows.length > 0) {
      return zAxios({
        method: "post",
        url: baseURI() + "engine/dp/SRV_SET_SP_UI_DP_09_D1",
        headers: { "content-type": "application/json" },
        data: param,
      })
        .then((response) => {
          if (response.status === gHttpStatus.SUCCESS) {
            const rsData = response.data;
            if (rsData.RESULT_SUCCESS) {
              const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_09_D1_P_RT_MSG"];
              resultMSG === "MSG_0002" ? loadGridData() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
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

  const onAfterDelete = (targetGrid) => {
    if (targetGrid.gridId === "grid1") {
      //loadGridData();
    }
  };

  const saveData = (targetGrid) => {
    targetGrid.gridView.commit(true);

    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), function (answer) {
      if (answer) {
        let changes = [];
        changes = changes.concat(targetGrid.dataProvider.getAllStateRows().created, targetGrid.dataProvider.getAllStateRows().updated, targetGrid.dataProvider.getAllStateRows().deleted, targetGrid.dataProvider.getAllStateRows().createAndDeleted);
        let changeRowData = [];
        changes.forEach(function (row) {
          let rowState = targetGrid.dataProvider.getRowState(row);
          let data = targetGrid.dataProvider.getJsonRow(row);
          data.EOS = new Date(data.EOS).format("yyyy-MM-ddT00:00:00");
          data.RTS = new Date(data.RTS).format("yyyy-MM-ddT00:00:00");
          if (data.EOS === " ") {
            data.EOS = null;
          }
          if (data.RTS === " ") {
            data.RTS = null;
          }
          if (rowState === "created") {
            data.ID = generateId();
          }
          changeRowData.push(data);
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"));
        } else {
          targetGrid.gridView.showToast(progressSpinner + "Saving data...", true);

          let param = new FormData();
          param.append("changes", JSON.stringify(changeRowData));
          param.append("USER_ID", username);
          param.append("CHANGE_TYPE", "CHANGE");

          zAxios
            .post(baseURI() + "engine/dp/SRV_SET_SP_UI_DP_09_S1", param, {
              headers: { "content-type": "application/json" },
            })
            .then(function (response) {
              if (response.status === gHttpStatus.SUCCESS) {
                const rsData = response.data;
                if (rsData.RESULT_SUCCESS) {
                  const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_09_S1_P_RT_MSG"];
                  resultMSG === "MSG_0001" ? loadGridData() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
                } else {
                  showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
                }
              }
            })
            .catch(function (err) {
              console.log(err);
            })
            .then(function () {
              targetGrid.gridView.hideToast();
            });
        }
      }
    });
  };

  const makeDynamicItemData = (targetGrid) => {
    targetGrid.gridView.commit(true);
    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("RESULT_MESSAGE_DYNAMIC"), function (answer) {
      if (answer) {
        //targetGrid.gridView.showToast(progressSpinner + "Make Dynamic Item Data...", true);

        let param = new URLSearchParams();
        param.append("timeout", 0);

        zAxios
          .post(baseURI() + "engine/dp/MakeDynamicItemData", param, {
            headers: { "content-type": "application/json" },
          })
          .then(function (response) {})
          .catch(function (err) {
            console.log(err);
          })
          .then(function () {
            //targetGrid.gridView.hideToast();
          });
      }
    });
  };

  const getNewGridData = () => {
    return { DP_PLAN_YN: true };
  };

  const reloadPrefInfo = (viewCd, userName, grid, grpCd, gridCd) => {
    if (grid) {
      grid.loadCrossTabInfoAndPrefInfo(viewCd, grpCd, userName);
    }
  };

  function getSearchFiled(toggle) {
    if (toggle) {
      return (
        <SearchRow>
          <InputField
            name="delYn"
            label={transLangKey("DEL_YN")}
            type="select"
            control={control}
            options={[
              { label: "ALL", value: "" },
              { label: "Y", value: "Y" },
              { label: "N", value: "N" },
            ]}
          />
          <InputField name="attr01" label={transLangKey("ITEM_ATTR_01")} readonly={false} disabled={false} control={control} />
          <InputField name="attr02" label={transLangKey("ITEM_ATTR_02")} readonly={false} disabled={false} control={control} />
          <InputField name="attr03" label={transLangKey("ITEM_ATTR_03")} readonly={false} disabled={false} control={control} />
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
            <InputField name="itemTree" label={transLangKey("ITEM_TREE")} type="select" control={control} options={itemLevels} />
            <InputField name="itemTpId" label={transLangKey("ITEM_TYPE")} type="select" control={control} options={itemTypes} />
            <InputField name="itemCd" label={transLangKey("ITEM_CD")} readonly={false} disabled={false} control={control} />
            <InputField name="itemNm" label={transLangKey("ITEM_NM")} readonly={false} disabled={false} control={control} />
            <InputField
              name="dpPlanYn"
              label={transLangKey("DP_PLAN_YN")}
              type="select"
              control={control}
              options={[
                { label: "ALL", value: "" },
                { label: "Y", value: "Y" },
                { label: "N", value: "N" },
              ]}
            />
            <CommonButton
              type="icon"
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
            <CommonButton
              type="icon"
              title={transLangKey("Automatic generation of hierarchical data")}
              onClick={() => {
                makeDynamicItemData(grid1);
              }}>
              <Icon.Sunrise />
            </CommonButton>
          </LeftButtonArea>
          <RightButtonArea>
            <GridAddRowButton grid="grid1" type="icon" onGetData={getNewGridData} />
            <GridDeleteRowButton grid="grid1" type="icon" onDelete={onDelete} onAfterDelete={onAfterDelete} />
            <GridSaveButton
              grid="grid1"
              type="icon"
              onClick={() => {
                saveData(grid1);
              }}
            />
          </RightButtonArea>
        </ButtonArea>
        <ResultArea>
          <BaseGrid id="grid1" items={grid1Items} viewCd={vom.active} userName={username} gridCd={vom.active + "-RST_CPT_01"} afterGridCreate={afterGridCreate1} />
        </ResultArea>
        <StatusArea show={false} message={message}>
          <GridCnt grid="grid1" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")} />
        </StatusArea>
      </ContentInner>
      <PopPersonalize open={personalizeOpen} onClose={() => setPersonalizeOpen(false)} resetCallback={reloadPrefInfo} viewCd={vom.active} grid={[grid1]} username={username}></PopPersonalize>
    </>
  );
}

export default Item;
