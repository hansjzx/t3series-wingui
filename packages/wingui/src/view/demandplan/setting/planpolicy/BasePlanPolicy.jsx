import React, { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { ContentInner, ResultArea, SearchArea, StatusArea, SearchRow, InputField, BaseGrid, GridCnt, useViewStore, useUserStore, zAxios } from "@zionex/wingui-core/src/common/imports";
import { loadOption, isEmptyArray } from "@wingui/view/demandplan/DpUtil";
import PropTypes from "prop-types";

let grid1Items = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: 100, textAlignment: "center" },
  { name: "MODULE_ID", dataType: "text", headerText: "MODULE_CD", visible: false, editable: false, width: 100, textAlignment: "center" },
  { name: "PLAN_TP_ID", dataType: "dropdown", headerText: "PLAN_TP", visible: true, editable: false, width: 110, textAlignment: "center", useDropdown: true, lookupDisplay: true },
  { name: "POLICY_ID", dataType: "dropdown", headerText: "CONF_NM", visible: true, editable: false, width: 110, textAlignment: "center", useDropdown: true, lookupDisplay: true },
  { name: "POLICY_CD", dataType: "text", headerText: "CONF_CD", visible: true, editable: false, width: 110, textAlignment: "center" },
  {
    name: "POLICY_VAL",
    dataType: "text",
    headerText: "VAL",
    visible: true,
    editable: true,
    width: 110,
    textAlignment: "center",
    styleCallback: function (grid, dataCell) {
      const gubun = grid.getValue(dataCell.index.itemIndex, "POLICY_CD");
      let ret = {};
      switch (gubun) {
        case "PB":
          ret.editor = {
            type: "dropdown",
            values: ["Y", "Q", "M", "PW", "W"],
            labels: ["Y", "Q", "M", "PW", "W"],
          };
          break;
        case "B":
          ret.editor = {
            type: "dropdown",
            values: ["Q", "M", "W", "PW", "D"],
            labels: ["Q", "M", "W", "PW", "D"],
          };
          break;
        case "PB2":
          ret.editor = {
            type: "dropdown",
            values: ["Y", "Q"],
            labels: ["Y", "Q"],
          };
          break;
        default:
          ret.editor = {
            type: "number",
          };
          break;
      }
      return ret;
    },
  },
  { name: "DESCRIP", dataType: "text", headerText: "DESCRIP", visible: true, editable: true, width: 200, textAlignment: "center" },
  { name: "MODIFY_BY", dataType: "text", headerText: "MODIFY_BY", visible: true, editable: false, width: 80, textAlignment: "center" },
  { name: "MODIFY_DTTM", dataType: "datetime", headerText: "MODIFY_DTTM", visible: true, editable: false, width: 80, textAlignment: "center" },
];

export function BasePlanPolicy(props) {
  const [username, displayName] = useUserStore((state) => [state.username, state.displayName]);
  const [grid1, setGrid1] = useState(null);
  const [message, setMessage] = useState();
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const [planTypeOption, setPlanTypeCombo] = useState([]);

  const {
    reset,
    control,
    getValues,
    setValue,
    watch,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: {},
  });

  const globalButtons = [
    {
      name: "search",
      action: () => {
        onSubmit();
      },
      visible: false,
      disable: false,
    },
    {
      name: "save",
      action: () => {
        saveData(grid1);
      },
      visible: true,
      disable: false,
    },
    {
      name: "refresh",
      action: () => {
        reset();
      },
      visible: false,
      disable: false,
    },
  ];

  //조회조건 품목 유형 load
  const loadPlanType = async () => {
    //console.log("loadPlanType===>", props.planType);

    const planTypeData = await loadOption(true, "SRV_GET_SP_UI_DP_00_CONF_Q1", { SP_UI_DP_00_CONF_Q1_01: "DP_PLAN_TYPE", SP_UI_DP_00_CONF_Q1_02: "", SP_UI_DP_00_CONF_Q1_03: "" }, "ID", "CD_NM", false, true);
    if (!isEmptyArray(planTypeData)) {
      setPlanTypeCombo(planTypeData);
      setValue("planType", planTypeData[0].value);
    }
  };

  useEffect(() => {
    loadPlanType();
  }, []);

  useEffect(() => {
    if (grid1) {
      loadGrid1Data();
    }
  }, [watch("planType")]);

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, "grid1");
    if (grdObj1 && grdObj1.dataProvider) {
      if (grid1 != grdObj1) {
        setGrid1(grdObj1);
      }
    }
  }, [viewData]);

  useEffect(() => {
    if (!isEmptyArray(planTypeOption)) {
      loadGrid1Data();
    }
  }, [planTypeOption]);

  useEffect(() => {
    if (grid1) {
      setViewInfo(vom.active, "globalButtons", globalButtons);

      setGridOption();
      // 조회조건 세팅
      gridComboLoad(grid1, {
        URL: "engine/dp/SRV_GET_SP_UI_DP_00_CONF_Q1",
        CODE_VALUE: "ID",
        CODE_LABEL: "CD_NM",
        COLUMN: "PLAN_TP_ID",
        PROP: "lookupData",
        PARAM_KEY: ["SP_UI_DP_00_CONF_Q1_01", "SP_UI_DP_00_CONF_Q1_02", "SP_UI_DP_00_CONF_Q1_03"],
        PARAM_VALUE: ["DP_PLAN_TYPE", "", ""],
        TRANSLANG_LABEL: true,
      });
      gridComboLoad(grid1, {
        URL: "engine/dp/SRV_GET_SP_UI_DP_00_CONF_Q1",
        CODE_VALUE: "ID",
        CODE_LABEL: "CD_NM",
        COLUMN: "POLICY_ID",
        PROP: "lookupData",
        PARAM_KEY: ["SP_UI_DP_00_CONF_Q1_01", "SP_UI_DP_00_CONF_Q1_02", "SP_UI_DP_00_CONF_Q1_03"],
        PARAM_VALUE: ["DP_POLICY", "", ""],
        TRANSLANG_LABEL: true,
      });
    }
  }, [grid1]);

  const onSubmit = () => {
    //alert(JSON.stringify(data));
    loadGrid1Data();
  };

  const setGridOption = () => {
    setVisibleProps(grid1, true, true, false);
    grid1.gridView.setEditOptions({
      insertable: false,
      appendable: false,
    });
    grid1.gridView.displayOptions.fitStyle = "fill";
  };

  const loadGrid1Data = () => {
    let param = new URLSearchParams();
    param.append("PLAN_TP_ID", getValues("planType"));

    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_36_Q1",
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

  const saveData = (targetGrid) => {
    targetGrid.gridView.commit(true);

    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), function (answer) {
      if (answer) {
        let changes = [];
        changes = changes.concat(targetGrid.dataProvider.getAllStateRows().updated);

        let changeRowData = [];
        changes.forEach(function (row) {
          let data = targetGrid.dataProvider.getJsonRow(row);
          changeRowData.push(data);
        });

        //console.log("=====>>>>>>", changeRowData);
        if (changeRowData.length === 0) {
          showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_5039"));
        } else {
          targetGrid.gridView.showToast(progressSpinner + "Saving data...", true);

          let params = new URLSearchParams();
          params.append("changes", JSON.stringify(changeRowData));
          params.append("USER_ID", username);

          zAxios({
            method: "post",
            url: baseURI() + "engine/dp/SRV_SET_SP_UI_DP_36_S1",
            data: params,
          })
            .then((response) => {
              if (response.status === gHttpStatus.SUCCESS) {
                const rsData = response.data;
                if (rsData.RESULT_SUCCESS) {
                  const resultMSG = rsData.RESULT_DATA["IM_DATA"]["SP_UI_DP_36_S1_P_RT_MSG"];
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
              targetGrid.gridView.hideToast();
            });
        }
      }
    });
  };

  return (
    <ContentInner>
      <SearchArea>
        <SearchRow>
          <InputField name="planType" label={transLangKey("PLAN_TP")} type="select" control={control} options={planTypeOption} />
        </SearchRow>
      </SearchArea>
      <ResultArea>
        <BaseGrid id="grid1" items={grid1Items}></BaseGrid>
      </ResultArea>
      <StatusArea show={false} message={message}>
        <GridCnt grid="grid1" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")}></GridCnt>
      </StatusArea>
    </ContentInner>
  );
}

BasePlanPolicy.propTypes = {
  planTypeCode: PropTypes.oneOf(["DP_PLAN_MONTHLY", "DP_PLAN_YEARLY"]),
};

export default BasePlanPolicy;
