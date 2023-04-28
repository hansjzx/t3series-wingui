import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { InputField } from '@zionex/wingui-core/src/common/imports';

import PopLocatTp from '@wingui/view/common/PopLocatTp';

export function LocationSearchCondition(props, ref) {
  const [fields, setFields] = useState([]);
  const [locationPopupOpen, setLocationPopupOpen] = useState(false);
  const { reset, control, getValues, setValue } = useForm({
    defaultValues: {
      locationMstId: '',
      locationId: '',
      locationTypeId: '',
      locationMgmtId: '',
      locationType: '',
      locationLevel: '',
      locationCode: '',
      locationName: ''
    }
  });

  useImperativeHandle(ref, () => ({
    setField(field) {
      setFields(field);
    },

    getLocationMstId() {
      return getValues('locationMstId');
    },

    getLocationId() {
      return getValues('locationId');
    },

    getLocationTypeId() {
      return getValues('locationTypeId');
    },

    getLocationMgmtId() {
      return getValues('locationMgmtId');
    },

    getLocationType() {
      return getValues('locationType');
    },

    getLocationLevel() {
      return getValues('locationLevel');
    },

    getLocationCode() {
      return getValues('locationCode');
    },

    getLocationName() {
      return getValues('locationName');
    },

    reset() {
      reset();
    }
  }));

  function openLocationPopup() {
    setLocationPopupOpen(true);
  }

  function closeLocationPopup() {
    setLocationPopupOpen(false);
  }

  function onSetLocation(gridRow) {
    setValue('locationMstId', gridRow.LOCAT_MST_ID);
    setValue('locationId', gridRow.LOCAT_ID);
    setValue('locationTypeId', gridRow.LOCAT_TP_ID);
    setValue('locationMgmtId', gridRow.LOCAT_MGMT_ID);
    setValue('locationType', gridRow.LOCAT_TP_NM);
    setValue('locationLevel', gridRow.LOCAT_LV);
    setValue('locationCode', gridRow.LOCAT_CD);
    setValue('locationName', gridRow.LOCAT_NM);
  }

  function setSearchConditionType() {
    switch (props.type) {
      case 'consume':
        return (
          <>
            <InputField type="action" name="locationType" onClick={openLocationPopup} label={transLangKey("CONSUME_LOCAT_TP_NM")} control={control} style={{ display: fields.length !== 0 && !(fields.includes("type") || fields.includes("tp")) ? "none" : "inline-block" }}>
              <Icon.Search />
            </InputField>
            <InputField name="locationLevel" label={transLangKey("CONSUME_LOCAT_LV")} readonly={props.readonly ? props.readonly : false} control={control} style={{ display: fields.length !== 0 && !(fields.includes("level") || fields.includes("lv")) ? "none" : "inline-block" }} />
            <InputField name="locationCode" label={transLangKey("CONSUME_LOCAT_CD")} readonly={props.readonly ? props.readonly : false} control={control} style={{ display: fields.length !== 0 && !(fields.includes("code") || fields.includes("cd")) ? "none" : "inline-block" }} />
            <InputField name="locationName" label={transLangKey("CONSUME_LOCAT_NM")} readonly={props.readonly ? props.readonly : false} control={control} style={{ display: fields.length !== 0 && !(fields.includes("name") || fields.includes("nm")) ? "none" : "inline-block" }} />
          </>
        )
      case 'supply':
        return (
          <>
            <InputField type="action" name="locationType" onClick={openLocationPopup} label={transLangKey("SUPPLY_LOCAT_TP_NM")} control={control} style={{ display: fields.length !== 0 && !(fields.includes("type") || fields.includes("tp")) ? "none" : "inline-block" }}>
              <Icon.Search />
            </InputField>
            <InputField name="locationLevel" label={transLangKey("SUPPLY_LOCAT_LV")} readonly={props.readonly ? props.readonly : false} control={control} style={{ display: fields.length !== 0 && !(fields.includes("level") || fields.includes("lv")) ? "none" : "inline-block" }} />
            <InputField name="locationCode" label={transLangKey("SUPPLY_LOCAT_CD")} readonly={props.readonly ? props.readonly : false} control={control} style={{ display: fields.length !== 0 && !(fields.includes("code") || fields.includes("cd")) ? "none" : "inline-block" }} />
            <InputField name="locationName" label={transLangKey("SUPPLY_LOCAT_NM")} readonly={props.readonly ? props.readonly : false} control={control} style={{ display: fields.length !== 0 && !(fields.includes("name") || fields.includes("nm")) ? "none" : "inline-block" }} />
          </>
        )
      default:
        return (
          <>
            <InputField type="action" name="locationType" label={transLangKey("LOCAT_TP_NM")} onClick={openLocationPopup} readonly={props.readonly ? props.readonly : false} disabled={props.disabled ? props.disabled.locationType : false} control={control} style={{ display: fields.length !== 0 && !(fields.includes("type") || fields.includes("tp")) ? "none" : "inline-block" }}>
              <Icon.Search />
            </InputField>
            <InputField name="locationLevel" label={transLangKey("LOCAT_LV")} readonly={props.readonly ? props.readonly : false} disabled={props.disabled ? props.disabled.locationLevel : false} control={control} style={{ display: fields.length !== 0 && !(fields.includes("level") || fields.includes("lv")) ? "none" : "inline-block" }} />
            <InputField name="locationCode" label={transLangKey("LOCAT_CD")} readonly={props.readonly ? props.readonly : false} disabled={props.disabled ? props.disabled.locationCode : false} control={control} style={{ display: fields.length !== 0 && !(fields.includes("code") || fields.includes("cd")) ? "none" : "inline-block" }} />
            <InputField name="locationName" label={transLangKey("LOCAT_NM")} readonly={props.readonly ? props.readonly : false} disabled={props.disabled ? props.disabled.locationName : false} control={control} style={{ display: fields.length !== 0 && !(fields.includes("name") || fields.includes("nm")) ? "none" : "inline-block" }} />
          </>
        )
    }
  }

  return (
    <>
      {setSearchConditionType()}
      <PopLocatTp id="cLocatTp" open={locationPopupOpen} onClose={closeLocationPopup} confirm={onSetLocation} />
    </>
  )
}

export default forwardRef(LocationSearchCondition);
