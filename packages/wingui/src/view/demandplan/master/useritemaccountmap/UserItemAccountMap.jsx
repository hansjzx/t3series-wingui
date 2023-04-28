import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { ButtonGroup } from "@mui/material";
import FiberNew from "@mui/icons-material/FiberNew";
import JoinFull from "@mui/icons-material/JoinFull";
import SettingsAccessibility from "@mui/icons-material/SettingsAccessibility";
import { ContentInner, ResultArea, SearchArea, StatusArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow, InputField, GridAddRowButton, GridDeleteRowButton, GridSaveButton, CommonButton, BaseGrid, GridCnt, useViewStore, useUserStore, zAxios } from "@zionex/wingui-core/src/common/imports";
import { baseURI, gridComboLoad, showMessage, transLangKey, vom } from "@wingui";
import PopSelectItem from "@wingui/view/common/PopSelectItem";
import PopSelectAccount from "@wingui/view/common/PopSelectAccount";
import PopSelectUser from "@wingui/view/demandplan/common/PopSelectUser";
import PopMultiMap from "@wingui/view/demandplan/master/useritemaccountmap/PopMultiMap";
import PopNewMap from "@wingui/view/demandplan/master/useritemaccountmap/PopNewMap";
import PopMapUserTransfer from "@wingui/view/demandplan/master/useritemaccountmap/PopMapUserTransfer";
import ItemSearchBox from "@wingui/view/demandplan/common/ItemSearchBox";
import AccountSearchBox from "@wingui/view/demandplan/common/AccountSearchBox";
import { loadOption, newRowEditCellStyle } from "@wingui/view/demandplan/DpUtil";
import { isEmptyArray } from "@wingui/view/demandplan/DpUtil";

const grid1Items = [
  { name: "USER_ID", dataType: "text", headerText: "USER_ID", visible: true, editable: false, width: "70", textAlignment: "center", validRules: [{ criteria: "required" }], styleCallback: newRowEditCellStyle },
  { name: "AUTH_TP_ID", dataType: "dropdown", headerText: "AUTH_TP_ID", visible: true, editable: false, width: "70", textAlignment: "center", useDropdown: true, lookupDisplay: true, validRules: [{ criteria: "required" }], styleCallback: newRowEditCellStyle },
  { name: "ITEM_PLAN_YN", dataType: "boolean", headerText: "ITEM_PLAN_YN", visible: false, editable: false, width: "70", textAlignment: "center" },
  { name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: "80", textAlignment: "center", button: "action", validRules: [{ criteria: "required" }], styleCallback: newRowEditCellStyle },
  { name: "ITEM_MST_ID", dataType: "text", headerText: "ITEM_MST_ID", visible: false, editable: false, width: 80, textAlignment: "center" },
  { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: "80", textAlignment: "center" },
  { name: "UOM_NM", dataType: "text", headerText: "UOM_NM", visible: true, editable: false, width: "60", textAlignment: "center", styleCallback: newRowEditCellStyle },
  { name: "ACCOUNT_CD", dataType: "text", headerText: "ACCOUNT_CD", visible: true, editable: false, width: "70", textAlignment: "center", button: "action", validRules: [{ criteria: "required" }], styleCallback: newRowEditCellStyle },
  { name: "ACCOUNT_ID", dataType: "text", headerText: "ACCOUNT_ID", visible: false, editable: false, width: "70", textAlignment: "center" },
  { name: "ACCT_PLAN_YN", dataType: "boolean", headerText: "ACCT_PLAN_YN", visible: false, editable: false, width: "70", textAlignment: "center" },
  { name: "ACCOUNT_NM", dataType: "text", headerText: "ACCOUNT_NM", visible: true, editable: false, width: "80", textAlignment: "center" },
  { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "60", textAlignment: "center" },
  { name: "EMP_ID", dataType: "text", headerText: "EMP_ID", visible: false, editable: false, width: 80, textAlignment: "center" },
  { name: "EMP_NM", dataType: "text", headerText: "EMP_NM", visible: false, editable: false, width: 80, textAlignment: "center" },
  { name: "EMP_NO", dataType: "text", headerText: "EMP_NO", visible: false, editable: false, width: 80, textAlignment: "center" },
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: 80, textAlignment: "center" },
  { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: 80, textAlignment: "center" },
  { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: 80, textAlignment: "center" },
  { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: false, editable: false, width: 80, textAlignment: "center" },
  { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: false, editable: false, width: 80, textAlignment: "center" },
];

let defaultAuthTp;
function UserItemAccountMap() {
  const [username, displayName, systemAdmin] = useUserStore((state) => [state.username, state.displayName, state.systemAdmin]);
  const [message, setMessage] = useState();
  const itemSearchBoxRef = useRef();
  const [currentItemRef, setCurrentItemRef] = useState();
  const accountSearchBoxRef = useRef();
  const [currentAccountRef, setCurrentAccountRef] = useState();

  const [grid1, setGrid1] = useState(null);

  const [gridItemPopupOpen, setGridItemPopupOpen] = useState(false);
  const [gridAccountPopupOpen, setGridAccountPopupOpen] = useState(false);
  const [multiMapOpen, setMultiMapOpen] = useState(false);
  const [newMapOpen, setNewMapOpen] = useState(false);
  const [userPopupOpen, setUserPopupOpen] = useState(false);
  const [authTypes, setAuthTypes] = useState([]);
  // const [authTypeCode, setAuthTypeCode] = useState("");

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const { reset, control, getValues, setValue, watch } = useForm({
    defaultValues: {
      userId: username,
      empNm: displayName,
      itemCd: "",
      itemNm: "",
      accountCd: "",
      accountNm: "",
      actvYn: "Y",
    },
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
  ];

  const refresh = () => {
    reset();

    currentItemRef.reset();
    currentAccountRef.reset();

    setValue("authTp", defaultAuthTp);

    grid1.dataProvider.clearRows();
  };

  useEffect(() => {
    // console.log("watch []");
    loadAuthType(getValues("userId"));
  }, [watch("userId")]);

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, "grid1");
    if (grdObj1 && grdObj1.dataProvider) {
      if (grid1 !== grdObj1) setGrid1(grdObj1);
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
      gridComboLoad(grid1, {
        URL: "engine/dp/SRV_GET_SP_UI_DP_00_LV_CD_Q1",
        CODE_VALUE: "ID",
        CODE_LABEL: "CD_NM",
        COLUMN: "AUTH_TP_ID",
        PROP: "lookupData",
        PARAM_KEY: ["LV_TP"],
        PARAM_VALUE: ["S"],
        TRANSLANG_LABEL: true,
      });
      setGridOption();
      loadGrid1Data();
    }
  }, [grid1]);

  const loadAuthType = async (id) => {
    const options = await loadOption(true, "SRV_GET_SP_UI_DP_00_EMP_AUTH_TP_Q1", { SP_UI_DP_00_EMP_AUTH_TP_Q1_01: id, SP_UI_DP_00_EMP_AUTH_TP_Q1_02: vom.active }, "ID", "CD_NM", false, true);
    if (!isEmptyArray(options)) {
      setAuthTypes(options);
      // setAuthTypeCode(options[0].data.CD);
      defaultAuthTp = options[0].value;
      setValue("authTp", defaultAuthTp);
    }
  };

  const onSubmit = () => {
    loadGrid1Data();
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
      // 행추가 일때만 팝업버튼 실행
      let state = grid1.dataProvider.getRowState(itemIndex.dataRow);

      if (column.fieldName === "ACCOUNT_CD" && state === "created") {
        setGridAccountPopupOpen(true);
      }
      if (column.fieldName === "ITEM_CD" && state === "created") {
        setGridItemPopupOpen(true);
      }
    };
  };

  const getNewGridData1 = () => {
    const userId = getValues("userId");
    const authTp = getValues("authTp");
    return { USER_ID: userId, AUTH_TP_ID: authTp, ACTV_YN: true };
  };

  const loadGrid1Data = () => {
    console.log("loadGrid1Data");
    let param = new URLSearchParams();
    param.append("SP_UI_DP_15_Q1_01", getValues("userId"));
    param.append("SP_UI_DP_15_Q1_02", getValues("authTp"));
    param.append("SP_UI_DP_15_Q1_03", currentItemRef.getItemCode());
    param.append("SP_UI_DP_15_Q1_04", currentItemRef.getItemName());
    param.append("SP_UI_DP_15_Q1_05", currentAccountRef.getAccountCode());
    param.append("SP_UI_DP_15_Q1_06", currentAccountRef.getAccountName());
    param.append("SP_UI_DP_15_Q1_07", getValues("actvYn") === "ALL" ? "" : getValues("actvYn"));
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_15_Q1",
      data: param,
    })
      .then((res) => {
        if (res.status === gHttpStatus.SUCCESS) {
          grid1.dataProvider.fillJsonData(res.data.RESULT_DATA);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onDelete = (targetGrid, deleteRows) => {
    const itemIndex = targetGrid.gridView.getCurrent().dataRow;
    // const authTypeCode = targetGrid.dataProvider.getValue(itemIndex, 1);
    const operationId = targetGrid.dataProvider.getValue(itemIndex, 0);

    let formData = new FormData();
    formData.append("changes", JSON.stringify(deleteRows));
    formData.append("P_USER_ID", username);
    formData.append("AUTH_TYPE", getValues("authTp"));
    formData.append("OPERATOR_ID", operationId);
    formData.append("CHANGE_TYPE", "DELETE");

    if (deleteRows.length > 0) {
      return zAxios({
        method: "post",
        url: baseURI() + "engine/dp/SRV_SET_SP_UI_DP_15_D1",
        headers: { "content-type": "application/json" },
        data: formData,
      })
        .then(function (response) {
          if (response.status === gHttpStatus.SUCCESS) {
            const rsData = response.data;
            if (rsData.RESULT_SUCCESS) {
              const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_15_D1_P_RT_MSG"];
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
    if (targetGrid.gridId === "grid1") {
      //loadGrid1Data();
    }
  };

  const saveData = (targetGrid) => {
    targetGrid.gridView.commit(true);

    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), (answer) => {
      if (answer) {
        let changes = [];
        changes = changes.concat(targetGrid.dataProvider.getAllStateRows().created, targetGrid.dataProvider.getAllStateRows().updated, targetGrid.dataProvider.getAllStateRows().deleted, targetGrid.dataProvider.getAllStateRows().createAndDeleted);

        let changeRowData = [];
        changes.forEach((row) => {
          let data = targetGrid.dataProvider.getJsonRow(row);
          let rowState = targetGrid.dataProvider.getRowState(row);
          data.ITEM_PLAN_YN = false;
          data.ACCT_PLAN_YN = false;
          if (rowState === "created") {
            data.ID = generateId();
          }
          changeRowData.push(data);
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"));
        } else {
          targetGrid.gridView.showToast(progressSpinner + "Saving data...", true);
          const itemIndex = targetGrid.gridView.getCurrent().dataRow;
          const operationId = targetGrid.dataProvider.getValue(itemIndex, 0);
          let formData = new FormData();
          formData.append("OPERATOR_ID", operationId);
          formData.append("CHANGE_TYPE", "CHANGE");
          formData.append("changes", JSON.stringify(changeRowData));
          formData.append("USER_ID", username);
          zAxios
            .post(baseURI() + "engine/dp/SRV_SET_SP_UI_DP_15_S1", formData, {
              headers: { "content-type": "application/json" },
            })
            .then(function (response) {
              if (response.status === gHttpStatus.SUCCESS) {
                const rsData = response.data;
                if (rsData.RESULT_SUCCESS) {
                  const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_15_S1_P_RT_MSG"];
                  resultMSG === "MSG_0001" ? loadGrid1Data() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
                } else {
                  showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
                }
              }
            })
            .catch((err) => {
              console.log(err);
            })
            .then(() => {
              targetGrid.gridView.hideToast();
            });
        }
      }
    });
  };
  const openUserPopup = () => {
    setUserPopupOpen(true);
  };

  const setUserCd = (items) => {
    setValue("userId", items[0].USER_ID);
    setValue("empNm", items[0].EMP_NM);
  };

  const setGridItemCd = (records) => {
    let itemIndex = grid1.gridView.getCurrent().dataRow;
    grid1.dataProvider.setValue(itemIndex, "ITEM_CD", records[0].ITEM_CD);
    grid1.dataProvider.setValue(itemIndex, "ITEM_NM", records[0].ITEM_NM);
    grid1.dataProvider.setValue(itemIndex, "ITEM_MST_ID", records[0].ID);
    grid1.dataProvider.setValue(itemIndex, "UOM_NM", records[0].UOM_NM);
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

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <InputField
              type={"action"}
              name="userId"
              useLabel={false}
              label={transLangKey("USER_ID")}
              control={control}
              readonly={true}
              onClick={() => {
                openUserPopup();
              }}>
              <Icon.Search />
            </InputField>
            <InputField type={"text"} name="empNm" label={transLangKey("EMP_NM")} control={control} readonly={true} />
            <InputField type="select" name="authTp" label={transLangKey("AUTH_TP_NM")} control={control} options={authTypes} />
            <InputField
              type="select"
              name="actvYn"
              label={transLangKey("ACTV_YN")}
              control={control}
              options={[
                { label: "ALL", value: "ALL" },
                { label: "Y", value: "Y" },
                { label: "N", value: "N" },
              ]}
            />
          </SearchRow>
          <SearchRow>
            <ItemSearchBox ref={itemSearchBoxRef} keyValue={"itemName"} placeHolder={transLangKey("ITEM_NM")} />
            <AccountSearchBox ref={accountSearchBoxRef} keyValue={"accountName"} placeHolder={transLangKey("ACCOUNT_NM")} />
          </SearchRow>
        </SearchArea>
        <ButtonArea>
          <LeftButtonArea>
            {/*
              <CommonButton type="icon" aria-describedby={"transferpopover"} title={transLangKey("DP_MAP_TRANSFER")} onClick={handleClick}>
                <SettingsAccessibility />
              </CommonButton>
            */}
            <CommonButton
              type="icon"
              title={transLangKey("DP_COMBI_GEN")}
              onClick={() => {
                setMultiMapOpen(true);
              }}>
              <JoinFull />
            </CommonButton>
            <CommonButton
              type="icon"
              title={transLangKey("OLD_NEW_MAP_NEW")}
              onClick={() => {
                setNewMapOpen(true);
              }}>
              <FiberNew />
            </CommonButton>
          </LeftButtonArea>
          <RightButtonArea>
            <ButtonGroup>
              <GridAddRowButton grid="grid1" type="icon" onGetData={getNewGridData1} />
              <GridDeleteRowButton grid="grid1" type="icon" onDelete={onDelete} onAfterDelete={onAfterDelete} />
              <GridSaveButton
                grid="grid1"
                type="icon"
                onClick={() => {
                  saveData(grid1);
                }}
              />
            </ButtonGroup>
          </RightButtonArea>
        </ButtonArea>
        <ResultArea sizes={[100, 50]} direction={"vertical"}>
          <BaseGrid id="grid1" items={grid1Items} />
        </ResultArea>
        <StatusArea show={false} message={message}>
          <GridCnt grid="grid2" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")} />
        </StatusArea>
      </ContentInner>
      {userPopupOpen && <PopSelectUser open={userPopupOpen} onClose={() => setUserPopupOpen(false)} confirm={setUserCd} multiple={false} />}
      {gridItemPopupOpen && <PopSelectItem open={gridItemPopupOpen} onClose={() => setGridItemPopupOpen(false)} confirm={setGridItemCd} multiple={false} />}
      {gridAccountPopupOpen && <PopSelectAccount id={"selectAccount"} open={gridAccountPopupOpen} onClose={() => setGridAccountPopupOpen(false)} confirm={setGridAccountCd} multiple={false} />}
      {multiMapOpen && <PopMultiMap id={"multimap"} open={multiMapOpen} onClose={() => setMultiMapOpen(false)} operationId={getValues("userId")} authTp={getValues("authTp")} />}
      {newMapOpen && <PopNewMap open={newMapOpen} onClose={() => setNewMapOpen(false)} operationId={getValues("userId")} authTp={getValues("authTp")} />}
      {open && <PopMapUserTransfer id={"transferpopover"} open={open} onClose={handleClose} anchorEl={anchorEl} operationId={getValues("userId")} authTp={getValues("authTp")} />}
    </>
  );
}

export default UserItemAccountMap;
