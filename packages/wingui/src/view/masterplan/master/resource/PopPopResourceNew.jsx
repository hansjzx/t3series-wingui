import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { BaseGrid, PopupDialog, zAxios } from '@zionex/wingui-core/src/common/imports';

let popupGridItems = [
  { name: 'ID', dataType: 'text', headerText: 'ID', visible: false, editable: false, width: '100' },
  { name: 'LOCAT_TP_NM', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: '100' },
  { name: 'LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: '100' },
  { name: 'LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: '100' },
  { name: 'LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: '100' },
  { name: 'PLAN_RES_TP_ID', dataType: 'text', headerText: 'PLAN_RES_TP_ID', visible: false, editable: false, width: '100' },
  { name: 'PLAN_RES_TP', dataType: 'text', headerText: 'PLAN_RES_TP', visible: true, editable: false, width: '120' },
  { name: 'ROUTE_GRP', dataType: 'text', headerText: 'ROUTE_GRP', visible: true, editable: false, width: '100' },
  { name: 'RES_GRP_CD', dataType: 'text', headerText: 'RES_GRP_CD', visible: true, editable: false, width: '100' },
  { name: 'RES_DESCRIP', dataType: 'text', headerText: 'RES_DESCRIP', visible: true, editable: false, width: '100' },
  { name: 'RES_GRP_TP', dataType: 'text', headerText: 'RES_GRP_TP', visible: true, editable: false, width: '100' },
  { name: 'WC', dataType: 'text', headerText: 'WC', visible: true, editable: false, width: '100' }
];

function PopPopResourceNew(props) {
  const [grid, setGrid] = useState(null);

  const { handleSubmit, clearErrors } = useForm({ defaultValues: {} });

  function afterGridCreate(gridObj) {
    setGrid(gridObj);
  }

  useEffect(() => {
    if (grid) {
      setOptionsGrid();
    }
  }, [grid]);

  const setOptionsGrid = () => {
    setVisibleProps(grid, true, false, false);

    grid.gridView.setDisplayOptions({ fitStyle: "fill" });

    grid.gridView.onCellDblClicked = function (grid, clickData) {
      if (clickData.cellType === "data") {
        saveSubmit();
      }
    };

    loadDataGrid();
  }

  function loadDataGrid() {
    zAxios({
      method: 'post',
      url: 'engine/mp/SRV_UI_MP_06_POP_Q5',
      data: new FormData()
    })
      .then(function (res) {
        grid.setData(res.data.RESULT_DATA);
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  const saveSubmit = () => {
    let focusCell = grid.gridView.getCurrent();
    let targetRow = focusCell.dataRow;

    if (targetRow !== -1) {
      props.confirm(grid.dataProvider.getJsonRow(targetRow));
    }

    props.onClose(false);
  }

  function onError(errors) {
    if (typeof errors !== 'undefined' && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  return (
    <>
      <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="COMM_SRH_POP_LOCAT" resizeHeight={400} resizeWidth={1200}>
        <Box style={{ height: "100%" }}>
          <BaseGrid id={`${props.id}_PopPopResourceNewGrid`} items={popupGridItems} afterGridCreate={afterGridCreate} ></BaseGrid>
        </Box>
      </PopupDialog>
    </>
  );
}

export default PopPopResourceNew;
