import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Tab, Tabs} from '@mui/material';
import { InputField, BaseGrid, PopupDialog, useViewStore, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import PopLocatTp from '@wingui/view/common/PopLocatTp';
import PopCommItem from '../common/PopCommItem';
import { setGridComboList } from "@wingui/view/supplychainmodel/common/common";

let grid2Items = [
  { name: "TRANSP_MGMT_MST_ID", dataType: "text", headerText: "TRANSP_MGMT_MST_ID", visible: false, editable: false, width: "100" },
  { name: "BOD_LT_ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "50" },
  { name: "FIXED_YN", dataType: "boolean", headerText: "FIXED_YN", visible: true, editable: true, width: "50" },
  { name: "VEHICL_TP_ID", dataType: "text", headerText: "VEHICL_VAL", visible: true, editable: true, width: "100", useDropdown: true,  lookupDisplay: true },
  { name: "BOD_PRIORITY", dataType: "number", headerText: "PRIORITY", visible: true, editable: true, width: "80" },
  { name: "LOAD_UOM_ID", dataType: "text", headerText: "LOAD_UOM_ID", visible: true, editable: true, width: "100", useDropdown: true,  lookupDisplay: true },
  { name: "TRANSP_LOTSIZE", dataType: "number", headerText: "TRANSP_LOTSIZE", visible: true, editable: true, width: "100" },
  { name: "UOM_QTY", dataType: "number", headerText: "UOM_QTY", visible: true, editable: false, width: "100" },
  { name: "PACKING_QTY", dataType: "number", headerText: "PACKING_QTY", visible: true, editable: false, width: "100" },
  { name: "PACKING_TP", dataType: "text", headerText: "PACKING_TP", visible: true, editable: false, width: "100" },
  { name: "PALLET_QTY", dataType: "number", headerText: "PALLET_QTY", visible: true, editable: false, width: "100" },
  { name: "PALLET_TP", dataType: "text", headerText: "PALLET_TP", visible: true, editable: false, width: "100" }
];

let grid3Items = [
  { name: "CONSUME_LOCAT_MGMT_ID", dataType: "text", headerText: "CONSUME_LOCAT_MGMT_ID", visible: false, editable: false, width: "100" },
  { name: "SUPPLY_LOCAT_MGMT_ID", dataType: "text", headerText: "SUPPLY_LOCAT_MGMT_ID", visible: false, editable: false, width: "100" },
  { name: "BOD_TP_ID", dataType: "text", headerText: "BOD_TP_ID", visible: false, editable: false, width: "100" },
  { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "50" },
  { name: "VEHICL_TP_ID", dataType: "text", headerText: "VEHICL_TP_ID", visible: false, editable: false, width: "100" },
  { name: "VEHICL_TP", dataType: "text", headerText: "VEHICL_TP", visible: true, editable: false, width: "100" },
  { name: "BOD_LEADTIME_ID", dataType: "text", headerText: "BOD_LEADTIME_ID", visible: false, editable: false, width: "100" },
  { name: "BOD_LEADTIME_PERIOD", dataType: "text", headerText: "BOD_LEADTIME_PERIOD", visible: true, editable: false, width: "150" },
  { name: "LEADTIME_TP", dataType: "text", headerText: "LEADTIME_TP", visible: true, editable: false, width: "100" },
  { name: "BOD_LEADTIME_SEQ", dataType: "number", headerText: "BOD_LEADTIME_SEQ", visible: true, editable: false, width: "100" },
  { name: "BOD_LEAD_TIME", dataType: "number", headerText: "LEADTIME", visible: true, editable: true, width: "100" },
  { name: "UOM_ID", dataType: "text", headerText: "TIME_UOM_NM", visible: true, editable: true, width: "100", useDropdown: true,  lookupDisplay: true }
];

function PopTransportationGridNew(props) {
  const [username] = useUserStore(state => [state.username]);
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const { handleSubmit, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      consumeLocatMgmtId: "",
      consumeLocatTp: "",
      consumeLocatLv: "",
      consumeLocatCd: "",
      consumeLocatNm: "",
      supplyLocatMgmtId: "",
      supplyLocatTp: "",
      supplyLocatLv: "",
      supplyLocatCd: "",
      supplyLocatNm: "",
      itemMstId: "",
      itemCd: "",
      itemNm: "",
      itemTp: ""
    }
  });

  const [grid2, setGrid2]  = useState(null);
  const [grid3, setGrid3]  = useState(null);

  const [consumeLocatTpPopupOpen, setPopupConsumeLocatTp] = useState(false);
  const [supplyLocatTpPopupOpen, setPopupSupplyLocatTp] = useState(false);
  const [itemPopupOpen, setPopupItem] = useState(false);

  const [tabValue, setTabValue] = React.useState('tab1');

  useEffect(() => {
    const grdObj2 = getViewInfo(vom.active, 'grid2');
    if(grdObj2) {
      if(grdObj2.dataProvider) {
        if(grid2 != grdObj2) {
          setGrid2(grdObj2);
        }
      }
    }

    const grdObj3 = getViewInfo(vom.active, 'grid3');
    if(grdObj3) {
      if(grdObj3.dataProvider) {
        if(grid3 != grdObj3) {
          setGrid3(grdObj3);
        }
      }
    }
  }, [viewData]);

  useEffect(() => {
    if(grid2) {
      setOptionsGrid2();
      // setGridCode();
      setGridComboList(grid2,
        'LOAD_UOM_ID, UOM_ID',
        'LOAD_UOM_TYPE, TIME_UOM'
        );
    }
  }, [grid2]);

  useEffect(() => {
    if(grid3) {
      setOptionsGrid3();
      setGridComboList(grid3,
        'UOM_ID',
        'TIME_UOM'
        );
    }
  }, [grid3]);

  const tabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue === 'tab3' || newValue === 'tab4') {
      setComboVehiclTp();
      loadDataGrid(newValue);
    }
  };

  function openPopupConsumeLocatTp() {
    setPopupConsumeLocatTp(true);
  }

  function onSetConsumeLocatTp(gridRow) {
    setValue('consumeLocatMgmtId', gridRow.LOCAT_MGMT_ID);
    setValue('consumeLocatTp', gridRow.LOCAT_TP_NM);
    setValue('consumeLocatLv', gridRow.LOCAT_LV);
    setValue('consumeLocatCd', gridRow.LOCAT_CD);
    setValue('consumeLocatNm', gridRow.LOCAT_NM);
  }

  function openPopupSupplyLocatTp() {
    setPopupSupplyLocatTp(true);
  }

  function onSetSupplyLocatTp(gridRow) {
    setValue("supplyLocatMgmtId", gridRow.LOCAT_MGMT_ID);
    setValue("supplyLocatTp", gridRow.LOCAT_TP_NM);
    setValue("supplyLocatLv", gridRow.LOCAT_LV);
    setValue("supplyLocatCd", gridRow.LOCAT_CD);
    setValue("supplyLocatNm", gridRow.LOCAT_NM);
  }

  function openPopupItem() {
    setPopupItem(true);
  }

  function onSetItemCd(gridRows) {
    let itemMstIdArr = [];
    let itemCdArr = [];
    let itemNmArr = [];
    let itemTpNmArr = [];

    gridRows.forEach(function (row) {
      itemMstIdArr.push(row.ITEM_MST_ID);
      itemCdArr.push(row.ITEM_CD);
      itemNmArr.push(row.ITEM_NM);
      itemTpNmArr.push(row.ITEM_TP_NM);
    });

    setValue("itemMstId", itemMstIdArr.join("|"));
    setValue("itemCd", itemCdArr.join("|"));
    setValue("itemNm", itemNmArr.join("|"));
    setValue("itemTp", itemTpNmArr.join("|"));
  }

  const setOptionsGrid2 = () => {
    setVisibleProps(grid2, true, true, false);
    grid2.gridView.setDisplayOptions({
      fitStyle: "fill"
    });
  }

  const setOptionsGrid3 = () => {
    setVisibleProps(grid3, true, true, false);
    grid3.gridView.setDisplayOptions({
      fitStyle: "fill"
    });
  }

  // const setGridCode = () => {
  //   if (props.data !== undefined) {
  //     let dataArr = props.data;
  //     let rstArr = [];
  //     let bomTpArr = dataArr.filter(code => code.GROUP == "BOD_TP");

  //     for (var i = 0, len = bomTpArr.length; i < len; i++) {
  //       var row = bomTpArr[i];
  //       if (row !== null) {
  //         var listObj = { value: row.ID, label: transLangKey(row.CD_NM) };
  //         rstArr.push(listObj);
  //       }
  //     }

  //     setValue('bodTp', rstArr[0].value);

  //     grid2.gridView.setColumnProperty(
  //       "LOAD_UOM_ID",
  //       "lookupData",
  //       {
  //         value: "ID",
  //         label: "CD_NM",
  //         list: dataArr.filter(code => code.GROUP == "LOAD_UOM_TYPE")
  //       }
  //     );

  //     grid3.gridView.setColumnProperty(
  //       "UOM_ID",
  //       "lookupData",
  //       {
  //         value: "ID",
  //         label: "CD_NM",
  //         list: dataArr.filter(code => code.GROUP == "TIME_UOM")
  //       }
  //     );
  //   }
  // }

  const setComboVehiclTp = () => {
    let param = new URLSearchParams();
    param.append("DATA_DIV", "GET_VEHICL_TP");
    param.append("PARAM1", getValues("supplyLocatMgmtId"));
    param.append("PARAM2", getValues("consumeLocatMgmtId"));
    param.append("PARAM3", getValues("itemMstId"));

    zAxios({
      method: "post",
      header: { "content-type": "application/json" },
      url: baseURI() + "engine/mp/SRV_UI_COMM_DATA_Q",
      data: param
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          grid2.gridView.setColumnProperty(
            "VEHICL_TP_ID",
            "lookupData",
            {
              value: "CD",
              label: "CD_NM",
              list: res.data.RESULT_DATA
            }
          );
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function loadDataGrid(activeTab) {
    let dataArr;
    let tabUrl = baseURI() + 'engine/mp/'
    let param = new URLSearchParams();
    param.append('JOB_TYPE', 'N');
    param.append('CONSUME_LOCAT_MGMT_ID', getValues('consumeLocatMgmtId'));
    param.append('SUPPLY_LOCAT_MGMT_ID', getValues('supplyLocatMgmtId'));

    if (activeTab == 'tab3') {
      param.append('CURRENT_OPERATION_CALL_ID', 'OPC_POP_TAB_01_ACTIVATE_01');
      tabUrl += 'SRV_UI_CM_10_POP_Q2';

      grid2.gridView.commit(true);
    } else if (activeTab === 'tab4'){
      param.append('ITEM_MST_ID', getValues('itemMstId'));
      param.append('CURRENT_OPERATION_CALL_ID', 'OPC_POP_TAB_01_ACTIVATE_02');
      tabUrl += 'SRV_UI_CM_10_POP_Q1';

      grid3.gridView.commit(true);
    }

    zAxios({
      method: 'post',
      url: tabUrl,
      data: param,
      fromPopup: true
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          dataArr = res.data.RESULT_DATA;

          if (activeTab == 'tab3') {
            grid2.dataProvider.fillJsonData(dataArr);

            if (grid2.dataProvider.getRowCount() == 0) {
              grid2.gridView.setDisplayOptions({ showEmptyMessage: true, emptyMessage: transLangKey('MSG_NO_DATA') });
            }
          } else if (activeTab = 'tab4') {
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

  function onError(errors) {
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  function saveDataGrid2() {
    grid2.gridView.commit(true);
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let rowData = grid2.dataProvider.getJsonRows();

        let formData = new FormData();
        formData.append('BOD_TP_ID', '');
        formData.append('CONSUME_LOCAT_MGMT_ID', getValues('consumeLocatMgmtId'));
        formData.append('SUPPLY_LOCAT_MGMT_ID', getValues('supplyLocatMgmtId'));
        formData.append('ITEM_MST_ID', getValues('itemMstId'));
        formData.append('changes', JSON.stringify(rowData));
        formData.append('USER_ID', username);
        formData.append('timeout', 0);
        formData.append('CURRENT_OPERATION_CALL_ID', 'OPC_POP_UI_CM_10_01_WINDOW_01_CPT_99_01_CLICK_01');

        zAxios.post(baseURI() + 'engine/mp/SRV_UI_CM_10_POP_S1', formData)
          .then(function () {
            saveDataGrid3();
          })
          .catch(function (e) {
            console.error(e);

            props.confirm();
            props.onClose(false);
          });
      }
    });
  }

  function saveDataGrid3() {
    grid3.gridView.commit(true);
    let rowData = grid3.dataProvider.getJsonRows();

    let formData = new FormData();
    formData.append('BOD_TP_ID', '');
    formData.append('CONSUME_LOCAT_MGMT_ID', getValues('consumeLocatMgmtId'));
    formData.append('SUPPLY_LOCAT_MGMT_ID', getValues('supplyLocatMgmtId'));
    formData.append('changes', JSON.stringify(rowData));
    formData.append('ITEM_MST_ID', getValues('itemMstId'));
    formData.append('USER_ID', username);
    formData.append('timeout', 0);
    formData.append('PREV_OPERATION_CALL_ID', 'OPC_POP_UI_CM_07_01_WINDOW_01_CPT_99_01_GRD_SAVE');
    formData.append('PREV_OPERATION_RESULT_CODE', 'RESULT_CODE_SUCCESS');
    formData.append('PREV_OPERATION_RESULT_MESSAGE', 'SUCCESS');
    formData.append('PREV_OPERATION_RESULT_SUCCESS', true);
    formData.append('CURRENT_OPERATION_CALL_ID', 'OPC_POP_UI_CM_07_01_WINDOW_01_CPT_99_01_GRD_02_SAVE');

    zAxios.post(baseURI() + 'engine/mp/SRV_UI_CM_10_POP_S2', formData)
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          const rsData = res.data;
          if (rsData.RESULT_SUCCESS) {
            const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_10_POP_S2_P_RT_MSG;
            if (msg === "MSG_0001") {
              props.confirm();
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
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveDataGrid2, onError)} title="POP_UI_CM_10_01" resizeHeight={450} resizeWidth={500}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={tabChange} indicatorColor="primary">
          <Tab label={transLangKey("FROM_TO_LOCAT")} value="tab1" />
          <Tab label={transLangKey("ITEM")} value="tab2" />
          <Tab label={transLangKey("VEHICL_GROUP")} value="tab3" />
          <Tab label={transLangKey("BOD_LEADTIME")} value="tab4" />
        </Tabs>
      </Box>

      <Box style={{ marginTop: "5px", border: "1px solid #dde1ee", width: "100%", height: "100%", padding: "6px 12px" }}>
        <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "tab1" ? "block" : "none" }}>
          <Box style={{ height: "100%" }}>
            <InputField type="action" name="consumeLocatTp" label={transLangKey("CONSUME_LOCAT_TP_NM")} title={transLangKey("SEARCH")} onClick={() => { openPopupConsumeLocatTp() }} readonly={true} control={control}>
              <Icon.Search />
            </InputField>
            <InputField name="consumeLocatLv" label={transLangKey("CONSUME_LOCAT_LV")} control={control} disabled={true} />
            <InputField name="consumeLocatCd" label={transLangKey("CONSUME_LOCAT_CD")} control={control} disabled={true} />
            <InputField name="consumeLocatNm" label={transLangKey("CONSUME_LOCAT_NM")} control={control} disabled={true} />

            <hr />

            <InputField type="action" name="supplyLocatTp" label={transLangKey("SUPPLY_LOCAT_TP_NM")} title={transLangKey("SEARCH")} onClick={() => { openPopupSupplyLocatTp() }} readonly={true} control={control}>
              <Icon.Search />
            </InputField>
            <InputField name="supplyLocatLv" label={transLangKey("SUPPLY_LOCAT_LV")} control={control} disabled={true} />
            <InputField name="supplyLocatCd" label={transLangKey("SUPPLY_LOCAT_CD")} control={control} disabled={true} />
            <InputField name="supplyLocatNm" label={transLangKey("SUPPLY_LOCAT_NM")} control={control} disabled={true} />
          </Box>
        </Box>

        <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "tab2" ? "block" : "none" }}>
          <Box style={{ height: "100%" }}>
            <InputField type="action" name="itemCd" label={transLangKey("ITEM_CD")} title={transLangKey("SEARCH")} onClick={() => { openPopupItem() }} readonly={true} control={control}>
              <Icon.Search />
            </InputField>
            <InputField name='itemMstId' control={control} style={{display: 'none'}} />
            <InputField name="itemNm" label={transLangKey("ITEM_NM")} control={control} disabled={true} />
            <InputField name="itemTp" label={transLangKey("ITEM_TP")} control={control} disabled={true} />
          </Box>
        </Box>

        <Box sx={{ display: "flex", height: "calc(100%)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "tab3" ? "block" : "none" }}>
          <Box style={{height:"100%"}}>
            <BaseGrid id="grid2" items={grid2Items}></BaseGrid>
          </Box>
        </Box>

        <Box sx={{ display: "flex", height: "calc(100%)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "tab4" ? "block" : "none" }}>
          <Box style={{height:"100%"}}>
            <BaseGrid id="grid3" items={grid3Items}></BaseGrid>
          </Box>
        </Box>

      </Box>
    </PopupDialog>
    {consumeLocatTpPopupOpen && (<PopLocatTp open={consumeLocatTpPopupOpen} onClose={() => { setPopupConsumeLocatTp(false); }} confirm={onSetConsumeLocatTp}></PopLocatTp>)}
    {supplyLocatTpPopupOpen && (<PopLocatTp open={supplyLocatTpPopupOpen} onClose={() => { setPopupSupplyLocatTp(false); }} confirm={onSetSupplyLocatTp}></PopLocatTp>)}
    {itemPopupOpen && (<PopCommItem open={itemPopupOpen} onClose={() => { setPopupItem(false); }} confirm={onSetItemCd}></PopCommItem>)}
    </>
  );
}

export default PopTransportationGridNew;
