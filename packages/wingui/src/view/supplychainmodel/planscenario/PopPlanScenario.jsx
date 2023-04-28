import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Tab, Tabs } from '@mui/material';
import { InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';
import { getCodeList } from "@wingui/view/supplychainmodel/common/common";

function PopPlanScenario(props) {
  const [demandModuleOptions, setDemandModuleOptions] = useState([]);
  const [username] = useUserStore(state => [state.username]);
  const { getValues, setValue, control } = useForm({
    defaultValues: {
      module: '',
      demandModule: '',
      scenarioVersion: '',
      scenarioDescription: '',
      active: []
    }
  });

  const module = props.module ? props.module : '';

  useEffect(() => {
    async function initLoad() {
      zAxios({
        method: 'post',
        url: baseURI() + 'engine/mp/SRV_UI_CM_15_Q1',
        data: new FormData()
      })
        .then(function (res) {
          if (res.status === gHttpStatus.SUCCESS) {
            setValue('module', res.data.RESULT_DATA.find(code => code.KEY_VALUE === 'MODULE' && code.COMN_CD === module).ID);
          }
        });

      let dataArr = await getCodeList('DEMAND_MODULE_TP');
      let demandModuleTypeArray = dataArr.filter(code => code.GROUP == 'DEMAND_MODULE_TP').map(data => ({ value: data.ID, label: data.CD_NM }));
      setDemandModuleOptions(demandModuleTypeArray);
      setValue('demandModule', demandModuleTypeArray[0].value);
    }

    initLoad();
  }, []);

  function saveSubmit() {
    let formData = new FormData();
    formData.append('MODULE_ID', getValues('module'));
    formData.append('DMND_MODULE_ID', getValues('demandModule'));
    formData.append('DESCRIP', getValues('scenarioDescription'));
    formData.append('ACTV_YN', getValues('active'));
    formData.append('USER_ID', username);

    zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_16_S1", formData)
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          const rsData = res.data;
          if (rsData.RESULT_SUCCESS) {
            const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_16_S1_P_RT_MSG;
            if (msg === "MSG_0001") {
              props.confirm();
              props.onClose();
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
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={saveSubmit} title="PLAN_SCENARIO" resizeHeight={450} resizeWidth={400}>
      <Tabs value="SCENARIO">
        <Tab label={transLangKey("SCENARIO")} value="SCENARIO" />
      </Tabs>
      <Box style={{ height: "100%" }}>
        <Box>
          <InputField type="select" name="demandModule" label={transLangKey("DMND_MODULE_ID")} control={control} options={demandModuleOptions} />
        </Box>
        <Box>
          <InputField name="scenarioVersion" label={transLangKey("SCENARIO_VER")} control={control} disabled={true} />
        </Box>
        <Box>
          <InputField name="scenarioDescription" label={transLangKey("SCENARIO_DESCRIP")} control={control} style={{ width: "300px" }} />
        </Box>
        <Box>
          <InputField type="check" name="active" control={control} options={[{ label: transLangKey("SCENARIO_ACTV"), value: "Y" }]} />
        </Box>
      </Box>
    </PopupDialog>
  );
}

export default PopPlanScenario;
