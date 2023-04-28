import React, { useState, useEffect } from 'react';
import { BaseGrid, ButtonArea, GridAddRowButton, GridDeleteRowButton, PopupDialog, RightButtonArea, useViewStore, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

let gridItems = [
  { name: 'ID', dataType: 'text', headerText: 'ID', visible: false, editable: false, width: '50' },
  { name: 'SHIP_LT_DTL_ID', dataType: 'text', headerText: 'SHIP_LT_DTL_ID', visible: false, editable: false, width: '50' },
  { name: 'STRT_DATE', dataType: 'datetime', headerText: 'STRT_DATE', visible: true, editable: true, width: '100', format: 'yyyy-MM-dd' },
  { name: 'END_DATE', dataType: 'datetime', headerText: 'END_DATE', visible: true, editable: true, width: '100', format: 'yyyy-MM-dd' },
  { name: 'TRANSFER_DD', dataType: 'number', headerText: 'DIST_DAY', visible: true, editable: true, width: '80', defaultValue: false },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: true, width: '80', defaultValue: false }
]

function PopMonthlyExceptionSchedule(props) {
  const [grid, setGrid] = useState(null);
  const [username] = useUserStore(state => [state.username]);
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo])

  useEffect(() => {
    if (grid) {
      loadData();
    }
  }, [grid]);

  function afterGridPopMonthlyExceptionSchedule(gridObj) {
    setGrid(gridObj);
    setGridOptions(gridObj);
  }

  function setGridOptions(gridObj) {
    setVisibleProps(gridObj, true, true, true);

    gridObj.gridView.displayOptions.selectionStyle = 'singleRow';
  }

  function loadData() {
    let param = new FormData();

    param.append("PO_CYCL_CALENDAR_ID", props.param);

    zAxios({
      method: "post",
      url: "engine/mp/SRV_UI_IM_06_Q4",
      data: param,
      fromPopup: true
    })
    .then(function (res) {
      grid.setData(res.data.RESULT_DATA);
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function saveData() {
    grid.gridView.commit(true);

    let changedRow = [];

    changedRow = changedRow.concat(
      grid.dataProvider.getAllStateRows().created,
      grid.dataProvider.getAllStateRows().updated,
      grid.dataProvider.getAllStateRows().deleted,
      grid.dataProvider.getAllStateRows().createAndDeleted
    );

    if (changedRow.length === 0) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
    } else {
      showMessage(transLangKey('SAVE'), transLangKey('MSG_SAVE'), function (answer) {
        if (answer) {
          let params = new FormData();
          let changes = [];

          changedRow.forEach(function (row) {
            let data = grid.dataProvider.getJsonRow(row);

            if (data.STRT_DATE instanceof Date) {
              data.STRT_DATE = new Date(data.STRT_DATE).format('yyyy-MM-ddT00:00:00');
            }
            if (data.END_DATE instanceof Date) {
              data.END_DATE = new Date(data.END_DATE).format('yyyy-MM-ddT00:00:00');
            }

            changes.push(data);
          });

          params.append('WRK_TYPE', 'SAVE');
          params.append('PO_CYCL_CALENDAR_ID', props.param);
          params.append('changes', JSON.stringify(changes));
          params.append('USER_ID', username);

          zAxios({
            method: 'post',
            url: 'engine/mp/SRV_UI_IM_06_S2',
            data: params,
            fromPopup: true
          })
          .then(function (res) {
            if (res.data.RESULT_SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_IM_06_S2_P_RT_MSG), { close: false });
            } else {
              showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
            }

            props.confirm();
            close();
          })
          .catch(function (err) {
            console.log(err);
          });
        }
      });
    }
  }

  function deleteData() {
    let checkedRow = grid.gridView.getCheckedRows();

    if (checkedRow.length === 0) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SELECT_DELETE'));
    } else {
      showMessage(transLangKey('SAVE'), transLangKey('MSG_DELETE'), function (answer) {
        if (answer) {
          let params = new FormData();
          let checked = [];

          checkedRow.forEach(function (row) {
            let data = grid.dataProvider.getJsonRow(row);

            if (data.STRT_DATE instanceof Date) {
              data.STRT_DATE = new Date(data.STRT_DATE).format('yyyy-MM-ddT00:00:00');
            }

            if (data.END_DATE instanceof Date) {
              data.END_DATE = new Date(data.END_DATE).format('yyyy-MM-ddT00:00:00');
            }

            checked.push(data);
          });

          params.append('WRK_TYPE', 'DELETE');
          params.append('PO_CYCL_CALENDAR_ID', props.param);
          params.append('checked', JSON.stringify(checked));
          params.append('USER_ID', username);

          zAxios({
            method: 'post',
            url: 'engine/mp/SRV_UI_IM_06_S2',
            data: params,
            fromPopup: true
          })
          .then(function (res) {
            if (res.data.RESULT_SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_IM_06_S2_P_RT_MSG), { close: false });
            } else {
              showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
            }

            props.confirm();
            close();
          })
          .catch(function (err) {
            console.log(err);
          });
        }
      });
    }
  }

  function close() {
    props.onClose();
    grid.dataProvider.clearRows();
  }

  return (
    <PopupDialog open={props.open} onClose={close} onSubmit={saveData} title="POP_UI_IM_06_03" resizeHeight={600} resizeWidth={500}>
      <ButtonArea>
        <RightButtonArea>
          <GridAddRowButton type="icon" grid="PopMonthlyExceptionScheduleGrid" />
          <GridDeleteRowButton type="icon" grid="PopMonthlyExceptionScheduleGrid" onClick={deleteData} />
        </RightButtonArea>
      </ButtonArea>
      <BaseGrid id="PopMonthlyExceptionScheduleGrid" items={gridItems} afterGridCreate={afterGridPopMonthlyExceptionSchedule} />
    </PopupDialog>
  );
}

export default PopMonthlyExceptionSchedule;
