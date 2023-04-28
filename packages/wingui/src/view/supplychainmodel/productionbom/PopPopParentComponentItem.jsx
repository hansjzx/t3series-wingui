import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box, IconButton } from '@mui/material';
import { SearchArea, InputField, PopupDialog, BaseGrid, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';

let popupGrid1Items = [
  { name: 'ID', dataType: 'text', headerText: 'ID', visible:false, editable:false, width: '100' },
  { name: 'VIEW_ID', dataType: 'text', headerText: 'VIEW_ID', visible:false, editable:false, width: '100' },
  { name: 'LOC_TP', dataType: 'text', headerText: 'LOCAT_TP_NM', visible:true, editable:false, width: '100' },
  { name: 'LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible:true, editable:false, width: '100' },
  { name: 'LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible:true, editable:false, width: '100' },
  { name: 'LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', visible:true, editable:false, width: '120' },
  { name: 'ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', visible:true, editable:false, width: '100', button: "action" },
  { name: 'ITEM_NM', dataType: 'text', headerText: 'ITEM_NM', visible:true, editable:false, width: '200' },
  { name: 'ITEM_TP_ID', dataType: 'text', headerText: 'ITEM_TP_ID', visible:false, editable:false, width: '100' },
  { name: 'ITEM_TP', dataType: 'text', headerText: 'ITEM_TP', visible:true, editable:false, width: '100' },
  { name: 'DESCRIP', dataType: 'text', headerText: 'DESCRIP', visible:true, editable:false, width: '200' }
]

let popupGrid2Items = [
  { name: 'ID', dataType: 'text', headerText: 'ID', visible:false, editable:false, width: '100' },
  {
    name: "WHERE_USED", dataType: "group", orientation: "horizontal", headerText: "WHERE_USED", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: 'P_LOCAT_TP_NM', dataType: 'text', headerText: 'LOCAT_TP_NM', visible:true, editable:false, width: '100' },
      { name: 'P_LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible:true, editable:false, width: '100' },
      { name: 'P_LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible:true, editable:false, width: '100' },
      { name: 'P_LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', visible:true, editable:false, width: '100' },
      { name: 'P_ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', visible:true, editable:false, width: '100' },
      { name: 'P_ITEM_NM', dataType: 'text', headerText: 'ITEM_NM', visible:true, editable:false, width: '100' },
      { name: 'P_ITEM_TP_NM', dataType: 'text', headerText: 'ITEM_TP', visible:true, editable:false, width: '100' },
      { name: 'P_BOM_LV', dataType: 'text', headerText: 'BOM_LV', visible:true, editable:false, width: '100' },
      { name: 'P_TRANS_BOM_LV', dataType: 'text', headerText: 'TRANS_BOM_LV', visible:false, editable:false, width: '100' }
    ]
  },
  { name: 'ORI_LOCAT_TP_NM', dataType: 'text', headerText: 'ORI_LOCAT_TP_NM', visible:false, editable:false, width: '100' },
  { name: 'ORI_LOCAT_LV', dataType: 'text', headerText: 'ORI_LOCAT_LV', visible:false, editable:false, width: '100' },
  { name: 'ORI_LOCAT_CD', dataType: 'text', headerText: 'ORI_LOCAT_CD', visible:false, editable:false, width: '100' },
  { name: 'ORI_LOCAT_NM', dataType: 'text', headerText: 'ORI_LOCAT_NM', visible:false, editable:false, width: '100' },
  { name: 'ORI_LOCAT_ITEM_ID', dataType: 'text', headerText: 'ORI_LOCAT_ITEM_ID', visible:false, editable:false, width: '100' },
  { name: 'ORI_ITEM_CD', dataType: 'text', headerText: 'ORI_ITEM_CD', visible:false, editable:false, width: '100' },
  { name: 'ORI_ITEM_NM', dataType: 'text', headerText: 'ORI_ITEM_NM', visible:false, editable:false, width: '100' }
]

function PopPopParentComponentItem(props) {
  const [grid1, setGrid1] = useState(null);
  const [grid2, setGrid2] = useState(null);
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
    const grd1ObjPopup = getViewInfo(vom.active, `${props.id}_PopParentItemGrid1`);
    const grd2ObjPopup = getViewInfo(vom.active, `${props.id}_PopParentItemGrid2`);

    if (grd1ObjPopup) {
      if (grd1ObjPopup.dataProvider) {
        if (grid1 != grd1ObjPopup) {
          setGrid1(grd1ObjPopup);
        }
      }
    }

    if (grd2ObjPopup) {
      if (grd2ObjPopup.dataProvider) {
        if (grid2 != grd2ObjPopup) {
          setGrid2(grd2ObjPopup);
        }
      }
    }
  }, [viewData]);

  useEffect(() => {
    if (grid1) {
      setOptionsGrid1();
      loadItemTpCombo();
    }
  }, [grid1]);

  useEffect(() => {
    if (grid2) {
      setOptionsGrid2();
    }
  }, [grid2]);

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

          loadDataGrid1();
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  const setOptionsGrid1 = () => {
    setVisibleProps(grid1, true, false, false);

    grid1.gridView.setDisplayOptions({
      fitStyle: "evenFill"
    });

    grid1.gridView.onCellDblClicked = function (grid, clickData) {
      if (clickData.cellType === "data") {
        saveSubmit();
      }
    };

    grid1.gridView.sortingOptions.style = "inclusive";

    var fields = ["LOC_TP", "LOCAT_LV", "LOCAT_CD", "LOCAT_NM"];
    var dirs = [];
    grid1.gridView.orderBy(fields, dirs);

    grid1.gridView.setColumnProperty("LOC_TP", "mergeRule", {
      criteria: "value"
    });

    const mergeColumns = [ "LOCAT_LV", "LOCAT_CD", "LOCAT_NM" ];
    for (let i = 0; i < mergeColumns.length; i++) {
      grid1.gridView.setColumnProperty(mergeColumns[i], "mergeRule", {
        criteria: "prevvalues + values[ '" + mergeColumns[i] + "' ]"
      });
    }

    grid1.gridView.columnByName("ITEM_CD").buttonVisibility = "always";

    grid1.gridView.onCellButtonClicked = function (grid, index, column) {
      if (column.fieldName === "ITEM_CD") {
        let row = grid.getValues(index.itemIndex);

        loadDataGrid2(row.ID);
      }
    }
  }

  const setOptionsGrid2 = () => {
    setVisibleProps(grid2, true, false, false);

    grid2.gridView.setDisplayOptions({
      fitStyle: "evenFill"
    });
  }

  function loadDataGrid1() {
    grid1.gridView.showToast(progressSpinner + 'Load Data...', true);

    let param = new URLSearchParams();

    param.append('CONF_KEY', props.confKey);
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
      grid1.dataProvider.fillJsonData(res.data.RESULT_DATA);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      grid1.gridView.hideToast();
    });
  }

  function loadDataGrid2(locaItemId) {
    grid2.gridView.showToast(progressSpinner + 'Load Data...', true);

    let param = new URLSearchParams();

    param.append('LOCAT_ITEM_ID', locaItemId);
    param.append('timeout', '0');
    param.append('CURRENT_OPERATION_CALL_ID', "UI_CM_05-POP_UI_CM_05_02_01_WINDOW_01_GRD_01_cell-click_01");

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: 'engine/mp/SRV_UI_CM_05_Q6',
      params: param,
      fromPopup: true
    })
    .then(function (res) {
      grid2.dataProvider.fillJsonData(res.data.RESULT_DATA);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      grid2.gridView.hideToast();
    });
  }

  const saveSubmit = () => {
    let focusCell = grid1.gridView.getCurrent();
    let targetRow = focusCell.dataRow;

    if (targetRow !== -1) {
      props.confirm(grid1.dataProvider.getJsonRow(targetRow));

    }

    props.onClose(false);
  }

  function onSubmit(data) {
    loadDataGrid1(data);
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
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="COMM_SRH_POP_ITEM" resizeHeight={800} resizeWidth={1000}>
      <SearchArea expandButton={false}>
        <InputField name="itemCd" label={transLangKey("ITEM_CD")} control={control} />
        <InputField name="itemNm" label={transLangKey("ITEM_NM")} control={control} />
        <InputField type='select' name="itemTp" label={transLangKey("ITEM_TP")} control={control} options={itemsTpOptions} />
        <InputField name="descrip" label={transLangKey("ITEM_DESCRIP")} control={control} />
        <IconButton onClick={() => { onSubmit() }}><Icon.Search /></IconButton>
      </SearchArea>
      <Box style={{ height: "70%" }}>
        <BaseGrid id={`${props.id}_PopParentItemGrid1`} items={popupGrid1Items} ></BaseGrid>
      </Box>
      <Box style={{ height: "30%", marginTop: "5px"}}>
        <BaseGrid id={`${props.id}_PopParentItemGrid2`} items={popupGrid2Items} ></BaseGrid>
      </Box>
    </PopupDialog>
  );
}

export default PopPopParentComponentItem;
