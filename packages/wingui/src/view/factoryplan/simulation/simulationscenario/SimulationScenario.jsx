import React, { useEffect, useRef, useState } from 'react';
import { ContentInner, InputField, ResultArea, zAxios } from "@zionex/wingui-core/src/common/imports";
import { Box, Button, Grid, TextField, Typography } from "@mui/material";
import CodeIcon from '@mui/icons-material/Code';
import { convertCamelToSnake, showMessage, transLangKey } from "@wingui";
import { Controller, useForm } from "react-hook-form";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import "./simulationscenario.css";
import { makeStyles } from "@mui/styles";
import ScenarioScriptPopup from "@wingui/view/factoryplan/simulation/simulationscenario/ScenarioScriptPopup";
import Details from "@wingui/view/factoryplan/common/component/DetailCard";
import ClickableListPanel from "@wingui/view/factoryplan/common/component/ClickableListPanel";
import { fpCommonStyles } from "@wingui/view/factoryplan/common/common";

const useDndStyles = makeStyles({
  item: {
    marginBottom: '0.8rem',
    borderRadius: '2px',
    backgroundColor: '#ebebeb',
    padding: '8px',
    transitionProperty: 'background-color',
    transitionDuration: '0.1s',
    transitionTimingFunction: 'ease-out',
    '&:hover': {
      backgroundColor: 'lightgray',
      transitionProperty: 'background-color',
      transitionDuration: '0.1s',
      transitionTimingFunction: 'ease-in'
    }
  },
  panel: {
    margin: '0.5rem 0.5rem 0 0.5rem',
    flex: 1,
    // overflow: 'auto'
  }
});
const getDraggingPanelStyle = isDraggingOver => ({ background: isDraggingOver ? 'aliceblue' : 'inherit' });
const getDraggingItemStyle = isDragging => ({ backgroundColor: isDragging ? '#cfcfcf !important' : 'inherit' });
const ruleList = {};

function SimulationScenario() {
  const classes = useDndStyles();
  const scriptPopupRef = useRef();
  const [scenarioList, setScenarioList] = useState([]);
  const [currentScenario, setCurrentScenario] = useState(null);
  const [rules, setRules] = useState({ planSeqRule: [], productionRule: [], stockUseRule: [] });
  const [selectedRules, setSelectedRules] = useState({ planSeqRule: [], productionRule: [], stockUseRule: [] });
  const [scenarioScriptPopupOpen, setScenarioScriptPopupOpen] = useState(false);
  const [radioOptions, setRadioOptions] = useState([]);
  const [isNewScenario, setIsNewScenario] = useState(true);
  const [scriptNm, setScriptNm] = useState('base_obp_plan');
  const { control, getValues, setValue, handleSubmit } = useForm({
    defaultValues: {
      policyNm: '',
      planStrategy: 'FORWARD'
    }
  });
  
  async function getSettingData () {
    try {
      const getGroupCd = (code) => `FP_${convertCamelToSnake(code).toUpperCase()}`;
      const getRules = async (code) => {
        const response = await zAxios.get(baseURI() + 'factoryplan/codes', {
          params: { 'code-group-cd': getGroupCd(code) },
          waitOn: false
        });
        setRules(prevState => ({...prevState, [code] : response.data}));
        ruleList[code] = response.data;
      }
      await getRules('planSeqRule');
      await getRules('productionRule');
      await getRules('stockUseRule');
      getScenarioList(true);
    } catch(e) {
    }
  }
  
  useEffect(() => {
    getSettingData();
    zAxios.get(baseURI() + 'factoryplan/codes', {
      params: { 'code-group-cd': 'FP_PLAN_STRATEGY' },
      waitOn: false
    })
      .then(function (response) {
        const options = response.data.map(option => ({ label: option.descripText, value: option.codeCd }));
        setRadioOptions(options);
      })
      .catch(function (err) {
        console.log(err);
      });    
  }, []);
  
  function getScenarioList(isInitialized) {
    zAxios.get(baseURI() + 'factoryplan/plan-policy', {
      waitOn: false
    })
      .then(function (response) {
        let data = response.data;
        const defaultPolicyIndex = data.findIndex(data => data.defaultYn === true);
        if (defaultPolicyIndex > 0) {
          const defaultPolicy = data.splice(defaultPolicyIndex, 1);
          data.splice(0, 0, defaultPolicy[0]);
        }
        setScenarioList(data);
        if (isInitialized) {
          const defaultPolicy = data.find(data => data.defaultYn === true);
          if (defaultPolicy) {
            setScenario(defaultPolicy);
          }
        }
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
      });
  }
  
  function createScenario() {
    setCurrentScenario(null);
    setScriptNm('base_obp_plan');
    scriptPopupRef.current.refresh();
    setIsNewScenario(true);
    setValue('policyNm', '');
    setValue('planStrategy', 'FORWARD');
    setRules(ruleList);
    setSelectedRules({ planSeqRule: [], productionRule: [], stockUseRule: [] });
  }
  
  function setScenario(scenario) {
    setCurrentScenario(scenario);
    setScriptNm(scenario.scriptNm);
    setIsNewScenario(false);
    setValue('policyNm', scenario.policyNm);
    loadData(scenario.policyCd);
  }
  
  function loadData(policyCd) {
    const snakeToCamel = str =>
      str.toLowerCase().replace(/([-_][a-z])/g, (group) =>
        group
          .toUpperCase()
          .replace('_', '')
      );
    let selectedRules = { planSeqRule: [], productionRule: [], stockUseRule: [] },
      rules = JSON.parse(JSON.stringify(ruleList));
    zAxios.get(baseURI() + 'factoryplan/plan-policy-detail', {
      params: { 'policy-cd': policyCd },
      waitOn: false
    })
      .then(function (response) {
        const codeList = ['planStrategy', 'planSeqRule', 'productionRule', 'stockUseRule'];
        const list = response.data.filter(data => codeList.includes(snakeToCamel(data.categoryCd.replaceAll('FP_', ''))));
        let planStrategy;
        list.forEach(function(policyDetail) {
          const code = snakeToCamel(policyDetail.categoryCd.replaceAll('FP_', '')),
            value = policyDetail.itemVal;
          if (code === 'planStrategy') {
            planStrategy = value;
          } else {
            const add = rules[code].find(rule => rule.codeCd === value);
            selectedRules[code].push(add);
            rules[code] = rules[code].filter(rule => rule.codeCd !== value);
          }
        });
        setValue('planStrategy', planStrategy ? planStrategy : 'FORWARD');
        setSelectedRules(selectedRules);
        setRules(rules);
      })
      .catch(function (err) {
        console.log(err);
      });
  }
  
  function saveData() {
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        const policyCd = isNewScenario ? null : currentScenario.policyCd;
        let saveData = Object.keys(selectedRules)
          .map(ruleName => (
            selectedRules[ruleName].map((rule, index) => (
              { policyCd, categoryCd: rule.codeGroupCd, itemVal: rule.codeCd, itemSeq: index + 1 }
            ))
          ))
          .flat();
        saveData.push({ policyCd, categoryCd: 'FP_PLAN_STRATEGY', itemVal: getValues('planStrategy'), itemSeq: 1 });

        const data = {
          data: JSON.stringify(saveData),
          policyNm: isNewScenario ? getValues('policyNm') : null,
          scriptNm: scriptNm ? scriptNm : currentScenario.scriptNm
        };
        let newScenario;
        let formData = new FormData();
        formData.append('changes', JSON.stringify(data));
        zAxios({
          method: 'post',
          headers: { 'content-type': 'application/json' },
          url: baseURI() + 'factoryplan/simulation-scenario/policy-dtls',
          data: formData
        })
          .then(function (response) {
            newScenario = response.data.data;
            showMessage(transLangKey('MSG_CONFIRM'), response.data.message, { close: false });
          })
          .catch(function (err) {
          })
          .then(function () {
            if (newScenario) setScenario(newScenario);
            getScenarioList(false);
          });
      }
    });
  }
  
  function onInvalid() {
    showMessage(transLangKey('WARNING'), transLangKey('MSG_CHECK_VALID_002', { headerText: transLangKey('DESCRIP') }), { close: false });
  }
  
  function  openScriptPopup() {
    setScenarioScriptPopupOpen(true);
  }

  function onHandleDragEnd(result) {
    const { source, destination } = result;
    
    if (!destination) {
      return;
    }
    
    if (source.droppableId !== destination.droppableId) {
      let sourceId = source.droppableId.split("-")[1],
          destinationId = destination.droppableId.split("-")[1];
      let sourceClone = Array.from(rules[sourceId]),
          destClone = Array.from(selectedRules[destinationId]);      
      if (source.droppableId.includes('destination')) {
        sourceClone = Array.from(selectedRules[sourceId]); 
        destClone = Array.from(rules[destinationId]);
      }      
      const [removed] = sourceClone.splice(source.index, 1);
      destClone.splice(destination.index, 0, removed);

      const result = {};
      result['source'] = sourceClone;
      result['destination'] = destClone;

      if (source.droppableId.includes('destination')) {
        [result['source'], result['destination']] = [result['destination'], result['source']];
      }
      setRules(prevState => ({...prevState, [sourceId]: result['source']}));
      setSelectedRules(prevState => ({...prevState, [destinationId] : result['destination']}));
    } else {
      const sourceId = source.droppableId.split("-")[1];
      let data = Array.from(source.droppableId.includes('source') ? rules[sourceId] : selectedRules[sourceId]);
      const [removed] = data.splice(source.index, 1);
      data.splice(destination.index, 0, removed);
      
      if (source.droppableId.includes('source')) {
        setRules(prevState => ({...prevState, [sourceId]: data}));
      } else {
        setSelectedRules(prevState => ({...prevState, [sourceId] : data}));
      }
    }
  }
  
  function close(scriptNm) {
    setScriptNm(scriptNm);
    setScenarioScriptPopupOpen(false);
  }

  const setDndPanel = id => (
    <Grid item xs={4} sx={{ height: 'calc(85% - 83px)' }}>
      <DragDropContext onDragEnd={onHandleDragEnd}>
        <Box sx={{ height: 1, mt: 0, display: 'flex', flexDirection: 'column', gap: '26px' }}>
          <Box sx={{ pt: '0 !important', minHeight: '25%' }}>
            <Details title={transLangKey(`FP_${convertCamelToSnake(id).toUpperCase()}`)} style={{ height: 'calc(100% - 46px)', display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body1" gutterBottom>
                {transLangKey('FP_MSG_DRAG_RULE')}
              </Typography>
              <Droppable droppableId={`destination-${id}`}>
                {(provided, snapshot) => (
                  <Box ref={provided.innerRef} sx={getDraggingPanelStyle(snapshot.isDraggingOver)} className={classes.panel}>
                    {
                      selectedRules[id].length > 0 && selectedRules[id].map((item, index) => (
                        <Draggable
                          key={item.codeCd}
                          draggableId={item.codeCd}
                          index={index}>
                          {(provided) => (
                            <Box
                              ref={provided.innerRef}
                              className={classes.item}
                              sx={{ ...getDraggingItemStyle(snapshot.isDragging), backgroundColor: '#24a2ff !important', color: 'white' }}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}>
                              {transLangKey(item.codeCd)}
                            </Box>
                          )}
                        </Draggable>
                        )
                      )
                    }
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Details>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Details style={{ height: 1, p: 8, display: 'flex', flexDirection: 'column' }}>
              <Typography variant="body1" gutterBottom>
                {transLangKey('FP_MSG_ADJUST_DRAG_DROP')}
              </Typography>
              <Droppable droppableId={`source-${id}`}>
                {(provided, snapshot) => (
                  <Box ref={provided.innerRef} sx={{ ...getDraggingPanelStyle(snapshot.isDraggingOver), my: '1.5rem' }} className={classes.panel}>
                    {
                      rules[id].map((item, index) => (
                        <Draggable
                          key={item.codeCd}
                          draggableId={item.codeCd}
                          index={index}>
                          {(provided, snapshot) => (
                            <Box
                              ref={provided.innerRef}
                              className={classes.item}
                              sx={getDraggingItemStyle(snapshot.isDragging)}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}>
                              {transLangKey(item.codeCd)}
                            </Box>
                          )}
                        </Draggable>
                        )
                      )
                    }
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </Details>
          </Box>
        </Box>
      </DragDropContext>
    </Grid>
  );
  
  return (
    <ContentInner>
      <ScenarioScriptPopup ref={scriptPopupRef} defaultScript={currentScenario&&currentScenario.scriptNm} open={scenarioScriptPopupOpen} onClose={close} />
      <ResultArea>
        <Grid container spacing={13} sx={{ height: 1, mt: 0 }}>
          <Grid item sx={{ height: 1 }} xs={2.5}>
            <ClickableListPanel data={scenarioList} currentItem={currentScenario} itemTextField="policyNm" buttonText="FP_SCENARIO_CREATION" clickButton={() => createScenario()} clickItem={(scenario) => setScenario(scenario)}/>
          </Grid>
          <Grid item sx={{ height: 1 }} xs={9.5}>
            <Grid container spacing={13} sx={{ height: 1, alignItems: 'start', mt: 0 }}>
              <Grid item xs={12} sx={{ height: '83px', pt: '0 !important' }}>
                <Details style={{ padding: '0 !important' }}>
                  <Box sx={{ padding: '20px 15px' }}>
                    <Controller
                      name="policyNm"
                      control={control}
                      rules={{ required: true }}
                      render={({ field: { onChange, value} }) => (
                        <TextField
                          hiddenLabel
                          value={value}
                          onChange={onChange}
                          placeholder={transLangKey('FP_MSG_ENTER_DESCRIP')}
                          variant="outlined"
                          size="small"
                          sx={{ width: '600px', marginRight: '15px', '& legend': { width: 'auto' } }}
                          InputProps={{ readOnly: !isNewScenario }}
                        />
                      )}
                    />
                    <Button variant="outlined" sx={{ margin: '3.5px 15px 3.5px 0', borderRadius: 1, borderColor: 'rgba(0, 0, 0, 0.23)', width: 40, minWidth: 40, height: 35 }} onClick={openScriptPopup}><CodeIcon /></Button>
                    <Button variant="contained" sx={{ ...fpCommonStyles.primaryButton, margin: '3.5px 0', width: 90, height: 35 }} onClick={handleSubmit(saveData, onInvalid)}>{transLangKey('SAVE')}</Button>
                  </Box>
                </Details>
              </Grid>
              <Grid item xs={12} sx={{ height: '15%' }}>
                <Details title={transLangKey('FP_PLAN_STRATEGY')} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <InputField name="planStrategy" type="radio" width="100%" control={control} options={radioOptions} />
                </Details>
              </Grid>
              {setDndPanel('planSeqRule')}
              {setDndPanel('productionRule')}
              {setDndPanel('stockUseRule')}
            </Grid>
          </Grid>
        </Grid>
      </ResultArea>
    </ContentInner>
  );
}

export default SimulationScenario;
