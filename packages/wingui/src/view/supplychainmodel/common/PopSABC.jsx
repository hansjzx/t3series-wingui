import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box } from "@mui/material";
import { BaseGrid, PopupDialog, zAxios } from "@zionex/wingui-core/src/common/imports";

let gridPopSABCColumns = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: "100" },
  { name: "SABC_VAL", dataType: "text", headerText: "SABC_VAL", visible: true, editable: false, width: "100" },
  { name: "PRPSAL_SVC_LV", dataType: "text", headerText: "PRPSAL_SVC_LV", visible: true, editable: false, width: "100" }
];

function PopSABC(props) {
  const [gridPopSABC, setGridPopSABC]  = useState(null);

  const { handleSubmit, clearErrors } = useForm({
    defaultValues: { }
  });

  useEffect(() => {
    async function initLoad() {
      if (gridPopSABC) {
        setOptions();
        await popupLoadData();
      }
    }
    initLoad();
  }, [gridPopSABC]);

  function afterGridPopSABC(gridObj) {
    setGridPopSABC(gridObj);
  }

  function setOptions() {
    setVisibleProps(gridPopSABC, true, false, false);
    gridPopSABC.gridView.setDisplayOptions({
      fitStyle: "evenFill",
    });

    gridPopSABC.gridView.displayOptions.selectionStyle = "singleRow";

    gridPopSABC.gridView.onCellDblClicked = function (grid, clickData) {
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
    let param = new URLSearchParams();

    param.append('LOCAT_CD', props.data.LOCAT_CD)

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_IM_08_Q3',
      params: param,
      fromPopup: true
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        gridPopSABC.setData(res.data.RESULT_DATA);
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  const saveSubmit = () => {
    let focusCell = gridPopSABC.gridView.getCurrent();
    let targetRow = focusCell.dataRow;
    props.confirm(gridPopSABC.dataProvider.getJsonRow(targetRow));
    props.onClose(false);
  }

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit,onError)} title="POP_UI_IM_08_02" resizeHeight={300} resizeWidth={300}>
      <Box style={{height:"100%"}}>
        <BaseGrid id="gridPopSABC" items={gridPopSABCColumns} afterGridCreate={afterGridPopSABC} />
      </Box>
    </PopupDialog>
  );
}

export default PopSABC;
