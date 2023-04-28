import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import {
  getCodeEditor, setCellButtonRenderer, setCodeColumnStyle, setEditableGrid
} from '../../common/common';
import {
  ButtonArea,
  ContentInner,
  GridAddRowButton,
  GridDeleteRowButton,
  GridExcelExportButton,
  GridExcelImportButton,
  GridSaveButton,
  LeftButtonArea,
  ResultArea,
  RightButtonArea,
  SearchArea,
  SearchRow,
  useViewStore,
  BaseGrid,
  InputField,
  zAxios,
  StatusArea, GridCnt
} from '@zionex/wingui-core/src/common/imports';
import InventoryPopup from '../../common/popup/InventoryPopup';
import OrderPopup from '../../common/popup/OrderPopup';
import '../../common/common.css';
import {transLangKey} from "@wingui";

const infiniteTpCdEditor = getCodeEditor('FP_INFINITE_TP_CD');
const exportOptions = {
  lookupDisplay: false,
  importExceptFields: { 0: 'id' },
  headerDepth: 2
};
const stockGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false },
  { name: "stockCd", dataType: "text", headerText: "STOCK_CD", visible: true, editable: false, width: 150, autoFilter: true,
    validRules: [{ criteria: "required"}]
  },
  { name: "descTxt", dataType: "text", headerText: "FP_DESC_TXT", visible: true, editable: true, width: 80,
    editor: { type: "text", maxLength: 500 }
  },
  { name: "itemDetailGroup", dataType: "group", orientation: "horizontal", headerText: "FP_ITEM_DETAIL", expandable: true, expanded: false,
    childs: [
      { name: "inventoryCode", dataType: "text", headerText: "FP_INVENTORY_CD", visible: true, editable: true, width: 150, autoFilter: true, groupShowMode: "always",
        validRules: [{ criteria: "required"}]
      },
      { name: "inventoryName", dataType: "text", headerText: "STOCK_CD", visible: true, editable: false, width: 200, autoFilter: true, groupShowMode: "expand" },
      { name: "itemCode", dataType: "text", headerText: "FP_ITEM_CD", visible: true, editable: false, width: 150, autoFilter: true, groupShowMode: "always" },
      { name: "itemName", dataType: "text", headerText: "FP_ITEM_NM", visible: true, editable: false, width: 200, autoFilter: true, groupShowMode: "expand" },
      { name: "itemClassCode", dataType: "text", headerText: "FP_ITEM_CLASS_CD", visible: true, editable: false, width: 80, autoFilter: true, textAlignment: "center", groupShowMode: "expand" }
    ]
  },  
  { name: "usableTs", dataType: "datetime", headerText: "USABLE_DATE", visible: true, editable: true, width: 125 },
  { name: "expireTs", dataType: "datetime", headerText: "EXPIRE_DATE", visible: true, editable: true, width: 125 },
  { name: "qty", dataType: "number", headerText: "AVAIL_QTY", visible: true, editable: true, width: 80, defaultValue: "0",
    styleCallback: function (grid, dataCell) {
      if (dataCell.value === 0) {
        return { styleName: 'editable-number-column text-color-black' }
      }
    },
    editor: { type: "number", editFormat: "#,##0.0####", maxIntegerLength: 20 }, positiveOnly: true,
    numberFormat: "#,##0.0####",
    validRules: [{ criteria: "required"}]
  },
  { name: "orderReceiptGroup", dataType: "group", orientation: "horizontal", headerText: "FP_ITEM_DETAIL",
    childs: [
      { name: "orderNumber", dataType: "text", headerText: "FP_ORDER_NUMBER", visible: true, editable: false, width: 125 },
      { name: "orderTs", dataType: "datetime", headerText: "PO_DATE", visible: true, editable: false, width: 125 },
      { name: "account", dataType: "text", headerText: "SALES", visible: true, editable: false, width: 80 },
      { name: "orderManager", dataType: "text", headerText: "FP_ORDER_MANAGER", visible: true, editable: false, width: 125 },
      { name: "expectedReceiptTs", dataType: "datetime", headerText: "FP_EXPECTED_RECEIPT_DATE", visible: true, editable: false, width: 125 },
      { name: "receiptTs", dataType: "datetime", headerText: "RECEIPT_DATE", visible: true, editable: true, width: 125,
        validRules: [{ criteria: "required"}]
      },
    ]
  },  
  { name: "priority", dataType: "number", headerText: "FP_PRIORITY", visible: true, editable: true, width: 80, defaultValue: 1,
    positiveOnly: true, integerOnly: true, numberFormat: "#,##0.###",
    editor: { type: "number", maxIntegerLength: 20 }
  },
  { name: "orderPeggingCd", dataType: "text", headerText: "FP_ORDER_PEGGING", visible: true, editable: true, width: 80 },
  { name: "sideInfoGroup", dataType: "group", orientation: "horizontal", headerText: "FP_EXTRA_INFO", expandable: true, expanded: false,
    childs: [
      { name: "activeYn", dataType: "boolean", headerText: "FP_USE_YN", visible: true, editable: true, width: 80, defaultValue: true, groupShowMode: "always",
        validRules: [{ criteria: "required"}]
      },
      { name: "infiniteTpCd", dataType: "text", headerText: "FP_INFINITE_STOCK_USE_TP", visible: true, editable: true, width: 120, textAlignment: "center", groupShowMode: "expand",
        lookupDisplay: true, styleCallback: () => infiniteTpCdEditor,
        editor: { type: "list", textReadOnly: true, domainOnly: true }
      }
    ]
  },
  {
    name: "auditGroup", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", expandable: true, expanded: false,
    childs: [
      { name: "updatedBy", dataType: "text", headerText: "FP_UPDATED_BY", visible: true, editable: false, width: 80, groupShowMode: "expand", textAlignment: "center" },
      { name: "updatedAt", dataType: "datetime", headerText: "FP_UPDATED_AT", visible: true, editable: false, width: 125, groupShowMode: "always" },
      { name: "createdBy", dataType: "text", headerText: "FP_CREATED_BY", visible: true, editable: false, width: 80, groupShowMode: "expand", textAlignment: "center" },
      { name: "createdAt", dataType: "datetime", headerText: "FP_CREATED_AT", visible: true, editable: false, width: 125, groupShowMode: "expand" },
    ]
  }
];

function Stock () {
  const location = useLocation();
  const { control, getValues, setValue } = useForm({
    defaultValues: { stockParam: '', }
  });
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [stockGrid, setStockGrid] = useState(null);
  const [orderCds, setOrderCds] = useState([]);
  const [inventoryPopupVisible, setInventoryPopupVisible] = useState(false);
  const [orderPopupVisible, setOrderPopupVisible] = useState(false);
  const globalButtons = [
    {
      name: "search",
      action: () => loadData(),
      visible: true,
      disable: false
    }
  ];

  useEffect(() => {
    if (stockGrid) {
      setViewInfo(vom.active, 'globalButtons', globalButtons);
      setEditableGrid(stockGrid);
      setGridOptions(stockGrid.gridView);
      if (location.state !== undefined && location.state !== null) {
        setValue('stockParam', location.state.stockCd);
        loadData(location.state.stockCd);
      } else {
        loadData();
      }
    }
  }, [location, stockGrid]);

  useEffect(() => {
    setStockGrid(getViewInfo(vom.active, 'stockGrid'));
  }, [viewData]);

  function setGridOptions(gridView) {
    if (gridView.id === 'stockGrid') {
      setCellButtonRenderer(gridView, 'inventoryCode');
      setCellButtonRenderer(gridView, 'orderPeggingCd');

      let stockCd = gridView.columnByName('stockCd');
      stockCd.styleCallback = setCodeColumnStyle;
      
      gridView.onCellItemClicked = function (grid, index, clickData) {
        if (clickData.column === 'inventoryCode') {
          setInventoryPopupVisible(true);
        } else if (clickData.column === 'orderPeggingCd') {
          const orderCds = grid.getValue(index.itemIndex, clickData.column);
          setOrderCds(orderCds ? orderCds.split(', ') : []);
          setOrderPopupVisible(true);
        }
      };
    }
  }

  function loadData(stockCd) {
    zAxios.get(baseURI() + 'factoryplan/master/stock/stocks', {
      params: {
        'stock': (typeof stockCd === 'string') ? stockCd : getValues('stockParam')
      }
    })
      .then(function (res) {
        stockGrid.dataProvider.fillJsonData(res.data);
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
        stockGrid.gridView.setAllCheck(false, false);
      });
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      loadData();
    }
  }

  function setInventoryValues(values) {
    const gridView = stockGrid.gridView;
    const index = gridView.getCurrent().itemIndex;
    gridView.setValues(index, {...values, inventoryCode: values.inventoryCd, inventoryName: values.inventoryNm });
    gridView.commit(true);
  }

  function setOrderValues(values) {
    const gridView = stockGrid.gridView;
    const index = gridView.getCurrent().itemIndex;
    const orderCds = values.map(row => row['orderCd']).join(', ');
    gridView.setValue(index, 'orderPeggingCd', orderCds);
    gridView.commit(true);
  }

  return (
    <>
      <ContentInner>
        <InventoryPopup open={inventoryPopupVisible} onClose={() => setInventoryPopupVisible(false)} confirm={setInventoryValues}></InventoryPopup>
        <OrderPopup open={orderPopupVisible} selected={orderCds} onClose={() => setOrderPopupVisible(false)} confirm={setOrderValues}></OrderPopup>
        <SearchArea>
          <SearchRow>
            <InputField control={control} label={transLangKey("UI_FP_STOCK")} name="stockParam" width="100%" onKeyPress={handleKeyPress} />
          </SearchRow>
        </SearchArea>
        <ButtonArea>
          <LeftButtonArea>
            <GridExcelExportButton grid="stockGrid" options={exportOptions} />
            {/*<GridExcelImportButton grid="stockGrid" />*/}
          </LeftButtonArea>
          <RightButtonArea>
            <GridAddRowButton grid="stockGrid"/>
            <GridDeleteRowButton grid="stockGrid" url="factoryplan/master/stock/stocks/delete" onAfterDelete={loadData} />
            <GridSaveButton grid="stockGrid" url="factoryplan/master/stock/stocks" onAfterSave={loadData} />
          </RightButtonArea>
        </ButtonArea>
        <ResultArea>
          <BaseGrid items={stockGridItems} id="stockGrid" className="white-skin"></BaseGrid>
        </ResultArea>
        <StatusArea show={false} message={''}>
          <GridCnt grid="stockGrid" format={'{0} ' + transLangKey('CASES') + ' ' + transLangKey('MSG_0010')}></GridCnt>
        </StatusArea>
      </ContentInner>
    </>
  )
}

export default Stock;
