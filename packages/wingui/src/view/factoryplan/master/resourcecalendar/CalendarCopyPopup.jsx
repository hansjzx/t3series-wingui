import React, { useEffect, useState } from 'react';
import { BaseGrid, PopupDialog, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';
import { Box, Button, DialogActions } from '@mui/material';
import { setNoneEditableGrid } from "../../common/common";

const calendarCopyPopupGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 0 },
  { name: "resourceCd", dataType: "text", headerText: "FP_RESOURCE_CD", visible: true, editable: false, width: 150, autoFilter: true },
  { name: "resourceNm", dataType: "text", headerText: "FP_RESOURCE_NM", visible: true, editable: false, width: 150, autoFilter: true },
  { name: "descTxt", dataType: "text", headerText: "FP_DESC_TXT", visible: true, editable: false, width: 80 }
];

function CalendarCopyPopup(props) {
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const [calendarCopyPopupGrid, setCalendarCopyPopupGrid] = useState(null);

  useEffect(() => {
    setCalendarCopyPopupGrid(getViewInfo(vom.active, 'calendarCopyPopupGrid'));
  }, [viewData]);

  useEffect(() => {
    if (calendarCopyPopupGrid) {
      setNoneEditableGrid(calendarCopyPopupGrid);
      setGridOptions(calendarCopyPopupGrid.gridView);

      loadData();
    }
  }, [calendarCopyPopupGrid]);

  function setGridOptions(gridView) {
    if (gridView.id === 'calendarCopyPopupGrid') {
      const checkableCallback = (dataSource, item) => {
        const resourceCd = dataSource.getValue(item.dataRow, 'resourceCd');
        return resourceCd !== props.selectedResource;
      }
      gridView.setCheckBar({ visible: true, syncHeadCheck: true, checkableCallback });
    }
  }

  function loadData() {
    zAxios.get(baseURI() + 'factoryplan/master/resource/resources', {
      params: {
        'resource': ''
      },
      fromPopup: true
    })
      .then(function (res) {
        calendarCopyPopupGrid.dataProvider.fillJsonData(res.data);
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
      });
  }
  
  function copyCalendar() {
    const gridView = calendarCopyPopupGrid.gridView;
    const checkedItems = gridView.getCheckedItems();
    if (checkedItems.length === 0) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('FP_MSG_NO_ROW_CHECKED'), { close: false });
    } else {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('FP_MSG_COPY'), function (answer) {
        if (answer) {
          const targetResources = checkedItems.map(item => gridView.getValue(item, 'resourceCd'));
          const copyData = {
            "resource": props.selectedResource,
            "target-resources": JSON.stringify(targetResources)
          };
          let formData = new FormData();
          formData.append('changes', JSON.stringify(copyData));
          let responseData = null;
          zAxios({
            method: 'post',
            url: baseURI() + 'factoryplan/master/resource-calendar/copy',
            headers: { 'content-type': 'application/json' },
            data: formData,
            fromPopup: true
          }).then(function (response) {
            responseData = response.data;
          }).catch(function (err) {
            console.log(err);
          }).then(function () {
            showMessage(transLangKey('MSG_CONFIRM'), responseData.message, { close: false });
            gridView.checkAll(false);
            gridView.setAllCheck(false, false);
          });
        }
      });      
    }    
  }

  return (
    <>
      <PopupDialog type="NOBUTTONS" open={props.open} onClose={props.onClose} title={transLangKey("FP_COPY_CALENDAR")} resizeHeight={560} resizeWidth={830}>
        <Box style={{ height: "100%" }}>
          <BaseGrid id="calendarCopyPopupGrid" items={calendarCopyPopupGridItems} className="white-skin" />
        </Box>
        <Box sx={{ justifySelf: 'flex-end', height: '50px' }}>
          <DialogActions style={{ height: '50px', display: "flex", justifyContent: "center" }}>
            <Button onClick={copyCalendar} autoFocus variant={'contained'} >{transLangKey("COPY")}</Button>
          </DialogActions>
        </Box>
      </PopupDialog>
    </>
  )  
}

export default CalendarCopyPopup;
