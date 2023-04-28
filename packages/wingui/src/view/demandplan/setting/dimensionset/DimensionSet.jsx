import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ButtonGroup, iconClasses } from "@mui/material";
import { ContentInner, ResultArea, SearchArea, StatusArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow, InputField, GridAddRowButton, GridDeleteRowButton, GridSaveButton, CommonButton, BaseGrid, GridCnt, useViewStore, useUserStore, zAxios } from "@zionex/wingui-core/src/common/imports";
import { loadReferDropDown, newRowEditCellStyle, isEmptyArray, loadOption } from "@wingui/view/demandplan/DpUtil";
import { transLangKey, vom, loadComboList, baseURI, showMessage } from "@wingui";
import PopPersonalize from "@wingui/view/common/PopPersonalize";

const grid1Items = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: 100 },
  { name: "UI_ID", dataType: "text", headerText: "UI_ID", visible: false, editable: false, width: 100 },
  { name: "GRID_ID", dataType: "text", headerText: "GRID_ID", visible: false, editable: false, width: 100 },
  { name: "GRP_ID", dataType: "text", headerText: "GRP_ID", visible: false, editable: false, width: 100 },
  { name: "LV_TP_CD", dataType: "dropdown", headerText: "LV_TP_CD", visible: true, editable: true, width: 100, textAlignment: "center", useDropdown: true, lookupDisplay: true },
  { name: "LV_MGMT_ID", dataType: "dropdown", headerText: "LV_MGMT_ID", visible: true, editable: true, width: 100, textAlignment: "center", useDropdown: true, lookupDisplay: true },
  { name: "COL_NM", dataType: "dropdown", headerText: "COL_NM", visible: true, editable: true, width: 100, textAlignment: "center", useDropdown: true, lookupDisplay: true },
  {
    name: "DISP_NM_GROUP",
    dataType: "group",
    orientation: "horizontal",
    headerText: "DISP_NM",
    headerVisible: true,
    hideChildHeaders: false,
    childs: [
      { name: "DISP_NM", dataType: "text", headerText: "LANG_KEY", visible: true, editable: false, width: 100, textAlignment: "center", styleCallback: newRowEditCellStyle },
      { name: "DISP_NM_VAL", dataType: "text", headerText: "LANG_VALUE", visible: true, editable: false, width: 100, textAlignment: "center", styleCallback: newRowEditCellStyle },
    ],
  },
  { name: "SEQ", dataType: "text", headerText: "SEQ", visible: true, editable: true, width: 100, textAlignment: "right" },
  { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: 100, textAlignment: "center" },
  { name: "TBL_NM", dataType: "text", headerText: "TBL_NM", visible: false, editable: false, width: 100, textAlignment: "right" },
  { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: 100, textAlignment: "center" },
  { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: 100, textAlignment: "center" },
  { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 100, textAlignment: "center" },
  { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 100, textAlignment: "center" },
];
let defaultGroup = [];
function DimensionSet() {
  const [username, displayName, systemAdmin] = useUserStore((state) => [state.username, state.displayName, state.systemAdmin]);
  const [message, setMessage] = useState();
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [grid1, setGrid1] = useState(null);
  const [groupList, setGroupList] = useState([]);
  const [viewList, setViewList] = useState([]);
  const [gridList, setGridList] = useState([]);
  const [itemLevel, setItemLevel] = useState([]);
  const [salesLevel, setSalesLevel] = useState([]);
  const [personalizeOpen, setPersonalizeOpen] = useState(false);

  const { reset, control, getValues, setValue, watch } = useForm({
    defaultValues: { gridId: "RST_CPT_01", uiId: "UI_DP_95" },
  });

  const globalButtons = [
    {
      name: "search",
      action: () => {
        loadGrid1Data();
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
    setValue("userGrp", defaultGroup);
    setValue("gridId", "RST_CPT_01");
    setValue("uiId", "UI_DP_95");
    grid1.dataProvider.clearRows();
  }

  const setOptions = () => {
    grid1.gridView.displayOptions.fitStyle = "fill";
    grid1.gridView.setFooters({ visible: false });
    grid1.dataProvider.setOptions({ restoreMode: "auto" });
    grid1.gridView.displayOptions.showChangeMarker = false;
    setVisibleProps(grid1, true, true, true);

    grid1.gridView.setEditOptions({
      insertable: true,
      appendable: true,
    });
  };

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, "grid1");
    if (grdObj1 && grdObj1.dataProvider) {
      if (grid1 !== grdObj1) setGrid1(grdObj1);
    }
  }, [viewData]);

  useEffect(() => {
    if (grid1) {
      setViewInfo(vom.active, "globalButtons", globalButtons);
      setOptions();
      setGridCombo();
    }
  }, [grid1]);

  const loadCombos = async () => {
    const groups = await loadComboList({
      URL: "engine/dp/SRV_GET_SP_UI_DP_00_USER_GRP_Q1",
      CODE_KEY: "ID",
      CODE_VALUE: "GRP_NM",
      PARAM: {},
      ALLFLAG: false,
    });
    if (!isEmptyArray(groups)) {
      defaultGroup = groups[0].value;
      setGroupList(groups);
    }

    setViewList(
      await loadComboList({
        URL: "engine/dp/SRV_GET_SP_UI_DP_00_CONF_Q1",
        CODE_KEY: "CD",
        CODE_VALUE: "CD_NM",
        PARAM: {
          SP_UI_DP_00_CONF_Q1_01: "UI_ID",
          SP_UI_DP_00_CONF_Q1_02: "DP",
          SP_UI_DP_00_CONF_Q1_03: "",
        },
        ALLFLAG: false,
        TRANSLANG_LABEL: true,
      })
    );
    setItemLevel(
      await loadComboList({
        URL: "engine/dp/SRV_GET_SP_UI_DP_00_CONF_Q1",
        CODE_KEY: "ID",
        CODE_VALUE: "CD_NM",
        PARAM: {
          SP_UI_DP_00_CONF_Q1_01: "DP_LV_TP_I",
          SP_UI_DP_00_CONF_Q1_02: "",
          SP_UI_DP_00_CONF_Q1_03: "",
        },
        ALLFLAG: false,
        TRANSLANG_LABEL: true,
      })
    );
    setSalesLevel(
      await loadComboList({
        URL: "engine/dp/SRV_GET_SP_UI_DP_00_CONF_Q1",
        CODE_KEY: "ID",
        CODE_VALUE: "CD_NM",
        PARAM: {
          SP_UI_DP_00_CONF_Q1_01: "DP_LV_TP_S",
          SP_UI_DP_00_CONF_Q1_02: "",
          SP_UI_DP_00_CONF_Q1_03: "",
        },
        ALLFLAG: false,
        TRANSLANG_LABEL: true,
      })
    );
  };

  const loadGrid = async () => {
    const grids = await loadOption(true, "SRV_GET_SP_UI_DP_00_CONF_Q1", { SP_UI_DP_00_CONF_Q1_01: "GRID", SP_UI_DP_00_CONF_Q1_02: getValues("uiId"), SP_UI_DP_00_CONF_Q1_03: "" }, "CD", "CD_NM", false, true);
    if (!isEmptyArray(grids)) {
      setGridList(grids);
      setValue("gridId", grids[0].value);
    }
  };

  useEffect(() => {
    loadCombos();
  }, []);

  useEffect(() => {
    setValue("userGrp", defaultGroup);
  }, [groupList]);
  useEffect(() => {
    itemLevel.length > 0 && setValue("itemLevel", itemLevel[0].value);
  }, [itemLevel]);
  useEffect(() => {
    salesLevel.length > 0 && setValue("salesLevel", salesLevel[0].value);
  }, [salesLevel]);

  useEffect(() => {
    if (grid1 && groupList && viewList && gridList) {
      loadGrid1Data();
    }
  }, [grid1, groupList, viewList, gridList]);

  useEffect(() => {
    loadGrid();
  }, [watch("uiId")]);

  const setGridCombo = () => {
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_18_DIMENS_COL_COMBO",
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          loadReferDropDown(grid1, res.data.RESULT_DATA, [
            { cd: "LV_TP_CD", nm: "LV_TP_NM" },
            { cd: "LV_MGMT_ID", nm: "LV_MGMT_NM" },
            { cd: "COL_NM", nm: "COL_DESC" },
          ]);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const loadGrid1Data = () => {
    let param = new URLSearchParams();
    param.append("SP_UI_DP_18_Q1_01", getValues("userGrp"));
    param.append("SP_UI_DP_18_Q1_02", getValues("uiId"));
    param.append("SP_UI_DP_18_Q1_03", getValues("gridId"));
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_18_Q1",
      data: param,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          grid1.dataProvider.fillJsonData(res.data.RESULT_DATA);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const saveData = (targetGrid) => {
    targetGrid.gridView.commit(true);

    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), function (answer) {
      if (answer) {
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
          targetGrid.gridView.showToast(progressSpinner + "Saving data...", true);

          let formData = new FormData();
          formData.append("USER_ID", username);
          formData.append("CHANGES", JSON.stringify(changeRowData));

          zAxios
            .post(baseURI() + "engine/dp/SRV_SET_SP_UI_DP_18_S1", formData, {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then(function (response) {
              if (response.status === gHttpStatus.SUCCESS) {
                const rsData = response.data;
                if (rsData.RESULT_SUCCESS) {
                  const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_18_S1_P_RT_MSG"];
                  resultMSG === "MSG_0001" ? loadGrid1Data() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
                } else {
                  showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
                }
              }
            })
            .then(function () {
              grid1.gridView.hideToast();
            })
            .catch(function (e) {
              console.error(e);
            });
        }
      }
    });
  };
  const onDelete = (targetGrid, deleteRows) => {
    let formData = new FormData();
    formData.append("USER_ID", username);
    formData.append("changes", JSON.stringify(deleteRows));

    if (deleteRows.length > 0) {
      return zAxios({
        method: "post",
        url: baseURI() + "engine/dp/SRV_SET_SP_UI_DP_18_D1",
        headers: { "content-type": "application/json" },
        data: formData,
      })
        .then(function (response) {
          if (response.status === gHttpStatus.SUCCESS) {
            const rsData = response.data;
            if (rsData.RESULT_SUCCESS) {
              const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_18_D1_P_RT_MSG"];
              resultMSG === "MSG_0002" ? loadGrid1Data() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
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

  const createDimension = (targetGrid) => {
    targetGrid.gridView.commit(true);

    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5048"), function (answer) {
      if (answer) {
        let formData = new FormData();
        formData.append("GRP_ID", getValues("userGrp"));
        formData.append("UI_ID", getValues("uiId"));
        formData.append("GRID_ID", getValues("gridId"));
        formData.append("USER_ID", username);
        formData.append("ITEM_LV_TP_ID", getValues("itemLevel"));
        formData.append("SALES_LV_TP_ID", getValues("salesLevel"));

        zAxios({
          method: "post",
          header: { "content-type": "application/json" },
          url: baseURI() + "engine/dp/SRV_MAKE_DP_DIMENS_AUTO",
          data: formData,
        })
          .then(function (res) {
            res.status === gHttpStatus.SUCCESS &&
              zAxios({
                method: "post",
                url: baseURI() + "engine/dp/SRV_MAKE_PERSON_AUTO_DP_DIMENS",
                data: formData,
              })
                .then(function () {
                  grid1.gridView.hideToast();
                  loadGrid1Data();
                })
                .catch(function (e) {
                  console.error(e);
                });
          })
          .catch(function (e) {
            console.error(e);
          });
      }
    });
  };

  const reloadPrefInfo = (viewCd, userName, grid, grpCd, gridCd) => {
    if (grid) grid.loadCrossTabInfoAndPrefInfo(viewCd, grpCd, userName);
  };

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <InputField type="select" name="userGrp" label={transLangKey("USER_GRP")} control={control} options={groupList} />
            <InputField type="select" name="uiId" label={transLangKey("UI")} control={control} options={viewList} />
            <InputField type="select" name="gridId" label={transLangKey("GRID")} control={control} options={gridList} />
          </SearchRow>
        </SearchArea>
        <ButtonArea>
          {/*title={transLangKey("UI_DP_18")}*/}
          <LeftButtonArea>
            <InputField type="select" name="itemLevel" control={control} options={itemLevel} />
            <InputField type="select" name="salesLevel" control={control} options={salesLevel} />
            <CommonButton
              type="icon"
              title={transLangKey("create dimension automatically")}
              onClick={() => {
                createDimension(grid1);
              }}>
              <Icon.Sunset />
            </CommonButton>
          </LeftButtonArea>
          <RightButtonArea>
            <ButtonGroup variant="outlined">
              <GridAddRowButton grid="grid1" type="icon" />
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
          <BaseGrid id="grid1" items={grid1Items} />
        </ResultArea>
        <StatusArea show={false} message={message}>
          <GridCnt grid="grid1" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")} />
        </StatusArea>
      </ContentInner>
      <PopPersonalize open={personalizeOpen} onClose={() => setPersonalizeOpen(false)} resetCallback={reloadPrefInfo} viewCd={vom.active} grid={[grid1]} username={username} groupCd={""}></PopPersonalize>
    </>
  );
}

export default DimensionSet;
