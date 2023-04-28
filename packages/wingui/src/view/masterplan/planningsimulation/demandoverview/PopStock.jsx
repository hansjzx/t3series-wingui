import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import {
  BaseGrid, PopupDialog, zAxios
} from '@zionex/wingui-core/src/common/imports';
import { setGridComboList } from '@wingui/view/supplychainmodel/common/common';

let gridStockColumns = [
  { name: 'STOCK_PARENT_ID', headerText: 'STOCK_PARENT_ID', dataType: 'text', visible: false, editable: false },
  { name: 'ITEM_MST_ID', headerText: 'ITEM_MST_ID', dataType: 'text', visible: false, editable: false },
  { name: 'LOCAT_ITEM_ID', headerText: 'LOCAT_ITEM_ID', dataType: 'text', visible: false, editable: false },
  { name: 'LOC_TP', headerText: 'LOCAT_TP', dataType: 'text', visible: false, editable: false },
  { name: 'LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: '80', editable: false },
  { name: 'LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: '80', editable: false },
  { name: 'LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: '80', editable: false },
  { name: 'LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: '100', editable: false },
  { name: 'STOCK_ID', headerText: 'STOCK_ID', dataType: 'text', width: '90', editable: false },
  { name: 'ITEM_CD', headerText: 'ITEM_CD', dataType: 'text', width: '80', editable: false },
  { name: 'ITEM_NM', headerText: 'ITEM_NM', dataType: 'text', width: '80', editable: false },
  { name: 'UOM_ID', headerText: 'UOM', dataType: 'text', width: '60', editable: false, useDropdown: true, lookupDisplay: true },
  { name: 'LOT_NO', headerText: 'LOT_NO', dataType: 'text', width: '80', editable: false },
  { name: 'QTY', headerText: 'QTY', dataType: 'text', width: '60', editable: false },
  { name: 'INV_TP', headerText: 'INV_TP', dataType: 'text', width: '100', editable: false }
]

function PopStock(props) {
  const [gridStock, setGridStock] = useState(null);

  useEffect(() => {
    if (gridStock) {
      loadStockGridData();
    }
  }, [gridStock]);

  function afterGridOrderStock(gridObj) {
    setGridStock(gridObj);
    setGridStockOptions(gridObj);
  }

  function setGridStockOptions(gridObj) {
    gridObj.gridView.setEditOptions({
      insertable: true,
      appendable: true,
      scrollOnEditing: 'commit'
    });

    gridObj.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridObj, true, true, false);
    gridObj.gridView.setFooters({ visible: false });

    setGridComboList(gridObj, 'UOM_ID', 'UOM');

    gridObj.gridView.onCellDblClicked = function (grid, clickData) {
      if (clickData.cellType === "data") {
        onSubmit(gridObj.dataProvider.getOutputRow(null, clickData.dataRow));
      }
    };
  }

  function loadStockGridData() {
    let param = new URLSearchParams();

    param.append('ITEM_MST_ID', props.data.itemMasterId);
    param.append('ACCOUNT_ID', props.data.accountId);

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_SP_UI_MP_19_POP_Q4',
      data: param,
      fromPopup: true
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridStock.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function onSubmit(gridRow) {
    props.confirm(gridRow);
    props.onClose();
  }

  return (
    <>
      <PopupDialog open={props.open} onClose={props.onClose} onSubmit={onSubmit} title={transLangKey("STOCK")} resizeHeight={600} resizeWidth={1100}>
        <Box style={{ height: "100%" }}>
          <BaseGrid id="popDemandOverview_popStock_gridStock" items={gridStockColumns} afterGridCreate={afterGridOrderStock} />
        </Box>
      </PopupDialog>
    </>
  );
}

export default PopStock;
