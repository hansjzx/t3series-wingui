import React, { useState, useEffect, useRef } from "react";

import { Box } from "@mui/material";

import {
  ContentInner, SearchArea, SearchRow, ButtonArea, LeftButtonArea, RightButtonArea, GridExcelImportButton, GridExcelExportButton, GridAddRowButton, GridSaveButton,
  CommonButton, BaseGrid, useViewStore, useUserStore, zAxios
} from "@zionex/wingui-core/src/common/imports";

import PopShipmentLtBundleCreate from "./PopShipmentLtBundleCreate";
import PopShipmentLtGridNew from "./PopShipmentLtGridNew";
import LocationSearchBox from '../common/LocationSearchBox';
import { setGridComboList } from "@wingui/view/supplychainmodel/common/common";

let gridShipmentLtColumns =
[
  { name: "SHPP_LEADTIME_MST_ID", dataType: "text", headerText: "SHPP_LEADTIME_MST_ID", visible: false, editable: false, width: "100" },
  {
    name: "CONSUME", dataType: "group", orientation: "horizontal", headerText: "CONSUME", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "CONSUME_LOCAT_TP", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "80", groupShowMode: 'expand' },
      { name: "CONSUME_LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "80", groupShowMode: 'expand' },
      { name: "CONSUME_LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "80", groupShowMode: 'always' },
      { name: "CONSUME_LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "120", groupShowMode: 'always' }
    ]
  },
  {
    name: "SUPPLY", dataType: "group", orientation: "horizontal", headerText: "SUPPLY", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "SUPPLY_LOCAT_ID", dataType: "text", headerText: "LOCAT_TP_ID", visible: false, editable: false, width: "100" },
      { name: "SUPPLY_LOCAT_TP", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "80", groupShowMode: 'expand' },
      { name: "SUPPLY_LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "80", groupShowMode: 'expand' },
      { name: "SUPPLY_LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "80", groupShowMode: 'always' },
      { name: "SUPPLY_LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "120", groupShowMode: 'always' }
    ]
  },
  {
    name: "VEHICL_GROUP", dataType: "group", orientation: "horizontal", headerText: "VEHICL_GROUP", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "VEHICL_ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "60" },
      { name: "VEHICL_TP", dataType: "text", headerText: "VEHICL_TP", visible: true, editable: false, width: "100", autoFilter: true },
      { name: "PRIORT", dataType: "number", headerText: "PRIORITY", visible: true, editable: true, width: "80" }
    ]
  },
  {
    name: "LEADTIME", dataType: "group", orientation: "horizontal", headerText: "LEADTIME", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "OUTBOUND_LT", dataType: "number", headerText: "OUTBOUND_LT", visible: true, editable: false, width: "120" },
      { name: "VOYAGE_LT", dataType: "number", headerText: "VOYAGE_LT", visible: true, editable: true, width: "100" },
      { name: "INBOUND_LT", dataType: "number", headerText: "INBOUND_LT", visible: true, editable: false, width: "100" },
      { name: "TOTAL_LT", dataType: "number", headerText: "TOTAL_LT", visible: true, editable: false, width: "80" },
      { name: "LT_UOM", dataType: "text", headerText: "TIME_UOM_NM", visible: true, editable: true, width: "80", useDropdown: true,  lookupDisplay: true }
    ]
  },
  {
    name: "TRANSP_COST", dataType: "group", orientation: "horizontal", headerText: "TRANSP_COST", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "TRANSP_COST_CAL_BASE_ID", dataType: "text", headerText: "TRANSP_COST_CAL_BASE_ID", visible: true, editable: true, width: "120", useDropdown: true,  lookupDisplay: true },
      { name: "TRANSP_COST_CAL_BASE_CD", dataType: "text", headerText: "TRANSP_COST_CAL_BASE_CD", visible: false, editable: true, width: "100" },
      { name: "WEIGHT_UOM_ID", dataType: "text", headerText: "WEIGHT_UOM_ID", visible: true, editable: false, width: "80" },
      { name: "TRANSP_UTPIC", dataType: "number", headerText: "TRANSP_UTPIC", visible: true, editable: true, width: "100" },
      { name: "CURCY_CD_ID", dataType: "text", headerText: "CURCY_CD_ID", visible: true, editable: true, width: "80", useDropdown: true,  lookupDisplay: true }
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

function ShipmentLt() {
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const [gridShipmentLt, setGridShipmentLt]  = useState(null);
  const [username] = useUserStore(state => [state.username]);
  const consumeLocationSearchBoxRef = useRef();
  const supplyLocationSearchBoxRef = useRef();

  const [currentConsumeLocationRef, setCurrentConsumeLocationRef] = useState();
  const [currentSupplyLocationRef, setCurrentSupplyLocationRef] = useState();

  const [popupData, setPopupData] = useState({});
  const [shipmentLtBundleCreatePopupOpen, setPopupShipmentLtBundleCreate] = useState(false);
  const [shipmentLtGridNewPopupOpen, setPopupShipmentLtGridNew] = useState(false);
  
  const exportExceloptions = {
    headerDepth: 2,
    footer: "default",
    allColumns: true,
    lookupDisplay: true,
    separateRows: true
  };

  useEffect(() => {
    const grdObj1 = getViewInfo( vom.active,"gridShipmentLt");

    if(grdObj1) {
      if(grdObj1.dataProvider) {
        if(gridShipmentLt != grdObj1)
          setGridShipmentLt(grdObj1);
      }
    }

    if (consumeLocationSearchBoxRef) {
      if (consumeLocationSearchBoxRef.current) {
        setCurrentConsumeLocationRef(consumeLocationSearchBoxRef.current);
      }
    }

    if (supplyLocationSearchBoxRef) {
      if (supplyLocationSearchBoxRef.current) {
        setCurrentSupplyLocationRef(supplyLocationSearchBoxRef.current);
      }
    }
  }, [viewData]);

  useEffect(() => {
    if(gridShipmentLt) {
      setViewInfo(vom.active, 'globalButtons', [
        { name: 'search', action: (e) => { onSubmit(); }, visible: true, disable: false },
        { name: 'refresh', action: (e) => { refresh(); }, visible: true, disable: false }
      ]);

      setOptionsGrid();
      setGridComboList(gridShipmentLt,
        'LT_UOM, TRANSP_COST_CAL_BASE_ID, CURCY_CD_ID',
        'TIME_UOM, TRANSPORTATION_COST_CALC_TYPE, CURRENCY'
        );
      loadShipmentLt();
    }
  }, [gridShipmentLt]);

  const setOptionsGrid = () => {
    setVisibleProps(gridShipmentLt, true, true, false);

    gridShipmentLt.gridView.setDisplayOptions({
      fitStyle: "fill"
    });

    gridShipmentLt.gridView.setColumnProperty("CONSUME_LOCAT_TP", "mergeRule", {
      criteria: "values[ 'CONSUME_LOCAT_TP' ]"
    });

    gridShipmentLt.gridView.setColumnProperty("CONSUME_LOCAT_LV", "mergeRule", {
      criteria: "values[ 'CONSUME_LOCAT_LV' ]"
    });

    gridShipmentLt.gridView.setColumnProperty("CONSUME_LOCAT_CD", "mergeRule", {
      criteria: "prevvalues + values[ 'CONSUME_LOCAT_CD' ]"
    });

    gridShipmentLt.gridView.setColumnProperty("CONSUME_LOCAT_NM", "mergeRule", {
      criteria: "prevvalues + values[ 'CONSUME_LOCAT_NM' ]"
    });

    gridShipmentLt.gridView.setColumnProperty("SUPPLY_LOCAT_TP", "mergeRule", {
      criteria: "values[ 'SUPPLY_LOCAT_TP' ]"
    });

    gridShipmentLt.gridView.setColumnProperty("SUPPLY_LOCAT_LV", "mergeRule", {
      criteria: "values[ 'SUPPLY_LOCAT_LV' ]"
    });

    gridShipmentLt.gridView.setColumnProperty("SUPPLY_LOCAT_CD", "mergeRule", {
      criteria: "values[ 'SUPPLY_LOCAT_CD' ]"
    });

    gridShipmentLt.gridView.setColumnProperty("SUPPLY_LOCAT_NM", "mergeRule", {
      criteria: "values[ 'SUPPLY_LOCAT_NM' ]"
    });

    gridShipmentLt.gridView.setFixedOptions({colCount: 2, resizable: true});
  }

  function onSubmit() {
    loadShipmentLt();
  };

  function refresh() {
    currentConsumeLocationRef.reset();
    currentSupplyLocationRef.reset();

    gridShipmentLt.dataProvider.clearRows();
  }

  function openPopupShipmentLtBundleCreate() {
    setPopupShipmentLtBundleCreate(true);
  }

  function openPopupShipmentLtGridNew() {
    setPopupShipmentLtGridNew(true);
  }

  function openPopupClose() {
    loadShipmentLt();
  }

  function loadShipmentLt() {
    let dataArr;
    let tabUrl;
    let param = new URLSearchParams();
        param.append("BOD_TYPE", "");
        param.append('CONSUME_LOCAT_TP', currentConsumeLocationRef.getLocationType());
        param.append('CONSUME_LOCAT_LV', currentConsumeLocationRef.getLocationLevel());
        param.append('CONSUME_LOCAT_CD', currentConsumeLocationRef.getLocationCode());
        param.append('CONSUME_LOCAT_NM', currentConsumeLocationRef.getLocationName());
        param.append("ACCOUNT_CD", "");
        param.append("ACCOUNT_NM", "");
        param.append('SUPPLY_LOCAT_TP', currentSupplyLocationRef.getLocationType());
        param.append('SUPPLY_LOCAT_LV', currentSupplyLocationRef.getLocationLevel());
        param.append('SUPPLY_LOCAT_CD', currentSupplyLocationRef.getLocationCode());
        param.append('SUPPLY_LOCAT_NM', currentSupplyLocationRef.getLocationName());
        param.append("VEHICL_TP", "");
        param.append("timeout", 0);
        param.append("CURRENT_OPERATION_CALL_ID", "OPC_GRID_LOAD");

        tabUrl = baseURI() + "engine/mp/SRV_UI_CM_07_Q1";

        zAxios({
          method: "post",
          header: { "content-type": "application/json" },
          url: tabUrl,
          data: param
        })
        .then(function (res) {
          if (res.status === gHttpStatus.SUCCESS) {
            dataArr = res.data.RESULT_DATA;

            gridShipmentLt.dataProvider.fillJsonData(dataArr);

            if (gridShipmentLt.dataProvider.getRowCount() == 0) {
              gridShipmentLt.gridView.setDisplayOptions({ showEmptyMessage: true, emptyMessage: transLangKey("MSG_NO_DATA") });
            }
          }
        })
        .catch(function (err) {
          console.log(err);
        });
  }

  function saveShipmentLt() {
    gridShipmentLt.gridView.commit(true);
    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridShipmentLt.dataProvider.getAllStateRows().created,
          gridShipmentLt.dataProvider.getAllStateRows().updated,
          gridShipmentLt.dataProvider.getAllStateRows().deleted,
          gridShipmentLt.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          changeRowData.push(gridShipmentLt.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"), { close: false });
        } else {
          if (answer) {
            let formData = new FormData();
            formData.append("changes", JSON.stringify(changeRowData));
            formData.append("USER_ID", username);
            formData.append("timeout", 0);
            formData.append("CURRENT_OPERATION_CALL_ID", "OPC_UI_CM_07_RST_CPT_01_08_CLICK_01");

            zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_07_S1",
            formData,
            {
              headers: {
                "Content-Type": "application/json"
              }
            })
            .then(function (response) {
              loadShipmentLt();
            })
            .catch(function (e) {
              console.error(e);
            });
          }
        }
      }
    });
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <LocationSearchBox ref={consumeLocationSearchBoxRef} keyValue={'locationName'} label={transLangKey("CONSUME_LOCAT")} placeHolder={transLangKey("LOCAT_NM")}/>
            <LocationSearchBox ref={supplyLocationSearchBoxRef} keyValue={'locationName'} label={transLangKey("SUPPLY_LOCAT")} placeHolder={transLangKey("LOCAT_NM")}/>
          </SearchRow>
        </SearchArea>

        <ButtonArea>
          <LeftButtonArea>
            <GridExcelExportButton type="icon" grid="gridShipmentLt" options={exportExceloptions} />
            {/*<GridExcelImportButton type="icon" grid="gridShipmentLt" />*/}
            <CommonButton title={transLangKey("BUNDLE_CREATE")} onClick={() => { openPopupShipmentLtBundleCreate() }}><Icon.File/></CommonButton>
          </LeftButtonArea>
          <RightButtonArea>
            <GridAddRowButton type="icon" onClick={() => { openPopupShipmentLtGridNew() }}></GridAddRowButton>
            <GridSaveButton type="icon" grid="gridShipmentLt" onClick={() => { saveShipmentLt() }}></GridSaveButton>
          </RightButtonArea>
        </ButtonArea>
        <Box style={{ height: "100%" }}>
          <BaseGrid id="gridShipmentLt" items={gridShipmentLtColumns}></BaseGrid>
        </Box>
      </ContentInner>

      {shipmentLtBundleCreatePopupOpen && (<PopShipmentLtBundleCreate open={shipmentLtBundleCreatePopupOpen} onClose={() => { setPopupShipmentLtBundleCreate(false); }} confirm={openPopupClose}></PopShipmentLtBundleCreate>)}
      {shipmentLtGridNewPopupOpen && (<PopShipmentLtGridNew open={shipmentLtGridNewPopupOpen} onClose={() => { setPopupShipmentLtGridNew(false); }} confirm={openPopupClose} data={popupData}></PopShipmentLtGridNew>)}
    </>
  )
}
export default ShipmentLt;
