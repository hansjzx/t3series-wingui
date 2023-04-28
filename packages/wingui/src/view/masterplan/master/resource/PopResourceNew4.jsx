import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Tab, Tabs} from '@mui/material';
import { InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

function PopResourceNew4(props) {
  const [username] = useUserStore(state => [state.username]);

  const { handleSubmit, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      locatTpNm: '',
      locatLv: '',
      locatCd: '',
      locatNm: '',

      resId: '',
      resCd: '',
      resDescrip: '',

      strtDate: '',
      endDate: '',
      capaVal: '',
      ovrCapaVal: '',
      efficy: '',
      maxPrductModelVal: '',

      grpAppyYn: [''],
      actvYn: ['']
    }
  });

  useEffect(() => {
    if (props.data !== null) {
      let data = props.data

      setValue('locatTpNm', data.LOCAT_TP_NM);
      setValue('locatLv', data.LOCAT_LV);
      setValue('locatCd', data.LOCAT_CD);
      setValue('locatNm', data.LOCAT_NM);
      setValue('resId', data.RES_DTL_ID);
      setValue('resCd', data.RES_CD);
      setValue('resDescrip', data.RES_DESCRIP);
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
    if (getValues('strtDate') === null || getValues('endDate') === null) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_0006'), { close: false });
    } else {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
        if (answer) {
          let formData = new FormData();
  
          formData.append('WRK_TYPE', 'SAVE');
          formData.append('ID', '');
          formData.append('RES_ID', getValues('resId'));
          formData.append('STRT_DATE', getValues('strtDate') === null ? '' : new Date(getValues('strtDate')).format('yyyy-MM-ddT00:00:00'));
          formData.append('END_DATE', getValues('endDate') === null ? '' : new Date(getValues('endDate')).format('yyyy-MM-ddT00:00:00'));

          if (getValues('capaVal') !== '') {
            formData.append('CAPA_VAL', getValues('capaVal'));
          }
          if (getValues('ovrCapaVal') !== '') {
            formData.append('OVR_CAPA_VAL', getValues('ovrCapaVal'));
          }
          if (getValues('efficy') !== '') {
            formData.append('EFFICY_VAL', getValues('efficy'));
          }
          if (getValues('maxPrductModelVal') !== '') {
            formData.append('MAX_PRDUCT_MODEL_VAL', getValues('maxPrductModelVal'));
          }

          formData.append('GRP_APPY_YN', getValues('grpAppyYn').join('') === 'Y' ? true : false);
          formData.append('ACTV_YN', getValues('actvYn').join('') === 'Y' ? true : false);
          formData.append('USER_ID', username);

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_UI_MP_06_S3',
            data: formData,
            fromPopup: true
          })
            .then(function (res) {
              const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_06_S3_P_RT_MSG;
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(msg), { close: false });
  
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
  }

  return (
    <>
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveData, onError)} title="POP_UI_MP_06_06" resizeHeight={570} resizeWidth={500}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={"tab1"} indicatorColor="primary">
          <Tab label={transLangKey("RES_PERIOD_INFO")} value="tab1" />
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

          <InputField name='strtDate' type='datetime' label={transLangKey('STRT_DATE')} dateformat="yyyy-MM-dd" control={control}/>
          <InputField name='endDate' type='datetime' label={transLangKey('END_DATE')} dateformat="yyyy-MM-dd"control={control}/>

          <InputField name="capaVal" label={transLangKey("CAPA_VAL")} dataType={"number"} control={control} />
          <InputField name="ovrCapaVal" label={transLangKey("OVR_CAPA_VAL")} dataType={"number"} control={control} />
          <InputField name="efficy" label={transLangKey("EFFICY")} dataType={"number"} control={control} />
          <InputField name="maxPrductModelVal" label={transLangKey("MAX_PRDUCT_MODEL_VAL")} dataType={"number"} control={control} />

          <InputField type="check" name="grpAppyYn" control={control} options={[{ label: transLangKey("GRP_APPY_YN"), value: "Y" }]} />
          <InputField type="check" name="actvYn" control={control} options={[{ label: transLangKey("ACTV_YN"), value: "Y" }]} />

        </Box>
      </Box>
    </PopupDialog>
    </>
  );
}

export default PopResourceNew4;
