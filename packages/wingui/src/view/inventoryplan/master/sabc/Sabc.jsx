import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import {
  ContentInner, ResultArea, SearchArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow, CommonButton,
  GridExcelExportButton, GridSaveButton, BaseGrid, useUserStore, useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';
import PopSABC from '@wingui/view/supplychainmodel/common/PopSABC';
import PopSabcBundleCreate from './PopSabcBundleCreate';
import ItemSearchBox from '@wingui/view/supplychainmodel/common/ItemSearchBox';
import LocationSearchBox from '@wingui/view/supplychainmodel/common/LocationSearchBox';

let gridSabcColumns = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: true, width: "150" },
  {
    name: "LOCATION", dataType: "group", orientation: "horizontal", headerText: "LOCAT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "120", groupShowMode: "expand" },
      { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "120", groupShowMode: "expand" },
      { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "120", groupShowMode: "always" },
      { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "120", groupShowMode: "always" }
    ]
  },
  {
    name: "ITEM", dataType: "group", orientation: "horizontal", headerText: "ITEM", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: "100", groupShowMode: "always" },
      { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: "100", groupShowMode: "always" },
      { name: "ITEM_TP", dataType: "text", headerText: "ITEM_TP", visible: true, editable: false, width: "100", groupShowMode: "expand" },
      { name: "UOM_NM", dataType: "text", headerText: "UOM_NM", visible: true, editable: false, width: "80", groupShowMode: "expand" }
    ]
  },
  { name: "CURCY_NM", dataType: "text", headerText: "CURCY_NM", visible: true, editable: false, width: "80" },
  {
    name: "LASTYEAR_SHIPPING_ACTUAL", dataType: "group", orientation: "horizontal", headerText: "LASTYEAR_SHIPPING_ACTUAL", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "LASTYEAR_SHPP_ACTUAL_QTY", dataType: "number", headerText: "LASTYEAR_SHIPPING_ACTUAL_QTY", visible: true, editable: false, width: "100", numberFormat: '#,###.###' },
      { name: "LASTYEAR_SHPP_ACTUAL_REVENUE", dataType: "number", headerText: "LASTYEAR_SHIPPING_ACTUAL_REVENUE", visible: true, editable: false, width: "100", numberFormat: '#,###.###' }
    ]
  },
  {
    name: "LASTMOTH_SHIPPING_ACTUAL", dataType: "group", orientation: "horizontal", headerText: "LASTMOTH_SHIPPING_ACTUAL", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "LASTMOTH_SHPP_ACTUAL_QTY", dataType: "number", headerText: "LASTMOTH_SHIPPING_ACTUAL_QTY", visible: true, editable: false, width: "100", numberFormat: '#,###.###' },
      { name: "LASTMOTH_SHPP_ACTUAL_REVENUE", dataType: "number", headerText: "LASTMOTH_SHIPPING_ACTUAL_REVENUE", visible: true, editable: false, width: "100", numberFormat: '#,###.###' }
    ]
  },
  {
    name: "SALES_PLAN", dataType: "group", orientation: "horizontal", headerText: "SALES_PLAN", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "SALES_PLAN_QTY", dataType: "number", headerText: "QTY", visible: true, editable: false, width: "100", numberFormat: '#,###.###' },
      { name: "SALES_PLAN_REVENUE", dataType: "number", headerText: "REVENUE", visible: true, editable: false, width: "100", numberFormat: '#,###.###' }
    ]
  },
  {
    name: "SUM", dataType: "group", orientation: "horizontal", headerText: "SUM", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "SUM_QTY", dataType: "number", headerText: "QTY", visible: true, editable: false, width: "100", numberFormat: '#,###.###' },
      { name: "SUM_REVENUE", dataType: "number", headerText: "SUM_REVENUE", visible: true, editable: false, width: "100", numberFormat: '#,###.###' }
    ]
  },
  {
    name: "QTY_BASE_COMPSITN_RATE", dataType: "group", orientation: "horizontal", headerText: "QTY_BASE_COMPSITN_RATE", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "QTY_COMPSITN_RATE", dataType: "number", headerText: "QTY_COMPSITN_RATE", visible: true, editable: false, width: "150", numberFormat: '#,###.###' },
      { name: "CUMUL_QTY_COMPSITN_RATE", dataType: "number", headerText: "CUMUL_QTY_COMPSITN_RATE", visible: true, editable: false, width: "200", numberFormat: '#,###.###' },
      { name: "CUMUL_QTY", dataType: "number", headerText: "CUMUL_QTY", visible: true, editable: false, width: "100", numberFormat: '#,###.###' }
    ]
  },
  {
    name: "REVENUE_BASE_COMPSITN_RATE", dataType: "group", orientation: "horizontal", headerText: "REVENUE_BASE_COMPSITN_RATE", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "REVENUE_COMPSITN_RATE", dataType: "number", headerText: "REVENUE_COMPSITN_RATE", visible: true, editable: false, width: "150", numberFormat: '#,###.###' },
      { name: "CUMUL_REVENUE_COMPSITN_RATE", dataType: "number", headerText: "CUMUL_REVENUE_COMPSITN_RATE", visible: true, editable: false, width: "200", numberFormat: '#,###.###' },
      { name: "CUMUL_REVENUE", dataType: "number", headerText: "CUMUL_REVENUE", visible: true, editable: false, width: "100", numberFormat: '#,###.###' }
    ]
  },
  {
    name: "SABC_CLASS", dataType: "group", orientation: "horizontal", headerText: "SABC_CLASS", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "SABC_PRPSAL_VAL", dataType: "text", headerText: "SABC_PRPSAL_VAL", visible: true, editable: false, width: "80", autoFilter: true },
      { name: "SABC_VAL", dataType: "text", headerText: "SABC_VAL", visible: true, editable: false, width: "80", autoFilter: true, button: "action", buttonVisibility: "always" }
    ]
  },
  { name: "SABC_CAL_BASE", dataType: "text", headerText: "SVC_LV_CAL_BASE", visible: true, editable: false, width: "140" },
  { name: "PRPSAL_SVC_LV", dataType: "number", headerText: "PRPSAL_SVC_LV", visible: true, editable: false, width: "120" },
  { name: "FIXED_YN", dataType: "boolean", headerText: "FIXED_YN", visible: true, editable: true, width: "60" },
  { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "60" },
  {
    name: "EDIT", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: "100", groupShowMode: "expand" },
      { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: "140", groupShowMode: "expand" },
      { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: "100", groupShowMode: "always" },
      { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: "140", groupShowMode: "expand" }
    ]
  }
];

let gridAccountColumns = [
  { name: "SABC_ID", dataType: "text", headerText: "SABC_ID", visible: false, editable: false, width: "150" },
  {
    name: "LOCATION", dataType: "group", orientation: "horizontal", headerText: "LOCAT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "120", groupShowMode: "expand" },
      { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "120", groupShowMode: "expand" },
      { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "120", groupShowMode: "always" },
      { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "120", groupShowMode: "always" }
    ]
  },
  {
    name: "ITEM", dataType: "group", orientation: "horizontal", headerText: "ITEM", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: "100", groupShowMode: "always" },
      { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: "100", groupShowMode: "always" },
      { name: "ITEM_TP", dataType: "text", headerText: "ITEM_TP", visible: true, editable: false, width: "100", groupShowMode: "expand" },
      { name: "UOM_NM", dataType: "text", headerText: "UOM_NM", visible: true, editable: false, width: "80", groupShowMode: "expand" }
    ]
  },
  { name: "CURCY_NM", dataType: "text", headerText: "CURCY_NM", visible: true, editable: false, width: "80" },
  {
    name: "SHIP_TO", dataType: "group", orientation: "horizontal", headerText: "SHIP_TO", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "SHIPTO_LOCAT_TP_NM", dataType: "text", headerText: "SHIPTO_LOCAT_TP_NM", visible: true, editable: false, width: "120", groupShowMode: "expand" },
      { name: "SHIPTO_LOCAT_LV", dataType: "text", headerText: "SHIPTO_LOCAT_LV", visible: true, editable: false, width: "120", groupShowMode: "expand" },
      { name: "SHIPTO_LOCAT_CD", dataType: "text", headerText: "SHIPTO_LOCAT_CD", visible: true, editable: false, width: "120", groupShowMode: "always" },
      { name: "SHIPTO_LOCAT_NM", dataType: "text", headerText: "SHIPTO_LOCAT_NM", visible: true, editable: false, width: "120", groupShowMode: "always" },
      { name: "ACCOUNT_CD", dataType: "text", headerText: "ACCOUNT_CD", visible: true, editable: false, width: "120", groupShowMode: "always" },
      { name: "ACCOUNT_NM", dataType: "text", headerText: "ACCOUNT_NM", visible: true, editable: false, width: "120", groupShowMode: "always" }
    ]
  },
  {
    name: "LASTYEAR_SHIPPING_ACTUAL", dataType: "group", orientation: "horizontal", headerText: "LASTYEAR_SHIPPING_ACTUAL", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "LASTYEAR_SHPP_ACTUAL_QTY", dataType: "number", headerText: "LASTYEAR_SHIPPING_ACTUAL_QTY", visible: true, editable: false, width: "100", numberFormat: '#,###.###' },
      { name: "LASTYEAR_SHPP_ACTUAL_REVENUE", dataType: "number", headerText: "LASTYEAR_SHIPPING_ACTUAL_REVENUE", visible: true, editable: false, width: "100", numberFormat: '#,###.###' }
    ]
  },
  {
    name: "LASTMOTH_SHIPPING_ACTUAL", dataType: "group", orientation: "horizontal", headerText: "LASTMOTH_SHIPPING_ACTUAL", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "LASTMOTH_SHPP_ACTUAL_QTY", dataType: "number", headerText: "LASTMOTH_SHIPPING_ACTUAL_QTY", visible: true, editable: false, width: "100", numberFormat: '#,###.###' },
      { name: "LASTMOTH_SHPP_ACTUAL_REVENUE", dataType: "number", headerText: "LASTMOTH_SHIPPING_ACTUAL_REVENUE", visible: true, editable: false, width: "100", numberFormat: '#,###.###' }
    ]
  },
  {
    name: "SALES_PLAN", dataType: "group", orientation: "horizontal", headerText: "SALES_PLAN", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "SALES_PLAN_QTY", dataType: "number", headerText: "QTY", visible: true, editable: false, width: "100", numberFormat: '#,###.###' },
      { name: "SALES_PLAN_REVENUE", dataType: "number", headerText: "REVENUE", visible: true, editable: false, width: "100", numberFormat: '#,###.###' }
    ]
  },
  {
    name: "SUM", dataType: "group", orientation: "horizontal", headerText: "SUM", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "SUM_QTY", dataType: "number", headerText: "QTY", visible: true, editable: false, width: "100", numberFormat: '#,###.###' },
      { name: "SUM_REVENUE", dataType: "number", headerText: "SUM_REVENUE", visible: true, editable: false, width: "100", numberFormat: '#,###.###' }
    ]
  },
  {
    name: "QTY_BASE_COMPSITN_RATE", dataType: "group", orientation: "horizontal", headerText: "QTY_BASE_COMPSITN_RATE", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "QTY_COMPSITN_RATE", dataType: "number", headerText: "QTY_COMPSITN_RATE", visible: true, editable: false, width: "150", numberFormat: '#,###.###' },
      { name: "CUMUL_QTY_COMPSITN_RATE", dataType: "number", headerText: "CUMUL_QTY_COMPSITN_RATE", visible: true, editable: false, width: "200", numberFormat: '#,###.###' },
      { name: "CUMUL_QTY", dataType: "number", headerText: "CUMUL_QTY", visible: true, editable: false, width: "100", numberFormat: '#,###.###' }
    ]
  },
  {
    name: "REVENUE_BASE_COMPSITN_RATE", dataType: "group", orientation: "horizontal", headerText: "REVENUE_BASE_COMPSITN_RATE", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "REVENUE_COMPSITN_RATE", dataType: "number", headerText: "REVENUE_COMPSITN_RATE", visible: true, editable: false, width: "150", numberFormat: '#,###.###' },
      { name: "CUMUL_REVENUE_COMPSITN_RATE", dataType: "number", headerText: "CUMUL_REVENUE_COMPSITN_RATE", visible: true, editable: false, width: "200", numberFormat: '#,###.###' },
      { name: "CUMUL_REVENUE", dataType: "number", headerText: "CUMUL_REVENUE", visible: true, editable: false, width: "100", numberFormat: '#,###.###' }
    ]
  },
  { name: "SABC_VAL", dataType: "text", headerText: "SABC_VAL", visible: true, editable: false, width: "60" },
  { name: "PRPSAL_SVC_LV", dataType: "text", headerText: "PRPSAL_SVC_LV", visible: true, editable: false, width: "120" }
];

function Sabc() {
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo])
  const [username] = useUserStore(state => [state.username]);

  const [gridSabc, setGridSabc] = useState(null);
  const [gridAccount, setGridAccount] = useState(null);

  const locationSearchBoxRef = useRef();
  const itemSearchBoxRef = useRef();

  const [currentLocationRef, setCurrentLocationRef] = useState();
  const [currentItemRef, setCurrentItemRef] = useState();

  const [popupData, setPopupData] = useState({});
  const [sabcPopupOpen, setSabcPopupOpen] = useState(false);
  const [sabcBundleCreateOpen, setSabcBundleCreateOpen] = useState(false);

  const globalButtons = [
    { name: "search", action: (e) => { loadSabc() }, visible: true, disable: false },
    { name: "refresh", action: (e) => { refresh() }, visible: true, disable: false },
  ]

  const exportExcelOptions = {
    headerDepth: 2,
    footer: "default",
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  }

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, "gridSabc");
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        if (gridSabc != grdObj1)
          setGridSabc(grdObj1);
      }
    }

    const grdObj2 = getViewInfo(vom.active, "gridAccount");
    if (grdObj2) {
      if (grdObj2.dataProvider) {
        if (gridAccount != grdObj2)
          setGridAccount(grdObj2);
      }
    }

    if (locationSearchBoxRef) {
      if (locationSearchBoxRef.current) {
        setCurrentLocationRef(locationSearchBoxRef.current);
      }
    }

    if (itemSearchBoxRef) {
      if (itemSearchBoxRef.current) {
        setCurrentItemRef(itemSearchBoxRef.current);
      }
    }
  }, [viewData]);

  useEffect(() => {
    setViewInfo(vom.active, 'globalButtons', globalButtons);

    if (gridSabc && gridAccount) {
      setOptionsGridSabc(gridSabc);
      loadSabc();
    }
  }, [gridSabc, gridAccount]);

  function afterGridSabc(gridObj) {
    setGridSabc(gridObj);
  }

  function afterGridAccount(gridObj) {
    setGridAccount(gridObj);
    setOptionsGridAccount(gridObj);
  }

  function onSetSABC(gridRow) {
    gridSabc.gridView.commit(true);
    let itemIndex = gridSabc.gridView.getCurrent().dataRow;

    gridSabc.dataProvider.setValue(itemIndex, 'SABC_VAL', gridRow.SABC_VAL);
  }

  function openSabcBundleCreate() {
    setSabcBundleCreateOpen(true);
  }

  function refresh() {
    currentLocationRef.reset();
    currentItemRef.reset();
    gridSabc.dataProvider.clearRows();
    gridAccount.dataProvider.clearRows();
  }

  function setOptionsGridSabc(gridObj) {
    setVisibleProps(gridObj, true, true, false);
    gridObj.gridView.setDisplayOptions({
      fitStyle: "fill"
    });

    gridObj.gridView.setColumnProperty("LOCAT_TP_NM", "mergeRule", { criteria: "value" });
    gridObj.gridView.setColumnProperty("LOCAT_LV", "mergeRule", { criteria: "prevvalues + value" });
    gridObj.gridView.setColumnProperty("LOCAT_CD", "mergeRule", { criteria: "prevvalues + value" });
    gridObj.gridView.setColumnProperty("LOCAT_NM", "mergeRule", { criteria: "prevvalues + value" });

    gridObj.gridView.onCellClicked = function (grid, clickData) {
      if (clickData.cellType === 'data') {
        if (!(clickData.editable || (grid.getColumn(clickData.fieldIndex).renderer.type === 'check' && grid.getColumn(clickData.fieldIndex).renderer.editable) || grid.getColumn(clickData.fieldIndex).button === 'action')) {
          let sabcId = grid.getValue(clickData.itemIndex, 'ID');

          if (sabcId != null) {
            loadAccountDetail(sabcId)
          }
        }
      }
    }

    gridObj.gridView.onCellButtonClicked = function (grid, clickData, column) {
      if (column.fieldName === 'SABC_VAL') {
        setPopupData(grid.getValues(clickData.itemIndex));
        setSabcPopupOpen(true);
      }
    }

    gridObj.gridView.setFixedOptions({ colCount: 2, resizable: true });
  }

  function setOptionsGridAccount(gridObj) {
    setVisibleProps(gridObj, true, false, false);
    gridObj.gridView.setDisplayOptions({
      fitStyle: "fill"
    });

    gridObj.gridView.setColumnProperty("LOCAT_TP_NM", "mergeRule", { criteria: "value" });
    gridObj.gridView.setColumnProperty("LOCAT_LV", "mergeRule", { criteria: "prevvalues + value" });
    gridObj.gridView.setColumnProperty("LOCAT_CD", "mergeRule", { criteria: "prevvalues + value" });
    gridObj.gridView.setColumnProperty("LOCAT_NM", "mergeRule", { criteria: "prevvalues + value" });

    gridObj.gridView.setColumnProperty("ITEM_CD", "mergeRule", { criteria: "prevvalues + value" });
    gridObj.gridView.setColumnProperty("ITEM_NM", "mergeRule", { criteria: "prevvalues + value" });
    gridObj.gridView.setColumnProperty("ITEM_TP", "mergeRule", { criteria: "prevvalues + value" });
    gridObj.gridView.setColumnProperty("UOM_NM", "mergeRule", { criteria: "prevvalues + value" });
    gridObj.gridView.setColumnProperty("SABC_VAL", "mergeRule", { criteria: "prevvalues + value" });
    gridObj.gridView.setColumnProperty("PRPSAL_SVC_LV", "mergeRule", { criteria: "prevvalues + value" });

    gridObj.gridView.setFixedOptions({ colCount: 2, resizable: true });
  }

  function loadSabc() {
    let dataArr;
    let param = new URLSearchParams();
    param.append('LOCAT_TP', currentLocationRef.getLocationType());
    param.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    param.append('LOCAT_CD', currentLocationRef.getLocationCode());
    param.append('LOCAT_NM', currentLocationRef.getLocationName());
    param.append('ITEM_CD', currentItemRef.getItemCode());
    param.append('ITEM_NM', currentItemRef.getItemName());
    param.append('ITEM_TP', currentItemRef.getItemType());
    param.append('timeout', 0);
    param.append('CURRENT_OPERATION_CALL_ID', 'OPC_GRID_LOAD');

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_IM_08_Q1',
      data: param
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          dataArr = [];
          dataArr = res.data.RESULT_DATA;

          gridSabc.dataProvider.fillJsonData(dataArr);

          if (gridSabc.dataProvider.getRowCount() == 0) {
            gridSabc.gridView.setDisplayOptions({ showEmptyMessage: true, emptyMessage: transLangKey('MSG_NO_DATA') });
          }

          gridAccount.dataProvider.clearRows();
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function loadAccountDetail(sabcId) {
    let param = new URLSearchParams();

    param.append('SABC_ID', sabcId);
    param.append('timeout', 0);
    param.append('CURRENT_OPERATION_CALL_ID', 'OPC_RST_CPT_02_OPEN');

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_IM_08_Q2',
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridAccount.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function saveSabc() {
    gridSabc.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridSabc.dataProvider.getAllStateRows().created,
          gridSabc.dataProvider.getAllStateRows().updated,
          gridSabc.dataProvider.getAllStateRows().deleted,
          gridSabc.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          changeRowData.push(gridSabc.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          let param = new URLSearchParams();

          param.append('changes', JSON.stringify(changeRowData));
          param.append('USER_ID', username);
          param.append('timeout', 0);
          param.append('CURRENT_OPERATION_CALL_ID', 'OPC_RST_BTN_SAV_01');

          zAxios({
            method: 'post',
            header: { 'content-type': 'application/json' },
            url: baseURI() + 'engine/mp/SRV_UI_IM_08_S1',
            params: param
          })
          .then(function (res) {
            if (res.status === gHttpStatus.SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_IM_08_S1_P_RT_MSG), { close: false });
              loadSabc();
            }
          })
          .catch(function (err) {
            console.log(err);
          });
        }
      }
    });
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <LocationSearchBox ref={locationSearchBoxRef} keyValue={"locationName"} placeHolder={transLangKey("LOCAT_NM")} />
            <ItemSearchBox ref={itemSearchBoxRef} keyValue={"itemName"} placeHolder={transLangKey("ITEM_NM")} />
          </SearchRow>
        </SearchArea>
        <ResultArea sizes={[60, 40]} direction={"vertical"}>
          <Box sx={{ display: "flex", height: "100%", flexDirection: "column", alignContent: "stretch", alignItems: "stretch" }}>
            <ButtonArea>
              <LeftButtonArea>
                <GridExcelExportButton type="icon" grid="gridSabc" options={exportExcelOptions} />
                <CommonButton title={transLangKey("BUNDLE_CREATE")} onClick={() => { openSabcBundleCreate() }}><Icon.File/></CommonButton>
              </LeftButtonArea>
              <RightButtonArea>
                <GridSaveButton type="icon" onClick={() => { saveSabc() }} />
              </RightButtonArea>
            </ButtonArea>
            <Box style={{ height: "calc(100% - 60px)" }}>
              <BaseGrid id="gridSabc" items={gridSabcColumns} afterGridCreate={afterGridSabc} />
            </Box>
          </Box>
          <Box>
            <Box style={{ height: "calc(100% - 10px)" }}>
              <BaseGrid id="gridAccount" items={gridAccountColumns} afterGridCreate={afterGridAccount} />
            </Box>
          </Box>
        </ResultArea>
      </ContentInner>

      {sabcPopupOpen && (<PopSABC open={sabcPopupOpen} onClose={() => { setSabcPopupOpen(false); }} confirm={onSetSABC} data={popupData} />)}
      {sabcBundleCreateOpen && (<PopSabcBundleCreate open={sabcBundleCreateOpen} onClose={() => { setSabcBundleCreateOpen(false); }} confirm={loadSabc} />)}
    </>
  )
}

export default Sabc;
