import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useViewStore, BaseGrid, PopupDialog, zAxios } from '@zionex/wingui-core/src/common/imports';
import { setNoneEditableGrid } from '../common';

const workOrderPopupGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 0 },
  { name: "soCd", dataType: "text", headerText: "FP_SO_CD", visible: true, editable: false, width: 130, autoFilter: true, mergeRule: { criteria: "value" } },
  { name: "woCd", dataType: "text", headerText: "FP_WORK_ORDER_CODE", visible: true, editable: false, width: 130, autoFilter: true },
  { name: "inventoryCode", dataType: "text", headerText: "FP_INVENTORY_CD", visible: true, editable: false, width: 130, autoFilter: true },
  { name: "inventoryName", dataType: "text", headerText: "FP_INVENTORY_NAME", visible: true, editable: false, width: 180 },
  { name: "itemCode", dataType: "text", headerText: "FP_ITEM_CD", visible: true, editable: false, width: 130, autoFilter: true },
  { name: "itemName", dataType: "text", headerText: "FP_ITEM_NM", visible: true, editable: false, width: 180 },
  { name: "requestQty", dataType: "number", headerText: "FP_REQUEST_QTY", visible: true, editable: false, width: 80, numberFormat: "#,##0.#####" },
  { name: "dueDt", dataType: "datetime", headerText: "FP_DUE_DT", visible: true, editable: false, width: 125 },
];

function WorkOrderPopup(props) {
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const [workOrderPopupGrid, setWorkOrderPopupGrid] = useState(null);

  useEffect(() => {
    setWorkOrderPopupGrid(getViewInfo(vom.active, 'workOrderPopupGrid'));
  }, [viewData]);

  useEffect(() => {
    if (workOrderPopupGrid) {
      setNoneEditableGrid(workOrderPopupGrid);
      setGridOptions(workOrderPopupGrid.gridView);

      loadData();
    }
  }, [workOrderPopupGrid]);

  function setGridOptions(gridView) {
    if (gridView.id === 'workOrderPopupGrid') {
      gridView.onCellDblClicked = function (grid, clickData) {
        if (clickData.cellType === 'data') {
          const clickedRow = grid.getValues(clickData.itemIndex);
          const values = {};
          values['woCd'] = clickedRow.woCd;
          props.confirm(values);
          props.onClose();
        }
      }
    }
  }

  function loadData() {
    zAxios.get(baseURI() + 'factoryplan/work-orders', {
      params: {
        'route-cd': encodeURI(props.params)
      },
      fromPopup: true
    })
      .then(function (res) {
        workOrderPopupGrid.dataProvider.fillJsonData(res.data);
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
      });
  }

  return (
    <>
      <PopupDialog type="NOBUTTONS" open={props.open} onClose={props.onClose} checks={[workOrderPopupGrid]} title={transLangKey("FP_WORK_ORDER_SELECT")} resizeHeight={560} resizeWidth={1170}>
        <Box style={{ height: "100%" }}>
          <BaseGrid id="workOrderPopupGrid" items={workOrderPopupGridItems} className="white-skin" />
        </Box>
      </PopupDialog>
    </>
  )
}

export default WorkOrderPopup;
