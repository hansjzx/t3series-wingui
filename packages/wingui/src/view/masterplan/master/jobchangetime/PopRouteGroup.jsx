import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { BaseGrid, PopupDialog, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';

let popupGridItems = [
  { name: 'ID', dataType: 'text', headerText: 'ID', visible: false, editable: false, width: '100' },
  { name: 'ROUTE_CLASS_VAL', dataType: 'text', headerText: 'ROUTE_CLASS_VAL', visible: true, editable: false, width: '150' },
  { name: 'DESCRIP', dataType: 'text', headerText: 'DESCRIP', visible: true, editable: false, width: '100' },
  { name: 'ROUTE_CLASS_DTL_ID', dataType: 'text', headerText: 'ROUTE_CLASS_DTL_ID', visible: false, editable: false, width: '100' },
  { name: 'ROUTE_GRP', dataType: 'text', headerText: 'ROUTE_GRP', visible: true, editable: false, width: '100' },
  { name: 'ROUTE_GRP_DESCRIP', dataType: 'text', headerText: 'ROUTE_GRP_DESCRIP', visible: true, editable: false, width: '150' }
]

function PopRouteGroup(props) {
  const [grid, setGrid] = useState(null);
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);

  const { handleSubmit, clearErrors } = useForm({
    defaultValues: { }
  });

  useEffect(() => {
    const grdObjPopup = getViewInfo(vom.active, `${props.id}_PopRouteGroupGrid`);
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

    wingui.util.grid.sorter.orderBy(grid.gridView, ['ROUTE_CLASS_VAL', 'DESCRIP']);
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
    zAxios({
      method: 'post',
      url: 'engine/mp/SRV_UI_MP_23_POP_Q1',
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
    props.confirm(grid.dataProvider.getJsonRow(targetRow), props.clickFrom);
    props.onClose(false);
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="ROUTE_GRP" resizeHeight={600} resizeWidth={600}>
      <Box style={{ height: "100%" }}>
        <BaseGrid id={`${props.id}_PopRouteGroupGrid`} items={popupGridItems} />
      </Box>
    </PopupDialog>
  );
}

export default PopRouteGroup;
