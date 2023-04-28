import React, { useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import LocationSearchCondition from '../common/LocationSearchCondition';

function PopSiteBodBundleCreate(props) {
  const location = useRef();
  const [username] = useUserStore(state => [state.username]);

  const { control, getValues, setValue, watch } = useForm({
    defaultValues: {
      applyTarget: 'PARTIAL',
      registerLocation: ['Y'],
      overwrite: []
    }
  });

  useEffect(() => {
    if (getValues('applyTarget') === 'ALL') {
      location.current.reset();
      setValue('registerLocation', []);
    } else {
      setValue('registerLocation', ['Y']);
    }
  }, [watch('applyTarget')]);

  function bundleCreate() {
    showMessage(transLangKey('SAVE'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let formData = new FormData();
        formData.append('APPLY_POINT', getValues('applyTarget'));
        formData.append('CHECK_LOCAT', getValues('registerLocation').includes('Y'));
        formData.append('LOCAT_MGMT_ID', location.current.getLocationMgmtId());
        formData.append('OVERWRITE_DATA_YN', getValues('overwrite').includes('Y'));
        formData.append('USER_ID', username);

        zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_06_BATCH", formData)
          .then(function (res) {
            if (res.status === gHttpStatus.SUCCESS) {
              const rsData = res.data;
              if (rsData.RESULT_SUCCESS) {
                const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_06_BATCH_P_RT_MSG;
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
    });
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={bundleCreate} title="POP_UI_CM_06_03" resizeHeight={350} resizeWidth={500}>
      <Box>
        <InputField type="radio" name="applyTarget" control={control} options={[{ label: transLangKey("ALL_APPLY"), value: "ALL" }, { label: transLangKey("PARTIAL_APPLY"), value: "PARTIAL" }]} />
        <InputField type="check" name="registerLocation" control={control} options={[{ label: transLangKey("LOCAT_REGISTRY"), value: "Y" }]} disabled={getValues("applyTarget") === "ALL"} />
        <LocationSearchCondition ref={location} readonly={true} disabled={{ locationType:!watch("registerLocation").includes("Y") }} />
        <InputField type="check" name="overwrite" control={control} options={[{ label: transLangKey("OVERWRITE_EXIST_DATA"), value: "Y" }]} />
      </Box>
    </PopupDialog>
  );
}

export default PopSiteBodBundleCreate;
