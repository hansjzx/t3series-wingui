import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { ContentInner, ResultArea, SearchArea, StatusArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow, InputField, GridAddRowButton, GridDeleteRowButton, BaseGrid, GridCnt, useViewStore, zAxios, useUserStore } from "@zionex/wingui-core/src/common/imports";
import { baseURI, transLangKey, vom } from "@wingui";

function Customer() {
  const [username, displayName] = useUserStore((state) => [state.username, state.displayName]);
  const [message, setMessage] = useState();
  const grid1Items = [
    {
      name: "ID",
      dataType: "text",
      headerText: "ID",
      visible: false,
      editable: false,
      width: 100,
      textAlignment: "center",
    },
    {
      name: "CUST_CD",
      dataType: "text",
      headerText: "CUST_CD",
      visible: true,
      editable: false,
      width: 100,
      textAlignment: "center",
      styleCallback: function (grid, dataCell) {
        let ret = {};
        if (dataCell.item.rowState === "created" || dataCell.item.rowState === "appending" || dataCell.item.rowState === "inserting") {
          ret.editable = true;
          ret.styleName = "editable-text-column";
        } else {
          ret.editable = false;
        }
        return ret;
      },
    },
    {
      name: "CUST_NM",
      dataType: "text",
      headerText: "CUST_NM",
      visible: true,
      editable: true,
      width: 100,
      textAlignment: "center",
    },
    {
      name: "COUNTRY_CD",
      dataType: "dropdown",
      headerText: "COUNTRY_CD",
      visible: true,
      editable: true,
      width: 110,
      textAlignment: "center",
      useDropdown: true,
      lookupDisplay: true,
    },
    {
      name: "COUNTRY_ID",
      dataType: "text",
      headerText: "COUNTRY_ID",
      visible: false,
      editable: true,
      width: 110,
      textAlignment: "center",
    },
    {
      name: "ADDR",
      dataType: "text",
      headerText: "ADDR",
      visible: true,
      editable: true,
      width: 80,
      textAlignment: "center",
    },
    {
      name: "CREATE_BY",
      dataType: "text",
      headerText: "CREATE_BY",
      visible: true,
      editable: false,
      width: 80,
      textAlignment: "center",
    },
    {
      name: "CREATE_DTTM",
      dataType: "datetime",
      headerText: "CREATE_DTTM",
      visible: true,
      editable: false,
      width: 80,
      textAlignment: "center",
    },
    {
      name: "MODIFY_BY",
      dataType: "text",
      headerText: "MODIFY_BY",
      visible: true,
      editable: false,
      width: 80,
      textAlignment: "center",
    },
    {
      name: "MODIFY_DTTM",
      dataType: "datetime",
      headerText: "MODIFY_DTTM",
      visible: true,
      editable: false,
      width: 80,
      textAlignment: "center",
    },
  ];

  const [grid1, setGrid1] = useState(null);
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const { reset, control, getValues } = useForm({
    defaultValues: {},
  });

  const countryComboLoad = () => {
    let dataArr = [];
    let param = new URLSearchParams();
    param.append("SP_UI_DP_00_CONF_Q1_01", "CM_COUNTRY");
    param.append("SP_UI_DP_00_CONF_Q1_02", "");
    param.append("SP_UI_DP_00_CONF_Q1_03", "");
    zAxios({
      method: "post",
      header: { "content-type": "application/json" },
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_00_CONF_Q1",
      data: param,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          dataArr = [];
          dataArr = res.data.RESULT_DATA;
          grid1.gridView.setColumnProperty("COUNTRY_CD", "lookupData", {
            value: "CD",
            label: "CD_NM",
            list: dataArr,
          });
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const globalButtons = [
    {
      name: "search",
      action: () => {
        onSubmit();
      },
      visible: true,
      disable: false,
    },
    {
      name: "save",
      action: () => {
        saveData(grid1);
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

  function refresh() {
    reset();
    grid1.dataProvider.clearRows();
  }

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, "grid1");
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        if (grid1 !== grdObj1) setGrid1(grdObj1);
      }
    }
  }, [viewData]);

  useEffect(() => {
    if (grid1) {
      setViewInfo(vom.active, "globalButtons", globalButtons);
      setGridOption();
    }
  }, [grid1]);

  const onSubmit = () => {
    //alert(JSON.stringify(data));
    loadGrid1Data();
  };

  const setGridOption = () => {
    grid1.gridView.setEditOptions({
      insertable: true,
      appendable: true,
    });
    grid1.gridView.displayOptions.fitStyle = "fill";

    grid1.gridView.setCheckBar({ visible: true });
    grid1.gridView.setStateBar({ visible: true });
  };

  function loadGrid1Data() {
    let param = new URLSearchParams();
    param.append("SP_UI_DP_04_Q1_01", getValues("custCd"));
    param.append("SP_UI_DP_04_Q1_02", getValues("custNm"));
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_04_Q1",
      data: param,
    })
      .then(function (res) {
        let dataArr = [];
        if (res.status === gHttpStatus.SUCCESS) {
          dataArr = res.data.RESULT_DATA;
          grid1.dataProvider.fillJsonData(dataArr);
        }
        countryComboLoad();
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  //Promise를 리턴해야 한다.
  const onDelete = (targetGrid, deleteRows) => {
    let formData = new FormData();
    formData.append("changes", JSON.stringify(deleteRows));
    if (deleteRows.length > 0) {
      return zAxios({
        method: "post",
        url: baseURI() + "engine/dp/SRV_SET_SP_UI_DP_04_D1",
        headers: { "content-type": "application/json" },
        data: formData,
      })
        .then(function (response) {
          if (response.status === gHttpStatus.SUCCESS) {
            const rsData = response.data;
            if (rsData.RESULT_SUCCESS) {
              const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_04_D1_P_RT_MSG"];
              resultMSG === "MSG_0002" ? onSubmit() : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(resultMSG));
            } else {
              showMessage(transLangKey("MSG_CONFIRM"), transLangKey(rsData.RESULT_MESSAGE));
            }
          }
        })
        .catch(function (err) {
          console.log(err);
        })
        .then(function () {});
    }
  };

  const onAfterDelete = (targetGrid) => {
    if (targetGrid.gridId === "grid1") {
      // loadGrid1Data();
    }
  };

  const saveData = (targetGrid) => {
    targetGrid.gridView.commit(true);

    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), function (answer) {
      if (answer) {
        let changes = [];
        changes = changes.concat(targetGrid.dataProvider.getAllStateRows().created, targetGrid.dataProvider.getAllStateRows().updated, targetGrid.dataProvider.getAllStateRows().deleted, targetGrid.dataProvider.getAllStateRows().createAndDeleted);

        let changeRowData = [];
        changes.forEach(function (row) {
          let data = targetGrid.dataProvider.getJsonRow(row);
          changeRowData.push(data);
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"));
        } else {
          targetGrid.gridView.showToast(progressSpinner + "Saving data...", true);

          let formData = new FormData();
          formData.append("changes", JSON.stringify(changeRowData));
          formData.append("USER_ID", username);
          zAxios
            .post(baseURI() + "engine/dp/SRV_SET_SP_UI_DP_04_S1", formData, {
              headers: { "content-type": "application/json" },
            })
            .then(function (response) {})

            .catch(function (err) {
              console.log(err);
            })
            .then(function () {
              targetGrid.gridView.hideToast();
              loadGrid1Data();
            });
        }
      }
    });
  };

  return (
    <ContentInner>
      <SearchArea>
        <SearchRow>
          <InputField name="custCd" label={transLangKey("CUST_CD")} readonly={false} disabled={false} control={control} />
          <InputField name="custNm" label={transLangKey("CUST_NM")} readonly={false} disabled={false} control={control} />
          <></>
        </SearchRow>
      </SearchArea>
      <ButtonArea title={transLangKey("UI_DP_04")}>
        <LeftButtonArea/>
        <RightButtonArea>
          <GridAddRowButton grid="grid1" />
          <GridDeleteRowButton grid="grid1" onDelete={onDelete} onAfterDelete={onAfterDelete} />
        </RightButtonArea>
      </ButtonArea>
      <ResultArea>
        <BaseGrid id="grid1" items={grid1Items} />
      </ResultArea>
      <StatusArea show={false} message={message}>
        <GridCnt grid="grid1" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")} />
      </StatusArea>
    </ContentInner>
  );
}

export default Customer;
