import React, { useState, useEffect, useRef } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import {
  BaseGrid, ButtonArea, CommonButton, ContentInner, GridExcelExportButton, GridExcelImportButton, GridSaveButton,
  LeftButtonArea, ResultArea, RightButtonArea, SearchArea, SearchRow, useUserStore, useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';
import { setGridComboList } from "@wingui/view/supplychainmodel/common/common";

import ItemSearchBox from '@wingui/view/supplychainmodel/common/ItemSearchBox';
import LocationSearchBox from '@wingui/view/supplychainmodel/common/LocationSearchBox';

import PopLocatTp from '@wingui/view/common/PopLocatTp';
import PopCommItem from '@wingui/view/supplychainmodel/common/PopCommItem';

let gridEnterpriseColumns = [
  { name: 'ID', dataType: 'text', headerText: 'ITEM_CD', visible: false, editable: false, width: 100 },
  { name: 'ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', visible: true, editable: false, width: 100 },
  { name: 'ITEM_NM', dataType: 'text', headerText: 'ITEM_NM', visible: true, editable: false, width: 100 },
  { name: 'ITEM_TP_ID', dataType: 'text', headerText: 'ITEM_TP', visible: true, editable: false, width: 100, lookupDisplay: true },
  { name: 'DP_PLAN_YN', dataType: 'boolean', headerText: 'DP_PLAN_YN', visible: true, editable: false, width: 100 },
  { name: 'GRADE_YN', dataType: 'boolean', headerText: 'GRADE_YN', visible: true, editable: true, startEditOnClick: false, width: 100 },
  { name: 'MODIFY_BY', dataType: 'text', headerText: 'MODIFY_BY', visible: true, editable: false, width: 80 },
  { name: 'MODIFY_DTTM', dataType: 'datetime', headerText: 'MODIFY_DTTM', visible: true, editable: false, width: 80 }
]

let gridDistributionCenterColumns = [
  { name: 'ID', dataType: 'text', headerText: 'ITEM_CD', visible: false, editable: false, width: 100 },
  { name: 'LOCAT_TP_NM', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: 120 },
  { name: 'LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: 120 },
  { name: 'LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: 120 },
  { name: 'LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: 120 },
  { name: 'ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', visible: true, editable: false, width: 100 },
  { name: 'ITEM_NM', dataType: 'text', headerText: 'ITEM_NM', visible: true, editable: false, width: 100 },
  { name: 'ITEM_TP_ID', dataType: 'text', headerText: 'ITEM_TP', visible: true, editable: false, width: 100, lookupDisplay: true },
  { name: 'ORG_GRADE', dataType: 'text', headerText: 'ORG_GRADE', visible: true, editable: false, width: 100 },
  { name: 'ACT_SHIP_YN', dataType: 'boolean', headerText: 'ACT_SHIP_YN', visible: true, editable: false, width: 100 },
  { name: 'GRADE_YN', dataType: 'boolean', headerText: 'GRADE_YN', visible: true, editable: true, width: 100 },
  { name: 'MODIFY_BY', dataType: 'text', headerText: 'MODIFY_BY', visible: true, editable: false, width: 100 },
  { name: 'MODIFY_DTTM', dataType: 'datetime', headerText: 'MODIFY_DTTM', visible: true, editable: false, width: 140 }
]

function GradeTarget() {
  const [gridEnterprise, setGridEnterprise] = useState(null);
  const [gridDistributionCenter, setGridDistributionCenter] = useState(null);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [username] = useUserStore(state => [state.username]);

  const [tabValue, setTabValue] = useState('gridEnterprise');

  const locationSearchBoxRef = useRef();
  const itemSearchBoxRef = useRef();

  const [currentLocationRef, setCurrentLocationRef] = useState();
  const [currentItemRef, setCurrentItemRef] = useState();

  const exportOptions = {
    headerDepth: 1,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  };

  useEffect(() => {
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

  useEffect(() => {
    setViewInfo(vom.active, 'globalButtons', [
      { name: 'search', action: (e) => { loadData(tabValue); }, visible: true, disable: false },
      { name: 'refresh', action: (e) => { refresh(tabValue); }, visible: true, disable: false }
    ]);

    if (gridEnterprise && gridDistributionCenter) {
      loadEnterpriseGrade();
      loadDistributionCenterGrade();
    }
  }, [gridEnterprise, gridDistributionCenter]);

  const tabChange = (event, newValue) => {
    setViewInfo(vom.active, 'globalButtons', [
      { name: 'search', action: (e) => { loadData(newValue); }, visible: true, disable: false },
      { name: 'refresh', action: (e) => { refresh(newValue); }, visible: true, disable: false }
    ]);

    setTabValue(newValue);
  };

  function afterGridEnterprise(gridObj) {
    setGridEnterprise(gridObj);
    setGridEnterpriseOption(gridObj);
  }

  function afterGridDistributionCenter(gridObj) {
    setGridDistributionCenter(gridObj);
    setGridDistributionCenterOption(gridObj);
  }

  function setGridEnterpriseOption(gridObj) {
    gridObj.gridView.setEditOptions({
      insertable: true,
      appendable: true
    })

    gridObj.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridObj, true, true, false);

    setGridComboList(gridObj, "ITEM_TP_ID", "ITEM_TYPE");
  }

  function setGridDistributionCenterOption(gridObj) {
    gridObj.gridView.setEditOptions({
      insertable: true,
      appendable: true
    })

    gridObj.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridObj, true, true, false);

    gridObj.gridView.setColumnProperty('LOCAT_TP_NM', 'mergeRule', { criteria: 'value' });
    gridObj.gridView.setColumnProperty('LOCAT_LV', 'mergeRule', { criteria: 'value' });
    gridObj.gridView.setColumnProperty('LOCAT_CD', 'mergeRule', { criteria: 'value' });
    gridObj.gridView.setColumnProperty('LOCAT_NM', 'mergeRule', { criteria: 'value' });

    setGridComboList(gridObj, "ITEM_TP_ID", "ITEM_TYPE");
  }

  function loadData(activeTab) {
    if (activeTab === 'gridEnterprise') {
      loadEnterpriseGrade();
    } else if (activeTab === 'gridDistributionCenter') {
      loadDistributionCenterGrade();
    }
  }

  function refresh(activeTab) {
    currentItemRef.reset();
    currentLocationRef.reset();

    if (activeTab === 'gridEnterprise') {
      gridEnterprise.dataProvider.clearRows();
    } else if (activeTab === 'gridDistributionCenter') {
      gridDistributionCenter.dataProvider.clearRows();
    }
  }

  function loadEnterpriseGrade() {
    let param = new URLSearchParams();

    param.append('ITEM_CD', currentItemRef.getItemCode());
    param.append('ITEM_NM', currentItemRef.getItemName());
    param.append('ITEM_TP', currentItemRef.getItemType());
    param.append('timeout', 0);
    param.append('CURRENT_OPERATION_CALL_ID', 'OPC_RST_CPT_01_LOAD');

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_IM_03_Q1',
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridEnterprise.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function loadDistributionCenterGrade() {
    let param = new URLSearchParams();

    param.append('LOCAT_TP', currentLocationRef.getLocationType());
    param.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    param.append('LOCAT_CD', currentLocationRef.getLocationCode());
    param.append('LOCAT_NM', currentLocationRef.getLocationName());
    param.append('ITEM_CD', currentItemRef.getItemCode());
    param.append('ITEM_NM', currentItemRef.getItemName());
    param.append('ITEM_TP', currentItemRef.getItemType());
    param.append('timeout', 0);
    param.append('CURRENT_OPERATION_CALL_ID', 'OPC_RST_CPT_02_LOAD');

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_IM_03_Q2',
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridDistributionCenter.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function saveEnterpriseGrade() {
    gridEnterprise.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changes = [];
        changes = changes.concat(
          gridEnterprise.dataProvider.getAllStateRows().created,
          gridEnterprise.dataProvider.getAllStateRows().updated,
          gridEnterprise.dataProvider.getAllStateRows().deleted,
          gridEnterprise.dataProvider.getAllStateRows().createAndDeleted
        );

        let changeRowData = [];
        changes.forEach(function (row) {
          changeRowData.push(gridEnterprise.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          let param = new URLSearchParams();

          param.append('TYPE', 'SAVE');
          param.append('changes', JSON.stringify(changeRowData));
          param.append('USER_ID', username);
          param.append('timeout', 0);
          param.append('CURRENT_OPERATION_CALL_ID', 'OPC_SAVE_RST_CPT_01');

          zAxios({
            method: 'post',
            header: { 'content-type': 'application/json' },
            url: baseURI() + 'engine/mp/SRV_UI_IM_03_S1',
            data: param
          })
          .then(function (res) {
            if (res.status === gHttpStatus.SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_IM_03_S1_P_RT_MSG), { close: false });
              loadEnterpriseGrade();
            } else {
              showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
            }
          })
          .catch(function (err) {
            console.log(err);
          });
        }
      }
    });
  }

  function saveDistributionCenterGrade() {
    gridDistributionCenter.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changes = [];
        changes = changes.concat(
          gridDistributionCenter.dataProvider.getAllStateRows().created,
          gridDistributionCenter.dataProvider.getAllStateRows().updated,
          gridDistributionCenter.dataProvider.getAllStateRows().deleted,
          gridDistributionCenter.dataProvider.getAllStateRows().createAndDeleted
        );

        let changeRowData = [];
        changes.forEach(function (row) {
          changeRowData.push(gridDistributionCenter.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          let param = new URLSearchParams();

          param.append('TYPE', 'SAVE');
          param.append('changes', JSON.stringify(changeRowData));
          param.append('USER_ID', username);
          param.append('timeout', 0);
          param.append('CURRENT_OPERATION_CALL_ID', 'OPC_SAVE_RST_CPT_02');

          zAxios({
            method: 'post',
            header: { 'content-type': 'application/json' },
            url: baseURI() + 'engine/mp/SRV_UI_IM_03_S2',
            data: param
          })
          .then(function (res) {
            if (res.status === gHttpStatus.SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_IM_03_S2_P_RT_MSG), { close: false });
              loadDistributionCenterGrade();
            } else {
              showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
            }
          })
          .catch(function (err) {
            console.log(err);
          });
        }
      }
    });
  }

  function saveBatchEnterpriseGrade() {
    gridEnterprise.gridView.commit(true);

    showMessage(transLangKey('BATCH_UPDATE'), transLangKey('MSG_5135'), function (answer) {
      if (answer) {
        let param = new URLSearchParams();

        param.append('TYPE', 'ALL');
        param.append('USER_ID', username);
        param.append('timeout', 0);
        param.append('PREV_OPERATION_CALL_ID', 'OPC_RST_CPT_01_07_DIALOG');
        param.append('CURRENT_OPERATION_CALL_ID', 'OPC_RST_CPT_01_07_SAVE_ALL');

        zAxios({
          method: 'post',
          header: { 'content-type': 'application/json' },
          url: baseURI() + 'engine/mp/SRV_UI_IM_03_S1',
          data: param
        })
        .then(function (res) {
          if (res.status === gHttpStatus.SUCCESS) {
            showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_IM_03_S1_P_RT_MSG), { close: false });
            loadEnterpriseGrade();
          } else {
            showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
          }
        })
        .catch(function (err) {
          console.log(err);
        });
      }
    });
  }

  function saveBatchDistributionCenterGrade() {
    gridDistributionCenter.gridView.commit(true);

    showMessage(transLangKey('BATCH_UPDATE'), transLangKey('MSG_5135'), function (answer) {
      if (answer) {
        let param = new URLSearchParams();

        param.append('TYPE', 'ALL');
        param.append('USER_ID', username);
        param.append('timeout', 0);
        param.append('PREV_OPERATION_CALL_ID', 'OPC_RST_CPT_02_07_DIALOG');
        param.append('CURRENT_OPERATION_CALL_ID', 'OPC_RST_CPT_02_07_SAVE_ALL');

        zAxios({
          method: 'post',
          header: { 'content-type': 'application/json' },
          url: baseURI() + 'engine/mp/SRV_UI_IM_03_S2',
          data: param
        })
        .then(function (res) {
          if (res.status === gHttpStatus.SUCCESS) {
            showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_IM_03_S2_P_RT_MSG), { close: false });
            loadDistributionCenterGrade();
          } else {
            showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
          }
        })
        .catch(function (err) {
          console.log(err);
        });
      }
    });
  }

  return (
    <>
      <ContentInner>
        <SearchArea >
          <SearchRow>
            <LocationSearchBox ref={locationSearchBoxRef} keyValue={"locationName"} placeHolder={transLangKey("LOCAT_NM")} style={{ display: tabValue == "gridEnterprise" ? "none" : "block" }} />
            <ItemSearchBox ref={itemSearchBoxRef} keyValue={"itemName"} placeHolder={transLangKey("ITEM_NM")} fields={["itemCode", "itemName"]} style={{ popoverHeight: 200 }} />
          </SearchRow>
        </SearchArea>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs onChange={tabChange} indicatorColor="primary" value={tabValue}>
            <Tab label={transLangKey("UI_IM_03_RST_CPT_01")} value="gridEnterprise" />
            <Tab label={transLangKey("UI_IM_03_RST_CPT_02")} value="gridDistributionCenter" />
          </Tabs>
        </Box>
        <Box style={{ marginTop: "3px", width: "100%", height: "100%", }}>
          <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "gridEnterprise" ? "block" : "none" }}>
            <ButtonArea>
              <LeftButtonArea>
                <GridExcelExportButton type="icon" grid="gridEnterprise" options={exportOptions} />
                <CommonButton title={transLangKey("UI_IM_03_BATCH_UPDATE_01")} onClick={saveBatchEnterpriseGrade}><Icon.Database /></CommonButton>
              </LeftButtonArea>
              <RightButtonArea>
                <GridSaveButton type="icon" onClick={saveEnterpriseGrade} />
              </RightButtonArea>
            </ButtonArea>
            <ResultArea>
              <BaseGrid id="gridEnterprise" items={gridEnterpriseColumns} afterGridCreate={afterGridEnterprise} />
            </ResultArea>
          </Box>
          <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "gridDistributionCenter" ? "block" : "none" }}>
            <ButtonArea>
              <LeftButtonArea>
                <GridExcelExportButton type="icon" grid="gridDistributionCenter" options={exportOptions} />
                <CommonButton title={transLangKey("UI_IM_03_BATCH_UPDATE_02")} onClick={saveBatchDistributionCenterGrade}><Icon.Database /></CommonButton>
              </LeftButtonArea>
              <RightButtonArea>
                <GridSaveButton type="icon" onClick={saveDistributionCenterGrade} />
              </RightButtonArea>
            </ButtonArea>
            <ResultArea>
              <BaseGrid id="gridDistributionCenter" items={gridDistributionCenterColumns} afterGridCreate={afterGridDistributionCenter} />
            </ResultArea>
          </Box>
        </Box>
      </ContentInner>
    </>
  )
}

export default GradeTarget
