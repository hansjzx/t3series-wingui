import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IconButton } from '@mui/material';
import { BaseGrid, ButtonArea, GridAddRowButton, GridDeleteRowButton, PopupDialog, ResultArea, RightButtonArea, useIconStyles, useUserStore, useViewStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import PopPlanScenario from './PopPlanScenario';
import config from './generalConfigConst.js';

function PopGeneralConfig(props) {
  const [username] = useUserStore(state => [state.username]);
  const [grid, setGrid] = useState(null);
  const iconClasses = useIconStyles();
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo])
  const [popupTitle, setPopupTitle] = useState('');
  const [popPlanScenarioOpen, setPopPlanScenarioOpen] = useState(false);

  const configObj = config.confList[props.confKey] ? config.confList[props.confKey] :
  {
    "insert_row": false,
    "remove_row": false,
    "width": 400,
    "height": 400,
    "title": 'Not found Configuration ID',
    configObjNot: true
  };

  const { handleSubmit, clearErrors } = useForm({
    defaultValues: { }
  });

  const getItems = (confKey) => {
    return config['popupGrid1Items' + confKey] ? config['popupGrid1Items' + confKey] : [];
  }

  useEffect(() => {
    setPopupTitle(configObj.title ? configObj.title : props.confKey.startsWith('0') ? 'POP_UI_CM_01_' + (props.confKey).substring(1) : 'POP_UI_CM_01_' + props.confKey);
  }, [configObj]);

  useEffect(() => {
    async function initLoad() {
      if (configObj.lookupArr) {
        await setGridComboLoad(grid, configObj.lookupArr);
      }

      popupLoadData();
    }

    if (grid && configObj) {
      initLoad();
    }
  }, [grid, configObj]);

  function afterGridCreate(gridObj) {
    setGrid(gridObj);
    setGridOptions(gridObj);
  }

  function setGridOptions(gridObj) {
    setVisibleProps(gridObj, true, true, configObj.remove_row);

    gridObj.gridView.displayOptions.fitStyle = 'fill';

    let columns = gridObj.gridView.getColumnNames(false);

    if (columns.includes('PRIORT')) {
      gridObj.gridView.orderBy(['PRIORT'], ['ascending']);
    }

    if (columns.includes('INCOTERMS')) {
      gridObj.gridView.orderBy(['INCOTERMS'], ['ascending']);
    }

    if (columns.includes('LOCAT_TP_NM') && columns.includes('LOCAT_LV') && columns.includes('LOCAT_CD')) {
      gridObj.gridView.orderBy(['LOCAT_TP_NM', 'LOCAT_LV', 'LOCAT_CD'], ['ascending', 'ascending', 'ascending']);
    }

    if (columns.includes('RES_GRP_CD')) {
      gridObj.gridView.orderBy(['RES_GRP_CD'], ['ascending']);
    }

    gridObj.gridView.onCellButtonClicked = function (grid, itemIndex, column) {
      if (column.fieldName === 'SNRIO_VER_ID') {
        openPopPlanScenario();
      }
    }

    gridObj.gridView.onCellEdited = function (grid, itemIndex, dataRow, field) {
      let dataProvider = grid.getDataSource();
      let fieldName = dataProvider.getOrgFieldName(field);
      let editedValue = dataProvider.getValue(dataRow, fieldName);
      let rows = dataProvider.getOutputRows({}, 0, -1);

      if (props.confKey === '317') {
        if (fieldName === 'PRIM' || fieldName === 'SECOND') {
          grid.commit();

          for (let i = 0; i < rows.length; i++) {
            if (i !== dataRow) {
              if (editedValue) {
                dataProvider.setValue(i, field, false);
              }
            }
          }
        }
      }
    };

    gridObj.gridView.onCellClicked = function (grid, index, itemIndex) {
      if (index.cellType && index.cellType === 'data') {
        if (grid.getValues(index.itemIndex).DEFAT_VAL) {
          var dataProvider = grid.getDataSource();
          let data = dataProvider.getJsonRows(0, -1).map((x)=> {
            return x.DEFAT_VAL;
          });
          let rowIndex = data.findIndex((e) => e === true);

          if (rowIndex !== -1) {
            grid.commit(true);
            dataProvider.setValue(rowIndex, 'DEFAT_VAL', false);
          }
        }
      }
    }

    if (props.confKey === '301') {
      gridObj.gridView.setFixedOptions({ colCount: 2, resizable: true });

      gridObj.gridView.setColumnProperty('STRT_TIME', 'editor', {
        mask: {
          definitions: { "b": "[0-2]", "c": "[0-3]", "d": "[0-5]", "e": "[0-9]" },
          editMask: "bc:de",
          includedFormat: true,
          overWrite: true,
          allowEmpty: true
        }
      });
      gridObj.gridView.setColumnProperty('STRT_TIME', 'textFormat', "([0-9]{2})([0-9]{2});$1:$2");
    } else if (props.confKey === '303') {
      gridObj.gridView.setFixedOptions({ colCount: 3, resizable: true });
    }
  }

  const onError = (errors, e) => {
    if (typeof errors !== 'undefined' && Object.keys(errors).length > 0) {
      $.each(errors, function (key, value) {
        showMessage(transLangKey('WARNING'), `[${value.ref.name}] ${value.message}`);
        clearErrors();
        return false;
      });
    }
  }

  function setGridComboLoad(gridObj, codeList) {
    let codeArr = codeList.map(code => code.code);
    let set = new Set(codeArr);
    let uniqueArr = [...set];

    let formData = new FormData()

    formData.append('CODE', (uniqueArr).toString());

    return zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_CM_CODE',
      data: formData
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        let rComboListData = res.data.RESULT_DATA;

        codeList.map(function (code) {
          const groups = rComboListData.filter((data) => data.GROUP === code.code);
          if (groups) {
            gridObj.gridView.setColumnProperty(code.name, 'lookupData', {
              value: code.value ? code.value : 'ID',
              label: code.label ? code.label : 'CD_NM',
              list: groups
            });
          }
        });
      }
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function popupLoadData() {
    let param = new FormData();

    param.append('CONF_KEY', props.confKey);
    param.append('MODULE_CD', '');
    param.append('VIEW_ID', '');

    if (configObj.loadParams) {
      configObj.loadParams.map(function (loadParam) {
        param.set(loadParam.name, loadParam.value);
      });
    }

    if (props.confKey === '301') {
      param.set('MODULE_CD', props.moduleCd);
    }

    let url = '';
    if (configObj.loadUrl) {
      url = baseURI() + configObj.loadUrl;
    } else {
      url = baseURI() + 'engine/mp/SRV_UI_CM_01_POP_01_Q'
    }

    zAxios({
      method: 'post',
      url: url,
      data: param,
      fromPopup: true
    })
    .then(function (res) {
      grid.setData(res.data.RESULT_DATA);
    })
    .catch(function (err) {
      console.log(err);
    })
  }

  function saveData() {
    grid.gridView.commit(true);
    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          grid.dataProvider.getAllStateRows().created,
          grid.dataProvider.getAllStateRows().updated,
          grid.dataProvider.getAllStateRows().deleted,
          grid.dataProvider.getAllStateRows().createAndDeleted
        );

        let targetFields = [];
        grid.dataProvider.getFields().forEach(function(field){
          if(field._dataType === 'datetime') {
            targetFields.push(field._fieldName);
          }
        });

        changes.forEach(function (row) {
          let data = grid.dataProvider.getJsonRow(row);
          targetFields.forEach(function(field){
            data[field] = new Date(data[field]).format('yyyy-MM-ddT00:00:00');
          });

          changeRowData.push(data);
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          let formData = new FormData();
          formData.append('USER_ID', username);
          formData.append('changes', JSON.stringify(changeRowData));
          formData.append('WRK_TYPE', 'SAVE');

          if (configObj.saveParams) {
            configObj.saveParams.map(function (param) {
              formData.append(param.name, param.value);
            });
          }

          let url = '';
          if (configObj.saveUrl) {
            url = baseURI() + configObj.saveUrl;
          } else {
            url = baseURI() + 'engine/mp/SRV_UI_CM_01_POP_' + (props.confKey.startsWith('0') ? (props.confKey).substring(1) + '_S' : props.confKey + '_S')
          }
          zAxios({
            method: 'post',
            url: url,
            data: formData
          })
            .then(function (res) {
              let message = Object.entries(res.data.RESULT_DATA.IM_DATA).filter(([key, value]) => key.includes('RT_MSG')).map(([key, value]) => value)[0];
              showMessage(transLangKey('MSG_CONFIRM'), transLangKey(message), { close: false });

              if (res.status === gHttpStatus.SUCCESS) {
                popupLoadData();
              }
            })
            .catch(function (e) {
              console.error(e);
            });
        }
      }
    });
  }

  function onDelete(targetGrid, deleteRows) {
    let formData = new FormData();
    formData.append('USER_ID', username);
    formData.append('WRK_TYPE', 'DELETE');
    formData.append('changes', JSON.stringify(deleteRows));

    if (configObj.saveParams) {
      configObj.saveParams.map(function (param) {
        formData.append(param.name, param.value);
      });
    }

    let url = '';
    if (configObj.saveUrl) {
      url = baseURI() + configObj.saveUrl;
    } else {
      url = baseURI() + 'engine/mp/SRV_UI_CM_01_POP_' + (props.confKey.startsWith('0') ? (props.confKey).substring(1) + '_S' : props.confKey + '_S')
    }

    if (deleteRows.length > 0) {
      zAxios({
        method: 'post',
        url: url,
        data: formData
      }).
      then(function () {
        popupLoadData()
      })
      .catch(function (e) {
        console.error(e);
      });
    }
  }

  function saveSubmit() {
    let focusCell = grid.gridView.getCurrent();
    let targetRow = focusCell.dataRow;
    props.confirm(grid.dataProvider.getJsonRow(targetRow));
    props.onClose(false);
  }

  function setPlanScenario(records) {
    let itemIndex = grid.gridView.getCurrent().dataRow;
    grid.dataProvider.setValue(itemIndex, 'PLAN_SNRIO_MGMT_MST_ID', records.MST_ID)
    grid.dataProvider.setValue(itemIndex, 'MODULE_NM', records.MODULE_NM)
    grid.dataProvider.setValue(itemIndex, 'SNRIO_VER_ID', records.SNRIO_VER_ID)
    grid.dataProvider.setValue(itemIndex, 'SNRIO_DESCRIP', records.DESCRIP)
    grid.gridView.setCurrent({ itemIndex: itemIndex });
    grid.gridView.commit(true);
  }

  function openPopPlanScenario() {
    setPopPlanScenarioOpen(true);
  }

  function closePopPlanScenario() {
    setPopPlanScenarioOpen(false);
  }

  return (
    <>
      <PopupDialog type="NOBUTTONS" open={props.open} onClose={props.onClose} onSubmit={handleSubmit(saveSubmit, onError)} title={popupTitle}
          resizeHeight={configObj.height} resizeWidth={configObj.width} maxHeight={"80vh"}>
        <ButtonArea>
          <RightButtonArea>
            <IconButton onClick={() => { popupLoadData() }} title={transLangKey("SEARCH")}><Icon.Search /></IconButton>
            {configObj.insert_row && <GridAddRowButton grid={`${props.id}_PopGeneralConfigGrid`} type="icon" />}
            {configObj.remove_row && <GridDeleteRowButton grid={`${props.id}_PopGeneralConfigGrid`} type="icon" onDelete={onDelete} style={!configObj.delete_row && { display: "none" }} />}
            <IconButton className={iconClasses.gridIconButton} onClick={() => { saveData() }} title={transLangKey("SAVE")} disabled={configObj.configObjNot ? true : false}><Icon.Save /></IconButton>
          </RightButtonArea>
        </ButtonArea>
        <ResultArea>
          { configObj.configObjNot ? "해당 설정키의 정보가 없습니다." : <BaseGrid id={`${props.id}_PopGeneralConfigGrid`} items={getItems(props.confKey)} afterGridCreate={afterGridCreate} /> }
        </ResultArea>
      </PopupDialog>

      <PopPlanScenario open={popPlanScenarioOpen} onClose={() => closePopPlanScenario()} confirm={setPlanScenario} moduleId={props.moduleCd} />
    </>
  );
}

export default PopGeneralConfig;
