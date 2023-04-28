import React, { useState, useEffect, useRef } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import {
  BaseGrid, ButtonArea, CommonButton, ContentInner, GridExcelExportButton, GridSaveButton, LeftButtonArea,
  RightButtonArea, SearchArea, SearchRow, useUserStore, useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';
import { setGridComboList } from "@wingui/view/supplychainmodel/common/common";

import PopInventoryPolicyBundleCreate from './PopInventoryPolicyBundleCreate';
import PopCyclCalendar from '@wingui/view/supplychainmodel/common/PopCyclCalendar';
import LocationSearchBox from '@wingui/view/supplychainmodel/common/LocationSearchBox';

let gridSabcColumns = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false },
  { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: 120 },
  { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: 120 },
  { name: "GRADE", dataType: "text", headerText: "GRADE", visible: true, editable: false, width: 80, autoFilter: true },
  { name: "ITEM_CNT", dataType: "number", headerText: "ITEM_CNT", visible: true, editable: false, width: 80 },
  {
    name: "STOCK_MGMT_SYSTEM", dataType: "group", orientation: "horizontal", headerText: "STOCK_MGMT_SYSTEM", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "INV_MGMT_SYSTEM_TP_ID", dataType: "dropdown", headerText: "STOCK_MGMT_SYSTEM_TP", visible: true, editable: true, width: 120, useDropdown: true, lookupDisplay: true },
      { name: "PO_CYCL_CD_ID", dataType: "dropdown", headerText: "PO_CYCL_CD", visible: true, editable: false, width: 160, useDropdown: true, lookupDisplay: true },
      { name: "PO_CYCL_CALENDAR_ID", dataType: "text", headerText: "PO_CYCL_CALENDAR_ID", visible: false, editable: false, width: 150 },
      { name: "PO_CYCL_CALENDAR", dataType: "text", headerText: "PO_CYCL_CALENDAR", visible: true, visible: true, editable: true, width: 150 , button:"action", buttonVisibility: "always" },
      { name: "INV_PLACE_STRTGY_ID", dataType: "dropdown", headerText: "STOCK_PLACE_STRTGY", visible: true, editable: true, width: 160, useDropdown: true, lookupDisplay: true }
    ]
  },
  {
    name: "SFST_VAL", dataType: "group", orientation: "horizontal", headerText: "OPERT_TARGET_VAL", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "SUPPLY_LEADTIME_YN", dataType: "boolean", headerText: "SUPPLY_LEADTIME_YN", visible: true, editable: true, width: 100 },
      { name: "OPERT_LV_VAL", dataType: "number", headerText: "OPERT_LV_VAL", visible: true, editable: true, width: 100 }
    ]
  },
  {
    name: "SFST_VAL", dataType: "group", orientation: "horizontal", headerText: "SFST_VAL", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "PRPSAL_SVC_LV", dataType: "number", headerText: "PRPSAL_SVC_LV", visible: true, editable: false, width: 120 },
      { name: "SFST_SVC_LV", dataType: "number", headerText: "SFST_SVC_LV", visible: true, editable: true, width: 100 },
      { name: "SFST_DEMDVAR_CONSID_YN", dataType: "boolean", headerText: "SFST_DEMDVAR_CONSID_YN", visible: true, editable: false, width: 180 },
      { name: "SFST_SUPYVAR_CONSID_YN", dataType: "boolean", headerText: "SFST_SUPYVAR_CONSID_YN", visible: true, editable: true, width: 180 }
    ]
  },
  {
    name: "ROP_VAL", dataType: "group", orientation: "horizontal", headerText: "ROP_VAL", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "ROP_CAL_TP_ID", dataType: "dropdown", headerText: "ROP_CAL_TP_ID", visible: true, editable: true, width: 140, useDropdown: true, lookupDisplay: true },
      { name: "ROP_SFST_CONSID_YN", dataType: "boolean", headerText: "ROP_SFST_CONSID_YN", visible: true, editable: true, width: 140 },
      { name: "ROP_OPERT_INV_CONSID_YN", dataType: "boolean", headerText: "ROP_OPERT_STOCK_CONSID_YN", visible: true, editable: true, width: 160 },
      { name: "ROP_RIGHT_RATE_YN", dataType: "boolean", headerText: "ROP_RIGHT_RATE_YN", visible: true, editable: true, width: 100 }
    ]
  },
  {
    name: "EOQ_VAL", dataType: "group", orientation: "horizontal", headerText: "EOQ_VAL", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "EOQ_CAL_TP_ID", dataType: "dropdown", headerText: "EOQ_CAL_TP_ID", visible: true, editable: true, width: 140, useDropdown: true, lookupDisplay: true },
      { name: "EOQ_RIGHT_RATE_YN", dataType: "boolean", headerText: "EOQ_RIGHT_RATE_YN", visible: true, editable: true, width: 100 },
      { name: "EOQ_MULTIPLE", dataType: "number", headerText: "EOQ_MULTIPLE", visible: true, editable: true, width: 100 }
    ]
  },
  {
    name: "TARGET_STOCK", dataType: "group", orientation: "horizontal", headerText: "TARGET_STOCK", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "TARGET_INV_SFST_CONSID_YN", dataType: "boolean", headerText: "TARGET_STOCK_SFST_CONSID_YN", visible: true, editable: true, width: 140 },
      { name: "TARGET_INV_OPERT_INV_CONSID_YN", dataType: "boolean", headerText: "TARGET_INV_OPERT_INV_CONSID_YN", visible: true, editable: true, width: 160 }
    ]
  },
  { name: "FIXED_YN", dataType: "boolean", headerText: "FIXED_YN", visible: false, editable: false, width: 80 },
  { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: false, editable: false, width: 80 }
]

let gridCovColumns = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false },
  {
    name: "LOCATION", dataType: "group", orientation: "horizontal", headerText: "LOCAT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: 120, groupShowMode: "expand" },
      { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: 120, groupShowMode: "expand" },
      { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: 120, groupShowMode: "always" },
      { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: 120, groupShowMode: "always" }
    ]
  },
  {
    name: "SEGMT_BASE", dataType: "group", orientation: "horizontal", headerText: "SEGMT_BASE", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "VAL_01", dataType: "text", headerText: "VAL_01", visible: true, editable: false, width: 50 },
      { name: "QUADRANT_DESCRIP", dataType: "text", headerText: "QUADRANT_DESCRIP", visible: true, editable: false, width: 180, lang: true},
      { name: "VAL_02", dataType: "text", headerText: "VAL_02", visible: true, editable: false, width: 70 }
    ]
  },
  { name: "VAL_03", dataType: "text", headerText: "VAL_03", visible: false, editable: false, width: 100 },
  { name: "VAL_04", dataType: "text", headerText: "VAL_04", visible: false, editable: false, width: 70 },
  { name: "VAL_05", dataType: "text", headerText: "VAL_05", visible: false, editable: false, width: 150 },
  { name: "VAL_06", dataType: "text", headerText: "VAL_06", visible: false, editable: false, width: 110 },
  { name: "VAL_07", dataType: "text", headerText: "VAL_07", visible: false, editable: false, width: 120 },
  { name: "VAL_08", dataType: "text", headerText: "VAL_08", visible: false, editable: false, width: 120 },
  { name: "VAL_09", dataType: "text", headerText: "VAL_09", visible: false, editable: false, width: 120 },
  { name: "VAL_10", dataType: "text", headerText: "VAL_10", visible: false, editable: false, width: 120 },
  { name: "VAL_11", dataType: "text", headerText: "VAL_11", visible: false, editable: false, width: 120 },
  { name: "VAL_12", dataType: "text", headerText: "VAL_12", visible: false, editable: false, width: 120 },
  { name: "VAL_13", dataType: "text", headerText: "VAL_13", visible: false, editable: false, width: 120 },
  { name: "VAL_14", dataType: "text", headerText: "VAL_14", visible: false, editable: false, width: 120 },
  { name: "VAL_15", dataType: "text", headerText: "VAL_15", visible: false, editable: false, width: 120 },
  { name: "VAL_16", dataType: "text", headerText: "VAL_16", visible: false, editable: false, width: 120 },
  { name: "VAL_17", dataType: "text", headerText: "VAL_17", visible: false, editable: false, width: 120 },
  { name: "VAL_18", dataType: "text", headerText: "VAL_18", visible: false, editable: false, width: 120 },
  { name: "VAL_19", dataType: "text", headerText: "VAL_19", visible: false, editable: false, width: 120 },
  { name: "VAL_20", dataType: "text", headerText: "VAL_20", visible: false, editable: false, width: 120 },
  { name: "ITEM_CNT", dataType: "number", headerText: "ITEM_CNT", visible: true, editable: false, width: 80 },
  {
    name: "STOCK_MGMT_SYSTEM", dataType: "group", orientation: "horizontal", headerText: "STOCK_MGMT_SYSTEM", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "INV_MGMT_SYSTEM_TP_ID", dataType: "dropdown", headerText: "STOCK_MGMT_SYSTEM_TP", visible: true, editable: true, width: 120, useDropdown: true, lookupDisplay: true },
      { name: "PO_CYCL_CD_ID", dataType: "dropdown", headerText: "PO_CYCL_CD", visible: true, editable: false, width: 160, useDropdown: true, lookupDisplay: true },
      { name: "PO_CYCL_CALENDAR_ID", dataType: "text", headerText: "PO_CYCL_CALENDAR_ID", visible: false, editable: false, width: 150 },
      { name: "PO_CYCL_CALENDAR", dataType: "text", headerText: "PO_CYCL_CALENDAR", visible: true, visible: true, editable: true, width: 150 , button:"action", buttonVisibility: "always" },
      { name: "INV_PLACE_STRTGY_ID", dataType: "dropdown", headerText: "STOCK_PLACE_STRTGY", visible: true, editable: true, width: 160, useDropdown: true, lookupDisplay: true }
    ]
  },
  {
    name: "OPERT_TARGET_VAL", dataType: "group", orientation: "horizontal", headerText: "OPERT_TARGET_VAL", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "SUPPLY_LEADTIME_YN", dataType: "boolean", headerText: "SUPPLY_LEADTIME_YN", visible: true, editable: true, width: 100 },
      { name: "OPERT_LV_VAL", dataType: "number", headerText: "OPERT_LV_VAL", visible: true, editable: true, width: 100 }
    ]
  },
  {
    name: "SFST_VAL", dataType: "group", orientation: "horizontal", headerText: "SFST_VAL", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "PRPSAL_SVC_LV", dataType: "number", headerText: "PRPSAL_SVC_LV", visible: true, editable: false, width: 120 },
      { name: "SFST_SVC_LV", dataType: "number", headerText: "SFST_SVC_LV", visible: true, editable: true, width: 100 },
      { name: "SFST_DEMDVAR_CONSID_YN", dataType: "boolean", headerText: "SFST_DEMDVAR_CONSID_YN", visible: true, editable: false, width: 180 },
      { name: "SFST_SUPYVAR_CONSID_YN", dataType: "boolean", headerText: "SFST_SUPYVAR_CONSID_YN", visible: true, editable: true, width: 180 }
    ]
  },
  {
    name: "ROP_VAL", dataType: "group", orientation: "horizontal", headerText: "ROP_VAL", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "ROP_CAL_TP_ID", dataType: "dropdown", headerText: "ROP_CAL_TP_ID", visible: true, editable: true, width: 140, useDropdown: true, lookupDisplay: true },
      { name: "ROP_SFST_CONSID_YN", dataType: "boolean", headerText: "ROP_SFST_CONSID_YN", visible: true, editable: true, width: 140 },
      { name: "ROP_OPERT_INV_CONSID_YN", dataType: "boolean", headerText: "ROP_OPERT_STOCK_CONSID_YN", visible: true, editable: true, width: 160 },
      { name: "ROP_RIGHT_RATE_YN", dataType: "boolean", headerText: "ROP_RIGHT_RATE_YN", visible: true, editable: true, width: 100 }
    ]
  },
  {
    name: "EOQ_VAL", dataType: "group", orientation: "horizontal", headerText: "EOQ_VAL", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "EOQ_CAL_TP_ID", dataType: "dropdown", headerText: "EOQ_CAL_TP_ID", visible: true, editable: true, width: 140, useDropdown: true, lookupDisplay: true },
      { name: "EOQ_RIGHT_RATE_YN", dataType: "boolean", headerText: "EOQ_RIGHT_RATE_YN", visible: true, editable: true, width: 100 },
      { name: "EOQ_MULTIPLE", dataType: "number", headerText: "EOQ_MULTIPLE", visible: true, editable: true, width: 100 }
    ]
  },
  {
    name: "TARGET_STOCK_VAL", dataType: "group", orientation: "horizontal", headerText: "TARGET_STOCK_VAL", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "TARGET_INV_SFST_CONSID_YN", dataType: "boolean", headerText: "TARGET_STOCK_SFST_CONSID_YN", visible: true, editable: true, width: 160 },
      { name: "TARGET_INV_OPERT_INV_CONSID_YN", dataType: "boolean", headerText: "TARGET_INV_OPERT_INV_CONSID_YN", visible: true, editable: true, width: 160 }
    ]
  },
  { name: "FIXED_YN", dataType: "boolean", headerText: "FIXED_YN", visible: false, editable: false, width: 80 },
  { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: false, editable: false, width: 80 }
]

function InventoryPolicy() {
  const [gridSabc, setGridSabc] = useState(null);
  const [gridCov, setGridCov] = useState(null);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [username] = useUserStore(state => [state.username]);

  const [popupData, setPopupData] = useState({});
  const [tabValue, setTabValue] = useState('gridCov');

  const [cyclCalendarOpen, setCyclCalendarOpen] = useState(false);
  const [inventoryPolicyBundleCreateOpen, setInventoryPolicyBundleCreateOpen] = useState(false);

  const locationSearchBoxRef = useRef();
  const [currentLocationRef, setCurrentLocationRef] = useState();

  const exportExcelOptions = {
    headerDepth: 2,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  }

  useEffect(() => {
    if (locationSearchBoxRef) {
      if (locationSearchBoxRef.current) {
        setCurrentLocationRef(locationSearchBoxRef.current);
      }
    }

  }, [viewData])

  useEffect(() => {
    setViewInfo(vom.active, 'globalButtons', [
      { name: 'search', action: (e) => { onSubmit(tabValue); }, visible: true, disable: false },
      { name: 'refresh', action: (e) => { refresh(tabValue); }, visible: true, disable: false }
    ]);

    if (gridSabc && gridCov) {
      loadSabc();
      loadCov();
    }
  }, [gridSabc, gridCov])

  function afterGridSABC(gridObj) {
    setGridSabc(gridObj);
    setGridSABCOptions(gridObj);
  }

  function afterGridCov(gridObj) {
    setGridCov(gridObj);
    setGridCovOptions(gridObj);
  }

  const tabChange = (event, newValue) => {
    setViewInfo(vom.active, 'globalButtons', [
      { name: 'search', action: (e) => { onSubmit(newValue); }, visible: true, disable: false, },
      { name: 'refresh', action: (e) => { refresh(newValue); }, visible: true, disable: false, }
    ])

    setTabValue(newValue);
  }

  const onSetPoCyclCalendar = (gridRow) => {
    let gridView = gridSabc.gridView;
    let dataProvider = gridSabc.dataProvider;

    if (tabValue === 'gridCov') {
      gridView = gridCov.gridView;
      dataProvider = gridCov.dataProvider;
    }

    let itemIndex = gridView.getCurrent().dataRow;
    dataProvider.setValue(itemIndex, 'PO_CYCL_CALENDAR_ID', gridRow.ID);
    dataProvider.setValue(itemIndex, 'PO_CYCL_CALENDAR', gridRow.CALENDAR_ID);
  }

  function setGridSABCOptions(gridObj) {
    gridObj.gridView.setEditOptions({
      insertable: true,
      appendable: true,
    });
    gridObj.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridObj, true, true, false);

    gridObj.gridView.setFixedOptions({ colCount: 4, resizable: true });

    gridObj.gridView.setColumnProperty('LOCAT_TP_NM', 'mergeRule', { criteria: 'value' });
    gridObj.gridView.setColumnProperty('LOCAT_LV', 'mergeRule', { criteria: 'prevvalues + value' });

    gridObj.gridView.onCellButtonClicked = function (grid, clickData, column) {
      if (column.fieldName === 'PO_CYCL_CALENDAR') {
        setPopupData(grid.getValues(clickData.itemIndex));
        setCyclCalendarOpen(true);
      }
    }

    setGridComboList(gridObj,
      'INV_MGMT_SYSTEM_TP_ID, PO_CYCL_CD_ID, INV_PLACE_STRTGY_ID, ROP_CAL_TP_ID, EOQ_CAL_TP_ID',
      'INVENTORY_MGMT_SYSTEM_TYPE, PERIODIC_PO_YN, STOCK_LOCATION_STRATEGY, ROP_DECISION_RULE, EOQ_DECISION_RULE'
    );
  }

  function setGridCovOptions(gridObj) {
    gridObj.gridView.setEditOptions({
      insertable: true,
      appendable: true
    });
    gridObj.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridObj, true, true, false);

    gridObj.gridView.setFixedOptions({ colCount: 1, resizable: true });

    gridObj.gridView.setColumnProperty('LOCAT_TP_NM', 'mergeRule', { criteria: 'value' });
    gridObj.gridView.setColumnProperty('LOCAT_LV', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('LOCAT_CD', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('LOCAT_NM', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('VAL_01', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('QUADRANT_DESCRIP', 'mergeRule', { criteria: 'prevvalues + value' });

    gridObj.gridView.onCellButtonClicked = function (grid, clickData, column) {
      if (column.fieldName === 'PO_CYCL_CALENDAR') {
        setPopupData(grid.getValues(clickData.itemIndex));
        setCyclCalendarOpen(true);
      }
    }

    setGridComboList(gridObj,
      'INV_MGMT_SYSTEM_TP_ID, PO_CYCL_CD_ID, INV_PLACE_STRTGY_ID, ROP_CAL_TP_ID, EOQ_CAL_TP_ID',
      'INVENTORY_MGMT_SYSTEM_TYPE, PERIODIC_PO_YN, STOCK_LOCATION_STRATEGY, ROP_DECISION_RULE, EOQ_DECISION_RULE'
    );
  }

  function refresh(activeTab) {
    currentLocationRef.reset();

    if (activeTab === 'gridSabc') {
      gridSabc.dataProvider.clearRows();
    } else if (activeTab === 'gridCov') {
      gridCov.dataProvider.clearRows();
    }
  }

  function onSubmit(activeTab) {
    if (activeTab === 'gridSabc') {
      loadSabc();
    } else if (activeTab === 'gridCov') {
      loadCov();
    }
  }

  function loadSabc() {
    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_IM_25_Q1',
      data: new FormData()
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridSabc.dataProvider.fillJsonData(res.data.RESULT_DATA);
      }
    }).catch(function (err) {
      console.log(err);
    });
  }

  function loadCov() {
    let param = new FormData();

    param.append('LOCAT_TP', currentLocationRef.getLocationType());
    param.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    param.append('LOCAT_CD', currentLocationRef.getLocationCode());
    param.append('LOCAT_NM', currentLocationRef.getLocationName());

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_IM_25_Q2',
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridCov.dataProvider.fillJsonData(res.data.RESULT_DATA);
      }
    }).catch(function (err) {
      console.log(err);
    });
  }

  function saveSabc(targetGrid) {
    targetGrid.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changes = [];
        let changeRowData = [];

        changes = changes.concat(
          targetGrid.dataProvider.getAllStateRows().created,
          targetGrid.dataProvider.getAllStateRows().updated,
          targetGrid.dataProvider.getAllStateRows().deleted,
          targetGrid.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          changeRowData.push(targetGrid.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'));
        } else {
          let param = new FormData();

          param.append('APPLY_TARGET', 'GRADE');
          param.append('changes', JSON.stringify(changeRowData));
          param.append('USER_ID', username);

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_UI_IM_25_S1',
            data: param
          })
          .then(function (res) {
            if (res.status === gHttpStatus.SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_IM_25_S1_P_RT_MSG), { close: false });
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

  function saveCov(targetGrid) {
    targetGrid.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changes = [];
        let changeRowData = [];

        changes = changes.concat(
          targetGrid.dataProvider.getAllStateRows().created,
          targetGrid.dataProvider.getAllStateRows().updated,
          targetGrid.dataProvider.getAllStateRows().deleted,
          targetGrid.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          changeRowData.push(targetGrid.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'));
        } else {
          let param = new FormData();

          param.append('APPLY_TARGET', 'LOCAT_SEGMT');
          param.append('changes', JSON.stringify(changeRowData));
          param.append('USER_ID', username);

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_UI_IM_25_S1',
            data: param
          })
          .then(function (res) {
            if (res.status === gHttpStatus.SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_IM_25_S1_P_RT_MSG), { close: false });
              loadCov();
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
            <LocationSearchBox ref={locationSearchBoxRef} keyValue={'locationName'} placeHolder={transLangKey("LOCAT_NM")} style={{ display : tabValue == 'gridSabc' ? 'none' : 'block' }} />
          </SearchRow>
        </SearchArea>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={tabChange} indicatorColor="primary">
            <Tab label={transLangKey("GRADE")} value="gridSabc" />
            <Tab label={transLangKey("LOCAT_SEGMENT")} value="gridCov" />
          </Tabs>
        </Box>

        <Box style={{ marginTop: "3px", width: "100%", height: "100%" }}>
          <Box sx={{ height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "gridSabc" ? "block" : "none" }}>
            <ButtonArea>
              <LeftButtonArea>
                <GridExcelExportButton type="icon" grid="gridSabc" options={exportExcelOptions} />
                <CommonButton title={transLangKey("BUNDLE_CREATE")} onClick={() => { setInventoryPolicyBundleCreateOpen(true) }}><Icon.File/></CommonButton>
              </LeftButtonArea>
              <RightButtonArea>
                <GridSaveButton type="icon" onClick={() => { saveSabc(gridSabc) }} />
              </RightButtonArea>
            </ButtonArea>
            <Box style={{ height: "100%" }}>
              <BaseGrid id="gridSabc" items={gridSabcColumns} afterGridCreate={afterGridSABC} />
            </Box>
          </Box>
          <Box sx={{ height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "gridCov" ? "block" : "none" }}>
            <ButtonArea>
              <LeftButtonArea>
                <GridExcelExportButton type="icon" grid="gridCov" options={exportExcelOptions} />
                <CommonButton title={transLangKey("BUNDLE_CREATE")} onClick={() => { setInventoryPolicyBundleCreateOpen(true) }}><Icon.File/></CommonButton>
              </LeftButtonArea>
              <RightButtonArea>
                <GridSaveButton type="icon" onClick={() => { saveCov(gridCov) }} />
              </RightButtonArea>
            </ButtonArea>
            <Box style={{ height: "100%" }}>
              <BaseGrid id="gridCov" items={gridCovColumns} afterGridCreate={afterGridCov} />
            </Box>
          </Box>
        </Box>
      </ContentInner>

      {cyclCalendarOpen && (<PopCyclCalendar open={cyclCalendarOpen} onClose={() => { setCyclCalendarOpen(false) }} confirm={onSetPoCyclCalendar} />)}
      {inventoryPolicyBundleCreateOpen && (<PopInventoryPolicyBundleCreate open={inventoryPolicyBundleCreateOpen} onClose={() => { setInventoryPolicyBundleCreateOpen(false) }} confirm={onSubmit} tab={tabValue} />)}
    </>
  );
}

export default InventoryPolicy;
