import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box, Tab, Tabs } from '@mui/material';
import { InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';
import { getCodeList } from "@wingui/view/supplychainmodel/common/common";

import PopPopLocat from './PopPopLocat';
import PopPopPlant from './PopPopPlant'

function PopItemPlantResCalendarBundleCreate(props) {
  const [username] = useUserStore(state => [state.username]);

  const { handleSubmit, watch, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      // tab1
      plantCd: '',
      plantNm: '',

      locMgmtId: '',
      locatTp: '',
      locatLv: '',
      locatCd: '',
      locatNm: '',

      fixedYn: [''],
      actvYn: [''],

      // tab2
      wrkType: 'REGIST',

      bfStrtDate: new Date(),
      bfEndDate: new Date(),
      bfCyclTp: '',

      afStrtDate: new Date(),
      afEndDate: new Date(),
      afCyclTp: '',
      calendarDescrip: ''
    }
  });

  const radioOptions = [
    {
        label: transLangKey('REGIST'),
        value: "REGIST"
    },
    {
        label: transLangKey('MODIFY'),
        value: "MODIFY"
    },
  ];

  const [tabValue, setTabValue] = React.useState('tab1');

  const [plantPopupOpen, setPopupPlant] = useState(false);
  const [locatPopupOpen, setPopupLocat] = useState(false);

  const [bfDisabled, setBfDisabled] = useState(true);

  const [bfCyclTpOption, setBfCyclTpOption] = useState([]);
  const [afCyclTpOption, setAfCyclTpOption] = useState([]);

  const watchWrkType = watch('wrkType');

  useEffect (() => {
    if (props.open) {
      setCombobox();
    }
  }, []);

  useEffect(() => {
    if (watchWrkType === "REGIST") {
      setBfDisabled(true);
    } else {
      setBfDisabled(false);
    }
  }, [watchWrkType]);

  const tabChange = (event, newValue) => {
    setTabValue(newValue);
  }

  function openPopupPlant() {
    setPopupPlant(true);
  }

  function onSetPlant(gridRow) {
    setValue('plantCd', gridRow.PLANT_CD);
    setValue('plantNm', gridRow.PLANT_NM);
  }

  function openPopupLocat() {
    setPopupLocat(true);
  }

  function onSetLocat(gridRow) {
    setValue('locatMgmtId', gridRow.LOCAT_MGMT_ID);
    setValue('locatTp', gridRow.LOCAT_TP);
    setValue('locatLv', gridRow.LOCAT_LV);
    setValue('locatCd', gridRow.LOCAT_CD);
    setValue('locatNm', gridRow.LOCAT_NM);
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

  async function setCombobox() {
    let dataArr = await getCodeList('CALENDAR_CYCL_TP');
    let filteringArr = dataArr.filter(code => code.GROUP == 'CALENDAR_CYCL_TP').map(data => ({ value: data.ID, label: data.CD_NM }));

    setBfCyclTpOption(filteringArr);
    setValue('bfCyclTp', filteringArr[0].value);
    setAfCyclTpOption(filteringArr);
    setValue('afCyclTp', filteringArr[0].value);
  }

  function saveSubmit() {
    let formData = new FormData();

    formData.append('WRK_TYPE', getValues('wrkType'));
    formData.append('PLANT_CD', getValues('plantCd'));
    formData.append('LOC_MGMT_ID', getValues('locMgmtId'));
    formData.append('FIXED_YN', getValues('fixedYn').join("")  === 'Y' ? true : false);
    formData.append('ACTV_YN', getValues('actvYn').join("")  === 'Y' ? true : false);
    formData.append('BF_STRT_DATE', new Date(getValues('bfStrtDate')).format('yyyy-MM-ddT00:00:00'));
    formData.append('BF_END_DATE', new Date(getValues('bfEndDate')).format('yyyy-MM-ddT00:00:00'));
    formData.append('BF_CYCL_TP', getValues('bfCyclTp'));
    formData.append('AF_STRT_DATE', new Date(getValues('afStrtDate')).format('yyyy-MM-ddT00:00:00'));
    formData.append('AF_END_DATE', new Date(getValues('afEndDate')).format('yyyy-MM-ddT00:00:00'));
    formData.append('AF_CYCL_TP', getValues('afCyclTp'));
    formData.append('CAL_DESCRIP', getValues('calendarDescrip'));
    formData.append('USER_ID', username);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_11_BATCH',
      data: formData,
      fromPopup: true
    })
    .then(function (res) {
      showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_MP_11_BATCH_P_RT_MSG), { close: false });
    })
    .catch(function (e) {
      console.error(e);
    });

    props.confirm();
    props.onClose(false);
  }

  return (
    <>
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="POP_UI_MP_11_03" resizeHeight={600} resizeWidth={500}>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabValue} onChange={tabChange} indicatorColor="primary">
          <Tab label={transLangKey("COMM")} value="tab1" />
          <Tab label={transLangKey("CAL_REG")} value="tab2" />
        </Tabs>
      </Box>

      <Box style={{ marginTop: "5px", border: "1px solid #dde1ee", width: "100%", height: "100%", padding: "6px 12px" }}>
        {/* tab1 */}
        <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: tabValue === "tab1" ? "block" : "none" }}>
          <Box style={{height:"100%"}}>

            <InputField type="action" name="plantCd" label={transLangKey("PLANT_CD")} title={transLangKey("SEARCH")} onClick={() => { openPopupPlant() }} control={control}>
              <Icon.Search />
            </InputField>
            <InputField name="plantNm" label={transLangKey("PLANT_NM")} control={control} disabled={true} />

            <InputField type="action" name="locatTp" label={transLangKey("LOCAT_TP_NM")} title={transLangKey("SEARCH")} onClick={() => { openPopupLocat() }} control={control}>
              <Icon.Search />
            </InputField>
            <InputField name="locatLv" label={transLangKey("LOCAT_LV")} control={control} disabled={true} />
            <InputField name="locatCd" label={transLangKey("LOCAT_CD")} control={control} disabled={true} />
            <InputField name="locatNm" label={transLangKey("LOCAT_NM")} control={control} disabled={true} />

            <InputField type='check' name='fixedYn' control={control} options={[{ label: transLangKey('FIXED_YN'), value: 'Y' }]} />
            <InputField type='check' name='actvYn' control={control} options={[{ label: transLangKey('ACTV_YN'), value: 'Y' }]} />

          </Box>
        </Box>
        {/* tab2 */}
        <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: tabValue === "tab2" ? "block" : "none" }}>

          <InputField type="radio" name="wrkType" control={control} setValue={setValue} options={radioOptions} />

          <Box style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgb(159, 159, 159)', padding: '0.5em', margin: '1em 0' }}>
            <Box style={{ position: 'relative', top: '-1.2em', textAlign: 'left', display: 'block'}}>
              <Box style={{ padding: '0 10px', backgroundColor: '#fff', width: '60px' }}>
                { transLangKey("BF_MODIFY") }
              </Box>
            </Box>
            <InputField name="bfStrtDate" type="datetime" label={transLangKey("STRT_DATE")} dateformat="yyyy-MM-dd" control={control} disabled={bfDisabled} />
            <InputField name="bfEndDate" type="datetime" label={transLangKey("END_DATE")} dateformat="yyyy-MM-dd" control={control} disabled={bfDisabled} />
            <InputField type="select" name="bfCyclTp" label={transLangKey("CYCL_TP")} control={control} options={bfCyclTpOption} disabled={bfDisabled} />
          </Box>

          <Box style={{ borderWidth: '1px', borderStyle: 'solid', borderColor: 'rgb(159, 159, 159)', padding: '0.5em', margin: '1em 0' }}>
            <Box style={{ position: 'relative', top: '-1.2em', textAlign: 'left', display: 'block'}}>
              <Box style={{ padding: '0 10px', backgroundColor: '#fff', width: '60px' }}>
                { transLangKey("AF_MODIFY") }
              </Box>
            </Box>
            <InputField name="afStrtDate" type="datetime" label={transLangKey("STRT_DATE")} dateformat="yyyy-MM-dd" control={control} />
            <InputField name="afEndDate" type="datetime" label={transLangKey("END_DATE")} dateformat="yyyy-MM-dd" control={control} />
            <InputField type="select" name="afCyclTp" label={transLangKey("CYCL_TP")} control={control} options={afCyclTpOption} />
            <InputField name="locacalendarDescriptNm" label={transLangKey("CALENDAR_DESCRIP")} control={control} />
          </Box>

        </Box>
      </Box>
    </PopupDialog>

    {plantPopupOpen && (<PopPopPlant open={plantPopupOpen} onClose={() => { setPopupPlant(false); }} confirm={onSetPlant}></PopPopPlant>)}
    {locatPopupOpen && (<PopPopLocat open={locatPopupOpen} onClose={() => { setPopupLocat(false); }} confirm={onSetLocat} data={getValues("plantCd")}></PopPopLocat>)}
    </>
  );
}

export default PopItemPlantResCalendarBundleCreate;
