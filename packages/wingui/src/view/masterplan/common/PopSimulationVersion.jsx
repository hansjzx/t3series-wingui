import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, IconButton } from '@mui/material';
import { BaseGrid, InputField, PopupDialog, SearchArea, zAxios } from '@zionex/wingui-core/src/common/imports';

let gridSimulationVersionColumns = [
  { name: "CONBD_MAIN_VER_MST_ID", headerText: "CONBD_MAIN_VER_MST_ID", dataType: "text", visible: false },
  { name: "CONBD_MAIN_VER_DTL_ID", headerText: "CONBD_MAIN_VER_DTL_ID", dataType: "text", visible: false },
  { name: "PLAN_SNRIO_MGMT_DTL_ID", headerText: "PLAN_SNRIO_MGMT_DTL_ID", dataType: "text", visible: false },
  { name: "MODULE_ID", headerText: "MODULE_ID", dataType: "text", visible: false },
  { name: "MODULE_CD", headerText: "MODULE_VAL", dataType: "text", width: "50", editable: false, filterable: true, initGroupOrder: "1" },
  { name: "MAIN_VER", headerText: "MAIN_VER", dataType: "text", width: "100", editable: false, initGroupOrder: "2" },
  { name: "SIMUL_VER", headerText: "SIMUL_VER_SHORTN", dataType: "text", width: "140", editable: false },
  { name: "SIMUL_VER_DESCRIP", headerText: "DESCRIP", dataType: "text", width: "180", editable: false },
  { name: "PROCESS_TP", headerText: "PROCESS_TP", dataType: "text", width: "150", visible: false, editable: false },
  { name: "PROCESS_DESCRIP", headerText: "PRSS_DESCRIP", dataType: "text", width: "160", editable: false },
  { name: "CONFRM_YN", headerText: "CONFRM_YN", dataType: "boolean", width: "70", editable: false },
  { name: "CREATE_DTTM", headerText: "CREATE_DTTM", dataType: "datetime", width: "80", editable: false, format: "yyyy-MM-dd" }
]

function PopSimulationVersion(props) {
  const [gridSimulationVersion, setGridSimulationVersion] = useState(null);

  const { control, getValues } = useForm({
    defaultValues: {
      moduleCode: props.module,
      mainVersion: props.mainVersion ? props.mainVersion : '',
      simulationVersion: '',
      description: ''
    }
  });

  useEffect(() => {
    async function initLoad() {
      if (gridSimulationVersion) {
        setGridSimulationVersionOptions();
        await loadSimulationVersion();
      }
    }

    initLoad();
  }, [gridSimulationVersion]);

  function afterGridSimulationVersion(gridObj) {
    setGridSimulationVersion(gridObj);
  }

  function setGridSimulationVersionOptions() {
    gridSimulationVersion.gridView.setEditOptions({
      insertable: true,
      appendable: true
    });

    gridSimulationVersion.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridSimulationVersion, true, false, false);

    gridSimulationVersion.gridView.setColumnProperty('MODULE_CD', 'mergeRule', { criteria: 'value' });
    gridSimulationVersion.gridView.setColumnProperty('MAIN_VER', 'mergeRule', { criteria: 'value' });

    gridSimulationVersion.gridView.onCellDblClicked = function (gridObj, clickData) {
      if (clickData.cellType === 'data') {
        props.confirm(gridObj.getValues(clickData.itemIndex));
        props.onClose();
      }
    }
  }

  function loadSimulationVersion() {
    let param = new URLSearchParams();

    param.append('MODULE_CD', getValues('moduleCode'));
    param.append('MAIN_VER_ID', getValues('mainVersion'));
    param.append('SIMUL_VER_ID', getValues('simulationVersion'));
    param.append('SIMUL_VER_DESCRIP', getValues('description'));

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_COMM_SRH_VER_Q',
      data: param,
      fromPopup: true
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridSimulationVersion.dataProvider.clearRows();
        gridSimulationVersion.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  return (
    <PopupDialog type="NOBUTTONS" open={props.open} onClose={props.onClose} title="SIMUL_VER" resizeHeight={600} resizeWidth={950}>
      <SearchArea expandButton={false}>
        <InputField name="mainVersion" label={transLangKey("MAIN_VER")} control={control} disabled={props.mainVersion} />
        <InputField name="simulationVersion" label={transLangKey("SIMUL_VER_SHORTN")} control={control} />
        <InputField name="description" label={transLangKey("DESCRIP")} control={control} />
        <IconButton onClick={loadSimulationVersion}><Icon.Search /></IconButton>
      </SearchArea>
      <Box style={{ height: "100%" }}>
        <BaseGrid id="gridPopSimulationVersion" items={gridSimulationVersionColumns} afterGridCreate={afterGridSimulationVersion} />
      </Box>
    </PopupDialog>
  )
}

export default PopSimulationVersion;
