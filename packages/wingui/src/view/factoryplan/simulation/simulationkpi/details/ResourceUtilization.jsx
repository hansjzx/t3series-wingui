import React, { useEffect, useRef, useState } from "react";
import {
  ChartLegendPlugin, setChartOptions, setChartCustomTooltip, ChartAxisTitlePlugin
} from "@wingui/view/factoryplan/common/common";
import { initI18n, transLangKey } from "@wingui";
import { Box } from '@mui/material';
import { Line } from 'react-chartjs-2';
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

const containerID = 'simulation-resrc-util-legend-container';
const scales = {
  x: {
    ticks: {
      padding: 17,
      font: { size: 13 }
    },
    grid: {
      drawTicks: false,
      drawBorder: false
    }
  },
  y: {
    display: true,
    position: 'left',
    max: 100,
    min: 0,
    ticks: {
      stepSize: 20,
      padding: 15,
      font: { size: 13 }
    },
    grid: {
      drawTicks: false,
      drawBorder: false
    },
    title: {
      display: false
    }
  }
};

function ResourceUtilization(props) {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        type: 'line',
        label: transLangKey('FP_AVG_UTILIZATION'),
        borderColor: '#f66776',
        backgroundColor: '#f66776'
      }
    ]
  });
  useEffect(() => {
    const chart = chartRef.current;
    setChartOptions(chart);
    setChartCustomTooltip(chart);
    let options = chart.options;
    options.layout.padding.top = 50;
    options.interaction = { intersect: false, mode: 'index' };
    options.scales = scales;
    options.plugins.customLegend = { containerID };
    options.plugins.customTitle = {
      y: {
        left: {
          display: true,
          text: `(${transLangKey('FP_UTILIZATION')}: %)`
        }
      }
    };
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

  function handleClick(e) {
    props.onDblClick(chartRef.current, e, 'resourceutilization');
  }
  
  return (
    <Box className="chart-area">
      <Box sx={{ height: "calc(100% - 35px)" }}>
        <Line ref={chartRef} data={chartData} plugins={[ChartLegendPlugin, ChartAxisTitlePlugin]} onDoubleClick={(e) => handleClick(e)} />
      </Box>
      <div id={containerID}></div>
    </Box>
  );
}

export default ResourceUtilization;
