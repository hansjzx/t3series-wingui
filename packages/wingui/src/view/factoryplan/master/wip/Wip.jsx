import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  ButtonArea, ContentInner, GridAddRowButton, GridDeleteRowButton, GridExcelExportButton, GridExcelImportButton, GridSaveButton,
  LeftButtonArea, ResultArea, RightButtonArea, SearchArea, SearchRow, useViewStore, BaseGrid, InputField, zAxios, StatusArea, GridCnt
} from '@zionex/wingui-core/src/common/imports';
import {
  setCellButtonRenderer, setCodeColumnStyle, setEditableGrid
} from '../../common/common';
import WorkOrderPopup from '../../common/popup/WorkOrderPopup';
import WipLocationPopup from '../../common/popup/WipLocationPopup';
import '../../common/common.css';
import {transLangKey} from "@wingui";

const exportOptions = {
  lookupDisplay: false,
  importExceptFields: { 0: 'id', 1: 'wipId' },
  headerDepth: 2
};
const wipGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false },
  { name: "wipId", dataType: "text", headerText: "WIP_ID", visible: false, editable: false },
  { name: "routeCode", dataType: "text", headerText: "FP_ROUTE_CD", visible: true, editable: true, width: 150, autoFilter: true,
    validRules: [{ criteria: "required"}]
  },
  { name: "routeName", dataType: "text", headerText: "FP_ROUTE_NM", visible: true, editable: false, width: 200, autoFilter: true },
  { name: "resourceCd", dataType: "text", headerText: "FP_RESOURCE", visible: true, editable: false, width: 150 },
  { name: "woCd", dataType: "text", headerText: "FP_WORK_ORDER_CODE", visible: true, editable: false, width: 150, autoFilter: true },
  { name: "wipQty", dataType: "number", headerText: "QTY", visible: true, editable: true, width: 80, defaultValue: "0",
    styleCallback: function (grid, dataCell) {
      if (dataCell.value === 0) {
        return { styleName: 'editable-number-column text-color-black' }
      }
    },
    editor: { type: "number",editFormat: "#,##0.0####", maxLength: 20, maxLengthExceptComma: true },
    numberFormat: "#,##0.0####"
  },
  { name: "actualQty", dataType: "number", headerText: "QTY_COUNT", visible: true, editable: false, width: 80, numberFormat: "#,##0.0####" },
  { name: "startTs", dataType: "datetime", headerText: "STRT_DTTM", visible: true, editable: true, width: 125,
    validRules: [{ criteria: "required"}]
  },
  { name: "endTs", dataType: "datetime", headerText: "END_DTTM", visible: true, editable: true, width: 125,
    validRules: [{ criteria: "required"}]
  },
  {
    name: "extraGroup", dataType: "group", orientation: "horizontal", headerText: "FP_EXTRA_INFO", expandable: true, expanded: false,
    childs: [
      { name: "releaseTs", dataType: "datetime", headerText: "FP_NEXT_ROUTE_INPUT_DT", visible: true, editable: true, width: 125, groupShowMode: "always" },
      { name: "toStockYn", dataType: "boolean", headerText: "FP_TO_STOCK_YN", visible: true, editable: true, width: 80, defaultValue: false, groupShowMode: "expand" },
      { name: "batchGrpCd", dataType: "text", headerText: "FP_BATCH_GRP_CD", visible: true, editable: true, width: 150, groupShowMode: "expand" },
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

function Wip() {
  const { control, getValues } = useForm({
    defaultValues: { wipParam: '', }
  });
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [wipGrid, setWipGrid] = useState(null);
  const [wipLocationParams, setWipLocationParams] = useState('');
  const [workOrderParams, setWorkOrderParams] = useState('');
  const [workOrderPopupVisible, setWorkOrderPopupVisible] = useState(false);
  const [wipLocationPopupVisible, setWipLocationPopupVisible] = useState(false);
  const globalButtons = [
    {
      name: "search",
      action: () => loadData(),
      visible: true,
      disable: false
    }
  ];

  useEffect(() => {
    setWipGrid(getViewInfo(vom.active, 'wipGrid'));
  }, [viewData]);

  useEffect(() => {
    if (wipGrid) {
      setViewInfo(vom.active, 'globalButtons', globalButtons);
      setEditableGrid(wipGrid);
      setGridOptions(wipGrid.gridView);

      loadData();
    }
  }, [wipGrid]);

  function setGridOptions(gridView) {
    if (gridView.id === 'wipGrid') {
      setCellButtonRenderer(gridView, 'routeCode', true);
      setCellButtonRenderer(gridView, 'woCd', true);

      let routeCode = gridView.columnByName('routeCode');
      let woCd = gridView.columnByName('woCd');
      routeCode.styleCallback = setCodeColumnStyle;
      woCd.styleCallback = setCodeColumnStyle;

      gridView.onCellItemClicked = function (grid, index, clickData) {
        const values = grid.getValues(index.itemIndex);
        if (clickData.column === 'routeCode') {
          setWipLocationParams(values.woCd ? values.woCd : '');
          setWipLocationPopupVisible(true);
        } else if (clickData.column === 'woCd') {
          setWorkOrderParams(values.routeCode ? values.routeCode : '');
          setWorkOrderPopupVisible(true);
        }
      };

      gridView.onEditCommit = function (grid, index, oldValue, newValue) {
        if (index.column === 'startTs') {
          const endTs = grid.getValue(index.itemIndex, 'endTs');
          if (newValue > endTs) {
            showMessage(transLangKey('MSG_CONFIRM'), transLangKey('FP_MSG_VALID_START_END_TS'), { close: false });
            return false;
          }
        } else if (index.column === 'endTs') {
          const startTs = grid.getValue(index.itemIndex, 'startTs');
          if (startTs > newValue) {
            showMessage(transLangKey('MSG_CONFIRM'), transLangKey('FP_MSG_VALID_START_END_TS'), { close: false });
            return false;
          }
        }
      }
    }
  }

  function loadData() {
    zAxios.get(baseURI() + 'factoryplan/master/wip/wips', {
      params: {
        'wip': getValues('wipParam')
      }
    })
      .then(function (res) {
        wipGrid.dataProvider.fillJsonData(res.data);
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
        wipGrid.gridView.setAllCheck(false, false);
      });
  }

  function handleKeyPress(e) {
    if (e.key === 'Enter') {
      loadData();
    }
  }

  function setWoValues(values) {
    const gridView = wipGrid.gridView;
    const index = gridView.getCurrent().itemIndex;
    gridView.setValue(index, 'woCd', values.woCd);
    gridView.commit(true);
  }

  function setWipLocationValues(values) {
    const gridView = wipGrid.gridView;
    const index = gridView.getCurrent().itemIndex;
    gridView.setValues(index, values);
    gridView.commit(true);
  }

  return (
    <>
      <ContentInner>
        <WorkOrderPopup open={workOrderPopupVisible} params={workOrderParams} onClose={() => setWorkOrderPopupVisible(false)} confirm={setWoValues} />
        <WipLocationPopup open={wipLocationPopupVisible} params={wipLocationParams} onClose={() => setWipLocationPopupVisible(false)} confirm={setWipLocationValues} />
        <SearchArea>
          <SearchRow>
            <InputField control={control} label={transLangKey('WIP')} name="wipParam" width="100%" onKeyPress={handleKeyPress} />
          </SearchRow>
        </SearchArea>
        <ButtonArea>
          <LeftButtonArea>
            <GridExcelExportButton grid="wipGrid" options={exportOptions} />
            {/*<GridExcelImportButton grid="wipGrid" />*/}
          </LeftButtonArea>
          <RightButtonArea>
            <GridAddRowButton grid="wipGrid"/>
            <GridDeleteRowButton grid="wipGrid" url="factoryplan/master/wip/wips/delete" onAfterDelete={loadData} />
            <GridSaveButton grid="wipGrid" url="factoryplan/master/wip/wips" onAfterSave={loadData} />
          </RightButtonArea>
        </ButtonArea>
        <ResultArea>
          <BaseGrid items={wipGridItems} id="wipGrid" className="white-skin" />
        </ResultArea>
        <StatusArea show={false} message={''}>
          <GridCnt grid="wipGrid" format={'{0} ' + transLangKey('CASES') + ' ' + transLangKey('MSG_0010')}></GridCnt>
        </StatusArea>
      </ContentInner>
    </>
  )
}

export default Wip;
