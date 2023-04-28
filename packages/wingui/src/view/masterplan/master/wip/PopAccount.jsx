import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { BaseGrid, PopupDialog, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';

let popupGridItems = [
  { name: 'ID', dataType: 'text', headerText: 'ID', visible: false, editable: false, width: '100' },
  { name: 'ACCOUNT_CD', dataType: 'text', headerText: 'ACCOUNT_CD', visible: true, editable: false, width: '100' },
  { name: 'ACCOUNT_NM', dataType: 'text', headerText: 'ACCOUNT_NM', visible: true, editable: false, width: '100' }
]

function PopAccount(props) {
  const [grid, setGrid] = useState(null);
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);

  const { handleSubmit, clearErrors } = useForm({ defaultValues: { } });

  useEffect(() => {
    const grdObjPopup = getViewInfo(vom.active, `${props.id}_PopAccountGrid`);
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

    formData.append('WIP_MST_ID', props.data);

    zAxios({
      method: 'post',
      url: 'engine/mp/SRV_UI_MP_02_POP_Q2',
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
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="COMM_SRH_POP_ACCOUNT" resizeHeight={600} resizeWidth={500}>
        <BaseGrid id={`${props.id}_PopAccountGrid`} items={popupGridItems} />
    </PopupDialog>
  );
}

export default PopAccount;
