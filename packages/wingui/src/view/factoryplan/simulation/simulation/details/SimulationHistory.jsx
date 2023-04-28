import React, { useEffect, useState} from "react";
import { BaseGrid, useIconStyles, useViewStore, zAxios } from "@zionex/wingui-core/src/common/imports";
import Details from "@wingui/view/factoryplan/common/component/DetailCard";
import { setNoneEditableGrid } from "@wingui/view/factoryplan/common/common";
import { useStepStatusContext } from "../SimulationContext";
import RefreshIcon from '@mui/icons-material/Refresh';
import SimulationOptionPopup from "@wingui/view/factoryplan/simulation/simulation/SimulationOptionPopup";
import { transLangKey } from "@wingui";
import { IconButton } from "@mui/material";

const simulationHistoryGridItems = [
  { name: "mainVersionCd", dataType: "text", headerText: "MAIN_VER", visible: true, editable: false, width: 150, textAlignment: "center",
    mergeRule: { criteria: "value" } },
  { name: "planVersionCd", dataType: "text", headerText: "SIMULATION_VERSION", visible: true, editable: false, width: 150, textAlignment: "center" },
  { name: "descTxt", dataType: "text", headerText: "DESCRIP", visible: true, editable: false, width: 200 },
  { name: "policyCd", dataType: "text", headerText: "SCENARIO", visible: true, editable: false, width: 150 },
  { name: "hasOptions", dataType: "text", headerText: " ", visible: false },
  { name: "option", dataType: "text", headerText: "FP_OPTION", visible: true, editable: false, width: 50, textAlignment: "center" },
  { name: "confirm", dataType: "text", headerText: "CONFIRM", visible: true, editable: false, width: 50, textAlignment: "center",
    renderer: {
      type: "html",
      callback: function (grid, cell) {
        if (grid.getValue(cell.index.itemIndex, 'confirmYn')) {
          return `<div class="status-icon-box" style="background: #5bda5b; margin-left: 0;">
                    <i class="fa fa-check status-icon"></i>
                  </div>`;
        } else return null;
      }
    }
  },
  { name: "confirmYn", dataType: "boolean", headerText: " ", visible: false, editable: false, width: 150 },
  { name: "startTs", dataType: "datetime", headerText: "FP_START_DT", visible: true, editable: false, width: 150 },
  { name: "endTs", dataType: "datetime", headerText: "FP_END_DT", visible: true, editable: false, width: 150 },
  { name: "elapsedTime", dataType: "text", headerText: "FP_ELAPSED_TIME", visible: true, editable: false, width: 100, textAlignment: "center",
    valueCallback: function (provider, dataRow, fieldName, fieldNames, values) {
      let startTs = values[fieldNames.indexOf('startTs')];
      let endTs = values[fieldNames.indexOf('endTs')];
      if (startTs instanceof Date && endTs instanceof Date) {
        startTs.setMilliseconds(0);
        endTs.setMilliseconds(0);
        let elapsedSeconds = Math.floor((endTs - startTs) / 1000);
        return `${Math.floor(elapsedSeconds / 60)}m ${elapsedSeconds % 60}s`;
      } else return null;
    }
  },
  { name: "statusLog", dataType: "text", headerText: "FP_DETAILS", visible: true, editable: false, width: 400 },
  { name: "user", dataType: "text", headerText: "FP_USER", visible: true, editable: false, width: 150 }
];

function SimulationHistory() {
  const iconClasses = useIconStyles();
  const { stepStatus } = useStepStatusContext();
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const [simulationHistoryGrid, setSimulationHistoryGrid] = useState(null);
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupTitle, setPopupTitle] = useState(null);
  const [planVersionCd, setPlanVersionCd] = useState(null);

  useEffect(() => {
    if (stepStatus) {
      loadData();
    }
  }, [stepStatus]);
  
  useEffect(() => {
    setSimulationHistoryGrid(getViewInfo(vom.active, 'simulationHistoryGrid'));
  }, [viewData]);

  useEffect(() => {
    if (simulationHistoryGrid) {
      setNoneEditableGrid(simulationHistoryGrid);
      const gridView = simulationHistoryGrid.gridView;
      gridView.setEditOptions({ appendable: false });
      // register option button
      gridView.registerCustomRenderer("optionButton", {
        initContent: function (parent) {
          let icon = document.createElement('i');
          icon.className = 'fa fa-file-text option-icon';
          this._icon = icon;
          parent.appendChild(this._icon);
          let span = document.createElement('span');
          span.appendChild(icon);
          this._span = span;
          parent.appendChild(this._span);
        },
        canClick: function() {
          return true;
        },
        clearContent: function(parent) {
          parent.innerHTML = '';
        },
        render: function (grid, model) {
          const hasOptions = grid.getValue(model.index.itemIndex, 'hasOptions');
          let span = this._span;
          span.style.visibility = (hasOptions === 'Y') ? 'visible' : 'hidden';
        },
        click: function (event) {
          const grid = this.grid.handler;
          const index = this.index.toProxy();
          event.preventDefault;
          if (event.target === this._icon) {
            const versionCd = grid.getValue(index.itemIndex, 'planVersionCd');
            if (versionCd) {
              setPlanVersionCd(versionCd);
              setPopupTitle(`(${versionCd})`);
              setPopupOpen(true);
            }
          }
        }
      });
      gridView.setColumnProperty("option", "renderer", "optionButton");
      loadData();
    }
  }, [simulationHistoryGrid]);

  function loadData() {
    zAxios.get(baseURI() + 'factoryplan/simulation/history')
      .then(function (res) {
        simulationHistoryGrid.dataProvider.fillJsonData(res.data);
      }).catch(function (err) {
      console.log(err);
    }).then(function () {
    });
  }
  
  const RefreshButton = (
    <IconButton sx={{ m: 0 }} onClick={() => loadData()} className={iconClasses.iconButton} title={transLangKey("SEARCH")}>
      <RefreshIcon sx={{ fontSize: "1.5rem" }} />
    </IconButton>
  );
  
  return (
    <>
      <SimulationOptionPopup open={popupOpen} title={popupTitle} onClose={() => setPopupOpen(false)} versionCd={planVersionCd} />
      <Details id="simulationHistory" title="FP_SIMULATION_HISTORY" style={{ height: 'calc(100% - 56px)' }} headerAction={RefreshButton}>
        <BaseGrid items={simulationHistoryGridItems} id="simulationHistoryGrid" className="white-skin"></BaseGrid>
      </Details>
    </>
  );
}

export default SimulationHistory;
