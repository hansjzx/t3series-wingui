import React, { useState, useEffect } from "react";
import PopupDialog from "@zionex/wingui-core/src/component/PopupDialog";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { SearchArea, InputField, BaseGrid, zAxios, ResultArea, CommonButton, RightButtonArea, LeftButtonArea, ButtonArea } from "@zionex/wingui-core/src/common/imports";
import { transLangKey } from "@wingui";
import { loadOption, isEmptyArray, isEmpty } from "@wingui/view/demandplan/DpUtil";
import PopSelectAccount from "@wingui/view/common/PopSelectAccount";

let popupItemGridItems = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: "200" },
  { name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: "90" },
  { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: "160" },
  { name: "UOM_CD", dataType: "text", headerText: "UOM_CD", visible: false, editable: false, width: "80" },
  { name: "UOM_NM", dataType: "text", headerText: "UOM", visible: false, editable: false, width: "80" },
  { name: "PARENT_ITEM_LV_NM", dataType: "text", headerText: "PARENT_ITEM_LV_NM", visible: true, editable: false, width: "120" },
  { name: "RTS", dataType: "datetime", headerText: "STRT_DATE_SALES", visible: true, editable: false, width: "110", format: "yyyy-MM-dd" },
  { name: "EOS", dataType: "datetime", headerText: "END_DATE_SALES", visible: true, editable: false, width: "110", format: "yyyy-MM-dd" },
];

// let popupAcctGridItems = [
//   { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: "200" },
//   { name: "ACCOUNT_CD", dataType: "text", headerText: "ACCOUNT_CD", visible: true, editable: false, width: "90" },
//   { name: "ACCOUNT_NM", dataType: "text", headerText: "ACCOUNT_NM", visible: true, editable: false, width: "160" },
//   { name: "PARENT_SALES_LV_NM", dataType: "text", headerText: "PARENT_SALES_LV_NM", visible: true, editable: false, width: "120" },
// ];

let popupMapGridItems = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: "200" },
  { name: "ACCOUNT_ID", dataType: "text", headerText: "ACCOUNT_ID", visible: false, editable: false, width: "90" },
  { name: "ACCOUNT_CD", dataType: "text", headerText: "ACCOUNT_CD", visible: true, editable: false, width: "100" },
  { name: "ACCOUNT_NM", dataType: "text", headerText: "ACCOUNT_NM", visible: true, editable: false, width: "160" },
  { name: "ITEM_MST_ID", dataType: "text", headerText: "ITEM_ID", visible: false, editable: false, width: "90" },
  { name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: "100" },
  { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: "160" },
];

function PopMultiMap(props) {
  const [itemSelectGrid, setItemSelectGrid] = useState(null);
  const [mapGrid, setMapGrid] = useState(null);

  const [accountPopupOpen, setAccountPopupOpen] = useState(false);

  const [itemLevelOption, setItemLevelOption] = useState([]);

  const { getValues, setValue, control } = useForm({
    defaultValues: {
      popItemCd: "",
      popItemNm: "",
      popItemLvCd: "",
    },
  });

  const loadItemLevel = async () => {
    const options = await loadOption(true, "SRV_GET_SP_UI_DP_00_USER_ITEM_LV_Q1", { EMP_NO: "", AUTH_TP_ID: "", LEAF_YN: "Y", TYPE: "" }, "CD", "CD_NM", true, true);

    if (!isEmptyArray(options)) {
      setItemLevelOption(options);
      setValue("popItemLvCd", options[0].value);
    }
  };

  useEffect(() => {
    loadItemLevel();
  }, []);

  const loadPopupItem = () => {
    itemSelectGrid.gridView.showToast(progressSpinner + "Load Data...", true);
    let param = new URLSearchParams();
    param.append("ITEM_CD", getValues("popItemCd"));
    param.append("ITEM_NM", getValues("popItemNm"));
    param.append("ITEM_LV_CD", getValues("popItemLvCd") === "ALL" ? "" : getValues("popItemLvCd"));
    param.append("timeout", 0);
    zAxios({
      method: "post",
      header: { "content-type": "application/json" },
      url: "engine/dp/SRV_GET_SP_UI_DP_00_POPUP_ITEM_Q1",
      data: param,
    })
      .then((res) => {
        itemSelectGrid.setData(res.data.RESULT_DATA);
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => {
        itemSelectGrid.gridView.hideToast();
      });
  };

  // const loadPopupAccount = () => {
  //   accountSelectGrid.gridView.showToast(progressSpinner + "Load Data...", true);
  //   let param = new URLSearchParams();
  //   param.append("ACCT_CD", getValues("popAccountCd"));
  //   param.append("ACCT_NM", getValues("popAccountNm"));
  //   param.append("SALES_LV_CD", getValues("popSalesLvCd"));
  //   param.append("timeout", 0);
  //   zAxios({
  //     method: "post",
  //     header: { "content-type": "application/json" },
  //     url: "engine/dp/SRV_GET_SP_UI_DP_00_POPUP_ACCOUNT_Q1",
  //     data: param,
  //   })
  //     .then(function (res) {
  //       let resultData = res.data.RESULT_DATA;
  //       accountSelectGrid.setData(resultData);
  //     })
  //     .catch(function (err) {
  //       console.log(err);
  //     })
  //     .then(function () {
  //       accountSelectGrid.gridView.hideToast();
  //     });
  // };

  const afterGridCreate1 = (gridObj) => {
    //, gridView, dataProvider
    setItemSelectGrid(gridObj);
    gridObj.gridView.setEditOptions({
      insertable: false,
      appendable: false,
    });
    gridObj.gridView.setCheckBar({ visible: true });

    gridObj.gridView.displayOptions.fitStyle = "fill";
  };

  // const afterGridCreate2 = (gridObj, gridView, dataProvider) => {
  //   setAccountSelectGrid(gridObj);
  //   gridObj.gridView.setEditOptions({
  //     insertable: false,
  //     appendable: false,
  //   });
  //   gridObj.gridView.setCheckBar({ visible: true });

  //   gridObj.gridView.displayOptions.fitStyle = "fill";
  // };

  const afterGridCreate3 = (gridObj) => {
    //, gridView, dataProvider
    setMapGrid(gridObj);
    gridObj.gridView.setEditOptions({
      insertable: false,
      appendable: false,
    });
    gridObj.gridView.setCheckBar({ visible: true });
    gridObj.gridView.setStateBar({ visible: true });

    gridObj.gridView.displayOptions.fitStyle = "fill";
  };

  const setAccountCd = (accounts) => {
    if (accounts.length > 0) {
      setValue("popAccountId", accounts[0].ID);
      setValue("popAccountCd", accounts[0].ACCOUNT_CD);
      setValue("popAccountNm", accounts[0].ACCOUNT_NM);
    }
  };

  const makeData = () => {
    //showMessage(transLangKey("WARNING"), "msgg.......", { close: false });
    const checkedRows = itemSelectGrid.gridView.getCheckedRows();
    if (checkedRows.length === 0) {
      showMessage(transLangKey("WARNING"), "Item is not checked", { close: false });
      return;
    }
    const accountId = getValues("popAccountId");
    const accountCd = getValues("popAccountCd");
    const accountNm = getValues("popAccountNm");
    if (isEmpty(accountId)) {
      showMessage(transLangKey("WARNING"), "Account is not Selected", { close: false });
      return;
    }
    let combination = [];
    const oldRowKeys = mapGrid.dataProvider.getJsonRows().map((rw) => rw["ITEM_MST_ID"] + rw["ACCOUNT_ID"]);
    checkedRows.forEach((indx) => {
      const row = itemSelectGrid.dataProvider.getJsonRow(indx);

      if (oldRowKeys.findIndex((key) => key === row["ID"] + accountId) === -1) {
        let newRow = {};
        newRow["ID"] = generateId();
        newRow["ACCOUNT_ID"] = accountId;
        newRow["ACCOUNT_CD"] = accountCd;
        newRow["ACCOUNT_NM"] = accountNm;
        newRow["ITEM_MST_ID"] = row.ID;
        newRow["ITEM_CD"] = row.ITEM_CD;
        newRow["ITEM_NM"] = row.ITEM_NM;
        newRow["ACTV_YN"] = true;
        combination.push(newRow);
      }
    });
    mapGrid.dataProvider.addRows(combination);
  };

  const removeData = () => {
    mapGrid.dataProvider.setOptions({ softDeleting: false });

    const deletes = mapGrid.gridView.getCheckedRows();
    if (deletes.length === 0) {
      showMessage(transLangKey("WARNING"), transLangKey("MSG_5112"), { close: false });
      return;
    }
    mapGrid.dataProvider.removeRows(deletes);
  };

  const saveData = () => {
    if (isEmpty(props.authTp)) {
      showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5049"));
    } else {
      mapGrid.gridView.commit(true);
      showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), (answer) => {
        if (answer) {
          let changes = mapGrid.dataProvider.getJsonRows(0, mapGrid.dataProvider.getRowCount());

          if (changes.length === 0) {
            showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"));
          } else {
            mapGrid.gridView.showToast(progressSpinner + "Saving data...", true);

            let param = new URLSearchParams();
            param.append("OPERATOR_ID", props.operationId);
            param.append("AUTH_TP_ID", props.authTp);
            param.append("CHANGE_TYPE", "CHANGE");
            param.append("changes", JSON.stringify(changes));
            param.append("USER_ID", username);

            zAxios({
              method: "post",
              url: baseURI() + "engine/dp/SRV_SET_SP_UI_DP_15_S1",
              data: param,
            })
              .then((response) => {
                if (response.status === gHttpStatus.SUCCESS) {
                  const rsData = response.data;
                  if (rsData.RESULT_SUCCESS) {
                    const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_15_S1_P_RT_MSG"];
                    if (resultMSG !== "MSG_0001") showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
                  } else {
                    showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
                  }
                }
              })
              .catch((err) => {
                console.log(err);
              })
              .then(() => {
                mapGrid.gridView.hideToast();
                mapGrid.dataProvider.clearRowStates();
              });
          }

          props.onClose(false);
        }
      });
    }
  };

  return (
    <>
      <PopupDialog type="NOBUTTONS" open={props.open} onClose={props.onClose} title={transLangKey("DP_COMBI_GEN")} checks={[mapGrid]} resizeHeight={800} resizeWidth={1100}>
        <SearchArea>
          <InputField name="popItemCd" label={transLangKey("ITEM_CD")} readonly={false} disabled={false} control={control} />
          <InputField name="popItemNm" label={transLangKey("ITEM_NM")} control={control} readonly={false} disabled={false} />
          <InputField type="select" name="popItemLvCd" label={transLangKey("ITEM_LV_CD")} control={control} readonly={false} disabled={false} options={itemLevelOption} />
          <CommonButton
            title="Search"
            onClick={() => {
              loadPopupItem();
            }}>
            <Icon.Search />
          </CommonButton>
        </SearchArea>
        <ResultArea sizes={[45, 45]}>
          <Box>
            <BaseGrid id={`${props.id}_PopItemGrid`} items={popupItemGridItems} viewCd={vom.active} gridCd="RST_CPT_01" afterGridCreate={afterGridCreate1} />
          </Box>
          <Box>
            <Box>
              <ButtonArea style={{ width: "90%" }}>
                <LeftButtonArea>
                  <InputField name="popAccountId" label={transLangKey("ACCOUNT_ID")} readonly={false} disabled={false} style={{ display: "none" }} control={control} />
                  <InputField name="popAccountCd" label={transLangKey("ACCOUNT_CD")} readonly={false} disabled={false} control={control} />
                  <InputField name="popAccountNm" label={transLangKey("ACCOUNT_NM")} control={control} readonly={false} disabled={false} />
                  <CommonButton
                    title="Search"
                    onClick={() => {
                      //loadPopupAccount();
                      setAccountPopupOpen(true);
                    }}>
                    <Icon.Search />
                  </CommonButton>
                </LeftButtonArea>
                <RightButtonArea>
                  <CommonButton
                    type="icon"
                    title="make"
                    style={{ width: "120px", p: 1, border: "1px dashed grey", marginRight: "250px" }}
                    onClick={() => {
                      makeData();
                    }}>
                    <Icon.ChevronsDown />
                  </CommonButton>
                  <CommonButton
                    title="minus"
                    onClick={() => {
                      removeData();
                    }}>
                    <Icon.Minus />
                  </CommonButton>
                  <CommonButton
                    title="plus"
                    onClick={() => {
                      saveData();
                    }}>
                    <Icon.Save />
                  </CommonButton>
                </RightButtonArea>
              </ButtonArea>
            </Box>
            <BaseGrid id={`${props.id}_PopMapGrid`} items={popupMapGridItems} viewCd={vom.active} gridCd="RST_CPT_03" afterGridCreate={afterGridCreate3} />
          </Box>
        </ResultArea>
      </PopupDialog>
      {accountPopupOpen && <PopSelectAccount open={accountPopupOpen} onClose={() => setAccountPopupOpen(false)} confirm={setAccountCd} />}
    </>
  );
}

PopMultiMap.propTypes = {
  operationId: PropTypes.string,
  authTp: PropTypes.string,
};

PopMultiMap.displayName = "PopMultiMap";

export default PopMultiMap;
