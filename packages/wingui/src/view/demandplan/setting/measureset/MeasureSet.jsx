import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ButtonGroup, IconButton, iconClasses } from "@mui/material";
import { ContentInner, ResultArea, SearchArea, StatusArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow, InputField, GridAddRowButton, GridDeleteRowButton, GridSaveButton, CommonButton, BaseGrid, GridCnt, useViewStore, useUserStore, zAxios } from "@zionex/wingui-core/src/common/imports";
import { baseURI, showMessage, loadComboList, transLangKey, vom } from "@wingui";
import { isEmptyArray, loadOption, loadReferDropDown, newRowEditCellStyle } from "@wingui/view/demandplan/DpUtil";

const settingGridItems = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: 100 },
  { name: "UI_ID", dataType: "text", headerText: "UI_ID", visible: false, editable: false, width: 100 },
  { name: "GRID_ID", dataType: "text", headerText: "GRID_ID", visible: false, editable: false, width: 100 },
  { name: "GRP_ID", dataType: "text", headerText: "GRP_ID", visible: false, editable: false, width: 100 },
  { name: "MEASURE_CONF_TP_ID", dataType: "dropdown", headerText: "MEASURE_CONF_TP_ID", visible: true, editable: true, width: 100, textAlignment: "center", useDropdown: true, lookupDisplay: true, validRules: [{ criteria: "required" }] },
  { name: "MEASURE_CD", dataType: "dropdown", headerText: "MEASURE_CD", visible: true, editable: true, width: 100, textAlignment: "center", useDropdown: true, lookupDisplay: true, validRules: [{ criteria: "required" }] },
  { name: "VER_APPY_BASE_ID", dataType: "dropdown", headerText: "VER_APPY_BASE_ID", visible: true, editable: true, width: 100, textAlignment: "center", useDropdown: true, lookupDisplay: true, validRules: [{ criteria: "required" }] },
  { name: "MEASURE_VAL_TP_ID", dataType: "dropdown", headerText: "MEASURE_VAL_TP_ID", visible: true, editable: true, width: 100, textAlignment: "center", useDropdown: true, lookupDisplay: true, validRules: [{ criteria: "required" }] },
  { name: "INPUT_YN", dataType: "boolean", headerText: "INPUT_YN", visible: true, editable: true, width: 100, textAlignment: "center" },
  {
    name: "DISP_NM_GROUP",
    dataType: "group",
    orientation: "horizontal",
    headerText: "DISP_NM",
    headerVisible: true,
    hideChildHeaders: false,
    childs: [
      {
        name: "DISP_NM",
        dataType: "text",
        headerText: "LANG_KEY",
        visible: true,
        editable: false,
        width: 100,
        textAlignment: "center",
        styleCallback: newRowEditCellStyle,
      },
      {
        name: "DISP_NM_VAL",
        dataType: "text",
        headerText: "LANG_VALUE",
        visible: true,
        editable: false,
        width: 100,
        textAlignment: "center",
        styleCallback: newRowEditCellStyle,
      },
    ],
  },
  { name: "SEQ", dataType: "text", headerText: "SEQ", visible: true, editable: true, width: 100, textAlignment: "right", validRules: [{ criteria: "required" }] },
  { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: 100, textAlignment: "center", defaultValue: true },
  { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: 100, textAlignment: "center" },
  { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: 100, textAlignment: "center" },
  { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 100, textAlignment: "center" },
  { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 100, textAlignment: "center" },
];

//default value for refresh
let defaultUserGrp;

function MeasureSet() {
  const [username, displayName, systemAdmin] = useUserStore((state) => [state.username, state.displayName, state.systemAdmin]);
  const [message, setMessage] = useState();
  const [settingGrid, setSettingGrid] = useState(null);
  const [groupList, setGroupList] = useState([]);
  const [viewList, setViewList] = useState([]);
  const [gridList, setGridList] = useState([]);
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const { reset, control, getValues, setValue, watch } = useForm({ defaultValues: { gridId: "RST_CPT_01", uiId: "UI_DP_95" } });

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
        saveData(settingGrid);
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
  ];

  function refresh() {
    reset();
    setValue("userGrp", defaultUserGrp);
    settingGrid.dataProvider.clearRows();
  }

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, "settingGrid");
    if (grdObj1 && grdObj1.dataProvider) {
      if (settingGrid !== grdObj1) setSettingGrid(grdObj1);
    }
  }, [viewData]);

  useEffect(() => {
    if (settingGrid) {
      setViewInfo(vom.active, "globalButtons", globalButtons);
      setGridOptions();
      setSettingGridCombo();
    }
  }, [settingGrid]);

  useEffect(() => {
    if (settingGrid && groupList && viewList && gridList) {
      loadGridData();
    }
  }, [settingGrid, groupList, viewList, gridList]);

  const loadUserGroupList = async () => {
    const userGrp = await loadComboList({
      URL: "engine/dp/SRV_GET_SP_UI_DP_00_USER_GRP_Q1",
      CODE_KEY: "ID",
      CODE_VALUE: "GRP_NM",
      PARAM: {},
      ALLFLAG: false,
    });
    setGroupList(userGrp);

    defaultUserGrp = userGrp[0].value;
  };

  const loadConfigList = async () => {
    const configList = await loadComboList({
      URL: "engine/dp/SRV_GET_SP_UI_DP_00_CONF_Q1",
      CODE_KEY: "CD",
      CODE_VALUE: "CD_NM",
      PARAM: {
        SP_UI_DP_00_CONF_Q1_01: "UI_ID_MES_SET",
        SP_UI_DP_00_CONF_Q1_02: "DP",
        SP_UI_DP_00_CONF_Q1_03: "",
      },
      TRANSLANG_LABEL: true,
      ALLFLAG: false,
    });
    setViewList(configList);
  };

  useEffect(() => {
    loadUserGroupList();
    loadConfigList();
  }, []);

  useEffect(() => {
    groupList.length > 0 && setValue("userGrp", groupList[0].value);
  }, [groupList]);

  useEffect(() => {
    loadGrid();
  }, [watch("uiId")]);

  const loadGrid = async () => {
    const grids = await loadOption(true, "SRV_GET_SP_UI_DP_00_CONF_Q1", { SP_UI_DP_00_CONF_Q1_01: "GRID", SP_UI_DP_00_CONF_Q1_02: getValues("uiId"), SP_UI_DP_00_CONF_Q1_03: "" }, "CD", "CD_NM", false, true);
    if (!isEmptyArray(grids)) {
      setGridList(grids);
      setValue("gridId", grids[0].value);
    }
  };

  const setSettingGridCombo = () => {
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_19_MEASURE_TP_COMBO",
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          loadReferDropDown(settingGrid, res.data.RESULT_DATA, [
            { cd: "MEASURE_CONF_TP_ID", nm: "MEASURE_TP_NM" },
            { cd: "MEASURE_CD", nm: "MEASURE_CD_CD" },
            { cd: "VER_APPY_BASE_ID", nm: "MEASURE_VER_TP_NM" },
            { cd: "MEASURE_VAL_TP_ID", nm: "MEASURE_VAL_TP_NM" },
          ]);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  function setGridOptions() {
    settingGrid.gridView.displayOptions.fitStyle = "fill";
    settingGrid.gridView.setFooters({ visible: false });
    settingGrid.dataProvider.setOptions({ restoreMode: "auto" });
    settingGrid.gridView.displayOptions.showChangeMarker = false;
    setVisibleProps(settingGrid, true, true, true);

    settingGrid.gridView.setEditOptions({
      insertable: true,
      appendable: true,
    });
  }

  function loadGridData() {
    let param = new URLSearchParams();
    param.append("SP_UI_DP_19_Q1_01", getValues("userGrp"));
    param.append("SP_UI_DP_19_Q1_02", getValues("uiId"));
    param.append("SP_UI_DP_19_Q1_03", getValues("gridId"));

    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_19_Q1",
      data: param,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          settingGrid.dataProvider.fillJsonData(res.data.RESULT_DATA);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  const onDelete = (targetGrid, deleteRows) => {
    let formData = new FormData();
    formData.append("USER_ID", username);
    formData.append("changes", JSON.stringify(deleteRows));

    if (deleteRows.length > 0) {
      return zAxios({
        method: "post",
        url: baseURI() + "engine/dp/SRV_SET_SP_UI_DP_19_D1",
        headers: { "content-type": "application/json" },
        data: formData,
      }).then(function (response) {
        if (response.status === gHttpStatus.SUCCESS) {
          const rsData = response.data;
          if (rsData.RESULT_SUCCESS) {
            const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_19_D1_P_RT_MSG"];
            resultMSG === "MSG_0002" ? loadGridData() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
          } else {
            showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
          }
        }
      });
    }
  };

  const createMeasure = (targetGrid) => {
    targetGrid.gridView.commit(true);

    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5048"), function (answer) {
      if (!answer) return;

      let formData = new FormData();
      formData.append("GRP_ID", getValues("userGrp"));
      formData.append("UI_ID", getValues("uiId"));
      formData.append("GRID_ID", getValues("gridId"));
      formData.append("USER_ID", username);

      zAxios({
        method: "post",
        url: baseURI() + "engine/dp/SRV_MAKE_DP_MEASURE_AUTO",
        data: formData,
      })
        .then(function (res) {
          res.status === gHttpStatus.SUCCESS &&
            zAxios({
              method: "post",
              url: baseURI() + "engine/dp/SRV_MAKE_PERSON_AUTO_DP_MEASURE",
              data: formData,
            })
              .then(function () {
                settingGrid.gridView.hideToast();
                loadGridData();
              })
              .catch(function (e) {
                console.error(e);
              });
        })
        .catch(function (e) {
          console.error(e);
        });
    });
  };

  function saveData(targetGrid) {
    targetGrid.gridView.commit(true);

    //일괄 유효성 확인
    let log = targetGrid.gridView.validateCells();

    if (log !== null && log.length > 0) {
      showMessage(transLangKey("WARNING"), log[0].message);
    }
    let changes = [];
    changes = changes.concat(targetGrid.dataProvider.getAllStateRows().created, targetGrid.dataProvider.getAllStateRows().updated, targetGrid.dataProvider.getAllStateRows().deleted, targetGrid.dataProvider.getAllStateRows().createAndDeleted);

    let changeRowData = [];
    changes.forEach(function (row) {
      targetGrid.dataProvider.setValue(row, "UI_ID", getValues("uiId"));
      targetGrid.dataProvider.setValue(row, "GRID_ID", getValues("gridId"));
      targetGrid.dataProvider.setValue(row, "GRP_ID", getValues("userGrp"));
      changeRowData.push(targetGrid.dataProvider.getJsonRow(row));
    });

    if (changeRowData.length === 0) {
      showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"));
    } else {
      showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), function (answer) {
        if (answer) {
          targetGrid.gridView.showToast(progressSpinner + "Saving data...", true);

          let formData = new FormData();
          formData.append("USER_ID", username);
          formData.append("CHANGES", JSON.stringify(changeRowData));

          zAxios
            .post(baseURI() + "engine/dp/SRV_SET_SP_UI_DP_19_S1", formData, {
              headers: {
                "content-type": "application/json",
              },
            })
            .then(function (response) {
              if (response.status === gHttpStatus.SUCCESS) {
                const rsData = response.data;
                if (rsData.RESULT_SUCCESS) {
                  const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_19_S1_P_RT_MSG"];
                  resultMSG === "MSG_0001" ? loadGridData() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
                } else {
                  showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
                }
              }
            })
            .then(function () {
              settingGrid.gridView.hideToast();
            })
            .catch(function (e) {
              console.error(e);
            });
        }
      });
    }
  }

  return (
    <ContentInner>
      <SearchArea>
        <SearchRow>
          <InputField type="select" name="userGrp" label={transLangKey("USER_GRP")} control={control} options={groupList} />
          <InputField type="select" name="uiId" label={transLangKey("UI")} control={control} options={viewList} />
          <InputField type="select" name="gridId" label={transLangKey("GRID")} control={control} options={gridList} />
        </SearchRow>
      </SearchArea>
      <ButtonArea>
        <LeftButtonArea>
          <CommonButton
            type="icon"
            title={transLangKey("create measure automatically")}
            onClick={() => {
              createMeasure(settingGrid);
            }}>
            <Icon.Sunset />
          </CommonButton>
        </LeftButtonArea>
        <RightButtonArea>
          <ButtonGroup variant="outlined">
            <GridAddRowButton grid="settingGrid" type="icon" />
            <GridDeleteRowButton grid="settingGrid" type="icon" onDelete={onDelete} />
            <GridSaveButton
              grid="settingGrid"
              type="icon"
              onClick={() => {
                saveData(settingGrid);
              }}
            />
          </ButtonGroup>
        </RightButtonArea>
      </ButtonArea>
      <ResultArea>
        <BaseGrid id="settingGrid" items={settingGridItems} />
      </ResultArea>
      <StatusArea show={false} message={message}>
        <GridCnt grid="settingGrid" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")} />
      </StatusArea>
    </ContentInner>
  );
}

export default MeasureSet;
