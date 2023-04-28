import React, { useEffect, useState } from 'react';
import { Box } from "@mui/material";
import { useViewStore, TreeGrid, PopupDialog, zAxios } from '@zionex/wingui-core/src/common/imports';
import { transLangKey } from "@wingui";

import { setNoneEditableGrid } from "../common";

import '../../common/common.css';

const stagePopupGridFilters = ['code'];
const stagePopupGridItems = [
  { name: "organization", dataType: "text", headerText: "FP_ORGANIZATION", visible: false, editable: false, width: 50, textAlignment: "center" },
  { name: "code", dataType: "text", headerText: "FP_ORGANIZATION", visible: true, editable: false, width: 120, textAlignment: "near", autoFilter: true },
  { name: "name", dataType: "text", headerText: "FP_NAME", visible: true, editable: false, width: 90, textAlignment: "near" },
  { name: "description", dataType: "text", headerText: "FP_DESC_TXT", visible: true, editable: false, width: 90, textAlignment: "near" }
];

function StagePopup(props) {
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const [stagePopupGrid, setStagePopupGrid] = useState(null);

  useEffect(() => {
    setStagePopupGrid(getViewInfo(vom.active, 'stagePopupGrid'))
  }, [viewData]);

  useEffect(() => {
    if (stagePopupGrid) {
      setNoneEditableGrid(stagePopupGrid);
      setGridOptions(stagePopupGrid.gridView);

      loadData();
    }
  }, [stagePopupGrid]);

  function setGridOptions(gridView) {
    if (gridView.id === 'stagePopupGrid') {
      gridView.onCellDblClicked = function (grid, clickData) {
        if (clickData.cellType === 'data') {
          const clickedRow = grid.getValues(clickData.itemIndex);
          const returnValues = {};

          if (clickedRow['organization'] === 'stage') {
            const parent = grid.getValues(grid.getParent(clickData.itemIndex));

            if (parent['organization'] === 'plant') {
              returnValues['plantCd'] = parent.code;
              returnValues['plantNm'] = parent.name;
            }

            returnValues['stageCd'] = clickedRow.code;
            returnValues['stageNm'] = clickedRow.name;

            props.confirm(returnValues);
            props.onClose();
          }
        }
      }
    }
  }

  function clearAllFilters(gridView) {
    if (gridView.id === 'stagePopupGrid') {
      stagePopupGridFilters.forEach(value => {
        gridView.activateAllColumnFilters(value, false);
      });
    }
  }

  function loadData() {
    clearAllFilters(stagePopupGrid.gridView);

    zAxios.get(baseURI() + 'factoryplan/stages-tree', {
      fromPopup: true
    })
    .then(function (res) {
      let data = res.data;
      stagePopupGrid.dataProvider.setObjectRows({ 'children': data }, 'children', '', '')
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      stagePopupGrid.gridView.expandAll();
    });
  }

  return (
    <>
      <PopupDialog type="NOBUTTONS" open={props.open} onClose={props.onClose} checks={[stagePopupGrid]} title={transLangKey("FP_STAGE_SELECT")} resizeHeight={560} resizeWidth={830}>
        <Box style={{ height: "100%" }}>
          <TreeGrid id="stagePopupGrid" items={stagePopupGridItems} className="white-skin" />
        </Box>
      </PopupDialog>
    </>
  )
}

export default StagePopup;
