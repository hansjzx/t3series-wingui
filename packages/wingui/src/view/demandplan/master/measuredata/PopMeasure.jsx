import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box, Button, ButtonGroup, Tooltip } from "@mui/material";
import PopupDialog from "@zionex/wingui-core/src/component/PopupDialog";
import { InputField, BaseGrid, useViewStore, useUserStore, zAxios, GridAddRowButton, GridDeleteRowButton, RightButtonArea, GridSaveButton } from "@zionex/wingui-core/src/common/imports";
import { transLangKey } from "@wingui";
import {isEmpty} from "@wingui/view/demandplan/DpUtil";

const measurePopItems = [
  {
    name: "COL_NM",
    dataType: "text",
    headerText: "Custom Measure Code",
    visible: true,
    editable: false,
    width: "200",
    textAlignment: "center",
    styleCallback: (grid, dataCell) => {
      let ret = { editable: false };
      const rowState = dataCell.item.rowState;
      if (rowState === "created" || rowState === "appending" || rowState === "inserting") {
        ret.editable = true;
        ret.styleName = "editable-text-column";
      }
      return ret;
    },
  },
  { name: "DESCRIP", dataType: "text", headerText: "DESCRIP", visible: false, editable: false, width: "90" },
  { name: "CAL_YN", dataType: "boolean", headerText: "CAL_YN", visible: false, editable: false, width: "50" },
  { name: "DEL_YN", dataType: "boolean", headerText: "DEL_YN", visible: false, editable: false, width: "50" },
  {
    name: "CAL_BASE_DATE",
    dataType: "datetime",
    headerText: "CAL_BASE_DATE",
    visible: false,
    editable: false,
    width: "50",
  },
];

function PopMeasure(props) {
  const [username, displayName] = useUserStore((state) => [state.username, state.displayName]);
  const [popMeasureGrid, setPopMeasureGrid] = useState(null);
  const [calc, setCalc] = useState(false);
  const [viewData, getViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo]);
  const { control, getValues, setValue, watch } = useForm({
    defaultValues: {
      // colName: "",
      baseDate: "",
    },
  });

  useEffect(() => {
    if (popMeasureGrid) {
      popupLoadData();
      setOptions();
    }
  }, [popMeasureGrid]);

  useEffect(() => {
    const popGrid1 = getViewInfo(vom.active, "popMeasureGrid");
    if (popGrid1 && popGrid1.dataProvider) {
      setPopMeasureGrid(popGrid1);
    }
  }, [viewData]);

  useEffect(()=>{
    if(!isEmpty(getValues("baseDate"))) {
      let date = new Date(getValues("baseDate"));
      // console.log("date", date, "date.getFullYear()", date.getFullYear());
      setValue("endDate", new Date(date.setFullYear(date.getFullYear()+1))-1)
    }
  }, [watch("baseDate")]);

  const isCalc = (value) => {
    setCalc(value);
  };

  const setOptions = () => {
    popMeasureGrid.dataProvider.setOptions({ restoreMode: "auto" });
    popMeasureGrid.gridView.setFooters({ visible: false });
    popMeasureGrid.gridView.setStateBar({ visible: false });
    popMeasureGrid.gridView.setRowIndicator({ visible: false });
    popMeasureGrid.gridView.setEditOptions({ insertable: true, appendable: true });
    popMeasureGrid.gridView.setDisplayOptions({ fitStyle: "evenFill" });
    popMeasureGrid.gridView.onCellClicked = (grid, clickData) => {
      if (clickData.cellType === "data") {
        isCalc(grid.getValue(clickData.dataRow, "CAL_YN"));
        const dataProvider = grid._dataProvider;
        setValue("baseDate", dataProvider._values[clickData.dataRow][dataProvider._fieldMap.CAL_BASE_DATE]);
      }
    };
  };

  const popupLoadData = () => {
    popMeasureGrid.gridView.showToast(progressSpinner + "Load Data...", true);
    let param = new URLSearchParams();
    zAxios({
      method: "post",
      header: { "content-type": "application/json" },
      url: "engine/dp/SRV_GET_SP_UI_DP_41_POP_Q1",
      data: param,
    })
      .then((res) => {
        popMeasureGrid.dataProvider.fillJsonData(res.data.RESULT_DATA);
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => {
        popMeasureGrid.gridView.hideToast();
      });
  };

  const onCustomMeausreDelete = (targetGrid, deleteRows) => {
    // Are you sure to remove all data? confirm message ,
    let formData = new FormData();
    formData.append("changes", JSON.stringify(deleteRows));
    formData.append("USER_ID", username);
    formData.append("timeout", 0);

    if (deleteRows.length > 0) {
      return zAxios({
        method: "post",
        url: "engine/dp/SRV_SET_SP_UI_DP_41_POP_D1",
        data: formData,
      })
        .then((response) => {
          if (response.status === gHttpStatus.SUCCESS) {
            const rsData = response.data;
            if (rsData.RESULT_SUCCESS) {
              const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_41_POP_D1_P_RT_MSG"];
              resultMSG === "MSG_0002" ? popupLoadData() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
            } else {
              showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
            }
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .then(() => {});
    }
  };

  const popupSaveData = (targetGrid) => {
    targetGrid.gridView.commit(true);

    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), (answer) => {
      if (answer) {
        let changes = [];
        changes = changes.concat(targetGrid.dataProvider.getAllStateRows().created, targetGrid.dataProvider.getAllStateRows().updated, targetGrid.dataProvider.getAllStateRows().deleted, targetGrid.dataProvider.getAllStateRows().createAndDeleted);
        let changeRowData = [];
        changes.forEach((row) => {
          changeRowData.push(targetGrid.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"));
        } else {
          targetGrid.gridView.showToast(progressSpinner + "Saving data...", true);
          let formData = new FormData();
          formData.append("changes", JSON.stringify(changeRowData));
          formData.append("timeout", 0);
          zAxios
            .post(baseURI() + "engine/dp/SRV_SET_SP_UI_DP_41_POP_S1", formData, {
              headers: { "content-type": "application/json" },
            })
            .then((response) => {
              if (response.status === gHttpStatus.SUCCESS) {
                const rsData = response.data;
                if (rsData.RESULT_SUCCESS) {
                  const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_41_POP_S1_P_RT_MSG"];
                  resultMSG === "MSG_0003" ? popupLoadData() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
                } else {
                  showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
                }
              }
            })
            .then(() => {
              targetGrid.gridView.hideToast();
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    });
  };
  const generateMeasureData = () => {
    zAxios({
      method: "post",
      header: { "content-type": "application/json" },
      url: "engine/dp/SRV_SET_SP_UI_DP_41_POP_S2",
      params: {
        COL_NM: popMeasureGrid.gridView.getSelectionData()[0]["COL_NM"],
        BASE_DATE: getValues("baseDate").format("yyyy-MM-dd"),
      },
    })
      .then((res) => {
        if (res.status === gHttpStatus.SUCCESS) {
          props.onClose();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <PopupDialog open={props.open} onClose={props.onClose} type={"NOBUTTONS"} title="CUSTOM_MEASURE_POP" checks={[popMeasureGrid]} resizeHeight={440} resizeWidth={300}>
      <Box>
        <RightButtonArea>
          <ButtonGroup>
            <GridAddRowButton grid="popMeasureGrid" />
            <GridDeleteRowButton grid="popMeasureGrid" onDelete={onCustomMeausreDelete} />
            <GridSaveButton
              grid="popMeasureGrid"
              type="icon"
              onClick={() => {
                popupSaveData(popMeasureGrid);
              }}
            />
          </ButtonGroup>
        </RightButtonArea>
      </Box>
      <Box style={{ height: "100%" }}>
        <BaseGrid id="popMeasureGrid" items={measurePopItems} />
      </Box>
      {calc ? (
        <Box>
          {/*<InputField type="dateRange" name="baseDate" control={control} readonly={false} disabled={false} dateformat="yyyy-MM-dd" />*/}
          <InputField type="datetime" name="baseDate" label={transLangKey("FROM_DATE")} control={control} readonly={false} disabled={false} dateformat="yyyy-MM-dd" />
          <InputField type="datetime" name="endDate" label={transLangKey("END_DATE")} control={control} readonly={true} disabled={false} dateformat="yyyy-MM-dd" />
          <Tooltip title={"The value is calculated based on the start date on the left."}>
            <Button onClick={() => generateMeasureData()}>
              <i className="fa fa-calculator" />
            </Button>
          </Tooltip>
        </Box>
      ) : (
        ""
      )}
    </PopupDialog>
  );
}

PopMeasure.displayName = "PopMeasure";

export default PopMeasure;
