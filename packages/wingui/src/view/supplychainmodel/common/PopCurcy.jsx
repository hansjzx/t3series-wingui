import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { BaseGrid, PopupDialog, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';

let popupGrid1Items = [
  { name: 'ID', dataType: 'text', headerText: 'ID', visible:false, editable:false, width: '100' },
  { name: 'SRC_ID', dataType: 'text', headerText: 'SRC_ID', visible:false, editable:false, width: '100' },
  { name: 'VIEW_ID', dataType: 'text', headerText: 'VIEW_ID', visible:false, editable:false, width: '100' },
  { name: 'COMN_CD', dataType: 'text', headerText: 'COMN_CD', visible:true, editable:false, width: '150' },
  { name: 'COMN_CD_NM', dataType: 'text', headerText: 'COMN_CD_NM', visible:true, editable:false, width: '150' }
]

function PopCurcy(props) {
  const [grid, setGrid] = useState(null);

  const [viewData,getViewInfo] = useViewStore(state => [state.viewData,state.getViewInfo])
  const { handleSubmit, clearErrors } = useForm({
    defaultValues: { }
  });

  useEffect(() => {
    const grdObjPopup = getViewInfo(vom.active,`${props.id}_CurcyGrid`);
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

  const setOptions = () => {
    setVisibleProps(grid, true, false, false);
    grid.gridView.setDisplayOptions({
      fitStyle: 'evenFill'
    });

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
    grid.gridView.showToast(progressSpinner + 'Load Data...', true);

    zAxios({
      fromPopup: true,
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: 'engine/mp/SRV_UI_CM_04_POP_01_Q',
      params: {
        'CONF_KEY': '002',
        'ITEM_CD': '',
        'ITEM_NM': '',
        'DESCRIP': '',
        'ITEM_LV': '',
        'ITEM_TP': '',
        'timeout': 0,
        'VIEW_ID': 'POP_UI_CM_04_01',
        'PREV_OPERATION_CALL_ID': 'OPC_POP_UI_CM_04_01_WINDOW_01_CPT_11_05_CLICK',
        'CURRENT_OPERATION_CALL_ID': 'OPC_POP_UI_CM_04_01_WINDOW_01_CPT_11_05_CLICK_01'
      }
    })
    .then(function (res) {
      grid.dataProvider.fillJsonData(res.data.RESULT_DATA);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      grid.gridView.hideToast();
    });
  }

  function saveSubmit() {
    let focusCell = grid.gridView.getCurrent();
    let targetRow = focusCell.dataRow;
    props.confirm(grid.dataProvider.getJsonRow(targetRow));
    props.onClose(false);
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit,onError)} title="CURCY_CD" resizeHeight={700} resizeWidth={400}>
      <Box style={{height: "100%"}}>
        <BaseGrid id={`${props.id}_CurcyGrid`} items={popupGrid1Items}></BaseGrid>
      </Box>
    </PopupDialog>
  );
}

export default PopCurcy;
