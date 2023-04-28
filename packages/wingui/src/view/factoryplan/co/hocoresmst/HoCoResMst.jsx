import React, { useState, useEffect, useRef } from "react";
import { useForm, watch } from "react-hook-form";
import { PolarArea, Bar, Line, Chart } from "react-chartjs-2";
import { Box, ButtonGroup, Button, Paper, IconButton } from "@mui/material";
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
  InputField,
  GridAddRowButton,
  GridDelRowButton,
  GridExcelExportButton,
  CommonButton,
  GridSaveButton,
  BaseGrid,
  GridCnt,
  useViewStore,
  useUserStore,
  useStyles,
  zAxios,
  SearchItem,
} from "@zionex/wingui-core/src/common/imports";
import { transLangKey } from "@zionex/wingui-core/src/lang/i18n-func";
import PopPersonalize from "@wingui/view/common/PopPersonalize";
import PopSelectItem from "@wingui/view/factoryplan/popup/PopSelectItem";

let grid1Items = [
  {
    name: 'PLNT_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'HOBL_FP_PLNT', headerVisible: true,
    childs: [
      { name: "PLNT_CD", dataType: "text", headerText: "HOBL_FP_CODE", visible: true, editable: false, width: 80, textAlignment: "center" },
      { name: "PLNT_NM", dataType: "text", headerText: "HOBL_FP_NAME", visible: true, editable: false, width: 230, textAlignment: "near" },
    ]
  },
  {
    name: 'RES_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'HOBL_FP_RES', headerVisible: true,
    childs: [
      { name: "RES_CD", dataType: "text", headerText: "HOBL_FP_CODE", visible: true, editable: false, width: 80, textAlignment: "center" },
      { name: "RES_NM", dataType: "text", headerText: "HOBL_FP_NAME", visible: true, editable: false, width: 230, textAlignment: "near" },
      { name: "PROC_DIV_01", dataType: "text", headerText: "HOBL_FP_PROC_DIV_01", visible: true, editable: false, width: 100, textAlignment: "center" },
      { name: "PROC_DIV_02", dataType: "text", headerText: "HOBL_FP_PROC_DIV_02", visible: true, editable: false, width: 100, textAlignment: "center" },
      { name: "MAX_VOL", dataType: "number", headerText: "HOBL_FP_MAX_VOL", visible: true, editable: true, width: 100, textAlignment: "far", numberFormat: "#,###.###" },
      { name: "MOQ_VOL", dataType: "number", headerText: "HOBL_FP_MOQ_VOL", visible: true, editable: true, width: 100, textAlignment: "far", numberFormat: "#,###.###" },
      { name: "LINE_GRP_CD", dataType: "text", headerText: "HOBL_FP_LINE_GRP_CD", visible: true, editable: true, width: 120, textAlignment: "center" },
      { name: "DEL_YN", dataType: "boolean", headerText: "HOBL_FP_PLNT_DEL_YN", visible: true, editable: false, width: 100, textAlignment: "center" },
    ]
  },
  {
    name: 'USER_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'HOBL_FP_USER', headerVisible: true,
    childs: [
      { name: "INS_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: 80, textAlignment: "center" },
      { name: "INS_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: 130, format: "yyyy-MM-dd HH:mm:ss", textAlignment: "center" },
      { name: "UPD_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 80, textAlignment: "center" },
      { name: "UPD_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 130, format: "yyyy-MM-dd HH:mm:ss", textAlignment: "center" },
    ]
  },
];

function HoCoResMst(props) {
  const [username] = useUserStore((state) => [state.username]);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const [itemPopupOpen, setItemPopupOpen] = useState(false);
  const [personalizeOpen, setPersonalizeOpen] = useState(false);
  const [option1, setOption1] = useState([]);

  //2. 그리드 Object
  const [grid1, setGrid1] = useState(null);

  //3. 상태 메시지
  const [message, setMessage] = useState();

  //4. FORM 데이터 처리
  const { handleSubmit, reset, control, getValues, setValue, watch, register, formState: { errors }, clearErrors
    } = useForm({
    defaultValues: {
      resCd: "",
      procDiv01: "",
      procDiv02: "",
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
    const grdObj1 = getViewInfo(vom.active, "grid1");
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        setGrid1(grdObj1);
      }
    }
  }, [viewData]);

  useEffect(() => {
    if (grid1) {
      setViewInfo(vom.active, "globalButtons", globalButtons);
    }
  }, [grid1]);

  const afterGridCreate = (gridObj, gridView, dataProvider) => {
    setOptions(gridObj);
  };

  function setOptions(gridObj) {
    setVisibleProps(gridObj, true, false, false);
    gridObj.gridView.setDisplayOptions({
      fitStyle: "none",
    });

  }

  /** 이벤트 핸들러 */
  function onSubmit(data) {
    loadDataGrid1(data);
  }

  function refresh() {
    reset();
    grid1.dataProvider.clearRows();
  }

  function loadDataGrid1() {
    grid1.gridView.commit(true);

    let params = {
      'P_RES_CD': getValues('resCd'),
      'P_PROC_DIV_01': getValues('procDiv01'),
      'P_PROC_DIV_02': getValues('procDiv02'),
      'P_USER_ID': username,
    }

    zAxios({
      method: 'post',
      headers: { 'content-type': 'application/json' },
      url: baseURI() + 'fp/co/HO_CO_RES_MST/q1',
      data: params
    })
    .then(function (res) {
      grid1.dataProvider.fillJsonData(res.data);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      grid1.gridView.hideToast();
    });
  }

  function saveData(targetGrid) {
    targetGrid.gridView.commit(true);
    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
            targetGrid.dataProvider.getAllStateRows().created,
            targetGrid.dataProvider.getAllStateRows().updated,
            targetGrid.dataProvider.getAllStateRows().deleted,
            targetGrid.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          let data = targetGrid.dataProvider.getJsonRow(row);
          data.MAX_VOL = data.MAX_VOL ? data.MAX_VOL.toString() : "";
          data.MOQ_VOL = data.MOQ_VOL ? data.MOQ_VOL.toString() : "";
          data.USER_ID = username;
          changeRowData.push(data);
        });

        if (changeRowData.length === 0) {
          //저장 할 내용이 없습니다.
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"), { close: false });
        } else {
          zAxios({
            method: "post",
            headers: { "content-type": "application/json" },
            url: baseURI() + "fp/co/HO_CO_RES_MST/s1",
            data: changeRowData,
          })
          .then(function () {
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
    if (grid) {
      grid.loadCrossTabInfoAndPrefInfo(viewCd, grpCd, userName);
    }
  };

  return (
    <>
      <ContentInner>
        {/* <ViewPath {...viewPathProps} submit={handleSubmit(onSubmit, onError)}></ViewPath> */}
        <SearchArea>
          <SearchRow>
            <InputField name="resCd" label={transLangKey("HOBL_FP_RES_CD")} readonly={false} disabled={false} control={control} />
            <InputField name="procDiv01" label={transLangKey("HOBL_FP_PROC_DIV_01")} readonly={false} disabled={false} control={control} />
            <InputField name="procDiv02" label={transLangKey("HOBL_FP_PROC_DIV_02")} readonly={false} disabled={false} control={control} />
          </SearchRow>
        </SearchArea>
        <ButtonArea title={transLangKey("HO_CO_RES_MST")}>
          <LeftButtonArea>
          </LeftButtonArea>
          <RightButtonArea>
            {/* <GridAddRowButton grid="grid1" type="icon"></GridAddRowButton> */}
            {/* <GridDeleteRowButton grid="grid1" type="icon" onDelete={onDelete} onAfterDelete={onAfterDelete}></GridDeleteRowButton> */}
            <GridSaveButton grid="grid1" type="icon" onClick={() => {saveData(grid1);}}/>
          </RightButtonArea>
        </ButtonArea>
        <ResultArea sizes={[100, 50]} direction={"vertical"}>
          <BaseGrid id="grid1" items={grid1Items} viewCd="HO_CO_RES_MST" gridCd="HO_CO_RES_MST-RST_CPT_01" userName={username} afterGridCreate={afterGridCreate}></BaseGrid>
        </ResultArea>
        <StatusArea message={message} show={false}>
          <GridCnt grid="grid1" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")}></GridCnt>
        </StatusArea>
      </ContentInner>
      <PopPersonalize open={personalizeOpen} onClose={() => setPersonalizeOpen(false)} resetCallback={reloadPrefInfo} viewCd="HO_CO_RES_MST" grid={grid1} username={username} authTpId={""}></PopPersonalize>
    </>
  );
}

export default HoCoResMst;
