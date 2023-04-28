import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { BaseGrid, ButtonArea, ContentInner, GridExcelExportButton, LeftButtonArea, ResultArea, SearchArea, SearchRow, InputField, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import ItemSearchBox from '@wingui/view/supplychainmodel/common/ItemSearchBox';
import LocationSearchBox from '@wingui/view/supplychainmodel/common/LocationSearchBox';
import PopSimulationVersion from '@wingui/view/masterplan/common/PopSimulationVersion';
import PopDetailProductionPlan from './PopDetailProductionPlan';

import './consumptionplan.css'

let gridMrpColumns = [
  {name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: 80, groups: "LOCAT", groupShowMode: "expand" },
  {name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: 80, groups: "LOCAT", groupShowMode: "expand" },
  {name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: 80, groups: "LOCAT", groupShowMode: "always" },
  {name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: 120, groups: "LOCAT", groupShowMode: "always" },
  {name: "ITEM_GRP", dataType: "text", headerText: "ITEM_GRP", visible: true, editable: false, width: 80, groups: "ITEM", groupShowMode: "expand" },
  {name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: 80, groups: "ITEM", groupShowMode: "always" },
  {name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: 120, groups: "ITEM", groupShowMode: "always" },
  {name: "ITEM_DESCRIP", dataType: "text", headerText: "ITEM_DESCRIP", visible: true, editable: false, width: 120, groups: "ITEM", groupShowMode: "expand" },
  {name: "ITEM_TP", dataType: "text", headerText: "ITEM_TP", visible: true, editable: false, width: 80, groups: "ITEM", groupShowMode: "expand" },
  {name: "ATTR_01", dataType: "text", headerText :"ITEM_ATTR_01", visible: true, editable: false, width: 100, groups: "ITEM", groupShowMode: "expand" },
  {name: "ATTR_02", dataType: "text", headerText :"ITEM_ATTR_02", visible: true, editable: false, width: 100, groups: "ITEM", groupShowMode: "expand" },
  {name: "ATTR_03", dataType: "text", headerText :"ITEM_ATTR_03", visible: false, editable: false, width: 100, groups: "ITEM", groupShowMode: "expand" },
  {name: "ATTR_04", dataType: "text", headerText :"ITEM_ATTR_04", visible: false, editable: false, width: 100, groups: "ITEM", groupShowMode: "expand" },
  {name: "ATTR_05", dataType: "text", headerText :"ITEM_ATTR_05", visible: false, editable: false, width: 100, groups: "ITEM", groupShowMode: "expand" },
  {name: "ATTR_06", dataType: "text", headerText :"ITEM_ATTR_06", visible: false, editable: false, width: 100, groups: "ITEM", groupShowMode: "expand" },
  {name: "ATTR_07", dataType: "text", headerText :"ITEM_ATTR_07", visible: false, editable: false, width: 100, groups: "ITEM", groupShowMode: "expand" },
  {name: "ATTR_08", dataType: "text", headerText :"ITEM_ATTR_08", visible: false, editable: false, width: 100, groups: "ITEM", groupShowMode: "expand" },
  {name: "ATTR_09", dataType: "text", headerText :"ITEM_ATTR_09", visible: false, editable: false, width: 100, groups: "ITEM", groupShowMode: "expand" },
  {name: "ATTR_10", dataType: "text", headerText :"ITEM_ATTR_10", visible: false, editable: false, width: 100, groups: "ITEM", groupShowMode: "expand" },
  {name: "ATTR_11", dataType: "text", headerText :"ITEM_ATTR_11", visible: false, editable: false, width: 100, groups: "ITEM", groupShowMode: "expand" },
  {name: "ATTR_12", dataType: "text", headerText :"ITEM_ATTR_12", visible: false, editable: false, width: 100, groups: "ITEM", groupShowMode: "expand" },
  {name: "ATTR_13", dataType: "text", headerText :"ITEM_ATTR_13", visible: false, editable: false, width: 100, groups: "ITEM", groupShowMode: "expand" },
  {name: "ATTR_14", dataType: "text", headerText :"ITEM_ATTR_14", visible: false, editable: false, width: 100, groups: "ITEM", groupShowMode: "expand" },
  {name: "ATTR_15", dataType: "text", headerText :"ITEM_ATTR_15", visible: false, editable: false, width: 100, groups: "ITEM", groupShowMode: "expand" },
  {name: "ATTR_16", dataType: "text", headerText :"ITEM_ATTR_16", visible: false, editable: false, width: 100, groups: "ITEM", groupShowMode: "expand" },
  {name: "ATTR_17", dataType: "text", headerText :"ITEM_ATTR_17", visible: false, editable: false, width: 100, groups: "ITEM", groupShowMode: "expand" },
  {name: "ATTR_18", dataType: "text", headerText :"ITEM_ATTR_18", visible: false, editable: false, width: 100, groups: "ITEM", groupShowMode: "expand" },
  {name: "ATTR_19", dataType: "text", headerText :"ITEM_ATTR_19", visible: false, editable: false, width: 100, groups: "ITEM", groupShowMode: "expand" },
  {name: "ATTR_20", dataType: "text", headerText :"ITEM_ATTR_20", visible: false, editable: false, width: 100, groups: "ITEM", groupShowMode: "expand" },
  {name: "UOM_NM", dataType: "text", headerText :"UOM_NM", visible: true, editable: false, width: 80, groups: "ITEM", groupShowMode: "expand" },
  {name: "STOCK", dataType: "number", headerText :"STOCK", visible: true, editable: false, width: 80 },
  {name: "CATEGORY_GROUP", dataType: "text", headerText :"CATEGORY_GROUP", visible: false, editable: false, width: 100 },
  {name: "CATEGORY", dataType: "text", headerText :"CATEGORY", visible: true, editable: false, width: 150, autoFilter: true, lang: true },
  {name: "DAT", dataType: "number", headerText :"DAT", visible: true, editable: false, width: 100, numberFormat: "#,###.###", headerCheckable: false, iteration: { prefix: "DAT_", prefixRemove: "true" } }
]

function ConsumptionPlan() {
  const [gridMrp, setGrid] = useState(null);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const [simulationVersionPopupOpen, setSimulationVersionPopupOpen] = useState(false);
  const [detailProductionPlanPopupOpen, setDetailProductionPlanPopupOpen] = useState(false);

  const locationSearchBoxRef = useRef();
  const itemSearchBoxRef = useRef();

  const [currentLocationRef, setCurrentLocationRef] = useState();
  const [currentItemRef, setCurrentItemRef] = useState();

  const [currentVersion, setCurrentVersion] = useState('');
  const [popupData, setPopupData] = useState({});

  const exportOptions = {
    headerDepth: 2,
    footer: 'default',
    allColumns: false,
    lookupDisplay: false,
    separateRows: false
  };

  const { reset, control, getValues, setValue } = useForm({ defaultValues: {
      moduleCd: 'MP',
      versionId: '',
      versionDescrip: '',
      processDescrip: '',
      invType: 'ALL'
    }
  });

  const globalButtons = [
    { name: 'search', action: (e) => { onSubmit() }, visible: true, disable: false },
    { name: 'refresh', action: (e) => { refresh() }, visible: true, disable: false }
  ]

  const onSubmit = (data) => {
    loadMrp(data);
  };

  useEffect(() => {
    setViewInfo(vom.active, 'globalButtons', globalButtons);

    if (gridMrp) {
      async function initLoad() {
        await loadRecentSimulationVersion();
        loadMrp();
      }

      initLoad();
    }
  }, [gridMrp]);

  useEffect(() => {
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

  function afterGridCreate(gridObj, gridView, dataProvider) {
    setGrid(gridObj)
    setOptionsGridMrp(gridObj);
  };

  function setOptionsGridMrp(gridObj) {
    const gridView = gridObj.gridView;

    gridView.setEditOptions({
      insertable: false,
      appendable: false
    })

    wingui.util.grid.sorter.orderBy(gridView, ['LOCAT_TP_NM', 'LOCAT_LV', 'LOCAT_CD', 'ITEM_CD']);
    gridView.setFixedOptions({colCount: 4, resizable: true});
    gridView.displayOptions.fitStyle = 'even';
    setVisibleProps(gridObj, true, false, false);

    gridView.setColumnProperty('LOCAT_TP_NM', 'mergeRule', { criteria: 'value' });
    gridView.setColumnProperty('LOCAT_LV', 'mergeRule', { criteria: 'prevvalues + value' });
    gridView.setColumnProperty('LOCAT_CD', 'mergeRule', { criteria: 'prevvalues + value' });
    gridView.setColumnProperty('LOCAT_NM', 'mergeRule', { criteria: 'prevvalues + value' });
    gridView.setColumnProperty('ITEM_GRP', 'mergeRule', { criteria: 'prevvalues + value' });
    gridView.setColumnProperty('ITEM_CD', 'mergeRule', { criteria: 'prevvalues + value' });
    gridView.setColumnProperty('ITEM_NM', 'mergeRule', { criteria: 'prevvalues + value' });
    gridView.setColumnProperty('ITEM_DESCRIP', 'mergeRule', { criteria: 'prevvalues + value' });
    gridView.setColumnProperty('ITEM_TP', 'mergeRule', { criteria: 'prevvalues + value' });
    gridView.setColumnProperty('ATTR_01', 'mergeRule', { criteria: 'prevvalues + value' });
    gridView.setColumnProperty('ATTR_02', 'mergeRule', { criteria: 'prevvalues + value' });
    gridView.setColumnProperty('ATTR_03', 'mergeRule', { criteria: 'prevvalues + value' });
    gridView.setColumnProperty('ATTR_04', 'mergeRule', { criteria: 'prevvalues + value' });
    gridView.setColumnProperty('ATTR_05', 'mergeRule', { criteria: 'prevvalues + value' });
    gridView.setColumnProperty('ATTR_06', 'mergeRule', { criteria: 'prevvalues + value' });
    gridView.setColumnProperty('ATTR_07', 'mergeRule', { criteria: 'prevvalues + value' });
    gridView.setColumnProperty('ATTR_08', 'mergeRule', { criteria: 'prevvalues + value' });
    gridView.setColumnProperty('ATTR_09', 'mergeRule', { criteria: 'prevvalues + value' });
    gridView.setColumnProperty('ATTR_10', 'mergeRule', { criteria: 'prevvalues + value' });
    gridView.setColumnProperty('ATTR_11', 'mergeRule', { criteria: 'prevvalues + value' });
    gridView.setColumnProperty('ATTR_12', 'mergeRule', { criteria: 'prevvalues + value' });
    gridView.setColumnProperty('ATTR_13', 'mergeRule', { criteria: 'prevvalues + value' });
    gridView.setColumnProperty('ATTR_14', 'mergeRule', { criteria: 'prevvalues + value' });
    gridView.setColumnProperty('ATTR_15', 'mergeRule', { criteria: 'prevvalues + value' });
    gridView.setColumnProperty('ATTR_16', 'mergeRule', { criteria: 'prevvalues + value' });
    gridView.setColumnProperty('ATTR_17', 'mergeRule', { criteria: 'prevvalues + value' });
    gridView.setColumnProperty('ATTR_18', 'mergeRule', { criteria: 'prevvalues + value' });
    gridView.setColumnProperty('ATTR_19', 'mergeRule', { criteria: 'prevvalues + value' });
    gridView.setColumnProperty('ATTR_20', 'mergeRule', { criteria: 'prevvalues + value' });
    gridView.setColumnProperty('UOM_NM', 'mergeRule', { criteria: 'prevvalues + value' });

    gridView.setCellStyleCallback(function (grid, dataCell) {
      const ret = {};
      const columnName = dataCell.index.column.name;

      if (columnName.startsWith('DAT_')) {
        if (dataCell.value < 0) {
          ret.styleName = 'shortage-cell';
          return ret;
        }

        const rowIndex = dataCell.index.itemIndex;
        const measureValue = gridObj.dataProvider.getValue(rowIndex, 'CATEGORY');
        if (measureValue === 'MAT_CONSUME_QTY') {
          ret.styleName = 'mrp-row';
        }
      }

      if (columnName.startsWith('CATEGORY')) {
        ret.styleName = 'category-col';
      }

      return ret;
    })

    gridView.onCellDblClicked = function (grid, index) {
      if (index.cellType && index.cellType === 'data') {
        let data = gridObj.dataProvider.getOutputRow(null, index.dataRow);

        if (data.CATEGORY === 'MAT_CONSUME_QTY') {
          setPopupData(data);
          openPopDetailProductionPlan();
        }
      }
    };
  }

  function openPopDetailProductionPlan() {
    setDetailProductionPlanPopupOpen(true);
  }

  function closePopDetailProductionPlan() {
    setDetailProductionPlanPopupOpen(false);
  }

  function loadRecentSimulationVersion() {
    let param = new FormData();

    param.append('MODULE_CD', 'MP');
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
        setValue('versionId', res.data.RESULT_DATA[0].SIMUL_VER);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function popupSimulationVersion() {
    setSimulationVersionPopupOpen(true);
  }

  function onSetSimulationVersion(gridRow) {
    setValue('versionId', gridRow.SIMUL_VER);
    setValue('versionDescrip', gridRow.SIMUL_VER_DESCRIP);
    setValue('processDescrip', gridRow.PROCESS_DESCRIP);
  }

  function loadMrp() {
    let params = new FormData();

    params.append('VERSION_ID', getValues('versionId'));
    params.append('LOCAT_TP', currentLocationRef.getLocationType());
    params.append('LOCAT_LV', currentLocationRef.getLocationLevel());
    params.append('LOCAT_CD', currentLocationRef.getLocationCode());
    params.append('LOCAT_NM', currentLocationRef.getLocationName());
    params.append('ITEM_CD', currentItemRef.getItemCode());
    params.append('ITEM_NM', currentItemRef.getItemName());
    params.append('ITEM_TP_NM', currentItemRef.getItemType());
    params.append('INV_TYPE', getValues('invType'));
    params.append('CROSSTAB', JSON.stringify(gridMrp.gridView.crossTabInfo));

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/GetMRP',
      data: params
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridMrp.setData(res.data.RESULT_DATA)
        setCurrentVersion(getValues('versionId'));
      }
    })
    .catch(function (err) {
      console.error(err);
    });
  }

  function refresh() {
    currentLocationRef.reset();
    currentItemRef.reset();
    reset();
    gridMrp.gridView.commit(true);
    gridMrp.dataProvider.clearRows();
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <InputField name="moduleCd" label={transLangKey("MODULE_VAL")} control={control} style={{display: 'none'}} />
            <InputField type="action" name="versionId" label={transLangKey("SIMUL_VER")} style={{width: '210px'}} control={control} onClick={() => { popupSimulationVersion() }} rules={{required: transLangKey('MSG_0006'),}} >
              <Icon.Search />
            </InputField>
            <InputField name="versionDescrip" label={transLangKey("DESCRIP")} control={control} readonly={true}/>
            <InputField name="processDescrip" label={transLangKey("PROCESS_DESCRIP")} control={control} readonly={true}/>

            <LocationSearchBox ref={locationSearchBoxRef} keyValue={'locationName'} placeHolder={transLangKey("LOCAT_NM")} style={{width: 300}}/>
            <ItemSearchBox ref={itemSearchBoxRef} keyValue={'itemName'} placeHolder={transLangKey("ITEM_NM")} style={{width: 300}}/>

            <InputField type="radio" name="invType" control={control} options={[{ label: transLangKey("ALL"), value: "ALL" }, { label: transLangKey("SHORTAGE"), value: "SHORTAGE" }]} />
          </SearchRow>
        </SearchArea>
        <ButtonArea>
          <LeftButtonArea>
            <GridExcelExportButton type="icon" grid="gridMrp" options={exportOptions} />
          </LeftButtonArea>
        </ButtonArea>
        <ResultArea>
          <BaseGrid id="gridMrp" items={gridMrpColumns} viewCd="UI_MP_30" gridCd="UI_MP_30-RST_CPT_01" afterGridCreate={afterGridCreate} />
        </ResultArea>
      </ContentInner>

      <PopSimulationVersion open={simulationVersionPopupOpen} onClose={() => { setSimulationVersionPopupOpen(false) }} confirm={onSetSimulationVersion} module={getValues('moduleCd')} />
      {detailProductionPlanPopupOpen && <PopDetailProductionPlan open={detailProductionPlanPopupOpen} onClose={closePopDetailProductionPlan} data={popupData} version={currentVersion} />}
    </>
  )
}

export default ConsumptionPlan;
