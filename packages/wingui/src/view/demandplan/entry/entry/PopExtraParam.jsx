import React, { useState, useEffect, useContext, useRef } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { Box } from "@mui/material";
import { FormArea, InputField, GroupBox, PopupDialog } from "@zionex/wingui-core/src/common/imports";
import { transLangKey } from "@wingui";

let operatorOptions = [
  { label: "*", value: "multiple" },
  { label: "/", value: "divide" },
  { label: "+", value: "add" },
  { label: "-", value: "minus" },
];

function popExtraParam(props) {
  const {
    handleSubmit,
    getValues,
    setValue,
    watch,
    control,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: props.extraParamData,
  });

  useEffect(() => {
    if (props.open) {
      if (props.extraParamData) {
        const param = props.extraParamData;
        setValue("ITEM_ATTR_01", param.ITEM_ATTR_01);
        setValue("ITEM_ATTR_02", param.ITEM_ATTR_02);
        setValue("ITEM_ATTR_03", param.ITEM_ATTR_03);
        setValue("ACCT_ATTR_01", param.ACCT_ATTR_01);
        setValue("ACCT_ATTR_02", param.ACCT_ATTR_02);
        setValue("ACCT_ATTR_03", param.ACCT_ATTR_03);
        setValue("GRADE", param.GRADE);
        setValue("COV", param.COV);
      }
    }
  }, [props.open]);

  const onError = (errors, e) => {
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey("WARNING"), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  };

  // popup 확인
  const onPopupSubmit = (data) => {
    props.confirm(data);
    props.onClose(false);
  };

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(onPopupSubmit, onError)} title="Extra Attr" resizeHeight={520} resizeWidth={380}>
      <Box sx={{ display: "flex", height: "100%", flexDirection: "column", alignContent: "stretch", alignItems: "stretch" }}>
        <FormArea submit={handleSubmit(onPopupSubmit, onError)}>
          <GroupBox label="Item Attribute">
            <InputField displaySize="small" type="select" name="GRADE" label={"GRADE"} control={control} options={props.itemGradeOptions} />
            <InputField displaySize="small" type="select" name="COV" label={"COV"} control={control} options={props.itemCovOptions} />

            <InputField displaySize="small" name="ITEM_ATTR_01" label={transLangKey("ITEM_ATTR_01")} control={control} />
            <InputField displaySize="small" name="ITEM_ATTR_02" label={transLangKey("ITEM_ATTR_02")} control={control} />
            <InputField displaySize="small" name="ITEM_ATTR_03" label={transLangKey("ITEM_ATTR_03")} control={control} />
          </GroupBox>
          <GroupBox label="Account Attribute">
            <InputField displaySize="small" name="ACCT_ATTR_01" label={transLangKey("ACCOUNT_ATTR_01")} control={control} />
            <InputField displaySize="small" name="ACCT_ATTR_02" label={transLangKey("ACCOUNT_ATTR_02")} control={control} />
            <InputField displaySize="small" name="ACCT_ATTR_03" label={transLangKey("ACCOUNT_ATTR_03")} control={control} />
          </GroupBox>
        </FormArea>
      </Box>
    </PopupDialog>
  );
}

popExtraParam.propTypes = {
  viewCd: PropTypes.string.isRequired,
};

popExtraParam.displayName = "popExtraParam";

export default popExtraParam;
