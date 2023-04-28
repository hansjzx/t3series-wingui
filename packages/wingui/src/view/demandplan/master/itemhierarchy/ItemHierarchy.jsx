import React, { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { ContentInner, ResultArea, SearchArea, StatusArea, ButtonArea, RightButtonArea, SearchRow, InputField, GridAddRowButton, GridDeleteRowButton, GridSaveButton, CommonButton, TreeGrid, GridCnt, useViewStore, zAxios } from "@zionex/wingui-core/src/common/imports";
import { transLangKey } from "@wingui";
import { loadOption } from "@wingui/view/demandplan/DpUtil";

let grid1Items = [
  { name: "ID", dataType: "text", headerText: "ITEM_LV_ID", visible: false, editable: false },
  { name: "ITEM_LV_CD", dataType: "text", headerText: "ITEM_LV_CD", visible: true, editable: true, width: "200", textAlignment: "center" },
  { name: "ITEM_LV_NM", dataType: "text", headerText: "ITEM_LV_NM", visible: true, editable: true, width: "110", textAlignment: "center" },
  { name: "LV_MGMT_ID", dataType: "dropdown", headerText: "LV_MGMT_ID", visible: true, editable: true, width: "140", useDropdown: true, lookupDisplay: true, textAlignment: "center" },
  { name: "PARENT_ITEM_LV_ID", dataType: "text", headerText: "PARENT_ITEM_LV_ID", visible: false, editable: false, width: "120" },
  { name: "PARENT_ITEM_LV_CD", dataType: "text", headerText: "PARENT_ITEM_LV_CD", visible: false, editable: false, width: "120" },
  { name: "PARENT_ITEM_LV_NM", dataType: "text", headerText: "PARENT_ITEM_LV_NM", visible: false, editable: false, width: "120" },
  { name: "SEQ", dataType: "text", headerText: "SEQ", visible: true, editable: true, width: "80", textAlignment: "rg-far" },
  { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80", textAlignment: "center" },
  { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: 100, textAlignment: "center" },
  { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: 100, textAlignment: "center" },
  { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 100, textAlignment: "center" },
  { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 100, textAlignment: "center" },
];

let levelTypeOptionData = [];
function ItemHierarchy() {
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [grid1, setGrid1] = useState(null);
  const [message, setMessage] = useState();
  const {
    reset,
    control,
    getValues,
    setValue,
    watch,
    formState: {},
  } = useForm({
    defaultValues: {
      lvTp: "",
      lvNm: "",
      activeYn: "Y",
    },
  });

  const [levelTypeOption, setLevelTypeOption] = useState([]);
  const [levelOption, setLevelOption] = useState([]);
  const [isTopLevel, setTopLevel] = useState(true);
  const [isCellClicked, setCellClicked] = useState(false);

  //6. ViewPath props
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

  const refresh = () => {
    reset();
    setValue("lvTp", levelTypeOptionData[0].value);
    setValue("lvNm", "ALL");

    grid1.dataProvider.clearRows();
  };

  // 그리드 Object 초기화
  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, "grid1");
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        setGrid1(grdObj1);
      }
    }
  }, [viewData]);

  useEffect(() => {
    if (grid1) {
      setViewInfo(vom.active, "globalButtons", globalButtons);
      setGridOptions();
      //setValue("activeYn", "Y");
      // console.log("useEffect grid1");
    }
  }, [grid1]);

  useEffect(() => {
    loadLevelType();
  }, []);

  useEffect(() => {
    if (levelTypeOption && levelTypeOption.length > 0) setValue("lvTp", levelTypeOption[0].value);
  }, [levelTypeOption]);

  useEffect(() => {
    if (levelTypeOption && levelTypeOption.length > 0 && grid1) {
      onLoad();
    }
  }, [grid1, levelTypeOption]);

  useEffect(() => {
    if (getValues("lvTp")) {
      loadLevel();
      // loadGridCombo();
    }
  }, [watch("lvTp")]);

  //조회조건 레벨타입 load
  const loadLevelType = async () => {
    //    const options = await loadOption(false, "SP_UI_DP_00_CONF_Q1", { "p_GRP_CD": "DP_LV_TP_I", "p_TYPE": "", "p_LOCALE": "" }, "ID", "CD_NM", false, true);
    //전역변수로 두었음 => refresh할때 찾을수가 없어서...
    levelTypeOptionData = await loadOption(true, "SRV_GET_SP_UI_DP_00_CONF_Q1", { SP_UI_DP_00_CONF_Q1_01: "DP_LV_TP_I", SP_UI_DP_00_CONF_Q1_02: "", SP_UI_DP_00_CONF_Q1_03: "" }, "ID", "CD_NM", false, true);
    // console.log("levelTypeOptionData", levelTypeOptionData);
    setLevelTypeOption(levelTypeOptionData);
  };

  //  let locallvTpData = lvTpData;

  const getLvTpCd = (value) => {
    let lvTpCd = "";
    // console.log("levelTypeOption", levelTypeOption);
    let lvTpDataObj = levelTypeOptionData.find((item) => item.value === value);
    if (lvTpDataObj) {
      lvTpCd = lvTpDataObj.data.CD;
    }
    return lvTpCd;
  };

  //조회조건 레벨명 load
  const loadLevel = async () => {
    let lvTp = getValues("lvTp");
    let lvTpCd = getLvTpCd(lvTp);

    const options = await loadOption(true, "SRV_GET_SP_UI_DP_00_LV_CD_Q1", { LV_TP: lvTpCd, LEAF_YN: "N", TYPE: "ALL" }, "ID", "CD_NM", false, true);
    //console.log("options", options);
    setLevelOption(options);
    setValue("lvNm", options[0].value);
  };

  //grid 레벨명 load
  const loadGridCombo = () => {
    let lvTp = getValues("lvTp");
    let lvTpCd = getLvTpCd(lvTp);
    // console.log("lvTp", lvTp, "lvTpCd", lvTpCd);
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

  /** 이벤트 핸들러 */
  const onLoad = () => {
    loadGridData();
    loadGridCombo();
  };

  const setGridOptions = () => {
    grid1.gridView.displayOptions.fitStyle = "fill";
    grid1.gridView.setEditOptions({
      insertable: true,
      appendable: true,
    });
    grid1.gridView.footers.visible = false;
    grid1.gridView.onCellClicked = (grid, index) => {
      setCellClicked(true);
      if (index.cellType === "data") {
        let parentsId = grid.getValue(index.itemIndex, "PARENT_ITEM_LV_ID");
        setTopLevel(parentsId === null || parentsId === undefined);
      }
    };
  };

  const loadGridData = () => {
    let param = new URLSearchParams();
    param.append("TREE_PARENT_ID", "PARENT_ITEM_LV_CD");
    param.append("TREE_KEY_ID", "ITEM_LV_CD");
    param.append("SP_UI_DP_08_Q1_01", getValues("lvNm") === "ALL" ? "" : getValues("lvNm"));
    param.append("SP_UI_DP_08_Q1_02", getValues("activeYn"));
    param.append("SP_UI_DP_08_Q1_03", getValues("lvTp"));
    param.append("timeout", 0);
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_08_Q1",
      data: param,
    })
      .then((res) => {
        if (res.status === gHttpStatus.SUCCESS) {
          const resData = res.data.RESULT_DATA;
          let responseData = { items: resData };
          grid1.dataProvider.setObjectRows(responseData, "items", "", "");
          setCellClicked(false);
        }
        // loadGridCombo();
        grid1.gridView.expandAll();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const addChildRow = () => {
    let dataRow = grid1.gridView.getCurrent().dataRow;
    let parentItemLvId = grid1.dataProvider.getValue(dataRow, "ID");
    if (dataRow === -1) {
      showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5010"), { close: false });
    } else {
      const levelMgmtId = grid1.dataProvider.getValue(dataRow, "LV_MGMT_ID");
      // console.log("levelOption", levelOption, "levelMgmtId", levelMgmtId);
      let sbIdx = -1;
      let sbLevelId;
      // levelMgmtId와 같은 value를 지닌 levelOption 데이터의 index +1
      for(let i=0, n=levelOption.length-1; i<n; i++) {
        if(levelOption[i].value === levelMgmtId) {
          sbIdx = i+1;
        }
      }
      if(sbIdx === -1) {
        showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5159"), { close: false });
      } else {
        sbLevelId = levelOption[sbIdx].value;
        grid1.gridView.expand(dataRow - 1, false, false);
        grid1.dataProvider.addChildRow(
          dataRow, // parent rowId
          [ "", //id
            "", //item level cd
            "", //item level name
            sbLevelId, //level mgmt id
            parentItemLvId,
            "",
            "",
            "", // seq
            true, // active
            username,
            new Date(),
            "",
            "",
            "CREATED"],
          0, // icon index
          false // children(자식 보유 여부)
        );
      }
    }
  };

  //Promise를 리턴해야 한다.
  const onDelete = (targetGrid, deleteRows) => {
    let formData = new FormData();
    formData.append("changes", JSON.stringify(deleteRows));
    formData.append("USER_ID", username);

    if (deleteRows.length > 0) {
      return zAxios({
        method: "post",
        url: baseURI() + "engine/dp/SRV_SET_SP_UI_DP_08_D1",
        headers: { "content-type": "application/json" },
        data: formData,
      })
        .then((response) => {
          if (response.status === gHttpStatus.SUCCESS) {
            const rsData = response.data;
            if (rsData.RESULT_SUCCESS) {
              const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_08_D1_P_RT_MSG"];
              resultMSG === "MSG_0002" ? onLoad() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
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

    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), (answer) => {
      if (answer) {
        let changes = [];
        changes = changes.concat(targetGrid.dataProvider.getAllStateRows().created, targetGrid.dataProvider.getAllStateRows().updated, targetGrid.dataProvider.getAllStateRows().deleted, targetGrid.dataProvider.getAllStateRows().createAndDeleted);

        let changeRowData = [];
        changes.forEach((row) => {
          let data = targetGrid.dataProvider.getJsonRow(row);
          let rowState = targetGrid.dataProvider.getRowState(row);

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

          zAxios
            .post(baseURI() + "engine/dp/SRV_SET_SP_UI_DP_08_S1", formData, {
              headers: { "content-type": "application/json" },
            })
            .then((response) => {
              if (response.status === gHttpStatus.SUCCESS) {
                const rsData = response.data;
                if (rsData.RESULT_SUCCESS) {
                  const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_08_S1_P_RT_MSG"];
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
  const getNewGridData = () => {
    return { LV_MGMT_ID: levelOption.filter((rw) =>(rw.data.ID.length === 32))[0].value, ACTV_YN: true, CREATE_BY: username, CREATE_DTTM: new Date() };
  };

  return (
    <ContentInner>
      <SearchArea>
        <SearchRow>
          {/* direction : row, column */}
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
          {isTopLevel && <GridAddRowButton grid="grid1" type="icon" onGetData={getNewGridData}/>}
          {isCellClicked && <CommonButton title={transLangKey("Add Child Row")} onClick={() => {
            addChildRow();
          }}><Icon.PlusCircle/>
          </CommonButton>}
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

export default ItemHierarchy;
