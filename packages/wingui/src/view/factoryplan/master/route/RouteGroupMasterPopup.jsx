import React, { useEffect, useState } from 'react';
import { Box } from "@mui/material";
import { 
  ButtonArea, RightButtonArea, GridDeleteRowButton, GridAddRowButton, GridSaveButton, useViewStore, BaseGrid, PopupDialog, zAxios
} from '@zionex/wingui-core/src/common/imports';
import { setEditableGrid, setCodeColumnStyle } from "../../common/common";
import { transLangKey } from "@wingui";

import '../../common/common.css';

const routeGroupMasterGridFilters = ['routeGroupCd', 'routeGroupNm'];

const routeGroupMasterGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 50, textAlignment: "center" },
  { name: "routeGrpCd", dataType: "text", headerText: "FP_ROUTE_GRP_CD", visible: true, editable: true, width: 150, textAlignment: "near", autoFilter: true,
    validRules: [{ criteria: "required"}]
  },
  { name: "routeGrpNm", dataType: "text", headerText: "FP_ROUTE_GRP_NM", visible: true, editable: true, width: 200, textAlignment: "near", autoFilter: true },
  { name: "descTxt", dataType: "text", headerText: "FP_DESC_TXT", visible: true, editable: true, width: 80, textAlignment: "near" },
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

function RouteGroupMasterPopup(props) {
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const [routeGroupMasterGrid, setRouteGroupMasterGrid] = useState(null);

  useEffect(() => {
    setRouteGroupMasterGrid(getViewInfo(vom.active, 'routeGroupMasterGrid'))
  }, [viewData]);

  useEffect(() => {
    if (routeGroupMasterGrid) {
      setEditableGrid(routeGroupMasterGrid);
      setGridOptions(routeGroupMasterGrid.gridView);

      loadData();
    }
  }, [routeGroupMasterGrid]);


  function setGridOptions(gridView) {
    if (gridView.id === 'routeGroupMasterGrid') {
      let codeColumn = gridView.columnByName('routeGrpCd')
      codeColumn.styleCallback = setCodeColumnStyle;
    }
  }

  function clearAllFilters(gridView) {
    if (gridView.id === 'routeGroupMasterGrid') {
      routeGroupMasterGridFilters.forEach(value => {
        gridView.activateAllColumnFilters(value, false);
      })
    }
  }

  function loadData() {
    clearAllFilters(routeGroupMasterGrid.gridView);

    routeGroupMasterGrid.gridView.commit(true);
    routeGroupMasterGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    zAxios.get(baseURI() + 'factoryplan/master/route/routegroups', {
      params: {
        'search': ''
      },
      fromPopup: true
    })
    .then(function (res) {
      routeGroupMasterGrid.dataProvider.fillJsonData(res.data);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      routeGroupMasterGrid.gridView.hideToast();
      routeGroupMasterGrid.gridView.setAllCheck(false, false);
    });
  }

  const afterToLoad = (targetGrid) => {
    if (targetGrid.gridView.id === 'routeGroupMasterGrid') {
      loadData();
    }
  }

  return (
    <>
      <PopupDialog type="NOBUTTONS" open={props.open} onClose={props.onClose} checks={[routeGroupMasterGrid]} title={transLangKey("FP_ROUTE_GROUP_MST")} resizeHeight={760} resizeWidth={830}>
        <ButtonArea>
          <RightButtonArea>
            <GridAddRowButton grid="routeGroupMasterGrid" />
            <GridDeleteRowButton grid="routeGroupMasterGrid" url="factoryplan/master/route/routegroups/delete" onAfterDelete={afterToLoad} />
            <GridSaveButton grid="routeGroupMasterGrid" url="factoryplan/master/route/routegroups" onAfterSave={afterToLoad} />
          </RightButtonArea>
        </ButtonArea>
        <Box style={{ height: "100%" }}>
          <BaseGrid id="routeGroupMasterGrid" items={routeGroupMasterGridItems} className="white-skin" />
        </Box>
      </PopupDialog>
    </>
  )
}

export default RouteGroupMasterPopup;
