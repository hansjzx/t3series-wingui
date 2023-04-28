import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { BaseGrid, PopupDialog, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';

let popupGridItems = [
  { name: 'ITEM_CLASS_VAL', dataType: 'text', headerText: 'ITEM_CLASS_VAL', visible: true, editable: false, width: '100' },
  { name: 'DESCRIP', dataType: 'text', headerText: 'DESCRIP', visible: true, editable: false, width: '100' },
  { name: 'ITEM_LV_NM', dataType: 'text', headerText: 'ITEM_LV_NM', visible: false, editable: false, width: '100' }
];

function PopItemClass(props) {
  const [grid, setGrid] = useState(null);
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData,state.getViewInfo]);

  const { handleSubmit, clearErrors } = useForm({
    defaultValues: { }
  });

  useEffect(() => {
    const grdObjPopup = getViewInfo(vom.active, `${props.id}_PopItemClassGrid`);
    if (grdObjPopup) {
      if (grdObjPopup.dataProvider) {
        if (grid != grdObjPopup) {
          setGrid(grdObjPopup);
        }
      }
    }
  }, [viewData]);

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
    if (typeof errors !== 'undefined' && Object.keys(errors).length > 0 ) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  function popupLoadData() {
    let formData = new FormData();
    formData.append('SP_COMM_SRH_ITEM_CLASS_01', props.data);

    zAxios({
      method: 'post',
      url: 'engine/mp/SRV_GET_ITEM_CLASS',
      data: formData,
      fromPopup: true
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
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="POP_UI_CM_03_03" resizeHeight={400} resizeWidth={500}>
      <Box style={{height: "100%"}}>
        <BaseGrid id={`${props.id}_PopItemClassGrid`} items={popupGridItems} />
      </Box>
    </PopupDialog>
  );
}

export default PopItemClass;
