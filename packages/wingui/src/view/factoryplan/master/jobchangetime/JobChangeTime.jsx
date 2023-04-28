import React, { useEffect, useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { ContentInner, SearchArea, SearchRow, InputField, useViewStore } from '@zionex/wingui-core/src/common/imports';
import { transLangKey } from "@wingui";

import RouteJobChangeTab from "./RouteJobChangeTab";
import RouteGroupJobChangeTab from "./RouteGroupJobChangeTab";
import ResourceJobChangeTab from "./ResourceJobChangeTab";

import ResourcePopup from "../../common/popup/ResourcePopup";

import '../../common/common.css';
import { TabContainer } from "@wingui/view/factoryplan/common/component/TabContainer";

let globalTab = 'routeJobChange';

function JobChangeTime() {
  const location = useLocation();
  const { control, getValues, setValue } = useForm({
    defaultValues: {
      resourceParam: '',
    }
  });
  const [tab, setTab] = useState('routeJobChange');
  const [setViewInfo] = useViewStore(state => [state.setViewInfo]);
  const [gridResourcePopup, setGridResourcePopup] = useState(false);
  const routeJobChangeTabRef = useRef();
  const routeGroupJobChangeTabRef = useRef();
  const resourceJobChangeTabRef = useRef();
  const globalButtons = [
    {
      name: "search",
      action: () => loadData(),
      visible: true,
      disable: false
    }
  ];

  useEffect(() => {
    if (location.state !== undefined && location.state !== null) {
      if (location.state.paramType === 'RESOURCE') {
        setTab('resource');
        setValue('resourceParam', location.state.paramCode);
      }
    }
  }, [location]);
  
  useEffect(() => {
    setViewInfo(vom.active, 'globalButtons', globalButtons);
  }, []);

  function onParamKeyPress(event) {
    if (event.key === "Enter") {
      loadData();
    }
  }

  function loadData() {
    const resourceParam = getValues('resourceParam');
    switch (globalTab) {
      case 'routeJobChange':
        routeJobChangeTabRef.current.loadData(resourceParam);
        break;
      case 'routeGroupJobChange':
        routeGroupJobChangeTabRef.current.loadData(resourceParam);
        break;
      case 'resourceJobChange':
        resourceJobChangeTabRef.current.loadData(resourceParam);
        break;
      default:
        routeJobChangeTabRef.current.loadData(resourceParam);
        break;
    }
  }

  function openGridPopup(columnName = '') {
    if (columnName === '') {
      return;
    }

    if (columnName === 'resourceCode') {
      setGridResourcePopup(true);
    }
  }

  function setResourceValues(values) {
    values.columnName = 'resourceCode';
    setPopupValues(values);
  }

  function setPopupValues(values) {
    switch (tab) {
      case 'routeJobChange':
        routeJobChangeTabRef.current.setPopupValues(values);
        break;
      case 'routeGroupJobChange':
        routeGroupJobChangeTabRef.current.setPopupValues(values);
        break;
      case 'resourceJobChange':
        resourceJobChangeTabRef.current.setPopupValues(values);
        break;
      default:
        routeJobChangeTabRef.current.setPopupValues(values);
        break;
    }
  }

  function handleChange(event, newTab) {
    setTab(newTab);
    globalTab = newTab;
  }

  return (
    <ContentInner>
      <ResourcePopup open={gridResourcePopup} onClose={() => setGridResourcePopup(false)} confirm={setResourceValues} />
      <SearchArea>
        <SearchRow>
          <InputField control={control} label={transLangKey("FP_RESOURCE")} name="resourceParam" width="100%" onKeyPress={onParamKeyPress} />
        </SearchRow>
      </SearchArea>
      <TabContainer value={tab} onChange={handleChange}>
        <RouteJobChangeTab id="routeJobChangeTab" ref={routeJobChangeTabRef} openGridPopup={openGridPopup} />
        <RouteGroupJobChangeTab id="routeGroupJobChangeTab" ref={routeGroupJobChangeTabRef} openGridPopup={openGridPopup} />
        <ResourceJobChangeTab id="resourceJobChangeTab" ref={resourceJobChangeTabRef} openGridPopup={openGridPopup} />
      </TabContainer>
    </ContentInner>
  )
}

export default JobChangeTime;
