import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Tab, Tabs } from '@mui/material';
import { BaseGrid, InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

let gridItems = [
  { name: 'RES_PREF_MST_ID', dataType: 'text', headerText: 'RES_PREF_MST_ID', visible: false, width: 50 },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: true, width: 50 },
  { name: 'RES_CD', dataType: 'text', headerText: 'RES_CD', visible: true, editable: false, width: 100 },
  { name: 'RES_DESCRIP', dataType: 'text', headerText: 'RES_DESCRIP', visible: true, editable: false, width: 150 },
  { name: 'BASE_ALLOC_PRIORT', dataType: 'number', headerText: 'BASE_ALLOC_PRIOR', visible: true, editable: true, width: 150 },
  { name: 'BASE_ALLOC_PROPTN', dataType: 'number', headerText: 'BASE_ALLOC_PROPTN', visible: true, editable: true, width: 150 }
]

function PopPeriodItemResPreferenceNew(props) {
  const [username] = useUserStore(state => [state.username]);
  const [grid, setGrid] = useState(null);

  const [baseAllocationRuleOptions, setBaseAllocationRuleOptions] = useState([]);
  const [tabValue, setTabValue] = useState('common');

  const { control, getValues } = useForm({
    defaultValues: {
      locationType: props.data.LOCAT_TP_NM,
      locationLevel: props.data.LOCAT_LV,
      locationCode: props.data.LOCAT_CD,
      locationName: props.data.LOCAT_NM,
      resourceCode: props.data.RES_CD,
      resourceDescription: props.data.RES_DESCRIP,
      itemCode: props.data.ITEM_CD,
      itemName: props.data.ITEM_NM,
      itemType: props.data.ITEM_TP,
      baseAllocationRule: props.data.BASE_ALLOC_RULE_ID,
      startTime: new Date().format('yyyy-MM-dd'),
      endTime: new Date().format('yyyy-MM-dd')
    }
  });

  useEffect(() => {
    if (grid) {
      setGridOptions();
      setSelectOptions();
      loadData();
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

  function setSelectOptions() {
    let formData = new FormData();
    let array = [];

    formData.append('CODE', 'BASE_ALLOC_RULE');

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_CM_CODE',
      data: formData,
      fromPopup: true
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        res.data.RESULT_DATA.forEach(data => array.push({ value: data.ID, label: data.CD_NM }));
        setBaseAllocationRuleOptions(array);
      }
    });
  }

  function loadData() {
    let formData = new FormData();

    formData.append('LOC_ID', props.data.LOCAT_DTL_ID);
    formData.append('ITEM_ID', props.data.ITEM_MST_ID);
    formData.append('TYPE', 'U');

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

    showMessage(transLangKey('SAVE'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let formData = new FormData();
        let rows = grid.dataProvider.getJsonRows();

        formData.append('all', JSON.stringify(rows));
        formData.append('STRT_DATE', new Date(getValues('startTime')).format('yyyy-MM-ddT00:00:00'));
        formData.append('END_DATE', new Date(getValues('endTime')).format('yyyy-MM-ddT00:00:00'));
        formData.append('USER_ID', username);

        zAxios({
          method: 'post',
          url: baseURI() + 'engine/mp/SRV_UI_MP_08_S4',
          data: formData,
          fromPopup: true
        })
        .then(function (res) {
          if (res.data.RESULT_SUCCESS) {
            showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_MP_08_S4_P_RT_MSG), { close: false });
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

  function afterGridCreate(gridObj) {
    setGrid(gridObj);
  }

  const tabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  function onClose() {
    grid.dataProvider.clearRows();
    props.onClose();
  }

  return (
    <>
      <PopupDialog open={props.open} onClose={onClose} onSubmit={saveData} title='POP_UI_MP_08_04' resizeWidth={1150} resizeHeight={400}>
        <Tabs onChange={tabChange} indicatorColor="primary" value={tabValue}>
          <Tab label={transLangKey('COMM')} value='common' />
          <Tab label={transLangKey('RES')} value='resource' />
        </Tabs>
        <Box sx={{ height: "100%", display : tabValue === "common" ? "block" : "none" }}>
          <Box>
            <InputField name="locationType" label={transLangKey("LOCAT_TP_NM")} control={control} readonly={true} />
            <InputField name="locationLevel" label={transLangKey("LOCAT_LV")} control={control} readonly={true} />
            <InputField name="locationCode" label={transLangKey("LOCAT_CD")} control={control} readonly={true} />
            <InputField name="locationName" label={transLangKey("LOCAT_NM")} control={control} readonly={true} />
          </Box>
          <Box>
            <InputField name="resourceCode" label={transLangKey("RES_CD")} control={control} readonly={true} />
            <InputField name="resourceDescription" label={transLangKey("RES_DESCRIP")} control={control} readonly={true} />
            <InputField name="itemCode" label={transLangKey("ITEM_CD")} control={control} readonly={true} />
            <InputField name="itemName" label={transLangKey("ITEM_NM")} control={control} readonly={true} />
            <InputField name="itemType" label={transLangKey("ITEM_TP")} control={control} readonly={true} />
          </Box>
          <Box>
            <InputField type="select" name="baseAllocationRule" label={transLangKey("BASE_ALLOC_RULE")} control={control} options={baseAllocationRuleOptions} readonly={true} />
            <InputField type="datetime" name="startTime" label={transLangKey("STRT_DTTM")} control={control} dateformat="yyyy-MM-dd" />
            <InputField type="datetime" name="endTime" label={transLangKey("END_DTTM")} control={control} dateformat="yyyy-MM-dd" />
          </Box>
        </Box>
        <Box sx={{ height: "100%", display : tabValue === "resource" ? "block" : "none" }}>
          <Box style={{ height: "100%" }}>
            <BaseGrid id="PopPeriodItemResPreferenceNewGrid" items={gridItems} afterGridCreate={afterGridCreate} />
          </Box>
        </Box>
      </PopupDialog>
    </>
  )
}

export default PopPeriodItemResPreferenceNew;
