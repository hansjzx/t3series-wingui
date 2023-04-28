import React, { useEffect, useState } from 'react';
import { useForm } from "react-hook-form";
import {
  ButtonArea, ContentInner, SearchArea, SearchRow, ResultArea, LeftButtonArea, RightButtonArea, BaseGrid, InputField,
  CommonButton, GridExcelImportButton, GridExcelExportButton, GridDeleteRowButton, GridAddRowButton, GridSaveButton,
  useViewStore, zAxios, StatusArea, GridCnt
} from '@zionex/wingui-core/src/common/imports';
import { getCodeEditor, setCellButtonRenderer, setEditableGrid, setCodeColumnStyle } from "../../common/common";
import { transLangKey } from "@wingui";

import StagePopup from "../../common/popup/StagePopup";
import RouteGroupPopup from "../../common/popup/RouteGroupPopup";
import RouteGroupMasterPopup from "./RouteGroupMasterPopup";

import '../../common/common.css';

const divideTpCode = getCodeEditor('FP_DIVIDE_TP_CD');
const routeGridFilters = ['routeCd', 'routeNm', 'routeGroupCode', 'stageCode', 'plantCode'];

const routeGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 50, textAlignment: "center" },
  {
    name: "routeCd", dataType: "text", headerText: "FP_ROUTE_CD", visible: true, editable: true, width: 150, textAlignment: "near", autoFilter: true,
    validRules: [{ criteria: "required" }]
  },
  { name: "routeNm", dataType: "text", headerText: "FP_ROUTE_NM", visible: true, editable: true, width: 200, textAlignment: "near", autoFilter: true },
  { name: "descTxt", dataType: "text", headerText: "FP_DESC_TXT", visible: true, editable: true, width: 80, textAlignment: "near" },
  {
    name: "divideTpCd", dataType: "text", headerText: "FP_DIVIDE_TP_CD", visible: true, editable: true, width: 80, textAlignment: "center", defaultValue: "Y",
    styleCallback: () => divideTpCode
  },
  {
    name: "routeGroupCode", dataType: "text", headerText: "FP_ROUTE_GRP_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true,
    styleName: "editable-text-column",
    validRules: [{ criteria: "required" }]
  },
  { name: "routeGroupName", dataType: "text", headerText: "FP_ROUTE_GRP_NM", visible: true, editable: false, width: 200, textAlignment: "near" },
  {
    name: "groupStage", dataType: "group", orientation: "horizontal", headerText: "FP_STAGE", expandable: true, expanded: false,
    childs: [
      {
        name: "stageCode", dataType: "text", headerText: "FP_STAGE_CD", visible: true, editable: false, width: 150, textAlignment: "near", groupShowMode: "always", autoFilter: true,
        styleName: "editable-text-column",
        validRules: [{ criteria: "required" }]
      },
      { name: "stageName", dataType: "text", headerText: "FP_STAGE_NM", visible: true, editable: false, width: 200, textAlignment: "near", groupShowMode: "expand" },
      {
        name: "plantCode", dataType: "text", headerText: "PLANT_CD", visible: true, editable: false, width: 150, textAlignment: "near", groupShowMode: "expand", autoFilter: true,
        validRules: [{ criteria: "required" }]
      },
      { name: "plantName", dataType: "text", headerText: "PLANT_NM", visible: true, editable: false, width: 200, textAlignment: "near", groupShowMode: "expand" }
    ]
  },
  { name: "lazyJcTmYn", dataType: "boolean", headerText: "FP_LAZY_JC_TM_YN", visible: true, editable: true, width: 95, textAlignment: "center", defaultValue: false },
  {
    name: "groupAudit", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", expandable: true, expanded: false,
    childs: [
      { name: "updatedBy", dataType: "text", headerText: "FP_UPDATED_BY", visible: true, editable: false, width: 80, textAlignment: "center", groupShowMode: "expand" },
      { name: "updatedAt", dataType: "datetime", headerText: "FP_UPDATED_AT", visible: true, editable: false, width: 125, textAlignment: "center", groupShowMode: "always" },
      { name: "createdBy", dataType: "text", headerText: "FP_CREATED_BY", visible: true, editable: false, width: 80, textAlignment: "center", groupShowMode: "expand" },
      { name: "createdAt", dataType: "datetime", headerText: "FP_CREATED_AT", visible: true, editable: false, width: 125, textAlignment: "center", groupShowMode: "expand" },
    ]
  },
];

const exportOptions = {
  lookupDisplay: false,
  separateRows: true,
  headerDepth: 2,
  importExceptFields: { 0: 'id' },
};

function Route() {
  const { control, getValues } = useForm({
    defaultValues: {
      routeParam: '',
    }
  });
  const globalButtons = [
    {
      name: "search",
      action: () => loadData(),
      visible: true,
      disable: false
    }
  ];

  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [routeGrid, setRouteGrid] = useState(null);

  const [gridStagePopup, setGridStagePopup] = useState(false);
  const [girdRouteGroupPopup, setGirdRouteGroupPopup] = useState(false);
  const [routeGroupMstPopup, setRouteGroupMstPopup] = useState(false);

  useEffect(() => {
    setRouteGrid(getViewInfo(vom.active, 'routeGrid'))
  }, [viewData]);

  useEffect(() => {
    if (routeGrid) {
      setViewInfo(vom.active, 'globalButtons', globalButtons);
      setEditableGrid(routeGrid);
      setGridOptions(routeGrid.gridView);

      loadData();
    }
  }, [routeGrid]);

  function setGridOptions(gridView) {
    if (gridView.id === 'routeGrid') {
      setCellButtonRenderer(gridView, 'stageCode');
      setCellButtonRenderer(gridView, 'routeGroupCode');

      (gridView.columnByName('routeCd')).styleCallback = setCodeColumnStyle;

      gridView.onCellItemClicked = function (grid, index, clickData) {
        if (clickData.fieldName === 'routeGroupCode') {
          setGirdRouteGroupPopup(true);
        } else if (clickData.fieldName === 'stageCode') {
          setGridStagePopup(true)
        }
      };
    }
  }

  function onParamKeyPress(event) {
    if (event.key === "Enter") {
      loadData();
    }
  }

  function clearAllFilters(gridView) {
    if (gridView.id === 'routeGrid') {
      routeGridFilters.forEach(value => {
        gridView.activateAllColumnFilters(value, false);
      })
    }
  }

  function loadData() {
    clearAllFilters(routeGrid.gridView);

    zAxios.get(baseURI() + 'factoryplan/master/route/routes', {
      params: {
        'route': getValues('routeParam')
      }
    })
      .then(function (res) {
        routeGrid.dataProvider.fillJsonData(res.data);
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
        routeGrid.gridView.hideToast();
        routeGrid.gridView.setAllCheck(false, false);
      });
  }

  function setStageValues(values) {
    const gridView = routeGrid.gridView;
    const index = gridView.getCurrent().itemIndex;

    values["stageCode"] = values["stageCd"];
    values["stageName"] = values["stageNm"];
    values["plantCode"] = values["plantCd"];
    values["plantName"] = values["plantNm"];

    gridView.setValues(index, values);
  }

  function setRouteGroupValues(values) {
    const gridView = routeGrid.gridView;
    const index = gridView.getCurrent().itemIndex;

    values["routeGroupCode"] = values["routeGrpCd"];
    values["routeGroupName"] = values["routeGrpNm"];

    gridView.setValues(index, values);
  }

  const afterToLoad = (targetGrid) => {
    if (targetGrid.gridView.id === 'routeGrid') {
      loadData();
    }
  }

  return (
    <ContentInner>
      <StagePopup open={gridStagePopup} onClose={() => setGridStagePopup(false)} confirm={setStageValues} />
      <RouteGroupPopup open={girdRouteGroupPopup} onClose={() => setGirdRouteGroupPopup(false)} confirm={setRouteGroupValues} />
      <RouteGroupMasterPopup open={routeGroupMstPopup} onClose={() => setRouteGroupMstPopup(false)} />

      <SearchArea>
        <SearchRow>
          <InputField control={control} label={transLangKey("FP_ROUTE")} name="routeParam" width="100%" onKeyPress={onParamKeyPress} />
          {/*<IconButton onClick={loadData} className={iconClasses.iconButton} title={transLangKey("SEARCH")}><Icon.Search /></IconButton>*/}
        </SearchRow>
      </SearchArea>

      <ButtonArea>
        <LeftButtonArea>
          <GridExcelExportButton grid="routeGrid" options={exportOptions} />
          {/*<GridExcelImportButton grid="routeGrid" />*/}
          <CommonButton type="text" onClick={() => { setRouteGroupMstPopup(true) }}>{transLangKey("FP_ROUTE_GROUP_MST")}</CommonButton>
        </LeftButtonArea>
        <RightButtonArea>
          <GridAddRowButton grid="routeGrid" />
          <GridDeleteRowButton grid="routeGrid" url="factoryplan/master/route/routes/delete" onAfterDelete={afterToLoad} />
          <GridSaveButton grid="routeGrid" url="factoryplan/master/route/routes" onAfterSave={afterToLoad} />
        </RightButtonArea>
      </ButtonArea>

      <ResultArea sizes={[100, 50]} direction={"vertical"}>
        <BaseGrid id="routeGrid" items={routeGridItems} className="white-skin" />
      </ResultArea>
      <StatusArea show={false} message={''}>
        <GridCnt grid="routeGrid" format={'{0} ' + transLangKey('CASES') + ' ' + transLangKey('MSG_0010')}></GridCnt>
      </StatusArea>
    </ContentInner>
  )
}

export default Route;
