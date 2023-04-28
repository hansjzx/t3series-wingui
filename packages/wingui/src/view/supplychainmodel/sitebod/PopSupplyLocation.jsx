import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { BaseGrid, PopupDialog, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';

let popSupplyLocationGridItems = [
  { name: 'LOC_MGMT_ID', dataType: 'text', headerText: 'LOCAT_ID', visible: false, editable: false, width: '100' },
  { name: 'LOCAT_TP', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: '80' },
  { name: 'LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: '50' },
  { name: 'LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: '60' },
  { name: 'LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: '150' }
];

function PopSupplyLocation(props) {
  const [supplyLocationGrid, setSupplyLocationGrid] = useState(null);
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo])

  useEffect(() => {
    const gridObj = getViewInfo(vom.active, 'SiteBod_PopSiteBod_PopSupplyLocationGrid');

    if (gridObj) {
      if (gridObj.dataProvider) {
        setSupplyLocationGrid(gridObj)
      }
    }
  }, [viewData]);

  useEffect(() => {
    async function initLoad() {
      if (supplyLocationGrid) {
        setOptions();
        await popupLoadData();
      }
    }
    initLoad();
  }, [supplyLocationGrid]);

  const setOptions = () => {
    supplyLocationGrid.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(supplyLocationGrid, true, false, false);

    supplyLocationGrid.gridView.displayOptions.selectionStyle = 'singleRow';

    supplyLocationGrid.gridView.onCellDblClicked = function () {
      saveSubmit();
    };
  }

  const popupLoadData = () => {
    let params = new URLSearchParams();

    params.append('BOD_TP_ID', props.data.BOD_TP_ID);
    params.append('CONSUME_LOCAT_ID', props.data.LOCAT_MGMT_ID);

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: 'engine/mp/SRV_UI_CM_06_POP_Q1',
      data: params,
      fromPopup: true
    })
    .then(function (res) {
      supplyLocationGrid.dataProvider.fillJsonData(res.data.RESULT_DATA);
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  const saveSubmit = () => {
    let focusCell = supplyLocationGrid.gridView.getCurrent();
    let targetRow = focusCell.dataRow;
    props.confirm(supplyLocationGrid.dataProvider.getJsonRow(targetRow));
    props.onClose(false);
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={saveSubmit} title="POP_UI_CM_02_06" resizeHeight={600} resizeWidth={600}>
      <Box style={{ height: "100%" }}>
        <BaseGrid id="SiteBod_PopSiteBod_PopSupplyLocationGrid" items={popSupplyLocationGridItems} />
      </Box>
    </PopupDialog>
  );
}

export default PopSupplyLocation;
