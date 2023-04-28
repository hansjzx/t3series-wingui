import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Tab, Tabs } from '@mui/material';
import { BaseGrid, ButtonArea, GridAddRowButton, GridDeleteRowButton, InputField, PopupDialog, RightButtonArea, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';
import { setGridComboList, getCodeList } from '@wingui/view/supplychainmodel/common/common';
import { newRowEditCellStyle } from '@wingui/view/demandplan/DpUtil';

import PopItem from '@wingui/view/supplychainmodel/common/PopCommItem';
import PopAccount from '@wingui/view/supplychainmodel/common/PopAccount';
import PopStock from './PopStock';
import PopWip from './PopWip';
import PopLocation from './PopLocation';
import PopResource from './PopResource';
import PopOrderBomRate from './PopOrderBomRate';

let gridStockAssignColumns = [
  { name: 'ID', headerText: 'ID', dataType: 'text', visible: false, editable: false },
  { name: 'DMND_OVERVIEW_ID', headerText: 'DMND_OVERVIEW_ID', dataType: 'text', visible: false },
  { name: 'STOCK_PARENT_ID', headerText: 'STOCK_PARENT_ID', dataType: 'text', visible: false },
  { name: 'ASSIGN_SEQ', headerText: 'ASSIGN_SEQ', dataType: 'number', width: '80', editable: true },
  { name: 'ASSIGN_TP_ID', headerText: 'ASSIGN_TP_ID', dataType: 'text', width: '150', editable: true, useDropdown: true, lookupDisplay: true },
  { name: 'ASSIGN_DESCRIP', headerText: 'ASSIGN_DESCRIP', dataType: 'text', width: '100', editable: true },
  { name: 'STOCK_ID', headerText: 'STOCK_ID', dataType: 'text', width: '110', editable: false, styleCallback: newRowEditCellStyle, button: 'action', buttonVisibility: 'always' },
  {
    name: 'LOCATION', dataType: 'group', orientation: 'horizontal', headerText: 'LOCAT', expandable: true, expanded: false,
    childs: [
      { name: 'LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: '120', editable: false, styleCallback: newRowEditCellStyle, groupShowMode: 'expand' },
      { name: 'LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: '120', editable: false, styleCallback: newRowEditCellStyle, groupShowMode: 'expand' },
      { name: 'LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: '120', editable: false, styleCallback: newRowEditCellStyle, groupShowMode: 'always' },
      { name: 'LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: '120', editable: false, styleCallback: newRowEditCellStyle, groupShowMode: 'always' }
    ]
  },
  { name: 'ITEM_CD', headerText: 'ITEM_CD', dataType: 'text', width: '80', editable: false, styleCallback: newRowEditCellStyle },
  { name: 'ITEM_NM', headerText: 'ITEM_NM', dataType: 'text', width: '80', editable: false, styleCallback: newRowEditCellStyle },
  { name: 'UOM_ID', headerText: 'UOM', dataType: 'text', width: '60', editable: false, styleCallback: newRowEditCellStyle, useDropdown: true, lookupDisplay: true },
  { name: 'LOT_NO', headerText: 'LOT_NO', dataType: 'text', width: '80', editable: false, styleCallback: newRowEditCellStyle },
  { name: 'QTY', headerText: 'QTY', dataType: 'number', width: '60', editable: true },
  { name: 'INV_TP', headerText: 'INV_TP', dataType: 'text', width: '100', editable: false, styleCallback: newRowEditCellStyle },
  { name: 'ASSIGN_YN', headerText: 'ASSIGN_YN', dataType: 'boolean', width: '60', editable: true },
  { name: 'ACTV_YN', headerText: 'ACTV_YN', dataType: 'boolean', width: '60', editable: true }
]

let gridWipAssignColumns = [
  { name: 'ID', headerText: 'ID', dataType: 'text', visible: false, editable: false },
  { name: 'DMND_OVERVIEW_ID', headerText: 'DMND_OVERVIEW_ID', dataType: 'text', visible: false },
  { name: 'WIP_MST_ID', headerText: 'WIP_MST_ID', dataType: 'text', visible: false },
  { name: 'WIP_ID', headerText: 'WIP_ID', dataType: 'text', width: '100', editable: false, styleCallback: newRowEditCellStyle, button: 'action', buttonVisibility: 'always' },
  {
    name: 'LOCATION', dataType: 'group', orientation: 'horizontal', headerText: 'LOCAT', expandable: true, expanded: false,
    childs: [
      { name: 'LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: '120', editable: false, styleCallback: newRowEditCellStyle, groupShowMode: 'expand' },
      { name: 'LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: '120', editable: false, styleCallback: newRowEditCellStyle, groupShowMode: 'expand' },
      { name: 'LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: '120', editable: false, styleCallback: newRowEditCellStyle, groupShowMode: 'always' },
      { name: 'LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: '120', editable: false, styleCallback: newRowEditCellStyle, groupShowMode: 'always' }
    ]
  },
  { name: 'ITEM_CD', headerText: 'ITEM_CD', dataType: 'text', width: '80', editable: false, styleCallback: newRowEditCellStyle },
  { name: 'ITEM_NM', headerText: 'ITEM_NM', dataType: 'text', width: '80', editable: false, styleCallback: newRowEditCellStyle },
  { name: 'ROUTE_CD', headerText: 'ROUTE_CD', dataType: 'text', width: '80', editable: false, styleCallback: newRowEditCellStyle },
  { name: 'UOM_ID', headerText: 'UOM', dataType: 'text', width: '60', editable: false, styleCallback: newRowEditCellStyle, lookupDisplay: true },
  { name: 'RES_CD', headerText: 'RES_CD', dataType: 'text', width: '80', editable: false, styleCallback: newRowEditCellStyle },
  { name: 'RES_DESCRIP', headerText: 'RES_DESCRIP', dataType: 'text', width: '120', editable: false, styleCallback: newRowEditCellStyle },
  { name: 'ACCOUNT_CD', headerText: 'ACCOUNT_CD', dataType: 'text', width: '80', editable: false, styleCallback: newRowEditCellStyle },
  { name: 'ACCOUNT_NM', headerText: 'ACCOUNT_NM', dataType: 'text', width: '80', editable: false, styleCallback: newRowEditCellStyle },
  { name: 'WIP_QTY', headerText: 'WIP_QTY', dataType: 'number', width: '80', editable: false, styleCallback: newRowEditCellStyle },
  { name: 'QTY', headerText: 'QTY', dataType: 'number', width: '60', editable: true },
  { name: 'ASSIGN_YN', headerText: 'ASSIGN_YN', dataType: 'boolean', width: '60', editable: true },
  { name: 'ACTV_YN', headerText: 'ACTV_YN', dataType: 'boolean', width: '60', editable: true }
]

let gridLocationAssignColumns = [
  { name: 'DMND_OVW_SITE_ASIGN_ID', headerText: 'ID', dataType: 'text', width: '100', visible: false },
  { name: 'DMND_OVERVIEW_ID', headerText: 'DMND_OVERVIEW_ID', dataType: 'text', width: '100', visible: false },
  { name: 'TRANSP_MGMT_MST_ID', headerText: 'TRANSP_MGMT_MST_ID', dataType: 'text', width: '100', visible: false },
  {
    name: 'CONSUME', dataType: 'group', orientation: 'horizontal', headerText: 'CONSUME', expandable: true, expanded: false,
    childs: [
      { name: 'CONSUME_LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: '120', editable: false, styleCallback: newRowEditCellStyle, groupShowMode: 'expand' },
      { name: 'CONSUME_LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: '120', editable: false, styleCallback: newRowEditCellStyle, groupShowMode: 'expand' },
      { name: 'CONSUME_LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: '120', editable: false, styleCallback: newRowEditCellStyle, groupShowMode: 'always', button: 'action', buttonVisibility: 'always' },
      { name: 'CONSUME_LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: '120', editable: false, styleCallback: newRowEditCellStyle, groupShowMode: 'always' }
    ]
  },
  {
    name: 'SUPPLY', dataType: 'group', orientation: 'horizontal', headerText: 'SUPPLY', expandable: true, expanded: false,
    childs: [
      { name: 'SUPPLY_LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: '120', editable: false, styleCallback: newRowEditCellStyle, groupShowMode: 'expand' },
      { name: 'SUPPLY_LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: '120', editable: false, styleCallback: newRowEditCellStyle, groupShowMode: 'expand' },
      { name: 'SUPPLY_LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: '120', editable: false, styleCallback: newRowEditCellStyle, groupShowMode: 'always' },
      { name: 'SUPPLY_LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: '120', editable: false, styleCallback: newRowEditCellStyle, groupShowMode: 'always' }
    ]
  },
  { name: 'ITEM_CD', headerText: 'ITEM_CD', dataType: 'text', width: '80', editable: false, styleCallback: newRowEditCellStyle },
  { name: 'ITEM_NM', headerText: 'ITEM_NM', dataType: 'text', width: '80', editable: false, styleCallback: newRowEditCellStyle },
  { name: 'VEHICL_TP', headerText: 'VEHICL_TP', dataType: 'text', width: '80', editable: false, styleCallback: newRowEditCellStyle },
  { name: 'ASSIGN_YN', headerText: 'ASSIGN_YN', dataType: 'boolean', width: '60', editable: true },
  { name: 'ACTV_YN', headerText: 'ACTV_YN', dataType: 'boolean', width: '60', editable: true }
]

let gridResourceAssignColumns = [
  { name: 'ID', headerText: 'ID', dataType: 'text', width: '100', visible: false },
  { name: 'DMND_OVERVIEW_ID', headerText: 'DMND_OVERVIEW_ID', dataType: 'text', width: '100', visible: false },
  { name: 'LOCAT_MGMT_ID', headerText: 'LOCAT_MGMT_ID', dataType: 'text', width: '100', visible: false },
  { name: 'RES_PREFER_MST_ID', headerText: 'RES_PREFER_MST_ID', dataType: 'text', width: '100', visible: false },
  { name: 'RES_CD', headerText: 'RES_CD', dataType: 'text', width: '80', editable: false, styleCallback: newRowEditCellStyle, button: 'action', buttonVisibility: 'always' },
  { name: 'RES_NM', headerText: 'RES_DESCRIP', dataType: 'text', width: '120' },
  { name: 'LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: '80', editable: false, styleCallback: newRowEditCellStyle },
  { name: 'LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: '80', editable: false, styleCallback: newRowEditCellStyle },
  { name: 'LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: '80', editable: false, styleCallback: newRowEditCellStyle },
  { name: 'LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: '120', editable: false, styleCallback: newRowEditCellStyle },
  { name: 'ITEM_CD', headerText: 'ITEM_CD', dataType: 'text', width: '80', editable: false, styleCallback: newRowEditCellStyle },
  { name: 'ITEM_NM', headerText: 'ITEM_NM', dataType: 'text', width: '80', editable: false, styleCallback: newRowEditCellStyle },
  { name: 'ASSIGN_YN', headerText: 'ASSIGN_YN', dataType: 'boolean', width: '60', editable: true },
  { name: 'ACTV_YN', headerText: 'ACTV_YN', dataType: 'boolean', width: '60', editable: true }
]

let gridOrderBomRateColumns = [
  { name: 'ID', dataType: 'text', visible: false },
  { name: 'DMND_OVW_ID', dataType: 'text', visible: false },
  { name: 'PRDUCT_BOM_DTL_ID', dataType: 'text', visible: false },
  {
    name: 'LOCATION', dataType: 'group', orientation: 'horizontal', headerText: 'LOCAT', expandable: true, expanded: false,
    childs: [
      { name: 'LOCAT_TP_NM', headerText: 'LOCAT_TP_NM', dataType: 'text', width: '120', editable: false, styleCallback: newRowEditCellStyle, groupShowMode: 'expand' },
      { name: 'LOCAT_LV', headerText: 'LOCAT_LV', dataType: 'text', width: '120', editable: false, styleCallback: newRowEditCellStyle, groupShowMode: 'expand' },
      { name: 'LOCAT_CD', headerText: 'LOCAT_CD', dataType: 'text', width: '120', editable: false, styleCallback: newRowEditCellStyle, groupShowMode: 'always', button: 'action', buttonVisibility: 'always' },
      { name: 'LOCAT_NM', headerText: 'LOCAT_NM', dataType: 'text', width: '120', editable: false, styleCallback: newRowEditCellStyle, groupShowMode: 'always' }
    ]
  },
  {
    name: 'PARENT_ITEM', dataType: 'group', orientation: 'horizontal', headerText: 'PARENT_ITEM',
    childs: [
      { name: 'P_ITEM_CD', headerText: 'PARENT_ITEM', dataType: 'text', width: '80', editable: false, styleCallback: newRowEditCellStyle },
      { name: 'P_ITEM_NM', headerText: 'ITEM_NM', dataType: 'text', width: '80', editable: false, styleCallback: newRowEditCellStyle },
      { name: 'P_ITEM_TP', headerText: 'ITEM_TP', dataType: 'text', width: '80', editable: false, styleCallback: newRowEditCellStyle }
    ]
  },
  { name: 'BOM_VER_ID', headerText: 'BOM_VER_ID', dataType: 'text', width: '80', editable: false, styleCallback: newRowEditCellStyle },
  { name: 'BOM_LV', headerText: 'BOM_LV', dataType: 'text', width: '80', editable: false, styleCallback: newRowEditCellStyle },
  {
    name: 'COMPONENT_ITEM', dataType: 'group', orientation: 'horizontal', headerText: 'COMPONENT_ITEM',
    childs: [
      { name: 'C_ITEM_CD', headerText: 'COMPONENT_ITEM', dataType: 'text', width: '100', editable: false, styleCallback: newRowEditCellStyle },
      { name: 'C_ITEM_NM', headerText: 'ITEM_NM', dataType: 'text', width: '80', editable: false, styleCallback: newRowEditCellStyle },
      { name: 'C_ITEM_TP', headerText: 'ITEM_TP', dataType: 'text', width: '80', editable: false, styleCallback: newRowEditCellStyle }
    ]
  },
  { name: 'BASE_BOM_RATE', headerText: 'BASE_BOM_RATE', dataType: 'number', width: '100', editable: false, styleCallback: newRowEditCellStyle },
  { name: 'BOM_RATE', headerText: 'BOM_RATE', dataType: 'number', width: '80', editable: true },
  { name: 'ACTV_YN', headerText: 'ACTV_YN', dataType: 'boolean', width: '60', editable: true }
]

function PopDemandOverview(props) {
  const [username] = useUserStore(state => [state.username]);

  const [gridStockAssign, setGridStockAssign] = useState(null);
  const [gridWipAssign, setGridWipAssign] = useState(null);
  const [gridLocationAssign, setGridLocationAssign] = useState(null);
  const [gridResourceAssign, setGridResourceAssign] = useState(null);
  const [gridOrderBomRate, setGridOrderBomRate] = useState(null);

  const [demandTypeOptions, setDemandTypeOptions] = useState([]);
  const [urgentOrderTypeOptions, setUrgentOrderTypeOptions] = useState([]);
  const [demandClassOptions, setDemandClassOptions] = useState([]);
  const [uomOptions, setUomOptions] = useState([]);
  const [deliveryPolicyOptions, setDeliveryPolicyOptions] = useState([]);
  const [materialConstraintOptions, setMaterialConstraintOptions] = useState([]);
  const [planStrategyOptions, setPlanStrategyOptions] = useState([]);

  const [tabValue, setTabValue] = props.data ? useState('stockAssign') : useState('demandInformation');

  const [itemPopupOpen, setItemPopupOpen] = useState(false);
  const [accountPopupOpen, setAccountPopupOpen] = useState(false);
  const [stockPopupOpen, setStockPopupOpen] = useState(false);
  const [wipPopupOpen, setWipPopupOpen] = useState(false);
  const [locationPopupOpen, setLocationPopupOpen] = useState(false);
  const [resourcePopupOpen, setResourcePopupOpen] = useState(false);
  const [orderBomRatePopupOpen, setOrderBomRatePopupOpen] = useState(false);

  const [popupData, setPopupData] = useState({});
  const [editMode, setEditMode] = props.data ? useState(true) : useState(false);

  const { control, getValues, setValue } = useForm({
    defaultValues: {
      module: props.data ? props.data.MODULE_VAL : 'DP',
      confirm: ['Y'],
      finalConfirm: ['Y'],
      active: !props.data || props.data.ACTV_YN ? ['Y'] : [],
      displayColor: props.data ? props.data.DISPLAY_COLOR : '',
      demandType: props.data ? props.data.DMND_TP_ID : '',
      demandId: props.data ? props.data.DMND_ID : '',
      demandOverviewId: props.data ? props.data.ID : '',
      urgentOrderType: props.data ? props.data.URGENT_ORDER_TP : '',
      demandClass: props.data ? props.data.DMND_CLASS_ID : '',
      itemMasterId: props.data ? props.data.ITEM_MST_ID : '',
      itemCode: props.data ? props.data.ITEM_CD : '',
      itemName: props.data ? props.data.ITEM_NM : '',
      itemType: props.data ? props.data.ITEM_TP_NM : '',
      demandQty: props.data ? props.data.DMND_QTY : '',
      uom: props.data ? props.data.UOM_NM : '',
      salesPrice: props.data ? props.data.SALES_UNIT_PRIC : '',
      accountId: props.data ? props.data.ACCOUNT_ID : '',
      accountCode: props.data ? props.data.ACCOUNT_CD : '',
      accountName: props.data ? props.data.ACCOUNT_NM : '',
      dueDate: props.data ? props.data.DUE_DATE : '',
      bodLeadTime: props.data ? props.data.BOD_LEADTIME : '',
      timeUom: props.data ? props.data.TIME_UOM_NM : '',
      priority: props.data ? props.data.PRIORT : '',
      productionDeliveryDate: props.data ? props.data.PRDUCT_DELIVY_DATE : '',
      deliveryPolicy: props.data ? props.data.DELIVY_PLAN_POLICY_CD_ID : '',
      materialConstraint: props.data ? props.data.MAT_CONST_CD_ID : '',
      partialPlan: props.data && props.data.PARTIAL_PLAN_YN ? ['Y'] : [],
      heuristic : props.data && props.data.HEURISTIC_YN ? ['Y'] : [],
      costOptimization: props.data && props.data.COST_OPTIMIZ_YN ? ['Y'] : [],
      pst: props.data ? props.data.PST : '',
      dueDateFence: props.data ? props.data.DUE_DATE_FNC : '',
      planStrategy: props.data ? props.data.STRATEGY_METHD_ID : ''
    }
  });

  useEffect(() => {
    async function initLoad() {
      if (!props.data) {
        await createDemandId();
      }
      setSelectOptions();
    }

    initLoad();
  }, []);

  useEffect(() => {
    if (props.data) {
      if (gridStockAssign && gridWipAssign && gridLocationAssign && gridResourceAssign && gridOrderBomRate) {
        loadAllGrids();
      }
    }
  }, [gridStockAssign, gridWipAssign, gridLocationAssign, gridResourceAssign, gridOrderBomRate]);

  async function setSelectOptions() {
    let dataArr = await getCodeList('DEMAND_TYPE, URGENT_ORDER_TYPE, DEMAND_CLASS, UOM, CM_BASE_ORD_DELIV_POLICY, MP_ORD_CAPA_MAT_COST, STRATEGY_METHD')

    setDemandTypeOptions(dataArr.filter(code => code.GROUP == 'DEMAND_TYPE').map(data => ({ value: data.ID, label: data.CD_NM })));
    setUrgentOrderTypeOptions(dataArr.filter(code => code.GROUP == 'URGENT_ORDER_TYPE').map(data => ({ value: data.ID, label: data.CD_NM })));
    setDemandClassOptions(dataArr.filter(code => code.GROUP == 'DEMAND_CLASS').map(data => ({ value: data.ID, label: data.CD_NM })));
    setUomOptions(dataArr.filter(code => code.GROUP == 'UOM').map(data => ({ value: data.ID, label: data.CD_NM })));
    setDeliveryPolicyOptions(dataArr.filter(code => code.GROUP == 'CM_BASE_ORD_DELIV_POLICY').map(data => ({ value: data.ID, label: data.CD_NM })));
    setMaterialConstraintOptions(dataArr.filter(code => code.GROUP == 'MP_ORD_CAPA_MAT_COST').map(data => ({ value: data.ID, label: data.CD_NM })));
    setPlanStrategyOptions(dataArr.filter(code => code.GROUP == 'STRATEGY_METHD').map(data => ({ value: data.ID, label: data.CD_NM })));

    if (!props.data || !props.data.DMND_TP_ID) {
      setValue('demandType', dataArr.filter(code => code.GROUP == 'DEMAND_TYPE')[0].ID);
    }

    if (!props.data || !props.data.DMND_TP_ID) {
      setValue('demandClass', dataArr.filter(code => code.GROUP == 'DEMAND_CLASS')[0].ID);
    }

    if (!props.data || !props.data.DELIVY_PLAN_POLICY_CD_ID) {
      setValue('deliveryPolicy', dataArr.filter(code => code.GROUP == 'CM_BASE_ORD_DELIV_POLICY')[0].ID);
    }
  }

  function createDemandId() {
    let param = new URLSearchParams();

    param.append('DEMAND_VER_ID', props.version);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_19_Q9',
      data: param,
      fromPopup: true
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        setValue('demandId', res.data.RESULT_DATA[0].DEMAND_ID);
        setValue('demandOverviewId', res.data.RESULT_DATA[0].NEW_ID);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function afterGridStockAssign(gridObj) {
    setGridStockAssign(gridObj);
    setGridStockAssignOptions(gridObj);
  }

  function afterGridWipAssign(gridObj) {
    setGridWipAssign(gridObj);
    setGridWipAssignOptions(gridObj);
  }

  function afterGridLocationAssign(gridObj) {
    setGridLocationAssign(gridObj);
    setGridLocationAssignOptions(gridObj);
  }

  function afterGridResourceAssign(gridObj) {
    setGridResourceAssign(gridObj);
    setGridResourceAssignOptions(gridObj);
  }

  function afterGridOrderBomRate(gridObj) {
    setGridOrderBomRate(gridObj);
    setGridOrderBomRateOptions(gridObj);
  }

  function setGridStockAssignOptions(gridObj) {
    gridObj.gridView.setEditOptions({
      insertable: true,
      appendable: true,
      scrollOnEditing: 'commit'
    });

    gridObj.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridObj, true, true, true);
    gridObj.gridView.setFooters({ visible: false });

    setGridComboList(gridObj, 'ASSIGN_TP_ID, UOM_ID', 'STOCK_ASSIGN_TP, UOM');

    gridObj.gridView.onCellButtonClicked = function (grid, index, column) {
      if (getValues('itemCode') === '') {
        showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5144'), { close: false });
      } else {
        if (getValues('accountCode') === '') {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5145'), { close: false });
        } else {
          setPopupData({ itemMasterId: getValues('itemMasterId'), accountId: getValues('accountId') });
          grid.commit(true);
          openStockPopup();
        }
      }
    }
  }

  function setGridWipAssignOptions(gridObj) {
    gridObj.gridView.setEditOptions({
      insertable: true,
      appendable: true,
      scrollOnEditing: 'commit'
    });

    gridObj.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridObj, true, true, true);
    gridObj.gridView.setFooters({ visible: false });

    setGridComboList(gridObj, 'UOM_ID', 'UOM');

    gridObj.gridView.onCellButtonClicked = function (grid, index, column) {
      if (getValues('itemCode') === '') {
        showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5144'), { close: false });
      } else {
        if (getValues('accountCode') === '') {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5145'), { close: false });
        } else {
          setPopupData({ itemMasterId: getValues('itemMasterId'), accountId: getValues('accountId') });
          grid.commit(true);
          openWipPopup();
        }
      }
    }
  }

  function setGridLocationAssignOptions(gridObj) {
    gridObj.gridView.setEditOptions({
      insertable: true,
      appendable: true,
      scrollOnEditing: 'commit'
    });

    gridObj.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridObj, true, true, true);
    gridObj.gridView.setFooters({ visible: false });

    setGridComboList(gridObj, 'UOM_ID', 'UOM');

    gridObj.gridView.onCellButtonClicked = function (grid, index, column) {
      if (getValues('itemCode') === '') {
        showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5144'), { close: false });
      } else {
        if (getValues('accountCode') === '') {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5145'), { close: false });
        } else {
          setPopupData({ itemMasterId: getValues('itemMasterId'), accountId: getValues('accountId') });
          grid.commit(true);
          openLocationPopup();
        }
      }
    }
  }

  function setGridResourceAssignOptions(gridObj) {
    gridObj.gridView.setEditOptions({
      insertable: true,
      appendable: true,
      scrollOnEditing: 'commit'
    });

    gridObj.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridObj, true, true, true);
    gridObj.gridView.setFooters({ visible: false });

    setGridComboList(gridObj, 'UOM_ID', 'UOM');

    gridObj.gridView.onCellButtonClicked = function (grid, index, column) {
      if (getValues('itemCode') === '') {
        showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5144'), { close: false });
      } else {
        if (getValues('accountCode') === '') {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5145'), { close: false });
        } else {
          setPopupData({ itemMasterId: getValues('itemMasterId'), accountId: getValues('accountId') });
          grid.commit(true);
          openResourcePopup();
        }
      }
    }
  }

  function setGridOrderBomRateOptions(gridObj) {
    gridObj.gridView.setEditOptions({
      insertable: true,
      appendable: true,
      scrollOnEditing: 'commit'
    });

    gridObj.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridObj, true, true, true);
    gridObj.gridView.setFooters({ visible: false });

    setGridComboList(gridObj, 'UOM_ID', 'UOM');

    gridObj.gridView.onCellButtonClicked = function (grid, index, column) {
      if (getValues('itemCode') === '') {
        showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5144'), { close: false });
      } else {
        if (getValues('accountCode') === '') {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5145'), { close: false });
        } else {
          setPopupData({ itemMasterId: getValues('itemMasterId'), accountId: getValues('accountId') });
          grid.commit(true);
          openOrderBomRatePopup();
        }
      }
    }
  }

  function onAfterAdd(gridObj) {
    let itemIndex = gridObj.gridView.getCurrent().dataRow;

    if (tabValue === 'orderBomRate') {
      gridObj.dataProvider.setValue(itemIndex, 'DMND_OVW_ID', getValues('demandOverviewId'));
    } else {
      gridObj.dataProvider.setValue(itemIndex, 'DMND_OVERVIEW_ID', getValues('demandOverviewId'));
    }

    gridObj.gridView.setCurrent({ itemIndex: itemIndex });
    gridObj.gridView.commit(true);
  }

  function openItemPopup() {
    setItemPopupOpen(true);
  }

  function closeItemPopup() {
    setItemPopupOpen(false);
  }

  function onSetItem(gridRow) {
    setValue('itemMasterId', gridRow[0].ITEM_MST_ID);
    setValue('itemCode', gridRow[0].ITEM_CD);
    setValue('itemName', gridRow[0].ITEM_NM);
    setValue('itemType', gridRow[0].ITEM_TP_NM);
    setValue('uom', gridRow[0].ITEM_UOM_ID);
  }

  function openAccountPopup() {
    setAccountPopupOpen(true);
  }

  function closeAccountPopup() {
    setAccountPopupOpen(false);
  }

  function onSetAccount(gridRow) {
    setValue('accountId', gridRow.ACCOUNT_ID);
    setValue('accountCode', gridRow.ACCOUNT_CD);
    setValue('accountName', gridRow.ACCOUNT_NM);
  }

  function openStockPopup() {
    setStockPopupOpen(true);
  }

  function closeStockPopup() {
    setStockPopupOpen(false);
  }

  function onSetStock(gridRow) {
    let itemIndex = gridStockAssign.gridView.getCurrent().dataRow;

    gridStockAssign.dataProvider.setValue(itemIndex, 'STOCK_PARENT_ID', gridRow.STOCK_PARENT_ID);
    gridStockAssign.dataProvider.setValue(itemIndex, 'STOCK_ID', gridRow.STOCK_ID);
    gridStockAssign.dataProvider.setValue(itemIndex, 'ITEM_CD', gridRow.ITEM_CD);
    gridStockAssign.dataProvider.setValue(itemIndex, 'ITEM_NM', gridRow.ITEM_NM);
    gridStockAssign.dataProvider.setValue(itemIndex, 'LOCAT_TP_NM', gridRow.LOCAT_TP_NM);
    gridStockAssign.dataProvider.setValue(itemIndex, 'LOCAT_LV', gridRow.LOCAT_LV);
    gridStockAssign.dataProvider.setValue(itemIndex, 'LOCAT_CD', gridRow.LOCAT_CD);
    gridStockAssign.dataProvider.setValue(itemIndex, 'LOCAT_NM', gridRow.LOCAT_NM);
    gridStockAssign.dataProvider.setValue(itemIndex, 'UOM_ID', gridRow.UOM_ID);
    gridStockAssign.dataProvider.setValue(itemIndex, 'LOT_NO', gridRow.LOT_NO);
    gridStockAssign.dataProvider.setValue(itemIndex, 'QTY', gridRow.QTY);
    gridStockAssign.dataProvider.setValue(itemIndex, 'INV_TP', gridRow.INV_TP);

    gridStockAssign.gridView.commit(true);
  }

  function openWipPopup() {
    setWipPopupOpen(true);
  }

  function closeWipPopup() {
    setWipPopupOpen(false);
  }

  function onSetWip(gridRow) {
    let itemIndex = gridWipAssign.gridView.getCurrent().dataRow;

    gridWipAssign.dataProvider.setValue(itemIndex, 'WIP_MST_ID', gridRow.WIP_MST_ID);
    gridWipAssign.dataProvider.setValue(itemIndex, 'WIP_ID', gridRow.WIP_ID);
    gridWipAssign.dataProvider.setValue(itemIndex, 'LOCAT_TP_NM', gridRow.LOCAT_TP_NM);
    gridWipAssign.dataProvider.setValue(itemIndex, 'LOCAT_LV', gridRow.LOCAT_LV);
    gridWipAssign.dataProvider.setValue(itemIndex, 'LOCAT_CD', gridRow.LOCAT_CD);
    gridWipAssign.dataProvider.setValue(itemIndex, 'LOCAT_NM', gridRow.LOCAT_NM);
    gridWipAssign.dataProvider.setValue(itemIndex, 'ITEM_CD', gridRow.ITEM_CD);
    gridWipAssign.dataProvider.setValue(itemIndex, 'ITEM_NM', gridRow.ITEM_NM);
    gridWipAssign.dataProvider.setValue(itemIndex, 'UOM_ID', gridRow.UOM_ID);
    gridWipAssign.dataProvider.setValue(itemIndex, 'RES_CD', gridRow.RES_CD);
    gridWipAssign.dataProvider.setValue(itemIndex, 'RES_DESCRIP', gridRow.RES_DESCRIP);
    gridWipAssign.dataProvider.setValue(itemIndex, 'ACCOUNT_CD', gridRow.ACCOUNT_CD);
    gridWipAssign.dataProvider.setValue(itemIndex, 'ACCOUNT_NM', gridRow.ACCOUNT_NM);
    gridWipAssign.dataProvider.setValue(itemIndex, 'WIP_QTY', gridRow.QTY);
    gridWipAssign.dataProvider.setValue(itemIndex, 'QTY', gridRow.QTY);

    gridWipAssign.gridView.commit(true);
  }

  function openLocationPopup() {
    setLocationPopupOpen(true);
  }

  function closeLocationPopup() {
    setLocationPopupOpen(false);
  }

  function onSetLocation(gridRow) {
    let itemIndex = gridLocationAssign.gridView.getCurrent().dataRow;

    gridLocationAssign.dataProvider.setValue(itemIndex, 'TRANSP_MGMT_MST_ID', gridRow.TRANSP_MGMT_MST_ID);
    gridLocationAssign.dataProvider.setValue(itemIndex, 'CONSUME_LOCAT_TP_NM', gridRow.CONSUME_LOCAT_TP_NM);
    gridLocationAssign.dataProvider.setValue(itemIndex, 'CONSUME_LOCAT_LV', gridRow.CONSUME_LOCAT_LV);
    gridLocationAssign.dataProvider.setValue(itemIndex, 'CONSUME_LOCAT_CD', gridRow.CONSUME_LOCAT_CD);
    gridLocationAssign.dataProvider.setValue(itemIndex, 'CONSUME_LOCAT_NM', gridRow.CONSUME_LOCAT_NM);
    gridLocationAssign.dataProvider.setValue(itemIndex, 'SUPPLY_LOCAT_TP_NM', gridRow.SUPPLY_LOCAT_TP_NM);
    gridLocationAssign.dataProvider.setValue(itemIndex, 'SUPPLY_LOCAT_LV', gridRow.SUPPLY_LOCAT_LV);
    gridLocationAssign.dataProvider.setValue(itemIndex, 'SUPPLY_LOCAT_CD', gridRow.SUPPLY_LOCAT_CD);
    gridLocationAssign.dataProvider.setValue(itemIndex, 'SUPPLY_LOCAT_NM', gridRow.SUPPLY_LOCAT_NM);
    gridLocationAssign.dataProvider.setValue(itemIndex, 'ITEM_CD', gridRow.ITEM_CD);
    gridLocationAssign.dataProvider.setValue(itemIndex, 'ITEM_NM', gridRow.ITEM_NM);
    gridLocationAssign.dataProvider.setValue(itemIndex, 'VEHICL_TP', gridRow.VEHICL_TP);

    gridLocationAssign.gridView.commit(true);
  }

  function openResourcePopup() {
    setResourcePopupOpen(true);
  }

  function closeResourcePopup() {
    setResourcePopupOpen(false);
  }

  function onSetResource(gridRow) {
    let itemIndex = gridResourceAssign.gridView.getCurrent().dataRow;

    gridResourceAssign.dataProvider.setValue(itemIndex, 'RES_PREFER_MST_ID', gridRow.ITEM_RES_PREFER_MST_ID);
    gridResourceAssign.dataProvider.setValue(itemIndex, 'LOCAT_MGMT_ID', gridRow.LOCAT_MGMT_ID);
    gridResourceAssign.dataProvider.setValue(itemIndex, 'LOCAT_TP_NM', gridRow.LOCAT_TP_NM);
    gridResourceAssign.dataProvider.setValue(itemIndex, 'LOCAT_LV', gridRow.LOCAT_LV);
    gridResourceAssign.dataProvider.setValue(itemIndex, 'LOCAT_CD', gridRow.LOCAT_CD);
    gridResourceAssign.dataProvider.setValue(itemIndex, 'LOCAT_NM', gridRow.LOCAT_NM);
    gridResourceAssign.dataProvider.setValue(itemIndex, 'ITEM_CD', gridRow.ITEM_CD);
    gridResourceAssign.dataProvider.setValue(itemIndex, 'ITEM_NM', gridRow.ITEM_NM);
    gridResourceAssign.dataProvider.setValue(itemIndex, 'RES_CD', gridRow.RES_CD);
    gridResourceAssign.dataProvider.setValue(itemIndex, 'RES_NM', gridRow.RES_DESCRIP);

    gridResourceAssign.gridView.commit(true);
  }

  function openOrderBomRatePopup() {
    setOrderBomRatePopupOpen(true);
  }

  function closeOrderBomRatePopup() {
    setOrderBomRatePopupOpen(false);
  }

  function onSetOrderBomRate(parentGridRow, childGridRow) {
    let itemIndex = gridOrderBomRate.gridView.getCurrent().dataRow;

    gridOrderBomRate.dataProvider.setValue(itemIndex, 'PRDUCT_BOM_DTL_ID', childGridRow.ID);
    gridOrderBomRate.dataProvider.setValue(itemIndex, 'LOCAT_TP_NM', parentGridRow.LOCAT_TP_NM);
    gridOrderBomRate.dataProvider.setValue(itemIndex, 'LOCAT_LV', parentGridRow.LOCAT_LV);
    gridOrderBomRate.dataProvider.setValue(itemIndex, 'LOCAT_CD', parentGridRow.LOCAT_CD);
    gridOrderBomRate.dataProvider.setValue(itemIndex, 'LOCAT_NM', parentGridRow.LOCAT_NM);
    gridOrderBomRate.dataProvider.setValue(itemIndex, 'P_ITEM_CD', parentGridRow.ITEM_CD);
    gridOrderBomRate.dataProvider.setValue(itemIndex, 'P_ITEM_NM', parentGridRow.ITEM_NM);
    gridOrderBomRate.dataProvider.setValue(itemIndex, 'P_ITEM_TP', parentGridRow.ITEM_TP);
    gridOrderBomRate.dataProvider.setValue(itemIndex, 'BOM_VER_ID', childGridRow.BOM_VER_ID);
    gridOrderBomRate.dataProvider.setValue(itemIndex, 'BOM_LV', childGridRow.BOM_LV);
    gridOrderBomRate.dataProvider.setValue(itemIndex, 'C_ITEM_CD', childGridRow.ITEM_CD);
    gridOrderBomRate.dataProvider.setValue(itemIndex, 'C_ITEM_NM', childGridRow.ITEM_NM);
    gridOrderBomRate.dataProvider.setValue(itemIndex, 'C_ITEM_TP', childGridRow.ITEM_TP);
    gridOrderBomRate.dataProvider.setValue(itemIndex, 'BASE_BOM_RATE', childGridRow.BASE_BOM_RATE);

    gridOrderBomRate.gridView.commit(true);
  }

  function loadAllGrids() {
    loadStockAssign();
    loadWipAssign();
    loadLocationAssign();
    loadResourceAssign();
    loadOrderBomRate();
  }

  function loadStockAssign() {
    let param = new URLSearchParams();

    param.append('DMND_OVERVIEW_ID', props.data.ID);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_SP_UI_MP_19_POP_Q3',
      data: param,
      fromPopup: true
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

  function loadWipAssign() {
    let param = new URLSearchParams();

    param.append('DMND_OVERVIEW_ID', props.data.ID);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_19_POP_Q10',
      data: param,
      fromPopup: true
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

  function loadLocationAssign() {
    let param = new URLSearchParams();

    param.append('DMND_OVW_ID', props.data.ID);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_19_POP_Q1',
      data: param,
      fromPopup: true
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

  function loadResourceAssign() {
    let param = new URLSearchParams();

    param.append('DMND_OVW_ID', props.data.ID);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_19_POP_Q2',
      data: param,
      fromPopup: true
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

  function loadOrderBomRate() {
    let param = new URLSearchParams();

    param.append('DMND_OVW_ID', props.data.ID);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_19_POP_Q9',
      data: param,
      fromPopup: true
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

  function saveSubmit() {
    if (editMode) {
      updateData();
    } else {
      saveData();
    }
  }

  function updateData() {
    async function saveGrids() {
      saveStockAssignData();
      saveWipAssignData();
      saveLocationAssignData();
      saveResourceAssignData();
      saveOrderBomRateData();
    }

    showMessage(transLangKey('SAVE'), transLangKey('MSG_SAVE'), async function (answer) {
      if (answer) {
        await saveGrids()
        .then(function () {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_0001'), { close: false });
          props.confirm();
          close();
        });
      }
    });
  }

  function saveData() {
    showMessage(transLangKey('SAVE'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let param = new FormData();

        param.append('DMND_ID', getValues('demandOverviewId'));
        param.append('DMND_OVW_ID', getValues('demandId'));
        param.append('T_VERSION_ID', props.version);
        param.append('ACTV_YN', getValues('active').includes('Y'));

        if (getValues('displayColor') !== '') {
          param.append('DISPLAY_COLOR', getValues('displayColor'));
        }

        param.append('DMND_TP_ID', getValues('demandType'));
        param.append('URGENT_ORDER_TP', getValues('urgentOrderType'));
        param.append('DMND_CLASS_ID', getValues('demandClass'));
        param.append('ITEM_MST_ID', getValues('itemMasterId'));
        param.append('UOM_ID', getValues('uom'));

        if (getValues('salesPrice') !== '') {
          param.append('SALES_UNIT_PRIC', getValues('salesPrice'));
        }

        param.append('ACCOUNT_ID', getValues('accountId'));

        if (getValues('demandQty') !== '') {
          param.append('DMND_QTY', getValues('demandQty'));
        }

        if (getValues('dueDate') instanceof Date) {
          param.append('DUE_DATE', new Date(getValues('dueDate')).format('yyyy-MM-ddT00:00:00'));
        }

        if (getValues('priority') !== '') {
          param.append('PRIORT', getValues('priority'));
        }

        if (getValues('productionDeliveryDate') instanceof Date) {
          param.append('PRDUCT_DELIVY_DATE', new Date(getValues('productionDeliveryDate')).format('yyyy-MM-ddT00:00:00'));
        }

        param.append('DELIVY_PLAN_POLICY_CD_ID', getValues('deliveryPolicy'));

        if (getValues('materialConstraint') !== '') {
          param.append('MAT_CONST_CD_ID', getValues('materialConstraint'));
        }

        param.append('PARTIAL_PLAN_YN', getValues('partialPlan').includes('Y'));
        param.append('COST_OPTIMIZ_YN', getValues('costOptimization').includes('Y'));
        param.append('HEURISTIC_YN', getValues('heuristic').includes('Y'));

        if (getValues('pst') instanceof Date) {
          param.append('PST', new Date(getValues('pst')).format('yyyy-MM-ddT00:00:00'));
        }

        if (getValues('dueDateFence') instanceof Date) {
          param.append('DUE_DATE_FNC', new Date(getValues('dueDateFence')).format('yyyy-MM-ddT00:00:00'));
        }

        if (getValues('planStrategy') !== '') {
          param.append('STRATEGY_METHD_ID', getValues('planStrategy'));
        }

        param.append('USER_ID', username);

        zAxios({
          method: 'post',
          url: baseURI() + 'engine/mp/SRV_SP_UI_MP_19_S4',
          data: param,
          fromPopup: true
        })
        .then(function (res) {
          if (res.status === gHttpStatus.SUCCESS) {
            showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_MP_19_S4_P_RT_MSG), { close: false });

            if (res.data.RESULT_DATA.IM_DATA.SP_UI_MP_19_S4_P_RT_MSG === 'MSG_0001') {
              saveStockAssignData();
              saveWipAssignData();
              saveLocationAssignData();
              saveResourceAssignData();
              saveOrderBomRateData();
            }
          }
        })
        .then(function () {
          props.confirm();
          close();
        })
        .catch(function (err) {
          console.log(err);
        });
      }
    });
  }

  function saveStockAssignData() {
    gridStockAssign.gridView.commit(true);

    let param = new URLSearchParams();

    let changedRow = [];
    let changes = [];

    changedRow = changedRow.concat(
      gridStockAssign.dataProvider.getAllStateRows().created,
      gridStockAssign.dataProvider.getAllStateRows().updated,
      gridStockAssign.dataProvider.getAllStateRows().deleted,
      gridStockAssign.dataProvider.getAllStateRows().createAndDeleted
    );

    if (changedRow.length) {
      changedRow.forEach(function (row) {
        changes.push(gridStockAssign.dataProvider.getJsonRow(row));
      });

      param.append('changes', JSON.stringify(changes));
      param.append('USER_ID', username);

      zAxios({
        method: 'post',
        url: baseURI() + 'engine/mp/SRV_SP_UI_MP_19_S6',
        data: param,
        fromPopup: true
      })
      .catch(function (err) {
        console.log(err);
      });
    }
  }

  function saveWipAssignData() {
    gridWipAssign.gridView.commit(true);

    let param = new URLSearchParams();

    let changedRow = [];
    let changes = [];

    changedRow = changedRow.concat(
      gridWipAssign.dataProvider.getAllStateRows().created,
      gridWipAssign.dataProvider.getAllStateRows().updated,
      gridWipAssign.dataProvider.getAllStateRows().deleted,
      gridWipAssign.dataProvider.getAllStateRows().createAndDeleted
    );

    if (changedRow.length) {
      changedRow.forEach(function (row) {
        changes.push(gridWipAssign.dataProvider.getJsonRow(row));
      });

      param.append('changes', JSON.stringify(changes));
      param.append('USER_ID', username);

      zAxios({
        method: 'post',
        url: baseURI() + 'engine/mp/SRV_UI_MP_19_S7',
        data: param,
        fromPopup: true
      })
      .catch(function (err) {
        console.log(err);
      });
    }
  }

  function saveLocationAssignData() {
    gridLocationAssign.gridView.commit(true);

    let param = new URLSearchParams();

    let changedRow = [];
    let changes = [];

    changedRow = changedRow.concat(
      gridLocationAssign.dataProvider.getAllStateRows().created,
      gridLocationAssign.dataProvider.getAllStateRows().updated,
      gridLocationAssign.dataProvider.getAllStateRows().deleted,
      gridLocationAssign.dataProvider.getAllStateRows().createAndDeleted
    );

    if (changedRow.length) {
      changedRow.forEach(function (row) {
        changes.push(gridLocationAssign.dataProvider.getJsonRow(row));
      });

      param.append('changes', JSON.stringify(changes));
      param.append('USER_ID', username);

      zAxios({
        method: 'post',
        url: baseURI() + 'engine/mp/SRV_UI_MP_19_POP_S1',
        data: param,
        fromPopup: true
      })
      .catch(function (err) {
        console.log(err);
      });
    }
  }

  function saveResourceAssignData() {
    gridResourceAssign.gridView.commit(true);

    let param = new URLSearchParams();

    let changedRow = [];
    let changes = [];

    changedRow = changedRow.concat(
      gridResourceAssign.dataProvider.getAllStateRows().created,
      gridResourceAssign.dataProvider.getAllStateRows().updated,
      gridResourceAssign.dataProvider.getAllStateRows().deleted,
      gridResourceAssign.dataProvider.getAllStateRows().createAndDeleted
    );

    if (changedRow.length) {
      changedRow.forEach(function (row) {
        changes.push(gridResourceAssign.dataProvider.getJsonRow(row));
      });

      param.append('changes', JSON.stringify(changes));
      param.append('USER_ID', username);

      zAxios({
        method: 'post',
        url: baseURI() + 'engine/mp/SRV_UI_MP_19_POP_S3',
        data: param,
        fromPopup: true
      })
      .catch(function (err) {
        console.log(err);
      });
    }
  }

  function saveOrderBomRateData() {
    gridOrderBomRate.gridView.commit(true);

    let param = new URLSearchParams();

    let changedRow = [];
    let changes = [];

    changedRow = changedRow.concat(
      gridOrderBomRate.dataProvider.getAllStateRows().created,
      gridOrderBomRate.dataProvider.getAllStateRows().updated,
      gridOrderBomRate.dataProvider.getAllStateRows().deleted,
      gridOrderBomRate.dataProvider.getAllStateRows().createAndDeleted
    );

    if (changedRow.length) {
      changedRow.forEach(function (row) {
        changes.push(gridOrderBomRate.dataProvider.getJsonRow(row));
      });

      param.append('changes', JSON.stringify(changes));
      param.append('USER_ID', username);

      zAxios({
        method: 'post',
        url: baseURI() + 'engine/mp/SRV_UI_MP_19_POP_S6',
        data: param,
        fromPopup: true
      })
      .catch(function (err) {
        console.log(err);
      });
    }
  }

  function deleteStockAssign() {
    gridStockAssign.gridView.commit(true);

    if (gridStockAssign.gridView.getCheckedRows().length === 0) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SELECT_DELETE'), { close: false });
    } else {
      showMessage(transLangKey('DELETE'), transLangKey('MSG_DELETE'), function (answer) {
        if (answer) {
          let createdRows = [];
          let existRows = [];

          gridStockAssign.gridView.getCheckedRows().forEach(function (index) {
            if (gridStockAssign.dataProvider.getRowState(index) === 'created') {
              createdRows.push(index);
            } else {
              existRows.push(gridStockAssign.dataProvider.getJsonRow(index));
            }
          });

          if (createdRows.length > 0) {
            gridStockAssign.dataProvider.removeRows(createdRows);
          }

          if (existRows.length > 0) {
            let param = new URLSearchParams();

            param.append('checked', JSON.stringify(existRows));

            zAxios({
              method: 'post',
              url: baseURI() + 'engine/mp/SRV_UI_MP_19_POP_S5',
              data: param,
              fromPopup: true
            })
            .then(function (res) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_MP_19_POP_S5_P_RT_MSG), { close: false });
              loadStockAssign();
            })
            .catch(function (err) {
              console.log(err);
            });
          }
        }
      });
    }
  }

  function deleteWipAssign() {
    gridWipAssign.gridView.commit(true);

    if (gridWipAssign.gridView.getCheckedRows().length === 0) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SELECT_DELETE'), { close: false });
    } else {
      showMessage(transLangKey('DELETE'), transLangKey('MSG_DELETE'), function (answer) {
        if (answer) {
          let createdRows = [];
          let existRows = [];

          gridWipAssign.gridView.getCheckedRows().forEach(function (index) {
            if (gridWipAssign.dataProvider.getRowState(index) === 'created') {
              createdRows.push(index);
            } else {
              existRows.push(gridWipAssign.dataProvider.getJsonRow(index));
            }
          });

          if (createdRows.length > 0) {
            gridWipAssign.dataProvider.removeRows(createdRows);
          }

          if (existRows.length > 0) {
            let param = new URLSearchParams();

            param.append('checked', JSON.stringify(existRows));

            zAxios({
              method: 'post',
              url: baseURI() + 'engine/mp/SRV_UI_MP_19_POP_S8',
              data: param,
              fromPopup: true
            })
            .then(function (res) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_MP_19_POP_S8_P_RT_MSG), { close: false });
              loadWipAssign();
            })
            .catch(function (err) {
              console.log(err);
            });
          }
        }
      });
    }
  }

  function deleteLocationAssign() {
    gridLocationAssign.gridView.commit(true);

    if (gridLocationAssign.gridView.getCheckedRows().length === 0) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SELECT_DELETE'), { close: false });
    } else {
      showMessage(transLangKey('DELETE'), transLangKey('MSG_DELETE'), function (answer) {
        if (answer) {
          let createdRows = [];
          let existRows = [];

          gridLocationAssign.gridView.getCheckedRows().forEach(function (index) {
            if (gridLocationAssign.dataProvider.getRowState(index) === 'created') {
              createdRows.push(index);
            } else {
              existRows.push(gridLocationAssign.dataProvider.getJsonRow(index));
            }
          });

          if (createdRows.length > 0) {
            gridLocationAssign.dataProvider.removeRows(createdRows);
          }

          if (existRows.length > 0) {
            let param = new URLSearchParams();

            param.append('checked', JSON.stringify(existRows));

            zAxios({
              method: 'post',
              url: baseURI() + 'engine/mp/SRV_UI_MP_19_POP_S2',
              data: param,
              fromPopup: true
            })
            .then(function (res) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_MP_19_POP_S2_P_RT_MSG), { close: false });
              loadLocationAssign();
            })
            .catch(function (err) {
              console.log(err);
            });
          }
        }
      });
    }
  }

  function deleteResourceAssign() {
    gridResourceAssign.gridView.commit(true);

    if (gridResourceAssign.gridView.getCheckedRows().length === 0) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SELECT_DELETE'), { close: false });
    } else {
      showMessage(transLangKey('DELETE'), transLangKey('MSG_DELETE'), function (answer) {
        if (answer) {
          let createdRows = [];
          let existRows = [];

          gridResourceAssign.gridView.getCheckedRows().forEach(function (index) {
            if (gridResourceAssign.dataProvider.getRowState(index) === 'created') {
              createdRows.push(index);
            } else {
              existRows.push(gridResourceAssign.dataProvider.getJsonRow(index));
            }
          });

          if (createdRows.length > 0) {
            gridResourceAssign.dataProvider.removeRows(createdRows);
          }

          if (existRows.length > 0) {
            let param = new URLSearchParams();

            param.append('checked', JSON.stringify(existRows));

            zAxios({
              method: 'post',
              url: baseURI() + 'engine/mp/SRV_UI_MP_19_POP_S4',
              data: param,
              fromPopup: true
            })
            .then(function (res) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_MP_19_POP_S4_P_RT_MSG), { close: false });
              loadResourceAssign();
            })
            .catch(function (err) {
              console.log(err);
            });
          }
        }
      });
    }
  }

  function deleteOrderBomRate() {
    gridOrderBomRate.gridView.commit(true);

    if (gridOrderBomRate.gridView.getCheckedRows().length === 0) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SELECT_DELETE'), { close: false });
    } else {
      showMessage(transLangKey('DELETE'), transLangKey('MSG_DELETE'), function (answer) {
        if (answer) {
          let createdRows = [];
          let existRows = [];

          gridOrderBomRate.gridView.getCheckedRows().forEach(function (index) {
            if (gridOrderBomRate.dataProvider.getRowState(index) === 'created') {
              createdRows.push(index);
            } else {
              existRows.push(gridOrderBomRate.dataProvider.getJsonRow(index));
            }
          });

          if (createdRows.length > 0) {
            gridOrderBomRate.dataProvider.removeRows(createdRows);
          }

          if (existRows.length > 0) {
            let param = new URLSearchParams();

            param.append('checked', JSON.stringify(existRows));

            zAxios({
              method: 'post',
              url: baseURI() + 'engine/mp/SRV_UI_MP_19_POP_S7',
              data: param,
              fromPopup: true
            })
            .then(function (res) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_MP_19_POP_S7_P_RT_MSG), { close: false });
              loadOrderBomRate();
            })
            .catch(function (err) {
              console.log(err);
            });
          }
        }
      });
    }
  }

  const tabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  function close() {
    gridStockAssign.dataProvider.clearRows();
    gridWipAssign.dataProvider.clearRows();
    gridLocationAssign.dataProvider.clearRows();
    gridResourceAssign.dataProvider.clearRows();
    gridOrderBomRate.dataProvider.clearRows();
    props.onClose();
  }

  return (
    <>
      <PopupDialog open={props.open} onClose={close} onSubmit={saveSubmit} title={editMode ? transLangKey("POP_UI_MP_19_01") : transLangKey("POP_UI_MP_19_04")} resizeHeight={600} resizeWidth={editMode ? 1400 : 480}>
        <Box style={{ height: "100%" }}>
          <Tabs onChange={tabChange} indicatorColor="primary" value={tabValue}>
            <Tab label={transLangKey("VER")} value="version" style={{ display: editMode ? "none" : "block" }} />
            <Tab label={transLangKey("DMND_INFO")} value="demandInformation" style={{ display: editMode ? "none" : "block" }} />
            <Tab label={transLangKey("DMND_PRIOR")} value="demandPriority" style={{ display: editMode ? "none" : "block" }} />
            <Tab label={transLangKey("PLAN_POLICY")} value="planPolicy" style={{ display: editMode ? "none" : "block" }} />
            <Tab label={transLangKey("ASSIGN_STOCK")} value="stockAssign" style={{ display: editMode ? "block" : "none" }} />
            <Tab label={transLangKey("ASSIGN_WIP")} value="wipAssign" style={{ display: editMode ? "block" : "none" }} />
            <Tab label={transLangKey("ASSIGN_SITE")} value="locationAssign" style={{ display: editMode ? "block" : "none" }} />
            <Tab label={transLangKey("ASSIGN_RES")} value="resourceAssign" style={{ display: editMode ? "block" : "none" }} />
            <Tab label={transLangKey("ORDER_BOM_RATE")} value="orderBomRate" style={{ display: editMode ? "block" : "none" }} />
          </Tabs>
          <Box style={{ marginTop: "3px", width: "100%", height: "100%" }}>
            <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "version" ? "block" : "none" }}>
              <Box>
                <InputField name="module" label={transLangKey("MODULE_VAL")} control={control} disabled={true} />
              </Box>
              <Box>
                <InputField type="check" name="confirm" control={control} options={[{ label: transLangKey("CONFRM_YN"), value: "Y" }]} disabled={true} />
              </Box>
              <Box>
                <InputField type="check" name="finalConfirm" control={control} options={[{ label: transLangKey("FINAL_CONFRM_YN"), value: "Y" }]} disabled={true} />
              </Box>
              <Box>
                <InputField type="check" name="active" control={control} options={[{ label: transLangKey("ACTV_YN"), value: "Y" }]} />
              </Box>
              <Box>
                <InputField name="displayColor" label={transLangKey("DISPLAY_COLOR")} control={control} />
              </Box>
            </Box>
            <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "demandInformation" ? "block" : "none" }}>
              <Box>
                <InputField name="demandId" label={transLangKey("DMND_ID")} control={control} disabled={true} />
                <InputField type="select" name="demandType" label={transLangKey("DMND_TP_NM")} control={control} options={demandTypeOptions} disabled={true} />
              </Box>
              <Box>
                <InputField type="select" name="urgentOrderType" label={transLangKey("URGENT_ORDER_TP")} control={control} options={urgentOrderTypeOptions} />
                <InputField type="select" name="demandClass" label={transLangKey("DMND_CLASS_NM")} control={control} options={demandClassOptions} disabled={false} />
              </Box>
              <Box>
                <InputField type="action" name="itemCode" label={transLangKey("ITEM_CD")} control={control} onClick={openItemPopup} readonly={true}>
                  <Icon.Search />
                </InputField>
                <InputField name="itemName" label={transLangKey("ITEM_NM")} control={control} disabled={true} />
              </Box>
              <Box>
                <InputField name="itemType" label={transLangKey("ITEM_TP")} control={control} disabled={true} />
                <InputField dataType="number" name="demandQty" label={transLangKey("DEMAND_QTY")} control={control} />
              </Box>
              <Box>
                <InputField type="select" name="uom" label={transLangKey("UOM")} control={control} options={uomOptions} disabled={true} />
                <InputField dataType="number" name="salesPrice" label={transLangKey("SALES_UNIT_PRIC")} control={control} />
              </Box>
              <Box>
                <InputField type="action" name="accountCode" label={transLangKey("ACCOUNT_CD")} control={control} onClick={openAccountPopup} readonly={true}>
                  <Icon.Search />
                </InputField>
                <InputField name="accountName" label={transLangKey("ACCOUNT_NM")} control={control} disabled={true} />
              </Box>
              <Box>
                <InputField type="datetime" name="dueDate" label={transLangKey("DUE_DATE")} control={control} dateformat="yyyy-MM-dd" />
              </Box>
            </Box>
            <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "demandPriority" ? "block" : "none" }}>
              <Box>
                <InputField name="bodLeadTime" label={transLangKey("BOD_LEADTIME")} control={control} disabled={true} />
                <InputField name="timeUom" label={transLangKey("TIME_UOM_NM")} control={control} disabled={true} />
              </Box>
              <Box>
                <InputField dataType="number" name="priority" label={transLangKey("PRIORITY")} control={control} />
                <InputField type="datetime" name="productionDeliveryDate" label={transLangKey("PRDUCT_DELIVY_DATE")} control={control} dateformat="yyyy-MM-dd" />
              </Box>
            </Box>
            <Box sx={{ display: "flex", height: "calc(100% - 50px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "planPolicy" ? "block" : "none" }}>
              <Box>
                <InputField type="select" name="deliveryPolicy" label={transLangKey("DELIVY_PLAN_POLICY_NM")} control={control} options={deliveryPolicyOptions} />
                <InputField type="select" name="materialConstraint" label={transLangKey("MAT_CONST_NM")} control={control} options={materialConstraintOptions} />
              </Box>
              <Box>
                <InputField type="check" name="partialPlan" control={control} options={[{ label: transLangKey("PARTIAL_PLAN_YN"), value: "Y" }]} />
              </Box>
              <Box>
                <InputField type="check" name="heuristic" control={control} options={[{ label: transLangKey("HEURISTIC_YN"), value: "Y" }]} />
              </Box>
              <Box>
                <InputField type="check" name="costOptimization" control={control} options={[{ label: transLangKey("COST_OPTIMIZ_YN"), value: "Y" }]} />
              </Box>
              <Box>
                <InputField type="datetime" name="pst" label={transLangKey("PST")} control={control} dateformat="yyyy-MM-dd" />
                <InputField type="datetime" name="dueDateFence" label={transLangKey("DUE_DATE_FNC")} control={control} dateformat="yyyy-MM-dd" />
              </Box>
              <Box>
                <InputField type="select" name="planStrategy" label={transLangKey("STRATEGY_METHD")} control={control} options={planStrategyOptions} />
              </Box>
            </Box>
            <Box sx={{ display: "flex", height: "calc(100% - 90px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "stockAssign" ? "block" : "none" }}>
              <ButtonArea>
                <RightButtonArea>
                  <GridAddRowButton grid="popDemandOverview_gridStockAssign" onAfterAdd={onAfterAdd} />
                  <GridDeleteRowButton grid="popDemandOverview_gridStockAssign" onClick={deleteStockAssign} />
                </RightButtonArea>
              </ButtonArea>
              <BaseGrid id="popDemandOverview_gridStockAssign" items={gridStockAssignColumns} afterGridCreate={afterGridStockAssign} />
            </Box>
            <Box sx={{ display: "flex", height: "calc(100% - 90px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "wipAssign" ? "block" : "none" }}>
              <ButtonArea>
                <RightButtonArea>
                  <GridAddRowButton grid="popDemandOverview_gridWipAssign" onAfterAdd={onAfterAdd} />
                  <GridDeleteRowButton grid="popDemandOverview_gridWipAssign" onClick={deleteWipAssign} />
                </RightButtonArea>
              </ButtonArea>
              <BaseGrid id="popDemandOverview_gridWipAssign" items={gridWipAssignColumns} afterGridCreate={afterGridWipAssign} />
            </Box>
            <Box sx={{ display: "flex", height: "calc(100% - 90px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "locationAssign" ? "block" : "none" }}>
              <ButtonArea>
                <RightButtonArea>
                  <GridAddRowButton grid="popDemandOverview_gridLocationAssign" onAfterAdd={onAfterAdd} />
                  <GridDeleteRowButton grid="popDemandOverview_gridLocationAssign" onClick={deleteLocationAssign} />
                </RightButtonArea>
              </ButtonArea>
              <BaseGrid id="popDemandOverview_gridLocationAssign" items={gridLocationAssignColumns} afterGridCreate={afterGridLocationAssign} />
            </Box>
            <Box sx={{ display: "flex", height: "calc(100% - 90px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "resourceAssign" ? "block" : "none" }}>
              <ButtonArea>
                <RightButtonArea>
                  <GridAddRowButton grid="popDemandOverview_gridResourceAssign" onAfterAdd={onAfterAdd} />
                  <GridDeleteRowButton grid="popDemandOverview_gridResourceAssign" onClick={deleteResourceAssign} />
                </RightButtonArea>
              </ButtonArea>
              <BaseGrid id="popDemandOverview_gridResourceAssign" items={gridResourceAssignColumns} afterGridCreate={afterGridResourceAssign} />
            </Box>
            <Box sx={{ display: "flex", height: "calc(100% - 90px)", flexDirection: "column", alignContent: "stretch", alignItems: "stretch", display: tabValue === "orderBomRate" ? "block" : "none" }}>
              <ButtonArea>
                <RightButtonArea>
                  <GridAddRowButton grid="popDemandOverview_gridOrderBomRate" onAfterAdd={onAfterAdd} />
                  <GridDeleteRowButton grid="popDemandOverview_gridOrderBomRate" onClick={deleteOrderBomRate} />
                </RightButtonArea>
              </ButtonArea>
              <BaseGrid id="popDemandOverview_gridOrderBomRate" items={gridOrderBomRateColumns} afterGridCreate={afterGridOrderBomRate} />
            </Box>
          </Box>
        </Box>
      </PopupDialog>

      <PopItem open={itemPopupOpen} onClose={closeItemPopup} confirm={onSetItem} />
      <PopAccount open={accountPopupOpen} onClose={closeAccountPopup} confirm={onSetAccount} />
      <PopStock open={stockPopupOpen} onClose={closeStockPopup} confirm={onSetStock} data={popupData} />
      <PopWip open={wipPopupOpen} onClose={closeWipPopup} confirm={onSetWip} data={popupData} />
      <PopLocation open={locationPopupOpen} onClose={closeLocationPopup} confirm={onSetLocation} data={popupData} />
      <PopResource open={resourcePopupOpen} onClose={closeResourcePopup} confirm={onSetResource} data={popupData} />
      <PopOrderBomRate open={orderBomRatePopupOpen} onClose={closeOrderBomRatePopup} confirm={onSetOrderBomRate} data={popupData} />
    </>
  )
}

export default PopDemandOverview;
