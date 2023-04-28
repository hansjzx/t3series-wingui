import React from "react";
import { useForm } from "react-hook-form";
import { PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

function PopInventoryPolicyBundleCreate(props) {
  const [username] = useUserStore(state => [state.username]);
  const { handleSubmit, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      applyPoint: "NEW",
    }
  });
  
  const options1 = [
    {
      label: transLangKey('ALL_APPLY'),
      value: "ALL",
    },
    {
      label: transLangKey('NEW_APPLY'),
      value: "NEW",
    },
  ];

  function onError(errors, e) {
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  function saveSubmit() {
    let formData = new FormData();

    formData.append('APPLY_POINT', getValues('applyPoint'));
    formData.append('APPLY_TARGET', props.target);
    formData.append('USER_ID', username);

    zAxios.post(baseURI() + 'engine/mp/SRV_UI_IM_25_BATCH',
    formData,
    {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(function () { })
    .catch(function (e) {
      console.error(e);
    });
    
    props.confirm();
    props.onClose(false);
  }

  return (
    <>
      <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="POP_UI_IM_25_01" resizeHeight={160} resizeWidth={250}>
        <InputFiel type="radio" label={transLangKey("APPLY")} name="applyPoint" control={control} setValue={setValue} options={options1} />
      </PopupDialog>
    </>
  );
}

export default PopInventoryPolicyBundleCreate;
