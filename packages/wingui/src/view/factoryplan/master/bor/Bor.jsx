import React, { useEffect, useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { ContentInner, SearchArea, SearchRow, InputField, useViewStore } from '@zionex/wingui-core/src/common/imports';
import { TabContainer } from "@wingui/view/factoryplan/common/component/TabContainer";
import { transLangKey } from "@wingui";

import BorTab from "./BorTab";
import BorSetTab from "./BorSetTab";
import ToolSettingTab from "./ToolSettingTab";
import ToolSupplyTab from "./ToolSupplyTab";

import '../../common/common.css';

let globalTab = 'bor';

function Item() {
  const location = useLocation();
  const { control, getValues, setValue } = useForm({
    defaultValues: {
      itemParam: '',
      routeParam: '',
      resourceParam: '',
    }
  });
  const [tab, setTab] = useState('bor');
  const [setViewInfo] = useViewStore(state => [state.setViewInfo]);
  const borTabRef = useRef();
  const borSetTabRef = useRef();
  const toolSettingTabRef = useRef();
  const toolSupplyTabRef = useRef();
  const globalButtons = [
    {
      name: "search",
      action: () => loadData(),
      visible: true,
      disable: false
    }
  ];

  useEffect(() => {
    setViewInfo(vom.active, 'globalButtons', globalButtons);
  }, []);

  useEffect(() => {
    if (location.state !== undefined && location.state !== null) {
      if (location.state.paramType === 'ROUTE') {
        setTab('bor');
        globalTab = 'bor';
        setValue('itemParam', '');
        setValue('routeParam', location.state.paramCode);
        setValue('resourceParam', '');
      }
    }
  }, [location]);

  function onParamKeyPress(event) {
    if (event.key === "Enter") {
      loadData();
    }
  }

  function loadData() {
    switch (globalTab) {
      case 'bor':
        borTabRef.current.loadData(getValues('itemParam'), getValues('routeParam'), getValues('resourceParam'));
        break;
      case 'borSet':
        borSetTabRef.current.loadData(getValues('itemParam'), getValues('routeParam'), getValues('resourceParam'));
        break;
      case 'toolSetting':
        toolSettingTabRef.current.loadData(getValues('routeParam'), getValues('resourceParam'));
        break;
      case 'toolSupply':
        toolSupplyTabRef.current.loadData(getValues('resourceParam'));
        break;
    }
  }
  
  function handleChange(event, newTab) {
    setTab(newTab);
    globalTab = newTab;
  }

  return (
    <ContentInner>
      <SearchArea>
        <SearchRow>
          <InputField style={{ display: tab.includes('bor') ? 'block' : 'none' }} control={control} label={transLangKey("FP_ITEM")} name="itemParam" width="100%" onKeyPress={onParamKeyPress} />
          <InputField style={{ display: tab !== 'toolSupply' ? 'block' : 'none' }} control={control} label={transLangKey("FP_ROUTE")} name="routeParam" width="100%" onKeyPress={onParamKeyPress} />
          <InputField control={control} label={transLangKey("FP_RESOURCE")} name="resourceParam" width="100%" onKeyPress={onParamKeyPress} />
        </SearchRow>
      </SearchArea>
      <TabContainer value={tab} onChange={handleChange}>
        <BorTab id="borTab" ref={borTabRef} />
        <BorSetTab id="borSetTab" ref={borSetTabRef} />
        <ToolSettingTab id="toolSettingTab" ref={toolSettingTabRef} />
        <ToolSupplyTab id="toolSupplyTab" ref={toolSupplyTabRef} />
      </TabContainer>
    </ContentInner>
  )
}

export default Item;
