import React, { useEffect, useState } from 'react';
import { Box } from "@mui/material";
import { BaseGrid, PopupDialog, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';
import { transLangKey } from "@wingui";

import { setNoneEditableGrid } from "../common";

import '../../common/common.css';

const customerPopupGridFilters = ['customerCd', 'customerNm'];
const customerPopupGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 50, textAlignment: "center" },
  { name: "customerCd", dataType: "text", headerText: "FP_CUSTOMER_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true },
  { name: "customerNm", dataType: "text", headerText: "FP_CUSTOMER_NM", visible: true, editable: false, width: 200, textAlignment: "near", autoFilter: true },
  { name: "descTxt", dataType: "text", headerText: "FP_DESC_TXT", visible: true, editable: false, width: 80, textAlignment: "near" },
  { name: "priority", dataType: "number", defaultValue: 1, headerText: "FP_PRIORITY", visible: true, editable: false, width: 80, positiveOnly: true, format : "#,##0" },
  { name: "category", dataType: "text", headerText: "FP_CUSTOMER_CATEGORY", visible: true, editable: false, width: 150, textAlignment: "near" },
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

function CustomerPopup(props) {
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const [customerPopupGrid, setCustomerPopupGrid] = useState(null);

  useEffect(() => {
    setCustomerPopupGrid(getViewInfo(vom.active, 'customerPopupGrid'))
  }, [viewData]);

  useEffect(() => {
    if (customerPopupGrid) {
      setNoneEditableGrid(customerPopupGrid);
      setGridOptions(customerPopupGrid.gridView);

      loadData();
    }
  }, [customerPopupGrid]);

  function setGridOptions(gridView) {
    if (gridView.id === 'customerPopupGrid') {
      gridView.onCellDblClicked = function (grid, clickData) {
        if (clickData.cellType === 'data') {
          const clickedRow = grid.getValues(clickData.itemIndex);
          const returnValues = {};

          returnValues['customerCd'] = clickedRow.customerCd;
          returnValues['customerNm'] = clickedRow.customerNm;

          props.confirm(returnValues);
          props.onClose();
        }
      }
    }
  }

  function clearAllFilters(gridView) {
    if (gridView.id === 'customerPopupGrid') {
      customerPopupGridFilters.forEach(value => {
        gridView.activateAllColumnFilters(value, false);
      })
    }
  }

  function loadData() {
    clearAllFilters(customerPopupGrid.gridView);

    zAxios.get(baseURI() + 'factoryplan/customers', {
      params: {
        'search': ''
      },
      fromPopup: true
    })
    .then(function (res) {
      customerPopupGrid.dataProvider.fillJsonData(res.data);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      customerPopupGrid.gridView.expandAll();
    });
  }

  return (
      <>
        <PopupDialog type="NOBUTTONS" open={props.open} onClose={props.onClose} checks={[customerPopupGrid]} title={transLangKey("FP_CUSTOMER_SELECT")} resizeHeight={560} resizeWidth={830}>
          <Box style={{ height: "100%" }}>
            <BaseGrid id="customerPopupGrid" items={customerPopupGridItems} className="white-skin" />
          </Box>
        </PopupDialog>
      </>
  )
}

export default CustomerPopup;
