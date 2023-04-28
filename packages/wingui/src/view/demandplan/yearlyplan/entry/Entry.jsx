import React from "react";
import BaseEntry from "@wingui/view/demandplan/entry/entry/BaseEntry";

export default function Entry() {
  return <BaseEntry hasChart={false} planTypeCode={"DP_PLAN_YEARLY"} />;
}
