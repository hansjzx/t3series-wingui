import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { BaseGrid, PopupDialog, zAxios } from '@zionex/wingui-core/src/common/imports';

const gridItems = [
  { name: 'LOCAT_ID', dataType: 'text', headerText: 'LOCAT_DTL_ID', visible: false, editable: false, width: '100' },
  { name: 'LOCAT_NM', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: '150' },
  { name: 'LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: '150' },
]

function PopSelectLocation(props) {
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
    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: 'engine/mp/SRV_UI_CM_15_Q8',
      data: new FormData(),
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
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={onSubmit} title="LOCAT_CHOICE" resizeHeight={400} resizeWidth={600}>
      <Box style={{ height: "100%" }}>
        <BaseGrid id={props.id + "_PopLocationGrid"} items={gridItems} afterGridCreate={afterGridCreate} />
      </Box>
    </PopupDialog>
  );
}

export default PopSelectLocation;
