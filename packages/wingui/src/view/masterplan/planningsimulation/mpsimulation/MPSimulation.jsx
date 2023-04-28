import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useHistory } from "react-router-dom";
import { Box, Grid, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Button, TextField, MenuItem } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import RefreshIcon from '@mui/icons-material/Refresh';
import { makeStyles } from '@mui/styles';
import { useContentStore } from '@zionex/wingui-core/src/store/contentStore'
import { BaseGrid, CommonButton, ContentInner, ResultArea, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';
import Details from '@wingui/view/factoryplan/common/component/DetailCard';
import '@wingui/view/factoryplan/simulation/simulation/simulation.css';
import { fpCommonStyles } from '@wingui/view/factoryplan/common/common';
import './MPSimulation.css';

import PopMainVersion from '@wingui/view/masterplan/analysisreport/mpcomparative/PopMainVersion';
import PopGeneralConfig from '@wingui/view/supplychainmodel/generalconfig/PopGeneralConfig';
import PopMPSimulation from './PopMPSimulation';

let gridSimulationStepColumns = [
  { name: 'PLAN_SNRIO_MGMT_MST_ID', headerText: 'PLAN_SNRIO_MGMT_MST_ID', dataType: 'text', width: '100', visible: false, editable: false },
  { name: 'PLAN_SNRIO_MGMT_DTL_ID', headerText: 'PLAN_SNRIO_MGMT_DTL_ID', dataType: 'text', width: '100', visible: false, editable: false },
  { name: 'PROC_NM', headerText: 'PROC_NM', dataType: 'text', visible: false },
  { name: 'STEP', headerText: 'STEP', dataType: 'number', width: '60', editable: false },
  { name: 'PROCESS_TP_ID', headerText: 'PROCESS_TP_ID', dataType: 'text', width: '100', visible: false, editable: false },
  { name: 'PROCESS_TP', headerText: 'PROCESS_TP', dataType: 'text', width: '110', visible: false, editable: false },
  { name: 'PROCESS_DESCRIP', headerText: 'PROCESS_DESCRIP', dataType: 'text', width: '180', editable: false },
  { name: 'PROCESS_TP_NM', headerText: 'PROCESS_TP', dataType: 'text', width: '110', visible: false, editable: false },
  { name: 'STEP_STATUS_ID', headerText: 'STEP_STATUS_ID', dataType: 'text', width: '100', visible: false, editable: false },
  { name: 'STEP_STATUS_NM', headerText: 'STEP_STATUS_NM', dataType: 'text', width: '120', editable: false,
    renderer: {
      type: "html",
      callback: function (grid, cell) {
        let background, iconClass;

        if (cell.value === 'Ready') {
          background = '#7f7f7f'; iconClass = 'fa-pause';
        } else if (cell.value === 'Running') {
          background = 'orange'; iconClass = 'fa-refresh fa-spin';
        } else if (cell.value === 'Complete') {
          background = '#5bda5b'; iconClass = 'fa-check';
        } else if (cell.value === 'Error') {
          background = '#f84a4a'; iconClass = 'fa-times';
        }

        return `<div class="status-icon-box" style="background: ${background};">
                    <i class="fa ${iconClass} status-icon"></i>
                </div>
                <span class="status-icon-text">${transLangKey(cell.value ? cell.value : '')}</span>`;
      }
    }
  },
  { name: 'ACTION', headerText: 'FP_ACTION', dataType: 'text', width: '130', editable: false, renderer: "executeButton" },
  { name: 'MAX_SIMUL_VER_ID', headerText: 'MAX_SIMUL_VER_ID', dataType: 'text', width: '150', editable: false },
  { name: 'CONFRM_MTD_ID', headerText: 'CONFRM_METHD_NM', dataType: 'text', width: '100', visible: false, editable: false },
  { name: 'CONFRM_MTD_NM', headerText: 'CONFRM_METHD', dataType: 'text', width: '100', visible: false, editable: false },
  { name: 'PLAN_POLICY_MGMT_ID', headerText: 'PLAN_POLICY_MGMT_ID', dataType: 'text', width: '100', visible: false, editable: false },
  { name: 'PLAN_POLICY_VER_ID', headerText: 'PLAN_POLICY_VERSION', dataType: 'text', width: '120', visible: false, editable: false },
  { name: 'PLAN_POLICY_VER_DESCRIP', headerText: 'DESCRIP', dataType: 'text', width: '180', visible: false, editable: false },
  { name: 'PLAN_POLICY_TYPE', headerText: 'PLAN_POLICY_TYPE', dataType: 'text', width: '100', visible: false },
  { name: 'EXE_STATUS_ID', headerText: 'EXE_STATUS_ID', dataType: 'text', width: '100', visible: false, editable: false },
  { name: 'EXE_STATUS_NM', headerText: 'EXE_STATUS_NM', dataType: 'text', width: '80', visible: false, editable: false },
  { name: 'UI_ID', headerText: 'UI_ID', dataType: 'text', width: '100', visible: false, editable: false },
  { name: 'LOAD_STRT_DTTM', headerText: 'LOAD_STRT_DTTM', dataType: 'datetime', width: '140', visible: false, editable: false },
  { name: 'LOAD_END_DTTM', headerText: 'LOAD_END_DTTM', dataType: 'datetime', width: '140', visible: false, editable: false },
  { name: 'PLAN_STRT_DTTM', headerText: 'PLAN_STRT_DTTM', dataType: 'datetime', width: '140', visible: false, editable: false },
  { name: 'PLAN_END_DTTM', headerText: 'PLAN_END_DTTM', dataType: 'datetime', width: '140', visible: false, editable: false },
  { name: 'STRT_DTTM', headerText: 'STRT_DTTM', dataType: 'datetime', width: '140', editable: false },
  { name: 'END_DTTM', headerText: 'END_DTTM', dataType: 'datetime', width: '140', editable: false },
  { name: 'ING_DTTM', headerText: 'ING_DTTM', dataType: 'text', width: '120', editable: false },
  { name: 'SNRIO_CNT', headerText: 'SNRIO_CNT', dataType: 'number', width: '100', visible: false, editable: false },
  { name: 'CONBD_MAIN_VER_DTL_ID', headerText: 'CONBD_MAIN_VER_DTL_ID', dataType: 'text', width: '100', visible: false, editable: false },
  { name: 'CONBD_MAIN_VER_MST_ID', headerText: 'CONBD_MAIN_VER_MST_ID', dataType: 'text', width: '100', visible: false, editable: false },
  { name: 'UI_NM_01', headerText: 'UI_LINK', dataType: 'text', width: '120', visible: true, editable: false, styleName: "text-column link-column" },
  { name: 'URL_01', headerText: 'URL_01', dataType: 'text', width: '100', visible: false }
]

const linkColumns = ['UI_NM_01', 'UI_NM_02', 'UI_NM_03', 'UI_NM_04', 'UI_NM_05'];

let gridSimulationHistoryColumns = [
  { name: 'MODULE_ID', headerText: 'MODULE_ID', dataType: 'text', width: '100', visible: false, editable: false },
  { name: 'MODULE_NM', headerText: 'MODULE_VAL', dataType: 'text', width: '120', visible: false, editable: false },
  { name: 'VER_DATE', headerText: 'VER_DATE', dataType: 'datetime', width: '140', visible: false, editable: false },
  { name: 'MAIN_VER_ID', headerText: 'MAIN_VER_ID', dataType: 'text', width: '120', editable: false },
  { name: 'SNRIO_VER_ID', headerText: 'SCENARIO_VER_ID', dataType: 'text', width: '110', visible: false, editable: false },
  { name: 'STEP', headerText: 'STEP', dataType: 'number', width: '60', visible: false, editable: false },
  { name: 'SIMUL_VER_ID', headerText: 'SIMULATION_VERSION', dataType: 'text', width: '150', editable: false },
  { name: 'SIMUL_VER_DESCRIP', headerText: 'SIMULATION_VERSION_DESCRIP', dataType: 'text', width: '180', editable: false },
  { name: 'PROCESS_TP_ID', headerText: 'PROCESS_TP', dataType: 'text', width: '100', visible: false, editable: false },
  { name: 'PROCESS_TP_NM', headerText: 'PROCESS_TP', dataType: 'text', width: '110', visible: false, editable: false },
  { name: 'PROCESS_DESCRIP', headerText: 'PROCESS_DESCRIP', dataType: 'text', width: '180', visible: false, editable: false },
  { name: 'PLAN_POLICY_VER_ID', headerText: 'PLAN_POLICY_VERSION', dataType: 'text', width: '120', visible: false, editable: false },
  { name: 'PLAN_POLICY_DESCRIP', headerText: 'PLAN_POLICY_DESCRIP', dataType: 'text', width: '180', editable: false },
  { name: 'REFER_SIMUL_VER_ID', headerText: 'REFERENCE_VERSION', dataType: 'text', width: '120', visible: false, editable: false },
  {
    name: 'CONFIRM', dataType: 'group', orientation: 'horizontal', headerText: 'CONFIRM', expandable: true, expanded: false,
    childs: [
      { name: 'CONFRM_YN', headerText: 'CONFIRM', dataType: 'boolean', width: '60', editable: false, groupShowMode: 'always',
        renderer: {
          type: "html",
          callback: function (grid, cell) {
            let background, iconClass;

            if (cell.value) {
              background = '#5bda5b'; iconClass = 'fa-check';
            }

            return `<div class="status-icon-box" style="background: ${background};">
                        <i class="fa ${iconClass} status-icon"></i>
                    </div>`;
          }
        }
      },
      { name: 'CONFRM_DTTM', headerText: 'CONFRM_DTTM', dataType: 'datetime', width: '140', editable: false, groupShowMode: 'expand' },
      { name: 'CONFRM_EMP_ID', headerText: 'CONFRM_EMP_ID', dataType: 'text', width: '100', editable: false, groupShowMode: 'always' }
    ]
  },
  {
    name: 'PLANNING', dataType: 'group', orientation: 'horizontal', headerText: 'PLANNING', expandable: true, expanded: false,
    childs: [
      { name: 'LOAD_STRT_DTTM', headerText: 'LOAD_STRT_DTTM', dataType: 'datetime', width: '140', editable: false, groupShowMode: 'expand' },
      { name: 'LOAD_END_DTTM', headerText: 'LOAD_END_DTTM', dataType: 'datetime', width: '140', editable: false, groupShowMode: 'expand' },
      { name: 'PLAN_STRT_DTTM', headerText: 'PLAN_STRT_DTTM', dataType: 'datetime', width: '140', editable: false, groupShowMode: 'expand' },
      { name: 'PLAN_END_DTTM', headerText: 'PLAN_END_DTTM', dataType: 'datetime', width: '140', editable: false, groupShowMode: 'expand' },
      { name: 'STRT_DTTM', headerText: 'STRT_DTTM', dataType: 'datetime', width: '140', editable: false, groupShowMode: 'always' },
      { name: 'END_DTTM', headerText: 'END_DTTM', dataType: 'datetime', width: '140', editable: false, groupShowMode: 'always' },
      { name: 'ING_DTTM', headerText: 'ING_DTTM', dataType: 'text', width: '120', editable: false, groupShowMode: 'always' },
      { name: 'EXE_USER', headerText: 'EXE_USER', dataType: 'text', width: '100', editable: false, groupShowMode: 'always' }
    ]
  },
  { name: 'ERR', headerText: 'ERR', dataType: 'text', width: '150', editable: false }
]

const useSimulationStyles = makeStyles({
  readOnlyInput: {
    '&:after': {
      borderBottom: 'none'
    },
    '&:hover:before': {
      borderBottom: '1px solid rgba(0, 0, 0, 0.42) !important'
    },
    '& svg': {
      color: 'rgba(0, 0, 0, 0.26)'
    },
    '& .MuiInput-input': {
      cursor: 'text',
      '&:focus': {
        backgroundColor: 'initial'
      }
    }
  },
  dateInput: {
    '&.Mui-disabled': {
      paddingRight: '46.3px'
    }
  },
  input: {
    '& ::placeholder': {
      fontStyle: 'italic'
    }
  },
  table: {
    '& .MuiTableRow-root': {
      height: '52.8px',
      '& td': {
        padding: '0.1rem',
        borderBottom: '1px solid rgb(236 236 236)',
      },
      '& td:first-of-type': {
        width: '28%',
        paddingLeft: '1.2rem',
        '& div': {
          display: 'flex',
          alignItems: 'center',
          '& div': {
            width: '3px',
            height: '3px',
            borderRadius: '50%',
            marginRight: '1rem',
            backgroundColor: 'rgb(95, 116, 141)'
          },
          '& span': {
            fontWeight: 'bold',
            fontSize: 15
          }
        }
      },
      '& td:last-of-type': {
        paddingRight: '1rem'
      }
    }
  },
  helperText: {
    fontSize: '12px',
    marginTop: '3px',
    lineHeight: 1
  }
});

function MPSimulation(props) {
  const [username] = useUserStore(state => [state.username]);
  const languageCode = useContentStore(state => state.languageCode);
  const classes = useSimulationStyles();
  const history = useHistory();

  const [gridSimulationStep, setGridSimulationStep] = useState(null);
  const [gridSimulationHistory, setGridSimulationHistory] = useState(null);

  const [versionCreating, setVersionCreating] = useState(false);
  const [lastMainVersion, setLastMainVersion] = useState('');

  const [scenarioOptions, setScenarioOptions] = useState([]);
  const [demandPlanVersionOptions, setDemandPlanVersionOptions] = useState([]);

  const [mainVersionPopupOpen, setMainVersionPopupOpen] = useState(false);
  const [planHorizonPopupOpen, setPlanHorizonPopupOpen] = useState(false);
  const [simulationPopupOpen, setSimulationPopupOpen] = useState(false);

  const [popupData, setPopupData] = useState({});

  const module = props.module ? props.module : 'MP';

  const { reset, getValues, setValue, watch, control } = useForm({
    defaultValues: {
      moduleId: '',
      mainVersionId: '',
      mainVersion: '',
      mainVersionDescription: '',
      scenarioVersionId: '',
      scenarioVersion: '',
      scenarioDescription: '',
      startDate: '',
      endDate: '',
      timeBucket: '',
      demandPlanVersionId: '',
      demandPlanVersion: '',
      demandVersionCheck: ''
    }
  });

  const createVersionAction = (
    <CommonButton title={transLangKey('SEARCH')} onClick={openMainVersionPopup} style={{ display: versionCreating ?  "none" : "block", margin: 0 }}>
      <Icon.Search />
    </CommonButton>
  )

  const footerAction = (
    <>
      <Button variant='outlined' sx={fpCommonStyles.roundButton} startIcon={versionCreating ? <CancelIcon color='primary' /> : <AddIcon color='primary' />} onClick={versionCreating ? cancelNewVersion : createNewVersion}>{versionCreating ? transLangKey('CANCEL') : transLangKey('FP_MAIN_VERSION_CREATION')}</Button>
      <Button variant='contained' sx={{ ...fpCommonStyles.primaryButton, ml: 'auto !important', width: 130 }} disabled={!versionCreating} onClick={saveNewVersion}>{transLangKey('SAVE')}</Button>
    </>
  );

  const versionHistoryAction = (
    <CommonButton title={transLangKey('SEARCH')} onClick={loadSimulationHistory} style={{ margin: 0 }}>
      <RefreshIcon sx={{ fontSize: "1.5rem" }} />
    </CommonButton>
  )

  useEffect(() => {
    async function initLoad() {
      await loadModuleId();
      await loadScenarioVersionOptions();
      await loadRecentVersion(false);
      loadSimulationStep();
      loadSimulationHistory();
    }

    if (gridSimulationStep && gridSimulationHistory) {
      initLoad();
    }
  }, [gridSimulationStep, gridSimulationHistory]);

  useEffect(() => {
    if (gridSimulationStep) {
      const gridView = gridSimulationStep.gridView;

      gridView.registerCustomRenderer("executeButton", {
        initContent: function (parent) {
          const grid = this.grid.handler;
          const index = this.index.toProxy();
          const processType = grid.getValue(index.itemIndex, 'PROCESS_TP');

          let execButton = document.createElement('button');
          execButton.type = 'button';
          execButton.innerText = transLangKey('EXEC');
          execButton.className = 'grid-btn exec-btn';
          let optionButton = document.createElement('button');
          optionButton.type = 'button';
          optionButton.innerText = transLangKey('FP_OPTION');
          optionButton.className = 'grid-btn option-btn';
          parent.appendChild(this._execButton = execButton);

          if (processType === 'SPROC_03' || processType === 'SPROC_05') {
            parent.appendChild(this._optionButton = optionButton);
          }
        },
        canClick: function () {
          return true;
        },
        clearContent: function (parent) {
          parent.innerHTML = '';
        },
        render : function (grid, model) {

        },
        click: function (event) {
          const grid = this.grid.handler;
          const index = this.index.toProxy();
          event.preventDefault;
          const row = grid.getValues(index.itemIndex);
          if (event.target === this._execButton) {
            setPopupData(row);
            openSimulationPopup();
          } else if (event.target === this._optionButton) {
            let pathName = module === 'MP' ? '/masterplan/mpsimulation/planpolicy' : '/replenishmentplan/planningsimulation/planpolicy';
            let params = {};

            params['module'] = getValues('moduleId');
            params['moduleCode'] = module;
            params['planPolicy'] = row;

            history.push({ pathname: pathName, state: { params: params } });
          }
        }
      });
      gridView.setColumnProperty("ACTION", "renderer", "executeButton");
    }
  }, [gridSimulationStep]);

  useEffect(() => {
    if (getValues('scenarioVersionId') && getValues('scenarioVersionId') !== '' && scenarioOptions.length > 0) {
      if (versionCreating) {
        setValue('demandPlanVersionId', '');
      }

      loadDemandPlanOptions();
      loadPlanHorizon();
    }
  }, [watch('scenarioVersionId')]);

  function loadModuleId() {
    let param = new FormData();

    param.append('Q_TYPE', 'MODULE');

    return zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_CM_17_Q1',
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        let result = res.data.RESULT_DATA;

        if (result.length > 0) {
          setValue('moduleId', result.filter(data => data.COMN_CD === module)[0].ID);
        }
      }
    });
  }

  async function loadRecentVersion(saving) {
    let param = new FormData();

    param.append('Q_TYPE', 'MAIN_INFO');
    param.append('MODULE_ID', getValues('moduleId'));
    param.append('SNRIO_VER_ID', '');

    await zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_CM_17_Q1',
      data: param
    })
    .then(async function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        let result = res.data.RESULT_DATA;

        await loadDemandPlanOptions(result.filter(data => data.CONTROL_ITEM === 'PLAN_SNRIO_MGMT_MST_ID')[0].VAL);

        if (saving && getValues('mainVersion') !== result.filter(data => data.CONTROL_ITEM === 'MAIN_VER_ID')[0].VAL) {
          let message = transLangKey('FP_MSG_SUCCESS_CREATE_VERSION_DUPLICATE').replace('%s', getValues('mainVersion')).replace('%s', result.filter(data => data.CONTROL_ITEM === 'MAIN_VER_ID')[0].VAL);
          showMessage(transLangKey('MSG_CONFIRM'), message, { close: false });
        }

        setValue('mainVersionId', result.filter(data => data.CONTROL_ITEM === 'ID')[0].VAL);
        setValue('mainVersion', result.filter(data => data.CONTROL_ITEM === 'MAIN_VER_ID')[0].VAL);
        setValue('mainVersionDescription', result.filter(data => data.CONTROL_ITEM === 'DESCRIP')[0].VAL);
        setValue('scenarioVersionId', result.filter(data => data.CONTROL_ITEM === 'PLAN_SNRIO_MGMT_MST_ID')[0].VAL);
        setValue('scenarioVersion', result.filter(data => data.CONTROL_ITEM === 'PLAN_SNRIO_MGMT_VER')[0].VAL);
        setValue('scenarioDescription', result.filter(data => data.CONTROL_ITEM === 'PLAN_SNRIO_MGMT_MST_DESCP')[0].VAL);
        setValue('startDate', result.filter(data => data.CONTROL_ITEM === 'PLAN_HORIZ_STRT')[0].VAL);
        setValue('endDate', result.filter(data => data.CONTROL_ITEM === 'PLAN_HORIZ_END')[0].VAL);
        setValue('timeBucket', result.filter(data => data.CONTROL_ITEM === 'TIME_BUKT')[0].VAL);
        setValue('demandPlanVersionId', result.filter(data => data.CONTROL_ITEM === 'DMND_VER_ID')[0].VAL);
        setValue('demandPlanVersion', result.filter(data => data.CONTROL_ITEM === 'DMND_VER')[0].VAL);
        setValue('demandVersionCheck', result.filter(data => data.CONTROL_ITEM === 'DMND_VER_CHK')[0].VAL);

        setLastMainVersion(result.filter(data => data.CONTROL_ITEM === 'MAIN_VER_ID')[0].VAL);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  async function loadScenarioVersionOptions() {
    let param = new FormData();

    param.append('Q_TYPE', 'SNRIO_VER');
    param.append('MODULE_ID', getValues('moduleId'));

    await zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_CM_17_Q1',
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        setScenarioOptions(res.data.RESULT_DATA.map(data => ({ value: data.ID, label: data.DESCRIP, versionId: data.SNRIO_VER_ID })));
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  async function loadDemandPlanOptions(scenarioVersionId) {
    let param = new FormData();

    param.append('SNRIO_MST_ID', scenarioVersionId ? scenarioVersionId : getValues('scenarioVersionId'));
    param.append('PLAN_TP_ID', '');
    param.append('CL_YN', true);
    param.append('DMND_MODULE_ID', getValues('moduleId'));

    await zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_COMM_SRH_DMND_VER',
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        setDemandPlanVersionOptions(res.data.RESULT_DATA.filter(data => data.ID !== null).map(data => ({ value: data.ID, label: data.VER_ID })));
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function loadPlanHorizon() {
    let param = new FormData();

    param.append('PLAN_SNRIO_MGMT_MST_ID', getValues('scenarioVersionId'));

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_CM_17_Q8',
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        setValue('startDate', res.data.RESULT_DATA[0].STRT_DATE);
        setValue('endDate', res.data.RESULT_DATA[0].END_DATE);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function afterGridSimulationStep(gridObj) {
    setGridSimulationStep(gridObj);
    setGridSimulationStepOptions(gridObj);
  }

  function setGridSimulationStepOptions(gridObj) {
    gridObj.gridView.filteringOptions.automating.lookupDisplay = true;
    gridObj.gridView.setEditOptions({
      insertable: true,
      appendable: true,
      scrollOnEditing: 'commit'
    });

    gridObj.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridObj, false, false, false);
    gridObj.gridView.setFooters({ visible: false });

    gridObj.gridView.onCellClicked = function (grid, clickData) {
      if (clickData.cellType === 'data' &&linkColumns.includes(clickData.column)) {
        if (grid.getValue(clickData.itemIndex, 'URL_01') && grid.getValue(clickData.itemIndex, 'URL_01') !== '') {
          let pathName = ''
          let params = {};

          params['simulationVersion'] = grid.getValue(clickData.itemIndex, 'MAX_SIMUL_VER_ID');

          if (clickData.column == "UI_NM_01") {
            pathName = grid.getValue(clickData.itemIndex, 'URL_01');
          }

          history.push({ pathname: pathName, state: { params: params } });
        }
      }
    }
  }

  function afterGridSimulationHistory(gridObj) {
    setGridSimulationHistory(gridObj);
    setGridSimulationHistoryOptions(gridObj);
  }

  function setGridSimulationHistoryOptions(gridObj) {
    gridObj.gridView.filteringOptions.automating.lookupDisplay = true;
    gridObj.gridView.setEditOptions({
      insertable: true,
      appendable: true,
      scrollOnEditing: 'commit'
    });

    gridObj.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridObj, false, false, false);
    gridObj.gridView.setFooters({ visible: false });

    gridObj.gridView.setColumnProperty('MAIN_VER_ID', 'mergeRule', { criteria: 'value' });
  }

  function loadSimulationStep(scenarioVersion) {
    let param = new FormData();

    param.append('Q_TYPE', 'STEP_INFO');
    param.append('MODULE_ID', getValues('moduleId'));
    param.append('SNRIO_VER_ID', scenarioVersion ? scenarioVersion : getValues('scenarioVersion'));
    param.append('LANG_CD', languageCode);

    return zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_CM_17_Q1',
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridSimulationStep.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function loadSimulationHistory(mainVersion) {
    let param = new FormData();

    param.append('MODULE_ID', getValues('moduleId'));
    param.append('CONBD_MAIN_VER', mainVersion ? mainVersion : getValues('mainVersion'));
    param.append('ALL_VERSION', true);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_CM_17_Q2',
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridSimulationHistory.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function openMainVersionPopup() {
    setMainVersionPopupOpen(true);
  }

  function closeMainVersionPopup() {
    setMainVersionPopupOpen(false);
  }

  async function onSetMainVersion(gridRow) {
    setValue('mainVersionId', gridRow.CONBD_MAIN_VER_MST_ID);
    setValue('mainVersion', gridRow.MAIN_VER_ID);
    setValue('mainVersionDescription', gridRow.MAIN_VER_DESCRIP);

    let param = new FormData();

    param.append('CONBD_MAIN_VER_ID', gridRow.CONBD_MAIN_VER_MST_ID);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_CM_17_Q7',
      data: param
    })
    .then(async function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        if (res.data.RESULT_DATA.length > 0) {
          let data = res.data.RESULT_DATA[0];
          let selectedScenario = scenarioOptions.filter(option => option.value === data.PLAN_SNRIO_MGMT_MST_ID)[0];
          let scenarioVersion = selectedScenario.versionId;
          let scenarioDescription = selectedScenario.label;

          setValue('scenarioVersionId', data.PLAN_SNRIO_MGMT_MST_ID);
          setValue('scenarioVersion', scenarioVersion);
          setValue('scenarioDescription', scenarioDescription);

          await loadDemandPlanOptions(data.PLAN_SNRIO_MGMT_MST_ID);

          setValue('demandPlanVersionId', data.DMND_VER_ID);

          if (!versionCreating) {
            loadSimulationStep(scenarioVersion);
          }
        }
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function openPlanHorizonPopup() {
    setPlanHorizonPopupOpen(true);
  }

  function closePlanHorizonPopup() {
    loadPlanHorizon();
    setPlanHorizonPopupOpen(false);
  }

  function openSimulationPopup() {
    setSimulationPopupOpen(true);
  }

  function closeSimulationPopup() {
    setSimulationPopupOpen(false);
  }

  function createNewVersion() {
    setVersionCreating(true);
    reset({
      moduleId: getValues('moduleId')
    });
    gridSimulationStep.dataProvider.clearRows();
    setDemandPlanVersionOptions([]);
    createMainVersion();
  }

  async function cancelNewVersion() {
    await setVersionCreating(false);
    await loadRecentVersion(false);
    loadSimulationStep();
  }

  function createMainVersion() {
    let newMainVersion = module + '-' + new Date().format('yyyyMMdd') + '-001';

    if (lastMainVersion && lastMainVersion != '') {
      let versionArray = lastMainVersion.split("-")
      let lastMainVersionDate = versionArray[1];
      let todayDate = new Date().format('yyyyMMdd');

      if (lastMainVersionDate === todayDate) {
        let sequence = Number(versionArray[2]) + 1;
        newMainVersion = versionArray[0] + '-' + versionArray[1] + '-' + sequence.toString().padStart(3, '0');
      } else {
        newMainVersion = versionArray[0] + '-' + todayDate + '-001';
      }
    }

    setValue('mainVersion', newMainVersion);
  }

  function saveNewVersion() {
    let param = new FormData();

    param.append('MODULE_ID', getValues('moduleId'));
    param.append('VER_DESCRIP', getValues('mainVersionDescription'));
    param.append('PLAN_SNRIO_MGMT_MST_ID', getValues('scenarioVersionId'));
    param.append('DP_CONBD_MAIN_VER_MST_ID', getValues('demandPlanVersionId'));
    param.append('USER_ID', username);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_CM_17_S1',
      data: param
    })
    .then(async function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        if (res.data.RESULT_DATA.IM_DATA.SP_UI_CM_17_S1_P_RT_MSG === 'MSG_0001') {
          await loadRecentVersion(true);
        } else {
          await loadRecentVersion(false);
        }

        showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_CM_17_S1_P_RT_MSG), { close: false });
      }
    })
    .then(function () {
      loadSimulationStep();
    })
    .catch(function (err) {
      console.log(err);
    });

    setVersionCreating(false);
  }

  return (
    <>
      <ContentInner>
        <ResultArea>
          <Grid container spacing={13} sx={{ height: 1, marginTop: 0 }}>
            <Grid item xs={3.8} sx={{ height: 2/5, minHeight: "362px" }}>
              <Details id="versionCreation" title={getValues("mainVersion")} headerAction={createVersionAction} style={{ height: "calc(100% - 102px)", py: "0 !important", overflow: "auto" }} footerAction={footerAction}>
                <TableContainer component={Paper} sx={{ boxShadow: "none" }}>
                  <Table className={classes.table}>
                    <TableBody>
                      <TableRow>
                        <TableCell>
                          <Box>
                            <Box />
                            <span>{transLangKey("DESCRIP")}</span>
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Controller name="mainVersionDescription" control={control}
                            render={({ field: { onChange, value } }) => (
                              <TextField variant="standard" value={value} onChange={onChange} inputProps={{ readOnly: !versionCreating }} />
                            )}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Box>
                            <Box />
                            <span>{transLangKey("SCENARIO")}</span>
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Controller name="scenarioVersionId" control={control}
                            render={({ field: { onChange, value } }) => (
                              <TextField select variant="standard" value={value} onChange={onChange} SelectProps={{
                                displayEmpty: true, readOnly: !versionCreating, renderValue: (selected) => {
                                  if (!selected) return <em style={{ opacity: 0.42 }}>{transLangKey("MSG_5120")}</em>;
                                  if (scenarioOptions.length > 0 && scenarioOptions.filter(data => data.value === selected).length > 0) {
                                     return scenarioOptions.find(data => data.value === selected).label;
                                  }
                                  return getValues("scenarioVersion");
                                }
                              }}>
                                {scenarioOptions.map((option) => (<MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>))}
                              </TextField>
                            )}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Box>
                            <Box />
                            <span>{transLangKey("DP_VER")}</span>
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Controller name="demandPlanVersionId" control={control}
                            render={({ field: { onChange, value } }) => (
                              <TextField select variant="standard" value={value} onChange={onChange} SelectProps={{
                                displayEmpty: true, readOnly: !versionCreating, renderValue: (selected) => {
                                  if (!selected) return <em style={{ opacity: 0.42 }}>{transLangKey("MSG_5120")}</em>;
                                  if (demandPlanVersionOptions.length > 0 && demandPlanVersionOptions.filter(data => data.value === selected).length > 0) {
                                    return demandPlanVersionOptions.find(data => data.value === selected).label;
                                  }
                                  return transLangKey("MSG_5138");
                                }
                              }}>
                                {demandPlanVersionOptions.map((option) => (<MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>))}
                              </TextField>
                            )}
                          />
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>
                          <Box>
                            <Box />
                            <span>{transLangKey("PLAN_HORIZ")}</span>
                          </Box>
                        </TableCell>
                        <TableCell align="left">
                          <Box sx={{ height: "100%" }} style={{ display: "flex" }}>
                            <Controller name="startDate" control={control}
                              render={({ field: { onChange, value } }) => (
                                <TextField variant="standard" value={value} onChange={onChange} style={{ width: "70px" }} inputProps={{ readOnly: true }} />
                              )}
                            />
                            <span style={{ margin: "auto 10px" }}>~</span>
                            <Controller name="endDate" control={control}
                              render={({ field: { onChange, value } }) => (
                                <TextField variant="standard" value={value} onChange={onChange} style={{ width: "70px" }} inputProps={{ readOnly: true }} />
                              )}
                            />
                            <CommonButton type="text" title={transLangKey("CHANGE")} onClick={openPlanHorizonPopup} style={{ marginLeft: "15px" }} />
                          </Box>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Details>
            </Grid>
            <Grid item xs={8.2} sx={{ height: 2/5, minHeight: "362px" }}>
              <Details id="simulationStep" title={getValues("scenarioDescription")}>
                <BaseGrid id="gridSimulationStep" items={gridSimulationStepColumns} afterGridCreate={afterGridSimulationStep} />
              </Details>
            </Grid>
            <Grid item xs={12} sx={{ height: 3/5, maxHeight: "calc(100% - 362px)" }}>
              <Details id="simulationHistory" title={transLangKey("FP_SIMULATION_HISTORY")} headerAction={versionHistoryAction}>
                <BaseGrid id="gridSimulationHistory" items={gridSimulationHistoryColumns} afterGridCreate={afterGridSimulationHistory} />
              </Details>
            </Grid>
          </Grid>
        </ResultArea>
      </ContentInner>

      {mainVersionPopupOpen && (<PopMainVersion open={mainVersionPopupOpen} onClose={closeMainVersionPopup} confirm={onSetMainVersion} moduleCd={module} />)}
      {planHorizonPopupOpen && (<PopGeneralConfig open={planHorizonPopupOpen} onClose={closePlanHorizonPopup} confKey={'301'} moduleCd={module} />)}
      {simulationPopupOpen && (<PopMPSimulation open={simulationPopupOpen} onClose={closeSimulationPopup} loadStep={loadSimulationStep} loadHistory={loadSimulationHistory} mainData={getValues()} processData={popupData} moduleCode={module} />)}
    </>
  )
}

export default MPSimulation;
