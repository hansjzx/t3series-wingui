import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  InputField, zAxios
} from '@zionex/wingui-core/src/common/imports';

// import PopCommSimulation from './PopCommSimulationVersion';
import PopSimulationVersion from '../../masterplan/common/PopSimulationVersion';

const module = 'MP';

export function SimulationVersionCondition(props, ref) {
  const [fields, setFields] = useState([]);
  const [simulationVersionPopupOpen, setSimulationVersionPopupOpen] = useState(false);
  const { reset, control, getValues, setValue } = useForm({
    defaultValues: {
      simulatonVersion: '',
      simulVersionDescription: '',
      processDescripion: ''
    }
  });

  useEffect(() => {
    loadRecentMainVersion();
  }, []);

  useImperativeHandle(ref, () => ({
    setField(field) {
      setFields(field);
    },

    getSimulationVersion() {
      return getValues('simulatonVersion');
    },

    getSimulVersionDescripion() {
      return getValues('simulVersionDescription');
    },

    getProcessDescription() {
      return getValues('processDescripion');
    },

    reset() {
      reset();
      loadRecentMainVersion();
    }
  }));

  function openSimulationVersionPopup() {
    setSimulationVersionPopupOpen(true);
  }

  function closeSimulationVersionPopup() {
    setSimulationVersionPopupOpen(false);
  }

  function onSetSimulationVersion(gridRows) {
    setValue('simulatonVersion', gridRows.SIMUL_VER);
    setValue('simulVersionDescription', gridRows.SIMUL_VER_DESCRIP);
    setValue('processDescripion', gridRows.PROCESS_DESCRIP);
  }

  function loadRecentMainVersion() {
    let param = new URLSearchParams();
  
    param.append('MENU_ID', props.menuId);
  
    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_COMM_DEFAULT_VER',
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        console.log(res);

        setValue('simulatonVersion', res.data.RESULT_DATA[0].SIMUL_VER_ID);
        setValue('simulVersionDescription', res.data.RESULT_DATA[0].SIMUL_VER_DESCRIP);
        setValue('processDescripion', res.data.RESULT_DATA[0].PROCESS_DESCRIP);
      }
    })
    .catch(function (err) {
      console.log(err);
    })
  }

  function setSearchConditionType() {
    return (
      <>
        <InputField type="action" name="simulatonVersion" label={transLangKey("SIMUL_VER_SHORTN")} readonly={props.readonly ? props.readonly : false} control={control} onClick={openSimulationVersionPopup} style={{ display: fields.length !== 0 && !fields.includes("simulatonVersion") ? "none" : "inline-block", width: "210px" }}>
          <Icon.Search />
        </InputField>
        <InputField name="simulVersionDescription" label={transLangKey("DESCRIP")} readonly={true} control={control} style={{ display: fields.length !== 0 && !(fields.includes("simulVersionDescription")) ? "none" : "inline-block" }} />
        <InputField name="processDescripion" label={transLangKey("PRSS_DESCRIP")} readonly={true} control={control} style={{ display: fields.length !== 0 && !(fields.includes("processDescripion")) ? "none" : "inline-block" }} />
      </>
    )
  }

  return (
    <>
      {setSearchConditionType()}
      {simulationVersionPopupOpen && <PopSimulationVersion id="simulationVersion" open={simulationVersionPopupOpen} onClose={closeSimulationVersionPopup} confirm={onSetSimulationVersion} module={module}/>}
    </>
  )
}

export default forwardRef(SimulationVersionCondition);
