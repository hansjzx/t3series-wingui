import React from "react";
import Details from "@wingui/view/factoryplan/common/component/DetailCard";
import { Box, Button, List, Divider, ListItem, ListItemButton, ListItemText } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { transLangKey } from "@wingui";
import { fpCommonStyles } from "@wingui/view/factoryplan/common/common";

const ClickableListPanel = (props) => (
  <Details style={{ height: 1, padding: '0 !important' }}>
    <Box sx={{ padding: '10px' }}>
      <Button variant="outlined" sx={{ ...fpCommonStyles.roundButton, margin: '18px 0' }} startIcon={<AddIcon color="primary" />} onClick={() => props.clickButton()}>{transLangKey(props.buttonText)}</Button>
      <List>
        {
          [
            <Divider key="top-divider" />,
            props.data.map(item => (
              [
                <ListItem sx={{ padding: 0 }} key={`list-item-${item.policyCd}`}>
                  <ListItemButton sx={{ padding: 8, backgroundColor: (props.currentItem && props.currentItem.id === item.id) ? 'aliceblue': 'transparent' }} onClick={() => props.clickItem(item)}>
                    <ListItemText sx={{ '& .MuiListItemText-primary': { fontWeight: (props.currentItem && props.currentItem.id === item.id) ? 'bold' : 'inherit' }}} primary={item[props.itemTextField]} />
                  </ListItemButton>
                </ListItem>,
                <Divider key={`divider-${item.policyCd}`} />
              ]
            ))
          ]
        }
      </List>
    </Box>
  </Details>
);

export default ClickableListPanel;
