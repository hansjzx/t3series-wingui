import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useLocation, useHistory } from "react-router-dom";
import { Box, ButtonGroup } from "@mui/material";
import {
  BaseGrid, ButtonArea, ResultArea, LeftButtonArea, RightButtonArea,
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

import CustomerMasterPopup from "./CustomerMasterPopup";
import OrderTypeMasterPopup from "./OrderTypeMasterPopup";

import '../../common/common.css';

const planStrategyCode = getCodeEditor('FP_PLAN_STRATEGY');

const salesOrderGridFilters = ["soCd", "inventoryCode", "inventoryName"];

const salesOrderGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 50, textAlignment: "center" },
  { name: "soCd", dataType: "text", headerText: "FP_SO_CD", visible: true, editable: true, width: 150, textAlignment: "near", autoFilter: true,
    validRules: [{ criteria: "required"}]
  },
  { name: "inventoryCode", dataType: "text", headerText: "FP_INVENTORY_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true,
    styleName: "editable-text-column",
    validRules: [{ criteria: "required"}]
  },
  { name: "inventoryName", dataType: "text", headerText: "FP_INVENTORY_NM", visible: true, editable: false, width: 200, textAlignment: "near", autoFilter: true },
  { name: "requestQty", dataType: "number", defaultValue: 0, headerText: "FP_REQUEST_QTY", visible: true, editable: true, width: 90, positiveOnly: true, format: "#,##0.0####" },
  { name: "sales", dataType: "group", orientation: "horizontal", headerText: "FP_SALES", expandable: true, expanded: false,
    childs: [
      { name: "salesPerson", dataType: "text", headerText: "FP_SALES_PERSON", visible: true, editable: false, width: 80, textAlignment: "center", groupShowMode: "expand" },
      { name: "customerCode", dataType: "text", headerText: "FP_CUSTOMER_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true, groupShowMode: "always", styleName: "editable-text-column" },
      { name: "customerName", dataType: "text", headerText: "FP_CUSTOMER_NM", visible: true, editable: false, width: 200, textAlignment: "near", groupShowMode: "expand" },
      { name: "customerDueDt", dataType: "datetime", headerText: "FP_CUSTOMER_DUE_DT", visible: true, editable: false, width: 80, textAlignment: "center", groupShowMode: "expand", format: "yyyy-MM-dd HH:mm:ss"},
    ]
  },
  { name: "dueDt", dataType: "datetime", headerText: "FP_DUE_DT", visible: true, editable: true, width: 150, textAlignment: "center", format: "yyyy-MM-dd HH:mm:ss", validRules: [{ criteria: "required"}]},
  { name: "priority", dataType: "number", headerText: "FP_PRIORITY", visible: true, editable: true, width: 80, positiveOnly: true, format: "#,##0", defaultValue: 1 },
  { name: "descTxt", dataType: "text", headerText: "FP_DESC_TXT", visible: true, editable: true, width: 80, textAlignment: "near" },
  { name: "displayColor", dataType: "text", headerText: "FP_DISPLAY_COLOR", visible: true, editable: true, width: 80, textAlignment: "center", defaultValue: "ff96c8" },
  { name: "dueDtFence", dataType: "datetime", headerText: "FP_DUE_DT_FENCE", visible: true, editable: true, width: 150, textAlignment: "center", format: "yyyy-MM-dd HH:mm:ss"},

  { name: "planPolicy", dataType: "group", orientation: "horizontal", headerText: "FP_PLAN_POLICY", expandable: true, expanded: false,
    childs: [
      { name: "orderStrategyTpCd", dataType: "text", headerText: "FP_ORDER_STRATEGY", visible: true, editable: true, width: 80, textAlignment: "center", autoFilter: true, groupShowMode: "always",
        styleCallback: () => planStrategyCode
      },
      { name: "pst", dataType: "datetime", headerText: "FP_PST", visible: true, editable: true, width: 150, textAlignment: "center", format: "yyyy-MM-dd HH:mm:ss", groupShowMode: "expand"},
      { name: "efficiency", dataType: "number", defaultValue: 1, headerText: "FP_EFFICIENCY", visible: true, editable: true, width: 80, positiveOnly: true, format : "#,##0.0####", groupShowMode: "expand" },
      { name: "cancOnLateYn", dataType: "boolean", headerText: "FP_CANC_ON_LATE_YN", visible: true, editable: true, width: 80, textAlignment: "center", defaultValue: false, groupShowMode: "expand" },
      { name: "orderTpCd", dataType: "text", headerText: "FP_ORDER_TP_CD", visible: true, editable: false, width: 100, textAlignment: "near", styleName: "editable-text-column", groupShowMode: "expand" },
    ]
  },

  { name: "extraInfo", dataType: "group", orientation: "horizontal", headerText: "FP_EXTRA_INFO", expandable: true, expanded: false,
    childs: [
      { name: "activeYn", dataType: "boolean", headerText: "FP_ACTIVE_YN", visible: true, editable: true, width: 80, textAlignment: "center", defaultValue: true, groupShowMode: "always" },
      { name: "soGrpCd", dataType: "text", headerText: "FP_SO_GRP_CD", visible: true, editable: true, width: 100, textAlignment: "near", groupShowMode: "always" },
      { name: "grpPriority", dataType: "number", headerText: "FP_GRP_PRIORITY", visible: true, editable: true, width: 80, positiveOnly: true, format: "#,##0", groupShowMode: "expand" },

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

function SalesOrderTab(props, ref) {
  const location = useLocation();
  const history = useHistory();

  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const [salesOrderGrid, setSalesOrderGrid] = useState(null);

  const [orderTypeMstPopup, setOrderTypeMstPopup] = useState(false);
  const [customerMstPopup, setCustomerMstPopup] = useState(false);

  useEffect(() => {
    setSalesOrderGrid(getViewInfo(vom.active, 'salesOrderGrid'))
  }, [viewData]);
  
  useEffect(() => {
    if (salesOrderGrid) {
      setEditableGrid(salesOrderGrid);
      setGridOptions(salesOrderGrid.gridView);
      if (!location.state || location.state.paramType !== 'SALES_ORDER') {
        loadData();
      }
    }
  }, [salesOrderGrid]);

  useEffect(() => {
    if (location.state !== undefined && location.state !== null && salesOrderGrid) {
      if (location.state.paramType === 'SALES_ORDER') {
        loadData(location.state.paramCode);
        history.replace({ state: null });
      }
    }
  }, [location, salesOrderGrid]);

  useImperativeHandle(ref, () => ({
    loadData(orderParam) {
      loadData(orderParam);
    },
    setPopupValues(values) {
      setPopupValues(values);
    }
  }));

  function setGridOptions(gridView) {
    if (gridView.id === 'salesOrderGrid') {
      setColorPickerRenderer(gridView, 'displayColor');

      setCellButtonRenderer(gridView, 'inventoryCode');
      setCellButtonRenderer(gridView, 'customerCode');
      setCellButtonRenderer(gridView, 'orderTpCd');

      (gridView.columnByName('soCd')).styleCallback = setCodeColumnStyle;

      gridView.onCellItemClicked = function (grid, index, clickData) {
        if (clickData.fieldName === 'inventoryCode' || clickData.fieldName === 'customerCode' || clickData.fieldName === 'orderTpCd') {
          props.openGridPopup(clickData.fieldName);
        }
      };
    }
  }

  function clearAllFilters(gridView) {
    if (gridView.id === 'salesOrderGrid') {
      salesOrderGridFilters.forEach(value => {
        gridView.activateAllColumnFilters(value, false);
      })
    }
  }

  function loadData(orderParam = '') {
    clearAllFilters(salesOrderGrid.gridView);

    salesOrderGrid.gridView.commit(true);
    salesOrderGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    zAxios.get(baseURI() + 'factoryplan/master/order/salesorders', {
      params: {
        'searchOrder': orderParam
      }
    })
    .then(function (res) {
      salesOrderGrid.dataProvider.fillJsonData(res.data);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      salesOrderGrid.gridView.hideToast();
      salesOrderGrid.gridView.setAllCheck(false, false);
    });
  }

  function setPopupValues(values) {
    if (values.columnName === 'inventoryCode') {
      setInventoryValues(values);
    } else if (values.columnName === 'customerCode') {
      setCustomerValues(values);
    } else if (values.columnName === 'orderTpCd') {
      setOrderTypeValues(values);
    }
  }

  function setInventoryValues(values) {
    const gridView = salesOrderGrid.gridView;
    const index = gridView.getCurrent().itemIndex;

    values["inventoryCode"] = values["inventoryCd"];
    values["inventoryName"] = values["inventoryNm"];

    gridView.setValues(index, values);
  }

  function setCustomerValues(values) {
    const gridView = salesOrderGrid.gridView;
    const index = gridView.getCurrent().itemIndex;

    values["customerCode"] = values["customerCd"];
    values["customerName"] = values["customerNm"];

    gridView.setValues(index, values);
  }

  function setOrderTypeValues(values) {
    const gridView = salesOrderGrid.gridView;
    const index = gridView.getCurrent().itemIndex;

    values["pst"] = values["orderPst"];
    values["efficiency"] = values["orderEfficiency"];

    gridView.setValues(index, values);
  }

  const afterToLoad = (targetGrid) => {
    if (targetGrid.gridView.id === 'salesOrderGrid') {
      loadData();
    }
  }

  return (
    <Box sx={fpCommonStyles.tabInner}>
      <OrderTypeMasterPopup open={orderTypeMstPopup} onClose={() => setOrderTypeMstPopup(false)} />
      <CustomerMasterPopup open={customerMstPopup} onClose={() => setCustomerMstPopup(false)} />
      <ButtonArea>
        <LeftButtonArea>
          <GridExcelExportButton grid="salesOrderGrid" options={exportOptions} />
          {/*<GridExcelImportButton grid="salesOrderGrid" />*/}
          <ButtonGroup variant="outlined">
            <CommonButton type="text" title={transLangKey("FP_ORDER_TYPE_MST")} onClick={() => { setOrderTypeMstPopup(true) }}>{transLangKey("FP_ORDER_TYPE_MST")}</CommonButton>
            <CommonButton type="text" title={transLangKey("FP_CUSTOMER_MST")} onClick={() => { setCustomerMstPopup(true) }}>{transLangKey("FP_CUSTOMER_MST")}</CommonButton>
          </ButtonGroup>
        </LeftButtonArea>
        <RightButtonArea>
          <GridAddRowButton grid="salesOrderGrid" />
          <GridDeleteRowButton grid="salesOrderGrid" url="factoryplan/master/order/salesorders/delete" onAfterDelete={afterToLoad} />
          <GridSaveButton grid="salesOrderGrid" url="factoryplan/master/order/salesorders" onAfterSave={afterToLoad} />
        </RightButtonArea>
      </ButtonArea>
      <ResultArea>
        <BaseGrid id="salesOrderGrid" items={salesOrderGridItems} className="white-skin" />
      </ResultArea>
      <StatusArea show={false} message={''}>
        <GridCnt grid="salesOrderGrid" format={'{0} ' + transLangKey('CASES') + ' ' + transLangKey('MSG_0010')}></GridCnt>
      </StatusArea>
    </Box>
  );
}

SalesOrderTab = forwardRef(SalesOrderTab);
export default SalesOrderTab;
