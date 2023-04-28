import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import {
  ContentInner, GridSaveButton, SearchArea, SearchRow, ButtonArea, LeftButtonArea , RightButtonArea, ResultArea,
  GridExcelExportButton, InputField, BaseGrid, useUserStore, useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';
import ItemSearchBox from '@wingui/view/supplychainmodel/common/ItemSearchBox';
import LocationSearchBox from '@wingui/view/supplychainmodel/common/LocationSearchBox';
import PopSimulationVersion from '@wingui/view/masterplan/common/PopSimulationVersion';

let gridPoColumns = [
  { name: "ORDER_ID", dataType: "text", headerText: "ORDER_NO", visible: true, editable: false, width: 120, autoFilter: true },
  {
    name: "SUPPLY_LOCAT", dataType: "group", orientation: "horizontal", headerText: "SUPPLY_LOCAT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "SUPPLY_LOC_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: 80, groupShowMode: 'expand' },
      { name: "SUPPLY_LOC_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: 80, groupShowMode: 'expand' },
      { name: "SUPPLY_LOC_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: 80, groupShowMode: 'always' },
      { name: "SUPPLY_LOC_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: 120, groupShowMode: 'always' },
      { name: "SUPPLY_LOC_GRP_CD", dataType: "text", headerText: "LOCAT_GRP", visible: true, editable: false, width: 120, groupShowMode: 'expand' },
      { name: "SUPPLY_BUSINESS_UNIT", dataType: "text", headerText: "BUSINESS_UNIT", visible: true, editable: false, width: 120, groupShowMode: 'expand' },
      { name: "SUPPLY_IN_OUT_FLAG", dataType: "text", headerText: "IN_OUT_FLAG", visible: true, editable: false, width: 80, groupShowMode: 'expand' }
    ]
  },
  {
    name: "CONSUME_LOCAT", dataType: "group", orientation: "horizontal", headerText: "CONSUME_LOCAT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "CONSUME_LOC_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: 80, groupShowMode: 'expand' },
      { name: "CONSUME_LOC_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: 80, groupShowMode: 'expand' },
      { name: "CONSUME_LOC_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: 80, groupShowMode: 'always' },
      { name: "CONSUME_LOC_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: 120, groupShowMode: 'always' },
      { name: "CONSUME_LOC_GRP_CD", dataType: "text", headerText: "LOCAT_GRP", visible: true, editable: false, width: 120, groupShowMode: 'expand' },
      { name: "CONSUME_BUSINESS_UNIT", dataType: "text", headerText: "BUSINESS_UNIT", visible: true, editable: false, width: 120, groupShowMode: 'expand' },
      { name: "CONSUME_IN_OUT_FLAG", dataType: "text", headerText: "IN_OUT_FLAG", visible: true, editable: false, width: 80, groupShowMode: 'expand' }
    ]
  },
  { name: "ORDER_TP", dataType: "text", headerText: "ORDER_TP", visible: true, editable: false, width: 140, autoFilter: true },
  { name: "PO_DATE", dataType: "datetime", headerText: "PO_DATE", visible: true, editable: false, width: 100, format: 'yyyy-MM-dd', autoFilter: true },
  { name: "DUE_IN_DATE", dataType: "datetime", headerText: "DUE_IN", visible: true, editable: false, width: 100, format: 'yyyy-MM-dd', autoFilter: true },
  { name: "VEHICL_TP", dataType: "text", headerText: "VEHICL_TP", visible: true, editable: false, width: 100, autoFilter: true },
  { name: "DESCRIP", dataType: "text", headerText: "DESCRIP", visible: false, editable: false, width: 120 },
  {
    name: "ITEM", dataType: "group", orientation: "horizontal", headerText: "ITEM", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: 'ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', visible: true, editable: false, width: 80, groupShowMode: "always" },
      { name: 'ITEM_NM', dataType: 'text', headerText: 'ITEM_NM', visible: true, editable: false, width: 120, groupShowMode: "always" },
      { name: 'ITEM_TP', dataType: 'text', headerText: 'ITEM_TP', visible: true, editable: false, width: 100, groupShowMode: "expand" }
    ]
  },
  { name: "ATTR_01", dataType: "text", headerText: "ITEM_ATTR_01", visible: true, editable: false, width: 100 },
  { name: "ATTR_02", dataType: "text", headerText: "ITEM_ATTR_02", visible: true, editable: false, width: 100 },
  { name: "ATTR_03", dataType: "text", headerText: "ITEM_ATTR_03", visible: true, editable: false, width: 100 },
  { name: "ATTR_04", dataType: "text", headerText: "ITEM_ATTR_04", visible: false, editable: false, width: 100 },
  { name: "ATTR_05", dataType: "text", headerText: "ITEM_ATTR_05", visible: false, editable: false, width: 100 },
  { name: "ATTR_06", dataType: "text", headerText: "ITEM_ATTR_06", visible: true, editable: false, width: 100 },
  { name: "ATTR_07", dataType: "text", headerText: "ITEM_ATTR_07", visible: false, editable: false, width: 100 },
  { name: "ATTR_08", dataType: "text", headerText: "ITEM_ATTR_08", visible: false, editable: false, width: 100 },
  { name: "ATTR_09", dataType: "text", headerText: "ITEM_ATTR_09", visible: false, editable: false, width: 100 },
  { name: "ATTR_10", dataType: "text", headerText: "ITEM_ATTR_10", visible: false, editable: false, width: 100 },
  { name: "ATTR_11", dataType: "text", headerText: "ITEM_ATTR_11", visible: false, editable: false, width: 100 },
  { name: "ATTR_12", dataType: "text", headerText: "ITEM_ATTR_12", visible: false, editable: false, width: 100 },
  { name: "ATTR_13", dataType: "text", headerText: "ITEM_ATTR_13", visible: false, editable: false, width: 100 },
  { name: "ATTR_14", dataType: "text", headerText: "ITEM_ATTR_14", visible: false, editable: false, width: 100 },
  { name: "ATTR_15", dataType: "text", headerText: "ITEM_ATTR_15", visible: false, editable: false, width: 100 },
  { name: "ATTR_16", dataType: "text", headerText: "ITEM_ATTR_16", visible: false, editable: false, width: 100 },
  { name: "ATTR_17", dataType: "text", headerText: "ITEM_ATTR_17", visible: false, editable: false, width: 100 },
  { name: "ATTR_18", dataType: "text", headerText: "ITEM_ATTR_18", visible: false, editable: false, width: 100 },
  { name: "ATTR_19", dataType: "text", headerText: "ITEM_ATTR_19", visible: false, editable: false, width: 100 },
  { name: "ATTR_20", dataType: "text", headerText: "ITEM_ATTR_20", visible: false, editable: false, width: 100 },
  { name: "PRPSAL_QTY", dataType: "number", headerText: "PRPSAL_QTY", visible: true, editable: false, width: 80 },
  { name: "QTY", dataType: "number", headerText: "QTY", visible: true, editable: true, width: 80 },
  { name: "UOM_NM", dataType: "text", headerText: "UOM_NM", visible: true, editable: false, width: 80 },
  { name: "STD_UTPIC", dataType: "number", headerText: "UTPIC", visible: true, editable: false, width: 80 },
  { name: "CURCY_NM", dataType: "text", headerText: "CURCY_NM", visible: true, editable: false, width: 80 }
];

function PoList() {
  const [username] = useUserStore(state => [state.username]);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo])

  const [simulationVersionPopupOpen, setSimulationVersionPopupOpen] = useState(false);

  const supplyLocationSearchBoxRef = useRef();
  const [currentSupplyLocationRef, setCurrentSupplyLocationRef] = useState();

  const itemSearchBoxRef = useRef();
  const [currentItemRef, setCurrentItemRef] = useState();

  const consumeLocationSearchBoxRef = useRef();
  const [currentConsumeLocationRef, setCurrentConsumeLocationRef] = useState();

  const [gridPo, setGridPo] = useState(null);

  useEffect(() => {
    if (supplyLocationSearchBoxRef) {
      if (supplyLocationSearchBoxRef.current) {
        setCurrentSupplyLocationRef(supplyLocationSearchBoxRef.current);
      }
    }

    if (consumeLocationSearchBoxRef) {
      if (consumeLocationSearchBoxRef.current) {
        setCurrentConsumeLocationRef(consumeLocationSearchBoxRef.current);
      }
    }

    if (itemSearchBoxRef) {
      if (itemSearchBoxRef.current) {
        setCurrentItemRef(itemSearchBoxRef.current);
      }
    }
  }, [viewData])

  const { reset, control, getValues, setValue, clearErrors } = useForm({
    defaultValues: {
      moduleCd: 'RP',
      versionId: '',
      versionDescrip: '',
      processDescrip: '',
      defaultMainVersion: {}
    }
  });

  const globalButtons = [
    { name: "search", action: (e) => { onSubmit() }, visible: true, disable: false },
    { name: "refresh", action: (e) => { refresh() }, visible: true, disable: false },
  ]

  const exportExcelOptions = {
    headerDepth: 2,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  }

  useEffect(() => {
    async function initLoad() {
      await loadRecentMainVersion();
      loadPoList();
    }

    if (gridPo) {
      initLoad();
    }
    setViewInfo(vom.active, 'globalButtons', globalButtons);
  }, [gridPo]);

  function afterGridPo(gridObj) {
    setGridPo(gridObj);
    setGridPoOptions(gridObj);
  }

  const onSubmit = (data) => {
    loadPoList(data);
  };

  const refresh = () => {
    currentSupplyLocationRef.reset();
    currentConsumeLocationRef.reset();
    currentItemRef.reset();
    reset({
      versionId: getValues('defaultMainVersion').SIMUL_VER_ID,
      versionDescrip: getValues('defaultMainVersion').SIMUL_VER_DESCRIP,
      processDescrip: getValues('defaultMainVersion').PROCESS_DESCRIP,
      defaultMainVersion: getValues('defaultMainVersion')
    });
    gridPo.dataProvider.clearRows();
  }

  function setGridPoOptions(gridObj) {
    setVisibleProps(gridObj, true, true, false);

    gridObj.gridView.displayOptions.fitStyle = 'fill';
    gridObj.gridView.setFixedOptions({colCount: 3, resizable: true});
  }

  function loadRecentMainVersion() {
    let param = new URLSearchParams();

    param.append('MENU_ID', 'UI_RP_25');

    return zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_COMM_DEFAULT_VER',
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        let data = res.data.RESULT_DATA[0];

        setValue('versionId', data.SIMUL_VER_ID);
        setValue('versionDescrip', data.SIMUL_VER_DESCRIP);
        setValue('processDescrip', data.PROCESS_DESCRIP);
        setValue('defaultMainVersion', data);
      }
    })
    .catch(function (err) {
      console.log(err);
    })
  }

  function popupSimulationVersion() {
    setSimulationVersionPopupOpen(true);
  }

  function onSetSimulationVersion(gridRow) {
    setValue('versionId', gridRow.SIMUL_VER);
    setValue('versionDescrip', gridRow.SIMUL_VER_DESCRIP);
    setValue('processDescrip', gridRow.PROCESS_DESCRIP);
  }

  function loadPoList() {
    let param = new URLSearchParams();

    param.append('VERSION_ID', getValues('versionId'));
    param.append('SUPPLY_LOCAT_TP_NM', currentSupplyLocationRef.getLocationType());
    param.append('SUPPLY_LOCAT_LV', currentSupplyLocationRef.getLocationLevel());
    param.append('SUPPLY_LOCAT_CD', currentSupplyLocationRef.getLocationCode());
    param.append('SUPPLY_LOCAT_NM', currentSupplyLocationRef.getLocationName());
    param.append('CONSUME_LOCAT_TP_NM', currentConsumeLocationRef.getLocationType());
    param.append('CONSUME_LOCAT_LV', currentConsumeLocationRef.getLocationLevel());
    param.append('CONSUME_LOCAT_CD', currentConsumeLocationRef.getLocationCode());
    param.append('CONSUME_LOCAT_NM', currentConsumeLocationRef.getLocationName());
    param.append('ITEM_CD', currentItemRef.getItemCode());
    param.append('ITEM_ATTR_01', '');
    param.append('ITEM_ATTR_02', '');
    param.append('ITEM_ATTR_03', '');
    param.append('ITEM_ATTR_04', '');
    param.append('ITEM_ATTR_05', '');
    param.append('ITEM_ATTR_06', '');
    param.append('PO_DATE', '');

    gridPo.gridView.commit(true);

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/GetReplenishmentOrder',
      params: param
    })
    .then(function (res) {
      gridPo.setData(res.data.RESULT_DATA);
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function savePo() {
    gridPo.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridPo.dataProvider.getAllStateRows().created,
          gridPo.dataProvider.getAllStateRows().updated,
          gridPo.dataProvider.getAllStateRows().deleted,
          gridPo.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          changeRowData.push(gridPo.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          let param = new URLSearchParams();

          param.append('VERSION_ID', getValues('versionId'));
          param.append('USER_ID', username);
          param.append('changes', JSON.stringify(changeRowData));

          zAxios({
            method: 'post',
            header: { 'content-type': 'application/json' },
            url: baseURI() + 'engine/mp/SRV_UI_RP_25_S1',
            data: param
          })
          .then(function (res) {
            showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_RP_25_S1_P_RT_MSG), { close: false });
            loadPoList();
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
            <InputField name="moduleCd" label={transLangKey("MODULE_VAL")} control={control} style={{display: 'none'}} />
            <InputField type="action" name="versionId" label={transLangKey("SIMUL_VER")} style={{width: '210px'}} control={control} onClick={() => { popupSimulationVersion() }} rules={{ required: transLangKey('MSG_0006') }} >
              <Icon.Search />
            </InputField>
            <InputField name="versionDescrip" label={transLangKey("DESCRIP")} control={control} readonly={true}/>
            <InputField name="processDescrip" label={transLangKey("PROCESS_DESCRIP")} control={control} readonly={true}/>

            <LocationSearchBox ref={supplyLocationSearchBoxRef} keyValue={'locationName'} label={transLangKey("SUPPLY_LOCAT")} placeHolder={transLangKey("LOCAT_NM")} style={{width: 250}}/>
            <LocationSearchBox ref={consumeLocationSearchBoxRef} keyValue={'locationName'} label={transLangKey("CONSUME_LOCAT")} placeHolder={transLangKey("LOCAT_NM")} style={{width: 250}}/>
            <ItemSearchBox ref={itemSearchBoxRef} keyValue={'itemName'} placeHolder={transLangKey("ITEM_NM")} fields={['itemCode', 'itemName']} style={{width: 250, popoverHeight :200}}/>
          </SearchRow>
        </SearchArea>
        <ResultArea>
          <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch' }}>
            <ButtonArea>
              <LeftButtonArea>
                <GridExcelExportButton type='icon' grid='gridPo' options={exportExcelOptions}></GridExcelExportButton>
              </LeftButtonArea>
              <RightButtonArea>
                <GridSaveButton type="icon" onClick={savePo} />
              </RightButtonArea>
            </ButtonArea>
            <Box style={{ height: '100%' }}>
              <BaseGrid id='gridPo' items={gridPoColumns} afterGridCreate={afterGridPo} />
            </Box>
          </Box>
        </ResultArea>
      </ContentInner>

      <PopSimulationVersion open={simulationVersionPopupOpen} onClose={() => { setSimulationVersionPopupOpen(false) }} confirm={onSetSimulationVersion} module={getValues('moduleCd')} />
    </>
  )
}

export default PoList;
