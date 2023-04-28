import React, { useState, useEffect } from 'react';
import { BaseGrid, PopupDialog, zAxios } from '@zionex/wingui-core/src/common/imports';

let gridItems = [
  { name: "DTL_ID", headerText: "DTL_ID", dataType: "string", width: "100", visible: false, editable: false },
  { name: "STEP", headerText: "STEP", dataType: "number", width: "80", visible: true, editable: false },
  { name: "PROCESS_DESCRIP", headerText: "PROCESS_DESCRIP", dataType: "string", width: "200", visible: true, editable: false },
  { name: "PROCESS_TP_NM", headerText: "PROCESS_TP", dataType: "string", width: "100", visible: true, editable: false }
]

function PopConfirmSubjectPlan(props) {
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
    let masterId = props.data ? props.data : '';

    params.append('Q_TYPE', 'CONFRM_PLAN_SNRIO');
    params.append('VAL_01', masterId);
    params.append('VAL_02', '');

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
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={saveSubmit} title="CONFRM_SUBJECT_PLAN" resizeHeight={460} resizeWidth={500}>
      <BaseGrid id="PlanScenario_PopNewPlanScenario_PopConfirmSubjectPlanGrid" items={gridItems} afterGridCreate={afterGridCreate} />
    </PopupDialog>
  );
}

export default PopConfirmSubjectPlan;
