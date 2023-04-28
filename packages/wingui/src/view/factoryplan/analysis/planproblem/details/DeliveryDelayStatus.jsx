import React, { Fragment, useEffect, useState } from "react";
import { transLangKey } from "@wingui";
import { Doughnut } from 'react-chartjs-2';
import { Box, List, ListItem, Divider, ListItemText, ListItemIcon } from '@mui/material';
import { useContentStore } from "@zionex/wingui-core/src/store/contentStore";
import Details from "@wingui/view/factoryplan/common/component/DetailCard";
import "@wingui/view/factoryplan/common/common.css";

const backgroundColor = [
  "#F35B04",
  "#F18701",
  "#FD9E02",
  "#F7B801",
  "#7678ED",
  "#3D348B",
  "#023047",
  "#126782",
  "#219EBC",
  "#8ECAE6"
]

let chartData = {
  labels: [],
  datasets: [{
    label: 'DeliveryDelayStatus',
    data: [],
    backgroundColor: backgroundColor,
    borderWidth: 1,
  }]
}

function DeliveryDelayStatus(props) {
  const activeViewId = useContentStore(state => state.activeViewId)
  const [detailTable, setDetailTable] = useState([]);
  useEffect(() => {
    chartData.labels = Object.keys(props.data).map(k => transLangKey(k));
    chartData.datasets[0].data = Object.values(props.data);

    let li = [];
    chartData.labels.forEach((key, idx) => {      
      li.push(
        <Fragment key={`list-${key}`}>
          <ListItem key={`list-item-${key}`} alignItems="flex-start">
            <ListItemIcon sx={{ minWidth: 'inherit', mr: '10px' }}>
              <Icon.Square size="18" fill={chartData.datasets[0].backgroundColor[idx]} stroke={chartData.datasets[0].backgroundColor[idx]}></Icon.Square>
            </ListItemIcon>
            <ListItemText sx={{ display: 'flex', justifyContent: 'space-between' }} primary={transLangKey(key)} secondary={chartData.datasets[0].data[idx]} />
          </ListItem>
          <Divider key={`list-divider-${key}`} />
        </ Fragment>
      )
    })
    setDetailTable(li)
  }, [props.data])
  return (
    <Details title={`${transLangKey("FP_DELIVERY_DELAY_STATUS")} (${transLangKey("FP_OCCURANCE_CNT")})`} style={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ height: 2/5, p: '1.5rem !important' }}>
        {chartData.labels.length > 0 ? <Doughnut id={activeViewId + "-delayChart"} data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, cutoutPercentage: 70 }}></Doughnut> : null}
      </Box>
      <Box sx={{ height: 3/5 }}>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {detailTable}
        </List>
      </Box>
    </Details>
  );
}

export default DeliveryDelayStatus;
