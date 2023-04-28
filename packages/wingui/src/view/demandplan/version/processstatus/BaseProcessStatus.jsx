import React, { useState, useEffect } from "react";

import { useForm } from "react-hook-form";
import { Box, Tooltip, IconButton } from "@mui/material";

import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

import { ContentInner, ResultArea, SearchArea, StatusArea, SearchRow, InputField, CommonButton, BaseGrid, GridCnt, useViewStore, useUserStore, zAxios } from "@zionex/wingui-core/src/common/imports";
import { transLangKey } from "@wingui";
import PopSelectUser from "@wingui/view/demandplan/common/PopSelectUser";
import { loadOption, isEmptyArray } from "@wingui/view/demandplan/DpUtil";
import PropTypes from "prop-types";

let steps = []; //['SalesMan(1/5)', 'Team(0/3)', 'Goc(1/1)'];

let grid1Items = [
  { name: "AUTH_TYPE", dataType: "text", headerText: "AUTH_TP_NM", visible: false, editable: false, width: 100, textAlignment: "center" },
  { name: "OPERATOR_ID", dataType: "text", headerText: "OPERATOR_ID", visible: false, editable: false, width: 100, textAlignment: "center" },
  { name: "OPERATOR_NAME", dataType: "text", headerText: "OPERATOR_NAME", visible: true, editable: false, width: 110, textAlignment: "center" },
  { name: "STATUS", dataType: "text", headerText: "STATUS", visible: true, editable: false, width: 110, textAlignment: "center" },
  { name: "STATUS_DATE", dataType: "datetime", headerText: "STATUS_DATE", visible: true, editable: false, width: 110, textAlignment: "center" },
];

export function BaseProcessStatus(props) {
  const [username, displayName, systemAdmin] = useUserStore((state) => [state.username, state.displayName, state.systemAdmin]);
  const [activeStep, setActiveStep] = React.useState(-1);

  const [grid1, setGrid1] = useState(null);
  const [message, setMessage] = useState();
  const [viewData, getViewInfo, setViewInfo] = useViewStore((state) => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [userPopupOpen, setUserPopupOpen] = useState(false);

  const [planTpOptions, setPlanTpData] = useState([]);
  const [authTpOptions, setAuthTpData] = useState([]);
  const [versionOptions, setVersionData] = useState([]);

  const {
    reset,
    control,
    getValues,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      nextOnly: ["Y"],
    },
  });

  const globalButtons = [
    {
      name: "search",
      action: () => {
        onLoad();
      },
      visible: true,
      disable: false,
    },
    {
      name: "save",
      visible: false,
      disable: false,
    },
    {
      name: "refresh",
      action: () => {
        reset();
      },
      visible: true,
      disable: false,
    },
  ];
  // --------------------------------------------------------------------------------------------------------------------------

  const selectedUserId = watch("userId");
  const selectedPlanTp = watch("planType");
  const selectedVersion = watch("version");

  /***************** LOAD ************/
  const loadAuthTp = async () => {
    const options = await loadOption(true, "SRV_GET_SP_UI_DP_00_EMP_AUTH_TP_Q1", { SP_UI_DP_00_EMP_AUTH_TP_Q1_01: selectedUserId, SP_UI_DP_00_EMP_AUTH_TP_Q1_02: "UI_DP_94" }, "CD", "CD_NM", false, true);
    if (!isEmptyArray(options)) {
      setAuthTpData(options);
    }
  };

  const loadPlanTp = async () => {
    const options = await loadOption(true, "SRV_GET_SP_UI_DP_00_CONF_Q1", { SP_UI_DP_00_CONF_Q1_01: "DP_PLAN_TYPE", SP_UI_DP_00_CONF_Q1_02: props.planTypeCode, SP_UI_DP_00_CONF_Q1_03: "" }, "CD", "CD_NM", false, true);
    if (!isEmptyArray(options)) {
      setPlanTpData(options);
    }
  };

  const findPlanTypeId = () => {
    const planTypeData = planTpOptions.find((v) => v.value === selectedPlanTp);
    if (planTypeData !== null) {
      return planTypeData.data.ID;
    }
    return null;
  };

  const loadVersion = async (planTp, plnTpKey) => {
    //console.log("loadVersion planTp:", planTp, "plnTpKey:", plnTpKey);
    const options = await loadOption(true, "GetVersion", { SERVER_TYPE: "DP", PLAN_TYPE: planTp, PLAN_TYPE_KEY: plnTpKey }, "VER_ID", "VER_ID", false, false);
    if (!isEmptyArray(options)) {
      setVersionData(options);
    }
  };

  const loadGrid1Data = () => {
    //const verData = findVersionData(watch("version"));

    let param = new URLSearchParams();
    param.append("AUTH_TYPE", getValues("authTp"));
    param.append("OPERATOR_ID", getValues("userId"));
    param.append("NEXT_ONLY", getValues("nextOnly")[0] === "Y");
    param.append("VER_CD", getValues("version"));

    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/GetStatus",
      data: param,
    })
      .then(function (res) {
        let dataArr = [];
        if (res.status === gHttpStatus.SUCCESS) {
          dataArr = res.data.RESULT_DATA;
          grid1.dataProvider.fillJsonData(dataArr);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  const loadTotalStatus = () => {
    //console.log(selectedVersion);
    let param = new URLSearchParams();
    param.append("SP_UI_DP_93_Q1_01", selectedVersion);
    param.append("SP_UI_DP_93_Q1_02", findPlanTypeId());

    zAxios({
      method: "post",
      url: baseURI() + "engine/dp/SRV_GET_SP_UI_DP_93_Q1",
      data: param,
    })
      .then(function (res) {
        let dataArr = [];
        if (res.status === gHttpStatus.SUCCESS) {
          dataArr = res.data.RESULT_DATA;
          // console.log("prev load steps==>", steps);
          steps = [];
          let activeIdx = 0;
          for (let idx in dataArr) {
            let obj = dataArr[idx];
            //console.log("obj==>",obj)
            let workTp = obj["WORK_TP_ID"];
            if (workTp === "DP") {
              let status = obj["STATUS"];
              let lvCd = obj["WORK_NM"];
              let lvStatus = lvCd + "(" + status + ")";
              steps.push(lvStatus);

              let statusCheck = status.split("/");
              if (statusCheck.length === 2) {
                if (statusCheck[0] === statusCheck[1]) {
                  activeIdx = idx;
                }
              }
            }
          }
          //console.log("activeIdx",activeIdx)
          // console.log("load steps==>", steps);
          setActiveStep(activeIdx);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  // --------------------------------------------------------------------------------------------------------------------------

  const onLoad = () => {
    loadGrid1Data();
  };

  // --------------------------------------------------------------------------------------------------------------------------

  function setUserCd(items) {
    if (items !== null && items.length > 0) {
      setValue("userId", items[0].USER_ID);
      setValue("empNm", items[0].EMP_NM);
    }
  }

  const setGridOption = () => {
    grid1.gridView.setCheckBar({
      visible: false,
    });

    grid1.gridView.setEditOptions({
      insertable: false,
      appendable: false,
    });

    grid1.gridView.setStateBar({
      visible: false,
    });

    grid1.gridView.displayOptions.fitStyle = "fill";
  };

  // --------------------------------------------------------------------------------------------------------------------------

  const openUserPopup = (visible) => {
    setUserPopupOpen(visible);
  };

  // --------------------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    setValue("userId", username);
    loadPlanTp();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      loadAuthTp();
    }
  }, [selectedUserId]);

  useEffect(() => {
    if (planTpOptions && planTpOptions.length > 0) {
      setValue("planType", planTpOptions[0].value);
    }
  }, [planTpOptions]);

  useEffect(() => {
    if (authTpOptions && authTpOptions.length > 0) {
      setValue("authTp", authTpOptions[0].value);
    }
  }, [authTpOptions]);

  useEffect(() => {
    if (selectedPlanTp) {
      //console.log("BBB", selectedPlanTp);
      loadVersion(selectedPlanTp, findPlanTypeId());
    }
  }, [selectedPlanTp]);

  useEffect(() => {
    if (versionOptions && versionOptions.length > 0) {
      setValue("version", versionOptions[0].value);
    }
  }, [versionOptions]);

  useEffect(() => {
    if (selectedVersion && selectedVersion.length > 0) {
      loadTotalStatus();
    }
  }, [selectedVersion]);

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, "grid1");
    if (grdObj1 && grdObj1.dataProvider) {
      if (grid1 !== grdObj1) {
        setGrid1(grdObj1);
      }
    }
  }, [viewData]);

  useEffect(() => {
    if (grid1) {
      setViewInfo(vom.active, "globalButtons", globalButtons);
      setGridOption();
    }
  }, [grid1]);

  //

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <InputField name="planType" label={transLangKey("PLAN_TP")} type="select" control={control} options={planTpOptions} />
            <InputField name="version" label={transLangKey("VERSION_ID")} control={control} />
            <InputField
              type="action"
              name="userId"
              label={transLangKey("USER_ID")}
              control={control}
              onClick={() => {
                openUserPopup(true);
              }}>
              <Icon.Search />
            </InputField>
            <InputField type={"text"} name="empNm" label={transLangKey("EMP_NM")} control={control} readonly={true} />
            <InputField type="select" name="authTp" label={transLangKey("AUTH_TP_NM")} control={control} options={authTpOptions} />
            <InputField type="check" name={"nextOnly"} label="" control={control} options={[{ label: transLangKey("Next Only"), value: "Y" }]} />
          </SearchRow>
        </SearchArea>

        <ResultArea sizes={[10, 90]} direction={"vertical"}>
          <Box sx={{ marginTop: "3em" }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label) => {
                const stepProps = {};
                const labelProps = {};
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
          </Box>
          <Box>
            <BaseGrid id="grid1" items={grid1Items} />
          </Box>
        </ResultArea>
        <StatusArea show={false} message={message}>
          <GridCnt grid="grid1" format={"{0} " + transLangKey("CASES") + " " + transLangKey("MSG_0010")} />
        </StatusArea>
      </ContentInner>
      <PopSelectUser open={userPopupOpen} onClose={() => openUserPopup(false)} confirm={setUserCd} multiple={false} />
    </>
  );
}
BaseProcessStatus.propTypes = {
  planTypeCode: PropTypes.oneOf(["DP_PLAN_MONTHLY", "DP_PLAN_YEARLY"]),
};

export default BaseProcessStatus;
