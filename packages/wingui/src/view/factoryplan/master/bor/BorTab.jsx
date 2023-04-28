import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useLocation, useHistory } from "react-router-dom";
import { Box } from "@mui/material";
import {
  ButtonArea, ResultArea, LeftButtonArea, RightButtonArea, BaseGrid,
  GridExcelImportButton, GridExcelExportButton, GridDeleteRowButton, GridAddRowButton, GridSaveButton,
  useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';
import {
  getCodeEditor,
  setCellButtonRenderer,
  setEditableGrid,
  setCodeColumnStyle,
  setGridComboList,
  fpCommonStyles
} from "../../common/common";

import RoutePopup from "../../common/popup/RoutePopup";
import ResourcePopup from "../../common/popup/ResourcePopup";

import '../../common/common.css';

const divideTpCodeEditor = getCodeEditor('FP_DIVIDE_TP_CD');
const processTimeTpCodeEditor = getCodeEditor('FP_PROCESS_TIME_TYPE');

const borGridFilters = ['itemCode', 'itemName', 'itemClassCode', 'inventoryCode', 'inventoryName', "routeCode", 'routeName', 'resourceCode', 'resourceName'];

const borGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 50, textAlignment: "center" },
  {
    name: "groupCode", dataType: "group", orientation: "horizontal", headerText: "FP_ITEM_DETAIL", expandable: true, expanded: false,
    childs: [
      { name: "itemCode", dataType: "text", headerText: "FP_ITEM_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true, groupShowMode: "expand",
        mergeRule: { criteria: "value"}
      },
      { name: "itemName", dataType: "text", headerText: "FP_ITEM_NM", visible: true, editable: false, width: 200, textAlignment: "near", autoFilter: true, groupShowMode: "expand",
        mergeRule: { criteria: "value"}
      },
      { name: "itemClassCode", dataType: "text", headerText: "FP_ITEM_CLASS_CD", visible: true, editable: false, width: 80, textAlignment: "center", autoFilter: true, groupShowMode: "expand", lookupDisplay: true,
        mergeRule: { criteria: "value"}
      },
      { name: "inventoryCode", dataType: "text", headerText: "FP_INVENTORY_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true, groupShowMode: "expand",
        mergeRule: { criteria: "value"}
      },
      { name: "inventoryName", dataType: "text", headerText: "FP_INVENTORY_NAME", visible: true, editable: false, width: 200, textAlignment: "near", autoFilter: true, groupShowMode: "expand",
        mergeRule: { criteria: "value"}
      },
      { name: "routeCode", dataType: "text", headerText: "FP_ROUTE_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true, groupShowMode: "always",
        validRules: [{ criteria: "required"}]
      },
      { name: "routeName", dataType: "text", headerText: "FP_ROUTE_NM", visible: true, editable: false, width: 200, textAlignment: "near", autoFilter: true, groupShowMode: "always" },
    ]
  },

  { name: "resourceCode", dataType: "text", headerText: "FP_RESOURCE_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true,
    validRules: [{ criteria: "required"}]
  },
  { name: "resourceName", dataType: "text", headerText: "FP_RESOURCE_NM", visible: true, editable: false, width: 200, textAlignment: "near", autoFilter: true },
  { name: "descTxt", dataType: "text", headerText: "FP_DESC_TXT", visible: true, editable: true, width: 80, textAlignment: "near" },
  { name: "altResourcePriority", dataType: "number", defaultValue: 1, headerText: "FP_ALT_RESOURCE_PRIORITY", visible: true, editable: true, width: 80, positiveOnly: true, format : "#,##0" },
  { name: "timeUom", dataType: "text", headerText: "FP_TIME_UOM", visible: true, editable: true, width: 95, textAlignment: "center", defaultValue: "SECOND", useDropdown: true},
  { name: "queueTm", dataType: "number", defaultValue: 0, headerText: "FP_QUEUE_TM", visible: true, editable: true, width: 90, positiveOnly: true, format : "#,##0.0####" },
  { name: "setupTm", dataType: "number", defaultValue: 0, headerText: "FP_SETUP_TM", visible: true, editable: true, width: 90, positiveOnly: true, format : "#,##0.0####" },
  { name: "processTm", dataType: "number", defaultValue: 0, headerText: "FP_PROCESS_TM", visible: true, editable: true, width: 90, positiveOnly: true, format : "#,##0.0####" },
  { name: "waitTm", dataType: "number", defaultValue: 0, headerText: "FP_WAIT_TM", visible: true, editable: true, width: 90, positiveOnly: true, format : "#,##0.0####" },
  { name: "moveTm", dataType: "number", defaultValue: 0, headerText: "FP_MOVE_TM", visible: true, editable: true, width: 90, positiveOnly: true, format : "#,##0.0####" },

  {
    name: "lotSize", dataType: "group", orientation: "horizontal", headerText: "FP_LOT_SIZE", textAlignment: "center",
    childs: [
      { name: "lotSizeMin", dataType: "number", defaultValue: 0, headerText: "FP_LOT_SIZE_MIN", visible: true, editable: true, width: 90, positiveOnly: true, format : "#,##0.0####" },
      { name: "lotSizeMax", dataType: "number", defaultValue: 0, headerText: "FP_LOT_SIZE_MAX", visible: true, editable: true, width: 90, positiveOnly: true, format : "#,##0.0####" },
      { name: "lotSizeMultiplr", dataType: "number", defaultValue: 0, headerText: "FP_LOT_SIZE_MULTIPLR", visible: true, editable: true, width: 90, positiveOnly: true, format : "#,##0.0####" }
    ]
  },

  { name: "efficiency", dataType: "number", defaultValue: 1, headerText: "FP_EFFICIENCY", visible: true, editable: true, width: 90, positiveOnly: true, format : "#,##0.0####" },
  { name: "processTmTpCd", dataType: "text", headerText: "FP_PROCESS_TM_TP_CD", visible: true, editable: true, width: 80, textAlignment: "center", defaultValue: "N",
    validRules: [{ criteria: "required"}],
    styleCallback: () => processTimeTpCodeEditor
  },
  { name: "stdProcessTm", dataType: "number", defaultValue: 0, headerText: "FP_STD_PROCESS_TM", visible: true, editable: true, width: 90, positiveOnly: true, format : "#,##0.0####" },
  { name: "transferBatchTm", dataType: "number", defaultValue: 0, headerText: "FP_TRANSFER_BATCH_TM", visible: true, editable: true, width: 90, positiveOnly: true, format : "#,##0.0####" },
  { name: "divideTpCd", dataType: "text", headerText: "FP_DIVIDE_TP_CD", visible: true, editable: true, width: 80, textAlignment: "center",
    styleCallback: () => divideTpCodeEditor
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

function BorTab(props, ref) {
  const location = useLocation();
  const history = useHistory();

  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const [borGrid, setBorGrid] = useState(null);

  const [gridResourcePopup, setGridResourcePopup] = useState(false);
  const [gridRoutePopup, setGridRoutePopup] = useState(false);

  useEffect(() => {
    setBorGrid(getViewInfo(vom.active, 'borGrid'))
  }, [viewData]);

  useEffect(() => {
    if (borGrid) {
      setEditableGrid(borGrid);
      setGridOptions(borGrid.gridView);
      if (!location.state) {
        loadData();
      }
    }
  }, [borGrid]);

  useEffect(() => {
    if (location.state !== undefined && location.state !== null && borGrid) {
      if (location.state.paramType === 'ROUTE') {
        loadData('', location.state.paramCode, '');
        history.replace({ state: null });
      }
    }
  }, [location, borGrid]);

  useImperativeHandle(ref, () => ({
    loadData(itemParam, routeParam, resourceParam) {
      loadData(itemParam, routeParam, resourceParam);
    }
  }));

  function setGridOptions(gridView) {
    if (gridView.id === 'borGrid') {
      setCellButtonRenderer(gridView, 'routeCode');
      setCellButtonRenderer(gridView, 'resourceCode');

      setGridComboList(gridView, 'itemClassCode', 'FP_ITEM_CLASS_CD');
      setGridComboList(gridView, 'timeUom', 'FP_TIME_UOM');

      (gridView.columnByName('routeCode')).styleCallback = setCodeColumnStyle;
      (gridView.columnByName('resourceCode')).styleCallback = setCodeColumnStyle;

      gridView.onCellItemClicked = function (grid, index, clickData) {
        if (!clickData.editable) {
          return;
        }

        if (clickData.fieldName === 'resourceCode') {
          setGridResourcePopup(true);
        } else if (clickData.fieldName === 'routeCode') {
          setGridRoutePopup(true);
        }
      };
    }
  }

  function clearAllFilters(gridView) {
    if (gridView.id === 'borGrid') {
      borGridFilters.forEach(value => {
        gridView.activateAllColumnFilters(value, false);
      })
    }
  }

  function loadData(itemParam= '', routeParam = '', resourceParam = '') {
    clearAllFilters(borGrid.gridView);

    borGrid.gridView.commit(true);
    borGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    zAxios.get(baseURI() + 'factoryplan/master/bor/bors', {
      params: {
        'searchItem': itemParam,
        'searchRoute': routeParam,
        'searchResource': resourceParam
      }
    })
    .then(function (res) {
      borGrid.dataProvider.fillJsonData(res.data);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      borGrid.gridView.hideToast();
      borGrid.gridView.setAllCheck(false, false);
    });
  }

  function setRouteValues(values) {
    const gridView = borGrid.gridView;
    const index = gridView.getCurrent().itemIndex;

    values["itemCode"] = values["itemCd"];
    values["itemName"] = values["itemNm"];
    values["itemClassCode"] = values["itemClassCd"];
    values["inventoryCode"] = values["inventoryCd"];
    values["inventoryName"] = values["inventoryNm"];
    values["routeCode"] = values["routeCd"];
    values["routeName"] = values["routeNm"];

    gridView.setValues(index, values);
  }

  function setResourceValues(values) {
    const gridView = borGrid.gridView;
    const index = gridView.getCurrent().itemIndex;

    values["resourceCode"] = values["resourceCd"];
    values["resourceName"] = values["resourceNm"];

    gridView.setValues(index, values);
  }

  const afterToLoad = (targetGrid) => {
    if (targetGrid.gridView.id === 'borGrid') {
      loadData();
    }
  }

  return (
      <Box sx={fpCommonStyles.tabInner}>
        <RoutePopup open={gridRoutePopup} onClose={() => setGridRoutePopup(false)} confirm={setRouteValues} />
        <ResourcePopup open={gridResourcePopup} onClose={() => setGridResourcePopup(false)} confirm={setResourceValues} />
        <ButtonArea>
          <LeftButtonArea>
            <GridExcelExportButton grid="borGrid" options={exportOptions} />
            {/*<GridExcelImportButton grid="borGrid" />*/}
          </LeftButtonArea>
          <RightButtonArea>
            <GridAddRowButton grid="borGrid" />
            <GridDeleteRowButton grid="borGrid" url="factoryplan/master/bor/bors/delete" onAfterDelete={afterToLoad} />
            <GridSaveButton grid="borGrid" url="factoryplan/master/bor/bors" onAfterSave={afterToLoad} />
          </RightButtonArea>
        </ButtonArea>
        <ResultArea sizes={[100, 50]} direction={"vertical"}>
          <BaseGrid id="borGrid" items={borGridItems} className="white-skin" />
        </ResultArea>
      </Box>
  );
  }

BorTab = forwardRef(BorTab);
export default BorTab;
