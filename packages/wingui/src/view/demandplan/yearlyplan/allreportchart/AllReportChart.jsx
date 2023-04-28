import React from "react";
import BaseAllReport from "@wingui/view/demandplan/entry/allreport/BaseAllReport";

export default function AllReportChart() {
  return <BaseAllReport hasChart={true} planTypeCode={"DP_PLAN_YEARLY"} />;
}
