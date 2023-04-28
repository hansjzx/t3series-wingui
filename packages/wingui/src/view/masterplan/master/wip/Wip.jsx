import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { ContentInner, SearchArea, SearchRow, ButtonArea, LeftButtonArea, RightButtonArea, GridExcelExportButton,
  GridSaveButton, InputField, BaseGrid, useUserStore, useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';

import ItemSearchBox from '@wingui/view/supplychainmodel/common/ItemSearchBox';
import LocationSearchBox from '@wingui/view/supplychainmodel/common/LocationSearchBox';
import PopCommResource from '@wingui/view/supplychainmodel/common/PopCommResource';
import PopAccount from './PopAccount';
import PopPegging from './PopPegging';

let gridWipColumns = [
  { name: 'WIP_MST_ID', dataType: 'text', headerText: 'WIP_MST_ID', visible: false, editable: false, width: '100' },
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
      { name: 'ITEM_DESCRIP', dataType: 'text', headerText: 'ITEM_DESCRIP', visible: false, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ITEM_TP', dataType: 'text', headerText: 'ITEM_TP', visible: true, editable: false, width: '80', useDropdown: true, lookupDisplay: true, groupShowMode: 'expand' }
    ]
  },
  { name: 'WIP_ID', dataType: 'text', headerText: 'WIP_ID', visible: true, editable: false, width: '100', autoFilter: true },
  { name: 'ROUTE_CD', dataType: 'text', headerText: 'ROUTE_CD', visible: true, editable: false, width: '100', autoFilter: true },
  { name: 'ROUTE_DESCRIP', dataType: 'text', headerText: 'ROUTE_DESCRIP', visible: false, editable: false, width: '100', autoFilter: true },
  { name: 'RES_CD', dataType: 'text', headerText: 'RES_CD', visible: true, editable: false, width: '100' },
  { name: 'RES_DESCRIP', dataType: 'text', headerText: 'RES_DESCRIP', visible: true, editable: false, width: '150' },
  { name: 'STRT_DATE', dataType: 'datetime', headerText: 'STRT_DATE', visible: true, editable: false, width: '100', format: 'yyyy-MM-dd' },
  { name: 'END_DATE', dataType: 'datetime', headerText: 'END_DATE', visible: true, editable: false, width: '100', format: 'yyyy-MM-dd' },
  { name: 'USABLE_DATE', dataType: 'datetime', headerText: 'USABLE_DATE', visible: true, editable: false, width: '100', format: 'yyyy-MM-dd' },
  { name: 'EXPIRE_DATE', dataType: 'datetime', headerText: 'EXPIRE_DATE', visible: true, editable: false, width: '100', format: 'yyyy-MM-dd' },
  { name: 'QTY', dataType: 'number', headerText: 'QTY', visible: true, editable: false, width: '80' },
  { name: 'REMAIN_QTY', dataType: 'number', headerText: 'REMAIN_QTY', visible: true, editable: false, width: '80' },
  { name: 'COST_VALUE', dataType: 'number', headerText: 'COST_VALUE', visible: true, editable: false, width: '80' },
  { name: 'PRIORT', dataType: 'number', headerText: 'PRIORITY', visible: true, editable: true, width: '80' },
  { name: 'DISTRIBUTION', dataType: 'boolean', headerText: 'DISTRIBUTION', visible: true, editable: true, width: '80' },
  { name: 'PROCESSING', dataType: 'boolean', headerText: 'PROCESSING', visible: true, editable: true, width: '80' },
  { name: 'CONSUMING', dataType: 'boolean', headerText: 'CONSUMING', visible: true, editable: true, width: '80' },
  {
    name: 'MAX_PRDUCT', dataType: 'group', orientation: 'horizontal', headerText: 'MAX_PRDUCT', expandable: false, expanded: false,
    childs: [
      { name: 'ACCOUNT_ID', dataType: 'text', headerText: 'ACCOUNT_ID', visible: false, editable: false, width: '100' },
      { name: 'ACCOUNT_CD', dataType: 'text', headerText: 'ACCOUNT_CD', visible: true, editable: true, width: '100', button: 'action' },
      { name: 'ACCOUNT_NM', dataType: 'text', headerText: 'ACCOUNT_NM', visible: true, editable: false, width: '100' },
      { name: 'PEGGING_GRP_ID', dataType: 'text', headerText: 'PEGGING_GRP_ID', visible: false, editable: false, width: '100' },
      { name: 'PEGGING_ATTR', dataType: 'text', headerText: 'PEGGING_ATTR', visible: true, editable: true, width: '120', button: 'action' }
    ]
  },
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

function Wip() {
  const [username] = useUserStore(state => [state.username]);
  const [gridWip, setGridWip] = useState(null);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const locationSearchBoxRef = useRef();
  const [currentLocationRef, setCurrentLocationRef] = useState();

  const itemSearchBoxRef = useRef();
  const [currentItemRef, setCurrentItemRef] = useState();

  const [resourcePopupOpen, setPopResource] = useState(false);
  const [accountPopupOpen, setPopAccount] = useState(false);
  const [peggingPopupOpen, setPopPegging] = useState(false);

  const [wipMstId, setWipMstId] = useState('');

  const { reset, getValues, setValue, control } = useForm({
    defaultValues: {
      resCd: '',
      resDescrip: ''
    }
  });

  const exportExcelOptions = {
    headerDepth: 2,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  };

  useEffect(() => {
    const grdObj = getViewInfo(vom.active, 'gridWip');
    if (grdObj) {
      if (grdObj.dataProvider) {
        if (gridWip !== grdObj) {
          setGridWip(grdObj);
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

  const globalButtons = [
    { name: 'search', action: (e) => { onSubmit() }, visible: true, disable: false },
    { name: 'refresh', action: (e) => { refresh() }, visible: true, disable: false }
  ];

  useEffect(() => {
    async function initLoad() {
      if (gridWip) {
        setViewInfo(vom.active, 'globalButtons', globalButtons);
        setOptionsGridWip();

        await loadWip();
      }
    }

    initLoad();
  }, [gridWip]);

  function setOptionsGridWip() {
    setVisibleProps(gridWip, true, true, false);

    gridWip.gridView.setDisplayOptions({ fitStyle: 'fill' });

    gridWip.gridView.setColumnProperty('LOCAT_TP_NM', 'mergeRule', { criteria: "value" });
    gridWip.gridView.setColumnProperty('LOCAT_LV', 'mergeRule', { criteria: "values['LOCAT_TP_NM'] + value" });
    gridWip.gridView.setColumnProperty('LOCAT_CD', 'mergeRule', { criteria: "values['LOCAT_LV'] + value" });
    gridWip.gridView.setColumnProperty('LOCAT_NM', 'mergeRule', { criteria: "values['LOCAT_CD'] + value" });
    gridWip.gridView.setColumnProperty('ITEM_CD', 'mergeRule', { criteria: "values['LOCAT_NM'] + value" });
    gridWip.gridView.setColumnProperty('ITEM_NM', 'mergeRule', { criteria: "values['ITEM_CD'] + value" });
    gridWip.gridView.setColumnProperty('ITEM_DESCRIP', 'mergeRule', { criteria: "values['ITEM_NM'] + value" });
    gridWip.gridView.setColumnProperty('ITEM_TP', 'mergeRule', { criteria: "values['ITEM_NM'] + value" });

    gridWip.gridView.columnByName("ACCOUNT_CD").buttonVisibility = "always";
    gridWip.gridView.columnByName("PEGGING_ATTR").buttonVisibility = "always";
    
    gridWip.gridView.setFixedOptions({colCount: 3, resizable : true});

    gridWip.gridView.onCellButtonClicked = function (gridWip, index, column) {
      let row = gridWip.getValues(index.itemIndex);

      setWipMstId(row.WIP_MST_ID);

      if (column.fieldName === "ACCOUNT_CD") {
        openPopupAccount();
      } else if (column.fieldName === "PEGGING_ATTR") {
        openPopupPegging();
      }
    }
  }

  function onSubmit() {
    loadWip();
  }

  function refresh() {
    currentLocationRef.reset();
    currentItemRef.reset();
    reset();

    gridWip.dataProvider.clearRows();
  }

  function openPopupResource() {
    setPopResource(true);
  }

  function onSetResource(gridRow) {
    setValue("resCd", gridRow.RES_CD);
    setValue("resDescrip", gridRow.DESCRIP === null ? '' : gridRow.RES_DESCRIP);
  }

  function openPopupAccount() {
    gridWip.gridView.commit(true);

    setPopAccount(true);
  }

  function onSetAccount(gridRow) {
    let itemIndex = gridWip.gridView.getCurrent().dataRow;

    gridWip.dataProvider.setValue(itemIndex, 'ACCOUNT_ID', gridRow.ID);
    gridWip.dataProvider.setValue(itemIndex, 'ACCOUNT_CD', gridRow.ACCOUNT_CD);
    gridWip.dataProvider.setValue(itemIndex, 'ACCOUNT_NM', gridRow.ACCOUNT_NM);
  }

  function openPopupPegging() {
    gridWip.gridView.commit(true);

    setPopPegging(true);
  }

  function onSetPegging(gridRow) {
    let itemIndex = gridWip.gridView.getCurrent().dataRow;

    gridWip.dataProvider.setValue(itemIndex, 'PEGGING_GRP_ID', gridRow.ID);
    gridWip.dataProvider.setValue(itemIndex, 'PEGGING_ATTR', gridRow.PEGGING_ATTR);
  }

  function loadWip() {
    let formData = new FormData();
    formData.append('LOCAT_TP', currentLocationRef.getLocationType());
    formData.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    formData.append('LOCAT_CD', currentLocationRef.getLocationCode());
    formData.append('LOCAT_NM', currentLocationRef.getLocationName());
    formData.append('ITEM_CD', currentItemRef.getItemCode());
    formData.append('ITEM_NM', currentItemRef.getItemName());
    formData.append("ITEM_TP", currentItemRef.getItemType());
    formData.append("ROUTE_CD", '');
    formData.append("ROUTE_DESCRIP", '');
    formData.append("RES_CD", getValues("resCd"));
    formData.append("RES_DESCRIP", getValues("resDescrip"));
    formData.append("WIP_ID", '');

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_02_Q1',
      data: formData
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          gridWip.setData(res.data.RESULT_DATA);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function saveWip() {
    gridWip.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridWip.dataProvider.getAllStateRows().created,
          gridWip.dataProvider.getAllStateRows().updated,
          gridWip.dataProvider.getAllStateRows().deleted,
          gridWip.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          let rowData = gridWip.dataProvider.getJsonRow(row);

          if (rowData.STRT_DATE instanceof Date) {
            rowData.STRT_DATE = rowData.STRT_DATE.format("yyyy-MM-ddTHH:mm:ss");
          }
          if (rowData.END_DATE instanceof Date) {
            rowData.END_DATE = rowData.END_DATE.format("yyyy-MM-ddTHH:mm:ss");
          }

          if (rowData.USABLE_DATE instanceof Date) {
            rowData.USABLE_DATE = rowData.USABLE_DATE.format("yyyy-MM-ddTHH:mm:ss");
          }
          if (rowData.EXPIRE_DATE instanceof Date) {
            rowData.EXPIRE_DATE = rowData.EXPIRE_DATE.format("yyyy-MM-ddTHH:mm:ss");
          }

          if (rowData.CREATE_DTTM instanceof Date) {
            rowData.CREATE_DTTM = rowData.CREATE_DTTM.format("yyyy-MM-ddTHH:mm:ss");
          }
          if (rowData.MODIFY_DTTM instanceof Date) {
            rowData.MODIFY_DTTM = rowData.MODIFY_DTTM.format("yyyy-MM-ddTHH:mm:ss");
          }

          changeRowData.push(gridWip.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          if (answer) {
            let formData = new FormData();
            formData.append('changes', JSON.stringify(changeRowData));
            formData.append('USER_ID', username);

            zAxios({
              method: 'post',
              url: baseURI() + 'engine/mp/SRV_UI_MP_02_S1',
              data: formData
            })
              .then(function (res) {
                const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_02_S1_P_RT_MSG;
                showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false });

                if (res.status === gHttpStatus.SUCCESS) {
                  loadWip();
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
            <GridExcelExportButton type='icon' grid='gridWip' options={exportExcelOptions} />
            {/*<GridExcelImportButton type='icon' grid='gridWip' />*/}
          </LeftButtonArea>
          <RightButtonArea>
            <GridSaveButton type='icon' onClick={() => { saveWip() }}></GridSaveButton>
          </RightButtonArea>
        </ButtonArea>
        <Box style={{ height: 'calc(100% - 53px)' }}>
          <BaseGrid id='gridWip' items={gridWipColumns} />
        </Box>
      </ContentInner>
      {resourcePopupOpen && (<PopCommResource open={resourcePopupOpen} onClose={() => { setPopResource(false); }} confirm={onSetResource}></PopCommResource>)}
      {accountPopupOpen && (<PopAccount open={accountPopupOpen} onClose={() => { setPopAccount(false); }} confirm={onSetAccount} data={wipMstId}></PopAccount>)}
      {peggingPopupOpen && (<PopPegging open={peggingPopupOpen} onClose={() => { setPopPegging(false); }} confirm={onSetPegging} data={wipMstId}></PopPegging>)}
    </>
  )
}

export default Wip;
