import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { BaseGrid, InputField, PopupDialog, useUserStore, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';
import { getCodeList } from '@wingui/view/supplychainmodel/common/common';

let gridPopOrderCycleCalendarColumns = [
  { name: 'DD', dataType: 'text', headerText: 'DAY_OF_MONTH', visible: true, editable: false, width: '50' },
  { name: 'MONTHLY_ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: true, width: '80' }
]

function PopOrderCycleCalendar(props) {
  const [gridPopOrderCycleCalendar, setGridPopOrderCycleCalendar] = useState(null);
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const [username] = useUserStore((state) => [state.username]);

  const [orderCycleTypeOptions, setOrderCycleTypeOptions] = useState([]);
  const [orderCycleType, setOrderCycleType] = useState('');

  const { reset, getValues, setValue, watch, control } = useForm({
    defaultValues: {
      orderCycleType: '',
      monday: [''],
      tuesday: [''],
      wednesday: [''],
      thursday: [''],
      friday: [''],
      saturday: [''],
      sunday: ['']
    }
  });

  useEffect(() => {
    async function initLoad() {
      if (gridPopOrderCycleCalendar) {
        await setSelectOptions();
        loadDailyOrderCycleData();
        loadMonthlyOrderCycleData();
        setValue('orderCycleType', props.data.PO_CYCL_TP);
      }
    }

    initLoad();
  }, [gridPopOrderCycleCalendar]);

  useEffect(() => {
    if (orderCycleTypeOptions.length > 0) {

      setOrderCycleType(orderCycleTypeOptions.find(option => option.value === getValues('orderCycleType')).label);
    }
  }, [watch('orderCycleType')]);

  function afterGridPopOrderCycleCalendar(gridObj) {
    setGridPopOrderCycleCalendar(gridObj);
    setGridPopOrderCycleCalendarOptions(gridObj);
  }

  function setGridPopOrderCycleCalendarOptions(gridObj) {
    gridObj.gridView.filteringOptions.automating.lookupDisplay = true;
    gridObj.gridView.setEditOptions({
      insertable: true,
      appendable: true,
      scrollOnEditing: 'commit'
    });

    gridObj.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridObj, false, false, false);
    gridObj.gridView.setFooters({ visible: false });
  }

  async function setSelectOptions() {
    let dataArr = await getCodeList('ORDERING_SCHEDULE_TYPE');
    setOrderCycleTypeOptions(dataArr.map(data => ({ value: data.ID, label: data.CD_NM })));
  }

  function loadDailyOrderCycleData() {
    let params = new FormData();

    params.append('PO_CYCL_CALENDAR_ID', props.data.ID);

    zAxios({
      method: 'post',
      url: 'engine/mp/SRV_UI_IM_06_Q2',
      data: params,
      fromPopup: true
    })
    .then(function (res) {
      if (res.data.RESULT_DATA.length > 0) {
        let data = res.data.RESULT_DATA[0];
        setValue('monday', data.MON_YN ? ['Y'] : []);
        setValue('tuesday', data.TUE_YN ? ['Y'] : []);
        setValue('wednesday', data.WED_YN ? ['Y'] : []);
        setValue('thursday', data.THU_YN ? ['Y'] : []);
        setValue('friday', data.FRI_YN ? ['Y'] : []);
        setValue('saturday', data.SAT_YN ? ['Y'] : []);
        setValue('sunday', data.SUN_YN ? ['Y'] : []);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function loadMonthlyOrderCycleData() {
    let params = new FormData();

    params.append('PO_CYCL_CALENDAR_ID', props.data.ID);

    zAxios({
      method: 'post',
      url: 'engine/mp/SRV_UI_IM_06_Q3',
      data: params,
      fromPopup: true
    })
    .then(function (res) {
      gridPopOrderCycleCalendar.setData(res.data.RESULT_DATA);
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function saveData() {
    gridPopOrderCycleCalendar.gridView.commit(true);

    if (orderCycleType === 'Daily Base Schedule') {
      saveDailyOrderCycleData();
    } else if (orderCycleType === 'Monthly Base Schedule') {
      saveMonthlyOrderCycleData();
    }
  }

  function saveDailyOrderCycleData() {
    showMessage(transLangKey('SAVE'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let params = new FormData();

        params.append('WRK_TYPE', 'SAVE');
        params.append('TYPE', 'DAILY');
        params.append('ID', props.data.ID);
        params.append('LOCAT_MGMT_ID', props.data.LOCAT_MGMT_ID);
        params.append('CALENDAR_ID', props.data.CALENDAR_ID);
        params.append('DESCRIP', props.data.DESCRIP);
        params.append('INV_MGMT_SYSTEM_TP', props.data.INV_MGMT_SYSTEM_TP);
        params.append('OPERT_BASE_TP', props.data.OPERT_BASE_TP);
        params.append('PO_CYCL_TP_CD', 'DAILY');
        params.append('ACTV_YN', true);
        params.append('MON_YN', getValues('monday').includes('Y'));
        params.append('TUE_YN', getValues('tuesday').includes('Y'));
        params.append('WED_YN', getValues('wednesday').includes('Y'));
        params.append('THU_YN', getValues('thursday').includes('Y'));
        params.append('FRI_YN', getValues('friday').includes('Y'));
        params.append('SAT_YN', getValues('saturday').includes('Y'));
        params.append('SUN_YN', getValues('sunday').includes('Y'));
        params.append('DD', '');
        params.append('USER_ID', username);

        zAxios({
          method: 'post',
          url: 'engine/mp/SRV_UI_IM_06_S1',
          data: params,
          fromPopup: true
        })
        .then(function (res) {
          if (res.data.RESULT_SUCCESS) {
            showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_IM_06_S1_P_RT_MSG), { close: false });
          } else {
            showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
          }

          props.confirm();
          close();
        })
        .catch(function (err) {
          console.log(err);
        });
      }
    });
  }

  function saveMonthlyOrderCycleData() {
    let changedRow = [];

    changedRow = changedRow.concat(
      gridPopOrderCycleCalendar.dataProvider.getAllStateRows().created,
      gridPopOrderCycleCalendar.dataProvider.getAllStateRows().updated,
      gridPopOrderCycleCalendar.dataProvider.getAllStateRows().deleted,
      gridPopOrderCycleCalendar.dataProvider.getAllStateRows().createAndDeleted
    );

    showMessage(transLangKey('SAVE'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let params = new FormData();
        let changes = [];

        changedRow.forEach(function (row) {
          changes.push(gridPopOrderCycleCalendar.dataProvider.getJsonRow(row));
        });

        params.append('WRK_TYPE', 'SAVE');
        params.append('TYPE', changedRow.length === 0 ? 'PO_CALENDAR' : 'MONTHLY');
        params.append('ID', props.data.ID);
        params.append('LOCAT_MGMT_ID', props.data.LOCAT_MGMT_ID);
        params.append('CALENDAR_ID', props.data.CALENDAR_ID);
        params.append('DESCRIP', props.data.DESCRIP);
        params.append('INV_MGMT_SYSTEM_TP', props.data.INV_MGMT_SYSTEM_TP);
        params.append('OPERT_BASE_TP', props.data.OPERT_BASE_TP);
        params.append('PO_CYCL_TP_CD', 'MONTHLY');
        params.append('ACTV_YN', true);
        params.append('MON_YN', '');
        params.append('TUE_YN', '');
        params.append('WED_YN', '');
        params.append('THU_YN', '');
        params.append('FRI_YN', '');
        params.append('SAT_YN', '');
        params.append('SUN_YN', '');
        params.append('changes', JSON.stringify(changes));
        params.append('USER_ID', username);

        zAxios({
          method: 'post',
          url: 'engine/mp/SRV_UI_IM_06_S1',
          data: params,
          fromPopup: true
        })
        .then(function (res) {
          if (res.data.RESULT_SUCCESS) {
            showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_IM_06_S1_P_RT_MSG), { close: false });
          } else {
            showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
          }

          props.confirm();
          close();
        })
        .catch(function (err) {
          console.log(err);
        });
      }
    });
  }

  function close() {
    gridPopOrderCycleCalendar.gridView.commit(true);
    props.onClose();
    gridPopOrderCycleCalendar.dataProvider.clearRows();
  }

  return (
    <PopupDialog open={props.open} onClose={close} onSubmit={saveData} title="POP_UI_IM_06_04" resizeHeight={500} resizeWidth={500}>
      <Box>
        <InputField type="select" name="orderCycleType" label={transLangKey("PO_CYCL_TP")} control={control} options={orderCycleTypeOptions} />
      </Box>
      <Box style={{ height: "100%", display: orderCycleType === "Daily Base Schedule" ? "block" : "none" }}>
        <Box>
          <InputField type="check" name="monday" control={control} style={{ width: "50px", minWidth: "50px" }} inputStyle={{ width: "50px", minWidth: "50px" }} options={[{ label: transLangKey("MON"), value: "Y" }]} />
          <InputField type="check" name="tuesday" control={control} style={{ width: "50px", minWidth: "50px" }} inputStyle={{ width: "50px", minWidth: "50px" }} options={[{ label: transLangKey("TUE"), value: "Y" }]} />
          <InputField type="check" name="wednesday" control={control} style={{ width: "50px", minWidth: "50px" }} inputStyle={{ width: "50px", minWidth: "50px" }} options={[{ label: transLangKey("WED"), value: "Y" }]} />
          <InputField type="check" name="thursday" control={control} style={{ width: "50px", minWidth: "50px" }} inputStyle={{ width: "50px", minWidth: "50px" }} options={[{ label: transLangKey("THUR"), value: "Y" }]} />
          <InputField type="check" name="friday" control={control} style={{ width: "50px", minWidth: "50px" }} inputStyle={{ width: "50px", minWidth: "50px" }} options={[{ label: transLangKey("FRI"), value: "Y" }]} />
          <InputField type="check" name="saturday" control={control} style={{ width: "50px", minWidth: "50px" }} inputStyle={{ width: "50px", minWidth: "50px" }} options={[{ label: transLangKey("SAT"), value: "Y" }]} />
          <InputField type="check" name="sunday" control={control} style={{ width: "50px", minWidth: "50px" }} inputStyle={{ width: "50px", minWidth: "50px" }} options={[{ label: transLangKey("SUN"), value: "Y" }]} />
        </Box>
      </Box>
      <Box style={{ height: "100%", display: orderCycleType === "Monthly Base Schedule" ? "block" : "none" }}>
        <BaseGrid id="gridPopOrderCycleCalendar" items={gridPopOrderCycleCalendarColumns} afterGridCreate={afterGridPopOrderCycleCalendar} />
      </Box>
    </PopupDialog>
  );
}

export default PopOrderCycleCalendar;
