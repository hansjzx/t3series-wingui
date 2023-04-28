import React, { useEffect, useState } from 'react';
import { BaseGrid, ButtonArea, LeftButtonArea, GridExcelExportButton, PopupDialog, zAxios } from '@zionex/wingui-core/src/common/imports';

let gridPopDetailProductionPlanColumns = [
  { name: 'LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: '100', editable: false },
  { name: 'LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: '80', editable: false },
  { name: 'LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: '80', editable: false },
  { name: 'LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: '120', editable: false },
  { name: 'RES_CD', headerText: 'RES_CD', dataType: 'text', width: '100', editable: false },
  { name: 'RES_DESCRIP', headerText: 'RES_DESCRIP', dataType: 'text', width: '130', editable: false },
  { name: 'ITEM_CD', headerText: 'ITEM_CD', dataType: 'text', width: '100', editable: false },
  { name: 'ITEM_NM', headerText: 'ITEM_NM', dataType: 'text', width: '100', editable: false },
  { name: 'ITEM_TP_NM', headerText: 'ROUTE_CD', dataType: 'text', width: '100', editable: false },
  { name: 'UOM_NM', headerText: 'UOM_NM', dataType: 'text', width: '80', editable: false },
  { name: 'PRDUCT_DTTM', headerText: 'PRDUCT_DTTM', dataType: 'datetime', width: '150', editable: false },
  { name: 'PRDUCT_QTY', headerText: 'PRDUCT_QTY', dataType: 'number', width: '100', editable: false }
];

function PopDetailProductionPlan(props) {
  const [gridPopDetailProductionPlan, setGridPopDetailProductionPlan] = useState(null);

  useEffect(() => {
    if (gridPopDetailProductionPlan) {
      loadDetailProductionPlan();
    }
  }, [gridPopDetailProductionPlan]);

  function afterGridPopDetailProductionPlan(gridObj) {
    setGridPopDetailProductionPlan(gridObj);
    setGridPopDetailProductionPlanOptions(gridObj);
  }

  function setGridPopDetailProductionPlanOptions(gridObj) {
    gridObj.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridObj, false, false, false);
  }

  function loadDetailProductionPlan() {
    let param = new FormData();

    param.append('VERSION_ID', props.version);
    param.append('ITEM_CD', props.data.ITEM_CD);
    param.append('LOCAT_CD', props.data.LOCAT_CD);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/GetSemiProductionPlan',
      data: param,
      fromPopup: true
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          gridPopDetailProductionPlan.setData(res.data.RESULT_DATA);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  return (
    <PopupDialog type="NOBUTTONS" open={props.open} onClose={props.onClose} title="POP_UI_MP_30_01" resizeHeight={800} resizeWidth={1400}>
      <BaseGrid id="gridPopDetailProductionPlan" items={gridPopDetailProductionPlanColumns} afterGridCreate={afterGridPopDetailProductionPlan} />
    </PopupDialog>
  )
}

export default PopDetailProductionPlan;
