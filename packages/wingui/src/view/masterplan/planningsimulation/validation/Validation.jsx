import React, { useEffect, useState} from 'react';
import { useForm } from "react-hook-form";
import { Box } from "@mui/material";
import { BaseGrid, ButtonArea, ContentInner, InputField, LeftButtonArea, ResultArea, RightButtonArea, SearchArea, zAxios, useViewStore } from '@zionex/wingui-core/src/common/imports';
import { transLangKey } from "@wingui";
import ValidationAccordion from "./ValidationAccordion";

import PopSimulationVersion from '@wingui/view/masterplan/common/PopSimulationVersion';

const modelGridFilters = ['COLUMN_NAME'];

const modelGridItems = [
  { name: "COLUMN_NAME", dataType: "text", headerText: "MP_VALIDATION_DATA_TYPE", visible: true, editable: false, width: 100, textAlignment: "near", autoFilter: true  },
  { name: "COLUMN_VALUE", dataType: "text", headerText: "MP_VALIDATION_INPUT_VALUE", visible: true, editable: false, width: 100, textAlignment: "near" },
  { name: "DESCRIPTION", dataType: "text", headerText: "DESCRIP", visible: true, editable: false, width: 300, textAlignment: "near" }
];

function Validation() {
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [modelGrid, setModelGrid] = useState(null);

  const [simulationVersionPopupOpen, setSimulationVersionPopupOpen] = useState(false);
  const [validationMap, setValidationMap] = useState({});
  const [modelGridTitle, setModelGridTitle] = useState(' ');

  const { getValues, setValue, control } = useForm({
    defaultValues: {
      moduleCd: 'MP',
      simulationVersion: '',
    }
  });

  useEffect(() => {
    async function initLoad() {
      if (modelGrid) {
        setViewInfo(vom.active, 'globalButtons', [
          { name: 'search', action: (e) => { loadValidation(); }, visible: true, disable: false }
        ]);

        await loadSimulationVersion();
        await loadValidation();
      }
    }

    initLoad();
  }, [modelGrid]);

  useEffect(() => {
    setModelGrid(getViewInfo(vom.active, 'modelGrid'))
  }, [viewData]);

  useEffect(() => {
    if (modelGrid) {
      modelGrid.gridView.setFooters({ visible: false });
      modelGrid.gridView.setCheckBar({ visible: false });
      modelGrid.gridView.setStateBar({ visible: false });
      modelGrid.gridView.setDisplayOptions({
        showEmptyMessage: true,
        emptyMessage: transLangKey('MSG_NO_DATA'),
        fitStyle: 'even',
        showChangeMarker: false,
        useFocusClass: true
      });
      modelGrid.gridView.setEditOptions({
        movable: false,
        rowMovable: false
      });
      modelGrid.gridView.setFilteringOptions({
        enabled: true,
        selector: { searchIgnoreCase: true },
        automating: { lookupDisplay: true }
      });
    }
  }, [modelGrid]);

  function openSimulationVersionPopup() {
    setSimulationVersionPopupOpen(true);
  }

  function closeSimulationVersionPopup() {
    setSimulationVersionPopupOpen(false);
  }

  function setSimulationVersion(data) {
    setValue('simulationVersion', data.SIMUL_VER);
  }

  function loadSimulationVersion() {
    let formData = new FormData();

    formData.append('MODULE_CD', getValues('moduleCd'));
    formData.append('MAIN_VER_ID', '');
    formData.append('SIMUL_VER_ID', '');
    formData.append('SIMUL_VER_DESCRIP', '');

    return zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_COMM_SRH_VER_Q',
      data: formData
    })
      .then(function (res) {
        if (res.data.RESULT_SUCCESS) {
          const versionObj = res.data.RESULT_DATA[0];
          setValue('simulationVersion', versionObj.SIMUL_VER);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function clearAllFilters(gridView) {
    if (gridView.id === 'modelGrid') {
      modelGridFilters.forEach(value => {
        gridView.activateAllColumnFilters(value, false);
      })
    }
  }

  function loadValidation() {
    let formData = new FormData();

    setModelGridTitle(' ');
    clearAllFilters(modelGrid.gridView);
    modelGrid.dataProvider.clearRows();

    formData.append('VERSION_ID', getValues('simulationVersion'));

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_MP_DATA_VALIDATION',
      data: formData
    })
    .then(function (res) {
      let dataArr = [];
      if (res.status === gHttpStatus.SUCCESS) {
        dataArr = res.data.RESULT_DATA;

        let resultMap = {};
        setValidationMap({});
        dataArr.forEach((data) => {
          let tableName = data.TABLE_NAME;
          let validationType = data.VALIDATION_TYPE;

          if (resultMap[tableName] === undefined) {
            resultMap[tableName] = {};
            resultMap[tableName].count = 0;
          }

          resultMap[tableName].count++;

          let tableMap = resultMap[tableName];

          if (tableMap[validationType] === undefined) {
            tableMap[validationType] = [];
            tableMap[validationType].count = 0;
          }

          tableMap[validationType].count++;

          let validationList = tableMap[validationType];
          validationList.push(data);
        });
        setValidationMap(resultMap);
      }
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      modelGrid.gridView.hideToast();
    });
  }

  function clickValidationList(modelList, title) {
    setModelGridTitle(title);
    clearAllFilters(modelGrid.gridView);

    modelGrid.dataProvider.clearRows();
    modelGrid.dataProvider.fillJsonData(modelList);
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <Box sx={{ width: "100%" }} style={{ display: "flex" }}>
            <InputField type="action" name="simulationVersion" label={transLangKey("SIMUL_VER")} control={control} onClick={openSimulationVersionPopup} style={{ width: "210px" }}>
              <Icon.Search />
            </InputField>
          </Box>
        </SearchArea>

        <ResultArea sizes={[100, 100]} direction={"horizontal"}>
          <Box sx={{ mx: '5px', maxWidth: '25%' }} style={{ overflow: 'auto' }}>
            <ValidationAccordion data={validationMap} clickValidationList={clickValidationList} />
          </Box>

          <Box sx={{ mx: '5px', width: "100%" }}>
            <ButtonArea title={modelGridTitle}>
              <LeftButtonArea />
              <RightButtonArea />
            </ButtonArea>
            <BaseGrid id="modelGrid" items={modelGridItems} className="white-skin" />
          </Box>
        </ResultArea>
      </ContentInner>

      {simulationVersionPopupOpen && (<PopSimulationVersion open={simulationVersionPopupOpen} onClose={closeSimulationVersionPopup} confirm={setSimulationVersion} module={getValues('moduleCd')} />)}
    </>
  )
}

export default Validation;
