import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ButtonGroup, IconButton, Box } from "@mui/material";
import { ContentInner, ResultArea, SearchArea, useIconStyles, StatusArea, ButtonArea, GridCnt, SearchRow, InputField, GridExcelExportButton, BaseGrid, useViewStore, useUserStore, zAxios } from "@zionex/wingui-core/src/common/imports";
import { transLangKey, vom } from "@wingui";
import { excelExportOptions, loadOption, isEmptyArray } from "@wingui/view/demandplan/DpUtil";
import PopPersonalize from "@wingui/view/common/PopPersonalize";

let grid1Items = [
  { name: "SALES_ID", dataType: "string", visible: false, editable: false, width: "120", merge: true },
  { name: "SALES_CD", dataType: "string", visible: false, editable: false, width: "120", sort: "asc", merge: true },
  { name: "SALES_NM", dataType: "string", visible: false, editable: false, width: "120", sort: "asc", merge: true },
  { name: "EMP_CD", dataType: "string", visible: false, editable: false, width: "120", sort: "asc", merge: true },
  { name: "EMP_NM", dataType: "string", visible: false, editable: false, width: "120", sort: "asc", merge: true },
  { name: "SALES_3M", dataType: "int", editable: false, width: "100", numberFormat: "#,###", textAlignment: "right", groups: "ACT_SALES" },
  { name: "SALES_1M", dataType: "int", editable: false, width: "100", numberFormat: "#,###", textAlignment: "right", groups: "ACT_SALES" },
  {
    name: "DATE",
    dataType: "int",
    headerText: "DATE",
    visible: true,
    editable: false,
    width: "100",
    numberFormat: "#,###",
    gridSummaryExp: "sum",
    groupSummaryExp: "sum",
    iteration: { prefix: "DATE_", prefixRemove: "true", delimiter: "," },
  },
];

let grid2Items = [
  { name: "EMP_CD", dataType: "string", visible: false },
  { name: "EMP_NM", dataType: "string", editable: false, width: "100", initGroupOrder: "1" },
  { name: "ACCOUNT_CD", dataType: "string", editable: false, width: "100" },
  { name: "ACCOUNT_NM", dataType: "string", editable: false, width: "100", lang: true },
  { name: "SALES_6M", dataType: "int", editable: false, width: "100", numberFormat: "#,###", textAlignment: "right", groups: "ACT_SALES" },
  { name: "SALES_3M", dataType: "int", editable: false, width: "100", numberFormat: "#,###", textAlignment: "right", groups: "ACT_SALES" },
  { name: "SALES_1M", dataType: "int", editable: false, width: "100", numberFormat: "#,###", textAlignment: "right", groups: "ACT_SALES" },
  { name: "DATE", dataType: "int", visible: true, editable: false, width: "100", numberFormat: "#,###", gridSummaryExp: "sum", groupSummaryExp: "sum", iteration: { prefix: "DATE_", prefixRemove: "true", delimiter: "," } },
];

function PlanCheckSales(props) {
  //1. view 페이지 데이타 store
  const [setViewInfo] = useViewStore((state) => [state.setViewInfo]);
  const [username] = useUserStore((state) => [state.username]);
  const [message, setMessage] = useState();
  const [personalizeOpen, setPersonalizeOpen] = useState(false);

  //2. 그리드 Object
  const [grid1, setGrid1] = useState(null);
  const [grid2, setGrid2] = useState(null);

  //4. FORM 데이터 처리
  const {
    reset,
    getValues,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  const globalButtons = [
    {
      name: "search",
      action: () => {
        onSubmit();
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
  const [versionOption, setVersionOption] = useState([]);
  const [salesLevelOption, setSalesLevelOption] = useState([]);

  useEffect(() => {
    setViewInfo(vom.active, "globalButtons", globalButtons);
  }, [grid1, grid2]);

  useEffect(() => {
    loadVersion();
    loadSalesLevel();
  }, []);

  function onSubmit(data) {
    loadDataGrid1(data);
  }

  function refresh() {
    reset();
    grid1.dataProvider.clearRows();
    grid2.dataProvider.clearRows();
  }

  function exportExcel() {
    grid1.exportExcel();
  }

  const loadVersion = async () => {
    const versions = await loadOption(true, "SRV_GET_SP_UI_DP_00_VERSION_Q1", { PLAN_TP_ID: "", CL_YN: "N", VER_CNT: "10" }, "ID", "VER_ID", false, true);
    //console.log("versions", versions);
    setVersionOption(versions);
    setValue("versionId", versions[0].value);
  };

  const loadSalesLevel = async () => {
    const salesLevelOptionData = await loadOption(true, "GetLeafSalesLevel", { ALL_INCLUDE: "N" }, "SALES_LV_ID", "SALES_LV_CD", false, true);
    //console.log("salesLevelOptionData", salesLevelOptionData);
    setSalesLevelOption(salesLevelOptionData);
    setValue("salesLvId", salesLevelOptionData[0].value);
  };

  function loadDataGrid1() {
    let param = new URLSearchParams();
    param.append("VER_ID", getValues("versionId"));
    param.append("SALES_LV_ID", getValues("salesLvId"));
    param.append("CROSSTAB", JSON.stringify(grid1.gridView.crossTabInfo));

    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_32_Q1",
      data: param,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          const dataArr = res.data.RESULT_DATA;

          if (!isEmptyArray(dataArr)) {
            grid1.setData(dataArr);

            let salesLvId = dataArr[0].SALES_ID;
            let empCd = dataArr[0].EMP_CD;
            loadDataGrid2(salesLvId, empCd);
          }
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function loadDataGrid2(salesLvId, empCd) {
    let param = new URLSearchParams();
    param.append("VER_ID", getValues("versionId"));
    param.append("EMP_CD", empCd);
    param.append("SALES_LV_ID", salesLvId);
    param.append("CROSSTAB", JSON.stringify(grid2.gridView.crossTabInfo));
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_32_Q2",
      data: param,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          let dataArr = res.data.RESULT_DATA.ITC1_DATA;
          grid2.setData(dataArr);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  const afterGridCreate1 = (gridObj, gridView, dataProvider) => {
    setGrid1(gridObj);
    setGrid1Options(gridObj);
  };

  const afterGridCreate2 = (gridObj, gridView, dataProvider) => {
    setGrid2(gridObj);
    setGrid2Options(gridObj);
  };

  //function setOptionsGrid1() {
  const setGrid1Options = (grid) => {
    grid.gridView.setDisplayOptions({
      fitStyle: "fill",
    });
    grid.gridView.setColumnProperty("SALES_CD", "mergeRule", { criteria: "value" });
    grid.gridView.setColumnProperty("SALES_NM", "mergeRule", { criteria: "value" });
    grid.gridView.setDisplayOptions({ showEmptyMessage: true, emptyMessage: transLangKey("MSG_NO_DATA") });

    grid.gridView.onCellClicked = (grid, clickData) => {
      if (clickData.cellType != "check" && clickData.column != "head" && clickData.cellType == "data") {
        let salesLvId = grid.getValue(clickData.itemIndex, "SALES_ID");
        let empCd = grid.getValue(clickData.itemIndex, "EMP_CD");
        if (salesLvId != null) {
          loadDataGrid2(salesLvId, empCd);
        }
      }
    };
  };

  function setGrid2Options(grid) {
    grid.gridView.setDisplayOptions({
      fitStyle: "fill",
    });
    grid.gridView.setDisplayOptions({ showEmptyMessage: true, emptyMessage: transLangKey("MSG_NO_DATA") });
    grid.gridView.setColumnProperty("SALES_CD", "mergeRule", { criteria: "value" });
    grid.gridView.setColumnProperty("SALES_NM", "mergeRule", { criteria: "value" });
    grid.gridView.setColumnProperty("ITEM_LV_CD", "mergeRule", { criteria: "value" });
    grid.gridView.setColumnProperty("ITEM_LV_NM", "mergeRule", { criteria: "value" });
  }

  const reloadPrefInfo = (viewCd, userName, grid, grpCd, gridCd) => {
    if (grid) grid.loadCrossTabInfoAndPrefInfo(viewCd, grpCd, userName);
  };

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <InputField type="select" name="versionId" label={transLangKey("VERSION_ID")} control={control} options={versionOption} />
            <InputField type="select" name="salesLvId" label="SalesLevel" control={control} options={salesLevelOption} />
          </SearchRow>
        </SearchArea>
        <ResultArea sizes={[50, 50]} direction={"vertical"}>
          <Box>
            <ButtonArea title={transLangKey("UI_DP_32")}></ButtonArea>
            <Box style={{ height: "calc(100% - 53px" }}>
              <BaseGrid id="grid1" items={grid1Items} viewCd={vom.active} userName={username} gridCd="UI_DP_32-RST_CPT_01" afterGridCreate={afterGridCreate1}></BaseGrid>
            </Box>
          </Box>
          <Box>
            <ButtonArea></ButtonArea>
            <Box style={{ height: "calc(100% - 53px" }}>
              <BaseGrid id="grid2" items={grid2Items} viewCd={vom.active} userName={username} gridCd="UI_DP_32-RST_CPT_02" afterGridCreate={afterGridCreate2}></BaseGrid>
            </Box>
          </Box>
        </ResultArea>
        <StatusArea show={false} message={message}>
          <GridCnt grid="grid2" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")}></GridCnt>
        </StatusArea>
      </ContentInner>
      <PopPersonalize open={personalizeOpen} onClose={() => setPersonalizeOpen(false)} resetCallback={reloadPrefInfo} viewCd={vom.active} grid={[grid1, grid2]} username={username} authTpId={""}></PopPersonalize>
    </>
  );
}
export default PlanCheckSales;
