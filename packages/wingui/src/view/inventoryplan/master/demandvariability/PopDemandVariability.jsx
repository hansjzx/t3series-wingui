import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box } from "@mui/material";
import { BaseGrid, PopupDialog, useViewStore, zAxios } from "@zionex/wingui-core/src/common/imports";

let popupGrid1Items=[
    {name:"ID", dataType:"text", headerText:"ID", visible:false, editable:false, width:"100" },
    {name:"QUADRANT_NM", dataType:"text", headerText:"QUADRANT_NM", visible:true, editable:false, width:"60" },
    {name:"QUADRANT_DESCRIP", dataType:"text", headerText:"QUADRANT_DESCRIP", visible:true, editable:false, width:"200", lang: true },
    {name:"PRPSAL_SVC_LV_VAL", dataType:"text", headerText:"PRPSAL_SVC_LV_VAL", visible:true, editable:false, width:"100" }
]

function PopDemandVariability(props) {
  const [grid, setGrid]  = useState(null);

  const [viewData,getViewInfo] = useViewStore(state => [state.viewData,state.getViewInfo])
  const { handleSubmit, clearErrors } = useForm({
    defaultValues: { }
  });

  useEffect(() => {
    const grdObjPopup = getViewInfo(vom.active,`${props.id}_PopDemandVariabilityGrid`);
    if(grdObjPopup) {
      if(grdObjPopup.dataProvider) {
        if(grid != grdObjPopup)
        setGrid(grdObjPopup);
      }
    }
  },[viewData]);

  useEffect(() => {
    async function initLoad() {
      if(grid){
        setOptions();
        await popupLoadData();
      }
    }

    initLoad();
  },[grid]);
  
  const setOptions = () => {
    setVisibleProps(grid, true, false, false);
    grid.gridView.setDisplayOptions({
      fitStyle: "evenFill",
    });

    grid.gridView.displayOptions.selectionStyle = "singleRow";

    //dobule click 시 선택
    grid.gridView.onCellDblClicked = function () {
      saveSubmit();
    };
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
    grid.gridView.showToast(progressSpinner + 'Load Data...', true);

      zAxios({
        method: 'post',
        header: { 'content-type': 'application/json' },
        url: 'engine/mp/SRV_UI_IM_09_Q3',
        params: {
          'LOCAT_ID': '008',
          'timeout': 0,
          'PREV_OPERATION_CALL_ID': 'OPC_POP_UI_IM_09_02_WINDOW_01_OPEN',
          'CURRENT_OPERATION_CALL_ID': 'OPC_POP_UI_IM_09_02_WINDOW_01_R_GRID_01_LOAD'
        },
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

  // popup 확인
  const saveSubmit = () => {

    let focusCell = grid.gridView.getCurrent();
    let targetRow = focusCell.dataRow;
    props.confirm(grid.dataProvider.getJsonRow(targetRow));
    props.onClose(false);
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit,onError)} title="POP_UI_IM_09_02" resizeHeight={300} resizeWidth={460}>
      <Box style={{height:"100%"}}>
        <BaseGrid id={`${props.id}_PopDemandVariabilityGrid`} items={popupGrid1Items}></BaseGrid>
      </Box>
    </PopupDialog>
  );
}

export default PopDemandVariability;
