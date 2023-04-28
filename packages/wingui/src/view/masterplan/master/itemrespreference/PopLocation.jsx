import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { BaseGrid, PopupDialog, zAxios } from '@zionex/wingui-core/src/common/imports';

const gridItems = [
  { name: 'LOCAT_DTL_ID', dataType: 'text', headerText: 'LOCAT_DTL_ID', visible: false, editable: false, width: '100' },
  { name: 'LOCAT_TP_NM', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: '120' },
  { name: 'LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: '120' },
  { name: 'LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: '120' },
  { name: 'LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: '150' },
  { name: 'PLAN_RES_TP', dataType: 'text', headerText: 'PLAN_RES_TP', visible: true, editable: false, width: '150' }
];

function PopLocation(props) {
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
      url: 'engine/mp/SRV_UI_MP_08_POP_Q3',
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
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={onSubmit} title="LOCAT_CHOICE" resizeHeight={600} resizeWidth={700}>
      <Box style={{ height: "100%" }}>
        <BaseGrid id="PopLocationGrid" items={gridItems} afterGridCreate={afterGridCreate} />
      </Box>
    </PopupDialog>
  );
}

export default PopLocation;
