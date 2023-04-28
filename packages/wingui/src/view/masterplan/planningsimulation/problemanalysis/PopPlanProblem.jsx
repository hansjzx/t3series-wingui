import React, { useEffect, useState } from 'react';
import { BaseGrid, ButtonArea, GridExcelExportButton, LeftButtonArea, PopupDialog, zAxios } from '@zionex/wingui-core/src/common/imports';
import { useContentStore } from '@zionex/wingui-core/src/store/contentStore'

let gridPlanProblemColumns = [
  {
    name: 'DMND_INFO', dataType: 'group', orientation: 'horizontal', headerText: 'DMND_INFO',
    childs: [
      { name: 'DMND_ID', dataType: 'text', headerText: 'DMND_ID', visible: true, editable: false, width: '120' },
      { name: 'PO_ID', dataType: 'text', headerText: 'PO_ID', visible: true, editable: false, width: '120' },
      { name: 'DUE_DATE', dataType: 'datetime', headerText: 'DUE_DATE', visible: true, editable: false, width: '80', format: 'yyyy-MM-dd' }
    ]
  },
  {
    name: 'SHORT_LATE_REASON', dataType: 'group', orientation: 'horizontal', headerText: 'SHORT_LATE_REASON',
    childs: [
      { name: 'PROBLEM_VAL', dataType: 'number', headerText: 'PROBLEM_VAL', visible: true, editable: false, width: '80',
        headerSummary: { expression: "sum", numberFormat: "#,##0" } },
      { name: 'PROBLEM_DATE', dataType: 'datetime', headerText: 'PROBLEM_DATE', visible: true, editable: false, width: '80', format: 'yyyy-MM-dd' },
      { name: 'PROBLEM_LOCAT_CD', dataType: 'text', headerText: 'LOCAT_CD', visible: true, editable: false, width: '80' },
      { name: 'PROBLEM_ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', visible: true, editable: false, width: '80' },
      { name: 'RES_CODE', dataType: 'text', headerText: 'RES_CD', visible: true, editable: false, width: '80' },
      { name: 'DESCRIP', dataType: 'text', headerText: 'DESCRIP', visible: true, editable: false, width: '300' }
    ]
  }
];

function PopPlanProblem(props) {
  const languageCode = useContentStore(state => state.languageCode);

  const [gridPlanProblem, setGridPlanProblem] = useState(null);

  const exportOptions = {
    headerDepth: 2,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  };

  useEffect(() => {
    async function initLoad() {
      if (gridPlanProblem) {
        setGridPlanProblemOptions();
        await loadPlanProblem();
      }
    }

    initLoad();
  }, [gridPlanProblem]);

  function afterGridPlanProblem(gridObj) {
    setGridPlanProblem(gridObj);
  }

  function setGridPlanProblemOptions() {
    gridPlanProblem.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(gridPlanProblem, true, false, false);

    gridPlanProblem.gridView.headerSummaries.visible = true;
  }

  function loadPlanProblem() {
    let param = new URLSearchParams();

    param.append('VERSION_ID', props.param.versionId);
    param.append('ACCOUNT_CD', props.param.accountCd);
    param.append('ITEM_CD', props.param.itemCd);
    param.append('PROBLEM_TYPE', props.param.problemTp);
    param.append('PROBLEM_NAME', props.param.problemNm);
    param.append('LANG_CD', languageCode);

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/GetPlanProblem',
      data: param,
      fromPopup: true
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          gridPlanProblem.dataProvider.clearRows();
          gridPlanProblem.setData(res.data.RESULT_DATA);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} title="PLAN_PROBLEM" resizeHeight={800} resizeWidth={1500} maxWidth={1500}>
      <ButtonArea>
        <LeftButtonArea>
          <GridExcelExportButton type='icon' grid='gridPopPlanProblem' options={exportOptions} />
        </LeftButtonArea>
      </ButtonArea>
      <BaseGrid id="gridPopPlanProblem" items={gridPlanProblemColumns} afterGridCreate={afterGridPlanProblem} />
    </PopupDialog>
  )
}

export default PopPlanProblem;
