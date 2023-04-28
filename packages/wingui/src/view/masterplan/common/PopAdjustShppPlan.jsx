import React, { useEffect, useState } from 'react';
import { BaseGrid, PopupDialog, zAxios } from '@zionex/wingui-core/src/common/imports';

let gridAdjustShppPlanColumns = [
  { name: 'ID', dataType: 'text', headerText: 'ID', visible: false, editable: false, width: '100' },
  { name: 'CONBD_MAIN_VER_DTL_ID', dataType: 'text', headerText: 'CONBD_MAIN_VER_DTL_ID', visible: false, editable: false, width: '100' },
  { name: 'SUPPLY_LOCAT_ITEM_ID', dataType: 'text', headerText: 'SUPPLY_LOCAT_ITEM_ID', visible: false, editable: false, width: '100' },
  {
    name: 'SUPPLY', dataType: 'group', orientation: 'horizontal', headerText: 'SUPPLY',
    childs: [
      { name: 'SUPPLY_LOCAT_TP_NM', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: '100' },
      { name: 'SUPPLY_LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: '100' },
      { name: 'SUPPLY_LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: '100' },
      { name: 'SUPPLY_LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: '100' }
    ]
  },
  { name: 'CONSUME_LOCAT_ITEM_ID', dataType: 'text', headerText: 'CONSUME_LOCAT_ITEM_ID', visible: false, editable: false, width: '100' },
  {
    name: 'CONSUME', dataType: 'group', orientation: 'horizontal', headerText: 'CONSUME',
    childs: [
      { name: 'CONSUME_LOCAT_TP_NM', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: '100' },
      { name: 'CONSUME_LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: '100' },
      { name: 'CONSUME_LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: '100' },
      { name: 'CONSUME_LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: '100' },
      { name: 'ACCOUNT_CD', dataType: 'text', headerText: 'ACCOUNT_CD', visible: true, editable: false, width: '100' },
      { name: 'ACCOUNT_NM', dataType: 'text', headerText: 'ACCOUNT_NM', visible: true, editable: false, width: '150' },
      { name: 'CHANNEL_NM', dataType: 'text', headerText: 'CHANNEL_NM', visible: true, editable: false, width: '80' },
      { name: 'INCOTERMS', dataType: 'text', headerText: 'INCOTERMS', visible: true, editable: false, width: '80' }
    ]
  },
  { name: 'ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', visible: true, editable: false, width: '80' },
  { name: 'ITEM_NM', dataType: 'text', headerText: 'ITEM_NM', visible: true, editable: false, width: '150' },
  { name: 'VEHICL_TP_ID', dataType: 'text', headerText: 'VEHICL_VAL', visible: true, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'BOD_LEADTIME', dataType: 'text', headerText: 'BOD_LEADTIME', visible: true, editable: false, width: '100' },
  { name: 'TRANSP_QTY', dataType: 'number', headerText: 'TRANSP_QTY', visible: true, editable: false, width: '100', headerSummary: { expression: "sum", numberFormat: "#,##0" } },
  { name: 'SHIPPING_PREDICT_DTTM', dataType: 'datetime', headerText: 'SHIPPING_PREDICT_DTTM', visible: true, editable: false, width: '80', format: 'yyyy-MM-dd' },
  { name: 'DELIVY_PREDICT_DTTM', dataType: 'datetime', headerText: 'DELIVY_PREDICT_DTTM', visible: true, editable: false, width: '80', format: 'yyyy-MM-dd' }
];

function PopAdjustShppPlan(props) {
  const [gridAdjustShppPlan, setGridAdjustShppPlan] = useState(null);

  useEffect(() => {
    async function initLoad() {
      if (gridAdjustShppPlan) {
        setCmCode();
        await loadAdjustShppPlan();
      }
    }

    initLoad();
  }, [gridAdjustShppPlan]);

  function afterGridAdjustShppPlan(gridObj) {
    setGridAdjustShppPlan(gridObj);
  }

  function setGridAdjustShppPlanOptions() {
    gridAdjustShppPlan.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridAdjustShppPlan, true, false, false);

    gridAdjustShppPlan.gridView.headerSummaries.visible = true;
  }

  function setCmCode() {
    let param = new URLSearchParams();
    param.append('CODE', 'VEHICL_TP');

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_CM_CODE',
      data: param,
      fromPopup: true
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          let dataArr = res.data.RESULT_DATA;

          gridAdjustShppPlan.gridView.setColumnProperty(
            "VEHICL_TP_ID",
            "lookupData",
            {
              value: "ID",
              label: "CD_NM",
              list: dataArr.filter(code => code.GROUP === "VEHICL_TP")
            }
          );
        }
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
        setGridAdjustShppPlanOptions();
      });
  }

  function loadAdjustShppPlan() {
    let param = new URLSearchParams();

    param.append('VERSION_ID', props.param.versionId);
    param.append('ITEM_CD', props.param.itemCd);
    param.append('LOCAT_CD', props.param.locatCd);

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/GetShipmentPlan',
      data: param,
      fromPopup: true
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridAdjustShppPlan.dataProvider.clearRows();
        gridAdjustShppPlan.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  return (
    <PopupDialog type="NOBUTTONS" open={props.open} onClose={props.onClose} title="ADJUST_SHPP_PLAN" resizeHeight={800} resizeWidth={1500} maxWidth={1500}>
      <BaseGrid id="gridPopAdjustShppPlan" items={gridAdjustShppPlanColumns} afterGridCreate={afterGridAdjustShppPlan} />
    </PopupDialog>
  )
}

export default PopAdjustShppPlan;
