import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { setNoneEditableGrid } from '../../common/common';
import {
  ButtonArea, ContentInner, GridExcelExportButton, LeftButtonArea, ResultArea, SearchArea,
  SearchRow, useViewStore, InputField, BaseGrid, zAxios
} from '@zionex/wingui-core/src/common/imports';
import { Box } from '@mui/material';
import UtilizationChart from './UtilizationChart';
import './resourceutilization.css';
import '../../common/common.css';
import VersionPlantSearchCondition from "@wingui/view/factoryplan/common/component/VersionPlantSearchCondition";
import { onErrorInput } from "@zionex/wingui-core/src/utils/common";

let policyDetails = { decimalPlace: 1, searchZone: 14 };
const fixColumns = ['analysisIndicator', 'plantCd', 'plantNm', 'resourceCd', 'resourceNm', 'stageCd', 'stageNm'];
const exportOptions = {
  lookupDisplay: true,
  headerDepth: 1
};
let resrcUtilGrid;
const resrcUtilGridItems = [
  { name: "plantCd", dataType: "text", headerText: " ", visible: false, editable: false },
  { name: "plantNm", dataType: "text", headerText: "FP_PLANT", visible: true, editable: false, width: 150, mergeRule: { criteria: "value" }, autoFilter: true,
    renderer: { showTooltip:true }, headerSummary: { text: transLangKey('TARGET') }, groupFooter: {
      valueCallback: function (grid, column, groupFooterIndex, group) {
        const stageCd = grid.getDataSource().getValue(group.firstDataItem.dataRow, 'stageCd');
        return `${stageCd} ${transLangKey('FP_UTILIZATION')}`;
      },
      styleName: "text-font-bold"
    },
  },
  { name: "stageCd", dataType: "text", headerText: " ", visible: false, editable: false },
  { name: "stageNm", dataType: "text", headerText: "FP_STAGE", visible: true, editable: false, width: 150, mergeRule: { criteria: "value" }, autoFilter: true,
    renderer: { showTooltip:true },
  },
  { name: "resourceCd", dataType: "text", headerText: " ", visible: false, editable: false },
  { name: "resourceNm", dataType: "text", headerText: "FP_RESOURCE", visible: true, editable: false, width: 150, mergeRule: { criteria: "prevvalues + value" }, autoFilter: true,
    renderer: { showTooltip:true },
  },
  { name: "analysisIndicator", dataType: "text", headerText: "FP_ANALYSIS_INDICATOR", visible: true, width: 120,
    displayCallback: (grid, index, value) => transLangKey(value),
    styleCallback: function (grid, dataCell) {
      let style = {};
      style.styleName = 'text-column';
      if (grid.getValue(dataCell.index.itemIndex, 'analysisIndicator') === 'FP_UTILIZATION') {
        style.styleName += ' text-font-bold';
      }
      return style;
    }
  }
];

function ResourceUtilization() {
  const versionPlantRef = useRef();
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [maxStartDate, setMaxStartDate] = useState(null);
  const [minEndDate, setMinEndDate] = useState(null);
  const { control, getValues, setValue, watch } = useForm({
    defaultValues: {
      startDate: null,
      endDate: null,
      isEntirePlanPeriod: []
    }
  });
  const watchAllFields = watch();
  const [chartLabels, setChartLabels] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [chartTitle, setChartTitle] = useState(transLangKey('FP_UTILIZATION'));
  const globalButtons = [
    {
      name: "search",
      action: () => versionPlantRef.current.handleSubmit(loadData, onErrorInput),
      visible: true,
      disable: false
    }
  ];

  useEffect(() => {
    if (watchAllFields.startDate) {
      setMinEndDate(new Date(watchAllFields.startDate));
    }
  }, [watchAllFields.startDate]);

  useEffect(() => {
    if (watchAllFields.endDate) {
      setMaxStartDate(new Date(watchAllFields.endDate));
    }
  }, [watchAllFields.endDate]);
  
  useEffect(() => {
    setViewInfo(vom.active, 'globalButtons', globalButtons);
    loadSettings();
    return () => {
      resrcUtilGrid = null;
    };
  }, []);

  useEffect(() => {
    if (!resrcUtilGrid) {
      resrcUtilGrid = getViewInfo(vom.active, 'resrcUtilGrid');
      setNoneEditableGrid(resrcUtilGrid);
      setGridOptions(resrcUtilGrid.gridView);
    }
  }, [viewData]);

  function setGridOptions(gridView) {
    if (gridView.id === 'resrcUtilGrid') {
      const dataProvider = gridView.getDataSource();
      dataProvider.setFields(dataProvider.getFields().map(field => ({ fieldName: field.orgFieldName })));
      gridView.setRowIndicator({ sumText: '' });
      gridView.setHeaderSummaries({ visible: true });
      gridView.onShowTooltip = function (grid, index, value) {
        const column = index.column, itemIndex = index.itemIndex;
        let name;
        switch (column) {
          case 'plantNm':
            name = grid.getValue(itemIndex, 'plantNm'); break;
          case 'stageNm':
            name = grid.getValue(itemIndex, 'stageNm'); break;
          case 'resourceNm':
            name = grid.getValue(itemIndex, 'resourceNm'); break;
        }
        return `${transLangKey('FP_CODE')}: ${value}, ${transLangKey('FP_NAME')}: ${name}`;
      };
      gridView.onCellClicked = function (grid, clickData) {
        if (clickData.cellType === 'data') {
          if (clickData.column === 'resourceNm') {
            setChartDataByResource(clickData.itemIndex);
          } else if (clickData.column === 'stageNm') {
            setChartDataByStage(clickData.itemIndex);
          }
        }
      }

      gridView.rowGroup.headerStatement = undefined;
      gridView.rowGroup.headerCallback = function (grid, group) {
        const dataProvider = grid.getDataSource();
        const stageNm = dataProvider.getValue(group.firstDataItem.dataRow, 'stageNm');
        let resourceList = [];
        group.children
          .filter(item => item.type === 'row')
          .forEach(item => {
            const resource = dataProvider.getValue(item.dataRow, 'resourceCd');
            if (resourceList.indexOf(resource) === -1) {
              resourceList.push(resource);
            }
          });
        return `${stageNm} - ${resourceList.length} Resources`;
      }
    }
  }

  function setChartDataByResource(itemIndex) {
    const { gridView, dataProvider } = resrcUtilGrid;
    let labels = [], chartData = [], title = `${transLangKey('FP_UTILIZATION')}`;
    if (dataProvider.getRowCount() > 0) {
      const groupModel = gridView.getGroupModel(itemIndex, true),
        value = gridView.getValue(itemIndex, 'resourceNm');
      labels = gridView.getColumnNames().filter(column => fixColumns.indexOf(column) === -1);
      groupModel.dataRows.forEach(function (dataRow) {
        const row = dataProvider.getJsonRow(dataRow);
        if (row.resourceNm === value) {
          const data = labels.map(column => (row[column]) ? row[column] : 0),
            label = transLangKey(row.analysisIndicator);
          if (row.analysisIndicator === 'FP_UTILIZATION') {
            chartData.push({ type: 'line', label: `${label} (%)`, data, yAxisID: 'utilRateYAxis', legendOrder: 3 });
          } else if (row.analysisIndicator === 'FP_USED_TM') {
            chartData.push({ type: 'bar', label, data, backgroundColor: '#2b5988', yAxisID: 'timeYAxis', legendOrder: 1 });
          } else if (row.analysisIndicator === 'FP_AVAIL_TM') {
            chartData.push({ type: 'bar', label, data, backgroundColor: '#9cbaeb', yAxisID: 'timeYAxis', legendOrder: 2 });
          }
        }
      });
      title += `(${value})`;
    }
    setChartLabels(labels);
    setChartData(chartData);
    setChartTitle(title);
  }

  function setChartDataByStage(itemIndex) {
    const gridView = resrcUtilGrid.gridView, dataProvider = resrcUtilGrid.dataProvider,
      stageCd = gridView.getValue(itemIndex, 'stageCd');
    let labels = gridView.getColumnNames().filter(column => fixColumns.indexOf(column) === -1),
      usedTmSums = Array(labels.length).fill(0), availTmSums = Array(labels.length).fill(0),
      chartData = [];
    dataProvider.getJsonRows(0, -1, false)
      .filter(row => row.stageCd === stageCd)
      .forEach(row => {
        let pivotData = labels.map(column => row[column]);
        if (row.analysisIndicator === 'FP_USED_TM') {
          pivotData.forEach((value, index) => usedTmSums[index] += value);
        } else if (row.analysisIndicator === 'FP_AVAIL_TM') {
          pivotData.forEach((value, index) => availTmSums[index] += value);
        }
      });
    const data = usedTmSums.map((usedTmSum, index) => (availTmSums[index] && usedTmSum) ? ((usedTmSum / availTmSums[index]) * 100).toFixed(policyDetails.decimalPlace) : 0),
      label = `${gridView.getValue(itemIndex, 'stageNm')} (%)`;
    const targetData = gridView.getColumns()
        .filter(column => fixColumns.indexOf(column.name) === -1)
        .map((column) => column.headerSummary.text.replace('%', '') ),
      targetLabel = `${transLangKey('TARGET')} (%)`;
    chartData.push({ type: 'line', label: targetLabel, data: targetData, yAxisID: 'targetRateYAxis', legendOrder: 2 });
    chartData.push({ type: 'bar', label , data, backgroundColor: '#75cba9', yAxisID: 'utilRateYAxis', legendOrder: 1 });
    setChartLabels(labels);
    setChartData(chartData);
    setChartTitle(transLangKey('FP_UTILIZATION'));
  }

  function loadVersions(planningDate) {
    const { versionCd } = versionPlantRef.current.getValues();
    return zAxios.get(baseURI() + 'factoryplan/versions', {
      params: {
        'planning-date': planningDate.format('yyyy-MM-dd').replaceAll('-', '')
      },
      waitOn: false
    }).then(function (res) {
      if (res.data.length > 0) {
        const version = res.data.filter(data => data.versionCd === versionCd)[0];
        setValue('startDate', new Date(version.startTs));
        let startTsToEndTs = new Date(version.startTs);
        startTsToEndTs.setDate(startTsToEndTs.getDate() + policyDetails.searchZone);
        setValue('endDate', startTsToEndTs);
      }
    }).catch(function (err) {
      console.log(err);
    });
  }

  function loadSettings() {
    zAxios.get(baseURI()+'factoryplan/setting', {
      params: {
        'setting-cds': encodeURI(['FP_DECIMAL_PLACE', 'FP_SEARCH_ZONE'])
      },
      waitOn: false
    })
      .then(function (res) {
        res.data.forEach(data => {
          if (data.settingCd === 'FP_DECIMAL_PLACE') {
            policyDetails.decimalPlace = Number(data.settingVal);
          } else if (data.settingCd === 'FP_SEARCH_ZONE') {
            policyDetails.searchZone = Number(data.settingVal);
          }
        })
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
      });
  }

  function loadData() {
    const { versionCd, plantCd } = versionPlantRef.current.getValues();
    if (!getValues('isEntirePlanPeriod').includes('true') && !getValues('startDate') || !getValues('endDate')) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('FP_MSG_SELECT_PLAN_PERIOD'), { close: false });
      return;
    }
    zAxios.get(baseURI() + 'factoryplan/resource-utilization/utilization', {
      params: {
        'version-cd': versionCd,
        'plant-cds': encodeURI(plantCd),
        'start-date': getValues('startDate').format('yyyy-MM-dd').replaceAll('-', ''),
        'end-date': getValues('endDate').format('yyyy-MM-dd').replaceAll('-', ''),
        'entire-period': getValues('isEntirePlanPeriod').includes('true')
      }
    })
      .then(function (res) {
        makeCrossTabFieldsAndColumns(res.data.header);
        setCrossTabGridData(res.data.header, res.data.data);
        setChartDataByResource(1);
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
      });
  }

  function makeCrossTabFieldsAndColumns(dateHeaders) {
    let gridView = resrcUtilGrid.gridView, dataProvider = resrcUtilGrid.dataProvider;
    let fields = dataProvider.getFields()
      .filter(field => fixColumns.includes(field.orgFieldName))
      .map(field => ({ fieldName: field.orgFieldName }));
    let columns = gridView.getColumns().filter(column => fixColumns.includes(column.name));
    const dateFields = dateHeaders.map(dateHeader => ({ fieldName: dateHeader, dataType: 'number' }));
    const groupFooterValueCallback = function (grid, column, groupFooterIndex, group) {
      let usedTmSum = 0, availTmSum = 0;
      const dataProvider = grid.getDataSource();
      const stageCd = dataProvider.getValue(group.firstDataItem.dataRow, 'stageCd');
      dataProvider.getJsonRows(0, -1, false)
        .filter(row => row.stageCd === stageCd)
        .forEach(row => {
          if (row.analysisIndicator === 'FP_USED_TM') {
            usedTmSum += row[column.name];
          } else if (row.analysisIndicator === 'FP_AVAIL_TM') {
            availTmSum += row[column.name];
          }
        });
      return (availTmSum && usedTmSum) ? Number(`${((usedTmSum / availTmSum) * 100).toFixed(policyDetails.decimalPlace)}`) : '';
    };
    const targetData = [95, 90, 91, 93, 95.5, 100, 97, 98, 99, 93, 95, 96, 94, 98];
    const dateColumns = dateHeaders.map((dateHeader, index) =>
      ({
        name: dateHeader, fieldName: dateHeader,
        header: { text: dateHeader },
        styleName: "number-column",
        styleCallback: function (grid, dataCell) {
          let style = {};
          style.styleName = "number-column";
          if (grid.getValue(dataCell.index.itemIndex, 'analysisIndicator') === 'FP_UTILIZATION') {
            style.styleName += " text-font-bold";
            style.suffix = "%";
          }
          return style;
        },
        numberFormat: "#,##0.#####",
        groupFooter: {
          valueCallback: groupFooterValueCallback,
          numberFormat: "#,##0.#####",
          suffix: "%",
          styleName: "text-font-bold"
        },
        headerSummary: {
          text: `${(targetData[index]) ? targetData[index] : targetData[index % targetData.length]}%`,
        },
        editable: false,
        width: 80
      })
    );
    dataProvider.setFields(fields.concat(dateFields));
    gridView.setColumns(columns.concat(dateColumns));
    gridView.setFixedOptions({ colCount: dateHeaders.length > 0 ? 4 : 0 });
    gridView.setColumnLayout(columns.concat(dateColumns).map(column => column.name));
    gridView.layoutByColumn("plantNm").summaryUserSpans = [{ colspan: 4 }];
    gridView.layoutByColumn("plantNm").groupFooterUserSpans = [{ colspan: 4 }];
    gridView.groupBy(dateHeaders.length > 0 ? ['stageCd'] : []);
  }

  function setCrossTabGridData(dateHeaders, data) {
    let jsonData = [];
    data.forEach(function (dataRow) {
      let obj = {};
      obj["plantCd"] = dataRow["plantCd"];
      obj["plantNm"] = dataRow["plantNm"];
      obj["stageCd"] = dataRow["stageCd"];
      obj["stageNm"] = dataRow["stageNm"];
      obj["resourceCd"] = dataRow["resourceCd"];
      obj["resourceNm"] = dataRow["resourceNm"];
      obj["analysisIndicator"] = dataRow["analysisIndicator"];
      dateHeaders.forEach(function (header, index) {
        obj[header] = dataRow["pivotData"][index];
      });
      jsonData.push(obj);
    });
    resrcUtilGrid.dataProvider.fillJsonData(jsonData, { count: -1 });
  }

  function handleInitialized() {
    const { planningDate } = versionPlantRef.current.getValues();
    setValue('isEntirePlanPeriod', []);
    loadVersions(planningDate)
      .then(() => loadData());
  }

  function handleChange(value) {
    if (Object.keys(value).includes('versionCd')) {
      const { planningDate } = versionPlantRef.current.getValues();
      if (planningDate && value.versionCd) {
        loadVersions(planningDate);
      } else {
        setValue('startDate', null);
        setValue('endDate', null);
      }
    }
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <VersionPlantSearchCondition ref={versionPlantRef} initialized={handleInitialized} onChange={handleChange}/>
            <InputField control={control} type="datetime" dateformat="yyyy-MM-dd" name="startDate" label={transLangKey("STRT_DTTM")} disabled={getValues('isEntirePlanPeriod').includes('true')} max={maxStartDate} />
            <InputField control={control} type="datetime" dateformat="yyyy-MM-dd" name="endDate" label={transLangKey("END_DTTM")} disabled={getValues('isEntirePlanPeriod').includes('true')} min={minEndDate} />
            <Box className="entireCheckBox">
              <InputField control={control} type="check" name="isEntirePlanPeriod" options={[{ value: 'true', label: transLangKey('FP_ENTIRE_PERIOD') }]} style={{ height: "100%", margin: 0 }} ></InputField>
            </Box>
          </SearchRow>
        </SearchArea>
        <ButtonArea>
          <LeftButtonArea>
            <GridExcelExportButton grid="resrcUtilGrid" options={exportOptions} />
          </LeftButtonArea>
        </ButtonArea>
        <ResultArea sizes={[50, 50]} direction={"vertical"}>
          <Box>
            <Box style={{ height: "calc(100% - 7px)" }}>
              <BaseGrid id="resrcUtilGrid" items={resrcUtilGridItems} className="white-skin" />
            </Box>
          </Box>
          <Box>
            <UtilizationChart title={chartTitle} labels={chartLabels} data={chartData}></UtilizationChart>
          </Box>
        </ResultArea>
      </ContentInner>
    </>
  )
}

export default ResourceUtilization;
