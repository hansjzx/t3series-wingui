import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { ButtonGroup } from "@mui/material";
import { baseURI, showMessage, transLangKey, vom, containsObject } from "@wingui";
import { InputField, ContentInner, ResultArea, SearchArea, StatusArea, ButtonArea, RightButtonArea, GridAddRowButton, GridDeleteRowButton, GridSaveButton, BaseGrid, GridCnt, useViewStore, useUserStore, zAxios } from "@zionex/wingui-core/src/common/imports";
import PopSelectItem from "@wingui/view/common/PopSelectItem";
import PopSelectAccount from "@wingui/view/common/PopSelectAccount";
import { newRowEditCellStyle, saveJson } from "@wingui/view/demandplan/DpUtil";
import ItemSearchBox from "@wingui/view/demandplan/common/ItemSearchBox";
import AccountSearchBox from "@wingui/view/demandplan/common/AccountSearchBox";

let grid1Items = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: 100, textAlignment: "center" },
  { name: "ITEM_ID", dataType: "text", headerText: "ITEM_ID", visible: false, editable: false, width: 100, textAlignment: "center" },
  { name: "ACCOUNT_ID", dataType: "text", headerText: "ACCOUNT_ID", visible: false, editable: false, width: 100, textAlignment: "center" },
  { name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: 100, textAlignment: "center", button: "action", styleCallback: newRowEditCellStyle },
  { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: 100, textAlignment: "center" },
  { name: "ACCOUNT_CD", dataType: "text", headerText: "ACCOUNT_CD", visible: true, editable: false, width: 100, textAlignment: "center", button: "action", styleCallback: newRowEditCellStyle },
  { name: "ACCOUNT_NM", dataType: "text", headerText: "ACCOUNT_NM", visible: true, editable: false, width: 100, textAlignment: "center" },
  { name: "DIM_VALUE", dataType: "number", headerText: "DIM_VALUE", visible: true, editable: true, width: 100, textAlignment: "center" },
  { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: 80, textAlignment: "center" },
  { name: "CREATE_DTTM", dataType: "datetime", format: "yyyy-MM-dd", headerText: "CREATE_DTTM", visible: true, editable: false, width: 80, textAlignment: "center" },
  { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 80, textAlignment: "center" },
  { name: "MODIFY_DTTM", dataType: "datetime", format: "yyyy-MM-dd", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 80, textAlignment: "center" },
];
let defaultDim;
function DimData() {
  const [username, displayName] = useUserStore((state) => [state.username, state.displayName]);
  const [message, setMessage] = useState();
  const itemSearchBoxRef = useRef();
  const [currentItemRef, setCurrentItemRef] = useState();
  const accountSearchBoxRef = useRef();
  const [currentAccountRef, setCurrentAccountRef] = useState();

  const [grid1, setGrid1] = useState(null);

  const [gridItemPopupOpen, setGridItemPopupOpen] = useState(false);
  const [gridAccountPopupOpen, setGridAccountPopupOpen] = useState(false);

  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [dims, setdims] = useState([]);

  const globalButtons = [
    {
      name: "search",
      action: () => {
        loadGridData();
      },
      visible: true,
      disable: false,
    },
    {
      name: "save",
      action: () => {
        saveJson(grid1, "SP_UI_DP_16_S1_J", loadGridData);
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
  ];

  useEffect(() => {
    zAxios({
      method: "post",
      headers: { "content-type": "application/json" },
      url: "engine/dp/SRV_GET_SP_UI_DP_16_DIM_Q1",
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          const rComboListData = res.data.RESULT_DATA;
          let array = [];
          for (let i = 0, len = rComboListData.length; i < len; i++) {
            let row = rComboListData[i];

            if (row !== null) {
              let listItemObj = { value: row["DIM_COL"], label: row["DIM_COL"] };
              if (!containsObject(listItemObj, array)) {
                array.push({ value: row["DIM_COL"], label: row["DIM_COL"] });
              }
            }
          }
          setdims(array);
          defaultDim = array[0].value;
          setValue("dim", defaultDim);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }, []);

  const { reset, control, getValues, setValue } = useForm({
    defaultValues: {
      dim: "",
      itemCd: "",
      itemNm: "",
      accountCd: "",
      accountNm: "",
    },
  });

  function refresh() {
    reset();
    setValue("dim", defaultDim);
    grid1.dataProvider.clearRows();
    currentItemRef.reset();
    currentAccountRef.reset();
  }

  const onDelete = (targetGrid, deleteRows) => {
    let formData = new FormData();
    formData.append("DIM", getValues("dim"));
    formData.append("changes", JSON.stringify(deleteRows));
    formData.append("USER_ID", username);

    if (deleteRows.length > 0) {
      return zAxios({
        method: "post",
        url: baseURI() + "engine/dp/SRV_SET_SP_UI_DP_16_D1",
        headers: { "content-type": "application/json" },
        data: formData,
      })
        .then((response) => {
          if (response.status === gHttpStatus.SUCCESS) {
            const rsData = response.data;
            if (rsData.RESULT_SUCCESS) {
              const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_16_D1_P_RT_MSG"];
              resultMSG === "MSG_0002" ? loadGridData() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
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

  const loadGridData = () => {
    let param = new URLSearchParams();
    param.append("DIM", getValues("dim"));
    param.append("ITEM_CD", currentItemRef.getItemCode());
    param.append("ITEM_NM", currentItemRef.getItemName());
    param.append("ACCT_CD", currentAccountRef.getAccountCode());
    param.append("ACCT_NM", currentAccountRef.getAccountName());

    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_SP_UI_DP_16_Q1",
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
  };

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, "grid1");
    if (grdObj1 && grdObj1.dataProvider) {
      grid1 !== grdObj1 && setGrid1(grdObj1);
    }
    if (itemSearchBoxRef) {
      if (itemSearchBoxRef.current) {
        setCurrentItemRef(itemSearchBoxRef.current);
      }
    }
    if (accountSearchBoxRef) {
      if (accountSearchBoxRef.current) {
        setCurrentAccountRef(accountSearchBoxRef.current);
      }
    }
  }, [viewData]);

  useEffect(() => {
    if (grid1) {
      setViewInfo(vom.active, "globalButtons", globalButtons);
      setGridOption();
    }
  }, [grid1]);

  const setGridItemCd = (records) => {
    let itemIndex = grid1.gridView.getCurrent().dataRow;
    grid1.dataProvider.setValue(itemIndex, "ITEM_CD", records[0].ITEM_CD);
    grid1.dataProvider.setValue(itemIndex, "ITEM_NM", records[0].ITEM_NM);
    grid1.dataProvider.setValue(itemIndex, "ITEM_ID", records[0].ID);
    grid1.gridView.setCurrent({ itemIndex: itemIndex });
    grid1.gridView.commit(true);
  };

  const setGridAccountCd = (records) => {
    let itemIndex = grid1.gridView.getCurrent().dataRow;
    grid1.dataProvider.setValue(itemIndex, "ACCOUNT_CD", records[0].ACCOUNT_CD);
    grid1.dataProvider.setValue(itemIndex, "ACCOUNT_NM", records[0].ACCOUNT_NM);
    grid1.dataProvider.setValue(itemIndex, "ACCOUNT_ID", records[0].ID);
    grid1.gridView.setCurrent({ itemIndex: itemIndex });
    grid1.gridView.commit(true);
  };

  const setGridOption = () => {
    grid1.gridView.setEditOptions({
      insertable: true,
      appendable: true,
    });
    grid1.gridView.displayOptions.fitStyle = "fill";
    setVisibleProps(grid1, true, true, true);
    grid1.gridView.setColumnProperty("ACCOUNT_CD", "buttonVisibility", "always");
    grid1.gridView.setColumnProperty("ITEM_CD", "buttonVisibility", "always");
    grid1.gridView.onCellButtonClicked = (grid, itemIndex, column) => {
      let state = grid1.dataProvider.getRowState(itemIndex.dataRow);
      if (column.fieldName === "ACCOUNT_CD" && state === "created") {
        setGridAccountPopupOpen(true);
      }
      if (column.fieldName === "ITEM_CD" && state === "created") {
        setGridItemPopupOpen(true);
      }
    };
  };

  return (
    <>
      <ContentInner>
        <SearchArea>
          <InputField name="dim" label={"Dimension"} type="select" control={control} options={dims} />
          <ItemSearchBox ref={itemSearchBoxRef} keyValue={"itemName"} placeHolder={transLangKey("ITEM_NM")} />
          <AccountSearchBox ref={accountSearchBoxRef} keyValue={"accountName"} placeHolder={transLangKey("ACCOUNT_NM")} />
        </SearchArea>
        <ButtonArea>
          <RightButtonArea>
            <ButtonGroup>
              <GridAddRowButton grid="grid1" type="icon" />
              <GridDeleteRowButton grid="grid1" type="icon" onDelete={onDelete} onAfterDelete={loadGridData} />
              <GridSaveButton
                grid="grid1"
                type="icon"
                onClick={() => {
                  saveJson(grid1, "SP_UI_DP_16_S1_J", loadGridData, { P_DIM: getValues("dim") });
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
      {gridItemPopupOpen && <PopSelectItem open={gridItemPopupOpen} onClose={() => setGridItemPopupOpen(false)} confirm={setGridItemCd} multiple={false} />}
      {gridAccountPopupOpen && <PopSelectAccount open={gridAccountPopupOpen} onClose={() => setGridAccountPopupOpen(false)} confirm={setGridAccountCd} multiple={false} />}
    </>
  );
}

export default DimData;
