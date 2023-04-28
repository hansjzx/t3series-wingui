import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useViewStore, BaseGrid, PopupDialog, zAxios } from '@zionex/wingui-core/src/common/imports';
import { setNoneEditableGrid } from '../common';

const orderPopupGridItems = [
  { name: "woCd", dataType: "text", headerText: "FP_ORDER_CD", visible: true, editable: false, width: 130, autoFilter: true },
  { name: "inventoryCode", dataType: "text", headerText: "FP_INVENTORY_CD", visible: true, editable: false, width: 130, autoFilter: true },
  { name: "inventoryName", dataType: "text", headerText: "FP_INVENTORY_NAME", visible: true, editable: false, width: 180 },
  { name: "requestQty", dataType: "number", headerText: "FP_REQUEST_QTY", numberFormat: "#,##0.#####", visible: true, editable: false, width: 130 },
  { name: "dueDt", dataType: "datetime", headerText: "FP_DUE_DT", visible: true, editable: false, width: 150 },
  { name: "descTxt", dataType: "text", headerText: "FP_DESC_TXT", visible: true, editable: false, width: 80 },
];

function OrderPopup(props) {
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const [orderPopupGrid, setOrderPopupGrid] = useState(null);

  useEffect(() => {
    setOrderPopupGrid(getViewInfo(vom.active, 'orderPopupGrid'));
  }, [viewData]);

  useEffect(() => {
    if (orderPopupGrid) {
      setNoneEditableGrid(orderPopupGrid);
      setGridOptions(orderPopupGrid.gridView);

      loadData().then(() => {
        if (props.selected && props.selected.length > 0) {
          const dataProvider = orderPopupGrid.dataProvider;
          const dataRows = [];
          props.selected.forEach(function (orderCd) {
            const searchData = dataProvider.searchData({fields: ['woCd'], value: orderCd});
            if (searchData) {
              dataRows.push(searchData.dataRow);
            }
          });
          orderPopupGrid.gridView.checkRows(dataRows, true);
        }
      });
    }
  }, [orderPopupGrid]);

  function setGridOptions(gridView) {
    if (gridView.id === 'orderPopupGrid') {
      gridView.setCheckBar({ visible: true, syncHeadCheck: true });
    }
  }

  function loadData() {
    return zAxios.get(baseURI() + 'factoryplan/orders', {
      fromPopup: true
    })
      .then(function (res) {
        orderPopupGrid.dataProvider.fillJsonData(res.data);
      })
      .catch(function (err) {
        console.log(err);
      })
  }

  function selectRows() {
    const gridView = orderPopupGrid.gridView;
    const values = gridView.getCheckedRows().map(function (index) {
      let row = gridView.getValues(index);
      row['orderCd'] = row.woCd;
      return row;
    });
    props.confirm(values);
    props.onClose();
  }
  
  return (
    <>
      <PopupDialog type="OKCANCEL" open={props.open} onClose={props.onClose} onSubmit={selectRows} checks={[orderPopupGrid]} title={transLangKey("FP_ORDER_SELECT")} resizeHeight={600} resizeWidth={860}>
        <Box style={{ height: "100%" }}>
          <BaseGrid id="orderPopupGrid" items={orderPopupGridItems} className="white-skin" />
        </Box>
      </PopupDialog>
    </>
  )
}

export default OrderPopup;
