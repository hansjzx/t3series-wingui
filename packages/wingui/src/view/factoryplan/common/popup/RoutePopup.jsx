import React, { useEffect, useState } from 'react';
import { Box } from "@mui/material";
import { useViewStore, BaseGrid, PopupDialog, zAxios } from '@zionex/wingui-core/src/common/imports';
import { transLangKey } from "@wingui";

import { setGridComboList, setNoneEditableGrid } from "../common";


import '../../common/common.css';

const routePopupGridFilters = ['itemCode', 'itemName', 'itemClassCd', 'inventoryCode', 'inventoryName', 'routeCode', 'routeName'];
const routePopupGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 50, textAlignment: "center" },
  { name: "itemCode", dataType: "text", headerText: "FP_ITEM_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true },
  { name: "itemName", dataType: "text", headerText: "FP_ITEM_NM", visible: true, editable: false, width: 200, textAlignment: "near", autoFilter: true },
  { name: "itemClassCode", dataType: "text", headerText: "FP_ITEM_CLASS_CD", visible: true, editable: false, width: 80, textAlignment: "center", autoFilter: true, lookupDisplay: true},
  { name: "inventoryCode", dataType: "text", headerText: "FP_INVENTORY_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true },
  { name: "inventoryName", dataType: "text", headerText: "FP_INVENTORY_NAME", visible: true, editable: false, width: 200, textAlignment: "near", autoFilter: true },
  { name: "routeCode", dataType: "text", headerText: "FP_ROUTE_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true },
  { name: "routeName", dataType: "text", headerText: "FP_ROUTE_NM", visible: true, editable: false, width: 200, textAlignment: "near", autoFilter: true },
  { name: "routeDescTxt", dataType: "text", headerText: "FP_DESC_TXT", visible: true, editable: false, width: 80, textAlignment: "center"}
];

function RoutePopup(props) {
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const [routePopupGrid, setRoutePopupGrid] = useState(null);

  useEffect(() => {
    setRoutePopupGrid(getViewInfo(vom.active, 'routePopupGrid'))
  }, [viewData]);

  useEffect(() => {
    if (routePopupGrid) {
      setNoneEditableGrid(routePopupGrid);
      setGridOptions(routePopupGrid.gridView);

      loadData();
    }
  }, [routePopupGrid]);

  function setGridOptions(gridView) {
    if (gridView.id === 'routePopupGrid') {
      setGridComboList(gridView, 'itemClassCd', 'FP_ITEM_CLASS_CD');

      gridView.onCellDblClicked = function (grid, clickData) {
        if (clickData.cellType === 'data') {
          const clickedRow = grid.getValues(clickData.itemIndex);
          const returnValues = {};

          returnValues['itemCd'] = clickedRow.itemCode;
          returnValues['itemNm'] = clickedRow.itemName;
          returnValues['itemClassCd'] = clickedRow.itemClassCode;
          returnValues['inventoryCd'] = clickedRow.inventoryCode;
          returnValues['inventoryNm'] = clickedRow.inventoryName;
          returnValues['routeCd'] = clickedRow.routeCode;
          returnValues['routeNm'] = clickedRow.routeName;

          props.confirm(returnValues);
          props.onClose(false);
        }
      }
    }
  }

  function clearAllFilters(gridView) {
    if (gridView.id === 'routePopupGrid') {
      routePopupGridFilters.forEach(value => {
        gridView.activateAllColumnFilters(value, false);
      })
    }
  }

  function loadData() {
    clearAllFilters(routePopupGrid.gridView);

    zAxios.get(baseURI() + 'factoryplan/producingroutes', {
      params: {
        'search': ''
      },
      fromPopup: true
    })
    .then(function (res) {
      routePopupGrid.dataProvider.fillJsonData(res.data);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      routePopupGrid.gridView.expandAll();
    });
  }

  return (
    <>
      <PopupDialog type="NOBUTTONS" open={props.open} onClose={props.onClose} checks={[routePopupGrid]} title={transLangKey("FP_ROUTE_SELECT")} resizeHeight={560} resizeWidth={1200}>
        <Box style={{ height: "100%" }}>
          <BaseGrid id="routePopupGrid" items={routePopupGridItems} className="white-skin" />
        </Box>
      </PopupDialog>
    </>
  )
}

export default RoutePopup;
