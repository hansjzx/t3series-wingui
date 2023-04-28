import React, { useState, useEffect } from "react";
import { ButtonGroup } from "@mui/material";
import { useForm } from "react-hook-form";
import { ContentInner, ResultArea, SearchArea, StatusArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow, SplitPanel, InputField, GridAddRowButton, GridDeleteRowButton, GridSaveButton, BaseGrid, GridCnt, useViewStore, useUserStore, zAxios } from "@zionex/wingui-core/src/common/imports";


let grid1Items = [
  { name: "TYPE", dataType: "dropdown", headerText: "TYPE", visible: true, editable: false, width: 120, textAlignment: "center", useDropdown: true, lookupDisplay: true},
  { name: "FACTOR_CD", dataType: "text", headerText: "FACTOR", visible: true, editable: true, width: 120, textAlignment: "center"},
  { name: "DESCRIP", dataType: "text", headerText: "FACTOR_DESCRIP", visible: true, editable: true, width: 120, textAlignment: "center", lang: true},
  { name: "COL_NM", dataType: "text", headerText: "COL_NM", visible: true, editable: false, width: 130, textAlignment: "center"},
  { name: "ACTV_YN", dataType: "boolean", headerText: "ACTV_YN", visible: true, editable: true, width: 80, textAlignment: "center"},
  { name: "DEL_YN", dataType: "boolean", headerText: "DEL_YN", visible: false, editable: false, width: 80, textAlignment: "center" },
  { name: "CREATE_BY", dataType: "text", headerText: "CREATE_BY", visible: false, editable: false, width: 80, textAlignment: "center" },
  { name: "CREATE_DTTM", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: 120, textAlignment: "center" },
  { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 80, textAlignment: "center" },
  { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 120, textAlignment: "center" },
];


function Factor(props) {
  //1. view page data store
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [username] = useUserStore((state) => [state.username]);
  //2. grid Object
  const [grid1, setGrid1] = useState(null);

  // grid Object init
  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, "grid1");
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        setGrid1(grdObj1);
      }
    }
  }, [viewData]);

  //3. 상태 메시지
  const [message, setMessage] = useState();
  //4. FORM 데이터 처리
  const {
    handleSubmit,
    reset,
    control,
    getValues,
    setValue,
    watch,
    register,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: {
      actvYn: "Y",
      delYn: "N",
    },
  });

  const globalButtons = [
    {
      name: "search",
      action: (e) => {
        onSubmit();
      },
      visible: true,
      disable: false,
    },
    {
      name: "save",
      action: (e) => {
        saveData(grid1);
      },
      visible: false,
      disable: false,
    },
    {
      name: "refresh",
      action: (e) => {
        reset();
        grid1.dataProvider.clearRows();
      },
      visible: true,
      disable: false,
    },
  ];

  useEffect(() => {
    if (grid1) {
      setViewInfo(vom.active, "globalButtons", globalButtons);
      setOptions();
    }
  }, [grid1]);

  /** 이벤트 핸들러 */
  const onSubmit = (data) => {
    loadData(data);
  };

  function setOptions() {
    setVisibleProps(grid1, true, true, false);
    grid1.gridView.displayOptions.fitStyle = "fill";
    grid1.gridView.setColumnProperty("TYPE", "lookupData", {
      value: "value",
      label: "label",
      list: [
        { value: "extend", label: "extend" },
        // { value: "default", label: "default" }
      ],
    });

    //추가된 행만 편집 가능하게, 조회된 행은 수정 불가
//     grid1.gridView.onCurrentRowChanged = function (grid, oldRow, newRow) {
//       var curr = grid.getCurrent();
//       var rowState = newRow > -1 ? grid1.dataProvider.getRowState(newRow) : "";
//       //그리드에 beginInsertRow(), beginAppendRow()로 행이 추가된 경우 || dataProvider에 새로 추가된 행인 경우
//       var editable = (newRow === -1 && curr.itemIndex > -1) || rowState === "created";
//
//       grid.setEditOptions({ "editable": editable})
//       grid.setColumnProperty("TYPE", "editable", editable);
//
//     };

    //default 일때 수정 불가
    let colFactorCd = grid1.gridView.columnByName("FACTOR_CD");
    let colDescrip = grid1.gridView.columnByName("DESCRIP");
//     let colColNm = grid1.gridView.columnByName("COL_NM");
    let colActvYn = grid1.gridView.columnByName("ACTV_YN");

    const f = function (grid, cell) {
      let ret = {};
      let type = grid1.dataProvider.getValue(cell.index.dataRow, "TYPE");

      if (type == "default") {
        ret.styleName = 'uneditable-column';
        ret.renderer = { editable: false };
      }
      else {
        ret.styleName = 'editable-column';
      }
      return ret;
    };
    colFactorCd.styleCallback = f;
    colDescrip.styleCallback = f;
//     colColNm.styleCallback = f;
    colActvYn.styleCallback = f;
    grid1.gridView.commit(true);
  }

  function loadData() {
    let grid = grid1;

    grid.gridView.commit(true);
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_BF_09_Q1",
      params: {
        DESCRIP: getValues("descrip"),
        ACTV_YN: getValues("actvYn"),
        DEL_YN: getValues("delYn"),
      },
    })
      .then(function (res) {
        let dataArr = [];
        if (res.status === gHttpStatus.SUCCESS) {
          dataArr = res.data.RESULT_DATA;
          grid.dataProvider.fillJsonData(dataArr);
        }
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
        grid.gridView.hideToast();
      });
  }

  function onDelete(targetGrid, deleteRows) {
    let formData = new FormData();
    formData.append("USER_ID", username);
    formData.append("checked", JSON.stringify(deleteRows));

    if (deleteRows.length > 0) {
      zAxios({
        method: "post",
        url: baseURI() + "engine/dp/SRV_SET_SP_UI_BF_09_D1",
        headers: { "content-type": "application/json" },
        data: formData,
      })
        .then(function (res) {
          let isSucess = res.data.RESULT_SUCCESS;
          if (isSucess) {
            let resultMSG = res.data.RESULT_DATA.IM_DATA.SP_UI_BF_09_D1_P_RT_MSG;
            showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
          } else {
            let resultMSG = res.data.RESULT_MESSAGE;
            showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
          }
          return res;
        })
        .catch(function (err) {
          console.log(err);
        });
    }
  }

  const onAfterDelete = (targetGrid) => {
    if (targetGrid.gridView.id === "grid1") {
      loadData();
    }
  };

  function saveData() {
    grid1.gridView.commit(true);
    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(grid1.dataProvider.getAllStateRows().created, grid1.dataProvider.getAllStateRows().updated, grid1.dataProvider.getAllStateRows().deleted, grid1.dataProvider.getAllStateRows().createAndDeleted);

        changes.forEach(function (row) {
          changeRowData.push(grid1.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          //저장 할 내용이 없습니다.
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"), { close: false });
        } else {
          grid1.gridView.showToast(progressSpinner + "Saving data...", true);

          let formData = new FormData();
          formData.append("USER_ID", username);
          formData.append("CHANGES", JSON.stringify(changeRowData));

          zAxios
            .post(baseURI() + "engine/dp/SRV_SET_SP_UI_BF_09_S1", formData, {
              headers: {
                "Content-Type": "application/json",
              },
            })
            .then(function () {
              grid1.gridView.hideToast();
              loadData();
            })
            .catch(function (e) {
              console.error(e);
            });
        }
      }
    });
  }

  const getNewGridData = () => {
    return { TYPE: 'extend', ACTV_YN: true };
  };
  /** 이벤트 핸들러 끝 */

  return (
    <ContentInner>
      <SearchArea>
        <SearchRow>
          {/* direction : row, column */}
          <InputField name="descrip" label="FACTOR_DESCRIP" control={control} rules={{}} />
          <InputField
            name="actvYn"
            type="select"
            label="ACTV_YN"
            control={control}
            options={[
              { label: "ALL", value: "A" },
              { label: "Y", value: "Y" },
              { label: "N", value: "N" },
            ]}
          />
        </SearchRow>
      </SearchArea>
      <ButtonArea title={transLangKey("UI_BF_09")}>
        <LeftButtonArea></LeftButtonArea>
        <RightButtonArea>
          <ButtonGroup>
{/*             <GridAddRowButton grid="grid1" type="icon" onGetData={getNewGridData}></GridAddRowButton> */}
{/*             <GridDeleteRowButton grid="grid1" type="icon" onDelete={onDelete} onAfterDelete={onAfterDelete}></GridDeleteRowButton> */}
            {/* <CommonBtn style={{ width: "60px" }} onClick={() => { saveData(grid1) }}>{transLangKey("SAVE")}</CommonBtn> */}
            <GridSaveButton
              grid="grid1"
              type="icon"
              onClick={() => {
                saveData(grid1);
              }}
            />
          </ButtonGroup>
        </RightButtonArea>
      </ButtonArea>
      <ResultArea>
        <BaseGrid id="grid1" items={grid1Items}></BaseGrid>
      </ResultArea>
      <StatusArea show={false} message={message}>
        <GridCnt grid="grid1" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")}></GridCnt>
      </StatusArea>
    </ContentInner>
  );
}

export default Factor;
