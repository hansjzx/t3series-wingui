import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box } from "@mui/material";
import { SearchArea, ButtonArea, ResultArea, InputField, BaseGrid, TreeGrid, useViewStore, zAxios, PopupDialog } from "@zionex/wingui-core/src/common/imports";

let popupTreeGrid1Items = [
  { name: "ITEM_LV_CD", dataType: "text", headerText: "ITEM_LV_CD", visible: false, editable: false, width: "200" },
  { name: "PARENT_ITEM_LV_NM", dataType: "text", headerText: "PARENT_ITEM_LV_NM", visible: false, editable: false, width: "100" },
  { name: "ITEM_LV_NM", dataType: "text", headerText: "ITEM_LV_NM", visible: true, editable: false, width: "150" },
  { name: "PARENT_ITEM_LV_CD", dataType: "text", headerText: "PARENT_ITEM_LV_CD", visible: false, editable: false, width: "100" },
  { name: "expanded", dataType: "text", headerText: "expanded", visible: false, editable: false, width: "100" },
  { name: "LV_MGMT_ID", dataType: "text", headerText: "LV_MGMT_ID", visible: false, editable: false, width: "100" },
  { name: "PARENT_ITEM_LV_ID", dataType: "text", headerText: "PARENT_ITEM_LV_ID", visible: false, editable: false, width: "100" },
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: "100" },
  { name: "ATTR_01", dataType: "text", headerText: "ATTR_01", visible: false, editable: false, width: "100" }
];

let popupGrid1Items = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: "200" },
  { name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: "100" },
  { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: "150" },
  { name: "PARENT_ITEM_LV_CD", dataType: "text", headerText: "PARENT_ITEM_LV_CD", visible: false, editable: false, width: "100" },
  { name: "PARENT_ITEM_LV_ID", dataType: "text", headerText: "PARENT_ITEM_LV_ID", visible: false, editable: false, width: "100" },
  { name: "PARENT_ITEM_LV_NM", dataType: "text", headerText: "PARENT_ITEM_LV_NM", visible: false, editable: false, width: "100" },
  { name: "UOM_CD", dataType: "text", headerText: "UOM_CD", visible: false, editable: false, width: "100" },
  { name: "UOM_NM", dataType: "text", headerText: "UOM_NM", visible: true, editable: false, width: "100" },
  { name: "IF_YN", dataType: "text", headerText: "IF_YN", visible: false, editable: false, width: "100" },
  { name: "USE_YN", dataType: "text", headerText: "USE_YN", visible: false, editable: false, width: "100" },
  { name: "STRT_DATE_SALES", dataType: "text", headerText: "STRT_DATE_SALES", visible: true, editable: false, width: "100" },
  { name: "END_DATE_SALES", dataType: "text", headerText: "END_DATE_SALES", visible: true, editable: false, width: "100" }
];

function PopCommItemTree(props) {
  const [gridTree, setGridTree] = useState(null);
  const [grid, setGrid] = useState(null);

  const [option1, setOption1] = useState([]);
  const [selectGrid, setSelectGrid] = useState("");
  const [treeIndex, setTreeIndex] = useState(0);
  const [gridIndex, setGridIndex] = useState(0);

  const [viewData, getViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo]);
  const { handleSubmit, getValues, setValue, control, clearErrors, } = useForm({
    defaultValues: {
      itemCd: props.itemcd,
      itemNm: props.itemNm,
      itemLvCd: props.itemLvCd,
    },
  });

  useEffect(() => {
    setSrchCombo();

    const grdObjPopup = getViewInfo(vom.active, `${props.id}_CommItemTreeGrid`);
    if (grdObjPopup) {
      if (grdObjPopup.dataProvider) {
        if (grid != grdObjPopup) setGrid(grdObjPopup);
      }
    }
    const grdTreeObj = getViewInfo(vom.active, `${props.id}_CommItemTreeGridTree`);
    if (grdTreeObj) {
      if (grdTreeObj.dataProvider) {
        setGridTree(grdTreeObj);
      }
    }
  }, [viewData]);

  useEffect(() => {
    async function initLoad() {
      if (grid) {
        setOptions();
        await popupLoadTreeData();
      }
      if (gridTree) {
        setOptionsTree();
      }
    }
    initLoad();
  }, [grid, gridTree]);

  const setOptionsTree = () => {
    setVisibleProps(gridTree, true, false, false);
    gridTree.gridView.setDisplayOptions({
      fitStyle: "evenFill",
    });

    // click 시 선택
    gridTree.gridView.onCellClicked = function (grid, index, itemIndex) {
      setSelectGrid("treeGrid");
      setTreeIndex(index.itemIndex);
      setTimeout(function () {
        popupLoadData(index.itemIndex);
      }, 200);
    };

    //dobule click 시 선택
    gridTree.gridView.onCellDblClicked = function (clickData, itemIndex) {
      let checkedRows = [];

      checkedRows.push(gridTree.dataProvider.getJsonRow(itemIndex.itemIndex + 1));
      props.confirm(checkedRows);
      props.onClose(false);
    };
  };

  const setOptions = () => {
    setVisibleProps(grid, true, false, true);
    grid.gridView.setDisplayOptions({
      fitStyle: "evenFill",
    });

    //하나의 행만 체크 가능
    if (props.multiple === false) {
      grid.gridView.setCheckBar({
        exclusive: true,
      });
    }

    // click 시 선택
    grid.gridView.onCellClicked = function (grid, index, itemIndex) {
      setSelectGrid("grid");
      setGridIndex(index.itemIndex);
    };

    //dobule click 시 선택
    grid.gridView.onCellDblClicked = function (clickData, itemIndex) {
      let checkedRows = [];

      checkedRows.push(grid.dataProvider.getJsonRow(itemIndex.itemIndex));

      props.confirm(checkedRows);
      props.onClose(false);
    };
  };

  // comboBox init
  function setSrchCombo() {
    let dataArr;
    let rstArr;
    let param = new URLSearchParams();

    param.append("SP_UI_DP_00_CONF_Q1_01", "DP_LV_TP_I");
    param.append("SP_UI_DP_00_CONF_Q1_02", "");
    param.append("SP_UI_DP_00_CONF_Q1_03", "");
    param.append("timeout", 0);
    param.append("CURRENT_OPERATION_CALL_ID", "OPC_SP_UI_DP_00_LV_TP_Q1_INIT_I");

    zAxios({
      method: "post",
      header: { "content-type": "application/json" },
      url: "engine/dp/SRV_GET_SP_UI_DP_00_CONF_Q1",
      data: param,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          dataArr = [];
          rstArr = [];
          dataArr = res.data.RESULT_DATA;

          for (var i = 0, len = dataArr.length; i < len; i++) {
            var row = dataArr[i];
            if (row !== null) {
              var listObj = { value: row.CD, label: transLangKey(row.CD_NM) };
              rstArr.push(listObj);
            }
          }
          setOption1(rstArr);
          setValue("dpLvTp", rstArr[0].value);
        }
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {});
  }

  const onError = (errors, e) => {
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey("WARNING"), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  };

  const popupLoadTreeData = () => {
    grid.gridView.showToast(progressSpinner + "Load Data...", true);

    let param = {
      TREE_PARENT_ID: "PARENT_ITEM_LV_ID",
      TREE_KEY_ID: "ID",
      LV_TP_CD: "I",
      timeout: 0,
      CURRENT_OPERATION_CALL_ID: "OPC_SP_UI_DP_00_LV_CD_Q1_INIT2",
    };
    zAxios({
      method: "post",
      header: { "content-type": "application/json" },
      url: "engine/mp/SRV_UI_IM_00_POPUP_ITEM_TREE_Q2",
      params: param,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          const resData = res.data.RESULT_DATA;
          let responseData = { items: resData };
          gridTree.dataProvider.setObjectRows(responseData, "items", "", "");
          popupLoadData(0);
        }
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
        grid.gridView.hideToast();
      });
  };

  const popupLoadData = (idx) => {
    grid.gridView.showToast(progressSpinner + "Load Data...", true);
    let param = {
      LV_TP_CD: getValues("dpLvTp"),
      timeout: 0,
      ITEM_CD: getValues("itemCd"),
      ITEM_NM: getValues("itemNm"),
      ITEM_LV: gridTree.gridView.getValue(idx, "ITEM_LV_CD"),
      CURRENT_OPERATION_CALL_ID: "select_tree_item",
    };
    zAxios({
      fromPopup: true,
      method: "post",
      header: { "content-type": "application/json" },
      url: "engine/mp/SRV_GET_SP_UI_IM_00_ITEM_TREE_LV_DATA_Q1",
      params: param,
    })
      .then(function (res) {
        grid.dataProvider.fillJsonData(res.data.RESULT_DATA);
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
        grid.gridView.hideToast();
      });
  };

  // popup 확인
  const saveSubmit = () => {
    if (selectGrid == "grid") {
      grid.gridView.commit(true);
      let checkedRows = [];

      if (grid.gridView.getCheckedRows().length == 0) {
        checkedRows.push(grid.dataProvider.getJsonRow(gridIndex));
        props.confirm(checkedRows);
        props.onClose(false);
      } else {
        grid.gridView.getCheckedRows().forEach(function (index) {
          checkedRows.push(grid.dataProvider.getJsonRow(index));
        });
        props.confirm(checkedRows);
        props.onClose(false);
      }
    } else {
      gridTree.gridView.commit(true);
      let checkedRows = [];

      checkedRows.push(gridTree.dataProvider.getJsonRow(treeIndex + 1));
      props.confirm(checkedRows);
      props.onClose(false);
    }
  };

  // popup 조회 클릭시 조회
  const onPopupSubmit = (data) => {
    popupLoadTreeData(data);
  };

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="COMM_SRH_POP_ITEM" resizeHeight={1000} resizeWidth={1200}>
      <SearchArea displaySize="small" submit={handleSubmit(onPopupSubmit, onError)} expandButton={false} searchButton={true}>
        <InputField name="itemLv" label={transLangKey("ITEM_LV")} control={control} readonly={false} disabled={false} displaySize="small" />
        <InputField name="itemCd" label={transLangKey("ITEM_CD")} readonly={false} disabled={false} control={control} displaySize="small" />
        <InputField name="itemNm" label={transLangKey("ITEM_NM")} control={control} readonly={false} disabled={false} displaySize="small" />
      </SearchArea>
      <ResultArea sizes={[30, 70]} direction={"horizontal"}>
        <Box style={{ width: "100%" }}>
          <Box style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <ButtonArea>
              <InputField type="select" name="dpLvTp" control={control} readonly={false} disabled={false} options={option1} />
            </ButtonArea>
            <Box style={{ flex: "auto" }}>
              <TreeGrid id={`${props.id}_CommItemTreeGridTree`} items={popupTreeGrid1Items}></TreeGrid>
            </Box>
          </Box>
        </Box>
        <Box style={{ width: "100%" }}>
          <BaseGrid id={`${props.id}_CommItemTreeGrid`} items={popupGrid1Items}></BaseGrid>
        </Box>
      </ResultArea>
    </PopupDialog>
  );
}

export default PopCommItemTree;
