import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box, ButtonGroup } from "@mui/material";
import { ContentInner, ResultArea, ButtonArea, RightButtonArea, GridAddRowButton, GridDeleteRowButton, GridSaveButton, BaseGrid, useViewStore, useUserStore, zAxios } from "@zionex/wingui-core/src/common/imports";
import { transLangKey, vom, gridComboLoad } from "@wingui";
import { newRowEditCellStyle, isEmptyArray } from "@wingui/view/demandplan/DpUtil";
import '@wingui/view/demandplan/master/level/levelStyle.css';

const leafCellStyle = (grid, dataCell) => {
  let ret = { editor: { type: "text" } };
  const itemIdx = dataCell.index.itemIndex;
  const isLeaf = grid.getValue(itemIdx, "LEAF_YN");
  if (isLeaf && grid.getValue(itemIdx, "SALES_LV_YN")) {
    ret.styleName = "sales-column";
  } else if (isLeaf) {
    ret.styleName = "leaf-column ";//rg-center
  }
  return ret;
}
const grid1Items = [
  {
    name: "ID",
    dataType: "text",
    headerText: "ID",
    visible: false,
    editable: false,
    width: 100,
    textAlignment: "center",
  },
  {
    name: "LV_TP_ID",
    dataType: "dropdown",
    headerText: "LV_TP",
    visible: true,
    editable: false,
    width: 110,
    textAlignment: "center",
    useDropdown: true,
    lookupDisplay: true,
    validRules: [{ criteria: "required" }],
    styleCallback: newRowEditCellStyle,
    mergeRule: {
      criteria: "value",
    },
  },
  {
    name: "LV_CD",
    dataType: "text",
    headerText: "LV_CD",
    visible: true,
    editable: true,
    width: 110,
    validRules: [{ criteria: "required" }],
    styleCallback: leafCellStyle,
    textAlignment: "center",
  },
  {
    name: "LV_NM",
    dataType: "text",
    headerText: "LV_NM",
    visible: true,
    editable: true,
    width: 110,
    styleCallback: leafCellStyle,
    textAlignment: "center",
  },
  {
    name: "SEQ",
    dataType: "text",
    headerText: "SEQ",
    visible: true,
    editable: true,
    width: 110,
    validRules: [{ criteria: "required" }],
    textAlignment: "center",
    styleCallback: leafCellStyle,
    /*styleCallback: (grid, dataCell) => {
      let ret = {};
      if (dataCell.value === 10) {
        // 최하위 level은 sEQ를 수정할 수 없다.
        ret.editable = false;
      }
      return ret;
    },*/
  },
  {
    name: "LEAF_YN",
    dataType: "boolean",
    headerText: "LEAF_YN",
    visible: false,
    editable: false,
    width: 80,
    textAlignment: "center",
  },
  {
    name: "LV_LEAF_YN",
    dataType: "boolean",
    headerText: "LV_LEAF_YN",
    visible: false,
    editable: false,
    width: 80,
    textAlignment: "center",
  },
  {
    name: "SALES_LV_YN",
    dataType: "boolean",
    headerText: "SALES_LV_YN",
    visible: false,
    editable: false,
    width: 80,
    textAlignment: "center",
  },
  {
    name: "ACCOUNT_LV_YN",
    dataType: "boolean",
    headerText: "ACCOUNT_LV_YN",
    visible: false,
    editable: false,
    width: 80,
    textAlignment: "center",
  },
  {
    name: "ACTV_YN",
    dataType: "boolean",
    headerText: "ACTV_YN",
    visible: false,
    editable: false,
    width: 80,
    textAlignment: "center",
  },
];

function Level() {
  const [username, displayName, systemAdmin] = useUserStore((state) => [state.username, state.displayName, state.systemAdmin]);
  const [grid1, setGrid1] = useState(null);
  const [grid2, setGrid2] = useState(null);
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const {
    reset,
    formState: {},
  } = useForm({
    defaultValues: {},
  });

  const getGridNewRow = () => {
    return { ACTV_YN: true, ID: generateId() };
  };

  const globalButtons = [
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
      action: () => {},
      visible: false,
      disable: false,
    },
    {
      name: "refresh",
      action: () => {
        reset();
      },
      visible: false,
      disable: false,
    },
  ];

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
    if (grid1 && grid2) {
      setViewInfo(vom.active, "globalButtons", globalButtons);
    }
  }, [grid1, grid2]);

  const setGridOption = (grid) => {
    grid.gridView.setEditOptions({
      insertable: true,
      appendable: true,
    });
    grid.gridView.displayOptions.fitStyle = "fill";
    setVisibleProps(grid, true, true, true);
    //checkbar
    grid.gridView.setCheckableExpression("not values['LEAF_YN']");
    //tooltip
    grid.gridView.setColumnProperty("LV_CD", "renderer", {showTooltip: true});
    grid.gridView.onShowTooltip = function (grid, index, value) {
      var itemIndex = index.itemIndex;
      if(grid.getValue(itemIndex, "LEAF_YN") && grid.getValue(itemIndex, "SALES_LV_YN")) {
        return value+": "+transLangKey("LOW_APPV_LV");
      }
      return ;
    }

  };

  const afterGridCreate1 = (gridObj) => {
    //gridView, dataProvider
    setGridOption(gridObj);

    gridComboLoad(gridObj, {
      URL: "engine/dp/SRV_GET_SP_UI_DP_00_CONF_Q1",
      CODE_VALUE: "ID",
      CODE_LABEL: "CD_NM",
      COLUMN: "LV_TP_ID",
      PROP: "lookupData",
      PARAM_KEY: ["SP_UI_DP_00_CONF_Q1_01", "SP_UI_DP_00_CONF_Q1_02", "SP_UI_DP_00_CONF_Q1_03"],
      PARAM_VALUE: ["DP_LV_TP_I", "", ""],
      TRANSLANG_LABEL: true,
    });
    loadGridData(gridObj, "I");
  };

  const afterGridCreate2 = (gridObj) => {
    setGridOption(gridObj);

    gridComboLoad(gridObj, {
      URL: "engine/dp/SRV_GET_SP_UI_DP_00_CONF_Q1",
      CODE_VALUE: "ID",
      CODE_LABEL: "CD_NM",
      COLUMN: "LV_TP_ID",
      PROP: "lookupData",
      PARAM_KEY: ["SP_UI_DP_00_CONF_Q1_01", "SP_UI_DP_00_CONF_Q1_02", "SP_UI_DP_00_CONF_Q1_03"],
      PARAM_VALUE: ["DP_LV_TP_S", "", ""],
      TRANSLANG_LABEL: true,
    });
    loadGridData(gridObj, "S");
  };

  const onLoad = () => {
    loadGridData(grid1, "I");
    loadGridData(grid2, "S");
  };

  const loadGridData = (grid, levelType) => {
    // let grid = levelType === "I" ? grid1 : grid2;
    let param = new URLSearchParams();
    param.append("LV_TP", levelType);
    param.append("timeout", 0);
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_02_NQ1",
      data: param,
    })
      .then((res) => {
        if (res.status === gHttpStatus.SUCCESS) {
          grid.dataProvider.fillJsonData(res.data.RESULT_DATA);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onBeforeDelete = (targetGrid) => {
    targetGrid.gridView.commit(true);
    let checkedRow = targetGrid.gridView.getCheckedRows();
    let targetRows = [];
    checkedRow.forEach((row) => {
      let data = targetGrid.dataProvider.getJsonRow(row);
      if (!data.LEAF_YN) {
        targetRows.push(row);
      }
    });

    if (targetRows.length <= 0) {
      showMessage(transLangKey("DELETE"), transLangKey("MSG_SELECT_DELETE"), { close: false });
      return false;
    }

    return true;
  };

  const onDelete = (targetGrid, deleteRows) => {
    let targetRows = [];
    deleteRows.forEach((row) => {
      if (!row.LEAF_YN) {
        targetRows.push(row);
      }
    });

    let param = new FormData();
    param.append("changes", JSON.stringify(targetRows));
    param.append("USER_ID", username);
    param.append("CHANGE_TYPE", "DELETE");
    param.append("timeout", 0);
    if (targetRows.length === 0) {
      showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5052"));
      onLoad();
    } else {
      return zAxios({
        method: "post",
        url: baseURI() + "engine/dp/SRV_SET_SP_UI_DP_02_ND1",
        headers: { "content-type": "application/json" },
        data: param,
      })
        .then((response) => {
          if (response.status === gHttpStatus.SUCCESS) {
            const rsData = response.data;
            if (rsData.RESULT_SUCCESS) {
              const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_02_ND1_P_RT_MSG"];
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
  };

  const saveData = (levelType) => {
    let targetGrid = levelType === "I" ? grid1 : grid2;

    targetGrid.gridView.commit(true);

    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), (answer) => {
      if (answer) {
        let changes = [];
        changes = changes.concat(targetGrid.dataProvider.getAllStateRows().created, targetGrid.dataProvider.getAllStateRows().updated, targetGrid.dataProvider.getAllStateRows().deleted, targetGrid.dataProvider.getAllStateRows().createAndDeleted);
        let changeRowData = [];
        let allRows = targetGrid.dataProvider.getJsonRows();
        let allLevelRows = allRows.filter((row) => {
          return !row.LEAF_YN;
        });

        let groupRows = allLevelRows.reduce((acc, k) => {
          let lvTp = k.LV_TP_ID;
          acc[lvTp] = [...(acc[lvTp] || []), k];
          return acc;
        }, {});

        for (let key of Object.keys(groupRows)) {
          let levelRows = groupRows[key];
          // console.log(key + " levelRows", levelRows);
          // console.log("changes", changes);
          let levelChanges = changes.filter((row) => {
            let data = targetGrid.dataProvider.getJsonRow(row);
            return data.LV_TP_ID === key;
          });
          //console.log("levelChanges", levelChanges);
          if (isEmptyArray(levelChanges)) {
            continue;
          }

          let maxSeqRow = levelRows.sort((a, b) => {
            return parseFloat(b["SEQ"]) - parseFloat(a["SEQ"]);
          })[0];

          //기존의 LV_LEAF_YN = true 인 row를 false를 만들어야 하기 때문에
          let secondMaxSeqRow = null;
          if (levelRows.length > 1) {
            secondMaxSeqRow = levelRows[1];
          }
          // console.log("secondMaxSeqRow", secondMaxSeqRow);
          // console.log("maxSeqRow", maxSeqRow);

          levelChanges.forEach((row) => {
            let rowState = targetGrid.dataProvider.getRowState(row);
            let data = targetGrid.dataProvider.getJsonRow(row);
            //LEAF_YN , LV_LEAF_YN, SALES_LV_YN, ACCOUNT_LV_YN
            if (rowState === "created") {
              data.SALES_LV_YN = levelType !== "I";
              data.ACCOUNT_LV_YN = levelType !== "I";
              data.LEAF_YN = false;
            }
            //create/modify level leaf인지 체크
            data.LV_LEAF_YN = maxSeqRow.ID === data.ID;
            changeRowData.push(data);
          });

          //console.log("changeRowData1", changeRowData);

          if (secondMaxSeqRow !== null) {
            secondMaxSeqRow.LV_LEAF_YN = false;
          }

          //changs에 level leaf가 있는지 체크
          let levelLeafRowInChanges = changeRowData.filter((row) => {
            return row.ID === maxSeqRow.ID;
          });
          // 없다면 change에 LV_LEAF_YN = true 로 변경해서 추가
          if (isEmptyArray(levelLeafRowInChanges)) {
            maxSeqRow.LV_LEAF_YN = true;
            changeRowData.push(maxSeqRow);
          }
          //console.log("changeRowData2", changeRowData);

          //changes에 second Leaf Row 가 있는지 체크
          let beforeLevelLeafRowInChanges = changeRowData.filter((row) => {
            return secondMaxSeqRow !== null && row.ID === secondMaxSeqRow.ID;
          });
          // 없다면 change에 LV_LEAF_YN = false 로 변경해서 추가
          if (isEmptyArray(beforeLevelLeafRowInChanges) && secondMaxSeqRow !== null) {
            secondMaxSeqRow.LV_LEAF_YN = false;
            changeRowData.push(secondMaxSeqRow);
          }
          //console.log("changeRowData3", changeRowData);
        }

        //----------------------------------------------------------------------------
        //console.log("final changeRowData==>", changeRowData);
        if (changeRowData.length === 0) {
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"));
        } else {
          targetGrid.gridView.showToast(progressSpinner + "Saving data...", true);

          let param = new FormData();
          param.append("changes", JSON.stringify(changeRowData));
          param.append("USER_ID", username);
          param.append("CHANGE_TYPE", "CHANGE");
          //console.log(param.toString());

          zAxios
            .post(baseURI() + "engine/dp/SRV_SET_SP_UI_DP_02_S1", param, {
              headers: { "content-type": "application/json" },
            })
            .then((response) => {
              if (response.status === gHttpStatus.SUCCESS) {
                const rsData = response.data;
                if (rsData.RESULT_SUCCESS) {
                  const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_02_S1_P_RT_MSG"];
                  resultMSG === "MSG_0001" ? onLoad() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
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
      <ResultArea sizes={[50, 50]} direction={"horizontal"}>
        <Box>
          <ButtonArea title={transLangKey("CM_ITEM_LV")}>
            <RightButtonArea>
              <ButtonGroup>
                <GridAddRowButton grid="grid1" type="icon" onGetData={getGridNewRow} />
                <GridDeleteRowButton grid="grid1" type="icon" onBeforeDelete={onBeforeDelete} onDelete={onDelete} />
                <GridSaveButton grid="grid1" type="icon" onClick={() => saveData("I")} />
              </ButtonGroup>
            </RightButtonArea>
          </ButtonArea>
          <ResultArea>
            <BaseGrid id="grid1" items={grid1Items} afterGridCreate={afterGridCreate1} />
          </ResultArea>
        </Box>
        <Box>
          <ButtonArea title={transLangKey("SALES_LV_YN")}>
            <RightButtonArea>
              <ButtonGroup>
                <GridAddRowButton grid="grid2" type="icon" onGetData={getGridNewRow} />
                <GridDeleteRowButton grid="grid2" type="icon" onDelete={onDelete} />
                <GridSaveButton grid="grid2" type="icon" onClick={() => saveData("S")} />
              </ButtonGroup>
            </RightButtonArea>
          </ButtonArea>
          <ResultArea>
            <BaseGrid id="grid2" items={grid1Items} afterGridCreate={afterGridCreate2} />
          </ResultArea>
        </Box>
      </ResultArea>
    </ContentInner>
  );
}

export default Level;
