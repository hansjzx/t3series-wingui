import React, { useEffect, useState } from 'react';
import { BaseGrid, PopupDialog, zAxios } from '@zionex/wingui-core/src/common/imports';

let gridDueInTrackColumns = [
    { name: 'LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: '50' },
    { name: 'ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', visible: true, editable: false, width: '100' },
    { name: 'ACT_TP_CD', dataType: 'text', headerText: 'ACT_TP_CD', visible: true, editable: false, width: '50' },
    { name: 'ACT_ID', dataType: 'text', headerText: 'ACT_ID', visible: true, editable: false, width: '100' },
    { name: 'DMND_ID', dataType: 'text', headerText: 'DMND_ID', visible: true, editable: false, width: '150' },
    { name: 'PO_ID', dataType: 'text', headerText: 'PO_ID', visible: true, editable: false, width: '150' },
    { name: 'DMND_LOCAT_CD', dataType: 'text', headerText: 'DMND_LOCAT_CD', visible: true, editable: false, width: '50' },
    { name: 'DMND_LOCAT_NM', dataType: 'text', headerText: 'DMND_LOCAT_NM', visible: true, editable: false, width: '100' },
    { name: 'ACT_DATE', dataType: 'datetime', headerText: 'DATE', visible: true, editable: false, width: '80', format: 'yyyy-MM-dd' },
    { name: 'ACT_QTY', dataType: 'number', headerText: 'QTY', visible: true, editable: false, width: '50', headerSummary: { expression: "sum", numberFormat: "#,##0" } }
];

function PopDueInTrack(props) {
  const [gridDueInTrack, setGridDueInTrack] = useState(null);

  useEffect(() => {
    async function initLoad() {
      if (gridDueInTrack) {
        setGridDueInTrackOptions();
        await loadDueInTrack();
      }
    }

    initLoad();
  }, [gridDueInTrack]);

  function afterGridDueInTrack(gridObj) {
    setGridDueInTrack(gridObj);
  }

  function setGridDueInTrackOptions() {
    gridDueInTrack.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridDueInTrack, true, false, false);

    gridDueInTrack.gridView.headerSummaries.visible = true;
  }

  function loadDueInTrack() {
    let param = new FormData();

    param.append('VERSION_ID', props.param.versionId);
    param.append('ITEM_CD', props.param.itemCd);
    param.append('LOCAT_CD', props.param.locatCd);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/GetInventoryActivity',
      data: param,
      fromPopup: true
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          gridDueInTrack.dataProvider.clearRows();
          gridDueInTrack.setData(res.data.RESULT_DATA);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  return (
    <PopupDialog type="NOBUTTONS" open={props.open} onClose={props.onClose} title="DUE_IN_TRACK" resizeHeight={800} resizeWidth={1500} maxWidth={1500}>
      <BaseGrid id="gridPopDueInTrack" items={gridDueInTrackColumns} afterGridCreate={afterGridDueInTrack} />
    </PopupDialog>
  )
}

export default PopDueInTrack;
