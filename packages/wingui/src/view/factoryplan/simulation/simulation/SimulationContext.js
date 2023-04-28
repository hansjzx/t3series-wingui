import React, { createContext, useContext, useState } from 'react';

const MainVersionContext = createContext(null);
const StepStatusContext = createContext(null);

export function SimulationContextProvider({ children }) {
  const [mainVersion, setMainVersion] = useState(null);
  const [stepStatus, setStepStatus] = useState(null);
  const mainVersionValue = { mainVersion, setMainVersion };
  const stepStatusValue = { stepStatus, setStepStatus };
  
  return (
    <MainVersionContext.Provider value={mainVersionValue}>
      <StepStatusContext.Provider value={stepStatusValue}>
        {children}
      </StepStatusContext.Provider>
    </MainVersionContext.Provider>
  );
}

export function useMainVersionContext() {
  return useContext(MainVersionContext);
}

export function useStepStatusContext() {
  return useContext(StepStatusContext);
}
