import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Box } from '@mui/material';
import { ContentInner, SearchArea, SearchRow, ButtonArea, LeftButtonArea, RightButtonArea, GridExcelExportButton, GridAddRowButton, GridSaveButton,
  GridDeleteRowButton, InputField, BaseGrid, useUserStore, useViewStore, zAxios, CommonButton
} from '@zionex/wingui-core/src/common/imports';
import { useContentStore } from '@zionex/wingui-core/src/store/contentStore'

import PopRouteClassificationNew1 from './PopRouteClassificationNew1';
import PopRouteClassificationNew2 from './PopRouteClassificationNew2';

let gridRouteClassColumns = [
  { name: 'ID', dataType: 'text', headerText: 'ID', visible: false, editable: false, width: '100' },
  { name: 'ROUTE_CLASS_VAL', dataType: 'text', headerText: 'ROUTE_CLASS_VAL', visible: true, editable: false, width: '100' },
  { name: 'DESCRIP', dataType: 'text', headerText: 'DESCRIP', visible: true, editable: true, width: '100' },
  { name: 'JOB_CHANGE_YN', dataType: 'boolean', headerText: 'JOB_CHANGE_YN', visible: true, editable: true, width: '100' },
  { name: 'MAX_OP_RES_YN', dataType: 'boolean', headerText: 'MAX_OP_RES_YN', visible: true, editable: true, width: '100' },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: true, width: '100' },
  { name: 'ATTR_01', dataType: 'text', headerText: 'ITEM_ATTR_01', visible: true, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_02', dataType: 'text', headerText: 'ITEM_ATTR_02', visible: true, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_03', dataType: 'text', headerText: 'ITEM_ATTR_03', visible: true, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_04', dataType: 'text', headerText: 'ITEM_ATTR_04', visible: true, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_05', dataType: 'text', headerText: 'ITEM_ATTR_05', visible: true, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_06', dataType: 'text', headerText: 'ITEM_ATTR_06', visible: false, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_07', dataType: 'text', headerText: 'ITEM_ATTR_07', visible: false, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_08', dataType: 'text', headerText: 'ITEM_ATTR_08', visible: false, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_09', dataType: 'text', headerText: 'ITEM_ATTR_09', visible: false, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_10', dataType: 'text', headerText: 'ITEM_ATTR_10', visible: false, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_11', dataType: 'text', headerText: 'ITEM_ATTR_11', visible: false, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_12', dataType: 'text', headerText: 'ITEM_ATTR_12', visible: false, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_13', dataType: 'text', headerText: 'ITEM_ATTR_13', visible: false, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_14', dataType: 'text', headerText: 'ITEM_ATTR_14', visible: false, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_15', dataType: 'text', headerText: 'ITEM_ATTR_15', visible: false, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_16', dataType: 'text', headerText: 'ITEM_ATTR_16', visible: false, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_17', dataType: 'text', headerText: 'ITEM_ATTR_17', visible: false, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_18', dataType: 'text', headerText: 'ITEM_ATTR_18', visible: false, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_19', dataType: 'text', headerText: 'ITEM_ATTR_19', visible: false, editable: false, width: '100', useDropdown: true, lookupDisplay: true },
  { name: 'ATTR_20', dataType: 'text', headerText: 'ITEM_ATTR_20', visible: false, editable: false, width: '100', useDropdown: true, lookupDisplay: true }
];

let gridRouteGroupColumns = [
  { name: 'ID', dataType: 'text', headerText: 'ID', visible: false, editable: false, width: '100' },
  { name: 'ROUTE_LV_NM', dataType: 'text', headerText: 'ROUTE_LV', visible: false, editable: false, width: '100' },
  { name: 'ROUTE_CLASS_VAL', dataType: 'text', headerText: 'ROUTE_CLASS_VAL', visible: false, editable: false, width: '100' },
  { name: 'DESCRIP', dataType: 'text', headerText: 'DESCRIP', visible: false, editable: false, width: '100' },
  { name: 'USE_ATTR_01', dataType: 'boolean', headerText: 'USE_ATTR_01', visible: false, editable: false, width: '100' },
  { name: 'USE_ATTR_02', dataType: 'boolean', headerText: 'USE_ATTR_02', visible: false, editable: false, width: '100' },
  { name: 'USE_ATTR_03', dataType: 'boolean', headerText: 'USE_ATTR_03', visible: false, editable: false, width: '100' },
  { name: 'USE_ATTR_04', dataType: 'boolean', headerText: 'USE_ATTR_04', visible: false, editable: false, width: '100' },
  { name: 'USE_ATTR_05', dataType: 'boolean', headerText: 'USE_ATTR_05', visible: false, editable: false, width: '100' },
  { name: 'USE_ATTR_06', dataType: 'boolean', headerText: 'USE_ATTR_06', visible: false, editable: false, width: '100' },
  { name: 'USE_ATTR_07', dataType: 'boolean', headerText: 'USE_ATTR_07', visible: false, editable: false, width: '100' },
  { name: 'USE_ATTR_08', dataType: 'boolean', headerText: 'USE_ATTR_08', visible: false, editable: false, width: '100' },
  { name: 'USE_ATTR_09', dataType: 'boolean', headerText: 'USE_ATTR_09', visible: false, editable: false, width: '100' },
  { name: 'USE_ATTR_10', dataType: 'boolean', headerText: 'USE_ATTR_10', visible: false, editable: false, width: '100' },
  { name: 'ATTR_01', dataType: 'text', headerText: 'ITEM_ATTR_01', visible: true, editable: true, width: '100' },
  { name: 'ATTR_02', dataType: 'text', headerText: 'ITEM_ATTR_02', visible: true, editable: true, width: '100' },
  { name: 'ATTR_04', dataType: 'text', headerText: 'ITEM_ATTR_04', visible: false, editable: false, width: '100' },
  { name: 'ATTR_05', dataType: 'text', headerText: 'ITEM_ATTR_05', visible: false, editable: false, width: '100' },
  { name: 'ATTR_03', dataType: 'text', headerText: 'ITEM_ATTR_03', visible: false, editable: false, width: '100' },
  { name: 'ATTR_06', dataType: 'text', headerText: 'ITEM_ATTR_06', visible: false, editable: false, width: '100' },
  { name: 'ATTR_07', dataType: 'text', headerText: 'ITEM_ATTR_07', visible: false, editable: false, width: '100' },
  { name: 'ATTR_08', dataType: 'text', headerText: 'ITEM_ATTR_08', visible: false, editable: false, width: '100' },
  { name: 'ATTR_09', dataType: 'text', headerText: 'ITEM_ATTR_09', visible: false, editable: false, width: '100' },
  { name: 'ATTR_10', dataType: 'text', headerText: 'ITEM_ATTR_10', visible: false, editable: false, width: '100' },
  { name: 'ROUTE_GRP', dataType: 'text', headerText: 'ROUTE_GRP', visible: true, editable: false, width: '100', button: 'action' },
  { name: 'ROUTE_GRP_DESCRIP', dataType: 'text', headerText: 'ROUTE_GRP_DESCRIP', visible: true, editable: true, width: '100' },
  { name: 'ACTV_YN', dataType: 'boolean', headerText: 'ACTV_YN', visible: true, editable: true, width: '100' }
];

function RouteClassification() {
  const [username] = useUserStore(state => [state.username]);
  const languageCode = useContentStore(state => state.languageCode);

  const [gridRouteClass, setGridRouteClass] = useState(null);
  const [gridRouteGroup, setGridRouteGroup] = useState(null);
  const [viewData, getViewInfo, setViewInfo] = useViewStore(state => [state.viewData, state.getViewInfo, state.setViewInfo]);
  const [selectData, setSelectData] = useState({});

  const [routeClassificationNew1PopupOpen, setPopupRouteClassificationNew1] = useState(false);
  const [routeClassificationNew2PopupOpen, setPopupRouteClassificationNew2] = useState(false);

  const { reset, getValues, control } = useForm({
    defaultValues: {
      routeClassVal: '',
      description: ''
    }
  });

  const globalButtons = [
    { name: 'search', action: (e) => { onSubmit() }, visible: true, disable: false },
    { name: 'refresh', action: (e) => { refresh() }, visible: true, disable: false }
  ]

  const exportExceloptions = {
    headerDepth: 1,
    footer: 'default',
    allColumns: true,
    lookupDisplay: true,
    separateRows: false
  };

  useEffect(() => {
    const grdObj1 = getViewInfo(vom.active, 'gridRouteClass');
    const grdObj2 = getViewInfo(vom.active, 'gridRouteGroup');

    if (grdObj1) {
      if (grdObj1.dataProvider) {
        if (gridRouteClass !== grdObj1) {
          setGridRouteClass(grdObj1);
        }
      }
    }

    if (grdObj2) {
      if (grdObj2.dataProvider) {
        if (gridRouteGroup !== grdObj2)
          setGridRouteGroup(grdObj2);
      }
    }
  }, [viewData]);

  useEffect(() => {
    async function initLoad() {
      if (gridRouteClass) {
        setViewInfo(vom.active, 'globalButtons', globalButtons);
        setOptionsGrid1();
        setComboList();

        await loadRouteClass();
      }
    }

    initLoad();
  }, [gridRouteClass]);

  useEffect(() => {
    if (gridRouteGroup) {
      setOptionsGrid2();
    }
  }, [gridRouteGroup]);

  function setOptionsGrid1() {
    setVisibleProps(gridRouteClass, true, true, true);

    gridRouteClass.gridView.setDisplayOptions({ fitStyle: 'fill' });

    gridRouteClass.gridView.setColumnProperty('ROUTE_LV_NM', 'mergeRule', { criteria: 'value' });

    gridRouteClass.gridView.onDataLoadComplated = function () {
      gridRouteClass.gridView.setFocus();
    }

    gridRouteClass.gridView.onCellClicked = function (grid, index) {
      if (index.cellType === "data") {
        if (!(index.editable || (grid.getColumn(index.fieldIndex).renderer.type === 'check' && grid.getColumn(index.fieldIndex).renderer.editable) || grid.getColumn(index.fieldIndex).button === 'action')) {
          let gridRouteClassVal = grid.getValues(index.itemIndex);

          if (gridRouteClassVal != null) {
            setSelectData({
              routeClassMstId: gridRouteClassVal.ID,
              routeClassVal: gridRouteClassVal.ROUTE_CLASS_VAL,
              decrip: gridRouteClassVal.DESCRIP,
              param: 'insert'
            });

            loadRouteGroup(gridRouteClassVal.ID);
          }
        }
      }
    };
  }

  function setOptionsGrid2() {
    setVisibleProps(gridRouteGroup, true, true, true);

    gridRouteGroup.gridView.setDisplayOptions({ fitStyle: 'fill' });

    gridRouteGroup.gridView.columnByName('ROUTE_GRP').buttonVisibility = 'always';

    gridRouteGroup.gridView.onCellButtonClicked = function (grid, index, column) {
      if (column.fieldName === "ROUTE_GRP") {
        openPopupRouteClassificationNew2('update');
      }
    }
  }

  function onSubmit() {
    loadRouteClass();
  }

  function onSubmit2() {
    loadRouteGroup(selectData.routeClassMstId);
  }

  function refresh() {
    setComboList();

    reset();

    gridRouteClass.dataProvider.clearRows();
    gridRouteGroup.dataProvider.clearRows();
  }

  function setComboList() {
    let formData = new FormData();
    formData.append('CONF_KEY', '003');
    formData.append('ROUTE_CLASS', '');
    formData.append('LANG_CD', languageCode);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_ROUTE_CLASS_POP_01_Q',
      data: formData
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          let dataArr = res.data.RESULT_DATA;

          for (let i = 0, len = dataArr.length; i < len; i++) {
            let row = dataArr[i];
            if (row !== null) {
              gridRouteClass.gridView.setColumnProperty(
                row.ATTR_NM,
                "lookupData",
                {
                  value: "ID",
                  label: "CONVN_NM",
                  list: dataArr
                }
              );
            }
          }
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function openPopupRouteClassificationNew1() {
    setPopupRouteClassificationNew1(true);
  }

  function openPopupRouteClassificationNew2(param) {
    gridRouteClass.gridView.commit(true);
  
    let gridRouteClassVal = gridRouteClass.gridView.getValues(gridRouteClass.gridView.getCurrent().itemIndex);
    let gridRouteGroupVal = gridRouteGroup.gridView.getValues(gridRouteGroup.gridView.getCurrent().itemIndex);
    let routeClassDtlId = '';
    let routeGrp = '';
    let routeGrpDescrip = '';
    let actvYn = [''];

    if (param === 'update') {
      routeClassDtlId = gridRouteGroupVal.ID;
      routeGrp = gridRouteGroupVal.ROUTE_GRP;
      routeGrpDescrip = gridRouteGroupVal.ROUTE_GRP_DESCRIP;
      actvYn = ['', 'Y'];
    }

    setSelectData({
      routeClassMstId: gridRouteClassVal.ID,
      routeClassVal: gridRouteClassVal.ROUTE_CLASS_VAL,
      decrip: gridRouteClassVal.DESCRIP,
      routeClassDtlId: routeClassDtlId,
      routeGrp: routeGrp,
      routeGrpDescrip: routeGrpDescrip,
      actvYn: actvYn,
      param: param
    });

    setPopupRouteClassificationNew2(true);
  }

  function loadRouteClass() {
    let formData = new FormData();

    formData.append('ROUTE_CLASS_VAL', getValues('routeClassVal'));
    formData.append('DESCRIP', getValues('description'));

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_ROUTE_CLASS_Q1',
      data: formData
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          gridRouteGroup.dataProvider.clearRows();

          gridRouteClass.setData(res.data.RESULT_DATA);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function saveRouteClass() {
    gridRouteClass.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridRouteClass.dataProvider.getAllStateRows().created,
          gridRouteClass.dataProvider.getAllStateRows().updated,
          gridRouteClass.dataProvider.getAllStateRows().deleted,
          gridRouteClass.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          changeRowData.push(gridRouteClass.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          if (answer) {
            let formData = new FormData();
            formData.append('USER_ID', username);
            formData.append('changes', JSON.stringify(changeRowData));

            zAxios({
              method: 'post',
              url: baseURI() + 'engine/mp/SRV_UI_MP_ROUTE_CLASS_S1',
              data: formData
            })
              .then(function (res) {
                const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_ROUTE_CLASS_S1_P_RT_MSG;
                showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false });

                if (res.status === gHttpStatus.SUCCESS) {
                  loadRouteClass();
                }
              })
              .catch(function (e) {
                console.error(e);
              });
          }
        };
      }
    });
  }

  function deleteRouteClass() {
    let deletes = gridRouteClass.gridView.getCheckedItems();
    let deleteRows = [];

    deletes.forEach(function (row) {
      let rowData = gridRouteClass.dataProvider.getJsonRow(row);

      deleteRows.push(rowData);
    });

    if (deleteRows.length > 0) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5130'), function (answer) {
        if (answer) {
          let formData = new FormData();
  
          formData.append('delete', JSON.stringify(deleteRows));
          formData.append('USER_ID', username);

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_UI_MP_ROUTE_CLASS_D1',
            data: formData
          })
            .then(function (res) {
              const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_ROUTE_CLASS_D1_P_RT_MSG;
              showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false });

              if (res.status === gHttpStatus.SUCCESS) {
                loadRouteClass();
              }
            })
            .catch(function (e) {
              console.error(e);
            });
        }
      });
    } else {
      showMessage(transLangKey('DELETE'), 'No row(s) checked to Delete', { close: false });
    }
  }

  function loadRouteGroup(routeClassMstId) {
    let formData = new FormData();

    formData.append('ROUTE_CLASS_MST_ID', routeClassMstId);

    zAxios({
      method: 'post',
      url: baseURI() + 'engine/mp/SRV_UI_MP_ROUTE_CLASS_Q2',
      data: formData
    })
      .then(function (res) {
        if (res.status === gHttpStatus.SUCCESS) {
          gridRouteGroup.setData(res.data.RESULT_DATA);
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  function saveRouteGroup() {
    gridRouteGroup.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_SAVE'), function (answer) {
      if (answer) {
        let changeRowData = [];
        let changes = [];

        changes = changes.concat(
          gridRouteGroup.dataProvider.getAllStateRows().created,
          gridRouteGroup.dataProvider.getAllStateRows().updated,
          gridRouteGroup.dataProvider.getAllStateRows().deleted,
          gridRouteGroup.dataProvider.getAllStateRows().createAndDeleted
        );

        changes.forEach(function (row) {
          changeRowData.push(gridRouteGroup.dataProvider.getJsonRow(row));
        });

        if (changeRowData.length === 0) {
          showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5039'), { close: false });
        } else {
          let formData = new FormData();

          formData.append('WRK_TYPE', "SAVE");
          formData.append('changes', JSON.stringify(changeRowData));
          formData.append('USER_ID', username);

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_UI_MP_ROUTE_CLASS_S3',
            data: formData
          })
            .then(function (res) {
              const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_ROUTE_CLASS_S3_P_RT_MSG;
              showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false });

              if (res.status === gHttpStatus.SUCCESS) {
                loadRouteGroup(selectData.routeClassMstId);
              }
            })
            .catch(function (e) {
              console.error(e);
            });
        }
      }
    });
  }

  function deleteRouteGroup() {
    let deletes = gridRouteGroup.gridView.getCheckedItems();
    let deleteRows = [];

    deletes.forEach(function (row) {
      let rowData = gridRouteGroup.dataProvider.getJsonRow(row);

      deleteRows.push(rowData);
    });

    if (deleteRows.length > 0) {
      showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5130'), function (answer) {
        if (answer) {
          let formData = new FormData();

          formData.append('WRK_TYPE', "DELETE");
          formData.append('ID', JSON.stringify(deleteRows));

          zAxios({
            method: 'post',
            url: baseURI() + 'engine/mp/SRV_UI_MP_ROUTE_CLASS_S3',
            data: formData
          })
            .then(function (res) {
              const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_ROUTE_CLASS_S3_P_RT_MSG;
              showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false });

              if (res.status === gHttpStatus.SUCCESS) {
                loadRouteGroup(selectData.routeClassMstId);
              }
            })
            .catch(function (e) {
              console.error(e);
            });
        }
      });
    }
  }

  function batchCreateRouteGroup() {
    gridRouteGroup.gridView.commit(true);

    showMessage(transLangKey('MSG_CONFIRM'), transLangKey('MSG_5157'), function (answer) {
      if (answer) {
        let formData = new FormData();

        formData.append('all', JSON.stringify(gridRouteGroup.dataProvider.getJsonRows(0, -1)));
        formData.append('USER_ID', username);

        zAxios({
          method: 'post',
          url: baseURI() + 'engine/mp/SRV_UI_MP_ROUTE_CLASS_BATCH',
          data: formData
        })
          .then(function (res) {
            const msg = res.data.RESULT_DATA.IM_DATA.SP_UI_MP_ROUTE_CLASS_BATCH_P_RT_MSG;
            showMessage(transLangKey('WARNING'), transLangKey(msg), { close: false });

            if (res.status === gHttpStatus.SUCCESS) {
              loadRouteGroup(selectData.routeClassMstId);
            }
          })
          .catch(function (e) {
            console.error(e);
          });
      }
    });
  }

  return (
    <>
      <ContentInner>
        <SearchArea>
          <SearchRow>
            <InputField name='routeClassVal' label={transLangKey('ROUTE_CLASS_VAL')} control={control} />
            <InputField name='description' label={transLangKey('DESCRIP')} control={control} />
          </SearchRow>
        </SearchArea>

        <Box style={{ height: "50%" }}>
          <ButtonArea>
            <LeftButtonArea>
              <GridExcelExportButton type='icon' grid='gridRouteClass' options={exportExceloptions} />
              {/*<GridExcelImportButton type='icon' grid='gridRouteClass' />*/}
            </LeftButtonArea>
            <RightButtonArea>
              <GridAddRowButton type="icon" onClick={() => { openPopupRouteClassificationNew1() }}></GridAddRowButton>
              <GridDeleteRowButton type="icon" onClick={() => { deleteRouteClass() }}></GridDeleteRowButton>
              <GridSaveButton type="icon" onClick={() => { saveRouteClass() }}></GridSaveButton>
            </RightButtonArea>
          </ButtonArea>
          <Box style={{ height: 'calc(100% - 53px)' }}>
            <BaseGrid id='gridRouteClass' items={gridRouteClassColumns} />
          </Box>
        </Box>

        <Box style={{ height: "50%" }}>
          <ButtonArea>
            <LeftButtonArea>
              <CommonButton title={transLangKey("BUNDLE_CREATE")} onClick={() => { batchCreateRouteGroup() }}><Icon.File/></CommonButton>
            </LeftButtonArea>
            <RightButtonArea>
              <GridAddRowButton type="icon" onClick={() => { openPopupRouteClassificationNew2('insert') }}></GridAddRowButton>
              <GridDeleteRowButton type="icon" grid="gridRouteGroup" onClick={() => { deleteRouteGroup() }}></GridDeleteRowButton>
              <GridSaveButton type="icon" onClick={() => { saveRouteGroup() }}></GridSaveButton>
            </RightButtonArea>
          </ButtonArea>
          <Box style={{ height: 'calc(100% - 53px)' }}>
            <BaseGrid id='gridRouteGroup' items={gridRouteGroupColumns} />
          </Box>
        </Box>
      </ContentInner>
      {routeClassificationNew1PopupOpen && (<PopRouteClassificationNew1 open={routeClassificationNew1PopupOpen} onClose={() => { setPopupRouteClassificationNew1(false); }} confirm={onSubmit}></PopRouteClassificationNew1>)}
      {routeClassificationNew2PopupOpen && (<PopRouteClassificationNew2 open={routeClassificationNew2PopupOpen} onClose={() => { setPopupRouteClassificationNew2(false); }} data={selectData} confirm={onSubmit2}></PopRouteClassificationNew2>)}
    </>
  )
}

export default RouteClassification;
