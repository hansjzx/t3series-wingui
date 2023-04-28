import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { BaseGrid, PopupDialog, useUserStore, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';

let popupGrid1Items=[
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: "100" },
  { name: "ITEM_INV_POLICY_ID", dataType: "text", headerText: "ITEM_INV_POLICY_ID", visible: false, editable: false, width: "100" },
  { name: "STRT_DTTM", dataType: "datetime", headerText: "STRT_DTTM", visible: true, editable: false, width: "90", format: "yyyy-MM-dd" },
  { name: "END_DTTM", dataType: "datetime", headerText: "END_DTTM", visible: true, editable: false, width: "90", format: "yyyy-MM-dd" },
  {
    name: "SFST", dataType: "group", orientation: "horizontal", headerText: "SFST", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "SFST_DMND_RATE", dataType: "number", headerText: "SFST_DMND_RATE", visible: true, editable: false, width: "70", numberFormat: '#,###.###' },
      { name: "SFST_PRPSAL_VAL", dataType: "number", headerText: "SFST_PRPSAL_VAL", visible: true, editable: false, width: "90", numberFormat: '#,###.###' },
      { name: "SFST_VAL", dataType: "number", headerText: "SFST_VAL", visible: true, editable: true, width: "70", numberFormat: '#,###.###' }
    ]
   },
  {
    name: "OPERT_STOCK", dataType: "group", orientation: "horizontal", headerText: "OPERT_STOCK", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "OPERT_INV_DMND_RATE", dataType: "number", headerText: "OPERT_STOCK_DMND_RATE", visible: true, editable: false, width: "70", numberFormat: '#,###.###' },
      { name: "OPERT_INV_PRPSAL_VAL", dataType: "number", headerText: "OPERT_STOCK_PRPSAL_VAL", visible: true, editable: false, width: "90", numberFormat: '#,###.###' },
      { name: "OPERT_INV_VAL", dataType: "number", headerText: "OPERT_STOCK_VAL", visible: true, editable: true, width: "70", numberFormat: '#,###.###' }
    ]
   },
  {
    name: "ROP", dataType: "group", orientation: "horizontal", headerText: "ROP", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "ROP_DMND_RATE", dataType: "number", headerText: "ROP_DMND_RATE", visible: true, editable: false, width: "70", numberFormat: '#,###.###' },
      { name: "ROP_RIGHT_RATE_TARGET", dataType: "number", headerText: "ROP_RIGHT_RATE_TARGET", visible: true, editable: false, width: "70", numberFormat: '#,###.###' },
      { name: "ROP_PRPSAL_VAL", dataType: "number", headerText: "ROP_PRPSAL_VAL", visible: true, editable: false, width: "70", numberFormat: '#,###.###' },
      { name: "ROP_VAL", dataType: "number", headerText: "ROP_VAL", visible: true, editable: true, width: "70", numberFormat: '#,###.###' }
    ]
   },
  {
    name: "PO_QTY", dataType: "group", orientation: "horizontal", headerText: "PO_QTY", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "EOQ_DMND_RATE", dataType: "number", headerText: "EOQ_DMND_RATE", visible: true, editable: false, width: "70", numberFormat: '#,###.###' },
      { name: "EOQ_RIGHT_RATE_TARGET", dataType: "number", headerText: "EOQ_RIGHT_RATE_TARGET", visible: true, editable: false, width: "70", numberFormat: '#,###.###' },
      { name: "EOQ_PRPSAL_VAL", dataType: "number", headerText: "EOQ_PRPSAL_VAL", visible: true, editable: false, width: "70", numberFormat: '#,###.###' },
      { name: "EOQ_VAL", dataType: "number", headerText: "EOQ_VAL", visible: true, editable: true, width: "70", numberFormat: '#,###.###' }
    ]
   },
  {
    name: "TARGET_STOCK", dataType: "group", orientation: "horizontal", headerText: "TARGET_STOCK", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "TARGET_INV_PRPSAL_VAL", dataType: "number", headerText: "TARGET_STOCK_PRPSAL_VAL", visible: true, editable: false, width: "90", numberFormat: '#,###.###' },
      { name: "TARGET_INV_VAL", dataType: "number", headerText: "TARGET_STOCK_VAL", visible: true, editable: true, width: "70", numberFormat: '#,###.###' }
    ]
   },
]

function PopPeriodInfoMgmt(props) {
  const [gridPopPeriodInfo, setGridPopPeriodInfo] = useState(null);
  const [username] = useUserStore(state => [state.username]);
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo])
  const { handleSubmit, clearErrors } = useForm({
    defaultValues: { }
  });

  useEffect(() => {
    if (gridPopPeriodInfo){
      popupLoadData();
    }
  }, [gridPopPeriodInfo]);

  function afterGridPopPeriodInfo(gridObj) {
    setGridPopPeriodInfo(gridObj);
    setGridPopPeriodInfoOptions(gridObj);
  }

  function setGridPopPeriodInfoOptions(gridObj) {
    setVisibleProps(gridObj, true, false, false);
    gridObj.gridView.setDisplayOptions({
      fitStyle: 'fill',
      selectionStyle: 'singleRow'
    });

    gridObj.gridView.setFixedOptions({colCount: 2, resizable: true});
  }

  const onError = (errors, e) => {
    if(typeof errors !== 'undefined' && Object.keys(errors).length > 0 ){
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  const popupLoadData = () => {
    let param = new FormData();

    param.append('timeout', 0);
    param.append('PREV_OPERATION_CALL_ID', 'openWindow1');
    param.append('CURRENT_OPERATION_CALL_ID', 'OPC_LOAD_POP_UI_IM_26_03_WINDOW_01_R_GRID_01');

    if (props.data != null && (props.data.EOQ_DMND_RATE_CAL_MTD_ID == 'B534664EEB8A4310A6767E9006AF626C' || props.data.EOQ_DMND_RATE_CAL_MTD_ID == '0DF16075B36240CBA3823B043C6D4C77')) {
      param.append('ID', props.data.ID);
    }

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_SP_UI_IM_26_Q3',
      data: param,
      fromPopup: true
    })
    .then(function (res) {
      gridPopPeriodInfo.setData(res.data.RESULT_DATA);
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function savePeriodInfo() {
    gridPopPeriodInfo.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridPopPeriodInfo.dataProvider.getAllStateRows().created,
          gridPopPeriodInfo.dataProvider.getAllStateRows().updated,
          gridPopPeriodInfo.dataProvider.getAllStateRows().deleted,
          gridPopPeriodInfo.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          changeRowData.push(gridPopPeriodInfo.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          let param = new FormData();

          param.append('changes', JSON.stringify(changeRowData));
          param.append('USER_ID', username);
          param.append('timeout', 0);
          param.append('CURRENT_OPERATION_CALL_ID', 'OPC_SAVEOPC_SAVE_POP_UI_IM_26_03_WINDOW_01_R_GRID_01_RST_CPT_01');

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_SP_UI_IM_26_S2',
            data: param,
            fromPopup: true
          })
          .then(function (res) {
            if (res.status === gHttpStatus.SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.SP_UI_IM_26_S2_P_RT_MSG), { close: false });
              props.confirm();
              close();
            }
          })
          .catch(function (err) {
            console.log(err);
          });
        }
      }
    });
  }

  const saveSubmit = () => {
    savePeriodInfo();
  }

  function close() {
    gridPopPeriodInfo.dataProvider.clearRows();
    props.onClose();
  }

  return (
    <PopupDialog open={props.open} onClose={close} onSubmit={handleSubmit(saveSubmit, onError)} title='POP_UI_IM_26_03' resizeHeight={500} resizeWidth={1500}>
      <Box style={{height:'100%'}}>
        <BaseGrid id='gridPopPeriodInfo' items={popupGrid1Items} afterGridCreate={afterGridPopPeriodInfo} />
      </Box>
    </PopupDialog>
  );
}

export default PopPeriodInfoMgmt;
