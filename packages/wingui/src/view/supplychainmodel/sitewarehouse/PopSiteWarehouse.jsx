import React, { useState } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { useForm } from 'react-hook-form';
import { BaseGrid, ButtonArea, GridAddRowButton, GridDeleteRowButton, InputField, PopupDialog, ResultArea, RightButtonArea, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import PopWhType from '../common/PopWhType';
import PopLocatTp from '@wingui/view/common/PopLocatTp';

let gridItems = [
  { name: 'MGMT_ID', dataType: 'text', headerText: 'MGMT_ID', visible: false, editable: false, width: 50 },
  { name: 'SRC_ID', dataType: 'text', headerText: 'SRC_ID', visible: false, editable: false, width: 50 },
  { name: 'DTL_ID', dataType: 'text', headerText: 'DTL_ID', visible: false, editable: false, width: 50 },
  { name: 'WAREHOUSE_TP', dataType: 'text', headerText: 'WAREHOUSE_TP', visible: false, editable: false, width: 50 },
  { name: 'WAREHOUSE_TP_NM', dataType: 'text', headerText: 'WAREHOUSE_NM', visible: true, editable: false, width: 100 },
  { name: 'LOAD_CAPA_MGMT_BASE', dataType: 'text', headerText: 'LOAD_CAPA_MGMT_BASE', visible: true, editable: false, width: 100 },
  { name: 'PALLET_LAYER', dataType: 'number', headerText: 'PALLET_LAYER', visible: true, editable: true, width: 100 },
  { name: 'LIMIT_VAL', dataType: 'number', headerText: 'LOCATIONS_LIMIT', visible: true, editable: true, width: 100 }
]

function PopSiteWarehouse(props) {
  const [grid, setGrid] = useState(null);
  const [username] = useUserStore(state => [state.username]);

  const [locationPopupOpen, setLocationPopupOpen] = useState(false);
  const [warehousePopupOpen, setWarehousePopupOpen] = useState(false);
  const [locationManagementId, setLocationManagementId] = useState('');
  const [warehouseId, setWarehouseId] = useState('');
  const [tabValue, setTabValue] = useState('common');

  const { control, getValues, setValue } = useForm({
    defaultValues: {
      locationType: '',
      locationLevel: '',
      locationCode: '',
      locationName: '',
      warehouseType: '',
      warehouseName: '',
      loadCapacityManagementBase: '',
      loadCapacityLimit: '',
      active: []
    }
  });

  function afterGridCreate(gridObj, gridView, dataProvider) {
    setGrid(gridObj)
    setGridOptions(gridObj);
  }

  function setGridOptions(grid) {
    grid.gridView.setEditOptions({
      insertable: true,
      appendable: true
    })

    grid.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(grid, true, true, true);

    const columnStyleCallback = function (currentGrid, cell) {
      let ret = {};

      if (cell.item.rowState == 'created' || cell.item.itemState == 'appending' || cell.item.itemState == 'inserting') {
        ret.editable = true;
        ret.styleName = 'editable-text-column text-center';
      } else {
        ret.editable = false;
        ret.styleName = 'text-column text-center';
      }

      return ret;
    };

    let warehouseNameColumn = grid.gridView.columnByName('WAREHOUSE_TP_NM');
    warehouseNameColumn.styleCallback = columnStyleCallback;

    let loadCapacityManagementBaseColumn = grid.gridView.columnByName('LOAD_CAPA_MGMT_BASE');
    loadCapacityManagementBaseColumn.styleCallback = columnStyleCallback;
  }

  const tabChange = (event, newValue) => {
    grid.gridView.commit(true);
    setTabValue(newValue);
    if (newValue === 'palletLayerLocationLimit') {
      loadData();
    }
  };

  function openLocationPopup() {
    setLocationPopupOpen(true);
  }

  function closeLocationPopup() {
    setLocationPopupOpen(false);
  }

  function onSetLocation(gridRow) {
    setLocationManagementId(gridRow.LOCAT_MGMT_ID);
    setValue('locationType', gridRow.LOCAT_TP_NM);
    setValue('locationLevel', gridRow.LOCAT_LV);
    setValue('locationCode', gridRow.LOCAT_CD);
    setValue('locationName', gridRow.LOCAT_NM);
  }

  function openWarehousePopup() {
    setWarehousePopupOpen(true);
  }

  function closeWarehousePopup() {
    setWarehousePopupOpen(false);
  }

  function onSetWarehouse(gridRow) {
    setWarehouseId(gridRow.ID);
    setValue('warehouseType', gridRow.WAREHOUSE_TP);
    setValue('warehouseName', gridRow.WAREHOUSE_TP_NM);
    setValue('loadCapacityManagementBase', gridRow.LOAD_CAPA_MGMT_BASE);
  }

  function onBeforeAdd(grid) {
    if (getValues('warehouseType') === '') {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5019'), { close: false });
      return false;
    }

    if (getValues('loadCapacityManagementBase') !== 'Pallet Layer/Location Limit') {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5018'), { close: false });
      return false;
    }

    return true;
  }

  function onAfterAdd(grid) {
    let itemIndex = grid.gridView.getCurrent().dataRow;
    grid.dataProvider.setValue(itemIndex, 'WAREHOUSE_TP', getValues('warehouseType'));
    grid.dataProvider.setValue(itemIndex, 'WAREHOUSE_TP_NM', getValues('warehouseName'));
    grid.dataProvider.setValue(itemIndex, 'LOAD_CAPA_MGMT_BASE', getValues('loadCapacityManagementBase'));
    grid.gridView.setCurrent({ itemIndex: itemIndex });
    grid.gridView.commit(true);
  }

  function loadData() {
    let params = new URLSearchParams();

    params.append('ID', warehouseId);
    params.append('LOCAT_MGMT_ID', locationManagementId);

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_CM_13_POP_03_Q',
      data: params,
      fromPopup: true
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        grid.dataProvider.clearRows();
        grid.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
  }

  function saveData() {
    grid.gridView.commit(true);

    showMessage(transLangKey('SAVE'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let formData = new FormData();
        
        formData.append('WRK_TYPE', 'SAVE');
        formData.append('WH_MGMT_ID', '');
        formData.append('LOCAT_MGMT_ID', locationManagementId);
        formData.append('WAREHOUSE_TP_ID', warehouseId);
        formData.append('CAPA_LIMIT_VAL', getValues('loadCapacityLimit'));
        formData.append('ACTV_YN', getValues('active'));
        formData.append('USER_ID', username);

        zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_13_POP_02_S1", formData)
        .then(function (res) {
          if (!res.data.RESULT_SUCCESS) {
            showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
          } else if (getValues('loadCapacityManagementBase') === 'Pallet Layer/Location Limit') {
            let changedRow = [];
            let changes = [];

            changedRow = changedRow.concat(
              grid.dataProvider.getAllStateRows().created,
              grid.dataProvider.getAllStateRows().updated,
              grid.dataProvider.getAllStateRows().deleted,
              grid.dataProvider.getAllStateRows().createAndDeleted
            );

            changedRow.forEach(function (row) {
              let data = grid.dataProvider.getJsonRow(row);
              changes.push(data);
            });

            formData.append('changes', JSON.stringify(changes));
            
            zAxios.post(baseURI() + 'engine/mp/SRV_UI_CM_13_POP_02_S2', formData)
            .then(function (res) {
              if (res.data.RESULT_SUCCESS) {
                showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_CM_13_POP_02_S1_P_RT_MSG), { close: false });
              } else {
                showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
              }
            });
          } else {
            showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_CM_13_POP_02_S1_P_RT_MSG), { close: false });
          }
        })
        .then(function () {
          loadData();
          props.confirm();
          props.onClose();
        })
        .catch(function (err) {
          console.error(err);
        });
      }
    });
  }

  function close() {
    grid.gridView.commit(true);
    props.onClose();
    grid.dataProvider.clearRows();
  }

  return (
    <>
      <PopupDialog open={props.open} onClose={close} onSubmit={saveData} title="POP_UI_CM_06_01" resizeHeight={600} resizeWidth={900}>
        <Tabs onChange={tabChange} indicatorColor="primary" value={tabValue}>
          <Tab label={transLangKey("COMM")} value="common" />
          <Tab label={transLangKey("PALLET_LAYER_LOC_LIMIT")} value="palletLayerLocationLimit" />
        </Tabs>
          <Box sx={{ height: "100%", display : tabValue === "common" ? "block" : "none" }}>
            <Box>
              <InputField type="action" name="locationType" label={transLangKey("LOCAT_TP_NM")} onClick={openLocationPopup} control={control} readonly={true}>
                <Icon.Search />
              </InputField>
              <InputField name="locationLevel" label={transLangKey("LOCAT_LV")} control={control} disabled={true} />
              <InputField name="locationCode" label={transLangKey("LOCAT_CD")} control={control} disabled={true} />
              <InputField name="locationName" label={transLangKey("LOCAT_NM")} control={control} disabled={true} />
            </Box>
            <Box>
              <InputField type="action" name="warehouseType" label={transLangKey("WAREHOUSE_TP")} onClick={openWarehousePopup} control={control} readonly={true}>
                <Icon.Search />
              </InputField>
              <InputField name="warehouseName" label={transLangKey("WAREHOUSE_NM")} control={control} disabled={true} />
              <InputField name="loadCapacityManagementBase" label={transLangKey("LOAD_CAPA_MGMT_BASE")} control={control} disabled={true} />
              <InputField name="loadCapacityLimit" label={transLangKey("CAPA_LIMIT_VAL")} control={control} disabled={getValues('loadCapacityManagementBase') === 'Pallet Layer/Location Limit' ? true : false} />
            </Box>
            <Box>
              <InputField type="check" name="active" control={control} options={[{ label: transLangKey("ACTV_YN"), value: "Y" }]} />
            </Box>
        </Box>
        <Box sx={{ height: "100%", display : tabValue === "palletLayerLocationLimit" ? "block" : "none" }}>
          <Box sx={{ height: "calc(100% - 50px)" }}>
            <ButtonArea>
              <RightButtonArea>
                <GridAddRowButton type="icon" grid="SiteWarehouse_PopSiteWarehouseGrid" onBeforeAdd={onBeforeAdd} onAfterAdd={onAfterAdd} />
                <GridDeleteRowButton type="icon" grid="SiteWarehouse_PopSiteWarehouseGrid" />
              </RightButtonArea>
            </ButtonArea>
            <ResultArea>
              <BaseGrid id="SiteWarehouse_PopSiteWarehouseGrid" items={gridItems} afterGridCreate={afterGridCreate} />
            </ResultArea>
          </Box>
        </Box>
      </PopupDialog>

      {locationPopupOpen && (<PopLocatTp open={locationPopupOpen} onClose={closeLocationPopup} confirm={onSetLocation} />)}
      {warehousePopupOpen && (<PopWhType open={warehousePopupOpen} onClose={closeWarehousePopup} confirm={onSetWarehouse} />)}
    </>
  );
}

export default PopSiteWarehouse;
