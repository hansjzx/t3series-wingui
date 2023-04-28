import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box, ButtonGroup } from '@mui/material';
import {
  ContentInner, SearchArea, ResultArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow, StatusArea, GridCnt,
  InputField, BaseGrid, GridAddRowButton, GridDeleteRowButton, GridSaveButton, useViewStore, zAxios, useStyles
} from "@zionex/wingui-core/src/common/imports";
import PopPreference from "./PopPreferenceOptions";

let grid1Items = [
  { name: "id", dataType: "text", headerText: "id", visible: false, editable: false },
  { name: "viewCd", dataType: "text", headerText: "UI_ID", visible: true, editable: false, width: "100", editableNew: true, },
  {
    name: "viewNm", dataType: "text", headerText: "UI_NM", visible: true, width: "100",
    displayCallback: function (grid, index, value) {
      return transLangKey(value);
    }
  },
  { name: "gridCd", dataType: "text", headerText: "GRID_ID", visible: true, editable: false, width: "100", editableNew: true, },
  { name: "gridDescrip", dataType: "text", headerText: "GRID_DESCRIP", visible: false, editable: false, width: "100", },
  { name: "gridDescripLangValue", dataType: "text", headerText: "GRID_DESCRIP", visible: true, editable: true, width: "250" },
  {
    name: "CROSS_GROUP", dataType: "group", orientation: "horizontal", headerText: "CROSSTAB_TP", headerVisible: true, hideChildHeaders: true,
    childs: [
      { name: "crosstabTp", dataType: "dropdown", visible: true, editable: true, width: 80, useDropdown: true, lookupDisplay: true },
      { name: "crosstabTpBt", dataType: "text", visible: true, editable: true, width: 20, button: "action", buttonVisibility: "always" },
    ]
  },
  { name: "autoCreateYn", dataType: "boolean", headerText: "AUTO_YN", visible: true, editable: true, width: "80", "headerCheckable": false },
]

let grid2Items = [
  { name: "id", dataType: "text", headerText: "VIEW_CD", visible: false },
  { name: "userPrefMstId", dataType: "text", headerText: "USER_PREF_MST_ID", visible: false },
  { name: "grpId", dataType: "text", headerText: "GRP_CD", visible: false },
  { name: "fldCd", dataType: "text", headerText: "COLUMN_ID", visible: true, editable: false, width: "150", editableNew: true, },
  { name: "fldApplyCd", dataType: "text", headerText: "COLUMN_APPLY_ID", visible: true, editable: true, width: "150" },
  { name: "fldApplyCdLang", dataType: "text", headerText: "COLUMN_APPLY_NM", visible: true, editable: false, width: "150", editableNew: true, lang: true },
  { name: "fldWidth", dataType: "number", headerText: "COLUMN_WIDTH", visible: true, editable: true, width: "100", },
  { name: "fldSeq", dataType: "number", headerText: "COLUMN_SEQ", visible: true, editable: true, width: "70" },
  { name: "fldActiveYn", dataType: "boolean", headerText: "COLUMN_ACTIVE_YN", visible: true, editable: true, width: "80" },
  { name: "applyYn", dataType: "boolean", headerText: "APPY_YN", visible: true, editable: true, width: "80" },
  { name: "referValue", dataType: "text", headerText: "REFER_VALUE", visible: false },
  { name: "dataKeyYn", dataType: "boolean", headerText: "DATA_KEY_YN", visible: true, width: "80" },
  { name: "crosstabYn", dataType: "boolean", headerText: "CROSSTAB_APPLY_YN", visible: true, editable: true, width: "80" },
  { name: "crosstabItemCd", dataType: "dropdown", headerText: "CROSSTAB_ITEM_CD", visible: true, editable: true, width: "120", useDropdown: true, lookupDisplay: true },
  { name: "categoryGroup", dataType: "text", headerText: "CATEGORY_GROUP", visible: true, editable: false, width: "100", editableNew: true },
  { name: "dimMeasureTp", dataType: "text", headerText: "DIM_MEASURE_TP", visible: false },
  { name: "summaryTp", dataType: "dropdown", headerText: "SUMMARY_TP", visible: true, width: "100", useDropdown: true, lookupDisplay: true },
  { name: "summaryYn", dataType: "boolean", headerText: "SUMMARY_YN", editable: true, visible: true, width: "80" },
  { name: "editMeasureYn", dataType: "boolean", headerText: "EDIT_MEASURE", visible: true, editable: false, width: "80" },
  { name: "editTargetYn", dataType: "boolean", headerText: "EDIT_TARGET", visible: true, editable: false, width: "80" },
]
function Preference(props) {
  const [prefMstId, setPrefMstId] = useState('');
  const classes = useStyles();
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [popupData, setPopupData] = useState({});
  const [gridCrossPopupOpen, setGridCrossPopupOpen] = useState(false);
  var [grid1, setGrid1] = useState(null);
  var [grid2, setGrid2] = useState(null);

  const [message, setMessage] = useState();
  const [option1, setOption1] = useState([]);
  const { handleSubmit, getValues, setValue, control, watch, formState: { errors }, clearErrors } = useForm({
    defaultValues: {
      uiId: "",
      uiNm: "",
    }
  });
  const globalButtons = [
    { name: "search", action: (e) => { loadDataGrid1() }, visible: true, disable: false }
  ]

  useEffect(() => {
    if (grid1) {
      setViewInfo(vom.active, 'globalButtons', globalButtons)
    }
  }, [grid1])

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, 'grid1');
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        if (grid1 != grdObj1)
          setGrid1(grdObj1);
      }
    }

    const grdObj2 = getViewInfo(vom.active, 'grid2');
    if (grdObj2) {
      if (grdObj2.dataProvider) {
        if (grid2 != grdObj2)
          setGrid2(grdObj2);
      }
    }
  }, [viewData]);

  useEffect(() => {
    if (grid1) {
      setOptionsGrid1();
    }
    if (grid2) {
      setOptionsGrid2();
    }
  }, [grid1, grid2]);

  useEffect(() => {
    loadSchCodeMap();
  }, []);

  const loadSchCodeMap = () => {
    let param = { 'include-default': "true" }

    zAxios({
      fromPopup: true,
      method: 'get',
      header: { 'content-type': 'application/json' },
      url: 'system/groups',
      params: param,
      waitOn: false
    }).then(function (res) {
      let options = [];
      res.data.map((entry, idx) => { options.push({ label: transLangKey(entry.grpNm), value: entry.id, name: entry.grpNm, id: entry.id }) })
      setOption1(options);
      if (options.length > 0) {
        setValue('groupId', options[0].value)
      }
    })
      .catch(function (err) {
        console.log(err);
      })
  }

  const loadGridMap = (gridNm, column, type) => {
    let grid = gridNm;
    let param = { 'group-cd': type };

    zAxios({
      fromPopup: true,
      method: 'get',
      header: { 'content-type': 'application/json' },
      url: 'system/common/code-name-maps',
      params: param,
      waitOn: false
    }).then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        let dataArr = [];
        res.data.map((entry, idx) => { dataArr.push({ label: transLangKey(entry.name), value: entry.code }) })

        grid.gridView.setColumnProperty(column, "lookupData", {
          value: "value",
          label: "label",
          list: dataArr
        });
      }
    }).catch(function (err) {
      console.log(err);
    })
  }

  const onSubmit = (data) => {
    loadDataGrid1(data);
  }

  const onError = (errors, e) => {
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  const setOptionsGrid1 = () => {
    setVisibleProps(grid1, true, true, true);
    grid1.gridView.onCurrentChanging = function (grid, oldIndex, newIndex) {
      if (oldIndex.dataRow != newIndex.dataRow && grid2.isUpdated()) {
        showMessage(transLangKey('MSG_CONFIRM'), '변경된 데이타가 있습니다. 저장하지 않고 진행하시겠습니까?', function (answer) {
          if (answer) {
            grid2.dataProvider.clearRowStates(false, false)
            grid.setCurrent(newIndex)
          }
        })
        return false;
      }
      else
        return true;
    }
    grid1.gridView.onCellButtonClicked = function (grid, itemIndex, column) {
      const type = grid1.gridView.getValue(itemIndex.dataRow, "crosstabTp");

      if (column.fieldName === "crosstabTpBt" && type !== null) {
        setPopupData(grid1.gridView.getValues(grid1.gridView.getCurrent().dataRow));
        setGridCrossPopupOpen(true);
      }
    }

    grid1.gridView.onCellClicked = function (grid, clickData) {
      let id = grid1.dataProvider.getValue(clickData.dataRow, 'id')
      loadDataGrid2(id);
      setPrefMstId(id)
    }

    loadGridMap(grid1, "crosstabTp", "PIVOT_TP");
  }
  const setOptionsGrid2 = () => {
    setVisibleProps(grid2, true, true, true);
    loadGridMap(grid2, "crosstabItemCd", "CROSSTAB_ITEM");
    loadGridMap(grid2, "summaryTp", "SUMMARY_TP");
  }

  const initGrid2 = () => {
    grid2.dataProvider.clearRows();
  }

  useEffect(() => {
    if (grid2) {
      let id = grid1.gridView.getValue(grid1.gridView.getCurrent().dataRow, "id");

      if (id !== undefined && id !== null) {
        loadDataGrid2(prefMstId);
      } else {
        if (grid2)
          grid2.dataProvider.fillJsonData([]);
      }
    }
  }, [watch('groupId')]);

  const loadDataGrid1 = () => {
    let grid = grid1;
    grid.gridView.commit(true);
    let param = {
      params: {
        'view-cd': getValues("uiId"),
        'view-nm': getValues("uiNm")
      },
      waitOn: false
    }
    return grid.loadData('system/users/preference-masters', param)
  }

  const loadDataGrid2 = (id) => {
    if (!grid2) {
      return;
    }

    let grid = grid2;
    grid.gridView.commit(true);
    let param = {
      params: {
        'pref-mst-id': id,
        'group-id': getValues("groupId")
      },
      waitOn: false
    }
    return grid.loadData('system/users/preference-details', param)
  }
  function insertRow(gridObject) {
    if (gridObject.gridView.id === 'grid2') {
      grid1.gridView.commit(true);
      if (!grid1.gridView.getCurrent() || grid1.gridView.getCurrent().itemIndex < 0) {
        showMessage(transLangKey('WARNING'), "화면이 선택되어야 합니다.");
        return;
      }
      else {
        let id = grid1.gridView.getValue(grid1.gridView.getCurrent().itemIndex, 'id')
        if (!id) {
          showMessage(transLangKey('WARNING'), "화면이 먼저 저장이 되어야 합니다.");
          return;
        }
      }
    }

    if (gridObject.dataProvider.getRowCount() > 0) {
      gridObject.gridView.beginInsertRow(gridObject.gridView.getCurrent().dataRow + 1);
    } else {
      gridObject.gridView.beginAppendRow();
    }
    gridObject.gridView.showEditor();
    gridObject.gridView.setFocus();
    gridObject.gridView.commit(true);
  }

  const onBeforeDelete = (targetGrid) => {
    targetGrid.gridView.commit(true);
    if (targetGrid.gridId === 'grid1') {
      if (targetGrid.gridView.getCheckedRows().length === targetGrid.dataProvider.getRowCount()) {
        //적어도 하나 이상의 공통코드는 존재해야 합니다.
        showMessage(transLangKey('DELETE'), transLangKey('최소 하나 이상의 사용자 그룹은 존재해야 합니다.'), { close: false })
        return false;
      }
    }
    return true;
  }

  //Promise를 리턴해야 한다.
  const onDelete = (targetGrid, deleteRows) => {
    if (deleteRows.length > 0) {
      if (targetGrid.gridView.id === 'grid1') {
        return zAxios({
          method: 'post',
          url: baseURI() + 'system/users/preference-masters/delete',
          headers: { 'content-type': 'application/json' },
          data: deleteRows
        })
      } else if (targetGrid.gridView.id === 'grid2') {
        zAxios({
          method: 'post',
          url: baseURI() + 'system/users/preference-details/delete',
          headers: { 'content-type': 'application/json' },
          data: deleteRows
        })
      }
    }
  }

  function onAfterDelete(targetGrid) {
    if (targetGrid.gridView.id === 'grid1') {
      loadDataGrid1();
      initGrid2();
    }
  }

  const saveData = (targetGrid) => {
    targetGrid.gridView.commit(true);
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changes = [];
        changes = changes.concat(
          targetGrid.dataProvider.getAllStateRows().created,
          targetGrid.dataProvider.getAllStateRows().updated,
          targetGrid.dataProvider.getAllStateRows().deleted,
          targetGrid.dataProvider.getAllStateRows().createAndDeleted
        );

        let changeRowData = [];
        changes.forEach(function (row) {
          changeRowData.push(targetGrid.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          zAxios({
            method: 'post',
            headers: { 'content-type': 'application/json' },
            url: baseURI() + 'system/users/preference-masters',
            data: changeRowData
          }).then(function (response) { })
            .catch(function (err) {
              console.log(err);
            })
            .then(function () {
              loadDataGrid1();
            });
        }
      }
    });
  }
  const saveGrid2Data = (targetGrid) => {
    targetGrid.gridView.commit(true);
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changes = [];
        changes = changes.concat(
          targetGrid.dataProvider.getAllStateRows().created,
          targetGrid.dataProvider.getAllStateRows().updated,
          targetGrid.dataProvider.getAllStateRows().deleted,
          targetGrid.dataProvider.getAllStateRows().createAndDeleted
        );
        let changeRowData = [];
        changes.forEach(function (row) {
          let id = grid1.gridView.getValue(grid1.gridView.getCurrent().dataRow, "id");
          let data = targetGrid.dataProvider.getJsonRow(row);
          data.userPrefMstId = id;
          data.grpId = getValues("groupId");
          changeRowData.push(data);
        });
        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          zAxios({
            method: 'post',
            headers: { 'content-type': 'application/json' },
            url: baseURI() + 'system/users/preference-details',
            data: changeRowData
          })
            .then(function (response) { })
            .catch(function (err) {
              console.log(err);
            })
            .then(function () {
              loadDataGrid2(prefMstId);
            });
        }
      }
    });
  }
  return (
    <ContentInner>
      <SearchArea>
        <SearchRow>
          <InputField name="uiId" label={transLangKey("UI_ID")} control={control} />
          <InputField name="uiNm" label={transLangKey("UI_NM")} control={control} />
        </SearchRow>
      </SearchArea>
      <ResultArea sizes={[50, 50]} direction={"vertical"}>
        <Box className={classes.resultAreaBox}>
          <ButtonArea>
            <LeftButtonArea></LeftButtonArea>
            <RightButtonArea>
              <GridAddRowButton onClick={() => { insertRow(grid1) }}>{transLangKey("ADD")}</GridAddRowButton>
              <GridDeleteRowButton grid="grid1" onBeforeDelete={onBeforeDelete} onDelete={onDelete} onAfterDelete={onAfterDelete}></GridDeleteRowButton>
              <GridSaveButton title={transLangKey("SAVE")} onClick={() => { saveData(grid1) }}></GridSaveButton>
            </RightButtonArea>
          </ButtonArea>
          <Box style={{ height: "calc(100% - 53px)" }}>
            <BaseGrid id="grid1" items={grid1Items}></BaseGrid>
          </Box>
        </Box>
        <Box className={classes.resultAreaBox}>
          <ButtonArea>
            <LeftButtonArea>
              <InputField name="groupId" inputType="labelText" variant="standard" label={transLangKey("USER_GRP")} control={control} options={option1} type="select" style={{ width: "180px" }} labelStyle={{ width: '90px' }} wrapStyle={{ borderBottom: 'none', }} />
            </LeftButtonArea>
            <RightButtonArea>
              <GridAddRowButton onClick={() => { insertRow(grid2) }}>{transLangKey("ADD")}</GridAddRowButton>
              <GridDeleteRowButton grid="grid2" onBeforeDelete={onBeforeDelete} onDelete={onDelete} onAfterDelete={onAfterDelete}></GridDeleteRowButton>
              <GridSaveButton title={transLangKey("SAVE")} onClick={() => { saveGrid2Data(grid2) }}></GridSaveButton>
            </RightButtonArea>
          </ButtonArea>
          <Box style={{ height: "calc(100% - 53px)" }}>
            <BaseGrid id="grid2" items={grid2Items}></BaseGrid>
          </Box>
        </Box>
      </ResultArea>
      <StatusArea show={false} message={message}>
        <GridCnt grid="grid2" format={'{0} 건 조회되었습니다.'}></GridCnt>
      </StatusArea>
      {gridCrossPopupOpen && (<PopPreference open={gridCrossPopupOpen} onClose={() => setGridCrossPopupOpen(false)} data={popupData} ></PopPreference>)}
    </ContentInner>
  )
}
export default Preference;