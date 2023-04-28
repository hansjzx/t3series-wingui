import React, { useState, useEffect, useRef } from 'react';
import {
  BaseGrid, ButtonArea, ContentInner, GridExcelExportButton, GridExcelImportButton, GridSaveButton,
  LeftButtonArea, ResultArea, RightButtonArea, SearchArea, SearchRow, useUserStore, useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';

import ItemSearchBox from '../common/ItemSearchBox';
import LocationSearchBox from '../common/LocationSearchBox';

let gridItemShipmentScheduleColumns = [
  { name: "ID", dataType: "text", visible: false, editable: false },
  { name: "TRANSP_MGMT_DTL_ID", dataType: "text", visible: false, editable: false },
  { name: "CONSUME_LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: 80, groups: "CONSUME_LOCAT", groupShowMode: "expand" },
  { name: "CONSUME_LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: 80, groups: "CONSUME_LOCAT", groupShowMode: "expand" },
  { name: "CONSUME_LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: 80, groups: "CONSUME_LOCAT", groupShowMode: "always" },
  { name: "CONSUME_LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: 120, groups: "CONSUME_LOCAT", groupShowMode: "always" },
  { name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: 80, groups: "ITEM", groupShowMode: "always" },
  { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: 120, groups: "ITEM", groupShowMode: "always" },
  { name: "ITEM_TP", dataType: "text", headerText: "ITEM_TP", visible: true, editable: false, width: 80, groups: "ITEM", groupShowMode: "expand" },
  { name: "SUPPLY_LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: 80, groups: "SUPPLY_LOCAT", groupShowMode: "expand" },
  { name: "SUPPLY_LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: 80, groups: "SUPPLY_LOCAT", groupShowMode: "expand" },
  { name: "SUPPLY_LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: 80, groups: "SUPPLY_LOCAT", groupShowMode: "always" },
  { name: "SUPPLY_LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: 120, groups: "SUPPLY_LOCAT", groupShowMode: "always" },
  { name: "VEHICL_VAL", dataType: "text", visible: true, editable: false, width: 100, autoFilter: true },
  { name: "BOD_LEADTIME_PERIOD", dataType: "text", visible: true, editable: false, width: 130 },
  { name: "LEADTIME_TP", dataType: "text", visible: true, editable: false, width: 100, autoFilter: true },
  { name: "YYYYMMDD", dataType: "bool", visible: true, editable: true, width: 100, headerCheckable: false, iteration: { prefix: "YYYYMMDD_", prefixRemove: "true" } }
]

function ItemShipmentSchedule() {
  const [gridItemShipmentSchedule, setGrid] = useState(null);
  const [username] = useUserStore(state => [state.username]);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const consumeLocationSearchBoxRef = useRef();
  const itemSearchBoxRef = useRef();
  const supplyLocationSearchBoxRef = useRef();

  const [currentConsumeLocationRef, setCurrentConsumeLocationRef] = useState();
  const [currentItemRef, setCurrentItemRef] = useState();
  const [currentSupplyLocationRef, setCurrentSupplyLocationRef] = useState();

  const exportOptions = {
    headerDepth: 2,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  };

  const globalButtons = [
    { name: 'search', action: (e) => { loadItemShipmentSchedule() }, visible: true, disable: false },
    { name: 'refresh', action: (e) => { refresh() }, visible: true, disable: false }
  ]

  useEffect(() => {
    if (gridItemShipmentSchedule) {
      setViewInfo(vom.active, 'globalButtons', globalButtons);
      setOptionsGridItemShipmentSchedule(gridItemShipmentSchedule);
      loadItemShipmentSchedule();
    }
  }, [gridItemShipmentSchedule]);

  useEffect(() => {
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

  function afterGridCreate(gridObj, gridView, dataProvider) {
    setGrid(gridObj)
    setOptionsGridItemShipmentSchedule(gridObj);
  };

  function setOptionsGridItemShipmentSchedule(grid) {
    grid.gridView.setEditOptions({
      insertable: true,
      appendable: true
    })

    const sortCols = ['CONSUME_LOCAT_TP_NM', 'CONSUME_LOCAT_LV', 'CONSUME_LOCAT_CD', 'ITEM_CD', 'SUPPLY_LOCAT_TP_NM', 'SUPPLY_LOCAT_LV', 'SUPPLY_LOCAT_CD', 'VEHICL_VAL'];
    wingui.util.grid.sorter.orderBy(grid.gridView, sortCols);
    grid.gridView.setFixedOptions({colCount: 4, resizable: true});
    grid.gridView.displayOptions.fitStyle = 'even';
    setVisibleProps(grid, true, true, false);

    grid.gridView.setColumnProperty('CONSUME_LOCAT_TP_NM', 'mergeRule', { criteria: 'value' });
    grid.gridView.setColumnProperty('CONSUME_LOCAT_LV', 'mergeRule', { criteria: 'prevvalues + value' });
    grid.gridView.setColumnProperty('CONSUME_LOCAT_CD', 'mergeRule', { criteria: 'prevvalues + value' });
    grid.gridView.setColumnProperty('CONSUME_LOCAT_NM', 'mergeRule', { criteria: 'prevvalues + value' });
    grid.gridView.setColumnProperty('ITEM_CD', 'mergeRule', { criteria: 'prevvalues + value' });
    grid.gridView.setColumnProperty('ITEM_NM', 'mergeRule', { criteria: 'prevvalues + value' });
    grid.gridView.setColumnProperty('ITEM_TP', 'mergeRule', { criteria: 'prevvalues + value' });
    grid.gridView.setColumnProperty('SUPPLY_LOCAT_TP_NM', 'mergeRule', { criteria: 'prevvalues + value' });
    grid.gridView.setColumnProperty('SUPPLY_LOCAT_LV', 'mergeRule', { criteria: 'prevvalues + value' });
    grid.gridView.setColumnProperty('SUPPLY_LOCAT_CD', 'mergeRule', { criteria: 'prevvalues + value' });
    grid.gridView.setColumnProperty('SUPPLY_LOCAT_NM', 'mergeRule', { criteria: 'prevvalues + value' });
  }

  function loadItemShipmentSchedule() {
    let params = new URLSearchParams();
    params.append('CONSUME_LOCAT_TP', currentConsumeLocationRef.getLocationType());
    params.append('CONSUME_LOCAT_LV', currentConsumeLocationRef.getLocationLevel());
    params.append('CONSUME_LOCAT_CD', currentConsumeLocationRef.getLocationCode());
    params.append('CONSUME_LOCAT_NM', currentConsumeLocationRef.getLocationName());
    params.append('ITEM_CD', currentItemRef.getItemCode());
    params.append('ITEM_NM', currentItemRef.getItemName());
    params.append('ITEM_TP', currentItemRef.getItemType());
    params.append('SUPPLY_LOCAT_TP', currentSupplyLocationRef.getLocationType());
    params.append('SUPPLY_LOCAT_LV', currentSupplyLocationRef.getLocationLevel());
    params.append('SUPPLY_LOCAT_CD', currentSupplyLocationRef.getLocationCode());
    params.append('SUPPLY_LOCAT_NM', currentSupplyLocationRef.getLocationName());
    params.append('CROSSTAB', JSON.stringify(gridItemShipmentSchedule.gridView.crossTabInfo));

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_CM_19_Q1',
      data: params
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          let dataArr = res.data.RESULT_DATA;
          gridItemShipmentSchedule.setData(dataArr)
        }
      })
      .catch(function (err) {
        console.error(err);
      });
  }

  function refresh() {
    currentConsumeLocationRef.reset();
    currentItemRef.reset();
    currentSupplyLocationRef.reset();
    reset();
    gridItemShipmentSchedule.gridView.commit(true);
    gridItemShipmentSchedule.dataProvider.clearRows();
  }

  function saveItemShipmentSchedule() {
    gridItemShipmentSchedule.gridView.commit(true);

    let changedRow = [];

    changedRow = changedRow.concat(
      gridItemShipmentSchedule.dataProvider.getAllStateRows().created,
      gridItemShipmentSchedule.dataProvider.getAllStateRows().updated,
      gridItemShipmentSchedule.dataProvider.getAllStateRows().deleted,
      gridItemShipmentSchedule.dataProvider.getAllStateRows().createAndDeleted
    );

    if (changedRow.length === 0) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
    } else {
      showMessage(transLangKey('SAVE'), transLangKey('MSG_SAVE'), function (answer) {
        if (answer) {
          let formData = new FormData();
          let changes = [];

          changedRow.forEach(function (row) {
            let data = gridItemShipmentSchedule.dataProvider.getJsonRow(row);
            changes.push(data);
          });

          formData.append('changes', JSON.stringify(changes));
          formData.append('USER_ID', username);
          formData.append('CROSSTAB', JSON.stringify(gridItemShipmentSchedule.gridView.crossTabInfo));
          formData.append('REVERSE_TARGET', 'changes');

          zAxios.post(baseURI() + 'engine/mp/SRV_UI_CM_19_S1', formData)
            .then(function (res) {
              if (res.status === gHttpStatus.SUCCESS) {
                const rsData = res.data;
                if (rsData.RESULT_SUCCESS) {
                  const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_19_S1_P_RT_MSG;
                  msg === "MSG_0001" ? loadItemShipmentSchedule() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg));
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

  return (
    <ContentInner>
      <SearchArea>
        <SearchRow>
          <LocationSearchBox ref={consumeLocationSearchBoxRef} keyValue={'locationName'} label={transLangKey("CONSUME_LOCAT")} placeHolder={transLangKey("LOCAT_NM")} style={{width: 300}}/>
          <ItemSearchBox ref={itemSearchBoxRef} keyValue={'itemName'} placeHolder={transLangKey("ITEM_NM")} style={{width: 300}}/>
          <LocationSearchBox ref={supplyLocationSearchBoxRef} keyValue={'locationName'} label={transLangKey("SUPPLY_LOCAT")} placeHolder={transLangKey("LOCAT_NM")} style={{width: 300}}/>
        </SearchRow>
      </SearchArea>
      <ButtonArea>
        <LeftButtonArea>
          <GridExcelExportButton type="icon" grid="gridItemShipmentSchedule" options={exportOptions} />
          {/*<GridExcelImportButton type="icon" grid="gridItemShipmentSchedule" />*/}
        </LeftButtonArea>
        <RightButtonArea>
          <GridSaveButton type="icon" grid="gridItemShipmentSchedule" onClick={() => { saveItemShipmentSchedule() }}></GridSaveButton>
        </RightButtonArea>
      </ButtonArea>
      <ResultArea>
        <BaseGrid id="gridItemShipmentSchedule" items={gridItemShipmentScheduleColumns} viewCd="UI_CM_19" gridCd="UI_CM_19-RST_CPT_01" afterGridCreate={afterGridCreate}/>
      </ResultArea>
    </ContentInner>
  )
}

export default ItemShipmentSchedule;
