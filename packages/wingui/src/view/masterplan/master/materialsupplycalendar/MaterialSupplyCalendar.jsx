import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { ContentInner, SearchArea, SearchRow, ButtonArea, LeftButtonArea, GridExcelExportButton, InputField, BaseGrid, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import LocationSearchBox from '@wingui/view/supplychainmodel/common/LocationSearchBox';
import ItemSearchBox from '@wingui/view/supplychainmodel/common/ItemSearchBox';

let gridCalendarColumns = [
  { name: 'LOCATION_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'LOCAT', expandable: true, expanded: false,
    childs: [
      { name: 'LOCAT_TP_NM', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: 120, groupShowMode: 'expand' },
      { name: 'LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: 120, groupShowMode: 'expand' },
      { name: 'LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: 120, groupShowMode: 'always' },
      { name: 'LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: 120, groupShowMode: 'always' }
    ]
  },
  { name: 'ITEM_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'ITEM', expandable: true, expanded: false,
    childs: [
      { name: 'ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', visible: true, editable: false, width: '80', groupShowMode: 'always' },
      { name: 'ITEM_NM', dataType: 'text', headerText: 'ITEM_NM', visible: true, editable: false, width: '120', groupShowMode: 'always' },
      { name: 'DESCRIP', dataType: 'text', headerText: 'ITEM_DESCRIP', visible: false, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'UOM_NM', dataType: 'text', headerText: 'UOM_NM', visible: true, editable: false, width: '80', groupShowMode: 'expand' }
    ]
  },
  { name: 'VENDOR_DESCRIP', dataType: 'text', headerText: 'VENDOR_DESCRIP', visible: true, editable: false, width: '100' },
  { name: 'PO_NO', dataType: 'text', headerText: 'PO_NO', visible: true, editable: false, width: '100', autoFilter: true },
  { name: 'BOOKING_DATE', dataType: 'datetime', headerText: 'BOOKING_DATE', visible: true, editable: false, width: '100', format:'yyyy-MM-dd' },
  { name: 'ETD', dataType: 'datetime', headerText: 'ETD', visible: true, editable: false, width: '100', format:'yyyy-MM-dd' },
  { name: 'ATD', dataType: 'datetime', headerText: 'ATD', visible: true, editable: false, width: '100', format:'yyyy-MM-dd' },
  { name: 'ETA', dataType: 'datetime', headerText: 'ETA', visible: true, editable: false, width: '100', format:'yyyy-MM-dd' },
  { name: 'ATA', dataType: 'datetime', headerText: 'ATA', visible: true, editable: false, width: '100', format:'yyyy-MM-dd' },
  { name: 'GR_QTY', dataType: 'number', headerText: 'GR_QTY', visible: true, editable: false, width: '100' },
  { name: 'GR_AMT', dataType: 'number', headerText: 'GR_AMT', visible: true, editable: false, width: '100' },
  { name: 'WAHOUS_TP_NM', dataType: 'String', headerText: 'WAHOUS_TP_NM', visible: true, editable: false, width: '100' },
  { name: 'STOCK_LOCAT_NM', dataType: 'text', headerText: 'STOCK_LOCAT_NM', visible: true, editable: false, width: '100' },
  { name: 'STOCK_LOCAT_DESCRIP', dataType: 'text', headerText: 'STOCK_LOCAT_DESCRIP', visible: true, editable: false, width: '100' },
  { name: 'INVOICE_NO', dataType: 'text', headerText: 'INVOICE_NO', visible: true, editable: false, width: '100', autoFilter: true },
  { name: 'CONTAINER_NO', dataType: 'text', headerText: 'CONTAINER_NO', visible: true, editable: false, width: '120', autoFilter: true },
  { name: 'CREATE_BY', dataType: 'text', headerText: 'CREATE_BY', visible: true, editable: false, width: '100' },
  { name: 'CREATE_DTTM', dataType: 'datetime', headerText: 'CREATE_DTTM', visible: true, editable: false, width: '120' }
];

function MaterialSupplyCalendar() {
  const [gridCalendar, setGridCalendar] = useState(null);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const locationSearchBoxRef = useRef();
  const itemSearchBoxRef = useRef();

  const [currentLocationRef, setCurrentLocationRef] = useState();
  const [currentItemRef, setCurrentItemRef] = useState();

  const { reset, getValues, setValue, control } = useForm({
    defaultValues: { }
  });

  const globalButtons = [
    { name: 'search', action: (e) => { onSubmit() }, visible: true, disable: false },
    { name: 'refresh', action: (e) => { refresh() }, visible: true, disable: false }
  ]

  const exportExcelOptions = {
    headerDepth: 1,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: true
  };

  useEffect(() => {
    const grdObj = getViewInfo(vom.active, 'gridCalendar');

    if (grdObj) {
      if (grdObj.dataProvider) {
        if (gridCalendar !== grdObj) {
          setGridCalendar(grdObj);
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
    async function initLoad() {
      if (gridCalendar) {
        setViewInfo(vom.active, 'globalButtons', globalButtons);
        setOptionsGridCalendar();
        await setCombo();
        await loadMaterialSupplyCalendar();
      }
    }

    initLoad();
  }, [gridCalendar]);

  function setCombo() {
    let formData = new FormData();

    formData.append('TYPE', 'MAT_SUPPLY_CAL_CUTOFF_DATE');

    return zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_GET_COMBO_LIST',
      data: formData
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        setValue('cutoffDate', res.data.RESULT_DATA[0].BASE_DATE);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function setOptionsGridCalendar() {
    setVisibleProps(gridCalendar, true, true, true);

    gridCalendar.gridView.setDisplayOptions({ fitStyle: 'fill' });

    gridCalendar.gridView.setColumnProperty("LOCAT_TP_NM", "mergeRule", { criteria: "value" });

    let columnArr = ["LOCAT_LV", "LOCAT_CD", "LOCAT_NM"];
    for (let i = 0; i < columnArr.length; i++) {
      gridCalendar.gridView.setColumnProperty(columnArr[i], "mergeRule", {
        criteria: "prevvalues + values[ '" + columnArr[i] + "' ]"
      });
    }

    gridCalendar.gridView.setFixedOptions({ colCount: 2, resizable: true });

    wingui.util.grid.sorter.orderBy(gridCalendar.gridView, ['LOCAT_TP_NM', 'LOCAT_LV', 'LOCAT_CD', 'LOCAT_NM']);
  }

  function onSubmit() {
    loadMaterialSupplyCalendar();
  }

  function refresh() {
    setCombo();
    reset();
    currentItemRef.reset();
    currentLocationRef.reset();

    gridCalendar.dataProvider.clearRows();
  }

  function loadMaterialSupplyCalendar() {
    let formData = new FormData();

    formData.append('CUTOFF_DATE', new Date(getValues('cutoffDate')).format('yyyy-MM-ddT00:00:00'));
    formData.append('LOCAT_TP', currentLocationRef.getLocationType());
    formData.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    formData.append('LOCAT_CD', currentLocationRef.getLocationCode());
    formData.append('LOCAT_NM', currentLocationRef.getLocationName());
    formData.append('ITEM_CD', currentItemRef.getItemCode());
    formData.append('ITEM_NM', currentItemRef.getItemName());
    formData.append('PO_NO', '');
    formData.append('INVOICE_NO', '');
    formData.append('CONTAINER_NO', '');
    formData.append('ETA_FROM_DATE', '');
    formData.append('ETA_TO_DATE', '');
    formData.append('ATA_FROM_DATE', '');
    formData.append('ATA_TO_DATE', '');

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_18_Q1',
      data: formData
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridCalendar.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <InputField type="datetime" name="cutoffDate" label={transLangKey("CUTOFF_DATE")} dateformat="yyyy-MM-dd" control={control} />
            <LocationSearchBox ref={locationSearchBoxRef} keyValue={'locationName'} placeHolder={transLangKey("LOCAT_NM")} style={{width: 300}}/>
            <ItemSearchBox ref={itemSearchBoxRef} keyValue={'itemName'} placeHolder={transLangKey("ITEM_NM")} fields={['itemCode', 'itemName']} style={{width: 300, popoverHeight:200}} url="SRV_UI_MP_05_Q2" />
          </SearchRow>
        </SearchArea>

        <ButtonArea>
          <LeftButtonArea>
            <GridExcelExportButton type='icon' grid='gridCalendar' options={exportExcelOptions} />
            {/*<GridExcelImportButton type='icon' grid='gridCalendar' />*/}
          </LeftButtonArea>
        </ButtonArea>
        <Box style={{ height: 'calc(100% - 90px)' }}>
          <BaseGrid id='gridCalendar' items={gridCalendarColumns} />
        </Box>
      </ContentInner>
    </>
  )
}

export default MaterialSupplyCalendar;
