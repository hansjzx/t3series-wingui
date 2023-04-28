import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import {
  ContentInner, GridSaveButton, SearchArea, SearchRow, ButtonArea, LeftButtonArea , RightButtonArea, ResultArea, InputField,
  GridExcelExportButton, BaseGrid, useUserStore, useViewStore, zAxios, CommonButton
} from '@zionex/wingui-core/src/common/imports';
import { setGridComboList  } from "@wingui/view/supplychainmodel/common/common";

import PopCycleConsecutiveBundleCreate from './PopCycleConsecutiveBundleCreate';
import ItemSearchBox from '@wingui/view/supplychainmodel/common/ItemSearchBox';
import LocationSearchBox from '@wingui/view/supplychainmodel/common/LocationSearchBox';
import PopCommItemClass from '@wingui/view/supplychainmodel/common/PopCommItemClass';

let gridCycleConsecutiveColumns = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: 100 },
  { name: "LOCAT_MST_ID", dataType: "text", headerText: "LOCAT_MST_ID", visible: false, editable: false, width: 100 },
  /*init group order*/
  {
    name: "LOCATION", dataType: "group", orientation: "horizontal", headerText: "LOCAT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: 120, groupShowMode: "expand" },
      { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: 120, groupShowMode: "expand" },
      { name: "LOCAT_LV_DESCRIP", dataType: "text", headerText: "LOCAT_LV_DESCRIP", visible: true, editable: false, width: 180, groupShowMode: 'expand' },
      { name: "LOCAT_ID", dataType: "text", headerText: "LOCAT_ID", visible: false, editable: false, width: 80, groupShowMode: "expand" },
      { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: 120, groupShowMode: "always" },
      { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: 120, groupShowMode: "always" }
    ]
  },
  { name: "DMND_INTG_YN", dataType: "boolean", headerText: "DMND_INTG_YN", visible: true, editable: false, width: 100 },

  {
    name: 'ITEM_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'ITEM', expandable: true, expanded: false,
    childs: [
      { name: 'ITEM_SCOPE_NM', dataType: 'text', headerText: 'ITEM_SCOPE_NM', visible: true, editable: false, width: 100, groupShowMode: 'always' },
      { name: 'ITEM_CLASS_VAL', dataType: 'text', headerText: 'ITEM_CLASS_VAL', visible: true, editable: false, width: 150, groupShowMode: 'always' },
      { name: 'ITEM_MST_ID', dataType: 'text', headerText: 'ITEM_MST_ID', visible: false, editable: false, width: 100, groupShowMode: 'always' },
      { name: 'ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', visible: true, editable: false, width: 90, groupShowMode: 'always' },
      { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: 120, groupShowMode: 'always' },
      { name: "ITEM_TP", dataType: "text", headerText: "ITEM_TP", visible: true, editable: false, width: 80, groupShowMode: 'expand' }
    ]
  },
  { name: "ATTR_01", dataType: "text", headerText: "ITEM_ATTR_01", visible: true, editable: false, width: 80 },
  { name: "ATTR_02", dataType: "text", headerText: "ITEM_ATTR_02", visible: true, editable: false, width: 80 },
  { name: "ATTR_03", dataType: "text", headerText: "ITEM_ATTR_03", visible: true, editable: false, width: 80 },
  { name: "ATTR_04", dataType: "text", headerText: "ITEM_ATTR_04", visible: true, editable: false, width: 80 },
  { name: "ATTR_05", dataType: "text", headerText: "ITEM_ATTR_05", visible: true, editable: false, width: 80 },
  { name: "ATTR_06", dataType: "text", headerText: "ITEM_ATTR_06", visible: false, editable: false, width: 80 },
  { name: "ATTR_07", dataType: "text", headerText: "ITEM_ATTR_07", visible: false, editable: false, width: 80 },
  { name: "ATTR_08", dataType: "text", headerText: "ITEM_ATTR_08", visible: false, editable: false, width: 80 },
  { name: "ATTR_09", dataType: "text", headerText: "ITEM_ATTR_09", visible: false, editable: false, width: 80 },
  { name: "ATTR_10", dataType: "text", headerText: "ITEM_ATTR_10", visible: false, editable: false, width: 80 },
  { name: "ATTR_11", dataType: "text", headerText: "ITEM_ATTR_11", visible: false, editable: false, width: 80 },
  { name: "ATTR_12", dataType: "text", headerText: "ITEM_ATTR_12", visible: false, editable: false, width: 80 },
  { name: "ATTR_13", dataType: "text", headerText: "ITEM_ATTR_13", visible: false, editable: false, width: 80 },
  { name: "ATTR_14", dataType: "text", headerText: "ITEM_ATTR_14", visible: false, editable: false, width: 80 },
  { name: "ATTR_15", dataType: "text", headerText: "ITEM_ATTR_15", visible: false, editable: false, width: 80 },
  { name: "ATTR_16", dataType: "text", headerText: "ITEM_ATTR_16", visible: false, editable: false, width: 80 },
  { name: "ATTR_17", dataType: "text", headerText: "ITEM_ATTR_17", visible: false, editable: false, width: 80 },
  { name: "ATTR_18", dataType: "text", headerText: "ITEM_ATTR_18", visible: false, editable: false, width: 80 },
  { name: "ATTR_19", dataType: "text", headerText: "ITEM_ATTR_19", visible: false, editable: false, width: 80 },
  { name: "ATTR_20", dataType: "text", headerText: "ITEM_ATTR_20", visible: true, editable: false, width: 80 },

  {
    name: "CONTINU_PRDUCT", dataType: "group", orientation: "horizontal", headerText: "CONTINU_PRDUCT", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "ITEM_GRP", headerText: "ITEM_GRP", dataType: "string", width: 120, editable: false },
      { name: "ITEM_GRP_DESCRIP", headerText: "ITEM_GRP_DESCRIP", dataType: "string", width: 150, editable: false },
      { name: "SEQ", headerText: "SEQ", dataType: "number", width: 80, editable: false, numberFormat: "#,###" },
      { name: "CONTINU_PRDUCT_ITEM_SEQ", headerText: "CONTINU_PRDUCT_ITEM_SEQ", dataType: "number", width: 100, editable: true, numberFormat: "#,###" }
    ]
  },

  {
    name: "PRDUCT_REC_N_CYCL", dataType: "group", orientation: "horizontal", headerText: "PRDUCT_REC_N_CYCL", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "PRDUCT_TIMES", headerText: "PRDUCT_TIMES", dataType: "number", width: 120, visible: true, editable: false, numberFormat: "#,###.###" },
      { name: "PRDUCT_QTY", headerText: "PRDUCT_QTY", dataType: "number", width: 120, visible: true, editable: false, numberFormat: "#,###.###" },
      { name: "PRDUCT_CYCL_PRPSAL_VAL", headerText: "PRDUCT_CYCL_PRPSAL_VAL", dataType: "number", width: 80, visible: true, editable: false, numberFormat: "#,###.###" },
      { name: "PRDUCT_CYCL", headerText: "PRDUCT_CYCL", dataType: "number", width: 150, visible: true, editable: true, numberFormat: "#,###.###" },
      { name: "UOM_NM", headerText: "UOM_NM", dataType: "text", width: 80, visible: true, editable: true, useDropdown: true, lookupDisplay: true }
    ]
  },

  { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: 80, autoFilter: true },
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

function CycleConsecutive() {
  const [username] = useUserStore(state => [state.username]);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const [gridCycleConsecutive, setGridCycleConsecutive] = useState(null);
  
  const [itemClassPopupOpen, setItemClassPopupOpen] = useState(false);

  const [cycleConsecutiveBundleCreatePopOpen, setCycleConsecutiveBundleCreatePopOpen] = useState(false);

  const locationSearchBoxRef = useRef();
  const itemSearchBoxRef = useRef();

  const [currentLocationRef, setCurrentLocationRef] = useState();
  const [currentItemRef, setCurrentItemRef] = useState();

  const { reset, control, getValues, setValue } = useForm({
    defaultValues: {
      itemClassValue: '',
      itemClassDescription: ''
    }
  });

  // grid Object init
  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, 'gridCycleConsecutive');
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        setGridCycleConsecutive(grdObj1)
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
  }, [viewData])

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
    async function initLoad() {
      if (gridCycleConsecutive) {
        setViewInfo(vom.active, 'globalButtons', globalButtons);
        setOptions();
        await loadData();
      }
    }
    initLoad();
  }, [gridCycleConsecutive]);

  /** 이벤트 핸들러 */
  const onSubmit = (data) => {
    loadData(data);
  };

  function onSetItemClass(gridRow) {
    setValue("itemClassValue", gridRow.ITEM_CLASS_VAL);
    setValue("itemClassDescription", gridRow.DESCRIP);
  }

  const refresh = () => {
    currentLocationRef.reset();
    currentItemRef.reset();
    reset();
    gridCycleConsecutive.dataProvider.clearRows();
  }

  function openItemClassPoup() {
    setItemClassPopupOpen(true);
  }

  function setOptions() {
    //indicator(rowIndex), statebar(create,update,delete...), checkbar(checkbar)
    setVisibleProps(gridCycleConsecutive, true, true, false);

    gridCycleConsecutive.gridView.displayOptions.fitStyle = 'fill';
    
    let orderTarget = ['LOCAT_TP_NM', 'LOCAT_LV', 'LOCAT_CD', 'LOCAT_NM', 'DMND_INTG_YN', 'ITEM_SCOPE_NM', 'ITEM_CLASS_VAL'];

    wingui.util.grid.sorter.orderBy(gridCycleConsecutive.gridView, orderTarget);

    gridCycleConsecutive.gridView.setColumnProperty("LOCAT_TP_NM", "mergeRule", {criteria: "value"});
    gridCycleConsecutive.gridView.setColumnProperty("LOCAT_LV", "mergeRule", {criteria: "value"});
    gridCycleConsecutive.gridView.setColumnProperty("LOCAT_LV_DESCRIP", "mergeRule", {criteria: "value"});
    gridCycleConsecutive.gridView.setColumnProperty("LOCAT_CD", "mergeRule", {criteria: "value"});
    gridCycleConsecutive.gridView.setColumnProperty("LOCAT_NM", "mergeRule", {criteria: "value"});
    gridCycleConsecutive.gridView.setColumnProperty("DMND_INTG_YN", "mergeRule", {criteria: "prevvalues + values[ 'DMND_INTG_YN' ]"});
    gridCycleConsecutive.gridView.setColumnProperty("ITEM_SCOPE_NM", "mergeRule", {criteria: "prevvalues + values[ 'ITEM_SCOPE_NM' ]"});
    gridCycleConsecutive.gridView.setColumnProperty("ITEM_CLASS_VAL", "mergeRule", {criteria: "prevvalues + values[ 'ITEM_CLASS_VAL' ]"});

    setGridComboList(gridCycleConsecutive, "UOM_NM", "TIME_UOM");
  }

  async function loadData() {
    let formData = new FormData();

    formData.append('LOCAT_TP_NM', currentLocationRef.getLocationType());
    formData.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    formData.append('LOCAT_CD', currentLocationRef.getLocationCode());
    formData.append('LOCAT_NM', currentLocationRef.getLocationName());
    formData.append('ITEM_CD', currentItemRef.getItemCode());
    formData.append('DESCRIP', currentItemRef.getItemName());
    formData.append('ITEM_TP_NM', currentItemRef.getItemType());

    formData.append('ITEM_CLASS_VAL', getValues("itemClassValue"));
    formData.append('ITEM_CLASS_DESCRIP',  getValues("itemClassDescription"));
    formData.append('ACTIVE', 'A');
    formData.append('USER_ID', username);

    gridCycleConsecutive.gridView.commit(true);

    await zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_14_Q1',
      data: formData
    })
    .then(function (res) {
      gridCycleConsecutive.setData(res.data.RESULT_DATA);
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function saveData() {
    gridCycleConsecutive.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridCycleConsecutive.dataProvider.getAllStateRows().created,
          gridCycleConsecutive.dataProvider.getAllStateRows().updated,
          gridCycleConsecutive.dataProvider.getAllStateRows().deleted,
          gridCycleConsecutive.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          changeRowData.push(gridCycleConsecutive.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          //저장 할 내용이 없습니다.
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          let formData = new FormData();
          formData.append('USER_ID', username);
          formData.append('CHANGES', JSON.stringify(changeRowData));

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_UI_MP_14_S1',
            data: formData
          })
          .then(function (res) {
            const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_14_S1_P_RT_MSG;
            showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false });

            if (res.status === gHttpStatus.SUCCESS) {
              loadData();
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
          <LocationSearchBox ref={locationSearchBoxRef} keyValue={'locationName'} placeHolder={transLangKey("LOCAT_NM")}/>
          <ItemSearchBox ref={itemSearchBoxRef} keyValue={'itemName'} placeHolder={transLangKey("ITEM_NM")}/>
          <InputField type="action" name="itemClassValue" label={transLangKey("ITEM_CLASS_VAL")} control={control} onClick={openItemClassPoup}>
            <Icon.Search />
          </InputField>
          <InputField name="itemClassDescription" label={transLangKey("DESCRIP")} control={control}/>
        </SearchRow>
      </SearchArea>
      <ResultArea>
        <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch' }}>
          <ButtonArea>
            <LeftButtonArea>
              <GridExcelExportButton type='icon' grid='gridCycleConsecutive' options={exportExceloptions}></GridExcelExportButton>
              {/*<GridExcelImportButton type='icon' grid='gridCycleConsecutive'></GridExcelImportButton>*/}
              <CommonButton title={transLangKey("BUNDLE_CREATE")} onClick={() => { setCycleConsecutiveBundleCreatePopOpen(true) }}><Icon.File/></CommonButton>
            </LeftButtonArea>
            <RightButtonArea>
              <GridSaveButton type="icon" onClick={saveData}></GridSaveButton>
            </RightButtonArea>
          </ButtonArea>
          <Box style={{ height: '100%' }}>
            <BaseGrid id='gridCycleConsecutive' items={gridCycleConsecutiveColumns}></BaseGrid>
          </Box>
        </Box>
      </ResultArea>
    </ContentInner>
    {cycleConsecutiveBundleCreatePopOpen && <PopCycleConsecutiveBundleCreate open={cycleConsecutiveBundleCreatePopOpen} onClose={() => setCycleConsecutiveBundleCreatePopOpen(false)} confirm={onSubmit} ></PopCycleConsecutiveBundleCreate>}
    {itemClassPopupOpen && <PopCommItemClass open={itemClassPopupOpen} onClose={() => setItemClassPopupOpen(false)} confirm={onSetItemClass} ></PopCommItemClass>}
    </>
  )
}

export default CycleConsecutive;
