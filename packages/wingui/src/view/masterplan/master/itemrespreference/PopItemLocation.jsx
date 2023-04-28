import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IconButton } from '@mui/material';
import { BaseGrid, InputField, PopupDialog, SearchArea, zAxios } from '@zionex/wingui-core/src/common/imports';

let gridItems = [
  { name: 'SITE_ITEM_ID', dataType: 'text', headerText: 'SITE_ITEM_ID', visible:false, editable:false, width: '50' },
  { name: 'ITEM_MST_ID', dataType: 'text', headerText: 'ITEM_MST_ID', visible:false, editable:false, width: '50' },
  { name: 'ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', visible:true, editable:false, width: '100' },
  { name: 'ITEM_NM', dataType: 'text', headerText: 'ITEM_NM', visible:true, editable:false, width: '100' },
  { name: 'ITEM_DESCRIP', dataType: 'text', headerText: 'ITEM_DESCRIP', visible:true, editable:false, width: '150' },
  { name: 'ITEM_TP', dataType: 'text', headerText: 'ITEM_TP', visible:true, editable:false, width: '80' }
]

function PopItemLocation(props) {
  const [grid, setGrid] = useState(null);
  const [itemTypeOptions, setItemTypeOptions] = useState([]);

  const { control, getValues, reset } = useForm({
    defaultValues: {
      locationId: '',
      itemCode: '',
      itemName: '',
      itemDescription: '',
      itemType: 'ALL'
    }
  });

  useEffect(() => {
    async function initLoad() {
      if (grid) {
        setOptions();
        await setSelectOptions();
        loadData();
      }
    }

    initLoad();
  }, [grid]);

  function afterGridCreate(gridObj) {
    setGrid(gridObj);
  }

  function setOptions() {
    setVisibleProps(grid, true, false, false);

    grid.gridView.setDisplayOptions({ fitStyle: 'fill' });

    grid.gridView.onCellDblClicked = function () {
      onSubmit();
    };
  }

  function setSelectOptions() {
    let formData = new FormData();

    formData.append('TYPE', 'ITEM_TP');

    zAxios({
      method: 'post',
      url: 'engine/mp/SRV_GET_COMBO_LIST',
      data: formData,
      fromPopup: true
    })
    .then(function (res) {
      let array = [];

      res.data.RESULT_DATA.forEach(function (data) {
        array.push( {
          label: data.ITEM_TP_NM,
          value: data.ITEM_TP_ID,
        });
      });

      setItemTypeOptions(array);
    })
    .catch(function (err) {
      console.log(err);
    })
  }

  function loadData() {
    let formData = new FormData();

    formData.append('LOC_DTL_ID', props.data);
    formData.append('ITEM_CD', getValues('itemCode'));
    formData.append('ITEM_NM', getValues('itemName'));
    formData.append('ITEM_DESC', getValues('itemDescription'));
    formData.append('ITEM_TP', getValues('itemType'));

    zAxios({
      method: 'post',
      url: 'engine/mp/SRV_UI_MP_08_POP_Q4',
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

  function onClose() {
    reset();
    props.onClose();
  }

  function onSubmit() {
    let focusCell = grid.gridView.getCurrent();
    props.confirm(grid.dataProvider.getJsonRow(focusCell.dataRow));
    props.onClose(false);
  }

  return (
    <PopupDialog open={props.open} onClose={onClose} onSubmit={onSubmit} title="COMM_SRH_POP_ITEM" resizeHeight={600} resizeWidth={950}>
      <SearchArea expandButton={false}>
        <InputField name="itemCode" label={transLangKey("ITEM_CD")} control={control} />
        <InputField name="itemName" label={transLangKey("ITEM_NM")} control={control} />
        <InputField type="select" name="itemType" label={transLangKey("ITEM_TP")} control={control} options={itemTypeOptions} />
        <InputField name="itemDescription" label={transLangKey("ITEM_DESCRIP")} control={control} />
        <IconButton onClick={loadData}><Icon.Search /></IconButton>
      </SearchArea>
      <BaseGrid id={"PopItemLocationGrid"} items={gridItems} afterGridCreate={afterGridCreate} />
    </PopupDialog>
  );
}

export default PopItemLocation;
