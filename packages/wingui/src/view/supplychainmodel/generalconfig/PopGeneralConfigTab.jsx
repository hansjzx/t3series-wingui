import React, { useState, useEffect } from 'react';
import { Box, IconButton, Tab, Tabs } from '@mui/material';
import { BaseGrid, ButtonArea, GridAddRowButton, GridDeleteRowButton, PopupDialog, RightButtonArea, useIconStyles, useViewStore, useUserStore, zAxios } from '@zionex/wingui-core/src/common/imports';

import config from './generalConfigConst.js';

function PopGeneralConfigTab(props) {
  const [tabGridSalesVolume, setTabGridSalesVolume] = useState(null);
  const [tabGridSales, setTabGridSales] = useState(null);
  const [tabGridCalculationStandard, setTabGridCalculationStandard] = useState(null);
  const [popupTitle, setPopupTitle] = useState('');
  const [popupWidth, setPopupWidth] = useState(0);
  const [popupHeight, setPopupHeight] = useState(0);
  const [tabValue, setTabValue] = React.useState('1');
  const iconClasses = useIconStyles();
  const [username] = useUserStore(state => [state.username]);
  const [viewData, getViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo])

  const configObj = config.confList[props.confKey] ? config.confList[props.confKey] :
  {
    "insert_row": false,
    "remove_row": false,
    "width": 400,
    "height": 400,
    "title": 'Not found Configuration ID',
    configObjNot: true
  };

  useEffect(() => {
    setPopupTitle(configObj.title ? configObj.title : 'POP_UI_CM_01_' + props.confKey.replace(/(^0+)/, ''));
    setPopupWidth(configObj.width);
    setPopupHeight(configObj.height);
  }, [props.confKey]);

  useEffect(() => {
    if (props.confKey !== '305') {
      return;
    }

    async function initLoad() {
      if (configObj.lookupArr) {
        await setGridComboLoad(tabGridCalculationStandard, configObj.lookupArr);
      }

      popupLoadData(tabGridSalesVolume);
      popupLoadData(tabGridSales);
      popupLoadData(tabGridCalculationStandard);
    }

    if (tabGridSalesVolume && tabGridSales && tabGridCalculationStandard && configObj) {
      initLoad();
    }
  }, [tabGridSalesVolume, tabGridSales, tabGridCalculationStandard, configObj]);

  function afterGridSalesVolume(gridObj) {
    setTabGridSalesVolume(gridObj);
    setGridOptions(gridObj);
  }

  function afterGridSales(gridObj) {
    setTabGridSales(gridObj);
    setGridOptions(gridObj);
  }

  function afterGridCalculationStandard(gridObj) {
    setTabGridCalculationStandard(gridObj);
    setGridOptions(gridObj);
  }

  const setGridOptions = (targetGrid) => {
    setVisibleProps(targetGrid, true, true, false);
    targetGrid.gridView.displayOptions.fitStyle = 'fill';
    targetGrid.gridView.orderBy(['LOCAT_TP_NM', 'LOCAT_LV','LOCAT_CD'], ['ascending','ascending','ascending']);
  }

  const tabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  function setGridComboLoad(targetGrid, codeList) {
    let param = new FormData()

    param.append('CODE', (codeList.map(code => code.code)).toString())

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_CM_CODE',
      data: param,
      fromPopup: true
    })
    .then(function (res) {
      if (res.status === gHttpStatus.SUCCESS) {
        let rComboListData = res.data.RESULT_DATA;

        codeList.map(function (code) {
          const groups = rComboListData.filter((data) => data.GROUP === code.code);
          if (groups) {
            targetGrid.gridView.setColumnProperty(code.name, 'lookupData', {
              value: 'ID',
              label: 'CD_NM',
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

  function popupLoadData(grid) {
    let tabIndex = '';

    switch (grid.gridView.id) {
      case 'tabGridSalesVolume':
        tabIndex = '1';
        break;
      case 'tabGridSales':
        tabIndex = '2';
        break;
      case 'tabGridCalculationStandard':
        tabIndex = '3';
        break;
    }

    let param = new FormData();

    param.append('CONF_KEY', props.confKey);
    param.append('MODULE_CD', '');
    param.append('VIEW_ID', '');
    param.append('TAB_INDEX', tabIndex);

    zAxios({
      method: 'post',
      url: baseURI() + configObj.loadUrl,
      data: param,
      fromPopup: true
    })
    .then(function (res) {
      grid.dataProvider.fillJsonData(res.data.RESULT_DATA);
    })
    .catch(function (err) {
      console.log(err);
    });
  }

  function saveData(grid) {
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

        changes.forEach(function (row) {
          changeRowData.push(grid.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          let tabIndex = '';

          switch (grid.gridView.id) {
            case 'tabGridSalesVolume':
              tabIndex = '1';
              break;
            case 'tabGridSales':
              tabIndex = '2';
              break;
            case 'tabGridCalculationStandard':
              tabIndex = '3';
              break;
          }

          let param = new FormData();

          param.append('WRK_TYPE', 'SAVE');
          param.append('changes', JSON.stringify(changeRowData));
          param.append('TAB_INDEX', tabIndex);
          param.append('USER_ID', username);

          let url = '';
          if (grid.gridView.id === 'tabGridCalculationStandard') {
            url = baseURI() + 'engine/mp/SRV_UI_IM_05_RST_SAVE_02';
          } else {
            url = baseURI() + 'engine/mp/SRV_UI_IM_05_RST_SAVE_01';
          }

          zAxios({
            method: 'post',
            url: url,
            data: param,
            fromPopup: true
          })
          .then(function (res) {
            if (res.status === gHttpStatus.SUCCESS) {
              if (res.data.RESULT_SUCCESS) {
                let msg = '';

                if (grid.gridView.id === 'tabGridCalculationStandard') {
                  msg = res.data.RESULT_DATA.IM_DATA.SP_UI_IM_01_POP_05_S2_P_RT_MSG;
                } else {
                  msg = res.data.RESULT_DATA.IM_DATA.SP_UI_IM_01_POP_05_S1_P_RT_MSG;
                }

                msg === "MSG_0001" ? popupLoadData(grid) : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg));
              } else {
                showMessage(transLangKey("MSG_CONFIRM"), transLangKey(res.data.RESULT_MESSAGE));
              }
            }
          })
          .catch(function (e) {
            console.error(e);
          });
        }
      }
    });
  }

  function onDelete(grid, deleteRows) {
    let param = new FormData();

    param.append('WRK_TYPE', 'DELETE');
    param.append('changes', JSON.stringify(deleteRows));
    param.append('USER_ID', username);

    let url = '';

    if (grid.gridView.id === 'tabGridCalculationStandard') {
      url = baseURI() + 'engine/mp/SRV_UI_IM_05_RST_SAVE_02';
    } else {
      url = baseURI() + 'engine/mp/SRV_UI_IM_05_RST_SAVE_01';
    }

    if (deleteRows.length > 0) {
      zAxios({
        method: 'post',
        url: url,
        data: param,
        fromPopup: true
      })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          if (res.data.RESULT_SUCCESS) {
            let msg = '';

            if (grid.gridView.id === 'tabGridCalculationStandard') {
              msg = res.data.RESULT_DATA.IM_DATA.SP_UI_IM_01_POP_05_S2_P_RT_MSG;
            } else {
              msg = res.data.RESULT_DATA.IM_DATA.SP_UI_IM_01_POP_05_S1_P_RT_MSG;
            }

            msg === "MSG_0002" ? popupLoadData(grid) : showMessage(transLangKey("MSG_CONFIRM"), transLangKey(msg));
          } else {
            showMessage(transLangKey("MSG_CONFIRM"), transLangKey(res.data.RESULT_MESSAGE));
          }
        }
      })
      .catch(function (e) {
        console.error(e);
      });
    }
  }

  function closePopup(props) {
    props.onClose();
    setTabValue('1');
  }

  return (
    <PopupDialog type="NOBUTTONS" open={props.open} onClose={() => closePopup(props)} title={popupTitle} resizeHeight={configObj.height} resizeWidth={configObj.width}>
      <Tabs value={tabValue} onChange={tabChange} indicatorColor="primary">
        <Tab label={transLangKey("SALES_QTY_BASE_STK_MGMT")} value="1" />
        <Tab label={transLangKey("REVENUE_BASE_STK_MGMT")} value="2" />
        <Tab label={transLangKey("STOCK_GRADE_CAL_TP")} value="3" />
      </Tabs>

      <Box style={{marginTop: '3px', width: '100%', height: '100%'}}>
        <Box sx={{ display: "flex", height: "calc(100% - 65px)", display: tabValue === "1" ? "block" : "none"}}>
          <ButtonArea>
            <RightButtonArea>
              <IconButton onClick={() => { popupLoadData(tabGridSalesVolume) }} title={transLangKey("SEARCH")}><Icon.Search /></IconButton>
              {configObj.insert_row && <GridAddRowButton grid="tabGridSalesVolume" type="icon" />}
              {configObj.remove_row && <GridDeleteRowButton grid="tabGridSalesVolume" type="icon" onDelete={onDelete} style={!configObj.delete_row && { display: "none" }} />}
              <IconButton className={iconClasses.gridIconButton} onClick={() => { saveData(tabGridSalesVolume) }} title={transLangKey("SAVE")} disabled={configObj.configObjNot ? true : false}><Icon.Save /></IconButton>
            </RightButtonArea>
          </ButtonArea>
          <BaseGrid id="tabGridSalesVolume" items={config["popupGrid1Items305_tabGrid1"]} afterGridCreate={afterGridSalesVolume} />
        </Box>

        <Box sx={{ display: "flex", height: "calc(100% - 65px)", display: tabValue === "2" ? "block" : "none"}}>
          <ButtonArea>
            <RightButtonArea>
              <IconButton onClick={() => { popupLoadData(tabGridSales) }} title={transLangKey("SEARCH")}><Icon.Search /></IconButton>
              {configObj.insert_row && <GridAddRowButton grid="tabGridSales" type="icon" />}
              {configObj.remove_row && <GridDeleteRowButton grid="tabGridSales" type="icon" onDelete={onDelete} style={!configObj.delete_row && { display: "none" }} />}
              <IconButton className={iconClasses.gridIconButton} onClick={() => { saveData(tabGridSales) }} title={transLangKey("SAVE")} disabled={configObj.configObjNot ? true : false}><Icon.Save /></IconButton>
            </RightButtonArea>
          </ButtonArea>
          <BaseGrid id="tabGridSales" items={config["popupGrid1Items305_tabGrid2"]} afterGridCreate={afterGridSales} />
        </Box>

        <Box sx={{ display: "flex", height: "calc(100% - 65px)", display: tabValue === "3" ? "block" : "none"}}>
          <ButtonArea>
            <RightButtonArea>
              <IconButton onClick={() => { popupLoadData(tabGridCalculationStandard) }} title={transLangKey("SEARCH")}><Icon.Search /></IconButton>
              {configObj.insert_row && <GridAddRowButton grid="tabGridCalculationStandard" type="icon" />}
              {configObj.remove_row && <GridDeleteRowButton grid="tabGridCalculationStandard" type="icon" onDelete={onDelete} style={!configObj.delete_row && { display: "none" }} />}
              <IconButton className={iconClasses.gridIconButton} onClick={() => { saveData(tabGridCalculationStandard) }} title={transLangKey("SAVE")} disabled={configObj.configObjNot ? true : false}><Icon.Save /></IconButton>
            </RightButtonArea>
          </ButtonArea>
          <BaseGrid id="tabGridCalculationStandard" items={config["popupGrid1Items305_tabGrid3"]} afterGridCreate={afterGridCalculationStandard} />
        </Box>
      </Box>
    </PopupDialog>
  );
}

export default PopGeneralConfigTab;
