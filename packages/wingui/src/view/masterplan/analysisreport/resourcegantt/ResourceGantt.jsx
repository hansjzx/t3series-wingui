import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import GanttChart from '@zionex/wingui-core/src/component/gantt/GanttChart';
import HeaderUnitSetting from '@zionex/wingui-core/src/component/gantt/HeaderUnitSetting';
import ActivitySearch from '@zionex/wingui-core/src/component/gantt/ActivitySearch';
import './resourcegantt.css';
import { CommonButton, ContentInner, SearchArea, SearchRow, ButtonArea, LeftButtonArea, RightButtonArea, InputField, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';
import { getHeaders } from "@wingui";
import PopSimulationVersion from '@wingui/view/masterplan/common/PopSimulationVersion';

let gantt = {
  bodyData: [],
  data: { Body: [[]] },
  config: {},
  resourceGantt: null
};

let units = ['Half-Day', 'Day', 'Week', 'Month'];

function ResourceGantt() {
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const activitySearchRef = useRef(null);
  const [simulationVersionPopupOpen, setSimulationVersionPopupOpen] = useState(false);
  const resourceFilterListRef = useRef([]);
  const filteredResourceRef = useRef([]);
  const [initialConfig, setInitialConfig] = useState({});
  const [activityDetails, setActivityDetails] = useState({activity: {}, order: {}});
  const [headerUnit, setHeaderUnit] = useState('Day');
  const [zoomOutHeightBtnDisable, setZoomOutHeightBtnDisable] = useState('disabled');
  const [zoomInHeightBtnDisable, setZoomInHeightBtnDisable] = useState('');
  const [zoomOutWidthBtnDisable, setZoomOutWidthBtnDisable] = useState('');
  const orderItemSearchRef = useRef({order: '', item: ''});

  const { getValues, setValue, control } = useForm({
    defaultValues: {
      moduleCd: 'MP',
      simulVerId: '',
      conbdMainVerDtlId: ''
    }
  });

  const globalButtons = [
    { name: 'search', action: (e) => { onSubmit() }, visible: true, disable: false },
    { name: 'refresh', action: (e) => { refresh() }, visible: true, disable: false }
  ]

  useEffect(() => {
    setViewInfo(vom.active, 'globalButtons', globalButtons);

    getDefaultVersion();
    setGanttConfig();
  }, []);

  function openSimulationVersionPopup() {
    setSimulationVersionPopupOpen(true);
  }

  function closeSimulationVersionPopup() {
    setSimulationVersionPopupOpen(false);
  }

  function setSimulationVersion(data) {
    setValue('simulVerId', data.SIMUL_VER);
    setValue('conbdMainVerDtlId', data.CONBD_MAIN_VER_DTL_ID);
  }

  function getDefaultVersion() {
    let formData = new FormData();

    formData.append('MODULE_CD', getValues('moduleCd'));
    formData.append('MAIN_VER_ID', '');
    formData.append('SIMUL_VER_ID', '');
    formData.append('SIMUL_VER_DESCRIP', '');

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_COMM_SRH_VER_Q',
      data: formData
    }).then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        const versionObj = res.data.RESULT_DATA[0];
        setValue('simulVerId', versionObj.SIMUL_VER);
        setValue('conbdMainVerDtlId', versionObj.CONBD_MAIN_VER_DTL_ID);
      }
    }).catch(function (err) {
      console.log(err);
    });
  }

  function setGanttConfig() {
    gantt.config = cloneGanttObject(GANTT_CONFIG);

    Object.assign(gantt.config.Cfg, {
      // GanttStyle: 'MG',
      MinRowHeight: '60'
    });

    gantt.config.Cols = [
      { Name: "id", Type: "Text", Visible: "0", CanHide: "0" },
      { Name: "resourceId", Type: "Text", Width: "190", Align: "Left", CanEdit: "0" },
      { Name: "RUN", Type: "Text", Width: "450", Visible: "0", CanHide: "0" }
    ];

    gantt.config.Header = {
      resourceId: transLangKey('RES_CD'),
      resourceIdButton: 'Html', resourceIdButtonText: '<i style="padding-right: 12px; color: #676767" class="columnFilter fa fa-lg fa-filter"></i>',
      Align: 'Center'
    };

    let now = new Date();
    const startDate = now.format("yyyy-MM-dd 00:00:00"),
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 16).format("yyyy-MM-dd 00:00:00");

    Object.assign(gantt.config.RightCols[0], {
      GanttChartMinStart: startDate, GanttChartMaxEnd: endDate,
      GanttChartMaxStart: startDate, GanttChartMinEnd: endDate,

      GanttRunCustom: 'HorizonStrt,HorizonEnd,Color,InventoryId,PlanorderId',

      GanttTop: '0',
      GanttTop1: '0',
      GanttBottom: '',

      GanttRunTop: '0',
      GanttRunBottom: '0',
      GanttRunErrorsShift : '-1',

      // GanttPaging: "1",
      // GanttPagingFixed: "1"
    });

    Object.assign(gantt.config.Actions, {
      OnRightDragGantt: 'DragGanttDependency',
      OnShiftDragGantt: 'SelectGanttRunRect',
      OnRightClickGantt: '0'
    });

    Object.assign(gantt.config.Zoom[0], {
      Name: 'Half-Day',
      GanttUnits: 'h',
      GanttChartRound: 'd',
      GanttWidth: '12',
      GanttHeader1: 'd#MM/d(ddd)',
      GanttHeader2: 'h12#HH:00',
      GanttBackground: 'h#23:57#2;'
    });

    Object.assign(gantt.config.Zoom[2], {
      Name: 'Week',
      GanttUnits: 'd',
      GanttChartRound: 'd',
      GanttWidth: '30',
      GanttHeader1: 'M#yyyy/MM',
      GanttHeader2: 'w1#xxx',
      GanttBackground: 'w#12/12/1999 23:30#2;'
    });

    setInitialConfig(gantt.config);
  }

  function onSubmit() {
    loadPlanHorizon();
  }

  function loadPlanHorizon() {
    let formData = new FormData();

    formData.append('simul-version', getValues('simulVerId'));

    zAxios({
      method: 'post',
      url: baseURI() + 'masterplan/resource-gantt/plan-horizon',
      data: formData
    }).then(function (res) {
      let fromDate = new Date(res.data.zone1Start).format("yyyy-MM-dd HH:mm:ss"),
      toDate = new Date(res.data.endTime);
      toDate.setDate(toDate.getDate() + 1);
      toDate = toDate.format("yyyy-MM-dd HH:mm:ss");

      Object.assign(gantt.config.RightCols[0], {
        'GanttBase': fromDate, 'GanttFinish': toDate,
        'GanttChartMinStart': fromDate, 'GanttChartMaxEnd': toDate,
        'GanttChartMaxStart': fromDate, 'GanttChartMinEnd': toDate
      });
    }).catch(function (err) {
      console.log(err);
    }).then(function () {
      loadData();
    });
  }

  function loadData() {
    setHeaderUnit('Day');
    refreshSearch();

    gantt.bodyData = [];

    let formData = new FormData();

    formData.append('main-version-id', getValues('conbdMainVerDtlId'));

    zAxios({
      method: 'post',
      url: baseURI() + 'masterplan/resource-gantt',
      data: formData
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        let resData = res.data;

        resData.forEach(function (data, idx) {
          let runData = [];
          data.id = idx + 1;
          data.activities.forEach(function (activity, idxOfActivity) {
            let runActivity = {};
    
            runActivity.id = idxOfActivity + 1;
            runActivity.Id = activity.id;
            if (activity.bucketStrtDt != null) {
              runActivity.HorizonStrt = new Date(activity.bucketStrtDt).format("yyyy-MM-dd HH:mm:ss");
              runActivity.HorizonEnd = new Date(activity.bucketEndDt).format("yyyy-MM-dd HH:mm:ss");
            }
            runActivity.Start = new Date(activity.strtDt).format("yyyy-MM-dd HH:mm:ss");
            runActivity.End = new Date(activity.endDt).format("yyyy-MM-dd HH:mm:ss");
            runActivity.Text = activity.text;
            runActivity.Color = activity.color;
            runActivity.Height = activity.actHeight;
            runActivity.InventoryId = activity.inventoryId;
            runActivity.PlanorderId = activity.planorderId;
    
            runData.push(runActivity);
          });

          data.RUN = JSON.stringify(runData);
          data.GANTTGanttBackground = data.holidays;
          data.Height = 90;
        });

        gantt.bodyData.push(resData);
        gantt.data.Body = gantt.bodyData;
      }
    }).catch(function (err) {
      console.log(err);
    }).then(function() {
      gantt.resourceGantt.Source.Data.Data = gantt.data;
      gantt.resourceGantt.Source.Layout.Data = gantt.config;

      gantt.resourceGantt.Reload();
      setZoomInHeightBtnDisable('');
      setZoomOutHeightBtnDisable('disabled');
    });
  }

  function loadActivityDetails(id) {
    let activityDetails = {};

    $.ajax({
      type: 'POST',
      url: baseURI() + 'masterplan/resource-gantt/activity-detail',
      headers: getHeaders(),
      data: {'id': id, 'menu-cd': 'UI_MP_GANTT_RESOURCE' },
      async: false,
      success: function (data) {
        activityDetails = {
          routeId: data.routeId,
          activityId: data.activityId,
          qty: data.qty
        }
      }
    });

    return activityDetails;
  }

  function handleCreate(ganttObject) {
    gantt.resourceGantt = ganttObject;
    const ganttId = gantt.resourceGantt.id;

    TGSetEvent('OnGetGanttRunText', ganttId, function (grid, row, col, run, idx, text) {
      const runBox = run[idx],
            backgroundColor = runBox[22],
            inventoryId = runBox[23],
            planorderId = runBox[24],
            textColor = '#FFFFFF';

      const orderItemSearch = orderItemSearchRef.current,
            planorder = !orderItemSearch.order ? planorderId : orderItemSearch.order.toUpperCase(),
            inventory = !orderItemSearch.item ? inventoryId : orderItemSearch.item.toUpperCase(),
            opacity = (planorderId.includes(planorder) && inventoryId.includes(inventory)) ? 1 : 0.1;

      return `<div class="basicBox" style="background: ${backgroundColor}; color: ${textColor}; margin-right: 1px; opacity: ${opacity};">
                <div class="basicBoxText">${text}</div>
              </div>`;
    });

    TGSetEvent('OnGetGanttRunClass', ganttId, function (grid, row, col, run, idx, cls) {
      return 'None';
    });

    TGSetEvent('OnClickSideButton', ganttId, function (grid, row, col, x, y) {
      if (col === 'resourceId') {
        const items = (resourceFilterListRef.current.length > 0) ? `|${resourceFilterListRef.current.join('|')}` : '',
              menu = {Default: {Bool: 1}, Items: items, Buttons: ['Clear', 'Ok'], MaxHeight: 260};
        menu.OnSave = (item, result) => {
          filteredResourceRef.current = result;
          const classList = document.querySelector('#mpResourceGantt .columnFilter').classList;
          if (result.length === 0 ) {
            grid.ActionShowAllRows();
            classList.remove('active');
          } else {
            for (let row = grid.GetFirst(); row; row = grid.GetNext(row)) {
              grid.ShowRow(row);
              if (!result.includes(Get(row, 'resourceId'))) {
                grid.HideRow(row);
              }
            }
            classList.add('active');
          }
        }
        grid.ShowMenu(row, col, menu, {Align: "right below"}, null, filteredResourceRef.current);
      }
    });

    TGSetEvent('OnDblClick', ganttId, function (grid, row, col, x, y) {
      const ganttXY = grid.GetGanttXY(row, col, x, y);
      if (!ganttXY || ganttXY.Type === null) {
        return;
      }
      const runBox = grid.GetGanttRunBox(row, col, ganttXY.RunIndex);
      let activityDetails = loadActivityDetails(runBox.Id),
          details = {
            'activity': {
              'P/O ID': runBox.PlanorderId,
              'ACT_ID': activityDetails.activityId,
              'Route': activityDetails.routeId,
              'Resource Id': row.resourceId,
              'Start Date': new Date(runBox.Start).format('yyyy-MM-dd HH:mm:ss'),
              'End Date': new Date(runBox.End).format('yyyy-MM-dd HH:mm:ss'),
              'PO Quantity': activityDetails.qty,
              'Item': runBox.InventoryId,
            }
          }

      setActivityDetails(details);
      grid.ActionDeselectGanttRunAll();
    });

    TGSetEvent('OnRenderFinish', ganttId, function (grid) {

      let resourceIdArr = [];
      for (let row = grid.GetFirst(); row; row = grid.GetNext(row)) {
        resourceIdArr.push(Get(row, "resourceId"));
      }

      resourceFilterListRef.current = resourceIdArr;
      filteredResourceRef.current = [];
    });

    TGSetEvent('OnGetGanttHeader', ganttId, function (grid, val, index, date, nextDate, units, width, partial, col) {
      if (index === 1) {
        return `<span>${val.replaceAll('...', '')}</span>`;
      } else if (units === 'w1' && index === 2){
        return `${DateToString(date + 1,'d(ddd)')} ~ ${DateToString(nextDate - 1,'d(ddd)')}`;
      }
    });

    TGSetEvent('OnGanttTip', ganttId, function (grid, row, col, tip, xy) {
      let tooltip = '',
          runBox = grid.GetGanttRunBox(row, col, xy.RunIndex),
          activityDetails = loadActivityDetails(runBox.Id);

      tooltip += transLangKey('P/O ID') + " : " + runBox.PlanorderId + '<br>';
      tooltip += transLangKey('ACT_ID') + " : " + activityDetails.activityId + '<br>';
      tooltip += transLangKey('Route ID') + " : " + activityDetails.routeId + '<br>';
      tooltip += transLangKey('Resource Id') + " : " + row.resourceId + '<br>';
      if (runBox.HorizonStrt != null) {
        tooltip += transLangKey('Start Date') + " : " + new Date(runBox.HorizonStrt).format('yyyy-MM-dd HH:mm:ss') + '<br>';
        tooltip += transLangKey('End Date') + " : " + new Date(runBox.HorizonEnd).format('yyyy-MM-dd HH:mm:ss') + '<br>';
      } else {
        tooltip += transLangKey('Start Date') + " : " + new Date(runBox.Start).format('yyyy-MM-dd HH:mm:ss') + '<br>';
        tooltip += transLangKey('End Date') + " : " + new Date(runBox.End).format('yyyy-MM-dd HH:mm:ss') + '<br>';
      }
      tooltip += transLangKey('PO Quantity') + " : " + activityDetails.qty + '<br>';
      tooltip += transLangKey('Item') + " : " + runBox.InventoryId + '<br>';

      return tooltip;
    });
  }

  function changeGanttHeaderUnit(header) {
    if (gantt.resourceGantt) {
      gantt.resourceGantt.ChangeZoom(header);
      gantt.resourceGantt.RefreshGantt(5);
    }
    setHeaderUnit(header);
    setZoomOutWidthBtnDisable('');
  }

  function setZoomHeightBtnDisable() {
    const gt = gantt.resourceGantt;
    if (gt.Rows[1].Height <= 60 ) {
      setZoomOutHeightBtnDisable('disabled');
    } else {
      setZoomOutHeightBtnDisable('');
    }
    // if (gt.Cols.GANTT.GanttRunHeight >= 76 ) {
    //   setZoomInHeightBtnDisable('disabled');
    // } else {
    //   setZoomInHeightBtnDisable('');
    // }
  }

  function zoomInHeight() {
    const gt = gantt.resourceGantt;
    const rows = gt.Rows;

    Object.keys(rows).forEach(key => {
      if (rows[key].Kind === "Data") {
        let runArray = JSON.parse(rows[key].RUN);
        let div = 1;

        div = rows[key].Height;
        rows[key].Height += 30;
        div = rows[key].Height / div;

        runArray.forEach(function (run) {
          run.Height *= div;
        });
        rows[key].RUN = JSON.stringify(runArray);
      }
    });

    gt.RefreshGantt();
    setZoomHeightBtnDisable();
  }

  function zoomOutHeight() {
    const gt = gantt.resourceGantt;
    const rows = gt.Rows;

    Object.keys(rows).forEach(key => {
      if (rows[key].Kind === "Data") {
        let runArray = JSON.parse(rows[key].RUN);
        let div = 1;

        div = rows[key].Height;
        rows[key].Height -= 30;
        div /= rows[key].Height;

        runArray.forEach(function (run) {
          run.Height /= div;
        });
        rows[key].RUN = JSON.stringify(runArray);
      }
    });

    gt.RefreshGantt();
    setZoomHeightBtnDisable();
  }

  function getHeaderUnitRange() {
    switch (headerUnit) {
      case 'Half-Day' :
        return 2;
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
      setZoomOutWidthBtnDisable('disabled');
    } else {
      setZoomOutWidthBtnDisable('');
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

  function searchActivity(orderItem) {
    orderItemSearchRef.current.order = orderItem.order;
    orderItemSearchRef.current.item = orderItem.item;
    gantt.resourceGantt.RefreshGantt(65);
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <InputField type="action" name="simulVerId" label={transLangKey("SIMUL_VER")} control={control} onClick={() => { openSimulationVersionPopup() }} style={{ width: "210px" }} >
              <Icon.Search />
            </InputField>
          </SearchRow>
        </SearchArea>
        <ButtonArea>
          <LeftButtonArea>
            <ActivitySearch ref={activitySearchRef} search={searchActivity} style={{ height: '30px' }} />
          </LeftButtonArea>
          <RightButtonArea>
            <HeaderUnitSetting id="resourceGanttHeaderUnit" value={headerUnit} change={changeGanttHeaderUnit} units={units} />
            <CommonButton title={transLangKey("FP_ZOOM_IN")} onClick={() => { zoomInHeight() }} disalbed={zoomInHeightBtnDisable}><Icon.ZoomIn /></CommonButton>
            <CommonButton title={transLangKey("FP_ZOOM_OUT")} onClick={() => { zoomOutHeight() }} disalbed={zoomOutHeightBtnDisable}><Icon.ZoomOut /></CommonButton>
            <CommonButton title={transLangKey("FP_WIDTH_ZOOM_IN")} onClick={() => { zoomInWidth() }}><Icon.Maximize2 style={{ transform: 'rotate(45deg)' }} /></CommonButton>
            <CommonButton title={transLangKey("FP_WIDTH_ZOOM_OUT")} onClick={() => { zoomOutWidth() }} disalbed={zoomOutWidthBtnDisable}><Icon.Minimize2 style={{ transform: 'rotate(45deg)' }} /></CommonButton>
          </RightButtonArea>
        </ButtonArea>
        <GanttChart id="mpResourceGantt" create={handleCreate} initialConfig={initialConfig} details={activityDetails} />
      </ContentInner>

      {simulationVersionPopupOpen && (<PopSimulationVersion open={simulationVersionPopupOpen} onClose={closeSimulationVersionPopup} confirm={setSimulationVersion} module={getValues('moduleCd')} />)}
    </>
  )
}

export default ResourceGantt;
