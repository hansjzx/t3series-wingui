import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Box } from "@mui/material";
import { BaseGrid, ButtonArea, ResultArea, LeftButtonArea, RightButtonArea, CommonButton, GridDeleteRowButton, GridSaveButton, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';
import { fpCommonStyles, setEditableGrid } from "../../common/common";
import { transLangKey, showMessage } from "@wingui";

import '../../common/common.css';

const toolUseGridFilters = ['routeCode', 'routeName'];
const toolResourceGridFilters = ['resourceCode', 'resourceName'];

const toolUseGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 50, textAlignment: "center", },
  { name: "routeCode", dataType: "text", headerText: "FP_ROUTE_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true,
    mergeRule: { criteria: "value"}
  },
  { name: "routeName", dataType: "text", headerText: "FP_ROUTE_NM", visible: true, editable: false, width: 200, textAlignment: "near", autoFilter: true,
    mergeRule: { criteria: "value"}
  },
  { name: "borSetCode", dataType: "text", headerText: "FP_BOR_SET_CD", visible: true, editable: false, width: 150, textAlignment: "near",
    mergeRule: { criteria: "value"}
  },
  { name: "borSetMstDescTxt", dataType: "text", headerText: "FP_DESC_TXT", visible: true, editable: false, width: 80, textAlignment: "near" },
  { name: "resourceCode", dataType: "text", headerText: "FP_RESOURCE_CD", visible: true, editable: false, width: 150, textAlignment: "near" },
  { name: "resourceName", dataType: "text", headerText: "FP_RESOURCE_NM", visible: true, editable: false, width: 200, textAlignment: "near" },
  { name: "usableCnt", dataType: "number", defaultValue: 0, headerText: "FP_TOOL_USABLE_CNT", visible: true, editable: true, width: 80, positiveOnly: true, format : "#,##0" },
  { name: "isTool", dataType: "boolean", headerText: "FP_IS_TOOL", visible: false, editable: false, width: 95, textAlignment: "center", defaultValue: false },
  { name: "toolCnt", dataType: "number", defaultValue: 0, headerText: "FP_TOOL_CNT", visible: false, editable: false, width: 80, positiveOnly: true, format : "#,##0" },
];


const toolResourceGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 50, textAlignment: "center" },
  { name: "resourceCd", dataType: "text", headerText: "FP_TOOL_RESOURCE_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true },
  { name: "resourceNm", dataType: "text", headerText: "FP_TOOL_RESOURCE_NM", visible: true, editable: false, width: 200, textAlignment: "near", autoFilter: true },
  { name: "descTxt", dataType: "text", headerText: "FP_DESC_TXT", visible: true, editable: false, width: 80, textAlignment: "near" },
  { name: "toolCnt", dataType: "number", defaultValue: 0, headerText: "FP_TOOL_CNT", visible: true, editable: false, width: 80 },
];


function ToolSupplyTab(props, ref) {
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const [toolUseGrid, setToolUseGrid] = useState(null);
  const [toolResourceGrid, setToolResourceGrid] = useState(null);


  useEffect(() => {
    setToolUseGrid(getViewInfo(vom.active, 'toolUseGrid'));
    setToolResourceGrid(getViewInfo(vom.active, 'toolResourceGrid'));
  }, [viewData]);

  useEffect(() => {
    if (toolUseGrid) {
      setEditableGrid(toolUseGrid);
      setGridOptions(toolUseGrid.gridView);

      loadToolUseGrid();
    }
  }, [toolUseGrid]);

  useEffect(() => {
    if (toolResourceGrid) {
      setEditableGrid(toolResourceGrid);
      setGridOptions(toolResourceGrid.gridView);

      loadToolResourceGrid();
    }
  }, [toolResourceGrid]);

  useImperativeHandle(ref, () => ({
    loadData(routeParam, resourceParam) {
      loadToolUseGrid(routeParam, resourceParam);
    }
  }));

  function setGridOptions(gridView) {
    if (gridView.id === 'toolUseGrid') {
      gridView.setStateBar({ visible: false });

      (gridView.columnByName('usableCnt')).styleCallback = usableCountStyleCallBack;

      gridView.setCheckableExpression("value['isTool']");
      gridView.onCellClicked = function (grid, clickData) {
        setToolResourceGridCheckBox();
      }

      gridView.onValidateColumn = function (grid, column, inserting, value, itemIndex, dtaRow) {
        let error = {};

        if (column.fieldName === 'usableCnt') {
          if (value > gridView.getValue(itemIndex, 'toolCnt')) {
            error.level = 'warning';
            error.message = transLangKey('FP_MSG_TOOL_CNT');
          }
        }
        return error;
      };
    } else if (gridView.id === 'toolResourceGrid') {
      gridView.setStateBar({ visible: false });
    }
  }

  function usableCountStyleCallBack (grid, dataCell) {
    let style = {};
    let isTool = grid.getValue(dataCell.index.itemIndex, "isTool");

    if (isTool) {
      style.editable = true;
      style.styleName = 'editable-number-column';
    } else {
      style.editable = false;
      style.styleName = 'number-column';
    }

    return style;
  }

  function setToolResourceGridCheckBox() {
    let borSetResources = [];

    let itemIndex = toolUseGrid.gridView.getCurrent().itemIndex;

    const borSetCode = toolUseGrid.gridView.getValue(itemIndex, 'borSetCode');

    for (let i = 0; i < toolUseGrid.dataProvider.getRowCount(); i++) {
      if (toolUseGrid.gridView.getValue(i, 'borSetCode') === borSetCode) {
        borSetResources.push(toolUseGrid.gridView.getValue(i, 'resourceCode'));
      }
    }

    if (borSetResources !== undefined && borSetResources.length > 0) {
      for (let i = 0; i < toolResourceGrid.dataProvider.getRowCount(); i++) {
        let checkable = true;
        if (borSetResources.includes(toolResourceGrid.gridView.getValue(i, 'resourceCd'))) {
          checkable = false;
        }

        toolResourceGrid.gridView.checkRow(i,false);
        toolResourceGrid.gridView.setCheckable(i, checkable);
      }
    } else {
      for (let i = 0; i < toolResourceGrid.dataProvider.getRowCount(); i++) {
        toolResourceGrid.gridView.checkRow(i,false);
        toolResourceGrid.gridView.setCheckable(i, true);
      }
    }
  }

  function clearAllFilters(gridView) {
    if (gridView.id === 'toolUseGrid') {
      toolUseGridFilters.forEach(value => {
        gridView.activateAllColumnFilters(value, false);
      });
    } else if (gridView.id === 'toolResourceGrid') {
      toolResourceGridFilters.forEach(value => {
        gridView.activateAllColumnFilters(value, false);
      });
    }
  }

  function loadToolUseGrid(routeParam = '', resourceParam = '') {
    clearAllFilters(toolUseGrid.gridView);

    toolUseGrid.gridView.commit(true);
    toolUseGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    toolResourceGrid.dataProvider.clearRows();

    zAxios.get(baseURI() + 'factoryplan/master/bor/borsettools', {
      params: {
        'searchRoute': routeParam,
        'searchResource': resourceParam
      }
    })
    .then(function (res) {
      toolUseGrid.dataProvider.fillJsonData(res.data);

      if (res.data.length > 0) {
        toolUseGrid.gridView.setCurrent({ itemIndex: 0, column: 'resourceCode' }, true);
      }
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      toolUseGrid.gridView.hideToast();
      toolUseGrid.gridView.setAllCheck(false, false);
    });
  }

  function loadToolResourceGrid() {
    clearAllFilters(toolResourceGrid.gridView);

    toolResourceGrid.gridView.commit(true);
    toolResourceGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    zAxios.get(baseURI() + 'factoryplan/master/bor/tools', {
      params: {
        'searchResource': ''
      }
    })
    .then(function (res) {
      toolResourceGrid.dataProvider.fillJsonData(res.data);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      toolResourceGrid.gridView.hideToast();
    });
  }

  function addToolUseGrid() {
    let currentRow = toolUseGrid.gridView.getCurrent().itemIndex;

    if (currentRow < 0) {
      showMessage(transLangKey('FP_ERROR_ROW_SELECT'), transLangKey('FP_MSG_RESOURCE_SET_ROW_SELECT'), { close: false });
      return;
    }

    let changeRowData = [];

    toolResourceGrid.gridView.getCheckedRows().forEach(function (index) {
      changeRowData.push(toolResourceGrid.dataProvider.getJsonRow(index));
    });

    if (changeRowData.length <= 0) {
      showMessage(transLangKey('FP_ERROR_ROW_SELECT'), transLangKey('FP_MSG_TOOL_RESOURCE_ROW_SELECT'), { close: false });
      return;
    }

    for (let i = 0; i < changeRowData.length; i++) {
      let values = {};
      values.id = '';
      values.routeCode = toolUseGrid.gridView.getValue(currentRow, 'routeCode');
      values.routeName = toolUseGrid.gridView.getValue(currentRow, 'routeName');
      values.borSetCode = toolUseGrid.gridView.getValue(currentRow, 'borSetCode');
      values.borSetMstDescTxt = toolUseGrid.gridView.getValue(currentRow, 'borSetMstDescTxt');
      values.resourceCode = changeRowData[i].resourceCd;
      values.resourceName = changeRowData[i].resourceNm;
      values.isTool = true;
      values.usableCnt = 1;
      values.toolCnt = changeRowData[i].toolCnt;

      toolUseGrid.dataProvider.insertRow(currentRow + i + 1, values);
    }

    setToolResourceGridCheckBox();
  }

  const afterToLoad = (targetGrid) => {
    if (targetGrid.gridView.id === 'borSetGird') {
      loadToolUseGrid();
    }
  }

  return (
    <Box sx={{ ...fpCommonStyles.tabInner, '& > div': { marginTop: '0 !important', paddingTop: '3px' } }}>
      <ResultArea sizes={[100, 50]} direction={"horizontal"}>
        <Box sx={{ display: 'flex', flexDirection: 'column', mr: '5px' }}>
          <ButtonArea>
            <LeftButtonArea />
            <RightButtonArea>
              <GridDeleteRowButton grid="toolUseGrid" url="factoryplan/master/bor/borsettools/delete" onAfterDelete={afterToLoad} />
              <GridSaveButton grid="toolUseGrid" url="factoryplan/master/bor/borsettools" onAfterSave={afterToLoad} />            
            </RightButtonArea>
          </ButtonArea>
          <BaseGrid id="toolUseGrid" items={toolUseGridItems} className="white-skin" />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', ml: '5px' }} className="tab-inner">
          <ButtonArea>
            <LeftButtonArea>
              <CommonButton type="text" onClick={addToolUseGrid}>{transLangKey("FP_ADD_TOOL_RESOURCE")}<Icon.ArrowLeft size={20} /></CommonButton>
            </LeftButtonArea>
            <RightButtonArea>
              <CommonButton type="text" onClick={loadToolResourceGrid}>{transLangKey("SEARCH")}</CommonButton>
            </RightButtonArea>
          </ButtonArea>
          <BaseGrid id="toolResourceGrid" items={toolResourceGridItems} className="white-skin" />
        </Box>
      </ResultArea>
    </Box>
  );
}

ToolSupplyTab = forwardRef(ToolSupplyTab);
export default ToolSupplyTab;
