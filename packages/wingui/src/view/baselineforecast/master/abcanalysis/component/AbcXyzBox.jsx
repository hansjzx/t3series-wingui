import React, { useCallback, useEffect, useState } from "react";

import { Box, Typography } from "@mui/material";

import TableChartIcon from '@mui/icons-material/TableChart';

import '../css/abcxyzbox.css';

const HIGH_VOLUMES = "HighVolumes";
const MIDDLE_VOLUMES = "middleVolumes";
const LOW_VOLUMES = "lowVolumes";
const STABLES = "stables";
const FLUCTUATING = "fluctuating";
const VERY_FLUCTUATING = "veryFluctuating";
const ABCClassConfig = {
    AX: { className: "high-stables", uncertainty: STABLES, volume: HIGH_VOLUMES, style: { backgroundColor: "#86C8BC", opacity: 0.5 } },
    AY: { className: "high-fluctuating", uncertainty: FLUCTUATING, volume: HIGH_VOLUMES, style: { backgroundColor: "#CEEDC7" } },
    AZ: { className: "high-very-fluctuating", uncertainty: VERY_FLUCTUATING, volume: HIGH_VOLUMES, style: { backgroundColor: "#FFD56F" } },
    BX: { className: "high-fluctuating", uncertainty: STABLES, volume: MIDDLE_VOLUMES, style: { backgroundColor: "#CEEDC7" } },
    BY: { className: "high-very-fluctuating", uncertainty: FLUCTUATING, volume: MIDDLE_VOLUMES, style: { backgroundColor: "#FFD56F" } },
    BZ: { className: "low-fluctuating", uncertainty: VERY_FLUCTUATING, volume: MIDDLE_VOLUMES, style: { backgroundColor: "#FFB26B" } },
    CX: { className: "high-very-fluctuating", uncertainty: STABLES, volume: LOW_VOLUMES, style: { backgroundColor: "#FFD56F" } },
    CY: { className: "low-fluctuating", uncertainty: FLUCTUATING, volume: LOW_VOLUMES, style: { backgroundColor: "#FFB26B" } },
    CZ: { className: "low-very-fluctuating", uncertainty: VERY_FLUCTUATING, volume: LOW_VOLUMES, style: { backgroundColor: "#FF7B54" } }
  }
const AbcXyzBox = (props) => {
    const chartDatas = props?.data;
    const ratioDatas = props?.ratioData;
    const yAxisName = props?.yAxisName;
    const tabValue = props?.tabValue;
    const [abcXyzData, setAbcXyzData] = useState({});
    const volumes = ["A", "B", "C"];
    const uncertainties = ["X", "Y", "Z"];
  
    const combineData = (result, data) => {
      for (const volume of volumes) {
        for (const uncertainty of uncertainties) {
          const objProp = `${volume}${uncertainty}`;
          if (result?.[objProp]) {
            result[objProp] += data[`${volume}${uncertainty}`];
          } else {
            result[objProp] = data[`${volume}${uncertainty}`];
          }
        }
      }
    }

    useEffect(() => {
      if (chartDatas && tabValue === yAxisName) {
        if(chartDatas[0] === undefined) {
          chartDatas[0] = {};
        }
  
        const result = {
          AX: 0,
          AY: 0,
          AZ: 0,
          BX: 0,
          BY: 0,
          BZ: 0,
          CX: 0,
          CY: 0,
          CZ: 0,
          TOTAL: 0,
        };
  
        for (const chartData of chartDatas) {
          combineData(result, chartData);
        }
  
        result.A = result.AX + result.AY + result.AZ;
        result.B = result.BX + result.BY + result.BZ;
        result.C = result.CX + result.CY + result.CZ;
        result.X = result.AX + result.BX + result.CX;
        result.Y = result.AY + result.BY + result.CY;
        result.Z = result.AZ + result.BZ + result.CZ;
  
        result.TOTAL = result.A + result.B + result.C;
        setAbcXyzData(result);
      }
  
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props?.data, props?.tabValue]);
  
    const chartValueFormatter = (value) => {
        // number format
        value = value.toFixed(0);
      return value;
    }
  
    const chartPercentageFormatter = (value) => {
        // number format
        value = (value * 100).toFixed(1).toString() + '%';
      return value;
    }
  
    const percentageCalc = (paramValue) => {
      const total = abcXyzData?.TOTAL ? abcXyzData.TOTAL : 0;
      const value = paramValue && total !== 0 ? paramValue / total : 0;
  
      return chartPercentageFormatter(value);
    }
  
    const AbcXyzYAxis = useCallback(() => {
      const valueA = abcXyzData?.A ? abcXyzData.A : 0;
      const valueB = abcXyzData?.B ? abcXyzData.B : 0;
      const valueC = abcXyzData?.C ? abcXyzData.C : 0;
  
      return (
        <Box sx={{ width: "100%", height: "100%", display: "inline-flex" }}>
          {/* <Box sx={{ width: "30%", minWidth: "30px", height: "100%" }}> */}
            {/* <Box className="default-wh display-if content-center" sx={{ wordBreak: "keep-all", transform: "rotate(-90deg)", fontWeight: "bold" }}>{yAxisName}</Box> */}
          {/* </Box> */}
          <Box sx={{ width: "100%", height: "100%", display: "inline-block" }}>
            <Box className="vertical-wrapper default-wh content-center">
              <Box sx={{ display: "inline-block" }}>
                <Box className="content-center" sx={{ width: "100%", height: "auto", fontSize: "1.2rem", fontWeight: "400" }}>A</Box>
                <Box className="content-center" sx={{ width: "100%", height: "auto", fontSize: "0.7rem" }}>{chartValueFormatter(valueA)}</Box>
                <Box className="content-center" sx={{ width: "100%", height: "auto", fontSize: "0.7rem" }}>{`(${percentageCalc(valueA)})`}</Box>
              </Box>
            </Box>
            <Box className="vertical-wrapper default-wh content-center">
              <Box sx={{ display: "inline-block" }}>
                <Box className="content-center" sx={{ width: "100%", height: "auto", fontSize: "1.2rem", fontWeight: "400" }}>B</Box>
                <Box className="content-center" sx={{ width: "100%", height: "auto", fontSize: "0.7rem" }}>{chartValueFormatter(valueB)}</Box>
                <Box className="content-center" sx={{ width: "100%", height: "auto", fontSize: "0.7rem" }}>{`(${percentageCalc(valueB)})`}</Box>
              </Box>
            </Box>
            <Box className="vertical-wrapper default-wh content-center">
              <Box sx={{ display: "inline-block" }}>
                <Box className="content-center" sx={{ width: "100%", height: "auto", fontSize: "1.2rem", fontWeight: "400" }}>C</Box>
                <Box className="content-center" sx={{ width: "100%", height: "auto", fontSize: "0.7rem" }}>{chartValueFormatter(valueC)}</Box>
                <Box className="content-center" sx={{ width: "100%", height: "auto", fontSize: "0.7rem" }}>{`(${percentageCalc(valueC)})`}</Box>
              </Box>
            </Box>
          </Box>
        </Box>
      )
  
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [abcXyzData, yAxisName])
  
    const AbcXyzXAxis = useCallback(() => {
      const valueX = abcXyzData?.X ? abcXyzData.X : 0;
      const valueY = abcXyzData?.Y ? abcXyzData.Y : 0;
      const valueZ = abcXyzData?.Z ? abcXyzData.Z : 0;
  
      return (
        <Box className="default-wh" sx={{ mt: 0.5 }}>
          <Box className="default-wh display-if">
            <Box sx={{ width: "10%", height: "100%" }} />
            <Box className="default-wh">
              <Box className="class-box-wrapper" sx={{ height: "100% !important" }}>
                <Box className="horizon-wrapper default-wh" sx={{ display: "inline-block"}}>
                  <Box className="content-center" sx={{width: "100%", fontSize: "1.2rem", fontWeight: "400"}}>X</Box>
                  <Box className="content-center" sx={{width: "100%", fontSize: "0.7rem"}}>{`${chartValueFormatter(valueX)} (${percentageCalc(valueX)})`}</Box>
                  {/* <Box className="content-center" sx={{width: "100%", fontSize: "0.7rem"}}>{}</Box> */}
                </Box>
                <Box className="horizon-wrapper default-wh" sx={{ display: "inline-block"}}>
                  <Box className="content-center" sx={{width: "100%", fontSize: "1.2rem", fontWeight: "400"}}>Y</Box>
                  <Box className="content-center" sx={{width: "100%", fontSize: "0.7rem"}}>{`${chartValueFormatter(valueY)} (${percentageCalc(valueY)})`}</Box>
                  {/* <Box className="content-center" sx={{width: "100%", fontSize: "0.7rem"}}>{}</Box> */}
                </Box>
                <Box className="horizon-wrapper default-wh" sx={{ display: "inline-block"}}>
                  <Box className="content-center" sx={{width: "100%", fontSize: "1.2rem", fontWeight: "400"}}>Z</Box>
                  <Box className="content-center" sx={{width: "100%", fontSize: "0.7rem"}}>{`${chartValueFormatter(valueZ)} (${percentageCalc(valueZ)})`}</Box>
                  {/* <Box className="content-center" sx={{width: "100%", fontSize: "0.7rem"}}>{}</Box> */}
                </Box>
              </Box>
            </Box>
            {/* <Box sx={{ width: "16%", minWidth: "120px", height: "100%" }} id='whoareyou' /> */}
          </Box>
          {/* <Box className="display-if content-center" sx={{ width: "100%", height: "auto" }}> */}
            {/* <Box sx={{ textAlign: "center", fontWeight: "bold" }}>uncertainty</Box> */}
          {/* </Box> */}
        </Box>
      )
  
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [abcXyzData]) 
  
    const MakeAbcXyzChartBox = ({abcXyzChartData}) => {
      const MakeBox = ({volume, uncertainty}) => {
        const chartClass = `${volume}${uncertainty}`;
        const alignClassName = "horizon-wrapper";
  
        const value = abcXyzChartData?.[chartClass];
        const ratio = ratioDatas?.[chartClass]? ratioDatas[chartClass] : 0;
        const classInfo = ABCClassConfig[chartClass];
  
        const className = classInfo?.className ? classInfo.className : "";
  
        const chartValue = value || value === 0 ? <b>{`${chartValueFormatter(value)} Items`}</b> : "";
        let chartValuePercentage = 0;
        if(value || value === 0) {
          chartValuePercentage = abcXyzChartData.TOTAL !== 0 ? Number(value / abcXyzChartData.TOTAL) : 0;
        }
        chartValuePercentage = chartPercentageFormatter(chartValuePercentage);
        const keyValue = `${chartClass}${value || value === 0 ? value : "_none"}`;
        return (
          <Box key={keyValue} className={`${alignClassName} abc-xyz-chart ${className}`}>
            <Box className="class-box-wrapper volumes-uncertainties-text" >
              <Typography component={"span"} variant={"subtitle1"}>
                {<>{chartClass}</> }
              </Typography>
            </Box>
            <Box className="class-box-wrapper value-wrapper">
              <Typography className="text-animation-fadeIn">
                {<>{chartValue} <br/> {`${transLangKey("CNT_RATIO")} :`} <b>{chartValuePercentage} </b>
                <br/> {`${transLangKey("VALUE_RATIO")} :`} <b>{chartPercentageFormatter(ratio)}</b></>}
              </Typography>
            </Box>
          </Box>
        )
      }
  
      const MakeBoxCombined = ({ volume }) => {
        const className = "vertical-wrapper";
        return (
          <Box className={className} >
            {uncertainties.map((uncertainty) => {
              return <MakeBox key={`${volume}${uncertainty}`} volume={volume} uncertainty={uncertainty} />
            })}
          </Box>
        )
      }
      
      return (
        volumes.map((volume) => {
          return <MakeBoxCombined key={volume} volume={volume} />
        })
      )
    }
  
    const BaseBox = useCallback(() => {
      return (
        <Box className="default-wh" sx={{ display: "inline-block" }}>
          <Box sx={{ display: "inline-flex", width: "100%", height: "90%" }}>
  
            {/* ABC-XYZ Chart Y axis */}
            <Box sx={{ width: "10%", height: "100%", display: "inline-flex" }}>
              <AbcXyzYAxis />
            </Box>
  
            {/* ABC-XYZ Chart Body Area */}
            <Box sx={{ width: "90%", height: "100%", display: "inline-block" }}>
              <MakeAbcXyzChartBox abcXyzChartData={abcXyzData} />
            </Box>
{/*   
            <Box sx={{ minWidth: "120px", width: "16%", height: "100%", display: "inline-flex" }} id='whoareyou' /> */}
          </Box>
  
          <Box sx={{ width: "100%", height: "10%" }}>
            {/* ABC-XYZ Chart X axis */}
            <AbcXyzXAxis />
          </Box>
        </Box>
      )
  
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [abcXyzData])
  
  
    return (
        <Box id={"abc-xyz-analysis"} sx={{ display: "flex", height: "100%", width: "100%", my: 1 }}>
            <Box sx={{ width: "100%", height: "100%", overflow: "auto" }}>
                {/* Top Area */}
                <Box className="content-center" sx={{ width: "100%", height: "5%", mb: 1 }}>
                    {/* <TableChartIcon fontSize={"medium"} sx={{ mr: 0.5 }} /> */}
                    {/* <Typography variant="h6" sx={{ textAlign: "center", fontWeight: 500 }}>ABC-XYZ Analysis</Typography> */}
                </Box>

                {/* Chart Content Area */}
                <Box sx={{ width: "100%", height: "90%" }}>
                    <BaseBox />
                </Box>

                {/* Bottom Area */}
                {/* <Box sx={{width: "100%", height: "auto", textAlign: "center"}}> <h3 style={{margin: 0}}> Uncertainties </h3> </Box> */}
            </Box>
        </Box>
    )
  }

  export default AbcXyzBox;