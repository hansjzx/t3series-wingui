import React, { useState, useEffect, useContext, useRef } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { Box, Stack } from "@mui/material";
import { FormArea, FormItem, FormRow, SplitPanel, InputField, CommonButton, PopupDialog, useStyles, zAxios } from "@zionex/wingui-core/src/common/imports";
import { transLangKey } from "@wingui";
import { nvl } from "@wingui/view/demandplan/DpUtil";

let operatorOptions = [
  { label: "*", value: "multiple" },
  { label: "+", value: "add" },
  { label: "-", value: "minus" },
  { label: "/", value: "divide" },
];

function popMeasureCopy(props) {
  const [fromMOptions, setFromMOptions] = useState([]);
  const [toMOptions, setToMOptions] = useState([]);

  const {
    handleSubmit,
    getValues,
    setValue,
    watch,
    control,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: {
      fromDate: null,
      toDate: null,
      spinValue: 1,
      operator: "multiple",
    },
  });

  useEffect(() => {
    if (props.open && props.measureInfo) {
      const measureInfo = props.measureInfo;

      let sourceOptions = [];
      let targetOptions = [];

      measureInfo.map((entry, idx) => {
        sourceOptions.push({ label: transLangKey(entry.MEASURE_CD), value: nvl(entry.MEASURE_CD) });
      });

      measureInfo
        .filter(function (row) {
          return row.INPUT_YN;
        })
        .map((entry, idx) => {
          targetOptions.push({ label: transLangKey(entry.MEASURE_CD), value: nvl(entry.MEASURE_CD) });
        });

      setFromMOptions(sourceOptions);
      if (sourceOptions.length > 0) setValue("sourceMeasure", sourceOptions[0].value);

      setToMOptions(targetOptions);
      if (targetOptions.length > 0) setValue("targetMeasure", targetOptions[0].value);
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

  const onPopupSubmit = () => {
    let data = {
      fromDate: getValues("fromDate"),
      toDate: getValues("toDate"),
      spinValue: getValues("spinValue"),
      operator: getValues("operator"),
      sourceMeasure: getValues("sourceMeasure"),
      targetMeasure: getValues("targetMeasure"),
    };
    if (!data.sourceMeasure || !data.targetMeasure || !data.operator || !data.spinValue) {
      showMessage(transLangKey("WARNING"), transLangKey("MSG_0006"));
      return;
    }

    if (props.confirm) props.confirm(data);
  };

  return (
    <PopupDialog
      open={props.open}
      onClose={props.onClose}
      onSubmit={handleSubmit(onPopupSubmit, onError)}
      title="Measure Copy"
      checks={[]}
      resizeHeight={400}
      resizeWidth={380}
      buttons={
        <>
          <CommonButton
            width="60px"
            onClick={() => {
              onPopupSubmit();
            }}>
            {transLangKey("COPY")}
          </CommonButton>
          <CommonButton width="60px" onClick={props.onClose}>
            {transLangKey("CANCEL")}
          </CommonButton>
        </>
      }>
      <Box sx={{ display: "flex", height: "100%", flexDirection: "column", alignContent: "stretch", alignItems: "stretch" }}>
        <FormArea submit={handleSubmit(onPopupSubmit, onError)}>
          <FormRow>
            <FormItem label={transLangKey("FROM_DATE")} labelStyle={{ minWidth: "150px" }} style={{ height: "100%" }}>
              <InputField name="fromDate" type="datetime" dateformat="yyyy-MM-dd" readonly={false} disabled={false} control={control} />
            </FormItem>
          </FormRow>
          <FormRow>
            <FormItem label={transLangKey("TO_DATE")} labelStyle={{ minWidth: "150px" }} style={{ height: "100%" }}>
              <InputField name="toDate" type="datetime" dateformat="yyyy-MM-dd" control={control} />
            </FormItem>
          </FormRow>
          <FormRow>
            <FormItem label={transLangKey("FROM_MEASURE")} labelStyle={{ minWidth: "150px" }} style={{ height: "100%" }}>
              <InputField type="select" name="sourceMeasure" control={control} options={fromMOptions} />
            </FormItem>
          </FormRow>
          <FormRow>
            <FormItem label={transLangKey("APPY_RATE")} labelStyle={{ minWidth: "150px" }} style={{ height: "100%" }}>
              <Stack direction={"row"} spacing={1}>
                <InputField dataType="number" name="spinValue" min="0" step="0.1" control={control} clearIcon={false} width={"100px"} />
                <InputField type="select" name="operator" control={control} options={operatorOptions} width={"80px"} style={{ margin: "1px" }} />
              </Stack>
            </FormItem>
          </FormRow>
          <FormRow>
            <FormItem label={transLangKey("TO_MEASURE")} labelStyle={{ minWidth: "150px" }} style={{ height: "100%" }}>
              <InputField type="select" name="targetMeasure" control={control} options={toMOptions} />
            </FormItem>
          </FormRow>
        </FormArea>
      </Box>
    </PopupDialog>
  );
}

popMeasureCopy.propTypes = {
  viewCd: PropTypes.string.isRequired,
};

popMeasureCopy.displayName = "popMeasureCopy";

export default popMeasureCopy;
