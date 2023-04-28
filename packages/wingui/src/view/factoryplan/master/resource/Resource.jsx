import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ButtonArea, ContentInner, GridAddRowButton, GridDeleteRowButton, GridExcelExportButton, GridExcelImportButton, GridSaveButton,
  LeftButtonArea, ResultArea, RightButtonArea, SearchArea, SearchRow, useViewStore, BaseGrid, InputField, zAxios, StatusArea, GridCnt
} from '@zionex/wingui-core/src/common/imports';
import {
  getCodeEditor, setCellButtonRenderer, setCodeColumnStyle, setEditableGrid, setGridComboList
} from '../../common/common';
import {setColorPickerRenderer, transLangKey} from '@wingui';
import StagePopup from '../../common/popup/StagePopup';
import '../../common/common.css';

const fifoTpCdEditor = getCodeEditor('FP_FIFO_TP_CD');
const exportOptions = {
  lookupDisplay: false,
  importExceptFields: { 0: 'id' },
  headerDepth: 2
}
const resourceGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false },
  { name: "resourceCd", dataType: "text", headerText: "RES_CD", visible: true, editable: false, width: 150, autoFilter: true,
    editor: { type: "text", maxLength: 100 },
    validRules: [{ criteria: "required"}]
  },
  { name: "resourceNm", dataType: "text", headerText: "FP_RESOURCE_NM", visible: true, editable: true, width: 200, autoFilter: true },
  { name: "descTxt", dataType: "text", headerText: "FP_DESC_TXT", visible: true, editable: true, width: 80,
    editor: { type: "text", maxLength: 500 }
  },
  { name: "displaySeq", dataType: "number", headerText: "FP_DISPLAY_SEQ", visible: true, editable: true, width: 80, defaultValue: 1,
    editor: { type: "number", maxIntegerLength: 20, positiveOnly: true, integerOnly: true },
    numberFormat: "#,##0.###"
  },
  { name: "displayColor", dataType: "text", headerText: "FP_DISPLAY_COLOR", visible: true, editable: true, width: 90, defaultValue: "#ff96c8" },
  { name: "stageGroup", dataType: "group", orientation: "horizontal", headerText: "FP_STAGE", expandable: true, expanded: false,
    childs: [
      { name: "stageCode", dataType: "text", headerText: "FP_STAGE_CD", visible: true, editable: false, width: 150, autoFilter: true, groupShowMode: "always",
        editor: { type: "text", maxLength: 100 }, styleName: "editable-text-column",
        validRules: [{ criteria: "required" }]
      },
      { name: "stageName", dataType: "text", headerText: "FP_STAGE_NM", visible: true, editable: false, width: 200, groupShowMode: "expand" },
      { name: "plantCd", dataType: "text", headerText: "FP_PLANT_CD", visible: true, editable: false, width: 150, groupShowMode: "expand", autoFilter: true },
      { name: "plantNm", dataType: "text", headerText: "FP_PLANT_NM", visible: true, editable: false, width: 200, groupShowMode: "expand" }
    ]
  },
  { name: "toolGroup", dataType: "group", orientation: "horizontal", headerText: "FP_TOOL_SETTING", expandable: true, expanded: false,
    childs: [
      { name: "toolResourceYn", dataType: "boolean", headerText: "FP_TOOL_RESOURCE_YN", visible: true, editable: true, width: 95, groupShowMode: "always",
        defaultValue: false, autoFilter: true
      },
      { name: "toolCnt", dataType: "text", headerText: "FP_TOOL_CNT", visible: true, editable: false, width: 90, groupShowMode: "expand", defaultValue: 1,
        styleCallback: function (grid, dataCell) {
          let toolResourceYn = grid.getValue(dataCell.index.itemIndex, 'toolResourceYn');
          return { editable: toolResourceYn, styleName: (toolResourceYn) ? 'editable-number-column' : 'number-column' };
        }
      }
    ]
  },
  { name: "extraInfoGroup", dataType: "group", orientation: "horizontal", headerText: "FP_EXTRA_INFO", expandable: true, expanded: false,
    childs: [
      { name: "fifoTpCd", dataType: "text", headerText: "FP_FIFO", visible: true, editable: true, width: 130, groupShowMode: "always", textAlignment: "center",
        editor: { type: "list", textReadOnly: true, domainOnly: true },
        lookupDisplay: true,
        styleCallback: () => fifoTpCdEditor
      },
      { name: "loadYn", dataType: "boolean", headerText: "FP_LOAD_YN", visible: true, editable: true, width: 80, groupShowMode: "expand",
        defaultValue: true,
        renderer: {
          type: "check", editable: true,
          getCheckedCallback: (grid, itemIndex, column, value) => !value,
          setCheckedCallback: (grid, itemIndex, column, oldValue, checked) => !checked
        }
      },
      { name: "planLvlTpCd", dataType: "text", headerText: "FP_PLAN_LVL", visible: true, editable: true, width: 95, groupShowMode: "expand", textAlignment: "center",
        defaultValue: "A", useDropdown: true
      },
      { name: "virtualResourceCnt", dataType: "number", headerText: "FP_VIRTUAL_RES_CNT", visible: true, editable: true, width: 95, groupShowMode: "expand", defaultValue: 1,
        validRules: [{ criteria: "min", valid: 1 }],
        editor: { type: "number", maxIntegerLength: 20, positiveOnly: true, integerOnly: true },
        numberFormat: "#,##0.###"
      }
    ]
  },
  {
    name: "auditGroup", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", expandable: true, expanded: false,
    childs: [
      { name: "updatedBy", dataType: "text", headerText: "FP_UPDATED_BY", visible: true, editable: false, width: 80, groupShowMode: "expand", textAlignment: "center" },
      { name: "updatedAt", dataType: "datetime", headerText: "FP_UPDATED_AT", visible: true, editable: false, width: 125, groupShowMode: "always" },
      { name: "createdBy", dataType: "text", headerText: "FP_CREATED_BY", visible: true, editable: false, width: 80, groupShowMode: "expand", textAlignment: "center" },
      { name: "createdAt", dataType: "datetime", headerText: "FP_CREATED_AT", visible: true, editable: false, width: 125, groupShowMode: "expand" },
    ]
  }
];

function Resource() {
  const { control, getValues } = useForm({
    defaultValues: { resourceParam: '', }
  });
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [resourceGrid, setResourceGrid] = useState(null);
  const [gridStagePopup, setGridStagePopup] = useState(false);
  const globalButtons = [
    {
      name: "search",
      action: () => loadData(),
      visible: true,
      disable: false
    }
  ];

  useEffect(() => {
    setResourceGrid(getViewInfo(vom.active, 'resourceGrid'));
  }, [viewData])

  useEffect(() => {
    if (resourceGrid) {
      setViewInfo(vom.active, 'globalButtons', globalButtons);
      setEditableGrid(resourceGrid);
      setGridOptions(resourceGrid.gridView);

      loadData();
    }
  }, [resourceGrid]);

  function setGridOptions(gridView) {
    if (gridView.id === 'resourceGrid') {
      setGridComboList(gridView, 'planLvlTpCd', 'FP_PLAN_LEVEL_TP_CD');
      setColorPickerRenderer(gridView, 'displayColor');
      setCellButtonRenderer(gridView, 'stageCode');

      let resourceCd = gridView.columnByName('resourceCd');
      resourceCd.styleCallback = setCodeColumnStyle;

      gridView.onCellItemClicked = function (grid, index, clickData) {
        if (clickData.fieldName === 'stageCode') {
          setGridStagePopup(true);
        }
      };
    }
  }

  function loadData() {
    zAxios.get(baseURI() + 'factoryplan/master/resource/resources', {
      params: {
        'resource': getValues('resourceParam')
      }
    })
      .then(function (res) {
        resourceGrid.dataProvider.fillJsonData(res.data);
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
        resourceGrid.gridView.setAllCheck(false, false);
      });
  }

  function setStageValues(values) {
    const gridView = resourceGrid.gridView;
    const index = gridView.getCurrent().itemIndex;

    values["stageCode"] = values["stageCd"];
    values["stageName"] = values["stageNm"];
    values["plantCode"] = values["plantCd"];
    values["plantName"] = values["plantNm"];

    gridView.setValues(index, values);
    gridView.commit(true);
  }


  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      loadData();
    }
  }

  return (
    <ContentInner>
      <StagePopup open={gridStagePopup} onClose={() => setGridStagePopup(false)} confirm={setStageValues}/>
      <SearchArea>
        <SearchRow>
          <InputField control={control} label={transLangKey("FP_RESOURCE")} name="resourceParam" width="100%" onKeyPress={handleKeyPress} />
        </SearchRow>
      </SearchArea>
      <ButtonArea>
        <LeftButtonArea>
          <GridExcelExportButton grid="resourceGrid" options={exportOptions} />
          {/*<GridExcelImportButton grid="resourceGrid" />*/}
        </LeftButtonArea>
        <RightButtonArea>
          <GridAddRowButton grid="resourceGrid" />
          <GridDeleteRowButton grid="resourceGrid" url="factoryplan/master/resource/resources/delete" onAfterDelete={loadData} />
          <GridSaveButton grid="resourceGrid" url="factoryplan/master/resource/resources" onAfterSave={loadData} />
        </RightButtonArea>
      </ButtonArea>
      <ResultArea>
        <BaseGrid items={resourceGridItems} id="resourceGrid" className="white-skin"></BaseGrid>
      </ResultArea>
      <StatusArea show={false} message={''}>
        <GridCnt grid="resourceGrid" format={'{0} ' + transLangKey('CASES') + ' ' + transLangKey('MSG_0010')}></GridCnt>
      </StatusArea>
    </ContentInner>
  )
}

export default Resource;
