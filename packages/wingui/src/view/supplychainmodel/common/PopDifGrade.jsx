import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { BaseGrid, PopupDialog, useViewStore, useUserStore, zAxios } from "@zionex/wingui-core/src/common/imports";

let popupGrid1Items = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: "100" },
  { name: "VIEW_ID", dataType: "text", headerText: "VIEW_ID", visible: false, editable: false, width: "100" },
  { name: "CONF_CD", dataType: "text", headerText: "CONF_CD", visible: false, editable: false, width: "100" },
  { name: "CONF_NM", dataType: "text", headerText: "CONF_NM", visible: true, editable: false, width: "120" },
  { name: "PRIORT", dataType: "text", headerText: "PRIORITY", visible: true, editable: false, width: "80" },
  { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: false, editable: false, width: "100" }
];

function PopDifGrade(props) {
  const [grid, setGrid] = useState(null);
  const [username] = useUserStore(state => [state.username]);

  const [viewData, getViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo]);
  const { handleSubmit, clearErrors } = useForm({
    defaultValues: {},
  });

  useEffect(() => {
    const grdObjPopup = getViewInfo(vom.active, `${props.id}_DifGradeGrid`);
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
  };

  const onError = (errors, e) => {
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey("WARNING"), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  };

  const popupLoadData = () => {
    grid.gridView.showToast(progressSpinner + "Load Data...", true);

    zAxios({
      fromPopup: true,
      method: "post",
      header: { "content-type": "application/json" },
      url: "engine/dp/SRV_UI_CM_01_POP_01_Q",
      params: {
        CONF_KEY: "011",
        MODULE_CD: "",
        USER_ID: username,
        timeout: 0,
        PREV_OPERATION_CALL_ID: "OPC_SRH_CPT_T1_07_05_CLICK",
        CURRENT_OPERATION_CALL_ID: "OPC_SRH_CPT_T1_07_05_CLICK_01",
      },
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
  };

  const saveSubmit = () => {
    let focusCell = grid.gridView.getCurrent();
    let targetRow = focusCell.dataRow;
    props.confirm(grid.dataProvider.getJsonRow(targetRow));
    props.onClose(false);
  };

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="DIF_GRADE" resizeHeight={300} resizeWidth={400}>
      <BaseGrid id={`${props.id}_DifGradeGrid`} items={popupGrid1Items}></BaseGrid>
    </PopupDialog>
  );
}

export default PopDifGrade;
