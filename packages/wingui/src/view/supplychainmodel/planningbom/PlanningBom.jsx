import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Box } from "@mui/material";

import {
  ContentInner, SearchArea, SearchRow, ButtonArea, LeftButtonArea, RightButtonArea, GridExcelImportButton, GridExcelExportButton, 
  GridAddRowButton, GridDeleteRowButton, GridSaveButton, CommonButton, InputField, BaseGrid, useViewStore, useUserStore, zAxios
} from "@zionex/wingui-core/src/common/imports";

import PopPlanningBomBundleCreate from "./PopPlanningBomBundleCreate";
import PopPlanningBomGrid1New from "./PopPlanningBomGrid1New";
import PopPlanningBomGrid2New from "./PopPlanningBomGrid2New";
import ItemSearchBox from '../common/ItemSearchBox';
import LocationSearchBox from '../common/LocationSearchBox';
import { setGridComboList } from "@wingui/view/supplychainmodel/common/common";

let gridBomColumns = [
  { name: "GLOBAL_PLAN_BOM_ID", dataType: "text", headerText: "GLOBAL_PLAN_BOM_ID", visible: false, editable: false, width: "150" },
  { name: "CONSUME_LOCAT_ITEM_ID", dataType: "text", headerText: "CONSUME_LOCAT_ITEM_ID", visible: false, editable: false, width: "150" },
  { name: "SUPPLY_LOCAT_ITEM_ID", dataType: "text", headerText: "SUPPLY_LOCAT_ITEM_ID", visible: false, editable: false, width: "150" },
  { name: "ITEM_MST_ID", dataType: "text", headerText: "ITEM_MST_ID", visible: false, editable: false, width: "150" },
  { name: "BOD_TP_ID", dataType: "text", headerText: "BOD_TP_ID", visible: false, editable: false, width: "150" },
  { name: "LOCAT_ITEM_UOM_ID", dataType: "text", headerText: "LOCAT_ITEM_UOM_ID", visible: false, editable: false, width: "150" },
  { name: "BOD_TP", dataType: "text", headerText: "BOD_TP", visible: false, editable: false, width: "80" },
  { name: "CONSUME_LOCAT_ID", dataType: "text", headerText: "CONSUME_LOCAT_ID", visible: false, editable: false, width: "150" },
  {
    name: "CONSUME", dataType: "group", orientation: "horizontal", headerText: "CONSUME", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "CONSUME_LOCAT_TP", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "80", groupShowMode: "expand" },
      { name: "CONSUME_LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "80", groupShowMode: "expand" },
      { name: "CONSUME_LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "80", groupShowMode: "always" },
      { name: "CONSUME_LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "120", groupShowMode: "always" },
      { name: "CONSUME_ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: "80", groupShowMode: "always" },
      { name: "CONSUME_ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: "120", groupShowMode: "always" },
      { name: "CONSUME_ITEM_TP", dataType: "text", headerText: "ITEM_TP", visible: true, editable: false, width: "80", groupShowMode: "expand" },
      { name: "CONSUME_LOCAT_ITEM_UOM", dataType: "text", headerText: "ITEM_UOM_NM", visible: false, editable: false, width: "80" }
    ]
  },
  {
    name: "SUPPLY", dataType: "group", orientation: "horizontal", headerText: "SUPPLY", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "SUPPLY_ITEM_CD", dataType: "text", headerText: "SUPPLY_ITEM_CD", visible: false, editable: false, width: "120" },
      { name: "SUPPLY_ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: false, editable: false, width: "220" },
      { name: "SUPPLY_ITEM_TP", dataType: "text", headerText: "SUPPLY_ITEM_TP", visible: false, editable: false, width: "80" },
      { name: "SUPPLY_LOCAT_ITEM_UOM", dataType: "text", headerText: "ITEM_UOM_NM", visible: false, editable: false, width: "80" },
      { name: "SRCING_POLICY_ID", dataType: "text", headerText: "SRCING_POLICY", visible: true, editable: true, width: "100", useDropdown: true, lookupDisplay: true, groupShowMode: "always" },
      { name: "SRCING_POLICY", dataType: "text", headerText: "SRCING_POLICY", visible: false, editable: false, width: "100", groupShowMode: "always" },
      { name: "SRCING_RULE", dataType: "number", headerText: "SRCING_RULE", visible: true, editable: true, width: "80", numberFormat: "#,###", groupShowMode: "always" },
      { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "60", groupShowMode: "always" },
      { name: "SUPPLY_LOCAT_TP", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "80", groupShowMode: "expand" },
      { name: "SUPPLY_LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "80", groupShowMode: "expand" },
      { name: "SUPPLY_LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "80", groupShowMode: "always" },
      { name: "SUPPLY_LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "120", groupShowMode: "always" }
    ]
  },
  { name: "FIXED_YN", dataType: "boolean", headerText: "FIXED_YN", visible: true, editable: true, width: "60" },
  {
    name: "VEHICL_GROUP", dataType: "group", orientation: "horizontal", headerText: "VEHICL_GROUP", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "VEHICL_TP", dataType: "text", headerText: "VEHICL_TP", visible: true, editable: false, width: "80" },
      { name: "BOD_LEADTIME", dataType: "text", headerText: "BOD_LEADTIME", visible: true, editable: false, width: "80" },
      { name: "UOM_NM", dataType: "text", headerText: "UOM_NM", visible: true, editable: false, width: "80" }
    ]
  },
  {
    name: "EDIT", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      {name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: 100, groupShowMode: "expand"},
      {name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: 140, groupShowMode: "expand"},
      {name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 100, groupShowMode: "always"},
      {name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 140, groupShowMode: "expand"}
    ]
  }
];

let gridSourcingColumns = [
  { name: "GLB_PBOM_PRIOD_ID", dataType: "text", headerText: "GLB_PBOM_PRIOD_ID", visible: false, editable: false, width: "50" },
  {
    name: "CONSUME", dataType: "group", orientation: "horizontal", headerText: "CONSUME", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "CONSUME_LOCAT_TP", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "120", groupShowMode: "expand" },
      { name: "CONSUME_LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "80", groupShowMode: "expand" },
      { name: "CONSUME_LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "80", groupShowMode: "always" },
      { name: "CONSUME_LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "150", groupShowMode: "always" }
    ]
  },
  { name: "CONSUME_ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: "100" },
  { name: "CONSUME_ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: "220" },
  {
    name: "SUPPLY", dataType: "group", orientation: "horizontal", headerText: "SUPPLY", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "SUPPLY_LOCAT_TP", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "100", groupShowMode: "expand" },
      { name: "SUPPLY_LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "80", groupShowMode: "expand" },
      { name: "SUPPLY_LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "80", groupShowMode: "always" },
      { name: "SUPPLY_LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "150", groupShowMode: "always" }
    ]
  },
  { name: "STRT_DTTM", dataType: "datetime", headerText: "STRT_DATE", visible: true, editable: true, width: "100", format: "yyyy-MM-dd" },
  { name: "END_DTTM", dataType: "datetime", headerText: "END_DATE", visible: true, editable: true, width: "100", format: "yyyy-MM-dd" },
  { name: "SRCING_RULE", dataType: "number", headerText: "SRCING_RULE", visible: true, editable: true, width: "80", numberFormat: "#,###" },
  { name: "DEL_YN", dataType: "boolean", headerText: "DEL_YN", visible: true, editable: true, width: "80" },
  {
    name: "EDIT", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      {name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: 100, groupShowMode: "expand"},
      {name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: 140, groupShowMode: "expand"},
      {name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 100, groupShowMode: "always"},
      {name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 140, groupShowMode: "expand"}
    ]
  }
];

function PlanningBom() {
  //1. view 페이지 데이타 store
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo])

  const consumeLocationSearchBoxRef = useRef();
  const itemSearchBoxRef = useRef();
  const supplyLocationSearchBoxRef = useRef();
  const [username] = useUserStore(state => [state.username]);

  const [currentConsumeLocationRef, setCurrentConsumeLocationRef] = useState();
  const [currentItemRef, setCurrentItemRef] = useState();
  const [currentSupplyLocationRef, setCurrentSupplyLocationRef] = useState();

  //2. 그리드 Object
  const [gridBom, setGridBom] = useState(null);
  const [gridSourcing, setGridSourcing] = useState(null);

  //4. FORM 데이터 처리
  const { reset, getValues, setValue, control } = useForm({
    defaultValues: { }
  });

  const [option1, setOption1] = useState([]);
  const [popupData, setPopupData] = useState({});
  const [planningBomBundleCreatePopupOpen, setPopupPlanningBomBundleCreate] = useState(false);
  const [planningBomNewPopupOpen, setPopupNewBom] = useState(false);
  const [planningBomSourcingNewPopupOpen, setPopupNewBomSourcing] = useState(false);

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
  ]

  const exportExceloptions = {
    headerDepth: 2,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  }

  // 그리드 Object 초기화
  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, "gridBom");
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        if (gridBom != grdObj1)
          setGridBom(grdObj1);
      }
    }
    const grdObj2 = getViewInfo(vom.active, "gridSourcing");
    if (grdObj2) {
      if (grdObj2.dataProvider) {
        if (gridSourcing != grdObj2)
          setGridSourcing(grdObj2);
      }
    }

    if (consumeLocationSearchBoxRef) {
      if (consumeLocationSearchBoxRef.current) {
        setCurrentConsumeLocationRef(consumeLocationSearchBoxRef.current);
      }
    }

     if (itemSearchBoxRef) {
      if (itemSearchBoxRef.current) {
        setCurrentItemRef(itemSearchBoxRef.current);
      }
    }

    if (supplyLocationSearchBoxRef) {
      if (supplyLocationSearchBoxRef.current) {
        setCurrentSupplyLocationRef(supplyLocationSearchBoxRef.current);
      }
    }
  }, [viewData]);

  useEffect(() => {
    if (gridBom) {
      setViewInfo(vom.active, "globalButtons", globalButtons);

      setOptionsGridBom();
      setGridComboList(gridBom,
        'SRCING_POLICY_ID',
        'SOURCING_RULE'
        );
      loadBom();
    }
  }, [gridBom]);

  useEffect(() => {
    if (gridSourcing) {
      setOptionsGridSourcing();
    }
  }, [gridSourcing]);

  function openPopupPlanningBomBundleCreate() {
    setPopupData(gridBom.gridView.getValues(gridBom.gridView.getCurrent().dataRow));
    setPopupPlanningBomBundleCreate(true);
  }

  function openPopupNewPlanningBom() {
    setPopupData(gridBom.gridView.getValues(gridBom.gridView.getCurrent().dataRow));
    setPopupNewBom(true);
  }

  function openPopupNewBomSourcing() {
    let curRow = gridBom.gridView.getCurrent().dataRow;

    if (curRow == -1) {
      curRow = 0;
    }

    setPopupData(gridBom.gridView.getValues(curRow));
    setPopupNewBomSourcing(true);
  }

  function openPopupClose() {
    loadBom();
  }

  function openPopupClose2(gridRow) {
    loadBomSourcing(gridRow.CONSUME_LOCAT_ITEM_ID);
  }

  function onSubmit() {
    loadBom();
  };

  function refresh() {
    currentConsumeLocationRef.reset();
    currentItemRef.reset();
    currentSupplyLocationRef.reset();
    reset();
    gridBom.dataProvider.clearRows();
    gridSourcing.dataProvider.clearRows();
  }

  const setOptionsGridBom = () => {
    setVisibleProps(gridBom, true, true, false);
    gridBom.gridView.setDisplayOptions({
      fitStyle: "fill"
    });

    gridBom.gridView.onCellClicked = function (grid, clickData) {
      let consumeLocatItemId = grid.getValue(clickData.itemIndex, "CONSUME_LOCAT_ITEM_ID");

      if (consumeLocatItemId != null) {
        loadBomSourcing(consumeLocatItemId)
      }
    }

    gridBom.gridView.setColumnProperty("CONSUME_LOCAT_TP", "mergeRule", {
      criteria: "values[ 'CONSUME_LOCAT_TP' ]"
    });

    gridBom.gridView.setColumnProperty("CONSUME_LOCAT_LV", "mergeRule", {
      criteria: "values[ 'CONSUME_LOCAT_TP' ] + values[ 'CONSUME_LOCAT_LV' ]"
    });

    gridBom.gridView.setColumnProperty("CONSUME_LOCAT_CD", "mergeRule", {
      criteria: "values[ 'CONSUME_LOCAT_TP' ] + values[ 'CONSUME_LOCAT_LV' ] + values[ 'CONSUME_LOCAT_CD' ]"
    });

    gridBom.gridView.setColumnProperty("CONSUME_LOCAT_NM", "mergeRule", {
      criteria: "values[ 'CONSUME_LOCAT_TP' ] + values[ 'CONSUME_LOCAT_LV' ] + values[ 'CONSUME_LOCAT_CD' ]"
    });

    gridBom.gridView.setColumnProperty("CONSUME_ITEM_CD", "mergeRule", {
      criteria: "values[ 'CONSUME_LOCAT_TP' ] + values[ 'CONSUME_LOCAT_LV' ] + values[ 'CONSUME_LOCAT_CD' ] + values[ 'CONSUME_ITEM_CD' ]"
    });

    gridBom.gridView.setColumnProperty("CONSUME_ITEM_NM", "mergeRule", {
      criteria: "values[ 'CONSUME_LOCAT_TP' ] + values[ 'CONSUME_LOCAT_LV' ] + values[ 'CONSUME_LOCAT_CD' ] + values[ 'CONSUME_ITEM_CD' ]"
    });
  }

  const setOptionsGridSourcing = () => {
    setVisibleProps(gridSourcing, true, true, true);
    gridSourcing.gridView.setDisplayOptions({
      fitStyle: "fill"
    });

    gridSourcing.gridView.setColumnProperty("CONSUME_LOCAT_TP", "mergeRule", {
      criteria: "values[ 'CONSUME_LOCAT_TP' ]"
    });

    gridSourcing.gridView.setColumnProperty("CONSUME_LOCAT_LV", "mergeRule", {
      criteria: "values[ 'CONSUME_LOCAT_TP' ] + values[ 'CONSUME_LOCAT_LV' ]"
    });

    gridSourcing.gridView.setColumnProperty("CONSUME_LOCAT_CD", "mergeRule", {
      criteria: "values[ 'CONSUME_LOCAT_TP' ] + values[ 'CONSUME_LOCAT_LV' ] + values[ 'CONSUME_LOCAT_CD' ]"
    });

    gridSourcing.gridView.setColumnProperty("CONSUME_LOCAT_NM", "mergeRule", {
      criteria: "values[ 'CONSUME_LOCAT_TP' ] + values[ 'CONSUME_LOCAT_LV' ] + values[ 'CONSUME_LOCAT_CD' ]"
    });

    gridSourcing.gridView.setColumnProperty("CONSUME_ITEM_CD", "mergeRule", {
      criteria: "values[ 'CONSUME_LOCAT_TP' ] + values[ 'CONSUME_LOCAT_LV' ] + values[ 'CONSUME_LOCAT_CD' ] + values[ 'CONSUME_ITEM_CD' ]"
    });

    gridSourcing.gridView.setColumnProperty("CONSUME_ITEM_NM", "mergeRule", {
      criteria: "values[ 'CONSUME_LOCAT_TP' ] + values[ 'CONSUME_LOCAT_LV' ] + values[ 'CONSUME_LOCAT_CD' ] + values[ 'CONSUME_ITEM_CD' ]"
    });
  }

  function loadBom() {
    let dataArr;
    let tabUrl;
    let param = new URLSearchParams();
    param.append("BOD_TP", '');
    param.append('CONSUME_LOCAT_TP', currentConsumeLocationRef.getLocationType());
    param.append('CONSUME_LOCAT_LV', currentConsumeLocationRef.getLocationLevel());
    param.append('CONSUME_LOCAT_CD', currentConsumeLocationRef.getLocationCode());
    param.append('CONSUME_LOCAT_NM', currentConsumeLocationRef.getLocationName());
    param.append('ITEM_CD', currentItemRef.getItemCode());
    param.append('ITEM_NM', currentItemRef.getItemName());
    param.append('ITEM_TP', currentItemRef.getItemType());
    param.append('SUPPLY_LOCAT_TP', currentSupplyLocationRef.getLocationType());
    param.append('SUPPLY_LOCAT_LV', currentSupplyLocationRef.getLocationLevel());
    param.append('SUPPLY_LOCAT_CD', currentSupplyLocationRef.getLocationCode());
    param.append('SUPPLY_LOCAT_NM', currentSupplyLocationRef.getLocationName());


    param.append("CURRENT_OPERATION_CALL_ID", "OPC_GRID_LOAD_01");
    tabUrl = baseURI() + "engine/mp/SRV_UI_CM_11_Q1";

    zAxios({
      method: "post",
      header: { "content-type": "application/json" },
      url: tabUrl,
      data: param
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          dataArr = [];
          dataArr = res.data.RESULT_DATA;

          gridBom.dataProvider.fillJsonData(dataArr);

          if (gridBom.dataProvider.getRowCount() == 0) {
            gridBom.gridView.setDisplayOptions({ showEmptyMessage: true, emptyMessage: transLangKey("MSG_NO_DATA") });
          }
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function loadBomSourcing(consumeLocatItemId) {
    let dataArr;
    let param = new URLSearchParams();
    param.append("CONSUME_LOCAT_ITEM_ID", consumeLocatItemId);
    param.append("timeout", 0);
    param.append("CURRENT_OPERATION_CALL_ID", "OPC_RST_CPT_01_cell-click_01");

    zAxios({
      method: "post",
      header: { "content-type": "application/json" },
      url: baseURI() + "engine/mp/SRV_UI_CM_11_Q3",
      data: param
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          dataArr = [];
          dataArr = res.data.RESULT_DATA;

          gridSourcing.dataProvider.fillJsonData(dataArr);
          if (gridSourcing.dataProvider.getRowCount() == 0) {
            gridSourcing.gridView.setDisplayOptions({ showEmptyMessage: true, emptyMessage: transLangKey("MSG_NO_DATA") });
          }
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function saveBom() {
    gridBom.gridView.commit(true);
    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridBom.dataProvider.getAllStateRows().created,
          gridBom.dataProvider.getAllStateRows().updated,
          gridBom.dataProvider.getAllStateRows().deleted,
          gridBom.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          changeRowData.push(gridBom.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"), { close: false });
        } else {
          if (answer) {
            let formData = new FormData();
            formData.append("changes", JSON.stringify(changeRowData));
            formData.append("USER_ID", username);
            formData.append("timeout", 0);
            formData.append("CURRENT_OPERATION_CALL_ID", "OPC_RST_BTN_SAV_01");

            zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_11_S2", formData)
            .then(function (res) {
              if (res.status === gHttpStatus.SUCCESS) {
                const rsData = res.data;
                if (rsData.RESULT_SUCCESS) {
                  const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_11_S2_P_RT_MSG;
                  msg === "MSG_0001" ? loadBom() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg)); 
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

  function saveBomSourcing() {
    gridSourcing.gridView.commit(true);
    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridSourcing.dataProvider.getAllStateRows().created,
          gridSourcing.dataProvider.getAllStateRows().updated,
          gridSourcing.dataProvider.getAllStateRows().deleted,
          gridSourcing.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (indx) {
          let data = gridSourcing.dataProvider.getJsonRow(indx);

          if (data.STRT_DTTM != null) {
            data.STRT_DTTM = data.STRT_DTTM.format("yyyy-MM-ddT00:00:00");
          }
          if (data.END_DTTM != null) {
            data.END_DTTM = data.END_DTTM.format("yyyy-MM-ddT00:00:00");
          }

          changeRowData.push(data);
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"), { close: false });
        } else {
          const msg = "MSG_SAVE";
          if (answer) {
            let formData = new FormData();
            formData.append("WRK_TYPE", "SAVE");
            formData.append("changes", JSON.stringify(changeRowData));
            formData.append("USER_ID", username);
            formData.append("timeout", 0);
            formData.append("CURRENT_OPERATION_CALL_ID", "OPC_UI_CM_11_RST_CPT_03_09_CLICK_01");

            zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_11_S3", formData)
              .then(function () {
                gridSourcing.gridView.hideToast();
                let consumeLocatItemId = gridBom.gridView.getValue(gridBom.gridView.getCurrent().itemIndex, "CONSUME_LOCAT_ITEM_ID");

                let dataArr;
                let param = new URLSearchParams();
                param.append("CONSUME_LOCAT_ITEM_ID", consumeLocatItemId);
                param.append("timeout", 0);
                param.append("CURRENT_OPERATION_CALL_ID", "OPC_RST_CPT_01_cell-click_01");

                zAxios({
                  method: "post",
                  header: { "content-type": "application/json" },
                  url: baseURI() + "engine/mp/SRV_UI_CM_11_Q3",
                  data: param
                })
                  .then(function (res) {
                    if (res.status === gHttpStatus.SUCCESS) {
                      dataArr = [];
                      dataArr = res.data.RESULT_DATA;

                      gridSourcing.dataProvider.fillJsonData(dataArr);
                      if (gridSourcing.dataProvider.getRowCount() == 0) {
                        gridSourcing.gridView.setDisplayOptions({ showEmptyMessage: true, emptyMessage: transLangKey("MSG_NO_DATA") });
                      }
                    }
                  })
                  .catch(function (err) {
                    console.log(err);
                  });
              })
              .catch(function (e) {
                console.error(e);
              });
          }
        }
      }
    });
  }

  function onDelete() {
    gridSourcing.gridView.commit(true);

    let deleteRows = [];
    gridSourcing.gridView.getCheckedRows().forEach(function (indx) {
      let data = gridSourcing.dataProvider.getJsonRow(indx);

      if (data.STRT_DTTM != null) {
        data.STRT_DTTM = data.STRT_DTTM.format("yyyy-MM-ddT00:00:00");
      }
      if (data.END_DTTM != null) {
        data.END_DTTM = data.END_DTTM.format("yyyy-MM-ddT00:00:00");
      }

      deleteRows.push(data);
    });

    if (deleteRows.length > 0) {
      gridSourcing.dataProvider.removeRows(gridSourcing.dataProvider.getAllStateRows().created);

      gridSourcing.gridView.showToast(progressSpinner + "Deleting data...", true);

      let formData = new FormData();
      formData.append("WRK_TYPE", 'DELETE');
      formData.append("changes", JSON.stringify(deleteRows));
      formData.append("USER_ID", username);
      formData.append("CURRENT_OPERATION_CALL_ID", "OPC_UI_CM_11_RST_CPT_03_08_CLICK_01");

      zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_11_S3", formData).
        then(function (response) {
          if (response.status === gHttpStatus.SUCCESS) {
            gridSourcing.dataProvider.removeRows(gridSourcing.gridView.getCheckedRows());
            let consumeLocatItemId = gridBom.gridView.getValue(gridBom.gridView.getCurrent().itemIndex, "CONSUME_LOCAT_ITEM_ID");

            let dataArr;
            let param = new URLSearchParams();
            param.append("CONSUME_LOCAT_ITEM_ID", consumeLocatItemId);
            param.append("timeout", 0);
            param.append("CURRENT_OPERATION_CALL_ID", "OPC_RST_CPT_01_cell-click_01");

            zAxios({
              method: "post",
              header: { "content-type": "application/json" },
              url: baseURI() + "engine/mp/SRV_UI_CM_11_Q3",
              data: param
            })
              .then(function (res) {
                if (res.status === gHttpStatus.SUCCESS) {
                  dataArr = [];
                  dataArr = res.data.RESULT_DATA;

                  gridSourcing.dataProvider.fillJsonData(dataArr);
                  if (gridSourcing.dataProvider.getRowCount() == 0) {
                    gridSourcing.gridView.setDisplayOptions({ showEmptyMessage: true, emptyMessage: transLangKey("MSG_NO_DATA") });
                  }
                }
              })
              .catch(function (err) {
                console.log(err);
              });
          }
        })
        .catch(function (err) {
          console.log(err);
        })
        .then(function () {
          gridSourcing.gridView.hideToast();
        });
    }
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <InputField type="select" name="bodTp" label={transLangKey("BOD_TYPE")} style={{display: 'none'}} control={control} readonly={true} disabled={false} options={option1} />
            <LocationSearchBox ref={consumeLocationSearchBoxRef} keyValue={'locationName'} label={transLangKey("CONSUME_LOCAT")} placeHolder={transLangKey("LOCAT_NM")}/>
            <ItemSearchBox ref={itemSearchBoxRef} keyValue={'itemName'} placeHolder={transLangKey("ITEM_NM")}/>
            <LocationSearchBox ref={supplyLocationSearchBoxRef} keyValue={'locationName'} label={transLangKey("SUPPLY_LOCAT")} placeHolder={transLangKey("LOCAT_NM")}/>
          </SearchRow>
        </SearchArea>

        <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch'}}>
          <Box style={{ height: "60%" }}>
            <ButtonArea>
              <LeftButtonArea>
                <GridExcelExportButton type="icon" grid="gridBom" options={exportExceloptions} />
                {/*<GridExcelImportButton type="icon" grid="gridBom" />*/}
                <CommonButton title={transLangKey("BUNDLE_CREATE")} onClick={() => { openPopupPlanningBomBundleCreate() }}><Icon.File/></CommonButton>
              </LeftButtonArea>
              <RightButtonArea>
                <GridAddRowButton type="icon" onClick={() => { openPopupNewPlanningBom() }}></GridAddRowButton>
                <GridSaveButton type="icon" grid="gridBom" onClick={() => { saveBom(gridBom) }}></GridSaveButton>
              </RightButtonArea>
            </ButtonArea>
            <Box style={{ height: "calc(100% - 53px)" }}>
              <BaseGrid id="gridBom" items={gridBomColumns}></BaseGrid>
            </Box>
          </Box>
          <Box style={{ height: "40%" }}>
            <ButtonArea>
              <LeftButtonArea></LeftButtonArea>
              <RightButtonArea>
                <GridAddRowButton type="icon" grid="gridSourcing" onClick={() => { openPopupNewBomSourcing() }}></GridAddRowButton>
                <GridDeleteRowButton type="icon" grid="gridSourcing" onDelete={onDelete}></GridDeleteRowButton>
                <GridSaveButton type="icon" grid="gridSourcing" onClick={() => { saveBomSourcing(gridSourcing) }}></GridSaveButton>
              </RightButtonArea>
            </ButtonArea>
            <Box style={{ height: "calc(100% - 53px" }}>
              <BaseGrid id="gridSourcing" items={gridSourcingColumns} ></BaseGrid>
            </Box>
          </Box>
        </Box>
      </ContentInner>
      {planningBomBundleCreatePopupOpen && (<PopPlanningBomBundleCreate open={planningBomBundleCreatePopupOpen} onClose={() => { setPopupPlanningBomBundleCreate(false); }} confirm={openPopupClose} data={popupData}></PopPlanningBomBundleCreate>)}
      {planningBomNewPopupOpen && (<PopPlanningBomGrid1New open={planningBomNewPopupOpen} onClose={() => { setPopupNewBom(false); }} confirm={openPopupClose} data={popupData}></PopPlanningBomGrid1New>)}
      {planningBomSourcingNewPopupOpen && (<PopPlanningBomGrid2New open={planningBomSourcingNewPopupOpen} onClose={() => { setPopupNewBomSourcing(false); }} confirm={openPopupClose2} data={popupData}></PopPlanningBomGrid2New>)}
    </>
  )
}
export default PlanningBom;
