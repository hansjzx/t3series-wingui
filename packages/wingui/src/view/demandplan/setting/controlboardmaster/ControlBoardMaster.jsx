import React from "react";
import BaseControlBoardMaster from "@wingui/view/demandplan/setting/controlboardmaster/BaseControlBoardMaster";

export default function ControlBoardMaster() {
  return <BaseControlBoardMaster planTypeCode="DP_PLAN_MONTHLY" isDemandPlanOnly={true} />;
}
