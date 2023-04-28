import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { ContentInner, ResultArea, SearchArea, StatusArea, ButtonArea, LeftButtonArea, RightButtonArea, SearchRow, InputField, CommonButton, BaseGrid, GridCnt, useViewStore, useUserStore, zAxios } from "@zionex/wingui-core/src/common/imports";
import "./css/controlboard.css";

let grid1Items = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: "0" },
  { name: "VER_CD", dataType: "text", headerText: "VER_CD", visible: false, editable: false, width: "100" },
  { name: "PROCESS_NO", dataType: "text", headerText: "PROCESS_NO", visible: false, editable: false, width: "100" },
  { name: "ENGINE_TP_CD", dataType: "text", headerText: "ENGINE_TP", visible: false, editable: false, width: "100", textAlignment: "center" },
  {
    name: "DESCRIP",
    dataType: "text",
    headerText: "PROCESS",
    visible: true,
    editable: false,
    width: "150",
    textAlignment: "center",
    styleCallback: function (grid, dataCell) {
      var ret = {};
      var PROCESS_NO = grid.getValue(dataCell.index.itemIndex, "PROCESS_NO");
      if (PROCESS_NO != "1" && PROCESS_NO != "990000" && PROCESS_NO != "1000000") {
        ret.styleName = "descrip-bg";
      }
      return ret;
    },
  },
  { name: "STATUS", dataType: "text", headerText: "STATUS", visible: true, editable: false, width: "70", textAlignment: "center" },
  { name: "CL_STATUS", dataType: "text", headerText: "CL_STATUS", visible: false, editable: false, width: "70", textAlignment: "center" },
  { name: "RUN_STRT_DATE", dataType: "datetime", headerText: "RUN_STRT_DATE", visible: true, editable: false, width: "110", textAlignment: "center", format: "yyyy-MM-dd HH:mm:ss", mergeRule: { criteria: "value" } },
  { name: "RUN_END_DATE", dataType: "datetime", headerText: "RUN_END_DATE", visible: true, editable: false, width: "110", textAlignment: "center", format: "yyyy-MM-dd HH:mm:ss", mergeRule: { criteria: "value" } },
  {
    name: "RULE_01",
    dataType: "dropdown",
    headerText: "RULE",
    visible: true,
    editable: false,
    width: "70",
    textAlignment: "center",
    useDropdown: true,
    lookupDisplay: true,
    styleCallback: function (grid, dataCell) {
      var ret = {};
      var PROCESS_NO = grid.getValue(dataCell.index.itemIndex, "PROCESS_NO");

      if (PROCESS_NO == "990000") {
        ret.editable = true;
        ret.styleName = "rule-editable";
      } else {
        ret.editable = false;
      }
      return ret;
    },
  },
  { name: "VAL_TP", dataType: "text", headerText: "BF_VAL_TP", visible: true, editable: false, width: "60", textAlignment: "center", mergeRule: { criteria: "value" } },
  { name: "INPUT_HORIZ", dataType: "number", headerText: "INPUT_HORIZ", visible: false, editable: false, width: "40" },
  { name: "INPUT_BUKT_CD", dataType: "text", headerText: "INPUT_BUKT_CD", visible: true, editable: false, width: "40", textAlignment: "center", mergeRule: { criteria: "value" } },
  { name: "TARGET_HORIZ", dataType: "number", headerText: "TARGET_HORIZ", visible: false, editable: false, width: "40" },
  { name: "TARGET_BUKT_CD", dataType: "text", headerText: "TARGET_BUKT_CD", visible: true, editable: false, width: "40", textAlignment: "center", mergeRule: { criteria: "value" } },
  { name: "ITEM_LV_NM", dataType: "text", headerText: "ITEM_LV_NM", visible: true, editable: false, width: "50", textAlignment: "center", mergeRule: { criteria: "value" } },
  { name: "SALES_LV_NM", dataType: "text", headerText: "SALES_LV_NM", visible: true, editable: false, width: "50", textAlignment: "center", mergeRule: { criteria: "value" } },
  { name: "INPUT_FROM_DATE", dataType: "datetime", headerText: "INPUT_FROM_DATE", visible: true, editable: false, width: "100", textAlignment: "center", format: "yyyy-MM-dd", mergeRule: { criteria: "value" } },
  { name: "INPUT_TO_DATE", dataType: "datetime", headerText: "INPUT_TO_DATE", visible: true, editable: false, width: "100", textAlignment: "center", format: "yyyy-MM-dd", mergeRule: { criteria: "value" } },
  { name: "TARGET_FROM_DATE", dataType: "datetime", headerText: "TARGET_FROM_DATE", visible: true, editable: false, width: "100", textAlignment: "center", format: "yyyy-MM-dd", mergeRule: { criteria: "value" } },
  { name: "TARGET_TO_DATE", dataType: "datetime", headerText: "TARGET_TO_DATE", visible: true, editable: false, width: "100", textAlignment: "center", format: "yyyy-MM-dd", mergeRule: { criteria: "value" } },
];

let grid2Items = [
  { name: "ID", dataType: "text", headerText: "ID", visible: false, editable: false, width: "0" },
  { name: "ENGINE_TP_CD", dataType: "text", headerText: "ENGINE_TP_CD", visible: true, editable: false, width: "100", textAlignment: "center" },
  { name: "ENGINE_TP_NM", dataType: "text", headerText: "ENGINE_TP", visible: false, editable: false, width: "150", textAlignment: "center" },
  { name: "DESCRIP", dataType: "text", headerText: "DESCRIP", visible: true, editable: false, width: "120", textAlignment: "center" },
  { name: "SEQ", dataType: "text", headerText: "SEQ", visible: true, editable: false, width: "30", textAlignment: "center" },
  {
    name: "INPUT",
    dataType: "group",
    orientation: "horizontal",
    headerText: "INPUT",
    headerVisible: true,
    hideChildHeaders: false,
    childs: [
      { name: "INPUT_HORIZ", dataType: "number", headerText: "CF_BF_POLICY_H", visible: true, editable: true, width: "50", mergeRule: { criteria: "value" } },
      { name: "INPUT_BUKT_CD", dataType: "dropdown", headerText: "BUCKET", visible: true, editable: true, width: "50", useDropdown: true, lookupDisplay: false, textAlignment: "center", mergeRule: { criteria: "value" }, mergeEdit: true },
    ],
  },
  {
    name: "TARGET",
    dataType: "group",
    orientation: "horizontal",
    headerText: "TARGET",
    headerVisible: true,
    hideChildHeaders: false,
    childs: [
      { name: "TARGET_HORIZ", dataType: "number", headerText: "CF_BF_POLICY_H", visible: true, editable: true, width: "50", mergeRule: { criteria: "value" }, mergeEdit: true },
      { name: "TARGET_BUKT_CD", dataType: "dropdown", headerText: "BUCKET", visible: true, editable: true, width: "50", useDropdown: true, lookupDisplay: false, textAlignment: "center", mergeRule: { criteria: "value" }, mergeEdit: true },
    ],
  },
  { name: "SALES_LV_CD", dataType: "text", headerText: "SALES_LV_NM", visible: true, editable: true, width: "100", useDropdown: true, lookupDisplay: true, textAlignment: "center", mergeRule: { criteria: "value" }, mergeEdit: true },
  { name: "ITEM_LV_CD", dataType: "text", headerText: "ITEM_LV_NM", visible: true, editable: true, width: "100", useDropdown: true, lookupDisplay: true, textAlignment: "center", mergeRule: { criteria: "value" }, mergeEdit: true },
  { name: "BF_DIST_RULE_CD", dataType: "text", headerText: "BF_DIST_RULE", visible: false, editable: true, width: "100", useDropdown: true, lookupDisplay: true, textAlignment: "center", mergeRule: { criteria: "value" }, mergeEdit: true },
  { name: "VAL_TP", dataType: "text", headerText: "BF_VAL_TP", visible: true, editable: true, width: "80", textAlignment: "center", useDropdown: true, lookupDisplay: true, mergeRule: { criteria: "value" }, mergeEdit: true },
  { name: "INPUT_FROM_DATE", dataType: "datetime", headerText: "INPUT_FROM_DATE", visible: true, editable: true, width: "100", textAlignment: "center", format: "yyyy-MM-dd", mergeRule: { criteria: "value" }, mergeEdit: true },
  { name: "INPUT_TO_DATE", dataType: "datetime", headerText: "INPUT_TO_DATE", visible: true, editable: true, width: "100", textAlignment: "center", format: "yyyy-MM-dd", mergeRule: { criteria: "value" }, mergeEdit: true },
  { name: "TARGET_FROM_DATE", dataType: "datetime", headerText: "TARGET_FROM_DATE", visible: true, editable: true, width: "100", textAlignment: "center", format: "yyyy-MM-dd", mergeRule: { criteria: "value" }, mergeEdit: true },
  { name: "TARGET_TO_DATE", dataType: "datetime", headerText: "TARGET_TO_DATE", visible: true, editable: true, width: "100", textAlignment: "center", format: "yyyy-MM-dd", mergeRule: { criteria: "value" }, mergeEdit: true },
  { name: "ATTR_01", dataType: "text", headerText: "ATTRIBUTE_01", visible: false, editable: true, width: "70" },
  { name: "ATTR_02", dataType: "text", headerText: "ATTRIBUTE_02", visible: false, editable: true, width: "70" },
  { name: "ATTR_03", dataType: "text", headerText: "ATTRIBUTE_03", visible: false, editable: true, width: "70" },
  { name: "ATTR_04", dataType: "text", headerText: "ATTRIBUTE_04", visible: false, editable: true, width: "70" },
  { name: "ATTR_05", dataType: "text", headerText: "ATTRIBUTE_05", visible: false, editable: true, width: "70" },
  { name: "ATTR_06", dataType: "text", headerText: "ATTRIBUTE_06", visible: false, editable: true, width: "70" },
  { name: "ATTR_07", dataType: "text", headerText: "ATTRIBUTE_07", visible: false, editable: true, width: "70" },
  { name: "ATTR_08", dataType: "text", headerText: "ATTRIBUTE_08", visible: false, editable: true, width: "70" },
  { name: "ATTR_09", dataType: "text", headerText: "ATTRIBUTE_09", visible: false, editable: true, width: "70" },
  { name: "ATTR_10", dataType: "text", headerText: "ATTRIBUTE_10", visible: false, editable: true, width: "70" },
];

let grid1ComboItem = [];
let grid2ComboItem = [
  {
    type: "array",
    array: [
      { value: "QTY", label: "QTY" },
      { value: "AMT", label: "AMT" },
    ],
    name: "VAL_TP",
    valueName: "value",
    labelName: "label",
  },
];

function ControlBoard(props) {
  //1. view page data store
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [username] = useUserStore((state) => [state.username]);

  //2. grid Object
  let [status, setStatus] = useState(null);
  let [grid1, setGrid1] = useState(null);
  let [grid2, setGrid2] = useState(null);

  let [grid2Visible, setGrid2Visible] = useState(false);
  let [button1Disabled, setButton1Disabled] = useState(false);
  let [button2Disabled, setButton2Disabled] = useState(false);
  let [button3Disabled, setButton3Disabled] = useState(false);
  let [button4Disabled, setButton4Disabled] = useState(false);

  let [SELECT_CRITERIA, setSELECT_CRITERIA] = useState("");

  // grid Object init
  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, "grid1");
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        setGrid1(grdObj1);
      }
    }

    const grdObj2 = getViewInfo(vom.active, "grid2");
    if (grdObj2) {
      if (grdObj2.dataProvider) {
        setGrid2(grdObj2);
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
    defaultValues: {},
  });

  const globalButtons = [
    {
      name: "search",
      action: (e) => {
        onSubmit();
        setGrid2Visible(false);
      },
      visible: false,
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
        refresh();
      },
      visible: false,
      disable: false,
    },
  ];

  useEffect(() => {
    if (grid1) {
      setViewInfo(vom.active, "globalButtons", globalButtons);
      setOptionGrid1();
      loadVersionId();

      gridComboLoad(grid1, {
        URL: "engine/dp/SRV_GET_SP_UI_DP_00_CONF_Q1",
        CODE_VALUE: "CD",
        CODE_LABEL: "CD",
        COLUMN: "RULE_01",
        PROP: "lookupData",
        PARAM_KEY: ["SP_UI_DP_00_CONF_Q1_01", "SP_UI_DP_00_CONF_Q1_02", "SP_UI_DP_00_CONF_Q1_03"],
        PARAM_VALUE: ["BF_SELECT_CRITERIA", "", ""],
      });

      loadData();
    }

    if (grid2) {
      setOptionGrid2();

      gridComboLoad(grid2, {
        URL: "engine/dp/SRV_GET_SP_UI_DP_00_CONF_Q1",
        CODE_VALUE: "CD",
        CODE_LABEL: "CD",
        COLUMN: "INPUT_BUKT_CD",
        PROP: "lookupData",
        PARAM_KEY: ["SP_UI_DP_00_CONF_Q1_01", "SP_UI_DP_00_CONF_Q1_02", "SP_UI_DP_00_CONF_Q1_03"],
        PARAM_VALUE: ["BF_BUKT_TP", "", ""],
      });

      gridComboLoad(grid2, {
        URL: "engine/dp/SRV_GET_SP_UI_DP_00_CONF_Q1",
        CODE_VALUE: "CD",
        CODE_LABEL: "CD",
        COLUMN: "TARGET_BUKT_CD",
        PROP: "lookupData",
        PARAM_KEY: ["SP_UI_DP_00_CONF_Q1_01", "SP_UI_DP_00_CONF_Q1_02", "SP_UI_DP_00_CONF_Q1_03"],
        PARAM_VALUE: ["BF_BUKT_TP", "", ""],
      });

      gridComboLoad(grid2, {
        URL: "engine/dp/SRV_GET_SP_UI_DP_00_CONF_Q1",
        CODE_VALUE: "CD",
        CODE_LABEL: "CD_NM",
        COLUMN: "BF_DIST_RULE_CD",
        PROP: "lookupData",
        PARAM_KEY: ["SP_UI_DP_00_CONF_Q1_01", "SP_UI_DP_00_CONF_Q1_02", "SP_UI_DP_00_CONF_Q1_03"],
        PARAM_VALUE: ["BF_DIST_RULE_VALUE", "", ""],
      });

      gridComboLoad(grid2, {
        URL: "engine/dp/SRV_GET_SP_UI_DP_00_LV_CD_Q1",
        CODE_VALUE: "CD",
        CODE_LABEL: "CD_NM",
        COLUMN: "SALES_LV_CD",
        PROP: "lookupData",
        // PARAM_KEY: ['SP_UI_DP_00_LV_CD_Q1_01', 'SP_UI_DP_00_LV_CD_Q1_02', 'SP_UI_DP_00_LV_CD_Q1_03', 'SP_UI_DP_00_LV_CD_Q1_04', 'SP_UI_DP_00_LV_CD_Q1_05', 'SP_UI_DP_00_LV_CD_Q1_06', 'SP_UI_DP_00_LV_CD_Q1_07', 'SP_UI_DP_00_LV_CD_Q1_08'],
        PARAM_KEY: ["LV_TP", "ACCOUNT_TP", "LEAF_YN", "LV_LEAF_YN", "TYPE", "ACCOUNT_LV_YN", "PARENT_SEARCH", "NOW_LEVEL_SEARCH"],
        PARAM_VALUE: ["S", "", "", "", "", "Y", "", "", ""],
      });

      gridComboLoad(grid2, {
        URL: "engine/dp/SRV_GET_SP_UI_DP_00_LV_CD_Q1",
        CODE_VALUE: "CD",
        CODE_LABEL: "CD_NM",
        COLUMN: "ITEM_LV_CD",
        PROP: "lookupData",
        // PARAM_KEY: ['SP_UI_DP_00_LV_CD_Q1_01', 'SP_UI_DP_00_LV_CD_Q1_02', 'SP_UI_DP_00_LV_CD_Q1_03', 'SP_UI_DP_00_LV_CD_Q1_04', 'SP_UI_DP_00_LV_CD_Q1_05', 'SP_UI_DP_00_LV_CD_Q1_06', 'SP_UI_DP_00_LV_CD_Q1_07', 'SP_UI_DP_00_LV_CD_Q1_08'],
        PARAM_KEY: ["LV_TP", "ACCOUNT_TP", "LEAF_YN", "LV_LEAF_YN", "TYPE", "ACCOUNT_LV_YN", "PARENT_SEARCH", "NOW_LEVEL_SEARCH"],
        PARAM_VALUE: ["I", "", "", "", "", "", "", "", ""],
      });
    }
  }, [grid1, grid2]);

  /** 이벤트 핸들러 */
  const onSubmit = (data) => {
    loadData(data);
  };

  function refresh() {
    reset();
    grid1.dataProvider.clearRows();
  }

  const setOptionGrid1 = () => {
    setVisibleProps(grid1, true, true, false);
    grid1.gridView.setDisplayOptions({
      fitStyle: "fill",
    });

    grid1.gridView.onCellEdited = function (grid, itemIndex, dataRow, field) {
      grid.commit();

      var dataProvider = grid.getDataSource();
      var fieldName = dataProvider.getOrgFieldName(field);
      var editedValue = dataProvider.getValue(dataRow, fieldName);

      if (fieldName === "RULE_01") {
        console.log(editedValue);
        setSELECT_CRITERIA(editedValue);
      }
    };
  };

  const setOptionGrid2 = () => {
    setVisibleProps(grid2, true, true, false);
    grid2.gridView.setDisplayOptions({
      fitStyle: "fill",
    });

    grid2.gridView.displayOptions.editItemMerging = true;
    grid2.gridView.editOptions.commitByCell = true;
    grid2.gridView.displayOptions.showInnerFocus = false;

    grid2.gridView.onCellEdited = function (grid, itemIndex, dataRow, field) {
      grid2.gridView.commit(true);
      let dataProvider = grid.getDataSource();
      let fieldName = dataProvider.getOrgFieldName(field);
      let fieldValue = dataProvider.getValue(dataRow, fieldName);
      for (let i = 0; i < grid2.dataProvider.getRowCount(); i++) {
        grid2.dataProvider.setValue(i, fieldName, fieldValue);
      }
    };
  };

  function loadVersionId() {
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_BF_16_VERSION_Q1",
      params: {},
    })
      .then(function (res) {
        let data = res.data.RESULT_DATA[0];
        setValue("VER_CD", data.VER_CD);
        setStatus(data.STATUS);
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function createVersionId() {
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_SP_UI_BF_00_VERSION_CREATE",
      params: {},
    })
      .then(function (res) {
        let data = res.data.RESULT_DATA[0];
        setValue("CREATE_VER_CD", data.VER_CD);
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function loadData() {
    let param = new URLSearchParams();
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_BF_16_Q1",
      data: param,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          grid1.dataProvider.fillJsonData(res.data.RESULT_DATA);

          res.data.RESULT_DATA.forEach(function (data) {
            let processNo = data.PROCESS_NO;
            let status = data.CL_STATUS;
            console.log("processNo===>", processNo, "status===>", status);

            if (processNo == "1" && (status == "Y" || status == true)) {
              setButton2Disabled(false);
              setButton3Disabled(true);
              setButton4Disabled(true);
            }
            if (parseInt(processNo) > 1 && parseInt(processNo) < 990000 && (status == "Y" || status == true)) {
              setButton2Disabled(true);
              setButton3Disabled(false);
              setButton4Disabled(true);
            }
            if (processNo == "990000" && (status == "Y" || status == true)) {
              setButton2Disabled(true);
              setButton3Disabled(true);
              setButton4Disabled(false);
            }
            if (processNo == "1000000" && (status == "Y" || status == true)) {
              setButton2Disabled(true);
              setButton3Disabled(true);
              setButton4Disabled(true);
            }
            if (processNo == "990000") {
              setSELECT_CRITERIA(data.RULE_01);
            }
          });
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function loadData2() {
    let param = new URLSearchParams();
    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_BF_16_Q2",
      data: param,
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          grid2.dataProvider.fillJsonData(res.data.RESULT_DATA);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  //version create
  function versionCreate() {
    setGrid2Visible(true);
    createVersionId();
    loadData2();
  }

  //예측 수행
  function runPredict() {
    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("Do you want to start forecasting?"), function (answer) {
      if (answer) {
        let formData = new FormData();
        formData.append("VER_CD", getValues("VER_CD"));
        formData.append("ENGINE_TP_CD", "ALL");
        formData.append("PROCESS_NO", "");
        formData.append("USER_ID", username);

        zAxios
          .post(baseURI() + "engine/bf/DoThread", formData, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then(function (response) {
            showMessage("Information", response.data.RESULT_MESSAGE, { close: false });
            loadData();
          })
          .catch(function (e) {
            console.error(e);
          });
      }
    });
  }

  //예측값 결정
  function bestSelect() {
    let formData = new FormData();
    formData.append("VER_CD", getValues("VER_CD"));
    formData.append("SELECT_CRITERIA", SELECT_CRITERIA);
    formData.append("PROCESS_NO", "990000");
    formData.append("USER_ID", username);

    zAxios
      .post(baseURI() + "engine/dp/SRV_SELECT_BEST_VAL", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(function (response) {
        showMessage("Information", transLangKey("MSG_0003"), { close: false });
        loadData();
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  //버전 확정
  function close() {
    let itemIndex = grid1.gridView.getCurrent().dataRow;

    let formData = new FormData();
    formData.append("VER_CD", getValues("VER_CD"));
    formData.append("SELECT_CRITERIA", SELECT_CRITERIA);
    formData.append("PROCESS_NO", "1000000");
    //formData.append('BUKT_CD', grid1.dataProvider.getValue(itemIndex, 'TARGET_BUKT_CD'));
    formData.append("USER_ID", username);

    zAxios
      .post(baseURI() + "engine/dp/SRV_CLOSE", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(function (response) {
        showMessage("Alert", transLangKey(response.data.RESULT_DATA.IM_DATA.SP_UI_BF_16_RT_S3_P_RT_MSG), { close: false });
        loadData();
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  function generateVersion() {
    grid2.gridView.commit(true);
    showMessage(transLangKey("MSG_CONFIRM"), transLangKey("MSG_SAVE"), function (answer) {
      if (answer) {
        grid1.gridView.showToast(progressSpinner + "Saving data...", true);

        let changeRowData = [];
        for (let row = 0; row < grid2.dataProvider.getRowCount(); row++) {
          let data = grid2.dataProvider.getJsonRow(row);
          data.INPUT_FROM_DATE = data.INPUT_FROM_DATE.format("yyyy-MM-ddTHH:mm:ss");
          data.INPUT_TO_DATE = data.INPUT_TO_DATE.format("yyyy-MM-ddTHH:mm:ss");
          data.TARGET_FROM_DATE = data.TARGET_FROM_DATE.format("yyyy-MM-ddTHH:mm:ss");
          data.TARGET_TO_DATE = data.TARGET_TO_DATE.format("yyyy-MM-ddTHH:mm:ss");
          changeRowData.push(data);
        }

        let formData = new FormData();
        formData.append("all", JSON.stringify(changeRowData));
        formData.append("VERSION_ID", getValues("CREATE_VER_CD"));
        formData.append("USER_ID", username);

        zAxios
          .post(baseURI() + "engine/dp/SRV_SET_SP_UI_BF_16_S1", formData, {
            headers: {
              "Content-Type": "application/json",
            },
          })
          .then(function (response) {
            grid1.gridView.hideToast();
            setGrid2Visible(false);
            loadVersionId();
            loadData();
          })
          .catch(function (e) {
            console.error(e);
          });
      }
    });
  }

  /** 이벤트 핸들러 끝 */

  return (
    <ContentInner>
      <SearchArea>
        <SearchRow>
          {/* direction : row, column */}
          <InputField name="VER_CD" label={transLangKey("VERSION_ID")} control={control} readonly={true} />
        </SearchRow>
      </SearchArea>
      <ResultArea>
        <Box sx={{ display: "flex", height: "100%", flexDirection: "column", alignContent: "stretch", alignItems: "stretch" }}>
          <ButtonArea title={transLangKey("UI_BF_16")}>
            <LeftButtonArea>
              <CommonButton type="text" title={transLangKey("VERSION_CREATE")} onClick={() => { versionCreate(); }} disabled={button1Disabled}>
              </CommonButton>
              <CommonButton type="text" title={transLangKey("RUN_PREDICT")} onClick={() => { runPredict(); }} disabled={button2Disabled}>
              </CommonButton>
              <CommonButton type="text" title={transLangKey("BEST_SELECT")} onClick={() => { bestSelect(); }} disabled={button3Disabled}>
              </CommonButton>
              <CommonButton type="text" title={transLangKey("CLOSE")} onClick={() => { close(); }} disabled={button4Disabled}>
              </CommonButton>
            </LeftButtonArea>
          </ButtonArea>
          <Box sx={{ height: "100%" }}>
            <BaseGrid id="grid1" items={grid1Items} comboItem={grid1ComboItem}></BaseGrid>
          </Box>
        </Box>
        <Box sx={{ display: "flex", height: "100%", flexDirection: "column", alignContent: "stretch", alignItems: "stretch" }} style={grid2Visible ? { display: "block" } : { display: "none" }}>
          <ButtonArea>
            <LeftButtonArea>
              <InputField name="CREATE_VER_CD" label={transLangKey("VERSION_ID")} control={control} readonly={true} />
            </LeftButtonArea>
            <RightButtonArea>
              <CommonButton type="text" title={transLangKey("GENERATE")} onClick={() => { generateVersion(); }}>
              </CommonButton>
            </RightButtonArea>
          </ButtonArea>
          <Box sx={{ height: "100%" }}>
            <BaseGrid id="grid2" items={grid2Items} comboItem={grid2ComboItem}></BaseGrid>
          </Box>
        </Box>
      </ResultArea>
      <StatusArea show={false} message={message}>
        <GridCnt grid="grid1" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")}></GridCnt>
      </StatusArea>
    </ContentInner>
  );
}

export default ControlBoard;
