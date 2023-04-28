import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { InputField } from '@zionex/wingui-core/src/common/imports';

import PopCommItem from './PopCommItem';

export function ItemSearchCondition(props, ref) {
  const [fields, setFields] = useState([]);
  const [itemPopupOpen, setItemPopupOpen] = useState(false);
  const { reset, control, getValues, setValue } = useForm({
    defaultValues: {
      itemMasterId: '',
      itemCode: '',
      itemName: '',
      itemType: ''
    }
  });

  useImperativeHandle(ref, () => ({
    setField(field) {
      setFields(field);
    },

    getItemMasterId() {
      return getValues('itemMasterId');
    },

    getItemCode() {
      return getValues('itemCode');
    },

    getItemName() {
      return getValues('itemName');
    },

    getItemType() {
      return getValues('itemType');
    },

    reset() {
      reset();
    }
  }));

  function openItemPopup() {
    setItemPopupOpen(true);
  }

  function closeItemPopup() {
    setItemPopupOpen(false);
  }

  function onSetItem(gridRows) {
    let itemMasterIdArr = [];
    let itemCdArr = [];
    let itemNmArr = [];
    let itemTpNmArr = [];

    gridRows.forEach(function (row) {
      itemMasterIdArr.push(row.ITEM_MST_ID);
      itemCdArr.push(row.ITEM_CD);
      itemNmArr.push(row.ITEM_NM);
      itemTpNmArr.push(row.ITEM_TP_NM);
    });

    setValue('itemMasterId', itemMasterIdArr.join('|'));
    setValue('itemCode', itemCdArr.join('|'));
    setValue('itemName', itemNmArr.join('|'));
    setValue('itemType', itemTpNmArr.join('|'));
  }

  function setSearchConditionType() {
    return (
      <>
        <InputField type="action" name="itemCode" label={transLangKey("ITEM_CD")} readonly={props.readonly ? props.readonly : false} disabled={props.disabled ? props.disabled.itemCode : false} control={control} onClick={openItemPopup} style={{ display: fields.length !== 0 && !(fields.includes("code") || fields.includes("cd")) ? "none" : "inline-block" }}>
          <Icon.Search />
        </InputField>
        <InputField name="itemName" label={transLangKey("ITEM_NM")} readonly={props.readonly ? props.readonly : false} disabled={props.disabled ? props.disabled.itemName : false} control={control} style={{ display: fields.length !== 0 && !(fields.includes("name") || fields.includes("nm")) ? "none" : "inline-block" }} />
        <InputField name="itemType" label={transLangKey("ITEM_TP")} readonly={props.readonly ? props.readonly : false} disabled={props.disabled ? props.disabled.itemType : false} control={control}  style={{ display: fields.length !== 0 && !(fields.includes("type") || fields.includes("tp")) ? "none" : "inline-block" }} />
      </>
    )
  }

  return (
    <>
      {setSearchConditionType()}
      <PopCommItem id="cItem" open={itemPopupOpen} onClose={closeItemPopup} confirm={onSetItem} />
    </>
  )
}

export default forwardRef(ItemSearchCondition);
