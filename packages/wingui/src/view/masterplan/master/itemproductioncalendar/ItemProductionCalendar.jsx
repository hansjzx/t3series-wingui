import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import {
  ContentInner, SearchArea, SearchRow, ButtonArea, LeftButtonArea, RightButtonArea, GridExcelExportButton,  GridSaveButton,
  GridDeleteRowButton, CommonButton, InputField, BaseGrid, useUserStore, useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';

import ItemSearchBox from '@wingui/view/supplychainmodel/common/ItemSearchBox';
import LocationSearchBox from '@wingui/view/supplychainmodel/common/LocationSearchBox';
import PopCommResource from '@wingui/view/supplychainmodel/common/PopCommResource';

import PopItemProductionCalendarBundleCreate from './PopItemProductionCalendarBundleCreate';

let gridProdCalendarColumns = [
  { name: 'LOCAT_MST_ID', dataType: 'text', headerText: 'LOCAT_MST_ID', visible: false, editable: false, width: 100 },
  { name: 'LOCAT_TP_NM', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: 80, groups: "LOCAT", groupShowMode: 'expand' },
  { name: 'LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: 80, groups: "LOCAT", groupShowMode: 'expand' },
  { name: 'LOCAT_LV_DESCRIP', dataType: 'text', headerText: 'LOCAT_LV_DESCRIP', visible: false, editable: false, width: 100, groups: "LOCAT", groupShowMode: 'expand' },
  { name: 'DMND_INTG_YN', dataType: 'boolean', headerText: 'DMND_INTG_YN', visible: false, editable: false, width: 100, type: 'bool', groups: "LOCAT", groupShowMode: 'expand' },
  { name: 'LOCAT_ID', dataType: 'text', headerText: 'LOCAT_ID', visible: false, editable: false, width: 100, groups: "LOCAT", groupShowMode: 'expand' },
  { name: 'LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: 80, groups: "LOCAT", groupShowMode: 'always' },
  { name: 'LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: 140, groups: "LOCAT", groupShowMode: 'always' },
  { name: 'ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', visible: true, editable: false, width: 100, groups: "ITEM", groupShowMode: 'always' },
  { name: 'ITEM_NM', dataType: 'text', headerText: 'ITEM_NM', visible: true, editable: false, width: 140, groups: "ITEM", groupShowMode: 'always' },
  { name: 'DESCRIP', dataType: 'text', headerText: 'DESCRIP', visible: false, editable: false, width: 100, groups: "ITEM", groupShowMode: 'expand' },
  { name: 'ITEM_TP', dataType: 'text', headerText: 'ITEM_TP', visible: true, editable: false, width: 100, groups: "ITEM", groupShowMode: 'expand' },
  { name: 'ROUTE_CD', dataType: 'text', headerText: 'ROUTE_CD', visible: true, editable: false, width: '100', autoFilter: true },
  { name: 'ROUTE_DESCRIP', dataType: 'text', headerText: 'ROUTE_DESCRIP', visible: false, editable: false, width: '100', autoFilter: true },
  { name: 'ATTR_01', dataType: 'text', headerText: 'ATTR_01', visible: true, editable: false, width: '100' },
  { name: 'ATTR_02', dataType: 'text', headerText: 'ATTR_02', visible: true, editable: false, width: '100' },
  { name: 'ATTR_03', dataType: 'text', headerText: 'ATTR_03', visible: false, editable: false, width: '100' },
  { name: 'ATTR_04', dataType: 'text', headerText: 'ATTR_04', visible: false, editable: false, width: '100' },
  { name: 'ATTR_05', dataType: 'text', headerText: 'ATTR_05', visible: false, editable: false, width: '100' },
  { name: 'ATTR_06', dataType: 'text', headerText: 'ATTR_06', visible: false, editable: false, width: '100' },
  { name: 'ATTR_07', dataType: 'text', headerText: 'ATTR_07', visible: false, editable: false, width: '100' },
  { name: 'ATTR_08', dataType: 'text', headerText: 'ATTR_08', visible: false, editable: false, width: '100' },
  { name: 'ATTR_09', dataType: 'text', headerText: 'ATTR_09', visible: false, editable: false, width: '100' },
  { name: 'ATTR_10', dataType: 'text', headerText: 'ATTR_10', visible: false, editable: false, width: '100' },
  { name: 'ATTR_11', dataType: 'text', headerText: 'ATTR_11', visible: false, editable: false, width: '100' },
  { name: 'ATTR_12', dataType: 'text', headerText: 'ATTR_12', visible: false, editable: false, width: '100' },
  { name: 'ATTR_13', dataType: 'text', headerText: 'ATTR_13', visible: false, editable: false, width: '100' },
  { name: 'ATTR_14', dataType: 'text', headerText: 'ATTR_14', visible: false, editable: false, width: '100' },
  { name: 'ATTR_15', dataType: 'text', headerText: 'ATTR_15', visible: false, editable: false, width: '100' },
  { name: 'ATTR_16', dataType: 'text', headerText: 'ATTR_16', visible: false, editable: false, width: '100' },
  { name: 'ATTR_17', dataType: 'text', headerText: 'ATTR_17', visible: false, editable: false, width: '100' },
  { name: 'ATTR_18', dataType: 'text', headerText: 'ATTR_18', visible: false, editable: false, width: '100' },
  { name: 'ATTR_19', dataType: 'text', headerText: 'ATTR_19', visible: false, editable: false, width: '100' },
  { name: 'ATTR_20', dataType: 'text', headerText: 'ATTR_20', visible: false, editable: false, width: '100' },
  { name: 'RES_CD', dataType: 'text', headerText: 'RES_CD', visible: true, editable: false, width: 100 },
  { name: 'RES_DESCRIP', dataType: 'text', headerText: 'RES_DESCRIP', visible: true, editable: false, width: 150 },
  { name: 'ITEM_RES_PREF_MST_ID', dataType: 'text', headerText: 'ITEM_RES_PREF_MST_ID', visible: false, editable: false, width: '100' },
  { name: 'YYYYMMDD', dataType: 'boolean', headerText: 'YYYYMMDD', visible: true, editable: true, width: '100', type: 'bool', iteration: { prefix: 'YYYYMMDD_', prefixRemove: 'true' } }
];

function ItemProductionCalendar() {
  const [username] = useUserStore(state => [state.username]);
  const [gridProdCalendar, setGridProdCalendar] = useState(null);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const locationSearchBoxRef = useRef();
  const [currentLocationRef, setCurrentLocationRef] = useState();

  const itemSearchBoxRef = useRef();
  const [currentItemRef, setCurrentItemRef] = useState();

  const [resourcePopupOpen, setPopResource] = useState(false);

  const [itemProductionCalendarBundleCreatePopupOpen, setPopupItemProductionCalendarBundleCreate] = useState(false);

  const { reset, getValues, setValue, control } = useForm({
    defaultValues: {
      resCd: '',
      resDescrip: ''
    }
  });

  const exportExceloptions = {
    headerDepth: 1,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: true
  };

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

  const globalButtons = [
    {
      name: 'search',
      action: (e) => { onSubmit() },
      visible: true,
      disable: false
    },
    {
      name: 'refresh',
      action: (e) => { refresh() },
      visible: true,
      disable: false
    }
  ];

  useEffect(() => {
    async function initLoad() {
      if (gridProdCalendar) {
        setViewInfo(vom.active, 'globalButtons', globalButtons);

        await loadProdCalendar();
      }
    }

    initLoad();
  }, [gridProdCalendar]);

  function afterGridProdCalendar(gridObj) {
    setGridProdCalendar(gridObj);
    setGridProdCalendarOptions(gridObj);
  }

  function setGridProdCalendarOptions(gridObj) {
    setVisibleProps(gridObj, true, true, true);

    gridObj.gridView.setDisplayOptions({ fitStyle: 'fill' });

    gridObj.gridView.setFixedOptions({ colCount: 2, resizable: true });

    gridObj.gridView.setColumnProperty('LOCAT_TP_NM', 'mergeRule', { criteria: 'value' });

    let columnArr = ['LOCAT_LV', 'LOCAT_CD', 'LOCAT_NM'];
    for (let i = 0; i < columnArr.length; i++) {
      gridObj.gridView.setColumnProperty(columnArr[i], 'mergeRule', {
        criteria: "prevvalues + values[ '" + columnArr[i] + "' ]"
      });
    }

    wingui.util.grid.sorter.orderBy(gridObj.gridView, ['LOCAT_TP_NM', 'LOCAT_LV', 'LOCAT_CD', 'LOCAT_NM', 'ITEM_CD', 'ITEM_NM', 'ITEM_TP', 'ROUTE_CD', 'ATTR_01', 'ATTR_02', 'RES_CD', 'RES_DESCRIP']);
  }

  function onSubmit() {
    loadProdCalendar();
  }

  function refresh() {
    currentLocationRef.reset();
    currentItemRef.reset();
    reset();
    gridProdCalendar.dataProvider.clearRows();
  }

  function openPopupResource() {
    setPopResource(true);
  }

  function onSetResource(gridRow) {
    setValue("resCd", gridRow.RES_CD);
    setValue("resDescrip", gridRow.DESCRIP === null ? '' : gridRow.RES_DESCRIP);
  }

  function openPopItemProductionCalendarBundleCreate() {
    setPopupItemProductionCalendarBundleCreate(true);
  }

  function loadProdCalendar() {
    let formData = new FormData();
    formData.append('LOCAT_TP_NM', currentLocationRef.getLocationType());
    formData.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    formData.append('LOCAT_CD', currentLocationRef.getLocationCode());
    formData.append('LOCAT_NM', currentLocationRef.getLocationName());
    formData.append('ITEM_CD', currentItemRef.getItemCode());
    formData.append('DESCRIP', currentItemRef.getItemName());
    formData.append('ITEM_TP_NM', currentItemRef.getItemType());
    formData.append("ROUTE_CD", '');
    formData.append("ROUTE_DESCRIP", '');
    formData.append("RES_CD", getValues("resCd"));
    formData.append("RES_DESCRIP", getValues("resDescrip"));
    formData.append("CROSSTAB", JSON.stringify(gridProdCalendar.gridView.crossTabInfo));

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_17_Q1',
      data: formData
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridProdCalendar.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function saveProdCalendar() {
    gridProdCalendar.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridProdCalendar.dataProvider.getAllStateRows().created,
          gridProdCalendar.dataProvider.getAllStateRows().updated,
          gridProdCalendar.dataProvider.getAllStateRows().deleted,
          gridProdCalendar.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          changeRowData.push(gridProdCalendar.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          if (answer) {
            let formData = new FormData();
            formData.append('WRK_TYPE', 'SAVE');
            formData.append('changes', JSON.stringify(changeRowData));
            formData.append('USER_ID', username);
            formData.append('REVERSE_TARGET', 'changes');
            formData.append("CROSSTAB", JSON.stringify(gridProdCalendar.gridView.crossTabInfo));

            zAxios({
              method: 'post',
              url: baseURI() + 'engine/mp/SRV_UI_MP_17_S1',
              data: formData
            })
            .then(function (res) {
              const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_17_S1_P_RT_MSG;
              showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false });

              if (res.status === gHttpStatus.SUCCESS) {
                loadProdCalendar();
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

  function deleteProdCalendar(targetGrid, deleteRows) {
    let formData = new FormData();

    formData.append('WRK_TYPE', "DELETE");
    formData.append('changes', JSON.stringify(deleteRows));
    formData.append('USER_ID', username);
    formData.append("CROSSTAB", JSON.stringify(gridProdCalendar.gridView.crossTabInfo));

    if (deleteRows.length > 0) {
      return zAxios({
        method: 'post',
        url: baseURI() + 'engine/mp/SRV_UI_MP_17_S1',
        headers: { 'Content-type': 'application/json' },
        data: formData
      })
    }
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <LocationSearchBox ref={locationSearchBoxRef} keyValue={'locationName'} placeHolder={transLangKey("LOCAT_NM")} style={{width: 300}}/>
            <ItemSearchBox ref={itemSearchBoxRef} keyValue={'itemName'} placeHolder={transLangKey("ITEM_NM")} style={{width: 300}}/>
            <InputField type='action' name='resCd' label={transLangKey('RES_CD')} title={transLangKey('SEARCH')} onClick={() => { openPopupResource() }} control={control}>
              <Icon.Search />
            </InputField>
            <InputField name='resDescrip' label={transLangKey('RES_DESCRIP')} control={control} />
          </SearchRow>
        </SearchArea>

        <ButtonArea>
          <LeftButtonArea>
            <GridExcelExportButton type='icon' grid='gridProdCalendar' options={exportExceloptions} />
            {/*<GridExcelImportButton type='icon' grid='gridProdCalendar' />*/}
            <CommonButton title={transLangKey("BUNDLE_CREATE")} onClick={() => { openPopItemProductionCalendarBundleCreate() }}><Icon.File/></CommonButton>
          </LeftButtonArea>
          <RightButtonArea>
            <GridDeleteRowButton type='icon' grid='gridProdCalendar' onDelete={deleteProdCalendar}></GridDeleteRowButton>
            <GridSaveButton type='icon' onClick={() => { saveProdCalendar() }}></GridSaveButton>
          </RightButtonArea>
        </ButtonArea>
        <Box style={{ height: 'calc(100% - 53px)' }}>
          <BaseGrid id='gridProdCalendar' items={gridProdCalendarColumns} viewCd="UI_MP_17" gridCd="UI_MP_17-RST_CPT_01" afterGridCreate={afterGridProdCalendar} />
        </Box>
      </ContentInner>
      {resourcePopupOpen && (<PopCommResource open={resourcePopupOpen} onClose={() => { setPopResource(false); }} confirm={onSetResource}></PopCommResource>)}
      {itemProductionCalendarBundleCreatePopupOpen && (<PopItemProductionCalendarBundleCreate open={itemProductionCalendarBundleCreatePopupOpen} onClose={() => { setPopupItemProductionCalendarBundleCreate(false); }} confirm={onSubmit}></PopItemProductionCalendarBundleCreate>)}
    </>
  )
}

export default ItemProductionCalendar;
