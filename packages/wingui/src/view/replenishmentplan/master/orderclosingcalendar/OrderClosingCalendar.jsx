import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import {
  ContentInner, GridSaveButton, SearchArea, SearchRow, ButtonArea, LeftButtonArea, RightButtonArea, ResultArea,
  GridExcelExportButton, GridAddRowButton, GridDeleteRowButton, InputField, BaseGrid, useUserStore, useViewStore, zAxios, CommonButton
} from '@zionex/wingui-core/src/common/imports';
import LocationSearchBox from '@wingui/view/supplychainmodel/common/LocationSearchBox';
import { setGridComboList, getCodeList } from "@wingui/view/supplychainmodel/common/common";
import PopOrderClosingCalendarNew from "./PopOrderClosingCalendarNew";
import PopOrderClosingCalendarBundleCreate from "./PopOrderClosingCalendarBundleCreate";

let gridCalendarColumns = [
  { name: "ID", headerText: "ID", dataType: "text", visible: false },
  { name: 'LOCATION_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'LOCAT', expandable: true, expanded: false,
    childs: [
      { name: "LOCAT_ID", headerText: "LOCAT_ID", dataType: "text", width: "80", visible: false, editable: false },
      { name: "LOCAT_TP_NM", headerText: "LOCAT_TP_NM", dataType: "text", width: "80", visible: true, editable: false, groupShowMode: 'expand' },
      { name: "LOCAT_LV", headerText: "LOCAT_LV", dataType: "text", width: "80", visible: true, editable: false, groupShowMode: 'expand'  },
      { name: "LOCAT_CD", headerText: "LOCAT_CD", dataType: "text", width: "100", visible: true, editable: false, groupShowMode: 'always' },
      { name: "LOCAT_NM", headerText: "LOCAT_NM", dataType: "text", width: "160", visible: true, editable: false, groupShowMode: 'always' }
    ]
  },
  { name: "CALENDAR_ID", headerText: "CALENDAR_ID", dataType: "text", width: "200", visible: true, editable: false },
  { name: "DESCRIP", headerText: "DESCRIP", dataType: "text", width: "150", visible: true, editable: false, autoFilter: true },
  { name: "STRT_DATE", headerText: "STRT_DATE", dataType: "datetime", width: "130", visible: true, editable: true, format: "yyyy-MM-dd" },
  { name: "END_DATE", headerText: "END_DATE", dataType: "datetime", width: "130", visible: true, editable: true, format: "yyyy-MM-dd"  },
  { name: "CYCL_TP", headerText: "CYCL_TP", dataType: "text", width: "80", visible: true, editable: true, useDropdown: true, lookupDisplay: true, lang: true },
  { name: "FIXED_YN", headerText: "FIXED_YN", dataType: "boolean", visible: true, editable: true, width: "60" },
  { name: "ACTV_YN", headerText: "ACTV_YN", dataType: "boolean", visible: true, editable: true, width: "60" },
  {
    name: "auditGroup", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", expandable: true, expanded: false,
    childs: [
      { name: "CREATE_BY", headerText: "CREATE_BY", dataType: "text", width: "80", visible: true, editable: false, groupShowMode: "expand" },
      { name: "CREATE_DTTM", headerText: "CREATE_DTTM", dataType: "datetime", width: "150", visible: true, editable: false, groupShowMode: "expand" },
      { name: "MODIFY_BY", headerText: "MODIFY_BY", dataType: "text", width: "80", visible: true, editable: false, groupShowMode: "always" },
      { name: "MODIFY_DTTM", headerText: "MODIFY_DTTM", dataType: "datetime", width: "150", visible: true, editable: false, groupShowMode: "always" }
    ]
  }
];

function OrderClosingCalendar() {
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [gridCalendar, setGridCalendar] = useState(null);
  const [username] = useUserStore(state => [state.username]);

  const [selectOptions, setSelectOptions] = useState({});
  const [orderClosingCalendarNewOpen, setOrderClosingCalendarNewOpen] = useState(false);
  const [orderClosingCalendarNewBundleCreateOpen, setOrderClosingCalendarNewBundleCreateOpen] = useState(false);

  const locationSearchBoxRef = useRef();
  const [currentLocationRef, setCurrentLocationRef] = useState();

  useEffect(() => {
    if (locationSearchBoxRef) {
      if (locationSearchBoxRef.current) {
        setCurrentLocationRef(locationSearchBoxRef.current);
      }
    }
  }, [viewData])

  const { reset, control, getValues, clearErrors } = useForm({
    defaultValues: {
      cyclTp: ''
    }
  });

  const globalButtons = [
    { name: 'search', action: (e) => { loadOrderClosingCalendar() }, visible: true, disable: false },
    { name: 'refresh', action: (e) => { refresh() }, visible: true, disable: false }
  ]

  const exportExcelOptions = {
    headerDepth: 2,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  }

  useEffect(() => {
    loadSelectOptions();
  }, []);

  useEffect(() => {
    if (gridCalendar) {
      setViewInfo(vom.active, 'globalButtons', globalButtons);
      loadOrderClosingCalendar();
    }
  }, [gridCalendar]);

  function afterGridCalendar(gridObj) {
    setGridCalendar(gridObj);
    setGridCalendarOptions(gridObj);
  }

  const refresh = () => {
    currentLocationRef.reset();
    reset();
    gridCalendar.dataProvider.clearRows();
  }

  function setGridCalendarOptions(gridObj) {
    setVisibleProps(gridObj, true, true, true);
    gridObj.gridView.displayOptions.fitStyle = 'even';
    wingui.util.grid.sorter.orderBy(gridObj.gridView, ['LOCAT_TP_NM', 'LOCAT_LV', 'LOCAT_CD', 'LOCAT_NM']);

    gridObj.gridView.setColumnProperty("LOCAT_TP_NM", "mergeRule", {criteria: "value"});
    gridObj.gridView.setColumnProperty("LOCAT_LV", "mergeRule", {criteria: "value"});
    gridObj.gridView.setColumnProperty("LOCAT_CD", "mergeRule", {criteria: "value"});
    gridObj.gridView.setColumnProperty("LOCAT_NM", "mergeRule", {criteria: "value"});

    setGridComboList(gridObj, "CYCL_TP", "CALENDAR_CYCL_TP");
  }

  async function loadSelectOptions() {
    let dataArr = await getCodeList('CALENDAR_CYCL_TP')
    setSelectOptions(dataArr.filter(code => code.GROUP == 'CALENDAR_CYCL_TP').map(data => ({ value: data.ID, label: data.CD_NM })));
  }

  function loadOrderClosingCalendar() {
    let param = new FormData();

    param.append('LOCAT_TP', currentLocationRef.getLocationType());
    param.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    param.append('LOCAT_CD', currentLocationRef.getLocationCode());
    param.append('LOCAT_NM', currentLocationRef.getLocationName());
    param.append('DESCRIP', "");
    param.append('CYCL_TP_ID', getValues("cyclTp"));

    gridCalendar.gridView.commit(true);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_IM_07_Q1',
      data: param
    })
    .then(function (res) {
      gridCalendar.setData(res.data.RESULT_DATA);
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function saveOrderClosingCalendar() {
    gridCalendar.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridCalendar.dataProvider.getAllStateRows().created,
          gridCalendar.dataProvider.getAllStateRows().updated,
          gridCalendar.dataProvider.getAllStateRows().deleted,
          gridCalendar.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          let rowData = gridCalendar.dataProvider.getJsonRow(row);

          if (rowData.STRT_DATE instanceof Date) {
            rowData.STRT_DATE = rowData.STRT_DATE.format("yyyy-MM-ddT00:00:00");
          }
          if (rowData.END_DATE instanceof Date) {
            rowData.END_DATE = rowData.END_DATE.format("yyyy-MM-ddT00:00:00");
          }

          changeRowData.push(rowData);
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          let param = new FormData();

          param.append('WRK_TYPE', 'SAVE');
          param.append('changes', JSON.stringify(changeRowData));
          param.append('USER_ID', username);

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_UI_IM_07_S1',
            data: param
          })
          .then(function (res) {
            if (res.status === gHttpStatus.SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_IM_07_S1_P_RT_MSG), { close: false });
              loadOrderClosingCalendar();
            }
          })
          .catch(function (err) {
            console.log(err);
          });
        }
      }
    });
  }

  function deleteOrderClosingCalendar() {
    gridCalendar.gridView.commit(true);

    let checkedRows = gridCalendar.gridView.getCheckedRows();

    if (checkedRows.length === 0) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SELECT_DELETE'), { close: false });
    } else {
      showMessage(transLangKey('DELETE'), transLangKey('MSG_DELETE'), function (answer) {
        if (answer) {
          let params = new FormData();
          let checked = [];

          checkedRows.forEach(function (row) {
            let rowData = gridCalendar.dataProvider.getJsonRow(row);

            if (rowData.STRT_DATE instanceof Date) {
              rowData.STRT_DATE = rowData.STRT_DATE.format("yyyy-MM-ddT00:00:00");
            }
            if (rowData.END_DATE instanceof Date) {
              rowData.END_DATE = rowData.END_DATE.format("yyyy-MM-ddT00:00:00");
            }

            checked.push(rowData);
          })

          params.append('USER_ID', username);
          params.append('WRK_TYPE', "DELETE");
          params.append('changes', JSON.stringify(checked));

          zAxios({
            method: 'post',
            url: 'engine/mp/SRV_UI_IM_07_S1',
            data: params
          })
          .then(function (res) {
            if (res.data.RESULT_SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_IM_07_S1_P_RT_MSG), { close: false });
            } else {
              showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
            }

            loadOrderClosingCalendar();
          })
          .catch(function (err) {
            console.error(err);
          });
        }
      });
    }
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <LocationSearchBox ref={locationSearchBoxRef} keyValue={'locationName'} placeHolder={transLangKey("LOCAT_NM")}/>
            <InputField name='cyclTp' type='select' label={transLangKey('CYCL_TP')} options={selectOptions} control={control} />
          </SearchRow>
        </SearchArea>
        <ResultArea>
          <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch' }}>
            <ButtonArea>
              <LeftButtonArea>
                <GridExcelExportButton type='icon' grid='gridCalendar' options={exportExcelOptions}></GridExcelExportButton>
                <CommonButton title={transLangKey('BATCH_UPDATE')} onClick={() => { setOrderClosingCalendarNewBundleCreateOpen(true) }}>
                  <Icon.File />
                </CommonButton>
              </LeftButtonArea>
              <RightButtonArea>
                <GridAddRowButton type="icon" onClick={() => { setOrderClosingCalendarNewOpen(true) }}></GridAddRowButton>
                <GridDeleteRowButton type="icon" onClick={deleteOrderClosingCalendar}></GridDeleteRowButton>
                <GridSaveButton type="icon" onClick={saveOrderClosingCalendar}></GridSaveButton>
              </RightButtonArea>
            </ButtonArea>
            <Box style={{ height: '100%' }}>
              <BaseGrid id='gridCalendar' items={gridCalendarColumns} afterGridCreate={afterGridCalendar} />
            </Box>
          </Box>
        </ResultArea>
      </ContentInner>

      {orderClosingCalendarNewOpen && (<PopOrderClosingCalendarNew open={orderClosingCalendarNewOpen} onClose={() => {setOrderClosingCalendarNewOpen(false)}} confirm={loadOrderClosingCalendar}></PopOrderClosingCalendarNew>)}
      {orderClosingCalendarNewBundleCreateOpen && (<PopOrderClosingCalendarBundleCreate open={orderClosingCalendarNewBundleCreateOpen} onClose={() => {setOrderClosingCalendarNewBundleCreateOpen(false)}} confirm={loadOrderClosingCalendar}></PopOrderClosingCalendarBundleCreate>)}
    </>
  )
}

export default OrderClosingCalendar;
