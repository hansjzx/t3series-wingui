import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box, IconButton } from '@mui/material';
import { SearchArea, InputField, PopupDialog, BaseGrid, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';

let popupGrid1Items = [
  { name: 'ITEM_MST_ID', dataType: 'text', headerText: 'ITEM_MST_ID', visible:false, editable:false, width: '100' },
  { name: 'VIEW_ID', dataType: 'text', headerText: 'VIEW_ID', visible:false, editable:false, width: '100' },
  { name: 'ITEM_SCOPE_ID', dataType: 'text', headerText: 'ITEM_SCOPE_ID', visible:false, editable:false, width: '100' },
  { name: 'ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', visible:true, editable:false, width: '100' },
  { name: 'ITEM_NM', dataType: 'text', headerText: 'ITEM_NM', visible:true, editable:false, width: '200' },
  { name: 'ITEM_LV_NM', dataType: 'text', headerText: 'ITEM_LV_NM', visible:true, editable:false, width: '100' },
  { name: 'ITEM_TP', dataType: 'text', headerText: 'ITEM_TP', visible:true, editable:false, width: '100' }
]

function PopCommItemLv(props) {
  const [grid, setGrid] = useState(null);
  const [itemsTpOptions,setItemsTpOptions] = useState([]);
  const [itemsLvOptions,setItemsLvOptions] = useState([]);

  const [viewData,getViewInfo] = useViewStore(state => [state.viewData,state.getViewInfo])
  const { handleSubmit, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      itemCd: props.itemcd,
      itemNm: props.itemNm,
      itemLvCd: props.itemLvCd
    }
  });

  useEffect(() => {
    const grdObjPopup = getViewInfo(vom.active,`${props.id}_CommItemLvGrid`);
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
        await loadItemTpComboListFromEngine();
        popupLoadData();
      }
    }

    initLoad();
  }, [grid]);

  function setOptions() {
    setVisibleProps(grid, true, true, false);
    grid.gridView.setDisplayOptions({
      fitStyle: 'evenFill'
    });

    grid.gridView.setCheckBar({
      exclusive: true
    });

    grid.gridView.onCellDblClicked = function (clickData, itemIndex) {
      let checkedRows = [];

      checkedRows.push(grid.dataProvider.getJsonRow(itemIndex.dataRow));

      props.confirm(checkedRows);
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

  function loadItemLvComboListFromEngine() {
    let dataArr = [];
    let itemScopeArr = [];
    let itemScopeRstArr = [];
    let param = new URLSearchParams();
    param.append('CODE', 'ITEM_SCOPE');

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_CM_CODE',
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        dataArr = [];
        dataArr = res.data.RESULT_DATA;

        itemScopeArr = dataArr.filter(code => code.GROUP == 'ITEM_SCOPE');

        for (var i = 0, len = itemScopeArr.length; i < len; i++) {
          var row = itemScopeArr[i];
          if (row !== null) {
            var listObj = {value: row.ID, label: transLangKey(row.CD_NM)};
            itemScopeRstArr.push(listObj);
          }
        }
        setItemsLvOptions(itemScopeRstArr);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function loadItemTpComboListFromEngine() {
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
          value: data.ITEM_TP_ID
        });
      });

      setItemsTpOptions(array);
      setValue('itemTpId', 'ALL');
    })
    .catch(function (err) {
      console.log(err);
    })
  }

  function popupLoadData() {
    grid.gridView.showToast(progressSpinner + 'Load Data...', true);

    let data = getValues();
    let param = {
      CONF_KEY: '001',
      ITEM_CD: data.itemCd ? data.itemCd : '',
      ITEM_NM: data.itemNm ? data.itemNm : '',
      ITEM_LV: data.itemLv ? data.itemLv : '',
      ITEM_TP: data.itemTpId ? data.itemTpId : 'ALL'
    }

    zAxios({
      fromPopup: true,
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: 'engine/mp/SRV_UI_CM_04_POP_01_Q',
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

  function saveSubmit() {
    let checkedRows = [];
    grid.gridView.getCheckedRows().forEach(function (index) {
      checkedRows.push(grid.dataProvider.getJsonRow(index));
    });
    props.confirm(checkedRows);
    props.onClose(false);
  }

  const onSubmit = (data) => {
    popupLoadData(data);
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit,onError)} title="COMM_SRH_POP_ITEM" resizeHeight={600} resizeWidth={950}>
      <SearchArea expandButton={false}>
        <InputField name="itemCd" label={transLangKey("ITEM_CD")} control={control} readonly={false} disabled={false} />
        <InputField name="itemNm" label={transLangKey("ITEM_NM")} control={control} readonly={false} disabled={false} />
        <InputField type="select" name="itemLv" label={transLangKey("ITEM_LV")} control={control} readonly={false} disabled={false} options={itemsLvOptions} />
        <InputField type="select" name="itemTpId" label={transLangKey("ITEM_TP")} control={control} readonly={false} disabled={false} options={itemsTpOptions} />
        <IconButton onClick={() => { onSubmit() }}><Icon.Search /></IconButton>
      </SearchArea>
      <Box style={{height: "100%" }}>
        <BaseGrid id={`${props.id}_CommItemLvGrid`} items={popupGrid1Items}></BaseGrid>
      </Box>
    </PopupDialog>
  );
}

export default PopCommItemLv;
