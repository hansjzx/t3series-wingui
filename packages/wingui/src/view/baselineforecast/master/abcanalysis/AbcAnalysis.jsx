import React, { useEffect, useState, useRef } from 'react';
import { useForm, watch } from "react-hook-form";
import { ButtonGroup, IconButton, Tabs, Tab, Box, Slider, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';

import {
  BaseGrid, useViewStore,
  ContentInner,
  ResultArea,
  SearchArea,
  CommonButton,
  ButtonArea,
  RightButtonArea,
  useUserStore,
  InputField,
  zAxios,
} from '@zionex/wingui-core/src/common/imports';
import HeatMap from './component/heatmap';
import Paging from './component/paging';
import AbcXyzBox from './component/AbcXyzBox';


const d3 = require('d3');
const ResizeObserver = window.ResizeObserver || require("resize-observer-polyfill");

// const useStyles = makeStyles(theme => ({
//   root: {
//     width: 300
//   },
//   margin: {
//     height: theme.spacing(3)
//   },
//   thumb: {
//     height: 24,
//     background: "white",
//     // opacity: 0.7,
//     border: '2px solid green',
//     "&~&": {
//       background: "white",
//       // opacity: 0.7,
//       border: '2px solid red',
//     }
//   },
//   mark: {
//     background: "black"
//   },
//   rail: {
//     height: 22,
//     background: "linear-gradient(to right, green, rgba(84, 199, 97, 0.16) 50%, rgba(239, 19, 82, 0.26) 50%, red);",
//     border: '2px solid black',
//   },
//   track: {
//     height: 22,
//     background: "#FFDEAD",
//     border: '2px solid black',
//   },
//   valueLabel: {
//     "&>*": {
//       background: "black"
//     }
//   }
// }));


let baseGridItems = [
  { name: "itemCd", dataType: "text", headerText: "ITEM_CD", visible: true, editable: false, width: 100, textAlignment: 'center' },
  { name: "accountCd", dataType: "text", headerText: "ACCOUNT_CD", visible: true, editable: false, width: 100, textAlignment: 'center' },
  { name: "grade", dataType: "text", headerText: "GRADE", visible: true, editable: false, width: 100, textAlignment: 'center' },
  { name: "cnt", dataType: "int", headerText: "CNT", visible: true, editable: false, width: 100, textAlignment: 'center' },
  { name: "cov", dataType: "float", headerText: "COV", visible: true, editable: false, width: 100, textAlignment: 'center' },
  { name: "mean", dataType: "float", headerText: "MEAN", visible: true, editable: false, width: 100, textAlignment: 'center' },
  { name: "sum", dataType: "float", headerText: "SUM", visible: true, editable: false, width: 100, textAlignment: 'center' },
  { name: "qtyRank", dataType: "float", headerText: "QTY_RANK", visible: true, editable: false, width: 100, textAlignment: 'center' },
  { name: "amtRank", dataType: "float", headerText: "AMT_RANK", visible: true, editable: false, width: 100, textAlignment: 'center' },
  { name: "fillRate", dataType: "float", headerText: "TXN_FREQ_RATE", visible: true, editable: false, width: 100, textAlignment: 'center' },
  { name: "createDttm", dataType: "datetime", headerText: "CREATE_DTTM", visible: false, editable: false, width: 100, textAlignment: 'center' },
  { name: "salesLvCd", dataType: "text", headerText: "ADMIN_YN", visible: false, editable: false, width: 80 },
  { name: "itemLvCd", dataType: "text", headerText: "ACTV_YN", visible: false, editable: false, width: 80 },
];

let sumData = { 'pct_rank_amt': [], 'pct_rank_qty': [], 'fill_rate': [] };

function AbcAnalysis() {
  // const classes = useStyles();
  const [username] = useUserStore(state => [state.username]);
  const [states, setStates] = useState({
    'dragged': false,
    'targetCol': 'pct_rank_amt',
    'selectedTarget': false,
  });

  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [grid1, setGrid1] = useState(null);
  const [option, setOption] = useState([]);

  const pageSizes = [100, 200, 500];
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pageSize, setPageSize] = useState(pageSizes[0]);
  const [height, setHeight] = useState(null);
  const [width, setWidth] = useState(null);

  const [dates, setDates] = useState({
    'startDate': new Date(new Date().setFullYear(new Date().getFullYear() - 3)).toISOString().split('T')[0],
    'endDate': new Date().toISOString().split('T')[0],
  })
  const [reloadStatus, setReloadStatus] = useState({
    'reload': true,
    'initLoad': false
  })

  const { reset, control, getValues, setValue, watch } = useForm({
    defaultValues: {
      // dateRange: [(new Date((new Date()).setMonth((new Date()).getMonth() - 1))), (new Date())],
      applyDttmF: (new Date(new Date().setFullYear(new Date().getFullYear() - 3)).toISOString().split('T')[0]),
      applyDttmT: (new Date().toISOString().split('T')[0]),
      covValue: [0.0, 4.0],
      gradeA: 80,
      gradeB: 20,
      gradeX: 1.0,
      gradeY: 2.5,
      tabValue: 'heatMapAmt',
      target: [],
    }
  });
  const [tabValue, setTabValue] = useState(getValues('tabValue'));
  const [abcXyzCnt, setAbcXyzCnt] = useState([]);
  const [abcXyzRatio, setAbcXyzRatio] = useState({});
  const [covValue, setCovValue] = useState(getValues('covValue'));
  const [gradeA, setGradeA] = useState(getValues('gradeA'));
  const [gradeB, setGradeB] = useState(getValues('gradeB'));
  const [gradeC, setGradeC] = useState(0);
  const [gradeX, setGradeX] = useState(getValues('gradeX'));
  const [gradeY, setGradeY] = useState(getValues('gradeY'));
  const [gradeZ, setGradeZ] = useState(4.0)
  const [targets, setTargets] = useState(getValues('target'));

  const observer = new ResizeObserver(function (entries) {
    // const newWidth = window.innerWidth / 2.5;
    // setWidth(newWidth);
    for (let entry of entries) {
      let newWidth = entry.contentRect.width;
      let newHeight = entry.contentRect.height;
      // const { blockSize: height, blockSize: width } = entry.contentBoxSize[0];
      if (newHeight > 100) {
        setHeight(newHeight * 0.95);
        setWidth(newWidth);
      }
    }
  });

  const globalButtons = [
    {
      name: "search",
      action: (e) => {
        onSubmit();
      },
      visible: false,
      disable: false,
    },
    {
      name: "save",
      action: (e) => {
        // saveData();
        saveAbcXyz();
      },
      visible: true,
      disable: false,
    },
    {
      name: "refresh",
      action: (e) => {
        refresh();
      },
      visible: true,
      disable: false,
    },
  ];

  useEffect(() => {
    // resize heatmap
    const element = document.getElementById("upper-result");
    observer.observe(element);

    let targetCols = ['pct_rank_amt', 'pct_rank_qty', 'fill_rate'];
    targetCols.forEach(targetCol => {
      zAxios({
        method: 'post',
        headers: { 'content-type': 'application/json' },
        url: baseURI() + 'engine/bf/DoHeatMapLoad',
        params: {
          'startDate': dates.startDate,
          'endDate': dates.endDate,
          'col': targetCol,
          'value': 'sum',
          'cov_min': covValue[0],
          'cov_max': covValue[1] + 0.1,
          'timeout': 0
        }
      })
        .then(res => {
          sumData[targetCol] = res.data.RESULT_DATA;
        })
    })

    zAxios({
      method: 'get',
      url: baseURI() + 'baselineforecast/master/getAbcXyzThld',
      params: {}
    })
      .then(res => {
        let go = true;
        if (res?.data) {
          const resultObj = res.data;
          for (const check in resultObj) {
            if (!resultObj[check]) {
              go = false;
            }
          }
          if (go) {
            setGradeA(parseInt(resultObj.gradeA));
            setGradeB(parseInt(resultObj.gradeB));
            setGradeX(parseFloat(resultObj.gradeX));
            setGradeY(parseFloat(resultObj.gradeY));
            setValue('gradeA', parseInt(resultObj.gradeA));
            setValue('gradeB', parseInt(resultObj.gradeB));
            setValue('gradeX', parseFloat(resultObj.gradeX));
            setValue('gradeY', parseFloat(resultObj.gradeY));
          }
        }
      })
    return () => {
      observer.unobserve(element);
    };

  }, []);

  useEffect(() => {
    if (reloadStatus.initLoad) {
      getAbcXyz();
      setReloadStatus({
        ...reloadStatus,
        initLoad: false
      })
      setValue('target', []);
    }

  }, [gradeA, gradeB, gradeX, gradeY, reloadStatus.initLoad, tabValue]);

  useEffect(() => {
    if (grid1) {
      setViewInfo(vom.active, "globalButtons", globalButtons);
      setOption();
    }
  }, [grid1]);

  useEffect(() => {
    if (dates.startDate !== getValues('applyDttmF') ||
      dates.endDate !== getValues('applyDttmT')) {
      setDates({
        ...dates,
        startDate: getValues('applyDttmF'),
        endDate: getValues('applyDttmT')
      });
    }
  }, [watch(['applyDttmF', 'applyDttmT'])]);

  useEffect(() => {
    if (getValues('target').length >= 0) {
      setTargets(getValues('target'));
    }
  }, [watch('target')]);

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, 'grid1');
    if (grdObj1) {
      if (grdObj1.dataProvider) {
        setGrid1(grdObj1)
      }
    }
  }, [viewData]);

  useEffect(() => {
    loadGrid();
  }, [currentPage]);

  useEffect(() => {
    if (states.dragged && !states.selectedTarget) {
      setCurrentPage(1);
      loadGrid();
      setValue('target', []);
    }
    else if (states.selectedTarget && !states.dragged) {
      setCurrentPage(1);
      loadGrid();
    }
  }, [states]);


  useEffect(() => {
    let newTargetCol = ''
    if (tabValue === "heatMapQty") {
      newTargetCol = 'pct_rank_qty'
    }
    else if (tabValue === "heatMapAmt") {
      newTargetCol = 'pct_rank_amt'
    }
    else {
      newTargetCol = 'fill_rate'
    }
    setStates({ ...states, dragged: false, targetCol: newTargetCol, selectedTarget: false });
  }, [tabValue]);

  function getAbcXyz() {
    const targetMap = getValues('tabValue');
    const targetCol = targetMap === "heatMapQty" ? "pct_rank_qty" : targetMap === "heatMapAmt" ? "pct_rank_amt" : "fill_rate"
    let result = {
      AX: 0,
      AY: 0,
      AZ: 0,
      BX: 0,
      BY: 0,
      BZ: 0,
      CX: 0,
      CY: 0,
      CZ: 0,
    };
    let resultRatio = {
      AX: 0,
      AY: 0,
      AZ: 0,
      BX: 0,
      BY: 0,
      BZ: 0,
      CX: 0,
      CY: 0,
      CZ: 0,
    };

    // sum
    let totalValue = 0;
    sumData[targetCol].forEach(d => {
      totalValue += d.total;
    })

    let xLabels = Object.keys(sumData[targetCol][0]).sort().slice(0, -2);
    let sumArray = Array(sumData[targetCol].length * xLabels.length);

    for (let i = 0; i < sumArray.length; i += xLabels.length) {
      for (let j = 0; j < xLabels.length; j++) {
        sumArray[i + j] = {
          pct: sumData[targetCol][parseInt(i / xLabels.length)].pct,
          cov_lbl: xLabels[j],
          sub_total: sumData[targetCol][parseInt(i / xLabels.length)][xLabels[j]]
        }
      }
    }

    // cnt
    let cntArray = Array.from(d3.selectAll('#' + targetMap).data());
    if (cntArray && cntArray.length > 0) {
      for (let i = 0; i < sumArray.length; i += 1) {
        // AX
        if (sumArray[i].pct >= Math.abs(gradeA) && parseFloat(sumArray[i].cov_lbl) < gradeX) {
          resultRatio.AX += sumArray[i].sub_total;
          result.AX += cntArray[i].sub_count;
        }
        // AY
        else if (sumArray[i].pct >= Math.abs(gradeA) && parseFloat(sumArray[i].cov_lbl) >= gradeX && parseFloat(sumArray[i].cov_lbl) < gradeY) {
          resultRatio.AY += sumArray[i].sub_total;
          result.AY += cntArray[i].sub_count;
        }
        // AZ
        else if (sumArray[i].pct >= Math.abs(gradeA) && parseFloat(sumArray[i].cov_lbl) >= gradeY && parseFloat(sumArray[i].cov_lbl) <= gradeZ) {
          resultRatio.AZ += sumArray[i].sub_total;
          result.AZ += cntArray[i].sub_count;
        }
        // BX
        else if (sumArray[i].pct < Math.abs(gradeA) && sumArray[i].pct >= Math.abs(gradeB) && parseFloat(sumArray[i].cov_lbl) < gradeX) {
          resultRatio.BX += sumArray[i].sub_total;
          result.BX += cntArray[i].sub_count;
        }
        // BY
        else if (sumArray[i].pct < Math.abs(gradeA) && sumArray[i].pct >= Math.abs(gradeB) && parseFloat(sumArray[i].cov_lbl) >= gradeX && parseFloat(sumArray[i].cov_lbl) < gradeY) {
          resultRatio.BY += sumArray[i].sub_total;
          result.BY += cntArray[i].sub_count;
        }
        // BZ
        else if (sumArray[i].pct < Math.abs(gradeA) && sumArray[i].pct >= Math.abs(gradeB) && parseFloat(sumArray[i].cov_lbl) >= gradeY && parseFloat(sumArray[i].cov_lbl) <= gradeZ) {
          resultRatio.BZ += sumArray[i].sub_total;
          result.BZ += cntArray[i].sub_count;
        }
        // CX
        else if (sumArray[i].pct < Math.abs(gradeB) && sumArray[i].pct >= gradeC && parseFloat(sumArray[i].cov_lbl) < gradeX) {
          resultRatio.CX += sumArray[i].sub_total;
          result.CX += cntArray[i].sub_count;
        }
        // CY
        else if (sumArray[i].pct < Math.abs(gradeB) && sumArray[i].pct >= gradeC && parseFloat(sumArray[i].cov_lbl) >= gradeX && parseFloat(sumArray[i].cov_lbl) < gradeY) {
          resultRatio.CY += sumArray[i].sub_total;
          result.CY += cntArray[i].sub_count;
        }
        // CZ
        else {
          resultRatio.CZ += sumArray[i].sub_total;
          result.CZ += cntArray[i].sub_count;
        }
      }

      resultRatio.AX = (resultRatio.AX / totalValue).toFixed(2);
      resultRatio.BX = (resultRatio.BX / totalValue).toFixed(2);
      resultRatio.CX = (resultRatio.CX / totalValue).toFixed(2);
      resultRatio.AY = (resultRatio.AY / totalValue).toFixed(2);
      resultRatio.BY = (resultRatio.BY / totalValue).toFixed(2);
      resultRatio.CY = (resultRatio.CY / totalValue).toFixed(2);
      resultRatio.AZ = (resultRatio.AZ / totalValue).toFixed(2);
      resultRatio.BZ = (resultRatio.BZ / totalValue).toFixed(2);
      resultRatio.CZ = (resultRatio.CZ / totalValue).toFixed(2);
    }

    setAbcXyzCnt([result]);
    setAbcXyzRatio(resultRatio);
  }

  function refresh() {
    reset();
    grid1.dataProvider.clearRows();
    reloadData();
  }

  function reloadData() {
    zAxios({
      method: 'post',
      headers: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/bf/DoHeatMapReload',
      params: { 'timeout': 0 }
    })
      .then(() => {
        let today = new Date()
        let start = new Date(today.getFullYear() - 3, today.getMonth(), today.getDate());
        let end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        let startDate = start.toISOString().split('T')[0];
        let endDate = end.toISOString().split('T')[0];

        setDates({
          startDate: startDate,
          endDate: endDate,
        });
        setReloadStatus({
          ...reloadStatus,
          reload: true
        })
      })
      .catch(error => {
        console.log(error);
      })
  }

  function saveAbcXyz() {
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let formData = new FormData();
        formData.append("userName", username);
        formData.append("gradeA", Math.abs(getValues('gradeA')));
        formData.append("gradeB", Math.abs(getValues('gradeB')));
        formData.append("gradeX", getValues('gradeX'));
        formData.append("gradeY", getValues('gradeY'));
        zAxios({
          method: 'post',
          url: baseURI() + 'engine/bf/DoSaveAbcXyz',
          data: formData
        })
          .then(() => {
            showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_0001')); // 저장되었습니다.
          })
          .catch(err => {
            showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_0004')); // 실패하였습니다.
            console.log(err);
          })
      }
    }
    )
  }

  function saveData() {
    grid1.gridView.commit(true);
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        grid1.gridView.showToast(progressSpinner + 'Saving data...', true);
        zAxios({
          method: 'get',
          url: baseURI() + 'engine/bf/DoHeatMapGetTarget',
          params: {
            'method': 'GET',
            'col': tabValue === "heatMapQty" ? 'pct_rank_qty' : tabValue === "heatMapAmt" ? 'pct_rank_amt' : 'fill_rate',
            'timeout': 0
          }
        })
          .then(res => {
            let formData = new FormData();
            formData.append("changes", JSON.stringify(res.data.RESULT_DATA.ITC1_DATA));

            zAxios({
              method: 'post',
              headers: { 'content-type': 'application/json' },
              url: baseURI() + 'baselineforecast/master/abcAnalysis',
              data: formData
            })
              .then(() => {
                grid1.gridView.hideToast();
                showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_0001'));
              })
              .catch(err => {
                console.log(err);
              })
          })
          .catch(err => {
            console.log(err);
          })
      }
    });
  }

  function onSubmit() {
    getAbcXyz();
    setCurrentPage(1);
    d3.selectAll('#selected').remove()
    setReloadStatus({
      ...reloadStatus,
      reload: true
    })
  }

  function loadGrid() {
    if (baseURI() !== null) {
      zAxios({
        method: 'post',
        url: baseURI() + 'engine/bf/DoHeatMapGetTarget',
        params: {
          'method': 'POST',
          'currentPage': currentPage,
          'pageSize': pageSize,
          'col': tabValue === "heatMapQty" ? 'pct_rank_qty' : tabValue === "heatMapAmt" ? 'pct_rank_amt' : 'fill_rate',
          'timeout': 0
        }
      })
        .then(res => {
          if (res.data.RESULT_SUCCESS) {
            const pageCnt = Math.ceil(res.data.RESULT_DATA.IM_DATA.cnt / pageSize)
            setTotalPages(pageCnt);
            if (grid1) {
              grid1.dataProvider.fillJsonData(res.data.RESULT_DATA.ITC1_DATA);
            }
          }
          setStates({ ...states, dragged: false, selectedTarget: false });
        })
        .catch(err => {
          console.log(err);
        })
    }
  }

  function selectHandler(v) {
    setStates({
      ...states,
      dragged: v?.dragged,
      targetCol: v?.tagetCol,
      selectedTarget: v?.selectedTarget
    });
  }

  const tabChange = async (event, newValue) => {
    setTabValue(newValue);
    setValue('tabValue', newValue);
  };

  const covValueChange = (event, newValue) => {
    setCovValue(newValue);
    setValue('covValue', newValue);
  };

  const gradeAbcChange = (event, newValue) => {
    let newValueB = Math.min(newValue[0], gradeA - 5);
    let newValueA = Math.max(newValue[1], gradeB + 5);
    newValueA = newValueA > 95 ? 95 : newValueA;
    newValueB = newValueB < 5 ? 5 : newValueB;
    setGradeA(newValueA);
    setGradeB(newValueB);
    setValue('gradeA', newValueA);
    setValue('gradeB', newValueB);
  };

  const gradeXyzChange = (event, newValue) => {
    let newValueX = parseFloat(Math.min(newValue[0], gradeY - 0.1).toFixed(1));
    let newValueY = parseFloat(Math.max(newValue[1], gradeX + 0.1).toFixed(1));
    newValueX = newValueX < 0.1 ? 0.1 : newValueX;
    newValueY = newValueY > 3.9 ? 3.9 : newValueY;
    setGradeX(newValueX);
    setGradeY(newValueY);
    setValue('gradeX', newValueX);
    setValue('gradeY', newValueY);
  };


  return (
    <>
      <ContentInner>
        <SearchArea displaySize="small">
          {/* <SearchRow> */}
          <InputField style={{ display: 'flex' }} type={"datetime"} name="applyDttmF" label={transLangKey("FROM_DATE")} control={control} dateformat="yyyy-MM-dd" />
          <InputField style={{ display: 'flex' }} type={"datetime"} name="applyDttmT" label={transLangKey("TO_DATE")} control={control} dateformat="yyyy-MM-dd" />
          <InputField style={{ display: 'flex' }} name="target" label={transLangKey("target")} width='none' height='none'
            control={control} type="check"
            options={[{ label: 'AX', value: 'AX', },
            { label: 'BX', value: 'BX', },
            { label: 'CX', value: 'CX', },
            { label: 'AY', value: 'AY', },
            { label: 'BY', value: 'BY', },
            { label: 'CY', value: 'CY', },
            { label: 'AZ', value: 'AZ', },
            { label: 'BZ', value: 'BZ', },
            { label: 'CZ', value: 'CZ', },
            ]}
          />
        </SearchArea>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={tabChange}
            indicatorColor="primary">
            <Tab label={transLangKey('AMT')} value="heatMapAmt" />
            <Tab label={transLangKey('QTY')} value="heatMapQty" />
            <Tab label={transLangKey('TXN_FREQ')} value="heatMapFillRate" />
          </Tabs>
        </Box>
        <ResultArea sizes={[60, 40]}>
          <Box style={{ position: "relative" }}>
            <Box style={{ height: "100%", display: tabValue === "heatMapAmt" ? "flex" : "none" }}>
              <Box id={"upper-result"} style={{ position: "relative", width: "60%", height: "100%", mt: -2, pl: 8, pb: 5, boxSizing: "border-box" }}>
                <Box style={{ position: "absolute", height: "calc(100% - 145px)", top: 55, left: 15, ml: 5 }}>
                  <Slider
                    getAriaLabel={() => 'ABC'}
                    value={[gradeB, gradeA]}
                    min={0}
                    max={100}
                    marks
                    orientation="vertical"
                    disableSwap
                    step={5}
                    valueLabelDisplay="on"
                    onChange={gradeAbcChange}
                    aria-labelledby="input-slider"
                  // scale={x => -x}
                  />
                </Box>
                <HeatMap size={[width, height]}
                  name="heatMapAmt"
                  select_handler={selectHandler}
                  reload_status={reloadStatus.reload}
                  reload_setter={setReloadStatus}
                  targetCol="pct_rank_amt"
                  yAxisName="PCT_RANK"
                  gradeA={Math.abs(getValues('gradeA'))}
                  gradeB={Math.abs(getValues('gradeB'))}
                  gradeX={getValues('gradeX')}
                  gradeY={getValues('gradeY')}
                  gradeZ={covValue[1] - 0.1}
                  cov_min={covValue[0]}
                  targets={targets}
                  tabValue={tabValue}
                  dates={[dates.startDate, dates.endDate]}
                />
                <Box style={{ position: "absolute", width: "calc(100% - 225px)", bottom: 20, left: 125 }}>
                  <Slider
                    getAriaLabel={() => 'XYZ'}
                    value={[gradeX, gradeY]}
                    min={covValue[0]}
                    max={covValue[1]}
                    marks
                    disableSwap
                    step={0.1}
                    valueLabelDisplay="on"
                    onChange={gradeXyzChange}
                    aria-labelledby="input-slider"
                  />
                </Box>
              </Box>
              <Box style={{ position: "relative", width: "40%" }}>
                <AbcXyzBox data={[abcXyzCnt[0]]}
                  ratioData={abcXyzRatio}
                  yAxisName="heatMapAmt"
                  tabValue={tabValue} />
              </Box>
            </Box>
            <Box style={{ height: "100%", display: tabValue === "heatMapQty" ? "flex" : "none" }}>
              <Box id={"upper-result"} style={{ position: "relative", width: "60%", height: "100%", mt: -2, pl: 8, pb: 5, boxSizing: "border-box" }}>
                <Box style={{ position: "absolute", height: "calc(100% - 145px)", top: 55, left: 15, ml: 5 }}>
                  <Slider
                    getAriaLabel={() => 'ABC'}
                    value={[gradeB, gradeA]}
                    min={0}
                    max={100}
                    marks
                    orientation="vertical"
                    disableSwap
                    step={5}
                    valueLabelDisplay="on"
                    onChange={gradeAbcChange}
                    aria-labelledby="input-slider"
                  // scale={x => -x}
                  />
                </Box>
                <HeatMap size={[width, height]}
                  name="heatMapQty"
                  select_handler={selectHandler}
                  reload_status={reloadStatus.reload}
                  reload_setter={setReloadStatus}
                  targetCol="pct_rank_qty"
                  yAxisName="PCT_RANK"
                  gradeA={Math.abs(getValues('gradeA'))}
                  gradeB={Math.abs(getValues('gradeB'))}
                  gradeX={getValues('gradeX')}
                  gradeY={getValues('gradeY')}
                  gradeZ={covValue[1] - 0.1}
                  cov_min={covValue[0]}
                  targets={targets}
                  tabValue={tabValue}
                  dates={[dates.startDate, dates.endDate]} />
                <Box style={{ position: "absolute", width: "calc(100% - 225px)", bottom: 20, left: 125 }}>
                  <Slider
                    getAriaLabel={() => 'XYZ'}
                    value={[gradeX, gradeY]}
                    min={covValue[0]}
                    max={covValue[1]}
                    marks
                    disableSwap
                    step={0.1}
                    valueLabelDisplay="on"
                    onChange={gradeXyzChange}
                    aria-labelledby="input-slider"
                  />
                </Box>
              </Box>
              <Box style={{ position: "relative", width: "40%" }}>
                <AbcXyzBox data={[abcXyzCnt[0]]}
                  ratioData={abcXyzRatio}
                  yAxisName="heatMapQty"
                  tabValue={tabValue} />
              </Box>
            </Box>
            <Box style={{ height: "100%", display: tabValue === "heatMapFillRate" ? "flex" : "none" }}>
              <Box id={"upper-result"} style={{ position: "relative", width: "60%", height: "100%", mt: -2, pl: 8, pb: 5, boxSizing: "border-box" }}>
                <Box style={{ position: "absolute", height: "calc(100% - 145px)", top: 55, left: 15, ml: 5 }}>
                  <Slider
                    getAriaLabel={() => 'ABC'}
                    value={[gradeB, gradeA]}
                    min={0}
                    max={100}
                    marks
                    orientation="vertical"
                    disableSwap
                    step={5}
                    valueLabelDisplay="on"
                    onChange={gradeAbcChange}
                    aria-labelledby="input-slider"
                  // scale={x => -x}
                  />
                </Box>
                <HeatMap size={[width, height]}
                  name="heatMapFillRate"
                  select_handler={selectHandler}
                  reload_status={reloadStatus.reload}
                  reload_setter={setReloadStatus}
                  targetCol="fill_rate"
                  yAxisName="TXN_FREQ_RATE"
                  gradeA={Math.abs(getValues('gradeA'))}
                  gradeB={Math.abs(getValues('gradeB'))}
                  gradeX={getValues('gradeX')}
                  gradeY={getValues('gradeY')}
                  gradeZ={covValue[1] - 0.1}
                  cov_min={covValue[0]}
                  targets={targets}
                  tabValue={tabValue}
                  dates={[dates.startDate, dates.endDate]} />
                <Box style={{ position: "absolute", width: "calc(100% - 225px)", bottom: 20, left: 125 }}>
                  <Slider
                    getAriaLabel={() => 'XYZ'}
                    value={[gradeX, gradeY]}
                    min={covValue[0]}
                    max={covValue[1]}
                    marks
                    disableSwap
                    step={0.1}
                    valueLabelDisplay="on"
                    onChange={gradeXyzChange}
                    aria-labelledby="input-slider"
                  />
                </Box>
              </Box>
              <Box style={{ position: "relative", width: "40%" }}>
                <AbcXyzBox data={[abcXyzCnt[0]]}
                  ratioData={abcXyzRatio}
                  yAxisName="heatMapFillRate"
                  tabValue={tabValue} />
              </Box>
            </Box>
          </Box>
          <Box>
            <ButtonArea>
              <RightButtonArea>
                <CommonButton type="text" title={transLangKey("SAVE_TARGETS")} onClick={() => { saveData(); }}>
                </CommonButton>
              </RightButtonArea>
            </ButtonArea>
            <Box style={{ height: "calc(100% - 41px)" }}>
              <BaseGrid id="grid1" items={baseGridItems} ></BaseGrid>
            </Box>
          </Box>
        </ResultArea>
        <Box>
          <Paging
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            setCurrentPage={setCurrentPage} />
        </Box>
      </ContentInner>
    </>
  );
}

export default AbcAnalysis;