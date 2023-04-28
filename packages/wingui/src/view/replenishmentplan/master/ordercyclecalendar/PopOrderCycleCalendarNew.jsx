import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Tab, Tabs} from '@mui/material';
import { BaseGrid, InputField, CommonButton, PopupDialog, useUserStore, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';
import { getCodeList } from "@wingui/view/supplychainmodel/common/common";

import PopLocatTp from "@wingui/view/common/PopLocatTp";

const checkBoxStyle = { width: "50px", minWidth: "50px" };

let gridItems = [
  { name: "DD", dataType: "text", headerText: "DAY_OF_MONTH", visible: true, editable: true, width: "100" },
  { name: "MONTHLY_ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "100" }
];

function PopOrderCycleCalendarNew(props) {
  const [username] = useUserStore(state => [state.username]);
  const [tabValue, setTabValue] = React.useState("tab1");

  const [locatTpPopupOpen, setLocatTpPopupOpen] = useState(false);
  const [gridVisible, setGridVisible] = useState(false);

  const [stockMgmtSystemOptions, setStockMgmtSystemOptions] = useState([]);
  const [opertBaseTpOptions, setOpertBaseTpOptions] = useState([]);
  const [poCyclTpOptions, setPoCyclTpOptions] = useState([]);

  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const [grid, setGrid] = useState(null);

  const { handleSubmit, watch, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      locatMgmtId: "",
      locatTp: "",
      locatLv: "",
      locatCd: "",
      locatNm: "",
      calendarDescrip: "",
      stockMgmtSystem: "",
      opertBaseTp: "",
      actvYn: ["Y"],
      poCyclTp: "",
      mon: [""],
      tue: [""],
      wed: [""],
      thur: [""],
      fri: [""],
      sat: [""],
      sun: [""],
      poCyclCalendarId: ""
    }
  });

  const watchPoCyclTp = watch("poCyclTp");

  useEffect(() => {
    if (watchPoCyclTp === 'A96BF0760D5E409489F7F23F783F59E7') {
      setGridVisible(true);
    } else {
      setGridVisible(false);
    }
  }, [watchPoCyclTp]);


  useEffect(() => {
    setStockMgmtSystemOptions(props.data.invMgmtSystemTpOptions);
    setOpertBaseTpOptions(props.data.opertBaseTpOptions);
    setPoCyclTpOptions(props.data.poCyclTpOptions)

    setValue("poCyclTp", props.data.poCyclTpOptions[1].value);
  }, [viewData]);

  useEffect(() => {
    if (grid) {
      loadDataGrid();
    }
  }, [grid]);

  function afterGridNewOrderCycleCalendar(gridObj) {
    setGrid(gridObj);
    setGridOptions(gridObj);
  }

  function setGridOptions(gridObj) {
    setVisibleProps(gridObj, true, false, false);

    gridObj.gridView.setDisplayOptions({
      fitStyle: "fill"
    });
  }

  const tabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  function openLocatTpPopup() {
    setLocatTpPopupOpen(true);
  }

  function onSetLocatTp(gridRow) {
    setValue('locatMgmtId', gridRow.LOCAT_MGMT_ID);
    setValue('locatTp', gridRow.LOCAT_TP_NM);
    setValue('locatLv', gridRow.LOCAT_LV);
    setValue('locatCd', gridRow.LOCAT_CD);
    setValue('locatNm', gridRow.LOCAT_NM);
  }

  function loadDataGrid() {
    let param = new FormData();

    param.append("PO_CYCL_CALENDAR_ID", '');

    zAxios({
      method: "post",
      url: baseURI() + "engine/mp/SRV_UI_IM_06_Q3",
      data: param,
      fromPopup: true
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        grid.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function savePoCalendar() {
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), async function (answer) {
      if (answer) {
        let data = await getCodeList('NEW_ID');
        let param = new FormData();

        param.append('WRK_TYPE', 'SAVE');
        param.append('TYPE', 'PO_CALENDAR');
        param.append('ID', data[0].ID)
        param.append('LOCAT_MGMT_ID', getValues('locatMgmtId'));
        param.append('DESCRIP', getValues('calendarDescrip'));
        param.append('INV_MGMT_SYSTEM_TP', getValues('stockMgmtSystem'));
        param.append('OPERT_BASE_TP', getValues('opertBaseTp'));
        param.append('PO_CYCL_TP_CD', gridVisible ? "MONTHLY" : "DAILY");
        param.append('ACTV_YN', getValues('actvYn').join("") === 'Y' ? true : false);
        param.append('USER_ID', username);

        zAxios({
          method: 'post',
          url: baseURI() + 'engine/mp/SRV_UI_IM_06_S1',
          data: param,
          fromPopup: true
        })
        .then(function (res) {
          if (res.status === gHttpStatus.SUCCESS) {
            saveData(param);
          }
        })
        .catch(function (err) {
          console.log(err);
        });
      }
    });
  }

  function saveData(param) {
    grid.gridView.commit(true);

    let changeRowData = [];
    let changes = [];

    changes = changes.concat(
      grid.dataProvider.getAllStateRows().created,
      grid.dataProvider.getAllStateRows().updated,
      grid.dataProvider.getAllStateRows().deleted,
      grid.dataProvider.getAllStateRows().createAndDeleted
    );

    changes.forEach(function (row) {
      changeRowData.push(grid.dataProvider.getJsonRow(row));
    });

    param.set('TYPE', gridVisible ? "MONTHLY" : "DAILY");
    param.append('MON_YN', getValues('mon').join("") === 'Y' ? true : false);
    param.append('TUE_YN', getValues('tue').join("") === 'Y' ? true : false);
    param.append('WED_YN', getValues('wed').join("") === 'Y' ? true : false);
    param.append('THU_YN', getValues('thur').join("") === 'Y' ? true : false);
    param.append('FRI_YN', getValues('fri').join("") === 'Y' ? true : false);
    param.append('SAT_YN', getValues('sat').join("") === 'Y' ? true : false);
    param.append('SUN_YN', getValues('sun').join("") === 'Y' ? true : false);
    param.append('changes', JSON.stringify(changeRowData));

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_IM_06_S1',
      data: param,
      fromPopup: true
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_IM_06_S1_P_RT_MSG), { close: false });
      } else {
        showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
      }

      props.confirm();
      props.onClose(false);
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

  return (
    <>
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(savePoCalendar, onError)} title="POP_UI_CM_05_01" resizeHeight={500} resizeWidth={500}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={tabChange} indicatorColor="primary">
          <Tab label={transLangKey("COMM")} value="tab1" />
          <Tab label={transLangKey("PO_CYCL_CALENDAR")} value="tab2" />
        </Tabs>
      </Box>

      <Box style={{ marginTop: "5px", border: "1px solid #dde1ee", width: "100%", height: "100%", padding: "6px 12px" }}>
        <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", display: tabValue === "tab1" ? "block" : "none" }}>
          <Box style={{ height: "100%" }}>
            <InputField name="locatMgmtId" control={control} style={{display: "none"}} />
            <InputField type="action" name="locatTp" label={transLangKey("LOCAT_NM")} control={control}>
              <CommonButton title={transLangKey("SEARCH")} onClick={() => { openLocatTpPopup() }}><Icon.Search /></CommonButton>
            </InputField>
            <InputField name="locatLv" label={transLangKey("LOCAT_LV")} control={control} disabled={true} />
            <InputField name="locatCd" label={transLangKey("LOCAT_CD")} control={control} disabled={true} />
            <InputField name="locatNm" label={transLangKey("LOCAT_NM")} control={control} disabled={true} />

            <InputField name="calendarDescrip" label={transLangKey("CALENDAR_DESCRIP")} control={control} />
            <InputField type="select" name="stockMgmtSystem" label={transLangKey("STOCK_MGMT_SYSTEM")} control={control} options={stockMgmtSystemOptions} />

            <InputField type="select" name="opertBaseTp" label={transLangKey("OPERT_BASE_TP")} control={control} options={opertBaseTpOptions} />
            <InputField type="check" name="actvYn" control={control} options={[{ label: transLangKey("ACTV_YN"), value: "Y" }]} />
          </Box>
        </Box>
        <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "tab2" ? "block" : "none" }}>
          <Box style={{ height: "100%" }}>
            <Box style={{ width: "300px" }}>
              <InputField type="select" name="poCyclTp" label={transLangKey("PO_CYCL_TP")} control={control} options={poCyclTpOptions} />
            </Box>
            {gridVisible && (<Box style={{ height: "100%", marginTop: "10px" }}>
              <BaseGrid id={`${props.id}_OrderCycleCalendarNewGrid`} items={gridItems} afterGridCreate={afterGridNewOrderCycleCalendar} />
            </Box>)}
            {!gridVisible && (<Box>
              <InputField type="check" name="mon" control={control} style={checkBoxStyle} options={[{ label: transLangKey("MON"), value: "Y" }]} />
              <InputField type="check" name="tue" control={control} style={checkBoxStyle} options={[{ label: transLangKey("TUE"), value: "Y" }]} />
              <InputField type="check" name="wed" control={control} style={checkBoxStyle} options={[{ label: transLangKey("WED"), value: "Y" }]} />
              <InputField type="check" name="thur" control={control} style={checkBoxStyle} options={[{ label: transLangKey("THUR"), value: "Y" }]} />
              <InputField type="check" name="fri" control={control} style={checkBoxStyle} options={[{ label: transLangKey("FRI"), value: "Y" }]} />
              <InputField type="check" name="sat" control={control} style={checkBoxStyle} options={[{ label: transLangKey("SAT"), value: "Y" }]} />
              <InputField type="check" name="sun" control={control} style={checkBoxStyle} options={[{ label: transLangKey("SUN"), value: "Y" }]} />
            </Box>)}
          </Box>
        </Box>
      </Box>
    </PopupDialog>
    {locatTpPopupOpen && (<PopLocatTp open={locatTpPopupOpen} onClose={() => { setLocatTpPopupOpen(false); }} confirm={onSetLocatTp}></PopLocatTp>)}
    </>
  );
}

export default PopOrderCycleCalendarNew;
