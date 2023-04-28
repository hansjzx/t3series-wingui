import React, { useEffect, useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { ContentInner, SearchArea, SearchRow, InputField, useViewStore } from '@zionex/wingui-core/src/common/imports';
import { transLangKey } from "@wingui";

import '../../common/common.css';

import ItemTab from "./ItemTab";
import InventoryTab from "./InventoryTab";
import { TabContainer } from "@wingui/view/factoryplan/common/component/TabContainer";

let globalTab = 'item';

function Item() {
  const location = useLocation();
  const { control, getValues, setValue } = useForm({
    defaultValues: {
      itemParam: '',
      inventoryParam: '',
    }
  });
  const [tab, setTab] = useState('item');
  const [setViewInfo] = useViewStore(state => [state.setViewInfo]);
  const itemTabRef = useRef();
  const inventoryTabRef = useRef();
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
      if (location.state.paramType === 'ITEM') {
        setTab('item');
        globalTab = 'item';
        setValue('itemParam', location.state.paramCode);
      } else {
        setTab('inventory');
        globalTab = 'inventory';
        setValue('inventoryParam', location.state.paramCode)
      }
    }
  }, [location]);

  function onParamKeyPress(event) {
    if (event.key === "Enter") {
      loadData();
    }
  }

  function loadData() {
    if (globalTab === 'item') {
      itemTabRef.current.loadData(getValues('itemParam'));
    } else {
      inventoryTabRef.current.loadData(getValues('inventoryParam'));
    }
  }
  
  function handleChange(event, newTab) {
    setTab(newTab);
    globalTab = newTab;
  }
  
  const setDisplay = (tabName) => ({
    display: tab === tabName ? 'block' : 'none' 
  });

  return (
    <ContentInner>
      <SearchArea>
        <SearchRow>
          <InputField style={setDisplay('item')} control={control} label={transLangKey("FP_ITEM")} name="itemParam" width="100%" onKeyPress={onParamKeyPress} />
          <InputField style={setDisplay('inventory')} control={control} label={transLangKey("FP_INVENTORY")} name="inventoryParam" width="100%" onKeyPress={onParamKeyPress} />
        </SearchRow>
      </SearchArea>
      <TabContainer value={tab} onChange={handleChange}>
        <ItemTab id="itemTab" ref={itemTabRef} />
        <InventoryTab id="inventoryTab" ref={inventoryTabRef} />
      </TabContainer>
    </ContentInner>
  )
}

export default Item;
