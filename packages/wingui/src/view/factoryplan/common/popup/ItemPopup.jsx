import React, { useEffect, useState } from 'react';
import { Box } from "@mui/material";
import { useViewStore, BaseGrid, PopupDialog, zAxios } from '@zionex/wingui-core/src/common/imports';
import { transLangKey } from "@wingui";
import { setGridComboList, setNoneEditableGrid } from "../common";

import '../../common/common.css';

const itemPopupGridFilters = ['itemCd', 'itemNm', "itemClassCd"];
const itemPopupGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 50, textAlignment: "center" },
  { name: "itemCd", dataType: "text", headerText: "FP_ITEM_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true },
  { name: "itemNm", dataType: "text", headerText: "FP_ITEM_NM", visible: true, editable: false, width: 200, textAlignment: "near", autoFilter: true },
  { name: "itemClassCd", dataType: "text", headerText: "FP_ITEM_CLASS_CD", visible: true, editable: false, width: 80, textAlignment: "center", autoFilter: true, lookupDisplay: true},
  {
    name: "groupAudit", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", expandable: true, expanded: false,
    childs: [
      { name: "updatedBy", dataType: "text", headerText: "FP_UPDATED_BY", visible: true, editable: false, width: 80, textAlignment: "center", groupShowMode: "expand" },
      { name: "updatedAt", dataType: "datetime", headerText: "FP_UPDATED_AT", visible: true, editable: false, width: 125, textAlignment: "center", groupShowMode: "always" },
      { name: "createdBy", dataType: "text", headerText: "FP_CREATED_BY", visible: true, editable: false, width: 80, textAlignment: "center", groupShowMode: "expand" },
      { name: "createdAt", dataType: "datetime", headerText: "FP_CREATED_AT", visible: true, editable: false, width: 125, textAlignment: "center", groupShowMode: "expand" },
    ]
  },
];

function ItemPopup(props) {
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const [itemPopupGrid, setItemPopupGrid] = useState(null);

  useEffect(() => {
    setItemPopupGrid(getViewInfo(vom.active, 'itemPopupGrid'))
  }, [viewData]);

  useEffect(() => {
    if (itemPopupGrid) {
      setNoneEditableGrid(itemPopupGrid);
      setGridOptions(itemPopupGrid.gridView);

      loadData();
    }
  }, [itemPopupGrid]);

  function setGridOptions(gridView) {
    if (gridView.id === 'itemPopupGrid') {
      setGridComboList(gridView, 'itemClassCd', 'FP_ITEM_CLASS_CD');

      gridView.onCellDblClicked = function (grid, clickData) {
        if (clickData.cellType === 'data') {
          const clickedRow = grid.getValues(clickData.itemIndex);
          const returnValues = {};

          returnValues['itemCd'] = clickedRow.itemCd;
          returnValues['itemNm'] = clickedRow.itemNm;
          returnValues['itemClassCd'] = clickedRow.itemClassCd;

          if (clickedRow.itemClassCd === 'M') {
            returnValues['itemTpCd'] = 'M';
          } else if (clickedRow.itemClassCd === 'I') {
            returnValues['itemTpCd'] = 'X';
          } else if (clickedRow.itemClassCd === 'P') {
            returnValues['itemTpCd'] = 'P';
          }

          props.confirm(returnValues);
          props.onClose(false);
        }
      }
    }
  }

  function clearAllFilters(gridView) {
    if (gridView.id === 'itemPopupGrid') {
      itemPopupGridFilters.forEach(value => {
        gridView.activateAllColumnFilters(value, false);
      })
    }
  }

  function loadData() {
    clearAllFilters(itemPopupGrid.gridView);

    zAxios.get(baseURI() + 'factoryplan/items', {
      params: {
        'search': ''
      },
      fromPopup: true
    })
    .then(function (res) {
      itemPopupGrid.dataProvider.fillJsonData(res.data);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      itemPopupGrid.gridView.expandAll();
    });
  }

  return (
      <>
        <PopupDialog type="NOBUTTONS" open={props.open} onClose={props.onClose} checks={[itemPopupGrid]} title={transLangKey("FP_ITEM_SELECT")} resizeHeight={560} resizeWidth={830}>
          <Box style={{ height: "100%" }}>
            <BaseGrid id="itemPopupGrid" items={itemPopupGridItems} className="white-skin" />
          </Box>
        </PopupDialog>
      </>
  )
}

export default ItemPopup;
