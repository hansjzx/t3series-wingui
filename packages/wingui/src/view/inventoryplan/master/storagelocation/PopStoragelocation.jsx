import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Typography, Tab } from '@mui/material';
import { InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import { TabContext, TabList, TabPanel } from '@mui/lab';
import PopLocatTp from '@wingui/view/common/PopLocatTp';

const wrapStyle = { width: '400px' };
const labelStyle = { width: '160px', maxWidth: '160px' };

function PopStoragelocation(props) {
  const [username] = useUserStore(state => [state.username]);
  const { handleSubmit, watch, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: { }
  });

  const [popLocatTpOpen, setPopLocatTpOpen] = React.useState(false);
  const [tabValue, setTabValue] = React.useState('COMM');
  const [fromto, setFromto] = React.useState('');

  const watchStockYn1 = watch('LOCAT_STOCK_YN');
  const watchStockYn2 = watch('INTRANSIT_STOCK_YN');

  useEffect(() => {
    //tab1
    setValue('PLANT_CD', props.data.PLANT_CD);
    setValue('STORAGE_LOCAT', props.data.INV_LOCAT_NM);
    setValue('STOCK_LOCAT_DESCRIP', props.data.INV_LOCAT_DESCRIP);
    setValue('WAHOUS_TP_ID', props.data.WAHOUS_TP_ID);
    setValue('WAHOUS_TP_NM', props.data.WAHOUS_TP_NM);

    if (props.data.LOCAT_STOCK_YN) {
      setValue('LOCAT_STOCK_YN', ['Y']);
    } else {
      setValue('LOCAT_STOCK_YN', []);
    }

    if (props.data.INTRANSIT_STOCK_YN) {
      setValue('INTRANSIT_STOCK_YN', ['Y']);
    } else {
      setValue('INTRANSIT_STOCK_YN', []);
    }

    if (props.data.ACTV_YN) {
      setValue('ACTV_YN', ['Y']);
    } else {
      setValue('ACTV_YN', []);
    }

    //tab2
    setValue('FROM_LOCAT_ID', props.data.FROM_LOCAT_ID);
    setValue('FROM_LOCAT_TP_NM', props.data.FROM_LOCAT_TP_NM);
    setValue('FROM_LOCAT_LV', props.data.FROM_LOCAT_LV);
    setValue('FROM_LOCAT_CD', props.data.FROM_LOCAT_CD);
    setValue('FROM_LOCAT_NM', props.data.FROM_LOCAT_NM);
    setValue('TO_LOCAT_ID', props.data.TO_LOCAT_ID);
    setValue('TO_LOCAT_TP_NM', props.data.TO_LOCAT_TP_NM);
    setValue('TO_LOCAT_LV', props.data.TO_LOCAT_LV);
    setValue('TO_LOCAT_CD', props.data.TO_LOCAT_CD);
    setValue('TO_LOCAT_NM', props.data.TO_LOCAT_NM);
  }, [props.data]);

  useEffect(() => {
    if (getValues('LOCAT_STOCK_YN').join('') === 'Y') {
      setValue('INTRANSIT_STOCK_YN', []);
    }
  }, [watchStockYn1])

  useEffect(() => {
    if (getValues('INTRANSIT_STOCK_YN').join('') === 'Y') {
      setValue('LOCAT_STOCK_YN', []);
    }
  }, [watchStockYn2])


  const tabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  function onError(errors, e) {
    if (typeof errors !== 'undefined' && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  function openLocatTpPopup(fromto) {
    setFromto(fromto);
    setPopLocatTpOpen(true);
  }

  function onSetLocatTp(gridRow) {
    setValue(fromto + '_LOCAT_ID', gridRow.LOCAT_ID);
    setValue(fromto + '_LOCAT_TP_NM', gridRow.LOCAT_TP_NM);
    setValue(fromto + '_LOCAT_LV', gridRow.LOCAT_LV);
    setValue(fromto + '_LOCAT_CD', gridRow.LOCAT_CD);
    setValue(fromto + '_LOCAT_NM', gridRow.LOCAT_NM);
  }

  function saveSubmit() {
    let data = Object.assign(props.data, getValues());
    data.LOCAT_STOCK_YN = getValues('LOCAT_STOCK_YN').join('') === 'Y' ? 'Y' : 'N';
    data.INTRANSIT_STOCK_YN = getValues('INTRANSIT_STOCK_YN').join('') === 'Y' ? 'Y' : 'N';
    data.ACTV_YN = getValues('ACTV_YN').join('') === 'Y' ? 'Y' : 'N';

    let formData = new FormData();
    formData.append('USER_ID', username);
    formData.append('changes', "[" + JSON.stringify(data) + "]");

    zAxios.post(baseURI() + 'engine/mp/SRV_UI_IM_11_S1',
      formData,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(function () {
        props.confirm();
        props.onClose(false);
      })
      .catch(function (e) {
        console.error(e);
        props.confirm();
        props.onClose(false);
      });
  }

  return (
    <>
      <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title='POP_UI_IM_11_01' resizeWidth={420} resizeHeight={800} >
        <TabContext value={tabValue}>
          <Box style={{ height: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={tabChange}>
                <Tab label={transLangKey('COMM')} value='COMM' />
                <Tab label={transLangKey('LOCAT_MAP')} value='LOCAT_MAP' />
              </TabList>
            </Box>
            <TabPanel value='COMM'>
              <Box>
                <InputField name='PLANT_CD' label={transLangKey('PLANT_CD')} control={control} readonly={true} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <InputField name='STORAGE_LOCAT' label={transLangKey('STORAGE_LOCAT')} control={control} readonly={true} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <InputField name='STOCK_LOCAT_DESCRIP' label={transLangKey('STOCK_LOCAT_DESCRIP')} control={control} readonly={true} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <InputField name='WAHOUS_TP_ID' label={transLangKey('WAHOUS_TP_ID')} control={control} readonly={true} style={{ display: 'none' }} labelStyle={labelStyle} />
                <InputField type='action' name='WAHOUS_TP_NM' label={transLangKey('WAHOUS_TP_NM')} title={transLangKey('SEARCH')} onClick={() => { WAHOUS_TP_NM() }} control={control} readonly={true} wrapStyle={wrapStyle} labelStyle={labelStyle}>
                  <Icon.Search />
                </InputField>
                <InputField type='check' name='LOCAT_STOCK_YN' control={control} wrapStyle={wrapStyle} labelStyle={labelStyle} options={[{ label: transLangKey('LOCAT_STOCK_YN'), value: 'Y' }]} />
                <InputField type='check' name='INTRANSIT_STOCK_YN' control={control} wrapStyle={wrapStyle} labelStyle={labelStyle} options={[{ label: transLangKey('INTRANSIT_STOCK_YN'), value: 'Y' }]} />
                <InputField type='check' name='ACTV_YN' control={control} wrapStyle={wrapStyle} labelStyle={labelStyle} options={[{ label: transLangKey('ACTV_YN'), value: 'Y' }]} />
              </Box>
            </TabPanel>
            <TabPanel value='LOCAT_MAP'>
              <Box >
                <Typography style={{ marginBottom: '5px' }}>{transLangKey('FROM_LOCAT')}</Typography>
                <InputField type='action' name='FROM_LOCAT_TP_NM' label={transLangKey('FROM_LOCAT_TP_NM')} title={transLangKey('SEARCH')} control={control} readonly={true} wrapStyle={wrapStyle} labelStyle={labelStyle}>
                  <Icon.Search onClick={() => { openLocatTpPopup('FROM') }} />
                </InputField>
                <InputField name='FROM_LOCAT_ID' label={transLangKey('FROM_LOCAT_ID')} control={control} readonly={true} style={{ display: 'none' }} labelStyle={labelStyle} />
                <InputField name='FROM_LOCAT_LV' label={transLangKey('FROM_LOCAT_LV')} control={control} wrapStyle={wrapStyle} labelStyle={labelStyle} readonly={true} />
                <InputField name='FROM_LOCAT_CD' label={transLangKey('FROM_LOCAT_CD')} control={control} readonly={true} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <InputField name='FROM_LOCAT_NM' label={transLangKey('FROM_LOCAT_NM')} control={control} readonly={true} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <Typography style={{ marginTop: '15px', marginBottom: '5px' }}>{transLangKey('TO_LOCAT')}</Typography>
                <InputField type='action' name='TO_LOCAT_TP_NM' label={transLangKey('TO_LOCAT_TP_NM')} title={transLangKey('SEARCH')} onClick={() => { openLocatTpPopup('TO') }} disabled={true} control={control} wrapStyle={wrapStyle} labelStyle={labelStyle}>
                  <Icon.Search />
                </InputField>
                <InputField name='TO_LOCAT_ID' label={transLangKey('TO_LOCAT_ID')} control={control} readonly={true} style={{ display: 'none' }} labelStyle={labelStyle} />
                <InputField name='TO_LOCAT_LV' label={transLangKey('TO_LOCAT_LV')} control={control} readonly={true} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <InputField name='TO_LOCAT_CD' label={transLangKey('TO_LOCAT_CD')} control={control} readonly={true} wrapStyle={wrapStyle} labelStyle={labelStyle} />
                <InputField name='TO_LOCAT_NM' label={transLangKey('TO_LOCAT_NM')} control={control} readonly={true} wrapStyle={wrapStyle} labelStyle={labelStyle} />
              </Box>
            </TabPanel>
          </Box>
        </TabContext>
      </PopupDialog>
      {popLocatTpOpen && (<PopLocatTp open={popLocatTpOpen} onClose={() => { setPopLocatTpOpen(false); }} confirm={onSetLocatTp}></PopLocatTp>)}
    </>
  );
}

export default PopStoragelocation;
