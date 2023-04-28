import React, { useEffect, useRef, useState } from "react";
import {
  ChartAxisTitlePlugin, ChartDataLabelPlugin, ChartLegendPlugin, setChartCustomTooltip, setChartOptions
} from "@wingui/view/factoryplan/common/common";
import { initI18n, transLangKey } from "@wingui";
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

const containerID = 'job-change-legend-container';
const scales = {
  x: {
    ticks: {
      padding: 15,
      font: { size: 13 }
    },
    grid: {
      drawOnChartArea: false,
      drawTicks: false,
      drawBorder: false
    }
  },
  minutesYAxis: {
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
  numberYAxis: {
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

function JobChange(props) {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        type: 'line',
        label: transLangKey('TIMES'),
        yAxisID: 'numberYAxis',
        borderColor: '#2c69a7',
        backgroundColor: '#2c69a7',
        legendOrder: 2
      },
      {
        type: 'bar',
        label: transLangKey('TIME'),
        yAxisID: 'minutesYAxis',
        barPercentage: 0.4,
        backgroundColor: '#a1d2fa',
        legendOrder: 1
      }
    ]
  });
  useEffect(() => {
    const chart = chartRef.current;
    setChartOptions(chart);
    setChartCustomTooltip(chart);
    let options = chart.options;
    options.interaction = { intersect: false, mode: 'index' };
    options.layout.padding.right = 40;
    options.layout.padding.top = 50;
    options.layout.padding.bottom = 10;
    options.plugins.customLegend = { containerID };
    options.plugins.customTitle = {
      y: {
        left: {
          display: true,
          text: `(${transLangKey('TIME')}: ${transLangKey('FP_MINUTES')})`,
          offsetX: 50
        },
        right: {
          display: true,
          text: `(${transLangKey('TIMES')})`
        }
      }
    };
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
      const datasets = [
        { ...chartData.datasets[0], data: props.data.jcCntSumData },
        { ...chartData.datasets[1], data: props.data.jcTmSumData }
      ];
      setChartData({ labels, datasets });
    }    
  }, [props.data]);
  
  function handleClick(e) {
    props.onDblClick(chartRef.current, e, 'resourcegantt');
  }

  return (
    <Box className="chart-area">
      <Box sx={{ height: "calc(100% - 35px)" }}>
        <Bar ref={chartRef} data={chartData} plugins={[ChartLegendPlugin, ChartDataLabelPlugin, ChartAxisTitlePlugin]} onDoubleClick={(e) => handleClick(e)} />
      </Box>
      <div id={containerID}></div>
    </Box>
  );  
}

export default JobChange;
