import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { ContentInner, SearchArea, SearchRow, ButtonArea, LeftButtonArea, GridExcelExportButton, InputField, BaseGrid, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import PopSimulationVersion from '@wingui/view/masterplan/common/PopSimulationVersion';
import ItemSearchBox from '@wingui/view/supplychainmodel/common/ItemSearchBox';

let gridPlanDetailColumns = [
  {
    name: "DMND_INFO", dataType: "group", orientation: "horizontal", headerText: "DMND_INFO", headerVisible: true, expandable: true, expanded: false,
    childs: [
      { name: 'PLAN_SEQ', dataType: 'number', headerText: 'SEQ', visible: true, editable: false, width: '50', groupShowMode: "always" },
      { name: 'DMND_ID', dataType: 'text', headerText: 'DMND_ID', visible: true, editable: false, width: '170', groupShowMode: "always" },
      { name: 'PO_ID', dataType: 'text', headerText: 'PO_ID', visible: true, editable: false, width: '170', groupShowMode: "expand" },
      { name: 'DMND_TP_NM', dataType: 'text', headerText: 'DMND_TP_NM', visible: true, editable: false, width: '100', groupShowMode: "expand" },
      { name: 'DMND_CLASS_NM', dataType: 'text', headerText: 'DMND_CLASS_NM', visible: true, editable: false, width: '100', groupShowMode: "expand" },
      { name: 'URGENT_ORDER_TP_NM', dataType: 'text', headerText: 'URGENT_ORDER_TP', visible: true, editable: false, width: '100', groupShowMode: "expand" },
      { name: 'ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', visible: true, editable: false, width: '80', groupShowMode: "expand" },
      { name: 'ITEM_NM', dataType: 'text', headerText: 'ITEM_NM', visible: true, editable: false, width: '120', groupShowMode: "always" },
      { name: 'ITEM_DESCRIP', dataType: 'text', headerText: 'ITEM_DESCRIP', visible: true, editable: false, width: '100', groupShowMode: "expand" },
      { name: 'ITEM_TP_NM', dataType: 'text', headerText: 'ITEM_TP_NM', visible: true, editable: false, width: '100', groupShowMode: "expand" },
      { name: 'DMND_QTY', dataType: 'number', headerText: 'DMND_QTY', visible: true, editable: false, width: '70', groupShowMode: "always" },
      { name: 'UOM_NM', dataType: 'text', headerText: 'UOM_NM', visible: true, editable: false, width: '70', groupShowMode: "expand" },
      { name: 'DUE_DATE', dataType: 'datetime', headerText: 'DUE_DATE', visible: true, editable: false, width: '100', format: 'yyyy-MM-dd', groupShowMode: "always" },
      { name: 'REQUEST_SITE_ID', dataType: 'text', headerText: 'REQUEST_SITE_ID', visible: true, editable: false, width: '80', groupShowMode: "expand" },
      { name: 'REQUEST_SITE_DESCRIP', dataType: 'text', headerText: 'REQUEST_SITE_DESCRIP', visible: true, editable: false, width: '120', groupShowMode: "expand" },
      { name: 'ACCOUNT_CD', dataType: 'text', headerText: 'ACCOUNT_CD', visible: true, editable: false, width: '100', autoFilter: true, groupShowMode: "expand" },
      { name: 'ACCOUNT_NM', dataType: 'text', headerText: 'ACCOUNT_NM', visible: true, editable: false, width: '120', autoFilter: true, groupShowMode: "always" },
      { name: 'CHANNEL_NM', dataType: 'text', headerText: 'CHANNEL_NM', visible: true, editable: false, width: '80', groupShowMode: "expand" },
      { name: 'INCOTERMS', dataType: 'text', headerText: 'INCOTERMS', visible: true, editable: false, width: '80', groupShowMode: "expand" },
      { name: 'SALES_PRIC', dataType: 'number', headerText: 'SALES_UNIT_PRIC', visible: true, editable: false, width: '80', groupShowMode: "expand" },
      { name: 'MARGIN', dataType: 'number', headerText: 'MARGIN', visible: true, editable: false, width: '100', groupShowMode: "expand" },
      { name: 'CURRENCY', dataType: 'text', headerText: 'CURCY_CD', visible: true, editable: false, width: '80', groupShowMode: "expand" },
      { name: 'DELIVY_DATE', dataType: 'datetime', headerText: 'DELIVY_DATE', visible: true, editable: false, width: '100', format: 'yyyy-MM-dd', groupShowMode: "expand" },
      { name: 'DAYS_LATE', dataType: 'number', headerText: 'DAYS_LATE', visible: true, editable: false, width: '90', groupShowMode: "expand" },
      { name: 'DELIVY_QTY', dataType: 'number', headerText: 'DELIVY_QTY', visible: true, editable: false, width: '90', groupShowMode: "expand" },
      { name: 'ON_TIME_QTY', dataType: 'number', headerText: 'ON_TIME_QTY', visible: true, editable: false, width: '90', groupShowMode: "expand" },
      { name: 'LATE_QTY', dataType: 'number', headerText: 'LATE_QTY', visible: true, editable: false, width: '90', groupShowMode: "expand" },
      { name: 'SHORTAGE_QTY', dataType: 'number', headerText: 'SHORTAGE_QTY', visible: true, editable: false, width: '90', groupShowMode: "expand" },
      { name: 'NETTING_QTY', dataType: 'number', headerText: 'NETTING_QTY', visible: true, editable: false, width: '90', groupShowMode: "expand" }
    ]
  },
  { name: 'PROBLEM_DESCRIP', dataType: 'text', headerText: 'PROBLEM_DESCRIP', visible: true, editable: false, width: '300' },
  {
    name: "PLAN_DETAIL", dataType: "group", orientation: "horizontal", headerText: "PLAN_DETAIL", headerVisible: true, expandable: true, expanded: false,
    childs: [
      { name: 'DT_ACTIVITY_ID', dataType: 'text', headerText: 'ACTIVITY_ID', visible: true, editable: false, width: '120', groupShowMode: "always" },
      { name: 'DT_TRACKING_LV', dataType: 'number', headerText: 'TRACKING_LV', visible: true, editable: false, width: '100', groupShowMode: "always" },
      { name: 'DT_LOCAT_TP_NM', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: '80', groupShowMode: "expand" },
      { name: 'DT_LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: '80', groupShowMode: "expand" },
      { name: 'DT_LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: '100', autoFilter: true, groupShowMode: "always" },
      { name: 'DT_LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: '150', autoFilter: true, groupShowMode: "always" },
      { name: 'DT_RES_CD', dataType: 'text', headerText: 'RES_CD', visible: true, editable: false, width: '100', autoFilter: true, groupShowMode: "always" },
      { name: 'DT_RES_DESCRIP', dataType: 'text', headerText: 'RES_DESCRIP', visible: true, editable: false, width: '120', autoFilter: true, groupShowMode: "always" },
      { name: 'DT_ACTIVITY_TP', dataType: 'text', headerText: 'ACTIVITY_TP', visible: true, editable: false, width: '100', groupShowMode: "expand" },
      { name: 'DT_ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', visible: true, editable: false, width: '100', autoFilter: true, groupShowMode: "always" },
      { name: 'DT_ITEM_NM', dataType: 'text', headerText: 'ITEM_NM', visible: true, editable: false, width: '120', autoFilter: true, groupShowMode: "always" },
      { name: 'DT_ITEM_DESCRIP', dataType: 'text', headerText: 'DESCRIP', visible: true, editable: false, width: '100', groupShowMode: "expand" },
      { name: 'DT_ITEM_TP_NM', dataType: 'text', headerText: 'ITEM_TP_NM', visible: true, editable: false, width: '100', groupShowMode: "expand" },
      { name: 'DT_DELIVY_DATE', dataType: 'datetime', headerText: 'DELIVY_DATE', visible: true, editable: false, width: '100', format: 'yyyy-MM-dd', groupShowMode: "always" },
      { name: 'DT_DELIVY_QTY', dataType: 'number', headerText: 'DELIVY_QTY', visible: true, editable: false, width: '100', groupShowMode: "always" },
      { name: 'DT_PRODUCT_START', dataType: 'datetime', headerText: 'PRODUCTION_START', visible: true, editable: false, width: '100', format: 'yyyy-MM-dd', groupShowMode: "always" },
      { name: 'DT_INWH_DATE', dataType: 'datetime', headerText: 'INWH_DATE', visible: true, editable: false, width: '100', format: 'yyyy-MM-dd', groupShowMode: "always" },
      { name: 'DT_INWH_QTY', dataType: 'number', headerText: 'INWH_QTY', visible: true, editable: false, width: '100', groupShowMode: "always" },
      { name: 'DT_WAIT_TIME', dataType: 'number', headerText: 'WAIT_TIME', visible: true, editable: false, width: '100', groupShowMode: "expand" },
      { name: 'DT_RELEASE_DATE', dataType: 'datetime', headerText: 'RELEASE_DATE', visible: true, editable: false, width: '100', format: 'yyyy-MM-dd', groupShowMode: "always" },
      { name: 'DT_RELEASE_QTY', dataType: 'number', headerText: 'RELEASE_QTY', visible: true, editable: false, width: '100', groupShowMode: "always" },
      { name: 'DT_STOCK', dataType: 'number', headerText: 'STOCK', visible: true, editable: false, width: '100', groupShowMode: "expand" },
      { name: 'DT_VEHICL_TP', dataType: 'text', headerText: 'VEHICL_VAL', visible: true, editable: false, width: '100', groupShowMode: "expand" },
      { name: 'DT_BOD_LEADTIME_PERIOD', dataType: 'text', headerText: 'BOD_LEADTIME_PERIOD', visible: true, editable: false, width: '100', groupShowMode: "expand" },
      { name: 'DT_BOD_LEADTIME', dataType: 'number', headerText: 'BOD_LEADTIME', visible: true, editable: false, width: '100', groupShowMode: "expand" },
      { name: 'DT_NOTE', dataType: 'text', headerText: 'NOTE', visible: true, editable: false, width: '100', groupShowMode: "expand" }
    ]
  }
];

function PlanDetail() {
  const [gridPlanDetail, setGridPlanDetail] = useState(null);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const [simulationVersionPopupOpen, setSimulationVersionPopupOpen] = useState(false);

  const itemSearchBoxRef = useRef();
  const [currentItemRef, setCurrentItemRef] = useState();

  const { reset, getValues, setValue, control } = useForm({
    defaultValues: {
      moduleCd: 'MP',
      versionId: '',
      dmndId: '',
      fromDate: '',
      toDate: '',
      shortageYn: 'A'
    }
  });

  const radioOptions = [
    { label: transLangKey('ALL'), value: "A" },
    { label: transLangKey('SHORTAGE'), value: "Y" }
  ];

  const globalButtons = [
    { name: 'search', action: (e) => { loadPlanDetail() }, visible: true, disable: false },
    { name: 'refresh', action: (e) => { refresh() }, visible: true, disable: false }
  ]

  const exportOptions = {
    headerDepth: 2,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  };

  useEffect(() => {
    if (itemSearchBoxRef) {
      if (itemSearchBoxRef.current) {
        setCurrentItemRef(itemSearchBoxRef.current);
      }
    }
  }, [viewData]);

  useEffect(() => {
    setViewInfo(vom.active, 'globalButtons', globalButtons);

    if (gridPlanDetail) {
      loadRecentSimulationVersion();
    }
  }, [gridPlanDetail]);

  function afterGridPlanDetail(gridObj) {
    setGridPlanDetail(gridObj);
    setGridPlanDetailOptions(gridObj);
  }

  function setGridPlanDetailOptions(gridObj) {
    setVisibleProps(gridObj, true, false, false);

    gridObj.gridView.setDisplayOptions({ fitStyle: 'fill' });
    gridObj.gridView.setFixedOptions({colCount: 1, resizable: true});

    gridObj.gridView.setColumnProperty('PLAN_SEQ', 'mergeRule', { criteria: 'value' });
    gridObj.gridView.setColumnProperty('DMND_ID', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('PO_ID', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('DMND_TP_NM', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('DMND_CLASS_NM', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('URGENT_ORDER_TP_NM', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('ITEM_CD', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('ITEM_NM', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('ITEM_DESCRIP', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('ITEM_TP_NM', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('DMND_QTY', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('UOM_NM', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('DUE_DATE', 'mergeRule', { criteria: 'prevvalues + value' });

    gridObj.gridView.setColumnProperty('REQUEST_SITE_ID', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('REQUEST_SITE_DESCRIP', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('ACCOUNT_CD', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('ACCOUNT_NM', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('CHANNEL_NM', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('INCOTERMS', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('SALES_PRIC', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('MARGIN', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('CURRENCY', 'mergeRule', { criteria: 'prevvalues + value' });

    gridObj.gridView.setColumnProperty('DELIVY_DATE', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('DAYS_LATE', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('DELIVY_QTY', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('ON_TIME_QTY', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('LATE_QTY', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('SHORTAGE_QTY', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('NETTING_QTY', 'mergeRule', { criteria: 'prevvalues + value' });

    wingui.util.grid.sorter.orderBy(gridObj.gridView, ['PLAN_SEQ', 'DMND_ID', 'PO_ID', 'ITEM_CD', 'DMND_QTY', 'DUE_DATE', 'DT_TRACKING_LV']);
  }

  function refresh() {
    reset({
      versionId: getValues('versionId')
    });
    currentItemRef.reset();

    setDefaultDate();

    gridPlanDetail.dataProvider.clearRows();
  }

  function loadRecentSimulationVersion() {
    let param = new URLSearchParams();

    param.append('MODULE_CD', getValues('moduleCd'));
    param.append('MAIN_VER_ID', '');
    param.append('SIMUL_VER_ID', '');
    param.append('SIMUL_VER_DESCRIP', '');

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_COMM_SRH_VER_Q',
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        if (res.data.RESULT_DATA.length > 0) {
          setValue('versionId', res.data.RESULT_DATA[0].SIMUL_VER);
        }
      }
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      if (getValues('versionId') !== '') {
        setDefaultDate();
      }
    });
  }

  function setDefaultDate() {
    let param = new URLSearchParams();

    param.append('TYPE', 'DEMAND_HORIZON');
    param.append('SIMUL_VER_ID', getValues('versionId'));

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_COMM_DEFAULT_DATE',
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        let dataArr = res.data.RESULT_DATA;

        setValue('fromDate', dataArr[0].MIN_DATE);
        setValue('toDate', dataArr[0].MAX_DATE);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function openPopupSimulationVersion() {
    setSimulationVersionPopupOpen(true);
  }

  function onSetSimulationVersion(gridRow) {
    setValue('versionId', gridRow.SIMUL_VER);
    setDefaultDate();
  }

  function loadPlanDetail() {
    let param = new URLSearchParams();

    param.append('VERSION_ID', getValues('versionId'));
    param.append('ITEM_CD', currentItemRef.getItemCode());
    param.append('ITEM_NM', currentItemRef.getItemName());
    param.append('ACCOUNT_CD', '');
    param.append('ACCOUNT_NM', '');
    param.append('DMND_ID', getValues('dmndId'));
    param.append('FROM_DATE', getValues('fromDate') === null ? '' : new Date(getValues('fromDate')).format('yyyy-MM-ddT00:00:00'));
    param.append('TO_DATE', getValues('toDate') === null ? '' : new Date(getValues('toDate')).format('yyyy-MM-ddT00:00:00'));
    param.append('PLAN_LOCAT_TP', '');
    param.append('PLAN_LOCAT_CD', '');
    param.append('PLAN_LOCAT_NM', '');
    param.append('PLAN_ITEM_CD', '');
    param.append('PLAN_ITEM_NM', '');
    param.append('RES_CD', '');
    param.append('RES_DESCRIP', '');
    param.append('PLAN_START', '');
    param.append('PLAN_END', '');
    param.append('SHORTAGE_YN', getValues('shortageYn'));

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/GetPlanDetailAnalysis',
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        let dataArr = res.data.RESULT_DATA;

        gridPlanDetail.setData(dataArr);
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
            <InputField name="moduleCd" label={transLangKey("MODULE_VAL")} control={control} style={{display: 'none'}} />
            <InputField type="action" name="versionId" label={transLangKey("SIMUL_VER")} style={{width: '210px'}} control={control} onClick={() => { openPopupSimulationVersion() }} >
              <Icon.Search />
            </InputField>
            <InputField name="dmndId" label={transLangKey("DMND_ID")} control={control} />
            <ItemSearchBox ref={itemSearchBoxRef} keyValue={'itemName'} placeHolder={transLangKey("ITEM_NM")} style={{width: 250}}/>
            <InputField name='fromDate' type='datetime' label={transLangKey('DUE_DATE') + ' (From)'} dateformat="yyyy-MM-dd" control={control} />
            <InputField name='toDate' type='datetime' label={transLangKey('DUE_DATE') + ' (To)'} dateformat="yyyy-MM-dd" control={control} />
            <InputField type='radio' name='shortageYn' label='' control={control} options={radioOptions} />
          </SearchRow>
        </SearchArea>
        <ButtonArea>
          <LeftButtonArea>
            <GridExcelExportButton type="icon" grid="gridPlanDetail" options={exportOptions} />
          </LeftButtonArea>
        </ButtonArea>
        <Box style={{ height: 'calc(100% - 100px)' }}>
          <BaseGrid id="gridPlanDetail" items={gridPlanDetailColumns} afterGridCreate={afterGridPlanDetail} />
        </Box>
      </ContentInner>

      <PopSimulationVersion open={simulationVersionPopupOpen} onClose={() => { setSimulationVersionPopupOpen(false) }} confirm={onSetSimulationVersion} module={getValues('moduleCd')} />
    </>
  )
}

export default PlanDetail;
