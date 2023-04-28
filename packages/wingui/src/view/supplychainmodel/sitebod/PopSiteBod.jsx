import React, { useState, useEffect } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { useForm } from 'react-hook-form';
import { BaseGrid, ButtonArea, GridAddRowButton, GridDeleteRowButton, InputField, PopupDialog, ResultArea, RightButtonArea, useViewStore, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import PopLocatTp from '@wingui/view/common/PopLocatTp';
import PopSupplyLocation from './PopSupplyLocation';
import { setGridComboList } from "@wingui/view/supplychainmodel/common/common";

let supplyLocationGridItems = [
  { name: 'BOD_MAP_ID', dataType: 'text', headerText: 'BOD_MAP_ID', visible: false, editable: false, width: 100 },
  { name: 'SRCING_POLICY_ID', dataType: 'text', headerText: 'SRCING_POLICY', visible: true, editable: true, width: 100, useDropdown: true, lookupDisplay: true },
  { name: 'SRCING_RULE', dataType: 'number', headerText: 'SRCING_RULE', visible: true, editable: true, width: 100 },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: true, width: 50 },
  { name: 'SUPPLY_LOCAT_ID', dataType: 'text', headerText: 'LOCAT_ID', visible: false, editable: false, width: 100 },
  { name: 'SUPPLY_LOC_TP', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: 100, button: 'action' },
  { name: 'SUPPLY_LOC_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: 100 },
  { name: 'SUPPLY_LOC_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: 100 },
  { name: 'SUPPLY_LOC_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: 100 }
];

function PopSiteBod(props) {
  const [supplyLocationGrid, setSupplyLocationGrid] = useState(null);
  const [username] = useUserStore(state => [state.username]);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const [locationManagementId, setLocationManagementId] = useState('');
  const [consumeLocationPopupOpen, setConsumeLocationPopupOpen] = useState(false);
  const [supplyLocationPopupOpen, setSupplyLocationPopupOpen] = useState(false);
  const [tabValue, setTabValue] = useState('consumeLocationTab');
  const [popupData, setPopupData] = useState({});

  const { control, getValues, setValue } = useForm({
    defaultValues: {
      consumeLocationType: '',
      consumeLocationLevel: '',
      consumeLocationCode: '',
      consumeLocationName: ''
    }
  });

  useEffect(() => {
    const gridObj = getViewInfo(vom.active, 'SiteBod_PopSiteBodGrid');

    if (gridObj) {
      if (gridObj.dataProvider) {
        setSupplyLocationGrid(gridObj)
      }
    }
  }, [viewData]);

  useEffect(() => {
    if (supplyLocationGrid) {
      setSupplyLocationGridOptions();
      setGridComboList(supplyLocationGrid,
        'SRCING_POLICY_ID',
        'SOURCING_RULE'
        );
    }
  }, [supplyLocationGrid]);

  function setSupplyLocationGridOptions() {
    supplyLocationGrid.gridView.setEditOptions({
      insertable: true,
      appendable: true
    })

    supplyLocationGrid.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(supplyLocationGrid, true, true, true);

    supplyLocationGrid.gridView.onCellButtonClicked = function (currentGrid, clickData, column) {
      supplyLocationGrid.gridView.commit(true);
      if (column.fieldName === 'SUPPLY_LOC_TP') {
        openSupplyLocationPopup();
      }
    }
  }

  const tabChange = (event, newValue) => {
    supplyLocationGrid.gridView.commit(true);
    setTabValue(newValue);
    if (newValue === 'supplyLocationTab') {
      loadSupplyLocation();
    }
  };

  function loadSupplyLocation() {
    let params = new URLSearchParams();

    params.append('CONSUME_LOCAT_ID', locationManagementId);

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_CM_06_POP_02_Q',
      data: params,
      fromPopup: true
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        supplyLocationGrid.dataProvider.fillJsonData(res.data.RESULT_DATA);
      }
    });
  }

  function openConsumeLocationPopup() {
    setConsumeLocationPopupOpen(true);
  }

  function closeConsumeLocationPopup() {
    setConsumeLocationPopupOpen(false);
  }

  function onSetConsumeLocation(gridRow) {
    setValue('consumeLocationType', gridRow.LOCAT_TP_NM);
    setValue('consumeLocationLevel', gridRow.LOCAT_LV);
    setValue('consumeLocationCode', gridRow.LOCAT_CD);
    setValue('consumeLocationName', gridRow.LOCAT_NM);
    setLocationManagementId(gridRow.LOCAT_MGMT_ID);
    setPopupData({LOCAT_MGMT_ID: gridRow.LOCAT_MGMT_ID, BOD_TP_ID: ''});
  }

  function openSupplyLocationPopup() {
    setSupplyLocationPopupOpen(true);
  }

  function closeSupplyLocationPopup() {
    setSupplyLocationPopupOpen(false);
  }

  function onSetSupplyLocation(gridRow) {
    let itemIndex = supplyLocationGrid.gridView.getCurrent().dataRow;

    supplyLocationGrid.dataProvider.setValue(itemIndex, 'SUPPLY_LOCAT_ID', gridRow.LOC_MGMT_ID);
    supplyLocationGrid.dataProvider.setValue(itemIndex, 'SUPPLY_LOC_TP', gridRow.LOCAT_TP);
    supplyLocationGrid.dataProvider.setValue(itemIndex, 'SUPPLY_LOC_LV', gridRow.LOCAT_LV);
    supplyLocationGrid.dataProvider.setValue(itemIndex, 'SUPPLY_LOC_CD', gridRow.LOCAT_CD);
    supplyLocationGrid.dataProvider.setValue(itemIndex, 'SUPPLY_LOC_NM', gridRow.LOCAT_NM);
  }

  function saveSubmit() {
    supplyLocationGrid.gridView.commit(true);

    let changedRow = [];

    changedRow = changedRow.concat(
      supplyLocationGrid.dataProvider.getAllStateRows().created,
      supplyLocationGrid.dataProvider.getAllStateRows().updated,
      supplyLocationGrid.dataProvider.getAllStateRows().deleted,
      supplyLocationGrid.dataProvider.getAllStateRows().createAndDeleted
    );

    if (!changedRow.length) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
    } else {
      showMessage(transLangKey('SAVE'), transLangKey('MSG_SAVE'), function (answer) {
        if (answer) {
          let params = new URLSearchParams();
          let changes = [];

          changedRow.forEach(function (row) {
            changes.push(supplyLocationGrid.dataProvider.getJsonRow(row));
          });

          params.append('WRK_TYPE', 'SAVE');
          params.append('BOD_TP_ID', '');
          params.append('CONSUME_LOCAT_ID', locationManagementId);
          params.append('changes', JSON.stringify(changes));
          params.append('USER_ID', username);

          zAxios({
            method: 'post',
            header: { 'content-type': 'application/json' },
            url: 'engine/mp/SRV_UI_CM_06_POP_01_S',
              data: params
          })
          .then(function (res) {
            if (res.data.RESULT_SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_CM_06_POP_01_S_P_RT_MSG), { close: false });
            } else {
              showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
            }

            loadSupplyLocation();
            props.confirm();
            props.onClose();
          })
          .catch(function (err) {
            console.log(err);
          });
        }
      });
    }
  }

  function close() {
    supplyLocationGrid.gridView.commit(true);
    props.onClose();
    supplyLocationGrid.dataProvider.clearRows();
  }

  return (
    <>
      <PopupDialog open={props.open} onClose={close} onSubmit={saveSubmit} title="POP_UI_CM_06_01" resizeHeight={600} resizeWidth={1000}>
        <Tabs onChange={tabChange} indicatorColor="primary" value={tabValue}>
          <Tab label={transLangKey("CONSUME_LOCAT")} value="consumeLocationTab" />
          <Tab label={transLangKey("SUPPLY_LOCAT")} value="supplyLocationTab" />
        </Tabs>
          <Box sx={{ height: "100%", display : tabValue === "consumeLocationTab" ? "block" : "none" }}>
            <Box>
              <InputField type="action" name="consumeLocationType" label={transLangKey("LOCAT_TP_NM")} onClick={() => { openConsumeLocationPopup() }} control={control}>
                <Icon.Search />
              </InputField>
              <InputField name="consumeLocationLevel" label={transLangKey("LOCAT_LV")} control={control} />
              <InputField name="consumeLocationCode" label={transLangKey("LOCAT_CD")} control={control} />
              <InputField name="consumeLocationName" label={transLangKey("LOCAT_NM")} control={control} />
            </Box>
        </Box>
        <Box sx={{ height: "100%", display : tabValue === "supplyLocationTab" ? "block" : "none" }}>
          <Box sx={{ height: "calc(100% - 50px)" }}>
            <ButtonArea>
              <RightButtonArea>
                <GridAddRowButton type="icon" grid="SiteBod_PopSiteBodGrid" />
                <GridDeleteRowButton type="icon" grid="SiteBod_PopSiteBodGrid" />
              </RightButtonArea>
            </ButtonArea>
            <ResultArea>
              <BaseGrid id="SiteBod_PopSiteBodGrid" items={supplyLocationGridItems} />
            </ResultArea>
          </Box>
        </Box>
      </PopupDialog>

      {consumeLocationPopupOpen && (<PopLocatTp open={consumeLocationPopupOpen} onClose={() => closeConsumeLocationPopup() } confirm={onSetConsumeLocation} />)}
      {supplyLocationPopupOpen && (<PopSupplyLocation open={supplyLocationPopupOpen} onClose={() => closeSupplyLocationPopup() } confirm={onSetSupplyLocation} data={popupData} />)}
    </>
  );
}

export default PopSiteBod;
