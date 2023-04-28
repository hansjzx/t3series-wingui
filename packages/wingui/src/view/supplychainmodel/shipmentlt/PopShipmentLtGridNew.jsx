import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Tab, Tabs} from '@mui/material';
import { InputField, BaseGrid, PopupDialog, useViewStore, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';
import { setGridComboList } from "@wingui/view/supplychainmodel/common/common";

import PopLocatTp from '@wingui/view/common/PopLocatTp';

let grid3Items = [
  { name: "CONSUME_LOCAT_MGMT_ID", dataType: "text", headerText: "CONSUME_LOCAT_MGMT_ID", visible: false, editable: false, width: "100" },
  { name: "SUPPLY_LOCAT_MGMT_ID", dataType: "text", headerText: "SUPPLY_LOCAT_MGMT_ID", visible: false, editable: false, width: "100" },
  { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "50" },
  { name: "VEHICL_TP_ID", dataType: "text", headerText: "VEHICL_TP_ID", visible: false, editable: false, width: "100" },
  { name: "VEHICL_TP", dataType: "text", headerText: "VEHICL_TP", visible: true, editable: false, width: "100" },
  { name: "PRIORT", dataType: "number", headerText: "PRIORITY", visible: true, editable: true, width: "80"},
  { name: "TRANSP_COST_CAL_BASE_ID", dataType: "text", headerText: "TRANSP_COST_CAL_BASE_ID", visible: true, editable: true, width: "200", useDropdown: true,  lookupDisplay: true },
  { name: "WEIGHT_UOM_ID", dataType: "text", headerText: "WEIGHT_UOM_ID", visible: true, editable: true, width: "100", useDropdown: true,  lookupDisplay: true },
  { name: "TRANSP_UTPIC", dataType: "number", headerText: "TRANSP_UTPIC", visible: true, editable: true, width: "100" },
  { name: "CURCY_CD_ID", dataType: "text", headerText: "CURCY_CD_ID", visible: true, editable: true, width: "100", useDropdown: true,  lookupDisplay: true }
];

let grid4Items = [
  { name: "CONSUME_LOCAT_MGMT_ID", dataType: "text", headerText: "CONSUME_LOCAT_MGMT_ID", visible: false, editable: false, width: "100" },
  { name: "SUPPLY_LOCAT_MGMT_ID", dataType: "text", headerText: "SUPPLY_LOCAT_MGMT_ID", visible: false, editable: false, width: "100" },
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

function PopShipmentLtGridNew(props) {
  const [username] = useUserStore(state => [state.username]);
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const { handleSubmit, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      consumeLocatMgmtId: "",
      consumeLocatTp: "",
      consumeLocatLv: "",
      consumeLocatCd: "",
      consumeLocatNm: "",
      supplyLocatTp: "",
      supplyLocatLv: "",
      supplyLocatCd: "",
      supplyLocatNm: ""
    }
  });

  const [grid3, setgrid3]  = useState(null);
  const [grid4, setgrid4]  = useState(null);

  const [consumeLocatTpPopupOpen, setPopupConsumeLocatTp] = useState(false);
  const [supplyLocatTpPopupOpen, setPopupSupplyLocatTp] = useState(false);
  const [tabValue, setTabValue] = React.useState('tab1');

  useEffect(() => {
    const grdObj3 = getViewInfo(vom.active, 'grid3');
    if (grdObj3) {
      if (grdObj3.dataProvider) {
        if (grid3 != grdObj3) {
          setgrid3(grdObj3);
        }
      }
    }
    const grdObj4 = getViewInfo(vom.active, 'grid4');
    if (grdObj4) {
      if (grdObj4.dataProvider) {
        if (grid4 != grdObj4) {
          setgrid4(grdObj4);
        }
      }
    }
  }, [viewData]);

  useEffect(() => {
    if (grid3) {
      setOptionsGrid3();
      setGridComboList(grid3,
        'TRANSP_COST_CAL_BASE_ID, WEIGHT_UOM_ID, CURCY_CD_ID',
        'TRANSPORTATION_COST_CALC_TYPE, UOM, CURRENCY'
        );
    }
  }, [grid3]);

  useEffect(() => {
    if (grid4) {
      setOptionsGrid4();
      setGridComboList(grid4,
        'UOM_ID',
        'TIME_UOM'
        );
    }
  }, [grid4]);

  const tabChange = (event, newValue) => {
    setTabValue(newValue);
    if (newValue !== 'tab1') {
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

  const setOptionsGrid3 = () => {
    setVisibleProps(grid3, true, true, false);
    grid3.gridView.setDisplayOptions({ fitStyle: "fill" });
  }

  const setOptionsGrid4 = () => {
    setVisibleProps(grid4, true, true, false);
    grid4.gridView.setDisplayOptions({ fitStyle: "fill" });
  }

  function loadDataGrid(activeTab) {
    let tabUrl = baseURI() + 'engine/mp/'
    let formData = new FormData();

    formData.append('JOB_TYPE', 'N');
    formData.append('BOD_TP_ID', '');
    formData.append('CONSUME_LOC_MGMT_ID', getValues('consumeLocatMgmtId'));
    formData.append('SUPPLY_LOC_MGMT_ID', getValues('supplyLocatMgmtId'));

    if (activeTab == 'tab2') {
      tabUrl += 'SRV_UI_CM_07_POP_Q1';
      grid3.gridView.commit(true);
    } else {
      tabUrl += 'SRV_UI_CM_07_POP_Q2';
      grid4.gridView.commit(true);
    }

    zAxios({
      method: 'post',
      url: tabUrl,
      data: formData,
      fromPopup: true
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          if (activeTab == 'tab2') {
            grid3.setData(res.data.RESULT_DATA);

            if (grid3.dataProvider.getRowCount() == 0) {
              grid3.gridView.setDisplayOptions({ showEmptyMessage: true, emptyMessage: transLangKey('MSG_NO_DATA') });
            }
          } else {
            grid4.setData(res.data.RESULT_DATA);

            if (grid4.dataProvider.getRowCount() == 0) {
              grid4.gridView.setDisplayOptions({ showEmptyMessage: true, emptyMessage: transLangKey('MSG_NO_DATA') });
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

  function saveDataGrid3() {
    grid3.gridView.commit(true);
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let rowData = grid3.dataProvider.getJsonRows();

        let formData = new FormData();
        formData.append('JOB_TYPE', 'N');
        formData.append('all', JSON.stringify(rowData));
        formData.append('USER_ID', username);

        zAxios({
          method: 'post',
          url: baseURI() + 'engine/mp/SRV_UI_CM_07_POP_S1',
          data: formData
        })
          .then(function () {
            saveDataGrid4();
          })
          .catch(function (e) {
            console.error(e);

            props.confirm();
            props.onClose(false);
          });
      }
    });
  }

  function saveDataGrid4() {
    grid4.gridView.commit(true);
    let rowData = grid4.dataProvider.getJsonRows();

    let formData = new FormData();
    formData.append('all', JSON.stringify(rowData));
    formData.append('USER_ID', username);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_CM_07_POP_S2',
      data: formData
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          const rsData = res.data;
          if (rsData.RESULT_SUCCESS) {
            const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_07_POP_S2_P_RT_MSG;
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
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveDataGrid3, onError)} title="POP_UI_CM_07_01" resizeHeight={450} resizeWidth={1000}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={tabChange} indicatorColor="primary">
          <Tab label={transLangKey("FROM_TO_LOCAT")} value="tab1" />
          <Tab label={transLangKey("VEHICL_GROUP")} value="tab2" />
          <Tab label={transLangKey("BOD_LEADTIME")} value="tab3" />
        </Tabs>
      </Box>

      <Box style={{ marginTop: "5px", border: "1px solid #dde1ee", padding: "6px 12px", height: tabValue !== "tab1" ? "100%" : "auto" }} >
        <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", textAlign: "center", display: tabValue === "tab1" ? "block" : "none" }}>
          <Box style={{ height: "100%" }}>
            <InputField type="action" name="consumeLocatTp" label={transLangKey("CONSUME_LOCAT_TP_NM")} onClick={() => { openPopupConsumeLocatTp() }} readonly={true} control={control}>
              <Icon.Search />
            </InputField>
            <InputField name="consumeLocatLv" label={transLangKey("CONSUME_LOCAT_LV")} control={control} disabled={true} />
            <InputField name="consumeLocatCd" label={transLangKey("CONSUME_LOCAT_CD")} control={control} disabled={true} />
            <InputField name="consumeLocatNm" label={transLangKey("CONSUME_LOCAT_NM")} control={control} disabled={true} />

            <hr />

            <InputField type="action" name="supplyLocatTp" label={transLangKey("SUPPLY_LOCAT_TP_NM")} onClick={() => { openPopupSupplyLocatTp() }} readonly={true} control={control}>
              <Icon.Search />
            </InputField>
            <InputField name="supplyLocatLv" label={transLangKey("SUPPLY_LOCAT_LV")} control={control} disabled={true} />
            <InputField name="supplyLocatCd" label={transLangKey("SUPPLY_LOCAT_CD")} control={control} disabled={true} />
            <InputField name="supplyLocatNm" label={transLangKey("SUPPLY_LOCAT_NM")} control={control} disabled={true} />
          </Box>
        </Box>

        <Box sx={{ display: "flex", height: "calc(100%)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "tab2" ? "block" : "none" }}>
          <Box style={{height:"100%"}}>
            <BaseGrid id="grid3" items={grid3Items}></BaseGrid>
          </Box>
        </Box>

        <Box sx={{ display: "flex", height: "calc(100%)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "tab3" ? "block" : "none" }}>
          <Box style={{height:"100%"}}>
            <BaseGrid id="grid4" items={grid4Items}></BaseGrid>
          </Box>
        </Box>

      </Box>
    </PopupDialog>
    {consumeLocatTpPopupOpen && (<PopLocatTp open={consumeLocatTpPopupOpen} onClose={() => { setPopupConsumeLocatTp(false); }} confirm={onSetConsumeLocatTp}></PopLocatTp>)}
    {supplyLocatTpPopupOpen && (<PopLocatTp open={supplyLocatTpPopupOpen} onClose={() => { setPopupSupplyLocatTp(false); }} confirm={onSetSupplyLocatTp}></PopLocatTp>)}
    </>
  );
}
export default PopShipmentLtGridNew;
