import React, { useEffect, useRef, useState } from "react";
import { initI18n, transLangKey } from "@wingui";
import {
  ChartAxisTitlePlugin, ChartDataLabelPlugin, setChartCustomTooltip, setChartOptions
} from "@wingui/view/factoryplan/common/common";
import { Box } from '@mui/material';
import { Bar, getElementAtEvent } from 'react-chartjs-2';
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
      display: false
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
    },
    title: {
      display: false
    }
  }
};

function LeadTime(props) {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        type: 'bar',
        backgroundColor: '#ffc604'
      }
    ]
  });
  useEffect(() => {
    const chart = chartRef.current;
    setChartOptions(chart);
    setChartCustomTooltip(chart, true);
    let options = chart.options;
    options.indexAxis = 'y';
    options.layout.padding.right = 80;
    options.layout.padding.bottom = 40;
    options.plugins.customTitle = {
      y: {
        left: {
          display: true,
          text: `(${transLangKey('FP_ITEM')})`,
          offsetX: 40
        }
      },
      x: {
        bottom: {
          display: true,
          text: `(${transLangKey('FP_DAY')})`,
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
      const datasets = [{ ...chartData.datasets[0], data: props.data.data }];
      setChartData({ labels, datasets });
      const chart = chartRef.current;
      chart.options.plugins.customTitle.y.left.offsetX = (props.data.data.length > 0) ? 70 : 40
      chart.update();
    }
  }, [props.data]);
  
  function handleDoubleClick(e) {
    const chart = chartRef.current;
    const element = getElementAtEvent(chart, e);
    if (element && element.length > 0) {
      const itemCd = chartData.labels[element[0].index];
      props.onDblClick(chartRef.current, e, 'resourcegantt', { itemCd });
      // history.push({ pathname: '/factoryplan/analysis/resourcegantt', state: {...searchCondition, itemCd }});
    }
  }
  
  return (
    <Box className="chart-area">
      <Bar ref={chartRef} data={chartData} plugins={[ChartDataLabelPlugin, ChartAxisTitlePlugin]} onDoubleClick={(e) => handleDoubleClick(e)} />
    </Box>
  );
}

export default LeadTime;
