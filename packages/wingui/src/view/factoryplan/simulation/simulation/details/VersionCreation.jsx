import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box, Table, TableBody, TableCell, TableContainer, TableRow, Paper, Button
} from "@mui/material";
import { InputField, zAxios } from "@zionex/wingui-core/src/common/imports";
import AddIcon from "@mui/icons-material/Add";
import Details from "@wingui/view/factoryplan/common/component/DetailCard";
import { initI18n, showMessage, transLangKey } from "@wingui";
import { useMainVersionContext } from "../SimulationContext";
import { fpCommonStyles } from "@wingui/view/factoryplan/common/common";

initI18n(localStorage.getItem('languageCode'));
const helperText = {
  required: transLangKey("FP_MSG_FIELD_REQUIRED"),
  freezeTs: transLangKey("FP_MSG_FREEZE_RANGE_LIMIT"),
  planningTs: transLangKey("FP_MSG_TIME_RANGE_LIMIT")
};
const Row = ({ title, children }) => (
  <TableRow>
    <TableCell>
      <Box >
        <Box/>
        <span >{title}</span>
      </Box>
    </TableCell>
    <TableCell align="left">{children}</TableCell>
  </TableRow>
);
const tableStyles = {
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
};
const readOnlyInput = {
  '&:after': {
    borderBottom: 'none'
  },
  '&:hover:before': {
    borderBottom: '1px solid rgba(0, 0, 0, 0.42) !important'
  },
  ' .MuiInput-input': {
    cursor: 'text',
    '&:focus': {
      backgroundColor: 'initial'
    }
  }
};

function VersionCreation() {
  const { setMainVersion } = useMainVersionContext();
  const { control, getValues, setValue, watch, handleSubmit, clearErrors } = useForm({
    defaultValues: {
      descTxt: '',
      freezeTs: null,
      stepCd: '',
      versionSeq: '',
      efficiency: '',
      planningTs: [new Date(), new Date()],
    },
    reValidateMode: 'onChange'
  });
  const [mainVersionCd, setMainVersionCd] = useState(' ');
  const [stepList, setStepList] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const Action = (
    <>
      <Button variant="outlined" sx={fpCommonStyles.roundButton} startIcon={<AddIcon color='primary' />} onClick={generateNewMainVersion}>{transLangKey('FP_MAIN_VERSION_CREATION')}</Button>
      <Button variant="contained" sx={{ ...fpCommonStyles.primaryButton, ml: 'auto !important', width: 130 }} disabled={disabled} onClick={handleSubmit(onSubmit)}>{transLangKey('SAVE')}</Button>
    </>
  );
  const getReadOnlyProps = () => ({ readOnly: disabled, sx: {...(disabled) ? readOnlyInput : {}}, className: null });

  useEffect(() => {
    getPlanSteps();
  }, []);

  useEffect(() => {
    if (stepList && stepList.length > 0) {
      setDefaultVersion(false);
    }
  }, [stepList]);

  function setDefaultVersion(newVersion) {
    zAxios.get(baseURI() + 'factoryplan/simulation/main-versions/default', {
      params: { 'new-version': newVersion },
      waitOn: false
    })
      .then(function (res) {
        const data = res.data;
        setMainVersionCd(data.mainVersionCd);
        setValue('descTxt', !data.descTxt ? '' : data.descTxt);
        setValue('planningTs', [data.startTs, data.endTs]);
        setValue('freezeTs', new Date(data.freezeTs));
        setValue('stepCd', !data.stepCd ? '' : data.stepCd);
        setValue('versionSeq', data.versionSeq);
        setDisabled(!!data.id);
        if (data.id) {
          data.stepCd = stepList.find(step => step.value === data.stepCd).label;
          setMainVersion(data);
        } else {
          setMainVersion(null);
        }
      }).catch(function (err) {
      console.log(err);
    }).then(function () {
    });
  }

  function getPlanSteps() {
    return zAxios.get(baseURI() + 'factoryplan/plan-steps', {
      waitOn: false
    })
      .then(function (res) {
        setStepList(res.data.map(data => ({ value: data.stepCd, label: data.stepNm })));
      }).catch(function (err) {
        console.log(err);
      })
  }

  function onSubmit(data) {
    showMessage(transLangKey('SAVE'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let saveData = {};
        saveData['mainVersionCd'] = mainVersionCd;
        saveData['descTxt'] = data['descTxt'];
        saveData['stepCd'] = data['stepCd'];
        saveData['versionSeq'] = data['versionSeq'];
        const convertDateFormat = (dt) => (dt instanceof Date) ? dt.format('yyyy-MM-ddTHH:mm:00') : dt;
        saveData['startTs'] = data['planningTs'][0];
        saveData['endTs'] = data['planningTs'][1];
        saveData['freezeTs'] = convertDateFormat(data['freezeTs']);
        
        let formData = new FormData();
        formData.append('changes', JSON.stringify(saveData));

        zAxios({
          method: 'post',
          url: baseURI() + 'factoryplan/simulation/main-versions',
          headers: { 'content-type': 'application/json' },
          data: formData
        }).then(function (response) {
          if (response.data.status === 200) {
            showMessage(transLangKey('MSG_CONFIRM'), response.data.message, { close: false });
            setDisabled(true);
            saveData.stepCd = stepList.find(step => step.value === saveData.stepCd).label;
            setMainVersion(saveData);
          }
        }).catch(function (err) {
          console.log(err);
        }).then(function () {
        });
      }
    });
  }

  const filterTimeForStart = useCallback((time) => {
    const endTs = new Date(watch('planningTs')[1]);
    const startTs = new Date(time);
    return startTs.getTime() <= endTs.getTime();
  }, [watch('planningTs')]);

  const filterTimeForEnd = useCallback((time) => {
    const startTs = new Date(watch('planningTs')[0]);
    const endTs = new Date(time);
    return startTs.getTime() <= endTs.getTime();
  }, [watch('planningTs')]);

  const filterTimeForFreeze = useCallback((time) => {
    const planningTs = watch('planningTs');
    const startTs = new Date(planningTs[0]);
    const endTs = new Date(planningTs[1]);
    return startTs.getTime() <= time && time < endTs.getTime();
  }, [watch('planningTs')]);

  function generateNewMainVersion() {
    setDefaultVersion(true);
    clearErrors();
  }

  const Content = (
    <>
      <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
        <Table sx={tableStyles}>
          <TableBody>
            <Row title={transLangKey('DESCRIP')}>
              <InputField inputType="labelText" variant="standard" name="descTxt" placeholder={transLangKey('FP_MSG_ENTER_DESCRIP')}
                          rules={{ required: true }} helperText={helperText} useLabel={false}
                          InputProps={{...getReadOnlyProps()}} readonly={disabled}
                          wrapStyle={{ alignItems: 'center' }} inputStyle={{ width: '180px' }} control={control} />
            </Row>
            <Row title={transLangKey('PLAN_HORIZ')}>
              <InputField inputType="labelText" variant="standard" name="planningTs" type="dateRange" dateformat="yyyy-MM-dd HH:mm"
                          rules={{ validate: { required: value => !value.includes('') } }} helperText={helperText} useLabel={false} placeholderText=" "
                          InputProps={{...getReadOnlyProps()}} readonly={disabled}
                          min={[null, new Date(watch('planningTs')[0])]} max={[new Date(watch('planningTs')[1])]} filterTime={[filterTimeForStart, filterTimeForEnd]}
                          wrapStyle={{ alignItems: 'center' }} inputStyle={{ width: '180px' }} control={control} />
            </Row>
            <Row title={transLangKey('FP_FREEZE_HORIZON')}>
              <InputField inputType="labelText" variant="standard" name="freezeTs" type="datetime" dateformat="yyyy-MM-dd HH:mm"
                          rules={{
                            required: true,
                            validate: { freezeTs: value => new Date(getValues('planningTs')[0]) <= value && value < new Date(getValues('planningTs')[1]) }
                          }} helperText={helperText} useLabel={false}
                          InputProps={{...getReadOnlyProps()}} readonly={disabled}
                          min={new Date(watch('planningTs')[0])} max={new Date(watch('planningTs')[1])} filterTime={filterTimeForFreeze}
                          wrapStyle={{ alignItems: 'center' }} inputStyle={{ width: '180px' }} control={control} />
            </Row>
            <Row title={transLangKey("FP_SIMULATION_STEP")}>
              <InputField inputType="labelText" variant="standard" name="stepCd" type="select"
                          rules={{ required: true }} helperText={helperText} options={stepList} useLabel={false}
                          placeholder={transLangKey('FP_MSG_SELECT_SIMULATION_STEP')}
                          InputProps={{...getReadOnlyProps()}} readonly={disabled}
                          wrapStyle={{ alignItems: 'center' }} inputStyle={{ width: '180px' }} control={control} />
            </Row>
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );

  return (
    <Details id="versionCreation" title={mainVersionCd} style={{ height: 'calc(100% - 102px)', py: '0 !important', overflow: 'auto' }} footerAction={Action}>
      {Content}
    </Details>
  );
}

export default VersionCreation; 
