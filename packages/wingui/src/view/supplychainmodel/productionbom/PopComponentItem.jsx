import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { PopupDialog, BaseGrid, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';

let popupGrid1Items = [
  { name: 'ID', dataType: 'text', headerText: 'ID', visible:false, editable:false, width: '100' },
  { name: 'BOM_VER_ID', dataType: 'text', headerText: 'BOM_VER_ID', visible:true, editable:false, width: '100' },
  { name: 'VER_ACTV_YN', dataType: 'boolean', headerText: 'VER_ACTV_YN', visible:true, editable:true, width: '100' },
  { name: 'BASE_BOM_YN', dataType: 'boolean', headerText: 'BASE_BOM_YN', visible:true, editable:true, width: '100' },
  { name: 'BOM_LV', dataType: 'number', headerText: 'BOM_LV', visible:true, editable:false, width: '100' },
  { name: 'ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', visible:true, editable:false, width: '100' },
  { name: 'ITEM_NM', dataType: 'text', headerText: 'ITEM_NM', visible:true, editable:false, width: '100' },
  { name: 'ITEM_TP', dataType: 'text', headerText: 'ITEM_TP', visible:true, editable:false, width: '100' },
  { name: 'ROUTE_CD', dataType: 'text', headerText: 'ROUTE_CD', visible:true, editable:false, width: '100' },
  { name: 'ROUTE_DESCRIP', dataType: 'text', headerText: 'ROUTE_DESCRIP', visible:true, editable:false, width: '100' },
  { name: 'BOM_ITEM_TP', dataType: 'text', headerText: 'BOM_ITEM_TP', visible:true, editable:false, width: '100' },
  { name: 'CONSUME_QTY', dataType: 'number', headerText: 'CONSUME_QTY', visible:true, editable:false, width: '100' },
  { name: 'UOM_CD', dataType: 'text', headerText: 'UOM_NM', visible:true, editable:false, width: '100' },
  { name: 'BASE_BOM_RATE', dataType: 'number', headerText: 'BASE_BOM_RATE', visible:true, editable:true, width: '100' }
];

function PopComponentItem(props) {
  const [grid, setGrid] = useState(null);

  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo])
  const { handleSubmit, getValues } = useForm({
    defaultValues: {
      id: props.data.globalBomMstId,
      itemCd: props.data.itemCd,
      componentItemCd: '',
      componentItemDescrip: ''
    }
  });

  useEffect(() => {
    const grdObjPopup = getViewInfo(vom.active, `${props.id}_ComponentItemGrid`);

    if (grdObjPopup) {
      if (grdObjPopup.dataProvider) {
        if (grid != grdObjPopup) {
          setGrid(grdObjPopup);
        }
      }
    }
  }, [viewData]);

  useEffect(() => {
    if (grid) {
      setOptionsGrid();
    }
  }, [grid]);

  const setOptionsGrid = () => {
    setVisibleProps(grid, true, false, false);

    grid.gridView.setDisplayOptions({
      fitStyle: "fill"
    });

    grid.gridView.onCellDblClicked = function (grid, clickData) {
      if (clickData.cellType === "data") {
        saveSubmit();
      }
    };

    const mergeColumns = [ "BOM_VER_ID", "VER_ACTV_YN", "BASE_BOM_YN", "BOM_LV" ];
    for (let i = 0; i < mergeColumns.length; i++) {
      grid.gridView.setColumnProperty(mergeColumns[i], "mergeRule", {
        criteria: "value"
      });
    }

    loadData();
  }

  function loadData() {
    grid.gridView.showToast(progressSpinner + 'Load Data...', true);

    let param = new URLSearchParams();

    param.append('ID', getValues('id'));
    param.append('ITEM_CD', getValues('itemCd'));
    param.append('COMPONENT_ITEM_CD', getValues('componentItemCd'));
    param.append('COMPONENT_ITEM_DESCRIP', getValues('componentItemDescrip'));

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: 'engine/mp/SRV_UI_CM_05_Q2',
      params: param,
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

  const saveSubmit = () => {
    let focusCell = grid.gridView.getCurrent();
    let targetRow = focusCell.dataRow;

    props.confirm(grid.dataProvider.getJsonRow(targetRow));
    props.onClose(false);
  }

  const onError = (errors, e) => {
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="COMPONENT_ITEM" resizeHeight={300} resizeWidth={1400}>
      <BaseGrid id={`${props.id}_ComponentItemGrid`} items={popupGrid1Items} ></BaseGrid>
    </PopupDialog>
  );
}

export default PopComponentItem;
