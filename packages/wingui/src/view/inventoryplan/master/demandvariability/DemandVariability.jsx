import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import {
  BaseGrid, ButtonArea, CommonButton, ContentInner, GridExcelExportButton, GridSaveButton, LeftButtonArea, ResultArea,
  SearchArea, RightButtonArea, SearchRow, useUserStore, useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';
import PopDemandVariability from './PopDemandVariability';
import PopDemandVariabilityBundleCreate from './PopDemandVariabilityBundleCreate';
import ItemSearchBox from '@wingui/view/supplychainmodel/common/ItemSearchBox';
import LocationSearchBox from '@wingui/view/supplychainmodel/common/LocationSearchBox';

let gridVariabilityColumns = [
  { name: "DVA_ID", dataType: "text", headerText: "DVA_ID", visible: false, editable: true, width: "150" },
  {
    name: "LOCATION", dataType: "group", orientation: "horizontal", headerText: "LOCAT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "LOCAT_ID", dataType: "text", headerText: "LOCAT_ID", visible: false, editable: true, width: "150" },
      { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "120", groupShowMode: "expand" },
      { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "120", groupShowMode: "expand" },
      { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "120", groupShowMode: "always" },
      { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "120", groupShowMode: "always" }
    ]
  },
  {
    name: "ITEM", dataType: "group", orientation: "horizontal", headerText: "ITEM", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: "100", groupShowMode: "always" },
      { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: "100", groupShowMode: "always" },
      { name: "ITEM_TP", dataType: "text", headerText: "ITEM_TP", visible: true, editable: false, width: "100", groupShowMode: "expand" },
      { name: "UOM_NM", dataType: "text", headerText: "UOM_NM", visible: true, editable: false, width: "80", groupShowMode: "expand" }
    ]
  },
  { name: "CURCY_NM", dataType: "text", headerText: "CURCY_NM", visible: true, editable: false, width: "80" },
  {
    name: "LASTYEAR_SHIPPING_ACTUAL", dataType: "group", orientation: "horizontal", headerText: "LASTYEAR_SHIPPING_ACTUAL", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "ACTUAL_YOY_QTY", dataType: "number", headerText: "QTY", visible: true, editable: false, width: "100" },
      { name: "ACTUAL_YOY_REVENUE", dataType: "number", headerText: "REVENUE", visible: true, editable: false, width: "100" },
      { name: "ACTUAL_YOY_TIMES", dataType: "number", headerText: "FREQUENCY", visible: true, editable: false, width: "100" }
    ]
  },
  {
    name: "LASTMOTH_SHIPPING_ACTUAL", dataType: "group", orientation: "horizontal", headerText: "LASTMOTH_SHIPPING_ACTUAL", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "ACTUAL_QTY", dataType: "number", headerText: "QTY", visible: true, editable: false, width: "100" },
      { name: "ACTUAL_REVENUE", dataType: "number", headerText: "REVENUE", visible: true, editable: false, width: "100" },
      { name: "ACTUAL_TIMES", dataType: "number", headerText: "FREQUENCY", visible: true, editable: false, width: "100" }
    ]
  },
  {
    name: "SALES_PLAN", dataType: "group", orientation: "horizontal", headerText: "SALES_PLAN", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "SALES_PLAN_QTY", dataType: "number", headerText: "QTY", visible: true, editable: false, width: "100"},
      { name: "SALES_PLAN_REVENUE", dataType: "number", headerText: "REVENUE", visible: true, editable: false, width: "100" },
      { name: "SALES_PLAN_TIMES", dataType: "number", headerText: "FREQUENCY", visible: true, editable: false, width: "100" }
    ]
  },
  {
    name: "SUM", dataType: "group", orientation: "horizontal", headerText: "SUM", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "SUM_SALES_QTY", dataType: "number", headerText: "SUM_SALES_QTY", visible: true, editable: false, width: "100" },
      { name: "SUM_SALES_REVENUE", dataType: "number", headerText: "SUM_SALES_REVENUE", visible: true, editable: false, width: "100" },
      { name: "SUM_SALES_TIMES", dataType: "number", headerText: "FREQUENCY", visible: true, editable: false, width: "100" }
    ]
  },
  {
    name: "AVG", dataType: "group", orientation: "horizontal", headerText: "AVG", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "AVG_SALES_QTY", dataType: "number", headerText: "AVG_SALES_QTY", visible: true, editable: false, width: "100" },
      { name: "AVG_SALES_REVENUE", dataType: "number", headerText: "AVG_SALES_REVENUE", visible: true, editable: false, width: "100" },
      { name: "AVG_SALES_TIMES", dataType: "number", headerText: "FREQUENCY", visible: true, editable: false, width: "100" }
    ]
  },
  { name: "DEVIT", dataType: "number", headerText: "DEVIT", visible: true, editable: false, width: "100" },
  { name: "VARAN", dataType: "number", headerText: "VARAN", visible: true, editable: false, width: "100" },
  { name: "COV", dataType: "number", headerText: "COV", visible: true, editable: false, width: "80" },
  { name: "QUADRANT_ID", dataType: "text", headerText: "QUADRANT_ID", visible: false, editable: false, width: "100" },
  { name: "QUADRANT_NM", dataType: "text", headerText: "QUADRANT_NM", visible: true, editable: false, width: "80", button: "action", buttonVisibility: "always" },
  { name: "QUADRANT_DESCRIP", dataType: "text", headerText: "QUADRANT_DESCRIP", visible: true, editable: false, width: "180", lang: true },
  { name: "QUADRANT_BASE", dataType: "text", headerText: "SVC_LV_CAL_BASE", visible: true, editable: false, width: "140" },
  { name: "PRPSAL_SVC_LV_VAL", dataType: "number", headerText: "PRPSAL_SVC_LV_VAL", visible: true, editable: false, width: "120" },
  { name: "FIXED_YN", dataType: "boolean", headerText: "FIXED_YN", visible: true, editable: true, width: "60" },
  { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "60" },
  {
    name: "EDIT", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: "100", groupShowMode: "expand" },
      { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: "140", groupShowMode: "expand" },
      { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: "100", groupShowMode: "always" },
      { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: "140", groupShowMode: "expand" }
    ]
  }
];

let gridAccountColumns = [
  { name: "LOCAT_TP_NM", headerText: "LOCAT_TP_NM", dataType: "text", width: "120", editable: false, visible: true, initGroupOrder: "1", groups: "LOCAT", groupShowMode: "expand" },
  { name: "LOCAT_LV", headerText: "LOCAT_LV", dataType: "text", width: "120", editable: false, visible: true, initGroupOrder: "2", groups: "LOCAT", groupShowMode: "expand" },
  { name: "LOCAT_CD", headerText: "LOCAT_CD", dataType: "text", width: "120", editable: false, visible: true, initGroupOrder: "3", groups: "LOCAT", groupShowMode: "always" },
  { name: "LOCAT_NM", headerText: "LOCAT_NM", dataType: "text", width: "120", editable: false, visible: true, initGroupOrder: "4", groups: "LOCAT", groupShowMode: "always" },
  { name: "ITEM_CD", headerText: "ITEM_CD", dataType: "text", width: "100", editable: false, visible: true, initGroupOrder: "5", groups: "ITEM", groupShowMode: "always" },
  { name: "ITEM_NM" ,headerText: "ITEM_NM", dataType: "text", width: "100", editable: false, visible: true, initGroupOrder: "6", groups: "ITEM", groupShowMode: "always" },
  { name: "DESCRIP", headerText: "DESCRIP", dataType: "text", width: "120", editable: false, visible: true, initGroupOrder: "7", groups: "ITEM", groupShowMode: "expand" },
  { name: "ITEM_TP", headerText: "ITEM_TP", dataType: "text", width: "100", editable: false, visible: true, initGroupOrder: "8", groups: "ITEM", groupShowMode: "expand" },
  { name: "UOM_NM", headerText: "UOM_NM", dataType: "text", width: "80", editable: false, visible: true, nitGroupOrder: "9", groups: "ITEM", groupShowMode: "expand" },
  { name: "CURCY_NM", headerText: "CURCY_NM", dataType: "text", width: "80", editable: false, visible: true, initGroupOrder: "10" },
  { name: "SHIPTO_LOCAT_TP_NM", headerText: "SHIPTO_LOCAT_TP_NM", dataType: "text", width: "120", editable: false, visible: true, groups: "SHIP_TO", groupShowMode: "expand" },
  { name: "SHIPTO_LOCAT_LV", headerText: "SHIPTO_LOCAT_LV", dataType: "text", width: "120", editable: false, visible: true, groups: "SHIP_TO", groupShowMode: "expand" },
  { name: "SHIPTO_LOCAT_CD", headerText: "SHIPTO_LOCAT_CD", dataType: "text", width: "120", editable: false, visible: true, groups: "SHIP_TO", groupShowMode: "always" },
  { name: "SHIPTO_LOCAT_NM", headerText: "SHIPTO_LOCAT_NM", dataType: "text", width: "120", editable: false, visible: true, groups: "SHIP_TO", groupShowMode: "always" },
  { name: "ACCOUNT_CD", headerText: "ACCOUNT_CD", dataType: "text", width: "120", editable: false, visible: true, groups: "SHIP_TO", groupShowMode: "always" },
  { name: "ACCOUNT_NM", headerText: "ACCOUNT_NM", dataType: "text", width: "120", editable: false, visible: true, groups: "SHIP_TO", groupShowMode: "always" },
  { name: "DAT", headerText: "", dataType: "number", width: "100", editable: false, visible: true, iteration: { prefix: "DAT_", prefixRemove: "true", delimiter: "," } }
];

function DemandVariability() {
  const [username] = useUserStore(state => [state.username]);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo])

  const [gridVariability, setGridVariability]  = useState(null);
  const [gridAccount, setGridAccount]  = useState(null);

  const locationSearchBoxRef = useRef();
  const itemSearchBoxRef = useRef();

  const [currentLocationRef, setCurrentLocationRef] = useState();
  const [currentItemRef, setCurrentItemRef] = useState();

  const [popupData, setPopupData] = useState({});

  const [popDemandVariabilityOpen, setPopDemandVariabilityOpen] = useState(false);
  const [popDemandVariabilityBundleCreateOpen, setPopDemandVariabilityBundleCreateOpen] = useState(false);

  const globalButtons = [
    { name: "search", action: (e) => { loadVariability() }, visible: true, disable: false },
    { name: "refresh", action: (e) => { refresh() }, visible: true, disable: false },
  ]

  const exportExcelOptions = {
    headerDepth: 2,
    footer: "default",
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  }

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
  }, [viewData]);

  useEffect(() => {
    setViewInfo(vom.active, 'globalButtons', globalButtons);

    if (gridVariability && gridAccount) {
      setOptionsGridVariability(gridVariability);
      loadVariability();
    }
  }, [gridVariability, gridAccount]);

  function afterGridVariability(gridObj) {
    setGridVariability(gridObj);
  }

  function afterGridAccount(gridObj) {
    setGridAccount(gridObj);
    setOptionsGridAccount(gridObj);
  }

  function onSetQuadrant(gridRow) {
    gridVariability.gridView.commit(true);
    let itemIndex = gridVariability.gridView.getCurrent().dataRow;

    gridVariability.dataProvider.setValue(itemIndex, 'QUADRANT_ID', gridRow.ID)
    gridVariability.dataProvider.setValue(itemIndex, 'QUADRANT_NM', gridRow.QUADRANT_NM)
    gridVariability.dataProvider.setValue(itemIndex, 'QUADRANT_DESCRIP', gridRow.QUADRANT_DESCRIP)
    gridVariability.dataProvider.setValue(itemIndex, 'PRPSAL_SVC_LV_VAL', gridRow.PRPSAL_SVC_LV_VAL)
  }

  function openPopDemandVariabilityBundleCreate() {
    setPopDemandVariabilityBundleCreateOpen(true);
  }

  function onSetDemandVariabilityAll() {
    loadVariability();
  }

  function refresh(){
    currentLocationRef.reset();
    currentItemRef.reset();
    gridVariability.dataProvider.clearRows();
    gridAccount.dataProvider.clearRows();
  }

  function setOptionsGridVariability(gridObj) {
    setVisibleProps(gridObj, true, true, false);
    gridObj.gridView.setDisplayOptions({ fitStyle: "even" });

    wingui.util.grid.sorter.orderBy(gridObj.gridView, ['LOCAT_TP_NM', 'LOCAT_LV', 'LOCAT_CD', 'LOCAT_NM', 'ITEM_CD']);

    gridObj.gridView.setColumnProperty("LOCAT_TP_NM", "mergeRule", { criteria: "value" });
    gridObj.gridView.setColumnProperty("LOCAT_LV", "mergeRule", { criteria: "prevvalues + value" });
    gridObj.gridView.setColumnProperty("LOCAT_CD", "mergeRule", { criteria: "prevvalues + value" });
    gridObj.gridView.setColumnProperty("LOCAT_NM", "mergeRule", { criteria: "prevvalues + value" });

    gridObj.gridView.onCellClicked = function (grid, clickData) {
      if (clickData.cellType === 'data') {
        if (!clickData.editable && !(grid.getColumn(clickData.fieldIndex).renderer.type === 'check' && grid.getColumn(clickData.fieldIndex).renderer.editable)) {
          let dvaId = grid.getValue(clickData.itemIndex, 'DVA_ID');

          if (dvaId != null) {
            loadAccountDetail(dvaId);
          }
        }
      }
    }

    gridObj.gridView.onCellButtonClicked = function (grid, clickData, column) {
      if (column.fieldName === 'QUADRANT_NM') {
        setPopupData(grid.getValues(clickData.itemIndex));
        setPopDemandVariabilityOpen(true);
      }
    }

    gridObj.gridView.setFixedOptions({ colCount: 2, resizable: true });
  }

  function setOptionsGridAccount(gridObj) {
    setVisibleProps(gridObj, true, true, false);

    gridObj.gridView.setDisplayOptions({ fitStyle: "even" });

    gridObj.gridView.setColumnProperty("LOCAT_TP_NM", "mergeRule", { criteria: "value" });
    gridObj.gridView.setColumnProperty("LOCAT_LV", "mergeRule", { criteria: "prevvalues + value" });
    gridObj.gridView.setColumnProperty("LOCAT_CD", "mergeRule", { criteria: "prevvalues + value" });
    gridObj.gridView.setColumnProperty("LOCAT_NM", "mergeRule", { criteria: "prevvalues + value" });

    gridObj.gridView.setColumnProperty("ITEM_CD", "mergeRule", { criteria: "prevvalues + value" });
    gridObj.gridView.setColumnProperty("ITEM_NM", "mergeRule", { criteria: "prevvalues + value" });
    gridObj.gridView.setColumnProperty("DESCRIP", "mergeRule", { criteria: "prevvalues + value" });
    gridObj.gridView.setColumnProperty("ITEM_TP", "mergeRule", { criteria: "prevvalues + value" });
    gridObj.gridView.setColumnProperty("UOM_NM", "mergeRule", { criteria: "prevvalues + value" });
  }

  function loadVariability() {
    let param = new URLSearchParams();

    param.append('LOCAT_TP', currentLocationRef.getLocationType());
    param.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    param.append('LOCAT_CD', currentLocationRef.getLocationCode());
    param.append('LOCAT_NM', currentLocationRef.getLocationName());
    param.append('ITEM_CD', currentItemRef.getItemCode());
    param.append('ITEM_NM', currentItemRef.getItemName());
    param.append('ITEM_TP', currentItemRef.getItemType());
    param.append('timeout', 0);
    param.append('CURRENT_OPERATION_CALL_ID', 'OPC_GRID_LOAD');

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_IM_09_Q1',
      data: param
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          gridVariability.setData(res.data.RESULT_DATA);
          gridAccount.dataProvider.clearRows();
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function loadAccountDetail(dvaId) {
    let param = new URLSearchParams();

    param.append('DVA_ID', dvaId);
    param.append('timeout', 0);
    param.append('CURRENT_OPERATION_CALL_ID', 'OPC_RST_CPT_02_OPEN');
    param.append("CROSSTAB", JSON.stringify(gridAccount.gridView.crossTabInfo));

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_IM_09_Q2',
      data: param
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          gridAccount.setData(res.data.RESULT_DATA);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function saveVariability() {
    gridVariability.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridVariability.dataProvider.getAllStateRows().created,
          gridVariability.dataProvider.getAllStateRows().updated,
          gridVariability.dataProvider.getAllStateRows().deleted,
          gridVariability.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          changeRowData.push(gridVariability.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          let param = new URLSearchParams();

          param.append('changes', JSON.stringify(changeRowData));
          param.append('USER_ID', username);
          param.append('timeout', 0);
          param.append('CURRENT_OPERATION_CALL_ID', 'OPC_RST_BTN_SAV_01');

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_UI_IM_09_S1',
            data: param
          })
            .then(function (res) {
              if (res.status === gHttpStatus.SUCCESS) {
                showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_IM_09_S1_P_RT_MSG), { close: false });
                loadVariability();
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
            <LocationSearchBox ref={locationSearchBoxRef} keyValue={'locationName'} placeHolder={transLangKey("LOCAT_NM")}/>
            <ItemSearchBox ref={itemSearchBoxRef} keyValue={'itemName'} placeHolder={transLangKey("ITEM_NM")}/>
          </SearchRow>
        </SearchArea>
        <ResultArea sizes={[70, 35]}>
          <Box sx={{ display: "flex", height: "100%", flexDirection: "column", alignContent: "stretch", alignItems: "stretch" }}>
            <ButtonArea>
              <LeftButtonArea>
                <GridExcelExportButton type='icon' grid='gridVariability' options={exportExcelOptions}></GridExcelExportButton>
                <CommonButton title={transLangKey("BUNDLE_CREATE")} onClick={() => { openPopDemandVariabilityBundleCreate() }}><Icon.File/></CommonButton>
              </LeftButtonArea>
              <RightButtonArea>
                <GridSaveButton onClick={saveVariability}></GridSaveButton>
              </RightButtonArea>
            </ButtonArea>
            <Box style={{height:'calc(100% - 53px)'}}>
              <BaseGrid id='gridVariability' items={gridVariabilityColumns} afterGridCreate={afterGridVariability} />
            </Box>
          </Box>
          <Box>
            <Box style={{height:'calc(100% - 60px)'}}>
              <BaseGrid id='gridAccount' items={gridAccountColumns} afterGridCreate={afterGridAccount} viewCd='UI_IM_09' gridCd='UI_IM_09-RST_CPT_02' />
            </Box>
          </Box>
        </ResultArea>
      </ContentInner>

      {popDemandVariabilityOpen && (<PopDemandVariability open={popDemandVariabilityOpen} onClose={() => {setPopDemandVariabilityOpen(false)}} confirm={onSetQuadrant} data={popupData}></PopDemandVariability>)}
      {popDemandVariabilityBundleCreateOpen && (<PopDemandVariabilityBundleCreate open={popDemandVariabilityBundleCreateOpen} onClose={() => {setPopDemandVariabilityBundleCreateOpen(false)}} confirm={onSetDemandVariabilityAll}></PopDemandVariabilityBundleCreate>)}
    </>
  )
}

export default DemandVariability;
