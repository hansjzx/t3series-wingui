import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import {
  ContentInner, SearchArea, SearchRow, ButtonArea, LeftButtonArea, RightButtonArea, ResultArea, GridExcelImportButton,
  GridExcelExportButton, GridSaveButton, InputField, BaseGrid, useUserStore, useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';
import PopWhType from '@wingui/view/supplychainmodel/common/PopWhType';
import PopLocatTp from '@wingui/view/common/PopLocatTp';
import PopStoragelocation from './PopStoragelocation';

let gridStorageLocationColumns = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: 100 },
  { name: "TO_LOCAT_ID", dataType: "text", headerText: "TO_LOCAT_ID", visible: false, editable: false, width: 100 },
  { name: "FROM_LOCAT_ID", dataType: "text", headerText: "FROM_LOCAT_ID", visible: false, editable: false, width: 100 },
  { name: "PLANT_CD", dataType: "text", headerText: "PLANT_CD", visible: true, editable: false, width: 100, autoFilter: true },
  { name: "INV_LOCAT_CD", dataType: "text", headerText: "STOCK_LOCAT_CD", visible: true, editable: false, width: 130, autoFilter: true },
  { name: "INV_LOCAT_NM", dataType: "text", headerText: "STOCK_LOCAT_NM", visible: true, editable: false, width: 200, autoFilter: true },
  { name: "INV_LOCAT_DESCRIP", dataType: "text", headerText: "STOCK_LOCAT_DESCRIP", visible: true, editable: false, width: 200, autoFilter: true },
  { name: "WAHOUS_TP_ID", dataType: "text", headerText: "WAHOUS_TP_ID", visible: false, editable: false, width: 150},
  { name: "WAHOUS_TP_NM", dataType: "text", headerText: "WAHOUS_TP_NM", visible: true, editable: false, width: 150, button: "action", buttonVisibility: "always", autoFilter: true, styleName: "editable-text-column" },
  { name: "LOAD_CAPA_MGMT_BASE", dataType: "text", headerText: "LOAD_CAPA_MGMT_BASE", visible: true, editable: false, width: 150, autoFilter: true },
  { name: "LOCAT_STOCK_YN", dataType: "boolean", headerText: "LOCAT_STOCK_YN", visible: true, editable: true, width: 130, autoFilter: true },
  { name: "INTRANSIT_STOCK_YN", dataType: "boolean", headerText: "INTRANSIT_STOCK_YN", visible: true, editable: true, width: 130, autoFilter: true },
  {
    name: "FROM_LOCAT_GROUP", dataType: "group", orientation: "horizontal", headerText: "FROM_LOCAT", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "FROM_LOCAT_TP_NM", dataType: "text", headerText: "FROM_LOCAT_TP_NM", visible: true, editable: false, width: 120, button: "action", buttonVisibility: "always", styleName: "editable-text-column" },
      { name: "FROM_LOCAT_LV", dataType: "text", headerText: "FROM_LOCAT_LV", visible: true, editable: false, width: 120 },
      { name: "FROM_LOCAT_CD", dataType: "text", headerText: "FROM_LOCAT_CD", visible: true, editable: false, width: 120 },
      { name: "FROM_LOCAT_NM", dataType: "text", headerText: "FROM_LOCAT_NM", visible: true, editable: false, width: 120 }
    ]
  },
  {
    name: "TO_LOCAT_GROUP", dataType: "group", orientation: "horizontal", headerText: "TO_LOCAT", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "TO_LOCAT_TP_NM", dataType: "text", headerText: "TO_LOCAT_TP_NM", visible: true, editable: false, width: 120, button: "action", buttonVisibility: "always", styleName: "editable-text-column" },
      { name: "TO_LOCAT_LV", dataType: "text", headerText: "TO_LOCAT_LV", visible: true, editable: false, width: 120 },
      { name: "TO_LOCAT_CD", dataType: "text", headerText: "TO_LOCAT_CD", visible: true, editable: false, width: 120 },
      { name: "TO_LOCAT_NM", dataType: "text", headerText: "TO_LOCAT_NM", visible: true, editable: false, width: 120 }
    ]
  },
  { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: 70 },
  {
    name: "EDIT", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: 100, groupShowMode: "expand" },
      { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: 100, groupShowMode: "expand" },
      { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 100, groupShowMode: "always" },
      { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 100, groupShowMode: "expand" }
    ]
  }
];

function StorageLocation() {
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [username] = useUserStore(state => [state.username]);

  const [popupSelect, setPopupSelect] = useState('');

  const [gridStorageLocation, setGridStorageLocation] = useState(null);

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, 'gridStorageLocation');
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        setGridStorageLocation(grdObj1)
      }
    }
  }, [viewData])

  const { reset, control, getValues, setValue, clearErrors } = useForm({
    defaultValues: {
      invLocatNm: '',
      invLocatDescrip: '',
      wahousTpNm: '',
      loadCapaMgmtBase: ''
    }
  });

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
    },
  ]

  const [popupData, setPopupData] = useState({});
  const [popWhTpyeOpen, setPopWhTpyeOpen] = useState(false);
  const [dialogLocatTpOpen, setDialogLocatTpOpen] = useState(false);
  const [popStoragelocationOpen, setPopStoragelocationOpen] = useState(false);

  const exportExcelOptions = {
    headerDepth: 2,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  }

  useEffect(() => {
    async function initLoad() {
      if (gridStorageLocation) {
        setViewInfo(vom.active, 'globalButtons', globalButtons);
        await setOptions();
        await loadData();
      }
    }

    initLoad();
  }, [gridStorageLocation]);

  const onSubmit = (data) => {
    loadData(data);
  };

  const refresh = () => {
    reset();
    gridStorageLocation.dataProvider.clearRows();
  }

  function setOptions() {
    setVisibleProps(gridStorageLocation, true, true, false);
    gridStorageLocation.gridView.displayOptions.fitStyle = 'even';
    wingui.util.grid.sorter.orderBy(gridStorageLocation.gridView, ['PLANT_CD', 'INV_LOCAT_CD', 'INV_LOCAT_NM', 'INV_LOCAT_DESCRIP', 'WAHOUS_TP_NM']);

    gridStorageLocation.gridView.onCellButtonClicked = function (grid, itemIndex, column) {
      if (column.fieldName === 'FROM_LOCAT_TP_NM') {
        openLocatTpPopup();
      }
      if (column.fieldName === 'TO_LOCAT_TP_NM') {
        openLocatTpPopup();
      }
      if (column.fieldName === 'WAHOUS_TP_NM') {
        setPopupSelect('grid_wahous');
        openPopup();
      }
    }

    gridStorageLocation.gridView.onCellEdited = function (grid, itemIndex, dataRow, field) {
      let value = grid.getValue(itemIndex, field);
      let fieldName = gridStorageLocation.dataProvider.getFieldName(field);

      if (fieldName === 'INTRANSIT_STOCK_YN' || fieldName === 'LOCAT_STOCK_YN') {
        if (grid.getValue(itemIndex, field)) {
          grid.setValue(itemIndex, fieldName === 'INTRANSIT_STOCK_YN' ? 'LOCAT_STOCK_YN' : 'INTRANSIT_STOCK_YN', !value);
        }
      }
    };
  }

  function openPopup() {
    setPopWhTpyeOpen(true);
  }

  function openLocatTpPopup() {
    setDialogLocatTpOpen(true);
  }

  function onSetWhType(gridRow) {
    if (popupSelect === 'search') {
      setValue('wahousTpNm', gridRow.WAREHOUSE_TP_NM);
      setValue('loadCapaMgmtBase', gridRow.LOAD_CAPA_MGMT_BASE);
    } else {
      let current = gridStorageLocation.gridView.getCurrent();
      gridStorageLocation.dataProvider.setValue(current.dataRow, 'WAHOUS_TP_ID', gridRow.ID);
      gridStorageLocation.dataProvider.setValue(current.dataRow, 'WAHOUS_TP_NM', gridRow.WAREHOUSE_TP_NM);
      gridStorageLocation.dataProvider.setValue(current.dataRow, 'LOAD_CAPA_MGMT_BASE', gridRow.LOAD_CAPA_MGMT_BASE);
      gridStorageLocation.gridView.commit(true);
    }
  }

  function onSetLocatTp(gridRow) {
    let current = gridStorageLocation.gridView.getCurrent();
    let fromto = (current.column).split('_')[0];

    gridStorageLocation.dataProvider.setValue(current.dataRow, fromto + '_LOCAT_ID', gridRow.LOCAT_MGMT_ID);
    gridStorageLocation.dataProvider.setValue(current.dataRow, fromto + '_LOCAT_TP_NM', gridRow.LOCAT_TP_NM);
    gridStorageLocation.dataProvider.setValue(current.dataRow, fromto + '_LOCAT_LV', gridRow.LOCAT_LV);
    gridStorageLocation.dataProvider.setValue(current.dataRow, fromto + '_LOCAT_CD', gridRow.LOCAT_CD);
    gridStorageLocation.dataProvider.setValue(current.dataRow, fromto + '_LOCAT_NM', gridRow.LOCAT_NM);
    gridStorageLocation.gridView.commit(true);
  }

  async function loadData() {
    gridStorageLocation.gridView.commit(true);

    let param = new URLSearchParams();

    param.append('PLANT_CD', '');
    param.append('INV_LOCAT_NM', getValues('invLocatNm'));
    param.append('INV_LOCAT_DESCRIP', getValues('invLocatDescrip'));
    param.append('WAHOUS_TP_NM', getValues('wahousTpNm'));
    param.append('LOAD_CAPA_MGMT_BASE', getValues('loadCapaMgmtBase'));
    param.append('STORAGE_LOCAT_TP', 'ALL');

    await zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_IM_11_Q1',
      params: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridStorageLocation.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function saveData() {
    gridStorageLocation.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridStorageLocation.dataProvider.getAllStateRows().created,
          gridStorageLocation.dataProvider.getAllStateRows().updated,
          gridStorageLocation.dataProvider.getAllStateRows().deleted,
          gridStorageLocation.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          changeRowData.push(gridStorageLocation.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          let param = new URLSearchParams();

          param.append('CHANGES', JSON.stringify(changeRowData));
          param.append('USER_ID', username);

          zAxios({
            method: 'post',
            header: { 'content-type': 'application/json' },
            url: baseURI() + 'engine/mp/SRV_UI_IM_11_S1',
            params: param
          })
          .then(function (res) {
            if (res.status === gHttpStatus.SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_IM_11_S1_P_RT_MSG), { close: false });
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
            <InputField name='invLocatNm' label={transLangKey('STOCK_LOCAT_NM')} control={control} />
            <InputField name='invLocatDescrip' label={transLangKey('STOCK_LOCAT_DESCRIP')} control={control} wrapStyle={{ width: '550px' }} />
            <InputField type='action' name="wahousTpNm" label={transLangKey("WAHOUS_TP_NM")} onClick={() => { setPopupSelect('search'); openPopup() }} title={transLangKey('SEARCH')} control={control}>
              <Icon.Search />
            </InputField>
            <InputField name='loadCapaMgmtBase' label={transLangKey('LOAD_CAPA_MGMT_BASE')} control={control} />
          </SearchRow>
        </SearchArea>
        <ResultArea>
          <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch' }}>
            <ButtonArea>
              <LeftButtonArea>
                <GridExcelExportButton type='icon' grid='gridStorageLocation' options={exportExcelOptions}></GridExcelExportButton>
              </LeftButtonArea>
              <RightButtonArea>
                <GridSaveButton title={transLangKey('SAVE')} onClick={saveData} />
              </RightButtonArea>
            </ButtonArea>
            <Box style={{ height: '100%' }}>
              <BaseGrid id='gridStorageLocation' items={gridStorageLocationColumns} />
            </Box>
          </Box>
        </ResultArea>
      </ContentInner>

      {popWhTpyeOpen && <PopWhType open={popWhTpyeOpen} onClose={() => { setPopWhTpyeOpen(false); }} confirm={onSetWhType}></PopWhType>}
      {popStoragelocationOpen && <PopStoragelocation open={popStoragelocationOpen} onClose={() => { setPopStoragelocationOpen(false); }} confirm={loadData} data={popupData}></PopStoragelocation>}
      {dialogLocatTpOpen && (<PopLocatTp open={dialogLocatTpOpen} onClose={() => { setDialogLocatTpOpen(false); }} confirm={onSetLocatTp}></PopLocatTp>)}
    </>
  )
}

export default StorageLocation;
