import React, { useEffect, useState } from 'react';
import { Box } from "@mui/material";
import { BaseGrid, PopupDialog, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';
import { transLangKey } from "@wingui";

import { setGridComboList, setNoneEditableGrid } from "../common";

import '../../common/common.css';

const salesOrderPopupGridFilters = ['itemCode', 'itemName', 'itemClassCd', 'inventoryCode', 'inventoryName', 'routeCode', 'routeName'];
const salesOrderPopupGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 50, textAlignment: "center" },
  { name: "soCd", dataType: "text", headerText: "FP_SO_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true },
  { name: "inventoryCode", dataType: "text", headerText: "FP_INVENTORY_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true },
  { name: "inventoryName", dataType: "text", headerText: "FP_INVENTORY_NAME", visible: true, editable: false, width: 200, textAlignment: "near", autoFilter: true },
  { name: "customerCode", dataType: "text", headerText: "FP_CUSTOMER_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true },
  { name: "dueDt", dataType: "datetime", headerText: "FP_DUE_DT", visible: true, editable: false, width: 150, textAlignment: "center", format: "yyyy-MM-dd HH:mm:ss"},
  { name: "dueDtFence", dataType: "datetime", headerText: "FP_DUE_DT_FENCE", visible: true, editable: false, width: 150, textAlignment: "center", format: "yyyy-MM-dd HH:mm:ss"},
  { name: "descTxt", dataType: "text", headerText: "FP_DESC_TXT", visible: true, editable: false, width: 80, textAlignment: "center"},
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

function SalesOrderPopup(props) {
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const [salesOrderPopupGrid, setSalesOrderPopupGrid] = useState(null);

  useEffect(() => {
    setSalesOrderPopupGrid(getViewInfo(vom.active, 'salesOrderPopupGrid'))
  }, [viewData]);

  useEffect(() => {
    if (salesOrderPopupGrid) {
      setNoneEditableGrid(salesOrderPopupGrid);
      setGridOptions(salesOrderPopupGrid.gridView);

      loadData();
    }
  }, [salesOrderPopupGrid]);

  function setGridOptions(gridView) {
    if (gridView.id === 'salesOrderPopupGrid') {
      setGridComboList(gridView, 'itemClassCd', 'FP_ITEM_CLASS_CD');

      gridView.onCellDblClicked = function (grid, clickData) {
        if (clickData.cellType === 'data') {
          const clickedRow = grid.getValues(clickData.itemIndex);
          const returnValues = {};

          returnValues['soCd'] = clickedRow.soCd;
          returnValues['inventoryCode'] = clickedRow.inventoryCode;
          returnValues['inventoryName'] = clickedRow.inventoryName;
          returnValues['customerCode'] = clickedRow.customerCode;
          returnValues['dueDt'] = clickedRow.dueDt;
          returnValues['dueDtFence'] = clickedRow.dueDtFence;

          props.confirm(returnValues);
          props.onClose(false);
        }
      }
    }
  }

  function clearAllFilters(gridView) {
    if (gridView.id === 'salesOrderPopupGrid') {
      salesOrderPopupGridFilters.forEach(value => {
        gridView.activateAllColumnFilters(value, false);
      })
    }
  }

  function loadData() {
    clearAllFilters(salesOrderPopupGrid.gridView);

    zAxios.get(baseURI() + 'factoryplan/salesorders', {
      params: {
        'search': ''
      },
      fromPopup: true
    })
    .then(function (res) {
      salesOrderPopupGrid.dataProvider.fillJsonData(res.data);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      salesOrderPopupGrid.gridView.expandAll();
    });
  }

  return (
      <>
        <PopupDialog type="NOBUTTONS" open={props.open} onClose={props.onClose} checks={[salesOrderPopupGrid]}  title={transLangKey("FP_SALES_ORDER_SELECT")} resizeHeight={560} resizeWidth={1200}>
          <Box style={{ height: "100%" }}>
            <BaseGrid id="salesOrderPopupGrid" items={salesOrderPopupGridItems} className="white-skin" />
          </Box>
        </PopupDialog>
      </>
  )
}

export default SalesOrderPopup;
