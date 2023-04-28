import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Button } from '@mui/material';
import {
  BaseGrid, ButtonArea, CommonButton, ContentInner, GridExcelExportButton, GridExcelImportButton, GridSaveButton,
  InputField, LeftButtonArea, ResultArea, RightButtonArea, SearchArea, SearchRow, useUserStore, useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';
import { setGridComboList } from "@wingui/view/supplychainmodel/common/common";

import PopPeriodInfoMgmt from './PopPeriodInfoMgmt';
import PopInventoryPolicyDetailBundleCreate from './PopInventoryPolicyDetailBundleCreate';
import PopCyclCalendar from '@wingui/view/supplychainmodel/common/PopCyclCalendar';
import LocationSearchBox from '@wingui/view/supplychainmodel/common/LocationSearchBox';
import ItemSearchBox from '@wingui/view/supplychainmodel/common/ItemSearchBox';

import "./footer.css";

let gridInvPolicyDtlColumns = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: true, width: "150" },
  { name: "TOTAL_GROUP", dataType: "text", headerText: "TOTAL_GROUP", visible: false, editable: false, width: "0", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
  {
    name: "LOCATION", dataType: "group", orientation: "horizontal", headerText: "LOCAT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "80", groupShowMode: "expand", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "80", groupShowMode: "expand", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "80", groupShowMode: "always", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "130", groupShowMode: "always", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} }
    ]
  },
  {
    name: "ITEM", dataType: "group", orientation: "horizontal", headerText: "ITEM", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: "100", autoFilter: true, groupShowMode: "always", groupFooter: { text: "SUM", lang: true, styleName: "groupfooter-column"}, footer: { text: "SUM", lang: true, styleName: "footer-column"} },
      { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: "130", autoFilter: true, groupShowMode: "always", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "DESCRIP", dataType: "text", headerText: "DESCRIP", visible: false, editable: false, width: "160", groupShowMode: "expand", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "UOM_NM", dataType: "text", headerText: "UOM_NM", visible: true, editable: false, width: "50", groupShowMode: "expand", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} }
    ]
  },
  {
    name: "SEGMT_BASE", dataType: "group", orientation: "horizontal", headerText: "SEGMT_BASE", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "VAL_01", dataType: "text", headerText: "VAL_01", visible: true, editable: false, width: "50", groupShowMode: "always", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "QUADRANT_DESCRIP", dataType: "text", headerText: "QUADRANT_DESCRIP", visible: true, editable: false, width: "180", lang: true, groupShowMode: "always", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "VAL_02", dataType: "text", headerText: "VAL_02", visible: true, editable: false, width: "70", groupShowMode: "always", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "VAL_03", dataType: "text", headerText: "VAL_03", visible: true, editable: false, width: "90", groupShowMode: "expand", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "VAL_04", dataType: "text", headerText: "VAL_04", visible: true, editable: false, width: "80", groupShowMode: "expand", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "VAL_05", dataType: "text", headerText: "VAL_05", visible: true, editable: false, width: "110", groupShowMode: "expand", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "VAL_06", dataType: "text", headerText: "VAL_06", visible: false, editable: false, width: "110", groupShowMode: "expand", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "VAL_07", dataType: "text", headerText: "VAL_07", visible: true, editable: false, width: "110", groupShowMode: "expand", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "VAL_08", dataType: "text", headerText: "VAL_08", visible: true, editable: false, width: "110", groupShowMode: "expand", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "VAL_09", dataType: "text", headerText: "VAL_09", visible: true, editable: false, width: "110", groupShowMode: "expand", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "VAL_10", dataType: "text", headerText: "VAL_10", visible: true, editable: false, width: "110", groupShowMode: "expand", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"}},
      { name: "VAL_11", dataType: "text", headerText: "VAL_11", visible: true, editable: false, width: "110", groupShowMode: "expand", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "VAL_12", dataType: "text", headerText: "VAL_12", visible: false, editable: false, width: "110", groupShowMode: "expand", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "VAL_13", dataType: "text", headerText: "VAL_13", visible: false, editable: false, width: "110", groupShowMode: "expand", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "VAL_14", dataType: "text", headerText: "VAL_14", visible: false, editable: false, width: "110", groupShowMode: "expand", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "VAL_15", dataType: "text", headerText: "VAL_15", visible: false, editable: false, width: "110", groupShowMode: "expand", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "VAL_16", dataType: "text", headerText: "VAL_16", visible: false, editable: false, width: "110", groupShowMode: "expand", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "VAL_17", dataType: "text", headerText: "VAL_17", visible: false, editable: false, width: "110", groupShowMode: "expand", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "VAL_18", dataType: "text", headerText: "VAL_18", visible: false, editable: false, width: "110", groupShowMode: "expand", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "VAL_19", dataType: "text", headerText: "VAL_19", visible: false, editable: false, width: "110", groupShowMode: "expand", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "VAL_20", dataType: "text", headerText: "VAL_20", visible: false, editable: false, width: "110", groupShowMode: "expand", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} }
    ]
  },
  {
    name: "STOCK_LV", dataType: "group", orientation: "horizontal", headerText: "STOCK_LV", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "INV_LV_QTY", dataType: "number", headerText: "WAREHOUSE_QTY", visible: true, editable: false, width: "120", numberFormat: '#,###.###', groupShowMode: "expand", groupFooter: { expression: "sum", numberFormat: "#,###.##", styleName: "groupfooter-column"}, footer: { expression: "sum", numberFormat: "#,###.###", styleName: "footer-column"} },
      { name: "WAREHOUSE_AMT", dataType: "number", headerText: "WAREHOUSE_AMT", visible: true, editable: false, width: "120", numberFormat: '#,###.###', groupShowMode: "expand", groupFooter: { expression: "sum", numberFormat: "#,###.##", styleName: "groupfooter-column"}, footer: { expression: "sum", numberFormat: "#,###.###", styleName: "footer-column"} },
      { name: "INTRANSIT_QTY", dataType: "number", headerText: "INTRANSIT_QTY", visible: true, editable: false, width: "120", numberFormat: '#,###.###', groupShowMode: "expand", groupFooter: { expression: "sum", numberFormat: "#,###.##", styleName: "groupfooter-column"}, footer: { expression: "sum", numberFormat: "#,###.###", styleName: "footer-column"} },
      { name: "INTRANSIT_AMT", dataType: "number", headerText: "INTRANSIT_AMT", visible: true, editable: false, width: "120", numberFormat: '#,###.###', groupShowMode: "expand", groupFooter: { expression: "sum", numberFormat: "#,###.##", styleName: "groupfooter-column"}, footer: { expression: "sum", numberFormat: "#,###.###", styleName: "footer-column"} },
      { name: "INV_QTY", dataType: "number", headerText: "STOCK", visible: true, editable: false, width: "120", numberFormat: '#,###.###', groupShowMode: "always", groupFooter: { expression: "sum", numberFormat: "#,###.##", styleName: "groupfooter-column"}, footer: { expression: "sum", numberFormat: "#,###.###", styleName: "footer-column"} },
      { name: "INV_AMT", dataType: "number", headerText: "STOCK_AMT", visible: true, editable: false, width: "120", numberFormat: '#,###.###', groupShowMode: "always", groupFooter: { expression: "sum", numberFormat: "#,###.##", styleName: "groupfooter-column"}, footer: { expression: "sum", numberFormat: "#,###.###", styleName: "footer-column"} },
      { name: "SHPP_ACTUAL_PERIOD", dataType: "text", headerText: "SHIPPING_ACTUAL_PERIOD", visible: true, editable: false, width: "120", groupShowMode: "always", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "AVG_SHPP_ACTUAL_QTY", dataType: "number", headerText: "AVG_SHIPPING_ACTUAL_QTY", visible: true, editable: false, width: "120", numberFormat: '#,###.###', groupShowMode: "always", groupFooter: { expression: "sum", numberFormat: "#,###.##", styleName: "groupfooter-column"}, footer: { expression: "sum", numberFormat: "#,###.###", styleName: "footer-column"} },
      { name: "INVTURN", dataType: "number", headerText: "INVTURN", visible: true, editable: false, width: "80", numberFormat: '#,###.###', groupShowMode: "always", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} }
    ]
  },
  {
    name: "STOCK_MGMT_SYSTEM", dataType: "group", orientation: "horizontal", headerText: "STOCK_MGMT_SYSTEM", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "PRPSAL_INV_MGMT_SYSTEM_TP_ID", dataType: "text", headerText: "PRPSAL_INV_MGMT_SYSTEM_TP", visible: true, editable: false, width: "130", useDropdown: true, lookupDisplay: true, groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "INV_MGMT_SYSTEM_TP_ID", dataType: "text", headerText: "STOCK_MGMT_SYSTEM_TP", visible: true, editable: true, width: "120", useDropdown: true, lookupDisplay: true, groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "INV_MGMT_SYSTEM_TP_CD", dataType: "text", headerText: "STOCK_MGMT_SYSTEM_TP_CD", visible: false, editable: false, width: "120", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "PO_CYCL_CD", dataType: "text", headerText: "PO_CYCL_CD", visible: true, editable: false, width: "120", useDropdown: true, lookupDisplay: true, groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "PO_CYCL_CALENDAR", dataType: "text", headerText: "PO_CYCL_CALENDAR", visible: true, editable: true, width: "130", button: "action", buttonVisibility: "always", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "PO_CYCL_CALENDAR_ID", dataType: "text", headerText: "PO_CYCL_CALENDAR_ID", visible: false, editable: true, width: "100", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "OPERT_BASE_TP", dataType: "text", headerText: "OPERT_BASE_TP", visible: true, editable: false, width: "120", useDropdown: true, lookupDisplay: true, groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "INV_PLACE_STRTGY_ID", dataType: "text", headerText: "STOCK_PLACE_STRTGY", visible: true, editable: true, width: "120", useDropdown: true, lookupDisplay: true, groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} }
    ]
  },
  {
    name: "SUPPLY_LEADTIME", dataType: "group", orientation: "horizontal", headerText: "SUPPLY_LEADTIME", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "SUPPLY_LEADTIME_PRPSAL_VAL", dataType: "number", headerText: "SUPPLY_LEADTIME_PRPSAL_VAL", visible: true, editable: false, width: "100", numberFormat: '#,###.###', groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "SUPPLY_LEADTIME", dataType: "number", headerText: "SUPPLY_LEADTIME", visible: true, editable: true, width: "80", numberFormat: '#,###.###', groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} }
    ]
  },
  {
    name: "OPERT_TARGET", dataType: "group", orientation: "horizontal", headerText: "OPERT_TARGET", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "SUPPLY_LEADTIME_YN", dataType: "boolean", headerText: "SUPPLY_LEADTIME_YN", visible: true, editable: true, width: "100", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "PO_CYCL_YN", dataType: "boolean", headerText: "PO_CYCL_YN", visible: false, editable: false, width: "100", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "REPLSH_LEADTIME", dataType: "number", headerText: "REPLSH_LEADTIME", visible: true, editable: false, width: "100", numberFormat: '#,###.###', groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "OPERT_LV_VAL", dataType: "number", headerText: "OPERT_LV_VAL", visible: true, editable: true, width: "100", numberFormat: '#,###.###', groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "OPERT_TARGET_VAL", dataType: "number", headerText: "OPERT_TARGET_VAL", visible: true, editable: false, width: "100", numberFormat: '#,###.###', groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} }
    ]
  },
  {
    name: "SFST", dataType: "group", orientation: "horizontal", headerText: "SFST", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "PRPSAL_SVC_LV", dataType: "number", headerText: "PRPSAL_SVC_LV", visible: true, editable: false, width: "80", numberFormat: '#,###.###', groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "SFST_SVC_LV", dataType: "number", headerText: "SFST_SVC_LV", visible: true, editable: true, width: "80", numberFormat: '#,###.###', groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "SFST_DEMDVAR_CONSID_YN", dataType: "boolean", headerText: "SFST_DEMDVAR_CONSID_YN", visible: false, editable: false, width: "110", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "SFST_DEMDVAR_STDDEV", dataType: "number", headerText: "SFST_DEMDVAR_STDDEV", visible: true, editable: false, width: "110", numberFormat: '#,###.###', groupFooter: { expression: "sum", numberFormat: "#,###.##", styleName: "groupfooter-column" }, footer: { expression: "sum", numberFormat: "#,###.###", styleName: "footer-column" } },
      { name: "SFST_SUPYVAR_CONSID_YN", dataType: "boolean", headerText: "SFST_SUPYVAR_CONSID_YN", visible: true, editable: false, width: "100", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "SFST_DMND_RATE_CAL_TP_ID", dataType: "text", headerText: "SFST_DMND_RATE_CAL_TP", visible: true, editable: false, width: "120", useDropdown: true, lookupDisplay: true, groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "SFST_DMND_RATE", dataType: "number", headerText: "SFST_DMND_RATE", visible: true, editable: false, width: "80", numberFormat: '#,###.###', groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "SUPYVAR_STDDEV", dataType: "number", headerText: "SUPYVAR_STDDEV", visible: true, editable: false, width: "120", numberFormat: '#,###.###', groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "SFST_PRPSAL_VAL", dataType: "number", headerText: "SFST_PRPSAL_VAL", visible: true, editable: false, width: "90", numberFormat: '#,###.###', groupFooter: { expression: "sum", numberFormat: "#,###.##", styleName: "groupfooter-column" }, footer: { expression: "sum", numberFormat: "#,###.###", styleName: "footer-column" } },
      { name: "SFST_VAL", dataType: "number", headerText: "SFST_VAL", visible: true, editable: true, width: "80", numberFormat: '#,###.###', groupFooter: { expression: "sum", numberFormat: "#,###.##", styleName: "groupfooter-column" }, footer: { expression: "sum", numberFormat: "#,###.###", styleName: "footer-column" } },
      { name: "SFST_AMT", dataType: "number", headerText: "SFST_AMT", visible: true, editable: false, width: "90", numberFormat: '#,###.###', groupFooter: { expression: "sum", numberFormat: "#,###.##", styleName: "groupfooter-column" }, footer: { expression: "sum", numberFormat: "#,###.###", styleName: "footer-column" } }
    ]
  },
  {
    name: "OPERT_STOCK", dataType: "group", orientation: "horizontal", headerText: "OPERT_STOCK", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "OPT_INV_DMND_RATE_CAL_MTD_ID", dataType: "text", headerText: "OPERT_INV_DMND_RATE_CAL_MTD", visible: true, editable: false, width: "120", useDropdown: true, lookupDisplay: true, groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "OPERT_INV_DMND_RATE", dataType: "number", headerText: "OPERT_STOCK_DMND_RATE", visible: true, editable: false, width: "80", numberFormat: '#,###.###', groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "OPERT_INV_PRPSAL_VAL", dataType: "number", headerText: "OPERT_STOCK_PRPSAL_VAL", visible: true, editable: false, width: "100", numberFormat: '#,###.###', groupFooter: { expression: "sum", numberFormat: "#,###.##", styleName: "groupfooter-column" }, footer: { expression: "sum", numberFormat: "#,###.###", styleName: "footer-column" } },
      { name: "OPERT_INV_VAL", dataType: "number", headerText: "OPERT_STOCK_VAL", visible: true, editable: true, width: "80", numberFormat: '#,###.###', groupFooter: { expression: "sum", numberFormat: "#,###.##", styleName: "groupfooter-column" }, footer: { expression: "sum", numberFormat: "#,###.###", styleName: "footer-column" } },
      { name: "OPERT_INV_AMT", dataType: "number", headerText: "OPERT_STOCK_AMT", visible: true, editable: false, width: "90", numberFormat: '#,###.###', groupFooter: { expression: "sum", numberFormat: "#,###.##", styleName: "groupfooter-column" }, footer: { expression: "sum", numberFormat: "#,###.###", styleName: "footer-column" } }
    ]
  },
  {
    name: "ROP", dataType: "group", orientation: "horizontal", headerText: "ROP", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "ROP_CAL_TP_ID", dataType: "text", headerText: "ROP_CAL_TP_ID", visible: true, editable: false, width: "120", useDropdown: true, lookupDisplay: true, groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "ROP_SFST_CONSID_YN", dataType: "boolean", headerText: "ROP_SFST_CONSID_YN", visible: true, editable: true, width: "110", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "ROP_OPERT_INV_CONSID_YN", dataType: "boolean", headerText: "ROP_OPERT_STOCK_CONSID_YN", visible: true, editable: true, width: "100", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "ROP_RIGHT_RATE_YN", dataType: "boolean", headerText: "ROP_RIGHT_RATE_YN", visible: true, editable: false, width: "50", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "ROP_DMND_RATE_CAL_MTD_ID", dataType: "text", headerText: "ROP_DMND_RATE_CAL_METHD_ID", visible: true, editable: false, width: "120", useDropdown: true, lookupDisplay: true, groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "ROP_DMND_RATE", dataType: "number", headerText: "ROP_DMND_RATE", visible: true, editable: false, width: "80", numberFormat: '#,###.###', groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "ROP_RIGHT_RATE_TARGET", dataType: "number", headerText: "ROP_RIGHT_RATE_TARGET", visible: true, editable: false, width: "110", numberFormat: '#,###.###', groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "ROP_PRPSAL_VAL", dataType: "number", headerText: "ROP_PRPSAL_VAL", visible: true, editable: false, width: "80", numberFormat: '#,###.###', groupFooter: { expression: "sum", numberFormat: "#,###.##", styleName: "groupfooter-column" }, footer: { expression: "sum", numberFormat: "#,###.###", styleName: "footer-column" } },
      { name: "ROP_VAL", dataType: "number", headerText: "ROP_VAL", visible: true, editable: true, width: "50", numberFormat: '#,###.###', groupFooter: { expression: "sum", numberFormat: "#,###.##", styleName: "groupfooter-column" }, footer: { expression: "sum", numberFormat: "#,###.###", styleName: "footer-column" } },
      { name: "ROP_AMT", dataType: "number", headerText: "ROP_AMT", visible: true, editable: false, width: "90", numberFormat: '#,###.###', groupFooter: { expression: "sum", numberFormat: "#,###.##", styleName: "groupfooter-column" }, footer: { expression: "sum", numberFormat: "#,###.###", styleName: "footer-column" } }
    ]
  },
  {
    name: "PO_QTY", dataType: "group", orientation: "horizontal", headerText: "PO_QTY", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "EOQ_CAL_TP_ID", dataType: "text", headerText: "EOQ_CAL_TP_ID", visible: true, editable: false, width: "120", useDropdown: true, lookupDisplay: true, groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "EOQ_RIGHT_RATE_YN", dataType: "boolean", headerText: "EOQ_RIGHT_RATE_YN", visible: true, editable: false, width: "50", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "EOQ_DMND_RATE_CAL_MTD_ID", dataType: "text", headerText: "EOQ_DMND_RATE_CAL_METHD_ID", visible: true, editable: false, width: "120", useDropdown: true, lookupDisplay: true, groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "EOQ_DMND_RATE", dataType: "number", headerText: "EOQ_DMND_RATE", visible: true, editable: false, width: "80", numberFormat: '#,###.###', groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "EOQ_RIGHT_RATE_TARGET", dataType: "number", headerText: "EOQ_RIGHT_RATE_TARGET", visible: true, editable: false, width: "110", numberFormat: '#,###.###', groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "EOQ_MULTIPLE", dataType: "number", headerText: "EOQ_MULTIPLE", visible: true, editable: true, width: "110", numberFormat: '#,###.###', groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "EOQ_PRPSAL_VAL", dataType: "number", headerText: "EOQ_PRPSAL_VAL", visible: true, editable: false, width: "80", numberFormat: '#,###.###', groupFooter: { expression: "sum", numberFormat: "#,###.##", styleName: "groupfooter-column" }, footer: { expression: "sum", numberFormat: "#,###.###", styleName: "footer-column" } },
      { name: "EOQ_VAL", dataType: "number", headerText: "EOQ_VAL", visible: true, editable: true, width: "80", numberFormat: '#,###.###', groupFooter: { expression: "sum", numberFormat: "#,###.##", styleName: "groupfooter-column" }, footer: { expression: "sum", numberFormat: "#,###.###", styleName: "footer-column" } },
      { name: "EOQ_AMT", dataType: "number", headerText: "EOQ_AMT", visible: true, editable: false, width: "90", numberFormat: '#,###.###', groupFooter: { expression: "sum", numberFormat: "#,###.##", styleName: "groupfooter-column" }, footer: { expression: "sum", numberFormat: "#,###.###", styleName: "footer-column" } }
    ]
  },
  {
    name: "TARGET_STOCK", dataType: "group", orientation: "horizontal", headerText: "TARGET_STOCK", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "TARGET_INV_SFST_CONSID_YN", dataType: "boolean", headerText: "TARGET_STOCK_SFST_CONSID_YN", visible: true, editable: true, width: "100", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "TARGET_INV_OPERT_INV_CONSID_YN", dataType: "boolean", headerText: "TARGET_INV_OPERT_INV_CONSID_YN", visible: true, editable: true, width: "100", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "TARGET_INV_PRPSAL_VAL", dataType: "number", headerText: "TARGET_STOCK_PRPSAL_VAL", visible: true, editable: false, width: "100", numberFormat: '#,###.###', groupFooter: { expression: "sum", numberFormat: "#,###.##", styleName: "groupfooter-column" }, footer: { expression: "sum", numberFormat: "#,###.###", styleName: "footer-column" } },
      { name: "TARGET_INV_VAL", dataType: "number", headerText: "TARGET_STOCK_VAL", visible: true, editable: true, width: "80", numberFormat: '#,###.###', groupFooter: { expression: "sum", numberFormat: "#,###.##", styleName: "groupfooter-column" }, footer: { expression: "sum", numberFormat: "#,###.###", styleName: "footer-column" } },
      { name: "TARGET_INV_AMT", dataType: "number", headerText: "TARGET_STOCK_AMT", visible: true, editable: false, width: "90", numberFormat: '#,###.###', groupFooter: { expression: "sum", numberFormat: "#,###.##", styleName: "groupfooter-column" }, footer: { expression: "sum", numberFormat: "#,###.###", styleName: "footer-column" } }
    ]
  },
  { name: "MOQ", dataType: "number", headerText: "MOQ", visible: true, editable: true, width: "80", numberFormat: '#,###.###', groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
  { name: "MULTIPLIER", dataType: "number", headerText: "MULTIPLIER", visible: true, editable: true, width: "100", numberFormat: '#,###.###', groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
  { name: "FIXED_YN", dataType: "boolean", headerText: "FIXED_YN", visible: true, editable: true, width: "60", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
  { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "60", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
  {
    name: "EDIT", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: "100", groupShowMode: "expand", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: "120", groupShowMode: "expand", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: "100", groupShowMode: "always", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} },
      { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: "120", groupShowMode: "expand", groupFooter: { styleName: "groupfooter-column"}, footer: { styleName: "footer-column"} }
    ]
  }
];

function InventoryPolicyDetail() {
  const [gridInvPolicyDtl, setGridInvPolicyDtl] = useState(null);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo])
  const [username] = useUserStore((state) => [state.username]);

  const [popupData, setPopupData] = useState({});
  const [gridIndex, setGridIndex] = useState('');
  const [cycleCalendarOpen, setCycleCalendarOpen] = useState(false);
  const [inventoryPolicyDetailBundleCreateOpen, setInventoryPolicyDetailBundleCreateOpen] = useState(false);
  const [periodInfoMgmtOpen, setPeriodInfoMgmtOpen] = useState(false);

  const locationSearchBoxRef = useRef();
  const itemSearchBoxRef = useRef();

  const [currentLocationRef, setCurrentLocationRef] = useState();
  const [currentItemRef, setCurrentItemRef] = useState();

  const { reset, getValues, control, clearErrors } = useForm({
    defaultValues: {
      totalDisp: ['Y']
    }
  });

  const globalButtons = [
    { name: 'search', action: (e) => { loadInvPolicyDtl(); }, visible: true, disable: false, },
    { name: 'refresh', action: (e) => { refresh(); }, visible: true, disable: false, }
  ]

  const exportExcelOptions = {
    headerDepth: 2,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: true
  }

  useEffect(() => {
    if (locationSearchBoxRef) {
      if (locationSearchBoxRef.current) {
        setCurrentLocationRef(locationSearchBoxRef.current);
      }
    }

    if (itemSearchBoxRef) {
      if (itemSearchBoxRef.current) {
        setCurrentItemRef(itemSearchBoxRef.current);
      }
    }
  }, [viewData]);

  useEffect(() => {
    setViewInfo(vom.active, 'globalButtons', globalButtons);

    if (gridInvPolicyDtl) {
      loadInvPolicyDtl();
    }
  }, [gridInvPolicyDtl]);

  function afterGridInvPolicyDtl(gridObj) {
    setGridInvPolicyDtl(gridObj);
    setGridInvPolicyDtlOptions(gridObj);
  }

  function onSetCyclCal(gridRow) {
    let itemIndex = gridInvPolicyDtl.gridView.getCurrent().dataRow;

    gridInvPolicyDtl.dataProvider.setValue(itemIndex, 'PO_CYCL_CALENDAR_ID', gridRow.ID);
    gridInvPolicyDtl.dataProvider.setValue(itemIndex, 'PO_CYCL_CALENDAR', gridRow.CALENDAR_ID);
  }

  function openInventoryPolicyDetailBundleCreatePopup() {
    setInventoryPolicyDetailBundleCreateOpen(true);
  }

  function openPeriodInfoMgmtPopup() {
    setPopupData(gridInvPolicyDtl.gridView.getValues(gridIndex));
    setPeriodInfoMgmtOpen(true);
  }

  function refresh() {
    currentLocationRef.reset();
    currentItemRef.reset();
    reset();
    gridInvPolicyDtl.dataProvider.clearRows();
  }

  function setGridInvPolicyDtlOptions(gridObj) {
    setVisibleProps(gridObj, true, true, false);
    gridObj.gridView.setDisplayOptions({
      fitStyle: 'fill'
    });

    let totalDisp = getValues('totalDisp')[0];

    gridObj.gridView.setColumnProperty("LOCAT_TP_NM", "mergeRule", { criteria: "value" });
    gridObj.gridView.setColumnProperty("LOCAT_LV", "mergeRule", { criteria: "prevvalues + value" });
    gridObj.gridView.setColumnProperty("LOCAT_CD", "mergeRule", { criteria: "prevvalues + value" });
    gridObj.gridView.setColumnProperty("LOCAT_NM", "mergeRule", { criteria: "prevvalues + value" });

    gridObj.gridView.setFixedOptions({ colCount: 2, resizable: true });

    gridObj.gridView.groupPanel.visible = false;

    gridObj.gridView.orderBy(['LOCAT_CD'], ['ascending']);

    if (totalDisp == 'Y') {
      gridObj.gridView.groupBy(['LOCAT_CD']);
      gridObj.gridView.setFooters({ visible: true });
    } else {
      gridObj.gridView.groupBy();
      gridObj.gridView.setFooters({ visible: false });
    }

    gridObj.gridView.onCellButtonClicked = function (grid, clickData, column) {
      if (column.fieldName === 'PO_CYCL_CALENDAR') {
        setPopupData(grid.getValues(clickData.itemIndex));
        setCycleCalendarOpen(true);
      }
    }

    gridObj.gridView.onCellClicked = function (grid, index, itemIndex) {
      setGridIndex(index.itemIndex);
    }

    setGridComboList(gridObj,
      'PRPSAL_INV_MGMT_SYSTEM_TP_ID, INV_MGMT_SYSTEM_TP_ID, PO_CYCL_CD, OPERT_BASE_TP, INV_PLACE_STRTGY_ID',
      'INVENTORY_MGMT_SYSTEM_TYPE, INVENTORY_MGMT_SYSTEM_TYPE, PERIODIC_PO_YN, INVENTORY_SUPPLY_DATE_TYPE, STOCK_LOCATION_STRATEGY',
      { value: "CD_NM", label: "CD_NM" }
    );
    setGridComboList(gridObj,
      'SFST_DMND_RATE_CAL_TP_ID, OPT_INV_DMND_RATE_CAL_MTD_ID, ROP_CAL_TP_ID, ROP_DMND_RATE_CAL_MTD_ID, EOQ_CAL_TP_ID, EOQ_DMND_RATE_CAL_MTD_ID',
      'DEMAND_RATE_CAL_METHOD, DEMAND_RATE_CAL_METHOD, ROP_DECISION_RULE, DEMAND_RATE_CAL_METHOD, EOQ_DECISION_RULE, DEMAND_RATE_CAL_METHOD'
    );
  }

  function loadInvPolicyDtl() {
    let param = new FormData();

    param.append('LOCAT_TP', currentLocationRef.getLocationType());
    param.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    param.append('LOCAT_CD', currentLocationRef.getLocationCode());
    param.append('LOCAT_NM', currentLocationRef.getLocationName());
    param.append('ITEM_CD', currentItemRef.getItemCode());

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_IM_26_Q1',
      data: param
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          gridInvPolicyDtl.setData(res.data.RESULT_DATA);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function saveInvPolicyDtl() {
    gridInvPolicyDtl.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changes = [];
        let changeRowData = [];

        changes = changes.concat(
          gridInvPolicyDtl.dataProvider.getAllStateRows().created,
          gridInvPolicyDtl.dataProvider.getAllStateRows().updated,
          gridInvPolicyDtl.dataProvider.getAllStateRows().deleted,
          gridInvPolicyDtl.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          changeRowData.push(gridInvPolicyDtl.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          let formData = new FormData();

          formData.append('changes', JSON.stringify(changeRowData));
          formData.append('procedure', 'SP_UI_IM_26_S1_J');
          formData.append('P_USER_ID', username);

          zAxios({
            method: "post",
            headers: { "content-type": "application/json" },
            url: baseURI() + "common/json-save",
            data: formData
          })
          .then(function (res) {
            if (res.status === gHttpStatus.SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.IM_DATA.SP_UI_IM_26_S1_J_P_RT_MSG), { close: false });
              loadInvPolicyDtl();
            }
          })
          .catch(function (err) {
            console.log(err);
          });
        }
      }
    });
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <LocationSearchBox ref={locationSearchBoxRef} keyValue={'locationName'} placeHolder={transLangKey("LOCAT_NM")} style={{width:300}} />
            <ItemSearchBox ref={itemSearchBoxRef} keyValue={'itemCode'} placeHolder={transLangKey("ITEM_CD")} fields={['itemCode']} style={{ width:300, popoverHeight:150 }} />
            <InputField type='check' name='totalDisp' control={control} options={[{ label: transLangKey('TOTAL_DISP'), value: 'Y' }]} />
          </SearchRow>
        </SearchArea>
        <ResultArea>
          <Box sx={{ display: "flex", height: "100%", flexDirection: "column", alignContent: "stretch", alignItems: "stretch" }}>
            <ButtonArea>
              <LeftButtonArea>
                <GridExcelExportButton type='icon' grid='gridInvPolicyDtl' options={exportExcelOptions} />
                <GridExcelImportButton type='icon' grid='gridInvPolicyDtl' />
                <CommonButton title={transLangKey("BUNDLE_CREATE")} onClick={() => { openInventoryPolicyDetailBundleCreatePopup() }}><Icon.File/></CommonButton>
                <Button variant="outlined" sx={{ borderRadius: 2 }} color="primary" onClick={() => { openPeriodInfoMgmtPopup() }} title={transLangKey("POP_UI_IM_26_03")}>{transLangKey('POP_UI_IM_26_03')}</Button>
              </LeftButtonArea>
              <RightButtonArea>
                <GridSaveButton type="icon" onClick={() => { saveInvPolicyDtl() }} />
              </RightButtonArea>
            </ButtonArea>
            <Box style={{ height: 'calc(100% - 53px' }}>
              <BaseGrid id='gridInvPolicyDtl' items={gridInvPolicyDtlColumns} afterGridCreate={afterGridInvPolicyDtl} />
            </Box>
          </Box>
        </ResultArea>
      </ContentInner>

      {cycleCalendarOpen && (<PopCyclCalendar open={cycleCalendarOpen} onClose={() => { setCycleCalendarOpen(false); }} confirm={onSetCyclCal} data={popupData} />)}
      {inventoryPolicyDetailBundleCreateOpen && (<PopInventoryPolicyDetailBundleCreate open={inventoryPolicyDetailBundleCreateOpen} onClose={() => { setInventoryPolicyDetailBundleCreateOpen(false); }} confirm={loadInvPolicyDtl} />)}
      {periodInfoMgmtOpen && (<PopPeriodInfoMgmt open={periodInfoMgmtOpen} onClose={() => { setPeriodInfoMgmtOpen(false); }} confirm={loadInvPolicyDtl} data={popupData} />)}
    </>
  )
}

export default InventoryPolicyDetail;
