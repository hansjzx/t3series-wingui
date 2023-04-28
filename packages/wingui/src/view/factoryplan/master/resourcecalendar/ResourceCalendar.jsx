import React, { useCallback, useEffect, useState } from 'react';
import {
  ContentInner,
  InputField,
  ResultArea,
  SearchArea,
  SearchRow,
  useIconStyles,
  useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';
import { IconButton } from '@mui/material';
import { useForm } from 'react-hook-form';
import {
  TimelineView, DayView, WeekView, MonthView, Scheduler, SchedulerViewSlot,
  useSchedulerEditSlotFormItemContext
} from '@progress/kendo-react-scheduler';
import { CustomViewItem, CustomEditItem, CustomItem, WeekViewCustomDateHeaderCell, MonthViewCustomSlot } from './CustomComponent';
import { IntlProvider, load, loadMessages, LocalizationProvider } from "@progress/kendo-react-intl";
import { Day } from "@progress/kendo-date-math";
import likelySubtags from "cldr-core/supplemental/likelySubtags.json";
import currencyData from "cldr-core/supplemental/currencyData.json";
import weekData from "cldr-core/supplemental/weekData.json";
import koNumbers from "cldr-numbers-full/main/ko/numbers.json";
import koCaGregorian from "cldr-dates-full/main/ko/ca-gregorian.json";
import koDateFields from "cldr-dates-full/main/ko/dateFields.json";
import koTimeZoneNames from "cldr-dates-full/main/ko/timeZoneNames.json";
import jaNumbers from "cldr-numbers-full/main/ja/numbers.json";
import jaCaGregorian from "cldr-dates-full/main/ja/ca-gregorian.json";
import jaDateFields from "cldr-dates-full/main/ja/dateFields.json";
import jaTimeZoneNames from "cldr-dates-full/main/ja/timeZoneNames.json";
import zhNumbers from "cldr-numbers-full/main/zh/numbers.json";
import zhCaGregorian from "cldr-dates-full/main/zh/ca-gregorian.json";
import zhDateFields from "cldr-dates-full/main/zh/dateFields.json";
import zhTimeZoneNames from "cldr-dates-full/main/zh/timeZoneNames.json";
import CalendarCopyPopup from "./CalendarCopyPopup";
import { EditEventDialog } from "./EditEventDialog";
import '@progress/kendo-theme-default/dist/all.css';
import './resourcecalendar.css';
import message from "./message.json";
import { showMessage, transLangKey } from "@wingui";

const languageCode = localStorage.getItem('languageCode');
const CYCLE_TP = {
  "D": "DAILY",
  "W": "WEEKLY",
  "M": "MONTHLY"
};
load(
  likelySubtags,
  currencyData,
  weekData,
  koNumbers, koCaGregorian, koDateFields, koTimeZoneNames,
  jaNumbers, jaCaGregorian, jaDateFields, jaTimeZoneNames,
  zhNumbers, zhCaGregorian, zhDateFields, zhTimeZoneNames
);
loadMessages(message[languageCode], languageCode);

function ResourceCalendar() {
  const iconClasses = useIconStyles();
  const { control, getValues, watch } = useForm({
    defaultValues: { resourceParam: '', }
  });
  const [setViewInfo] = useViewStore(state => [state.setViewInfo]);
  const [data, setData] = useState([]);
  const [selectOptions, setSelectOptions] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const resourceWatch = watch('resourceParam');
  const globalButtons = [
    {
      name: "search",
      action: () => loadData(),
      visible: true,
      disable: false
    }
  ];
  const CustomViewSlot = (props) => {
    const [, setFormItem] = useSchedulerEditSlotFormItemContext();
    const createDataItemFromSlot = useCallback(() => {
      const dataItem = {};
      dataItem.start = new Date(props.start.getTime());
      dataItem.startTime = new Date(props.start.getTime());
      dataItem.end = new Date(new Date(props.end.getTime()));
      dataItem.endTime = new Date(new Date(props.end.getTime()));
      return dataItem;
    }, [props.end, props.start]);
    const handleClick = useCallback(
      (event) => {
        if (getValues('resourceParam')) {
          const dataItem = createDataItemFromSlot();
          setFormItem(dataItem);
          if (props.onClick) {
            props.onClick(event);
          }
        } else {
          showMessage(transLangKey('WARNING'), transLangKey('FP_MSG_NO_RESOURCE_SELECT'), { close: false });
        }
      },
      [createDataItemFromSlot, props, setFormItem]
    );
    return <SchedulerViewSlot onClick={handleClick} {...props} />;
  }
  
  useEffect(() => {
    if (resourceWatch) {
     loadData(); 
    }
  }, [resourceWatch]);

  useEffect(() => {
    setViewInfo(vom.active, 'globalButtons', globalButtons);
    zAxios.get(baseURI() + 'factoryplan/master/resource/resources', {
      params: {
        'resource': ''
      },
      waitOn: false
    })
      .then(function (res) {
        const options = res.data.map(data => ({ label: data.resourceCd, value: data.resourceCd }));
        setSelectOptions(options);
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
      });
  }, []);

  function loadData() {
    zAxios.get(baseURI() + 'factoryplan/master/resource-calendar/events', {
      params: {
        'resource': getValues('resourceParam')
      }
    })
      .then(function (res) {
        const data = res.data;
        data.forEach((dataItem) => {
          dataItem['id'] = dataItem.periodCd;
          dataItem['start'] = new Date(dataItem.start);
          dataItem['end'] = new Date(dataItem.end);
          dataItem['startTime'] = new Date(dataItem.start);
          dataItem['endTime'] = new Date(dataItem.start);
          if (dataItem.cycleTp && CYCLE_TP[dataItem.cycleTp]) {
            let recurrenceRule = `FREQ=${CYCLE_TP[dataItem.cycleTp]}`;
            if (dataItem.cycleTp === 'W') {
              const week = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
              recurrenceRule += `;BYDAY=${week[new Date(dataItem.start).getDay()]}`;              
            } else if (dataItem.cycleTp === 'M') {
              recurrenceRule += `;BYMONTHDAY=${new Date(dataItem.start).getDate()}`;
            }
            dataItem['recurrenceRule'] = recurrenceRule;
          }
          if (dataItem['calendarTp'] === 'A') {
            dataItem['calendarTp'] = true;
          } else if (dataItem['calendarTp'] === 'D') {
            dataItem['calendarTp'] = false;
          }
        });
        setData(data);
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
      });
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      loadData();
    }
  }
  
  const handleDataChange = ({ created, updated, deleted }) => {
    if (deleted.length > 0) {
      const deleteEvent = deleted[0];
      const deleteData = {
        'resourceCd': getValues('resourceParam'),
        'periodCd': deleteEvent.periodCd
      };

      let formData = new FormData();
      formData.append('changes', JSON.stringify(deleteData));
      
      zAxios({
        method: 'post',
        url: baseURI() + 'factoryplan/master/resource-calendar/events/delete',
        headers: { 'content-type': 'application/json' },
        data: formData
      }).then(function (response) {
      }).catch(function (err) {
        console.log(err);
      }).then(function () {
        loadData();
      });
    } else {
      let saveEvent;
      if (created.length > 0) {
        saveEvent = created[0];
        saveEvent['resourceCd'] = getValues('resourceParam');
      } else {
        saveEvent = updated[0];
      }
      const rgbToHex = (rgba) => {
        const trim = (str) => str.replace(/^\s+|\s+$/gm, ''),
              colorToHex = (color) => {
            const hexadecimal = Number(color).toString(16);
            return hexadecimal.length === 1 ? '0' + hexadecimal : hexadecimal;
          }
        let parts = rgba.substring(rgba.indexOf("(")).split(','),
          r = parseInt(trim(parts[0].substring(1)), 10),
          g = parseInt(trim(parts[1]), 10),
          b = parseInt(trim(parts[2]), 10);
        return ('#' + colorToHex(r) + colorToHex(g) + colorToHex(b));
      }
      
      saveEvent.start.setHours(saveEvent.startTime.getHours());
      saveEvent.start.setMinutes(saveEvent.startTime.getMinutes());
      saveEvent.end.setHours(saveEvent.endTime.getHours());
      saveEvent.end.setMinutes(saveEvent.endTime.getMinutes());
      const convertDateFormat = (dt) => (dt instanceof Date) ? dt.format('yyyy-MM-ddTHH:mm:ss') : dt;
      saveEvent.start = convertDateFormat(saveEvent.start);
      saveEvent.end = convertDateFormat(saveEvent.end);
      saveEvent.displayColor = (saveEvent.displayColor && saveEvent.displayColor.includes('rgba(')) ? rgbToHex(saveEvent.displayColor) : saveEvent.displayColor;
      saveEvent.calendarTp = (saveEvent.calendarTp) ? 'A' : 'D';

      let formData = new FormData();
      formData.append('changes', JSON.stringify(saveEvent));

      let url = baseURI() + 'factoryplan/master/resource-calendar/events';
      if (saveEvent.copyToAllResource) {
        url += '/copy';
      }
      zAxios({
        method: 'post',
        url,
        headers: { 'content-type': 'application/json' },
        data: formData
      }).then(function (response) {
      }).catch(function (err) {
        console.log(err);
      }).then(function () {
        loadData();
      });
    }
  };
  
  function openCalendarCopyPopup() {
    if (!getValues('resourceParam')) {
      showMessage(transLangKey('WARNING'), transLangKey('FP_MSG_NO_RESOURCE_SELECT'), { close: false });
    } else {
      setPopupVisible(true);
    }
  }

  return (
    <>
      <CalendarCopyPopup open={popupVisible} selectedResource={getValues('resourceParam')} onClose={() => setPopupVisible(false)}></CalendarCopyPopup>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <InputField type="select" control={control} options={selectOptions} label={transLangKey("FP_RESOURCE")} name="resourceParam" onKeyPress={handleKeyPress} />
            <IconButton onClick={openCalendarCopyPopup} className={iconClasses.iconButton} title={transLangKey("FP_COPY_CALENDAR")}>
              <Icon.Copy />
            </IconButton>
          </SearchRow>
        </SearchArea>
        <ResultArea>
          <LocalizationProvider language={languageCode}>
            <IntlProvider locale={languageCode}>
              <Scheduler data={data} onDataChange={handleDataChange} item={CustomItem} viewItem={CustomViewItem} editItem={CustomEditItem} viewSlot={CustomViewSlot}
                         editable={{ add: true, remove: true, drag: true, resize: false, edit: true, select: true }}
                         form={EditEventDialog} footer={ () => <React.Fragment /> } height="100%"
              >
                <MonthView itemsPerSlot={5} slot={MonthViewCustomSlot} />
                <WeekView showWorkHours={false} dateHeaderCell={WeekViewCustomDateHeaderCell} workDayStart={"00:00"} workDayEnd={"23:59"} workWeekStart={Day.Saturday} workWeekEnd={Day.Saturday} />
                <DayView showWorkHours={false} workDayStart={"00:00"} workDayEnd={"23:59"} workWeekStart={Day.Saturday} workWeekEnd={Day.Sunday} />
                <TimelineView showWorkHours={false} workDayStart={"00:00"} workDayEnd={"23:59"} />
              </Scheduler>
            </IntlProvider>
          </LocalizationProvider>
        </ResultArea>
      </ContentInner>
    </>
  )
}

export default ResourceCalendar;
