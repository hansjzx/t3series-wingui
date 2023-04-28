import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box } from '@mui/material';
import { BaseGrid, useViewStore, zAxios, PopupDialog } from '@zionex/wingui-core/src/common/imports';

let popupGrid1Items = [
  //품목 레벨 ID (filter)
  { name: "ITEM_LV_ID", dataType: "text", headerText: "ITEM_LV_ID", visible: false, editable: false, width: "270" },
  //품목 레벨 코드
  { name: "ITEM_LV_CD", dataType: "text", headerText: "ITEM_LV_CD", visible: true, editable: false, width: "130" },
  //품목 레벨 명 (filter)
  { name: "ITEM_LV_NM", dataType: "text", headerText: "ITEM_LV_NM", visible: true, editable: false, width: "130" },
  //상위 품목 레벨 코드
  { name: "PARENT_ITEM_LV_CD", dataType: "text", headerText: "PARENT_ITEM_LV_CD", visible: true, editable: false, width: "130" },
  //상위 품목 레벨 명
  { name: "PARENT_ITEM_LV_NM", dataType: "text", headerText: "PARENT_ITEM_LV_NM", visible: true, editable: false, width: "160" }
];

//품목 레벨 조회(1)
function PopDemanditem02(props) {
  const [demandItemGrid, setDemandItemGrid]  = useState(null);

  const [viewData,getViewInfo] = useViewStore(state => [state.viewData,state.getViewInfo])
  const { handleSubmit, clearErrors } = useForm({
    defaultValues: { }
  });

  useEffect(() => {
    const grdObjPopup = getViewInfo( vom.active,`${props.id}_DemandItem02Grid`);
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
    }
  }, [demandItemGrid]);

  const setOptions = () => {
    const grid = demandItemGrid;
    setVisibleProps(grid, false, false, false);

    grid.dataProvider.setOptions({ restoreMode: "auto" });
    grid.gridView.setEditOptions({ insertable: false, appendable: false });
    grid.gridView.setDisplayOptions({ fitStyle: 'even' });

    grid.gridView.setCheckBar({exclusive: props.multiple});

    grid.gridView.onCellDblClicked = function (clickData, itemIndex) {
      props.confirm("PopDemanditem02", grid.dataProvider.getJsonRow(itemIndex.dataRow));
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

  const popupLoadData = () => {
    demandItemGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    let param = new URLSearchParams();
      param.append('timeout', 0);
      param.append('DATA_DIV', 'GET_ITEM_LV');
      param.append('CURRENT_OPERATION_CALL_ID', 'OPC_POP_ITEM_LV_GRD_LOAD');
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

  // popup 확인
  const saveSubmit = () => {
    let focusCell = demandItemGrid.gridView.getCurrent();

    props.confirm("PopDemanditem02",demandItemGrid.dataProvider.getJsonRow(focusCell.dataRow));
    props.onClose(false);
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit,onError)} title={props.title} resizeHeight={400} resizeWidth={610}>
      <Box style={{height:"100%"}}>
        <BaseGrid id={`${props.id}_DemandItem02Grid`} items={popupGrid1Items}></BaseGrid>
      </Box>
    </PopupDialog>
  );
}

export default PopDemanditem02;
