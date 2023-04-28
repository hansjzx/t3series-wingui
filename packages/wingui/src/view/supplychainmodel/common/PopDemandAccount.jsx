import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box } from '@mui/material';
import { BaseGrid, useViewStore, zAxios, PopupDialog } from '@zionex/wingui-core/src/common/imports';

let popupGrid1Items = [
  { name: "ACCOUNT_ID", dataType: "text", headerText: "ACCOUNT_ID", visible: false, editable: false, width: "200" },
  { name: "INCOTERMS_ID", dataType: "text", headerText: "INCOTERMS_ID", visible: false, editable: false, width: "200" },
  //거래처 코드
  { name: "ACCOUNT_CD", dataType: "text", headerText: "ACCOUNT_CD", visible: true, editable: false, width: "100" },
  //거래처 명
  { name: "ACCOUNT_NM", dataType: "text", headerText: "ACCOUNT_NM", visible: true, editable: false, width: "100" },
  { name: "CHANNEL_ID", dataType: "text", headerText: "CHANNEL_ID", visible: false, editable: false, width: "200" },
  //채널 명
  { name: "CHANNEL_NM", dataType: "text", headerText: "CHANNEL_NM", visible: true, editable: false, width: "100" },
  //인수조건
  { name: "INCOTERMS", dataType: "text", headerText: "INCOTERMS", visible: true, editable: false, width: "100" },
  //VMI
  { name: "VMI_YN", dataType: "boolean", headerText: "VMI_YN", visible: true, editable: false, width: "100" },
  //직접 운송
  { name: "DIRECT_SHIPPING_YN", dataType: "boolean", headerText: "DIRECT_SHIPPING_YN", visible: true, editable: false, width: "100" },
  //고객 배송 모델링
  { name: "CUST_DELIVY_MODELING_YN", dataType: "boolean", headerText: "ACC_DELIVY_MODELING_YN", visible: true, editable: false, width: "100" },
  //Bill-To
  { name: "BILL_TO_NM", dataType: "text", headerText: "BILL_TO", visible: true, editable: false, width: "100" },
  //Ship-To
  { name: "SHIP_TO_NM", dataType: "text", headerText: "SHIP_TO", visible: false, editable: false, width: "100" },
  //Sold-To
  { name: "SOLD_TO_NM", dataType: "text", headerText: "SOLD_TO", visible: true, editable: false, width: "100" }
];

function PopDemandAccount(props) {
  const [accountDemandGrid, setAccountDemandGrid]  = useState(null);

  const [viewData,getViewInfo] = useViewStore(state => [state.viewData,state.getViewInfo])
  const { handleSubmit, clearErrors } = useForm({
    defaultValues: { }
  });

  useEffect(() => {
    const grdObjPopup = getViewInfo( vom.active,`${props.id}_DemandAccountGrid`);
    if(grdObjPopup) {
      if(grdObjPopup.dataProvider) {
        if(accountDemandGrid != grdObjPopup)
        setAccountDemandGrid(grdObjPopup);
      }
    }
  }, [viewData]);

  useEffect(()=>{
    if(accountDemandGrid){
      popupLoadData();
      setOptions();
    }
  }, [accountDemandGrid]);

  const setOptions = () => {
    const grid = accountDemandGrid;
    setVisibleProps(grid, false, false, false);

    grid.dataProvider.setOptions({ restoreMode: "auto" });
    grid.gridView.setEditOptions({ insertable: false, appendable: false });
    grid.gridView.setDisplayOptions({ fitStyle: 'evenFill' });

    grid.gridView.displayOptions.selectionStyle = 'singleRow';

    grid.gridView.onCellDblClicked = function (clickData, itemIndex) {
      props.confirm("PopDemandAccount", grid.dataProvider.getJsonRow(itemIndex.dataRow));
      props.onClose(false);
    }
  }

  const popupLoadData = () => {
    accountDemandGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    let param = new URLSearchParams();

      param.append('timeout', 0);
      param.append('PREV_OPERATION_CALL_ID', 'OPC_SRH_CPT_ACCOUNT_CD_05_CLICK');
      param.append('CURRENT_OPERATION_CALL_ID', 'OPC_SRH_CPT_ACCOUNT_CD_05_CLICK_SUCCESS_01');

      zAxios({
        fromPopup: true,
        method: 'post',
        header: { 'content-type': 'application/json' },
        url: 'engine/mp/SRV_GET_ACCOUNT_GRID_LIST',
        data: param
      })
      .then(function (res) {
        accountDemandGrid.dataProvider.fillJsonData(res.data.RESULT_DATA);
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
        accountDemandGrid.gridView.hideToast();
      });
  }
  // popup 확인
  const saveSubmit = () => {
    let focusCell = accountDemandGrid.gridView.getCurrent();

    props.confirm("PopDemandAccount", accountDemandGrid.dataProvider.getJsonRow(focusCell.dataRow));
    props.onClose(false);
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

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit,onError)} title={props.title} resizeHeight={400} resizeWidth={950}>
      <Box style={{height:"100%"}}>
        <BaseGrid id={`${props.id}_DemandAccountGrid`} items={popupGrid1Items}></BaseGrid>
      </Box>
    </PopupDialog>
  );
}

export default PopDemandAccount;
