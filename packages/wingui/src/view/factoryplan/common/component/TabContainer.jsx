import React from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { convertCamelToSnake, transLangKey } from "@wingui";
import { fpCommonStyles } from "@wingui/view/factoryplan/common/common";

const TabPanel = (props) => {
  const { children, value, index, id, ...other } = props;
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      sx={{ height: 1, display: value === index ? 'block' : 'none' }}
      {...other}
    >
      {children}
    </Box>
  );
};

const setProps = (tab) => ({
  id: `tab-${tab}`,
  'aria-controls': `tabpanel-${tab}`,
  value: tab,
  label: transLangKey(`FP_${convertCamelToSnake(tab).toUpperCase()}`)
});

export const TabContainer = ({ value, children, onChange }) => {
  return (
    <>
      <Box sx={fpCommonStyles.tabLabelBox}>
        <Tabs value={value} onChange={onChange}>
          {
            children.map(c => <Tab key={c.props.id} {...setProps(c.props.id.replaceAll('Tab', ''))} />)
          }
        </Tabs>
      </Box>
      {
        children.map(c => (
          <TabPanel key={c.props.id} value={value} index={c.props.id.replaceAll('Tab', '')}>
            {c}
          </TabPanel>
        ))
      }
    </>
  );
};
