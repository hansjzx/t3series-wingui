import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Tab, Tabs } from '@mui/material';
import { BaseGrid, InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';
import { getCodeList } from "@wingui/view/supplychainmodel/common/common";

import PopLocation from './PopLocation';
import PopItemLocation from './PopItemLocation';

let gridItems = [
  { name: 'LOC_DTL_ID', dataType: 'text', headerText: 'LOC_DTL_ID', visible: false, width: 50 },
  { name: 'RES_DTL_ID', dataType: 'text', headerText: 'RES_DTL_ID', visible: false, width: 50 },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: true, width: 50 },
  { name: 'RES_CD', dataType: 'text', headerText: 'RES_CD', visible: true, editable: false, width: 100 },
  { name: 'RES_DESCRIP', dataType: 'text', headerText: 'RES_DESCRIP', visible: true, editable: false, width: 150 },
  { name: 'BASE_ALLOC_PRIORT', dataType: 'number', headerText: 'BASE_ALLOC_PRIOR', visible: true, editable: true, width: 150 },
  { name: 'BASE_ALLOC_PROPTN', dataType: 'number', headerText: 'BASE_ALLOC_PROPTN', visible: true, editable: true, width: 150 }
]

function PopItemResPreferenceNew(props) {
  const [username] = useUserStore(state => [state.username]);
  const [grid, setGrid] = useState(null);

  const [baseAllocationRuleOptions, setBaseAllocationRuleOptions] = useState([]);
  const [tabValue, setTabValue] = useState('common');
  const [locationPopupOpen, setLocationPopupOpen] = useState(false);
  const [itemPopupOpen, setItemPopupOpen] = useState(false);

  const { control, getValues, setValue } = useForm({
    defaultValues: {
      locationId: '',
      locationType: '',
      locationLevel: '',
      locationCode: '',
      locationName: '',
      resourceType: '',
      itemMasterId: '',
      itemCode: '',
      itemName: '',
      itemType: '',
      baseAllocationRule: '',
      confirm: []
    }
  });

  useEffect(() => {
    if (grid) {
      setGridOptions();
      setSelectOptions();
    }
  }, [grid]);

  function setGridOptions() {
    grid.gridView.setEditOptions({
      insertable: true,
      appendable: true
    });

    grid.gridView.setDisplayOptions({ fitStyle: 'fill' });

    setVisibleProps(grid, true, true, false);
  }

  async function setSelectOptions() {
    let dataArr = await getCodeList('BASE_ALLOC_RULE');
    let filteringArr = dataArr.filter(code => code.GROUP == 'BASE_ALLOC_RULE').map(data => ({ value: data.ID, label: data.CD_NM }));
    
    setBaseAllocationRuleOptions(filteringArr);
  }

  function loadData() {
    let formData = new FormData();

    formData.append('LOC_ID', getValues('locationId'));
    formData.append('ITEM_ID', getValues('itemMasterId'));
    formData.append('TYPE', 'N');

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_08_POP_Q2',
      data: formData,
      fromPopup: true
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        grid.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function saveData() {
    grid.gridView.commit(true);

    let changedRow = [];

    changedRow = changedRow.concat(
      grid.dataProvider.getAllStateRows().created,
      grid.dataProvider.getAllStateRows().updated,
      grid.dataProvider.getAllStateRows().deleted,
      grid.dataProvider.getAllStateRows().createAndDeleted
    );

    if (!changedRow.length) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
    } else {
      showMessage(transLangKey('SAVE'), transLangKey('MSG_SAVE'), function (answer) {
        if (answer) {
          let formData = new FormData();
          let changes = [];

          changedRow.forEach(function (row) {
            changes.push(grid.dataProvider.getJsonRow(row));
          });

          formData.append('ITEM_MST_ID', getValues('itemMasterId'));
          if (getValues('baseAllocationRule') !== '') {
            formData.append('BASE_ALLOC_RULE_ID', getValues('baseAllocationRule'));
          }
          formData.append('FIXED_YN', getValues('confirm').includes('Y'));
          formData.append('changes', JSON.stringify(changes));
          formData.append('USER_ID', username);

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_UI_MP_08_POP_S1',
            data: formData,
            fromPopup: true
          })
          .then(function (res) {
            if (res.data.RESULT_SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_MP_08_POP_S1_P_RT_MSG), { close: false });
              props.confirm();
              onClose();
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

  function afterGridCreate(gridObj) {
    setGrid(gridObj);
  }

  const tabChange = (event, newValue) => {
    setTabValue(newValue);

    if (newValue === 'resource') {
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
    setValue('locationId', gridRow.LOCAT_DTL_ID);
    setValue('locationType', gridRow.LOCAT_TP_NM);
    setValue('locationLevel', gridRow.LOCAT_LV);
    setValue('locationCode', gridRow.LOCAT_CD);
    setValue('locationName', gridRow.LOCAT_NM);
    setValue('resourceType', gridRow.PLAN_RES_TP);
  }

  function openItemPopup() {
    setItemPopupOpen(true);
  }

  function closeItemPopup() {
    setItemPopupOpen(false);
  }

  function onSetItem(gridRow) {
    setValue('itemMasterId', gridRow.ITEM_MST_ID);
    setValue('itemCode', gridRow.ITEM_CD);
    setValue('itemName', gridRow.ITEM_NM);
    setValue('itemType', gridRow.ITEM_TP);
  }

  function onClose() {
    grid.dataProvider.clearRows();
    props.onClose();
  }

  return (
    <>
      <PopupDialog open={props.open} onClose={onClose} onSubmit={saveData} title='POP_UI_MP_08_01' resizeWidth={1150} resizeHeight={400} >
        <Tabs onChange={tabChange} indicatorColor="primary" value={tabValue}>
          <Tab label={transLangKey('COMM')} value='common' />
          <Tab label={transLangKey('RES')} value='resource' />
        </Tabs>
        <Box sx={{ height: "100%", display : tabValue === "common" ? "block" : "none" }}>
          <Box>
            <InputField type="action" name="locationType" label={transLangKey("LOCAT_TP_NM")} control={control} onClick={openLocationPopup}>
              <Icon.Search />
            </InputField>
            <InputField name="locationLevel" label={transLangKey("LOCAT_LV")} control={control} />
            <InputField name="locationCode" label={transLangKey("LOCAT_CD")} control={control} />
            <InputField name="locationName" label={transLangKey("LOCAT_NM")} control={control} />
            <InputField name="resourceType" label={transLangKey("PLAN_RES_TP")} control={control} />
          </Box>
          <Box>
            <InputField type="action" name="itemCode" label={transLangKey("ITEM_CD")} control={control} onClick={openItemPopup}>
              <Icon.Search />
            </InputField>
            <InputField name="itemName" label={transLangKey("ITEM_NM")} control={control} />
            <InputField name="itemType" label={transLangKey("ITEM_TP")} control={control} />
            <InputField type="select" name="baseAllocationRule" label={transLangKey("BASE_ALLOC_RULE")} control={control} options={baseAllocationRuleOptions} />
            <InputField type="check" name="confirm" control={control} options={[{ label: transLangKey("FIXED_YN"), value: "Y" }]} />
          </Box>
        </Box>
        <Box sx={{ height: "100%", display : tabValue === "resource" ? "block" : "none" }}>
          <Box style={{ height: "100%" }}>
            <BaseGrid id="PopItemResPreferenceNewGrid" items={gridItems} afterGridCreate={afterGridCreate} />
          </Box>
        </Box>
      </PopupDialog>

      <PopLocation open={locationPopupOpen} onClose={closeLocationPopup} confirm={onSetLocation} />
      <PopItemLocation open={itemPopupOpen} onClose={closeItemPopup} confirm={onSetItem} data={getValues('locationId')} />
    </>
  )
}

export default PopItemResPreferenceNew;
