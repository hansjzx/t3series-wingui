import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { BaseGrid, PopupDialog, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';

let popupGridItems = [
  { name: 'ID', dataType: 'text', headerText: 'ID', visible: false, editable: false, width: '100' },
  { name: 'ITEM_LV_NM', dataType: 'text', headerText: 'ITEM_LV_NM', visible: true, editable: false, width: '150' },
  { name: 'ITEM_CLASS_VAL', dataType: 'text', headerText: 'ITEM_CLASS_VAL', visible: true, editable: false, width: '150' },
  { name: 'DESCRIP', dataType: 'text', headerText: 'DESCRIP', visible: true, editable: false, width: '150' },
  { name: 'CONTINU_PRDUCT_YN', dataType: 'boolean', headerText: 'CONTINU_PRDUCT_YN', visible: true, editable: false, width: '150' },
  { name: 'PROD_MIX_YN', dataType: 'boolean', headerText: 'PROD_MIX_YN', visible: true, editable: false, width: '100' },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: false, width: '80' }
]

function PopCommItemClass(props) {
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
    grid.gridView.setDisplayOptions({
      fitStyle: 'evenFill',
    });

    grid.gridView.displayOptions.selectionStyle = 'singleRow';

    grid.gridView.onCellDblClicked = function () {
      saveSubmit();
    };

    if (props.id == 'POP_UI_CM_03_07') {
      grid.gridView.columnByName("CONTINU_PRDUCT_YN").visible = false;
      grid.gridView.columnByName("PROD_MIX_YN").visible = false;
      grid.gridView.columnByName("ACTV_YN").visible = false;
    }

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
    let param = {
      DATA_DIV: 'GET_ITEM_CLASS',
      PARAM1 : '',
      PARAM2 : '',
      PARAM3 : ''
    }

    zAxios({
      fromPopup: true,
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: 'engine/mp/SRV_UI_COMM_DATA_Q',
      params: param
    })
    .then(function (res) {
      grid.dataProvider.fillJsonData(res.data.RESULT_DATA);
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
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="POP_UI_MP_ITEM_CLASS" resizeHeight={300} resizeWidth={800}>
      <Box style={{height: "100%"}}>
        <BaseGrid id={`${props.id}_PopItemClassGrid`} items={popupGridItems} />
      </Box>
    </PopupDialog>
  );
}

export default PopCommItemClass;
