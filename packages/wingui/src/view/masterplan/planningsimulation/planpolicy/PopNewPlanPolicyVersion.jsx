import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

function PopNewPlanPolicyVersion(props) {
  const [username] = useUserStore(state => [state.username]);
  const { handleSubmit, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      moduleId: '',
      module: '',
      planPolicyVersion: '',
      planPolicyDescrip: '',
      actvYn: [],
      planType: ''
    }
  });

  const [planTpOption, setPlanTpOption] = useState([]);

  useEffect(() => {
    setValue('moduleId', props.moduleId);
    setValue('module', props.module);
    setPlanTpOption(props.planTpOption);
  }, [props]);

  function onError(errors) {
    if (typeof errors !== 'undefined' && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  function saveData() {
    if (getValues('planType')) {
      let formData = new FormData();

      formData.append('MODULE_ID', getValues('moduleId'));
      formData.append('PLAN_POLICY_DESCP', getValues('planPolicyDescrip'));
      formData.append('ACTV_YN', getValues('actvYn').join('') === 'Y' ? true : false);
      formData.append('PLAN_TYPE', getValues('planType'));
      formData.append('USER_ID', username);

      zAxios({
        method: 'post',
        url: baseURI() + 'engine/mp/SRV_UI_CM_15_S1',
        data: formData,
        fromPopup: true
      })
        .then(function (res) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_CM_15_S1_P_RT_MSG));

          props.confirm();
          props.onClose(false);
        })
        .catch(function (e) {
          console.error(e);

          props.confirm();
          props.onClose(false);
        });
    } else {
      showMessage('Information', transLangKey('MSG_0006'), { close: false });
    }
  }

  return (
    <>
      <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveData, onError)} title="NEW_PLAN_POLICY" resizeHeight={300} resizeWidth={500}>
        <Box style={{ height: "100%" }}>
          <InputField name="module" label={transLangKey("MODULE_VAL")} control={control} disabled={true} />
          <InputField name="planPolicyVersion" label={transLangKey("PLAN_POLICY_VERSION")} control={control} disabled={true} />
          <InputField name="planPolicyDescrip" label={transLangKey("PLAN_POLICY_DESCRIP")} control={control} />
          <InputField type="check" name="actvYn" control={control} options={[{ label: transLangKey("ACTV_INACTV"), value: "Y" }]} />
          <InputField type="select" name="planType" label={transLangKey("PLAN_TP")} control={control} options={planTpOption} />
        </Box>
      </PopupDialog>
    </>
  );
}

export default PopNewPlanPolicyVersion;
