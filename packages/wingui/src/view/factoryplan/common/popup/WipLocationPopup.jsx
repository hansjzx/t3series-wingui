import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useViewStore, BaseGrid, PopupDialog, zAxios } from '@zionex/wingui-core/src/common/imports';
import { setNoneEditableGrid } from '../common';

const wipLocationPopupGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 0 },
  { name: "routeCode", dataType: "text", headerText: "FP_ROUTE_CD", visible: true, editable: false, width: 150, autoFilter: true, mergeRule: { criteria: "value" } },
  { name: "routeName", dataType: "text", headerText: "FP_ROUTE_NM", visible: true, editable: false, width: 170, autoFilter: true, mergeRule: { criteria: "value" } },
  { name: "borSetCd", dataType: "text", headerText: "FP_BOR_SET_CD", visible: true, editable: false, width: 190, mergeRule: { criteria: "values['routeCode'] + value" } },
  { name: "resourceCode", dataType: "text", headerText: "FP_RESOURCE_CD", visible: true, editable: false, width: 150, autoFilter: true },
  { name: "resourceName", dataType: "text", headerText: "FP_RESOURCE_NM", visible: true, editable: false, width: 150, autoFilter: true },
];

function WipLocationPopup(props) {
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const [wipLocationPopupGrid, setWipLocationPopupGrid] = useState(null);

  useEffect(() => {
    setWipLocationPopupGrid(getViewInfo(vom.active, 'wipLocationPopupGrid'));
  }, [viewData]);

  useEffect(() => {
    if (wipLocationPopupGrid) {
      setNoneEditableGrid(wipLocationPopupGrid);
      setGridOptions(wipLocationPopupGrid.gridView);

      loadData();
    }
  }, [wipLocationPopupGrid]);

  function setGridOptions(gridView) {
    if (gridView.id === 'wipLocationPopupGrid') {
      gridView.onCellDblClicked = function (grid, clickData) {
        if (clickData.cellType === 'data') {
          const clickedRow = grid.getValues(clickData.itemIndex);
          let resourceCd;
          if (clickedRow.borSetCd) {
            resourceCd = grid.getDataSource().getJsonRows(0, -1)
              .filter(row => row.borSetCd === clickedRow.borSetCd)
              .map(row => row.resourceCode)
              .join(', ');
          } else {
            resourceCd = clickedRow.resourceCode;
          }
          const values = {};
          values['routeCode'] = clickedRow.routeCode;
          values['routeName'] = clickedRow.routeName;
          values['resourceCd'] = resourceCd;
          props.confirm(values);
          props.onClose();
        }
      }
    }
  }

  function loadData() {
    zAxios.get(baseURI() + 'factoryplan/bors', {
      params: {
        'wo-cd': encodeURI(props.params)
      },
      fromPopup: true
    })
      .then(function (res) {
        wipLocationPopupGrid.dataProvider.fillJsonData(res.data);
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
      });
  }

  return (
    <>
      <PopupDialog type="NOBUTTONS" open={props.open} onClose={props.onClose} checks={[wipLocationPopupGrid]} title={transLangKey("FP_WIP_LOCATION_SELECT")} resizeHeight={560} resizeWidth={830}>
        <Box style={{ height: "100%" }}>
          <BaseGrid id="wipLocationPopupGrid" items={wipLocationPopupGridItems} className="white-skin" />
        </Box>
      </PopupDialog>
    </>
  )
}

export default WipLocationPopup;
