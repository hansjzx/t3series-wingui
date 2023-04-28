import React, { useEffect,useState } from 'react';
import { useForm } from "react-hook-form";
import { useLocation, useHistory } from "react-router-dom";
import { Box } from "@mui/material";
import { 
  ButtonArea, ContentInner, SearchArea, SearchRow, ResultArea, useViewStore,
  BaseGrid, TreeGrid, InputField, zAxios
} from '@zionex/wingui-core/src/common/imports';
import { setNoneEditableGrid, setGridComboList, fpCommonStyles } from "../../common/common";
import { transLangKey } from "@wingui";

import '../../common/common.css';

const bomItemGridFilters = ['itemCd', 'itemNm', "itemClassCd"];
const bomItemGridItems = [
  { name: "id", dataType: "text", headerText: "ID", visible: false, editable: false, width: 50, textAlignment: "center" },
  { name: "itemCd", dataType: "text", headerText: "FP_ITEM_CD", visible: true, editable: false, width: 150, autoFilter: true  },
  { name: "itemNm", dataType: "text", headerText: "FP_ITEM_NM", visible: true, editable: false, width: 200, autoFilter: true  },
  { name: "itemClassCd", dataType: "text", headerText: "FP_ITEM_CLASS_CD", visible: true, editable: false, width: 95, textAlignment: "center", lookupDisplay: true, autoFilter: true},
  { name: "itemUom", dataType: "text", headerText: "FP_ITEM_UOM", visible: true, editable: false, width: 95, textAlignment: "center" },
];

const bomTreeGridItems = [
  { name: "icon", dataType: "text", headerText: "FP_ICON", visible: false, editable: false, width: 50 },
  { name: "level", dataType: "text", headerText: "FP_LEVEL", visible: true, editable: false, width: 150 },
  { name: "itemCode", dataType: "text", headerText: "FP_ITEM_CD", visible: true, editable: false, width: 150 },
  { name: "itemName", dataType: "text", headerText: "FP_ITEM_NM", visible: true, editable: false, width: 200 },
  { name: "itemClassCode", dataType: "text", headerText: "FP_ITEM_CLASS_CD", visible: true, editable: false, width: 80, textAlignment: "center", lookupDisplay: true },
  { name: "itemUom", dataType: "text", headerText: "FP_ITEM_UOM", visible: true, editable: false, width: 100, textAlignment: "center"},
  { name: "bomRate", dataType: "number", headerText: "FP_BOM_RATE", visible: true, editable: false, width: 100, format : "#,##0.0####" },
  { name: "productRate", dataType: "number", headerText: "FP_PRODUCT_RATE", visible: true, editable: false, width: 100, format : "#,##0.0####" }
];

function Bom() {
  const location = useLocation();
  const history = useHistory();
  const { control, getValues, setValue } = useForm({
    defaultValues: {
      itemParam: '',
      rowItemCode: '',
      searchMethod: 'forward',
      itemClassCodeMap: {}
    }
  });

  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [bomItemGrid, setBomItemGrid] = useState(null);
  const [bomTreeGrid, setBomTreeGrid] = useState(null);

  const [bomItemTitle, setBomItemTitle] = useState('');

  const [forwardDisable, setForwardDisable] = useState(false);
  const [forwardSelect, setForwardSelect] = useState(true);
  const [backwardDisable, setBackwardDisable] = useState(true);
  const [backwardSelect, setBackwardSelect] = useState(false);
  const globalButtons = [
    {
      name: "search",
      action: () => loadItem(),
      visible: true,
      disable: false
    }
  ];

  useEffect(() => {
    loadItemClassCode('FP_ITEM_CLASS_CD');
  }, []);

  useEffect(() => {
    setBomTreeGrid(getViewInfo(vom.active, 'bomTreeGrid'));
    setBomItemGrid(getViewInfo(vom.active, 'bomItemGrid'));
  }, [viewData]);

  useEffect(() => {
    if (bomTreeGrid) {
      setNoneEditableGrid(bomTreeGrid);
      setGridOptions(bomTreeGrid.gridView);
    }
  }, [bomTreeGrid]);

  useEffect(() => {
    if (bomItemGrid) {
      setViewInfo(vom.active, 'globalButtons', globalButtons);
      setNoneEditableGrid(bomItemGrid);
      setGridOptions(bomItemGrid.gridView);
      bomItemGrid.gridView.setDisplayOptions({ fitStyle: "evenFill" });
      if (!location.state) {
        loadItem();
      }
    }
  }, [bomItemGrid]);

  useEffect(() => {
    if (location.state !== undefined && location.state !== null && bomItemGrid && bomTreeGrid) {
      if (location.state.paramType === 'ITEM') {
        setValue('itemParam', location.state.paramCode);
        loadItem();
        history.replace({ state: null });
      }
    }
  }, [location, bomItemGrid, bomTreeGrid])

  function setGridOptions(gridView) {

    if (gridView.id === 'bomTreeGrid') {
      setGridComboList(gridView, 'itemClassCode', 'FP_ITEM_CLASS_CD');

      gridView.setTreeOptions({
        iconImagesRoot: "images/icons/",
        iconImages: [ "cube_yellow_24.png", "gear_24.png", "cpu.png" ]
      });
    } else if (gridView.id === 'bomItemGrid') {
      setGridComboList(gridView, 'itemClassCd', 'FP_ITEM_CLASS_CD');
      gridView.onCellClicked = function (grid, clickData) {
        if (clickData.cellType !== 'gridEmpty') {
          itemGridRowClick();
        }
      }
    }
  }

  function onParamKeyPress(event) {
    if (event.key === "Enter") {
      loadItem();
    }
  }

  function loadItemClassCode(codeGroupCd) {
    zAxios.get(baseURI() + 'factoryplan/codes', {
      params: { 'code-group-cd': codeGroupCd },
      waitOn: false
    })
    .then(function (response) {
      const codeMap = response.data.reduce((map, data) => {
        map[data.codeCd] = transLangKey(data.codeGroupCd + '_' + data.codeCd);
        return map;
      }, {});

      setValue('itemClassCodeMap', codeMap);
    })
    .catch(function (err) {
      console.log(err);
    })
  }

  function clearAllFilters(gridView) {
    if (gridView.id === 'inventoryGrid') {
      bomItemGridFilters.forEach(value => {
        gridView.activateAllColumnFilters(value, false);
      })
    }
  }

  function loadItem() {
    clearAllFilters(bomItemGrid.gridView);

    let searchParam = getValues('itemParam');
    if (location.state !== undefined && location.state !== null) {
      if (location.state.paramType === 'ITEM') {
        searchParam = location.state.paramCode;
      }
    }

    bomTreeGrid.dataProvider.clearRows();

    bomItemGrid.gridView.commit(true);
    bomItemGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    zAxios.get(baseURI() + 'factoryplan/items', {
      params: {
        'search': searchParam
      }
    })
    .then(function (res) {
      bomItemGrid.dataProvider.fillJsonData(res.data);
      if (res.data.length > 0) {
        bomItemGrid.gridView.setCurrent({ itemIndex: 0, column: 'itemCd' }, true);
        itemGridRowClick();
      }
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      bomItemGrid.gridView.hideToast();
    });
  }

  function itemGridRowClick() {
    const gridView = bomItemGrid.gridView;
    let itemCode = gridView.getValue(gridView.getCurrent().itemIndex, 'itemCd');
    let itemName = gridView.getValue(gridView.getCurrent().itemIndex, 'itemNm');
    let itemClassCode = gridView.getValue(gridView.getCurrent().itemIndex, 'itemClassCd');
    let itemUom = gridView.getValue(gridView.getCurrent().itemIndex, 'itemUom');

    setValue('rowItemCode', itemCode);

    setRadioButton(itemClassCode);
    setBomTitleText(itemCode, itemName, itemClassCode, itemUom);

    loadBom();
  }

  function loadBom() {
    bomTreeGrid.gridView.commit(true);
    bomTreeGrid.gridView.showToast(progressSpinner + 'Load Data...', true);

    let url = 'factoryplan/master/bom/bomtree';

    if (getValues('searchMethod') === 'backward') {
      url = 'factoryplan/master/bom/bomtree/reverse';
    }

    zAxios.get(baseURI() + url, {
      params: {
        'search': getValues('rowItemCode')
      }
    })
    .then(function (res) {
      const data = res.data;
      bomTreeGrid.dataProvider.setObjectRows({ 'children': data }, 'children', '', 'icon');
    })
    .catch(function (err) {
      console.log(err);
    })
    .then(function () {
      bomTreeGrid.gridView.hideToast();
      bomTreeGrid.gridView.expandAll();
    });
  }


  function setBomTitleText(itemCode, itemName, itemClassCode, itemUom) {
    const itemClassCodeMap = getValues('itemClassCodeMap');

    let title = '';

    title += transLangKey('FP_ITEM') + ' : ';
    title += itemCode;
    title += ' (';
    title += itemName;
    title += ', ';
    title += itemClassCodeMap[itemClassCode];
    title += ', ';
    title += itemUom;
    title += ')';

    setBomItemTitle(title);

  }

  function setRadioButton(itemClassCd) {
    if (itemClassCd === 'M') {
      setForwardDisable(true);
      setBackwardDisable(false);

      setForwardSelect(false);
      setBackwardSelect(true);

      setValue('searchMethod','backward');

    } else if (itemClassCd === 'P') {
      setForwardDisable(false);
      setBackwardDisable(true);

      setForwardSelect(true);
      setBackwardSelect(false);

      setValue('searchMethod','forward');
    } else {
      setForwardDisable(false);
      setBackwardDisable(false);

      setForwardSelect(true);
      setBackwardSelect(false);

      setValue('searchMethod','forward');
    }
  }

  function searchOptionChangeHandler(event) {
    setValue('searchMethod', event.target.value);

    if (getValues('searchMethod') === 'forward') {
      setForwardSelect(true);
      setBackwardSelect(false);
    } else {
      setForwardSelect(false);
      setBackwardSelect(true);
    }

    loadBom();
  }

  return (

    <ContentInner>
      <SearchArea>
        <SearchRow>
          <InputField control={control} label={transLangKey("FP_ITEM")} name="itemParam" onKeyPress={onParamKeyPress}></InputField>
        </SearchRow>
      </SearchArea>
      <ResultArea sizes={[50, 100]} direction={"horizontal"}>
        <Box sx={fpCommonStyles.splitArea}>
          <ButtonArea title={transLangKey('FP_ITEM')} />
          <BaseGrid id="bomItemGrid" items={bomItemGridItems} className="white-skin" />
        </Box>
        <Box sx={fpCommonStyles.splitArea}>
          <ButtonArea title={transLangKey('FP_BOM')} />
          <Box sx={{ mx: "12px", mb: "5px"}}>
            <div className="row align-items-center border bg-light text-dark" style={{ height: '55px' }}>
              <div className="col ps-4 fw-bold" style={{ fontSize: '15px' }}>
                {bomItemTitle}
              </div>
              <div className="col pe-4 col-md-auto fw-bold" style={{ fontSize: '15px' }}>
                <div className="form-check form-check-inline mb-0">
                  <input className="form-check-input" checked={forwardSelect} disabled={forwardDisable} type="radio" name="searchOptions" id="optionForward" value="forward" onChange={searchOptionChangeHandler} />
                  <label className="form-check-label" htmlFor="optionForward">{transLangKey('FP_BOM_FORWARD')}</label>
                </div>
                <div className="form-check form-check-inline mb-0">
                  <input className="form-check-input" checked={backwardSelect} disabled={backwardDisable} type="radio" name="searchOptions" id="optionBackward" value="backward" onChange={searchOptionChangeHandler} />
                  <label className="form-check-label" htmlFor="optionBackward">{transLangKey('FP_BOM_BACKWARD')}</label>
                </div>
              </div>
            </div>
          </Box>
          <TreeGrid id="bomTreeGrid" items={bomTreeGridItems} className="white-skin" />
        </Box>
      </ResultArea>
    </ContentInner>
  )
}

export default Bom;
