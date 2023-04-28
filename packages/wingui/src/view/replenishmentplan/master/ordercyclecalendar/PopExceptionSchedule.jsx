import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  ButtonArea, RightButtonArea, GridAddRowButton, GridDeleteRowButton, PopupDialog, BaseGrid, useUserStore, useViewStore, zAxios
} from '@zionex/wingui-core/src/common/imports';

let gridItems = [
  { name: 'ID', dataType: 'text', headerText: 'ID', visible: false, width: '100' },
  { name: 'PO_CYCL_CALENDAR_ID', dataType: 'text', headerText: 'PO_CYCL_CALENDAR_ID', visible: false, width: '100' },
  { name: 'STRT_DATE', dataType: 'datetime', headerText: 'STRT_DATE', visible: true, editable: true, width: '100', format: "yyyy-MM-dd" },
  { name: 'END_DATE', dataType: 'datetime', headerText: 'END_DATE', visible: true, editable: true, width: '100', format: "yyyy-MM-dd" },
  { name: 'MON_YN', dataType: 'boolean', headerText: 'MON', visible: true, editable: true, width: '70' },
  { name: 'TUE_YN', dataType: 'boolean', headerText: 'TUE', visible: true, editable: true, width: '70' },
  { name: 'WED_YN', dataType: 'boolean', headerText: 'WED', visible: true, editable: true, width: '70' },
  { name: 'THU_YN', dataType: 'boolean', headerText: 'THUR', visible: true, editable: true, width: '70' },
  { name: 'FRI_YN', dataType: 'boolean', headerText: 'FRI', visible: true, editable: true, width: '70' },
  { name: 'SAT_YN', dataType: 'boolean', headerText: 'SAT', visible: true, editable: true, width: '70' },
  { name: 'SUN_YN', dataType: 'boolean', headerText: 'SUN', visible: true, editable: true, width: '70' },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: true, width: '80' }
];

function PopExceptionSchedule(props) {
  const [username] = useUserStore(state => [state.username]);
  const [gridPopExceptionSchedule, setGridPopExceptionSchedule] = useState(null);

  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo])
  const { handleSubmit } = useForm({
    defaultValues: { }
  });

  useEffect(() => {
    if (gridPopExceptionSchedule) {
      loadDataGrid();
    }
  }, [gridPopExceptionSchedule]);

  function afterGridPopExceptionSchedule(gridObj) {
    setGridPopExceptionSchedule(gridObj);
    setGridPopExceptionScheduleOptions(gridObj);
  }

  function setGridPopExceptionScheduleOptions(gridObj) {
    setVisibleProps(gridObj, true, true, true);

    gridObj.gridView.setDisplayOptions({
      fitStyle: "fill"
    });
  }

  function loadDataGrid() {
    let param = new FormData();

    param.append("PO_CYCL_CALENDAR_ID", props.param);

    zAxios({
      method: "post",
      url: "engine/mp/SRV_UI_IM_06_Q4",
      data: param,
      fromPopup: true
    })
    .then(function (res) {
      gridPopExceptionSchedule.setData(res.data.RESULT_DATA);
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function onDelete(targetGrid, deleteRows) {
    let param = new FormData();

    deleteRows.forEach(function (row) {
      if (row.STRT_DATE instanceof Date) {
        row.STRT_DATE = row.STRT_DATE.format("yyyy-MM-ddTHH:mm:ss");
      }
      if (row.END_DATE instanceof Date) {
        row.END_DATE = row.END_DATE.format("yyyy-MM-ddTHH:mm:ss");
      }
    });

    param.append("WRK_TYPE", "DELETE");
    param.append("PO_CYCL_CALENDAR_ID", props.param);
    param.append("checked", JSON.stringify(deleteRows));
    param.append("USER_ID", username);

    if (deleteRows.length > 0) {
      zAxios({
        method: "post",
        url: baseURI() + "engine/mp/SRV_UI_IM_06_S2",
        data: param,
        fromPopup: true
      })
      .then(function (res) {
        if (res.data.RESULT_SUCCESS) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_IM_06_S2_P_RT_MSG), { close: false });
        } else {
          showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
        }

        props.confirm();
        props.onClose(false);
      })
    }
  }

  const saveSubmit = () => {
    gridPopExceptionSchedule.gridView.commit(true);

    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridPopExceptionSchedule.dataProvider.getAllStateRows().created,
          gridPopExceptionSchedule.dataProvider.getAllStateRows().updated,
          gridPopExceptionSchedule.dataProvider.getAllStateRows().deleted,
          gridPopExceptionSchedule.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          let rowData = gridPopExceptionSchedule.dataProvider.getJsonRow(row);

          if (rowData.STRT_DATE instanceof Date) {
            rowData.STRT_DATE = rowData.STRT_DATE.format("yyyy-MM-ddT00:00:00");
          }
          if (rowData.END_DATE instanceof Date) {
            rowData.END_DATE = rowData.END_DATE.format("yyyy-MM-ddT00:00:00");
          }

          changeRowData.push(rowData);
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"), { close: false });
        } else {
          let param = new FormData();

          param.append("WRK_TYPE", "SAVE");
          param.append("PO_CYCL_CALENDAR_ID", props.param);
          param.append("changes", JSON.stringify(changeRowData));
          param.append("USER_ID", username);

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_UI_IM_06_S2',
            data: param,
            fromPopup: true
          })
          .then(function (res) {
            if (res.status === gHttpStatus.SUCCESS) {
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(res.data.RESULT_DATA.IM_DATA.SP_UI_IM_06_S2_P_RT_MSG), { close: false });
            } else {
              showMessage(transLangKey('WARNING'), transLangKey(res.data.RESULT_MESSAGE), { close: false });
            }

            props.confirm();
            props.onClose(false);
          })
          .catch(function (err) {
            console.log(err);
          });
        }
      }
    });
  }

  const onError = (errors, e) => {
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey("WARNING"), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  function close() {
    gridPopExceptionSchedule.gridView.commit(true);
    props.onClose();
    gridPopExceptionSchedule.dataProvider.clearRows();
  }

  return (
    <PopupDialog open={props.open} onClose={close} onSubmit={handleSubmit(saveSubmit, onError)} title="POP_UI_IM_06_02" resizeHeight={500} resizeWidth={1000}>
      <ButtonArea>
        <RightButtonArea>
          <GridAddRowButton type="icon" grid="gridPopExceptionSchedule" />
          <GridDeleteRowButton type="icon" grid="gridPopExceptionSchedule" onDelete={onDelete} />
        </RightButtonArea>
      </ButtonArea>
      <BaseGrid id="gridPopExceptionSchedule" items={gridItems} afterGridCreate={afterGridPopExceptionSchedule} />
    </PopupDialog>
  );
}

export default PopExceptionSchedule;
