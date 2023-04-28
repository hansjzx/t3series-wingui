import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Tab, Tabs} from '@mui/material';
import { InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import PopRouteGrp from './PopRouteGrp';

function PopMaxOpersGrpNew(props) {
  const [username] = useUserStore(state => [state.username]);
  const [routeGrpPopupOpen, setPopupRouteGrp] = useState(false);

  const { handleSubmit, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      routeClassDtlId: '',
      routeGrp: '',
      routeGrpDescrip: '',
      strtDate: '',
      endDate: '',
      maxResourceCount: '',
      actvYn: []
    }
  });

  function openPopupRouteGrp() {
    setPopupRouteGrp(true);
  }

  function onSetRouteGrp(gridRow) {
    setValue('routeClassDtlId', gridRow.ROUTE_CLASS_DTL_ID);
    setValue('routeGrp', gridRow.ROUTE_GRP);
    setValue('routeGrpDescrip', gridRow.ROUTE_GRP_DESCRIP);
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

  function saveData() {
    if (getValues('routeClassDtlId') !== 0) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
        if (answer) {
          let formData = new FormData();
  
          formData.append('WRK_TYPE', 'SAVE');
          formData.append('ROUTE_CLASS_DTL_ID', getValues('routeClassDtlId'));

          if (getValues('strtDate') !== null) {
            formData.append('STRT_DATE', new Date(getValues('strtDate')).format('yyyy-MM-ddT00:00:00'));
          }
          if (getValues('endDate') !== null) {
            formData.append('END_DATE', new Date(getValues('endDate')).format('yyyy-MM-ddT00:00:00'));
          }
          if (getValues('maxResourceCount') !== '') {
            formData.append('MAX_RESOURCE_COUNT', getValues('maxResourceCount'));
          }

          formData.append('ACTV_YN', getValues('actvYn').join("")  === 'Y' ? 'true' : 'false');
          formData.append('USER_ID', username);
  
          zAxios({
            method: 'post',
            url: 'engine/mp/SRV_UI_MP_35_S1',
            data: formData
          })
            .then(function (res) {
              const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_35_S1_P_RT_MSG;
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
    } else {
      showMessage(transLangKey('WARNING'), transLangKey('MSG_0006'), { close: false });
    }
  }

  return (
    <>
      <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveData, onError)} title="POP_UI_MP_35_01" resizeHeight={500} resizeWidth={500}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={"tab1"} indicatorColor="primary">
            <Tab label={transLangKey("COMM")} value="tab1" />
          </Tabs>
        </Box>

        <Box style={{ marginTop: "5px", border: "1px solid #dde1ee", width: "100%", height: "100%", padding: "6px 12px" }}>
          <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: "block" }}>
            <InputField type='action' name='routeGrp' label={transLangKey('ROUTE_GRP')} title={transLangKey('SEARCH')} onClick={() => { openPopupRouteGrp() }} control={control} readonly={true}>
              <Icon.Search />
            </InputField>
            <InputField name="routeGrpDescrip" label={transLangKey("ROUTE_GRP_DESCRIP")} control={control} disabled={true} />
            <InputField name='strtDate' type='datetime' label={transLangKey('STRT_DATE')} dateformat="yyyy-MM-dd" control={control}/>
            <InputField name='endDate' type='datetime' label={transLangKey('END_DATE')} dateformat="yyyy-MM-dd"control={control}/>
            <InputField name="maxResourceCount" label={transLangKey("MAX_RESOURCE_COUNT")} control={control} />
            <InputField type='check' name='actvYn' label='' control={control} options={[{ label: transLangKey('ACTV_YN'), value: 'Y' }]} />
          </Box>
        </Box>
      </PopupDialog>
      {routeGrpPopupOpen && (<PopRouteGrp open={routeGrpPopupOpen} onClose={() => { setPopupRouteGrp(false); }} confirm={onSetRouteGrp}></PopRouteGrp>)}
    </>
  );
}

export default PopMaxOpersGrpNew;
