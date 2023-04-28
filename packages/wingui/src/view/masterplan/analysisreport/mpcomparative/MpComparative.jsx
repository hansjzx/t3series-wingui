import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import { BaseGrid, ContentInner, SearchArea, SearchRow, ButtonArea, CommonButton, LeftButtonArea, GridExcelExportButton, InputField, ResultArea, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import PopConfirmPlan from '@wingui/view/masterplan/common/PopConfirmPlan';
import PopMainVersion from './PopMainVersion';
import PopProcessStep from './PopProcessStep';

import { Chart as ChartJS, LinearScale, CategoryScale, BarElement, PointElement, LineElement, Title, Legend, Tooltip, LineController, BarController } from 'chart.js';
import { Chart, Bar } from 'react-chartjs-2';

ChartJS.register( LinearScale, CategoryScale, BarElement, PointElement, LineElement, Title, Legend, Tooltip, LineController, BarController );

const snrioPredLvChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    title: { display: true, text: transLangKey('SNRIO_PRED_LV'), font: { size: 15 } },
    legend: { position: 'bottom' }
  },
  scales: {
    y: {
      position: 'right',
      min: 0,
      title: { display: true, text: transLangKey('PREDICT_REVENUE') }
    },
    y1: {
      position: 'left',
      min: 0,
      grid: { drawOnChartArea: false, },
      title: { display: true, text: transLangKey('PREDICT_PROFIT') }
    }
  }
};

const avgEohPredMosChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    title: { display: true, text: transLangKey('AVG_EOH_PRED_MOS'), font: { size: 15 } },
    legend: { position: 'bottom' }
  },
  scales: {
    y: {
      position: 'right',
      title: { display: true, text: transLangKey('AVG_EOH') }
    },
    y1: {
      position: 'left',
      min: 0,
      grid: { drawOnChartArea: false, },
      title: { display: true, text: transLangKey('PRED_MOS') }
    }
  }
};

const opertnRateChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    title: { display: true, text: transLangKey('OPERTN_RATE'), font: { size: 15 } },
    legend: { position: 'bottom' }
  }
};

const orderDelivyChartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    title: { display: true, text: transLangKey('ORDER_DELIVY'), font: { size: 15 } },
    legend: { position: 'bottom' }
  },
  scales: {
    x: { stacked: true },
    y: {
      position: 'right',
      stacked: true,
      title: { display: true, text: transLangKey('QTY') }
    },
    y1: {
      position: 'left',
      min: 0,
      grid: { drawOnChartArea: false, },
      title: { display: true, text: transLangKey('RATIO') }
    }
  }
};

let gridMpComparativeColumns = [
  {
    name: "MAIN_SIMUL_VER", dataType: "group", orientation: "horizontal", headerText: "MAIN_SIMUL_VER", headerVisible: true, hideChildHeaders: false, expandable: false, expanded: false,
    childs: [
      { name: 'MAIN_VER_ID', dataType: 'text', headerText: 'MAIN_VER_ID', visible: true, editable: false, width: '150' },
      { name: 'MAIN_VER_DESCRIP', dataType: 'text', headerText: 'MAIN_VER_DESCRIP', visible: true, editable: false, width: '170' },
      { name: 'SIMUL_VER_ID', dataType: 'text', headerText: 'SIMULATION_VERSION', visible: true, editable: false, width: '170' },
      { name: 'SIMUL_VER_DESCRIP', dataType: 'text', headerText: 'DESCRIP', visible: true, editable: false, width: '150' }
    ]
  },
  {
    name: "PLANNING", dataType: "group", orientation: "horizontal", headerText: "PLANNING", headerVisible: true, hideChildHeaders: false, expandable: false, expanded: false,
    childs: [
      { name: 'ENGINE_EXE', dataType: 'boolean', headerText: 'ENGINE_RUN', visible: true, editable: false, width: '100' },
      { name: 'ENGINE_EXE_DTTM', dataType: 'datetime', headerText: 'ENGINE_RUN_DTTM', visible: true, editable: false, width: '150' },
      { name: 'PLAN_POLICY_VER_ID', dataType: 'text', headerText: 'PLAN_POLICY_VERSION', visible: true, editable: false, width: '120' },
      { name: 'PLAN_POLICY_DESCRIP', dataType: 'text', headerText: 'PLAN_POLICY_DESCRIP', visible: true, editable: false, width: '170' }
    ]
  },
  {
    name: "PLAN_RESULT", dataType: "group", orientation: "horizontal", headerText: "PLAN_RESULT", headerVisible: true, hideChildHeaders: false, expandable: false, expanded: false,
    childs: [
      { name: 'PREDICT_REVENUE', dataType: 'number', headerText: 'PREDICT_REVENUE', visible: true, editable: false, width: '100' },
      { name: 'PREDICT_COST', dataType: 'number', headerText: 'PREDICT_COST', visible: true, editable: false, width: '100' },
      { name: 'PREDICT_PROFIT', dataType: 'number', headerText: 'PREDICT_PROFIT', visible: true, editable: false, width: '100' },
      { name: 'AVG_EOH', dataType: 'number', headerText: 'AVG_EOH', visible: true, editable: false, width: '100' },
      { name: 'PREDICT_MOS', dataType: 'number', headerText: 'PREDICT_MOS', visible: true, editable: false, width: '100' },
      { name: 'AVG_STOCK_AMT', dataType: 'number', headerText: 'AVG_INV_AMT', visible: true, editable: false, width: '100' },
      { name: 'UTILIZATION', dataType: 'number', headerText: 'UTILIZATION', visible: true, editable: false, width: '100' },
      { name: 'DMND_QTY', dataType: 'number', headerText: 'DMND_QTY', visible: true, editable: false, width: '100' },
      { name: 'ON_TIME_QTY', dataType: 'number', headerText: 'ON_TIME_QTY', visible: true, editable: false, width: '100' },
      { name: 'LATE_QTY', dataType: 'number', headerText: 'LATE_QTY', visible: true, editable: false, width: '100' },
      { name: 'SHORTAGE_QTY', dataType: 'number', headerText: 'SHORTAGE_QTY', visible: true, editable: false, width: '100' },
      { name: 'ON_TIME_RATIO', dataType: 'number', headerText: 'ON_TIME_RATIO', visible: true, editable: false, width: '120' },
      { name: 'DELIVY_RATIO', dataType: 'number', headerText: 'DELIVY_RATIO', visible: true, editable: false, width: '120' }
    ]
  },
  {
    name: "PLAN_CONFIRM", dataType: "group", orientation: "horizontal", headerText: "PLAN_CONFIRM", headerVisible: true, hideChildHeaders: false, expandable: false, expanded: false,
    childs: [
      { name: 'CONFRM_YN', dataType: 'boolean', headerText: 'CONFRM_YN', visible: true, editable: false, width: '100' },
      { name: 'CONFRM_DTTM', dataType: 'datetime', headerText: 'CONFRM_DTTM', visible: true, editable: false, width: '150' },
      { name: 'CONFRM_EMP_ID', dataType: 'text', headerText: 'CONFRM_EMP_ID', visible: true, editable: false, width: '100' }
    ]
  }
];

function MpComparative() {
  const [gridMpComparative, setGridMpComparative] = useState(null);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const [confirmPlanPopupOpen, setConfirmPlanPopupOpen] = useState(false);
  const [mainVersionPopupOpen, setMainVersionPopupOpen] = useState(false);
  const [processStepPopupOpen, setProcessStepPopupOpen] = useState(false);


  const [simulVerId, setSimulVerId] = useState("");

  const [snrioPredLvData, setSnrioPredLvData] = useState({
    labels: [],
    datasets: []
  });

  const [avgEohPredMosData, setAvgEohPredMosData] = useState({
    labels: [],
    datasets: []
  });

  const [opertnRateLvData, setOpertnRateData] = useState({
    labels: [],
    datasets: []
  });

  const [orderDelivyData, setOrderDelivyData] = useState({
    labels: [],
    datasets: []
  });

  const { reset, getValues, setValue, control } = useForm({
    defaultValues: {
      moduleCd: 'MP',
      mainVersionId: '',
      mainVerDescrip: '',
      simulStep: '',
      processDescrip: '',
      compCount: ''
    }
  });

  const globalButtons = [
    { name: 'search', action: (e) => { onSubmit() }, visible: true, disable: false },
    { name: 'refresh', action: (e) => { refresh() }, visible: true, disable: false }
  ]

  const exportOptions = {
    headerDepth: 2,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  };

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, 'gridMpComparative');

    if (grdObj1) {
      if (grdObj1.dataProvider) {
        if (gridMpComparative !== grdObj1) {
          setGridMpComparative(grdObj1);
        }
      }
    }
  }, [viewData]);

  useEffect(() => {
    setViewInfo(vom.active, 'globalButtons', globalButtons);

    if (gridMpComparative) {
      loadRecentMainVersion();
      setOptionsGridMpComparative();
    }

  }, [gridMpComparative]);

  function setOptionsGridMpComparative() {
    setVisibleProps(gridMpComparative, true, false, true);

    gridMpComparative.gridView.setDisplayOptions({
      fitStyle: 'fill'
    });

    gridMpComparative.gridView.setCheckBar({
      exclusive: true
    });
  }

  function onSubmit() {
    loadMpComparative();
  };

  function refresh() {
    reset();

    loadRecentMainVersion();

    gridMpComparative.dataProvider.clearRows();

    setSnrioPredLvData({
      labels: [],
      datasets: []
    });

    setAvgEohPredMosData({
      labels: [],
      datasets: []
    });

    setOpertnRateData({
      labels: [],
      datasets: []
    });

    setOrderDelivyData({
      labels: [],
      datasets: []
    });
  }

  function loadRecentMainVersion() {
    let param = new URLSearchParams();

    param.append('MENU_ID', 'UI_MP_26');

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_COMM_DEFAULT_VER',
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        setValue('mainVersionId', res.data.RESULT_DATA[0].MAIN_VER_ID);
        setValue('mainVerDescrip', res.data.RESULT_DATA[0].MAIN_VER_DESCRIP);
        setValue('simulStep', res.data.RESULT_DATA[0].PROCESS_STEP);
        setValue('processDescrip', res.data.RESULT_DATA[0].PROCESS_DESCRIP);
      }
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      loadMpComparative();
    });
  }

  function openConfirmPlanPopup() {
    var rows = gridMpComparative.gridView.getCheckedRows(true);

    if (rows.length !== 0) {
      var row = gridMpComparative.dataProvider.getJsonRow(rows[0]);

      if (row.CONFRM_YN) {
        showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5115'), { close: false });
      } else {
        setSimulVerId(row.SIMUL_VER_ID);

        setConfirmPlanPopupOpen(true);
      }
    } else {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5114'), { close: false });
    }
  }

  function openMainVersionPopup() {
    setMainVersionPopupOpen(true);
  }

  function onSetMainVersion(gridRow) {
    setValue('mainVersionId', gridRow.MAIN_VER_ID);
    setValue('mainVerDescrip', gridRow.MAIN_VER_DESCRIP);
  }

  function openProcessStepPopup() {
    setProcessStepPopupOpen(true);
  }

  function onSetProcessStep(gridRow) {
    setValue('simulStep', gridRow.STEP);
    setValue('processDescrip', gridRow.PROCESS_DESCRIP);
  }

  function loadMpComparative() {
    let param = new URLSearchParams();

    param.append('MAIN_VERSION_ID', getValues('mainVersionId'));
    param.append('SIMUL_STEP', getValues('simulStep'));

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/GetMPComparativeAnalysis',
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        let dataArr = res.data.RESULT_DATA;

        gridMpComparative.setData(dataArr);

        let columnName = [];
        let snrioPredLvDatasets = [
          { type: 'bar', label: transLangKey('PREDICT_REVENUE'), borderColor: 'white', backgroundColor: '#0169A5', data: { } },
          { type: 'line', label: transLangKey('PREDICT_PROFIT'), borderColor: '#5DB2F3', borderWidth: 2, fill: false, yAxisID: 'y1', data: { } }
        ];
        let avgEohPredMosDatasets = [
          { type: 'bar', label: transLangKey('AVG_EOH'), borderColor: 'white', borderWidth: 2, backgroundColor: '#FF8E54', order: 1, data: { } },
          { type: 'line', label: transLangKey('PRED_MOS'), borderColor: '#B7BD59', borderWidth: 2, fill: false, yAxisID: 'y1', data: { } }
        ];
        let opertnRateDatasets = [
          { type: 'bar', label: transLangKey('OPERTN_RATE'), borderColor: 'white', borderWidth: 2, backgroundColor: '#8FBC00', data: { } }
        ];
        let orderDelivyDatasets = [
          { type: 'bar', label: transLangKey('ON_TIME_QTY'), borderColor: 'white', borderWidth: 2, backgroundColor: '#428BCA', order: 1, data: { } },
          { type: 'bar', label: transLangKey('LATE_QTY'), borderColor: 'white', borderWidth: 2, backgroundColor: '#5CC0DE', order: 1, data: { } },
          { type: 'bar', label: transLangKey('SHORTAGE_QTY'), borderColor: 'white', borderWidth: 2, backgroundColor: '#5DB85B', order: 1, data: { } },
          { type: 'line', label: transLangKey('ON_TIME_RATIO'), borderColor: '#F5C88B', borderWidth: 2, fill: false, yAxisID: 'y1', data: { } },
          { type: 'line', label: transLangKey('DELIVY_RATIO'), borderColor: '#EE9D7A', borderWidth: 2, fill: false, yAxisID: 'y1', data: { } }
        ];

        let snrioPredLvCols = ['PREDICT_REVENUE', 'PREDICT_PROFIT'];
        let avgEohPredMosCols = ['AVG_EOH', 'PREDICT_MOS'];
        let orderDelivyCols = ['ON_TIME_QTY', 'LATE_QTY', 'SHORTAGE_QTY', 'ON_TIME_RATIO', 'DELIVY_RATIO'];

        for (let i = 0; i < dataArr.length; i++) {
          columnName.push(dataArr[i].SIMUL_VER_SEQ);

          for (let j = 0; j < snrioPredLvCols.length; j++) {
            snrioPredLvDatasets[j].data[dataArr[i].SIMUL_VER_SEQ] = dataArr[i][snrioPredLvCols[j]];
          }

          for (let j = 0; j < avgEohPredMosCols.length; j++) {
            avgEohPredMosDatasets[j].data[dataArr[i].SIMUL_VER_SEQ] = dataArr[i][avgEohPredMosCols[j]];
          }

          opertnRateDatasets[0].data[dataArr[i].SIMUL_VER_SEQ] = dataArr[i].UTILIZATION;


          for (let j = 0; j < orderDelivyCols.length; j++) {
            orderDelivyDatasets[j].data[dataArr[i].SIMUL_VER_SEQ] = dataArr[i][orderDelivyCols[j]];
          }
        }

        setSnrioPredLvData({
          labels: columnName.sort(),
          datasets: snrioPredLvDatasets
        });

        setAvgEohPredMosData({
          labels: columnName.sort(),
          datasets: avgEohPredMosDatasets
        });

        setOpertnRateData({
          labels: columnName.sort(),
          datasets: opertnRateDatasets
        });

        setOrderDelivyData({
          labels: columnName.sort(),
          datasets: orderDelivyDatasets
        });
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <InputField name="moduleCd" label={transLangKey("MODULE_VAL")} control={control} style={{display: 'none'}} />
            <InputField type="action" name="mainVersionId" label={transLangKey("MAIN_VER")} control={control} onClick={() => { openMainVersionPopup() }} style={{ width: "210px" }} >
              <Icon.Search />
            </InputField>
            <InputField name="mainVerDescrip" label={transLangKey("DESCRIP")} control={control} readonly={true} />
            <InputField type="action" name="simulStep" label={transLangKey("STEP")} control={control} onClick={() => { openProcessStepPopup() }} >
              <Icon.Search />
            </InputField>
            <InputField name="processDescrip" label={transLangKey("DESCRIP")} control={control} />
            <InputField name="compCount" label={transLangKey("COMP_COUNT")} control={control} />
          </SearchRow>
        </SearchArea>
        <ButtonArea>
          <LeftButtonArea>
            <GridExcelExportButton type="icon" grid="gridMpComparative" options={exportOptions} />
            <CommonButton title={transLangKey('PLAN_CONFIRM')} onClick={() => { openConfirmPlanPopup() }}>
              <GavelIcon />
            </CommonButton>
          </LeftButtonArea>
        </ButtonArea>
        <ResultArea sizes={[33, 67]} direction={'vertical'}>
          <Box>
            <BaseGrid id="gridMpComparative" items={gridMpComparativeColumns} />
          </Box>
          <Box style={{ width: "100%", textAlign: "-webkit-center" }} >
            <Box style={{ width: "65%", height: "calc(50% - 40px)", marginTop: '8px' }}>
              <Box style={{ width: "calc(50% - 25px)", height: "100%", display: "inline-block", paddingRight: "25px" }}>
                <Chart data={snrioPredLvData} options={snrioPredLvChartOptions} />
              </Box>
              <Box style={{ width: "calc(50% - 25px)", height: "100%", display: "inline-block", paddingLeft: "25px" }}>
                <Chart data={avgEohPredMosData} options={avgEohPredMosChartOptions} />
              </Box>
            </Box>
            <Box style={{ width: "65%", height: "calc(50% - 40px)", marginTop: '40px' }}>
              <Box style={{ width: "calc(50% - 25px)", height: "100%", display: "inline-block", paddingRight: "25px" }}>
                <Chart data={opertnRateLvData} options={opertnRateChartOptions} />
              </Box>
              <Box style={{ width: "calc(50% - 25px)", height: "100%", display: "inline-block", paddingLeft: "25px" }}>
                <Bar data={orderDelivyData} options={orderDelivyChartOptions} />
              </Box>
            </Box>
          </Box>
{/*           <Box style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Box style={{ width: '70%', display: 'flex' }}>
              <Box style={{ width: '100%', height: '50%', marginTop: '8px', paddingRight: '50px' }}>
                <Chart data={snrioPredLvData} options={snrioPredLvChartOptions} />
                <Chart data={opertnRateLvData} options={opertnRateChartOptions} />
              </Box>
              <Box style={{ width: '100%', height: '50%', marginTop: '8px' }}>
                <Chart data={avgEohPredMosData} options={avgEohPredMosChartOptions} />
                <Bar data={orderDelivyData} options={orderDelivyChartOptions} />
              </Box>
            </Box>
          </Box> */}
        </ResultArea>
      </ContentInner>
      <PopConfirmPlan open={confirmPlanPopupOpen} onClose={() => { setConfirmPlanPopupOpen(false) }} confirm={onSubmit} param={simulVerId} />
      <PopMainVersion open={mainVersionPopupOpen} onClose={() => { setMainVersionPopupOpen(false) }} confirm={onSetMainVersion} moduleCd={"MP"} />
      <PopProcessStep open={processStepPopupOpen} onClose={() => { setProcessStepPopupOpen(false) }} confirm={onSetProcessStep} mainVerId={getValues('mainVersionId')} />
    </>
  )
}

export default MpComparative;
