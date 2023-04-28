import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import {
  BaseGrid, ButtonArea, ContentInner, GridAddRowButton, GridDeleteRowButton, GridExcelExportButton, GridExcelImportButton, GridSaveButton,
  LeftButtonArea, ResultArea, RightButtonArea, SearchArea, SearchRow, useViewStore, zAxios, CommonButton, useUserStore
} from '@zionex/wingui-core/src/common/imports';

import PopDifGrade from '../common/PopDifGrade';
import PopSiteItemBatchUpdate from './PopSiteItemBatchUpdate';
import PopSiteItemBundleCreate from './PopSiteItemBundleCreate';
import PopSiteItemNew from './PopSiteItemNew';

import ItemSearchBox from '../common/ItemSearchBox';
import LocationSearchBox from '../common/LocationSearchBox';
import { setGridComboList } from "@wingui/view/supplychainmodel/common/common";

let gridLocationItemColumns = [
  { name: 'ID', dataType: 'text', headerText: 'ID', visible: false, editable: true, width: '30' },
  { name: 'ITEM_MST_ID', dataType: 'text', headerText: 'ITEM_MST_ID', visible: false, editable: true, width: '30' },
  { name: 'LOCATION_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'LOCAT', expandable: true, expanded: false,
    childs: [
      { name: 'LOCAT_TP', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: 80, groupShowMode: 'expand' },
      { name: 'LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: 80, groupShowMode: 'expand' },
      { name: 'LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: 80, groupShowMode: 'always' },
      { name: 'LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: 100, groupShowMode: 'always' }
    ]
  },
  { name: 'ITEM_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'ITEM', expandable: true, expanded: false,
    childs: [
      { name: 'ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', visible: true, editable: false, width: '80', groupShowMode: 'always' },
      { name: 'ITEM_NM', dataType: 'text', headerText: 'ITEM_NM', visible: true, editable: false, width: '120', groupShowMode: 'always' },
      { name: 'ITEM_LV_NM', dataType: 'text', headerText: 'ITEM_LV', visible: true, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ITEM_TP', dataType: 'text', headerText: 'ITEM_TP', visible: true, editable: false, width: '80', useDropdown: true, lookupDisplay: true, groupShowMode: 'expand' },
      { name: 'DESCRIP', dataType: 'text', headerText: 'DESCRIP', visible: false, editable: false, width: '150', groupShowMode: 'expand' },
      { name: 'MIN_ORDER_SIZE', dataType: 'number', headerText: 'MIN_ORDER_SIZE', visible: true, editable: true, width: '100', numberFormat: '#,###.###', groupShowMode: 'expand' },
      { name: 'MAX_ORDER_SIZE', dataType: 'number', headerText: 'MAX_ORDER_SIZE', visible: true, editable: true, width: '100', numberFormat: '#,###.###', groupShowMode: 'expand' },
      { name: 'UOM_CD', dataType: 'text', headerText: 'UOM_NM', visible: true, editable: true, width: '60', useDropdown: true, lookupDisplay: true, groupShowMode: 'expand' },
      { name: 'UOM_NM', dataType: 'text', headerText: 'UOM_NM', visible: false, editable: false, width: '80', groupShowMode: 'expand' }
    ]
  },
  { name: 'ATTR_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'CM_ITEM_ATTR', expandable: true, expanded: false,
    childs: [
      { name: 'ATTR_01', dataType: 'text', headerText: 'ITEM_ATTR_01', visible: true, editable: false, width: '80', groupShowMode: 'always' },
      { name: 'ATTR_02', dataType: 'text', headerText: 'ITEM_ATTR_02', visible: true, editable: false, width: '80', groupShowMode: 'always' },
      { name: 'ATTR_03', dataType: 'text', headerText: 'ITEM_ATTR_03', visible: true, editable: false, width: '80', groupShowMode: 'always' },
      { name: 'ATTR_04', dataType: 'text', headerText: 'ITEM_ATTR_04', visible: true, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_05', dataType: 'text', headerText: 'ITEM_ATTR_05', visible: true, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_06', dataType: 'text', headerText: 'ITEM_ATTR_06', visible: true, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_07', dataType: 'text', headerText: 'ITEM_ATTR_07', visible: true, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_08', dataType: 'text', headerText: 'ITEM_ATTR_08', visible: true, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_09', dataType: 'text', headerText: 'ITEM_ATTR_09', visible: true, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_10', dataType: 'text', headerText: 'ITEM_ATTR_10', visible: true, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_11', dataType: 'text', headerText: 'ITEM_ATTR_11', visible: false, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_12', dataType: 'text', headerText: 'ITEM_ATTR_12', visible: false, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_13', dataType: 'text', headerText: 'ITEM_ATTR_13', visible: false, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_14', dataType: 'text', headerText: 'ITEM_ATTR_14', visible: false, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_15', dataType: 'text', headerText: 'ITEM_ATTR_15', visible: false, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_16', dataType: 'text', headerText: 'ITEM_ATTR_16', visible: false, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_17', dataType: 'text', headerText: 'ITEM_ATTR_17', visible: false, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_18', dataType: 'text', headerText: 'ITEM_ATTR_18', visible: false, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_19', dataType: 'text', headerText: 'ITEM_ATTR_19', visible: false, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_20', dataType: 'text', headerText: 'ITEM_ATTR_20', visible: false, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_21', dataType: 'text', headerText: 'ITEM_ATTR_21', visible: false, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_22', dataType: 'text', headerText: 'ITEM_ATTR_22', visible: false, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_23', dataType: 'text', headerText: 'ITEM_ATTR_23', visible: false, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_24', dataType: 'text', headerText: 'ITEM_ATTR_24', visible: false, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ATTR_25', dataType: 'text', headerText: 'ITEM_ATTR_25', visible: false, editable: false, width: '80', groupShowMode: 'expand' }
    ]
  },
  { name: 'BOM_ITEM_TP_ID', dataType: 'text', headerText: 'BOM_ITEM_TP', visible: true, editable: true, width: '120', useDropdown: true, lookupDisplay: true, autoFilter: true },
  { name: 'PROCUR_TP_ID', dataType: 'text', headerText: 'PROCUR_TP', visible: true, editable: true, width: '130', useDropdown: true, lookupDisplay: true, autoFilter: true},
  { name: 'DIFFTD_CLSS_CD', dataType: 'text', headerText: 'DIF_GRADE', visible: true, editable: true, width: '100', useDropdown: true, lookupDisplay: true, autoFilter: true },
  { name: 'DIFFTD_CLSS_CD_NM', dataType: 'text', headerText: 'DIFFTD_CLSS_CD_NM', visible: false, editable: false, width: '80' },
  {
    name: 'NPI_EOL', dataType: 'group', orientation: 'horizontal', headerText: 'NPI_EOL', headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: 'SRA', dataType: 'datetime', headerText: 'SRA', visible: true, editable: true, width: '100', format: 'yyyy-MM-dd', groupShowMode: 'always' },
      { name: 'RTS', dataType: 'datetime', headerText: 'RTS', visible: true, editable: false, width: '100', format: 'yyyy-MM-dd', groupShowMode: 'expand' },
      { name: 'EOP', dataType: 'datetime', headerText: 'EOP', visible: true, editable: true, width: '100', format: 'yyyy-MM-dd', groupShowMode: 'always' },
      { name: 'EOS', dataType: 'datetime', headerText: 'EOS', visible: true, editable: false, width: '100', format: 'yyyy-MM-dd', groupShowMode: 'expand' },
      { name: 'PARENT_ITEM_EOL', dataType: 'datetime', headerText: 'PARENT_ITEM_EOL', visible: true, editable: true, width: '100', format: 'yyyy-MM-dd', groupShowMode: 'always' }
    ]
   },
  {
    name: 'STOCK', dataType: 'group', orientation: 'horizontal', headerText: 'STOCK', headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: 'INV_ONHAND_YN', dataType: 'boolean', headerText: 'STOCK_ONHAND_YN', visible: true, editable: true, width: '100', groupShowMode: 'expand' },
      { name: 'IMMEDIATE_SHIPMENT_YN', dataType: 'boolean', headerText: 'IMMEDIATE_SHIPMENT_YN', visible: true, editable: true, width: '80', groupShowMode: 'expand' },
      { name: 'INV_POLICY', dataType: 'text', headerText: 'STOCK_POLICY', visible: true, editable: true, width: '80', useDropdown: true, lookupDisplay: true, groupShowMode: 'always' },
      { name: 'STD_UTPIC', dataType: 'number', headerText: 'STD_UTPIC', visible: true, editable: true, width: '80', numberFormat: '#,###.###', groupShowMode: 'always' },
      { name: 'MIN_LV', dataType: 'number', headerText: 'MIN_LV', visible: true, editable: true, width: '80', groupShowMode: 'always' },
      { name: 'MAX_LV', dataType: 'number', headerText: 'MAX_LV', visible: true, editable: true, width: '80', groupShowMode: 'always' },
      { name: 'ALLOWED_PUSH_YN', dataType: 'boolean', headerText: 'ALLOWED_PUSH_YN', visible: true, editable: true, width: '80', groupShowMode: 'always' },
      { name: 'PUSH_TP_ID', dataType: 'text', headerText: 'PUSH_TP', visible: true, editable: true, width: '100', useDropdown: true, lookupDisplay: true, groupShowMode: 'expand' },
      { name: 'ALTERNATE_PUSH_POLICY_ID', dataType: 'text', headerText: 'ALTERNATE_PUSH_POLICY', visible: true, editable: true, width: '100', useDropdown: true, lookupDisplay: true, groupShowMode: 'expand' }
    ]
   },
  {
    name: 'PRODTY_COST', dataType: 'group', orientation: 'horizontal', headerText: 'PRODTY_COST', headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: 'DIRECT_COST', dataType: 'number', headerText: 'DIRECT_COST', visible: true, editable: true, width: '80', numberFormat: '#,###.###' },
      { name: 'INDIRECT_COST', dataType: 'number', headerText: 'INDIRECT_COST', visible: true, editable: true, width: '80', numberFormat: '#,###.###' }
    ]
   },
  { name: 'CURCY_CD', dataType: 'text', headerText: 'CURCY_CD', visible: true, editable: true, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'CURCY_CD_NM', dataType: 'text', headerText: 'CURCY_CD_NM', visible: false, editable: false, width: '80' },
  { name: 'ALLOWED_HOLIDAY_YN', dataType: 'boolean', headerText: 'ALLOWED_HOLIDAY_YN', visible: true, editable: true, width: '80' },
  { name: 'DEL_YN', dataType: 'boolean', headerText: 'DEL_YN', visible: true, editable: false, width: '50' },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: true, width: '50' },
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

function SiteItem() {
  const [gridLocationItem, setGridLocationItem] = useState(null);
  const [username] = useUserStore(state => [state.username]);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const locationSearchBoxRef = useRef();
  const itemSearchBoxRef = useRef();

  const [currentLocationRef, setCurrentLocationRef] = useState();
  const [currentItemRef, setCurrentItemRef] = useState();

  const { reset, setValue } = useForm({
    defaultValues: {
      bomItemTpId: '',
      procureTpId: '',
      differentiationClassCd: ''
    }
  });

  const [difGradePopupOpen, setDifGradePopupOpen] = useState(false);
  const [bundleCreatePopupOpen, setBundleCreatePopupOpen] = useState(false);
  const [batchUpdatePopupOpen, setBatchUpdatePopupOpen] = useState(false);
  const [newSiteItemPopupOpen, setNewSiteItemPopupOpen] = useState(false);

  const globalButtons = [
    { name: 'search', action: (e) => { onSubmit() }, visible: true, disable: false },
    { name: 'refresh', action: (e) => { refresh() }, visible: true, disable: false }
  ]

  const exportOptions = {
    headerDepth: 1,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  };

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, 'gridLocationItem');
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        if (gridLocationItem != grdObj1) {
          setGridLocationItem(grdObj1);
        }
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
    if (gridLocationItem) {
      setViewInfo(vom.active, 'globalButtons', globalButtons);

      setOptionGridLocationItem();
      setGridComboList(gridLocationItem,
        'ITEM_TP, BOM_ITEM_TP_ID, PROCUR_TP_ID, DIFFTD_CLSS_CD, UOM_CD, INV_POLICY, PUSH_TP_ID, ALTERNATE_PUSH_POLICY_ID, CURCY_CD',
        'ITEM_TP, BOM_ITEM_TYPE, PROCUREMENT_TYPE, CM_ITEM_SPIM, UOM, CM_BASE_INV_POLICY, PUSH_TP, ALTERNATE_PUSH_POLICY, CURRENCY'
        );
      loadLocationItemData();
    }
  }, [gridLocationItem]);

  function onSetDifGrade(gridRow) {
    setValue('differentiationClassCd', gridRow.CONF_NM);
  }

  function openBundleCreatePopup() {
    setBundleCreatePopupOpen(true);
  }

  function openBatchUpdatePopup() {
    setBatchUpdatePopupOpen(true);
  }

  function openNewSiteItemPopup() {
    setNewSiteItemPopupOpen(true);
  }

  function onClosePopup() {
    loadLocationItemData();
  }

  function onSubmit(data) {
    loadLocationItemData(data);
  };

  function refresh() {
    currentLocationRef.reset();
    currentItemRef.reset();
    reset();
    gridLocationItem.dataProvider.clearRows();
  }

  const setOptionGridLocationItem = () => {
    gridLocationItem.gridView.filteringOptions.automating.lookupDisplay = true;

    gridLocationItem.gridView.setEditOptions({
      insertable: true,
      appendable: true
    })
    gridLocationItem.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridLocationItem, true, true, true);

    gridLocationItem.gridView.setColumnProperty('LOCAT_TP', 'mergeRule', { criteria: 'value' });
    gridLocationItem.gridView.setColumnProperty('LOCAT_LV', 'mergeRule', { criteria: 'value' });
    gridLocationItem.gridView.setColumnProperty('LOCAT_CD', 'mergeRule', { criteria: 'value' });
    gridLocationItem.gridView.setColumnProperty('LOCAT_NM', 'mergeRule', { criteria: 'value' });

    gridLocationItem.gridView.setFixedOptions({colCount: 2, resizable: true});
  }

  function loadLocationItemData() {
    let dataArr;
    let param = new URLSearchParams();

    param.append('LOCAT_TP', currentLocationRef.getLocationType());
    param.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    param.append('LOCAT_CD', currentLocationRef.getLocationCode());
    param.append('LOCAT_NM', currentLocationRef.getLocationName());
    param.append('ITEM_CD', currentItemRef.getItemCode());
    param.append('ITEM_NM', currentItemRef.getItemName());
    param.append('ITEM_TP', currentItemRef.getItemType());
    param.append('BOM_ITEM_TP_ID', '');
    param.append('PROCUR_TP_ID', '');
    param.append('DIFFTD_CLSS_CD', '');
    param.append('ACTV_YN', 'A');
    param.append('timeout', 0);
    param.append('CURRENT_OPERATION_CALL_ID', 'OPC_GRID_LOAD');

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_CM_04_Q1',
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        dataArr = [];
        dataArr = res.data.RESULT_DATA;

        gridLocationItem.dataProvider.fillJsonData(dataArr);

        if (gridLocationItem.dataProvider.getRowCount() == 0) {
          gridLocationItem.gridView.setDisplayOptions({
            showEmptyMessage: true,
            emptyMessage: transLangKey('MSG_NO_DATA')
          });
        }
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function saveData() {
    gridLocationItem.gridView.commit(true);
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridLocationItem.dataProvider.getAllStateRows().created,
          gridLocationItem.dataProvider.getAllStateRows().updated,
          gridLocationItem.dataProvider.getAllStateRows().deleted,
          gridLocationItem.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          let data = gridLocationItem.dataProvider.getJsonRow(row);
          if (data.SRA != null) {
            data.SRA = data.SRA.format('yyyy-MM-ddT00:00:00');
          }
          if (data.EOP != null) {
            data.EOP = data.EOP.format('yyyy-MM-ddT00:00:00');
          }
          if (data.PARENT_ITEM_EOL != null) {
            data.PARENT_ITEM_EOL = data.PARENT_ITEM_EOL.format('yyyy-MM-ddT00:00:00');
          }
          changeRowData.push(data);
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          if (answer) {
            let formData = new FormData();
            formData.append('changes', JSON.stringify(changeRowData));
            formData.append('USER_ID', username);
            formData.append('WRK_TYPE', 'SAVE');
            formData.append('timeout', 0);
            formData.append('CURRENT_OPERATION_CALL_ID', 'OPC_RST_CPT_01_09_01');

            zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_04_S1", formData)
            .then(function (res) {
              if (res.status === gHttpStatus.SUCCESS) {
                const rsData = res.data;
                if (rsData.RESULT_SUCCESS) {
                  const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_04_S1_P_RT_MSG;
                  msg === "MSG_0001" ? loadLocationItemData() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg)); 
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

  function onDelete() {
    gridLocationItem.gridView.commit(true);
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_DELETE'), function (answer) {
      if (answer) {
        let changeRowData = [];

        gridLocationItem.gridView.getCheckedRows().forEach(function (indx) {
          let data = gridLocationItem.dataProvider.getJsonRow(indx);
          if (data.SRA != null) {
            data.SRA = data.SRA.format('yyyy-MM-ddT00:00:00');
          }
          if (data.EOP != null) {
            data.EOP = data.EOP.format('yyyy-MM-ddT00:00:00');
          }
          if (data.PARENT_ITEM_EOL != null) {
            data.PARENT_ITEM_EOL = data.PARENT_ITEM_EOL.format('yyyy-MM-ddT00:00:00');
          }
          changeRowData.push(data);
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SELECT_DELETE'), { close: false });
        } else {
          if (answer) {
            gridLocationItem.gridView.showToast(progressSpinner + 'Deleting data...', true);

            let formData = new FormData();
            formData.append('changes', JSON.stringify(changeRowData));
            formData.append('WRK_TYPE', 'DELETE');
            formData.append('timeout', 0);
            formData.append('CURRENT_OPERATION_CALL_ID', 'OPC_RST_CPT_01_08_01');

            zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_04_S1", formData)
            .then(function (res) {
              if (res.status === gHttpStatus.SUCCESS) {
                const rsData = res.data;
                if (rsData.RESULT_SUCCESS) {
                  const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_04_S1_P_RT_MSG;
                  msg === "MSG_0002" ? loadLocationItemData() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg)); 
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

  const onAfterDelete = (targetGrid) => {
    if (targetGrid.gridId === 'gridLocationItem') {
      loadLocationItemData();
    }
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
        <ButtonArea>
          <LeftButtonArea>
            <GridExcelExportButton type="icon" grid="gridLocationItem" options={exportOptions} />
            {/*<GridExcelImportButton type="icon" grid="gridLocationItem" />*/}
            <CommonButton title={transLangKey("BUNDLE_CREATE")} onClick={() => { openBundleCreatePopup() }}><Icon.File /></CommonButton>
            <CommonButton title={transLangKey("BATCH_UPDATE")} onClick={() => { openBatchUpdatePopup() }}><Icon.Database /></CommonButton>
          </LeftButtonArea>
          <RightButtonArea>
            <GridAddRowButton type="icon" grid="gridLocationItem" onClick={openNewSiteItemPopup}></GridAddRowButton>
            <GridDeleteRowButton type="icon" grid="gridLocationItem" onClick={onDelete} onAfterDelete={onAfterDelete}></GridDeleteRowButton>
            <GridSaveButton  type="icon" onClick={() => { saveData() }}></GridSaveButton>
          </RightButtonArea>
        </ButtonArea>
        <ResultArea>
          <BaseGrid id="gridLocationItem" items={gridLocationItemColumns}></BaseGrid>
        </ResultArea>
      </ContentInner>

      {difGradePopupOpen && (<PopDifGrade open={difGradePopupOpen} onClose={() => { setDifGradePopupOpen(false); }} confirm={onSetDifGrade}></PopDifGrade>)}
      {bundleCreatePopupOpen && (<PopSiteItemBundleCreate open={bundleCreatePopupOpen} onClose={() => { setBundleCreatePopupOpen(false); }} confirm={onClosePopup}></PopSiteItemBundleCreate>)}
      {batchUpdatePopupOpen && (<PopSiteItemBatchUpdate open={batchUpdatePopupOpen} onClose={() => { setBatchUpdatePopupOpen(false); }} confirm={onClosePopup}></PopSiteItemBatchUpdate>)}
      {newSiteItemPopupOpen && (<PopSiteItemNew open={newSiteItemPopupOpen} onClose={() => { setNewSiteItemPopupOpen(false); }} confirm={onClosePopup}></PopSiteItemNew>)}
    </>
  )
}

export default SiteItem
