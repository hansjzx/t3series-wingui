import React, { useEffect, useState } from 'react';
import { Box } from "@mui/material";
import { 
  ButtonArea, RightButtonArea, GridDeleteRowButton, GridAddRowButton, GridSaveButton, useViewStore,
  BaseGrid, PopupDialog, zAxios
} from '@zionex/wingui-core/src/common/imports';
import { setEditableGrid, setCodeColumnStyle } from "../../common/common";
import { transLangKey } from "@wingui";

import '../../common/common.css';

const itemGroupMasterGridFilters = ['itemGrpCd', 'itemGrpNm'];

const itemGroupMasterGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 50, textAlignment: "center" },
  { name: "itemGrpCd", dataType: "text", headerText: "FP_ITEM_GRP_CD", visible: true, editable: true, width: 150, textAlignment: "near", autoFilter: true,
    validRules: [{ criteria: "required"}]
  },
  { name: "itemGrpNm", dataType: "text", headerText: "FP_ITEM_GRP_NM", visible: true, editable: true, width: 200, textAlignment: "near", autoFilter: true },
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

function ItemGroupMasterPopup(props) {
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const [itemGroupMasterGrid, setItemGroupMasterGrid] = useState(null);

  useEffect(() => {
    setItemGroupMasterGrid(getViewInfo(vom.active, 'itemGroupMasterGrid'))
  }, [viewData]);

  useEffect(() => {
    if (itemGroupMasterGrid) {
      setEditableGrid(itemGroupMasterGrid);
      setGridOptions(itemGroupMasterGrid.gridView);

      loadData();
    }
  }, [itemGroupMasterGrid]);


  function setGridOptions(gridView) {
    if (gridView.id === 'itemGroupMasterGrid') {
      let codeColumn = gridView.columnByName('itemGrpCd')
      codeColumn.styleCallback = setCodeColumnStyle;
    }
  }

  function clearAllFilters(gridView) {
    if (gridView.id === 'itemGroupMasterGrid') {
      itemGroupMasterGridFilters.forEach(value => {
        gridView.activateAllColumnFilters(value, false);
      })
    }
  }

  function loadData(param = '') {
    clearAllFilters(itemGroupMasterGrid.gridView);

    itemGroupMasterGrid.gridView.commit(true);
    itemGroupMasterGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    zAxios.get(baseURI() + 'factoryplan/master/item/itemgroups', {
      params: {
        'search': param
      },
      waitOn: false
    })
    .then(function (res) {
      itemGroupMasterGrid.dataProvider.fillJsonData(res.data);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      itemGroupMasterGrid.gridView.hideToast();
      itemGroupMasterGrid.gridView.setAllCheck(false, false);
    });
  }

  const afterToLoad = (targetGrid) => {
    if (targetGrid.gridView.id === 'itemGroupMasterGrid') {
      loadData();
    }
  }

  return (
    <>
      <PopupDialog type="NOBUTTONS" open={props.open} onClose={props.onClose} checks={[itemGroupMasterGrid]} title={transLangKey("FP_ITEM_GROUP_MST")} resizeHeight={760} resizeWidth={830}>
        <ButtonArea>
          <RightButtonArea>
            <GridAddRowButton grid="itemGroupMasterGrid" />
            <GridDeleteRowButton grid="itemGroupMasterGrid" url="factoryplan/master/item/itemgroups/delete" onAfterDelete={afterToLoad} />
            <GridSaveButton grid="itemGroupMasterGrid" url="factoryplan/master/item/itemgroups" onAfterSave={afterToLoad} />
          </RightButtonArea>
        </ButtonArea>
        <Box style={{ height: "100%" }}>
          <BaseGrid id="itemGroupMasterGrid" items={itemGroupMasterGridItems} className="white-skin" />
        </Box>
      </PopupDialog>
    </>
  )
}

export default ItemGroupMasterPopup;
