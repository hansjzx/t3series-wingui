import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { makeStyles } from '@mui/styles';
import { BaseGrid, InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';
import { getCodeList } from '@wingui/view/supplychainmodel/common/common';

const usePopShipmentScheduleStyles = makeStyles({
  fieldset: {
    'MuiFormControl-root': {
      width: "50px"
    }
  }
});

let gridPopShipmentScheduleColumns = [
  { name: 'DD', dataType: 'text', headerText: 'DAY_OF_MONTH', visible: true, editable: false, width: '50' },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: true, width: '80' }
]

function PopShipmentSchedule(props) {
  const classes = usePopShipmentScheduleStyles();
  const [gridPopShipmentSchedule, setGridPopShipmentSchedule] = useState(null);
  const [username] = useUserStore((state) => [state.username]);

  const [shipmentScheduleTypeOptions, setShipmentScheduleTypeOptions] = useState([]);
  const [shipmentScheduleType, setShipmentScheduleType] = useState('');

  const { getValues, setValue, watch, control } = useForm({
    defaultValues: {
      shipmentScheduleType: '',
      monday: [''],
      tuesday: [''],
      wednesday: [''],
      thursday: [''],
      friday: [''],
      saturday: [''],
      sunday: [''],
      active: ['']
    }
  });

  useEffect(() => {
    async function initLoad() {
      if (gridPopShipmentSchedule) {
        await setSelectOptions();
        loadDailyShipmentScheduleData();
        loadMonthlyShipmentScheduleData();
        setValue('shipmentScheduleType', props.data.SHPP_SCHDL_TP_ID);
      }
    }

    initLoad();
  }, [gridPopShipmentSchedule]);

  useEffect(() => {
    if (shipmentScheduleTypeOptions.length > 0) {
      setShipmentScheduleType(shipmentScheduleTypeOptions.find(option => option.value === getValues('shipmentScheduleType')).label);
    }
  }, [watch('shipmentScheduleType')]);

  function afterGridPopShipmentSchedule(gridObj) {
    setGridPopShipmentSchedule(gridObj);
    setGridPopShipmentScheduleOptions(gridObj);
  }

  function setGridPopShipmentScheduleOptions(gridObj) {
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
    let dataArr = await getCodeList('SHIPPING_SCHEDULE_TYPE');
    setShipmentScheduleTypeOptions(dataArr.map(data => ({ value: data.ID, label: data.CD_NM })));
  }

  function loadDailyShipmentScheduleData() {
    let formData = new FormData();

    formData.append('CONF_KEY', 'DAILY');
    formData.append('SHPP_LEADTIME_DTL_ID', props.data.SHPP_LEADTIME_DTL_ID);

    zAxios({
      method: 'post',
      url: 'engine/mp/SRV_UI_CM_08_POP_01_Q',
      data: formData,
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
        setValue('active', data.ACTV_YN ? ['Y'] : []);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function loadMonthlyShipmentScheduleData() {
    let formData = new FormData();

    formData.append('CONF_KEY', 'MONTHLY');
    formData.append('SHPP_LEADTIME_DTL_ID', props.data.SHPP_LEADTIME_DTL_ID);

    zAxios({
      method: 'post',
      url: 'engine/mp/SRV_UI_CM_08_POP_01_Q',
      data: formData,
      fromPopup: true
    })
    .then(function (res) {
      gridPopShipmentSchedule.setData(res.data.RESULT_DATA);
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function saveData() {
    gridPopShipmentSchedule.gridView.commit(true);

    if (shipmentScheduleType === 'Daily Base Schedule') {
      saveDailyShipmentScheduleData();
    } else if (shipmentScheduleType === 'Monthly Base Schedule') {
      saveMonthlyShipmentScheduleData();
    }
  }

  function saveDailyShipmentScheduleData() {
    showMessage(transLangKey('SAVE'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let formData = new FormData();

        formData.append('SHPP_LEADTIME_DTL_ID', props.data.SHPP_LEADTIME_DTL_ID);
        formData.append('SHPP_SCHDL_TP_CD', 'DAILY');
        formData.append('MON_YN', getValues('monday').includes('Y'));
        formData.append('TUE_YN', getValues('tuesday').includes('Y'));
        formData.append('WED_YN', getValues('wednesday').includes('Y'));
        formData.append('THU_YN', getValues('thursday').includes('Y'));
        formData.append('FRI_YN', getValues('friday').includes('Y'));
        formData.append('SAT_YN', getValues('saturday').includes('Y'));
        formData.append('SUN_YN', getValues('sunday').includes('Y'));
        formData.append('DD', '');
        formData.append('ACTV_YN', getValues('active').includes('Y'));
        formData.append('USER_ID', username);

        zAxios({
          method: 'post',
          url: 'engine/mp/SRV_UI_CM_08_POP_01_S',
          data: formData
        })
        .then(function (res) {
          if (res.data.RESULT_SUCCESS) {
            showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_CM_08_POP_01_S_P_RT_MSG), { close: false });
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

  function saveMonthlyShipmentScheduleData() {
    let changedRow = [];

    changedRow = changedRow.concat(
      gridPopShipmentSchedule.dataProvider.getAllStateRows().created,
      gridPopShipmentSchedule.dataProvider.getAllStateRows().updated,
      gridPopShipmentSchedule.dataProvider.getAllStateRows().deleted,
      gridPopShipmentSchedule.dataProvider.getAllStateRows().createAndDeleted
    );

    showMessage(transLangKey('SAVE'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let formData = new FormData();
        let changes = [];

        changedRow.forEach(function (row) {
          changes.push(gridPopShipmentSchedule.dataProvider.getJsonRow(row));
        });

        formData.append('SHPP_LEADTIME_DTL_ID', props.data.SHPP_LEADTIME_DTL_ID);
        formData.append('SHPP_SCHDL_TP_CD', 'MONTHLY');
        formData.append('MON_YN', '');
        formData.append('TUE_YN', '');
        formData.append('WED_YN', '');
        formData.append('THU_YN', '');
        formData.append('FRI_YN', '');
        formData.append('SAT_YN', '');
        formData.append('SUN_YN', '');
        formData.append('changes', JSON.stringify(changes));
        formData.append('USER_ID', username);

        zAxios({
          method: 'post',
          url: 'engine/mp/SRV_UI_CM_08_POP_01_S',
          data: formData
        })
        .then(function (res) {
          if (res.data.RESULT_SUCCESS) {
            showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_CM_08_POP_01_S_P_RT_MSG), { close: false });
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
    gridPopShipmentSchedule.gridView.commit(true);
    props.onClose();
    gridPopShipmentSchedule.dataProvider.clearRows();
  }

  return (
    <PopupDialog open={props.open} onClose={close} onSubmit={saveData} title="POP_UI_CM_08_01" resizeHeight={500} resizeWidth={500}>
      <Box>
        <InputField type="select" name="shipmentScheduleType" label={transLangKey("SHIPPING_SCHDL_TP")} control={control} options={shipmentScheduleTypeOptions} />
      </Box>
      <Box style={{ height: "100%", width: "100%", display: shipmentScheduleType === "Daily Base Schedule" ? "block" : "none" }}>
        <Box>
          <InputField className={classes} type="check" name="monday" control={control} style={{ width: "50px", minWidth: "50px" }} options={[{ label: transLangKey("MON"), value: "Y" }]} />
          <InputField className={classes} type="check" name="tuesday" control={control} style={{ width: "50px", minWidth: "50px" }} options={[{ label: transLangKey("TUE"), value: "Y" }]} />
          <InputField className={classes} type="check" name="wednesday" control={control} style={{ width: "50px", minWidth: "50px" }} options={[{ label: transLangKey("WED"), value: "Y" }]} />
          <InputField className={classes} type="check" name="thursday" control={control} style={{ width: "50px", minWidth: "50px" }} options={[{ label: transLangKey("THUR"), value: "Y" }]} />
          <InputField className={classes} type="check" name="friday" control={control} style={{ width: "50px", minWidth: "50px" }} options={[{ label: transLangKey("FRI"), value: "Y" }]} />
          <InputField className={classes} type="check" name="saturday" control={control} style={{ width: "50px", minWidth: "50px" }} options={[{ label: transLangKey("SAT"), value: "Y" }]} />
          <InputField className={classes} type="check" name="sunday" control={control} style={{ width: "50px", minWidth: "50px" }} options={[{ label: transLangKey("SUN"), value: "Y" }]} />
        </Box>
        <Box>
          <InputField type="check" name="active" control={control} options={[{ label: transLangKey("ACTV_YN"), value: "Y" }]} />
        </Box>
      </Box>
      <Box style={{ height: "100%", display: shipmentScheduleType === "Monthly Base Schedule" ? "block" : "none" }}>
        <BaseGrid id="gridPopShipmentSchedule" items={gridPopShipmentScheduleColumns} afterGridCreate={afterGridPopShipmentSchedule} />
      </Box>
    </PopupDialog>
  );
}

export default PopShipmentSchedule;
