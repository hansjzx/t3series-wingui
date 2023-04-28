import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Tab, Tabs } from '@mui/material';
import { useLocation } from "react-router-dom";
import GavelIcon from '@mui/icons-material/Gavel';
import { BaseGrid, ButtonArea, ContentInner, InputField, LeftButtonArea, CommonButton, SearchArea, SearchRow, TreeGrid, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import ItemSearchBox from '@wingui/view/supplychainmodel/common/ItemSearchBox';
import PopSimulationVersion from '@wingui/view/masterplan/common/PopSimulationVersion';
import PopConfirmPlan from '@wingui/view/masterplan/common/PopConfirmPlan';

let gridDemandOrderTrackingColumns = [
  {
    name: 'DEMAND_INFO', dataType: 'group', orientation: 'horizontal', headerText: 'DMND_INFO',
    childs: [
      { name: 'PLAN_SEQ', headerText: 'SEQ', dataType: 'number', width: '50', editable: false, groups: 'DMND_INFO' },
      { name: 'DMND_ID', headerText: 'DMND_ID', dataType: 'text', width: '180', editable: false, groups: 'DMND_INFO' },
      { name: 'PO_ID', headerText: 'PO_ID', dataType: 'text', width: '180', editable: false, groups: 'DMND_INFO' },
      { name: 'ACTV_YN', headerText: 'ACTV_YN', dataType: 'boolean', width: '50', editable: false, headerCheckable: false, groups: 'DMND_INFO' },
      { name: 'DMND_TP_NM', headerText: 'DMND_TP_NM', dataType: 'text', width: '100', editable: false, groups: 'DMND_INFO', autoFilter: true },
      { name: 'DMND_CLASS_NM', headerText: 'DMND_CLASS_NM', dataType: 'text', width: '100', editable: false, groups: 'DMND_INFO', autoFilter: true },
      { name: 'URGENT_ORDER_TP_NM', headerText: 'URGENT_ORDER_TP', dataType: 'text', width: '120', editable: false, groups: 'DMND_INFO' },
      {
        name: 'ITEM', dataType: 'group', orientation: 'horizontal', headerText: 'ITEM', expandable: true, expanded: false,
        childs: [
          { name: 'ITEM_CD', headerText: 'ITEM_CD', dataType: 'text', width: '80', editable: false, groups: 'DMND_INFO', groupShowMode: 'always' },
          { name: 'ITEM_NM', headerText: 'ITEM_NM', dataType: 'text', width: '80', editable: false, groups: 'DMND_INFO', groupShowMode: 'always' },
          { name: 'ITEM_DESCRIP', headerText: 'ITEM_DESCRIP', dataType: 'text', width: '80', editable: false, groups: 'DMND_INFO', groupShowMode: 'expand' },
          { name: 'ITEM_TP_NM', headerText: 'ITEM_TP_NM', dataType: 'text', width: '80', editable: false, groups: 'DMND_INFO', groupShowMode: 'expand' }
        ]
      },
      { name: 'DMND_QTY', headerText: 'DMND_QTY', dataType: 'number', width: '80', editable: false, groups: 'DMND_INFO' },
      { name: 'UOM_NM', headerText: 'UOM_NM', dataType: 'text', width: '80', editable: false, groups: 'DMND_INFO' },
      { name: 'DUE_DATE', headerText: 'DUE_DATE', dataType: 'datetime', width: '100', editable: false, format: 'yyyy-MM-dd', groups: 'DMND_INFO' },
    ]
  },
  {
    name: 'REQUEST_SITE_ACCOUNT', dataType: 'group', orientation: 'horizontal', headerText: 'REQUEST_SITE_CUST',
    childs: [
      { name: 'REQUEST_SITE_ID', headerText: 'REQUEST_SITE_ID', dataType: 'text', width: '100', editable: false, groups: 'REQUEST_SITE_CUST', autoFilter: true },
      { name: 'REQUEST_SITE_DESCRIP', headerText: 'REQUEST_SITE_DESCRIP', dataType: 'text', width: '120', editable: false, groups: 'REQUEST_SITE_CUST' },
      { name: 'ACCOUNT_CD', headerText: 'ACCOUNT_CD', dataType: 'text', width: '80', editable: false, groups: 'REQUEST_SITE_CUST' },
      { name: 'ACCOUNT_NM', headerText: 'ACCOUNT_NM', dataType: 'text', width: '120', editable: false, groups: 'REQUEST_SITE_CUST' },
      { name: 'CHANNEL_NM', headerText: 'CHANNEL_NM', dataType: 'text', width: '80', editable: false, groups: 'REQUEST_SITE_CUST' },
      { name: 'INCOTERMS', headerText: 'INCOTERMS', dataType: 'text', width: '80', editable: false, groups: 'REQUEST_SITE_CUST' },
      { name: 'SALES_PRIC', headerText: 'SALES_UNIT_PRIC', dataType: 'number', width: '80', editable: false, groups: 'REQUEST_SITE_CUST' },
      { name: 'MARGIN', headerText: 'MARGIN', dataType: 'text', width: '80', editable: false, groups: 'REQUEST_SITE_CUST' },
      { name: 'CURRENCY', headerText: 'CURCY_CD', dataType: 'text', width: '80', editable: false, groups: 'REQUEST_SITE_CUST' },
    ]
  },
  {
    name: 'PLAN_RESULT', dataType: 'group', orientation: 'horizontal', headerText: 'PLAN_RESULT',
    childs: [
      { name: 'DELIVY_DATE', headerText: 'DELIVY_DATE', dataType: 'datetime', width: '100', editable: false, format: 'yyyy-MM-dd', groups: 'PLAN_RESULT' },
      { name: 'DAYS_LATE', headerText: 'DAYS_LATE', dataType: 'number', width: '80', editable: false, groups: 'PLAN_RESULT' },
      { name: 'DELIVY_QTY', headerText: 'DELIVY_QTY', dataType: 'number', width: '80', editable: false, groups: 'PLAN_RESULT' },
      { name: 'ON_TIME_QTY', headerText: 'ON_TIME_QTY', dataType: 'number', width: '80', editable: false, groups: 'PLAN_RESULT' },
      { name: 'LATE_QTY', headerText: 'LATE_QTY', dataType: 'number', width: '80', editable: false, groups: 'PLAN_RESULT' },
      { name: 'SHORTAGE_QTY', headerText: 'SHORTAGE_QTY', dataType: 'number', width: '80', editable: false, groups: 'PLAN_RESULT' },
      { name: 'NETTING_QTY', headerText: 'NETTING_QTY', dataType: 'number', width: '100', editable: false, groups: 'PLAN_RESULT' },
      { name: 'PROBLEM_DESCRIP', headerText: 'PROBLEM_DESCRIP', dataType: 'text', width: '450', editable: false }
    ]
  }
]

let gridSiteResourceAssignColumns = [
  { name: 'LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: '100', editable: false, initGroupOrder: '1' },
  { name: 'LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: '100', editable: false, initGroupOrder: '2' },
  { name: 'LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: '100', editable: false, initGroupOrder: '3' },
  { name: 'LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: '100', editable: false, initGroupOrder: '4' },
  { name: 'RES_CD', headerText: 'RES_CD', dataType: 'text', width: '100', editable: false, initGroupOrder: '5' },
  { name: 'RES_DESCRIP', headerText: 'RES_DESCRIP', dataType: 'text', width: '100', editable: false, initGroupOrder: '6' },
  { name: 'ASSIGN_YN', headerText: 'ASSIGN_YN', dataType: 'boolean', width: '80', editable: false, initGroupOrder: '7' }
]

let gridDemandOrderTrackingDetailColumns = [
  { name: 'ACTIVITY_ID', headerText: 'ACTIVITY_ID', dataType: 'text', width: '400', visible: true, editable: false },
  { name: 'LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: '80', visible: true, editable: false },
  { name: 'LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: '80', visible: true, editable: false },
  { name: 'LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: '80', visible: true, editable: false },
  { name: 'LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: '220', visible: true, editable: false },
  { name: 'RES_CD', headerText: 'RES_CD', dataType: 'text', width: '80', visible: true, editable: false },
  { name: 'RES_DESCRIP', headerText: 'RES_DESCRIP', dataType: 'text', width: '120', visible: true, editable: false },
  { name: 'ACTIVITY_TP', headerText: 'ACTIVITY_TP', dataType: 'text', width: '80', visible: true, editable: false },
  { name: 'ITEM_CD', headerText: 'ITEM_CD', dataType: 'text', width: '80', visible: true, editable: false },
  { name: 'ITEM_NM', headerText: 'ITEM_NM', dataType: 'text', width: '80', visible: true, editable: false },
  { name: 'ITEM_DESCRIP', headerText: 'DESCRIP', dataType: 'text', width: '80', visible: true, editable: false },
  { name: 'ITEM_TP_NM', headerText: 'ITEM_TP_NM', dataType: 'text', width: '80', visible: true, editable: false },
  { name: 'DELIVY_DATE', headerText: 'DELIVY_DATE', dataType: 'datetime', width: '100', visible: true, editable: false, format: 'yyyy-MM-dd' },
  { name: 'DELIVY_QTY', headerText: 'DELIVY_QTY', dataType: 'number', width: '80', visible: true, editable: false },
  { name: 'PRODUCT_START', headerText: 'PRODUCTION_START', dataType: 'datetime', width: '100', visible: true, editable: false, format: 'yyyy-MM-dd' },
  { name: 'INWH_DATE', headerText: 'INWH_DATE', dataType: 'datetime', width: '100', visible: true, editable: false, format: 'yyyy-MM-dd' },
  { name: 'INWH_QTY', headerText: 'INWH_QTY', dataType: 'number', width: '80', visible: true, editable: false },
  { name: 'WAIT_TIME', headerText: 'WAIT_TIME', dataType: 'number', width: '100', visible: true, editable: false },
  { name: 'RELEASE_DATE', headerText: 'RELEASE_DATE', dataType: 'datetime', width: '100', visible: true, editable: false, format: 'yyyy-MM-dd' },
  { name: 'RELEASE_QTY', headerText: 'RELEASE_QTY', dataType: 'number', width: '80', visible: true, editable: false },
  { name: 'STOCK', headerText: 'STOCK', dataType: 'number', width: '80', visible: true, editable: false },
  { name: 'VEHICL_TP', headerText: 'VEHICL_VAL', dataType: 'text', width: '100', visible: true, editable: false },
  { name: 'BOD_LEADTIME_PERIOD', headerText: 'BOD_LEADTIME_PERIOD', dataType: 'text', width: '100', visible: true, editable: false },
  { name: 'BOD_LEADTIME', headerText: 'BOD_LEADTIME', dataType: 'number', width: '100', visible: true, editable: false },
  { name: 'NOTE', headerText: 'NOTE', dataType: 'text', width: '180', visible: true, editable: false }
]

let gridPlanProblemColumns = [
  { name: 'PO_ID', headerText: 'PO_ID', dataType: 'text', width: '150', editable: false },
  { name: 'PROBLEM_TP', headerText: 'PROBLEM_TP', dataType: 'text', width: '80', editable: false },
  { name: 'PROBLEM_NM', headerText: 'PROBLEM_NM', dataType: 'text', width: '80', editable: false },
  { name: 'PROBLEM_VAL', headerText: 'PROBLEM_VAL', dataType: 'text', width: '80', editable: false },
  { name: 'PROBLEM_DATE', headerText: 'PROBLEM_DATE', dataType: 'datetime', width: '80', editable: false, format: 'yyyy-MM-dd' },
  { name: 'LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: '80', editable: false },
  { name: 'ITEM_CD', headerText: 'ITEM_CD', dataType: 'text', width: '80', editable: false },
  { name: 'RES_CD', headerText: 'RES_CD', dataType: 'text', width: '80', editable: false },
  { name: 'ACCOUNT_CD', headerText: 'ACCOUNT_CD', dataType: 'text', width: '100', editable: false },
  { name: 'DESCRIP', headerText: 'DESCRIP', dataType: 'text', width: '350', editable: false }
]

let gridStockConsumptionColumns = [
  { name: 'STOCK_TP', headerText: 'STOCK_TP', dataType: 'text', width: '100', editable: false, initGroupOrder: '1' },
  { name: 'STOCK_CD', headerText: 'STOCK_CD', dataType: 'text', width: '100', editable: false, initGroupOrder: '2' },
  {
    name: 'LOCATION', dataType: 'group', orientation: 'horizontal', headerText: 'LOCAT', expandable: true, expanded: false,
    childs: [
      { name: 'LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: '100', editable: false, initGroupOrder: '3', groupShowMode: 'expand' },
      { name: 'LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: '100', editable: false, initGroupOrder: '4', groupShowMode: 'expand' },
      { name: 'LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: '100', editable: false, initGroupOrder: '5', groupShowMode: 'always' },
      { name: 'LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: '100', editable: false, initGroupOrder: '6', groupShowMode: 'always' }
    ]
  },
  { name: 'STOCK_LOCAT_NM', headerText: 'STOCK_LOCAT_NM', dataType: 'text', width: '100', editable: false, initGroupOrder: '7' },
  { name: 'STOCK_LOCAT_DESCRIP', headerText: 'STOCK_LOCAT_DESCRIP', dataType: 'text', width: '100', editable: false, initGroupOrder: '8' },
  {
    name: 'ITEM', dataType: 'group', orientation: 'horizontal', headerText: 'ITEM', expandable: true, expanded: false,
    childs: [
      { name: 'ITEM_CD', headerText: 'ITEM_CD', dataType: 'text', width: '100', editable: false, initGroupOrder: '9', groupShowMode: 'always' },
      { name: 'ITEM_NM', headerText: 'ITEM_NM', dataType: 'text', width: '100', editable: false, initGroupOrder: '10', groupShowMode: 'always' },
      { name: 'ITEM_DESCRIP', headerText: 'DESCRIP', dataType: 'text', width: '100', editable: false, initGroupOrder: '11', groupShowMode: 'expand' },
      { name: 'ITEM_TP_NM', headerText: 'ITEM_TP_NM', dataType: 'text', width: '100', editable: false, initGroupOrder: '12', groupShowMode: 'expand' }
    ]
  },
  { name: 'CONSUME_DTTM', headerText: 'CONSUME_DTTM', dataType: 'datetime', width: '100', editable: false, format: 'yyyy-MM-dd' },
  { name: 'CONSUME_QTY', headerText: 'CONSUME_QTY', dataType: 'number', width: '100', editable: false }
]

let gridFixedPlanConsumptionColumns = [
  { name: 'FIXED_PLAN_TP', headerText: 'FIXED_PLAN_TP', dataType: 'text', width: '100', editable: false, initGroupOrder: '1' },
  { name: 'FIXED_PLAN_ID', headerText: 'FIXED_PLAN_ID', dataType: 'text', width: '100', editable: false, initGroupOrder: '2' },
  {
    name: 'LOCATION', dataType: 'group', orientation: 'horizontal', headerText: 'LOCAT', expandable: true, expanded: false,
    childs: [
      { name: 'LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: '100', editable: false, initGroupOrder: '3', groupShowMode: 'expand' },
      { name: 'LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: '100', editable: false, initGroupOrder: '4', groupShowMode: 'expand' },
      { name: 'LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: '100', editable: false, initGroupOrder: '5', groupShowMode: 'always' },
      { name: 'LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: '100', editable: false, initGroupOrder: '6', groupShowMode: 'always' }
    ]
  },
  { name: 'RES_CD', headerText: 'RES_CD', dataType: 'text', width: '100', editable: false, initGroupOrder: '7' },
  { name: 'RES_DESCRIP', headerText: 'RES_DESCRIP', dataType: 'text', width: '100', editable: false, initGroupOrder: '8' },
  {
    name: 'ITEM', dataType: 'group', orientation: 'horizontal', headerText: 'ITEM', expandable: true, expanded: false,
    childs: [
      { name: 'ITEM_CD', headerText: 'ITEM_CD', dataType: 'text', width: '100', editable: false, initGroupOrder: '9', groupShowMode: 'always' },
      { name: 'ITEM_NM', headerText: 'ITEM_NM', dataType: 'text', width: '100', editable: false, initGroupOrder: '10', groupShowMode: 'always' },
      { name: 'ITEM_DESCRIP', headerText: 'DESCRIP', dataType: 'text', width: '100', editable: false, initGroupOrder: '11', groupShowMode: 'expand' },
      { name: 'ITEM_TP_NM', headerText: 'ITEM_TP_NM', dataType: 'text', width: '100', editable: false, initGroupOrder: '12', groupShowMode: 'expand' }
    ]
  },
  { name: 'CONSUME_DATE', headerText: 'CONSUME_DTTM', dataType: 'datetime', width: '100', editable: false, format: 'yyyy-MM-dd' },
  { name: 'CONSUME_QTY', headerText: 'CONSUME_QTY', dataType: 'number', width: '100', editable: false }
]

function DemandOrderTracking(props) {
  const location = useLocation();
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const [gridDemandOrderTracking, setGridDemandOrderTracking] = useState(null);
  const [gridDemandOrderTrackingDetail, setGridDemandOrderTrackingDetail] = useState(null);
  const [gridSiteResourceAssign, setGridSiteResourceAssign] = useState(null);
  const [gridPlanProblem, setGridPlanProblem] = useState(null);
  const [gridStockConsumption, setGridStockConsumption] = useState(null);
  const [gridFixedPlanConsumption, setGridFixedPlanConsumption] = useState(null);

  const [simulationVersionPopupOpen, setSimulationVersionPopupOpen] = useState(false);
  const [confirmPlanPopupOpen, setConfirmPlanPopupOpen] = useState(false);

  const itemSearchBoxRef = useRef();
  const [currentItemRef, setCurrentItemRef] = useState(null);

  const [tabValue, setTabValue] = useState('demandOrderTrackingDetail');

  const module = props.module ? props.module : 'MP';

  const { reset, getValues, setValue, control } = useForm({
    defaultValues: {
      simulationVersion: '',
      demandId: '',
      foundOrder: ''
    }
  });

  useEffect(() => {
    if (itemSearchBoxRef) {
      if (itemSearchBoxRef.current) {
        setCurrentItemRef(itemSearchBoxRef.current);
      }
    }

    const gridDemandOrderTrackingDetailObj = getViewInfo(vom.active, 'gridDemandOrderTrackingDetail');
    if (gridDemandOrderTrackingDetailObj) {
      if (gridDemandOrderTrackingDetailObj.dataProvider) {
        setGridDemandOrderTrackingDetail(gridDemandOrderTrackingDetailObj);
      }
    }
  }, [viewData]);

  useEffect(() => {
    if (location.state !== undefined && location.state !== null) {
      if (location.state.params !== undefined) {
        if (gridDemandOrderTracking && currentItemRef) {
          setValue('simulationVersion', location.state.params['VERSION_ID']);
          setValue('demandId', location.state.params['DMND_ID']);
          loadDemandOrderTracking();
        }
      }
    }
  }, [location]);

  useEffect(() => {
    setViewInfo(vom.active, 'globalButtons', [
      { name: 'search', action: (e) => { loadDemandOrderTracking(); }, visible: true, disable: false },
      { name: 'refresh', action: (e) => { refresh(); }, visible: true, disable: false }
    ]);

    if (gridDemandOrderTracking) {
      async function initLoad() {
        setGridDemandOrderTrackingOptions(gridDemandOrderTracking);
        await loadRecentSimulationVersion();
        loadDemandOrderTracking();
      }

      initLoad();
    }

  }, [gridDemandOrderTracking]);

  useEffect(() => {
    if (gridDemandOrderTrackingDetail) {
      setGridDemandOrderTrackingDetailOptions();
    }
  }, [gridDemandOrderTrackingDetail]);

  function loadRecentSimulationVersion() {
    let param = new URLSearchParams();

    param.append('MODULE_CD', module);
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
      }
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function() {
      if (location.state !== undefined && location.state !== null) {
        if (location.state.params !== undefined) {
          setValue('simulationVersion', location.state.params['VERSION_ID']);
          setValue('demandId', location.state.params['DMND_ID']);
          loadDemandOrderTracking();
        }
      }
    });
  }

  function afterGridDemandOrderTracking(gridObj) {
    setGridDemandOrderTracking(gridObj);
  }

  function afterGridSiteResourceAssign(gridObj) {
    setGridSiteResourceAssign(gridObj);
  }

  function afterGridDemandOrderTrackingDetail(gridObj) {
    setGridDemandOrderTrackingDetail(gridObj);
  }

  function afterGridPlanProblem(gridObj) {
    setGridPlanProblem(gridObj);
  }

  function afterGridStockConsumption(gridObj) {
    setGridStockConsumption(gridObj);
  }

  function afterGridFixedPlanConsumption(gridObj) {
    setGridFixedPlanConsumption(gridObj);
  }

  function setGridDemandOrderTrackingOptions(gridObj) {
    gridObj.gridView.setEditOptions({
      insertable: false,
      appendable: false
    });

    gridObj.gridView.displayOptions.fitStyle = 'even';
    setVisibleProps(gridObj, false, false, false);

    gridObj.gridView.onCellClicked = function (grid, clickData, column) {
      if (clickData.cellType && clickData.cellType === 'data') {
        let data = gridObj.dataProvider.getOutputRow(null, clickData.dataRow);

        if (data.PO_ID !== getValues('foundOrder')) {
          setValue('foundOrder', data.PO_ID);
          loadDemandOrderTrackingDetail(data);
          loadSiteResourceAssign(data);
          loadPlanProblem(data);
          loadStockConsumption(data);
          loadFixedPlanConsumption(data);
        }
      }
    }
  }

  function setGridDemandOrderTrackingDetailOptions() {
    gridDemandOrderTrackingDetail.gridView.setEditOptions({
      insertable: true,
      appendable: true,
    });

    gridDemandOrderTrackingDetail.gridView.displayOptions.fitStyle = 'even';
    setVisibleProps(gridDemandOrderTrackingDetail, true, false, false);
    gridDemandOrderTrackingDetail.gridView.setFooters([{ visible: false }]);
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

  function loadDemandOrderTracking() {
    let param = new URLSearchParams();

    param.append('VERSION_ID', getValues('simulationVersion'));
    param.append('ITEM_CD', currentItemRef.getItemCode());
    param.append('ITEM_NM', currentItemRef.getItemName());
    param.append('ITEM_TP', currentItemRef.getItemType());
    param.append('DMND_ID', getValues('demandId'));

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/GetDemandInfo',
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridDemandOrderTracking.dataProvider.clearRows();
        gridSiteResourceAssign.dataProvider.clearRows();
        gridDemandOrderTrackingDetail.dataProvider.clearRows();
        gridPlanProblem.dataProvider.clearRows();
        gridStockConsumption.dataProvider.clearRows();
        gridFixedPlanConsumption.dataProvider.clearRows();
        gridDemandOrderTracking.setData(res.data.RESULT_DATA);
        setValue('foundOrder', '');
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function refresh() {
    reset({
      simulationVersion: getValues('simulationVersion'),
    });
    currentItemRef.reset();
    gridDemandOrderTracking.dataProvider.clearRows();
    gridSiteResourceAssign.dataProvider.clearRows();
    gridDemandOrderTrackingDetail.dataProvider.clearRows();
    gridPlanProblem.dataProvider.clearRows();
    gridStockConsumption.dataProvider.clearRows();
    gridFixedPlanConsumption.dataProvider.clearRows();
  }

  function loadSiteResourceAssign(data) {
    let formData = new FormData();

    formData.append('VERSION_ID', getValues('simulationVersion'));
    formData.append('DMND_ID', data.DMND_ID);

    if (data.PO_ID !== null) {
      formData.append('PO_ID', data.PO_ID);
    }

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/GetDemandAssign',
      data: formData
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridSiteResourceAssign.dataProvider.clearRows();
        gridSiteResourceAssign.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function loadDemandOrderTrackingDetail(data) {
    let formData = new FormData();

    formData.append('TREE_PARENT_ID', 'PARENT_ACTIVITY_ID');
    formData.append('TREE_KEY_ID', 'ACTIVITY_ID');
    formData.append('VERSION_ID', getValues('simulationVersion'));
    formData.append('DMND_ID', data.DMND_ID);

    if (data.PO_ID !== null) {
      formData.append('PO_ID', data.PO_ID);
    }

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/GetDemandTracking',
      data: formData
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        let resData = { items: res.data.RESULT_DATA };
        gridDemandOrderTrackingDetail.dataProvider.clearRows();
        gridDemandOrderTrackingDetail.dataProvider.setObjectRows(resData, 'items', '', '');
        gridDemandOrderTrackingDetail.gridView.expandAll();
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function loadPlanProblem(data) {
    let formData = new FormData();

    formData.append('VERSION_ID', getValues('simulationVersion'));
    formData.append('DMND_ID', data.DMND_ID);

    if (data.PO_ID !== null) {
      formData.append('PO_ID', data.PO_ID);
    }

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/GetDemandProblem',
      data: formData
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridPlanProblem.dataProvider.clearRows();
        gridPlanProblem.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function loadStockConsumption(data) {
    let formData = new FormData();

    formData.append('VERSION_ID', getValues('simulationVersion'));
    formData.append('DMND_ID', data.DMND_ID);

    if (data.PO_ID !== null) {
      formData.append('PO_ID', data.PO_ID);
    }

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/GetStockConsumption',
      data: formData
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridStockConsumption.dataProvider.clearRows();
        gridStockConsumption.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function loadFixedPlanConsumption(data) {
    let formData = new FormData();

    formData.append('VERSION_ID', getValues('simulationVersion'));
    formData.append('DMND_ID', data.DMND_ID);

    if (data.PO_ID !== null) {
      formData.append('PO_ID', data.PO_ID);
    }

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/GetFixedPlanConsumption',
      data: formData
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridFixedPlanConsumption.dataProvider.clearRows();
        gridFixedPlanConsumption.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  const tabChange = (event, newValue) => {
    setTabValue(newValue);
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <InputField type="action" name="simulationVersion" label={transLangKey("SIMUL_VER_SHORTN")} title={transLangKey("SEARCH")} onClick={openSimulationVersionPopup} control={control} style={{ width: "210px" }}>
              <Icon.Search />
            </InputField>
            <InputField name="demandId" label={transLangKey("DMND_ID")} control={control} />
            <ItemSearchBox ref={itemSearchBoxRef} keyValue={'itemName'} placeHolder={transLangKey("ITEM_NM")}/>
          </SearchRow>
        </SearchArea>
        <ButtonArea>
          <LeftButtonArea>
            <CommonButton title={transLangKey('PLAN_CONFIRM')} onClick={() => { openConfirmPlanPopup() }}>
              <GavelIcon />
            </CommonButton>
          </LeftButtonArea>
        </ButtonArea>
        <Box style={{ marginTop: "5px", height: "50%" }}>
          <Box style={{ height: "100%" }}>
            <BaseGrid id="gridDemandOrderTracking" items={gridDemandOrderTrackingColumns} afterGridCreate={afterGridDemandOrderTracking} />
          </Box>
        </Box>
        <Box style={{ height: "50%" }}>
          <Tabs onChange={tabChange} indicatorColor="primary" value={tabValue}>
            <Tab label={transLangKey("SITE_N_RES_ASSIGN")} value="siteResourceAssign" />
            <Tab label={transLangKey("DMND_ORDER_TRACK")} value="demandOrderTrackingDetail" />
            <Tab label={transLangKey("PLAN_PROBLEM")} value="planProblem" />
            <Tab label={transLangKey("STOCK_CONSPT")} value="stockConsumption" />
            <Tab label={transLangKey("FIX_PLAN_CONSPT")} value="fixedPlanConsumption" />
          </Tabs>
          <Box style={{ marginTop: "3px", width: "100%", height: "100%" }}>
            <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "siteResourceAssign" ? "block" : "none" }}>
              <BaseGrid id="gridSiteResourceAssign" items={gridSiteResourceAssignColumns} afterGridCreate={afterGridSiteResourceAssign} />
            </Box>
            <Box sx={{ display: "flex", height: "calc(100% - 50px)", width: "100%", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "demandOrderTrackingDetail" ? "block" : "none" }}>
              <TreeGrid id="gridDemandOrderTrackingDetail" items={gridDemandOrderTrackingDetailColumns} />
            </Box>
            <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "planProblem" ? "block" : "none" }}>
              <BaseGrid id="gridPlanProblem" items={gridPlanProblemColumns} afterGridCreate={afterGridPlanProblem} />
            </Box>
            <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "stockConsumption" ? "block" : "none" }}>
              <BaseGrid id="gridStockConsumption" items={gridStockConsumptionColumns} afterGridCreate={afterGridStockConsumption} />
            </Box>
            <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "fixedPlanConsumption" ? "block" : "none" }}>
              <BaseGrid id="gridFixedPlanConsumption" items={gridFixedPlanConsumptionColumns} afterGridCreate={afterGridFixedPlanConsumption} />
            </Box>
          </Box>
        </Box>
      </ContentInner>

      {simulationVersionPopupOpen && (<PopSimulationVersion open={simulationVersionPopupOpen} onClose={closeSimulationVersionPopup} confirm={setSimulationVersion} module={module} />)}
      {confirmPlanPopupOpen && (<PopConfirmPlan open={confirmPlanPopupOpen} onClose={closeConfirmPlanPopup} confirm={loadDemandOrderTracking} param={getValues('simulationVersion')} />)}
    </>
  )
}

export default DemandOrderTracking;
