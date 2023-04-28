import React, { useState, useEffect } from 'react';
import { useContentStore } from '@zionex/wingui-core/src/store/contentStore';
import { useHistory } from "react-router-dom";
import { BaseGrid, PopupDialog, zAxios } from '@zionex/wingui-core/src/common/imports';

let gridItems = [
  { name: 'PARENT_MENU_NM', headerText: 'MENU_ID', dataType: 'string', width: '80', visible: true, editable: false, initGroupOrder: '1' },
  { name: 'MENU_ID', headerText: 'UI_ID', dataType: 'string', width: '200', visible: false, editable: false },
  { name: 'MENU_NM', headerText: 'UI_NM', dataType: 'string', width: '200', visible: true, editable: false, textAlignment: 'left', button: 'action' },
  { name: 'MENU_PATH', headerText: 'MENU_PATH', dataType: 'string', width: '200', visible: false, editable: false }
];

function PopUILink(props) {
  const [grid, setGrid] = useState(null);

  const history = useHistory();
  const languageCode = useContentStore(state => state.languageCode);

  useEffect(() => {
    if (grid) {
      setGridOptions();
      loadData();
    }
  }, [grid]);

  function afterGridCreate(gridObject) {
    setGrid(gridObject);
  }

  function setGridOptions() {
    grid.gridView.setEditOptions({
      insertable: true,
      appendable: true
    });

    grid.gridView.displayOptions.fitStyle = 'fill';
    setVisibleProps(grid, true, false, false);

    grid.gridView.setColumnProperty("PARENT_MENU_NM", "mergeRule", { criteria: "value" });

    grid.gridView.onCellButtonClicked = function (currentGrid, clickData, column) {
      history.push({ pathname: grid.dataProvider.getValue(clickData.itemIndex, 'MENU_PATH'), state: { }, type: null });
    };

    grid.gridView.onCellDblClicked = function (currentGrid, clickData) {
      if (clickData.cellType === 'data') {
        saveSubmit();
      }
    }
  }

  function loadData() {
    let params = new URLSearchParams();

    params.append('Q_TYPE', 'UI_ID');
    params.append('VAL_01', '');
    params.append('VAL_02', '');
    params.append('LANG_CD', languageCode);

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_CM_16_Q2',
      data: params,
      fromPopup: true
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        res.data.RESULT_DATA.sort(function (a, b) {
          if (a.PARENT_MENU_NM > b.PARENT_MENU_NM) {
            return 1;
          } else if (a.PARENT_MENU_NM < b.PARENT_MENU_NM) {
            return -1;
          } else {
            return 0;
          }
        });

        grid.dataProvider.clearRows();
        grid.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
  }

  function saveSubmit() {
    let focusCell = grid.gridView.getCurrent();
    let targetRow = focusCell.dataRow;
    if (targetRow >= 0) {
      props.confirm(grid.dataProvider.getJsonRow(targetRow));
      props.onClose(false);
    }
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={saveSubmit} title="UI_LINK" resizeHeight={460} resizeWidth={500}>
      <BaseGrid id="PlanScenario_PopNewPlanScenario_PopUILinkGrid" items={gridItems} afterGridCreate={afterGridCreate} />
    </PopupDialog>
  );
}

export default PopUILink;
