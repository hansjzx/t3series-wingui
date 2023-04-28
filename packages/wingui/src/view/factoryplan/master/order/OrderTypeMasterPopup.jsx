import React, { useEffect, useState } from 'react';
import { Box } from "@mui/material";
import { BaseGrid, PopupDialog, ButtonArea, RightButtonArea, GridDeleteRowButton, GridAddRowButton, GridSaveButton, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';
import { setEditableGrid, setCodeColumnStyle, getCodeEditor } from "../../common/common";
import { transLangKey } from "@wingui";

import '../../common/common.css';


const planStrategyCode = getCodeEditor('FP_PLAN_STRATEGY');

const orderTypeMasterGridFilters = ['orderTpCd'];

const orderTypeMasterGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 50, textAlignment: "center" },
  { name: "orderTpCd", dataType: "text", headerText: "FP_ORDER_TP_CD", visible: true, editable: true, width: 150, textAlignment: "near", autoFilter: true,
    validRules: [{ criteria: "required"}]
  },
  { name: "orderStrategyTpCd", dataType: "text", headerText: "FP_ORDER_STRATEGY", visible: true, editable: true, width: 80, textAlignment: "center", defaultValue: "FORWARD",
    validRules: [{ criteria: "required"}],
    styleCallback: () => planStrategyCode
  },
  { name: "orderPst", dataType: "datetime", headerText: "FP_PST", visible: true, editable: true, width: 100, textAlignment: "center",
    format: "yyyy-MM-dd HH:mm:ss"
  },
  { name: "toStockYn", dataType: "boolean", headerText: "FP_TO_STOCK_YN", visible: true, editable: true, width: 80, textAlignment: "center" },

  { name: "orderEfficiency", dataType: "number", defaultValue: 0, headerText: "FP_EFFICIENCY", visible: true, editable: false, width: 80, positiveOnly: true, format : "#,##0.0####" },
  { name: "cancOnLateYn", dataType: "boolean", headerText: "FP_CANC_ON_LATE_YN", visible: true, editable: true, width: 80, textAlignment: "center", defaultValue: false },
  { name: "isDeletable", dataType: "boolean", headerText: "FP_IS_DELETABLE", visible: false, editable: false, width: 95, textAlignment: "center", defaultValue: true },
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

function OrderTypeMasterPopup(props) {
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const [orderTypeMasterGrid, setOrderTypeMasterGrid] = useState(null);

  useEffect(() => {
    setOrderTypeMasterGrid(getViewInfo(vom.active, 'orderTypeMasterGrid'))
  }, [viewData]);

  useEffect(() => {
    if (orderTypeMasterGrid) {
      setEditableGrid(orderTypeMasterGrid);
      setGridOptions(orderTypeMasterGrid.gridView);

      loadData();
    }
  }, [orderTypeMasterGrid]);


  function setGridOptions(gridView) {
    if (gridView.id === 'orderTypeMasterGrid') {
      gridView.setCheckableExpression("value['isDeletable']");

      (gridView.columnByName('orderTpCd')).styleCallback = setCodeColumnStyle;
    }
  }

  function clearAllFilters(gridView) {
    if (gridView.id === 'orderTypeMasterGrid') {
      orderTypeMasterGridFilters.forEach(value => {
        gridView.activateAllColumnFilters(value, false);
      })
    }
  }

  function loadData(param = '') {
    clearAllFilters(orderTypeMasterGrid.gridView);

    orderTypeMasterGrid.gridView.commit(true);
    orderTypeMasterGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    zAxios.get(baseURI() + 'factoryplan/ordertypes', {
      params: {
        'search': param
      },
      fromPopup: true
    })
    .then(function (res) {
      orderTypeMasterGrid.dataProvider.fillJsonData(res.data);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      orderTypeMasterGrid.gridView.hideToast();
      orderTypeMasterGrid.gridView.setAllCheck(false, false);
    });
  }

  const afterToLoad = (targetGrid) => {
    if (targetGrid.gridView.id === 'orderTypeMasterGrid') {
      loadData();
    }
  }

  return (
    <>
      <PopupDialog type="NOBUTTONS" open={props.open} onClose={props.onClose} checks={[orderTypeMasterGrid]} title={transLangKey("FP_ORDER_TYPE_MST")} resizeHeight={760} resizeWidth={1200}>
        <ButtonArea>
          <RightButtonArea>
            <GridAddRowButton grid="orderTypeMasterGrid" />
            <GridDeleteRowButton grid="orderTypeMasterGrid" url="factoryplan/master/order/ordertypes/delete" onAfterDelete={afterToLoad} />
            <GridSaveButton grid="orderTypeMasterGrid" url="factoryplan/master/order/ordertypes" onAfterSave={afterToLoad} />
          </RightButtonArea>
        </ButtonArea>
        <Box style={{ height: "100%" }}>
          <BaseGrid id="orderTypeMasterGrid" items={orderTypeMasterGridItems} className="white-skin" />
        </Box>
      </PopupDialog>
    </>
  )
}

export default OrderTypeMasterPopup;
