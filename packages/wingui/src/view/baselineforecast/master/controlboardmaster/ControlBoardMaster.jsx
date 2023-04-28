import React, { useState, useEffect } from "react";
import { ButtonGroup, Icon, IconButton, iconClasses } from "@mui/material";
import { useForm } from "react-hook-form";
import {
  ContentInner,
  ViewPath,
  ResultArea,
  SearchArea,
  StatusArea,
  ButtonArea,
  LeftButtonArea,
  RightButtonArea,
  SearchRow,
  SplitPanel,
  InputField,
  GridAddRowButton,
  GridDeleteRowButton,
  GridSaveButton,
  BaseGrid,
  GridCnt,
  useViewStore,
  useUserStore,
  zAxios,
  GridExcelExportButton,
  GridExcelImportButton,
} from "@zionex/wingui-core/src/common/imports";
import { Search } from "react-feather";
import { exportGridtoExcel } from "@zionex/wingui-core/src/component/grid/grid";
import { Translate } from "@mui/icons-material";

let grid1Items = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: 100 },
  {
    name: "ENGINE_TP_CD",
    dataType: "dropdown",
    headerText: "ENGINE_TP_CD",
    visible: true,
    editable: false,
    width: 100,
    textAlignment: "center",
    useDropdown: true,
    lookupDisplay: true,
    styleCallback: function (grid, dataCell) {
      let ret = {};
      if (dataCell.item.rowState == "created" || dataCell.item.itemState == "appending" || dataCell.item.itemState == "inserting") {
        ret.editable = true;
        ret.styleName = "editable-text-column";
      } else {
        ret.editable = false;
      }
      return ret;
    },
  },
  { name: "DESCRIP", dataType: "text", headerText: "DESCRIP", visible: true, editable: true, width: 100 },
  { name: "SEQ", dataType: "number", headerText: "SEQ", visible: true, editable: true, textAlignment: "center", width: 100 },

  {
    name: "INPUT_GROUP",
    dataType: "group",
    orientation: "horizontal",
    headerText: "INPUT",
    headerVisible: true,
    hideChildHeaders: false,
    childs: [
      { name: "INPUT_HORIZ", dataType: "number", headerText: "CF_BF_POLICY_H", visible: true, editable: true, width: 100, textAlignment: "near" },
      { name: "INPUT_BUKT_CD", dataType: "dropdown", headerText: "INPUT_BUKT_CD", visible: true, editable: true, width: 100, textAlignment: "center", useDropdown: true, lookupDisplay: true },
    ],
  },
  {
    name: "TARGET_GROUP",
    dataType: "group",
    orientation: "horizontal",
    headerText: "TARGET",
    headerVisible: true,
    hideChildHeaders: false,
    childs: [
      { name: "TARGET_HORIZ", dataType: "number", headerText: "CF_BF_POLICY_H", visible: true, editable: true, width: 100, textAlignment: "near" },
      { name: "TARGET_BUKT_CD", dataType: "dropdown", headerText: "TARGET_BUKT_CD", visible: true, editable: true, width: 100, textAlignment: "center", useDropdown: true, lookupDisplay: true },
    ],
  },
  { name: "SALES_LV_CD", dataType: "dropdown", headerText: "SALES_LV_CD", visible: true, editable: true, width: 100, textAlignment: "center", useDropdown: true, lookupDisplay: true },
  { name: "ITEM_LV_CD", dataType: "dropdown", headerText: "ITEM_LV_CD", visible: true, editable: true, width: 100, textAlignment: "center", useDropdown: true, lookupDisplay: true },
  { name: "VAL_TP", dataType: "dropdown", headerText: "BF_VAL_TP", visible: true, editable: true, width: 100, textAlignment: "center", useDropdown: true, lookupDisplay: true },
  { name: "ATTR_01", dataType: "text", headerText: "ATTR_01", visible: false, editable: false, width: 100 },
  { name: "ATTR_02", dataType: "text", headerText: "ATTR_02", visible: false, editable: false, width: 100 },
  { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: 100, textAlignment: "center" },
  { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: 100, textAlignment: "center" },
  { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 100, textAlignment: "center" },
  { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 100, textAlignment: "center" },
];

let grid1ComboItem = [
  {
    type: "array",
    array: [
      { value: "QTY", label: "QTY" },
      { value: "AMT", label: "AMT" },
    ],
    name: "VAL_TP",
    valueName: "value",
    labelName: "label",
  },
];

const excelExportOptions = {
  lookupDisplay: false,
  // allColumns: true,
  separateRows: true,
  footer: "default",
  headerDepth: 2,
  importExceptFields: { 0: "id" },
};

function ControlBoardMaster(props) {
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [username] = useUserStore(state => [state.username])
  const [grid1, setGrid1] = useState(null);

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
      setOptions();
      //예측알고리즘
      gridComboLoad(grid1, {
        URL: "engine/dp/SRV_GET_SP_UI_DP_00_CONF_Q1",
        CODE_VALUE: "CD",
        CODE_LABEL: "CD_NM",
        COLUMN: "ENGINE_TP_CD",
        PROP: "lookupData",
        PARAM_KEY: ["SP_UI_DP_00_CONF_Q1_01", "SP_UI_DP_00_CONF_Q1_02", "SP_UI_DP_00_CONF_Q1_03"],
        PARAM_VALUE: ["BF_ENGINE_TP", "", ""],
        TRANSLANG_LABEL: true,
      });
      //입력버킷 콤보
      gridComboLoad(grid1, {
        URL: "engine/dp/SRV_GET_SP_UI_DP_00_CONF_Q1",
        CODE_VALUE: "CD",
        CODE_LABEL: "CD_NM",
        COLUMN: "INPUT_BUKT_CD",
        PROP: "lookupData",
        PARAM_KEY: ["SP_UI_DP_00_CONF_Q1_01", "SP_UI_DP_00_CONF_Q1_02", "SP_UI_DP_00_CONF_Q1_03"],
        PARAM_VALUE: ["BF_BUKT_TP", "", ""],
        TRANSLANG_LABEL: true,
      });
      //결과버킷 콤보
      gridComboLoad(grid1, {
        URL: "engine/dp/SRV_GET_SP_UI_DP_00_CONF_Q1",
        CODE_VALUE: "CD",
        CODE_LABEL: "CD_NM",
        COLUMN: "TARGET_BUKT_CD",
        PROP: "lookupData",
        PARAM_KEY: ["SP_UI_DP_00_CONF_Q1_01", "SP_UI_DP_00_CONF_Q1_02", "SP_UI_DP_00_CONF_Q1_03"],
        PARAM_VALUE: ["BF_BUKT_TP", "", ""],
        TRANSLANG_LABEL: true,
      });
      //판매레벨코드 콤보
      gridComboLoad(grid1, {
        URL: "engine/dp/SRV_GET_SP_UI_DP_00_LV_CD_Q1",
        CODE_VALUE: "CD",
        CODE_LABEL: "CD_NM",
        COLUMN: "SALES_LV_CD",
        PROP: "lookupData",
        PARAM_KEY: ["LV_TP", "ACCOUNT_TP", "LEAF_YN", "LV_LEAF_YN", "TYPE", "ACCOUNT_LV_YN", "PARENT_SEARCH", "NOW_LEVEL_SEARCH"],
        PARAM_VALUE: ["S", "", "", "", "", "Y", "", ""],
        TRANSLANG_LABEL: true,
      });
      //품목레벨코드 콤보
      gridComboLoad(grid1, {
        URL: "engine/dp/SRV_GET_SP_UI_DP_00_LV_CD_Q1",
        CODE_VALUE: "CD",
        CODE_LABEL: "CD_NM",
        COLUMN: "ITEM_LV_CD",
        PROP: "lookupData",
        PARAM_KEY: ["LV_TP", "ACCOUNT_TP", "LEAF_YN", "LV_LEAF_YN", "TYPE", "ACCOUNT_LV_YN", "PARENT_SEARCH", "NOW_LEVEL_SEARCH"],
        PARAM_VALUE: ["I", "", "", "", "", "", "", ""],
        TRANSLANG_LABEL: true,
      });
    }
  }, [grid1]);

  const [option1, setOption1] = useState([]);
  const [option2, setOption2] = useState([]);
  const [option3, setOption3] = useState([]);
  const [option4, setOption4] = useState([]);
  const [option5, setOption5] = useState([]);
  const [message, setMessage] = useState();

  const {
    handleSubmit,
    reset,
    control,
    getValues,
    setValue,
    watch,
    register,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: {
      actvyn: "Y",
      delYn: "N",
    },
  });

  const setOptions = () => {
    setVisibleProps(grid1, true, true, true);
    grid1.gridView.displayOptions.fitStyle = "fill";
    grid1.gridView.setFooters({ visible: false });
    grid1.dataProvider.setOptions({ restoreMode: "auto" });
    grid1.gridView.displayOptions.showChangeMarker = false;
    grid1.gridView.setEditOptions({
      insertable: true,
      appendable: true,
    });

    grid1.gridView.onGetEditValue = function (grid, index, editResult) {
      if (index.fieldName === "INPUT_HORIZ" || index.fieldName === "INPUT_BUKT_CD" || index.fieldName === "TARGET_HORIZ" || index.fieldName === "TARGET_BUKT_CD" || index.fieldName === "SALES_LV_CD" || index.fieldName === "ITEM_LV_CD" || index.fieldName === "VAL_TP") {
        grid1.gridView.commit(true);
        for (let i = 0; i < grid1.dataProvider.getRowCount(); i++) {
          grid.setValue(i, index.fieldName, editResult.value);
        }
      }
    };
  };

  useEffect(() => {
    if (grid1) {
      loadData();
    }
  }, [grid1]);

  function loadData() {
    let grid = grid1;
    grid.gridView.commit(true);

    let param = new URLSearchParams();
    param.append("timeout", 0);
    param.append("CURRENT_OPERATION_CALL_ID", "OPC_RST_CPT_01_LOAD");

    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_BF_15_Q1",
      data: param,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          grid.dataProvider.fillJsonData(res.data.RESULT_DATA);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  const deleteRow = (targetGrid) => {
    targetGrid.gridView.commit(true);

    let deleteRows = [];
    let createdDeleteRowIndex = [];
    targetGrid.gridView.getCheckedRows().forEach(function (indx) {
      if (!targetGrid.dataProvider.getAllStateRows().created.includes(indx)) {
        deleteRows.push(targetGrid.dataProvider.getJsonRow(indx));
      } else {
        createdDeleteRowIndex.push(indx);
      }
    });

    if (!deleteRows.length) {
      if (!createdDeleteRowIndex.length) {
        showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SELECT_DELETE"));
      } else {
        showMessage(transLangKey("DELETE"), transLangKey("MSG_DELETE"), function (answer) {
          if (answer) {
            targetGrid.dataProvider.removeRows(createdDeleteRowIndex);
          }
        });
      }
    } else {
      showMessage(transLangKey("DELETE"), transLangKey("MSG_DELETE"), function (answer) {
        if (answer) {
          let formData = new FormData();
          formData.append("USER_ID", username);
          formData.append("CHANGES", JSON.stringify(deleteRows));

          zAxios
            .post(baseURI() + "engine/dp/SRV_SET_SP_UI_BF_15_D1", formData, {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then(function (response) {
              if (response.status === gHttpStatus.SUCCESS) {
                targetGrid.dataProvider.removeRows(targetGrid.gridView.getCheckedRows());
              }
            })
            .catch(function (err) {
              console.log(err);
            })
            .then(function () {
              loadData();
            });
        }
      });
    }

    grid1.gridView.setRowStyleCallback(function (grid, item, fixed) {
      let type = grid.getValue(item.index, "TYPE");

      //default 일때 활성화 수정 불가
      if (type === "default" && grid1.dataProvider.getRowState(item.index) !== "created") {
        let ret = {};
        ret.styleName = "default-type-color";
        ret.editable = false;
        return ret;
      }
    });

    //추가된 행만 편집 가능하게, 조회된 행은 수정 불가
    grid1.gridView.onCurrentRowChanged = function (grid, oldRow, newRow) {
      let curr = grid.getCurrent();
      let rowState = newRow > -1 ? grid1.dataProvider.getRowState(newRow) : "";
      //그리드에 beginInsertRow(), beginAppendRow()로 행이 추가된 경우 || dataProvider에 새로 추가된 행인 경우
      let editable = (newRow == -1 && curr.itemIndex > -1) || rowState == "created";
      grid.setColumnProperty("TYPE", "editable", editable);
      grid.setColumnProperty("TYPE", "styleName", "editable-column");
      grid.setColumnProperty("FACTOR_CD", "editable", editable);
      grid.setColumnProperty("FACTOR_CD", "styleName", "editable-column");
    };

    //default 일때 활성화 수정 불가
    let column1 = grid1.gridView.columnByName("ACTV_YN");
    const f = function (grid, cell) {
      let ret = {};
      let type = grid1.dataProvider.getValue(cell.index.dataRow, "TYPE");

      if (type === "default" && grid1.dataProvider.getRowState(cell.index.dataRow) !== "created") {
        ret.renderer = { editable: false };
      }
      return ret;
    };
    column1.styleCallback = f;
  };

  function onDelete(targetGrid, deleteRows) {
    let formData = new FormData();
    formData.append("USER_ID", username);
    formData.append("checked", JSON.stringify(deleteRows));

    if (deleteRows.length > 0) {
      zAxios({
        method: "post",
        url: baseURI() + "engine/dp/SRV_SET_SP_UI_BF_15_D1",
        headers: { "content-type": "application/json" },
        data: formData,
      })
        .then(function (res) {
          let isSucess = res.data.RESULT_SUCCESS;
          if (isSucess) {
            let resultMSG = res.data.RESULT_DATA.IM_DATA.SP_UI_BF_15_D1_P_RT_MSG;
            showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
          } else {
            let resultMSG = res.data.RESULT_MESSAGE;
            showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
          }
          loadData();
          return res;
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  }

  const afterToLoad = (targetGrid) => {
    if (targetGrid.gridView.id === "grid1") {
      loadData();
    }
  };

  function saveData() {
    grid1.gridView.commit(true);
    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];
        changes = changes.concat(grid1.dataProvider.getAllStateRows().created, grid1.dataProvider.getAllStateRows().updated, grid1.dataProvider.getAllStateRows().deleted, grid1.dataProvider.getAllStateRows().createAndDeleted);

        changes.forEach(function (row) {
          changeRowData.push(grid1.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"), { close: false });
        } else {
          let formData = new FormData();
          formData.append("USER_ID", username);
          formData.append("CHANGES", JSON.stringify(changeRowData));

          zAxios
            .post(baseURI() + "engine/dp/SRV_SET_SP_UI_BF_15_S1", formData, {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then(function (response) {
              loadData();
            })
            .catch(function (e) {
              console.error(e);
            });
        }
      }
    });
  }

  /** 이벤트 핸들러 끝 */

  return (
    <ContentInner>
      {/* <ViewPath {...viewPathProps} submit={handleSubmit(onSubmit, onError)}></ViewPath> */}
      <SearchArea></SearchArea>
      <ButtonArea title={transLangKey("UI_BF_15")}>
        <LeftButtonArea>
          <ButtonGroup></ButtonGroup>
        </LeftButtonArea>
        <RightButtonArea>
          <ButtonGroup variant="outlined">
            <GridAddRowButton grid="grid1" type="icon"></GridAddRowButton>
            <GridDeleteRowButton grid="grid1" type="icon" onDelete={onDelete} />
            <GridSaveButton
              grid="grid1"
              type="icon"
              onClick={() => {
                saveData(grid1);
              }}
              onAfterSave={afterToLoad}
            />
          </ButtonGroup>
        </RightButtonArea>
      </ButtonArea>
      <ResultArea sizes={[100, 50]} direction={"vertical"}>
        <BaseGrid id="grid1" items={grid1Items} comboItem={grid1ComboItem}></BaseGrid>
      </ResultArea>
      <StatusArea show={true} message={message}>
        <GridCnt grid="grid1" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")}></GridCnt>
      </StatusArea>
    </ContentInner>
  );
}

export default ControlBoardMaster;
