import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { BaseGrid, PopupDialog, zAxios } from '@zionex/wingui-core/src/common/imports';
import { setGridComboList } from '@wingui/view/supplychainmodel/common/common';

let gridLocationColumns = [
  { name: 'TRANSP_MGMT_MST_ID', headerText: 'TRANSP_MGMT_MST_ID', dataType: 'text', visible: false, editable: false },
  {
    name: 'CONSUME', dataType: 'group', orientation: 'horizontal', headerText: 'CONSUME',
    childs: [
      { name: 'CONSUME_LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: '80', editable: false },
      { name: 'CONSUME_LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: '80', editable: false },
      { name: 'CONSUME_LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: '80', editable: false },
      { name: 'CONSUME_LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: '100', editable: false }
    ]
  },
  {
    name: 'SUPPLY', dataType: 'group', orientation: 'horizontal', headerText: 'SUPPLY',
    childs: [
      { name: 'SUPPLY_LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: '80', editable: false },
      { name: 'SUPPLY_LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: '80', editable: false },
      { name: 'SUPPLY_LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: '80', editable: false },
      { name: 'SUPPLY_LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: '100', editable: false }
    ]
  },
  { name: 'ITEM_CD', headerText: 'ITEM_CD', dataType: 'text', width: '80', editable: false },
  { name: 'ITEM_NM', headerText: 'ITEM_NM', dataType: 'text', width: '80', editable: false },
  { name: 'VEHICL_TP', headerText: 'VEHICL_TP', dataType: 'text', width: '80', editable: false }
]

function PopLocation(props) {
  const [gridLocation, setGridLocation] = useState(null);

  useEffect(() => {
    if (gridLocation) {
      loadLocationGridData();
    }
  }, [gridLocation]);

  function afterGridOrderLocation(gridObj) {
    setGridLocation(gridObj);
    setGridLocationOptions(gridObj);
  }

  function setGridLocationOptions(gridObj) {
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

  function loadLocationGridData() {
    let param = new URLSearchParams();

    param.append('ITEM_MST_ID', props.data.itemMasterId);
    param.append('ACCOUNT_ID', props.data.accountId);

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_MP_19_POP_Q5',
      data: param,
      fromPopup: true
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridLocation.setData(res.data.RESULT_DATA);
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
      <PopupDialog open={props.open} onClose={props.onClose} onSubmit={onSubmit} title={transLangKey("LOCAT_CHOICE")} resizeHeight={450} resizeWidth={1100}>
        <Box style={{ height: "100%" }}>
          <BaseGrid id="popDemandOverview_popLocation_gridLocation" items={gridLocationColumns} afterGridCreate={afterGridOrderLocation} />
        </Box>
      </PopupDialog>
    </>
  );
}

export default PopLocation;
