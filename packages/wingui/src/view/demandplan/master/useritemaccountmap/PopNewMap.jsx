import React, { useState, useEffect } from "react";
import PopupDialog from "@zionex/wingui-core/src/component/PopupDialog";
import { useForm } from "react-hook-form";
import PropTypes from "prop-types";
import { Box } from "@mui/material";
import { SearchArea, InputField, BaseGrid, zAxios, ResultArea, CommonButton, RightButtonArea, useUserStore, ButtonArea } from "@zionex/wingui-core/src/common/imports";
import { transLangKey } from "@wingui";
import { loadOption, isEmptyArray, isEmpty } from "@wingui/view/demandplan/DpUtil";

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

let popupMapGridItems = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: "200" },
  { name: "ACCOUNT_ID", dataType: "text", headerText: "ACCOUNT_ID", visible: false, editable: false, width: "90" },
  { name: "ACCOUNT_CD", dataType: "text", headerText: "ACCOUNT_CD", visible: true, editable: false, width: "100" },
  { name: "ACCOUNT_NM", dataType: "text", headerText: "ACCOUNT_NM", visible: true, editable: false, width: "160" },
  { name: "ITEM_MST_ID", dataType: "text", headerText: "ITEM_ID", visible: false, editable: false, width: "90" },
  { name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: "100" },
  { name: "ITEM_NM", dataType: "text", headerText: "ITEM_NM", visible: true, editable: false, width: "160" },
];

function PopNewMap(props) {
  const [username] = useUserStore((state) => [state.username]);
  const [itemSelectGrid, setItemSelectGrid] = useState(null);
  const [mapGrid, setMapGrid] = useState(null);

  const [itemLevelOption, setItemLevelOption] = useState([]);

  const { getValues, setValue, control } = useForm({
    // handleSubmit, , clearErrors
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

  const afterGridCreate1 = (gridObj) => {
    // gridView, dataProvider
    setItemSelectGrid(gridObj);
    gridObj.gridView.setEditOptions({
      insertable: false,
      appendable: false,
    });
    gridObj.gridView.setCheckBar({ visible: true, exclusive: true });

    gridObj.gridView.displayOptions.fitStyle = "fill";
  };

  const loadMapData = () => {
    let selectItemId;
    const checkedRows = itemSelectGrid.gridView.getCheckedRows();
    checkedRows.forEach((indx) => {
      const row = itemSelectGrid.dataProvider.getJsonRow(indx);
      selectItemId = row.ID;
    });

    if (isEmpty(selectItemId)) {
      showMessage(transLangKey("WARNING"), "Item is not checked", { close: false });
      return;
    }

    mapGrid.gridView.showToast(progressSpinner + "Load Data...", true);
    let param = new URLSearchParams();
    param.append("OPERATOR_ID", props.operationId);
    param.append("AUTH_TP_ID", props.authTp);
    param.append("ITEM_MST_ID", selectItemId);
    param.append("timeout", 0);
    zAxios({
      method: "post",
      url: "engine/dp/SRV_SET_SP_UI_DP_15_POP_Q1",
      data: param,
    })
      .then((res) => {
        mapGrid.dataProvider.addRows(res.data.RESULT_DATA);
      })
      .catch((err) => {
        console.log(err);
      })
      .then(() => {
        mapGrid.gridView.hideToast();
      });
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
          let mapRowData = [];
          for (let i = 0; i < mapGrid.dataProvider.getRowCount(); i++) {
            let data = mapGrid.dataProvider.getJsonRow(i);
            data.ID = generateId();
            mapRowData.push(data);
          }

          if (mapRowData.length === 0) {
            showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"));
          } else {
            mapGrid.gridView.showToast(progressSpinner + "Saving data...", true);

            let param = new URLSearchParams();
            param.append("OPERATOR_ID", props.operationId);
            param.append("AUTH_TP_ID", props.authTp);
            param.append("CHANGE_TYPE", "CHANGE");
            param.append("changes", JSON.stringify(mapRowData));
            param.append("USER_ID", username);

            zAxios({
              method: "post",
              url: baseURI() + "engine/dp/SRV_SET_SP_UI_DP_15_S1",
              data: param,
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
                mapGrid.gridView.hideToast();
                mapGrid.dataProvider.clearRowStates();
              });
          }

          props.onClose(false);
        }
      });
    }
  };

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

  return (
    <>
      <PopupDialog type="NOBUTTONS" open={props.open} onClose={props.onClose} title={transLangKey("OLD_NEW_MAP_NEW")} checks={[mapGrid]} resizeHeight={700} resizeWidth={800}>
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
          <CommonButton
            title="Save"
            style={{ marginLeft: "20px" }}
            onClick={() => {
              saveData();
            }}>
            <Icon.Save />
          </CommonButton>
        </SearchArea>
        <ResultArea sizes={[35, 55]}>
          <Box>
            <BaseGrid id={`${props.id}_PopItemGrid`} items={popupItemGridItems} viewCd={vom.active} gridCd="RST_CPT_01" afterGridCreate={afterGridCreate1} />
          </Box>
          <Box>
            <Box>
              <ButtonArea style={{ width: "90%" }}>
                <RightButtonArea>
                  <CommonButton
                    title="make"
                    style={{ width: "120px", p: 1, border: "1px dashed grey", marginRight: "250px" }}
                    onClick={() => {
                      loadMapData();
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
    </>
  );
}

PopNewMap.propTypes = {
  operationId: PropTypes.string,
  authTp: PropTypes.string,
};

PopNewMap.displayName = "PopNewMap";

export default PopNewMap;
