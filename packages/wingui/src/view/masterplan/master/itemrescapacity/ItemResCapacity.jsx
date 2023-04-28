import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import {
  ContentInner, SearchArea, SearchRow, ButtonArea, LeftButtonArea, RightButtonArea, GridExcelExportButton, GridAddRowButton,
  GridSaveButton, GridDeleteRowButton, CommonButton, InputField, BaseGrid, useUserStore, useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';
import { setGridComboList } from "@wingui/view/supplychainmodel/common/common";

import ItemSearchBox from '@wingui/view/supplychainmodel/common/ItemSearchBox';
import LocationSearchBox from '@wingui/view/supplychainmodel/common/LocationSearchBox';
import PopCommResource from '@wingui/view/supplychainmodel/common/PopCommResource';

import PopItemResCapacityBundleCreate from './PopItemResCapacityBundleCreate';
import PopItemResCapacityNew1 from './PopItemResCapacityNew1';
import PopItemResCapacityNew2 from './PopItemResCapacityNew2';
import PopItemResCapacityBatchUpdate from './PopItemResCapacityBatchUpdate';

let gridCapacityColumns = [
  { name: 'ITEM_RES_CAPA_MST_ID', dataType: 'text', headerText: 'ITEM_RES_CAPA_MST_ID', visible: false, editable: false, width: '100', type: 'string' },
  { name: 'LOCATION_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'LOCAT', expandable: true, expanded: false,
    childs: [
      { name: 'LOCAT_TP', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: 120, groupShowMode: 'expand' },
      { name: 'LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: 120, groupShowMode: 'expand' },
      { name: 'LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: 120, groupShowMode: 'always' },
      { name: 'LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: 120, groupShowMode: 'always' },
      { name: 'PLAN_RES_TP', dataType: 'text', headerText: 'PLAN_RES_TP', visible: true, editable: false, width: 150, groupShowMode: 'always' }
    ]
  },
  { name: 'ITEM_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'ITEM', expandable: true, expanded: false,
    childs: [
      { name: 'ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', visible: true, editable: false, width: '80', groupShowMode: 'always' },
      { name: 'ITEM_NM', dataType: 'text', headerText: 'ITEM_NM', visible: true, editable: false, width: '120', groupShowMode: 'always' },
      { name: 'ITEM_DESCRIP', dataType: 'text', headerText: 'ITEM_DESCRIP', visible: false, editable: false, width: '100', groupShowMode: 'expand' },
      { name: 'ITEM_TP', dataType: 'text', headerText: 'ITEM_TP', visible: true, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'UOM', dataType: 'text', headerText: 'UOM_NM', visible: true, editable: false, width: '80', groupShowMode: 'expand' },
      { name: 'ITEM_PREF_ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: false, width: '50', groupShowMode: 'expand' }
    ]
  },
  { name: 'ROUTE_CD', dataType: 'text', headerText: 'ROUTE_CD', visible: true, editable: false, width: '80', type: 'string' },
  { name: 'ROUTE_DESCRIP', dataType: 'text', headerText: 'ROUTE_DESCRIP', visible: true, editable: false, width: '120', type: 'string' },
  { name: 'RES_CD', dataType: 'text', headerText: 'RES_CD', visible: true, editable: false, width: '80', button: 'action', type: 'string' },
  { name: 'RES_DESCRIP', dataType: 'text', headerText: 'RES_DESCRIP', visible: true, editable: false, width: '120', type: 'string' },
  { name: 'WC', dataType: 'text', headerText: 'WC', visible: true, editable: false, width: '80', type: 'string' },
  { name: 'BASE_TAC_TIME', dataType: 'group', orientation: 'horizontal', headerText: 'BASE_TAC_TIME', expandable: false, expanded: false,
    childs: [
      { name: 'TACT_TIME', dataType: 'number', headerText: 'TACT_TIME', visible: true, editable: true, width: '150' },
      { name: 'TACT_TIME_UOM_NM', dataType: 'text', headerText: 'TACT_TIME_UOM_NM', visible: true, editable: true, width: '80', useDropdown: true, lookupDisplay: true }
    ]
  },
  { name: 'BASE_PRODTY', dataType: 'group', orientation: 'horizontal', headerText: 'BASE_PRODTY', expandable: false, expanded: false,
    childs: [
      { name: 'PRODTY', dataType: 'number', headerText: 'PRODTY', visible: true, editable: true, width: '80' },
      { name: 'PRODTY_TIME_UOM_NM', dataType: 'text', headerText: 'PRODTY_TIME_UOM_NM', visible: true, editable: true, width: '80', useDropdown: true, lookupDisplay: true }
    ]
  },
  { name: 'CYCLE_TIME', dataType: 'group', orientation: 'horizontal', headerText: 'CYCLE_TIME', expandable: false, expanded: false,
    childs: [
      { name: 'QUEUE_TIME', dataType: 'number', headerText: 'QUEUE_TIME', visible: true, editable: true, width: '80' },
      { name: 'SETUP_TIME', dataType: 'number', headerText: 'SETUP_TIME', visible: true, editable: true, width: '80' },
      { name: 'PROCESS_TIME', dataType: 'number', headerText: 'PROCESS_TIME', visible: true, editable: true, width: '120' },
      { name: 'WAIT_TIME', dataType: 'number', headerText: 'WAIT_TIME', visible: true, editable: true, width: '80' },
      { name: 'CYCL_TIME_UOM_NM', dataType: 'text', headerText: 'CYCL_TIME_UOM_NM', visible: true, editable: true, width: '80', useDropdown: true, lookupDisplay: true }
    ]
  },
  { name: 'BASE_LOT_SIZE', dataType: 'group', orientation: 'horizontal', headerText: 'BASE_LOT_SIZE', expandable: false, expanded: false,
    childs: [
      { name: 'LOT_PRDUCT_YN', dataType: 'boolean', headerText: 'LOT_PRDUCT_YN', visible: true, editable: true, width: '120' },
      { name: 'MIN_LOTSIZE', dataType: 'number', headerText: 'MIN_LOTSIZE', visible: true, editable: false, width: '120',
        styleCallback: function (grid, dataCell) {
          let lotPrductYn = grid.getValue(dataCell.index.itemIndex, 'LOT_PRDUCT_YN');
          return { editable: lotPrductYn, styleName: (lotPrductYn) ? 'editable-number-column' : 'number-column' };
        }
      },
      { name: 'MAX_LOTSIZE', dataType: 'number', headerText: 'MAX_LOTSIZE', visible: true, editable: false, width: '120',
      styleCallback: function (grid, dataCell) {
        let lotPrductYn = grid.getValue(dataCell.index.itemIndex, 'LOT_PRDUCT_YN');
        return { editable: lotPrductYn, styleName: (lotPrductYn) ? 'editable-number-column' : 'number-column' };
      } },
      { name: 'OVR_MIN_LOTSIZE', dataType: 'number', headerText: 'OVR_MIN_LOTSIZE', visible: true, editable: false, width: '130',
      styleCallback: function (grid, dataCell) {
        let lotPrductYn = grid.getValue(dataCell.index.itemIndex, 'LOT_PRDUCT_YN');
        return { editable: lotPrductYn, styleName: (lotPrductYn) ? 'editable-number-column' : 'number-column' };
      } },
      { name: 'MULTP_LOTSIZE', dataType: 'number', headerText: 'MULTP_LOTSIZE', visible: true, editable: false, width: '130',
      styleCallback: function (grid, dataCell) {
        let lotPrductYn = grid.getValue(dataCell.index.itemIndex, 'LOT_PRDUCT_YN');
        return { editable: lotPrductYn, styleName: (lotPrductYn) ? 'editable-number-column' : 'number-column' };
      } }
    ]
  },
  { name: 'RES_CAPA_ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: true, width: '60' },
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

let gridPeriodColumns = [
  { name: 'ITEM_RES_CAPA_MST_ID', dataType: 'text', headerText: 'ITEM_RES_CAPA_MST_ID', visible: false, editable: false, width: '100' },
  { name: 'LOCAT_TP', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: '100' },
  { name: 'LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: '100' },
  { name: 'LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: '100' },
  { name: 'LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: '120' },
  { name: 'ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', visible: true, editable: false, width: '120' },
  { name: 'ITEM_NM', dataType: 'text', headerText: 'ITEM_NM', visible: true, editable: false, width: '120' },
  { name: 'ITEM_DESCRIP', dataType: 'text', headerText: 'ITEM_DESCRIP', visible: true, editable: false, width: '120' },
  { name: 'RES_CD', dataType: 'text', headerText: 'RES_CD', visible: true, editable: false, width: '120' },
  { name: 'RES_DESCRIP', dataType: 'text', headerText: 'RES_DESCRIP', visible: true, editable: false, width: '120' },
  { name: 'CATEGORY_GROUP', dataType: 'text', headerText: 'CATEGORY_GROUP', visible: true, editable: false, width: '120' },
  { name: 'CATEGORY', dataType: 'text', headerText: 'RST_MEASURE_TP_NM', visible: true, editable: false, width: '120', lang: true },
  { name: 'STRT_DTTM', dataType: 'number', visible: true, editable: true, width: '80', iteration: { prefix: "STRT_DTTM_", prefixRemove: "true" } }
];

function ItemResCapacity() {
  const [username] = useUserStore(state => [state.username]);
  const [gridCapacity, setGridCapacity] = useState(null);
  const [gridPeriod, setGridPeriod] = useState(null);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [selectData, setSelectData] = useState({});

  const locationSearchBoxRef = useRef();
  const [currentLocationRef, setCurrentLocationRef] = useState();

  const itemSearchBoxRef = useRef();
  const [currentItemRef, setCurrentItemRef] = useState();

  const [resourcePopupOpen, setPopResource] = useState(false);

  const [itemResCapacityBundleCreatePopupOpen, setPopupItemResCapacityBundleCreate] = useState(false);
  const [itemResCapacityNew1PopupOpen, setPopupItemResCapacityNew1] = useState(false);
  const [itemResCapacityNew2PopupOpen, setPopupItemResCapacityNew2] = useState(false);
  const [batchUpdatePopupOpen, setPopupBatchUpdate] = useState(false);

  const { reset, getValues, setValue, control } = useForm({
    defaultValues: {
      resCd: "",
      resDescrip: ""
    }
  });

  const exportExceloptions = {
    headerDepth: 2,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: true
  };

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, 'gridCapacity');
    const grdObj2 = getViewInfo(vom.active, 'gridPeriod');

    if (grdObj1) {
      if (grdObj1.dataProvider) {
        if (gridCapacity !== grdObj1) {
          setGridCapacity(grdObj1);
        }
      }
    }

    if (grdObj2) {
      if (grdObj2.dataProvider) {
        if (gridPeriod !== grdObj2)
          setGridPeriod(grdObj2);
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
    setViewInfo(vom.active, 'globalButtons', [
      { name: 'search', action: (e) => { loadResCapacity(); }, visible: true, disable: false },
      { name: 'refresh', action: (e) => { refresh(); }, visible: true, disable: false }
    ]);

    async function initLoad() {
      if (gridCapacity) {
        setOptionsGridCapacity();

        await loadResCapacity();
      }
    }

    initLoad();
  }, [gridCapacity]);

  function setOptionsGridCapacity() {
    setVisibleProps(gridCapacity, true, true, true);

    gridCapacity.gridView.setDisplayOptions({ fitStyle: 'fill' });

    gridCapacity.gridView.setFixedOptions({ colCount: 2, resizable: true });

    gridCapacity.gridView.setColumnProperty("LOCAT_TP", "mergeRule", { criteria: "value" });

    let columnArr = ["LOCAT_LV", "LOCAT_CD", "LOCAT_NM", "PLAN_RES_TP"];
    for (let i = 0; i < columnArr.length; i++) {
      gridCapacity.gridView.setColumnProperty(columnArr[i], "mergeRule", {
        criteria: "prevvalues + values[ '" + columnArr[i] + "' ]"
      });
    }

    gridCapacity.gridView.onDataLoadComplated = function () {
      gridCapacity.gridView.setFocus();
    }

    gridCapacity.gridView.setColumnProperty("RES_CD", "buttonVisibility", "always");

    gridCapacity.gridView.onCellButtonClicked = function (grid, index, column) {
      if (column.fieldName === "RES_CD") {
        setSelectData(grid.getValues(index.itemIndex).ITEM_RES_CAPA_MST_ID);
        loadPeriodCapacity(grid.getValues(index.itemIndex).ITEM_RES_CAPA_MST_ID);
      }
    }

    setGridComboList(gridCapacity, 'TACT_TIME_UOM_NM, PRODTY_TIME_UOM_NM, CYCL_TIME_UOM_NM', 'TIME_UOM, TIME_UOM, TIME_UOM');
  }

  function setOptionsGridPeriod() {
    setVisibleProps(gridPeriod, true, true, false);

    gridPeriod.gridView.setDisplayOptions({ fitStyle: 'fill' });

    gridPeriod.gridView.setFixedOptions({ colCount: 8, resizable: true });

    let columnArr = ["LOCAT_TP", "LOCAT_LV", "LOCAT_CD", "LOCAT_NM", "ITEM_CD", "ITEM_NM", "RES_CD", "RES_DESCRIP"];
    for (let i = 0; i < columnArr.length; i++) {
      gridPeriod.gridView.setColumnProperty(columnArr[i], "mergeRule", { criteria: "value" });
    }
  }

  function onSubmit() {
    loadResCapacity();
  }

  function onSubmit2() {
    loadPeriodCapacity(selectData.ITEM_RES_CAPA_MST_ID);
  }

  function refresh() {
    currentLocationRef.reset();
    currentItemRef.reset();
    reset();
    gridCapacity.dataProvider.clearRows();
    gridPeriod.dataProvider.clearRows();
  }

  function openPopupResource() {
    setPopResource(true);
  }

  function onSetResource(gridRow) {
    setValue("resCd", gridRow.RES_CD);
    setValue("resDescrip", gridRow.DESCRIP === null ? '' : gridRow.RES_DESCRIP);
  }

  function openPopupItemResCapaCityBundleCreate() {
    setPopupItemResCapacityBundleCreate(true);
  }

  function openPopupItemResCapaCityNew1() {
    setPopupItemResCapacityNew1(true);
  }

  function openPopupItemResCapaCityNew2() {
    gridCapacity.gridView.commit(true);
    setSelectData(gridCapacity.gridView.getValues(gridCapacity.gridView.getCurrent().itemIndex));

    setPopupItemResCapacityNew2(true);
  }

  function openPopupBatchUpdate() {
    gridCapacity.gridView.commit(true);
    setSelectData(gridCapacity.gridView.getValues(gridCapacity.gridView.getCurrent().itemIndex));

    setPopupBatchUpdate(true);
  }

  function loadResCapacity() {
    let formData = new FormData();
    formData.append('LOCAT_TP', currentLocationRef.getLocationType());
    formData.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    formData.append('LOCAT_CD', currentLocationRef.getLocationCode());
    formData.append('LOCAT_NM', currentLocationRef.getLocationName());
    formData.append('ITEM_CD', currentItemRef.getItemCode());
    formData.append('ITEM_NM', currentItemRef.getItemName());
    formData.append("ITEM_TP", currentItemRef.getItemType());
    formData.append("ROUTE_CD", '');
    formData.append("ROUTE_DESCRIP", '');
    formData.append("RES_CD", getValues("resCd"));
    formData.append("RES_DESCRIP", getValues("resDescrip"));

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_09_Q1',
      data: formData
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridCapacity.setData(res.data.RESULT_DATA);
        gridPeriod.dataProvider.clearRows();
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function saveResCapacity() {
    gridCapacity.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridCapacity.dataProvider.getAllStateRows().created,
          gridCapacity.dataProvider.getAllStateRows().updated,
          gridCapacity.dataProvider.getAllStateRows().deleted,
          gridCapacity.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          let rowData = gridCapacity.dataProvider.getJsonRow(row);

          if (rowData.STRT_DTTM instanceof Date) {
            rowData.STRT_DTTM = rowData.STRT_DTTM.format("yyyy-MM-ddTHH:mm:ss");
          }
          if (rowData.END_DTTM instanceof Date) {
            rowData.END_DTTM = rowData.END_DTTM.format("yyyy-MM-ddTHH:mm:ss");
          }

          changeRowData.push(rowData);
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          if (answer) {
            let formData = new FormData();
            formData.append('WRK_TYPE', 'SAVE');
            formData.append('changes', JSON.stringify(changeRowData));
            formData.append('USER_ID', username);

            zAxios({
              method: 'post',
              url: baseURI() + 'engine/mp/SRV_UI_MP_09_S1',
              data: formData
            })
            .then(function (res) {
              const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_09_S1_P_RT_MSG;
              showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false });

              if (res.status === gHttpStatus.SUCCESS) {
                loadResCapacity();
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

  function deleteResCapacity(targetGrid, deleteRows) {
    let formData = new FormData();

    deleteRows.forEach(function (rowData) {
      if (rowData.CREATE_DTTM instanceof Date) {
        rowData.CREATE_DTTM = rowData.CREATE_DTTM.format("yyyy-MM-ddTHH:mm:ss");
      }
      if (rowData.MODIFY_DTTM instanceof Date) {
        rowData.MODIFY_DTTM = rowData.MODIFY_DTTM.format("yyyy-MM-ddTHH:mm:ss");
      }
    });

    formData.append('WRK_TYPE', "DELETE");
    formData.append('changes', JSON.stringify(deleteRows));
    formData.append('USER_ID', username);

    if (deleteRows.length > 0) {
      return zAxios({
        method: 'post',
        url: baseURI() + 'engine/mp/SRV_UI_MP_09_S1',
        headers: { 'Content-type': 'application/json' },
        data: formData
      })
    }

    gridPeriod.dataProvider.clearRows();
  }

  function loadPeriodCapacity(itemResCapaMstId) {
    let formData = new FormData();
    formData.append("ITEM_RES_CAPA_MST_ID", itemResCapaMstId);
    formData.append("CROSSTAB", JSON.stringify(gridPeriod.gridView.crossTabInfo));

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_09_Q2',
      data: formData
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridPeriod.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      setOptionsGridPeriod();
    })
  }

  function savePeriodCapacity() {
    gridPeriod.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changes = gridPeriod.dataProvider.getJsonRows(0, -1);

        if (changes.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          if (answer) {
            changes.forEach(function (row) {
              Object.keys(row).forEach(function (key) {
                if (row[key] === undefined) {
                  row[key] = null;
                }
              });
            });

            let formData = new FormData();

            formData.append('changes', JSON.stringify(changes));
            formData.append('USER_ID', username);
            formData.append('REVERSE_TARGET', 'changes');
            formData.append('CROSSTAB', JSON.stringify(gridPeriod.gridView.crossTabInfo));

            zAxios({
              method: 'post',
              url: baseURI() + 'engine/mp/SRV_UI_MP_09_S2',
              data: formData
            })
            .then(function (res) {
              const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_09_S2_P_RT_MSG;
              showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false });

              if (res.status === gHttpStatus.SUCCESS) {
                loadPeriodCapacity(selectData);
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
            <LocationSearchBox ref={locationSearchBoxRef} keyValue={'locationName'} placeHolder={transLangKey("LOCAT_NM")} style={{width: 300}}/>
            <ItemSearchBox ref={itemSearchBoxRef} keyValue={'itemName'} placeHolder={transLangKey("ITEM_NM")} style={{width: 300}}/>
            <InputField type="action" name="resCd" label={transLangKey("RES_CD")} title={transLangKey("SEARCH")} onClick={() => { openPopupResource() }} control={control}>
              <Icon.Search />
            </InputField>
            <InputField name="resDescrip" label={transLangKey("RES_DESCRIP")} control={control} />
          </SearchRow>
        </SearchArea>

        <Box style={{ height: "60%" }}>
          <ButtonArea>
            <LeftButtonArea>
              <GridExcelExportButton type="icon" grid="gridCapacity" options={exportExceloptions} />
              {/*<GridExcelImportButton type="icon" grid="gridCapacity" />*/}
              <CommonButton title={transLangKey("BUNDLE_CREATE")} onClick={() => { openPopupItemResCapaCityBundleCreate() }}><Icon.File/></CommonButton>
            </LeftButtonArea>
            <RightButtonArea>
              <GridAddRowButton type="icon" onClick={() => { openPopupItemResCapaCityNew1() }}></GridAddRowButton>
              <GridDeleteRowButton type="icon" grid="gridCapacity" onDelete={deleteResCapacity}></GridDeleteRowButton>
              <GridSaveButton type="icon" onClick={() => { saveResCapacity() }}></GridSaveButton>
            </RightButtonArea>
          </ButtonArea>
          <Box style={{ height: "calc(100% - 53px)" }}>
            <BaseGrid id="gridCapacity" items={gridCapacityColumns} />
          </Box>
        </Box>

        <Box style={{ height: "40%" }}>
          <ButtonArea>
            <LeftButtonArea>
              <CommonButton title={transLangKey("BATCH_UPDATE")} onClick={() => { openPopupBatchUpdate() }}><Icon.Database/></CommonButton>
            </LeftButtonArea>
            <RightButtonArea>
              <GridAddRowButton type="icon" onClick={() => { openPopupItemResCapaCityNew2() }}></GridAddRowButton>
              <GridSaveButton type="icon" onClick={() => { savePeriodCapacity() }}></GridSaveButton>
            </RightButtonArea>
          </ButtonArea>
          <Box style={{ height: "calc(100% - 53px)" }}>
            <BaseGrid id="gridPeriod" items={gridPeriodColumns} viewCd="UI_MP_09" gridCd="UI_MP_09-RST_CPT_02" />
          </Box>
        </Box>
      </ContentInner>
      {resourcePopupOpen && (<PopCommResource open={resourcePopupOpen} onClose={() => { setPopResource(false); }} confirm={onSetResource}></PopCommResource>)}
      {itemResCapacityBundleCreatePopupOpen && (<PopItemResCapacityBundleCreate open={itemResCapacityBundleCreatePopupOpen} onClose={() => { setPopupItemResCapacityBundleCreate(false); }} confirm={onSubmit}></PopItemResCapacityBundleCreate>)}
      {itemResCapacityNew1PopupOpen && (<PopItemResCapacityNew1 open={itemResCapacityNew1PopupOpen} onClose={() => { setPopupItemResCapacityNew1(false); }} confirm={onSubmit}></PopItemResCapacityNew1>)}
      {itemResCapacityNew2PopupOpen && (<PopItemResCapacityNew2 open={itemResCapacityNew2PopupOpen} onClose={() => { setPopupItemResCapacityNew2(false); }} confirm={onSubmit2} data={selectData}></PopItemResCapacityNew2>)}
      {batchUpdatePopupOpen && (<PopItemResCapacityBatchUpdate open={batchUpdatePopupOpen} onClose={() => { setPopupBatchUpdate(false); }} confirm={onSubmit2} data={selectData}></PopItemResCapacityBatchUpdate>)}
    </>
  )
}

export default ItemResCapacity;
