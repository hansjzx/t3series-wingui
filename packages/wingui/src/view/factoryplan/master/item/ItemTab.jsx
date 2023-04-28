import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useLocation, useHistory } from "react-router-dom";
import { Box } from "@mui/material";
import {
  ButtonArea, ResultArea, LeftButtonArea, RightButtonArea, BaseGrid,
  CommonButton, GridExcelImportButton, GridExcelExportButton, GridDeleteRowButton, GridAddRowButton, GridSaveButton,
  useViewStore, zAxios, StatusArea, GridCnt
} from '@zionex/wingui-core/src/common/imports';
import { setColorPickerRenderer, transLangKey } from "@wingui";
import {
  getCodeEditor,
  setCellButtonRenderer,
  setEditableGrid,
  setCodeColumnStyle,
  fpCommonStyles
} from "../../common/common";

import ItemGroupPopup from "../../common/popup/ItemGroupPopup";
import ItemGroupMasterPopup from "./ItemGroupMasterPopup";

import '../../common/common.css';

const itemClassCodeEditor = getCodeEditor('FP_ITEM_CLASS_CD');
const itemGridFilters = ['itemCd', 'itemNm', 'itemClassCd', 'itemGroupCode'];

const itemGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 50, textAlignment: "center" },
  { name: "itemCd", dataType: "text", headerText: "FP_ITEM_CD", visible: true, editable: true, width: 150, textAlignment: "near", autoFilter: true,
    validRules: [{ criteria: "required"}]
  },
  { name: "itemNm", dataType: "text", headerText: "FP_ITEM_NM", visible: true, editable: true, width: 200, textAlignment: "near", autoFilter: true },
  { name: "descTxt", dataType: "text", headerText: "FP_DESC_TXT", visible: true, editable: true, width: 80, textAlignment: "near" },
  { name: "itemClassCd", dataType: "text", headerText: "FP_ITEM_CLASS_CD", visible: true, editable: true, width: 80, textAlignment: "center", defaultValue: "M", autoFilter: true,
    styleCallback: () => itemClassCodeEditor
  },
  { name: "itemUom", dataType: "text", headerText: "FP_ITEM_UOM", visible: true, editable: true, width: 80, textAlignment: "center" },
  { name: "priority", dataType: "number", headerText: "FP_PRIORITY", visible: true, editable: true, width: 80, positiveOnly: true, format: "#,##0" },
  { name: "displayColor", dataType: "text", headerText: "FP_DISPLAY_COLOR", visible: true, editable: true, width: 80, textAlignment: "center", defaultValue: "ff96c8" },
  { name: "sol", dataType: "datetime", headerText: "FP_SOL", visible: true, editable: true, width: 100, textAlignment: "center",
    format: "yyyy-MM-dd",
  },
  { name: "eol", dataType: "datetime", headerText: "FP_EOL", visible: true, editable: true, width: 100, textAlignment: "center",
    format: "yyyy-MM-dd",
  },

  { name: "itemGroupCode", dataType: "text", headerText: "FP_ITEM_GRP_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true,
    styleName: "editable-text-column",
    validRules: [{ criteria: "required"}]
  },
  { name: "itemGroupName", dataType: "text", headerText: "FP_ITEM_GRP_NM", visible: true, editable: false, width: 200, textAlignment: "near" },

  { name: "orderQty", dataType: "group", orientation: "horizontal", headerText: "FP_ORDER_QTY", textAlignment: "center",
    childs: [
      { name: "woSizeMin", dataType: "number", defaultValue: 0, headerText: "FP_WO_SIZE_MIN", visible: true, editable: true, width: 90, positiveOnly: true, format : "#,##0.0####" },
      { name: "woSizeMax", dataType: "number", defaultValue: 0, headerText: "FP_WO_SIZE_MAX", visible: true, editable: true, width: 90, positiveOnly: true, format : "#,##0.0####" },
      { name: "woSieMultiplr", dataType: "number", defaultValue: 0, headerText: "FP_WO_SIZE_MULTIPLR", visible: true, editable: true, width: 90, positiveOnly: true, format : "#,##0.0####" },
    ]
  },
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

function ItemTab(props, ref) {
  const location = useLocation();
  const history = useHistory();

  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const [itemGrid, setItemGrid] = useState(null);

  const [gridItemGroupPopup, setGridItemGroupPopup] = useState(false);
  const [itemGroupMstPopup, setItemGroupMstPopup] = useState(false);

  useEffect(() => {
    setItemGrid(getViewInfo(vom.active, 'itemGrid'))
  }, [viewData]);

  useEffect(() => {
    if (itemGrid) {
      setEditableGrid(itemGrid);
      setGridOptions(itemGrid.gridView);
      if (!location.state || location.state.paramType !== 'ITEM') {
        loadData();
      }
    }
  }, [itemGrid]);

  useEffect(() => {
    if (location.state !== undefined && location.state !== null && itemGrid) {
      if (location.state.paramType === 'ITEM') {
        loadData(location.state.paramCode);
        history.replace({ state: null });
      }
    }
  }, [location, itemGrid]);

  useImperativeHandle(ref, () => ({
    loadData(itemParam) {
      loadData(itemParam);
    }
  }));

  function setGridOptions(gridView) {
    if (gridView.id === 'itemGrid') {
      setCellButtonRenderer(gridView, 'itemGroupCode');
      setColorPickerRenderer(gridView, 'displayColor');

      (gridView.columnByName('itemCd')).styleCallback = setCodeColumnStyle;
      (gridView.columnByName('woSizeMin')).styleCallback = itemClassTypeStyleCallBack;
      (gridView.columnByName('woSizeMax')).styleCallback = itemClassTypeStyleCallBack;
      (gridView.columnByName('woSieMultiplr')).styleCallback = itemClassTypeStyleCallBack;

      gridView.onCellItemClicked = function (grid, index, clickData) {
        if (clickData.fieldName === 'itemGroupCode') {
          setGridItemGroupPopup(true);
        }
      };
    }
  }

  function itemClassTypeStyleCallBack(gridView, dataCell) {
    let style = {};
    let itemClassCd = gridView.getValue(dataCell.index.itemIndex, "itemClassCd");

    if (itemClassCd === 'M') {
      style.editable = false;
      style.styleName = 'number-column';
    } else {
      style.editable = true;
      style.styleName = 'editable-number-column';
    }

    return style;
  }

  function clearAllFilters(gridView) {
    if (gridView.id === 'itemGrid') {
      itemGridFilters.forEach(value => {
        gridView.activateAllColumnFilters(value, false);
      })
    }
  }

  function loadData(itemParam = '') {
    clearAllFilters(itemGrid.gridView);

    itemGrid.gridView.commit(true);
    itemGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    zAxios.get(baseURI() + 'factoryplan/master/item/items', {
      params: {
        'search': itemParam
      }
    })
    .then(function (res) {
      itemGrid.dataProvider.fillJsonData(res.data);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      itemGrid.gridView.hideToast();
      itemGrid.gridView.setAllCheck(false, false);
    });
  }

  function setItemGroupValues(values) {
    const gridView = itemGrid.gridView;
    const index = gridView.getCurrent().itemIndex;

    values["itemGroupCode"] = values["itemGrpCd"];
    values["itemGroupName"] = values["itemGrpNm"];

    gridView.setValues(index, values);
  }

  const afterToLoad = (targetGrid) => {
    if (targetGrid.gridView.id === 'itemGrid') {
      loadData();
    }
  }

  return (
    <Box sx={fpCommonStyles.tabInner}>
      <ItemGroupPopup open={gridItemGroupPopup} onClose={() => setGridItemGroupPopup(false)} confirm={setItemGroupValues} />
      <ItemGroupMasterPopup open={itemGroupMstPopup} onClose={() => setItemGroupMstPopup(false)} />
      <ButtonArea>
        <LeftButtonArea>
          <GridExcelExportButton grid="itemGrid" options={exportOptions} />
          {/*<GridExcelImportButton grid="itemGrid" />*/}
          <CommonButton type="text" onClick={() => { setItemGroupMstPopup(true) }}>{transLangKey("FP_ITEM_GROUP_MST")}</CommonButton>
        </LeftButtonArea>
        <RightButtonArea>
          <GridAddRowButton grid="itemGrid" />
          <GridDeleteRowButton grid="itemGrid" url="factoryplan/master/item/items/delete" onAfterDelete={afterToLoad} />
          <GridSaveButton grid="itemGrid" url="factoryplan/master/item/items" onAfterSave={afterToLoad} />
        </RightButtonArea>
      </ButtonArea>
      <ResultArea sizes={[100, 50]} direction={"vertical"}>
        <BaseGrid id="itemGrid" items={itemGridItems} className="white-skin" />
      </ResultArea>
      <StatusArea show={false} message={''}>
        <GridCnt grid="grid1" format={'{0} ' + transLangKey('CASES') + ' ' + transLangKey('MSG_0010')}></GridCnt>
      </StatusArea>      
    </Box>
  );
}

ItemTab = forwardRef(ItemTab);
export default ItemTab;
