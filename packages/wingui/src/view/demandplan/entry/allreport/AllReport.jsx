import React from "react";
import BaseAllReport from "@wingui/view/demandplan/entry/allreport/BaseAllReport";

export default function AllReport() {
  return <BaseAllReport hasChart={false} planTypeCode={"DP_PLAN_MONTHLY"} />;
}
