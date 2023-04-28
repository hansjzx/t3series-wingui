import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { BaseGrid, PopupDialog, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';

let popupGridItems = [
  { name: 'ID', dataType: 'text', headerText: 'ID', visible: false, editable: false, width: '100' },
  { name: 'PEGGING_CD', dataType: 'text', headerText: 'PEGGING_CD', visible: false, editable: false, width: '100' },
  { name: 'PEGGING_GRP', dataType: 'text', headerText: 'PEGGING_GRP', visible: true, editable: false, width: '150' },
  { name: 'PEGGING_ATTR', dataType: 'text', headerText: 'PEGGING_ATTR', visible: true, editable: false, width: '150' }
]

function PopPeggingAttr(props) {
  const [gridPopPeggingAttribute, setGridPopPeggingAttribute] = useState(null);
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData,state.getViewInfo]);

  const { handleSubmit, clearErrors } = useForm({
    defaultValues: { }
  });

  useEffect(() => {
    if (gridPopPeggingAttribute) {
      setGridPopPeggingAttributeOptions(gridPopPeggingAttribute);
      popupLoadData();
    }
  }, [gridPopPeggingAttribute]);

  function afterGridPopPeggingAttribute(gridObj) {
    setGridPopPeggingAttribute(gridObj);
  }

  function setGridPopPeggingAttributeOptions(gridObj) {
    setVisibleProps(gridObj, true, false, false);
    gridObj.gridView.setDisplayOptions({
      fitStyle: 'evenFill',
    });

    gridObj.gridView.displayOptions.selectionStyle = 'singleRow';

    gridObj.gridView.setColumnProperty('PEGGING_GRP', 'mergeRule', { criteria: 'value' });

    gridObj.gridView.onCellDblClicked = function () {
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
    let param = new URLSearchParams();
    let service = '';

    if (props.type === 'warehouse') {
      param.append('WAREHOUSE_INV_MST_ID', props.data.ID);
      service = 'SRV_UI_IM_12_Q3';
    } else if (props.type === 'intransit') {
      param.append('INTRANSIT_INV_MST_ID', props.data.INTRANSIT_STOCK_DTL_ID);
      service = 'SRV_UI_IM_13_Q3';
    }

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/' + service,
      data: param,
      fromPopup: true
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridPopPeggingAttribute.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function saveSubmit() {
    let focusCell = gridPopPeggingAttribute.gridView.getCurrent();
    let targetRow = focusCell.dataRow;
    props.confirm(gridPopPeggingAttribute.dataProvider.getJsonRow(targetRow));
    props.onClose(false);
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="POP_UI_IM_12_02" resizeHeight={580} resizeWidth={600}>
      <Box style={{height: "100%"}}>
        <BaseGrid id="gridPopPeggingAttribute" items={popupGridItems} afterGridCreate={afterGridPopPeggingAttribute} />
      </Box>
    </PopupDialog>
  );
}

export default PopPeggingAttr;
