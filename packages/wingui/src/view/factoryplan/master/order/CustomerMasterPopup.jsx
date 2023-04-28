import React, { useEffect, useState } from 'react';
import { Box } from "@mui/material";
import { BaseGrid, PopupDialog, ButtonArea, RightButtonArea, GridDeleteRowButton, GridAddRowButton, GridSaveButton, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';
import { setEditableGrid, setCodeColumnStyle } from "../../common/common";
import { transLangKey } from "@wingui";

import '../../common/common.css';

const customerMasterGridFilters = ['customerCd', 'customerNm'];

const customerMasterGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 50, textAlignment: "center" },
  { name: "customerCd", dataType: "text", headerText: "FP_CUSTOMER_CD", visible: true, editable: true, width: 150, textAlignment: "near", autoFilter: true,
    validRules: [{ criteria: "required"}]
  },
  { name: "customerNm", dataType: "text", headerText: "FP_CUSTOMER_NM", visible: true, editable: true, width: 200, textAlignment: "near", autoFilter: true },
  { name: "descTxt", dataType: "text", headerText: "FP_DESC_TXT", visible: true, editable: true, width: 80, textAlignment: "near" },
  { name: "priority", dataType: "number", defaultValue: 1, headerText: "FP_PRIORITY", visible: true, editable: true, width: 80, positiveOnly: true, format : "#,##0" },
  { name: "category", dataType: "text", headerText: "FP_CUSTOMER_CATEGORY", visible: true, editable: true, width: 150, textAlignment: "near" },
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

function CustomerMasterPopup(props) {
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const [customerMasterGrid, setCustomerMasterGrid] = useState(null);

  useEffect(() => {
    setCustomerMasterGrid(getViewInfo(vom.active, 'customerMasterGrid'))
  }, [viewData]);

  useEffect(() => {
    if (customerMasterGrid) {
      setEditableGrid(customerMasterGrid);
      setGridOptions(customerMasterGrid.gridView);

      loadData();
    }
  }, [customerMasterGrid]);


  function setGridOptions(gridView) {
    if (gridView.id === 'customerMasterGrid') {
      (gridView.columnByName('customerCd')).styleCallback = setCodeColumnStyle;
    }
  }

  function clearAllFilters(gridView) {
    if (gridView.id === 'customerMasterGrid') {
      customerMasterGridFilters.forEach(value => {
        gridView.activateAllColumnFilters(value, false);
      })
    }
  }

  function loadData(param = '') {
    clearAllFilters(customerMasterGrid.gridView);

    customerMasterGrid.gridView.commit(true);
    customerMasterGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    zAxios.get(baseURI() + 'factoryplan/customers', {
      params: {
        'search': param
      },
      fromPopup: true
    })
    .then(function (res) {
      customerMasterGrid.dataProvider.fillJsonData(res.data);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      customerMasterGrid.gridView.hideToast();
      customerMasterGrid.gridView.setAllCheck(false, false);
    });
  }

  const afterToLoad = (targetGrid) => {
    if (targetGrid.gridView.id === 'customerMasterGrid') {
      loadData();
    }
  }

  return (
    <>
      <PopupDialog type="NOBUTTONS" open={props.open} onClose={props.onClose} checks={[customerMasterGrid]} title={transLangKey("FP_CUSTOMER_MST")} resizeHeight={760} resizeWidth={1200}>
        <ButtonArea>
          <RightButtonArea>
            <GridAddRowButton grid="customerMasterGrid" />
            <GridDeleteRowButton grid="customerMasterGrid" url="factoryplan/master/order/customers/delete" onAfterDelete={afterToLoad} />
            <GridSaveButton grid="customerMasterGrid" url="factoryplan/master/order/customers" onAfterSave={afterToLoad} />
          </RightButtonArea>
        </ButtonArea>
        <Box style={{ height: "100%" }}>
          <BaseGrid id="customerMasterGrid" items={customerMasterGridItems} className="white-skin" />
        </Box>
      </PopupDialog>
    </>
  )
}

export default CustomerMasterPopup;
