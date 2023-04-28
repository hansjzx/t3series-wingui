import React, { useState, useEffect } from "react";
import PopupDialog from "@zionex/wingui-core/src/component/PopupDialog";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { SearchArea, InputField, BaseGrid, useViewStore, zAxios, useUserStore } from "@zionex/wingui-core/src/common/imports";
import { transLangKey } from "@wingui";

let popupGrid1Items = [
  {
    name: 'CUST_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'HOBL_FP_CUST', headerVisible: true,
    childs: [
      { name: "CUST_CD", dataType: "text", headerText: "HOBL_FP_CODE", visible: true, editable: false, width: 80, textAlignment: "center" },
      { name: "CUST_NM", dataType: "text", headerText: "HOBL_FP_NAME", visible: true, editable: false, width: 150, textAlignment: "near" },
    ]
  },
  { name: "DO_EX_SE", dataType: "text", headerText: "HOBL_FP_DO_EX_SE", visible: true, editable: false, width: 80, textAlignment: "center" },
  { name: "DC_CD", dataType: "text", headerText: "HOBL_FP_DC_CD", visible: true, editable: false, width: 80, textAlignment: "center" },
  { name: "COUNTRY_CD", dataType: "text", headerText: "HOBL_FP_COUNTRY_CD", visible: true, editable: false, width: 80, textAlignment: "center" },
];

function PopSelectAccount(props) {
  const [username] = useUserStore((state) => [state.username]);
  const [accountSelectGrid, setAccountSelectGrid] = useState(null);
  const [option1, setOption1] = useState([]);

  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const { handleSubmit, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      accountCd: "",
      doExSe: "",
    },
  });

  const globalButtons = [
    {
      name: "search",
      action: (e) => {
        loadPopupAccount();
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
    async function loadAsyncList() {
      const arr = await loadComboList({
        PROCEDURE_NAME: "PR_SC_UI_COMMON_CODE_Q01",
        URL: "common/combos",
        CODE_KEY: "CODE",
        CODE_VALUE: "NAME",
        PARAM: {"P_CODE": "ITEM_TYPE_LIST", "P_ATTR1": "", "P_ATTR2": "", "P_ATTR3": "", "P_ATTR4": "", "P_ATTR5": "","P_UI_ID": "HOBL_FP_UI_1000"},
        ALLFLAG: true,
        TRANSLANG_LABEL: true,
      });
      setOption1(arr);
      setValue("itemType", arr[0].value);
    }
    loadAsyncList();
  }, []);

  useEffect(() => {
    const grdObjPopup = getViewInfo(vom.active, `${props.id}_PopSelectAccountGrid`);
    if (grdObjPopup) {
      if (grdObjPopup.dataProvider) {
        if (accountSelectGrid !== grdObjPopup) setAccountSelectGrid(grdObjPopup);
      }
    }
  }, [viewData]);

  useEffect(() => {
    if (accountSelectGrid) {
      //setViewInfo(vom.active, "globalButtons", globalButtons);

      // loadPopupItem(getValues());
      setGridOptions();
      onPopupSubmit();
    }
  }, [accountSelectGrid]);

  const setGridOptions = () => {
    setVisibleProps(accountSelectGrid, true, true, true);
    accountSelectGrid.dataProvider.setOptions({ restoreMode: "auto" });
    accountSelectGrid.gridView.setFooters({ visible: false });
    accountSelectGrid.gridView.setStateBar({ visible: false });
    accountSelectGrid.gridView.setEditOptions({ insertable: false, appendable: false });
    accountSelectGrid.gridView.setDisplayOptions({
      fitStyle: "evenFill",
    });

    accountSelectGrid.gridView.onCellDblClicked = function (clickData, itemIndex) {
      let checkedRows = [];

      checkedRows.push(accountSelectGrid.dataProvider.getJsonRow(itemIndex.dataRow));

      props.confirm(checkedRows);
      props.onClose(false);
    };
    accountSelectGrid.gridView.setCheckBar({ exclusive: props.multiple });
  };
  const onError = (errors) => {
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey("WARNING"), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  };

  const loadPopupAccount = (data) => {
    accountSelectGrid.gridView.showToast(progressSpinner + "Load Data...", true);
    accountSelectGrid.gridView.commit(true);

    let params = {
      'P_CUST_CD': getValues('accountCd'),
      'P_DO_EX_SE': getValues('doExSe'),
      'P_USER_ID': username,
    }

    zAxios({
      fromPopup: true,
      method: 'post',
      headers: { 'content-type': 'application/json' },
      url: baseURI() + 'fp/pop/HOBL_FP_UI_ACCOUNT_POPUP/q1',
      data: params
    })
    .then(function (res) {
      accountSelectGrid.dataProvider.fillJsonData(res.data);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      accountSelectGrid.gridView.hideToast();
      // accountSelectGrid.gridView.setAllCheck(false, false);
    });
  };

  const onPopupSubmit = (data) => {
    loadPopupAccount(data);
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

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="ACCOUNT_POP" checks={[accountSelectGrid]} resizeHeight={400} resizeWidth={800}>
      <SearchArea submit={handleSubmit(onPopupSubmit, onError)} searchButton={true}>
        <InputField name="accountCd" label={transLangKey("HOBL_FP_CUST")+" "+transLangKey("HOBL_FP_CODE")+"/"+transLangKey("HOBL_FP_NAME")} readonly={false} disabled={false} control={control} />
        <InputField type="select" name="doExSe" label={transLangKey("HOBL_FP_DO_EX_SE")} control={control} readonly={false} disabled={false} options={option1} />
      </SearchArea>
      <Box style={{ height: "100%" }}>
        <BaseGrid id={`${props.id}_PopSelectAccountGrid`} items={popupGrid1Items} />
      </Box>
    </PopupDialog>
  );
}

PopSelectAccount.propTypes = {
  accountCd: PropTypes.string,
  doExSe: PropTypes.string,
};

PopSelectAccount.displayName = "PopSelectAccount";

export default PopSelectAccount;
