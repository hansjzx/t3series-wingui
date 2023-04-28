import React, { useEffect, useState, useRef } from "react";
import { ContentInner, SearchArea, SearchRow, useViewStore, BaseGrid, ResultArea, zAxios } from '@zionex/wingui-core/src/common/imports';
import { Grid, Typography } from "@mui/material";
import { setNoneEditableGrid } from "../../common/common";
import DeliveryStatusSummary from "./details/DeliveryStatusSummary";
import DeliveryDelayStatus from "./details/DeliveryDelayStatus";
import DeliveryShortStatus from "./details/DeliveryShortStatus";
import './planproblem.css'
import VersionPlantSearchCondition from "@wingui/view/factoryplan/common/component/VersionPlantSearchCondition";
import { transLangKey } from "@wingui";
import Details from "@wingui/view/factoryplan/common/component/DetailCard"
import { onErrorInput } from "@zionex/wingui-core/src/utils/common";

const problemDetailGridItems = [
  { name: "plantCd", dataType: "text", headerText: " ", visible: false, editable: false },
  { name: "plantNm", dataType: "text", headerText: "FP_PLANT", visible: true, editable: false, width: 100, mergeRule: { criteria: "value" } },
  { name: "woCd", dataType: "text", headerText: "FP_WO_CD", visible: true, editable: false, width: 100 },
  { name: "inventoryCd", dataType: "text", headerText: " ", visible: false, editable: false },
  { name: "inventoryNm", dataType: "text", headerText: "FP_INVENTORY_NM", visible: true, editable: false, width: 100,
    valueCallback: function (provider, dataRow, fieldName, fieldNames, values) {
      let inventoryNm = values[fieldNames.indexOf("inventoryNm")];
      let inventoryCd = values[fieldNames.indexOf("inventoryCd")];
      return (inventoryCd ? inventoryCd : '') + (inventoryNm ? ' (' + inventoryNm + ')' : '');
    }
  },
  { name: "requestQty", dataType: "number", headerText: "FP_REQUEST_QTY", visible: true, editable: false, width: 60, numberFormat: "#,##0.###" },
  { name: "dueDate", dataType: "datetime", headerText: "FP_DUE_DT", visible: true, editable: false, width: 100, format: 'yyyy-MM-dd' },
  { name: "problemTypeCd", dataType: "text", headerText: "FP_PROBLEM_TP_CD", visible: true, editable: false, width: 100,
    valueCallback: function (provider, dataRow, fieldName, fieldNames, values) {
      let problemTypeCd = values[fieldNames.indexOf("problemTypeCd")];
      return transLangKey(problemTypeCd)
    }
  },
  { name: "problemReasonTypeCd", dataType: "text", headerText: "FP_PROBLEM_REASON_TP_CD", visible: true, editable: false, width: 100,
    valueCallback: function (provider, dataRow, fieldName, fieldNames, values) {
      let problemReasonTypeCd = values[fieldNames.indexOf("problemReasonTypeCd")];
      return transLangKey(problemReasonTypeCd)
    }
  },
  { name: "problemInventoryNm", dataType: "text", headerText: "FP_PROBLEM_ITEM_NM", visible: true, editable: false, width: 100,
    valueCallback: function (provider, dataRow, fieldName, fieldNames, values) {
      let problemInventoryNm = values[fieldNames.indexOf("problemInventoryNm")];
      let problemInventoryCd = values[fieldNames.indexOf("problemInventoryCd")];
      return (problemInventoryCd ? problemInventoryCd : '') + (problemInventoryNm ? ' (' + problemInventoryNm + ')' : '');
    }
  },
  { name: "problemInventoryCd", dataType: "text", headerText: " ", visible: false, editable: false },
  { name: "problemRouteCd", dataType: "text", headerText: " ", visible: false, editable: false },
  { name: "problemRouteNm", dataType: "text", headerText: "FP_PROBLEM_ROUTE_NM", visible: true, editable: false, width: 100,
    valueCallback: function (provider, dataRow, fieldName, fieldNames, values) {
      let problemRouteNm = values[fieldNames.indexOf("problemRouteNm")];
      let problemRouteCd = values[fieldNames.indexOf("problemRouteCd")];
      return (problemRouteCd ? problemRouteCd : '') + (problemRouteNm ? ' (' + problemRouteNm + ')' : '');
    }
  },
  { name: "problemResourceCd", dataType: "text", headerText: " ", visible: false, editable: false },
  { name: "problemResourceNm", dataType: "text", headerText: "FP_PROBLEM_RESOURCE_NM", visible: true, editable: false, width: 100,
    valueCallback: function (provider, dataRow, fieldName, fieldNames, values) {
      let problemResourceNm = values[fieldNames.indexOf("problemResourceNm")];
      let problemResourceCd = values[fieldNames.indexOf("problemResourceCd")];
      return (problemResourceCd ? problemResourceCd : '') + (problemResourceNm ? ' (' + problemResourceNm + ')' : '');
    }
  },
];

const PlanResultSummary = (props) => (
  <Details id={props.id} title={transLangKey(props.title)}>
    <Typography variant="h4" gutterBottom>
      {props.text}
    </Typography>
  </Details>
);

function PlanProblem() {
  const versionPlantRef = useRef();
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [problemDetailGrid, setProblemDetailGrid] = useState(null);
  const [detailResult, setDetailResult] = useState({ deliveryStatus: { okCnt: 0, lateCnt: 0, shortCnt: 0 }, planResult: { totalCnt: 0, okRate: 0 } });
  const [problemDelay, setProblemDelay] = useState({ deliveryDelayStatus: {}, planFailStatus: {} });
  const globalButtons = [
    {
      name: "search",
      action: () => versionPlantRef.current.handleSubmit(loadBoard, onErrorInput),
      visible: true,
      disable: false
    }
  ];
  
  useEffect(() => {
    setProblemDetailGrid(getViewInfo(vom.active, 'problemDetailGrid'));
  }, [viewData]);
  useEffect(() => {
    if (problemDetailGrid) {
      setViewInfo(vom.active, 'globalButtons', globalButtons);
      setNoneEditableGrid(problemDetailGrid);
      setGridOptions(problemDetailGrid.gridView);
    }
  }, [problemDetailGrid]);
  function setGridOptions(gridView) {
    if (gridView.id === 'problemDetailGrid') {
      gridView.onCellEdited = function (grid) {
        grid.commit(true);
      }
      setGridFiltering('plantNm');
      setGridFiltering('woCd');
      setGridFiltering('inventoryNm');
      setGridFiltering('problemTypeCd');
      setGridFiltering('problemReasonTypeCd');
      gridView.setFilteringOptions({ selector: { searchIgnoreCase: true, allCheckText: transLangKey("ALL_SELECT"), filtersResetText: transLangKey("RESET_FILTERING"), searchPlaceholder: transLangKey("SEARCH") } });
    }
  }

  function loadBoard() {
    setProblemDelay({ deliveryDelayStatus: {}, planFailStatus: {} });
    const { versionCd } = versionPlantRef.current.getValues();
    if (!versionCd) {
      problemDetailGrid.dataProvider.clearRows();
      setDetailResult({ deliveryStatus: { okCnt: 0, lateCnt: 0, shortCnt: 0 }, planResult: { totalCnt: 0, okRate: 0 } });
      return;
    }
    getKpiResult()
    getProblemStatus()
    loadProblemDetailGrid()
  }
  function getKpiResult() {
    const { versionCd, plantCd } = versionPlantRef.current.getValues();
    zAxios.get(`${baseURI()}factoryplan/problem-analysis/versions/${versionCd}/kpi`, {
      params: {
        'plant-cds': encodeURI(plantCd)
      }
    }).then(function (res) {
      setDetailResult({
        planResult: { totalCnt: res.data.totalCnt, okRate: res.data.okRate },
        deliveryStatus: { okCnt: res.data.okCnt, lateCnt: res.data.lateCnt, shortCnt: res.data.shortCnt }
      })

    }).catch(function (err) {
      console.log(err);
    }).then(function () {
    });
  }
  function getProblemStatus() {
    const { versionCd, plantCd } = versionPlantRef.current.getValues();
    zAxios.get(`${baseURI()}factoryplan/problem-analysis/versions/${versionCd}/problem-status`, {
      params: {
        'plant-cds': encodeURI(plantCd)
      }
    }).then(function (res) {
      setProblemDelay(res.data)
    }).catch(function (err) {
      console.log(err);
    }).then(function () {
    });
  }
  function loadProblemDetailGrid() {
    const { versionCd, plantCd } = versionPlantRef.current.getValues();
    zAxios.get(`${baseURI()}factoryplan/problem-analysis/versions/${versionCd}/problem-status/detail`, {
      params: {
        'plant-cds': encodeURI(plantCd)
      }
    }).then(function (res) {
      problemDetailGrid.dataProvider.fillJsonData(res.data);
    }).catch(function (err) {
      console.log(err);
    }).then(function () {
    });
  }

  function setGridFiltering(columnCd) {
    let filters = [];

    let menuCodeValues = problemDetailGrid.dataProvider.getFieldValues(columnCd, 0, -1);
    if (menuCodeValues !== null) {
      menuCodeValues.unique().sort().forEach(function (mainMenuCode, index) {
        filters.push({
          name: mainMenuCode,
          text: mainMenuCode,
          tag: index,
          description: mainMenuCode,
          callback: function (ds, dataRow, level, field, filter, value) {
            if (value === filter.text) {
              return true;
            }
          }
        });
      });
      problemDetailGrid.gridView.setColumnFilters(columnCd, filters);
    } else {
      problemDetailGrid.gridView.setColumnProperty(columnCd, "autoFilter", true);
    }
  }
  return (
    <ContentInner>
      <SearchArea>
        <SearchRow>
          <VersionPlantSearchCondition ref={versionPlantRef} />
        </SearchRow>
      </SearchArea>
      <ResultArea>
        <Grid container spacing={13} sx={{ height: 1, mt: 0, display: 'flex', justifyContent: 'center' }}>
          <Grid item xs={4} sx={{ height: 3/5 }}>
            <Grid container spacing={13} sx={{ height: 1, mt: 0 }}>
              <Grid item xs={6} sx={{ height: 1/4, pt: '0 !important' }}>
                <PlanResultSummary id="orderCount" title="FP_ORDER_CNT" text={`${detailResult.planResult.totalCnt} ${transLangKey("FP_ORDERS")}`} />
              </Grid>
              <Grid item xs={6} sx={{ height: 1/4, pt: '0 !important' }}>
                <PlanResultSummary id="onTimeDeliveryRate" title="FP_ONTIME_DELIVERY_RATE" text={`${detailResult.planResult.okRate} %`} />
              </Grid>
              <Grid item xs={12} sx={{ height: 3/4 }}>
                <DeliveryStatusSummary data={detailResult.deliveryStatus} cardtitle={true} height={'245px'} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={3.2} sx={{ height: 3/5 }}>
            <DeliveryDelayStatus data={problemDelay.deliveryDelayStatus} />
          </Grid>
          <Grid item xs={3.2} sx={{ height: 3/5 }}>
            <DeliveryShortStatus data={problemDelay.planFailStatus} />
          </Grid>
          <Grid item xs={10.4} sx={{ height: 2/5 }}>
            <Details id="problemDetails" title={transLangKey('FP_PROBLEM_STATUS_DETAIL')}>
              <BaseGrid items={problemDetailGridItems} id="problemDetailGrid" className="white-skin" />
            </Details>
          </Grid>
        </Grid>
      </ResultArea>
    </ContentInner>
  )
}

export default PlanProblem
