import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IconButton } from '@mui/material';
import { SearchArea, InputField, PopupDialog, BaseGrid, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';

let popupGrid1Items = [
  { name: 'ID', dataType: 'text', headerText: 'ID', visible:false, editable:false, width: '100' },
  { name: 'VIEW_ID', dataType: 'text', headerText: 'VIEW_ID', visible:false, editable:false, width: '100' },
  { name: 'ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', visible:true, editable:false, width: '100' },
  { name: 'ITEM_NM', dataType: 'text', headerText: 'ITEM_NM', visible:true, editable:false, width: '200' },
  { name: 'ITEM_TP_ID', dataType: 'text', headerText: 'ITEM_TP_ID', visible:false, editable:false, width: '140' },
  { name: 'DESCRIP', dataType: 'text', headerText: 'DESCRIP', visible:true, editable:false, width: '200' },
  { name: 'ITEM_TP', dataType: 'text', headerText: 'ITEM_TP', visible:true, editable:false, width: '140' }
]

function PopParentComponentItem(props) {
  const [grid, setGrid] = useState(null);
  const [itemsTpOptions, setItemsTpOptions] = useState([]);

  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo])
  const { handleSubmit, control, getValues, setValue } = useForm({
    defaultValues: {
      itemCd: '',
      itemNm: '',
      itemTp: '',
      descrip: ''
    }
  });

  useEffect(() => {
    const grdObjPopup = getViewInfo(vom.active, `${props.id}_ParentItemGrid`);

    if (grdObjPopup) {
      if (grdObjPopup.dataProvider) {
        if (grid != grdObjPopup) {
          setGrid(grdObjPopup);
        }
      }
    }
  }, [viewData]);

  useEffect(() => {
    if (grid) {
      setOptionsGrid();
      loadItemTpCombo();
    }
  }, [grid]);

  function loadItemTpCombo() {
    let param = new URLSearchParams();

    param.append("TYPE", "ITEM_TP");

    zAxios({
      method: "post",
      header: { "content-type": "application/json" },
      url: baseURI() + "engine/mp/SRV_GET_COMBO_LIST",
      data: param
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
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

          loadData();
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  const setOptionsGrid = () => {
    setVisibleProps(grid, true, false, false);

    grid.gridView.setDisplayOptions({
      fitStyle: "fill"
    });

    grid.gridView.onCellDblClicked = function (grid, clickData) {
      if (clickData.cellType === "data") {
        saveSubmit();
      }
    };
  }

  function loadData() {
    grid.gridView.showToast(progressSpinner + 'Load Data...', true);

    let param = new URLSearchParams();

    param.append('CONF_KEY', '001');
    param.append('VIEW_ID', props.viewId);
    param.append('ITEM_CD', getValues('itemCd'));
    param.append('ITEM_NM', getValues('itemNm'));
    param.append('ITEM_TP', getValues('itemTp'));
    param.append('DESCRIP', getValues('descrip'));
    param.append('timeout', '0');

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: 'engine/mp/SRV_UI_CM_05_POP_01_Q',
      params: param,
      fromPopup: true
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
    loadData(data);
  }

  const onError = (errors, e) => {
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="COMM_SRH_POP_ITEM" resizeHeight={600} resizeWidth={950}>
      <SearchArea expandButton={false}>
        <InputField name="itemCd" label={transLangKey("ITEM_CD")} control={control} />
        <InputField name="itemNm" label={transLangKey("ITEM_NM")} control={control} />
        <InputField type='select' name="itemTp" label={transLangKey("ITEM_TP")} control={control} options={itemsTpOptions} />
        <InputField name="descrip" label={transLangKey("ITEM_DESCRIP")} control={control} />
        <IconButton onClick={() => { onSubmit() }}><Icon.Search /></IconButton>
      </SearchArea>
      <BaseGrid id={`${props.id}_ParentItemGrid`} items={popupGrid1Items} ></BaseGrid>
    </PopupDialog>
  );
}

export default PopParentComponentItem;
