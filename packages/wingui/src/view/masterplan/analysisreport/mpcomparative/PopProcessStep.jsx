import React, { useEffect, useState } from 'react';
import { BaseGrid, PopupDialog, zAxios } from '@zionex/wingui-core/src/common/imports';

let gridProcessStepColumns = [
  { name: "SNRIO_MGMT_MST_ID", headerText: "SNRIO_MGMT_MST_ID", dataType: "text", visible: false },
  { name: "STEP", headerText: "STEP", dataType: "number", width: "50", editable: false },
  { name: "PROCESS_TP_01", headerText: "PROCESS_TP", dataType: "text", width: "100", editable: false },
  { name: "PROCESS_DESCRIP", headerText: "PROCESS_DESCRIP", dataType: "text", width: "180", editable: false },
  { name: "PROCESS_TP_02", headerText: "PROCESS_TP", dataType: "text", width: "100", editable: false }
]

function PopProcessStep(props) {
  const [gridProcessStep, setGridProcessStep] = useState(null);

  useEffect(() => {
    async function initLoad() {
      if (gridProcessStep) {
        setGridProcessStepOptions();
        await loadProcessStep();
      }
    }

    initLoad();
  }, [gridProcessStep]);

  function afterGridProcessStep(gridObj) {
    setGridProcessStep(gridObj);
  }

  function setGridProcessStepOptions() {
    gridProcessStep.gridView.setEditOptions({
      insertable: true,
      appendable: true
    });

    gridProcessStep.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridProcessStep, true, false, false);

    gridProcessStep.gridView.setColumnProperty('MODULE_CD', 'mergeRule', { criteria: 'value' });

    gridProcessStep.gridView.onCellDblClicked = function (gridObj, clickData) {
      if (clickData.cellType === 'data') {
        props.confirm(gridObj.getValues(clickData.itemIndex));
        props.onClose();
      }
    }
  }

  function loadProcessStep() {
    let param = new URLSearchParams();

    param.append('MAIN_VER_ID', props.mainVerId);

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_COMM_SRH_PROCESS_STEP_Q',
      data: param,
      fromPopup: true
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridProcessStep.dataProvider.clearRows();
        gridProcessStep.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} title="SCENARIO_STEP" resizeHeight={400} resizeWidth={950}>
        <BaseGrid id="gridPopProcessStep" items={gridProcessStepColumns} afterGridCreate={afterGridProcessStep} />
    </PopupDialog>
  )
}

export default PopProcessStep;
