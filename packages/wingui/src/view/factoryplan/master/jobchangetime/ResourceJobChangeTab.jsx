import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import {
  BaseGrid,
  ButtonArea,
  ResultArea,
  LeftButtonArea,
  RightButtonArea,
  GridExcelImportButton,
  GridExcelExportButton,
  GridSaveButton,
  useViewStore,
  zAxios,
  StatusArea, GridCnt
} from '@zionex/wingui-core/src/common/imports';
import {
  fpCommonStyles,
  getCodeEditor,
  setEditableGrid,
  setGridComboList
} from "../../common/common";

import '../../common/common.css';
import {transLangKey} from "@wingui";

const divideTpCodeEditor = getCodeEditor('FP_DIVIDE_TP_CD');

const resourceJobChangeGridFilters = ['resourceCode', 'resourceName'];

const resourceJobChangeGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 50, textAlignment: "center" },

  { name: "resourceCd", dataType: "text", headerText: "FP_RESOURCE_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true},
  { name: "resourceNm", dataType: "text", headerText: "FP_RESOURCE_NM", visible: true, editable: false, width: 200, textAlignment: "near", autoFilter: true },
  { name: "descTxt", dataType: "text", headerText: "FP_DESC_TXT", visible: true, editable: false, width: 80, textAlignment: "near" },

  { name: "jcTm", dataType: "number", defaultValue: 0, headerText: "FP_JC_TM", visible: true, editable: true, width: 90, positiveOnly: true, format : "#,##0.0####" },
  { name: "routeJcTm", dataType: "number", defaultValue: 0, headerText: "FP_ROUTE_JC_TM", visible: true, editable: true, width: 90, positiveOnly: true, format : "#,##0.0####" },
  { name: "routeGrpJcTm", dataType: "number", defaultValue: 0, headerText: "FP_ROUTE_GRP_JC_TM", visible: true, editable: true, width: 90, positiveOnly: true, format : "#,##0.0####" },
  { name: "jcDivideTpCd", dataType: "text", headerText: "FP_JC_DIVIDE_TP_CD", visible: true, editable: true, width: 80, textAlignment: "center", defaultValue: "Y", autoFilter: true,
    styleCallback: () => divideTpCodeEditor
  },
  { name: "timeUom", dataType: "text", headerText: "FP_TIME_UOM", visible: true, editable: true, width: 95, textAlignment: "center", defaultValue: "MINUTES", useDropdown: true},
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

function ResourceJobChangeTab(props, ref) {
  const location = useLocation();

  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const [resourceJobChangeGrid, setResourceJobChangeGrid] = useState(null);

  useEffect(() => {
    setResourceJobChangeGrid(getViewInfo(vom.active, 'resourceJobChangeGrid'))
  }, [viewData]);

  useEffect(() => {
    if (resourceJobChangeGrid) {
      setEditableGrid(resourceJobChangeGrid);
      resourceJobChangeGrid.gridView.setCheckBar({ visible: false });
      setGridOptions(resourceJobChangeGrid.gridView);

      loadData();
    }
  }, [resourceJobChangeGrid]);

  useEffect(() => {
    if (location.state !== undefined && location.state !== null && resourceJobChangeGrid) {
      if (location.state.paramType === 'RESOURCE') {
        loadData(location.state.paramCode);
      }
    }
  }, [location, resourceJobChangeGrid]);

  useImperativeHandle(ref, () => ({
    loadData(resourceParam) {
      loadData(resourceParam);
    }
  }));

  function setGridOptions(gridView) {
    if (gridView.id === 'resourceJobChangeGrid') {
      setGridComboList(gridView, 'timeUom', 'FP_TIME_UOM');
    }
  }

  function clearAllFilters(gridView) {
    if (gridView.id === 'resourceJobChangeGrid') {
      resourceJobChangeGridFilters.forEach(value => {
        gridView.activateAllColumnFilters(value, false);
      })
    }
  }

  function loadData(resourceParam = '') {
    clearAllFilters(resourceJobChangeGrid.gridView);

    let searchResourceParam = resourceParam;

    if (location.state !== undefined && location.state !== null) {
      if (location.state.paramType === 'RESOURCE') {
        searchResourceParam = location.state.paramCode;
      }
    }

    resourceJobChangeGrid.gridView.commit(true);
    resourceJobChangeGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    zAxios.get(baseURI() + 'factoryplan/master/jobchange/resources', {
      params: {
        'searchResource': searchResourceParam
      }
    })
    .then(function (res) {
      resourceJobChangeGrid.dataProvider.fillJsonData(res.data);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      resourceJobChangeGrid.gridView.hideToast();
    });
  }

  const afterToLoad = (targetGrid) => {
    if (targetGrid.gridView.id === 'resourceJobChangeGrid') {
      loadData();
    }
  }

  return (
    <Box sx={fpCommonStyles.tabInner}>
      <ButtonArea>
        <LeftButtonArea>
          <GridExcelExportButton grid="resourceJobChangeGrid" options={exportOptions} />
          {/*<GridExcelImportButton grid="resourceJobChangeGrid" />*/}
        </LeftButtonArea>
        <RightButtonArea>
          <GridSaveButton grid="resourceJobChangeGrid" url="factoryplan/master/jobchange/resources" onAfterSave={afterToLoad} />
        </RightButtonArea>
      </ButtonArea>
      <ResultArea sizes={[100, 50]} direction={"vertical"}>
        <BaseGrid id="resourceJobChangeGrid" items={resourceJobChangeGridItems} className="white-skin" />
      </ResultArea>
      <StatusArea show={false} message={''}>
        <GridCnt grid="resourceJobChangeGrid" format={'{0} ' + transLangKey('CASES') + ' ' + transLangKey('MSG_0010')}></GridCnt>
      </StatusArea>
    </Box>
  );
}

ResourceJobChangeTab = forwardRef(ResourceJobChangeTab);
export default ResourceJobChangeTab;
