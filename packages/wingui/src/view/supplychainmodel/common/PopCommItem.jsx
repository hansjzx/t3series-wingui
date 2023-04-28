import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IconButton } from '@mui/material';
import { SearchArea, InputField, PopupDialog, BaseGrid, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';

let popupGrid1Items = [
  { name: 'ITEM_MST_ID', dataType: 'text', headerText: 'ITEM_MST_ID', visible:false, editable:false, width: '100' },
  { name: 'ITEM_TP_ID', dataType: 'text', headerText: 'ITEM_TP_ID', visible:false, editable:false, width: '100' },
  { name: 'ITEM_UOM_ID', dataType: 'text', headerText: 'ITEM_UOM_ID', visible:false, editable:false, width: '100' },
  { name: 'ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', visible:true, editable:false, width: '100' },
  { name: 'ITEM_NM', dataType: 'text', headerText: 'ITEM_NM', visible:true, editable:false, width: '150' },
  { name: 'ITEM_DESCRIP', dataType: 'text', headerText: 'ITEM_DESCRIP', visible:true, editable:false, width: '200' },
  { name: 'ITEM_TP_NM', dataType: 'text', headerText: 'ITEM_TP_NM', visible:true, editable:false, width: '80' },
  { name: 'ITEM_UOM_NM', dataType: 'text', headerText: 'ITEM_UOM_NM', visible:true, editable:false, width: '80' }
]

function PopCommItem(props) {
  const [grid, setGrid] = useState(null);
  const [itemsTpOptions,setItemsTpOptions] = useState([]);

  const [viewData,getViewInfo] = useViewStore(state => [state.viewData,state.getViewInfo])
  const { handleSubmit, control, getValues, setValue, clearErrors } = useForm({
    defaultValues: {
      ITEM_CD: '',
      ITEM_NM: '',
      ITEM_LV_CD: ''
    }
  });

  useEffect(() => {
    const grdObjPopup = getViewInfo(vom.active,`${props.id}_CommGrid`);
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
        await loadItemLvComboListFromEngine();
        popupLoadData();
      }
    }

    initLoad();
  }, [grid]);

  const setOptions = () => {
    setVisibleProps(grid, true, false, true);
    grid.gridView.setDisplayOptions({
      fitStyle: 'evenFill'
    });

    grid.gridView.setCheckBar({
      exclusive: true
    });

    grid.gridView.onDataLoadComplated = function () {
      grid.gridView.setFocus();
    }

    grid.gridView.onCellDblClicked = function (clickData, itemIndex) {
      let checkedRows = [];

      checkedRows.push(grid.dataProvider.getJsonRow(itemIndex.dataRow));

      props.confirm(checkedRows);
      props.onClose(false);
    }
  }

  const onError = (errors, e) => {
    if (typeof errors !== 'undefined' && Object.keys(errors).length > 0 ) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  const loadItemLvComboListFromEngine = () => {
    let param = {
      TYPE:'ITEM_TP'
    }
    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: 'engine/mp/SRV_GET_COMBO_LIST',
      params: param
    })
    .then(function (res) {
      let array = [];
      res.data.RESULT_DATA.forEach(function (data) {
        array.push( {
          label: data.ITEM_TP_NM,
          value: data.ITEM_TP_ID,
        });
      });
      setItemsTpOptions(array);
      setValue('itemTpId', 'ALL');
    })
    .catch(function (err) {
      console.log(err);
    })
  }

  function popupLoadData () {
    grid.gridView.showToast(progressSpinner + 'Load Data...', true);

    let data = getValues();
    let param = {
      ITEM_CD: data.itemCd ? data.itemCd : '',
      ITEM_NM: data.itemNm ? data.itemNm : '',
      ITEM_TP_ID: data.itemTpId ? data.itemTpId : 'ALL',
      ITEM_DESCRIP: data.itemDescrip ? data.itemDescrip : ''
    }
    zAxios({
      fromPopup: true,
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: 'engine/mp/' + (props.url === undefined ? 'SRV_GET_ITEM_GRID_LIST' : props.url),
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
    let checkedRows = [];
    grid.gridView.getCheckedRows().forEach(function (index) {
      checkedRows.push(grid.dataProvider.getJsonRow(index));
    });
    props.confirm(checkedRows);
    props.onClose(false);
  }

  function onSubmit(data) {
    popupLoadData(data);
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit,onError)} title="COMM_SRH_POP_ITEM" resizeHeight={600} resizeWidth={950}>
      <SearchArea expandButton={false}>
        <InputField name="itemCd" label={transLangKey("ITEM_CD")} control={control} />
        <InputField name="itemNm" label={transLangKey("ITEM_NM")} control={control} />
        <InputField type='select' name="itemTpId" label={transLangKey("ITEM_TP")} control={control} options={itemsTpOptions} />
        <InputField name="itemDescrip" label={transLangKey("ITEM_DESCRIP")} control={control} />
        <IconButton onClick={() => { onSubmit() }}><Icon.Search /></IconButton>
      </SearchArea>
      <BaseGrid id={`${props.id}_CommGrid`} items={popupGrid1Items} ></BaseGrid>
    </PopupDialog>
  );
}

export default PopCommItem;
