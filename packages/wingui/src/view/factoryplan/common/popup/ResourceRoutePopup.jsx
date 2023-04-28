import React, { useEffect, useState } from 'react';
import { Box } from "@mui/material";
import { BaseGrid, PopupDialog, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';
import { transLangKey } from "@wingui";

import { setNoneEditableGrid } from "../common";

import '../../common/common.css';

const resourceRoutePopupGridFilters = ['routeCd', 'routeNm'];
const resourceRoutePopupGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 50, textAlignment: "center" },
  { name: "routeCd", dataType: "text", headerText: "FP_ROUTE_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true },
  { name: "routeNm", dataType: "text", headerText: "FP_ROUTE_NM", visible: true, editable: false, width: 200, textAlignment: "near", autoFilter: true },
  { name: "descTxt", dataType: "text", headerText: "FP_DESC_TXT", visible: true, editable: false, width: 80, textAlignment: "center"},
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

function ResourcePopup(props) {
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const [resourceRoutePopupGrid, setResourceRoutePopupGrid] = useState(null);

  useEffect(() => {
    setResourceRoutePopupGrid(getViewInfo(vom.active, 'resourceRoutePopupGrid'))
  }, [viewData]);

  useEffect(() => {
    if (resourceRoutePopupGrid) {
      setNoneEditableGrid(resourceRoutePopupGrid);
      setGridOptions(resourceRoutePopupGrid.gridView);

      loadData();
    }
  }, [resourceRoutePopupGrid]);

  function setGridOptions(gridView) {
    if (gridView.id === 'resourceRoutePopupGrid') {
      gridView.onCellDblClicked = function (grid, clickData) {
        if (clickData.cellType === 'data') {
          const clickedRow = grid.getValues(clickData.itemIndex);
          const returnValues = {};

          returnValues['routeCd'] = clickedRow.routeCd;
          returnValues['routeNm'] = clickedRow.routeNm;

          returnValues['target'] = props.target;

          props.confirm(returnValues);
          props.onClose(false);

        }
      }
    }
  }

  function clearAllFilters(gridView) {
    if (gridView.id === 'resourceRoutePopupGrid') {
      resourceRoutePopupGridFilters.forEach(value => {
        gridView.activateAllColumnFilters(value, false);
      })
    }
  }

  function loadData() {
    clearAllFilters(resourceRoutePopupGrid.gridView);

    const searchResourceCd = props.resourceCd === undefined ? '' : props.resourceCd;

    zAxios.get(baseURI() + 'factoryplan/resourceroutes', {
      params: {
        'searchResourceCd': searchResourceCd
      },
      fromPopup: true
    })
    .then(function (res) {
      resourceRoutePopupGrid.dataProvider.fillJsonData(res.data);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      resourceRoutePopupGrid.gridView.expandAll();
    });
  }

  return (
    <>
      <PopupDialog type="NOBUTTONS" open={props.open} onClose={props.onClose} checks={[resourceRoutePopupGrid]} title={transLangKey("FP_ROUTE_SELECT")} resizeHeight={560} resizeWidth={830}>
        <Box style={{ height: "100%" }}>
          <BaseGrid id="resourceRoutePopupGrid" items={resourceRoutePopupGridItems} className="white-skin" />
        </Box>
      </PopupDialog>
    </>
  )
}

export default ResourcePopup;
