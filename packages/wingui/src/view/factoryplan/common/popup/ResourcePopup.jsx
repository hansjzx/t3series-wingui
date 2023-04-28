import React, { useEffect, useState } from 'react';
import { Box } from "@mui/material";
import { useViewStore, BaseGrid, PopupDialog, zAxios } from '@zionex/wingui-core/src/common/imports';
import { transLangKey } from '@wingui';
import { setNoneEditableGrid } from '../common';

import '../../common/common.css';

const resourcePopupGridFilters = ['resourceCd', 'resourceNm'];
const resourcePopupGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 50, textAlignment: "center" },
  { name: "resourceCd", dataType: "text", headerText: "FP_RESOURCE_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true },
  { name: "resourceNm", dataType: "text", headerText: "FP_RESOURCE_NM", visible: true, editable: false, width: 200, textAlignment: "near", autoFilter: true },
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
  const [resourcePopupGrid, setResourcePopupGrid] = useState(null);

  useEffect(() => {
    setResourcePopupGrid(getViewInfo(vom.active, 'resourcePopupGrid'))
  }, [viewData]);

  useEffect(() => {
    if (resourcePopupGrid) {
      setNoneEditableGrid(resourcePopupGrid);
      setGridOptions(resourcePopupGrid.gridView);

      loadData();
    }
  }, [resourcePopupGrid]);

  function setGridOptions(gridView) {
    if (gridView.id === 'resourcePopupGrid') {
      gridView.onCellDblClicked = function (grid, clickData) {
        if (clickData.cellType === 'data') {
          const clickedRow = grid.getValues(clickData.itemIndex);
          const returnValues = {};

          returnValues['resourceCd'] = clickedRow.resourceCd;
          returnValues['resourceNm'] = clickedRow.resourceNm;

          props.confirm(returnValues);
          props.onClose(false);
        }
      }
    }
  }

  function clearAllFilters(gridView) {
    if (gridView.id === 'resourcePopupGrid') {
      resourcePopupGridFilters.forEach(value => {
        gridView.activateAllColumnFilters(value, false);
      })
    }
  }

  function loadData() {
    clearAllFilters(resourcePopupGrid.gridView);

    zAxios.get(baseURI() + 'factoryplan/resources', {
      params: {
        'search': ''
      },
      fromPopup: true
    })
    .then(function (res) {
      resourcePopupGrid.dataProvider.fillJsonData(res.data);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      resourcePopupGrid.gridView.expandAll();
    });
  }

  return (
    <>
      <PopupDialog type="NOBUTTONS" open={props.open} onClose={props.onClose} checks={[resourcePopupGrid]} title={transLangKey("FP_RESOURCE_SELECT")} resizeHeight={560} resizeWidth={830}>
        <Box style={{ height: "100%" }}>
          <BaseGrid id="resourcePopupGrid" items={resourcePopupGridItems} className="white-skin" />
        </Box>
      </PopupDialog>
    </>
  )
}

export default ResourcePopup;
