import React, { useState, useEffect } from "react";
import PopupDialog from "@zionex/wingui-core/src/component/PopupDialog";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { SearchArea, InputField, BaseGrid, useViewStore, zAxios, useUserStore } from "@zionex/wingui-core/src/common/imports";
import { transLangKey } from "@wingui";

let popupGrid1Items = [
  {
    name: 'PLNT_GROUP', dataType: 'group', orientation: 'horizontal', headerText: 'HOBL_FP_PLNT', headerVisible: true,
    childs: [
      { name: "PLNT_CD", dataType: "text", headerText: "HOBL_FP_CODE", visible: true, editable: false, width: 80, textAlignment: "center" },
      { name: "PLNT_NM", dataType: "text", headerText: "HOBL_FP_NAME", visible: true, editable: false, width: 200, textAlignment: "near" },
      { name: "PRDT_PLNT_YN", dataType: "boolean", headerText: "HOBL_FP_PRDT_PLNT_YN", visible: true, editable: false, width: 100, textAlignment: "center" },
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

function PopSelectPlnt(props) {
  const [username] = useUserStore((state) => [state.username]);
  const [plntSelectGrid, setPlntSelectGrid] = useState(null);

  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const { handleSubmit, getValues, setValue, control, clearErrors } = useForm({
    defaultValues: {
      
    },
  });

  const globalButtons = [
    {
      name: "search",
      action: (e) => {
        loadPopupPlnt();
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
    const grdObjPopup = getViewInfo(vom.active, `${props.id}_PopSelectPlntGrid`);
    if (grdObjPopup) {
      if (grdObjPopup.dataProvider) {
        if (plntSelectGrid !== grdObjPopup) setPlntSelectGrid(grdObjPopup);
      }
    }
  }, [viewData]);

  useEffect(() => {
    if (plntSelectGrid) {
      //setViewInfo(vom.active, "globalButtons", globalButtons);

      // loadPopupplnt(getValues());
      setGridOptions();
    }
  }, [plntSelectGrid]);

  const setGridOptions = () => {
    setVisibleProps(plntSelectGrid, true, true, true);
    plntSelectGrid.dataProvider.setOptions({ restoreMode: "auto" });
    plntSelectGrid.gridView.setFooters({ visible: false });
    plntSelectGrid.gridView.setStateBar({ visible: false });
    plntSelectGrid.gridView.setEditOptions({ insertable: false, appendable: false });
    plntSelectGrid.gridView.setDisplayOptions({
      fitStyle: "evenFill",
    });

    plntSelectGrid.gridView.onCellDblClicked = function (clickData, plntIndex) {
      let checkedRows = [];

      checkedRows.push(plntSelectGrid.dataProvider.getJsonRow(plntIndex.dataRow));

      props.confirm(checkedRows);
      props.onClose(false);
    };
    plntSelectGrid.gridView.setCheckBar({ exclusive: props.multiple });
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

  const loadPopupPlnt = (data) => {
    plntSelectGrid.gridView.showToast(progressSpinner + "Load Data...", true);
    plntSelectGrid.gridView.commit(true);

    let params = {
      'P_USER_ID': username,
      'P_USER_ID': props.viewId,
    }

    zAxios({
      fromPopup: true,
      method: 'post',
      headers: { 'content-type': 'application/json' },
      url: baseURI() + 'fp/co/HOBL_FP_UI_PLNT_POPUP/q1',
      data: params
    })
    .then(function (res) {
      plntSelectGrid.dataProvider.fillJsonData(res.data);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      plntSelectGrid.gridView.hideToast();
      plntSelectGrid.gridView.setAllCheck(false, false);
    });
  };

  const onPopupSubmit = (data) => {
    loadPopupPlnt(data);
  };

  // popup 확인
  const saveSubmit = () => {
    let checkedRows = [];

    plntSelectGrid.gridView.getCheckedRows().forEach(function (index) {
      checkedRows.push(plntSelectGrid.dataProvider.getJsonRow(index));
    });
    props.confirm(checkedRows);
    props.onClose(false);
  };

  return (
    <PopupDialog open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title="PLNT_POP" checks={[plntSelectGrid]} resizeHeight={400} resizeWidth={1000}>
      <SearchArea submit={handleSubmit(onPopupSubmit, onError)} searchButton={true}>
      </SearchArea>
      <Box style={{ height: "100%" }}>
        <BaseGrid id={`${props.id}_PopSelectPlntGrid`} items={popupGrid1Items} />
      </Box>
    </PopupDialog>
  );
}

PopSelectPlnt.propTypes = {
  // itemCd: PropTypes.string,
  // itemType: PropTypes.string,
};

PopSelectPlnt.displayName = "PopSelectPlnt";

export default PopSelectPlnt;
