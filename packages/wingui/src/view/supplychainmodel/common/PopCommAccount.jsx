import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { BaseGrid, PopupDialog, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';

let popupGridItems = [
  { name: "ACCOUNT_ID", dataType: "text", headerText: "ACCOUNT_ID", visible: false, editable: false, width: "200" },
  { name: "INCOTERMS_ID", dataType: "text", headerText: "INCOTERMS_ID", visible: false, editable: false, width: "200" },
  { name: "ACCOUNT_CD", dataType: "text", headerText: "ACCOUNT_CD", visible: true, editable: false, width: "100" },
  { name: "ACCOUNT_NM", dataType: "text", headerText: "ACCOUNT_NM", visible: true, editable: false, width: "100" },
  { name: "CHANNEL_ID", dataType: "text", headerText: "CHANNEL_ID", visible: false, editable: false, width: "200" },
  { name: "CHANNEL_NM", dataType: "text", headerText: "CHANNEL_NM", visible: true, editable: false, width: "100" },
  { name: "INCOTERMS", dataType: "text", headerText: "INCOTERMS", visible: true, editable: false, width: "100" },
  { name: "VMI_YN", dataType: "boolean", headerText: "VMI_YN", visible: true, editable: false, width: "100" },
  { name: "DIRECT_SHIPPING_YN", dataType: "boolean", headerText: "DIRECT_SHIPPING_YN", visible: true, editable: false, width: "100" },
  { name: "CUST_DELIVY_MODELING_YN", dataType: "boolean", headerText: "ACC_DELIVY_MODELING_YN", visible: true, editable: false, width: "100" },
  { name: "BILL_TO_NM", dataType: "text", headerText: "BILL_TO", visible: true, editable: false, width: "100" },
  { name: "SHIP_TO_NM", dataType: "text", headerText: "SHIP_TO", visible: false, editable: false, width: "100" },
  { name: "SOLD_TO_NM", dataType: "text", headerText: "SOLD_TO", visible: true, editable: false, width: "100" }
]

function PopCommAccount(props) {
  const [grid, setGrid] = useState(null);
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData,state.getViewInfo]);

  const { handleSubmit, clearErrors } = useForm({
    defaultValues: { }
  });

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
    grid.gridView.setDisplayOptions({
      fitStyle: 'evenFill',
    });

    grid.gridView.displayOptions.selectionStyle = 'singleRow';

    grid.gridView.onCellDblClicked = function () {
      saveSubmit();
    };

    grid.gridView.onDataLoadComplated = function () {
      grid.gridView.setFocus();
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
    zAxios({
      fromPopup: true,
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: 'engine/mp/SRV_GET_ACCOUNT_GRID_LIST'
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
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="POP_UI_IM_13_04" resizeHeight={600} resizeWidth={950}>
      <Box style={{height: "100%"}}>
        <BaseGrid id={`${props.id}_PopAccountGrid`} items={popupGridItems} />
      </Box>
    </PopupDialog>
  );
}

export default PopCommAccount;
