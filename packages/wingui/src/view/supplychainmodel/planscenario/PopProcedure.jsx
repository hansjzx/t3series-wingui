import React, { useState, useEffect } from 'react';
import { BaseGrid, PopupDialog, zAxios } from '@zionex/wingui-core/src/common/imports';

let gridItems = [
  { name: 'PROC_NM', headerText: 'PROCEDURE_NM', dataType: 'string', width: '250', visible: true, editable: false }
]

function PopProcedure(props) {
  const [grid, setGrid] = useState(null);

  function afterGridCreate(gridObj) {
    setGrid(gridObj);
  }

  useEffect(() => {
    if (grid) {
      setGridOptions();
      loadData();
    }
  }, [grid]);

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

    params.append('Q_TYPE', 'PROC_NM');
    params.append('VAL_01', '');
    params.append('VAL_02', '');

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_CM_16_Q2',
      data: params,
      fromPopup: true
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

  function close() {
    props.onClose(false);
  }

  return (
    <PopupDialog open={props.open} onClose={close} onSubmit={saveSubmit} title="EXEC_PROCEDURE" resizeHeight={550} resizeWidth={400}>
      <BaseGrid id="PlanScenario_PopNewPlanScenario_PopProcedureGrid" items={gridItems} afterGridCreate={afterGridCreate} />
    </PopupDialog>
  );
}

export default PopProcedure;
