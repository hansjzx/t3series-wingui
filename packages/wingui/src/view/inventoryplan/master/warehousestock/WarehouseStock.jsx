import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import {
  BaseGrid, ButtonArea, ContentInner, GridExcelExportButton, GridExcelImportButton, GridSaveButton, InputField,
  LeftButtonArea, ResultArea, RightButtonArea, SearchArea, SearchRow, useIconStyles, useUserStore, useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';
import { setGridComboList } from '@wingui/view/supplychainmodel/common/common';

import PopStockType from '@wingui/view/supplychainmodel/common/PopStockType';
import PopAccount from '@wingui/view/supplychainmodel/common/PopAccount';
import PopPeggingAttr from '@wingui/view/supplychainmodel/common/PopPeggingAttr';
import PopWarehouseStock from './PopWarehouseStock';

import ItemSearchBox from '@wingui/view/supplychainmodel/common/ItemSearchBox';
import LocationSearchBox from '@wingui/view/supplychainmodel/common/LocationSearchBox';

import '../../../supplychainmodel/common/common.css';

let gridWarehouseColumns = [
  { name: 'ID', dataType: 'text', headerText: 'ID', visible: false, editable: true, width: 150 },
  { name: 'LOCAT_ITEM_ID', dataType: 'text', headerText: 'LOCAT_ITEM_ID', visible: false, editable: true, width: 150 },
  { name: 'CUTOFF_DATE', dataType: 'datetime', headerText: 'CUTOFF_DATE', visible: false, editable: false, width: '100', format: 'yyyy-MM-dd' },
  { name: 'INV_ID', dataType: 'text', headerText: 'STOCK_ID', visible: true, editable: false, width: 100 },
  {
    name: "LOCATION", dataType: "group", orientation: "horizotal", headerText: "LOCAT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: 'LOCAT_TP_NM', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: 120, groupShowMode: "expand" },
      { name: 'LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: 120, groupShowMode: "expand" },
      { name: 'LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: 120, groupShowMode: "always" },
      { name: 'LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: 120, groupShowMode: "always" }
    ]
  },
  { name: 'WAHOUS_TP_ID', dataType: 'text', headerText: 'LOCAT_NM', visible: false, editable: false, width: 150 },
  { name: 'WAHOUS_TP_NM', dataType: 'text', headerText: 'WAHOUS_TP_NM', visible: true, editable: false, width: 120, autoFilter: true },
  { name: 'LOAD_CAPA_MGMT_BASE', dataType: 'text', headerText: 'LOAD_CAPA_MGMT_BASE', visible: true, editable: false, width: 150, autoFilter: true},
  { name: 'INV_LOCAT_NM', dataType: 'text', headerText: 'STOCK_LOCAT_NM', visible: true, editable: false, width: 180, autoFilter: true },
  { name: 'INV_LOCAT_DESCRIP', dataType: 'text', headerText: 'STOCK_LOCAT_DESCRIP', visible: true, editable: false, width: 180, autoFilter: true },
  {
    name: "ITEM", dataType: "group", orientation: "horizontal", headerText: "ITEM", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: 'ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', visible: true, editable: false, width: 100, groupShowMode: "always" },
      { name: 'ITEM_NM', dataType: 'text', headerText: 'ITEM_NM', visible: true, editable: false, width: 100, groupShowMode: "always" },
      { name: 'ITEM_DESCRIP', dataType: 'text', headerText: 'ITEM_DESCRIP', visible: true, editable: false, width: 100, groupShowMode: "expand" },
      { name: 'ITEM_TP', dataType: 'text', headerText: 'ITEM_TP', visible: true, editable: false, width: 100, groupShowMode: "expand" },
      { name: 'UOM_NM', dataType: 'text', headerText: 'UOM_NM', visible: true, editable: false, width: 80, groupShowMode: "expand" }
    ]
  },
  {
    name: 'STOCK_DATE_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'STOCK_DATE', headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: 'RECEIPT_DATE', dataType: 'datetime', headerText: 'RECEIPT_DATE', visible: true, editable: false, width: 100, format: 'yyyy-MM-dd' },
      { name: 'USABLE_DATE', dataType: 'datetime', headerText: 'USABLE_DATE', visible: true, editable: false, width: 100, format: 'yyyy-MM-dd' },
      { name: 'KEEPING_PERIOD', dataType: 'number', headerText: 'KEEPING_PERIOD', visible: true, editable: true, width: 120, numberFormat: '#,###' },
      { name: 'TIME_UOM', dataType: 'dropdown', headerText: 'TIME_UOM_NM', visible: true, editable: true, width: 80, useDropdown: true, lookupDisplay: true },
      { name: 'EXPIRE_DATE', dataType: 'datetime', headerText: 'EXPIRE_DATE', visible: true, editable: false, width: 100, format: 'yyyy-MM-dd' }
    ]
  },
  {
    name: 'STOCK_QTY_TP_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'STOCK_QTY_TP', headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: 'SQT_01', dataType: 'number', headerText: 'SQT_01', visible: true, editable: false, width: 80 },
      { name: 'SQT_02', dataType: 'number', headerText: 'SQT_02', visible: true, editable: false, width: 80 },
      { name: 'SQT_03', dataType: 'number', headerText: 'SQT_03', visible: true, editable: false, width: 80 },
      { name: 'SQT_04', dataType: 'number', headerText: 'SQT_04', visible: true, editable: false, width: 80 },
      { name: 'SQT_05', dataType: 'number', headerText: 'SQT_05', visible: false, editable: false, width: 80 },
      { name: 'SQT_06', dataType: 'number', headerText: 'SQT_06', visible: false, editable: false, width: 80 },
      { name: 'SQT_07', dataType: 'number', headerText: 'SQT_07', visible: false, editable: false, width: 80 },
      { name: 'SQT_08', dataType: 'number', headerText: 'SQT_08', visible: false, editable: false, width: 80 },
      { name: 'SQT_09', dataType: 'number', headerText: 'SQT_09', visible: false, editable: false, width: 80 },
      { name: 'SQT_10', dataType: 'number', headerText: 'SQT_10', visible: false, editable: false, width: 80 }
    ]
  },
  { name: 'WH_PLANNING', dataType: 'number', headerText: 'WH_PLANNING', visible: true, editable: false, width: 80, button: 'action', buttonVisibility: 'always' },
  { name: 'WH_TOTAL', dataType: 'number', headerText: 'WH_TOTAL', visible: true, editable: false, width: 80 },
  {
    name: 'STOCK_PEG_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'STOCK_PEGGING', headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: 'ACCOUNT_ID', dataType: 'text', headerText: 'ACCOUNT_ID', visible: false, editable: true, width: 120 },
      { name: 'ACCOUNT_CD', dataType: 'text', headerText: 'ACCOUNT_CD', visible: true, editable: true, width: 120, button: 'action', buttonVisibility: 'always' },
      { name: 'ACCOUNT_NM', dataType: 'text', headerText: 'ACCOUNT_NM', visible: true, editable: false, width: 120 },
      { name: 'PEGGING_GRP_ID', dataType: 'text', headerText: 'PEGGING_GRP_ID', visible: false, editable: false, width: 120 },
      { name: 'PEGGING_ATTR', dataType: 'text', headerText: 'PEGGING_ATTR', visible: true, editable: true, width: 160, button: 'action', buttonVisibility: 'always' }
    ]
  },
  { name: 'INV_DEST', dataType: 'text', headerText: 'STOCK_DEST', visible: true, editable: false, width: 120, button: 'action', buttonVisibility: 'always' },
  { name: 'INV_DESTINATION', dataType: 'text', headerText: 'STOCK_DEST', visible: false, editable: false, width: 100 },
  { name: 'LOT_NO', dataType: 'text', headerText: 'LOT_NO', visible: true, editable: false, width: 120 },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: true, width: 50 },
  {
    name: "EDIT", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: 100, groupShowMode: "expand" },
      { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: 150, groupShowMode: "expand" },
      { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 100, groupShowMode: "always" },
      { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 150, groupShowMode: "expand" }
    ]
  }
];

function WarehouseStock() {
  const [gridWarehouse, setGridWarehouse] = useState(null);
  const iconClasses = useIconStyles();
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo])
  const [username] = useUserStore(state => [state.username]);

  const [popupData, setPopupData] = useState({});
  const [stockTypePopupOpen, setStockTypePopupOpen] = useState(false);
  const [accountPopupOpen, setAccountPopupOpen] = useState(false);
  const [peggingAttrPopupOpen, setPeggingAttrPopupOpen] = useState(false);
  const [warehouseStockPopupOpen, setWarehouseStockPopupOpen] = useState(false);

  const locationSearchBoxRef = useRef();
  const itemSearchBoxRef = useRef();

  const [currentLocationRef, setCurrentLocationRef] = useState();
  const [currentItemRef, setCurrentItemRef] = useState();

  const { reset, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      cutoffDate: '',
      baseCutoffDate: ''
    }
  });

  const exportOptions = {
    headerDepth: 1,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  };

  const globalButtons = [
    { name: 'search', action: (e) => { loadData() }, visible: true, disable: false },
    { name: 'refresh', action: (e) => { refresh() }, visible: true, disable: false }
  ]

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
    async function initLoad() {
      setViewInfo(vom.active, 'globalButtons', globalButtons);
      await setCutoffDate();
      await loadData();
    }

    if (gridWarehouse) {
      initLoad();
    }
  }, [gridWarehouse]);

  function afterGridWarehouse(gridObj) {
    setGridWarehouse(gridObj);
    setOptionsGridWarehouse(gridObj);
  }

  function setCutoffDate() {
    let param = new URLSearchParams();

    param.append('TYPE', 'WAREHOUSE_STOCK_CUTOFF_DATE');

    return zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_GET_COMBO_LIST',
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        setValue('cutoffDate', res.data.RESULT_DATA[0].BASE_DATE);
        setValue('baseCutoffDate', res.data.RESULT_DATA[0].BASE_DATE);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function openStockTypePopup() {
    setStockTypePopupOpen(true);
  }

  function openAccountPopup() {
    setAccountPopupOpen(true);
  }

  function onSetAccount(gridRow) {
    let itemIndex = gridWarehouse.gridView.getCurrent().dataRow;

    gridWarehouse.dataProvider.setValue(itemIndex, 'ACCOUNT_ID', gridRow.ACCOUNT_ID);
    gridWarehouse.dataProvider.setValue(itemIndex, 'ACCOUNT_CD', gridRow.ACCOUNT_CD);
    gridWarehouse.dataProvider.setValue(itemIndex, 'ACCOUNT_NM', gridRow.ACCOUNT_NM);
  }

  function openPeggingAttrPopup() {
    setPeggingAttrPopupOpen(true);
  }

  function onSetPeggingAttr(gridRow) {
    let itemIndex = gridWarehouse.gridView.getCurrent().dataRow;

    gridWarehouse.dataProvider.setValue(itemIndex, 'PEGGING_GRP_ID', gridRow.ID);
    gridWarehouse.dataProvider.setValue(itemIndex, 'PEGGING_ATTR', gridRow.PEGGING_ATTR);
  }

  function openWarehouseStockPopup() {
    setWarehouseStockPopupOpen(true);
  }

  function loadData() {
    let param = new URLSearchParams();

    param.append('CUTOFF_DATE', new Date(getValues('cutoffDate')).format('yyyy-MM-ddT00:00:00'));
    param.append('LOCAT_TP', currentLocationRef.getLocationType());
    param.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    param.append('LOCAT_CD', currentLocationRef.getLocationCode());
    param.append('LOCAT_NM', currentLocationRef.getLocationName());
    param.append('ITEM_CD', currentItemRef.getItemCode());
    param.append('ITEM_NM', currentItemRef.getItemName());
    param.append('ITEM_TP', currentItemRef.getItemType());
    param.append('WAHOUS_TP_NM', '');
    param.append('LOAD_CAPA_MGMT_BASE', '');
    param.append('STOCK_LOCAT_DESCRIP', '');

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_IM_12_Q1',
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridWarehouse.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function saveData() {
    gridWarehouse.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridWarehouse.dataProvider.getAllStateRows().created,
          gridWarehouse.dataProvider.getAllStateRows().updated,
          gridWarehouse.dataProvider.getAllStateRows().deleted,
          gridWarehouse.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          changeRowData.push(gridWarehouse.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          let param = new URLSearchParams();

          param.append('changes', JSON.stringify(changeRowData));
          param.append('USER_ID', username);

          zAxios({
            method: 'post',
            header: { 'content-type': 'application/json' },
            url: baseURI() + 'engine/mp/SRV_UI_IM_12_S1',
            params: param
          })
          .then(function (res) {
            if (res.status === gHttpStatus.SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_IM_12_S1_P_RT_MSG), { close: false });
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

  function refresh() {
    setValue('cutoffDate', getValues('baseCutoffDate'));
    currentLocationRef.reset();
    currentItemRef.reset();
    gridWarehouse.dataProvider.clearRows();
  }

  function setOptionsGridWarehouse(gridObj) {
    setVisibleProps(gridObj, true, true, false);
    gridObj.gridView.setDisplayOptions({
      fitStyle: 'fill'
    });

    gridObj.gridView.onCellButtonClicked = function (currentGrid, clickData, column) {
      gridObj.gridView.commit(true);
      if (column.fieldName === 'WH_PLANNING') {
        let selectData = currentGrid.getValues(clickData.itemIndex);
        setPopupData({
          cutoffDate: getValues('cutoffDate'),
          mstId: selectData.ID,
          param: 'warehouse'
        });
        openStockTypePopup();
      } else if (column.fieldName === 'ACCOUNT_CD') {
        setPopupData(currentGrid.getValues(clickData.itemIndex));
        openAccountPopup();
      } else if (column.fieldName === 'PEGGING_ATTR') {
        setPopupData(currentGrid.getValues(clickData.itemIndex));
        openPeggingAttrPopup();
      } else if (column.fieldName === 'INV_DEST') {
        setPopupData(currentGrid.getValues(clickData.itemIndex));
        openWarehouseStockPopup();
      }
    }

    const stockDestinationCellStyleCallback = function (grid, cell) {
      if (gridObj.dataProvider.getValue(cell.item.dataRow, 'INV_DESTINATION') === 'BROWN') {
        return { styleName: 'not-exist-stock-destination-cell-bg' }
      } else {
        return { styleName: 'exist-stock-destination-cell-bg' }
      }
    };

    gridObj.gridView.columnByName('INV_DEST').styleCallback = stockDestinationCellStyleCallback;

    setGridComboList(gridObj, 'TIME_UOM', 'TIME_UOM');
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <InputField type="datetime" name="cutoffDate" label={transLangKey("CUTOFF_DATE")} dateformat="yyyy-MM-dd" control={control} />
            <LocationSearchBox ref={locationSearchBoxRef} keyValue={'locationName'} placeHolder={transLangKey("LOCAT_NM")} />
            <ItemSearchBox ref={itemSearchBoxRef} keyValue={'itemName'} placeHolder={transLangKey("ITEM_NM")} />
          </SearchRow>
        </SearchArea>
        <ButtonArea>
          <LeftButtonArea>
            <GridExcelExportButton type="icon" grid="gridWarehouse" options={exportOptions} />
          </LeftButtonArea>
          <RightButtonArea>
            <GridSaveButton title={transLangKey('SAVE')} onClick={() => { saveData() }} />
          </RightButtonArea>
        </ButtonArea>
        <ResultArea>
          <Box sx={{ display: "flex", height: "100%", flexDirection: "column", alignContent: "stretch", alignItems: "stretch" }}>
            <Box style={{ height: "100%" }}>
              <BaseGrid id="gridWarehouse" items={gridWarehouseColumns} afterGridCreate={afterGridWarehouse} />
            </Box>
          </Box>
        </ResultArea>
      </ContentInner>

      {stockTypePopupOpen && <PopStockType id="popStockType" open={stockTypePopupOpen} onClose={() => { setStockTypePopupOpen(false) }} confirm={loadData} data={popupData} />}
      <PopAccount id="popAccount" open={accountPopupOpen} onClose={() => { setAccountPopupOpen(false) }} confirm={onSetAccount} />
      <PopPeggingAttr id="popPeggingAttr" open={peggingAttrPopupOpen} onClose={() => { setPeggingAttrPopupOpen(false) }} confirm={onSetPeggingAttr} data={popupData} type="warehouse" />
      <PopWarehouseStock id="popWarehouseStock" open={warehouseStockPopupOpen} onClose={() => { setWarehouseStockPopupOpen(false) }} data={popupData} confirm={loadData} />
    </>
  )
}

export default WarehouseStock;
