import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import {
  ContentInner, SearchArea, SearchRow, ButtonArea, LeftButtonArea, RightButtonArea, GridExcelExportButton, GridAddRowButton,
  GridSaveButton, GridDeleteRowButton, CommonButton, InputField, BaseGrid, useUserStore, useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';
import { setGridComboList } from "@wingui/view/supplychainmodel/common/common";

import LocationSearchBox from '@wingui/view/supplychainmodel/common/LocationSearchBox';
import PopCommResource from '@wingui/view/supplychainmodel/common/PopCommResource';

import PopItemPlantResCalendarBundleCreate from './PopItemPlantResCalendarBundleCreate';
import PopPlantResCalendarNew1 from './PopPlantResCalendarNew1';

let gridResCalendarColumns = [
  { name: 'RES_CAL_ID', dataType: 'text', headerText: 'RES_CAL_ID', visible: false, editable: false, width: '100' },
  { name: 'RES_DTL_ID', dataType: 'text', headerText: 'RES_DTL_ID', visible: false, editable: false, width: '100' },
  { name: 'LOCATION_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'LOCAT', expandable: true, expanded: false,
    childs: [
      { name: 'LOCAT_TP', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: 120, groupShowMode: 'expand' },
      { name: 'LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: 120, groupShowMode: 'expand' },
      { name: 'LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: 120, groupShowMode: 'always' },
      { name: 'LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: 120, groupShowMode: 'always' }
    ]
  },
  { name: 'RES_CD', dataType: 'text', headerText: 'RES_CD', visible: true, editable: false, width: '100' },
  { name: 'RES_DESCRIP', dataType: 'text', headerText: 'RES_DESCRIP', visible: true, editable: false, width: '120' },
  { name: 'CALENDAR_ID', dataType: 'text', headerText: 'CALENDAR_ID', visible: true, editable: false, width: '200', autoFilter: true },
  { name: 'CALENDAR_DESCRIP', dataType: 'text', headerText: 'CALENDAR_DESCRIP', visible: true, editable: false, width: '120', autoFilter: true },
  { name: 'PRDUCT_CONST_YN', dataType: 'boolean', headerText: 'PRDUCT_CONST_YN', visible: true, editable: true, width: '80' },
  { name: 'STRT_DATE', dataType: 'datetime', headerText: 'STRT_DATE', visible: true, editable: true, width: '100', format: 'yyyy-MM-dd' },
  { name: 'END_DATE', dataType: 'datetime', headerText: 'END_DATE', visible: true, editable: true, width: '100', format: 'yyyy-MM-dd' },
  { name: 'CYCL_TP', dataType: 'text', headerText: 'CYCL_TP', visible: true, editable: true, width: '100', autoFilter: true, useDropdown: true, lookupDisplay: true },
  { name: 'FIXED_YN', dataType: 'boolean', headerText: 'FIXED_YN', visible: true, editable: true, width: '50' },
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

function PlantResCalendar() {
  const [username] = useUserStore(state => [state.username]);
  const [gridResCalendar, setGridResCalendar] = useState(null);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const locationSearchBoxRef = useRef();
  const [currentLocationRef, setCurrentLocationRef] = useState();

  const [resourcePopupOpen, setPopResource] = useState(false);

  const [plantResCalendarBundleCreatePopupOpen, setPopupPlantResCalendarBundleCreate] = useState(false);
  const [plantResCalendarNew1PopupOpen, setPopupPlantResCalendarNew1] = useState(false);

  const { reset, getValues, setValue, control } = useForm({
    defaultValues: {
      resCd: "",
      resDescrip: ""
    }
  });

  const exportExceloptions = {
    headerDepth: 1,
    footer: 'default',
    allColumns: true,
    lookupDisplay: false,
    separateRows: true
  };

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, 'gridResCalendar');
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        if (gridResCalendar !== grdObj1) {
          setGridResCalendar(grdObj1);
        }
      }
    }

    if (locationSearchBoxRef) {
      if (locationSearchBoxRef.current) {
        setCurrentLocationRef(locationSearchBoxRef.current);
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
      if (gridResCalendar) {
        setViewInfo(vom.active, 'globalButtons', globalButtons);
        setOptionsGridResCalendar();

        await loadResCalendar();
      }
    }

    initLoad();
  }, [gridResCalendar]);

  function setOptionsGridResCalendar() {
    setVisibleProps(gridResCalendar, true, true, true);

    gridResCalendar.gridView.filteringOptions.automating.lookupDisplay = true;
    gridResCalendar.gridView.setDisplayOptions({ fitStyle: 'fill' });

    gridResCalendar.gridView.setColumnProperty('LOCAT_TP', 'mergeRule', { criteria: 'value' });

    let columnArr = ['LOCAT_LV', 'LOCAT_CD', 'LOCAT_NM', 'RES_CD', 'RES_DESCRIP'];
    for (let i = 0; i < columnArr.length; i++) {
      gridResCalendar.gridView.setColumnProperty(columnArr[i], 'mergeRule', {
        criteria: "prevvalues + values[ '" + columnArr[i] + "' ]"
      });
    }

    wingui.util.grid.sorter.orderBy(gridResCalendar.gridView, ['LOCAT_TP', 'LOCAT_LV', 'LOCAT_CD', 'LOCAT_NM', 'RES_CD', 'RES_DESCRIP', 'CALENDAR_ID', 'CALENDAR_DESCRIP']);
    setGridComboList(gridResCalendar, 'CYCL_TP', 'CALENDAR_CYCL_TP');
  }

  function onSubmit() {
    loadResCalendar();
  }

  function refresh() {
    currentLocationRef.reset();
    reset();

    gridResCalendar.dataProvider.clearRows();
  }

  function openPopupResource() {
    setPopResource(true);
  }

  function onSetResource(gridRow) {
    setValue("resCd", gridRow.RES_CD);
    setValue("resDescrip", gridRow.DESCRIP === null ? '' : gridRow.RES_DESCRIP);
  }

  function openPopupPlantResCalendarBundleCreate() {
    setPopupPlantResCalendarBundleCreate(true);
  }

  function openPopupPlantResCalendarNew1() {
    setPopupPlantResCalendarNew1(true);
  }

  function loadResCalendar() {
    let formData = new FormData();
    formData.append('LOCAT_TP', currentLocationRef.getLocationType());
    formData.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    formData.append('LOCAT_CD', currentLocationRef.getLocationCode());
    formData.append('LOCAT_NM', currentLocationRef.getLocationName());
    formData.append("RES_CD", getValues("resCd"));
    formData.append("RES_DESCRIP", getValues("resDescrip"));
    formData.append("CAL_DESC", '');
    formData.append("CYCL_TP", '');

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_11_Q1',
      data: formData
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridResCalendar.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function saveResCalendar() {
    gridResCalendar.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridResCalendar.dataProvider.getAllStateRows().created,
          gridResCalendar.dataProvider.getAllStateRows().updated,
          gridResCalendar.dataProvider.getAllStateRows().deleted,
          gridResCalendar.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          let rowData = gridResCalendar.dataProvider.getJsonRow(row);

          if (rowData.STRT_DATE instanceof Date) {
            rowData.STRT_DATE = rowData.STRT_DATE.format("yyyy-MM-ddTHH:mm:ss");
          }
          if (rowData.END_DATE instanceof Date) {
            rowData.END_DATE = rowData.END_DATE.format("yyyy-MM-ddTHH:mm:ss");
          }
          if (rowData.STRT_DTTM instanceof Date) {
            rowData.STRT_DTTM = rowData.STRT_DTTM.format("yyyy-MM-ddTHH:mm:ss");
          }
          if (rowData.END_DTTM instanceof Date) {
            rowData.END_DTTM = rowData.END_DTTM.format("yyyy-MM-ddTHH:mm:ss");
          }

          changeRowData.push(rowData);
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
              url: baseURI() + 'engine/mp/SRV_UI_MP_11_S1',
              data: formData
            })
            .then(function (res) {
              showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_MP_11_S1_P_RT_MSG), { close: false });

              if (res.status === gHttpStatus.SUCCESS) {
                loadResCalendar();
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

  function deleteResCalendar(targetGrid, deleteRows) {
    let formData = new FormData();

    deleteRows.forEach(function (rowData) {
      if (rowData.STRT_DATE instanceof Date) {
        rowData.STRT_DATE = rowData.STRT_DATE.format("yyyy-MM-ddTHH:mm:ss");
      }
      if (rowData.END_DATE instanceof Date) {
        rowData.END_DATE = rowData.END_DATE.format("yyyy-MM-ddTHH:mm:ss");
      }
      if (rowData.CREATE_DTTM instanceof Date) {
        rowData.CREATE_DTTM = rowData.CREATE_DTTM.format("yyyy-MM-ddTHH:mm:ss");
      }
      if (rowData.MODIFY_DTTM instanceof Date) {
        rowData.MODIFY_DTTM = rowData.MODIFY_DTTM.format("yyyy-MM-ddTHH:mm:ss");
      }
    });

    formData.append('checked', JSON.stringify(deleteRows));

    if (deleteRows.length > 0) {
      return zAxios({
        method: 'post',
        url: baseURI() + 'engine/mp/SRV_UI_MP_11_S3',
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
            <LocationSearchBox ref={locationSearchBoxRef} keyValue={'locationName'} placeHolder={transLangKey("LOCAT_NM")}/>
            <InputField type="action" name="resCd" label={transLangKey("RES_CD")} title={transLangKey("SEARCH")} onClick={() => { openPopupResource() }} control={control}>
              <Icon.Search />
            </InputField>
            <InputField name="resDescrip" label={transLangKey("RES_DESCRIP")} control={control} />
          </SearchRow>
        </SearchArea>

        <ButtonArea>
          <LeftButtonArea>
            <GridExcelExportButton type="icon" grid="gridResCalendar" options={exportExceloptions} />
            {/*<GridExcelImportButton type="icon" grid="gridResCalendar" />*/}
            <CommonButton title={transLangKey("BUNDLE_CREATE")} onClick={() => { openPopupPlantResCalendarBundleCreate() }}><Icon.File/></CommonButton>
          </LeftButtonArea>
          <RightButtonArea>
            <GridAddRowButton type="icon" onClick={() => { openPopupPlantResCalendarNew1() }}></GridAddRowButton>
            <GridDeleteRowButton type="icon" grid="gridResCalendar" onDelete={deleteResCalendar}></GridDeleteRowButton>
            <GridSaveButton type="icon" onClick={() => { saveResCalendar() }}></GridSaveButton>
          </RightButtonArea>
        </ButtonArea>
        <Box style={{ height: "calc(100% - 53px)" }}>
          <BaseGrid id="gridResCalendar" items={gridResCalendarColumns} />
        </Box>

      </ContentInner>
      {resourcePopupOpen && (<PopCommResource open={resourcePopupOpen} onClose={() => { setPopResource(false); }} confirm={onSetResource}></PopCommResource>)}
      {plantResCalendarBundleCreatePopupOpen && (<PopItemPlantResCalendarBundleCreate open={plantResCalendarBundleCreatePopupOpen} onClose={() => { setPopupPlantResCalendarBundleCreate(false); }} confirm={onSubmit}></PopItemPlantResCalendarBundleCreate>)}
      {plantResCalendarNew1PopupOpen && (<PopPlantResCalendarNew1 open={plantResCalendarNew1PopupOpen} onClose={() => { setPopupPlantResCalendarNew1(false); }} confirm={onSubmit}></PopPlantResCalendarNew1>)}
    </>
  )
}

export default PlantResCalendar;
