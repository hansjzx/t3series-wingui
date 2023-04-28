import React, { useState, useEffect } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { useContentStore } from '@zionex/wingui-core/src/store/contentStore';
import { useForm } from 'react-hook-form';
import { BaseGrid, ButtonArea, GridAddRowButton, GridDeleteRowButton, InputField, PopupDialog, RightButtonArea, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import PopUILink from './PopUILink';
import PopProcedure from './PopProcedure';
import PopConfirmSubjectPlan from './PopConfirmSubjectPlan';
import PopPlanPolicy from './PopPlanPolicy';

let gridItems = [
  { name: 'PARENT_MENU_NM', headerText: 'MENU_ID', dataType: 'string', width: '80', visible: true, editable: false },
  { name: 'MENU_ID', headerText: 'UI_ID', dataType: 'string', width: '200', visible: false, editable: false },
  { name: 'MENU_NM', headerText: 'UI_NM', dataType: 'string', width: '200', visible: true, editable: false, textAlignment: 'left', button: 'action' },
  { name: 'MENU_PATH', headerText: 'MENU_PATH', dataType: 'string', width: '200', visible: false, editable: false }
]

function PopPlanScenarioStep(props) {
  const [grid, setGrid] = useState(null);
  const [username] = useUserStore(state => [state.username]);

  const [tabValue, setTabValue] = useState('scenario');
  const [moduleOptions, setModuleOptions] = useState([]);
  const [processTypeOptions, setProcessTypeOptions] = useState([]);
  const [confirmMethodOptions, setConfirmMethodOptions] = useState([]);
  const [confirmMethodDisabled, setConfirmMethodDisabled] = useState(true);
  const [subDemandGenerateDisabled, setSubDemandGenerateDisabled] = useState(true);
  const [planPolicyDisabled, setPlanPolicyDisabled] = useState(true);
  const [confirmPlanDisabled, setConfirmPlanDisabled] = useState(true);
  const [uiLinkPopupOpen, setUILinkPopupOpen] = useState(false);
  const [procedurePopupOpen, setProcedurePopupOpen] = useState(false);
  const [confirmSubjectPlanPopupOpen, setConfirmSubjectPlanPopupOpen] = useState(false);
  const [planPolicyPopupOpen, setPlanPolicyPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState({});
  const [firstLoad, setFirstLoad] = useState(true);

  const languageCode = useContentStore(state => state.languageCode);

  const { reset, getValues, setValue, control, watch } = useForm({
    defaultValues: {
      module: props.data.MODULE_ID,
      scenarioVersion: props.data.SNRIO_VER_ID,
      scenarioDescription: props.data.DESCRIP,
      step: '',
      processDescription: '',
      processType: '',
      confirmMethod: '',
      subDemandGenerate: [],
      active: ['Y'],
      procedureName: '',
      confirmStepId: '',
      confirmStep: '',
      confirmProcessDescription: '',
      planPolicyId: '',
      planPolicy: '',
      planPolicyProcessDescription: ''
    }
  });

  useEffect(() => {
    async function initLoad() {
      await setModuleLookup();
      await setProcessTypeLookup();
    }

    initLoad();
  }, []);

  useEffect(() => {
    if (getValues('processType') !== '') {
      setConfirmMethodLookup();
      setPopupData({ 'module': props.data.MODULE_ID, 'process': getValues('processType') })

      if (firstLoad && props.detailData) {
        setFirstLoad(false);
      } else {
        reset({
          ...getValues(),
          confirmMethod: '',
          subDemandGenerate: [],
          procedureName: '',
          confirmStepId: '',
          confirmStep: '',
          confirmProcessDescription: '',
          planPolicyId: '',
          planPolicy: '',
          planPolicyProcessDescription: ''
        });
      }

      processTypeOptions.map(option => {
        if (option.value === getValues('processType')) {
          if (option.label === 'Adjust Plan' || option.label === 'Auto Plan') {
            enableConfirmMethod();
          } else {
            disableConfirmMethod();
          }

          if (option.label === 'Plan Confirm') {
            enableSubDemandGenerate();
            enableConfirmPlan();
          } else {
            disableSubDemandGenerate();
            disableConfirmPlan();
          }

          if (option.label === 'Adjust Plan' || option.label === 'Auto Plan' || option.label === 'Procedure') {
            enablePlanPolicy();
          } else {
            disablePlanPolicy();
          }

          return;
        }
      });
    }
  }, [watch('processType')]);

  useEffect(() =>  {
    if (props.detailData) {
      if (grid) {
        loadData();
      }
    }
  }, [grid]);

  function setDetailData() {
    setValue('processType', props.detailData.PROCESS_TP_ID ? props.detailData.PROCESS_TP_ID : '');
    setValue('step', props.detailData.STEP ? props.detailData.STEP : '');
    setValue('processDescription', props.detailData.PROCESS_DESCRIP ? props.detailData.PROCESS_DESCRIP : '');
    setValue('confirmMethod', props.detailData.CONFRM_MTD_ID ? props.detailData.CONFRM_MTD_ID : '');
    setValue('subDemandGenerate', props.detailData.LOWR_DMND_CREATE_YN ? ['Y'] : []);
    setValue('active', props.detailData.ACTV_YN ? ['Y'] : []);
    setValue('procedureName', props.detailData.PROC_NM ? props.detailData.PROC_NM : '');
    setValue('confirmStepId', props.detailData.CONFRM_PLAN_SNRIO_MGMT_DTL_ID ? props.detailData.CONFRM_PLAN_SNRIO_MGMT_DTL_ID : '');
    setValue('confirmStep', props.detailData.CONFRM_PLAN_SNRIO_STEP ? props.detailData.CONFRM_PLAN_SNRIO_STEP : '');
    setValue('confirmProcessDescription', props.detailData.CONFRM_PLAN_SNRIO_PROCESS ? props.detailData.CONFRM_PLAN_SNRIO_PROCESS : '');
    setValue('planPolicyId', props.detailData.PLAN_POLICY_MGMT_ID ? props.detailData.PLAN_POLICY_MGMT_ID : '');
    setValue('planPolicy', props.detailData.PLAN_POLICY_MGMT_VER ? props.detailData.PLAN_POLICY_MGMT_VER : '');
    setValue('planPolicyProcessDescription', props.detailData.PLAN_POLICY_MGMT_DESC ? props.detailData.PLAN_POLICY_MGMT_DESC : '');
  }

  function afterGridCreate(gridObj, gridView, dataProvider) {
    setGrid(gridObj)
    setGridOptions(gridObj);
  }

  function setGridOptions(grid) {
    grid.gridView.setEditOptions({
      insertable: true,
      appendable: true
    });

    grid.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(grid, true, true, true);

    grid.gridView.onCellButtonClicked = function () {
      grid.gridView.commit(true);
      openUILinkPopup();
    };
  }

  function setModuleLookup() {
    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_CM_15_Q1',
      data: new FormData(),
      fromPopup: true
    })
      .then(function (res) {
        let moduleLookup = [];
        if (res.status === gHttpStatus.SUCCESS) {
          res.data.RESULT_DATA.forEach(option =>  {
            if (option.KEY_VALUE === 'MODULE') {
              moduleLookup.push({ value: option.ID, label: option.COMN_CD });
            }
          });
          setModuleOptions(moduleLookup);
        }
      })
      .catch(function (err) {
        console.error(err);
      });
  }

  function setProcessTypeLookup() {
    let params = new URLSearchParams();

    params.append('Q_TYPE', 'IM_PROCESS_TP_CHANGE');
    params.append('VAL_01', props.data.MODULE_ID);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_CM_16_Q2',
      data: params,
      fromPopup: true
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          setProcessTypeOptions(res.data.RESULT_DATA.map(v => ({ value: v.CD, label: v.CD_NM })));
        }
      })
      .catch(function (err) {
        console.error(err);
      })
      .then(function () {
        if (props.detailData) {
          setDetailData();
        }
      });
  }

  function setConfirmMethodLookup() {
    let params = new URLSearchParams();

    params.append('Q_TYPE', 'EXTEND_LOV_01');
    params.append('VAL_01', getValues('processType'));
    params.append('VAL_02', props.data.MODULE_ID);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_CM_16_Q2',
      data: params,
      fromPopup: true
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          setConfirmMethodOptions(res.data.RESULT_DATA.map(v => ({ value: v.ID, label: v.COMN_CD_NM })));
        }
      })
      .catch(function (err) {
        console.error(err);
      });
  }

  const tabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  function loadData() {
    let params = new URLSearchParams();

    params.append('Q_TYPE', 'UI_ID');
    params.append('VAL_01', '');
    params.append('VAL_02', '');
    params.append('LANG_CD', languageCode);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_CM_16_Q2',
      data: params,
      fromPopup: true
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          grid.dataProvider.clearRows();

          let data = [];
          Object.entries(props.detailData).forEach(function ([key, value]) {
            if (key.includes('UI_ID_0') && value) {
              data.push(value);
            }
          });

          let gridData = res.data.RESULT_DATA.filter(result => data.includes(result.MENU_ID));
          grid.setData(gridData);
        }
      })
      .catch(function (err) {
        console.error(err);
      });
  }

  function saveSubmit() {
    let formData = new FormData();
    let rows = [];

    grid.dataProvider.getJsonRows().forEach(function (row) {
      if (row.MENU_ID !== undefined) {
        rows.push(row);
      }
    });

    formData.append('ID', props.detailData ? props.detailData.DTL_ID : '');
    formData.append('PLAN_SNRIO_MGMT_MST_ID', props.data.MST_ID);
    formData.append('STEP', getValues('step'));
    if (getValues('processDescription') !== '') {
      formData.append('PROCESS_DESCRIP', getValues('processDescription'));
    }
    if (getValues('processType') !== '') {
      formData.append('PROCESS_TP_ID', getValues('processType'));
    }
    if (getValues('confirmMethod') !== '') {
      formData.append('CONFRM_METHD_ID', getValues('confirmMethod'));
    }
    formData.append('LOWR_DMND_CREATE_YN', getValues('subDemandGenerate').includes('Y'));

    let count = 1;
    rows.forEach(function (row) {
      if (count > 5) {
        return;
      }

      formData.append('UI_ID_0' + count, row.MENU_ID);
      count = count + 1;
    });

    if (getValues('procedureName')) {
      formData.append('PROC', getValues('procedureName'));
    }
    if (getValues('confirmStepId') !== '') {
      formData.append('CONFRM_PLAN_SNRIO_MGMT_DTL_ID', getValues('confirmStepId'));
    }
    if (getValues('planPolicyId') !== '') {
      formData.append('PLAN_POLICY_MGMT_ID', getValues('planPolicyId'));
    }
    formData.append('ACTV_YN', getValues('active').includes('Y'));
    formData.append('MODULE_ID', props.data.MODULE_ID);
    formData.append('USER_ID', username);

    zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_16_S2", formData)
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          const rsData = res.data;
          if (rsData.RESULT_SUCCESS) {
            const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_16_S2_P_RT_MSG;
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

    // zAxios({
    //   method: 'post',
    //   header: { 'content-type': 'application/json' },
    //   url: baseURI() + 'engine/mp/SRV_UI_CM_16_S2',
    //   data: params,
    //   fromPopup: true
    // })
    // .then(function (res) {
    //   if (res.data.RESULT_SUCCESS) {
    //     showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_CM_16_S2_P_RT_MSG), { close: false });
    //   } else {
    //     showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
    //   }

    //   props.confirm();
    //   props.onClose();
    // })
    // .catch(function (err) {
    //   console.log(err);
    // });
  }

  function enableConfirmMethod() {
    setConfirmMethodDisabled(false);
  }

  function disableConfirmMethod() {
    setConfirmMethodDisabled(true);
  }

  function enableSubDemandGenerate() {
    setSubDemandGenerateDisabled(false);
  }

  function disableSubDemandGenerate() {
    setSubDemandGenerateDisabled(true);
  }

  function enablePlanPolicy() {
    setPlanPolicyDisabled(false);
  }

  function disablePlanPolicy() {
    setPlanPolicyDisabled(true);
  }

  function enableConfirmPlan() {
    setConfirmPlanDisabled(false);
  }

  function disableConfirmPlan() {
    setConfirmPlanDisabled(true);
  }

  function openUILinkPopup() {
    setUILinkPopupOpen(true);
  }

  function closeUILinkPopup() {
    setUILinkPopupOpen(false);
  }

  function onSetUILink(gridRow) {
    let itemIndex = grid.gridView.getCurrent().dataRow;

    grid.dataProvider.setValue(itemIndex, 'PARENT_MENU_NM', gridRow.PARENT_MENU_NM);
    grid.dataProvider.setValue(itemIndex, 'MENU_ID', gridRow.MENU_ID);
    grid.dataProvider.setValue(itemIndex, 'MENU_NM', gridRow.MENU_NM);
    grid.dataProvider.setValue(itemIndex, 'MENU_PATH', gridRow.MENU_PATH);
  }

  function openProcedurePopup() {
    setProcedurePopupOpen(true);
  }

  function closeProcedurePopup() {
    setProcedurePopupOpen(false);
  }

  function onSetProcedure(gridRow) {
    setValue('procedureName', gridRow.PROC_NM);
  }

  function openConfirmSubjectPlanPopup() {
    setConfirmSubjectPlanPopupOpen(true);
  }

  function closeConfirmSubjectPlanPopup() {
    setConfirmSubjectPlanPopupOpen(false);
  }

  function onSetConfirmSubjectPlan(gridRow) {
    setValue('confirmStepId', gridRow.DTL_ID)
    setValue('confirmStep', gridRow.STEP);
    setValue('confirmProcessDescription', gridRow.PROCESS_DESCRIP);
  }

  function openPlanPolicyPopup() {
    setPlanPolicyPopupOpen(true);
  }

  function closePlanPolicyPopup() {
    setPlanPolicyPopupOpen(false);
  }

  function onSetPlanPolicy(gridRow) {
    setValue('planPolicyId', gridRow.ID);
    setValue('planPolicy', gridRow.PLAN_POLICY_VER_ID);
    setValue('planPolicyProcessDescription', gridRow.DESCP);
  }

  return (
    <>
      <PopupDialog open={props.open} onClose={props.onClose} onSubmit={saveSubmit} title="POP_UI_CM_16_04" resizeHeight={600} resizeWidth={600}>
        <Tabs onChange={tabChange} indicatorColor="primary" value={tabValue}>
          <Tab label={transLangKey("SCENARIO")} value="scenario" />
          <Tab label={transLangKey("STEP")} value="step" />
          <Tab label={transLangKey("UI_LINK")} value="link" />
          <Tab label={transLangKey("EXEC_PROCEDURE")} value="procedure" />
          <Tab label={transLangKey("CONFRM_SUBJECT_PLAN")} value="confirmPlan" />
          <Tab label={transLangKey("POLICY")} value="policy" />
        </Tabs>

        <Box sx={{ height: "100%", display: tabValue === "scenario" ? "block" : "none" }}>
          <Box>
            <InputField type="select" name="module" label={transLangKey("MODULE_VAL")} control={control} readonly={true} style={{ width: "300px" }} options={moduleOptions} />
          </Box>
          <Box>
            <InputField name="scenarioVersion" label={transLangKey("SCENARIO_VER")} control={control} readonly={true} style={{ width: "300px" }} />
          </Box>
          <Box>
            <InputField name="scenarioDescription" label={transLangKey("SCENARIO_DESCRIP")} control={control} readonly={true} style={{ width: "300px" }} />
          </Box>
        </Box>

        <Box sx={{ height: "100%", display: tabValue === "step" ? "block" : "none" }}>
          <Box>
            <InputField name="step" label={transLangKey("STEP")} control={control} />
          </Box>
          <Box>
            <InputField name="processDescription" label={transLangKey("PROCESS_DESCRIP")} control={control} />
          </Box>
          <Box>
            <InputField type="select" name="processType" label={transLangKey("PROCESS_TP")} control={control} options={processTypeOptions} />
          </Box>
          <Box>
            <InputField type="select" name="confirmMethod" label={transLangKey("CONFRM_METHD")} control={control} disabled={confirmMethodDisabled} options={confirmMethodOptions} />
          </Box>
          <Box>
            <InputField type="check" name="subDemandGenerate" control={control} disabled={subDemandGenerateDisabled} options={[{ label: transLangKey("SUB_DMND_GENERATE_YN"), value: "Y" }]} />
          </Box>
          <Box>
            <InputField type="check" name="active" control={control} options={[{ label: transLangKey("ACTV_YN"), value: "Y" }]} />
          </Box>
        </Box>

        <Box sx={{ height: "100%", display: tabValue === "link" ? "block" : "none" }}>
          <ButtonArea>
            <RightButtonArea>
              <GridAddRowButton grid="PlanScenario_PopPlanScenarioStep_linkGrid" type="icon" />
              <GridDeleteRowButton grid="PlanScenario_PopPlanScenarioStep_linkGrid" type="icon" />
            </RightButtonArea>
          </ButtonArea>
          <BaseGrid id="PlanScenario_PopPlanScenarioStep_linkGrid" items={gridItems} afterGridCreate={afterGridCreate} />
        </Box>

        <Box sx={{ height: "100%", display: tabValue === "procedure" ? "block" : "none" }}>
          <InputField type="action" name="procedureName" label={transLangKey("PROCEDURE_NM")} control={control} style={{ width: "400px" }} onClick={() => { openProcedurePopup() }}>
            <Icon.Search />
          </InputField>
        </Box>

        <Box sx={{ height: "100%", display: tabValue === "confirmPlan" ? "block" : "none" }}>
          <Box>
            <InputField type="action" name="confirmStep" label={transLangKey("STEP")} disabled={confirmPlanDisabled} control={control} onClick={() => { openConfirmSubjectPlanPopup() }} style={{ width: "300px" }}>
              <Icon.Search />
            </InputField>
          </Box>
          <Box>
            <InputField name="confirmProcessDescription" label={transLangKey("PROCESS_DESCRIP")} disabled={confirmPlanDisabled} control={control} style={{ width: "300px" }} />
          </Box>
        </Box>

        <Box sx={{ height: "100%", display: tabValue === "policy" ? "block" : "none" }}>
          <Box>
            <InputField type="action" name="planPolicy" label={transLangKey("PLAN_POLICY")} disabled={planPolicyDisabled} control={control} onClick={() => { openPlanPolicyPopup() }} style={{ width: "300px" }}>
              <Icon.Search />
            </InputField>
          </Box>
          <Box>
            <InputField name="planPolicyProcessDescription" label={transLangKey("PROCESS_DESCRIP")} disabled={planPolicyDisabled} control={control} style={{ width: "300px" }} />
          </Box>
        </Box>
      </PopupDialog>

      {uiLinkPopupOpen && (<PopUILink open={uiLinkPopupOpen} onClose={closeUILinkPopup} confirm={onSetUILink} />)}
      {procedurePopupOpen && (<PopProcedure open={procedurePopupOpen} onClose={closeProcedurePopup} confirm={onSetProcedure} />)}
      {confirmSubjectPlanPopupOpen && (<PopConfirmSubjectPlan open={confirmSubjectPlanPopupOpen} onClose={closeConfirmSubjectPlanPopup} confirm={onSetConfirmSubjectPlan} data={props.data.MST_ID} />)}
      {planPolicyPopupOpen && (<PopPlanPolicy open={planPolicyPopupOpen} onClose={closePlanPolicyPopup} confirm={onSetPlanPolicy} data={popupData} />)}
    </>
  );
}

export default PopPlanScenarioStep;
