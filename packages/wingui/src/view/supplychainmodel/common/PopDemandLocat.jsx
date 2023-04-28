import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box } from '@mui/material';
import { BaseGrid, useViewStore, zAxios, PopupDialog } from '@zionex/wingui-core/src/common/imports';

let popupGrid1Items = [
  //거점 유형
  { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "130" },
  //거점 레벨
  { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "130" },
  //거점 코드  
  { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "130" },
  //거점 명  
  { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "160" },
  { name: "LOCAT_ID", dataType: "text", headerText: "LOCAT_ID", visible: false, editable: false, width: "130" },
  { name: "LOCAT_MGMT_ID", dataType: "text", headerText: "LOCAT_MGMT_ID", visible: false, editable: false, width: "130" },
  { name: "LOCAT_MST_ID", dataType: "text", headerText: "LOCAT_MST_ID", visible: false, editable: false, width: "130" },
  { name: "LOCAT_TP_ID", dataType: "text", headerText: "LOCAT_TP_ID", visible: false, editable: false, width: "130" }
];

//거점 조회
function PopDemandLocat(props) {
  const [locatDemandGrid, setLocatDemandGrid]  = useState(null);

  const [viewData,getViewInfo] = useViewStore(state => [state.viewData,state.getViewInfo])
  const { handleSubmit, clearErrors } = useForm({
    defaultValues: { }
  });

  useEffect(() => {
    const grdObjPopup = getViewInfo( vom.active,`${props.id}_DemandLocatGrid`);
    if(grdObjPopup) {
      if(grdObjPopup.dataProvider) {
        if(locatDemandGrid != grdObjPopup)
        setLocatDemandGrid(grdObjPopup);
      }
    }
  }, [viewData]);

  useEffect(()=>{
    if(locatDemandGrid){
      popupLoadData();
      setOptions();
    }
  }, [locatDemandGrid]);
  
  const setOptions = () => {
    const grid = locatDemandGrid;

    setVisibleProps(grid, false, false, false);
    grid.dataProvider.setOptions({ restoreMode: 'auto' });
    grid.gridView.setEditOptions({ insertable: false, appendable: false });
    grid.gridView.setDisplayOptions({ fitStyle: 'evenFill' });
  
    grid.gridView.displayOptions.selectionStyle = 'singleRow';

    grid.gridView.onCellDblClicked = function (clickData, itemIndex) {
      props.confirm("PopDemandLocat", locatDemandGrid.dataProvider.getJsonRow(itemIndex.dataRow));
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
    locatDemandGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    let param = new URLSearchParams();
      param.append('timeout', 0);

      if(props.loadPopup === "demandmapping01"){//거점 조회
        param.append('PREV_OPERATION_CALL_ID', 'OPC_SRH_CPT_LOCAT_TP_05_CLICK');
        param.append('CURRENT_OPERATION_CALL_ID', 'OPC_SRH_CPT_LOCAT_TP_05_CLICK_SUCCESS_01'); 
      }
      if(props.loadPopup === "demandmapping02"){//거점 선택
        param.append('PREV_OPERATION_CALL_ID', 'OPC_BUTTON_CLICK_OPEN_WINDOW_01');
        param.append('CURRENT_OPERATION_CALL_ID', 'OPC_BUTTON_CLICK_OPEN_WINDOW_02'); 
      }
      if(props.loadPopup === "PopDemandMappingNew" || props.loadPopup === "PopDemandMappingCreate"){
        param.append('CURRENT_OPERATION_CALL_ID', 'UI_CM_12_POP_SUPPLY_LOCAT_GRD'); 
      }
      else{
        param.append('CURRENT_OPERATION_CALL_ID', 'UI_CM_12_POP_SUPPLY_LOCAT_GRD');  
      }
      zAxios({
        fromPopup: true,
        method: 'post',
        header: { 'content-type': 'application/json' },
        url: 'engine/mp/SRV_GET_LOCAT_GRID_LIST',
        data: param
      })
      .then(function (res) {
        locatDemandGrid.dataProvider.fillJsonData(res.data.RESULT_DATA);
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
        locatDemandGrid.gridView.hideToast();
      });
  }

  const saveSubmit = () => {
    let focusCell = locatDemandGrid.gridView.getCurrent();
    let targetRow = focusCell.dataRow;

    props.confirm("PopDemandLocat", locatDemandGrid.dataProvider.getJsonRow(targetRow));
    props.onClose(false);
  }
  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit,onError)} title={props.title} resizeHeight={400} resizeWidth={630}>
      <Box style={{height:"100%"}}>
        <BaseGrid id={`${props.id}_DemandLocatGrid`} items={popupGrid1Items}></BaseGrid>
      </Box>
    </PopupDialog> 
  );
}

export default PopDemandLocat;
