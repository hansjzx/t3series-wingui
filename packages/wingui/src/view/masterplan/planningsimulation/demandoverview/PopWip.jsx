import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { BaseGrid, PopupDialog, zAxios } from '@zionex/wingui-core/src/common/imports';
import { setGridComboList } from '@wingui/view/supplychainmodel/common/common';

let gridWipColumns = [
  { name: 'WIP_MST_ID', headerText: 'WIP_MST_ID', dataType: 'text', visible: false, editable: false },
  { name: 'LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: '80', editable: false },
  { name: 'LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: '80', editable: false },
  { name: 'LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: '80', editable: false },
  { name: 'LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: '110', editable: false },
  { name: 'WIP_ID', headerText: 'WIP_ID', dataType: 'text', width: '80', editable: false },
  { name: 'ITEM_CD', headerText: 'ITEM_CD', dataType: 'text', width: '80', editable: false },
  { name: 'ITEM_NM', headerText: 'ITEM_NM', dataType: 'text', width: '80', editable: false },
  { name: 'ROUTE_CD', headerText: 'ROUTE_CD', dataType: 'text', width: '80', editable: false },
  { name: 'UOM_ID', headerText: 'UOM', dataType: 'text', width: '60', editable: false, useDropdown: true, lookupDisplay: true },
  { name: 'RES_CD', headerText: 'RES_CD', dataType: 'text', width: '80', editable: false },
  { name: 'RES_DESCRIP', headerText: 'RES_DESCRIP', dataType: 'text', width: '110', editable: false },
  { name: 'ACCOUNT_CD', headerText: 'ACCOUNT_CD', dataType: 'text', width: '80', editable: false },
  { name: 'ACCOUNT_NM', headerText: 'ACCOUNT_NM', dataType: 'text', width: '80', editable: false },
  { name: 'QTY', headerText: 'QTY', dataType: 'text', width: '60', editable: false }
]

function PopWip(props) {
  const [gridWip, setGridWip] = useState(null);

  useEffect(() => {
    if (gridWip) {
      loadWipGridData();
    }
  }, [gridWip]);

  function afterGridOrderWip(gridObj) {
    setGridWip(gridObj);
    setGridWipOptions(gridObj);
  }

  function setGridWipOptions(gridObj) {
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

  function loadWipGridData() {
    let param = new URLSearchParams();

    param.append('ITEM_MST_ID', props.data.itemMasterId);
    param.append('ACCOUNT_ID', props.data.accountId);

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_MP_19_POP_Q11',
      data: param,
      fromPopup: true
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridWip.setData(res.data.RESULT_DATA);
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
      <PopupDialog open={props.open} onClose={props.onClose} onSubmit={onSubmit} title={transLangKey("WIP")} resizeHeight={400} resizeWidth={1300}>
        <Box style={{ height: "100%" }}>
          <BaseGrid id="popDemandOverview_popWip_gridWip" items={gridWipColumns} afterGridCreate={afterGridOrderWip} />
        </Box>
      </PopupDialog>
    </>
  );
}

export default PopWip;
