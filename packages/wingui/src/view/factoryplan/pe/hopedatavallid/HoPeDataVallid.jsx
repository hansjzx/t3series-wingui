import React, { useState, useEffect } from "react";
import { ButtonGroup, Tooltip, IconButton, Box } from "@mui/material";
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
  CommonButton,
  BaseGrid,
  GridCnt,
  useViewStore,
  zAxios,
  useUserStore,
  GridExcelExportButton,
  GridExcelImportButton,
} from "@zionex/wingui-core/src/common/imports";

let grid1Items = [
  { name: "ERROR_CD", dataType: "text", headerText: "HOBL_FP_ERROR_CD", visible: false, editable: false, width: 100, textAlignment: "left" },
  { name: "ERROR_NM", dataType: "text", headerText: "HOBL_FP_ERROR_NM", visible: true, editable: false, width: 100, textAlignment: "left" },
  { name: "ERROR_CAUSE", dataType: "text", headerText: "HOBL_FP_ERROR_CAUSE", visible: true, editable: false, width: 100, textAlignment: "left" },
  { name: "ERROR_ACT", dataType: "text", headerText: "HOBL_FP_ERROR_ACT", visible: true, editable: false, width: 100, textAlignment: "left" },
  { name: "ERROR_CNT", dataType: "number", headerText: "HOBL_FP_ERROR_CNT", visible: true, editable: false, width: 100, textAlignment: "right", numberFormat: "#,###" },
];

let grid2Items = [
  { name: "ITEM_CD", dataType: "text", headerText: "HOBL_FP_ITEM_CD", visible: true, editable: false, width: 100, textAlignment: "center" },
  { name: "PLNT_CD", dataType: "text", headerText: "HOBL_FP_PLNT_CD", visible: true, editable: false, width: 100, textAlignment: "center" },
  { name: "ATTR_01", dataType: "text", headerText: "HOBL_FP_ATTR_01", visible: true, editable: false, width: 100, textAlignment: "left" },
  { name: "ATTR_02", dataType: "text", headerText: "HOBL_FP_ATTR_02", visible: true, editable: false, width: 100, textAlignment: "left" },
  { name: "ATTR_03", dataType: "text", headerText: "HOBL_FP_ATTR_03", visible: true, editable: false, width: 100, textAlignment: "left" },
  { name: "ATTR_04", dataType: "text", headerText: "HOBL_FP_ATTR_04", visible: true, editable: false, width: 100, textAlignment: "left" },
  { name: "ATTR_05", dataType: "text", headerText: "HOBL_FP_ATTR_05", visible: true, editable: false, width: 100, textAlignment: "left" },
];

function HoPeDataVallid(props) {
  const [username] = useUserStore((state) => [state.username]);

  //1. view page data store
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);

  //2. grid Object
  const [grid1, setGrid1] = useState(null);
  const [grid2, setGrid2] = useState(null);

  // grid Object init
  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, "grid1");
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        setGrid1(grdObj1);
      }
    }
    const grdObj2 = getViewInfo(vom.active, "grid2");
    if (grdObj2) {
      if (grdObj2.dataProvider) {
        setGrid2(grdObj2);
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
        // saveData(grid1);
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
        // setPersonalizeOpen(true);
      },
      visible: false,
      disable: false,
    },
  ];

  useEffect(() => {
    if (grid1) {
      setViewInfo(vom.active, "globalButtons", globalButtons);
      setGrid1Options();
    }
  }, [grid1]);

  useEffect(() => {
    if (grid2) {
      setViewInfo(vom.active, "globalButtons", globalButtons);
      setGrid2Options();
    }
  }, [grid2]);
  
  const setGrid1Options = () => {
    grid1.gridView.displayOptions.fitStyle = "fill";

    //events
    grid1.gridView.onCellClicked = function (grid, clickData) {
      if (clickData.cellType === "gridEmpty") {
        return;
      }
      let errorCd = grid.getValue(clickData.itemIndex, "ERROR_CD");
      loadData2(errorCd);
      grid2.gridView.setDisplayOptions({ showEmptyMessage: true });
    };

    setVisibleProps(grid1, true, false, false);
  };

  const setGrid2Options = () => {
    grid1.gridView.displayOptions.fitStyle = "fill";
    setVisibleProps(grid2, true, false, false);
  };

  /** 이벤트 핸들러 */
  const onSubmit = (data) => {
    loadData(data);
  };

  function refresh() {
    reset();
    grid1.dataProvider.clearRows();
    grid2.dataProvider.clearRows();
  }

  function loadData() {
    grid1.gridView.commit(true);

    let params = {
      'P_USER_ID': username,
    }

    zAxios({
      method: 'post',
      headers: { 'content-type': 'application/json' },
      url: baseURI() + 'fp/pe/HO_PE_DATA_VALID/q1',
      data: params
    })
    .then(function (res) {
      grid1.dataProvider.fillJsonData(res.data);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
    });
  }

  function loadData2(errorCd) {
    grid2.gridView.commit(true);

    let params = {
      'P_ERROR_CD': errorCd,
      'P_USER_ID': username,
    }

    zAxios({
      method: 'post',
      headers: { 'content-type': 'application/json' },
      url: baseURI() + 'fp/pe/HO_PE_DATA_VALID/q2',
      data: params
    })
    .then(function (res) {
      grid2.dataProvider.fillJsonData(res.data);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
    });
  }

  /** 이벤트 핸들러 끝 */

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
          </SearchRow>
        </SearchArea>
        <ResultArea sizes={[50, 50]} direction={"vertical"}>
          <Box>
            <ButtonArea title={transLangKey("HO_PE_DATA_VALID")}>
              <LeftButtonArea>
              </LeftButtonArea>
              <RightButtonArea>
              </RightButtonArea>
            </ButtonArea>
            <Box style={{ height: "calc(100% - 53px" }}>
              <BaseGrid id="grid1" items={grid1Items} viewCd="HO_PE_DATA_VALID" username={username} gridCd="HO_PE_DATA_VALID-RST_CPT_01"></BaseGrid>
            </Box>
          </Box>
          <Box>
            <ButtonArea>
              <LeftButtonArea>
              </LeftButtonArea>
              <RightButtonArea>
              </RightButtonArea>
            </ButtonArea>
            <Box style={{ height: "calc(100% - 53px" }}>
              <BaseGrid id="grid2" items={grid2Items} viewCd="HO_PE_DATA_VALID" username={username} gridCd="HO_PE_DATA_VALID-RST_CPT_02"></BaseGrid>
            </Box>
          </Box>
        </ResultArea>
        <StatusArea show={false} message={message}>
          <GridCnt grid="grid1" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")}></GridCnt>
        </StatusArea>
      </ContentInner>
    </>
  );
}

export default HoPeDataVallid;