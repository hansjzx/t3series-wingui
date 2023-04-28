import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import {
  BaseGrid, ButtonArea, CommonButton, ContentInner, GridAddRowButton, GridDeleteRowButton, GridExcelExportButton, GridSaveButton,
  InputField, LeftButtonArea, RightButtonArea, SearchArea, SearchRow, useUserStore, useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';
import { setGridComboList } from '@wingui/view/supplychainmodel/common/common';

import ItemSearchBox from '@wingui/view/supplychainmodel/common/ItemSearchBox';
import LocationSearchBox from '@wingui/view/supplychainmodel/common/LocationSearchBox';
import PopCommResource from '@wingui/view/supplychainmodel/common/PopCommResource';
import PopItemResPreferenceNew from './PopItemResPreferenceNew';
import PopPeriodItemResPreferenceNew from './PopPeriodItemResPreferenceNew';
import PopItemResPreferenceBundleCreate from './PopItemResPreferenceBundleCreate';
import PopItemResPreferenceBatchUpdate from './PopItemResPreferenceBatchUpdate';

let gridResPriorityColumns = [
  { name: 'RES_PREF_MST_ID', dataType: 'text', headerText: 'RES_PREF_MST_ID', visible: false, width: 50 },
  { name: 'LOCAT_DTL_ID', dataType: 'text', headerText: 'LOCAT_DTL_ID', visible: false, width: 50 },
  { name: 'LOCAT_ITEM_ID', dataType: 'text', headerText: 'LOCAT_ITEM_ID', visible: false, width: 50 },
  { name: 'ITEM_MST_ID', dataType: 'text', headerText: 'ITEM_MST_ID', visible: false, width: 50 },
  { name: 'RES_ID', dataType: 'text', headerText: 'RES_ID', visible: false, width: 50 },
  {
    name: 'LOCATION', dataType: 'group', orientation: 'horizontal', headerText: 'LOCAT', headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: 'LOCAT_TP_NM', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: 120, merge: true, groupShowMode: 'expand' },
      { name: 'LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: 120, merge: true, groupShowMode: 'expand' },
      { name: 'LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: 120, merge: true, groupShowMode: 'always' },
      { name: 'LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: 120, merge: true, groupShowMode: 'always' }
    ]
  },
  { name: 'PLAN_RES_TP', dataType: 'text', headerText: 'PLAN_RES_TP', visible: true, editable: false, width: 120 },
  { name: 'ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', visible: true, editable: false, width: 100, button: 'action', buttonVisibility: 'always' },
  { name: 'ITEM_NM', dataType: 'text', headerText: 'ITEM_NM', visible: true, editable: false, width: 100 },
  { name: 'ITEM_DESCRIP', dataType: 'text', headerText: 'ITEM_DESCRIP', visible: false, editable: false, width: 150 },
  { name: 'ITEM_TP', dataType: 'text', headerText: 'ITEM_TP', visible: true, editable: false, width: 80 },
  { name: 'BASE_ALLOC_RULE_ID', dataType: 'text', headerText: 'BASE_ALLOC_RULE', visible: true, editable: true, width: 130, autoFilter: true, useDropdown: true, lookupDisplay: true },
  { name: 'FIXED_YN', dataType: 'boolean', headerText: 'FIXED_YN', visible: true, editable: true, width: 80, autoFilter: true },
  { name: 'ROUTE_CD', dataType: 'text', headerText: 'ROUTE_CD', visible: true, editable: false, width: 80 },
  { name: 'ROUTE_DESCRIP', dataType: 'text', headerText: 'ROUTE_DESCRIP', visible: true, editable: false, width: 120 },
  { name: 'RES_CD', dataType: 'text', headerText: 'RES_CD', visible: true, editable: false, width: 100 },
  { name: 'RES_DESCRIP', dataType: 'text', headerText: 'RES_DESCRIP', visible: true, editable: false, width: 150 },
  { name: 'BASE_ALLOC_PRIORT', dataType: 'number', headerText: 'BASE_ALLOC_PRIOR', visible: true, editable: true, width: 100 },
  { name: 'BASE_ALLOC_PROPTN', dataType: 'number', headerText: 'BASE_ALLOC_PROPTN', visible: true, editable: true, width: 100 },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: true, width: 60 },
  {
    name: "EDIT", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: 'CREATE_BY', dataType: 'text', headerText: 'CREATE_BY', visible: true, editable: false, width: 100, groupShowMode: 'expand' },
      { name: 'CREATE_DTTM', dataType: 'datetime', headerText: 'CREATE_DTTM', visible: true, editable: false, width: 150, groupShowMode: 'expand' },
      { name: 'MODIFY_BY', dataType: 'text', headerText: 'MODIFY_BY', visible: true, editable: false, width: 100, groupShowMode: 'always' },
      { name: 'MODIFY_DTTM', dataType: 'datetime', headerText: 'MODIFY_DTTM', visible: true, editable: false, width: 150, groupShowMode: 'expand' }
    ]
  }
]

let gridPeriodColumns = [
  { name: 'ITEM_RES_PREF_MST_ID', dataType: 'text', headerText: 'ITEM_RES_PREF_MST_ID', visible: false, width: 50 },
  { name: 'RES_ID', dataType: 'text', headerText: 'RES_ID', visible: false, editable: false, width: 150 },
  { name: 'LOCAT_TP', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: 100 },
  { name: 'LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: 100 },
  { name: 'LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: 100 },
  { name: 'LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: 120 },
  { name: 'ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', visible: true, editable: false, width: 100 },
  { name: 'ITEM_NM', dataType: 'text', headerText: 'ITEM_NM', visible: true, editable: false, width: 100 },
  { name: 'ITEM_DESCRIP', dataType: 'text', headerText: 'ITEM_DESCRIP', visible: true, editable: false, width: 150 },
  { name: 'RES_CD', dataType: 'text', headerText: 'RES_CD', visible: true, editable: false, width: 150 },
  { name: 'RES_DESCRIP', dataType: 'text', headerText: 'RES_DESCRIP', visible: true, editable: false, width: 150 },
  { name: 'STRT_DTTM', dataType: 'string', headerText: 'STRT_DTTM', visible: true, editable: true, width: 150, iteration: { prefix: 'STRT_DTTM_', prefixRemove: 'true' } }
]

function ItemResPreference() {
  const [username] = useUserStore(state => [state.username]);
  const [gridResPriority, setGridResPriority] = useState(null);
  const [gridPeriod, setGridPeriod] = useState(null);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const [resourcePopupOpen, setResourcePopupOpen] = useState(false);
  const [newItemResPreferencePopupOpen, setNewItemResPreferencePopupOpen] = useState(false);
  const [newPeriodItemResPreferencePopupOpen, setPeriodNewItemResPreferencePopupOpen] = useState(false);
  const [bundleCreatePopupOpen, setBundleCreatePopupOpen] = useState(false);
  const [batchUpdatePopupOpen, setBatchUpdatePopupOpen] = useState(false);
  const [popupData, setPopupData] = useState({});

  const locationSearchBoxRef = useRef();
  const [currentLocationRef, setCurrentLocationRef] = useState();

  const itemSearchBoxRef = useRef();
  const [currentItemRef, setCurrentItemRef] = useState();

  const { reset, control, getValues, setValue } = useForm({
    defaultValues: {
      resourceCode: '',
      resourceDescription: ''
    }
  });

  const exportOptions = {
    headerDepth: 1,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  };

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, 'gridResPriority');
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        if (gridResPriority != grdObj1) {
          setGridResPriority(grdObj1);
        }
      }
    }

    const grdObj2 = getViewInfo(vom.active, 'gridPeriod');
    if (grdObj2) {
      if (grdObj2.dataProvider) {
        if (gridPeriod != grdObj2) {
          setGridPeriod(grdObj2);
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

  useEffect(() => {
    async function initLoad() {
      if (gridResPriority && gridPeriod) {
        setViewInfo(vom.active, 'globalButtons', [
          { name: 'search', action: (e) => { loadResPriority(); }, visible: true, disable: false },
          { name: 'refresh', action: (e) => { refresh(); }, visible: true, disable: false },
        ]);

        setGridOptions();
        setGridLookup();
        setSelectOptions();

        await loadResPriority();
      }
    }

    initLoad();
  }, [gridResPriority, gridPeriod]);

  function afterGridResPriority(gridObj) {
    setGridResPriority(gridObj);
  }

  function afterGridPeriodCreate(gridObj) {
    setVisibleProps(gridObj, true, true, false);
    setGridPeriod(gridObj);
  }

  function setGridOptions() {
    gridResPriority.gridView.filteringOptions.automating.lookupDisplay = true;
    gridResPriority.gridView.setEditOptions({
      insertable: true,
      appendable: true
    });

    setVisibleProps(gridResPriority, true, true, true);

    gridResPriority.gridView.setDisplayOptions({ fitStyle: 'fill' });

    wingui.util.grid.sorter.orderBy(gridResPriority.gridView, ['LOCAT_TP_NM', 'LOCAT_LV', 'LOCAT_CD', 'LOCAT_NM', 'PLAN_RES_TP', 'ITEM_CD']);

    let columnArr = ["LOCAT_TP_NM", "LOCAT_LV", "LOCAT_CD", "LOCAT_NM", "PLAN_RES_TP"];
    for (let i = 0; i < columnArr.length; i++) {
      gridResPriority.gridView.setColumnProperty(columnArr[i], "mergeRule", {
        criteria: "prevvalues + values[ '" + columnArr[i] + "' ]"
      });
    }

    gridResPriority.gridView.setFixedOptions({ colCount: 5, resizable: true });

    gridResPriority.gridView.onCellButtonClicked = function (gridObj, clickData, column) {
      let data = gridResPriority.dataProvider.getOutputRow(null, clickData.dataRow);
      setPopupData(data);
      loadPeriodData(data.LOCAT_ITEM_ID, data.BASE_ALLOC_RULE_ID);
    }
  }

  function setGridLookup() {
    setGridComboList(gridResPriority, "BASE_ALLOC_RULE_ID", "BASE_ALLOC_RULE");
  }

  function setSelectOptions() {
    let formData = new FormData();

    formData.append('TYPE', 'BASE_ALLOC_RULE');

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_GET_COMBO_LIST',
      data: formData
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        let dataArr = [];

        res.data.RESULT_DATA.forEach(function (data) {
          dataArr.push( { value: data.CD, label: data.CD_NM });
        });

        reset({ baseAllocationRule: dataArr[0].value });
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function refresh() {
    reset();
    currentLocationRef.reset();
    currentItemRef.reset();
    gridResPriority.dataProvider.clearRows();
    gridPeriod.dataProvider.clearRows();
    setPopupData({});
  }

  function loadResPriority() {
    let formData = new FormData();
    formData.append('LOCAT_TP', currentLocationRef.getLocationType());
    formData.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    formData.append('LOCAT_CD', currentLocationRef.getLocationCode());
    formData.append('LOCAT_NM', currentLocationRef.getLocationName());
    formData.append('ITEM_CD', currentItemRef.getItemCode());
    formData.append('ITEM_NM', currentItemRef.getItemName());
    formData.append('ITEM_TP', currentItemRef.getItemType());
    formData.append('ROUTE_CD', '');
    formData.append('ROUTE_DESCRIP', '');
    formData.append('RES_CD', getValues('resourceCode'));
    formData.append('RES_DESCRIP', getValues('resourceDescription'));
    formData.append('BASE_ALLOC_RULE_ID', '');
    formData.append('FIXED_YN', 'A');

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_08_Q1',
      data: formData
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridResPriority.dataProvider.clearRows();
        gridPeriod.dataProvider.clearRows();
        gridResPriority.setData(res.data.RESULT_DATA);
        setPopupData({});
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function deleteResPriority() {
    gridResPriority.gridView.commit(true);

    let checkedRow = gridResPriority.gridView.getCheckedRows();

    if (!checkedRow.length) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SELECT_DELETE'), { close: false });
    } else {
      showMessage(transLangKey('DELETE'), transLangKey('MSG_DELETE'), function (answer) {
        if (answer) {
          let formData = new FormData();
          let checked = [];

          checkedRow.forEach(function (row) {
            checked.push(gridResPriority.dataProvider.getJsonRow(row));
          });

          formData.append('WRK_TYPE', 'DELETE');
          formData.append('checked', JSON.stringify(checked));
          formData.append('USER_ID', username);

          zAxios({
            method: 'post',
            url: 'engine/mp/SRV_UI_MP_08_S1',
            data: formData
          })
          .then(function (res) {
            if (res.data.RESULT_SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_MP_08_S1_P_RT_MSG), { close: false });
            } else {
              showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
            }

            gridPeriod.dataProvider.clearRows();
            loadResPriority();
            setPopupData({});
          })
          .catch(function (err) {
            console.log(err);
          });
        }
      });
    }
  }

  function saveResPriority() {
    gridResPriority.gridView.commit(true);

    let changedRow = [];

    changedRow = changedRow.concat(
      gridResPriority.dataProvider.getAllStateRows().created,
      gridResPriority.dataProvider.getAllStateRows().updated,
      gridResPriority.dataProvider.getAllStateRows().deleted,
      gridResPriority.dataProvider.getAllStateRows().createAndDeleted
    );

    if (!changedRow.length) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
    } else {
      showMessage(transLangKey('SAVE'), transLangKey('MSG_SAVE'), function (answer) {
        if (answer) {
          let formData = new FormData();
          let changes = [];

          changedRow.forEach(function (row) {
            changes.push(gridResPriority.dataProvider.getJsonRow(row));
          });

          changes.forEach(function (row) {
            if (row.BASE_ALLOC_RULE_ID == '') {
              row.BASE_ALLOC_RULE_ID = null;
            }
          });

          formData.append('WRK_TYPE', 'SAVE');
          formData.append('changes', JSON.stringify(changes));
          formData.append('USER_ID', username);

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_UI_MP_08_S1',
            data: formData
          })
          .then(function (res) {
            if (res.data.RESULT_SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_MP_08_S1_P_RT_MSG), { close: false });
              loadResPriority();
            } else {
              showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
            }
          })
          .catch(function (err) {
            console.error(err);
          });
        }
      });
    }
  }

  function loadPeriodData(locationItemId, allocationRuleId) {
    let formData = new FormData();

    formData.append('LOCAT_ITEM_ID', locationItemId);
    formData.append('ALLOC_RULE', allocationRuleId);
    formData.append('CROSSTAB', JSON.stringify(gridPeriod.gridView.crossTabInfo));

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_08_Q2',
      data: formData
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridPeriod.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function savePeriodData() {
    gridPeriod.gridView.commit(true);

    let changedRow = [];

    changedRow = changedRow.concat(
      gridPeriod.dataProvider.getAllStateRows().created,
      gridPeriod.dataProvider.getAllStateRows().updated,
      gridPeriod.dataProvider.getAllStateRows().deleted,
      gridPeriod.dataProvider.getAllStateRows().createAndDeleted
    );

    if (!changedRow.length) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
    } else {
      showMessage(transLangKey('SAVE'), transLangKey('MSG_SAVE'), function (answer) {
        if (answer) {
          let formData = new FormData();
          let changes = [];

          changedRow.forEach(function (row) {
            changes.push(gridPeriod.dataProvider.getJsonRow(row));
          });

          formData.append('WRK_TYPE', 'SAVE');
          formData.append('changes', JSON.stringify(changes));
          formData.append('USER_ID', username);
          formData.append('CROSSTAB', JSON.stringify(gridPeriod.gridView.crossTabInfo));
          formData.append('REVERSE_TARGET', 'changes');

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_UI_MP_08_S3',
            data: formData
          })
          .then(function (res) {
            if (res.data.RESULT_SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_MP_08_S3_P_RT_MSG), { close: false });
              loadPeriodData(popupData.LOCAT_ITEM_ID, popupData.BASE_ALLOC_RULE_ID);
            } else {
              showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
            }
          })
          .catch(function (err) {
            console.error(err);
          });
        }
      });
    }
  }

  function openNewItemResPreferencePopup() {
    setNewItemResPreferencePopupOpen(true);
  }

  function closeNewItemResPreferencePopup() {
    setNewItemResPreferencePopupOpen(false);
  }

  function openPeriodNewItemResPreferencePopup() {
    if (popupData.BASE_ALLOC_RULE_ID) {
      setPeriodNewItemResPreferencePopupOpen(true);
    } else {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5123'), { close: false });
    }
  }

  function closePeriodNewItemResPreferencePopup() {
    setPeriodNewItemResPreferencePopupOpen(false);
  }

  function openResourcePopup() {
    setResourcePopupOpen(true);
  }

  function closeResourcePopup() {
    setResourcePopupOpen(false);
  }

  function onCloseResourcePopup(gridRow) {
    setValue('resourceCode', gridRow.RES_CD);
    setValue('resourceDescription', gridRow.RES_DESCRIP);
  }

  function openBundleCreatePopup() {
    setBundleCreatePopupOpen(true);
  }

  function closeBundleCreatePopup() {
    setBundleCreatePopupOpen(false);
  }

  function onCloseBundleCreatePopup() {
    loadResPriority();
  }

  function openBatchUpdatePopup() {
    setBatchUpdatePopupOpen(true);
  }

  function closeBatchUpdatePopup() {
    setBatchUpdatePopupOpen(false);
  }

  function onCloseBatchUpdatePopup() {
    loadPeriodData(popupData.LOCAT_ITEM_ID, popupData.BASE_ALLOC_RULE_ID);
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <LocationSearchBox ref={locationSearchBoxRef} keyValue={'locationName'} placeHolder={transLangKey("LOCAT_NM")} style={{width: 300}}/>
            <ItemSearchBox ref={itemSearchBoxRef} keyValue={'itemName'} placeHolder={transLangKey("ITEM_NM")} style={{width: 300}}/>
            <InputField type="action" name="resourceCode" label={transLangKey("RES_CD")} title={transLangKey("SEARCH")} onClick={openResourcePopup} control={control}>
              <Icon.Search />
            </InputField>
            <InputField name="resourceDescription" label={transLangKey("RES_DESCRIP")} control={control} />
          </SearchRow>
        </SearchArea>

        <Box style={{ height: "60%" }}>
          <ButtonArea>
            <LeftButtonArea>
              <GridExcelExportButton type="icon" grid="gridResPriority" options={exportOptions} />
              {/*<GridExcelImportButton type="icon" grid="gridResPriority" />*/}
              <CommonButton title={transLangKey("BUNDLE_CREATE")} onClick={openBundleCreatePopup}><Icon.File/></CommonButton>
            </LeftButtonArea>
            <RightButtonArea>
              <GridAddRowButton type="icon" onClick={openNewItemResPreferencePopup} />
              <GridDeleteRowButton type="icon" onClick={deleteResPriority} />
              <GridSaveButton type="icon" onClick={saveResPriority} />
            </RightButtonArea>
          </ButtonArea>
          <Box style={{ height: "calc(100% - 50px)" }}>
            <BaseGrid id="gridResPriority" items={gridResPriorityColumns} afterGridCreate={afterGridResPriority} />
          </Box>
        </Box>
        <Box style={{ height: "40%" }}>
          <ButtonArea>
            <LeftButtonArea>
              <CommonButton title={transLangKey("BATCH_UPDATE")} onClick={openBatchUpdatePopup}><Icon.Database/></CommonButton>
            </LeftButtonArea>
            <RightButtonArea>
              <GridAddRowButton type="icon" onClick={openPeriodNewItemResPreferencePopup} />
              <GridSaveButton type="icon" onClick={savePeriodData} />
            </RightButtonArea>
          </ButtonArea>
          <Box style={{ height: "calc(100% - 50px)" }}>
            <BaseGrid id="gridPeriod" items={gridPeriodColumns} viewCd="UI_MP_08" gridCd="UI_MP_08-RST_CPT_02" afterGridCreate={afterGridPeriodCreate} />
          </Box>
        </Box>
      </ContentInner>

      {resourcePopupOpen && (<PopCommResource open={resourcePopupOpen} onClose={closeResourcePopup} confirm={onCloseResourcePopup} />)}
      {newItemResPreferencePopupOpen && (<PopItemResPreferenceNew open={newItemResPreferencePopupOpen} onClose={closeNewItemResPreferencePopup} confirm={loadResPriority} />)}
      {newPeriodItemResPreferencePopupOpen && (<PopPeriodItemResPreferenceNew open={newPeriodItemResPreferencePopupOpen} onClose={closePeriodNewItemResPreferencePopup} confirm={() => {loadPeriodData(popupData.LOCAT_ITEM_ID, popupData.BASE_ALLOC_RULE_ID)}} data={popupData} />)}
      {bundleCreatePopupOpen && (<PopItemResPreferenceBundleCreate open={bundleCreatePopupOpen} onClose={closeBundleCreatePopup} confirm={onCloseBundleCreatePopup} />)}
      {batchUpdatePopupOpen && (<PopItemResPreferenceBatchUpdate open={batchUpdatePopupOpen} onClose={closeBatchUpdatePopup} confirm={onCloseBatchUpdatePopup} data={gridPeriod.gridView.getJsonRows().length > 0 ? popupData : null} />)}
    </>
  )
}

export default ItemResPreference;
