import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import {
  BaseGrid, ButtonArea, ResultArea, LeftButtonArea, RightButtonArea,
  GridExcelImportButton, GridExcelExportButton, GridDeleteRowButton, GridAddRowButton, GridSaveButton,
  useViewStore, zAxios, StatusArea, GridCnt
} from '@zionex/wingui-core/src/common/imports';
import {
  fpCommonStyles,
  getCodeEditor,
  setCellButtonRenderer,
  setEditableGrid,
  setGridComboList
} from "../../common/common";

import ResourceRoutePopup from "../../common/popup/ResourceRoutePopup";

import '../../common/common.css';
import {transLangKey} from "@wingui";

const divideTpCodeEditor = getCodeEditor('FP_DIVIDE_TP_CD');

const routeJobChangeGridFilters = ['resourceCode', 'resourceName', 'prevRouteCode', 'prevRouteName', 'nextRouteName'];

const routeJobChangeGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 50, textAlignment: "center" },

  { name: "resourceCode", dataType: "text", headerText: "FP_RESOURCE_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true,
    validRules: [{ criteria: "required"}]
  },
  { name: "resourceName", dataType: "text", headerText: "FP_RESOURCE_NM", visible: true, editable: false, width: 200, textAlignment: "near", autoFilter: true },
  { name: "prevRouteCode", dataType: "text", headerText: "FP_PREV_ROUTE_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true,
    validRules: [{ criteria: "required"}]
  },
  { name: "prevRouteName", dataType: "text", headerText: "FP_PREV_ROUTE_NM", visible: true, editable: false, width: 200, textAlignment: "near", autoFilter: true },

  { name: "prevJcTm", dataType: "number", defaultValue: 0, headerText: "FP_PREV_JC_TM", visible: true, editable: true, width: 90, positiveOnly: true, format : "#,##0.0####" },
  { name: "nextJcTm", dataType: "number", defaultValue: 0, headerText: "FP_NEXT_JC_TM", visible: true, editable: true, width: 90, positiveOnly: true, format : "#,##0.0####" },

  { name: "nextRouteCode", dataType: "text", headerText: "FP_NEXT_ROUTE_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true,
    validRules: [{ criteria: "required"}]
  },
  { name: "nextRouteName", dataType: "text", headerText: "FP_NEXT_ROUTE_NM", visible: true, editable: false, width: 200, textAlignment: "near", autoFilter: true},

  { name: "timeUom", dataType: "text", headerText: "FP_TIME_UOM", visible: true, editable: true, width: 95, textAlignment: "center", defaultValue: "MINUTES", useDropdown: true},
  { name: "jcDivideTpCd", dataType: "text", headerText: "FP_JC_DIVIDE_TP_CD", visible: true, editable: true, width: 80, textAlignment: "center", defaultValue: "Y", autoFilter: true,
    styleCallback: () => divideTpCodeEditor
  },

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
  importExceptFields: {0: 'id'},
};

function RouteJobChangeTab(props, ref) {
  const location = useLocation();

  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const [routeJobChangeGrid, setRouteJobChangeGrid] = useState(null);

  const [resourceCd, setResourceCd] = useState('');
  const [routeCellName, setRouteCellName] = useState('');

  const [gridRoutePopup, setGridRoutePopup] = useState(false);

  useEffect(() => {
    setRouteJobChangeGrid(getViewInfo(vom.active, 'routeJobChangeGrid'))
  }, [viewData]);

  useEffect(() => {
    if (routeJobChangeGrid) {
      setEditableGrid(routeJobChangeGrid);
      setGridOptions(routeJobChangeGrid.gridView);

      loadData();
    }
  }, [routeJobChangeGrid]);

  useEffect(() => {
    if (location.state !== undefined && location.state !== null && routeJobChangeGrid) {
      if (location.state.paramType === 'RESOURCE') {
        loadData(location.state.paramCode);
      }
    }
  }, [location, routeJobChangeGrid]);

  useImperativeHandle(ref, () => ({
    loadData(resourceParam) {
      loadData(resourceParam);
    },
    setPopupValues(values) {
      setPopupValues(values);
    }
  }));

  function setGridOptions(gridView) {
    if (gridView.id === 'routeJobChangeGrid') {
      setCellButtonRenderer(gridView, 'resourceCode', true);
      setCellButtonRenderer(gridView, 'prevRouteCode', true);
      setCellButtonRenderer(gridView, 'nextRouteCode', true);

      setGridComboList(gridView, 'timeUom', 'FP_TIME_UOM');

      (gridView.columnByName('prevRouteCode')).styleCallback = routeCodeStyleCallBack;
      (gridView.columnByName('nextRouteCode')).styleCallback = routeCodeStyleCallBack;

      gridView.onCellItemClicked = function (gridView, index, clickData) {
        const resourceCode = gridView.getValue(clickData.index.dataRow, 'resourceCode');
        
        if (clickData.fieldName === 'resourceCode') {
          props.openGridPopup(clickData.fieldName);
        } else {
          if (resourceCode === undefined || resourceCode === null || resourceCode === '') {
            return;
          }

          setResourceCd(resourceCode);
          setRouteCellName(clickData.fieldName);

          if (clickData.fieldName === 'prevRouteCode') {
            setGridRoutePopup(true);
          } else if (clickData.fieldName === 'nextRouteCode') {
            setGridRoutePopup(true);
          }
        }
      };
    }
  }

  function routeCodeStyleCallBack (gridView, dataCell) {
    let style = {};
    const resourceCode = gridView.getValue(dataCell.index.dataRow, 'resourceCode');
    const rowState = gridView.getDataSource().getRowState(dataCell.index.dataRow);

    if ((resourceCode !== undefined && resourceCode !== '' && resourceCode != null && resourceCode !== 'null') && rowState === 'created') {
      style.styleName = 'editable-text-column';
    } else {
      style.styleName = 'text-column';
    }
    return style;
  }

  function clearAllFilters(gridView) {
    if (gridView.id === 'routeJobChangeGrid') {
      routeJobChangeGridFilters.forEach(value => {
        gridView.activateAllColumnFilters(value, false);
      })
    }
  }

  function loadData(resourceParam = '') {
    clearAllFilters(routeJobChangeGrid.gridView);

    let searchResourceParam = resourceParam;

    if (location.state !== undefined && location.state !== null) {
      if (location.state.paramType === 'RESOURCE') {
        searchResourceParam = location.state.paramCode;
      }
    }

    routeJobChangeGrid.gridView.commit(true);
    routeJobChangeGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    zAxios.get(baseURI() + 'factoryplan/master/jobchange/jctimes', {
      params: {
        'searchResource': searchResourceParam
      }
    })
    .then(function (res) {
      routeJobChangeGrid.dataProvider.fillJsonData(res.data);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      routeJobChangeGrid.gridView.hideToast();
      routeJobChangeGrid.gridView.setAllCheck(false, false);
    });
  }

  function setPopupValues(values) {
    if (values.columnName === 'resourceCode') {
      setResourceValues(values);
    }
  }

  function setResourceValues(values) {
    const gridView = routeJobChangeGrid.gridView;
    const index = gridView.getCurrent().itemIndex;

    values["resourceCode"] = values["resourceCd"];
    values["resourceName"] = values["resourceNm"];

    values["prevRouteCode"] = '';
    values["prevRouteName"] = '';
    values["nextRouteCode"] = '';
    values["nextRouteName"] = '';

    gridView.setValues(index, values);
  }

  function setRouteValue(values) {
    if (values['target'] === 'prevRouteCode') {
      setPrevRouteValues(values);
    } else if (values['target'] === 'nextRouteCode') {
      setNextRouteValues(values);
    } else {
      setPrevRouteValues(values);
    }
  }

  function setPrevRouteValues(values) {
    const gridView = routeJobChangeGrid.gridView;
    const index = gridView.getCurrent().itemIndex;

    values["prevRouteCode"] = values["routeCd"];
    values["prevRouteName"] = values["routeNm"];

    gridView.setValues(index, values);
  }

  function setNextRouteValues(values) {
    const gridView = routeJobChangeGrid.gridView;
    const index = gridView.getCurrent().itemIndex;

    values["nextRouteCode"] = values["routeCd"];
    values["nextRouteName"] = values["routeNm"];

    gridView.setValues(index, values);
  }

  const afterToLoad = (targetGrid) => {
    if (targetGrid.gridView.id === 'routeJobChangeGrid') {
      loadData();
    }
  }


  return (
    <Box sx={fpCommonStyles.tabInner}>
      <ResourceRoutePopup open={gridRoutePopup} onClose={() => setGridRoutePopup(false)} confirm={setRouteValue} resourceCd={resourceCd} target={routeCellName} />
      <ButtonArea>
        <LeftButtonArea>
          <GridExcelExportButton grid="routeJobChangeGrid" options={exportOptions} />
          {/*<GridExcelImportButton grid="routeJobChangeGrid" />*/}
        </LeftButtonArea>
        <RightButtonArea>
          <GridAddRowButton grid="routeJobChangeGrid" />
          <GridDeleteRowButton grid="routeJobChangeGrid" url="factoryplan/master/jobchange/jctimes/delete" onAfterDelete={afterToLoad} />
          <GridSaveButton grid="routeJobChangeGrid" url="factoryplan/master/jobchange/jctimes" onAfterSave={afterToLoad} />
        </RightButtonArea>
      </ButtonArea>
      <ResultArea sizes={[100, 50]} direction={"vertical"}>
        <BaseGrid id="routeJobChangeGrid" items={routeJobChangeGridItems} className="white-skin" />
      </ResultArea>
      <StatusArea show={false} message={''}>
        <GridCnt grid="routeJobChangeGrid" format={'{0} ' + transLangKey('CASES') + ' ' + transLangKey('MSG_0010')}></GridCnt>
      </StatusArea>
    </Box>
  );
}

RouteJobChangeTab = forwardRef(RouteJobChangeTab);
export default RouteJobChangeTab;
