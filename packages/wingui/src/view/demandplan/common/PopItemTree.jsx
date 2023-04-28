import React, { useState, useEffect, useContext, useRef } from "react";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { Box } from "@mui/material";

import PopupDialog from "@zionex/wingui-core/src/component/PopupDialog";
import TreeGrid from "@zionex/wingui-core/src/component/grid/TreeGrid";
import { ResultArea, SearchArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow, CommonButton, InputField, BaseGrid, useViewStore, useStyles, zAxios } from "@zionex/wingui-core/src/common/imports";
import { nvl, isEmptyArray } from "@wingui/view/demandplan/DpUtil";

let popupTreeGrid1Items = [
  { name: "ITEM_LV_CD", dataType: "text", headerText: "ITEM_LV_CD", visible: false, editable: false, width: "200" },
  { name: "PARENT_ITEM_LV_NM", dataType: "text", headerText: "PARENT_ITEM_LV_NM", visible: false, editable: false, width: "100", textAlignment: "center" },
  { name: "ITEM_LV_NM", dataType: "text", headerText: "ITEM_LV_NM", visible: true, editable: false, width: "150", textAlignment: "center" },
  { name: "PARENT_ITEM_LV_CD", dataType: "text", headerText: "PARENT_ITEM_LV_CD", visible: false, editable: false, width: "100" },
  { name: "expanded", dataType: "text", headerText: "expanded", visible: false, editable: false, width: "100" },
  { name: "LV_MGMT_ID", dataType: "text", headerText: "LV_MGMT_ID", visible: false, editable: false, width: "100" },
  { name: "PARENT_ITEM_LV_ID", dataType: "text", headerText: "PARENT_ITEM_LV_ID", visible: false, editable: false, width: "100" },
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: "100" },
  { name: "ATTR_01", dataType: "text", headerText: "ATTR_01", visible: false, editable: false, width: "100" },
];

let popupGrid1Items = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: "200" },
  { name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: "100", textAlignment: "center" },
  { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: "150", textAlignment: "center" },
  { name: "PARENT_ITEM_LV_CD", dataType: "text", headerText: "PARENT_ITEM_LV_CD", visible: false, editable: false, width: "100" },
  { name: "PARENT_ITEM_LV_ID", dataType: "text", headerText: "PARENT_ITEM_LV_ID", visible: false, editable: false, width: "100" },
  { name: "PARENT_ITEM_LV_NM", dataType: "text", headerText: "PARENT_ITEM_LV_NM", visible: false, editable: false, width: "100" },
  { name: "UOM_CD", dataType: "text", headerText: "UOM_CD", visible: false, editable: false, width: "100" },
  { name: "UOM_NM", dataType: "text", headerText: "UOM_NM", visible: true, editable: false, width: "100", textAlignment: "center" },
  { name: "IF_YN", dataType: "text", headerText: "IF_YN", visible: false, editable: false, width: "100" },
  { name: "USE_YN", dataType: "text", headerText: "USE_YN", visible: false, editable: false, width: "100" },
  { name: "STRT_DATE_SALES", dataType: "text", headerText: "STRT_DATE_SALES", visible: true, editable: false, width: "100", textAlignment: "center", format: "yyyy-MM-dd" },
  { name: "END_DATE_SALES", dataType: "text", headerText: "END_DATE_SALES", visible: true, editable: false, width: "100", textAlignment: "center", format: "yyyy-MM-dd" },
];

function PopItemTree(props) {
  const refPopupGrid1 = useRef({});
  const popOpenCnt = useRef(0);
  const [gridTree, setGridTree] = useState(null);
  const [grid, setGrid] = useState(null);

  const [option1, setOption1] = useState([]);

  const [viewData, getViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo]);
  const {
    handleSubmit,
    getValues,
    setValue,
    control,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: {
      itemCd: props.itemcd,
      itemNm: props.itemNm,
      itemLvCd: props.itemLvCd,
    },
  });

  useEffect(() => {
    const grdObjPopup = getViewInfo(vom.active, `${props.id}_DPItemGrid`);
    if (grdObjPopup) {
      if (grdObjPopup.dataProvider) {
        if (grid != grdObjPopup) setGrid(grdObjPopup);
      }
    }
    const grdTreeObj = getViewInfo(vom.active, `${props.id}_DPItemGridTree`);
    if (grdTreeObj) {
      if (grdTreeObj.dataProvider) {
        setGridTree(grdTreeObj);
      }
    }
  }, [viewData]);

  useEffect(() => {
    console.log("PopItemTree useEffect viewData in....");
    setSrchCombo();
  }, []);

  useEffect(() => {
    if (grid) {
      setOptions();
      popupLoadTreeData();
    }
    if (gridTree) {
      setOptionsTree();
    }
  }, [grid, gridTree]);

  const setOptionsTree = () => {
    setVisibleProps(gridTree, true, false, false);
    gridTree.gridView.setFooters([{ visible: false }]);

    gridTree.gridView.setDisplayOptions({
      fitStyle: "evenFill",
    });

    if (props.multiple === false) {
      grid.gridView.setCheckBar({
        exclusive: true,
      });
    }

    // gridTree.gridView.onCellClicked = function (grid, index, itemIndex) {
    //   popupLoadData(index.itemIndex);
    // };
    gridTree.gridView.onCurrentRowChanged = function (grid, oldRow, newRow) {
      popupLoadData(newRow);
    };

    gridTree.gridView.onCellDblClicked = function (grid, clickData) {
      saveTreeSubmit();
    };
    gridTree.gridView.orderBy(["ITEM_LV_NM"], ["ascending"]);
  };

  const saveTreeSubmit = () => {
    let focusCell = gridTree.gridView.getCurrent();
    let targetRow = focusCell.dataRow;
    props.confirm(gridTree.dataProvider.getJsonRow(targetRow));
    props.onClose(false);
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

    //dobule click 시 선택
    grid.gridView.onCellDblClicked = function (grid, clickData) {
      saveSubmit();
    };
  };

  // comboBox init
  function setSrchCombo() {
    console.log("PopItemTree setSrchCombo in....");
    let dataArr;
    let rstArr;
    let param = new URLSearchParams();

    param.append("SP_UI_DP_00_CONF_Q1_01", "DP_LV_TP_I");
    param.append("SP_UI_DP_00_CONF_Q1_02", "");
    param.append("SP_UI_DP_00_CONF_Q1_03", "");
    param.append("timeout", 0);

    zAxios({
      fromPopup: true,
      method: "post",
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
    let param = new URLSearchParams();
    param.append("TREE_PARENT_ID", "PARENT_ITEM_LV_ID");
    param.append("TREE_KEY_ID", "ID");
    param.append("LV_TP_CD", "I");
    param.append("EMP_NO", props.empNo);
    param.append("AUTH_TP_ID", props.authTpId);

    zAxios({
      fromPopup: true,
      method: "post",
      url: "engine/dp/SRV_UI_DP_00_POPUP_ITEM_TREE_Q2",
      data: param,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          const resData = res.data.RESULT_DATA;
          let responseData = { items: resData };
          gridTree.dataProvider.setObjectRows(responseData, "items", "", "");
          gridTree.gridView.expandAll();
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const popupLoadData = (idx) => {
    let itemLv = gridTree.dataProvider.getValue(idx, "ITEM_LV_CD");

    let param = new URLSearchParams();
    param.append("LV_TP_CD", nvl(getValues("dpLvTp")));
    param.append("ITEM_CD", nvl(getValues("itemCd")));
    param.append("ITEM_NM", nvl(getValues("itemNm")));
    param.append("ITEM_LV", itemLv ? itemLv : "");
    param.append("EMP_NO", props.empNo);
    param.append("AUTH_TP_ID", props.authTpId);

    zAxios({
      fromPopup: true,
      method: "post",
      url: "engine/dp/SRV_GET_SP_UI_DP_00_ITEM_TREE_LV_DATA_Q1",
      data: param,
    })
      .then(function (res) {
        let resultData = res.data.RESULT_DATA;
        if (resultData && resultData.length == 0) {
          showMessage(transLangKey("WARNING"), transLangKey("MSG_NO_DATA"), { close: false });
        }
        grid.dataProvider.fillJsonData(res.data.RESULT_DATA);
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  // popup 확인
  const saveSubmit = () => {
    let focusCell = grid.gridView.getCurrent();
    let targetRow = focusCell.dataRow;
    props.confirm(grid.dataProvider.getJsonRow(targetRow));
    props.onClose(false);
  };

  // popup 조회 클릭시 조회
  const onPopupSubmit = (data) => {
    let itemLvName = getValues("itemLv");
    let index;

    if (itemLvName) {
      let searchOptions = {
        fields: ["ITEM_LV_NM"],
        values: [itemLvName],
        startIndex: 0,
        startFieldIndex: 0,
        wrap: true,
        caseSensitive: false,
        partialMatch: true,
      };

      index = gridTree.gridView.searchItem(searchOptions);
      if (index >= 0) {
        gridTree.gridView.setCurrent(index);
        popupLoadData(index);
        return;
      }
    }

    index = gridTree.gridView.getCurrent();
    let idx = 0;
    if (index && index.itemIndex >= 0) idx = index.itemIndex;

    popupLoadData(idx);
  };

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="COMM_SRH_POP_ITEM" resizeHeight={800} resizeWidth={1000}>
      <SearchArea displaySize="small" submit={handleSubmit(onPopupSubmit, onError)} expandBtn={false} searchBtn={true}>
        <InputField name="itemLv" label={transLangKey("ITEM_LV")} control={control} readonly={false} disabled={false} displaySize="small" />
        <InputField name="itemCd" label={transLangKey("ITEM_CD")} readonly={false} disabled={false} control={control} displaySize="small" />
        <InputField name="itemNm" label={transLangKey("ITEM_NM")} control={control} readonly={false} disabled={false} displaySize="small" />
        <CommonButton title={transLangKey("SEARCH")} onClick={() => onPopupSubmit()}>
          <Icon.Search />
        </CommonButton>
      </SearchArea>
      <ResultArea sizes={[30, 70]} direction={"horizontal"}>
        <Box style={{ width: "100%" }}>
          <Box style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <ButtonArea>
              <InputField type="select" name="dpLvTp" control={control} readonly={false} disabled={false} options={option1} />
            </ButtonArea>
            <Box style={{ flex: "auto" }}>
              <TreeGrid id={`${props.id}_DPItemGridTree`} items={popupTreeGrid1Items}></TreeGrid>
            </Box>
          </Box>
        </Box>
        <Box style={{ width: "100%" }}>
          <BaseGrid id={`${props.id}_DPItemGrid`} items={popupGrid1Items} ref={refPopupGrid1}></BaseGrid>
        </Box>
      </ResultArea>
    </PopupDialog>
  );
}

PopItemTree.propTypes = {
  itemCd: PropTypes.string,
  itemNm: PropTypes.string,
  itemLvCd: PropTypes.string,
};

PopItemTree.displayName = "PopItemTree";

export default PopItemTree;
