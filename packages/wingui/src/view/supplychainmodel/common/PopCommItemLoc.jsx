import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { IconButton } from "@mui/material";
import { SearchArea, InputField, BaseGrid, PopupDialog, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';

let popupGrid1Items = [
  { name: "COMN_CD", dataType: "text", headerText: "COMN_CD", visible: false, editable: false, width: "100" },
  { name: "COMN_CD_NM", dataType: "text", headerText: "COMN_CD_NM", visible: false, editable: false, width: "100" },
  { name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: "100" },
  { name: "ITEM_DESC", dataType: "text", headerText: "ITEM_DESC", visible: false, editable: false, width: "100" },
  { name: "ITEM_ID", dataType: "text", headerText: "ITEM_ID", visible: false, editable: false, width: "100" },
  { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: "150" },
  { name: "ITEM_TP", dataType: "text", headerText: "ITEM_TP", visible: true, editable: false, width: "80" },
  { name: "UOM_ID", dataType: "text", headerText: "UOM_ID", visible: false, editable: false, width: "80" },
  { name: "UOM_NM", dataType: "text", headerText: "UOM_NM", visible: true, editable: false, width: "80" }
]

function PopCommItemLoc(props) {
  const [grid, setGrid] = useState(null);
  const [itemsTpOptions, setItemsTpOptions] = useState([]);

  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo])
  const { handleSubmit, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      itemCd: '',
      itemNm: '',
      itemLvCd: ''
    }
  });

  useEffect(() => {
    const grdObjPopup = getViewInfo(vom.active, `${props.id}_CommItemLocGrid`);
    if (grdObjPopup) {
      if (grdObjPopup.dataProvider) {
        if (grid != grdObjPopup)
          setGrid(grdObjPopup);
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
    setVisibleProps(grid, true, true, true);
    grid.gridView.setDisplayOptions({
      fitStyle: "evenFill",
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
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }


  const loadItemLvComboListFromEngine = () => {
    let param = {
      TYPE: 'ITEM_TP'
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
          array.push({
            label: data.ITEM_TP_NM,
            value: data.ITEM_TP_ID,
          });
        });
        setItemsTpOptions(array);
        setValue("itemTpId", 'ALL');
      })
      .catch(function (err) {
        console.log(err);
      })
  }

  const popupLoadData = () => {

    let data = getValues();
    let param = {
      CONSUME_LOC_MGMT_ID: props.data.CONSUME_LOCAT_MGMT_ID ? props.data.CONSUME_LOCAT_MGMT_ID : '',
      SUPPLY_LOC_MGMT_ID: props.data.SUPPLY_LOCAT_MGMT_ID ? props.data.SUPPLY_LOCAT_MGMT_ID : '',
      ITEM_CD: data.itemCd ? data.itemCd : '',
      ITEM_NM: data.itemNm ? data.itemNm : '',
      ITEM_TP_ID: data.itemTpId ? data.itemTpId : 'ALL',
      timeout: 0,
      CURRENT_OPERATION_CALL_ID: 'OPC_POP_BOD_ITEM_GRD_LOAD'
    }
    zAxios({
      fromPopup: true,
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: 'engine/mp/SRV_UI_CM_11_POP_Q2',
      params: param
    })
      .then(function (res) {
        grid.dataProvider.fillJsonData(res.data.RESULT_DATA);
      })
      .catch(function (err) {
        console.log(err);
      })
  }
  // popup 확인
  const saveSubmit = () => {
    let checkedRows = [];
    grid.gridView.getCheckedRows().forEach(function (index) {
      checkedRows.push(grid.dataProvider.getJsonRow(index));
    });
    props.confirm(checkedRows);
    props.onClose(false);
  }

  // popup 조회 클릭시 조회
  const onSubmit = (data) => {
    popupLoadData(data);
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="COMM_SRH_POP_ITEM" resizeHeight={600} resizeWidth={1100}>
      <SearchArea expandBtn={false}>
        <InputField name="itemCd" label={transLangKey("ITEM_CD")} control={control} />
        <InputField name="itemNm" label={transLangKey("ITEM_NM")} control={control} />
        <InputField type='select' name="itemTpId" label={transLangKey("ITEM_TP")} control={control} options={itemsTpOptions} />
        <IconButton onClick={() => { onSubmit() }}><Icon.Search /></IconButton>
      </SearchArea>
      <BaseGrid id={`${props.id}_CommItemLocGrid`} items={popupGrid1Items} ></BaseGrid>
    </PopupDialog>
  );
}

export default PopCommItemLoc;