import React, { useState, useEffect } from 'react';
import { BaseGrid, PopupDialog, zAxios } from '@zionex/wingui-core/src/common/imports';

let gridItems = [
  { name: "ID", headerText: "ID", dataType: "string", width: "100", visible: false, editable: false },
  { name: "MODULE", headerText: "MODULE_VAL", dataType: "string", width: "100", visible: true, editable: false },
  { name: "PLAN_POLICY_VER_ID", headerText: "PLAN_POLICY_VERSION", dataType: "string", width: "150", visible: true, editable: false },
  { name: "DESCP", headerText: "DESCRIP", dataType: "string", width: "200", visible: true, editable: false },
  { name: "PLAN_POLICY_VAL_ID", headerText: "PLAN_POLICY_VAL", dataType: "string", width: "200", visible: false, editable: false },
  { name: "PLAN_TYPE", headerText: "PLAN_TP", dataType: "string", width: "100", visible: true, editable: false }
]

function PopPlanPolicy(props) {
  const [grid, setGrid] = useState(null);

  useEffect(() => {
    if (grid) {
      setGridOptions();
      loadData();
    }
  }, [grid]);

  function afterGridCreate(gridObject) {
    setGrid(gridObject);
  }

  function setGridOptions() {
    grid.gridView.setEditOptions({
      insertable: true,
      appendable: true
    });

    grid.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(grid, true, false, false);

    grid.gridView.onCellDblClicked = function (currentGrid, clickData) {
      if (clickData.cellType === 'data') {
        saveSubmit();
      }
    }
  }

  function loadData() {
    let params = new URLSearchParams();

    params.append('Q_TYPE', 'POLICY');
    params.append('VAL_01', props.data.module);
    params.append('VAL_02', props.data.process);

    zAxios({
      fromPopup: true,
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_CM_16_Q2',
      data: params
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        grid.dataProvider.clearRows();
        grid.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
  }

  function saveSubmit() {
    let focusCell = grid.gridView.getCurrent();
    let targetRow = focusCell.dataRow;
    if (targetRow >= 0) {
      props.confirm(grid.dataProvider.getJsonRow(targetRow));
      props.onClose(false);
    }
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={saveSubmit} title="PLAN_POLICY" resizeHeight={335} resizeWidth={700}>
      <BaseGrid id="PlanScenario_PopNewPlanScenario_PopPlanPolicyGrid" items={gridItems} afterGridCreate={afterGridCreate} />
    </PopupDialog>
  );
}

export default PopPlanPolicy;
