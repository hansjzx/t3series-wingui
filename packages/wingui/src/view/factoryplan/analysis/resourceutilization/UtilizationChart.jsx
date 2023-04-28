import React, { useEffect, useRef, useState } from 'react';
import { initI18n, transLangKey } from '@wingui';
import {
  ChartAxisTitlePlugin, ChartLegendPlugin, setChartCustomTooltip, setChartOptions
} from "@wingui/view/factoryplan/common/common";
import { Box } from '@mui/material';
import { Bar } from 'react-chartjs-2';
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

const containerID = 'resrc-util-legend-container';
const scales = {
  x: {
    grid: {
      drawOnChartArea: false,
    }
  },
  timeYAxis: {
    display: true,
    position: 'left',
    title: {
      display: false
    },
    ticks: {
      padding: 15,
      font: { size: 13 },
      callback: (value) => value
    },
    grid: {
      drawTicks: false,
      drawBorder: false
    }
  },
  utilRateYAxis: {
    display: true,
    position: 'right',
    title: {
      display: false
    },
    ticks: {
      padding: 15,
      font: { size: 13 },
      callback: (value) => value
    },
    grid: {
      drawOnChartArea: false,
      drawTicks: false,
      drawBorder: false
    },
  },
  targetRateYAxis: {
    display: true,
    position: 'right',
    title: {
      display: false
    },
    ticks: {
      padding: 15,
      font: { size: 13 },
      callback: (value) => value
    },
    grid: {
      drawOnChartArea: false,
      drawTicks: false,
      drawBorder: false
    }
  }
};

function UtilizationChart(props) {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    const chart = chartRef.current;
    setChartOptions(chart);
    setChartCustomTooltip(chart);
    let options = chart.options;
    options.interaction = { intersect: false, mode: 'index' };
    options.layout.padding = { left: 10, right: 10, top: 20, bottom: 25 };
    options.plugins.customLegend = { containerID };
    options.plugins.title = {
      display: true,
      text: transLangKey('FP_UTILIZATION'),
      font: {
        family: 'Malgun Gothic, 맑은 고딕, AppleSDGothicNeo-Light, sans-serif',
        size: 17,
        weight: 'bold'
      },
      padding: {
        top: 8, left: 0, right: 0, bottom: 27
      }
    };
    options.plugins.customTitle = {
      y: {
        left: {
          display: true,
          text: `(${transLangKey('TIME')}: ${transLangKey('FP_MINUTES')})`,
          offsetX: -1
        },
        right: {
          display: true,
          text: `(${transLangKey('FP_UTILIZATION')}: %)`,
          offsetX: -15
        }
      }
    };
    options.scales = scales;
    chart.update();
  }, []);
  useEffect(() => {
    setChartData({ ...chartData, labels: props.labels });
  }, [props.labels]);
  useEffect(() => {
    props.data.forEach(data => {
      if (!data.yAxisID) data.yAxisID = `${data.type}YAxis`;
      if (data.type === 'line') {
        data.borderColor = 'rgb(247, 126, 33)';
        data.backgroundColor = 'rgb(247, 126, 33)';
      }
    });
    const labels = props.labels;
    setChartData({ labels, datasets: props.data });
  }, [props.data]);
  useEffect(() => {
    let { scales, plugins } = chartRef.current.options;
    if (props.title === transLangKey('FP_UTILIZATION')) {
      scales.timeYAxis.display = false;
      scales.utilRateYAxis.position = 'left';
      scales.utilRateYAxis.grid.drawOnChartArea = true;
      scales.targetRateYAxis.display = true;
      plugins.customTitle.y.left.text = `(${transLangKey('FP_UTILIZATION')}: %)`;
      plugins.customTitle.y.right.text = `(${transLangKey('TARGET')}: %)`;
    } else {
      scales.timeYAxis.display = true;
      scales.utilRateYAxis.position = 'right';
      scales.utilRateYAxis.grid.drawOnChartArea = false;
      scales.targetRateYAxis.display = false;
      plugins.customTitle.y.left.text = `(${transLangKey('TIME')}: ${transLangKey('FP_MINUTES')})`;
      plugins.customTitle.y.right.text = `(${transLangKey('FP_UTILIZATION')}: %)`;
    }
    chartRef.current.options.plugins.title.text = props.title;
    chartRef.current.update();
  }, [props.title]);

  return (
    <Box className="chart-area">
      <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ height: 'calc(100% - 21px)' }}>
          <Bar ref={chartRef} data={chartData} plugins={[ChartLegendPlugin, ChartAxisTitlePlugin]}/>
        </Box>
        <div id={containerID}></div>
      </Box>
    </Box>
  )
}

export default UtilizationChart;
