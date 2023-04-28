import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box } from '@mui/material';
import { BaseGrid, useViewStore, zAxios, PopupDialog } from '@zionex/wingui-core/src/common/imports';

let popupGrid1Items = [
  //판매 레벨 ID
  { name: "SALES_LV_ID", dataType: "text", headerText: "SALES_LV_ID", visible: false, editable: false, width: "100" },
  //판매 레벨 코드(filter)
  { name: "SALES_LV_CD", dataType: "text", headerText: "SALES_LV_CD", visible: true, editable: false, width: "100" },
  //품목 레벨 명(filter)
  { name: "SALES_LV_NM", dataType: "text", headerText: "SALES_LV_NM", visible: true, editable: false, width: "100" },
  //상위 판매 레벨 코드
  { name: "PARENT_SALES_LV_CD", dataType: "text", headerText: "PARENT_SALES_LV_CD", visible: true, editable: false, width: "130" },
  //상위 판매 레벨 명
  { name: "PARENT_SALES_LV_NM", dataType: "text", headerText: "PARENT_SALES_LV_NM", visible: true, editable: false, width: "130" },
  //가상 레벨 여부
  { name: "VIRTUAL_YN", dataType: "boolean", headerText: "VIRTUAL_YN", visible: true, editable: false, width: "100" }
];

//판매 레벨 조회
function PopDemandSalesLevel(props) {
  const [demandSalesLevelGrid, setDemandSalesLevelGrid]  = useState(null);

  const [viewData,getViewInfo] = useViewStore(state => [state.viewData,state.getViewInfo]);
  const { handleSubmit, clearErrors } = useForm({
    defaultValues: {}
  });

  useEffect(() => {
    const grdObjPopup = getViewInfo(vom.active, `${props.id}_DemandSalesLevelGrid`);
    if (grdObjPopup) {
      if (grdObjPopup.dataProvider) {
        if (demandSalesLevelGrid != grdObjPopup)
          setDemandSalesLevelGrid(grdObjPopup);
      }
    }

  }, [viewData]);

  useEffect(() => {
    if (demandSalesLevelGrid) {
      popupLoadData();
      setOptions();
    }
  }, [demandSalesLevelGrid]);

  const setOptions = () => {
    const grid = demandSalesLevelGrid;
    setVisibleProps(grid, false, false, false);

    grid.dataProvider.setOptions({ restoreMode: "auto" });
    grid.gridView.setEditOptions({ insertable: false, appendable: false });
    grid.gridView.setDisplayOptions({ fitStyle: 'even' });

    grid.gridView.onCellDblClicked = function (clickData, itemIndex) {
      props.confirm("PopDemandSalesLevel", grid.dataProvider.getJsonRow(itemIndex.dataRow));
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

  const popupLoadData = () => {
    demandSalesLevelGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    let param = new URLSearchParams();
      param.append('DATA_DIV', 'GET_SALES_LV');
      param.append('timeout', 0);
      param.append('CURRENT_OPERATION_CALL_ID', 'OPC_POP_SALES_LV_GRD_LOAD');
      zAxios({
        fromPopup: true,
        method: 'post',
        header: { 'content-type': 'application/json' },
        url: 'engine/mp/SRV_UI_COMM_DATA_Q',
        data: param
      })
      .then(function (res) {
        demandSalesLevelGrid.dataProvider.fillJsonData(res.data.RESULT_DATA);
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
        demandSalesLevelGrid.gridView.hideToast();
      });
  }

  const saveSubmit = () => {
    let focusCell = demandSalesLevelGrid.gridView.getCurrent();

    props.confirm("PopDemandSalesLevel", demandSalesLevelGrid.dataProvider.getJsonRow(focusCell.dataRow));
    props.onClose(false);
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit,onError)} title={props.title} resizeHeight={400} resizeWidth={600}>
      <Box style={{height:"100%"}}>
        <BaseGrid id={`${props.id}_DemandSalesLevelGrid`} items={popupGrid1Items}></BaseGrid>
      </Box>
    </PopupDialog>
  );
}

export default PopDemandSalesLevel;
