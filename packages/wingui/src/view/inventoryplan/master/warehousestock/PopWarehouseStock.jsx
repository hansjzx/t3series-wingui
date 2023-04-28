import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { BaseGrid, ButtonArea, RightButtonArea, GridSaveButton, PopupDialog, useUserStore, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';

let popupGridItems = [
  { name: 'WAHOUS_MST_ID', dataType: 'text', headerText: 'WAHOUS_MST_ID', visible: false, editable: false, width: 100 },
  { name: 'GLOBAL_PLAN_BOM_ID', dataType: 'text', headerText: 'GLOBAL_PLAN_BOM_ID', visible: false, editable: false, width: 100 },
  {
    name: 'FROM_LOCAT_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'FROM_LOCAT', headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: 'TO_LOCAT_TP_NM', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: 100 },
      { name: 'TO_LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: 100 },
      { name: 'TO_LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: 100 },
      { name: 'TO_LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: 100 }
    ]
  },
  {
    name: 'TO_LOCAT_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'TO_LOCAT', headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: true, width: 60 },
      { name: 'FROM_LOCAT_TP_NM', dataType: 'text', headerText: 'FROM_LOCAT_TP_NM', visible: true, editable: false, width: 100 },
      { name: 'FROM_LOCAT_LV', dataType: 'text', headerText: 'FROM_LOCAT_LV', visible: true, editable: false, width: 100 },
      { name: 'FROM_LOCAT_CD', dataType: 'text', headerText: 'FROM_LOCAT_CD', visible: true, editable: false, width: 100 },
      { name: 'FROM_LOCAT_NM', dataType: 'text', headerText: 'FROM_LOCAT_NM', visible: true, editable: false, width: 100 }
    ]
  }
]

function PopWarehouseStock(props) {
  const [gridPopWarehouseStock, setGridPopWarehouseStock] = useState(null);
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData,state.getViewInfo])
  const [username] = useUserStore(state => [state.username]);

  useEffect(() => {
    async function initLoad() {
      if (gridPopWarehouseStock) {
        await loadData();
      }
    }

    initLoad();
  }, [gridPopWarehouseStock]);

  function afterGridPopWarehouseStock(gridObj) {
    setGridPopWarehouseStock(gridObj);
    setGridPopWarehouseStockOptions(gridObj);
  }

  function setGridPopWarehouseStockOptions(gridObj) {
    setVisibleProps(gridObj, true, true, false);
    gridObj.gridView.setDisplayOptions({
      fitStyle: 'evenFill',
      selectionStyle: 'singleRow'
    });
  }

  function loadData() {
    let param = new URLSearchParams();

    param.append('WAREHOUSE_INV_MST_ID', props.data.ID);

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: 'engine/mp/SRV_UI_IM_12_Q2',
      params: param,
      fromPopup: true
    })
    .then(function (res) {
      gridPopWarehouseStock.setData(res.data.RESULT_DATA);
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function saveData() {
    gridPopWarehouseStock.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridPopWarehouseStock.dataProvider.getAllStateRows().created,
          gridPopWarehouseStock.dataProvider.getAllStateRows().updated,
          gridPopWarehouseStock.dataProvider.getAllStateRows().deleted,
          gridPopWarehouseStock.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          changeRowData.push(gridPopWarehouseStock.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          let param = new URLSearchParams();

          param.append('changes', JSON.stringify(changeRowData));
          param.append('USER_ID', username);

          zAxios({
            method: 'post',
            header: { 'content-type': 'application/json' },
            url: 'engine/mp/SRV_UI_IM_12_S2',
            params: param,
            fromPopup: true
          })
          .then(function (res) {
            if (res.status === gHttpStatus.SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_IM_12_S2_P_RT_MSG), { close: false });
              loadData();
              props.confirm();
            }
          })
          .catch(function (err) {
            console.log(err);
          });
        }
      }
    });
  }

  return (
    <PopupDialog type="OK" open={props.open} onClose={props.onClose} onConfirm={props.onClose} title="POP_UI_IM_12_01" resizeHeight={600} resizeWidth={1000}>
      <ButtonArea>
        <RightButtonArea>
          <GridSaveButton grid="gridPopWarehouseStock" type="icon" onClick={saveData} />
        </RightButtonArea>
      </ButtonArea>
      <Box style={{height: "100%"}}>
        <BaseGrid id="gridPopWarehouseStock" items={popupGridItems} afterGridCreate={afterGridPopWarehouseStock} />
      </Box>
    </PopupDialog>
  );
}

export default PopWarehouseStock;
