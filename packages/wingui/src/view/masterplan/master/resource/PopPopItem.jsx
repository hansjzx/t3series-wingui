import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IconButton } from '@mui/material';
import { BaseGrid, InputField, PopupDialog, SearchArea, zAxios } from '@zionex/wingui-core/src/common/imports';

let popupGridItems = [
  { name: 'SITE_ITEM_ID', dataType: 'text', headerText: 'SITE_ITEM_ID', visible: false, editable: false, width: '100' },
  { name: 'ITEM_MST_ID', dataType: 'text', headerText: 'ITEM_MST_ID', visible: false, editable: false, width: '100' },
  { name: 'ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', visible: true, editable: false, width: '100' },
  { name: 'ITEM_NM', dataType: 'text', headerText: 'ITEM_NM', visible: true, editable: false, width: '100' },
  { name: 'ITEM_DESCRIP', dataType: 'text', headerText: 'RES_GRP_DESCRIP', visible: true, editable: false, width: '100' },
  { name: 'ITEM_TP', dataType: 'text', headerText: 'ITEM_TP', visible: true, editable: false, width: '100' },
  { name: 'UOM_NM', dataType: 'text', headerText: 'UOM_NM', visible:false, editable: false, width: '100' }
]

function PopPopItem(props) {
  const [grid, setGrid] = useState(null);
  const [itemsTpOptions, setItemsTpOptions] = useState([]);

  const { handleSubmit, control, getValues, setValue, clearErrors } = useForm({
    defaultValues: {
      itemCd: '',
      itemNm: '',
      itemDesc: '',
      itemTp: ''
    }
  });

  function afterGridCreate(gridObj) {
    setGrid(gridObj);
  }

  useEffect(() => {
    async function initLoad() {
      if (grid) {
        setOptions();
        await comboDataLoad();
      }
    }

    initLoad();
  }, [grid]);

  function setOptions() {
    setVisibleProps(grid, true, false, false);

    grid.gridView.setDisplayOptions({ fitStyle: 'fill', });

    grid.gridView.displayOptions.selectionStyle = 'singleRow';

    grid.gridView.onCellDblClicked = function () {
      saveSubmit();
    };
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
  
  function comboDataLoad() {
    let formData = new FormData();

    formData.append('TYPE', 'ITEM_TP');

    zAxios({
      method: 'post',
      url: 'engine/mp/SRV_GET_COMBO_LIST',
      data: formData
    })
      .then(function (res) {
        let rstArr = [];
        let dataArr = res.data.RESULT_DATA;

        for (var i = 0, len = dataArr.length; i < len; i++) {
          var row = dataArr[i];
          if (row !== null) {
            var listObj = { value: row.ITEM_TP_ID, label: transLangKey(row.ITEM_TP_NM) };
            rstArr.push(listObj);
          }
        }

        setItemsTpOptions(rstArr);
        setValue("itemTp", rstArr[0].value);
        popupLoadData(rstArr[0].value);
      })
      .catch(function (err) {
        console.log(err);
      });

  }

  function popupLoadData(itemTpId) {
    let formData = new FormData();

    formData.append('LOC_DTL_ID', props.data);
    formData.append('ITEM_CD', getValues('itemCd'));
    formData.append('ITEM_NM', getValues('itemNm'));
    formData.append('ITEM_DESC', getValues('itemDesc'));
    formData.append('ITEM_TP', itemTpId);

    zAxios({
      method: 'post',
      url: 'engine/mp/SRV_UI_MP_08_POP_Q4',
      data: formData
    })
      .then(function (res) {
        grid.setData(res.data.RESULT_DATA);
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function saveSubmit() {
    let focusCell = grid.gridView.getCurrent();
    let targetRow = focusCell.dataRow;
    props.confirm(grid.dataProvider.getJsonRow(targetRow));
    props.onClose(false);
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="COMM_SRH_POP_ITEM" resizeHeight={600} resizeWidth={950}>
      <SearchArea expandButton={false}>
        <InputField name="itemCd" label={transLangKey("ITEM_CD")} control={control} />
        <InputField name="itemNm" label={transLangKey("ITEM_NM")} control={control} />
        <InputField name="itemDesc" label={transLangKey("ITEM_DESCRIP")} control={control} />
        <InputField type='select' name="itemTp" label={transLangKey("ITEM_TP")} control={control} options={itemsTpOptions} />
        <IconButton onClick={() => { popupLoadData(getValues('itemTp')) }}><Icon.Search /></IconButton>
      </SearchArea>
      <BaseGrid id={`${props.id}_PopItemGrid`} items={popupGridItems} afterGridCreate={afterGridCreate} />
    </PopupDialog>
  );
}

export default PopPopItem;
