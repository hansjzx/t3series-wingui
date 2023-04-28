import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box } from '@mui/material';
import { SearchArea, BaseGrid, useViewStore, zAxios, PopupDialog, InputField } from '@zionex/wingui-core/src/common/imports';

let popupGrid1Items = [
  //품목코드
  { name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: "150" },
  //mst_id
  { name: "ITEM_MST_ID", dataType: "text", headerText: "ITEM_MST_ID", visible: false, editable: false, width: "150" },
  //품목명
  { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: "150" },
  //품목 타입
  { name: "ITEM_TP", dataType: "text", headerText: "ITEM_TP", visible: true, editable: false, width: "150" },
  //uom_id
  { name: "UOM_ID", dataType: "text", headerText: "UOM_ID", visible: false, editable: false, width: "150" }
];

//품목 조회
function PopDemandItem04(props) {
  const [itemDemandGrid, setItemDemandGrid]  = useState(null);
  const [itemsTpOptions,setItemsTpOptions] = useState([]);

  const [viewData,getViewInfo] = useViewStore(state => [state.viewData,state.getViewInfo])
  const { handleSubmit, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      itemCd:"",
      itemNm:"",
      itemTpId:""
    }
  });

  useEffect(() => {
    async function initLoad() {
      await loadItemLvComboListFromEngine();
    }
    initLoad();
  }, []);

  useEffect(() => {
    const grdObjPopup = getViewInfo( vom.active,`${props.id}_DemandItem04Grid`);
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
    grid.gridView.setDisplayOptions({ fitStyle: "even" });
    grid.gridView.setCheckBar({exclusive: props.multiple});

    grid.gridView.displayOptions.selectionStyle = 'singleRow';

    grid.gridView.onCellDblClicked = function (clickData, itemIndex) {
      props.confirm("PopDemandItem04",grid.dataProvider.getJsonRow(itemIndex.dataRow));
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
      fromPopup: true,
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

      param.append('DATA_DIV', "GET_DP_ITEM");
      param.append('PARAM1', getValues("itemCd"));
      param.append('PARAM2', getValues("itemNm"));
      param.append('PARAM3', getValues("itemTpId"));
      param.append('timeout', 0);
      param.append('CURRENT_OPERATION_CALL_ID', 'OPC_POP_ALL_ITEM_GRD_LOAD');

      zAxios({
        method: 'post',
        header: { 'content-type': 'application/json' },
        url: 'engine/mp/SRV_UI_COMM_DATA_Q',
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

    props.confirm("PopDemandItem04", itemDemandGrid.dataProvider.getJsonRow(focusCell.dataRow));
    props.onClose(false);
  }

  // popup 조회 클릭시 조회
  const onPopupSubmit = () => {
    popupLoadData();
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit,onError)} title={props.title} resizeHeight={600} resizeWidth={780}>
      <SearchArea submit={handleSubmit(onPopupSubmit, onError)} expandButton={false} searchButton={true}>
        <InputField name="itemCd" label={transLangKey("ITEM_CD")} control={control} />
        <InputField name="itemNm" label={transLangKey("ITEM_NM")} control={control} />
        <InputField type="select" name="itemTpId" label={transLangKey("ITEM_TP_NM")} control={control} options={itemsTpOptions} />
      </SearchArea>
      <Box style={{height:"100%"}}>
        <BaseGrid id={`${props.id}_DemandItem04Grid`} items={popupGrid1Items}></BaseGrid>
      </Box>
    </PopupDialog>
  );
}

export default PopDemandItem04;
