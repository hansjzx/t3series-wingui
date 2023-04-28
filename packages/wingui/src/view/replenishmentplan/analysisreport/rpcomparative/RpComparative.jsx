import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import { BaseGrid, ContentInner, SearchArea, SearchRow, ButtonArea, LeftButtonArea,
  GridExcelExportButton, CommonButton, InputField, ResultArea, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import PopConfirmPlan from '@wingui/view/masterplan/common/PopConfirmPlan';
import PopMainVersion from '@wingui/view/masterplan/analysisreport/mpcomparative/PopMainVersion';
import PopProcessStep from '@wingui/view/masterplan/analysisreport/mpcomparative/PopProcessStep';

import { Chart as ChartJS, LinearScale, CategoryScale, BarElement, PointElement, LineElement, Title, Legend, Tooltip, LineController, BarController } from 'chart.js';
import { Chart, Bar, Bubble } from 'react-chartjs-2';

ChartJS.register( LinearScale, CategoryScale, BarElement, PointElement, LineElement, Title, Legend, Tooltip, LineController, BarController );

const snrioPredLvChartOptions = {
  plugins: {
    title: { display: true, text: transLangKey('SNRIO_PRED_LV'), font: { size: 15 } },
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: function(tooltipItem) {
          return tooltipItem.label + ": " + Math.round(Number(tooltipItem.parsed.y));
        }
      }
    }
  },
  scales: { y: { position: 'left', min: 0 } }
};

const fillRateChartOptions = {
  plugins: {
    title: { display: true, text: transLangKey('FILL_RATE'), font: { size: 15 } },
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: function(tooltipItem) {
          return Math.round(Number(tooltipItem.formattedValue)) + "%";
        }
      }
    }
  },
  scales: {
    y: { position: 'left', min: 0 }
  }
};

const totalCostChartOptions = {
  plugins: { title: { display: true, text: transLangKey('TOTAL_COST'), font: { size: 15 } }, legend: { position: 'bottom' } },
  responsive: true,
  y: { position: 'left', stacked: true }
};

const stockLvQtyAvgInvAmtChartOptions = {
  plugins: {
    title: { display: true, text: transLangKey('STOCK_LV_QTY_AVG_INV_AMT'), font: { size: 15 } },
    legend: { position: 'bottom' }
  },
  responsive: true,
  scales: {
    y: { position: 'left', min: 0, title: { display: true, text: transLangKey('QTY') } },
    y1: { position: 'right', min: 0, grid: { drawOnChartArea: false, }, title: { display: true, text: transLangKey('AMT') } }
  }
};

let gridRpComparativeColumns = [
  {
    name: "MAIN_SIMUL_VER", dataType: "group", orientation: "horizontal", headerText: "MAIN_SIMUL_VER", headerVisible: true, hideChildHeaders: false, expandable: false, expanded: false,
    childs: [
      { name: 'MAIN_VER_ID', dataType: 'text', headerText: 'MAIN_VER_ID', visible: true, editable: false, width: '150' },
      { name: 'MAIN_VER_DESCRIP', dataType: 'text', headerText: 'DESCRIP', visible: true, editable: false, width: '170' },
      { name: 'SIMUL_VER_ID', dataType: 'text', headerText: 'SIMUL_VER', visible: true, editable: false, width: '170' },
      { name: 'SIMUL_VER_DESCRIP', dataType: 'text', headerText: 'DESCRIP', visible: true, editable: false, width: '200' },
      { name: 'SIMUL_VER_SEQ', dataType: 'text', headerText: 'SIMUL_VER_SEQ', visible: false, editable: false, width: '100' }
    ]
  },
  {
    name: "PLANNING", dataType: "group", orientation: "horizontal", headerText: "PLANNING", headerVisible: true, hideChildHeaders: false, expandable: false, expanded: false,
    childs: [
      { name: 'ENGINE_EXE_YN', dataType: 'boolean', headerText: 'ENGINE_RUN', visible: false, editable: false, width: '100' },
      { name: 'ENGINE_EXE_DTTM', dataType: 'datetime', headerText: 'ENGINE_RUN_DTTM', visible: false, editable: false, width: '150' },
      { name: 'PLAN_POLICY_VER_ID', dataType: 'text', headerText: 'PLAN_POLICY_VERSION', visible: true, editable: false, width: '120' },
      { name: 'PLAN_POLICY_DESCRIP', dataType: 'text', headerText: 'PLAN_POLICY_DESCRIP', visible: true, editable: false, width: '170' },
      { name: 'STATUS', dataType: 'text', headerText: 'STATUS', visible: false, editable: false, width: '100' }
    ]
  },
  {
    name: "PLAN_TARGET", dataType: "group", orientation: "horizontal", headerText: "PLAN_TARGET", headerVisible: true, hideChildHeaders: false, expandable: false, expanded: false,
    childs: [
      { name: 'SVC_LV', dataType: 'number', headerText: 'SVC_LV', visible: true, editable: false, width: '100' },
      { name: 'OPERT_TARGET', dataType: 'number', headerText: 'OPERT_TARGET', visible: true, editable: false, width: '100' },
      { name: 'AVG_STOCK_QTY', dataType: 'number', headerText: 'TARGET_STOCK_QTY', visible: true, editable: false, width: '100' },
      { name: 'AVG_STOCK_AMT', dataType: 'number', headerText: 'TARGET_STOCK_AMT', visible: true, editable: false, width: '100' }
    ]
  },
  {
    name: "PLAN_RESULT", dataType: "group", orientation: "horizontal", headerText: "PLAN_RESULT", headerVisible: true, hideChildHeaders: false, expandable: false, expanded: false,
    childs: [
      { name: 'RST_FILL_RATE', dataType: 'number', headerText: 'FILL_RATE', visible: true, editable: false, width: '100' },
      { name: 'RST_BACK_ORD', dataType: 'number', headerText: 'BACK_ORD', visible: true, editable: false, width: '100' },
      { name: 'RST_PREDICT_LV', dataType: 'number', headerText: 'PREDICT_LV', visible: true, editable: false, width: '100' },
      { name: 'RST_AVG_STOCK_QTY', dataType: 'number', headerText: 'STOCK_LV_QTY', visible: true, editable: false, width: '100' },
      { name: 'RST_AVG_STOCK_AMT', dataType: 'number', headerText: 'AVG_INV_AMT', visible: true, editable: false, width: '100' },
      { name: 'RST_KEEPING_COST', dataType: 'number', headerText: 'STOCK_KEEPING_COST', visible: true, editable: false, width: '100' },
      { name: 'RST_ORDER_COST', dataType: 'number', headerText: 'ORDER_COST', visible: true, editable: false, width: '100' },
      { name: 'RST_TRANSP_COST', dataType: 'number', headerText: 'TRANSPORT_COST', visible: true, editable: false, width: '100' },
      { name: 'RST_TOTAL_COST', dataType: 'number', headerText: 'TOTAL_COST', visible: true, editable: false, width: '100' }
    ]
  },
  {
    name: "PLAN_CONFIRM", dataType: "group", orientation: "horizontal", headerText: "PLAN_CONFIRM", headerVisible: true, hideChildHeaders: false, expandable: false, expanded: false,
    childs: [
      { name: 'CONFRM_YN', dataType: 'boolean', headerText: 'CONFRM_YN', visible: true, editable: false, width: '100' },
      { name: 'CONFRM_DTTM', dataType: 'datetime', headerText: 'CONFRM_DTTM', visible: true, editable: false, width: '150' }
    ]
  }
];

function RpComparative() {
  const [gridRpComparative, setGridRpComparative] = useState(null);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const [confirmPlanPopupOpen, setConfirmPlanPopupOpen] = useState(false);
  const [mainVersionPopupOpen, setMainVersionPopupOpen] = useState(false);
  const [processStepPopupOpen, setProcessStepPopupOpen] = useState(false);

  const [simulVerId, setSimulVerId] = useState("");

  const [snrioPredLvData, setSnrioPredLvData] = useState({
    labels: [],
    datasets: []
  });

  const [fillRateData, setFillRateData] = useState({
    labels: [],
    datasets: []
  });

  const [totalCostData, setTotalCostData] = useState({
    labels: [],
    datasets: []
  });

  const [stockLvQtyAvgInvAmtData, setStockLvQtyAvgInvAmtData] = useState({
    labels: [],
    datasets: []
  });

  const { reset, getValues, setValue, control } = useForm({
    defaultValues: {
      moduleCd: 'RP',
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
    const grdObj1 = getViewInfo(vom.active, 'gridRpComparative');

    if (grdObj1) {
      if (grdObj1.dataProvider) {
        if (gridRpComparative !== grdObj1) {
          setGridRpComparative(grdObj1);
        }
      }
    }
  }, [viewData]);

  useEffect(() => {
    setViewInfo(vom.active, 'globalButtons', globalButtons);

    if (gridRpComparative) {
      loadRecentMainVersion();
      setOptionsGridRpComparative();
    }

  }, [gridRpComparative]);

  function setOptionsGridRpComparative() {
    setVisibleProps(gridRpComparative, true, false, true);

    gridRpComparative.gridView.setDisplayOptions({
      fitStyle: 'fill'
    });

    gridRpComparative.gridView.setCheckBar({
      exclusive: true
    });
  }

  function onSubmit() {
    loadRpComparative();
  };

  function refresh() {
    reset();

    loadRecentMainVersion();

    gridRpComparative.dataProvider.clearRows();

    setSnrioPredLvData({
      labels: [],
      datasets: []
    });

    setFillRateData({
      labels: [],
      datasets: []
    });

    setTotalCostData({
      labels: [],
      datasets: []
    });

    setStockLvQtyAvgInvAmtData({
      labels: [],
      datasets: []
    });
  }

  function loadRecentMainVersion() {
    let param = new URLSearchParams();

    param.append('MENU_ID', 'UI_RP_14');

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
      loadRpComparative();
    });
  }

  function openConfirmPlanPopup() {
    var rows = gridRpComparative.gridView.getCheckedRows(true);

    if (rows.length !== 0) {
      var row = gridRpComparative.dataProvider.getJsonRow(rows[0]);

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

  function loadRpComparative() {
    let param = new URLSearchParams();

    param.append('MAIN_VERSION_ID', getValues('mainVersionId'));
    param.append('SIMUL_STEP', getValues('simulStep'));

    if (getValues('compCount') !== '') {
      param.append('COMP_NUM', getValues('compCount'));
    }

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/GetRPComparativeAnalysis',
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        let dataArr = res.data.RESULT_DATA;

        gridRpComparative.setData(dataArr);

        let columnName = [];
        let snrioPredLvDatasets = [ ];
        let fillRateDatasets = [
          { type: 'bar', borderColor: 'white', borderWidth: 2, backgroundColor: '#FF7931', order: 1, data: { } },
        ];
        let totalCostDatasets = [
          { type: 'bar', label: transLangKey('RST_ORDER_COST'), stack: "stack1", borderColor: 'white', borderWidth: 2, backgroundColor: '#0169A5', order: 1, data: { } },
          { type: 'bar', label: transLangKey('RST_KEEPING_COST'), stack: 'stack1', borderColor: 'white', borderWidth: 2, backgroundColor: '#0098EE', order: 1, data: { } },
          { type: 'line', label: transLangKey('RST_TRANSP_COST'), stack: 'stack2', borderColor: '#7BD2F6', borderWidth: 2, fill: false, data: { } },
          { type: 'line', label: transLangKey('RST_TOTAL_COST'), stack: 'stack3', borderColor: '#FFB800', borderWidth: 2, fill: false, data: { } }
        ];
        let stockLvQtyAvgInvAmtDatasets = [
          { type: 'bar', label: transLangKey('RST_AVG_STOCK_QTY'), borderColor: 'white', borderWidth: 2, backgroundColor: '#8EBC00', order: 1, data: { } },
          { type: 'line', label: transLangKey('RST_AVG_STOCK_AMT'), borderColor: '#309B46', borderWidth: 2, fill: false, yAxisID: 'y1', data: { } }
        ];

        let totalCostCols = ['RST_ORDER_COST', 'RST_KEEPING_COST', 'RST_TRANSP_COST', 'RST_TOTAL_COST'];
        let stockLvQtyAvgInvAmtCols = ['RST_AVG_STOCK_QTY', 'RST_AVG_STOCK_AMT'];

        for (let i = 0; i < dataArr.length; i++) {
          columnName.push(dataArr[i].SIMUL_VER_SEQ);

          snrioPredLvDatasets.push({
            label: dataArr[i].SIMUL_VER_ID, borderColor: 'white', backgroundColor: '#0169A5',
            data: [{
              x: dataArr[i].OPERT_TARGET,
              y: dataArr[i].RST_PREDICT_LV,
              r: 25
            }]
          });

          fillRateDatasets[0].data[dataArr[i].SIMUL_VER_SEQ] = dataArr[i].RST_FILL_RATE;

          for (let j = 0; j < totalCostCols.length; j++) {
            totalCostDatasets[j].data[dataArr[i].SIMUL_VER_SEQ] = dataArr[i][totalCostCols[j]];
          }

          for (let j = 0; j < stockLvQtyAvgInvAmtCols.length; j++) {
            stockLvQtyAvgInvAmtDatasets[j].data[dataArr[i].SIMUL_VER_SEQ] = dataArr[i][stockLvQtyAvgInvAmtCols[j]];
          }
        }

        setSnrioPredLvData({
          labels: columnName.sort(),
          datasets: snrioPredLvDatasets
        });

        setFillRateData({
          labels: columnName.sort(),
          datasets: fillRateDatasets
        });

        setTotalCostData({
          labels: columnName.sort(),
          datasets: totalCostDatasets
        });

        setStockLvQtyAvgInvAmtData({
          labels: columnName.sort(),
          datasets: stockLvQtyAvgInvAmtDatasets
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
            <InputField name="mainVerDescrip" label={transLangKey("DESCRIP")} control={control} />
            <InputField type="action" name="simulStep" label={transLangKey("STEP")} control={control} onClick={() => { openProcessStepPopup() }} >
              <Icon.Search />
            </InputField>
            <InputField name="processDescrip" label={transLangKey("DESCRIP")} control={control} style={{ width: "250px", minWidth: "250px" }} />
            <InputField dataType="number" name="compCount" label={transLangKey("COMP_COUNT")} control={control} min={0} />
          </SearchRow>
        </SearchArea>
        <ButtonArea>
          <LeftButtonArea>
            <GridExcelExportButton type="icon" grid="gridRpComparative" options={exportOptions} />
            <CommonButton title={transLangKey('PLAN_CONFIRM')} onClick={() => { openConfirmPlanPopup() }}>
              <GavelIcon />
            </CommonButton>
          </LeftButtonArea>
        </ButtonArea>
        <ResultArea sizes={[25, 75]} direction={'vertical'}>
          <Box>
           <BaseGrid id="gridRpComparative" items={gridRpComparativeColumns} />
          </Box>
          <Box style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <Box style={{ width: '70%', display: 'flex' }}>
              <Box style={{ width: '100%', marginTop: '8px' }}>
                <Bubble data={snrioPredLvData} options={snrioPredLvChartOptions} />
                <Bar data={totalCostData} options={totalCostChartOptions} />
              </Box>
              <Box style={{ width: '100%', marginTop: '8px' }}>
                <Chart data={fillRateData} options={fillRateChartOptions} />
                <Chart data={stockLvQtyAvgInvAmtData} options={stockLvQtyAvgInvAmtChartOptions} />
              </Box>
            </Box>
          </Box>
        </ResultArea>
      </ContentInner>
      <PopConfirmPlan open={confirmPlanPopupOpen} onClose={() => { setConfirmPlanPopupOpen(false) }} confirm={onSubmit} param={simulVerId} />
      <PopMainVersion open={mainVersionPopupOpen} onClose={() => { setMainVersionPopupOpen(false) }} confirm={onSetMainVersion} moduleCd={"RP"} />
      <PopProcessStep open={processStepPopupOpen} onClose={() => { setProcessStepPopupOpen(false) }} confirm={onSetProcessStep} mainVerId={getValues('mainVersionId')} />
    </>
  )
}

export default RpComparative;
