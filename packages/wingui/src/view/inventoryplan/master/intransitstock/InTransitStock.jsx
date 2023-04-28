import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import {
  BaseGrid, ButtonArea, ContentInner, GridExcelExportButton, GridSaveButton, InputField, LeftButtonArea, ResultArea,
  RightButtonArea, SearchArea, SearchRow, useUserStore, useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';
import { setGridComboList } from "@wingui/view/supplychainmodel/common/common";

import PopStockType from '@wingui/view/supplychainmodel/common/PopStockType';
import PopAccount from '@wingui/view/supplychainmodel/common/PopAccount';
import PopPeggingAttr from '@wingui/view/supplychainmodel/common/PopPeggingAttr';

import ItemSearchBox from '@wingui/view/supplychainmodel/common/ItemSearchBox';
import LocationSearchBox from '@wingui/view/supplychainmodel/common/LocationSearchBox';

let gridInTransitColumns = [
  { name: 'ID', dataType: 'text', headerText: 'ID', visible: false, editable: false, width: '150' },
  { name: 'LOCAT_ITEM_ID', dataType: 'text', headerText: 'LOCAT_ITEM_ID', visible: false, editable: true, width: '150' },
  { name: 'INTRANSIT_STOCK_DTL_ID', dataType: 'text', headerText: 'INTRANSIT_STOCK_DTL_ID', visible: false, editable: false, width: '150' },
  { name: 'CUTOFF_DATE', dataType: 'datetime', headerText: 'CUTOFF_DATE', visible: false, editable: false, width: '100', format: 'yyyy-MM-dd' },
  { name: 'INV_ID', dataType: 'text', headerText: 'STOCK_ID', visible: true, editable: false, width: '120' },
  {
    name: 'FROM_LOCAT_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'FROM_LOCAT', headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: 'FROM_LOCAT_TP_NM', dataType: 'text', headerText: 'FROM_LOCAT_TP_NM', visible: true, editable: false, width: '120', groupShowMode: 'expand' },
      { name: 'FROM_LOCAT_LV', dataType: 'text', headerText: 'FROM_LOCAT_LV', visible: true, editable: false, width: '120', groupShowMode: 'expand' },
      { name: 'FROM_LOCAT_CD', dataType: 'text', headerText: 'FROM_LOCAT_CD', visible: true, editable: false, width: '120', groupShowMode: 'always' },
      { name: 'FROM_LOCAT_NM', dataType: 'text', headerText: 'FROM_LOCAT_NM', visible: true, editable: false, width: '120', groupShowMode: 'always' }
    ]
  },
  {
    name: 'TO_LOCAT_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'TO_LOCAT', headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: 'TO_LOCAT_TP_NM', dataType: 'text', headerText: 'TO_LOCAT_TP_NM', visible: true, editable: false, width: '120', groupShowMode: 'expand' },
      { name: 'TO_LOCAT_LV', dataType: 'text', headerText: 'TO_LOCAT_LV', visible: true, editable: false, width: '120', groupShowMode: 'expand' },
      { name: 'TO_LOCAT_CD', dataType: 'text', headerText: 'TO_LOCAT_CD', visible: true, editable: false, width: '120', groupShowMode: 'always' },
      { name: 'TO_LOCAT_NM', dataType: 'text', headerText: 'TO_LOCAT_NM', visible: true, editable: false, width: '120', groupShowMode: 'always' }
    ]
  },
  { name: 'VEHICL_VAL', dataType: 'text', headerText: 'VEHICL_VAL', visible: true, editable: false, width: '120', autoFilter: true },
  { name: 'BOD_LEADTIME', dataType: 'text', headerText: 'BOD_LEADTIME', visible: true, editable: false, width: '80' },
  { name: 'WAHOUS_TP_NM', dataType: 'text', headerText: 'WAHOUS_TP_NM', visible: true, editable: false, width: '150', autoFilter: true },
  { name: 'LOAD_CAPA_MGMT_BASE', dataType: 'text', headerText: 'LOAD_CAPA_MGMT_BASE', visible: true, editable: false, width: '150', autoFilter: true },
  { name: 'INV_LOCAT_NM', dataType: 'text', headerText: 'STOCK_LOCAT_NM', visible: true, editable: false, width: '180', autoFilter: true },
  { name: 'INV_LOCAT_DESCRIP', dataType: 'text', headerText: 'STOCK_LOCAT_DESCRIP', visible: true, editable: false, width: '180', autoFilter: true },
  {
    name: "ITEM", dataType: "group", orientation: "horizontal", headerText: "ITEM", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: 'ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', visible: true, editable: false, width: '100', groupShowMode: 'always' },
      { name: 'ITEM_NM', dataType: 'text', headerText: 'ITEM_NM', visible: true, editable: false, width: '100', groupShowMode: 'always' },
      { name: 'ITEM_TP', dataType: 'text', headerText: 'ITEM_TP', visible: true, editable: false, width: '100', groupShowMode: 'expand' },
      { name: 'UOM_NM', dataType: 'text', headerText: 'UOM_NM', visible: true, editable: false, width: '60', groupShowMode: 'expand' }
    ]
  },
  {
    name: 'STOCK_DATE_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'STOCK_DATE', headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: 'SHPP_DATE', dataType: 'datetime', headerText: 'SHIPPING_DATE', visible: true, editable: false, width: '120', format: 'yyyy-MM-dd' },
      { name: 'ETD', dataType: 'datetime', headerText: 'ETD', visible: true, editable: false, width: '120', format: 'yyyy-MM-dd' },
      { name: 'ESTIMT_USABLE_DATE', dataType: 'datetime', headerText: 'ESTIMT_USABLE_DATE', visible: true, editable: false, width: '150', format: 'yyyy-MM-dd' },
      { name: 'KEEPING_PERIOD', dataType: 'number', headerText: 'KEEPING_PERIOD', visible: true, editable: true, width: '120', numberFormat: '#,###' },
      { name: 'TIME_UOM', dataType: 'text', headerText: 'TIME_UOM_NM', visible: true, editable: true, width: '80', useDropdown: true, lookupDisplay: true },
      { name: 'EXPIRE_DATE', dataType: 'datetime', headerText: 'EXPIRE_DATE', visible: true, editable: false, width: '120', format: 'yyyy-MM-dd' }
    ]
  },
  {
    name: 'STOCK_QTY_TP_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'STOCK_QTY_TP', headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: 'IT_AVALIABLE', dataType: 'number', headerText: 'IT_AVALIABLE', visible: true, editable: false, width: '80', numberFormat: '#,###' },
      { name: 'IT_PLANNING', dataType: 'number', headerText: 'IT_PLANNING', visible: true, editable: false, width: '80', numberFormat: '#,###', button: 'action', buttonVisibility: 'always' },
      { name: 'IT_TOTAL', dataType: 'number', headerText: 'IT_TOTAL', visible: true, editable: false, width: '80', numberFormat: '#,###' },
      { name: 'SQT_11', dataType: 'number', headerText: 'SQT_11', visible: false, editable: false, width: 80 },
      { name: 'SQT_12', dataType: 'number', headerText: 'SQT_12', visible: false, editable: false, width: 80 },
      { name: 'SQT_13', dataType: 'number', headerText: 'SQT_13', visible: false, editable: false, width: 80 },
      { name: 'SQT_14', dataType: 'number', headerText: 'SQT_14', visible: false, editable: false, width: 80 },
      { name: 'SQT_15', dataType: 'number', headerText: 'SQT_15', visible: false, editable: false, width: 80 },
      { name: 'SQT_16', dataType: 'number', headerText: 'SQT_16', visible: false, editable: false, width: 80 },
      { name: 'SQT_17', dataType: 'number', headerText: 'SQT_17', visible: false, editable: false, width: 80 },
      { name: 'SQT_18', dataType: 'number', headerText: 'SQT_18', visible: false, editable: false, width: 80 },
      { name: 'SQT_19', dataType: 'number', headerText: 'SQT_19', visible: false, editable: false, width: 80 },
      { name: 'SQT_20', dataType: 'number', headerText: 'SQT_20', visible: false, editable: false, width: 80 }
    ]
  },
  { name: 'ACCOUNT_ID', dataType: 'text', headerText: 'ACCOUNT_ID', visible: false, editable: false, width: '150' },
  {
    name: 'STOCK_PEGGING_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'STOCK_PEGGING', headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: 'ACCOUNT_CD', dataType: 'text', headerText: 'ACCOUNT_CD', visible: true, editable: true, width: '120', button:'action', buttonVisibility: 'always' },
      { name: 'ACCOUNT_NM', dataType: 'text', headerText: 'ACCOUNT_NM', visible: true, editable: false, width: '150' },
      { name: 'PEGGING_GRP_ID', dataType: 'text', headerText: 'PEGGING_GRP_ID', visible: false, editable: false, width: '150' },
      { name: 'PEGGING_ATTR', dataType: 'text', headerText: 'PEGGING_ATTR', visible: true, editable: true, width: '150', button:'action', buttonVisibility: 'always' }
    ]
  },
  { name: 'PO_NO', dataType: 'text', headerText: 'PO_NO', visible: true, editable: false, width: '150' },
  { name: 'INVOICE_NO', dataType: 'text', headerText: 'INVOICE_NO', visible: true, editable: false, width: '150' },
  { name: 'CONTAINER_NO', dataType: 'text', headerText: 'CONTAINER_NO', visible: true, editable: false, width: '150' },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: true, width: '60' },
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

function InTransitStock() {
  const [gridInTransit, setGridInTransit] = useState(null);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [username] = useUserStore(state => [state.username]);

  const locationSearchBoxRef = useRef();
  const itemSearchBoxRef = useRef();

  const [currentLocationRef, setCurrentLocationRef] = useState();
  const [currentItemRef, setCurrentItemRef] = useState();

  const [popupData, setPopupData] = useState({});
  const [stockTypePopupOpen, setStockTypePopupOpen] = useState(false);
  const [accountPopupOpen, setAccountPopupOpen] = useState(false);
  const [peggingAttributePopupOpen, setPeggingAttributePopupOpen] = useState(false);

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

    if (gridInTransit) {
      initLoad();
    }
  }, [gridInTransit]);

  function afterGridInTransit(gridObj) {
    setGridInTransit(gridObj);
    setGridInTransitOptions(gridObj);
  }

  function openStockTypePopup() {
    setStockTypePopupOpen(true);
  }

  function openAccountPopup() {
    setAccountPopupOpen(true);
  }

  function onSetAccount(gridRow) {
    let itemIndex = gridInTransit.gridView.getCurrent().dataRow;

    gridInTransit.dataProvider.setValue(itemIndex, 'ACCOUNT_ID', gridRow.ACCOUNT_ID);
    gridInTransit.dataProvider.setValue(itemIndex, 'ACCOUNT_CD', gridRow.ACCOUNT_CD);
    gridInTransit.dataProvider.setValue(itemIndex, 'ACCOUNT_NM', gridRow.ACCOUNT_NM);
  }

  function openPeggingAttributePopup() {
    setPeggingAttributePopupOpen(true);
  }

  function onSetPeggingAttribute(gridRow) {
    let itemIndex = gridInTransit.gridView.getCurrent().dataRow;

    gridInTransit.dataProvider.setValue(itemIndex, 'PEGGING_GRP_ID', gridRow.ID);
    gridInTransit.dataProvider.setValue(itemIndex, 'PEGGING_ATTR', gridRow.PEGGING_ATTR);
  }

  function refresh() {
    setValue('cutoffDate', getValues('baseCutoffDate'));
    currentLocationRef.reset();
    currentItemRef.reset();
    gridInTransit.dataProvider.clearRows();
  }

  function setGridInTransitOptions(gridObj) {
    setVisibleProps(gridObj, true, true, false);
    gridObj.gridView.setDisplayOptions({
      fitStyle: 'fill'
    });

    gridObj.gridView.onCellButtonClicked = function (grid, clickData, column) {
      grid.commit(true);

      if (column.fieldName === 'IT_PLANNING') {
        let selectData = grid.getValues(clickData.itemIndex);
        setPopupData({
          cutoffDate: getValues('cutoffDate'),
          locationItemId: selectData.LOCAT_ITEM_ID,
          mstId: selectData.ID,
          param: 'intransit'
        });
        openStockTypePopup();
      } else if (column.fieldName === 'ACCOUNT_CD') {
        setPopupData(grid.getValues(clickData.itemIndex));
        openAccountPopup();
      } else if (column.fieldName === 'PEGGING_ATTR') {
        setPopupData(grid.getValues(clickData.itemIndex));
        openPeggingAttributePopup();
      }
    }

    setGridComboList(gridObj, 'TIME_UOM', 'TIME_UOM');
  }

  function setCutoffDate() {
    let param = new URLSearchParams();

    param.append('TYPE', 'INTANSIT_STOCK_CUTOFF_DATE');

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
    param.append('timeout', 0);
    param.append('CURRENT_OPERATION_CALL_ID', 'OPC_GRID_LOAD');

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_IM_13_Q1',
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridInTransit.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function saveData() {
    gridInTransit.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridInTransit.dataProvider.getAllStateRows().created,
          gridInTransit.dataProvider.getAllStateRows().updated,
          gridInTransit.dataProvider.getAllStateRows().deleted,
          gridInTransit.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          changeRowData.push(gridInTransit.dataProvider.getJsonRow(row));
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
            url: baseURI() + 'engine/mp/SRV_UI_IM_13_S1',
            params: param
          })
          .then(function (res) {
            if (res.status === gHttpStatus.SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_IM_13_S1_P_RT_MSG), { close: false });
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
            <InputField type="datetime" name="cutoffDate" label={transLangKey("CUTOFF_DATE")} dateformat="yyyy-MM-dd" control={control} />
            <LocationSearchBox ref={locationSearchBoxRef} keyValue={'locationName'} placeHolder={transLangKey("LOCAT_NM")} />
            <ItemSearchBox ref={itemSearchBoxRef} keyValue={'itemName'} placeHolder={transLangKey("ITEM_NM")} />
          </SearchRow>
        </SearchArea>
        <ButtonArea>
          <LeftButtonArea>
            <GridExcelExportButton type="icon" grid="gridInTransit" options={exportOptions} />
          </LeftButtonArea>
          <RightButtonArea>
            <GridSaveButton title={transLangKey('SAVE')} onClick={() => { saveData() }}></GridSaveButton>
          </RightButtonArea>
        </ButtonArea>
        <ResultArea>
          <Box sx={{ display: "flex", height: "100%", flexDirection: "column", alignContent: "stretch", alignItems: "stretch" }}>
            <Box style={{ height: "100%" }}>
              <BaseGrid id="gridInTransit" items={gridInTransitColumns} afterGridCreate={afterGridInTransit} />
            </Box>
          </Box>
        </ResultArea>
      </ContentInner>

      {stockTypePopupOpen && <PopStockType id="popStockType" open={stockTypePopupOpen} onClose={() => { setStockTypePopupOpen(false) }} confirm={loadData} data={popupData} />}
      <PopAccount id="popAccount" open={accountPopupOpen} onClose={() => { setAccountPopupOpen(false) }} confirm={onSetAccount} />
      <PopPeggingAttr id="popPeggingAttr" open={peggingAttributePopupOpen} onClose={() => { setPeggingAttributePopupOpen(false) }} confirm={onSetPeggingAttribute} data={popupData} type="intransit" />
    </>
  )
}

export default InTransitStock;
