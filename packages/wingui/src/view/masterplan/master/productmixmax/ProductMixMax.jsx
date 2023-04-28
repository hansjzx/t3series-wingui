import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { Box, Tab, Tabs } from '@mui/material';
import {
  ContentInner, SearchArea, SearchRow, ButtonArea, LeftButtonArea, RightButtonArea, GridExcelExportButton, GridAddRowButton, GridSaveButton,
  GridDeleteRowButton, InputField, BaseGrid, useUserStore, useViewStore, zAxios, CommonButton
} from '@zionex/wingui-core/src/common/imports';
import { setGridComboList } from "@wingui/view/supplychainmodel/common/common";

import PopItemClass from './PopItemClass';
import PopProductMixMaxBundleCreate from './PopProductMixMaxBundleCreate';
import PopProductMixMaxNew1 from './ProductMixMaxNew1';
import ItemSearchBox from '@wingui/view/supplychainmodel/common/ItemSearchBox';


let gridItemGroupColumns = [
  { name: 'PROD_MAX_ALLOC_MST_ID', dataType: 'text', headerText: 'PROD_MAX_ALLOC_MST_ID', visible: false, editable: false, width: '100' },
  { name: 'ITEM_SCOPE_NM', dataType: 'text', headerText: 'ITEM_SCOPE_NM', visible: true, editable: false, width: '100' },
  { name: 'ITEM_CLASS_VAL', dataType: 'text', headerText: 'ITEM_CLASS_VAL', visible: true, editable: false, width: '100' },
  { name: 'ITEM_CLASS_DESCRIP', dataType: 'text', headerText: 'DESCRIP', visible: true, editable: false, width: '100' },
  { name: 'CATAGY_VAL', dataType: 'text', headerText: 'CATAGY_VAL', visible: true, editable: false, width: '120', button: 'action', autoFilter: true },
  { name: 'ITEM_GRP', dataType: 'text', headerText: 'ITEM_GRP', visible: true, editable: false, width: '100' },
  { name: 'ITEM_GRP_DESCRIP', dataType: 'text', headerText: 'ITEM_GRP_DESCRIP', visible: true, editable: false, width: '150' },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: true, width: '100' },
  { name: 'CREATE_BY', dataType: 'text', headerText: 'CREATE_BY', visible: true, editable: false, width: '100' },
  { name: 'CREATE_DTTM', dataType: 'datetime', headerText: 'CREATE_DTTM', visible: true, editable: false, width: '100' },
  { name: 'MODIFY_BY', dataType: 'text', headerText: 'MODIFY_BY', visible: true, editable: false, width: '100' },
  { name: 'MODIFY_DTTM', dataType: 'datetime', headerText: 'MODIFY_DTTM', visible: true, editable: false, width: '100' }
];

let gridItemColumns = [
  { name: 'PROD_MAX_ALLOC_MST_ID', dataType: 'text', headerText: 'PROD_MAX_ALLOC_MST_ID', visible: false, editable: false, width: '100' },
  { name: 'ITEM_SCOPE_NM', dataType: 'text', headerText: 'ITEM_SCOPE_NM', visible: true, editable: false, width: '100' },
  { name: 'ITEM_CLASS_VAL', dataType: 'text', headerText: 'ITEM_CLASS_VAL', visible: true, editable: false, width: '100' },
  { name: 'ITEM_CLASS_DESCRIP', dataType: 'text', headerText: 'DESCRIP', visible: true, editable: false, width: '100' },
  { name: 'ITEM_GRP', dataType: 'text', headerText: 'ITEM_GRP', visible: true, editable: false, width: '100' },
  { name: 'ITEM_GRP_DESCRIP', dataType: 'text', headerText: 'ITEM_GRP_DESCRIP', visible: true, editable: false, width: '150' },
  { name: 'CATAGY_VAL', dataType: 'text', headerText: 'CATAGY_VAL', visible: true, editable: false, width: '120', button: 'action', autoFilter: true },
  { name: 'ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', visible: true, editable: false, width: '100' },
  { name: 'ITEM_NM', dataType: 'text', headerText: 'ITEM_NM', visible: true, editable: false, width: '100' },
  { name: 'ITEM_TP', dataType: 'text', headerText: 'ITEM_TP', visible: true, editable: false, width: '100' },
  { name: 'ITEM_UOM', dataType: 'text', headerText: 'ITEM_UOM', visible: true, editable: false, width: '100' },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: false, width: '100' },
  { name: 'CREATE_BY', dataType: 'text', headerText: 'CREATE_BY', visible: false, editable: false, width: '100' },
  { name: 'CREATE_DTTM', dataType: 'datetime', headerText: 'CREATE_DTTM', visible: false, editable: false, width: '100' },
  { name: 'MODIFY_BY', dataType: 'text', headerText: 'MODIFY_BY', visible: false, editable: false, width: '100' },
  { name: 'MODIFY_DTTM', dataType: 'datetime', headerText: 'MODIFY_DTTM', visible: false, editable: false, width: '100' }
];

let gridPeriodMaxLimitColumns = [
  { name: 'PRD_MAX_ALLOC_DTL_ID', dataType: 'text', headerText: 'PRD_MAX_ALLOC_DTL_ID', visible: false, editable: false, width: '100' },
  { name: 'STRT_DTTM', dataType: 'datetime', headerText: 'STRT_DTTM', visible: true, editable: true, width: '100', format: 'yyyy-MM-dd' },
  { name: 'END_DTTM', dataType: 'datetime', headerText: 'END_DTTM', visible: true, editable: true, width: '100', format: 'yyyy-MM-dd' },
  { name: 'CYCL_TP', dataType: 'text', headerText: 'CYCL_TP', visible: true, editable: true, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'MAX_ALLOC_CONST_TP', dataType: 'text', headerText: 'CONST_TP', visible: true, editable: true, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'MAX_PRDUCT_LIMIT', dataType: 'number', headerText: 'MAX_PRDUCT_LIMIT', visible: true, editable: true, width: '100' },
  { name: 'INTERVAL', dataType: 'number', headerText: 'INTERVAL', visible: true, editable: true, width: '100' },
  { name: 'BUCKET_LIMIT', dataType: 'boolean', headerText: 'BUCKET_LIMIT', visible: true, editable: true, width: '100' },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: true, width: '100' },
  { name: 'CREATE_BY', dataType: 'text', headerText: 'CREATE_BY', visible: true, editable: false, width: '100' },
  { name: 'CREATE_DTTM', dataType: 'datetime', headerText: 'CREATE_DTTM', visible: true, editable: false, width: '100' },
  { name: 'MODIFY_BY', dataType: 'text', headerText: 'MODIFY_BY', visible: true, editable: false, width: '100' },
  { name: 'MODIFY_DTTM', dataType: 'datetime', headerText: 'MODIFY_DTTM', visible: true, editable: false, width: '100' }
];

function ProductMixMax() {
  const [username] = useUserStore(state => [state.username]);
  const [gridItemGroup, setGridItemGroup] = useState(null);
  const [gridItem, setGridItem] = useState(null);
  const [gridPeriodMaxLimit, setGridPeriodMaxLimit] = useState(null);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const [prodMaxAllocMstId, setProdMaxAllocMstId] = useState("");

  const [itemClassPopupOpen, setPopupItemClass] = useState(false);
  const [productMixMaxBundleCreatePopupOpen, setPopupProductMixMaxBundleCreate] = useState(false);
  const [productMixMaxNew1PopupOpen, setPopupProductMixMaxNew1] = useState(false);
  const itemSearchBoxRef = useRef();

  const [currentItemRef, setCurrentItemRef] = useState();

  const [tabValue, setTabValue] = React.useState("tabItemGroupMaxMix");

  const { reset, getValues, setValue, control } = useForm({
    defaultValues: {
      itemClassVal: '',
      itemClassDescrip: ''
    }
  });

  const globalButtons = [
    { name: 'search', action: (e) => { onSubmit(tabValue) }, visible: true, disable: false },
    { name: 'refresh', action: (e) => { refresh() }, visible: true, disable: false }
  ]

  const exportExceloptions = {
    headerDepth: 1,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: true
  };

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, 'gridItemGroup');
    const grdObj2 = getViewInfo(vom.active, 'gridItem');
    const grdObj3 = getViewInfo(vom.active, 'gridPeriodMaxLimit');

    if (grdObj1) {
      if (grdObj1.dataProvider) {
        if (gridItemGroup !== grdObj1) {
          setGridItemGroup(grdObj1);
        }
      }
    }

    if (grdObj2) {
      if (grdObj2.dataProvider) {
        if (gridItem !== grdObj2)
          setGridItem(grdObj2);
      }
    }

    if (grdObj3) {
      if (grdObj3.dataProvider) {
        if (gridPeriodMaxLimit !== grdObj3)
          setGridPeriodMaxLimit(grdObj3);
      }
    }

    if (itemSearchBoxRef) {
      if (itemSearchBoxRef.current) {
        setCurrentItemRef(itemSearchBoxRef.current);
      }
    }
  }, [viewData]);

  useEffect(() => {
    async function initLoad() {
      if (gridItemGroup) {
        setViewInfo(vom.active, 'globalButtons', globalButtons);
        setOptionsGridItemGroup();

        await loadItemGroupMaxMix();
      }
    }

    initLoad();
  }, [gridItemGroup]);

  useEffect(() => {
    if (gridItem) {
      setOptionsGridItem();
    }
  }, [gridItem]);

  useEffect(() => {
    if (gridPeriodMaxLimit) {
      setOptionsGridPeriodMaxLimit();
    }
  }, [gridPeriodMaxLimit]);

  function setOptionsGridItemGroup() {
    setVisibleProps(gridItemGroup, true, true, true);

    gridItemGroup.gridView.setDisplayOptions({ fitStyle: 'fill' });

    gridItemGroup.gridView.setColumnProperty('ITEM_SCOPE_NM', 'mergeRule', { criteria: 'value' });

    let columnArr = ["ITEM_CLASS_VAL", "ITEM_CLASS_DESCRIP"];
    for (let i = 0; i < columnArr.length; i++) {
      gridItemGroup.gridView.setColumnProperty(columnArr[i], "mergeRule", {
        criteria: "prevvalues + values[ '" + columnArr[i] + "' ]"
      });
    }

    gridItemGroup.gridView.columnByName('CATAGY_VAL').buttonVisibility = 'always';

    gridItemGroup.gridView.onCellButtonClicked = function (grid, index, column) {
      setProdMaxAllocMstId(grid.getValues(index.itemIndex).PROD_MAX_ALLOC_MST_ID);
      loadPeriodMaxLimit(grid.getValues(index.itemIndex).PROD_MAX_ALLOC_MST_ID);
    }

    wingui.util.grid.sorter.orderBy(gridItemGroup.gridView, ['ITEM_SCOPE_NM', 'ITEM_CLASS_VAL', 'ITEM_CLASS_DESCRIP']);
  }

  function setOptionsGridItem() {
    setVisibleProps(gridItem, true, false, false);

    gridItem.gridView.setDisplayOptions({ fitStyle: 'fill' });

    gridItem.gridView.setColumnProperty('ITEM_SCOPE_NM', 'mergeRule', { criteria: 'value' });

    let columnArr = ["ITEM_CLASS_VAL", "ITEM_CLASS_DESCRIP", "ITEM_GRP", "ITEM_GRP_DESCRIP"];
    for (let i = 0; i < columnArr.length; i++) {
      gridItem.gridView.setColumnProperty(columnArr[i], "mergeRule", {
        criteria: "prevvalues + values[ '" + columnArr[i] + "' ]"
      });
    }

    gridItem.gridView.columnByName('CATAGY_VAL').buttonVisibility = 'always';

    gridItem.gridView.onCellButtonClicked = function (grid, index, column) {
        setProdMaxAllocMstId(grid.getValues(index.itemIndex).PROD_MAX_ALLOC_MST_ID);
        loadPeriodMaxLimit(grid.getValues(index.itemIndex).PROD_MAX_ALLOC_MST_ID);
    }

    wingui.util.grid.sorter.orderBy(gridItem.gridView, ['ITEM_SCOPE_NM', 'ITEM_CLASS_VAL', 'ITEM_CLASS_DESCRIP', 'ITEM_GRP', 'ITEM_GRP_DESCRIP']);
  }

  function setOptionsGridPeriodMaxLimit() {
    setVisibleProps(gridPeriodMaxLimit, true, true, true);

    gridPeriodMaxLimit.gridView.setDisplayOptions({ fitStyle: 'fill' });
    setGridComboList(gridPeriodMaxLimit, 'CYCL_TP, MAX_ALLOC_CONST_TP', 'CALENDAR_CYCL_TP, MAX_ALLOCATION_CONST_TYPE');
  }

  function onSubmit(activeTab) {
    if (activeTab === 'tabItemGroupMaxMix') {
      loadItemGroupMaxMix();
    } else if (activeTab === 'tabItemMaxMix') {
      loadItemMaxMix();
    }
  }

  function onSubmitItemGroupMaxMix() {
    loadItemGroupMaxMix();

    gridPeriodMaxLimit.dataProvider.clearRows();
  }

  function refresh() {
    reset();

    currentItemRef.reset();

    gridItemGroup.dataProvider.clearRows();
    gridItem.dataProvider.clearRows();
    gridPeriodMaxLimit.dataProvider.clearRows();
  }

  function openPopupItemClass() {
    setPopupItemClass(true);
  }

  function onSetItemClss(gridRow) {
    setValue('itemClassVal', gridRow.ITEM_CLASS_VAL);
    setValue('itemClassDescrip', gridRow.DESCRIP);
  }

  function openPopupProductMixMaxBundleCreate() {
    setPopupProductMixMaxBundleCreate(true);
  }

  function openPopupProductMixMaxNew1() {
    setPopupProductMixMaxNew1(true);
  }

  const tabChange = (event, newValue) => {
    setViewInfo(vom.active, 'globalButtons', [
      {
        name: "search",
        action: (e) => {
          onSubmit(newValue);
        },
        visible: true,
        disable: false,
      },
      {
        name: "refresh",
        action: (e) => {
          refresh();
        },
        visible: true,
        disable: false,
      }
    ]);

    setTabValue(newValue);
    gridPeriodMaxLimit.dataProvider.clearRows();
  };

  function loadItemGroupMaxMix() {
    let param = new URLSearchParams();

    param.append('CATAGY_VAL', '');
    param.append('ITEM_CLASS', getValues('itemClassVal'));
    param.append('ITEM_CLASS_DESCRIP', getValues('itemClassDescrip'));

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_16_Q1',
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridItemGroup.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function saveItemGroupMaxMix() {
    gridItemGroup.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridItemGroup.dataProvider.getAllStateRows().updated
        );

        changes.forEach(function (row) {
          changeRowData.push(gridItemGroup.dataProvider.getJsonRow(row));
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
              url: baseURI() + 'engine/mp/SRV_UI_MP_16_S1',
              data: formData
            })
              .then(function (res) {
                const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_16_S1_P_RT_MSG;
                showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false });

                if (res.status === gHttpStatus.SUCCESS) {
                  loadItemGroupMaxMix();
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

  function deleteItemGroupMaxMix(targetGrid, deleteRows) {
    let formData = new FormData();

    deleteRows.forEach(function (rowData) {
      if (rowData.CREATE_DTTM instanceof Date) {
        rowData.CREATE_DTTM = rowData.CREATE_DTTM.format("yyyy-MM-ddTHH:mm:ss");
      }
      if (rowData.MODIFY_DTTM instanceof Date) {
        rowData.MODIFY_DTTM = rowData.MODIFY_DTTM.format("yyyy-MM-ddTHH:mm:ss");
      }
    });

    formData.append('WRK_TYPE', 'DELETE');
    formData.append('checked', JSON.stringify(deleteRows));

    if (deleteRows.length > 0) {
      return zAxios({
        method: 'post',
        url: baseURI() + 'engine/mp/SRV_UI_MP_16_S1',
        headers: { 'Content-type': 'application/json' },
        data: formData
      })
    }
  }

  function loadItemMaxMix() {
    let param = new URLSearchParams();

    param.append('CATAGY_VAL', '');
    param.append('ITEM_CD', currentItemRef.getItemCode());
    param.append('ITEM_NM', currentItemRef.getItemName());
    param.append('ITEM_TP', currentItemRef.getItemType());
    param.append('ITEM_CLASS', getValues('itemClassVal'));
    param.append('ITEM_CLASS_DESCRIP', getValues('itemClassDescrip'));

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_16_Q2',
      data: param
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridItem.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function loadPeriodMaxLimit(prodMaxAllocMstId) {
    let formData = new FormData();

    formData.append('PROD_MAX_ALLOC_MST_ID', prodMaxAllocMstId);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_16_Q3',
      data: formData
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridPeriodMaxLimit.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function savePeriodMaxLimit() {
    gridPeriodMaxLimit.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];
        let flag = false;

        changes = changes.concat(
          gridPeriodMaxLimit.dataProvider.getAllStateRows().created,
          gridPeriodMaxLimit.dataProvider.getAllStateRows().updated,
          gridPeriodMaxLimit.dataProvider.getAllStateRows().deleted,
          gridPeriodMaxLimit.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          let rowData = gridPeriodMaxLimit.dataProvider.getJsonRow(row);

          if (rowData.CYCL_TP === undefined || rowData.CYCL_TP === "") {
            flag = true;
          }
          if (rowData.MAX_ALLOC_CONST_TP === undefined || rowData.MAX_ALLOC_CONST_TP === "") {
            flag = true;
          }
          if (rowData.MAX_PRDUCT_LIMIT === undefined || rowData.MAX_PRDUCT_LIMIT === "") {
            flag = true;
          }

          if (rowData.STRT_DTTM instanceof Date) {
            rowData.STRT_DTTM = rowData.STRT_DTTM.format("yyyy-MM-ddTHH:mm:ss");
          } else {
            flag = true;
          }
          if (rowData.END_DTTM instanceof Date) {
            rowData.END_DTTM = rowData.END_DTTM.format("yyyy-MM-ddTHH:mm:ss");
          } else {
            flag = true;
          }

          changeRowData.push(gridPeriodMaxLimit.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else if(flag) {
          showMessage('Information', transLangKey('MSG_0006'), { close: false });
        } else {
          let formData = new FormData();

          formData.append('WRK_TYPE', "SAVE");
          formData.append('PROD_MAX_ALLOC_MST_ID', prodMaxAllocMstId);
          formData.append('changes', JSON.stringify(changeRowData));
          formData.append('USER_ID', username);

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_UI_MP_16_S2',
            data: formData
          })
            .then(function (res) {
              const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_16_S2_P_RT_MSG;
              showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false });

              if (res.status === gHttpStatus.SUCCESS) {
                loadPeriodMaxLimit(prodMaxAllocMstId);
              }
            })
            .catch(function (e) {
              console.error(e);
            });
        }
      }
    });
  }

  function deletePeriodMaxLimit(targetGrid, deleteRows) {
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
    formData.append('checked', JSON.stringify(deleteRows));

    if (deleteRows.length > 0) {
      return zAxios({
        method: 'post',
        url: baseURI() + 'engine/mp/SRV_UI_MP_16_S2',
        headers: { 'Content-type': 'application/json' },
        data: formData
      })
    }
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <InputField type='action' name='itemClassVal' label={transLangKey('ITEM_CLASS_VAL')} title={transLangKey('SEARCH')} onClick={() => { openPopupItemClass() }} control={control}>
              <Icon.Search />
            </InputField>
            <InputField name="itemClassDescrip" label={transLangKey("DESCRIP")} control={control} />
            <ItemSearchBox ref={itemSearchBoxRef} keyValue={'itemName'} placeHolder={transLangKey("ITEM_CD")} style={{display: tabValue === 'tabItemGroupMaxMix' ? "none" : "inline-block"}}/>
          </SearchRow>
        </SearchArea>

        <Box style={{ height: "60%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tabValue} onChange={tabChange} indicatorColor="primary">
              <Tab label={transLangKey("ITEM_GRP")} value="tabItemGroupMaxMix" />
              <Tab label={transLangKey("ITEM_CD")} value="tabItemMaxMix" />
            </Tabs>
          </Box>

          {/* tabItemGroupMaxMix */}
          <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: tabValue === "tabItemGroupMaxMix" ? "block" : "none" }}>
            <ButtonArea>
              <LeftButtonArea>
                <GridExcelExportButton type='icon' grid='gridItemGroup' options={exportExceloptions} />
                {/*<GridExcelImportButton type='icon' grid='gridItemGroup' />*/}
                <CommonButton title={transLangKey("BUNDLE_CREATE")} onClick={() => { openPopupProductMixMaxBundleCreate() }}><Icon.File/></CommonButton>
              </LeftButtonArea>
              <RightButtonArea>
                <GridAddRowButton type="icon" onClick={() => { openPopupProductMixMaxNew1() }}></GridAddRowButton>
                <GridDeleteRowButton type="icon" grid="gridItemGroup" onDelete={deleteItemGroupMaxMix}></GridDeleteRowButton>
                <GridSaveButton type="icon" onClick={() => { saveItemGroupMaxMix() }}></GridSaveButton>
              </RightButtonArea>
            </ButtonArea>
            <Box style={{ height: 'calc(100% - 100px)' }}>
              <BaseGrid id='gridItemGroup' items={gridItemGroupColumns} />
            </Box>
          </Box>

          {/* tabItemMaxMix */}
          <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: tabValue === "tabItemMaxMix" ? "block" : "none" }}>
            <Box style={{ height: 'calc(100% - 53px)' }}>
              <BaseGrid id='gridItem' items={gridItemColumns} />
            </Box>
          </Box>
        </Box>

        <Box style={{ height: "40%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={'tabPeriodMaxLimit'} indicatorColor="primary">
              <Tab label={transLangKey("PERIOD_MAX_PROD_LIMIT")} value="tabPeriodMaxLimit" />
            </Tabs>
          </Box>

          {/* tabPeriodMaxLimit */}
          <Box sx={{ display: 'flex', height: '100%', flexDirection: 'column', alignContent: 'stretch', alignItems: 'stretch', display: "block" }}>
            <ButtonArea>
              <RightButtonArea>
                <GridAddRowButton type="icon" grid="gridPeriodMaxLimit"></GridAddRowButton>
                <GridDeleteRowButton type="icon" grid="gridPeriodMaxLimit" onDelete={deletePeriodMaxLimit}></GridDeleteRowButton>
                <GridSaveButton type="icon" onClick={() => { savePeriodMaxLimit() }}></GridSaveButton>
              </RightButtonArea>
            </ButtonArea>
            <Box style={{ height: 'calc(100% - 90px)' }}>
              <BaseGrid id='gridPeriodMaxLimit' items={gridPeriodMaxLimitColumns} />
            </Box>
          </Box>
        </Box>
      </ContentInner>
      {itemClassPopupOpen && (<PopItemClass open={itemClassPopupOpen} onClose={() => { setPopupItemClass(false); }} confirm={onSetItemClss}></PopItemClass>)}
      {productMixMaxBundleCreatePopupOpen && (<PopProductMixMaxBundleCreate open={productMixMaxBundleCreatePopupOpen} onClose={() => { setPopupProductMixMaxBundleCreate(false); }} confirm={onSubmitItemGroupMaxMix}></PopProductMixMaxBundleCreate>)}
      {productMixMaxNew1PopupOpen && (<PopProductMixMaxNew1 open={productMixMaxNew1PopupOpen} onClose={() => { setPopupProductMixMaxNew1(false); }} confirm={onSubmitItemGroupMaxMix}></PopProductMixMaxNew1>)}
    </>
  )
}

export default ProductMixMax;
