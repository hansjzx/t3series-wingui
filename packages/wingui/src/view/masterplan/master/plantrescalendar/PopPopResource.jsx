import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { BaseGrid, PopupDialog, useViewStore, zAxios } from "@zionex/wingui-core/src/common/imports";

const popupGrid1Items = [
  { name: "RES_MGMT_MST_ID", dataType: "text", headerText: "RES_MGMT_MST_ID", visible: false, editable: false, width: "100" },
  { name: "RES_MGMT_DTL_ID", dataType: "text", headerText: "RES_MGMT_DTL_ID", visible: false, editable: false, width: "100" },
  { name: "RES_CD", dataType: "text", headerText: "RES_CD", visible: true, editable: false, width: "100" },
  { name: "RES_DESCRIP", dataType: "text", headerText: "RES_DESCRIP", visible: true, editable: false, width: "100" },
]

function PopPopResource(props) {
  const [grid, setGrid] = useState(null);
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo])
  const { handleSubmit, clearErrors } = useForm({ defaultValues: {} });

  useEffect(() => {
    const grdObjPopup = getViewInfo(vom.active, `${props.id}_PopResourceGrid`);
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

    grid.gridView.setDisplayOptions({ fitStyle: "fill" });

    grid.gridView.displayOptions.selectionStyle = "singleRow";

    grid.gridView.onCellDblClicked = function () {
      saveSubmit();
    };

    grid.gridView.setCheckBar({ exclusive: true });

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
    let formData = new FormData();

    formData.append('LOC_MGMT_ID', props.data);

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: 'engine/mp/SRV_UI_MP_11_Q2',
      data: formData
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
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="COMM_SRH_POP_RES" resizeHeight={560} resizeWidth={300}>
      <BaseGrid id={`${props.id}_PopResourceGrid`} items={popupGrid1Items}></BaseGrid>
    </PopupDialog>
  );
}

export default PopPopResource;
