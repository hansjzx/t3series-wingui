import React, { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { Box, ButtonGroup } from "@mui/material";
import { ContentInner, ResultArea, SearchArea, StatusArea, ButtonArea, LeftButtonArea, RightButtonArea, InputField, GridAddRowButton, GridDeleteRowButton, GridSaveButton, CommonButton, BaseGrid, GridCnt, useViewStore, useUserStore, zAxios } from "@zionex/wingui-core/src/common/imports";
import { transLangKey } from "@wingui";
import PopSelectUser from "@wingui/view/demandplan/common/PopSelectUser";
import { loadOption, isEmptyArray } from "@wingui/view/demandplan/DpUtil";

let grid1Items = [
  { name: "SALES_LV_CD", dataType: "text", headerText: "SALES_LV_CD", visible: true, editable: false, width: 100, textAlignment: "center" },
  { name: "SALES_LV_NM", dataType: "text", headerText: "SALES_LV_NM", visible: true, editable: false, width: 100, textAlignment: "center" },
  { name: "PARENT_SALES_LV_NM", dataType: "text", headerText: "PARENT_SALES_LV_CD", visible: true, editable: false, width: 110, textAlignment: "center" },
  { name: "LV_MGMT_ID", dataType: "text", headerText: "LV_MGMT_ID", visible: true, editable: false, width: 80, textAlignment: "center", lookupDisplay: true },
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: 80, textAlignment: "center" },
  { name: "CURCY_CD_ID", dataType: "text", headerText: "CURCY_CD_ID", visible: false, editable: false, width: 80, textAlignment: "center", lookupDisplay: true },
  { name: "SEQ", dataType: "text", headerText: "SEQ", visible: true, editable: false, width: 80, textAlignment: "center" },
  { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: 80, textAlignment: "center" },
  { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: 80, textAlignment: "center" },
  { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 80, textAlignment: "center" },
  { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 80, textAlignment: "center" },
];
let grid2Items = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: 80, textAlignment: "center" },
  { name: "SALES_LV_ID", dataType: "text", headerText: "SALES_LV_CD", visible: false, editable: false, width: 100, textAlignment: "center" },
  { name: "SALES_LV_CD", dataType: "text", headerText: "SALES_LV_CD", visible: true, editable: false, width: 100, textAlignment: "center" },
  { name: "SALES_LV_NM", dataType: "text", headerText: "SALES_LV_NM", visible: true, editable: false, width: 100, textAlignment: "center" },
  { name: "USER_ID", dataType: "text", headerText: "USER_ID", visible: true, editable: true, width: 110, textAlignment: "center", button: "action" },
  { name: "EMP_ID", dataType: "text", headerText: "EMP_NM", visible: false, editable: false, width: 80, textAlignment: "center" },
  { name: "EMP_NM", dataType: "text", headerText: "EMP_NM", visible: true, editable: false, width: 80, textAlignment: "center" },
  { name: "EMP_NO", dataType: "text", headerText: "EMP_NM", visible: false, editable: false, width: 80, textAlignment: "center" },
  { name: "STRT_DATE_AUTH", dataType: "datetime", headerText: "Start Date of Auth", visible: true, editable: true, width: 80, textAlignment: "center", format: "yyyy-MM-dd" },
  { name: "END_DATE_AUTH", dataType: "datetime", headerText: "End Date of Auth", visible: true, editable: true, width: 80, textAlignment: "center", format: "yyyy-MM-dd" },
  { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: 80, textAlignment: "center" },
  { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: 80, textAlignment: "center" },
  { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 80, textAlignment: "center" },
  { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 80, textAlignment: "center" },
];

function SalesAuthMap() {
  const [username, displayName, systemAdmin] = useUserStore((state) => [state.username, state.displayName, state.systemAdmin]);
  const [message, setMessage] = useState();
  const [grid1, setGrid1] = useState(null);
  const [grid2, setGrid2] = useState(null);

  //  const [dialogOpen1, setDialogOpen1] = useState(false);
  const [userPopupOpen, setUserPopupOpen] = useState(false);

  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [salesLevelOption, setSalesLevelOption] = useState([]);

  const {
    reset,
    control,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  //조회조건 로드
  const setSalesHierLv = async () => {
    const options = await loadOption(true, "SRV_GET_SP_UI_DP_00_LV_CD_Q1", { LV_TP: "S", ACCOUNT_TP: "SALES", TYPE: "ALL" }, "ID", "CD_NM", false, true);
    if (!isEmptyArray(options)) {
      setSalesLevelOption(options);
      setValue("salesHierLv", options[0].value);
    }

    /*
    let param = new URLSearchParams();
    param.append("SP_UI_DP_00_LV_CD_Q1_01", "S");
    param.append("SP_UI_DP_00_LV_CD_Q1_02", "SALES");
    param.append("SP_UI_DP_00_LV_CD_Q1_03", "");
    param.append("SP_UI_DP_00_LV_CD_Q1_04", "");
    param.append("SP_UI_DP_00_LV_CD_Q1_05", "ALL");
    param.append("SP_UI_DP_00_LV_CD_Q1_06", "");
    param.append("SP_UI_DP_00_LV_CD_Q1_07", "");
    param.append("SP_UI_DP_00_LV_CD_Q1_08", "");
    zAxios({
      method: "post",
      header: { "content-type": "application/json" },
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_00_LV_CD_Q1",
      data: param,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          let dataArr = [];
          let rstArr = [];
          dataArr = res.data.RESULT_DATA;
          let listItemObj;

          for (let i = 0, len = dataArr.length; i < len; i++) {
            let row = dataArr[i];
            if (row !== null) {
              listItemObj = { value: row.ID, label: transLangKey(row.CD_NM) };
              rstArr.push(listItemObj);
            }
          }

          setSalesLevelOption(rstArr);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
      */
  };

  const globalButtons = [
    {
      name: "search",
      action: (e) => {
        loadGrid1Data();
      },
      visible: true,
      disable: false,
    },
    {
      name: "save",
      action: (e) => {
        saveData(grid1);
      },
      visible: false,
      disable: false,
    },
    {
      name: "refresh",
      action: (e) => {
        reset();
      },
      visible: false,
      disable: false,
    },
  ];

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, "grid1");
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        if (grid1 != grdObj1) setGrid1(grdObj1);
      }
    }
    const grdObj2 = getViewInfo(vom.active, "grid2");
    if (grdObj2) {
      if (grdObj2.dataProvider) {
        if (grid2 != grdObj2) setGrid2(grdObj2);
      }
    }
  }, [viewData]);

  useEffect(() => {
    if (grid1) {
      setViewInfo(vom.active, "globalButtons", globalButtons);
      setGrid1Option();
      gridComboLoad(grid1, {
        URL: "engine/dp/SRV_GET_SP_UI_DP_00_LV_CD_Q1",
        CODE_VALUE: "ID",
        CODE_LABEL: "CD_NM",
        COLUMN: "LV_MGMT_ID",
        PROP: "lookupData",
        PARAM_KEY: ["LV_TP", "ACCOUNT_TP", "TYPE"],
        PARAM_VALUE: ["S", "SALES", "All"],
        TRANSLANG_LABEL: true,
      });
      gridComboLoad(grid1, {
        URL: "engine/dp/SRV_GET_SP_UI_DP_00_CM_CD_Q1",
        CODE_VALUE: "ID",
        CODE_LABEL: "CD_NM",
        COLUMN: "CURCY_CD_ID",
        PROP: "lookupData",
        PARAM_KEY: ["SP_UI_DP_00_CM_CD_Q1_01", "SP_UI_DP_00_CM_CD_Q1_02"],
        PARAM_VALUE: ["CURRENCY", ""],
        TRANSLANG_LABEL: true,
      });

      loadGrid1Data();
    }

    if (grid2) setGrid2Option();
  }, [grid1, grid2]);

  useEffect(() => {
    setSalesHierLv();
  }, []);

  const setGrid1Option = () => {
    grid1.gridView.setEditOptions({
      insertable: true,
      appendable: true,
    });
    grid1.gridView.displayOptions.fitStyle = "fill";

    //events
    grid1.gridView.onCellClicked = function (grid, clickData) {
      //console.log("cell Click", clickData);
      if (clickData.cellType === "gridEmpty") {
        return;
      }
      let id = grid.getValue(clickData.itemIndex, "ID");
      grid2LoadData(id);
      grid2.gridView.setDisplayOptions({ showEmptyMessage: true });
    };
    setVisibleProps(grid1, false, false, false);
  };

  const setGrid2Option = () => {
    grid2.gridView.setColumnProperty("USER_ID", "buttonVisibility", "always");

    grid2.gridView.setEditOptions({
      insertable: true,
      appendable: true,
    });
    grid2.gridView.displayOptions.fitStyle = "fill";
    setVisibleProps(grid2, true, true, true);
    grid2.gridView.setCheckBar({ visible: true });
    grid2.gridView.setStateBar({ visible: true });

    grid2.gridView.onCellButtonClicked = function (grid, itemIndex, column) {
      if (column.fieldName === "USER_ID") {
        setUserPopupOpen(true);
      }
    };
  };

  const getNewGridData2 = (gridObj) => {
    let current = grid1.gridView.getSelectedRows();
    const lvCd = grid1.dataProvider.getValues(current)[0];
    const lvNm = grid1.dataProvider.getValues(current)[1];
    return { SALES_LV_CD: lvCd, SALES_LV_NM: lvNm };
  };

  function loadGrid1Data() {
    let param = new URLSearchParams();
    param.append("SP_UI_DP_12_Q1_01", getValues("salesHierLv") === undefined || getValues("salesHierLv") === "ALL" ? "" : getValues("salesHierLv"));
    param.append("SP_UI_DP_12_Q1_02", "");
    param.append("timeout", 0);
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_12_Q1",
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

  function grid2LoadData(id) {
    let param = new URLSearchParams();
    param.append("SP_UI_DP_12_Q2_P01", id);
    param.append("timeout", 0);
    zAxios({
      method: "post",
      header: { "content-type": "application/json" },
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_12_Q2",
      data: param,
    })
      .then(function (res) {
        let dataArr = [];
        if (res.status === gHttpStatus.SUCCESS) {
          dataArr = res.data.RESULT_DATA;
          grid2.dataProvider.fillJsonData(dataArr);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  const onDelete = (targetGrid, deleteRows) => {
    let formData = new FormData();
    formData.append("changes", JSON.stringify(deleteRows));
    formData.append("P_USER_ID", username);
    formData.append("timeout", 0);

    if (deleteRows.length > 0) {
      return zAxios({
        method: "post",
        url: baseURI() + "engine/dp/SRV_SET_SP_UI_DP_12_D2",
        headers: { "content-type": "application/json" },
        data: formData,
      })
        .then((response) => {
          if (response.status === gHttpStatus.SUCCESS) {
            const rsData = response.data;
            if (rsData.RESULT_SUCCESS) {
              const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_12_D2_P_RT_MSG"];
              resultMSG === "MSG_0002" ? grid2LoadData() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
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

  const onAfterDelete = (targetGrid) => {
    if (targetGrid.gridId === "grid2") {
      //loadGrid1Data();
    }
  };

  // popup close - emp
  function onSetEmp(gridRows) {
    let itemIndex = grid2.gridView.getCurrent().dataRow;
    grid2.dataProvider.setValue(itemIndex, "USER_ID", gridRows[0].USER_ID);
    grid2.dataProvider.setValue(itemIndex, "EMP_NM", gridRows[0].USER_NM);
    grid2.dataProvider.setValue(itemIndex, "EMP_ID", gridRows[0].ID);
    grid2.gridView.commit(true);
  }

  const saveData = (targetGrid) => {
    targetGrid.gridView.commit(true);

    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), function (answer) {
      if (answer) {
        let changes = [];
        changes = changes.concat(targetGrid.dataProvider.getAllStateRows().created, targetGrid.dataProvider.getAllStateRows().updated, targetGrid.dataProvider.getAllStateRows().deleted, targetGrid.dataProvider.getAllStateRows().createAndDeleted);

        let current = grid1.gridView.getCurrent();
        let lvId = grid1.dataProvider.getValue(current.dataRow, 4);
        let changeRowData = [];
        changes.forEach(function (row) {
          let rowState = targetGrid.dataProvider.getRowState(row);
          let data = targetGrid.dataProvider.getJsonRow(row);
          if (rowState === "created") {
            data.ID = generateId();
          }
          data.STRT_DATE_AUTH = new Date(data.STRT_DATE_AUTH).format("yyyy-MM-ddTHH:mm:ss") === " " ? null : new Date(data.STRT_DATE_AUTH).format("yyyy-MM-ddTHH:mm:ss");
          data.END_DATE_AUTH = new Date(data.END_DATE_AUTH).format("yyyy-MM-ddTHH:mm:ss") === " " ? null : new Date(data.END_DATE_AUTH).format("yyyy-MM-ddTHH:mm:ss");
          data.SALES_LV_ID = lvId;
          changeRowData.push(data);
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"));
        } else {
          targetGrid.gridView.showToast(progressSpinner + "Saving data...", true);

          let formData = new FormData();
          formData.append("changes", JSON.stringify(changeRowData));
          formData.append("SEL_SALES_LV_ID", lvId);
          formData.append("P_USER_ID", username);
          formData.append("timeout", 0);
          zAxios
            .post(baseURI() + "engine/dp/SRV_SET_SP_UI_DP_12_S2", formData, {
              headers: { "content-type": "application/json" },
            })
            .then(function (response) {
              if (response.status === gHttpStatus.SUCCESS) {
                const rsData = response.data;
                if (rsData.RESULT_SUCCESS) {
                  let current = grid1.gridView.getCurrent();
                  let id = grid1.gridView.getValues(current.dataRow).ID;

                  const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_12_S1_P_RT_MSG"];
                  resultMSG === "MSG_0001" ? grid2LoadData(id) : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
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
            });
        }
      }
    });
  };

  return (
    <>
      <ContentInner>
        <SearchArea>
          <InputField name="salesHierLv" label={transLangKey("SALES_LV")} type="select" control={control} options={salesLevelOption} />
        </SearchArea>
        <ResultArea sizes={[50, 50]} direction={"vertical"}>
          <Box>
            <ButtonArea title={transLangKey("SALES_LV")}>
              <LeftButtonArea></LeftButtonArea>
              <RightButtonArea></RightButtonArea>
            </ButtonArea>
            <Box style={{ height: "calc(100% - 53px" }}>
              <BaseGrid id="grid1" items={grid1Items}></BaseGrid>
            </Box>
          </Box>
          <Box>
            <ButtonArea title={transLangKey("UI_DP_12")}>
              <LeftButtonArea></LeftButtonArea>
              <RightButtonArea>
                <ButtonGroup variant="outlined">
                  <GridAddRowButton grid="grid2" type="icon" onGetData={getNewGridData2}></GridAddRowButton>
                  <GridDeleteRowButton grid="grid2" type="icon" onDelete={onDelete} onAfterDelete={onAfterDelete}></GridDeleteRowButton>
                  <GridSaveButton
                    grid="grid2"
                    type="icon"
                    onClick={() => {
                      saveData(grid2);
                    }}
                  />
                </ButtonGroup>
              </RightButtonArea>
            </ButtonArea>
            <Box style={{ height: "calc(100% - 53px" }}>
              <BaseGrid id="grid2" items={grid2Items}></BaseGrid>
            </Box>
          </Box>
        </ResultArea>
        <StatusArea show={false} message={message}>
          <GridCnt grid="grid2" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")} />
        </StatusArea>
      </ContentInner>
      {userPopupOpen && <PopSelectUser open={userPopupOpen} onClose={() => setUserPopupOpen(false)} confirm={onSetEmp} multiple={false} />}
    </>
  );
}

export default SalesAuthMap;
