import React, { useState, useEffect } from "react";
import { ButtonGroup } from "@mui/material";
import { useForm } from "react-hook-form";
import {
  ContentInner,
  ViewPath,
  ResultArea,
  SearchArea,
  StatusArea,
  ButtonArea,
  LeftButtonArea,
  RightButtonArea,
  SearchRow,
  SplitPanel,
  InputField,
  GridAddRowButton,
  GridDeleteRowButton,
  GridSaveButton,
  BaseGrid,
  GridCnt,
  useViewStore,
  zAxios,
  GridExcelExportButton,
  GridExcelImportButton,
  useUserStore,
} from "@zionex/wingui-core/src/common/imports";
import PopPersonalize from "@wingui/view/common/PopPersonalize";

let grid1Items = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: 100, textAlignment: "center" },
  {
    name: "BASE_DATE",
    dataType: "datetime",
    headerText: "BASE_DATE",
    visible: true,
    editable: false,
    width: 100,
    textAlignment: "center",
    format: "yyyy-MM-dd",
    styleCallback: function (grid, dataCell) {
      let ret = {};
      if (dataCell.item.rowState == "created" || dataCell.item.itemState == "appending" || dataCell.item.itemState == "inserting") {
        ret.editable = true;
        ret.styleName = "editable-column";
      } else {
        ret.editable = false;
      }
      return ret;
    },
  },
  { name: "FACTOR1", dataType: "text", headerText: "FACTOR1", visible: true, editable: true, width: 100, textAlignment: "center" },
  { name: "FACTOR2", dataType: "text", headerText: "FACTOR2", visible: true, editable: true, width: 100, textAlignment: "center" },
  { name: "FACTOR3", dataType: "text", headerText: "FACTOR3", visible: true, editable: true, width: 100, textAlignment: "center" },
  { name: "FACTOR4", dataType: "text", headerText: "FACTOR4", visible: true, editable: true, width: 100, textAlignment: "center" },
  { name: "FACTOR5", dataType: "text", headerText: "FACTOR5", visible: true, editable: true, width: 100, textAlignment: "center" },
  { name: "FACTOR6", dataType: "text", headerText: "FACTOR6", visible: true, editable: true, width: 100, textAlignment: "center" },
  { name: "FACTOR7", dataType: "text", headerText: "FACTOR7", visible: true, editable: true, width: 100, textAlignment: "center" },
  { name: "FACTOR8", dataType: "text", headerText: "FACTOR8", visible: false, editable: true, width: 100, textAlignment: "center" },
  { name: "FACTOR9", dataType: "text", headerText: "FACTOR9", visible: false, editable: true, width: 100, textAlignment: "center" },
  { name: "FACTOR10", dataType: "text", headerText: "FACTOR10", visible: false, editable: true, width: 100, textAlignment: "center" },
  { name: "FACTOR11", dataType: "text", headerText: "FACTOR11", visible: false, editable: true, width: 100, textAlignment: "center" },
  { name: "FACTOR12", dataType: "text", headerText: "FACTOR12", visible: false, editable: true, width: 100, textAlignment: "center" },
  { name: "FACTOR13", dataType: "text", headerText: "FACTOR13", visible: false, editable: true, width: 100, textAlignment: "center" },
  { name: "FACTOR14", dataType: "text", headerText: "FACTOR14", visible: false, editable: true, width: 100, textAlignment: "center" },
  { name: "FACTOR15", dataType: "text", headerText: "FACTOR15", visible: false, editable: true, width: 100, textAlignment: "center" },
  { name: "FACTOR16", dataType: "text", headerText: "FACTOR16", visible: false, editable: true, width: 100, textAlignment: "center" },
  { name: "FACTOR17", dataType: "text", headerText: "FACTOR17", visible: false, editable: true, width: 100, textAlignment: "center" },
  { name: "FACTOR18", dataType: "text", headerText: "FACTOR18", visible: false, editable: true, width: 100, textAlignment: "center" },
  { name: "FACTOR19", dataType: "text", headerText: "FACTOR19", visible: false, editable: true, width: 100, textAlignment: "center" },
  { name: "FACTOR20", dataType: "text", headerText: "FACTOR20", visible: false, editable: true, width: 100, textAlignment: "center" },
  { name: "USER_ID", dataType: "text", headerText: "USER_ID", visible: false, editable: false, width: 100, textAlignment: "center" },
  { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: 100, textAlignment: "center" },
  { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: 100, textAlignment: "center", format: "yyyy-MM-dd HH:mm:ss" },
];

const excelExportOptions = {
  lookupDisplay: false,
  // allColumns: true,
  separateRows: true,
  footer: "default",
  headerDepth: 2,
  importExceptFields: { 0: "id" },
};

function DateFactor(props) {
  const [username] = useUserStore((state) => [state.username]);

  //1. view page data store
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);

  //2. grid Object
  const [grid1, setGrid1] = useState(null);

  const [personalizeOpen, setPersonalizeOpen] = useState(false);

  // grid Object init
  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, "grid1");
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        setGrid1(grdObj1);
      }
    }
  }, [viewData]);

  //3. 상태 메시지
  const [message, setMessage] = useState();

  //4. FORM 데이터 처리
  const {
    handleSubmit,
    reset,
    control,
    getValues,
    setValue,
    watch,
    register,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: {
      applyDttmF: new Date(new Date().setMonth(new Date().getMonth() - 1)),
      applyDttmT: new Date(),
    },
  });

  const globalButtons = [
    {
      name: "search",
      action: (e) => {
        onSubmit();
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
        refresh();
      },
      visible: true,
      disable: false,
    },
    {
      name: "personalization",
      action: (e) => {
        setPersonalizeOpen(true);
      },
      visible: true,
      disable: false,
    },
  ];

  useEffect(() => {
    if (grid1) {
      setViewInfo(vom.active, "globalButtons", globalButtons);
    }
  }, [grid1]);

  /** 이벤트 핸들러 */
  const onSubmit = (data) => {
    loadData(data);
  };

  function refresh() {
    reset();
    grid1.dataProvider.clearRows();
  }

  const afterGridCreate1 = (gridObj, gridView, dataProvider) => {
    setGrid1(gridObj);
    setVisibleProps(gridObj, true, true, true);
    gridObj.gridView.displayOptions.fitStyle = "evenFill";
  };

  function loadData() {
    let applyDttmF = new Date(getValues("applyDttmF"));
    let applyDttmT = new Date(getValues("applyDttmT"));

    let fromDate = applyDttmF ? applyDttmF.format("yyyy-MM-ddT00:00:00") : "19700101";
    let toDate = applyDttmT ? applyDttmT.format("yyyy-MM-ddT00:00:00") : "99991231";

    let param = new URLSearchParams();
    param.append("FROM_DATE", fromDate);
    param.append("TO_DATE", toDate);
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_BF_06_Q1",
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
      })
      .then(function () {
        grid1.gridView.hideToast();
      });
  }

  function onDelete(targetGrid, deleteRows) {
    let formData = new FormData();
    formData.append("USER_ID", username);
    formData.append("checked", JSON.stringify(deleteRows));

    if (deleteRows.length > 0) {
      zAxios({
        method: "post",
        url: baseURI() + "engine/dp/SRV_SET_SP_UI_BF_06_D1",
        headers: { "content-type": "application/json" },
        data: formData,
      })
        .then(function (res) {
          let isSucess = res.data.RESULT_SUCCESS;
          if (isSucess) {
            let resultMSG = res.data.RESULT_DATA.IM_DATA.SP_UI_BF_06_D1_P_RT_MSG;
            showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
          } else {
            let resultMSG = res.data.RESULT_MESSAGE;
            showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
          }
          return res;
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  }

  const onAfterDelete = (targetGrid) => {
    if (targetGrid.gridView === "grid1") {
      loadData();
    }
  };

  function saveData(targetGrid) {
    targetGrid.gridView.commit(true); // realgrid main.js error
    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), function (answer) {
      if (answer) {
        let changes = [];
        let changeRowData = [];
        changes = changes.concat(targetGrid.dataProvider.getAllStateRows().created, targetGrid.dataProvider.getAllStateRows().updated, targetGrid.dataProvider.getAllStateRows().deleted, targetGrid.dataProvider.getAllStateRows().createAndDeleted);

        changes.forEach(function (row) {
          let data = targetGrid.dataProvider.getJsonRow(row);
          data.BASE_DATE = data.BASE_DATE.format("yyyy-MM-ddTHH:mm:ss");
          changeRowData.push(data);
        });

        if (changeRowData.length === 0) {
          //저장 할 내용이 없습니다.
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"), { close: false });
        } else {
          targetGrid.gridView.showToast(progressSpinner + "Saving data...", true);

          let formData = new FormData();
          formData.append("changes", JSON.stringify(changeRowData));
          formData.append('procedure', "SP_UI_BF_06_S1_J");
          formData.append("P_USER_ID", username);

          zAxios({
            method: "post",
            headers: { "content-type": "application/json" },
            url: baseURI() + "common/json-save",
            data: formData,
          })
            .then(function () {
              targetGrid.gridView.hideToast();
              loadData();
            })
            .catch(function (e) {
              console.error(e);
            });
        }
      }
    });
  }

  const reloadPrefInfo = (viewCd, userName, grid, grpCd, gridCd) => {
    if (grid) grid.loadCrossTabInfoAndPrefInfo(viewCd, grpCd, userName);
  };

  /** 이벤트 핸들러 끝 */

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            {/* direction : row, column */}
            <InputField type={"datetime"} name="applyDttmF" label={transLangKey("FROM_DATE")} control={control} dateformat="yyyy-MM-dd" readonly={false} />
            <InputField type={"datetime"} name="applyDttmT" label={transLangKey("TO_DATE")} control={control} dateformat="yyyy-MM-dd" readonly={false} />
          </SearchRow>
        </SearchArea>
        <ButtonArea title={transLangKey("UI_BF_06")}>
          <LeftButtonArea>
            <GridExcelExportButton type="icon" grid="grid1" options={excelExportOptions} />
            {/*<GridExcelImportButton type="icon" grid="grid1"></GridExcelImportButton>*/}
          </LeftButtonArea>
          <RightButtonArea>
            <GridAddRowButton grid="grid1" type="icon"></GridAddRowButton>
            <GridDeleteRowButton grid="grid1" type="icon" onDelete={onDelete} onAfterDelete={onAfterDelete}></GridDeleteRowButton>
            <GridSaveButton
              grid="grid1"
              type="icon"
              onClick={() => {
                saveData(grid1);
              }}
            />
          </RightButtonArea>
        </ButtonArea>
        <ResultArea>
          <BaseGrid id="grid1" items={grid1Items} username={username} viewCd="UI_BF_06" gridCd="UI_BF_06-RST_CPT_01" afterGridCreate={afterGridCreate1}></BaseGrid>
        </ResultArea>
        <StatusArea show={false} message={message}>
          <GridCnt grid="grid1" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")}></GridCnt>
        </StatusArea>
      </ContentInner>
      <PopPersonalize open={personalizeOpen} onClose={() => setPersonalizeOpen(false)} resetCallback={reloadPrefInfo} viewCd="UI_BF_06" grid={grid1} username={username} grpCd={""}></PopPersonalize>
    </>
  );
}

export default DateFactor;
