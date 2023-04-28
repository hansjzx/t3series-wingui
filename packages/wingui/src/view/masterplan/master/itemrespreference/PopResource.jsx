import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { BaseGrid, PopupDialog, zAxios } from '@zionex/wingui-core/src/common/imports';

const gridItems = [
  { name: 'RES_MGMT_MST_ID', dataType: 'text', headerText: 'RES_MGMT_MST_ID', visible: false, editable: false, width: '50' },
  { name: 'RES_MGMT_DTL_ID', dataType: 'text', headerText: 'RES_MGMT_DTL_ID', visible: false, editable: false, width: '50' },
  { name: 'RES_CD', dataType: 'text', headerText: 'RES_CD', visible: true, editable: false, width: '100' },
  { name: 'RES_DESCRIP', dataType: 'text', headerText: 'RES_DESCRIP', visible: true, editable: false, width: '100' }
]

function PopResource(props) {
  const [grid, setGrid] = useState(null);

  useEffect(() => {
    if (grid) {
      setOptions();
      loadData();
    }
  }, [grid]);

  function afterGridCreate(gridObj) {
    setGrid(gridObj);
  }

  function setOptions() {
    setVisibleProps(grid, true, false, false);

    grid.gridView.setDisplayOptions({ fitStyle: 'fill' });

    grid.gridView.onCellDblClicked = function () {
      onSubmit();
    };
  }

  function loadData() {
    let formData = new FormData();

    formData.append('LOC_MGMT_ID', '');

    zAxios({
      method: 'post',
      url: 'engine/mp/SRV_UI_MP_11_Q2',
      data: formData,
      fromPopup: true
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        grid.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function onSubmit() {
    let focusCell = grid.gridView.getCurrent();
    props.confirm(grid.dataProvider.getJsonRow(focusCell.dataRow));
    props.onClose(false);
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={onSubmit} title="COMM_SRH_POP_RES" resizeHeight={500} resizeWidth={400}>
      <Box style={{ height: "100%" }}>
        <BaseGrid id="PopResourceGrid" items={gridItems} afterGridCreate={afterGridCreate} />
      </Box>
    </PopupDialog>
  );
}

export default PopResource;
