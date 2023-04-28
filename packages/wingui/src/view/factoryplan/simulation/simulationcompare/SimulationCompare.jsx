import React, {useCallback, useEffect, useState} from "react";
import { ContentInner, InputField, ResultArea, SearchArea, SearchRow, useViewStore, zAxios } from "@zionex/wingui-core/src/common/imports";
import { showMessage, transLangKey } from "@wingui";
import { useForm } from "react-hook-form";
import VersionGroupInputField from "./VersionGroupInputField";
import {
  Box, Grid, IconButton, ListItem, ListItemIcon,
  ListItemText, ListItemSecondaryAction, Tooltip
} from "@mui/material";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import GavelIcon from '@mui/icons-material/Gavel';
import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import OnTimeRate from "./details/OnTimeRate";
import ResourceUtilization from "./details/ResourceUtilization";
import LeadTime from "./details/LeadTime";
import JobChange from "./details/JobChange";
import { highlightChartByLabel, resetChartHighlighting } from "@wingui/view/factoryplan/common/common";
import "@wingui/view/factoryplan/common/common.css";
import { useHistory } from "react-router-dom";

const GridItem = ({ children }) => (
  <Grid item xs={12} lg={6}>
    {children}
  </Grid>
);

export function useChartHighlight(selectLabel, chart, title) {
  useEffect(() => {
    if (chart) {
      if (selectLabel) {
        highlightChartByLabel(selectLabel, chart);
      } else {
        resetChartHighlighting(chart, title);
      }
    }
  }, [selectLabel]);
}

let flatVersions = [];
function SimulationCompare() {
  const history = useHistory();
  const [compareVersions, setCompareVersions] = useState([]);
  const [setViewInfo] = useViewStore(state => [state.setViewInfo]);
  const [versionOptions, setVersionOptions] = useState({});
  const [selectedVersion, setSelectedVersion] = useState(null);
  const [data, setData] = useState({
    'onTimeRate': null, 'leadTime': null, 'resourceUtilization': null, 'jobChange': null
  });
  const { control, getValues, setValue, watch } = useForm({
    defaultValues: {
      planningDate: new Date(),
      versionCd: []
    }
  });
  const globalButtons = [
    {
      name: "search",
      action: () => { loadData() },
      visible: true,
      disable: false
    }
  ];
  
  const drillDownTo = useCallback((chart, e, location) => {
    const { intersect, mode } = chart.options.interaction;
    const element = chart.getElementsAtEventForMode(e, mode, { intersect }, false);
    if (element && element.length > 0) {
      const versionCd = chart.data.labels[element[0].index];
      const targetVersion = compareVersions.find(version => version.versionCd === versionCd);
      const state = {
        planningDate: new Date(targetVersion.planDt),
        versionCd,
        plantCd: targetVersion.plants.map(plant => plant.plantCd)
      }
      history.push({ pathname: `/factoryplan/analysis/${location}`, state});
    }
  }, [compareVersions]);

  useEffect(() => {
    setViewInfo(vom.active, 'globalButtons', globalButtons);
  }, []);

  useEffect(() => {
    getVersionList(true);
  }, [watch('planningDate')]);

  function loadData() {
    const params = {
      'version-cds': encodeURI(getValues('versionCd')),
    };
    const camelToKebab = (str) => str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, (m, ofs) => (ofs ? '-' : '') + m.toLowerCase());
    Object.keys(data)
      .forEach(key => {
        zAxios.get(baseURI() + `factoryplan/simulation-compare/${camelToKebab(key)}`, { params })
          .then(function (response) {
            setData(prev => ({...prev, [key]: response.data}));
          })
          .catch(function (err) {
            console.log(err);
          })
          .then(function () {
            setConfirmVersionList();
            setSelectedVersion(null);
          });
      });
  }

  function setConfirmVersionList() {
    const compareVersions = flatVersions
      .filter(version => getValues('versionCd').includes(version.versionCd));
    compareVersions.sort((a, b) => {
      if (a.versionCd < b.versionCd) return 1;
      if (a.versionCd > b.versionCd) return -1;
      return 0;
    });
    setCompareVersions(compareVersions);
  }

  function getVersionList(initializing) {
    zAxios.get(baseURI() + 'factoryplan/simulation-compare/versions', {
      params: {
        'planning-date': getValues('planningDate').format('yyyy-MM-dd').replaceAll('-', '')
      },
      waitOn: false
    }).then(function (res) {
      flatVersions = Object.values(res.data).flat();
      if (initializing) {
        setVersionOptions(res.data);
        setValue('versionCd', []);
      } else {
        setConfirmVersionList();
      }
    }).catch(function (err) {
      console.log(err);
    }).then(function () {
    });
  }

  function confirmSimulationVersion(versionCd) {
    showMessage(transLangKey('CONFIRM'), transLangKey('FP_MSG_SIMULATION_CONFIRM'), function (answer) {
      if (answer) {
        let message
        let formData = new FormData();
        formData.append('changes', JSON.stringify(versionCd));
        zAxios({
          method: 'post',
          url: baseURI() + 'factoryplan/simulation-compare/confirm',
          headers: { 'content-type': 'application/json' },
          data: formData
        }).then(function (response) {
          getVersionList();
          message = response.data.message;
        }).catch(function (err) {
          console.log(err);
        }).then(function () {
          showMessage(transLangKey('MSG_CONFIRM'), message, { close: false });
        });
      }
    });
  }
  
  return (
    <ContentInner>
      <SearchArea>
        <SearchRow>
          <InputField control={control} type="datetime" dateformat="yyyy-MM-dd" name="planningDate" label={transLangKey("FP_LABEL_PLANNING_DATE")} />
          <VersionGroupInputField control={control} getValues={getValues} data={versionOptions} label={transLangKey('SIMULATION_VERSION')} />
        </SearchRow>
      </SearchArea>
      <ResultArea>
        <Box sx={{ display: 'flex', gap: '1.5rem', height: 1 }}>
          <Paper sx={{ height: 'fit-content', boxShadow: 'rgb(90 114 123 / 11%) 0px 7px 30px 0px, rgb(0 0 0 / 5%) 0px 1px 3px -1px', width: '296px', minHeight: '250px', mt: 13 }}>
            <List sx={{ width: '100%', padding: '15px 0' }}>
              {
                compareVersions.map(version =>
                  (
                    <ListItem sx={{ paddingLeft: '24px' }} key={version.versionCd}>
                      <ListItemIcon sx={{ minWidth: '50px' }}>
                        {version.confirmYn && <DoneOutlineIcon color="primary" />}
                      </ListItemIcon>
                      <Tooltip title={version.descripText ? version.descripText : ''} arrow>
                        <ListItemText primary={version.versionCd} secondary={version.descripText ? `(${version.descripText})` : ''}
                                      sx={{ whiteSpace: 'nowrap', marginRight: '1rem', '&:hover': { cursor: 'pointer' }, '& .MuiListItemText-secondary': { overflow: 'hidden', textOverflow: 'ellipsis', fontSize: '12px', color: 'rgb(0 0 0 / 52%)' } }}
                                      onClick={() => setSelectedVersion(version.versionCd)} />
                      </Tooltip>
                      <ListItemSecondaryAction sx={{ right: '18px' }} onClick={() => confirmSimulationVersion(version.versionCd)}>
                        <IconButton aria-label="comment" title={transLangKey('CONFIRM')} >
                          <GavelIcon htmlColor="black" />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  )
                )
              }
            </List>
          </Paper>
          <Box sx={{ width: 1 }}>
            <Grid container spacing={13} sx={{ height: 1, marginTop: 0 }}>
              <GridItem>
                <OnTimeRate data={data.onTimeRate} version={selectedVersion} onDblClick={drillDownTo} />
              </GridItem>
              <GridItem>
                <ResourceUtilization data={data.resourceUtilization} version={selectedVersion} onDblClick={drillDownTo} />
              </GridItem>
              <GridItem>
                <LeadTime data={data.leadTime} version={selectedVersion} onDblClick={drillDownTo} />
              </GridItem>
              <GridItem>
                <JobChange data={data.jobChange} version={selectedVersion} onDblClick={drillDownTo} />
              </GridItem>
            </Grid>
          </Box>
        </Box>
      </ResultArea>
    </ContentInner>
  );
}

export default SimulationCompare;
