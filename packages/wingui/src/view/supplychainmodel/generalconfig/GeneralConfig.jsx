import React, { useState, useEffect  } from 'react';
import { useForm } from 'react-hook-form';
import { useContentStore } from '@zionex/wingui-core/src/store/contentStore';
import { BaseGrid, ContentInner, InputField, ResultArea, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import PopGeneralConfig from './PopGeneralConfig';
import PopGeneralConfigTab from './PopGeneralConfigTab';

let gridConfigColumns = [
  { name: 'MODULE_VAL', dataType: 'text', headerText: 'MODULE_VAL', visible: false, editable: false, width: 50 },
  { name: 'CONF_NM', dataType: 'text', headerText: 'CONF_NM', visible: true, editable: false, width: 150, autoFilter: true },
  { name: 'CONF_KEY', dataType: 'text', headerText: 'CONF_ID', visible: false, editable: false, width: 50 },
  { name: 'DESCRIP', dataType: 'text', headerText: 'DESCRIP', visible: true, editable: false, width: 200, 'displayCallback': function (gridConfig, index, value) { return transLangKey(value); } }
];

function GeneralConfig(props) {
  const [gridConfig, setGridConfig] = useState(null);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo])

  const languageCode = useContentStore(state => state.languageCode);
  const [confKey, setConfKey] = useState('');
  const [moduleCd, setModuleCd] = useState('');
  const [popGeneralConfigOpen, setPopGeneralConfigOpen] = useState(false);
  const [popGeneralConfigTabOpen, setPopGeneralConfigTabOpen] = useState(false);
  const module = props.module ? props.module : 'CM';
  const [moduleOptions, setModuleOptions] = useState([]);

  const { reset, control, getValues, setValue, clearErrors } = useForm({
    defaultValues: {
      moduleVal: module
    }
  });

  const globalButtons = [
    { name: 'search', action: (e) => { loadData() }, visible: false, disable: false },
    { name: 'refresh', action: (e) => { refresh() }, visible: false, disable: false }
  ]

  useEffect(() => {
    const gridObj = getViewInfo( vom.active, 'gridConfig');
    if (gridObj) {
      if (gridObj.dataProvider) {
        setGridConfig(gridObj)
      }
    }
  }, [viewData])

  useEffect(() => {
    setViewInfo(vom.active, 'globalButtons', globalButtons);

    if (gridConfig) {
      setOptions();
      setCombo();
    }
  }, [gridConfig]);

  async function setCombo() {
    await zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_CM_CODE',
      params: {
        'CODE': 'MODULE_CD',
      }
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        let arr = [];
        res.data.RESULT_DATA.forEach(function (data) {
          if (data.CD_NM == module) {
            arr.push({ value : data.CD, label : data.CD_NM });
          }
        });

        setModuleOptions(arr);
        setValue('moduleVal', arr[0].value);
        loadData();
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function refresh() {
    reset();
    gridConfig.dataProvider.clearRows();
  }

  function setOptions() {
    setVisibleProps(gridConfig, true, false, false);
    gridConfig.gridView.displayOptions.fitStyle = 'evenFill';
    wingui.util.grid.sorter.orderBy(gridConfig.gridView, ['MODULE_VAL']);

    gridConfig.gridView.onCellDblClicked = function (gridConfig, clickData) {
      if (clickData.itemIndex !== undefined) {
        let confKey = gridConfig.getValue(clickData.itemIndex, 'CONF_KEY');
        let moduleCd = gridConfig.getValue(clickData.itemIndex, 'MODULE_VAL');

        setConfKey(confKey);
        setModuleCd(moduleCd);

        if (confKey == '305') {
          openPopGeneralConfigTab();
        } else {
          openPopGeneralConfig();
        }
      }
    }
  }

  function loadData() {
    gridConfig.gridView.commit(true);

    zAxios({
      method: 'post',
      header: { 'content-type': 'application/json' },
      url: baseURI() + 'engine/mp/SRV_UI_CM_01_Q',
      params: {
        'MODULE_VAL': getValues('moduleVal') ? getValues('moduleVal') : '',
        'CONF_KEY': '',
        'CONF_NM': '',
        'LOCALE': languageCode
      }
    })
    .then(function (res) {
      gridConfig.dataProvider.fillJsonData(res.data.RESULT_DATA);
    })
    .catch(function (err) {
      console.log(err);
    })
  }

  function openPopGeneralConfig() {
    setPopGeneralConfigOpen(true);
  }

  function closePopGeneralConfig() {
    setPopGeneralConfigOpen(false);
  }

  function openPopGeneralConfigTab() {
    setPopGeneralConfigTabOpen(true);
  }

  const closePopGeneralConfigTab = () => {
    setPopGeneralConfigTabOpen(false);
  }

  return (
    <ContentInner>
      <InputField type="select" name="moduleVal" label={transLangKey("MODULE_VAL")} style={{ display: "none" }} control={control} options={moduleOptions}/>
      <ResultArea sizes={[100]} direction={"vertical"}>
        <BaseGrid id='gridConfig' items={gridConfigColumns} />
      </ResultArea>
      { popGeneralConfigOpen && <PopGeneralConfig open={popGeneralConfigOpen} onClose={() => { closePopGeneralConfig(); }} confKey={confKey} moduleCd={moduleCd} /> }
      { popGeneralConfigTabOpen && <PopGeneralConfigTab open={popGeneralConfigTabOpen} onClose={() => { closePopGeneralConfigTab(); }} confKey={confKey} /> }
    </ContentInner>
  )
}

export default GeneralConfig;
