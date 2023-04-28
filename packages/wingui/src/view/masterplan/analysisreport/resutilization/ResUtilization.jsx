import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { useLocation } from "react-router-dom";
import { BaseGrid, ButtonArea, ContentInner, GridExcelExportButton, InputField, LeftButtonArea, ResultArea, SearchArea, SearchRow, useViewStore, useIconStyles, zAxios } from '@zionex/wingui-core/src/common/imports';

import LocationSearchBox from '@wingui/view/supplychainmodel/common/LocationSearchBox';
import PopSimulationVersion from '@wingui/view/masterplan/common/PopSimulationVersion';
import PopCommResource from '@wingui/view/supplychainmodel/common/PopCommResource';

import '@wingui/view/masterplan/common/common.css';

import { Chart as ChartJS, LinearScale, CategoryScale, BarElement, PointElement, LineElement, Title, Legend, Tooltip, LineController, BarController } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register( LinearScale, CategoryScale, BarElement, PointElement, LineElement, Title, Legend, Tooltip, LineController, BarController );

const resourceUtilizationChartOptions = {
  plugins: {
    title: { display: false, text: transLangKey('UI_MP_31') },
    legend: { position: 'bottom' }
  },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      stacked: true
    },
    utilization: {
      position: 'right',
      min: 0,
      grid: { drawOnChartArea: false },
      title: { display: true, text: transLangKey('UTILIZATION') }
    },
    capacityLoad: {
      position: 'left',
      stacked: true,
      title: { display: true, text: transLangKey('CAPA_LOAD') }
    }
  }
};

let gridResUtilizationColumns = [
  { name: 'LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: 80, visible: true, editable: false, groups: 'LOCAT', groupShowMode: 'expand' },
  { name: 'LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: 80, visible: true, editable: false, groups: 'LOCAT', groupShowMode: 'expand' },
  { name: 'LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: 80, visible: true, editable: false, groups: 'LOCAT', groupShowMode: 'always' },
  { name: 'LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: 110, visible: true, editable: false, groups: 'LOCAT', groupShowMode: 'always' },
  { name: 'LOCAT_GRP_CD', headerText: 'LOCAT_GRP', dataType: 'text', width: 100, visible: true, editable: false, groups: 'LOCAT', groupShowMode: 'expand' },
  { name: 'BUSINESS_UNIT', headerText: 'BUSINESS_UNIT', dataType: 'text', width: 80, visible: true, editable: false, groups: 'LOCAT', groupShowMode: 'expand' },
  { name: 'IN_OUT_FLAG', headerText: 'IN_OUT_FLAG', dataType: 'text', width: 80, visible: true, editable: false, groups: 'LOCAT', groupShowMode: 'expand' },
  { name: 'RES_GRP_CD', headerText: 'RES_GRP_CD', dataType: 'text', width: 110, visible: true, editable: false, groups: 'RES', groupShowMode: 'expand' },
  { name: 'RES_GRP_NM', headerText: 'RES_GRP_NM', dataType: 'text', width: 110, visible: true, editable: false, groups: 'RES', groupShowMode: 'expand' },
  { name: 'RES_ATTR_CD', headerText: 'RES_ATTR_CD', dataType: 'text', width: 120, visible: false, editable: false, groups: 'RES', groupShowMode: 'expand' },
  { name: 'RES_ATTR_NM', headerText: 'RES_ATTR_NM', dataType: 'text', width: 110, visible: false, editable: false, groups: 'RES', groupShowMode: 'expand' },
  { name: 'RES_CD', headerText: 'RES_CD', dataType: 'text', width: 80, visible: true, editable: false, groups: 'RES', groupShowMode: 'always' },
  { name: 'RES_DESCRIP', headerText: 'RES_DESCRIP', dataType: 'text', width: 110, visible: true, editable: false, groups: 'RES', groupShowMode: 'always' },
  { name: 'OUTSRC', headerText: 'OUTSRC_YN', dataType: 'boolean', width: 80, visible: true, editable: false, groups: 'RES', groupShowMode: 'expand' },
  { name: 'BASE_OVR_CAPA', headerText: 'DEFAT_OVR_CAPA_VAL', dataType: 'text', width: 140, visible: true, editable: false, groups: 'RES', groupShowMode: 'expand' },
  { name: 'BASE_EFFICY', headerText: 'DEFAT_EFFICY_VAL', dataType: 'text', width: 110, visible: true, editable: false, groups: 'RES', groupShowMode: 'expand' },
  { name: 'CATEGORY', headerText: 'RST_MEASURE_TP_NM', dataType: 'text', width: 100, visible: true, editable: false, lang: true,
    styleCallback: function () {
      let ret = {};

      ret.styleName = 'category-column-cell-bg tet-column'
      return ret;
    }
  },
  { name: 'DAT', dataType: 'number', width: 100, editable: false, numberFormat: "#,###.###", iteration: { prefix: 'DAT_', prefixRemove: 'true' }}
]

function ResUtilization() {
  const location = useLocation();
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const [gridResUtilization, setGridResUtilization] = useState(null);

  const [simulationVersionPopupOpen, setSimulationVersionPopupOpen] = useState(false);
  const [resourcePopupOpen, setResourcePopupOpen] = useState(false);

  const locationSearchBoxRef = useRef();
  const [currentLocationRef, setCurrentLocationRef] = useState(null);

  const [resourceUtilizationData, setResourceUtilizationData] = useState({
    labels: [],
    datasets: []
  })

  const { reset, getValues, setValue, control } = useForm({
    defaultValues: {
      simulationVersion: '',
      resourceCode: '',
      resourceDescription: '',
      dateRange: [],
      fromUtilization: '',
      toUtilization: ''
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
    if (location.state !== undefined && location.state !== null) {
      if (location.state.params !== undefined) {
        if (gridResUtilization && currentLocationRef) {
          setValue('simulationVersion', location.state.params['VERSION_ID']);
          setValue('resourceCode', location.state.params['RES_CD']);
          setValue('resourceDescription', location.state.params['RES_DESCRIP']);
          currentLocationRef.setLocationCode(location.state.params['LOCATION_CODE']);
          setValue('dateRange', [location.state.params['MIN_DATE'], location.state.params['MAX_DATE']]);
          loadResUtilization();
        }
      }
    }
  }, [location]);

  useEffect(() => {
    if (locationSearchBoxRef) {
      if (locationSearchBoxRef.current) {
        setCurrentLocationRef(locationSearchBoxRef.current);
      }
    }
  }, [viewData]);

  useEffect(() => {
    setViewInfo(vom.active, 'globalButtons', [
      { name: 'search', action: (e) => { loadResUtilization(); }, visible: true, disable: false },
      { name: 'refresh', action: (e) => { refresh(); }, visible: true, disable: false }
    ]);

    if (gridResUtilization) {
      async function initLoad() {
        await loadRecentSimulationVersion();
        loadResUtilization();
      }

      initLoad();
    }
  }, [gridResUtilization]);

  function loadRecentSimulationVersion() {
    let param = new URLSearchParams();

    param.append('MODULE_CD', 'MP');
    param.append('MAIN_VER_ID', '');
    param.append('SIMUL_VER_ID', '');
    param.append('SIMUL_VER_DESCRIP', '');

    return zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_COMM_SRH_VER_Q',
      data: param
    })
    .then(async function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        setValue('simulationVersion', res.data.RESULT_DATA[0].SIMUL_VER);
        setResourceUtilizationChartLegend();
        await loadDefaultDate(res.data.RESULT_DATA[0].SIMUL_VER);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function loadDefaultDate(simulationVersion) {
    let param = new URLSearchParams();

    param.append('TYPE', 'PLAN_HORIZON');
    param.append('SIMUL_VER_ID', simulationVersion);

    return zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_COMM_DEFAULT_DATE',
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        setValue('dateRange', [res.data.RESULT_DATA[0].MIN_DATE, res.data.RESULT_DATA[0].MAX_DATE]);
      }
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      if (location.state !== undefined && location.state !== null) {
        if (location.state.params !== undefined) {
          setValue('simulationVersion', location.state.params['VERSION_ID']);
          setValue('resourceCode', location.state.params['RES_CD']);
          setValue('resourceDescription', location.state.params['RES_DESCRIP']);
          currentLocationRef.setLocationCode(location.state.params['LOCATION_CODE']);
          setValue('dateRange', [location.state.params['MIN_DATE'], location.state.params['MAX_DATE']]);
        }
      }
    });
  }

  function refresh() {
    reset({
      simulationVersion: getValues('simulationVersion'),
      dateRange: getValues('dateRange')
    });
    currentLocationRef.reset();
    gridResUtilization.dataProvider.clearRows();
    setResourceUtilizationChartLegend();
  }

  function setGridResUtilizationOptions(gridObj) {
    gridObj.gridView.setEditOptions({
      insertable: true,
      appendable: true
    });

    gridObj.gridView.setFixedOptions({ colCount: 3, resizable: true });
    gridObj.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridObj, true, true, false);

    gridObj.gridView.onCellClicked = function (grid, clickData, column) {
      if (clickData.cellType && clickData.cellType === 'data') {
        let data = gridObj.dataProvider.getOutputRow(null, clickData.dataRow);
        loadResourceUtilizationChart(gridObj, data);
      }
    }

    gridObj.gridView.setColumnProperty('LOCAT_TP_NM', 'mergeRule', { criteria: 'values[ "LOCAT_TP_NM" ]' });
    gridObj.gridView.setColumnProperty('LOCAT_LV', 'mergeRule', { criteria: 'values[ "LOCAT_TP_NM" ]' });
    gridObj.gridView.setColumnProperty('LOCAT_CD', 'mergeRule', { criteria: 'values[ "LOCAT_CD" ]' });
    gridObj.gridView.setColumnProperty('LOCAT_NM', 'mergeRule', { criteria: 'values[ "LOCAT_CD" ]' });
    gridObj.gridView.setColumnProperty('LOCAT_GRP_CD', 'mergeRule', { criteria: 'values[ "LOCAT_CD" ]' });
    gridObj.gridView.setColumnProperty('BUSINESS_UNIT', 'mergeRule', { criteria: 'values[ "LOCAT_CD" ]' });
    gridObj.gridView.setColumnProperty('IN_OUT_FLAG', 'mergeRule', { criteria: 'values[ "LOCAT_CD" ]' });
    gridObj.gridView.setColumnProperty('RES_GRP_CD', 'mergeRule', { criteria: 'values[ "LOCAT_CD" ] + values[ "RES_CD" ]' });
    gridObj.gridView.setColumnProperty('RES_GRP_NM', 'mergeRule', { criteria: 'values[ "LOCAT_CD" ] + values[ "RES_CD" ]' });
    gridObj.gridView.setColumnProperty('RES_ATTR_CD', 'mergeRule', { criteria: 'values[ "LOCAT_CD" ] + values[ "RES_CD" ]' });
    gridObj.gridView.setColumnProperty('RES_ATTR_NM', 'mergeRule', { criteria: 'values[ "LOCAT_CD" ] + values[ "RES_CD" ]' });
    gridObj.gridView.setColumnProperty('RES_CD', 'mergeRule', { criteria: 'values[ "LOCAT_CD" ] + values[ "RES_CD" ]' });
    gridObj.gridView.setColumnProperty('RES_DESCRIP', 'mergeRule', { criteria: 'values[ "LOCAT_CD" ] + values[ "RES_CD" ]' });
    gridObj.gridView.setColumnProperty('OUTSRC', 'mergeRule', { criteria: 'values[ "LOCAT_CD" ] + values[ "RES_CD" ]' });
    gridObj.gridView.setColumnProperty('BASE_OVR_CAPA', 'mergeRule', { criteria: 'values[ "LOCAT_CD" ] + values[ "RES_CD" ]' });
    gridObj.gridView.setColumnProperty('BASE_EFFICY', 'mergeRule', { criteria: 'values[ "LOCAT_CD" ] + values[ "RES_CD" ]' });
  }

  function setResourceUtilizationChartLegend() {
    let resourceUtilizationDataSet = [
      { type: 'bar', label: transLangKey('LOAD'), borderColor: 'white', borderWidth: 2, fill: false, backgroundColor: '#7BB7FAC8', order: 1, yAxisID: 'capacityLoad', data: { } },
      { type: 'bar', label: transLangKey('OVERLOAD'), borderColor: 'white', borderWidth: 2, fill: false, backgroundColor: '#E9226DC8', order: 1, yAxisID: 'capacityLoad', data: { } },
      { type: 'bar', label: transLangKey('JC_LOSS'), borderColor: 'white', borderWidth: 2, fill: false, backgroundColor: '#000000FF', order: 1, yAxisID: 'capacityLoad', data: { } },
      { type: 'bar', label: transLangKey('AVAIL'), borderColor: 'white', borderWidth: 2, fill: false, backgroundColor: '#75FD4596', order: 1, yAxisID: 'capacityLoad', data: { } },
      { type: 'line', label: transLangKey('UTIL'), borderColor: '#F2B661', borderWidth: 2, yAxisID: 'utilization', data: { } }
    ];

    setResourceUtilizationData({
      labels: [],
      datasets: resourceUtilizationDataSet
    });
  }

  function afterGridResUtilization(gridObj) {
    setGridResUtilization(gridObj);
    setGridResUtilizationOptions(gridObj);
  }

  function openSimulationVersionPopup() {
    setSimulationVersionPopupOpen(true);
  }

  function closeSimulationVersionPopup() {
    setSimulationVersionPopupOpen(false);
  }

  function onSetSimulationVersion(data) {
    setValue('simulationVersion', data.SIMUL_VER);
    loadDefaultDate(data.SIMUL_VER);
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

  function loadResUtilization() {
    let param = new URLSearchParams();

    param.append('VERSION_ID', getValues('simulationVersion'));
    param.append('LOCAT_TP_NM', currentLocationRef.getLocationType());
    param.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    param.append('LOCAT_CD', currentLocationRef.getLocationCode());
    param.append('LOCAT_NM', currentLocationRef.getLocationName());
    param.append('RES_CD', getValues('resourceCode'));
    param.append('RES_DESCRIP', getValues('resourceDescription'));
    param.append('RES_ATTR_NM', '');

    let dateRange = getValues('dateRange');

    param.append('FROM_DATE', dateRange && dateRange[0] ? new Date(dateRange[0]).format('yyyy-MM-ddT00:00:00') : '1970-01-01T00:00:00');
    param.append('TO_DATE', dateRange && dateRange[1] ? new Date(dateRange[1]).format('yyyy-MM-ddT00:00:00') : '9999-12-31T00:00:00');

    if (getValues('fromUtilization') !== '') {
      param.append('FROM_UTIL', getValues('fromUtilization'));
    }

    if (getValues('toUtilization') !== '') {
      param.append('TO_UTIL', getValues('toUtilization'));
    }

    param.append('CROSSTAB', JSON.stringify(gridResUtilization.gridView.crossTabInfo));

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/GetResourceUtilization',
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
            if (a.RES_CD > b.RES_CD) {
              return 1;
            } else if (a.RES_CD < b.RES_CD) {
              return -1;
            } else {
              return 0;
            }
          }
        });

        gridResUtilization.dataProvider.clearRows();
        gridResUtilization.setData(data);
        setResourceUtilizationChartLegend();
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function loadResourceUtilizationChart(grid, data) {
    let resourceUtilizationColumns = ['LOAD', 'OVERLOAD', 'JC_LOSS', 'AVAIL', 'UTIL'];
    let resourceUtilizationDataSet = [
      { type: 'bar', label: transLangKey('LOAD'), borderColor: 'white', borderWidth: 2, fill: false, backgroundColor: '#7BB7FAC8', order: 1, yAxisID: 'capacityLoad', data: { } },
      { type: 'bar', label: transLangKey('OVERLOAD'), borderColor: 'white', borderWidth: 2, fill: false, backgroundColor: '#E9226DC8', order: 1, yAxisID: 'capacityLoad', data: { } },
      { type: 'bar', label: transLangKey('JC_LOSS'), borderColor: 'white', borderWidth: 2, fill: false, backgroundColor: '#000000FF', order: 1, yAxisID: 'capacityLoad', data: { } },
      { type: 'bar', label: transLangKey('AVAIL'), borderColor: 'white', borderWidth: 2, fill: false, backgroundColor: '#75FD4596', order: 1, yAxisID: 'capacityLoad', data: { } },
      { type: 'line', label: transLangKey('UTIL'), borderColor: '#F2B661', borderWidth: 2, yAxisID: 'utilization', data: { } }
    ];

    let dateColumn = [];
    grid.dataProvider.getFieldNames().filter(fieldName => fieldName.includes('DAT_')).forEach(fieldName => dateColumn.push(fieldName));

    let date = dateColumn.map(fieldName => fieldName.replace('DAT_', ''));
    let targetData = grid.dataProvider.getJsonRows().filter(row => row.LOCAT_CD === data.LOCAT_CD && row.RES_CD === data.RES_CD);

    for (let i = 0; i < resourceUtilizationColumns.length; i++) {
      let rows = targetData.filter(targetRow => targetRow.CATEGORY === resourceUtilizationColumns[i]);
      resourceUtilizationDataSet[i].data = {};

      rows.forEach(row => {
        for (let j = 0; j < dateColumn.length; j++) {
          resourceUtilizationDataSet[i].data[date[j]] = row[dateColumn[j]];
        }
      })
    }

    setResourceUtilizationData({
      labels: date,
      datasets: resourceUtilizationDataSet
    });
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <InputField type="action" name="simulationVersion" label={transLangKey("SIMUL_VER_SHORTN")} title={transLangKey("SEARCH")} onClick={openSimulationVersionPopup} control={control} style={{ width: "210px" }}>
              <Icon.Search />
            </InputField>
            <LocationSearchBox ref={locationSearchBoxRef} keyValue={"locationCode"} placeHolder={transLangKey("LOCAT_CD")}  style={{width: 300}} />
            <InputField type="action" name="resourceCode" label={transLangKey("RES_CD")} title={transLangKey("SEARCH")} onClick={openResourcePopup} control={control}>
              <Icon.Search />
            </InputField>
            <InputField name="resourceDescription" label={transLangKey("RES_DESCRIP")} control={control} />
            <InputField type="dateRange" name="dateRange" label={transLangKey("DURA")} control={control} dateformat="yyyy-MM-dd" />
            <InputField dataType="number" name="fromUtilization" label={transLangKey("FROM_UTIL")} control={control} style={{display: 'none'}}/>
            <InputField dataType="number" name="toUtilization" label={transLangKey("TO_UTIL")} control={control} style={{display: 'none'}}/>
          </SearchRow>
        </SearchArea>
        <ButtonArea>
          <LeftButtonArea>
            <GridExcelExportButton type="icon" grid="gridResUtilization" options={exportOptions} />
          </LeftButtonArea>
        </ButtonArea>
        <ResultArea sizes={[70, 30]} direction={"vertical"}>
          <Box>
            <BaseGrid id="gridResUtilization" items={gridResUtilizationColumns} viewCd="UI_MP_31" gridCd="UI_MP_31-RST_CPT_01" afterGridCreate={afterGridResUtilization} />
          </Box>
          <Box>
            <Box style={{ width: "100%", height: "100%" }}>
              <Bar data={resourceUtilizationData} options={resourceUtilizationChartOptions} />
            </Box>
          </Box>
        </ResultArea>
      </ContentInner>

      {simulationVersionPopupOpen && (<PopSimulationVersion open={simulationVersionPopupOpen} onClose={closeSimulationVersionPopup} confirm={onSetSimulationVersion} module={'MP'} />)}
      {resourcePopupOpen && (<PopCommResource open={resourcePopupOpen} onClose={closeResourcePopup} confirm={onSetResource} />)}
    </>
  )
}

export default ResUtilization;
