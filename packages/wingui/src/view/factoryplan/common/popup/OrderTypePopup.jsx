import React, { useEffect, useState } from 'react';
import { Box } from "@mui/material";
import { BaseGrid, PopupDialog, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';
import { transLangKey } from "@wingui";

import { setNoneEditableGrid } from "../common";

import '../../common/common.css';

const orderTypePopupGridFilters = ['orderTpCd'];
const orderTypePopupGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 50, textAlignment: "center" },
  { name: "orderTpCd", dataType: "text", headerText: "FP_ORDER_TP_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true },
  { name: "orderStrategyTpCd", dataType: "text", headerText: "FP_ORDER_STRATEGY", visible: true, editable: false, width: 80, textAlignment: "center" },
  { name: "orderPst", dataType: "datetime", headerText: "FP_PST", visible: true, editable: false, width: 100, textAlignment: "center",
    format: "yyyy-MM-dd HH:mm:ss"
  },
  { name: "toStockYn", dataType: "boolean", headerText: "FP_TO_STOCK_YN", visible: true, editable: false, width: 95, textAlignment: "center" },
  { name: "orderEfficiency", dataType: "number", defaultValue: 0, headerText: "FP_EFFICIENCY", visible: true, editable: false, width: 90, positiveOnly: true, format : "#,##0.0####" },
  { name: "cancOnLateYn", dataType: "boolean", headerText: "FP_CANC_ON_LATE_YN", visible: true, editable: false, width: 95, textAlignment: "center", defaultValue: false },
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

function OrderTypePopup(props) {
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const [orderTypePopupGrid, setOrderTypePopupGrid] = useState(null);

  useEffect(() => {
    setOrderTypePopupGrid(getViewInfo(vom.active, 'orderTypePopupGrid'))
  }, [viewData]);

  useEffect(() => {
    if (orderTypePopupGrid) {
      setNoneEditableGrid(orderTypePopupGrid);
      setGridOptions(orderTypePopupGrid.gridView);

      loadData();
    }
  }, [orderTypePopupGrid]);

  function setGridOptions(gridView) {
    if (gridView.id === 'orderTypePopupGrid') {
      gridView.onCellDblClicked = function (grid, clickData) {
        if (clickData.cellType === 'data') {
          const clickedRow = grid.getValues(clickData.itemIndex);
          const returnValues = {};

          returnValues['orderTpCd'] = clickedRow.orderTpCd;
          returnValues['orderStrategyTpCd'] = clickedRow.orderStrategyTpCd;
          returnValues['orderPst'] = clickedRow.orderPst;
          returnValues['toStockYn'] = clickedRow.toStockYn;
          returnValues['orderEfficiency'] = clickedRow.orderEfficiency;
          returnValues['cancOnLateYn'] = clickedRow.cancOnLateYn;

          props.confirm(returnValues);
          props.onClose();
        }
      }
    }
  }

  function clearAllFilters(gridView) {
    if (gridView.id === 'orderTypePopupGrid') {
      orderTypePopupGridFilters.forEach(value => {
        gridView.activateAllColumnFilters(value, false);
      })
    }
  }

  function loadData() {
    clearAllFilters(orderTypePopupGrid.gridView);

    zAxios.get(baseURI() + 'factoryplan/ordertypes', {
      params: {
        'search': ''
      },
      fromPopup: true
    })
    .then(function (res) {
      orderTypePopupGrid.dataProvider.fillJsonData(res.data);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      orderTypePopupGrid.gridView.expandAll();
    });
  }

  return (
      <>
        <PopupDialog type="NOBUTTONS" open={props.open} onClose={props.onClose} checks={[orderTypePopupGrid]}  title={transLangKey("FP_ORDER_TYPE_SELECT")} resizeHeight={560} resizeWidth={830}>
          <Box style={{ height: "100%" }}>
            <BaseGrid id="orderTypePopupGrid" items={orderTypePopupGridItems} className="white-skin" />
          </Box>
        </PopupDialog>
      </>
  )
}

export default OrderTypePopup;
