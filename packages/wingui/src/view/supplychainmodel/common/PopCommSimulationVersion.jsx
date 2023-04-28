import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IconButton } from '@mui/material';
import {
  SearchArea, InputField, PopupDialog, BaseGrid, useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';

let popupGrid1Items = [
  { name: 'CONBD_MAIN_VER_MST_ID', dataType: 'text', headerText: 'CONBD_MAIN_VER_MST_ID', visible: false, editable: false, width: '100' },
  { name: 'CONBD_MAIN_VER_DTL_ID', dataType: 'text', headerText: 'CONBD_MAIN_VER_DTL_ID', visible: false, editable: false, width: '100' },
  { name: 'PLAN_SNRIO_MGMT_DTL_ID', dataType: 'text', headerText: 'PLAN_SNRIO_MGMT_DTL_ID', visible: false, editable: false, width: '100' },
  { name: 'MODULE_ID', dataType: 'text', headerText: 'MODULE_ID', visible: false, editable: false, width: '100' },
  { name: 'MODULE_CD', dataType: 'text', headerText: 'MODULE_VAL', visible: true, editable: false, width: '70' },
  { name: 'MAIN_VER', dataType: 'text', headerText: 'MAIN_VER', visible: true, editable: false, width: '150' },
  { name: 'SIMUL_VER', dataType: 'text', headerText: 'SIMUL_VER_SHORTN', visible: true, editable: false, width: '180' },
  { name: 'SIMUL_VER_DESCRIP', dataType: 'text', headerText: 'DESCRIP', visible: true, editable: false, width: '220' },
  { name: 'PROCESS_TP', dataType: 'text', headerText: 'PROCESS_TP', visible: false, editable: false, width: '80' },
  { name: 'PROCESS_DESCRIP', dataType: 'text', headerText: 'PROCESS_DESCRIP', visible: true, editable: false, width: '220' },
  { name: 'CONFRM_YN', dataType: 'boolean', headerText: 'CONFRM_YN', visible: true, editable: false, width: '70' },
  { name: 'CREATE_DTTM', dataType: 'date', headerText: 'CREATE_DTTM', visible: true, editable: false, width: '80', foramt: "yyyy-MM-dd" }
]

function PopCommItemVersion(props) {
  const [grid, setGrid] = useState(null);
  const [itemsTpOptions, setItemsTpOptions] = useState([]);

  const module = props.module ?  props.module : "MP";

  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo])
  const { handleSubmit, control, getValues, setValue, clearErrors } = useForm({
    defaultValues: {
      moduleValue: module,
      mainVersion: '',
      simulationVersion: '',
      descrip: ''
    }
  });

  useEffect(() => {
    const grdObjPopup = getViewInfo(vom.active, `${props.id}_CommSimulationGrid`);
    if (grdObjPopup) {
      if (grdObjPopup.dataProvider) {
        if (grid != grdObjPopup) {
          setGrid(grdObjPopup);
        }
      }
    }
  }, [viewData]);

  useEffect(() => {
    async function initLoad() {
      if (grid) {
        setOptions();
        popupLoadData();
      }
    }

    initLoad();
  }, [grid]);

  const setOptions = () => {
    setVisibleProps(grid, false, false, true);
    grid.gridView.setDisplayOptions({
      fitStyle: 'evenFill'
    });

    grid.gridView.onDataLoadComplated = function () {
      grid.gridView.setFocus();
    }

    grid.gridView.onCellDblClicked = function (clickData, itemIndex) {
      props.confirm(grid.dataProvider.getJsonRow(itemIndex.dataRow));
      props.onClose(false);
    }
  }

  const onError = (errors, e) => {
    if (typeof errors !== 'undefined' && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  function popupLoadData() {
    grid.gridView.showToast(progressSpinner + 'Load Data...', true);

    let param = {
      MODULE_CD: getValues('moduleValue'),
      MAIN_VER_ID: getValues('mainVersion'),
      SIMUL_VER_ID: getValues('simulationVersion'),
      SIMUL_VER_DESCRIP: getValues('descrip')
    }

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: 'engine/T3SeriesSupplyNetServer/SRV_COMM_SRH_VER_Q',
      params: param
    })
    .then(function (res) {
      grid.dataProvider.fillJsonData(res.data.RESULT_DATA);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      grid.gridView.hideToast();
    });
  }

  const saveSubmit = () => {
    let focusCell = grid.gridView.getCurrent();
    let targetRow = focusCell.dataRow;
    props.confirm(grid.dataProvider.getJsonRow(targetRow));
    props.onClose(false);
  }

  function onSubmit(data) {
    popupLoadData(data);
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="SIMUL_VER" resizeHeight={535} resizeWidth={950}>
      <SearchArea expandButton={false}>
        <InputField name="moduleValue" label={transLangKey("MODULE_VAL")} control={control} editable={false}/>
        <InputField name="mainVersion" label={transLangKey("MAIN_VER")} control={control} />
        <InputField name="simulationVersion" label={transLangKey("SIMUL_VER_SHORTN")} control={control} />
        <InputField name="descrip" label={transLangKey("DESCRIP")} control={control} />
        <IconButton onClick={() => { onSubmit() }}><Icon.Search /></IconButton>
      </SearchArea>
      <BaseGrid id={`${props.id}_CommSimulationGrid`} items={popupGrid1Items} ></BaseGrid>
    </PopupDialog>
  );
}

export default PopCommItemVersion;
