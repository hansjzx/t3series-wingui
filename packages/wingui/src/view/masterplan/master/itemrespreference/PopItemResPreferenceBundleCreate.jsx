import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Tab, Tabs } from '@mui/material';
import { InputField, PopupDialog, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import PopLocatTp from '@wingui/view/common/PopLocatTp';
import PopCommItem from '@wingui/view/supplychainmodel/common/PopCommItem';
import PopResource from './PopResource';

function PopItemResPreferenceBundleCreate(props) {
  const [username] = useUserStore(state => [state.username]);
  const [locationPopupOpen, setLocationPopupOpen] = useState(false);
  const [itemPopupOpen, setItemPopupOpen] = useState(false);
  const [resourcePopupOpen, setResourcePopupOpen] = useState(false);

  const { control, getValues, setValue, watch } = useForm({
    defaultValues: {
      applyTarget: 'PARTIAL',
      registerLocation: ['Y'],
      locationManagementId: '',
      locationType: '',
      locationLevel: '',
      locationCode: '',
      locationName: '',
      registerItem: [],
      itemMasterId: '',
      itemCode: '',
      itemName: '',
      registerResource: [],
      resourceDetailId: '',
      resourceCode: '',
      resourceDescription:'',
      overwrite: ''
    }
  });

  useEffect(() => {
    if (getValues('applyTarget') === 'PARTIAL') {
      setValue('registerLocation', ['Y']);
      setValue('registerItem', []);
      setValue('registerResource', []);
    } else {
      setValue('registerLocation', []);
      setValue('registerItem', []);
      setValue('registerResource', []);
    }
  }, [watch('applyTarget')]);

  useEffect(() => {
    if (getValues('registerLocation').includes('Y')) {
      setValue('registerItem', []);
      setValue('registerResource', []);
    } else {
      setValue('locationManagementId', '');
      setValue('locationType', '');
      setValue('locationLevel', '');
      setValue('locationCode', '');
      setValue('locationName', '');
    }
  }, [watch('registerLocation')]);

  useEffect(() => {
    if (getValues('registerItem').includes('Y')) {
      setValue('registerLocation', []);
      setValue('registerResource', []);
    } else {
      setValue('itemMasterId', '');
      setValue('itemCode', '');
      setValue('itemName', '');
    }
  }, [watch('registerItem')]);

  useEffect(() => {
    if (getValues('registerResource').includes('Y')) {
      setValue('registerLocation', []);
      setValue('registerItem', []);
    } else {
      setValue('resourceDetailId', '');
      setValue('resourceCode', '');
      setValue('resourceDescription', '');
    }
  }, [watch('registerResource')]);

  function bundleCreate() {
    let formData = new FormData();

    formData.append('APPLY_POINT', getValues('applyTarget'));
    formData.append('CHECK_LOCAT', getValues('registerLocation').includes('Y'));
    formData.append('LOCAT_MGMT_ID', getValues('locationManagementId'));
    formData.append('CHECK_ITEM', getValues('registerItem').includes('Y'));
    formData.append('ITEM_MST_ID', getValues('itemMasterId'));
    formData.append('CHECK_RES', getValues('registerResource').includes('Y'));
    formData.append('RES_ID', getValues('resourceDetailId'));
    formData.append('OVERWRITE_DATA_YN', getValues('overwrite').includes('Y'));
    formData.append('USER_ID', username);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_08_BATCH',
      data: formData,
      fromPopup: true
    })
    .then(function (res) {
      if (res.data.RESULT_SUCCESS) {
        showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_MP_08_BATCH_P_RT_MSG), { close: false });
        props.confirm();
      } else {
        showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
      }

      props.onClose();
    })
    .catch(function (err) {
      console.error(err);
    });
  }

  function openLocationPopup() {
    setLocationPopupOpen(true);
  }

  function closeLocationPopup() {
    setLocationPopupOpen(false);
  }

  function onSetLocation(gridRow) {
    setValue('locationManagementId', gridRow.LOCAT_MGMT_ID);
    setValue('locationType', gridRow.LOCAT_TP_NM);
    setValue('locationLevel', gridRow.LOCAT_LV);
    setValue('locationCode', gridRow.LOCAT_CD);
    setValue('locationName', gridRow.LOCAT_NM);
  }

  function openItemPopup() {
    setItemPopupOpen(true);
  }

  function closeItemPopup() {
    setItemPopupOpen(false);
  }

  function onSetItem(gridRow) {
    setValue('itemMasterId', gridRow[0].ITEM_MST_ID);
    setValue('itemCode', gridRow[0].ITEM_CD);
    setValue('itemName', gridRow[0].ITEM_NM);
  }

  function openResourcePopup() {
    setResourcePopupOpen(true);
  }

  function closeResourcePopup() {
    setResourcePopupOpen(false);
  }

  function onSetResource(gridRow) {
    setValue('resourceDetailId', gridRow.RES_MGMT_DTL_ID);
    setValue('resourceCode', gridRow.RES_CD);
    setValue('resourceDescription', gridRow.RES_DESCRIP);
  }

  return (
    <>
      <PopupDialog open={props.open} onClose={props.onClose} onSubmit={bundleCreate} title='POP_UI_MP_08_05' resizeWidth={500} resizeHeight={720}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs indicatorColor="primary" value="info">
            <Tab label={transLangKey("LOCAT_ITEM_RES_INFO")} value="info" />
          </Tabs>
        </Box>

        <Box style={{ marginTop: "5px", border: "1px solid #dde1ee", width: "100%", height: "100%", padding: "6px 12px"}}>
          <Box>
            <InputField type="radio" name="applyTarget" control={control} options={[{ label: transLangKey("ALL_APPLY"), value: "ALL" }, { label: transLangKey("PARTIAL_APPLY"), value: "PARTIAL" }]} />
          </Box>
          <Box>
            <InputField type="check" name="registerLocation" control={control} options={[{ label: transLangKey("LOCAT_REGISTRY"), value: "Y" }]} disabled={getValues("applyTarget") !== "PARTIAL"} />
          </Box>
          <Box>
            <InputField type="action" name="locationType" label={transLangKey("LOCAT_TP_NM")} onClick={openLocationPopup} control={control} disabled={!getValues('registerLocation').includes('Y')} readonly={true}>
              <Icon.Search />
            </InputField>
            <InputField name="locationLevel" label={transLangKey("LOCAT_LV")} control={control} disabled={!getValues('registerLocation').includes('Y')} readonly={true} />
            <InputField name="locationCode" label={transLangKey("LOCAT_CD")} control={control} disabled={!getValues('registerLocation').includes('Y')} readonly={true} />
            <InputField name="locationName" label={transLangKey("LOCAT_NM")} control={control} disabled={!getValues('registerLocation').includes('Y')} readonly={true} />
          </Box>
          <Box>
            <InputField type="check" name="registerItem" control={control} options={[{ label: transLangKey("ITEM_REGISTRY"), value: "Y" }]} disabled={getValues("applyTarget") !== "PARTIAL"} />
          </Box>
          <Box>
            <InputField type="action" name="itemCode" label={transLangKey("ITEM_CD")} onClick={openItemPopup} control={control} disabled={!getValues('registerItem').includes('Y')} readonly={true}>
              <Icon.Search />
            </InputField>
            <InputField name="itemName" label={transLangKey("ITEM_NM")} control={control} disabled={!getValues('registerItem').includes('Y')} readonly={true} />
          </Box>
          <Box>
            <InputField type="check" name="registerResource" control={control} options={[{ label: transLangKey("RES_REGISTRY"), value: "Y" }]} disabled={getValues("applyTarget") !== "PARTIAL"} />
          </Box>
          <Box>
            <InputField type="action" name="resourceCode" label={transLangKey("RES_CD")} onClick={openResourcePopup} control={control} disabled={!getValues('registerResource').includes('Y')} readonly={true}>
              <Icon.Search />
            </InputField>
            <InputField name="resourceDescription" label={transLangKey("RES_DESCRIP")} control={control} disabled={!getValues('registerResource').includes('Y')} readonly={true} />
          </Box>
          <hr />
          <Box>
            <InputField type="check" name="overwrite" control={control} options={[{ label: transLangKey("OVERWRITE_EXIST_DATA"), value: "Y" }]} />
          </Box>
        </Box>
      </PopupDialog>

      <PopLocatTp open={locationPopupOpen} onClose={closeLocationPopup} confirm={onSetLocation} />
      <PopCommItem open={itemPopupOpen} onClose={closeItemPopup} confirm={onSetItem} />
      <PopResource open={resourcePopupOpen} onClose={closeResourcePopup} confirm={onSetResource} />
    </>
  )
}

export default PopItemResPreferenceBundleCreate;
