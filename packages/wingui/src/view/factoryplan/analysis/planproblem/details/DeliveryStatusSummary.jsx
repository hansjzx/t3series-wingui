import React, { useEffect, useState } from "react";
import { PolarArea } from 'react-chartjs-2';
import { Box } from '@mui/material';
import { useContentStore } from "@zionex/wingui-core/src/store/contentStore";
import Details from "@wingui/view/factoryplan/common/component/DetailCard";
import { transLangKey } from "@wingui";

const theme = {
  primary: '#3B7DDD', warning: '#fcb92c', danger: '#dc3545'
}

function DeliveryStatusSummary(props) {
  const activeViewId = useContentStore(state => state.activeViewId)
  const [chartData, setChartData] = useState({
    labels: [transLangKey("FP_ONTIME_DELIVERY"), transLangKey("FP_DELIVERY_DELAY"), transLangKey("FP_DELIVERY_SHORT")],
    datasets: [{
      data: [props.data.okCnt, props.data.lateCnt, props.data.shortCnt],
      backgroundColor: [theme.primary, theme.warning, theme.danger]
    }]
  })
  useEffect(() => {
    setChartData({
      labels: [transLangKey("FP_ONTIME_DELIVERY"), transLangKey("FP_DELIVERY_DELAY"), transLangKey("FP_DELIVERY_SHORT")],
      datasets: [{
        data: [props.data.okCnt, props.data.lateCnt, props.data.shortCnt],
        backgroundColor: [theme.primary, theme.warning, theme.danger]
      }]
    })
  }, [props.data])
  return (
    <Details title={`${transLangKey("FP_DELIVERY_STATUS_SUMMARY")} (${transLangKey("FP_ORDER")} ${transLangKey("FP_ORDERS")})`} style={{ padding: '2rem !important' }}>
      <Box className="chart-area">
        <PolarArea id={activeViewId + "-deliveryStateChart"} data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'left' } } }}></PolarArea>
      </Box>
    </Details>
  );
}

export default DeliveryStatusSummary;
