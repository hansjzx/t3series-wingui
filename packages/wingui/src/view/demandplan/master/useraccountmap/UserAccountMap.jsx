import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Box, ButtonGroup } from "@mui/material";
import { ContentInner, ResultArea, SearchArea, StatusArea, ButtonArea, LeftButtonArea, RightButtonArea, InputField, GridAddRowButton, GridDeleteRowButton, CommonButton, BaseGrid, GridCnt, useViewStore, GridSaveButton, zAxios } from "@zionex/wingui-core/src/common/imports";
import { isEmptyArray } from "@wingui/view/demandplan/DpUtil";

import PopSelectAccount from "@wingui/view/common/PopSelectAccount";
import PopSelectUser from "@wingui/view/demandplan/common/PopSelectUser";
import PopPersonalize from "@wingui/view/common/PopPersonalize";
import { useUserStore } from "@zionex/wingui-core/src/store/userStore";

let grid1Items = [
  { name: "KEY_ACCOUNT_ID", dataType: "text", headerText: "KEY_ACCOUNT_ID", visible: false, editable: false, width: "100", textAlignment: "center" },
  { name: "LV_MGMT_ID", dataType: "text", headerText: "LV_MGMT_ID", visible: false, editable: false, width: "100", textAlignment: "center" },
  { name: "LV_MGMT_CD", dataType: "text", headerText: "LV_MGMT_CD", visible: false, editable: false, width: "100", textAlignment: "center" },
  { name: "KEY_ACCOUNT_CD", dataType: "text", headerText: "KEY_ACCOUNT_CD", visible: false, editable: false, width: "100", textAlignment: "center" },
  { name: "KEY_ACCOUNT_NM", dataType: "text", headerText: "KEY_ACCOUNT_NM", visible: false, editable: false, width: "100", textAlignment: "center" },
  { name: "GRP", dataType: "text", headerText: "GRP", visible: true, editable: false, width: 100, textAlignment: "center", iteration: { prefix: "GRP_", prefixRemove: "true", delimiter: "," } },
];
const grid2Items = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, width: "100", textAlignment: "center" },
  { name: "EMP_ID", dataType: "text", headerText: "EMP_ID", visible: false, editable: false, width: "100", textAlignment: "center" },
  { name: "ACCOUNT_ID", dataType: "text", headerText: "ACCOUNT_ID", visible: false, editable: false, width: "100", textAlignment: "center" },
  { name: "LV_MGMT_ID", dataType: "text", headerText: "LV_MGMT_ID", visible: false, editable: false, width: "100", textAlignment: "center" },
  { name: "USER_ID", dataType: "text", headerText: "USER_ID", visible: true, editable: false, width: "100", textAlignment: "center" },
  { name: "EMP_NM", dataType: "text", headerText: "EMP_NM", visible: true, editable: false, width: "150", textAlignment: "center" },
  { name: "AUTH_TP_ID", dataType: "text", headerText: "AUTH_TP_ID", visible: false, editable: false, width: "100", textAlignment: "center" },
  { name: "LV_CD", dataType: "text", headerText: "LV_NM", visible: true, editable: false, width: "150", textAlignment: "center" },
  { name: "ACCOUNT_CD", dataType: "text", headerText: "ACCOUNT_CD", visible: true, editable: false, width: "100", textAlignment: "center" },
  { name: "ACCOUNT_NM", dataType: "text", headerText: "ACCOUNT_NM", visible: true, editable: false, width: "150", textAlignment: "center" },
  { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: "80", textAlignment: "center" },
  { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: "80", textAlignment: "center" },
  { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: "200", textAlignment: "center", format: "yyyy-MM-dd HH:mm:ss" },
  { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: "80", textAlignment: "center" },
  { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: "200", textAlignment: "center", format: "yyyy-MM-dd HH:mm:ss" },
];
function UserAccountMap() {
  const [username, displayName, systemAdmin] = useUserStore((state) => [state.username, state.displayName, state.systemAdmin]);
  const [message, setMessage] = useState();
  const [personalizeOpen, setPersonalizeOpen] = useState(false);
  const [grid1, setGrid1] = useState(null);
  const [grid2, setGrid2] = useState(null);
  const [salesLevels, setSalesLevels] = useState([]);
  const [authTypes, setAuthTypes] = useState([]);
  const [setViewInfo] = useViewStore((state) => [state.setViewInfo]);
  const [userPopupOpen, setUserPopupOpen] = useState(false);
  const [accountPopupOpen, setAccountPopupOpen] = useState(false);
  const [chkRowCnt, setChkRowCnt] = useState(0);
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
        saveData(grid2);
      },
      visible: false,
      disable: false,
    },
    {
      name: "refresh",
      action: () => {
        reset();
      },
      visible: false,
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

  const { reset, control, getValues, setValue, watch } = useForm({
    defaultValues: {
      userId: username,
      empNm: displayName,
      authType: "",
      salesLevel: "",
    },
  });

  const onSubmit = () => {
    loadGrid1Data();
    loadGrid2Data();
  };

  const loadGrid1Data = () => {
    let param = new URLSearchParams();
    param.append("ACCT_LV", getValues("salesLevel"));
    param.append("ACCT_CD", getValues("accountCd") === undefined ? "" : getValues("accountCd"));
    param.append("timeout", 0);
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/GetAccounts",
      data: param,
    })
      .then((res) => {
        if (res.status === gHttpStatus.SUCCESS) {
          let dataArr = res.data.RESULT_DATA;
          //grid1.dataProvider.fillJsonData(dataArr);
          grid1.setData(dataArr);
          setChkRowCnt(0);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadGrid2Data = () => {
    let param = new URLSearchParams();
    param.append("SP_UI_DP_14_Q2_01", getValues("userId"));
    param.append("SP_UI_DP_14_Q2_02", getValues("authType"));
    param.append("timeout", 0);
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_14_Q2",
      data: param,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          let dataArr = res.data.RESULT_DATA;
          //grid2.dataProvider.fillJsonData(dataArr);
          grid2.setData(dataArr);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const getNewGridData = () => {
    const checkedRowIndexes = grid1.gridView.getCheckedRows();
    if (checkedRowIndexes.length === 0) return;

    const accountIds = grid2.dataProvider.getDistinctValues("ACCOUNT_ID");
    //console.log("accountIds", accountIds);
    let newRows = [];
    for (let i = 0, n = checkedRowIndexes.length; i < n; i++) {
      let checkedRow = grid1.dataProvider.getJsonRow(checkedRowIndexes[i]);

      if (accountIds != null && accountIds.includes(checkedRow["KEY_ACCOUNT_ID"])) {
        //console.log("include==>", checkedRow["KEY_ACCOUNT_ID"]);
        continue;
      }
      newRows.push({
        USER_ID: getValues("userId"),
        EMP_NM: getValues("empNm"),
        AUTH_TP_ID: getValues("authType"),
        ACTV_YN: "Y",
        LV_MGMT_ID: checkedRow["LV_MGMT_ID"],
        LV_CD: checkedRow["LV_MGMT_CD"],
        ACCOUNT_ID: checkedRow["KEY_ACCOUNT_ID"],
        ACCOUNT_CD: checkedRow["KEY_ACCOUNT_CD"],
        ACCOUNT_NM: checkedRow["KEY_ACCOUNT_NM"],
      });
    }
    grid2.dataProvider.addRows(newRows);
  };

  const onDelete = (targetGrid, deleteRows) => {
    let formData = new FormData();
    formData.append("changes", JSON.stringify(deleteRows));
    formData.append("USER_ID", displayName);
    // formData.append("AUTH_TYPE", getValues("authType"));
    formData.append("timeout", 0);

    if (deleteRows.length > 0) {
      return zAxios({
        method: "post",
        url: baseURI() + "engine/dp/SRV_SET_SP_UI_DP_14_D2",
        headers: { "content-type": "application/json" },
        data: formData,
      })
        .then(function (response) {
          if (response.status === gHttpStatus.SUCCESS) {
            const rsData = response.data;
            if (rsData.RESULT_SUCCESS) {
              const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_14_D2_P_RT_MSG"];
              resultMSG === "MSG_0002" ? onSubmit() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
            } else {
              showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
            }
          }
        })
        .catch(function (err) {
          console.log(err);
        })
        .then(function () {});
    }
  };

  const saveData = (targetGrid) => {
    targetGrid.gridView.commit(true);

    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), function (answer) {
      if (answer) {
        let changes = [];
        changes = changes.concat(targetGrid.dataProvider.getAllStateRows().created, targetGrid.dataProvider.getAllStateRows().updated, targetGrid.dataProvider.getAllStateRows().deleted, targetGrid.dataProvider.getAllStateRows().createAndDeleted);

        let changeRowData = [];
        changes.forEach((row) => changeRowData.push(targetGrid.dataProvider.getJsonRow(row)));

        if (changeRowData.length === 0) {
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"));
        } else {
          targetGrid.gridView.showToast(progressSpinner + "Saving data...", true);
          // console.log("changeRowData", changeRowData);
          let formData = new FormData();
          formData.append("changes", JSON.stringify(changeRowData));
          formData.append("USER_ID", displayName);
          formData.append("CHANGE_TYPE", "CHANGE");
          formData.append("timeout", 0);
          zAxios
            .post(baseURI() + "engine/dp/SRV_SET_SP_UI_DP_14_S2", formData, {
              headers: { "content-type": "application/json" },
            })
            .then(function (response) {
              if (response.status === gHttpStatus.SUCCESS) {
                const rsData = response.data;
                if (rsData.RESULT_SUCCESS) {
                  const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_14_S2_P_RT_MSG"];
                  resultMSG === "MSG_0001" ? onSubmit() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
                } else {
                  showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
                }
              }
            })
            .catch(function (err) {
              console.log(err);
            })
            .then(function () {
              targetGrid.gridView.hideToast();
            });
        }
      }
    });
  };

  function setUserCd(items) {
    setValue("userId", items[0].USER_ID);
    setValue("empNm", items[0].EMP_NM);
  }

  function setAccountCd(accounts) {
    let accountCdArr = [];
    let accountNmArr = [];
    accounts.forEach(function (row) {
      accountCdArr.push(row.ACCOUNT_CD);
      accountNmArr.push(row.ACCOUNT_NM);
    });
    setValue("accountCd", accountCdArr.join("|"));
    setValue("accountNm", accountNmArr.join("|"));
  }

  const loadAuthType = async () => {
    setAuthTypes(
      await loadComboList({
        PROCEDURE_NAME: "SP_UI_DP_00_EMP_AUTH_TP_Q1",
        URL: "common/combos",
        CODE_KEY: "ID",
        CODE_VALUE: "CD_NM",
        PARAM: { P_USER_ID: getValues("userId") },
        ALLFLAG: false,
      })
    );
  };

  const loadSaleLevel = async () => {
    const salesLevels = await loadComboList({
      PROCEDURE_NAME: "SP_UI_DP_00_LV_CD_Q1",
      URL: "common/combos",
      CODE_KEY: "CD",
      CODE_VALUE: "CD_NM",
      PARAM: { P_LV_TP: "S", P_ACCOUNT_LV_YN: "Y" },
      ALLFLAG: false,
    });
    if (!isEmptyArray(salesLevels)) {
      setSalesLevels(salesLevels);
    }
  };

  useEffect(() => {
    loadAuthType();
    loadSaleLevel();
  }, []);

  useEffect(() => {
    //console.log("userId watch!!!!", watch("userId"));
    loadAuthType();
  }, [watch("userId")]);

  useEffect(() => {
    if (salesLevels && salesLevels.length > 0) {
      setValue("salesLevel", salesLevels[1].value);
    }
  }, [salesLevels]);

  useEffect(() => {
    if (authTypes && authTypes.length > 0) {
      setValue("authType", authTypes[0].value);
    }
  }, [authTypes]);

  useEffect(() => {
    if (grid1) {
      setViewInfo(vom.active, "globalButtons", globalButtons);
      loadGrid1Data();
    }
    if (grid1 && grid2) {
      loadGrid2Data();
    }
  }, [grid1, grid2]);

  useEffect(() => {
    if (grid2) {
      loadGrid2Data();
    }
  }, [grid2]);

  const afterGridCreate1 = (gridObj) => {
    //gridView, dataProvider
    setGrid1(gridObj);
    gridObj.gridView.setEditOptions({
      insertable: false,
      appendable: false,
    });
    gridObj.gridView.setCheckBar({ visible: true });

    gridObj.gridView.displayOptions.fitStyle = "fill";

    gridObj.gridView.onItemChecked = function (grid) {
      //, item, checked
      setChkRowCnt(grid.getCheckedItems().length);
    };
    gridObj.gridView.onItemAllChecked = function (grid, checked) {
      setChkRowCnt(checked ? 1 : 0);
    };
  };

  const afterGridCreate2 = (gridObj) => {
    //, gridView, dataProvider
    setGrid2(gridObj);
    gridComboLoad(gridObj, {
      PROCEDURE_NAME: "SP_UI_DP_00_LV_CD_Q1",
      URL: "common/combos",
      CODE_VALUE: "ID",
      CODE_LABEL: "CD_NM",
      COLUMN: "AUTH_TP_ID",
      PROP: "lookupData",
      PARAM_KEY: ["P_LV_TP", "P_ACCOUNT_LV_YN"],
      PARAM_VALUE: ["S", "Y"],
      TRANSLANG_LABEL: false,
    });
    gridComboLoad(gridObj, {
      PROCEDURE_NAME: "SP_UI_DP_00_LV_CD_Q1",
      URL: "common/combos",
      CODE_VALUE: "CD",
      CODE_LABEL: "CD_NM",
      COLUMN: "LV_CD",
      PROP: "lookupData",
      PARAM_KEY: ["P_LV_TP", "P_ACCOUNT_LV_YN"],
      PARAM_VALUE: ["S", "Y"],
      TRANSLANG_LABEL: false,
    });
    gridObj.gridView.displayOptions.fitStyle = "fill";
    gridObj.gridView.setCheckBar({ visible: true });
    gridObj.gridView.setStateBar({ visible: true });
  };

  const reloadPrefInfo = (viewCd, userName, grid, grpCd) => {
    //gridCd
    if (grid) {
      grid.loadCrossTabInfoAndPrefInfo(viewCd, grpCd, userName);
    }
  };

  return (
    <>
      <ContentInner>
        <SearchArea>
          <InputField name="salesLevel" label={transLangKey("SALES_LV")} type="select" control={control} options={salesLevels} />
          {salesLevels.length > 0 && salesLevels[salesLevels.length - 1].value === watch("salesLevel") ? (
            <InputField
              name="accountCd"
              label={transLangKey("ACCOUNT_CD")}
              control={control}
              onClick={() => {
                setAccountPopupOpen(true);
              }}>
              <Icon.Search />
            </InputField>
          ) : (
            ""
          )}
          <CommonButton
            onClick={() => {
              loadGrid1Data();
            }}>
            <Icon.Search />
          </CommonButton>
        </SearchArea>
        <ResultArea>
          <BaseGrid id="grid1" items={grid1Items} viewCd={vom.active} userName={username} gridCd="UI_DP_14-RST_CPT_01" afterGridCreate={afterGridCreate1} />
          <Box>
            <ButtonArea>
              <LeftButtonArea>
                <InputField
                  type={"action"}
                  name={"userId"}
                  label={transLangKey("USER_ID")}
                  control={control}
                  readonly={true}
                  onClick={() => {
                    setUserPopupOpen(true);
                  }}>
                  <Icon.Search />
                </InputField>
                <InputField name={"empNm"} label={transLangKey("EMP_NM")} control={control} readonly={true} />
                <InputField type={"select"} name={"authType"} label={transLangKey("AUTH_TP_NM")} control={control} options={authTypes} />
              </LeftButtonArea>
              <RightButtonArea>
                <ButtonGroup>
                  <CommonButton
                    onClick={() => {
                      loadGrid2Data();
                    }}>
                    <Icon.Search />
                  </CommonButton>
                  {chkRowCnt > 0 && <GridAddRowButton grid="grid2" type="icon" onBeforeAdd={getNewGridData} />}
                  <GridDeleteRowButton grid="grid2" type="icon" onDelete={onDelete} />
                  <GridSaveButton grid="grid2" type="icon" onClick={() => saveData(grid2)} />
                </ButtonGroup>
              </RightButtonArea>
            </ButtonArea>
            <BaseGrid id="grid2" items={grid2Items} viewCd={vom.active} userName={username} gridCd="UI_DP_14-RST_CPT_02" afterGridCreate={afterGridCreate2} />
          </Box>
        </ResultArea>
        <StatusArea show={false} message={message}>
          <GridCnt grid="grid2" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")} />
        </StatusArea>
      </ContentInner>
      {userPopupOpen && <PopSelectUser open={userPopupOpen} onClose={() => setUserPopupOpen(false)} confirm={setUserCd} multiple={false} />}
      {accountPopupOpen && <PopSelectAccount open={accountPopupOpen} onClose={() => setAccountPopupOpen(false)} confirm={setAccountCd} />}
      <PopPersonalize open={personalizeOpen} onClose={() => setPersonalizeOpen(false)} resetCallback={reloadPrefInfo} viewCd={vom.active} grid={[grid1, grid2]} username={username} />
    </>
  );
}

export default UserAccountMap;
