import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { BaseGrid,ContentInner, SearchArea, SearchRow, ButtonArea, LeftButtonArea, GridExcelExportButton, InputField, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import PopSimulationVersion from '@wingui/view/masterplan/common/PopSimulationVersion';
import PopCommAccount from '@wingui/view//supplychainmodel/common/PopCommAccount';
import ItemSearchBox from '@wingui/view//supplychainmodel/common/ItemSearchBox';
import PopPlanProblem from './PopPlanProblem';

let gridProblemAnalysisColumns = [
  { name: 'ORD_ID', dataType: 'text', headerText: 'ORD_ID', visible: true, editable: false, width: '100' },
  { name: 'ACCOUNT_CD', dataType: 'text', headerText: 'ACCOUNT_CD', visible: true, editable: false, width: '100' },
  { name: 'ACCOUNT_NM', dataType: 'text', headerText: 'ACCOUNT_NM', visible: true, editable: false, width: '100' },
  { name: 'ATTR_01', dataType: 'text', headerText: 'ATTR_01', visible: false, editable: false, width: '100' },
  { name: 'ATTR_02', dataType: 'text', headerText: 'ATTR_02', visible: false, editable: false, width: '100' },
  { name: 'ITEM_CD', dataType: 'text', headerText: 'ITEM_CD', visible: true, editable: false, width: '100' },
  { name: 'ITEM_NM', dataType: 'text', headerText: 'ITEM_NM', visible: true, editable: false, width: '100' },
  { name: 'ITEM_TP_NM', dataType: 'text', headerText: 'ITEM_TP_NM', visible: true, editable: false, width: '100' },
  { name: 'VER_ORD_ID', dataType: 'text', headerText: 'VER_ORD_ID', visible: true, editable: false, width: '100' },
  { name: 'SIMUL_VER_ID', dataType: 'text', headerText: 'SIMUL_VER_ID', visible: true, editable: false, width: '100' },
  { name: 'TYPE_ORD_ID', dataType: 'text', headerText: 'TYPE_ORD_ID', visible: true, editable: false, width: '100' },
  { name: 'PROBLEM_TYPE', dataType: 'text', headerText: 'PROBLEM_TYPE', visible: true, editable: false, width: '100', lang: true },
  { name: 'CATEGORY', dataType: 'text', headerText: 'CATEGORY', visible: true, editable: false, width: '100', lang: true },
  { name: 'DAT2', dataType: 'number', headerText: 'DAT2', visible: true, editable: false, width: '100', iteration : { "prefix": "DAT2_", "prefixRemove": "true", "delimiter": "," } }
];

function ProblemAnalysis() {
  const [gridProblemAnalysis, setGridProblemAnalysis] = useState(null);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);

  const [simulationVersionPopupOpen, setSimulationVersionPopupOpen] = useState(false);
  const [simulationVersionFlag, setSimulationVersionFlag] = useState(false);
  const [accountPopupOpen, setAccountPopupOpen] = useState(false);
  const [planProblemPopupOpen, setPlanProblemPopupOpen] = useState(false);

  const itemSearchBoxRef = useRef();
  const [currentItemRef, setCurrentItemRef] = useState();

  const { reset, watch, getValues, setValue, control } = useForm({
    defaultValues: {
      moduleCd: 'MP',
      simulationVersion: '',
      versionCmpChk: [''],
      cmpVersion: '',
      accountCd: '',
      accountNm: '',
      fromDate: '',
      toDate: '',
      
      popupData: {
        versionId: '',
        accountCd: '',
        itemCd: '',
        problemTp: '',
        problemNm: ''
      }
    }
  });

  const globalButtons = [
    { name: 'search', action: (e) => { onSubmit() }, visible: true, disable: false },
    { name: 'refresh', action: (e) => { refresh() }, visible: true, disable: false }
  ];

  const exportOptions = {
    headerDepth: 1,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  };

  const versionCmpChkPoint = watch('versionCmpChk');

  useEffect(() => { setValue('cmpVersion', ''); }, [versionCmpChkPoint]);

  useEffect(() => {
    const grdObj = getViewInfo(vom.active, 'gridProblemAnalysis');

    if (grdObj) {
      if (grdObj.dataProvider) {
        if (gridProblemAnalysis !== grdObj) {
          setGridProblemAnalysis(grdObj);
        }
      }
    }

    if (itemSearchBoxRef) {
      if (itemSearchBoxRef.current) {
        setCurrentItemRef(itemSearchBoxRef.current);
      }
    }
  }, [viewData]);

  useEffect(() => {
    async function  initLoad() {
      setViewInfo(vom.active, 'globalButtons', globalButtons);
      
      if (gridProblemAnalysis) {
        await loadRecentSimulationVersion();
        await loadDefaultDate();
        await loadMpProblemAnalysis();
      }
    }

    initLoad();
  }, [gridProblemAnalysis]);

  function setOptionsGridProblemAnalysis() {
    setVisibleProps(gridProblemAnalysis, true, false, false);

    gridProblemAnalysis.gridView.setDisplayOptions({ fitStyle: 'fill' });

    gridProblemAnalysis.gridView.setColumnProperty("ACCOUNT_CD", "mergeRule", { criteria: "value" });

    let columnArr = ["ACCOUNT_NM", "ITEM_CD", "ITEM_NM", "SIMUL_VER_ID", "PROBLEM_TYPE"];
    for (let i = 0; i < columnArr.length; i++) {
      gridProblemAnalysis.gridView.setColumnProperty(columnArr[i], "mergeRule", {
        criteria: "prevvalues + values[ '" + columnArr[i] + "' ]"
      });
    }

    wingui.util.grid.sorter.orderBy(gridProblemAnalysis.gridView, ["ORD_ID", "ACCOUNT_CD", "ACCOUNT_NM", "ATTR_01", "ATTR_02", "ITEM_CD", "ITEM_NM", "ITEM_TP_NM", "VER_ORD_ID", "SIMUL_VER_ID", "TYPE_ORD_ID", "PROBLEM_TYPE"]);

    gridProblemAnalysis.gridView.setCellStyleCallback(function (grid, dataCell) {
      if (dataCell.index.column.name === 'CATEGORY') {
        return {style:{background: '#EEEEEE'}}
      }

      return {style:{background: '#FFFFFF'}}
    });

    gridProblemAnalysis.gridView.onCellDblClicked = function (grid, index) {
      if (index.cellType && index.cellType === 'data') {
        let data = gridProblemAnalysis.dataProvider.getOutputRow(null, index.dataRow);

        setValue('popupData', {
          versionId: getValues('simulationVersion'),
          accountCd: data.ACCOUNT_CD,
          itemCd: data.ITEM_CD,
          problemTp: data.PROBLEM_TYPE,
          problemNm: transLangKey(data.CATEGORY).toUpperCase().replace(/ /g,"")
        });

        if (data.CATEGORY !== 'PB_TOTAL') {
          setPlanProblemPopupOpen(true);
        }
      }
    };
  }

  function onSubmit() {
    loadMpProblemAnalysis();
  };

  function refresh() {
    reset();

    async function  initLoad() {
      await loadRecentSimulationVersion();
      await loadDefaultDate();
    }

    initLoad();
    gridProblemAnalysis.dataProvider.clearRows();
  }

  function loadRecentSimulationVersion() {
    let param = new URLSearchParams();

    param.append('MENU_ID', 'UI_MP_34');

    return zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_COMM_DEFAULT_VER',
      data: param
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          setValue('simulationVersion', res.data.RESULT_DATA[0].SIMUL_VER_ID);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function loadDefaultDate() {
    let param = new URLSearchParams();

    param.append('TYPE', 'PLAN_HORIZON');
    param.append('SIMUL_VER_ID', getValues('simulationVersion'));

    return zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_COMM_DEFAULT_DATE',
      data: param
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          setValue('fromDate', res.data.RESULT_DATA[0].MIN_DATE);
          setValue('toDate', res.data.RESULT_DATA[0].MAX_DATE);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function openSimulationVersionPopup() {
    setSimulationVersionPopupOpen(true);
  }

  function closeSimulationVersionPopup() {
    setSimulationVersionPopupOpen(false);
  }

  function setSimulationVersion(data) {
    if (simulationVersionFlag) {
      setValue('cmpVersion', data.SIMUL_VER);
    } else {
      setValue('simulationVersion', data.SIMUL_VER);
      setSimulationVersionFlag(false);
    }
  }

  function openCmpVersionPopup() {
    setSimulationVersionFlag(true);
    openSimulationVersionPopup();
  }

  function openAccountPopup() {
    setAccountPopupOpen(true);
  }

  function closeAccountPopup() {
    setAccountPopupOpen(false);
  }

  function setAccount(data) {
    setValue('accountCd', data.ACCOUNT_CD);
    setValue('accountNm', data.ACCOUNT_NM);
  }

  function loadMpProblemAnalysis() {
    let params = new URLSearchParams();

    params.append('VERSION_ID', getValues('simulationVersion'));
    params.append('VERSION_CMP_CHK', getValues('versionCmpChk').join("")  === 'Y' ? true : false);
    params.append('CMP_VERSION_ID', getValues('cmpVersion'));
    params.append('ACCOUNT_CD', getValues('accountCd'));
    params.append('ACCOUNT_NM', getValues('accountNm'));
    params.append('ITEM_CD', currentItemRef.getItemCode());
    params.append('ITEM_NM', currentItemRef.getItemName());
    params.append('ITEM_TP_NM', currentItemRef.getItemType());
    params.append('FROM_DATE', getValues('fromDate'));
    params.append('TO_DATE', getValues('toDate'));
    params.append('CROSSTAB', JSON.stringify(gridProblemAnalysis.gridView.crossTabInfo));

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/GetProblemAnalysis',
      data: params
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          gridProblemAnalysis.setData(res.data.RESULT_DATA);
        }
      })
      .catch(function (err) {
        console.log(err);
      })
      .then(function () {
        setOptionsGridProblemAnalysis();
      });
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <InputField type='action' name='simulationVersion' label={transLangKey('SIMUL_VER_SHORTN')} title={transLangKey('SEARCH')} onClick={openSimulationVersionPopup} control={control} style={{ width: '210px' }}>
              <Icon.Search />
            </InputField>
            <InputField type='check' name='versionCmpChk' label='' control={control} options={[{ label: transLangKey('PLAN_CMP') + ' ' + transLangKey('PRE_VER'), value: 'Y' }]} />
            <InputField type='action' name='cmpVersion' label={transLangKey('SIMUL_VER_SHORTN')} title={transLangKey('SEARCH')} onClick={openCmpVersionPopup} control={control} disabled={getValues('versionCmpChk').length === 1} style={{ width: '210px' }}>
              <Icon.Search />
            </InputField>
            <InputField type='action' name='accountCd' label={transLangKey('ACCOUNT_CD')} title={transLangKey('SEARCH')} onClick={openAccountPopup} control={control}>
              <Icon.Search />
            </InputField>
            <InputField name="accountNm" label={transLangKey("ACCOUNT_NM")} control={control} />
            <ItemSearchBox ref={itemSearchBoxRef} keyValue={'itemCode'} placeHolder={transLangKey('ITEM_CD')} />
            <InputField name='fromDate' type='datetime' label={transLangKey('STRT_DATE')} dateformat="yyyy-MM-dd" control={control}/>
            <InputField name='toDate' type='datetime' label={transLangKey('END_DATE')} dateformat="yyyy-MM-dd" control={control}/>
          </SearchRow>
        </SearchArea>

        <ButtonArea>
          <LeftButtonArea>
            <GridExcelExportButton type='icon' grid='gridProblemAnalysis' options={exportOptions} />
          </LeftButtonArea>
        </ButtonArea>
        <BaseGrid id='gridProblemAnalysis' items={gridProblemAnalysisColumns} viewCd='UI_MP_34' gridCd='UI_MP_34-RST_CPT_01' />
      </ContentInner>

      <PopSimulationVersion open={simulationVersionPopupOpen} onClose={closeSimulationVersionPopup} confirm={setSimulationVersion} module={getValues('moduleCd')} />
      <PopCommAccount open={accountPopupOpen} onClose={closeAccountPopup} confirm={setAccount} />
      <PopPlanProblem open={planProblemPopupOpen} onClose={() => { setPlanProblemPopupOpen(false) }} param={getValues('popupData')} />
    </>
  )
}

export default ProblemAnalysis;
