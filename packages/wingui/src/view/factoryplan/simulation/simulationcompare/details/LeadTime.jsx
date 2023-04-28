import React, { useEffect, useRef, useState } from "react";
import { initI18n, transLangKey } from "@wingui";
import {
  ChartDataLabelPlugin, setChartCustomTooltip, setChartOptions
} from "@wingui/view/factoryplan/common/common";
import { Box } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import Details from "@wingui/view/factoryplan/common/component/DetailCard";
import { useChartHighlight } from "@wingui/view/factoryplan/simulation/simulationcompare/SimulationCompare";
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Title
} from 'chart.js';
ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);
initI18n(localStorage.getItem('languageCode'));

const scales = {
  x: {
    display: true,
    min: 0,
    ticks: {
      stepSize: 0.5,
      padding: 15,
      font: { size: 13 },
      callback: (value) => value
    },
    title: {
      display: true,
      text: `(${transLangKey('FP_DAY')})`,
      align: 'end',
      padding: 0,
      font: { size: 14 },
    },
    grid: {
      drawTicks: false,
      drawBorder: false
    }
  },
  y: {
    grid: {
      drawOnChartArea: false,
      drawTicks: false,
      drawBorder: false
    },
    ticks: {
      padding: 15,
      font: { size: 13 }
    }
  }
};

function LeadTime(props) {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        type: 'bar'
      }
    ]
  });
  useEffect(() => {
    const chart = chartRef.current;
    setChartOptions(chart);
    setChartCustomTooltip(chart, true);
    let options = chart.options;
    options.indexAxis = 'y';
    options.layout.padding.bottom = 40;
    options.scales = scales;
    options.onHover = (e) => {
      const { intersect, mode } = chart.options.interaction;
      const element = chart.getElementsAtEventForMode(e, mode, { intersect }, false);
      chart.canvas.style.cursor = element[0] ? 'pointer' : 'default';
    }
    chart.update();
  }, []);
  useEffect(() => {
    if (props.data) {
      const labels = props.data.labels;
      const datasets = [{ ...chartData.datasets[0], data: props.data.data }];
      setChartData({ labels, datasets });
    }
  }, [props.data]);
  useChartHighlight(props.version, chartRef.current);
  function handleDoubleClick(e) {
    props.onDblClick(chartRef.current, e, 'resourcegantt');
  }

  return (
    <Details title="FP_AVG_PRDT_LEAD_TIME">
      <Box className="chart-area">
        <Bar ref={chartRef} data={chartData} plugins={[ChartDataLabelPlugin]} onDoubleClick={(e) => handleDoubleClick(e)} />
      </Box>
    </Details>
  );
}

export default LeadTime;
