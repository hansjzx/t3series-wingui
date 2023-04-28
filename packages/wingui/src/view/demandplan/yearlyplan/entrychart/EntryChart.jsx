import React from "react";
import BaseEntry from "@wingui/view/demandplan/entry/entry/BaseEntry";

export default function EntryChart() {
  return <BaseEntry hasChart={true} planTypeCode={"DP_PLAN_YEARLY"} />;
}
