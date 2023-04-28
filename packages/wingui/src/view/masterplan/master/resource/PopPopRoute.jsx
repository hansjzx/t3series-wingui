import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { BaseGrid, PopupDialog, zAxios } from '@zionex/wingui-core/src/common/imports';

let popupGridItems = [
  { name: 'ID', dataType: 'text', headerText: 'LOCAT_MST_ID', visible: false, editable: false, width: '100' },
  { name: 'ROUTE_CD', dataType: 'text', headerText: 'ROUTE_CD', visible: true, editable: false, width: '100' },
  { name: 'ROUTE_DESCRIP', dataType: 'text', headerText: 'ITEM_TP', visible: true, editable: false, width: '100' }
]

function PopPopRoute(props) {
  const [grid, setGrid] = useState(null);

  const { handleSubmit, clearErrors } = useForm({ defaultValues: { } });

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

    formData.append('LOCAT_MGMT_ID', props.data.locatMgmtId);
    formData.append('ITEM_MST_ID', props.data.itemMstId);

    zAxios({
      method: 'post',
      url: 'engine/mp/SRV_UI_MP_08_POP_Q5',
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
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="POP_UI_MP_06_08_04" resizeHeight={400} resizeWidth={500}>
      <BaseGrid id={`${props.id}_PopRouteGrid`} items={popupGridItems} afterGridCreate={afterGridCreate} />
    </PopupDialog>
  );
}

export default PopPopRoute;
