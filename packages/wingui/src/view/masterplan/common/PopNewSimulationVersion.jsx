import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import PopStep from './PopStep';

const oneRowStyle = { marginRight: "50px" };

function PopNewSimulationVersion(props) {
  const [username] = useUserStore(state => [state.username]);
  const [stepPopupOpen, setStepPopupOpen] = useState(false);

  const { handleSubmit, control, getValues, setValue } = useForm({
    defaultValues: {
      moduleCd: '',
      mainVerId: '',
      mainVerDescrip: '',
      snrioVerId: '',
      snrioVerDescrip: '',
      planSnrioMgmtDtlId: '',
      step: '',
      processDescrip: '',
      processTp: '',
      originalVerId: '',
      originalDescrip: '',
      maxSimulVerId: '',
      simulVerDescrip: ''
    }
  });

  useEffect(() => {
    if (props.open === true) {
      loadSimulationVersion();
    }
  }, [props.open]);

  function loadSimulationVersion() {
    let param = new URLSearchParams();

    param.append('SIMUL_VER_ID', props.versionId);
    param.append('USER_ID', username);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_CM_17_S5',
      data: param
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          let data = res.data.RESULT_DATA[0];

          setValue('moduleCd', data.MODULE_CD);
          setValue('mainVerId', data.MAIN_VER_ID);
          setValue('mainVerDescrip', data.MAIN_VER_DESCRIP);
          setValue('snrioVerId', data.SNRIO_VER_ID);
          setValue('snrioVerDescrip', data.SNRIO_VER_DESCRIP);
          setValue('step', data.STEP);
          setValue('processDescrip', data.PROCESS_DESCRIP);
          setValue('processTp', data.PROCESS_TP);
          setValue('originalVerId', data.ORIGINAL_VER_ID);
          setValue('originalDescrip', data.ORIGINAL_DESCRIP);
          setValue('maxSimulVerId', data.MAX_SIMUL_VER_ID);
          setValue('simulVerDescrip', data.SIMUL_VER_DESCRIP);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function onError(errors) {
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  function saveSubmit() {
    if (getValues('step') !== null && getValues('step') !== '') {
      let url = baseURI() + 'engine/mp/SRV_SP_COMM_NEW_ADJ_SIM_VER';

      let formData = new FormData();

      formData.append('SOURCE_SIMUL_VER_ID', getValues('originalVerId'));
      formData.append('TARGET_SIMUL_VER_ID', getValues('maxSimulVerId'));
      formData.append('PLAN_SNRIO_MGMT_DTL_ID', getValues('planSnrioMgmtDtlId'));
      formData.append('SIMUL_VER_DESCRIP', getValues('simulVerDescrip'));
      formData.append('USER_ID', username);

      zAxios.post(url, formData)
        .then(function (res) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_COMM_NEW_ADJ_SIM_VER_S_P_RT_MSG));

          props.onClose(false);
        })
        .catch(function (e) {
          console.error(e);

          props.onClose(false);
        });
    } else {
      showMessage('Action Condition Fail', transLangKey("MSG_5129"), { close: false });
    }
  }

  function openStepPopup() {
    setStepPopupOpen(true);
  }

  function closeStepPopup() {
    setStepPopupOpen(false);
  }

  function onSetStep(data) {
    setValue('planSnrioMgmtDtlId', data.ID);
    setValue('step', data.STEP);
    setValue('processDescrip', data.PROCESS_DESCRIP);
  }

  return (
    <>
      <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="GEN_NEW_VER" resizeHeight={550} resizeWidth={500}>
        <Box style={{ marginTop: "5px", border: "1px solid #dde1ee", width: "100%", height: "100%", padding: "6px 12px" }}>
          <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: "block" }}>
            <InputField name='moduleCd' label={transLangKey("MODULE_VAL")} control={control} disabled={true} />
            <InputField name="mainVerId" label={transLangKey("MAIN_VER_ID")} control={control} disabled={true} />
            <InputField name="mainVerDescrip" label={transLangKey("DESCRIP")} control={control} disabled={true} style={oneRowStyle} />
            <InputField name="snrioVerId" label={transLangKey("SCENARIO_VER")} control={control} disabled={true} />
            <InputField name="snrioVerDescrip" label={transLangKey("DESCRIP")} control={control} disabled={true} />
            <InputField type='action' name='step' label={transLangKey('STEP')} title={transLangKey('SEARCH')} onClick={() => { openStepPopup() }} control={control}>
              <Icon.Search />
            </InputField>
            <InputField name="processDescrip" label={transLangKey("PROCESS")} control={control} disabled={true} />
            <InputField name="processTp" label={transLangKey("PROCESS_TP")} control={control} disabled={true} style={oneRowStyle} />
            <InputField name="originalVerId" label={transLangKey("ORIGIN_VER")} control={control} disabled={true} />
            <InputField name="originalDescrip" label={transLangKey("DESCRIP")} control={control} disabled={true} />
            <InputField name="maxSimulVerId" label={transLangKey("SIMUL_VER")} control={control} disabled={true} />
            <InputField name="simulVerDescrip" label={transLangKey("DESCRIP")} control={control} />
          </Box>
        </Box>
      </PopupDialog>

      <PopStep open={stepPopupOpen} onClose={closeStepPopup} confirm={onSetStep} versionId={props.versionId} />
    </>
  )
}

export default PopNewSimulationVersion;
