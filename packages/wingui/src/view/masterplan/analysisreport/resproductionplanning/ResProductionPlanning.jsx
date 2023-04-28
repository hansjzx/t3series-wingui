import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { useLocation } from "react-router-dom";
import { Gavel, AddBox, Contrast }from '@mui/icons-material';
import { BaseGrid, ButtonArea, ContentInner, GridExcelExportButton, InputField, CommonButton, LeftButtonArea, ResultArea, SearchArea, SearchRow, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import LocationSearchBox from '@wingui/view/supplychainmodel/common/LocationSearchBox';
import ItemSearchBox from '@wingui/view/supplychainmodel/common/ItemSearchBox';
import PopSimulationVersion from '@wingui/view/masterplan/common/PopSimulationVersion';
import PopConfirmPlan from '@wingui/view/masterplan/common/PopConfirmPlan';
import PopCommResource from '@wingui/view/supplychainmodel/common/PopCommResource';
import PopNewSimulationVersion from '@wingui/view/masterplan/common/PopNewSimulationVersion';
import PopConfirmAdjPlan from '@wingui/view/masterplan/common/PopConfirmAdjPlan';

import '@wingui/view/masterplan/common/common.css';

import { Chart as ChartJS, LinearScale, CategoryScale, BarElement, PointElement, LineElement, Title, Legend, Tooltip, LineController, BarController } from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register( LinearScale, CategoryScale, BarElement, PointElement, LineElement, Title, Legend, Tooltip, LineController, BarController );

const resourceProductionChartOptions = {
  plugins: {
    title: { display: false, text: transLangKey('UI_MP_29') },
    legend: { position: 'bottom' }
  },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    amount: {
      position: 'right',
      title: { display: true, text: transLangKey('AMT') }
    },
    quantity: {
      position: 'left',
      grid: { drawOnChartArea: false, },
      title: { display: true, text: transLangKey('QTY') }
    }
  }
};

let gridResProductionPlanningColumns = [
  { name: 'RES_ID', headerText: 'RES_ID', dataType: 'text', visible: false, editable: false },
  { name: 'LOCAT_DTL_ID', headerText: 'LOCAT_DTL_ID', dataType: 'text', visible: false },
  { name: 'ITEM_MST_ID', headerText: 'ITEM_MST_ID', dataType: 'text', visible: false },
  { name: 'LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: 80, visible: true, editable: false, groups: 'LOCAT', groupShowMode: 'expand' },
  { name: 'LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: 80, visible: true, editable: false, groups: 'LOCAT', groupShowMode: 'expand' },
  { name: 'LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: 80, visible: true, editable: false, groups: 'LOCAT', groupShowMode: 'always' },
  { name: 'LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: 120, visible: true, editable: false, groups: 'LOCAT', groupShowMode: 'always' },
  { name: 'LOCAT_GRP_CD', headerText: 'LOCAT_GRP', dataType: 'text', width: 100, visible: true, editable: false, groups: 'LOCAT', groupShowMode: 'expand' },
  { name: 'BUSINESS_UNIT', headerText: 'BUSINESS_UNIT', dataType: 'text', width: 80, visible: true, editable: false, groups: 'LOCAT', groupShowMode: 'expand' },
  { name: 'IN_OUT_FLAG', headerText: 'IN_OUT_FLAG', dataType: 'text', width: 80, visible: true, editable: false, groups: 'LOCAT', groupShowMode: 'expand' },
  { name: 'ITEM_CD', headerText: 'ITEM_CD', dataType: 'text', width: 80, visible: true, editable: false, groups: 'ITEM', groupShowMode: 'always' },
  { name: 'ITEM_NM', headerText: 'ITEM_NM', dataType: 'text', width: 80, visible: true, editable: false, groups: 'ITEM', groupShowMode: 'always' },
  { name: 'ITEM_DESCRIP', headerText: 'DESCRIP', dataType: 'text', width: 80, visible: true, editable: false, groups: 'ITEM', groupShowMode: 'expand' },
  { name: 'ITEM_TP_NM', headerText: 'ITEM_TP_NM', dataType: 'text', width: 80, visible: true, editable: false, groups: 'ITEM', groupShowMode: 'expand' },
  { name: 'ATTR_01', headerText: 'ITEM_ATTR_01', dataType: 'text', width: 80, visible: true, editable: false, groups: 'ITEM', groupShowMode: 'expand' },
  { name: 'ATTR_02', headerText: 'ITEM_ATTR_02', dataType: 'text', width: 80, visible: true, editable: false, groups: 'ITEM', groupShowMode: 'expand' },
  { name: 'ATTR_03', headerText: 'ITEM_ATTR_03', dataType: 'text', width: 100, visible: false, editable: false },
  { name: 'ATTR_04', headerText: 'ITEM_ATTR_04', dataType: 'text', width: 100, visible: false, editable: false },
  { name: 'ATTR_05', headerText: 'ITEM_ATTR_05', dataType: 'text', width: 100, visible: false, editable: false },
  { name: 'ATTR_06', headerText: 'ITEM_ATTR_06', dataType: 'text', width: 100, visible: false, editable: false },
  { name: 'ATTR_07', headerText: 'ITEM_ATTR_07', dataType: 'text', width: 100, visible: false, editable: false },
  { name: 'ATTR_08', headerText: 'ITEM_ATTR_08', dataType: 'text', width: 100, visible: false, editable: false },
  { name: 'ATTR_09', headerText: 'ITEM_ATTR_09', dataType: 'text', width: 100, visible: false, editable: false },
  { name: 'ATTR_10', headerText: 'ITEM_ATTR_10', dataType: 'text', width: 100, visible: false, editable: false },
  { name: 'ATTR_11', headerText: 'ITEM_ATTR_11', dataType: 'text', width: 100, visible: false, editable: false },
  { name: 'ATTR_12', headerText: 'ITEM_ATTR_12', dataType: 'text', width: 100, visible: false, editable: false },
  { name: 'ATTR_13', headerText: 'ITEM_ATTR_13', dataType: 'text', width: 100, visible: false, editable: false },
  { name: 'ATTR_14', headerText: 'ITEM_ATTR_14', dataType: 'text', width: 100, visible: false, editable: false },
  { name: 'ATTR_15', headerText: 'ITEM_ATTR_15', dataType: 'text', width: 100, visible: false, editable: false },
  { name: 'ATTR_16', headerText: 'ITEM_ATTR_16', dataType: 'text', width: 100, visible: false, editable: false },
  { name: 'ATTR_17', headerText: 'ITEM_ATTR_17', dataType: 'text', width: 100, visible: false, editable: false },
  { name: 'ATTR_18', headerText: 'ITEM_ATTR_18', dataType: 'text', width: 100, visible: false, editable: false },
  { name: 'ATTR_19', headerText: 'ITEM_ATTR_19', dataType: 'text', width: 100, visible: false, editable: false },
  { name: 'ATTR_20', headerText: 'ITEM_ATTR_20', dataType: 'text', width: 100, visible: false, editable: false },
  { name: 'UOM_NM', headerText: 'UOM_NM', dataType: 'text', width: 80, editable: false, groups: 'ITEM', groupShowMode: 'expand' },
  { name: 'STOCK', headerText: 'STOCK', dataType: 'text', width: 80, editable: false, groups: 'ITEM', groupShowMode: 'expand' },
  { name: 'RES_GRP_CD', headerText: 'RES_GRP_CD', dataType: 'text', width: 80, visible: true, editable: false, groups: 'RES', groupShowMode: 'expand' },
  { name: 'RES_GRP_NM', headerText: 'RES_GRP_NM', dataType: 'text', width: 80, visible: true, editable: false, groups: 'RES', groupShowMode: 'expand' },
  { name: 'RES_ATTR_CD', headerText: 'RES_ATTR_CD', dataType: 'text', width: 100, visible: false, editable: false, groups: 'RES', groupShowMode: 'expand' },
  { name: 'RES_ATTR_NM', headerText: 'RES_ATTR_NM', dataType: 'text', width: 100, visible: false, editable: false, groups: 'RES', groupShowMode: 'expand' },
  { name: 'RES_CD', headerText: 'RES_CD', dataType: 'text', width: 80, visible: true, editable: false, groups: 'RES', groupShowMode: 'always' },
  { name: 'RES_DESCRIP', headerText: 'RES_DESCRIP', dataType: 'text', width: 100, visible: true, editable: false, groups: 'RES', groupShowMode: 'always' },
  { name: 'CATEGORY_GROUP', headerText: 'CATEGORY_GROUP', dataType: 'text', width: 100, visible: true, editable: false, merge: true },
  { name: 'CATEGORY', headerText: 'CATEGORY', dataType: 'text', width: 100, visible: true, editable: false, lang: true,
    styleCallback: function () {
      let ret = {};

      ret.styleName = 'category-column-cell-bg tet-column'
      return ret;
    }
  },
  { name: 'DAT', dataType: 'number', width: 100, editable: false, background: '#FFFFFFFF', iteration: { prefix: 'DAT_', prefixRemove: 'true' },
    styleCallback: function (grid, dataCell) {
      let category = grid.getValue(dataCell.index.itemIndex, 'CATEGORY');
      let ret = {};

      switch (category) {
        case 'DMND_QTY':
          ret.styleName = 'demand-qty-cell-bg number-column';
          return ret;
        case 'SHIPPING_SCHEDULED':
          ret.styleName = 'shipping-scheduled-cell-bg number-column';
          return ret;
        case 'DUE_IN':
          ret.styleName = 'due-in-cell-bg number-column';
          return ret;
      }
    }
  }
]

function ResProductionPlanning() {
  const location = useLocation();
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const [gridResProductionPlanning, setGridResProductionPlanning] = useState(null);

  const [simulationVersionPopupOpen, setSimulationVersionPopupOpen] = useState(false);
  const [confirmPlanPopupOpen, setConfirmPlanPopupOpen] = useState(false);
  const [resourcePopupOpen, setResourcePopupOpen] = useState(false);

  const itemSearchBoxRef = useRef();
  const [currentItemRef, setCurrentItemRef] = useState(null);

  const locationSearchBoxRef = useRef();
  const [currentLocationRef, setCurrentLocationRef] = useState(null);

  const [resourceProductionData, setResourceProductionData] = useState({
    labels: [],
    datasets: []
  })

  const [newSimulationVersionPopupOpen, setNewSimulationVersionPopupOpen] = useState(false);
  const [adjustPlanPopupOpen, setAdjustPlanPopupOpen] = useState(false);

  const { reset, getValues, setValue, control } = useForm({
    defaultValues: {
      simulationVersion: '',
      resourceCode: '',
      resourceDescription: '',
    }
  });

  const exportOptions = {
    headerDepth: 2,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  };

  useEffect(() => {
    if (itemSearchBoxRef) {
      if (itemSearchBoxRef.current) {
        setCurrentItemRef(itemSearchBoxRef.current);
      }
    }

    if (locationSearchBoxRef) {
      if (locationSearchBoxRef.current) {
        setCurrentLocationRef(locationSearchBoxRef.current);
      }
    }
  }, [viewData]);

  useEffect(() => {
    if (location.state !== undefined && location.state !== null) {
      if (location.state.params !== undefined) {
        if (gridResProductionPlanning && currentItemRef && currentLocationRef) {
          setValue('simulationVersion', location.state.params['VERSION_ID']);
//           setValue('resourceCode', location.state.params['RES_CD']);
//           setValue('resourceDescription', location.state.params['RES_DESCRIP']);
          currentLocationRef.setLocationCode(location.state.params['LOCATION_CODE']);
          currentItemRef.setItemCode(location.state.params['ITEM_CD']);
          loadResProductionPlanning();
        }
      }
    }
  }, [location]);

  useEffect(() => {
    setViewInfo(vom.active, 'globalButtons', [
      { name: 'search', action: (e) => { loadResProductionPlanning(); }, visible: true, disable: false },
      { name: 'refresh', action: (e) => { refresh(); }, visible: true, disable: false }
    ]);

    if (gridResProductionPlanning) {
      async function initLoad() {
        await loadRecentSimulationVersion();
        loadResProductionPlanning();
      }

      initLoad();
    }
  }, [gridResProductionPlanning]);

  function loadRecentSimulationVersion() {
    let param = new FormData();

    param.append('MODULE_CD', 'MP');
    param.append('MAIN_VER_ID', '');
    param.append('SIMUL_VER_ID', '');
    param.append('SIMUL_VER_DESCRIP', '');

    return zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_COMM_SRH_VER_Q',
      data: param
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          setValue('simulationVersion', res.data.RESULT_DATA[0].SIMUL_VER);
          setResourceProductionChartLegend();
        }
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
        if (location.state !== undefined && location.state !== null) {
          if (location.state.params !== undefined) {
            setValue('simulationVersion', location.state.params['VERSION_ID']);
            //setValue('resourceCode', location.state.params['RES_CD']);
            //setValue('resourceDescription', location.state.params['RES_DESCRIP']);
            currentLocationRef.setLocationCode(location.state.params['LOCATION_CODE']);
            currentItemRef.setItemCode(location.state.params['ITEM_CD']);
          }
        }
      });
  }

  function refresh() {
    reset({
      simulationVersion: getValues('simulationVersion')
    });
    currentLocationRef.reset();
    currentItemRef.reset();
    gridResProductionPlanning.dataProvider.clearRows();
    setResourceProductionChartLegend();
  }

  function setGridResProductionPlanningOptions(gridObj) {
    gridObj.gridView.setEditOptions({
      insertable: true,
      appendable: true
    });

    gridObj.gridView.setFixedOptions({ colCount: 5, resizable: true });
    gridObj.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridObj, true, true, false);

    gridObj.gridView.onCellClicked = function (grid, clickData, column) {
      if (clickData.cellType && clickData.cellType === 'data') {
        let data = gridObj.dataProvider.getOutputRow(null, clickData.dataRow);
        loadResourceProductionChart(gridObj, data);
      }
    }

    gridObj.gridView.setColumnProperty('LOCAT_TP_NM', 'mergeRule', { criteria: 'values[ "LOCAT_CD" ]' });
    gridObj.gridView.setColumnProperty('LOCAT_LV', 'mergeRule', { criteria: 'values[ "LOCAT_CD" ]' });
    gridObj.gridView.setColumnProperty('LOCAT_CD', 'mergeRule', { criteria: 'values[ "LOCAT_CD" ]' });
    gridObj.gridView.setColumnProperty('LOCAT_NM', 'mergeRule', { criteria: 'values[ "LOCAT_CD" ]' });
    gridObj.gridView.setColumnProperty('LOCAT_GRP_CD', 'mergeRule', { criteria: 'values[ "LOCAT_CD" ]' });
    gridObj.gridView.setColumnProperty('BUSINESS_UNIT', 'mergeRule', { criteria: 'values[ "LOCAT_CD" ]' });
    gridObj.gridView.setColumnProperty('IN_OUT_FLAG', 'mergeRule', { criteria: 'values[ "LOCAT_CD" ]' });
    gridObj.gridView.setColumnProperty('ITEM_CD', 'mergeRule', { criteria: 'values[ "LOCAT_CD" ] + values[ "ITEM_CD" ]' });
    gridObj.gridView.setColumnProperty('ITEM_NM', 'mergeRule', { criteria: 'values[ "LOCAT_CD" ] + values[ "ITEM_CD" ]' });
    gridObj.gridView.setColumnProperty('ITEM_TP_NM', 'mergeRule', { criteria: 'values[ "LOCAT_CD" ] + values[ "ITEM_CD" ]' });
    gridObj.gridView.setColumnProperty('ITEM_DESCRIP', 'mergeRule', { criteria: 'values[ "LOCAT_CD" ] + values[ "ITEM_CD" ]' });
    gridObj.gridView.setColumnProperty('ATTR_01', 'mergeRule', { criteria: 'values[ "LOCAT_CD" ] + values[ "ITEM_CD" ]' });
    gridObj.gridView.setColumnProperty('ATTR_02', 'mergeRule', { criteria: 'values[ "LOCAT_CD" ] + values[ "ITEM_CD" ]' });
    gridObj.gridView.setColumnProperty('UOM_NM', 'mergeRule', { criteria: 'values[ "LOCAT_CD" ] + values[ "ITEM_CD" ]' });
    gridObj.gridView.setColumnProperty('STOCK', 'mergeRule', { criteria: 'values[ "LOCAT_CD" ] + values[ "ITEM_CD" ]' });
    gridObj.gridView.setColumnProperty('RES_GRP_CD', 'mergeRule', { criteria: 'values[ "LOCAT_CD" ] + values[ "ITEM_CD" ] + values[ "RES_CD" ]' });
    gridObj.gridView.setColumnProperty('RES_GRP_NM', 'mergeRule', { criteria: 'values[ "LOCAT_CD" ] + values[ "ITEM_CD" ] + values[ "RES_CD" ]' });
    gridObj.gridView.setColumnProperty('RES_ATTR_CD', 'mergeRule', { criteria: 'values[ "LOCAT_CD" ] + values[ "ITEM_CD" ] + values[ "RES_CD" ]' });
    gridObj.gridView.setColumnProperty('RES_ATTR_NM', 'mergeRule', { criteria: 'values[ "LOCAT_CD" ] + values[ "ITEM_CD" ] + values[ "RES_CD" ]' });
    gridObj.gridView.setColumnProperty('RES_CD', 'mergeRule', { criteria: 'values[ "LOCAT_CD" ] + values[ "ITEM_CD" ] + values[ "RES_CD" ]' });
    gridObj.gridView.setColumnProperty('RES_DESCRIP', 'mergeRule', { criteria: 'values[ "LOCAT_CD" ] + values[ "ITEM_CD" ] + values[ "RES_CD" ]' });
  }

  function setResourceProductionChartLegend() {
    let resourceProductionDataSet = [
      { type: 'line', label: transLangKey('DMND_QTY'), borderColor: '#8EBC00', borderWidth: 2, fill: false, yAxisID: 'quantity', data: { } },
      { type: 'bar', label: transLangKey('TOTAL_PRDUCT_PLAN'), borderColor: 'white', borderWidth: 2, fill: false, backgroundColor: '#5DB85B', order: 1, yAxisID: 'quantity', data: { } },
      { type: 'line', label: transLangKey('EOH'), borderColor: '#25A0DA', borderWidth: 2, yAxisID: 'quantity', data: { } },
      { type: 'line', label: transLangKey('PREDICT_REVENUE'), borderColor: '#FF6900', borderWidth: 2, fill: false, yAxisID: 'amount', data: { } },
      { type: 'line', label: transLangKey('STOCK_AMT'), borderColor: '#E61E26', borderWidth: 2, fill: false, yAxisID: 'amount', data: { } }
    ];

    setResourceProductionData({
      labels: [],
      datasets: resourceProductionDataSet
    });
  }

  function afterGridResProductionPlanning(gridObj) {
    setGridResProductionPlanning(gridObj);
    setGridResProductionPlanningOptions(gridObj);
  }

  function openSimulationVersionPopup() {
    setSimulationVersionPopupOpen(true);
  }

  function closeSimulationVersionPopup() {
    setSimulationVersionPopupOpen(false);
  }

  function setSimulationVersion(data) {
    setValue('simulationVersion', data.SIMUL_VER);
  }

  function openConfirmPlanPopup() {
    setConfirmPlanPopupOpen(true);
  }

  function closeConfirmPlanPopup() {
    setConfirmPlanPopupOpen(false);
  }

  function openResourcePopup() {
    setResourcePopupOpen(true);
  }

  function closeResourcePopup() {
    setResourcePopupOpen(false);
  }

  function loadResProductionPlanning() {
    let param = new FormData();

    param.append('VERSION_ID', getValues('simulationVersion'));
    param.append('LOCAT_TP_NM', currentLocationRef.getLocationType());
    param.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    param.append('LOCAT_CD', currentLocationRef.getLocationCode());
    param.append('LOCAT_NM', currentLocationRef.getLocationName());
    param.append('ITEM_CD', currentItemRef.getItemCode());
    param.append('ITEM_NM', currentItemRef.getItemName());
    param.append('ITEM_TP_NM', currentItemRef.getItemType());
    param.append('RES_CD', getValues('resourceCode'));
    param.append('RES_DESCRIP', getValues('resourceDescription'));
    param.append('RES_ATTR_NM', '');
    param.append('LIKE_SEARCH_YN', 'Y');
    param.append('CROSSTAB', JSON.stringify(gridResProductionPlanning.gridView.crossTabInfo));

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/GetResourcePlan',
      data: param
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          let data = res.data.RESULT_DATA.sort(function (a, b) {
            if (a.LOCAT_CD > b.LOCAT_CD) {
              return 1;
            } else if (a.LOCAT_CD < b.LOCAT_CD) {
              return -1;
            } else {
              if (a.ITEM_CD > b.ITEM_CD) {
                return 1;
              } else if (a.ITEM_CD < b.ITEM_CD) {
                return -1;
              } else {
                return 0;
              }
            }
          });

          gridResProductionPlanning.dataProvider.clearRows();
          gridResProductionPlanning.setData(data);
          setResourceProductionChartLegend();
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function loadResourceProductionChart(grid, data) {
    let resourceProductionColumns = ['DMND_QTY', 'TOTAL_PRDUCT_PLAN', 'EOH', 'PREDICT_REVENUE', 'STOCK_AMT'];
    let resourceProductionDataSet = [
      { type: 'line', label: transLangKey('DMND_QTY'), borderColor: '#8EBC00', borderWidth: 2, fill: false, yAxisID: 'quantity', data: { } },
      { type: 'bar', label: transLangKey('TOTAL_PRDUCT_PLAN'), borderColor: 'white', borderWidth: 2, backgroundColor: '#5DB85B', order: 1, yAxisID: 'quantity', data: { } },
      { type: 'line', label: transLangKey('EOH'), borderColor: '#25A0DA', borderWidth: 2, fill: false, yAxisID: 'quantity', data: { } },
      { type: 'line', label: transLangKey('PREDICT_REVENUE'), borderColor: '#FF6900', borderWidth: 2, fill: false, yAxisID: 'amount', data: { } },
      { type: 'line', label: transLangKey('STOCK_AMT'), borderColor: '#E61E26', borderWidth: 2, fill: false, yAxisID: 'amount', data: { } }
    ];

    let dateColumn = [];
    grid.dataProvider.getFieldNames().filter(fieldName => fieldName.includes('DAT_')).forEach(fieldName => dateColumn.push(fieldName));

    let date = dateColumn.map(fieldName => fieldName.replace('DAT_', ''));
    let targetData = grid.dataProvider.getJsonRows().filter(row => row.LOCAT_CD === data.LOCAT_CD && row.ITEM_CD === data.ITEM_CD);

    for (let i = 0; i < resourceProductionColumns.length; i++) {
      let rows = targetData.filter(targetRow => targetRow.CATEGORY === resourceProductionColumns[i]);
      resourceProductionDataSet[i].data = {};

      rows.forEach(row => {
        for (let j = 0; j < dateColumn.length; j++) {
          resourceProductionDataSet[i].data[date[j]] = row[dateColumn[j]];
        }
      })
    }

    setResourceProductionData({
      labels: date,
      datasets: resourceProductionDataSet
    });
  }

  function onSetResource(gridRow) {
    setValue('resourceCode', gridRow.RES_CD);
    setValue('resourceDescription', gridRow.RES_DESCRIP);
  }

  function loadConfirmSimulVer() {
    let param = new FormData();

    param.append('SIMUL_VER_ID', getValues('simulationVersion'));

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_CM_17_Q5',
      data: param
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
    let param = new FormData();

    param.append('SIMUL_VER_ID', getValues('simulationVersion'));

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_CM_17_Q6',
      data: param
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
            <InputField type="action" name="simulationVersion" label={transLangKey("SIMUL_VER_SHORTN")} title={transLangKey("SEARCH")} onClick={openSimulationVersionPopup} control={control} style={{ width: "210px" }}>
              <Icon.Search />
            </InputField>
            <LocationSearchBox ref={locationSearchBoxRef} keyValue={"locationCode"} placeHolder={transLangKey("LOCAT_CD")} />
            <ItemSearchBox ref={itemSearchBoxRef} keyValue={"itemName"} placeHolder={transLangKey("ITEM_NM")} />
            <InputField type="action" name="resourceCode" label={transLangKey("RES_CD")} title={transLangKey("SEARCH")} onClick={openResourcePopup} control={control}>
              <Icon.Search />
            </InputField>
            <InputField name="resourceDescription" label={transLangKey("RES_DESCRIP")} control={control} />
          </SearchRow>
        </SearchArea>
        <ButtonArea>
          <LeftButtonArea>
            <GridExcelExportButton type="icon" grid="gridResProductionPlanning" options={exportOptions} />
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
        </ButtonArea>
        <ResultArea sizes={[70, 30]} direction={"vertical"}>
          <Box>
            <BaseGrid id="gridResProductionPlanning" items={gridResProductionPlanningColumns} viewCd="UI_MP_29" gridCd="UI_MP_29-RST_CPT_01" afterGridCreate={afterGridResProductionPlanning} />
          </Box>
          <Box>
            <Box style={{ width: "100%", height: "100%" }}>
              <Chart data={resourceProductionData} options={resourceProductionChartOptions} />
            </Box>
          </Box>
        </ResultArea>
      </ContentInner>

      {simulationVersionPopupOpen && (<PopSimulationVersion open={simulationVersionPopupOpen} onClose={closeSimulationVersionPopup} confirm={setSimulationVersion} module={'MP'} />)}
      {confirmPlanPopupOpen && (<PopConfirmPlan open={confirmPlanPopupOpen} onClose={closeConfirmPlanPopup} confirm={loadResProductionPlanning} param={getValues('simulationVersion')} />)}
      {resourcePopupOpen && (<PopCommResource open={resourcePopupOpen} onClose={closeResourcePopup} confirm={onSetResource} />)}
      <PopNewSimulationVersion open={newSimulationVersionPopupOpen} onClose={() => { setNewSimulationVersionPopupOpen(false) }} versionId={getValues('simulationVersion')} />
      <PopConfirmAdjPlan open={adjustPlanPopupOpen} onClose={() => { setAdjustPlanPopupOpen(false) }} confirm={loadResProductionPlanning} versionId={getValues('simulationVersion')} />
    </>
  )
}

export default ResProductionPlanning;
