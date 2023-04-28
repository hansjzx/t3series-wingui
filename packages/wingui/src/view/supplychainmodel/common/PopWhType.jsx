import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { BaseGrid, PopupDialog,  useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';

let popupGridItems = [
  { name: 'ID', dataType: 'text', headerText: 'ID', visible: false, editable: false, width: 100 },
  { name: 'WAREHOUSE_TP', dataType: 'text', headerText: 'WAREHOUSE_TP', visible: true, editable: false, width: 100 },
  { name: 'WAREHOUSE_TP_NM', dataType: 'text', headerText: 'WAREHOUSE_NM', visible: true, editable: false, width: 100 },
  { name: 'LOAD_CAPA_MGMT_BASE', dataType: 'text', headerText: 'LOAD_CAPA_MGMT_BASE', visible: true, editable: false, width: 150 }
];

function PopWhType(props) {
  const [grid, setGrid] = useState(null);
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);

  const { handleSubmit, clearErrors } = useForm({
    defaultValues: {
      groupName: '',
      username: '',
    }
  });

  useEffect(() => {
    const grdObjPopup = getViewInfo( vom.active, `${props.id}_PopWhTypeGrid`);
    if (grdObjPopup) {
      if (grdObjPopup.dataProvider) {
        if (grid != grdObjPopup) {
          setGrid(grdObjPopup);
        }
      }
    }
  }, [viewData]);

  useEffect(() =>{
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
    zAxios({
      fromPopup: true,
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_IM_11_Q2',
      params: {
        'PREV_OPERATION_CALL_ID': 'openWindow1'
      }
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
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="POP_UI_IM_11_02" resizeHeight={700} resizeWidth={600}>
      <Box style={{height: "100%"}}>
        <BaseGrid id={`${props.id}_PopWhTypeGrid`} items={popupGridItems} />
      </Box>
    </PopupDialog>
  );
}

export default PopWhType;
