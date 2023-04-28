import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import {
  BaseGrid, ButtonArea, CommonButton, ContentInner, GridSaveButton, SearchArea, SearchRow, LeftButtonArea,
  RightButtonArea, ResultArea, GridExcelExportButton, useUserStore, useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';
import PopStockCostBundleCreate from './PopStockCostBundleCreate';

import ItemSearchBox from '@wingui/view/supplychainmodel/common/ItemSearchBox';
import LocationSearchBox from '@wingui/view/supplychainmodel/common/LocationSearchBox';

let gridStockCostColumns = [
  { name: "LOCAT_MGMT_ID", dataType: "text", headerText: "LOCAT_MGMT_ID", visible: false, editable: false, width: 100 },
  { name: "LOCAT_ITEM_ID", dataType: "text", headerText: "LOCAT_ITEM_ID", visible: false, editable: false, width: 100 },
  { name: "INV_COST_ID", dataType: "text", headerText: "INV_COST_ID", visible: false, editable: false, width: 100 },
  {
    name: "LOCATION", dataType: "group", orientation: "horizontal", headerText: "LOCAT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: 120, groupShowMode: "expand" },
      { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: 120, groupShowMode: "expand" },
      { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: 120, groupShowMode: "always" },
      { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: 120, groupShowMode: "always" }
    ]
  },
  { name: 'ITEM_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'ITEM', expandable: true, expanded: false,
    childs: [
      { name: 'ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', visible: true, editable: false, width: 100, groupShowMode: 'always' },
      { name: 'ITEM_NM', dataType: 'text', headerText: 'ITEM_NM', visible: true, editable: false, width: 100, groupShowMode: 'always' },
      { name: "ITEM_DESCRIP", dataType: "text", headerText: "ITEM_DESCRIP", visible: true, editable: false, width: 120, groupShowMode: 'expand' },
      { name: "UOM_NM", dataType: "text", headerText: "UOM_NM", visible: true, editable: false, width: 80, groupShowMode: 'expand' }
    ]
  },
  { name: "CURCY_CD_ID", dataType: "text", headerText: "CURCY_CD_ID", visible: true, editable: false, width: 80 },
  { name: "VAL_01", dataType: "text", headerText: "VAL_01", visible: true, editable: false, width: 80 },
  { name: "QUADRANT_DESCRIP", dataType: "text", headerText: "QUADRANT_DESCRIP", visible: true, editable: false, width: 180, lang: true },
  { name: "VAL_02", dataType: "text", headerText: "VAL_02", visible: true, editable: false, width: 80 },
  { name: "VAL_03", dataType: "text", headerText: "VAL_03", visible: true, editable: false, width: 80 },
  { name: "VAL_04", dataType: "text", headerText: "VAL_04", visible: true, editable: false, width: 100 },
  { name: "VAL_05", dataType: "text", headerText: "VAL_05", visible: true, editable: false, width: 80 },
  { name: "VAL_06", dataType: "text", headerText: "VAL_06", visible: true, editable: false, width: 100 },
  { name: "VAL_07", dataType: "text", headerText: "VAL_07", visible: true, editable: false, width: 80 },
  { name: "VAL_08", dataType: "text", headerText: "VAL_08", visible: true, editable: false, width: 80 },
  { name: "VAL_09", dataType: "text", headerText: "VAL_09", visible: true, editable: false, width: 110 },
  { name: "VAL_10", dataType: "text", headerText: "VAL_10", visible: true, editable: false, width: 80 },
  { name: "VAL_11", dataType: "text", headerText: "VAL_11", visible: true, editable: false, width: 80 },
  { name: "VAL_12", dataType: "text", headerText: "VAL_12", visible: true, editable: false, width: 80 },
  { name: "VAL_13", dataType: "text", headerText: "VAL_13", visible: true, editable: false, width: 80 },
  { name: "VAL_14", dataType: "text", headerText: "VAL_14", visible: false, editable: false, width: 100 },
  { name: "VAL_15", dataType: "text", headerText: "VAL_15", visible: false, editable: false, width: 100 },
  { name: "VAL_16", dataType: "text", headerText: "VAL_16", visible: false, editable: false, width: 100 },
  { name: "VAL_17", dataType: "text", headerText: "VAL_17", visible: false, editable: false, width: 100 },
  { name: "VAL_18", dataType: "text", headerText: "VAL_18", visible: false, editable: false, width: 100 },
  { name: "VAL_19", dataType: "text", headerText: "VAL_19", visible: false, editable: false, width: 100 },
  { name: "VAL_20", dataType: "text", headerText: "VAL_10", visible: false, editable: false, width: 100 },
  {
    name: "STOCK_KEEPING_COST", dataType: "group", orientation: "horizontal", headerText: "STOCK_KEEPING_COST", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "STD_UTPIC", dataType: "number", headerText: "STD_UTPIC", visible: true, editable: false, width: 120 },
      { name: "INV_KEEPING_COST_RATE", dataType: "number", headerText: "STOCK_KEEPING_COST_RATE", visible: true, editable: true, width: 180 },
      { name: "INV_KEEPING_PRPSAL_VAL", dataType: "number", headerText: "STOCK_KEEPING_PRPSAL_VAL", visible: true, editable: false, width: 70 },
      { name: "INV_KEEPING_VAL", dataType: "number", headerText: "STOCK_KEEPING_VAL", visible: true, editable: true, width: 70 }
    ]
  },
  {
    name: "ORDER_COST", dataType: "group", orientation: "horizontal", headerText: "ORDER_COST", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "TRANSP_COST", dataType: "number", headerText: "TRANSP_COST", visible: true, editable: true, width: 140 },
      { name: "OTHER_COST", dataType: "number", headerText: "OTHER_COST", visible: true, editable: true, width: 80 },
      { name: "ORDER_COST_PRPSAL_VAL", dataType: "number", headerText: "ORDER_COST_PRPSAL_VAL", visible: true, editable: false, width: 70 },
      { name: "ORDER_COST_VAL", dataType: "number", headerText: "ORDER_COST_VAL", visible: true, editable: true, width: 70 }
    ]
  },
  { name: "FIXED_YN", dataType: "boolean", headerText: "FIXED_YN", visible: true, editable: true, width: 60 },
  { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: 60 },
  {
    name: "EDIT", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: 100, groupShowMode: "expand" },
      { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: 140, groupShowMode: "expand" },
      { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 100, groupShowMode: "always" },
      { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 140, groupShowMode: "expand" }
    ]
  }
];

function StockCost() {
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [username] = useUserStore(state => [state.username]);

  const [gridStockCost, setGridStockCost] = useState(null);
  const [stockCostBundleCreateOpen, setStockCostBundleCreateOpen] = useState(false);

  const locationSearchBoxRef = useRef();
  const itemSearchBoxRef = useRef();

  const [currentLocationRef, setCurrentLocationRef] = useState();
  const [currentItemRef, setCurrentItemRef] = useState();

  useEffect(() => {
    if (locationSearchBoxRef) {
      if (locationSearchBoxRef.current) {
        setCurrentLocationRef(locationSearchBoxRef.current);
      }
    }

    if (itemSearchBoxRef) {
      if (itemSearchBoxRef.current) {
        setCurrentItemRef(itemSearchBoxRef.current);
      }
    }
  }, [viewData])

  const globalButtons = [
    { name: 'search', action: (e) => { loadData() }, visible: true, disable: false },
    { name: 'refresh', action: (e) => { refresh() }, visible: true, disable: false }
  ]

  const exportExcelOptions = {
    headerDepth: 2,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  }

  useEffect(() => {
    function initLoad() {
      if (gridStockCost) {
        setViewInfo(vom.active, 'globalButtons', globalButtons);
        setOptions();
        loadData();
      }
    }

    initLoad();
  }, [gridStockCost]);

  const refresh = () => {
    currentLocationRef.reset();
    currentItemRef.reset();

    gridStockCost.dataProvider.clearRows();
  }

  function afterGridStockCost(gridObj) {
    setGridStockCost(gridObj);
  }

  function setOptions() {
    setVisibleProps(gridStockCost, true, true, false);

    gridStockCost.gridView.displayOptions.fitStyle = 'even';

    wingui.util.grid.sorter.orderBy(gridStockCost.gridView, ['LOCAT_TP_NM', 'LOCAT_LV', 'LOCAT_CD', 'LOCAT_NM', 'ITEM_CD', 'ITEM_NM']);

    gridStockCost.gridView.setColumnProperty("LOCAT_TP_NM", "mergeRule", { criteria: "value" });
    gridStockCost.gridView.setColumnProperty("LOCAT_LV", "mergeRule", { criteria: "prevvalues + value" });
    gridStockCost.gridView.setColumnProperty("LOCAT_CD", "mergeRule", { criteria: "prevvalues + value" });
    gridStockCost.gridView.setColumnProperty("LOCAT_NM", "mergeRule", { criteria: "prevvalues + value" });
    gridStockCost.gridView.setColumnProperty("ITEM_CD", "mergeRule", { criteria: "prevvalues + value" });

    gridStockCost.gridView.setFixedOptions({ colCount: 2, resizable: true });
  }

  async function loadData() {
    let param = new URLSearchParams();

    param.append('LOCAT_TP', currentLocationRef.getLocationType());
    param.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    param.append('LOCAT_CD', currentLocationRef.getLocationCode());
    param.append('LOCAT_NM', currentLocationRef.getLocationName());
    param.append('ITEM_CD', currentItemRef.getItemCode());
    param.append('ITEM_NM', currentItemRef.getItemName());
    param.append('ITEM_TP', currentItemRef.getItemType());
    param.append('USER_ID', username);

    gridStockCost.gridView.commit(true);

    await zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_IM_05_Q1',
      params: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridStockCost.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function saveData() {
    gridStockCost.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridStockCost.dataProvider.getAllStateRows().created,
          gridStockCost.dataProvider.getAllStateRows().updated,
          gridStockCost.dataProvider.getAllStateRows().deleted,
          gridStockCost.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          changeRowData.push(gridStockCost.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          let param = new URLSearchParams();

          param.append('CHANGES', JSON.stringify(changeRowData));
          param.append('USER_ID', username);

          zAxios({
            method: 'post',
            header: { 'content-type': 'application/json' },
            url: baseURI() + 'engine/mp/SRV_UI_IM_05_S1',
            data: param
          })
          .then(function (res) {
            if (res.status === gHttpStatus.SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_IM_05_S1_P_RT_MSG), { close: false });
              loadData();
            }
          })
          .catch(function (err) {
            console.log(err);
          });
        }
      }
    });
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <LocationSearchBox ref={locationSearchBoxRef} keyValue={"locationName"} placeHolder={transLangKey("LOCAT_NM")} />
            <ItemSearchBox ref={itemSearchBoxRef} keyValue={"itemName"} placeHolder={transLangKey("ITEM_NM")} />
          </SearchRow>
        </SearchArea>
        <ResultArea>
          <Box sx={{ display: "flex", height: "100%", flexDirection: "column", alignContent: "stretch", alignItems: "stretch" }}>
            <ButtonArea>
              <LeftButtonArea>
                <GridExcelExportButton type="icon" grid="gridStockCost" options={exportExcelOptions}></GridExcelExportButton>
                <CommonButton title={transLangKey("BUNDLE_CREATE")} onClick={() => { setStockCostBundleCreateOpen(true) }}><Icon.File/></CommonButton>
              </LeftButtonArea>
              <RightButtonArea>
                <GridSaveButton type="icon" onClick={saveData} />
              </RightButtonArea>
            </ButtonArea>
            <Box style={{ height: "100%" }}>
              <BaseGrid id="gridStockCost" items={gridStockCostColumns} afterGridCreate={afterGridStockCost} />
            </Box>
          </Box>
        </ResultArea>
      </ContentInner>

      {stockCostBundleCreateOpen && <PopStockCostBundleCreate open={stockCostBundleCreateOpen} onClose={() => setStockCostBundleCreateOpen(false)} confirm={loadData} />}
    </>
  )
}

export default StockCost;
