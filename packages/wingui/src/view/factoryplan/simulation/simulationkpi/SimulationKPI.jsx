import React, { useEffect, useRef, useState, useCallback } from "react";
import { Grid } from "@mui/material";
import { ContentInner, SearchArea, SearchRow, ResultArea, useViewStore, zAxios } from "@zionex/wingui-core/src/common/imports";
import ResourceUtilization from "./details/ResourceUtilization";
import LeadTime from "./details/LeadTime";
import OnTimeRate from "./details/OnTimeRate";
import JobChange from "./details/JobChange";
import VersionPlantSearchCondition from "@wingui/view/factoryplan/common/component/VersionPlantSearchCondition";
import Details from "@wingui/view/factoryplan/common/component/DetailCard";
import "@wingui/view/factoryplan/common/common.css";
import { useHistory } from "react-router-dom";
import { onErrorInput } from "@zionex/wingui-core/src/utils/common";

const GridItem = ({ firstHeight, first, second }) => {
  return (
    <Grid item xs={6} sx={{ height: 1, paddingTop: "0px !important" }}>
      <Grid container spacing={13} sx={{ height: 1, marginTop: 0 }}>
        <Grid item xs={12} sx={{ height: firstHeight / 4 }}>
          {first}
        </Grid>
        <Grid item xs={12} sx={{ height: (4 - firstHeight) / 4 }}>
          {second}
        </Grid>
      </Grid>
    </Grid>
  );
};

function SimulationKPI() {
  const versionPlantRef = useRef();
  const history = useHistory();
  const [searchCondition, setSearchCondition] = useState({});
  const [setViewInfo] = useViewStore(state => [state.setViewInfo]);
  const [data, setData] = useState({
    'onTimeRate': 0, 'leadTime': null, 'resourceUtilization': null, 'jobChange': null
  });
  const globalButtons = [
    {
      name: "search",
      action: () => versionPlantRef.current.handleSubmit(loadData, onErrorInput),
      visible: true,
      disable: false
    }
  ];
  const drillDownTo = useCallback((chart, e, location, value) => {
    const state = (value) ? { ... searchCondition, ...value } : searchCondition;
    if (chart && e) {
      const { intersect, mode } = chart.options.interaction;
      const element = chart.getElementsAtEventForMode(e, mode, { intersect }, false);
      if (element && element.length > 0) {
        history.push({ pathname: `/factoryplan/analysis/${location}`, state});
      }
    } else {
      history.push({ pathname: `/factoryplan/analysis/${location}`, state});
    }    
  }, [searchCondition]);
  
  const OnTimeRateDetails = <Details title="FP_ONTIME_PLAN_RATE"><OnTimeRate data={data.onTimeRate} onDblClick={drillDownTo} /></Details>;
  const LeadTimeDetails = <Details title="FP_PRDT_LEAD_TIME"><LeadTime data={data.leadTime} onDblClick={drillDownTo} /></Details>;
  const ResrcUtilDetails = <Details title="UI_FP_RESRC_UTILIZATION"><ResourceUtilization data={data.resourceUtilization} onDblClick={drillDownTo} /></Details>;
  const JobChangeDetails = <Details title="FP_JOB_CHANGE"><JobChange data={data.jobChange} onDblClick={drillDownTo} /></Details>;
  
  useEffect(() => {
    setViewInfo(vom.active, 'globalButtons', globalButtons);
  }, []);
  
  function loadData() {
    const { versionCd, plantCd } = versionPlantRef.current.getValues();
    const params = {
      'version-cd': versionCd,
      'plant-cds': encodeURI(plantCd)
    };
    const camelToKebab = (str) => str.replace(/[A-Z]+(?![a-z])|[A-Z]/g, (m, ofs) => (ofs ? '-' : '') + m.toLowerCase());    
    Object.keys(data)
      .forEach(key => {
        zAxios.get(baseURI() + `factoryplan/simulation-kpi/${camelToKebab(key)}`, { params })
          .then(function (response) {
            setData(prev => ({...prev, [key]: response.data}));
          })
          .catch(function (err) {
            console.log(err);
          })
          .then(function () {
          });
      });
  }
  
  function handleChange(value) {
    setSearchCondition(prev => ({...prev, ...value}));
  }
  
  return (
    <ContentInner>
      <SearchArea>
        <SearchRow>
          <VersionPlantSearchCondition ref={versionPlantRef} onChange={handleChange} initialized={loadData} />
        </SearchRow>
      </SearchArea>
      <ResultArea>
        <Grid container spacing={13} sx={{ height: 1, marginTop: 0 }}>
          <GridItem firstHeight={1} first={OnTimeRateDetails} second={LeadTimeDetails} />
          <GridItem firstHeight={2} first={ResrcUtilDetails} second={JobChangeDetails} />
        </Grid>
      </ResultArea>
    </ContentInner>
  );
}

export default SimulationKPI;
