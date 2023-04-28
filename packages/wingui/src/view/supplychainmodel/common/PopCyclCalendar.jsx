import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box } from "@mui/material";
import { BaseGrid, useViewStore, zAxios, useUserStore, PopupDialog } from "@zionex/wingui-core/src/common/imports";

let popupGrid1Items = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: 150 },
  { name: "CALENDAR_ID", dataType: "text", headerText: "CALENDAR_ID", visible: true, editable: false, width: 150 },
  { name: "DESCRIP", dataType: "text", headerText: "DESCRIP", visible: true, editable: false, width: 200 },
  {
    name: "STOCK_MGMT_SYSTEM", dataType: "group", orientation: "horizontal", headerText: "STOCK_MGMT_SYSTEM", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "INV_MGMT_SYSTEM_TP", dataType: "text", headerText: "INV_MGMT_SYSTEM_TP", visible: false, editable: false, width: 150 },
      { name: "INV_MGMT_SYSTEM_TP_NM", dataType: "text", headerText: "STOCK_MGMT_SYSTEM_TP", visible: true, editable: false, width: 150 },
      { name: "OPERT_BASE_TP", dataType: "text", headerText: "OPERT_BASE_TP", visible: false, editable: false, width: 150 },
      { name: "OPERT_BASE_TP_NM", dataType: "text", headerText: "OPERT_BASE_TP", visible: true, editable: false, width: 150 },
    ]
  },
  { name: "PO_CYCL_TP_CD", dataType: "text", headerText: "PO_CYCL_TP", visible: true, editable: false, width: 150 },
  { name: "PO_CYCL_TP", dataType: "text", headerText: "PO_CYCL_TP", visible: false, editable: false, width: 150 },
  { name: "PO_CYCL_TP_NM", dataType: "text", headerText: "PO_CYCL_TP", visible: false, editable: false, width: 150 }
];

function PopCyclCalendar(props) {
  const [grid, setGrid]  = useState(null);
  const [username] = useUserStore(state => [state.username]);

  const [viewData,getViewInfo] = useViewStore(state => [state.viewData,state.getViewInfo])
  const { handleSubmit, clearErrors } = useForm({
    defaultValues: {}
  });

  useEffect(() => {
    const grdObjPopup = getViewInfo( vom.active,`${props.id}_CyclCalendarGrid`);
    if(grdObjPopup) {
      if(grdObjPopup.dataProvider) {
        if(grid != grdObjPopup)
        setGrid(grdObjPopup);
      }
    }
  }, [viewData]);

  useEffect(() => {
    async function initLoad() {
      if(grid){
        setOptions();
        await popupLoadData();
      }
    }
    initLoad();
  }, [grid]);
  
  const setOptions = () => {
    setVisibleProps(grid, true, false, false);
    grid.gridView.setDisplayOptions({
      fitStyle: "evenFill",
    });

    grid.gridView.displayOptions.selectionStyle = "singleRow";

    //grid merge
    grid.gridView.setColumnProperty("PEGGING_GRP", "mergeRule", {
      criteria: "values[ 'PEGGING_GRP' ]"
    });

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
        fromPopup: true,
        method: 'post',
        header: { 'content-type': 'application/json' },
        url: 'engine/mp/SRV_SP_UI_IM_26_Q4',
        params: {
          'LOCAT_CD': '',
          'USER_ID': username,
        }
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
    props.confirm(grid.gridView.getValues(targetRow));
    props.onClose(false);
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit,onError)} title="PO_CYCL_CALENDAR" resizeHeight={600} resizeWidth={800}>
      <Box style={{height:"100%"}}>
        <BaseGrid id={`${props.id}_CyclCalendarGrid`} items={popupGrid1Items}></BaseGrid>
      </Box>
    </PopupDialog>
  );
}

export default PopCyclCalendar;
