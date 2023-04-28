import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Tab, Tabs } from '@mui/material';
import {
  BaseGrid, ButtonArea, ContentInner, GridAddRowButton, GridDeleteRowButton, GridExcelExportButton, GridExcelImportButton, GridSaveButton, InputField, LeftButtonArea, ResultArea, RightButtonArea,
  SearchArea, SearchRow, useUserStore, useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';
import { setGridComboList } from '@wingui/view/supplychainmodel/common/common';

import ItemSearchBox from '@wingui/view/supplychainmodel/common/ItemSearchBox';
import AccountSearchCondition from '@wingui/view/supplychainmodel/common/AccountSearchCondition';
import PopItemClass from '../productmixmax/PopItemClass';
import PopProductMixMinAllocationNew from './PopProductMixMinAllocationNew';

let gridAccountColumns = [
  { name: 'PROD_MIX_MIN_MST_ID', dataType: 'text', headerText: 'PROD_MIX_MIN_MST_ID', visible: false, width: 50 },
  { name: 'PROD_MIX_MIN_DTL_ID', dataType: 'text', headerText: 'PROD_MIX_MIN_DTL_ID', visible: false, width: 50 },
  {
    name: 'LOCATION', dataType: 'group', orientation: 'horizontal', headerText: 'LOCAT', headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: 'LOCAT_TP', dataType: 'text', headerText: 'LOCAT_TP_NM', width: 120, merge: true, groupShowMode: 'expand', initGroupOrder: '1' },
      { name: 'LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', width: 120, merge: true, groupShowMode: 'expand', initGroupOrder: '2' },
      { name: 'LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', width: 120, merge: true, groupShowMode: 'always', initGroupOrder: '3' },
      { name: 'LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', width: 120, merge: true, groupShowMode: 'always', initGroupOrder: '4' }
    ]
  },
  {
    name: 'ITEM', dataType: 'group', orientation: 'horizontal', headerText: 'ITEM', headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: 'ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', width: 80, groupShowMode: 'always', initGroupOrder: '5' },
      { name: 'ITEM_NM', dataType: 'text', headerText: 'ITEM_NM', width: 120, groupShowMode: 'always', initGroupOrder: '6' },
      { name: 'ITEM_TP', dataType: 'text', headerText: 'ITEM_TP', width: 80, groupShowMode: 'expand', initGroupOrder: '7' }
    ]
  },
  { name: 'TOTAL_DMND_QTY', dataType: 'number', headerText: 'TOTAL_DMND_QTY', width: 80 },
  { name: 'LOCAT_CNT', dataType: 'number', headerText: 'LOCAT_CNT', width: 80, groups: 'PRDUCT_LOCAT' },
  { name: 'PRDUCT_AVAIL_QTY', dataType: 'number', headerText: 'PRDUCT_AVAIL_QTY', width: 120, groups: 'PRDUCT_LOCAT' },
  { name: 'INV_QTY', dataType: 'number', headerText: 'STOCK_QTY', width: 80, groups: 'LONG_DELIVY_MAT' },
  { name: 'INTRANSIT_QTY', dataType: 'number', headerText: 'INTRANSIT_QTY', width: 90, groups: 'LONG_DELIVY_MAT' },
  { name: 'MAT_CONSUME_QTY', dataType: 'number', headerText: 'MAT_CONSUME_QTY', width: 110, groups: 'LONG_DELIVY_MAT' },
  { name: 'APPY_YN', dataType: 'boolean', headerText: 'APPY_YN', width: 80, editable: true },
  { name: 'MIN_ALLOC_APPY_MTD_ID', dataType: 'text', headerText: 'MIN_ALLOC_APPY_METHD', width: 200, editable: true, useDropdown: true, lookupDisplay: true },
  { name: 'DMND_BASE_APPY_RATE', dataType: 'number', headerText: 'DMND_BASE_APPY_RATE', width: 150, editable: true },
  { name: 'ACCOUNT_CD', dataType: 'text', headerText: 'ACCOUNT_CD', width: 100 },
  { name: 'ACCOUNT_NM', dataType: 'text', headerText: 'ACCOUNT_NM', width: 100 },
  { name: 'PARENT_SALES_LV_CD', dataType: 'text', headerText: 'PARENT_SALES_LV_CD', width: 120 },
  { name: 'DMND_QTY', dataType: 'number', headerText: 'DMND_QTY', width: 80 },
  { name: 'DMND_QTY_RATIO', dataType: 'number', headerText: 'DMND_QTY_RATIO', width: 80 },
  { name: 'LGDY_MAT_CONSUME_QTY', dataType: 'number', headerText: 'LONG_DELIVY_MAT_CONSUME_QTY', width: 120 },
  { name: 'LGDY_MAT_CONSUME_QTY_RATIO', dataType: 'number', headerText: 'LONG_DELIVY_MAT_CONSUME_QTY_RATIO', width: 80 },
  { name: 'PRPSAL_VAL', dataType: 'number', headerText: 'PRPSAL_VAL', width: 80 },
  { name: 'MIN_ALLOC_QTY', dataType: 'number', headerText: 'MIN_ALLOC_QTY', width: 80, editable: true },
  { name: 'FIXED_YN', dataType: 'boolean', headerText: 'FIXED_YN', width: 60, editable: true },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', width: 60, editable: true },
  {
    name: "EDIT", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: 'CREATE_BY', dataType: 'text', headerText: 'CREATE_BY', visible: true, editable: false, width: 80, groupShowMode: 'expand' },
      { name: 'CREATE_DTTM', dataType: 'datetime', headerText: 'CREATE_DTTM', visible: true, editable: false, width: 140, format: 'yyyy-MM-dd', groupShowMode: 'expand' },
      { name: 'MODIFY_BY', dataType: 'text', headerText: 'MODIFY_BY', visible: true, editable: false, width: 80, groupShowMode: 'always' },
      { name: 'MODIFY_DTTM', dataType: 'datetime', headerText: 'MODIFY_DTTM', visible: true, editable: false, width: 140, format: 'yyyy-MM-dd', groupShowMode: 'expand' }
    ]
  }
]

let gridChannelColumns = [
  { name: 'PROD_MIX_MIN_MST_ID', dataType: 'text', headerText: 'PROD_MIX_MIN_MST_ID', visible: false, width: 50 },
  { name: 'PROD_MIX_MIN_DTL_ID', dataType: 'text', headerText: 'PROD_MIX_MIN_DTL_ID', visible: false, width: 50 },
  {
    name: 'LOCATION', dataType: 'group', orientation: 'horizontal', headerText: 'LOCAT', headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: 'LOCAT_TP', dataType: 'text', headerText: 'LOCAT_TP_NM', width: 120, merge: true, groupShowMode: 'expand', initGroupOrder: '1' },
      { name: 'LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', width: 120, merge: true, groupShowMode: 'expand', initGroupOrder: '2' },
      { name: 'LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', width: 120, merge: true, groupShowMode: 'always', initGroupOrder: '3' },
      { name: 'LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', width: 120, merge: true, groupShowMode: 'always', initGroupOrder: '4' }
    ]
  },
  {
    name: 'ITEM', dataType: 'group', orientation: 'horizontal', headerText: 'ITEM', headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: 'ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', width: 80, groupShowMode: 'always', initGroupOrder: '5' },
      { name: 'ITEM_NM', dataType: 'text', headerText: 'ITEM_NM', width: 120, groupShowMode: 'always', initGroupOrder: '6' },
      { name: 'ITEM_TP', dataType: 'text', headerText: 'ITEM_TP', width: 80, groupShowMode: 'expand', initGroupOrder: '7' }
    ]
  },
  { name: 'TOTAL_DMND_QTY', dataType: 'number', headerText: 'TOTAL_DMND_QTY', width: 80 },
  { name: 'LOCAT_CNT', dataType: 'number', headerText: 'LOCAT_CNT', width: 80, groups: 'PRDUCT_LOCAT' },
  { name: 'PRDUCT_AVAIL_QTY', dataType: 'number', headerText: 'PRDUCT_AVAIL_QTY', width: 120, groups: 'PRDUCT_LOCAT' },
  { name: 'INV_QTY', dataType: 'number', headerText: 'STOCK_QTY', width: 80, groups: 'LONG_DELIVY_MAT' },
  { name: 'INTRANSIT_QTY', dataType: 'number', headerText: 'INTRANSIT_QTY', width: 80, groups: 'LONG_DELIVY_MAT' },
  { name: 'MAT_CONSUME_QTY', dataType: 'number', headerText: 'MAT_CONSUME_QTY', width: 120, groups: 'LONG_DELIVY_MAT' },
  { name: 'APPY_YN', dataType: 'boolean', headerText: 'APPY_YN', width: 80, editable: true },
  { name: 'MIN_ALLOC_APPY_MTD_ID', dataType: 'text', headerText: 'MIN_ALLOC_APPY_METHD', width: 200, editable: true, useDropdown: true, lookupDisplay: true },
  { name: 'DMND_BASE_APPY_RATE', dataType: 'number', headerText: 'DMND_BASE_APPY_RATE', width: 150, editable: true },
  { name: 'CHANNEL_NM', dataType: 'text', headerText: 'CHANNEL_NM', width: 100 },
  { name: 'DMND_QTY', dataType: 'number', headerText: 'DMND_QTY', width: 80 },
  { name: 'DMND_QTY_RATIO', dataType: 'number', headerText: 'DMND_QTY_RATIO', width: 80 },
  { name: 'LGDY_MAT_CONSUME_QTY', dataType: 'number', headerText: 'LONG_DELIVY_MAT_CONSUME_QTY', width: 120 },
  { name: 'LGDY_MAT_CONSUME_QTY_RATIO', dataType: 'number', headerText: 'LONG_DELIVY_MAT_CONSUME_QTY_RATIO', width: 80 },
  { name: 'PRPSAL_VAL', dataType: 'number', headerText: 'PRPSAL_VAL', width: 80 },
  { name: 'MIN_ALLOC_QTY', dataType: 'number', headerText: 'MIN_ALLOC_QTY', width: 80, editable: true },
  { name: 'FIXED_YN', dataType: 'boolean', headerText: 'FIXED_YN', width: 60, editable: true },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', width: 60, editable: true },
  {
    name: "EDIT", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: 'CREATE_BY', dataType: 'text', headerText: 'CREATE_BY', visible: false, editable: false, width: 80, groupShowMode: 'expand' },
      { name: 'CREATE_DTTM', dataType: 'datetime', headerText: 'CREATE_DTTM', visible: false, editable: false, width: 140, format: 'yyyy-MM-dd', groupShowMode: 'expand' },
      { name: 'MODIFY_BY', dataType: 'text', headerText: 'MODIFY_BY', visible: true, editable: false, width: 80, groupShowMode: 'always' },
      { name: 'MODIFY_DTTM', dataType: 'datetime', headerText: 'MODIFY_DTTM', visible: false, editable: false, width: 140, format: 'yyyy-MM-dd', groupShowMode: 'expand' }
    ]
  }
]

let gridItemClassColumns = [
  { name: 'PROD_MIX_MIN_MST_ID', dataType: 'text', headerText: 'PROD_MIX_MIN_MST_ID', visible: false, width: 50 },
  { name: 'PROD_MIX_MIN_DTL_ID', dataType: 'text', headerText: 'PROD_MIX_MIN_DTL_ID', visible: false, width: 50 },
  { name: 'ITEM_CLASS_ID', dataType: 'text', headerText: 'ITEM_CLASS_ID', visible: false, width: 50 },
  { name: 'ITEM_LV', dataType: 'text', headerText: 'ITEM_LV', width: 100, initGroupOrder: '1' },
  { name: 'ITEM_CLASS_VAL', dataType: 'text', headerText: 'ITEM_CLASS_VAL', width: 100, initGroupOrder: '2' },
  { name: 'TOTAL_DMND_QTY', dataType: 'number', headerText: 'TOTAL_DMND_QTY', width: 100 },
  {
    name: 'PRODUCTION_LOCATION', dataType: 'group', orientation: 'horizontal', headerText: 'PRDUCT_LOCAT', headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: 'LOCAT_CNT', dataType: 'number', headerText: 'LOCAT_CNT', width: 80 },
      { name: 'PRDUCT_AVAIL_QTY', dataType: 'number', headerText: 'PRDUCT_AVAIL_QTY', width: 120 }
    ]
  },
  {
    name: 'LONG_DELIVERY_MATERIAL', dataType: 'group', orientation: 'horizontal', headerText: 'LONG_DELIVY_MAT', headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: 'INV_QTY', dataType: 'number', headerText: 'STOCK_QTY', width: 100 },
      { name: 'INTRANSIT_QTY', dataType: 'number', headerText: 'INTRANSIT_QTY', width: 100 },
      { name: 'MAT_CONSUME_QTY', dataType: 'number', headerText: 'MAT_CONSUME_QTY', width: 120 }
    ]
  },
  { name: 'APPY_YN', dataType: 'boolean', headerText: 'APPY_YN', width: 80, editable: true },
  { name: 'MIN_ALLOC_APPY_MTD_ID', dataType: 'text', headerText: 'MIN_ALLOC_APPY_METHD', width: 200, editable: true, useDropdown: true, lookupDisplay: true },
  { name: 'DMND_BASE_APPY_RATE', dataType: 'number', headerText: 'DMND_BASE_APPY_RATE', width: 150, editable: true },
  { name: 'ITEM_GRP', dataType: 'text', headerText: 'ITEM_GRP', width: 120 },
  { name: 'ITEM_GRP_DESCRIP', dataType: 'text', headerText: 'ITEM_GRP_DESCRIP', width: 130 },
  { name: 'DMND_QTY', dataType: 'number', headerText: 'DMND_QTY', width: 80 },
  { name: 'DMND_QTY_RATIO', dataType: 'number', headerText: 'DMND_QTY_RATIO', width: 80 },
  { name: 'LGDY_MAT_CONSUME_QTY', dataType: 'number', headerText: 'LONG_DELIVY_MAT_CONSUME_QTY', width: 120 },
  { name: 'LGDY_MAT_CONSUME_QTY_RATIO', dataType: 'number', headerText: 'LONG_DELIVY_MAT_CONSUME_QTY_RATIO', width: 80 },
  { name: 'PRPSAL_VAL', dataType: 'number', headerText: 'PRPSAL_VAL', width: 80 },
  { name: 'MIN_ALLOC_QTY', dataType: 'number', headerText: 'MIN_ALLOC_QTY', width: 80, editable: true },
  { name: 'FIXED_YN', dataType: 'boolean', headerText: 'FIXED_YN', width: 60, editable: true },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', width: 60, editable: true },
  {
    name: "EDIT", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: 'CREATE_BY', dataType: 'text', headerText: 'CREATE_BY', visible: false, editable: false, width: 80, groupShowMode: 'expand' },
      { name: 'CREATE_DTTM', dataType: 'datetime', headerText: 'CREATE_DTTM', visible: false, editable: false, width: 140, format: 'yyyy-MM-dd', groupShowMode: 'expand' },
      { name: 'MODIFY_BY', dataType: 'text', headerText: 'MODIFY_BY', visible: true, editable: false, width: 80, groupShowMode: 'always' },
      { name: 'MODIFY_DTTM', dataType: 'datetime', headerText: 'MODIFY_DTTM', visible: false, editable: false, width: 140, format: 'yyyy-MM-dd', groupShowMode: 'expand' }
    ]
  }
]

function ProductMixMin() {
  const [username] = useUserStore(state => [state.username]);
  const [gridAccount, setGridAccount] = useState(null);
  const [gridChannel, setGridChannel] = useState(null);
  const [gridItemClass, setGridItemClass] = useState(null);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const [channelOptions, setChannelOptions] = useState([]);
  const [itemClassPopupOpen, setItemClassPopupOpen] = useState(false);
  const [newProductMixMinAllocationPopupOpen, setNewProductMixMinAllocationPopupOpen] = useState(false);
  const [tabValue, setTabValue] = useState('ACCOUNT');

  const itemSearchBoxRef = useRef();
  const [currentItemRef, setCurrentItemRef] = useState();

  const accountSearchRef = useRef();
  const [currentAccountRef, setCurrentAccountRef] = useState();

  const { reset, control, getValues, setValue } = useForm({
    defaultValues: {
      channelName: '',
      itemClass : '',
      itemClassDescription: ''
    }
  });

  const exportOptions = {
    headerDepth: 1,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  };

  useEffect(() => {
    if (itemSearchBoxRef) {
      if (itemSearchBoxRef.current) {
        setCurrentItemRef(itemSearchBoxRef.current);
      }
    }

    if (accountSearchRef) {
      if (accountSearchRef.current) {
        setCurrentAccountRef(accountSearchRef.current);
      }
    }
  }, [viewData]);

  useEffect(() => {
    setViewInfo(vom.active, 'globalButtons', [
      { name: 'search', action: (e) => { loadData(tabValue); }, visible: true, disable: false },
      { name: 'refresh', action: (e) => { refresh(tabValue); }, visible: true, disable: false },
    ]);

    if (gridAccount) {
      setOptionsGridAccount();
      setGridAccountLookup();
    }

    if (gridChannel) {
      setOptionsGridChannel();
      setGridChannelLookup();
    }

    if (gridItemClass) {
      setOptionsGridItemClass();
      setGridItemClassLookup();
    }

    async function initLoad() {
      if (gridAccount && gridChannel && gridItemClass) {
        setSelectOptions();
        loadData(tabValue);
      }
    }

    initLoad();
  }, [gridAccount, gridChannel, gridItemClass]);

  function afterGridAccountCreate(gridObj) {
    setGridAccount(gridObj);
  }

  function setOptionsGridAccount() {
    gridAccount.gridView.setEditOptions({
      insertable: true,
      appendable: true
    });

    gridAccount.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridAccount, true, true, true);

    gridAccount.gridView.setFixedOptions({ colCount: 2, resizable: true });
  }

  function setGridAccountLookup() {
    setGridComboList(gridAccount, "MIN_ALLOC_APPY_MTD_ID", "MIN_ALLOCATION_APPLY_TYPE");
  }

  function afterGridChannelCreate(gridObj) {
    setGridChannel(gridObj);
  }

  function setOptionsGridChannel() {
    gridChannel.gridView.setEditOptions({
      insertable: true,
      appendable: true
    });

    gridChannel.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridChannel, true, true, true);

    gridChannel.gridView.setFixedOptions({ colCount: 2, resizable: true });
  }

  function setGridChannelLookup() {
    setGridComboList(gridChannel, "MIN_ALLOC_APPY_MTD_ID", "MIN_ALLOCATION_APPLY_TYPE");
  }

  function afterGridItemClassCreate(gridObj) {
    setGridItemClass(gridObj);
  }

  function setOptionsGridItemClass() {
    gridItemClass.gridView.setEditOptions({
      insertable: true,
      appendable: true
    });

    gridItemClass.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridItemClass, true, true, true);
  }

  function setGridItemClassLookup() {
    setGridComboList(gridItemClass, "MIN_ALLOC_APPY_MTD_ID", "MIN_ALLOCATION_APPLY_TYPE");
  }

  function setSelectOptions() {
    let formData = new FormData();

    formData.append('TYPE', 'CHANNEL_TP');

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_GET_COMBO_LIST',
      data: formData
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        let dataArr = [];

        res.data.RESULT_DATA.forEach(function (data) {
          dataArr.push( {
            value: data.CHANNEL_ID,
            label: data.CHANNEL_NM
          });
        });

        setChannelOptions(dataArr);
        reset({
          channelName: dataArr[0].value
        });
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function openItemClassPopup() {
    setItemClassPopupOpen(true);
  }

  function closeItemClassPopup() {
    setItemClassPopupOpen(false);
  }

  function onSetItemClass(gridRow) {
    setValue('itemClass', gridRow.ITEM_CLASS_VAL);
    setValue('itemClassDescription', gridRow.DESCRIP);
  }

  const tabChange = (event, newValue) => {
    setViewInfo(vom.active, 'globalButtons', [
      { name: 'search', action: (e) => { loadData(newValue); }, visible: true, disable: false },
      { name: 'refresh', action: (e) => { refresh(newValue); }, visible: true, disable: false }
    ]);

    setTabValue(newValue);
  };

  function refresh(activeTab) {
    currentItemRef.reset();
    currentAccountRef.reset();
    reset();

    if (activeTab === 'ACCOUNT') {
      gridAccount.dataProvider.clearRows();
    } else if (activeTab === 'CHANNEL') {
      gridChannel.dataProvider.clearRows();
    } else if (activeTab === 'ITEM_CLASS') {
      gridItemClass.dataProvider.clearRows();
    }
  }

  function loadData(activeTab) {
    if (activeTab === 'ACCOUNT') {
      loadMixMinAccount();
    } else if (activeTab === 'CHANNEL') {
      loadMixMinChannel();
    } else if (activeTab === 'ITEM_CLASS') {
      loadMixMinItemClass();
    }
  }

  function loadMixMinAccount() {
    let formData = new FormData();

    formData.append('CATAGY_VAL', 'ACCOUNT');
    formData.append('ITEM_CD', currentItemRef.getItemCode());
    formData.append('ITEM_NM', currentItemRef.getItemName());
    formData.append('ITEM_TP', currentItemRef.getItemType());
    formData.append('ACCOUNT_CD', currentAccountRef.getAccountCode());
    formData.append('ACCOUNT_NM', currentAccountRef.getAccountName());
    formData.append('CHANNEL_ID', '');

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_15_Q1',
      data: formData
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridAccount.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function loadMixMinChannel() {
    let formData = new FormData();

    formData.append('CATAGY_VAL', 'CHANNEL');
    formData.append('ITEM_CD', currentItemRef.getItemCode());
    formData.append('ITEM_NM', currentItemRef.getItemName());
    formData.append('ITEM_TP', currentItemRef.getItemType());
    formData.append('CHANNEL_ID', getValues('channelName'));

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_15_Q1',
      data: formData
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridChannel.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function loadMixMinItemClass() {
    let formData = new FormData();

    formData.append('CATAGY_VAL', 'ITEM_CLASS');
    formData.append('ITEM_CLASS', getValues('itemClass'));
    formData.append('ITEM_CLASS_DESCRIP', getValues('itemClassDescription'));

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_15_Q1',
      data: formData
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridItemClass.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function deleteMixMinAccount() {
    gridAccount.gridView.commit(true);

    let checkedRow = gridAccount.gridView.getCheckedRows();

    if (checkedRow.length === 0) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SELECT_DELETE'), { close: false });
    } else {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_DELETE'), function (answer) {
        if (answer) {
          let formData = new FormData();
          let checked = [];

          checkedRow.forEach(function (row) {
            checked.push(gridAccount.dataProvider.getJsonRow(row));
          });

          formData.append('changes', JSON.stringify(checked));

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_UI_MP_15_D1',
            data: formData
          })
          .then(function (res) {
            if (res.status === gHttpStatus.SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_MP_15_D1_P_RT_MSG), { close: false });
              loadMixMinAccount();
            } else {
              showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
            }
          })
          .catch(function (err) {
            console.log(err);
          });
        }
      });
    }
  }

  function saveMixMinAccount() {
    gridAccount.gridView.commit(true);

    let changedRow = [];

    changedRow = changedRow.concat(
      gridAccount.dataProvider.getAllStateRows().created,
      gridAccount.dataProvider.getAllStateRows().updated,
      gridAccount.dataProvider.getAllStateRows().deleted,
      gridAccount.dataProvider.getAllStateRows().createAndDeleted
    );

    if (changedRow.length === 0) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
    } else {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
        if (answer) {
          let changes = [];

          changedRow.forEach(function (row) {
            let data = gridAccount.dataProvider.getJsonRow(row);
            changes.push(data);
          });

          let formData = new FormData();

          formData.append('CATAGY_VAL', 'ACCOUNT');
          formData.append('changes', JSON.stringify(changes));
          formData.append('USER_ID', username);

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_UI_MP_15_S1',
            data: formData
          })
          .then(function (res) {
            if (res.status === gHttpStatus.SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_MP_15_S1_P_RT_MSG), { close: false });
              loadMixMinAccount();
            } else {
              showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
            }
          })
          .catch(function (err) {
            console.log(err);
          });
        }
      });
    }
  }

  function deleteMixMinChannel() {
    gridChannel.gridView.commit(true);

    let checkedRow = gridChannel.gridView.getCheckedRows();

    if (checkedRow.length === 0) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SELECT_DELETE'), { close: false });
    } else {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_DELETE'), function (answer) {
        if (answer) {
          let formData = new FormData();
          let checked = [];

          checkedRow.forEach(function (row) {
            checked.push(gridChannel.dataProvider.getJsonRow(row));
          });

          formData.append('changes', JSON.stringify(checked));

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_UI_MP_15_D1',
            data: formData
          })
          .then(function (res) {
            if (res.status === gHttpStatus.SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_MP_15_D1_P_RT_MSG), { close: false });
              loadMixMinChannel();
            } else {
              showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
            }
          })
          .catch(function (err) {
            console.log(err);
          });
        }
      });
    }
  }

  function saveMixMinChannel() {
    gridChannel.gridView.commit(true);

    let changedRow = [];

    changedRow = changedRow.concat(
      gridChannel.dataProvider.getAllStateRows().created,
      gridChannel.dataProvider.getAllStateRows().updated,
      gridChannel.dataProvider.getAllStateRows().deleted,
      gridChannel.dataProvider.getAllStateRows().createAndDeleted
    );

    if (changedRow.length === 0) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
    } else {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
        if (answer) {
          let changes = [];

          changedRow.forEach(function (row) {
            let data = gridChannel.dataProvider.getJsonRow(row);
            changes.push(data);
          });

          let formData = new FormData();

          formData.append('CATAGY_VAL', 'CHANNEL');
          formData.append('changes', JSON.stringify(changes));
          formData.append('USER_ID', username);

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_UI_MP_15_S1',
            data: formData
          })
          .then(function (res) {
            if (res.status === gHttpStatus.SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_MP_15_S1_P_RT_MSG), { close: false });
              loadMixMinChannel();
            } else {
              showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
            }
          })
          .catch(function (err) {
            console.log(err);
          });
        }
      });
    }
  }

  function deleteMixMinItemClass() {
    gridItemClass.gridView.commit(true);

    let checkedRow = gridItemClass.gridView.getCheckedRows();

    if (checkedRow.length === 0) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SELECT_DELETE'), { close: false });
    } else {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_DELETE'), function (answer) {
        if (answer) {
          let formData = new FormData();
          let checked = [];

          checkedRow.forEach(function (row) {
            checked.push(gridItemClass.dataProvider.getJsonRow(row));
          });

          formData.append('changes', JSON.stringify(checked));

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_UI_MP_15_D1',
            data: formData
          })
          .then(function (res) {
            if (res.status === gHttpStatus.SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_MP_15_D1_P_RT_MSG), { close: false });
              loadMixMinItemClass();
            } else {
              showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
            }
          })
          .catch(function (err) {
            console.log(err);
          });
        }
      });
    }
  }

  function saveMixMinItemClass() {
    gridItemClass.gridView.commit(true);

    let changedRow = [];

    changedRow = changedRow.concat(
      gridItemClass.dataProvider.getAllStateRows().created,
      gridItemClass.dataProvider.getAllStateRows().updated,
      gridItemClass.dataProvider.getAllStateRows().deleted,
      gridItemClass.dataProvider.getAllStateRows().createAndDeleted
    );

    if (changedRow.length === 0) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
    } else {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
        if (answer) {
          let changes = [];

          changedRow.forEach(function (row) {
            let data = gridItemClass.dataProvider.getJsonRow(row);
            changes.push(data);
          });

          let formData = new FormData();

          formData.append('CATAGY_VAL', 'ITEM_CLASS');
          formData.append('changes', JSON.stringify(changes));
          formData.append('USER_ID', username);

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_UI_MP_15_S1',
            data: formData
          })
          .then(function (res) {
            if (res.status === gHttpStatus.SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_MP_15_S1_P_RT_MSG), { close: false });
              loadMixMinItemClass();
            } else {
              showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
            }
          })
          .catch(function (err) {
            console.log(err);
          });
        }
      });
    }
  }

  function openNewProductMixMinAllocationPopup() {
    setNewProductMixMinAllocationPopupOpen(true);
  }

  function closeNewProductMixMinAllocationPopup() {
    setNewProductMixMinAllocationPopupOpen(false);
  }

  function onCloseNewProductMixMinAllocationPopup() {
    loadData(tabValue);
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <ItemSearchBox ref={itemSearchBoxRef} keyValue={'itemName'} placeHolder={transLangKey("ITEM_NM")} style={{display: tabValue === 'ITEM_CLASS' ? "none" : "inline-block"}} />
            <AccountSearchCondition ref={accountSearchRef} style={{display: tabValue === 'ACCOUNT' ? "inline-block" : "none"}}></AccountSearchCondition>
            <InputField type="select" name="channelName" label={transLangKey("CHANNEL_NM")} control={control} options={channelOptions} style={{display: tabValue === 'CHANNEL' ? "inline-block" : "none"}} />
            <InputField type="action" name="itemClass" label={transLangKey("ITEM_CLASS_VAL")} title={transLangKey("SEARCH")} onClick={openItemClassPopup} control={control} style={{ display: tabValue === 'ITEM_CLASS' ? "inline-block" : "none" }}>
              <Icon.Search />
            </InputField>
            <InputField name="itemClassDescription" label={transLangKey("DESCRIP")} control={control} style={{ display: tabValue === 'ITEM_CLASS' ? "inline-block" : "none" }} />
          </SearchRow>
        </SearchArea>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={tabChange}>
            <Tab label={transLangKey("SALES")} value="ACCOUNT" />
            <Tab label={transLangKey("CHANNEL_TP")} value="CHANNEL" />
            <Tab label={transLangKey("ITEM_CLASS_VAL")} value="ITEM_CLASS" />
          </Tabs>
        </Box>
        <Box style={{ marginTop: "3px", width: "100%", height: "100%", }}>
          <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "ACCOUNT" ? "block" : "none" }}>
            <ButtonArea>
              <LeftButtonArea>
                <GridExcelExportButton type="icon" grid="gridAccount" options={exportOptions} />
                {/*<GridExcelImportButton type="icon" grid="gridAccount" />*/}
              </LeftButtonArea>
              <RightButtonArea>
                <GridAddRowButton type="icon" onClick={openNewProductMixMinAllocationPopup} />
                <GridDeleteRowButton type="icon" onClick={deleteMixMinAccount} />
                <GridSaveButton type="icon" onClick={saveMixMinAccount} />
              </RightButtonArea>
            </ButtonArea>
            <ResultArea>
              <BaseGrid id="gridAccount" items={gridAccountColumns} afterGridCreate={afterGridAccountCreate} />
            </ResultArea>
          </Box>

          <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "CHANNEL" ? "block" : "none" }}>
            <ButtonArea>
              <LeftButtonArea>
                <GridExcelExportButton type="icon" grid="gridChannel" options={exportOptions} />
                {/*<GridExcelImportButton type="icon" grid="gridChannel" />*/}
              </LeftButtonArea>
              <RightButtonArea>
                <GridAddRowButton type="icon" onClick={openNewProductMixMinAllocationPopup} />
                <GridDeleteRowButton type="icon" onClick={deleteMixMinChannel} />
                <GridSaveButton type="icon" onClick={saveMixMinChannel} />
              </RightButtonArea>
            </ButtonArea>
            <ResultArea>
              <BaseGrid id="gridChannel" items={gridChannelColumns} afterGridCreate={afterGridChannelCreate} />
            </ResultArea>
          </Box>

          <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "ITEM_CLASS" ? "block" : "none" }}>
            <ButtonArea>
              <LeftButtonArea>
                <GridExcelExportButton type="icon" grid="gridItemClass" options={exportOptions} />
                {/*<GridExcelImportButton type="icon" grid="gridItemClass" />*/}
              </LeftButtonArea>
              <RightButtonArea>
                <GridAddRowButton type="icon" onClick={openNewProductMixMinAllocationPopup} />
                <GridDeleteRowButton type="icon" onClick={deleteMixMinItemClass} />
                <GridSaveButton type="icon" onClick={saveMixMinItemClass} />
              </RightButtonArea>
            </ButtonArea>
            <ResultArea>
              <BaseGrid id="gridItemClass" items={gridItemClassColumns} afterGridCreate={afterGridItemClassCreate} />
            </ResultArea>
          </Box>
        </Box>
      </ContentInner>

      {itemClassPopupOpen && (<PopItemClass open={itemClassPopupOpen} onClose={closeItemClassPopup} confirm={onSetItemClass} />)}
      {newProductMixMinAllocationPopupOpen && (<PopProductMixMinAllocationNew open={newProductMixMinAllocationPopupOpen} onClose={closeNewProductMixMinAllocationPopup} confirm={onCloseNewProductMixMinAllocationPopup} tab={tabValue} />)}
    </>
  )
}

export default ProductMixMin;
