import React, { useEffect, useRef, useState } from "react";
import {
  ChartAxisTitlePlugin, ChartDataLabelPlugin, setChartCustomTooltip, setChartOptions
} from "@wingui/view/factoryplan/common/common";
import { initI18n, transLangKey } from "@wingui";
import { Box, ToggleButton, ToggleButtonGroup } from '@mui/material';
import Details from "@wingui/view/factoryplan/common/component/DetailCard";
import { Bar } from 'react-chartjs-2';
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

const JobChangeChartLegendPlugin = {
  id: 'jcCustomLegend',
  afterUpdate: function(chart, args, options) {
    if (options.containerID) {
      const getOrCreateLegendList = (chart, id) => {
        const legendContainer = document.getElementById(id);
        let listContainer = legendContainer.querySelector('ul');

        if (!listContainer) {
          listContainer = document.createElement('ul');
          listContainer.style.display = 'grid';
          listContainer.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, auto))';
          listContainer.style.columnGap = '20px';
          listContainer.style.justifyContent = 'center';
          listContainer.style.margin = '0 36px';
          listContainer.style.padding = 0;

          legendContainer.appendChild(listContainer);
        }

        return listContainer;
      };
      const ul = getOrCreateLegendList(chart, options.containerID);

      // Remove old legend items
      while (ul.firstChild) {
        ul.firstChild.remove();
      }

      // Reuse the built-in legendItems generator
      // const items = chart.options.plugins.legend.labels.generateLabels(chart);
      let items;
      if (chart.data.labels.length > 0) {
        const fillStyles = chart.data.datasets.backgroundColor || chart.options.elements.bar.backgroundColor;
        items = chart.data.labels.map((label, index) => ({ text: label, fillStyle: fillStyles[index] }));

        items.forEach(item => {
          const li = document.createElement('li');
          li.style.alignItems = 'center';
          li.style.cursor = 'pointer';
          li.style.display = 'flex';
          li.style.flexDirection = 'row';
          // if (items.length - 1 !== index) {
          //   li.style.marginRight = '25px';
          // }

          // li.onclick = () => {
          //   if (chart.isDatasetVisible(item.datasetIndex)) {
          //     chart.hide(item.datasetIndex);
          //     item.hidden = true;
          //   } else {
          //     chart.show(item.datasetIndex);
          //     item.hidden = false;
          //   }
          // };

          // Color box
          const legendIcon = document.createElement('span');
          legendIcon.style.background = item.fillStyle;
          legendIcon.style.borderColor = 'rgba(0,0,0,0.1)';
          legendIcon.style.borderWidth = '3px';
          legendIcon.style.display = 'inline-block';
          legendIcon.style.height = '13px';
          legendIcon.style.marginRight = '7px';
          legendIcon.style.width = '40px';
          legendIcon.style.borderRadius = '1px';
          legendIcon.style.height = '13px';

          // Text
          const textContainer = document.createElement('p');
          textContainer.style.fontFamily = 'Malgun Gothic, 맑은 고딕, AppleSDGothicNeo-Light, sans-serif';
          textContainer.style.fontSize = '14px';
          textContainer.style.color = item.fontColor;
          textContainer.style.margin = 0;
          textContainer.style.padding = 0;
          if (item.hidden) {
            textContainer.style.textDecoration = 'line-through solid #838383 2px';
          }

          const text = document.createTextNode(item.text);
          textContainer.appendChild(text);

          li.appendChild(legendIcon);
          li.appendChild(textContainer);
          ul.appendChild(li);
        });
      }
    }
  }
};


const containerID = 'compare-job-change-legend-container';
const scales = {
  x: {
    ticks: {
      padding: 15,
      font: { size: 13 },
      display: false
    },
    grid: {
      drawOnChartArea: false,
      drawTicks: false,
      drawBorder: false
    }
  },
  minutesYAxis: {
    display: false,
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
  }
};

function JobChange(props) {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        type: 'bar',
        label: transLangKey('TIMES'),
        yAxisID: 'numberYAxis'
      }
    ]
  });
  const [chartType, setChartType] = useState('number');
  useEffect(() => {
    const chart = chartRef.current;
    setChartOptions(chart);
    setChartCustomTooltip(chart);
    let options = chart.options;
    options.interaction = { intersect: false, mode: 'index' };
    options.layout.padding.right = 40;
    options.layout.padding.top = 50;
    options.layout.padding.bottom = 10;
    options.plugins.jcCustomLegend = { containerID };
    options.plugins.customTitle = {
      y: {
        left: {
          display: true,
          text: `(${transLangKey('TIMES')})`,
          offsetX: 50
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
      setChartDataAndLabel(props.data);
    }
  }, [props.data]);
  useEffect(() => {
    if (props.data) {
      setChartDataAndLabel(props.data);
    }
    chartRef.current.options.plugins.customTitle.y.left.text = (chartType === 'number') ? `(${transLangKey('TIMES')})` : `(${transLangKey('TIME')}: ${transLangKey('FP_MINUTES')})`;
    chartRef.current.update();
  }, [chartType]);
  useChartHighlight(props.version, chartRef.current);
  function handleDoubleClick(e) {
    props.onDblClick(chartRef.current, e, 'resourcegantt');
  }
  function setChartDataAndLabel(data) {
    const labels = data.labels;
    let datasets = [{
      type: 'bar',
      label: transLangKey('TIMES'),
      yAxisID: 'numberYAxis'
    }];
    const chart = chartRef.current;
    if (chartType === 'number') {
      datasets[0].data = data.jcCntSumData;
      chart.options.scales.numberYAxis.display = true;
      chart.options.scales.minutesYAxis.display = false;
      chart.options.plugins.customTitle.y.left.text = `(${transLangKey('TIMES')})`;
    } else {
      datasets[0].data = data.jcTmSumData;
      datasets[0].label = transLangKey('TIME');
      datasets[0].yAxisID = 'minutesYAxis';
      chart.options.scales.numberYAxis.display = false;
      chart.options.scales.minutesYAxis.display = true;
      chart.options.plugins.customTitle.y.left.text = `(${transLangKey('TIME')}: ${transLangKey('FP_MINUTES')})`;
    }
    setChartData({ labels, datasets });
    setTimeout(() => chart.update(), 200);
    chart.update();
  }
  function handleChange(event, newChartType) {
    if (newChartType !== null) {
      setChartType(newChartType);
    }
  }

  const ChartTypeToggleButton = (
    <ToggleButtonGroup color="primary" exclusive value={chartType} onChange={handleChange}
                       sx={{ '& .MuiToggleButton-root': { padding: '4px 12px', color: 'rgba(0, 0, 0, 0.75)', borderColor: 'rgba(0, 0, 0, 0.35)' }, '& .Mui-selected': { fontWeight: 'bold', borderColor: '#71a9e2 !important' } }}>
      <ToggleButton value="number">{transLangKey('TIMES')}</ToggleButton>
      <ToggleButton value="minutes">{transLangKey('FP_TIME_MINUTES')}</ToggleButton>
    </ToggleButtonGroup>
  );

  return (
    <Details title="FP_JOB_CHANGE" headerAction={ChartTypeToggleButton}>
      <Box sx={{ height: '99%' }}>
        <Box sx={{ height: "calc(100% - 66px)" }}>
          <Bar ref={chartRef} data={chartData} plugins={[JobChangeChartLegendPlugin, ChartDataLabelPlugin, ChartAxisTitlePlugin]} onDoubleClick={(e) => handleDoubleClick(e)} />
        </Box>
        <Box>
          <Box id={containerID}></Box>
        </Box>
      </Box>
    </Details>
  );
}

export default JobChange;
