import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box } from '@mui/material';
import { BaseGrid, PopupDialog, useViewStore, zAxios } from "@zionex/wingui-core/src/common/imports";

const popupGrid1Items = [
  { name: "LOC_MGMT_ID", dataType: "text", headerText: "LOC_MGMT_ID", visible: false, editable: false, width: "100" },
  { name: "LOC_DTL_ID", dataType: "text", headerText: "LOC_DTL_ID", visible: false, editable: false, width: "100" },
  { name: "LOCAT_TP", dataType: "text", headerText: "LOCAT_TP_NM", visible: true, editable: false, width: "100" },
  { name: "LOCAT_LV", dataType: "text", headerText: "LOCAT_LV", visible: true, editable: false, width: "100" },
  { name: "LOCAT_CD", dataType: "text", headerText: "LOCAT_CD", visible: true, editable: false, width: "100" },
  { name: "LOCAT_NM", dataType: "text", headerText: "LOCAT_NM", visible: true, editable: false, width: "100" }
]

function PopPopLocat(props) {
  const [grid, setGrid] = useState(null);
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo])
  const { handleSubmit, clearErrors } = useForm({ defaultValues: {} });

  useEffect(() => {
    const grdObjPopup = getViewInfo(vom.active, `${props.id}_PopLocatGrid`);
    if (grdObjPopup) {
      if (grdObjPopup.dataProvider) {
        if (grid != grdObjPopup) {
          setGrid(grdObjPopup);
        }
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

    grid.gridView.onCellDblClicked = function () {
      saveSubmit();
    };

    grid.gridView.setCheckBar({
      exclusive: true
    });

    grid.gridView.onDataLoadComplated = function () {
      grid.gridView.setFocus();
    }
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

  const popupLoadData = async () => {
    grid.gridView.showToast(progressSpinner + 'Load Data...', true);

    let param = new URLSearchParams();

    param.append("CONF_KEY", '002');

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: 'engine/mp/SRV_UI_CM_13_POP_01_Q',
      data: param,
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

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="COMM_SRH_POP_LOCAT" resizeHeight={600} resizeWidth={600}>
      <Box style={{ height: "100%" }}>
        <BaseGrid id={`${props.id}_PopLocatGrid`} items={popupGrid1Items}></BaseGrid>
      </Box>
    </PopupDialog>
  );
}

export default PopPopLocat;