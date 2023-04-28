import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { BaseGrid, PopupDialog, zAxios } from '@zionex/wingui-core/src/common/imports';

let popupGridItems = [
  { name: 'RES_GRP_ID', dataType: 'text', headerText: 'RES_GRP_ID', visible: false, editable: false, width: '100' },
  { name: 'VIEW_ID', dataType: 'text', headerText: 'VIEW_ID', visible: false, editable: false, width: '100' },
  { name: 'RES_GRP_CD', dataType: 'text', headerText: 'RES_GRP_CD', visible: true, editable: false, width: '100' },
  { name: 'RES_GRP_DESCRIP', dataType: 'text', headerText: 'RES_GRP_DESCRIP', visible: true, editable: false, width: '100' },
  { name: 'RES_GRP_TP', dataType: 'text', headerText: 'RES_GRP_TP', visible: true, editable: false, width: '100' }
]

function PopResourceGroup(props) {
  const [grid, setGrid] = useState(null);

  const { handleSubmit, clearErrors } = useForm({ defaultValues: { }  });

  function afterGridCreate(gridObj) {
    setGrid(gridObj);
  }

  useEffect(() => {
    async function initLoad() {
      if (grid) {
        setOptions();

        await popupLoadData();
      }
    }

    initLoad();
  }, [grid]);

  function setOptions() {
    setVisibleProps(grid, true, false, false);
    grid.gridView.setDisplayOptions({ fitStyle: 'fill' });

    grid.gridView.displayOptions.selectionStyle = 'singleRow';

    grid.gridView.onCellDblClicked = function () {
      saveSubmit();
    };
  }

  const onError = (errors, e) => {
    if (typeof errors !== 'undefined' && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  function popupLoadData() {
    let formData = new FormData();

    formData.append('VIEW_ID', 'UI_MP_06');

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: 'engine/mp/SRV_UI_MP_06_POP_Q2',
      data: formData
    })
      .then(function (res) {
        grid.setData(res.data.RESULT_DATA);
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function saveSubmit() {
    let focusCell = grid.gridView.getCurrent();
    let targetRow = focusCell.dataRow;
    props.confirm(grid.dataProvider.getJsonRow(targetRow));
    props.onClose(false);
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="POP_UI_MP_06_04" resizeHeight={400} resizeWidth={500}>
      <Box style={{ height: "100%" }}>
        <BaseGrid id={`${props.id}_PopResourceGrid`} items={popupGridItems} afterGridCreate={afterGridCreate} />
      </Box>
    </PopupDialog>
  );
}

export default PopResourceGroup;
