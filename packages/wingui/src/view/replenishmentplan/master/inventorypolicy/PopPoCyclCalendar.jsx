import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { PopupDialog, BaseGrid, useViewStore, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

let gridItems = [
  { name: 'ID', dataType: 'text', headerText: 'ID', visible: false, editable: false, width: '100' },
  { name: 'CALENDAR_ID', dataType: 'text', headerText: 'CALENDAR_ID', visible: true, editable: false, width: '120' },
  { name: 'DESCRIP', dataType: 'text', headerText: 'DESCRIP', visible: true, editable: false, width: '200' },
  {
    name: "STOCK_MGMT_SYSTEM", dataType: "group", orientation: "horizontal", headerText: "STOCK_MGMT_SYSTEM", headerVisible: true, hideChildHeaders: false,
    childs: [
      { name: 'INV_MGMT_SYSTEM_TP', dataType: 'text', headerText: 'STOCK_MGMT_SYSTEM_TP', visible: true, editable: false, width: '150', useDropdown: true, lookupDisplay: true },
      { name: 'OPERT_BASE_TP', dataType: 'text', headerText: 'OPERT_BASE_TP', visible: true, editable: false, width: '100', useDropdown: true, lookupDisplay: true }
    ]
  },
  { name: 'PO_CYCL_TP_CD', dataType: 'text', headerText: 'PO_CYCL_TP', visible: true, editable: false, width: '100' }
];

function PopPoCyclCalendar(props) {
  const { handleSubmit, clearErrors } = useForm({ });

  const [grid, setGrid] = useState(null);
  const [username] = useUserStore(state => [state.username]);

  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);

  useEffect(() => {
    const grdObjPopup = getViewInfo(vom.active, `${props.id}_PopPoCyclCalendarGrid`);

    if (grdObjPopup) {
      if (grdObjPopup.dataProvider) {
        if (grid != grdObjPopup) {
          setGrid(grdObjPopup);
        }
      }
    }
  }, [viewData]);

  useEffect(() => {
    if (grid) {
      setOptionsGrid();
    }
  }, [grid]);

  const setOptionsGrid = () => {
    setVisibleProps(grid, true, false, false);

    grid.gridView.setDisplayOptions({
      fitStyle: "fill"
    });

    grid.gridView.onCellDblClicked = function (grid, clickData) {
      if (clickData.cellType === "data") {
        saveSubmit();
      }
    };

    grid.gridView.setColumnProperty(
      "INV_MGMT_SYSTEM_TP",
      "lookupData",
      {
        value: "ID",
        label: "CD_NM",
        list: props.data.filter(code => code.GROUP == "INVENTORY_MGMT_SYSTEM_TYPE")
      }
    );

    grid.gridView.setColumnProperty(
      "OPERT_BASE_TP",
      "lookupData",
      {
        value: "ID",
        label: "CD_NM",
        list: props.data.filter(code => code.GROUP == "INVENTORY_SUPPLY_DATE_TYPE")
      }
    );

    loadData();
  }

  function loadData() {
    grid.gridView.showToast(progressSpinner + 'Load Data...', true);

    let param = new URLSearchParams();

    // 공통 작업 props.data.LOCAT_CD
    param.append('LOCAT_CD', '');
    param.append('USER_ID', username);

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: 'engine/mp/SRV_SP_UI_IM_26_Q4',
      params: param,
      fromPopup: true
    })
    .then(function (res) {
      grid.dataProvider.fillJsonData(res.data.RESULT_DATA);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      grid.gridView.hideToast();
    });
  }

  const saveSubmit = () => {
    let focusCell = grid.gridView.getCurrent();
    let targetRow = focusCell.dataRow;

    props.confirm(grid.dataProvider.getJsonRow(targetRow));
    props.onClose(false);
  }

  const onError = (errors, e) => {
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="PO_CYCL_CALENDAR" resizeHeight={450} resizeWidth={750}>
      <BaseGrid id={`${props.id}_PopPoCyclCalendarGrid`} items={gridItems} ></BaseGrid>
    </PopupDialog>
  );
}

export default PopPoCyclCalendar;
