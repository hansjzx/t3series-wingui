import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useLocation, useHistory } from "react-router-dom";
import { Box } from "@mui/material";
import {
  ButtonArea, ResultArea, LeftButtonArea, RightButtonArea, BaseGrid,
  GridExcelImportButton, GridExcelExportButton, GridDeleteRowButton, GridAddRowButton, GridSaveButton,
  useViewStore, zAxios, StatusArea, GridCnt
} from '@zionex/wingui-core/src/common/imports';
import {
  getCodeEditor,
  setCellButtonRenderer,
  setEditableGrid,
  setCodeColumnStyle,
  setGridComboList,
  fpCommonStyles
} from "../../common/common";
import { transLangKey } from "@wingui";

import StagePopup from "../../common/popup/StagePopup";
import ItemPopup from "../../common/popup/ItemPopup";

import '../../common/common.css';

const itemClassMCode = getCodeEditor('FP_ITEM_TYPE_M');
const itemClassICode = getCodeEditor('FP_ITEM_TYPE_I');
const itemClassPCode = getCodeEditor('FP_ITEM_TYPE_P');

const inventoryGridFilters = ['inventoryCd', 'inventoryNm', 'itemCode', 'itemName', "plantCd", "stageCode"];

const inventoryGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 50, textAlignment: "center" },
  { name: "inventoryCd", dataType: "text", headerText: "FP_INVENTORY_CD", visible: true, editable: true, width: 150, textAlignment: "near", autoFilter: true,
    validRules: [{ criteria: "required"}]
  },
  { name: "inventoryNm", dataType: "text", headerText: "FP_INVENTORY_NAME", visible: true, editable: true, width: 200, textAlignment: "near", autoFilter: true },
  { name: "itemCode", dataType: "text", headerText: "FP_ITEM_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true,
    validRules: [{ criteria: "required"}],
    styleName: "editable-text-column"},
  { name: "itemName", dataType: "text", headerText: "FP_ITEM_NM", visible: true, editable: false, width: 200, textAlignment: "near", autoFilter: true},
  { name: "itemClassCode", dataType: "text", headerText: "FP_ITEM_CLASS_CD", visible: false, editable: false, width: 80, textAlignment: "center"},
  { name: "itemTpCd", dataType: "text", headerText: "FP_ITEM_TP_CD", visible: true, editable: true, width: 80, textAlignment: "center", defaultValue: "M"},
  { name: "groupStage", dataType: "group", orientation: "horizontal", headerText: "FP_STAGE", expandable: true, expanded: false,
    childs: [
      { name: "stageCode", dataType: "text", headerText: "FP_STAGE_CD", visible: true, editable: false, width: 150, textAlignment: "near", groupShowMode: "always", autoFilter: true,
        styleName: "editable-text-column",
        validRules: [{ criteria: "required" }]
      },
      { name: "stageName", dataType: "text", headerText: "FP_STAGE_NM", visible: true, editable: false, width: 200, textAlignment: "near", groupShowMode: "expand" },
      { name: "plantCode", dataType: "text", headerText: "PLANT_CD", visible: true, editable: false, width: 150, textAlignment: "near", groupShowMode: "expand", autoFilter: true,
        validRules: [{ criteria: "required" }]
      },
      { name: "plantName", dataType: "text", headerText: "PLANT_NM", visible: true, editable: false, width: 200, textAlignment: "near", groupShowMode: "expand" }
    ]
  },
  { name: "groupStockAttribute", dataType: "group", orientation: "horizontal", headerText: "FP_STOCK_ATTRIBUTE", textAlignment: "center",
    childs: [
      { name: "invKeepingTm", dataType: "number", defaultValue: 0, headerText: "FP_INV_KEEPING_TM", visible: true, editable: true, width: 90, positiveOnly: true, format : "#,##0.0####" },
      { name: "invFenceTm", dataType: "number", defaultValue: 0, headerText: "FP_INV_FENCE_TM", visible: true, editable: true, width: 90, positiveOnly: true, format : "#,##0.0####" },
      { name: "timeUom", dataType: "text", headerText: "FP_TIME_UOM", visible: true, editable: true, width: 95, textAlignment: "center", defaultValue: "SECOND", useDropdown: true},
    ]
  },
  { name: "stockSplitCombination", dataType: "text", headerText: "FP_STOCK_SPLIT_COMBINATION", visible: true, editable: true, width: 80, textAlignment: "near" },
  {
    name: "groupAudit", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", expandable: true, expanded: false,
    childs: [
      { name: "updatedBy", dataType: "text", headerText: "FP_UPDATED_BY", visible: true, editable: false, width: 80, textAlignment: "center", groupShowMode: "expand" },
      { name: "updatedAt", dataType: "datetime", headerText: "FP_UPDATED_AT", visible: true, editable: false, width: 125, textAlignment: "center", groupShowMode: "always" },
      { name: "createdBy", dataType: "text", headerText: "FP_CREATED_BY", visible: true, editable: false, width: 80, textAlignment: "center", groupShowMode: "expand" },
      { name: "createdAt", dataType: "datetime", headerText: "FP_CREATED_AT", visible: true, editable: false, width: 125, textAlignment: "center", groupShowMode: "expand" },
    ]
  },
];

const exportOptions = {
  lookupDisplay: false,
  separateRows: true,
  headerDepth: 2,
  importExceptFields: {0: 'id'},
};

function InventoryTab(props, ref) {
  const location = useLocation();
  const history = useHistory();

  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const [inventoryGrid, setInventoryGrid] = useState(null);

  const [gridStagePopup, setGridStagePopup] = useState(false);
  const [gridItemPopup, setGridItemPopup] = useState(false);

  useEffect(() => {
    setInventoryGrid(getViewInfo(vom.active, 'inventoryGrid'))
  }, [viewData]);

  useEffect(() => {
    if (inventoryGrid) {
      setEditableGrid(inventoryGrid);
      setGridOptions(inventoryGrid.gridView);
      if (!location.state || location.state.paramType !== 'INVENTORY') {
        loadData();
      }
    }
  }, [inventoryGrid]);

  useEffect(() => {
    if (location.state !== undefined && location.state !== null && inventoryGrid) {
      if (location.state.paramType === 'INVENTORY') {
        loadData(location.state.paramCode);
        history.replace({ state: null });
      }
    }
  }, [location, inventoryGrid]);

  useImperativeHandle(ref, () => ({
    loadData(inventoryParam) {
      loadData(inventoryParam);
    }
  }));

  function setGridOptions(gridView) {
    if (gridView.id === 'inventoryGrid') {
      setCellButtonRenderer(gridView, 'stageCode');
      setCellButtonRenderer(gridView, 'itemCode');
      setGridComboList(gridView, 'timeUom', 'FP_TIME_UOM');

      (gridView.columnByName('inventoryCd')).styleCallback = setCodeColumnStyle;
      (gridView.columnByName('itemTpCd')).styleCallback = itemTypeStyleCallBack;
      (gridView.columnByName('invKeepingTm')).styleCallback = keepingTimeStyleCallBack;
      (gridView.columnByName('invFenceTm')).styleCallback = fenceTimeStyleCallBack;

      gridView.onCellItemClicked = function (grid, index, clickData) {
        if (clickData.fieldName === 'stageCode') {
          setGridStagePopup(true);
        } else if (clickData.fieldName === 'itemCode') {
          setGridItemPopup(true);
        }
      };
    }
  }

  function itemTypeStyleCallBack(gridView, dataCell) {
    const itemClassCode = gridView.getValue(dataCell.index.itemIndex, "itemClassCode");
    if (itemClassCode === 'M' || itemClassCode === transLangKey('FP_ITEM_CLASS_CD_M')) {
      return itemClassMCode;
    } else if (itemClassCode === 'I' || itemClassCode === transLangKey('FP_ITEM_CLASS_CD_I')) {
      return itemClassICode;
    } else if (itemClassCode === 'P' || itemClassCode === transLangKey('FP_ITEM_CLASS_CD_P')) {
      return itemClassPCode;
    }

    return itemClassMCode;
  }

  function keepingTimeStyleCallBack(gridView, dataCell) {
    let style = {};
    let itemTypeCd = gridView.getValue(dataCell.index.itemIndex, "itemTpCd");

    if (itemTypeCd === 'E') {
      style.editable = true;
      style.styleName = 'editable-number-column';
    } else {
      style.editable = false;
      style.styleName = 'number-column';
    }

    return style;
  }

  function fenceTimeStyleCallBack(gridView, dataCell) {
    let style = {};
    let itemTypeCd = gridView.getValue(dataCell.index.itemIndex, "itemTpCd");

    if (itemTypeCd === 'S' || itemTypeCd === 'R') {
      style.editable = true;
      style.styleName = 'editable-number-column';
    } else {
      style.editable = false;
      style.styleName = 'number-column';
    }

    return style;
  }

  function clearAllFilters(gridView) {
    if (gridView.id === 'inventoryGrid') {
      inventoryGridFilters.forEach(value => {
        gridView.activateAllColumnFilters(value, false);
      })
    }
  }

  function loadData(inventoryParam = '') {
    clearAllFilters(inventoryGrid.gridView);

    inventoryGrid.gridView.commit(true);
    inventoryGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    zAxios.get(baseURI() + 'factoryplan/master/item/inventories', {
      params: {
        'search': inventoryParam
      }
    })
    .then(function (res) {
      inventoryGrid.dataProvider.fillJsonData(res.data);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      inventoryGrid.gridView.hideToast();
      inventoryGrid.gridView.setAllCheck(false, false);
    });
  }

  function setStageValues(values) {
    const gridView = inventoryGrid.gridView;
    const index = gridView.getCurrent().itemIndex;

    values["stageCode"] = values["stageCd"];
    values["stageName"] = values["stageNm"];
    values["plantCode"] = values["plantCd"];
    values["plantName"] = values["plantNm"];

    gridView.setValues(index, values);
  }

  function setItemValues(values) {
    const gridView = inventoryGrid.gridView;
    const index = gridView.getCurrent().itemIndex;

    values["itemCode"] = values["itemCd"];
    values["itemName"] = values["itemNm"];
    values["itemClassCode"] = values["itemClassCd"];

    gridView.setValues(index, values);
  }

  const afterToLoad = (targetGrid) => {
    if (targetGrid.gridView.id === 'inventoryGrid') {
      loadData();
    }
  }

  return (
    <Box sx={fpCommonStyles.tabInner}>
      <StagePopup open={gridStagePopup} onClose={() => setGridStagePopup(false)} confirm={setStageValues} />
      <ItemPopup open={gridItemPopup} onClose={() => setGridItemPopup(false)} confirm={setItemValues} />
      <ButtonArea>
        <LeftButtonArea>
          <GridExcelExportButton grid="inventoryGrid" options={exportOptions} />
          {/*<GridExcelImportButton grid="inventoryGrid" />*/}
        </LeftButtonArea>
        <RightButtonArea>
          <GridAddRowButton grid="inventoryGrid" />
          <GridDeleteRowButton grid="inventoryGrid" url="factoryplan/master/item/inventories/delete" onAfterDelete={afterToLoad} />
          <GridSaveButton grid="inventoryGrid" url="factoryplan/master/item/inventories" onAfterSave={afterToLoad} />
        </RightButtonArea>
      </ButtonArea>
      <ResultArea sizes={[100, 50]} direction={"vertical"}>
        <BaseGrid id="inventoryGrid" items={inventoryGridItems} className="white-skin" />
      </ResultArea>
      <StatusArea show={false} message={''}>
        <GridCnt grid="grid1" format={'{0} ' + transLangKey('CASES') + ' ' + transLangKey('MSG_0010')}></GridCnt>
      </StatusArea>
  </Box>
  );
}

InventoryTab = forwardRef(InventoryTab);
export default InventoryTab;
