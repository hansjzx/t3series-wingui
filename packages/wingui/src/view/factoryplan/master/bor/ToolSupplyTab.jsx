import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useForm } from "react-hook-form";
import { Box } from "@mui/material";
import { BaseGrid, ButtonArea, ResultArea, LeftButtonArea, RightButtonArea, useViewStore, CommonButton, GridAddRowButton, zAxios } from '@zionex/wingui-core/src/common/imports';
import { fpCommonStyles, setEditableGrid, setNoneEditableGrid } from "../../common/common";
import { transLangKey, showMessage, Icon } from "@wingui";

import ToolSupplyTabChart from "./ToolSupplyTabChart";

import '../../common/common.css';

let dataRows = [];

const toolSupplyGridFilters = ['routeCode', 'routeName'];
const toolSupplyResourceGridFilters = [];

const toolSupplyResourceGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 50, textAlignment: "center" },
  { name: "resourceCd", dataType: "text", headerText: "FP_TOOL_RESOURCE_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true },
  { name: "resourceNm", dataType: "text", headerText: "FP_TOOL_RESOURCE_NM", visible: true, editable: false, width: 200, textAlignment: "near", autoFilter: true },
  { name: "descTxt", dataType: "text", headerText: "FP_DESC_TXT", visible: true, editable: false, width: 80, textAlignment: "near" },
  { name: "toolCnt", dataType: "number", defaultValue: 0, headerText: "FP_TOOL_CNT", visible: true, editable: false, width: 80 }
];

const toolSupplyGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 50, textAlignment: "center", },
  { name: "supplyTs", dataType: "datetime", headerText: "FP_SUPPLY_TS", visible: true, editable: true, width: 150, textAlignment: "center",
    format: "yyyy-MM-dd HH:mm:ss",
    validRules: [{ criteria: "required"}]
  },
  { name: "supplyCnt", dataType: "number", defaultValue: 0, headerText: "FP_SUPPLY_CNT", visible: false, editable: false, width: 80, positiveOnly: true, format : "#,##0" },
  { name: "toolResourceCode", dataType: "text", headerText: "FP_TOOL_RESOURCE_CD", visible: false, editable: false, width: 150, textAlignment: "near" },
  { name: "toolCnt", dataType: "number", defaultValue: 0, headerText: "FP_TOOL_CNT", visible: false, editable: false, width: 80, positiveOnly: true, format : "#,##0" },
  { name: "inoutType", dataType: "text", defaultValue:"IN", headerText: "FP_IN_OUT_TP", visible: true, editable: true, width: 80, textAlignment: "near", lookupDisplay: true, useDropdown: true,
    styleName: "editable-text-column-center"
  },
  { name: "changeCnt", dataType: "number", defaultValue: 1, headerText: "FP_CHANGE_QTY", visible: true, editable: true, width: 80, positiveOnly: true, format : "#,##0" },
  { name: "totalCnt", dataType: "number", defaultValue: 0, headerText: "FP_TOTAL_CNT", visible: true, editable: false, width: 80, positiveOnly: true, format : "#,##0" },

  { name: "updatedBy", dataType: "text", headerText: "FP_UPDATED_BY", visible: false, editable: false, width: 80, textAlignment: "center" },
  { name: "updatedAt", dataType: "datetime", headerText: "FP_UPDATED_AT", visible: false, editable: false, width: 125, textAlignment: "center" },
  { name: "createdBy", dataType: "text", headerText: "FP_CREATED_BY", visible: false, editable: false, width: 80, textAlignment: "center" },
  { name: "createdAt", dataType: "datetime", headerText: "FP_CREATED_AT", visible: false, editable: false, width: 125, textAlignment: "center" },
];


function ToolSupplyTab(props, ref) {
  const { control, getValues, setValue } = useForm({
    defaultValues: {
      toolResourceCode: '',
      toolCnt: 0
    }
  });

  const [toolSupplyDataSource, setToolSupplyDataSource] = useState([]);

  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const [toolSupplyResourceGrid, setToolSupplyResourceGrid] = useState(null);
  const [toolSupplyGrid, setToolSupplyGrid] = useState(null);

  useEffect(() => {
    setToolSupplyGrid(getViewInfo(vom.active, 'toolSupplyGrid'));
    setToolSupplyResourceGrid(getViewInfo(vom.active, 'toolSupplyResourceGrid'));
  }, [viewData]);

  useEffect(() => {
    if (toolSupplyResourceGrid) {
      setNoneEditableGrid(toolSupplyResourceGrid);
      setGridOptions(toolSupplyResourceGrid.gridView);
    }
  }, [toolSupplyResourceGrid]);

  useEffect(() => {
    if (toolSupplyGrid) {
      setEditableGrid(toolSupplyGrid);
      setGridOptions(toolSupplyGrid.gridView);

      loadToolSupplyResourceGrid();
    }
  }, [toolSupplyGrid]);

  useImperativeHandle(ref, () => ({
    loadData(resourceParam) {
      loadToolSupplyResourceGrid(resourceParam);
    }
  }));

  function setGridOptions(gridView) {
    if (gridView.id === 'toolSupplyResourceGrid') {

      gridView.onCellClicked = function (grid, clickData) {
        if (clickData.cellType !== 'gridEmpty') {
          toolSupplyResourceGridGridRowClick();
        }
      };

    } else if (gridView.id === 'toolSupplyGrid') {
      gridView.setColumnProperty('inoutType', 'lookupDisplay', true);
      const list = [{ value: 'IN', label: 'IN' }, { value: 'OUT', label: 'OUT'}]
      gridView.setColumnProperty('inoutType', 'lookupData', { value: 'value', label: 'label', list: list });
    }
  }

  function toolSupplyResourceGridGridRowClick() {
    const gridView = toolSupplyResourceGrid.gridView;
    const itemIndex = gridView.getCurrent().itemIndex;

    const toolResourceCode = gridView.getValue(itemIndex, 'resourceCd');

    setValue('toolResourceCode', toolResourceCode);
    setValue('toolCnt', gridView.getValue(itemIndex, 'toolCnt'));

    loadToolSupplyGrid();
  }

  function clearAllFilters(gridView) {
    if (gridView.id === 'toolSupplyResourceGrid') {
      toolSupplyResourceGridFilters.forEach(value => {
        gridView.activateAllColumnFilters(value, false);
      })
    } else if (gridView.id === 'toolSupplyGrid') {
      toolSupplyGridFilters.forEach(value => {
        gridView.activateAllColumnFilters(value, false);
      })
    }
  }

  function loadToolSupplyResourceGrid(resourceParam = '') {
    clearAllFilters(toolSupplyResourceGrid.gridView);

    toolSupplyResourceGrid.gridView.commit(true);
    toolSupplyResourceGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    toolSupplyGrid.dataProvider.clearRows();

    zAxios.get(baseURI() + 'factoryplan/master/bor/tools', {
      params: {
        'searchResource': resourceParam
      }
    })
    .then(function (res) {
      toolSupplyResourceGrid.dataProvider.fillJsonData(res.data);
      if (res.data.length > 0) {
        toolSupplyResourceGrid.gridView.setCurrent({ itemIndex: 0, column: 'resourceCode' }, true);
        toolSupplyResourceGridGridRowClick();
      }

    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      toolSupplyResourceGrid.gridView.hideToast();
    });
  }

  function loadToolSupplyGrid() {
    clearAllFilters(toolSupplyGrid.gridView);

    toolSupplyGrid.gridView.commit(true);
    toolSupplyGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    zAxios.get(baseURI() + 'factoryplan/master/bor/toolsupplies', {
      params: {
        'searchResource': getValues('toolResourceCode')
      }
    })
    .then(function (res) {
      toolSupplyGrid.dataProvider.fillJsonData(res.data);
      setToolSupplyDataSource(res.data);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      toolSupplyGrid.gridView.hideToast();
    });
  }

  function deleteToolSupplyGrid() {
    toolSupplyGrid.gridView.commit(true);

    let deleteRows = [];
    let createdDeleteRowIndex = [];
    toolSupplyGrid.gridView.getCheckedRows().forEach(function (indx) {
      if (!toolSupplyGrid.dataProvider.getAllStateRows().created.includes(indx)) {
        deleteRows.push(toolSupplyGrid.dataProvider.getJsonRow(indx));
      } else {
        createdDeleteRowIndex.push(indx);
      }
    });

    if (!deleteRows.length) {
      if (!createdDeleteRowIndex.length) {
        showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SELECT_DELETE'));
      } else {
        showMessage(transLangKey('DELETE'), transLangKey('MSG_DELETE'), function (answer) {
          if (answer) {
            toolSupplyGrid.dataProvider.removeRows(createdDeleteRowIndex);
          }
        });
      }
    } else {
      showMessage(transLangKey('DELETE'), transLangKey('MSG_DELETE'), function (answer) {
        if (answer) {
          if (validationCheck(true)) {
            toolSupplyGrid.gridView.showToast(progressSpinner + 'Deleting data...', true);

            let formData = new FormData();
            formData.append('changes', JSON.stringify(deleteRows));

            zAxios({
              method: 'post',
              url: baseURI() + 'factoryplan/master/bor/toolsupplies/delete',
              headers: { 'content-type': 'application/json' },
              data: formData
            })
            .then(function (response) {
              if (response.status === gHttpStatus.SUCCESS) {
                toolSupplyGrid.dataProvider.removeRows(toolSupplyGrid.gridView.getCheckedRows());
                saveToolSupplyGrid(true);
              }
            })
            .catch(function (err) {
              console.log(err);
            })
            .then(function () {
              toolSupplyGrid.gridView.hideToast();
            });
          } else {
            showMessage(transLangKey('FP_ERROR_INPUT'), transLangKey('FP_MSG_MINUS_INPUT'), { close: false });
          }
        }
      });
    }
  }

  function saveToolSupplyGrid(isDelete = false) {
    toolSupplyGrid.gridView.commit(true);

    const invalidCells = toolSupplyGrid.gridView.getInvalidCells();
    if (invalidCells) {
      showMessage(transLangKey('FP_VALIDATION_FAIL'), JSON.stringify(invalidCells), { close: false });
      return;
    }

    if (!validationCheck(false)) {
      showMessage(transLangKey('FP_ERROR_INPUT'), transLangKey('FP_MSG_MINUS_INPUT'), { close: false });
      return;
    }

    if (isDelete) {
      doSave();
    } else {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
        if (answer) {
          doSave();
        }
      });
    }
  }

  function doSave() {
    if (dataRows.length === 0) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'));
    } else {
      toolSupplyGrid.gridView.showToast(progressSpinner + 'Saving data...', true);

      let formData = new FormData();
      formData.append('changes', JSON.stringify(dataRows));

      zAxios({
        method: 'post',
        headers: {'content-type': 'application/json'},
        url: baseURI() + 'factoryplan/master/bor/toolsupplies',
        data: formData
      })
      .then(function (response) {
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
        toolSupplyGrid.gridView.hideToast();
        loadToolSupplyGrid();
      });
    }
  }

  function validationCheck(isDelete = false) {
    dataRows = [];
    dataRows = toolSupplyGrid.dataProvider.getJsonRows(0, -1);

    if (dataRows === undefined || dataRows.length <= 0) {
      return true;
    }

    if (isDelete) {
      let checkedRows = toolSupplyGrid.gridView.getCheckedRows();
      dataRows = dataRows.filter((value, index) => !checkedRows.includes(index));
    }

    dataRows.sort((a, b) => (a.supplyTs > b.supplyTs) ? 1 : -1);

    let supplyCnt = 0;
    for (let i = 0; i < dataRows.length; i++) {
      dataRows[i].toolResourceCode = getValues('toolResourceCode');
      dataRows[i].toolCnt = getValues('toolCnt');

      if (dataRows[i].inoutType === 'IN') {
        supplyCnt = dataRows[i].changeCnt;
      } else {
        supplyCnt = -(dataRows[i].changeCnt);
      }

      if (i === 0) {
        dataRows[i].totalCnt = supplyCnt + getValues('toolCnt');
        dataRows[i].supplyCnt = supplyCnt;
      } else {
        dataRows[i].supplyCnt = dataRows[i-1].supplyCnt + supplyCnt;
        dataRows[i].totalCnt = dataRows[i-1].totalCnt + supplyCnt;
      }

      if (dataRows[i].totalCnt < 0) {
        return false;
      }
    }

    return true;
  }

  return (
    <Box sx={fpCommonStyles.tabInner}>
      <ResultArea sizes={[50, 50]} direction={"horizontal"}>
        <Box sx={{ mt: '47px', mr: '5px' }}>
          <BaseGrid id="toolSupplyResourceGrid" items={toolSupplyResourceGridItems} className="white-skin" />
        </Box>
        <Box sx={{ ml: '5px' }}>
          <ResultArea sizes={[50, 50]} direction="vertical">
            <Box sx={{ mb: '5px', display: 'flex', flexDirection: 'column' }}>
              <ButtonArea>
                <LeftButtonArea />
                <RightButtonArea>
                  <GridAddRowButton grid="toolSupplyGrid" />
                  <CommonButton title={transLangKey("DELETE")} onClick={() => deleteToolSupplyGrid()}>
                    <Icon.Minus size={20} />
                  </CommonButton>
                  <CommonButton title={transLangKey("SAVE")} onClick={() => saveToolSupplyGrid()}>
                    <Icon.Save size={20} />
                  </CommonButton>
                </RightButtonArea>
              </ButtonArea>
              <Box sx={{ height: 1 }}>
                <BaseGrid id="toolSupplyGrid" items={toolSupplyGridItems} className="white-skin" />
              </Box>
            </Box>
            <Box sx={{ my: '5px' }}>
              <ToolSupplyTabChart dataSource={toolSupplyDataSource}/>
            </Box>
          </ResultArea>
        </Box>
      </ResultArea>
    </Box>
  );
}

ToolSupplyTab = forwardRef(ToolSupplyTab);
export default ToolSupplyTab;
