import React, { useCallback } from "react";
import { SchedulerForm, useSchedulerFieldsContext } from "@progress/kendo-react-scheduler";
import { Field, FormElement } from "@progress/kendo-react-form";
import { Input, Checkbox, ColorPicker } from "@progress/kendo-react-inputs";
import { Error } from "@progress/kendo-react-labels";
import { Dialog } from "@progress/kendo-react-dialogs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { DatePicker, TimePicker } from "@progress/kendo-react-dateinputs";
import { initI18n, transLangKey } from "@wingui";

initI18n(localStorage.getItem('languageCode'));

let dataItem = null;
const cycleTpList =  [
  {
    label: transLangKey("FP_NOT_REPEAT"),
    value: "1",
  },
  {
    label: transLangKey("FP_REPEAT_DAILY"),
    value: "D",
  },
  {
    label: transLangKey("FP_REPEAT_WEEKLY"),
    value: "W",
  },
  {
    label: transLangKey("FP_REPEAT_MONTHLY"),
    value: "M",
  },
];

const CycleTpEditor = (props) => {
  const handleChange = (event) => {
    if (props.onChange) {
      props.onChange.call(undefined, {
        value: event.value.value,
      });
    }
  };
  return (
    <DropDownList
      onChange={handleChange}
      value={cycleTpList.find((t) => t.value === props.value)}
      defaultValue={cycleTpList[0]}
      data={cycleTpList}
      dataItemKey={"value"}
      textField={"label"}
      style={{width: "200px"}}
    />
  );
};
const TitleInput = (fieldRenderProps) => {
  const { validationMessage, visited, ...others } = fieldRenderProps;
  return (
    <div>
      <Input {...others} />
      {visited && validationMessage && <Error>{validationMessage}</Error>}
    </div>
  );
};
const CustomDialog = (props) => {
  return <Dialog {...props} title={transLangKey((dataItem.id) ? "MODIFY" : "ADD")} />;
}
const CustomFormEditor = (props) => {
  return (
    <FormElement>
      <div className="k-form-field">
        <div className="k-form-field-wrap">
          <Field
            label={transLangKey("DESCRIP")}
            name={"title"}
            placeholder={transLangKey("FP_MSG_ENTER_DESCRIP")}
            component={TitleInput}
          />
        </div>
      </div>
      <div className="k-form-field start-end-form d-flex">
        <div>
          <Field
            label={transLangKey("FP_START_DT")}
            name={"start"}
            component={DatePicker}
            width={"125px"}
            format={"yyyy-MM-dd"}
          />
          <Field
            label={" "}
            name={"startTime"}
            component={TimePicker}
            width={"113px"}
            format={"hh:mm a"}
          />
          {
            ((props.errors.start) && <Error>{props.errors.start}</Error>) ||
            ((props.errors.startTime) && <Error>{props.errors.startTime}</Error>)
          }
        </div>
        <div style={{padding: "24px 10px 0px"}}> ~ </div>
        <div>
          <Field
            label={transLangKey("FP_END_DT")}
            name={"end"}
            component={DatePicker}
            width={"125px"}
            format={"yyyy-MM-dd"}
          />
          <Field
            label={" "}
            name={"endTime"}
            component={TimePicker}
            width={"113px"}
            format={"hh:mm a"}
          />
          {
            (props.errors.end) && <Error>{props.errors.end}</Error> ||
            (props.errors.endTime) && <Error>{props.errors.endTime}</Error>
          }
        </div>        
      </div>
      <div className="k-form-field">
        <Field
          id={"form-cycleTp"}
          name={"cycleTp"}
          component={CycleTpEditor}
        />
      </div>
      <div className="k-form-field">
        <Field
          id={"form-calendarTp"}
          name={"calendarTp"}
          label={transLangKey("FP_WORK_YN")}
          component={Checkbox}
        />
        <Field
          id={"form-displayColor"}
          name={"displayColor"}
          component={ColorPicker}
          defaultValue={"rgba(79, 129, 189, 1)"}
          view="gradient" gradientSettings={{ opacity: false }}
        />
      </div>
      {dataItem.id && <div className="k-form-field">
        <Field
          name={"copyToAllResource"}
          label={transLangKey("FP_COPY_EVENT")}
          component={Checkbox}
        />
      </div>
      }
    </FormElement>
  );
};

export const EditEventDialog = (props) => {
  dataItem = props.dataItem;
  const fields = useSchedulerFieldsContext();
  const requiredValidator = useCallback(
    (value) => (!value ? transLangKey("FP_MSG_FIELD_REQUIRED") : undefined),
    []
  );
  const rangeLimitValidator = useCallback(
    (start, startTime, end, endTime) => {
      if (start instanceof Date && end instanceof Date && startTime instanceof Date && endTime instanceof Date) {
        start.setHours(startTime.getHours());
        start.setMinutes(startTime.getMinutes());
        end.setHours(endTime.getHours());
        end.setMinutes(endTime.getMinutes());
        return (start > end) ? transLangKey("FP_MSG_TIME_RANGE_LIMIT") : undefined;
      }
    },
    []
  );
  const customValidator = useCallback(
    (_dataItem, formValueGetter) => {
      let result = {};
      result[fields.title] = [
        requiredValidator(formValueGetter(fields.title))
      ]
        .filter(Boolean)
        .reduce((current, acc) => current || acc, '');
      result[fields.start] = [
        requiredValidator(formValueGetter(fields.start)),
        rangeLimitValidator(formValueGetter(fields.start), formValueGetter('startTime'), formValueGetter(fields.end), formValueGetter('endTime'))
      ]
        .filter(Boolean)
        .reduce((current, acc) => current || acc, '');
      result['startTime'] = [
        requiredValidator(formValueGetter('startTime')),
      ]
        .filter(Boolean)
        .reduce((current, acc) => current || acc, '');
      result[fields.end] = [
        requiredValidator(formValueGetter(fields.end))
      ]
        .filter(Boolean)
        .reduce((current, acc) => current || acc, '');
      result['endTime'] = [
        requiredValidator(formValueGetter('endTime'))
      ]
        .filter(Boolean)
        .reduce((current, acc) => current || acc, '');
      return result;
    },
    [fields, requiredValidator]
  );
  
  return (
    <SchedulerForm
      {...props}
      editor={CustomFormEditor}
      dialog={CustomDialog}
      validator={customValidator}
    />
  );
};
