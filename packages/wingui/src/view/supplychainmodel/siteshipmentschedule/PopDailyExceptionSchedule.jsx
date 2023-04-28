import React, { useState, useEffect } from 'react';
import { BaseGrid, ButtonArea, GridAddRowButton, GridDeleteRowButton, PopupDialog, RightButtonArea, useViewStore, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

let gridItems = [
  { name: 'ID', dataType: 'text', headerText: 'ID', visible: false, editable: false, width: '50' },
  { name: 'SHIP_LT_DTL_ID', dataType: 'text', headerText: 'SHIP_LT_DTL_ID', visible: false, editable: false, width: '50' },
  { name: 'STRT_DATE', dataType: 'datetime', headerText: 'STRT_DATE', visible: true, editable: true, width: '100', format: 'yyyy-MM-dd' },
  { name: 'END_DATE', dataType: 'datetime', headerText: 'END_DATE', visible: true, editable: true, width: '100', format: 'yyyy-MM-dd' },
  { name: 'MON_YN', dataType: 'boolean', headerText: 'MON', visible: true, editable: true, width: '50', defaultValue: false },
  { name: 'TUE_YN', dataType: 'boolean', headerText: 'TUE', visible: true, editable: true, width: '50', defaultValue: false },
  { name: 'WED_YN', dataType: 'boolean', headerText: 'WED', visible: true, editable: true, width: '50', defaultValue: false },
  { name: 'THU_YN', dataType: 'boolean', headerText: 'THUR', visible: true, editable: true, width: '50', defaultValue: false },
  { name: 'FRI_YN', dataType: 'boolean', headerText: 'FRI', visible: true, editable: true, width: '50', defaultValue: false },
  { name: 'SAT_YN', dataType: 'boolean', headerText: 'SAT', visible: true, editable: true, width: '50', defaultValue: false },
  { name: 'SUN_YN', dataType: 'boolean', headerText: 'SUN', visible: true, editable: true, width: '50', defaultValue: false },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: true, width: '80', defaultValue: false }
]

function PopDailyExceptionSchedule(props) {
  const [grid, setGrid] = useState(null);
  const [username] = useUserStore(state => [state.username]);
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo])

  useEffect(() => {
    const gridObj = getViewInfo(vom.active, 'SiteShipmentSchedule_PopDailyExceptionScheduleGrid');

    if (gridObj) {
      if (gridObj.dataProvider) {
        setGrid(gridObj)
      }
    }
  }, [viewData]);

  useEffect(() => {
    async function initLoad() {
      if (grid) {
        setOptions();
        await loadData();
      }
    }

    initLoad();
  }, [grid]);

  function setOptions() {
    setVisibleProps(grid, true, true, true);

    grid.gridView.displayOptions.selectionStyle = 'singleRow';
  }

  function loadData() {
    let params = new URLSearchParams();

    params.append('CONF_KEY', 'EXCEPT_DAILY');
    params.append('SHPP_LEADTIME_DTL_ID', props.data);

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: 'engine/mp/SRV_UI_CM_08_POP_01_Q',
      data: params,
      fromPopup: true
    })
    .then(function (res) {
      grid.dataProvider.fillJsonData(res.data.RESULT_DATA);
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
          let params = new URLSearchParams();
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
          params.append('SHPP_LEADTIME_DTL_ID', props.data);
          params.append('changes', JSON.stringify(changes));
          params.append('USER_ID', username);

          zAxios({
            method: 'post',
            header: { 'content-type': 'application/json' },
            url: 'engine/mp/SRV_UI_CM_08_POP_02_S',
            data: params
          })
          .then(function (res) {
            if (res.data.RESULT_SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_CM_08_POP_02_S_P_RT_MSG), { close: false });
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
      showMessage(transLangKey('DELETE'), transLangKey('MSG_DELETE'), function (answer) {
        if (answer) {
          let formData = new FormData();
          let checked = [];

          checkedRow.forEach(function (row) {
            checked.push(grid.dataProvider.getJsonRow(row));
          });

          formData.append('WRK_TYPE', 'DELETE');
          formData.append('SHPP_LEADTIME_DTL_ID', props.data);
          formData.append('checked', JSON.stringify(checked));
          formData.append('USER_ID', username);

          zAxios.post(baseURI() + 'engine/mp/SRV_UI_CM_08_POP_02_S', formData)
          .then(function (res) {
            if (res.status === gHttpStatus.SUCCESS) {
              const rsData = res.data;
              if (rsData.RESULT_SUCCESS) {
                const msg = rsData.RESULT_DATA.IM_DATA.SP_UI_CM_08_POP_02_S_P_RT_MSG;
                if (msg === "MSG_0002") {
                  props.confirm();
                  close();
                } else {
                  showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg));
                }
              } else {
                showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
              }
            }
          })
          .catch(function (e) {
            console.error(e);
          });
        }
      });
    }
  }

  function close() {
    grid.gridView.commit(true);
    props.onClose();
    grid.dataProvider.clearRows();
  }

  return (
    <PopupDialog open={props.open} onClose={close} onSubmit={saveData} title="POP_UI_CM_08_02" resizeHeight={600} resizeWidth={700}>
      <ButtonArea>
        <RightButtonArea>
          <GridAddRowButton type="icon" grid="SiteShipmentSchedule_PopDailyExceptionScheduleGrid" />
          <GridDeleteRowButton type="icon" grid="SiteShipmentSchedule_PopDailyExceptionScheduleGrid" onClick={deleteData} />
        </RightButtonArea>
      </ButtonArea>
      <BaseGrid id="SiteShipmentSchedule_PopDailyExceptionScheduleGrid" items={gridItems} />
    </PopupDialog>
  );
}

export default PopDailyExceptionSchedule;
