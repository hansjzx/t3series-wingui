import React, { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import { Box } from "@mui/material";
import { BaseGrid, PopupDialog, useViewStore, zAxios } from "@zionex/wingui-core/src/common/imports";

let popupGrid1Items = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: "100" },
  { name: "VIEW_ID", dataType: "text", headerText: "VIEW_ID", visible: false, editable: false, width: "100" },
  { name: "LOCAT_TP", dataType: "text", headerText: "LOCAT_TP", visible: false, editable: false, width: "100" },
  { name: "CORP_ID", dataType: "text", headerText: "CORP_ID", visible: false, editable: false, width: "100" },
  { name: "CORPOR_ID", dataType: "text", headerText: "CORPOR_ID", visible: false, editable: false, width: "100" },
  { name: "CORPOR_NM", dataType: "text", headerText: "CORPOR_NM", visible: false, editable: false, width: "100" },

  { name: "LOCAT_TP_ID", dataType: "text", headerText: "LOCAT_TP_ID", visible: false, editable: false, width: "100" },
  { name: "LOCAT_TP_NM", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "80" },
  { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "50" },
  { name: "LOCAT_LV_DESCRIP", dataType: "text", headerText: "LOCAT_LV_DESCRIP", visible: true, editable: false, width: "100" },
  { name: "INV_POLICY_TARGET_YN", dataType: "boolean", headerText: "INV_POLICY_TARGET_YN", visible: false, editable: false, width: "100" },
  { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: false, editable: false, width: "100" }
]

function PopLocat(props) {
  const [grid, setGrid] = useState(null);

  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo])
  const { handleSubmit, clearErrors } = useForm({
    defaultValues: {
    }
  });

  useEffect(() => {
    const grdObjPopup = getViewInfo(vom.active, 'grid');
    if (grdObjPopup) {
      if (grdObjPopup.dataProvider) {
        if (grid != grdObjPopup)
          setGrid(grdObjPopup);
      }
    }
  }, [viewData]);

  useEffect(() => {
    async function initLoad() {
      if (grid) {
        setOptions();
        await popupLoadData();
      }
    }

    initLoad();
  }, [grid]);

  const setOptions = () => {
    setVisibleProps(grid, true, false, false);
    grid.gridView.setDisplayOptions({
      fitStyle: "evenFill",
    });

    grid.gridView.displayOptions.selectionStyle = "singleRow";

    //dobule click 시 선택
    grid.gridView.onCellDblClicked = function (grid, clickData) {
      saveSubmit();
    };

    grid.gridView.setCheckBar({
      exclusive: true
    })
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

  const popupLoadData = () => {
    grid.gridView.showToast(progressSpinner + 'Load Data...', true);

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: 'engine/mp/SRV_UI_CM_01_POP_01_Q',
      params: {
        CONF_KEY: '002',
        MODULE_CD: '',
        VIEW_ID: 'UI_CM_02_01'
      },
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

  // popup 확인
  const saveSubmit = () => {

    let focusCell = grid.gridView.getCurrent();
    let targetRow = focusCell.dataRow;
    props.confirm(grid.dataProvider.getJsonRow(targetRow));
    props.onClose(false);
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="COMM_SRH_POP_LOCAT" resizeHeight={500} resizeWidth={450}>
      <Box style={{ height: "100%" }}>
        <BaseGrid id="grid" items={popupGrid1Items}></BaseGrid>
      </Box>
    </PopupDialog>
  );
}

export default PopLocat;
