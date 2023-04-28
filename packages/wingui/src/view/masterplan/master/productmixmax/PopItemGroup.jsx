import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { BaseGrid, PopupDialog, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';

let popupGridItems = [
  { name: 'ID', dataType: 'text', headerText: 'ID', visible: false, editable: false, width: '100' },
  { name: 'ITEM_LV_NM', dataType: 'text', headerText: 'ITEM_LV_NM', visible: true, editable: false, width: '100' },
  { name: 'ITEM_CLASS_VAL', dataType: 'text', headerText: 'ITEM_CLASS_VAL', visible: true, editable: false, width: '100' },
  { name: 'DESCRIP', dataType: 'text', headerText: 'DESCRIP', visible: true, editable: false, width: '100' },
  { name: 'ITEM_CLASS_DTL_ID', dataType: 'text', headerText: 'ITEM_CLASS_DTL_ID', visible: false, editable: false, width: '100' },
  { name: 'ITEM_GRP', dataType: 'text', headerText: 'ITEM_GRP', visible: true, editable: false, width: '100' },
  { name: 'ITEM_GRP_DESCRIP', dataType: 'text', headerText: 'ITEM_GRP_DESCRIP', visible: true, editable: false, width: '100' }
];

function PopItemGroup(props) {
  const [grid, setGrid] = useState(null);
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData,state.getViewInfo]);

  const { handleSubmit, clearErrors } = useForm({
    defaultValues: { }
  });

  useEffect(() => {
    const grdObjPopup = getViewInfo(vom.active, `${props.id}_PopItemGroupGrid`);
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

    grid.gridView.setColumnProperty('ITEM_LV_NM', 'mergeRule', { criteria: 'value' });

    let columnArr = ["ITEM_CLASS_VAL", "DESCRIP"];
    for (let i = 0; i < columnArr.length; i++) {
      grid.gridView.setColumnProperty(columnArr[i], "mergeRule", { criteria: "prevvalues + value" });
    }

    wingui.util.grid.sorter.orderBy(grid.gridView, ['ITEM_LV_NM', 'ITEM_CLASS_VAL', 'DESCRIP']);
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
      method: 'post',
      url: 'engine/mp/SRV_UI_MP_16_POP_Q3',
      data: new FormData()
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
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="POP_UI_MP_ITEM_CLASS" resizeHeight={400} resizeWidth={800}>
      <Box style={{height: "100%"}}>
        <BaseGrid id={`${props.id}_PopItemGroupGrid`} items={popupGridItems} />
      </Box>
    </PopupDialog>
  );
}

export default PopItemGroup;
