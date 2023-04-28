import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

import { Line } from 'react-chartjs-2'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
)

let defChart = {
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    }
  },
  data: {
    labels: [],
    datasets: [
      {
        type: 'line',
        label: '',
        borderColor: 'rgb(237, 112, 45)',
        borderWidth: 2,
        stepped : 'before',
        data: []
      }
    ],
  }
};

function ToolSupplyTabChart(props) {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        type: 'line',
        label: '',
        borderColor: 'rgb(237, 112, 45)',
        borderWidth: 2,
        stepped : 'before',
        data: []
      }
    ],
  });

  useEffect(() => {
    setDataSource(props.dataSource);
  }, [props.dataSource]);

  function setDataSource(jsonRows) {
    if (props.dataSource === undefined || jsonRows.length <= 0) {
      setChartData({
          labels: [],
          datasets: [
            {
              type: 'line',
              label: '',
              borderColor: 'rgb(237, 112, 45)',
              borderWidth: 2,
              stepped: 'before',
              data: []
            }
          ]
        }
      );
    } else {
      let labelsX = [''];
      labelsX.push(...(jsonRows.map(row => row.supplyTs)));
      labelsX.push('');

      let dataX = [jsonRows[0].toolCnt];
      dataX.push(...(jsonRows.map(element => element.totalCnt)));
      dataX.push(jsonRows[jsonRows.length - 1].totalCnt);


      setChartData({
            labels: labelsX,
            datasets: [
              {
                type: 'line',
                label: '',
                borderColor: 'rgb(237, 112, 45)',
                borderWidth: 2,
                stepped: 'before',
                data: dataX
              }
            ],
          }
      );
    }
  }

  return (
    <div style={{ height: 'calc(100% - 15px)', width: '100%'}}>
      <Line data={chartData} options={defChart.options} />
    </div>
  )
}

export default ToolSupplyTabChart;
