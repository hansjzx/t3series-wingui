import React, { useEffect, useState } from 'react';
import { BaseGrid, ButtonArea, LeftButtonArea, GridExcelExportButton, PopupDialog, zAxios } from '@zionex/wingui-core/src/common/imports';

let gridDmndOrderTrackColumns = [
  {
    name: 'DMND_INFO', dataType: 'group', orientation: 'horizontal', headerText: 'DMND_INFO',
    childs: [
      { name: 'DMND_ID', dataType: 'text', headerText: 'DMND_ID', visible: true, editable: false, width: '150' },
      { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: false, width: '50' },
      { name: 'DMND_TP_NM', dataType: 'text', headerText: 'DMND_TP_NM', visible: true, editable: false, width: '100' },
      { name: 'DMND_CLASS_NM', dataType: 'text', headerText: 'DMND_CLASS_NM', visible: true, editable: false, width: '100' },
      { name: 'URGENT_ORDER_TP_NM', dataType: 'text', headerText: 'URGENT_ORDER_TP', visible: true, editable: false, width: '100' },
      { name: 'REQUEST_SITE_ID', dataType: 'text', headerText: 'REQUEST_SITE_ID', visible: true, editable: false, width: '100' },
      { name: 'REQUEST_SITE_DESCRIP', dataType: 'text', headerText: 'REQUEST_SITE_DESCRIP', visible: true, editable: false, width: '100' },
      { name: 'ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', visible: true, editable: false, width: '80' },
      { name: 'ITEM_NM', dataType: 'text', headerText: 'ITEM_NM', visible: true, editable: false, width: '150' },
      { name: 'ACCOUNT_CD', dataType: 'text', headerText: 'ACCOUNT_CD', visible: true, editable: false, width: '80' },
      { name: 'ACCOUNT_NM', dataType: 'text', headerText: 'ACCOUNT_NM', visible: true, editable: false, width: '150' },
      { name: 'DMND_QTY', dataType: 'number', headerText: 'DMND_QTY', visible: true, editable: false, width: '100', headerSummary: { expression: "sum", numberFormat: "#,##0" } },
      { name: 'NETTING_QTY', dataType: 'number', headerText: 'NETTING_QTY', visible: true, editable: false, width: '100', headerSummary: { expression: "sum", numberFormat: "#,##0" } },
      { name: 'DUE_DATE', dataType: 'datetime', headerText: 'DUE_DATE', visible: true, editable: false, width: '80', format: 'yyyy-MM-dd' }
    ]
  },
  {
    name: 'PLAN_RST', dataType: 'group', orientation: 'horizontal', headerText: 'PLAN_RST',
    childs: [
      { name: 'DELIVY_DATE', dataType: 'datetime', headerText: 'DELIVY_DATE', visible: true, editable: false, width: '80', format: 'yyyy-MM-dd' },
      { name: 'DAYS_LATE', dataType: 'number', headerText: 'DAYS_LATE', visible: true, editable: false, width: '100', headerSummary: { expression: "sum", numberFormat: "#,##0" } },
      { name: 'DELIVY_QTY', dataType: 'number', headerText: 'DELIVY_QTY', visible: true, editable: false, width: '100', headerSummary: { expression: "sum", numberFormat: "#,##0" } },
      { name: 'ON_TIME_QTY', dataType: 'number', headerText: 'ON_TIME_QTY', visible: true, editable: false, width: '100', headerSummary: { expression: "sum", numberFormat: "#,##0" } },
      { name: 'LATE_QTY', dataType: 'number', headerText: 'LATE_QTY', visible: true, editable: false, width: '100', headerSummary: { expression: "sum", numberFormat: "#,##0" } },
      { name: 'SHORTAGE_QTY', dataType: 'number', headerText: 'SHORTAGE_QTY', visible: true, editable: false, width: '100' },
      { name: 'SRC_DMND_ID', dataType: 'text', headerText: 'SRC_DMND_ID', visible: true, editable: false, width: '100' },
      { name: 'DMND_LOCAT_CD', dataType: 'text', headerText: 'DMND_LOCAT_CD', visible: true, editable: false, width: '100' },
      { name: 'DMND_LOCAT_NM', dataType: 'text', headerText: 'DMND_LOCAT_NM', visible: true, editable: false, width: '100' }
    ]
  }
];

function PopDmndOrderTrack(props) {
  const [gridDmndOrderTrack, setGridDmndOrderTrack] = useState(null);

  useEffect(() => {
    async function initLoad() {
      if (gridDmndOrderTrack) {
        setGridDmndOrderTrackOptions();
        await loadDmndOrderTrack();
      }
    }

    initLoad();
  }, [gridDmndOrderTrack]);

  const exportOptions = {
    headerDepth: 2,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  };

  function afterGridDmndOrderTrack(gridObj) {
    setGridDmndOrderTrack(gridObj);
  }

  function setGridDmndOrderTrackOptions() {
    gridDmndOrderTrack.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridDmndOrderTrack, true, false, false);

    gridDmndOrderTrack.gridView.headerSummaries.visible = true;
  }

  function loadDmndOrderTrack() {
    let param = new URLSearchParams();

    param.append('VERSION_ID', props.param.versionId);
    param.append('ITEM_CD', props.param.itemCd);
    param.append('LOCAT_CD', props.param.locatCd);

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/GetDemandTargetInfo',
      data: param,
      fromPopup: true
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridDmndOrderTrack.dataProvider.clearRows();
        gridDmndOrderTrack.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  return (
    <PopupDialog type="NOBUTTONS" open={props.open} onClose={props.onClose} title="DMND_ORDER_TRACK" resizeHeight={800} resizeWidth={1500} maxWidth={1500}>
      <ButtonArea>
        <LeftButtonArea>
          <GridExcelExportButton type="icon" grid="gridMpResultBase" options={exportOptions} />
        </LeftButtonArea>
      </ButtonArea>
        <BaseGrid id="gridPopDmndOrderTrack" items={gridDmndOrderTrackColumns} afterGridCreate={afterGridDmndOrderTrack} />
    </PopupDialog>
  )
}

export default PopDmndOrderTrack;
