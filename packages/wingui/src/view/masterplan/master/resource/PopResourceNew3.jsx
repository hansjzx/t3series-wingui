import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Tab, Tabs} from '@mui/material';
import { BaseGrid, InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import PopLocatTp from '@wingui/view/common/PopLocatTp';
import PopPopItem from './PopPopItem';
import PopPopRoute from './PopPopRoute';

const oneRowStyle = { marginRight: "50px" };

let popupGridItems = [
  { name: 'SIMLT_RES_GRP_ID', dataType: 'text', headerText: 'SIMLT_RES_GRP_ID', visible: false, editable: false, width: '100' },
  { name: 'SIMLT_RES_ID', dataType: 'text', headerText: 'SIMLT_RES_ID', visible: false, editable: false, width: '100' },
  { name: 'RES_DTL_ID', dataType: 'text', headerText: 'RES_DTL_ID', visible: false, editable: false, width: '100' },
  { name: 'RES_CD', dataType: 'text', headerText: 'RES_CD', visible: true, editable: false, width: '60' },
  { name: 'RES_DESCRIP', dataType: 'text', headerText: 'RES_DESCRIP', visible: true, editable: false, width: '100' },
  { name: 'SELECT_YN', dataType: 'boolean', headerText: 'SELECT_YN', visible: true, editable: true, width: '20' }
];

function PopResourceNew3(props) {
  const [username] = useUserStore(state => [state.username]);

  const { handleSubmit, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      locatMgmtId: '',
      locatId: '',
      locatTpNm: '',
      locatLv: '',
      locatCd: '',
      locatNm: '',
      itemMstId: '',
      itemCd: '',
      itemNm: '',
      itemTp: '',
      routeId: '',
      routeCd: '',
      routeDescrip: '',
      simltResId: '',
      simltResTpId: '',
      actvYn: ['']
    }
  });

  const [grid, setGrid] = useState(null);

  const [simltResTpIdOption, setSimltResTpIdOptionOption] = useState([]);

  const [locatTpPopupOpen, setPopLocatTp] = useState(false);
  const [itemPopupOpen, setPopItem] = useState(false);
  const [routePopupOpen, setPopRoute] = useState(false);
  const [popupData, setPopupData] = useState([]);

  function afterGridCreate(gridObj) {
    setGrid(gridObj);
  }

  useEffect(() => {
    if (props.data !== null) {
      let rstArr = [];

      for (var i = 0, len = props.data.simltResTpId.length; i < len; i++) {
        var row = props.data.simltResTpId[i];
        if (row !== null) {
          var listObj = { value: row.ID, label: transLangKey(row.CD_NM) };
          rstArr.push(listObj);
        }
      }

      setValue("simltResTpId", rstArr[0].value);
      setSimltResTpIdOptionOption(rstArr);
    }
    
    if (grid) {
      setOptions();
    }
  }, [grid]);

  function setOptions() {
    setVisibleProps(grid, true, false, false);
    grid.gridView.setDisplayOptions({ fitStyle: 'fill' });
  }

  function onError(errors) {
    if (typeof errors !== 'undefined' && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  function openPopupLocatTp() {
    setPopLocatTp(true);
  }

  function onSetLocat(gridRow) {
    setValue("locatMgmtId", gridRow.LOCAT_MGMT_ID);
    setValue("locatId", gridRow.LOCAT_ID);
    setValue("locatTpNm", gridRow.LOCAT_TP_NM);
    setValue("locatLv", gridRow.LOCAT_LV);
    setValue("locatCd", gridRow.LOCAT_CD);
    setValue("locatNm", gridRow.LOCAT_NM);
  }

  function openPopupItem() {
    setPopItem(true);
  }

  function onSetItem(gridRow) {
    setValue("itemMstId", gridRow.ITEM_MST_ID);
    setValue("itemCd", gridRow.ITEM_CD);
    setValue("itemNm", gridRow.ITEM_NM);
    setValue("itemTp", gridRow.ITEM_TP);

    popupLoadData();
  }

  function openPopupRoute() {
    if (getValues('locatMgmtId') || getValues('itemMstId')) {
      setPopupData({
        locatMgmtId: getValues('locatMgmtId'),
        itemMstId: getValues('itemMstId')
      });

      setPopRoute(true);
    } else {
      showMessage('Action Condition Fail', transLangKey('MSG_5153'), { close: false });
    }
  }

  function onSetRoute(gridRow) {
    setValue("routeId", gridRow.ID);
    setValue("routeCd", gridRow.ROUTE_CD);
    setValue("routeDescrip", gridRow.ROUTE_DESCRIP);
  }

  function popupLoadData() {
    let formData = new FormData();

    formData.append('TYPE', 'N');
    formData.append('LOC_MGMT_ID', getValues('locatMgmtId'));
    formData.append('ITEM_MST_ID', getValues('itemMstId'));
    formData.append('SIMLT_RES_ID', getValues('simltResTpId'));

    zAxios({
      method: 'post',
      url: 'engine/mp/SRV_UI_MP_06_POP_Q4',
      data: formData,
      fromPopup: true
    })
      .then(function (res) {
        grid.setData(res.data.RESULT_DATA);
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function saveData() {
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
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
    
        let formData = new FormData();

        formData.append('LOC_MGMT_ID', getValues('locatMgmtId'));
        formData.append('ITEM_MST_ID', getValues('itemMstId'));
        formData.append('ROUTE_ID', getValues('routeId'));
        formData.append('SIMLT_RES_TP_ID', getValues('simltResTpId'));
        formData.append('ACTV_YN', getValues('actvYn').join('') === 'Y' ? true : false);
        formData.append('changes', JSON.stringify(changeRowData));
        formData.append('USER_ID', username);

        zAxios({
          method: 'post',
          url: baseURI() + 'engine/mp/SRV_UI_MP_06_POP_S1',
          data: formData,
        })
          .then(function (res) {
            const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_06_POP_S1_P_RT_MSG;
            showMessage(transLangKey('MSG_CONFIRM'), transLangKey(msg));

            props.confirm();
            props.onClose(false);
          })
          .catch(function (e) {
            console.error(e);

            props.confirm();
            props.onClose(false);
          });
      }
    });
  }

  return (
    <>
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveData, onError)} title="POP_UI_MP_06_04" resizeHeight={800} resizeWidth={500}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={"tab1"} indicatorColor="primary">
          <Tab label={transLangKey("COMM")} value="tab1" />
        </Tabs>
      </Box>

      <Box style={{ marginTop: "5px", border: "1px solid #dde1ee", width: "100%", height: "100%", padding: "6px 12px" }}>
        <Box sx={{ display: "flex", height: "100%", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: "block" }}>
          <InputField type="action" name="locatTpNm" label={transLangKey("LOCAT_TP_NM")} title={transLangKey("SEARCH")} onClick={() => { openPopupLocatTp() }} control={control}>
            <Icon.Search />
          </InputField>
          <InputField name="locatLv" label={transLangKey("LOCAT_LV")} control={control} disabled={true} />
          <InputField name="locatCd" label={transLangKey("LOCAT_CD")} control={control} disabled={true} />
          <InputField name="locatNm" label={transLangKey("LOCAT_NM")} control={control} disabled={true} />

          <InputField type="action" name="itemCd" label={transLangKey("ITEM_CD")} title={transLangKey("SEARCH")} onClick={() => { openPopupItem() }} control={control}>
            <Icon.Search />
          </InputField>
          <InputField name="itemNm" label={transLangKey("ITEM_NM")} control={control} disabled={true} />
          <InputField name="itemTp" label={transLangKey("ITEM_TP")} control={control} disabled={true} style={oneRowStyle} />

          <InputField type="action" name="routeCd" label={transLangKey("ROUTE_CD")} title={transLangKey("SEARCH")} onClick={() => { openPopupRoute() }} control={control}>
            <Icon.Search />
          </InputField>
          <InputField name="routeDescrip" label={transLangKey("ROUTE_DESCRIP")} control={control} disabled={true} />

          <InputField name="simltResId" label={transLangKey("SIMLT_RES_GRP")} control={control} disabled={true} />
          <InputField type="select" name="simltResTpId" label={transLangKey("SIMLT_RES_TP")} control={control} options={simltResTpIdOption} />

          <InputField type="check" name="actvYn" control={control} options={[{ label: transLangKey("ACTV_YN"), value: "Y" }]} />

          <Box style={{ height: "35%" }}>
            <BaseGrid id={`${props.id}_PopResourceNew3Grid`} items={popupGridItems} afterGridCreate={afterGridCreate} />
          </Box>

        </Box>
      </Box>
    </PopupDialog>
    {locatTpPopupOpen && (<PopLocatTp open={locatTpPopupOpen} onClose={() => { setPopLocatTp(false); }} confirm={onSetLocat}></PopLocatTp>)}
    {itemPopupOpen && (<PopPopItem open={itemPopupOpen} onClose={() => { setPopItem(false); }} confirm={onSetItem} data={getValues("locatId")}></PopPopItem>)}
    {routePopupOpen && (<PopPopRoute open={routePopupOpen} onClose={() => { setPopRoute(false); }} confirm={onSetRoute} data={popupData}></PopPopRoute>)}
    </>
  );
}

export default PopResourceNew3;
