import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import {
  BaseGrid, ContentInner, ResultArea, SearchArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow, CommonButton,
  GridExcelImportButton, GridExcelExportButton, GridSaveButton, useUserStore,  useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';
import PopSupplyVariabilityBundleCreate from './PopSupplyVariabilityBundleCreate';
import ItemSearchBox from '@wingui/view/supplychainmodel/common/ItemSearchBox';
import LocationSearchBox from '@wingui/view/supplychainmodel/common/LocationSearchBox';

let gridVariabilityColumns = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: "150", title: "ID" },
  {
    name: "LOCATION", dataType: "group", headerText: "LOCAT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "120", title: "LOCAT_TP_NM", groupShowMode: "expand" },
      { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "120", title: "LOCAT_LV", groupShowMode: "expand" },
      { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "120", title: "LOCAT_CD", groupShowMode: "always" },
      { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "120", title: "LOCAT_NM", groupShowMode: "always" }
    ]
  },
  {
    name: "ITEM", dataType: "group", headerText: "ITEM", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: "100", title: "ITEM_CD", groupShowMode: "always" },
      { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: "100", title: "ITEM_NM", groupShowMode: "always" },
      { name: "DESCRIP", dataType: "text", headerText: "DESCRIP", visible: true, editable: false, width: "120", title: "DESCRIP", groupShowMode: "expand" },
      { name: "ITEM_TP", dataType: "text", headerText: "ITEM_TP", visible: true, editable: false, width: "80", title: "ITEM_TP", groupShowMode: "expand" }
    ]
  },
  { name: "UOM_NM", dataType: "text", headerText: "UOM_NM", visible: true, editable: false, width: "80", title: "UOM_NM" },
  {
    name: "SUPPLY_LEADTIME", dataType: "group", orientation: "horizontal", headerText: "SUPPLY_LEADTIME", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "SUPPLY_LEADTIME_AVG", dataType: "number", headerText: "SUPPLY_LEADTIME_AVG", visible: true, editable: false, width: "100", title: "SUPPLY_LEADTIME_AVG" },
      { name: "SUPPLY_LEADTIME_DEVIT", dataType: "number", headerText: "SUPPLY_LEADTIME_DEVIT", visible: true, editable: false, width: "100", title: "SUPPLY_LEADTIME_DEVIT" },
      { name: "SUPPLY_LEADTIME_VARAN", dataType: "number", headerText: "SUPPLY_LEADTIME_VARAN", visible: true, editable: false, width: "100", title: "SUPPLY_LEADTIME_VARAN" }
    ]
  },
  { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", editable: true, width: "60", visible: true, title: "ACTV_YN", type: "boolean", headerCheckable: false },
  {
    name: "EDIT", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: "100", groupShowMode: "expand" },
      { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: "140", groupShowMode: "expand" },
      { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: "100", groupShowMode: "always" },
      { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: "140", groupShowMode: "expand" }
    ]
  }
]

let gridSupplyColumns = [
  {
    name: "LOCATION", dataType: "group", orientation: "horizontal", headerText: "LOCAT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
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
      { name: "DESCRIP", dataType: "text", headerText: "DESCRIP", visible: true, editable: false, width: "120", groupShowMode: "expand" },
      { name: "ITEM_TP", dataType: "text", headerText: "ITEM_TP", visible: true, editable: false, width: "100", groupShowMode: "expand" }
    ]
  },
  { name: "UOM_NM", dataType: "text", headerText: "UOM_NM", visible: true, editable: false, width: "80", title: "UOM_NM", initGroupOrder: "9" },
  {
    name: "SUPPLY", dataType: "group", orientation: "horizontal", headerText: "SUPPLY", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "SUPPLY_LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "120", groupShowMode: "expand" },
      { name: "SUPPLY_LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "120", groupShowMode: "expand" },
      { name: "SUPPLY_LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "120", groupShowMode: "always" },
      { name: "SUPPLY_LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "120", groupShowMode: "always" }
    ]
  },
  {
    name: "SUPPLY_LEADTIME", dataType: "group", orientation: "horizontal", headerText: "SUPPLY_LEADTIME", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "SUPPLY_LEADTIME_AVG", dataType: "number", headerText: "SUPPLY_LEADTIME_AVG", visible: true, editable: false, width: "100" },
      { name: "SUPPLY_LEADTIME_DEVIT", dataType: "number", headerText: "SUPPLY_LEADTIME_DEVIT", visible: true, editable: false, width: "100" },
      { name: "SUPPLY_LEADTIME_VARAN", dataType: "number", headerText: "SUPPLY_LEADTIME_VARAN", visible: true, editable: false, width: "100" }
    ]
  }
]

function SupplyVariability() {
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo])
  const [username] = useUserStore(state => [state.username]);

  const [gridVariability, setGridVariability]  = useState(null);
  const [gridSupply, setGridSupply]  = useState(null);

  const locationSearchBoxRef = useRef();
  const itemSearchBoxRef = useRef();

  const [currentLocationRef, setCurrentLocationRef] = useState();
  const [currentItemRef, setCurrentItemRef] = useState();

  const [popSupplyVariabilityBundleCreateOpen, setPopSupplyVariabilityBundleCreateOpen] = useState(false);

  const globalButtons = [
    { name: "search", action: (e) => { loadVariability() }, visible: true, disable: false },
    { name: "refresh", action: (e) => { refresh() }, visible: true, disable: false }
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

    if (gridVariability && gridSupply) {
      setOptionsGridVariability(gridVariability);
      loadVariability();
    }
  }, [gridVariability, gridSupply]);

  function afterGridVariability(gridObj) {
    setGridVariability(gridObj);
  }

  function afterGridSupply(gridObj) {
    setGridSupply(gridObj);
    setOptionsGridSupply(gridObj);
  }

  function openPopDemandVariabilityBundleCreate() {
    setPopSupplyVariabilityBundleCreateOpen(true);
  }

  function onSetDemandVariabilityAll() {
    loadVariability();
  }

  function onSubmit(data) {
    if(gridVariability) {
      loadVariability(data);
    }
  };

  function refresh(){
    currentLocationRef.reset();
    currentItemRef.reset();
    gridVariability.dataProvider.clearRows();
    gridSupply.dataProvider.clearRows();
  }

  function setOptionsGridVariability(gridObj) {
    setVisibleProps(gridObj, true, true, false);
    gridObj.gridView.setDisplayOptions({
      fitStyle: "even"
    });

    wingui.util.grid.sorter.orderBy(gridObj.gridView, ['LOCAT_TP_NM', 'LOCAT_LV', 'LOCAT_CD', 'LOCAT_NM', 'ITEM_CD']);

    gridObj.gridView.setColumnProperty("LOCAT_TP_NM", "mergeRule", { criteria: "value" });
    gridObj.gridView.setColumnProperty("LOCAT_LV", "mergeRule", { criteria: "prevvalues + value" });
    gridObj.gridView.setColumnProperty("LOCAT_CD", "mergeRule", { criteria: "prevvalues + value" });
    gridObj.gridView.setColumnProperty("LOCAT_NM", "mergeRule", { criteria: "prevvalues + value" });

    gridObj.gridView.onCellClicked = function (grid, clickData) {
      if (clickData.cellType === 'data') {
        if (!clickData.editable && !(grid.getColumn(clickData.fieldIndex).renderer.type === 'check' && grid.getColumn(clickData.fieldIndex).renderer.editable)) {
          let svaId = grid.getValue(clickData.itemIndex, 'ID');

          if (svaId != null) {
            loadAccountDetail(svaId)
          }
        }
      }
    }
  }

  function setOptionsGridSupply(gridObj) {
    setVisibleProps(gridObj, true, false, false);

    gridObj.gridView.setDisplayOptions({
      fitStyle: "even"
    });

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
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_IM_10_Q1',
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridVariability.setData(res.data.RESULT_DATA);
        gridSupply.dataProvider.clearRows();
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function loadAccountDetail(svaId) {
    let param = new URLSearchParams();

    param.append('SVA_ID', svaId);
    param.append('timeout', 0);
    param.append('CURRENT_OPERATION_CALL_ID', 'OPC_RST_CPT_02_OPEN');

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_IM_10_Q2',
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridSupply.dataProvider.fillJsonData(res.data.RESULT_DATA);
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
            header: { 'content-type': 'application/json' },
            url: baseURI() + 'engine/mp/SRV_UI_IM_10_S1',
            params: param
          })
          .then(function (res) {
            if (res.status === gHttpStatus.SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_IM_10_S1_P_RT_MSG), { close: false });
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
            <LocationSearchBox ref={locationSearchBoxRef} keyValue={'locationName'} placeHolder={transLangKey("LOCAT_NM")} />
            <ItemSearchBox ref={itemSearchBoxRef} keyValue={'itemName'} placeHolder={transLangKey("ITEM_NM")} />
          </SearchRow>
        </SearchArea>
        <ResultArea sizes={[70, 35]}>
          <Box sx={{ display: "flex", height: "100%", flexDirection: "column", alignContent: "stretch", alignItems: "stretch" }}>
            <ButtonArea>
              <LeftButtonArea>
                <GridExcelExportButton type='icon' grid='gridVariability' options={exportExcelOptions}></GridExcelExportButton>
                <CommonButton title={transLangKey("BUNDLE_CREATE")} onClick={() => { openPopDemandVariabilityBundleCreate() }}><Icon.File /></CommonButton>
              </LeftButtonArea>
              <RightButtonArea>
                <GridSaveButton onClick={saveVariability} />
              </RightButtonArea>
            </ButtonArea>
            <Box style={{height:'calc(100% - 53px)'}}>
              <BaseGrid id='gridVariability' items={gridVariabilityColumns} afterGridCreate={afterGridVariability} />
            </Box>
          </Box>
          <Box>
            <Box style={{height:'calc(100% - 60px)'}}>
              <BaseGrid id='gridSupply' items={gridSupplyColumns} afterGridCreate={afterGridSupply} />
            </Box>
          </Box>
        </ResultArea>
      </ContentInner>

      {popSupplyVariabilityBundleCreateOpen && (<PopSupplyVariabilityBundleCreate open={popSupplyVariabilityBundleCreateOpen} onClose={() => {setPopSupplyVariabilityBundleCreateOpen(false)}} confirm={onSetDemandVariabilityAll} />)}
    </>
  )
}

export default SupplyVariability;
