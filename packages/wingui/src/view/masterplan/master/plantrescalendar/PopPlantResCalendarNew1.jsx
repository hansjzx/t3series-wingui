import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Tab, Tabs } from '@mui/material';
import { InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';
import { getCodeList } from "@wingui/view/supplychainmodel/common/common";

import PopPopLocat from '@wingui/view/supplychainmodel/sitewarehouse/PopPopLocat';
import PopPopResource from './PopPopResource';

const oneRowStyle = { marginRight: '50px' };

function PopPlantResCalendarNew1(props) {
  const [username] = useUserStore(state => [state.username]);
  const [tabValue, setTabValue] = React.useState('tab1');

  const { handleSubmit, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      // tab1
      locMgmtId: '',
      locatTp: '',
      locatLv: '',
      locatCd: '',
      locatNm: '',

      resDtlId: '',
      resCd: '',
      resDescrip: '',
      fixedYn: [''],
      actvYn: [''],

      // tab2
      calendarId: '',
      calendarDescrip: '',
      prductConstYn: [''],
      strtDate: new Date(),
      endDate: new Date(),
      cyclTp: ''
    }
  });

  const [locatTpPopupOpen, setPopLocatTp] = useState(false);
  const [resourcePopupOpen, setPopResource] = useState(false);

  const [cyclTpOption, setCyclTpOption] = useState([]);

  useEffect (() => {
    if (props.open) {
      setCombobox();
    }
  }, []);

  const tabChange = (event, newValue) => {
    setTabValue(newValue);
  }

  function openPopupLocatTp() {
    setPopLocatTp(true);
  }

  function onSetLocat(gridRow) {
    setValue('locMgmtId', gridRow.LOC_MGMT_ID);
    setValue('locatTp', gridRow.LOCAT_TP);
    setValue('locatLv', gridRow.LOCAT_LV);
    setValue('locatCd', gridRow.LOCAT_CD);
    setValue('locatNm', gridRow.LOCAT_NM);
  }
  function openPopupResource() {
    setPopResource(true);
  }

  function onSetResource(gridRow) {
    setValue('resDtlId', gridRow.RES_MGMT_DTL_ID);
    setValue('resCd', gridRow.RES_CD);
    setValue('resDescrip', gridRow.RES_DESCRIP);
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

  async function setCombobox() {
    let dataArr = await getCodeList('CALENDAR_CYCL_TP');
    let filteringArr = dataArr.filter(code => code.GROUP == 'CALENDAR_CYCL_TP').map(data => ({ value: data.ID, label: data.CD_NM }));

    setCyclTpOption(filteringArr);
    setValue('cyclTp', filteringArr[0].value);
  }

  function saveData() {
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let formData = new FormData();
        formData.append('RES_CAL_ID', '');
        formData.append('RES_DTL_ID', getValues('resDtlId'));
        formData.append('CALENDAR_DESCRIP', getValues('calendarDescrip'));
        formData.append('PRDUCT_CONST_YN', getValues('prductConstYn').join('') === 'Y' ? true : false);
        formData.append('STRT_DATE', new Date(getValues('strtDate')).format('yyyy-MM-ddTHH:mm:ss'));
        formData.append('END_DATE', new Date(getValues('endDate')).format('yyyy-MM-ddTHH:mm:ss'));
        formData.append('CYCL_TP', getValues('cyclTp'));
        formData.append('FIXED_YN', getValues('fixedYn').join('') === 'Y' ? true : false);
        formData.append('ACTV_YN', getValues('actvYn').join('') === 'Y' ? true : false);
        formData.append('USER_ID', username);

        zAxios({
          method: 'post',
          url: baseURI() + 'engine/mp/SRV_UI_MP_11_S1',
          data: formData,
          fromPopup: true
        })
          .then(function (res) {
            const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_11_S1_P_RT_MSG;
            showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false });

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
      <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveData, onError)} title="POP_UI_MP_11_01" resizeHeight={400} resizeWidth={500}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={tabChange} indicatorColor="primary">
            <Tab label={transLangKey("COMM")} value="tab1" />
            <Tab label={transLangKey("CAL_REG")} value="tab2" />
          </Tabs>
        </Box>

        <Box style={{ marginTop: "5px", border: "1px solid #dde1ee", width: "100%", height: "100%", padding: "6px 12px" }}>

          {/* tab1 */}
          <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: tabValue === "tab1" ? "block" : "none" }}>
            <InputField type="action" name="locatTp" label={transLangKey("LOCAT_TP_NM")} title={transLangKey("SEARCH")} onClick={() => { openPopupLocatTp() }} control={control}>
              <Icon.Search />
            </InputField>
            <InputField name="locatLv" label={transLangKey("LOCAT_LV")} control={control} disabled={true} />
            <InputField name="locatCd" label={transLangKey("LOCAT_CD")} control={control} disabled={true} />
            <InputField name="locatNm" label={transLangKey("LOCAT_NM")} control={control} disabled={true} />

            <InputField type="action" name="resCd" label={transLangKey("RES_CD")} title={transLangKey("SEARCH")} onClick={() => { openPopupResource() }} control={control}>
              <Icon.Search />
            </InputField>
            <InputField name="resDescrip" label={transLangKey("RES_DESCRIP")} control={control} disabled={true} />

            <InputField type="check" name="fixedYn" control={control} options={[{ label: transLangKey("FIXED_YN"), value: "Y" }]} disabled={true} />
            <InputField type="check" name="actvYn" control={control} options={[{ label: transLangKey("ACTV_YN"), value: "Y" }]} />
          </Box>

          {/* tab2 */}
          <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: tabValue === "tab2" ? "block" : "none" }}>
            <InputField name="calendarId" label={transLangKey("CALENDAR_ID")} control={control} disabled={true} />
            <InputField name="calendarDescrip" label={transLangKey("CALENDAR_DESCRIP")} control={control} />
            <InputField type="check" name="prductConstYn" control={control} options={[{ label: transLangKey("PRDUCT_CONST_YN"), value: "Y" }]} style={oneRowStyle} />
            <InputField name="strtDate" type="datetime" label={transLangKey("STRT_DTTM")} dateformat="yyyy-MM-dd" control={control} />
            <InputField name="endDate" type="datetime" label={transLangKey("END_DTTM")} dateformat="yyyy-MM-dd" control={control} />
            <InputField type="select" name="cyclTp" label={transLangKey("CYCL_TP")} control={control} options={cyclTpOption} />
          </Box>
        </Box>
      </PopupDialog>
      {locatTpPopupOpen && (<PopPopLocat open={locatTpPopupOpen} onClose={() => { setPopLocatTp(false); }} confirm={onSetLocat}></PopPopLocat>)}
      {resourcePopupOpen && (<PopPopResource open={resourcePopupOpen} onClose={() => { setPopResource(false); }} confirm={onSetResource} data={ getValues("locMgmtId") }></PopPopResource>)}
    </>
  );
}

export default PopPlantResCalendarNew1;
