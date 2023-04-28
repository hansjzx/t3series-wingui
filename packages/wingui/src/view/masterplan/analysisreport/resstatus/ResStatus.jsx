import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Tab, Tabs } from '@mui/material';
import { BaseGrid, ContentInner, InputField, ResultArea, SearchArea, SearchRow, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import LocationSearchBox from '@wingui/view/supplychainmodel/common/LocationSearchBox';
import PopSimulationVersion from '@wingui/view/masterplan/common/PopSimulationVersion';
import PopCommResource from '@wingui/view/supplychainmodel/common/PopCommResource';

import '@wingui/view/masterplan/common/common.css';

import { Chart as ChartJS, LinearScale, CategoryScale, BarElement, PointElement, LineElement, Title, Legend, Tooltip, LineController, BarController } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register( LinearScale, CategoryScale, BarElement, PointElement, LineElement, Title, Legend, Tooltip, LineController, BarController );

const resStatusChartOptions = {
  plugins: {
    title: { display: false, text: transLangKey('UI_MP_42') },
    legend: { position: 'bottom' }
  },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true
    },
    capacity: {
      position: 'left',
      stacked: true,
      title: { display: false, text: transLangKey('QTY') }
    }
  }
};

let gridLoadColumns = [
  { name: 'CONSUME_LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: 80, visible: true, editable: false, groups: 'CONSUME', groupShowMode: 'expand' },
  { name: 'CONSUME_LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: 80, visible: true, editable: false, groups: 'CONSUME', groupShowMode: 'expand' },
  { name: 'CONSUME_LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: 80, visible: true, editable: false, groups: 'CONSUME', groupShowMode: 'always' },
  { name: 'CONSUME_LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: 110, visible: true, editable: false, groups: 'CONSUME', groupShowMode: 'always' },
  { name: 'SUPPLY_LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: 80, visible: true, editable: false, groups: 'SUPPLY', groupShowMode: 'expand' },
  { name: 'SUPPLY_LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: 80, visible: true, editable: false, groups: 'SUPPLY', groupShowMode: 'expand' },
  { name: 'SUPPLY_LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: 80, visible: true, editable: false, groups: 'SUPPLY', groupShowMode: 'always' },
  { name: 'SUPPLY_LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: 110, visible: true, editable: false, groups: 'SUPPLY', groupShowMode: 'always' },
  { name: 'VEHICL_TP', headerText: 'VEHICL_VAL', dataType: 'text', width: 80, visible: true, editable: false },
  { name: 'BOD_LEADTIME_PERIOD', headerText: 'BOD_LEADTIME_PERIOD', dataType: 'text', width: 100, visible: false, editable: false },
  { name: 'ITEM_CD', headerText: 'ITEM_CD', dataType: 'text', width: 80, visible: false, editable: false, groups: 'ITEM' },
  { name: 'ITEM_NM', headerText: 'ITEM_NM', dataType: 'text', width: 80, visible: false, editable: false, groups: 'ITEM' },
  { name: 'RES_CD', headerText: 'RES_CD', dataType: 'text', width: 80, visible: true, editable: false, groups: 'RES' },
  { name: 'RES_DESCRIP', headerText: 'RES_DESCRIP', dataType: 'text', width: 80, visible: true, editable: false, groups: 'RES' },
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
  { name: 'CONSUME_LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: 80, visible: true, editable: false, groups: 'CONSUME', groupShowMode: 'expand' },
  { name: 'CONSUME_LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: 80, visible: true, editable: false, groups: 'CONSUME', groupShowMode: 'expand' },
  { name: 'CONSUME_LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: 80, visible: true, editable: false, groups: 'CONSUME', groupShowMode: 'always' },
  { name: 'CONSUME_LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: 110, visible: true, editable: false, groups: 'CONSUME', groupShowMode: 'always' },
  { name: 'ACCOUNT_CD', headerText: 'ACCOUNT_CD', dataType: 'text', width: 100, visible: true, editable: false, groups: 'CONSUME', groupShowMode: 'expand' },
  { name: 'ACCOUNT_NM', headerText: 'ACCOUNT_NM', dataType: 'text', width: 100, visible: true, editable: false, groups: 'CONSUME', groupShowMode: 'expand' },
  { name: 'CHANNEL_TP', headerText: 'CHANNEL_TP', dataType: 'text', width: 100, visible: true, editable: false, groups: 'CONSUME', groupShowMode: 'expand' },
  { name: 'INCOTERMS', headerText: 'INCOTERMS', dataType: 'text', width: 100, visible: true, editable: false, groups: 'CONSUME', groupShowMode: 'expand' },
  { name: 'SUPPLY_LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: 80, visible: true, editable: false, groups: 'SUPPLY', groupShowMode: 'expand' },
  { name: 'SUPPLY_LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: 80, visible: true, editable: false, groups: 'SUPPLY', groupShowMode: 'expand' },
  { name: 'SUPPLY_LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: 80, visible: true, editable: false, groups: 'SUPPLY', groupShowMode: 'always' },
  { name: 'SUPPLY_LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: 110, visible: true, editable: false, groups: 'SUPPLY', groupShowMode: 'always' },
  { name: 'VEHICL_TP', headerText: 'VEHICL_VAL', dataType: 'text', width: 100, visible: true, editable: false, autoFilter: true },
  { name: 'BOD_LEADTIME_PERIOD', headerText: 'BOD_LEADTIME_PERIOD', dataType: 'text', width: 100, visible: false, editable: false },
  { name: 'RES_CD', headerText: 'RES_CD', dataType: 'text', width: 80, visible: true, editable: false, groups: 'RESOURCE' },
  { name: 'RES_DESCRIP', headerText: 'RES_DESCRIP', dataType: 'text', width: 110, visible: true, editable: false, groups: 'RESOURCE' },
  { name: 'ITEM_CD', headerText: 'ITEM_CD', dataType: 'text', width: 100, visible: true, editable: false, autoFilter: true, groups: 'ITEM' },
  { name: 'ITEM_NM', headerText: 'ITEM_NM', dataType: 'text', width: 100, visible: true, editable: false, autoFilter: true, groups: 'ITEM' },
  { name: 'STRT_DATE', headerText: 'STRT_DATE', dataType: 'datetime', width: 100, visible: true, editable: false, format: 'yyyy-MM-dd', autoFilter: true },
  { name: 'WORK_CD', headerText: 'WORK_CD', dataType: 'text', width: 120, visible: true, editable: false },
  { name: 'PO_ID', headerText: 'PO_ID', dataType: 'text', width: 180, visible: true, editable: false },
  { name: 'SO_ID', headerText: 'SO_ID', dataType: 'text', width: 170, visible: true, editable: false },
  { name: 'IN_QTY', headerText: 'IN_QTY', dataType: 'text', width: 80, visible: true, editable: false },
  { name: 'COMPL_QTY', headerText: 'COMPL_QTY', dataType: 'text', width: 80, visible: true, editable: false },
  { name: 'CATEGORY', headerText: 'CATEGORY', dataType: 'text', width: 60, visible: true, editable: false },
  { name: 'GRADE', headerText: 'GRADE', dataType: 'text', width: 60, visible: true, editable: false },
]

let gridDataColumns = [
  { name: 'CONSUME_LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: 80, visible: true, editable: false, groups: 'CONSUME', groupShowMode: 'expand' },
  { name: 'CONSUME_LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: 80, visible: true, editable: false, groups: 'CONSUME', groupShowMode: 'expand' },
  { name: 'CONSUME_LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: 80, visible: true, editable: false, groups: 'CONSUME', groupShowMode: 'always' },
  { name: 'CONSUME_LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: 110, visible: true, editable: false, groups: 'CONSUME', groupShowMode: 'always' },
  { name: 'ACCOUNT_CD', headerText: 'ACCOUNT_CD', dataType: 'text', width: 100, visible: true, editable: false, groups: 'CONSUME', groupShowMode: 'expand' },
  { name: 'ACCOUNT_NM', headerText: 'ACCOUNT_NM', dataType: 'text', width: 100, visible: true, editable: false, groups: 'CONSUME', groupShowMode: 'expand' },
  { name: 'CHANNEL_TP', headerText: 'CHANNEL_TP', dataType: 'text', width: 100, visible: true, editable: false, groups: 'CONSUME', groupShowMode: 'expand' },
  { name: 'INCOTERMS', headerText: 'INCOTERMS', dataType: 'text', width: 100, visible: true, editable: false, groups: 'CONSUME', groupShowMode: 'expand' },
  { name: 'SUPPLY_LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: 80, visible: true, editable: false, groups: 'SUPPLY', groupShowMode: 'expand' },
  { name: 'SUPPLY_LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: 80, visible: true, editable: false, groups: 'SUPPLY', groupShowMode: 'expand' },
  { name: 'SUPPLY_LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: 80, visible: true, editable: false, groups: 'SUPPLY', groupShowMode: 'always' },
  { name: 'SUPPLY_LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: 110, visible: true, editable: false, groups: 'SUPPLY', groupShowMode: 'always' },
  { name: 'VEHICL_TP', headerText: 'VEHICL_VAL', dataType: 'text', width: 100, visible: true, editable: false, autoFilter: true },
  { name: 'BOD_LEADTIME_PERIOD', headerText: 'BOD_LEADTIME_PERIOD', dataType: 'text', width: 100, visible: false, editable: false },
  { name: 'RES_CD', headerText: 'RES_CD', dataType: 'text', width: 80, visible: true, editable: false, groups: 'RESOURCE' },
  { name: 'RES_DESCRIP', headerText: 'RES_DESCRIP', dataType: 'text', width: 80, visible: true, editable: false, groups: 'RESOURCE' },
  { name: 'DAT', headerText: 'DATE', dataType: 'datetime', width: 100, visible: true, editable: false, format: 'yyyy-MM-dd', autoFilter: true },
  { name: 'INIT_CAPA', headerText: 'INIT_CAPA', dataType: 'text', width: 100, visible: true, editable: false },
  { name: 'AVAIL_CAPA', headerText: 'AVAIL_CAPA', dataType: 'text', width: 100, visible: true, editable: false },
  { name: 'OVER_LOAD_CAPA', headerText: 'OVER_LOAD_CAPA', dataType: 'text', width: 100, visible: true, editable: false },
  { name: 'PROD_QTY', headerText: 'PROD_QTY', dataType: 'text', width: 100, visible: true, editable: false },
  { name: 'AVAIL_QTY', headerText: 'AVAIL_QTY', dataType: 'text', width: 100, visible: true, editable: false }
]

function ResStatus() {
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const [gridLoad, setGridLoad] = useState(null);
  const [gridOperation, setGridOperation] = useState(null);
  const [gridData, setGridData] = useState(null);
  const [tabValue, setTabValue] = useState('load');

  const [simulationVersionPopupOpen, setSimulationVersionPopupOpen] = useState(false);
  const [resourcePopupOpen, setResourcePopupOpen] = useState(false);

  const consumeLocationSearchBoxRef = useRef();
  const [currentConsumeLocationRef, setCurrentConsumeLocationRef] = useState(null);

  const supplyLocationSearchBoxRef = useRef();
  const [currentSupplyLocationRef, setCurrentSupplyLocationRef] = useState(null);

  const [resStatusData, setResStatusData] = useState({
    labels: [],
    datasets: []
  })

  const { reset, getValues, setValue, control, watch } = useForm({
    defaultValues: {
      simulationVersion: '',
      searchCondition: 'P',
      resourceCode: '',
      resourceDescription: '',
      transportByItem: false
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
  }, [viewData]);

  useEffect(() => {
    setViewInfo(vom.active, 'globalButtons', [
      { name: 'search', action: (e) => { loadData(tabValue); }, visible: true, disable: false },
      { name: 'refresh', action: (e) => { refresh(tabValue); }, visible: true, disable: false }
    ]);

    if (gridLoad && gridOperation && gridData) {
      async function initLoad() {
        await loadRecentSimulationVersion();
        await loadTransportationModelingOption();
        loadLoadGridData();
      }

      initLoad();
    }
  }, [gridLoad, gridOperation, gridData]);

  useEffect(() => {
    if (currentSupplyLocationRef && getValues('searchCondition') === 'P') {
      currentSupplyLocationRef.reset();
    }
  }, [watch('searchCondition')]);

  function loadRecentSimulationVersion() {
    let formData = new FormData();

    formData.append('MODULE_CD', 'MP');
    formData.append('MAIN_VER_ID', '');
    formData.append('SIMUL_VER_ID', '');
    formData.append('SIMUL_VER_DESCRIP', '');

    return zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_COMM_SRH_VER_Q',
      data: formData
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        setValue('simulationVersion', res.data.RESULT_DATA[0].SIMUL_VER);
        setResStatusChartLegend();
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function loadTransportationModelingOption() {
    return zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_42_Q3'
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        if (res.data.RESULT_DATA.length > 0) {
          if (res.data.RESULT_DATA[0].ACTV_YN === 'Y') {
            setValue('transportByItem', true);
          }
        }
      }
    })
    .catch(function (err) {
      console.error(err);
    });
  }

  function refresh(tab) {
    reset({
      simulationVersion: getValues('simulationVersion'),
      transportByItem: getValues('transportByItem')
    });
    currentConsumeLocationRef.reset();
    currentSupplyLocationRef.reset();

    if (tab === 'load') {
      gridLoad.dataProvider.clearRows();
    } else if (tab === 'operation') {
      gridOperation.dataProvider.clearRows();
    } else if (tab === 'data') {
      gridData.dataProvider.clearRows();
    }
    setResStatusChartLegend();
  }

  function afterGridLoad(gridObj) {
    setGridLoad(gridObj);
    setGridLoadOptions(gridObj);
  }

  function afterGridOperation(gridObj) {
    setGridOperation(gridObj);
    setGridOperationOptions(gridObj);
  }

  function afterGridData(gridObj) {
    setGridData(gridObj);
    setGridDataOptions(gridObj);
  }

  function setGridLoadOptions(gridObj) {
    gridObj.gridView.setEditOptions({
      insertable: true,
      appendable: true
    });

    gridObj.gridView.setFixedOptions({ colCount: 3, resizable: true });
    gridObj.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridObj, true, false, false);

    gridObj.gridView.onCellClicked = function (grid, clickData, column) {
      if (clickData.cellType && clickData.cellType === 'data') {
        let data = gridObj.dataProvider.getOutputRow(null, clickData.dataRow);
        loadResStatusChart(gridObj, data);
      }
    }

    wingui.util.grid.sorter.orderBy(gridObj.gridView, ['CONSUME_LOCAT_TP_NM', 'CONSUME_LOCAT_LV', 'CONSUME_LOCAT_CD', 'CONSUME_LOCAT_NM', 'SUPPLY_LOCAT_TP_NM', 'SUPPLY_LOCAT_LV', 'SUPPLY_LOCAT_CD', 'SUPPLY_LOCAT_NM', 'RES_CD', 'RES_DESCRIP']);

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
    gridObj.gridView.setColumnProperty('RES_CD', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('RES_DESCRIP', 'mergeRule', { criteria: 'prevvalues + value' });

    gridObj.gridView.columnByName('ITEM_CD').visible = false;
    gridObj.gridView.columnByName('ITEM_NM').visible = false;

    if (getValues('searchCondition') === 'P') {
      gridObj.gridView.columnByName('SUPPLY_LOCAT_CD').visible = false;
      gridObj.gridView.columnByName('SUPPLY_LOCAT_NM').visible = false;
      gridObj.gridView.columnByName('VEHICL_TP').visible = false;
      gridObj.gridView.columnByName('RES_CD').visible = true;
      gridObj.gridView.columnByName('RES_DESCRIP').visible = true;
      gridObj.gridView.setFixedOptions({ colCount: 3 });
    } else {
      gridObj.gridView.columnByName('SUPPLY_LOCAT_CD').visible = true;
      gridObj.gridView.columnByName('SUPPLY_LOCAT_NM').visible = true;
      gridObj.gridView.columnByName('VEHICL_TP').visible = true;
      gridObj.gridView.columnByName('RES_CD').visible = false;
      gridObj.gridView.columnByName('RES_DESCRIP').visible = false;

      if (getValues('transportByItem')) {
        gridObj.gridView.columnByName('ITEM_CD').visible = true;
        gridObj.gridView.columnByName('ITEM_NM').visible = true;
        gridObj.gridView.setFixedOptions({ colCount: 5 });
      } else {
        gridObj.gridView.setFixedOptions({ colCount: 4 });
      }
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

    wingui.util.grid.sorter.orderBy(gridObj.gridView, ['CONSUME_LOCAT_TP_NM', 'CONSUME_LOCAT_LV', 'CONSUME_LOCAT_CD', 'CONSUME_LOCAT_NM', 'SUPPLY_LOCAT_TP_NM', 'SUPPLY_LOCAT_LV', 'SUPPLY_LOCAT_CD', 'SUPPLY_LOCAT_NM', 'VEHICL_TP', 'RES_CD', 'RES_DESCRIP', 'ITEM_CD', 'ITEM_NM']);

    gridObj.gridView.setColumnProperty('CONSUME_LOCAT_TP_NM', 'mergeRule', { criteria: 'value' });
    gridObj.gridView.setColumnProperty('CONSUME_LOCAT_LV', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('CONSUME_LOCAT_CD', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('CONSUME_LOCAT_NM', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('ACCOUNT_CD', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('ACCOUNT_NM', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('CHANNEL_TP', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('INCOTERMS', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('SUPPLY_LOCAT_TP_NM', 'mergeRule', { criteria: 'value' });
    gridObj.gridView.setColumnProperty('SUPPLY_LOCAT_LV', 'mergeRule', { criteria: 'values[ "SUPPLY_LOCAT_TP_NM" ] + value' });
    gridObj.gridView.setColumnProperty('SUPPLY_LOCAT_CD', 'mergeRule', { criteria: 'values[ "SUPPLY_LOCAT_TP_NM" ] + values[ "SUPPLY_LOCAT_LV" ] + value' });
    gridObj.gridView.setColumnProperty('SUPPLY_LOCAT_NM', 'mergeRule', { criteria: 'values[ "SUPPLY_LOCAT_TP_NM" ] + values[ "SUPPLY_LOCAT_LV" ] + values[ "SUPPLY_LOCAT_CD" ] + value' });
    gridObj.gridView.setColumnProperty('VEHICL_TP', 'mergeRule', { criteria: 'value' });
    gridObj.gridView.setColumnProperty('RES_CD', 'mergeRule', { criteria: 'value' });
    gridObj.gridView.setColumnProperty('RES_DESCRIP', 'mergeRule', { criteria: 'values[ "RES_CD" ] + value' });
    gridObj.gridView.setColumnProperty('ITEM_CD', 'mergeRule', { criteria: 'value' });
    gridObj.gridView.setColumnProperty('ITEM_NM', 'mergeRule', { criteria: 'values[ "ITEM_CD" ] + value' });

    if (getValues('searchCondition') === 'P') {
      gridObj.gridView.columnByName('SUPPLY_LOCAT_CD').visible = false;
      gridObj.gridView.columnByName('SUPPLY_LOCAT_NM').visible = false;
      gridObj.gridView.columnByName('VEHICL_TP').visible = false;
      gridObj.gridView.columnByName('RES_CD').visible = true;
      gridObj.gridView.columnByName('RES_DESCRIP').visible = true;
      gridObj.gridView.setFixedOptions({ colCount: 3 });
    } else {
      gridObj.gridView.columnByName('SUPPLY_LOCAT_CD').visible = true;
      gridObj.gridView.columnByName('SUPPLY_LOCAT_NM').visible = true;
      gridObj.gridView.columnByName('VEHICL_TP').visible = true;
      gridObj.gridView.columnByName('RES_CD').visible = false;
      gridObj.gridView.columnByName('RES_DESCRIP').visible = false;
      gridObj.gridView.setFixedOptions({ colCount: 4 });
    }
  }

  function setGridDataOptions(gridObj) {
    gridObj.gridView.setEditOptions({
      insertable: true,
      appendable: true
    });

    gridObj.gridView.setFixedOptions({ colCount: 5, resizable: true });
    gridObj.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridObj, true, false, false);

    wingui.util.grid.sorter.orderBy(gridObj.gridView, ['CONSUME_LOCAT_TP_NM', 'CONSUME_LOCAT_LV', 'CONSUME_LOCAT_CD', 'CONSUME_LOCAT_NM', 'SUPPLY_LOCAT_TP_NM', 'SUPPLY_LOCAT_LV', 'SUPPLY_LOCAT_CD', 'SUPPLY_LOCAT_NM', 'VEHICL_TP', 'RES_CD', 'RES_DESCRIP']);

    gridObj.gridView.setColumnProperty('CONSUME_LOCAT_TP_NM', 'mergeRule', { criteria: 'value' });
    gridObj.gridView.setColumnProperty('CONSUME_LOCAT_LV', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('CONSUME_LOCAT_CD', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('CONSUME_LOCAT_NM', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('SUPPLY_LOCAT_TP_NM', 'mergeRule', { criteria: 'value' });
    gridObj.gridView.setColumnProperty('SUPPLY_LOCAT_LV', 'mergeRule', { criteria: 'values[ "SUPPLY_LOCAT_TP_NM" ] + value' });
    gridObj.gridView.setColumnProperty('SUPPLY_LOCAT_CD', 'mergeRule', { criteria: 'values[ "SUPPLY_LOCAT_TP_NM" ] + values[ "SUPPLY_LOCAT_LV" ] + value' });
    gridObj.gridView.setColumnProperty('SUPPLY_LOCAT_NM', 'mergeRule', { criteria: 'values[ "SUPPLY_LOCAT_TP_NM" ] + values[ "SUPPLY_LOCAT_LV" ] + values[ "SUPPLY_LOCAT_CD" ] + value' });
    gridObj.gridView.setColumnProperty('VEHICL_TP', 'mergeRule', { criteria: 'value' });
    gridObj.gridView.setColumnProperty('RES_CD', 'mergeRule', { criteria: 'value' });
    gridObj.gridView.setColumnProperty('RES_DESCRIP', 'mergeRule', { criteria: 'values[ "RES_CD" ] + value' });

    if (getValues('searchCondition') === 'P') {
      gridObj.gridView.columnByName('SUPPLY_LOCAT_CD').visible = false;
      gridObj.gridView.columnByName('SUPPLY_LOCAT_NM').visible = false;
      gridObj.gridView.columnByName('VEHICL_TP').visible = false;
      gridObj.gridView.columnByName('RES_CD').visible = true;
      gridObj.gridView.columnByName('RES_DESCRIP').visible = true;
      gridObj.gridView.setFixedOptions({ colCount: 3 });
    } else {
      gridObj.gridView.columnByName('SUPPLY_LOCAT_CD').visible = true;
      gridObj.gridView.columnByName('SUPPLY_LOCAT_NM').visible = true;
      gridObj.gridView.columnByName('VEHICL_TP').visible = true;
      gridObj.gridView.columnByName('RES_CD').visible = false;
      gridObj.gridView.columnByName('RES_DESCRIP').visible = false;
      gridObj.gridView.setFixedOptions({ colCount: 4 });
    }
  }

  function setResStatusChartLegend() {
    let resStatusDataSet = [
      { type: 'bar', label: transLangKey('LOAD_CAPA'), borderColor: 'white', borderWidth: 2, fill: false, backgroundColor: '#7BB7FAC8', order: 1, yAxisID: 'capacity', data: { } },
      { type: 'bar', label: transLangKey('AVAIL_CAPA'), borderColor: 'white', borderWidth: 2, fill: false, backgroundColor: '#75FD4596', order: 1, yAxisID: 'capacity', data: { } },
      { type: 'bar', label: transLangKey('OVER_LOAD_CAPA'), borderColor: 'white', borderWidth: 2, fill: false, backgroundColor: '#E9226DC8', order: 1, yAxisID: 'capacity', data: { } },
      { type: 'bar', label: transLangKey('OVR_CAPA_VAL'), borderColor: 'white', borderWidth: 2, fill: false, backgroundColor: '#FBC3E096', order: 1, yAxisID: 'capacity', data: { } }
    ];

    setResStatusData({
      labels: [],
      datasets: resStatusDataSet
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

  function openResourcePopup() {
    setResourcePopupOpen(true);
  }

  function closeResourcePopup() {
    setResourcePopupOpen(false);
  }

  function onSetResource(gridRow) {
    setValue('resourceCode', gridRow.RES_CD);
    setValue('resourceDescription', gridRow.RES_DESCRIP);
  }

  function loadResStatus() {
    loadLoadGridData();
    setResStatusChartLegend();
  }

  function loadData(tab) {
    if (tab === 'load') {
      loadResStatus();
    } else if (tab === 'operation') {
      loadOperationGridData();
    } else if (tab === 'data') {
      loadDataGridData();
    }
  }

  function loadLoadGridData() {
    let formData = new FormData();

    formData.append('VERSION_ID', getValues('simulationVersion'));
    formData.append('SCH_COND', getValues('searchCondition'));
    formData.append('CONSUME_LOCAT_CD', currentConsumeLocationRef.getLocationCode());
    formData.append('SUPPLY_LOCAT_CD', currentSupplyLocationRef.getLocationCode());
    formData.append('RES_CD', getValues('resourceCode'));
    formData.append('CROSSTAB', JSON.stringify(gridLoad.gridView.crossTabInfo));

    return zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/GetResourceStatus',
      data: formData
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridLoad.dataProvider.clearRows();
        gridLoad.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function loadOperationGridData() {
    let formData = new FormData();

    formData.append('VERSION_ID', getValues('simulationVersion'));
    formData.append('SCH_COND', getValues('searchCondition'));
    formData.append('CONSUME_LOCAT_CD', currentConsumeLocationRef.getLocationCode());
    formData.append('SUPPLY_LOCAT_CD', currentSupplyLocationRef.getLocationCode());
    formData.append('RES_CD', getValues('resourceCode'));

    return zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/GetResourceOperationInfo',
      data: formData
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

  function loadDataGridData() {
    let formData = new FormData();

    formData.append('VERSION_ID', getValues('simulationVersion'));
    formData.append('SCH_COND', getValues('searchCondition'));
    formData.append('CONSUME_LOCAT_CD', currentConsumeLocationRef.getLocationCode());
    formData.append('SUPPLY_LOCAT_CD', currentSupplyLocationRef.getLocationCode());
    formData.append('RES_CD', getValues('resourceCode'));

    return zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/GetResourceStatus',
      data: formData
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridData.dataProvider.clearRows();
        gridData.setData(res.data.RESULT_DATA);
        setGridDataOptions(gridData);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function loadResStatusChart(grid, data) {
    let resourceUtilizationColumns = ['LOAD_CAPA', 'AVAIL_CAPA', 'OVER_LOAD_CAPA', 'OVR_CAPA_VAL'];
    let resStatusDataSet = [
      { type: 'bar', label: transLangKey('LOAD_CAPA'), borderColor: 'white', borderWidth: 2, fill: false, backgroundColor: '#7BB7FAC8', order: 1, yAxisID: 'capacity', data: { } },
      { type: 'bar', label: transLangKey('AVAIL_CAPA'), borderColor: 'white', borderWidth: 2, fill: false, backgroundColor: '#75FD4596', order: 1, yAxisID: 'capacity', data: { } },
      { type: 'bar', label: transLangKey('OVER_LOAD_CAPA'), borderColor: 'white', borderWidth: 2, fill: false, backgroundColor: '#E9226DC8', order: 1, yAxisID: 'capacity', data: { } },
      { type: 'bar', label: transLangKey('OVR_CAPA_VAL'), borderColor: 'white', borderWidth: 2, fill: false, backgroundColor: '#FBC3E096', order: 1, yAxisID: 'capacity', data: { } }
    ];

    let dateColumn = [];
    grid.dataProvider.getFieldNames().filter(fieldName => fieldName.includes('DAT_')).forEach(fieldName => dateColumn.push(fieldName));

    let date = dateColumn.map(fieldName => fieldName.replace('DAT_', ''));
    let targetData = grid.dataProvider.getJsonRows().filter(row => row.SUPPLY_LOCAT_CD === data.SUPPLY_LOCAT_CD && row.CONSUME_LOCAT_CD === data.CONSUME_LOCAT_CD && row.RES_CD === data.RES_CD);

    for (let i = 0; i < resourceUtilizationColumns.length; i++) {
      let rows = targetData.filter(targetRow => targetRow.CATEGORY === resourceUtilizationColumns[i]);
      resStatusDataSet[i].data = {};

      rows.forEach(row => {
        for (let j = 0; j < dateColumn.length; j++) {
          resStatusDataSet[i].data[date[j]] = row[dateColumn[j]];
        }
      })
    }

    setResStatusData({
      labels: date,
      datasets: resStatusDataSet
    });
  }

  const tabChange = (event, newValue) => {
    setViewInfo(vom.active, 'globalButtons', [
      { name: 'search', action: (e) => { loadData(newValue); }, visible: true, disable: false },
      { name: 'refresh', action: (e) => { refresh(newValue); }, visible: true, disable: false }
    ]);

    setTabValue(newValue);

    loadData(newValue);
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
            <LocationSearchBox ref={supplyLocationSearchBoxRef} keyValue={"locationCode"} label={transLangKey("SUPPLY_LOCAT")} placeHolder={transLangKey("LOCAT_CD")} style={{width: 300, display: watch("searchCondition") === "T" ? "" : "none" }} />
            <InputField type="action" name="resourceCode" label={transLangKey("RES_CD")} title={transLangKey("SEARCH")} onClick={openResourcePopup} control={control} style={{ display: watch("searchCondition") === "T" ? "none" : "" }}>
              <Icon.Search />
            </InputField>
            <InputField name="resourceDescription" label={transLangKey("RES_DESCRIP")} control={control} style={{ display: watch("searchCondition") === "T" ? "none" : "" }} readonly={true} />
          </SearchRow>
        </SearchArea>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={tabChange} indicatorColor="primary">
            <Tab label={transLangKey("LOAD_GRID")} value="load" />
            <Tab label={transLangKey("OPER_GRID")} value="operation" />
            <Tab label={transLangKey("DATA")} value="data" />
          </Tabs>
        </Box>
        <Box sx={{ height: "100%", display : tabValue === "load" ? "block" : "none" }}>
          <ResultArea sizes={[70, 30]} direction={"vertical"}>
            <Box>
              <BaseGrid id="gridLoad" items={gridLoadColumns} viewCd="UI_MP_42" gridCd="UI_MP_42-RST_CPT_02" afterGridCreate={afterGridLoad} />
            </Box>
            <Box>
              <Box style={{ width: "100%", height: "100%" }}>
                <Bar data={resStatusData} options={resStatusChartOptions} />
              </Box>
            </Box>
          </ResultArea>
        </Box>
        <Box sx={{ height: "100%", display : tabValue === "operation" ? "block" : "none" }}>
          <ResultArea>
            <Box style={{ width: "100%", height: "100%" }}>
              <BaseGrid id="gridOperation" items={gridOperationColumns} viewCd="UI_MP_42" gridCd="UI_MP_42-RST_CPT_03" afterGridCreate={afterGridOperation} />
            </Box>
          </ResultArea>
        </Box>
        <Box sx={{ height: "100%", display : tabValue === "data" ? "block" : "none" }}>
          <ResultArea>
            <Box style={{ width: "100%", height: "100%" }}>
              <BaseGrid id="gridData" items={gridDataColumns} viewCd="UI_MP_42" gridCd="UI_MP_42-RST_CPT_04" afterGridCreate={afterGridData} />
            </Box>
          </ResultArea>
        </Box>
      </ContentInner>

      {simulationVersionPopupOpen && (<PopSimulationVersion open={simulationVersionPopupOpen} onClose={closeSimulationVersionPopup} confirm={onSetSimulationVersion} module={'MP'} />)}
      {resourcePopupOpen && (<PopCommResource open={resourcePopupOpen} onClose={closeResourcePopup} confirm={onSetResource} />)}
    </>
  )
}

export default ResStatus;
