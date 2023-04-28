import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from "react-router-dom";
import { Box } from '@mui/material';
import { Gavel, AddBox, Contrast }from '@mui/icons-material';
import {
  BaseGrid, ContentInner, SearchArea, SearchRow, ButtonArea, LeftButtonArea, RightButtonArea,
  CommonButton, GridExcelExportButton, GridSaveButton, InputField, ResultArea, useUserStore, useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';

import LocationSearchBox from '@wingui/view/supplychainmodel/common/LocationSearchBox';
import ItemSearchBox from '@wingui/view/supplychainmodel/common/ItemSearchBox';

import PopSimulationVersion from '@wingui/view/masterplan/common/PopSimulationVersion';
import PopConfirmPlan from '@wingui/view/masterplan/common/PopConfirmPlan';
import PopDmndOrderTrack from '@wingui/view/masterplan/common/PopDmndOrderTrack';
import PopAdjustShppPlan from '@wingui/view/masterplan/common/PopAdjustShppPlan';
import PopDueInTrack from '@wingui/view/masterplan/common/PopDueInTrack';
import PopNewSimulationVersion from '@wingui/view/masterplan/common/PopNewSimulationVersion';
import PopConfirmAdjPlan from '@wingui/view/masterplan/common/PopConfirmAdjPlan';

import { Chart as ChartJS, LinearScale, CategoryScale, BarElement, PointElement, LineElement, Title, Legend, Tooltip, LineController, BarController } from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register( LinearScale, CategoryScale, BarElement, PointElement, LineElement, Title, Legend, Tooltip, LineController, BarController );

let gridRpResultDetailColumns = [
  { name: 'LOCAT_ITEM_ID', dataType: 'text', headerText: 'LOCAT_ITEM_ID', visible: false, editable: false, width: '100' },
  { name: 'LOCAT_TP_NM', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: '80', groups: "LOCAT", groupShowMode: "expand" },
  { name: 'LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: '80', groups: "LOCAT", groupShowMode: "expand" },
  { name: 'LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: '80', groups: "LOCAT", groupShowMode: "always" },
  { name: 'LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: '120', groups: "LOCAT", groupShowMode: "always" },
  { name: 'LOCAT_GRP_CD', dataType: 'text', headerText: 'LOCAT_GRP_CD', visible: true, editable: false, width: '120', groups: "LOCAT", groupShowMode: "expand" },
  { name: 'BUSINESS_UNIT', dataType: 'text', headerText: 'BUSINESS_UNIT', visible: true, editable: false, width: '100', groups: "LOCAT", groupShowMode: "expand" },
  { name: 'IN_OUT_FLAG', dataType: 'text', headerText: 'IN_OUT_FLAG', visible: true, editable: false, width: '100', groups: "LOCAT", groupShowMode: "expand" },
  { name: 'ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', visible: true, editable: false, width: '80', groups: "ITEM", groupShowMode: "always" },
  { name: 'ITEM_NM', dataType: 'text', headerText: 'ITEM_NM', visible: true, editable: false, width: '120', groups: "ITEM", groupShowMode: "always" },
  { name: 'ITEM_DESCRIP', dataType: 'text', headerText: 'ITEM_DESCRIP', visible: false, editable: false, width: '120', groups: "ITEM", groupShowMode: "expand" },
  { name: 'ITEM_TP_NM', dataType: 'text', headerText: 'ITEM_TP_NM', visible: true, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'UOM_NM', dataType: 'text', headerText: 'UOM_NM', visible: true, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'STOCK_MGMT_SYSTEM_TP', dataType: 'text', headerText: 'STOCK_MGMT_SYSTEM_TP', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'STOCK_MGMT_SYSTEM_TP_NM', dataType: 'text', headerText: 'STOCK_MGMT_SYSTEM_TP', visible: true, editable: false, width: '120', groups: "ITEM", groupShowMode: "expand" },
  { name: 'STOCK_PLACE_STRTGY_NM', dataType: 'text', headerText: 'STOCK_PLACE_STRTGY', visible: true, editable: false, width: '120', groups: "ITEM", groupShowMode: "expand" },
  { name: 'VAL_01', dataType: 'text', headerText: 'VAL_01', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'VAL_02', dataType: 'text', headerText: 'VAL_02', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'VAL_03', dataType: 'text', headerText: 'VAL_03', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'VAL_04', dataType: 'text', headerText: 'VAL_04', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'VAL_05', dataType: 'text', headerText: 'VAL_05', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'VAL_06', dataType: 'text', headerText: 'VAL_06', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'VAL_07', dataType: 'text', headerText: 'VAL_07', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'VAL_08', dataType: 'text', headerText: 'VAL_08', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'VAL_09', dataType: 'text', headerText: 'VAL_09', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'VAL_10', dataType: 'text', headerText: 'VAL_10', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'VAL_11', dataType: 'text', headerText: 'VAL_11', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'VAL_12', dataType: 'text', headerText: 'VAL_12', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'VAL_13', dataType: 'text', headerText: 'VAL_13', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'VAL_14', dataType: 'text', headerText: 'VAL_14', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'VAL_15', dataType: 'text', headerText: 'VAL_15', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'VAL_16', dataType: 'text', headerText: 'VAL_16', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'VAL_17', dataType: 'text', headerText: 'VAL_17', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'VAL_18', dataType: 'text', headerText: 'VAL_18', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'VAL_19', dataType: 'text', headerText: 'VAL_19', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'VAL_20', dataType: 'text', headerText: 'VAL_20', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'ATTR_01', dataType: 'text', headerText: 'ATTR_01', visible: true, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'ATTR_02', dataType: 'text', headerText: 'ATTR_02', visible: true, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'ATTR_03', dataType: 'text', headerText: 'ATTR_03', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'ATTR_04', dataType: 'text', headerText: 'ATTR_04', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'ATTR_05', dataType: 'text', headerText: 'ATTR_05', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'ATTR_06', dataType: 'text', headerText: 'ATTR_06', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'ATTR_07', dataType: 'text', headerText: 'ATTR_07', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'ATTR_08', dataType: 'text', headerText: 'ATTR_08', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'ATTR_09', dataType: 'text', headerText: 'ATTR_09', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'ATTR_10', dataType: 'text', headerText: 'ATTR_10', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'ATTR_11', dataType: 'text', headerText: 'ATTR_11', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'ATTR_12', dataType: 'text', headerText: 'ATTR_12', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'ATTR_13', dataType: 'text', headerText: 'ATTR_13', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'ATTR_14', dataType: 'text', headerText: 'ATTR_14', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'ATTR_15', dataType: 'text', headerText: 'ATTR_15', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'ATTR_16', dataType: 'text', headerText: 'ATTR_16', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'ATTR_17', dataType: 'text', headerText: 'ATTR_17', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'ATTR_18', dataType: 'text', headerText: 'ATTR_18', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'ATTR_19', dataType: 'text', headerText: 'ATTR_19', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'ATTR_20', dataType: 'text', headerText: 'ATTR_20', visible: false, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'OPERT_BASE_TP_NM', dataType: 'text', headerText: 'OPERT_BASE_TP', visible: true, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'OPERT_TARGET', dataType: 'text', headerText: 'OPERT_TARGET', visible: true, editable: false, width: '100', groups: "ITEM", groupShowMode: "expand" },
  { name: 'INVTURN', dataType: 'text', headerText: 'INVTURN', visible: true, editable: false, width: '100', lang: true, groups: "ITEM", groupShowMode: "expand" },
  { name: 'PREDICT_LV', dataType: 'text', headerText: 'PREDICT_LV', visible: true, editable: false, width: '100', lang: true, groups: "ITEM", groupShowMode: "expand" },
  { name: 'TARGET_SVC_LV', dataType: 'text', headerText: 'SFST_SVC_LV', visible: true, editable: false, width: '100', lang: true, groups: "ITEM", groupShowMode: "expand" },
  { name: 'LIVE_FILL_RATE', dataType: 'text', headerText: 'LIVE_FILL_RATE', visible: true, editable: false, width: '100', lang: true, groups: "ITEM", groupShowMode: "expand" },
  { name: 'PLAN_FILL_RATE', dataType: 'text', headerText: 'PLAN_FILL_RATE', visible: true, editable: false, width: '100', lang: true, groups: "ITEM", groupShowMode: "expand" },
  { name: 'ACCOUNT_CD', dataType: 'text', headerText: 'ACCOUNT_CD', visible: true, editable: false, width: '100', lang: true, groups: "ITEM", groupShowMode: "expand" },
  { name: 'ACCOUNT_NM', dataType: 'text', headerText: 'ACCOUNT_NM', visible: true, editable: false, width: '120', lang: true, groups: "ITEM", groupShowMode: "expand" },
  { name: 'CATEGORY_GROUP', dataType: 'text', headerText: 'CATEGORY_GROUP', visible: true, editable: false, width: '100', lang: true },
  { name: 'CATEGORY', dataType: 'text', headerText: 'CATEGORY', visible: true, editable: false, width: '100', lang: true },
  { name: 'DAT', dataType: 'number', headerText: 'DAT', visible: true, editable: false, width: '100', iteration : { "prefix": "DAT_", "prefixRemove": "true", "delimiter": "," } }
];

const rpResultDetailChartOptions = {
  plugins: { legend: { position: 'bottom' } },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: { position: 'left', min: 0, grid: { drawOnChartArea: false, }, title: { display: true, text: transLangKey('QTY') } },
    y1: { position: 'right', min: 0, title: { display: true, text: transLangKey('AMT') } }
  }
};

function RpResult() {
  const [username] = useUserStore(state => [state.username]);
  const [gridRpResultDetail, setGridRpResultDetail] = useState(null);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const location = useLocation();

  const locationSearchBoxRef = useRef();
  const itemSearchBoxRef = useRef();

  const [currentLocationRef, setCurrentLocationRef] = useState();
  const [currentItemRef, setCurrentItemRef] = useState();

  const [simulationVersionPopupOpen, setSimulationVersionPopupOpen] = useState(false);
  const [confirmPlanPopupOpen, setConfirmPlanPopupOpen] = useState(false);
  const [dmndOrderTrackPopupOpen, setDmndOrderTrackPopupOpen] = useState(false);
  const [adjustShppPlanPopupOpen, setAdjustShppPlanPopupOpen] = useState(false);
  const [dueInTrackPopupOpen, setDueInTrackPopupOpen] = useState(false);
  const [newSimulationVersionPopupOpen, setNewSimulationVersionPopupOpen] = useState(false);
  const [adjustPlanPopupOpen, setAdjustPlanPopupOpen] = useState(false);

  const [currentSimulationVersion, setCurrentSimulationVersion] = useState('');

  const rpResultDetailDatasets = [
    { type: 'line', label: transLangKey('DMND_QTY'), borderColor: '#ABCD5A', borderWidth: 2, fill: false, data: { } },
    { type: 'bar', label: transLangKey('REPLSH_PLAN'), borderColor: 'white', backgroundColor: '#309B46', order: 1, data: { } },
    { type: 'line', label: transLangKey('EOH'), borderColor: '#68B8E3', borderWidth: 2, fill: false, data: { } },
    { type: 'line', label: transLangKey('PREDICT_REVENUE'), borderColor: '#FF8F56', borderWidth: 2, fill: false, yAxisID: 'y1', data: { } },
    { type: 'line', label: transLangKey('STOCK_AMT'), borderColor: '#E33A2E', borderWidth: 2, fill: false, yAxisID: 'y1', data: { } }
  ]

  const { reset, getValues, setValue, control } = useForm({
    defaultValues: {
      moduleCd: 'RP',
      simulationVersion: '',
      processType: '',
      gridItemCd: '',
      gridLocatCd: '',
      defaultSimulationVersion: {}
    }
  });

  const [rpResultDetailData, setRpResultDetailData] = useState({
    labels: [],
    datasets: rpResultDetailDatasets
  });

  const globalButtons = [
    { name: 'search', action: (e) => { onSubmit() }, visible: true, disable: false },
    { name: 'refresh', action: (e) => { refresh() }, visible: true, disable: false }
  ];

  const exportOptions = {
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

    if (itemSearchBoxRef) {
      if (itemSearchBoxRef.current) {
        setCurrentItemRef(itemSearchBoxRef.current);
      }
    }
  }, [viewData]);

  useEffect(() => {
    setViewInfo(vom.active, 'globalButtons', globalButtons);

    async function initLoad() {
      await loadRecentSimulationVersion();
      loadRpResultDetail();
    }

    if (gridRpResultDetail) {
      if (location.state !== undefined && location.state !== null) {
        if (location.state.params !== undefined) {
          if (location.state.params.simulationVersion) {
            setValue('simulationVersion', location.state.params.simulationVersion);
            return;
          }
        }
      }

      initLoad();
    }

  }, [gridRpResultDetail]);

  function afterGridRpResult(gridObj) {
    setGridRpResultDetail(gridObj);
    setGridRpResultDetailOptions(gridObj);
  }

  function setGridRpResultDetailOptions(gridObj) {
    setVisibleProps(gridObj, true, false, false);

    gridObj.gridView.setDisplayOptions({
      fitStyle: 'fill'
    });

    const mergeColumns = [
      'LOCAT_LV', 'LOCAT_CD', 'LOCAT_NM', 'LOCAT_GRP_CD', 'BUSINESS_UNIT', 'IN_OUT_FLAG', 'ITEM_CD', 'ITEM_NM', 'ITEM_DESCRIP', 'ITEM_TP_NM', 'UOM_NM',
      'STOCK_MGMT_SYSTEM_TP', 'STOCK_MGMT_SYSTEM_TP_NM', 'STOCK_PLACE_STRTGY_NM',
      'VAL_01', 'VAL_02', 'VAL_03', 'VAL_04', 'VAL_05', 'VAL_06', 'VAL_07', 'VAL_08', 'VAL_09', 'VAL_10',
      'VAL_11', 'VAL_12', 'VAL_13', 'VAL_14', 'VAL_15', 'VAL_16', 'VAL_17', 'VAL_18', 'VAL_19', 'VAL_20',
      'ATTR_01', 'ATTR_02', 'ATTR_03', 'ATTR_04', 'ATTR_05', 'ATTR_06', 'ATTR_07', 'ATTR_08', 'ATTR_09', 'ATTR_10',
      'ATTR_11', 'ATTR_12', 'ATTR_13', 'ATTR_14', 'ATTR_15', 'ATTR_16', 'ATTR_17', 'ATTR_18', 'ATTR_19', 'ATTR_20',
      'OPERT_BASE_TP_NM', 'OPERT_TARGET', 'INVTURN', 'PREDICT_LV', 'TARGET_SVC_LV', 'LIVE_FILL_RATE', 'PLAN_FILL_RATE', 'ACCOUNT_CD', 'ACCOUNT_NM', 'CATEGORY_GROUP'
    ];

    gridObj.gridView.setColumnProperty("LOCAT_TP_NM", "mergeRule", { criteria: 'value' });
    for (let i = 0; i < mergeColumns.length; i++) {
      gridObj.gridView.setColumnProperty(mergeColumns[i], "mergeRule", { criteria: 'prevvalues + value' });
    }

    const sortingColumns = [
      'LOCAT_ITEM_ID', 'LOCAT_TP_NM',
      'LOCAT_LV', 'LOCAT_CD', 'LOCAT_NM', 'LOCAT_GRP_CD', 'BUSINESS_UNIT', 'IN_OUT_FLAG', 'ITEM_CD', 'ITEM_NM', 'ITEM_DESCRIP', 'UOM_NM',
      'STOCK_MGMT_SYSTEM_TP', 'STOCK_MGMT_SYSTEM_TP_NM', 'STOCK_PLACE_STRTGY_NM',
      'ATTR_01', 'ATTR_02', 'ATTR_03', 'ATTR_04', 'ATTR_05', 'ATTR_06', 'ATTR_07', 'ATTR_08', 'ATTR_09', 'ATTR_10',
      'ATTR_11', 'ATTR_12', 'ATTR_13', 'ATTR_14', 'ATTR_15', 'ATTR_16', 'ATTR_17', 'ATTR_18', 'ATTR_19', 'ATTR_20',
      'OPERT_BASE_TP_NM', 'OPERT_TARGET', 'INVTURN', 'PREDICT_LV', 'TARGET_SVC_LV', 'LIVE_FILL_RATE', 'PLAN_FILL_RATE', 'ACCOUNT_CD', 'ACCOUNT_NM'
    ];

    wingui.util.grid.sorter.orderBy(gridObj.gridView, sortingColumns);
    gridObj.gridView.setFixedOptions({ colCount: 4, resizable: true });

    gridObj.gridView.onCellClicked = function (grid, index, itemIndex) {
      if (index.cellType && index.cellType === 'data') {
        let data = gridObj.dataProvider.getOutputRow(null, index.dataRow);

        loadRpResultDetailChart(gridObj, data);
      }
    };

    gridObj.gridView.onCellDblClicked = function (grid, index) {
      if (index.cellType && index.cellType === 'data') {
        let data = gridObj.dataProvider.getOutputRow(null, index.dataRow);

        setValue('gridItemCd', data.ITEM_CD);
        setValue('gridLocatCd', data.LOCAT_CD);

        if (data.CATEGORY === 'DMND_QTY') {
          setDmndOrderTrackPopupOpen(true);
        } else if (data.CATEGORY === 'SHIPPING_PLAN') {
          setAdjustShppPlanPopupOpen(true);
        } else if (data.CATEGORY === 'DUE_IN') {
          setDueInTrackPopupOpen(true);
        }
      }
    };

    gridObj.gridView.setCellStyleCallback(function (grid, dataCell) {
      if (dataCell.index.column.name === 'CATEGORY') {
        return { style: { background: '#EEEEEE' } }
      }

      if (dataCell.index.column.name.split('DAT').length > 1) {
        let data = gridObj.gridView.getValues(dataCell.index.itemIndex);

        if (data.CATEGORY === 'DMND_QTY') {
          return { style: { background: '#CEFBC9' } }
        } else if (data.CATEGORY === 'SHIPPING_PLAN' || data.CATEGORY === 'DUE_IN') {
          return { style: { background: '#F4ECCE' } }
        } else if (data.CATEGORY === 'REPLSH_ADJ_PO') {
          return { editable: true, style: { textAlign: 'right', background: '#FFFFD2' } }
        } else if (data.CATEGORY === 'TARGET_STOCK' && (data.STOCK_MGMT_SYSTEM_TP === 'TARGET_INVENTORY_MGMT_SYSTEM' || data.STOCK_MGMT_SYSTEM_TP === 'RULE_BASE_SYSTEM')) {
          return { style: { background: '#CEECF5' } }
        } else if (data.STOCK_MGMT_SYSTEM_TP === 'REORDER_POINT_MGMT_SYSTEM' && (data.CATEGORY === 'EOQ' || data.CATEGORY === 'ROP')) {
          return { style: { background: '#CEECF5' } }
        } else if (data.STOCK_MGMT_SYSTEM_TP === 'MIN_MAX_MGMT_SYSTEM' && (data.CATEGORY === 'EOQ' || data.CATEGORY === 'ROP' || data.CATEGORY === 'MAX')) {
          return { style: { background: '#CEECF5' } }
        }
      }

      return { style: { background: '#FFFFFF' } }
    });
  }

  function onSubmit() {
    loadRpResultDetail();
  };

  function refresh() {
    currentLocationRef.reset();
    currentItemRef.reset();

    reset({
      simulationVersion: getValues('defaultSimulationVersion').SIMUL_VER_ID,
      processType: getValues('defaultSimulationVersion').PROCESS_TP,
      defaultSimulationVersion: getValues('defaultSimulationVersion')
    });

    gridRpResultDetail.dataProvider.clearRows();

    setRpResultDetailData({
      labels: [],
      datasets: [
        { type: 'line', label: transLangKey('DMND_QTY'), borderColor: '#ABCD5A', borderWidth: 2, fill: false, data: { } },
        { type: 'bar', label: transLangKey('REPLSH_PLAN'), borderColor: 'white', backgroundColor: '#309B46', order: 1, data: { } },
        { type: 'line', label: transLangKey('EOH'), borderColor: '#68B8E3', borderWidth: 2, fill: false, data: { } },
        { type: 'line', label: transLangKey('PREDICT_REVENUE'), borderColor: '#FF8F56', borderWidth: 2, fill: false, yAxisID: 'y1', data: { } },
        { type: 'line', label: transLangKey('STOCK_AMT'), borderColor: '#E33A2E', borderWidth: 2, fill: false, yAxisID: 'y1', data: { } }
      ]
    });
  }

  function openSimulationVersionPopup() {
    setSimulationVersionPopupOpen(true);
  }

  function closeSimulationVersionPopup() {
    setSimulationVersionPopupOpen(false);
  }

  function setSimulationVersion(data) {
    setValue('simulationVersion', data.SIMUL_VER);
    setValue('processType', data.PROCESS_TP);
  }

  function loadRecentSimulationVersion() {
    let param = new FormData();

    param.append('MENU_ID', 'UI_RP_15');

    return zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_COMM_DEFAULT_VER',
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        let data = res.data.RESULT_DATA[0];

        setValue('simulationVersion', data.SIMUL_VER_ID);
        setValue('processType', data.PROCESS_TP);
        setValue('defaultSimulationVersion', data);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function openConfirmPlanPopup() {
    setConfirmPlanPopupOpen(true);
  }

  function loadRpResultDetail() {
    let params = new FormData();

    params.append('VERSION_ID', getValues('simulationVersion'));
    params.append('LOCAT_TP_NM', currentLocationRef.getLocationType());
    params.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    params.append('LOCAT_CD', currentLocationRef.getLocationCode());
    params.append('LOCAT_NM', currentLocationRef.getLocationName());
    params.append('ITEM_CD', currentItemRef.getItemCode());
    params.append('ITEM_NM', currentItemRef.getItemName());
    params.append('ITEM_TP_NM', currentItemRef.getItemType());
    params.append('LIKE_SEARCH_YN', 'Y');
    params.append('CROSSTAB', JSON.stringify(gridRpResultDetail.gridView.crossTabInfo));

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/GetRPSimulationAnalysis',
      data: params
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        let data = res.data.RESULT_DATA;

        if (getValues('processType') !== 'SPROC_05') {
          data = data.filter(row => row.CATEGORY !== 'REPLSH_ADJ_PO');
        }

        gridRpResultDetail.setData(data);
        setCurrentSimulationVersion(getValues('simulationVersion'));
      }
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      setRpResultDetailData({
        labels: [],
        datasets: rpResultDetailDatasets
      });
    });
  }

  function loadRpResultDetailChart(grid, data) {
    let newRpResultDetailDatasets = rpResultDetailDatasets.slice();
    let rpResultDetailCols = ['DMND_QTY', 'REPLSH_PLAN', 'EOH', 'PREDICT_REVENUE', 'STOCK_AMT'];
    let date = [];

    grid.dataProvider.getFieldNames().filter(fieldName => fieldName.includes('DAT_')).forEach(fieldName => date.push(fieldName.split('DAT_')[1]));
    let targetData = grid.dataProvider.getJsonRows().filter(row => row.LOCAT_CD === data.LOCAT_CD && row.ITEM_CD === data.ITEM_CD);

    for (let i = 0; i < rpResultDetailCols.length; i++) {
      let rows = targetData.filter(targetRow => targetRow.CATEGORY === rpResultDetailCols[i]);
      newRpResultDetailDatasets[i].data = {};

      rows.forEach(row => {
        for (let j = 0; j < date.length; j++) {
          newRpResultDetailDatasets[i].data[date[j]] = row['DAT_' + date[j]];
        }
      })
    }

    setRpResultDetailData({
      labels: date,
      datasets: newRpResultDetailDatasets
    });
  }

  function loadConfirmSimulVer() {
    let params = new FormData();

    params.append('SIMUL_VER_ID', getValues('simulationVersion'));

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_CM_17_Q5',
      data: params
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        if (res.data.RESULT_DATA[0].CONFRM_YN) {
          setNewSimulationVersionPopupOpen(true);
        } else {
          showMessage('Action Condition Fail', transLangKey("MSG_5118"), { close: false });
        }
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function loadConfirmAdjPlan() {
    let params = new FormData();

    params.append('SIMUL_VER_ID', getValues('simulationVersion'));

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_CM_17_Q6',
      data: params
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        console.log('IS_ADJUST_PLAN : ', res.data.RESULT_DATA[0].IS_ADJUST_PLAN);
        if (res.data.RESULT_DATA[0].IS_ADJUST_PLAN) {
          setAdjustPlanPopupOpen(true);
        } else {
          showMessage('Action Condition Fail', transLangKey("MSG_5119"), { close: false });
        }
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function saveAdjustPlan() {
    gridRpResultDetail.gridView.commit(true);

    let changedRow = [];

    changedRow = changedRow.concat(
      gridRpResultDetail.dataProvider.getAllStateRows().created,
      gridRpResultDetail.dataProvider.getAllStateRows().updated,
      gridRpResultDetail.dataProvider.getAllStateRows().deleted,
      gridRpResultDetail.dataProvider.getAllStateRows().createAndDeleted
    );

    if (changedRow.length === 0) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
    } else {
      showMessage(transLangKey('SAVE'), transLangKey('MSG_SAVE'), function (answer) {
        if (answer) {
          let params = new FormData();
          let changes = [];

          changedRow.forEach(function (row) {
            changes.push(gridRpResultDetail.dataProvider.getJsonRow(row));
          });

          params.append('VERSION_ID', currentSimulationVersion);
          params.append('changes', JSON.stringify(changes));
          params.append('USER_ID', username);
          params.append('CROSSTAB', JSON.stringify(gridRpResultDetail.gridView.crossTabInfo));
          params.append('REVERSE_TARGET', 'changes');

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_UI_RP_15_S1',
            data: params
          })
          .then(function (res) {
            if (res.data.RESULT_SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_RP_15_S1_P_RT_MSG), { close: false });
              loadRpResultDetail();
            } else {
              showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
            }
          })
          .catch(function (err) {
            console.log(err);
          });
        }
      });
    }
  }

  function openNewSimulationVersionPopup() {
    loadConfirmSimulVer();
  }

  function openAdjustPlanPopup() {
    loadConfirmAdjPlan();
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <InputField type='action' name='simulationVersion' label={transLangKey('SIMUL_VER_SHORTN')} title={transLangKey('SEARCH')} onClick={openSimulationVersionPopup} control={control} readonly={true} style={{ width: '210px' }}>
              <Icon.Search />
            </InputField>
            <LocationSearchBox ref={locationSearchBoxRef} keyValue={'locationName'} placeHolder={transLangKey('LOCAT_NM')} style={{width: 300}} />
            <ItemSearchBox ref={itemSearchBoxRef} keyValue={'itemName'} placeHolder={transLangKey('ITEM_NM')} style={{width: 300}} />
          </SearchRow>
        </SearchArea>

        <ButtonArea>
          <LeftButtonArea>
            <GridExcelExportButton type='icon' grid='gridRpResultDetail' options={exportOptions} />
            <CommonButton title={transLangKey('NEW_SIMUL_VER')} onClick={() => { openNewSimulationVersionPopup() }}>
              <AddBox />
            </CommonButton>
            <CommonButton title={transLangKey('ADJUST_PLAN')} onClick={() => { openAdjustPlanPopup() }}>
              <Contrast />
            </CommonButton>
            <CommonButton title={transLangKey('PLAN_CONFIRM')} onClick={() => { openConfirmPlanPopup() }}>
              <Gavel />
            </CommonButton>
          </LeftButtonArea>
          <RightButtonArea>
            <GridSaveButton type="icon" onClick={saveAdjustPlan} />
          </RightButtonArea>
        </ButtonArea>
        <ResultArea sizes={[70, 30]} direction={'vertical'}>
          <Box>
            <BaseGrid id='gridRpResultDetail' items={gridRpResultDetailColumns} viewCd='UI_RP_15' gridCd='UI_RP_15-RST_CPT_01' afterGridCreate={afterGridRpResult} />
          </Box>
          <Box>
            <Box style={{ width: '100%', height: '100%' }}>
              <Chart data={rpResultDetailData} options={rpResultDetailChartOptions} />
            </Box>
          </Box>
        </ResultArea>
      </ContentInner>

      <PopSimulationVersion open={simulationVersionPopupOpen} onClose={closeSimulationVersionPopup} confirm={setSimulationVersion} module={getValues('moduleCd')} />
      <PopConfirmPlan open={confirmPlanPopupOpen} onClose={() => { setConfirmPlanPopupOpen(false) }} confirm={onSubmit} param={getValues('simulationVersion')} />
      <PopDmndOrderTrack open={dmndOrderTrackPopupOpen} onClose={() => { setDmndOrderTrackPopupOpen(false) }} param={{ versionId: getValues('simulationVersion'), itemCd: getValues('gridItemCd'), locatCd: getValues('gridLocatCd') }} />
      <PopAdjustShppPlan open={adjustShppPlanPopupOpen} onClose={() => { setAdjustShppPlanPopupOpen(false) }} param={{ versionId: getValues('simulationVersion'), itemCd: getValues('gridItemCd'), locatCd: getValues('gridLocatCd') }} />
      <PopDueInTrack open={dueInTrackPopupOpen} onClose={() => { setDueInTrackPopupOpen(false) }} param={{ versionId: getValues('simulationVersion'), itemCd: getValues('gridItemCd'), locatCd: getValues('gridLocatCd') }} />
      <PopNewSimulationVersion open={newSimulationVersionPopupOpen} onClose={() => { setNewSimulationVersionPopupOpen(false) }} versionId={getValues('simulationVersion')} />
      <PopConfirmAdjPlan open={adjustPlanPopupOpen} onClose={() => { setAdjustPlanPopupOpen(false) }} confirm={onSubmit} versionId={getValues('simulationVersion')} />
    </>
  )
}

export default RpResult;
