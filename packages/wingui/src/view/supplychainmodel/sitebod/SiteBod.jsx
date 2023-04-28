import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import { useForm } from 'react-hook-form';
import {
  BaseGrid, ButtonArea, CommonButton, ContentInner, GridAddRowButton, GridDeleteRowButton, GridExcelExportButton, GridExcelImportButton, GridSaveButton,
  LeftButtonArea, ResultArea, RightButtonArea, SearchArea, SearchRow, useUserStore, useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';

import PopSiteBod from './PopSiteBod';
import PopSiteBodBundleCreate from './PopSiteBodBundleCreate';
import PopPeriodSourcingPolicy from './PopPeriodSourcingPolicy';
import LocationSearchBox from '../common/LocationSearchBox';
import { setGridComboList } from "@wingui/view/supplychainmodel/common/common";

let gridBodColumns = [
  { name: 'BOD_MAP_ID', dataType: 'text', headerText: 'BOD_MAP_ID', visible: false, editable: false, width: 50 },
  { name: 'CONSUME_LOCAT_ID', dataType: 'text', headerText: 'CONSUME_LOCAT_ID', visible: false, editable: false, width: 50 },
  { name: 'SUPPLY_LOCAT_ID', dataType: 'text', headerText: 'SUPPLY_LOCAT_ID', visible: false, editable: false, width: 50 },
  { name: 'BOD_TP_ID', dataType: 'text', headerText: 'BOD_TP_ID', visible: false, editable: false, width: 50 },
  { name: 'BOD_TYPE', dataType: 'text', headerText: 'BOD_TYPE', visible: false, editable: false, width: 50 },
  {
    name: 'CONSUME', dataType: 'group', orientation: 'horizontal', headerText: 'CONSUME', headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: 'LOCAT_TP', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: 80, groupShowMode: 'expand' },
      { name: 'LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: 80, groupShowMode: 'expand' },
      { name: 'LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: 80, groupShowMode: 'always' },
      { name: 'LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: 120, groupShowMode: 'always' }
    ]
  },
  {
    name: 'SUPPLY', dataType: 'group', orientation: 'horizontal', headerText: 'SUPPLY', headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: 'SRCING_POLICY_ID', dataType: 'text', headerText: 'SRCING_POLICY', visible: true, editable: true, width: 100, useDropdown: true, lookupDisplay: true, groupShowMode: 'always' },
      { name: 'SRCING_RULE', dataType: 'number', headerText: 'SRCING_RULE', visible: true, editable: true, width: 70, groupShowMode: 'always' },
      { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: true, width: 50, groupShowMode: 'always' },
      { name: 'SUPPLY_LOCAT_TP', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: 80, groupShowMode: 'expand' },
      { name: 'SUPPLY_LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: 80, groupShowMode: 'expand' },
      { name: 'SUPPLY_LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: 80, groupShowMode: 'always' },
      { name: 'SUPPLY_LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: 120, groupShowMode: 'always' }
    ]
  },
  {
    name: 'VEHICL_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'VEHICL_GROUP', headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: 'VEHICL_TP', dataType: 'text', headerText: 'VEHICL_TP', visible: true, editable: false, width: 80, autoFilter: true },
      { name: 'BOD_LEADTIME', dataType: 'number', headerText: 'BOD_LEADTIME', visible: true, editable: false, width: 80 },
      { name: 'UOM_NM', dataType: 'text', headerText: 'TIME_UOM_NM', visible: true, editable: false, width: 80 }
    ]
  },
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

let gridPeriodPolicyColumns = [
  { name: 'BOD_MAP_PRIOD_ID', dataType: 'text', headerText: 'BOD_MAP_PRIOD_ID', visible: false, editable: false, width: 50 },
  {
    name: 'CONSUME', dataType: 'group', orientation: 'horizontal', headerText: 'CONSUME', headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: 'CONSUME_LOCAT_TP', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: 100, groupShowMode: 'expand' },
      { name: 'CONSUME_LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: 100, groupShowMode: 'expand' },
      { name: 'CONSUME_LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: 100, groupShowMode: 'always' },
      { name: 'CONSUME_LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: 100, groupShowMode: 'always' }
    ]
  },
  {
    name: 'SUPPLY', dataType: 'group', orientation: 'horizontal', headerText: 'SUPPLY', headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: 'SUPPLY_LOCAT_TP', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: 100, groupShowMode: 'expand' },
      { name: 'SUPPLY_LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: 100, groupShowMode: 'expand' },
      { name: 'SUPPLY_LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: 100, groupShowMode: 'always' },
      { name: 'SUPPLY_LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: 100, groupShowMode: 'always' }
    ]
  },
  { name: 'STRT_DTTM', dataType: 'datetime', headerText: 'STRT_DATE', visible: true, editable: true, width: 100, format: 'yyyy-MM-dd' },
  { name: 'END_DTTM', dataType: 'datetime', headerText: 'END_DATE', visible: true, editable: true, width: 100, format: 'yyyy-MM-dd' },
  { name: 'SRCING_RULE', dataType: 'number', headerText: 'SRCING_RULE', visible: true, editable: true, width: 100, autoFilter: true },
  { name: 'DEL_YN', dataType: 'boolean', headerText: 'DEL_YN', visible: true, editable: true, width: 100 },
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

function SiteBod() {
  const [gridBod, setGridBod] = useState(null);
  const [gridPeriodPolicy, setGridPeriodPolicy] = useState(null);
  const [username] = useUserStore(state => [state.username]);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const consumeLocationSearchBoxRef = useRef();
  const [currentConsumeLocationRef, setCurrentConsumeLocationRef] = useState();

  const supplyLocationSearchBoxRef = useRef();
  const [currentSupplyLocationRef, setCurrentSupplyLocationRef] = useState();

  const [newSiteBodPopupOpen, setNewSiteBodPopupOpen] = useState(false);
  const [siteBodBundleCreatePopupOpen, setSiteBodBundleCreatePopupOpen] = useState(false);
  const [newPeriodSourcingPolicyPopupOpen, setNewPeriodSourcingPolicyPopupOpen] = useState(false);
  const [popupData, setPopupData] = useState({});

  const { reset, getValues, setValue } = useForm({
    defaultValues: {
    }
  });

  const exportOptions = {
    headerDepth: 2,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  };

  useEffect(() => {
    const gridObj1 = getViewInfo(vom.active, 'gridBod');
    const gridObj2 = getViewInfo(vom.active, 'gridPeriodPolicy');

    if (gridObj1) {
      if (gridObj1.dataProvider) {
        setGridBod(gridObj1)
      }
    }

    if (gridObj2) {
      if (gridObj2.dataProvider) {
        setGridPeriodPolicy(gridObj2)
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
      { name: 'search', action: (e) => { loadBod(); }, visible: true, disable: false },
      { name: 'refresh', action: (e) => { refresh(); }, visible: true, disable: false }
    ]);

    if (gridBod) {
      setOptionsGridBod();
      setGridComboList(gridBod,
        'SRCING_POLICY_ID',
        'SOURCING_RULE'
        );
      loadBod();
    }

    if (gridPeriodPolicy) {
      setOptionsGridPeriodPolicy();
    }
  }, [gridBod, gridPeriodPolicy]);

  function setOptionsGridBod() {
    gridBod.gridView.setEditOptions({
      insertable: true,
      appendable: true
    })

    gridBod.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridBod, true, true, true);

    gridBod.gridView.setColumnProperty('LOCAT_TP', 'mergeRule', { criteria: "value" });
    gridBod.gridView.setColumnProperty('LOCAT_LV', 'mergeRule', { criteria: "prevvalues + values[ 'LOCAT_LV' ]" });
    gridBod.gridView.setColumnProperty('LOCAT_CD', 'mergeRule', { criteria: "prevvalues + values[ 'LOCAT_CD' ]" });
    gridBod.gridView.setColumnProperty('LOCAT_NM', 'mergeRule', { criteria: "prevvalues + values[ 'LOCAT_NM' ]" });

    gridBod.gridView.onCellClicked = function (grid, clickData) {
      if (clickData.cellType === 'data') {
        if (clickData.fieldIndex >= 7) {
          let data = gridBod.dataProvider.getOutputRow(null, clickData.dataRow);
          setPopupData(data);
          loadPeriodSourcingPolicy(data.CONSUME_LOCAT_ID);
        }
      }
    }
  }

  function setOptionsGridPeriodPolicy() {
    gridPeriodPolicy.gridView.setEditOptions({
      insertable: true,
      appendable: true
    })

    gridPeriodPolicy.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridPeriodPolicy, true, true, true);

    gridPeriodPolicy.gridView.setColumnProperty('CONSUME_LOCAT_TP', 'mergeRule', { criteria: 'value' });
    gridPeriodPolicy.gridView.setColumnProperty('CONSUME_LOCAT_LV', 'mergeRule', { criteria: 'value' });
    gridPeriodPolicy.gridView.setColumnProperty('CONSUME_LOCAT_CD', 'mergeRule', { criteria: 'value' });
    gridPeriodPolicy.gridView.setColumnProperty('CONSUME_LOCAT_NM', 'mergeRule', { criteria: 'value' });
  }

  function loadBod() {
    gridPeriodPolicy.dataProvider.clearRows();
    loadSourcingPolicyMasterData();
    setPopupData('');
  }

  function refresh() {
    commitGrids();
    currentConsumeLocationRef.reset();
    currentSupplyLocationRef.reset();
    reset();

    setPopupData('');

    gridBod.dataProvider.clearRows();
    gridPeriodPolicy.dataProvider.clearRows();
  }

  function loadSourcingPolicyMasterData() {
    let params = new URLSearchParams();

    params.append('BOD_TYPE', '');
    params.append('CONSUME_LOCAT_TP', currentConsumeLocationRef.getLocationType());
    params.append('CONSUME_LOCAT_LV', currentConsumeLocationRef.getLocationLevel());
    params.append('CONSUME_LOCAT_CD', currentConsumeLocationRef.getLocationCode());
    params.append('CONSUME_LOCAT_NM', currentConsumeLocationRef.getLocationName());
    params.append('SUPPLY_LOCAT_TP', currentSupplyLocationRef.getLocationType());
    params.append('SUPPLY_LOCAT_LV', currentSupplyLocationRef.getLocationLevel());
    params.append('SUPPLY_LOCAT_CD', currentSupplyLocationRef.getLocationCode());
    params.append('SUPPLY_LOCAT_NM', currentSupplyLocationRef.getLocationName());
    params.append('timeout', 0);
    params.append('CURRENT_OPERATION_CALL_ID', 'OPC_GRID_LOAD');

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_CM_06_Q1',
      data: params
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridBod.dataProvider.clearRows();
        gridBod.dataProvider.fillJsonData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
  }

  function loadPeriodSourcingPolicy(masterId) {
    let params = new URLSearchParams();

    params.append('CONSUME_LOCAT_ID', masterId);
    params.append('timeout', 0);
    params.append('CURRENT_OPERATION_CALL_ID', 'OPC_RST_CPT_01_cell-click_01');

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_CM_06_Q2',
      data: params
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridPeriodPolicy.dataProvider.clearRows();
        gridPeriodPolicy.dataProvider.fillJsonData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
  }

  function commitGrids() {
    gridBod.gridView.commit(true);
    gridPeriodPolicy.gridView.commit(true);
  }

  function popupNewBod() {
    commitGrids();
    setNewSiteBodPopupOpen(true);
  }

  function closeNewSiteBodPopup() {
    setNewSiteBodPopupOpen(false);
  }

  function saveBod() {
    commitGrids();

    let changedRow = [];

    changedRow = changedRow.concat(
      gridBod.dataProvider.getAllStateRows().created,
      gridBod.dataProvider.getAllStateRows().updated,
      gridBod.dataProvider.getAllStateRows().deleted,
      gridBod.dataProvider.getAllStateRows().createAndDeleted
    );

    if (!changedRow.length) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
    } else {
      showMessage(transLangKey('SAVE'), transLangKey('MSG_SAVE'), function (answer) {
        if (answer) {
          let formData = new FormData();
          let changes = [];

          changedRow.forEach(function (row) {
            changes.push(gridBod.dataProvider.getJsonRow(row));
          });

          formData.append('WRK_TYPE', 'SAVE');
          formData.append('changes', JSON.stringify(changes));
          formData.append('USER_ID', username);

          zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_06_POP_01_S", formData)
          .then(function (res) {
            if (res.status === gHttpStatus.SUCCESS) {
              const rsData = res.data;
              if (rsData.RESULT_SUCCESS) {
                const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_06_POP_01_S_P_RT_MSG;
                msg === "MSG_0001" ? loadBod() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg)); 
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

  function deleteBod() {
    commitGrids();

    let checkedItems = gridBod.gridView.getCheckedItems();

    if (!checkedItems.length) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SELECT_DELETE'), { close: false });
    } else {
      showMessage(transLangKey('DELETE'), transLangKey('MSG_DELETE'), function (answer) {
        if (answer) {
          let formData = new FormData();
          let changes = [];

          checkedItems.forEach(function (row) {
            changes.push(gridBod.dataProvider.getJsonRow(row));
          });

          formData.append('WRK_TYPE', 'DELETE');
          formData.append('changes', JSON.stringify(changes));

          zAxios.post(baseURI() + 'engine/mp/SRV_UI_CM_06_POP_01_S', formData)
            .then(function (res) {
              if (res.status === gHttpStatus.SUCCESS) {
                const rsData = res.data;
                if (rsData.RESULT_SUCCESS) {
                  const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_06_POP_01_S_P_RT_MSG;
                  msg === "MSG_0002" ? loadBod() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg)); 
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

  function openSiteBodBundleCreatePopup() {
    setSiteBodBundleCreatePopupOpen(true);
  }

  function closeSiteBodBundleCreatePopup() {
    setSiteBodBundleCreatePopupOpen(false);
  }

  function popupNewPeriodSourcingPolicy() {
    commitGrids();

    setNewPeriodSourcingPolicyPopupOpen(true);
  }

  function closeNewPeriodSourcingPolicyPopup() {
    commitGrids();

    setNewPeriodSourcingPolicyPopupOpen(false);
  }

  function savePeriodSourcingPolicy() {
    commitGrids();

    let changedRow = [];

    changedRow = changedRow.concat(
      gridPeriodPolicy.dataProvider.getAllStateRows().created,
      gridPeriodPolicy.dataProvider.getAllStateRows().updated,
      gridPeriodPolicy.dataProvider.getAllStateRows().deleted,
      gridPeriodPolicy.dataProvider.getAllStateRows().createAndDeleted
    );

    if (!changedRow.length) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
    } else {
      showMessage(transLangKey('SAVE'), transLangKey('MSG_SAVE'), function (answer) {
        if (answer) {
          let formData = new FormData();
          let changes = [];

          changedRow.forEach(function (row) {
            let data = gridPeriodPolicy.dataProvider.getJsonRow(row);
            data.STRT_DTTM = data.STRT_DTTM.format('yyyy-MM-ddT00:00:00');
            data.END_DTTM = data.END_DTTM.format('yyyy-MM-ddT00:00:00');
            changes.push(data);
          });

          formData.append('WRK_TYPE', 'SAVE');
          formData.append('changes', JSON.stringify(changes));
          formData.append('USER_ID', username);

          zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_06_S2", formData)
            .then(function (res) {
              if (res.status === gHttpStatus.SUCCESS) {
                const rsData = res.data;
                if (rsData.RESULT_SUCCESS) {
                  const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_06_S2_P_RT_MSG;
                  msg === "MSG_0001" ? loadPeriodSourcingPolicy(popupData.CONSUME_LOCAT_ID) : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg)); 
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

  function deletePeriodSourcingPolicy() {
    commitGrids();

    let checkedItems = gridPeriodPolicy.gridView.getCheckedItems();

    if (!checkedItems.length) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SELECT_DELETE'), { close: false });
    } else {
      showMessage(transLangKey('DELETE'), transLangKey('MSG_DELETE'), function (answer) {
        if (answer) {
          let formData = new FormData();
          let changes = [];

          checkedItems.forEach(function (row) {
            changes.push(gridPeriodPolicy.dataProvider.getJsonRow(row));
          });

          formData.append('WRK_TYPE', 'DELETE');
          formData.append('changes', JSON.stringify(changes));

          zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_06_S2", formData)
            .then(function (res) {
              if (res.status === gHttpStatus.SUCCESS) {
                const rsData = res.data;
                if (rsData.RESULT_SUCCESS) {
                  const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_06_S2_P_RT_MSG;
                  msg === "MSG_0002" ? loadPeriodSourcingPolicy(popupData.CONSUME_LOCAT_ID) : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg)); 
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

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <LocationSearchBox ref={consumeLocationSearchBoxRef} keyValue={'locationName'} label={transLangKey("CONSUME_LOCAT")} placeHolder={transLangKey("LOCAT_NM")} style={{width: 300}}/>
            <LocationSearchBox ref={supplyLocationSearchBoxRef} keyValue={'locationName'} label={transLangKey("SUPPLY_LOCAT")} placeHolder={transLangKey("LOCAT_NM")} style={{width: 300}}/>
          </SearchRow>
        </SearchArea>
        <ResultArea>
          <Box>
            <ButtonArea>
              <LeftButtonArea>
                <GridExcelExportButton type="icon" grid="gridBod" options={exportOptions} />
                {/*<GridExcelImportButton type="icon" grid="gridBod" />*/}
                <CommonButton title={transLangKey("BUNDLE_CREATE")} onClick={openSiteBodBundleCreatePopup}><Icon.File/></CommonButton>
              </LeftButtonArea>
              <RightButtonArea>
                <GridAddRowButton type="icon" grid="gridBod" onClick={popupNewBod} />
                <GridDeleteRowButton type="icon" grid="gridBod" onClick={deleteBod} />
                <GridSaveButton type="icon" grid="gridBod" onClick={() => { saveBod() }}></GridSaveButton>
              </RightButtonArea>
            </ButtonArea>
            <Box style={{ height: 'calc(100% - 53px)' }}>
              <BaseGrid id="gridBod" items={gridBodColumns} />
            </Box>
          </Box>
          <Box>
            <ButtonArea>
              <RightButtonArea>
                <GridAddRowButton type="icon" grid="gridPeriodPolicy" onClick={popupNewPeriodSourcingPolicy} />
                <GridDeleteRowButton type="icon" grid="gridPeriodPolicy" onClick={deletePeriodSourcingPolicy} />
                <GridSaveButton type="icon" grid="gridPeriodPolicy" onClick={() => { savePeriodSourcingPolicy() }}></GridSaveButton>
              </RightButtonArea>
            </ButtonArea>
            <Box style={{ height: 'calc(100% - 53px)' }}>
              <BaseGrid id="gridPeriodPolicy" items={gridPeriodPolicyColumns} />
            </Box>
          </Box>
        </ResultArea>
      </ContentInner>

      {newSiteBodPopupOpen && (<PopSiteBod open={newSiteBodPopupOpen} onClose={() => closeNewSiteBodPopup() } confirm={loadBod} />)}
      {siteBodBundleCreatePopupOpen && (<PopSiteBodBundleCreate open={siteBodBundleCreatePopupOpen} onClose={() => closeSiteBodBundleCreatePopup() } confirm={() => loadBod()} />)}
      {newPeriodSourcingPolicyPopupOpen && (<PopPeriodSourcingPolicy open={newPeriodSourcingPolicyPopupOpen} onClose={() => closeNewPeriodSourcingPolicyPopup() } confirm={() => loadPeriodSourcingPolicy(popupData.CONSUME_LOCAT_ID)} data={popupData} />)}
    </>
  )
}

export default SiteBod;
