import React, { useEffect, useRef, useState } from 'react';
import {
  ButtonArea, SearchArea, SearchRow, ContentInner, ResultArea, RightButtonArea, useViewStore, CommonButton, zAxios
} from '@zionex/wingui-core/src/common/imports';
import GanttChart from '@zionex/wingui-core/src/component/gantt/GanttChart';
import HeaderUnitSetting from '@zionex/wingui-core/src/component/gantt/HeaderUnitSetting';
import './ordergantt.css';
import VersionPlantSearchCondition from "@wingui/view/factoryplan/common/component/VersionPlantSearchCondition";
import { getHeaders, transLangKey } from "@wingui";
import { onErrorInput } from "@zionex/wingui-core/src/utils/common";

let gantt = {
  bodyData: [],
  data: {
    Body: [[]]
  },
  config: {},
  orderGantt: null
};
const headerUnits = ['Hour', 'Day', 'Week', 'Month'];
function OrderGantt() {
  const versionPlantRef = useRef();
  const woCdFilterListRef = useRef([]);
  const filteredWoCdRef = useRef([]);
  const [setViewInfo] = useViewStore(state => [state.setViewInfo]);
  const [initialConfig, setInitialConfig] = useState({});
  const [headerUnit, setHeaderUnit] = useState('Day');
  const [zoomOutHeightBtnDisable, setZoomOutHeightBtnDisable] = useState(true);
  const [zoomOutWidthBtnDisable, setZoomOutWidthBtnDisable] = useState(false);
  const globalButtons = [
    {
      name: "search",
      action: () => versionPlantRef.current.handleSubmit(loadData, onErrorInput),
      visible: true,
      disable: false
    }
  ];

  useEffect(() => {
    setViewInfo(vom.active, 'globalButtons', globalButtons);
    setGanttConfig();
  }, []);

  function setGanttConfig() {
    gantt.config = cloneGanttObject(GANTT_CONFIG);
    gantt.config.Cols = [
      { Name: 'plantNm', Type: 'Text', Width: '120', Spanned: '1', CanEdit: '0', VertAlign: 'top', Class: 'mergeColumn' },
      { Name: 'plantCd', Type: 'Text', Width: '120', Visible: '0' },
      { Name: 'mainCol', Type: 'Text', CanEdit: '0', Width: '225' },
      { Name: 'startTs', Type: 'Date', Format: 'yyyy-MM-dd HH:mm:ss', CanEdit: '0', Width: "135", Align: 'Center', TextColor: 'red' },
      { Name: 'endTs', Type: 'Date', Format: 'yyyy-MM-dd HH:mm:ss', CanEdit: '0', Width: "135", Align: 'Center', TextColor: 'black' },
      { Name: 'anc', Type: 'Text', Width: '55', Visible: '0' },
      { Name: 'displayColor', Type: 'Text', Width: "120", Visible: '0' },
      { Name: 'dueDt', Type: 'Date', Format: 'yyyy-MM-dd HH:mm:ss', Visible: '0' },
    ];
    gantt.config.Header = {
      plantNm: transLangKey('FP_PLANT'),
      mainCol: transLangKey('FP_WO_CD'),
      startTs: transLangKey('STRT_DATE'),
      endTs: transLangKey('END_DATE'),
      mainColButton: 'Html', mainColButtonText: '<i style="padding-right: 12px; color: #676767" class="columnFilter fa fa-lg fa-filter"></i>',
      Align: 'Center'
    };

    let now = new Date();
    const startDate = now.format('yyyy-MM-dd 00:00:00'),
      endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 16).format('yyyy-MM-dd 00:00:00');
    Object.assign(gantt.config.RightCols[0], {
      GanttChartMinStart: startDate, GanttChartMaxEnd: endDate,
      GanttChartMaxStart: startDate, GanttChartMinEnd: endDate,
      GanttStart: 'startTs', GanttEnd: 'endTs', GanttStart1: 'dueDt',
      GanttHtmlRight1: '*Start*', GanttAncestors: 'anc',
      GanttMilestoneClass1: 'Lime', GanttEdit: 'MainMove'
    });
    Object.assign(gantt.config.Actions, {
      OnRightDragGantt: 'DragGanttDependency',
      OnShiftDragGantt: 'SelectGanttRunRect',
      OnDblClickGantt: 'DeselectGanttRunAll, SelectGanttRun',
      OnRightClickGantt: '0'
    });
    Object.assign(gantt.config.Cfg, { MainCol: 'mainCol' });
    setInitialConfig(gantt.config);
  }

  function loadData() {
    const { versionCd, plantCd } = versionPlantRef.current.getValues();
    setHeaderUnit('Day');
    gantt.bodyData = [];

    zAxios.get(baseURI() + 'factoryplan/order-gantt/activities', {
      params: {
        'version-cd': versionCd,
        'plant-cds': encodeURI(plantCd)
      }
    })
      .then(function (response) {
        const responseData = response.data;
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
        gantt.orderGantt.Source.Data.Data = gantt.data;
        gantt.orderGantt.Source.Layout.Data = gantt.config;
        gantt.orderGantt.Reload();
        setZoomOutHeightBtnDisable(true);
        setZoomOutWidthBtnDisable(false);
      });
  }

  function handleCreate(ganttObject) {
    gantt.orderGantt = ganttObject;
    const ganttId = gantt.orderGantt.id;

    TGSetEvent('OnGetGanttHtml', ganttId, function (grid, row, col, width, comp, crit, plan, index, txt, left, maxwidth, cls) {
      const text = `${row.itemCd} (${row.itemNm}) / ${row.qty} (${row.itemUom})`,
        ganttHeight = gantt.orderGantt.Cols.GANTT.GanttHeight;
      if (row.Level === 0) {
        cls[2] = 'BGGanttWoBox'; // class 추가
        return `<div class="basicBox" style="line-height: ${ganttHeight}px; background: ${row.displayColor}; color: black; ">
                    <div class="basicBoxText">${text}</div>
                </div>`;
      } else {
        return `<div class="basicBox" style="line-height: ${ganttHeight}px; background: ${row.displayColor}; color: black; ">
                    <div class="basicBoxText">${text}</div>
                </div>`;
      }
    });

    TGSetEvent('OnGetGanttSideHtml', ganttId, function (grid, row, col, width, comp, crit, plan, index, txt, side) {
      if (plan === 1 && side === 2) {
        if (row.endTs && row.dueDt && (new Date(row.endTs) > new Date(row.dueDt))) {
          return `<span style="color: red;">${txt}</span>`;
        }
      }
    });

    TGSetEvent('OnGetGanttHeader', ganttId, function (grid, val, index, date, nextDate, units, width, partial, col) {
      // zoom level(일, 주, 시간...)에 따라 조건 처리
      if (index === 1) {
        return `<span>${val.replaceAll('...', '')}</span>`;
      } else if (units === 'w' && index === 2) {
        return `${DateToString(date, 'd(ddd)')} ~ ${DateToString(nextDate - 1, 'd(ddd)')}`;
      }
    });

    TGSetEvent('OnGanttTip', ganttId, function (grid, row, col, tip, xy) {
      if (xy.Type === 'main') {
        let tooltip = null, ajaxObj;
        const { versionCd } = versionPlantRef.current.getValues();
        if (row.Level === 0) {
          ajaxObj = {
            url: baseURI() + 'factoryplan/order-gantt/activity/tooltip/work-order',
            data: {
              'version-cd': versionCd,
              'plant-cd': row.plantCd,
              'wo-cd': row.woCd
            },
            success: function (data) {
              tooltip = {
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
              };
            }
          }
        } else {
          ajaxObj = {
            url: baseURI() + 'factoryplan/order-gantt/activity/tooltip/bom',
            data: {
              'version-cd': versionCd,
              'plant-cd': row.plantCd,
              'resource-cd': row.resourceCd,
              'activity-id': row.activityId
            },
            success: function (data) {
              tooltip = {
                'FP_PRODUCTION_ITEM': data.itemCd,
                'PROD_QTY': data.qty,
                'FP_START_TS': (data.startTs) ? data.startTs.replace('T', ' ') : '',
                'FP_END_TS': (data.endTs) ? data.endTs.replace('T', ' ') : '',
                'FP_TOTAL_WORK_TIME': data.tsDiff,
                'FP_WORK_ORDER_CODE': row.woCd.split(" ")[0],
                'FP_RESOURCE': data.resourceCd,
                'FP_ROUTE': data.routeCd,
                'FP_WIP': data.wipYn,
              };
            }
          }
        }

        function nullCheck(value) {
          return (value === null) ? '' : value;
        }
        ajaxObj.type = 'GET';
        ajaxObj.headers = getHeaders();
        ajaxObj.async = false;
        $.ajax(ajaxObj);
        const string = Object.keys(tooltip)
          .map(prop => {
            const tipText = (prop === 'FP_WIP') ?
              `<div><span>${transLangKey(prop)}: </span><input style="vertical-align: middle;" type="checkbox" onclick="e.preventDefault()" ${(tooltip[prop]) ? "checked" : ""}></div>`
              : `${transLangKey(prop)}: ${nullCheck(tooltip[prop])}`;
            return `<div>${tipText}</div>`
          })
          .join('');
        return `<div>${string}</div>`;
      }
    });

    TGSetEvent('OnClickSideButton', ganttId, function (grid, row, col, x, y) {
      if (col === 'mainCol') {
        const items = (woCdFilterListRef.current.length > 0) ? `|${woCdFilterListRef.current.join('|')}` : '',
          menu = { Default: { Bool: 1 }, Items: items, Buttons: ['Clear', 'Ok'], MaxHeight: 260 };
        menu.OnSave = (item, result) => {
          filteredWoCdRef.current = result;
          const classList = document.querySelector('#orderGantt .columnFilter').classList;
          if (result.length === 0) {
            grid.ActionShowAllRows();
            classList.remove('active');
          } else {
            for (let row = grid.GetFirst(); row; row = grid.GetNext(row)) {
              if (row.Level === 0) {
                grid.ShowRow(row);
                if (!result.includes(Get(row, 'woCd'))) {
                  grid.HideRow(row);
                }
              }
            }
            classList.add('active');
          }
        }
        grid.ShowMenu(row, col, menu, { Align: "right below" }, null, filteredWoCdRef.current);
      }
    });

    TGSetEvent('OnRenderFinish', ganttId, function (grid) {
      // woCd 컬럼 필터 설정
      let woCdArr = [];
      for (let row = grid.GetFirst(); row; row = grid.GetNext(row)) {
        if (row.Level === 0) {
          woCdArr.push(Get(row, "woCd"));
        }
      }
      woCdFilterListRef.current = woCdArr;
      filteredWoCdRef.current = [];
    });

    TGSetEvent('OnExpand', ganttId, function (grid, row) {
      function expandAllChild(child) {
        let row = child;
        while (row.firstChild) {
          gantt.orderGantt.Expand(row.firstChild);
          if (row.childNodes.length > 1) {
            let next = row.firstChild.nextSibling;
            while (next) {
              gantt.orderGantt.Expand(next);
              expandAllChild(next);
              next = next.nextSibling;
            }
          }
          row = row.firstChild;
        }
      }
      if (row.Expanded === 0 && row.Level === 0) {
        expandAllChild(row);
      }
    });

  }

  function changeGanttHeaderUnit(header) {
    if (gantt.orderGantt) {
      gantt.orderGantt.ChangeZoom(header);
      gantt.orderGantt.RefreshGantt(5);
    }
    setHeaderUnit(header);
    setZoomOutWidthBtnDisable(false);
  }

  function getHeaderUnitRange() {
    switch (headerUnit) {
      case 'Hour':
        return 5;
      case 'Day':
        return 2;
      case 'Week':
        return 8;
      case 'Month':
        return 12;
    }
  }

  function setZoomHeightBtnDisable() {
    const gt = gantt.orderGantt;
    if (gt.Cols.GANTT.GanttHeight <= 21) {
      setZoomOutHeightBtnDisable(true);
    } else {
      setZoomOutHeightBtnDisable(false);
    }
  }

  function zoomInHeight() {
    const gt = gantt.orderGantt;
    gt.Cols.GANTT.GanttHeight += 8;
    gt.Cols.GANTT.GanttHeight1 += 8;
    gt.Cols.GANTT.GanttTop += 3;
    gt.Cols.GANTT.GanttBottom += 3;
    gt.Cols.GANTT.GanttTop1 += 3;
    gt.Cols.GANTT.GanttBottom1 += 3;
    gt.Cols.GANTT.GanttHtmlShift1 += 4;
    gt.RefreshGantt();
    setZoomHeightBtnDisable();
  }

  function zoomOutHeight() {
    const gt = gantt.orderGantt;
    gt.Cols.GANTT.GanttHeight -= 8;
    gt.Cols.GANTT.GanttHeight1 -= 8;
    gt.Cols.GANTT.GanttTop -= 3;
    gt.Cols.GANTT.GanttBottom -= 3;
    gt.Cols.GANTT.GanttTop1 -= 3;
    gt.Cols.GANTT.GanttBottom1 -= 3;
    gt.Cols.GANTT.GanttHtmlShift1 -= 4;
    gt.RefreshGantt();
    setZoomHeightBtnDisable();
  }

  function setZoomWidthBtnDisable() {
    const originZoom = gantt.config.Zoom.filter((zoom) => zoom.Name === headerUnit)[0];
    if (Number(originZoom.GanttWidth) - (2 * getHeaderUnitRange()) === gantt.orderGantt.Cols.GANTT.GanttWidth) {
      setZoomOutWidthBtnDisable(true);
    } else {
      setZoomOutWidthBtnDisable(false);
    }
  }

  function zoomInWidth() {
    const gt = gantt.orderGantt;
    gt.Cols.GANTT.GanttWidth += getHeaderUnitRange();
    gt.RefreshGantt();
    setZoomWidthBtnDisable();
  }

  function zoomOutWidth() {
    const gt = gantt.orderGantt;
    gt.Cols.GANTT.GanttWidth -= getHeaderUnitRange();
    gt.RefreshGantt();
    setZoomWidthBtnDisable();
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
          <RightButtonArea>
            <HeaderUnitSetting id="resourceGanttHeaderUnit" value={headerUnit} change={changeGanttHeaderUnit} units={headerUnits} />
            <CommonButton title={transLangKey("FP_ZOOM_IN")} onClick={zoomInHeight} style={{ marginRight: '1rem' }}>
              <Icon.ZoomIn />
            </CommonButton>
            <CommonButton title={transLangKey("FP_ZOOM_OUT")} onClick={zoomOutHeight} disabled={zoomOutHeightBtnDisable} style={{ marginRight: '1rem' }}>
              <Icon.ZoomOut />
            </CommonButton>
            <CommonButton title={transLangKey("FP_WIDTH_ZOOM_IN")} onClick={zoomInWidth} style={{ marginRight: '1rem' }}>
              <Icon.Maximize2 style={{ transform: 'rotate(45deg)' }} />
            </CommonButton>
            <CommonButton title={transLangKey("FP_WIDTH_ZOOM_OUT")} onClick={zoomOutWidth} disabled={zoomOutWidthBtnDisable}>
              <Icon.Minimize2 style={{ transform: 'rotate(45deg)' }} />
            </CommonButton>
          </RightButtonArea>
        </ButtonArea>
        <ResultArea>
          <GanttChart id="orderGantt" create={handleCreate} initialConfig={initialConfig} />
        </ResultArea>
      </ContentInner>
    </>
  )
}

export default OrderGantt;
