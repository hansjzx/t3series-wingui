import React, { useState, useEffect, useRef } from "react";

import { useForm } from "react-hook-form";
import { Box, Tab, Tabs } from "@mui/material";

import {
  ContentInner, SearchArea, SearchRow, ButtonArea, LeftButtonArea, RightButtonArea, GridExcelImportButton, GridExcelExportButton,
  GridAddRowButton, GridSaveButton, GridDeleteRowButton, CommonButton, BaseGrid, useViewStore, useUserStore, zAxios
} from "@zionex/wingui-core/src/common/imports";

import ItemSearchBox from '../common/ItemSearchBox';
import LocationSearchBox from '../common/LocationSearchBox';
import PopProductionBomBundleCreate from "./PopProductionBomBundleCreate";
import PopProductionBomNew1 from "./PopProductionBomNew1";
import PopProductionBomNew2 from "./PopProductionBomNew2";
import PopProductionBomNew3 from "./PopProductionBomNew3";
import PopProductionBomNew4 from "./PopProductionBomNew4";

let gridParentColumns =
  [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: "100" },
    { name: "SITE_ITEM_ID", dataType: "text", headerText: "SITE_ITEM_ID", visible: false, editable: false, width: "100" },
    { name: 'LOCATION_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'LOCAT', expandable: true, expanded: false,
      childs: [
        { name: "LOC_TP", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "100", groupShowMode: "expand" },
        { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "100", groupShowMode: "expand" },
        { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "100", groupShowMode: "always" },
        { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "100", groupShowMode: "always" }
      ]
    },
    { name: "BOM_LV", dataType: "text", headerText: "BOM_LV", visible: true, editable: false, width: "100", autoFilter: true },
    { name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: "100", button: "action" },
    { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: "200", autoFilter: true },
    { name: "DESCRIP", dataType: "text", headerText: "DESCRIP", visible: false, editable: false, width: "100" },
    { name: "ITEM_TP", dataType: "text", headerText: "ITEM_TP", visible: true, editable: false, width: "100", autoFilter: true },
    { name: "BOM_ITEM_TP", dataType: "text", headerText: "BOM_ITEM_TP", visible: true, editable: false, width: "150" },
    { name: "BASE_QTY", dataType: "number", headerText: "BASE_QTY", visible: true, editable: true, width: "100", positiveOnly: true },
    { name: "UOM", dataType: "text", headerText: "UOM_NM", visible: true, editable: false, width: "80" },
    { name: "BASE_YIELD", dataType: "number", headerText: "BASE_YIELD", visible: true, editable: true, width: "100", positiveOnly: true, max:100 },
    { name: "BOM_VER_ID", dataType: "text", headerText: "BOM_VER_ID", visible: false, editable: false, width: "100" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80", autoFilter: true },
    {
      name: "EDIT", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
      childs: [
        { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: "100", groupShowMode: "expand" },
        { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: "120", groupShowMode: "expand" },
        { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: "100", groupShowMode: "always" },
        { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: "120", groupShowMode: "expand" }
      ]
    }
  ];

let gridChildColumns =
  [
    { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: "100" },
    { name: "BOM_VER_ID", dataType: "text", headerText: "BOM_VER_ID", visible: true, editable: false, width: "100", autoFilter: true },
    { name: "VER_ACTV_YN", dataType: "boolean", headerText: "VER_ACTV_YN", visible: true, editable: true, width: "100" },
    { name: "BASE_BOM_YN", dataType: "boolean", headerText: "BASE_BOM_YN", visible: true, editable: true, width: "100" },
    { name: "BOM_LV", dataType: "number", headerText: "BOM_LV", visible: true, editable: false, width: "100" },
    { name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: "100", autoFilter: true },
    { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: "200", autoFilter: true },
    { name: "DESCRIP", dataType: "text", headerText: "DESCRIP", visible: true, editable: false, width: "200", autoFilter: true },
    { name: "ITEM_TP", dataType: "text", headerText: "ITEM_TP", visible: true, editable: false, width: "100", autoFilter: true },
    { name: "BOM_ITEM_TP", dataType: "text", headerText: "BOM_ITEM_TP", visible: true, editable: false, width: "120" },
    { name: "ROUTE_CD", dataType: "text", headerText: "ROUTE_CD", visible: true, editable: false, width: "120" },
    { name: "ROUTE_DESCRIP", dataType: "text", headerText: "ROUTE_DESCRIP", visible: true, editable: false, width: "200" },
    { name: "STRT_DATE", dataType: "datetime", headerText: "STRT_DATE", visible: true, editable: false, width: "120", format: "yyyy-MM-dd" },
    { name: "END_DATE", dataType: "datetime", headerText: "END_DATE", visible: true, editable: false, width: "120", format: "yyyy-MM-dd" },
    { name: "CONSUME_QTY", dataType: "number", headerText: "CONSUME_QTY", visible: true, editable: false, width: "100" },
    { name: "UOM_CD", dataType: "text", headerText: "UOM_NM", visible: true, editable: false, width: "100" },
    { name: "BASE_BOM_RATE", dataType: "number", headerText: "BASE_BOM_RATE", visible: true, editable: true, width: "100", positiveOnly: true, max:100 },
    { name: "ALT_GRP_ID", dataType: "text", headerText: "ALT_GRP", visible: true, editable: true, width: "150", useDropdown: true, lookupDisplay: true },
    { name: "ALT_POLICY_ID", dataType: "text", headerText: "ALT_POLICY", visible: true, editable: true, width: "150", useDropdown: true, lookupDisplay: true },
    { name: "PRIORT", dataType: "number", headerText: "PRIORITY", visible: true, editable: true, width: "80", positiveOnly: true },
    { name: "PRDUCT_YN", dataType: "boolean", headerText: "PRDUCT_YN", visible: true, editable: true, width: "80" },
    { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80" },
    {
      name: "EDIT", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
      childs: [
        { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: "100", groupShowMode: "expand" },
        { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: "120", groupShowMode: "expand" },
        { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: "100", groupShowMode: "always" },
        { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: "120", groupShowMode: "expand" }
      ]
    }
  ];

let gridActivationColumns =
  [
    { name: "BOM_PRIOD_ACTV_ID", dataType: "text", headerText: "BOM_PRIOD_ACTV_ID", visible: false, editable: false, width: "100" },
    { name: "PRDUCT_BOM_MST_ID", dataType: "text", headerText: "PRDUCT_BOM_MST_ID", visible: false, editable: false, width: "100" },
    { name: "BOM_LV", dataType: "text", headerText: "BOM_LV", visible: true, editable: false, width: "100" },
    { name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: "100", autoFilter: true },
    { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: "200", autoFilter: true },
    { name: "ITEM_TP", dataType: "text", headerText: "ITEM_TP", visible: true, editable: false, width: "100", autoFilter: true },
    { name: "STRT_DTTM", dataType: "datetime", headerText: "STRT_DTTM", visible: true, editable: true, width: "120", format: "yyyy-MM-dd" },
    { name: "END_DTTM", dataType: "datetime", headerText: "END_DTTM", visible: true, editable: true, width: "120", format: "yyyy-MM-dd" },
    { name: "BASE_YIELD", dataType: "number", headerText: "BASE_YIELD", visible: true, editable: false, width: "100" },
    { name: "YIELD", dataType: "number", headerText: "YIELD", visible: true, editable: true, width: "80" },
    { name: "BOM_VER_ID", dataType: "text", headerText: "BOM_VER_ID", visible: true, editable: false, width: "100", positiveOnly: true, max:100 },
    { name: "ACTV_BOM_VER_ID", dataType: "text", headerText: "ACTV_BOM_VER_ID", visible: true, editable: true, width: "100" }
  ];

let gridRatioColumns =
  [
    { name: "BOM_PRIOD_RATE_ID", dataType: "text", headerText: "BOM_PRIOD_RATE_ID", visible: false, editable: false, width: "100" },
    { name: "PRDUCT_BOM_DTL_ID", dataType: "text", headerText: "PRDUCT_BOM_DTL_ID", visible: false, editable: false, width: "100" },
    { name: "BOM_VER_ID", dataType: "text", headerText: "BOM_VER_ID", visible: true, editable: false, width: "100", autoFilter: true },
    { name: "VER_ACTV_YN", dataType: "boolean", headerText: "VER_ACTV_YN", visible: true, editable: false, width: "100" },
    { name: "BASE_BOM_YN", dataType: "boolean", headerText: "BASE_BOM_YN", visible: true, editable: false, width: "100" },
    { name: "BOM_LV", dataType: "text", headerText: "BOM_LV", visible: true, editable: false, width: "100" },
    { name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: "100", autoFilter: true },
    { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: "200", autoFilter: true },
    { name: "ITEM_TP", dataType: "text", headerText: "ITEM_TP", visible: true, editable: false, width: "100", autoFilter: true },
    { name: "ROUTE_CD", dataType: "text", headerText: "ROUTE_CD", visible: true, editable: false, width: "100" },
    { name: "BOM_ITEM_TP", dataType: "text", headerText: "BOM_ITEM_TP", visible: true, editable: false, width: "100" },
    { name: "CONSUME_QTY", dataType: "number", headerText: "CONSUME_QTY", visible: true, editable: false, width: "80" },
    { name: "UOM_CD", dataType: "text", headerText: "UOM_NM", visible: true, editable: false, width: "100" },
    { name: "STRT_DTTM", dataType: "datetime", headerText: "STRT_DTTM", visible: true, editable: true, width: "120", format: "yyyy-MM-dd" },
    { name: "END_DTTM", dataType: "datetime", headerText: "END_DTTM", visible: true, editable: true, width: "120", format: "yyyy-MM-dd" },
    { name: "BASE_BOM_RATE", dataType: "number", headerText: "BASE_BOM_RATE", visible: true, editable: false, width: "100" },
    { name: "BOM_RATE", dataType: "number", headerText: "BOM_RATE", visible: true, editable: true, width: "100", positiveOnly: true, max:100 }
  ];

function ProductionBom() {
  const locationSearchBoxRef = useRef();
  const itemSearchBoxRef = useRef();
  const [username] = useUserStore(state => [state.username]);

  const [currentLocationRef, setCurrentLocationRef] = useState();
  const [currentItemRef, setCurrentItemRef] = useState();

  const globalButtons = [
    {
      name: "search",
      action: (e) => { onSubmit() },
      visible: true,
      disable: false
    },
    {
      name: "refresh",
      action: (e) => {
        refresh();
      },
      visible: true,
      disable: false
    }
  ];

  const exportExceloptions = {
    headerDepth: 1,
    footer: "default",
    allColumns: true,
    lookupDisplay: true,
    separateRows: true
  };

  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const [tabValue, setTabValue] = React.useState("tab1");
  const [gridParent, setGridParent] = useState(null);
  const [gridChild, setGridChild] = useState(null);
  const [gridActivation, setGridActivation] = useState(null);
  const [gridRatio, setGridRatio] = useState(null);
  const [rowValue, setRowValue] = useState({});

  const [productionBomBundleCreatePopupOpen, setPopupProductionBomBundleCreate] = useState(false);
  const [productionBomNew1PopupOpen, setPopupProductionBomNew1] = useState(false);
  const [productionBomNew2PopupOpen, setPopupProductionBomNew2] = useState(false);
  const [productionBomNew3PopupOpen, setPopupProductionBomNew3] = useState(false);
  const [productionBomNew4PopupOpen, setPopupProductionBomNew4] = useState(false);
  const [popupComboData, setPopupComboData] = useState({});
  const [popupData, setPopupData] = useState({});

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, "gridParent");
    const grdObj2 = getViewInfo(vom.active, "gridChild");
    const grdObj3 = getViewInfo(vom.active, "gridActivation");
    const grdObj4 = getViewInfo(vom.active, "gridRatio");

    if (grdObj1) {
      if (grdObj1.dataProvider) {
        if (gridParent != grdObj1)
          setGridParent(grdObj1);
      }
    }

    if (grdObj2) {
      if (grdObj2.dataProvider) {
        if (gridChild != grdObj2)
          setGridChild(grdObj2);
      }
    }

    if (grdObj3) {
      if (grdObj3.dataProvider) {
        if (gridActivation != grdObj3)
          setGridActivation(grdObj3);
      }
    }

    if (grdObj4) {
      if (grdObj4.dataProvider) {
        if (gridRatio != grdObj4)
          setGridRatio(grdObj4);
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
  }, [viewData]);

  useEffect(() => {
    if (gridParent) {
      setViewInfo(vom.active, "globalButtons", globalButtons);

      setOptionsGridParent();
      gridComboSet();
      loadDataGrid();
    }
  }, [gridParent]);

  useEffect(() => {
    if (gridChild) {
      setOptionsGridChild();
    }
  }, [gridChild]);

  useEffect(() => {
    if (gridActivation) {
      setOptionsGridActivation();
    }
  }, [gridActivation]);

  useEffect(() => {
    if (gridRatio) {
      setOptionsGridRatio();
    }
  }, [gridRatio]);

  const tabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  function onSubmit() {
    loadDataGrid();
  };

  function onSubmitSub() {
    if (tabValue === 'tab1') {
      loadChildBom(rowValue);
    } else if (tabValue === 'tab2') {
      loadActivationBom(rowValue);
    } else {
      loadBomRatio(rowValue);
    }
  };

  function refresh() {
    currentLocationRef.reset();
    currentItemRef.reset();
    gridParent.dataProvider.clearRows();
    gridChild.dataProvider.clearRows();
    gridActivation.dataProvider.clearRows();
    gridRatio.dataProvider.clearRows();
  }

  const setOptionsGridParent = () => {
    setVisibleProps(gridParent, true, true, false);

    gridParent.gridView.setDisplayOptions({
      fitStyle: "fill"
    });

    gridParent.gridView.setColumnProperty("LOC_TP", "mergeRule", {
      criteria: "value"
    });

    const mergeColumns = [ "LOCAT_LV", "LOCAT_CD", "LOCAT_NM", "BOM_LV" ];
    for (let i = 0; i < mergeColumns.length; i++) {
      gridParent.gridView.setColumnProperty(mergeColumns[i], "mergeRule", {
        criteria: "prevvalues + values[ '" + mergeColumns[i] + "' ]"
      });
    }

    gridParent.gridView.columnByName("ITEM_CD").buttonVisibility = "always";

    gridParent.gridView.onCellButtonClicked = function (grid, index, column) {
      if (column.fieldName === "ITEM_CD") {
        let row = grid.getValues(index.itemIndex);
        let obj = {
          "globalBomMstId": row.ID,
          "bomLv": row.BOM_LV,
          "itemCd": row.ITEM_CD,
          "itemNm": row.ITEM_NM,
          "itemTp": row.ITEM_TP,
          "uom": row.UOM,
          "baseYield": row.BASE_YIELD,
          "bomVerId": row.BOM_VER_ID
        };

        setPopupData(obj);
        setRowValue(row);

        loadChildBom(row);
        loadActivationBom(row);
        loadBomRatio(row);
      }
    }
  }

  const setOptionsGridChild = () => {
    setVisibleProps(gridChild, true, true, false);

    gridChild.gridView.setDisplayOptions({
      fitStyle: "fill"
    });

    gridChild.gridView.setFixedOptions({ colCount: 5, resizable: true });

    const mergeColumns = [ "BOM_VER_ID", "VER_ACTV_YN", "BASE_BOM_YN", "BOM_LV" ];
    for (let i = 0; i < mergeColumns.length; i++) {
      gridChild.gridView.setColumnProperty(mergeColumns[i], "mergeRule", {
        criteria: "value"
      });
    }
  }

  const setOptionsGridActivation = () => {
    setVisibleProps(gridActivation, true, true, true);

    gridActivation.gridView.setDisplayOptions({
      fitStyle: "fill"
    });

    gridActivation.gridView.setColumnProperty("BOM_LV", "mergeRule", {
      criteria: "value"
    });

    const mergeColumns = [ "ITEM_CD", "ITEM_NM", "ITEM_TP" ];
    for (let i = 0; i < mergeColumns.length; i++) {
      gridActivation.gridView.setColumnProperty(mergeColumns[i], "mergeRule", {
        criteria: "prevvalues + values[ '" + mergeColumns[i] + "' ]"
      });
    }
  }

  const setOptionsGridRatio = () => {
    setVisibleProps(gridRatio, true, true, true);

    gridRatio.gridView.setDisplayOptions({
      fitStyle: "fill"
    });

    gridRatio.gridView.setColumnProperty("BOM_VER_ID", "mergeRule", {
      criteria: "value"
    });

    const mergeColumns = [ "VER_ACTV_YN", "BASE_BOM_YN", "BOM_LV", "ITEM_CD", "ITEM_NM", "ITEM_TP", "BOM_ITEM_TP", "CONSUME_QTY", "UOM_CD" ];
    for (let i = 0; i < mergeColumns.length; i++) {
      gridRatio.gridView.setColumnProperty(mergeColumns[i], "mergeRule", {
        criteria: "prevvalues + values[ '" + mergeColumns[i] + "' ]"
      });
    }
  }

  function gridComboSet() {
    let param = new URLSearchParams();

    param.append("CODE", "ALTERNATE_MAT_GROUP, ALTERNATE_MAT_POLICY");

    zAxios({
      method: "post",
      header: { "content-type": "application/json" },
      url: baseURI() + "engine/mp/SRV_UI_CM_CODE",
      data: param
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          let dataArr = res.data.RESULT_DATA;

          for (let i = 0; i < dataArr.length; i++) {
            if (dataArr[i].ID === null) {
              dataArr[i].ID = "";
            }
          }

          gridChild.gridView.setColumnProperty(
            "ALT_GRP_ID",
            "lookupData",
            {
              value: "ID",
              label: "CD_NM",
              list: dataArr.filter(code => code.GROUP == "ALTERNATE_MAT_GROUP")
            }
          );

          gridChild.gridView.setColumnProperty(
            "ALT_POLICY_ID",
            "lookupData",
            {
              value: "ID",
              label: "CD_NM",
              list: dataArr.filter(code => code.GROUP == "ALTERNATE_MAT_POLICY")
            }
          );

          setPopupComboData(dataArr);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function openPopupProductionBomBundleCreate() {
    setPopupProductionBomBundleCreate(true);
  }

  function openPopupProductionBomNew1() {
    setPopupProductionBomNew1(true);
  }

  function openPopupProductionBomNew2() {
    setPopupProductionBomNew2(true);
  }

  function openPopupProductionBomNew3() {
    setPopupProductionBomNew3(true);
  }

  function openPopupProductionBomNew4() {
    setPopupProductionBomNew4(true);
  }

  function loadDataGrid() {
    let tabUrl = baseURI() + "engine/mp/SRV_UI_CM_05_Q1";
    let param = new URLSearchParams();

    param.append('LOC_TP', currentLocationRef.getLocationType());
    param.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    param.append('LOCAT_CD', currentLocationRef.getLocationCode());
    param.append('LOCAT_NM', currentLocationRef.getLocationName());
    param.append('ITEM_CD', currentItemRef.getItemCode());
    param.append("DESCRIP", "");
    param.append("ACTV_YN", "A");
    param.append("timeout", 0);
    param.append("CURRENT_OPERATION_CALL_ID", "OPC_TTL_CPT_05_CLICK_01");

    zAxios({
      method: "post",
      header: { "content-type": "application/json" },
      url: tabUrl,
      data: param
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          let dataArr = res.data.RESULT_DATA;

          gridParent.dataProvider.fillJsonData(dataArr);
          gridParent.gridView.setDisplayOptions({ showEmptyMessage: true, emptyMessage: transLangKey("MSG_NO_DATA") });
          gridChild.dataProvider.clearRows();
          gridActivation.dataProvider.clearRows();
          gridRatio.dataProvider.clearRows();
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function loadChildBom(row) {
    let tabUrl = baseURI() + "engine/mp/SRV_UI_CM_05_Q2";
    let param = new URLSearchParams();

    param.append("ID", row.ID);
    param.append("ITEM_CD", row.ITEM_CD);
    param.append("COMPONENT_ITEM_CD", "");
    param.append("COMPONENT_ITEM_DESCRIP", "");
    param.append("timeout", 0);
    param.append("CURRENT_OPERATION_CALL_ID", "OPC_RST_CPT_01_LOAD_RST_CPT_02_01");

    zAxios({
      method: "post",
      header: { "content-type": "application/json" },
      url: tabUrl,
      data: param
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          let dataArr = res.data.RESULT_DATA;

          gridChild.dataProvider.fillJsonData(dataArr);
          gridChild.gridView.setDisplayOptions({ showEmptyMessage: true, emptyMessage: transLangKey("MSG_NO_DATA") });
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function loadActivationBom(row) {
    let tabUrl = baseURI() + "engine/mp/SRV_UI_CM_05_Q3";
    let param = new URLSearchParams();

    param.append("PRDUCT_BOM_MST_ID", row.ID);
    param.append("timeout", 0);
    param.append("CURRENT_OPERATION_CALL_ID", "OPC_RST_CPT_01_LOAD_RST_CPT_03_01");

    zAxios({
      method: "post",
      header: { "content-type": "application/json" },
      url: tabUrl,
      data: param
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          let dataArr = res.data.RESULT_DATA;

          gridActivation.dataProvider.fillJsonData(dataArr);
          gridActivation.gridView.setDisplayOptions({ showEmptyMessage: true, emptyMessage: transLangKey("MSG_NO_DATA") });
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function loadBomRatio(row) {
    let tabUrl = baseURI() + "engine/mp/SRV_UI_CM_05_Q4";
    let param = new URLSearchParams();

    param.append("PRDUCT_BOM_MST_ID", row.ID);
    param.append("timeout", 0);
    param.append("CURRENT_OPERATION_CALL_ID", "OPC_RST_CPT_01_LOAD_RST_CPT_04_01");

    zAxios({
      method: "post",
      header: { "content-type": "application/json" },
      url: tabUrl,
      data: param
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          let dataArr = res.data.RESULT_DATA;

          gridRatio.dataProvider.fillJsonData(dataArr);
          gridRatio.gridView.setDisplayOptions({ showEmptyMessage: true, emptyMessage: transLangKey("MSG_NO_DATA") });
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function saveParentBom() {
    gridParent.gridView.commit(true);
    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridParent.dataProvider.getAllStateRows().created,
          gridParent.dataProvider.getAllStateRows().updated,
          gridParent.dataProvider.getAllStateRows().deleted,
          gridParent.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          changeRowData.push(gridParent.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"), { close: false });
        } else {
          if (answer) {
            let formData = new FormData();
            formData.append("changes", JSON.stringify(changeRowData));
            formData.append("USER_ID", username);
            formData.append("timeout", 0);
            formData.append("CURRENT_OPERATION_CALL_ID", "OPC_RST_CPT_01_SAVE");

            zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_05_S1",
            formData,
            {
              headers: {
                "Content-Type": "application/json"
              }
            })
            .then(function () {
              loadDataGrid();
            })
            .catch(function (e) {
              console.error(e);
            });
          }
        }
      }
    });
  }

  function saveChildBom() {
    gridChild.gridView.commit(true);
    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridChild.dataProvider.getAllStateRows().created,
          gridChild.dataProvider.getAllStateRows().updated,
          gridChild.dataProvider.getAllStateRows().deleted,
          gridChild.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          changeRowData.push(gridChild.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"), { close: false });
        } else {
          if (answer) {
            let formData = new FormData();
            formData.append("WRK_TYPE", "SAVE");
            formData.append("GLOBAL_BOM_MST_ID", rowValue.ID);
            formData.append("changes", JSON.stringify(changeRowData));
            formData.append("USER_ID", username);
            formData.append("timeout", 0);
            formData.append("CURRENT_OPERATION_CALL_ID", "OPC_RST_CPT_02_08_SAVE");

            zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_05_S2", formData)
            .then(function (res) {
              if (res.status === gHttpStatus.SUCCESS) {
                const rsData = res.data;
                if (rsData.RESULT_SUCCESS) {
                  const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_05_S2_P_RT_MSG;
                  msg === "MSG_0001" ? loadChildBom(rowValue) : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg)); 
                } else {
                  showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
                }
              }
            })
            .catch(function (e) {
              console.error(e);
            });
          }
        }
      }
    });
  }

  function onDelete3(targetGrid, deleteRows) {
    let formData = new FormData();

    deleteRows.forEach(function (rowData) {
      if (rowData.STRT_DTTM instanceof Date) {
        rowData.STRT_DTTM = rowData.STRT_DTTM.format("yyyy-MM-ddTHH:mm:ss");
      }
      if (rowData.END_DTTM instanceof Date) {
        rowData.END_DTTM = rowData.END_DTTM.format("yyyy-MM-ddTHH:mm:ss");
      }
    });

    formData.append('WRK_TYPE', 'DELETE');
    formData.append('changes', JSON.stringify(deleteRows));
    formData.append('USER_ID', username);

    if (deleteRows.length > 0) {
      zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_05_S3", formData)
        .then(function (res) {
          if (res.status === gHttpStatus.SUCCESS) {
            const rsData = res.data;
            if (rsData.RESULT_SUCCESS) {
              const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_05_S3_P_RT_MSG;
              msg === "MSG_0002" ? loadActivationBom(rowValue) : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg)); 
            } else {
              showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
            }
          }
        })
        .catch(function (e) {
          console.error(e);
        });
    }
  }

  function saveActivationBom() {
    gridActivation.gridView.commit(true);
    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridActivation.dataProvider.getAllStateRows().created,
          gridActivation.dataProvider.getAllStateRows().updated,
          gridActivation.dataProvider.getAllStateRows().deleted,
          gridActivation.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          let rowData = gridActivation.dataProvider.getJsonRow(row);

          if (rowData.STRT_DTTM instanceof Date) {
            rowData.STRT_DTTM = rowData.STRT_DTTM.format("yyyy-MM-ddTHH:mm:ss");
          }
          if (rowData.END_DTTM instanceof Date) {
            rowData.END_DTTM = rowData.END_DTTM.format("yyyy-MM-ddTHH:mm:ss");
          }

          changeRowData.push(rowData);
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"), { close: false });
        } else {
          if (answer) {
            let formData = new FormData();
            formData.append("WRK_TYPE", "SAVE");
            formData.append("changes", JSON.stringify(changeRowData));
            formData.append("USER_ID", username);
            formData.append("timeout", 0);
            formData.append("CURRENT_OPERATION_CALL_ID", "OPC_UI_CM_05_RST_CPT_03_09_CLICK_01");

            zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_05_S3", formData)
            .then(function (res) {
              if (res.status === gHttpStatus.SUCCESS) {
                const rsData = res.data;
                if (rsData.RESULT_SUCCESS) {
                  const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_05_S3_P_RT_MSG;
                  msg === "MSG_0001" ? loadActivationBom(rowValue) : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg)); 
                } else {
                  showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
                }
              }
            })
            .catch(function (e) {
              console.error(e);
            });
          }
        }
      }
    });
  }

  function saveBomRatio() {
    gridRatio.gridView.commit(true);
    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridRatio.dataProvider.getAllStateRows().created,
          gridRatio.dataProvider.getAllStateRows().updated,
          gridRatio.dataProvider.getAllStateRows().deleted,
          gridRatio.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          let rowData = gridRatio.dataProvider.getJsonRow(row);

          if (rowData.STRT_DTTM instanceof Date) {
            rowData.STRT_DTTM = rowData.STRT_DTTM.format("yyyy-MM-ddTHH:mm:ss");
          }
          if (rowData.END_DTTM instanceof Date) {
            rowData.END_DTTM = rowData.END_DTTM.format("yyyy-MM-ddTHH:mm:ss");
          }

          changeRowData.push(rowData);
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"), { close: false });
        } else {
          if (answer) {
            let formData = new FormData();
            formData.append("WRK_TYPE", "SAVE");
            formData.append("changes", JSON.stringify(changeRowData));
            formData.append("USER_ID", username);
            formData.append("timeout", 0);
            formData.append("CURRENT_OPERATION_CALL_ID", "OPC_UI_CM_05_RST_CPT_04_09_CLICK_01");

            zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_05_S4", formData)
              .then(function (res) {
                if (res.status === gHttpStatus.SUCCESS) {
                  const rsData = res.data;
                  if (rsData.RESULT_SUCCESS) {
                    const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_05_S4_P_RT_MSG;
                    msg === "MSG_0001" ? loadBomRatio(rowValue) : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg)); 
                  } else {
                    showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
                  }
                }
              })
              .catch(function (e) {
                console.error(e);
              });
          }
        }
      }
    });
  }

  function onDelete4(targetGrid, deleteRows) {
    let formData = new FormData();

    deleteRows.forEach(function (rowData) {
      if (rowData.STRT_DTTM instanceof Date) {
        rowData.STRT_DTTM = rowData.STRT_DTTM.format("yyyy-MM-ddTHH:mm:ss");
      }
      if (rowData.END_DTTM instanceof Date) {
        rowData.END_DTTM = rowData.END_DTTM.format("yyyy-MM-ddTHH:mm:ss");
      }
    });

    formData.append('WRK_TYPE', 'DELETE');
    formData.append('changes', JSON.stringify(deleteRows));
    formData.append('USER_ID', username);

    if (deleteRows.length > 0) {
      zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_05_S4", formData)
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          const rsData = res.data;
          if (rsData.RESULT_SUCCESS) {
            const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_05_S4_P_RT_MSG;
            msg === "MSG_0002" ? loadBomRatio(rowValue) : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg)); 
          } else {
            showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
          }
        }
      })
      .catch(function (e) {
        console.error(e);
      });
    }
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <LocationSearchBox ref={locationSearchBoxRef} keyValue={'locationName'} placeHolder={transLangKey("LOCAT_NM")}/>
            <ItemSearchBox ref={itemSearchBoxRef} keyValue={'itemCode'} label={transLangKey("PARENT_ITEM")} placeHolder={transLangKey("ITEM_CD")} fields={['itemCode']} style={{width:250, popoverHeight:150}}/>
          </SearchRow>
        </SearchArea>

        {/* 그리드 영역 */}
        <Box style={{ height: "50%" }}>
          <ButtonArea>
            <LeftButtonArea>
              <GridExcelExportButton type="icon" grid="gridParent" options={exportExceloptions} />
              {/*<GridExcelImportButton type="icon" grid="gridParent" />*/}
              <CommonButton title={transLangKey("BUNDLE_CREATE")} onClick={() => { openPopupProductionBomBundleCreate() }}><Icon.File/></CommonButton>
            </LeftButtonArea>
            <RightButtonArea>
              <GridAddRowButton type="icon" onClick={() => { openPopupProductionBomNew1() }}></GridAddRowButton>
              <GridSaveButton type="icon" onClick={() => { saveParentBom() }}></GridSaveButton>
            </RightButtonArea>
          </ButtonArea>
          <Box style={{ height: "calc(100% - 53px)" }}>
            <BaseGrid id="gridParent" items={gridParentColumns}></BaseGrid>
          </Box>
        </Box>

        <Box style={{ height: "50%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tabValue} onChange={tabChange} indicatorColor="primary">
              <Tab label={transLangKey("COMPONENT_ITEM")} value="tab1" />
              <Tab label={transLangKey("PERIOD_ACTV_BOM")} value="tab2" />
              <Tab label={transLangKey("PERIOD_BOM_RATE")} value="tab3" />
            </Tabs>
          </Box>

          {/* tab1 : Child BOM */}
          <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: tabValue === "tab1" ? "block" : "none" }}>
              <ButtonArea>
                <RightButtonArea>
                  <GridAddRowButton type="icon" onClick={() => { openPopupProductionBomNew2() }}></GridAddRowButton>
                  <GridSaveButton type="icon" onClick={() => { saveChildBom() }}></GridSaveButton>
                </RightButtonArea>
              </ButtonArea>
              <Box style={{ height: "calc(100% - 90px)" }}>
                <BaseGrid id="gridChild" items={gridChildColumns}></BaseGrid>
              </Box>
          </Box>

          {/* tab2 : By period BOM activation */}
          <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: tabValue === "tab2" ? "block" : "none" }}>
              <ButtonArea>
                <RightButtonArea>
                  <GridAddRowButton type="icon" onClick={() => { openPopupProductionBomNew3() }}></GridAddRowButton>
                  <GridDeleteRowButton type="icon" grid="gridActivation" onDelete={onDelete3}></GridDeleteRowButton>
                  <GridSaveButton type="icon" onClick={() => { saveActivationBom() }}></GridSaveButton>
                </RightButtonArea>
              </ButtonArea>
              <Box style={{ height: "calc(100% - 90px)" }}>
                <BaseGrid id="gridActivation" items={gridActivationColumns}></BaseGrid>
              </Box>
          </Box>

          {/* tab3 : By period BOM ratio */}
          <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: tabValue === "tab3" ? "block" : "none" }}>
            <ButtonArea>
              <RightButtonArea>
                <GridAddRowButton type="icon" onClick={() => { openPopupProductionBomNew4() }}></GridAddRowButton>
                <GridDeleteRowButton type="icon" grid="gridRatio" onDelete={onDelete4}></GridDeleteRowButton>
                <GridSaveButton type="icon" onClick={() => { saveBomRatio() }}></GridSaveButton>
              </RightButtonArea>
            </ButtonArea>
            <Box style={{ height: "calc(100% - 90px)" }}>
              <BaseGrid id="gridRatio" items={gridRatioColumns}></BaseGrid>
            </Box>
          </Box>

        </Box>
      </ContentInner>

      {productionBomBundleCreatePopupOpen && (<PopProductionBomBundleCreate open={productionBomBundleCreatePopupOpen} onClose={() => { setPopupProductionBomBundleCreate(false); }} confirm={onSubmit} ></PopProductionBomBundleCreate>)}
      {productionBomNew1PopupOpen && (<PopProductionBomNew1 open={productionBomNew1PopupOpen} onClose={() => { setPopupProductionBomNew1(false); }} confirm={onSubmit} ></PopProductionBomNew1>)}
      {productionBomNew2PopupOpen && (<PopProductionBomNew2 open={productionBomNew2PopupOpen} onClose={() => { setPopupProductionBomNew2(false); }} confirm={onSubmitSub} comboData={popupComboData} data={popupData} ></PopProductionBomNew2>)}
      {productionBomNew3PopupOpen && (<PopProductionBomNew3 open={productionBomNew3PopupOpen} onClose={() => { setPopupProductionBomNew3(false); }} confirm={onSubmitSub} data={popupData} ></PopProductionBomNew3>)}
      {productionBomNew4PopupOpen && (<PopProductionBomNew4 open={productionBomNew4PopupOpen} onClose={() => { setPopupProductionBomNew4(false); }} confirm={onSubmitSub} data={popupData} ></PopProductionBomNew4>)}
    </>
  )
}
export default ProductionBom;
