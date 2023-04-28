import React, { useState, useEffect, useRef } from "react";
import {
  ContentInner, SearchArea, ButtonArea, LeftButtonArea, RightButtonArea, ResultArea, GridExcelExportButton,
  GridAddRowButton, GridDeleteRowButton, GridSaveButton, CommonButton, BaseGrid, useUserStore, useViewStore, zAxios
} from "@zionex/wingui-core/src/common/imports";
// import { setColorPickerRenderer, transLangKey } from "@wingui";

import PopLocationMaster from './PopLocationMaster';
import PopLocationMasterBundleCreate from './PopLocationBundleCreate';
import LocationSearchBox from '../common/LocationSearchBox';
import getHeaders from "@zionex/wingui-core/src/utils/getHeaders";
import { setGridComboList } from "@wingui/view/supplychainmodel/common/common";

let gridLocationColumns = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: 100 },
  { name: "CORPOR_ID", dataType: "text", headerText: "CORPOR_ID", visible: false, editable: false, width: 100 },
  { name: "CORPOR_NM", dataType: "text", headerText: "CORPOR_NM", visible: true, editable: false, width: 80 },
  { name: "LOC_DTL_ID", dataType: "text", headerText: "LOC_DTL_ID", visible: false, editable: false, width: 100 },
  { name: "LOC_MST_ID", dataType: "text", headerText: "LOC_MST_ID", visible: false, editable: false, width: 100 },
  {
    name: "LOCAT_TP", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: 80, button: "action",
    styleCallback: function () {
      let ret = {}
      ret.styleName = 'editable-text-column';
      return ret;
    },
  },
  { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: 80 },
  { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: true, width: 80 },
  { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: true, width: 130 },
  { name: "LOCAT_GRP_ID", dataType: "text", headerText: "LOCAT_GRP", visible: true, editable: true, width: 100 },
  { name: "BUSINESS_UNIT", dataType: "text", headerText: "BUSINESS_UNIT", visible: true, editable: true, width: 80 },
  { name: "IN_OUT_FLAG_ID", dataType: "dropdown", headerText: "IN_OUT_FLAG", visible: true, editable: true, width: 80, useDropdown: true, lookupDisplay: true },
  { name: "LGCY_PLANT_CD", dataType: "text", headerText: "LGCY_PLANT_CD", visible: true, editable: true, width: 120 },
  { name: "REGION_CD", dataType: "dropdown", headerText: "REGION", visible: true, editable: true, width: 120, useDropdown: true, lookupDisplay: true },
  { name: "COUNTRY_CD", dataType: "dropdown", headerText: "COUNTRY", visible: true, editable: true, width: 120, useDropdown: true, lookupDisplay: true },
  { name: "DISPLAY_COLOR", dataType: "text", headerText: "DISPLAY_COLOR", visible: true, editable: true, width: 100 },
  { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: 60 },
  { name: "OUTSRC_YN", dataType: "boolean", headerText: "OUTSRC_YN", visible: true, editable: true, width: 70 },
  { name: "DISCRT_YN", dataType: "boolean", headerText: "DISCRT_YN", visible: true, editable: true, width: 70 },
  {
    name: "PRDUCT_LOCAT_GROUP", dataType: "group", orientation: "horizontal", headerText: "PRDUCT_LOCAT", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "DIVISBL_YN", dataType: "boolean", headerText: "DIVISBL_YN", visible: true, editable: true, width: 70 },
      { name: "SEMI_PRDUCT_GI_USE_YN", dataType: "boolean", headerText: "SEMI_PRDUCT_GI_USE_YN", visible: true, editable: true, width: 120 },
      { name: "PLAN_RES_TP", dataType: "dropdown", headerText: "PLAN_RES_TP", visible: true, editable: true, width: 140, useDropdown: true, lookupDisplay: true },
      { name: "PLAN_RES_TP_NM", dataType: "text", headerText: "PLAN_RES_TP_NM", visible: false, editable: true, width: 130 }
    ]
  },
  {
    name: "SALES_GENER_LOCAT_GROUP", dataType: "group", orientation: "horizontal", headerText: "SALES_GENER_LOCAT", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "ACCOUNT_SHIPPING_YN", dataType: "boolean", headerText: "ACCOUNT_SHIPPING_YN", visible: true, editable: true, width: 110 },
      { name: "DEFAT_SHIPPING_TRANSP_TP", dataType: "dropdown", headerText: "DEFAT_SHIPPING_TRANSP_TP", visible: true, editable: true, width: 150, useDropdown: true, lookupDisplay: true },
      { name: "DEFAT_SHIPPING_TRANSP_TP_NM", dataType: "text", headerText: "DEFAT_SHIPPING_TRANSP_TP_NM", visible: false, editable: false, width: 150 },
      { name: "DEFAT_INCOTERMS_CD", dataType: "dropdown", headerText: "DEFAT_INCOTERMS_CD", visible: true, editable: true, width: 100, useDropdown: true, lookupDisplay: true },
      { name: "SALES_PROFIT_RATE", dataType: "number", headerText: "SALES_PROFIT_RATE", visible: true, editable: true, width: 120 }
    ]
  },
  {
    name: "STOCK_STRG_LOCAT_GROUP", dataType: "group", orientation: "horizontal", headerText: "STOCK_STRG_LOCAT", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "STOCK_ONHAND_TP", dataType: "dropdown", headerText: "STOCK_ONHAND_TP", visible: true, editable: true, width: 120, useDropdown: true, lookupDisplay: true },
      { name: "STOCK_ONHAND_TP_NM", dataType: "text", headerText: "STOCK_ONHAND_TP_NM", visible: false, editable: true, width: 150 },
      { name: "STOCK_ONHAND_YN", dataType: "boolean", headerText: "STOCK_ONHAND_YN", visible: true, editable: true, width: 100 },
      { name: "IMMEDIATE_SHIPMENT_YN", dataType: "boolean", headerText: "IMMEDIATE_SHIPMENT_YN", visible: true, editable: true, width: 80 },
      { name: "PO_PLAN_MODULE", dataType: "dropdown", headerText: "PO_PLAN_MODULE", visible: true, editable: true, width: 110, useDropdown: true, lookupDisplay: true }
    ]
  },
  {
    name: "FIXED_PLAN_POLICY_GROUP", dataType: "group", orientation: "horizontal", headerText: "FIXED_PLAN_POLICY", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: "STOCK_KEEPING_COST_RATE", dataType: "number", headerText: "STOCK_KEEPING_COST_RATE", visible: true, editable: true, width: 130 },
      { name: "FIXED_ROLL_PLAN_HORIZ", dataType: "number", headerText: "FIXED_ROLL_PRDUCT_PLAN_HORIZ", visible: true, editable: true, width: 160 },
      { name: "FIXED_ROLL_SHIPPING_PLAN_HORIZ", dataType: "number", headerText: "FIXED_ROLL_SHIPPING_PLAN_HORIZ", visible: true, editable: true, width: 160 },
      { name: "FIXED_REPLSH_PLAN_HORIZ", dataType: "number", headerText: "FIXED_REPLSH_PLAN_HORIZ", visible: false, editable: true, width: 180 },
      { name: "ADJT_PLAN_TP_ID", dataType: "dropdown", headerText: "ADJT_PLAN_TP", visible: true, editable: true, width: 140, useDropdown: true, lookupDisplay: true },
      { name: "FIXED_PRDUCT_ADJT_PLAN_HORIZ", dataType: "number", headerText: "FIXED_PRDUCT_ADJT_PLAN_HORIZ", visible: true, editable: true, width: 160 },
      { name: "FIXED_SHIPPING_ADJT_PLAN_HORIZ", dataType: "number", headerText: "FIXED_SHIPPING_ADJT_PLAN_HORIZ", visible: true, editable: true, width: 180 },
      { name: "TIME_UOM", dataType: "dropdown", headerText: "TIME_UOM", visible: true, editable: true, width: 80, useDropdown: true, lookupDisplay: true },
      { name: "PRDUCT_PLAN_ADJT_YN", dataType: "boolean", headerText: "PRDUCT_PLAN_ADJT_YN", visible: true, editable: true, width: 110 }
    ]
  },
  {
    name: "EDIT", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
    childs: [
      { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: 100, groupShowMode: "expand" },
      { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: 140, groupShowMode: "expand" },
      { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 100, groupShowMode: "always" },
      { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 140, groupShowMode: "expand" }
    ]
  }
];

function Site() {
  const [gridLocation, setGridLocation] = useState(null);
  const [username] = useUserStore(state => [state.username]);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo])
  const [bundleCreatePopupOpen, setBundleCreatePopupOpen] = useState(false);
  const [locationMasterPopupOpen, setlocationMasterPopupOpen] = useState(false);

  const locationSearchBoxRef = useRef();
  const [currentLocationRef, setCurrentLocationRef] = useState();

  const globalButtons = [
    { name: "search", action: (e) => { onSubmit() }, visible: true, disable: false },
    { name: "refresh", action: (e) => { refresh() }, visible: true, disable: false }
  ]

  const exportExceloptions = {
    headerDepth: 1,
    footer: "default",
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  }
  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, 'gridLocation');
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        if (gridLocation != grdObj1)
          setGridLocation(grdObj1);
      }
    }

    if (locationSearchBoxRef) {
      if (locationSearchBoxRef.current) {
        setCurrentLocationRef(locationSearchBoxRef.current);
      }
    }
  }, [viewData]);

  useEffect(() => {
    if (gridLocation) {
      setViewInfo(vom.active, 'globalButtons', globalButtons)

      setGridOption();
      setGridComboList(gridLocation,
        'IN_OUT_FLAG_ID, REGION_CD, COUNTRY_CD, PLAN_RES_TP, DEFAT_SHIPPING_TRANSP_TP, DEFAT_INCOTERMS_CD, STOCK_ONHAND_TP, PO_PLAN_MODULE, ADJT_PLAN_TP_ID, TIME_UOM',
        'IN_OUT_FLAG, CM_REGION, CM_COUNTRY, PLN_RES_TP, VEHICL_TP, INCOTERMS_CD, STOCK_LOCATION_MGMT_TP, PO_PLAN_MODULE, ADJUST_PLAN_TYPE, TIME_UOM'
        );
      loadLocation();
    }
  }, [gridLocation]);

  const onSubmit = () => {
    loadLocation();
  };

  const refresh = () => {
    currentLocationRef.reset();
    gridLocation.dataProvider.clearRows();
  }

  const setGridOption = () => {
    setVisibleProps(gridLocation, true, true, true);
    gridLocation.gridView.setEditOptions({
      insertable: true,
      appendable: true
    })
    gridLocation.gridView.displayOptions.fitStyle = "fill";

    gridLocation.gridView.setFixedOptions({ colCount: 5, resizable: true });

    gridLocation.gridView.setColumnProperty("CORPOR_NM", "mergeRule", { criteria: "value" });
    gridLocation.gridView.setColumnProperty("LOCAT_TP", "mergeRule", {
      criteria: "values[ 'CORPOR_NM' ] + values[ 'LOCAT_TP' ]"
    });
    gridLocation.gridView.setColumnProperty("LOCAT_LV", "mergeRule", {
      criteria: "values[ 'LOCAT_TP' ] + values[ 'LOCAT_LV' ]"
    });

    // setColorPickerRenderer(gridLocation.gridView, 'DISPLAY_COLOR');

    gridLocation.gridView.onCellButtonClicked = function (grid, itemIndex, column) {
      if (column.fieldName === "LOCAT_TP") {
        setlocationMasterPopupOpen(true);
      }
    }
  }

  const onSetGeneralconfig = (gridRow) => {
    let itemIndex = gridLocation.gridView.getCurrent().dataRow;

    if (gridLocation.dataProvider.getRowState(itemIndex) === "created") {
      gridLocation.dataProvider.setValue(itemIndex, 'LOC_DTL_ID', generateId())
    }
    gridLocation.dataProvider.setValue(itemIndex, 'CORPOR_ID', gridRow.CORPOR_ID)
    gridLocation.dataProvider.setValue(itemIndex, 'CORPOR_NM', gridRow.CORPOR_NM)
    gridLocation.dataProvider.setValue(itemIndex, 'LOC_MST_ID', gridRow.ID)
    gridLocation.dataProvider.setValue(itemIndex, 'LOCAT_TP', gridRow.LOCAT_TP_NM)
    gridLocation.dataProvider.setValue(itemIndex, 'LOCAT_LV', gridRow.LOCAT_LV)
    gridLocation.gridView.commit(true);
  }

  function loadLocation() {
    let param = new URLSearchParams();

    param.append('LOCAT_TP', currentLocationRef.getLocationType());
    param.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    param.append('LOCAT_CD', currentLocationRef.getLocationCode());
    param.append('LOCAT_NM', currentLocationRef.getLocationName());

    zAxios({
      method: 'post',
      headers: getHeaders({}, true),
      url: baseURI() + 'engine/mp/SRV_UI_CM_02_Q1',
      data: param
    }).then(function (res) {
      let dataArr = [];
      if (res.status === gHttpStatus.SUCCESS) {
        dataArr = res.data.RESULT_DATA;
        gridLocation.dataProvider.fillJsonData(dataArr);
      }
    }).catch(function (err) {
      console.log(err);
    });
  }

  function deleteLocation() {
    let checkedRow = gridLocation.gridView.getCheckedRows();

    if (checkedRow.length === 0) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SELECT_DELETE'), { close: false });
    } else {
      showMessage(transLangKey('DELETE'), transLangKey('MSG_DELETE'), function (answer) {
        if (answer) {
          let formData = new FormData();
          let checked = [];

          checkedRow.forEach(function (row) {
            checked.push(gridLocation.dataProvider.getJsonRow(row));
          });

          formData.append('WRK_TYPE', 'DELETE');
          formData.append('delete', JSON.stringify(checked));
          formData.append('USER_ID', username);

          zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_02_S1", formData)
            .then(function (res) {
              if (res.status === gHttpStatus.SUCCESS) {
                const rsData = res.data;
                if (rsData.RESULT_SUCCESS) {
                  const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_02_S1_P_RT_MSG;
                  msg === "MSG_0002" ? loadLocation() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg)); 
                } else {
                  showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
                }
              }
            })
            .catch(function (e) {
              console.error(e);
            });
        }
      });
    }
  }

  function saveData() {
    gridLocation.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changes = [];
        changes = changes.concat(
          gridLocation.dataProvider.getAllStateRows().created,
          gridLocation.dataProvider.getAllStateRows().updated,
          gridLocation.dataProvider.getAllStateRows().deleted,
          gridLocation.dataProvider.getAllStateRows().createAndDeleted
        );

        let changeRowData = [];
        changes.forEach(function (row) {
          changeRowData.push(gridLocation.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          let formData = new FormData();
          formData.append('changes', JSON.stringify(changeRowData));
          formData.append('USER_ID', username);
          formData.append('WRK_TYPE', 'SAVE');

          zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_02_S1", formData)
            .then(function (res) {
              if (res.status === gHttpStatus.SUCCESS) {
                const rsData = res.data;
                if (rsData.RESULT_SUCCESS) {
                  const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_02_S1_P_RT_MSG;
                  msg === "MSG_0001" ? loadLocation() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg)); 
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
    });
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <LocationSearchBox ref={locationSearchBoxRef} keyValue={'locationName'} placeHolder={transLangKey("LOCAT_NM")}/>
        </SearchArea>
        <ButtonArea>
          <LeftButtonArea>
            <GridExcelExportButton type="icon" grid="gridLocation" options={exportExceloptions} />
            <CommonButton title={transLangKey("BUNDLE_CREATE")} onClick={() => { setBundleCreatePopupOpen(true) }}><Icon.File /></CommonButton>
          </LeftButtonArea>
          <RightButtonArea>
            <GridAddRowButton type="icon" grid="gridLocation"></GridAddRowButton>
            <GridDeleteRowButton type="icon" grid="gridLocation" onClick={deleteLocation}></GridDeleteRowButton>
            <GridSaveButton type="icon" onClick={() => { saveData() }} />
          </RightButtonArea>
        </ButtonArea>
        <ResultArea>
          <BaseGrid id="gridLocation" items={gridLocationColumns}></BaseGrid>
        </ResultArea>
      </ContentInner>
      {bundleCreatePopupOpen && (<PopLocationMasterBundleCreate open={bundleCreatePopupOpen} onClose={() => { setBundleCreatePopupOpen(false); }} confirm={loadLocation}></PopLocationMasterBundleCreate>)}
      {locationMasterPopupOpen && (<PopLocationMaster open={locationMasterPopupOpen} onClose={() => { setlocationMasterPopupOpen(false); }} confirm={onSetGeneralconfig} confKey={"002"}></PopLocationMaster>)}
    </>
  )
}

export default Site
