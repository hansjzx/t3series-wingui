import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { InputField } from '@zionex/wingui-core/src/common/imports';


import PopCommAccount from './PopCommAccount';

export function AccountSearchCondition(props, ref) {
  const [fields, setFields] = useState([]);
  const [accountPopupOpen, setAccountPopupOpen] = useState(false);
  const { reset, control, getValues, setValue } = useForm({
    defaultValues: {
      accountCode: '',
      accountName: ''
    }
  });

  useImperativeHandle(ref, () => ({
    setField(field) {
      setFields(field);
    },

    getAccountCode() {
      return getValues('accountCode');
    },

    getAccountName() {
      return getValues('accountName');
    },

    reset() {
      reset();
    }
  }));

  function openAccountPopup() {
    setAccountPopupOpen(true);
  }

  function closeAccountPopup() {
    setAccountPopupOpen(false);
  }

  function onSetAccount(gridRows) {
    setValue('accountCode', gridRows.ACCOUNT_CD);
    setValue('accountName', gridRows.ACCOUNT_NM);
  }

  function setSearchConditionType() {
    return (
      <>
      <InputField type="action" name="accountCode" label={transLangKey("ACCOUNT_CD")} onClick={openAccountPopup} control={control} style={{ display: fields.length !== 0 && !(fields.includes("code") || fields.includes("cd")) ? "none" : "inline-block" }}>
        <Icon.Search />
      </InputField>
      <InputField name="accountName" label={transLangKey("ACCOUNT_NM")} control={control} style={{ display: fields.length !== 0 && !(fields.includes("name") || fields.includes("nm")) ? "none" : "inline-block" }} />
      </>
      )
  }

  return (
    <>
      {setSearchConditionType()}
      {accountPopupOpen && (<PopCommAccount open={accountPopupOpen} onClose={closeAccountPopup} confirm={onSetAccount}></PopCommAccount>)}
    </>
  )
}

export default forwardRef(AccountSearchCondition);
