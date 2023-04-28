import React, { useState, useEffect } from "react";
import PopupDialog from "@zionex/wingui-core/src/component/PopupDialog";
import { useForm } from "react-hook-form";
import { Box } from "@mui/material";
import { SearchArea, InputField, BaseGrid, CommonButton, useViewStore, useUserStore, zAxios } from "@zionex/wingui-core/src/common/imports";
import PropTypes from "prop-types";
import { baseURI, setVisibleProps, showMessage, transLangKey } from "@wingui";

function PopSelectUser(props) {
  const popupGrid1Items = [
    {
      name: "ID",
      dataType: "text",
      headerText: "ID",
      visible: false,
      editable: false,
      textAlignment: "center",
      width: 100,
    },
    {
      name: "USER_ID",
      dataType: "text",
      headerText: "USER_ID",
      visible: true,
      editable: false,
      width: 100,
      textAlignment: "center",
    },
    {
      name: "EMP_NM",
      dataType: "text",
      headerText: "USER_NM",
      visible: true,
      editable: false,
      width: 100,
      textAlignment: "center",
    },
  ];

  const [grid, setGrid] = useState(null);
  const [username, displayName, systemAdmin] = useUserStore((state) => [state.username, state.displayName, state.systemAdmin]);

  const [viewData, getViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo]);
  const { handleSubmit, control, getValues, clearErrors } = useForm({
    defaultValues: {
      displayName: "",
      username: "",
    },
  });

  useEffect(() => {
    const grdObjPopup = getViewInfo(vom.active, `${props.id}_PopSelectUserGrid`);
    if (grdObjPopup) {
      if (grdObjPopup.dataProvider) {
        if (grid !== grdObjPopup) setGrid(grdObjPopup);
      }
    }
  }, [viewData]);

  useEffect(() => {
    if (grid) {
      setOptions();
      loadUsers();
    }
  }, [grid]);

  const loadUsers = () => {
    let param = new URLSearchParams();
    param.append("SP_UI_DP_00_POPUP_USER_Q1_01", getValues("username"));
    param.append("SP_UI_DP_00_POPUP_USER_Q1_02", getValues("displayName"));
    param.append("USER_ID", username);
    param.append("timeout", 0);
    zAxios({
      method: "post",
      url: "engine/dp/SRV_GET_SP_UI_DP_00_POPUP_USER_Q1",
      data: param,
    })
      .then(function (res) {
        if (res.data && res.data.length === 0) {
          grid.gridView.setDisplayOptions({ showEmptyMessage: true, emptyMessage: transLangKey("MSG_NO_DATA") });
        }
        grid.dataProvider.fillJsonData(res.data.RESULT_DATA);
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {});
  };

  const setOptions = () => {
    setVisibleProps(grid, true, true, true);
    grid.gridView.setDisplayOptions({ fitStyle: "evenFill" });

    //하나의 행만 체크 가능
    if (props.multiple === false) {
      grid.gridView.setCheckBar({
        exclusive: true,
      });
    }
    grid.gridView.onCellDblClicked = function (clickData, itemIndex) {
      let checkedRows = [];

      checkedRows.push(grid.dataProvider.getJsonRow(itemIndex.dataRow));

      props.confirm(checkedRows);
      props.onClose(false);
    };
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

  const saveSubmit = () => {
    let checkedRows = [];

    grid.gridView.getCheckedRows().forEach(function (index) {
      checkedRows.push(grid.dataProvider.getJsonRow(index));
    });
    props.confirm(checkedRows);
    props.onClose(false);
  };

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="USER_POP" resizeHeight={500} resizeWidth={600}>
      <SearchArea>
        <InputField name="username" displaySize="small" label={transLangKey("USER_ID")} readonly={false} disabled={false} control={control} />
        <InputField name="displayName" displaySize="small" label={transLangKey("USER_NM")} control={control} readonly={false} disabled={false} />
        <CommonButton title={transLangKey("SEARCH")} onClick={() => loadUsers()}>
          <Icon.Search />
        </CommonButton>
      </SearchArea>
      <Box style={{ height: "100%" }}>
        <BaseGrid id={`${props.id}_PopSelectUserGrid`} items={popupGrid1Items} />
      </Box>
    </PopupDialog>
  );
}

PopSelectUser.propTypes = {
  groupName: PropTypes.string,
  username: PropTypes.string,
};

PopSelectUser.displayName = "PopSelectUser";

export default PopSelectUser;
