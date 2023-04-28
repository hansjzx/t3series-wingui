import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Tab, Tabs } from '@mui/material';
import {
  BaseGrid, ButtonArea, CommonButton, ContentInner, GridAddRowButton, GridSaveButton, GridExcelExportButton,
  InputField, LeftButtonArea, ResultArea, RightButtonArea, SearchArea, SearchRow, useUserStore, useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';

import LocationSearchBox from '@wingui/view/supplychainmodel/common/LocationSearchBox';
import ItemSearchBox from '@wingui/view/supplychainmodel/common/ItemSearchBox';
import PopAccount from '@wingui/view/supplychainmodel/common/PopAccount';
import PopDemandOverview from './PopDemandOverview';
import PopDemandOverviewBatchUpdate from './PopDemandOverviewBatchUpdate';
import { setGridComboList } from '@wingui/view/supplychainmodel/common/common';

import { Chart as ChartJS, LinearScale, CategoryScale, BarElement, PointElement, LineElement, Title, Legend, Tooltip, LineController, BarController } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  LinearScale, CategoryScale, BarElement, PointElement, LineElement, Title, Legend, Tooltip, LineController, BarController
);

const demandTrendChartOptions = {
  plugins: {
    title: { display: false, text: transLangKey('DEMAND_TREND') },
    legend: { position: 'bottom' }
  },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    quantity: {
      position: 'left',
      title: { display: false, text: transLangKey('QTY') }
    }
  }
};

let gridDemandOverviewMasterColumns = [
  { name: 'LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: '120', editable: false, groups: 'LOCAT', groupShowMode: 'expand' },
  { name: 'LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: '120', editable: false, groups: 'LOCAT', groupShowMode: 'expand' },
  { name: 'LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: '120', editable: false, groups: 'LOCAT', groupShowMode: 'always' },
  { name: 'LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: '110', editable: false, groups: 'LOCAT', groupShowMode: 'always' },
  { name: 'ITEM_MST_ID', headerText: 'ITEM_MST_ID', dataType: 'text', width: '100', visible: false, editable: false, groups: 'ITEM' },
  { name: 'ITEM_CD', headerText: 'ITEM_CD', dataType: 'text', width: '80', editable: false, groups: 'ITEM', groupShowMode: 'always' },
  { name: 'ITEM_NM', headerText: 'ITEM_NM', dataType: 'text', width: '80', editable: false, groups: 'ITEM', groupShowMode: 'always' },
  { name: 'DESCRIP', headerText: 'DESCRIP', dataType: 'text', width: '80', editable: false, groups: 'ITEM', groupShowMode: 'expand' },
  { name: 'ITEM_TP_NM', headerText: 'ITEM_TP_NM', dataType: 'text', width: '80', editable: false, groups: 'ITEM', groupShowMode: 'expand' },
  { name: 'ACCOUNT_ID', headerText: 'ACCOUNT_ID', dataType: 'text', width: '100', visible: false, editable: false, groups: 'ACCOUNT' },
  { name: 'ACCOUNT_CD', headerText: 'ACCOUNT_CD', dataType: 'text', width: '90', editable: false, groups: 'ACCOUNT', groupShowMode: 'always' },
  { name: 'ACCOUNT_NM', headerText: 'ACCOUNT_NM', dataType: 'text', width: '110', editable: false, groups: 'ACCOUNT', groupShowMode: 'always' },
  { name: 'CHANNEL_NM', headerText: 'CHANNEL_NM', dataType: 'text', width: '100', editable: false, groups: 'ACCOUNT', groupShowMode: 'expand' },
  { name: 'INCOTERMS', headerText: 'INCOTERMS', dataType: 'text', width: '80', editable: false, groups: 'ACCOUNT', groupShowMode: 'expand' },
  { name: 'UOM_NM', headerText: 'UOM_NM', dataType: 'text', width: '60', editable: false, groups: 'ITEM', groupShowMode: 'expand' },
  { name: 'CURCY_NM', headerText: 'CURCY_NM', dataType: 'text', width: '60', editable: false, groups: 'ACCOUNT', groupShowMode: 'expand' },
  { name: 'DMND_TP_ID', headerText: 'DMND_TP_ID', dataType: 'text', width: '100', visible: false, editable: false, groups: 'DMND_INFO' },
  { name: 'DMND_TP_NM', headerText: 'DMND_TP_NM', dataType: 'text', width: '110', editable: false, autoFilter: true, groups: 'DMND_INFO', groupShowMode: 'always' },
  { name: 'DMND_CLASS_ID', headerText: 'DMND_CLASS_ID', dataType: 'text', width: '100', visible: false, editable: false, groups: 'DMND_INFO' },
  { name: 'DMND_CLASS_NM', headerText: 'DMND_CLASS_NM', dataType: 'text', width: '110', editable: false, autoFilter: true, groups: 'DMND_INFO', groupShowMode: 'expand' },
  { name: 'URGENT_ORDER_TP', headerText: 'URGENT_ORDER_TP', dataType: 'text', width: '150', editable: false, autoFilter: true, lookupDisplay: true, groups: 'DMND_INFO', groupShowMode: 'expand' },
  { name: 'CATEGORY', headerText: 'CATEGORY', dataType: 'text', width: '100', visible: true, editable: false, lang: true, background: '#F4F6FBFF' },
  { name: 'DAT', dataType: 'number', width: '100', editable: false, iteration: { prefix: 'DAT_', prefixRemove: 'true', delimiter: '_' } }
]

let gridDemandOverviewDetailColumns = [
  { name: 'ID', headerText: 'ID', dataType: 'text', width: '100', visible: false },
  { name: 'MODULE_VAL', headerText: 'MODULE_VAL', dataType: 'text', width: '60', visible: false, editable: false },
  { name: 'DMND_ID', headerText: 'DMND_ID', dataType: 'text', width: '170', editable: false },
  { name: 'DMND_SEQ', headerText: 'DMND_SEQ', dataType: 'text', width: '150', editable: false },
  { name: 'DMND_TP_ID', headerText: 'DMND_TP_NM', dataType: 'text', width: '200', editable: true, autoFilter: true, useDropdown: true, lookupDisplay: true },
  { name: 'DMND_TP_NM', headerText: 'DMND_TP_NM', dataType: 'text', width: '120', visible: false, editable: false, autoFilter: true },
  { name: 'DMND_CLASS_ID', headerText: 'DMND_CLASS_NM', dataType: 'text', width: '150', editable: true, autoFilter: true, useDropdown: true, lookupDisplay: true },
  { name: 'DMND_CLASS_NM', headerText: 'DMND_CLASS_NM', dataType: 'text', width: '90', visible: false, editable: false, autoFilter: true },
  { name: 'URGENT_ORDER_TP', headerText: 'URGENT_ORDER_TP', dataType: 'text', width: '140', editable: true, autoFilter: true, useDropdown: true, lookupDisplay: true },
  {
    name: 'ITEM', dataType: 'group', orientation: 'horizontal', headerText: 'ITEM', expandable: true, expanded: false,
    childs: [
      { name: 'ITEM_MST_ID', headerText: 'ITEM_MST_ID', dataType: 'text', width: '50', visible: false, editable: false },
      { name: 'ITEM_CD', headerText: 'ITEM_CD', dataType: 'text', width: '80', editable: false, groupShowMode: 'always' },
      { name: 'ITEM_NM', headerText: 'ITEM_NM', dataType: 'text', width: '80', editable: false, groupShowMode: 'always' },
      { name: 'ITEM_DESCRIP', headerText: 'ITEM_DESCRIP', dataType: 'text', width: '110', editable: false, groupShowMode: 'expand' },
      { name: 'ITEM_TP_NM', headerText: 'ITEM_TP_NM', dataType: 'text', width: '80', editable: false, groupShowMode: 'expand' }
    ]
  },
  { name: 'DMND_QTY', headerText: 'DEMAND_QTY', dataType: 'number', width: '70', editable: true, groupSummaryExp: 'sum' },
  { name: 'UOM_NM', headerText: 'UOM_NM', dataType: 'text', width: '60', editable: false, useDropdown: true, lookupDisplay: true },
  { name: 'DUE_DATE', headerText: 'DUE_DATE', dataType: 'datetime', width: '100', editable: true, format: 'yyyy-MM-dd', autoFilter: true },
  { name: 'LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: '100', editable: false, autoFilter: true },
  { name: 'LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: '120', editable: false, autoFilter: true },
  {
    name: 'ACCOUNT', dataType: 'group', orientation: 'horizontal', headerText: 'ACCOUNT', expandable: true, expanded: false,
    childs: [
      { name: 'ACCOUNT_ID', headerText: 'ACCOUNT_ID', dataType: 'text', width: '100', visible: false, editable: false, groupShowMode: 'expand' },
      { name: 'ACCOUNT_CD', headerText: 'ACCOUNT_CD', dataType: 'text', width: '90', editable: false, groupShowMode: 'always' },
      { name: 'ACCOUNT_NM', headerText: 'ACCOUNT_NM', dataType: 'text', width: '120', editable: false, groupShowMode: 'always' },
      { name: 'CHANNEL_NM', headerText: 'CHANNEL_NM', dataType: 'text', width: '100', editable: false, groupShowMode: 'expand' },
      { name: 'INCOTERMS', headerText: 'INCOTERMS', dataType: 'text', width: '80', editable: false, groupShowMode: 'expand' },
      { name: 'SALES_UNIT_PRIC', headerText: 'SALES_UNIT_PRIC', dataType: 'number', width: '80', editable: false, groupShowMode: 'expand' },
      { name: 'MARGIN', headerText: 'MARGIN', dataType: 'number', width: '80', editable: false, groupShowMode: 'expand' },
      { name: 'CURCY_NM', headerText: 'CURCY_NM', dataType: 'text', width: '80', editable: false, groupShowMode: 'expand' }
    ]
  },
  {
    name: 'DMND_PRIOR', dataType: 'group', orientation: 'horizontal', headerText: 'DMND_PRIOR',
    childs: [
      { name: 'PRIORT', headerText: 'PRIORITY', dataType: 'number', width: '80', editable: true },
      { name: 'PRDUCT_DELIVY_DATE', headerText: 'PRDUCT_DELIVY_DATE', dataType: 'datetime', width: '130', editable: true, format: 'yyyy-MM-dd' },
      { name: 'BOD_LEADTIME', headerText: 'BOD_LEADTIME', dataType: 'number', width: '80', editable: false },
      { name: 'TIME_UOM_NM', headerText: 'TIME_UOM_NM', dataType: 'text', width: '100', editable: false, useDropdown: true, lookupDisplay: true }
    ]
  },
  {
    name: 'PRDLOC_N_PRDFAC_ASSIGN', dataType: 'group', orientation: 'horizontal', headerText: 'PRDLOC_N_PRDFAC_ASSIGN',
    childs: [
      { name: 'ASSIGN_SITE_CNT', headerText: 'ASSIGN_SITE_CNT', dataType: 'text', width: '160', editable: false },
      { name: 'ASSIGN_RES_CNT', headerText: 'ASSIGN_RES_CNT', dataType: 'text', width: '200', editable: false }
    ]
  },
  {
    name: 'PLAN_OPT', dataType: 'group', orientation: 'horizontal', headerText: 'PLAN_OPT',
    childs: [
      { name: 'DELIVY_PLAN_POLICY_CD_ID', headerText: 'DELIVY_PLAN_POLICY_NM', dataType: 'text', width: '130', editable: true, useDropdown: true, lookupDisplay: true },
      { name: 'MAT_CONST_CD_ID', headerText: 'MAT_CONST_NM', dataType: 'text', width: '180', editable: true, useDropdown: true, lookupDisplay: true },
      { name: 'EFFICY', headerText: 'EFFICY', dataType: 'number', width: '80', editable: false },
      { name: 'PARTIAL_PLAN_YN', headerText: 'PARTIAL_PLAN_YN', dataType: 'boolean', width: '80', editable: true, headerCheckable: false },
      { name: 'HEURISTIC_YN', headerText: 'HEURISTIC_YN', dataType: 'boolean', width: '80', editable: true, headerCheckable: false },
      { name: 'COST_OPTIMIZ_YN', headerText: 'COST_OPTIMIZ_YN', dataType: 'boolean', width: '100', editable: true, headerCheckable: false },
      { name: 'PST', headerText: 'PST', dataType: 'datetime', width: '100', editable: true, format: 'yyyy-MM-dd' },
      { name: 'DUE_DATE_FNC', headerText: 'DUE_DATE_FNC', dataType: 'datetime', width: '100', editable: true, format: 'yyyy-MM-dd' },
      { name: 'STRATEGY_METHD_ID', headerText: 'STRATEGY_METHD', dataType: 'text', width: '100', editable: true, useDropdown: true, lookupDisplay: true }
    ]
  },
  { name: 'DISPLAY_COLOR', headerText: 'DISPLAY_COLOR', dataType: 'text', width: '100', editable: true },
  { name: 'ACTV_YN', headerText: 'ACTV_YN', dataType: 'boolean', width: '80', editable: true }
]

let gridStockAssignColumns = [
  { name: 'DO_ID', headerText: 'DO_ID', dataType: 'text', visible: false, editable: false },
  { name: 'DOA_ID', headerText: 'DOA_ID', dataType: 'text', visible: false, editable: false },
  {
    name: 'ACCOUNT', dataType: 'group', orientation: 'horizontal', headerText: 'ACCOUNT',
    childs: [
      { name: 'ACCOUNT_CD', headerText: 'ACCOUNT_CD', dataType: 'text', width: '90', editable: false },
      { name: 'ACCOUNT_NM', headerText: 'ACCOUNT_NM', dataType: 'text', width: '120', editable: false }
    ]
  },
  {
    name: 'ITEM', dataType: 'group', orientation: 'horizontal', headerText: 'ITEM', expandable: true, expanded: false,
    childs: [
      { name: 'ITEM_CD', headerText: 'ITEM_CD', dataType: 'text', width: '80', editable: false, groupShowMode: 'always' },
      { name: 'ITEM_NM', headerText: 'ITEM_NM', dataType: 'text', width: '80', editable: false, groupShowMode: 'always' },
      { name: 'DESCRIP', headerText: 'DESCRIP', dataType: 'text', width: '110', editable: false, groupShowMode: 'expand' },
      { name: 'UOM_ID', headerText: 'UOM', dataType: 'text', width: '60', editable: false, groupShowMode: 'expand', useDropdown: true, lookupDisplay: true }
    ]
  },
  {
    name: 'DMND_INFO', dataType: 'group', orientation: 'horizontal', headerText: 'DMND_INFO', expandable: true, expanded: false,
    childs: [
      { name: 'FORECAST_ID', headerText: 'FORECAST_ID', dataType: 'text', width: '200', editable: false, groupShowMode: 'expand' },
      { name: 'FORECAST_QTY', headerText: 'FORECAST_QTY', dataType: 'number', width: '120', editable: false, groupShowMode: 'expand' },
      { name: 'DMND_ID', headerText: 'DMND_ID', dataType: 'text', width: '150', visible: true, editable: false, groupShowMode: 'always' },
      { name: 'DMND_TP_ID', headerText: 'DMND_TP_NM', dataType: 'text', width: '120', editable: false, groupShowMode: 'always', autoFilter: true, useDropdown: true, lookupDisplay: true },
      { name: 'DMND_TP_NM', headerText: 'DMND_TP_NM', dataType: 'text', visible: false, editable: false, groupShowMode: 'expand' },
      { name: 'DMND_QTY', headerText: 'DEMAND_QTY', dataType: 'number', width: '100', editable: false, groupShowMode: 'always' }
    ]
  },
  {
    name: 'STOCK', dataType: 'group', orientation: 'horizontal', headerText: 'STOCK',
    childs: [
      { name: 'ASSIGN_TP_ID', headerText: 'ASSIGN_TP_ID', dataType: 'text', width: '100', editable: false, useDropdown: true, lookupDisplay: true },
      { name: 'ASSIGN_DESCRIP', headerText: 'ASSIGN_DESCRIP', dataType: 'text', width: '120', editable: false },
      { name: 'STOCK_ID', headerText: 'STOCK_ID', dataType: 'text', width: '100', editable: false },
      { name: 'LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: '120', editable: false },
      { name: 'LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: '120', editable: false },
      { name: 'LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: '120', editable: false },
      { name: 'LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: '110', editable: false },
      { name: 'STOCK_ITEM_CD', headerText: 'ITEM_CD', dataType: 'text', width: '80', editable: false },
      { name: 'STOCK_ITEM_NM', headerText: 'ITEM_NM', dataType: 'text', width: '80', editable: false },
      { name: 'STOCK_UOM_ID', headerText: 'UOM', dataType: 'text', width: '60', editable: false, useDropdown: true, lookupDisplay: true },
      { name: 'LOT_NO', headerText: 'LOT_NO', dataType: 'text', width: '100', editable: false },
      { name: 'INV_QTY', headerText: 'INV_QTY', dataType: 'number', width: '120', editable: false },
      { name: 'ASSIGN_SEQ', headerText: 'ASSIGN_SEQ', dataType: 'text', width: '80', editable: true },
      { name: 'QTY', headerText: 'QTY', dataType: 'number', width: '80', editable: true },
      { name: 'ASSIGN_YN', headerText: 'ASSIGN_YN', dataType: 'boolean', width: '80', editable: true },
      { name: 'ACTV_YN', headerText: 'ACTV_YN', dataType: 'boolean', width: '80', editable: true }
    ]
  }
]

let gridWipAssignColumns = [
  { name: 'ID', headerText: 'ID', dataType: 'text', visible: false, editable: false },
  {
    name: 'ACCOUNT', dataType: 'group', orientation: 'horizontal', headerText: 'ACCOUNT',
    childs: [
      { name: 'ACCOUNT_CD', headerText: 'ACCOUNT_CD', dataType: 'text', width: '90', editable: false },
      { name: 'ACCOUNT_NM', headerText: 'ACCOUNT_NM', dataType: 'text', width: '120', editable: false }
    ]
  },
  {
    name: 'ITEM', dataType: 'group', orientation: 'horizontal', headerText: 'ITEM', expandable: true, expanded: false,
    childs: [
      { name: 'ITEM_CD', headerText: 'ITEM_CD', dataType: 'text', width: '80', editable: false, groupShowMode: 'always' },
      { name: 'ITEM_NM', headerText: 'ITEM_NM', dataType: 'text', width: '80', editable: false, groupShowMode: 'always' },
      { name: 'DESCRIP', headerText: 'DESCRIP', dataType: 'text', width: '110', editable: false, groupShowMode: 'expand' },
      { name: 'UOM_ID', headerText: 'UOM', dataType: 'text', width: '60', editable: false, groupShowMode: 'expand', useDropdown: true, lookupDisplay: true }
    ]
  },
  {
    name: 'DMND_INFO', dataType: 'group', orientation: 'horizontal', headerText: 'DMND_INFO',
    childs: [
      { name: 'DMND_ID', headerText: 'DMND_ID', dataType: 'text', width: '150', visible: true, editable: false, groupShowMode: 'always' },
      { name: 'DMND_TP_ID', headerText: 'DMND_TP_NM', dataType: 'text', width: '120', editable: false, autoFilter: true, groupShowMode: 'always', useDropdown: true, lookupDisplay: true },
      { name: 'DMND_QTY', headerText: 'DEMAND_QTY', dataType: 'number', width: '100', editable: false, groupShowMode: 'always' }
    ]
  },
  {
    name: 'WIP', dataType: 'group', orientation: 'horizontal', headerText: 'WIP',
    childs: [
      { name: 'WIP_MST_ID', headerText: 'WIP_MST_ID', dataType: 'text', visible: false, editable: false },
      { name: 'WIP_ID', headerText: 'WIP_ID', dataType: 'text', width: '80', editable: false },
      { name: 'LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: '120', editable: false },
      { name: 'LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: '120', editable: false },
      { name: 'LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: '120', editable: false },
      { name: 'LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: '110', editable: false },
      { name: 'WIP_ITEM_CD', headerText: 'ITEM_CD', dataType: 'text', width: '80', editable: false },
      { name: 'WIP_ITEM_NM', headerText: 'ITEM_NM', dataType: 'text', width: '80', editable: false },
      { name: 'WIP_UOM_ID', headerText: 'UOM', dataType: 'text', width: '60', editable: false, useDropdown: true, lookupDisplay: true },
      { name: 'RES_CD', headerText: 'RES_CD', dataType: 'text', width: '100', editable: false },
      { name: 'RES_DESCRIP', headerText: 'RES_DESCRIP', dataType: 'text', width: '120', editable: false },
      { name: 'WIP_ACCOUNT_CD', headerText: 'ACCOUNT_CD', dataType: 'text', width: '100', editable: false },
      { name: 'WIP_ACCOUNT_NM', headerText: 'ACCOUNT_NM', dataType: 'text', width: '120', editable: false },
      { name: 'WIP_QTY', headerText: 'WIP_QTY', dataType: 'number', width: '100', editable: false },
      { name: 'QTY', headerText: 'QTY', dataType: 'number', width: '60', editable: true },
      { name: 'ASSIGN_YN', headerText: 'ASSIGN_YN', dataType: 'boolean', width: '60', editable: true },
      { name: 'ACTV_YN', headerText: 'ACTV_YN', dataType: 'boolean', width: '60', editable: true }
    ]
  }
]

let gridLocationAssignColumns = [
  { name: 'ID', dataType: 'text', visible: false, editable: false },
  { name: 'DMND_OVW_ID', dataType: 'text', visible: false, editable: false },
  { name: 'TRANSP_MGMT_MST_ID', dataType: 'text', visible: false, editable: false },
  {
    name: 'DMND_INFO', dataType: 'group', orientation: 'horizontal', headerText: 'DMND_INFO', expandable: true, expanded: false,
    childs: [
      { name: 'DMND_ID', headerText: 'DMND_ID', dataType: 'text', width: '150', visible: true, editable: false, groupShowMode: 'always' },
      { name: 'DMND_TP_NM', headerText: 'DMND_TP_NM', dataType: 'text', width: '120', editable: false, autoFilter: true, groupShowMode: 'always', useDropdown: true, lookupDisplay: true },
      { name: 'URGENT_ORDER_TP', headerText: 'URGENT_ORDER_TP', dataType: 'text', width: '150', editable: false, autoFilter: true, groupShowMode: 'expand' },
      { name: 'DMND_QTY', headerText: 'DMND_QTY', dataType: 'number', width: '80', editable: false, groupShowMode: 'always', useDropdown: true, lookupDisplay: true }
    ]
  },
  {
    name: 'ACCOUNT', dataType: 'group', orientation: 'horizontal', headerText: 'ACCOUNT',
    childs: [
      { name: 'ACCOUNT_CD', headerText: 'ACCOUNT_CD', dataType: 'text', width: '100', editable: false },
      { name: 'ACCOUNT_NM', headerText: 'ACCOUNT_NM', dataType: 'text', width: '120', editable: false }
    ]
  },
  {
    name: 'ITEM', dataType: 'group', orientation: 'horizontal', headerText: 'ITEM', expandable: true, expanded: false,
    childs: [
      { name: 'ITEM_CD', headerText: 'ITEM_CD', dataType: 'text', width: '80', editable: false, groupShowMode: 'always' },
      { name: 'ITEM_NM', headerText: 'ITEM_NM', dataType: 'text', width: '80', editable: false, groupShowMode: 'always' },
      { name: 'ITEM_TP', headerText: 'ITEM_TP', dataType: 'text', width: '80', editable: false, groupShowMode: 'expand' }
    ]
  },
  {
    name: 'CONSUME', dataType: 'group', orientation: 'horizontal', headerText: 'CONSUME', expandable: true, expanded: false,
    childs: [
      { name: 'CONSUME_LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: '120', editable: false, groupShowMode: 'expand' },
      { name: 'CONSUME_LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: '120', editable: false, groupShowMode: 'expand' },
      { name: 'CONSUME_LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: '120', editable: false, groupShowMode: 'always' },
      { name: 'CONSUME_LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: '120', editable: false, groupShowMode: 'always' }
    ]
  },
  {
    name: 'SUPPLY', dataType: 'group', orientation: 'horizontal', headerText: 'SUPPLY', expandable: true, expanded: false,
    childs: [
      { name: 'SUPPLY_LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width:'120', editable: false, groupShowMode: 'expand' },
      { name: 'SUPPLY_LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: '120', editable: false, groupShowMode: 'expand' },
      { name: 'SUPPLY_LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: '120', editable: false, groupShowMode: 'always' },
      { name: 'SUPPLY_LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: '120', editable: false, groupShowMode: 'always' }
    ]
  },
  {
    name: 'ASSIGN_SITE', dataType: 'group', orientation: 'horizontal', headerText: 'ASSIGN_SITE',
    childs: [
      { name: 'SITE_ITEM_CD', headerText: 'ITEM_CD', dataType: 'text', width: '80', editable: false },
      { name: 'SITE_ITEM_NM', headerText: 'ITEM_NM', dataType: 'text', width: '80', editable: false },
      { name: 'VEHICL_TP', headerText: 'VEHICL_TP', dataType: 'text', width: '150', editable: false },
      { name: 'ASSIGN_YN', headerText: 'ASSIGN_YN', dataType: 'boolean', width: '60', editable: true },
      { name: 'PRIORT', headerText: 'PRIORITY', dataType: 'number', width: '80', editable: true },
      { name: 'ACTV_YN', headerText: 'ACTV_YN', dataType: 'boolean', width: '60', editable: true }
    ]
  }
]

let gridResourceAssignColumns = [
  { name: 'ID', dataType: 'text', visible: false },
  { name: 'DMND_OVW_ID', dataType: 'text', visible: false },
  {
    name: 'DMND_INFO', dataType: 'group', orientation: 'horizontal', headerText: 'DMND_INFO', expandable: true, expanded: false,
    childs: [
      { name: 'DMND_ID', headerText: 'DMND_ID', dataType: 'text', width: '170', visible: true, editable: false, groupShowMode: 'always' },
      { name: 'DMND_TP_NM', headerText: 'DMND_TP_NM', dataType: 'text', width: '100', editable: false, autoFilter: true, groupShowMode: 'always', useDropdown: true, lookupDisplay: true },
      { name: 'URGENT_ORDER_TP', headerText: 'URGENT_ORDER_TP', dataType: 'text', width: '150', editable: false, autoFilter: true, groupShowMode: 'expand' },
      { name: 'DMND_QTY', headerText: 'DMND_QTY', dataType: 'number', width: '80', editable: false, groupShowMode: 'always', useDropdown: true, lookupDisplay: true }
    ]
  },
  {
    name: 'ACCOUNT', dataType: 'group', orientation: 'horizontal', headerText: 'ACCOUNT',
    childs: [
      { name: 'ACCOUNT_CD', headerText: 'ACCOUNT_CD', dataType: 'text', width: '80', editable: false },
      { name: 'ACCOUNT_NM', headerText: 'ACCOUNT_NM', dataType: 'text', width: '120', editable: false }
    ]
  },
  {
    name: 'ITEM', dataType: 'group', orientation: 'horizontal', headerText: 'ITEM', expandable: true, expanded: false,
    childs: [
      { name: 'ITEM_CD', headerText: 'ITEM_CD', dataType: 'text', width: '80', editable: false, groupShowMode: 'always' },
      { name: 'ITEM_NM', headerText: 'ITEM_NM', dataType: 'text', width: '80', editable: false, groupShowMode: 'always' },
      { name: 'ITEM_TP', headerText: 'ITEM_TP', dataType: 'text', width: '80', editable: false, groupShowMode: 'expand' }
    ]
  },
  {
    name: 'ASSIGN_RES', dataType: 'group', orientation: 'horizontal', headerText: 'ASSIGN_RES',
    childs: [
      {
        name: 'LOCATION', dataType: 'group', orientation: 'horizontal', headerText: 'LOCAT', expandable: true, expanded: false,
        childs: [
          { name: 'LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: '120', editable: false, groupShowMode: 'expand' },
          { name: 'LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: '120', editable: false, groupShowMode: 'expand' },
          { name: 'LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: '120', editable: false, groupShowMode: 'always' },
          { name: 'LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: '110', editable: false, groupShowMode: 'always' }
        ]
      },
      { name: 'RES_CD', headerText: 'RES_CD', dataType: 'text', width: '80', editable: false },
      { name: 'RES_DESCRIP', headerText: 'RES_DESCRIP', dataType: 'text', width: '120', editable: false },
      { name: 'RES_ITEM_CD', headerText: 'ITEM_CD', dataType: 'text', width: '80', editable: false },
      { name: 'RES_ITEM_NM', headerText: 'ITEM_NM', dataType: 'text', width: '80', editable: false },
      { name: 'ASSIGN_YN', headerText: 'ASSIGN_YN', dataType: 'boolean', width: '60', editable: true },
      { name: 'PRIORT', headerText: 'PRIORITY', dataType: 'number', width: '80', editable: true },
      { name: 'ACTV_YN', headerText: 'ACTV_YN', dataType: 'boolean', width: '60', editable: true }
    ]
  }
]

let gridOrderBomRateColumns = [
  { name: 'ID', dataType: 'text', visible: false, editable: false },
  { name: 'DMND_OVW_ID', dataType: 'text', visible: false, editable: false },
  { name: 'PRDUCT_BOM_DTL_ID', dataType: 'text', visible: false, editable: false },
  {
    name: 'DMND_INFO', dataType: 'group', orientation: 'horizontal', headerText: 'DMND_INFO', expandable: true, expanded: false,
    childs: [
      { name: 'DMND_ID', headerText: 'DMND_ID', dataType: 'text', width: '150', visible: true, editable: false, groupShowMode: 'always' },
      { name: 'DMND_TP_NM', headerText: 'DMND_TP_NM', dataType: 'text', width: '100', editable: false, autoFilter: true, groupShowMode: 'always', useDropdown: true, lookupDisplay: true },
      { name: 'URGENT_ORDER_TP', headerText: 'URGENT_ORDER_TP', dataType: 'text', width: '150', editable: false, autoFilter: true, groupShowMode: 'expand' },
      { name: 'DMND_QTY', headerText: 'DMND_QTY', dataType: 'number', width: '80', editable: false, groupShowMode: 'always', useDropdown: true, lookupDisplay: true }
    ]
  },
  {
    name: 'ACCOUNT', dataType: 'group', orientation: 'horizontal', headerText: 'ACCOUNT',
    childs: [
      { name: 'ACCOUNT_CD', headerText: 'ACCOUNT_CD', dataType: 'text', width: '80', editable: false },
      { name: 'ACCOUNT_NM', headerText: 'ACCOUNT_NM', dataType: 'text', width: '120', editable: false }
    ]
  },
  {
    name: 'ITEM', dataType: 'group', orientation: 'horizontal', headerText: 'ITEM', expandable: true, expanded: false,
    childs: [
      { name: 'ITEM_CD', headerText: 'ITEM_CD', dataType: 'text', width: '80', editable: false, groupShowMode: 'always' },
      { name: 'ITEM_NM', headerText: 'ITEM_NM', dataType: 'text', width: '80', editable: false, groupShowMode: 'always' },
      { name: 'ITEM_TP', headerText: 'ITEM_TP', dataType: 'text', width: '80', editable: false, groupShowMode: 'expand' }
    ]
  },
  {
    name: 'ORDER_BOM_RATE', dataType: 'group', orientation: 'horizontal', headerText: 'ORDER_BOM_RATE',
    childs: [
      {
        name: 'LOCATION', dataType: 'group', orientation: 'horizontal', headerText: 'LOCAT', expandable: true, expanded: false,
        childs: [
          { name: 'LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: '120', editable: false, groupShowMode: 'expand' },
          { name: 'LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: '120', editable: false, groupShowMode: 'expand' },
          { name: 'LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: '120', editable: false, groupShowMode: 'always' },
          { name: 'LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: '110', editable: false, groupShowMode: 'always' }
        ]
      },
      {
        name: 'PARENT_ITEM', dataType: 'group', orientation: 'horizontal', headerText: 'PARENT_ITEM',
        childs: [
          { name: 'P_ITEM_CD', headerText: 'PARENT_ITEM', dataType: 'text', width: '80', editable: false },
          { name: 'P_ITEM_NM', headerText: 'ITEM_NM', dataType: 'text', width: '80', editable: false },
          { name: 'P_ITEM_TP', headerText: 'ITEM_TP', dataType: 'text', width: '80', editable: false }
        ]
      },
      { name: 'BOM_VER_ID', headerText: 'BOM_VER_ID', dataType: 'text', width: '80', editable: false },
      { name: 'BOM_LV', headerText: 'BOM_LV', dataType: 'text', width: '80', editable: false },
      {
        name: 'COMPONENT_ITEM', dataType: 'group', orientation: 'horizontal', headerText: 'COMPONENT_ITEM',
        childs: [
          { name: 'C_ITEM_CD', headerText: 'COMPONENT_ITEM', dataType: 'text', width: '120', editable: false },
          { name: 'C_ITEM_NM', headerText: 'ITEM_NM', dataType: 'text', width: '80', editable: false },
          { name: 'C_ITEM_TP', headerText: 'ITEM_TP', dataType: 'text', width: '80', editable: false }
        ]
      },
      { name: 'BASE_BOM_RATE', headerText: 'BASE_BOM_RATE', dataType: 'number', width: '100', editable: false },
      { name: 'BOM_RATE', headerText: 'BOM_RATE', dataType: 'number', width: '80', editable: true },
      { name: 'ACTV_YN', headerText: 'ACTV_YN', dataType: 'boolean', width: '60', editable: true }
    ]
  }
]

function DemandOverview(props) {
  const [username] = useUserStore(state => [state.username]);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const [gridDemandOverviewMaster, setGridDemandOverviewMaster] = useState(null);
  const [gridDemandOverviewDetail, setGridDemandOverviewDetail] = useState(null);
  const [gridStockAssign, setGridStockAssign] = useState(null);
  const [gridWipAssign, setGridWipAssign] = useState(null);
  const [gridLocationAssign, setGridLocationAssign] = useState(null);
  const [gridResourceAssign, setGridResourceAssign] = useState(null);
  const [gridOrderBomRate, setGridOrderBomRate] = useState(null);

  const [moduleOptions, setModuleOptions] = useState([]);
  const [versionOptions, setVersionOptions] = useState([]);

  const itemSearchBoxRef = useRef();
  const [currentItemRef, setCurrentItemRef] = useState(null);

  const locationSearchBoxRef = useRef();
  const [currentLocationRef, setCurrentLocationRef] = useState(null);

  const [tabValue, setTabValue] = useState('demandOverviewDetail');
  const [popupData, setPopupData] = useState(null);

  const module = props.module ? props.module : 'MP';

  const [accountPopupOpen, setAccountPopupOpen] = useState(false);
  const [demandOverviewPopupOpen, setDemandOverviewPopupOpen] = useState(false);
  const [batchUpdatePopupOpen, setBatchUpdatePopupOpen] = useState(false);

  const [demandTrendData, setDemandTrendData] = useState({
    labels: [],
    datasets: []
  })

  const { reset, getValues, setValue, control } = useForm({
    defaultValues: {
      moduleId: '',
      versionId: '',
      accountCode: '',
      accountName: '',
      demandId: '',
      startDate: '',
      endDate: ''
    }
  });

  const exportOptions = {
    headerDepth: 2,
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

    if (locationSearchBoxRef) {
      if (locationSearchBoxRef.current) {
        setCurrentLocationRef(locationSearchBoxRef.current);
      }
    }
  }, [viewData]);

  useEffect(() => {
    setDemandTrendChartLegend();
  }, []);

  useEffect(() => {
    setViewInfo(vom.active, 'globalButtons', [
      { name: 'search', action: (e) => { loadGridData(tabValue); }, visible: true, disable: false },
      { name: 'refresh', action: (e) => { refresh(tabValue); }, visible: true, disable: false }
    ]);
  }, [gridDemandOverviewDetail]);

  useEffect(() => {
    async function initLoad() {
      if (gridDemandOverviewDetail && gridDemandOverviewMaster && gridStockAssign && gridWipAssign && gridLocationAssign && gridResourceAssign && gridOrderBomRate) {
        await loadModule();
        await loadDemandOverviewDetail();
        loadDemandOverviewMaster();
        loadStockAssign();
        loadWipAssign();
        loadLocationAssign();
        loadResourceAssign();
        loadOrderBomRate();
      }
    }

    initLoad();
  }, [gridDemandOverviewDetail, gridDemandOverviewMaster, gridStockAssign, gridWipAssign, gridLocationAssign, gridResourceAssign, gridOrderBomRate]);

  async function loadModule() {
    let formData = new FormData();

    formData.append('MENU_ID', 'UI_MP_19');

    return zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_19_Q4',
      data: formData
    })
    .then(async function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        let result = res.data.RESULT_DATA;

        if (result.length > 0) {
          setModuleOptions(result);
          setValue('moduleId', result[0].DMND_MODULE_ID);
          await loadVersion(result[0].DMND_MODULE_ID);
        }
      }
    });
  }

  async function loadVersion(moduleId) {
    return loadComboList({
      URL: 'engine/mp/SRV_COMM_SRH_DMND_VER',
      CODE_KEY: 'VER_ID',
      CODE_VALUE: 'VER_ID',
      PARAM: { SNRIO_MST_ID: '', PLAN_TP_ID: '', CL_YN: 'Y', DMND_MODULE_ID: moduleId }
    })
    .then(function (res) {
      setVersionOptions(res);
      setValue('versionId', res[0].value);
    });
  }

  function loadGridData(activeTab) {
    if (activeTab === 'demandOverviewMaster') {
      loadDemandOverviewMaster();
    } else if (activeTab === 'demandOverviewDetail') {
      loadDemandOverviewDetail();
    } else if (activeTab === 'stockAssign') {
      loadStockAssign();
    } else if (activeTab === 'wipAssign') {
      loadWipAssign();
    } else if (activeTab === 'locationAssign') {
      loadLocationAssign();
    } else if (activeTab === 'resourceAssign') {
      loadResourceAssign();
    } else if (activeTab === 'orderBomRate') {
      loadOrderBomRate();
    }
  }

  function afterGridDemandOverviewMaster(gridObj) {
    setGridDemandOverviewMaster(gridObj);
    setGridDemandOverviewMasterOptions(gridObj);
  }

  function setGridDemandOverviewMasterOptions(gridObj) {
    gridObj.gridView.filteringOptions.automating.lookupDisplay = true;
    gridObj.gridView.setEditOptions({
      insertable: true,
      appendable: true,
      scrollOnEditing: 'commit'
    });

    gridObj.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridObj, true, false, false);
    gridObj.gridView.setFooters({ visible: false });

    setGridComboList(gridObj, 'URGENT_ORDER_TP', 'URGENT_ORDER_TYPE');
    gridObj.gridView.setFixedOptions({ colCount: 5, resizable : true });

    gridObj.gridView.onCellClicked = function (grid, clickData, column) {
      if (clickData.cellType && clickData.cellType === 'data') {
        let data = gridObj.dataProvider.getOutputRow(null, clickData.dataRow);
        loadDemandTrend(gridObj, data);
      }
    }

    gridObj.gridView.setColumnProperty('LOCAT_TP_NM', 'mergeRule', { criteria: 'value' });
    gridObj.gridView.setColumnProperty('LOCAT_LV', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('LOCAT_CD', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('LOCAT_NM', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('DMND_TP_NM', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('DMND_CLASS_NM', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('ITEM_CD', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('ITEM_NM', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('DESCRIP', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('ITEM_TP_NM', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('UOM_NM', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('ACCOUNT_CD', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('ACCOUNT_NM', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('CHANNEL_NM', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('INCOTERMS', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('CURCY_NM', 'mergeRule', { criteria: 'prevvalues + value' });
    gridObj.gridView.setColumnProperty('URGENT_ORDER_TP', 'mergeRule', { criteria: 'prevvalues + value' });
  }

  function setDemandTrendChartLegend() {
    let demandTrendDataSet = [
      { type: 'bar', label: transLangKey('DMND_QTY'), borderColor: 'white', borderWidth: 2, fill: false, backgroundColor: '#8EBC00', order: 1, yAxisID: 'quantity', data: [] }
    ];

    setDemandTrendData({
      labels: [],
      datasets: demandTrendDataSet
    });
  }

  function afterGridDemandOverviewDetail(gridObj) {
    setGridDemandOverviewDetail(gridObj);
    setGridDemandOverviewDetailOptions(gridObj);
  }

  function setGridDemandOverviewDetailOptions(gridObj) {
    gridObj.gridView.filteringOptions.automating.lookupDisplay = true;
    gridObj.gridView.setEditOptions({
      insertable: true,
      appendable: true,
      scrollOnEditing: 'commit'
    });

    gridObj.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridObj, true, true, false);
    gridObj.gridView.setFooters({ visible: false });

    setGridComboList(gridObj, 'DMND_TP_ID, DMND_CLASS_ID, URGENT_ORDER_TP, UOM_NM, TIME_UOM_NM, DELIVY_PLAN_POLICY_CD_ID, MAT_CONST_CD_ID, STRATEGY_METHD_ID', 'DEMAND_TYPE, DEMAND_CLASS, URGENT_ORDER_TYPE, UOM, TIME_UOM, CM_BASE_ORD_DELIV_POLICY, MP_ORD_CAPA_MAT_COST, STRATEGY_METHD');
    gridObj.gridView.setFixedOptions({ colCount: 1, resizable : true });

    gridObj.gridView.onCellDblClicked = function (grid, clickData) {
      if (clickData.cellType === "data") {
        gridObj.gridView.commit(true);
        setPopupData(gridObj.dataProvider.getOutputRow(null, clickData.dataRow));
        openDemandOverviewPopup();
      }
    };
  }

  function afterGridStockAssign(gridObj) {
    setGridStockAssign(gridObj);
    setGridStockAssignOptions(gridObj);
  }

  function setGridStockAssignOptions(gridObj) {
    gridObj.gridView.filteringOptions.automating.lookupDisplay = true;
    gridObj.gridView.setEditOptions({
      insertable: true,
      appendable: true,
      scrollOnEditing: 'commit'
    });

    gridObj.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridObj, true, true, false);
    gridObj.gridView.setFooters({ visible: false });

    setGridComboList(gridObj, 'UOM_ID, DMND_TP_ID, ASSIGN_TP_ID, STOCK_UOM_ID', 'UOM, DEMAND_TYPE, STOCK_ASSIGN_TP, UOM');
    gridObj.gridView.setFixedOptions({ colCount: 3, resizable : true });
  }

  function afterGridWipAssign(gridObj) {
    setGridWipAssign(gridObj);
    setGridWipAssignOptions(gridObj);
  }

  function setGridWipAssignOptions(gridObj) {
    gridObj.gridView.filteringOptions.automating.lookupDisplay = true;
    gridObj.gridView.setEditOptions({
      insertable: true,
      appendable: true,
      scrollOnEditing: 'commit'
    });

    gridObj.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridObj, true, true, false);
    gridObj.gridView.setFooters({ visible: false });

    setGridComboList(gridObj, 'UOM_ID, DMND_TP_ID, WIP_UOM_ID', 'UOM, DEMAND_TYPE, UOM');
    gridObj.gridView.setFixedOptions({ colCount: 3, resizable : true });
  }

  function afterGridLocationAssign(gridObj) {
    setGridLocationAssign(gridObj);
    setGridLocationAssignOptions(gridObj);
  }

  function setGridLocationAssignOptions(gridObj) {
    gridObj.gridView.filteringOptions.automating.lookupDisplay = true;
    gridObj.gridView.setEditOptions({
      insertable: true,
      appendable: true,
      scrollOnEditing: 'commit'
    });

    gridObj.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridObj, true, true, false);
    gridObj.gridView.setFooters({ visible: false });

    gridObj.gridView.setFixedOptions({ colCount: 3, resizable : true });
  }

  function afterGridResourceAssign(gridObj) {
    setGridResourceAssign(gridObj);
    setGridResourceAssignOptions(gridObj);
  }

  function setGridResourceAssignOptions(gridObj) {
    gridObj.gridView.filteringOptions.automating.lookupDisplay = true;
    gridObj.gridView.setEditOptions({
      insertable: true,
      appendable: true,
      scrollOnEditing: 'commit'
    });

    gridObj.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridObj, true, true, false);
    gridObj.gridView.setFooters({ visible: false });

    gridObj.gridView.setFixedOptions({ colCount: 3, resizable : true });
  }

  function afterGridOrderBomRate(gridObj) {
    setGridOrderBomRate(gridObj);
    setGridOrderBomRateOptions(gridObj);
  }

  function setGridOrderBomRateOptions(gridObj) {
    gridObj.gridView.filteringOptions.automating.lookupDisplay = true;
    gridObj.gridView.setEditOptions({
      insertable: true,
      appendable: true,
      scrollOnEditing: 'commit'
    });

    gridObj.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridObj, true, true, false);
    gridObj.gridView.setFooters({ visible: false });

    gridObj.gridView.setFixedOptions({ colCount: 2, resizable : true });
  }

  function refresh(activeTab) {
    reset({
      moduleId: getValues('moduleId'),
      versionId: getValues('versionId')
    });
    currentItemRef.reset();
    currentLocationRef.reset();

    if (activeTab === 'demandOverviewMaster') {
      gridDemandOverviewMaster.dataProvider.clearRows();
    } else if (activeTab === 'demandOverviewDetail') {
      gridDemandOverviewDetail.dataProvider.clearRows();
    } else if (activeTab === 'stockAssign') {
      gridStockAssign.dataProvider.clearRows();
    } else if (activeTab === 'wipAssign') {
      gridWipAssign.dataProvider.clearRows();
    } else if (activeTab === 'locationAssign') {
      gridLocationAssign.dataProvider.clearRows();
    } else if (activeTab === 'resourceAssign') {
      gridResourceAssign.dataProvider.clearRows();
    } else if (activeTab === 'orderBomRate') {
      gridOrderBomRate.dataProvider.clearRows();
    }

    setDemandTrendChartLegend();
  }

  function loadDemandOverviewMaster() {
    let formData = new FormData();

    formData.append('LOCAT_TP_NM', currentLocationRef.getLocationType());
    formData.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    formData.append('LOCAT_CD', currentLocationRef.getLocationCode());
    formData.append('LOCAT_NM', currentLocationRef.getLocationName());
    formData.append('ITEM_CD', currentItemRef.getItemCode());
    formData.append('ITEM_NM', currentItemRef.getItemName());
    formData.append('ITEM_TP_NM', currentItemRef.getItemType());
    formData.append('ACCOUNT_CD', getValues('accountCode'));
    formData.append('ACCOUNT_NM', getValues('accountName'));
    formData.append('URGENT_ORDER_TP', '');
    formData.append('DMND_TP_ID', '');
    formData.append('VER_ID', getValues('versionId'));
    formData.append('DMND_MODULE_ID', getValues('moduleId'));
    formData.append('VIEW_ID', 'UI_MP_19');
    formData.append('CROSSTAB', JSON.stringify(gridDemandOverviewMaster.gridView.crossTabInfo));

    return zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_SP_UI_MP_19_Q10',
      data: formData,
      waitOn: tabValue !== 'demandOverviewDetail'
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridDemandOverviewMaster.dataProvider.clearRows();
        gridDemandOverviewMaster.setData(res.data.RESULT_DATA);
        setDemandTrendChartLegend();
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function loadDemandTrend(grid, data) {
    let demandTrendDataSet = [
      { type: 'bar', label: transLangKey('DMND_QTY'), borderColor: 'white', borderWidth: 2, fill: false, backgroundColor: '#8EBC00', order: 1, yAxisID: 'quantity', data: [] }
    ];

    let dateColumn = [];
    grid.dataProvider.getFieldNames().filter(fieldName => fieldName.includes('DAT_')).forEach(fieldName => dateColumn.push(fieldName));

    let date = dateColumn.map(fieldName => fieldName.split('_')[2]);
    let targetData = grid.dataProvider.getJsonRows().filter(row => row.LOCAT_CD === data.LOCAT_CD && row.ITEM_CD === data.ITEM_CD && row.ACCOUNT_CD === data.ACCOUNT_CD);

    let rows = targetData.filter(targetRow => targetRow.CATEGORY === 'DMND_QTY');
    demandTrendDataSet[0].data = [];

    let labelDate = [];

    rows.forEach(row => {
      for (let i = 0; i < dateColumn.length; i++) {
        if (row[dateColumn[i]]) {
          labelDate.push(date[i]);
          demandTrendDataSet[0].data.push(row[dateColumn[i]]);
        }
      }
    });

    setDemandTrendData({
      labels: labelDate,
      datasets: demandTrendDataSet
    });
  }

  function loadDemandOverviewDetail() {
    let param = new FormData();

    param.append('ITEM_CD', currentItemRef.getItemCode());
    param.append('ITEM_NM', currentItemRef.getItemName());
    param.append('ITEM_TP', currentItemRef.getItemType());
    param.append('ACCOUNT_CD', getValues('accountCode'));
    param.append('ACCOUNT_NM', getValues('accountName'));
    param.append('URGENT_ORDER_TP', '');
    param.append('DMND_TP', '');
    param.append('VER_ID', getValues('versionId'));
    param.append('DMND_ID', getValues('demandId'));
    param.append('LOCAT_TP_NM', currentLocationRef.getLocationType());
    param.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    param.append('LOCAT_CD', currentLocationRef.getLocationCode());
    param.append('LOCAT_NM', currentLocationRef.getLocationName());

    if (getValues('startDate') instanceof Date) {
      param.append('STRT_DATE', new Date(getValues('startDate')).format('yyyy-MM-ddT00:00:00'));
    }

    if (getValues('endDate') instanceof Date) {
      param.append('END_DATE', new Date(getValues('endDate')).format('yyyy-MM-ddT00:00:00'));
    }

    return zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_SP_UI_MP_19_Q1',
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridDemandOverviewDetail.dataProvider.clearRows();
        gridDemandOverviewDetail.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function saveDemandOverviewDetail() {
    gridDemandOverviewDetail.gridView.commit(true);

    let changedRow = [];

    changedRow = changedRow.concat(
      gridDemandOverviewDetail.dataProvider.getAllStateRows().created,
      gridDemandOverviewDetail.dataProvider.getAllStateRows().updated,
      gridDemandOverviewDetail.dataProvider.getAllStateRows().deleted,
      gridDemandOverviewDetail.dataProvider.getAllStateRows().createAndDeleted
    );

    if (!changedRow.length) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
    } else {
      showMessage(transLangKey('SAVE'), transLangKey('MSG_SAVE'), function (answer) {
        if (answer) {
          let dateFields = gridDemandOverviewDetail.dataProvider.getFields().filter(field => field.dataType === 'datetime');
          let param = new FormData();
          let changes = [];

          changedRow.forEach(function (row) {
            let rowData = gridDemandOverviewDetail.dataProvider.getJsonRow(row);

            for (let i = 0; i < dateFields.length; i++) {
              let dateField = dateFields[i].fieldName;
              if (rowData[dateField] instanceof Date) {
                rowData[dateField] = rowData[dateField].format("yyyy-MM-ddTHH:mm:ss");
              }
            }

            changes.push(rowData);
          });

          param.append('changes', JSON.stringify(changes));
          param.append('USER_ID', username);

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_SP_UI_MP_19_S1',
            data: param
          })
          .then(function (res) {
            if (res.data.RESULT_SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_MP_19_S1_P_RT_MSG), { close: false });
              loadDemandOverviewDetail();
            } else {
              showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
            }
          })
          .catch(function (err) {
            console.error(err);
          });
        }
      });
    }
  }

  function loadStockAssign() {
    let formData = new FormData();

    formData.append('ITEM_CD', currentItemRef.getItemCode());
    formData.append('ITEM_NM', currentItemRef.getItemName());
    formData.append('ITEM_TP', currentItemRef.getItemType());
    formData.append('ACCOUNT_CD', getValues('accountCode'));
    formData.append('ACCOUNT_NM', getValues('accountName'));
    formData.append('URGENT_ORDER_TP', '');
    formData.append('DMND_ID', getValues('demandId'));
    formData.append('DMND_TP', '');
    formData.append('VER_ID', getValues('versionId'));

    return zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_SP_UI_MP_19_Q12',
      data: formData,
      waitOn: tabValue !== 'demandOverviewDetail'
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridStockAssign.dataProvider.clearRows();
        gridStockAssign.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function saveStockAssign() {
    gridStockAssign.gridView.commit(true);

    let changedRow = [];

    changedRow = changedRow.concat(
      gridStockAssign.dataProvider.getAllStateRows().created,
      gridStockAssign.dataProvider.getAllStateRows().updated,
      gridStockAssign.dataProvider.getAllStateRows().deleted,
      gridStockAssign.dataProvider.getAllStateRows().createAndDeleted
    );

    if (!changedRow.length) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
    } else {
      showMessage(transLangKey('SAVE'), transLangKey('MSG_SAVE'), function (answer) {
        if (answer) {
          let param = new FormData();
          let changes = [];

          changedRow.forEach(function (row) {
            let rowData = gridStockAssign.dataProvider.getJsonRow(row);
            changes.push(rowData);
          });

          param.append('changes', JSON.stringify(changes));
          param.append('USER_ID', username);

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_SP_UI_MP_19_S5',
            data: param
          })
          .then(function (res) {
            if (res.data.RESULT_SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_MP_19_S5_P_RT_MSG), { close: false });
              loadStockAssign();
            } else {
              showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
            }
          })
          .catch(function (err) {
            console.error(err);
          });
        }
      });
    }
  }

  function loadWipAssign() {
    let formData = new FormData();

    formData.append('ITEM_CD', currentItemRef.getItemCode());
    formData.append('ITEM_NM', currentItemRef.getItemName());
    formData.append('ITEM_TP', currentItemRef.getItemType());
    formData.append('ROUTE_CD', '');
    formData.append('ROUTE_DESCRIP', '');
    formData.append('ACCOUNT_CD', getValues('accountCode'));
    formData.append('ACCOUNT_NM', getValues('accountName'));
    formData.append('URGENT_ORDER_TP', '');
    formData.append('DMND_ID', getValues('demandId'));
    formData.append('DMND_TP', '');
    formData.append('VER_ID', getValues('versionId'));

    return zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_SP_UI_MP_19_Q13',
      data: formData,
      waitOn: tabValue !== 'demandOverviewDetail'
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridWipAssign.dataProvider.clearRows();
        gridWipAssign.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function saveWipAssign() {
    gridWipAssign.gridView.commit(true);

    let changedRow = [];

    changedRow = changedRow.concat(
      gridWipAssign.dataProvider.getAllStateRows().created,
      gridWipAssign.dataProvider.getAllStateRows().updated,
      gridWipAssign.dataProvider.getAllStateRows().deleted,
      gridWipAssign.dataProvider.getAllStateRows().createAndDeleted
    );

    if (!changedRow.length) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
    } else {
      showMessage(transLangKey('SAVE'), transLangKey('MSG_SAVE'), function (answer) {
        if (answer) {
          let param = new FormData();
          let changes = [];

          changedRow.forEach(function (row) {
            let rowData = gridWipAssign.dataProvider.getJsonRow(row);
            changes.push(rowData);
          });

          param.append('changes', JSON.stringify(changes));
          param.append('USER_ID', username);

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_UI_MP_19_S7',
            data: param
          })
          .then(function (res) {
            if (res.data.RESULT_SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_MP_19_S7_P_RT_MSG), { close: false });
              loadWipAssign();
            } else {
              showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
            }
          })
          .catch(function (err) {
            console.error(err);
          });
        }
      });
    }
  }

  function loadLocationAssign() {
    let formData = new FormData();

    formData.append('DMND_OVW_VER_ID', getValues('versionId'));
    formData.append('ITEM_CD', currentItemRef.getItemCode());
    formData.append('ITEM_NM', currentItemRef.getItemName());
    formData.append('ITEM_TP', currentItemRef.getItemType());
    formData.append('ACCOUNT_CD', getValues('accountCode'));
    formData.append('ACCOUNT_NM', getValues('accountName'));
    formData.append('URGENT_ORDER_TP', '');
    formData.append('DMND_ID', getValues('demandId'));
    formData.append('DMND_TP', '');

    return zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_19_Q2',
      data: formData,
      waitOn: tabValue !== 'demandOverviewDetail'
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridLocationAssign.dataProvider.clearRows();
        gridLocationAssign.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function saveLocationAssign() {
    gridLocationAssign.gridView.commit(true);

    let changedRow = [];

    changedRow = changedRow.concat(
      gridLocationAssign.dataProvider.getAllStateRows().created,
      gridLocationAssign.dataProvider.getAllStateRows().updated,
      gridLocationAssign.dataProvider.getAllStateRows().deleted,
      gridLocationAssign.dataProvider.getAllStateRows().createAndDeleted
    );

    if (!changedRow.length) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
    } else {
      showMessage(transLangKey('SAVE'), transLangKey('MSG_SAVE'), function (answer) {
        if (answer) {
          let param = new FormData();
          let changes = [];

          changedRow.forEach(function (row) {
            let rowData = gridLocationAssign.dataProvider.getJsonRow(row);
            changes.push(rowData);
          });

          param.append('changes', JSON.stringify(changes));
          param.append('USER_ID', username);

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_UI_MP_19_S2',
            data: param
          })
          .then(function (res) {
            if (res.data.RESULT_SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_MP_19_S2_P_RT_MSG), { close: false });
              loadLocationAssign();
            } else {
              showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
            }
          })
          .catch(function (err) {
            console.error(err);
          });
        }
      });
    }
  }

  function loadResourceAssign() {
    let formData = new FormData();

    formData.append('DMND_OVW_VER_ID', getValues('versionId'));
    formData.append('ITEM_CD', currentItemRef.getItemCode());
    formData.append('ITEM_NM', currentItemRef.getItemName());
    formData.append('ITEM_TP', currentItemRef.getItemType());
    formData.append('ROUTE_CD', '');
    formData.append('ROUTE_DESCRIP', '');
    formData.append('ACCOUNT_CD', getValues('accountCode'));
    formData.append('ACCOUNT_NM', getValues('accountName'));
    formData.append('DMND_ID', getValues('demandId'));
    formData.append('DMND_TP', '');
    formData.append('URGENT_ORDER_TP', '');

    return zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_19_Q3',
      data: formData,
      waitOn: tabValue !== 'demandOverviewDetail'
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridResourceAssign.dataProvider.clearRows();
        gridResourceAssign.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function saveResourceAssign() {
    gridResourceAssign.gridView.commit(true);

    let changedRow = [];

    changedRow = changedRow.concat(
      gridResourceAssign.dataProvider.getAllStateRows().created,
      gridResourceAssign.dataProvider.getAllStateRows().updated,
      gridResourceAssign.dataProvider.getAllStateRows().deleted,
      gridResourceAssign.dataProvider.getAllStateRows().createAndDeleted
    );

    if (!changedRow.length) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
    } else {
      showMessage(transLangKey('SAVE'), transLangKey('MSG_SAVE'), function (answer) {
        if (answer) {
          let param = new FormData();
          let changes = [];

          changedRow.forEach(function (row) {
            let rowData = gridResourceAssign.dataProvider.getJsonRow(row);
            changes.push(rowData);
          });

          param.append('changes', JSON.stringify(changes));
          param.append('USER_ID', username);

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_UI_MP_19_S3',
            data: param
          })
          .then(function (res) {
            if (res.data.RESULT_SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_MP_19_S3_P_RT_MSG), { close: false });
              loadResourceAssign();
            } else {
              showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
            }
          })
          .catch(function (err) {
            console.error(err);
          });
        }
      });
    }
  }

  function loadOrderBomRate() {
    let formData = new FormData();

    formData.append('DMND_OVW_VER_ID', getValues('versionId'));
    formData.append('ITEM_CD', currentItemRef.getItemCode());
    formData.append('ITEM_NM', currentItemRef.getItemName());
    formData.append('ITEM_TP', currentItemRef.getItemType());
    formData.append('ACCOUNT_CD', getValues('accountCode'));
    formData.append('ACCOUNT_NM', getValues('accountName'));
    formData.append('DMND_ID', getValues('demandId'));
    formData.append('DMND_TP', '');
    formData.append('URGENT_ORDER_TP', '');

    return zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_19_Q8',
      data: formData,
      waitOn: tabValue !== 'demandOverviewDetail'
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridOrderBomRate.dataProvider.clearRows();
        gridOrderBomRate.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function saveOrderBomRate() {
    gridOrderBomRate.gridView.commit(true);

    let changedRow = [];

    changedRow = changedRow.concat(
      gridOrderBomRate.dataProvider.getAllStateRows().created,
      gridOrderBomRate.dataProvider.getAllStateRows().updated,
      gridOrderBomRate.dataProvider.getAllStateRows().deleted,
      gridOrderBomRate.dataProvider.getAllStateRows().createAndDeleted
    );

    if (!changedRow.length) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
    } else {
      showMessage(transLangKey('SAVE'), transLangKey('MSG_SAVE'), function (answer) {
        if (answer) {
          let param = new FormData();
          let changes = [];

          changedRow.forEach(function (row) {
            let rowData = gridOrderBomRate.dataProvider.getJsonRow(row);
            changes.push(rowData);
          });

          param.append('changes', JSON.stringify(changes));
          param.append('USER_ID', username);

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_UI_MP_19_POP_S6',
            data: param
          })
          .then(function (res) {
            if (res.data.RESULT_SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_MP_19_POP_S6_P_RT_MSG), { close: false });
              loadOrderBomRate();
            } else {
              showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
            }
          })
          .catch(function (err) {
            console.error(err);
          });
        }
      });
    }
  }

  function openAccountPopup() {
    setAccountPopupOpen(true);
  }

  function closeAccountPopup() {
    setAccountPopupOpen(false);
  }

  function onSetAccount(gridRow) {
    setValue('accountCode', gridRow.ACCOUNT_CD);
    setValue('accountName', gridRow.ACCOUNT_NM);
  }

  function openDemandOverviewPopup() {
    setDemandOverviewPopupOpen(true);
  }

  function closeDemandOverviewPopup() {
    setDemandOverviewPopupOpen(false);
    setPopupData(null);
  }

  function openBatchUpdatePopup() {
    setBatchUpdatePopupOpen(true);
  }

  function closeBatchUpdatePopup() {
    setBatchUpdatePopupOpen(false);

    loadGridData(tabValue);
  }

  const tabChange = (event, newValue) => {
    setViewInfo(vom.active, 'globalButtons', [
      { name: 'search', action: (e) => { loadGridData(newValue); }, visible: true, disable: false },
      { name: 'refresh', action: (e) => { refresh(newValue); }, visible: true, disable: false }
    ]);

    setTabValue(newValue);
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <InputField type="select" name="moduleId" label={transLangKey("MODULE_VAL")} control={control} options={moduleOptions} style={{ display: "none" }} />
            <InputField type="select" name="versionId" label={transLangKey("VERSION_ID")} control={control} options={versionOptions} />
            <InputField name="demandId" label={transLangKey("DMND_ID")} control={control} style={{ display: tabValue === "demandOverviewMaster" ? "none" : "block" }} />
            <ItemSearchBox ref={itemSearchBoxRef} keyValue={"itemCode"} placeHolder={transLangKey("ITEM_CD")} style={{width: 300}}/>
            <InputField type="action" name="accountCode" label={transLangKey("ACCOUNT_CD")} control={control} onClick={openAccountPopup}>
              <Icon.Search />
            </InputField>
            <InputField name="accountName" label={transLangKey("ACCOUNT_NM")} control={control} />

            <LocationSearchBox ref={locationSearchBoxRef} keyValue={"locationCode"} placeHolder={transLangKey("LOCAT_CD")} style={{ display: "none" }} />
            {/*style={{ display: (tabValue === "demandOverviewMaster" || tabValue === "demandOverviewDetail") ? "block" : "none" }} />*/}
            <InputField name="startDate" type="datetime" label={transLangKey("STRT_DATE")} dateformat="yyyy-MM-dd" control={control} style={{ display: "none" }} />
            <InputField name="endDate" type="datetime" label={transLangKey("END_DATE")} dateformat="yyyy-MM-dd" control={control} style={{ display: "none" }} />
          </SearchRow>
        </SearchArea>

        <ResultArea>
          <Box style={{ height: "100%" }}>
            <Tabs onChange={tabChange} indicatorColor="primary" value={tabValue}>
              <Tab label={transLangKey("DETAIL")} value="demandOverviewDetail" />
              <Tab label={transLangKey("MASTER")} value="demandOverviewMaster" />
              <Tab label={transLangKey("ASSIGN_STOCK")} value="stockAssign" />
              <Tab label={transLangKey("ASSIGN_WIP")} value="wipAssign" />
              <Tab label={transLangKey("ASSIGN_SITE")} value="locationAssign" />
              <Tab label={transLangKey("ASSIGN_RES")} value="resourceAssign" />
              <Tab label={transLangKey("ORDER_BOM_RATE")} value="orderBomRate" />
            </Tabs>
            <Box style={{ marginTop: "3px", width: "100%", height: "100%" }}>
              <Box sx={{ display: "flex", height: "calc(100% - 50px)", width: "100%", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "demandOverviewDetail" ? "block" : "none" }}>
                <ButtonArea>
                  <LeftButtonArea>
                    <GridExcelExportButton type="icon" grid="gridDemandOverviewDetail" options={exportOptions} />
                    <CommonButton title={transLangKey("BATCH_UPDATE")} onClick={openBatchUpdatePopup}><Icon.Database/></CommonButton>
                  </LeftButtonArea>
                  <RightButtonArea>
                    <GridAddRowButton type="icon" onClick={openDemandOverviewPopup} />
                    <GridSaveButton type="icon" onClick={saveDemandOverviewDetail} />
                  </RightButtonArea>
                </ButtonArea>
                <Box style={{ height: "calc(100% - 40px)" }}>
                  <BaseGrid id="gridDemandOverviewDetail" items={gridDemandOverviewDetailColumns} afterGridCreate={afterGridDemandOverviewDetail} />
                </Box>
              </Box>
              <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "demandOverviewMaster" ? "block" : "none" }}>
                <ButtonArea>
                  <LeftButtonArea>
                    <GridExcelExportButton type="icon" grid="gridDemandOverviewMaster" options={exportOptions} />
                  </LeftButtonArea>
                </ButtonArea>
                <Box style={{ height: "calc(100% - 53px)" }}>
                  <ResultArea sizes={[70, 30]} direction={"vertical"}>
                    <Box>
                      <BaseGrid id="gridDemandOverviewMaster" items={gridDemandOverviewMasterColumns} viewCd="UI_MP_19" gridCd="UI_MP_19-RST_CPT_02" afterGridCreate={afterGridDemandOverviewMaster} />
                    </Box>
                    <Box>
                      <Box style={{ width: "100%", height: "100%" }}>
                        <Bar data={demandTrendData} options={demandTrendChartOptions} />
                      </Box>
                    </Box>
                  </ResultArea>
                </Box>
              </Box>
              <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "stockAssign" ? "block" : "none" }}>
                <ButtonArea>
                  <LeftButtonArea>
                    <GridExcelExportButton type="icon" grid="gridStockAssign" options={exportOptions} />
                  </LeftButtonArea>
                  <RightButtonArea>
                    <GridSaveButton type="icon" onClick={saveStockAssign} />
                  </RightButtonArea>
                </ButtonArea>
                <Box style={{ height: "calc(100% - 40px)" }}>
                  <BaseGrid id="gridStockAssign" items={gridStockAssignColumns} afterGridCreate={afterGridStockAssign} />
                </Box>
              </Box>
              <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "wipAssign" ? "block" : "none" }}>
                <ButtonArea>
                  <LeftButtonArea>
                    <GridExcelExportButton type="icon" grid="gridWipAssign" options={exportOptions} />
                  </LeftButtonArea>
                  <RightButtonArea>
                    <GridSaveButton type="icon" onClick={saveWipAssign} />
                  </RightButtonArea>
                </ButtonArea>
                <Box style={{ height: "calc(100% - 40px)" }}>
                  <BaseGrid id="gridWipAssign" items={gridWipAssignColumns} afterGridCreate={afterGridWipAssign} />
                </Box>
              </Box>
              <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "locationAssign" ? "block" : "none" }}>
                <ButtonArea>
                  <LeftButtonArea>
                    <GridExcelExportButton type="icon" grid="gridLocationAssign" options={exportOptions} />
                  </LeftButtonArea>
                  <RightButtonArea>
                    <GridSaveButton type="icon" onClick={saveLocationAssign} />
                  </RightButtonArea>
                </ButtonArea>
                <Box style={{ height: "calc(100% - 40px)" }}>
                  <BaseGrid id="gridLocationAssign" items={gridLocationAssignColumns} afterGridCreate={afterGridLocationAssign} />
                </Box>
              </Box>
              <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "resourceAssign" ? "block" : "none" }}>
                <ButtonArea>
                  <LeftButtonArea>
                    <GridExcelExportButton type="icon" grid="gridResourceAssign" options={exportOptions} />
                  </LeftButtonArea>
                  <RightButtonArea>
                    <GridSaveButton type="icon" onClick={saveResourceAssign} />
                  </RightButtonArea>
                </ButtonArea>
                <Box style={{ height: "calc(100% - 40px)" }}>
                  <BaseGrid id="gridResourceAssign" items={gridResourceAssignColumns} afterGridCreate={afterGridResourceAssign} />
                </Box>
              </Box>
              <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "orderBomRate" ? "block" : "none" }}>
                <ButtonArea>
                  <LeftButtonArea>
                    <GridExcelExportButton type="icon" grid="gridOrderBomRate" options={exportOptions} />
                  </LeftButtonArea>
                  <RightButtonArea>
                    <GridSaveButton type="icon" onClick={saveOrderBomRate} />
                  </RightButtonArea>
                </ButtonArea>
                <Box style={{ height: "calc(100% - 40px)" }}>
                  <BaseGrid id="gridOrderBomRate" items={gridOrderBomRateColumns} afterGridCreate={afterGridOrderBomRate} />
                </Box>
              </Box>
            </Box>
          </Box>
        </ResultArea>
      </ContentInner>

      { accountPopupOpen && <PopAccount open={accountPopupOpen} onClose={closeAccountPopup} confirm={onSetAccount} /> }
      { demandOverviewPopupOpen && <PopDemandOverview open={demandOverviewPopupOpen} onClose={closeDemandOverviewPopup} confirm={loadDemandOverviewDetail} version={getValues("versionId")} data={popupData} /> }
      { batchUpdatePopupOpen && <PopDemandOverviewBatchUpdate open={batchUpdatePopupOpen} onClose={ closeBatchUpdatePopup } /> }
    </>
  )
}

export default DemandOverview;
