import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from "react-router-dom";
import { Box } from '@mui/material';
import {
  ContentInner, ResultArea, SearchArea, ButtonArea, LeftButtonArea, SearchRow,
  GridExcelExportButton, BaseGrid, useViewStore, zAxios, InputField
} from '@zionex/wingui-core/src/common/imports';
import { useContentStore } from '@zionex/wingui-core/src/store/contentStore'
import ItemSearchBox from '@wingui/view/supplychainmodel/common/ItemSearchBox';
import PopSimulationVersion from '@wingui/view/masterplan/common/PopSimulationVersion';
import LocationSearchBox from '@wingui/view/supplychainmodel/common/LocationSearchBox';
import AccountSearchCondition from '@wingui/view/supplychainmodel/common/AccountSearchCondition';
import PopCommItem from '@wingui/view/supplychainmodel/common/PopCommItem';
import PopCommResource from '@wingui/view/supplychainmodel/common/PopCommResource';
import { Doughnut } from 'react-chartjs-2';

import {
  Chart as ChartJS, LinearScale, CategoryScale, BarElement, PointElement,
  LineElement, Title, Legend, Tooltip, LineController, BarController
} from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(
  LinearScale, CategoryScale, BarElement, PointElement, LineElement,
  Title, Legend, Tooltip, LineController, BarController,
);

const problemResourceChartOptions = {
  maintainAspectRatio: false,
  plugins: {
    title: { display: true, text: transLangKey('PROBLEM_RES') },
    legend: { display: false }
  }
};

const problemInventoryChartOptions = {
  maintainAspectRatio: false,
  plugins: {
    title: { display: true, text: transLangKey('PROBLEM_INV') },
    legend: { display: false }
  }
};

const problemTypeChartOptions = {
  maintainAspectRatio: false,
  plugins: {
    title: { display: true, text: transLangKey('PROBLEM_TYPE') },
    legend: {
      position: 'right',
      lebels: { font: { size: 14 } }
    }
  }
};

const problemNameChartOptions = {
  maintainAspectRatio: false,
  plugins: {
    title: { display: true, text: transLangKey('PROBLEM_NM') },
    legend: {
      position: 'right',
      lebels: { font: { size: 20 } }
    }
  }
};

const chartColors = {
  LATE: 'rgb(255, 205, 86)',
  SHORT : 'rgb(192, 13, 65)',
  CAPACITY : '#00bce4',
  MATERIAL : '#00a78e',
  DATA: '#ffc845',
  DUEDATE: '#00aeff',
  POLICY: '#8e43e7',
  LEADTIME: '#fb8a2e',
  TOOL : '#bfca02',
  PROBLEM_INVENTORY: '#05cc47',
  PROBLEM_RESOURCE: '#05cc47'
}

let gridPlanProblemsColumns = [
  { name: "DVA_ID", dataType: "text", headerText: "DVA_ID", visible: false, editable: true, width: "150" },
  {
    name: "DMND_INFO", dataType: "group", orientation: "horizontal", headerText: "DMND_INFO", headerVisible: true, hideChildHeaders: false, expandable: false, expanded: false,
    childs: [
      { name: "DMND_ID", dataType: "text", headerText: "DMND_ID", visible: true, editable: false, width: "180" },
      { name: "PO_ID", dataType: "text", headerText: "PO_ID", visible: true, editable: false, width: "200" },
      { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: false, width: "80" },
      { name: "DMND_TP_NM", dataType: "text", headerText: "DMND_TP_NM", visible: true, editable: false, width: "100", autoFilter: true },
      { name: "DMND_CLASS_NM", dataType: "text", headerText: "DMND_CLASS_NM", visible: true, editable: false, width: "100", autoFilter: true },
      { name: "URGENT_ORDER_TP_NM", dataType: "text", headerText: "URGENT_ORDER_TP", visible: true, editable: false, width: "140" },
      { name: "ITEM", dataType: "group", orientation: "horizontal", headerText: "ITEM", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
        childs: [
          { name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: "100", groupShowMode: "always" },
          { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: "100", groupShowMode: "always" },
          { name: "ITEM_DESCRIP", dataType: "text", headerText: "ITEM_DESCRIP", visible: true, editable: false, width: "100", groupShowMode: "expand" },
          { name: "ITEM_TP_NM", dataType: "text", headerText: "ITEM_TP_NM", visible: true, editable: false, width: "100", groupShowMode: "expand" }
        ]
      },
      { name: "ITEM_ATTR", dataType: "group", orientation: "horizontal", headerText: "CM_ITEM_ATTR", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
        childs: [
          { name: "ATTR_01", dataType: "text", headerText: "ITEM_ATTR_01", visible: true, editable: false, width: "100", groupShowMode: "always" },
          { name: "ATTR_02", dataType: "text", headerText: "ITEM_ATTR_02", visible: true, editable: false, width: "100", groupShowMode: "always" },
          { name: "ATTR_03", dataType: "text", headerText: "ITEM_ATTR_03", visible: true, editable: false, width: "100", groupShowMode: "always" },
          { name: "ATTR_04", dataType: "text", headerText: "ITEM_ATTR_04", visible: true, editable: false, width: "100", groupShowMode: "expand" },
          { name: "ATTR_05", dataType: "text", headerText: "ITEM_ATTR_05", visible: true, editable: false, width: "100", groupShowMode: "expand" },
          { name: "ATTR_06", dataType: "text", headerText: "ITEM_ATTR_06", visible: true, editable: false, width: "100", groupShowMode: "expand" },
          { name: "ATTR_07", dataType: "text", headerText: "ITEM_ATTR_07", visible: true, editable: false, width: "100", groupShowMode: "expand" },
          { name: "ATTR_08", dataType: "text", headerText: "ITEM_ATTR_08", visible: true, editable: false, width: "100", groupShowMode: "expand" },
          { name: "ATTR_09", dataType: "text", headerText: "ITEM_ATTR_09", visible: true, editable: false, width: "100", groupShowMode: "expand" },
          { name: "ATTR_10", dataType: "text", headerText: "ITEM_ATTR_10", visible: true, editable: false, width: "100", groupShowMode: "expand" },
          { name: "ATTR_11", dataType: "text", headerText: "ITEM_ATTR_11", visible: false, editable: false, width: "100" },
          { name: "ATTR_12", dataType: "text", headerText: "ITEM_ATTR_12", visible: false, editable: false, width: "100" },
          { name: "ATTR_13", dataType: "text", headerText: "ITEM_ATTR_13", visible: false, editable: false, width: "100" },
          { name: "ATTR_14", dataType: "text", headerText: "ITEM_ATTR_14", visible: false, editable: false, width: "100" },
          { name: "ATTR_15", dataType: "text", headerText: "ITEM_ATTR_15", visible: false, editable: false, width: "100" },
          { name: "ATTR_16", dataType: "text", headerText: "ITEM_ATTR_16", visible: false, editable: false, width: "100" },
          { name: "ATTR_17", dataType: "text", headerText: "ITEM_ATTR_17", visible: false, editable: false, width: "100" },
          { name: "ATTR_18", dataType: "text", headerText: "ITEM_ATTR_18", visible: false, editable: false, width: "100" },
          { name: "ATTR_19", dataType: "text", headerText: "ITEM_ATTR_19", visible: false, editable: false, width: "100" },
          { name: "ATTR_20", dataType: "text", headerText: "ITEM_ATTR_20", visible: false, editable: false, width: "100" },
          { name: "ATTR_21", dataType: "text", headerText: "ITEM_ATTR_21", visible: false, editable: false, width: "100" },
          { name: "ATTR_22", dataType: "text", headerText: "ITEM_ATTR_22", visible: false, editable: false, width: "100" },
          { name: "ATTR_23", dataType: "text", headerText: "ITEM_ATTR_23", visible: false, editable: false, width: "100" },
          { name: "ATTR_24", dataType: "text", headerText: "ITEM_ATTR_24", visible: false, editable: false, width: "100" },
          { name: "ATTR_25", dataType: "text", headerText: "ITEM_ATTR_25", visible: false, editable: false, width: "100" }
        ]
      },
      { name: "DMND_QTY", dataType: "number", headerText: "DMND_QTY", visible: true, editable: false, width: "100" },
      { name: "UOM_NM", dataType: "text", headerText: "UOM_NM", visible: true, editable: false, width: "100" },
      { name: "DUE_DATE", dataType: "datetime", headerText: "DUE_DATE", visible: true, editable: false, width: "100", format: "yyyy-MM-dd" },
    ]
  },
  {
    name: "REQUEST_SITE_CUST", dataType: "group", orientation: "horizontal", headerText: "REQUEST_SITE_CUST", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "REQUEST_SITE_ID", dataType: "text", headerText: "REQUEST_SITE_ID", visible: true, editable: false, width: "100" },
      { name: "REQUEST_SITE_DESCRIP", dataType: "text", headerText: "REQUEST_SITE_DESCRIP", visible: true, editable: false, width: "170" },
      { name: "LOCAT_GRP_CD", dataType: "text", headerText: "LOCAT_GRP_CD", visible: true, editable: false, width: "100" },
      { name: "BUSINESS_UNIT", dataType: "text", headerText: "BUSINESS_UNIT", visible: true, editable: false, width: "100" },
      { name: "IN_OUT_FLAG", dataType: "text", headerText: "IN_OUT_FLAG", visible: true, editable: false, width: "100" },
      { name: "ACCOUNT_CD", dataType: "text", headerText: "ACCOUNT_CD", visible: true, editable: false, width: "100" },
      { name: "ACCOUNT_NM", dataType: "text", headerText: "ACCOUNT_NM", visible: true, editable: false, width: "100" },
      { name: "INCOTERMS", dataType: "text", headerText: "INCOTERMS", visible: true, editable: false, width: "100" },
      { name: "SALES_PRIC", dataType: "number", headerText: "SALES_UNIT_PRIC", visible: true, editable: false, width: "100" },
      { name: "MARGIN", dataType: "number", headerText: "MARGIN", visible: true, editable: false, width: "100" },
      { name: "CURRENC", dataType: "text", headerText: "CURCY_NM", visible: true, editable: false, width: "100" }
    ]
  },
  {
    name: "SHORT_LATE_REASON", dataType: "group", orientation: "horizontal", headerText: "SHORT_LATE_REASON", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "PROBLEM_TP", dataType: "text", headerText: "PROBLEM_TP", visible: true, editable: false, width: "100", autoFilter: true },
      { name: "PROBLEM_NM", dataType: "text", headerText: "PROBLEM_NM", visible: true, editable: false, width: "100" },
      { name: "PROBLEM_VAL", dataType: "number", headerText: "PROBLEM_VAL", visible: true, editable: false, width: "100" },
      { name: "PROBLEM_CAPA", dataType: "text", headerText: "PROBLEM_CAPA", visible: true, editable: false, width: "100" },
      { name: "PROBLEM_DATE", dataType: "datetime", headerText: "PROBLEM_DATE", visible: true, editable: false, width: "100", format: "yyyy-MM-dd" },
      { name: "TARGET_REQ_DATE", dataType: "datetime", headerText: "TARGET_REQ_DATE", visible: true, editable: false, width: "100", format: "yyyy-MM-dd" },
      { name: "TARGET_GR_DATE", dataType: "datetime", headerText: "TARGET_GR_DATE", visible: true, editable: false, width: "100", format: "yyyy-MM-dd" },
      { name: "PROBLEM_LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "100" },
      { name: "PROBLEM_ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: "100" },
      { name: "RES_CD", dataType: "text", headerText: "RES_CD", visible: true, editable: false, width: "100" },
      { name: "RES_DESCRIP", dataType: "text", headerText: "RES_DESCRIP", visible: true, editable: false, width: "100" },
      { name: "RES_GRP_CD", dataType: "text", headerText: "RES_GRP_CD", visible: true, editable: false, width: "120" },
      { name: "RES_GRP_NM", dataType: "text", headerText: "RES_GRP_NM", visible: true, editable: false, width: "120" },
      { name: "RES_ATTR_CD", dataType: "text", headerText: "RES_ATTR_CD", visible: true, editable: false, width: "100" },
      { name: "RES_ATTR_NM", dataType: "text", headerText: "RES_ATTR_NM", visible: true, editable: false, width: "100" },
      { name: "PROCESS_CD", dataType: "text", headerText: "PROCESS_CD", visible: true, editable: false, width: "100" },
      { name: "PROCESS_NM", dataType: "text", headerText: "PROCESS_NM", visible: true, editable: false, width: "100" },
      { name: "PROCESS_DESCRIP", dataType: "text", headerText: "PROCESS_DESCRIP", visible: true, editable: false, width: "100" },
      { name: "PROD_GRP_CD", dataType: "text", headerText: "PROD_GRP_CD", visible: true, editable: false, width: "100" },
      { name: "PROD_GRP_NM", dataType: "text", headerText: "PROD_GRP_NM", visible: true, editable: false, width: "100" },
      { name: "PROCESS_PRIORT", dataType: "text", headerText: "PROCESS_PRIORT", visible: true, editable: false, width: "100" },
      { name: "ROUTE_CD", dataType: "text", headerText: "ROUTE_CD", visible: true, editable: false, width: "100" },
      { name: "ROUTE_NM", dataType: "text", headerText: "ROUTE_NM", visible: true, editable: false, width: "100" },
      { name: "ROUTE_SEQ", dataType: "text", headerText: "ROUTE_SEQ", visible: true, editable: false, width: "100" },
      { name: "DESCRIP", dataType: "text", headerText: "DESCRIP", visible: true, editable: false, width: "650" }
    ]
  },
  {
    name: "UI_LINK", dataType: "group", orientation: "horizontal", headerText: "UI_LINK", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "UI_NM_01", dataType: "text", headerText: "01", visible: true, editable: false, width: "105", styleName: "text-column link-column" },
      { name: "URL_01", dataType: "text", headerText: "URL_01", visible: false, editable: false, width: "100" },
      { name: "UI_NM_02", dataType: "text", headerText: "02", visible: true, editable: false, width: "105", styleName: "text-column link-column" },
      { name: "URL_02", dataType: "text", headerText: "URL_02", visible: false, editable: false, width: "100" },
      { name: "UI_NM_03", dataType: "text", headerText: "03", visible: true, editable: false, width: "105", styleName: "text-column link-column" },
      { name: "URL_03", dataType: "text", headerText: "URL_03", visible: false, editable: false, width: "100" }
    ]
  }
];

const linkColumns = ['UI_NM_01', 'UI_NM_02', 'UI_NM_03'];

function ShortLateReason() {
  const history = useHistory();
  const languageCode = useContentStore(state => state.languageCode);

  //1. view 페이지 데이타 store
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  //2. 그리드 Object
  const [gridPlanProblems, setGridPlanProblems] = useState(null);

  const [simulationVersionPopupOpen, setSimulationVersionPopupOpen] = useState(false);
  const locationSearchBoxRef = useRef();
  const itemSearchBoxRef = useRef();
  const accountSearchConditionRef = useRef();

  const [currentLocationRef, setCurrentLocationRef] = useState();
  const [currentItemRef, setCurrentItemRef] = useState();
  const [currentAccountRef, setCurrentAccountRef] = useState();

  const [itemPopupOpen, setItemPopupOpen] = useState(false);
  const [resourcePopupOpen, setPopResource] = useState(false);

  const [problemResourceData, setProblemResourceData] = useState({
    labels: [],
    datasets: [{ type: 'bar', data: []}]
  });

  const [problemInventoryData, setProblemInventoryData] = useState({
    labels: [],
    datasets: [{ type: 'bar', data: []}]
  });

  const [problemTypeData, setProblemTypeData] = useState({
    labels: [],
    datasets: []
  });

  const [problemNameData, setProblemNameData] = useState({
    labels: [],
    datasets: []
  });

  const { reset, control, getValues, setValue } = useForm({
    defaultValues: {
      moduleCd: 'MP',
      simulationVersion: '',
      demandId: '',
      demandTypeName: '',
      demandClassName: '',
      problemItemCd: '',
      problemResCd: '',
      problemResDescrip : '',
      problemType: ''
    }
  });

  const locationSearchBoxOptions = {
    locationType: {
      code : 'TP',
      langCode : "LOCAT_TP_NM",
      chipColor : 'info', // display on InputField
      avatarColor : 'info.main', // display on PopOver
    },
    locationLevel: {
      code : 'LV',
      langCode : "LOCAT_LV",
      chipColor : 'info',
      avatarColor : 'info.main'
    },
    locationCode: {
      code : 'CD',
      langCode : "LOCAT_CD",
      chipColor : 'success',
      avatarColor : 'success.main',
      usePopupButton: true
    },
    locationName: {
      code : 'NM',
      langCode : "LOCAT_NM",
      chipColor : 'warning',
      avatarColor : 'warning.main'
    }
  };

  const globalButtons = [
    {
      name: "search",
      action: (e) => { onSubmit() },
      visible: true,
      disable: false
    },
    {
      name: "refresh",
      action: (e) => { refresh() },
      visible: true,
      disable: false
    },
  ]

  const exportExceloptions = {
    headerDepth: 2,
    footer: "default",
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  }

  // 그리드 Object 초기화
  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, 'gridPlanProblems');
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        if (gridPlanProblems != grdObj1)
          setGridPlanProblems(grdObj1);
      }
    }

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

    if (accountSearchConditionRef) {
      if (accountSearchConditionRef.current) {
        setCurrentAccountRef(accountSearchConditionRef.current);
      }
    }

  }, [viewData]);

  useEffect(() => {
    async function initLoad() {
      setViewInfo(vom.active, 'globalButtons', globalButtons);

      if (gridPlanProblems) {
        setOptionsGridPlanProblems();

        await loadRecentSimulationVersion();
        await loadPlanProblem();
        await loadPlanProblemChart();
      }
    }

    initLoad();
  }, [gridPlanProblems]);

  /** 이벤트 핸들러 */
  function onSubmit() {
    async function initLoad() {
      if (gridPlanProblems) {
        await loadPlanProblem();
        await loadPlanProblemChart();
      }
    }

    initLoad();
  };

  function refresh() {
    loadRecentSimulationVersion();
    currentLocationRef.reset();
    currentItemRef.reset();
    currentAccountRef.reset();
    reset();
    setProblemResourceData({labels: [], datasets: [{ type: 'bar', data: []}]});
    setProblemInventoryData({labels: [],datasets: [{ type: 'bar', data: []}]});
    setProblemTypeData({labels: [],datasets: []});
    setProblemNameData({labels: [],datasets: []});
    gridPlanProblems.dataProvider.clearRows();
  }

  const setOptionsGridPlanProblems = () => {
    setVisibleProps(gridPlanProblems, true, true, false);

    gridPlanProblems.gridView.setDisplayOptions({ fitStyle: "fill" });

    gridPlanProblems.gridView.onCellClicked = function (grid, clickData) {
      if (linkColumns.indexOf(clickData.column) != -1) {
        if (clickData.cellType === 'data') {
          let pathName = ''
          let params = {};
          params['VERSION_ID'] = getValues('simulationVersion');
          if (clickData.column == "UI_NM_01") {
            params['RES_CD'] = grid.getValue(clickData.itemIndex, 'RES_CD');
            params['RES_DESCRIP'] = grid.getValue(clickData.itemIndex, 'RES_DESCRIP');
            params['LOCATION_CODE'] = grid.getValue(clickData.itemIndex, 'PROBLEM_LOCAT_CD');
            params['ITEM_CD'] = grid.getValue(clickData.itemIndex, 'PROBLEM_ITEM_CD');
            pathName = grid.getValue(clickData.itemIndex, 'URL_01');
          } else if (clickData.column == "UI_NM_02") {
            params['RES_CD'] = grid.getValue(clickData.itemIndex, 'RES_CD');
            params['RES_DESCRIP'] = grid.getValue(clickData.itemIndex, 'RES_DESCRIP');
            params['LOCATION_CODE'] = grid.getValue(clickData.itemIndex, 'PROBLEM_LOCAT_CD');
            params['MIN_DATE'] = grid.getValue(clickData.itemIndex, 'PROBLEM_DATE');
            params['MAX_DATE'] = grid.getValue(clickData.itemIndex, 'DUE_DATE');
            pathName = grid.getValue(clickData.itemIndex, 'URL_02');
          } else if (clickData.column == "UI_NM_03") {
            params['DMND_ID'] = grid.getValue(clickData.itemIndex, 'DMND_ID');
            pathName = grid.getValue(clickData.itemIndex, 'URL_03');
          }

          history.push({ pathname: pathName, state: { params: params } });
        }
      }
    }
  }

  function loadRecentSimulationVersion() {
    let param = new URLSearchParams();

    param.append('MODULE_CD', getValues('moduleCd'));
    param.append('MAIN_VER_ID', '');
    param.append('SIMUL_VER_ID', '');
    param.append('SIMUL_VER_DESCRIP', '');

    return zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_COMM_SRH_VER_Q',
      data: param
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          if (res.data.RESULT_DATA.length > 0) {
            setValue('simulationVersion', res.data.RESULT_DATA[0].SIMUL_VER);
          }
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function loadPlanProblem() {
    let param = new URLSearchParams();

    param.append('VERSION_ID', getValues('simulationVersion'));
    param.append('DMND_ID', getValues('demandId'));
    param.append('ITEM_CD', currentItemRef.getItemCode());
    param.append('ITEM_NM', currentItemRef.getItemName());
    param.append('ITEM_TP_NM', currentItemRef.getItemType());
    param.append('ACCOUNT_CD', currentAccountRef.getAccountCode());
    param.append('ACCOUNT_NM', currentAccountRef.getAccountName());
    param.append('DMND_TP', getValues('demandTypeName'));
    param.append('DMND_CLASS_NM', getValues('demandClassName'));
    param.append('REQUEST_SITE_ID', currentLocationRef.getLocationCode());
    param.append('REQUEST_SITE_DESCRIP', currentLocationRef.getLocationName());
    param.append('PROBLEM_ITEM_CD', getValues('problemItemCd'));
    param.append('PROBLEM_RES_CD', getValues('problemResCd'));
    param.append('PROBLEM_RES_DESCRIP', getValues('problemResDescrip'));
    param.append('PROBLEM_TYPE', getValues('problemType'));
    param.append('LANG_CD', languageCode);

    return zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/GetPlanProblem',
      data: param
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          gridPlanProblems.setData(res.data.RESULT_DATA);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function loadPlanProblemChart() {
    let param = new URLSearchParams();

    param.append('VERSION_ID', getValues('simulationVersion'));

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/GetProblemSummary',
      data: param
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          let groupNames = ['PROBLEM_TYPE', 'PROBLEM_NAME', 'PROBLEM_INVENTORY', 'PROBLEM_RESOURCE'];

          groupNames.map((name) => {
            let result = res.data.RESULT_DATA.filter(code => code.GROUP_NAME == name);
            let labelArray = [];
            let dataArray = [];

            result.map(result => {
              labelArray.push(result.CATEGORY_NAME);
              dataArray.push(result.CATEGORY_VALUE);
            })

            let backgroundColorArray = labelArray.map((label) => {
              return chartColors[label];
            });

            let labels = labelArray.map((label)=>{return transLangKey(label)});

            let barCharDataSet = { labels: labels, datasets: [{ type: 'bar', data: dataArray, borderWidth: 1, backgroundColor: chartColors[name] }]};
            let doughnutCharDataSet = { labels: labels, datasets: [{ type: 'doughnut', data: dataArray, backgroundColor: backgroundColorArray }]};

            if (name == 'PROBLEM_TYPE') {
              setProblemTypeData(doughnutCharDataSet);
            } else if (name == 'PROBLEM_NAME') {
              setProblemNameData(doughnutCharDataSet);
            } else if (name == "PROBLEM_RESOURCE") {
              setProblemResourceData(barCharDataSet)
            } else if (name == "PROBLEM_INVENTORY") {
              setProblemInventoryData(barCharDataSet)
            }
          });
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function openSimulationVersionPopup() {
    setSimulationVersionPopupOpen(true);
  }

  function closeSimulationVersionPopup() {
    setSimulationVersionPopupOpen(false);
  }

  function setSimulationVersion(data) {
    setValue('simulationVersion', data.SIMUL_VER);
  }

  function openItemPopup() {
    setItemPopupOpen(true);
  }

  function closeItemPopup() {
    setItemPopupOpen(false);
  }

  function onSetItem(gridRows) {
    let itemCdArr = [];
    let itemNmArr = [];
    let itemTpNmArr = [];

    gridRows.forEach(function (row) {
      itemCdArr.push(row.ITEM_CD);
      itemNmArr.push(row.ITEM_NM);
      itemTpNmArr.push(row.ITEM_TP_NM);
    });

    setValue('problemItemCd', itemCdArr.join('|'));
  }

  function onSetResource(gridRow) {
    setValue("problemResCd", gridRow.RES_CD);
    setValue("problemResDescrip", gridRow.DESCRIP === null ? '' : gridRow.RES_DESCRIP);
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <InputField type='action' name='simulationVersion' label={transLangKey('SIMUL_VER_SHORTN')} title={transLangKey('SEARCH')} onClick={openSimulationVersionPopup} control={control} style={{ width: '210px' }}>
              <Icon.Search />
            </InputField>
            <InputField name="demandId" label={transLangKey("DMND_ID")} control={control} />
            <InputField type='action' name='problemResCd' label={transLangKey('PROBLEM_RES_CD')} title={transLangKey('SEARCH')} onClick={() => {setPopResource(true)}} control={control}>
              <Icon.Search />
            </InputField>
            <InputField name='problemResDescrip' label={transLangKey('PROBLEM_RES_DESCRIP')} control={control} />
            <InputField type="action" name="problemItemCd" label={transLangKey("PROBLEM_ITEM_CD")} control={control} onClick={openItemPopup}>
              <Icon.Search />
            </InputField>
          </SearchRow>
          <SearchRow>
            <ItemSearchBox ref={itemSearchBoxRef} keyValue={'itemName'} placeHolder={transLangKey("ITEM_NM")} style={{width: 300}} />
            <LocationSearchBox ref={locationSearchBoxRef} keyValue={'locationCode'} label={transLangKey("REQUEST_SITE_ID")} placeHolder={transLangKey("LOCAT_CD")} fields={['locationCode', 'locationName']} style={{width: 300, popoverHeight: 210}} options={locationSearchBoxOptions} />
            <AccountSearchCondition ref={accountSearchConditionRef} />
          </SearchRow>
        </SearchArea>
        <ResultArea sizes={[40, 60]}>
          <Box sx={{ display: "flex", height: 'calc(100% - 53px)', flexDirection: "column", alignContent: "stretch", alignItems: "stretch" }}>
            <ButtonArea>
              <LeftButtonArea>
                <GridExcelExportButton type='icon' grid='gridPlanProblems' options={exportExceloptions} />
              </LeftButtonArea>
            </ButtonArea>
            <Box style={{ height: 'calc(100% - 53px)' }}>
              <BaseGrid id='gridPlanProblems' items={gridPlanProblemsColumns} />
            </Box>
          </Box>
          <Box sx={{ display: "flex", height: 'calc(100% - 53px)', flexDirection: "column", alignContent: "stretch", alignItems: "stretch" }}>
            <Box style={{ width: '100%', display: 'flex', justifyContent: 'center', height: '50%' }}>
              <Box style={{ width: '50%' }}>
                <Doughnut data={problemTypeData} options={problemTypeChartOptions} />
              </Box>
              <Box style={{ width: '50%' }}>
                <Doughnut data={problemNameData} options={problemNameChartOptions} />
              </Box>
            </Box>
            <Box style={{ width: '100%', display: 'flex', justifyContent: 'center', height: '50%' }}>
              <Box style={{ width: '50%' }}>
                <Chart data={problemResourceData} options={problemResourceChartOptions} />
              </Box>
              <Box style={{ width: '50%' }}>
                <Chart data={problemInventoryData} options={problemInventoryChartOptions} />
              </Box>
            </Box>
          </Box>
        </ResultArea>
      </ContentInner>

      <PopSimulationVersion open={simulationVersionPopupOpen} onClose={closeSimulationVersionPopup} confirm={setSimulationVersion} module={getValues('moduleCd')} />
      <PopCommResource open={resourcePopupOpen} onClose={() => {setPopResource(false)}} confirm={onSetResource} />
      <PopCommItem id="cItem" open={itemPopupOpen} onClose={closeItemPopup} confirm={onSetItem} />
    </>
  )
}

export default ShortLateReason;
