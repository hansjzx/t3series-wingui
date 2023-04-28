import React, { useState, useEffect, useRef } from "react";

import { useForm } from "react-hook-form";
import { Box } from "@mui/material";
import Pagination from "@zionex/wingui-core/src/component/Pagination";

import {
  ContentInner, SearchArea, SearchRow, ButtonArea, LeftButtonArea, RightButtonArea, GridExcelImportButton, GridExcelExportButton, 
  GridAddRowButton, GridSaveButton, CommonButton, BaseGrid, useViewStore, useUserStore, zAxios
} from "@zionex/wingui-core/src/common/imports";

import PopTransportationBundleCreate from "./PopTransportationBundleCreate";
import PopTransportationGridNew from "./PopTransportationGridNew"
import ItemSearchBox from '../common/ItemSearchBox';
import LocationSearchBox from '../common/LocationSearchBox';
import { setGridComboList } from "@wingui/view/supplychainmodel/common/common";

let gridTransportationColumns =
  [
    { name: "TRANSP_MGMT_MST_ID", dataType: "text", headerText: "TRANSP_MGMT_MST_ID", visible: false, editable: false, width: "100" },
    { name: "CONSUME_LOCAT_ITEM_ID", dataType: "text", headerText: "CONSUME_LOCAT_ITEM_ID", visible: false, editable: false, width: "100" },
    { name: "SUPPLY_LOCAT_ITEM_ID", dataType: "text", headerText: "SUPPLY_LOCAT_ITEM_ID", visible: false, editable: false, width: "100" },
    { name: "CONSUME_LOCAT_MGMT_ID", dataType: "text", headerText: "CONSUME_LOCAT_MGMT_ID", visible: false, editable: false, width: "100" },
    { name: "SUPPLY_LOCAT_MGMT_ID", dataType: "text", headerText: "SUPPLY_LOCAT_MGMT_ID", visible: false, editable: false, width: "100" },
    { name: "ITEM_MST_ID", dataType: "text", headerText: "ITEM_MST_ID", visible: false, editable: false, width: "100" },
    { name: "BOD_TP_ID", dataType: "text", headerText: "BOD_TP_ID", visible: false, editable: false, width: "100" },
    { name: "OUTBOUND_LT_MGMT_YN", dataType: "boolean", headerText: "OUTBOUND_LT_MGMT_YN", visible: false, editable: false, width: "100" },
    { name: "VOYAGE_LT_MGMT_YN", dataType: "boolean", headerText: "VOYAGE_LT_MGMT_YN", visible: false, editable: false, width: "100" },
    { name: "INBOUND_LT_MGMT_YN", dataType: "boolean", headerText: "INBOUND_LT_MGMT_YN", visible: false, editable: false, width: "100" },
    { name: "BOD_TP", dataType: "text", headerText: "BOD_TP", visible: false, editable: false, width: "100" },
    {
      name: "CONSUME", dataType: "group", orientation: "horizontal", headerText: "CONSUME", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
      childs: [
        { name: "CONSUME_LOCAT_TP", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "80", groupShowMode: "expand" },
        { name: "CONSUME_LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "80", groupShowMode: "expand" },
        { name: "CONSUME_LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "80", groupShowMode: "always" },
        { name: "CONSUME_LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "120", groupShowMode: "always" },
        { name: "CONSUME_ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: "80", groupShowMode: "always" },
        { name: "CONSUME_ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: "100", groupShowMode: "always" },
        { name: "CONSUME_ITEM_TP", dataType: "text", headerText: "ITEM_TP", visible: true, editable: false, width: "80", groupShowMode: "expand" },
        { name: "CONSUME_ITEM_UOM", dataType: "text", headerText: "UOM_NM", visible: true, editable: false, width: "80", groupShowMode: "expand" }
      ]
    },
    {
      name: "SUPPLY", dataType: "group", orientation: "horizontal", headerText: "SUPPLY", headerVisible: true, hideChildHeaders: false, expandable: true, expanded: false,
      childs: [
        { name: "SUPPLY_LOCAT_TP", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "80", groupShowMode: "expand" },
        { name: "SUPPLY_LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "80", groupShowMode: "expand" },
        { name: "SUPPLY_LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "80", groupShowMode: "always" },
        { name: "SUPPLY_LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "120", groupShowMode: "always" }
      ]
    },
    {
      name: "VEHICL_GROUP", dataType: "group", orientation: "horizontal", headerText: "VEHICL_GROUP", headerVisible: true, hideChildHeaders: false,
      childs: [
        { name: "BOD_LT_ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "60" },
        { name: "FIXED_YN", dataType: "boolean", headerText: "FIXED_YN", visible: true, editable: true, width: "60" },
        { name: "VEHICL_TP", dataType: "text", headerText: "VEHICL_TP", visible: true, editable: false, width: "100", autoFilter: true },
        { name: "BOD_PRIORITY", dataType: "number", headerText: "PRIORITY", visible: true, editable: true, width: "80" }
      ]
    },
    {
      name: "LEADTIME", dataType: "group", orientation: "horizontal", headerText: "LEADTIME", headerVisible: true, hideChildHeaders: false,
      childs: [
        { name: "OUTBOUND_LT", dataType: "number", headerText: "OUTBOUND_LT", visible: true, editable: false, width: "120" },
        { name: "VOYAGE_LT", dataType: "number", headerText: "VOYAGE_LT", visible: true, editable: true, width: "80" },
        { name: "INBOUND_LT", dataType: "number", headerText: "INBOUND_LT", visible: true, editable: false, width: "100" },
        { name: "TOTAL_LT", dataType: "number", headerText: "TOTAL_LT", visible: true, editable: false, width: "80" },
        { name: "LT_UOM", dataType: "text", headerText: "TIME_UOM_NM", visible: true, editable: true, width: "80", useDropdown: true,  lookupDisplay: true }
      ]
    },
    {
      name: "SHIPPING_LOT", dataType: "group", orientation: "horizontal", headerText: "SHIPPING_LOT", headerVisible: true, hideChildHeaders: false,
      childs: [
        { name: "LOAD_UOM_ID", dataType: "text", headerText: "LOAD_UOM_ID", visible: true, editable: true, width: "100", useDropdown: true,  lookupDisplay: true },
        { name: "TRANSP_LOTSIZE", dataType: "number", headerText: "TRANSP_LOTSIZE", visible: true, editable: true, width: "100" },
        { name: "UOM_QTY", dataType: "number", headerText: "UOM_QTY", visible: true, editable: false, width: "100" },
        { name: "PACKING_QTY", dataType: "number", headerText: "PACKING_QTY", visible: true, editable: false, width: "100" },
        { name: "PACKING_TP", dataType: "text", headerText: "PACKING_TP", visible: true, editable: false, width: "100" },
        { name: "PALLET_QTY", dataType: "number", headerText: "PALLET_QTY", visible: true, editable: false, width: "100" },
        { name: "PALLET_TP", dataType: "text", headerText: "PALLET_TP", visible: true, editable: false, width: "100" }
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

function Transportation() {
  const [diabledPagination, setDisabledPagination] = useState(true);
  const [username] = useUserStore(state => [state.username]);

  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const consumeLocationSearchBoxRef = useRef();
  const itemSearchBoxRef = useRef();
  const supplyLocationSearchBoxRef = useRef();

  const [currentConsumeLocationRef, setCurrentConsumeLocationRef] = useState();
  const [currentItemRef, setCurrentItemRef] = useState();
  const [currentSupplyLocationRef, setCurrentSupplyLocationRef] = useState();

  const [gridTransportation, setGridTransportation] = useState(null);

  const [transportationBundleCreatePopupOpen, setPopupTransportationBundleCreate] = useState(false);
  const [transportationGridNewPopupOpen, setPopupTransportationGridNew] = useState(false);
  const [popupData, setPopupData] = useState({});

  const globalButtons = [
    { name: 'search', action: (e) => { loadTransportation(1) }, visible: true, disable: false },
    { name: 'refresh', action: (e) => { refresh() }, visible: true, disable: false }
  ]

  const exportExceloptions = {
    headerDepth: 2,
    footer: "default",
    allColumns: true,
    lookupDisplay: true,
    separateRows: true
  };

  const [settings, setSettings] = useState({
    currentPage: 0,
    totalPages: 1,
    perPageSize: 30
  });

  const { reset, getValues, setValue, control } = useForm({
    defaultValues: {
    }
  });

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, "gridTransportation");
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        if (gridTransportation != grdObj1)
          setGridTransportation(grdObj1);
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
    if (gridTransportation) {
      setViewInfo(vom.active, "globalButtons", globalButtons);

      setOptionsGrid();
      setGridComboList(gridTransportation,
        'LT_UOM, LOAD_UOM_ID',
        'TIME_UOM, LOAD_UOM_TYPE'
        );
      loadTransportation(1);
    }
  }, [gridTransportation]);

  function refresh() {
    currentConsumeLocationRef.reset();
    currentItemRef.reset();
    currentSupplyLocationRef.reset();
    reset();
    gridTransportation.dataProvider.clearRows();
  }

  const setOptionsGrid = () => {
    setVisibleProps(gridTransportation, true, true, false);

    gridTransportation.gridView.setDisplayOptions({
      fitStyle: "fill"
    });

    gridTransportation.gridView.setFixedOptions({colCount: 2, resizable: true});

    const mergeColumns = [ "CONSUME_LOCAT_TP", "CONSUME_LOCAT_LV", "CONSUME_LOCAT_CD", "CONSUME_LOCAT_NM", "CONSUME_ITEM_CD", "CONSUME_ITEM_NM"];

    for (let i = 0; i < mergeColumns.length; i++) {
      gridTransportation.gridView.setColumnProperty(mergeColumns[i], "mergeRule", {
        criteria: "value"
      });
    }
  }

  function openPopupTransportationBundleCreate() {
    setPopupTransportationBundleCreate(true);
  }

  function openPopupTransportationGridNew() {
    setPopupTransportationGridNew(true);
  }

  function openPopupClose() {
    loadTransportation(settings.currentPage);
  }

  function loadTransportation(page) {
    let dataArr;
    let tabUrl = baseURI() + "engine/mp/SRV_UI_CM_10_Q1";
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
    param.append("VEHICL_TP", '');
    param.append("PAGE_NO", page - 1);
    param.append("PAGE_SIZE", settings.perPageSize);
    param.append("timeout", 0);
    param.append("CURRENT_OPERATION_CALL_ID", "OPC_GRID_LOAD");

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

          setDisabledPagination(false);
          gridTransportation.dataProvider.fillJsonData(dataArr);
          gridTransportation.gridView.setDisplayOptions({ showEmptyMessage: true, emptyMessage: transLangKey("MSG_NO_DATA") });
          setSettings({
            currentPage: page,
            totalPages: parseInt(dataArr[0].TOTAL_PAGES),
            perPageSize: settings.perPageSize
          });
        } else {
          setDisabledPagination(true)
          gridTransportation.dataProvider.clearRows();
          setSettings({
            currentPage: 0,
            totalPages: 0,
            perPageSize: settings.perPageSize
          });
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function saveTransportation() {
    gridTransportation.gridView.commit(true);
    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridTransportation.dataProvider.getAllStateRows().created,
          gridTransportation.dataProvider.getAllStateRows().updated,
          gridTransportation.dataProvider.getAllStateRows().deleted,
          gridTransportation.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          changeRowData.push(gridTransportation.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"), { close: false });
        } else {
          if (answer) {
            let formData = new FormData();
            formData.append("changes", JSON.stringify(changeRowData));
            formData.append("USER_ID", username);
            formData.append("timeout", 0);
            formData.append("CURRENT_OPERATION_CALL_ID", "OPC_UI_CM_10_RST_CPT_01_08_CLICK_01");

            zAxios.post(baseURI() + "engine/mp/SRV_UI_CM_10_S2", formData)
              .then(function (res) {
                if (res.status === gHttpStatus.SUCCESS) {
                  const rsData = res.data;
                  if (rsData.RESULT_SUCCESS) {
                    const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_10_S2_P_RT_MSG;
                    msg === "MSG_0001" ? loadTransportation(settings.currentPage) : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg)); 
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

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <LocationSearchBox ref={consumeLocationSearchBoxRef} keyValue={'locationName'} label={transLangKey("CONSUME_LOCAT")} placeHolder={transLangKey("LOCAT_NM")}/>
            <ItemSearchBox ref={itemSearchBoxRef} keyValue={'itemName'} placeHolder={transLangKey("ITEM_NM")}/>
            <LocationSearchBox ref={supplyLocationSearchBoxRef} keyValue={'locationName'} label={transLangKey("SUPPLY_LOCAT")} placeHolder={transLangKey("LOCAT_NM")}/>
          </SearchRow>
        </SearchArea>

        <ButtonArea>
          <LeftButtonArea>
            <GridExcelExportButton type="icon" grid="gridTransportation" options={exportExceloptions} />
            {/*<GridExcelImportButton type="icon" grid="gridTransportation" />*/}
            <CommonButton title={transLangKey("BUNDLE_CREATE")} onClick={() => { openPopupTransportationBundleCreate() }}><Icon.File/></CommonButton>
          </LeftButtonArea>
          <RightButtonArea>
            <GridAddRowButton type="icon" onClick={() => { openPopupTransportationGridNew() }}></GridAddRowButton>
            <GridSaveButton type="icon" grid="gridTransportation" onClick={() => { saveTransportation() }}></GridSaveButton>
          </RightButtonArea>
        </ButtonArea>
        <Box style={{ height: "100%" }}>
          <BaseGrid id="gridTransportation" items={gridTransportationColumns}></BaseGrid>
        </Box>
        <Pagination diabled={diabledPagination} onClick={loadTransportation} settings={settings} />
      </ContentInner>
      {transportationBundleCreatePopupOpen && (<PopTransportationBundleCreate open={transportationBundleCreatePopupOpen} onClose={() => { setPopupTransportationBundleCreate(false); }} confirm={openPopupClose} data={popupData}></PopTransportationBundleCreate>)}
      {transportationGridNewPopupOpen && (<PopTransportationGridNew open={transportationGridNewPopupOpen} onClose={() => { setPopupTransportationGridNew(false); }} confirm={openPopupClose} data={popupData}></PopTransportationGridNew>)}
    </>
  )
}

export default Transportation;
