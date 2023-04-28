import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation } from "react-router-dom";
import { Card, Box, Button, Grid, List, Divider, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { ContentInner, ResultArea, SearchArea, SearchRow, useViewStore, zAxios, InputField } from '@zionex/wingui-core/src/common/imports';
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from '@mui/icons-material/Remove';
import { makeStyles } from '@mui/styles';
import PopPlanPolicyVersion from './PopPlanPolicyVersion';
import PopNewPlanPolicyVersion from './PopNewPlanPolicyVersion';

import General from './General';
import DemandFacingLevel from './DemandFacingLevel';
import ConfirmedPlanningLevel from './ConfirmedPlanningLevel';
import InFinitePlanningLevel from './InFinitePlanningLevel';
import PlanPolicyCoverage from './PlanPolicyCoverage';
import PlanPriority from './PlanPriority';
import SubPlanPriority from './SubPlanPriority';
import PlanningMethod from './PlanningMethod';
import AllocationRuleSite from './AllocationRuleSite';
import AllocationRuleResource from './AllocationRuleResource';
import AllocationRulePartialPlan from './AllocationRulePartialPlan';
import PlanOption from './PlanOption';

const useCardStyles = makeStyles({
  card: {
    height: '100%',
    borderRadius: 6,
    border: 'none',
    boxShadow: 'rgb(90 114 123 / 11%) 0px 7px 30px 0px, rgb(0 0 0 / 5%) 0px 1px 3px -1px',
    '& > div': {
      paddingRight: '1rem',
      paddingLeft: '1rem'
    },
    '& > div:first-child': {
      paddingTop: '1rem',
      paddingBottom: '0'
    },
    '& > div:last-child': {
      paddingBottom: '1rem'
    },
    '& .MuiCardHeader-root': {
      '& .MuiCardHeader-content': {
        height: 30
      },
      '& .MuiCardHeader-action': {
        marginTop: 0,
        marginRight: 0
      }
    },
  }
});

function PlanPolicy(props) {
  const classes = useCardStyles();
  const location = useLocation();
  const moduleId = props.module ? props.module : (location && location.state && location.state.params && location.state.params.moduleCode) ? location.state.params.moduleCode : 'MP';

  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const [planPolicyVersionPopupOpen, setPlanPolicyVersionPopupOpen] = useState(false);
  const [newPlanPolicyVersionPopupOpen, setNewPlanPolciyVersionPopupOpen] = useState(false);

  const [moduleValue, setModuleValue] = useState('');

  const [planTpOption, setPlanTpOption] = useState([]);

  const [planPolicyTreeData, setPlanPolicyTreeData] = useState([]);
  const [currentPolicy, setCurrentPolicy] = useState(null);

  const generalRef = useRef();
  const demandFacingLevelRef = useRef();
  const confirmedPlanningLevelRef = useRef();
  const inFinitePlanningLevelRef = useRef();
  const planPolicyCoverageRef = useRef();
  const planPriorityRef = useRef();
  const subPlanPriorityRef = useRef();
  const planningMethodRef = useRef();
  const allocationRuleSiteRef = useRef();
  const allocationRuleResourceRef = useRef();
  const allocationRulePartialPlanRef = useRef();
  const planOptionRef = useRef();

  const [currentGeneralRef, setCurrentGeneralRef] = useState();
  const [currentDemandFacingLevelRef, setCurrentDemandFacingLevelRef] = useState();
  const [currentConfirmedPlanningLevelRef, setCurrentConfirmedPlanningLevelRef] = useState();
  const [currentInFinitePlanningLevelRef, setCurrentInFinitePlanningLevelRef] = useState();
  const [currentPlanPolicyCoverageRef, setCurrentPlanPolicyCoverageRef] = useState();
  const [currentPlanPriorityRef, setCurrentPlanPriorityRef] = useState();
  const [currentSubPlanPriorityRef, setCurrentSubPlanPriorityRef] = useState();
  const [currentPlanningMethodRef, setCurrentPlanningMethodRef] = useState();
  const [currentAllocationRuleSiteRef, setCurrentAllocationRuleSiteRef] = useState();
  const [currentAllocationRuleResourceRef, setCurrentAllocationRuleResourceRef] = useState();
  const [currentAllocationRulePartialPlanRef, setCurrentAllocationRulePartialPlanRef] = useState();
  const [currentPlanOptionRef, setCurrentPlanOptionRef] = useState();

  const [planPolicyId, setPlanPolicyId] = useState();

  const { control, getValues, setValue, reset } = useForm({
    defaultValues: {
      planPolicyId: '',
      planPolicyModuleName: 'Policy Module',
      planPolicyVersion: 'Policy Version',
      planPolicyDescrip: '',
      locationFlag: true
    }
  });

  useEffect(() => {
    if (generalRef) {
      if (generalRef.current) {
        setCurrentGeneralRef(generalRef.current);
      }
    }

    if (demandFacingLevelRef) {
      if (demandFacingLevelRef.current) {
        setCurrentDemandFacingLevelRef(demandFacingLevelRef.current);
      }
    }

    if (confirmedPlanningLevelRef) {
      if (confirmedPlanningLevelRef.current) {
        setCurrentConfirmedPlanningLevelRef(confirmedPlanningLevelRef.current);
      }
    }

    if (inFinitePlanningLevelRef) {
      if (inFinitePlanningLevelRef.current) {
        setCurrentInFinitePlanningLevelRef(inFinitePlanningLevelRef.current);
      }
    }

    if (planPolicyCoverageRef) {
      if (planPolicyCoverageRef.current) {
        setCurrentPlanPolicyCoverageRef(planPolicyCoverageRef.current);
      }
    }

    if (planPriorityRef) {
      if (planPriorityRef.current) {
        setCurrentPlanPriorityRef(planPriorityRef.current);
      }
    }

    if (subPlanPriorityRef) {
      if (subPlanPriorityRef.current) {
        setCurrentSubPlanPriorityRef(subPlanPriorityRef.current);
      }
    }

    if (planningMethodRef) {
      if (planningMethodRef.current) {
        setCurrentPlanningMethodRef(planningMethodRef.current);
      }
    }

    if (allocationRuleSiteRef) {
      if (allocationRuleSiteRef.current) {
        setCurrentAllocationRuleSiteRef(allocationRuleSiteRef.current);
      }
    }

    if (allocationRuleResourceRef) {
      if (allocationRuleResourceRef.current) {
        setCurrentAllocationRuleResourceRef(allocationRuleResourceRef.current);
      }
    }

    if (allocationRulePartialPlanRef) {
      if (allocationRulePartialPlanRef.current) {
        setCurrentAllocationRulePartialPlanRef(allocationRulePartialPlanRef.current);
      }
    }

    if (planOptionRef) {
      if (planOptionRef.current) {
        setCurrentPlanOptionRef(planOptionRef.current);
      }
    }

  }, [viewData]);

  useEffect(() => {
    if (location.state !== undefined && location.state !== null) {
      if (location.state.params !== undefined) {
        let data = location.state.params;
        setModuleValue(data.module);
        let dataRow = {};

        dataRow['ID'] = data.planPolicy.PLAN_POLICY_MGMT_ID;
        dataRow['MODULE_NM'] = '';
        dataRow['PLAN_POLICY_VER_ID'] = data.planPolicy.PLAN_POLICY_VER_ID;
        dataRow['DESCP'] = data.planPolicy.PLAN_POLICY_VER_DESCRIP;

        onSetPlanPolicyVersion(dataRow);
      }
    } else {
      if (getValues('locationFlag')) {
        setSelectOptions();
        setValue('locationFlag', false);
      }
    }
  }, [location]);

  function onSetPlanPolicyVersion(gridRow) {
    setPlanPolicyId(gridRow.ID);
    setValue('planPolicyId', gridRow.ID);
    setValue('planPolicyModuleName', gridRow.MODULE_NM);
    setValue('planPolicyVersion', gridRow.PLAN_POLICY_VER_ID);
    setValue('planPolicyDescrip', gridRow.DESCP);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_CM_15_Q4',
      data: new FormData()
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        setPlanPolicyTreeData(res.data.RESULT_DATA);
        let defaultPolicy = res.data.RESULT_DATA.filter((data) => data.COMN_CD === "PP_CON_01");
        setCurrentPolicy(defaultPolicy[0]);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
  }

  function onSetNewPlanPolicyVersion() {
    let formData = new FormData();
    formData.append('MODULE_ID', moduleValue);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_CM_15_Q2',
      data: formData
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        onSetPlanPolicyVersion(res.data.RESULT_DATA[res.data.RESULT_DATA.length - 1]);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
  }

  function setSelectOptions() {
    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_CM_15_Q1',
      data: new FormData()
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        let dataArr = res.data.RESULT_DATA.filter(code => code.KEY_VALUE === 'MODULE').filter(data => data.COMN_CD === moduleId);
        setModuleValue(dataArr[0].ID);
        setPlanPolicyVersionPopupOpen(true);

        let planTpOption = [];
        res.data.RESULT_DATA.filter(code => code.KEY_VALUE === 'PLAN_TYPE').map((data) => {
          planTpOption.push({ value: data.ID, label: transLangKey(data.COMN_CD) });
        });

        setPlanTpOption(planTpOption);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
  }

  function deletePlanPolicyVersion() {
    showMessage(transLangKey('DELETE'), transLangKey('MSG_5133'), function (answer) {
      if (answer) {
        let formData = new FormData();

        formData.append('PP_ID', planPolicyId);

        zAxios({
          method: 'post',
          url: baseURI() + 'engine/mp/SRV_UI_CM_15_S5',
          data: formData
        })
        .then(function (res) {
          showMessage(transLangKey('DELETE'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_CM_15_S5_P_RT_MSG), { close: false })
          reset();
        })
        .catch(function (e) {
          console.error(e);
        })
        .then(function () {
          onSetPlanPolicyVersion({});
        });
      }
    });
  }

  useEffect(() => {
    if (currentPolicy) {
      let selectPolicyCode = currentPolicy.COMN_CD;

      if (selectPolicyCode === "PP_CON_01") {
        currentGeneralRef.initLoad(planPolicyId);
      } else if (selectPolicyCode === "PP_CON_02") {
        currentDemandFacingLevelRef.initLoad(planPolicyId);
      } else if (selectPolicyCode === "PP_CON_03") {
        currentConfirmedPlanningLevelRef.initLoad(planPolicyId);
      } else if (selectPolicyCode === "PP_CON_04") {
        currentInFinitePlanningLevelRef.initLoad(planPolicyId);
      } else if (selectPolicyCode === "PP_CON_05") {
        currentPlanPolicyCoverageRef.initLoad(planPolicyId);
      } else if (selectPolicyCode === "PP_CON_06") {
        currentPlanPriorityRef.initLoad(planPolicyId);
      } else if (selectPolicyCode === "PP_CON_07") {
        currentSubPlanPriorityRef.initLoad(planPolicyId);
      } else if (selectPolicyCode === "PP_CON_10") {
        currentPlanningMethodRef.initLoad(planPolicyId);
      } else if (selectPolicyCode === "PP_CON_11") {
        currentAllocationRuleSiteRef.initLoad(planPolicyId);
      } else if (selectPolicyCode === "PP_CON_12") {
        currentAllocationRuleResourceRef.initLoad(planPolicyId);
      } else if (selectPolicyCode === "PP_CON_13") {
        currentAllocationRulePartialPlanRef.initLoad(planPolicyId);
      } else if (selectPolicyCode === "PP_CON_15") {
        currentPlanOptionRef.initLoad(planPolicyId);
      }
    }
  }, [currentPolicy])

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <InputField type='action' name='planPolicyVersion' label={transLangKey('PLAN_POLICY_VERSION')} title={transLangKey('SEARCH')} onClick={() => { setPlanPolicyVersionPopupOpen(true) }} control={control}>
              <Icon.Search />
            </InputField>
            <InputField name='planPolicyDescrip' label={transLangKey('PLAN_POLICY_DESCRIP')} control={control} style={{ width: 260 }} />
          </SearchRow>
        </SearchArea>
        <ResultArea>
          <Grid container spacing={11} sx={{ height: 1, mt: 0, minWidth: 1475 }}>
            <Grid item sx={{ height: 1, minWidth: 300 }} xs={2.5}>
              <Card id='policyDetals' variant='outlined' className={classes.card} style={{ minWidth: 300, height: 'calc(100%-24px)', padding: '0 !important' }}>
                <Box sx={{ padding: '10px' }}>
                  <Box sx={{ color: 'text.primary', fontSize: 22, fontWeight: 'medium' }}>
                    {getValues('planPolicyVersion')}
                  </Box>
                  <Box sx={{ color: 'text.primary', fontSize: 16, fontWeight: 'Normal' }} style={{ display: "none" }}>
                    {getValues('planPolicyModuleName')}
                  </Box>
                  <Box style={{ textAlign: 'left' }}>
                    <Button variant='outlined' sx={{ borderRadius: 4, minWidth: 80, width: 'fit-content', margin: '18px 0' }} onClick={() => { setNewPlanPolciyVersionPopupOpen(true) }}><AddIcon color='primary' /></Button>
                    <Button variant='outlined' sx={{ borderRadius: 4, minWidth: 80, width: 'fit-content', margin: '18px 10px' }} onClick={() => { deletePlanPolicyVersion() }}><RemoveIcon color='primary' /></Button>
                  </Box>
                  <List >
                    {
                      [
                        <Divider key='top-divider' />,
                        planPolicyTreeData.map(item => (
                          [
                            <ListItem sx={{ padding: 0 }} key={`list-item-${item.COMN_CD}`}>
                              <ListItemButton sx={{ padding: 5, backgroundColor: (currentPolicy && item.COMN_CD === currentPolicy.COMN_CD) ? 'aliceblue' : 'transparent' }} onClick={() => setCurrentPolicy(item)}>
                                <ListItemText sx={{ '& .MuiListItemText-primary': { fontWeight: (currentPolicy && item.COMN_CD === currentPolicy.COMN_CD) ? 'bold' : 'inherit' } }} primary={item.COMN_CD_NM} />
                              </ListItemButton>
                            </ListItem>,
                            <Divider key={`divider-${item.COMN_CD}`} />
                          ]
                        ))
                      ]
                    }
                  </List>
                </Box>
              </Card>
            </Grid>
            <Grid item sx={{ height: '100%' }} xs={9.5}>
              <Grid sx={{ minWidth: 1260, height: '100%' }}>
                <Box id='PP_CON_01' style={{ display: (currentPolicy && currentPolicy.COMN_CD === 'PP_CON_01') ? 'block' : 'none', height: '100%' }}>
                  <General ref={generalRef} planPolicyId={planPolicyId}></General>
                </Box>
                <Box id='PP_CON_02' style={{ display: (currentPolicy && currentPolicy.COMN_CD === 'PP_CON_02') ? 'block' : 'none', height: '100%' }}>
                  <DemandFacingLevel ref={demandFacingLevelRef} planPolicyId={planPolicyId}></DemandFacingLevel>
                </Box>
                <Box id='PP_CON_03' style={{ display: (currentPolicy && currentPolicy.COMN_CD === 'PP_CON_03') ? 'block' : 'none', height: '100%' }}>
                  <ConfirmedPlanningLevel ref={confirmedPlanningLevelRef} planPolicyId={planPolicyId}></ConfirmedPlanningLevel>
                </Box>
                <Box id='PP_CON_04' style={{ display: (currentPolicy && currentPolicy.COMN_CD === 'PP_CON_04') ? 'block' : 'none', height: '100%' }}>
                  <InFinitePlanningLevel ref={inFinitePlanningLevelRef} planPolicyId={planPolicyId}></InFinitePlanningLevel>
                </Box>
                <Box id='PP_CON_05' style={{ display: (currentPolicy && currentPolicy.COMN_CD === 'PP_CON_05') ? 'block' : 'none', height: '100%' }}>
                  <PlanPolicyCoverage ref={planPolicyCoverageRef} planPolicyId={planPolicyId}></PlanPolicyCoverage>
                </Box>
                <Box id='PP_CON_06' style={{ display: (currentPolicy && currentPolicy.COMN_CD === 'PP_CON_06') ? 'block' : 'none', height: '100%' }}>
                  <PlanPriority ref={planPriorityRef} planPolicyId={planPolicyId}></PlanPriority>
                </Box>
                <Box id='PP_CON_07' style={{ display: (currentPolicy && currentPolicy.COMN_CD === 'PP_CON_07') ? 'block' : 'none', height: '100%' }}>
                  <SubPlanPriority ref={subPlanPriorityRef} planPolicyId={planPolicyId}></SubPlanPriority>
                </Box>
                <Box id='PP_CON_10' style={{ display: (currentPolicy && currentPolicy.COMN_CD === 'PP_CON_10') ? 'block' : 'none', height: '100%' }}>
                  <PlanningMethod ref={planningMethodRef} planPolicyId={planPolicyId}></PlanningMethod>
                </Box>
                <Box id='PP_CON_11' style={{ display: (currentPolicy && currentPolicy.COMN_CD === 'PP_CON_11') ? 'block' : 'none', height: '100%' }}>
                  <AllocationRuleSite ref={allocationRuleSiteRef} planPolicyId={planPolicyId}></AllocationRuleSite>
                </Box>
                <Box id='PP_CON_12' style={{ display: (currentPolicy && currentPolicy.COMN_CD === 'PP_CON_12') ? 'block' : 'none', height: '100%' }}>
                  <AllocationRuleResource ref={allocationRuleResourceRef} planPolicyId={planPolicyId}></AllocationRuleResource>
                </Box>
                <Box id='PP_CON_13' style={{ display: (currentPolicy && currentPolicy.COMN_CD === 'PP_CON_13') ? 'block' : 'none', height: '100%' }}>
                  <AllocationRulePartialPlan ref={allocationRulePartialPlanRef} planPolicyId={planPolicyId}></AllocationRulePartialPlan>
                </Box>
                <Box id='PP_CON_15' style={{ display: (currentPolicy && currentPolicy.COMN_CD === 'PP_CON_15') ? 'block' : 'none', height: '100%' }}>
                  <PlanOption ref={planOptionRef} planPolicyId={planPolicyId}></PlanOption>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </ResultArea>
      </ContentInner>
      {planPolicyVersionPopupOpen && <PopPlanPolicyVersion open={planPolicyVersionPopupOpen} onClose={() => { setPlanPolicyVersionPopupOpen(false) }} confirm={onSetPlanPolicyVersion} module={moduleValue} />}
      {newPlanPolicyVersionPopupOpen && <PopNewPlanPolicyVersion open={newPlanPolicyVersionPopupOpen} onClose={() => { setNewPlanPolciyVersionPopupOpen(false) }} moduleId={moduleValue} module={moduleId} planTpOption={planTpOption} confirm={onSetNewPlanPolicyVersion} />}
    </>
  )
}

export default PlanPolicy;
