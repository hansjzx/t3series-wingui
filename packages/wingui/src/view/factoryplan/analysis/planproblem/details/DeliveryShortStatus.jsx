import React, { useEffect, useState } from "react";
import { transLangKey } from "@wingui";
import { Doughnut } from 'react-chartjs-2';
import { Box, List, ListItem, Divider, ListItemText, ListItemIcon } from '@mui/material';
import { useContentStore } from "@zionex/wingui-core/src/store/contentStore";
import Details from "@wingui/view/factoryplan/common/component/DetailCard";

const backgroundColor = [
  "#7A0103",
  "#8E0103",
  "#A50104",
  "#B81702",
  "#EC3F13",
  "#FA5E1F",
  "#FF7E33",
  "#FF931F",
  "#FFAD33",
  "#FFB950"
]

let chartData = {
  labels: [],
  datasets: [{
    label: 'DeliveryShortStatus',
    data: [],
    backgroundColor: backgroundColor,
    borderWidth: 1,
  }]
}

function DeliveryShortStatus(props) {
  const activeViewId = useContentStore(state => state.activeViewId)
  const [detailTable, setDetailTable] = useState([]);
  useEffect(() => {
    chartData.labels = Object.keys(props.data).map(k => transLangKey(k));
    chartData.datasets[0].data = Object.values(props.data);

    let li = [];
    chartData.labels.forEach((key, idx) => {
      li.push(
        <>
          <ListItem key={`list-item-${key}`} alignItems="flex-start">
            <ListItemIcon sx={{ minWidth: 'inherit', mr: '10px' }}>
              <Icon.Square size="18" fill={chartData.datasets[0].backgroundColor[idx]} stroke={chartData.datasets[0].backgroundColor[idx]}></Icon.Square>
            </ListItemIcon>
            <ListItemText sx={{ display: 'flex', justifyContent: 'space-between' }} primary={transLangKey(key)} secondary={chartData.datasets[0].data[idx]} />
          </ListItem>
          <Divider key={`list-divider-${key}`} />
        </>
      )
    })
    setDetailTable(li)
  }, [props.data])
  return (
    <Details title={`${transLangKey("FP_DELIVERY_SHORT_STATUS")} (${transLangKey("FP_OCCURANCE_CNT")})`} style={{ display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ height: 2/5, p: '1.5rem !important' }}>
        {chartData.labels.length > 0 ? <Doughnut id={activeViewId + "-shortChart"} data={chartData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, cutoutPercentage: 70 }} /> : null}
      </Box>
      <Box sx={{ height: 3/5 }}>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {detailTable}
        </List>
      </Box>
    </Details>
  );
}

export default DeliveryShortStatus;
