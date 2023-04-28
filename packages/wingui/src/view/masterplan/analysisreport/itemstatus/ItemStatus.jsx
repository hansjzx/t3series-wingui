import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Tab, Tabs } from '@mui/material';
import { BaseGrid, ContentInner, InputField, ResultArea, SearchArea, SearchRow, useViewStore, useIconStyles, zAxios } from '@zionex/wingui-core/src/common/imports';

import LocationSearchBox from '@wingui/view/supplychainmodel/common/LocationSearchBox';
import ItemSearchBox from '@wingui/view/supplychainmodel/common/ItemSearchBox';
import PopSimulationVersion from '@wingui/view/masterplan/common/PopSimulationVersion';

import '@wingui/view/masterplan/common/common.css';

import { Chart as ChartJS, LinearScale, CategoryScale, BarElement, PointElement, LineElement, Title, Legend, Tooltip, LineController, BarController } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register( LinearScale, CategoryScale, BarElement, PointElement, LineElement, Title, Legend, Tooltip, LineController, BarController );

const itemStatusChartOptions = {
  plugins: {
    title: { display: false, text: transLangKey('UI_MP_41') },
    legend: { position: 'bottom' }
  },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    baseAxes: { axis: 'x' },
    overlapAxes: { axis: 'x', offset: true, display: false },
    quantity: { axis: 'y', position: 'left', title: { display: true, text: transLangKey('QTY') } }
  }
};

let gridStockColumns = [
  { name: 'CONSUME_LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: 80, visible: false, editable: false, groups: 'CONSUME' },
  { name: 'CONSUME_LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: 80, visible: false, editable: false, groups: 'CONSUME' },
  { name: 'CONSUME_LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: 80, visible: true, editable: false, groups: 'CONSUME' },
  { name: 'CONSUME_LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: 110, visible: true, editable: false, groups: 'CONSUME' },
  { name: 'ACCOUNT_CD', headerText: 'ACCOUNT_CD', dataType: 'text', width: 100, visible: false, editable: false, groups: 'CONSUME' },
  { name: 'ACCOUNT_NM', headerText: 'ACCOUNT_NM', dataType: 'text', width: 100, visible: false, editable: false, groups: 'CONSUME' },
  { name: 'CHANNEL_TP', headerText: 'CHANNEL_TP', dataType: 'text', width: 100, visible: false, editable: false, groups: 'CONSUME' },
  { name: 'INCOTERMS', headerText: 'INCOTERMS', dataType: 'text', width: 100, visible: false, editable: false, groups: 'CONSUME' },
  { name: 'SUPPLY_LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: 80, visible: false, editable: false, groups: 'SUPPLY' },
  { name: 'SUPPLY_LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: 80, visible: false, editable: false, groups: 'SUPPLY' },
  { name: 'SUPPLY_LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: 80, visible: true, editable: false, groups: 'SUPPLY' },
  { name: 'SUPPLY_LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: 110, visible: true, editable: false, groups: 'SUPPLY' },
  { name: 'VEHICL_TP', headerText: 'VEHICL_VAL', dataType: 'text', width: 80, visible: true, editable: false },
  { name: 'BOD_LEADTIME_PERIOD', headerText: 'BOD_LEADTIME_PERIOD', dataType: 'text', width: 100, visible: false, editable: false },
  { name: 'ITEM_CD', headerText: 'ITEM_CD', dataType: 'text', width: 80, visible: true, editable: false, groups: 'ITEM' },
  { name: 'ITEM_NM', headerText: 'ITEM_NM', dataType: 'text', width: 80, visible: true, editable: false, groups: 'ITEM' },
  { name: 'ITEM_TP', headerText: 'ITEM_TP', dataType: 'text', width: 80, visible: false, editable: false, groups: 'ITEM' },
  { name: 'CATEGORY', headerText: 'CATEGORY', dataType: 'text', width: 100, visible: true, editable: false, lang: true,
    styleCallback: function () {
      let ret = {};

      ret.styleName = 'category-column-cell-bg tet-column'
      return ret;
    }
  },
  { name: 'DAT', dataType: 'number', width: 100, editable: false, numberFormat: "#,###.###", iteration: { prefix: 'DAT_', prefixRemove: 'true' }}
]

let gridOperationColumns = [
  {
    name: 'CONSUME', dataType: 'group', orientation: 'horizontal', headerText: 'CONSUME', expandable: true, expanded: false,
    childs: [
      { name: 'CONSUME_LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: 80, visible: true, editable: false, groups: 'CONSUME', groupShowMode: 'expand' },
      { name: 'CONSUME_LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: 80, visible: true, editable: false, groups: 'CONSUME', groupShowMode: 'expand' },
      { name: 'CONSUME_LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: 80, visible: true, editable: false, groups: 'CONSUME', groupShowMode: 'always' },
      { name: 'CONSUME_LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: 110, visible: true, editable: false, groups: 'CONSUME', groupShowMode: 'always' },
      { name: 'ACCOUNT_CD', headerText: 'ACCOUNT_CD', dataType: 'text', width: 100, visible: true, editable: false, groups: 'CONSUME', groupShowMode: 'expand' },
      { name: 'ACCOUNT_NM', headerText: 'ACCOUNT_NM', dataType: 'text', width: 100, visible: true, editable: false, groups: 'CONSUME', groupShowMode: 'expand' },
      { name: 'CHANNEL_TP', headerText: 'CHANNEL_TP', dataType: 'text', width: 100, visible: true, editable: false, groups: 'CONSUME', groupShowMode: 'expand' },
      { name: 'INCOTERMS', headerText: 'INCOTERMS', dataType: 'text', width: 100, visible: true, editable: false, groups: 'CONSUME', groupShowMode: 'expand' }
    ]
  },
  {
    name: 'SUPPLY', dataType: 'group', orientation: 'horizontal', headerText: 'SUPPLY', expandable: true, expanded: false,
    childs: [
      { name: 'SUPPLY_LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: 80, visible: true, editable: false, groups: 'SUPPLY', groupShowMode: 'expand' },
      { name: 'SUPPLY_LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: 80, visible: true, editable: false, groups: 'SUPPLY', groupShowMode: 'expand' },
      { name: 'SUPPLY_LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: 80, visible: true, editable: false, groups: 'SUPPLY', groupShowMode: 'always' },
      { name: 'SUPPLY_LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: 110, visible: true, editable: false, groups: 'SUPPLY', groupShowMode: 'always' }
    ]
  },
  { name: 'VEHICL_TP', headerText: 'VEHICL_VAL', dataType: 'text', width: 80, visible: true, editable: false },
  { name: 'BOD_LEADTIME_PERIOD', headerText: 'BOD_LEADTIME_PERIOD', dataType: 'text', width: 100, visible: false, editable: false },
  {
    name: 'ITEM', dataType: 'group', orientation: 'horizontal', headerText: 'ITEM', expandable: true, expanded: false,
    childs: [
      { name: 'ITEM_CD', headerText: 'ITEM_CD', dataType: 'text', width: 80, visible: true, editable: false, groups: 'ITEM', groupShowMode: 'always' },
      { name: 'ITEM_NM', headerText: 'ITEM_NM', dataType: 'text', width: 80, visible: true, editable: false, groups: 'ITEM', groupShowMode: 'always' },
      { name: 'ITEM_TP', headerText: 'ITEM_TP', dataType: 'text', width: 80, visible: true, editable: false, groups: 'ITEM', groupShowMode: 'expand' }
    ]
  },
  { name: 'DAT', headerText: 'DATE', dataType: 'datetime', width: 100, visible: true, editable: false, format: 'yyyy-MM-dd', autoFilter: true },
  { name: 'WORK_CD', headerText: 'WORK_CD', dataType: 'text', width: 120, visible: true, editable: false },
  { name: 'PO_ID', headerText: 'PO_ID', dataType: 'text', width: 180, visible: true, editable: false },
  { name: 'SO_ID', headerText: 'SO_ID', dataType: 'text', width: 170, visible: true, editable: false },
  { name: 'IN_OUT_QTY', headerText: 'IN_OUT_QTY', dataType: 'text', width: 100, visible: true, editable: false },
  { name: 'CATEGORY', headerText: 'CATEGORY', dataType: 'text', width: 60, visible: true, editable: false },
  { name: 'GRADE', headerText: 'GRADE', dataType: 'text', width: 60, visible: true, editable: false },
  { name: 'SEQ', headerText: 'SEQ', dataType: 'text', width: 60, visible: true, editable: false }
]

function ItemStatus() {
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const [gridStock, setGridStock] = useState(null);
  const [gridOperation, setGridOperation] = useState(null);
  const [tabValue, setTabValue] = useState('stock');

  const [simulationVersionPopupOpen, setSimulationVersionPopupOpen] = useState(false);

  const consumeLocationSearchBoxRef = useRef();
  const [currentConsumeLocationRef, setCurrentConsumeLocationRef] = useState(null);

  const supplyLocationSearchBoxRef = useRef();
  const [currentSupplyLocationRef, setCurrentSupplyLocationRef] = useState(null);

  const itemSearchBoxRef = useRef();
  const [currentItemRef, setCurrentItemRef] = useState(null);

  const [itemStatusData, setItemStatusData] = useState({
    labels: [],
    datasets: []
  })

  const { reset, getValues, setValue, control, watch } = useForm({
    defaultValues: {
      simulationVersion: '',
      searchCondition: 'P',
    }
  });

  useEffect(() => {
    if (consumeLocationSearchBoxRef) {
      if (consumeLocationSearchBoxRef.current) {
        setCurrentConsumeLocationRef(consumeLocationSearchBoxRef.current);
      }
    }

    if (supplyLocationSearchBoxRef) {
      if (supplyLocationSearchBoxRef.current) {
        setCurrentSupplyLocationRef(supplyLocationSearchBoxRef.current);
      }
    }

    if (itemSearchBoxRef) {
      if (itemSearchBoxRef.current) {
        setCurrentItemRef(itemSearchBoxRef.current);
      }
    }
  }, [viewData]);

  useEffect(() => {
    setViewInfo(vom.active, 'globalButtons', [
      { name: 'search', action: (e) => { loadData(tabValue); }, visible: true, disable: false },
      { name: 'refresh', action: (e) => { refresh(tabValue); }, visible: true, disable: false }
    ]);

    if (gridStock && gridOperation) {
      async function initLoad() {
        await loadRecentSimulationVersion();
        await loadStockGridData();
        loadOperationGridData();
      }

      initLoad();
    }
  }, [gridStock, gridOperation]);

  function loadRecentSimulationVersion() {
    let param = new URLSearchParams();

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
        if (res.data.RESULT_DATA.length > 0) {
          setValue('simulationVersion', res.data.RESULT_DATA[0].SIMUL_VER);
        }
        setItemStatusChartLegend();
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function refresh(tab) {
    reset({
      simulationVersion: getValues('simulationVersion')
    });
    currentConsumeLocationRef.reset();
    currentSupplyLocationRef.reset();
    currentItemRef.reset();

    if (tab === 'stock') {
      gridStock.dataProvider.clearRows();
      setItemStatusChartLegend();
    } else if (tab === 'operation') {
      gridOperation.dataProvider.clearRows();
    }
  }

  function afterGridStock(gridObj) {
    setGridStock(gridObj);
    setGridStockOptions(gridObj);
  }

  function afterGridOperation(gridObj) {
    setGridOperation(gridObj);
    setGridOperationOptions(gridObj);
  }

  function setGridStockOptions(gridObj) {
    gridObj.gridView.setEditOptions({
      insertable: true,
      appendable: true
    });

    gridObj.gridView.setFixedOptions({ colCount: 5, resizable: true });
    gridObj.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridObj, true, false, false);

    gridObj.gridView.onCellClicked = function (grid, clickData, column) {
      if (clickData.cellType && clickData.cellType === 'data') {
        let data = gridObj.dataProvider.getOutputRow(null, clickData.dataRow);
        loadItemStatusChart(gridObj, data);
      }
    }

    wingui.util.grid.sorter.orderBy(gridObj.gridView, ['CONSUME_LOCAT_TP_NM', 'CONSUME_LOCAT_LV', 'CONSUME_LOCAT_CD', 'CONSUME_LOCAT_NM', 'SUPPLY_LOCAT_TP_NM', 'SUPPLY_LOCAT_LV', 'SUPPLY_LOCAT_CD', 'SUPPLY_LOCAT_NM', 'ITEM_TP', 'ITEM_CD', 'ITEM_NM']);

    gridObj.gridView.setColumnProperty('CONSUME_LOCAT_TP_NM', 'mergeRule', { criteria: 'value' });
    gridObj.gridView.setColumnProperty('CONSUME_LOCAT_LV', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('CONSUME_LOCAT_CD', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('CONSUME_LOCAT_NM', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('SUPPLY_LOCAT_TP_NM', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('SUPPLY_LOCAT_LV', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('SUPPLY_LOCAT_CD', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('SUPPLY_LOCAT_NM', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('VEHICL_TP', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('ITEM_CD', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('ITEM_NM', 'mergeRule', { criteria: 'prevvalues + value' });

    if (getValues('searchCondition') === 'P') {
      gridObj.gridView.columnByName('SUPPLY_LOCAT_CD').visible = false;
      gridObj.gridView.columnByName('SUPPLY_LOCAT_NM').visible = false;
      gridObj.gridView.columnByName('VEHICL_TP').visible = false;
      gridObj.gridView.setFixedOptions({ colCount: 3 });
    } else {
      gridObj.gridView.columnByName('SUPPLY_LOCAT_CD').visible = true;
      gridObj.gridView.columnByName('SUPPLY_LOCAT_NM').visible = true;
      gridObj.gridView.columnByName('VEHICL_TP').visible = true;
      gridObj.gridView.setFixedOptions({ colCount: 5 });
    }
  }

  function setGridOperationOptions(gridObj) {
    gridObj.gridView.setEditOptions({
      insertable: true,
      appendable: true
    });

    gridObj.gridView.setFixedOptions({ colCount: 5, resizable: true });
    gridObj.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridObj, true, false, false);

    wingui.util.grid.sorter.orderBy(gridObj.gridView, ['DAT']);

    gridObj.gridView.setColumnProperty('CONSUME_LOCAT_TP_NM', 'mergeRule', { criteria: 'value' });
    gridObj.gridView.setColumnProperty('CONSUME_LOCAT_LV', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('CONSUME_LOCAT_CD', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('CONSUME_LOCAT_NM', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('SUPPLY_LOCAT_TP_NM', 'mergeRule', { criteria: 'value' });
    gridObj.gridView.setColumnProperty('SUPPLY_LOCAT_LV', 'mergeRule', { criteria: 'values[ "SUPPLY_LOCAT_TP_NM" ] + value' });
    gridObj.gridView.setColumnProperty('SUPPLY_LOCAT_CD', 'mergeRule', { criteria: 'values[ "SUPPLY_LOCAT_TP_NM" ] + values[ "SUPPLY_LOCAT_LV" ] + value' });
    gridObj.gridView.setColumnProperty('SUPPLY_LOCAT_NM', 'mergeRule', { criteria: 'values[ "SUPPLY_LOCAT_TP_NM" ] + values[ "SUPPLY_LOCAT_LV" ] + values[ "SUPPLY_LOCAT_CD" ] + value' });
    gridObj.gridView.setColumnProperty('VEHICL_TP', 'mergeRule', { criteria: 'value' });
    gridObj.gridView.setColumnProperty('ITEM_CD', 'mergeRule', { criteria: 'value' });
    gridObj.gridView.setColumnProperty('ITEM_NM', 'mergeRule', { criteria: 'values[ "ITEM_CD" ] + value' });
    gridObj.gridView.setColumnProperty('ITEM_TP', 'mergeRule', { criteria: 'values[ "ITEM_CD" ] + values[ "ITEM_NM" ] + value' });

    if (getValues('searchCondition') === 'P') {
      gridObj.gridView.columnByName('SUPPLY_LOCAT_CD').visible = false;
      gridObj.gridView.columnByName('SUPPLY_LOCAT_NM').visible = false;
      gridObj.gridView.columnByName('VEHICL_TP').visible = false;
      gridObj.gridView.setFixedOptions({ colCount: 3 });
    } else {
      gridObj.gridView.columnByName('SUPPLY_LOCAT_CD').visible = true;
      gridObj.gridView.columnByName('SUPPLY_LOCAT_NM').visible = true;
      gridObj.gridView.columnByName('VEHICL_TP').visible = true;
      gridObj.gridView.setFixedOptions({ colCount: 5 });
    }
  }

  function setItemStatusChartLegend() {
    let itemStatusDataSet = [
      { type: 'bar', label: transLangKey('INWH_QTY'), borderColor: 'white', borderWidth: 2, fill: false, backgroundColor: '#25A0DA', order: 1, xAxisID: 'baseAxes', yAxisID: 'quantity', data: { } },
      { type: 'bar', label: transLangKey('RELEASE_QTY'), borderColor: 'white', borderWidth: 2, fill: false, backgroundColor: '#FF6900', order: 1, xAxisID: 'baseAxes', yAxisID: 'quantity', data: { } },
      { type: 'line', label: transLangKey('SFST'), borderColor: '#E61E26', borderWidth: 2, xAxisID: 'baseAxes', yAxisID: 'quantity', data: { } },
      { type: 'line', label: transLangKey('MIN_QTY'), borderColor: '#D8E404', borderWidth: 2, xAxisID: 'baseAxes', yAxisID: 'quantity', data: { } },
      { type: 'line', label: transLangKey('MAX_QTY'), borderColor: '#16ABA9', borderWidth: 2, xAxisID: 'baseAxes', yAxisID: 'quantity', data: { } },
      { type: 'bar', label: transLangKey('EOH'), borderColor: 'white', borderWidth: 2, fill: false, backgroundColor: 'rgba(237, 217, 46, 0.3)', order: 3, xAxisID: 'overlapAxes', yAxisID: 'quantity', data: { }, barPercentage: 1.0, categoryPercentage: 1.0 }
    ];

    setItemStatusData({
      labels: [],
      datasets: itemStatusDataSet
    });
  }

  function openSimulationVersionPopup() {
    setSimulationVersionPopupOpen(true);
  }

  function closeSimulationVersionPopup() {
    setSimulationVersionPopupOpen(false);
  }

  function onSetSimulationVersion(data) {
    setValue('simulationVersion', data.SIMUL_VER);
  }

  function loadData(tab) {
    if (tab === 'stock') {
      loadStockGridData();
    } else if (tab === 'operation') {
      loadOperationGridData();
    }
  }

  function loadStockGridData() {
    let param = new URLSearchParams();

    param.append('VERSION_ID', getValues('simulationVersion'));
    param.append('SCH_COND', getValues('searchCondition'));
    param.append('CONSUME_LOCAT_CD', currentConsumeLocationRef.getLocationCode());
    param.append('SUPPLY_LOCAT_CD', currentSupplyLocationRef.getLocationCode());
    param.append('ITEM_CD', currentItemRef.getItemCode());
    param.append('CROSSTAB', JSON.stringify(gridStock.gridView.crossTabInfo));

    return zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/GetInventoryStatus',
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridStock.dataProvider.clearRows();
        gridStock.setData(res.data.RESULT_DATA);
        setGridStockOptions(gridStock);
        setItemStatusChartLegend();
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function loadOperationGridData() {
    let param = new URLSearchParams();

    param.append('VERSION_ID', getValues('simulationVersion'));
    param.append('SCH_COND', getValues('searchCondition'));
    param.append('CONSUME_LOCAT_CD', currentConsumeLocationRef.getLocationCode());
    param.append('SUPPLY_LOCAT_CD', currentSupplyLocationRef.getLocationCode());
    param.append('ITEM_CD', currentItemRef.getItemCode());

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/GetInventoryOperationInfo',
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridOperation.dataProvider.clearRows();
        gridOperation.setData(res.data.RESULT_DATA);
        setGridOperationOptions(gridOperation);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function loadItemStatusChart(grid, data) {
    let resourceUtilizationColumns = ['INWH_QTY', 'RELEASE_QTY', 'SFST', 'MIN_QTY', 'MAX_QTY', 'EOH'];
    let itemStatusDataSet = [
      { type: 'bar', label: transLangKey('INWH_QTY'), borderColor: 'white', borderWidth: 2, fill: false, backgroundColor: '#25A0DA', order: 1, xAxisID: 'baseAxes', yAxisID: 'quantity', data: { } },
      { type: 'bar', label: transLangKey('RELEASE_QTY'), borderColor: 'white', borderWidth: 2, fill: false, backgroundColor: '#FF6900', order: 1, xAxisID: 'baseAxes', yAxisID: 'quantity', data: { } },
      { type: 'line', label: transLangKey('SFST'), borderColor: '#E61E26', borderWidth: 2, xAxisID: 'baseAxes', yAxisID: 'quantity', data: { } },
      { type: 'line', label: transLangKey('MIN_QTY'), borderColor: '#D8E404', borderWidth: 2, xAxisID: 'baseAxes', yAxisID: 'quantity', data: { } },
      { type: 'line', label: transLangKey('MAX_QTY'), borderColor: '#16ABA9', borderWidth: 2, xAxisID: 'baseAxes', yAxisID: 'quantity', data: { } },
      { type: 'bar', label: transLangKey('EOH'), borderColor: 'white', borderWidth: 0, fill: false, backgroundColor: 'rgba(237, 217, 46, 0.3)', order: 3, xAxisID: 'overlapAxes', yAxisID: 'quantity', data: { }, barPercentage: 1.0, categoryPercentage: 1.0 }
    ];

    let dateColumn = [];
    grid.dataProvider.getFieldNames().filter(fieldName => fieldName.includes('DAT_')).forEach(fieldName => dateColumn.push(fieldName));

    let date = dateColumn.map(fieldName => fieldName.replace('DAT_', ''));
    let targetData = grid.dataProvider.getJsonRows().filter(row => row.SUPPLY_LOCAT_CD === data.SUPPLY_LOCAT_CD && row.CONSUME_LOCAT_CD === data.CONSUME_LOCAT_CD && row.ITEM_CD === data.ITEM_CD);

    for (let i = 0; i < resourceUtilizationColumns.length; i++) {
      let rows = targetData.filter(targetRow => targetRow.CATEGORY === resourceUtilizationColumns[i]);
      itemStatusDataSet[i].data = {};

      rows.forEach(row => {
        for (let j = 0; j < dateColumn.length; j++) {
          itemStatusDataSet[i].data[date[j]] = row[dateColumn[j]];
        }
      })
    }

    setItemStatusData({
      labels: date,
      datasets: itemStatusDataSet
    });
  }

  const tabChange = (event, newValue) => {
    setViewInfo(vom.active, 'globalButtons', [
      { name: 'search', action: (e) => { loadData(newValue); }, visible: true, disable: false },
      { name: 'refresh', action: (e) => { refresh(newValue); }, visible: true, disable: false }
    ]);

    setTabValue(newValue);
  };

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <InputField type="action" name="simulationVersion" label={transLangKey("SIMUL_VER_SHORTN")} title={transLangKey("SEARCH")} onClick={openSimulationVersionPopup} control={control} style={{ width: "210px" }}>
              <Icon.Search />
            </InputField>
            <InputField type="radio" name="searchCondition" control={control} useLabel={false} options={[{ label: transLangKey("PROD"), value: "P" }, { label: transLangKey("TRANSP"), value: "T", }]} />
            <LocationSearchBox ref={consumeLocationSearchBoxRef} keyValue={"locationCode"} label={transLangKey("CONSUME_LOCAT")} placeHolder={transLangKey("LOCAT_CD")} style={{width: 300}} />
            <LocationSearchBox ref={supplyLocationSearchBoxRef} keyValue={"locationCode"} label={transLangKey("SUPPLY_LOCAT")} placeHolder={transLangKey("LOCAT_CD")} style={{width: 300, display: watch("searchCondition") === "T" ? "block" : "none" }} />
            <ItemSearchBox ref={itemSearchBoxRef} keyValue={"itemCode"} placeHolder={transLangKey("ITEM_CD")} style={{width: 300}} />
          </SearchRow>
        </SearchArea>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={tabChange} indicatorColor="primary">
            <Tab label={transLangKey("STOCK_GRID")} value="stock" />
            <Tab label={transLangKey("OPER_GRID")} value="operation" />
          </Tabs>
        </Box>
        <Box sx={{ height: "100%", display : tabValue === "stock" ? "block" : "none" }}>
          <ResultArea sizes={[70, 30]} direction={"vertical"}>
            <Box>
              <BaseGrid id="gridStock" items={gridStockColumns} viewCd="UI_MP_41" gridCd="UI_MP_41-RST_CPT_02" afterGridCreate={afterGridStock} />
            </Box>
            <Box>
              <Box style={{ width: "100%", height: "100%" }}>
                <Bar data={itemStatusData} options={itemStatusChartOptions} />
              </Box>
            </Box>
          </ResultArea>
        </Box>
        <Box sx={{ height: "100%", display : tabValue === "operation" ? "block" : "none" }}>
          <ResultArea>
            <Box style={{ width: "100%", height: "100%" }}>
              <BaseGrid id="gridOperation" items={gridOperationColumns} afterGridCreate={afterGridOperation} />
            </Box>
          </ResultArea>
        </Box>
      </ContentInner>

      {simulationVersionPopupOpen && (<PopSimulationVersion open={simulationVersionPopupOpen} onClose={closeSimulationVersionPopup} confirm={onSetSimulationVersion} module={'MP'} />)}
    </>
  )
}

export default ItemStatus;
