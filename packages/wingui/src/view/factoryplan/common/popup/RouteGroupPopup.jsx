import React, { useEffect, useState } from 'react';
import { Box } from "@mui/material";
import { transLangKey } from '@wingui';
import { useViewStore, BaseGrid, PopupDialog, zAxios } from '@zionex/wingui-core/src/common/imports';
import { setNoneEditableGrid } from '../common';

import '../../common/common.css';

const routeGroupPopupGridFilters = ['routeGroupCd', 'routeGroupNm'];
const routeGroupPopupGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 50, textAlignment: "center" },
  { name: "routeGrpCd", dataType: "text", headerText: "FP_ROUTE_GRP_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true },
  { name: "routeGrpNm", dataType: "text", headerText: "FP_ROUTE_GRP_NM", visible: true, editable: false, width: 200, textAlignment: "near", autoFilter: true },
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

function RouteGroupPopup(props) {
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const [routeGroupPopupGrid, setRouteGroupPopupGrid] = useState(null);

  useEffect(() => {
    setRouteGroupPopupGrid(getViewInfo(vom.active, 'routeGroupPopupGrid'))
  }, [viewData]);

  useEffect(() => {
    if (routeGroupPopupGrid) {
      setNoneEditableGrid(routeGroupPopupGrid);
      setGridOptions(routeGroupPopupGrid.gridView);

      loadData();
    }
  }, [routeGroupPopupGrid]);

  function setGridOptions(gridView) {
    if (gridView.id === 'routeGroupPopupGrid') {
      gridView.onCellDblClicked = function (grid, clickData) {
        if (clickData.cellType === 'data') {
          const clickedRow = grid.getValues(clickData.itemIndex);
          const returnValues = {};

          returnValues['routeGrpCd'] = clickedRow.routeGrpCd;
          returnValues['routeGrpNm'] = clickedRow.routeGrpNm;

          props.confirm(returnValues);
          props.onClose(false);
        }
      }
    }
  }

  function clearAllFilters(gridView) {
    if (gridView.id === 'routeGroupPopupGrid') {
      routeGroupPopupGridFilters.forEach(value => {
        gridView.activateAllColumnFilters(value, false);
      })
    }
  }

  function loadData() {
    clearAllFilters(routeGroupPopupGrid.gridView);

    zAxios.get(baseURI() + 'factoryplan/routegroups', {
      params: {
        'search': ''
      },
      fromPopup: true
    })
    .then(function (res) {
      routeGroupPopupGrid.dataProvider.fillJsonData(res.data);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      routeGroupPopupGrid.gridView.expandAll();
    });
  }

  return (
    <>
      <PopupDialog type="NOBUTTONS" open={props.open} onClose={props.onClose} checks={[routeGroupPopupGrid]} title={transLangKey("FP_ROUTE_GROUP_SELECT")} resizeHeight={560} resizeWidth={830}>
        <Box style={{ height: "100%" }}>
          <BaseGrid id="routeGroupPopupGrid" items={routeGroupPopupGridItems} className="white-skin" />
        </Box>
      </PopupDialog>
    </>
  )
}

export default RouteGroupPopup;
