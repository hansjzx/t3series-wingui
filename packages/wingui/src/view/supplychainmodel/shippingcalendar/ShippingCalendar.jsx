import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import {
  ContentInner, GridSaveButton, SearchArea, SearchRow, ButtonArea, LeftButtonArea , RightButtonArea, ResultArea,
  GridExcelImportButton, GridExcelExportButton, InputField, BaseGrid, useViewStore, useUserStore, zAxios
} from '@zionex/wingui-core/src/common/imports';
import LocationSearchBox from '../common/LocationSearchBox';
import AccountSearchCondition from '../common/AccountSearchCondition';
import { setGridComboList } from "@wingui/view/supplychainmodel/common/common";

let gridShippingCalendarColumns = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: 100 },
  { name: "C_LOC_MGMT_ID", dataType: "text", headerText: "C_LOC_MGMT_ID", visible: false, editable: false, width: 100 },
  { name: "S_LOC_MGMT_ID", dataType: "text", headerText: "S_LOC_MGMT_ID", visible: false, editable: false, width: 100 },
  { name: "BOD_TYPE", dataType: "text", headerText: "BOD_TYPE", visible: false, editable: false, width: 80 },
  {
    name: "CONSUME_LOCAT", dataType: "group", orientation: "horizontal", headerText: "CONSUME_LOCAT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "CONSUME_LOC_TP", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: 80, groupShowMode: 'expand' },
      { name: "CONSUME_LOC_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: 80, groupShowMode: 'expand' },
      { name: "CONSUME_LOC_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: 80, groupShowMode: 'always' },
      { name: "CONSUME_LOC_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: 120, groupShowMode: 'always' },
      { name: "ACCOUNT_CD", dataType: "text", headerText: "ACCOUNT_CD", visible: true, editable: false, width: 80, groupShowMode: 'always' },
      { name: "ACCOUNT_NM", dataType: "text", headerText: "ACCOUNT_NM", visible: true, editable: false, width: 120, groupShowMode: 'always' },
      { name: "CHANNEL_NM", dataType: "text", headerText: "CHANNEL_NM", visible: true, editable: false, width: 80, groupShowMode: 'expand' },
      { name: "INCOTERMS", dataType: "text", headerText: "INCOTERMS", visible: true, editable: false, width: 100, groupShowMode: 'expand' }
    ]
  },
  {
    name: "SUPPLY_LOCAT", dataType: "group", orientation: "horizontal", headerText: "SUPPLY_LOCAT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "SUPPLY_LOC_TP", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: 80, groupShowMode: 'expand' },
      { name: "SUPPLY_LOC_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: 80, groupShowMode: 'expand' },
      { name: "SUPPLY_LOC_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: 80, groupShowMode: 'always' },
      { name: "SUPPLY_LOC_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: 120, groupShowMode: 'always' }
    ]
  },
  { name: "VEHICL_TP", dataType: "text", headerText: "VEHICL_TP", visible: true, editable: false, width: 100, autoFilter: true },
  {
    name: "BOD_LEADTIME", dataType: "group", orientation: "horizontal", headerText: "BOD_LEADTIME", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "BOD_LEADTIME_SEQ", dataType: "text", headerText: "BOD_LEADTIME_SEQ", visible: true, editable: false, width: 110 },
      { name: "BOD_LEADTIME_PERIOD", dataType: "text", headerText: "BOD_LEADTIME_PERIOD", visible: true, editable: false, width: 110 },
      { name: "LT_TP", dataType: "text", headerText: "LT_TP", visible: true, editable: false, width: 80 },
      { name: "BOD_LEADTIME", dataType: "number", headerText: "BOD_LEADTIME", visible: true, editable: false, width: 100 },
      { name: "UOM_NM", dataType: "text", headerText: "UOM_NM", visible: true, editable: false, width: 100, useDropdown: true, lookupDisplay: true }
    ]
  },
  { name: "CALENDAR_ID", dataType: "text", headerText: "CALENDAR_ID", visible: true, editable: false, width: 120, autoFilter: true },
  { name: "CALENDAR_DESCRIP", dataType: "text", headerText: "CALENDAR_DESCRIP", visible: true, editable: true, width: 120, autoFilter: true },
  { name: "STRT_DATE", dataType: "datetime", headerText: "STRT_DATE", visible: true, editable: true, width: 120, format: "yyyy-MM-dd" },
  { name: "END_DATE", dataType: "datetime", headerText: "END_DATE", visible: true, editable: true, width: 120, format: "yyyy-MM-dd" },
  { name: "CYCL_TP_ID", dataType: "text", headerText: "CYCL_TP", visible: true, editable: true, width: 120, autoFilter: true, useDropdown: true, lookupDisplay: true },
  { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: 60 },
  {
    name: "EDIT", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: 100, groupShowMode: "expand" },
      { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: 140, groupShowMode: "expand" },
      { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 100, groupShowMode: "always" },
      { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 140, groupShowMode: "expand" }
    ]
  }
];

function ShippingCalendar() {
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo])

  const [gridShippingCalendar, setGridShippingCalendar] = useState(null);
  const [username] = useUserStore(state => [state.username]);

  const consumeLocationSearchBoxRef = useRef();
  const [currentConsumeLocationRef, setCurrentConsumeLocationRef] = useState();

  const accountSearchRef = useRef();
  const [currentAccountRef, setCurrentAccountRef] = useState();

  const supplyLocationSearchBoxRef = useRef();
  const [currentSupplyLocationRef, setCurrentSupplyLocationRef] = useState();

  // grid Object init
  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, 'gridShippingCalendar');
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        setGridShippingCalendar(grdObj1)
      }
    }

    if (consumeLocationSearchBoxRef) {
      if (consumeLocationSearchBoxRef.current) {
        setCurrentConsumeLocationRef(consumeLocationSearchBoxRef.current);
      }
    }

    if (accountSearchRef) {
      if (accountSearchRef.current) {
        setCurrentAccountRef(accountSearchRef.current);
      }
    }

    if (supplyLocationSearchBoxRef) {
      if (supplyLocationSearchBoxRef.current) {
        setCurrentSupplyLocationRef(supplyLocationSearchBoxRef.current);
      }
    }
  }, [viewData])

  //3. 상태 메시지
  //4. FORM 데이터 처리
  const { reset, control, getValues, clearErrors }
    = useForm({
      defaultValues: {
        startDate: '',
        endDate: ''
      }
    });

  const globalButtons = [
    { name: 'search', action: (e) => { onSubmit() }, visible: true, disable: false },
    { name: 'refresh', action: (e) => { refresh() }, visible: true, disable: false }
  ]

  const exportExceloptions = {
    headerDepth: 2,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  }

  useEffect(() => {
    if (gridShippingCalendar) {
      setViewInfo(vom.active, 'globalButtons', globalButtons);

      setOptions();
      setGridComboList(gridShippingCalendar, 'UOM_NM, CYCL_TP_ID', 'TIME_UOM, CALENDAR_CYCL_TP');
      loadShippingCalendar();
    }
  }, [gridShippingCalendar]);

  const onSubmit = (data) => {
    loadShippingCalendar(data);
  };

  const refresh = () => {
    currentConsumeLocationRef.reset();
    currentAccountRef.reset();
    currentSupplyLocationRef.reset();
    reset();
    gridShippingCalendar.dataProvider.clearRows();
  }

  function setOptions() {
    setVisibleProps(gridShippingCalendar, true, true, false);

    gridShippingCalendar.gridView.displayOptions.fitStyle = 'even';

    gridShippingCalendar.gridView.setFixedOptions({colCount: 2, resizable: true});
  }

  async function loadShippingCalendar() {
    let param = new URLSearchParams();

    param.append('CONSUME_LOCAT_TP', currentConsumeLocationRef.getLocationType());
    param.append('CONSUME_LOCAT_LV', currentConsumeLocationRef.getLocationLevel());
    param.append('CONSUME_LOCAT_CD', currentConsumeLocationRef.getLocationCode());
    param.append('CONSUME_LOCAT_NM', currentConsumeLocationRef.getLocationName());
    param.append('ACCOUNT_CD', currentAccountRef.getAccountCode());
    param.append('ACCOUNT_NM', currentAccountRef.getAccountName());
    param.append('SUPPLY_LOCAT_TP', currentSupplyLocationRef.getLocationType());
    param.append('SUPPLY_LOCAT_LV', currentSupplyLocationRef.getLocationLevel());
    param.append('SUPPLY_LOCAT_CD', currentSupplyLocationRef.getLocationCode());
    param.append('SUPPLY_LOCAT_NM', currentSupplyLocationRef.getLocationName());
    param.append('CALENDAR_DESC', '');
    param.append('CYCL_TP', '');
    param.append('START_DATE', getValues('startDate') == null ? '' : getValues('startDate'));
    param.append('END_DATE', getValues('endDate') == null ? '' : getValues('endDate'));

    gridShippingCalendar.gridView.commit(true);

    await zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_CM_14_Q1',
      data: param
    })
      .then(function (res) {
        gridShippingCalendar.dataProvider.fillJsonData(res.data.RESULT_DATA);
      })
      .catch(function (err) {
        console.log(err);
      }).then(function () {
        gridShippingCalendar.gridView.hideToast();
      });
  }


  function saveShippingCalendar() {
    gridShippingCalendar.gridView.commit(true);
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridShippingCalendar.dataProvider.getAllStateRows().created,
          gridShippingCalendar.dataProvider.getAllStateRows().updated,
          gridShippingCalendar.dataProvider.getAllStateRows().deleted,
          gridShippingCalendar.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          let rowData = gridShippingCalendar.dataProvider.getJsonRow(row);

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
          let formData = new FormData();
          formData.append('USER_ID', username);
          formData.append('CHANGES', JSON.stringify(changeRowData));

          zAxios.post(baseURI() + 'engine/mp/SRV_UI_CM_14_S1', formData)
            .then(function (res) {
              if (res.status === gHttpStatus.SUCCESS) {
                const rsData = res.data;
                if (rsData.RESULT_SUCCESS) {
                  const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_14_S1_P_RT_MSG;
                  msg === "MSG_0001" ? loadShippingCalendar() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg));
                } else {
                  showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
                }
              }
            })
            .catch(function (e) {
              console.error(e);
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
          <LocationSearchBox ref={consumeLocationSearchBoxRef} keyValue={'locationName'} label={transLangKey("CONSUME_LOCAT")} placeHolder={transLangKey("LOCAT_NM")} style={{width: 250}}/>
          <AccountSearchCondition ref={accountSearchRef}></AccountSearchCondition>
          <LocationSearchBox ref={supplyLocationSearchBoxRef} keyValue={'locationName'} label={transLangKey("SUPPLY_LOCAT")} placeHolder={transLangKey("LOCAT_NM")} style={{width: 250}}/>
          <InputField name='startDate' type='datetime' label={transLangKey('STRT_DATE')} dateformat="yyyy-MM-dd" control={control}/>
          <InputField name='endDate' type='datetime' label={transLangKey('END_DATE')} dateformat="yyyy-MM-dd"control={control}/>
        </SearchRow>
      </SearchArea>
      <ResultArea>
        <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch' }}>
          <ButtonArea>
            <LeftButtonArea>
              <GridExcelExportButton type='icon' grid='gridShippingCalendar' options={exportExceloptions}></GridExcelExportButton>
              {/*<GridExcelImportButton type='icon' grid='gridShippingCalendar'></GridExcelImportButton>*/}
            </LeftButtonArea>
            <RightButtonArea>
              <GridSaveButton type="icon" onClick={saveShippingCalendar}></GridSaveButton>
            </RightButtonArea>
          </ButtonArea>
          <Box style={{ height: '100%' }}>
            <BaseGrid id='gridShippingCalendar' items={gridShippingCalendarColumns}></BaseGrid>
          </Box>
        </Box>
      </ResultArea>
    </ContentInner>
    </>
  )
}

export default ShippingCalendar;
