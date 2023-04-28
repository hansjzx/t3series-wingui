import React, { useState, useEffect, useRef } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { ContentInner, SearchArea, SearchRow, ButtonArea, LeftButtonArea, RightButtonArea,
  GridExcelExportButton, GridSaveButton, BaseGrid, useUserStore, useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';
import { setGridComboList } from "@wingui/view/supplychainmodel/common/common";

import ItemSearchBox from '@wingui/view/supplychainmodel/common/ItemSearchBox';
import LocationSearchBox from '@wingui/view/supplychainmodel/common/LocationSearchBox';
import AccountSearchCondition from '@wingui/view/supplychainmodel/common/AccountSearchCondition';

let gridLocationColumns = [
  { name: 'CHANNEL_TP_ID', dataType: 'text', headerText: 'CHANNEL_TP_ID', visible: false, editable: false, width: '100' },
  { name: 'INCOTERMS_ID', dataType: 'text', headerText: 'INCOTERMS_ID', visible: false, editable: false, width: '100' },
  { name: 'ACCOUNT_ID', dataType: 'text', headerText: 'ACCOUNT_ID', visible: false, editable: false, width: '100' },
  { name: 'LOCAT_TP_ID', dataType: 'text', headerText: 'LOCAT_TP_ID', visible: false, editable: false, width: '100' },
  { name: 'CHANNEL_NM', dataType: 'text', headerText: 'CHANNEL_NM', visible: true, editable: false, width: '100', autoFilter: true },
  { name: 'INCOTERMS', dataType: 'text', headerText: 'INCOTERMS', visible: true, editable: false, width: '100', autoFilter: true },
  { name: 'ACCOUNT_NM', dataType: 'text', headerText: 'ACCOUNT_NM', visible: true, editable: false, width: '120' },
  { name: 'ITEM_CNT', dataType: 'number', headerText: 'ITEM_CNT', visible: true, editable: false, width: '60' },
  { name: 'DEMAND_SUM', dataType: 'number', headerText: 'DEMAND_SUM', visible: true, editable: false, width: '80' },
  { name: 'LOCAT_TP', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: '100' },
  { name: 'LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: '80' },
  { name: 'LOCAT_LV_DESCRIP', dataType: 'text', headerText: 'LOCAT_LV_DESCRIP', visible: true, editable: false, width: '140' },
  { name: 'LOCAT_CNT', dataType: 'number', headerText: 'LOCAT_CNT', visible: true, editable: false, width: '80' },
  { name: 'LEADTIME', dataType: 'group', orientation: 'horizontal', headerText: 'LEADTIME', expandable: false, expanded: false,
    childs: [
      { name: 'MFG_LEADTIME', dataType: 'number', headerText: 'MFG_LEADTIME', visible: true, editable: false, width: '100' },
      { name: 'OUTBOUND_LEADTIME', dataType: 'number', headerText: 'OUTBOUND_LEADTIME', visible: true, editable: false, width: '100' },
      { name: 'VOYAGE_LEADTIME', dataType: 'number', headerText: 'VOYAGE_LEADTIME', visible: true, editable: false, width: '100' },
      { name: 'INBOUND_LEADTIME', dataType: 'number', headerText: 'INBOUND_LEADTIME', visible: true, editable: false, width: '100' },
      { name: 'SHIPPING_LEADTIME', dataType: 'number', headerText: 'SHIPPING_LEADTIME', visible: false, editable: false, width: '100' }
    ]
  },
  { name: 'PREBUILD_LIMIT_VAL', dataType: 'number', headerText: 'PREBUILD_LIMIT_VAL', visible: true, editable: true, width: '100' },
  { name: 'TIME_UOM', dataType: 'text', headerText: 'TIME_UOM', visible: true, editable: true, width: '100', useDropdown: true, lookupDisplay: true }
];

let gridItemColumns = [
  { name: 'PRE_BUILD_ID', dataType: 'text', headerText: 'PRE_BUILD_ID', visible: false, editable: false, width: '100' },
  { name: 'LOC_DTL_ID', dataType: 'text', headerText: 'LOC_DTL_ID', visible: false, editable: false, width: '100' },
  { name: 'ITEM_MST_ID', dataType: 'text', headerText: 'ITEM_MST_ID', visible: false, editable: false, width: '100' },
  { name: 'LOCATION_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'LOCAT', expandable: true, expanded: false,
    childs: [
      { name: 'LOCAT_TP', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: 120, groupShowMode: 'expand' },
      { name: 'LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: 120, groupShowMode: 'expand' },
      { name: 'LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: 120, groupShowMode: 'always' },
      { name: 'LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: 120, groupShowMode: 'always' }
    ]
  },
  { name: 'CHANNEL_NM', dataType: 'text', headerText: 'CHANNEL_NM', visible: true, editable: false, width: 120, autoFilter: true },
  { name: 'INCOTERMS', dataType: 'text', headerText: 'INCOTERMS', visible: true, editable: false, width: 100, autoFilter: true },
  { name: 'ACCOUNT_NM', dataType: 'text', headerText: 'ACCOUNT_NM', visible: true, editable: false, width: 120},
  { name: 'DMND_QTY', dataType: 'number', headerText: 'DMND_QTY', visible: true, editable: false, width: 80 },
  { name: 'ITEM_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'ITEM', expandable: true, expanded: false,
    childs: [
      { name: 'ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', visible: true, editable: false, width: 100, groupShowMode: 'always' },
      { name: 'ITEM_NM', dataType: 'text', headerText: 'ITEM_NM', visible: true, editable: false, width: 120, groupShowMode: 'always' },
      { name: 'ITEM_DESCRIP', dataType: 'text', headerText: 'ITEM_DESCRIP', visible: false, editable: false, width: 80, groupShowMode: 'expand' },
      { name: 'ITEM_TP', dataType: 'text', headerText: 'ITEM_TP', visible: true, editable: false, width: 80, groupShowMode: 'expand' }
    ]
  },
  { name: 'LEADTIME', dataType: 'group', orientation: 'horizontal', headerText: 'LEADTIME', expandable: false, expanded: false,
    childs: [
      { name: 'MFG_LEADTIME', dataType: 'number', headerText: 'MFG_LEADTIME', visible: true, editable: false, width: '120' },
      { name: 'OUTBOUND_LEADTIME', dataType: 'number', headerText: 'OUTBOUND_LEADTIME', visible: true, editable: false, width: '100' },
      { name: 'VOYAGE_LEADTIME', dataType: 'number', headerText: 'VOYAGE_LEADTIME', visible: true, editable: false, width: '100' },
      { name: 'INBOUND_LEADTIME', dataType: 'number', headerText: 'INBOUND_LEADTIME', visible: true, editable: false, width: '100' },
      { name: 'SHIPPING_LEADTIME', dataType: 'number', headerText: 'SHIPPING_LEADTIME', visible: false, editable: false, width: '100' }
    ]
  },
  { name: 'PREBUILD_LIMIT_VAL', dataType: 'number', headerText: 'PREBUILD_LIMIT_VAL', visible: true, editable: true, width: '100' },
  { name: 'UOM', dataType: 'text', headerText: 'UOM_NM', visible: true, editable: true, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'FIXED_YN', dataType: 'boolean', headerText: 'FIXED_YN', visible: true, editable: true, width: 80 },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: true, width: 80, autoFilter: true },
  {
    name: "EDIT", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      {name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: 80, groupShowMode: "expand"},
      {name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: 140, groupShowMode: "expand"},
      {name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 80, groupShowMode: "always"},
      {name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 140, groupShowMode: "expand"}
    ]
  }
];

function PreBuildLimit() {
  const [username] = useUserStore(state => [state.username]);
  const [gridLocation, setGridLocation] = useState(null);
  const [gridItem, setGridItem] = useState(null);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo])

  const [tabValue, setTabValue] = React.useState("tabLocation");

  const accountSearchRef = useRef();
  const [currentAccountRef, setCurrentAccountRef] = useState();

  const locationSearchBoxRef = useRef();
  const [currentLocationRef, setCurrentLocationRef] = useState();

  const itemSearchBoxRef = useRef();
  const [currentItemRef, setCurrentItemRef] = useState();

  const globalButtons = [
    { name: 'search', action: (e) => { onSubmit(tabValue) }, visible: true, disable: false },
    { name: 'refresh', action: (e) => { refresh() }, visible: true, disable: false }
  ]

  const exportExcelOptions = {
    headerDepth: 2,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  };

  useEffect(() => {
    if (accountSearchRef) {
      if (accountSearchRef.current) {
        setCurrentAccountRef(accountSearchRef.current);
      }
    }

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

    async function initLoad() {
      await loadPrebuildLimitLocation();
      loadPrebuildLimitItem();
    }

    if (gridLocation && gridItem) {
      initLoad();
    }
  }, [gridLocation, gridItem]);

  function afterGridLocation(gridObj) {
    setGridLocation(gridObj);
    setGridLocationOptions(gridObj);
  }

  function setGridLocationOptions(gridObj) {
    setVisibleProps(gridObj, true, true, false);

    gridObj.gridView.setDisplayOptions({ fitStyle: 'fill' });

    gridObj.gridView.setColumnProperty('CHANNEL_NM', 'mergeRule', { criteria: 'value' });

    let columnArr = ['INCOTERMS', 'ACCOUNT_NM', 'ITEM_CNT', 'DEMAND_SUM'];
    for (let i = 0; i < columnArr.length; i++) {
      gridObj.gridView.setColumnProperty(columnArr[i], 'mergeRule', {
        criteria: "prevvalues + values[ '" + columnArr[i] + "' ]"
      });
    }

    setGridComboList(gridObj, 'TIME_UOM', 'TIME_UOM');
  }

  function afterGridItem(gridObj) {
    setGridItem(gridObj);
    setGridItemOptions(gridObj);
  }

  function setGridItemOptions(gridObj) {
    setVisibleProps(gridObj, true, true, false);

    gridObj.gridView.setDisplayOptions({ fitStyle: 'fill' });

    gridObj.gridView.setColumnProperty('LOCAT_TP', 'mergeRule', { criteria: 'value' });

    let columnArr = ['LOCAT_LV', 'LOCAT_CD', 'LOCAT_NM', 'CHANNEL_NM', 'INCOTERMS', 'ACCOUNT_NM'];
    for (let i = 0; i < columnArr.length; i++) {
      gridObj.gridView.setColumnProperty(columnArr[i], 'mergeRule', {
        criteria: "prevvalues + values[ '" + columnArr[i] + "' ]"
      });
    }

    wingui.util.grid.sorter.orderBy(gridObj.gridView, ['LOCAT_TP', 'LOCAT_LV', 'LOCAT_CD', 'LOCAT_NM', 'CHANNEL_NM', 'INCOTERMS', 'ACCOUNT_NM', 'DMND_QTY', 'ITEM_CD']);
    setGridComboList(gridObj, 'UOM', 'TIME_UOM');
  }

  function onSubmit(activeTab) {
    if (activeTab === 'tabLocation') {
      loadPrebuildLimitLocation();
    } else {
      loadPrebuildLimitItem();
    }
  };

  function refresh() {
    currentAccountRef.reset();
    currentLocationRef.reset();
    currentItemRef.reset();

    gridLocation.dataProvider.clearRows();
    gridItem.dataProvider.clearRows();
  }

  const tabChange = (event, newValue) => {
    setViewInfo(vom.active, 'globalButtons', [
      { name: "search", action: (e) => { onSubmit(newValue); }, visible: true, disable: false },
      { name: "refresh", action: (e) => { refresh(); }, visible: true, disable: false }
    ]);
    setTabValue(newValue);
  };

  function loadPrebuildLimitLocation() {
    let formData = new FormData();
    formData.append('LOCAT_TP', currentLocationRef.getLocationType());
    formData.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    formData.append('ACCOUNT_CD', currentAccountRef.getAccountCode());
    formData.append('ACCOUNT_NM', currentAccountRef.getAccountName());
    formData.append('CHANNEL_ID', '');
    formData.append('INCOTERMS', '');
    formData.append('ACTV_YN', 'ALL');

    return zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_13_Q1',
      data: formData
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridLocation.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function savePrebuildLimitLocation() {
    gridLocation.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5148'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridLocation.dataProvider.getAllStateRows().created,
          gridLocation.dataProvider.getAllStateRows().updated,
          gridLocation.dataProvider.getAllStateRows().deleted,
          gridLocation.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          changeRowData.push(gridLocation.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          if (answer) {
            let formData = new FormData();
            formData.append('USER_ID', username);
            formData.append('changes', JSON.stringify(changeRowData));

            zAxios({
              method: 'post',
              url: baseURI() + 'engine/mp/SRV_UI_MP_13_S1',
              data: formData
            })
            .then(function (res) {
              const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_13_S1_P_RT_MSG;
              showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false });

              if (res.status === gHttpStatus.SUCCESS) {
                loadPrebuildLimitLocation();
              }
            })
            .catch(function (e) {
              console.error(e);
            });
          }
        }
      }
    });
  }

  function loadPrebuildLimitItem() {
    let formData = new FormData();
    formData.append('LOCAT_TP', currentLocationRef.getLocationType());
    formData.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    formData.append('LOCAT_CD', currentLocationRef.getLocationCode());
    formData.append('LOCAT_NM', currentLocationRef.getLocationName());
    formData.append('ACCOUNT_CD', currentAccountRef.getAccountCode());
    formData.append('ACCOUNT_NM', currentAccountRef.getAccountName());
    formData.append('CHANNEL_ID', '');
    formData.append('INCOTERMS', '');
    formData.append('ACTV_YN', 'ALL');
    formData.append('ITEM_CD', currentItemRef.getItemCode());
    formData.append('ITEM_NM', currentItemRef.getItemName());
    formData.append("ITEM_TP", currentItemRef.getItemType());

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_13_Q2',
      data: formData
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridItem.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function savePrebuildLimitItem() {
    gridItem.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridItem.dataProvider.getAllStateRows().created,
          gridItem.dataProvider.getAllStateRows().updated,
          gridItem.dataProvider.getAllStateRows().deleted,
          gridItem.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          let rowData = gridItem.dataProvider.getJsonRow(row);

          if (rowData.CREATE_DTTM instanceof Date) {
            rowData.CREATE_DTTM = rowData.CREATE_DTTM.format("yyyy-MM-ddTHH:mm:ss");
          }
          if (rowData.MODIFY_DTTM instanceof Date) {
            rowData.MODIFY_DTTM = rowData.MODIFY_DTTM.format("yyyy-MM-ddTHH:mm:ss");
          }

          changeRowData.push(rowData);
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          if (answer) {
            let formData = new FormData();

            formData.append('WRK_TYPE', "SAVE");
            formData.append('changes', JSON.stringify(changeRowData));
            formData.append('USER_ID', username);

            zAxios({
              method: 'post',
              url: baseURI() + 'engine/mp/SRV_UI_MP_13_S2',
              data: formData
            })
            .then(function (res) {
              const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_13_S2_P_RT_MSG;
              showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false });

              if (res.status === gHttpStatus.SUCCESS) {
                loadPrebuildLimitItem();
              }
            })
            .catch(function (e) {
              console.error(e);
            });
          }
        }
      }
    });
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <AccountSearchCondition ref={accountSearchRef}></AccountSearchCondition>
            <LocationSearchBox ref={locationSearchBoxRef} keyValue={'locationName'} placeHolder={transLangKey("LOCAT_NM")} style={{width: 300}}/>
            <ItemSearchBox ref={itemSearchBoxRef} keyValue={'itemName'} placeHolder={transLangKey("ITEM_NM")} style={{display: tabValue === 'tabLocation' ? "none" : "inline-block", width: 300}}/>
          </SearchRow>
        </SearchArea>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={tabChange} indicatorColor="primary">
            <Tab label={transLangKey("LOCAT_LV")} value="tabLocation" />
            <Tab label={transLangKey("ITEM_LV")} value="tabItem" />
          </Tabs>
        </Box>

        {/* tabLocation */}
        <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: tabValue === "tabLocation" ? "block" : "none" }}>
          <ButtonArea>
            <LeftButtonArea>
              <GridExcelExportButton type="icon" grid="gridLocation" options={exportExcelOptions} />
              {/*<GridExcelImportButton type="icon" grid="gridLocation" />*/}
            </LeftButtonArea>
            <RightButtonArea>
              <GridSaveButton type="icon" onClick={() => { savePrebuildLimitLocation() }} />
            </RightButtonArea>
          </ButtonArea>
          <Box style={{ height: "calc(100% - 53px)" }}>
            <BaseGrid id="gridLocation" items={gridLocationColumns} afterGridCreate={afterGridLocation} />
          </Box>
        </Box>

        {/* tabItem */}
        <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: tabValue === "tabItem" ? "block" : "none" }}>
          <ButtonArea>
            <RightButtonArea>
              <GridSaveButton type="icon" onClick={() => { savePrebuildLimitItem() }} />
            </RightButtonArea>
          </ButtonArea>
          <Box style={{ height: "calc(100% - 53px)" }}>
            <BaseGrid id="gridItem" items={gridItemColumns} afterGridCreate={afterGridItem} />
          </Box>
        </Box>
      </ContentInner>
    </>
  )
}

export default PreBuildLimit;
