import React, { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import {
  ButtonArea, CommonButton, ContentInner, ResultArea, RightButtonArea, SearchArea, SearchRow, useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';
import GanttChart from '@zionex/wingui-core/src/component/gantt/GanttChart';
import ActivitySearch from '@zionex/wingui-core/src/component/gantt/ActivitySearch';
import HeaderUnitSetting from '@zionex/wingui-core/src/component/gantt/HeaderUnitSetting';
import './resourcegantt.css';
import VersionPlantSearchCondition from "@wingui/view/factoryplan/common/component/VersionPlantSearchCondition";
import { useLocation } from "react-router-dom";
import { getHeaders, transLangKey } from "@wingui";
import { onErrorInput } from "@zionex/wingui-core/src/utils/common";

let gantt = {
  bodyData: [],
  data: {
    Body: [[]]
  },
  config: {},
  resourceGantt: null
};
const headerUnits = ['Hour', 'Day', 'Week', 'Month'];
const buttonStyle = {
  marginRight: '1rem',
  height: 'fit-content'
};

function ResourceGantt() {
  const ganttRef = useRef();
  const location = useLocation();
  const activitySearchRef = useRef(null);
  const woItemSearchRef = useRef({ woCd: '', itemCd: '' });
  const resourceFilterListRef = useRef([]);
  const filteredResourceRef = useRef([]);
  const versionPlantRef = useRef();
  const [setViewInfo] = useViewStore(state => [state.setViewInfo]);
  const [initialConfig, setInitialConfig] = useState({});
  const [activityDetails, setActivityDetails] = useState({'FP_ACTIVITY_INFO': {}, 'FP_ORDER_INFO': {}});
  const [headerUnit, setHeaderUnit] = useState('Day');
  const [zoomOutHeightBtnDisable, setZoomOutHeightBtnDisable] = useState(true);
  const [zoomInHeightBtnDisable, setZoomInHeightBtnDisable] = useState(false);
  const [zoomOutWidthBtnDisable, setZoomOutWidthBtnDisable] = useState(false);
  const globalButtons = [
    {
      name: "search",
      action: () => versionPlantRef.current.handleSubmit(() => loadData(true), onErrorInput),
      visible: true,
      disable: false
    }
  ];
  
  useEffect(() => {
    if (location.state) {
      const itemCd = (Object.keys(location.state).includes('itemCd')) ? location.state.itemCd : '';
      woItemSearchRef.current = { woCd: '', itemCd };
      activitySearchRef.current.setValues({ order: '', item: itemCd });
    }
  }, [location]);

  useEffect(() => {
    setViewInfo(vom.active, 'globalButtons', globalButtons);
    setGanttConfig();
  }, []);

  function setGanttConfig() {
    // 1. 공통 config 가져오기
    // 프로젝트는 따로 공통 js에 정의 - cloneGanttObject(kbpm.ganttConfig);
    gantt.config = cloneGanttObject(GANTT_CONFIG);

    // 2. 화면 별 custom config 설정
    gantt.config.Cols = [
      { Name: "id", Type: "Text", Visible: "0", CanHide: "0" },
      { Name: "plantNm", Type: "Text", Width: "125", Align: "Left", VertAlign: "middle", CanEdit: "0", Spanned: "1", Class: 'test'},
      { Name: "plantCd", Type: "Text", Visible: '0'},
      { Name: "resourceCd", Type: "Text", Width: "190", Align: "Left", CanEdit: "0" },
      { Name: "RUN", Type: "Text", Width: "450", Visible: "0", CanHide: "0" }
    ];

    gantt.config.Header = {
      plantNm: transLangKey('FP_PLANT'),
      resourceCd: transLangKey('RES_CD'),
      resourceCdButton: 'Html', resourceCdButtonText: '<i style="padding-right: 12px; color: #676767" class="columnFilter fa fa-lg fa-filter"></i>',
      Align: 'Center'
    };

    let now = new Date();
    const startDate = now.format('yyyy-MM-dd 00:00:00'),
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 16).format('yyyy-MM-dd 00:00:00');
    Object.assign(gantt.config.RightCols[0], {
      GanttChartMinStart: startDate, GanttChartMaxEnd: endDate,
      GanttChartMaxStart: startDate, GanttChartMinEnd: endDate,
      GanttRunCustom: 'ActivityId,Color,JcYN,WoCd,ItemCd,PlantCd,ResourceCd,LateYn',
      GanttBottom: '6',
    });
    Object.assign(gantt.config.Actions, {
      OnRightDragGantt: 'DragGanttDependency',
      OnShiftDragGantt: 'SelectGanttRunRect',
      OnRightClickGantt: '0'
    });
    setInitialConfig(gantt.config);
  }

  function loadFrozenZone() {
    const { versionCd } = versionPlantRef.current.getValues();
    zAxios.get(baseURI()+'factoryplan/resource-gantt/frozen-zone', {
      params: {
        'version-cd': versionCd
      },
      waitOn: false
    })
      .then(function (response) {
        let frozenZone = response.data;
        gantt.config.Zoom.forEach(zoom => {
          const backgroundUnit = zoom.GanttBackground.split(';');
          let background = zoom.GanttBackground;
          if (backgroundUnit.length > 2) {
            background = background.replaceAll(backgroundUnit[0] + ';', '');
          }
          zoom.GanttBackground = frozenZone + background;
        });
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
      });
  }

  function loadData(clearSearch) {
    const { versionCd, plantCd } = versionPlantRef.current.getValues();
    setHeaderUnit('Day');
    if (clearSearch) {
      refreshSearch();
    }
    loadFrozenZone();

    gantt.bodyData = [];

    zAxios.get(baseURI()+'factoryplan/resource-gantt/activities', {
      params: {
        'version-cd': versionCd,
        'plant-cds': encodeURI(plantCd)
      }
    })
      .then(function (response) {
        let responseData = response.data;
        responseData.forEach(function (data, idx) {
          let runData = [];
          data.id = idx + 1;
          data.activities.forEach(function (activity, idxOfActivity) {
            let runActivity = {};
            runActivity.id = idxOfActivity + 1;
            runActivity.Start = new Date(activity.startTs).format("yyyy-MM-dd HH:mm:ss")
            runActivity.End = new Date(activity.endTs).format("yyyy-MM-dd HH:mm:ss");
            runActivity.Text = activity.woCd;
            runActivity.ActivityId = activity.activityId;
            runActivity.Color = activity.displayColor;
            runActivity.JcYN = activity.jcYn;
            runActivity.WoCd = activity.woCd;
            runActivity.ItemCd = activity.itemCd;
            runActivity.PlantCd = activity.plantCd;
            runActivity.ResourceCd = activity.resourceCd;
            runActivity.LateYn = activity.lateYn;
            runActivity.Group = activity.activityId;
            if (activity.jcYn) {
              runActivity.Group = activity.activityId;
            }
            runData.push(runActivity);
          });
          data.RUN = JSON.stringify(runData);
          data.GANTTGanttMark = data.divisibleYDowntimes;
          data.GANTTGanttBackground = data.downtimes;
          data.resourceCdColor = data.displayColor;
          if (data.mergeRowCount) data.plantNmRowSpan = data.mergeRowCount;
        });
        gantt.bodyData.push(responseData);
        gantt.data.Body = gantt.bodyData;
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
        Object.assign(gantt.config.RightCols[0], {
          'GanttChartMinStart': null, 'GanttChartMaxEnd': null,
          'GanttChartMaxStart': null, 'GanttChartMinEnd': null
        });

        gantt.resourceGantt.Source.Data.Data = gantt.data;
        gantt.resourceGantt.Source.Layout.Data = gantt.config;
        gantt.resourceGantt.Reload();
        setZoomInHeightBtnDisable(false);
        setZoomOutHeightBtnDisable(true);
        setZoomOutWidthBtnDisable(false);
        
        ganttRef.current.hideDetails();
      });
  }

  function handleCreate(ganttObject) {
    gantt.resourceGantt = ganttObject;
    const ganttId = gantt.resourceGantt.id;

    TGSetEvent('OnGetGanttRunText', ganttId, function (grid, row, col, run, idx, text) {
      const runBox = run[idx],
            backgroundColor = runBox[21], jcYn = runBox[22],
            woCd = (!runBox[23]) ? '' : runBox[23].toUpperCase(), itemCd = (!runBox[24]) ? '' : runBox[24].toUpperCase(),
            lateYn = (runBox[27] === true || runBox[27] === 'true'),
            ganttRunHeight = gantt.resourceGantt.Cols.GANTT.GanttRunHeight,
            jcBoxMarginTop = ganttRunHeight / 4,
            textColor = 'black'; // TODO: 배경색에 따른 글자색 설정 필요

      // search 조건 처리
      const woItemSearch = woItemSearchRef.current,
            wo = !woItemSearch.woCd ? woCd : woItemSearch.woCd.toUpperCase(),
            item = !woItemSearch.itemCd ? itemCd : woItemSearch.itemCd.toUpperCase(),
            opacity = (woCd.includes(wo) && itemCd.includes(item)) ? 1 : 0.1;

      if (jcYn) {
        return `<div style='background: ${backgroundColor}; height: 50%; margin-top: ${jcBoxMarginTop - 1}px; opacity: ${opacity};'></div>`;
      } else {
        return `<div class="basicBox" style="line-height: ${ganttRunHeight}px; background: ${backgroundColor}; color: ${textColor}; opacity: ${opacity};">
                    <div class="basicBoxText">${text}</div>
                    ${(lateYn) ? `<div class="lateYnMark">
                                    <div style='float: left; background-color: yellow;'></div>
                                    <div style='float: right; background-color: red;'></div>
                                  </div>` : ''}
                </div>`;
      }
    });

    TGSetEvent('OnGetGanttRunClass', ganttId, function (grid, row, col, run, idx, cls) {
      const jcYn = run[idx][22];
      return (jcYn) ? 'JC' : 'None';
    });

    TGSetEvent('OnGetGanttHeader', ganttId, function (grid, val, index, date, nextDate, units, width, partial, col) {
      // zoom level(일, 주, 시간...)에 따라 조건 처리
      if (index === 1) {
        return `<span>${val.replaceAll('...', '')}</span>`;
      } else if (units === 'w' && index === 2){
        return `${DateToString(date,'d(ddd)')} ~ ${DateToString(nextDate - 1,'d(ddd)')}`;
      }
    });

    TGSetEvent('OnGanttTip', ganttId, function (grid, row, col, tip, xy) {
      const { versionCd } = versionPlantRef.current.getValues();
      const runBox = grid.GetGanttRunBox(row, col, xy.RunIndex);
      if (!runBox.JcYN) {
        let tooltip = {};
        const parameters = {
          'version-cd': versionCd,
          'plant-cd': runBox.PlantCd,
          'resource-cd': runBox.ResourceCd,
          'activity-id': runBox.ActivityId
        }
        $.ajax({
          type: 'GET',
          url: baseURI()+'factoryplan/resource-gantt/activity/tooltip',
          headers: getHeaders(),
          data: parameters,
          async: false,
          success: function (data) {
            tooltip = {
              'FP_PRODUCTION_ITEM': data.itemCd,
              'PROD_QTY': data.qty,
              'FP_START_TS': (data.startTs) ? data.startTs.replace('T', ' ') : '',
              'FP_END_TS': (data.endTs) ? data.endTs.replace('T', ' ') : '',
              'FP_TOTAL_WORK_TIME': data.tsDiff,
              'FP_WORK_ORDER_CODE': data.woCd,
              'FP_INVENTORY_NM': data.inventoryCd,
              'FP_REQUEST_QTY': data.shptQty,
              'FP_DUE_DT': (data.dueDt) ? data.dueDt.replace('T', ' ') : '',
            };
          }
        });

        function nullCheck(value) {
          return (value === null) ? '' : value;
        }
        return Object.keys(tooltip)
          .map(prop => `${transLangKey(prop)}: ${nullCheck(tooltip[prop])}<br>`)
          .join('');
      }
    });

    TGSetEvent('OnDblClick', ganttId, function (grid, row, col, x, y) {
      const { versionCd } = versionPlantRef.current.getValues();
      const ganttXY = grid.GetGanttXY(row, col, x, y);
      if (!ganttXY || ganttXY.Type === null) {
        return;
      }
      const runBox = grid.GetGanttRunBox(row, col, ganttXY.RunIndex);
      if (!runBox.JcYN) {
        let details = null;
        zAxios.get(baseURI()+'factoryplan/resource-gantt/activity/detail', {
          params: {
            'version-cd': versionCd,
            'plant-cd': runBox.PlantCd,
            'resource-cd': runBox.ResourceCd,
            'activity-id': runBox.ActivityId
          },
          waitOn: false
        })
          .then(function (response) {
            const data = response.data;
            details = {
              'FP_ACTIVITY_INFO': {
                'FP_PRODUCTION_ITEM': data.itemCd,
                'PROD_QTY': data.qty,
                'FP_START_TS': (data.startTs) ? data.startTs.replace('T', ' ') : '',
                'FP_END_TS': (data.endTs) ? data.endTs.replace('T', ' ') : '',
                'FP_TOTAL_WORK_TIME': data.tsDiff,
                'FP_RESOURCE': data.resourceCd,
                'FP_ROUTE': data.routeCd,
                'FP_WIP': data.wipYn,
              },
              'FP_ORDER_INFO': {
                'FP_WORK_ORDER_CODE': data.woCd,
                'FP_INVENTORY_NM': data.inventoryCd,
                'FP_REQUEST_QTY': data.shptQty,
                'FP_DUE_DT': (data.dueDt) ? data.dueDt.replace('T', ' ') : '',
                'FP_START_TS': (data.woStartTs) ? data.woStartTs.replace('T', ' ') : '',
                'FP_END_TS': (data.woEndTs) ? data.woEndTs.replace('T', ' ') : '',
                'FP_TOTAL_PRODUCTION_TIME': data.woTsDiff,
                'FP_ONTIME_DELIVERY': transLangKey((data.lateYn) ? 'FP_DELAY' : 'FP_ONTIME'),
                'FP_PLAN_SEQ': data.planSeq,
                'FP_SO_CD': data.soCd,
                'FP_SALES_ORDER_QTY': data.requestQty,
                'CUSTOMER': data.customerCd
              }
            }
          })
          .catch(function (err) {
            console.log(err);
          })
          .then(function () {
            setActivityDetails(details);
          });
      }
      // 같은 Group box 선택
      grid.ActionDeselectGanttRunAll();
      const group = grid.FindGanttRunBoxes({Group: runBox.ActivityId}, 4 + 16, "Group");
      if (group && group.length >= 2) {
        group.forEach(function (activity) {
          if (Number(activity.Id) !== Number(runBox.Id)) {
            grid.SelectGanttRunBox(activity, 1);
          }
        });
      }      
    });

    TGSetEvent('OnClickSideButton', ganttId, function (grid, row, col, x, y) {
      if (col === 'resourceCd') {
        const items = (resourceFilterListRef.current.length > 0) ? `|${ resourceFilterListRef.current.join('|') }` : '',
              menu = { Default: { Bool: 1 }, Items: items, Buttons: ['Clear', 'Ok'], MaxHeight: 260 };
        menu.OnSave = (item, result) => {
          filteredResourceRef.current = result;
          const classList = document.querySelector('#fpResourceGantt .columnFilter').classList;
          if (result.length === 0 ) {
            grid.ActionShowAllRows();
            classList.remove('active');
          } else {
            for (let row = grid.GetFirst(); row; row = grid.GetNext(row)) {
              grid.ShowRow(row);
              if (!result.includes(Get(row, 'resourceCd'))) {
                grid.HideRow(row);
              }
            }
            classList.add('active');
          }
        }
        grid.ShowMenu(row, col, menu, {Align: "right below"}, null, filteredResourceRef.current);
      }
    });

    TGSetEvent('OnRenderFinish', ganttId, function (grid) {
      // resourceCd 컬럼 필터 설정
      let resourceCdArr = [];
      for (let row = grid.GetFirst(); row; row = grid.GetNext(row)) {
        resourceCdArr.push(Get(row, "resourceCd"));
      }
      resourceFilterListRef.current = resourceCdArr;
      filteredResourceRef.current = [];
    });

    TGSetEvent('OnTip', ganttId, function (grid, row, col, tip, clientX, clientY, X, Y) {
      if (col === 'resourceCd') {
        return row.resourceNm;
      }
    });

  }

  function changeGanttHeaderUnit(header) {
    if (gantt.resourceGantt) {
      gantt.resourceGantt.ChangeZoom(header);
      gantt.resourceGantt.RefreshGantt(5);
    }
    setHeaderUnit(header);
    setZoomOutWidthBtnDisable(false);
  }

  function setZoomHeightBtnDisable() {
    const gt = gantt.resourceGantt;
    if (gt.Cols.GANTT.GanttRunHeight <= 20 ) {
      setZoomOutHeightBtnDisable(true);
    } else {
      setZoomOutHeightBtnDisable(false);
    }
    if (gt.Cols.GANTT.GanttRunHeight >= 76 ) {
      setZoomInHeightBtnDisable(true);
    } else {
      setZoomInHeightBtnDisable(false);
    }
  }

  function zoomInHeight() {
    const gt = gantt.resourceGantt;
    const rows = gt.Rows;
    Object.keys(rows).forEach(key => {
      if (rows[key].Kind === 'Data') {
        if (rows[key].GANTTGanttMark) {
          const markClassNumber = Number(rows[key].GANTTGanttMark.split(';')[0].split('#')[1]);
          gt.Rows[key].GANTTGanttMark = rows[key].GANTTGanttMark.replaceAll(`#${markClassNumber}`, `#${markClassNumber + 1}`);
        }
      }
    });
    gt.Cols.GANTT.GanttRunHeight += 8;
    gt.Cols.GANTT.GanttRunTop += 3;
    gt.Cols.GANTT.GanttBottom += 3;
    gt.RefreshGantt(383);
    setZoomHeightBtnDisable();
  }

  function zoomOutHeight() {
    const gt = gantt.resourceGantt;
    const rows = gantt.resourceGantt.Rows;
    Object.keys(rows).forEach(key => {
      if (rows[key].Kind === 'Data') {
        if (rows[key].GANTTGanttMark) {
          const markClassNumber = Number(rows[key].GANTTGanttMark.split(";")[0].split('#')[1]);
          gt.Rows[key].GANTTGanttMark = rows[key].GANTTGanttMark.replaceAll(`#${markClassNumber}`, `#${markClassNumber - 1}`);
        }
      }
    });
    gt.Cols.GANTT.GanttRunHeight -= 8;
    gt.Cols.GANTT.GanttRunTop -= 3;
    gt.Cols.GANTT.GanttBottom -= 3;
    gt.RefreshGantt(383);
    setZoomHeightBtnDisable();
  }

  function getHeaderUnitRange() {
    switch (headerUnit) {
      case 'Hour' :
        return 5;
      case 'Day' :
        return 2;
      case 'Week' :
        return 8;
      case 'Month' :
        return 12;
    }
  }

  function setZoomWidthBtnDisable() {
    const originZoom = gantt.config.Zoom.filter((zoom) => zoom.Name === headerUnit)[0];
    if (Number(originZoom.GanttWidth) - (2 * getHeaderUnitRange()) === gantt.resourceGantt.Cols.GANTT.GanttWidth) {
      setZoomOutWidthBtnDisable(true);
    } else {
      setZoomOutWidthBtnDisable(false);
    }
  }

  function zoomInWidth() {
    gantt.resourceGantt.Cols.GANTT.GanttWidth += getHeaderUnitRange();
    gantt.resourceGantt.RefreshGantt();
    setZoomWidthBtnDisable();
  }

  function zoomOutWidth() {
    gantt.resourceGantt.Cols.GANTT.GanttWidth -= getHeaderUnitRange();
    gantt.resourceGantt.RefreshGantt();
    setZoomWidthBtnDisable();
  }

  function refreshSearch() {
    activitySearchRef.current.refresh();
    gantt.resourceGantt.RefreshGantt(65);
  }

  function searchActivity(search) {
    woItemSearchRef.current.woCd = search.order;
    woItemSearchRef.current.itemCd = search.item;
    gantt.resourceGantt.RefreshGantt(65);
  }
  
  function handleInitialized() {
    loadData(false);
    if (Object.keys(gantt.resourceGantt.Rows).length < 1) {
      setTimeout(() => gantt.resourceGantt.Reload(), 1000);
    }
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <VersionPlantSearchCondition ref={versionPlantRef} initialized={handleInitialized} />
          </SearchRow>
        </SearchArea>
        <ButtonArea>
          <RightButtonArea>
            <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
              <ActivitySearch ref={activitySearchRef} search={searchActivity} style={{ mr: '1rem' }} />
              <HeaderUnitSetting id="resourceGanttHeaderUnit" value={headerUnit} change={changeGanttHeaderUnit} units={headerUnits} />
              <CommonButton title={transLangKey("FP_ZOOM_IN")} onClick={zoomInHeight} disabled={zoomInHeightBtnDisable} style={buttonStyle}>
                <Icon.ZoomIn />
              </CommonButton>
              <CommonButton title={transLangKey("FP_ZOOM_OUT")} onClick={zoomOutHeight} disabled={zoomOutHeightBtnDisable} style={buttonStyle}>
                <Icon.ZoomOut />
              </CommonButton>
              <CommonButton title={transLangKey("FP_WIDTH_ZOOM_IN")} onClick={zoomInWidth} style={buttonStyle}>
                <Icon.Maximize2 style={{ transform: 'rotate(45deg)' }} />
              </CommonButton>
              <CommonButton title={transLangKey("FP_WIDTH_ZOOM_OUT")} onClick={zoomOutWidth} disabled={zoomOutWidthBtnDisable} style={buttonStyle}>
                <Icon.Minimize2 style={{ transform: 'rotate(45deg)' }} />
              </CommonButton>
            </Box>
          </RightButtonArea>
        </ButtonArea>
        <ResultArea>
          <GanttChart id="fpResourceGantt" create={handleCreate} initialConfig={initialConfig} details={activityDetails} ganttRef={ganttRef} />
        </ResultArea>
      </ContentInner>
    </>
  )
}

export default ResourceGantt;
