import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { BaseGrid, PopupDialog, zAxios } from '@zionex/wingui-core/src/common/imports';
import { setGridComboList } from '@wingui/view/supplychainmodel/common/common';

let gridParentBomColumns = [
  { name: 'ID', headerText: 'ID', dataType: 'text', visible: false, editable: false },
  { name: 'LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: '80', editable: false },
  { name: 'LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: '80', editable: false },
  { name: 'LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: '80', editable: false },
  { name: 'LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: '120', editable: false },
  { name: 'BOM_LV', headerText: 'BOM_LV', dataType: 'text', width: '80', editable: false },
  { name: 'ITEM_CD', headerText: 'PARENT_ITEM', dataType: 'text', width: '80', editable: false },
  { name: 'ITEM_NM', headerText: 'ITEM_NM', dataType: 'text', width: '80', editable: false },
  { name: 'ITEM_TP', headerText: 'ITEM_TP', dataType: 'text', width: '80', editable: false },
  { name: 'BOM_ITEM_TP', headerText: 'BOM_ITEM_TP', dataType: 'text', width: '120', editable: false }
]

let gridChildBomColumns = [
  { name: 'ID', headerText: 'ID', dataType: 'text', visible: false, editable: false },
  { name: 'BOM_VER_ID', headerText: 'BOM_VER_ID', dataType: 'text', width: '80', editable: false },
  { name: 'BOM_LV', headerText: 'BOM_LV', dataType: 'text', width: '80', editable: false },
  { name: 'LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: '80', editable: false },
  { name: 'LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: '80', editable: false },
  { name: 'LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: '80', editable: false },
  { name: 'LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: '120', editable: false },
  { name: 'ITEM_CD', headerText: 'COMPONENT_ITEM', dataType: 'text', width: '80', editable: false },
  { name: 'ITEM_NM', headerText: 'ITEM_NM', dataType: 'text', width: '80', editable: false },
  { name: 'ITEM_TP', headerText: 'ITEM_TP', dataType: 'text', width: '80', editable: false },
  { name: 'ROUTE_CD', headerText: 'ROUTE_CD', dataType: 'text', width: '80', editable: false },
  { name: 'BOM_ITEM_TP', headerText: 'BOM_ITEM_TP', dataType: 'text', width: '120', editable: false },
  { name: 'BASE_BOM_RATE', headerText: 'BASE_BOM_RATE', dataType: 'number', width: '120', editable: false }
]

function PopOrderBomRate(props) {
  const [gridParentBom, setGridParentBom] = useState(null);
  const [gridChildBom, setGridChildBom] = useState(null);

  useEffect(() => {
    if (gridParentBom && gridChildBom) {
      setGridParentBomOptions(gridParentBom);
      setGridChildBomOptions(gridChildBom);
      loadParentBomGridData();
    }
  }, [gridParentBom, gridChildBom]);

  function afterGridParentBom(gridObj) {
    setGridParentBom(gridObj);
  }

  function setGridParentBomOptions(gridObj) {
    gridObj.gridView.setEditOptions({
      insertable: true,
      appendable: true,
      scrollOnEditing: 'commit'
    });

    gridObj.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridObj, true, true, false);
    gridObj.gridView.setFooters({ visible: false });

    setGridComboList(gridObj, 'UOM_ID', 'UOM');

    gridObj.gridView.onCellClicked = function (grid, clickData) {
      if (clickData.cellType === "data") {
        setParentBomData(gridObj.dataProvider.getOutputRow(null, clickData.dataRow));
        loadChildBomGridData(gridObj.dataProvider.getOutputRow(null, clickData.dataRow));
      }
    };
  }

  function afterGridChildBom(gridObj) {
    setGridChildBom(gridObj);
  }

  function setGridChildBomOptions(gridObj) {
    gridObj.gridView.setEditOptions({
      insertable: true,
      appendable: true,
      scrollOnEditing: 'commit'
    });

    gridObj.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridObj, true, true, false);
    gridObj.gridView.setFooters({ visible: false });

    setGridComboList(gridObj, 'UOM_ID', 'UOM');
  }

  function setParentBomData(gridRow) {
    gridChildBom.gridView.onCellDblClicked = function (grid, clickData) {
      if (clickData.cellType === "data") {
        onSubmit(gridRow, gridChildBom.dataProvider.getOutputRow(null, clickData.dataRow));
      }
    };
  }

  function loadParentBomGridData() {
    let param = new URLSearchParams();

    param.append('ITEM_MST_ID', props.data.itemMasterId);
    param.append('ACCOUNT_ID', props.data.accountId);

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_MP_19_POP_Q6',
      data: param,
      fromPopup: true
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridParentBom.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function loadChildBomGridData(data) {
    let param = new URLSearchParams();

    param.append('PRDUCT_MST_ID', data.ID);

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_MP_19_POP_Q8',
      data: param,
      fromPopup: true
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridChildBom.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function onSubmit(parentGridRow, childGridRow) {
    props.confirm(parentGridRow, childGridRow);
    props.onClose();
  }

  return (
    <>
      <PopupDialog open={props.open} onClose={props.onClose} onSubmit={onSubmit} title={transLangKey("LOCAT_CHOICE")} resizeHeight={700} resizeWidth={1200}>
        <Box style={{ height: "100%" }}>
          <Box style={{ height: "60%" }}>
            <BaseGrid id="popDemandOverview_popOrderBomRate_gridParentBom" items={gridParentBomColumns} afterGridCreate={afterGridParentBom} />
          </Box>
          <Box style={{ height: "40%" }}>
            <BaseGrid id="popDemandOverview_popOrderBomRate_gridChildBom" items={gridChildBomColumns} afterGridCreate={afterGridChildBom} />
          </Box>
        </Box>
      </PopupDialog>
    </>
  );
}

export default PopOrderBomRate;
