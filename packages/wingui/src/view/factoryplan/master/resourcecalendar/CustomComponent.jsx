import React, { useCallback } from 'react';
import {
  SchedulerEditItem, SchedulerItem, SchedulerSlot, SchedulerViewItem, DateHeaderCell, useSchedulerEditItemFormItemContext
} from '@progress/kendo-react-scheduler';
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import {transLangKey} from "@zionex/wingui-core/src/lang/i18n-func";

export const CustomItem = (props) => {
  if (props.itemRef.current && props.itemRef.current.element) {
    props.itemRef.current.element.title = props.children[1].props.title;
  }
  return <SchedulerItem {...props} />;
}

export const CustomViewItem = (props) => {
  const [, setFormItem] = useSchedulerEditItemFormItemContext();
  const createDataItemFromItem = useCallback(() => ({
    ...props.dataItem,
    start: new Date(new Date(props.start.getTime())),
    startTime: new Date(props.start.getTime()),
    end: new Date(new Date(props.end.getTime())),
    endTime: new Date(new Date(props.end.getTime()))
  }), [props.end, props.start, props.dataItem]);
  const handleClick = useCallback(
    (event) => {
      if (event.syntheticEvent.target.className !== 'k-icon k-i-close') {
        const dataItem = createDataItemFromItem();
        setFormItem(dataItem);
        if (props.onClick) {
          props.onClick(event);
        }
      }
    },
    [createDataItemFromItem, props, setFormItem]
  );
  return (
    <SchedulerViewItem
      {...props}
      style={{...props.style, backgroundColor: props.dataItem.displayColor}}
      onClick={handleClick}
    />
  );
}

const CustomRemoveDialog = (props) => (
  <Dialog title={transLangKey('FP_DELETE_EVENT')} onClose={props.onClose}>
    {transLangKey((props.dataItem.recurrenceId) ? 'FP_MSG_DELETE_RECUR_EVENT' : 'FP_MSG_DELETE_EVENT')}
    <DialogActionsBar>
      <button
        className="k-button k-button-md k-button-solid k-button-solid-base k-rounded-md"
        onClick={props.onCancel}
      >
        {transLangKey('CANCEL')}
      </button>
      <button
        className="k-button k-button-md k-button-solid k-button-solid-base k-rounded-md"
        onClick={props.onConfirm}
      >
        {transLangKey('DELETE')}
      </button>
    </DialogActionsBar>
  </Dialog>
);

export const CustomEditItem = (props) => (
  <SchedulerEditItem
    {...props}
    series={true}
    showRemoveDialog={true}
    showOccurrenceDialog={false}
    removeDialog={CustomRemoveDialog}
  />
);

export const WeekViewCustomDateHeaderCell = (props) => (
  <DateHeaderCell
    {...props}
    className={(props.start.format('yyyy-MM-dd') === new Date().format('yyyy-MM-dd')) ? 'today' : ''}
  />
);

export const MonthViewCustomSlot = (props) => ( 
  <SchedulerSlot 
    {...props }
    className={(props.start.format('yyyy-MM-dd') === new Date().format('yyyy-MM-dd')) ? 'today' : ''}
  />
);
