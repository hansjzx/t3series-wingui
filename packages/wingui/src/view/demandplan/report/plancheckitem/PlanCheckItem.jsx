import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ButtonGroup, IconButton, Box } from "@mui/material";
import { ContentInner, ResultArea, SearchArea, useIconStyles, StatusArea, ButtonArea, GridCnt, SearchRow, InputField, BaseGrid, useViewStore, useUserStore, zAxios } from "@zionex/wingui-core/src/common/imports";
import { transLangKey, vom, gridComboLoad } from "@wingui";
import { excelExportOptions, loadOption, isEmptyArray } from "@wingui/view/demandplan/DpUtil";
import PopPersonalize from "@wingui/view/common/PopPersonalize";

let grid1Items = [
  { name: "SALES_ID", dataType: "text", headerText: "SALES_ID", visible: false, editable: false, width: "120" },
  { name: "SALES_CD", dataType: "text", headerText: "SALES_CD", visible: true, editable: false, width: "120", textAlignment: "center" },
  { name: "SALES_NM", dataType: "text", headerText: "SALES_NM", visible: true, editable: false, width: "120", textAlignment: "center" },
  { name: "ITEM_LV_ID", dataType: "text", headerText: "ITEM_LV_ID", visible: false, editable: false, width: "120", textAlignment: "center" },
  { name: "ITEM_LV_CD", dataType: "text", headerText: "ITEM_LV_CD", visible: true, editable: false, width: "120", textAlignment: "center" },
  { name: "ITEM_LV_NM", dataType: "text", headerText: "ITEM_LV_NM", visible: true, editable: false, width: "120" },
  { name: "SALES_3M", dataType: "number", headerText: "SALES_3M", visible: true, editable: false, width: "100", numberFormat: "#,###", textAlignment: "right", groups: "ACT_SALES" },
  { name: "SALES_1M", dataType: "number", headerText: "SALES_1M", visible: true, editable: false, width: "100", numberFormat: "#,###", textAlignment: "right", groups: "ACT_SALES" },
  { name: "DATE", dataType: "number", headerText: "DATE", visible: true, editable: false, width: "100", numberFormat: "#,###", textAlignment: "right", iteration: { prefix: "DATE_", prefixRemove: "true", delimiter: "," } },
];

let grid2Items = [
  { name: "SALES_CD", dataType: "text", headerText: "SALES_CD", visible: true, editable: false, width: "120", textAlignment: "center" },
  { name: "SALES_NM", dataType: "text", headerText: "SALES_NM", visible: true, editable: false, width: "120", textAlignment: "center" },
  { name: "ITEM_LV_CD", dataType: "text", headerText: "ITEM_LV_CD", visible: true, editable: false, width: "120", textAlignment: "center" },
  { name: "ITEM_LV_NM", dataType: "text", headerText: "ITEM_LV_NM", visible: true, editable: false, width: "120", textAlignment: "center" },
  { name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: "100", textAlignment: "center" },
  { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: "100", textAlignment: "center" },
  { name: "SALES_6M", dataType: "number", headerText: "SALES_6M", visible: true, editable: false, width: "100", numberFormat: "#,###", textAlignment: "right", groups: "ACT_SALES" },
  { name: "SALES_3M", dataType: "number", headerText: "SALES_3M", visible: true, editable: false, width: "100", numberFormat: "#,###", textAlignment: "right", groups: "ACT_SALES" },
  { name: "SALES_1M", dataType: "number", headerText: "SALES_1M", visible: true, editable: false, width: "100", numberFormat: "#,###", textAlignment: "right", groups: "ACT_SALES" },
  { name: "DATE", dataType: "number", headerText: "DATE", visible: true, editable: false, width: "100", numberFormat: "#,###", textAlignment: "right", iteration: { prefix: "DATE_", prefixRemove: "true", delimiter: "," } },
];

function PlanCheckItem(props) {
  //1.
  const [setViewInfo] = useViewStore((state) => [state.setViewInfo]);
  const [username] = useUserStore((state) => [state.username]);
  const [message, setMessage] = useState();
  const [personalizeOpen, setPersonalizeOpen] = useState(false);

  //2.
  const [grid1, setGrid1] = useState(null);
  const [grid2, setGrid2] = useState(null);

  const [versionOption, setVersionOption] = useState([]);
  const [salesLevelOption, setSalesLevelOption] = useState([]);
  const [itemLevelOption, setItemLevelOption] = useState([]);

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

  const { reset, getValues, setValue, control } = useForm({
    defaultValues: { salesLvId: "ALL", itemLvId: "ALL" },
  });

  useEffect(() => {
    setViewInfo(vom.active, "globalButtons", globalButtons);
    if (grid1 && grid2) {
      grid1.gridView.onCellClicked = function (grid, clickData) {
        if (clickData.cellType != "check" && clickData.colu != "head" && clickData.cellType != "header") {
          let salesLvId = grid.getValue(clickData.itemIndex, "SALES_ID");
          let itemLvId = grid.getValue(clickData.itemIndex, "ITEM_LV_ID");
          console.log("salesLvId:", salesLvId, "itemLvId:", itemLvId);
          if (salesLvId != null && itemLvId != null) {
            loadDataGrid2(salesLvId, itemLvId);
          }
        }
      };
    }
  }, [grid1, grid2]);

  useEffect(() => {
    loadVersion();
    loadSalesLevel();
    loadItemLevel();
  }, []);

  function onSubmit(data) {
    loadDataGrid1(data);
  }

  function refresh() {
    reset();
    grid1.dataProvider.clearRows();
  }

  function exportExcel() {
    grid1.exportExcel();
  }

  const setGrid1Options = (grid) => {
    grid.gridView.setDisplayOptions({
      fitStyle: "fill",
    });
    grid.gridView.setColumnProperty("SALES_CD", "mergeRule", { criteria: "value" });
    grid.gridView.setColumnProperty("SALES_NM", "mergeRule", { criteria: "value" });
  };

  function setGrid2Options(grid) {
    grid.gridView.setDisplayOptions({
      fitStyle: "fill",
    });
    grid.gridView.setColumnProperty("SALES_CD", "mergeRule", { criteria: "value" });
    grid.gridView.setColumnProperty("SALES_NM", "mergeRule", { criteria: "value" });
    grid.gridView.setColumnProperty("ITEM_LV_CD", "mergeRule", { criteria: "value" });
    grid.gridView.setColumnProperty("ITEM_LV_NM", "mergeRule", { criteria: "value" });
  }

  const loadVersion = async () => {
    const versions = await loadOption(true, "SRV_GET_SP_UI_DP_00_VERSION_Q1", { PLAN_TP_ID: "", CL_YN: "N", VER_CNT: "10" }, "ID", "VER_ID", false, true);
    //console.log("versions", versions);
    setVersionOption(versions);
    setValue("versionId", versions[0].value);
  };

  const loadSalesLevel = async () => {
    const salesLevelOptionData = await loadOption(true, "GetLeafSalesLevel", { INDEX: "0" }, "SALES_LV_ID", "SALES_LV_CD", false, true);
    console.log("salesLevelOptionData", salesLevelOptionData);
    setSalesLevelOption(salesLevelOptionData);
    setValue("salesLvId", salesLevelOptionData[0].value);
  };

  const loadItemLevel = async () => {
    const itemLevelOptionData = await loadOption(true, "GetLeafItemLevel", { INDEX: "0" }, "ITEM_LV_ID", "ITEM_LV_CD", false, true);
    //console.log("itemLevelOptionData", itemLevelOptionData);
    setItemLevelOption(itemLevelOptionData);
    setValue("itemLvId", itemLevelOptionData[0].value);
  };

  function loadDataGrid1() {
    //grid1.gridView.showToast(progressSpinner + "Load Data...", true);
    grid1.setData([]);
    grid2.setData([]);
    let param = new URLSearchParams();
    param.append("VER_ID", getValues("versionId"));
    if (getValues("salesLvId") !== "ALL") param.append("SALES_LV_ID", getValues("salesLvId"));
    if (getValues("itemLvId") !== "ALL") param.append("ITEM_LV_ID", getValues("itemLvId"));
    param.append("CROSSTAB", JSON.stringify(grid1.gridView.crossTabInfo));

    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_33_Q1",
      data: param,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          let dataArr = [];
          dataArr = res.data.RESULT_DATA;
          if (!isEmptyArray(dataArr)) {
            grid1.setData(dataArr);

            let salesLvId = dataArr[0].SALES_ID;
            let itemLvId = dataArr[0].ITEM_LV_ID;
            loadDataGrid2(salesLvId, itemLvId);
          }
        }
        //grid1.gridView.hideToast();
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function loadDataGrid2(salesLvId, itemLvId) {
    let param = new URLSearchParams();
    param.append("VER_ID", getValues("versionId"));
    param.append("SALES_LV_ID", salesLvId);
    param.append("ITEM_LV_ID", itemLvId);
    param.append("CROSSTAB", JSON.stringify(grid2.gridView.crossTabInfo));

    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_33_Q2",
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

  const reloadPrefInfo = (viewCd, userName, grid, grpCd, gridCd) => {
    if (grid) grid.loadCrossTabInfoAndPrefInfo(viewCd, grpCd, userName);
  };

  const afterGridCreate1 = (gridObj, gridView, dataProvider) => {
    setGrid1(gridObj);
    setGrid1Options(gridObj);
  };

  const afterGridCreate2 = (gridObj, gridView, dataProvider) => {
    setGrid2(gridObj);
    setGrid2Options(gridObj);
  };

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <InputField type="select" name="versionId" label={transLangKey("VERSION_ID")} control={control} options={versionOption} />
            <InputField type="select" name="salesLvId" label={transLangKey("SALES_NM")} control={control} options={salesLevelOption} />
            <InputField type="select" name="itemLvId" label={transLangKey("ITEM_LV_NM")} control={control} options={itemLevelOption} />
          </SearchRow>
        </SearchArea>
        <ResultArea sizes={[50, 50]} direction={"vertical"}>
          <Box>
            <ButtonArea title={transLangKey("UI_DP_33")}></ButtonArea>
            <Box style={{ height: "calc(100% - 53px" }}>
              <BaseGrid id="grid1" items={grid1Items} viewCd={vom.active} userName={username} gridCd="UI_DP_33-RST_CPT_01" afterGridCreate={afterGridCreate1} />
            </Box>
          </Box>
          <Box>
            <ButtonArea></ButtonArea>
            <Box style={{ height: "calc(100% - 53px" }}>
              <BaseGrid id="grid2" items={grid2Items} viewCd={vom.active} userName={username} gridCd="UI_DP_33-RST_CPT_02" afterGridCreate={afterGridCreate2} />
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
export default PlanCheckItem;
