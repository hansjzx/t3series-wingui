import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Box } from "@mui/material";
import PropTypes from "prop-types";
import PopupDialog from "@zionex/wingui-core/src/component/PopupDialog";
import TreeGrid from "@zionex/wingui-core/src/component/grid/TreeGrid";
import { ResultArea, SearchArea, ButtonArea, CommonButton, InputField, BaseGrid, useViewStore, zAxios } from "@zionex/wingui-core/src/common/imports";
import { transLangKey } from "@wingui";
import { nvl } from "@wingui/view/demandplan/DpUtil";

let popupTreeGrid1Items = [
  { name: "CURCY_CD_ID", dataType: "text", headerText: "CURCY_CD_ID", visible: false, editable: false, width: "200" },
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: "100", textAlignment: "center" },
  { name: "LV_MGMT_ID", dataType: "text", headerText: "LV_MGMT_ID", visible: false, editable: false, width: "100" },
  { name: "PARENT_SALES_LV_CD", dataType: "text", headerText: "PARENT_SALES_LV_CD", visible: false, editable: false, width: "100" },
  { name: "PARENT_SALES_LV_ID", dataType: "text", headerText: "PARENT_SALES_LV_ID", visible: false, editable: false, width: "100" },
  { name: "PARENT_SALES_LV_NM", dataType: "text", headerText: "PARENT_SALES_LV_NM", visible: false, editable: false, width: "100" },
  { name: "SALES_LV_CD", dataType: "text", headerText: "SALES_LV_CD", visible: false, editable: false, width: "100" },
  { name: "SALES_LV_NM", dataType: "text", headerText: "SALES_LV_NM", visible: true, editable: false, width: "150", textAlignment: "center" },
  { name: "SEQ", dataType: "text", headerText: "SEQ", visible: false, editable: false, width: "100" },
  { name: "SRP_YN", dataType: "text", headerText: "SRP_YN", visible: false, editable: false, width: "100" },
  { name: "expanded", dataType: "text", headerText: "expanded", visible: false, editable: false, width: "100" },
];

let popupGrid1Items = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: "200", textAlignment: "center" },
  { name: "ACCOUNT_CD", dataType: "text", headerText: "ACCOUNT_CD", visible: true, editable: false, width: "100", textAlignment: "center" },
  { name: "ACCOUNT_NM", dataType: "text", headerText: "ACCOUNT_NM", visible: true, editable: false, width: "100", textAlignment: "center" },
  { name: "PARENT_SALES_LV_CD", dataType: "text", headerText: "PARENT_SALES_LV_CD", visible: false, editable: false, width: "120", textAlignment: "center" },
  { name: "PARENT_SALES_LV_NM", dataType: "text", headerText: "PARENT_SALES_LV", visible: true, editable: false, width: "120", textAlignment: "center" },
  { name: "CURCY_CD", dataType: "text", headerText: "CURCY_CD_ID", visible: true, editable: false, width: "100", textAlignment: "center" },
  { name: "COUNTRY_NM", dataType: "text", headerText: "COUNTRY_ID", visible: true, editable: false, width: "100", textAlignment: "center" },
  { name: "CHANNEL_NM", dataType: "text", headerText: "CHANNEL_ID", visible: true, editable: false, width: "100", textAlignment: "center" },
  { name: "SOLD_TO_ID", dataType: "text", headerText: "SOLD_TO_ID", visible: false, editable: false, width: "100", textAlignment: "center" },
  { name: "SOLD_TO_CD", dataType: "text", headerText: "SOLD_TO_CD", visible: false, editable: false, width: "100", textAlignment: "center" },
  { name: "SOLD_TO_NM", dataType: "text", headerText: "SOLD_TO_NM", visible: false, editable: false, width: "100", textAlignment: "center" },
  { name: "SHIP_TO_ID", dataType: "text", headerText: "SHIP_TO_ID", visible: false, editable: false, width: "100", textAlignment: "center" },
  { name: "SHIP_TO_CD", dataType: "text", headerText: "SHIP_TO_CD", visible: false, editable: false, width: "100", textAlignment: "center" },
  { name: "SHIP_TO_NM", dataType: "text", headerText: "SHIP_TO_NM", visible: false, editable: false, width: "100", textAlignment: "center" },
  { name: "BILL_TO_ID", dataType: "text", headerText: "BILL_TO_ID", visible: false, editable: false, width: "100", textAlignment: "center" },
  { name: "BILL_TO_CD", dataType: "text", headerText: "BILL_TO_CD", visible: false, editable: false, width: "100", textAlignment: "center" },
  { name: "BILL_TO_NM", dataType: "text", headerText: "BILL_TO_NM", visible: false, editable: false, width: "100", textAlignment: "center" },
];

function PopAccountTree(props) {
  const refPopupGrid1 = useRef({});
  const [gridTree, setGridTree] = useState(null);
  const [grid, setGrid] = useState(null);

  const [option1, setOption1] = useState([]);

  const [viewData, getViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo]);
  const {
    handleSubmit,
    getValues,
    setValue,
    control,
    formState: { },
    clearErrors,
  } = useForm({
    defaultValues: {
      SALES_LV: props.SALES_LV,
      ACCOUNT_CD: props.ACCOUNT_CD,
      ACCOUNT_NM: props.ACCOUNT_NM,
    },
  });

  useEffect(() => {
    const grdObjPopup = getViewInfo(vom.active, `${props.id}_AccountGrid`);
    if (grdObjPopup) {
      if (grdObjPopup.dataProvider) {
        if (grid !== grdObjPopup) setGrid(grdObjPopup);
      }
    }
    const grdTreeObj = getViewInfo(vom.active, `${props.id}_AccountGridTree`);
    if (grdTreeObj) {
      if (grdTreeObj.dataProvider) {
        setGridTree(grdTreeObj);
      }
    }
  }, [viewData]);

  useEffect(() => {
    console.log("PopAccountTree useEffect[] in...");
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

    gridTree.gridView.onCellClicked = (grid, index) => {
      popupLoadData(index.itemIndex);
    };

    gridTree.gridView.onCellDblClicked = () => {//grid, clickData
      saveTreeSubmit();
    };

    gridTree.gridView.orderBy(["SALES_LV_NM"], ["ascending"]);
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
      fitStyle: "fill",
    });

    //하나의 행만 체크 가능
    if (props.multiple === false) {
      grid.gridView.setCheckBar({
        exclusive: true,
      });
    }

    //dobule click 시 선택
    grid.gridView.onCellDblClicked = () => {  //grid, clickData
      saveSubmit();
    };
  };

  // comboBox init
  function setSrchCombo() {
    console.log("PopAccountTree setSrchCombo in...");
    let dataArr;
    let rstArr;
    let param = new URLSearchParams();
    param.append("SP_UI_DP_00_CONF_Q1_01", "DP_LV_TP_S");
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
          setValue("LV_TP_CD", rstArr[0].value);
        }
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {});
  }

  const onError = (errors) => {
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey("WARNING"), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  };

  const popupLoadTreeData = () => {
    // let data = getValues();

    let lvTpCd = getValues("LV_TP_CD");
    if (lvTpCd == null) {
      lvTpCd = "S";
    }

    let param = new URLSearchParams();
    param.append("TREE_PARENT_ID", "PARENT_SALES_LV_ID");
    param.append("TREE_KEY_ID", "ID");
    param.append("LV_TP_CD", lvTpCd);
    param.append("EMP_NO", props.empNo);
    param.append("AUTH_TP_ID", props.authTpId);

    zAxios({
      fromPopup: true,
      method: "post",
      url: "engine/dp/SRV_UI_DP_00_POPUP_ACC_TREE_Q2",
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
    let param = new URLSearchParams();
    param.append("ACCT_LV", gridTree.gridView.getValue(idx, "SALES_LV_CD"));
    param.append("ACCT_CD", nvl(getValues("ACCOUNT_CD")));
    param.append("ACCT_NM", nvl(getValues("ACCOUNT_NM")));
    param.append("LV_TP_CD", nvl(getValues("LV_TP_CD")));
    param.append("EMP_NO", props.empNo);
    param.append("AUTH_TP_ID", props.authTpId);

    zAxios({
      fromPopup: true,
      method: "post",
      url: "engine/dp/SRV_UI_DP_00_POPUP_ACC_TREE_Q1",
      data: param,
    })
      .then(function (res) {
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
  const onPopupSubmit = () => {
    let salesLvName = getValues("SALES_LV");
    //find index from itemLvName 'ITEM_LV_CD'
    let index;

    if (salesLvName) {
      let searchOptions = {
        fields: ["SALES_LV_NM"],
        values: [salesLvName],
        startIndex: 0,
        startFieldIndex: 0,
        wrap: true,
        caseSensitive: false,
        partialMatch: true,
      };

      index = gridTree.gridView.searchItem(searchOptions);
      if (index) {
        gridTree.gridView.setCurrent(index);
        popupLoadData(index);
        return;
      }
    }
    index = gridTree.gridView.getCurrent();
    if (index && index.itemIndex >= 0) {
      popupLoadData(index.itemIndex);
    } else popupLoadData(0);
  };
  PopAccountTree;
  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="ACCOUNT_POP" resizeHeight={800} resizeWidth={1000}>
      <SearchArea displaySize="small" expandBtn={false} searchBtn={true}>
        <InputField name="SALES_LV" label={transLangKey("SALES_LV")} control={control} readonly={false} disabled={false} displaySize="small" />
        <InputField name="ACCOUNT_CD" label={transLangKey("ACCOUNT_CD")} readonly={false} disabled={false} control={control} displaySize="small" />
        <InputField name="ACCOUNT_NM" label={transLangKey("ACCOUNT_NM")} control={control} readonly={false} disabled={false} displaySize="small" />
        <CommonButton title={transLangKey("SEARCH")} onClick={() => onPopupSubmit()}>
          <Icon.Search />
        </CommonButton>
      </SearchArea>
      <ResultArea sizes={[30, 70]} direction={"horizontal"}>
        <Box style={{ width: "100%" }}>
          <Box style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <ButtonArea>
              <InputField type="select" name="LV_TP_CD" control={control} readonly={false} disabled={false} options={option1} />
            </ButtonArea>
            <Box style={{ flex: "auto" }}>
              <TreeGrid id={`${props.id}_AccountGridTree`} items={popupTreeGrid1Items}/>
            </Box>
          </Box>
        </Box>
        <Box style={{ width: "100%" }}>
          <BaseGrid id={`${props.id}_AccountGrid`} items={popupGrid1Items} ref={refPopupGrid1}/>
        </Box>
      </ResultArea>
    </PopupDialog>
  );
}

PopAccountTree.propTypes = {
  itemCd: PropTypes.string,
  itemNm: PropTypes.string,
  itemLvCd: PropTypes.string,
};

PopAccountTree.displayName = "PopAccountTree";

export default PopAccountTree;
