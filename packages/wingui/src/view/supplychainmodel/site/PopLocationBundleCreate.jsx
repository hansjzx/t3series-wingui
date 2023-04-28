import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { InputField, PopupDialog, useUserStore, zAxios } from "@zionex/wingui-core/src/common/imports";
import PopLocatMst from '@wingui/view/common/PopLocatMst';

function PopLocationBundleCreate(props) {
  const [disabled, setDisabled] = useState(false);
  const [username] = useUserStore(state => [state.username]);

  const [dialogOpen1, setDialogOpen1] = useState(false);
  const { handleSubmit, watch, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      APPLY_POINT: 'PARTIAL',
      LOCAT_REGISTRY: ['Y'],
      OVERWRITE_DATA_YN: ['']
    }
  });

  const applyOptions = [
    {
      label: transLangKey('ALL_APPLY'),
      value: 'ALL',
    },
    {
      label: transLangKey('PARTIAL_APPLY'),
      value: 'PARTIAL',
    },
  ];

  const watchApplyPoint = watch('APPLY_POINT');
  useEffect(() => {
    if (watchApplyPoint === 'ALL') {
      setValue('LOCAT_TP_NM', '');
      setValue('LOCAT_LV', '');
      setValue('LOCAT_MST_ID', '');
      setValue('LOCAT_REGISTRY', ['']);
      setDisabled(true);
    } else {
      setValue('LOCAT_REGISTRY', ['Y']);
      setDisabled(false);
    }
  }, [watchApplyPoint]);

  // popup close - locatTp
  const onSetLocatTp = (gridRow) => {
    setValue('LOCAT_TP_NM', gridRow.LOCAT_TP_NM);
    setValue('LOCAT_LV', gridRow.LOCAT_LV);
    setValue('LOCAT_MST_ID', gridRow.LOCAT_MST_ID);
  }

  function onError(errors, e) {
    if (typeof errors !== 'undefined' && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  function saveSubmit() {
    let formData = new FormData();

    formData.append('APPLY_POINT', getValues('APPLY_POINT'));
    formData.append('CHECK_LOCAT', getValues('LOCAT_REGISTRY').join('') === 'Y' ? 'true' : 'false');
    formData.append('LOCAT_MST_ID', getValues('LOCAT_MST_ID'));
    formData.append('OVERWRITE_DATA_YN', getValues('OVERWRITE_DATA_YN').join('') === 'Y' ? 'true' : 'false');
    formData.append('USER_ID', username);

    zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_02_BATCH", formData)
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          const rsData = res.data;
          if (rsData.RESULT_SUCCESS) {
            const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_02_BATCH_P_RT_MSG;
            if (msg === "MSG_0003") {
              props.confirm();
              props.onClose(false);
            } else {
              showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg));
            }
          } else {
            showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
          }
        }
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  return (
    <>
      <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="POP_UI_CM_02_02" resizeWidth={480} resizeHeight={350}>
        <Box style={{ height: "100%" }}>
          <InputField type="radio" name="APPLY_POINT" control={control} options={applyOptions} />
        </Box>
        <Box>
          <InputField type="check" name="LOCAT_REGISTRY" control={control} disabled={disabled} options={[{ label: transLangKey("LOCAT_REGISTRY"), value: "Y" }]} />
        </Box>
        <Box>
          <InputField type="action" name="LOCAT_TP_NM" label={transLangKey("LOCAT_TP_NM")} onClick={() => { setDialogOpen1(true) }} control={control} disabled={disabled || !watch("LOCAT_REGISTRY").includes("Y")} readonly={true}>
            <Icon.Search />
          </InputField>
          <InputField name="LOCAT_LV" label={transLangKey("LOCAT_LV")} disabled={disabled || !watch("LOCAT_REGISTRY").includes("Y")} readonly={true} control={control} />
        </Box>
        <Box>
          <InputField type="check" name="OVERWRITE_DATA_YN" control={control} options={[{ label: transLangKey("OVERWRITE_EXIST_DATA"), value: "Y" }]} />
        </Box>
      </PopupDialog>
      {dialogOpen1 && (<PopLocatMst open={dialogOpen1} onClose={() => { setDialogOpen1(false); }} confirm={onSetLocatTp} />)}
    </>
  );
}

export default PopLocationBundleCreate;
