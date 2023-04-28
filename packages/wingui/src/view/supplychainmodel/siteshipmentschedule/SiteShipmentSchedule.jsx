import React, { useState, useEffect, useRef } from 'react';
import {
  BaseGrid, ButtonArea, ContentInner, GridExcelExportButton, GridExcelImportButton, GridSaveButton, LeftButtonArea, ResultArea, 
  RightButtonArea, SearchArea, SearchRow, useViewStore, useUserStore, zAxios
} from '@zionex/wingui-core/src/common/imports';

import LocationSearchBox from '../common/LocationSearchBox';
import PopDailyExceptionSchedule from './PopDailyExceptionSchedule';
import PopMonthlyExceptionSchedule from './PopMonthlyExceptionSchedule';
import PopHoliday from './PopHoliday';
import PopShipmentSchedule from './PopShipmentSchedule';
import { setGridComboList } from "@wingui/view/supplychainmodel/common/common";

import '../common/common.css';

let gridShipmentScheduleColumns = [
  { name: 'SHPP_LEADTIME_DTL_ID', dataType: 'text', headerText: 'SHPP_LEADTIME_DTL_ID', visible: false, editable: false, width: 50 },
  { name: 'EXIST_HOLIDAY', dataType: 'text', headerText: 'EXIST_HOLIDAY', visible: false, editable: false, width: 50 },
  { name: 'EXIST_EXCEPTION', dataType: 'text', headerText: 'EXIST_EXCEPTION', visible: false, editable: false, width: 50 },
  { name: 'BOD_TYPE', dataType: 'text', headerText: 'BOD_TYPE', visible: false, editable: false, width: 100 },
  {
    name: 'CONSUME', dataType: 'group', orientation: 'horizontal', headerText: 'CONSUME', headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: 'CONSUME_LOC_TP', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: 80, groupShowMode: 'expand' },
      { name: 'CONSUME_LOC_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: 80, groupShowMode: 'expand' },
      { name: 'CONSUME_LOC_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: 80, groupShowMode: 'always' },
      { name: 'CONSUME_LOC_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: 120, groupShowMode: 'always' },
      { name: 'ACCOUNT_CD', dataType: 'text', headerText: 'ACCOUNT_CD', visible: false, editable: false, width: 50 },
      { name: 'ACCOUNT_NM', dataType: 'text', headerText: 'ACCOUNT_NM', visible: false, editable: false, width: 50 },
      { name: 'CHANNEL_NM', dataType: 'text', headerText: 'CHANNEL_NM', visible: false, editable: false, width: 50 },
      { name: 'INCOTERMS', dataType: 'text', headerText: 'INCOTERMS', visible: false, editable: false, width: 50 }
    ]
  },
  {
    name: 'SUPPLY', dataType: 'group', orientation: 'horizontal', headerText: 'SUPPLY', headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: 'SUPPLY_LOC_TP', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: 80, groupShowMode: 'expand' },
      { name: 'SUPPLY_LOC_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: 80, groupShowMode: 'expand' },
      { name: 'SUPPLY_LOC_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: 80, groupShowMode: 'always' },
      { name: 'SUPPLY_LOC_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: 120, groupShowMode: 'always' }
    ]
  },
  { name: 'VEHICL_TP', dataType: 'text', headerText: 'VEHICL_VAL', visible: true, editable: false, width: 100, autoFilter: true },
  {
    name: 'BOD_LEADTIME', dataType: 'group', orientation: 'horizontal', headerText: 'BOD_LEADTIME', headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: 'BOD_LEADTIME_SEQ', dataType: 'number', headerText: 'BOD_LEADTIME_SEQ', visible: true, editable: false, width: 100 },
      { name: 'BOD_LEADTIME_PERIOD', dataType: 'text', headerText: 'BOD_LEADTIME_PERIOD', visible: true, editable: false, width: 200 },
      { name: 'LEADTIME_TP', dataType: 'text', headerText: 'LEADTIME_TP', visible: true, editable: false, width: 80 },
      { name: 'BOD_LEADTIME', dataType: 'number', headerText: 'BOD_LEADTIME', visible: true, editable: false, width: 80 },
      { name: 'UOM_NM', dataType: 'text', headerText: 'UOM_NM', visible: true, editable: false, width: 80 }
    ]
  },
  { name: 'SHPP_SCHDL_TP_ID', dataType: 'text', headerText: 'SHIPPING_SCHDL_TP', visible: true, editable: false, width: 160, lookupDisplay: true, button: 'action', buttonVisibility: 'always' },
  { name: 'SHPP_SCHDL_TP_CD', dataType: 'text', headerText: 'SHPP_SCHDL_TP_CD', visible: false, editable: false, width: 50 },
  { name: 'EXCEPTION_SCHEDULE', dataType: 'text', headerText: 'EXCEPTION_SCHEDULE', visible: true, editable: false, width: 80, button: 'action', buttonVisibility: 'always' },
  { name: 'HOLIDAY', dataType: 'text', headerText: 'HOLIDAY', visible: true, editable: false, width: 80, button: 'action', buttonVisibility: 'always' },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: true, width: 50 },
  {
    name: "EDIT", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      {name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: 100, groupShowMode: "expand"},
      {name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: 140, groupShowMode: "expand"},
      {name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 100, groupShowMode: "always"},
      {name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 140, groupShowMode: "expand"}
    ]
  }
]

function SiteShipmentSchedule(props) {
  const [gridShipmentSchedule, setGridShipmentSchedule] = useState(null);
  const [username] = useUserStore(state => [state.username]);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const [dailyExceptionSchedulePopupOpen, setDailyExceptionSchedulePopupOpen] = useState(false);
  const [monthlyExceptionSchedulePopupOpen, setMonthlyExceptionSchedulePopupOpen] = useState(false);
  const [holidayPopupOpen, setHolidayPopupOpen] = useState(false);
  const [shipmentSchedulePopupOpen, setShipmentSchedulePopupOpen] = useState(false);
  const [popupData, setPopupData] = useState({});

  const consumeLocationSearchBoxRef = useRef();
  const supplyLocationSearchBoxRef = useRef();

  const [currentConsumeLocationRef, setCurrentConsumeLocationRef] = useState();
  const [currentSupplyLocationRef, setCurrentSupplyLocationRef] = useState();

  const exportOptions = {
    headerDepth: 1,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  };

  useEffect(() => {
    const gridObj = getViewInfo(vom.active, 'gridShipmentSchedule');
    if (gridObj) {
      if (gridObj.dataProvider) {
        if(gridShipmentSchedule != gridObj)
          setGridShipmentSchedule(gridObj);
      }
    }

    if (consumeLocationSearchBoxRef) {
      if (consumeLocationSearchBoxRef.current) {
        setCurrentConsumeLocationRef(consumeLocationSearchBoxRef.current);
      }
    }

    if (supplyLocationSearchBoxRef) {
      if (supplyLocationSearchBoxRef.current) {
        setCurrentSupplyLocationRef(supplyLocationSearchBoxRef.current);
      }
    }
  }, [viewData]);

  useEffect(() => {
    setViewInfo(vom.active, 'globalButtons', [
      { name: 'search', action: (e) => { loadShipmentSchedule(); }, visible: true, disable: false },
      { name: 'refresh', action: (e) => { refresh(); }, visible: true, disable: false }
    ]);

    if (gridShipmentSchedule) {
      setOptionsGridShipmentSchedule();
      setGridComboList(gridShipmentSchedule,
        'SHPP_SCHDL_TP_ID',
        'SHIPPING_SCHEDULE_TYPE'
        );
      loadShipmentSchedule();
    }

  }, [gridShipmentSchedule]);

  function setOptionsGridShipmentSchedule() {
    setVisibleProps(gridShipmentSchedule, true, true, false);

    gridShipmentSchedule.gridView.setEditOptions({
      insertable: true,
      appendable: true
    })

    gridShipmentSchedule.gridView.displayOptions.fitStyle = 'fill';

    gridShipmentSchedule.gridView.setColumnProperty('CONSUME_LOC_TP', 'mergeRule', { criteria: "value" });
    gridShipmentSchedule.gridView.setColumnProperty('CONSUME_LOC_LV', 'mergeRule', { criteria: "prevvalues + values[ 'CONSUME_LOC_LV' ]" });
    gridShipmentSchedule.gridView.setColumnProperty('CONSUME_LOC_CD', 'mergeRule', { criteria: "prevvalues + values[ 'CONSUME_LOC_CD' ]" });
    gridShipmentSchedule.gridView.setColumnProperty('CONSUME_LOC_NM', 'mergeRule', { criteria: "prevvalues + values[ 'CONSUME_LOC_NM' ]" });
    gridShipmentSchedule.gridView.setColumnProperty('SUPPLY_LOC_TP', 'mergeRule', { criteria: "prevvalues + values[ 'SUPPLY_LOC_TP' ]" });
    gridShipmentSchedule.gridView.setColumnProperty('SUPPLY_LOC_LV', 'mergeRule', { criteria: "prevvalues + values[ 'SUPPLY_LOC_LV' ]" });
    gridShipmentSchedule.gridView.setColumnProperty('SUPPLY_LOC_CD', 'mergeRule', { criteria: "prevvalues + values[ 'SUPPLY_LOC_CD' ]" });
    gridShipmentSchedule.gridView.setColumnProperty('SUPPLY_LOC_NM', 'mergeRule', { criteria: "prevvalues + values[ 'SUPPLY_LOC_NM' ]" });

    gridShipmentSchedule.gridView.setFixedOptions({colCount: 2, resizable: true});

    gridShipmentSchedule.gridView.onCellButtonClicked = function (currentGrid, clickData, column) {
      gridShipmentSchedule.gridView.commit(true);
      if (column.fieldName === 'SHPP_SCHDL_TP_ID') {
        setPopupData(gridShipmentSchedule.dataProvider.getOutputRow(null, clickData.dataRow));
        openShipmentSchedulePopup();
      } else if (column.fieldName === 'EXCEPTION_SCHEDULE') {
        setPopupData(gridShipmentSchedule.dataProvider.getValue(clickData.dataRow, 'SHPP_LEADTIME_DTL_ID'));
        let scheduleType = gridShipmentSchedule.dataProvider.getValue(clickData.dataRow, 'SHPP_SCHDL_TP_CD');
        if (scheduleType === 'DAILY') {
          openDailyExceptionSchedulePopup();
        } else if (scheduleType === 'MONTHLY') {
          openMonthlyExceptionSchedulePopup();
        } else {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5121'), { close: false });
        }
      } else if (column.fieldName === 'HOLIDAY') {
        setPopupData(gridShipmentSchedule.dataProvider.getValue(clickData.dataRow, 'SHPP_LEADTIME_DTL_ID'));
        openHolidayPopup();
      }
    }

    const exceptionScheduleCellStyleCallback = function (currentGrid, cell) {
      if (gridShipmentSchedule.dataProvider.getValue(cell.item.dataRow, 'EXIST_EXCEPTION') === 'Y') {
        return { styleName: 'exist-except-schedule-cell-bg' }
      }
    };

    let exceptionScheduleColumn = gridShipmentSchedule.gridView.columnByName('EXCEPTION_SCHEDULE');
    exceptionScheduleColumn.styleCallback = exceptionScheduleCellStyleCallback;

    const holidayCellStyleCallback = function (currentGrid, cell) {
      if (gridShipmentSchedule.dataProvider.getValue(cell.item.dataRow, 'EXIST_HOLIDAY') === 'Y') {
        return { styleName: 'exist-holiday-cell-bg' }
      }
    };

    let holidayColumn = gridShipmentSchedule.gridView.columnByName('HOLIDAY');
    holidayColumn.styleCallback = holidayCellStyleCallback;
  }

  function refresh() {
    currentConsumeLocationRef.reset();
    currentSupplyLocationRef.reset();

    gridShipmentSchedule.dataProvider.clearRows();
  }

  function saveShipmentSchedule() {
    gridShipmentSchedule.gridView.commit(true);

    let changedRow = [];

    changedRow = changedRow.concat(
      gridShipmentSchedule.dataProvider.getAllStateRows().created,
      gridShipmentSchedule.dataProvider.getAllStateRows().updated,
      gridShipmentSchedule.dataProvider.getAllStateRows().deleted,
      gridShipmentSchedule.dataProvider.getAllStateRows().createAndDeleted
    );

    if (changedRow.length === 0) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
    } else {
      showMessage(transLangKey('SAVE'), transLangKey('MSG_SAVE'), function (answer) {
        if (answer) {
          let formData = new FormData();
          let changes = [];

          changedRow.forEach(function (row) {
            let data = gridShipmentSchedule.dataProvider.getJsonRow(row);

            if (data.STRT_DATE instanceof Date) {
              data.STRT_DATE = new Date(data.STRT_DATE).format('yyyy-MM-ddT00:00:00');
            }
            if (data.END_DATE instanceof Date) {
              data.END_DATE = new Date(data.END_DATE).format('yyyy-MM-ddT00:00:00');
            }

            changes.push(data);
          });

          formData.append('WRK_TYPE', 'SAVE');
          formData.append('SHPP_LEADTIME_DTL_ID', props.data);
          formData.append('changes', JSON.stringify(changes));
          formData.append('USER_ID', username);

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_UI_CM_08_S1',
            data: formData
          })
            .then(function (res) {
              if (res.status === gHttpStatus.SUCCESS) {
                const rsData = res.data;
                if (rsData.RESULT_SUCCESS) {
                  const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_08_S1_P_RT_MSG;
                  msg === "MSG_0001" ? loadShipmentSchedule() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg)); 
                } else {
                  showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
                }
              }
            })
            .catch(function (e) {
              console.error(e);
            });
        }
      });
    }
  }

  function loadShipmentSchedule() {
    let formData = new FormData();

    formData.append('BOD_TYPE', '');
    formData.append('CONSUME_LOC_TP', currentConsumeLocationRef.getLocationType());
    formData.append('CONSUME_LOC_LV', currentConsumeLocationRef.getLocationLevel());
    formData.append('CONSUME_LOC_CD', currentConsumeLocationRef.getLocationCode());
    formData.append('CONSUME_LOC_NM', currentConsumeLocationRef.getLocationName());
    formData.append('SUPPLY_LOC_TP', currentSupplyLocationRef.getLocationType());
    formData.append('SUPPLY_LOC_LV', currentSupplyLocationRef.getLocationLevel());
    formData.append('SUPPLY_LOC_CD', currentSupplyLocationRef.getLocationCode());
    formData.append('SUPPLY_LOC_NM', currentSupplyLocationRef.getLocationName());
    formData.append('ACCOUNT_CD', '');
    formData.append('ACCOUNT_NM', '');
    formData.append('VEHICL_TP', '');
    formData.append('timeout', 0);
    formData.append('CURRENT_OPERATION_CALL_ID', 'OPC_GRID_LOAD');

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_CM_08_Q1',
      data: formData
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridShipmentSchedule.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
  }

  function openDailyExceptionSchedulePopup() {
    setDailyExceptionSchedulePopupOpen(true);
  }

  function closeDailyExceptionSchedulePopup() {
    setDailyExceptionSchedulePopupOpen(false);
  }

  function openMonthlyExceptionSchedulePopup() {
    setMonthlyExceptionSchedulePopupOpen(true);
  }

  function closeMonthlyExceptionSchedulePopup() {
    setMonthlyExceptionSchedulePopupOpen(false);
  }

  function openHolidayPopup() {
    setHolidayPopupOpen(true);
  }

  function closeHolidayPopup() {
    setHolidayPopupOpen(false);
  }

  function openShipmentSchedulePopup() {
    setShipmentSchedulePopupOpen(true);
  }

  function closeShipmentSchedulePopup() {
    setShipmentSchedulePopupOpen(false);
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <LocationSearchBox ref={consumeLocationSearchBoxRef} keyValue={'locationName'} label={transLangKey("CONSUME_LOCAT")} placeHolder={transLangKey("LOCAT_NM")}/>
            <LocationSearchBox ref={supplyLocationSearchBoxRef} keyValue={'locationName'} label={transLangKey("SUPPLY_LOCAT")} placeHolder={transLangKey("LOCAT_NM")}/>
          </SearchRow>
        </SearchArea>
        <ButtonArea>
          <LeftButtonArea>
            <GridExcelExportButton type="icon" grid="gridShipmentSchedule" options={exportOptions} />
          </LeftButtonArea>
          <RightButtonArea>
            <GridSaveButton type="icon" grid="gridShipmentSchedule" onClick={() => { saveShipmentSchedule() }}></GridSaveButton>
          </RightButtonArea>
        </ButtonArea>
        <ResultArea>
          <BaseGrid id="gridShipmentSchedule" items={gridShipmentScheduleColumns} />
        </ResultArea>
      </ContentInner>

      {dailyExceptionSchedulePopupOpen && (<PopDailyExceptionSchedule open={dailyExceptionSchedulePopupOpen} onClose={closeDailyExceptionSchedulePopup} confirm={loadShipmentSchedule} data={popupData} />)}
      {monthlyExceptionSchedulePopupOpen && (<PopMonthlyExceptionSchedule open={monthlyExceptionSchedulePopupOpen} onClose={closeMonthlyExceptionSchedulePopup} confirm={loadShipmentSchedule} data={popupData} />)}
      {holidayPopupOpen && (<PopHoliday open={holidayPopupOpen} onClose={closeHolidayPopup} confirm={loadShipmentSchedule} data={popupData} />)}
      {shipmentSchedulePopupOpen && (<PopShipmentSchedule open={shipmentSchedulePopupOpen} onClose={closeShipmentSchedulePopup} confirm={loadShipmentSchedule} data={popupData} />)}
    </>
  )
}

export default SiteShipmentSchedule;
