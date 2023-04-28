import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

const oneRowStyle = { marginRight: "50px" };

function PopConfirmPlan(props) {
  const [username] = useUserStore(state => [state.username]);
  const { handleSubmit, control, getValues, setValue } = useForm({
    defaultValues: {
      moduleCd: '',
      mainVersionId: '',
      mainVerDescrip: '',
      snrioVerId: '',
      snrioVerDescrip: '',
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
      loadConfirmPlan(props.param);
    }
  }, [props.open]);

  function loadConfirmPlan(simulVerId) {
    let param = new URLSearchParams();

    param.append('SIMUL_VER_ID', simulVerId);

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_CM_17_Q3',
      data: param,
      fromPopup: true
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        let data = res.data.RESULT_DATA[0];

        setValue('moduleCd', data.MODULE_CD);
        setValue('mainVersionId', data.MAIN_VER_ID);
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

  function confirmPlan() {
    let formData = new FormData();

    formData.append('VERSION_ID', getValues('maxSimulVerId'));
    formData.append('USER_ID', username);
    formData.append('timeout', 0);

    let service = '';
    let moduleCode = getValues('moduleCd');

    if (moduleCode === 'RP') {
      service = 'ConfirmPlanRP';
    } else if (moduleCode === 'MP') {
      service = 'ConfirmPlan';
    }

    zAxios.post(baseURI() + 'engine/mp/' + service,
    formData,
    {
      headers: {
        'Content-Type': 'application/json'
      },
      fromPopup: true
    })
    .then(function () { })
    .catch(function (e) {
      console.error(e);
    })
    .then(function () {
      props.confirm();
      props.onClose(false);
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

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(confirmPlan, onError)} title="PLAN_CONFIRM" resizeHeight={520} resizeWidth={500}>
      <Box style={{ marginTop: "5px", border: "1px solid #dde1ee", width: "100%", height: "100%", padding: "6px 12px" }}>
        <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: "block" }}>
            <InputField name='moduleCd' label={transLangKey("MODULE_CD")} control={control} disabled={true} />
            <InputField name="mainVersionId" label={transLangKey("MAIN_VER_ID")} control={control} disabled={true} />
            <InputField name="mainVerDescrip" label={transLangKey("DESCRIP")} control={control} disabled={true} style={oneRowStyle} />
            <InputField name="snrioVerId" label={transLangKey("SCENARIO_VER")} control={control} disabled={true} />
            <InputField name="snrioVerDescrip" label={transLangKey("DESCRIP")} control={control} disabled={true} />
            <InputField name="step" label={transLangKey("STEP")} control={control} disabled={true} />
            <InputField name="processDescrip" label={transLangKey("PROCESS")} control={control} disabled={true} />
            <InputField name="processTp" label={transLangKey("PROCESS_TP")} control={control} disabled={true} style={oneRowStyle} />
            <InputField name="originalVerId" label={transLangKey("ORIGIN_VER")} control={control} disabled={true} />
            <InputField name="originalDescrip" label={transLangKey("DESCRIP")} control={control} disabled={true} />
            <InputField name="maxSimulVerId" label={transLangKey("SIMUL_VER")} control={control} disabled={true} />
            <InputField name="simulVerDescrip" label={transLangKey("DESCRIP")} control={control} disabled={true} />
        </Box>
      </Box>
    </PopupDialog>
  )
}

export default PopConfirmPlan;
