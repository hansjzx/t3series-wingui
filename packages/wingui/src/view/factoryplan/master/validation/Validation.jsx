import React, { useEffect, useState} from 'react';
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { Box } from "@mui/material";
import {
  ButtonArea, ContentInner, SearchArea, SearchRow, ResultArea, LeftButtonArea, RightButtonArea, CommonButton,
  useViewStore, BaseGrid, InputField, zAxios
} from '@zionex/wingui-core/src/common/imports';
import { fpCommonStyles, setNoneEditableGrid } from "../../common/common";
import { transLangKey } from "@wingui";

import ValidationAccordion from "./ValidationAccordion";

import '../../common/common.css';

const modelGridFilters = ['modelCode', 'modelName'];
const emptyModelGridTitle = 'Model Info';

const modelGridItems = [
  { name: "model", dataType: "text", headerText: "FP_MODEL", visible: true, editable: false, width: 150, textAlignment: "near"},
  { name: "modelCode", dataType: "text", headerText: "FP_MODEL_CD", visible: true, editable: false, width: 150, textAlignment: "near", autoFilter: true,
    styleName: "text-column link-column" },
  { name: "modelName", dataType: "text", headerText: "FP_MODEL_NM", visible: true, editable: false, width: 200, textAlignment: "near", autoFilter: true },
  {
    name: "groupAudit", dataType: "group", orientation: "horizontal", headerText: "FP_COL_AUDIT", expandable: true, expanded: false,
    childs: [
      { name: "updatedBy", dataType: "text", headerText: "FP_UPDATED_BY", visible: true, editable: false, width: 80, textAlignment: "center", groupShowMode: "expand" },
      { name: "updatedAt", dataType: "datetime", headerText: "FP_UPDATED_AT", visible: true, editable: false, width: 125, textAlignment: "center", groupShowMode: "always" },
      { name: "createdBy", dataType: "text", headerText: "FP_CREATED_BY", visible: true, editable: false, width: 80, textAlignment: "center", groupShowMode: "expand" },
      { name: "createdAt", dataType: "datetime", headerText: "FP_CREATED_AT", visible: true, editable: false, width: 125, textAlignment: "center", groupShowMode: "expand" },
    ]
  },
];

const modelMenuPath = [
  { model: 'ROUTE', path: '/setting/dataintegration/datafp/bor' },
  { model: 'ITEM', path: '/setting/dataintegration/datafp/bom' },
  { model: 'INVENTORY', path: '/setting/dataintegration/datafp/item' },
  { model: 'WORK_ORDER', path: '/setting/dataintegration/datafp/order' },
  { model: 'SALES_ORDER', path: '/setting/dataintegration/datafp/order' }
];

function Validation() {
  const history = useHistory();
  const { control, getValues } = useForm({
    defaultValues: {
      validationType: '',
    }
  });

  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [modelGrid, setModelGrid] = useState(null);

  const [selectOptions, setSelectOptions] = useState([]);
  const [validationResult, setValidationResult] = useState([])
  const [modelGridTitle, setModelGridTitle] = useState('');
  const globalButtons = [
    {
      name: "search",
      action: () => { runValidation() },
      visible: true,
      disable: false
    }
  ];

  useEffect(() => {
    loadValidationType('FP_VALID_TYPE');
  }, []);

  useEffect(() => {
    setModelGrid(getViewInfo(vom.active, 'modelGrid'))
  }, [viewData]);

  useEffect(() => {
    if (modelGrid) {
      setViewInfo(vom.active, 'globalButtons', globalButtons);
      setNoneEditableGrid(modelGrid);
      setGridOptions(modelGrid.gridView);

      runValidation();
    }
  }, [modelGrid]);



  function setGridOptions(gridView) {
    if (gridView.id === 'modelGrid') {

      gridView.onCellClicked = function (grid, clickData) {
        if (clickData.column === 'modelCode') {
          const modelCode = grid.getValue(clickData.itemIndex, 'modelCode');
          const model = grid.getValue(clickData.itemIndex, 'model');
          const pathObj = modelMenuPath.find(path => path.model === model);
          if (pathObj && pathObj.path) {
            history.push({ pathname: pathObj.path, state: { paramType: model, paramCode: modelCode } });
          }
        }
      }
    }
  }

  function loadValidationType(codeGroupCd) {
    zAxios.get(baseURI() + 'factoryplan/codes', {
      params: { 'code-group-cd': codeGroupCd },
      waitOn: false
    })
    .then(function (response) {
      const result = response.data.reduce((prevList, data) => {
        prevList.push({ label: transLangKey(data.codeCd), value: data.codeCd });
        return prevList;
      }, []);

      setSelectOptions(result);
    })
    .catch(function (err) {
      console.log(err);
    })
  }

  function onParamKeyPress(event) {
    if (event.key === "Enter") {
      runValidation();
    }
  }

  function clearAllFilters(gridView) {
    if (gridView.id === 'modelGrid') {
      modelGridFilters.forEach(value => {
        gridView.activateAllColumnFilters(value, false);
      })
    }
  }

  function runValidation() {
    setModelGridTitle(emptyModelGridTitle);
    modelGrid.dataProvider.clearRows();
    modelGrid.gridView.showToast(progressSpinner + 'Running Validation...', true);

    zAxios.get(baseURI() + 'factoryplan/master/validation/validations', {
      params: {
        'search': getValues('validationType')
      }
    })
    .then(function (res) {
      setValidationResult(res.data);
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      modelGrid.gridView.hideToast();
    });
  }

  function clickValidationList(modelList, title) {
    setModelGridTitle(title || emptyModelGridTitle);
    clearAllFilters(modelGrid.gridView);

    modelGrid.dataProvider.clearRows();
    modelGrid.dataProvider.fillJsonData(modelList);
  }

  return (
    <ContentInner>
      <SearchArea>
        <SearchRow>
          <InputField type="select"  control={control} options={selectOptions} label={transLangKey("FP_VALIDATION_TYPE")} name="validationType" onKeyPress={onParamKeyPress}></InputField>
        </SearchRow>
      </SearchArea>
      <ResultArea sizes={[100, 100]} direction={"horizontal"}>
        <Box sx={fpCommonStyles.splitArea}>
          <ButtonArea>
            <LeftButtonArea>
              <CommonButton type="text" onClick={runValidation}>{transLangKey("FP_RUN_VALIDATION")}</CommonButton>
            </LeftButtonArea>
            <RightButtonArea />
          </ButtonArea>
          <ValidationAccordion data={validationResult} clickValidationList={clickValidationList}/>
        </Box>
        <Box sx={fpCommonStyles.splitArea}>
          <ButtonArea title={modelGridTitle}>
            <LeftButtonArea />
            <RightButtonArea />
          </ButtonArea>
          <BaseGrid id="modelGrid" items={modelGridItems} className="white-skin" />
        </Box>
      </ResultArea>
    </ContentInner>
  )
}

export default Validation;
