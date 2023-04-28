import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box } from '@mui/material';
import { SearchArea, BaseGrid, useViewStore, zAxios, PopupDialog, InputField } from '@zionex/wingui-core/src/common/imports';

let popupGrid1Items = [
  { name: "ITEM_MST_ID", dataType: "text", headerText: "ITEM_MST_ID", visible: false, editable: false, width: "150" },
  { name: "ITEM_TP_ID", dataType: "text", headerText: "ITEM_TP_ID", visible: false, editable: false, width: "150" },
  { name: "ITEM_UOM_ID", dataType: "text", headerText: "ITEM_UOM_ID", visible: false, editable: false, width: "150" },
  //품목코드
  { name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: "150" },
  //품목명
  { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: "150" },
  //설명
  { name: "ITEM_DESCRIP", dataType: "text", headerText: "ITEM_DESCRIP", visible: true, editable: false, width: "170" },
  //품목 타입
  { name: "ITEM_TP_NM", dataType: "text", headerText: "ITEM_TP_NM", visible: true, editable: false, width: "150" },
  //품목 UOM
  { name: "ITEM_UOM_NM", dataType: "text", headerText: "ITEM_UOM_NM", visible: true, editable: false, width: "150" }
];

//품목 조회
function PopDemandItem(props) {

  const [itemDemandGrid, setItemDemandGrid]  = useState(null);
  const [itemsTpOptions,setItemsTpOptions] = useState([]);

  const [viewData,getViewInfo] = useViewStore(state => [state.viewData,state.getViewInfo])
  const { handleSubmit, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      itemCd:"",
      itemNm:"",
      itemTpId:"",
      itemDescrip:""
    }
  });

  useEffect(() => {
    async function initLoad() {
      await loadItemLvComboListFromEngine();
    }
    initLoad();
  }, []);

  useEffect(() => {
    const grdObjPopup = getViewInfo( vom.active,`${props.id}_DemandItemGrid`);
    if(grdObjPopup) {
      if(grdObjPopup.dataProvider) {
        if(itemDemandGrid != grdObjPopup)
        setItemDemandGrid(grdObjPopup);
      }
    }
  }, [viewData]);

  useEffect(()=>{
    if(itemDemandGrid){
      popupLoadData();
      setOptions();
    }
  }, [itemDemandGrid]);

  const setOptions = () => {
    const grid = itemDemandGrid;
    setVisibleProps(grid, false, false, false);

    grid.dataProvider.setOptions({ restoreMode: "auto" });
    grid.gridView.setEditOptions({ insertable: false, appendable: false });
    grid.gridView.setDisplayOptions({fitStyle: "even"});
    grid.gridView.setCheckBar({exclusive: props.multiple});
    grid.gridView.displayOptions.selectionStyle = 'singleRow';

    grid.gridView.onCellDblClicked = function (clickData, itemIndex) {
      props.confirm("PopDemandItem", grid.dataProvider.getJsonRow(itemIndex.dataRow));
      props.onClose(false);
    }
  }
  const onError = (errors, e) => {
    if(typeof errors !== "undefined" && Object.keys(errors).length > 0 ){
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  const loadItemLvComboListFromEngine = () => {
    let param={
      TYPE:'ITEM_TP',
      timeout: 0,
      CURRENT_OPERATION_CALL_ID:'OPC_POP_UI_MP_06_03_WINDOW_01_CPT_03_04_INIT_01'
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
      setValue("itemTpId", 'ALL');
    })
    .catch(function (err) {
      console.log(err);
    })
  }

  const popupLoadData = () => {
      itemDemandGrid.gridView.showToast(progressSpinner + 'Load Data...', true);
      let param = new URLSearchParams();

      param.append('ITEM_CD', getValues("itemCd"));
      param.append('ITEM_NM', getValues("itemNm"));
      param.append('ITEM_TP_ID', getValues("itemTpId") === "" ? "ALL": getValues("itemTpId"));
      param.append('ITEM_DESCRIP', getValues("itemDescrip"));
      param.append('timeout', 0);
      param.append('PREV_OPERATION_CALL_ID', 'OPC_POP_UI_MP_06_03_WINDOW_01_CPT_03_04_INIT_01');
      param.append('PREV_OPERATION_RESULT_CODE', 'RESULT_CODE_SUCCESS');
      param.append('PREV_OPERATION_RESULT_MESSAGE', 'execute stored procedures success');
      param.append('PREV_OPERATION_RESULT_SUCCESS', 'true');
      param.append('CURRENT_OPERATION_CALL_ID', 'OPC_POP_UI_MP_06_03_WINDOW_01_CPT_03_04_INIT_01_SUCCESS');

      zAxios({
        fromPopup: true,
        method: 'post',
        header: { 'content-type': 'application/json' },
        url: 'engine/mp/SRV_GET_ITEM_GRID_LIST',
        data: param
      })
      .then(function (res) {
        itemDemandGrid.dataProvider.fillJsonData(res.data.RESULT_DATA);
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
        itemDemandGrid.gridView.hideToast();
      });
  }
  // popup 확인
  const saveSubmit = () => {
    let focusCell = itemDemandGrid.gridView.getCurrent();
    props.confirm("PopDemandItem",itemDemandGrid.dataProvider.getJsonRow(focusCell.dataRow));
    props.onClose(false);
  }

  // popup 조회 클릭시 조회
  const onPopupSubmit = () => {
    popupLoadData();
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit,onError)} title={props.title} resizeHeight={600} resizeWidth={950}>
      <SearchArea submit={handleSubmit(onPopupSubmit, onError)} expandButton={false} searchButton={true}>
        <InputField name="itemCd" label={transLangKey("ITEM_CD")} control={control} />
        <InputField name="itemNm" label={transLangKey("ITEM_NM")} control={control} />
        <InputField type={"select"} name={"itemTpId"} label={transLangKey("ITEM_TP_NM")} control={control} options={itemsTpOptions} />
        <InputField name="itemDescrip" label={transLangKey("ITEM_DESCRIP")} control={control} />
      </SearchArea>
      <Box style={{height:"100%"}}>
        <BaseGrid id={`${props.id}_DemandItemGrid`} items={popupGrid1Items}></BaseGrid>
      </Box>
    </PopupDialog>
  );
}

export default PopDemandItem;
