import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box, Tab, Tabs } from '@mui/material';
import { InputField, BaseGrid, PopupDialog, useViewStore, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';
import { setGridComboList } from "@wingui/view/supplychainmodel/common/common";

let grid5Items=[
 { name: "GLOBAL_PLAN_BOM_ID", dataType: "text", headerText: "GLOBAL_PLAN_BOM_ID", visible: false, editable: false, width: "150" },
 { name: "CONSUME_LOCAT_ITEM_ID", dataType: "text", headerText: "CONSUME_LOCAT_ITEM_ID", visible: false, editable: false, width: "150" },
 { name: "ITEM_MST_ID", dataType: "text", headerText: "ITEM_MST_ID", visible: false, editable: false, width: "150" },
 { name: "SUPPLY_LOCAT_ITEM_ID", dataType: "text", headerText: "SUPPLY_LOCAT_ITEM_ID", visible: false, editable: false, width: "150" },
 { name: "SRCING_POLICY_ID", dataType: "text", headerText: "SRCING_POLICY", visible: true, editable: false, width: "120", useDropdown: true, lookupDisplay: true },
 { name: "SRCING_RULE", dataType: "number", headerText: "SRCING_RULE", visible: true, editable: true, width: "80", numberFormat: '#,###' },
 { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: false, width: "60" },
 { name: "FIXED_YN", dataType: "boolean", headerText: "FIXED_YN", visible: true, editable: false, width: "60" },
 { name: "LOCAT_TP", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "80" },
 { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "80" },
 { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "80" },
 { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "120" }
]

const wrapStyle = {width: "360px"};
const labelStyle = {width: "200px", maxWidth: "200px"};

function PopPlanningBomGrid2New(props) {
  const [username] = useUserStore(state => [state.username]);
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo])
  const { handleSubmit, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: { }
  });

  const [grid5, setgrid5]  = useState(null);
  const [locDtlId, setLocDtlId] = useState('');
  const [itemMstId, setItemMstId] = useState('');
  const [tabValue, setTabValue] = React.useState('tab1');
  
  useEffect(() => {
    if (props.data !== null) {
      //tab1
      setValue('bodTpId', '');
      setValue('consumeLocatTp', props.data.CONSUME_LOCAT_TP);
      setValue('consumeLocatLv', props.data.CONSUME_LOCAT_LV);
      setValue('consumeLocatCd', props.data.CONSUME_LOCAT_CD);
      setValue('consumeLocatNm', props.data.CONSUME_LOCAT_NM);
      setLocDtlId(props.data.CONSUME_LOCAT_ID);

      //tab2
      setValue('itemCd', props.data.SUPPLY_ITEM_CD);
      setValue('itemNm', props.data.SUPPLY_ITEM_NM);
      setValue('itemTp', props.data.SUPPLY_ITEM_TP);
      setValue('itemUomNm', props.data.SUPPLY_LOCAT_ITEM_UOM);
      setItemMstId(props.data.ITEM_MST_ID);
    }

    setValue('strtDttm', '');
    setValue('endDttm', '');
  }, [props.data]);


  // 그리드 Object 초기화
  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, 'grid5');
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        if (grid5 != grdObj1)
          setgrid5(grdObj1);
      }
    }
  }, [viewData]);

  useEffect(() => {
    if (grid5) {
      setOptionsGrid();
      setGridComboList(grid5,
        'SRCING_POLICY_ID',
        'SOURCING_RULE'
        );
      loadDataGrid();
    }
  }, [grid5]);

  const tabChange = (event, newValue) => {
      setTabValue(newValue);
  };

  const setOptionsGrid = () => {
    setVisibleProps(grid5, true, true, false);
    // grid5.gridView.setHeader({height: 50 });
    grid5.gridView.setDisplayOptions({
      fitStyle: "fill"
    });

    //click
    grid5.gridView.onCellButtonClicked = function (grid, clickData, column) {
      if (column.fieldName === "LOCAT_CD") {
        setDialogOpen3(true);
      }
    }
  }

  function onError(errors, e) {
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }
  
  function loadDataGrid() {
    let dataArr;
    let tabUrl;
    let param = new URLSearchParams();
        param.append('BOD_TP_ID', '');
        param.append('LOC_DTL_ID', locDtlId);
        param.append('ITEM_MST_ID', itemMstId);
        param.append('timeout', 0);
        param.append('PREV_OPERATION_CALL_ID', 'OPC_UI_CM_11_RST_CPT_01_CELL_DOUBLE_CLICK_01');
        param.append('CURRENT_OPERATION_CALL_ID', 'OPC_POP_UI_CM_11_07_WINDOW_01_SETDATA_MODIFY_POPUP_24');

    tabUrl = baseURI() + 'engine/mp/SRV_UI_CM_11_POP_Q1';

    zAxios({
      fromPopup: true,
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: tabUrl,
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        dataArr = [];
        dataArr = res.data.RESULT_DATA;

        if (tabValue == "tab1") {
          grid5.dataProvider.fillJsonData(dataArr);

          if (grid5.dataProvider.getRowCount() == 0) {
            grid5.gridView.setDisplayOptions({ showEmptyMessage: true, emptyMessage: transLangKey('MSG_NO_DATA') });
          }
        } else {
          grid3.dataProvider.fillJsonData(dataArr);

          if (grid3.dataProvider.getRowCount() == 0) {
            grid3.gridView.setDisplayOptions({ showEmptyMessage: true, emptyMessage: transLangKey('MSG_NO_DATA') });
          }
        }
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function saveSubmit() {
    grid5.gridView.commit(true);
    let changeRowData = [];

    for (var i = 0; i < grid5.dataProvider.getRowCount(); i++) {
      changeRowData.push(grid5.dataProvider.getJsonRow(i));
    }

    let formData = new FormData();
        formData.append('WRK_TYPE', 'SAVE');

    if (getValues('strtDttm') != '') {
      formData.append('STRT_DTTM', new Date(getValues('strtDttm')).format('yyyy-MM-ddT00:00:00'));
    }

    if (getValues('endDttm') != '') {
      formData.append('END_DTTM', new Date(getValues('endDttm')).format('yyyy-MM-ddT00:00:00'));
    }

    formData.append('changes', JSON.stringify(changeRowData));
    formData.append('USER_ID', username);
    formData.append('timeout', 0);
    formData.append('CURRENT_OPERATION_CALL_ID', 'OPC_POP_UI_CM_11_07_WINDOW_01_CPT_99_01_CLICK_01');

    zAxios.post(baseURI() + 'engine/mp/SRV_UI_CM_11_S3', formData)
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        const rsData = res.data;
        if (rsData.RESULT_SUCCESS) {
          const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_11_S3_P_RT_MSG;
          if (msg === "MSG_0001") {
            props.confirm(grid5.gridView.getValues(0));
            props.onClose(false);
          } else {
            showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg));
          }
        } else {
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
        }
      }
    })
    .catch(function (e) {
      console.error(e);
    });
  }

  return (
    <>
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="POP_UI_CM_11_07" resizeHeight={600} resizeWidth={400}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={tabChange} indicatorColor="primary">
          <Tab label={transLangKey('CONSUME_LOCAT')} value="tab1" />
          <Tab label={transLangKey('ITEM')} value="tab2" />
          <Tab label={transLangKey('SUPPLY_LOCAT')} value="tab3" />
        </Tabs>
      </Box>

      <Box style={{ marginTop: "3px", width: "100%", height: "100%" }}>
        <Box sx={{ display: 'flex', height: 'calc(100% - 50px)', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: tabValue === "tab1" ? "block" : "none" }}>
          <Box style={{height:"100%"}}>
            <InputField name="consumeLocatTp" label={transLangKey("LOCAT_TP_NM")} control={control} readonly={true} wrapStyle={wrapStyle} labelStyle={labelStyle} />
            <InputField name="consumeLocatLv" label={transLangKey("CONSUME_LOCAT_LV")} control={control} readonly={true} wrapStyle={wrapStyle} labelStyle={labelStyle} />
            <InputField name="consumeLocatCd" label={transLangKey("CONSUME_LOCAT_CD")} control={control} readonly={true} wrapStyle={wrapStyle} labelStyle={labelStyle} />
            <InputField name="consumeLocatNm" label={transLangKey("CONSUME_LOCAT_NM")} control={control} readonly={true} wrapStyle={wrapStyle} labelStyle={labelStyle} />
            <InputField type="datetime" name="strtDttm" label={transLangKey("STRT_DTTM")} dateformat="yyyy-MM-dd" control={control} wrapStyle={wrapStyle} labelStyle={labelStyle} />
            <InputField type="datetime" name="endDttm" label={transLangKey("END_DTTM")} dateformat="yyyy-MM-dd" control={control} wrapStyle={wrapStyle} labelStyle={labelStyle} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', height: 'calc(100% - 50px)', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: tabValue === "tab2" ? "block" : "none" }}>
          <Box style={{height:"100%"}}>
           <InputField name="itemCd" label={transLangKey("ITEM_CD")} control={control} readonly={true} wrapStyle={wrapStyle} labelStyle={labelStyle} />
            <InputField name="itemNm" label={transLangKey("ITEM_NM")} control={control} readonly={true} wrapStyle={wrapStyle} labelStyle={labelStyle} />
            <InputField name="itemTp" label={transLangKey("ITEM_TP")} control={control} readonly={true} wrapStyle={wrapStyle} labelStyle={labelStyle} />
            <InputField name="itemUomNm" label={transLangKey("ITEM_UOM_NM")} control={control} readonly={true} wrapStyle={wrapStyle} labelStyle={labelStyle} />
          </Box>
        </Box>
        <Box sx={{ display: 'flex', height: 'calc(100% - 50px)', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: tabValue === "tab3" ? "block" : "none" }}>
          <Box style={{height:"100%"}}>
            <BaseGrid id="grid5" items={grid5Items}></BaseGrid>
          </Box>
        </Box>
      </Box>
    </PopupDialog>
    </>
  );
}
export default PopPlanningBomGrid2New;
