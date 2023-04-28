import React, { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ButtonGroup } from "@mui/material";
import { ContentInner, ResultArea, SearchArea, StatusArea, ButtonArea, RightButtonArea, InputField, GridAddRowButton, GridDeleteRowButton, GridSaveButton, BaseGrid, GridCnt, useViewStore, useUserStore, zAxios, LeftButtonArea, CommonButton } from "@zionex/wingui-core/src/common/imports";
import { baseURI, Icon, loadComboList, showMessage, transLangKey } from "@wingui";
import PopMeasure from "./PopMeasure";
import PopSelectItem from "@wingui/view/common/PopSelectItem";
import PopSelectAccount from "@wingui/view/common/PopSelectAccount";
import { newRowEditCellStyle, saveJson } from "@wingui/view/demandplan/DpUtil";
import ItemSearchBox from "@wingui/view/demandplan/common/ItemSearchBox";
import AccountSearchBox from "@wingui/view/demandplan/common/AccountSearchBox";

const measureDataItems = [
  { name: "ITEM_CD", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: 100, textAlignment: "center", button: "action", styleCallback: newRowEditCellStyle },
  { name: "ACCOUNT_CD", dataType: "text", headerText: "ACCOUNT_CD", visible: true, editable: false, width: 100, textAlignment: "center", button: "action", styleCallback: newRowEditCellStyle },
  { name: "BASE_DATE", dataType: "datetime", headerText: "BASE_DATE", visible: true, editable: false, width: 100, textAlignment: "center", format: "yyyy-MM-dd", styleCallback: newRowEditCellStyle },
  { name: "QTY", dataType: "number", headerText: "QTY", visible: true, editable: true, width: 100, textAlignment: "center" },
  { name: "AMT", dataType: "number", headerText: "AMT", visible: true, editable: true, width: 100, textAlignment: "center" },
  { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: true, editable: false, width: 80, textAlignment: "center" },
  { name: "CREATE_DTTM", dataType: "datetime", format: "yyyy-MM-dd", headerText: "CREATE_DTTM", visible: true, editable: false, width: 80, textAlignment: "center" },
  { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 80, textAlignment: "center" },
  { name: "MODIFY_DTTM", dataType: "datetime", format: "yyyy-MM-dd", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 80, textAlignment: "center" },
];

let defaultDataRange = [];
let defaultMeasure;
function MeasureData() {
  const [username, displayName, systemAdmin] = useUserStore((state) => [state.username, state.displayName, state.systemAdmin]);
  const itemSearchBoxRef = useRef();
  const [currentItemRef, setCurrentItemRef] = useState();
  const accountSearchBoxRef = useRef();
  const [currentAccountRef, setCurrentAccountRef] = useState();
  const [message, setMessage] = useState();

  const [grid1, setGrid1] = useState(null);
  const [measurePopupOpen, setMeasurePopupOpen] = useState(false);
  const [gridItemPopupOpen, setGridItemPopupOpen] = useState(false);
  const [gridAcctPopupOpen, setGridAcctPopupOpen] = useState(false);

  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [measures, setMeasures] = useState([]);

  const globalButtons = [
    {
      name: "search",
      action: () => {
        loadGridData();
      },
      visible: true,
      disable: false,
    },
    {
      name: "save",
      action: () => {
        //saveData(grid1);
        saveJson(grid1, "SP_UI_DP_41_S1_J", loadGridData);
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

  const { reset, control, getValues, setValue } = useForm({
    defaultValues: {
      measure: "",
      itemCd: "",
      itemNm: "",
      accountCd: "",
      accountNm: "",
    },
  });

  const refresh = () => {
    reset();
    currentItemRef.reset();
    currentAccountRef.reset();
    setValue("dateRange", defaultDataRange);
    setValue("measure", defaultMeasure);
    grid1.dataProvider.clearRows();
  };

  const onDelete = (targetGrid, deleteRows) => {
    let formData = new FormData();
    formData.append("MEASURE", getValues("measure"));
    formData.append(
      "changes",
      JSON.stringify(
        deleteRows.map((row) => {
          row.BASE_DATE = new Date(row.BASE_DATE).format("yyyy-MM-ddT00:00:00");
          return row;
        })
      )
    );
    formData.append("USER_ID", username);

    if (deleteRows.length > 0) {
      return zAxios({
        method: "post",
        url: baseURI() + "engine/dp/SRV_SET_SP_UI_DP_41_D1",
        headers: { "content-type": "application/json" },
        data: formData,
      })
        .then((response) => {
          if (response.status === gHttpStatus.SUCCESS) {
            const rsData = response.data;
            if (rsData.RESULT_SUCCESS) {
              const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_11_41_P_RT_MSG"];
              resultMSG === "MSG_0002" ? loadGridData() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
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

  // const saveData = (targetGrid) => {
  //   targetGrid.gridView.commit(true);

  //   showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), (answer) => {
  //     if (answer) {
  //       let changes = [];
  //       changes = changes.concat(targetGrid.dataProvider.getAllStateRows().created, targetGrid.dataProvider.getAllStateRows().updated, targetGrid.dataProvider.getAllStateRows().deleted, targetGrid.dataProvider.getAllStateRows().createAndDeleted);

  //       let changeRowData = [];
  //       changes.forEach((row) => {
  //         let data = targetGrid.dataProvider.getJsonRow(row);
  //         data.BASE_DATE = new Date(data.BASE_DATE).format("yyyy-MM-ddT00:00:00");
  //         changeRowData.push(data);
  //       });

  //       if (changeRowData.length === 0) {
  //         showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"));
  //       } else {
  //         targetGrid.gridView.showToast(progressSpinner + "Saving data...", true);
  //         let formData = new FormData();
  //         formData.append("MEASURE", getValues("measure"));
  //         formData.append("changes", JSON.stringify(changeRowData));
  //         formData.append("USER_ID", username);

  //         zAxios
  //           .post(baseURI() + "engine/dp/SRV_SET_SP_UI_DP_41_S1", formData, {
  //             headers: { "content-type": "application/json" },
  //           })
  //           .then((response) => {
  //             if (response.status === gHttpStatus.SUCCESS) {
  //               const rsData = response.data;
  //               if (rsData.RESULT_SUCCESS) {
  //                 const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_41_S1_P_RT_MSG"];
  //                 resultMSG === "MSG_0001" ? loadGridData() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
  //               } else {
  //                 showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
  //               }
  //             }
  //           })
  //           .catch((err) => {
  //             console.log(err);
  //           })
  //           .then(() => {
  //             targetGrid.gridView.hideToast();
  //           });
  //       }
  //     }
  //   });
  // };

  const loadGridData = () => {
    let param = new URLSearchParams();
    param.append("MEASURE", getValues("measure"));
    param.append("ITEM_CD", currentItemRef.getItemCode());
    param.append("ITEM_NM", currentItemRef.getItemName());
    param.append("ACCT_CD", currentAccountRef.getAccountCode());
    param.append("ACCT_NM", currentAccountRef.getAccountName());
    param.append("FROM_DATE", getValues("dateRange")[0].format("yyyy-MM-dd"));
    param.append("TO_DATE", getValues("dateRange")[1].format("yyyy-MM-dd"));
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_41_Q1",
      data: param,
    })
      .then((res) => {
        let dataArr = [];
        if (res.status === gHttpStatus.SUCCESS) {
          dataArr = res.data.RESULT_DATA;
          grid1.dataProvider.fillJsonData(dataArr);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadMeasureList = async () => {
    const measureList = await loadComboList({
      URL: "engine/dp/SRV_GET_SP_UI_DP_41_POP_Q1",
      CODE_KEY: "COL_NM",
      CODE_VALUE: "COL_NM",
      PARAM: {},
      ALLFLAG: false,
    });
    setMeasures(measureList);

    defaultMeasure = measureList[0].value;
    setValue("measure", defaultMeasure);
  };

  useEffect(() => {
    loadMeasureList();

    zAxios({
      method: "post",
      url: "engine/dp/SRV_GET_DATETIME_SCOPE_Q1",
      params: {
        UI_ID: "VERSION",
      },
    })
      .then((res) => {
        if (res.status === gHttpStatus.SUCCESS) {
          const data = res.data.RESULT_DATA[0];
          defaultDataRange = [new Date(data["FROM_DATE"]), new Date(data["TO_DATE"])];
          setValue("dateRange", defaultDataRange);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, "grid1");
    if (grdObj1 && grdObj1.dataProvider) {
      grid1 !== grdObj1 && setGrid1(grdObj1);
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
      setOption();
    }
  }, [grid1]);

  const setGridItemCd = (records) => {
    const itemIndex = grid1.gridView.getCurrent().dataRow;
    grid1.dataProvider.setValue(itemIndex, "ITEM_CD", records[0].ITEM_CD);
    grid1.gridView.setCurrent({ itemIndex: itemIndex });
    grid1.gridView.commit(true);
  };

  const setGridAccountCd = (records) => {
    const itemIndex = grid1.gridView.getCurrent().dataRow;
    grid1.dataProvider.setValue(itemIndex, "ACCOUNT_CD", records[0].ACCOUNT_CD);
    grid1.gridView.setCurrent({ itemIndex: itemIndex });
    grid1.gridView.commit(true);
  };

  const setOption = () => {
    grid1.gridView.setEditOptions({
      insertable: true,
      appendable: true,
    });
    setVisibleProps(grid1, true, true, true);
    grid1.gridView.displayOptions.fitStyle = "fill";
    grid1.gridView.setColumnProperty("ACCOUNT_CD", "buttonVisibility", "always");
    grid1.gridView.setColumnProperty("ITEM_CD", "buttonVisibility", "always");
    grid1.gridView.onCellButtonClicked = (grid, itemIndex, column) => {
      if (grid1.dataProvider.getRowState(itemIndex.dataRow) === "created") {
        const fieldName = column.fieldName;
        fieldName === "ACCOUNT_CD" && setGridAcctPopupOpen(true);
        fieldName === "ITEM_CD" && setGridItemPopupOpen(true);
      }
    };
  };

  return (
    <>
      <ContentInner>
        <SearchArea>
          <InputField name="measure" label={"Measure"} type="select" control={control} options={measures}></InputField>
          <ItemSearchBox ref={itemSearchBoxRef} keyValue={"itemName"} placeHolder={transLangKey("ITEM_NM")} />
          <AccountSearchBox ref={accountSearchBoxRef} keyValue={"accountName"} placeHolder={transLangKey("ACCOUNT_NM")} />
          <InputField type="dateRange" name="dateRange" label={transLangKey("APPY_SCPE")} control={control} dateformat="yyyy-MM-dd" />
        </SearchArea>
        <ButtonArea>
          <LeftButtonArea>
            <CommonButton title={transLangKey("CUSTOM_MEASURE_POP")} onClick={() => setMeasurePopupOpen(true)}>
              <Icon.Columns />
            </CommonButton>
          </LeftButtonArea>
          <RightButtonArea>
            <ButtonGroup>
              <GridAddRowButton grid="grid1" type="icon" />
              <GridDeleteRowButton grid="grid1" type="icon" onDelete={onDelete} />
              <GridSaveButton
                grid="grid1"
                type="icon"
                onClick={() => {
                  //saveData(grid1);
                  saveJson(grid1, "SP_UI_DP_41_S1_J", loadGridData, { P_MEASURE: getValues("measure") });
                }}
              />
            </ButtonGroup>
          </RightButtonArea>
        </ButtonArea>
        <ResultArea>
          <BaseGrid id="grid1" items={measureDataItems} />
        </ResultArea>
        <StatusArea show={false} message={message}>
          <GridCnt grid="grid1" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")} />
        </StatusArea>
      </ContentInner>
      {measurePopupOpen && <PopMeasure open={measurePopupOpen} onClose={() => setMeasurePopupOpen(false)} confirm={getValues("measure")} />}
      {gridItemPopupOpen && <PopSelectItem open={gridItemPopupOpen} onClose={() => setGridItemPopupOpen(false)} confirm={setGridItemCd} multiple={false} />}
      {gridAcctPopupOpen && <PopSelectAccount open={gridAcctPopupOpen} onClose={() => setGridAcctPopupOpen(false)} confirm={setGridAccountCd} multiple={false} />}
    </>
  );
}

export default MeasureData;
