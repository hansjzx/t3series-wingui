import React, { useState, useEffect, useContext, useRef } from "react";
import { Box, ButtonGroup } from "@mui/material";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import {
  ContentInner,
  ViewPath,
  ResultArea,
  SearchArea,
  StatusArea,
  ButtonArea,
  LeftButtonArea,
  RightButtonArea,
  SearchRow,
  InputField,
  CommonButton,
  GridAddRowButton,
  GridDeleteRowButton,
  GridSaveButton,
  BaseGrid,
  PopupDialog,
  GridCnt,
  useViewStore,
  useStyles,
  zAxios,
} from "@zionex/wingui-core/src/common/imports";

let popupGrid1Items = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: "200" },
  { name: "ACCOUNT_CD", dataType: "text", headerText: "ACCOUNT_CD", visible: true, editable: false, width: "100", textAlignment: "center" },
  { name: "ACCOUNT_NM", dataType: "text", headerText: "ACCOUNT_NM", visible: true, editable: false, width: "100", textAlignment: "center" },
];

function PopSelectSalesLvAccount(props) {
  // const refPopupGrid1 = useRef({});
  const [accountSelectGrid, setAccountSelectGrid] = useState(null);

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
      accountCd: "",
      accountNm: "",
    },
  });

  const globalButtons = [
    {
      name: "search",
      action: (e) => {
        loadPopupItem();
      },
      visible: true,
      disable: false,
    },
    {
      name: "save",
      action: (e) => {},
      visible: false,
      disable: false,
    },
    {
      name: "refresh",
      action: (e) => {
        reset();
      },
      visible: false,
      disable: false,
    },
  ];

  useEffect(() => {
    const grdObjPopup = getViewInfo(vom.active, `${props.id}_PopSelectSalesLvAccountGrid`);
    if (grdObjPopup) {
      if (grdObjPopup.dataProvider) {
        if (accountSelectGrid != grdObjPopup) setAccountSelectGrid(grdObjPopup);
      }
    }
  }, [viewData]);

  useEffect(() => {
    if (accountSelectGrid) {
      popupLoadData(getValues());
      setOptions();
    }
  }, [accountSelectGrid]);

  const setOptions = () => {
    accountSelectGrid.dataProvider.setOptions({ restoreMode: "auto" });
    accountSelectGrid.gridView.setFooters({ visible: false });
    accountSelectGrid.gridView.setStateBar({ visible: false });
    accountSelectGrid.gridView.setEditOptions({ insertable: false, appendable: false });
    accountSelectGrid.gridView.setDisplayOptions({
      fitStyle: "evenFill",
    });
    accountSelectGrid.gridView.setCheckBar({ exclusive: props.multiple });

    //double click 시 선택
    accountSelectGrid.gridView.onCellDblClicked = function (grid, clickData) {
      let focusCell = accountSelectGrid.gridView.getCurrent();
      let targetRow = focusCell.dataRow;
      props.confirm([accountSelectGrid.dataProvider.getJsonRow(targetRow)]);
      props.onClose(false);
    };
  };
  const onError = (errors, e) => {
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey("WARNING"), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  };

  const popupLoadData = (data) => {
    let param = new URLSearchParams();
    param.append("LV_MGMT_ID", props.values);
    param.append("ACCOUNT_CD", data.accountCd);
    param.append("ACCOUNT_NM", data.accountNm);
    param.append("ITEM_CD", props.itemCd ? props.itemCd : "");
    zAxios({
      method: "post",
      url: "engine/dp/SRV_GET_UI_BF_00_POPUP_ACCT_Q1",
      data: param,
    })
      .then(function (res) {
        accountSelectGrid.dataProvider.fillJsonData(res.data.RESULT_DATA);
        //         let resultData = res.data.RESULT_DATA;
        //         if(resultData  && resultData.length  == 0) {
        //           showMessage(transLangKey('WARNING'), transLangKey('MSG_NO_DATA'), { close: false })
        //         }
        //         else {
        //           accountSelectGrid.dataProvider.fillJsonData(res.data.RESULT_DATA);
        //         }
      })
      .catch(function (err) {
        console.log(err);
      });
  };
  // popup 확인
  const saveSubmit = () => {
    let checkedRows = [];

    accountSelectGrid.gridView.getCheckedRows().forEach(function (index) {
      checkedRows.push(accountSelectGrid.dataProvider.getJsonRow(index));
    });
    props.confirm(checkedRows);
    props.onClose(false);
  };

  const onPopupSubmit = (data) => {
    popupLoadData(data);
  };

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="ACCOUNT_POP" resizeHeight={400} resizeWidth={550}>
      <SearchArea submit={handleSubmit(onPopupSubmit, onError)} searchButton={true}>
        <InputField name="accountCd" label={transLangKey("ACCOUNT_CD")} readonly={false} disabled={false} control={control} />
        <InputField name="accountNm" label={transLangKey("ACCOUNT_NM")} control={control} readonly={false} disabled={false} />
      </SearchArea>
      <Box style={{ height: "100%" }}>
        <BaseGrid id={`${props.id}_PopSelectSalesLvAccountGrid`} items={popupGrid1Items}></BaseGrid>
      </Box>
    </PopupDialog>
  );
}

PopSelectSalesLvAccount.propTypes = {
  accountCd: PropTypes.string,
  accountNm: PropTypes.string,
};

PopSelectSalesLvAccount.displayName = "PopSelectSalesLvAccount";

export default PopSelectSalesLvAccount;
