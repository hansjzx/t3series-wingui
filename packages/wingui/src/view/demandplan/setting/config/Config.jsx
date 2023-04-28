import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box, ButtonGroup } from "@mui/material";
import { baseURI, loadComboList, showMessage, transLangKey } from "@wingui";
import { ContentInner, ResultArea, SearchArea, StatusArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow, InputField, GridAddRowButton, GridDeleteRowButton, BaseGrid, GridCnt, useViewStore, GridSaveButton, zAxios, useUserStore } from "@zionex/wingui-core/src/common/imports";
import { newRowEditCellStyle } from "@wingui/view/demandplan/DpUtil";

const grid1Items = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: 100, textAlignment: "center" },
  { name: "MODULE_CD", dataType: "text", headerText: "MODULE_CD", visible: false, editable: false, width: 100, textAlignment: "center" },
  { name: "MODULE_NM", dataType: "text", headerText: "MODULE_NM", visible: true, editable: false, width: 100, textAlignment: "center" },
  { name: "GRP_CONF_NM", dataType: "text", headerText: "GRP_CONF", visible: true, editable: false, width: 100, textAlignment: "center", button: "action", styleCallback: newRowEditCellStyle },
  { name: "CONFIG_KEY", dataType: "text", headerText: "CONFIG_KEY", visible: false, editable: false, width: 100, textAlignment: "center" },
  { name: "DESCRIP", dataType: "text", headerText: "DESCRIP", visible: true, editable: false, width: 200, textAlignment: "center", lang: true, styleCallback: newRowEditCellStyle },
  { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: 80, textAlignment: "center" },
  { name: "CREATE_DTTM", dataType: "datetime", format: "yyyy-MM-dd", headerText: "CREATE_DTTM", visible: true, editable: false, width: 80, textAlignment: "center" },
  { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 80, textAlignment: "center" },
  { name: "MODIFY_DTTM", dataType: "datetime", format: "yyyy-MM-dd", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 80, textAlignment: "center" },
];
let grid2Items = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: 100, textAlignment: "center" },
  { name: "CONF_ID", dataType: "text", headerText: "CONFIG_ID", visible: false, editable: false, width: 100, textAlignment: "center" },
  { name: "CONF_GRP_CD", dataType: "text", headerText: "GRP_CONF", visible: true, editable: false, width: 150, textAlignment: "center" },
  {
    name: "CONF_CD",
    dataType: "text",
    headerText: "CONF_CD",
    visible: true,
    editable: true,
    width: 150,
    textAlignment: "center",
    styleCallback: function (grid, dataCell) {
      let ret = { editor: { type: "text" } };
      if (grid.getValue(dataCell.index.itemIndex, "CONF_GRP_CD") === "DP_STD_WEEK") {
        ret.editor = {
          type: "dropdown",
          values: ["SUN", "MON"],
          labels: ["Sun", "Mon"],
        };
      }
      return ret;
    },
    displayCallback: function (grid, index, value) {
      let retVal = value;
      if (grid.getValue(index.itemIndex, "CONF_GRP_CD") === "DP_STD_WEEK") {
        const idx = ["SUN", "MON"].indexOf(value);
        retVal = ["Sun", "Mon"][idx];
      }
      return retVal;
    },
  },
  { name: "CONF_NM", dataType: "text", headerText: "CONF_NM", visible: true, editable: false, width: 150, textAlignment: "center", styleCallback: newRowEditCellStyle },
  { name: "LANG_CONFIG_NM", dataType: "text", headerText: "LANG", visible: false, editable: false, width: 100, textAlignment: "center" },
  { name: "DESCRIP", dataType: "text", headerText: "DESCRIP", visible: true, editable: true, width: 300, textAlignment: "center", styleCallback: newRowEditCellStyle },
  { name: "LANG_DESCRIP", dataType: "text", headerText: "LANG", visible: false, editable: false, width: 100, textAlignment: "center" },
  { name: "PRIORT", dataType: "text", headerText: "PRIOR", visible: true, editable: true, width: 100, textAlignment: "center" },
  { name: "DEFAT_VAL", dataType: "boolean", headerText: "DEFAT_VAL", visible: true, editable: true, width: 100, textAlignment: "center" },
  { name: "USE_YN", dataType: "boolean", headerText: "USE_YN", visible: false, editable: true, width: 80, textAlignment: "center" },
  { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: 80, textAlignment: "center" },
  {
    name: "ATTR_01",
    dataType: "text",
    headerText: "DPC_ATTR_01",
    visible: true,
    editable: true,
    width: 100,
    textAlignment: "center",
    styleCallback: function (grid, dataCell) {
      let ret = { editor: { type: "text" } };
      if (grid.getValue(dataCell.index.itemIndex, "CONF_GRP_CD") === "DP_DMND_CUSTOM") {
        ret.editor = {
          type: "dropdown",
          values: ["double", "integer", "string", "boolean", "date"],
          labels: ["double", "integer", "string", "boolean", "date"],
        };
      }
      return ret;
    },
  },
  { name: "ATTR_02", dataType: "text", headerText: "DPC_ATTR_02", visible: true, editable: true, width: 100, textAlignment: "center" },
  { name: "ATTR_03", dataType: "text", headerText: "DPC_ATTR_03", visible: true, editable: true, width: 100, textAlignment: "center" },
  { name: "ATTR_04", dataType: "text", headerText: "DPC_ATTR_04", visible: false, editable: true, width: 100, textAlignment: "center" },
  { name: "ATTR_05", dataType: "text", headerText: "DPC_ATTR_05", visible: false, editable: true, width: 100, textAlignment: "center" },
  { name: "ATTR_06", dataType: "text", headerText: "DPC_ATTR_06", visible: false, editable: true, width: 100, textAlignment: "center" },
  { name: "ATTR_07", dataType: "text", headerText: "DPC_ATTR_07", visible: false, editable: true, width: 100, textAlignment: "center" },
  { name: "ATTR_08", dataType: "text", headerText: "DPC_ATTR_08", visible: false, editable: true, width: 100, textAlignment: "center" },
  { name: "ATTR_09", dataType: "text", headerText: "DPC_ATTR_09", visible: false, editable: true, width: 100, textAlignment: "center" },
  { name: "ATTR_10", dataType: "text", headerText: "DPC_ATTR_10", visible: false, editable: true, width: 100, textAlignment: "center" },
  { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: 100, textAlignment: "center" },
  { name: "CREATE_DTTM", dataType: "datetime", format: "yyyy-MM-dd", headerText: "CREATE_DTTM", visible: true, editable: false, width: 120, textAlignment: "center" },
  { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 100, textAlignment: "center" },
  { name: "MODIFY_DTTM", dataType: "datetime", format: "yyyy-MM-dd", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 120, textAlignment: "center" },
];
function Config() {
  const [username] = useUserStore((state) => [state.username]);
  const [message, setMessage] = useState();
  const [grid1, setGrid1] = useState(null);
  const [grid2, setGrid2] = useState(null);

  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [modules, setModuleValue] = useState([]);

  const globalButtons = [
    {
      name: "search",
      action: () => {
        onSubmit();
      },
      visible: true,
      disable: false,
    },
    {
      name: "refresh",
      action: () => {
        reset();
      },
      visible: true,
      disable: false,
    },
  ];

  const { reset, control, getValues, setValue, watch } = useForm({
    defaultValues: {
      confGrpCd: null,
      confGrpId: null,
      moduleValue: "DP",
      allConfig: "N",
    },
  });
  const onSubmit = () => {
    loadGridData("grid1", getValues("moduleValue"));
  };

  const getNewGridData1 = () => {
    const currentModuleValue = getValues("moduleValue");
    return {
      MODULE_CD: currentModuleValue,
      MODULE_NM: modules.filter((row) => row.value === currentModuleValue)[0].label,
    };
  };
  const getNewGridData2 = () => {
    return { CONF_GRP_CD: getValues("confGrpCd"), CONF_ID: getValues("confGrpId"), USE_YN: true, ACTV_YN: true };
  };
  const onBeforeAdd = () => {
    return getValues("confGrpId");
  };

  const onDelete = (targetGrid, deleteRows) => {
    let formData = new FormData();
    formData.append("changes", JSON.stringify(deleteRows));

    // console.log("@@@@@targetGrid.gridView.id", targetGrid.gridView.id); // OK
    // console.log("@@@@@targetGrid.gridId", targetGrid.gridId); // undefine
    if (deleteRows.length > 0) {
      return zAxios({
        method: "post",
        url: baseURI() + "engine/dp/SRV_SET_SP_UI_DP_01_" + (targetGrid.gridView.id === "grid1" ? "D1" : "D2"),
        headers: { "content-type": "application/json" },
        data: formData,
      })
        .then(function (response) {
          if (response.status === gHttpStatus.SUCCESS) {
            const rsData = response.data;
            if (rsData.RESULT_SUCCESS) {
              const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_01_" + (targetGrid.gridView.id === "grid1" ? "D1" : "D2") + "_P_RT_MSG"];
              if (resultMSG === "MSG_0002") {
                loadGridData(targetGrid, targetGrid.gridView.id === "grid1" ? getValues("moduleValue") : getValues("confGrpId"));
              } else {
                showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
              }
            } else {
              showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
            }
          }
        })
        .catch(function (err) {
          console.log(err);
        })
        .then(function () {});
    }
  };

  const saveData = (targetGridId) => {
    const targetGrid = targetGridId === "grid1" ? grid1 : grid2;
    targetGrid.gridView.commit(true);
    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), function (answer) {
      if (answer) {
        let changes = [];
        changes = changes.concat(targetGrid.dataProvider.getAllStateRows().created, targetGrid.dataProvider.getAllStateRows().updated, targetGrid.dataProvider.getAllStateRows().deleted, targetGrid.dataProvider.getAllStateRows().createAndDeleted);

        let changeRowData = [];
        changes.forEach((row) => changeRowData.push(targetGrid.dataProvider.getJsonRow(row)));

        if (changeRowData.length === 0) {
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"));
        } else {
          targetGrid.gridView.showToast(progressSpinner + "Saving data...", true);
          let formData = new FormData();
          formData.append("changes", JSON.stringify(changeRowData));
          formData.append("USER_ID", username);
          zAxios
            .post(baseURI() + "engine/dp/SRV_SET_SP_UI_DP_01_" + (targetGridId === "grid1" ? "S1" : "S2"), formData, {
              headers: { "content-type": "application/json" },
            })
            .then(function (response) {
              if (response.status === gHttpStatus.SUCCESS) {
                const rsData = response.data;
                if (rsData.RESULT_SUCCESS) {
                  const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_01_" + (targetGridId === "grid1" ? "S1" : "S2") + "_P_RT_MSG"];
                  if (resultMSG === "MSG_0001") {
                    loadGridData(targetGridId, targetGridId === "grid1" ? getValues("moduleValue") : getValues("confGrpId"));
                  } else {
                    showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
                  }
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

  const loadGridData = (gridId, param1) => {
    const procedureId = "SP_UI_DP_01_" + (gridId === "grid1" ? "Q1" : "Q2");
    let param = new URLSearchParams();
    param.append(procedureId + "_01", param1);
    param.append("timeout", 0);
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_" + procedureId,
      data: param,
    })
      .then((res) => {
        if (res.status === gHttpStatus.SUCCESS) {
          let dataArr = res.data.RESULT_DATA;
          if (gridId === "grid1") {
            if (getValues("confGrpId") === null) {
              const currentRow = dataArr[0];
              setValue("confGrpCd", currentRow["GRP_CONF_NM"]);
              setValue("confGrpId", currentRow["ID"]);
              loadGridData("grid2", currentRow["ID"]);
            }

            if (getValues("allConfig") !== "Y") {
              dataArr = dataArr.filter((row) => row["CONF_KEY"] < 900);
            }

            grid1.dataProvider.fillJsonData(dataArr);
          } else {
            dataArr = dataArr.map((row) => {
              row.DESCRIP = transLangKey(row.DESCRIP);
              row.CONF_NM = transLangKey(row.CONF_NM);
              return row;
            });
            grid2.dataProvider.fillJsonData(dataArr);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadModule = async () => {
    setModuleValue(
      await loadComboList({
        PROCEDURE_NAME: "SP_UI_DP_00_CM_CD_Q1",
        URL: "engine/dp/SRV_GET_SP_UI_DP_00_CM_CD_Q1",
        CODE_KEY: "CD",
        CODE_VALUE: "CD_NM",
        PARAM: { SP_UI_DP_00_CM_CD_Q1_01: "MODULE_TP", SP_UI_DP_00_CM_CD_Q1_02: "ALL" },
        ALLFLAG: false,
        TRANSLANG_LABEL: false,
      })
    );
  };

  useEffect(() => {
    loadModule();
    setValue("moduleValue", "DP");
  }, []);

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, "grid1");
    const grdObj2 = getViewInfo(vom.active, "grid2");
    if (grdObj1 && grdObj1.dataProvider) {
      setGrid1(grdObj1);
    }
    if (grdObj2 && grdObj2.dataProvider) {
      setGrid2(grdObj2);
    }
  }, [viewData]);

  useEffect(() => {
    if (grid1) {
      setViewInfo(vom.active, "globalButtons", globalButtons);
      setVisibleProps(grid1, true, false, true);
      setGridOption(grid1);
      loadGridData("grid1", getValues("moduleValue"));
      grid1.gridView.onCellButtonClicked = function (grid, itemIndex, column) {
        if (column.fieldName === "GRP_CONF_NM") {
          const idx = itemIndex.itemIndex;
          setValue("confGrpCd", grid.getValue(idx, "GRP_CONF_NM"));
          setValue("confGrpId", grid.getValue(idx, "ID"));
          watch();
          loadGridData("grid2", grid.getValue(idx, "ID"));
        }
      };
    }
  }, [grid1]);

  useEffect(() => {
    if (grid2) {
      setVisibleProps(grid2, true, true, true);
      setGridOption(grid2);
    }
  }, [grid2]);

  const setGridOption = (grid) => {
    grid.gridView.setEditOptions({
      insertable: true,
      appendable: true,
    });
    grid.gridView.displayOptions.fitStyle = "fill";
    grid.gridView.setColumnProperty("GRP_CONF_NM", "buttonVisibility", "always");
  };

  return (
    <ContentInner>
      <SearchArea>
        <SearchRow>
          <InputField name="moduleValue" label={transLangKey("MODULE_VAL")} type="select" control={control} options={modules} />
          <InputField
            name="allConfig"
            type="select"
            control={control}
            label={transLangKey("ALL_CONFIG")}
            options={[
              { label: transLangKey("ALL"), value: "Y" },
              { label: transLangKey("PARTIAL"), value: "N" },
            ]}
          />
        </SearchRow>
      </SearchArea>
      <ResultArea>
        <Box>
          <ButtonArea title={transLangKey("GRP_CONF")}>
            <RightButtonArea>
              {watch("allConfig") === "Y" ? <GridAddRowButton grid="grid1" type="icon" onGetData={getNewGridData1} /> : ""}
              <GridDeleteRowButton grid="grid1" type="icon" onDelete={onDelete} />
              <GridSaveButton grid="grid1" type="icon" onClick={() => saveData("grid1")} />
            </RightButtonArea>
          </ButtonArea>
          <Box style={{ height: "calc(100% - 53px)" }}>
            <BaseGrid id="grid1" items={grid1Items} />
          </Box>
        </Box>
        <Box>
          <ButtonArea title={transLangKey("UI_DP_01")}>
            <LeftButtonArea></LeftButtonArea>
            <RightButtonArea>
              <ButtonGroup>
                {watch("confGrpCd") === "DP_STD_WEEK" || watch("confGrpCd") === "DP_USE_COMMENT" ? " " : <GridAddRowButton grid="grid2" type="icon" onBeforeAdd={onBeforeAdd} onGetData={getNewGridData2} />}
                {watch("confGrpCd") === "DP_STD_WEEK" || watch("confGrpCd") === "DP_USE_COMMENT" ? " " : <GridDeleteRowButton grid="grid2" type="icon" onDelete={onDelete} onAfterDelete={(targetGrid) => loadGridData(targetGrid.gridId, getValues("confGrpId"))} />}
                <GridSaveButton grid="grid2" type="icon" onClick={() => saveData("grid2")} />
              </ButtonGroup>
            </RightButtonArea>
          </ButtonArea>
          <Box style={{ height: "calc(100% - 53px)" }}>
            <BaseGrid id="grid2" items={grid2Items} />
          </Box>
        </Box>
      </ResultArea>
      <StatusArea show={false} message={message}>
        <GridCnt grid="grid2" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")} />
      </StatusArea>
    </ContentInner>
  );
}

export default Config;
