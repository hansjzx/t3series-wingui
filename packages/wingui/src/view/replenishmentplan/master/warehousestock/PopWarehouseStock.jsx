import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { BaseGrid, PopupDialog, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';

let popupGridItems = [
  { name: 'WAHOUS_MST_ID', dataType: 'text', headerText: 'WAHOUS_MST_ID', visible: false, editable: false, width: 100 },
  { name: 'GLOBAL_PLAN_BOM_ID', dataType: 'text', headerText: 'GLOBAL_PLAN_BOM_ID', visible: false, editable: false, width: 100 },
  {
    name: 'FROM_LOCAT_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'FROM_LOCAT', headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: 'TO_LOCAT_TP_NM', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: 100 },
      { name: 'TO_LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: 100 },
      { name: 'TO_LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: 100 },
      { name: 'TO_LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: 100 },
      { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: false, editable: true, width: 60 }
    ]
  },
  {
    name: 'TO_LOCAT_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'TO_LOCAT', headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: 'FROM_LOCAT_TP_NM', dataType: 'text', headerText: 'FROM_LOCAT_TP_NM', visible: true, editable: false, width: 100 },
      { name: 'FROM_LOCAT_LV', dataType: 'text', headerText: 'FROM_LOCAT_LV', visible: true, editable: false, width: 100 },
      { name: 'FROM_LOCAT_CD', dataType: 'text', headerText: 'FROM_LOCAT_CD', visible: true, editable: false, width: 100 },
      { name: 'FROM_LOCAT_NM', dataType: 'text', headerText: 'FROM_LOCAT_NM', visible: true, editable: false, width: 100 }
    ]
  }
]

function PopWarehouseStock(props) {
  const [grid, setGrid] = useState(null);
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData,state.getViewInfo])

  const { handleSubmit, clearErrors } = useForm({
    defaultValues: { }
  });

  useEffect(() => {
    const grdObjPopup = getViewInfo(vom.active, `${props.id}_PopWarehouseStockGrid`);
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
    setVisibleProps(grid, true, true, false);
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
    grid.gridView.showToast(progressSpinner + 'Load Data...', true);

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: 'engine/mp/SRV_UI_IM_12_Q2',
      params: {
        'WAREHOUSE_INV_MST_ID': props.data.ID
      },
      fromPopup: true
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
    if (targetRow >= 0) {
      props.confirm(grid.dataProvider.getJsonRow(targetRow));
      props.onClose(false);
    }
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="POP_UI_IM_12_01" resizeHeight={600} resizeWidth={1000}>
      <Box style={{height: "100%"}}>
        <BaseGrid id={`${props.id}_PopWarehouseStockGrid`} items={popupGridItems} />
      </Box>
    </PopupDialog>
  );
}

export default PopWarehouseStock;
