import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import {
  BaseGrid, ButtonArea, ResultArea, LeftButtonArea, RightButtonArea,
  GridExcelImportButton, GridExcelExportButton, GridDeleteRowButton, GridAddRowButton, GridSaveButton,
  useViewStore, zAxios, StatusArea, GridCnt
} from '@zionex/wingui-core/src/common/imports';
import {
  getCodeEditor,
  setCellButtonRenderer,
  setEditableGrid,
  setCodeColumnStyle,
  setGridComboList,
  fpCommonStyles
} from "../../common/common";

import ResourceRouteGroupPopup from "../../common/popup/ResourceRouteGroupPopup";

import '../../common/common.css';
import {transLangKey} from "@wingui";

const divideTpCodeEditor = getCodeEditor('FP_DIVIDE_TP_CD');

const routeGroupJobChangeGridFilters = ['resourceCode', 'resourceName', 'prevRouteGrpCode', 'prevRouteGrpName', 'nextRouteGrpName'];

const routeGroupJobChangeGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 50, textAlignment: "center" },

  { name: "resourceCode", dataType: "text", headerText: "FP_RESOURCE_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true,
    validRules: [{ criteria: "required"}]
  },
  { name: "resourceName", dataType: "text", headerText: "FP_RESOURCE_NM", visible: true, editable: false, width: 200, textAlignment: "near", autoFilter: true },
  { name: "prevRouteGrpCode", dataType: "text", headerText: "FP_PREV_ROUTE_GRP_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true,
    validRules: [{ criteria: "required"}]
  },
  { name: "prevRouteGrpName", dataType: "text", headerText: "FP_PREV_ROUTE_GRP_NM", visible: true, editable: false, width: 200, textAlignment: "near", autoFilter: true },

  { name: "prevJcTm", dataType: "number", defaultValue: 0, headerText: "FP_PREV_JC_TM", visible: true, editable: true, width: 90, positiveOnly: true, format : "#,##0.0####" },
  { name: "nextJcTm", dataType: "number", defaultValue: 0, headerText: "FP_NEXT_JC_TM", visible: true, editable: true, width: 90, positiveOnly: true, format : "#,##0.0####" },

  { name: "nextRouteGrpCode", dataType: "text", headerText: "FP_NEXT_ROUTE_GRP_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true,
    validRules: [{ criteria: "required"}]
  },
  { name: "nextRouteGrpName", dataType: "text", headerText: "FP_NEXT_ROUTE_GRP_NM", visible: true, editable: false, width: 200, textAlignment: "near", autoFilter: true},

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

function RouteGroupJobChangeTab(props, ref) {
  const location = useLocation();

  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const [routeGroupJobChangeGrid, setRouteGroupJobChangeGrid] = useState(null);

  const [resourceCd, setResourceCd] = useState('');
  const [routeGrpCellName, setRouteGrpCellName] = useState('');

  const [gridRouteGrpPopup, setGridRouteGrpPopup] = useState(false);

  useEffect(() => {
    setRouteGroupJobChangeGrid(getViewInfo(vom.active, 'routeGroupJobChangeGrid'))
  }, [viewData]);

  useEffect(() => {
    if (routeGroupJobChangeGrid) {
      setEditableGrid(routeGroupJobChangeGrid);
      setGridOptions(routeGroupJobChangeGrid.gridView);

      loadData();
    }
  }, [routeGroupJobChangeGrid]);

  useEffect(() => {
    if (location.state !== undefined && location.state !== null && routeGroupJobChangeGrid) {
      if (location.state.paramType === 'RESOURCE') {
        loadData(location.state.paramCode);
      }
    }
  }, [location, routeGroupJobChangeGrid]);

  useImperativeHandle(ref, () => ({
    loadData(resourceParam) {
      loadData(resourceParam);
    },
    setPopupValues(values) {
      setPopupValues(values);
    }
  }));

  function setGridOptions(gridView) {
    if (gridView.id === 'routeGroupJobChangeGrid') {
      setCellButtonRenderer(gridView, 'resourceCode', true);
      setCellButtonRenderer(gridView, 'prevRouteGrpCode', true);
      setCellButtonRenderer(gridView, 'nextRouteGrpCode', true);

      setGridComboList(gridView, 'timeUom', 'FP_TIME_UOM');

      (gridView.columnByName('resourceCode')).styleCallback = setCodeColumnStyle;
      (gridView.columnByName('prevRouteGrpCode')).styleCallback = routeGrpCodeStyleCallBack;
      (gridView.columnByName('nextRouteGrpCode')).styleCallback = routeGrpCodeStyleCallBack;

      gridView.onCellItemClicked = function (gridView, index, clickData) {
        const resourceCode = gridView.getValue(clickData.index.dataRow, 'resourceCode');

        if (clickData.fieldName === 'resourceCode') {
          props.openGridPopup(clickData.fieldName);
        } else {
          if (resourceCode === undefined || resourceCode === null || resourceCode === '') {
            return;
          }

          setResourceCd(resourceCode);
          setRouteGrpCellName(clickData.fieldName);

          if (clickData.fieldName === 'prevRouteGrpCode') {
            setGridRouteGrpPopup(true);
          } else if (clickData.fieldName === 'nextRouteGrpCode') {
            setGridRouteGrpPopup(true);
          }
        }
      };
    }
  }

  function routeGrpCodeStyleCallBack (gridView, dataCell) {
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
    if (gridView.id === 'routeGroupJobChangeGrid') {
      routeGroupJobChangeGridFilters.forEach(value => {
        gridView.activateAllColumnFilters(value, false);
      })
    }
  }

  function loadData(resourceParam = '') {
    clearAllFilters(routeGroupJobChangeGrid.gridView);

    let searchResourceParam = resourceParam;

    if (location.state !== undefined && location.state !== null) {
      if (location.state.paramType === 'RESOURCE') {
        searchResourceParam = location.state.paramCode;
      }
    }

    routeGroupJobChangeGrid.gridView.commit(true);
    routeGroupJobChangeGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    zAxios.get(baseURI() + 'factoryplan/master/jobchange/jctimegroups', {
      params: {
        'searchResource': searchResourceParam
      }
    })
    .then(function (res) {
      routeGroupJobChangeGrid.dataProvider.fillJsonData(res.data);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      routeGroupJobChangeGrid.gridView.hideToast();
      routeGroupJobChangeGrid.gridView.setAllCheck(false, false);
    });
  }

  function setPopupValues(values) {
    if (values.columnName === 'resourceCode') {
      setResourceValues(values);
    }
  }

  function setResourceValues(values) {
    const gridView = routeGroupJobChangeGrid.gridView;
    const index = gridView.getCurrent().itemIndex;

    values["resourceCode"] = values["resourceCd"];
    values["resourceName"] = values["resourceNm"];

    values["prevRouteGrpCode"] = '';
    values["prevRouteGrpName"] = '';
    values["nextRouteGrpCode"] = '';
    values["nextRouteGrpName"] = '';

    gridView.setValues(index, values);
  }

  function setRouteGrpValue(values) {
    if (values['target'] === 'prevRouteGrpCode') {
      setPrevRouteGrpValues(values);
    } else if (values['target'] === 'nextRouteGrpCode') {
      setNextRouteGrpValues(values);
    } else {
      setPrevRouteGrpValues(values);
    }
  }

  function setPrevRouteGrpValues(values) {
    const gridView = routeGroupJobChangeGrid.gridView;
    const index = gridView.getCurrent().itemIndex;

    values["prevRouteGrpCode"] = values["routeGrpCd"];
    values["prevRouteGrpName"] = values["routeGrpNm"];

    gridView.setValues(index, values);
  }

  function setNextRouteGrpValues(values) {
    const gridView = routeGroupJobChangeGrid.gridView;
    const index = gridView.getCurrent().itemIndex;

    values["nextRouteGrpCode"] = values["routeGrpCd"];
    values["nextRouteGrpName"] = values["routeGrpNm"];

    gridView.setValues(index, values);
  }

  const afterToLoad = (targetGrid) => {
    if (targetGrid.gridView.id === 'routeGroupJobChangeGrid') {
      loadData();
    }
  }


  return (
    <Box sx={fpCommonStyles.tabInner}>
      <ResourceRouteGroupPopup open={gridRouteGrpPopup} onClose={() => setGridRouteGrpPopup(false)} confirm={setRouteGrpValue} resourceCd={resourceCd} target={routeGrpCellName} />
      <ButtonArea>
        <LeftButtonArea>
          <GridExcelExportButton grid="routeGroupJobChangeGrid" options={exportOptions} />
          {/*<GridExcelImportButton grid="routeGroupJobChangeGrid" />*/}
        </LeftButtonArea>
        <RightButtonArea>
          <GridAddRowButton grid="routeGroupJobChangeGrid" />
          <GridDeleteRowButton grid="routeGroupJobChangeGrid" url="factoryplan/master/jobchange/jctimegroups/delete" onAfterDelete={afterToLoad} />
          <GridSaveButton grid="routeGroupJobChangeGrid" url="factoryplan/master/jobchange/jctimegroups" onAfterSave={afterToLoad} />
        </RightButtonArea>
      </ButtonArea>
      <ResultArea sizes={[100, 50]} direction={"vertical"}>
        <BaseGrid id="routeGroupJobChangeGrid" items={routeGroupJobChangeGridItems} className="white-skin" />
      </ResultArea>
      <StatusArea show={false} message={''}>
        <GridCnt grid="routeGroupJobChangeGrid" format={'{0} ' + transLangKey('CASES') + ' ' + transLangKey('MSG_0010')}></GridCnt>
      </StatusArea>
    </Box>
  );
}

RouteGroupJobChangeTab = forwardRef(RouteGroupJobChangeTab);
export default RouteGroupJobChangeTab;
