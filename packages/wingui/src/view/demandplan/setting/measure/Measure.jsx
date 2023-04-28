import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ContentInner, ResultArea, SearchArea, StatusArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow, InputField, GridAddRowButton, GridDeleteRowButton, GridSaveButton, BaseGrid, GridCnt, useViewStore, useUserStore, zAxios } from "@zionex/wingui-core/src/common/imports";
import { baseURI, showMessage, transLangKey, vom } from "@wingui";
import { ButtonGroup } from "@mui/material";
import { newRowEditCellStyle } from "@wingui/view/demandplan/DpUtil";

const grid1Items = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: 100, textAlignment: "center" },
  { name: "MEASURE_CD", dataType: "text", headerText: "MEASURE_CD", visible: true, editable: false, width: 100, textAlignment: "center", styleCallback: newRowEditCellStyle },
  { name: "MEASURE_NM", dataType: "text", headerText: "MEASURE_NM", visible: false, editable: true, width: 100, textAlignment: "center" },
  { name: "DESCRIP", dataType: "text", headerText: "DESCRIP", visible: true, editable: true, width: 100, textAlignment: "center" },
  { name: "TBL_NM", dataType: "text", headerText: "TBL_NM", visible: false, editable: false, width: 100, textAlignment: "center" },
  { name: "COL_NM", dataType: "text", headerText: "COL_NM", visible: false, editable: false, width: 100, textAlignment: "center" },
  { name: "MEASURE_VAL_TP_ID", dataType: "dropdown", headerText: "MEASURE_VAL_TP_ID", visible: true, editable: true, width: 110, textAlignment: "center", useDropdown: true, lookupDisplay: true },
  { name: "DP_YN", dataType: "boolean", headerText: "DP_YN", visible: false, editable: true, width: 80, textAlignment: "center" },
  { name: "SYSTEM_YN", dataType: "boolean", headerText: "ENTRY_YN", visible: true, editable: true, width: 80, textAlignment: "center" },
  { name: "BF_YN", dataType: "boolean", headerText: "BF_YN", visible: false, editable: true, width: 80, textAlignment: "center" },
  { name: "SRP_YN", dataType: "boolean", headerText: "SRP_YN", visible: false, editable: true, width: 80, textAlignment: "center" },
  { name: "CAL_YN", dataType: "boolean", headerText: "CAL_YN", visible: false, editable: true, width: 80, textAlignment: "center" },
  { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: 80, textAlignment: "center" },
  { name: "CREATE_DTTM", dataType: "datetime", format: "yyyy-MM-dd", headerText: "CREATE_DTTM", visible: true, editable: false, width: 80, textAlignment: "center" },
  { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 80, textAlignment: "center" },
  { name: "MODIFY_DTTM", dataType: "datetime", format: "yyyy-MM-dd", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 80, textAlignment: "center" },
];

function Measure() {
  const [grid1, setGrid1] = useState(null);
  const [username, displayName, systemAdmin] = useUserStore((state) => [state.username, state.displayName, state.systemAdmin]);
  const [message, setMessage] = useState();
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [measureValueTypes, setMeasureValueTypes] = useState([]);
  const globalButtons = [
    {
      name: "search",
      action: () => {
        loadGrid1Data();
      },
      visible: true,
      disable: false,
    },
    {
      name: "save",
      action: () => {
        saveData(grid1);
      },
      visible: false,
      disable: false,
    },
    {
      name: "refresh",
      action: () => {
        reset();
      },
      visible: true,
      disable: false,
    },
  ];

  const { reset, control, getValues } = useForm({
    defaultValues: {
      isSystem: "ALL",
      measureValueType: "ALL",
      measureCd: "",
    },
  });

  const onDelete = (targetGrid, deleteRows) => {
    let formData = new FormData();
    formData.append("changes", JSON.stringify(deleteRows));

    if (deleteRows.length > 0) {
      return zAxios({
        method: "post",
        url: baseURI() + "engine/dp/SRV_SET_SP_UI_DP_17_D1",
        headers: { "content-type": "application/json" },
        data: formData,
      })
        .then(function (response) {
          if (response.status === gHttpStatus.SUCCESS) {
            const rsData = response.data;
            if (rsData.RESULT_SUCCESS) {
              const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_17_D1_P_RT_MSG"];
              resultMSG === "MSG_0002" ? loadGrid1Data() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
            } else {
              showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
            }
          }
        })
        .catch(function (err) {
          console.log(err);
        })
        .then(function () {});
    }
  };

  const saveData = (targetGrid) => {
    targetGrid.gridView.commit(true);

    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), function (answer) {
      if (answer) {
        let changes = [];
        changes = changes.concat(targetGrid.dataProvider.getAllStateRows().created, targetGrid.dataProvider.getAllStateRows().updated, targetGrid.dataProvider.getAllStateRows().deleted, targetGrid.dataProvider.getAllStateRows().createAndDeleted);

        let changeRowData = [];
        changes.forEach(function (row) {
          let data = targetGrid.dataProvider.getJsonRow(row);
          if (data.BF_YN === undefined) {
            data.BF_YN = false;
          }
          if (data.DP_YN === undefined) {
            data.DP_YN = false;
          }
          if (data.SRP_YN === undefined) {
            data.SRP_YN = false;
          }
          if (data.SYSTEM_YN === undefined) {
            data.SYSTEM_YN = false;
          }
          if (data.CAL_YN === undefined) {
            data.CAL_YN = false;
          }
          changeRowData.push(data);
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"));
        } else {
          targetGrid.gridView.showToast(progressSpinner + "Saving data...", true);
          // console.log("changeRowData", changeRowData);
          let formData = new FormData();
          formData.append("changes", JSON.stringify(changeRowData));
          formData.append("USER_ID", username);
          zAxios
            .post(baseURI() + "engine/dp/SRV_SET_SP_UI_DP_17_S1", formData, {
              headers: { "content-type": "application/json" },
            })
            .then(function (response) {
              if (response.status === gHttpStatus.SUCCESS) {
                const rsData = response.data;
                if (rsData.RESULT_SUCCESS) {
                  const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_17_S1_P_RT_MSG"];
                  resultMSG === "MSG_0001" ? loadGrid1Data() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
                } else {
                  showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
                }
              }
            })
            .catch(function (err) {
              console.log(err);
            })
            .then(function () {
              targetGrid.gridView.hideToast();
              loadGrid1Data();
            });
        }
      }
    });
  };

  function loadGrid1Data() {
    let param = new URLSearchParams();
    param.append("SP_UI_DP_17_Q1_01", getValues("isSystem") === "ALL" ? "" : getValues("isSystem"));
    param.append("SP_UI_DP_17_Q1_02", getValues("measureValueType") === "ALL" ? "" : getValues("measureValueType"));
    param.append("SP_UI_DP_17_Q1_03", getValues("measureCd"));
    param.append("SP_UI_DP_17_Q1_04", "DP");
    param.append("timeout", 0);
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_17_Q1",
      data: param,
    })
      .then(function (res) {
        let dataArr = [];
        if (res.status === gHttpStatus.SUCCESS) {
          dataArr = res.data.RESULT_DATA;
          grid1.dataProvider.fillJsonData(dataArr);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, "grid1");
    if (grdObj1 && grdObj1.dataProvider) {
      grid1 !== grdObj1 && setGrid1(grdObj1);
    }
  }, [viewData]);

  useEffect(() => {
    if (grid1) {
      setViewInfo(vom.active, "globalButtons", globalButtons);
      setGridOption();
      loadMeasureType();
    }
  }, [grid1]);

  useEffect(() => {
    if (grid1 && measureValueTypes) {
      loadGrid1Data();
    }
  }, [grid1, measureValueTypes]);

  function loadMeasureType() {
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_17_MEASURE_TP_COMBO",
    })
      .then(function (res) {
        let data = res.data.RESULT_DATA;
        setMeasureValueTypes(data.map((rw) => ({ label: transLangKey(rw.CD_NM), value: rw.ID === "" ? "ALL" : rw.ID })));

        grid1.gridView.setColumnProperty("MEASURE_VAL_TP_ID", "lookupData", {
          value: "ID",
          label: "CD_NM",
          list: data
            .filter((rw) => rw.ALL_YN === "NOT_ALL")
            .map((rw) => {
              rw.CD_NM = transLangKey(rw.CD_NM);
              return rw;
            }),
        });
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  const setGridOption = () => {
    grid1.gridView.setEditOptions({
      insertable: true,
      appendable: true,
    });
    grid1.gridView.displayOptions.fitStyle = "fill";
    setVisibleProps(grid1, true, true, true);
  };

  const getNewGridData = () => {
    return { DP_YN: true };
  };

  return (
    <ContentInner>
      <SearchArea>
        <SearchRow>
          <InputField
            name="isSystem"
            label={transLangKey("ENTRY_YN")}
            type="select"
            control={control}
            options={[
              { label: "All", value: "ALL" },
              { label: "Y", value: "Y" },
              { label: "N", value: "N" },
            ]}
          />
          <InputField name="measureValueType" label={transLangKey("MEASURE_VAL_TP")} type="select" control={control} options={measureValueTypes} />
          <InputField name="measureCd" label={transLangKey("MEASURE_CD")} readonly={false} disabled={false} control={control} />
        </SearchRow>
      </SearchArea>
      <ButtonArea>
        <LeftButtonArea></LeftButtonArea>
        <RightButtonArea>
          <ButtonGroup>
            <GridAddRowButton grid="grid1" type="icon" onGetData={getNewGridData} />
            <GridDeleteRowButton grid="grid1" type="icon" onDelete={onDelete} onAfterDelete={(targetGrid) => targetGrid.gridId === "grid1" && loadGrid1Data()} />
            <GridSaveButton
              grid="grid1"
              type="icon"
              onClick={() => {
                saveData(grid1);
              }}
            />
          </ButtonGroup>
        </RightButtonArea>
      </ButtonArea>
      <ResultArea>
        <BaseGrid id="grid1" items={grid1Items} />
      </ResultArea>
      <StatusArea show={false} message={message}>
        <GridCnt grid="grid1" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")} />
      </StatusArea>
    </ContentInner>
  );
}

export default Measure;
