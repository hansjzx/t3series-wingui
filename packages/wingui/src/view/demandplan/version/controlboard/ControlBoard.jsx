import React from "react";
import BaseControlBoard from "@wingui/view/demandplan/version/controlboard/BaseControlBoard";

export default function ControlBoard() {
  return (<BaseControlBoard planTypeCode={"DP_PLAN_MONTHLY"} isDemandPlanOnly={true} />);
}


