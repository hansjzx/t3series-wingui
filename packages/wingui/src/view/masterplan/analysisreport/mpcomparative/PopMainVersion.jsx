import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { IconButton } from '@mui/material';
import { BaseGrid, InputField, PopupDialog, SearchArea, zAxios } from '@zionex/wingui-core/src/common/imports';

let gridMainVersionColumns = [
  { name: "CONBD_MAIN_VER_MST_ID", headerText: "CONBD_MAIN_VER_MST_ID", dataType: "text", visible: false },
  { name: "MODULE_CD", headerText: "MODULE_VAL", dataType: "text", width: "50", editable: false, filterable: true, initGroupOrder: "1" },
  { name: "MAIN_VER_ID", headerText: "MAIN_VER", dataType: "text", width: "100", editable: false, initGroupOrder: "2" },
  { name: "MAIN_VER_DESCRIP", headerText: "DESCRIP", dataType: "text", width: "180", editable: false },
  { name: "CREATE_DTTM", headerText: "CREATE_DTTM", dataType: "datetime", width: "80", editable: false, format: "yyyy-MM-dd" }
]

function PopMainVersion(props) {
  const [gridMainVersion, setGridMainVersion] = useState(null);

  const { control, getValues } = useForm({
    defaultValues: {
      moduleCode: props.moduleCd,
      mainVersion: '',
      description: ''
    }
  });

  useEffect(() => {
    async function initLoad() {
      if (gridMainVersion) {
        setGridMainVersionOptions();
        await loadMainVersion();
      }
    }

    initLoad();
  }, [gridMainVersion]);

  function afterGridMainVersion(gridObj) {
    setGridMainVersion(gridObj);
  }

  function setGridMainVersionOptions() {
    gridMainVersion.gridView.setEditOptions({
      insertable: true,
      appendable: true
    });

    gridMainVersion.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridMainVersion, true, false, false);

    gridMainVersion.gridView.setColumnProperty('MODULE_CD', 'mergeRule', { criteria: 'value' });

    gridMainVersion.gridView.onCellDblClicked = function (gridObj, clickData) {
      if (clickData.cellType === 'data') {
        props.confirm(gridObj.getValues(clickData.itemIndex));
        props.onClose();
      }
    }
  }

  function loadMainVersion() {
    let param = new URLSearchParams();

    param.append('MODULE_CD', getValues('moduleCode'));
    param.append('MAIN_VER_ID', getValues('mainVersion'));
    param.append('MAIN_VER_DESCRIP', getValues('description'));

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_COMM_SRH_MAIN_VER_Q',
      data: param,
      fromPopup: true
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridMainVersion.dataProvider.clearRows();
        gridMainVersion.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} title="MAIN_VER" resizeHeight={600} resizeWidth={950}>
      <SearchArea expandButton={false}>
        <InputField name="moduleCode" label={transLangKey("MODULE_VAL")} control={control} disabled={true} />
        <InputField name="mainVersion" label={transLangKey("MAIN_VER")} control={control} />
        <InputField name="description" label={transLangKey("DESCRIP")} control={control} />
        <IconButton onClick={loadMainVersion}><Icon.Search /></IconButton>
      </SearchArea>
        <BaseGrid id="gridPopMainVersion" items={gridMainVersionColumns} afterGridCreate={afterGridMainVersion} />
    </PopupDialog>
  )
}

export default PopMainVersion;
