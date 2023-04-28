import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { BaseGrid, PopupDialog, zAxios } from '@zionex/wingui-core/src/common/imports';
import { setGridComboList } from '@wingui/view/supplychainmodel/common/common';

let gridResourceColumns = [
  { name: 'ITEM_RES_PREFER_MST_ID', headerText: 'ITEM_RES_PREFER_MST_ID', dataType: 'text', visible: false, editable: false },
  { name: 'LOCAT_MGMT_ID', headerText: 'LOCAT_MGMT_ID', dataType: 'text', visible: false, editable: false },
  { name: 'LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: '80', editable: false },
  { name: 'LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: '80', editable: false },
  { name: 'LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: '80', editable: false },
  { name: 'LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: '120', editable: false },
  { name: 'RES_CD', headerText: 'RES_CD', dataType: 'text', width: '80', editable: false },
  { name: 'RES_DESCRIP', headerText: 'RES_DESCRIP', dataType: 'text', width: '110', editable: false },
  { name: 'ITEM_CD', headerText: 'ITEM_CD', dataType: 'text', width: '80', editable: false },
  { name: 'ITEM_NM', headerText: 'ITEM_NM', dataType: 'text', width: '80', editable: false }
 ]

function PopResource(props) {
  const [gridResource, setGridResource] = useState(null);

  useEffect(() => {
    if (gridResource) {
      loadResourceGridData();
    }
  }, [gridResource]);

  function afterGridOrderResource(gridObj) {
    setGridResource(gridObj);
    setGridResourceOptions(gridObj);
  }

  function setGridResourceOptions(gridObj) {
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

  function loadResourceGridData() {
    let param = new FormData();

    param.append('ITEM_MST_ID', props.data.itemMasterId);
    param.append('ACCOUNT_ID', props.data.accountId);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_19_POP_Q7',
      data: param,
      fromPopup: true
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          gridResource.setData(res.data.RESULT_DATA);
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
      <PopupDialog open={props.open} onClose={props.onClose} onSubmit={onSubmit} title={transLangKey("COMM_SRH_POP_RES")} resizeHeight={450} resizeWidth={1100}>
        <Box style={{ height: "100%" }}>
          <BaseGrid id="popDemandOverview_popResource_gridResource" items={gridResourceColumns} afterGridCreate={afterGridOrderResource} />
        </Box>
      </PopupDialog>
    </>
  );
}

export default PopResource;
