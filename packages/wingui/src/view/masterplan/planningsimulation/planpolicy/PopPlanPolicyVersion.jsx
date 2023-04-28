import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { BaseGrid, PopupDialog, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';

let popupGridPlanPolicyColumns= [
  { name: 'ID', dataType: 'text', headerText: 'ID', visible: false, editable: false, width: '100' },
  { name: 'MODULE_CD', dataType: 'text', headerText: 'MODULE_CD', visible: false, editable: false, width: '150' },
  { name: 'MODULE_NM', dataType: 'text', headerText: 'MODULE_VAL', visible: true, editable: false, width: '150' },
  { name: 'PLAN_POLICY_VER_ID', dataType: 'text', headerText: 'PLAN_POLICY_VERSION', visible: true, editable: false, width: '120' },
  { name: 'DESCP', dataType: 'text', headerText: 'DESCRIP', visible: true, editable: false, width: '180' },
  { name: 'PLAN_TYPE', dataType: 'text', headerText: 'PLAN_TP', visible: true, editable: false, width: '120', lang: true }
] 


function PopPlanPolicyVersion(props) {
  const [grid, setGrid] = useState(null);
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo]);
  const moduleId = props.module ? props.module : '';

  const { handleSubmit, clearErrors } = useForm({
    defaultValues: {}
  });

  useEffect(() => {
    const grdObjPopup = getViewInfo(vom.active, `${props.id}_PopPlanPolicyGrid`);
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

  function setOptions() {
    setVisibleProps(grid, true, false, false);

    grid.gridView.setDisplayOptions({ fitStyle: 'fill' });

    grid.gridView.displayOptions.selectionStyle = 'singleRow';

    grid.gridView.setColumnProperty("MODULE_NM", "mergeRule", { criteria: "value" });

    grid.gridView.onCellDblClicked = function () {
      saveSubmit();
    };
  }

  const onError = (errors, e) => {
    if (typeof errors !== 'undefined' && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  function popupLoadData() {
    zAxios({
      fromPopup: true,
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: 'engine/mp/SRV_UI_CM_15_Q2',
      params: {
        'MODULE_ID' : moduleId
      }
    })
      .then(function (res) {
        grid.setData(res.data.RESULT_DATA);
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function saveSubmit() {
    let focusCell = grid.gridView.getCurrent();
    let targetRow = focusCell.dataRow;
    props.confirm(grid.dataProvider.getJsonRow(targetRow));
    props.onClose(false);
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="VERSION" resizeHeight={340} resizeWidth={900}>
      <Box style={{ height: "100%" }}>
        <BaseGrid id={`${props.id}_PopPlanPolicyGrid`} items={popupGridPlanPolicyColumns} />
      </Box>
    </PopupDialog>
  );
}

export default PopPlanPolicyVersion;
