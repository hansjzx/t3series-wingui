import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

const oneRowStyle = { marginRight: '50px' };

function PopItemResCapacityBatchUpdate(props) {
  const [username] = useUserStore(state => [state.username]);

  const { handleSubmit, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      resCd: '',
      resDescrip: '',
      strtDttm: '',
      endDttm: '',

      minLotsize: '',
      maxLotsize: '',
      ovrMinLotsize: '',
      multpLotsize: '',
      tactTime: ''
    }
  });

  useEffect(() => {
    if (props.data !== null) {
      let data = props.data

      setValue('locatTpNm', data.LOCAT_TP);
      setValue('locatLv', data.LOCAT_LV);
      setValue('locatCd', data.LOCAT_CD);
      setValue('locatNm', data.LOCAT_NM);
      setValue('itemResCapaMstId', data.ITEM_RES_CAPA_MST_ID);
      setValue('itemCd', data.ITEM_CD);
      setValue('itemDescrip', data.ITEM_DESCRIP);
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
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let formData = new FormData();
        formData.append('ITEM_RES_CAPA_MST_ID', getValues('itemResCapaMstId'));

        if (getValues('minLotsize') !== '') {
          formData.append('MIN_LOTSIZE', getValues('minLotsize'));
        }
        if (getValues('multpLotsize') !== '') {
          formData.append('MULTP_LOTSIZE', getValues('multpLotsize'));
        }
        if (getValues('ovrMinLotsize') !== '') {
          formData.append('OVR_MIN_LOTSIZE', getValues('ovrMinLotsize'));
        }
        if (getValues('maxLotsize') !== '') {
          formData.append('MAX_LOTSIZE', getValues('maxLotsize'));
        }
        if (getValues('tactTime') !== '') {
          formData.append('TACT_TIME', getValues('tactTime'));
        }

        formData.append('STRT_DTTM', getValues('strtDttm') === null ? '' : new Date(getValues('strtDttm')).format('yyyy-MM-ddT00:00:00'));
        formData.append('END_DTTM', getValues('endDttm') === null ? '' : new Date(getValues('endDttm')).format('yyyy-MM-ddT00:00:00'));
        formData.append('USER_ID', username);

        zAxios({
          method: 'post',
          url: baseURI() + 'engine/mp/SRV_UI_MP_09_POP_S2',
          data: formData,
          fromPopup: true
        })
          .then(function (res) {
            const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_09_POP_S2_P_RT_MSG;
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
      <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveData, onError)} title="POP_UI_MP_09_04" resizeHeight={500} resizeWidth={500}>
        <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: "block" }}>
          <InputField name="resCd" label={transLangKey("RES_CD")} control={control} disabled={true} />
          <InputField name="resDescrip" label={transLangKey("RES_DESCRIP")} control={control} disabled={true} />
          <InputField name="strtDttm" type="datetime" label={transLangKey("STRT_DTTM")} dateformat="yyyy-MM-dd" control={control} />
          <InputField name="endDttm" type="datetime" label={transLangKey("END_DTTM")} dateformat="yyyy-MM-dd" control={control} />

          <InputField name="minLotsize" label={transLangKey("MIN_LOTSIZE")} dataType="number" control={control} />
          <InputField name="maxLotsize" label={transLangKey("MAX_LOTSIZE")} dataType="number" control={control} />
          <InputField name="ovrMinLotsize" label={transLangKey("OVR_MIN_LOTSIZE")} dataType="number" control={control} />
          <InputField name="multpLotsize" label={transLangKey("MULTP_LOTSIZE")} dataType="number" control={control} />
          <InputField name="tactTime" label={transLangKey("TACT_TIME")} dataType="number" control={control} style={oneRowStyle} />
        </Box>
      </PopupDialog>
    </>
  );
}

export default PopItemResCapacityBatchUpdate;
