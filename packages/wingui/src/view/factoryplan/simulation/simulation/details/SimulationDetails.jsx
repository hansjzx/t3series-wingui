import React, { useEffect, useState} from "react";
import { BaseGrid, useViewStore, zAxios } from "@zionex/wingui-core/src/common/imports";
import Details from "@wingui/view/factoryplan/common/component/DetailCard";
import { setNoneEditableGrid } from '../../../common/common';
import { showMessage, transLangKey } from "@wingui";
import { useMainVersionContext, useStepStatusContext } from "../SimulationContext";
import { useHistory } from "react-router-dom";
import { waitOff, waitOn } from "@zionex/wingui-core/src/utils/waitMe";
import SimulationOptionPopup from "@wingui/view/factoryplan/simulation/simulation/SimulationOptionPopup";

const WAIT_TARGET_SELECTOR = `contentInner-${vom.active}`;
const STATUS = {
  READY: 'FP_STATUS_READY',
  RUNNING: 'FP_STATUS_RUNNING',
  COMPLETE: 'FP_STATUS_COMPLETE',
  FAIL: 'FP_STATUS_FAIL',
  CONFIRM: 'FP_STATUS_CONFIRM'
};
const simulationDetailGridItems = [
  { name: "stepSeq", dataType: "number", headerText: "SEQ", visible: true, editable: false, textAlignment: "center", width: 40 },
  { name: "stepCd", dataType: "text", headerText: " ", visible: false, editable: false },
  { name: "stepDescTxt", dataType: "text", headerText: "FP_SIMUL_STEP_DESC", visible: true, editable: false, width: 250 },
  { name: "statusTpCd", dataType: "text", headerText: "STATUS", visible: true, editable: false, width: 90,
    renderer: {
      type: "html",
      callback: function (grid, cell) {
        let background, iconClass;
        if (cell.value === STATUS.READY) {
          background = '#7f7f7f'; iconClass = 'fa-pause';
        } else if (cell.value === STATUS.RUNNING) {
          background = 'orange'; iconClass = 'fa-refresh fa-spin';
        } else if (cell.value === STATUS.COMPLETE) {
          background = '#5bda5b'; iconClass = 'fa-check';
        } else if (cell.value === STATUS.FAIL) {
          background = '#f84a4a'; iconClass = 'fa-times';
        }
        return `<div style="display: flex; align-items: center; justify-content: center;">
                    <div class="status-icon-box" style="background: ${background};">
                        <i class="fa ${iconClass} status-icon"></i>
                    </div>
                    <span class="status-icon-text">${transLangKey(cell.value)}</span>
                </div>`;
      }
    }
  },
  { name: "action", dataType: "text", headerText: "FP_ACTION", visible: true, editable: false, width: 130, renderer: "execButton", textAlignment: "center" },
  { name: "versionCd", dataType: "text", headerText: "FP_FINAL_SIMULATION_VERSION", visible: true, editable: false, width: 150 },
  { name: "policyCd", dataType: "text", headerText: "SCENARIO", visible: true, editable: true, width: 150, useDropdown: true,
    validRules: [{ criteria: "validFunc", valid: (grid, column, value, itemIndex) => {
      if (grid.getValue(itemIndex, 'execTpCd') === 'FP_EXEC_PLAN' && !value) {
        return { message: transLangKey('MSG_CHECK_VALID_002', { headerText: transLangKey('SCENARIO') }) };
      } else return true;
    }
  }]
  },
  { name: "versionDescTxt", dataType: "text", headerText: "DESCRIP", visible: true, editable: false, width: 250,
    styleCallback: function (grid, dataCell) {
      const execTpCd = grid.getValue(dataCell.index.itemIndex, 'execTpCd');
      if (execTpCd === 'FP_EXEC_PLAN') {
        return { editable: true, styleName: 'editable-column column-textAlignt-near' };
      }
    },
  },
  { name: "execTpCd", dataType: "text", headerText: " ", visible: false },
  { name: "startTs", dataType: "datetime", headerText: "FP_START_DT", visible: true, editable: false, width: 150 },
  { name: "endTs", dataType: "datetime", headerText: "FP_END_DT", visible: true, editable: false, width: 150,
    valueCallback: function (provider, dataRow, fieldName, fieldNames, values) {
      let statusTpCd = values[fieldNames.indexOf('statusTpCd')];
      if (statusTpCd === STATUS.READY || statusTpCd === STATUS.RUNNING) {
        return null;
      } else {
        return values[fieldNames.indexOf('endTs')];
      }
    }
  },
  { name: "elapsedTime", dataType: "text", headerText: "FP_ELAPSED_TIME", visible: true, editable: false, width: 100, textAlignment: "center",
    valueCallback: function (provider, dataRow, fieldName, fieldNames, values) {
      let startTs = values[fieldNames.indexOf('startTs')];
      let endTs = values[fieldNames.indexOf('endTs')];
      if (startTs instanceof Date && endTs instanceof Date) {
        startTs.setMilliseconds(0);
        endTs.setMilliseconds(0);
        let elapsedSeconds = Math.floor((endTs - startTs) / 1000);
        return `${Math.floor(elapsedSeconds / 60)}m ${elapsedSeconds % 60}s`
      } else return null;
    }
  }
];
let currentMainVersion;
let runningCheckInterval;

function SimulationDetails() {
  const history = useHistory();
  const { mainVersion } = useMainVersionContext();
  const { setStepStatus } = useStepStatusContext();
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const [simulationDetailGrid, setSimulationDetailGrid] = useState(null);
  const [stepCd, setStepCd] = useState(' ');
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupTitle, setPopupTitle] = useState(null);

  useEffect(() => {
    if (mainVersion) {
      setStepCd(mainVersion.stepCd);
      loadData(mainVersion.mainVersionCd, (data) => {
        const runningStep = data.find(stepData => stepData['statusTpCd'] === STATUS.RUNNING);
        if (runningStep) {
          waitOnWithoutCancel(WAIT_TARGET_SELECTOR);
          setRunningCheckInterval(runningStep);
        }
      });
      currentMainVersion = mainVersion;
    } else {
      setStepCd(' ');
      if (simulationDetailGrid) {
        simulationDetailGrid.dataProvider.clearRows();
      }
    }
  }, [mainVersion]);

  useEffect(() => {
    if (simulationDetailGrid) {
      const gridView = simulationDetailGrid.gridView;
      setNoneEditableGrid(simulationDetailGrid);
      gridView.setEditOptions({ appendable: false });
      gridView.setRowIndicator({ visible: false });
      gridView.onCellEdited = function (grid) {
        grid.commit(true);
      }
      // load plan policy combo list
      zAxios.get(baseURI() + 'factoryplan/plan-policy', {
        waitOn: false
      })
        .then(function (response) {
          const list = response.data.map((data) => ({ value: data.policyCd, label: data.policyNm }));
          gridView.setColumnProperty('policyCd', 'lookupData', { value: 'value', label: 'label', list: list });
        })
        .catch(function (err) {
          console.log(err);
        })
        .then(function () {
        });
      // register action button
      gridView.registerCustomRenderer("execButton", {
        initContent: function (parent) {
          let execButton = document.createElement('button');
          execButton.type = 'button';
          execButton.innerText = transLangKey('EXEC');
          execButton.className = 'grid-btn exec-btn';
          let optionButton = document.createElement('button');
          optionButton.type = 'button';
          optionButton.innerText = transLangKey('FP_OPTION');
          optionButton.className = 'grid-btn option-btn';
          parent.appendChild(this._execButton = execButton);
          parent.appendChild(this._optionButton = optionButton);
        },
        canClick: function () {
          return true;
        },
        clearContent: function (parent) {
          parent.innerHTML = '';
        },
        render : function (grid, model) {
          const execTpCd = grid.getValue(model.index.itemIndex, 'execTpCd');
          if (execTpCd !== 'FP_EXEC_PLAN') {
            let button = this._optionButton;
            button.style.visibility = 'hidden';
          }
        },
        click: function (event) {
          const grid = this.grid.handler;
          const index = this.index.toProxy();
          event.preventDefault;
          if (event.target === this._execButton) {
            const row = grid.getValues(index.itemIndex);
            if (row['execTpCd'] === 'FP_EXEC_PLAN') {
              savePlanVersion(index, 'EXEC');
            } else if (row['execTpCd'] === 'FP_EXEC_PROCEDURE') {
              showMessage(transLangKey('EXEC'), transLangKey('FP_MSG_EXEC_SIMULATION'), function (answer) {
                if (answer) {
                  const stepSeq = row.stepSeq;
                  const stepData = {
                    mainVersionCd: currentMainVersion.mainVersionCd,
                    stepCd: row.stepCd,
                    stepSeq
                  };
                  waitOnWithoutCancel(WAIT_TARGET_SELECTOR);
                  executeSimulation(stepData, row['execTpCd']);
                  runningCheckInterval = setInterval(() => {
                    loadData(currentMainVersion.mainVersionCd);
                  }, 3000);                  
                }
              });
            }
          } else if (event.target === this._optionButton) {
            grid.clearInvalidCells();
            if (!grid.validateCells([index.itemIndex], false)) {
              const values = grid.getValues(index.itemIndex);
              setPopupTitle(`(${currentMainVersion.stepCd} : ${values['stepSeq']}. ${values['stepDescTxt']})`);
              setPopupOpen(true);
            }
          }
        }
      });
      gridView.setColumnProperty("action", "renderer", "execButton");
    }
  }, [simulationDetailGrid]);

  useEffect(() => {
    setSimulationDetailGrid(getViewInfo(vom.active, 'simulationDetailGrid'));
  }, [viewData]);
  
  function loadData(mainVersionCd, callback) {
    zAxios.get(baseURI() + 'factoryplan/simulation/details', {
      params: { 'main-version-cd': mainVersionCd },
      waitOn: false
    })
      .then(function (res) {
        simulationDetailGrid.dataProvider.fillJsonData(res.data);
        if (callback) callback(res.data);
      }).catch(function (err) {
        console.log(err);
      }).then(function () {
      });
  }
  
  function waitOnWithoutCancel(target) {
    waitOn(target);
    let cancelButton = document.querySelector(`#${target} .waitMe_content button`);
    cancelButton.style.display = 'none';
  }
  
  function savePlanVersion(index, action, options) {
    const { gridView, dataProvider } = simulationDetailGrid;
    gridView.clearInvalidCells();
    if (!gridView.validateCells([index.itemIndex], false)) {
      showMessage(transLangKey('EXEC'), transLangKey('FP_MSG_EXEC_SIMULATION'), function (answer) {
        if (answer) {
          if (action === 'OPTION') {
            setPopupOpen(false);
          }
          gridView.commit(true);
          waitOnWithoutCancel(WAIT_TARGET_SELECTOR);
          const row = dataProvider.getJsonRow(index.dataRow, false);
          const convertDateFormat = (dt) => (dt instanceof Date) ? dt.format('yyyy-MM-ddTHH:mm:ss') : dt;
          const planVersion = {
            mainVersionCd: currentMainVersion.mainVersionCd,
            startTs: convertDateFormat(currentMainVersion.startTs),
            endTs: convertDateFormat(currentMainVersion.endTs),
            freezeTs: convertDateFormat(currentMainVersion.freezeTs),
            stepCd: row.stepCd,
            stepSeq: row.stepSeq,
            policyCd: row.policyCd,
            descripText: row.versionDescTxt
          };
          
          let formData = new FormData();
          formData.append('changes', JSON.stringify(planVersion));
          
          zAxios({
            method: 'post',
            url: baseURI() + 'factoryplan/simulation/plan-versions',
            headers: { 'content-type': 'application/json' },
            data: formData,
            waitOn: false
          }).then(function (response) {
            let res = response.data;
            const newPlanVersionCd = res.data;
            if (res.status === 200) {
              planVersion.versionCd = newPlanVersionCd;
              if (action === 'EXEC') { // 실행: 시뮬레이션 버전 저장 -> 엔진 실행
                executePlanVersion(planVersion);
              } else { // 옵션 적용: 시뮬레이션 버전 저장 -> 옵션 저장 -> 엔진 실행
                saveOptions(planVersion, options);
              }
            }
          }).catch(function (err) {
            showMessage(transLangKey('WARNING'), err.response.data.message, { close: false });
            waitOff(WAIT_TARGET_SELECTOR);
            console.log(err);
          }).then(function () {
          });
        }
      });
    }
  }
  
  function saveOptions(planVersion, options) {
    options.forEach(option => option['versionCd'] = planVersion.versionCd);
    zAxios({
      method: 'post',
      url: baseURI() + 'factoryplan/simulation/plan-versions/options',
      headers: { 'content-type': 'application/json' },
      data: options,
      waitOn: false
    }).then(function (response) {
      if (response.data.status === 200) {
        executePlanVersion(planVersion);
      }
    }).catch(function (err) {
      console.log(err);
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('FP_MSG_FAIL_OPTION_SAVE'), { close: false });
      waitOff(WAIT_TARGET_SELECTOR);
    }).then(function () {
    });
  }
  
  function executePlanVersion(planVersion, waitOn) {
    if (waitOn)  {
      waitOnWithoutCancel(WAIT_TARGET_SELECTOR);
    }
    loadData(currentMainVersion.mainVersionCd);
    executeSimulation(planVersion, 'plan');
    setRunningCheckInterval(planVersion);
  }

  function executeSimulation(data, execTp) {
    const uri = execTp === 'FP_EXEC_PROCEDURE' ? 'procedure' : 'plan';
    let error;
    let formData = new FormData();
    formData.append("changes", JSON.stringify(data));
    
    zAxios({
      method: 'post',
      url: `${baseURI()}factoryplan/simulation/plan-versions/${uri}`,
      headers: { 'content-type': 'application/json' },
      data: formData,
      waitOn: false
    }).then(function () {
    }).catch(function (err) {
      error = err.response.data;
      console.log(err);
    }).then(function () {
      if (execTp === 'FP_EXEC_PROCEDURE') {
        loadData(currentMainVersion.mainVersionCd);
        clearInterval(runningCheckInterval);
        waitOff(WAIT_TARGET_SELECTOR);
        setStepStatus(data);
        let msg = 'FP_MSG_COMPLETE_EXEC';
        if (error) {
          msg = (error.data && error.data === 'FP_SERVER_CONNECTION') ? error.message : 'FP_MSG_FAIL_EXEC';
        }
        showMessage(transLangKey('MSG_CONFIRM'), transLangKey(msg), { close: false });
      }
    });
  }
  
  function setRunningCheckInterval(step) {
    runningCheckInterval = setInterval(() => {
      loadData(currentMainVersion.mainVersionCd, (data) => {
        const currentStep = data.find(stepData => stepData['stepSeq'] === step.stepSeq);
        if (currentStep) {
          const statusTpCd = currentStep['statusTpCd'];
          if (statusTpCd === STATUS.COMPLETE || statusTpCd === STATUS.FAIL) {
            clearInterval(runningCheckInterval);
            waitOff(WAIT_TARGET_SELECTOR);
            setStepStatus(step);
            const msg = (statusTpCd === STATUS.COMPLETE) ? 'FP_MSG_COMPLETE_EXEC' : 'FP_MSG_FAIL_EXEC';
            showMessage(transLangKey('MSG_CONFIRM'), transLangKey(msg), { close: false }, function (answer) {
              if (answer && currentStep['execTpCd'] === 'FP_EXEC_PLAN' && statusTpCd === STATUS.COMPLETE) {
                const planningDate = new Date(currentStep['planDt']);
                const versionCd = currentStep['versionCd'];
                history.push({ pathname: '/factoryplan/analysis/simulationkpi', state: { planningDate, versionCd } });
              }
            });
          }
        }
      });
    }, 3000);
  }
  
  function handlePopupSubmit(options) {
    const current = simulationDetailGrid.gridView.getCurrent();
    savePlanVersion(current, 'OPTION', options);
  }
  
  return (
    <>
      <SimulationOptionPopup open={popupOpen} title={popupTitle} onClose={() => setPopupOpen(false)} onSubmit={(options) => handlePopupSubmit(options)} />
      <Details id="simulationDetails" title={stepCd}>
        <BaseGrid items={simulationDetailGridItems} id="simulationDetailGrid" className="white-skin" />
      </Details>
    </>
  );
}

export default SimulationDetails;
