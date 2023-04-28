import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Tab, Tabs } from '@mui/material';
import {
  ContentInner, SearchArea, SearchRow, ButtonArea, LeftButtonArea, RightButtonArea, GridExcelExportButton, GridAddRowButton,
  GridSaveButton, GridDeleteRowButton, CommonButton, InputField, BaseGrid, useUserStore, useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';
import { setGridComboList } from "@wingui/view/supplychainmodel/common/common";
import { getCodeList } from "@wingui/view/supplychainmodel/common/common";

import LocationSearchBox from '@wingui/view/supplychainmodel/common/LocationSearchBox';
import PopCommResource from '@wingui/view/supplychainmodel/common/PopCommResource';
import PopResourceGroup from './PopResourceGroup';
import PopResourceBundleCreate from './PopResourceBundleCreate';
import PopResourceNew2 from './PopResourceNew2';
import PopResourceNew3 from './PopResourceNew3';
import PopResourceNew4 from './PopResourceNew4';
import PopResourceNew5 from './PopResourceNew5';

let gridResourceColumns = [
  { name: 'RES_MST_ID', dataType: 'text', headerText: 'RES_MST_ID', visible: false, editable: false, width: '100' },
  { name: 'RES_DTL_ID', dataType: 'text', headerText: 'RES_DTL_ID', visible: false, editable: false, width: '100' },
  { name: 'LOC_MGMT_ID', dataType: 'text', headerText: 'LOC_MGMT_ID', visible: false, editable: false, width: '100' },
  { name: 'LOCATION_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'LOCAT', expandable: true, expanded: false,
    childs: [
      { name: 'LOCAT_TP_NM', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: '120', groupShowMode: 'expand' },
      { name: 'LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: '120', groupShowMode: 'expand' },
      { name: 'LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: '120', groupShowMode: 'always' },
      { name: 'LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: '120', groupShowMode: 'always' }
    ]
  },
  { name: 'MP_RES_GRP', dataType: 'group', orientation: 'horizontal', headerText: 'MP_RES_GRP', expandable: true, expanded: false,
    childs: [
      { name: 'PLAN_RES_TP', dataType: 'text', headerText: 'PLAN_RES_TP', visible: true, editable: false, width: '150', groupShowMode: 'expand' },
      { name: 'RES_GRP_CD', dataType: 'text', headerText: 'RES_GRP_CD', visible: true, editable: false, width: '150', groupShowMode: 'always' },
      { name: 'RES_GRP_DESCRIP', dataType: 'text', headerText: 'RES_GRP_DESCRIP', visible: true, editable: false, width: '180', groupShowMode: 'always' },
      { name: 'RES_GRP_TP', dataType: 'text', headerText: 'RES_GRP_TP', visible: true, editable: false, width: '150', groupShowMode: 'expand' },
      { name: 'WC', dataType: 'text', headerText: 'WC', visible: true, editable: false, width: '100', groupShowMode: 'always' }
    ]
  },
  { name: 'RES_CAPA_CAL_BASE_ID', dataType: 'text', headerText: 'RES_CAPA_CAL_CRITERIA', visible: true, editable: true, width: '120', useDropdown: true, lookupDisplay: true },
  { name: 'RES_CD', dataType: 'text', headerText: 'RES_CD', visible: true, editable: true, width: '100', button: 'action' },
  { name: 'RES_DESCRIP', dataType: 'text', headerText: 'RES_DESCRIP', visible: true, editable: true, width: '120' },
  { name: 'GRP_RES_PRDUCT_TIME_CAL', dataType: 'text', headerText: 'GRP_RES_PRDUCT_TIME_CAL', visible: false, editable: true, width: '150', useDropdown: true, lookupDisplay: true },
  { name: 'DEFAT_RES_YN', dataType: 'boolean', headerText: 'DEFAT_RES_YN', visible: true, editable: true, width: '80' },
  { name: 'OUTSRC_YN', dataType: 'boolean', headerText: 'OUTSRC_YN', visible: true, editable: true, width: '80' },
  { name: 'BATCH_RES_YN', dataType: 'boolean', headerText: 'BATCH_RES_YN', visible: true, editable: true, width: '80' },
  { name: 'TOOL_RES_YN', dataType: 'boolean', headerText: 'TOOL_RES_YN', visible: true, editable: true, width: '80' },
  { name: 'CAPA_MGMT_PERIOD_ID', dataType: 'text', headerText: 'CAPA_MGMT_PERIOD', visible: true, editable: true, width: '120', useDropdown: true, lookupDisplay: true },
  { name: 'DEFAT_CAPA_VAL', dataType: 'number', headerText: 'DEFAT_CAPA_VAL', visible: true, editable: true, width: '100' },
  { name: 'DEFAT_OVR_CAPA_VAL', dataType: 'number', headerText: 'DEFAT_OVR_CAPA_VAL', visible: true, editable: true, width: '120' },
  { name: 'DEFAT_EFFICY_VAL', dataType: 'number', headerText: 'DEFAT_EFFICY_VAL', visible: true, editable: true, width: '100' },
  { name: 'JC_CAPACITY', dataType: 'number', headerText: 'JC_CAPACITY', visible: true, editable: true, width: '120' },
  { name: 'JC_TIME', dataType: 'number', headerText: 'JC_TIME', visible: true, editable: true, width: '100' },
  { name: 'UOM_ID', dataType: 'text', headerText: 'TIME_UOM_NM', visible: true, editable: true, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'DISPLAY_COLOR', dataType: 'text', headerText: 'DISPLAY_COLOR', visible: true, editable: true, width: '100' },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: true, width: '50' },
  {
    name: "EDIT", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      {name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: 100, groupShowMode: "expand"},
      {name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: 140, groupShowMode: "expand"},
      {name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 100, groupShowMode: "always"},
      {name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 140, groupShowMode: "expand"}
    ]
  }
];

let gridResGrpColumns = [
  { name: 'RES_MST_ID', dataType: 'text', headerText: 'RES_MST_ID', visible: false, editable: false, width: '100' },
  { name: 'RES_GRP_ID', dataType: 'text', headerText: 'RES_GRP_ID', visible: false, editable: false, width: '100' },
  { name: 'LOCAT_TP_NM', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: '80' },
  { name: 'LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: '80' },
  { name: 'LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: '80' },
  { name: 'LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: '120' },
  { name: 'LGCY_PLANT_CD', dataType: 'text', headerText: 'LGCY_PLANT_CD', visible: true, editable: false, width: '110' },
  { name: 'ROUTE_GRP', dataType: 'text', headerText: 'ROUTE_GRP', visible: true, editable: false, width: '100' },
  { name: 'ROUTE_GRP_DESCRIP', dataType: 'text', headerText: 'ROUTE_GRP_DESCRIP', visible: true, editable: false, width: '120' },
  { name: 'OPERATION', dataType: 'text', headerText: 'OPERATION', visible: true, editable: false, width: '100' },
  { name: 'OPERATION_DESCRIP', dataType: 'text', headerText: 'OPERATION_DESCRIP', visible: true, editable: false, width: '120' },
  { name: 'WC', dataType: 'text', headerText: 'WC', visible: true, editable: false, width: '90' },
  { name: 'WC_DESCRIP', dataType: 'text', headerText: 'WC_DESCRIP', visible: true, editable: false, width: '170' },
  { name: 'OUTSRC_YN', dataType: 'boolean', headerText: 'OUTSRC_YN', visible: true, editable: false, width: '70' },
  { name: 'RES_GRP_CD', dataType: 'text', headerText: 'RES_GRP_CD', visible: true, editable: true, width: '100', button: 'action' },
  { name: 'RES_GRP_DESCRIP', dataType: 'text', headerText: 'RES_GRP_DESCRIP', visible: true, editable: false, width: '120' },
  { name: 'RES_GRP_TP_ID', dataType: 'text', headerText: 'RES_GRP_TP_ID', visible: false, editable: false, width: '100' },
  { name: 'RES_GRP_TP', dataType: 'text', headerText: 'RES_GRP_TP', visible: true, editable: false, width: '100' },
  { name: 'DEL_YN', dataType: 'boolean', headerText: 'DEL_YN', visible: false, editable: false, width: '50' },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: true, width: '50' },
  {
    name: "EDIT", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      {name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: 100, groupShowMode: "expand"},
      {name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: 140, groupShowMode: "expand"},
      {name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 100, groupShowMode: "always"},
      {name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 140, groupShowMode: "expand"}
    ]
  }
];

let gridSimltResGrpColumns = [
  { name: 'SIMLT_RES_GRP_ID', dataType: 'text', headerText: 'SIMLT_RES_GRP_ID', visible: false, editable: false, width: '100' },
  { name: 'SIMLT_RES_ID', dataType: 'text', headerText: 'SIMLT_RES_ID', visible: false, editable: false, width: '100' },
  { name: 'RES_DTL_ID', dataType: 'text', headerText: 'RES_DTL_ID', visible: false, editable: false, width: '100' },
  { name: 'LOC_MGMT_ID', dataType: 'text', headerText: 'LOC_MGMT_ID', visible: false, editable: false, width: '100' },
  { name: 'ITEM_MST_ID', dataType: 'text', headerText: 'ITEM_MST_ID', visible: false, editable: false, width: '100' },
  { name: 'LOCAT_TP_NM', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: '80' },
  { name: 'LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: '80' },
  { name: 'LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: '80' },
  { name: 'LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: '120' },
  { name: 'ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', visible: true, editable: false, width: '80' },
  { name: 'ITEM_NM', dataType: 'text', headerText: 'ITEM_NM', visible: true, editable: false, width: '120' },
  { name: 'ITEM_TP_NM', dataType: 'text', headerText: 'ITEM_TP_NM', visible: true, editable: false, width: '80' },
  { name: 'ROUTE_CD', dataType: 'text', headerText: 'ROUTE_CD', visible: true, editable: false, width: '100' },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: true, width: '60' },
  { name: 'SIMLT_RES_GRP', dataType: 'text', headerText: 'SIMLT_RES_GRP', visible: true, editable: false, width: '100' },
  { name: 'SIMLT_RES_TP_ID', dataType: 'text', headerText: 'SIMLT_RES_TP', visible: true, editable: true, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'SELECT_YN', dataType: 'boolean', headerText: 'SELECT_YN', visible: true, editable: true, width: '80' },
  { name: 'RES_CD', dataType: 'text', headerText: 'RES_CD', visible: true, editable: false, width: '100' },
  { name: 'RES_DESCRIP', dataType: 'text', headerText: 'RES_DESCRIP', visible: true, editable: false, width: '100' },
  {
    name: "EDIT", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      {name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: 100, groupShowMode: "expand"},
      {name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: 140, groupShowMode: "expand"},
      {name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 100, groupShowMode: "always"},
      {name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 140, groupShowMode: "expand"}
    ]
  }
];

let gridPeriodCapaColumns = [
  { name: 'ID', dataType: 'text', headerText: 'ID', visible: false, editable: false, width: '100' },
  { name: 'RES_ID', dataType: 'text', headerText: 'RES_ID', visible: false, editable: false, width: '100' },
  { name: 'STRT_DTTM', dataType: 'datetime', headerText: 'STRT_DTTM', visible: false, editable: false, width: '100', format: 'yyyy-MM-dd' },
  { name: 'RES_CD', dataType: 'text', headerText: 'RES_CD', visible: true, editable: false, width: '100' },
  { name: 'RES_DESCRIP', dataType: 'text', headerText: 'RES_DESCRIP', visible: true, editable: false, width: '100' },
  { name: 'STRT_DATE', dataType: 'datetime', headerText: 'STRT_DATE', visible: true, editable: true, width: '100', format: 'yyyy-MM-dd' },
  { name: 'END_DATE', dataType: 'datetime', headerText: 'END_DATE', visible: true, editable: true, width: '100', format: 'yyyy-MM-dd' },
  { name: 'CAPA_VAL', dataType: 'number', headerText: 'CAPA_VAL', visible: true, editable: true, width: '100' },
  { name: 'OVR_CAPA_VAL', dataType: 'number', headerText: 'OVR_CAPA_VAL', visible: true, editable: true, width: '100' },
  { name: 'EFFICY_VAL', dataType: 'number', headerText: 'EFFICY_VAL', visible: true, editable: true, width: '100' },
  { name: 'MAX_PRDUCT', dataType: 'group', orientation: 'horizontal', headerText: 'MAX_PRDUCT', expandable: false, expanded: false,
    childs: [
      { name: 'MAX_PRDUCT_MODEL_VAL', dataType: 'number', headerText: 'MAX_PRDUCT_MODEL_VAL', visible: true, editable: true, width: '100' },
      { name: 'GRP_APPY_YN', dataType: 'boolean', headerText: 'GRP_APPY_YN', visible: true, editable: true, width: '100' }
    ]
  },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: true, width: '100' }
];

let gridBottleNeckColumns = [
  { name: 'NECK_RES_ID', dataType: 'text', headerText: 'NECK_RES_ID', visible: false, editable: false, width: '100' },
  { name: 'LOCAT_TP_NM', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: '100' },
  { name: 'LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: '100' },
  { name: 'LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: '100' },
  { name: 'LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: '100' },
  { name: 'RES_CD', dataType: 'text', headerText: 'RES_CD', visible: true, editable: false, width: '100' },
  { name: 'RES_DESCRIP', dataType: 'text', headerText: 'RES_DESCRIP', visible: true, editable: false, width: '100' },
  { name: 'STRT_DTTM', dataType: 'datetime', headerText: 'STRT_DTTM', visible: true, editable: true, width: '100', format: 'yyyy-MM-dd' },
  { name: 'END_DTTM', dataType: 'datetime', headerText: 'END_DTTM', visible: true, editable: true, width: '100', format: 'yyyy-MM-dd' }
];

function Resource() {
  const [username] = useUserStore(state => [state.username]);
  const [gridResGrp, setGridResGrp] = useState(null);
  const [gridResource, setGridResource] = useState(null);
  const [gridSimltResGrp, setGridSimltResGrp] = useState(null);
  const [gridPeriodCapa, setGridPeriodCapa] = useState(null);
  const [gridBottleNeck, setGridBottleNeck] = useState(null);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo])

  const locationSearchBoxRef = useRef();
  const [currentLocationRef, setCurrentLocationRef] = useState();

  const [resourcePopupOpen, setPopupResource] = useState(false);
  const [resourceGroupPopupOpen, setPopupResourceGroup] = useState(false);
  const [topTabValue, setTopTabValue] = React.useState("tabResource");
  const [bottomTabValue, setBottomTabValue] = React.useState("tabPeriodCapa");
  const [comboData, setComboData] = useState({});
  const [selectData, setSelectData] = useState({});
  const [locMgmtId, setLocMgmtId] = useState("");
  const [resId, setResId] = useState("");
  const [resourceBundleCreatePopupOpen, setPopupResourceBundleCreate] = useState(false);
  const [resourceNew2PopupOpen, setPopupResourceNew2] = useState(false);
  const [resourceNew3PopupOpen, setPopupResourceNew3] = useState(false);
  const [resourceNew4PopupOpen, setPopupResourceNew4] = useState(false);
  const [resourceNew5PopupOpen, setPopupResourceNew5] = useState(false);

  const { reset, getValues, setValue, control } = useForm({
    defaultValues: {
      resCd: "",
      resDescrip: "",
      routeCd: "",
      routeDescrip: ""
    }
  });

  const globalButtons = [
    { name: 'search', action: (e) => { onSubmit(topTabValue) }, visible: true, disable: false },
    { name: 'refresh', action: (e) => { refresh() }, visible: true, disable: false }
  ]

  const exportExceloptions = {
    headerDepth: 1,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  };

  useEffect(() => {
    if (locationSearchBoxRef) {
      if (locationSearchBoxRef.current) {
        setCurrentLocationRef(locationSearchBoxRef.current);
      }
    }
  }, [viewData]);

  useEffect(() => {
    setViewInfo(vom.active, 'globalButtons', globalButtons);

    async function initLoad() {
      setCombobox();
      loadResource();
      loadResourceGroup();
      loadSimltResGrp();
    }

    if (gridResource && gridResGrp && gridSimltResGrp && gridPeriodCapa && gridBottleNeck) {
      setGridResourceOptions(gridResource);
      initLoad();
    }
  }, [gridResource, gridResGrp, gridSimltResGrp, gridPeriodCapa, gridBottleNeck]);

  function afterGridResource(gridObj) {
    setGridResource(gridObj);
    setGridResourceOptions(gridObj);
  }

  function afterGridResGrp(gridObj) {
    setGridResGrp(gridObj);
    setGridResGrpOptions(gridObj);
  }

  function afterGridSimltResGrp(gridObj) {
    setGridSimltResGrp(gridObj);
    setGridSimltResGrpOptions(gridObj);
  }

  function afterGridPeriodCapa(gridObj) {
    setGridPeriodCapa(gridObj);
    setGridPeriodCapaOptions(gridObj);
  }

  function afterGridBottleNeck(gridObj) {
    setGridBottleNeck(gridObj);
    setGridBottleNeckOptions(gridObj);
  }

  function setGridResGrpOptions(gridObj) {
    setVisibleProps(gridObj, true, true, false);

    gridObj.gridView.setDisplayOptions({ fitStyle: 'fill' });

    gridObj.gridView.setColumnProperty("LOCAT_TP_NM", "mergeRule", { criteria: "value" });
    gridObj.gridView.setColumnProperty("LOCAT_LV", "mergeRule", { criteria: "prevvalues + values[ 'LOCAT_LV' ]" });

    gridObj.gridView.columnByName("RES_GRP_CD").buttonVisibility = "always";

    gridObj.gridView.onCellButtonClicked = function (grid, index, column) {
      if (column.fieldName === "RES_GRP_CD") {
        setPopupResourceGroup(true);
      }
    }
  }

  function setGridResourceOptions(gridObj) {
    setVisibleProps(gridObj, true, true, true);
    gridObj.gridView.setDisplayOptions({ fitStyle: 'fill' });

    gridObj.gridView.setFixedOptions({colCount: 5, resizable : true});

    gridObj.gridView.setColumnProperty("LOCAT_TP_NM", "mergeRule", { criteria: "value" });

    let columnArr = ["LOCAT_LV", "LOCAT_CD", "LOCAT_NM", "PLAN_RES_TP"];
    for (let i = 0; i < columnArr.length; i++) {
      gridObj.gridView.setColumnProperty(columnArr[i], "mergeRule", { criteria: "prevvalues + value" });
    }

    gridObj.gridView.columnByName("RES_CD").buttonVisibility = "always";

    gridObj.gridView.onDataLoadComplated = function () {
      gridObj.gridView.setFocus();
    }

    gridObj.gridView.onCellButtonClicked = function (grid, index, column) {
      if (column.fieldName === "RES_CD") {
        loadPeriodCapa();
        loadBottleNeckResource();
      }
    }

    setGridComboList(gridObj, 'RES_CAPA_CAL_BASE_ID, GRP_RES_PRDUCT_TIME_CAL, CAPA_MGMT_PERIOD_ID, UOM_ID', 'MP_RES_CAPA_CAL_CRITERIA, BASE_PROD_CAL_LOGIC, CAPA_MGMT_PERIOD, TIME_UOM');
  }

  function setGridSimltResGrpOptions(gridObj) {
    setVisibleProps(gridObj, true, true, true);

    gridObj.gridView.setDisplayOptions({ fitStyle: 'fill' });

    gridObj.gridView.setColumnProperty("LOCAT_TP_NM", "mergeRule", { criteria: "value" });

    let columnArr = ["LOCAT_LV", "LOCAT_CD", "LOCAT_NM", "ITEM_CD", "ITEM_NM", "ITEM_TP_NM", "ROUTE_CD"];
    for (let i = 0; i < columnArr.length; i++) {
      gridObj.gridView.setColumnProperty(columnArr[i], "mergeRule", { criteria: "prevvalues + value" });
    }

    setGridComboList(gridObj, 'SIMLT_RES_TP_ID', 'SIMLT_RES_TP');
  }

  function setGridPeriodCapaOptions(gridObj) {
    setVisibleProps(gridObj, true, true, true);

    gridObj.gridView.setDisplayOptions({ fitStyle: 'fill' });
  }

  function setGridBottleNeckOptions(gridObj) {
    setVisibleProps(gridObj, true, true, true);

    gridObj.gridView.setDisplayOptions({ fitStyle: 'fill' });
  }

  function onSubmit(activeTab) {
    if (activeTab === 'tabResGrp') {
      loadResourceGroup();
    } else if (activeTab === 'tabResource') {
      loadResource();
    } else if (activeTab === 'tabSimltResGrp') {
      loadSimltResGrp();
    }
  };

  function refresh() {
    currentLocationRef.reset();

    reset();

    gridResGrp.dataProvider.clearRows();
    gridResource.dataProvider.clearRows();
    gridSimltResGrp.dataProvider.clearRows();
    gridPeriodCapa.dataProvider.clearRows();
    gridBottleNeck.dataProvider.clearRows();
  }

  function openPopupResource() {
    setPopupResource(true);
  }

  function onSetResource(gridRow) {
    setValue("resCd", gridRow.RES_CD);
    setValue("resDescrip", gridRow.DESCRIP === null ? '' : gridRow.RES_DESCRIP);
  }

  function onSetResourceGroup(gridRow) {
    let itemIndex = gridResGrp.gridView.getCurrent().dataRow;

    gridResGrp.dataProvider.setValue(itemIndex, 'RES_GRP_ID', gridRow.RES_GRP_ID);
    gridResGrp.dataProvider.setValue(itemIndex, 'RES_GRP_CD', gridRow.RES_GRP_CD);
    gridResGrp.dataProvider.setValue(itemIndex, 'RES_GRP_DESCRIP', gridRow.RES_GRP_DESCRIP);
    gridResGrp.dataProvider.setValue(itemIndex, 'RES_GRP_TP_ID', gridRow.RES_GRP_TP_ID);
    gridResGrp.dataProvider.setValue(itemIndex, 'RES_GRP_TP', gridRow.RES_GRP_TP);
  }

  function openPopupResourceBundleCreate() {
    setPopupResourceBundleCreate(true);
  }

  function openPopupResourceNew2() {
    setPopupResourceNew2(true);
  }

  function openPopupResourceNew3() {
    setPopupResourceNew3(true);
  }

  function openPopupResourceNew4() {
    gridResource.gridView.commit(true);
    setSelectData(gridResource.gridView.getValues(gridResource.gridView.getCurrent().itemIndex));
    setPopupResourceNew4(true);
  }

  function openPopupResourceNew5() {
    gridResource.gridView.commit(true);
    let itemIndex = gridResource.gridView.getCurrent().itemIndex
    let selectValue = gridResource.gridView.getValues(itemIndex);

    if ((itemIndex !== -1) && (selectValue.PLAN_RES_TP === 'Bottleneck Resource')) {
      setSelectData(selectValue);
      setPopupResourceNew5(true);
    } else {
      showMessage('Action Condition Fail', transLangKey('MSG_5125'), { close: false });
    }
  }

  const topTabChange = (event, newValue) => {
    setViewInfo(vom.active, 'globalButtons', [
      { name: "search", action: (e) => { onSubmit(newValue); }, visible: true, disable: false },
      { name: "refresh", action: (e) => { refresh(); }, visible: true, disable: false }
    ]);

    if (newValue !== "tabResource") {
      gridPeriodCapa.dataProvider.clearRows();
      gridBottleNeck.dataProvider.clearRows();
    }

    setTopTabValue(newValue);
  };

  const bottomTabChange = (event, newValue) => {
    setBottomTabValue(newValue);
  };

  async function setCombobox() {
    let dataArr = await getCodeList('MP_RES_CAPA_CAL_CRITERIA, CAPA_MGMT_PERIOD, SIMLT_RES_TP');

    setComboData({
      resCapaCalBase: dataArr.filter(code => code.GROUP === "MP_RES_CAPA_CAL_CRITERIA"),
      capaMgmtPeriod: dataArr.filter(code => code.GROUP === "CAPA_MGMT_PERIOD"),
      simltResTpId: dataArr.filter(code => code.GROUP === "SIMLT_RES_TP")
    });
  }

  function loadResourceGroup() {
    let formData = new FormData();
    formData.append('LOCAT_TP', currentLocationRef.getLocationType());
    formData.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    formData.append('LOCAT_CD', currentLocationRef.getLocationCode());
    formData.append('LOCAT_NM', currentLocationRef.getLocationName());

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_06_Q1',
      data: formData
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          gridResGrp.setData(res.data.RESULT_DATA);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function saveResourceGroup() {
    gridResGrp.gridView.commit(true);
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridResGrp.dataProvider.getAllStateRows().created,
          gridResGrp.dataProvider.getAllStateRows().updated,
          gridResGrp.dataProvider.getAllStateRows().deleted,
          gridResGrp.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          changeRowData.push(gridResGrp.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          if (answer) {
            let formData = new FormData();
            formData.append('USER_ID', username);
            formData.append('changes', JSON.stringify(changeRowData));

            zAxios({
              method: 'post',
              url: baseURI() + 'engine/mp/SRV_UI_MP_06_S1',
              data: formData
            })
              .then(function (res) {
                const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_06_S1_P_RT_MSG;
                showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false });

                if (res.status === gHttpStatus.SUCCESS) {
                  loadResourceGroup();
                }
              })
              .catch(function (e) {
                console.error(e);
              });
          }
        }
      }
    });
  }

  function loadResource() {
    let formData = new FormData();
    formData.append('LOCAT_TP', currentLocationRef.getLocationType());
    formData.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    formData.append('LOCAT_CD', currentLocationRef.getLocationCode());
    formData.append('LOCAT_NM', currentLocationRef.getLocationName());
    formData.append("RES_CD", getValues("resCd"));
    formData.append("RES_DESCRIP", getValues("resDescrip"));

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_06_Q3',
      data: formData
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          gridResource.setData(res.data.RESULT_DATA);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function saveResource() {
    gridResource.gridView.commit(true);
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridResource.dataProvider.getAllStateRows().created,
          gridResource.dataProvider.getAllStateRows().updated,
          gridResource.dataProvider.getAllStateRows().deleted,
          gridResource.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          let rowData = gridResource.dataProvider.getJsonRow(row);

          if (rowData.CREATE_DTTM instanceof Date) {
            rowData.CREATE_DTTM = rowData.CREATE_DTTM.format("yyyy-MM-ddTHH:mm:ss");
          }
          if (rowData.MODIFY_DTTM instanceof Date) {
            rowData.MODIFY_DTTM = rowData.MODIFY_DTTM.format("yyyy-MM-ddTHH:mm:ss");
          }

          changeRowData.push(rowData);
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          if (answer) {
            let formData = new FormData();

            formData.append('WRK_TYPE', "SAVE");
            formData.append('changes', JSON.stringify(changeRowData));
            formData.append('USER_ID', username);

            zAxios({
              method: 'post',
              url: baseURI() + 'engine/mp/SRV_UI_MP_06_S2',
              data: formData
            })
              .then(function (res) {
                const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_06_S2_P_RT_MSG;
                showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false });

                if (res.status === gHttpStatus.SUCCESS) {
                  loadResource();
                }
              })
              .catch(function (e) {
                console.error(e);
              });
          }
        }
      }
    });
  }

  function deleteResource(targetGrid, deleteRows) {
    let formData = new FormData();

    deleteRows.forEach(function (rowData) {
      if (rowData.CREATE_DTTM instanceof Date) {
        rowData.CREATE_DTTM = rowData.CREATE_DTTM.format("yyyy-MM-ddTHH:mm:ss");
      }
      if (rowData.MODIFY_DTTM instanceof Date) {
        rowData.MODIFY_DTTM = rowData.MODIFY_DTTM.format("yyyy-MM-ddTHH:mm:ss");
      }
    });

    formData.append('WRK_TYPE', "DELETE");
    formData.append('changes', JSON.stringify(deleteRows));
    formData.append('USER_ID', username);

    if (deleteRows.length > 0) {
      return zAxios({
        method: 'post',
        url: baseURI() + 'engine/mp/SRV_UI_MP_06_S2',
        headers: { 'Content-type': 'application/json' },
        data: formData
      })
    }
  }

  function loadSimltResGrp() {
    let formData = new FormData();
    formData.append('LOCAT_TP', currentLocationRef.getLocationType());
    formData.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    formData.append('LOCAT_CD', currentLocationRef.getLocationCode());
    formData.append('LOCAT_NM', currentLocationRef.getLocationName());
    formData.append("RES_CD", getValues("resCd"));
    formData.append("RES_DESCRIP", getValues("resDescrip"));
    formData.append("ROUTE_CD", getValues("routeCd"));
    formData.append("ROUTE_DESCRIP", getValues("routeDescrip"));

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_06_Q6',
      data: formData
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          gridSimltResGrp.setData(res.data.RESULT_DATA);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function saveSimltResGrp() {
    gridSimltResGrp.gridView.commit(true);
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridSimltResGrp.dataProvider.getAllStateRows().created,
          gridSimltResGrp.dataProvider.getAllStateRows().updated,
          gridSimltResGrp.dataProvider.getAllStateRows().deleted,
          gridSimltResGrp.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          changeRowData.push(gridSimltResGrp.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          if (answer) {
            let formData = new FormData();
            formData.append('USER_ID', username);
            formData.append('changes', JSON.stringify(changeRowData));

            zAxios({
              method: 'post',
              url: baseURI() + 'engine/mp/SRV_UI_MP_06_POP_S1',
              data: formData
            })
              .then(function (res) {
                const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_06_POP_S1_P_RT_MSG;
                showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false });

                if (res.status === gHttpStatus.SUCCESS) {
                  loadSimltResGrp();
                }
              })
              .catch(function (e) {
                console.error(e);
              });
          }
        }
      }
    });
  }

  function deleteSimltResGrp(targetGrid, deleteRows) {
    let formData = new FormData();

    deleteRows.forEach(function (rowData) {
      if (rowData.STRT_DTTM instanceof Date) {
        rowData.STRT_DTTM = rowData.STRT_DTTM.format("yyyy-MM-ddTHH:mm:ss");
      }
      if (rowData.END_DTTM instanceof Date) {
        rowData.END_DTTM = rowData.END_DTTM.format("yyyy-MM-ddTHH:mm:ss");
      }
    });

    formData.append('changes', JSON.stringify(deleteRows));

    if (deleteRows.length > 0) {
      return zAxios({
        method: 'post',
        url: baseURI() + 'engine/mp/SRV_UI_MP_06_S7',
        headers: { 'Content-type': 'application/json' },
        data: formData
      })
    }
  }

  function loadPeriodCapa() {
    setSelectData({});

    let formData = new FormData();
    let itemIndex = gridResource.gridView.getCurrent().dataRow;
    let tmpResId = gridResource.dataProvider.getValue(itemIndex, 'RES_DTL_ID');

    setResId(tmpResId);

    formData.append('RES_DTL_ID', tmpResId);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_06_Q4',
      data: formData
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          gridPeriodCapa.setData(res.data.RESULT_DATA);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function savePeriodCapa() {
    gridPeriodCapa.gridView.commit(true);
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridPeriodCapa.dataProvider.getAllStateRows().created,
          gridPeriodCapa.dataProvider.getAllStateRows().updated,
          gridPeriodCapa.dataProvider.getAllStateRows().deleted,
          gridPeriodCapa.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          let rowData = gridPeriodCapa.dataProvider.getJsonRow(row);

          if (rowData.STRT_DATE instanceof Date) {
            rowData.STRT_DATE = rowData.STRT_DATE.format("yyyy-MM-ddTHH:mm:ss");
          }
          if (rowData.END_DATE instanceof Date) {
            rowData.END_DATE = rowData.END_DATE.format("yyyy-MM-ddTHH:mm:ss");
          }

          changeRowData.push(rowData);
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          if (answer) {
            let formData = new FormData();
            formData.append('WRK_TYPE', 'SAVE');
            formData.append('USER_ID', username);
            formData.append('changes', JSON.stringify(changeRowData));

            zAxios({
              method: 'post',
              url: baseURI() + 'engine/mp/SRV_UI_MP_06_S3',
              data: formData
            })
              .then(function (res) {
                const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_06_S3_P_RT_MSG;
                showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false });

                if (res.status === gHttpStatus.SUCCESS) {
                  loadPeriodCapa();
                }
              })
              .catch(function (e) {
                console.error(e);
              });
          }
        }
      }
    });
  }

  function deletePeriodCapa(targetGrid, deleteRows) {
    let formData = new FormData();

    deleteRows.forEach(function (rowData) {
      if (rowData.STRT_DTTM instanceof Date) {
        rowData.STRT_DTTM = rowData.STRT_DTTM.format("yyyy-MM-ddTHH:mm:ss");
      }
      if (rowData.STRT_DATE instanceof Date) {
        rowData.STRT_DATE = rowData.STRT_DATE.format("yyyy-MM-ddTHH:mm:ss");
      }
      if (rowData.END_DATE instanceof Date) {
        rowData.END_DATE = rowData.END_DATE.format("yyyy-MM-ddTHH:mm:ss");
      }
    });

    formData.append('WRK_TYPE', "DELETE");
    formData.append('changes', JSON.stringify(deleteRows));
    formData.append('USER_ID', username);

    if (deleteRows.length > 0) {
      return zAxios({
        method: 'post',
        url: baseURI() + 'engine/mp/SRV_UI_MP_06_S3',
        headers: { 'Content-type': 'application/json' },
        data: formData
      })
    }
  }

  function loadBottleNeckResource() {
    let formData = new FormData();
    let itemIndex = gridResource.gridView.getCurrent().dataRow;
    let tmpLocMgmtId = gridResource.dataProvider.getValue(itemIndex, 'LOC_MGMT_ID');

    setLocMgmtId(tmpLocMgmtId);

    formData.append('LOC_MGMT_ID', tmpLocMgmtId);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_06_Q5',
      data: formData
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          gridBottleNeck.setData(res.data.RESULT_DATA);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function saveBottleNeckResource() {
    gridBottleNeck.gridView.commit(true);
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridBottleNeck.dataProvider.getAllStateRows().created,
          gridBottleNeck.dataProvider.getAllStateRows().updated,
          gridBottleNeck.dataProvider.getAllStateRows().deleted,
          gridBottleNeck.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          let rowData = gridBottleNeck.dataProvider.getJsonRow(row);

          rowData.LOC_MGMT_ID = locMgmtId;
          rowData.RES_ID = resId;

          if (rowData.STRT_DTTM instanceof Date) {
            rowData.STRT_DTTM = rowData.STRT_DTTM.format("yyyy-MM-ddTHH:mm:ss");
          }
          if (rowData.END_DTTM instanceof Date) {
            rowData.END_DTTM = rowData.END_DTTM.format("yyyy-MM-ddTHH:mm:ss");
          }

          changeRowData.push(rowData);
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          if (answer) {
            let formData = new FormData();
            formData.append('changes', JSON.stringify(changeRowData));
            formData.append('USER_ID', username);

            zAxios({
              method: 'post',
              url: baseURI() + 'engine/mp/SRV_UI_MP_06_S5',
              data: formData
            })
              .then(function (res) {
                const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_06_S5_P_RT_MSG;
                showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false });

                if (res.status === gHttpStatus.SUCCESS) {
                  loadBottleNeckResource();
                }
              })
              .catch(function (e) {
                console.error(e);
              });
          }
        }
      }
    });
  }

  function deleteBottleNeckResource(targetGrid, deleteRows) {
    let formData = new FormData();

    deleteRows.forEach(function (rowData) {
      if (rowData.STRT_DTTM instanceof Date) {
        rowData.STRT_DTTM = rowData.STRT_DTTM.format("yyyy-MM-ddTHH:mm:ss");
      }
      if (rowData.END_DTTM instanceof Date) {
        rowData.END_DTTM = rowData.END_DTTM.format("yyyy-MM-ddTHH:mm:ss");
      }
    });

    formData.append('WRK_TYPE', "DELETE");
    formData.append('checked', JSON.stringify(deleteRows));
    formData.append('USER_ID', username);

    if (deleteRows.length > 0) {
      return zAxios({
        method: 'post',
        url: baseURI() + 'engine/mp/SRV_UI_MP_06_S6',
        headers: { 'Content-type': 'application/json' },
        data: formData
      })
    }
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <LocationSearchBox ref={locationSearchBoxRef} keyValue={'locationName'} placeHolder={transLangKey("LOCAT_NM")} style={{width: 300}} />
            <InputField type="action" name="resCd" label={transLangKey("RES_CD")} control={control} onClick={() => { openPopupResource() }} disabled={topTabValue === "tabResGrp"}>
              <Icon.Search />
            </InputField>
            <InputField name="resDescrip" label={transLangKey("RES_DESCRIP")} control={control} disabled={topTabValue === "tabResGrp"} />
            <InputField name="routeCd" label={transLangKey("ROUTE_CD")} control={control} disabled={(topTabValue === "tabResGrp") || (topTabValue === "tabResource")} />
            <InputField name="routeDescrip" label={transLangKey("ROUTE_DESCRIP")} control={control} disabled={(topTabValue === "tabResGrp") || (topTabValue === "tabResource")} />
          </SearchRow>
        </SearchArea>

        <Box style={{ height: "60%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={topTabValue} onChange={topTabChange} indicatorColor="primary">
              <Tab label={transLangKey("RES")} value="tabResource" />
              <Tab label={transLangKey("RES_GRP")} value="tabResGrp" />
              <Tab label={transLangKey("SIMLT_RES_GRP")} value="tabSimltResGrp" />
            </Tabs>
          </Box>

          {/* tabResource */}
          <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: topTabValue === "tabResource" ? "block" : "none" }}>
            <ButtonArea>
              <LeftButtonArea>
                <GridExcelExportButton type="icon" grid="gridResource" options={exportExceloptions} />
                {/*<GridExcelImportButton type="icon" grid="gridResource" />*/}
                <CommonButton title={transLangKey("BUNDLE_CREATE")} onClick={() => { openPopupResourceBundleCreate() }}><Icon.File /></CommonButton>
              </LeftButtonArea>
              <RightButtonArea>
                <GridAddRowButton type="icon" onClick={() => { openPopupResourceNew2() }} />
                <GridDeleteRowButton type="icon" grid="gridResource" onDelete={deleteResource} />
                <GridSaveButton type="icon" onClick={() => { saveResource() }} />
              </RightButtonArea>
            </ButtonArea>
            <Box style={{ height: "calc(100% - 100px)" }}>
              <BaseGrid id="gridResource" items={gridResourceColumns} afterGridCreate={afterGridResource} />
            </Box>
          </Box>

          {/* tabResGrp */}
          <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: topTabValue === "tabResGrp" ? "block" : "none" }}>
            <ButtonArea>
              <LeftButtonArea>
                <GridExcelExportButton type="icon" grid="gridResGrp" options={exportExceloptions} />
                {/*<GridExcelImportButton type="icon" grid="gridResGrp" />*/}
              </LeftButtonArea>
              <RightButtonArea>
                <GridSaveButton type="icon" onClick={() => { saveResourceGroup() }} />
              </RightButtonArea>
            </ButtonArea>
            <Box style={{ height: "calc(100% - 100px)" }}>
              <BaseGrid id="gridResGrp" items={gridResGrpColumns} afterGridCreate={afterGridResGrp} />
            </Box>
          </Box>

          {/* tabSimltResGrp */}
          <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: topTabValue === "tabSimltResGrp" ? "block" : "none" }}>
            <ButtonArea>
              <RightButtonArea>
                <GridAddRowButton type="icon" onClick={() => { openPopupResourceNew3() }} />
                <GridDeleteRowButton type="icon" grid="gridSimltResGrp" onDelete={deleteSimltResGrp} />
                <GridSaveButton type="icon" onClick={() => { saveSimltResGrp() }} />
              </RightButtonArea>
            </ButtonArea>
            <Box style={{ height: "calc(100% - 100px)" }}>
              <BaseGrid id="gridSimltResGrp" items={gridSimltResGrpColumns} afterGridCreate={afterGridSimltResGrp} />
            </Box>
          </Box>
        </Box>

        <Box style={{ height: "40%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={bottomTabValue} onChange={bottomTabChange} indicatorColor="primary">
              <Tab label={transLangKey("PERIOD_CAPA")} value="tabPeriodCapa" />
              <Tab label={transLangKey("BNECK_RES")} value="tabBottleNeck" />
            </Tabs>
          </Box>

          {/* tabPeriodCapa */}
          <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: bottomTabValue === "tabPeriodCapa" ? "block" : "none" }}>
            <ButtonArea>
              <RightButtonArea>
                <GridAddRowButton type="icon" onClick={() => { openPopupResourceNew4() }} />
                <GridDeleteRowButton type="icon" grid="gridPeriodCapa" onDelete={deletePeriodCapa} />
                <GridSaveButton type="icon" onClick={() => { savePeriodCapa() }} />
              </RightButtonArea>
            </ButtonArea>
            <Box style={{ height: "calc(100% - 90px)" }}>
              <BaseGrid id="gridPeriodCapa" items={gridPeriodCapaColumns} afterGridCreate={afterGridPeriodCapa} />
            </Box>
          </Box>

          {/* tabBottleNeck */}
          <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: bottomTabValue === "tabBottleNeck" ? "block" : "none" }}>
            <ButtonArea>
              <RightButtonArea>
                <GridAddRowButton type="icon" onClick={() => { openPopupResourceNew5() }} />
                <GridDeleteRowButton type="icon" grid="gridBottleNeck" onDelete={deleteBottleNeckResource} />
                <GridSaveButton type="icon" onClick={() => { saveBottleNeckResource() }} />
              </RightButtonArea>
            </ButtonArea>
            <Box style={{ height: "calc(100% - 90px)" }}>
              <BaseGrid id="gridBottleNeck" items={gridBottleNeckColumns} afterGridCreate={afterGridBottleNeck} />
            </Box>
          </Box>
        </Box>
      </ContentInner>
      {resourcePopupOpen && (<PopCommResource open={resourcePopupOpen} onClose={() => { setPopupResource(false); }} confirm={onSetResource} />)}
      {resourceGroupPopupOpen && (<PopResourceGroup open={resourceGroupPopupOpen} onClose={() => { setPopupResourceGroup(false); }} confirm={onSetResourceGroup} />)}
      {resourceBundleCreatePopupOpen && (<PopResourceBundleCreate open={resourceBundleCreatePopupOpen} onClose={() => { setPopupResourceBundleCreate(false); }} />)}
      {resourceNew2PopupOpen && (<PopResourceNew2 open={resourceNew2PopupOpen} onClose={() => { setPopupResourceNew2(false); }} confirm={loadResource} data={comboData} />)}
      {resourceNew3PopupOpen && (<PopResourceNew3 open={resourceNew3PopupOpen} onClose={() => { setPopupResourceNew3(false); }} confirm={loadSimltResGrp} data={comboData} />)}
      {resourceNew4PopupOpen && (<PopResourceNew4 open={resourceNew4PopupOpen} onClose={() => { setPopupResourceNew4(false); }} confirm={loadPeriodCapa} data={selectData} />)}
      {resourceNew5PopupOpen && (<PopResourceNew5 open={resourceNew5PopupOpen} onClose={() => { setPopupResourceNew5(false); }} confirm={loadBottleNeckResource} data={selectData} />)}
    </>
  )
}

export default Resource;
