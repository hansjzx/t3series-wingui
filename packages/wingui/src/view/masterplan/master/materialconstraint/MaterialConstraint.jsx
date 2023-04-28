import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import {
  BaseGrid, ButtonArea, ContentInner, GridSaveButton, GridExcelExportButton, InputField, LeftButtonArea, ResultArea, RightButtonArea,
  SearchArea, SearchRow, useUserStore, useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';

import ItemSearchBox from '@wingui/view/supplychainmodel/common/ItemSearchBox';
import LocationSearchBox from '@wingui/view/supplychainmodel/common/LocationSearchBox';
import { setGridComboList } from "@wingui/view/supplychainmodel/common/common";

let gridMaterialConstraintColumns = [
  { name: 'ID', dataType: 'text', headerText: 'ID', visible: false, editable: false, width: '30' },
  { name: 'ITEM_ID', dataType: 'text', headerText: 'ITEM_ID', visible: false, editable: false, width: '30' },
  { name: 'LOCATION_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'LOCAT', expandable: true, expanded: false,
    childs: [
      { name: 'LOCAT_TP_NM', dataType: 'text', headerText: 'LOCAT_TP_NM', visible: true, editable: false, width: 120, groupShowMode: 'expand' },
      { name: 'LOCAT_LV', dataType: 'text', headerText: 'LOCAT_LV', visible: true, editable: false, width: 120, groupShowMode: 'expand' },
      { name: 'LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: 120, groupShowMode: 'always' },
      { name: 'LOCAT_NM', dataType: 'text', headerText: 'LOCAT_NM', visible: true, editable: false, width: 120, groupShowMode: 'always' }
    ]
  },
  { name: 'ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', visible: true, editable: false, width: '120' },
  { name: 'ITEM_NM', dataType: 'text', headerText: 'ITEM_NM', visible: true, editable: false, width: '250' },
  { name: 'ITEM_DESCRIP', dataType: 'text', headerText: 'ITEM_DESCRIP', visible: false, editable: false, width: '150' },
  { name: 'ATTR_01', dataType: 'text', headerText: 'ITEM_ATTR_01', visible: false, editable: false, width: '80' },
  { name: 'ATTR_02', dataType: 'text', headerText: 'ITEM_ATTR_02', visible: false, editable: false, width: '80' },
  { name: 'ATTR_03', dataType: 'text', headerText: 'ITEM_ATTR_03', visible: false, editable: false, width: '80' },
  { name: 'ATTR_04', dataType: 'text', headerText: 'ITEM_ATTR_04', visible: false, editable: false, width: '80' },
  { name: 'ATTR_05', dataType: 'text', headerText: 'ITEM_ATTR_05', visible: false, editable: false, width: '80' },
  { name: 'ATTR_06', dataType: 'text', headerText: 'ITEM_ATTR_06', visible: false, editable: false, width: '80' },
  { name: 'ATTR_07', dataType: 'text', headerText: 'ITEM_ATTR_07', visible: false, editable: false, width: '80' },
  { name: 'ATTR_08', dataType: 'text', headerText: 'ITEM_ATTR_08', visible: false, editable: false, width: '80' },
  { name: 'ATTR_09', dataType: 'text', headerText: 'ITEM_ATTR_09', visible: false, editable: false, width: '80' },
  { name: 'ATTR_10', dataType: 'text', headerText: 'ITEM_ATTR_10', visible: false, editable: false, width: '80' },
  { name: 'ATTR_11', dataType: 'text', headerText: 'ITEM_ATTR_11', visible: false, editable: false, width: '80' },
  { name: 'ATTR_12', dataType: 'text', headerText: 'ITEM_ATTR_12', visible: false, editable: false, width: '80' },
  { name: 'ATTR_13', dataType: 'text', headerText: 'ITEM_ATTR_13', visible: false, editable: false, width: '80' },
  { name: 'ATTR_14', dataType: 'text', headerText: 'ITEM_ATTR_14', visible: false, editable: false, width: '80' },
  { name: 'ATTR_15', dataType: 'text', headerText: 'ITEM_ATTR_15', visible: false, editable: false, width: '80' },
  { name: 'ATTR_16', dataType: 'text', headerText: 'ITEM_ATTR_16', visible: false, editable: false, width: '80' },
  { name: 'ATTR_17', dataType: 'text', headerText: 'ITEM_ATTR_17', visible: false, editable: false, width: '80' },
  { name: 'ATTR_18', dataType: 'text', headerText: 'ITEM_ATTR_18', visible: false, editable: false, width: '80' },
  { name: 'ATTR_19', dataType: 'text', headerText: 'ITEM_ATTR_19', visible: false, editable: false, width: '80' },
  { name: 'ATTR_20', dataType: 'text', headerText: 'ITEM_ATTR_20', visible: false, editable: false, width: '80' },
  { name: 'KEY_MAT_YN', dataType: 'boolean', headerText: 'KEY_MAT_YN', visible: true, editable: true, width: '120' },
  { name: 'LGDY_MAT_YN', dataType: 'boolean', headerText: 'LONG_DELIVY_MAT_YN', visible: true, editable: true, width: '120' },
  { name: 'MAT_CONST_TP', dataType: 'dropdown', headerText: 'MAT_CONST_TP', visible: true, editable: true, width: '150', useDropdown: true, lookupDisplay: true },
  { name: 'CONST_TP_CHNG_PERIOD', dataType: 'number', headerText: 'CONST_TP_CHNG_PERIOD', visible: true, editable: true, width: '150' },
  { name: 'UOM_NM', dataType: 'dropdown', headerText: 'TIME_UOM_NM', visible: true, editable: true, width: '120', useDropdown: true, lookupDisplay: true },
  //{ name: 'DEL_YN', dataType: 'boolean', headerText: 'DEL_YN', visible: true, editable: false, width: '80' },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: true, width: '80' },
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

function MaterialConstraint() {
  const [username] = useUserStore(state => [state.username]);
  const [gridMaterialConstraint, setGridMaterialConstraint] = useState(null);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const locationSearchBoxRef = useRef();
  const [currentLocationRef, setCurrentLocationRef] = useState();

  const itemSearchBoxRef = useRef();
  const [currentItemRef, setCurrentItemRef] = useState();

  const { reset, control, getValues } = useForm({
    defaultValues: {
      materialType: 'A'
    }
  });

  const globalButtons = [
    { name: 'search', action: (e) => { onSubmit() }, visible: true, disable: false },
    { name: 'refresh', action: (e) => { refresh() }, visible: true, disable: false }
  ]

  const exportOptions = {
    headerDepth: 2,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  };

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, 'gridMaterialConstraint');
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        if (gridMaterialConstraint != grdObj1) {
          setGridMaterialConstraint(grdObj1);
        }
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
    async function initLoad() {
      if (gridMaterialConstraint) {
        setViewInfo(vom.active, 'globalButtons', globalButtons);
        setOptionGridMaterialConstraint();

        await loadMaterialConstraint();
      }
    }

    initLoad();
  }, [gridMaterialConstraint]);

  function onSubmit() {
    loadMaterialConstraint();
  };

  function refresh() {
    currentLocationRef.reset();
    currentItemRef.reset();
    reset();
    gridMaterialConstraint.dataProvider.clearRows();
  }

  const setOptionGridMaterialConstraint = () => {
    gridMaterialConstraint.gridView.setEditOptions({
      insertable: true,
      appendable: true
    })
    gridMaterialConstraint.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridMaterialConstraint, true, true, false);

    gridMaterialConstraint.gridView.setColumnProperty('LOCAT_TP_NM', 'mergeRule', { criteria: 'value' });
    gridMaterialConstraint.gridView.setColumnProperty('LOCAT_LV', 'mergeRule', { criteria: 'value' });
    gridMaterialConstraint.gridView.setColumnProperty('LOCAT_CD', 'mergeRule', { criteria: 'value' });
    gridMaterialConstraint.gridView.setColumnProperty('LOCAT_NM', 'mergeRule', { criteria: 'value' });

    gridMaterialConstraint.gridView.setFixedOptions({colCount: 3, resizable : true});

    setGridComboList(gridMaterialConstraint, 'MAT_CONST_TP, UOM_NM', 'MP_BASE_MAT_CONST_TP, TIME_UOM');
    wingui.util.grid.sorter.orderBy(gridMaterialConstraint.gridView, ['LOCAT_TP_NM', 'LOCAT_LV', 'LOCAT_CD']);
  }

  function loadMaterialConstraint() {;
    let formData = new FormData();
    formData.append('LOCAT_TP', currentLocationRef.getLocationType());
    formData.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    formData.append('LOCAT_CD', currentLocationRef.getLocationCode());
    formData.append('LOCAT_NM', currentLocationRef.getLocationName());
    formData.append('ITEM_CD', currentItemRef.getItemCode());
    formData.append('ITEM_NM', currentItemRef.getItemName());
    formData.append('MAT_TP', getValues('materialType'));

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_05_Q1',
      data: formData
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridMaterialConstraint.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function saveMaterialConstraint() {
    gridMaterialConstraint.gridView.commit(true);
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridMaterialConstraint.dataProvider.getAllStateRows().created,
          gridMaterialConstraint.dataProvider.getAllStateRows().updated,
          gridMaterialConstraint.dataProvider.getAllStateRows().deleted,
          gridMaterialConstraint.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          let data = gridMaterialConstraint.dataProvider.getJsonRow(row);
          changeRowData.push(data);
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          let formData = new FormData();
          formData.append('changes', JSON.stringify(changeRowData));
          formData.append('USER_ID', username);
          formData.append('WRK_TYPE', 'SAVE');

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_UI_MP_05_S1',
            data: formData,
          })
          .then(function (res) {
            const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_05_S1_P_RT_MSG;
            showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false });

            if (res.status === gHttpStatus.SUCCESS) {
              loadMaterialConstraint();
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
          <SearchRow>
            <LocationSearchBox ref={locationSearchBoxRef} keyValue={'locationName'} placeHolder={transLangKey("LOCAT_NM")} style={{width: 300}}/>
            <ItemSearchBox ref={itemSearchBoxRef} keyValue={'itemName'} placeHolder={transLangKey("ITEM_NM")} fields={['itemCode','itemName']} style={{width: 300, popoverHeight:200}}/>
            <InputField type="radio" name="materialType" control={control} width={'410px'}
              options={[{ label: transLangKey("ALL"), value: "A" }, { label: transLangKey("KEY_MAT"), value: "K" }, { label: transLangKey("LONG_DELIVY_MAT"), value: "L" }]} />
          </SearchRow>
        </SearchArea>
        <ButtonArea>
          <LeftButtonArea>
            <GridExcelExportButton type="icon" grid="gridMaterialConstraint" options={exportOptions} />
            {/*<GridExcelImportButton type="icon" grid="gridMaterialConstraint" />*/}
          </LeftButtonArea>
          <RightButtonArea>
            <GridSaveButton type="icon" onClick={() => { saveMaterialConstraint() }} />
          </RightButtonArea>
        </ButtonArea>
        <ResultArea>
          <BaseGrid id="gridMaterialConstraint" items={gridMaterialConstraintColumns}></BaseGrid>
        </ResultArea>
      </ContentInner>
    </>
  )
}

export default MaterialConstraint
