import React, { useState, useEffect, useRef } from 'react';
import { Tooltip, IconButton } from '@mui/material';
import {
  ContentInner, ResultArea, SearchArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow, CommonButton,
  GridExcelImportButton, GridExcelExportButton, GridAddRowButton, GridSaveButton, BaseGrid, useViewStore, useUserStore, zAxios
} from '@zionex/wingui-core/src/common/imports';

import ItemSearchBox from '../common/ItemSearchBox';
import LocationSearchBox from '../common/LocationSearchBox';
import AccountSearchCondition from '../common/AccountSearchCondition';

import PopDemandLocat from '../common/PopDemandLocat';
import PopDemandMappingNew from './PopDemandMappingNew';
import PopDemandMappingCreate from './PopDemandMappingCreate';

let gridDemandShipColumns = [
  {
    name: "demandInfoGroup", dataType: "group", orientation: "horizontal", headerText: "DMND_INFO", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "DMND_SHPP_MGMT_MST_ID", dataType: "text", headerText: "DMND_SHIPPING_MGMT_MST_ID", visible: false, editable: false, width: 260 },
      { name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: 80, groupShowMode: "always" },
      { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: 120, groupShowMode: "always" },
      { name: "ITEM_MST_ID", dataType: "text", headerText: "ITEM_MST_ID", visible: false, editable: false, width: 100 },
      { name: "ITEM_TP", dataType: "text", headerText: "ITEM_TP", visible: false, editable: false, width: 100 },
      { name: "ITEM_TP_NM", dataType: "text", headerText: "ITEM_TP", visible: true, editable: false, width: 80, autoFilter: true, groupShowMode: "always" },
      {
        name: "ACCOUNT_CD", dataType: "text", headerText: "ACCOUNT_CD", visible: true, editable: false, width: 100, groupShowMode: "always",
        styleCallback: function (grid, dataCell) {
          let ret = {}
          if (dataCell.item.rowState == 'created' || dataCell.item.itemState == 'appending' || dataCell.item.itemState == 'inserting') {
            ret.editable = true;
            ret.styleName = 'editable-text-column';
          } else {
            ret.editable = false;
          }
          return ret;
        },
      },
      { name: "ACCOUNT_NM", dataType: "text", headerText: "ACCOUNT_NM", visible: true, editable: false, width: 150, groupShowMode: "always" },
      { name: "ACCOUNT_ID", dataType: "text", headerText: "ACCOUNT_ID", visible: false, editable: false, width: 100 },
      { name: "SHIP_TO", dataType: "text", headerText: "SHIP_TO", visible: true, editable: false, width: 100, groupShowMode: "expand" },
      { name: "SOLD_TO", dataType: "text", headerText: "SOLD_TO", visible: true, editable: false, width: 100, groupShowMode: "expand" },
      { name: "BILL_TO", dataType: "text", headerText: "BILL_TO", visible: true, editable: false, width: 100, groupShowMode: "expand" },
      { name: "CHANNEL_NM", dataType: "text", headerText: "CHANNEL_NM", visible: true, editable: false, width: 100, autoFilter: true, groupShowMode: "always" },
      { name: "VMI_YN", dataType: "boolean", headerText: "VMI_YN", visible: true, editable: false, width: 50, groupShowMode: "always" },
      { name: "INCOTERMS", dataType: "text", headerText: "INCOTERMS", visible: true, editable: false, width: 80, groupShowMode: "always" },
      { name: "CUST_DELIVY_MODELING_YN", dataType: "boolean", headerText: "ACC_DELIVY_MODELING_YN", visible: true, editable: false, width: 100, groupShowMode: "always" }
    ]
  },
  { name: "locatMgmtId", dataType: "text", headerText: "LOCAT_MGMT_ID", visible: false, editable: false, width: 260 },
  {
    name: "shipMapLocatGroup", dataType: "group", orientation: "horizontal", headerText: "SHIP_MAP_LOCAT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "LOCAT_MGMT_ID", dataType: "text", headerText: "LOCAT_MGMT_ID", visible: false, editable: false, width: 260 },//LOCAT_MGMT_ID
      { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: 80, groupShowMode: "expand" },
      { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: 80, groupShowMode: "expand" },
      { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: 80, button: "action", groupShowMode: "always" },
      { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: 120, groupShowMode: "always" },
    ]
  },
  { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: 60 },
  {
    name: "EDIT", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      {name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: 100, groupShowMode: "expand"},
      {name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: 140, groupShowMode: "expand"},
      {name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 100, groupShowMode: "always"},
      {name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 140, groupShowMode: "expand"}
    ]
  }
];

function DemandMapping() {
  const [locatSelectpopupOpen, setLocatSelectpopupOpen] = useState(false);
  const [demandMappingPopupOpen, setDemandMappingPopupOpen] = useState(false);
  const [demandMappingCreateOpen, setDemandMappingCreateOpen] = useState(false);

  const itemSearchBoxRef = useRef();
  const [username] = useUserStore(state => [state.username]);
  const [currentItemRef, setCurrentItemRef] = useState();

  const locationSearchBoxRef = useRef();
  const [currentLocationRef, setCurrentLocationRef] = useState();

  const accountSearchRef = useRef();
  const [currentAccountRef, setCurrentAccountRef] = useState();
  const [gridDemandShip, setGridDemandShip] = useState(null);

  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const exportExceloptions = {
    headerDepth: 2,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  }

  const globalButtons = [
    { name: "search", action: (e) => { onSubmit() }, visible: true, disable: false },
    { name: "save", action: (e) => { saveDemandShip() }, visible: false, disable: false },
    { name: "refresh", action: (e) => { refresh() }, visible: true, disable: false },
  ]

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, 'gridDemandShip');
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        if (gridDemandShip != grdObj1)
          setGridDemandShip(grdObj1);
      }
    }

    if (itemSearchBoxRef) {
      if (itemSearchBoxRef.current) {
        setCurrentItemRef(itemSearchBoxRef.current);
      }
    }

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
  }, [viewData]);

  useEffect(() => {
    if (gridDemandShip) {
      setViewInfo(vom.active, 'globalButtons', globalButtons);

      setOptionsGridDemandShip();
      loadDemandShip(false);
    }
  }, [gridDemandShip]);

  const onSubmit = () => {
    loadDemandShip(false);
  };

  function refresh() {
    currentItemRef.reset();
    currentAccountRef.reset();
    currentLocationRef.reset();
    gridDemandShip.dataProvider.clearRows();
  }

  const loadDemandShip = (popupWhether) => {

    let param = new URLSearchParams();
    param.append('ITEM_CD', currentItemRef.getItemCode());
    param.append('ITEM_NM', currentItemRef.getItemName());
    param.append('ACCOUNT_CD', currentAccountRef.getAccountCode());
    param.append('ACCOUNT_NM', currentAccountRef.getAccountName());
    param.append('LOCAT_TP', currentLocationRef.getLocationType());
    param.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    param.append('LOCAT_CD', currentLocationRef.getLocationCode());
    param.append('LOCAT_NM', currentLocationRef.getLocationName());
    param.append('timeout', 0);

    if (popupWhether) {
      param.append('PREV_OPERATION_CALL_ID', 'OPC_POP_UI_CM_12_03_WINDOW_01_CPT_99_01_CLICK_01');
      param.append('PREV_OPERATION_RESULT_CODE', 'RESULT_CODE_SUCCESS');
      param.append('PREV_OPERATION_RESULT_MESSAGE', 'SUCCESS');
      param.append('PREV_OPERATION_RESULT_SUCCESS', 'true');
      param.append('CURRENT_OPERATION_CALL_ID', 'OPC_POP_UI_CM_12_03_WINDOW_01_CPT_99_01_CLICK_01');

    } else {
      param.append('CURRENT_OPERATION_CALL_ID', 'OPC_OPC_GRID_LOAD');
    }

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_CM_12_Q1',
      data: param
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          gridDemandShip.dataProvider.fillJsonData(res.data.RESULT_DATA);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function saveDemandShip() {
    gridDemandShip.gridView.commit(true);
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {

        const changes = [].concat(
          gridDemandShip.dataProvider.getAllStateRows().created,
          gridDemandShip.dataProvider.getAllStateRows().updated,
          gridDemandShip.dataProvider.getAllStateRows().deleted,
          gridDemandShip.dataProvider.getAllStateRows().createAndDeleted
        );

        const changeRowData = changes.map((row) => gridDemandShip.dataProvider.getJsonRow(row));

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          if (answer) {
            let formData = new FormData();
            formData.append('USER_ID', username);
            formData.append('changes', JSON.stringify(changeRowData));

            zAxios.post(baseURI() + 'engine/mp/SRV_UI_CM_12_S1', formData)
              .then(function (res) {
                if (res.status === gHttpStatus.SUCCESS) {
                  const rsData = res.data;
                  if (rsData.RESULT_SUCCESS) {
                    const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_12_S1_P_RT_MSG;
                    msg === "MSG_0001" ? loadDemandShip() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg)); 
                  } else {
                    showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
                  }
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

  function savePopupData1(PopupName, created) {
    let formData = new FormData();
    formData.append('ITEM_MST_ID', created[0].ITEM_MST_ID ?? '');
    formData.append('ACCOUNT_ID', created[0].ACCOUNT_ID ?? '');
    formData.append('LOC_DTL_ID', created[0].LOCAT_ID ?? '');
    formData.append('ACTV_YN', created[0].ACTV_YN[0] === 'Y' ? 'true' : 'false');
    formData.append('USER_ID', username);
    formData.append('timeout', 0);
    formData.append('CURRENT_OPERATION_CALL_ID', 'OPC_POP_UI_CM_12_01_WINDOW_01_CPT_99_01_CLICK_01');

    zAxios.post(baseURI() + 'engine/mp/SRV_UI_CM_12_POP_S1', formData)
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        const rsData = res.data;
        if (rsData.RESULT_SUCCESS) {
          const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_12_POP_S1_P_RT_MSG;
          msg === "MSG_0001" ? loadDemandShip(false) : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg)); 
        } else {
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
        }
      }
    })
    .catch(function (e) {
      console.error(e);
    });
  }

  const setOptionsGridDemandShip = () => {
    setVisibleProps(gridDemandShip, true, true, false);

    gridDemandShip.gridView.setEditOptions({
      insertable: true,
      appendable: true
    })

    gridDemandShip.gridView.onCellButtonClicked = function (grid, index, clickData) {
      if (index.column === 'LOCAT_CD') {
        setLocatSelectpopupOpen(true);
      }
    }
    gridDemandShip.gridView.setColumnProperty('LOCAT_CD', 'buttonVisibility', 'always');
    gridDemandShip.gridView.setDisplayOptions({fitStyle: 'even'});

    gridDemandShip.gridView.setColumnProperty('ITEM_CD', 'mergeRule', { criteria: 'value' });
    gridDemandShip.gridView.setColumnProperty('ITEM_NM', 'mergeRule', { criteria: 'value' });
    gridDemandShip.gridView.setColumnProperty('ITEM_TP_NM', 'mergeRule', { criteria: "values[ 'ITEM_NM' ] + values[ 'ITEM_TP_NM' ]" });
  }

  const updateRow = (popupName, popData) => {
    let itemIndex = gridDemandShip.gridView.getCurrent().itemIndex;
    let rows;

    if (popupName === 'PopDemandLocat') {
      rows = popData;
    }

    gridDemandShip.dataProvider.setValue(itemIndex, 'LOCAT_MGMT_ID', popData.LOCAT_MGMT_ID);
    gridDemandShip.dataProvider.setValue(itemIndex, 'LOCAT_TP_NM', popData.LOCAT_TP_NM);
    gridDemandShip.dataProvider.setValue(itemIndex, 'LOCAT_LV', popData.LOCAT_LV);
    gridDemandShip.dataProvider.setValue(itemIndex, 'LOCAT_CD', popData.LOCAT_CD);
    gridDemandShip.dataProvider.setValue(itemIndex, 'LOCAT_NM', popData.LOCAT_NM);
  }

  return (
    <ContentInner>
      <SearchArea>
        <SearchRow>
          <ItemSearchBox ref={itemSearchBoxRef} keyValue={'itemName'} placeHolder={transLangKey("ITEM_NM")} fields={['itemCode', 'itemName']} style={{popoverHeight :200}}/>
          <AccountSearchCondition ref={accountSearchRef}></AccountSearchCondition>
          <LocationSearchBox ref={locationSearchBoxRef} keyValue={'locationName'} placeHolder={transLangKey("LOCAT_NM")}/>
        </SearchRow>
      </SearchArea>
      <ButtonArea>
        <LeftButtonArea>
          <GridExcelExportButton type="icon" grid='gridDemandShip' options={exportExceloptions}></GridExcelExportButton>
          {/*<GridExcelImportButton type="icon" grid='gridDemandShip'></GridExcelImportButton>*/}
          <CommonButton title={transLangKey("BUNDLE_CREATE")} onClick={() => { setDemandMappingCreateOpen(true) }}><Icon.File/></CommonButton>
        </LeftButtonArea>
        <RightButtonArea>
          <GridAddRowButton type="icon" onClick={() => { setDemandMappingPopupOpen(true) }}></GridAddRowButton>
          <GridSaveButton type="icon" grid="gridBom" onClick={() => { saveDemandShip() }}></GridSaveButton>
        </RightButtonArea>
      </ButtonArea>
      <ResultArea sizes={[100, 50]} direction={'vertical'}>
        <BaseGrid id='gridDemandShip' items={gridDemandShipColumns}></BaseGrid>
      </ResultArea>
      {locatSelectpopupOpen && (<PopDemandLocat open={locatSelectpopupOpen} onClose={() => setLocatSelectpopupOpen(false)} multiple={true} confirm={updateRow} loadPopup={'demandmapping02'} title='LOCAT_CHOICE'></PopDemandLocat>)}
      {/* 수요매핑 신규등록 */}
      {demandMappingPopupOpen && (<PopDemandMappingNew open={demandMappingPopupOpen} onClose={() => setDemandMappingPopupOpen(false)} confirm={savePopupData1} title='POP_UI_CM_12_01'></PopDemandMappingNew>)}
      {/* 수요매핑 일괄생성 */}
      {demandMappingCreateOpen && (<PopDemandMappingCreate open={demandMappingCreateOpen} onClose={() => setDemandMappingCreateOpen(false)} multiple={true} confirm={loadDemandShip} title='POP_UI_CM_12_03'></PopDemandMappingCreate>)}
    </ContentInner>
  )
}

export default DemandMapping;
