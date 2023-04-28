import React, { useState, useEffect } from 'react';
import { Box, Tab, Tabs } from '@mui/material';
import { useForm } from 'react-hook-form';
import { BaseGrid, InputField, PopupDialog, useViewStore, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';
import { setGridComboList } from "@wingui/view/supplychainmodel/common/common";

let supplyLocationGridItems = [
  { name: 'BOD_MAP_ID', dataType: 'text', headerText: 'BOD_MAP_ID', visible: false, editable: false, width: 100, lookupDisplay: true },
  { name: 'SRCING_POLICY_ID', dataType: 'text', headerText: 'SRCING_POLICY', visible: true, editable: false, width: 100, lookupDisplay: true },
  { name: 'SRCING_RULE', dataType: 'number', headerText: 'SRCING_RULE', visible: true, editable: true, width: 100 },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: false, width: 50 },
  { name: 'SUPPLY_LOCAT_ID', dataType: 'text', headerText: 'LOCAT_ID', visible: false, editable: false, width: 100 },
  { name: 'SUPPLY_LOC_TP', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: 100 },
  { name: 'SUPPLY_LOC_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: 100 },
  { name: 'SUPPLY_LOC_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: 100 },
  { name: 'SUPPLY_LOC_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: 100 }
];

function PopPeriodSourcingPolicy(props) {
  const [supplyLocationGrid, setSupplyLocationGrid] = useState(null);
  const [username] = useUserStore(state => [state.username]);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const [locationManagementId, setLocationManagementId] = useState('');
  const [tabValue, setTabValue] = useState('consumeLocationTab');

  const { reset, control, getValues, setValue } = useForm({
    defaultValues: {
      bodType: '',
      consumeLocationType: '',
      consumeLocationLevel: '',
      consumeLocationCode: '',
      consumeLocationName: '',
      startDate: '',
      endDate: ''
    }
  });

  useEffect(() => {
    async function initLoad() {
      setValue('consumeLocationType', props.data.LOCAT_TP);
      setValue('consumeLocationLevel', props.data.LOCAT_LV);
      setValue('consumeLocationCode', props.data.LOCAT_CD);
      setValue('consumeLocationName', props.data.LOCAT_NM);
      setLocationManagementId(props.data.CONSUME_LOCAT_ID);
    }

    initLoad();
  }, []);

  useEffect(() => {
    const gridObj = getViewInfo(vom.active, 'SiteBod_PopPeriodSourcingPolicyGrid');

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
      loadSupplyLocation();
    }
  }, [supplyLocationGrid]);

  function setSupplyLocationGridOptions() {
    supplyLocationGrid.gridView.setEditOptions({
      insertable: true,
      appendable: true
    })

    supplyLocationGrid.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(supplyLocationGrid, true, true, false);
  }

  const tabChange = (event, newValue) => {
    supplyLocationGrid.gridView.commit(true);
    setTabValue(newValue);
  };

  function loadSupplyLocation() {
    let params = new URLSearchParams();

    params.append('CONSUME_LOCAT_ID', locationManagementId);

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_CM_06_POP_02_Q',
      data: params
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        supplyLocationGrid.dataProvider.fillJsonData(res.data.RESULT_DATA);
      }
    });
  }

  function saveSubmit() {
    supplyLocationGrid.gridView.commit(true);

    let changes = supplyLocationGrid.dataProvider.getJsonRows();

    showMessage(transLangKey('SAVE'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let formData = new FormData();
        formData.append('WRK_TYPE', 'SAVE');
        if (getValues('startDate') !== '') {
          formData.append('STRT_DTTM', new Date(getValues('startDate')).format('yyyy-MM-ddT00:00:00'));
        }
        if (getValues('endDate') !== '') {
          formData.append('END_DTTM', new Date(getValues('endDate')).format('yyyy-MM-ddT00:00:00'));
        }
        formData.append('changes', JSON.stringify(changes));
        formData.append('USER_ID', username);

        zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_06_S2", formData)
        .then(function (res) {
          if (res.data.RESULT_SUCCESS) {
            showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_CM_06_S2_P_RT_MSG), { close: false });
          } else {
            showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
          }

          reset();
          supplyLocationGrid.dataProvider.clearRows();

          props.confirm();
          props.onClose();
        })
        .catch(function (err) {
          console.log(err);
        });
      }
    });
  }

  function close() {
    supplyLocationGrid.gridView.commit(true);
    props.onClose();
    supplyLocationGrid.dataProvider.clearRows();
  }

  return (
    <PopupDialog open={props.open} onClose={close} onSubmit={saveSubmit} title="POP_UI_CM_06_06" resizeHeight={600} resizeWidth={900}>
      <Tabs onChange={tabChange} indicatorColor="primary" value={tabValue}>
        <Tab label={transLangKey("CONSUME_LOCAT")} value="consumeLocationTab" />
        <Tab label={transLangKey("SUPPLY_LOCAT")} value="supplyLocationTab" />
      </Tabs>
        <Box sx={{ height: "100%", display : tabValue === "consumeLocationTab" ? "block" : "none" }}>
          <Box>
            <InputField name="consumeLocationType" label={transLangKey("LOCAT_TP_NM")} control={control} disabled={true} />
            <InputField name="consumeLocationLevel" label={transLangKey("LOCAT_LV")} control={control} disabled={true} />
            <InputField name="consumeLocationCode" label={transLangKey("LOCAT_CD")} control={control} disabled={true} />
            <InputField name="consumeLocationName" label={transLangKey("LOCAT_NM")} control={control} disabled={true} />
          </Box>
          <Box>
            <InputField type="datetime" name="startDate" label={transLangKey("STRT_DATE")} control={control} dateformat="yyyy-MM-dd" />
            <InputField type="datetime" name="endDate" label={transLangKey("END_DATE")} control={control} dateformat="yyyy-MM-dd" />
          </Box>
      </Box>
      <Box sx={{ height: "100%", display : tabValue === "supplyLocationTab" ? "block" : "none" }}>
        <BaseGrid id="SiteBod_PopPeriodSourcingPolicyGrid" items={supplyLocationGridItems} />
      </Box>
      </PopupDialog>
  );
}

export default PopPeriodSourcingPolicy;
