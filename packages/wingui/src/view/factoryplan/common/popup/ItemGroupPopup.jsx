import React, { useEffect, useState } from 'react';
import { Box } from "@mui/material";
import { useViewStore, BaseGrid, PopupDialog, zAxios } from '@zionex/wingui-core/src/common/imports';
import { transLangKey } from "@wingui";
import { setNoneEditableGrid } from "../common";

import '../../common/common.css';

const itemGroupPopupGridFilters = ['routeGroupCd', 'routeGroupNm'];
const itemGroupPopupGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 50, textAlignment: "center" },
  { name: "itemGrpCd", dataType: "text", headerText: "FP_ITEM_GRP_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true },
  { name: "itemGrpNm", dataType: "text", headerText: "FP_ITEM_GRP_NM", visible: true, editable: false, width: 200, textAlignment: "near", autoFilter: true },
  { name: "descTxt", dataType: "text", headerText: "FP_DESC_TXT", visible: true, editable: false, width: 80, textAlignment: "near" },
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

function ItemGroupPopup(props) {
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const [itemGroupPopupGrid, setItemGroupPopupGrid] = useState(null);

  useEffect(() => {
    setItemGroupPopupGrid(getViewInfo(vom.active, 'itemGroupPopupGrid'))
  }, [viewData]);

  useEffect(() => {
    if (itemGroupPopupGrid) {
      setNoneEditableGrid(itemGroupPopupGrid);
      setGridOptions(itemGroupPopupGrid.gridView);

      loadData();
    }
  }, [itemGroupPopupGrid]);

  function setGridOptions(gridView) {
    if (gridView.id === 'itemGroupPopupGrid') {
      gridView.onCellDblClicked = function (grid, clickData) {
        if (clickData.cellType === 'data') {
          const clickedRow = grid.getValues(clickData.itemIndex);
          const returnValues = {};

          returnValues['itemGrpCd'] = clickedRow.itemGrpCd;
          returnValues['itemGrpNm'] = clickedRow.itemGrpNm;

          props.confirm(returnValues);
          props.onClose(false);
        }
      }
    }
  }

  function clearAllFilters(gridView) {
    if (gridView.id === 'itemGroupPopupGrid') {
      itemGroupPopupGridFilters.forEach(value => {
        gridView.activateAllColumnFilters(value, false);
      })
    }
  }

  function loadData() {
    clearAllFilters(itemGroupPopupGrid.gridView);

    zAxios.get(baseURI() + 'factoryplan/itemGroups', {
      params: {
        'search': ''
      },
      fromPopup: true
    })
    .then(function (res) {
      itemGroupPopupGrid.dataProvider.fillJsonData(res.data);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      itemGroupPopupGrid.gridView.expandAll();
    });
  }

  return (
    <>
      <PopupDialog type="NOBUTTONS" open={props.open} onClose={props.onClose} checks={[itemGroupPopupGrid]} title={transLangKey("FP_ITEM_GROUP_SELECT")} resizeHeight={560} resizeWidth={830}>
        <Box style={{ height: "100%" }}>
          <BaseGrid id="itemGroupPopupGrid" items={itemGroupPopupGridItems} className="white-skin" />
        </Box>
      </PopupDialog>
    </>
  )
}

export default ItemGroupPopup;
