import React, { useEffect, useState, useRef } from 'react';
import { useContentStore } from '@zionex/wingui-core/src/store/contentStore';
import RealGrid from 'realgrid';
import {
  ContentInner, ResultArea, SearchArea, SearchRow, useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';
import PlanResultDetailPopup from './PlanResultDetailPopup';
import './planresult.css'

import VersionPlantSearchCondition from "@wingui/view/factoryplan/common/component/VersionPlantSearchCondition";
import { onErrorInput } from "@zionex/wingui-core/src/utils/common";

let dataProvider;
let planResultPivot;

function PlanResult() {
  const versionPlantRef = useRef();
  const activeViewId = useContentStore(state => state.activeViewId);
  const [setViewInfo] = useViewStore(state => [state.setViewInfo]);
  const [detailParams, setDetailParams] = useState({});
  const [popupVisible, setPopupVisible] = useState(false);  
  const globalButtons = [
    {
      name: "search",
      action: () => versionPlantRef.current.handleSubmit(loadPlanResultPivot, onErrorInput),
      visible: true,
      disable: false
    }
  ];
  
  useEffect(() => {
    createRealPivot();
    setViewInfo(vom.active, 'globalButtons', globalButtons);
  }, []);
  
  useEffect(() => {
    planResultPivot.setDisplayOptions({ showTooltip: !popupVisible, showLabelTooltip: !popupVisible });
  }, [popupVisible]);
  
  function createRealPivot() {    
    dataProvider = new RealGrid.LocalDataProvider();
    planResultPivot = new RealPivot("planResultPivot");
    planResultPivot.setDataProvider(dataProvider);
    dataProvider.setFields([
      {fieldName: "plantCd"},
      {fieldName: "resourceCd"},
      {fieldName: "itemCd"}
    ]);
    planResultPivot.setDisplayOptions({
      rowGroupWidth: 180, rowLabelWidth: 180, rowHeight: 30, emptyMessage: transLangKey("MSG_NO_DATA"),
      showProgress: true, showFocus: true, showFocusGuide: true, keepLabelSpace: true, showTooltip: true, showLabelTooltip: true
    });
    planResultPivot.setOptions({
      summary: {
        rowTotalText: transLangKey("FP_TOTAL_SUM"),
        columnTotalText: transLangKey("FP_TOTAL_SUM")
      }
    });
    planResultPivot.setHeaderOptions({ menuButtonVisible: false, titleHeight: 30 });

    let fields = [{
      fieldName: "resourceCd"
    }, {
      fieldName: "resourceNm"
    }, {
      fieldName: "itemCd"
    }, {
      fieldName: "itemNm"
    }, {
      fieldName: "itemUom"
    }, {
      fieldName: "qty",
      dataType: "number"
    }, {
      fieldName: "startTs",
      dataType: "datetime",
      datetimeFormat: "yyyy-MM-dd"
    }];

    dataProvider.setFields(fields);

    planResultPivot.setFieldMapping([{
      name: "resourceCd",
      fieldHeader: transLangKey("FP_RESOURCE"),
      sourceField: "resourceCd",
      displayField: "resourceNm",
      valueEnable: false
    }, {
      name: "itemCd",
      fieldHeader: transLangKey("FP_ITEM"),
      sourceField: "itemCd",
      displayField: "itemNm",
      valueEnable: false
    }, {
      name: "qty",
      sourceField: "qty",
      fieldHeader: transLangKey("FP_QTY"),
      numberFormat: "#,##0.###",
      labelEnable: false,
      filterEnable: false
    }, {
      name: "startTsYear",
      sourceField: "startTs",
      dateType: "year",
      fieldHeader: transLangKey("FP_YEAR"),
      displayFormat: "${value}" + transLangKey("FP_YEAR"),
      summaryFormat: "${value}" + transLangKey("FP_YEAR") + " " + transLangKey("SUM"),
      valueEnable: false
    }, {
      name: "startTsQuarter",
      sourceField: "startTs",
      dateType: "quarter",
      fieldHeader: transLangKey("FP_QUARTER"),
      displayFormat: "${value}" + transLangKey("FP_QUARTER"),
      summaryFormat: "${value}" + transLangKey("FP_QUARTER") + " " + transLangKey("SUM"),
      valueEnable: false
    }, {
      name: "startTsMonth",
      sourceField: "startTs",
      dateType: "month",
      fieldHeader: transLangKey("FP_MONTH"),
      displayFormat: "${value}" + transLangKey("FP_MONTH"),
      summaryFormat: "${value}" + transLangKey("FP_MONTH") + " " + transLangKey("SUM"),
      valueEnable: false
    }, {
      name: "startTsWeek",
      sourceField: "startTs",
      dateType: "weekofyear",
      fieldHeader: transLangKey("FP_WEEK"),
      displayFormat: "${value}" + transLangKey("FP_WEEK"),
      summaryFormat: "${value}" + transLangKey("FP_WEEK") + " " + transLangKey("SUM"),
      valueEnable: false
    }, {
      name: "startTsDay",
      sourceField: "startTs",
      dateType: "day",
      fieldHeader: transLangKey("FP_DAY"),
      displayFormat: "${value}" + transLangKey("FP_DAY"),
      summaryFormat: "${value}" + transLangKey("FP_DAY") + " " + transLangKey("SUM"),
      valueEnable: false
    }]);

    planResultPivot.setPivotFields({
      columns: ["startTsYear", "startTsMonth", "startTsWeek", "startTsDay"],
      rows: ["resourceCd", "itemCd"],
      values: [{
        name: "qty",
        expression: "sum",
        text: transLangKey("SUM")
      }]
    });

    planResultPivot.onDblClick = function (pivot, type, index) {
      const { rows, columns  } = index;
      if (type === 'body' && (columns.startTsYear && columns.startTsMonth && columns.startTsDay) && !(Object.keys(columns).includes('__sum') || Object.keys(columns).includes('valueField'))) {
        const { versionCd, plantCd } = versionPlantRef.current.getValues();
        let resource = rows.resourceCd
        let item = rows.itemCd
        if (rows.resourceCd === undefined) {
          resource = '';
        }
        if (rows.itemCd === undefined) {
          item = '';
        }
        const params = {
          versionCd, plantCd,
          detailDate: new Date(columns.startTsYear, columns.startTsMonth - 1, columns.startTsDay).format('yyyy-MM-dd'),
          resourceCd: resource,
          itemCd: item
        }
        setDetailParams(params);
        setPopupVisible(true);
      }
    }
    let dateString = new Date().toCurrentDateString();
    dateString = dateString.replace(/\:/g, '-').replace('.', '-').replace(' ', '-');
    let fileName = transLangKey(activeViewId) + '_' + dateString;

    planResultPivot.setContextMenu([
      {
        text: transLangKey("EXCEL_EXPORT"),
        callback: function () {
          planResultPivot.exportGrid({
            target: "local",
            fileName: fileName + ".xlsx"
          });
        }
      }
    ]);
  }

  function loadPlanResultPivot() {
    const { versionCd, plantCd } = versionPlantRef.current.getValues();
    if (!versionCd) {
      dataProvider.clearRows();
      return;
    }
    zAxios.get(baseURI() + 'factoryplan/plan-result/versions/' + versionCd, {
      params: {
        'plant-cds': encodeURI(plantCd)
      }
    }).then(function (res) {
      res.data.map(r => {
        r.resourceNm = r.resourceCd + "(" + r.resourceNm + ")"
        r.itemNm = r.itemNm + "(" + r.itemUom + ")"
      })
      dataProvider.fillJsonData(res.data);
      planResultPivot.drawView();

    }).catch(function (err) {
      console.log(err);
    }).then(function () {
    });
  }
  return <>
    <ContentInner>
      <PlanResultDetailPopup open={popupVisible} onClose={() => setPopupVisible(false)} params={detailParams}></PlanResultDetailPopup>
      <SearchArea>
        <SearchRow>
          <VersionPlantSearchCondition ref={versionPlantRef} />
        </SearchRow>
      </SearchArea>
      <ResultArea>
        <div id="planResultPivot" style={{ height: "100%", width: "100%" }} />
      </ResultArea>
    </ContentInner>
  </>
}

export default PlanResult;
