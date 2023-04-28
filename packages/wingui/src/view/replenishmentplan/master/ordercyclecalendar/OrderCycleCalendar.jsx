import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Box } from "@mui/material";
import {
  BaseGrid, ButtonArea, ContentInner, GridAddRowButton, GridDeleteRowButton, GridExcelExportButton, GridSaveButton,
  InputField, LeftButtonArea, RightButtonArea, SearchArea, SearchRow, useUserStore, useViewStore, zAxios
} from "@zionex/wingui-core/src/common/imports";
import { getCodeList, setGridComboList } from '@wingui/view/supplychainmodel/common/common';

import LocationSearchBox from '@wingui/view/supplychainmodel/common/LocationSearchBox';
import PopExceptionSchedule from "./PopExceptionSchedule";
import PopMonthlyExceptionSchedule from "./PopMonthlyExceptionSchedule";
import PopOrderCycleCalendarNew from "./PopOrderCycleCalendarNew";
import PopOrderCycleCalendar from "./PopOrderCycleCalendar";

import '../../../supplychainmodel/common/common.css';

let gridOrderCycleColumns = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, width: "100" },
  { name: "LOCAT_MGMT_ID", dataType: "text", headerText: "LOCAT_MGMT_ID", visible: false, width: "100" },
  { name: "LOCAT_ID", dataType: "text", headerText: "LOCAT_ID", visible: false, width: "100" },
  { name: "EXIST_EXCEPTION", dataType: "text", headerText: "EXIST_EXCEPTION", visible: false, width: "100" },
  { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "80" },
  { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "80" },
  { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "80" },
  { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "100" },
  { name: "CALENDAR_ID", dataType: "text", headerText: "CALENDAR_ID", visible: true, editable: false, width: "100" },
  { name: "DESCRIP", dataType: "text", headerText: "DESCRIP", visible: true, editable: false, width: "130", autoFilter: true },
  {
    name: "STOCK_MGMT_SYSTEM", dataType: "group", orientation: "horizontal", headerText: "STOCK_MGMT_SYSTEM", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "INV_MGMT_SYSTEM_TP", dataType: "text", headerText: "STOCK_MGMT_SYSTEM_TP", visible: true, editable: false, width: "100", autoFilter: true, useDropdown: true, lookupDisplay: true },
      { name: "OPERT_BASE_TP", dataType: "text", headerText: "OPERT_BASE_TP", visible: true, editable: false, width: "100", autoFilter: true, useDropdown: true, lookupDisplay: true }
    ]
  },
  { name: "PO_CYCL_TP", dataType: "text", headerText: "PO_CYCL_TP", visible: true, editable: false, width: "120", autoFilter: true, useDropdown: true, lookupDisplay: true, button: "action", buttonVisibility: "always" },
  { name: "PO_CYCL_TP_CD", dataType: "text", headerText: "PO_CYCL_TP", visible: false, editable: false, width: "100" },
  { name: "EXCEPTION_SCHEDULE", dataType: "text", headerText: "EXCEPTION_SCHEDULE", visible: true, editable: false, width: "80", button: "action", buttonVisibility: "always" },
  { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "60" },
  {
    name: "EDIT", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: "100", groupShowMode: "expand" },
      { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: "120", groupShowMode: "expand" },
      { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: "100", groupShowMode: "always" },
      { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: "120", groupShowMode: "expand" }
    ]
  }
];

function OrderCycleCalendar() {
  const globalButtons = [
    { name: "search", action: (e) => { loadOrderCycleCalendar() }, visible: true, disable: false },
    { name: "refresh", action: (e) => { refresh() }, visible: true, disable: false }
  ];

  const exportExcelOptions = {
    headerDepth: 2,
    footer: "default",
    allColumns: true,
    lookupDisplay: true,
    separateRows: true
  };

  const [username] = useUserStore(state => [state.username]);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [gridOrderCycle, setGridOrderCycle] = useState(null);

  const locationSearchBoxRef = useRef();
  const [currentLocationRef, setCurrentLocationRef] = useState();

  const [invMgmtSystemTpOptions, setInvMgmtSystemTpOptions] = useState([]);
  const [opertBaseTpOptions, setOpertBaseTpOptions] = useState([]);
  const [poCyclTpOptions, setPoCyclTpOptions] = useState([]);
  const [exceptionSchedulePopupOpen, setPopupExceptionScheduleOpen] = useState(false);
  const [monthlyExceptionSchedulePopupOpen, setPopupMonthlyExceptionScheduleOpen] = useState(false);
  const [exceptionScheduleParam, setExceptionScheduleParam] = useState("");
  const [orderCycleCalendarPopupOpen, setPopupOrderCycleCalendarOpen] = useState(false);
  const [editOrderCycleCalendarPopupOpen, setEditPopupOrderCycleCalendarOpen] = useState(false);
  const [popupData, setPopupData] = useState({});
  const [currentOrderCycleCalendar, setCurrentOrderCycleCalendar] = useState({});

  const { reset, control } = useForm({
    defaultValues: { }
  });

  useEffect(() => {
    if (locationSearchBoxRef) {
      if (locationSearchBoxRef.current) {
        setCurrentLocationRef(locationSearchBoxRef.current);
      }
    }
  }, [viewData]);

  useEffect(() => {
    async function setComboData() {
      let dataArr = await getCodeList('INVENTORY_MGMT_SYSTEM_TYPE, INVENTORY_SUPPLY_DATE_TYPE, ORDERING_SCHEDULE_TYPE');

      let invMgmtSystemTpArr = dataArr.filter(code => code.GROUP == 'INVENTORY_MGMT_SYSTEM_TYPE').map(data => ({ value: data.ID, label: data.CD_NM }));
      let opertBaseTpArr = dataArr.filter(code => code.GROUP == 'INVENTORY_SUPPLY_DATE_TYPE').map(data => ({ value: data.ID, label: data.CD_NM }));
      let poCyclTpArr = dataArr.filter(code => code.GROUP == 'ORDERING_SCHEDULE_TYPE').map(data => ({ value: data.ID, label: data.CD_NM }));

      setInvMgmtSystemTpOptions(invMgmtSystemTpArr);
      setOpertBaseTpOptions(opertBaseTpArr);
      setPoCyclTpOptions(poCyclTpArr);

      setPopupData({ invMgmtSystemTpOptions: invMgmtSystemTpArr, opertBaseTpOptions: opertBaseTpArr, poCyclTpOptions: poCyclTpArr });
    }

    setComboData();
  }, []);

  useEffect(() => {
    if (gridOrderCycle) {
      setViewInfo(vom.active, "globalButtons", globalButtons);
      loadOrderCycleCalendar();
    }
  }, [gridOrderCycle]);

  function afterGridOrderCycle(gridObj) {
    setGridOrderCycle(gridObj);
    setGridOrderCycleOptions(gridObj);
  }

  function refresh() {
    currentLocationRef.reset();
    reset();
    gridOrderCycle.dataProvider.clearRows();
  }

  function setGridOrderCycleOptions(gridObj) {
    setVisibleProps(gridObj, true, true, true);
    gridObj.gridView.filteringOptions.automating.lookupDisplay = true;

    gridObj.gridView.setDisplayOptions({
      fitStyle: "fill"
    });

    var fields = ["LOCAT_TP_NM", "LOCAT_LV", "LOCAT_CD", "LOCAT_NM", "CALENDAR_ID", "DESCRIP"];
    var dirs = [];
    gridObj.gridView.orderBy(fields, dirs);

    gridObj.gridView.setColumnProperty("LOCAT_TP_NM", "mergeRule", { criteria: "value" });
    gridObj.gridView.setColumnProperty("LOCAT_LV", "mergeRule", { criteria: "prevvalues + value" });
    gridObj.gridView.setColumnProperty("LOCAT_CD", "mergeRule", { criteria: "prevvalues + value" });
    gridObj.gridView.setColumnProperty("LOCAT_NM", "mergeRule", { criteria: "prevvalues + value" });

    gridObj.gridView.onCellButtonClicked = function (grid, index, column) {
      if (column.fieldName === 'PO_CYCL_TP') {
        setCurrentOrderCycleCalendar(grid.getValues(index.itemIndex));
        setEditPopupOrderCycleCalendarOpen(true);
      } else if (column.fieldName === "EXCEPTION_SCHEDULE") {
        setExceptionScheduleParam(grid.getValues(index.itemIndex).ID);
        if (grid.getValues(index.itemIndex).PO_CYCL_TP_CD === "DAILY") {
          setPopupExceptionScheduleOpen(true);
        } else if (grid.getValues(index.itemIndex).PO_CYCL_TP_CD === "MONTHLY") {
          setPopupMonthlyExceptionScheduleOpen(true);
        }
      } else if (column.filedName === "PO_CYCL_TP") {
        setPopupEditOrderCycleCalendarOpen(true);
      }
    }

    setGridComboList(gridObj, 'INV_MGMT_SYSTEM_TP, OPERT_BASE_TP, PO_CYCL_TP', 'INVENTORY_MGMT_SYSTEM_TYPE, INVENTORY_SUPPLY_DATE_TYPE, ORDERING_SCHEDULE_TYPE');

    const exceptionScheduleCellStyleCallback = function (currentGrid, cell) {
      if (gridObj.dataProvider.getValue(cell.item.dataRow, 'EXIST_EXCEPTION') === 'Y') {
        return { styleName: 'exist-except-schedule-cell-bg' }
      }
    };

    let exceptionScheduleColumn = gridObj.gridView.columnByName('EXCEPTION_SCHEDULE');
    exceptionScheduleColumn.styleCallback = exceptionScheduleCellStyleCallback;

  }

  function openPopupOrderCycleCalendarNew() {
    setPopupOrderCycleCalendarOpen(true);
  }

  function loadOrderCycleCalendar() {
    let param = new FormData();

    param.append('LOCAT_TP', currentLocationRef.getLocationType());
    param.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    param.append('LOCAT_CD', currentLocationRef.getLocationCode());
    param.append('LOCAT_NM', currentLocationRef.getLocationName());
    param.append("CALENDAR_DESCRIP", "");
    param.append("INV_MGMT_SYSTEM_TP", "");
    param.append("OPERT_BASE_TP", "");
    param.append("PO_CYCL_TP", "");

    zAxios({
      method: "post",
      url: baseURI() + "engine/mp/SRV_UI_IM_06_Q1",
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridOrderCycle.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function saveOrderCycleCalendar() {
    gridOrderCycle.gridView.commit(true);

    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridOrderCycle.dataProvider.getAllStateRows().created,
          gridOrderCycle.dataProvider.getAllStateRows().updated,
          gridOrderCycle.dataProvider.getAllStateRows().deleted,
          gridOrderCycle.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          changeRowData.push(gridOrderCycle.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"), { close: false });
        } else {
          let param = new FormData();

          param.append("WRK_TYPE", "SAVE");
          param.append("TYPE", "PO_CALENDAR");
          param.append("changes", JSON.stringify(changeRowData));
          param.append("USER_ID", username);

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_UI_IM_06_S1',
            data: param
          })
          .then(function (res) {
            if (res.status === gHttpStatus.SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_IM_06_S1_P_RT_MSG), { close: false });
              loadOrderCycleCalendar();
            }
          })
          .catch(function (err) {
            console.log(err);
          });
        }
      }
    });
  }

  function onDelete(targetGrid, deleteRows) {
    let param = new FormData();

    param.append('WRK_TYPE', "DELETE");
    param.append('changes', JSON.stringify(deleteRows));
    param.append('USER_ID', username);

    if (deleteRows.length > 0) {
      zAxios({
        method: 'post',
        url: baseURI() + 'engine/mp/SRV_UI_IM_06_S1',
        data: param
      })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_IM_06_S1_P_RT_MSG), { close: false });
        } else {
          showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
        }
      })
      .catch(function (err) {
        console.log(err);
      });
    }
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <LocationSearchBox ref={locationSearchBoxRef} keyValue={'locationName'} placeHolder={transLangKey("LOCAT_NM")}/>
            <InputField type="select" name="invMgmtSystemTp" label={transLangKey("STOCK_MGMT_SYSTEM")} style={{display: "none"}} control={control} options={invMgmtSystemTpOptions} />
            <InputField type="select" name="opertBaseTp" label={transLangKey("OPERT_BASE_TP")} style={{display: "none"}} control={control} options={opertBaseTpOptions} />
            <InputField type="select" name="poCyclTp" label={transLangKey("PO_CYCL_TP")} style={{display: "none"}} control={control} options={poCyclTpOptions} />
          </SearchRow>
        </SearchArea>

        <Box style={{ height: "100%" }}>
          <ButtonArea>
            <LeftButtonArea>
              <GridExcelExportButton type="icon" grid="gridOrderCycle" options={exportExcelOptions} />
            </LeftButtonArea>
            <RightButtonArea>
              <GridAddRowButton type="icon" onClick={() => { openPopupOrderCycleCalendarNew() }} />
              <GridDeleteRowButton type="icon" grid="gridOrderCycle" onDelete={onDelete} />
              <GridSaveButton type="icon" onClick={() => { saveOrderCycleCalendar() }} />
            </RightButtonArea>
          </ButtonArea>
          <Box style={{ height: "calc(100% - 53px)" }}>
            <BaseGrid id="gridOrderCycle" items={gridOrderCycleColumns} afterGridCreate={afterGridOrderCycle} />
          </Box>
        </Box>

      </ContentInner>
      {exceptionSchedulePopupOpen && (<PopExceptionSchedule open={exceptionSchedulePopupOpen} onClose={() => { setPopupExceptionScheduleOpen(false); }} confirm={loadOrderCycleCalendar} param={exceptionScheduleParam} />)}
      {monthlyExceptionSchedulePopupOpen && (<PopMonthlyExceptionSchedule open={monthlyExceptionSchedulePopupOpen} onClose={() => { setPopupMonthlyExceptionScheduleOpen(false); }} confirm={loadOrderCycleCalendar} param={exceptionScheduleParam} />)}
      {orderCycleCalendarPopupOpen && (<PopOrderCycleCalendarNew open={orderCycleCalendarPopupOpen} onClose={() => { setPopupOrderCycleCalendarOpen(false);}} confirm={loadOrderCycleCalendar} data={popupData} />)}
      {editOrderCycleCalendarPopupOpen && (<PopOrderCycleCalendar open={editOrderCycleCalendarPopupOpen} onClose={() => { setEditPopupOrderCycleCalendarOpen(false);}} confirm={loadOrderCycleCalendar} data={currentOrderCycleCalendar} />)}
    </>
  )
}

export default OrderCycleCalendar;
