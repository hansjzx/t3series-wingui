import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Tab, Tabs } from '@mui/material';
import { InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';
import { getCodeList } from "@wingui/view/supplychainmodel/common/common";

import PopPopLocat from './PopPopLocat';
import PopPopItem from '../resource/PopPopItem';
import PopPopResource from './PopPopResource';

const oneRowStyle = { marginRight: '50px' };

function PopItemResCapacityNew1(props) {
  const [username] = useUserStore(state => [state.username]);
  const [tabValue, setTabValue] = React.useState('tab1');

  const { handleSubmit, watch, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      // tab1
      locatDtlId: '',
      locatTpNm: '',
      locatLv: '',
      locatCd: '',
      locatNm: '',
      planResTp: '',

      itemMstId: '',
      itemCd: '',
      itemNm: '',
      itemTp: '',
      uomNm: '',

      resDtlId: '',
      resCd: '',
      resDescrip: '',
      wc: '',
      resCapaActvYn: [''],

      // tab2
      tactTime: '',
      tactTimeUomNm: '',
      prodty: '',
      prodtyTimeUomNm: '',

      // tab3
      queueTime: '',
      setupTime: '',
      processTime: '',
      waitTime: '',
      cycleTimeUomNm: '',

      // tab4
      lotPrductYn: [''],
      minLotsize: '',
      maxLotsize: '',
      ovrMinLotsize: '',
      multpLotsize: ''
    }
  });

  const [locatTpPopupOpen, setPopLocatTp] = useState(false);
  const [itemPopupOpen, setPopItem] = useState(false);
  const [resourcePopupOpen, setPopResource] = useState(false);

  const [timeUomOption, setTimeUomOption] = useState([]);
  const watchLotPrductYn = watch('lotPrductYn');
  const [lotsizeDisabled, setLotsizeDisabled] = useState(true);

  useEffect (() => {
    if (props.open) {
      setCombobox();
    }
  }, []);

  useEffect(() => {
    if(getValues('lotPrductYn').length === 2) {
      setLotsizeDisabled(false);
    } else {
      setLotsizeDisabled(true);
      setValue('minLotsize', '');
      setValue('maxLotsize', '');
      setValue('ovrMinLotsize', '');
      setValue('multpLotsize', '');
    }
  }, [watchLotPrductYn]);

  const tabChange = (event, newValue) => {
    setTabValue(newValue);
  }

  function openPopupLocatTp() {
    setPopLocatTp(true);
  }

  function onSetLocat(gridRow) {
    setValue('locatDtlId', gridRow.LOCAT_DTL_ID);
    setValue('locatTpNm', gridRow.LOCAT_TP_NM);
    setValue('locatLv', gridRow.LOCAT_LV);
    setValue('locatCd', gridRow.LOCAT_CD);
    setValue('locatNm', gridRow.LOCAT_NM);
    setValue('planResTp', gridRow.PLAN_RES_TP);
  }

  function openPopupItem() {
    setPopItem(true);
  }

  function onSetItem(gridRow) {
    setValue('itemMstId', gridRow.ITEM_MST_ID);
    setValue('itemCd', gridRow.ITEM_CD);
    setValue('itemNm', gridRow.ITEM_NM);
    setValue('itemTp', gridRow.ITEM_TP);
    setValue('uomNm', gridRow.UOM_NM);
  }

  function openPopupResource() {
    setPopResource(true);
  }

  function onSetResource(gridRow) {
    setValue('resDtlId', gridRow.RES_DTL_ID);
    setValue('resCd', gridRow.RES_CD);
    setValue('resDescrip', gridRow.RES_DESCRIP);
    setValue('wc', gridRow.WC);
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
    let dataArr = await getCodeList('TIME_UOM');
    let filteringArr = dataArr.filter(code => code.GROUP == 'TIME_UOM').map(data => ({ value: data.ID, label: data.CD_NM }));

    setTimeUomOption(filteringArr);
    setValue('tactTimeUomNm', filteringArr[0].value);
    setValue('prodtyTimeUomNm', filteringArr[0].value);
    setValue('cycleTimeUomNm', filteringArr[0].value);
  }

  function saveData() {
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let formData = new FormData();
        formData.append('WRK_TYPE', 'SAVE');
        formData.append('LOC_DTL_ID', getValues('locatDtlId'));
        formData.append('ITEM_MST_ID', getValues('itemMstId'));
        formData.append('RES_DTL_ID', getValues('resDtlId'));

        if (getValues('tactTime') !== '') {
          formData.append('TACT_TIME', getValues('tactTime'));
        }

        formData.append('TACT_TIME_UOM_NM', getValues('tactTimeUomNm'));

        if (getValues('prodty') !== '') {
          formData.append('PRODTY', getValues('prodty'));
        }

        formData.append('PRODTY_TIME_UOM_NM', getValues('prodtyTimeUomNm'));

        if (getValues('queueTime') !== '') {
          formData.append('QUEUE_TIME', getValues('queueTime'));
        }
        if (getValues('queueTime') !== '') {
          formData.append('SETUP_TIME', getValues('queueTime'));
        }
        if (getValues('processTime') !== '') {
          formData.append('PROCESS_TIME', getValues('processTime'));
        }
        if (getValues('waitTime') !== '') {
          formData.append('WAIT_TIME', getValues('waitTime'));
        }

        formData.append('CYCL_TIME_UOM_NM', getValues('cycleTimeUomNm'));
        formData.append('LOT_PRDUCT_YN', getValues('lotPrductYn').join('') === 'Y' ? true : false);

        if (getValues('minLotsize') !== '') {
          formData.append('MIN_LOTSIZE', getValues('minLotsize'));
        }
        if (getValues('maxLotsize') !== '') {
          formData.append('MAX_LOTSIZE', getValues('maxLotsize'));
        }
        if (getValues('ovrMinLotsize') !== '') {
          formData.append('OVR_MIN_LOTSIZE', getValues('ovrMinLotsize'));
        }
        if (getValues('multpLotsize') !== '') {
          formData.append('MULTP_LOTSIZE', getValues('multpLotsize'));
        }

        formData.append('RES_CAPA_ACTV_YN', getValues('resCapaActvYn').join('') === 'Y' ? true : false);
        formData.append('USER_ID', username);

        zAxios({
          method: 'post',
          url: baseURI() + 'engine/mp/SRV_UI_MP_09_S1',
          data: formData,
          fromPopup: true
        })
          .then(function (res) {
            const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_09_S1_P_RT_MSG;
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
      <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveData, onError)} title="POP_UI_MP_09_02" resizeHeight={600} resizeWidth={500}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={tabChange} indicatorColor="primary">
            <Tab label={transLangKey("COMM")} value="tab1" />
            <Tab label={transLangKey("TACT_TIME_PRODUCTIVITY")} value="tab2" />
            <Tab label={transLangKey("CYCLE_TIME")} value="tab3" />
            <Tab label={transLangKey("BASE_LOT_SIZE")} value="tab4" />
          </Tabs>
        </Box>

        <Box style={{ marginTop: "5px", border: "1px solid #dde1ee", width: "100%", height: "100%", padding: "6px 12px" }}>
          {/* tab1 */}
          <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: tabValue === "tab1" ? "block" : "none" }}>
            <InputField type="action" name="locatTpNm" label={transLangKey("LOCAT_TP_NM")} title={transLangKey("SEARCH")} onClick={() => { openPopupLocatTp() }} control={control}>
              <Icon.Search />
            </InputField>
            <InputField name="locatLv" label={transLangKey("LOCAT_LV")} control={control} disabled={true} />
            <InputField name="locatCd" label={transLangKey("LOCAT_CD")} control={control} disabled={true} />
            <InputField name="locatNm" label={transLangKey("LOCAT_NM")} control={control} disabled={true} />
            <InputField name="planResTp" label={transLangKey("PLAN_RES_TP")} control={control} disabled={true} style={oneRowStyle} />

            <InputField type="action" name="itemCd" label={transLangKey("ITEM_CD")} title={transLangKey("SEARCH")} onClick={() => { openPopupItem() }} control={control}>
              <Icon.Search />
            </InputField>
            <InputField name="itemNm" label={transLangKey("ITEM_NM")} control={control} disabled={true} />
            <InputField name="itemTp" label={transLangKey("ITEM_TP")} control={control} disabled={true} />
            <InputField name="uomNm" label={transLangKey("UOM_NM")} control={control} disabled={true} />

            <InputField type="action" name="resCd" label={transLangKey("RES_CD")} title={transLangKey("SEARCH")} onClick={() => { openPopupResource() }} control={control}>
              <Icon.Search />
            </InputField>
            <InputField name="resDescrip" label={transLangKey("RES_DESCRIP")} control={control} disabled={true} />

            <InputField name="wc" label={transLangKey("WC")} control={control} disabled={true} />
            <InputField type="check" name="resCapaActvYn" control={control} options={[{ label: transLangKey("ACTV_YN"), value: "Y" }]} />
          </Box>

          {/* tab2 */}
          <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: tabValue === "tab2" ? "block" : "none" }}>
            <hr />
            <InputField name="tactTime" label={transLangKey("TACT_TIME")} dataType="number" control={control} />
            <InputField type="select" name="tactTimeUomNm" label={transLangKey("TIME_UOM_NM")} control={control} options={timeUomOption} />

            <hr />
            <InputField name="prodty" label={transLangKey("PRODTY")} dataType="number" control={control} />
            <InputField type="select" name="prodtyTimeUomNm" label={transLangKey("TIME_UOM_NM")} control={control} options={timeUomOption} />
          </Box>

          {/* tab3 */}
          <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: tabValue === "tab3" ? "block" : "none" }}>
            <InputField name="queueTime" label={transLangKey("QUEUE_TIME")} dataType="number" control={control} />
            <InputField name="setupTime" label={transLangKey("SETUP_TIME")} dataType="number" control={control} />
            <InputField name="processTime" label={transLangKey("PROCESS_TIME")} dataType="number" control={control} />
            <InputField name="waitTime" label={transLangKey("WAIT_TIME")} dataType="number" control={control} />
            <InputField type="select" name="cycleTimeUomNm" label={transLangKey("TIME_UOM_NM")} control={control} options={timeUomOption} />
          </Box>

          {/* tab4 */}
          <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: tabValue === "tab4" ? "block" : "none" }}>
            <InputField type="check" name="lotPrductYn" control={control} style={oneRowStyle} options={[{ label: transLangKey("LOT_PRDUCT_YN"), value: "Y" }]} />
            <InputField name="minLotsize" label={transLangKey("MIN_LOTSIZE")} dataType="number" control={control} disabled={lotsizeDisabled} />
            <InputField name="maxLotsize" label={transLangKey("MAX_LOTSIZE")} dataType="number" control={control} disabled={lotsizeDisabled} />
            <InputField name="ovrMinLotsize" label={transLangKey("OVR_MIN_LOTSIZE")} dataType="number" control={control} disabled={lotsizeDisabled} />
            <InputField name="multpLotsize" label={transLangKey("MULTP_LOTSIZE")} dataType="number" control={control} disabled={lotsizeDisabled} />
          </Box>
        </Box>
      </PopupDialog>
      {locatTpPopupOpen && (<PopPopLocat open={locatTpPopupOpen} onClose={() => { setPopLocatTp(false); }} confirm={onSetLocat}></PopPopLocat>)}
      {itemPopupOpen && (<PopPopItem open={itemPopupOpen} onClose={() => { setPopItem(false); }} confirm={onSetItem} data={getValues("locatDtlId")}></PopPopItem>)}
      {resourcePopupOpen && (<PopPopResource open={resourcePopupOpen} onClose={() => { setPopResource(false); }} confirm={onSetResource} data={{ locatDtlId: getValues("locatDtlId"), itemMstId: getValues("itemMstId") }}></PopPopResource>)}
    </>
  );
}

export default PopItemResCapacityNew1;
