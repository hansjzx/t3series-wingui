import React, { useEffect, useState, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { setNoneEditableGrid } from '../../common/common';
import {
  ButtonArea, ContentInner, GridExcelExportButton, LeftButtonArea, ResultArea, SearchArea,
  SearchRow, BaseGrid, useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';
import '../../common/common.css';
import VersionPlantSearchCondition from "@wingui/view/factoryplan/common/component/VersionPlantSearchCondition";
import { onErrorInput } from "@zionex/wingui-core/src/utils/common";

const exportOptions = {
  lookupDisplay: false,
  importExceptFields: { 0: 'id' },
  headerDepth: 2
};
const stockResultGridItems = [
  { name: "stockCd", dataType: "text", headerText: "STOCK_CD", visible: true, editable: false, width: 150, autoFilter: true, styleName: "link-column", mergeRule: { criteria: "value" } },
  { name: "descTxt", dataType: "text", headerText: "FP_DESC_TXT", visible: true, editable: false, width: 80, mergeRule: { criteria: "values['stockCd'] + value" } },
  { name: "itemDetailGroup", dataType: "group", orientation: "horizontal", headerText: "FP_ITEM_DETAIL", expandable: true, expanded: false,
    childs: [
      { name: "inventoryCd", dataType: "text", headerText: "FP_INVENTORY_CD", visible: true, editable: false, width: 150, autoFilter: true, groupShowMode: "always",
        mergeRule: { criteria: "values['stockCd'] + value" } },
      { name: "inventoryNm", dataType: "text", headerText: "FP_INVENTORY_NAME", visible: true, editable: false, width: 200, autoFilter: true, groupShowMode: "expand",
        mergeRule: { criteria: "values['stockCd'] + value" } },
      { name: "itemCd", dataType: "text", headerText: "FP_ITEM_CD", visible: true, editable: false, width: 150, autoFilter: true, groupShowMode: "always",
        mergeRule: { criteria: "values['stockCd'] + value" } },
      { name: "itemNm", dataType: "text", headerText: "FP_ITEM_NM", visible: true, editable: false, width: 200, autoFilter: true, groupShowMode: "expand",
        mergeRule: { criteria: "values['stockCd'] + value" } },
      { name: "itemClassCd", dataType: "text", headerText: "FP_ITEM_CLASS_CD", visible: true, editable: false, width: 80, autoFilter: true, textAlignment: "center", groupShowMode: "expand",
        mergeRule: { criteria: "values['stockCd'] + value" } }
    ]
  },
  { name: "supplyGroup", dataType: "group", orientation: "horizontal", headerText: "FP_SUPPLY", expandable: true, expanded: false,
    childs: [
      { name: "usableTs", dataType: "datetime", headerText: "USABLE_DATE", visible: true, editable: false, width: 125, groupShowMode: "always",
        mergeRule: { criteria: "values['stockCd'] + value" } },
      { name: "usableQty", dataType: "number", headerText: "AVAIL_QTY", visible: true, editable: false, width: 80, numberFormat: "#,##0.#####", groupShowMode: "always",
        mergeRule: { criteria: "values['stockCd'] + value" } },
      { name: "remainQty", dataType: "number", headerText: "REMAIN_QTY", visible: true, editable: false, width: 80, numberFormat: "#,##0.#####", groupShowMode: "always",
        mergeRule: { criteria: "values['stockCd'] + value" } },
      { name: "expireTs", dataType: "datetime", headerText: "EXPIRE_DATE", visible: true, editable: false, width: 125, groupShowMode: "expand",
        mergeRule: { criteria: "values['stockCd'] + value" } },
      { name: "createdBy", dataType: "text", headerText: "FP_CREATED_BY", visible: true, editable: false, width: 125, groupShowMode: "expand",
        mergeRule: { criteria: "values['stockCd'] + value"} }
    ]
  },
  { name: "consumptionGroup", dataType: "group", orientation: "horizontal", headerText: "FP_CONSUMPTION", expandable: false, expanded: false,
    childs: [
      { name: "usedTs", dataType: "datetime", headerText: "FP_USED_TS", visible: true, editable: false, width: 125 },
      { name: "usedQty", dataType: "number", headerText: "FP_USED_QTY", visible: true, editable: false, width: 80, numberFormat: "#,##0.#####" },
      { name: "woCd", dataType: "text", headerText: "FP_WORK_ORDER_CODE", visible: true, editable: false, width: 125 },
      { name: "soCd", dataType: "text", headerText: "FP_SO_CD", visible: true, editable: false, width: 125 },
      { name: "isPegging", dataType: "boolean", headerText: "FP_PEGGING_YN", visible: true, editable: false, width: 125 }
    ]
  }
];

function StockResult() {
  const versionPlantRef = useRef();
  const history = useHistory();
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [stockResultGrid, setStockResultGrid] = useState(null);
  const globalButtons = [
    {
      name: "search",
      action: () => versionPlantRef.current.handleSubmit(loadData, onErrorInput),
      visible: true,
      disable: false
    }
  ];
  
  useEffect(() => {
    setStockResultGrid(getViewInfo(vom.active, 'stockResultGrid'));
  }, [viewData]);

  useEffect(() => {
    if (stockResultGrid) {
      setViewInfo(vom.active, 'globalButtons', globalButtons);
      setNoneEditableGrid(stockResultGrid);
      setGridOptions(stockResultGrid.gridView);
    }
  }, [stockResultGrid]);

  function setGridOptions(gridView) {
    if (gridView.id === 'stockResultGrid') {
      gridView.onCellClicked = function (grid, clickData) {
        if (clickData.column === 'stockCd') {
          const stockCd = grid.getValue(clickData.itemIndex, 'stockCd');
          history.push({ pathname: '/setting/dataintegration/datafp/stock', state: { stockCd } });
        }
      };
    }
  }

  function loadData() {
    const { versionCd, plantCd } = versionPlantRef.current.getValues();
    zAxios.get(baseURI() + 'factoryplan/stock-result/stock-outputs', {
      params: {
        'version-cd': versionCd,
        'plant-cds': encodeURI(plantCd)
      }
    })
      .then(function (res) {
        stockResultGrid.dataProvider.fillJsonData(res.data);
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
      });
  }

  return (
    <>      
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <VersionPlantSearchCondition ref={versionPlantRef} />
          </SearchRow>
        </SearchArea>
        <ButtonArea>
          <LeftButtonArea>
            <GridExcelExportButton grid="stockResultGrid" options={exportOptions} />
          </LeftButtonArea>
        </ButtonArea>
        <ResultArea>
          <BaseGrid items={stockResultGridItems} id="stockResultGrid" className="white-skin" />
        </ResultArea>
      </ContentInner>
    </>
  )
}

export default StockResult;
