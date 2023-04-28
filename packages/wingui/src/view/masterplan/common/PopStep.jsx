import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { BaseGrid, PopupDialog, zAxios } from '@zionex/wingui-core/src/common/imports';

let gridStepColumns = [
  { name: "ID", headerText: "ID", dataType: "text", visible: false },
  { name: "STEP", headerText: "STEP", dataType: "number", width: "80", editable: false },
  { name: "PLAN_POLICY_VER_ID", headerText: "PLAN_POLICY_VERSION", dataType: "text", width: "100", editable: false },
  { name: "PLAN_POLICY_DESCRIP", headerText: "DESCRIP", dataType: "text", width: "200", editable: false },
  { name: "PROCESS_DESCRIP", headerText: "PROCESS_DESCRIP", dataType: "text", width: "200", editable: false }
]

function PopStep(props) {
  const [gridStep, setGridStep] = useState(null);

  useEffect(() => {
    async function initLoad() {
      if (gridStep) {
        setGridStepOptions();
        await loadStep();
      }
    }

    initLoad();
  }, [gridStep]);

  function afterGridStep(gridObj) {
    setGridStep(gridObj);
  }

  function setGridStepOptions() {
    gridStep.gridView.setEditOptions({
      insertable: true,
      appendable: true
    });

    gridStep.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridStep, true, false, false);

    gridStep.gridView.onCellDblClicked = function (gridObj, clickData) {
      if (clickData.cellType === 'data') {
        props.confirm(gridObj.getValues(clickData.itemIndex));
        props.onClose();
      }
    }
  }

  function loadStep() {
    let param = new URLSearchParams();

    param.append('SIMUL_VER_ID', props.versionId);

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_CM_17_Q4',
      data: param,
      fromPopup: true
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridStep.dataProvider.clearRows();
        gridStep.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  return (
    <PopupDialog type="NOBUTTONS" open={props.open} onClose={props.onClose} title="SELECT_STEP" resizeHeight={300} resizeWidth={1000}>
      <Box style={{ height: "100%" }}>
        <BaseGrid id="gridPopStep" items={gridStepColumns} afterGridCreate={afterGridStep} />
      </Box>
    </PopupDialog>
  )
}

export default PopStep;
