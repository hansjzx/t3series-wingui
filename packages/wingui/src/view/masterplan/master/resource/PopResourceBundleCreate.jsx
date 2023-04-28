import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box, Tab, Tabs } from '@mui/material';
import { InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import PopLocatTp from "@wingui/view/common/PopLocatTp";

const oneRowStyle = { marginRight: "50px" };

function PopResourceBundleCreate(props) {
  const [username] = useUserStore(state => [state.username]);

  const { handleSubmit, watch, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      applyPoint: "PARTIAL",
      checkLocat: ["Y"],
      locatMgmtId: "",
      locatTpNm: "",
      locatLv: "",
      locatCd: "",
      locatNm: "",
      overwriteDataYn: []
    }
  });
  
  const radioOptions = [
    {
      label: transLangKey('ALL_APPLY'),
      value: "ALL"
    },
    {
      label: transLangKey('PARTIAL_APPLY'),
      value: "PARTIAL"
    },
  ];

  const [locatTpPopupOpen, setPopupLocatTp] = useState(false);
  const [locatDisabled, setLocatDisabled] = useState(false);
  
  const watchApplyPoint = watch('applyPoint');
  const watchCheckLocat = watch('checkLocat');

  useEffect(() => {
    if (watchApplyPoint === "ALL") {
      setValue("checkLocat", []);
    } else {
      setValue('checkLocat', ['Y']);
    }
  }, [watchApplyPoint]);

  useEffect(() => {
    if (watchCheckLocat.length === 0) {
      setValue("locatTpNm", "");
      setValue("locatLv", "");
      setValue("locatCd", "");
      setValue("locatNm", "");
      setLocatDisabled(true);
    } else {
      setLocatDisabled(false);
    }
  }, [watchCheckLocat]);

  function openPopupLocatTp() {
    setPopupLocatTp(true);
  }

  function onSetLocatTp(gridRow) {
    setValue('locatMgmtId', gridRow.LOCAT_MGMT_ID);
    setValue('locatTpNm', gridRow.LOCAT_TP_NM);
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

  function saveSubmit() {
    let formData = new FormData();

    formData.append('APPLY_POINT', getValues('applyPoint'));
    formData.append('CHECK_LOCAT', getValues('checkLocat').join("")  === 'Y' ? true : false);
    formData.append('LOCAT_MGMT_ID', getValues('locatMgmtId'));
    formData.append('OVERWRITE_DATA_YN', getValues('overwriteDataYn').join("")  === 'Y' ? 'true' : 'false');
    formData.append('USER_ID', username);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_06_BATCH',
      data: formData,
      fromPopup: true
    })
      .then(function (res) {
        const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_06_BATCH_P_RT_MSG;
        showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false });
      })
      .catch(function (e) {
        console.error(e);
      });

    props.confirm();
    props.onClose(false);
  }

  return (
    <>
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="POP_UI_MP_06_10" resizeHeight={500} resizeWidth={500}>

      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={"tab1"} indicatorColor="primary">
            <Tab label={transLangKey('LOCAT_INFO')} value="tab1" />
          </Tabs>
      </Box>

      <Box style={{ marginTop: "5px", border: "1px solid #dde1ee", width: "100%", height: "100%", padding: "6px 12px" }}>
        <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: "block" }}>
          <Box style={{height:"100%"}}>
            <InputField type="radio" name="applyPoint" control={control} setValue={setValue} options={radioOptions} style={oneRowStyle} />

            <InputField type="check" name="checkLocat" control={control} options={[{ label: transLangKey("LOCAT_REGISTRY"), value: "Y" }]} disabled={ (getValues("applyPoint") !== 'PARTIAL') } style={oneRowStyle} />
            <InputField name='locatMgmtId' control={control} style={{display: 'none'}} />
            <InputField type="action" name="locatTpNm" label={transLangKey("LOCAT_TP_NM")} control={control} onClick={() => { openPopupLocatTp() }} disabled={locatDisabled}>
              <Icon.Search />
            </InputField>
            <InputField name="locatLv" label={transLangKey("LOCAT_LV")} control={control} disabled={true} />
            <InputField name="locatCd" label={transLangKey("LOCAT_CD")} control={control} disabled={true} />
            <InputField name="locatNm" label={transLangKey("LOCAT_NM")} control={control} disabled={true} />

            <hr />

            <InputField type='check' name='overwriteDataYn' label='' control={control} options={[{ label: transLangKey('OVERWRITE_EXIST_DATA'), value: 'Y' }]} />
          </Box>
        </Box>
      </Box>  
    </PopupDialog>

    {locatTpPopupOpen && (<PopLocatTp open={locatTpPopupOpen} onClose={() => { setPopupLocatTp(false); }} confirm={onSetLocatTp}></PopLocatTp>)}
    </>
  );
}

export default PopResourceBundleCreate;
