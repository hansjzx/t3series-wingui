import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Box, FormControlLabel, IconButton, Switch, TextField } from "@mui/material";
import {
  InputField, useViewStore, useIconStyles, PopupDialog, SearchArea, SearchRow, BaseGrid, useInputStyles, zAxios
} from '@zionex/wingui-core/src/common/imports';

const popupGrid1Items = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 100 },
  { name: "username", dataType: "text", headerText: "USER_ID", editable: false, width: 100 },
  { name: "displayName", dataType: "text", headerText: "USER_NM", editable: false, width: 100 },
  { name: "department", dataType: "text", headerText: "DEPARTMENT", editable: false, width: 100 },
  { name: "businessValue", dataType: "text", headerText: "BUSINESS", editable: false, width: 100 },
];

function PopNoticeSetting(props) {
  const classes = useInputStyles();
  const [userSelectGrid, setUserSelectGrid] = useState(null);
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo])
  const { handleSubmit, getValues, control, setValue, formState: { errors }, clearErrors } = useForm({
    defaultValues: {
      newContentsRangeDays: 1,
      badgeOn: true
    }
  });

  useEffect(() => {
    const grdObjPopup = getViewInfo(vom.active, 'userSelectGrid');
    if (grdObjPopup) {
      if (grdObjPopup.dataProvider) {
        if (userSelectGrid != grdObjPopup)
          setUserSelectGrid(grdObjPopup);
      }
    }
  }, [viewData]);

  useEffect(() => {
    if (userSelectGrid) {
      popupLoadData();
      settingOption();
    }
  }, [userSelectGrid]);

  const settingOption = () => {
    userSelectGrid.gridView.setCheckBar({ visible: true })
  }
  const onError = (errors, e) => {
    if (typeof errors !== "undefined" && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  const popupLoadData = () => {
    userSelectGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    axios.get(baseURI() + 'system/users/' + props.groupCode + '/except', {
      params: {
        'username': getValues("username"),
        'display-name': getValues("displayName"),
      }
    })
      .then(function (res) {
        userSelectGrid.dataProvider.fillJsonData(res.data);
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
        userSelectGrid.gridView.hideToast();
      });
  }
  // popup 확인
  const saveSubmit = () => {
    saveNoticeBoardBadge();
    props.onClose();
  }

  const saveNoticeBoardBadge = () => {
    var useYn = getValues('badgeOn') ? "Y" : "N";
    zAxios({
      method: 'post',
      headers: { 'content-type': 'application/json' },
      url: 'system/menus/badges/noticeboard',
      params: {
        USE_YN: useYn,
        EXPIRED_DAYS: getValues('newContentsRangeDays')
      }
    })
      .then(function (response) { })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
        getNoticeBoardBadge();
      });
  }

  const getNoticeBoardBadge = () => {
    zAxios.get("system/menus/badges/noticeboard", {
    }).then(function (response) {
      if (response.status === gHttpStatus.SUCCESS) {
        if (response.data != null && response.data.menuId != undefined) {
          setValue('badgeOn', true)
          setValue('NewContentsRangeDays', response.data.expiredDays);
        }
      }
    }).catch(function (err) {
      setValue('badgeOn', false)
      setValue('NewContentsRangeDays', 1);
      console.log(err);
    }).then(function () {
    })
  }
  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={saveSubmit} title={transLangKey("NOTICEBOARD_OPTION_SET")} resizeHeight={200} resizeWidth={400}>
      <Box>
        <InputField inputType="labelText" name="badgeOn" label={transLangKey("뱃지 사용")} control={control} type="component"
          childComponent={<Switch checked={getValues('badgeOn')} color="primary" />}
        />
        <InputField inputType="labelText" name="newContentsRangeDays" dataType="number" label={transLangKey("새 글 범위(일)")} control={control} type='text' />
      </Box>
    </PopupDialog>
  );
}
export default PopNoticeSetting;