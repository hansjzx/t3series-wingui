import React, { useEffect, useRef } from 'react';
import { ContentInner, ResultArea, SearchArea, SearchRow, useViewStore, TreeGrid, zAxios
} from '@zionex/wingui-core/src/common/imports';
import { setNoneEditableGrid } from '../../common/common';
import './ordertracking.css';

import VersionPlantSearchCondition from "@wingui/view/factoryplan/common/component/VersionPlantSearchCondition";
import { onErrorInput } from "@zionex/wingui-core/src/utils/common";

let orderTrackingGrid;
let orderTrackingGridItems = [
  { name: "mainCol", dataType: "text", headerText: "FP_ORDER_BOM", visible: true, editable: false, width: 120, autoFilter: true,
    styleCallback: function (grid, dataCell) {
      if (grid.getDataSource().getLevel(dataCell.index.dataRow) === 2) {
        const endTs = grid.getValue(dataCell.index.itemIndex, "endTs"), dueDt = grid.getValue(dataCell.index.itemIndex, "dueDt");
        if (endTs > dueDt) return { styleName: 'red-text' };
      }
    },
  },
  { name: "resourceCd", dataType: "text", headerText: " ", visible: false, editable: false },
  { name: "resourceNm", dataType: "text", headerText: " ", visible: false, editable: false },
  { name: "routeCd", dataType: "text", headerText: " ", visible: false, editable: false },
  { name: "routeNm", dataType: "text", headerText: " ", visible: false, editable: false },
  { name: "route", dataType: "text", headerText: "FP_ROUTE_STOCK", visible: true, editable: false, width: 90,
    valueCallback: function (provider, dataRow, fieldName, fieldNames, values) {
      const routeCd = values[fieldNames.indexOf('routeCd')], routeNm = values[fieldNames.indexOf('routeNm')];
      if (routeCd && routeNm) {
        return routeCd + ' (' + routeNm + ')';
      } else if (routeCd) {
        return routeCd;
      }
    }
  },
  { name: "resource", dataType: "text", headerText: "FP_RESOURCE", visible: true, editable: false, width: 90,
    valueCallback: function (provider, dataRow, fieldName, fieldNames, values) {
      const resourceCd = values[fieldNames.indexOf('resourceCd')], resourceNm = values[fieldNames.indexOf('resourceNm')];
      if (resourceCd && resourceNm) {
        return resourceCd + ' (' + resourceNm + ')';
      }
    }
  },
  { name: "uom", dataType: "text", headerText: "UOM", visible: true, editable: false, width: 50 },
  { name: "qty", dataType: "number", headerText: "QTY", visible: true, editable: false, width: 50 },
  { name: "startTs", dataType: "datetime", headerText: "FP_START_TS", visible: true, editable: false, width: 80 },
  { name: "endTs", dataType: "datetime", headerText: "FP_END_TS", visible: true, editable: false, width: 80 },
  { name: "dueDt", dataType: "datetime", headerText: "DUE_DATE", visible: true, editable: false, width: 80 }
];

function OrderTracking() {
  const versionPlantRef = useRef();
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const globalButtons = [
    {
      name: "search",
      action: () => versionPlantRef.current.handleSubmit(loadData, onErrorInput),
      visible: true,
      disable: false
    }
  ];
  
  useEffect(() => setViewInfo(vom.active, 'globalButtons', globalButtons), []);

  useEffect(() => {
    orderTrackingGrid = getViewInfo(vom.active, 'orderTrackingGrid');
    setNoneEditableGrid(orderTrackingGrid);
    setGridOptions(orderTrackingGrid.gridView);
  }, [viewData]);

  function setGridOptions(gridView) {
    if (gridView.id === 'orderTrackingGrid') {
      gridView.setFilteringOptions({ enabled: true, selector: { searchIgnoreCase: true } });
      gridView.setTreeOptions({
        iconImagesRoot: "images/icons/",
        iconImages: ["gear_24.png", "cube_yellow_24.png", "optionpane_warning.png", "cpu.png"],
        iconCallback: function (tree, itemIndex, dataRow, iconIndex) {
          const level = tree.getDataSource().getLevel(dataRow);
          if (level === 1) {
            return 0;
          } else if (level === 2) {
            const endTs = tree.getValue(itemIndex, "endTs");
            const dueDt = tree.getValue(itemIndex, "dueDt");
            return (endTs > dueDt) ? 2 : 1;
          } else {
            return 3;
          }
        }
      });
    }
  }
  
  function loadData() {
    const { versionCd, plantCd } = versionPlantRef.current.getValues();
    zAxios.get(baseURI() + 'factoryplan/order-tracking/orders', {
      params: {
        'version-cd': versionCd,
        'plant-cds': encodeURI(plantCd)
      }
    })
      .then(function (response) {
        let responseData = response.data;
        orderTrackingGrid.dataProvider.setObjectRows({ 'rows': responseData }, 'rows', '', '');
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
        orderTrackingGrid.gridView.expandAll(1);
      });
  }

  return (
    <ContentInner>
      <SearchArea>
        <SearchRow>
          <VersionPlantSearchCondition ref={versionPlantRef} initialized={loadData} />
        </SearchRow>
      </SearchArea>
      <ResultArea>
        <TreeGrid id="orderTrackingGrid" items={orderTrackingGridItems} className="white-skin" />
      </ResultArea>
    </ContentInner>
  )
}

export default OrderTracking;
