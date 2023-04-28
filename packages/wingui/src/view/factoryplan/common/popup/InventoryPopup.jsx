import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useViewStore, BaseGrid, PopupDialog, zAxios } from '@zionex/wingui-core/src/common/imports';
import { setNoneEditableGrid } from '../common';

const inventoryPopupGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false },
  { name: "inventoryCd", dataType: "text", headerText: "FP_INVENTORY_CD", visible: true, editable: false, width: 130, autoFilter: true },
  { name: "inventoryNm", dataType: "text", headerText: "FP_INVENTORY_NAME", visible: true, editable: false, width: 180 },
  { name: "itemCode", dataType: "text", headerText: "FP_ITEM_CD", visible: true, editable: false, width: 130, autoFilter: true },
  { name: "itemName", dataType: "text", headerText: "FP_ITEM_NM", visible: true, editable: false, width: 180 },
  { name: "itemClassCode", dataType: "text", headerText: "FP_ITEM_CLASS_CD", visible: true, editable: false, width: 80, autoFilter: true, textAlignment: "center" },
  { name: "plantCd", dataType: "text", headerText: "FP_PLANT_CD", visible: true, editable: false, width: 130, autoFilter: true },
  { name: "plantNm", dataType: "text", headerText: "FP_PLANT_NM", visible: true, editable: false, width: 180 },
  { name: "stageCode", dataType: "text", headerText: "FP_STAGE_CD", visible: true, editable: false, width: 130, autoFilter: true },
  { name: "stageName", dataType: "text", headerText: "FP_STAGE_NM", visible: true, editable: false, width: 180 }
];

function InventoryPopup(props) {
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const [inventoryPopupGrid, setInventoryPopupGrid] = useState(null);

  useEffect(() => {
    setInventoryPopupGrid(getViewInfo(vom.active, 'inventoryPopupGrid'));
  }, [viewData]);

  useEffect(() => {
    if (inventoryPopupGrid) {
      setNoneEditableGrid(inventoryPopupGrid);
      setGridOptions(inventoryPopupGrid.gridView);

      loadData();
    }
  }, [inventoryPopupGrid]);

  function setGridOptions(gridView) {
    if (gridView.id === 'inventoryPopupGrid') {
      gridView.onCellDblClicked = function (grid, clickData) {
        if (clickData.cellType === 'data') {
          const clickedRow = grid.getValues(clickData.itemIndex);
          const values = {};
          values['inventoryCd'] = clickedRow.inventoryCd;
          values['inventoryNm'] = clickedRow.inventoryNm;
          values['itemCode'] = clickedRow.itemCode;
          values['itemName'] = clickedRow.itemName;
          values['itemClassCode'] = clickedRow.itemClassCode;
          props.confirm(values);
          props.onClose(false);
        }
      }
    }
  }

  function loadData() {
    zAxios.get(baseURI() + 'factoryplan/inventories', {
      params: {
        'search': ''
      },
      fromPopup: true
    })
      .then(function (res) {
        inventoryPopupGrid.dataProvider.fillJsonData(res.data);
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
      });
  }

  return (
    <>
      <PopupDialog type="NOBUTTONS" open={props.open} onClose={props.onClose} checks={[inventoryPopupGrid]} title={transLangKey("FP_INVENTORY_SELECT")} resizeHeight={560} resizeWidth={1400}>
        <Box style={{ height: "100%" }}>
          <BaseGrid id="inventoryPopupGrid" items={inventoryPopupGridItems} className="white-skin" />
        </Box>
      </PopupDialog>
    </>
  )
}

export default InventoryPopup;
