import React from "react";
import { ContentInner, ResultArea } from "@zionex/wingui-core/src/common/imports";
import { Grid } from "@mui/material";
import { SimulationContextProvider } from "./SimulationContext";
import VersionCreation from "./details/VersionCreation";
import SimulationDetails from "./details/SimulationDetails";
import SimulationHistory from "./details/SimulationHistory";
import "./simulation.css";

function Simulation() {  
  return (
    <SimulationContextProvider>
      <ContentInner id="fp-simulation">
        <ResultArea>
          <Grid container spacing={13} sx={{ height: 1, marginTop: 0 }}>
            <Grid item xs={4.2} sx={{ height: 2/5, minHeight: '362px' }}>
              <VersionCreation />
            </Grid>
            <Grid item xs={7.8} sx={{ height: 2/5, minHeight: '362px' }}>
              <SimulationDetails />
            </Grid>
            <Grid item xs={12} sx={{ height: 3/5, maxHeight: 'calc(100% - 362px)' }}>
              <SimulationHistory />
            </Grid>
          </Grid>
        </ResultArea>
      </ContentInner>
    </SimulationContextProvider>
  )
}

export default Simulation;
