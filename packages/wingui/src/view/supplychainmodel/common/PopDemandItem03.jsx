import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box } from '@mui/material';
import { SearchArea, BaseGrid, useViewStore, zAxios, PopupDialog, InputField } from '@zionex/wingui-core/src/common/imports';

let popupGrid1Items = [
  //품목 아이디
  { name: "ITEM_MST_ID", dataType: "text", headerText: "ITEM_MST_ID", visible: false, editable: false, width: "130" },
  //품목 코드
  { name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: "130" },
  //품목 명
  { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: "130" },
  //품목 타입
  { name: "ITEM_TP", dataType: "text", headerText: "ITEM_TP", visible: true, editable: false, width: "130" }
];

//품목 조회
function PopDemandItem03(props) {
  const [demandItemGrid, setDemandItemGrid]  = useState(null);
  const [itemsTpOptions, setItemsTpOptions] = useState([]);

  const [viewData,getViewInfo] = useViewStore(state => [state.viewData,state.getViewInfo])
  const { handleSubmit, getValues, control, clearErrors } = useForm({
    defaultValues: {
      itemCd:"",
      itemNm:"",
      itemTpId:"",
    }
  });

  useEffect(() => {
    const grdObjPopup = getViewInfo( vom.active,`${props.id}_DemandItem03Grid`);
    if(grdObjPopup) {
      if(grdObjPopup.dataProvider) {
        if(demandItemGrid != grdObjPopup)
        setDemandItemGrid(grdObjPopup);
      }
    }
  }, [viewData]);

  useEffect(()=>{
    if(demandItemGrid){
      popupLoadData();
      setOptions();
      loadComboList();
    }
  }, [demandItemGrid]);

  const loadComboList = () => {
    let param = new URLSearchParams();

    param.append('TYPE', 'ITEM_TP');
    param.append('timeout', 0);
    param.append('CURRENT_OPERATION_CALL_ID', 'OPC_RESET_DATA_03');
    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: '/engine/mp/SRV_GET_COMBO_LIST',
      data: param
    })
    .then(function (res) {
      let dataArr =  res.data.RESULT_DATA;
      let listItemObj;
      let rstArr = [];

      dataArr.forEach((data)=>{
        if(data.ITEM_TP_CD === null) {
          listItemObj = {value:"", label:data.ITEM_TP_NM};
        } else {
          listItemObj = {value:data.ITEM_TP_CD, label:data.ITEM_TP_NM};
        }
        rstArr.push(listItemObj);
      });
      setItemsTpOptions(rstArr);
    })
    .catch(function (err) {
      console.log(err);
    })

  };

  const setOptions = () => {
    const grid = demandItemGrid;
    setVisibleProps(grid, false, false, false);

    grid.dataProvider.setOptions({ restoreMode: "auto" });
    grid.gridView.setEditOptions({ insertable: false, appendable: false });
    grid.gridView.setDisplayOptions({ fitStyle: 'even' });

    grid.gridView.onCellDblClicked = function (clickData, itemIndex) {
      props.confirm("PopDemandItem03", grid.dataProvider.getJsonRow(itemIndex.dataRow));
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

  const popupLoadData = (data) => {
    demandItemGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    let param = new URLSearchParams();

      param.append('DATA_DIV', 'GET_ITEM_CODE');
      param.append('PARAM1', getValues("itemCd"));
      param.append('PARAM2', getValues("itemNm"));
      param.append('PARAM3', getValues("itemTpId"));
      param.append('timeout', 0);
      param.append('CURRENT_OPERATION_CALL_ID', 'OPC_POP_ALL_ITEM_GRD_LOAD');
      zAxios({
        fromPopup: true,
        method: 'post',
        header: { 'content-type': 'application/json' },
        url: '/engine/mp/SRV_UI_COMM_DATA_Q',
        data: param
      })
      .then(function (res) {
        demandItemGrid.dataProvider.fillJsonData(res.data.RESULT_DATA);
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
        demandItemGrid.gridView.hideToast();
      });
  }

  // popup 조회 클릭시 조회
  const onPopupSubmit = () => {
    popupLoadData();
  }

  const saveSubmit = () => {
    let focusCell = demandItemGrid.gridView.getCurrent();

    props.confirm("PopDemandItem03",demandItemGrid.dataProvider.getJsonRow(focusCell.dataRow));
    props.onClose(false);
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title={props.title} resizeHeight={500} resizeWidth={800}>
      <SearchArea submit={handleSubmit(onPopupSubmit, onError)} expandButton={false} searchButton={true}>
        <InputField name="itemCd" label={transLangKey("ITEM_CD")} control={control} />
        <InputField name="itemNm" label={transLangKey("ITEM_NM")} control={control} />
        <InputField type="select" name="itemTpId" label={transLangKey("ITEM_TP_NM")} control={control} options={itemsTpOptions} />
      </SearchArea>
      <Box style={{height:"100%"}}>
        <BaseGrid id={`${props.id}_DemandItem03Grid`} items={popupGrid1Items}></BaseGrid>
      </Box>
    </PopupDialog>
  );
}

export default PopDemandItem03;
