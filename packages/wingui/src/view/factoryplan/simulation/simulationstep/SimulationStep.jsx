import React, { useEffect, useState } from 'react';
import {
  BaseGrid, ButtonArea, CommonButton, ContentInner, GridAddRowButton, LeftButtonArea,
  ResultArea, RightButtonArea, useViewStore, zAxios
} from "@zionex/wingui-core/src/common/imports";
import {
  Box, Button, Divider, Grid, TextField
} from "@mui/material";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Icon, showMessage, transLangKey } from "@wingui";
import Details from "@wingui/view/factoryplan/common/component/DetailCard";
import ClickableListPanel from "@wingui/view/factoryplan/common/component/ClickableListPanel";
import { setEditableGrid } from "@wingui/view/factoryplan/common/common";
import { Controller, useForm } from "react-hook-form";
import { fpCommonStyles } from "@wingui/view/factoryplan/common/common";

const simulationStepGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false },
  { name: "stepSeq", dataType: "number", headerText: "SEQ", visible: true, editable: false, textAlignment: "center", width: 40 },
  { name: "stepCd", dataType: "text", headerText: " ", visible: false, editable: false },
  { name: "descTxt", dataType: "text", headerText: "DESCRIP", visible: true, editable: true, width: 250,
    editor: { type: "text", maxLength: 100 },
    validRules: [{ criteria: "required"}]
  },
  { name: "execTpCd", dataType: "text", headerText: "FP_EXEC_TP_CD", visible: true, editable: true, width: 250, useDropdown: true,
    validRules: [{ criteria: "required"}]
  },
  { name: "execTarget", dataType: "text", headerText: "FP_EXEC_TARGET", visible: true, editable: false, width: 250,
    validRules: [{ criteria: "validFunc", valid: (grid, column, value, itemIndex) => {
      if (grid.getValue(itemIndex, 'execTpCd') === 'FP_EXEC_PROCEDURE' && !value) {
        return { message: transLangKey('MSG_CHECK_VALID_002', { headerText: transLangKey('FP_EXEC_TARGET') }) };
      } else return true;
    }
    }],
    styleCallback: (gridView, dataCell) => {
      if (gridView.getValue(dataCell.index.itemIndex, 'execTpCd') === 'FP_EXEC_PROCEDURE') {
        return { editable: true, styleName: 'editable-text-column' };
      } else {
        return { editable: false, styleName: 'text-column' };
      }
    }
  },
  {
    name: "auditGroup", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", expandable: true, expanded: false,
    childs: [
      { name: "updatedBy", dataType: "text", headerText: "FP_UPDATED_BY", visible: true, editable: false, width: 80, groupShowMode: "expand", textAlignment: "center" },
      { name: "updatedAt", dataType: "datetime", headerText: "FP_UPDATED_AT", visible: true, editable: false, width: 125, groupShowMode: "always" },
      { name: "createdBy", dataType: "text", headerText: "FP_CREATED_BY", visible: true, editable: false, width: 80, groupShowMode: "expand", textAlignment: "center" },
      { name: "createdAt", dataType: "datetime", headerText: "FP_CREATED_AT", visible: true, editable: false, width: 125, groupShowMode: "expand" },
    ]
  }
];
let deleteData = [];

function SimulationStep() {
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const [simulationStepGrid, setSimulationStepGrid] = useState(null);
  const [stepList, setStepList] = useState([]);
  const [currentStep, setCurrentStep] = useState(null);
  const [isNewStep, setIsNewStep] = useState(true);
  
  const { control, getValues, setValue, handleSubmit } = useForm({
    defaultValues: {
      step: ''
    }
  });
  useEffect(() => {
    getPlanSteps();
  }, []);

  useEffect(() => {
    if (simulationStepGrid) {
      const gridView = simulationStepGrid.gridView;
      setEditableGrid(simulationStepGrid);
      gridView.setRowIndicator({ visible: false });
      gridView.setCheckBar({ visible: true, showAll: false, headText: transLangKey('FP_SELECT_DELETE'), width: 40, syncHeadCheck: true });
      gridView.getDataSource().setOptions({ restoreMode: 'auto' });
      setExecTypeDropdown(gridView, 'execTpCd', 'FP_EXEC_TYPE');
      
      gridView.onCellEdited = function (grid, itemIndex, dataRow, field) {
        grid.commit(true);
        const dataProvider = grid.getDataSource();
        if (field === 4 && dataProvider.getValue(dataRow, field) === 'FP_EXEC_PLAN') {
          dataProvider.setValue(dataRow, 'execTarget', null);
        } else if (field === 4 && grid.getDataSource().getValue(dataRow, field) === 'FP_EXEC_PROCEDURE') {
          const execTarget = dataProvider.getUpdatedCells([dataRow])[0].updatedCells.filter(cell => cell.fieldName === 'execTarget')[0];
          if (execTarget) {
            dataProvider.setValue(dataRow, 'execTarget', execTarget.oldValue);
          }
        }
      }
    }
  }, [simulationStepGrid]);

  useEffect(() => {
    setSimulationStepGrid(getViewInfo(vom.active, 'simulationStepGrid'));
  }, [viewData]);

  function getPlanSteps() {
    return zAxios.get(baseURI() + 'factoryplan/plan-steps', {
      waitOn: false
    })
      .then(function (res) {
        setStepList(res.data);
      }).catch(function (err) {
        console.log(err);
      })
  }
  
  function setExecTypeDropdown(gridView, columnName, codeGroupCd) {
    zAxios.get(baseURI() + 'factoryplan/codes', {
      params: { 'code-group-cd': codeGroupCd },
      waitOn: false
    })
      .then(function (response) {
        const list = response.data.map(data => ({ value: data.codeCd, label: data.descripText }));
        gridView.setColumnProperty(columnName, 'lookupData', { value: 'value', label: 'label', list });
      })
      .catch(function (err) {
        console.log(err);
      })
  }

  function loadData(stepCd) {
    return zAxios.get(baseURI() + 'factoryplan/simulation-step/step-seqs',{
        params: {
          "step-cd": stepCd
        },
        waitOn: false
      })
      .then(function (res) {
        simulationStepGrid.dataProvider.fillJsonData(res.data);
        deleteData = [];
        simulationStepGrid.gridView.checkAll(false);
      }).catch(function (err) {
        console.log(err);
      })
  }
  
  function saveData() {
    const { gridView, dataProvider } = simulationStepGrid;
    gridView.commit(true);
    gridView.validateCells(null, false);
    const invalidCells = gridView.getInvalidCells();
    if (invalidCells) {
      let contentBody = '<h4>' + transLangKey('MSG_VALIDATE_ERROR_SAVE_DATA') + '</h4><br/>';
      invalidCells.forEach(c => {
        contentBody += '<h4> [Row: ' + c.dataRow + ' Column: ' + gridView.getColumnProperty(c.column, 'header').text + '] : ' + transLangKey(c.message) + '</h4>';
      })
      showMessage(transLangKey('FP_VALIDATION_FAIL'), contentBody, { close: false });
    } else {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
        if (answer) {
          let updateData = dataProvider.getAllStateRows().updated
            .map(row => dataProvider.getJsonRow(row));
          let createData = dataProvider.getAllStateRows().created
            .map(row => dataProvider.getJsonRow(row));
          const data = {
            update: JSON.stringify(updateData),
            create: JSON.stringify(createData),
            delete: JSON.stringify(deleteData),
            stepNm: isNewStep ? getValues('step') : null
          };
          let formData = new FormData();
          formData.append('changes', JSON.stringify(data));
          if (updateData.length === 0 && createData.length === 0 && deleteData.length === 0) {
            showMessage(transLangKey('WARNING'), transLangKey('MSG_5039'), { close: false });
          } else {
            gridView.showToast(progressSpinner + 'Saving data...', true);
            let newStepCd;
            zAxios({
              method: 'post',
              headers: { 'content-type': 'application/json' },
              url: baseURI() + 'factoryplan/simulation-step/step-seqs',
              data: formData
            })
              .then(function (response) {
                newStepCd = response.data.data;
              })
              .catch(function (err) {
              })
              .then(function () {
                gridView.hideToast();
                loadData((newStepCd) ? newStepCd : currentStep.stepCd);
                if (newStepCd) {
                  setCurrentStep({ stepCd: newStepCd, stepNm: getValues('step') });
                }
                setIsNewStep(false);
                getPlanSteps();
              });
          }
        }
      });      
    }
  }
  
  function setStep(step) {
    if (simulationStepGrid.dataProvider.getRowStateCount(['created', 'updated']) > 0 || deleteData.length > 0) {
      showMessage(transLangKey('CONFIRM'), transLangKey('MSG_5142'), function (answer) {
        if (answer) {
          loadData(step.stepCd);
          setCurrentStep(step);
          setIsNewStep(false);
          setValue('step', step.stepNm);
        }
      });
    } else {
      loadData(step.stepCd);
      setCurrentStep(step);
      setIsNewStep(false);
      setValue('step', step.stepNm);
    }
  }
  
  function createStep() {
    if (simulationStepGrid.dataProvider.getRowStateCount(['created', 'updated']) > 0 || deleteData.length > 0) {
      showMessage(transLangKey('CONFIRM'), transLangKey('MSG_5142'), function (answer) {
        if (answer) {
          setCurrentStep(null);
          setIsNewStep(true);
          simulationStepGrid.dataProvider.clearRows();
          setValue('step', '');
        }
      });
    } else {
      setCurrentStep(null);
      setIsNewStep(true);
      simulationStepGrid.dataProvider.clearRows();
      setValue('step', '');
    }
  }
  
  function moveRow(direction) {
    const { gridView, dataProvider } = simulationStepGrid;
    if (dataProvider.getRowCount() > 0) {
      const row = gridView.getCurrent().dataRow;
      if (row >= 0) {
        const stepSeq = dataProvider.getValue(row, 'stepSeq');
        if (direction === 'up') {
          if (row !== 0) {
            dataProvider.setValue(row, 'stepSeq', stepSeq - 1);
            dataProvider.setValue(row - 1, 'stepSeq', stepSeq);
            dataProvider.moveRow(row, row - 1);
            gridView.setCurrent({ dataRow: row - 1 });
          }
        } else {
          if (simulationStepGrid.dataProvider.getRowCount() !== row + 1) {
            dataProvider.setValue(row, 'stepSeq', stepSeq + 1);
            dataProvider.setValue(row + 1, 'stepSeq', stepSeq);
            dataProvider.moveRow(row, row + 1);
            gridView.setCurrent({ dataRow: row + 1 });
          }
        }
      } else {
        showMessage(transLangKey('WARNING'), transLangKey('FP_MSG_SELECT_MOVE_ROW'), { close: false });
      }
    }
  }
  
  function addRow() {
    const { gridView, dataProvider } = simulationStepGrid;
    const newRow = gridView.getCurrent().dataRow;
    const newStepSeq = (newRow === 0) ? 1 : dataProvider.getValue(newRow - 1, 'stepSeq') + 1;
    dataProvider.setValue(newRow, 'stepSeq', newStepSeq);
    if (!isNewStep) dataProvider.setValue(newRow, 'stepCd', currentStep.stepCd);
    const rowCount = dataProvider.getRowCount();
    for (let row = newRow + 1, stepSeq = newStepSeq + 1; row < rowCount; row++, stepSeq++) {
      dataProvider.setValue(row, 'stepSeq', stepSeq);
    }
  }
  
  function deleteRow() {
    const { gridView, dataProvider } = simulationStepGrid;
    const checkedRows = gridView.getCheckedRows();
    if (checkedRows.length === 0) {
      showMessage(transLangKey('WARNING'), transLangKey('FP_MSG_NO_ROW_CHECKED'), { close: false });
    } else {
      const prevStepSeq = dataProvider.getValue(checkedRows[0], 'stepSeq');
      deleteData = checkedRows
        .filter(dataRow => dataProvider.getRowState(dataRow) !== 'created')
        .map(dataRow => dataProvider.getJsonRow(dataRow));
      dataProvider.removeRows(checkedRows);
      for (let row = checkedRows[0], stepSeq = prevStepSeq; row < dataProvider.getRowCount(); row++, stepSeq++) {
        dataProvider.setValue(row, 'stepSeq', stepSeq);
      }
    }
  }
  
  function onInValid() {
    showMessage(transLangKey('WARNING'), transLangKey('MSG_CHECK_VALID_002', { headerText: transLangKey('DESCRIP') }), { close: false });
  }
  
  return (
    <ContentInner>
      <ResultArea>
        <Grid container spacing={13} sx={{ height: 1, marginTop: 0 }}>
          <Grid item xs={2.5}>
            <ClickableListPanel data={stepList} currentItem={currentStep} itemTextField="stepNm" buttonText="FP_SIMUL_STEP_CREATION" clickButton={() => createStep()} clickItem={(step) => setStep(step)}/>
          </Grid>
          <Grid item xs={9.5}>
            <Details style={{ height: 1, padding: '0 !important' }}>
              {
                <Box sx={{ display: 'flex', flexDirection: 'column', height: 1 }}>
                  <Box sx={{ padding: '20px 15px' }}>
                    <Controller
                      name="step"
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
                          InputProps={{ readOnly: !isNewStep }}
                        />
                      )}
                    />
                    <Button variant="contained" sx={{ ...fpCommonStyles.primaryButton, margin: '3.5px 0', width: 90, height: 35 }} onClick={handleSubmit(saveData, onInValid)}>{transLangKey('SAVE')}</Button>
                  </Box>
                  <Divider />
                  <Box sx={{ padding: '15px', height: 1, display:'flex', flexDirection: 'column' }}>
                    <ButtonArea>
                      <LeftButtonArea>
                        <CommonButton title={transLangKey("FP_CHANGE_SEQ")} onClick={() => moveRow('down')}>
                          <ArrowBackIosNewIcon sx={{ transform: 'rotate( -90deg )' }} />
                        </CommonButton>
                        <CommonButton title={transLangKey("FP_CHANGE_SEQ")} onClick={() => moveRow('up')}>
                          <ArrowBackIosNewIcon sx={{ transform: 'rotate( 90deg )' }} />
                        </CommonButton>                        
                        <span style={{ paddingLeft: '0.3rem', color: 'rgba(0, 0, 0, 0.54)' }}>{`(${transLangKey('FP_MSG_DESCRIP_MOVE_ROW')})`}</span>
                      </LeftButtonArea>
                      <RightButtonArea>
                        <GridAddRowButton grid="simulationStepGrid" onAfterAdd={() => addRow()} />
                        <CommonButton title={transLangKey("DELETE")} onClick={() => deleteRow()}>
                          <Icon.Minus size={20} />
                        </CommonButton>
                      </RightButtonArea>
                    </ButtonArea>
                    <BaseGrid items={simulationStepGridItems} id="simulationStepGrid" className="white-skin"></BaseGrid>
                  </Box>
                </Box>
              }
            </Details>
          </Grid>
        </Grid>
      </ResultArea>
    </ContentInner>
  );
}

export default SimulationStep;
