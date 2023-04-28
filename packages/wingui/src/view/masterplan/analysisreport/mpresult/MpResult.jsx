import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Tab, Tabs } from '@mui/material';
import { Gavel, AddBox, Contrast }from '@mui/icons-material';
import { BaseGrid,ContentInner, SearchArea, SearchRow, ButtonArea, LeftButtonArea, CommonButton, GridExcelExportButton, InputField, ResultArea, useViewStore, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import LocationSearchBox from '@wingui/view/supplychainmodel/common/LocationSearchBox';
import ItemSearchBox from '@wingui/view/supplychainmodel/common/ItemSearchBox';

import PopPersonalize from '@wingui/view/common/PopPersonalize';
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

let gridMpResultBaseColumns = [
  { name: 'LOCAT_TP_NM', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: '100' },
  { name: 'LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: false, editable: false, width: '100' },
  { name: 'LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: false, editable: false, width: '100' },
  { name: 'LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: '100' },
  { name: 'CATEGORY', dataType: 'text', headerText: 'CATEGORY', visible: true, editable: false, width: '100', lang: true },
  { name: 'DAT', dataType: 'number', headerText: 'DAT', visible: true, editable: false, width: '100', iteration : { "prefix": "DAT_", "prefixRemove": "true", "delimiter": "," } }
];

let gridMpResultDetailColumns = [
  { name: 'LOCAT_TP_NM', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: '100', groups: 'LOCAT', groupShowMode: 'expand' },
  { name: 'LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: '80', groups: 'LOCAT', groupShowMode: 'expand' },
  { name: 'LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: '100', groups: 'LOCAT', groupShowMode: 'always' },
  { name: 'LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: '140', groups: 'LOCAT', groupShowMode: 'always' },
  { name: 'LOCAT_GRP_CD', dataType: 'text', headerText: 'LOCAT_GRP', visible: true, editable: false, width: '100', groups: 'LOCAT', groupShowMode: 'expand' },
  { name: 'BUSINESS_UNIT', dataType: 'text', headerText: 'BUSINESS_UNIT', visible: true, editable: false, width: '100', groups: 'LOCAT', groupShowMode: 'expand' },
  { name: 'IN_OUT_FLAG', dataType: 'text', headerText: 'IN_OUT_FLAG', visible: true, editable: false, width: '100', groups: 'LOCAT', groupShowMode: 'expand' },
  { name: 'ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', visible: true, editable: false, width: '100', groups: 'ITEM', groupShowMode: 'always' },
  { name: 'ITEM_NM', dataType: 'text', headerText: 'ITEM_NM', visible: true, editable: false, width: '140', groups: 'ITEM', groupShowMode: 'always' },
  { name: 'ITEM_DESCRIP', dataType: 'text', headerText: 'ITEM_DESCRIP', visible: true, editable: false, width: '100', groups: 'ITEM', groupShowMode: 'expand' },
  { name: 'ITEM_TP_NM', dataType: 'text', headerText: 'ITEM_TP_NM', visible: false, editable: false, width: '100', groups: 'ITEM', groupShowMode: 'expand' },
  { name: 'ATTR_01', dataType: 'text', headerText: 'ATTR_01', visible: false, editable: false, width: '100', groups: 'ITEM', groupShowMode: 'expand' },
  { name: 'ATTR_02', dataType: 'text', headerText: 'ATTR_02', visible: false, editable: false, width: '100', groups: 'ITEM', groupShowMode: 'expand' },
  { name: 'ATTR_03', dataType: 'text', headerText: 'ATTR_03', visible: false, editable: false, width: '100', groups: 'ITEM', groupShowMode: 'expand' },
  { name: 'ATTR_04', dataType: 'text', headerText: 'ATTR_04', visible: false, editable: false, width: '100', groups: 'ITEM', groupShowMode: 'expand' },
  { name: 'ATTR_05', dataType: 'text', headerText: 'ATTR_05', visible: false, editable: false, width: '100', groups: 'ITEM', groupShowMode: 'expand' },
  { name: 'ATTR_06', dataType: 'text', headerText: 'ATTR_06', visible: false, editable: false, width: '100', groups: 'ITEM', groupShowMode: 'expand' },
  { name: 'ATTR_07', dataType: 'text', headerText: 'ATTR_07', visible: false, editable: false, width: '100', groups: 'ITEM', groupShowMode: 'expand' },
  { name: 'ATTR_08', dataType: 'text', headerText: 'ATTR_08', visible: false, editable: false, width: '100', groups: 'ITEM', groupShowMode: 'expand' },
  { name: 'ATTR_09', dataType: 'text', headerText: 'ATTR_09', visible: false, editable: false, width: '100', groups: 'ITEM', groupShowMode: 'expand' },
  { name: 'ATTR_10', dataType: 'text', headerText: 'ATTR_10', visible: false, editable: false, width: '100', groups: 'ITEM', groupShowMode: 'expand' },
  { name: 'ATTR_11', dataType: 'text', headerText: 'ATTR_11', visible: false, editable: false, width: '100', groups: 'ITEM', groupShowMode: 'expand' },
  { name: 'ATTR_12', dataType: 'text', headerText: 'ATTR_12', visible: false, editable: false, width: '100', groups: 'ITEM', groupShowMode: 'expand' },
  { name: 'ATTR_13', dataType: 'text', headerText: 'ATTR_13', visible: false, editable: false, width: '100', groups: 'ITEM', groupShowMode: 'expand' },
  { name: 'ATTR_14', dataType: 'text', headerText: 'ATTR_14', visible: false, editable: false, width: '100', groups: 'ITEM', groupShowMode: 'expand' },
  { name: 'ATTR_15', dataType: 'text', headerText: 'ATTR_15', visible: false, editable: false, width: '100', groups: 'ITEM', groupShowMode: 'expand' },
  { name: 'ATTR_16', dataType: 'text', headerText: 'ATTR_16', visible: false, editable: false, width: '100', groups: 'ITEM', groupShowMode: 'expand' },
  { name: 'ATTR_17', dataType: 'text', headerText: 'ATTR_17', visible: false, editable: false, width: '100', groups: 'ITEM', groupShowMode: 'expand' },
  { name: 'ATTR_18', dataType: 'text', headerText: 'ATTR_18', visible: false, editable: false, width: '100', groups: 'ITEM', groupShowMode: 'expand' },
  { name: 'ATTR_19', dataType: 'text', headerText: 'ATTR_19', visible: false, editable: false, width: '100', groups: 'ITEM', groupShowMode: 'expand' },
  { name: 'ATTR_20', dataType: 'text', headerText: 'ATTR_20', visible: false, editable: false, width: '100', groups: 'ITEM', groupShowMode: 'expand' },
  { name: 'UOM_NM', dataType: 'text', headerText: 'UOM_NM', visible: false, editable: false, width: '100', groups: 'ITEM', groupShowMode: 'expand' },
  { name: 'CATEGORY_GROUP', dataType: 'text', headerText: 'CATEGORY_GROUP', visible: true, editable: false, width: '100' },
  { name: 'CATEGORY', dataType: 'text', headerText: 'CATEGORY', visible: true, editable: false, width: '100', lang: true },
  { name: 'DAT', dataType: 'number', headerText: 'DAT', visible: true, editable: false, width: '100', numberFormat: '#,###.###', iteration : { "prefix": "DAT_", "prefixRemove": "true", "delimiter": "," } }
];

const mpResultDetailChartOptions = {
  plugins: {
    legend: { position: 'bottom' }
  },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      position: 'left',
      min: 0,
      grid: { drawOnChartArea: false, },
      title: { display: true, text: transLangKey('QTY') }
    },
    y1: {
      position: 'right',
      min: 0,
      title: { display: true, text: transLangKey('AMT') }
    }
  }
};

function MpResult() {
  const [gridMpResultBase, setGridMpResultBase] = useState(null);
  const [gridMpResultDetail, setGridMpResultDetail] = useState(null);
  const [username] = useUserStore(state => [state.username]);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const locationSearchBoxRef = useRef();
  const itemSearchBoxRef = useRef();

  const [currentLocationRef, setCurrentLocationRef] = useState();
  const [currentItemRef, setCurrentItemRef] = useState();

  const [personalizePopupOpen, setPersonalizePopupOpen] = useState(false);
  const [simulationVersionPopupOpen, setSimulationVersionPopupOpen] = useState(false);
  const [confirmPlanPopupOpen, setConfirmPlanPopupOpen] = useState(false);
  const [dmndOrderTrackPopupOpen, setDmndOrderTrackPopupOpen] = useState(false);
  const [adjustShppPlanPopupOpen, setAdjustShppPlanPopupOpen] = useState(false);
  const [dueInTrackPopupOpen, setDueInTrackPopupOpen] = useState(false);
  const [newSimulationVersionPopupOpen, setNewSimulationVersionPopupOpen] = useState(false);
  const [adjustPlanPopupOpen, setAdjustPlanPopupOpen] = useState(false);

  const [tabValue, setTabValue] = React.useState("tabDetail");

  const mpResultDetailDatasets = [
    { type: 'line', label: transLangKey('DMND_QTY'), borderColor: '#ABCD5A', borderWidth: 2, fill: false, data: { } },
    { type: 'bar', label: transLangKey('PRDUCT_PLAN'), borderColor: 'white', backgroundColor: '#309B46', order: 1, data: { } },
    { type: 'line', label: transLangKey('EOH'), borderColor: '#68B8E3', borderWidth: 2, fill: false, data: { } },
    { type: 'line', label: transLangKey('PREDICT_REVENUE'), borderColor: '#FF8F56', borderWidth: 2, fill: false, yAxisID: 'y1', data: { } },
    { type: 'line', label: transLangKey('STOCK_AMT'), borderColor: '#E33A2E', borderWidth: 2, fill: false, yAxisID: 'y1', data: { } }
  ]

  const { reset, getValues, setValue, control } = useForm({
    defaultValues: {
      moduleCd: 'MP',
      simulationVersion: '',
      gridItemCd: '',
      gridLocatCd: '',
      defaultSimulationVersion: {}
    }
  });

  const [mpResultDetailData, setMpResultDetailData] = useState({
    labels: [],
    datasets: mpResultDetailDatasets
  });

  const globalButtons = [
    { name: 'search', action: (e) => { onSubmit(tabValue) }, visible: true, disable: false },
    { name: 'refresh', action: (e) => { refresh() }, visible: true, disable: false },
    { name: 'personalization', action: (e) => { setPersonalizePopupOpen(true); }, visible: true, disable: false }
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

    if (gridMpResultBase && gridMpResultDetail) {
      async function initLoad() {
        await loadRecentSimulationVersion();
        await loadMpResultDetail();
        loadMpResultBase();
      }

      initLoad();
    }
  }, [gridMpResultBase, gridMpResultDetail]);

  function afterGridMpResultDetail(gridObj) {
    setGridMpResultDetail(gridObj);
    setOptionsGridMpDetailResult(gridObj);
  }

  function afterGridMpResultBase(gridObj) {
    setGridMpResultBase(gridObj);
    setOptionsGridMpBaseResult(gridObj);
  }

  function setOptionsGridMpBaseResult(gridObj) {
    setVisibleProps(gridObj, true, false, false);
    gridObj.gridView.setFixedOptions({colCount: 5, resizable: true});

    gridObj.gridView.setDisplayOptions({
      fitStyle: 'fill'
    });

    gridObj.gridView.setColumnProperty("LOCAT_TP_NM", "mergeRule", { criteria: "value" });
    gridObj.gridView.setColumnProperty("LOCAT_LV", "mergeRule", { criteria: "prevvalues + value" });
    gridObj.gridView.setColumnProperty("LOCAT_CD", "mergeRule", { criteria: "prevvalues + value" });
    gridObj.gridView.setColumnProperty("LOCAT_NM", "mergeRule", { criteria: "prevvalues + value" });

    gridObj.gridView.setCellStyleCallback(function(grid, dataCell) {
      if (dataCell.index.column.name === 'CATEGORY') {
        return {style:{background: '#EEEEEE'}}
      }

      if (dataCell.index.column.name.split('DAT').length > 1) {
        if (gridObj.gridView.getValues(dataCell.index.itemIndex).CATEGORY === 'DMND_QTY') {
          return {style:{background: '#CEFBC9'}}
        } else {
          return {style:{background: '#FFFFFF'}}
        }
      } else {
        return {style:{background: '#FFFFFF'}}
      }
    })
  }

  function setOptionsGridMpDetailResult(gridObj) {
    setVisibleProps(gridObj, true, false, false);
    gridObj.gridView.setFixedOptions({colCount: 4, resizable: true});

    gridObj.gridView.setDisplayOptions({
      fitStyle: 'fill'
    });

    gridObj.gridView.setColumnProperty("LOCAT_TP_NM", "mergeRule", { criteria: "value" });

    let columnArr = ["LOCAT_LV", "LOCAT_CD", "LOCAT_NM", "LOCAT_GRP_CD", "BUSINESS_UNIT", "IN_OUT_FLAG", "ITEM_CD", "ITEM_NM", "ITEM_DESCRIP", "ITEM_TP_NM", "ATTR_01", "ATTR_02", "CATEGORY_GROUP", "CATEGORY"];
    for (let i = 0; i < columnArr.length; i++) {
      gridObj.gridView.setColumnProperty(columnArr[i], "mergeRule", { criteria: "prevvalues + value" });
    }

    wingui.util.grid.sorter.orderBy(gridObj.gridView, ["LOCAT_CD", "LOCAT_NM", "LOCAT_GRP_CD", "BUSINESS_UNIT", "IN_OUT_FLAG", "ITEM_CD", "ITEM_NM", "ITEM_DESCRIP", "ITEM_TP_NM", "ATTR_01", "ATTR_02"]);

    gridObj.gridView.onCellClicked = function (grid, index, itemIndex) {
      if (index.cellType && index.cellType === 'data') {
        let data = gridObj.dataProvider.getOutputRow(null, index.dataRow);

        loadMpResultDetailChart(gridObj, data);
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
        return {style:{background: '#EEEEEE'}}
      }

      if (dataCell.index.column.name.split('DAT').length > 1) {
        if (gridObj.gridView.getValues(dataCell.index.itemIndex).CATEGORY === 'DMND_QTY') {
          return {style:{background: '#CEFBC9'}}
        } else if (gridObj.gridView.getValues(dataCell.index.itemIndex).CATEGORY === 'SHIPPING_PLAN' || gridObj.gridView.getValues(dataCell.index.itemIndex).CATEGORY === 'DUE_IN') {
          return {style:{background: '#F4ECCE'}}
        } else {
          return {style:{background: '#FFFFFF'}}
        }
      } else {
        return {style:{background: '#FFFFFF'}}
      }
    });
  }

  function onSubmit(activeTab) {
    if (activeTab === 'tabBase') {
      loadMpResultBase();
    } else {
      loadMpResultDetail();
    }
  };

  function refresh() {
    currentLocationRef.reset();
    currentItemRef.reset();

    reset({
      simulationVersion: getValues('defaultSimulationVersion').SIMUL_VER_ID
    });

    gridMpResultBase.dataProvider.clearRows();
    gridMpResultDetail.dataProvider.clearRows();

    setMpResultDetailData({
      labels: [],
      datasets: [
        { type: 'line', label: transLangKey('DMND_QTY'), borderColor: '#ABCD5A', borderWidth: 2, fill: false, data: { } },
        { type: 'bar', label: transLangKey('PRDUCT_PLAN'), borderColor: 'white', backgroundColor: '#309B46', order: 1, data: { } },
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
  }

  const tabChange = (event, newValue) => {
    setViewInfo(vom.active, 'globalButtons', [
      { name: "search", action: (e) => { onSubmit(newValue); }, visible: true, disable: false },
      { name: "refresh", action: (e) => { refresh(); }, visible: true, disable: false },
      { name: 'personalization', action: (e) => { setPersonalizePopupOpen(true); }, visible: true, disable: false }
    ]);

    setTabValue(newValue);
  };

  function loadRecentSimulationVersion() {
    let param = new URLSearchParams();

    param.append('MENU_ID', 'UI_MP_27');

    return zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_COMM_DEFAULT_VER',
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        if (res.data.RESULT_DATA.length > 0) {
          let data = res.data.RESULT_DATA[0];

          setValue('simulationVersion', data.SIMUL_VER_ID);
          setValue('defaultSimulationVersion', data);
        }
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function loadMpResultBase() {
    let params = new URLSearchParams();

    params.append('VERSION_ID', getValues('simulationVersion'));
    params.append('LOCAT_TP_NM', currentLocationRef.getLocationType());
    params.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    params.append('LOCAT_CD', currentLocationRef.getLocationCode());
    params.append('LOCAT_NM', currentLocationRef.getLocationName());
    params.append('CROSSTAB', JSON.stringify(gridMpResultBase.gridView.crossTabInfo));

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/GetDemandAnalysis',
      data: params
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridMpResultBase.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function loadConfirmSimulVer() {
    let params = new URLSearchParams();

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
    let params = new URLSearchParams();

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

  function openConfirmPlanPopup() {
    setConfirmPlanPopupOpen(true);
  }

  function openNewSimulationVersionPopup() {
    loadConfirmSimulVer();
  }

  function openAdjustPlanPopup() {
    loadConfirmAdjPlan();
  }

  function loadMpResultDetail() {
    let params = new URLSearchParams();

    params.append('VERSION_ID', getValues('simulationVersion'));
    params.append('LOCAT_TP_NM', currentLocationRef.getLocationType());
    params.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    params.append('LOCAT_CD', currentLocationRef.getLocationCode());
    params.append('LOCAT_NM', currentLocationRef.getLocationName());
    params.append('ITEM_CD', currentItemRef.getItemCode());
    params.append('ITEM_NM', currentItemRef.getItemName());
    params.append('ITEM_TP_NM', currentItemRef.getItemType());
    params.append('LIKE_SEARCH_YN', 'Y');
    params.append('CROSSTAB', JSON.stringify(gridMpResultDetail.gridView.crossTabInfo));

    return zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/GetMPSimulationAnalysis',
      data: params
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridMpResultDetail.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      setMpResultDetailData({
        labels: [],
        datasets: mpResultDetailDatasets
      });
    });
  }

  function loadMpResultDetailChart(grid, data) {
    let newMpResultDetailDatasets = mpResultDetailDatasets.slice();
    let mpResultDetailCols = ['DMND_QTY', 'PRDUCT_PLAN', 'EOH', 'PREDICT_REVENUE', 'STOCK_AMT'];
    let date = [];

    grid.dataProvider.getFieldNames().filter(fieldName => fieldName.includes('DAT_')).forEach(fieldName => date.push(fieldName.split('DAT_')[1]));
    let targetData = grid.dataProvider.getJsonRows().filter(row => row.LOCAT_CD === data.LOCAT_CD && row.ITEM_CD === data.ITEM_CD);

    for (let i = 0; i < mpResultDetailCols.length; i++) {
      let rows = targetData.filter(targetRow => targetRow.CATEGORY === mpResultDetailCols[i]);
      newMpResultDetailDatasets[i].data = {};

      rows.forEach(row => {
        for (let j = 0; j < date.length; j++) {
          newMpResultDetailDatasets[i].data[date[j]] = row['DAT_' + date[j]];
        }
      })
    }

    setMpResultDetailData({
      labels: date,
      datasets: newMpResultDetailDatasets
    });
  }

  const reloadPrefInfo = (viewCd, userName, grid, grpCd, gridCd) => {
    if (grid) {
      grid.loadCrossTabInfoAndPrefInfo(viewCd, grpCd, userName);
    }
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <InputField type='action' name='simulationVersion' label={transLangKey('SIMUL_VER_SHORTN')} title={transLangKey('SEARCH')} onClick={openSimulationVersionPopup} control={control} style={{ width: '210px' }}>
              <Icon.Search />
            </InputField>
            <LocationSearchBox ref={locationSearchBoxRef} keyValue={'locationName'} placeHolder={transLangKey('LOCAT_NM')} style={{width: 300}} />
            <ItemSearchBox ref={itemSearchBoxRef} keyValue={'itemName'} placeHolder={transLangKey('ITEM_NM')} style={{width: 300, display: tabValue === 'tabDetail' ? 'inline-block' : 'none'}} />
          </SearchRow>
        </SearchArea>

        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={tabChange} indicatorColor='primary'>
            <Tab label={transLangKey('DETAIL')} value='tabDetail' />
            <Tab label={transLangKey('BASE')} value='tabBase' />
          </Tabs>
        </Box>

        {/* tabDetail */}
        <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: tabValue === 'tabDetail' ? 'block' : 'none' }}>
          <ButtonArea>
            <LeftButtonArea>
              <GridExcelExportButton type='icon' grid='gridMpResultDetail' options={exportOptions} />
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
          <ResultArea sizes={[60, 40]} direction={'vertical'}>
            <Box>
              <BaseGrid id='gridMpResultDetail' items={gridMpResultDetailColumns} viewCd='UI_MP_27' gridCd='UI_MP_27-RST_CPT_01' afterGridCreate={afterGridMpResultDetail} />
            </Box>
            <Box>
              <Box style={{ width: '100%', height: 'calc(100% - 50px)' }}>
                <Chart data={mpResultDetailData} options={mpResultDetailChartOptions} />
              </Box>
            </Box>
          </ResultArea>
        </Box>

        {/* tabBase */}
        <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: tabValue === 'tabBase' ? 'block' : 'none' }}>
          <ButtonArea>
            <LeftButtonArea>
              <GridExcelExportButton type='icon' grid='gridMpResultBase' options={exportOptions} />
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
          <Box style={{ height: 'calc(100% - 50px)' }}>
            <BaseGrid id='gridMpResultBase' items={gridMpResultBaseColumns} viewCd='UI_MP_27' gridCd='UI_MP_27-RST_CPT_00' afterGridCreate={afterGridMpResultBase} />
          </Box>
        </Box>
      </ContentInner>

      <PopSimulationVersion open={simulationVersionPopupOpen} onClose={closeSimulationVersionPopup} confirm={setSimulationVersion} module={getValues('moduleCd')} />
      <PopConfirmPlan open={confirmPlanPopupOpen} onClose={() => { setConfirmPlanPopupOpen(false) }} confirm={onSubmit} param={getValues('simulationVersion')} />
      <PopDmndOrderTrack open={dmndOrderTrackPopupOpen} onClose={() => { setDmndOrderTrackPopupOpen(false) }} param={{ versionId: getValues('simulationVersion'), itemCd: getValues('gridItemCd'), locatCd: getValues('gridLocatCd') }} />
      <PopAdjustShppPlan open={adjustShppPlanPopupOpen} onClose={() => { setAdjustShppPlanPopupOpen(false) }} param={{ versionId: getValues('simulationVersion'), itemCd: getValues('gridItemCd'), locatCd: getValues('gridLocatCd') }} />
      <PopDueInTrack open={dueInTrackPopupOpen} onClose={() => { setDueInTrackPopupOpen(false) }} param={{ versionId: getValues('simulationVersion'), itemCd: getValues('gridItemCd'), locatCd: getValues('gridLocatCd') }} />
      <PopPersonalize open={personalizePopupOpen} onClose={() => { setPersonalizePopupOpen(false) }} resetCallback={reloadPrefInfo} viewCd= 'UI_MP_27' grid={[gridMpResultBase, gridMpResultDetail]} username={username} authTpId={''} />
      <PopNewSimulationVersion open={newSimulationVersionPopupOpen} onClose={() => { setNewSimulationVersionPopupOpen(false) }} versionId={getValues('simulationVersion')} />
      <PopConfirmAdjPlan open={adjustPlanPopupOpen} onClose={() => { setAdjustPlanPopupOpen(false) }} confirm={onSubmit} versionId={getValues('simulationVersion')} />
    </>
  )
}

export default MpResult;
