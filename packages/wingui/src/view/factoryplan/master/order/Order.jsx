import React, { useEffect, useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { InputField, ContentInner, SearchArea, SearchRow, useViewStore } from '@zionex/wingui-core/src/common/imports';
import { transLangKey } from "@wingui";

import SalesOrderTab from "./SalesOrderTab";
import WorkOrderTab from "./WorkOrderTab";

import InventoryPopup from "../../common/popup/InventoryPopup";
import CustomerPopup from "../../common/popup/CustomerPopup";
import OrderTypePopup from "../../common/popup/OrderTypePopup";
import SalesOrderPopup from "../../common/popup/SalesOrderPopup";

import '../../common/common.css';
import { TabContainer } from "@wingui/view/factoryplan/common/component/TabContainer";

let globalTab = 'salesOrder';

function Order() {
  const location = useLocation();
  const { control, getValues, setValue } = useForm({
    defaultValues: {
      orderParam: '',
    }
  });
  const [tab, setTab] = useState('salesOrder');
  const [setViewInfo] = useViewStore(state => [state.setViewInfo]);
  const [gridInventoryPopup, setGridInventoryPopup] = useState(false);
  const [gridCustomerPopup, setGridCustomerPopup] = useState(false);
  const [gridOrderTypePopup, setGridOrderTypePopup] = useState(false);
  const [gridSalesOrderPopup, setGridSalesOrderPopup] = useState(false);
  const salesOrderTabRef = useRef();
  const workOrderTabRef = useRef();
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
      if (location.state.paramType === 'SALES_ORDER') {
        setTab('salesOrder');
        globalTab = 'salesOrder';
        setValue('orderParam', location.state.paramCode);
      } else if (location.state.paramType === 'WORK_ORDER') {
        setTab('workOrder');
        globalTab = 'workOrder';
        setValue('orderParam', location.state.paramCode);
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
      case 'salesOrder':
        salesOrderTabRef.current.loadData(getValues('orderParam'));
        break;
      case 'workOrder':
        workOrderTabRef.current.loadData(getValues('orderParam'));
        break;
      default:
        salesOrderTabRef.current.loadData(getValues('orderParam'));
        break;
    }
  }

  function openGridPopup(columnName = '') {
    if (columnName === '') {
      return;
    }

    if (columnName === 'inventoryCode') {
      setGridInventoryPopup(true);
    } else if (columnName === 'customerCode') {
      setGridCustomerPopup(true);
    } else if (columnName === 'orderTpCd') {
      setGridOrderTypePopup(true);
    } else if (columnName === 'soCode') {
      setGridSalesOrderPopup(true);
    }
  }

  function setInventoryValues(values) {
    values.columnName = 'inventoryCode';
    setPopupValues(values);
  }

  function setCustomerValues(values) {
    values.columnName = 'customerCode';
    setPopupValues(values);
  }

  function setOrderTypeValues(values) {
    values.columnName = 'orderTpCd';
    setPopupValues(values);
  }

  function setSalesOrderValues(values) {
    values.columnName = 'soCode';
    setPopupValues(values);
  }

  function setPopupValues(values) {
    switch (tab) {
      case 'salesOrder':
        salesOrderTabRef.current.setPopupValues(values);
        break;
      case 'workOrder':
        workOrderTabRef.current.setPopupValues(values);
        break;
      default:
        salesOrderTabRef.current.setPopupValues(values);
        break;
    }
  }

  function handleChange(event, newTab) {
    setTab(newTab);
    globalTab = newTab;
  }

  return (
    <ContentInner>
      <InventoryPopup open={gridInventoryPopup} onClose={() => setGridInventoryPopup(false)} confirm={setInventoryValues} />
      <CustomerPopup open={gridCustomerPopup} onClose={() => setGridCustomerPopup(false)} confirm={setCustomerValues} />
      <OrderTypePopup open={gridOrderTypePopup} onClose={() => setGridOrderTypePopup(false)} confirm={setOrderTypeValues} />
      <SalesOrderPopup open={gridSalesOrderPopup} onClose={() => setGridSalesOrderPopup(false)} confirm={setSalesOrderValues} />
      <SearchArea>
        <SearchRow>
          <InputField control={control} label={transLangKey("FP_ORDER")} name="orderParam" width="100%" onKeyPress={onParamKeyPress} />
        </SearchRow>
      </SearchArea>
      <TabContainer value={tab} onChange={handleChange}>
        <SalesOrderTab id="salesOrderTab" ref={salesOrderTabRef} openGridPopup={openGridPopup} />
        <WorkOrderTab id="workOrderTab" ref={workOrderTabRef} openGridPopup={openGridPopup} />
      </TabContainer>
    </ContentInner>
  )
}

export default Order;
