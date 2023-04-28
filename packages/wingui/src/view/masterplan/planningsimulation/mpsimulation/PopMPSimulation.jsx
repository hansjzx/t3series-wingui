import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import PopSimulationVersion from '../../common/PopSimulationVersion';

function PopMPSimulation(props) {
  const [username] = useUserStore(state => [state.username]);

  const [mode, setMode] = useState('');

  const [simulationVersionPopupOpen, setSimulationVersionPopupOpen] = useState(false);
  const [planPolicyPopupOpen, setPlanPolicyPopupOpen] = useState(false);

  const { handleSubmit, control, getValues, setValue } = useForm({
    defaultValues: {
      moduleCode: '',
      mainVersion: '',
      mainVersionDescription: '',
      scenarioVersion: '',
      scenarioDescription: '',
      step: '',
      processDescription: '',
      processType: '',
      originalVersionId: '',
      originalDescription: '',
      simulationVersionId: '',
      simulationVersionDescription: ''
    }
  });

  useEffect(() => {
    if (props.processData.PROCESS_TP === 'SPROC_03') {
      setMode('PLAN');
      createSimulationVersion();
    } else if (props.processData.PROCESS_TP === 'SPROC_04' || props.processData.PROCESS_TP === 'SPROC_06') {
      setMode('CONFIRM');
      loadSimulationVersion();
    } else if (props.processData.PROCESS_TP === 'SPROC_05') {
      setMode('ADJUST');
    }
  }, []);

  function createSimulationVersion() {
    let param = new FormData();

    param.append('MODULE_ID', props.mainData.moduleId);
    param.append('MAIN_VER', props.mainData.mainVersion);
    param.append('PLAN_SNRIO_MGMT_DTL_ID', props.processData.PLAN_SNRIO_MGMT_DTL_ID);
    param.append('USER_ID', username);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_CM_17_S2',
      data: param,
      fromPopup: true
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          let data = res.data.RESULT_DATA[0];

          setValue('moduleCode', props.moduleCode);
          setValue('mainVersion', props.mainData.mainVersion);
          setValue('mainVersionDescription', props.mainData.mainVersionDescription);
          setValue('scenarioVersion', props.mainData.scenarioVersion);
          setValue('scenarioDescription', props.mainData.scenarioDescription);
          setValue('step', props.processData.STEP);
          setValue('processDescription', props.processData.PROCESS_DESCRIP);
          setValue('processType', props.processData.PROCESS_TP_NM);
          setValue('originalVersionId', data.ORIGINAL_VER_ID);
          setValue('originalDescription', data.ORIGINAL_DESCRIP);
          setValue('simulationVersionId', data.SIMUL_VER_ID);
          setValue('simulationVersionDescription', data.SIMUL_VER_DESCRIP);

          props.loadStep(props.mainData.scenarioVersion);
          props.loadHistory(props.mainData.mainVersion);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function loadSimulationVersion() {
    let param = new FormData();

    param.append('MAIN_VER_ID', props.mainData.mainVersion);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_CM_17_Q3',
      data: param,
      fromPopup: true
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          let data = res.data.RESULT_DATA[0];

          setValue('moduleCode', props.moduleCode);
          setValue('mainVersion', props.mainData.mainVersion);
          setValue('mainVersionDescription', props.mainData.mainVersionDescription);
          setValue('scenarioVersion', props.mainData.scenarioVersion);
          setValue('scenarioDescription', props.mainData.scenarioDescription);
          setValue('step', props.processData.STEP);
          setValue('processDescription', props.processData.PROCESS_DESCRIP);
          setValue('processType', props.processData.PROCESS_TP_NM);
          setValue('originalVersionId', data.ORIGINAL_VER_ID);
          setValue('originalDescription', data.ORIGINAL_DESCRIP);
          setValue('simulationVersionId', data.MAX_SIMUL_VER_ID);
          setValue('simulationVersionDescription', data.SIMUL_VER_DESCRIP);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function runSimulation() {
    if (getValues('simulationVersionId') === '') {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5114'), { close: false });
      return;
    }

    if (mode === 'PLAN' || mode === 'ADJUST') {
      runPlan();
    } else if (mode === 'CONFIRM') {
      confirmPlan();
    }
  }

  function runPlan() {
    let param = new FormData();

    param.append('SIMUL_VER_ID', getValues('simulationVersionId'));
    param.append('SIMUL_VER_DESCRIP', getValues('simulationVersionDescription') ? getValues('simulationVersionDescription') : '');
    param.append('PLAN_SNRIO_MGMT_DTL_ID', props.processData.PLAN_SNRIO_MGMT_DTL_ID);
    param.append('USER_ID', username);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_CM_17_S4',
      data: param,
      fromPopup: true
    })
      .then(async function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          await props.loadStep(getValues('scenarioVersion'));

          param = new FormData();

          param.append('PLAN_POLICY_MGMT_ID', props.processData.PLAN_POLICY_MGMT_ID);
          param.append('VERSION_ID', getValues('simulationVersionId'));

          let service = '';

          if (props.moduleCode === 'RP') {
            service = 'RunPlanRP';
          } else if (props.moduleCode === 'MP') {
            service = 'RunPlan';
          }

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/' + service,
            data: param,
            timeout: 0
          })
            .then(function (runRes) {
              props.loadStep(getValues('scenarioVersion'));
              props.loadHistory(getValues('mainVersion'));

              if (runRes.status === gHttpStatus.SUCCESS) {
                showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_0003'), { close: false });
              }
            });

          props.onClose();
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function confirmPlan() {
    let param = new FormData();

    param.append('VERSION_ID', getValues('simulationVersionId'));
    param.append('USER_ID', username);

    let service = '';

    if (props.moduleCode === 'RP') {
      service = 'ConfirmPlanRP';
    } else if (props.moduleCode === 'MP') {
      service = 'ConfirmPlan';
    }

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/' + service,
      data: param,
      fromPopup: true,
      timeout: 0
    })
      .then(function (runRes) {
        if (runRes.status === gHttpStatus.SUCCESS) {
          props.loadStep(getValues('scenarioVersion'));
          props.loadHistory(getValues('mainVersion'));
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_0003'), { close: false });
        }

        props.onClose();
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function openSimulationVersionPopup() {
    setSimulationVersionPopupOpen(true);
  }

  function closeSimulationVersionPopup() {
    setSimulationVersionPopupOpen(false);
  }

  function onSetSimulationData(gridRow) {
    if ((mode === 'ADJUST' && gridRow.PROCESS_TP !== 'SPROC_05') || (mode !== 'ADJUST' && gridRow.PROCESS_TP === 'SPROC_05')) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5132'), { close: false });
      return;
    }

    setValue('moduleCode', props.moduleCode);
    setValue('mainVersion', props.mainData.mainVersion);
    setValue('mainVersionDescription', props.mainData.mainVersionDescription);
    setValue('scenarioVersion', props.mainData.scenarioVersion);
    setValue('scenarioDescription', props.mainData.scenarioDescription);
    setValue('step', props.processData.STEP);
    setValue('processDescription', props.processData.PROCESS_DESCRIP);
    setValue('processType', props.processData.PROCESS_TP_NM);
    setValue('simulationVersionId', gridRow.SIMUL_VER);
    setValue('simulationVersionDescription', gridRow.SIMUL_VER_DESCRIP);
  }

  function openPlanPolicyPopup() {
    setPlanPolicyPopupOpen(true);
  }

  function closePlanPolicyPopup() {
    setPlanPolicyPopupOpen(false);
  }

  return (
    <>
      <PopupDialog open={props.open} onClose={props.onClose} onSubmit={runSimulation} title={mode === "CONFIRM" ? "PLAN_CONFIRM" : "EXEC_SIMUL"} resizeHeight={520} resizeWidth={500}>
        <Box style={{ marginTop: "5px", border: "1px solid #dde1ee", width: "100%", height: "100%", padding: "6px 12px" }}>
          <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: "block" }}>
            <Box>
              <InputField name='moduleCode' label={transLangKey("MODULE_CD")} control={control} disabled={true} />
            </Box>
            <Box>
              <InputField name="mainVersion" label={transLangKey("MAIN_VER_ID")} control={control} disabled={true} />
              <InputField name="mainVersionDescription" label={transLangKey("MAIN_VER_DESCRIP")} control={control} disabled={true} />
            </Box>
            <Box>
              <InputField name="scenarioVersion" label={transLangKey("SCENARIO_VER")} control={control} disabled={true} />
              <InputField name="scenarioDescription" label={transLangKey("SCENARIO_VER_DESCRIP")} control={control} disabled={true} />
            </Box>
            <Box>
              <InputField name="step" label={transLangKey("STEP")} control={control} disabled={true} />
            </Box>
            <Box>
              <InputField name="processDescription" label={transLangKey("PROCESS_DESCRIP")} control={control} disabled={true} />
              <InputField name="processType" label={transLangKey("PROCESS_TP")} control={control} disabled={true} />
            </Box>
            <Box>
              <InputField name="originalVersionId" label={transLangKey("ORIGIN_VER")} control={control} disabled={true} />
              <InputField name="originalDescription" label={transLangKey("DESCRIP")} control={control} disabled={true} />
            </Box>
            <Box>
              <InputField type="action" name="simulationVersionId" label={transLangKey("SIMUL_VER")} control={control} onClick={openSimulationVersionPopup} disabled={mode === 'PLAN'} readonly={true} style={{ width: "210px" }}>
                <Icon.Search />
              </InputField>
              <InputField name="simulationVersionDescription" label={transLangKey("SIMULATION_VERSION_DESCRIP")} control={control} disabled={mode !== 'PLAN'} />
            </Box>
          </Box>
        </Box>
      </PopupDialog>

      {simulationVersionPopupOpen && (<PopSimulationVersion open={simulationVersionPopupOpen} onClose={closeSimulationVersionPopup} confirm={onSetSimulationData} module={props.moduleCode} mainVersion={props.mainData.mainVersion} />)}
    </>
  )
}

export default PopMPSimulation;
