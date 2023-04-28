import React, { useState, useEffect } from "react";
import { baseURI, transLangKey, vom } from "@wingui";
import { useForm } from "react-hook-form";
import { ContentInner, ResultArea, SearchArea, StatusArea, ButtonArea, RightButtonArea, zAxios, GridAddRowButton, GridDeleteRowButton, GridSaveButton, CommonButton, TreeGrid, SearchRow, InputField, useUserStore, GridCnt } from "@zionex/wingui-core/src/common/imports";
import { useViewStore } from "@zionex/wingui-core/src/store/viewStore";
// import { iconClasses, IconButton } from "@mui/material";
import { loadOption, isEmptyArray } from "@wingui/view/demandplan/DpUtil";

const grid1Items = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: 100, textAlignment: "center" },
  { name: "SALES_LV_CD", dataType: "text", headerText: "SALES_LV_CD", visible: true, editable: true, width: 200, textAlignment: "center", validRules: [{ criteria: "required" }] },
  { name: "SALES_LV_NM", dataType: "text", headerText: "SALES_LV_NM", visible: true, editable: true, width: 100, textAlignment: "center", validRules: [{ criteria: "required" }] },
  { name: "LV_TP_CD", dataType: "text", headerText: "LV_TP_CD", visible: false, editable: true, width: 100, textAlignment: "center" },
  { name: "LV_MGMT_ID", dataType: "text", headerText: "LV_MGMT_ID", visible: true, editable: true, width: 100, textAlignment: "center", useDropdown: true, lookupDisplay: true, validRules: [{ criteria: "required" }] },
  { name: "VIRTUAL_YN", dataType: "boolean", headerText: "VIRTUAL_YN", visible: true, editable: true, width: 100, textAlignment: "center" },
  { name: "PARENT_SALES_LV_CD", dataType: "text", headerText: "PARENT_SALES_LV_CD", visible: false, editable: true, width: 100, textAlignment: "center" },
  { name: "PARENT_SALES_LV_ID", dataType: "text", headerText: "PARENT_SALES_LV_ID", visible: false, editable: true, width: 100, textAlignment: "center" },
  { name: "PARENT_SALES_LV_NM", dataType: "text", headerText: "PARENT_SALES_LV_NM", visible: false, editable: true, width: 100, textAlignment: "center" },
  { name: "CURCY_CD_ID", dataType: "dropdown", headerText: "CURCY_CD_ID", visible: false, editable: true, width: 100, textAlignment: "center", useDropdown: true, lookupDisplay: true },
  { name: "CURCY_CD_NM", dataType: "dropdown", headerText: "CURCY_CD_ID", visible: false, editable: true, width: 100, textAlignment: "center", useDropdown: true, lookupDisplay: true },
  { name: "SEQ", dataType: "text", headerText: "SEQ", visible: true, editable: true, width: 80, textAlignment: "center", validRules: [{ criteria: "required" }] },
  { name: "SRP_YN", dataType: "boolean", headerText: "SRP_YN", visible: false, editable: true, width: 100, textAlignment: "center" },
  { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: 100, defaultValue: true },
  { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: 100, textAlignment: "center" },
  { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: 100, textAlignment: "center", format: "yyyy-MM-dd HH:mm:ss" },
  { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 100, textAlignment: "center" },
  { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 100, textAlignment: "center", format: "yyyy-MM-dd HH:mm:ss" },
];
let levelTypeOptionData = [];

function SalesHierarchy() {
  const [username, displayName, systemAdmin] = useUserStore((state) => [state.username, state.displayName, state.systemAdmin]);
  const [message, setMessage] = useState();
  const [grid1, setGrid1] = useState();
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const [levelTypeOption, setLevelTypeOption] = useState([]);
  const [levelOption, setLevelOption] = useState([]);
  const { reset, control, getValues, setValue, watch } = useForm({
    defaultValues: { lvTp: "", lvNm: "", activeYn: "Y" },
  });
  const [isTopLevel, setTopLevel] = useState(true);
  const [isCellClicked, setCellClicked] = useState(false);

  const loadLevelType = async () => {
    //    const levelTypeArr = await loadOption(false, "SP_UI_DP_00_CONF_Q1", { p_GRP_CD: "DP_LV_TP_S", p_TYPE: "", p_LOCALE: "" }, "ID", "CD_NM", false, true);
    levelTypeOptionData = await loadOption(true, "SRV_GET_SP_UI_DP_00_CONF_Q1", { SP_UI_DP_00_CONF_Q1_01: "DP_LV_TP_S", SP_UI_DP_00_CONF_Q1_02: "", SP_UI_DP_00_CONF_Q1_03: "" }, "ID", "CD_NM", false, true);

    if (!isEmptyArray(levelTypeOptionData)) {
      setLevelTypeOption(levelTypeOptionData);
      setValue("lvTp", levelTypeOptionData[0].value);
    }
  };

  useEffect(() => {
    loadLevelType();
  }, []);

  useEffect(() => {
    loadLevel();
    //setValue("lvNm", " ");
  }, [watch("lvTp")]);

  const getLvTpCd = (value) => {
    let lvTpCd = "";
    let lvTpDataObj = levelTypeOptionData.find((item) => item.value === value);
    if (lvTpDataObj) {
      lvTpCd = lvTpDataObj.data.CD;
    }
    return lvTpCd;
  };

  const loadLevel = async () => {
    let lvTp = getValues("lvTp");
    let lvTpCd = getLvTpCd(lvTp);

    const options = await loadOption(true, "SRV_GET_SP_UI_DP_00_LV_CD_Q1", { LV_TP: lvTpCd, LEAF_YN: "N", TYPE: "ALL" }, "ID", "CD_NM", false, true);
    setLevelOption(options);
    setValue("lvNm", options[0].value);
  };

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
  ];

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, "grid1");
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        if (grid1 !== grdObj1) setGrid1(grdObj1);
      }
    }
  }, [viewData]);

  const refresh = () => {
    reset();
    setValue("lvTp", levelTypeOptionData[0].value);
    setValue("lvNm", "ALL");

    grid1.dataProvider.clearRows();
  };

  const loadGridLevel = () => {
    let lvTp = getValues("lvTp");
    let lvTpCd = getLvTpCd(lvTp);

    //console.log(lvTp, "lvTpCd===>", lvTpCd);
    gridComboLoad(grid1, {
      URL: "engine/dp/SRV_GET_SP_UI_DP_00_LV_CD_Q1",
      CODE_VALUE: "ID",
      CODE_LABEL: "CD_NM",
      COLUMN: "LV_MGMT_ID",
      PROP: "lookupData",
      TRANSLANG_LABEL: true,
      PARAM_KEY: ["LV_TP", "LEAF_YN", "TYPE"],
      PARAM_VALUE: [lvTpCd, "N", ""],
    });
  };

  useEffect(() => {
    if (levelTypeOption && levelTypeOption.length > 0 && grid1) {
      loadGrid1Data();
    }
  }, [grid1, levelTypeOption]);

  useEffect(() => {
    if (grid1) {
      setViewInfo(vom.active, "globalButtons", globalButtons);
      setGridOption();
      // 조회조건 세팅
      setValue("activeYn", "Y");
      //       gridComboLoad(grid1, {
      //         URL: "engine/dp/SRV_GET_SP_UI_DP_00_CM_CD_Q1",
      //         CODE_VALUE: "ID",
      //         CODE_LABEL: "CD_NM",
      //         COLUMN: "CURCY_CD_ID",
      //         PROP: "lookupData",
      //         PARAM_KEY: ["SP_UI_DP_00_CM_CD_Q1_01", "SP_UI_DP_00_CM_CD_Q1_02"],
      //         PARAM_VALUE: ["CURRENCY", ""],
      //         TRANSLANG_LABEL: true,
      //       });
    }
  }, [grid1]);

  const setGridOption = () => {
    grid1.gridView.setEditOptions({
      insertable: true,
      appendable: true,
    });
    grid1.gridView.displayOptions.fitStyle = "fill";
    grid1.gridView.footers.visible = false;
    grid1.gridView.onCellClicked = (grid, index) => {
      setCellClicked(true);
      if (index.cellType === "data") {
        let parentsId = grid.getValue(index.itemIndex, "PARENT_SALES_LV_ID");
        setTopLevel(parentsId === null || parentsId === undefined);
      }
    };
  };

  const getNewGridData = () => {
    return { LV_MGMT_ID: levelOption.filter((rw) => rw.data.ID.length === 32)[0].value, ACTV_YN: true, CREATE_BY: username, CREATE_DTTM: new Date() };
  };

  const loadGrid1Data = () => {
    let param = new URLSearchParams();
    param.append("TREE_PARENT_ID", "PARENT_SALES_LV_ID");
    param.append("TREE_KEY_ID", "ID");
    param.append("SP_UI_DP_10_Q1_01", getValues("lvNm") === "ALL" ? "" : getValues("lvNm"));
    param.append("SP_UI_DP_10_Q1_02", "");
    param.append("SP_UI_DP_10_Q1_03", getValues("activeYn") === undefined ? "" : getValues("activeYn"));
    param.append("SP_UI_DP_10_Q1_04", getValues("lvTp") === undefined ? "" : getValues("lvTp"));
    param.append("timeout", 0);
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_10_Q1",
      data: param,
    })
      .then((res) => {
        if (res.status === gHttpStatus.SUCCESS) {
          const resData = res.data.RESULT_DATA;
          let responseData = { items: resData };
          grid1.dataProvider.setObjectRows(responseData, "items", "", "");
          grid1.gridView.expandAll();
        }
        loadGridLevel();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addChildRow = () => {
    const dataRow = grid1.gridView.getCurrent().dataRow;
    let parentSalesLvId = grid1.dataProvider.getValue(dataRow, "ID");
    if (dataRow === -1) {
      showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5010"), { close: false });
    } else {
      const levelMgmtId = grid1.dataProvider.getValue(dataRow, "LV_MGMT_ID");
      console.log("levelOption", levelOption, "levelMgmtId", levelMgmtId);
      let sbIdx = -1;
      let sbLevelId;
      // levelMgmtId와 같은 value를 지닌 levelOption 데이터의 index +1
      for (let i = 0, n = levelOption.length - 1; i < n; i++) {
        if (levelOption[i].value === levelMgmtId) {
          sbIdx = i + 1;
        }
      }
      if (sbIdx === -1) {
        showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5159"), { close: false });
      } else {
        sbLevelId = levelOption[sbIdx].value;
        grid1.gridView.expand(dataRow - 1, false, false);
        grid1.dataProvider.addChildRow(
          dataRow, // parent rowId
          [
            "", //id
            "", //sales level cd
            "", //sales level name
            getLvTpCd(getValues("lvTp")), // level type code
            sbLevelId, //level mgmt id
            false, // virtual yn
            parentSalesLvId,
            "",
            "",
            "", //currency code id
            "", //currency code name
            "", // seq
            false, // srp yn
            true, // active
            username,
            new Date(),
            "",
            "",
            "CREATED",
          ],
          0, // icon index
          false // children(자식 보유 여부)
        );
      }
      /*      grid1.gridView.expand(dataRow - 1, false, false);
      grid1.dataProvider.addChildRow(
        dataRow, // parent rowId
        [grid1.gridView.getCurrent().dataRow + 1, ""],
        0, // icon index
        false // children(자식 보유 여부)
      );*/
    }
  };

  const onDelete = (targetGrid, deleteRows) => {
    let params = new URLSearchParams();
    params.append("changes", JSON.stringify(deleteRows));
    params.append("USER_ID", username);
    params.append("timeout", 0);

    if (deleteRows.length > 0) {
      return zAxios({
        method: "post",
        url: baseURI() + "engine/dp/SRV_SET_SP_UI_DP_10_D1",
        headers: { "content-type": "application/json" },
        data: params,
      })
        .then((response) => {
          if (response.status === gHttpStatus.SUCCESS) {
            const rsData = response.data;
            if (rsData.RESULT_SUCCESS) {
              const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_10_D1_P_RT_MSG"];
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

  const saveData = (targetGrid) => {
    targetGrid.gridView.commit(true);

    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), (answer) => {
      if (answer) {
        let changes = [];
        changes = changes.concat(targetGrid.dataProvider.getAllStateRows().created, targetGrid.dataProvider.getAllStateRows().updated, targetGrid.dataProvider.getAllStateRows().deleted, targetGrid.dataProvider.getAllStateRows().createAndDeleted);

        let changeRowData = [];
        changes.forEach((row) => {
          let rowState = targetGrid.dataProvider.getRowState(row);
          let data = targetGrid.dataProvider.getJsonRow(row);

          let parentSalesLvId = targetGrid.dataProvider.getValue(targetGrid.dataProvider.getParent(row), "ID");
          let parentSalesLvCd = targetGrid.dataProvider.getValue(targetGrid.dataProvider.getParent(row), "SALES_LV_CD");
          let parentSalesLvNm = targetGrid.dataProvider.getValue(targetGrid.dataProvider.getParent(row), "SALES_LV_NM");

          data.PARENT_SALES_LV_ID = parentSalesLvId;
          data.PARENT_SALES_LV_CD = parentSalesLvCd;
          data.PARENT_SALES_LV_NM = parentSalesLvNm;

          if (rowState === "created") {
            data.ID = generateId();
          }
          changeRowData.push(data);
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"));
        } else {
          targetGrid.gridView.showToast(progressSpinner + "Saving data...", true);

          let formData = new FormData();
          formData.append("changes", JSON.stringify(changeRowData));
          formData.append("USER_ID", username);
          formData.append("timeout", 0);

          zAxios
            .post(baseURI() + "engine/dp/SRV_SET_SP_UI_DP_10_S1", formData, {
              headers: { "content-type": "application/json" },
            })
            .then((response) => {
              // let resultMSG = response.data.RESULT_DATA.IM_DATA.SP_UI_DP_10_S1_P_RT_MSG;
              // if (resultMSG === "MSG_0013") {
              //   showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_0013"));
              // }
              if (response.status === gHttpStatus.SUCCESS) {
                const rsData = response.data;
                if (rsData.RESULT_SUCCESS) {
                  const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_10_S1_P_RT_MSG"];
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

  return (
    <ContentInner>
      <SearchArea>
        <SearchRow>
          <InputField name="lvTp" label={transLangKey("LV_TP")} type="select" control={control} options={levelTypeOption} />
          <InputField name="lvNm" label={transLangKey("LV_NM")} type="select" control={control} options={levelOption} />
          <InputField
            name="activeYn"
            label={transLangKey("ACTV_YN")}
            type="select"
            control={control}
            options={[
              { label: "ALL", value: "" },
              { label: "Y", value: "Y" },
              { label: "N", value: "N" },
            ]}
          />
        </SearchRow>
      </SearchArea>
      <ButtonArea>
        <RightButtonArea>
          {isTopLevel && <GridAddRowButton grid="grid1" type="icon" onGetData={getNewGridData} />}
          {isCellClicked && (
            <CommonButton
              title={transLangKey("Add Child Row")}
              onClick={() => {
                addChildRow();
              }}>
              <Icon.PlusCircle />
            </CommonButton>
          )}
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
        <TreeGrid id="grid1" items={grid1Items} />
      </ResultArea>
      <StatusArea show={false} message={message}>
        <GridCnt grid="grid1" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")} />
      </StatusArea>
    </ContentInner>
  );
}

export default SalesHierarchy;
