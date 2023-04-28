import React, { useState, useEffect } from "react";
import { useForm } from 'react-hook-form';
import {IconButton } from '@mui/material';
import { BaseGrid, ButtonArea, PopupDialog, RightButtonArea, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';

let popPlanScenarioGridItems = [
  { name: "MST_ID", dataType: "text", headerText: "MST_ID", visible: false, width: "100" },
  { name: "MODULE_NM", dataType: "text", headerText: "MODULE_VAL", visible: true, editable: false, width: "120" },
  { name: "SNRIO_VER_ID", dataType: "text", headerText: "SCENARIO_VER", visible: true, editable: false, width: "80" },
  { name: "DESCRIP", dataType: "text", headerText: "SCENARIO_DESCRIP", visible: true, editable: false, width: "200" }
]

function PopPlanScenario(props) {
  const [grid, setGrid] = useState(null);
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo])
  const { handleSubmit, clearErrors } = useForm({
    defaultValues: { }
  });

  useEffect(() => {
    const gridObjPopup = getViewInfo(vom.active, 'popPlanScenarioGrid');
    if (gridObjPopup) {
      if (gridObjPopup.dataProvider) {
        if (grid != gridObjPopup) {
          setGrid(gridObjPopup);
        }
      }
    }
  }, [viewData]);

  useEffect(() => {
    if (grid) {
      setOptions();
      popupLoadData();
    }
  }, [grid]);

  const setOptions = () => {
    setVisibleProps(grid, true, false, false);
    grid.gridView.displayOptions.fitStyle = "fill";

    grid.gridView.onCellDblClicked = function () {
      saveSubmit();
    };
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

  function popupLoadData() {
    const moduleCd = props.moduleId === 'CM' ? '' : props.moduleId;

    zAxios({
      fromPopup: true,
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: 'engine/mp/SRV_UI_CM_16_Q1',
      params: {
        'MODULE_CD': moduleCd,
        'DESCRIP': ''
      }
    })
    .then(function (res) {
      grid.setData(res.data.RESULT_DATA);
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  const saveSubmit = () => {
    let focusCell = grid.gridView.getCurrent();
    let targetRow = focusCell.dataRow;
    props.confirm(grid.dataProvider.getJsonRow(targetRow));
    props.onClose(false);
  }

  return (
    <PopupDialog type="NOBUTTONS" open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="POP_UI_IM_01_01" resizeHeight={300} resizeWidth={1000}>
      <ButtonArea>
        <RightButtonArea>
          <IconButton onClick={() => { popupLoadData() }} title={transLangKey("SEARCH")}><Icon.Search /></IconButton>
        </RightButtonArea>
      </ButtonArea>
      <BaseGrid id="popPlanScenarioGrid" items={popPlanScenarioGridItems} />
    </PopupDialog>
  );
}

export default PopPlanScenario;
