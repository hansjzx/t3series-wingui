import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Tab, Tabs } from '@mui/material';
import { InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

function PopResourceNew5(props) {
  const [username] = useUserStore(state => [state.username]);

  const { handleSubmit, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      locatMgmtId: '',
      locatTpNm: '',
      locatLv: '',
      locatCd: '',
      locatNm: '',

      resId: '',
      resCd: '',
      resDescrip: '',
      capaVal: '',
      efficy: '',

      strtDttm: '',
      endDttm: ''
    }
  });

  useEffect(() => {
    if (props.data !== null) {
      let data = props.data

      setValue('locatMgmtId', data.LOC_MGMT_ID);
      setValue('locatTpNm', data.LOCAT_TP_NM);
      setValue('locatLv', data.LOCAT_LV);
      setValue('locatCd', data.LOCAT_CD);
      setValue('locatNm', data.LOCAT_NM);
      setValue('resId', data.RES_DTL_ID);
      setValue('resCd', data.RES_CD);
      setValue('resDescrip', data.RES_DESCRIP);
      setValue('capaVal', data.DEFAT_CAPA_VAL);
      setValue('efficy', data.DEFAT_EFFICY_VAL);
    }
  }, []);

  function onError(errors) {
    if (typeof errors !== 'undefined' && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  function saveData() {
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let formData = new FormData();

        formData.append('LOC_MGMT_ID', getValues('locatMgmtId'));
        formData.append('RES_ID', getValues('resId'));
        formData.append('STRT_DTTM', getValues('strtDttm') === null ? '' : new Date(getValues('strtDttm')).format('yyyy-MM-ddT00:00:00'));
        formData.append('END_DTTM', getValues('endDttm') === null ? '' : new Date(getValues('endDttm')).format('yyyy-MM-ddT00:00:00'));
        formData.append('EFFICY_VAL', getValues('efficy'));
        formData.append('USER_ID', username);

        zAxios({
          method: 'post',
          url: baseURI() + 'engine/mp/SRV_UI_MP_06_S5',
          data: formData,
          fromPopup: true
        })
          .then(function (res) {
            const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_06_S5_P_RT_MSG;
            showMessage(transLangKey('MSG_CONFIRM'), transLangKey(msg));

            if (msg !== 'MSG_0006') {
              props.confirm();
              props.onClose(false);
            }
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
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveData, onError)} title="POP_UI_MP_06_07" resizeHeight={570} resizeWidth={500}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={"tab1"} indicatorColor="primary">
          <Tab label={transLangKey("PERIOD_BNECK_RES")} value="tab1" />
        </Tabs>
      </Box>

      <Box style={{ marginTop: "5px", border: "1px solid #dde1ee", width: "100%", height: "100%", padding: "6px 12px" }}>
        <Box sx={{ display: "flex", height: "100%", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: "block" }}>
          <InputField name="locatTpNm" label={transLangKey("LOCAT_TP_NM")} control={control} disabled={true} />
          <InputField name="locatLv" label={transLangKey("LOCAT_LV")} control={control} disabled={true} />
          <InputField name="locatCd" label={transLangKey("LOCAT_CD")} control={control} disabled={true} />
          <InputField name="locatNm" label={transLangKey("LOCAT_NM")} control={control} disabled={true} />

          <InputField name="resCd" label={transLangKey("RES_CD")} control={control} disabled={true} />
          <InputField name="resDescrip" label={transLangKey("RES_DESCRIP")} control={control} disabled={true} />
          <InputField name="capaVal" label={transLangKey("CAPA_VAL")} control={control} disabled={true} />
          <InputField name="efficy" label={transLangKey("EFFICY")} control={control} disabled={true} />

          <InputField name='strtDttm' type='datetime' label={transLangKey('STRT_DTTM')} dateformat="yyyy-MM-dd" control={control}/>
          <InputField name='endDttm' type='datetime' label={transLangKey('END_DTTM')} dateformat="yyyy-MM-dd"control={control}/>

        </Box>
      </Box>
    </PopupDialog>
    </>
  );
}

export default PopResourceNew5;
