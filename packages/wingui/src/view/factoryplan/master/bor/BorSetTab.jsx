import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useForm } from "react-hook-form";
import { Box, Button } from "@mui/material";
import { InputField, BaseGrid, ButtonArea, ResultArea, LeftButtonArea, RightButtonArea, GridDeleteRowButton, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';
import {fpCommonStyles, setEditableGrid, setGridComboList, setNoneEditableGrid} from "../../common/common";
import { transLangKey, showMessage } from "@wingui";

import '../../common/common.css';

const viewBorGridFilters = ['itemCode', 'itemName', 'itemClassCode', 'inventoryCode', 'inventoryName', "routeCode", 'routeName', 'resourceCode', 'resourceName'];
const borResourceGridFilters = ['resourceCode', 'resourceName'];
const borSetGridFilters = [];

const viewBorGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 50, textAlignment: "center" },
  {
    name: "groupCode", dataType: "group", orientation: "horizontal", headerText: "FP_ITEM_DETAIL", expandable: true, expanded: false,
    childs: [
      { name: "itemCode", dataType: "text", headerText: "FP_ITEM_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true, groupShowMode: "expand",
        mergeRule: { criteria: "value"}
      },
      { name: "itemName", dataType: "text", headerText: "FP_ITEM_NM", visible: true, editable: false, width: 200, textAlignment: "near", autoFilter: true, groupShowMode: "expand",
        mergeRule: { criteria: "value"}
      },
      { name: "itemClassCode", dataType: "text", headerText: "FP_ITEM_CLASS_CD", visible: true, editable: false, width: 80, textAlignment: "center", autoFilter: true, groupShowMode: "expand", lookupDisplay: true,
        mergeRule: { criteria: "value"}
      },
      { name: "inventoryCode", dataType: "text", headerText: "FP_INVENTORY_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true, groupShowMode: "expand",
        mergeRule: { criteria: "value"}
      },
      { name: "inventoryName", dataType: "text", headerText: "FP_INVENTORY_NAME", visible: true, editable: false, width: 200, textAlignment: "near", autoFilter: true, groupShowMode: "expand",
        mergeRule: { criteria: "value"}
      },
      { name: "routeCode", dataType: "text", headerText: "FP_ROUTE_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true, groupShowMode: "always",
        validRules: [{ criteria: "required" }]
      },
      { name: "routeName", dataType: "text", headerText: "FP_ROUTE_NM", visible: true, editable: false, width: 200, textAlignment: "near", autoFilter: true, groupShowMode: "always" },
    ]
  },

  { name: "resourceCode", dataType: "text", headerText: "FP_RESOURCE_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true },
  { name: "resourceName", dataType: "text", headerText: "FP_RESOURCE_NM", visible: true, editable: false, width: 200, textAlignment: "near", autoFilter: true },
  { name: "descTxt", dataType: "text", headerText: "FP_DESC_TXT", visible: true, editable: false, width: 80, textAlignment: "near" },
  {
    name: "groupAudit", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", expandable: true, expanded: false,
    childs: [
      { name: "updatedBy", dataType: "text", headerText: "FP_UPDATED_BY", visible: true, editable: false, width: 80, textAlignment: "center", groupShowMode: "expand" },
      { name: "updatedAt", dataType: "datetime", headerText: "FP_UPDATED_AT", visible: true, editable: false, width: 125, textAlignment: "center", groupShowMode: "always" },
      { name: "createdBy", dataType: "text", headerText: "FP_CREATED_BY", visible: true, editable: false, width: 80, textAlignment: "center", groupShowMode: "expand" },
      { name: "createdAt", dataType: "datetime", headerText: "FP_CREATED_AT", visible: true, editable: false, width: 125, textAlignment: "center", groupShowMode: "expand" },
    ]
  },
];


const borResourceGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 50, textAlignment: "center" },
  { name: "routeCode", dataType: "text", headerText: "FP_ROUTE_CD", visible: false, editable: false, width: 150, textAlignment: "near" },
  { name: "resourceCode", dataType: "text", headerText: "FP_RESOURCE_CD", visible: true, editable: false, width: 150, textAlignment: "near" },
  { name: "resourceName", dataType: "text", headerText: "FP_RESOURCE_NM", visible: true, editable: false, width: 200, textAlignment: "near" },
  { name: "resourceDescTxt", dataType: "text", headerText: "FP_DESC_TXT", visible: true, editable: false, width: 80, textAlignment: "near" },
  { name: "isMainResource", dataType: "boolean", headerText: "FP_RESOURCE_TP_CD", visible: true, editable: false, width: 95, textAlignment: "center", defaultValue: false,
    styleName: "editable-text-column-center",
    renderer: {
      type: "check",
      editable: true,
      setCheckedCallback: function (gridView, itemIndex, column, checked) {
        gridView.commit(true);

        let checkValue = !checked;
        if (checkValue) {
          for (let i = 0; i < gridView.getDataSource().getRowCount(); i++) {
            if (itemIndex !== i) {
              gridView.getDataSource().setValue(i, "isMainResource", false);
            }
          }
        }
        return checkValue;
      }
    }
  },
  { name: "borSetMstDescTxt", dataType: "text", headerText: "FP_DESC_TXT", visible: true, editable: false, width: 80, textAlignment: "near" }
];

const borSetGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 50, textAlignment: "center" },
  { name: "borSetCode", dataType: "text", headerText: "FP_BOR_SET_CD", visible: true, editable: false, width: 150, textAlignment: "near" },
  { name: "borSetMstDescTxt", dataType: "text", headerText: "FP_DESC_TXT", visible: true, editable: false, width: 80, textAlignment: "near" },
  { name: "resourceCode", dataType: "text", headerText: "FP_RESOURCE_CD", visible: true, editable: false, width: 150, textAlignment: "near" },
  { name: "resourceName", dataType: "text", headerText: "FP_RESOURCE_NM", visible: true, editable: false, width: 200, textAlignment: "near" },
  { name: "resourceTpCd", dataType: "boolean", headerText: "FP_RESOURCE_TP_CD", visible: true, editable: false, width: 95, textAlignment: "center", defaultValue: false }
];

function BorSetTab(props, ref) {
  const { control, getValues, setValue } = useForm({
    defaultValues: {
      borSetDesc: '',
      rowRouteCode: ''
    }
  });

  const [borResourceGridTitle, setBorResourceGridTitle] = useState('');

  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const [viewBorGrid, setViewBorGrid] = useState(null);
  const [borResourceGrid, setBorResourceGrid] = useState(null);
  const [borSetGrid, setBorSetGrid] = useState(null);

  useEffect(() => {
    setViewBorGrid(getViewInfo(vom.active, 'viewBorGrid'));
    setBorResourceGrid(getViewInfo(vom.active, 'borResourceGrid'));
    setBorSetGrid(getViewInfo(vom.active, 'borSetGrid'));
  }, [viewData]);

  useEffect(() => {
    if (viewBorGrid) {
      setNoneEditableGrid(viewBorGrid);
      setGridOptions(viewBorGrid.gridView);

      loadBorData();
    }
  }, [viewBorGrid]);

  useEffect(() => {
    if (borResourceGrid) {
      setEditableGrid(borResourceGrid);
      setGridOptions(borResourceGrid.gridView);
    }
  }, [borResourceGrid]);

  useEffect(() => {
    if (borSetGrid) {
      setEditableGrid(borSetGrid);
      setGridOptions(borSetGrid.gridView);
    }
  }, [borSetGrid]);

  useImperativeHandle(ref, () => ({
    loadData(itemParam, routeParam, resourceParam) {
      loadBorData(itemParam, routeParam, resourceParam);
    }
  }));

  function setGridOptions(gridView) {
    if (gridView.id === 'viewBorGrid') {
      setGridComboList(gridView, 'itemClassCode', 'FP_ITEM_CLASS_CD');
      setGridComboList(gridView, 'timeUom', 'FP_TIME_UOM');

      gridView.onCellClicked = function (grid, clickData) {
        if (clickData.cellType !== 'gridEmpty') {
          viewBorGridRowClick();
        }
      }
    } else if (gridView.id === 'borResourceGrid') {
      gridView.setStateBar({ visible: false });
    } else if (gridView.id === 'borSetGrid') {
      gridView.setStateBar({ visible: false });

      gridView.onItemChecked = function (gridView, itemIndex, checked) {
        let clickRowCode = gridView.getValue(itemIndex, 'borSetCode');
        for (let i = 0; i < gridView.getDataSource().getRowCount(); i++) {
          if (gridView.getValue(i, 'borSetCode') === clickRowCode && i !== itemIndex) {
            gridView.checkRow(i, checked);
          }
        }
      }
    }
  }

  function viewBorGridRowClick() {
    const gridView = viewBorGrid.gridView;
    const itemIndex = gridView.getCurrent().itemIndex;

    const routeCode = gridView.getValue(itemIndex, 'routeCode');
    const routeName = gridView.getValue(itemIndex, 'routeName');

    const clickedBorResourceGridTitle = transLangKey('FP_ROUTE') + ' : ' + routeCode + ' (' + routeName + ')';

    if (clickedBorResourceGridTitle !== borResourceGridTitle) {
      setBorResourceGridTitle(clickedBorResourceGridTitle);

      setValue('rowRouteCode', routeCode);

      loadBorResourceGridData();
      loadBorSetGridData()
    }
  }

  function clearAllFilters(gridView) {
    if (gridView.id === 'viewBorGrid') {
      viewBorGridFilters.forEach(value => {
        gridView.activateAllColumnFilters(value, false);
      })
    } else if (gridView.id === 'borResourceGrid') {
      borResourceGridFilters.forEach(value => {
        gridView.activateAllColumnFilters(value, false);
      })
    } else if (gridView.id === 'borSetGrid') {
      borSetGridFilters.forEach(value => {
        gridView.activateAllColumnFilters(value, false);
      })
    }
  }

  function loadBorData(itemParam= '', routeParam = '', resourceParam = '') {
    clearAllFilters(viewBorGrid.gridView);

    viewBorGrid.gridView.commit(true);
    viewBorGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    borResourceGrid.dataProvider.clearRows();
    borSetGrid.dataProvider.clearRows();

    zAxios.get(baseURI() + 'factoryplan/master/bor/bors', {
      params: {
        'searchItem': itemParam,
        'searchRoute': routeParam,
        'searchResource': resourceParam
      }
    })
    .then(function (res) {
      viewBorGrid.dataProvider.fillJsonData(res.data);

      if (res.data.length > 0) {
        viewBorGrid.gridView.setCurrent({ itemIndex: 0, column: 'resourceCode' }, true);
        viewBorGridRowClick();
      }
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      viewBorGrid.gridView.hideToast();
    });
  }

  function loadBorResourceGridData() {
    clearAllFilters(borResourceGrid.gridView);

    borResourceGrid.gridView.commit(true);
    borResourceGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    zAxios.get(baseURI() + 'factoryplan/master/bor/borresources', {
      params: {
        'searchRouteCode': getValues('rowRouteCode')
      }
    })
    .then(function (res) {
      borResourceGrid.dataProvider.fillJsonData(res.data);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      borResourceGrid.gridView.hideToast();
      borResourceGrid.gridView.setAllCheck(false, false);
    });
  }

  function loadBorSetGridData() {
    clearAllFilters(borSetGrid.gridView);

    borSetGrid.gridView.commit(true);
    borSetGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    zAxios.get(baseURI() + 'factoryplan/master/bor/borsets', {
      params: {
        'searchRouteCode': getValues('rowRouteCode')
      },
      waitOn: false
    })
    .then(function (res) {
      res.data.forEach(data => data.resourceTpCd = data.resourceTpCd === 'M');
      borSetGrid.dataProvider.fillJsonData(res.data);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      borSetGrid.gridView.hideToast();
      borSetGrid.gridView.setAllCheck(false, false);
    });
  }

  const afterToLoad = (targetGrid) => {
    if (targetGrid.gridView.id === 'borSetGird') {
      loadBorSetGridData();
    }
  }

  function saveBorSet() {
    let checked = false;
    let checkedMainResource = false;
    let changeRowData = [];
    let borSetDescTxt = getValues('borSetDesc');

    borResourceGrid.gridView.getCheckedRows().forEach(function (index) {
      checked = true;
      if (borResourceGrid.dataProvider.getValue(index, 'isMainResource')) {
        checkedMainResource = true;
      }
      borResourceGrid.dataProvider.setValue(index, 'borSetMstDescTxt', borSetDescTxt);
      changeRowData.push(borResourceGrid.dataProvider.getJsonRow(index));

    });

    if (!checked) {
      showMessage(transLangKey('FP_ERROR_ROW_SELECT'), transLangKey('FP_MSG_RESOURCE_ROW_SELECT'));
      return;
    }

    if (!checkedMainResource) {
      showMessage(transLangKey('FP_ERROR_MAIN_RESOURCE_SELECT'), transLangKey('FP_MSG_MAIN_RESOURCE_SELECT'));
      return;
    }

    if (borSetDescTxt.trim() === '') {
      showMessage(transLangKey('FP_ERROR_BOR_SET_DESC_TXT'), transLangKey('FP_MSG_BOR_SET_DESC_TXT'));
      return;
    }

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'));
        } else {
          borSetGrid.gridView.showToast(progressSpinner + 'Saving data...', true);

          let formData = new FormData();
          formData.append('changes', JSON.stringify(changeRowData));

          zAxios({
            method: 'post',
            headers: {'content-type': 'application/json'},
            url: baseURI() + 'factoryplan/master/bor/borsets',
            data: formData
          })
          .then(function (response) {
          })
          .catch(function (err) {
            console.log(err);
          })
          .then(function () {
            borSetGrid.gridView.hideToast();
            borResourceGrid.gridView.hideToast();
            loadBorSetGridData();
            loadBorResourceGridData();

            setValue('borSetDesc', '');
          });
        }
      }
    });
  }

  return (
      <Box sx={fpCommonStyles.tabInner}>
        <ResultArea sizes={[50, 50]} direction={"vertical"}>
          <Box sx={{ mt: "5px"}}>
            <BaseGrid id="viewBorGrid" items={viewBorGridItems} className="white-skin" />
          </Box>
          <Box>
            <ResultArea sizes={[50, 50]} direction={"horizontal"}>
              <Box sx={{ mb: '70px', mr: '5px', '& > .MuiBox-root': { height: '62px', '& > *': { alignSelf: 'center' } } }}>
                <ButtonArea title={borResourceGridTitle}>
                  <LeftButtonArea />
                  <RightButtonArea>
                    <Box sx={{ display: 'inline-flex', '& > .MuiBox-root': { m: 0 }, '& .MuiFormControl-root': { mr: '0 !important' }, '& .MuiInputBase-root': { borderRadius: '4px 0 0 4px !important' } }}>
                      <InputField control={control} label={transLangKey("FP_BOR_SET_DESC_TXT")} name="borSetDesc" />
                      <Button variant="contained" sx={{ ...fpCommonStyles.primaryButton, borderRadius: '0 4px 4px 0 !important', height: '45px', m: '3.5px 0', pr: '8px', pl: '14px' }}
                              onClick={saveBorSet}>{transLangKey('SAVE')}<Icon.ChevronRight size={20} /></Button>
                    </Box>
                    {/*<div className="input-group mb-3">*/}
                    {/*  <input className="form-control form-control-lg" type="text" placeholder={transLangKey('FP_BOR_SET_DESC_TXT')} />*/}
                    {/*  <div className="input-group-append">*/}
                    {/*    <button className="btn btn-primary btn-lg">{transLangKey("SAVE")}<Icon.ChevronRight/></button>*/}
                    {/*  </div>*/}
                    {/*</div>*/}
                  </RightButtonArea>
                </ButtonArea>
                <BaseGrid id="borResourceGrid" items={borResourceGridItems} className="white-skin" />
              </Box>
              <Box sx={{ mb: '70px', ml: '5px', '& > .MuiBox-root': { height: '62px', '& > *': { alignSelf: 'center' }} }}>
                <ButtonArea title={transLangKey("FP_BOR_SET")}>
                  <LeftButtonArea />
                  <RightButtonArea>
                    <GridDeleteRowButton grid="borSetGrid" url="factoryplan/master/bor/borsets/delete" onAfterDelete={afterToLoad} />
                  </RightButtonArea>
                </ButtonArea>
                <BaseGrid id="borSetGrid" items={borSetGridItems} className="white-skin" />
              </Box>
            </ResultArea>
          </Box>
        </ResultArea>
      </Box>
  );
}

BorSetTab = forwardRef(BorSetTab);
export default BorSetTab;
