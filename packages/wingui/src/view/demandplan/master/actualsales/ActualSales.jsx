import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { ButtonGroup } from "@mui/material";
import { ContentInner, ResultArea, SearchArea, StatusArea, ButtonArea, RightButtonArea, InputField, GridAddRowButton, GridDeleteRowButton, GridSaveButton, BaseGrid, GridCnt, useViewStore, useUserStore, zAxios } from "@zionex/wingui-core/src/common/imports";
import { baseURI, gridComboLoad, showMessage, transLangKey } from "@wingui";
import PopPersonalize from "@wingui/view/common/PopPersonalize";
import PopSelectItem from "@wingui/view/common/PopSelectItem";
import PopSelectAccount from "@wingui/view/common/PopSelectAccount";
import { loadOption, isEmptyArray, saveJson } from "@wingui/view/demandplan/DpUtil";
import ItemSearchBox from "@wingui/view/demandplan/common/ItemSearchBox";
import AccountSearchBox from "@wingui/view/demandplan/common/AccountSearchBox";

const isGridButtonVisible = (grid, index) => {
  return grid._dataProvider.getRowState(index.itemIndex) === "created";
};

const salesGridItems = [
  { name: "ACCOUNT_CD", dataType: "text", headerText: "ACCOUNT_CD", visible: true, editable: false, width: "70", validRules: [{ criteria: "required" }], button: "action", editableNew: true, buttonVisibleCallback: isGridButtonVisible },
  { name: "ACCOUNT_NM", dataType: "text", headerText: "ACCOUNT_NM", visible: true, editable: false, width: "80" },
  { name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: "70", validRules: [{ criteria: "required" }], button: "action", editableNew: true, buttonVisibleCallback: isGridButtonVisible },
  { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: "80" },
  { name: "BASE_DATE", dataType: "datetime", headerText: "BASE_DATE", visible: true, editable: false, width: "80", format: "yyyy-MM-dd", editableNew: true },
  { name: "SO_STATUS_CD", dataType: "dropdown", headerText: "SO_STATUS", visible: true, editable: false, width: "100", textAlignment: "center", useDropdown: true, lookupDisplay: true, editableNew: true },
  { name: "QTY", dataType: "number", headerText: "QTY", visible: true, editable: true, width: "100" },
  { name: "AMT", dataType: "number", headerText: "AMT", visible: true, editable: true, width: "100" },
];

function ActualSales() {
  const itemSearchBoxRef = useRef();
  const [currentItemRef, setCurrentItemRef] = useState();
  const accountSearchBoxRef = useRef();
  const [currentAccountRef, setCurrentAccountRef] = useState();
  const [username] = useUserStore((state) => [state.username]);
  const [message, setMessage] = useState();

  const [grid, setGrid] = useState(null);
  const [itemPopupOpen, setItemPopupOpen] = useState(false);
  const [accountPopupOpen, setAccountPopupOpen] = useState(false);
  const [gridItemPopupOpen, setGridItemPopupOpen] = useState(false);
  const [gridAccountPopupOpen, setGridAccountPopupOpen] = useState(false);
  const [setViewInfo] = useViewStore((state) => [state.setViewInfo]);
  const [soStatusOption, setSoStatusOption] = useState([]);
  const [personalizeOpen, setPersonalizeOpen] = useState(false);

  const { reset, control, getValues, setValue } = useForm({
    defaultValues: {
      dateRange: [new Date(new Date().setMonth(new Date().getMonth() - 1)), new Date()],
      itemCd: "",
      itemNm: "",
      accountCd: "",
      accountNm: "",
      soStatusId: "ALL",
      dpPlanYn: "Y",
    },
  });

  const loadSoStatus = async () => {
    const soStatus = await loadOption(true, "SRV_GET_SP_UI_DP_00_CONF_Q1", { SP_UI_DP_00_CONF_Q1_01: "DP_SO_STATUS", SP_UI_DP_00_CONF_Q1_02: "", SP_UI_DP_00_CONF_Q1_03: "" }, "ID", "CD_NM", true, true);
    if (!isEmptyArray(soStatus)) {
      setSoStatusOption(soStatus);
      setValue("soStatusId", soStatus[0].value);
    }
  };

  useEffect(() => {
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
    loadSoStatus();
  }, []);

  useEffect(() => {
    if (grid) {
      const globalButtons = [
        {
          name: "search",
          action: () => {
            loadGrid1Data();
          },
          visible: true,
          disable: false,
        },
        {
          name: "save",
          action: () => {
            //saveData(grid);
            saveJson(grid, "SP_UI_DP_42_S1_J", loadGrid1Data);
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
          action: () => {
            setPersonalizeOpen(true);
          },
          visible: true,
          disable: false,
        },
      ];
      setViewInfo(vom.active, "globalButtons", globalButtons);
    }
  }, [grid]);

  const refresh = () => {
    reset();
    currentItemRef.reset();
    currentAccountRef.reset();
    grid.dataProvider.clearRows();
  };

  const setGridOption = (grid) => {
    grid.gridView.setEditOptions({
      insertable: true,
      appendable: true,
    });
    grid.gridView.displayOptions.fitStyle = "fill";
    setVisibleProps(grid, true, true, true);

    grid.gridView.onCellButtonClicked = (grid, itemIndex, column) => {
      if (column.fieldName === "ITEM_CD") {
        setGridItemPopupOpen(true);
      } else if (column.fieldName === "ACCOUNT_CD") {
        setGridAccountPopupOpen(true);
      }
    };
  };

  const afterGridCreate1 = (gridObj) => {
    setGrid(gridObj);
    setGridOption(gridObj);
    // 조회조건 세팅
    gridComboLoad(gridObj, {
      URL: "engine/dp/SRV_GET_SP_UI_DP_00_CONF_Q1",
      CODE_VALUE: "CD",
      CODE_LABEL: "CD_NM",
      COLUMN: "SO_STATUS_CD",
      PROP: "lookupData",
      PARAM_KEY: ["SP_UI_DP_00_CONF_Q1_01", "SP_UI_DP_00_CONF_Q1_02", "SP_UI_DP_00_CONF_Q1_03"],
      PARAM_VALUE: ["DP_SO_STATUS", "", ""],
      TRANSLANG_LABEL: true,
    });
  };

  const loadGrid1Data = () => {
    let param = new URLSearchParams();
    param.append("FROM_DATE", getValues("dateRange")[0].format("yyyy-MM-dd"));
    param.append("TO_DATE", getValues("dateRange")[1].format("yyyy-MM-dd"));
    param.append("ITEM_CD", currentItemRef.getItemCode());
    param.append("ITEM_NM", currentItemRef.getItemName());
    param.append("ACCT_CD", currentAccountRef.getAccountCode());
    param.append("ACCT_NM", currentAccountRef.getAccountName());

    param.append("SO_STATUS_ID", getValues("soStatusId") === "ALL" ? "" : getValues("soStatusId"));
    param.append("DP_PLAN_YN", getValues("dpPlanYn"));

    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_42_Q1",
      data: param,
    })
      .then((res) => {
        grid.setData(res.data.RESULT_DATA);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onDelete = (targetGrid, deleteRows) => {
    let formData = new FormData();
    formData.append("P_USER_ID", username);
    formData.append("changes", JSON.stringify(deleteRows));

    if (deleteRows.length > 0) {
      return zAxios({
        method: "post",
        url: baseURI() + "engine/dp/SRV_SET_SP_UI_DP_42_D1",
        headers: { "content-type": "application/json" },
        data: formData,
      })
        .then((response) => {
          if (response.status === gHttpStatus.SUCCESS) {
            const rsData = response.data;
            if (rsData.RESULT_SUCCESS) {
              const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_42_D1_P_RT_MSG"];
              resultMSG === "MSG_0002" ? loadGrid1Data() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
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
    if (targetGrid.gridId === "grid") {
      //loadGrid1Data();
    }
  };

  // const saveData = (targetGrid) => {
  //   targetGrid.gridView.commit(true);

  //   showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), (answer) => {
  //     if (answer) {
  //       let changes = [];
  //       changes = changes.concat(targetGrid.dataProvider.getAllStateRows().created, targetGrid.dataProvider.getAllStateRows().updated, targetGrid.dataProvider.getAllStateRows().deleted, targetGrid.dataProvider.getAllStateRows().createAndDeleted);

  //       let changeRowData = [];
  //       changes.forEach((row) => {
  //         let data = targetGrid.dataProvider.getJsonRow(row);
  //         data.BASE_DATE = data.BASE_DATE.format("yyyy-MM-ddTHH:mm:ss"); //1번 여기서 format 처리
  //         changeRowData.push(data);
  //       });

  //       //1번 , 2 번 속도차이가 있을것 같은데.. 성능 확인이 필요하다...
  //       /*        const replacer = function (key, value) {
  //         if (this[key] instanceof Date) {
  //           return this[key].format("yyyy-MM-ddTHH:mm:ss");
  //         }
  //         return value;
  //       };
  //       const changeData = JSON.stringify(changeRowData, replacer); //2번 여기서 format 처리
  //       */
  //       const changeData = JSON.stringify(changeRowData); //2번 여기서 format 처리

  //       if (changeRowData.length === 0) {
  //         showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"));
  //       } else {
  //         targetGrid.gridView.showToast(progressSpinner + "Saving data...", true);

  //         let param = new FormData();
  //         param.append("changes", changeData);
  //         param.append("USER_ID", username);
  //         param.append("procedure", "SP_UI_DP_42_S1_J");

  //         zAxios({
  //           method: "post",
  //           headers: { "content-type": "application/json" },
  //           url: baseURI() + "common/json-save",
  //           data: param,
  //         })
  //           .then((response) => {
  //             if (res.status === gHttpStatus.SUCCESS) {
  //               const rsData = response.data;
  //               if (rsData.RESULT_SUCCESS) {
  //                 const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_42_S1_J_P_RT_MSG"];
  //                 resultMSG === "MSG_0001" ? loadGrid1Data() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
  //               } else {
  //                 showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
  //               }
  //             }
  //           })
  //           .catch((err) => {
  //             console.log(err);
  //           })
  //           .then(() => {
  //             targetGrid.gridView.hideToast();
  //           });
  //       }
  //     }
  //   });
  // };

  /*  function setItemCd(items) {
    let itemCdArr = [];
    let itemNmArr = [];
    items.forEach(function (row) {
      itemCdArr.push(row.ITEM_CD);
      itemNmArr.push(row.ITEM_NM);
    });
    setValue("itemCd", itemCdArr.join("|"));
    setValue("itemNm", itemNmArr.join("|"));
  }

  const setAccountCd = (accounts) => {
    let accountCdArr = [];
    let accountNmArr = [];
    accounts.forEach(function (account) {
      accountCdArr.push(account.ACCOUNT_CD);
      accountNmArr.push(account.ACCOUNT_NM);
    });
    setValue("accountCd", accountCdArr.join("|"));
    setValue("accountNm", accountNmArr.join("|"));
  };*/

  const setGridItemCd = (records) => {
    let itemIndex = grid.gridView.getCurrent().dataRow;
    grid.dataProvider.setValue(itemIndex, "ITEM_CD", records[0].ITEM_CD);
    grid.dataProvider.setValue(itemIndex, "ITEM_NM", records[0].ITEM_NM);
    grid.gridView.setCurrent({ itemIndex: itemIndex });
    grid.gridView.commit(true);
  };

  const setGridAccountCd = (records) => {
    let itemIndex = grid.gridView.getCurrent().dataRow;
    grid.dataProvider.setValue(itemIndex, "ACCOUNT_CD", records[0].ACCOUNT_CD);
    grid.dataProvider.setValue(itemIndex, "ACCOUNT_NM", records[0].ACCOUNT_NM);
    grid.gridView.setCurrent({ itemIndex: itemIndex });
    grid.gridView.commit(true);
  };

  const reloadPrefInfo = (viewCd, userName, grid, grpCd) => {
    if (grid) grid.loadCrossTabInfoAndPrefInfo(viewCd, grpCd, userName);
  };

  const getConfirm = (popupName, popupText) => {
    console.log("popupName : ", popupName);
    console.log("popupText : ", popupText);
    if (popupName === "PopSelectItemLvItem") {
      setValue("itemCd", popupText.map((txt) => txt.ITEM_CD).join("|"));
      setValue("itemNm", popupText.map((txt) => txt.ITEM_NM).join("|"));
    }
    if (popupName === "PopSelectSalesLvAccount") {
      setValue("accountCd", popupText.map((txt) => txt.ACCOUNT_CD).join("|"));
      setValue("accountNm", popupText.map((txt) => txt.ACCOUNT_NM).join("|"));
    }
  };

  return (
    <>
      <ContentInner>
        <SearchArea>
          <InputField type="dateRange" name="dateRange" label={transLangKey("APPY_SCPE")} control={control} dateformat="yyyy-MM-dd" />
          {/*          <InputField
            type="action"
            name="itemCd"
            label={transLangKey("ITEM_CD")}
            tooltip={transLangKey("ITEM_CD")}
            control={control}
            onClick={() => {
              openItemPopup();
            }}>
            <Icon.Search />
          </InputField>

          <InputField type={"text"} name="itemNm" label={transLangKey("ITEM_NM")} control={control} readonly={false} />
          <InputField
            type="action"
            name="accountCd"
            label={transLangKey("ACCOUNT_CD")}
            tooltip={transLangKey("ACCOUNT_CD")}
            control={control}
            onClick={() => {
              setAccountPopupOpen();
            }}>
            <Icon.Search />
          </InputField>
          <InputField type={"text"} name="accountNm" label={transLangKey("ACCOUNT_NM")} control={control} readonly={false} />*/}
          <ItemSearchBox ref={itemSearchBoxRef} keyValue={"itemName"} placeHolder={transLangKey("ITEM_NM")} />
          <AccountSearchBox ref={accountSearchBoxRef} keyValue={"accountName"} placeHolder={transLangKey("ACCOUNT_NM")} />
          <InputField type="select" name="soStatusId" label={transLangKey("SO_STATUS")} control={control} readonly={false} disabled={false} options={soStatusOption} />
          <InputField
            type="select"
            name="dpPlanYn"
            label={transLangKey("DP_PLAN_YN")}
            control={control}
            options={[
              { label: "ALL", value: "" },
              { label: "Y", value: "Y" },
              { label: "N", value: "N" },
            ]}
          />
        </SearchArea>
        <ButtonArea>
          {/*  -- 가능하지만..일단 지원하지 않는다.
            <LeftButtonArea>
              <GridExcelImportButton type="icon" grid="grid" />
              <GridExcelExportButton type="icon" grid="grid" options={excelExportOptions} />
            </LeftButtonArea>
          */}
          <RightButtonArea>
            <ButtonGroup>
              <GridAddRowButton grid="grid" type="icon" />
              <GridDeleteRowButton grid="grid" type="icon" onDelete={onDelete} onAfterDelete={onAfterDelete} />
              <GridSaveButton
                grid="grid"
                type="icon"
                onClick={() => {
                  saveJson(grid, "SP_UI_DP_42_S1_J", loadGrid1Data);
                  //saveData(grid);
                }}
              />
            </ButtonGroup>
          </RightButtonArea>
        </ButtonArea>
        <ResultArea sizes={[100, 50]} direction={"vertical"}>
          <BaseGrid id="grid" items={salesGridItems} viewCd={vom.active} gridCd={vom.active + "-RST_CPT_01"} afterGridCreate={afterGridCreate1} />
        </ResultArea>
        <StatusArea show={false} message={message}>
          <GridCnt grid="grid" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")} />
        </StatusArea>
      </ContentInner>
      {itemPopupOpen && <PopSelectItem open={itemPopupOpen} onClose={() => setItemPopupOpen(false)} confirm={getConfirm} />}
      {accountPopupOpen && <PopSelectAccount open={accountPopupOpen} onClose={() => setAccountPopupOpen(false)} confirm={getConfirm} />}
      {gridItemPopupOpen && <PopSelectItem open={gridItemPopupOpen} onClose={() => setGridItemPopupOpen(false)} confirm={setGridItemCd} multiple={true} />}
      {gridAccountPopupOpen && <PopSelectAccount open={gridAccountPopupOpen} onClose={() => setGridAccountPopupOpen(false)} confirm={setGridAccountCd} multiple={true} />}
      <PopPersonalize open={personalizeOpen} onClose={() => setPersonalizeOpen(false)} resetCallback={reloadPrefInfo} viewCd={vom.active} grid={[grid]} username={username} groupCd={""} />
    </>
  );
}

export default ActualSales;
