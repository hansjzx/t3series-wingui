import React, { useState, useEffect } from "react";
import PopupDialog from "@zionex/wingui-core/src/component/PopupDialog";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { SearchArea, InputField, BaseGrid, useViewStore, zAxios, useUserStore } from "@zionex/wingui-core/src/common/imports";
import { transLangKey } from "@wingui";

let popupGrid1Items = [
  {
    name: 'ITEM_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'HOBL_FP_ITEM', headerVisible: true,
    childs: [
      { name: "ITEM_CD", dataType: "text", headerText: "HOBL_FP_CODE", visible: true, editable: false, width: 80, textAlignment: "center" },
      { name: "ITEM_NM", dataType: "text", headerText: "HOBL_FP_NAME", visible: true, editable: false, width: 200, textAlignment: "near" },
      { name: "ITEM_TYPE", dataType: "text", headerText: "HOBL_FP_ITEM_TYPE", visible: true, editable: false, width: 80, textAlignment: "center" },
    ]
  },
  {
    name: 'USER_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'HOBL_FP_USER', headerVisible: true,
    childs: [
      { name: "INS_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: 80, textAlignment: "center" },
      { name: "INS_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: true, editable: false, width: 100, format: "yyyy-MM-dd HH:mm:ss", textAlignment: "center" },
      { name: "UPD_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 80, textAlignment: "center" },
      { name: "UPD_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 100, format: "yyyy-MM-dd HH:mm:ss", textAlignment: "center" },
    ]
  },
];

function PopSelectItem(props) {
  const [username] = useUserStore((state) => [state.username]);
  const [itemSelectGrid, setItemSelectGrid] = useState(null);
  const [option1, setOption1] = useState([]);

  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const { handleSubmit, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      itemCd: "",
      itemType: "",
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
    const grdObjPopup = getViewInfo(vom.active, `${props.id}_PopSelectItemGrid`);
    if (grdObjPopup) {
      if (grdObjPopup.dataProvider) {
        if (itemSelectGrid !== grdObjPopup) setItemSelectGrid(grdObjPopup);
      }
    }
  }, [viewData]);

  useEffect(() => {
    if (itemSelectGrid) {
      //setViewInfo(vom.active, "globalButtons", globalButtons);

      // loadPopupItem(getValues());
      setGridOptions();
    }
  }, [itemSelectGrid]);

  const setGridOptions = () => {
    setVisibleProps(itemSelectGrid, true, true, true);
    itemSelectGrid.dataProvider.setOptions({ restoreMode: "auto" });
    itemSelectGrid.gridView.setFooters({ visible: false });
    itemSelectGrid.gridView.setStateBar({ visible: false });
    itemSelectGrid.gridView.setEditOptions({ insertable: false, appendable: false });
    itemSelectGrid.gridView.setDisplayOptions({
      fitStyle: "evenFill",
    });

    itemSelectGrid.gridView.onCellDblClicked = function (clickData, itemIndex) {
      let checkedRows = [];

      checkedRows.push(itemSelectGrid.dataProvider.getJsonRow(itemIndex.dataRow));

      props.confirm(checkedRows);
      props.onClose(false);
    };
    itemSelectGrid.gridView.setCheckBar({ exclusive: props.multiple });
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

  const loadPopupItem = (data) => {
    itemSelectGrid.gridView.showToast(progressSpinner + "Load Data...", true);
    itemSelectGrid.gridView.commit(true);

    let params = {
      'P_ITEM_CD': getValues('itemCd'),
      'P_ITEM_TYPE': getValues('itemType'),
      'P_USER_ID': username,
      'P_VIEW_ID': props.viewId,
    }
    
    zAxios({
      fromPopup: true,
      method: 'post',
      headers: { 'content-type': 'application/json' },
      url: baseURI() + 'fp/co/HOBL_FP_UI_ITEM_POPUP/q1',
      data: params
    })
    .then(function (res) {
      itemSelectGrid.dataProvider.fillJsonData(res.data);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      itemSelectGrid.gridView.hideToast();
      itemSelectGrid.gridView.setAllCheck(false, false);
    });
  };

  const onPopupSubmit = (data) => {
    loadPopupItem(data);
  };

  // popup 확인
  const saveSubmit = () => {
    let checkedRows = [];

    itemSelectGrid.gridView.getCheckedRows().forEach(function (index) {
      checkedRows.push(itemSelectGrid.dataProvider.getJsonRow(index));
    });
    props.confirm(checkedRows);
    props.onClose(false);
  };

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="ITEM_POP" checks={[itemSelectGrid]} resizeHeight={400} resizeWidth={1000}>
      <SearchArea submit={handleSubmit(onPopupSubmit, onError)} searchButton={true}>
        <InputField name="itemCd" label={transLangKey("HOBL_FP_ITEM")+" "+transLangKey("HOBL_FP_CODE")+"/"+transLangKey("HOBL_FP_NAME")} readonly={false} disabled={false} control={control} />
        <InputField type="select" name="itemType" label={transLangKey("HOBL_FP_ITEM_TYPE")} control={control} readonly={false} disabled={false} options={option1} />
      </SearchArea>
      <Box style={{ height: "100%" }}>
        <BaseGrid id={`${props.id}_PopSelectItemGrid`} items={popupGrid1Items} />
      </Box>
    </PopupDialog>
  );
}

PopSelectItem.propTypes = {
  itemCd: PropTypes.string,
  itemType: PropTypes.string,
};

PopSelectItem.displayName = "PopSelectItem";

export default PopSelectItem;
